# Earth Exports — Year-One Website

**House Mark:** Earth Exports · EE-OH-0001  
**Outpost:** Ohio Outpost // Sol-3  
**Stack:** Pure static HTML/CSS (+ tiny nav JS). No React, no bundler.

Copy source: `EE-WEB-COPY-v0.1` · Species index: `AFC-SPECIES-BIBLE-v1.0` (public Archive ID / designation / status only).

## Pages

| File | Route |
|------|--------|
| `index.html` | Home |
| `manifest.html` | The Manifest |
| `sector-01.html` | Sector 01 — Dossiers & Games |
| `sector-02.html` | Sector 02 — Relics (≤4, Filing…) |
| `sector-04.html` | Sector 04 — Schematics |
| `outpost.html` | Ohio Outpost |
| `archives.html` | AFC Index (public) |
| `contact.html` | Send a Filing |

Sector 03 is intentionally off the nav (year-one deferral).

## Local preview

```bash
cd /workspace/scaffold/earth-exports-web
python3 -m http.server 8765
```

Open [http://127.0.0.1:8765/](http://127.0.0.1:8765/).

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

## Contact form

`contact.html` uses `mailto:filings@earthexports.example` as a placeholder. Replace with a real inbox or a form backend (Netlify Forms, Formspree, Cloudflare Worker, etc.) before public launch. You can also set `action="#"` and handle submit with your own endpoint.

## Design locks

- Palette: `#0B0E14` / `#0D1117` · `#1C2331` · `#00A896` / `#028090` · `#F77F00` · `#E0E6ED`
- Accents (CRT): phosphor green `#39FF14` · amber `#FFB000` — CTAs stay orange/teal
- Primary CTA: hazard orange · Secondary: peacock teal
- Aesthetic: merchant clearance console / AFC public terminal (classified-adjacent chrome, house fiction)
- Not conspiracy, not fake FOIA, not lookalike real gov credentials presented as authentic

## Disclaimer (sitewide)

Earth Exports is a work of speculative fiction and independent design. We are not affiliated with any government, military, or scientific agency.


## Brand mark
Primary header logo: `assets/logos/ee-logo-sol3-mark.svg` (vector). Raster reference: `ee-logo-sol3-final.png`.
