import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {clipSeconds,ease,Narration,P,PauseMeter,Shell} from '../Shared';

const Choice=({letter,children,at}:{letter:string;children:React.ReactNode;at:number})=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();
 return <div style={{display:'flex',gap:24,alignItems:'center',minHeight:105,padding:'14px 24px',boxSizing:'border-box',border:`1px solid ${P.line}`,background:'#172127',borderRadius:8,opacity:interpolate(frame,[at*fps,(at+.45)*fps],[0,1],ease),transform:`translateX(${interpolate(frame,[at*fps,(at+.45)*fps],[22,0],ease)}px)`}}><span style={{fontSize:33,color:P.cyan,fontWeight:750}}>{letter}</span><span style={{fontSize:37,lineHeight:1.3}}>{children}</span></div>;
};

export const ReadingPredict=()=> <Shell subject="Reading" step="02 / YOUR PREDICTION" title="Which explanation fits the clues best?">
 <div style={{position:'absolute',left:110,top:303,width:850,height:464,boxSizing:'border-box',padding:'38px 45px',background:'#eae5d8',color:'#273337',borderRadius:4,boxShadow:'0 14px 40px #0004'}}>
  <div style={{fontSize:23,letterSpacing:4,color:'#737770',marginBottom:21}}>THE PASSAGE</div>
  <div style={{fontSize:41,lineHeight:1.46}}>At the theatre door, Ava checked the time again. Inside, the last audience members were leaving. She folded her unused ticket and walked away.</div>
 </div>
 <div style={{position:'absolute',left:1030,top:303,width:780,display:'flex',flexDirection:'column',gap:14}}>
  <Choice letter="A" at={.4}>Ava disliked the actors.</Choice>
  <Choice letter="B" at={1.1}>Ava missed the performance.</Choice>
  <Choice letter="C" at={1.8}>Ava brought yesterday’s ticket.</Choice>
  <Choice letter="D" at={2.5}>Ava expected to meet a friend.</Choice>
 </div>
 <PauseMeter start={clipSeconds('reading-predict')+.3} duration={4} label="CHOOSE A, B, C OR D"/>
 <Narration id="reading-predict"/>
</Shell>;
