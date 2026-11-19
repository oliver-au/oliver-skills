
const spokes = Array.from({length:28}, (_,i) => i * 360/28);
const Wheel = ({x,turn}:{x:number;turn:number}) => <g transform={`translate(${x} 430)`}>
  <circle r="100" fill="none" stroke="#433c32" strokeWidth="15"/>
  <circle r="96" fill="none" stroke="#e3bf86" strokeWidth="6"/>
  <circle r="91" fill="none" stroke="#70837b" strokeWidth="4"/>
  <g transform={`rotate(${turn})`}>{spokes.map(angle => <path key={angle} transform={`rotate(${angle})`} d="M-5 8L0 -91" stroke="#52685e" strokeWidth="1.8"/>)}
  <path d="M0 -88v8" stroke="#203b36" strokeWidth="3"/></g>
  <circle r="12" fill="#31544e" stroke="#b0b2a0" strokeWidth="4"/>
</g>;

const Bicycle = ({turn}:{turn:number}) => <g>
  <ellipse cx="515" cy="536" rx="270" ry="11" fill="#4d4936" opacity=".18"/>
  <Wheel x={329} turn={turn}/><Wheel x={707} turn={turn}/>
  <g fill="none" strokeLinejoin="round" strokeLinecap="round">
    <path d="M325 430L522 443L524 420L330 422Z" fill="#d8b380" stroke="#374f47" strokeWidth="4"/>
    <path d="M329 430L443 277L509 430L329 430M443 277L633 260L509 430L637 280M637 269L707 430" stroke="#224c49" strokeWidth="14"/>
    <path d="M329 426L443 273L509 426M443 273L631 256M511 420L634 277" stroke="#73aaa0" strokeWidth="5"/>
    <path d="M637 273L626 225L652 219L660 197L687 195" stroke="#40584e" strokeWidth="8"/>
    <path d="M670 196L697 194" stroke="#774736" strokeWidth="12"/>
    <path d="M647 221Q717 237 685 346" stroke="#4f5247" strokeWidth="3"/>
    <path d="M445 281L432 245" stroke="#516961" strokeWidth="9"/>
    <path d="M409 243Q422 238 442 243L459 245" stroke="#714734" strokeWidth="14"/>
    <path d="M241 380Q319 280 409 371M627 365Q697 282 787 372" stroke="#735641" strokeWidth="6"/>
    <path d="M252 345L390 345L334 423M306 345L330 426" stroke="#4d645d" strokeWidth="5"/>
    <path d="M469 376L512 424" stroke="#d0a369" strokeWidth="3"/>
    <circle cx="511" cy="430" r="29" stroke="#465449" strokeWidth="6" fill="#b7b5a0"/>
    <circle cx="511" cy="430" r="18" stroke="#657468" strokeWidth="3"/>
    <path d="M484 449L539 410M473 450L489 450M538 408L555 408" stroke="#3c4e45" strokeWidth="6"/>
    <path d="M539 442L562 497" stroke="#405148" strokeWidth="5"/>
  </g>
  <circle cx="652" cy="233" r="12" fill="#e9c784" stroke="#637166" strokeWidth="4"/>
</g>;

const fern = (x:number,y:number,scale:number) => <g transform={`translate(${x} ${y}) scale(${scale})`}>
  {Array.from({length:11},(_,i)=><g key={i} transform={`rotate(${(i-5)*10})`}><path d="M0 0Q-20 -47 1 -103Q14 -58 0 0" fill={['#627d66','#52705a','#8b9b72'][i%3]}/><path d="M0 0Q-3 -40 0 -83" fill="none" stroke="#84937a" strokeWidth="1.8"/></g>)}
  <path d="M-39 -5H39L31 51Q0 63 -30 51Z" fill="#b67455"/><path d="M-42 -8H42V3H-42Z" fill="#ce916c"/>
</g>;

export const CycleShop = ({seconds,opacity}:{seconds:number;opacity:number}) => {
  const glide=Math.min(1,seconds/5);
  const camera=1-(glide*glide*(3-2*glide));
  const tagAngle=Math.sin(seconds*3.0)*5.4*Math.exp(-seconds*.32);
  return <g opacity={opacity}>
    <defs>
      <linearGradient id="cycle-stucco" x2="1" y2=".8" gradientUnits="objectBoundingBox"><stop stopColor="#e9d1a6"/><stop offset="1" stopColor="#c5a580"/></linearGradient>
      <linearGradient id="cycle-glass" x2="1" y2="1"><stop stopColor="#96b8ab"/><stop offset="1" stopColor="#718d85"/></linearGradient>
      <pattern id="cycle-grain" width="63" height="49" patternUnits="userSpaceOnUse"><path d="M4 11l8 -1M24 33h7m14 -28h4m-8 37h11" stroke="#695d4a" opacity=".13" strokeWidth="1.5"/><circle cx="16" cy="22" r="1" fill="#f9e6b9"/></pattern>
      <pattern id="cycle-brick" width="164" height="50" patternUnits="userSpaceOnUse"><path d="M0 0H164M0 25H164M83 0v25M9 25v25" fill="none" stroke="#b99570" strokeWidth="2" opacity=".55"/></pattern>
      <clipPath id="shop-window"><rect x="163" y="96" width="614" height="267" rx="4"/></clipPath>
    </defs>
    <g transform={`translate(${-8-89*camera} ${-29*camera}) scale(${1.02+.12*camera})`}>
      <path fill="url(#cycle-stucco)" d="M0 0h1020v590H0z"/><path fill="url(#cycle-brick)" d="M0 0h1020v419H0z"/>
      <path fill="#e7cf9f" d="M0 412h1020v178H0z"/><path d="M0 429h1020M0 504h1020M75 590l170 -178m59 178 104 -178m121 178 37 -178m233 178 -79 -178m272 178 -144 -178" fill="none" stroke="#beaa85" strokeWidth="2"/>
      <path d="M135 72h672v322H135z" fill="#59756a"/><path d="M146 83h650v296H146z" fill="#e4c799"/>
      <rect x="163" y="96" width="614" height="267" fill="url(#cycle-glass)"/>
      <g clipPath="url(#shop-window)"><path d="M129 285L281 207L321 222L392 157L561 227L643 183L822 236V379H129Z" fill="#78988a"/>
        <path d="M126 295Q244 258 384 282T770 265v120H126Z" fill="#607f72"/>
        {[218,260,652,710,748].map((x,i)=><g key={x} fill="#456e62" transform={`translate(${x} ${264+i%2*19})`}><path d="M-2 10v83h4V10z"/><circle r={23+i%3*6}/><circle cx="11" cy="2" r="18"/></g>)}
        <path d="M207 91h77l-118 207h-60zm114 0h18L176 363h-19zm345 0h31L537 368h-31z" fill="#e0ddbb" opacity=".16"/>
      </g>
      {[359,574].map(x=><g key={x}><path d={`M${x} 95v269`} stroke="#4b675d" strokeWidth="10"/><path d={`M${x+4} 95v269`} stroke="#d7c098" strokeWidth="2"/></g>)}
      <path d="M152 365h637v16H152z" fill="#38584e"/><path d="M142 380h659v9H142z" fill="#ad9976"/>
      <g transform="translate(836 98)"><path fill="#827b64" d="M0 0h116v318H0z"/><path fill="#9ea58b" d="M8 8h100v305H8z"/><path fill="#66867b" d="M17 21h82v121H17z"/><path fill="none" stroke="#829481" strokeWidth="4" d="M20 170h76v114H20z"/><circle cx="87" cy="157" r="5" fill="#594d37"/></g>
      <path d="M127 1h685l36 71v18H100V72Z" fill="#b5664f"/>
      {Array.from({length:11},(_,i)=><path key={i} d={`M${133+i*62} 1h30l${(i-4)*1.1} 70h-34Z`} fill="#ddc49b"/>)}
      <path d="M99 72h750v13H99z" fill="#735e48"/><path d="M108 87l47 26h628l63 -26Z" fill="#304e43" opacity=".23"/>
      <g transform="translate(32 122)"><path d="M15 0h62v81H15z" fill="#7b795e"/><path d="M21 6h50v69H21z" fill="#c2ae89"/><circle cx="46" cy="43" r="15" fill="none" stroke="#6f7b67" strokeWidth="3"/><path d="M29 62h32" stroke="#7a7f6a" strokeWidth="2"/></g>
      {fern(87,400,.74)}{fern(958,426,.89)}
      <g fill="#556e57" opacity=".11"><path d="M0 492l172 -49 220 1L170 493zM609 533l190 -32 131 3 -189 40z"/><path d="M879 486l136 -49v23l-97 32z"/></g>
      <g fill="none" stroke="#948467" strokeWidth="1.5" opacity=".74"><path d="M12 550l40 -13 22 3 36 -15m-48 -19 22 -11 29 -1m596 35 49 7 19 -3 24 6m37 -38 30 3 19 -6 31 -1"/></g>
      <g fill="#416453" opacity=".22"><path d="M-25 38q87 -59 114 29 -30 -8 -51 16 7 -24 -30 -4z"/><path d="M-9 76q42 -32 61 11 -30 -4 -47 13z"/></g>
      <Bicycle turn={glide*12}/>
      <g transform={`rotate(${tagAngle} 665 218)`}>
        <path d="M665 218q33 6 29 52" fill="none" stroke="#735c40" strokeWidth="2.7"/>
        <path d="M690 267l28 -5 52 11 -7 53 -78 -12z" fill="#5d523d" opacity=".20" transform="translate(3 5)"/>
        <path d="M690 267l28 -5 52 11 -7 53 -78 -12z" fill="#f6d994" stroke="#98784f" strokeWidth="2.5"/>
        <circle cx="696" cy="273" r="3.5" fill="#98784f"/><text x="727" y="303" textAnchor="middle" fontSize="24" fontWeight="800" fill="#493e2d" transform="rotate(7 727 303)">$200</text>
      </g>
      <path fill="url(#cycle-grain)" d="M0 0h1020v590H0z"/>
    </g>
  </g>;
};
