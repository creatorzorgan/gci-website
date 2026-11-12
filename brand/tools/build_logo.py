"""Builds the GCI logo files: mark, lockups and favicon, with all text converted to outlines."""
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

OUT = sys.argv[1]
FONTS = sys.argv[2]
GOLD, TITANIUM, OBSIDIAN = "#C8A24A", "#C9CED6", "#050507"

# ---- Mark geometry (200 x 200 box) -------------------------------------------------
M = dict(lobe_rx=31, lobe_ry=42, disc_rx=94, disc_ry=14, sw=6.2, core=12.5, tilt=-12)

def mark(uid, lobe=GOLD, disc=TITANIUM, core=GOLD, sw=None, scale_core=1.0, simple=False):
    """The disc-and-lobes mark. Depth comes from masks, so the background stays transparent."""
    m = dict(M)
    if sw:
        m["sw"] = sw
    cx = cy = 100
    lr, ly, dr, dy, w = m["lobe_rx"], m["lobe_ry"], m["disc_rx"], m["disc_ry"], m["sw"]
    cr = m["core"] * scale_core
    gap = w + 6
    lobes = (f'<ellipse cx="{cx}" cy="{cy-ly}" rx="{lr}" ry="{ly}" fill="none" stroke-width="{{w}}" stroke="{{c}}"/>'
             f'<ellipse cx="{cx}" cy="{cy+ly}" rx="{lr}" ry="{ly}" fill="none" stroke-width="{{w}}" stroke="{{c}}"/>')
    front = f'M{cx-dr},{cy} A{dr},{dy} 0 0 0 {cx+dr},{cy}'
    back = f'M{cx-dr},{cy} A{dr},{dy} 0 0 1 {cx+dr},{cy}'
    core_ko = f'<circle cx="{cx}" cy="{cy}" r="{cr+6.5}" fill="black"/>'
    defs = (
        f'<mask id="{uid}-back" maskUnits="userSpaceOnUse" x="-20" y="-20" width="240" height="240">'
        f'<rect x="-20" y="-20" width="240" height="240" fill="white"/>'
        + lobes.replace("{w}", str(gap)).replace("{c}", "black") + core_ko + '</mask>'
        f'<mask id="{uid}-lobes" maskUnits="userSpaceOnUse" x="-20" y="-20" width="240" height="240">'
        f'<rect x="-20" y="-20" width="240" height="240" fill="white"/>'
        f'<path d="{front}" fill="none" stroke="black" stroke-width="{gap}"/>' + core_ko
        # Lobes converge almost tangentially at the core; clear a lens around it so no slivers remain.
        + f'<ellipse cx="{cx}" cy="{cy}" rx="{cr + 15}" ry="{cr + 6.5}" fill="black"/>' + '</mask>'
        f'<mask id="{uid}-front" maskUnits="userSpaceOnUse" x="-20" y="-20" width="240" height="240">'
        f'<rect x="-20" y="-20" width="240" height="240" fill="white"/>' + core_ko + '</mask>'
    )
    body = (
        f'<path d="{back}" fill="none" stroke="{disc}" stroke-width="{w}" mask="url(#{uid}-back)"/>'
        f'<g mask="url(#{uid}-lobes)">' + lobes.replace("{w}", str(w)).replace("{c}", lobe) + '</g>'
        f'<path d="{front}" fill="none" stroke="{disc}" stroke-width="{w}" mask="url(#{uid}-front)"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{cr}" fill="{core}"/>'
    )
    return f'<defs>{defs}</defs><g transform="rotate({m["tilt"]} 100 100)">{body}</g>'

def svg(w, h, inner, bg=None, vb=None):
    vb = vb or f"0 0 {w} {h}"
    bgr = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="{vb}">{bgr}{inner}</svg>\n'

# ---- Text to outlines ---------------------------------------------------------------
def load(path, wght=None):
    f = TTFont(path)
    if wght is not None and "fvar" in f:
        f = instancer.instantiateVariableFont(f, {"wght": wght})
    return f

def text_paths(font, text, size, x, y, tracking_em=0.0, fill="#000"):
    """Returns (svg path markup, advance width) for text set at baseline (x, y)."""
    upm = font["head"].unitsPerEm
    s = size / upm
    cmap = font.getBestCmap()
    gs = font.getGlyphSet()
    hmtx = font["hmtx"]
    out = []
    pen_x = 0.0
    for i, ch in enumerate(text):
        gname = cmap.get(ord(ch))
        if gname is None:
            continue
        if ch != " ":
            sp = SVGPathPen(gs)
            tp = TransformPen(sp, (s, 0, 0, -s, x + pen_x, y))
            gs[gname].draw(tp)
            d = sp.getCommands()
            if d:
                out.append(f'<path d="{d}" fill="{fill}"/>')
        pen_x += hmtx[gname][0] * s
        if i < len(text) - 1:
            pen_x += tracking_em * size
    return "".join(out), pen_x

serif = load(f"{FONTS}/Newsreader-Variable.woff2", 420)
mono = load(f"{FONTS}/GeistMono-Variable.woff2", 400)
cap_h = serif["OS/2"].sCapHeight / serif["head"].unitsPerEm
mono_cap = mono["OS/2"].sCapHeight / mono["head"].unitsPerEm

files = {}

# Mark on its own.
files["gci-mark.svg"] = svg(200, 200, mark("m"))
files["gci-mark-gold.svg"] = svg(200, 200, mark("g", lobe=GOLD, disc=GOLD, core=GOLD))
files["gci-mark-white.svg"] = svg(200, 200, mark("w", lobe=TITANIUM, disc=TITANIUM, core=TITANIUM))
files["gci-mark-black.svg"] = svg(200, 200, mark("b", lobe=OBSIDIAN, disc=OBSIDIAN, core=OBSIDIAN))

def horizontal(uid, word_fill, sub_fill, rule, lobe=GOLD, disc=TITANIUM, core=GOLD, bg=None):
    H = 200  # mark box height
    word_size = 0.40 * H / cap_h
    gx = H + 34
    base = H / 2 + (cap_h * word_size) / 2
    word, ww = text_paths(serif, "GCI", word_size, gx, base, 0.14, word_fill)
    rx = gx + ww + 46
    sub_size = 13.5 / mono_cap * 0.9
    l1, w1 = text_paths(mono, "GLOBAL CONFEDERATION", sub_size, rx + 34, H / 2 - 9, 0.2, sub_fill)
    l2, w2 = text_paths(mono, "OF INDUSTRIES", sub_size, rx + 34, H / 2 + 9 + mono_cap * sub_size, 0.2, sub_fill)
    W = rx + 34 + max(w1, w2) + 6
    inner = (mark(uid, lobe, disc, core) + word
             + f'<rect x="{rx:.1f}" y="{H/2-38}" width="1.4" height="76" fill="{rule}"/>' + l1 + l2)
    return svg(round(W), H, inner, bg)

def stacked(uid, word_fill, sub_fill, lobe=GOLD, disc=TITANIUM, core=GOLD, bg=None):
    W = 560
    word_size = 70 / cap_h
    _, ww = text_paths(serif, "GCI", word_size, 0, 0, 0.14)
    sub_size = 14 / mono_cap
    _, sw_ = text_paths(mono, "GLOBAL CONFEDERATION OF INDUSTRIES", sub_size, 0, 0, 0.2)
    W = max(W, sw_ + 40)
    mx = (W - 220) / 2
    word, _ = text_paths(serif, "GCI", word_size, (W - ww) / 2, 220 + 40 + 70, 0.14, word_fill)
    sub, _ = text_paths(mono, "GLOBAL CONFEDERATION OF INDUSTRIES", sub_size, (W - sw_) / 2, 220 + 40 + 70 + 40 + 14, 0.2, sub_fill)
    inner = f'<g transform="translate({mx} 0) scale(1.1)">{mark(uid, lobe, disc, core)}</g>' + word + sub
    return svg(round(W), 220 + 40 + 70 + 40 + 14 + 8, inner, bg)

files["gci-logo-horizontal.svg"] = horizontal("h", TITANIUM, "#8A919C", "rgba(255,255,255,0.18)")
files["gci-logo-horizontal-light.svg"] = horizontal("hl", OBSIDIAN, "#4A4F58", "rgba(5,5,7,0.25)", lobe=OBSIDIAN, disc=OBSIDIAN, core=GOLD)
files["gci-logo-stacked.svg"] = stacked("s", TITANIUM, "#8A919C")
files["gci-logo-stacked-light.svg"] = stacked("sl", OBSIDIAN, "#4A4F58", lobe=OBSIDIAN, disc=OBSIDIAN, core=GOLD)

# Favicon: heavier strokes and a dark tile so it reads at 16 px on any tab colour.
fav = (f'<rect width="200" height="200" rx="36" fill="{OBSIDIAN}"/>'
       f'<g transform="translate(100 100) scale(0.86) translate(-100 -100)">{mark("f", sw=13, scale_core=1.35)}</g>')
files["gci-favicon.svg"] = svg(200, 200, fav)

for name, data in files.items():
    open(f"{OUT}/{name}", "w", encoding="utf-8").write(data)
print("\n".join(sorted(files)))
