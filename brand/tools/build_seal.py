"""
Builds the GCI institutional seal and the seal lockups, with all text as outlines.

Drawn from the client's references (round seal with laurel and shield, heraldic crest,
"GCI | GLOBAL CONFEDERATION OF INDUSTRIES — INDIA" wordmark), without the elements a
private body may not use: no State Emblem of India or "Satyameva Jayate" (State Emblem
of India (Prohibition of Improper Use) Act, 2005), no Ashoka Chakra, no map of India,
no foreign royal arms, and no ® (the mark is not registered).

Symbolism:
- laurel wreath: standing and recognition;
- six stars: the six governing councils;
- shield: the Central Secretariat, holding the apex mark (disc = the economy,
  lobes = public counterparts and institutional capital, gold core = apex node).

    python brand/tools/build_seal.py brand/logo brand/fonts
"""

import math
import sys

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

OUT, FONTS = sys.argv[1], sys.argv[2]

# Kiran's palette.
NAVY = "#070B14"
MIDNIGHT = "#0F172A"
GOLD = "#D4AF37"
GOLD_LIGHT = "#E6C55C"
PLATINUM = "#E2E8F0"
SLATE = "#94A3B8"
IVORY = "#F7F3EA"


def load(path, wght=None):
    f = TTFont(path)
    if wght is not None and "fvar" in f:
        f = instancer.instantiateVariableFont(f, {"wght": wght})
    return f


def glyphs(font, text, size, tracking_em=0.0):
    """Yields (path d at origin baseline, advance) per character."""
    upm = font["head"].unitsPerEm
    s = size / upm
    cmap = font.getBestCmap()
    gs = font.getGlyphSet()
    hmtx = font["hmtx"]
    out = []
    for i, ch in enumerate(text):
        g = cmap.get(ord(ch))
        if g is None:
            raise SystemExit(f"glyph missing for {ch!r}")
        d = ""
        if ch != " ":
            sp = SVGPathPen(gs)
            gs[g].draw(TransformPen(sp, (s, 0, 0, -s, 0, 0)))
            d = sp.getCommands()
        adv = hmtx[g][0] * s + (tracking_em * size if i < len(text) - 1 else 0)
        out.append((d, hmtx[g][0] * s, adv))
    return out


def text_line(font, text, size, x, y, tracking_em=0.0, fill=GOLD, anchor="start"):
    gl = glyphs(font, text, size, tracking_em)
    width = sum(a for _, _, a in gl)
    if anchor == "middle":
        x -= width / 2
    parts, pen = [], 0.0
    for d, _, adv in gl:
        if d:
            parts.append(f'<path transform="translate({x + pen:.2f} {y:.2f})" d="{d}" fill="{fill}"/>')
        pen += adv
    return "".join(parts), width


def text_arc(font, text, size, cx, cy, r, tracking_em, fill, where="top"):
    """Text on a circle. Top: reads clockwise, tops outward. Bottom: reads left to right, tops inward."""
    gl = glyphs(font, text, size, tracking_em)
    total = sum(a for _, _, a in gl)
    cap = font["OS/2"].sCapHeight / font["head"].unitsPerEm * size
    parts, pen = [], 0.0
    for d, w, adv in gl:
        mid = pen + w / 2
        if d:
            if where == "top":
                a = math.degrees((mid - total / 2) / r)
                t = f"rotate({a:.3f} {cx} {cy}) translate({cx - w / 2:.2f} {cy - r:.2f})"
            else:
                a = math.degrees((total / 2 - mid) / r)
                t = f"rotate({a:.3f} {cx} {cy}) translate({cx - w / 2:.2f} {cy + r + cap:.2f})"
            parts.append(f'<path transform="{t}" d="{d}" fill="{fill}"/>')
        pen += adv
    return "".join(parts), math.degrees(total / r)


def star(cx, cy, r, fill, rot=0.0):
    pts = []
    for i in range(10):
        rr = r if i % 2 == 0 else r * 0.42
        a = math.radians(rot - 90 + i * 36)
        pts.append(f"{cx + rr * math.cos(a):.2f},{cy + rr * math.sin(a):.2f}")
    return f'<polygon points="{" ".join(pts)}" fill="{fill}"/>'


def leaf(x, y, length, width, angle, fill):
    """Pointed leaf (vesica) with its base at (x, y), pointing along `angle` (degrees)."""
    L, W = length, width
    d = f"M0,0 C{L * 0.3:.2f},{-W:.2f} {L * 0.75:.2f},{-W * 0.8:.2f} {L:.2f},0 C{L * 0.75:.2f},{W * 0.8:.2f} {L * 0.3:.2f},{W:.2f} 0,0Z"
    return f'<path transform="translate({x:.2f} {y:.2f}) rotate({angle:.2f})" d="{d}" fill="{fill}"/>'


def laurel(cx, cy, r, side, fill, start=104.0, end=212.0, n=11):
    """One laurel branch along a circle. side=-1 left, +1 right. Angles are screen degrees (0 = +x, 90 = down)."""
    out = []
    def pt(deg, rr=r):
        a = math.radians(deg)
        return cx + rr * math.cos(a), cy + rr * math.sin(a)
    # Mirror for the right side.
    angles = [start + (end - start) * i / (n - 1) for i in range(n)]
    if side > 0:
        angles = [180 - a for a in angles]
    # Stem.
    pts = [pt(a) for a in angles]
    d = "M" + " L".join(f"{x:.2f},{y:.2f}" for x, y in pts)
    out.append(f'<path d="{d}" fill="none" stroke="{fill}" stroke-width="3.2" stroke-linecap="round"/>')
    for i, a in enumerate(angles):
        x, y = pt(a)
        # Direction of travel along the stem (towards the tip).
        tangent = a + (90 if side < 0 else -90)
        size = 1.0 - 0.45 * (i / (n - 1))
        L, W = 34 * size, 9.5 * size
        out.append(leaf(x, y, L, W, tangent - 38 * (-side), fill))  # outer leaf
        out.append(leaf(x, y, L * 0.92, W * 0.92, tangent + 34 * (-side), fill))  # inner leaf
    # Berry-like tip.
    tx, ty = pt(angles[-1] + (6 if side < 0 else -6))
    out.append(leaf(*pt(angles[-1]), 26 * 0.55, 8 * 0.55, (angles[-1] + (90 if side < 0 else -90)), fill))
    return "".join(out)


def shield_path(cx, top, w, h):
    """Heraldic shield: flat top with notched shoulders, curved sides to a point."""
    l, r = cx - w / 2, cx + w / 2
    b = top + h
    return (
        f"M{l:.2f},{top:.2f} L{cx - w * 0.16:.2f},{top:.2f} Q{cx:.2f},{top - h * 0.06:.2f} {cx + w * 0.16:.2f},{top:.2f} "
        f"L{r:.2f},{top:.2f} L{r:.2f},{top + h * 0.45:.2f} "
        f"C{r:.2f},{top + h * 0.78:.2f} {cx + w * 0.22:.2f},{b - h * 0.08:.2f} {cx:.2f},{b:.2f} "
        f"C{cx - w * 0.22:.2f},{b - h * 0.08:.2f} {l:.2f},{top + h * 0.78:.2f} {l:.2f},{top + h * 0.45:.2f} Z"
    )


# ---- The apex mark (same geometry as build_logo.py and components/ui/Logo.tsx) ---------
M = dict(lobe_rx=31, lobe_ry=42, disc_rx=94, disc_ry=14, sw=6.2, core=12.5, tilt=-12)


def apex(uid, lobe=GOLD, disc=PLATINUM, core=GOLD, sw=None):
    m = dict(M)
    if sw:
        m["sw"] = sw
    cx = cy = 100
    lr, ly, dr, dy, w = m["lobe_rx"], m["lobe_ry"], m["disc_rx"], m["disc_ry"], m["sw"]
    cr = m["core"]
    gap = w + 6
    lobes = (
        f'<ellipse cx="{cx}" cy="{cy - ly}" rx="{lr}" ry="{ly}" fill="none" stroke-width="{{w}}" stroke="{{c}}"/>'
        f'<ellipse cx="{cx}" cy="{cy + ly}" rx="{lr}" ry="{ly}" fill="none" stroke-width="{{w}}" stroke="{{c}}"/>'
    )
    front = f"M{cx - dr},{cy} A{dr},{dy} 0 0 0 {cx + dr},{cy}"
    back = f"M{cx - dr},{cy} A{dr},{dy} 0 0 1 {cx + dr},{cy}"
    ko = f'<circle cx="{cx}" cy="{cy}" r="{cr + 6.5}" fill="black"/>'
    box = 'maskUnits="userSpaceOnUse" x="-20" y="-20" width="240" height="240"'
    white = '<rect x="-20" y="-20" width="240" height="240" fill="white"/>'
    defs = (
        f'<mask id="{uid}-back" {box}>{white}' + lobes.replace("{w}", str(gap)).replace("{c}", "black") + ko + "</mask>"
        f'<mask id="{uid}-lobes" {box}>{white}<path d="{front}" fill="none" stroke="black" stroke-width="{gap}"/>{ko}'
        f'<ellipse cx="{cx}" cy="{cy}" rx="{cr + 15}" ry="{cr + 6.5}" fill="black"/></mask>'
        f'<mask id="{uid}-front" {box}>{white}{ko}</mask>'
    )
    body = (
        f'<path d="{back}" fill="none" stroke="{disc}" stroke-width="{w}" mask="url(#{uid}-back)"/>'
        f'<g mask="url(#{uid}-lobes)">' + lobes.replace("{w}", str(w)).replace("{c}", lobe) + "</g>"
        f'<path d="{front}" fill="none" stroke="{disc}" stroke-width="{w}" mask="url(#{uid}-front)"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{cr}" fill="{core}"/>'
    )
    return f'<defs>{defs}</defs><g transform="rotate({m["tilt"]} 100 100)">{body}</g>'


cinzel = load(f"{FONTS}/Cinzel-Variable.ttf", 600)
cinzel_bold = load(f"{FONTS}/Cinzel-Variable.ttf", 800)
geist = load(f"{FONTS}/Geist-Variable.woff2", 500)


def seal(uid, field=MIDNIGHT, band=NAVY, gold=GOLD, apex_disc=PLATINUM, text=True):
    """600 x 600 seal centred at (300, 300)."""
    C = 300
    p = []
    # Rings.
    p.append(f'<circle cx="{C}" cy="{C}" r="292" fill="{band}"/>')
    p.append(f'<circle cx="{C}" cy="{C}" r="288" fill="none" stroke="{gold}" stroke-width="7"/>')
    p.append(f'<circle cx="{C}" cy="{C}" r="276" fill="none" stroke="{gold}" stroke-width="1.6"/>')
    p.append(f'<circle cx="{C}" cy="{C}" r="212" fill="{field}" stroke="{gold}" stroke-width="3.2"/>')
    # Beaded ring.
    for i in range(96):
        a = math.radians(i * 3.75)
        p.append(f'<circle cx="{C + 201 * math.cos(a):.2f}" cy="{C + 201 * math.sin(a):.2f}" r="2.3" fill="{gold}"/>')
    if text:
        top, span = text_arc(cinzel, "GLOBAL CONFEDERATION OF INDUSTRIES", 29.5, C, C, 236, 0.06, gold, "top")
        bottom, bspan = text_arc(cinzel, "REPUBLIC OF INDIA", 28, C, C, 233, 0.3, gold, "bottom")
        p.append(top + bottom)
        # Stars where the two inscriptions meet.
        mid_r = 244
        # Halfway through each gap between the top and bottom inscriptions.
        gap_mid = (span / 2 + (360 - span - bspan) / 4)
        for side in (-1, 1):
            ang = math.radians(-90 + side * gap_mid)
            p.append(star(C + mid_r * math.cos(ang), C + mid_r * math.sin(ang), 11, gold))
    # Laurel.
    p.append(laurel(C, C, 168, -1, gold))
    p.append(laurel(C, C, 168, 1, gold))
    # Knot where the branches meet.
    p.append(star(C, C + 170, 10, gold))
    # Six stars: the six councils.
    for i in range(6):
        deg = -90 + (i - 2.5) * 14
        a = math.radians(deg)
        p.append(star(C + 142 * math.cos(a), C + 142 * math.sin(a), 9.5, gold))
    # Shield with the apex mark.
    sp = shield_path(C, 196, 156, 182)
    p.append(f'<path d="{sp}" fill="{band}" stroke="{gold}" stroke-width="5" stroke-linejoin="round"/>')
    inner = shield_path(C, 206, 132, 160)
    p.append(f'<path d="{inner}" fill="none" stroke="{gold}" stroke-width="1.4" stroke-linejoin="round" opacity="0.7"/>')
    p.append(f'<g transform="translate({C} 276) scale(0.6) translate(-100 -100)">{apex(uid, lobe=gold, disc=apex_disc, core=gold, sw=7.5)}</g>')
    return "".join(p)


def shield_icon(uid, band=NAVY, gold=GOLD, apex_disc=PLATINUM, stars=True):
    """Compact mark for small sizes (header, favicon): the seal's shield, apex mark and council stars."""
    C = 100
    p = []
    if stars:
        for i in range(6):
            p.append(star(C + (i - 2.5) * 27, 18, 7.5, gold))
    sp = shield_path(C, 38, 156, 182)
    p.append(f'<path d="{sp}" fill="{band}" stroke="{gold}" stroke-width="7" stroke-linejoin="round"/>')
    p.append(f'<g transform="translate({C} 118) scale(0.66) translate(-100 -100)">{apex(uid, lobe=gold, disc=apex_disc, core=gold, sw=9)}</g>')
    return "".join(p)


def svg(w, h, inner, bg=None):
    bgr = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{bgr}{inner}</svg>\n'


def lockup(uid, ink=PLATINUM, sub=SLATE, gold=GOLD, bg=None, field=MIDNIGHT, band=NAVY):
    """Seal + GCI | GLOBAL CONFEDERATION OF INDUSTRIES, with the gold INDIA rule below."""
    H = 300
    out = [f'<g transform="scale(0.5)">{seal(uid, field=field, band=band, gold=gold, apex_disc=ink)}</g>']
    cap = cinzel_bold["OS/2"].sCapHeight / cinzel_bold["head"].unitsPerEm
    word_size = 118 / cap
    word, ww = text_line(cinzel_bold, "GCI", word_size, 340, 150 + 59 - 22, 0.04, ink)
    out.append(word)
    rx = 340 + ww + 34
    out.append(f'<rect x="{rx:.1f}" y="{150 - 64 - 22}" width="2" height="128" fill="{gold}"/>')
    gcap = geist["OS/2"].sCapHeight / geist["head"].unitsPerEm
    s = 27 / gcap
    lines = ["GLOBAL", "CONFEDERATION", "OF INDUSTRIES"]
    widths = []
    for i, line in enumerate(lines):
        t, w = text_line(geist, line, s, rx + 30, 150 - 64 - 22 + 27 + i * 50.5, 0.12, ink)
        out.append(t)
        widths.append(w)
    W = rx + 30 + max(widths) + 10
    # INDIA rule.
    ry = 258
    india, iw = text_line(cinzel, "INDIA", 30, W / 2 + 150, ry + 11, 0.5, gold, anchor="middle")
    left0, left1 = 340, W / 2 + 150 - iw / 2 - 22
    right0, right1 = W / 2 + 150 + iw / 2 + 22, W - 4
    out.append(
        f'<defs><linearGradient id="{uid}-fl" x1="0" x2="1"><stop offset="0" stop-color="{gold}" stop-opacity="0"/>'
        f'<stop offset="1" stop-color="{gold}"/></linearGradient>'
        f'<linearGradient id="{uid}-fr" x1="0" x2="1"><stop offset="0" stop-color="{gold}"/>'
        f'<stop offset="1" stop-color="{gold}" stop-opacity="0"/></linearGradient></defs>'
        f'<rect x="{left0}" y="{ry}" width="{left1 - left0:.1f}" height="2" fill="url(#{uid}-fl)"/>'
        f'<rect x="{right0:.1f}" y="{ry}" width="{right1 - right0:.1f}" height="2" fill="url(#{uid}-fr)"/>'
    )
    out.append(india)
    return svg(round(W), H, "".join(out), bg)


files = {
    "gci-seal.svg": svg(600, 600, seal("s")),
    "gci-seal-light.svg": svg(600, 600, seal("sl", field=IVORY, band="#FFFFFF", gold="#B08A1E", apex_disc=NAVY)),
    "gci-shield.svg": svg(200, 226, shield_icon("sh")),
    "gci-shield-light.svg": svg(200, 226, shield_icon("shl", band="#FFFFFF", gold="#B08A1E", apex_disc=NAVY)),
    "gci-favicon-seal.svg": svg(200, 200, f'<rect width="200" height="200" rx="36" fill="{NAVY}"/>'
                                 f'<g transform="translate(100 104) scale(0.8) translate(-100 -118)">{shield_icon("fv", stars=False)}</g>'),
    "gci-lockup.svg": lockup("l", bg=None),
    "gci-lockup-light.svg": lockup("ll", ink=NAVY, sub="#334155", gold="#B08A1E", field=IVORY, band="#FFFFFF"),
}
for name, data in files.items():
    open(f"{OUT}/{name}", "w", encoding="utf-8").write(data)
print("\n".join(files))
