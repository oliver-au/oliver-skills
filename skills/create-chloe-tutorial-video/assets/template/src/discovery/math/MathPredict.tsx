import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {Shell,Narration,P,ease,Eyebrow,PauseMeter,clipSeconds} from '../Shared';

export const MathPredict=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <Shell subject="Mathematical reasoning" step="02 / YOUR PREDICTION" title="What is the final price?">
  <div style={{position:'absolute',left:110,top:316,fontSize:64,color:P.muted}}>Start at <span style={{color:P.ink,fontWeight:800}}>$100</span><span style={{margin:'0 40px',color:P.line}}>→</span><span style={{color:P.mint}}>+20%</span><span style={{margin:'0 40px',color:P.line}}>→</span><span style={{color:P.red}}>−20%</span></div>
  <div style={{position:'absolute',left:110,top:500,right:110,display:'flex',gap:60}}>{['$100','$96','$80'].map((a,i)=><div key={a} style={{flex:1,borderTop:`3px solid ${P.line}`,paddingTop:28,opacity:interpolate(f,[fps*(.6+i*.25),fps*(1.1+i*.25)],[0,1],ease)}}><Eyebrow color={P.muted}>{String.fromCharCode(65+i)}</Eyebrow><div style={{fontSize:154,letterSpacing:-7,fontWeight:700,marginTop:10}}>{a}</div></div>)}</div>
  <PauseMeter start={clipSeconds('math-predict')+.3} duration={4}/>
  <Narration id="math-predict"/>
 </Shell>;
};
