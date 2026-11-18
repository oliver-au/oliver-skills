# Choosing a lesson pattern

Read the example nearest the subject; combine mechanisms when helpful. These are implementation examples, not restrictions on what can be taught.

| Subject | Bundled source | Teaching mechanism |
| --- | --- | --- |
| Mathematical reasoning | `MathVideo.tsx`, `math/` | Predict a result, animate quantities, expose a changed base or mistaken operation, then transfer to different numbers. |
| Thinking skills | `LogicVideo.tsx`, `logic/` | State a hypothesis, try supporting and challenging examples, change one property at a time, and identify what the tests establish. |
| Reading | `ReadingVideo.tsx`, `reading/` | Read a compact passage, choose an inference, highlight separate clues, connect them to a likely conclusion, and reject unsupported added details. |
| Spatial reasoning | `CubeVideo.tsx`, `cube/` | Fold, rotate or reflect a real 3D model on screen, let the learner commit to the intuitive answer, then watch the model contradict it. Derive every view from the model. |

For a folding or rotation problem that depends on depth, use a genuine 3D model (CSS `transform-style: preserve-3d` with frame-driven rotations, or an equivalent library) rather than hand-drawn before/after pictures. Fold the net hinge by hinge so the learner can track a face. Generate answer-option views from the same folded model so labels, letter orientation and mirror images are correct by construction; build impossible distractors by changing one face, and state which rule it breaks. Keep the flat net visible beside the cube whenever a question refers to it. Teach the fast rule the test needs (for cube nets: in a straight line of three squares, the two ends are opposite) and show it as a fold, not a sentence.

For mathematics, keep units and representations consistent. Equal fractions require the same whole and equal-sized parts; percentage changes require the correct reference quantity. Verify the arithmetic separately from the animation. Draw exact counts where counting is the evidence.

For conditional language, label what is required and what is enough. Show two possible cases that obey the same rule, with the requirement met and different outcomes. When a rule governs permission, distinguish permitted action from what someone physically did. Anchor the requirement to the time of the action. Ask which fact would break the rule. Check each option against a possible world before recording.

For thinking skills, distinguish a chosen hidden rule from a uniquely proved rule. Finite examples can fit many rules. A universal claim can be disproved by a valid counterexample; do not confuse an unrelated example with a counterexample.

For reading, distinguish stated fact, well-supported inference, and unsupported detail. A likely inference need not be certain. Write distractors that reveal the intended misunderstanding without making the passage ambiguous. Do not invent quotations or claim that an author's intent is explicitly stated when it is inferred.

For other subjects, select an observable mechanism: a timeline, map, causal chain, sorting operation, annotated diagram, or comparison. Preserve the question/prediction/evidence/transfer rhythm rather than forcing a number animation into every topic.

## New lesson brief

Convert the user's input into a compact working brief: cold-open object, question, tempting answer and why it feels right, correct reasoning, trap name, visual evidence, exam-bridge question with distractor reasons, transfer question with its answer, pocket rule, and narration. Keep the original wording when accuracy or exam fidelity depends on it. Mark newly written teaching questions as original examples.

Use the user's requested duration. Otherwise target about 280–380 spoken words for a 2–3 minute lesson, then let measured narration and thinking pauses determine the final runtime. Split several unrelated knowledge points into separate lessons when that improves learning. Do not pad or truncate a correct explanation merely to match an example's exact length.

## Authoring new content

Copy the closest scene mechanism, give the new lesson and clips unique IDs, and replace all linked text, quantities, options, narration, captions, and practice data. Avoid editing one visible numeral while leaving the answer or voice from the example. Keep scene files small enough to inspect and preview independently.

The shell and captions are reusable; the explanatory visual usually needs custom authored code. A template-only replacement of titles is not enough when the new concept changes the reasoning.

The starter's `Shared.tsx` imports and merges the example narration manifests. When adding a manifest, add it to that merge; when replacing an example, update its existing manifest. Add the new lesson to `DiscoveryCompositions.tsx` and to the `lessons` list in `src/watch.tsx`, including its `audioPrefix`. Set the player default to the requested lesson rather than leaving Reading selected accidentally. These are authored registrations, not automatic discovery from JSON.
