import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {Shell,Narration,P,ease,Eyebrow,clipSeconds,SoundCue} from '../Shared';
import {MoneyTokens} from './MoneyTokens';

export const MathRise=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const d=clipSeconds('math-rise');
 const amount=interpolate(f,[d*.53*fps,d*.75*fps],[0,20],ease);
 return <Shell subject="Mathematical reasoning" step="03 / TEST IT" title="Twenty percent of $100.">
  <div style={{position:'absolute',left:110,top:285}}><Eyebrow color={P.mint}>FIVE GROUPS. ADD ONE MORE.</Eyebrow><div style={{fontSize:136,fontWeight:750,letterSpacing:-6,marginTop:3}}>$100 <span style={{color:P.mint,opacity:amount/20}}>+ $20</span></div></div>
  <MoneyTokens mode="rise"/>
  <SoundCue at={d*.53} type="move"/>
  <div style={{position:'absolute',right:110,top:750,fontSize:86,fontWeight:750,color:P.mint}}>${Math.round(100+amount)}</div>
  <Narration id="math-rise"/>
 </Shell>;
};
