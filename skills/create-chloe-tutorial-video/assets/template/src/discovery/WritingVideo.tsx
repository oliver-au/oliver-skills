import type {CSSProperties, ReactNode} from 'react';
import {interpolate, Series, useCurrentFrame, useVideoConfig} from 'remotion';
import {Narration, P, Shell, sceneFrames} from './Shared';
import narration from './writing-narration.json';

const paper = '#f5eeda';
const ink = '#243b3b';
const accent = '#a75534';
const LEAD = 0.3;
const draft = 'The book swap will be amazing.';
const questionOpening = 'Looking for your next adventure?';
const sharingOpening = 'Give a story you love a new reader.';
const invitation = 'Bring one book to the library at lunchtime on Thursday.';
const swap = 'Swap it for a new read.';
type Key = keyof typeof narration;
type SceneProps = {id: Key};

function useSeconds() {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
}

function ease(t: number, start: number, length = 0.6) {
  const n = interpolate(t, [start, start + length], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return n * n * (3 - 2 * n);
}

// Caption boundaries travel with the selected recording. Track changes always pass
// through the narration processor that updates the text, duration and captions.
function spoken(id: Key, line: string) {
  const cues = narration[id].captions;
  const cue = cues.find(x => x.text.startsWith(line));
  if (!cue) throw new Error(`Missing writing narration cue "${line}" in ${id}`);
  return LEAD + cue.startMs / 1000;
}

const board: CSSProperties = {
  width: 1700, height: 615, left: 110, top: 148, position: 'absolute',
  display: 'grid', gridTemplateColumns: '1050px 1fr', columnGap: 78, alignItems: 'start',
};
const eyebrow: CSSProperties = {fontSize: 27, letterSpacing: 3, fontWeight: 760, color: P.cyan, marginBottom: 26};
const rule: CSSProperties = {height: 1, background: '#c7bd9d', margin: '18px 0 28px'};
function Note({label, children}: {label: string; children: ReactNode}) {
  return <section style={{position: 'relative', minHeight: 430, padding: '39px 48px 42px', color: ink, background: paper, borderRadius: 12, boxShadow: '7px 8px 0 #899887, 0 19px 38px #04080970', fontFamily: 'Georgia, serif'}}>
    <div style={{fontSize: 25, fontWeight: 700, color: accent, fontFamily: 'Manrope Variable, sans-serif', letterSpacing: 3}}>{label}</div>
    <div style={rule}/>{children}
  </section>;
}
function Margin({label, children}: {label: string; children: ReactNode}) {
  return <aside style={{paddingTop: 35, fontSize: 40, lineHeight: 1.33, color: P.ink}}><div style={eyebrow}>{label}</div>{children}</aside>;
}
function Spread({step, id, left, right}: {step: string; id: Key; left: ReactNode; right: ReactNode}) {
  return <Shell step={step} subject="Writing"><div style={board}>{left}{right}</div><Narration id={id} from={LEAD}/></Shell>;
}
function Cue({t, at, children}: {t: number; at: number; children: ReactNode}) {
  const p = ease(t, at);
  return <div style={{opacity: p, transform: `translateY(${(1-p)*13}px)`, marginBottom: 20}}>{children}</div>;
}

function Book({x, y, turn, colour}: {x: number; y: number; turn: number; colour: string}) {
  return <g transform={`translate(${x} ${y}) rotate(${turn})`}>
    <path d="M5 10h125v167H5z" fill="#11242222"/>
    <rect width="125" height="170" rx="7" fill={colour}/>
    <path d="M8 6v152l9 6V9z" fill="#16383655"/>
    <path d="M11 157h111v10H12q-7-3-1-10" fill="#ddd5ad"/>
    <path d="M20 161h96m-92 3h90" stroke="#a99b70" strokeWidth="1"/>
    <path d="M32 43h60m-60 10h47" stroke="#fff5ce" strokeWidth="4" strokeLinecap="round"/>
    <path d="m69 77 6 13 15 1-12 10 4 15-13-8-13 8 4-15-12-10 15-1z" fill="#e7ca7e"/>
  </g>;
}
function Books({time}: {time: number}) {
  const p = ease(time, 0.25, 2);
  return <svg viewBox="0 0 390 210" aria-label="Two library books" style={{width:365, height:185, marginTop:18}}>
    <Book x={82-8*p} y={13} turn={-5-2*p} colour="#629788"/><Book x={204+6*p} y={19} turn={9+2*p} colour="#376a70"/>
  </svg>;
}
function Reader({id}: SceneProps) {
  const t = useSeconds();
  return <Spread step="A NEW READER" id={id} left={<Note label="LIBRARY NOTICE"><div style={{fontSize:65, lineHeight:1.14}}>{draft}</div><Books time={t}/></Note>}
    right={<Margin label="YOU JUST JOINED THE SCHOOL">Could you take part after reading this?</Margin>}/>;
}
function Brief({id}: SceneProps) {
  const t = useSeconds();
  return <Spread step="READ THE PROMPT" id={id} left={<Note label="ORIGINAL PRACTICE PROMPT">
    <div style={{fontSize:46, lineHeight:1.23}}>Write a notice inviting <strong>new pupils</strong> to the library book swap. Explain <strong>how to take part</strong>.</div>
    <div style={{marginTop:33, fontSize:35, lineHeight:1.28}}>Thursday lunchtime, in the library.<br/>Bring one book and swap it for another.</div>
  </Note>} right={<Margin label="TWO DECISIONS"><Cue t={t} at={spoken(id,'Write a notice')}>Who will read this?<div style={{color:P.mint}}>New pupils.</div></Cue>
    <Cue t={t} at={spoken(id,'Explain how')}>What do they need?<div style={{color:P.mint}}>An invitation they can act on.</div></Cue></Margin>}/>;
}
function Plan({id}: SceneProps) {
  return <Spread step="TRY AN OPENING" id={id} left={<Note label="FIRST DRAFT"><div style={{fontSize:64}}>{draft}</div>
    <div style={{fontSize:34, color:'#536660', marginTop:43}}>Reader · New pupils<br/>Task · Invite them to the swap.</div></Note>}
    right={<Margin label="YOUR TURN">What would make someone new want to come?<p style={{fontSize:32,color:P.muted}}>Say your opening aloud.</p></Margin>}/>;
}
function Revision({id}: SceneProps) {
  const t = useSeconds();
  const opening = ease(t, LEAD, 1);
  return <Spread step="REVISE THE NOTICE" id={id}
    left={<Note label="LIBRARY BOOK SWAP"><div style={{height:132,position:'relative',fontSize:57,lineHeight:1.1}}>
      <div style={{position:'absolute',opacity:1-opening, textDecoration:opening>0.15?'line-through':'none'}}>{draft}</div>
      <div style={{position:'absolute',opacity:opening, transform:`translateY(${(1-opening)*16}px)`}}>{questionOpening}</div></div>
      <div style={{fontSize:41, lineHeight:1.23}}><Cue t={t} at={spoken(id,'Bring one book')}>{invitation}</Cue><Cue t={t} at={spoken(id,'Swap it')}>{swap}</Cue></div></Note>}
    right={<Margin label="READ AS A NEW PUPIL"><Cue t={t} at={spoken(id,'This question')}>I can picture finding a story.</Cue><Cue t={t} at={spoken(id,'The invitation')}>I know where to go, when to go and what to bring.</Cue></Margin>}/>;
}
function Compare({id}: SceneProps) {
  const t = useSeconds();
  return <Spread step="ANOTHER VALID OPENING" id={id} left={<Note label="TWO WRITERS, ONE TASK"><div style={{fontSize:45, lineHeight:1.23}}>{questionOpening}</div>
    <div style={{...rule, margin:'32px 0'}}/><Cue at={spoken(id,'Give a story')} t={t}><div style={{fontSize:45, lineHeight:1.23}}>{sharingOpening}</div></Cue></Note>}
    right={<Margin label="COMPARE THE EFFECT"><div style={{color:P.mint}}>Curiosity</div><Cue t={t} at={spoken(id,'That opening')}><div style={{color:P.mint}}>Sharing</div></Cue>
    <Cue t={t} at={spoken(id,'Both still')}><div style={{fontSize:34}}>Both invitations need the details of the swap.</div></Cue></Margin>}/>;
}
function Transfer({id}: SceneProps) {
  return <Spread step="FRESH WRITING TASK" id={id} left={<Note label="ORIGINAL PRACTICE PROMPT">
    <div style={{fontSize:43,lineHeight:1.24}}>A younger pupil feels nervous about joining the art club. Write a friendly email to help them feel welcome. Explain one way they could join in.</div>
    <div style={{fontSize:32, marginTop:35, lineHeight:1.3, color:'#435e56'}}>The club meets in the art room at lunchtime on Monday. Materials are provided.</div></Note>}
    right={<Margin label="WRITE YOUR OWN EMAIL">Pause here and type your response.</Margin>}/>;
}
function Check({id}: SceneProps) {
  const t = useSeconds();
  return <Spread step="REREAD YOUR EMAIL" id={id} left={<Note label="READ THROUGH A YOUNGER PUPIL’S EYES"><div style={{fontSize:48,lineHeight:1.24}}>
    <Cue t={t} at={spoken(id,'Which words')}>Would I feel welcome?</Cue>
    <Cue t={t} at={spoken(id,'Can you find')}>Do I know how to join in?</Cue></div></Note>}
    right={<Margin label="LAST EDIT"><Cue t={t} at={spoken(id,'Check that')}>Do the details match the prompt?</Cue><Cue t={t} at={spoken(id,'Read your sentences')}>Read each sentence aloud.</Cue></Margin>}/>;
}

export const writingScenes: {id: Key; name: string; View: (props: SceneProps) => React.JSX.Element; tail: number}[] = [
  {id:'writing-reader',name:'Meet the reader',View:Reader,tail:3},
  {id:'writing-brief',name:'Read the brief',View:Brief,tail:1.2},
  {id:'writing-plan',name:'Try an opening',View:Plan,tail:6},
  {id:'writing-edit',name:'Revise the notice',View:Revision,tail:1.5},
  {id:'writing-compare',name:'Compare two openings',View:Compare,tail:2},
  {id:'writing-transfer',name:'Write an email',View:Transfer,tail:8},
  {id:'writing-check',name:'Review your writing',View:Check,tail:2},
];
export const writingDurationFrames = (fps=30) => writingScenes.reduce((n,s)=>n+sceneFrames(s.id,fps,s.tail),0);
export const WritingVideo = () => {
  const {fps} = useVideoConfig();
  return <Series>{writingScenes.map(({id,name,View,tail})=><Series.Sequence key={id} name={name} durationInFrames={sceneFrames(id,fps,tail)}><View id={id}/></Series.Sequence>)}</Series>;
};
