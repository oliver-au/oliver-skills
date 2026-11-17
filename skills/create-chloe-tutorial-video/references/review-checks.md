# Review before delivery

Use observable checks proportional to the lesson. Do not create tests that merely restate the JSX or compare headings.

## Content

- Recompute the answer and transfer answer independently. Check quantities, units, choice labels, and diagram counts against the explanation.
- Check that the visual actually demonstrates the knowledge point and the tempting mistake is addressed accurately.
- Check that any uncertainty is preserved: an inference can be likely, and several rules can match a finite number sequence.
- Confirm the supplied questions are all covered or explain how they were grouped into lessons.

## Frames and timing

- Run TypeScript and the appropriate build. Preview each scene and its transition.
- Inspect actual frames at the opening, prediction pause, main transformation, answer reveal, and practice result. Look for clipping, overlap, stale values, unreadable text, and awkward wrapping.
- Inspect immediately before and after the answer time. No answer colour, mark, caption, or voice should appear during the prediction period.
- Every narration file must exist, decode, and have a measured duration. Scene durations must contain the clip plus its intended lead and tail. Captions must remain inside the clip interval.
- If possible, audition the narration for pace and pronunciation. Decoding/peak checks alone are not listening. Report the difference honestly if audition is unavailable.
- A draft with estimated durations or `ready: false` audio is not a final narrated video.

## Player and delivery

Test play/pause, replay, scrubbing, and lesson selection through the actual browser UI. Confirm audio is unmuted when testing speech. Check that controls and the full frame fit a typical laptop window; avoid a large page header that pushes the player out of view. Use fullscreen for close reading on smaller screens.

For a public review page, verify the hosted page loads the new lesson and its assets. Keep narration, fonts, and assets within the standalone build. Do not ship local paths, missing localhost resources, unrelated course files, secrets, or a copied hosting identity. Preserve the requested audience; no publication is implied by an ordinary video-generation request.

State only checks actually performed. A successful build does not prove visual quality, and a screenshot does not prove audio playback.
