import {Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {clipSeconds, Narration, Shell} from '../Shared';
import voice from '../reading-narration.json';
import {ClueHand} from '../studies/ClueHand';

const options = ['He bought food at the canteen.', 'He forgot his lunch money.', 'He packed a friend’s lunch.', 'He broke his lunchbox at school.'];
const serif = 'Georgia, serif';
const gold = '#f4c777';
function move(t:number, at:number, seconds=0.85) {
  const p=Math.max(0,Math.min(1,(t-at)/seconds));
  return p*p*(3-2*p);
}
function lineTime(id:keyof typeof voice, text:string) {
  return (voice[id].captions.find(c=>c.text.startsWith(text))?.startMs ?? 0)/1000;
}

function Lunch({open}:{open:number}) {
  // The wrapped sandwich remains sealed through the entire inference.
  return <g>
    <ellipse cx="5" cy="48" rx="119" ry="22" fill="#261f1d" opacity=".3"/>
    <path d="M-111 -67 L64 -99 123 -57 120 26Q116 36 103 39 L-57 67Q-71 69 -82 60L-114 33Z" fill="#a34935" stroke="#733d31" strokeWidth="3"/>
    <path d="M-112 -56L-63 -15 120 -49 118 -21 -61 10 -113 -29Z" fill="#e3704e"/>
    <path d="M-109 -55L64 -87 111 -51 -63 -19Z" fill="#f0bc86" stroke="#ee9b68" strokeWidth="4"/>
    <g transform="translate(-4 -54) rotate(-9)">
      <path d="M-77 -3Q-79 -10 -69 -17L5 -37Q17 -43 28 -33L79 -1 75 24 -63 31 -81 17Z" fill="#e4bb7c" stroke="#ba8755" strokeWidth="3"/>
      <path d="M-74 -10L6 -34Q18 -41 26 -31L76 -2 51 9 -56 25Z" fill="#f7e5b3"/>
      <path d="M-68 -9L-16 1 22 -31M-16 1L-54 22M-14 3L69 0" fill="none" stroke="#b69c73" strokeWidth="2"/>
      <path d="M-43 -19L-3 5 9 23 22 21 9 0 -29 -24Z" fill="#a44d3a"/>
      <path d="M-10 4q-13 -16 -21 -8 -2 9 16 12 -1 8 -8 12m11 -14q18 -17 25 -9 4 9 -18 11l15 7" fill="none" stroke="#d39856" strokeWidth="2.3"/>
    </g>
    <g transform={`matrix(${1+.0193*open} ${-.415*open} ${.1*open} ${1-2.15*open} ${8.66*open} ${-186.23*open})`}>
      <path d="M-119 -65L58 -99Q68 -101 77 -96 L121 -64 Q129 -56 118 -51L-58 -16Q-69 -14 -78 -19L-119 -51Q-128 -59 -119 -65Z" fill="#e5805c" stroke="#f4ad80" strokeWidth="3"/>
      <path d="M-102 -58L64 -89 107 -59 -66 -28Z" fill="none" stroke="#c36a53" strokeWidth="3"/>
      <path d="M-75 -17L-55 -17 -55 -1Q-65 3 -74 -3Z" fill="#d6c5a0"/>
    </g>
  </g>;
}
function Receipt() {
  return <g>
    <path d="M0 0L169 0 169 225 160 220 151 227 141 220 131 227 121 220 111 227 101 220 91 227 81 220 71 227 61 220 51 227 41 220 31 227 21 220 11 227 0 221Z" fill="#f7eed4" stroke="#c6b79b" strokeWidth="2"/>
    <g fill="#2c4a49" textAnchor="middle" fontFamily="monospace"><text x="85" y="35" fontWeight="bold" fontSize="23">CANTEEN</text><text x="85" y="59" fontSize="17" letterSpacing="2">RECEIPT</text></g>
    <path d="M15 75H154 M15 132H154" fill="none" stroke="#968c74" strokeDasharray="4 4" strokeWidth="2"/>
    <text x="85" y="112" fill="#835033" fontSize="23" textAnchor="middle" fontFamily="Georgia">Dated today</text>
    {Array.from({length:32},(_,i)=><rect key={i} x={24+3.9*i} y="155" width={i%4===0?3.4:1.5} height={26+(i%3)} fill="#46514c"/>)}
    <path d="M30 193H139" stroke="#b9a88d" strokeWidth="2"/>
  </g>;
}
function Satchel({open}:{open:number}) {
  return <g>
    <ellipse cx="209" cy="438" rx="188" ry="28" fill="#322d22" opacity=".44"/>
    <path d="M86 298Q5 318 36 438Q72 462 100 390M265 282Q348 282 337 370L304 413" fill="none" stroke="#333e35" strokeWidth="24"/>
    <path d="M145 227Q146 155 210 170Q243 177 251 223" fill="none" stroke="#203d3b" strokeWidth="21"/>
    <path d="M146 218Q155 164 206 174Q236 179 246 220" fill="none" stroke="#a59369" strokeWidth="3"/>
    <path d="M81 237Q157 204 264 218Q309 229 327 297L312 413Q301 438 211 455L78 430Q54 424 62 378Z" fill="url(#bag-fabric)" stroke="#345047" strokeWidth="4"/>
    <path d="M77 276Q167 228 294 259Q277 214 249 216L128 223Q91 232 77 276Z" fill="#293d33"/>
    <path d="M84 248Q177 212 270 229L293 254Q169 232 77 278Z" fill="#ad9568" stroke="#625d42" strokeWidth="4"/>
    <path d="M88 299Q178 272 286 294L276 379 Q166 411 88 382Z" fill="#4e7162" stroke="#314b43" strokeWidth="3"/>
    <path d="M95 306Q188 283 278 301M95 374Q163 395 268 369" stroke="#cab58b" strokeWidth="2" strokeDasharray="5 4" fill="none"/>
    <g transform={`matrix(${1-.022*open} ${-.2074*open} ${-.18*open} ${1-1.7*open} ${46.02*open} ${434.69*open})`}>
      <path d="M80 246Q157 205 261 224L307 266 291 315Q188 353 98 324Z" fill="#678978" stroke="#415f50" strokeWidth="3"/>
      <path d="M92 251Q168 220 260 232L297 269 283 307Q187 341 106 317Z" fill="none" stroke="#c7b98e" strokeDasharray="5 4" strokeWidth="2"/>
      <path d="M162 303L183 302 182 349 170 356 160 350Z" fill="#9b6c44"/><rect x="164" y="321" width="19" height="12" rx="2" fill="none" stroke="#e4c68b" strokeWidth="3"/>
    </g>
    <path d="M75 417Q160 445 294 418" fill="none" stroke="#395546" strokeWidth="5"/>
  </g>;
}
function Bench({t,answerAt}:{t:number;answerAt:number}) {
  const opening=move(t,.5,2.1), lunch=move(t,2.0,2.3), lid=move(t,3.75,1.5);
  const receipt=move(t,6.25,1.45), pocket=move(t,8.2,1.65),compare=move(t,answerAt+.12,1.35);
  const lift=move(t,answerAt+1.55,1.1), packed=move(t,answerAt+4.65,1.15);
  const lookup=move(t,answerAt+7.1,1.2);
  const rx=555+160*pocket-99*compare,ry=188-50*receipt+64*pocket-62*compare;
  return <div style={{position:'absolute',inset:0,overflow:'hidden',borderRadius:16,background:'#725c40'}}>
    <Img src={staticFile('discovery/illustrations/library-desk.jpg')} style={{position:'absolute',width:'100%',height:'100%',objectFit:'cover',objectPosition:'50% 72%',scale:1.04+.07*opening-.05*compare,filter:'saturate(.78) brightness(.86)'}}/>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,#58462a33,transparent 42%,#193f4333)'}}/>
    <svg viewBox="0 0 1000 485" preserveAspectRatio="none" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <defs><linearGradient id="bag-fabric" x2=".9" y2="1"><stop stopColor="#8b9d78"/><stop offset=".48" stopColor="#536e5a"/><stop offset="1" stopColor="#365247"/></linearGradient></defs>
      <g transform={`translate(${20-16*compare} ${-5+12*compare}) scale(${1.01-.12*compare})`}><Satchel open={opening}/></g>
      <g opacity={lunch} transform={`translate(${254+234*lunch-84*compare} ${273+130*lunch-17*compare-25*packed}) rotate(${-11+11*lunch-3*compare}) scale(${.63+.35*lunch+.09*compare})`}><Lunch open={lid}/></g>
      <g opacity={(move(t,.75,.6)-move(t,4.35,.8))*.98}><ClueHand x={148+225*lunch} y={265+95*lunch} angle={-4-10*lunch}/></g>
      <g transform={`translate(${rx} ${ry}) rotate(${-13+20*pocket-9*compare}) scale(${.5+.41*receipt+.1*compare})`} opacity={receipt}>
        <g transform={`translate(0 ${pocket*67*(1-compare)-lift*12})`}><Receipt/></g>
      </g>
      <g opacity={receipt*(1-pocket+compare)}><ClueHand x={rx+154} y={ry+155+67*pocket*(1-compare)-12*lift} mirror other={false} angle={-7+6*compare} /></g>
      <g opacity={pocket*(1-compare)}><path d="M675 347L1020 288 1062 505H649Z" fill="#36535a"/><path d="M689 353L888 327 859 428 780 461 697 440Z" fill="#4b6871" stroke="#2c4850" strokeWidth="4"/><path d="M696 363L880 339 851 420 778 450 705 431Z" fill="none" stroke="#bea786" strokeDasharray="5 5" strokeWidth="2"/></g>
      <g opacity={compare} fill="none" stroke="#ffe398" strokeWidth="3" strokeLinecap="round">
        <path d="M550 126C586 98 654 88 687 116" pathLength="1" strokeDasharray="1" strokeDashoffset={1-lift}/>
        <path d="M330 327Q356 299 392 299" pathLength="1" strokeDasharray="1" strokeDashoffset={1-packed}/>
      </g>
      <g opacity={lookup} transform="translate(43 38)"><rect width="311" height="45" rx="5" fill="#243e3bef"/><text x="16" y="31" fill="#ffedc4" fontSize="23" fontFamily={serif}>What the passage shows</text></g>
    </svg>
  </div>;
}
export function ReadingPractice() {
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
  const duration=clipSeconds('reading-practice'),answerAt=duration+4.6;
  const showChoices=move(t,.3+lineTime('reading-practice','What most likely'),.5);
  const solved=move(t,answerAt+.1,.9);
  const receipt=move(t,.3+lineTime('reading-practice','He tucked'),.7);
  const lunch=move(t,.3+lineTime('reading-practice','His packed'),.7);
  const holding=t>=duration+.3 && t<answerAt;
  return <Shell subject="Reading" step="INFERENCE">
    <div style={{position:'absolute',left:95,top:128,width:1072,height:601}}><Bench t={t} answerAt={answerAt}/></div>
    <div style={{position:'absolute',left:95,top:754,width:1074,fontSize:35,lineHeight:1.34,fontFamily:serif,color:'#ede8da'}}>
      At the end of the school day, Noah opened his schoolbag. His <span style={{color:lunch>.4?gold:undefined}}>packed lunch was untouched.</span> He tucked <span style={{color:receipt>.4?gold:undefined}}>that day’s canteen receipt</span> into his pocket.
    </div>
    <div style={{position:'absolute',left:1228,right:90,top:158}}>
      <div style={{fontSize:24,letterSpacing:3,color:'#e0af75',fontWeight:750}}>READ THE CLUES</div>
      <div style={{fontFamily:serif,fontSize:72,lineHeight:1.04,color:'#f7f0df',marginTop:20}}>What most likely happened?</div>
      <div style={{opacity:1-showChoices,position:'absolute',top:240,left:0,right:0,color:'#afbbb3',fontSize:37,lineHeight:1.35}}>Follow the objects in Noah’s schoolbag and pocket.</div>
      <div style={{marginTop:35,opacity:showChoices}}>
        {options.map((option,i)=><div key={option} style={{display:'flex',gap:23,alignItems:'center',minHeight:84,borderTop:'1px solid #53605c',fontSize:35,lineHeight:1.16,color:i===0&&solved>.08?'#ffdb93':i>0&&solved>.3?'#8b9a98':'#f6f1e7'}}>
          <span style={{fontSize:27,fontWeight:750,fontFamily:'monospace',width:32}}>{'ABCD'[i]}</span><span>{option}</span>
        </div>)}
      </div>
      {holding&&<div style={{background:'#354844',height:4,marginTop:24}}><div style={{background:gold,height:4,width:`${100*(1-(t-duration-.3)/(answerAt-duration-.3))}%`}}/></div>}
      <div style={{color:'#f5d293',fontSize:32,lineHeight:1.25,marginTop:22,opacity:solved}}>Both clues support A.<br/><span style={{color:'#c3cdc1'}}>It is a likely explanation.</span></div>
    </div>
    <Narration id="reading-practice"/><Narration id="reading-practice-answer" from={answerAt}/>
  </Shell>;
}
