import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {Narration,P,Shell} from '../Shared';
import {Note,Triple,Verdict} from './LogicElements';

const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};

export const LogicTest=()=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();
  return <Shell subject="THINKING SKILLS" step="03 / TRY TO BREAK IT" title="Try to break the guess.">
    <Narration id="logic-test"/>
    <Triple values={[3,5,9]} top={360} size={220} start={2.8} gap={0.18}/>
    <div style={{position:'absolute',top:300,left:330,fontSize:29,letterSpacing:4,color:P.cyan,opacity:interpolate(frame,[2.7*fps,3.1*fps],[0,1],clamp)}}>YOUR NEW TEST</div>
    <div style={{position:'absolute',left:0,top:610,width:1920,height:145,
      opacity:interpolate(frame,[4.2*fps,4.5*fps,6.0*fps,6.3*fps],[0,1,1,0],clamp),
    }}>
      <div style={{position:'absolute',left:330,top:25,fontSize:32,color:P.muted,lineHeight:1.3}}>Doubling<br/>would predict</div>
      {[{n:6,x:810},{n:12,x:1290}].map(v=><div key={v.n} style={{position:'absolute',left:v.x,top:0,width:300,textAlign:'center',fontSize:105,fontWeight:600,color:'#7c8589'}}>{v.n}<svg width="220" height="120" viewBox="0 0 220 120" style={{position:'absolute',top:0,left:40}}><path d="M35 98 L185 20" fill="none" stroke={P.red} strokeWidth="5" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={interpolate(frame,[4.8*fps,5.4*fps],[1,0],clamp)}/></svg></div>)}
    </div>
    <Verdict label="STILL FITS" start={6.4} top={650}/>
    <Note start={8.6} top={825}>So “double each time” cannot be my rule.</Note>
  </Shell>;
};
