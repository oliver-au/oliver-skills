import {useId} from 'react';

type Point = {x: number; y: number};
type NinaProps = {
  x: number;
  groundY: number;
  /** Distance along the walk, measured in complete strides. */
  phase: number;
  walk: number;
  gesture?: number;
  time?: number;
};

const tau = Math.PI * 2;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const unit = (n: number) => Math.min(1, Math.max(0, n));
const wrap = (n: number) => n - Math.floor(n);
const length = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);
const limbAngle = (a: Point, b: Point) => Math.atan2(a.x - b.x, b.y - a.y) * 180 / Math.PI;
const bone = (a: Point, b: Point) => `translate(${a.x} ${a.y}) rotate(${limbAngle(a,b)})`;

/** Two joined rigid segments. Knees fold forwards while elbows fold backwards. */
function joint(start: Point, end: Point, upper: number, lower: number, knee: boolean): Point {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const d = Math.max(.01, length(start, end));
  const along = Math.min(d, (upper * upper - lower * lower + d * d) / (2 * d));
  const across = Math.sqrt(Math.max(0, upper * upper - along * along)) * (knee ? 1 : -1);
  return {x: start.x + (along * dx + across * dy) / d, y: start.y + (along * dy - across * dx) / d};
}

function anklePose(phase: number, walk: number, front: boolean) {
  const p = wrap(phase + (front ? 0 : .5));
  const planted = p < .57;
  const swing = unit((p - .57) / .43);
  const ease = swing * swing * (3 - 2 * swing);
  const offset = planted ? mix(23, -23, p / .57) : mix(-23, 23, ease);
  const lift = planted ? 0 : Math.sin(Math.PI * swing) ** 1.4 * 19;
  const pitch = planted ? 0 : 10 * Math.sin(tau * swing);
  return {
    x: mix(front ? 7 : -9, offset, walk),
    y: -8 - lift * walk,
    pitch: pitch * walk,
  };
}

function Leg({hip, phase, walk, front}: {hip:Point; phase:number; walk:number; front:boolean}) {
  const ankle = anklePose(phase, walk, front);
  // At rest the weight-bearing knee is nearly straight. A stride needs room for toe clearance.
  const knee = joint(hip, ankle, mix(35.7, 38, walk), mix(34.1, 36, walk), true);
  const thigh = length(hip, knee);
  const shin = length(knee, ankle);
  const cloth = front ? '#33545c' : '#273f4a';
  const edge = front ? '#658087' : '#475f65';
  return <g>
    <g transform={bone(hip,knee)}>
      <path d={`M-8 -3 Q-12 ${thigh*.34} -6 ${thigh+1} Q0 ${thigh+7} 7 ${thigh} L11 3 Q7 -7 -8 -3Z`} fill={cloth}/>
      <path d={`M8 7 Q8 ${thigh*.55} 4 ${thigh-4}`} fill="none" stroke={edge} strokeWidth="1.4"/>
    </g>
    <g transform={bone(knee,ankle)}>
      <path d={`M-6 -4 Q-10 ${shin*.35} -5 ${shin-3} L4 ${shin-2} Q6 ${shin*.55} 7 0 Q5 -7 -6 -4Z`} fill={cloth}/>
      <path d={`M-4 ${shin-8} l9 -.4 -.5 8 -8 .5Z`} fill={front ? '#e8debf':'#b3b1a1'}/>
      <path d={`M-4 ${shin-6} l8 -.3`} stroke="#74918e" strokeWidth="1.5"/>
    </g>
    <g transform={`translate(${ankle.x} ${ankle.y}) rotate(${ankle.pitch})`}>
      <path d="M-5 -1 Q-2 2 3 0 L6 -2 Q8 -1 10 1 L17 3.1 Q19 3.6 19 6 L16 7 H-6 Q-7 5 -5 -1Z" fill={front?'#f1e5c9':'#c5bfaa'}/>
      <path d="M-6 2 L-2 3 2 2 6 0 8 1 3 5 -6 5Z" fill={front?'#dc7051':'#ad624e'}/>
      <path d="M-6 5 Q3 6 16 4.5 L19 4.2 19 6.7 Q13 8 -5 8 Q-7 7 -6 5Z" fill="#32494d"/>
      <path d="M6.4 -.4 l4 2 M8.2 1 l3.5 1.3" fill="none" stroke="#fff6e1" strokeWidth="1.3" strokeLinecap="round"/>
    </g>
  </g>;
}

function Arm({shoulder, wrist, front}:{shoulder:Point;wrist:Point;front:boolean}) {
  const elbow = joint(shoulder, wrist, 24, 24, false);
  const upper = length(shoulder, elbow);
  const lower = length(elbow, wrist);
  return <g>
    <g transform={bone(shoulder,elbow)}>
      <path d={`M-6 -2 Q-7 ${upper*.6} -4.5 ${upper+1} Q1 ${upper+6} 5 ${upper} L7 1Z`} fill={front?'#b97350':'#94583f'}/>
      <path d={`M-8 -2 Q-10 6 -8 16 L6 19 9 5 Q6 -7 -3 -7Z`} fill={front?'#ed825c':'#c4654e'}/>
      <path d="M-8 13 Q-2 17 7 16 L6 19 Q0 20 -8 16Z" fill={front?'#f4ab78':'#dd9069'}/>
    </g>
    <g transform={bone(elbow,wrist)}>
      <path d={`M-4.7 -1 Q-5 ${lower*.36} -3.7 ${lower-3}
        Q-4.3 ${lower+1} -2.9 ${lower+4.3} Q-1.7 ${lower+7} .3 ${lower+6.8}
        Q2.1 ${lower+7.5} 3.1 ${lower+5.2} Q5.2 ${lower+5} 5 ${lower+2}
        L3.9 ${lower-.4} Q5.9 ${lower+.5} 6.2 ${lower-1.4} Q5.8 ${lower-3.4} 3 ${lower-5}
        L5 .3 Q5 -5 0 -5 Q-4 -5 -4.7 -1Z`} fill={front?'#c7825c':'#9c6046'}/>
      {front && <>
        <path d={`M-4.6 ${lower-10} Q-.5 ${lower-7.4} 4.6 ${lower-9.3} L4.3 ${lower-3.3}
          Q.2 ${lower-.8} -4.3 ${lower-3.1}Z`} fill="#ffd26c" stroke="#a86a39" strokeWidth=".85"/>
        <path d={`M-3.3 ${lower-8.2} Q-.3 ${lower-6.4} 2.9 ${lower-7.6}`} fill="none" stroke="#fff1b3" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="2.1" cy={lower-5.2} r="1" fill="#936631"/>
      </>}
    </g>
  </g>;
}

function Face({tilt,blink,glance,tress}:{tilt:number;blink:number;glance:number;tress:number}) {
  return <g transform={`translate(4 -135) rotate(${tilt})`}>
    <g transform={`rotate(${tress} -11 -24)`}>
      <path d="M-11 -30 C-24 -36 -31 -28 -30 -18 C-32 -12 -28 -5 -23 -3 C-20 0 -20 4 -22 6 C-11 3 -11 -8 -9 -15 C-7 -20 -6 -25 -11 -30Z" fill="#332c32"/>
      <path d="M-23 -26 Q-30 -21 -25 -13 Q-29 -6 -22 -3 M-18 -25 Q-22 -17 -20 -12" fill="none" stroke="#66504b" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M-15 -28 Q-19 -24 -18 -19" fill="none" stroke="#ecab50" strokeWidth="3.9" strokeLinecap="round"/>
    </g>
    <path d="M-8 -10 Q-11 -20 -7 -27 Q-3 -35 7 -33 Q18 -31 18 -21 L19 -15 Q20 -12 23 -10 Q24 -8 20 -7 Q20 -2 16 1 C13 4 7 4 2 2 L-2 6 -9 1Z" fill="#c78059"/>
    <path d="M-5 -12 Q-4 -4 2 -1 Q8 3 15 2 Q11 7 5 5 L-2 8 -9 1Z" fill="#ad6649"/>
    <path d="M-13 -9 Q-17 -16 -15 -25 C-14 -34 -6 -40 3 -39 C13 -40 20 -33 20 -26 Q20 -22 17 -20 Q14 -19 9 -24 Q7 -20 1 -19 Q-2 -17 -3 -12 L-6 -10 Q-10 -14 -12 -8Z" fill="#372d32"/>
    <path d="M-13 -26 C-10 -35 3 -39 12 -34 M-10 -22 Q-1 -22 4 -31 M7 -28 Q12 -23 17 -24" fill="none" stroke="#705349" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M-4 -12 C-11 -19 -13 -8 -7 -6 Q-4 -5 -3 -8" fill="#ce8964"/>
    <path d="M-8 -11 Q-6 -13 -5 -9" fill="none" stroke="#975740" strokeWidth="1.1" strokeLinecap="round"/>
    <path d="M11 -18 Q14 -20 17 -18.4" stroke="#513931" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
    <g transform={`translate(15 -14.2) scale(1 ${Math.max(.08,1-blink)})`}>
      <path d="M-3.4 0 Q-.8 -2.7 2.4 -.8 Q3.1 1.1 1.6 2 Q-1.2 2.8 -3.4 0Z" fill="#f9e6cc"/>
      <ellipse cx={.8+glance*.38} cy={.1+glance*.55} rx="1.6" ry="2" fill="#352d30"/>
      <circle cx="1.3" cy="-.8" r=".48" fill="#fff8e4"/>
    </g>
    <path d="M16.2 -2.8 q-2.5 1.6 -5.4 .1" stroke="#733f39" strokeWidth="1.25" fill="none" strokeLinecap="round"/>
    <ellipse cx="8.4" cy="-8" rx="3.2" ry="1.5" fill="#c26851" opacity=".64"/>
    <circle cx="-6" cy="-5.1" r="1.45" fill="#f5c470"/>
  </g>;
}

export function Nina({x,groundY,phase,walk,gesture=.15,time=0}: NinaProps) {
  const colourId = useId().replace(/[^a-zA-Z0-9_-]/g,'');
  const strength = unit(walk);
  const gaze = unit(gesture);
  const wave = Math.sin(tau * phase);
  const breath = Math.sin(time * 1.7);
  const bodyLift = -Math.cos(2*tau*phase) * 1.55 * strength + .65*breath*(1-strength);
  const lean = strength * 1.6;
  const hip = {x:0, y:-76.5 + bodyLift};
  const shoulder = {x:6+lean, y:-125};
  const backShoulder = {x:-4+lean, y:-124};
  const farWrist = {x: -17 + 24*wave*strength, y:-82 - 2*strength};
  const nearWrist = {
    x:mix(16 - wave*19*strength, 41, gaze),
    y:mix(-81 - 3*Math.abs(wave)*strength, -126, gaze)
  };
  const blinkPhase = wrap((time+1.1)/4.15);
  const blink = unit(1-Math.abs(blinkPhase-.6)/.021);
  return <g transform={`translate(${x} ${groundY})`} aria-label="Nina wearing a gold wristband">
    <defs>
      <linearGradient id={`jacket-${colourId}`} x1="0" y1="0" x2=".9" y2=".65">
        <stop stopColor="#faaf80"/><stop offset=".48" stopColor="#ed8c67"/><stop offset="1" stopColor="#d57557"/>
      </linearGradient>
    </defs>
    <ellipse cx="1" cy=".4" rx={26+strength*2} ry="4.2" fill="#263f42" opacity=".18"/>
    <Leg hip={{x:hip.x-3.5,y:hip.y-.6}} phase={phase} walk={strength} front={false}/>
    <Leg hip={{x:hip.x+3.5,y:hip.y}} phase={phase} walk={strength} front/>
    <g transform={`translate(0 ${bodyLift})`}>
      <Arm shoulder={backShoulder} wrist={farWrist} front={false}/>
      <g transform={`rotate(${lean} 0 -79)`}>
        <path d="M-5 -143 Q-5 -132 -10 -129 L1 -121 12 -127 8 -131 9 -140Z" fill="#a86349"/>
        <path d="M-2 -138 Q2 -134 8 -134 L8 -139Z" fill="#90513d"/>
        <path d="M-10 -130 Q-20 -128 -20 -114 L-16 -96 Q-18 -85 -17 -75 Q-8 -71 11 -76 Q15 -80 11 -94 L13 -108 Q17 -119 10 -127 L7 -129 Q-.5 -122 -10 -130Z" fill={`url(#jacket-${colourId})`}/>
        <path d="M-17 -120 Q-15 -126 -12 -125 L-8 -114 -7 -104 -12 -91 -14 -78 -18 -78 Q-17 -89 -16 -97Z" fill="#cf7157"/>
        <path d="M-17 -77 Q-5 -73 11 -78" fill="none" stroke="#d07055" strokeWidth="2.5"/>
        <path d="M-9 -130 Q-2 -123 8 -129" stroke="#f2d7a2" strokeWidth="3.3" fill="none"/>
        <path d="M-13 -83 Q-9 -84 -5 -87" fill="none" stroke="#d5795c" strokeWidth="1.5" strokeLinecap="round"/>
        <Face tilt={gaze*8 + strength*1.8 + .6*breath} blink={blink} glance={gaze} tress={-strength*wave*4.5+breath*.8}/>
      </g>
      <Arm shoulder={shoulder} wrist={nearWrist} front/>
    </g>
  </g>;
}
