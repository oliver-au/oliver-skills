import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {clipSeconds, Narration} from '../Shared';
import {CycleShop} from './CycleShop';

const prices = [180,198,200,202,220];
const ease = (t:number,from:number,to:number) => {
  const part=Math.max(0,Math.min(1,(t-from)/(to-from)));
  return part*part*(3-2*part);
};
const paper='#f1e1bc', ink='#263e37', green='#4d8475', rust='#b85b44';

const Ledger = ({t}:{t:number}) => {
  const add=ease(t,2.8,4.65), regroup=ease(t,9.22,10.7), lift=ease(t,12.72,13.80);
  const final=ease(t,13.9,14.75),stamp=ease(t,14.1,15),opening=t<8.9,measuring=regroup>.99;
  const x=145,unit=61,top=365,barWidth=671,groupWidth=barWidth/10;
  const label= t<4.9?'Starting price':t<13.85?'New price':'Final price';
  const amount=t<4.9?'$200':t<13.85?'$220':'$198';
  return <g>
    <defs>
      <pattern id="ledger-lines" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M34 0H0V34" fill="none" stroke="#9caa8a" opacity=".2" strokeWidth="1"/></pattern>
      <pattern id="ledger-stripe" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 12L12 0" stroke="#e6c28c" strokeWidth="3" opacity=".55"/></pattern>
      <linearGradient id="ledger-dark" x2="0" y2="1"><stop stopColor="#44645a"/><stop offset="1" stopColor="#354e45"/></linearGradient>
    </defs>
    <rect width="1680" height="605" rx="20" fill="#bba582"/>
    <path d="M0 23h1680m-1680 550h1680" stroke="#998263" strokeWidth="2"/>
    <g transform="translate(38 24)">
      <rect x="5" y="7" width="987" height="553" rx="6" fill="#897d5d" opacity=".4"/>
      <rect width="987" height="553" rx="6" fill={paper}/><rect width="987" height="553" rx="6" fill="url(#ledger-lines)"/>
      <path d="M61 0v553" stroke="#cc8f76" strokeWidth="2" opacity=".64"/>
      <text x="93" y="67" fill={ink} fontSize="39" fontWeight="700">The price strip</text>
      <path d="M94 85h780" stroke="#95a18b" strokeWidth="2"/>
      <text x="99" y="142" fill={ink} fontSize="38" fontWeight="650">{opening?'Ten equal parts of $200':measuring?'Ten equal parts of $220':'Re-divide the new price.'}</text>
      <text x="99" y="188" fill="#53675b" fontSize="29" opacity={ease(t,1.75,2.28)}>{opening?'Each part is $20.':measuring?'Each part is $22.':'Keep the strip the same length.'}</text>
      <g transform="translate(0 -82)">
        <path d={`M${x} ${top+104}v15h${10*unit}v-15`} fill="none" stroke="#8e8267" strokeWidth="2.8" strokeDasharray="7 5"/>
        <text x={x+unit*5} y={top+156} textAnchor="middle" fontSize="25" fill="#635e4c">original $200</text>
        <rect x={x} y={top+8} width={unit*10+unit*add} height="70" rx="4" fill="#a99d77" opacity=".55"/>
        <rect x={x} y={top} width={unit*10+unit*add} height="74" rx="4" fill={green}/>
        <rect x={x+unit*10} y={top} width={unit*add} height="74" fill="#bd9559" opacity={1-regroup}/>
        {Array.from({length:10},(_,i)=>{const n=i+1;const px=x+unit*n+(groupWidth-unit)*n*regroup;return <path key={n} d={`M${px} ${top+1}v72`} stroke="#ecdcb5" strokeWidth={3} opacity={n===10?1-regroup:1}/>;})}
        <g opacity={ease(t,2.25,3.1)*(1-ease(t,7.8,8.7))}><path d={`M${x+unit*10+5} ${top-13} q35 -72 69 -36`} fill="none" stroke="#9f6d39" strokeWidth="3"/>
        <text x={x+unit*10+44} y={top-61} fill="#87572f" fontSize="32" textAnchor="middle" fontWeight="750">+$20</text></g>
        <g opacity={regroup}>
          <rect x={x+groupWidth*9} y={top} width={groupWidth} height="75" fill={paper} opacity={lift}/>
          <g transform={`translate(${42*lift} ${-53*lift}) rotate(${5*lift} ${x+groupWidth*9.5} ${top+37})`}>
            <rect x={x+groupWidth*9} y={top} width={groupWidth} height="74" fill={rust}/>
            <rect x={x+groupWidth*9} y={top} width={groupWidth} height="74" fill="url(#ledger-stripe)"/>
            <path d={`M${x+groupWidth*9} ${top}v74`} stroke={paper} strokeWidth="3"/>
          </g>
          <text opacity={ease(regroup,.78,1)} x={x+groupWidth*9.3+39*lift} y={top-16-49*lift} textAnchor="middle" fontSize="29" fontWeight="750" fill="#924b37">−$22</text>
        </g>
        <g opacity={final}>
          <path d={`M${x+unit*10} ${top-30}v139`} stroke="#82644b" strokeWidth="2" strokeDasharray="4 5"/>
          <path d={`M${x+groupWidth*9} ${top+86}q38 24 47 63`} fill="none" stroke={green} strokeWidth="2" strokeDasharray="5 4"/>
        </g>
      </g>
      <g opacity={ease(t,14.5,15.35)} transform={`translate(642 ${422+8*(1-ease(t,14.5,15.35))})`}>
        <rect width="299" height="113" rx="7" fill="#eee7cd" stroke="#8f9e85" strokeWidth="2"/>
        <text x="13" y="26" fontSize="19" letterSpacing="2" fill="#586858" fontWeight="760">CLOSE-UP</text>
        <path d="M16 52h225" stroke="#b2ab91" strokeWidth="3"/>
        <path d="M16 53h98" stroke={green} strokeWidth="10"/>
        <path d="M114 37v30m110 -30v30" fill="none" stroke={ink} strokeWidth="3"/>
        <path d="M117 49h103" fill="none" stroke="#ab6e4a" strokeWidth="2.5" strokeDasharray="4 4"/>
        <text x="114" y="96" textAnchor="middle" fill={ink} fontSize="26" fontWeight="720">$198</text>
        <text x="224" y="96" textAnchor="middle" fill={ink} fontSize="26" fontWeight="720">$200</text>
      </g>
    </g>
    <g transform="translate(1060 26)">
      <rect x="8" y="9" width="568" height="546" rx="9" fill="#7d745a" opacity=".4"/>
      <rect width="568" height="546" rx="9" fill="url(#ledger-dark)"/>
      <rect x="20" y="20" width="528" height="506" rx="5" fill="none" stroke="#81917c" strokeWidth="2"/>
      <text x="57" y="82" fill="#d6c89d" fontSize="26" fontWeight="650" letterSpacing="3">BICYCLE PRICE TAG</text>
      <path d="M56 104h456" stroke="#83937d" strokeWidth="2"/>
      <g transform="translate(48 136)">
        <path d="M34 0h389l41 34v112l-41 34H34L0 145V36Z" fill="#163c33" opacity=".38" transform="translate(0 7)"/>
        <path d="M34 0h389l41 34v112l-41 34H34L0 145V36Z" fill="#edcf92"/>
        <circle cx="29" cy="89" r="9" fill="#886d4d" stroke="#b39b71" strokeWidth="4"/>
        <text x="243" y="54" fill="#655038" textAnchor="middle" fontSize="28">{label}</text>
        <text x="243" y="139" fill={ink} textAnchor="middle" fontSize="94" fontWeight="780" letterSpacing="-5">{amount}</text>
      </g>
      <text x="59" y="391" opacity={ease(t,1.75,2.28)} fill="#f1e3bb" fontSize="34" fontWeight="650">{t<9.2?'$200 + $20 = '+(t>=4.9?'$220':'?'):'$220 − $22 = '+(t>=13.85?'$198':'?')}</text>
      <g opacity={stamp}><rect x="60" y="429" width="221" height="51" rx="6" fill="none" stroke="#c6cf9e" strokeWidth="2"/>
      <text x="170" y="463" fill="#dce3ad" textAnchor="middle" fontSize="25" fontWeight="700">CHOICE B</text></g>
    </g>
  </g>;
};

export const MathPractice = () => {
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),s=frame/fps;
  const questionEnd=clipSeconds('math-practice')+.3,answerAt=questionEnd+4.3;
  const t=(s-answerAt)*17.6/clipSeconds('math-practice-answer');
  const turn=ease(t,0,.68),hold=s>=questionEnd&&s<questionEnd+4;
  return <AbsoluteFill style={{fontFamily:'Manrope Variable, Arial, sans-serif',color:'#f6efe0',background:'#132322'}}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" role="img" aria-label="A bicycle outside a repair shop. The price change is demonstrated on a strip divided into ten equal parts.">
      <defs><linearGradient id="shop-matte" x2="1" y2="1"><stop stopColor="#233a34"/><stop offset="1" stopColor="#0e1d1f"/></linearGradient>
        <clipPath id="cycle-panel"><rect width="1020" height="590" rx="14"/></clipPath></defs>
      <path fill="url(#shop-matte)" d="M0 0h1920v1080H0z"/>
      <path d="M104 65h13v13h-13z" fill="#dd9074"/>
      <text x="132" y="80" fill="#eae6d9" fontWeight="800" fontSize="25" letterSpacing="3">CHLOE</text>
      <text x="265" y="80" fill="#acbbb0" fontSize="23" fontWeight="650" letterSpacing="3">MATHEMATICAL REASONING</text>
      <text x="1808" y="80" fill="#b9c6b7" textAnchor="end" fontSize="23" letterSpacing="2">PERCENTAGE CHANGE</text>
      <text x="100" y="177" fill="#f6efdc" fontSize="73" fontWeight="700" letterSpacing="-3">{t<0?'What will the bicycle cost?':'Which price are we taking 10% of?'}</text>
      <g transform="translate(110 222)" opacity={1-turn}>
        <g clipPath="url(#cycle-panel)" transform="scale(1.045 1.045)"><CycleShop seconds={s} opacity={1}/></g>
        <g transform="translate(1100 4)">
          <path d="M0 7Q0 0 8 0h572q8 0 8 8v592H0Z" fill="#dfc89f"/>
          <path d="M19 18h548v563H19Z" fill="none" stroke="#ad9472" strokeWidth="2"/>
          <text x="43" y="72" fill={ink} fontSize="40" fontWeight="700">The bicycle starts at $200.</text>
          <path d="M44 99h492" stroke="#b89f79" strokeWidth="2"/>
          <text x="45" y="150" fill="#3f665a" fontSize="37" fontWeight="700">Rise 10%</text>
          <text x="229" y="150" fill="#796d52" fontSize="27">then</text><text x="313" y="150" fill="#954c3b" fontSize="37" fontWeight="700">fall 10%</text>
          <text x="45" y="217" fill="#685e4a" fontSize="24" fontWeight="650" letterSpacing="2">FINAL PRICE</text>
          {prices.map((v,i)=><g key={v} transform={`translate(45 ${237+i*63})`}>
            <path d="M0 0h492" stroke="#b9a783" strokeWidth="1.4"/>
            <text x="2" y="42" fill="#746549" fontSize="25" fontWeight="700">{String.fromCharCode(65+i)}</text>
            <text x="60" y="44" fill={ink} fontSize="38" fontWeight="750">${v}</text>
          </g>)}
        </g>
      </g>
      {turn>0&&<g transform={`translate(110 ${225+12*(1-turn)})`} opacity={turn}><Ledger t={t}/></g>}
      {hold&&<g><text x="960" y="883" fontSize="23" textAnchor="middle" fill="#dbe2cc" letterSpacing="3">TIME TO THINK</text>
        <path d="M714 906h492" stroke="#536456" strokeWidth="3"/><path d={`M714 906h${492*(1-(s-questionEnd)/4)}`} stroke="#c8c99a" strokeWidth="5"/></g>}
    </svg>
    <Narration id="math-practice"/><Narration id="math-practice-answer" from={answerAt}/>
  </AbsoluteFill>;
};
