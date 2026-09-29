# Preview & sync — Earth Exports web UI (CV WILD)

**Face:** PUBLIC = Cosmic Voyager / Deck 01 collector lounge · OUTPOST = amber trade console

## On the box (immediate)

```bash
cd /workspace/scaffold/earth-exports-web
python3 -m http.server 8768 --bind 0.0.0.0
```

Open `http://127.0.0.1:8768/` (or the box LAN IP if reachable).

Box LAN (this session): `http://172.30.0.2:8768/`

Try:

- Default = Cosmic Voyager viewport / trade lounge (Public face) — **should look obviously different**
- Earth / UFO: use the **left tab (Earth · From Earth)** or **right tab (UFO · From Space)** on the left/right edges of the big scene; arrow keys / Home / End work when a tab is focused
- Footer stamp `EE · ◌` or `Alt+O` or append `#outpost` → Outpost amber console

## Previews in scaffold

| File | What |
|------|------|
| `preview-home-cv-WILD.png` | Public CV lounge WILD restyle |
| `preview-home.png` | Current canonical home (photoreal Earth) |
| `preview-clarity-home-desktop.png` / `preview-clarity-home-mobile.png` / `preview-clarity-ufo.png` | Clarity pass (plain what-is strip, plain nav/tabs) |
| `preview-clarity-mobile-ufo.png` / `preview-clarity-mobile-fullpage.png` | Clarity pass mobile UFO + full page |
| `preview-ticker-top-desktop.png` / `preview-ticker-top-mobile.png` | Top of page with the ship's log cargo feed |
| `preview-stamp-home-desktop.png` / `preview-stamp-home-mobile.png` | Home header after EE-OH-0001 moved to stamp-only |
| `preview-clarity-BEFORE-desktop.png` / `preview-clarity-BEFORE-mobile.png` | Before the clarity pass |
| `preview-home-cv-AFTER.png` | Prior subtle CV pass (reference) |
| `preview-home-diner-BEFORE.png` | Old lunar-diner face |
| `preview-home-outpost.png` | Outpost / trade console |
| `preview-home-earth.png` / `preview-home-ufo.png` | Photoreal WebGL scene: NASA Earth arc + sun / PBR saucer |
| `preview-morph-1..4.png` | Morph frames: turning to night · lights glow · lights converge into ring · saucer emerges |
| `preview-morph.webm` / `preview-morph.mp4` | Full Earth→UFO→Earth transition (rendered frame-by-frame, 24 fps) |
| `preview-home-mobile-earth.png` / `preview-home-mobile-ufo.png` | 390px mobile |
| `preview-outpost-page.png` | Outpost page |
| `preview-sector-01.png` | Sector bay page |
| `preview-inner-BEFORE-<page>-desktop.png` / `preview-inner-AFTER-<page>-desktop.png` | Inner pages clarity pass, top of page at 1440×900, before/after (sector-01, sector-02, sector-04, archives, outpost, manifest, contact) |
| `preview-inner-BEFORE-sector-0{1,4}-mobile.png` / `preview-inner-AFTER-sector-0{1,4}-mobile.png` | Inner pages clarity pass, 390px mobile before/after |
| `preview-inner-AFTER-archives-mobile-table.png` | Alien Index table on 390px (fits, no wrap in IDs) |
| `preview-story-provenance-tag.png` | Story layers: open cargo tag on a Props & Relics card |
| `preview-story-vex-glitch.png` / `preview-story-vex-mid.png` / `preview-story-vex-cut.png` / `preview-story-vex-recover.png` / `preview-story-vex-mobile.png` | Vex transmission easter egg frames |
| `preview-story-404.png` | F.R.A.N.K. 404 page |
| `preview-story-canister-shelf.png` | Earth shelf propagation canisters |
| `preview-story-captains-log.png` | News / Captain's log page |
| `preview-story-dossier-open.png` / `preview-story-dossier-mobile.png` | Alien Index dossier modal |
| `preview-story-pin-note.png` | Dock mechanic's pinned note (sector-04; since 2026-09-26 it sits inside that page's closed story) |
| `preview-declutter-BEFORE-{home,sector-01,archives,about}-390.png` | Declutter + images pass: full-page 390px phone shots **before** (2026-09-26) |
| `preview-launch-home-top-390.png` / `preview-launch-home-full-390.png` | Launch pass: phone home (products first, signup, Coming later from Earth). These shots show the static scene + Play button, which was reverted later on 2026-09-26 |
| `preview-phone-earth-390.png` / `preview-phone-space-390.png` | Phone follow-up: 390px home top with the animated hero in each state (Earth globe / Space saucer). Superseded by the tab shots below |
| `preview-phone-tab-space-390.png` / `preview-phone-tab-earth-390.png` | Real tabs (2026-09-27): 390px home, top 1700px. Space tab lit + saucer + only **What we make** (orange highlight); Earth tab lit + globe + only **Coming later from Earth** canisters (teal highlight) |
| `preview-launch-vex-chat.png` | Vex early-access chat on a 390px phone (after tapping Show me) |
| `preview-launch-policies-390.png` / `preview-launch-contact-390.png` | Launch pass: draft Policies page and Contact form on a phone |
| `preview-canisters-restored-390.png` | Earth goods section at 390px with the original canister shelf cards restored |
| `preview-declutter-AFTER-{home,sector-01,archives,about}-390.png` | Same pages **after**: calm product grids, placeholder photos, Alien Index species cards |

## Tarball

```
/workspace/earth-exports-web-ui.tgz
```

Synced to SpaceshipDesktop: `Documents\earth-exports-web\`

### On SpaceshipDesktop (PC)

```powershell
$dest = "$env:USERPROFILE\Documents\earth-exports-web"
cd $dest
python dev-server.py 8768   # preferred: custom 404 + Cache-Control: no-cache. Plain `python -m http.server` sends no cache header, so phones may reuse old CSS/JS
```

Then browse `http://127.0.0.1:8768/` on the PC.

**machineId:** `d49a547b-d48d-410d-8825-09dc2f6c39f4`  
**Preferred desktop path:** `Documents\earth-exports-web`
