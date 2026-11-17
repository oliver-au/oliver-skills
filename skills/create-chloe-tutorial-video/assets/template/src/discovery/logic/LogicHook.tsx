import {Easing,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {clipSeconds,Narration,PauseMeter,P,Shell,SoundCue} from '../Shared';

const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};

/** A tactile cold open: three loose number cards on a real-world style tabletop. */
export const LogicHook=()=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();
  return <Shell subject="THINKING SKILLS" step="01 / THE CHALLENGE">
    <Narration id="logic-hook"/>
    <SoundCue at={.55}/><SoundCue at={.9}/><SoundCue at={1.25}/>
    <div style={{position:'absolute',left:110,top:145,fontSize:83,fontWeight:700,letterSpacing:-3}}>A rule you can test.</div>
    <div style={{position:'absolute',left:195,top:295,width:1530,height:460,borderRadius:8,background:'linear-gradient(135deg,#bba98c,#ddcfb5 54%,#b8a485)',boxShadow:'0 28px 75px #0009',rotate:'-0.8deg',
      backgroundImage:'repeating-linear-gradient(0deg,transparent 0px,transparent 7px,#6d594008 8px,transparent 9px),linear-gradient(135deg,#bba98c,#ddcfb5 54%,#b8a485)',
      scale:interpolate(frame,[0,11*fps],[1,1.035],clamp),
    }}>
      {[{n:2,x:160,angle:-5,start:.1},{n:4,x:615,angle:2,start:.45},{n:8,x:1070,angle:-2,start:.8}].map((card)=><div key={card.n} style={{position:'absolute',left:card.x,top:50,width:300,height:350,background:'linear-gradient(120deg,#fefcf4,#ebe6d8)',borderRadius:5,color:'#202b30',boxShadow:'7px 11px 18px #35271755,1px 2px 2px #35271744',display:'flex',justifyContent:'center',alignItems:'center',fontSize:230,fontWeight:650,lineHeight:1,
        rotate:`${interpolate(frame,[card.start*fps,(card.start+.75)*fps],[card.angle-7,card.angle],{...clamp,easing:Easing.out(Easing.cubic)})}deg`,
        translate:`0 ${interpolate(frame,[card.start*fps,(card.start+.65)*fps],[-120,0],{...clamp,easing:Easing.out(Easing.cubic)})}px`,
        opacity:interpolate(frame,[card.start*fps,(card.start+.2)*fps],[0,1],clamp),
      }}><div style={{position:'absolute',left:21,right:21,top:28,height:1,background:'#b7b2a055'}}/>{card.n}<div style={{position:'absolute',left:21,right:21,bottom:28,height:1,background:'#b7b2a055'}}/></div>)}
      <div style={{position:'absolute',right:-30,top:-21,padding:'12px 20px',background:'#9dbda4',color:'#203c2c',fontSize:25,fontWeight:750,letterSpacing:3,rotate:'9deg',boxShadow:'0 5px 10px #0003',opacity:interpolate(frame,[1.9*fps,2.4*fps],[0,1],clamp)}}>THESE FIT</div>
    </div>
    <div style={{position:'absolute',top:790,left:0,right:0,textAlign:'center',fontSize:43,color:P.cyan,opacity:interpolate(frame,[3.8*fps,4.3*fps],[0,1],clamp)}}>What do you think the rule is?</div>
    <PauseMeter start={clipSeconds('logic-hook')+.4} duration={3} label="Make a guess before the next test"/>
  </Shell>;
};
