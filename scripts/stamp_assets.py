#!/usr/bin/env python3
"""Stamp local asset URLs in index.html with a content hash (?v=<hash>).

Cloudflare and browsers cache styles.css and the scripts for hours, so a deploy
can pair new HTML with an old stylesheet. A hash that changes whenever the file
changes gives every deploy fresh asset URLs.

Usage:
  python3 scripts/stamp_assets.py          rewrite index.html in place
  python3 scripts/stamp_assets.py --check  exit 1 if any stamp is stale
"""

import hashlib
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "index.html"
ASSETS = ("styles.css", "site.js", "theme-init.js")


def digest(name: str) -> str:
    return hashlib.sha256((ROOT / name).read_bytes()).hexdigest()[:10]


def stamp(html: str) -> str:
    for name in ASSETS:
        pattern = re.compile(r'((?:href|src)=")' + re.escape(name) + r'(?:\?v=[0-9a-f]*)?(")')
        html, count = pattern.subn(rf"\g<1>{name}?v={digest(name)}\g<2>", html)
        if count == 0:
            sys.exit(f"stamp_assets: no reference to {name} found in index.html")
    return html


def main() -> int:
    current = HTML.read_text()
    updated = stamp(current)

    if "--check" in sys.argv[1:]:
        if updated != current:
            print("stamp_assets: asset stamps are stale; run `make stamp`")
            return 1
        print("stamp_assets: ok")
        return 0

    if updated != current:
        HTML.write_text(updated)
        print("stamp_assets: updated index.html")
    return 0


if __name__ == "__main__":
    sys.exit(main())
