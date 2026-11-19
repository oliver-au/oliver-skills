#!/usr/bin/env python3
"""Compare the words in an approved script, timed captions and an independent transcription.

Usage: python3 check_transcript.py case.json [--output report.json]
Paths are relative to case.json. Supply the caption cues actually used in the final
export and run recognition on that exact media's audio track. Case JSON example:
{"media":"lesson.mp4","durationMs":12000,"approvedText":"Only Maya had six litres.",
 "captions":[{"startMs":250,"endMs":4000,"text":"Only Maya had six litres."}],
 "publishedTranscript":"Only Maya had six litres.", "names":["Maya"],"recognition":{"engine":"your speech recogniser",
 "mediaSha256":"sha256 of lesson.mp4","text":"Only Maya had six litres."}}
Exit 0 = all supplied word sources agree; 1 = investigate flags; 2 = invalid input.
publishedTranscript is optional. Supply spoken body text independently extracted
from the actual learner download/player transcript, excluding headings/timecodes.
An omitted transcript is explicitly reported as not supplied.
SRT or VTT users can export their cues as the JSON list above. For burned captions
also inspect the rendered film. Possible unit or negation splits are flagged for
review even when all words match. No recognition engine, network or Python packages
are required by this comparison step.
"""
import argparse
import difflib
import hashlib
import json
import math
import re
import sys
import unicodedata
from pathlib import Path

# Preserve meaning-bearing symbols, digit separators, fractions, decimals and quoted names.
TOKEN = re.compile(r"(?:\d+(?:[.,:/]\d+)*)|(?:[^\W\d_]+(?:'[^\W\d_]+)*)|[%$£€+−×÷=<>/°²³≤≥≠↑↓→←↔∝∉∈∩∪≈√^±∞]|(?<![^\W\d_])-|-(?![^\W\d_])", re.UNICODE)
NUMBERS = set("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand million first second third fourth fifth sixth seventh eighth ninth tenth half halves quarter quarters double triple twice".split())
UNITS = set("metre metres meter meters centimetre centimetres centimeter centimeters millimetre millimetres kilometre kilometres kilometer kilometers litre litres liter liters millilitre millilitres gram grams kilogram kilograms hour hours minute minutes second seconds dollar dollars cent cents degree degrees percent percentage percentage-point kg g km m cm mm ml l min s".split())
CONDITIONS = set("no not never without unless only all every any both neither either most some always must cannot can't couldn't didn't doesn't isn't aren't don't won't more less fewer least most before after above below exactly at beyond between increase decreases increased decreased".split())

def tokens(text):
    normal = unicodedata.normalize("NFC", text).replace("’", "'").replace("‘", "'").casefold()
    # A minus between isolated variable names also carries meaning (x-y).
    normal = re.sub(r"\b([^\W\d_])-(?=[^\W\d_]\b)", r"\1 − ", normal)
    return ["−" if word == "-" else word for word in TOKEN.findall(normal)]

def nonempty(value, field):
    if not isinstance(value, str) or not value.strip():
        raise ValueError(field + " must contain text")
    return value.strip()

def differences(expected, actual, names):
    wanted, found = tokens(expected), tokens(actual)
    flags = []
    for op, a, b, c, d in difflib.SequenceMatcher(None, wanted, found, autojunk=False).get_opcodes():
        if op == "equal":
            continue
        changed = set(wanted[a:b] + found[c:d])
        risk = []
        if changed & NUMBERS or any(any(char.isdigit() for char in w) for w in changed):
            risk.append("number")
        if changed & UNITS:
            risk.append("unit")
        if changed & CONDITIONS or any(w.endswith("n't") for w in changed):
            risk.append("condition or negation")
        if changed & names:
            risk.append("name or label")
        if any(not any(ch.isalnum() for ch in word) for word in changed):
            risk.append("symbol")
        flags.append({"type":op, "expected":" ".join(wanted[a:b]), "observed":" ".join(found[c:d]),
                      "expectedWordIndex":a,"context":" ".join(wanted[max(0,a-4):min(len(wanted), b+4)]),
                      "check":risk or ["wording"]})
    return flags

def cue_boundaries(phrases):
    """Flag likely meaning changes where caption slices split one sentence."""
    review = []
    sentence_so_far = ""
    scope = {"not","no","cannot","never","without","unless","neither","only","probably","might","may"}
    for index, text in enumerate(phrases):
        current = tokens(text)
        if index and sentence_so_far and current:
            prev = tokens(sentence_so_far)
            reasons = []
            if len(current) == 1:
                reasons.append("one-word fragment")
            if current[0] in UNITS and prev and (prev[-1] in NUMBERS or any(ch.isdigit() for ch in prev[-1])):
                reasons.append("amount separated from unit")
            if scope.intersection(prev) or any(w.endswith("n't") for w in prev):
                reasons.append("check scope of the prior qualification or negation")
            if reasons:
                review.append({"cueIndex":index,"previousSentenceTail":sentence_so_far[-140:],
                               "nextCue":text,"check":reasons})
        # Keep only the final unfinished sentence, including its earlier qualification.
        combined = (sentence_so_far + " " + text).strip()
        combined = re.sub(r"""[.!?]+["'’”]*($|\s+)""", "\n", combined)
        sentence_so_far = combined.split("\n")[-1].strip()
    return review

def sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024*1024), b""):
            digest.update(chunk)
    return digest.hexdigest()

def compare(case, directory):
    approved = nonempty(case["approvedText"],"approvedText")
    if not tokens(approved):
        raise ValueError("approvedText has no comparable words")
    recognition = case["recognition"]
    engine = nonempty(recognition["engine"], "recognition.engine")
    actual = nonempty(recognition["text"], "recognition.text")
    checksum = nonempty(recognition["mediaSha256"], "recognition.mediaSha256")
    digest = sha256(directory / nonempty(case["media"],"media"))
    duration = case["durationMs"]
    if isinstance(duration,bool) or not isinstance(duration,(float,int)) or not math.isfinite(duration) or duration <= 0:
        raise ValueError("durationMs must be a positive measured duration")
    names = case.get("names",[])
    if not isinstance(names,list) or any(not isinstance(n,str) for n in names):
        raise ValueError("names must be a list of names or labels")
    name_words = {w for name in names for w in tokens(name)}
    cues = case["captions"]
    if not isinstance(cues,list) or not cues:
        raise ValueError("captions must include the actual final caption cues")
    phrases, timing = [], []
    previous_end = 0
    for i,cue in enumerate(cues):
        start, end = cue["startMs"], cue["endMs"]
        if any(isinstance(n,bool) or not isinstance(n,(int,float)) or not math.isfinite(n) for n in (start,end)):
            raise ValueError("caption times must be finite milliseconds")
        if start < 0 or end <= start or start < previous_end - 0.001 or end > duration + 0.001:
            timing.append(i)
        previous_end = end
        phrases.append(nonempty(cue["text"],"caption text"))
    boundary_review = cue_boundaries(phrases)
    joined = " ".join(phrases)
    cap_diff = differences(approved, joined, name_words)
    voice_diff = differences(approved, actual, name_words)
    published = case.get("publishedTranscript")
    published_diff = []
    published_status = "not supplied"
    if published is not None:
        published = nonempty(published, "publishedTranscript")
        published_diff = differences(approved, published, name_words)
        published_status = "word mismatch" if published_diff else "words match"
    same_digest = digest.casefold() == checksum.casefold()
    status = "words match"
    if not same_digest:
        status = "unverified media"
    elif timing or cap_diff:
        status = "revise captions or source"
    elif published_diff:
        status = "revise learner transcript or source"
    elif voice_diff:
        status = "review recorded speech"
    elif boundary_review:
        status = "review caption boundaries"
    elif published_status == "not supplied":
        status = "caption and speech words match; learner transcript not supplied"
    return {"result":status,"mediaSha256":digest,"recognitionEngine":engine,
            "recognitionMatchesMediaHash":same_digest,"numberOfCues":len(phrases),
            "learnerTranscriptResult":published_status,"learnerTranscriptWordDifferences":published_diff,
            "allThreeWordSourcesMatch":same_digest and not cap_diff and not voice_diff and published_status=="words match",
            "cueBoundaryChecks":boundary_review,
            "learnerTranscriptTypographyNeedsInspection":None if published is None else " ".join(published.split()) != " ".join(approved.split()),
            "invalidCueIndices":timing,"captionWordDifferences":cap_diff,"speechWordDifferences":voice_diff,
            "captionTypographyNeedsInspection":" ".join(joined.split()) != " ".join(approved.split()),
            "scope":"Text agreement only. Review meaning, typography, actual on-screen caption visibility, speech timing, pronunciation and content correctness separately."}

def main():
    parser=argparse.ArgumentParser(description=__doc__,formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("case",type=Path)
    parser.add_argument("--output",type=Path)
    args=parser.parse_args()
    try:
        report=compare(json.loads(args.case.read_text(encoding="utf-8")),args.case.parent)
        message=json.dumps(report,indent=2,ensure_ascii=False)+"\n"
        if args.output:
            args.output.write_text(message,encoding="utf-8")
        else:
            print(message,end="")
        return 0 if report["result"] in ("words match", "caption and speech words match; learner transcript not supplied") else 1
    except (KeyError,ValueError,TypeError,OSError) as error:
        print(f"Invalid evidence: {error}",file=sys.stderr)
        return 2

if __name__ == "__main__":
    sys.exit(main())
