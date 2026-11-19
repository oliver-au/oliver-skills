import {useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Player,type PlayerRef} from '@remotion/player';
import {ReadingVideo,readingDurationFrames} from './discovery/ReadingVideo';
import {MathVideo,mathDurationFrames} from './discovery/MathVideo';
import {LogicVideo,logicDurationFrames} from './discovery/LogicVideo';
import {CubeVideo,cubeDurationFrames} from './discovery/CubeVideo';
import {WritingVideo,writingDurationFrames} from './discovery/WritingVideo';
import {isNarrationReady} from './discovery/Shared';
import './styles.css';

const lessons=[
 {id:'reading',audioPrefix:'reading-',subject:'Reading',title:'The story you added.',copy:'Follow the clues in a theatre-ticket mystery, then test your own inference.',component:ReadingVideo,frames:readingDurationFrames(),tag:'NEW SAMPLE'},
 {id:'maths',audioPrefix:'math-',subject:'Maths',title:'The percentage trap.',copy:'A price rises 20%, then falls 20%. Watch why the changes do not cancel.',component:MathVideo,frames:mathDurationFrames(),tag:'SAMPLE 01'},
 {id:'thinking',audioPrefix:'logic-',subject:'Thinking skills',title:'Test the rule.',copy:'Challenge a tempting number pattern and discover what makes a useful test.',component:LogicVideo,frames:logicDurationFrames(),tag:'SAMPLE 02'},
 {id:'spatial',audioPrefix:'cube-',subject:'Spatial reasoning',title:'The far-apart trap.',copy:'Follow the star and heart as a paper net folds into a cube.',component:CubeVideo,frames:cubeDurationFrames(),tag:'SAMPLE 03'},
 {id:'writing',audioPrefix:'writing-',subject:'Writing',title:'Write for your reader.',copy:'Revise a library notice, then write a friendly email for a different reader.',component:WritingVideo,frames:writingDurationFrames(),tag:'SAMPLE 04'},
] as const;
const duration=(frames:number)=>{const seconds=Math.round(frames/30);return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;};
type LessonId=typeof lessons[number]['id'];

function App(){
 const initialId=location.hash.slice(1);
 const [selected,setSelected]=useState<LessonId>(lessons.some(item=>item.id===initialId)?initialId as LessonId:'reading');
 const ref=useRef<PlayerRef>(null);
 const lesson=lessons.find(item=>item.id===selected)!;
 const ready=isNarrationReady(lesson.audioPrefix);
 const choose=(id:LessonId)=>{ref.current?.pause();setSelected(id);history.replaceState(null,'',`#${id}`);};
 return <>
  <header className="site-header"><a className="brand" href="#reading" onClick={(event)=>{event.preventDefault();choose('reading');}}><span className="brand-mark"/><strong>CHLOE</strong><span>SELECTIVE</span></a><span className="review-label"><span/>VIDEO REVIEW</span></header>
  <main>
   <nav className="lesson-picker" aria-label="Choose a video sample">{lessons.map(item=><button key={item.id} type="button" className={selected===item.id?'selected':''} aria-pressed={selected===item.id} onClick={()=>choose(item.id)}><span>{item.subject}</span><small>{duration(item.frames)}{item.id==='reading'?' · New':''}</small></button>)}</nav>
   <section className="watch" aria-labelledby="lesson-title">
    <div className="lesson-heading"><div><p className="eyebrow">{lesson.tag} <span> / {lesson.subject.toUpperCase()}</span></p><h2 id="lesson-title">{lesson.title}</h2></div><div className="watch-actions"><span className="runtime">{duration(lesson.frames)}</span><button type="button" onClick={()=>{ref.current?.seekTo(0);ref.current?.play();}}>↺ Replay</button><button type="button" onClick={()=>ref.current?.requestFullscreen()}>⛶ Fullscreen</button></div></div>
    <div className="video-shell"><Player
      ref={ref} key={lesson.id} component={lesson.component}
      durationInFrames={lesson.frames} fps={30}
      compositionWidth={1920} compositionHeight={1080}
      style={{width:'100%'}} controls clickToPlay doubleClickToFullscreen
      showVolumeControls numberOfSharedAudioTags={8}
      moveToBeginningWhenEnded={false}
      spaceKeyToPlayOrPause
    /></div>
    <div className="under-video"><p>{lesson.copy}</p><span className="note-meta">{ready?'Sound on · Captions included':'Narration pending · silent draft'}</span></div>
   </section>
   <aside className="review-note"><span className="note-line"/><p>Each sample includes a question, time to think, an explanation, and a fresh practice question.</p></aside>
  </main>
  <footer><span>CHLOE SELECTIVE <span className="footer-divider">/</span> REVIEW EDITION</span><span>Original teaching examples · Not official exam questions</span></footer>
 </>;
}

createRoot(document.getElementById('root')!).render(<App/>);
