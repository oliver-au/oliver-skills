import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {clipSeconds,ease,Eyebrow,Narration,P,Shell} from '../Shared';

export const ReadingRule=()=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const time=frame/fps;
 const progress=interpolate(time,[1,4],[0,1],ease);
 return <Shell subject="Reading" step="05 / TAKE IT WITH YOU" title="Read between the lines. Stay near them.">
  <div style={{position:'absolute',left:160,top:365,width:570,textAlign:'center'}}><Eyebrow>START HERE</Eyebrow><div style={{fontSize:82,fontWeight:750,letterSpacing:-3,lineHeight:1.2,marginTop:29}}>Text clues</div><div style={{fontSize:35,color:P.muted,marginTop:25}}>What does the passage say?</div></div>
  <svg width="330" height="100" style={{position:'absolute',left:795,top:425}}><path d="M0 50H300M275 25L300 50L275 75" fill="none" stroke={P.mint} strokeWidth="4" pathLength="1" strokeDasharray="1" strokeDashoffset={1-progress}/></svg>
  <div style={{position:'absolute',left:1140,top:365,width:670,textAlign:'center',opacity:interpolate(time,[2.5,3.5],[.25,1],ease)}}><Eyebrow color={P.mint}>INFER</Eyebrow><div style={{fontSize:82,fontWeight:750,letterSpacing:-3,lineHeight:1.2,marginTop:29,whiteSpace:'nowrap'}}>Likely meaning</div><div style={{fontSize:35,color:P.muted,marginTop:25}}>What do those clues suggest?</div></div>
  <div style={{position:'absolute',left:250,right:250,top:690,borderTop:`1px solid ${P.line}`,paddingTop:40,textAlign:'center',fontSize:58,fontWeight:600,opacity:interpolate(time,[clipSeconds('reading-rule')*.27,clipSeconds('reading-rule')*.27+.8],[0,1],ease)}}><span style={{color:P.mint}}>Well supported</span><span style={{color:P.muted,margin:'0 35px'}}>≠</span>certain</div>
  <Narration id="reading-rule"/>
 </Shell>;
};
