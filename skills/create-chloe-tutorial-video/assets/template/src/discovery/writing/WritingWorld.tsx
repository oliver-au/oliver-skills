import {ClueHand as Hand} from '../studies/ClueHand';
import {Img,staticFile} from 'remotion';

export function motion(t:number,a:number,len=1) {
  const v=Math.max(0,Math.min(1,(t-a)/len));
  return v*v*(3-2*v);
}
function ClothBook({x,y,angle=0,blue=false,size=1}:{x:number;y:number;angle?:number;blue?:boolean;size?:number}) {
  const colour=blue?'#255c66':'#b55139';
  return <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${size})`}>
    <ellipse cx="0" cy="94" rx="84" ry="13" fill="#28271f" opacity=".28"/>
    <path d="M-69 -105L66 -106Q73 -106 73 -97L73 94Q73 103 66 105H-65L-73 101V-97Z" fill="#524531"/>
    <path d="M-65 -102H67V101H-66Q-74 101 -70 95Z" fill="#dfcaa2"/>
    <path d="M-68 95H66m-125 3h121" stroke="#9f8860" strokeWidth="1.5"/>
    <path d="M-72 -111L64 -111Q69 -111 69 -106V89Q69 95 63 95H-70Z" fill={colour} stroke={blue?'#224953':'#823f31'} strokeWidth="3"/>
    <path d="M-62 -108V91m6 -198V90" stroke={blue?'#74a3a0':'#e89b75'} strokeWidth="2"/>
    <path d="M-47 -95H56V80H-47Z" stroke="#e9ca92" strokeWidth="1" fill="none"/>
    {blue?<g><circle cx="6" cy="-13" r="26" fill="#e7c983"/><path d="M-42 -2q25 -18 46 0t45 0v41H-42Z" fill="#75a7a4"/><path d="M-42 10q25 -13 46 0t45 0m-89 10q25 -12 46 0t45 0" stroke="#e2e0b7" fill="none" strokeWidth="2"/></g>:<g stroke="#ebd39d" fill="none" strokeWidth="2.5"><path d="M1 35Q5 11 8 -28 M5 15Q-13 8 -19 -9 Q-3 -9 5 12 M7 -1Q24 -4 31 -21 Q15 -20 7 -3 M6 24Q-11 21 -18 11Q-4 10 6 22"/><circle cx="10" cy="-31" r="9" fill="#e4aa6e"/><circle cx="-15" cy="-9" r="5" fill="#e9b578"/></g>}
    <text x="6" y="57" textAnchor="middle" fontFamily="Georgia" fontSize={blue?12.5:12} fill="#f9e6b8" letterSpacing=".8">{blue?'TIDE WALK':'THE ORCHARD'}</text>
    <path d="M36 96v15l4 -3 5 3V96" fill={blue?'#ca7659':'#316c68'}/>
  </g>;
}
function RoomSign({p}:{p:number}) {
  return <g opacity={p} transform={`translate(685 ${188+(1-p)*35})`}>
    <path d="M-4 92L206 92 218 109 -13 109Z" fill="#523d2c"/><path d="M9 0L181 -2 191 97 0 97Z" fill="#f1d89f" stroke="#8b6840" strokeWidth="6"/>
    <text x="96" y="31" textAnchor="middle" fill="#3f5148" fontSize="19" fontWeight="bold" letterSpacing="2">LIBRARY</text><path d="M23 41H164" stroke="#a58b61"/><text x="95" y="66" textAnchor="middle" fill="#634d38" fontFamily="Georgia" fontSize="20">Thu · lunchtime</text>
  </g>;
}
const clampTime=(t:number,a:number,b:number)=>motion(t,a,Math.max(.15,b-a));

export function BookWorld({t,mode,bring=9,swap=14}:{t:number;mode:'reader'|'brief'|'plan'|'edit'|'compare';bring?:number;swap?:number}) {
  const action=mode==='edit';
  const reach=action?clampTime(t,bring,swap-.2):0;
  const receive=action?motion(t,swap,.95):0;
  const withdraw=action?motion(t,swap+.9,1.5):0;
  const carry=action?motion(t,swap+2.25,1.35):0;
  const hesitation=mode==='reader'||mode==='plan' ? motion(t,1.4,1.5)-.82*motion(t,4.8,1.4):0;
  const compare=mode==='compare',share=compare?motion(t,bring,1.9):0;
  // Each cover changes owner exactly once. The child's teal sleeve returns with the blue book.
  const leftHandX=195+90*hesitation+214*reach+132*receive-262*carry+(compare?140*share:0);
  const leftHandY=392-35*hesitation-15*reach+26*receive;
  const rightHandX=1085-378*reach-140*receive+230*withdraw-(compare?277*share:0);
  const coralX=action?255+212*reach+120*receive+190*withdraw:252+90*hesitation+(compare?142*share:0);
  const blueX=action?817-133*reach-107*receive-36*withdraw-262*carry:803-(compare?68*share:0);
  const drift=mode==='reader'?motion(t,0,4):mode==='compare'?motion(t,0,2):0;
  return <div style={{position:'absolute',inset:0,overflow:'hidden',borderRadius:16,background:'#654c32'}}>
    <Img src={staticFile('discovery/illustrations/library-desk.jpg')} style={{width:'100%',height:'100%',objectFit:'cover',filter:'brightness(.9) saturate(.84)',scale:1.025+.035*drift,objectPosition:'center 61%'}}/>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,#4a321e26,transparent 65%)'}}/>
    <svg viewBox="0 0 1000 530" preserveAspectRatio="none" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <RoomSign p={action?motion(t,bring,1.1):mode==='brief'?motion(t,6,1):compare?1:0}/>
      <ClothBook x={blueX} y={399-13*reach-6*receive+18*carry} angle={9-18*receive+14*carry} blue size={.91}/>
      <ClothBook x={coralX} y={390-35*hesitation-20*reach-13*receive-7*withdraw} angle={-7+8*hesitation+11*reach+7*withdraw} size={.95}/>
      <Hand x={rightHandX} y={396-31*reach-14*receive} angle={3-8*receive} mirror open={withdraw}/>
      <Hand x={leftHandX} y={leftHandY} angle={2-7*hesitation-9*reach+12*receive} open={receive*(1-carry)}/>
      {mode==='reader'&&<g opacity={motion(t,6,1.2)} transform="translate(405 196)"><rect x="-24" y="-45" rx="25" width="54" height="58" fill="#fff3cf"/><text x="3" y="0" fill="#4e6256" textAnchor="middle" fontSize="40" fontFamily="Georgia">?</text></g>}
    </svg>
  </div>;
}

function ComposeComputer({t,check}:{t:number;check:boolean}) {
  const opened=motion(t,.18,1.6), ready=motion(t,3.2,1.0);
  const action=motion(t,6.0,.7), point=motion(t,check?10:8,.7),period=check?motion(t,13.6,.22):0;
  const typingLine=check?'You could paint with me':'';
  return <g transform="translate(93 161)">
    <ellipse cx="255" cy="287" rx="250" ry="24" fill="#352c29" opacity=".35"/>
    <g transform={`translate(15 ${30+30*(1-opened)}) scale(1 ${.74+.26*opened}) skewX(-3)`}>
      <path d="M10 0H405Q414 0 416 9L432 209Q430 216 422 216H15Q5 216 4 207L0 10Q0 2 10 0Z" fill="#4b5a55" stroke="#2d3936" strokeWidth="6"/>
      <path d="M14 14H400L416 200H19Z" fill="#f7f1dd"/>
      <path d="M14 14H400L402 43H15Z" fill="#587b72"/>
      <text x="30" y="36" fill="#fff5d7" fontFamily="sans-serif" fontSize="18" fontWeight="bold">New email</text>
      <g fontFamily="sans-serif" fill="#38544d">
        <text x="31" y="72" fontSize="16">To</text><text x="73" y="73" fontSize="21" opacity={ready}>Art club newcomer</text>
        <path d="M29 86H389" stroke="#c9cfba"/>
        {check?<g><text x="31" y="118" fontSize="20">You’re welcome to join us!</text>
          <text x="31" y="155" fontSize="20">{typingLine}<tspan opacity={period} fontWeight="bold" fill="#8a402c">.</tspan></text>
          <path d="M31 124H233" stroke="#e0aa6f" strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ready}/>
          <path d="M31 162H233" stroke="#75a495" strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-action}/>
          <path d="M239 137v23" opacity={point*(1-period)} stroke="#a5593d" strokeWidth="2"/>
        </g>:<g opacity={ready}><path d="M32 104v25" stroke="#a5593d" strokeWidth="3" opacity={.45+.55*(.5+.5*Math.cos(t*Math.PI*2/1.6))}/></g>}
      </g>
    </g>
    <path d="M21 247L446 247 495 286Q497 292 485 295L0 295Q-13 293 -8 286Z" fill="#8e9b8b" stroke="#465a52" strokeWidth="3"/>
    <path d="M31 252H436L463 273H11Z" fill="#51675f"/>
    {[0,1,2].map(row=><g key={row} stroke="#acb5a1" strokeWidth="1">{Array.from({length:17},(_,i)=><path key={i} d={`M${27+24*i-row*2} ${254+6*row}h19`}/>)}</g>)}
    <path d="M202 277H281L294 286H195Z" fill="#708477" stroke="#596e63"/>
  </g>;
}
export function ArtWorld({t,check=false}:{t:number;check?:boolean}) {
  const ready=motion(t,check?1:3,1.9), brush=motion(t,check?5:11,2.3);
  const close=check?motion(t,1.2,2.8):0;
  return <div style={{position:'absolute',inset:0,overflow:'hidden',borderRadius:16,background:'#7f795d'}}>
    <div style={{position:'absolute',inset:0,transformOrigin:'0 0',transform:`translate(${-10*close}%, ${-49*close}%) scale(${1+.95*close})`}}>
    <Img src={staticFile('discovery/illustrations/art-room.jpg')} style={{width:'100%',height:'100%',objectFit:'cover',scale:1.035+.04*ready}}/>
    <svg viewBox="0 0 1000 530" preserveAspectRatio="none" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
      <ComposeComputer t={t} check={check}/>
      <g transform={`translate(${886-83*brush} ${511-35*brush}) rotate(${-30-8*brush})`}>
        <path d="M-7 -179Q-8 -212 0 -227Q11 -212 6 -179Z" fill="#5d5542"/><path d="M-7 -182L7 -182 7 -145 -6 -145Z" fill="#c8c5aa" stroke="#8a998a" strokeWidth="2"/>
        <path d="M-6 -144L7 -144 3 49Q0 62 -4 50Z" fill="#b66347"/>
        <Hand x={-5} y={6} angle={-24} mirror/>
      </g>
    </svg></div>
  </div>;
}
