import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {clipSeconds,ease,Eyebrow,Narration,P,Shell,SoundCue} from '../Shared';

export const ReadingEvidence=()=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const time=frame/fps;
 const second=clipSeconds('reading-evidence')*.32;
 const reveal=clipSeconds('reading-evidence')*.65+.3;
 const left=interpolate(time,[1.3,2],[0,1],ease);const right=interpolate(time,[second,second+.7],[0,1],ease);
 const result=interpolate(time,[reveal,reveal+.7],[0,1],ease);
 return <Shell subject="Reading" step="03 / FOLLOW THE CLUES" title="Two clues. One stronger inference.">
  <div style={{position:'absolute',left:110,top:330,width:750,height:220,padding:'30px 40px',boxSizing:'border-box',background:'#eae5d8',borderRadius:6,color:'#263637',transform:`translateY(${(1-left)*15}px)`,opacity:.3+.7*left}}>
   <Eyebrow color="#66706d">CLUE 01</Eyebrow><div style={{fontSize:51,lineHeight:1.24,marginTop:22}}>The last audience<br/>members were <span style={{background:`rgba(119,197,180,${left*.65})`}}>leaving.</span></div>
  </div>
  <div style={{position:'absolute',left:1070,top:330,width:740,height:220,padding:'30px 40px',boxSizing:'border-box',background:'#eae5d8',borderRadius:6,color:'#263637',transform:`translateY(${(1-right)*15}px)`,opacity:.3+.7*right}}>
   <Eyebrow color="#66706d">CLUE 02</Eyebrow><div style={{fontSize:51,lineHeight:1.24,marginTop:22}}>Ava folded her<br/><span style={{background:`rgba(119,197,180,${right*.65})`}}>unused ticket.</span></div>
  </div>
  <div style={{position:'absolute',left:920,top:385,fontSize:90,color:P.muted}}>+</div>
  <svg width="1920" height="200" style={{position:'absolute',top:550,left:0}}><path d="M485 0 V52 Q485 72 505 72 H940 Q960 72 960 92 V135 M1440 0 V52 Q1440 72 1420 72 H980 Q960 72 960 92" fill="none" stroke={P.mint} strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-result}/><path d="M950 124 L960 137 L970 124" fill="none" stroke={P.mint} strokeWidth="3" opacity={result}/></svg>
  <div style={{position:'absolute',left:260,right:260,top:700,textAlign:'center',opacity:result,transform:`translateY(${(1-result)*20}px)`}}><div style={{fontSize:56,fontWeight:650,color:P.mint}}>B · She probably missed the performance.</div><div style={{fontSize:29,letterSpacing:3,color:P.muted,marginTop:24}}>BEST SUPPORTED BY THE TWO CLUES</div></div>
  <Narration id="reading-evidence"/><SoundCue at={reveal} type="reveal"/>
 </Shell>;
};
