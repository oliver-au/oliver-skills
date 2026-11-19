# Chloe visual and motion specification

Use the finished C3 pool sequence to calibrate picture-making and motion. The editable sources in `assets/template/src/discovery/` demonstrate implementation choices.

## Compare the decisive shot with C3

Watch 00:18–00:34 in the approved film. The gatepost establishes a boundary before Nina walks. Her feet, shadow, wristband and the post keep their positions relative to one another as she crosses. The next shot pairs that outcome with the same girl still outside. A pupil can point to the difference. Use the original reference the family supplies when it differs. The companion evaluator also includes this excerpt for offline use. [C3 reference player](https://chloe-c3-review.oliver-au.chatgpt.site/?scene=crossing)

Translate the quality of that decision into the current subject. Sketch the setup, decisive intermediate state and consequence at player size. In Reading, place the two clues in one believable scene and let Chloe connect them without showing an imagined event as fact. In Maths, keep the base quantity visible as a part is added or removed, and reveal each total at the relevant spoken cue. In Thinking Skills, test the same objects against the conditions, including a near miss. In Writing, keep the actual words readable and show how the revision changes what a particular reader can do. A focused diagram or annotated manuscript can carry an entire shot when its changes reveal the reasoning.

Stage visual detail around the teaching action. Distinguish the foreground teaching object from its setting with perspective, overlap, materials and light where appropriate. Give it room to move. A neutral prediction or exam panel can hold steady for reading. When explanation resumes, return to a demonstration. Export that sequence and compare it with C3 before repeating a treatment across a batch.

## Canvas and hierarchy

- 1920 × 1080, 16:9, normally 30 FPS.
- Background `#0c1115`; subtle teal radial glow is optional.
- Main text `#f3f0e7`; secondary text `#9ba9ad`; fine dividers `#2b393f`.
- Coral `#ff6756` for traps or discarded hypotheses; mint `#a6e6c7` for supported results; cyan `#7bcce0` for neutral questions, quantities, and prompts.
- Warm paper `#eae5d8` with dark ink `#273337` for passages and evidence cards. Ticket or physical-object accents may use muted gold `#ead2a7`.
- Font: Manrope Variable, with Arial/sans-serif fallback. Use medium weights for prose, strong weights for titles and key quantities. Bundle font files with a hosted player.

The upper left brand is a small coral square, **CHLOE**, then **SELECTIVE / SUBJECT**. The upper right shows scene number and a short phase label. Branding is configurable when the user requests it.

Keep the main content within x=110–1810 and approximately y=150–870. Titles start near y=150, normally 72–88 px. Large numbers may be 110–190 px. Passage and option text is usually 40–52 px; captions around 35 px. Fit the content by rephrasing, staging, or changing layout before shrinking important text. Validate actual wrapping, especially for long questions.

Reserve the bottom band for captions. The reference captions sit 88 px above the bottom in a centred dark plate, with roughly 260 px side insets. A thinking timer can sit near y=840 while narration/captions are absent. Do not stack a result and caption in the same band.

## Layout and movement

Use generous empty space, a single clear focal point, restrained shadows, thin connectors, and simple original geometry. Keep the relevant object or passage in view while the learner needs it; a short question or label supports it. Long passages belong on a warm paper panel; options can sit beside them. Avoid grids of text cards and numbered step boxes — say the steps while the object performs them.

A slow push-in (scale 1 → 1.08 over a few seconds) or a pan toward the detail being discussed directs attention without decoration. Dim what is not being discussed rather than removing it, so the learner keeps her place.

Typical entrances take 0.4–0.7 seconds with a smooth ease and 12–30 px of travel. Move objects because their relationship changes. A mathematical quantity should grow, split, regroup, or be removed visibly; an evidence line should connect the clue to the conclusion. Avoid continuous decorative movement, flashing, and busy backgrounds.

Use `useCurrentFrame()`, `useVideoConfig().fps`, and clamped interpolation. Do not use CSS animations, wall-clock timers, or unseeded randomness inside a composition. Generated repetitions such as tiles can be mapped; authored scenes and clips should remain individually editable.

### Illustrating a physical action

Choose a viewpoint that makes the action understandable with the sound off. Sketch the starting pose, decisive moment and ending pose at the size the learner will actually see. For a person entering a place, establish the threshold, both sides and a continuous walkable surface. Set the scale of doors and props against the person. Use overlap, a consistent light direction and a contact shadow to clarify depth. Give the teaching prop enough contrast to recognise in the wide shot, then preserve its shape, colour and orientation in a close-up.

For a walk, tie stride to distance travelled. Keep the supporting foot planted against the ground as the body passes over it, then bend the other knee to clear the floor. Ease the weight into the first step and settle it over the feet at the stop. Lead a deliberate gesture with the gaze or shoulder and let the hand arrive on the spoken cue. Frame the action clear of captions. During a prediction or a comparison, hold the evidence steady.

For an editable example, open **Motion-studies → Pool-Gate-Walk** in Studio. The [silent study](../assets/template/src/discovery/studies/pool/GateWalkStudy.tsx) drives the character’s pose from the distance she walks. The adjacent `Nina.tsx` contains the joints and wristband gesture, and `Pool.tsx` places the person between the back and front posts. Reuse the rig, scenery or timing independently when the new question calls for them.

## Reading and listening

Show the question long enough to understand it. Reveal clues and transformations in the same order as the narration. During a prediction pause, remove the current narration caption and leave a quiet progress line. Do not cue the correct option with colour or motion beforehand.

Sound effects are optional, brief, and quiet. Narration must remain clear. Background music is not required. Use original drawn assets and the supplied learning content; no external footage is needed to recreate this style.
