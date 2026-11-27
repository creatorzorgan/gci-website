# 3D and scrollytelling research for the white, dark blue and gold portal (27 Nov 2026)

Why: Kiran asked for a lighter palette (white, dark blue, gold) and more 3D in the sections.
Every site below was opened live in Chrome at 1440 wide and stepped through with real wheel input
or `scrollTo` in small steps. Earlier deep dives of Hubtown, Shopify, Igloo, Palantir and others
are in `2026-11-10-master-plan-and-reference-research.md`; Hubtown and Shopify were re-checked
today and still match those notes.

## 1. Lusion (lusion.co): light page, dark 3D panel

- **Stack seen:** three.js r158, 3 canvases, virtual scroll; Aeonik + IBM Plex Mono; 20 `.buf`
  meshes (`cross.buf`, `line_reel.buf`, astronaut parts), matcaps (`white_matcap.jpg`,
  `matcap.exr`), 38 `.webp` thumbnails **in pairs: `home.webp` + `home_depth.webp`**, 16 `.ogg`
  sounds, SMAA.
- **f0:** pale lavender page `#F0F1FA`. Rounded dark panel holds a pile of glossy blue, white and
  black "cross" tubes that tumble with physics. Plus-sign ticks mark a grid under the panel.
- **f1-f3:** the panel scrolls away normally. Headline "Bold Ideas, Brought to Life" rises line by
  line, each line clipped from below.
- **f4-f6:** a thick blue 3D tube **draws itself along a path** as you scroll, looping behind
  the headline and the paragraph. The paragraph's words go from grey to ink in reading order.
- **f7-f9:** the showreel card enters **bent like a sheet of paper** (a WebGL plane warped by
  scroll speed), flattens, then grows to near full width with "PLAY REEL" over it.
- **f10+:** "Featured Work". Two-column cards that tilt and bend as they enter and settle flat
  when scrolling stops. Titles roll in letter by letter; labels scramble ("DEVELOPMEL#&XF")
  before resolving.
- **Takeaways for GCI:** a 3D ribbon that draws itself down a white page; cards that bend with
  scroll speed; depth-map thumbnails (photo + depth image = cheap real 3D parallax); line-by-line
  grey-to-ink text.

## 2. Cartier Watches & Wonders 2026: 3D rooms, white reading layer

- **Stack seen:** three.js r183, one canvas, page ~2.8 viewports, Nuxt; sound toggle. (Earlier
  measurement: 70 MB in the first 8 s, so far too heavy to copy as is.)
- **f0:** warm pale room, paper-and-copper screens, light shaft, thin serif display title
  "WATCHES & WONDERS", round arrow button.
- **f1-f2:** the camera drifts forward; the room swaps to a dark pavilion. Room 1 "Tailored
  crafts serving one form": a curved screen with a landscape, gold and silver cylinders,
  silhouetted craftspeople at benches, the watch floating at centre. Dot index at the right.
- **Inside a room:** small scrolls only turn the watch and dolly the camera (a long hold). A
  bigger scroll moves on to the next room. Room 2 "The eye of the jeweller": stone cliffs, sky,
  gold watch. **Every room has the same layout:** title top centre, object centre, people at
  benches, EXPLORE at the bottom.
- **EXPLORE:** switches to a **white editorial page** (`#F5F5F5`): turntable product shot with a
  360° handle, small serif caption, very wide thin capitals "THE EYE OF THE JEWELLER", serif body
  that fades in grey to ink line by line, then a full-bleed photo that grows from inset to full
  width while the product zooms. A close button returns to the room.
- **Takeaways for GCI:** one fixed composition per council, holds where only the object moves,
  and a dark 3D room that opens into a white reading page. That last one is the exact
  dark-blue/white mix proposed for GCI.

## 3. Lando Norris (landonorris.com): light hero, colour journey

- **Stack seen:** three.js r174, Lenis, Webflow + jQuery, 21 canvases, 18 viewports, Mona Sans +
  Brier (serif) with MSDF versions for WebGL; GLBs `helmet-21.glb`, `disco-02.glb`,
  `tracks-06-test.glb` (Draco); two studio HDRs; the portrait is **a photo split into
  `diffuse/depth/normal/alpha/shadow.webp`**, so it can be relit and given depth; 8 Rive
  files (`page-transition.riv`, `signature.riv`, `circuits.riv`...).
- **f0:** off-white page, faint topographic contour lines, portrait centre. Moving the cursor
  **reveals the 3D helmet around his face through a soft mask** that follows the mouse.
- **f1:** the portrait shrinks into a card; the page turns dark olive; two marquee rows of huge
  text slide in opposite directions behind it.
- **f2:** a neon signature draws itself across the card (Rive).
- **f3-f4:** statement headline in big grotesque capitals with **key words swapped into an italic
  serif in the accent colour** ("REDEFINING", "WINS", "LEGACY").
- **f5-f7:** a scattered photo collage moving at different parallax speeds. **The page background
  drifts from dark olive to grey to cream** as you go.
- **f8-f9:** "ON TRACK / OFF TRACK" with 3D helmet and portrait cut-outs at the edges, then a
  black helmet gallery in chamfered-corner cards.
- **Takeaways for GCI:** a cursor-revealed 3D layer, a background colour that changes per
  chapter (lets the site be white without losing drama), accent words set in a second typeface,
  and depth/normal-mapped photos.

## 4. Hubtown (hubtown.co.in): re-checked

Glowing cube over dark water inside a chamfered frame; left rail of six chapters; scrolling lifts
and tilts the cube toward the camera; the chapter change dives into a glowing river ("We lead the
way in development"). Same as the 10 Nov notes. All dark, so for GCI it gives structure, not
palette.

## 5. Shopify Editions Spring '26: re-checked

Particle forest with a ring of curved 3D type ("Everywhere") that turns as you scroll; a chapter
pill at the bottom; the ground curls up, a radial zoom-blur carries you into "Agentic"; then
normal dark sections. Same as the 10 Nov notes.

## 6. Codrops: "Building Seamless 3D Transitions with Webflow, GSAP, and Three.js" (Mael Ruffini, 18 Mar 2026)

- One Three.js scene that never reloads. Objects sit along the X axis and **the camera slides
  between them** (`gsap.to(camera.position, {x, duration: 2, ease: 'expo.inOut'})`) while
  SplitText lines leave upward and the next ones enter from below.
- **`ShadowMaterial` plane:** invisible except where shadows fall, so 3D objects cast real soft
  shadows **onto the white HTML page behind the canvas**. The canvas uses `mix-blend-mode:
  multiply` over a paper texture, so objects read as printed on paper.
- Cursor tilt with lerp (ease factor 0.08); `gsap.matchMedia` for reduced motion; pixel ratio
  capped at 2; Draco GLBs.
- **Why it matters:** this is the cleanest recipe for 3D on a white page.

## 7. Codrops: "Building a Dual-Scene Fluid X-Ray Reveal Effect in Three.js" (Cullen Webber, 23 Mar 2026)

- Two copies of the scene: solid, and an X-ray version (skeleton with a glowing material). A
  mouse-trail canvas becomes a fluid simulation (ping-pong feedback), and that fluid is the mask
  that blends the two. TSL / WebGPU, with WebGL possible.
- **Why it matters:** move the cursor over a solid object and see its insides. For GCI: a river
  city that shows its sensors, pipes and aquifer wells under the cursor.

## Libraries confirmed

- GSAP 3 + `@gsap/react` (free since the Webflow takeover, all plugins: ScrollTrigger, SplitText).
- drei (already installed): `View`, `MeshTransmissionMaterial`, `Environment`, `Lightformer`,
  `Float`, `Instances`.
- Rive (Lando) for small UI animations; optional.
- Not needed: Barba (single page), r3f-scroll-rig (clashes with Lenis).

## Ideas brainstormed from this (see the chat for the shortlist and the pick)

Whole-site concepts: **A** The Charter Unfolds (a 3D dossier whose pages become scenes);
**B** The Rotunda (a white marble hall with six council alcoves, after Cartier); **C** Blueprint to
Built (every object starts as navy line work on white and becomes solid gold and stone as you
scroll).

Section devices: gold seal medallion hero; 100-initiative constellation; X-ray city for Part III;
six check-and-choke valves; seven-column colonnade for Part IV with the Silicon Seedling as a
growing crystal; wax-seal stamp on the statute; background colour journey; shadows on paper;
depth-map photos; bending cards; a self-drawing gold ribbon; grey-to-ink text; chapter pill;
Explore opening a white editorial layer.
