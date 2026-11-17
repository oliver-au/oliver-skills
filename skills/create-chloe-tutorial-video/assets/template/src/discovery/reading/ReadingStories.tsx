import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {clipSeconds,ease,Eyebrow,Narration,P,Shell} from '../Shared';

export const ReadingStories=()=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const time=frame/fps;
 const date=interpolate(time,[2,3],[0,1],ease);const opinion=interpolate(time,[clipSeconds('reading-stories')*.48,clipSeconds('reading-stories')*.48+1],[0,1],ease);
 return <Shell subject="Reading" step="04 / THE TRAP" title="Possible does not mean supported.">
  <div style={{position:'absolute',left:110,top:325,width:800,height:410,padding:'37px 40px',boxSizing:'border-box',border:`1px solid ${P.line}`,borderRadius:8,background:'#151d23'}}>
   <Eyebrow color={P.red}>THE STORY YOU COULD ADD</Eyebrow><div style={{fontSize:52,marginTop:32,lineHeight:1.25}}>“Her ticket was for<br/>the wrong day.”</div>
   <div style={{height:2,background:P.line,marginTop:32}}/><div style={{marginTop:31,display:'flex',justifyContent:'space-between',alignItems:'baseline',opacity:date}}><span style={{fontSize:32,color:P.muted}}>Date in the passage</span><span style={{fontSize:38,color:P.red}}>Not stated</span></div>
  </div>
  <div style={{position:'absolute',left:1010,top:325,width:800,height:410,padding:'37px 40px',boxSizing:'border-box',border:`1px solid ${P.line}`,borderRadius:8,background:'#151d23'}}>
   <Eyebrow color={P.red}>ANOTHER EXTRA STORY</Eyebrow><div style={{fontSize:52,marginTop:32,lineHeight:1.25}}>“She disliked<br/>the actors.”</div>
   <div style={{height:2,background:P.line,marginTop:32}}/><div style={{marginTop:31,display:'flex',justifyContent:'space-between',alignItems:'baseline',opacity:opinion}}><span style={{fontSize:32,color:P.muted}}>Ava’s opinion</span><span style={{fontSize:38,color:P.red}}>Not stated</span></div>
  </div>
  <div style={{position:'absolute',top:800,left:110,right:110,textAlign:'center',fontSize:41,color:P.cyan,opacity:interpolate(time,[clipSeconds('reading-stories')*.75,clipSeconds('reading-stories')*.75+.6],[0,1],ease)}}>Which detail actually supports your answer?</div>
  <Narration id="reading-stories"/>
 </Shell>;
};
