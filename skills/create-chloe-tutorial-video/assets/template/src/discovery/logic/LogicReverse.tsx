import {Easing,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {Narration,P,Shell,SoundCue} from '../Shared';
import {LinkArrow,Note,Verdict} from './LogicElements';

const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};

/** Match cut from the preceding test: the same outer numbers exchange places. */
export const LogicReverse=()=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();
  const travel=interpolate(frame,[.35*fps,1.9*fps],[0,1],{...clamp,easing:Easing.inOut(Easing.cubic)});
  return <Shell subject="THINKING SKILLS" step="04 / CHANGE DIRECTION" title="Same numbers. Different order.">
    <Narration id="logic-reverse"/>
    <SoundCue at={.45} type="move"/>
    <svg width="1920" height="450" viewBox="0 0 1920 450" style={{position:'absolute',left:0,top:235,opacity:interpolate(frame,[.2*fps,.5*fps,2.1*fps,2.5*fps],[0,.55,.55,0],clamp)}}>
      <path d="M480 220 C640 15,1280 15,1440 220" stroke={P.cyan} strokeWidth="2" strokeDasharray="6 12" fill="none"/>
      <path d="M1440 220 C1280 425,640 425,480 220" stroke={P.cyan} strokeWidth="2" strokeDasharray="6 12" fill="none"/>
    </svg>
    {[{n:3,start:330,end:1290,direction:-1},{n:5,start:810,end:810,direction:0},{n:9,start:1290,end:330,direction:1}].map(v=><div key={v.n} style={{position:'absolute',left:v.start+(v.end-v.start)*travel,top:360+Math.sin(travel*Math.PI)*110*v.direction,width:300,textAlign:'center',fontSize:220,fontWeight:750,lineHeight:1.1,letterSpacing:-10,color:P.ink,
      scale:v.direction===0?1:1+Math.sin(travel*Math.PI)*.08,
    }}>{v.n}</div>)}
    <LinkArrow left={640} top={420} start={2.1} label="−4" colour={P.red}/><LinkArrow left={1120} top={420} start={2.25} label="−2" colour={P.red}/>
    <Verdict label="DOES NOT FIT" good={false} start={3.2} top={650}/>
    <Note top={825} start={4.9}>The direction matters.</Note>
  </Shell>;
};
