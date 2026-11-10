# GCI Institutional Briefing Portal

Single-page, scroll-driven briefing for the Global Confederation of Industries.
First draft. Dark, particle-based 3D, generated entirely in code (no model files).

## Run

```bash
bun install
bun run dev      # http://localhost:3000
bun run build    # production build
```

## Before this is deployed anywhere public

The "Restricted Briefing Clearance" gate is **cinematic only**. It records an
acknowledgement in the browser session and starts the boot sequence. It is not
access control: the full briefing text ships in the page bundle. Real access
control must replace it before any public deployment. The page is marked
`noindex`.

## Where things live

| Path | What |
| --- | --- |
| `content/briefing.ts` | Every word on the page. Edit copy here only. Items marked DRAFT need client approval. |
| `lib/store.ts` | Per-frame scroll state, councils timing constants, UI state. |
| `lib/directive.ts` | Maps scroll position to what the particle lattice does. |
| `lib/quality.ts` | Particle count and resolution per device tier. |
| `components/canvas/` | The lattice: eight generated shapes, shaders, scene. |
| `components/sections/` | Gate, Hero, Thesis, Councils, ESG, Legal. |
| `components/ui/` | Frame and bars, callout labels, index drawer, text effects. |

## Stack

Next.js 16 (App Router), React 19, Tailwind CSS 4, three.js with React Three Fiber,
Motion, Lenis. Package manager: Bun.
