# Choosing a lesson pattern

Read the example nearest the subject; combine mechanisms when helpful. These are implementation examples, not restrictions on what can be taught.

| Subject | Bundled source | Teaching mechanism |
| --- | --- | --- |
| Mathematical reasoning | `MathVideo.tsx`, `math/` | Predict a result, animate quantities, expose a changed base or mistaken operation, then transfer to different numbers. |
| Thinking skills | `LogicVideo.tsx`, `logic/` | State a hypothesis, try supporting and challenging examples, change one property at a time, and identify what the tests establish. |
| Reading | `ReadingVideo.tsx`, `reading/` | Read a compact passage, choose an inference, highlight separate clues, connect them to a likely conclusion, and reject unsupported added details. |

For mathematics, keep units and representations consistent. Equal fractions require the same whole and equal-sized parts; percentage changes require the correct reference quantity. Verify the arithmetic separately from the animation. Draw exact counts where counting is the evidence.

For thinking skills, distinguish a chosen hidden rule from a uniquely proved rule. Finite examples can fit many rules. A universal claim can be disproved by a valid counterexample; do not confuse an unrelated example with a counterexample.

For reading, distinguish stated fact, well-supported inference, and unsupported detail. A likely inference need not be certain. Write distractors that reveal the intended misunderstanding without making the passage ambiguous. Do not invent quotations or claim that an author's intent is explicitly stated when it is inferred.

For other subjects, select an observable mechanism: a timeline, map, causal chain, sorting operation, annotated diagram, or comparison. Preserve the question/prediction/evidence/transfer rhythm rather than forcing a number animation into every topic.

## New lesson brief

Convert the user's input into a compact working brief: question, correct reasoning, intended knowledge point, likely mistake, visual evidence, narration, and a transfer question with its answer. Keep the original wording when accuracy or exam fidelity depends on it. Mark newly written teaching questions as original examples.

Use the user's requested duration. Otherwise target about 220–270 spoken words for a short lesson, then let measured narration and thinking pauses determine the final runtime. Split several unrelated knowledge points into separate lessons when that improves learning. Do not pad or truncate a correct explanation merely to match an example's exact length.

## Authoring new content

Copy the closest scene mechanism, give the new lesson and clips unique IDs, and replace all linked text, quantities, options, narration, captions, and practice data. Avoid editing one visible numeral while leaving the answer or voice from the example. Keep scene files small enough to inspect and preview independently.

The shell and captions are reusable; the explanatory visual usually needs custom authored code. A template-only replacement of titles is not enough when the new concept changes the reasoning.

The starter's `Shared.tsx` imports and merges the example narration manifests. When adding a manifest, add it to that merge; when replacing an example, update its existing manifest. Add the new lesson to `DiscoveryCompositions.tsx` and to the `lessons` list in `src/watch.tsx`, including its `audioPrefix`. Set the player default to the requested lesson rather than leaving Reading selected accidentally. These are authored registrations, not automatic discovery from JSON.
