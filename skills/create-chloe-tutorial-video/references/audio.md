# Narration and timing

Use a clear, warm, conversational voice at roughly 150 words per minute. Read mathematical symbols as spoken language. Write for the ear of a 10-year-old: short sentences, "you" and "we", one idea per sentence, Australian spelling in captions. Split each beat into small clips so a reveal can start after a deliberate half-second of silence rather than mid-sentence. Leave a real four-second thinking interval after the prediction narration; do not hide narration inside that interval. Derive scene and reveal timings from measured clips, not estimated word counts.

The helpers need Node.js 20.19 or newer. They can use an already-running local Phonon service with the Easton voice at `http://127.0.0.1:11434`. This is a local environment convention, not a required service on every machine. Do not assume that the model is installed or start downloading one without checking the environment.

## Prepare a lesson

Inputs can be a JSON object keyed by clip ID or an array:

```json
[
  {"id":"lesson-hook","text":"A price rises by twenty percent, then falls by twenty percent."},
  {"id":"lesson-predict","text":"Will it return to the starting price? Make your prediction."}
]
```

IDs use lowercase letters, digits, hyphens or underscores. Keep each clip short enough to correspond to one teaching beat. Existing template `narration.json` and `reading-narration.json` records are accepted directly; unrelated output-manifest entries are preserved.

Run helpers from the skill folder, supplying the generated project and input paths:

```sh
node scripts/prepare-narration.mjs --project ./lesson --input ./lesson/narration-input.json --manifest src/discovery/narration.json
```

`--manifest` is relative to the generated project. For the reading example, select `src/discovery/reading-narration.json`; for the cube-net example, `src/discovery/cube-narration.json` (its script is `src/discovery/cube/script.json`). Final audio is written under `public/discovery/`; raw WAVs stay under `work/narration-raw/`. Final filenames include a content fingerprint, so old audio remains usable if preparing a later batch fails. The returned manifest supplies the exact `src` paths; do not hard-code filenames in JSX. A report appears in `work/narration-<manifest-name>-validation.json`.

The processor uses FFmpeg and ffprobe from PATH, or the project's installed Remotion compositor package. It checks the macOS architecture package, Linux GNU/musl packages, or Windows MSVC package and uses a binary only if it starts successfully. For another installation, supply `--ffmpeg /path/to/ffmpeg --ffprobe /path/to/ffprobe`. `--voice`, `--model`, and `--host` configure the existing local speech service; the host must remain loopback. `--wpm` changes the target pace. Large changes in speech speed are clamped, so review the reported actual pace.

## Draft or another voice provider

- `--draft` produces estimated durations and captions without generating audio. Every affected track receives `ready:false`; the template displays **Narration pending**. This is a storyboard, not a completed narrated video.
- `--prepare-only` consumes `<project>/work/narration-raw/<id>.wav` and performs the same measured preparation and validation. Use it for supplied recordings or output from an available voice provider. `--raw-dir` selects another directory inside the project.
- If local speech is unavailable, continue the visual draft and identify the missing narration dependency. Use a provider the user has selected or already authorized, or ask for the necessary provider/recording choice. Do not fabricate audio, silently change the requested voice, or claim that the draft has narration.

For a single local clip, `node scripts/tts-local.mjs --text "Spoken words" --out ./lesson/work/narration-raw/hook.wav` writes a 24 kHz mono WAV. Its cache is keyed by text, model, voice and local endpoint.

## Checks and delivery

The preparation script measures duration with ffprobe, normalizes speech toward -18 LUFS with headroom, and creates AAC mono audio at 24 kHz. It decodes each result and rejects clipping, invalid samples and effectively silent output. `ready:true` is committed only after the complete requested batch passes; failures leave the previous manifest intact.

Phrase captions are weighted by word count across the measured clip. They are approximate reading aids, not forced alignment or verified transcription. Inspect the beginning, middle and end of each scene, especially reveal words and the final practice answer. Prefer genuine timed transcription when available and needed for closer alignment.

Confirm that every narration ID used by JSX exists, is `ready:true`, and has a corresponding media file before delivering a narrated result. Check pacing and pronunciation through playback when listening is available. Technical decoding checks alone do not establish natural voice delivery. Rebuild the standalone player after changing narration manifests or media.
