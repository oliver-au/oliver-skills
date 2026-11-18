import narration from '../cube-narration.json';
import {Easing, interpolate} from 'remotion';

type Track = {text: string; duration: number};
const tracks = narration as Record<string, Track>;
export const LEAD = 0.3;

/** Seconds of the clip itself. */
export const dur = (id: string) => {
	const duration = tracks[id]?.duration;
	if (!Number.isFinite(duration) || duration <= 0) throw new Error(`Missing cube narration timing: ${id}`);
	return duration;
};

/** Estimated moment (seconds from scene start) when `phrase` begins in clip `id`.
 *  Word-proportional estimate. Check visual cues against the recorded voice before delivery. */
export const at = (id: string, phrase?: string) => {
	const t = tracks[id];
	if (!t) throw new Error(`Missing cube narration track: ${id}`);
	if (!phrase) return LEAD;
	const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9' ]/g, ' ').split(/\s+/).filter(Boolean);
	const words = norm(t.text), target = norm(phrase);
	let index = -1;
	for (let i = 0; i <= words.length - target.length && index < 0; i++) if (target.every((w, j) => words[i + j] === w)) index = i;
	if (index < 0) throw new Error(`Phrase "${phrase}" not found in ${id}`);
	const ms = t.duration * 1000, inset = Math.min(100, ms * 0.05);
	return LEAD + (inset + (index / words.length) * (ms - inset * 2)) / 1000;
};

export const sceneSeconds = (id: string, tail = 1) => LEAD + dur(id) + tail;

const smooth = Easing.bezier(0.45, 0, 0.2, 1);
/** 0→1 between t0 and t0+len seconds. */
export const ramp = (time: number, t0: number, len = 0.8) => interpolate(time, [t0, t0 + len], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: smooth});
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
