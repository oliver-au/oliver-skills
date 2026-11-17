import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {Narration,P,Shell} from '../Shared';
import {LinkArrow,Note,Triple} from './LogicElements';

export const LogicGuess=()=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();
  return <Shell subject="THINKING SKILLS" step="02 / THE TEMPTING GUESS" title="“Double each time.”">
    <Narration id="logic-guess"/>
    <Triple values={[2,4,8]} top={325} size={170} gap={0.12}/>
    <LinkArrow left={640} top={355} start={.4}/><LinkArrow left={1120} top={355} start={.9}/>
    <div style={{position:'absolute',left:240,right:240,top:545,height:1,background:P.line}}/>
    <div style={{position:'absolute',top:565,left:280,fontSize:30,letterSpacing:4,color:P.muted,opacity:interpolate(frame,[1.5*fps,2*fps],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>ANOTHER TEST</div>
    <Triple values={[3,6,12]} top={605} size={140} start={2} gap={0.15}/>
    <Note start={7.7} top={815} colour={P.mint}>It fits. But does that prove your guess?</Note>
  </Shell>;
};
