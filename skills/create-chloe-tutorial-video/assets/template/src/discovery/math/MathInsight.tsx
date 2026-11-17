import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {Shell,Narration,P,ease,clipSeconds} from '../Shared';

export const MathInsight=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const d=clipSeconds('math-insight');
 if(f>9.2*fps)return <Shell subject="Mathematical reasoning" step="05 / THE IDEA">
  <div style={{position:'absolute',left:110,top:280,fontSize:45,color:P.muted,letterSpacing:6}}>ALWAYS ASK</div>
  <div style={{position:'absolute',left:100,top:370,fontSize:198,lineHeight:1.05,fontWeight:750,letterSpacing:-9,color:P.cyan,scale:interpolate(f,[9.2*fps,9.9*fps],[1.04,1],ease),transformOrigin:'left center'}}>Percent of what?</div>
  <Narration id="math-insight"/>
 </Shell>;
 return <Shell subject="Mathematical reasoning" step="05 / THE IDEA" title="Same percentage. Different amount.">
  <div style={{position:'absolute',left:110,top:315,fontSize:114,fontWeight:750,letterSpacing:-5}}>$100 <span style={{color:P.muted}}>→</span> $120 <span style={{color:P.muted}}>→</span> <span style={{color:P.red}}>$96</span></div>
  <div style={{position:'absolute',left:110,top:525,display:'flex',gap:60,alignItems:'baseline',fontSize:112,fontWeight:750,letterSpacing:-5}}><span style={{color:P.mint}}>+$20</span><span style={{color:P.red}}>−$24</span><span style={{color:P.muted,fontSize:90}}>=</span><span style={{color:P.red}}>−$4</span></div>
  <div style={{position:'absolute',left:110,top:740,fontSize:56,fontWeight:600,color:P.red,opacity:interpolate(f,[d*.45*fps,d*.6*fps],[0,1],ease)}}>You finish 4% below where you started.</div>
  <Narration id="math-insight"/>
 </Shell>;
};
