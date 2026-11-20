"""
Build content/charter.ts from the client's charter PDF, word for word.

    pdftotext -enc UTF-8 GCI.pdf gci.txt
    python content/tools/build_charter.py gci.txt content/charter.ts

The only edits made to the PDF wording are the typographic fixes in FIXES
(maths that the PDF exported as italic glyphs or raw LaTeX). The script fails
if any italic maths glyph is left, or if an expected item is missing.
"""

import json
import re
import sys

FIXES = [
    # Zero-width spaces follow the list numbers ("13.​Direct"); treat them as spaces.
    ("​", " "),
    ("𝑀𝑔𝐵2", "MgB₂"),
    ("𝐼2𝑅", "I²R"),
    ("$\\mu\\text{m}$", "µm"),
    ("𝐻𝑓𝐵2/𝑇𝑎𝐶", "HfB₂/TaC"),
    ("𝐶𝑂2", "CO₂"),
    ("( 0. 1𝑐 −− 0. 2𝑐)", "(0.1c–0.2c)"),
    ("(𝑝−11𝐵)", "(p–¹¹B)"),
    ("vacuum speed 𝑐)", "vacuum speed c)"),
]

NUMERALS = ["I", "II", "III", "IV", "V", "VI"]


def clean(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def between(text: str, start: str, end: str | None) -> str:
    i = text.index(start) + len(start)
    j = text.index(end, i) if end else len(text)
    return clean(text[i:j])


def split_numbered(body: str, numbers: list[str]) -> list[str]:
    """Split `body` at "<n>. " markers, in order. Returns the text after each marker."""
    out = []
    pos = 0
    starts = []
    for n in numbers:
        marker = f"{n}. "
        k = body.index(marker, pos)
        starts.append((k, k + len(marker)))
        pos = k + len(marker)
    for idx, (_, s) in enumerate(starts):
        e = starts[idx + 1][0] if idx + 1 < len(starts) else len(body)
        out.append(clean(body[s:e]))
    return out


def name_body(s: str) -> dict:
    name, body = s.split(": ", 1)
    return {"name": clean(name), "body": clean(body)}


def main(src: str, dst: str) -> None:
    raw = open(src, encoding="utf-8").read()
    for a, b in FIXES:
        raw = raw.replace(a, b)
    leftover = re.findall(r"[\U0001D400-\U0001D7FF]|\\text|\$", raw.replace("$350M", ""))
    if leftover:
        raise SystemExit(f"Unfixed maths glyphs: {set(leftover)}")
    text = clean(raw)

    # Corporate & Statutory Particulars
    part = between(text, "Corporate & Statutory Particulars", "PART I:")
    particulars = [name_body(p) for p in part.split("●") if p.strip()]

    # Part I
    p1 = between(text, "PART I: FOUNDING VISION & INSTITUTIONAL PURPOSE", "PART II:")
    lead, rest = p1.split(" GCI serves a dual industrial purpose:", 1)
    purposes_txt, closing = rest.split(" All intellectual property", 1)
    vision = {
        "title": "Founding Vision & Institutional Purpose",
        "body": clean(lead),
        "purposeIntro": "GCI serves a dual industrial purpose:",
        "purposes": [name_body(p) for p in split_numbered(purposes_txt, ["1", "2"])],
        "closing": "All intellectual property" + closing,
    }

    # Part II
    p2 = between(text, "PART II: THE SIX GOVERNING COUNCILS & COMPLETE INDUSTRIAL DIVISIONS", "PART III:")
    intro, p2 = p2.split(" Council I: ", 1)
    p2 = "Council I: " + p2
    council_chunks = re.split(r"\s?Council (?=(?:I|II|III|IV|V|VI): )", p2)
    council_chunks = [c for c in council_chunks if c.strip()]
    assert len(council_chunks) == 6, len(council_chunks)
    councils = []
    n = 1
    for numeral, chunk in zip(NUMERALS, council_chunks):
        assert chunk.startswith(numeral + ": "), chunk[:20]
        chunk = chunk[len(numeral) + 2 :]
        title, chunk = chunk.split(" Institutional Directorate of ", 1)
        directorate, chunk = chunk.split(" Division ", 1)
        divisions = []
        for d in re.split(r" Division (?=[IV]+-[A-C]: )", "Division " + chunk):
            d = d.removeprefix("Division ")
            code, d = d.split(": ", 1)
            first = d.index(f" {n}. ") if not d.startswith(f"{n}. ") else -1
            dtitle = clean(d[: first]) if first >= 0 else ""
            items_txt = d[first:] if first >= 0 else d
            count = 0
            while f"{n + count}. " in items_txt and (n + count) <= 72:
                # stop when the next number belongs to a later division (not in this chunk)
                count += 1
            numbers = [str(n + i) for i in range(count)]
            items = [name_body(s) for s in split_numbered(items_txt, numbers)]
            for i, it in enumerate(items):
                it["n"] = n + i
            n += count
            divisions.append({"code": code, "title": dtitle, "initiatives": items})
        councils.append(
            {
                "numeral": numeral,
                "title": clean(title),
                "directorate": "Institutional Directorate of " + clean(directorate),
                "divisions": divisions,
            }
        )
    assert n == 73, f"parsed {n - 1} initiatives"

    # Part III
    p3 = between(text, "PART III: RESPONSIBLE GROWTH & ENVIRONMENTAL STEWARDSHIP", "PART IV:")
    pre, items_txt = p3.split(" 1. ", 1)
    stewardship = {
        "title": "Responsible Growth & Environmental Stewardship",
        "preface": clean(pre),
        "commitments": [name_body(s) for s in split_numbered("1. " + items_txt, ["1", "2", "3", "4"])],
    }

    # Part IV
    p4 = between(
        text,
        "PART IV: STATUTORY GOVERNANCE, DIPLOMATIC COMITY, INTERNATIONAL LAW & RESERVATION OF RIGHTS",
        "PART V:",
    )
    sections = []
    for s in range(1, 7):
        start = p4.index(f"{s}. ")
        end = p4.index(f" {s + 1}. ", start) if s < 6 else len(p4)
        # Section 1 heading ends where clause 1.1 begins.
        chunk = p4[start + len(f"{s}. ") : end]
        heading, clauses_txt = chunk.split(f" {s}.1. ", 1)
        clauses_txt = f"{s}.1. " + clauses_txt
        c = 1
        nums = []
        while f"{s}.{c}. " in clauses_txt:
            nums.append(f"{s}.{c}")
            c += 1
        clauses = []
        for num, body in zip(nums, split_numbered(clauses_txt, nums)):
            nb = name_body(body)
            clauses.append({"n": num, "title": nb["name"], "body": nb["body"]})
        sections.append({"n": str(s), "title": clean(heading), "clauses": clauses})
        p4 = p4[end:] if s < 6 else p4

    # Part V
    p5 = between(text, "PART V: WEBSITE DEPLOYMENT SCHEDULE & PORTAL ARCHITECTURE", None)
    identity = between(p5, "1. Top Website Identity Bar (Reserved Exclusively for GCI)", "2. Briefing")
    gate = between(p5, "2. Briefing Dossier Click-Wrap Gate (Pre-Download Modal) Institutional Access Acknowledgment", "3. Global")
    footer = between(p5, "3. Global Website Footer Notice (Bottom of All Public Pages) Statutory Notice & Institutional Governance", None)

    data = {
        "particulars": particulars,
        "vision": vision,
        "councilsIntro": {
            "title": "The Six Governing Councils & Complete Industrial Divisions",
            "body": clean(intro),
        },
        "councils": councils,
        "stewardship": stewardship,
        "statute": {
            "title": "Statutory Governance, Diplomatic Comity, International Law & Reservation of Rights",
            "sections": sections,
        },
        "portal": {
            "identityBar": identity.split(" | "),
            "gate": {"title": "Institutional Access Acknowledgment", "body": gate},
            "footer": {"title": "Statutory Notice & Institutional Governance", "body": footer},
        },
    }

    header = (
        "/**\n"
        " * GENERATED by content/tools/build_charter.py from the client's charter PDF (GCI.pdf, 14 pp).\n"
        " * Word for word, apart from maths typography (MgB₂, I²R, µm, HfB₂, CO₂, p–¹¹B, 0.1c–0.2c).\n"
        " * Do not edit by hand; edit the PDF text and regenerate.\n"
        " */\n\n"
    )
    body = "".join(
        f"export const {k} = {json.dumps(v, ensure_ascii=False, indent=2)} as const;\n\n"
        for k, v in data.items()
    )
    open(dst, "w", encoding="utf-8", newline="\n").write(header + body.rstrip() + "\n")

    counts = [sum(len(d["initiatives"]) for d in c["divisions"]) for c in councils]
    print("initiatives per council:", counts, "total", sum(counts))
    print("divisions:", [d["code"] for c in councils for d in c["divisions"]])
    print("statute clauses:", [len(s["clauses"]) for s in sections])


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
