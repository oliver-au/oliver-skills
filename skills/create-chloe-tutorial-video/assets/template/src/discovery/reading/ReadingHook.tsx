import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {clipSeconds,ease,Eyebrow,Narration,P,Shell,SoundCue} from '../Shared';

export const ReadingHook=()=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const time=frame/fps;
 const leave=interpolate(time,[2,8],[0,180],ease);
 return <Shell subject="Reading" step="01 / THE MYSTERY">
  <Eyebrow style={{position:'absolute',left:110,top:170}}>READ BETWEEN THE LINES</Eyebrow>
  <div style={{position:'absolute',left:105,top:228,fontSize:102,fontWeight:750,letterSpacing:-5}}>Why did Ava walk away?</div>
  <div style={{position:'absolute',left:110,top:390,width:1040,fontSize:44,lineHeight:1.38,fontWeight:450,color:'#dce0dc'}}>
   At the theatre door, Ava checked the time again.<br/>
   Inside, the last audience members were leaving.<br/>
   She folded her unused ticket and walked away.
  </div>
  <svg width="580" height="500" viewBox="0 0 580 500" style={{position:'absolute',left:1230,top:255}}>
   <defs><linearGradient id="theatre-light" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#eac38a" stopOpacity=".35"/><stop offset="1" stopColor="#eac38a" stopOpacity="0"/></linearGradient></defs>
   <path d="M125 80 H455 V435 H125Z" fill="#1d2427" stroke="#4d5658" strokeWidth="3"/>
   <path d="M150 110 H430 V430 H150Z" fill="#dcb777"/>
   <path d="M150 110 H430 V430 H150Z" fill="#251b20"/>
   <path d="M150 110 H245 Q247 235 195 280 L150 295Z" fill="#703d40"/>
   <path d="M430 110 H335 Q333 235 385 280 L430 295Z" fill="#703d40"/>
   <path d="M150 430 H430 L525 500 H55Z" fill="url(#theatre-light)"/>
   <text x="290" y="58" textAnchor="middle" fontSize="28" letterSpacing="8" fill="#dcb777">THEATRE</text>
   <g transform={`translate(${leave},0)`} opacity={interpolate(time,[4,9],[.85,.12],ease)} fill="#afb6b3"><circle cx="267" cy="285" r="20"/><path d="M244 315 Q267 300 290 315 L300 395 H232Z"/><circle cx="345" cy="310" r="17"/><path d="M327 337 Q345 325 363 337 L372 402 H319Z"/></g>
   <path d="M60 435H520" stroke="#59605c" strokeWidth="2"/>
  </svg>
  <div style={{position:'absolute',left:1250,top:648,width:520,height:184,padding:'28px 34px',boxSizing:'border-box',background:'#ead2a7',color:'#272b2d',borderRadius:6,boxShadow:'0 22px 38px #0009',transform:`rotate(${interpolate(time,[.5,2],[-14,-7],ease)}deg) translateY(${interpolate(time,[.5,2],[40,0],ease)}px)`,opacity:interpolate(time,[.5,1.3],[0,1],ease)}}>
   <div style={{fontSize:21,letterSpacing:6}}>ADMIT ONE</div><div style={{fontSize:55,fontWeight:800,letterSpacing:-1,marginTop:5}}>UNUSED TICKET</div>
   <div style={{position:'absolute',right:65,top:0,bottom:0,borderLeft:'2px dashed #a68d67'}}/>
  </div>
  <div style={{position:'absolute',left:110,top:790,fontSize:48,fontWeight:650,color:P.cyan,opacity:interpolate(time,[clipSeconds('reading-hook')*.76,clipSeconds('reading-hook')*.76+.6],[0,1],ease)}}>Look for details that matter.</div>
  <Narration id="reading-hook"/><SoundCue at={1.1}/>
 </Shell>;
};
