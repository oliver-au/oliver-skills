import {Series,useVideoConfig} from 'remotion';
import {clipSeconds,sceneFrames} from './Shared';
import {ReadingHook} from './reading/ReadingHook';
import {ReadingPredict} from './reading/ReadingPredict';
import {ReadingEvidence} from './reading/ReadingEvidence';
import {ReadingStories} from './reading/ReadingStories';
import {ReadingRule} from './reading/ReadingRule';
import {ReadingPractice} from './reading/ReadingPractice';

export {ReadingHook,ReadingPredict,ReadingEvidence,ReadingStories,ReadingRule,ReadingPractice};
export const readingPracticeFrames=(fps=30)=>Math.ceil((clipSeconds('reading-practice')+clipSeconds('reading-practice-answer')+5.8)*fps);
export const readingDurationFrames=(fps=30)=>sceneFrames('reading-hook',fps)+sceneFrames('reading-predict',fps,4.6)+sceneFrames('reading-evidence',fps)+sceneFrames('reading-stories',fps)+sceneFrames('reading-rule',fps)+readingPracticeFrames(fps);
export const ReadingVideo=()=>{
 const {fps}=useVideoConfig();
 return <Series>
  <Series.Sequence name="The story you added" durationInFrames={sceneFrames('reading-hook',fps)} premountFor={fps}><ReadingHook/></Series.Sequence>
  <Series.Sequence name="Choose an inference" durationInFrames={sceneFrames('reading-predict',fps,4.6)} premountFor={fps}><ReadingPredict/></Series.Sequence>
  <Series.Sequence name="Connect the evidence" durationInFrames={sceneFrames('reading-evidence',fps)} premountFor={fps}><ReadingEvidence/></Series.Sequence>
  <Series.Sequence name="Possible versus supported" durationInFrames={sceneFrames('reading-stories',fps)} premountFor={fps}><ReadingStories/></Series.Sequence>
  <Series.Sequence name="The reading habit" durationInFrames={sceneFrames('reading-rule',fps)} premountFor={fps}><ReadingRule/></Series.Sequence>
  <Series.Sequence name="Your turn" durationInFrames={readingPracticeFrames(fps)} premountFor={fps}><ReadingPractice/></Series.Sequence>
 </Series>;
};
