import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {Shell,Narration,P,ease,Eyebrow,clipSeconds,SoundCue} from '../Shared';
import {MoneyTokens} from './MoneyTokens';

export const MathFall=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const d=clipSeconds('math-fall');
 return <Shell subject="Mathematical reasoning" step="04 / THE SURPRISE" title="Twenty percent of what?">
  <div style={{position:'absolute',left:110,top:285}}><Eyebrow color={P.red}>REGROUP THE SAME $120 INTO FIVE PARTS</Eyebrow><div style={{fontSize:136,fontWeight:750,letterSpacing:-6,marginTop:3}}><span style={{color:P.cyan}}>$120</span> <span style={{color:P.red,opacity:interpolate(f,[8.6*fps,9.1*fps],[0,1],ease)}}>− $24</span></div></div>
  <MoneyTokens mode="fall"/>
  <SoundCue at={1.8} type="move"/><SoundCue at={10.4} type="move"/>
  <div style={{position:'absolute',right:110,top:755,fontSize:88,fontWeight:800,color:P.red,opacity:interpolate(f,[d*.92*fps,d*.97*fps],[0,1],ease)}}>$96</div>
  <Narration id="math-fall"/>
 </Shell>;
};
