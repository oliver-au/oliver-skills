# Oliver's skills

Reusable skills for coding and creating learning materials.

- [Create a Chloe tutorial video](skills/create-chloe-tutorial-video/SKILL.md) turns questions and knowledge points into narrated lessons for Reading, Mathematical Reasoning, Thinking Skills and Writing. Includes editable examples, practice and a review player.
- [Evaluate a Chloe tutorial video](skills/evaluate-chloe-tutorial-video/SKILL.md) independently checks the final export, reasoning, exam alignment, spoken words, visible captions and learner transcript.
- [JavaScript Clean Code](.claude/skills/javascript-clean-code/SKILL.md): Existing JavaScript implementation and review guidance.

To use the video skill in Codex, ask it to install the skill from `skills/create-chloe-tutorial-video` in this repository, then invoke it with your material:

```text
Use $create-chloe-tutorial-video.

Knowledge point: adding fractions requires equal-sized parts.
Question: What is 1/3 + 1/4? Explain why 2/7 is wrong.
Audience: Year 6.
Create a narrated video with an animated explanation and a practice question.
```

You can paste ordinary questions or attach your material. The [structured input example](skills/create-chloe-tutorial-video/references/lesson-input.json) is optional. A local preview is the default; ask explicitly for an MP4 export or a public review page when needed. Speech generation requires an available voice service or supplied narration recordings. For an independent review, install `skills/evaluate-chloe-tutorial-video` alongside the creator and give it the learning objectives, the final export and the learner materials.
