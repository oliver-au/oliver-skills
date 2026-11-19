"""Verify that the files being released match the evaluator's reviewed copies."""
import argparse
import hashlib
import json
import re
import sys
from pathlib import Path


def verify(directory, inventory, manifest):
    expected = json.loads(inventory.read_text())
    records = json.loads(manifest.read_text())["lessons"]
    if not isinstance(expected, list) or not expected or not all(isinstance(i, str) and i for i in expected):
        raise ValueError("Inventory must be a nonempty JSON list of lesson IDs.")
    if len(expected) != len(set(expected)):
        raise ValueError("Duplicate lesson in the inventory.")
    if not isinstance(records, list):
        raise ValueError("Manifest lessons must be a list.")
    directory = directory.resolve(strict=True)
    seen = set()
    paths = set()
    for record in records:
        lesson = record["id"]
        name = Path(record["file"])
        if name.is_absolute() or ".." in name.parts:
            raise ValueError(f"{lesson}: expected a relative file inside the release directory.")
        path = (directory / name).resolve(strict=True)
        if directory not in path.parents or not path.is_file():
            raise ValueError(f"{lesson}: file is outside the release directory or is not a file.")
        if lesson in seen or path in paths:
            raise ValueError(f"{lesson}: duplicate lesson or file.")
        seen.add(lesson)
        paths.add(path)
        digest = record["sha256"]
        if not isinstance(digest, str) or not re.fullmatch(r"[0-9a-f]{64}", digest):
            raise ValueError(f"{lesson}: missing or invalid reviewed SHA-256.")
        actual = hashlib.sha256()
        with path.open("rb") as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                actual.update(chunk)
        if actual.hexdigest() != digest:
            raise ValueError(f"{lesson}: different bytes from the reviewed film.")
    if seen != set(expected):
        raise ValueError(f"Inventory mismatch. Missing {sorted(set(expected) - seen)}, extra {sorted(seen - set(expected))}.")
    return len(seen)


if __name__ == "__main__":
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("directory", type=Path, help="Directory containing the release copies")
    cli.add_argument("inventory", type=Path, help="Independent JSON list of expected lesson IDs")
    cli.add_argument("manifest", type=Path, help="Reviewed JSON with a lessons list containing id, file and sha256")
    args = cli.parse_args()
    try:
        count = verify(args.directory, args.inventory, args.manifest)
    except (OSError, ValueError, KeyError, TypeError) as error:
        sys.exit(str(error))
    print(f"All {count} release files match their reviewed copies.")
