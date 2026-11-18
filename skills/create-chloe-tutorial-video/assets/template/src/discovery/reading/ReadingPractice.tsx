import type {CSSProperties} from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {clipSeconds, ease, Narration, P, PauseMeter, Shell} from '../Shared';

export const ReadingPractice = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const practiceSeconds = clipSeconds('reading-practice');
  const answerAt = practiceSeconds + 4.6;
  const reveal = interpolate(frame, [answerAt * fps, (answerAt + 0.55) * fps], [0, 1], ease);
  const entrance = interpolate(frame, [0.15 * fps, 0.85 * fps], [0, 1], ease);
  const incorrectOpacity = 1 - reveal * 0.72;
  const clueStyle: CSSProperties = {
    backgroundColor: `rgba(64, 142, 101, ${reveal * 0.22})`,
    boxDecorationBreak: 'clone',
    WebkitBoxDecorationBreak: 'clone',
  };
  const optionStyle: CSSProperties = {
    position: 'absolute', left: 1050, width: 760, height: 107,
    boxSizing: 'border-box', border: `2px solid ${P.line}`,
    borderRadius: 8, background: '#111b20',
  };
  const letterStyle: CSSProperties = {
    position: 'absolute', left: 27, top: 33,
    fontSize: 30, fontWeight: 800, color: P.muted,
  };
  const optionTextStyle: CSSProperties = {
    position: 'absolute', left: 92, right: 24, top: 2, bottom: 2, display: 'flex', alignItems: 'center',
    fontSize: 38, fontWeight: 550, lineHeight: 1.2, letterSpacing: -0.8,
  };

  return <Shell subject="READING" step="06 / YOUR TURN" title="What do the clues suggest?">
    <div style={{
      position: 'absolute', left: 110, top: 295, width: 880, height: 465,
      boxSizing: 'border-box', padding: '29px 42px 34px',
      background: '#eee9dc', color: '#243331', borderRadius: 6,
      boxShadow: '0 14px 45px #00000030', opacity: entrance,
      transform: `translateY(${(1 - entrance) * 18}px)`,
    }}>
      <div style={{fontSize: 21, fontWeight: 800, letterSpacing: 3, color: '#63706a', marginBottom: 20}}>
        ORIGINAL PRACTICE PASSAGE
      </div>
      <div style={{fontSize: 42, fontWeight: 500, lineHeight: 1.4, letterSpacing: -0.65}}>
        <div style={{marginBottom: 13}}>At the end of the school day, Noah opened his schoolbag.</div>
        <div style={{marginBottom: 13}}>His <span style={clueStyle}>packed lunch was untouched.</span></div>
        <div>He tucked <span style={clueStyle}>that day’s canteen receipt</span> into his pocket.</div>
      </div>
    </div>

    {[
      ['A', 'He bought food at the canteen.'],
      ['B', 'He forgot his lunch money.'],
      ['C', 'He packed a friend’s lunch.'],
      ['D', 'He broke his lunchbox at school.'],
    ].map(([letter, answer], index) => {
      const correct = letter === 'A';
      const marked = correct && reveal > 0;
      return <div key={letter} style={{
        ...optionStyle, top: 295 + index * 122,
        borderColor: marked ? P.mint : P.line,
        opacity: correct ? 1 : incorrectOpacity,
      }}>
        <div style={{...letterStyle, color: marked ? P.mint : P.muted}}>{letter}</div>
        <div style={{...optionTextStyle, color: marked ? P.mint : P.ink}}>{answer}</div>
      </div>;
    })}

    <PauseMeter start={practiceSeconds + 0.3} duration={4} label="Choose A, B, C or D"/>
    <div style={{
      position: 'absolute', left: 110, right: 110, top: 800,
      fontSize: 43, fontWeight: 600, lineHeight: 1.3, textAlign: 'center',
      color: P.mint, opacity: reveal, transform: `translateY(${(1 - reveal) * 10}px)`,
    }}>
      A · Two clues support a canteen purchase.
    </div>
    <Narration id="reading-practice"/>
    <Narration id="reading-practice-answer" from={answerAt}/>
  </Shell>;
};
