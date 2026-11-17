---
name: create-chloe-tutorial-video
description: Create narrated Chloe tutorial videos from questions and knowledge points, using animated evidence, prediction pauses, and worked practice. Use for maths, thinking skills, reading, and similar learning explanations in Chloe's established visual style. Includes editable Remotion templates and a browser review player.
---

# Create Chloe tutorial videos

Turn the user's questions and knowledge points into a complete, correct lesson in the **Chloe tutorial style**. Deliver an editable video and a working preview, with narration when speech generation is available. The bundled source is the visual reference; a prose outline alone does not complete a video request.

## Start from the learning task

Use the questions, diagrams, answer choices, correct answers, knowledge points, age, language, and requested output supplied by the user. Plain text is sufficient; [the input example](references/lesson-input.json) is an optional convenient format. Do not require the user to fill a schema.

When unspecified, assume English, learners aged about 10–12, Chloe Selective branding, one main idea per short lesson, and roughly 90–120 seconds. State assumptions briefly and continue. Resolve a missing diagram, materially ambiguous question, or contradictory answer before explaining it. Solve each problem independently; a supplied answer key is evidence to check, not a reason to preserve a mistake.

For a whole textbook or multi-section course, also read [course production](references/course-production.md).

Read [the style specification](references/style.md) before authoring. Use [the lesson patterns](references/lesson-patterns.md) to choose a meaningful visual explanation. Keep the user's requested subject and difficulty; do not substitute one of the bundled examples for their question.

## Build from the reusable source

If an appropriate Remotion project already exists, inspect its instructions and integrate without replacing user work. Otherwise copy the starter into a new project:

```sh
node <skill-directory>/scripts/scaffold.mjs --out <new-project-directory>
```

Inspect the generated package scripts, install the declared dependencies with the available package manager, and start Studio using its `dev` script. Open the local preview as soon as the project runs, before making substantial scene edits. Use any available Remotion tooling instructions for environment-specific details; this package contains its own source and does not require another skill to be installed.

The starter includes maths, thinking, and reading examples, shared typography, colours, captions, timing helpers, and a browser player. Reuse the shell and animation patterns. Create separate authored scene components for the new lesson, register the full lesson and independently previewable scenes, and update the review player to select the new lesson. Retain unrelated existing lessons.

The example audio is intentionally not bundled. The starter labels missing narration as pending. Do not remove that indication or report a narrated video as complete until real audio exists and plays.

## Author an explanation, not a sequence of posters

Use a question → prediction → evidence → insight → transfer structure. Usually five to seven short scenes work well, but adapt the structure to the idea. For the familiar six-scene rhythm:

1. Introduce a concrete puzzle or surprising question.
2. Invite a prediction, then leave about four seconds of quiet thinking time.
3. Animate the operation, test, or evidence that resolves the question.
4. Explain the tempting mistake or a useful contrast.
5. State a short, reusable reasoning habit.
6. Give a fresh practice question, pause, then explain its answer.

Make the visual carry the reasoning: regroup quantities, move cards, test a counterexample, or link passage clues. Maintain object continuity through transformations. Do not rely on decorative motion and text replacement to explain a process.

Before the answer reveal, keep choices neutral and hide answer text, highlighting, check marks, captions, and narration that would spoil the prediction. Define the answer time once and use it for every visual and audio reveal. Keep a short tail after narration so the final words are not clipped.

## Narrate and time

Write the spoken explanation before finalising scene durations. Read [the narration guide](references/audio.md) when preparing speech. Use the user's available or chosen voice provider; the helper supports a local speech service. The reference voice is calm and clear, around 155 words per minute, without imitating a particular person. Read equations and symbols naturally.

Measure actual audio durations, then derive scene lengths and reveal points. Phrase captions are reading aids unless genuinely aligned by a transcription/alignment tool. Label estimated timings honestly. If speech is unavailable, complete the visual draft and script, keep the narration-pending state visible, and report that specific limitation; never claim a silent draft is fully narrated.

Use frame-driven animation with the composition's FPS. Keep total duration, scene durations, captions, and narration consistent after every content change. Keep each media clip and independently editable scene as an authored JSX element.

## Verify and deliver

Follow [the review checks](references/review-checks.md). Typecheck/build the project, inspect representative actual frames, and exercise the preview's play, pause, replay, and lesson selection. Check the question immediately before the reveal and the result immediately after it. Verify the new answer and practice answer independently.

Deliver a preview link, duration, editable source location, and any material limitation. Default to a local interactive preview. Render an MP4 when the user asks for an export. A localhost link only works on its host computer; when the user requests remote or public review, build the standalone player and use an available hosting workflow. Do not expose Studio or the workspace, or publish without the user's request. Include only the lesson assets in a public build. Do not reuse another project's hosting identity, credentials, or audience.

## Example invocation

> Use $create-chloe-tutorial-video. Knowledge point: adding fractions requires equal-sized parts. Question: Mia eats 1/3 of a pizza and Noah eats 1/4 of the same pizza. What fraction did they eat altogether? Explain why 2/7 is tempting but wrong. Create a narrated lesson with a new practice question for a Year 6 learner.
