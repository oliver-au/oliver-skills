// The fingertip is the local origin. Both hands can follow the travelling cover.
export function ClueHand({x,y,mirror=false,other=mirror,angle=0,open=0}:{x:number;y:number;mirror?:boolean;other?:boolean;angle?:number;open?:number}) {
  return <g transform={`translate(${x} ${y}) scale(${mirror?-1:1} 1) rotate(${angle})`}>
    <path d="M-246 -31Q-192 -36 -133 -21L-75 -19Q-52 -24 -36 -31L-3 -43Q5 -46 8 -39Q8 -33 0 -29L-19 -18Q-4 -19 16 -17Q23 -15 22 -10Q20 -6 13 -6L-4 -4Q7 -4 9 1Q8 5 2 6L-10 8Q-3 8 -4 14Q-6 18 -14 19L-39 22Q-46 30 -66 29L-106 19 -231 31Z" fill={other?'#9d6349':'#c78a68'} stroke={other?'#784c3e':'#945d4a'} strokeWidth="2.4"/>
    <path d={`M-60 1Q-49 -8 -45 -13 L${-18+10*open} ${-43-9*open}Q${-12+10*open} ${-48-8*open} ${-8+10*open} ${-44-9*open}Q${-2+10*open} ${-40-8*open} ${-6+10*open} ${-34-8*open}L-19 -11 -27 5`} fill={other?'#bc805e':'#e4a381'} stroke={other?'#855040':'#a66952'} strokeWidth="2.2"/>
    <path d="M-20 -9Q-10 -7 6 -9M-24 3Q-13 2 0 0M-28 12Q-18 12 -12 10M-76 -3Q-67 8 -69 19" stroke={other?'#885443':'#ae7059'} fill="none" strokeWidth="1.5"/>
    <path d="M-823 171Q-610 148 -421 92Q-352 66 -314 35Q-293 17 -266 11Q-198 -7 -117 -34L-108 32Q-196 49 -254 65Q-273 71 -294 88Q-348 132 -405 153Q-590 219 -807 260Z" fill={other?'#af6143':'#355d5f'} stroke={other?'#884c38':'#214b4e'} strokeWidth="3"/>
    <g fill="none" stroke={other?'#884f3b':'#234e50'} opacity=".6" strokeWidth="2.2"><path d="M-288 24q18 2 28 14M-309 72q34 -11 55 -9M-184 -4q13 3 31 17"/></g>
    <path d="M-139 -36L-115 -35 -108 31 -135 36Z" fill={other?'#c78663':'#6d8b7c'} stroke={other?'#945e45':'#48685f'} strokeWidth="2"/>
    {Array.from({length:8},(_,i)=><path key={i} d={`M${-137+i*2.8} -31l7 61`} stroke={other?'#9b684e':'#4d6a62'} strokeWidth="1"/>)}
  </g>;
}
