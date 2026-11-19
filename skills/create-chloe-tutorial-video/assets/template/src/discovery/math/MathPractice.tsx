import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clipSeconds, ease, Eyebrow, Narration, P, PauseMeter, Shell} from '../Shared';

const prices = [180, 198, 200, 202, 220];

export const MathPractice = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const answerAt = clipSeconds('math-practice') + 4.6;
  const show = frame >= answerAt * fps;
  return <Shell subject="Mathematical reasoning" step="06 / YOUR TURN" title={show ? 'Same trap. Different price.' : 'What is the final price?'}>
    <div style={{position: 'absolute', left: 110, top: 310, fontSize: 70, fontWeight: 600}}>
      $200 bicycle <span style={{color: P.mint, marginLeft: 40}}>+10%</span>
      <span style={{color: P.muted, margin: '0 35px'}}>then</span><span style={{color: P.red}}>−10%</span>
    </div>
    {show ? <>
      <div style={{
        position: 'absolute', left: 110, top: 500, fontSize: 138, fontWeight: 750, letterSpacing: -6,
        opacity: interpolate(frame, [answerAt * fps, (answerAt + .6) * fps], [0, 1], ease),
      }}>
        $200 <span style={{fontSize: 77, color: P.muted}}>→</span> $220 <span style={{fontSize: 77, color: P.muted}}>→</span> <span style={{color: P.mint}}>$198</span>
      </div>
      <div style={{position: 'absolute', left: 110, top: 745, fontSize: 49, color: P.muted}}>B · Add <span style={{color: P.mint}}>$20</span>. Then subtract <span style={{color: P.red}}>$22</span>.</div>
    </> : <div style={{position: 'absolute', left: 110, right: 110, top: 520, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 30}}>
      {prices.map((price, index) => <div key={price} style={{paddingTop: 22, borderTop: `3px solid ${P.line}`}}>
        <Eyebrow color={P.muted}>{String.fromCharCode(65 + index)}</Eyebrow>
        <div style={{fontSize: 97, fontWeight: 750, letterSpacing: -5}}>${price}</div>
      </div>)}
    </div>}
    <PauseMeter start={clipSeconds('math-practice') + .3} duration={4} label="CHOOSE ONE OF THE FIVE PRICES"/>
    <Narration id="math-practice"/>
    <Narration id="math-practice-answer" from={answerAt}/>
  </Shell>;
};
