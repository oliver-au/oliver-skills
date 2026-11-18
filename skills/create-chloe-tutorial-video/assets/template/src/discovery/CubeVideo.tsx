import React from 'react';
import {Series, useVideoConfig} from 'remotion';
import {sceneSeconds} from './cube/timing';
import {CubeExam, CubeExamAnswer, CubeFold, CubeHook, CubePocket, CubePractice, CubePracticeAnswer, CubePracticeCheck, CubePredict, CubeRule, CubeSpin, CubeTrap, CubeWhy} from './cube/CubeScenes';

/* Scene id, component and the quiet tail after its narration (seconds). */
export const CUBE_SCENES: [string, string, React.FC, number][] = [
	['cube-hook', 'Cold open: the far-apart net', CubeHook, 0.6],
	['cube-predict', 'Commit: opposite the star?', CubePredict, 4.9],
	['cube-fold', 'Test it: fold', CubeFold, 1.2],
	['cube-spin', 'Test it: they touch', CubeSpin, 1.4],
	['cube-why', 'Why: two walls', CubeWhy, 1.4],
	['cube-trap', 'The far-apart trap', CubeTrap, 0.8],
	['cube-rule', 'Skip-one shortcut', CubeRule, 1.4],
	['cube-exam', 'Exam bridge: question', CubeExam, 5.3],
	['cube-exam-answer', 'Exam bridge: eliminate', CubeExamAnswer, 1.4],
	['cube-practice', 'Your turn: question', CubePractice, 5.3],
	['cube-practice-answer', 'Your turn: skip-one', CubePracticeAnswer, 1.0],
	['cube-practice-check', 'Your turn: fold to check', CubePracticeCheck, 1.4],
	['cube-pocket', 'Pocket rule', CubePocket, 2.2],
];
export const cubeSceneFrames = (id: string, fps = 30) => {
	const scene = CUBE_SCENES.find((s) => s[0] === id)!;
	return Math.ceil(sceneSeconds(id, scene[3]) * fps);
};
export const cubeDurationFrames = (fps = 30) => CUBE_SCENES.reduce((a, s) => a + cubeSceneFrames(s[0], fps), 0);

export const CubeVideo = () => {
	const {fps} = useVideoConfig();
	return <Series>
		{CUBE_SCENES.map(([id, name, Scene]) => <Series.Sequence key={id} name={name} durationInFrames={cubeSceneFrames(id, fps)} premountFor={fps}><Scene/></Series.Sequence>)}
	</Series>;
};
