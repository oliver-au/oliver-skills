# Chloe visual and motion specification

The bundled `assets/template/src/discovery/` source is the concrete reference. Preserve its design language while adapting diagrams and pacing to the new problem.

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

Use generous empty space, a single clear focal point, restrained shadows, thin connectors, and simple original geometry. A title, diagram, and short explanation are often enough. Long passages belong on a warm paper panel; options can sit beside them.

Typical entrances take 0.4–0.7 seconds with a smooth ease and 12–30 px of travel. Move objects because their relationship changes. A mathematical quantity should grow, split, regroup, or be removed visibly; an evidence line should connect the clue to the conclusion. Avoid continuous decorative movement, flashing, and busy backgrounds.

Use `useCurrentFrame()`, `useVideoConfig().fps`, and clamped interpolation. Do not use CSS animations, wall-clock timers, or unseeded randomness inside a composition. Generated repetitions such as tiles can be mapped; authored scenes and clips should remain individually editable.

## Reading and listening

Show the question long enough to understand it. Reveal clues and transformations in the same order as the narration. During a prediction pause, remove the current narration caption and leave a quiet progress line. Do not cue the correct option with colour or motion beforehand.

Sound effects are optional, brief, and quiet. Narration must remain clear. Background music is not required. Use original drawn assets and the supplied learning content; no external footage is needed to recreate this style.
