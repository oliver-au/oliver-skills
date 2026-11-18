---
name: create-chloe-tutorial-video
description: Create narrated Chloe tutorial videos from questions and knowledge points, teaching misconception-first with animated evidence, prediction pauses, a test-style question, and fresh practice. Use for maths, thinking skills, reading, and similar learning explanations in Chloe's established visual style. Includes editable Remotion templates and a browser review player.
---

# Create Chloe tutorial videos

Turn the user's questions and knowledge points into a complete, correct lesson in the **Chloe tutorial style**. Deliver an editable video and a working preview, with narration when speech generation is available. The bundled source is the visual reference; a prose outline alone does not complete a video request.

## Start from the learning task

Use the questions, diagrams, answer choices, correct answers, knowledge points, age, language, and requested output supplied by the user. Plain text is sufficient; [the input example](references/lesson-input.json) is an optional convenient format. Do not require the user to fill a schema.

When unspecified, assume Australian English, a Year 5–6 learner (about 10–12) preparing for the NSW Selective test, Chloe Selective branding, one main idea per lesson, and roughly 2–3 minutes. State assumptions briefly and continue. Resolve a missing diagram, materially ambiguous question, or contradictory answer before explaining it. Solve each problem independently; a supplied answer key is evidence to check, not a reason to preserve a mistake.

For a whole textbook or multi-section course, also read [course production](references/course-production.md).

Read [the discovery craft](references/discovery-craft.md) and [the style specification](references/style.md) before authoring. Use [the lesson patterns](references/lesson-patterns.md) to choose a meaningful visual explanation. Keep the user's requested subject and difficulty; do not substitute one of the bundled examples for their question.

## Build from the reusable source

If an appropriate Remotion project already exists, inspect its instructions and integrate without replacing user work. Otherwise copy the starter into a new project:

```sh
node <skill-directory>/scripts/scaffold.mjs --out <new-project-directory>
```

Inspect the generated package scripts, install the declared dependencies with the available package manager, and start Studio using its `dev` script. Open the local preview as soon as the project runs, before making substantial scene edits. Use any available Remotion tooling instructions for environment-specific details; this package contains its own source and does not require another skill to be installed.

The starter includes maths, thinking, reading, and spatial (3D cube-net) examples, shared typography, colours, captions, timing helpers, and a browser player. Reuse the shell and animation patterns. Create separate authored scene components for the new lesson, register the full lesson and independently previewable scenes, and update the review player to select the new lesson. Retain unrelated existing lessons.

The example audio is intentionally not bundled. The starter labels missing narration as pending. Do not remove that indication or report a narrated video as complete until real audio exists and plays.

## Author a discovery, not a sequence of posters

Use a tempting misconception when the question supports one. Let the learner predict, test the idea against visible evidence, and explain the result. For a procedure or a passage, a worked example or a quiet reading interval can be a better opening. Adapt the beats in [the discovery craft](references/discovery-craft.md):

1. **Cold open** (≤ 10 s): a concrete object and a question that feels obvious. No title card.
2. **Commit**: neutral options, the tempting answer said aloud with its reason, all givens visible, about four seconds of quiet.
3. **Test it**: the object answers through a real transformation; narration reacts to the visual event.
4. **Why it fooled us**: name the trap and show its mechanism on the same object.
5. **But wait** (optional): a second surprise that deepens the idea.
6. **Exam bridge**: the idea in current official test format, a method that fits about a minute, and why each distractor fails.
7. **Your turn**: new surface, same structure; pause; reveal through the visual.
8. **Pocket rule**: a short reminder that retains every condition needed for the rule to work. Test it against a near miss.

Write the complete narration and beat sheet first, then run the script critique in [the review checks](references/review-checks.md#script-critique-before-building) and revise before building scenes.

Make the visual carry the reasoning: fold, regroup, test a counterexample, or link passage clues. Keep the question and necessary evidence visible during thinking time. Use stillness when Chloe needs to read or compare. Preserve object identity while it changes. Write for a Year 5 listener: short sentences, everyday words, Australian spelling.

Before the answer reveal, keep choices neutral and hide answer text, highlighting, check marks, captions, and narration that would spoil the prediction. Define the answer time once and use it for every visual and audio reveal. Keep a short tail after narration so the final words are not clipped.

## Narrate and time

Write the spoken explanation before finalising scene durations. Read [the narration guide](references/audio.md) when preparing speech. Use the user's available or chosen voice provider; the helper supports a local speech service. For Chloe, use American Easton unless the user chooses another voice. Keep Australian spelling in captions. Aim for a warm delivery around 150 words per minute. Slow down and leave a short silence just before each reveal. Read equations and symbols naturally.

Measure actual audio durations, then derive scene lengths and reveal points. Phrase captions are reading aids unless genuinely aligned by a transcription/alignment tool. Label estimated timings honestly. If speech is unavailable, complete the visual draft and script, keep the narration-pending state visible, and report that specific limitation; never claim a silent draft is fully narrated.

Use frame-driven animation with the composition's FPS. Keep total duration, scene durations, captions, and narration consistent after every content change. Keep each media clip and independently editable scene as an authored JSX element.

## Verify and deliver

Follow [the review checks](references/review-checks.md). Typecheck/build the project, inspect representative actual frames, and exercise the preview's play, pause, replay, and lesson selection. Check the exported or hosted lesson at the prediction and reveal, and watch the transition in motion. Verify the first spoken question against the actual timeline. Solve the new answer and practice answer from the learner’s visible clues. For multi-lesson work, use the [three independent course checks](references/course-production.md#three-independent-checks-for-a-narrated-course) to reconcile the solution, encoded narration and final rendered lesson.

Deliver a preview link, duration, editable source location, and any material limitation. Default to a local interactive preview. Render an MP4 when the user asks for an export. A localhost link only works on its host computer; when the user requests remote or public review, build the standalone player and use an available hosting workflow. Do not expose Studio or the workspace, or publish without the user's request. Include only the lesson assets in a public build. Do not reuse another project's hosting identity, credentials, or audience.

## Example invocation

> Use $create-chloe-tutorial-video. Knowledge point: adding fractions requires equal-sized parts. Question: Mia eats 1/3 of a pizza and Noah eats 1/4 of the same pizza. What fraction did they eat altogether? Explain why 2/7 is tempting but wrong. Create a narrated lesson with a new practice question for a Year 6 learner.

A strong result opens on the pizza, lets the learner commit to 2/7, shows the slices refusing to line up, re-cuts both into twelfths on screen, names *the different-sized-pieces trap*, bridges to a four-option test-style question, and ends with a pocket rule such as "Same size pieces first, then add."
