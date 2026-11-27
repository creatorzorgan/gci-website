"""
Build content/charter.ts from the client's charter PDF, word for word.

    pdftotext -enc UTF-8 "GCI Final Master.pdf" gci.txt
    python content/tools/build_charter.py gci.txt content/charter.ts

Source: "GCI Final Master.pdf", Master Institutional Charter (100-Initiative Edition), 22 pp,
confirmed final by the client on 27 November 2026.

The only edits made to the PDF wording are listed in FIXES:
- hyphens that pdftotext drops at line ends ("zeroresistance" -> "zero-resistance"),
  checked against `pdftotext -layout`, which keeps them;
- chemical and maths typography (CO₂, MgB₂, I²R, CH₄, p–¹¹B);
- initiative 100, which the PDF prints as "00." (confirmed with the client);
- stray spaces after dashes, and straight quotes made curly.
Division titles are set in capitals in the PDF; they are stored in title case (TITLE_CASE).
The script fails if a fix no longer applies or an expected item is missing.
"""

import json
import re
import sys

# Line-end hyphens that pdftotext drops.
HYPHENS = [
    "zero-resistance", "non-destructive", "zero-electricity", "Industrial-byproduct",
    "concentrated-solar", "acid-etching", "ion-exchange", "Low-energy", "nano-flocculants",
    "micro-electrode", "non-hallucinating", "non-invasively", "Insect-scale", "fiber-optic",
    "phase-change", "Desk-sized", "High-frequency", "green-ammonia", "heavy-equipment",
    "satellite-verified", "Japan-grade", "thermal-discharge", "ocean-acidification",
    "aquifer-recharge", "end-of-life", "pre-existing", "ground-breaking", "deep-ocean",
    "non-governmental", "policy-advisory", "Red-Line",
]

FIXES = [(h.replace("-", "", 1), h) for h in HYPHENS] + [
    ("MgB2", "MgB₂"),
    ("I2R", "I²R"),
    ("CH4,", "CH₄,"),
    ("(p-11B)", "(p–¹¹B)"),
    ("\n00. Sovereign Environmental", "\n100. Sovereign Environmental"),
    ("hardware— turning", "hardware—turning"),
    ('"midnight dumping"', "“midnight dumping”"),
]

# Em dashes in the charter text, replaced after cleaning (client request, 27 Nov 2026).
EM_DASHES = [
    ("sewage networks—modeled on Japanese urban hydrological standards—combining",
     "sewage networks, modeled on Japanese urban hydrological standards, combining"),
    ("seawater minerals—protecting", "seawater minerals, protecting"),
    ("freeze-plugs—physically incapable of core meltdown—deployed",
     "freeze-plugs (physically incapable of core meltdown), deployed"),
    ("without refueling—immediately", "without refueling, immediately"),
    ("passenger vehicles—eliminating", "passenger vehicles, eliminating"),
    ("development began—audited", "development began, audited"),
    ("recharge wells—operating", "recharge wells, operating"),
    ("bunker fuel—while", "bunker fuel, while"),
    ("ZLD hardware—turning", "ZLD hardware, turning"),
    ("must elevate—not discard—the workforce", "must elevate, not discard, the workforce"),
    ("audit logs—physically", "audit logs, physically"),
    ("turbidity sensors—triggering", "turbidity sensors, triggering"),
    ("Seedling Initiative—training", "Seedling Initiative, training"),
    ("structural frameworks—whether", "structural frameworks, whether"),
    ("derivative form—constitutes", "derivative form, constitutes"),
]

# CO2 is everywhere (CO2, sCO2, methane/CO2/NOx); subscript every occurrence.
CO2 = (r"CO2\b", "CO₂")

RUNNING_FOOTER = re.compile(
    r"Global Confederation of Industries \(GCI\) — Master Institutional Charter "
    r"\(100-Initiative Edition\)\s*Page \d+ of 22"
)

NUMERALS = ["I", "II", "III", "IV", "V", "VI"]

SMALL = {"of", "and", "&"}
ACRONYMS = {"AI": "AI", "IOT": "IoT", "6G": "6G", "ISAC": "ISAC", "GPS": "GPS"}


def title_case(s: str) -> str:
    def word(w: str, first: bool) -> str:
        if w in ACRONYMS:
            return ACRONYMS[w]
        parts = w.split("-")
        out = []
        for i, p in enumerate(parts):
            lower = p.lower()
            if lower in SMALL and not (first and i == 0):
                out.append(lower)
            else:
                out.append(ACRONYMS.get(p, p[:1].upper() + p[1:].lower()))
        return "-".join(out)

    tokens = s.split(" ")
    return " ".join(word(t.rstrip(","), i == 0) + ("," if t.endswith(",") else "") for i, t in enumerate(tokens))


def clean(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def between(text: str, start: str, end: str | None) -> str:
    i = text.index(start) + len(start)
    j = text.index(end, i) if end else len(text)
    return clean(text[i:j])


def split_numbered(body: str, numbers: list[str]) -> list[str]:
    """Split `body` at "<n>. " markers, in order. Returns the text after each marker."""
    starts = []
    pos = 0
    for n in numbers:
        marker = f"{n}. "
        k = body.index(marker, pos)
        starts.append((k, k + len(marker)))
        pos = k + len(marker)
    out = []
    for idx, (_, s) in enumerate(starts):
        e = starts[idx + 1][0] if idx + 1 < len(starts) else len(body)
        out.append(clean(body[s:e]))
    return out


def split_named(body: str, names: list[str]) -> list[dict]:
    """Split `body` at known "<Name>: " headings, in order."""
    out = []
    for i, name in enumerate(names):
        marker = f"{name}: "
        start = body.index(marker) + len(marker)
        end = body.index(f"{names[i + 1]}: ", start) if i + 1 < len(names) else len(body)
        out.append({"name": name, "body": clean(body[start:end])})
    return out


def name_body(s: str) -> dict:
    name, body = s.split(": ", 1)
    return {"name": clean(name), "body": clean(body)}


def sentences(s: str) -> list[str]:
    return [clean(x) for x in re.split(r"(?<=[.)]) (?=[A-Z])", s) if x.strip()]


def main(src: str, dst: str) -> None:
    raw = open(src, encoding="utf-8").read()
    for a, b in FIXES:
        if a not in raw:
            raise SystemExit(f"Fix no longer applies: {a!r}")
        raw = raw.replace(a, b)
    raw = re.sub(*CO2, raw)
    raw = RUNNING_FOOTER.sub(" ", raw)
    if re.search(r"Page \d+ of 22", raw):
        raise SystemExit("Running footer left in text")
    text = clean(raw)

    # Front matter
    meta = {
        "title": "Master Institutional Charter",
        "edition": "100-Initiative Edition",
        "tagline": between(text, "Master Institutional Charter", "Corporate & Institutional Particulars").split(" • "),
    }
    assert len(meta["tagline"]) == 4, meta["tagline"]

    # Corporate & Institutional Particulars
    part = between(text, "Corporate & Institutional Particulars", "PART I:")
    names = ["Entity Name", "Institutional Structure", "Domicile", "NIC-2008 Indexing", "Institutional Counterparts"]
    particulars = []
    for i, name in enumerate(names):
        start = part.index(name + " ") + len(name) + 1
        end = part.index(names[i + 1] + " ", start) if i + 1 < len(names) else len(part)
        particulars.append({"name": name, "body": clean(part[start:end])})

    # Part I
    p1 = between(text, "PART I: FOUNDING VISION & INSTITUTIONAL PURPOSE", "PART II:")
    intro_phrase = "GCI executes a three-part operational mandate:"
    lead, rest = p1.split(" " + intro_phrase, 1)
    purposes_txt, closing = rest.split(" All intellectual property", 1)
    vision = {
        "title": "Founding Vision & Institutional Purpose",
        "body": clean(lead),
        "purposeIntro": intro_phrase,
        "purposes": [name_body(p) for p in split_numbered(purposes_txt, ["1", "2", "3"])],
        "closing": "All intellectual property" + closing,
    }

    # Part II
    p2 = between(text, "PART II: THE SIX GOVERNING COUNCILS & 100-INITIATIVE ARCHITECTURE", "PART III:")
    intro, rest = p2.split(" Living Mandate & Dynamic Council Expansion: ", 1)
    mandate_body, rest = rest.split(" Governing Council Council I", 1)
    # Summary table: ranges and counts per council, checked against the parsed councils below.
    table = re.findall(r"#(\d+) – #(\d+) \((\d+)\)", rest)
    assert len(table) == 6, table
    body = rest[rest.index("Council I: ") :]

    council_chunks = [c for c in re.split(r"\s?Council (?=(?:I|II|III|IV|V|VI): )", body) if c.strip()]
    assert len(council_chunks) == 6, len(council_chunks)
    councils = []
    n = 1
    for numeral, chunk in zip(NUMERALS, council_chunks):
        assert chunk.startswith(numeral + ": "), chunk[:20]
        chunk = chunk[len(numeral) + 2 :]
        title, chunk = chunk.split(" Institutional Directorate of ", 1)
        directorate, chunk = chunk.split(" DIVISION ", 1)
        divisions = []
        for d in re.split(r" DIVISION (?=[IV]+-[A-D]: )", "DIVISION " + chunk):
            d = d.removeprefix("DIVISION ")
            code, d = d.split(": ", 1)
            m = re.match(r"(.*?) \(#(\d+)–\s?#(\d+)\) (.*)", d)
            assert m, d[:120]
            dtitle, lo, hi, items_txt = m.group(1), int(m.group(2)), int(m.group(3)), m.group(4)
            assert lo == n, (code, lo, n)
            numbers = [str(i) for i in range(lo, hi + 1)]
            items = [name_body(s) for s in split_numbered(items_txt, numbers)]
            for i, it in enumerate(items):
                it["n"] = lo + i
            n = hi + 1
            divisions.append({"code": code, "title": title_case(dtitle), "initiatives": items})
        councils.append(
            {
                "numeral": numeral,
                "title": clean(title),
                "directorate": "Institutional Directorate of " + clean(directorate),
                "divisions": divisions,
            }
        )
    assert n == 101, f"parsed {n - 1} initiatives"
    for c, (lo, hi, count) in zip(councils, table):
        ns = [i["n"] for d in c["divisions"] for i in d["initiatives"]]
        assert (ns[0], ns[-1], len(ns)) == (int(lo), int(hi), int(count)), (c["numeral"], ns[0], ns[-1])

    councils_intro = {
        "title": "The Six Governing Councils & 100-Initiative Architecture",
        "body": clean(intro),
        "livingMandate": {"name": "Living Mandate & Dynamic Council Expansion", "body": clean(mandate_body)},
    }

    # Part III
    p3_head = (
        "PART III: REGENERATIVE PLANETARY RESTORATION, ENVIRONMENTAL ANALYZER ARCHITECTURE & "
        "CHECK-AND-CHOKE POINTS Hard Engineering Law for Reversing Ecological Aging Through Industrial Development"
    )
    p3 = between(text, p3_head, "PART IV:")
    h1 = "1. Mandatory Physical Environmental Analyzer Stack (Zero Self-Reporting)"
    h2 = "2. Innovatory Green Remediation Chemistry Incubator (Initiative #23)"
    h3 = "3. Core Ecological Engineering Mandates"
    h4 = "4. Six-Point Hard Environmental Check-and-Choke Points Matrix"
    preface = between(p3, "", h1)
    s1 = between(p3, h1, h2)
    s2 = between(p3, h2, h3)
    s3 = between(p3, h3, h4)
    s4 = between(p3, h4, None)

    a_intro, a_rest = s1.split(" Water, River & Sewage Analyzers: ", 1)
    analyzers = split_named(
        "Water, River & Sewage Analyzers: " + a_rest,
        ["Water, River & Sewage Analyzers", "Air, Flue & Emissions Analyzers", "Soil, Aquifer, Acoustic & Marine Analyzers"],
    )
    c_intro, c_rest = s2.split(" Zero-Residue Biodegradable", 1)
    chemistry = split_named(
        "Zero-Residue Biodegradable" + c_rest,
        [
            "Zero-Residue Biodegradable Nano-Flocculants & Biopolymer Coagulants",
            "Catalytic Advanced-Oxidation & Nanobubble-Oxygenation Complexes",
            "Selective Heavy-Metal Chelating Polymers",
            "Contained Enzymatic & Bio-Surfactant Consortia",
        ],
    )
    mandate_titles = [
        "A. Japan-Grade Urban Hydrology & Water-Positive Mandate",
        "B. Two-Horizon Clean-Energy Exit (Replace Coal Now, Pivot Next)",
        "C. True-Cost Pricing, Net-Negative Construction & Legacy MSME Transition",
    ]
    mandates = []
    for i, t in enumerate(mandate_titles):
        mandates.append(
            {
                "code": t[0],
                "title": t[3:],
                "body": between(s3, t, mandate_titles[i + 1] if i + 1 < len(mandate_titles) else None),
            }
        )

    # The matrix comes out column by column: six points, six mechanisms, six loopholes.
    m_intro, m_rest = s4.split(" Check / Choke Point ", 1)
    points_txt, m_rest = m_rest.split(" Physical & Financial Enforcement Mechanism ", 1)
    mech_txt, loop_txt = m_rest.split(" Industrial Loophole Closed ", 1)
    points = split_numbered(points_txt, [str(i) for i in range(1, 7)])
    mechanisms = sentences(mech_txt)
    loopholes = sentences(loop_txt)
    assert len(points) == len(mechanisms) == len(loopholes) == 6, (len(points), len(mechanisms), len(loopholes))

    restoration = {
        "title": "Regenerative Planetary Restoration, Environmental Analyzer Architecture & Check-and-Choke Points",
        "subtitle": "Hard Engineering Law for Reversing Ecological Aging Through Industrial Development",
        "preface": preface,
        "analyzers": {
            "n": "1",
            "title": h1[3:],
            "intro": clean(a_intro),
            "groups": analyzers,
        },
        "chemistry": {"n": "2", "title": h2[3:], "intro": clean(c_intro), "items": chemistry},
        "mandates": {"n": "3", "title": h3[3:], "items": mandates},
        "matrix": {
            "n": "4",
            "title": h4[3:],
            "intro": clean(m_intro),
            "columns": ["Check / Choke Point", "Physical & Financial Enforcement Mechanism", "Industrial Loophole Closed"],
            "rows": [
                {"n": i + 1, "point": p, "mechanism": m, "loophole": l}
                for i, (p, m, l) in enumerate(zip(points, mechanisms, loopholes))
            ],
        },
    }

    # Part IV
    p4_head = (
        "PART IV: INSTITUTIONAL, HUMAN & ETHICAL STEWARDSHIPS Binding Covenants Governing Workforce "
        "Transition, Bio-Ethics, Privacy, Global Commons & Governance Integrity"
    )
    p4 = between(text, p4_head, "PART V:")
    st_titles = [
        "Human Capital, Automation-Transition & MSME Payment Stewardship",
        "Bio-Ethical, Genetic & Cognitive Sovereignty Stewardship",
        "Algorithmic, Surveillance & Constitutional Privacy Stewardship",
        "Orbital & Deep-Ocean Commons Stewardship",
        "Fiduciary, Anti-Capture & Sovereign IP Stewardship",
        "Ethical Supply-Chain & Mineral Provenance Stewardship",
        "Biodiversity, Sensory-Pollution & Intergenerational Custodianship (Silicon Seedling Initiative)",
    ]
    markers = [f"{i + 1}. {t}" for i, t in enumerate(st_titles)]
    stewardships = {
        "title": "Institutional, Human & Ethical Stewardships",
        "subtitle": "Binding Covenants Governing Workforce Transition, Bio-Ethics, Privacy, Global Commons & Governance Integrity",
        "preface": between(p4, "", markers[0]),
        "items": [
            {
                "n": str(i + 1),
                "title": t,
                "body": between(p4, markers[i], markers[i + 1] if i + 1 < len(markers) else None),
            }
            for i, t in enumerate(st_titles)
        ],
    }

    # Part V
    p5 = between(
        text,
        "PART V: STATUTORY GOVERNANCE, DIPLOMATIC COMITY, INTERNATIONAL LAW & RESERVATION OF RIGHTS",
        "PART VI:",
    )
    sections = []
    for s in range(1, 7):
        start = p5.index(f"{s}. ")
        end = p5.index(f" {s + 1}. ", start) if s < 6 else len(p5)
        chunk = p5[start + len(f"{s}. ") : end]
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
        p5 = p5[end:] if s < 6 else p5

    # Part VI
    p6 = between(text, "PART VI: WEBSITE DEPLOYMENT SCHEDULE & PORTAL ARCHITECTURE", None)
    identity = between(p6, "1. TOP WEBSITE IDENTITY BAR (RESERVED EXCLUSIVELY FOR GCI)", "2. BRIEFING")
    gate = between(p6, "2. BRIEFING DOSSIER CLICK-WRAP GATE (PRE-DOWNLOAD MODAL) Institutional Access Acknowledgment:", "3. GLOBAL")
    footer = between(p6, "3. GLOBAL WEBSITE FOOTER NOTICE (BOTTOM OF ALL PUBLIC PAGES) Statutory Notice & Institutional Governance:", None)

    data = {
        "meta": meta,
        "particulars": particulars,
        "vision": vision,
        "councilsIntro": councils_intro,
        "councils": councils,
        "restoration": restoration,
        "stewardships": stewardships,
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
        " * GENERATED by content/tools/build_charter.py from the client's charter PDF\n"
        " * (\"GCI Final Master.pdf\", Master Institutional Charter, 100-Initiative Edition, 22 pp).\n"
        " * Word for word, apart from the fixes listed in the script (line-end hyphens, CO₂ / MgB₂ /\n"
        " * I²R / CH₄ / p–¹¹B, initiative 100 printed as \"00.\") and division titles in title case.\n"
        " * Do not edit by hand; edit the PDF text and regenerate.\n"
        " */\n\n"
    )
    body = "".join(
        f"export const {k} = {json.dumps(v, ensure_ascii=False, indent=2)} as const;\n\n"
        for k, v in data.items()
    )
    # Client request (27 Nov 2026): no em dashes anywhere on the site. Each one is replaced
    # with the punctuation its sentence needs; the build fails if any is left.
    for a, b in EM_DASHES:
        if a not in body:
            raise SystemExit(f"Em-dash fix no longer applies: {a!r}")
        body = body.replace(a, b)
    if "—" in body:
        i = body.index("—"); raise SystemExit(f"Unhandled em dash: {body[i-60:i+40]!r}")
    open(dst, "w", encoding="utf-8", newline="\n").write(header + body.rstrip() + "\n")

    sys.stdout.reconfigure(encoding="utf-8")
    counts = [sum(len(d["initiatives"]) for d in c["divisions"]) for c in councils]
    print("initiatives per council:", counts, "total", sum(counts))
    print("divisions:", [(d["code"], len(d["initiatives"])) for c in councils for d in c["divisions"]])
    print("matrix rows:", len(restoration["matrix"]["rows"]), "stewardships:", len(stewardships["items"]))
    print("statute clauses:", [len(s["clauses"]) for s in sections])


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
