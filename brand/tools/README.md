# Brand tools

Scripts that regenerate the brand assets. Run from the project root.

## `build_logo.py`: logo files

Writes every file in `brand/logo/` (mark in four colourways, horizontal and stacked
lockups for dark and light grounds, favicon). Text is converted to outlines from the
fonts in `brand/fonts/`, so the SVGs need no fonts installed.

Needs Python 3 with `fonttools` and `brotli` (to read WOFF2). Use a throwaway venv:

```bash
python -m venv .venv-brand
```

```bash
.venv-brand/Scripts/python -m pip install fonttools brotli
```

```bash
.venv-brand/Scripts/python brand/tools/build_logo.py brand/logo brand/fonts
```

Then copy the favicon into the app: `cp brand/logo/gci-favicon.svg app/icon.svg`.

Mark geometry lives at the top of the script (`M = dict(...)`) and must stay in sync with
`components/ui/Logo.tsx`, which draws the same mark in React for the site header and gate.

## `export_forms.ts`: particle-form data for the brand kit

Projects the eight particle forms (galaxy plus the six councils plus the closed loop) from
`components/canvas/shapes.ts` into `brand/forms.js`, which `brand/brand-guide.html` plots.

```bash
bun run brand/tools/export_forms.ts brand/forms.js
```

## Rendering the brand kit image

`brand/brand-guide.html` is the source of `brand/gci-brand-kit.png`. Render it with headless
Chrome at 1600 px wide and device scale factor 2. The page sets `data-h` on `<html>` to its full
height once fonts load; use that as the window height. Example (Git Bash):

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files --virtual-time-budget=8000 --force-device-scale-factor=2 --window-size=1600,8319 --screenshot="C:/Projects/Clients/GCI/brand/gci-brand-kit.png" "file:///C:/Projects/Clients/GCI/brand/brand-guide.html"
```

The four images in `brand/imagery/` are screenshots of the live page at 1440 x 900, downscaled to 800 px.
