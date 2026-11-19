import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clipSeconds, Narration, PauseMeter, P, Shell} from '../Shared';

const choices = [
  {letter: 'A', label: 'Blue square', colour: '#64a6e0', round: false},
  {letter: 'B', label: 'Red circle', colour: P.red, round: true},
  {letter: 'C', label: 'Red square', colour: P.red, round: false},
  {letter: 'D', label: 'Blue circle', colour: '#64a6e0', round: true},
];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const LogicPractice = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const answerAt = clipSeconds('logic-practice') + 4.6;
  const reveal = interpolate(frame, [answerAt * fps, (answerAt + .5) * fps], [0, 1], clamp);
  return <Shell subject="THINKING SKILLS" step="06 / YOUR TURN" title="Which example breaks this claim?">
    <Narration id="logic-practice"/>
    <Narration id="logic-practice-answer" from={answerAt}/>
    <div style={{position: 'absolute', top: 291, left: 150, right: 150, textAlign: 'center', fontSize: 74, fontWeight: 650}}>“All squares are blue.”</div>
    <div style={{position: 'absolute', left: 167, right: 167, top: 437, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 38}}>
      {choices.map(({letter, label, colour, round}, i) => <div key={letter} style={{position: 'relative', textAlign: 'center', opacity: letter === 'C' ? 1 : 1 - .75 * reveal}}>
        <div style={{
          width: 174, height: 174, margin: '10px auto 0', background: colour, borderRadius: round ? '50%' : 5,
          scale: interpolate(frame, [(.6 + i * .2) * fps, (1.1 + i * .2) * fps], [.85, 1], clamp),
        }}/>
        {letter === 'C' && <div style={{position: 'absolute', left: '50%', top: -3, width: 200, height: 200, transform: 'translateX(-50%)', boxSizing: 'border-box', border: `3px solid ${P.ink}`, borderRadius: 8, opacity: reveal}}/>}
        <div style={{fontSize: 29, letterSpacing: 2, color: P.muted, marginTop: 25}}>{letter}</div>
        <div style={{fontSize: 36, color: P.ink, marginTop: 8}}>{label}</div>
      </div>)}
    </div>
    <div style={{position: 'absolute', top: 798, left: 110, right: 110, textAlign: 'center', fontSize: 44, color: P.mint, opacity: reveal}}>C · One square of another colour disproves the claim.</div>
    <PauseMeter start={clipSeconds('logic-practice') + .3} duration={4} label="CHOOSE A, B, C OR D"/>
  </Shell>;
};
