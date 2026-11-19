import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {clipSeconds, Narration} from '../Shared';

const parts = [
  {letter:'A',label:'Blue square',round:false,blue:true,start:257,end:285,dy:0},
  {letter:'B',label:'Red circle',round:true,blue:false,start:650,end:1268,dy:-9},
  {letter:'C',label:'Red square',round:false,blue:false,start:1043,end:761,dy:0},
  {letter:'D',label:'Blue circle',round:true,blue:true,start:1436,end:1491,dy:0},
];
const ease = (t:number,from:number,to:number) => {
  const u=Math.max(0,Math.min(1,(t-from)/(to-from)));
  return u*u*(3-2*u);
};
const brass='#cfb179',dark='#273e38';
const corners='M-91 -48v-43h43M48 -91h43v43M91 48v43h-43M-48 91h-43v-43';
const shape = (round:boolean,r:number) => round
  ? <circle r={r}/>
  : <rect x={-r} y={-r} width={2*r} height={2*r} rx="3"/>;

const Specimen = ({part,x,y,t,move}:{part:typeof parts[number];x:number;y:number;t:number;move:number}) => {
  const {letter,round,blue,label}=part;
  const squareCheck=t>=0 ? (letter==='C'?ease(t,.9,1.6):letter==='A'?ease(t,5.7,6.25):ease(t,8.48,9.1)):0;
  const compare=round?0:letter==='C'?ease(t,2.6,3.25):ease(t,5.7,6.25);
  const weight=round?.78:1;
  const arc=Math.sin(Math.PI*move);
  const radius=76;
  return <g transform={`translate(${x} ${y})`}>
    <g transform={`scale(${weight})`}>
      <g fill="#584f3b" opacity=".23" transform={`translate(${8+arc*6} ${11+arc*9})`}>{shape(round,radius+3)}</g>
      <g transform={`translate(0 ${-arc*16})`}>
        <g fill={blue?'#365e68':'#804c40'} transform="translate(0 7)">{shape(round,radius)}</g>
        <g fill={blue?'url(#spec-blue)':'url(#spec-coral)'} stroke={blue?'#4b7c87':'#a16051'} strokeWidth="2.5">{shape(round,radius)}</g>
        <g stroke={blue?'#b1d1c8':'#f1b497'} strokeWidth="3" opacity=".80" fill="none">
          {round?<path d="M-65 -9A66 66 0 0 1 30 -61"/>:<path d={`M${-radius+6} ${radius-8}V${-radius+5}H${radius-9}`}/>}
        </g>
        <g fill="url(#spec-fleck)" opacity=".7">{shape(round,radius-4)}</g>
      </g>
      <g opacity={squareCheck}>
        <path d={corners} transform={`scale(${1+(1-squareCheck)*.31})`} fill="none" stroke="#544b37" strokeWidth="6" strokeLinecap="square"/>
        <path d={corners} transform={`scale(${1+(1-squareCheck)*.31}) translate(0 -2)`} fill="none" stroke={brass} strokeWidth="3" strokeLinecap="square"/>
        {round&&<path d="M-84 -84l22 22M84 84l-22 -22" fill="none" stroke="#956641" strokeWidth="3" strokeDasharray="5 5"/>}
      </g>
    </g>
    <g transform={`translate(0 ${round?100:116})`}>
      <text textAnchor="middle" fill={dark} fontSize={round?29:33} fontWeight="720">{letter} · {label}</text>
    </g>
    {!round&&<g opacity={compare} transform="translate(0 171)">
      <rect x="-111" y="-21" width="223" height="44" rx="5" fill="#e2d1a4" stroke="#bca77d" strokeWidth="2"/>
      <rect x="-97" y="-12" width="24" height="24" rx="2" fill="#6196a3"/>
      <path d={letter==='A'?'M-57 0l5 5 12 -13':'M-61 -5h18m-18 8h18m-17 4l16 -19'} fill="none" stroke="#445d50" strokeWidth="3.3" strokeLinecap="round"/>
      <text x="-29" y="8" fill={dark} fontSize="22" fontWeight="680">{letter==='A'?'matches':'different'}</text>
    </g>}
  </g>;
};


const InspectionGauge = ({t}:{t:number}) => {
  const enter=ease(t,.25,1.62),toBlue=ease(t,5.05,6.18);
  const toCircle=ease(t,8.08,9.02),secondCircle=ease(t,9.78,10.7),park=ease(t,11.30,12.65);
  const x=929-168*enter-476*toBlue+983*toCircle+223*secondCircle+39*park;
  const y=112+179*enter-9*toCircle+9*secondCircle-201*park;
  const travelling=Math.max(...[enter,toBlue,toCircle,secondCircle,park].map(p=>Math.sin(Math.PI*p)));
  const radius=91+20*travelling-18*toCircle;
  const chip=ease(t,2.50,3.26)*(1-ease(t,7.8,8.13));
  return <g transform={`translate(${x} ${y-28*travelling})`} opacity={ease(t,.20,.85)*(1-park)}>
    <g transform={`rotate(${-5*travelling})`}>
      <path d={`M${-radius} ${-radius+42}v-48h${radius*2+13}v16h-12 M${radius} ${-radius+11}v31`} fill="none" stroke="#564b36" strokeWidth="12" opacity=".27" transform="translate(4 7)"/>
      <path d={`M${-radius} ${-radius+42}v-48H${radius+27}v15H${-radius+9}`} fill="none" stroke="#796544" strokeWidth="9" strokeLinejoin="round"/>
      <path d={`M${-radius+1} ${-radius+39}v-44H${radius+23}`} fill="none" stroke="#d1b47d" strokeWidth="5"/>
      <rect x={radius-11} y={-radius-14} width="25" height="29" rx="3" fill="#92805e" stroke="#675b43" strokeWidth="2"/>
      <path d={`M${radius} ${-radius+8}v34`} stroke="#786647" strokeWidth="8"/>
      <path d={`M${radius-2} ${-radius+8}v31`} stroke="#d0b788" strokeWidth="3"/>
      {Array.from({length:20},(_,n)=><path key={n} d={`M${-84+n*8} ${-radius-6}v${n%5===0?9:5}`} stroke="#5d563f" strokeWidth="1.3"/>)}
      <circle cx={radius+1} cy={-radius-16} r="9" fill="#baa06e" stroke="#71634b" strokeWidth="2.4"/>
      <path d={`M${radius-4} ${-radius-18}l9 5`} stroke="#756348" strokeWidth="2"/>
    </g>
    <g opacity={chip} transform={`translate(${radius+12} ${-33+19*(1-chip)})`}>
      <rect x="2" y="4" width="66" height="76" rx="5" fill="#7b6d4d" opacity=".25"/>
      <rect width="66" height="76" rx="5" fill="#eee0b8" stroke="#aa976f" strokeWidth="2"/>
      <rect x="7" y="7" width="52" height="43" rx="1.5" fill="#6196a3"/>
      <text x="33" y="67" fontSize="14" fontWeight="800" textAnchor="middle" fill="#40544c">BLUE</text>
    </g>
  </g>;
};

const Hardware = () => <>
  {[[28,26],[1654,26],[28,584],[1654,584]].map(([x,y])=><g key={x+'-'+y} transform={`translate(${x} ${y})`}><circle r="6" fill="#826c4b"/><circle r="4.2" fill="#c6af7e"/><path d="M-2.6 1.5l5.2 -3" stroke="#856d48" strokeWidth="1.5"/></g>)}
  {Array.from({length:73},(_,i)=><path key={i} d={`M${77+i*21} 581v${i%5===0?-13:i%2===0?-8:-5}`} stroke="#99845f" strokeWidth={i%5===0?1.8:1}/>)}
</>;

export const LogicPractice = () => {
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),s=frame/fps;
  const qEnd=clipSeconds('logic-practice')+.3,answerAt=qEnd+4.3;
  const t=(s-answerAt)*13.2/clipSeconds('logic-practice-answer');
  const sort=ease(t,.1,1.48),oldHeading=1-ease(t,-.02,.22),newHeading=ease(t,.29,.63);
  const hold=s>=qEnd&&s<qEnd+4,final=ease(t,11.0,11.75);
  return <AbsoluteFill style={{fontFamily:'Manrope Variable, Arial, sans-serif',background:'#122422',color:'#f3eee2'}}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" role="img" aria-label="Four coloured pieces on an inspection bench, sorted by shape and then compared to the blue colour required by the claim.">
      <defs>
        <clipPath id="spec-gauge-area"><rect x="50" y="155" width="1580" height="373"/></clipPath>
        <linearGradient id="spec-wall" x2="1" y2="1"><stop stopColor="#243b37"/><stop offset="1" stopColor="#0e1e20"/></linearGradient>
        <linearGradient id="spec-wood" x2="1" y2=".8"><stop stopColor="#d1bb94"/><stop offset=".54" stopColor="#b19a73"/><stop offset="1" stopColor="#96815e"/></linearGradient>
        <linearGradient id="spec-card" x2="1" y2=".8"><stop stopColor="#f0dfb8"/><stop offset="1" stopColor="#d3c299"/></linearGradient>
        <linearGradient id="spec-blue" x2="1" y2="1"><stop stopColor="#88b5bc"/><stop offset=".54" stopColor="#6196a3"/><stop offset="1" stopColor="#527984"/></linearGradient>
        <linearGradient id="spec-coral" x2="1" y2="1"><stop stopColor="#e9a084"/><stop offset=".54" stopColor="#cf8069"/><stop offset="1" stopColor="#bb6c59"/></linearGradient>
        <pattern id="spec-fleck" width="47" height="41" patternUnits="userSpaceOnUse"><path d="M3 12l8 1m12 14h4m12 -24h3m-12 31h5" stroke="#e8debb" strokeWidth="1.4" opacity=".55"/><circle cx="12" cy="36" r="1" fill="#794f44" opacity=".4"/></pattern>
        <pattern id="spec-grain" width="312" height="38" patternUnits="userSpaceOnUse"><path d="M0 8q47 -6 94 0t101 2 119 -2M71 27q65 -9 126 -3t111 1" fill="none" stroke="#826b4d" opacity=".22" strokeWidth="1.6"/></pattern>
      </defs>
      <path fill="url(#spec-wall)" d="M0 0h1920v1080H0z"/>
      <path d="M104 65h13v13h-13z" fill="#dd9074"/>
      <text x="132" y="80" fill="#eae6d9" fontWeight="800" fontSize="25" letterSpacing="3">CHLOE</text>
      <text x="265" y="80" fill="#acbbb0" fontSize="23" fontWeight="650" letterSpacing="3">THINKING SKILLS</text>
      <text x="1808" y="80" fill="#b9c6b7" textAnchor="end" fontSize="23" letterSpacing="2">TESTING A CLAIM</text>
      <text x="100" y="177" fill="#f6efdc" fontSize="71" fontWeight="710" letterSpacing="-3">{t<0?'Can one shape break the rule?':'Test the shape, then the colour.'}</text>
      <g transform="translate(110 215)">
        <rect width="1690" height="610" rx="19" fill="#846d50"/>
        <rect x="0" y="0" width="1682" height="603" rx="18" fill="url(#spec-wood)"/>
        <rect x="0" y="0" width="1682" height="603" rx="18" fill="url(#spec-grain)"/>
        <Hardware/>
        <rect x="44" y="42" width="1595" height="507" rx="11" fill="#82785b"/>
        <rect x="49" y="38" width="1586" height="504" rx="10" fill="url(#spec-card)"/>
        <path d="M61 53h1557v473H61z" fill="none" stroke="#b5a176" strokeWidth="2"/>
        <path d="M61 153h1557" stroke="#b5a176" strokeWidth="2"/>
        <g opacity={oldHeading}>
          <text x="98" y="110" fontSize="23" fill="#576452" fontWeight="750" letterSpacing="3">THE CLAIM</text>
          <text x="441" y="119" fill={dark} fontSize="58" fontWeight="730">“All squares are blue.”</text>
        </g>
        <g opacity={newHeading}>
          <text x="99" y="110" fontSize="27" fill={dark} fontWeight="750">1 · Is it a square?</text>
          <text x="595" y="110" fontSize="27" fill={dark} fontWeight="750">2 · Is the square blue?</text>
          <text x="1168" y="111" fontSize="29" fill="#605f4c" fontWeight="650">The claim is about squares.</text>
        </g>
        <g opacity={sort}>
          <path d="M1073 152v373" stroke="#a99471" strokeWidth="2" strokeDasharray="5 7"/>
          <path d="M1076 155h543v372h-543z" fill="#adba9d" opacity=".22"/>
        </g>
        {parts.map((part,i)=>{
          const progress=ease(t,.1+i*.07,1.33+i*.07);
          const x=part.start+(part.end-part.start)*progress;
          const lane=part.letter==='B'?-100:part.letter==='C'?100:0;
          const lift=1-(1-Math.sin(Math.PI*progress))**3;
          const y=321+progress*(-30+part.dy)+lane*lift;
          return <Specimen key={part.letter} part={part} x={x} y={y} t={t} move={progress}/>;
        })}
        {t>0&&<g clipPath="url(#spec-gauge-area)"><InspectionGauge t={t}/></g>}
        <g opacity={ease(t,8.65,9.45)}><text x="1366" y="459" fill="#4b6054" fontSize="26" textAnchor="middle">Both circles miss the corners.</text></g>
      </g>
      <g opacity={final}><text x="960" y="886" textAnchor="middle" fontSize="36" fill="#d6e3b5" fontWeight="650">C is a square. Its colour breaks the claim.</text></g>
      {hold&&<g><text x="960" y="882" fontSize="23" textAnchor="middle" fill="#dbe2cc" letterSpacing="3">TIME TO THINK</text><path d="M714 906h492" stroke="#536456" strokeWidth="3"/><path d={`M714 906h${492*(1-(s-qEnd)/4)}`} stroke="#c8c99a" strokeWidth="5"/></g>}
    </svg>
    <Narration id="logic-practice"/><Narration id="logic-practice-answer" from={answerAt}/>
  </AbsoluteFill>;
};
