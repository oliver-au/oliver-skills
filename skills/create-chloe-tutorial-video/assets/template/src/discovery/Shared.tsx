import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import type {Caption} from '@remotion/captions';
import '@fontsource-variable/manrope';
import narration from './narration.json';
import readingNarration from './reading-narration.json';
import cubeNarration from './cube-narration.json';
import writingNarration from './writing-narration.json';

export const P = {bg:'#0c1115',ink:'#f3f0e7',muted:'#9ba9ad',red:'#ff6756',mint:'#a6e6c7',cyan:'#7bcce0',line:'#2b393f'};
type Track = {text:string;src:string;duration:number;captions?:Caption[];ready?:boolean};
const tracks={...narration,...readingNarration,...cubeNarration,...writingNarration} as Record<string,Track>;
export const clipSeconds=(id:string)=>{
 const track=tracks[id];
 if(!track||!Number.isFinite(track.duration)||track.duration<=0)throw new Error(`Missing or invalid narration timing: ${id}`);
 return track.duration;
};
export const isNarrationReady=(prefix:string)=>{
 const selected=Object.entries(tracks).filter(([id])=>id.startsWith(prefix));
 return selected.length>0&&selected.every(([,track])=>track.ready===true);
};
export const sceneFrames=(id:string,fps:number,pauseSeconds=1)=>Math.ceil((clipSeconds(id)+.6+pauseSeconds)*fps);
export const ease={extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.22,1,.36,1)} as const;

export const Shell:React.FC<{children:React.ReactNode;subject:string;step:string;title?:string}> = ({children,subject,step,title}) => {
 const frame=useCurrentFrame();const {fps}=useVideoConfig();
 return <AbsoluteFill style={{backgroundColor:P.bg,color:P.ink,fontFamily:'Manrope Variable, Arial, sans-serif',overflow:'hidden'}}>
  <AbsoluteFill style={{backgroundImage:'radial-gradient(ellipse at 85% 10%, #17303866 0%, transparent 55%)'}}/>
  <div style={{position:'absolute',left:110,top:48,display:'flex',gap:18,alignItems:'center'}}><div style={{width:14,height:14,background:P.red}}/><span style={{fontSize:27,fontWeight:800,letterSpacing:5}}>CHLOE</span><span style={{color:P.muted,fontSize:23,marginLeft:12,letterSpacing:3}}>SELECTIVE / {subject.toUpperCase()}</span></div>
  <div style={{position:'absolute',right:110,top:52,fontSize:25,color:P.muted,letterSpacing:3}}>{step}</div>
  {title&&<div style={{position:'absolute',left:110,top:153,fontSize:78,fontWeight:700,letterSpacing:-3,lineHeight:1.1,opacity:interpolate(frame,[0,.45*fps],[0,1],ease),translate:`0 ${interpolate(frame,[0,.6*fps],[18,0],ease)}px`}}>{title}</div>}
  {children}
 </AbsoluteFill>;
};

const CaptionTrack:React.FC<{id:string}>=({id})=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const track=tracks[id];if(!track)return null;
 const time=frame/fps*1000;
 const lines=track.captions??[];
 const current=lines.find(c=>time>=c.startMs&&time<c.endMs);
 return current?<div style={{position:'absolute',bottom:88,left:260,right:260,textAlign:'center',fontSize:35,fontWeight:500,lineHeight:1.35,color:P.ink,background:'#0c1115ed',padding:'12px 26px',borderRadius:5}}>{current.text.trim()}</div>:null;
};

export const Narration:React.FC<{id:string;from?:number}>=({id,from=.3})=>{
 const {fps}=useVideoConfig();const track=tracks[id];
 if(!track)throw new Error(`Missing narration track: ${id}`);
 return <Sequence name={id} from={Math.round(from*fps)} durationInFrames={Math.ceil(track.duration*fps)} premountFor={fps}>
  {track.ready===true?<Audio src={staticFile(track.src)} premountFor={fps}/>:<div style={{position:'absolute',right:110,top:100,fontSize:24,color:P.red,background:P.bg,padding:'8px 14px',border:`1px solid ${P.line}`,borderRadius:4}}>Narration pending · silent draft</div>}
  <CaptionTrack id={id}/>
 </Sequence>;
};

export const SoundCue=({at,type='card',ready=false}:{at:number;type?:'card'|'move'|'reveal';ready?:boolean})=>{
 const {fps}=useVideoConfig();
 // Add the cue file to public/discovery and set ready on its JSX node to enable it.
 if(!ready)return null;
 return <Audio name={`${type} cue`} src={staticFile(`discovery/cue-${type}.wav`)} from={Math.round(at*fps)} volume={.32} premountFor={fps}/>;
};

export const PauseMeter:React.FC<{start:number;duration?:number;label?:string}>=({start,duration=4,label='MAKE YOUR PREDICTION'})=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const time=frame/fps;
 if(time<start||time>=start+duration)return null;
 const left=1-(time-start)/duration;
 return <div style={{position:'absolute',top:840,left:600,width:720,color:P.muted,fontSize:23,letterSpacing:3,textAlign:'center'}}>
  {label}<div style={{height:4,background:P.line,marginTop:18}}><div style={{width:`${left*100}%`,height:4,background:P.cyan}}/></div>
 </div>;
};

export const Eyebrow:React.FC<{children:React.ReactNode;color?:string;style?:React.CSSProperties}>=({children,color=P.cyan,style})=><div style={{fontSize:28,fontWeight:700,letterSpacing:4,textTransform:'uppercase',color,...style}}>{children}</div>;
