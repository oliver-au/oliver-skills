import {Series,useCurrentFrame,useVideoConfig} from 'remotion';
import {Narration,Shell,sceneFrames} from './Shared';
import tracks from './writing-narration.json';
import {ArtWorld,BookWorld,motion} from './writing/WritingWorld';

type Key=keyof typeof tracks;
type SceneProps={id:Key};
const cream='#f8efdc',honey='#efc485',sage='#b8cbc0';
const serif='Georgia, serif';
const lead=.3;

function cue(id:Key,words:string) {
  const hit=tracks[id].captions.find(line=>line.text.startsWith(words));
  if(!hit)throw Error('Missing writing cue '+words);
  return lead+hit.startMs/1000;
}
function Label({children}:{children:string}) {
  return <div style={{fontSize:23,fontWeight:750,letterSpacing:3,color:honey,marginBottom:23}}>{children}</div>;
}
function Words({children,size=50,opacity=1}:{children:React.ReactNode;size?:number;opacity?:number}) {
  return <div style={{fontFamily:serif,fontSize:size,lineHeight:1.16,color:cream,opacity}}>{children}</div>;
}
function Detail({children,show=1}:{children:React.ReactNode;show?:number}) {
  return <div style={{fontSize:34,lineHeight:1.35,color:sage,marginTop:27,opacity:show}}>{children}</div>;
}
const names:Record<Key,string>={
  'writing-reader':'The notice','writing-brief':'Read the brief','writing-plan':'Try an opening','writing-edit':'Revise the notice','writing-compare':'Two possible openings','writing-transfer':'A fresh email','writing-check':'Read it again',
};
const draft='The book swap will be amazing.';
const question='Looking for your next adventure?';
const sharing='Give a story you love a new reader.';
function Scene({id}:SceneProps) {
  const f=useCurrentFrame(),{fps}=useVideoConfig(),t=f/fps;
  let world:React.ReactNode,copy:React.ReactNode,heading:string,under:React.ReactNode;
  switch(id) {
    case 'writing-reader':
      heading='Would you know how to join in?';
      world=<BookWorld mode="reader" t={t}/>;
      copy=<><Label>LIBRARY NOTICE</Label><Words size={62}>{draft}</Words><Detail show={motion(t,cue(id,"Would that"),.8)}>Imagine it is your first week here.</Detail></>;
      under='Read the notice as a new pupil.';
      break;
    case 'writing-brief':
      heading='Who needs these words?';
      world=<BookWorld mode="brief" t={t}/>;
      copy=<><Label>ORIGINAL WRITING PROMPT</Label><Words size={45}>Write a notice inviting <em style={{color:honey}}>new pupils</em> to the library book swap. Explain how to take part.</Words><Detail show={motion(t,cue(id,'It happens'),.6)}>Thursday lunchtime, in the library.<br/>Bring one book and swap it for another.</Detail></>;
      under='The reader is new. The invitation needs to tell them how to take part.';
      break;
    case 'writing-plan':
      heading='Try an opening of your own.';
      world=<BookWorld mode="plan" t={t}/>;
      copy=<><Label>FIRST DRAFT</Label><Words size={54}>{draft}</Words><Detail>What would make a new pupil want to come?</Detail></>;
      under='Say your opening aloud.';
      break;
    case 'writing-edit': {
      heading='Now the reader can act.';
      const bring=cue(id,'Bring one book'),swap=cue(id,'Swap it'),remove=motion(t,.3,.42),insert=motion(t,.82,.64);
      world=<BookWorld mode="edit" t={t} bring={bring} swap={swap}/>;
      copy=<><Label>LIBRARY BOOK SWAP</Label><div style={{position:'relative',minHeight:133}}>
        <div style={{position:'absolute',inset:0,opacity:1-remove,textDecoration:remove>.17?'line-through':undefined}}><Words size={52}>{draft}</Words></div>
        <div style={{opacity:insert}}><Words size={52}>{question}</Words></div></div>
        <Detail show={motion(t,bring,.65)}>Bring <strong style={{color:cream}}>one book</strong> to the library at lunchtime on Thursday.</Detail>
        <Detail show={motion(t,swap,.65)}>Swap it for a new read.</Detail></>;
      under=undefined;
      break;
    }
    case 'writing-compare':{
      const at=cue(id,'Give a story'),second=motion(t,at,.85);
      heading='Two openings can both work.';
      world=<BookWorld mode="compare" t={t} bring={at}/>;
      copy=<><Label>CURIOSITY</Label><Words size={47}>{question}</Words><div style={{borderTop:'1px solid #586663',margin:'28px 0',opacity:second}}/><div style={{opacity:second}}><Label>SHARING</Label><Words size={47}>{sharing}</Words></div></>;
      under='Both writers still need to explain how the swap works.';
      break;
    }
    case 'writing-transfer':
      heading='Write to a younger pupil.';
      world=<ArtWorld t={t}/>;
      copy=<><Label>ORIGINAL PRACTICE PROMPT</Label><Words size={40}>A younger pupil feels nervous about joining the art club. Write a friendly email to help them feel welcome. Explain one way they could join in.</Words><Detail>The club meets in the art room at lunchtime on Monday. Materials are provided.</Detail></>;
      under='Pause here and type your own email.';
      break;
    case 'writing-check':
      heading='Read it through their eyes.';
      world=<ArtWorld t={t} check/>;
      copy=<><Label>YOUR EMAIL</Label><Words size={48}>Would I feel welcome?</Words><div style={{marginTop:24}}><Words size={48} opacity={motion(t,cue(id,'Can you find'),.7)}>Do I know how to join in?</Words></div>
        <Detail show={motion(t,cue(id,'Check that'),.55)}>Check the details against the prompt.</Detail><Detail show={motion(t,cue(id,'Read your sentences'),.55)}>Read each sentence aloud.</Detail></>;
      under='Keep the details accurate and let the invitation sound like you.';
      break;
  }
  return <Shell subject="Writing" step={names[id].toUpperCase()}>
    <h1 style={{position:'absolute',left:96,top:133,margin:0,fontSize:71,fontWeight:650,letterSpacing:-2.4,color:cream}}>{heading}</h1>
    <div style={{position:'absolute',left:95,top:259,width:1025,height:540}}>{world}</div>
    <div style={{position:'absolute',left:1191,right:90,top:264}}>{copy}</div>
    <div style={{position:'absolute',left:96,right:90,top:829,color:'#d8e0d3',fontSize:32,letterSpacing:-.3}}>{under}</div>
    <Narration id={id} from={lead}/>
  </Shell>;
}
export const writingScenes:{id:Key;name:string;View:(p:SceneProps)=>React.JSX.Element;tail:number}[]=[
  {id:'writing-reader',name:'Meet the reader',View:Scene,tail:3},
  {id:'writing-brief',name:'Read the brief',View:Scene,tail:1.2},
  {id:'writing-plan',name:'Try an opening',View:Scene,tail:6},
  {id:'writing-edit',name:'Revise the notice',View:Scene,tail:1.5},
  {id:'writing-compare',name:'Compare two openings',View:Scene,tail:2},
  {id:'writing-transfer',name:'Write an email',View:Scene,tail:8},
  {id:'writing-check',name:'Review your writing',View:Scene,tail:2},
];
export const writingDurationFrames=(fps=30)=>writingScenes.reduce((n,s)=>n+sceneFrames(s.id,fps,s.tail),0);
export function WritingVideo() {
  const {fps}=useVideoConfig();
  return <Series>{writingScenes.map(({id,name,tail})=><Series.Sequence key={id} name={name} durationInFrames={sceneFrames(id,fps,tail)} premountFor={fps}><Scene id={id}/></Series.Sequence>)}</Series>;
}
