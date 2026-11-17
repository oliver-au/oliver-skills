import {Series,useVideoConfig} from 'remotion';
import {clipSeconds,sceneFrames} from './Shared';
import {LogicHook} from './logic/LogicHook';
import {LogicGuess} from './logic/LogicGuess';
import {LogicTest} from './logic/LogicTest';
import {LogicReverse} from './logic/LogicReverse';
import {LogicReveal} from './logic/LogicReveal';
import {LogicPractice} from './logic/LogicPractice';

export {LogicHook,LogicGuess,LogicTest,LogicReverse,LogicReveal,LogicPractice};
export const logicPracticeFrames=(fps=30)=>Math.ceil((clipSeconds('logic-practice')+clipSeconds('logic-practice-answer')+5.8)*fps);
export const logicDurationFrames=(fps=30)=>sceneFrames('logic-hook',fps,4)+sceneFrames('logic-guess',fps)+sceneFrames('logic-test',fps)+sceneFrames('logic-reverse',fps)+sceneFrames('logic-reveal',fps)+logicPracticeFrames(fps);

export const LogicVideo=()=>{
  const {fps}=useVideoConfig();
  return <Series>
    <Series.Sequence name="The hidden rule" durationInFrames={sceneFrames('logic-hook',fps,4)} premountFor={fps}><LogicHook/></Series.Sequence>
    <Series.Sequence name="A tempting guess" durationInFrames={sceneFrames('logic-guess',fps)} premountFor={fps}><LogicGuess/></Series.Sequence>
    <Series.Sequence name="Try to break it" durationInFrames={sceneFrames('logic-test',fps)} premountFor={fps}><LogicTest/></Series.Sequence>
    <Series.Sequence name="Change direction" durationInFrames={sceneFrames('logic-reverse',fps)} premountFor={fps}><LogicReverse/></Series.Sequence>
    <Series.Sequence name="The discovery" durationInFrames={sceneFrames('logic-reveal',fps)} premountFor={fps}><LogicReveal/></Series.Sequence>
    <Series.Sequence name="Your turn" durationInFrames={logicPracticeFrames(fps)} premountFor={fps}><LogicPractice/></Series.Sequence>
  </Series>;
};
