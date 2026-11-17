import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {Shell,Narration,P,ease,PauseMeter,clipSeconds,Eyebrow} from '../Shared';

export const MathPractice=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const answerAt=clipSeconds('math-practice')+4.6;const show=f>=answerAt*fps;
 return <Shell subject="Mathematical reasoning" step="06 / YOUR TURN" title={show?'Same trap. Different price.':'Can you spot the same trap?'}>
  <div style={{position:'absolute',left:110,top:310,fontSize:70,fontWeight:600}}>$200 bicycle <span style={{color:P.mint,marginLeft:40}}>+10%</span><span style={{color:P.muted,margin:'0 35px'}}>then</span><span style={{color:P.red}}>−10%</span></div>
  {!show?<div style={{position:'absolute',left:110,top:520,right:110,display:'flex',gap:60}}>{['$200','$198','$180'].map((a,i)=><div key={a} style={{flex:1,paddingTop:22,borderTop:`3px solid ${P.line}`}}><Eyebrow color={P.muted}>{String.fromCharCode(65+i)}</Eyebrow><div style={{fontSize:145,fontWeight:750,letterSpacing:-7}}>{a}</div></div>)}</div>:<>
   <div style={{position:'absolute',left:110,top:500,fontSize:145,fontWeight:750,letterSpacing:-7,opacity:interpolate(f,[answerAt*fps,(answerAt+.6)*fps],[0,1],ease)}}>$200 <span style={{fontSize:80,color:P.muted}}>→</span> $220 <span style={{fontSize:80,color:P.muted}}>→</span> <span style={{color:P.mint}}>$198</span></div>
   <div style={{position:'absolute',left:110,top:745,fontSize:52,color:P.muted}}>Add <span style={{color:P.mint}}>$20</span>. Then subtract <span style={{color:P.red}}>$22</span>.</div>
  </>}
  <PauseMeter start={clipSeconds('math-practice')+.3} duration={4} label="PAUSE HERE IF YOU NEED MORE TIME"/>
  <Narration id="math-practice"/><Narration id="math-practice-answer" from={answerAt}/>
 </Shell>;
};
