import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {Shell,Narration,P,ease,Eyebrow} from '../Shared';

export const MathHook=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <Shell subject="Mathematical reasoning" step="01 / THE QUESTION">
  <Eyebrow style={{position:'absolute',left:110,top:180}}>THE PERCENTAGE TRAP</Eyebrow>
  <div style={{position:'absolute',left:100,top:265,fontSize:188,fontWeight:800,letterSpacing:-10,lineHeight:1}}>+20<span style={{fontSize:120}}>%</span><span style={{color:P.muted,fontSize:100,margin:'0 50px'}}>then</span><span style={{color:P.red}}>−20<span style={{fontSize:120}}>%</span></span></div>
  <div style={{position:'absolute',left:110,top:530,fontSize:104,fontWeight:600,letterSpacing:-4,lineHeight:1.15,opacity:interpolate(f,[2*fps,2.7*fps],[0,1],ease)}}>Back where you started?</div>
  <svg width="1700" height="180" style={{position:'absolute',left:110,top:690}} viewBox="0 0 1700 180"><path d="M0 130 H330 L660 40 L990 130 H1510" fill="none" stroke={P.line} strokeWidth="3"/><path d="M0 130 H330 L660 40 L990 130" fill="none" stroke={P.cyan} strokeWidth="5" pathLength="1" strokeDasharray="1" strokeDashoffset={interpolate(f,[fps,5*fps],[1,0],ease)}/><circle cx="990" cy="130" r="8" fill={P.red}/><text x="1550" y="145" fill={P.ink} fontSize="84" fontFamily="Manrope Variable">?</text></svg>
  <Narration id="math-hook"/>
 </Shell>;
};
