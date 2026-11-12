# GCI Institutional Briefing Portal — Master Execution Plan

> **STATUS: ready for sign-off.** After a live study of 16 reference sites (log in the appendix), you chose the **code-only particle route**: no Blender, every tool free. Sections 0–7 below are the build plan; the section directly below lists what the research changed in it. Where the two disagree, the research section wins.

## What the research changed

Each item names the site it was learned from. We reproduce technique and structure only; all assets, copy and code are original.

1. **One thread through every section (Hubtown).** Hubtown's six scenes read as one journey because a single light stream runs through all of them. Ours: a thin gold filament of particles leaves the apex node in the hero and is still visible in every later section, feeding each council form.
2. **Same composition for all six councils (Cartier).** Cartier's rooms keep identical framing; only the set changes. Ours: identical camera, title position and rail for Councils I–VI; only the lattice form and colour temperature change.
3. **Fixed text column, content swaps (Hubtown, Oryzo).** Headline left, lattice centre, detail right. Text never travels across the screen; it swaps in place.
4. **Long holds where only the object moves (Oryzo, Cartier).** Inside a council, scrolling just rotates the lattice while the text stays put. Movement between councils is short.
5. **Persistent frame with progress (Hubtown).** Chamfered frame, section label with square bullet, bottom bar with Prev / Next and a fill that grows with progress inside the current chapter. This replaces the plain status bar in section 4.
6. **Callout labels pinned to the 3D form (Igloo).** Mono labels with leader lines anchored to points on the lattice, with text that scramble-decodes on entry. Used for programme names on the active council. Labels are HTML positioned from 3D coordinates, so they stay selectable and readable.
7. **Per-character headline reveal (Terminal).** Headlines type on by scroll progress with one gold "cursor" letter.
8. **Two big transitions only (Shopify, Igloo).** The world-bend with radial zoom-blur (Shopify) for Hero → Thesis and Thesis → Councils; a brief frost / colour-split (Igloo) for Councils → ESG. Everything else is a plain morph. Using these everywhere would cheapen them.
9. **Programme index (Palantir).** Large programme name, one-line descriptor, "/I.01" numbering at right, hairline rules. This is the layout of the full-index drawer and the mobile view.
10. **Pinned blur reveal (Apple).** The thesis statement beat: lattice stays pinned, a dark blur rises, three statement lines fade in over it.
11. **Size sanity check.** Shopify's whole particle forest is under 0.5 MB of point data and Igloo's 20 meshes total 543 KB. Our shapes are generated in code, so the 3D adds no download at all.

Not adopted: sound design (Igloo, Hubtown and Cartier all ship it; out of scope for this draft), text rendered inside WebGL (Igloo; bad for a legal notice and for accessibility), free-roam map navigation (Primland).

## Context

GCI's previous two site attempts (a light/green "Tamil Nadu forum" direction) are being abandoned. The approved PMO brief ("The True Identity of GCI", 7 pages) repositions GCI as a sovereign deep-tech apex node, and the new deliverable is a single dark, 3D, scroll-driven briefing page for government secretariats, sovereign underwriters and boardrooms. This plan covers the workspace reset, the research findings, and the full creative and technical blueprint. **No code is written and nothing is deleted until this plan is approved** (plan mode blocked the "execute immediately" purge; it is Step 0 below).

Decisions already made by you: **wipe everything** (no archive), and the clearance gate is **cinematic only** for this draft.

---

## 0. Workspace audit and purge (first action on approval)

**Found in `C:\Projects\Clients\GCI`** (not a git repo, no `node_modules` anywhere):

| Folder | Contents | Verdict |
|---|---|---|
| `gci-website/` | Vite + vanilla Three.js POC, `BLUEPRINT.md` (old light/green TN direction), `poc.html`, `GCI-DEMO.bat`, `.claude/` | Delete |
| `gci-website-antigravity/` | Second Vite attempt, `dist/` build, `content.json`, template assets | Delete |

`gci-website/.claude/settings.local.json` and `launch.json` are **not clean**: they hold permissions pinned to a dead session's temp paths (ffmpeg frame extraction) and a Vite launcher on port 5174. They go too; a fresh `.claude/launch.json` is written for the new stack.

**Purge steps**
1. `Remove-Item -Recurse -Force` on both folders (permanent; nothing is in git).
2. `Get-ChildItem -Force` to confirm the directory is empty, and report that to you.
3. `git init` in the clean root so every later state is recoverable. No commits are made unless you ask.

---

## 1. Research findings

Search queries contained no GCI brief content. Where a claim comes from a third-party write-up rather than the studio itself, it is marked (3p).

### Reference patterns we adapt

| Need | Reference | What we take |
|---|---|---|
| Camera-rigged 3D hero | **Lusion — Oryzo** (scroll moves the camera through real Z-depth with inertia, not sliding 2D layers) (3p); **Igloo Inc** by abeto, Awwwards Site of the Year 2024 (one continuous 3D world, custom particle/volume data) | One persistent world behind the page. Scroll is a camera dolly with damping; text is DOM laid over it. |
| 6-node switcher | **Cartier Watches & Wonders 2026** by Immersive Garden: six 3D "rooms", one per watch, scroll moves between them; Three.js + GLSL + Lenis (3p). Density language from **Palantir / Anduril**: monochrome, thin borders, sharp corners, index lists instead of paragraphs (3p) | Six "rooms" become six states of one lattice. Each council is an index list, with detail on demand. |
| Pinned narrative reveals | **Apple product pages** (sticky section, scroll-scrubbed progress) and **Shopify Editions Spring '26** (each beat staged as entrance / hold / exit) (3p) | CSS `position: sticky` stages inside tall sections; each beat gets enter, hold and exit thirds. |

Limit: no first-party engineering breakdown was findable for Igloo, Palantir or Anduril. First build step includes a visual pass of the live sites in the browser pane.

### Stack facts verified today (npm registry, 2026-11-10)

- `@react-three/fiber` 9.8.2 is the stable React 19 line; its peer range is `react >=19 <19.4`, so React is pinned to 19.3.x. R3F v10 / drei 11 (WebGPU-first) are still alpha and are **not** used.
- `lenis` 1.3.27: wraps native scroll, so `position: sticky` keeps working; `autoRaf: false` lets an external loop call `lenis.raf(time)`; honours `prefers-reduced-motion` since 1.3.26; no CSS scroll-snap; Safari caps at 60fps (30 in Low Power Mode).
- Motion documents the exact Lenis pairing: `<ReactLenis root options={{ autoRaf: false }}>` driven by `frame.setup(update, true)` from `motion/react`, after which `useScroll` works normally.
- 21st.dev: **Glowing Effect** (@manuarora700, MIT), **Border Beam** (@appica-dev, MIT), **Bento Grid** (@lucasbassetti, MIT) are usable references. **Spotlight Card** has no listed licence, so that pattern is re-implemented by hand (about 30 lines).

---

## 2. Visual direction and design tokens

**Mood:** a classified briefing rendered in a dark room. Obsidian field, one luminous object, hairline instrumentation. Sharp corners (max 2px radius), 12-column grid with visible registration ticks, no gradients-as-decoration, no rainbow accents.

| Token | Value | Use |
|---|---|---|
| `obsidian` | `#050507` | Page and canvas background |
| `carbon` | `#0B0C10` | Raised planes |
| `graphite` | `#14161C` | Panels, drawer |
| `hairline` | `rgba(255,255,255,0.08)` | Borders, grid ticks |
| `titanium` | `#C9CED6` | Primary text |
| `titanium-dim` | `#8A919C` | Secondary text |
| `steel` | `#737B88` | Mono micro-labels (still passes AA on obsidian) |
| `gold` | `#C8A24A` (hover `#E0B25C`) | Authority accent only: council numerals, active node, seal, primary action |
| `cyan` | `#5FD4E6` | Telemetry only: progress, HUD ticks, focus rings |
| `crimson` | `#D8473F` | The legal WARNING line, nowhere else |

**Type** (self-hosted through `next/font`):
- Display: **Newsreader** (variable optical size, light weights, italic for emphasis) for thesis statements and council titles.
- Grotesque: **Geist** for body and UI.
- Mono: **Geist Mono** for indices, labels, classification strips, uppercase with wide tracking.
- Upgrade path if the client licenses fonts: GT Sectra or Tiempos Headline + Söhne + Söhne Mono.

**Lighting / shader mood:** additive point-light particles in titanium white, warming to gold at the active core and cooling to cyan at the edges; soft bloom, fine film grain, light vignette. No per-council colour themes; each council changes the *shape* and only nudges colour temperature.

**Rule: no invented telemetry.** HUD numbers are only true ones (6 councils, 33 programmes, per-council counts, section index, scroll progress). Fabricated metrics on a government-facing briefing are a credibility risk.

---

## 3. 3D scene architecture — "The Sovereign Lattice"

One fixed, full-viewport `<Canvas>` behind the DOM, alive from gate to footer.

**The object:** a single `THREE.Points` cloud (one draw call) whose particles hold **eight baked target shapes** as vertex attributes (`aTarget0..7` + `aSeed`, 9 attributes, under the 16 limit). All motion happens in the vertex shader; JavaScript only updates a handful of uniforms per frame.

| State | Section | Form (generated procedurally at load, no model files) |
|---|---|---|
| 0 | Gate / Hero | **Apex node**: six-faceted hexagonal crystal (six facets = six councils). Dormant dust before clearance. |
| 1 | Council I — Materials | Diamond-cubic atomic lattice cropped to an octahedron |
| 2 | Council II — AI & Compute | Stacked photonic-chip layers with vertical interconnects |
| 3 | Council III — Cyber & Defense | Double geodesic shield shell around a protected core |
| 4 | Council IV — Foresight & Labs | Slowly twisting double helix with rungs |
| 5 | Council V — Economic Stability | Ledger terraces: a grid of columns rising along a growth curve |
| 6 | Council VI — Trade & Diplomacy | Globe of surface nodes with great-circle arcs |
| 7 | ESG | Closed-loop torus with particles circulating |

Extra uniforms instead of extra shapes: `uFracture` (splits the node into six drifting shards for the thesis "fragmented silos" beat), `uCollapse` (flattens to a horizon hairline at the legal footer).

**Vertex shader:** `mix(targetA, targetB, eased uMix with per-particle stagger)` + curl-noise turbulence that peaks mid-transition + pointer repulsion + slight stretch from scroll velocity. **Fragment:** soft disc, additive blend, no depth write (so no sorting cost). GLSL lives in TypeScript template strings, so no bundler loader config is needed.

**Camera rig:** a pose table (position, look-at, FOV) per section, interpolated by section progress with `maath` damping, plus a few degrees of pointer parallax. In the councils section the lattice shifts to the left third so the HUD owns the right.

**Post:** bloom (mip blur), vignette, grain; velocity-linked chromatic aberration on the top tier only.

### Holding 60fps

"Locked 60" is delivered by a budget plus automatic degradation, not by promise:

- **One clock.** Motion's `frame.setup` callback calls `lenis.raf()` and then R3F `advance()` (`frameloop="never"`), so scroll, DOM and WebGL update in the same frame in a fixed order. Fallback if `advance` misbehaves on R3F 9.8: `frameloop="always"` reading `lenis.scroll` in `useFrame`.
- **Budget:** 3 draw calls or fewer, zero per-frame allocations, uniforms only.
- **Quality tiers** (`lib/quality.ts`): high 60k particles / DPR up to 1.75 / full post; mid 30k / DPR 1.25 / bloom only; low 12k / DPR 1 / no post. Initial tier from device heuristics, then drei `PerformanceMonitor` steps DPR and `setDrawRange` down or up live.
- `antialias: false`, `alpha: false`, `powerPreference: "high-performance"`; rendering pauses when the tab is hidden.
- **DOM side:** transform and opacity animations only. `backdrop-filter` is limited to one panel at a time; other "glass" is tinted fill plus a specular 1px border, with no blur.
- The canvas chunk loads with `next/dynamic` (`ssr: false`) **while the gate is on screen**, so the gate doubles as the preloader.
- **Fallbacks:** `prefers-reduced-motion` gives static per-section shapes and fade-only reveals; no WebGL gives a static poster and the full content still reads.

---

## 4. Section-by-section wireframe and choreography

Persistent chrome: top status bar (wordmark, classification strip, section index 00–05, cyan progress hairline) and a right-edge section rail.

| # | Section | Scroll | Content (all from the brief) | DOM motion | Lattice |
|---|---|---|---|---|---|
| 00 | **Restricted Briefing Clearance** | Locked (`lenis.stop()`) | Wordmark, "RESTRICTED · PRELIMINARY INSTITUTIONAL BRIEFING", the three enforcement clauses in short form, hold-to-acknowledge button (plain Enter/Space also works) | On acknowledge: strip lines wipe, gate panel morphs via `layoutId` into the status bar, scroll unlocks. Remembered per session. | Dormant dust condenses into the apex node (1.6s boot) |
| 01 | **Hero** | 180vh | Entity name; "Section 8 Apex Corporate Node (Companies Act, 2013)"; one-line positioning; "Prepared for" strip: MeitY · MoF · TIDCO · NITI Aayog · Global Private Equity · Sovereign Wealth Underwriters · Fortune 500 Boardrooms | Line-by-line masked headline reveal; text exits on scroll | Slow rotation, camera dollies in |
| 02 | **Thesis** | Pinned 300vh, 3 beats | **A** What GCI is, as a triptych: localize upstream supply chains / de-risk frontier manufacturing / route non-debt institutional capital. **B** Contrast split: legacy infrastructure, risk-averse bureaucracy, fragmented silos, subsidy wars over low-margin assembly, versus pre-emptive integration across six councils building the upstream layers. **C** Three outcomes: national autonomy · radical resource efficiency · foolproof systemic safety | Enter / hold / exit per beat; split panels slide from opposite edges | **B:** fractures into six drifting shards, then re-integrates. **C:** node at full brightness |
| 03 | **Six Governing Councils & Macro-Prediction Engine** | Pinned ~700vh (intro + 6) | Cabinet-structure sentence; then per council: numeral, title, Associated Domain tag (IV, V, VI), programme count, programme index | See below | Morphs through states 1–6 |
| 04 | **Preemptive ESG & Catastrophic Risk Mitigation** | Pinned 250vh | Mandate sentence; three mandates as a bento: Pre-Deployment Audits, Zero-Discharge Closed-Loop, Generational Human Capital Binding with a **Silicon Seedling Initiative** callout | Cards stagger in; pointer-tracked spotlight; border beam on the focused card | Closed-loop torus circulating |
| 05 | **Legal Notice & IP Exclusivity** | Normal scroll | Full verbatim notice: WARNING paragraph, Enforcement & Liability Governance (3 clauses), acknowledgment line | None beyond a fade; legal text must read plainly | Collapses to a horizon hairline, canvas dims |

### Councils matrix (the centrepiece)

- **Layout (desktop):** vertical six-node rail (I–VI) on the far left, lattice in the left third, HUD panel on the right.
- **One source of truth:** scroll position decides the active council. Clicking a rail node calls `lenis.scrollTo()` to that council's offset, so click and scroll can never disagree.
- **No text wall:** the panel shows only the active council's programme *names* as a numbered index (10 / 6 / 5 / 5 / 3 / 4). The selected row expands its one-line descriptor in a detail pane with a spring layout animation; the first row is open by default. Arrow keys move between rows.
- **Full index drawer:** a spring drawer listing all 33 programmes with full descriptors, for readers who want to scan everything (`data-lenis-prevent` inside).
- **Mobile:** pinning is dropped; councils stack as accordions under a sticky 40vh lattice band on the low tier.

---

## 5. Component and animation stack

| Layer | Choice (version verified today) |
|---|---|
| Runtime / package manager | Bun 1.4.2 |
| Framework | Next.js 16.4 App Router, statically prerendered, `noindex` |
| Language / styling | TypeScript (version Next scaffolds), Tailwind CSS 4.3 with tokens in `@theme` |
| 3D | `three` 0.187, `@react-three/fiber` 9.8, `@react-three/drei` 10.7, `@react-three/postprocessing` 3.2, `maath` |
| Motion | `motion` 14 (`motion/react`): `useScroll` + `useTransform` for pinned beats, `layoutId` for gate→status bar, rail indicator and row→detail, `AnimatePresence` for panel swaps, spring drawer, `MotionConfig reducedMotion="user"` |
| Smooth scroll | `lenis` 1.3.27 via `lenis/react` |
| State | `zustand` 5, used as a non-reactive store the shader reads each frame |

**Deliberately excluded:** GSAP / ScrollTrigger. Sticky CSS plus Motion covers pinning and scrubbing, and a second animation clock is the usual source of scroll jitter.

**Why Next.js over plain Vite:** self-hosted fonts and metadata out of the box, and a server boundary already in place for when the gate becomes real access control.

### File layout

```
app/            layout.tsx · page.tsx · globals.css
content/        briefing.ts            # typed single source of all copy
lib/            scroll-store.ts · quality.ts
components/
  providers/    SmoothScroll.tsx       # Lenis + Motion frame + R3F advance
  canvas/       Scene.tsx · LatticeCore.tsx · CameraRig.tsx · Effects.tsx
                shapes/*.ts · shaders/lattice.ts
  sections/     Gate · Hero · Thesis · Councils/* · Esg · LegalFooter
  ui/           StatusBar · SectionRail · HudPanel · BeamBorder
                SpotlightCard · RevealText · HoldButton · Drawer
.claude/        launch.json            # `bun run dev`, port 3000
```

### Content handling

The PDF is canonical. `content/briefing.ts` stores, per programme, the **short** descriptor (from your prompt) for the HUD and the **full** PDF wording for the drawer. All 6 councils, 33 programmes, 3 ESG mandates and the legal notice are accounted for. Items I will apply or need confirmed:

- Typos corrected: "attice-Based" → "Lattice-Based", "light speedt o" → "light speed to", "fool proof" → "foolproof".
- Council I items 5 and 10 are near-duplicates (both metamaterial shielding/cloaking). Both are kept, titled as in your prompt, since the count of 33 depends on it.
- The PDF's legal notice says "**PROPOSED** Section 8 Apex Node"; the hero line says "Section 8 Apex Corporate Node". Both are rendered as written. Worth confirming incorporation status with the client before this goes to government readers.
- Hero and beat headlines are my draft wording built from the brief; they are flagged in the content file for approval.
- The gate is cosmetic: the briefing text is in the page bundle. It must not be deployed publicly until real access control replaces it.

---

## 6. Build order

0. Purge, `git init`, scaffold with Bun, pin versions, fresh `launch.json`.
1. Tokens, fonts, layout shell, content model; every section readable as static HTML with no 3D.
2. Scroll spine (Lenis + Motion + store) and pinned-beat choreography.
3. Canvas: lattice, eight shapes, morph shader, camera rig.
4. Councils matrix interactions and the full-index drawer.
5. Gate and boot sequence, post effects, quality tiers, reduced motion, mobile layout.
6. Verification pass.

## 7. Verification

- `bun run build` and typecheck pass with no errors.
- Run the dev server in the browser pane; walk gate → hero → thesis → councils → ESG → footer; screenshot each section at desktop and at the mobile preset.
- Content audit: script-count the rendered page for 6 councils, 33 programmes, 3 mandates, 3 enforcement clauses; diff the legal text against the PDF.
- Performance: `r3f-perf` overlay in dev for frame time and draw calls; confirm tier stepping by throttling. Real-device frame rate (a mid-range phone, a non-gaming laptop) cannot be measured from here and needs a check on your hardware.
- Accessibility: keyboard-only pass through gate, rail, programme rows and drawer; reduced-motion emulation; contrast spot-checks on `steel` and `titanium-dim`.
- Console free of errors and WebGL warnings.

---

## Appendix — Reference research log (live-site inspection, 2026-11-10)

Method: built-in browser at 1440x900, scroll stepped in 0.25-viewport increments with a screenshot per step, plus in-page inspection of loaded resources (models, textures, video), canvas context type, sticky/tall sections, libraries. Browser pane must be VISIBLE or WebGL sites stall on their loaders.

Machine: RTX 3050 laptop GPU. Blender NOT installed. ffmpeg 9.0 installed. Bun 1.4.2, Node 24.

### 1. Terminal Industries — https://terminal-industries.com/ (client's own earlier reference)
- Stack: Nuxt (Vue) + Lenis + Storyblok CMS, SuisseIntl font. 17.5 viewports long. NO three.js, NO 3D model files.
- Hero is NOT real-time 3D. It is a **pre-rendered CGI film scrubbed by scroll**: `div.video-sequence-scroll` 3 viewports tall, sticky; a Web Worker (`video-sequence.worker`, `get-frames`) decodes video frames and paints them to a **2D canvas** (1781x1125).
- Frame-by-frame (scroll in viewports): 0.00 truck side-profile at sunset, photoreal → 0.25 camera cranes up/back, yard revealed → 0.50 aerial yard, headline types on char-by-char with a green "cursor" letter → 0.75 photoreal dissolves into glowing point-cloud/wireframe digital twin → 1.00 fully dark lidar-style scene, headline 2 → 1.25-1.50 camera dives through wireframe, bokeh particles → 1.75 light tendrils converge to centre → 2.00 black grid tiles, final line → 2.25+ hard cut to white content section with notched edge.
- Text: each headline split into per-character spans, revealed by scroll progress (colour wipe).
- Later sections: 4 looping 5s "prerender" mp4s in a carousel; sticky "features-steps" list (3.4vh).
- To replicate: needs an offline 3D render (Blender is the free route) exported as video, then scrubbed. Cheap at runtime, heavy to author.

### 2. Igloo Inc — https://www.igloo.inc/ (Awwwards Site of the Year 2024, by abeto)
- Fully WebGL (three.js), zero DOM text; all UI rendered in canvas. Virtual scroll (page height = 1 viewport; wheel drives a timeline).
- Sequence seen: snow landscape + igloo of glowing ice blocks with mono HUD labels → blocks float apart with numbered tags → ice-crystal monoliths each labelled with a portfolio company → concentric ring portal with particle burst at centre.
- Authored with custom 3D assets (third-party report: Houdini + Blender). Heaviest to replicate.

### 3. Lusion — https://lusion.co/
- Light lavender page, rounded hero frame with physics-driven 3D shapes. Studio showreel tone; not a fit for GCI.

### 4. Oryzo (by Lusion) — https://oryzo.ai/
- three.js, 6 canvases, 2 videos, Halyard Display font, 63 viewports of scroll. Chaptered product storytelling with "scroll to continue" beats. Warm dark brown palette.

### 5. Active Theory — https://activetheory.net/
- Single WebGL canvas, black, particle dust + iridescent ring logo, no page scroll. Useful as particle-atmosphere reference only.

### 6. Hubtown (Unseen Studio) — https://hubtown.co.in/
- three.js, 1 canvas, page height 1 viewport (virtual scroll). Glowing blue cube monolith over reflective water, mountains; left rail of 6 chapter labels (FUTURE / INNOVATION / COLLABORATION / EXCELLENCE / PURPOSE / LEGACY). Closest existing match to "one hero object + 6-node rail".

### DEEP-DIVE UPDATES (dense frame capture + asset manifests)

**Terminal (rest of page):** after the 3vh film hero everything is a conventional LIGHT page: 3-card row, ROI calculator, sticky two-column "features-steps" (left text list where inactive items dim to grey, right a rounded card playing a pre-rendered looping clip that swaps per step: photoreal top-down truck → same shot as point-cloud twin), word-by-word grey→ink headline reveals, notched card corners, mono labels, logo wall, quote over photo, FAQ accordion.

**Igloo (real wheel input, 3 ticks/frame):** f0 igloo with live node-graph numbers on blocks → f1-2 blocks jostle apart with scroll velocity and float → f3 snaps back to perfect igloo → f4-5 frost/pixel-smear + RGB-split post effect takes over screen, UI text glitches → f6 camera drops through fog → f7 ice crystal with figure frozen inside + HUD callout ("PORTFOLIO_CO_01 / PUDGY PENGUINS", TEMP readouts, date, CLICK TO EXPLORE, leader lines) → f8-9 crystal rotates, wireframe net around it, label text scramble-decodes → f10-11 crystal exits top, empty fog → f12-13 crystal 2 ("PORTFOLIO_CO_02 / OVERPASS", iridescent logo inside ice) → f14-15 descent to shattered ring portal with particle burst.
Asset manifest: three.js r165; 20 Draco meshes (.drc, only 543 KB total: igloo, mountain, ground, shattered_ring, cube1-3, smoke_trail...); 45 KTX2 textures (10.7 MB) incl. BAKED lighting maps (igloo_color, igloo_exploded_color, ground_color, mountain_color) and "datatextures" (scroll-datatexture 1.2 MB = animation baked to texture); MSDF IBM Plex Mono rendered in WebGL; 18 .ogg sounds; draco + basis wasm. => custom modelling + baking in a DCC tool is mandatory for this look.

**Hubtown:** three.js r179; 8 GLB scenes (12 MB; map.glb 7.9 MB), 19 KTX2 textures, 2 EXR height maps literally named "scene3-houdini-height.exr" (terrain authored in Houdini), matcaps, water normal map, 7 .wav sounds, Commit Mono font. 6 chapters = 6 separate 3D scenes; inside a chapter scroll tilts/lifts the cube; chapter change = letter-scramble headline + new scene (glowing river line). Chamfered-corner frame UI, bottom bar with sound / PREV / NEXT.

### 7. Apple Vision Pro — https://www.apple.com/apple-vision-pro/
- NO canvas, NO WebGL. 35 viewports, light theme, SF Pro. Hero photo sits in a 2vh sticky container; on scroll a frosted-white blur wipes up over it and three statement lines fade in on top (blur + opacity scrubbed to scroll). After that: full-bleed autoplay videos with pause buttons, eyebrow + giant headline pairs, horizontal card carousels. All craft is photography/video + restraint. Zero 3D tooling needed to copy the mechanics.

### 8. Palantir — https://www.palantir.com/
- Next.js, NO canvas, fonts Alliance No.1 / No.2, 7.3 viewports, mostly light with dark cards. Hero = looping product video. Then: chip tabs; dark feature card with white LINE-ART technical drawings (helicopter / airliner / ship labelled Defense / Commercial / Industrial), mono caption row, giant wordmark; large grey statement paragraph with one phrase highlighted; **product index: huge names (AIP, Gotham, Foundry, Ontology, Apollo), one-line descriptor each, "/0.1…/0.5" index at right, hairline rules** — the cleanest existing pattern for 6 councils / 33 programmes; chamfered testimonial cards; mega-footer.

### 9. Anduril — https://www.anduril.com/
- Black, Helvetica Now Display, Lenis, 5.8 viewports. One WebGL canvas + a custom .vs shader file over the hero VIDEO (lens/blur treatment); 3 mp4s. Product mosaic grid of mixed-size image tiles with bottom-left labels; then name-left / image-right rows with mono captions; poster-style editorial cards. No scrollytelling, no 3D models.

### 10. Helsing — https://helsing.ai/
- Next.js, Suisse Intl, 9 viewports, no canvas, no sticky. 19.6 MB hero video with giant white "MILITARY AI" set across it; then full-bleed cinematic product stills (studio CGI/photography: black, red, white strip lights) with name + grey descriptor + ghost button. Premium comes from art direction of imagery, not code.

### 11. Linear — https://linear.app/
- No canvas, no video. Inter Variable + Berkeley Mono, bg #08090A, 11 viewports. Product UI as hero; statement paragraph with white lead sentence and grey remainder; "FIG 0.1 / 0.2 / 0.3" mono labels over isometric line illustrations. All DOM/CSS.

### 12. Stripe Press — https://press.stripe.com/
- three.js r151, one GLB (medallion.glb); books are 3D slabs in a vertical stack that tilt as you scroll; Ivar Headline serif; warm near-black #201819; left tick-mark rail as scroll index. Proof that an editorial list can itself be the 3D object.

### 13. Shopify Editions Spring '26 — https://www.shopify.com/editions/spring2026
- three.js r183, one canvas, 43 viewports, bg #090909, National 2 + Inter. Hero is a forest made ENTIRELY of coloured particles loaded from a binary point cloud (forest-1024-…​.bin) with curved 3D type; KTX2 frame atlases for small animations; HDR env maps. Scroll = zoom-blur warp into chapter title ("Agentic") with a bottom pill chapter switcher, then conventional dark content sections. Closest TECHNIQUE match to a particle-lattice hero; needs no modelling.

### How these sites are made — four production routes
- A. Pre-rendered film scrubbed by scroll (Terminal, classic Apple): offline 3D render → video/frames → 2D canvas. Needs Blender (free) + ffmpeg (installed). Light at runtime, heavy to author, not interactive.
- B. Real-time WebGL with authored assets (Igloo, Hubtown, Stripe Press): models + baked textures from Blender/Houdini → Draco/KTX2 → three.js. Blender covers it for free; Houdini's free tier is non-commercial only.
- C. Real-time procedural (Shopify particles, Active Theory): code only, no modelling tool, free.
- D. No 3D at all (Apple Vision Pro, Palantir, Helsing, Linear): video + stills + typography; cost is in imagery.
- Not yet deep-dived: Cartier W&W, Primland, Oryzo (light pass only), Lusion (light pass only).

### DECISION (user, 2026-11-10): production route = **particles, code only** (Hubtown structure + Shopify particle technique + Igloo HUD labels + Palantir index). No Blender. User then asked for extra study of Hubtown (all chapters), Shopify particles, Cartier, Primland, Oryzo before the plan is revised.

### Hubtown — chapter-by-chapter (real wheel; ~18 ticks for ch.1, ~12 per later chapter)
- Persistent chrome: chamfered frame, logo top-left, LOGIN / MENU top-right, chapter label with square bullet above headline, bottom bar = sound | PREV | NEXT | contact, with a fill block that grows as chapter progress.
- Ch1 FUTURE "We build the future of real estate": glowing cube over dark water between two terrain wings; scrolling only tilts/rotates/lifts the cube (the hold).
- Transition: headline letters scramble out, camera dives; ~1 beat of streaked blur.
- Ch2 INNOVATION "We lead the way in development": top-down glowing river line on black.
- Ch3 COLLABORATION "We work with a network of experts": camera inside several converging light streams; small cubes appear overhead.
- Ch4 EXCELLENCE "To build what others can only imagine": streams run to a horizon of glowing cubes (a city); CTA label scramble-resolves.
- Transition: pixel-smear + RGB split.
- Ch5 PURPOSE "Shape the land with purpose": streams flowing over dark mountain terrain. (Ch6 LEGACY not captured.)
- Lesson: ONE light thread carries through every chapter, so the six scenes read as one journey; text column is fixed-position left, only its content swaps.

### Shopify Editions — hero in fine steps (0.15-viewport increments)
- Assets: forest point cloud is one 497 KB .bin (+ a 226 KB .bin); two 25 KB HDRs; KTX2 frame atlases.
- 0.00–0.60: hero stays full-screen; the ring of 3D type ("Everywhere", mirrored below as a reflection) rotates about 45° per step; particles shimmer; a chapter pill appears bottom-centre at 0.30.
- 0.75–0.90: the ground plane curls upward like a page and streaked, motion-blurred imagery of the next scene enters under it.
- 1.05–1.20: forest particles thin to dust; radial zoom-blur fills the frame; chapter title "Agentic" rises bottom-left.
- 2.00+: canvas band ends; conventional dark sections (headline left, short paragraph right, media cards).

### Oryzo — https://oryzo.ai/ (full pass)
- three.js r178 "modified by Lusion"; 25 custom .buf files holding meshes AND baked camera/object animation tracks (hero_camera, CAMERA_ANIM, COASTER_ANIM…); 2 gaussian-splat .sog files; 4 Rive files; 80 webp textures; 63 viewports.
- 0.0 top-down desk scene → 0.3 props slide away, copy blurs out → 0.6 object alone on dark, headline builds word by word at left, paragraph word by word at right → 1.0–3.0 HOLD: only the object flips on its axis → 4.5 object shrinks into a hand, large centred title + orange tag → 7.0 gradient frame, hover prompt → later: magazine-cover parody, monochrome macro close-up.
- Lesson: headline-left / object-centre / paragraph-right hold, with long scroll distance spent only rotating the object.

### Cartier Watches & Wonders — https://www.cartier.com/en-fr/watchesandwonders
- three.js r183, single canvas, virtual scroll. Each room is a theatre set (curved backdrop, props, silhouetted craftspeople at benches) with one oversized watch floating centre. Serif caps title top-centre, EXPLORE bottom-centre, dot rail right edge.
- Within a room (~16 wheel ticks) the camera trucks slowly sideways and the watch rotates; then a cut to the next room with the SAME composition and a different set and palette.

### Primland — https://explore.ownprimland.com/
- three.js r179, Lenis; real terrain (elevation.glb) with 10 MB seasonal texture, tree billboards, bird paths. Gate button, then a free-roam top-down map: on-canvas hints "Drag to move" / "Scroll to zoom", hotspot pins, season toggle. A map explorer, not linear scrollytelling; low relevance.
