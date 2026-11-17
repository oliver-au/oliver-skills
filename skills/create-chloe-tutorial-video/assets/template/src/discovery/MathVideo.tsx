import {Series,useVideoConfig} from 'remotion';
import {clipSeconds,sceneFrames} from './Shared';
import {MathHook} from './math/MathHook';
import {MathPredict} from './math/MathPredict';
import {MathRise} from './math/MathRise';
import {MathFall} from './math/MathFall';
import {MathInsight} from './math/MathInsight';
import {MathPractice} from './math/MathPractice';

export const mathPracticeFrames=(fps:number)=>Math.ceil((clipSeconds('math-practice')+clipSeconds('math-practice-answer')+5.8)*fps);
export const mathDurationFrames=(fps=30)=>sceneFrames('math-hook',fps)+sceneFrames('math-predict',fps,4.6)+sceneFrames('math-rise',fps)+sceneFrames('math-fall',fps)+sceneFrames('math-insight',fps)+mathPracticeFrames(fps);
export const MathVideo=()=>{
 const {fps}=useVideoConfig();
 return <Series>
  <Series.Sequence name="The percentage trap" durationInFrames={sceneFrames('math-hook',fps)} premountFor={fps}><MathHook/></Series.Sequence>
  <Series.Sequence name="Make a prediction" durationInFrames={sceneFrames('math-predict',fps,4.6)} premountFor={fps}><MathPredict/></Series.Sequence>
  <Series.Sequence name="A twenty dollar increase" durationInFrames={sceneFrames('math-rise',fps)} premountFor={fps}><MathRise/></Series.Sequence>
  <Series.Sequence name="A twenty-four dollar decrease" durationInFrames={sceneFrames('math-fall',fps)} premountFor={fps}><MathFall/></Series.Sequence>
  <Series.Sequence name="Percent of what?" durationInFrames={sceneFrames('math-insight',fps)} premountFor={fps}><MathInsight/></Series.Sequence>
  <Series.Sequence name="Try the bicycle question" durationInFrames={mathPracticeFrames(fps)} premountFor={fps}><MathPractice/></Series.Sequence>
 </Series>;
};
