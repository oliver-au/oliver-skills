import React from 'react';
import {P} from '../Shared';

/* A cube net folded hinge by hinge with real CSS 3D transforms.
   Every face is a child of the face it is hinged to, so a fold of the parent carries its children.
   All creases fold away from the printed side, so the printed side ends up outside the cube. */

export type Side = 'up' | 'down' | 'left' | 'right';
export type IconName = 'star' | 'circle' | 'triangle' | 'heart' | 'plus' | 'diamond';
export type NetFace = {id: string; label: IconName | string; parent?: string; side?: Side};
export type Rot = {axis: 'X' | 'Y' | 'Z'; deg: number};
export type FaceLook = {opacity?: number; ring?: string; edges?: Partial<Record<Side, string>>; tint?: string};

export const PAPER = '#eae5d8';
export const INSIDE = '#bdb5a3';
export const INKD = '#273337';

/* ---------- geometry ---------- */
type M3 = number[];
const mul = (a: M3, b: M3): M3 => {
	const r = new Array(9).fill(0);
	for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) r[i * 3 + j] += a[i * 3 + k] * b[k * 3 + j];
	return r;
};
const rot = ({axis, deg}: Rot): M3 => {
	const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
	if (axis === 'X') return [1, 0, 0, 0, c, -s, 0, s, c];
	if (axis === 'Y') return [c, 0, s, 0, 1, 0, -s, 0, c];
	return [c, -s, 0, s, c, 0, 0, 0, 1];
};
const I3: M3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const chain = (rs: Rot[]) => rs.reduce((m, r) => mul(m, rot(r)), I3);
const css = (rs: Rot[]) => rs.map((r) => `rotate${r.axis}(${r.deg}deg)`).join(' ');
const LIGHT = (() => { const v = [-0.3, -0.55, 0.78]; const n = Math.hypot(...v); return v.map((x) => x / n); })();
const shade = (m: M3, sign: 1 | -1) => {
	const n = [m[2] * sign, m[5] * sign, m[8] * sign];
	const d = n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2];
	return 0.7 + 0.3 * Math.max(0, d);
};

const hinge = (side: Side, p: number, s: number) => {
	const a = 90 * p;
	switch (side) {
		case 'up': return {left: 0, top: -s, origin: '50% 100%', r: {axis: 'X', deg: a} as Rot};
		case 'down': return {left: 0, top: s, origin: '50% 0%', r: {axis: 'X', deg: -a} as Rot};
		case 'left': return {left: -s, top: 0, origin: '100% 50%', r: {axis: 'Y', deg: -a} as Rot};
		case 'right': return {left: s, top: 0, origin: '0% 50%', r: {axis: 'Y', deg: a} as Rot};
	}
};
const step: Record<Side, [number, number]> = {up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0]};

/** Flat-net grid coordinates (root at 0,0; x right, y down). */
export const netLayout = (faces: NetFace[]) => {
	const pos: Record<string, [number, number]> = {};
	const root = faces.find((f) => !f.parent)!;
	pos[root.id] = [0, 0];
	let changed = true;
	while (changed) {
		changed = false;
		for (const f of faces) if (f.parent && pos[f.parent] && !pos[f.id]) {
			const [x, y] = pos[f.parent], [dx, dy] = step[f.side!];
			pos[f.id] = [x + dx, y + dy]; changed = true;
		}
	}
	const xs = Object.values(pos).map((p) => p[0]), ys = Object.values(pos).map((p) => p[1]);
	const centre: [number, number] = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
	return {pos, centre};
};

/* ---------- icons ---------- */
export const Icon: React.FC<{name: string; size: number; color?: string}> = ({name, size, color = INKD}) => {
	const common = {width: size, height: size, viewBox: '0 0 100 100', style: {display: 'block'}} as const;
	switch (name) {
		case 'star': return <svg {...common}><polygon fill={color} points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38"/></svg>;
		case 'circle': return <svg {...common}><circle fill={color} cx="50" cy="50" r="38"/></svg>;
		case 'triangle': return <svg {...common}><polygon fill={color} points="50,10 92,86 8,86"/></svg>;
		case 'heart': return <svg {...common}><path fill={color} d="M50 88 C20 66 6 50 6 32 C6 17 18 8 30 8 C40 8 47 14 50 22 C53 14 60 8 70 8 C82 8 94 17 94 32 C94 50 80 66 50 88 Z"/></svg>;
		case 'plus': return <svg {...common}><rect fill={color} x="38" y="8" width="24" height="84" rx="3"/><rect fill={color} x="8" y="38" width="84" height="24" rx="3"/></svg>;
		case 'diamond': return <svg {...common}><polygon fill={color} points="50,4 90,50 50,96 10,50"/></svg>;
		default: return <div style={{width: size, height: size, display: 'grid', placeItems: 'center', fontSize: size * 0.95, fontWeight: 800, color, lineHeight: 1, fontFamily: 'Manrope Variable, Arial, sans-serif'}}>{name}</div>;
	}
};

const Skin: React.FC<{label: string; s: number; look: FaceLook; front: number; back: number}> = ({label, s, look, front, back}) => {
	const edge = (side: Side, color: string, key: string) => {
		const w = Math.max(6, s * 0.05);
		const box: React.CSSProperties = side === 'left' ? {left: 0, top: 0, bottom: 0, width: w} : side === 'right' ? {right: 0, top: 0, bottom: 0, width: w} : side === 'up' ? {left: 0, right: 0, top: 0, height: w} : {left: 0, right: 0, bottom: 0, height: w};
		return <div key={key} style={{position: 'absolute', ...box, background: color, boxShadow: `0 0 ${s * 0.12}px ${color}`}}/>;
	};
	const ring = look.ring ? `inset 0 0 0 ${Math.max(4, s * 0.035)}px ${look.ring}` : `inset 0 0 0 ${Math.max(1.5, s * 0.012)}px #27333755`;
	const sideStyle = (base: string): React.CSSProperties => ({
		position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
		background: look.tint ?? base, boxShadow: ring, display: 'grid', placeItems: 'center', opacity: look.opacity ?? 1,
	});
	const dark = (b: number) => <div style={{position: 'absolute', inset: 0, background: '#000', opacity: Math.max(0, 1 - b)}}/>;
	const edges = Object.entries(look.edges ?? {}) as [Side, string][];
	return <>
		<div style={sideStyle(PAPER)}><Icon name={label} size={s * 0.5}/>{dark(front)}{edges.map(([k, c]) => edge(k, c, 'f' + k))}</div>
		<div style={{...sideStyle(INSIDE), transform: 'rotateY(180deg)'}}><Icon name={label} size={s * 0.5} color="#2733379a"/>{dark(back)}{edges.map(([k, c]) => edge(k === 'left' ? 'right' : k === 'right' ? 'left' : k, c, 'b' + k))}</div>
	</>;
};

export type CubeProps = {
	faces: NetFace[];
	size: number;
	/** fold progress per face id, 0 = flat, 1 = folded. Missing ids use `fold`. */
	folds?: Record<string, number>;
	fold?: number;
	camera?: Rot[];
	orient?: Rot[];
	looks?: Record<string, FaceLook>;
	relabel?: Record<string, string>;
	x: number; y: number;
	perspective?: number;
	/** 0 = centred on the flat net's middle, 1 = centred on the cube. */
	centring?: number;
	/** Extra 3D content placed in the root face's frame (e.g. an arrow between two walls). */
	inside?: React.ReactNode;
};

export const Cube3D: React.FC<CubeProps> = ({faces, size: s, folds = {}, fold = 0, camera = [], orient = [], looks = {}, relabel = {}, x, y, perspective = 2200, centring, inside}) => {
	const {centre} = netLayout(faces);
	const progress = (id: string) => folds[id] ?? fold;
	const avg = faces.filter((f) => f.parent).reduce((a, f) => a + progress(f.id), 0) / Math.max(1, faces.length - 1);
	const c = centring ?? avg;
	const offX = -centre[0] * s * (1 - c), offY = -centre[1] * s * (1 - c), lift = (s / 2) * c;
	const base = mul(chain(camera), chain(orient));
	const render = (face: NetFace, m: M3): React.ReactNode => {
		const kids = faces.filter((f) => f.parent === face.id);
		let style: React.CSSProperties, here = m;
		if (!face.parent) style = {left: -s / 2, top: -s / 2};
		else {
			const h = hinge(face.side!, progress(face.id), s);
			here = mul(m, rot(h.r));
			style = {left: h.left, top: h.top, transformOrigin: h.origin, transform: css([h.r])};
		}
		return <div key={face.id} style={{position: 'absolute', width: s, height: s, transformStyle: 'preserve-3d', ...style}}>
			<Skin label={relabel[face.id] ?? String(face.label)} s={s} look={looks[face.id] ?? {}} front={shade(here, 1)} back={shade(here, -1)}/>
			{!face.parent && inside}
			{kids.map((k) => render(k, here))}
		</div>;
	};
	const root = faces.find((f) => !f.parent)!;
	return <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, perspective, perspectiveOrigin: '0 0'}}>
		<div style={{position: 'absolute', transformStyle: 'preserve-3d', transform: `${css(camera)} ${css(orient)} translate3d(${offX}px, ${offY}px, ${lift}px)`}}>
			{render(root, base)}
		</div>
	</div>;
};

/* ---------- the two nets used in the lesson ---------- */
/* Main net: a row star–circle–triangle–heart with plus above and diamond below the circle. */
export const MAIN_NET: NetFace[] = [
	{id: 'circle', label: 'circle'},
	{id: 'plus', label: 'plus', parent: 'circle', side: 'up'},
	{id: 'diamond', label: 'diamond', parent: 'circle', side: 'down'},
	{id: 'star', label: 'star', parent: 'circle', side: 'left'},
	{id: 'triangle', label: 'triangle', parent: 'circle', side: 'right'},
	{id: 'heart', label: 'heart', parent: 'triangle', side: 'right'},
];
/* Practice net: row H J K L, G above H, N below L. Opposites: H–K, J–L, G–N. (N reads the same upside down.) */
export const PRACTICE_NET: NetFace[] = [
	{id: 'J', label: 'J'},
	{id: 'H', label: 'H', parent: 'J', side: 'left'},
	{id: 'G', label: 'G', parent: 'H', side: 'up'},
	{id: 'K', label: 'K', parent: 'J', side: 'right'},
	{id: 'L', label: 'L', parent: 'K', side: 'right'},
	{id: 'N', label: 'N', parent: 'L', side: 'down'},
];
export const ISO: Rot[] = [{axis: 'X', deg: -24}, {axis: 'Y', deg: -36}];
export const iconColor = P.ink;
