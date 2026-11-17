# Oliver's skills

Reusable skills for coding and creating learning materials.

- [Chloe Tutorial Video](skills/create-chloe-tutorial-video/SKILL.md): Turn questions and knowledge points into narrated lessons with animated explanations, prediction pauses, and practice questions. Includes editable maths, thinking-skills, and reading examples, a narration helper, and a standalone review player.
- [JavaScript Clean Code](.claude/skills/javascript-clean-code/SKILL.md): Existing JavaScript implementation and review guidance.

To use the video skill in Codex, ask it to install the skill from `skills/create-chloe-tutorial-video` in this repository, then invoke it with your material:

```text
Use $create-chloe-tutorial-video.

Knowledge point: adding fractions requires equal-sized parts.
Question: What is 1/3 + 1/4? Explain why 2/7 is wrong.
Audience: Year 6.
Create a narrated video with an animated explanation and a practice question.
```

You can paste ordinary questions or attach your material. The [structured input example](skills/create-chloe-tutorial-video/references/lesson-input.json) is optional. A local preview is the default; ask explicitly for an MP4 export or a public review page when needed. Speech generation requires an available voice service or supplied narration recordings.
