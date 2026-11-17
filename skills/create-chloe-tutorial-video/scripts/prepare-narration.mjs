#!/usr/bin/env node
/** Prepare measured narration and phrase captions for a Chloe lesson project. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {parseArgs} from 'node:util';
import {synthesize} from './tts-local.mjs';

const HELP=`node prepare-narration.mjs --project ./lesson --input ./narration.json
  [--manifest src/discovery/narration.json] [--draft | --prepare-only]
  [--raw-dir work/narration-raw] [--voice Easton] [--model phonon]
  [--host http://127.0.0.1:11434] [--wpm 155]
  [--ffmpeg /path/to/ffmpeg] [--ffprobe /path/to/ffprobe]
Input: {"hook":{"text":"Spoken words"}} or [{"id":"hook","text":"Spoken words"}].
--draft writes estimated timings with ready:false and makes no service calls.
--prepare-only consumes <project>/<raw-dir>/<id>.wav instead of synthesizing.`;
const {values}=parseArgs({options:{
  project:{type:'string'},input:{type:'string'},manifest:{type:'string',default:'src/discovery/narration.json'},
  'raw-dir':{type:'string',default:'work/narration-raw'},draft:{type:'boolean'},'prepare-only':{type:'boolean'},
  voice:{type:'string',default:'Easton'},model:{type:'string',default:'phonon'},host:{type:'string',default:'http://127.0.0.1:11434'},
  wpm:{type:'string',default:'155'},ffmpeg:{type:'string'},ffprobe:{type:'string'},help:{type:'boolean'},
}});
if(values.help){console.log(HELP);process.exit(0);}

function atomicJson(file,value){
  fs.mkdirSync(path.dirname(file),{recursive:true});const tmp=`${file}.${process.pid}.tmp`;
  try{fs.writeFileSync(tmp,JSON.stringify(value,null,2)+'\n');fs.renameSync(tmp,file);}
  finally{fs.rmSync(tmp,{force:true});}
}
function captions(text,duration){
  const phrases=[];
  for(const sentence of text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[text]){
    let line='';
    for(const word of sentence.trim().split(/\s+/)){
      if(word.length>70)throw new Error('A narration word exceeds 70 characters; use speakable text.');
      if(line&&(line+' '+word).length>70){phrases.push(line);line=word;}else line+=(line?' ':'')+word;
    }
    if(line)phrases.push(line);
  }
  const weights=phrases.map(p=>p.split(/\s+/).length),total=weights.reduce((a,b)=>a+b,0);
  const inset=Math.min(100,duration*1000*.05),span=duration*1000-inset*2;let elapsed=0;
  return phrases.map((text,i)=>{
    const startMs=Math.round(inset+elapsed/total*span);elapsed+=weights[i];
    const endMs=Math.round(inset+elapsed/total*span);
    if(endMs<=startMs)throw new Error('Audio is too short for its narration captions.');
    return {text,startMs,endMs,timestampMs:null,confidence:null};
  });
}
function resolveBinary(name,explicit,project){
  const executable=name+(process.platform==='win32'?'.exe':'');
  const candidates=explicit?[explicit.includes('/')||explicit.includes('\\')?path.resolve(explicit):explicit]:[executable];
  if(!explicit){
    const packages=process.platform==='linux'?[`linux-${process.arch}-gnu`,`linux-${process.arch}-musl`]
      :process.platform==='win32'?[`win32-${process.arch}-msvc`]:[`darwin-${process.arch}`];
    const projectRequire=createRequire(path.join(project,'package.json')),resolvers=[projectRequire];
    try{resolvers.push(createRequire(projectRequire.resolve('@remotion/renderer')));}catch{}
    for(const suffix of packages){
      for(const require of resolvers){
        try{candidates.push(path.join(require(`@remotion/compositor-${suffix}`).dir,executable));}catch{}
      }
    }
  }
  for(const command of candidates){
    const absolute=path.isAbsolute(command)?command:null;
    const options={stdio:'ignore',env:{...process.env,...(process.platform==='darwin'&&absolute?{DYLD_LIBRARY_PATH:path.dirname(absolute)}:{})}};
    try{execFileSync(command,['-version'],options);return {command,env:options.env};}catch{}
  }
  throw new Error(`${name} is unavailable. Install it or pass --${name} with its executable path.`);
}
function run(binary,args,encoding){return execFileSync(binary.command,args,{env:binary.env,encoding,maxBuffer:100*1024*1024,stdio:['ignore','pipe','pipe']});}
function probe(binary,file){
  const info=JSON.parse(run(binary,['-v','error','-show_entries','stream=codec_name,codec_type,sample_rate,channels:format=duration','-of','json',file],'utf8'));
  const duration=Number(info.format?.duration);const stream=info.streams?.find(s=>s.codec_type==='audio');
  if(!stream||!Number.isFinite(duration)||duration<=0)throw new Error(`No valid audio duration in ${path.basename(file)}.`);
  return {duration,stream};
}
function audioStats(binary,file){
  const decoded=run(binary,['-v','error','-i',file,'-f','wav','-acodec','pcm_s24le','-ac','1','pipe:1']);
  let offset=12,pcm;
  while(offset+8<=decoded.length){
    const tag=decoded.toString('ascii',offset,offset+4),size=decoded.readUInt32LE(offset+4);
    if(tag==='data'){pcm=decoded.subarray(offset+8,Math.min(decoded.length,offset+8+size));break;}
    offset+=8+size+(size%2);
  }
  if(!pcm?.length||pcm.length%3)throw new Error(`Cannot decode ${path.basename(file)}.`);
  let peak=0,squares=0,clippedSamples=0;
  for(let i=0;i<pcm.length;i+=3){const value=pcm.readIntLE(i,3)/8388608;peak=Math.max(peak,Math.abs(value));squares+=value*value;if(Math.abs(value)>=.9999)clippedSamples++;}
  return {peak,rms:Math.sqrt(squares/(pcm.length/3)),clippedSamples};
}

async function main(){
  if(!values.project||!values.input)throw new Error(HELP);
  if(values.draft&&values['prepare-only'])throw new Error('Choose either --draft or --prepare-only.');
  const wpm=Number(values.wpm);if(!Number.isFinite(wpm)||wpm<80||wpm>250)throw new Error('--wpm must be between 80 and 250.');
  const project=fs.realpathSync(path.resolve(values.project));
  if(!fs.statSync(project).isDirectory())throw new Error('--project must be an existing directory.');
  function inside(relative){
    const target=path.resolve(project,relative);const rel=path.relative(project,target);
    if(rel==='..'||rel.startsWith('..'+path.sep)||path.isAbsolute(rel))throw new Error(`Output path must stay inside the project: ${relative}`);
    let ancestor=target;while(!fs.existsSync(ancestor)){const parent=path.dirname(ancestor);if(parent===ancestor)throw new Error('Cannot resolve output path.');ancestor=parent;}
    const realRel=path.relative(project,fs.realpathSync(ancestor));
    if(realRel==='..'||realRel.startsWith('..'+path.sep)||path.isAbsolute(realRel))throw new Error(`Output symlink leaves the project: ${relative}`);
    return target;
  }
  const manifestPath=inside(values.manifest),rawDir=inside(values['raw-dir']),audioDir=inside('public/discovery');
  const input=JSON.parse(fs.readFileSync(path.resolve(values.input),'utf8'));
  if(!input||typeof input!=='object')throw new Error('Input must be an array or an object keyed by clip ID.');
  const entries=Array.isArray(input)?input:Object.entries(input).map(([id,item])=>({...item,id}));
  if(!entries.length)throw new Error('Input must contain at least one narration clip.');
  const ids=new Set();
  for(const entry of entries){
    if(!entry||typeof entry.id!=='string'||!/^[a-z0-9][a-z0-9_-]{0,79}$/.test(entry.id)||ids.has(entry.id))throw new Error('Clip IDs must be unique lowercase letters, digits, hyphens or underscores (up to 80 characters).');
    if(typeof entry.text!=='string'||!entry.text.trim())throw new Error(`Missing spoken text for ${entry.id}.`);
    ids.add(entry.id);entry.text=entry.text.trim();captions(entry.text,Math.max(1,entry.text.split(/\s+/).length/wpm*60));
  }
  let manifest={};
  if(fs.existsSync(manifestPath)){
    manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
    if(!manifest||Array.isArray(manifest)||typeof manifest!=='object')throw new Error('Existing output manifest must be an object keyed by clip ID.');
  }
  const timing='Approximate phrase timings weighted by word count; not forced-aligned.';
  const metadata=(entry,duration,ready,src)=>{
    const {id,...previous}=entry;
    return {...previous,text:entry.text,src,duration,captions:captions(entry.text,duration),captionTiming:timing,ready,provisional:!ready};
  };
  if(values.draft){
    for(const entry of entries){const duration=Math.ceil(entry.text.split(/\s+/).length/wpm*600)/10;manifest[entry.id]=metadata(entry,duration,false,`discovery/${entry.id}.m4a`);}
    atomicJson(manifestPath,manifest);console.log(`Draft timings written for ${entries.length} clips. Narration is pending.`);return;
  }
  const ffmpeg=resolveBinary('ffmpeg',values.ffmpeg,project),ffprobe=resolveBinary('ffprobe',values.ffprobe,project);
  fs.mkdirSync(rawDir,{recursive:true});fs.mkdirSync(audioDir,{recursive:true});
  const staging=inside(path.join('work',`narration-staging-${randomUUID()}`));fs.mkdirSync(staging,{recursive:true});
  const report=[],prepared=[];
  try{
    for(const entry of entries){
      const source=inside(path.relative(project,path.join(rawDir,entry.id+'.wav')));
      if(!values['prepare-only'])await synthesize({text:entry.text,out:source,voice:values.voice,model:values.model,host:values.host});
      if(!fs.existsSync(source))throw new Error(`Missing raw WAV: ${path.relative(project,source)}.`);
      const raw=probe(ffprobe,source);const words=entry.text.split(/\s+/).length;
      if(audioStats(ffmpeg,source).rms<.00001)throw new Error(`Raw audio is effectively silent: ${entry.id}.`);
      const tempo=Math.max(.72,Math.min(1.15,wpm/(words/raw.duration*60)));
      const fingerprint=createHash('sha256').update(fs.readFileSync(source)).update(String(tempo)).digest('hex').slice(0,12);
      const filename=`${entry.id}-${fingerprint}.m4a`,target=path.join(staging,filename);
      run(ffmpeg,['-y','-hide_banner','-loglevel','error','-i',source,'-af',`atempo=${tempo.toFixed(5)},loudnorm=I=-18:TP=-2:LRA=7,volume=-1dB`,'-ar','24000','-ac','1','-c:a','aac','-b:a','128k','-f','mp4',target]);
      const {duration,stream}=probe(ffprobe,target);
      if(stream.codec_name!=='aac'||stream.channels!==1||Number(stream.sample_rate)!==24000)throw new Error(`Unexpected output format for ${entry.id}.`);
      const {peak,rms,clippedSamples}=audioStats(ffmpeg,target);
      if(clippedSamples||rms<.001)throw new Error(`Audio is clipped or effectively silent: ${entry.id}.`);
      manifest[entry.id]=metadata(entry,duration,true,'discovery/'+filename);
      prepared.push({source:target,destination:inside(path.join('public/discovery',filename))});
      report.push({id:entry.id,duration,words,wpm:words/duration*60,tempo,sampleRate:24000,channels:1,clippedSamples,peakDbFS:20*Math.log10(peak),rmsDbFS:20*Math.log10(rms)});
      console.log(`Prepared ${entry.id}: ${duration.toFixed(2)} seconds, ${(words/duration*60).toFixed(1)} words/minute.`);
    }
    // Content-addressed files keep a previous successful manifest playable until this one is committed.
    for(const file of prepared)fs.renameSync(file.source,file.destination);
    atomicJson(manifestPath,manifest);
    const reportName=`narration-${path.basename(manifestPath,'.json')}-validation.json`;
    atomicJson(inside(path.join('work',reportName)),{passed:true,captionTiming:timing,entries:report});
    console.log(`Ready: ${entries.length} clips, ${report.reduce((sum,item)=>sum+item.duration,0).toFixed(2)} seconds. Manifest: ${path.relative(project,manifestPath)}`);
  }finally{fs.rmSync(staging,{recursive:true,force:true});}
}
try{await main();}catch(error){console.error(error.message);process.exitCode=1;}
