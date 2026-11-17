import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {clipSeconds,ease,P} from '../Shared';

/** The same 120 dollar tokens persist while six groups of 20 become five groups of 24. */
export const MoneyTokens=({mode}:{mode:'rise'|'fall'})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const d=clipSeconds(mode==='rise'?'math-rise':'math-fall');
 const regroup=mode==='fall'?interpolate(f,[1.8*fps,4.3*fps],[0,1],ease):0;
 const remove=mode==='fall'?interpolate(f,[10.4*fps,11.8*fps],[0,1],ease):0;
 return <svg width="1920" height="400" viewBox="0 0 1920 400" style={{position:'absolute',left:0,top:480,overflow:'visible'}}>
  {Array.from({length:120},(_,i)=>{
   const g0=Math.floor(i/20),k0=i%20,g1=Math.floor(i/24),k1=i%24;
   const x0=110+g0*240+(k0%4)*42,y0=50+Math.floor(k0/4)*42;
   const x1=110+g1*282+(k1%4)*50,y1=20+Math.floor(k1/4)*40;
   const enters=mode==='rise'&&i>=100?interpolate(f,[(d*.48+(i-100)*.045)*fps,(d*.58+(i-100)*.045)*fps],[0,1],ease):1;
   const last=mode==='fall'&&i>=96;
   return <g key={i} opacity={enters*(last?1-remove*.88:1)}>
    <rect x={x0+(x1-x0)*regroup} y={y0+(y1-y0)*regroup+(1-enters)*55+(last?remove*70:0)} width={34+regroup*8} height="32" rx="3" fill={last?P.red:i>=100?P.mint:P.ink}/>
    <rect x={x0+(x1-x0)*regroup+3} y={y0+(y1-y0)*regroup+3+(1-enters)*55+(last?remove*70:0)} width="4" height="25" fill={P.bg} opacity=".08"/>
   </g>;
  })}
  {mode==='rise'?Array.from({length:6},(_,g)=><text key={g} x={110+g*240+80} y="315" textAnchor="middle" fill={g===5?P.mint:P.muted} fontFamily="Manrope Variable" fontSize="38" opacity={g===5?interpolate(f,[d*.58*fps,d*.72*fps],[0,1],ease):1}>$20</text>):Array.from({length:5},(_,g)=><text key={g} x={110+g*282+96} y={315+(g===4?remove*35:0)} textAnchor="middle" fill={g===4?P.red:P.muted} fontFamily="Manrope Variable" fontSize="38" opacity={interpolate(f,[8.1*fps,8.7*fps],[0,1],ease)*(g===4?1-remove*.45:1)}>$24</text>)}
  <text x="1750" y="90" textAnchor="end" fill={P.muted} fontFamily="Manrope Variable" fontSize="25" letterSpacing="2">EACH TILE</text><text x="1750" y="147" textAnchor="end" fill={P.ink} fontFamily="Manrope Variable" fontSize="48">= $1</text>
 </svg>;
};
