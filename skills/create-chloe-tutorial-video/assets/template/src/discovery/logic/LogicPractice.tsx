import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {clipSeconds,Narration,PauseMeter,P,Shell} from '../Shared';

export const LogicPractice=()=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();
  const answerAt=clipSeconds('logic-practice')+4.6;
  const revealed=frame>=answerAt*fps;
  return <Shell subject="THINKING SKILLS" step="06 / YOUR TURN" title="Which example breaks this claim?">
    <Narration id="logic-practice"/><Narration id="logic-practice-answer" from={answerAt}/>
    <div style={{position:'absolute',top:300,left:150,right:150,textAlign:'center',fontSize:74,fontWeight:650}}>“All squares are <span style={{color:P.cyan}}>blue.</span>”</div>
    {[{x:400,key:'A',label:'Blue square',colour:P.cyan,round:false},{x:850,key:'B',label:'Red circle',colour:P.red,round:true},{x:1300,key:'C',label:'Red square',colour:P.red,round:false}].map((v,i)=><div key={v.key} style={{position:'absolute',left:v.x,top:440,width:220,textAlign:'center',opacity:interpolate(frame,[answerAt*fps,(answerAt+.5)*fps],[1,i===2?1:.22],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>
      <div style={{height:190,width:190,margin:'0 auto',background:v.colour,borderRadius:v.round?'50%':5,scale:interpolate(frame,[(.6+i*.2)*fps,(1.1+i*.2)*fps],[.85,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}/>
      <div style={{fontSize:30,letterSpacing:2,color:P.muted,marginTop:25}}>{v.key}</div><div style={{fontSize:34,color:P.ink,marginTop:9,whiteSpace:'nowrap'}}>{v.label}</div>
    </div>)}
    <svg width="220" height="220" viewBox="0 0 220 220" style={{position:'absolute',left:1300,top:425}}><rect x="3" y="3" width="214" height="214" rx="8" stroke={P.ink} strokeWidth="3" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={interpolate(frame,[answerAt*fps,(answerAt+.7)*fps],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}/></svg>
    {revealed?<div style={{position:'absolute',top:800,left:140,right:140,textAlign:'center',fontSize:48,color:P.mint}}>C · A square that is not blue disproves the claim.</div>:<PauseMeter start={clipSeconds('logic-practice')+.3} duration={4} label="Pause and choose A, B or C"/>}
  </Shell>;
};
