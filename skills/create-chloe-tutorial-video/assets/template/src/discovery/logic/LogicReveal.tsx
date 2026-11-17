import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {Narration,P,Shell} from '../Shared';
import {Note} from './LogicElements';

export const LogicReveal=()=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();
  return <Shell subject="THINKING SKILLS" step="05 / THE DISCOVERY" title="My hidden rule:">
    <Narration id="logic-reveal"/>
    <div style={{position:'absolute',left:130,top:300,right:130,textAlign:'center',fontSize:108,fontWeight:700,lineHeight:1.12,letterSpacing:-4,color:P.ink}}>Each number is <span style={{color:P.mint}}>bigger.</span></div>
    <svg width="1500" height="300" viewBox="0 0 1500 300" style={{position:'absolute',left:210,top:480}}>
      <path d="M100 255 H1400" fill="none" stroke={P.line} strokeWidth="2"/>
      <path d="M180 240 L720 170 L1260 100" fill="none" stroke={P.mint} strokeWidth="5" pathLength="1" strokeDasharray="1" strokeDashoffset={interpolate(frame,[1.2*fps,3.7*fps],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}/>
      {[{x:180,y:240,n:3},{x:720,y:170,n:5},{x:1260,y:100,n:9}].map((v,i)=><g key={v.n} opacity={interpolate(frame,[(.8+i*.7)*fps,(1.3+i*.7)*fps],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}><circle cx={v.x} cy={v.y} r="11" fill={P.mint}/><text x={v.x} y={v.y-30} fill={P.ink} textAnchor="middle" fontFamily="Manrope Variable, Arial, sans-serif" fontSize="75" fontWeight="600">{v.n}</text></g>)}
    </svg>
    <Note top={825} start={9.2} colour={P.cyan}>A useful test could prove your guess wrong.</Note>
  </Shell>;
};
