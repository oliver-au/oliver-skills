# Review before delivery

Use observable checks proportional to the lesson. Do not create tests that merely restate the JSX or compare headings.

## Script critique before building

Read the full narration and beat sheet as if you were a 10-year-old hearing it once. Use the relevant checks for the chosen lesson pattern.

1. **Cold open.** Is a concrete object on screen and a question asked within 10 seconds, with no agenda or title card?
2. **Tempting answer.** When a misconception drives the example, does the script explain its appeal? Can Chloe attempt fresh practice without a cue?
3. **Visible contradiction.** Does a visual event — not a sentence — show that the tempting answer fails?
4. **Mechanism.** After the reveal, could she explain *why* in her own words, using the same object?
5. **Exam bridge.** Is there a question in current official test format, with a method that fits about a minute and a reason for each wrong option?
6. **Transfer.** Does the practice change the surface (numbers, story, shape) but keep the deep structure?
7. **Pocket rule.** Is it short and accurate when remembered on its own? Test a case just outside its conditions.
8. **Language.** Average sentence ≤ 15 words? Every term a Year 5 child knows or is defined with a picture? Australian spelling?
9. **Show, don't tell.** Does the diagram or passage supply the evidence? Leave it still when reading or comparison takes time.
10. **Honesty.** No invented statistics, no "always appears in the test", originals labelled as originals.

Record the reasoning, answers and any changes needed before production in the working brief.

## Content

- Recompute the answer and transfer answer independently. Check quantities, units, choice labels, and diagram counts against the explanation.
- Check that the visual actually demonstrates the knowledge point and the tempting mistake is addressed accurately.
- Check that any uncertainty is preserved: an inference can be likely, and several rules can match a finite number sequence.
- For an inference question, remove the target rule and solve again. If the same answer still follows from a stated fact alone, change the givens so the learner needs the intended reasoning. For “must” and “could”, try to construct a permitted case that makes each option false or true. Match the question wording to that test.
- Check options for unintended cues: the correct option must not be the only one with a hedge word ("probably"), the longest, the most specific, or always in the same position across lessons.
- Check that every visual proves the exact sentence spoken over it. A cube showing faces A, E and D does not prove that A, B and C can meet at a corner.
- Confirm the supplied questions are all covered or explain how they were grouped into lessons.

## Frames and timing

- Run TypeScript and the appropriate build. Preview each scene and its transition.
- Inspect actual frames at the opening, prediction pause, main transformation, answer reveal, and practice result. Look for clipping, overlap, stale values, unreadable text, and awkward wrapping.
- Inspect immediately before and after the answer time. No answer colour, mark, caption, or voice should appear during the prediction period.
- Inspect the prediction pause frame on its own: every diagram, number and option needed to answer must be visible. "Use the same net" with no net on screen fails.
- Contact-sheet the whole lesson. Check that static frames give time to read or compare, and that decisive changes are visible across successive frames.
- Check labels on 3D or overlapping shapes are not hidden behind other faces or connectors during the moments they are named.
- Every narration file must exist, decode, and have a measured duration. Scene durations must contain the clip plus its intended lead and tail. Captions must remain inside the clip interval.
- For a single review lesson, play the final mix through and listen for pronunciation, pace, awkward pauses, and clipped words wherever audio audition is available. Record which intervals were heard. If audition is unavailable, state exactly which technical checks passed. A transcript or peak reading does not verify delivery.
- A draft with estimated durations or `ready: false` audio is not a final narrated video.

## Player and delivery

Test play/pause, replay, scrubbing, and lesson selection through the actual browser UI. Confirm audio is unmuted when testing speech. Check that controls and the full frame fit a typical laptop window; avoid a large page header that pushes the player out of view. Use fullscreen for close reading on smaller screens.

For a public review page, verify the hosted page loads the new lesson and its assets. Keep narration, fonts, and assets within the standalone build. Do not ship local paths, missing localhost resources, unrelated course files, secrets, or a copied hosting identity. Preserve the requested audience; no publication is implied by an ordinary video-generation request.

State only checks actually performed. A successful build does not prove visual quality, and a screenshot does not prove audio playback.

## A whole course or textbook

When the user requests a course, use [course production](course-production.md). A spot-check of a few attractive scenes does not support a claim that every lesson was reviewed. Keep a per-lesson record of source coverage, answer checks, inspected frames, and unresolved limits.
