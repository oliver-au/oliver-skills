import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {P} from '../Shared';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

/** Intentionally shared geometry: every triple follows the same visual grammar. */
export const Triple = ({values, top = 350, size = 210, start = 0.3, gap = 0.35, colour = P.ink, width = 1260}: {
  values: number[]; top?: number; size?: number; start?: number; gap?: number; colour?: string; width?: number;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <div style={{position: 'absolute', left: (1920-width)/2, top, width, display: 'flex', justifyContent: 'space-between'}}>
    {values.map((n, i) => <div key={i} style={{width: 300, textAlign: 'center', fontSize: size, fontWeight: 750, lineHeight: 1.1, letterSpacing: -10, fontVariantNumeric: 'tabular-nums', color: colour,
      opacity: interpolate(frame, [(start+i*gap)*fps, (start+i*gap+0.45)*fps], [0, 1], clamp),
      translate: `0px ${interpolate(frame, [(start+i*gap)*fps, (start+i*gap+0.65)*fps], [36, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px`,
    }}>{n}</div>)}
  </div>;
};

export const Verdict = ({label, good = true, start = 3, top = 680}: {label: string; good?: boolean; start?: number; top?: number}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  return <div style={{position: 'absolute', top, left: 180, right: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, color: good ? P.mint : P.red,
    opacity: interpolate(frame, [start*fps, (start+0.45)*fps], [0,1], clamp),
    scale: interpolate(frame, [start*fps,(start+0.6)*fps], [0.94,1], {...clamp,easing:Easing.out(Easing.cubic)}),
  }}><span style={{fontSize: 76, fontWeight: 400}}>{good ? '✓' : '×'}</span><span style={{fontSize: 64, fontWeight: 700, letterSpacing: 4}}>{label}</span></div>;
};

export const Note = ({children, top = 835, start = 5, colour = P.muted}: {children: React.ReactNode; top?: number; start?: number; colour?: string}) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  return <div style={{position:'absolute',top,left:140,right:140,textAlign:'center',fontSize:46,lineHeight:1.25,color:colour,
    opacity:interpolate(frame,[start*fps,(start+0.5)*fps],[0,1],clamp),
  }}>{children}</div>;
};

export const LinkArrow = ({left,top = 440,start = 1,label='×2',colour=P.cyan}: {left:number;top?:number;start?:number;label?:string;colour?:string}) => {
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  return <div style={{position:'absolute',left,top,width:170,color:colour,textAlign:'center',opacity:interpolate(frame,[start*fps,(start+0.4)*fps],[0,1],clamp)}}>
    <div style={{fontSize:42,marginBottom:4,fontWeight:600}}>{label}</div>
    <svg width="170" height="35" viewBox="0 0 170 35"><path d="M4 17 H156 M140 4 L156 17 L140 30" fill="none" stroke={colour} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={interpolate(frame,[start*fps,(start+0.6)*fps],[1,0],clamp)}/></svg>
  </div>;
};
