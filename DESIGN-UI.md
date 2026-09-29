# Earth Exports — UI Design (Cosmic Voyager / Deck 01 · WILD)

**House:** EE-OH-0001 · Ohio Outpost // Sol-3  
**Ship chrome:** Cosmic Voyager CV-OH-01 · Deck 01 (family with Holotable — separate app)  
**Stack:** Static HTML / CSS / JS  
**Doc:** DESIGN-UI.md · 2026-09-24 (WILD restyle)

## Intent

ONE site, two faces. Same pages, same copy spine — the chrome tilts **hard**.

This pass is intentionally **not** a token swap. PUBLIC must read as a lived-in
**collector-traveler freighter lounge** aboard Cosmic Voyager: Fresnel viewport,
hull frame, ship-console chips, bay doors, Helion gems, propagation canisters.
Side-by-side with the prior subtle CV pass (or the old lunar diner) should be obvious.

### 1. PUBLIC (default) — Cosmic Voyager passenger / trade lounge

Lived-in industrial sci-fi: worn hull panels, warm practical lamps, stenciled hazard marks, friendly utility-automaton energy. All names, ships, species and designs are original (no franchise references).
Not sterile. Not a lunar diner. Not corporate SaaS dark.

| Trait | Public look |
|-------|-------------|
| Atmosphere | CSS starfield · Helion / viewport glow · warm practical washes |
| Chrome | Ship's log cargo-feed ticker (`js/cargo-feed.js`, in-world fiction) replaced the ship-console chip strip; EE-OH-0001 is stamp-only |
| Hero | Full hull **viewport frame** + Fresnel glass, stamped house plate, floating cargo tags, Helion gems, propagation canister |
| Type | Outfit (display) + DM Sans (body). Mono for meta chips / console |
| Cards | Bay-door tiles (handle rail + latch) · cargo-crate shelves |
| Zones | Flavor chips: Shuttle Bay / Observatory / East Lounge / Bridge / F.R.A.N.K. |
| Accents | Peacock teal + hazard orange **recognizable**; Helion violet crystal EXTENDED |

**Not:** lunar diner, peach booths, scare banners, conspiracy tone, Holotable rebrand,
Helion renamed to Holotable, military ops, sterile SaaS.

### 2. OUTPOST (soft reveal) — Ship trade console

Amber phosphor CRT pushed further: scanlines, boot lines, yellowed ink, hazard rail,
mono shell prompts (`ee@ohio$ …`). Merchant / flea energy — **not** military, **not** conspiracy.

## Home scene: Earth arc + sun ⇄ UFO (explicit tabs only)

- **Scene (photoreal, WebGL):** `js/earth-scene.js` (ES module) draws into `canvas.scene-gl` inside `.scene` (540px tall on desktop, 520px ≤900px, 480px ≤640px). It uses three.js r186, vendored locally in `js/vendor/` (MIT, `three.LICENSE`; no CDN). The Earth is ray-traced per pixel in a full-frame shader: a sphere of r=1050 whose limb sits 300px down the scene, so only the top arc shows. It is shaded with NASA imagery:
  - **Day:** Blue Marble: Next Generation, July 2004 (NASA Earth Observatory, record 74092).
  - **Night:** Black Marble 2016 city lights (NASA Earth Observatory / Suomi NPP VIIRS, record 144898).
  - **Clouds:** Blue Marble cloud layer (record 57747), plus shader fbm detail.
  - **Shading:** Lambert day side, then a terminator into a true black night side, where city lights show only in darkness. Also sun-tinted twilight, ocean specular glint, air-mass haze, fresnel atmosphere rim and outer glow, and the sun cresting the limb (core, corona, short flare, soft rays). ACES tonemap.
  - **Textures:** cropped to the North America band (lon −175…−15, lat 5…80) in `assets/earth/`: `earth-day.jpg`, `earth-night.jpg`, `earth-clouds.jpg`, ~1.4 MB total. They lazy-load after `window.load`.
- **Framing:** orthographic camera with height-fit framing (1440×540 world on desktop, 780×880 on mobile). Wide screens show more space at the sides and never zoom into the title.
- **Saucer:** a procedural PBR mesh.
  - Lathe hull in brushed metal (MeshPhysical with a roughness map and panel-seam bump), a darker belly and a smoked glass dome over Helion crystals.
  - 20 emissive rim lights with halos, violet under-ring and belly glow, and an additive shader tractor beam that fades out before the bottom edge, so it is never clipped.
  - Reflections come from a PMREM environment built from the same world: black space, blue earthshine from below, sun and soft panels.
- **Morph (UFO tab, 2.8 s, reversible):**
  - The globe spins to its night side (spin 83°→101°) and the sun direction swings behind the planet, so the sun sinks and dims to nothing.
  - City lights brighten and pulse. Then 60 particles sampled from the brightest real Black Marble pixels lift off and converge along curved paths into a ring.
  - The ring lands exactly on the saucer's rim lights while the hull emerges from darkness. The Earth sinks and fades, the beam switches on and the saucer bobs.
  - The Earth tab plays the same timeline backwards: lights disperse back into cities, the globe turns to day and the sun rises.
- **Fallback / reduced motion:**
  - `<picture>` static renders of the same scene: `assets/earth/hero-earth.webp` / `hero-ufo.webp` (4096×864, height-fit) and `-m` variants for ≤640px.
  - These show while textures load, when WebGL is unavailable, and always under `prefers-reduced-motion`, where the tabs give a 0.6 s crossfade and the WebGL scene never boots.
- **Performance:**
  - Pixel ratio is capped at 1.75.
  - The render loop pauses when the scene is offscreen (IntersectionObserver) or the tab is hidden.
  - Home page transfer is ≈2.6 MB total, including three.js (~765 KB minified) and textures.
  - QA hook: `window.__eeScene` with `set(p)`, `release()`, `png()` and `?capture=1`.
- **Credit:** "Earth imagery: NASA …" in the home footer (`.nasa-credit`). All NASA imagery is public domain.
- **Tabs:** the `role="tablist"` overlays the scene. The Earth tab is on the left edge (teal) and the UFO tab on the right edge (orange + Helion). They use `aria-selected`, roving `tabindex`, and Left/Right/Up/Down/Home/End. The overlay itself has `pointer-events:none`, so only the tabs switch state; nothing on the scene is clickable.
- **Mobile (≤640px):** the WebGL scene switches to a 780×880 world so the arc keeps its curvature. The tabs sit left/right between the title and the planet, and the saucer sits below the tabs with the beam fully in frame.
- **Shelves (tabpanels):**
  - **Earth:** Herbs & living greens, Cups & mugs, Tea tins & pantry goods, Candles & warm practicals. All are badged "Placeholder · not stocked yet", with no prices or SKUs and no links.
  - **Space:** Sector 01 alien dossier cards & games, Sector 02 field relics & artifacts, Sector 04 3D-print schematics/STLs, and 3D-printed props & minis (placeholder, links to Sector 04).
- **Header echo:** a small planet/saucer icon and "· From Earth / · From Space" (`html[data-side]`, `sessionStorage['ee-side']`). The Sol-3 logo is always kept.
- **Outpost face:** the WebGL canvas and fallbacks are sepia/amber filtered, with scanlines.

## Clarity pass (2026-09-25): newcomer-first

Goal: a first-time visitor knows in about 5 seconds that this is a small Ohio shop selling sci-fi props, card games and STL files, without losing the cool factor. Backups: `*.clarity-bak` (all HTML, `css/styles.css`, `js/site.js`, `js/earth-scene.js`, this file).

- **Plain "what this is" strip under the hero** (`.what-is`): “Earth Exports is a small Ohio shop making sci-fi 3D-printed props, alien card games and printable STL files, all set in our own sci-fi story world.” It is a *description*, not a tagline. The primary tagline stays penned/retired, and “Artifacts & Blueprints for the Deep Frontier.” stays the soft secondary under the H1.
- **CTAs use only existing pages:** See cards & games → `sector-01.html`, Browse STL files → `sector-04.html`, Find us at the flea → `outpost.html`. “Etsy · coming soon” is a non-link placeholder (`aria-disabled`, dashed) because there is no real shop URL yet. Swap it for a real `<a>` when the listing exists.
- **Top line (every page):** `.lounge-note` now reads “Sci-fi props, card games & 3D-print files · made in Ohio · original fiction, real goods · local flea”.
- **Nav (every page):** plain labels, with the sector number kept as a small chip. Order: 01 Cards & Games · 02 Props & Relics · 04 STL Files · Alien Index (archives) · Find Us (outpost) · About (manifest) · Contact. Page file names are unchanged. Inner-page eyebrows now say in plain words what the page is.
- **Hero tabs:** “Earth goods · Mugs, herbs (soon)” / “Space goods · Props, cards, STLs”. Same tab a11y. The eyebrow “Cosmic Voyager · Deck 01 · Observatory viewport” was removed from the hero (the lore lives in The Story).
- **Shelves:** Earth-shelf note points newcomers to Space goods, and the placeholders stay badged with no prices/SKUs. Space tiles keep the lore name (Sector 01/02/04) with a plain H3 and one-line plain copy; the “BAY ·” prefix and the “Crack bay door” CTAs were replaced with plain CTAs.
- **How it works:** three short steps (Made in Ohio · With a story · Grab one).
- **The Story** (`details#story`, collapsed by default) now holds the lore: Cosmic Voyager/lounge fiction, house-fiction stamps note, flavor chips (Helion/ringheart), zone strip, F.R.A.N.K., Vex marginalia and the Manifest link. The fiction disclaimer stays in every footer.
- **Mobile:** hides the “Aboard…” console label and the Helion chip, shortens the top note, moves the tabs up, and puts the CTAs in a 2×2 grid.
- **Favicon:** Sol-3 mark SVG on all pages.
- **Scene polish:**
  - Sun glare veil removed (wide glow terms cut, rays shortened), so the sky behind the title is near page-black.
  - Saucer hull is now chrome: metalness 1, roughness 0.1, a cool env map with hard studio strips/horizon band, cooler key light, and dimmer rim point lights.
  - Mobile saucer is smaller and lower (scale 212, y −84) with clear space under the tabs.
  - Clouds get a shader unsharp mask, a crisper threshold, finer detail noise and anisotropy 16.
  - Static fallbacks were re-rendered.
- **Word counts (home, visible on load):** 496 → 374. Lore/booth copy visible below the shelves: 177 → 57 (the rest sits in The Story). The intro strip grew from 17 to 51 words on purpose (the plain explanation).
- **QA:** `/workspace/ee_tabtest.py` covers WebGL ready, tabs/keyboard/click-elsewhere, full morph and reverse, The Story, internal links, no external URLs, reduced-motion crossfade, no-WebGL fallback, and zero console errors on desktop and mobile.

## Stamp-only house number (2026-09-25)

Per the year-one gate, **EE-OH-0001 appears only on package stamps** (e.g. `ee-package-stamp-ohio-v4.png`), never in site chrome. Backups: `*.stamp-bak`. Removed:
- **Home hero:** the "Merchant House Mark / EE-OH-0001 / Ohio Outpost // Sol-3" plate. The title block moved down (`.scene-title` top 92px desktop / 58px mobile) so there is no gap.
- **Every page:** the orange EE-OH-0001 console chip in the top strip, the EE-OH-0001 tag at the end of the top line, and "· EE-OH-0001" in the footer brand line (now just "Earth Exports").
- **Home:** the proof-bar ending (now "Ohio Outpost // Sol-3") and the meta description.
- **Manifest:** the page `<title>` and the filed-doc meta line (both now "Ohio Outpost // Sol-3").
- **Outpost face:** the console label in `js/site.js` (now "Trade console · amber phosphor · Ohio Outpost // Sol-3").
- A CSS header comment.
- The mobile rule that hid the Helion chip now targets `.chip-helion`, because the chip order changed.

Kept: the "EE-OH" batch stamps on the manifest/contact/outpost/sector-02 hero stamp clusters (batch prefix, stamp graphics, allowed), and "Ohio Outpost // Sol-3" everywhere as the place line. Earth stays the default tab.

## Cargo feed ticker (2026-09-25): replaces the ship-console chip strip

The top strip on every page (the chips reading CV-OH-01 · DECK 01 · HELION SECURE · "Aboard Cosmic Voyager") is now a scrolling **ship's log cargo feed**. Backups: `*.ticker-bak`.
- **Markup:** `.cargo-feed` on all 8 pages: `role="region"`, `aria-label="Ship’s log: in-world cargo feed. Story flavor, not real orders."`, `aria-live="off"`, `tabindex="0"`. It holds a pulsing orange LIVE pill, the label "Ship’s log · in-world feed" ("Ship’s log" only on mobile) and a `.cf-track` with one static entry as the no-JS fallback.
- **Script:** `js/cargo-feed.js` (deferred, no dependencies) holds a 32-entry array, shuffles it on each load and renders it twice for a seamless loop. The CSS `translateX(-50%)` animation runs at about 55 px/s (duration computed from width). It pauses on hover and focus (`:hover`, `:focus-within`). Links are `tabindex=-1`, so the feed adds only one tab stop.
- **Reduced motion:** one static line that swaps entries every 12 s with an opacity fade only (paused on hover/focus or when the tab is hidden). The LIVE dot stops pulsing.
- **Layout:** fixed height (32px desktop / 30px mobile) set in CSS before the JS runs, plus `overflow:hidden; contain: layout paint`, so there's no layout shift or horizontal overflow.
- **Style:** slate gradient bar with teal text. Hazard-orange solid tags for ALERT/INCOMING/OUTBOUND/CUSTOMS, Helion-violet for SIGHTING, teal outline for EARTH-SIDE/ORDER/LOG. Amber in the outpost face.
- **Content rules (ethics + canon):**
  - The feed is in-world fiction and never social proof: no customer names, no real places except Sol-3 / Ohio Outpost // Sol-3, no prices, no "X people bought".
  - Species are the canon Alien Index designations (Vel-Keth, Orrin, Mirenth, Tarn Vessik, Viridane, Husk Consortium, Rhell, Torvann, Pelagra, Ixen, Bracken-Moot, Nul-Sera, Gorruth, Vesper Ring, Kethra Void-Clans, Object 9 embargo). Sectors, galaxies and trader names are invented.
  - Item types map to site categories (cards & games, props & relics, STL files, alien index, Earth-side placeholders); about 14 entries link to sector-01/02/04 or archives.
  - Vex appears once (cargo-threat, kid-safe). No EE-OH-0001. No Sector 03 toys.
- **Plain "what this is" line kept:** the separate bar right under the ticker (`.lounge-note`: "Sci-fi props, card games & 3D-print files · made in Ohio · original fiction, real goods · local flea") on every page, plus the home `.what-is` strip under the hero.
- **QA:** `/workspace/ee_tabtest.py` now also checks that the ticker renders and animates on all 8 pages (desktop + mobile), fixed height, no overflow, no old strip, 25–40 entries, no prices/house number/buyer counts, Vex ≤ 2, pause on hover and focus, the reduced-motion static line, and no console errors.

## Inner pages clarity pass (2026-09-25)
Same philosophy as the home clarity pass, applied to every inner page (sector-01, sector-02, sector-04, archives, outpost, manifest, contact). Filenames unchanged; home/hero untouched. Backups: `*.inner-bak` (8 HTML, `css/styles.css`, this file, `PREVIEW.md`).

**Pattern (top to bottom):** eyebrow (lore + plain) → plain `h1` → `p.lead.page-what` one-liner (what the page is / what you can get) → `.cta-row.hero-cta` next-step buttons to existing pages only (Etsy = non-link "coming soon") → stamp row → content cards (`.cargo-crate`: lore name in the slot, plain title, one plain line, `placeholder-badge` "In the works") → "Words you'll see" `dl.terms` glossary → closed `details.story#story` "Ship's log" (deep lore, query consoles, ledger lines) → bottom CTA row. Ticker + `.lounge-note` unchanged.

| Page | New plain title | Notes |
|---|---|---|
| sector-01 | Cards & Games | Starter deck / Numbered special deck (existing ranges relabelled "Planned price") / MANIFEST game; alien list → archives; defines Dossier, AFC, statuses; ledger console → Ship's log |
| sector-02 | Props & Relics | 4 "Relic 0X" crates with plain titles; defines Relic, Weather language, EE-OH stamp; CTAs waitlist + STL files |
| sector-04 | STL Files | Personal / Commercial license crates, "Every file comes with" list; defines STL, Schematic, License |
| archives | Alien Index | Status legend; same 16 canon species; "Archive ID (card ID)"; SQL line → Ship's log; phones hide row # so the table fits |
| outpost | Find Us | Flea booth ("dates coming soon"), local pickup, custom builds; "same city" line removed |
| manifest | About Earth Exports | "What we make" cards → 01/02/04, "Why it looks official"; fiction disclaimer kept |
| contact | Contact Us | Plain labels/options, "Send message", `form#query`; short Ship's log (comms-desk lore). shop inbox `earthexportsshop@gmail.com`: "Write to us" is a direct mailto; the form (no backend) opens a prefilled mailto via `js/contact-form.js`, plus an "Or email us directly" line |

**Word counts** (main visible / incl. collapsed / above fold @1440×900), before → after: sector-01 259/260/86 → 222/338/86 · sector-02 162/161/126 → 235/279/99 · sector-04 129/129/72 → 210/256/100 · archives 168/170/80 → 215/265/97 · outpost 124/149/87 → 145/232/126 · manifest 249/252/129 → 212/381/82 · contact 68/71/35 → 110/147/53. Lore moved out of view; visible words rose on the thinner pages because of plain card lines + glossaries.

**QA:** `/workspace/ee_tabtest.py` now also loads all 8 pages (desktop + mobile) and checks: what-line, ≥1 CTA, closed story, footer fiction disclaimer, no `EE-OH-0001` in visible text, no horizontal overflow, no console/page errors or 4xx; every internal href + `#anchor` across the site resolves; no external URLs. CSS additions live at the end of `styles.css` under "INNER PAGES CLARITY PASS".

**Left alone:** hero scene, Earth default tab, index.html, filenames, ticker, footers, stamp chrome, existing legitimate price ranges (relabelled, none added). (Shop email set 2026-09-25: see contact row.)

## Story layers (2026-09-25): optional, for explorers
Flavor sits collapsed or off the main path, so first-time clarity is unchanged. Backups: `*.story-bak` (all pages, `js/cargo-feed.js`, `js/site.js`, `css/styles.css`, docs). CSS lives at the end of `styles.css` under "STORY LAYERS".

- **Provenance cargo tags:** every product card (home Earth + Space shelves, sector-01/02/04 crates; 17 cards) ends with a closed `details.prov-tag` "Cargo tag": *Recovered:* / *Came aboard:*, 1 line each, original place names (Ember Veil, Glass Tides, Lantern Reach, Scrapfall Belt, Veil Hollow, Cinderhome, Duskhold). Outpost/About/Contact cards are navigation, not products, so no tags.
- **Vex transmission (easter egg):** `js/vex.js` on every page. Trigger: click the **Helion vault** crystal chip in the footer 4 times within ~4 s, or type **RINGHEART** anywhere outside a form field. ~6.6 s: soft glitch (1 s) → Vex: “Where’s my crystals?” → “Transmission cut by the bridge” → “Systems nominal · Helion vault still locked”. Then the ticker gets a CUSTOMS line (`__eeFeed.push`). Photosensitivity: no flashes; only a slow scanline drift and a 3-step page shift over 1.2 s (<3 changes/s). Reduced motion: calm fade card, no glitch/drift. Esc or the Close button dismisses; focus moves to Close and returns afterward. Vex portrait is an original, friendly-grumpy hatted collector (no helmets/visors).
- **F.R.A.N.K. 404:** `404.html` (root-absolute links so it works at any path; `noindex`). Original bartender-automaton SVG (boxy head, pill visor, bow tie, cup + rag). Buttons: home, Cards & Games, Props & Relics, STL Files. `python -m http.server` can't serve a custom 404, so use `python3 dev-server.py [port]` (serves 404.html with status 404). Netlify and Cloudflare Pages use `404.html` automatically. Hosting under a sub-path (e.g. a GitHub Pages project site) would need the absolute links adjusted.
- **Propagation canisters:** the 4 Earth-shelf placeholders show glowing life-support canister SVGs (herbs sprout, mug + steam, tea tin + leaf, candle flame); gentle bubble/glow animation, off under reduced motion. Badges now read "Coming soon · placeholder". The herbs tag nods to a plant growing in a broken fuel cell.
- **Captain’s log / News:** `captains-log.html`, linked as **News** in the header nav (after Find Us) and footer on every page; on mobile it lives in the Menu. Real Earth dates + Trade Year 2076 labels. Honest entries only: dossiers open, shop email live, site built (preview, not public), card decks in the works, props/STLs in progress, flea dates coming soon. Closed "captain’s private shelf" holds the Deck 01 lore (collector captain, careful sales, Vex wants the Helion crystals, F.R.A.N.K.).
- **Alien Index dossiers:** `js/dossiers.js` turns each of the 16 species names into a button that opens a native `<dialog>`: file name, first contact, status, homeworld (original flavor), short traits, buys/sells, trade rating (C1–C4 explained), field note. Data condensed from AFC-SB-01; no new species. Enter/Space opens, Esc/✕/backdrop closes, focus returns to the name.
- **Pinned note (sector-04):** closed `details.pin-note` "Quick Start Guide to Fixing Ships (the dock mechanic’s version)", 8 scrawled rules on a pinned paper card. No character name.
- **IP audit:** replaced "Shields up" → "Hatches sealed" and "Halo of Tesk" → "Crown of Tesk" (ticker), "trade federation" → "trade league" (Husk dossier), and the franchise list in this doc’s mood line. Test suite scans all page text + ticker for a banned-term list.
- **QA:** `/workspace/ee_tabtest.py` adds: News link on every page (desktop + mobile menu), banned terms, 17 closed cargo tags, canisters + badges, pinned note, dossiers (16, keyboard Enter/Space/Esc, focus return, fit on mobile), Vex (3 clicks no, 4th yes, RINGHEART, Esc, no trigger inside form fields, auto-end, ticker CUSTOMS line, reduced-motion calm, mobile fit), 404 (real 404 status via dev-server, styled at nested paths, no errors). New pages are in the ticker and every-page checks.

## Species rename (2026-09-26)
IP clearance, approved by Jonathan: **Sylvaxi → Viridane** (AFC-05.00) and **Kael Drax → Tarn Vessik** (AFC-04.00) across pages, dossiers, ticker, provenance tags and the AFC-SB-01 bible. Traits, IDs and status unchanged. Kael Brask was rejected ("Brask" is Destiny's Andal Brask; "Kael" echoes Kael'thas). Both old names are in the ee_tabtest banned-term scan. Backups: `*.rename-bak`.

## Declutter + images (2026-09-26)
Jonathan's phone feedback: "everything feels scattered… you click on one thing and it has a link to another thing." Goal: calm, clear, shop-like.

**Removed:** Transit/Currency/Shelf/Secure lounge chips, the Deck 01 zone-chip box, the Credits footnote, the CAREFUL SALES callout and READ THE MANIFEST button (home story), the hidden status bar, the home proof bar, 01/02/04 nav codes, stamp rows and hero marginalia, all in-card cross-links (`.crate-link`), duplicate bottom CTA rows, the Alien Index query console + table + SQL, the sector-01 alien list/ledger console, News "captain's notes" and per-entry links, the footer tip-jar line, the 4th "Printed props" home tile.
**Each page does one job:** Home = what-is line + shelves (Earth goods default; Space goods = 3 category tiles); category pages = product grid; Alien Index = species grid; About; Find Us; Contact; News.
**Lore:** at most one closed `details.story` per page. Glossaries and sector-04's dock-mechanic note now live inside it.
**Type:** body copy is sans. Mono is kept for tiny accents (eyebrows, `.pc-lore`, badges, log dates).
**Images:** `images/{earth,categories,products,about,species}/*.webp`, all `loading="lazy"` with width/height; `.ph` slots are 4:3 and species are 1:1, both `object-fit: cover`. Placeholder art is original SVG rendered to WebP by `/workspace/story/art/art.py` (label baked in). Swap guide in README.
**Alien Index:** `.species-grid` of `button.species-card.dossier-btn[data-idx][data-img]` (2 columns on phones, 3/4 on wider screens). `js/dossiers.js` binds clicks on the grid; the dialog shows the species image.
**Kept:** Vex egg (Helion vault crystal ×4 / RINGHEART), closed cargo tags on every product card, F.R.A.N.K. 404, ticker (quieter: lower contrast, no pulsing dot, ~32 px/s).
Backups: `*.declutter-bak`.

**Canisters restored (2026-09-26):** at Jonathan's request, the Earth goods shelf uses the original pre-declutter canister shelf cards again (`article.tile.tile-earth`, glowing canister SVGs, "Coming soon · placeholder" badge, closed cargo tag), restored verbatim from `index.html.declutter-bak`. No prices, SKUs or links. The rest of the declutter pass is unchanged. Backups: `*.canister-bak`.

## Launch readiness (2026-09-26): six approved fixes
1. **Plain labels:** no Sector 01/02/04 numbering anywhere customers navigate or decide: titles, eyebrows, meta, contact topics, product labels. "Public filing · Disclaimer" became "Disclaimer", "FILE A QUERY" became "Send us a message", and the STL meta no longer says "licensed fabrication files" or "clearance level". Lore stays inside the closed story sections and cargo tags. Page filenames are unchanged.
2. **policies.html:** shipping/pickup, returns and refunds, damaged or misprinted items, custom orders, privacy (what each form collects) and plain STL license terms. It has a **DRAFT: terms under review** banner and `noindex` until Jonathan approves, and is linked from every footer. The STL page gets a plain license summary that links to `policies.html#stl-license`. The outpost-face `cat LICENSE.md` line is gone.
3. **Forms:** `js/forms-config.js` (`EE_FORMS.CONTACT_FORM_ID` / `NOTIFY_FORM_ID`) with Formspree POST plus honest success and error messages. While an ID is still `YOUR_…`, the mailto fallback is used. Setup steps are in README.
4. ~~**Light home on phones**~~ **Reverted 2026-09-26 (phone follow-up):** the static-WebP + “▶ Play animation” gate and `js/scene-loader.js` are removed. `index.html` loads `js/earth-scene.js` directly again, so phones of every width get the animated three.js hero automatically, exactly as before the launch pass. The only fallback is the one that existed before: reduced-motion (or no WebGL) shows the static crossfade.
5. **Real products first** (*tab part superseded 2026-09-27, see “Real tabs” below*): Home order is now what-is → **What we make** (3 category tiles) → **How it works** → signup → **Coming later from Earth** (the canister shelf cards, byte-identical) → story. The Earth/Space tabs no longer switch shelves. They are two `aria-pressed` hero-view buttons (From Earth · Globe view / From Space · Saucer view) that only morph the scene.
   **Lock superseded:** the earlier "Earth is the default tab" lock is replaced by Jonathan's approval of "lead with real products". The hero still opens on the Earth view, but real products come first on the page.
   Props show **"Price set per piece"** because no per-piece prices exist in canon. The grid note keeps the canon $40–120 first-run band.
6. **Signup:** one "Get notified when the shop opens" form on Home (Formspree `NOTIFY_FORM_ID`, fallback mailto with subject "Notify me"). The repeated "Etsy · coming soon" hero buttons and the "Dates coming soon" badge were removed.
Backups: `*.launch-bak`.

### Phone follow-up (2026-09-26): Earth/Space buttons jump to their goods (*superseded 2026-09-27: the jump is removed*)
Jonathan said on his phone the buttons were "not switching between earth goods and space goods". The gate had made the hero static, and since fix #5 the buttons didn't touch the goods sections. Now:
- The buttons are labelled **Earth goods · Coming later ↓** and **Space goods · What we make ↓** again.
- Tapping one morphs the hero (globe ⇄ night side/saucer), waits for the morph to finish (the globe pauses off-screen), then smooth-scrolls to the matching shelf: Space → **What we make** (`#shop`), Earth → **Coming later from Earth** (`#shelf-earth`). The shelf gets a brief teal/orange highlight (`.goods-flash`).
- Nothing is hidden and the home order is unchanged. The canister cards are byte-identical.
- A scroll, swipe or key press during the morph cancels the jump. Arrow keys only switch the view. Reduced motion jumps without smooth scrolling or animation.
Backups: `*.phone-bak`.

### Real tabs (2026-09-27): Earth goods / Space goods switch the products
**Supersedes launch fix #5's “the buttons don't hide sections” and the phone follow-up's scroll jump.** Jonathan, on his real phone: pressing Space, the button didn't light up, the animation didn't play, and the products didn't switch.
- **Root cause (most likely):** his phone was using a stale cached `js/site.js`. The PC serves with stock `python -m http.server`, which sends `Last-Modified` but no `Cache-Control`, so mobile browsers guess how long to reuse a file (heuristic caching). A pre-launch `site.js` looks for `[role="tab"]` buttons, but the launch-pass `index.html` had `aria-pressed` buttons, so it silently bound nothing: no light, no morph, no switch, and no error. Injecting the old `site.js` into the current page in a test reproduces exactly those three symptoms. The current code worked in iPhone/Android touch emulation and in WebKit, and the PC served files identical to the box. Separately, by design since fix #5 the buttons never switched products, which is the third symptom even with fresh files.
- **Tabs:** `#tab-earth` / `#tab-ufo` are `role="tab"` in a `role="tablist"`, with `aria-selected`, roving `tabindex`, `.is-active` and `aria-controls` → `#shelf-earth` / `#shop` (`role="tabpanel"`, `.goods-panel`). The selected button lights up (gradient + LED). `html[data-side]` drives the hero morph (`earth-scene.js` only follows the attribute), so a WebGL failure can't break the tabs; without WebGL the static fallback crossfades instead.
- **Products per side:** Space shows only **What we make** (3 category tiles: cards, props, STL). Earth shows only **Coming later from Earth** (the canister cards, still byte-identical to the pre-launch version). The other side's panel is `hidden`. Audit: no other product lists on Home. The ship's-log ticker is site-wide story flavor, not a product list, so it stays.
- **Home order:** scene (tabs) → what-is → goods area (the two panels share one slot) → How it works → signup → story. Non-product sections are always visible.
- **Default tab: Space** (real products first). The hero therefore opens on the night side/saucer; tapping Earth goods plays the reverse morph to the globe. The choice is remembered for the browser-tab session (`sessionStorage["ee-side"]`). Links to `#shop` / `#shelf-earth` (e.g. “See what we make”) open the matching tab first.
- **Highlight, no scroll:** the panel that appears gets `.goods-flash` for 1.8 s (orange for Space, teal for Earth). There is no automatic scrolling at all. Arrow/Home/End keys switch tabs too.
- **Small phones:** the Vex chat no longer auto-opens while its box would cover the Earth/Space buttons (it covered both on a 320×568 screen); it waits until they scroll away.
- **Cache:** every local CSS/JS include on every page has `?v=20260927-tabs` (bump it on each change). `dev-server.py` now sends `Cache-Control: no-cache`; use it instead of `python -m http.server` when testing on a phone.
Backups: `*.tabs-bak`.

### Vex early-access chat (add-on to fix #6)
`js/vex-chat.js` + CSS "VEX EARLY-ACCESS CHAT". A small non-modal `role="dialog"` bubble in the bottom-right corner, styled like a friendly black-market DM from Vex (original avatar, smiling). It shows a typing indicator, then *"Psst. Want to see the underground stuff before anyone else?"* with **Show me** and **Not now**.
- **When:** at least 10 s on the site (time counted across pages in the session), then either a random 25–40 s mark or scrolling past halfway. It auto-shows once per visitor (`localStorage["ee-vexchat"]`). It never appears on contact.html or policies.html (the script isn't loaded there). It waits while the visitor is typing in a field, while the RINGHEART/Helion transmission runs, while a dossier is open, or while the mobile menu is open.
- **Show me:** an inline email field (the same Formspree `NOTIFY_FORM_ID` with the "Notify me" mailto fallback). Vex confirms: "Done. You’re on the early-access list. Act natural." **Not now**, ✕ or Esc close it and snooze it for 7 days.
- **Labelled plainly:** the header says "Earth Exports shop newsletter" and the footer line says "The shop’s early-access email list", with a Privacy link.
- **Accessibility:** auto-open never moves focus. Opening it from the footer **Early access** Vex button focuses "Show me", and Esc returns focus to that button. Reduced motion shows no slide and no typing dots. On phones it stays under 40% of the screen height, and the page gets bottom padding while it's open, so nothing stays covered. It's hidden while the mobile menu is open.
- **Separate from the easter egg:** RINGHEART and the 4-click Helion crystal (js/vex.js) are unchanged. Clicking the footer Vex icon never triggers them.
- **Home** keeps the plain "Get notified" box as the non-Vex path.

## Reveal mechanics

| Trigger | Behavior |
|---------|----------|
| Quiet stamp button `EE · ◌` in footer | Toggles face |
| URL hash `#outpost` | Enters Outpost face on load / hashchange |
| `sessionStorage['ee-face']` | Remembers face for the tab session |
| Keyboard `Alt+O` | Toggle |

Implementation: `js/site.js` sets `html[data-face="public|outpost"]`.
Markup uses `.face-public-only` / `.face-outpost-only`. CRT overlay + `.status-bar`
+ `.hazard-rail` are outpost-weighted.

## Brand locks (hard)

- EE-OH-0001 on package stamps only (not site chrome) · Ohio Outpost // Sol-3 · local flea only
- Never prior local-city / YNG strings in public chrome or copy
- Palette anchors: Deep Space Slate `#0B0E14` / `#0D1117`, Sub-Deck Gray `#1C2331`,
  Peacock Teal `#00A896` / `#028090`, Hazard Orange `#F77F00`, Off-White `#E0E6ED`
- Extended OK: Helion `#7B5CFF`, star glow, warm practicals `#C4A574`, cream hull edges
- Keep Sol-3 E/Ǝ logo SVGs in `assets/logos/`
- Invoice founding tagline **RETIRED** — do not use
- Soft OK: *Artifacts & Blueprints for the Deep Frontier*
- Earth Exports = merchant house · Cosmic Voyager = the ship · Holotable = separate game
- Vex / careful-sales = playful marginalia only (kid-safe, not conspiracy)

## Files

| Path | Role |
|------|------|
| `css/styles.css` | WILD two-face tokens + viewport / bay / CRT |
| `css/styles.css.cv-subtle-bak` | Prior subtle CV pass (backup) |
| `js/site.js` | Nav, clock, face toggle, console label flip, tabs |
| `js/earth-scene.js` | Photoreal WebGL Earth ⇄ UFO scene |
| `js/forms-config.js` | Formspree form IDs (placeholders until set) |
| `js/contact-form.js` | Contact + notify forms: Formspree POST or mailto fallback |
| `policies.html` | Shop policies (DRAFT) |
| `js/vex-chat.js` | Vex early-access chat bubble (newsletter signup) |
| `js/cargo-feed.js` | Ship's log cargo-feed ticker (in-world fiction) |
| `js/dossiers.js` | Alien Index fact-file dialog (binds to `.species-card`) |
| `images/` | All product/category/about/species pictures (placeholders; swap guide in README) |
| `js/vendor/three.*` | three.js r186 (MIT), vendored |
| `assets/earth/` | NASA textures + static fallback renders |
| `*.stylized-bak` | Previous stylized SVG scene (index/styles/site.js) |
| `index.html` | Viewport hero + deck map |
| `DESIGN-UI.md` | This doc |
| `PREVIEW.md` | How to preview / sync to PC |

## Accessibility

- Face toggle is a real `<button>` (`aria-pressed`)
- `prefers-reduced-motion`: star drift / LED / Helion breathe / CRT heavy motion off
- Nav keyboard operable; mobile menu uses `aria-expanded`
