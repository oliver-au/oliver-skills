import {Composition,Folder} from 'remotion';
import {MathVideo,mathDurationFrames,mathPracticeFrames} from './MathVideo';
import {MathHook} from './math/MathHook';
import {MathPredict} from './math/MathPredict';
import {MathRise} from './math/MathRise';
import {MathFall} from './math/MathFall';
import {MathInsight} from './math/MathInsight';
import {MathPractice} from './math/MathPractice';
import {LogicVideo,logicDurationFrames,logicPracticeFrames,LogicHook,LogicGuess,LogicTest,LogicReverse,LogicReveal,LogicPractice} from './LogicVideo';
import {WritingVideo,writingDurationFrames,writingScenes} from './WritingVideo';
import {sceneFrames} from './Shared';
import {CubeVideo,cubeDurationFrames,cubeSceneFrames,CUBE_SCENES} from './CubeVideo';
import {GateWalkStudy} from './studies/pool/GateWalkStudy';
import {ReadingVideo,readingDurationFrames,readingPracticeFrames,ReadingHook,ReadingPredict,ReadingEvidence,ReadingStories,ReadingRule,ReadingPractice} from './ReadingVideo';

export const DiscoveryCompositions=()=> <Folder name="Chloe-Discovery">
 <Folder name="Motion-studies">
  <Composition id="Pool-Gate-Walk" component={GateWalkStudy} width={1920} height={1080} fps={30} durationInFrames={219}/>
 </Folder>
 <Composition id="Chloe-Percentage-Trap" component={MathVideo} width={1920} height={1080} fps={30} durationInFrames={mathDurationFrames()} />
 <Composition id="Chloe-Test-The-Rule" component={LogicVideo} width={1920} height={1080} fps={30} durationInFrames={logicDurationFrames()} />
 <Composition id="Chloe-The-Story-You-Added" component={ReadingVideo} width={1920} height={1080} fps={30} durationInFrames={readingDurationFrames()} />
 <Composition id="Chloe-Far-Apart-Trap" component={CubeVideo} width={1920} height={1080} fps={30} durationInFrames={cubeDurationFrames()} />
 <Composition id="Chloe-Write-for-Your-Reader" component={WritingVideo} width={1920} height={1080} fps={30} durationInFrames={writingDurationFrames()}/>
 <Folder name="Writing-scenes">
  {writingScenes.map(({id,View,tail})=><Composition key={id} id={id} component={View} defaultProps={{id}} width={1920} height={1080} fps={30} durationInFrames={sceneFrames(id,30,tail)}/>)}
 </Folder>
 <Folder name="Cube-scenes">
  {CUBE_SCENES.map(([id,,Scene])=><Composition key={id} id={`Cube-${id.replace('cube-','')}`} component={Scene} width={1920} height={1080} fps={30} durationInFrames={cubeSceneFrames(id)} />)}
 </Folder>
 <Folder name="Reading-scenes">
  <Composition id="Reading-Hook" component={ReadingHook} width={1920} height={1080} fps={30} durationInFrames={sceneFrames('reading-hook',30)} />
  <Composition id="Reading-Prediction" component={ReadingPredict} width={1920} height={1080} fps={30} durationInFrames={sceneFrames('reading-predict',30,4.6)} />
  <Composition id="Reading-Evidence" component={ReadingEvidence} width={1920} height={1080} fps={30} durationInFrames={sceneFrames('reading-evidence',30)} />
  <Composition id="Reading-Stories" component={ReadingStories} width={1920} height={1080} fps={30} durationInFrames={sceneFrames('reading-stories',30)} />
  <Composition id="Reading-Rule" component={ReadingRule} width={1920} height={1080} fps={30} durationInFrames={sceneFrames('reading-rule',30)} />
  <Composition id="Reading-Practice" component={ReadingPractice} width={1920} height={1080} fps={30} durationInFrames={readingPracticeFrames(30)} />
 </Folder>
 <Folder name="Maths-scenes">
  <Composition id="Maths-Hook" component={MathHook} width={1920} height={1080} fps={30} durationInFrames={sceneFrames('math-hook',30)} />
  <Composition id="Maths-Prediction" component={MathPredict} width={1920} height={1080} fps={30} durationInFrames={sceneFrames('math-predict',30,4.6)} />
  <Composition id="Maths-Rise" component={MathRise} width={1920} height={1080} fps={30} durationInFrames={sceneFrames('math-rise',30)} />
  <Composition id="Maths-Fall" component={MathFall} width={1920} height={1080} fps={30} durationInFrames={sceneFrames('math-fall',30)} />
  <Composition id="Maths-Insight" component={MathInsight} width={1920} height={1080} fps={30} durationInFrames={sceneFrames('math-insight',30)} />
  <Composition id="Maths-Practice" component={MathPractice} width={1920} height={1080} fps={30} durationInFrames={mathPracticeFrames(30)} />
 </Folder>
 <Folder name="Thinking-scenes">
  <Composition id="Thinking-Hook" component={LogicHook} width={1920} height={1080} fps={30} durationInFrames={sceneFrames('logic-hook',30,4)} />
  <Composition id="Thinking-Guess" component={LogicGuess} width={1920} height={1080} fps={30} durationInFrames={sceneFrames('logic-guess',30)} />
  <Composition id="Thinking-Test" component={LogicTest} width={1920} height={1080} fps={30} durationInFrames={sceneFrames('logic-test',30)} />
  <Composition id="Thinking-Reverse" component={LogicReverse} width={1920} height={1080} fps={30} durationInFrames={sceneFrames('logic-reverse',30)} />
  <Composition id="Thinking-Reveal" component={LogicReveal} width={1920} height={1080} fps={30} durationInFrames={sceneFrames('logic-reveal',30)} />
  <Composition id="Thinking-Practice" component={LogicPractice} width={1920} height={1080} fps={30} durationInFrames={logicPracticeFrames(30)} />
 </Folder>
</Folder>;
