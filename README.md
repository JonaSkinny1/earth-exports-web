# Earth Exports — Year-One Website

**House Mark:** Earth Exports · EE-OH-0001  
**Outpost:** Ohio Outpost // Sol-3  
**Stack:** Pure static HTML/CSS/JS. No React, no bundler.  
**UI:** Two faces — PUBLIC Cosmic Voyager / Deck 01 collector-traveler lounge (WILD viewport chrome) + soft OUTPOST amber trade console (`#outpost`). See `DESIGN-UI.md` · preview help in `PREVIEW.md`.


Copy source: `EE-WEB-COPY-v0.1` · Species index: `AFC-SPECIES-BIBLE-v1.0` (public Archive ID / designation / status only).

## Pages

Each page does one job.

| File | Page | Job |
|------|------|-----|
| `index.html` | Home | Animated hero (all screen sizes) with **Earth goods / Space goods** tabs: the chosen tab lights up, the hero morphs, and only that side's goods are shown (Space = What we make, default; Earth = Coming later from Earth), with a short highlight and no scrolling → What we are → What we make (3 category tiles) → How it works → “Get notified” signup → Coming later from Earth (canister shelf) |
| `sector-01.html` | Cards & Games | Product grid |
| `sector-02.html` | Props & Relics | Product grid |
| `sector-04.html` | STL Files | Product grid + what every file includes |
| `archives.html` | Alien Index | Species card grid (tap a card for its fact file) |
| `manifest.html` | About | Who we are, with a photo slot |
| `outpost.html` | Find Us | Flea booth, pickup, custom builds |
| `contact.html` | Contact | Email + prefilled form |
| `captains-log.html` | News | Short updates |
| `policies.html` | Policies | Shipping/pickup, returns, damaged items, custom orders, privacy, STL license. **DRAFT: terms under review** (noindex) until Jonathan approves |

Every page has at most one closed "The story" section for lore fans. Sector 03 is intentionally off the nav (year-one deferral).

## Swapping in real photos

All pictures live in one folder, `images/`. Right now each one is **placeholder art** with
"PLACEHOLDER ART · PHOTO COMING SOON" baked into the picture itself. To use a real photo:

1. Crop your photo to the listed shape (4:3 = e.g. 1200×900; 1:1 = e.g. 800×800).
2. Save it as **WebP** with the **exact same file name** (e.g. `starter-deck.webp`). Most photo apps,
   or squoosh.app, can export WebP. Aim for under ~150 KB.
3. Drop it into the same folder, replacing the placeholder. Refresh the page. That's it: no code edits.
   The "placeholder" label disappears because it was part of the old picture.

Prefer JPG? Save `starter-deck.jpg` next to it and change `.webp` to `.jpg` in that one `<img src>` line.
Optionally update the `alt="..."` text to describe the real photo (it currently says "Placeholder art of…").

| File | Where it shows | Shape |
|------|----------------|-------|
| `images/earth/herbs.webp` · `mugs.webp` · `tea-tins.webp` · `candles.webp` | Home › Earth goods cards (currently the original glowing canister cards, see note below) | 4:3 |
| `images/categories/cards-games.webp` · `props-relics.webp` · `stl-files.webp` | Home › Space goods category tiles | 4:3 |
| `images/products/starter-deck.webp` · `special-deck.webp` · `manifest-game.webp` | Cards & Games cards | 4:3 |
| `images/products/scanner-prop.webp` · `specimen-jar.webp` · `coin-set.webp` · `beacon-prop.webp` | Props & Relics cards | 4:3 |
| `images/products/stl-personal.webp` · `stl-commercial.webp` | STL Files cards | 4:3 |
| `images/about/workshop.webp` | About page | 4:3 |
| `images/species/<name>.webp` (16: `vel-keth`, `orrin`, `mirenth`, `tarn-vessik`, `viridane`, `husk-consortium`, `rhell`, `torvann`, `pelagra`, `ixen`, `bracken-moot`, `nul-sera`, `gorruth`, `vesper-ring`, `kethra-void-clans`, `object-9`) | Alien Index cards + fact file | 1:1 |

**Earth goods note:** those 4 cards use the original glowing canister shelf cards (no photo slot yet). The `images/earth/*.webp` files are ready for when Jonathan wants photos there. Ask to switch those cards to photo cards, or add `<img src="images/earth/herbs.webp" width="800" height="600" loading="lazy" alt="…">` in place of the `<div class="canister …">` block in `index.html`.

Pictures are cropped to fit (never stretched), so a slightly different size still looks right.
Placeholder art is original (made from simple shapes, no people, no borrowed characters).

## Local preview

```bash
cd /workspace/scaffold/earth-exports-web
python3 dev-server.py 8768        # preferred: custom 404 + Cache-Control: no-cache (phones always get fresh files)
# python3 -m http.server 8768 --bind 0.0.0.0   # also works, but sends no cache header, so phones may keep old CSS/JS
```

**Version string:** every page loads its CSS/JS as `css/styles.css?v=20260927-tabs`, `js/site.js?v=20260927-tabs` and so on. After changing any CSS/JS, bump the stamp on all pages so phones fetch the new files.

Open [http://127.0.0.1:8768/](http://127.0.0.1:8768/).

Any static file server works (`npx serve`, Caddy, nginx, etc.).

## Deploy notes

### GitHub Pages

1. Push this folder as the repo root (or `/docs`).
2. Settings → Pages → Deploy from branch → `main` / root (or `/docs`).
3. Site is relative-linked; no base-path rewrite needed if served from domain root. For project sites (`username.github.io/repo/`), either use a custom domain or prepend the repo name to asset paths.

### Netlify

1. Drag-and-drop this folder, or connect the repo.
2. Build command: *(none)* · Publish directory: `.` (site root).
3. Optional `_redirects` not required for multi-page HTML with `.html` links.

### Cloudflare Pages

1. Connect repo or upload assets.
2. Framework preset: **None** · Build command: empty · Output directory: `/` (or leave blank for root).
3. Compatible with Workers/Pages static assets as-is.

## Contact + signup forms (Formspree)

Shop inbox: **earthexportsshop@gmail.com**. Two forms send email:

| Form | Page | Config key in `js/forms-config.js` | Fallback while the ID is a placeholder |
|------|------|-----------------------------|------------------------------|
| Contact form (`#query`) | `contact.html` | `CONTACT_FORM_ID` | Opens the visitor's email app with name/email/topic/message prefilled |
| “Get notified when the shop opens” (`#notify-form`) | `index.html` | `NOTIFY_FORM_ID` | Opens the email app with subject **Notify me** and their address |

Both IDs start as `"YOUR_CONTACT_FORM_ID"` / `"YOUR_NOTIFY_FORM_ID"`. While an ID starts with `YOUR_`, that form keeps the
mailto fallback, so nothing breaks before setup. Once a real ID is pasted, `js/contact-form.js` POSTs the form to
`https://formspree.io/f/<ID>` (JSON response) and shows “Thanks! Your message reached our inbox…” or an honest error
(“Sorry, that didn’t go through… email us at earthexportsshop@gmail.com”).

**Setup (about 10 minutes):**
1. Go to <https://formspree.io>, click **Sign up**, and create the account with **earthexportsshop@gmail.com**. Click the
   verification link Formspree emails to that inbox.
2. In the dashboard click **+ New Form**. Name it `Earth Exports contact`, and send submissions to earthexportsshop@gmail.com.
3. Formspree shows the endpoint, like `https://formspree.io/f/xabcdwxy`. Copy only the part after `/f/` (here `xabcdwxy`).
4. Make a second form named `Earth Exports notify me` and copy its ID the same way.
5. Open `js/forms-config.js` and paste them in:
   ```js
   CONTACT_FORM_ID: "xabcdwxy",
   NOTIFY_FORM_ID: "xpqrstuv",
   ```
6. Save, upload/sync the site, then send one test from each form. The first submission may ask you to confirm in the
   Formspree dashboard or by email. After that, messages land in the Gmail inbox.
7. Optional: in each form's **Settings**, restrict submissions to the live site's domain once it has one.

Notes: the free plan allows **50 submissions a month across all forms**, and Formspree emails when you near the limit.
Both forms include Formspree's hidden `_gotcha` spam trap. The hero **Write to us** button and the “Or email us directly”
line stay plain mailto links either way. Without JavaScript, both forms fall back to their `mailto:` action.
The privacy note in `policies.html#privacy` already mentions Formspree.

The **Vex early-access chat** (`js/vex-chat.js`) uses the same `NOTIFY_FORM_ID`, so one Formspree form collects both the Home box and the Vex chat signups. Each chat signup includes `source: Vex chat`. To test the chat without waiting, clear the site's localStorage key `ee-vexchat`, or tap the **Early access** Vex button in the footer.

## Design locks

- Palette: `#0B0E14` / `#0D1117` · `#1C2331` · `#00A896` / `#028090` · `#F77F00` · `#E0E6ED`
- Accents (CRT): phosphor green `#39FF14` · amber `#FFB000` — CTAs stay orange/teal
- Primary CTA: hazard orange · Secondary: peacock teal
- Aesthetic: Cosmic Voyager Deck 01 freighter lounge (Fresnel viewport, bay doors, Helion accents) + Outpost amber CRT console
- Extended accents OK: Helion violet `#7B5CFF`, warm practicals — keep teal/orange recognizable
- Not conspiracy, not fake FOIA, not lookalike real gov credentials presented as authentic

## Disclaimer (sitewide)

Earth Exports is a work of speculative fiction and independent design. We are not affiliated with any government, military, or scientific agency.


## Brand mark
Primary header logo: `assets/logos/ee-logo-sol3-mark.svg` (vector). Raster reference: `ee-logo-sol3-final.png`.

## Home hero (photoreal)

The home scene is a WebGL Earth built from NASA Blue Marble / Black Marble imagery, rendered with a locally vendored three.js (`js/vendor/`, MIT). The UFO tab turns the globe to night, and its city lights converge into the saucer's rim lights. Static WebP fallbacks cover no-WebGL and reduced-motion. See DESIGN-UI.md. Earth imagery: NASA (public domain).


## Local preview with the custom 404

`python -m http.server` shows its own error page for missing URLs. To see F.R.A.N.K.'s 404 page locally, run:

```
python3 dev-server.py 8768
```

Netlify and Cloudflare Pages serve `404.html` automatically for unknown paths; nothing to configure. `404.html` uses root-absolute links (`/css/...`, `/index.html`), so it expects the site at the domain root.
