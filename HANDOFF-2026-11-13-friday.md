# GCI Briefing Portal — Handoff, Friday 13 November 2026

> **Instruction to the next agent.** Read this whole file before doing anything. When the user
> says "go through it" (or similar), reply with:
> 1. a five-line summary of where the project stands (section 1);
> 2. the **Next session** list from section 12, in order, with your recommendation;
> 3. one question: which item to start with.
>
> Do not start building until the user picks. Do not push to GitHub or change Vercel settings
> without asking first (section 11).

The chat this came from has been deleted. This file, the repo, and the files listed in section 13
are the only record.

---

## 1. Where things stand (summary)

- **What it is:** a dark, single-page, scroll-driven 3D "institutional briefing" website for the
  **Global Confederation of Industries (GCI)**. The readers are government secretariats (MeitY, MoF, TIDCO,
  NITI Aayog), global private equity, sovereign wealth underwriters, Fortune 500 boards, and in
  the user's words "policy makers and oppositions we are trying to convince".
- **State:** first full draft is **built, committed, pushed and live**.
  - Live: **https://gci-website-gamma.vercel.app**
  - Repo (PUBLIC): **https://github.com/creatorzorgan/gci-website**, branch `main`, head `7dfd200`
  - Local: `C:\Projects\Clients\GCI` (Windows)
- **Opening image:** a six-arm particle galaxy, one arm per council. Wireframe lobes above and
  below stand for public mandate and institutional capital, around a gold core, the "apex node".
  It replaced an earlier hexagonal "crystal".
- **Logo:** a new GCI logo exists: an edge-on disc crossed by two lobes meeting at a gold core.
  **Brand kit v1.0** is at `brand/gci-brand-kit.png`.
- **Uncommitted when this was written:** this handoff file, `docs/`, `brand/tools/` (see section 13).

---

## 2. The client and the source material

- **Source of truth:** the approved PMO brief, *"The True Identity of GCI"* (7 pages). The PDF is at
  `C:\Users\ASUS\Downloads\Approved Draft PMO (1).pdf`; all its text is in `content/briefing.ts`.
- **Entity:** "Section 8 Apex Corporate Node (Companies Act, 2013)". The legal notice in the PDF
  says "**Proposed** Section 8 Apex Node". Both are shown as written (open question, section 10).
- **Structure of the brief, all on the page:**
  - Core positioning and thesis: localize upstream supply chains, de-risk frontier manufacturing,
    route non-debt institutional capital. First-world powers are trapped by legacy infrastructure
    and silos; regional initiatives fight subsidy wars over low-margin assembly.
  - **Six Governing Councils and Macro-Prediction Engine**, **33 programmes** in total:
    - I · Semiconductor, Superconductor & Advanced Materials Ecosystem: 10 programmes
    - II · Artificial Intelligence & Post-Silicon Compute: 6
    - III · Cyber Security & Sovereign Defense: 5
    - IV · Strategic Foresight & Translational Labs (Ministry of Future Disruptions): 5
    - V · Economic Growth & Stability Forum (Ministry of Sovereign Capital Realignment): 3
    - VI · Global Trade Architecture & Neutral Diplomacy (Ministry of Neutral Diplomacy): 4
  - Preemptive ESG & Catastrophic Risk Mitigation: 3 mandates, including the
    **Silicon Seedling Initiative**.
  - Legal Notice & IP Exclusivity: WARNING paragraphs, 3 enforcement clauses, acknowledgment.
- **Copy rules applied:**
  - Every programme has a `short` descriptor (from the user's build prompt) and a `full` descriptor
    (the PDF wording).
  - Three PDF typos were corrected: "attice-Based" → "Lattice-Based", "light speedt o" → "light speed to",
    "fool proof" → "foolproof".
  - A script check confirmed all 33 full descriptors and 27 other passages match the PDF
    word for word, apart from those typo fixes.

---

## 3. Timeline of the deleted chat (what happened, in order)

1. **User's original mission:**
   - wipe the workspace;
   - do deep design research (Palantir, Anduril, Linear, Stripe Press, Apple, Igloo, Lusion,
     Active Theory, 21st.dev, motion.dev);
   - present a master plan (tokens, 3D architecture, section wireframe, stack);
   - wait for sign-off.
2. **Workspace audit.** Two abandoned attempts were found: `gci-website/` (Vite + Three.js POC,
   light/green "Tamil Nadu forum" direction, BLUEPRINT.md) and `gci-website-antigravity/`. The user chose
   **"Wipe everything"** (no archive). The clearance gate was agreed as **cinematic only**.
3. **First plan rejected.** The user wanted deeper research first: visit every site live, step
   the scroll in small increments ("frames on frames… mini nano scrolls"), and say whether Blender is needed
   and whether it can all be free.
4. **Research done live in the browser:** 16 sites, with dense scroll-stepped screenshots and a
   list of what each page loads. The full log is in `docs/2026-11-10-master-plan-and-reference-research.md`.
   Summary in section 4.
5. **User chose the "particles, code only" route.** No Blender, everything free. They asked for
   extra study of Hubtown (all chapters), Shopify particles, Cartier, Primland and Oryzo; that was done.
6. **Plan approved.** Workspace purged, `git init`, Next.js scaffolded with Bun, full first draft
   built (crystal hero, six council forms, ESG, legal), verified, committed `f7cdbd6`.
7. **Brand guide v0.1** (documenting the as-built system) rendered to an image, committed `8ec3304`.
   **Pushed** to the public GitHub repo; the user explicitly said "Push as is" despite the
   confidentiality notice in the brief.
8. **User's next request** (with a screenshot and the YouTube short
   https://www.youtube.com/watch?v=IHfQeQs8EGM by Orvae Space, "You're not sitting still…").
   - They asked to replace the "diamond" (crystal) hero with that galaxy look, make it
     "jaw dropping" for policy makers and opposition, and make a proper brand kit with a logo.
   - The video was stepped through frame by frame (section 5).
9. **User's answers:**
   - "the 6 councils are perfect", so keep them;
   - "go for whole page as long as it matches the vibe";
   - "metaphor is fine";
   - "gci doesn't have any logo, we gotta make";
   - "header just means the hero only".
10. **Galaxy built**, logo designed, brand kit v1.0 rendered, committed `7dfd200`, **pushed** (user said "Push it").
11. **Vercel.**
    - The user named the deploy target: https://vercel.com/creatorzorgan-7811s-projects/gci-website,
      "deploy it here only from now always".
    - The Vercel MCP connector in that chat was signed into a different account (team
      "Geovitas-iRaise") and could not reach this personal scope.
    - The Vercel CLI was installed (`vercel@65.15.0`, global npm) and the user approved a device login
      as **`creatorzorgan`**.
    - The project was already Git-connected, so the push had auto-deployed `7dfd200` to production
      (Ready), alias `gci-website-gamma.vercel.app`.
    - The user chose a **public link**; the production alias was already public, so no setting was changed.
12. This handoff written.

---

## 4. Research findings that shaped the design (short version)

Full log, per-site asset lists and frame-by-frame notes:
`docs/2026-11-10-master-plan-and-reference-research.md` (appendix).

| Site | How it is built | What we took |
|---|---|---|
| Terminal Industries (client's earlier reference) | Pre-rendered CGI film scrubbed by scroll on a 2D canvas (Nuxt, Lenis). No live 3D. | Per-letter headline type-on with a gold "cursor" letter |
| Igloo Inc (Awwwards SOTY 2024) | Fully WebGL; Draco meshes, baked KTX2 textures, sounds | Instrument-style callout labels, scramble text |
| Hubtown (Unseen Studio) | WebGL, 8 Houdini/GLB scenes, 6 chapters | One light thread through every chapter; fixed text column; framed chrome with Prev/Next progress |
| Shopify Editions Spring '26 | WebGL particle forest from a 0.5 MB point cloud | Particle technique; zoom-blur warp between chapters |
| Cartier Watches & Wonders | WebGL rooms, identical composition per room | Same framing for every council; only the form changes |
| Oryzo (Lusion) | WebGL, baked animation tracks | Headline left / object centre / paragraph right; long holds where only the object moves |
| Palantir | No 3D; video + layout | Numbered product index (huge name, one-liner, "/0.1" at right) → programme index |
| Apple Vision Pro | No 3D; pinned photo + blur reveal | Pinned blur-and-statement beat (thesis outcomes) |
| Anduril, Helsing, Linear, Stripe Press, Active Theory, Lusion, Primland | various | tone and density references; Primland (free-roam map) not adopted |

Production routes identified:
- **A. Pre-rendered film**: needs Blender.
- **B. Live 3D with modelled assets**: needs Blender.
- **C. Code-only particles**: free. **Chosen.**
- **D. No 3D**: relies on imagery.

Not adopted: sound, text rendered inside WebGL, free-roam navigation.

---

## 5. The galaxy reference video (frame by frame)

The video is 25 s, portrait, and loops.
- **0–2 s:** particle galaxy disc, bright core, two nested wireframe lobes (orange outer, pink
  inner) above and below, a glowing Sun on the rim, a small HUD with counters.
- **2–4 s:** push in; leader-line labels appear.
- **4–12 s:** plunge to solar-system scale; planets drag corkscrew trails; captions build word by
  word with the key word in gold.
- **13–16 s:** the camera looks down the trail tunnel.
- **20 s:** hard cut to an eclipse-style gold ring at the core.
- **22–25 s:** pull back to the opening frame.

We built our own scene in this style. None of the video's footage or labels were reused.

---

## 6. What the live page does now (section by section)

Order: Gate → Hero → Thesis → Councils → Risk mitigation → Legal. Desktop pins sections with
sticky stages; below 1024 px (`lg`) councils and ESG become plain stacked lists.

1. **Restricted Briefing Clearance gate**
   - Logo, classification strip, the 3 enforcement clauses in short form, and a
     hold-to-acknowledge button (Enter also works).
   - The acknowledgement is stored in `sessionStorage` key `gci-clearance`.
   - **Cosmetic only: not access control.** On acknowledge, the dust condenses into the galaxy.
2. **Hero** (`#apex`, 200vh)
   - "The upstream layer / of national autonomy." types on letter by letter (DRAFT copy).
   - The galaxy sits right, near edge-on, with labels: **Apex node** (Central cabinet · six councils),
     **Public mandate** (Union Ministries · State Agencies), **Institutional capital**
     (Non-debt · infrastructure).
   - Scrolling raises the camera until the six arms open face-on.
3. **Thesis** (`#thesis`, 500vh)
   - (A) definition plus the three mandates (Localize / De-risk / Route);
   - (B) contrast, incumbent trap vs GCI position, while the galaxy **splits into six silos**
     and re-forms;
   - (C) three outcomes over a blur with the core ring lit.
4. **Six Governing Councils** (`#councils`, 920vh desktop)
   - The intro headline, then the camera **dives into an arm**, which becomes Council I.
   - Per council: numeral, title, domain tag, programme count, programme list (hover/click/arrow keys
     open the descriptor), two cyan callouts pinned to the form, and a left rail I–VI.
   - "Open full index" opens a drawer with all 33 programmes in full PDF wording.
   - The six council forms are the user-approved ones:
     - diamond-cubic lattice;
     - photonic layer stack;
     - geodesic shield;
     - double helix;
     - ledger terraces;
     - corridor globe.
5. **Risk mitigation** (`#risk`, 400vh): mandate statement and 3 cards with spotlight and border beam;
   the form becomes a circulating closed loop (torus).
6. **Legal notice** (`#legal`): full verbatim text, static; the form flattens to a horizon line.

**Persistent chrome:**
- framed border with gold corner ticks;
- header with the logo, "GCI" in Newsreader, full name, classification and an **Index /33** button;
- bottom bar with the current chapter label, Prev/Next with a chapter-progress fill, and overall
  briefing progress.

A thin **gold particle thread** runs vertically through every section.

---

## 7. Code map

Stack (exact versions in `package.json`):
- Next.js 16.4.6 (App Router, Turbopack, `cacheComponents` on), React 19.3.0, TypeScript, Tailwind CSS 4.3;
- three 0.187, @react-three/fiber 9.8.2, drei 10.7.9, postprocessing 3.2.2;
- motion 14.12, lenis 1.3.27, zustand 5.1, maath. Package manager: **Bun 1.4.2**.

Keep React below 19.4: R3F 9.8's peer range is `react >=19 <19.4`. GSAP is not used, on purpose.

| Path | Role |
|---|---|
| `content/briefing.ts` | **All copy.** Councils, programmes (short + full), ESG, legal, DRAFT headlines |
| `lib/store.ts` | Per-frame mutable `frame` object (scroll y, ranges, pointer, Lenis, callout and galaxy-label DOM refs); councils timing constants `COUNCILS_INTRO_VH=100`, `COUNCIL_SEG_VH=120`; Zustand UI store (cleared, activeCouncil, selected rows, drawer, tier, reducedMotion) |
| `lib/directive.ts` | **Scroll → 3D choreography.** Per section: shape from/to/mix, fracture (six silos), collapse (horizon), warp (zoom-blur at section boundaries), glitch, brightness, scale, offsetX/Y, tilt, ring, labels |
| `lib/quality.ts` | Tiers: high 60k particles, DPR 1.75, post; mid 30k, DPR 1.25; low 12k, DPR 1, no post |
| `lib/hooks.ts` | `useSectionRange` reports each section's position to `frame.ranges` |
| `components/Experience.tsx` | Page assembly; WebGL error boundary with static fallback; tier detection; reduced-motion |
| `components/providers/SmoothScroll.tsx` | Lenis driven from Motion's `frame.setup` loop; scroll locked behind gate and drawer |
| `components/canvas/shapes.ts` | The 8 particle forms generated in code: 0 galaxy (`GALAXY = {arms:6, r0:0.22, rMax:2.15, wind:1.35}`), 1–6 councils, 7 closed loop; `buildLobeGeometry`; gold thread geometry |
| `components/canvas/shaders.ts` | Lattice vertex shader (morph, turbulence, fracture, collapse, warp, galaxy warm colour), point fragment, thread, **eclipse ring** shader |
| `components/canvas/Scene.tsx` | R3F canvas: lattice + thread + **wireframe lobes** (outer `[0.9,1.08]` gold, inner `[0.58,0.74]` cream) + billboard ring; projects council callouts and **galaxy labels** to screen each frame; bloom, noise, vignette; PerformanceMonitor |
| `components/sections/*` | Gate, Hero, Thesis, Councils, Esg, Legal |
| `components/ui/Chrome.tsx` | Frame, header with logo, bottom bar (chapter stops, Prev/Next) |
| `components/ui/Callouts.tsx` | Council callouts and `GalaxyLabels` (leader-line labels; config: title, sub, dx, dy, dir) |
| `components/ui/Logo.tsx` | `GciMark` React component (same geometry as `brand/logo/gci-mark.svg`) |
| `components/ui/IndexDrawer.tsx` | All 33 programmes, full text |
| `components/ui/text.tsx` | `TypeOn` (per-letter, gold cursor) and `Scramble` |
| `app/layout.tsx` | Fonts via `next/font/google` (Newsreader, Geist, Geist Mono), `robots: noindex, nofollow, nocache` |
| `app/icon.svg` | Favicon (copy of `brand/logo/gci-favicon.svg`) |
| `.claude/launch.json` | Dev server config "gci-dev" (`bun run dev`, port 3000) |

---

## 8. Brand system

**Colour tokens** (`app/globals.css` `@theme`):

| Token | Value | Use |
|---|---|---|
| obsidian | #050507 | background |
| carbon | #0B0C10 | raised planes |
| graphite | #14161C | panels |
| titanium | #C9CED6 | primary text |
| titanium-dim | #8A919C | secondary text |
| steel | #737B88 | mono labels |
| gold | #C8A24A | authority accent |
| gold-bright | #E0B25C | hover, emphasis |
| cyan | #5FD4E6 | instrumentation only |
| crimson | #D8473F | legal WARNING only |
| hairline | rgba(255,255,255,.08) and .16 | borders |

**Type:**
- Newsreader Light 300 for display (italic for one emphasised word);
- Geist for body;
- Geist Mono for labels (11 px uppercase, 0.16em tracking).

All three are open-licensed. Upgrade path if the client licenses fonts: GT Sectra or Tiempos with Söhne.

**Logo, the "apex mark":**
- **Shape:** an edge-on disc (titanium) crossed by an upper and a lower lobe (gold), meeting at a gold
  core; tilted −12°. Depth comes from masks: the disc's front half passes in front of the lobes.
- **Meaning:** core = apex node / central cabinet; upper lobe = public mandate; lower lobe =
  institutional capital; disc = the economy.
- **Geometry** (200 box): lobe rx 31, ry 42; disc rx 94, ry 14; stroke 6.2; core r 12.5; tilt −12.
  It must match in `brand/tools/build_logo.py` and `components/ui/Logo.tsx`.
- **Wordmark:** "GCI" in Newsreader (wght 420), tracking 0.14em. Descriptor "GLOBAL CONFEDERATION OF
  INDUSTRIES" in Geist Mono with 0.2em tracking.
- **Files** in `brand/logo/`:
  - `gci-mark.svg`, `-gold`, `-white`, `-black`;
  - `gci-logo-horizontal.svg` plus `-light`;
  - `gci-logo-stacked.svg` plus `-light`;
  - `gci-favicon.svg`.
- **Rejected directions:** six-arm spiral pinwheel or blade marks, which read as weapons or pinwheels;
  dashed-ring ("spinner") marks.
- **Rules** (in the kit): clear space = 2 × core diameter; minimum size 24 px or 8 mm, smaller than that use
  the favicon; don't stretch, recolour, add effects or change the tilt.
- **Trademark not checked:** the client must clear it.

**Brand kit:**
- `brand/gci-brand-kit.png` is v1.0, 3200 × 16,638 px, from `brand/brand-guide.html`.
- Sections: logo, colour, type, elements, the eight forms, imagery, rules.
- How to regenerate: `brand/tools/README.md`.
- `brand/imagery/` holds four live-page captures.

**Design rules the build follows:**
- one luminous object;
- accents rationed;
- **no invented telemetry** (only true numbers: 6 councils, 33 programmes, section index, scroll progress);
- text holds still while the form moves;
- long holds, short moves;
- one gold thread through every section.

---

## 9. How to run, build, deploy (Windows specifics)

- Install: `bun install`. Dev: `bun run dev` (http://localhost:3000), or `preview_start` with name
  `gci-dev`. Build: `bun run build`. Typecheck: `bun x tsc --noEmit`. Use `bun x`, not `bunx`,
  in Git Bash.
- **Stale dev server gotcha:** if a new dev server exits with "Another next dev server is already
  running", an old `next dev` from this folder is still alive, and it can hang. Find the
  node processes whose command line contains `next` and `GCI` (PowerShell `Get-CimInstance
  Win32_Process`) and stop them before restarting.
- **Browser-pane gotchas** when checking WebGL:
  - the pane must be visible (hidden panes render a zero-size canvas);
  - emulate 1440 × 900 for desktop checks and click the gate button via JS;
  - capture scroll positions with `window.scrollTo(0, innerHeight*n)` plus a ~1.5 s wait.
- **Deploy (automatic):**
  - Vercel project **`gci-website`** in scope **`creatorzorgan-7811s-projects`**
    (project id `prj_brejLReXyK280xCM2OTiUVqsJTQH`, Hobby plan, region iad1, Node 26.x, Next.js preset);
  - Git-connected to `creatorzorgan/gci-website`, production branch `main`.
  - **Every push to `main` deploys to production**, ~20–30 s.
  - Production alias: **https://gci-website-gamma.vercel.app** (public).
  - Per-deployment URLs (`gci-website-<hash>-creatorzorgan-7811s-projects.vercel.app`) sit behind
    Vercel login (Standard Protection, `all_except_custom_domains`). That's fine; the user chose a
    public main link.
  - **`gci-website.vercel.app` is NOT ours** (an unrelated company). Never give that link.
  - **Vercel CLI** 65.15.0 is installed globally and logged in as `creatorzorgan`. Useful commands:
    - `vercel ls gci-website --scope creatorzorgan-7811s-projects`
    - `vercel project inspect gci-website --scope creatorzorgan-7811s-projects`
  - The Vercel MCP connector, if present, is a **different account** (team Geovitas-iRaise) and
    cannot see this project. **Never create a GCI project in Geovitas-iRaise.**
- **Brand assets:** see `brand/tools/README.md`. Logo outlines need Python with fontTools and brotli
  in a venv. Renders use headless Chrome at `C:\Program Files\Google\Chrome\Application\chrome.exe`.
  ffmpeg is installed.

---

## 10. Verified, not verified, known issues, open questions

**Verified:**
- typecheck and production build pass;
- full desktop walk-through at 1440 × 900 (gate, hero, thesis beats, councils intro dive,
  Council I–VI, ESG, legal);
- mobile 375 px hero and thesis, no horizontal overflow;
- index drawer opens and closes with Escape;
- content counts on the page (6 councils, 33 programmes, 3 mandates, 3 clauses);
- PDF text match;
- live site serves the latest commit, gate and galaxy working, no console errors.

**Not verified yet:**
- `prefers-reduced-motion` mode (implemented: static forms, no warp or glitch; never tested);
- real-device frame rate (only checked on the user's RTX 3050 laptop), mid-range phones, Safari;
- the pointer **hold** gesture on the gate (only Enter/keyboard path tested);
- Prev/Next buttons and the council rail clicks;
- full mobile pass beyond the hero and thesis;
- desktop widths between 1024 and 1366 px, where the hero labels may crowd or clip;
- Lighthouse and bundle size.

**Known issues:**
- **Confidentiality.** The brief restricts access to secretariats and underwriters, but the repo
  and the live site are both public, and the gate is cosmetic. The user knowingly chose this.
  Real access control is still needed before sharing widely (section 12).
- On mobile the galaxy lobes run faintly behind the hero text.
- The galaxy tile in the brand kit shows a cyan outer edge that the live galaxy doesn't have.
- The pane's hot reload once threw a transient `GciMark is not defined` between two edits;
  not a real bug.
- The plan said one shared clock (Lenis → Motion → R3F `advance`). The build uses the fallback:
  the canvas runs its own loop and reads scroll from the store.
- The plan said the gate panel would morph into the header; it fades instead.

**Open content questions for the client:**
1. Hero and thesis headlines are **DRAFT** (marked in `content/briefing.ts`).
2. "Section 8 Apex Corporate Node" vs the legal notice's "**Proposed** Section 8 Apex Node":
   confirm incorporation status.
3. Council I items 5 and 10 are near-duplicates (both metamaterial shielding and cloaking). Item 10 is
   titled "Metamaterial Acoustic & EM Lattices" from the user's prompt, while the PDF calls it
   "Metamaterial Electromagnetic Shielding & Cloaking".
4. The logo needs trademark clearance before official use.

---

## 11. How this user works (follow these)

- **Research before plans:** they expect live, frame-by-frame breakdowns of reference sites and a
  choice of direction before any plan. Shallow research was rejected.
- **Understanding before big changes:** for a big new direction they want "what you understood"
  first. When they then say "go ahead and start executing", execute end to end without further
  check-ins.
- **Ask before outward actions:** each GitHub push needs a fresh yes (they have said yes twice).
  Deploys happen automatically on push. Ask before changing Vercel settings.
- **Deploy target is fixed:** only `creatorzorgan-7811s-projects/gci-website`.
- **Quality bar:** "jaw dropping", Apple/Awwwards level, but sober and credible for government
  readers. Keep the six council forms and the galaxy system; don't reintroduce the crystal.
- **Plain language:** they want links, screenshots and clear status; they often check from their
  phone (images over 8000 px won't upload there; send scaled copies).

---

## 12. Next session: proposed work, in recommended order

Present this list and let the user pick. Suggested order:

1. **QA pass on what's untested** (small, high value). Covers:
   - reduced-motion mode;
   - gate hold gesture;
   - Prev/Next and rail clicks;
   - desktop widths 1024–1366 px (hero labels);
   - full mobile walk-through, including councils list, ESG, legal and drawer;
   - Safari/iOS if the user can test;
   - a Lighthouse run.
   
   Fix what breaks, then push (with permission).
2. **Real access control** (needed because the content is marked confidential and the site is public).
   Options, ranked:
   - (a) a passcode gate served by Next.js middleware, where the briefing HTML isn't sent until a
     valid code is entered (needs a server runtime, which works on Vercel);
   - (b) per-recipient invite links with logging;
   - (c) Vercel Password Protection, which is not on the Hobby plan.
   
   Also decide whether the GitHub repo should become private.
3. **Client copy sign-off:** get answers to the 4 open questions in section 10, then update
   `content/briefing.ts`.
4. **Plain reading mode:** a no-animation version of the full briefing, one click away, for sceptical
   readers. Suggested, never requested.
5. **Brand kit extensions** (only if wanted):
   - PNG exports of the logo at standard sizes;
   - an Open Graph / social share image (currently none) using the galaxy and logo;
   - a one-page PDF version of the kit;
   - letterhead and slide templates.
6. **Galaxy polish ideas:**
   - captions that build word by word with gold key words, as in the reference video;
   - a closing "pull back to the opening frame" at the legal footer;
   - fixing the brand-kit tile colour.
7. **Custom domain** on Vercel if the client has one (it would also be exempt from preview protection).

---

## 13. Where everything lives (nothing else survives the deleted chat)

- **Repo:** `C:\Projects\Clients\GCI` → GitHub `creatorzorgan/gci-website`.
  - Commits: `f7cdbd6` first draft · `8ec3304` brand guide v0.1 · `7dfd200` galaxy + logo + kit v1.0.
- **This handoff:** `HANDOFF-2026-11-13-friday.md` (repo root).
- **Full plan and research log:** `docs/2026-11-10-master-plan-and-reference-research.md`.
  It includes the approved plan, the "what the research changed" list and the per-site notes.
  The original sits in `C:\Users\ASUS\.claude\plans\`.
- **Brand tools:** `brand/tools/` (logo builder, form exporter, render instructions).
- **Claude memory for this project** (auto-loaded by Claude Code in this folder):
  `C:\Users\ASUS\.claude\projects\C--Projects-Clients-GCI\memory\`. Files:
  - `gci-portal-next-session.md`
  - `gci-vercel-target.md`
  - `reference-research-depth.md`
  - `browser-pane-webgl-capture.md`
- **Source brief:** `C:\Users\ASUS\Downloads\Approved Draft PMO (1).pdf`.

When this file was written, `HANDOFF-2026-11-13-friday.md`, `docs/` and `brand/tools/` were **not
yet committed**. Check `git status`, and ask the user before committing or pushing; pushing
deploys and publishes them.
