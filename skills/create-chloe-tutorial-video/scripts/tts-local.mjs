#!/usr/bin/env node
/** Generate one narration WAV with an already-running local Phonon service. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {parseArgs} from 'node:util';
import {pathToFileURL} from 'node:url';

const RATE=24000;
const localHost=value=>{
  const url=new URL(value);
  if(url.protocol!=='http:'||!['127.0.0.1','localhost','[::1]'].includes(url.hostname)||url.username||url.password){
    throw new Error('Phonon requires an HTTP loopback address without credentials.');
  }
  return url;
};
const wav=pcm=>{
  const header=Buffer.alloc(44);
  header.write('RIFF',0);header.writeUInt32LE(36+pcm.length,4);header.write('WAVE',8);
  header.write('fmt ',12);header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);
  header.writeUInt16LE(1,22);header.writeUInt32LE(RATE,24);header.writeUInt32LE(RATE*2,28);
  header.writeUInt16LE(2,32);header.writeUInt16LE(16,34);header.write('data',36);
  header.writeUInt32LE(pcm.length,40);return Buffer.concat([header,pcm]);
};
function chunks(text){
  const sentences=text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g)||[text];
  const parts=[];let current='';
  for(const sentence of sentences){
    if(sentence.length>3800)throw new Error('Split narration sentences longer than 3,800 characters.');
    if((current+sentence).length>3800){parts.push(current.trim());current='';}
    current+=sentence;
  }
  if(current.trim())parts.push(current.trim());
  return parts;
}
async function writeAtomic(filename,data){
  await fs.mkdir(path.dirname(filename),{recursive:true});
  const temp=`${filename}.${process.pid}.tmp`;
  try{await fs.writeFile(temp,data);await fs.rename(temp,filename);}
  finally{await fs.rm(temp,{force:true});}
}

export async function synthesize({text,out,voice='Easton',model='phonon',host='http://127.0.0.1:11434',overwrite=false}){
  if(typeof text!=='string'||!text.trim()||!out)throw new Error('Non-empty narration text and an output WAV path are required.');
  const endpoint=localHost(host);
  const hash=createHash('sha256').update(JSON.stringify({text,voice,model,host:endpoint.origin,rate:RATE})).digest('hex');
  if(!overwrite){
    try{
      const cached=JSON.parse(await fs.readFile(out+'.cache.json','utf8'));
      const previous=await fs.readFile(out);
      if(cached.hash===hash&&previous.length>44&&previous.toString('ascii',0,4)==='RIFF'&&previous.toString('ascii',36,40)==='data'&&previous.readUInt32LE(24)===RATE&&previous.readUInt32LE(40)===previous.length-44){
        return {duration:(previous.length-44)/(RATE*2),cached:true};
      }
    }catch(error){if(error.code!=='ENOENT'&&!(error instanceof SyntaxError))throw error;}
  }
  const pieces=[];
  for(const part of chunks(text)){
    let response;
    try{
      response=await fetch(new URL('/v1/audio/speech',endpoint),{
        method:'POST',headers:{'Content-Type':'application/json'},redirect:'error',
        body:JSON.stringify({model,voice,input:part,response_format:'pcm'}),
        signal:AbortSignal.timeout(240000),
      });
    }catch(error){throw new Error(`Local narration service unavailable at ${endpoint.origin}. Start the configured service or choose an available narration provider; no final audio was created.`,{cause:error});}
    if(!response.ok)throw new Error(`Local narration service returned HTTP ${response.status}. Verify the installed model and voice.`);
    const pcm=Buffer.from(await response.arrayBuffer());
    if(pcm.length<2||pcm.length%2)throw new Error('The service did not return valid 16-bit mono PCM.');
    if(pieces.length)pieces.push(Buffer.alloc(Math.round(RATE*2*.3)));
    pieces.push(pcm);
  }
  const pcm=Buffer.concat(pieces);
  await writeAtomic(out,wav(pcm));
  await writeAtomic(out+'.cache.json',JSON.stringify({hash})+'\n');
  return {duration:pcm.length/(RATE*2),cached:false};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  try{
    const {values}=parseArgs({options:{text:{type:'string'},out:{type:'string'},voice:{type:'string'},model:{type:'string'},host:{type:'string'},overwrite:{type:'boolean'},help:{type:'boolean'}}});
    if(values.help){console.log('node tts-local.mjs --text "Narration" --out work/narration-raw/hook.wav [--voice Easton] [--model phonon]');}
    else{const result=await synthesize(values);console.log(JSON.stringify({out:values.out,...result}));}
  }catch(error){console.error(error.message);process.exitCode=1;}
}
