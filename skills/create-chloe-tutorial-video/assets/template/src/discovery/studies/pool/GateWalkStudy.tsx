import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Pool} from './Pool';

// During 57% of a stride, the support shoe travels backwards 46 drawing units
// relative to the hips. Match that displacement to travel across the scene.
const strideLength = 46 / 0.57;
const startX = 280;
const travel = 330;
const duration = 4.55;
const ramp = 0.43;

function crossTheGate(seconds: number) {
  const elapsed = Math.min(duration, Math.max(0, seconds - 1.24));
  const remaining = duration - elapsed;
  const topSpeed = travel / (duration - ramp);
  let distance = topSpeed * (elapsed - ramp / 2);
  if (elapsed < ramp) distance = topSpeed * elapsed ** 2 / (2 * ramp);
  if (remaining < ramp) distance = travel - topSpeed * remaining ** 2 / (2 * ramp);

  return {
    x: startX + distance,
    phase: distance / strideLength + 0.21,
    walk: Math.min(1, elapsed / ramp, remaining / ramp),
  };
}

export function GateWalkStudy() {
  const {fps} = useVideoConfig();
  const seconds = useCurrentFrame() / fps;
  const release = Math.max(0, Math.min(1, (seconds - 0.32) / 1.08));
  const gesture = 0.8 * (1 - release * release * (3 - 2 * release));

  return <AbsoluteFill style={{backgroundColor: '#101a1f', justifyContent: 'center', padding: '0 5%'}}>
    <div style={{width: '100%', aspectRatio: '9 / 4'}}>
      <Pool {...crossTheGate(seconds)} time={seconds} gesture={gesture}/>
    </div>
  </AbsoluteFill>;
}
