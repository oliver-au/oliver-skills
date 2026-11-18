import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Eyebrow, Narration, P, PauseMeter, Shell} from '../Shared';
import {Cube3D, FaceLook, Icon, ISO, MAIN_NET, NetFace, netLayout, PRACTICE_NET, Rot, Side} from './Cube3D';
import {at, dur, LEAD, lerp, ramp} from './timing';

const SUBJECT = 'Thinking skills';
const useT = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return f / fps; };
const end = (id: string) => LEAD + dur(id);

/* ---------- small 2D helpers ---------- */
const flat = (faces: NetFace[], s: number, x: number, y: number, id: string): [number, number] => {
	const {pos, centre} = netLayout(faces);
	const [gx, gy] = pos[id];
	return [x + (gx - centre[0]) * s, y + (gy - centre[1]) * s];
};

const Arc: React.FC<{a: [number, number]; b: [number, number]; bulge: [number, number]; p: number; color?: string; dim?: number}> = ({a, b, bulge, p, color = P.mint, dim = 1}) => {
	if (p <= 0) return null;
	const c = [(a[0] + b[0]) / 2 + bulge[0], (a[1] + b[1]) / 2 + bulge[1]];
	return <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: dim, overflow: 'visible'}}>
		<path d={`M ${a[0]} ${a[1]} Q ${c[0]} ${c[1]} ${b[0]} ${b[1]}`} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} style={{filter: `drop-shadow(0 0 8px ${color}aa)`}}/>
		{p > 0.95 && <><circle cx={a[0]} cy={a[1]} r={11} fill={color}/><circle cx={b[0]} cy={b[1]} r={11} fill={color}/></>}
	</svg>;
};

const Glyphs: React.FC<{name: string; size: number; color?: string}> = ({name, size, color = P.ink}) => <span style={{display: 'inline-block', verticalAlign: 'middle', margin: '0 6px'}}><Icon name={name} size={size} color={color}/></span>;

const PairChip: React.FC<{a: string; b: string; x: number; y: number; p: number; color?: string; size?: number}> = ({a, b, x, y, p, color = P.mint, size = 54}) => p <= 0 ? null :
	<div style={{position: 'absolute', left: x, top: y, opacity: p, translate: `${(1 - p) * 24}px 0`, display: 'flex', alignItems: 'center', gap: 18, padding: '14px 26px', border: `2px solid ${color}`, borderRadius: 10, background: '#0c1115cc'}}>
		<Icon name={a} size={size} color={P.ink}/><span style={{fontSize: size * 0.8, color, fontWeight: 700}}>↔</span><Icon name={b} size={size} color={P.ink}/>
		<span style={{fontSize: 26, color, letterSpacing: 3, marginLeft: 10, fontWeight: 700}}>OPPOSITE</span>
	</div>;

type Opt = {k: string; icon: string; text: string};
const OptionList: React.FC<{items: Opt[]; x: number; y: number; show: number; pick?: string; pickP?: number; wrong?: string; wrongP?: number; w?: number}> = ({items, x, y, show, pick, pickP = 0, wrong, wrongP = 0, w = 560}) =>
	<div style={{position: 'absolute', left: x, top: y, width: w, display: 'flex', flexDirection: 'column', gap: 22}}>
		{items.map((o, i) => {
			const p = Math.max(0, Math.min(1, show * items.length - i));
			const good = pick === o.k ? pickP : 0, bad = wrong === o.k ? wrongP : 0;
			return <div key={o.k} style={{opacity: p * (pick && pickP > 0.5 && pick !== o.k ? 0.45 : 1), translate: `${(1 - p) * 30}px 0`, display: 'flex', alignItems: 'center', gap: 28, height: 104, padding: '0 30px', borderRadius: 10, background: '#16222acc', boxShadow: `inset 0 0 0 ${2 + good * 2}px ${good > 0 ? P.mint : bad > 0 ? P.red : P.line}`}}>
				<span style={{fontSize: 34, fontWeight: 800, color: P.cyan, width: 30}}>{o.k}</span>
				<Icon name={o.icon} size={58} color={P.ink}/>
				{o.text && <span style={{fontSize: 42, fontWeight: 600}}>{o.text}</span>}
				{bad > 0 && <span style={{marginLeft: 'auto', fontSize: 50, color: P.red, opacity: bad, fontWeight: 800}}>✗</span>}
				{good > 0 && <span style={{marginLeft: 'auto', fontSize: 50, color: P.mint, opacity: good, fontWeight: 800}}>✓</span>}
			</div>;
		})}
	</div>;

const Question: React.FC<{children: React.ReactNode; p?: number; size?: number; top?: number}> = ({children, p = 1, size = 64, top = 140}) =>
	<div style={{position: 'absolute', left: 110, top, fontSize: size, fontWeight: 750, letterSpacing: -2, lineHeight: 1.15, opacity: p, translate: `0 ${(1 - p) * 16}px`, display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>{children}</div>;

const ring = (color: string, on: number): FaceLook => (on > 0.5 ? {ring: color} : {});
const merge = (...ls: Record<string, FaceLook>[]) => {
	const out: Record<string, FaceLook> = {};
	for (const l of ls) for (const [k, v] of Object.entries(l)) out[k] = {...out[k], ...v, edges: {...out[k]?.edges, ...v.edges}};
	return out;
};
const cam = (x: number, y: number): Rot[] => [{axis: 'X', deg: x}, {axis: 'Y', deg: y}];

const OPTIONS_MAIN: Opt[] = [
	{k: 'A', icon: 'heart', text: 'heart'},
	{k: 'B', icon: 'triangle', text: 'triangle'},
	{k: 'C', icon: 'diamond', text: 'diamond'},
	{k: 'D', icon: 'plus', text: 'plus'},
];
const OPTIONS_PRACTICE: Opt[] = [
	{k: 'A', icon: 'N', text: ''},
	{k: 'B', icon: 'J', text: ''},
	{k: 'C', icon: 'K', text: ''},
	{k: 'D', icon: 'L', text: ''},
];

/* Distance bracket from the hook: "furthest apart". */
const FarBracket: React.FC<{s: number; x: number; y: number; p: number; struck?: number}> = ({s, x, y, p, struck = 0}) => {
	if (p <= 0) return null;
	const a = flat(MAIN_NET, s, x, y, 'star'), b = flat(MAIN_NET, s, x, y, 'heart');
	const top = y - 1.5 * s - 46, w = (b[0] - a[0]) * p;
	return <div style={{position: 'absolute', left: 0, top: 0, opacity: Math.min(1, p * 2)}}>
		<div style={{position: 'absolute', left: a[0], top: top, width: 0, height: a[1] - s / 2 - top, borderLeft: `3px dashed ${P.cyan}`}}/>
		<div style={{position: 'absolute', left: b[0], top: top, width: 0, height: b[1] - s / 2 - top, borderLeft: `3px dashed ${P.cyan}`, opacity: p > 0.95 ? 1 : 0}}/>
		<div style={{position: 'absolute', left: a[0], top: top - 2, width: w, height: 0, borderTop: `4px solid ${P.cyan}`}}/>
		<div style={{position: 'absolute', left: a[0], width: b[0] - a[0], top: top - 62, textAlign: 'center', fontSize: 34, letterSpacing: 4, color: P.cyan, fontWeight: 700}}>FURTHEST APART</div>
		{struck > 0 && <div style={{position: 'absolute', left: a[0] - 20, top: top - 50, width: (b[0] - a[0] + 40) * struck, height: 6, background: P.red, rotate: '-3deg', transformOrigin: '0 0', boxShadow: `0 0 12px ${P.red}`}}/>}
	</div>;
};

/* ============ 01 Cold open ============ */
export const CubeHook = () => {
	const t = useT(), id = 'cube-hook', s = 170, X = 960, Y = 590;
	const appear = ramp(t, 0, 1);
	const star = ramp(t, at(id, 'Look at the star'), 0.4), heart = ramp(t, at(id, 'and the heart'), 0.4);
	const far = ramp(t, at(id, 'When this paper net folds'), 0.9);
	return <Shell subject={SUBJECT} step="01 / THE PUZZLE">
		<Question p={appear} size={60} top={128}>Will the star and heart end up opposite?</Question>
		<div style={{position: 'absolute', inset: 0, opacity: appear, scale: String(lerp(0.94, 1, appear))}}>
			<Cube3D faces={MAIN_NET} size={s} x={X} y={Y} camera={cam(lerp(18, 0, appear), 0)} looks={merge({star: ring(P.cyan, star)}, {heart: ring(P.cyan, heart)})}/>
		</div>
		<FarBracket s={s} x={X} y={Y} p={far}/>
		<Narration id={id}/>
	</Shell>;
};

/* ============ 02 Commit ============ */
export const CubePredict = () => {
	const t = useT(), id = 'cube-predict', s = 160;
	const move = ramp(t, 0, 0.9);
	const X = lerp(960, 640, move), Y = lerp(590, 600, move);
	const tempt = ramp(t, at(id, 'The heart'), 0.3) * (1 - ramp(t, at(id, 'But is it'), 0.3));
	const opts = ramp(t, at(id, 'But is it'), 1.6);
	return <Shell subject={SUBJECT} step="02 / YOUR GUESS">
		<Question p={ramp(t, 0.1, 0.6)}>Which face ends up opposite the<Glyphs name="star" size={62}/>?</Question>
		<Cube3D faces={MAIN_NET} size={s} x={X} y={Y} looks={merge({star: {ring: P.cyan}}, {heart: ring(P.cyan, tempt)})}/>
		{tempt > 0 && <div style={{position: 'absolute', left: flat(MAIN_NET, s, X, Y, 'heart')[0] - 120, top: Y - s * 1.3, width: 240, textAlign: 'center', fontSize: 36, fontWeight: 700, color: P.cyan, opacity: tempt}}>obviously…?</div>}
		<OptionList items={OPTIONS_MAIN} x={1150} y={300} show={opts}/>
		<PauseMeter start={end(id) + 0.2} duration={4.4} label="PAUSE · LOCK IN YOUR ANSWER"/>
		<Narration id={id}/>
	</Shell>;
};

/* ============ 03 Test it: fold ============ */
const MAIN_FOLD_TIMES = (id: string) => ({
	plus: [at(id, 'The plus folds back'), 1.1],
	diamond: [at(id, 'The diamond folds back'), 1.1],
	side: [at(id, 'The star and the triangle swing'), 1.4],
	heart: [at(id, 'And the heart closes'), 1.2],
} as const);
const QuestionChip: React.FC<{mark?: number}> = ({mark = 0}) =>
	<div style={{position: 'absolute', left: 110, top: 140, display: 'flex', alignItems: 'center', gap: 16, fontSize: 40, fontWeight: 650, color: P.muted}}>
		Opposite the <Icon name="star" size={44} color={P.ink}/> ?
		{mark > 0 && <span style={{display: 'flex', alignItems: 'center', gap: 10, marginLeft: 26, opacity: mark, color: P.red}}><Icon name="heart" size={40} color={P.red}/>✗ not the heart</span>}
	</div>;

export const CubeFold = () => {
	const t = useT(), id = 'cube-fold';
	const F = MAIN_FOLD_TIMES(id);
	const move = ramp(t, 0, 0.9);
	const camP = ramp(t, at(id, "Let's fold it"), F.side[0] + F.side[1] - at(id, "Let's fold it"));
	const folds = {
		plus: ramp(t, F.plus[0], F.plus[1]), diamond: ramp(t, F.diamond[0], F.diamond[1]),
		star: ramp(t, F.side[0], F.side[1]), triangle: ramp(t, F.side[0], F.side[1]), heart: ramp(t, F.heart[0], F.heart[1]),
	};
	return <Shell subject={SUBJECT} step="03 / TEST IT">
		<QuestionChip/>
		<Cube3D faces={MAIN_NET} size={lerp(160, 230, camP)} x={lerp(640, 960, move)} y={lerp(600, 580, move)} folds={folds} camera={cam(lerp(0, ISO[0].deg, camP), lerp(0, ISO[1].deg, camP))} looks={{star: {ring: P.cyan}}}/>
		<Narration id={id}/>
	</Shell>;
};

/* ============ 04 Test it: spin ============ */
export const CubeSpin = () => {
	const t = useT(), id = 'cube-spin', s = 230;
	const spin = ramp(t, at(id, 'Now spin it round'), 2.6);
	const look = ramp(t, at(id, 'look at the star'), 0.4);
	const not = ramp(t, at(id, "They're not opposite"), 0.4);
	const touch = ramp(t, at(id, 'They touch'), 0.3);
	const edge = touch > 0.5 ? P.mint : undefined;
	return <Shell subject={SUBJECT} step="03 / TEST IT">
		<QuestionChip mark={not}/>
		<Cube3D faces={MAIN_NET} size={s} x={900} y={590} fold={1} camera={cam(-24, lerp(-36, 144, spin))}
			looks={{star: {...ring(P.cyan, look), ...(edge ? {edges: {left: edge}} : {})}, heart: {...ring(P.cyan, look), ...(edge ? {edges: {right: edge}} : {})}}}/>
		{touch > 0 && <div style={{position: 'absolute', left: 1270, top: 470, opacity: touch, fontSize: 56, fontWeight: 800, color: P.mint}}>They touch!<div style={{fontSize: 30, color: P.muted, fontWeight: 600, marginTop: 10}}>one shared edge</div></div>}
		<Narration id={id}/>
	</Shell>;
};

/* ============ 05 Why: the U fold ============ */
export const CubeWhy = () => {
	const t = useT(), id = 'cube-why', s = 200;
	const fadeIn = ramp(t, 0, 0.5);
	const focus = ramp(t, at(id, 'Watch just three squares'), 0.6);
	const stay = ramp(t, at(id, 'The circle stays put'), 0.3);
	const walls = ramp(t, at(id, 'fold up like two walls'), 1.6);
	const facing = ramp(t, at(id, 'facing each other'), 0.5);
	const opp = ramp(t, at(id, 'each other Opposite'), 0.4);
	const dimOthers = lerp(1, 0, focus);
	const looks: Record<string, FaceLook> = {
		plus: {opacity: dimOthers}, diamond: {opacity: dimOthers}, heart: {opacity: dimOthers},
		circle: stay > 0.5 ? {ring: P.cyan} : {},
		star: {ring: opp > 0.5 ? P.mint : P.cyan}, triangle: opp > 0.5 ? {ring: P.mint} : {},
	};
	const arrow = <div style={{position: 'absolute', left: 0, top: s / 2 - 24, width: s, height: 48, transform: `translateZ(${-s / 2}px)`, opacity: facing}}>
		<svg width={s} height={48} viewBox={`0 0 ${s} 48`}><path d={`M14 24 H${s - 14}`} stroke={P.mint} strokeWidth={6}/><path d={`M4 24 L24 10 L24 38 Z M${s - 4} 24 L${s - 24} 10 L${s - 24} 38 Z`} fill={P.mint}/></svg>
	</div>;
	return <Shell subject={SUBJECT} step="04 / WHY">
		<div style={{position: 'absolute', inset: 0, opacity: fadeIn}}>
			<Cube3D faces={MAIN_NET} size={s} x={860 + 0.5 * s} y={640} folds={{star: walls, triangle: walls}} centring={0} camera={cam(lerp(0, -58, walls), lerp(0, -24, walls))} looks={looks} inside={arrow}/>
		</div>
		<PairChip a="star" b="triangle" x={1290} y={300} p={opp}/>
		<Narration id={id}/>
	</Shell>;
};

/* ============ 06 The trap ============ */
export const CubeTrap = () => {
	const t = useT(), id = 'cube-trap', s = 150, X = 960, Y = 640;
	const title = ramp(t, at(id, 'This is the far-apart trap'), 0.6);
	const strike = ramp(t, at(id, 'share an edge'), 0.6);
	return <Shell subject={SUBJECT} step="05 / THE TRAP">
		<Question p={title} size={84} top={130}><span style={{color: P.red}}>The far-apart trap</span></Question>
		<Cube3D faces={MAIN_NET} size={s} x={X} y={Y} looks={{star: {edges: {left: P.mint}}, heart: {edges: {right: P.mint}}}}/>
		<FarBracket s={s} x={X} y={Y} p={ramp(t, 0.2, 0.7)} struck={strike}/>
		<Narration id={id}/>
	</Shell>;
};

/* ============ 07 Skip-one rule ============ */
export const CubeRule = () => {
	const t = useT(), id = 'cube-rule', s = 160, X = 700, Y = 600;
	const line = at(id, 'In any straight line'), skip = at(id, 'skip the middle one'), ends = at(id, 'The two ends are opposite');
	const t1 = at(id, 'Star, skip circle'), t2 = at(id, 'Circle, skip triangle'), t3 = at(id, 'Plus, skip circle'), done = at(id, 'Three pairs');
	const stage = t < t2 ? 0 : t < t3 ? 1 : 2;
	const triples: [string, string, string][] = [['star', 'circle', 'triangle'], ['circle', 'triangle', 'heart'], ['plus', 'circle', 'diamond']];
	const [a, m, b] = triples[stage];
	const looks: Record<string, FaceLook> = {};
	if (t >= line && t < done) { looks[a] = {ring: P.cyan}; looks[b] = {ring: P.cyan}; looks[m] = {ring: P.cyan, opacity: t >= skip ? 0.55 : 1}; }
	const pt = (k: string) => flat(MAIN_NET, s, X, Y, k);
	const arcs = [
		<Arc key="1" a={pt('star')} b={pt('triangle')} bulge={[0, -0.6 * s]} p={ramp(t, ends, 0.8)} dim={stage > 0 ? 0.4 : 1}/>,
		<Arc key="2" a={pt('circle')} b={pt('heart')} bulge={[0, 0.6 * s]} p={ramp(t, t2, 0.8)} dim={stage > 1 ? 0.4 : 1}/>,
		<Arc key="3" a={pt('plus')} b={pt('diamond')} bulge={[0.6 * s, 0]} p={ramp(t, t3, 0.8)}/>,
	];
	const glow = ramp(t, done, 0.4);
	return <Shell subject={SUBJECT} step="06 / THE SHORTCUT">
		<Eyebrow style={{position: 'absolute', left: 110, top: 150, opacity: ramp(t, 0, 0.5)}}>The skip-one shortcut</Eyebrow>
		<Question p={ramp(t, line, 0.6)} size={52} top={210}>Three squares in a straight line.</Question>
		<Cube3D faces={MAIN_NET} size={s} x={X} y={Y} looks={looks}/>
		{arcs}
		<PairChip a="star" b="triangle" x={1300} y={370} p={ramp(t, t1, 0.5)} size={50 + glow * 6}/>
		<PairChip a="circle" b="heart" x={1300} y={510} p={ramp(t, t2 + 0.6, 0.5)} size={50 + glow * 6}/>
		<PairChip a="plus" b="diamond" x={1300} y={650} p={ramp(t, t3 + 0.6, 0.5)} size={50 + glow * 6}/>
		<Narration id={id}/>
	</Shell>;
};

/* ============ 08–09 Exam bridge ============ */
type CubeOpt = {k: string; orient: Rot[]; relabel: Record<string, string>; pair?: [string, string]; ok?: boolean};
/* Every option is the same folded model in a different orientation.
   Impossible options change exactly one visible face so that an opposite pair shows. */
const EXAM: CubeOpt[] = [
	{k: 'A', orient: [], relabel: {circle: 'star'}, pair: ['circle', 'triangle']},                       // star + triangle
	{k: 'B', orient: [{axis: 'X', deg: 90}], relabel: {triangle: 'plus'}, pair: ['triangle', 'diamond']}, // plus + diamond
	{k: 'C', orient: [{axis: 'Y', deg: 180}], relabel: {}, ok: true},                                    // plus, heart, star — real
	{k: 'D', orient: [{axis: 'X', deg: -90}], relabel: {plus: 'circle'}, pair: ['plus', 'heart']},       // circle + heart
];
const ExamBoard: React.FC<{t: number; show: number; pairs: number; marks?: Record<string, {flag: number; out: number}>; okP?: number; edgeP?: number}> = ({show, pairs, marks = {}, okP = 0, edgeP = 0}) => {
	const xs = [790, 1065, 1340, 1615];
	return <>
		<div style={{position: 'absolute', left: 110, top: 330, width: 470, height: 470, borderRadius: 12, boxShadow: `inset 0 0 0 2px ${P.line}`}}/>
		<div style={{position: 'absolute', left: 140, top: 350, fontSize: 24, letterSpacing: 4, color: P.muted, fontWeight: 700}}>THE NET</div>
		<Cube3D faces={MAIN_NET} size={92} x={345} y={565}/>
		<div style={{position: 'absolute', left: 110, top: 830, display: 'flex', gap: 34, opacity: pairs, fontSize: 32, color: P.mint, fontWeight: 700}}>
			{[['star', 'triangle'], ['circle', 'heart'], ['plus', 'diamond']].map(([a, b]) => <span key={a} style={{display: 'flex', alignItems: 'center', gap: 6}}><Icon name={a} size={34} color={P.ink}/>↔<Icon name={b} size={34} color={P.ink}/></span>)}
		</div>
		{EXAM.map((o, i) => {
			const p = Math.max(0, Math.min(1, show * 4 - i));
			const m = marks[o.k] ?? {flag: 0, out: 0};
			const looks: Record<string, FaceLook> = {};
			if (o.pair && m.flag > 0.5) { looks[o.pair[0]] = {ring: P.red}; looks[o.pair[1]] = {ring: P.red}; }
			if (o.ok && edgeP > 0.5) { looks.star = {edges: {left: P.mint}}; looks.heart = {edges: {right: P.mint}}; }
			const good = o.ok ? okP : 0;
			return <div key={o.k} style={{position: 'absolute', left: 0, top: 0, opacity: p * (1 - m.out * 0.55)}}>
				<div style={{position: 'absolute', left: xs[i] - 120, top: 330, width: 240, height: 470, borderRadius: 12, boxShadow: `inset 0 0 0 ${2 + good * 3}px ${good > 0 ? P.mint : P.line}`}}/>
				<div style={{position: 'absolute', left: xs[i] - 120, top: 352, width: 240, textAlign: 'center', fontSize: 40, fontWeight: 800, color: good > 0 ? P.mint : P.cyan}}>{o.k}</div>
				<Cube3D faces={MAIN_NET} size={128} x={xs[i]} y={595} fold={1} centring={1} camera={ISO} orient={o.orient} relabel={o.relabel} looks={looks}/>
				{m.out > 0 && <svg width={240} height={240} style={{position: 'absolute', left: xs[i] - 120, top: 470, opacity: m.out}}><path d="M40 40 L200 200 M200 40 L40 200" stroke={P.red} strokeWidth={14} strokeLinecap="round"/></svg>}
			</div>;
		})}
	</>;
};

export const CubeExam = () => {
	const t = useT(), id = 'cube-exam';
	return <Shell subject={SUBJECT} step="07 / TEST STYLE">
		<Eyebrow style={{position: 'absolute', left: 110, top: 140, opacity: ramp(t, 0, 0.5)}} color={P.muted}>Test-style question · original example</Eyebrow>
		<Question p={ramp(t, at(id, 'Which cube could'), 0.6)} size={60} top={196}>Which cube could be made from this net?</Question>
		<ExamBoard t={t} show={ramp(t, at(id, 'Which cube could'), 1.6)} pairs={ramp(t, at(id, 'Opposite faces cannot'), 0.6)}/>
		<PauseMeter start={end(id) + 0.2} duration={4.8} label="PAUSE · CROSS OUT OPPOSITE PAIRS"/>
		<Narration id={id}/>
	</Shell>;
};

export const CubeExamAnswer = () => {
	const t = useT(), id = 'cube-exam-answer';
	const mk = (flagPhrase: string, outPhrase: string) => ({flag: ramp(t, at(id, flagPhrase), 0.3), out: ramp(t, at(id, outPhrase) + 0.2, 0.4)});
	const marks = {
		A: mk('A shows the star', 'triangle Opposite Out'),
		B: mk('B shows the plus', 'the diamond Out'),
		D: mk('D shows the circle', 'and the heart Out'),
	};
	return <Shell subject={SUBJECT} step="07 / TEST STYLE">
		<Eyebrow style={{position: 'absolute', left: 110, top: 140}} color={P.muted}>Test-style question · original example</Eyebrow>
		<Question size={60} top={196}>Which cube could be made from this net?</Question>
		<ExamBoard t={t} show={1} pairs={1} marks={marks} okP={ramp(t, at(id, 'Only C is left'), 0.5)} edgeP={ramp(t, at(id, 'side by side'), 0.3)}/>
		<Narration id={id}/>
	</Shell>;
};

/* ============ 10–12 Your turn ============ */
const PX = 640, PY = 560, PS = 150;
export const CubePractice = () => {
	const t = useT(), id = 'cube-practice';
	return <Shell subject={SUBJECT} step="08 / YOUR TURN">
		<Eyebrow style={{position: 'absolute', left: 110, top: 140, opacity: ramp(t, 0, 0.5)}} color={P.muted}>New net · original practice</Eyebrow>
		<Question p={ramp(t, at(id, 'Which face is opposite G'), 0.6)} top={196}>Which face is opposite G?</Question>
		<div style={{position: 'absolute', inset: 0, opacity: ramp(t, 0, 0.8)}}><Cube3D faces={PRACTICE_NET} size={PS} x={PX} y={PY}/></div>
		<OptionList items={OPTIONS_PRACTICE} x={1250} y={330} w={460} show={ramp(t, at(id, 'Is it N'), 1.4)}/>
		<PauseMeter start={end(id) + 0.2} duration={4.8} label="PAUSE · TRY SKIP-ONE"/>
		<Narration id={id}/>
	</Shell>;
};

export const CubePracticeAnswer = () => {
	const t = useT(), id = 'cube-practice-answer';
	const t1 = at(id, 'H, skip J'), t2 = at(id, 'J, skip K'), t3 = at(id, 'Only G and N'), t4 = at(id, 'The answer is N');
	const pt = (k: string) => flat(PRACTICE_NET, PS, PX, PY, k);
	const looks: Record<string, FaceLook> = {};
	const trip = t >= t3 ? null : t >= t2 ? ['J', 'K', 'L'] : t >= t1 ? ['H', 'J', 'K'] : null;
	if (trip) { looks[trip[0]] = {ring: P.cyan}; looks[trip[1]] = {ring: P.cyan, opacity: 0.55}; looks[trip[2]] = {ring: P.cyan}; }
	if (t >= t3) { looks.G = {ring: P.mint}; looks.N = {ring: P.mint}; looks.H = {opacity: 0.5}; looks.J = {opacity: 0.5}; looks.K = {opacity: 0.5}; looks.L = {opacity: 0.5}; }
	return <Shell subject={SUBJECT} step="08 / YOUR TURN">
		<Question top={196}>Which face is opposite G?</Question>
		<Cube3D faces={PRACTICE_NET} size={PS} x={PX} y={PY} looks={looks}/>
		<Arc a={pt('H')} b={pt('K')} bulge={[0, -0.6 * PS]} p={ramp(t, t1, 0.8)} dim={t >= t2 ? 0.4 : 1}/>
		<Arc a={pt('J')} b={pt('L')} bulge={[0, 0.6 * PS]} p={ramp(t, t2, 0.8)} dim={t >= t3 ? 0.4 : 1}/>
		<PairChip a="H" b="K" x={1250} y={330} p={ramp(t, t1 + 0.6, 0.5)} size={44}/>
		<PairChip a="J" b="L" x={1250} y={450} p={ramp(t, t2 + 0.6, 0.5)} size={44}/>
		<PairChip a="G" b="N" x={1250} y={570} p={ramp(t, t3 + 0.8, 0.5)} size={44}/>
		{t >= t3 && <div style={{position: 'absolute', left: 1250, top: 690, fontSize: 34, color: P.muted, opacity: ramp(t, t3 + 0.8, 0.5)}}>the leftovers pair up</div>}
		<div style={{position: 'absolute', left: 1250, top: 780, display: 'flex', alignItems: 'center', gap: 20, opacity: ramp(t, t4, 0.4), fontSize: 46, fontWeight: 800, color: P.mint}}>Answer: A · N ✓</div>
		<Narration id={id}/>
	</Shell>;
};

const PRACTICE_FOLD = (time: number, t0: number) => ({
	H: ramp(time, t0, 1), K: ramp(time, t0, 1), G: ramp(time, t0 + 0.9, 1), L: ramp(time, t0 + 0.9, 1), N: ramp(time, t0 + 1.8, 1),
});
export const CubePracticeCheck = () => {
	const t = useT(), id = 'cube-practice-check';
	const t0 = at(id, "Let's fold it");
	const camP = ramp(t, t0, 2.8);
	const g = ramp(t, at(id, 'G on top'), 0.3);
	const under = ramp(t, at(id, 'And N, right underneath'), 1.4);
	const far = ramp(t, at(id, 'These two faces'), 0.4);
	const looks: Record<string, FaceLook> = {G: g > 0.5 ? {ring: far > 0.5 ? P.mint : P.cyan} : {}, N: under > 0.4 ? {ring: far > 0.5 ? P.mint : P.cyan} : {}};
	return <Shell subject={SUBJECT} step="08 / YOUR TURN">
		<Question size={52} top={150}>Check by folding</Question>
		<Cube3D faces={PRACTICE_NET} size={190} x={lerp(PX, 900, camP)} y={600} folds={PRACTICE_FOLD(t, t0 + 0.2)} camera={cam(lerp(0, ISO[0].deg, camP) + under * 56, lerp(0, ISO[1].deg, camP) + under * 26)} looks={looks}/>
		<div style={{position: 'absolute', left: 1280, top: 420, opacity: far, fontSize: 52, fontWeight: 800, color: P.mint, lineHeight: 1.25}}>Far apart…<br/>and opposite.</div>
		<div style={{position: 'absolute', left: 1280, top: 590, opacity: far, fontSize: 32, color: P.muted, lineHeight: 1.4}}>Compare the first net:<br/>star and heart touched.</div>
		<Narration id={id}/>
	</Shell>;
};

/* ============ 13 Pocket rule ============ */
export const CubePocket = () => {
	const t = useT(), id = 'cube-pocket', s = 120, X = 1420, Y = 560;
	const rule = ramp(t, at(id, 'Three straight squares'), 0.6);
	const pt = (k: string) => flat(MAIN_NET, s, X, Y, k);
	return <Shell subject={SUBJECT} step="09 / KEEP THIS">
		<Eyebrow style={{position: 'absolute', left: 110, top: 300, opacity: ramp(t, 0, 0.5)}} color={P.muted}>Next time you see a net</Eyebrow>
		<div style={{position: 'absolute', left: 110, top: 370, fontSize: 86, fontWeight: 800, letterSpacing: -4, lineHeight: 1.08, opacity: rule, translate: `0 ${(1 - rule) * 20}px`}}>
			Three straight squares:<br/><span style={{color: P.mint}}>the ends are opposite.</span>
		</div>
		<Cube3D faces={MAIN_NET} size={s} x={X} y={Y} looks={rule > 0.5 ? {star: {ring: P.mint}, triangle: {ring: P.mint}, circle: {opacity: 0.55}} : {}}/>
		<Arc a={pt('star')} b={pt('triangle')} bulge={[0, -0.6 * s]} p={ramp(t, at(id, 'Three straight squares') + 0.2, 0.8)}/>
		<Narration id={id}/>
	</Shell>;
};

export type {Side};
