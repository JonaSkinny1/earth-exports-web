# Alien Index v1 (retired)

This file is a backup of the public Alien Index before the 23-species roster.
It is not linked from the website. Do not copy these names back onto pages.

Saved from `archives.html` (main) and `js/dossiers.js` on the species-rename branch.

## Page

```html
  <main>
    <div class="page-hero">
      <div class="page-hero-inner">
        <p class="eyebrow face-public-only">Alien Index · the species behind the cards</p>
        <p class="sys-line face-outpost-only"><span class="prompt">ee@ohio</span><span class="dim">:</span>~/archives$ psql afc_public<span class="cursor-blink" aria-hidden="true"></span></p>
        <h1>Alien Index<span class="rule" aria-hidden="true"></span></h1>
        <p class="lead page-what">The sixteen made-up alien species on our cards. Tap one to open its short fact file.</p>
        <div class="cta-row hero-cta">
          <a class="btn btn-primary" href="sector-01.html">See the card decks</a>
          <a class="btn btn-secondary" href="star-map.html">Species star map</a>
        </div>
      </div>
    </div>
    <div class="wrap">
      <ul class="status-legend" aria-label="What the status means">
        <li><span class="status status-treaty">Treaty</span> Friendly trade partner</li>
        <li><span class="status status-observer">Observer</span> Watching, not trading yet</li>
        <li><span class="status status-restricted">Restricted</span> Limited trade</li>
        <li><span class="status status-embargoed">Embargoed</span> No trade (one mystery file)</li>
      </ul>
      <ul class="species-grid" aria-label="The sixteen species">
        <li><button type="button" class="species-card dossier-btn" data-idx="0" data-img="images/species/vel-keth.webp" aria-haspopup="dialog" aria-label="Vel-Keth, Treaty. Open fact file.">
          <img src="images/species/vel-keth.webp" width="600" height="600" loading="lazy" decoding="async" alt="Vel-Keth emblem (placeholder art)">
          <span class="sc-name">Vel-Keth</span>
          <span class="status status-treaty">Treaty</span>
          <span class="sr-only"> (open dossier)</span>
        </button></li>
        <li><button type="button" class="species-card dossier-btn" data-idx="1" data-img="images/species/orrin.webp" aria-haspopup="dialog" aria-label="Orrin, Treaty. Open fact file.">
          <img src="images/species/orrin.webp" width="600" height="600" loading="lazy" decoding="async" alt="Orrin emblem (placeholder art)">
          <span class="sc-name">Orrin</span>
          <span class="status status-treaty">Treaty</span>
          <span class="sr-only"> (open dossier)</span>
        </button></li>
        <li><button type="button" class="species-card dossier-btn" data-idx="2" data-img="images/species/mirenth.webp" aria-haspopup="dialog" aria-label="Mirenth, Observer. Open fact file.">
          <img src="images/species/mirenth.webp" width="600" height="600" loading="lazy" decoding="async" alt="Mirenth emblem (placeholder art)">
          <span class="sc-name">Mirenth</span>
          <span class="status status-observer">Observer</span>
          <span class="sr-only"> (open dossier)</span>
        </button></li>
        <li><button type="button" class="species-card dossier-btn" data-idx="3" data-img="images/species/tarn-vessik.webp" aria-haspopup="dialog" aria-label="Tarn Vessik, Treaty. Open fact file.">
          <img src="images/species/tarn-vessik.webp" width="600" height="600" loading="lazy" decoding="async" alt="Tarn Vessik emblem (placeholder art)">
          <span class="sc-name">Tarn Vessik</span>
          <span class="status status-treaty">Treaty</span>
          <span class="sr-only"> (open dossier)</span>
        </button></li>
        <li><button type="button" class="species-card dossier-btn" data-idx="4" data-img="images/species/viridane.webp" aria-haspopup="dialog" aria-label="Viridane, Treaty. Open fact file.">
          <img src="images/species/viridane.webp" width="600" height="600" loading="lazy" decoding="async" alt="Viridane emblem (placeholder art)">
          <span class="sc-name">Viridane</span>
          <span class="status status-treaty">Treaty</span>
          <span class="sr-only"> (open dossier)</span>
        </button></li>
        <li><button type="button" class="species-card dossier-btn" data-idx="5" data-img="images/species/husk-consortium.webp" aria-haspopup="dialog" aria-label="Husk Consortium, Observer. Open fact file.">
          <img src="images/species/husk-consortium.webp" width="600" height="600" loading="lazy" decoding="async" alt="Husk Consortium emblem (placeholder art)">
          <span class="sc-name">Husk Consortium</span>
          <span class="status status-observer">Observer</span>
          <span class="sr-only"> (open dossier)</span>
        </button></li>
        <li><button type="button" class="species-card dossier-btn" data-idx="6" data-img="images/species/rhell.webp" aria-haspopup="dialog" aria-label="Rhell, Observer. Open fact file.">
          <img src="images/species/rhell.webp" width="600" height="600" loading="lazy" decoding="async" alt="Rhell emblem (placeholder art)">
          <span class="sc-name">Rhell</span>
          <span class="status status-observer">Observer</span>
          <span class="sr-only"> (open dossier)</span>
        </button></li>
        <li><button type="button" class="species-card dossier-btn" data-idx="7" data-img="images/species/torvann.webp" aria-haspopup="dialog" aria-label="Torvann, Restricted. Open fact file.">
          <img src="images/species/torvann.webp" width="600" height="600" loading="lazy" decoding="async" alt="Torvann emblem (placeholder art)">
          <span class="sc-name">Torvann</span>
          <span class="status status-restricted">Restricted</span>
          <span class="sr-only"> (open dossier)</span>
        </button></li>
        <li><button type="button" class="species-card dossier-btn" data-idx="8" data-img="images/species/pelagra.webp" aria-haspopup="dialog" aria-label="Pelagra, Observer. Open fact file.">
          <img src="images/species/pelagra.webp" width="600" height="600" loading="lazy" decoding="async" alt="Pelagra emblem (placeholder art)">
          <span class="sc-name">Pelagra</span>
          <span class="status status-observer">Observer</span>
          <span class="sr-only"> (open dossier)</span>
        </button></li>
        <li><button type="button" class="species-card dossier-btn" data-idx="9" data-img="images/species/ixen.webp" aria-haspopup="dialog" aria-label="Ixen, Treaty. Open fact file.">
          <img src="images/species/ixen.webp" width="600" height="600" loading="lazy" decoding="async" alt="Ixen emblem (placeholder art)">
          <span class="sc-name">Ixen</span>
          <span class="status status-treaty">Treaty</span>
          <span class="sr-only"> (open dossier)</span>
        </button></li>
        <li><button type="button" class="species-card dossier-btn" data-idx="10" data-img="images/species/bracken-moot.webp" aria-haspopup="dialog" aria-label="Bracken-Moot, Observer. Open fact file.">
          <img src="images/species/bracken-moot.webp" width="600" height="600" loading="lazy" decoding="async" alt="Bracken-Moot emblem (placeholder art)">
          <span class="sc-name">Bracken-Moot</span>
          <span class="status status-observer">Observer</span>
          <span class="sr-only"> (open dossier)</span>
        </button></li>
        <li><button type="button" class="species-card dossier-btn" data-idx="11" data-img="images/species/nul-sera.webp" aria-haspopup="dialog" aria-label="Nul-Sera, Restricted. Open fact file.">
          <img src="images/species/nul-sera.webp" width="600" height="600" loading="lazy" decoding="async" alt="Nul-Sera emblem (placeholder art)">
          <span class="sc-name">Nul-Sera</span>
          <span class="status status-restricted">Restricted</span>
          <span class="sr-only"> (open dossier)</span>
        </button></li>
        <li><button type="button" class="species-card dossier-btn" data-idx="12" data-img="images/species/gorruth.webp" aria-haspopup="dialog" aria-label="Gorruth, Treaty. Open fact file.">
          <img src="images/species/gorruth.webp" width="600" height="600" loading="lazy" decoding="async" alt="Gorruth emblem (placeholder art)">
          <span class="sc-name">Gorruth</span>
          <span class="status status-treaty">Treaty</span>
          <span class="sr-only"> (open dossier)</span>
        </button></li>
        <li><button type="button" class="species-card dossier-btn" data-idx="13" data-img="images/species/vesper-ring.webp" aria-haspopup="dialog" aria-label="Vesper Ring, Treaty. Open fact file.">
          <img src="images/species/vesper-ring.webp" width="600" height="600" loading="lazy" decoding="async" alt="Vesper Ring emblem (placeholder art)">
          <span class="sc-name">Vesper Ring</span>
          <span class="status status-treaty">Treaty</span>
          <span class="sr-only"> (open dossier)</span>
        </button></li>
        <li><button type="button" class="species-card dossier-btn" data-idx="14" data-img="images/species/kethra-void-clans.webp" aria-haspopup="dialog" aria-label="Kethra Void-Clans, Restricted. Open fact file.">
          <img src="images/species/kethra-void-clans.webp" width="600" height="600" loading="lazy" decoding="async" alt="Kethra Void-Clans emblem (placeholder art)">
          <span class="sc-name">Kethra Void-Clans</span>
          <span class="status status-restricted">Restricted</span>
          <span class="sr-only"> (open dossier)</span>
        </button></li>
        <li><button type="button" class="species-card dossier-btn" data-idx="15" data-img="images/species/object-9.webp" aria-haspopup="dialog" aria-label="Object 9 / “The Invoice”, Embargoed. Open fact file.">
          <img src="images/species/object-9.webp" width="600" height="600" loading="lazy" decoding="async" alt="Object 9 / “The Invoice” emblem (placeholder art)">
          <span class="sc-name">Object 9 / “The Invoice”</span>
          <span class="status status-embargoed">Embargoed</span>
          <span class="sr-only"> (open dossier)</span>
        </button></li>
      </ul>
      <p class="grid-note">Species art is placeholder. The full stories are printed on the cards.</p>
      <details class="story" id="story">
        <summary><span class="story-k">The story</span> <span class="story-hint">for lore fans · tap to open</span></summary>
        <div class="story-body">
          <div class="body-copy">
            <p>Sixteen filings, one embargo. In the story, the Archive of First Contact (AFC) is the house library of every species Earth has met. This page is the public teaser: name, status and a short fact file. Full biology stays on the cards.</p>
          </div>
        </div>
      </details>
    </div>
  </main>
```

## Dossier script

```javascript
/* Earth Exports · Alien Index dossiers (IN-WORLD FICTION).
   Source: AFC-SB-01 species bible (the 16 canon species only). Public-site summaries:
   short traits, status, trade notes. Homeworld names are original house flavor. */
(function () {
  "use strict";
  var RATING = { C1: "steady trade lane", C2: "trades when it suits them", C3: "volatile, extra paperwork", C4: "no direct trade (lore and print only)" };
  var D = [
    ["AFC-01.00","Vel-Keth","Treaty","Glass Choir","Sonnet Shelf, a plain of singing crystal around a small white star","Colonies of resonant crystal plates that grow instead of molting. They talk by humming through their whole body.","precision glass, acoustic instruments, copper","optical glass, tuning resonators","C1","A Vel-Keth room hums at the edge of hearing, like a wineglass that never stops ringing.",2031],
    ["AFC-02.00","Orrin","Treaty","Ledger Folk","Beadhollow, a dry canyon world in the Lantern Reach","Light, plated and very long-lived. They keep their memories in carved bead-ledgers worn on the belt.","contract paper, archival inks, dispute mediation","credit clearing, trade-lane insurance","C1","Their beads click softly when they fib. Honest talk is almost silent.",2028],
    ["AFC-03.00","Mirenth","Observer","Fog Gardeners","Veil Hollow, a cloud-wrapped moon","Soft, round-bodied beings who live inside their own bubble of moss and mist, and vote with colored fog.","terrarium glass, humidity controllers, garden soil","medicine ingredients, living air filters","C2","Their greeting is a puff of pale green fog that smells a little like cucumber.",2044],
    ["AFC-04.00","Tarn Vessik","Treaty","Bulk Haulers","Anvil Reach, a heavy-gravity quarry world","Big four-legged haulers with armored backs and a second brain for balancing cargo. Crews stick together like family.","machine tools, welding gas, scrap steel","heavy lifting, ore hauling, wreck salvage","C1","Their ships smell like hot oil and wet concrete, even in a clean dock.",2036],
    ["AFC-05.00","Viridane","Treaty","Thread Singers","Loomwater, in the Glass Tides","Slender, six-fingered and color-shifting. They spin thread from their wrists and grow their clothes.","recorded music, fabric samples, performance rights","adaptive fabrics, color-shift finishes","C2","A Viridane hello is a quick flash of indigo across the throat.",2052],
    ["AFC-06.00","Husk Consortium","Observer","Shell Brokers","None. A trade league that rents space on Quorum-Nine, a leased orbital","Not one species: a club of minds that rent robot bodies and carry their identity on sealed wafers.","chassis parts, rare metals, off-grid computers","remote work contracts, archive storage","C3","Every deal ends with a wafer handoff that clicks like a camera shutter.",2039],
    ["AFC-07.00","Rhell","Observer","Deep Pressure","Deepmere, a gas giant with an ocean hidden under the clouds","Amphibious and built for crushing pressure. They talk in pressure pulses through water or thick air.","pressure tanks, diving ceramics, salt","gas-mining rights, rare ices","C2","Standing near a Rhell makes your ears want to pop.",2048],
    ["AFC-08.00","Torvann","Restricted","Gray Market Hulls","The Scrapfall Belt, a ring of salvage and patched habitats","Compact, tough and proud of fixing things. A Torvann without a tool belt is underdressed.","surplus parts, hand tools, coffee","salvage strip-downs, back-lane shipping","C3","Their docking clamps leave chalk-white bite marks on the rails.",2033],
    ["AFC-09.00","Pelagra","Observer","Bloom Ships","The reefs around the star Ossel, though they rarely stay put","Each ship is a living reef. The “people” are moments of decision inside it.","mineral supplements, UV-safe paints, seed banks","oxygen credits, living hull coatings","C2","A Pelagra berth smells like cut grass after rain.",2059],
    ["AFC-10.00","Ixen","Treaty","Quiet Markets","Hushfall, in the Quiet Spiral","Feather-scaled, with double eyelids for dim light. They bargain in whispers.","matte-black coatings, soft packaging, rare teas","discreet courier lanes, privacy containers","C1","An Ixen deal is signed under one amber lamp. Anything brighter spoils the mood.",2041],
    ["AFC-11.00","Bracken-Moot","Observer","Root Assembly","Rootmoor, a forest world that thinks slowly","Plant-animal folk who walk when young and put down roots when old. Their elders decide through root networks.","hardwood samples, fungus cultures, paper","slow-farming know-how, living buildings","C2","Talks take days. The floor slowly warms as the roots listen.",2066],
    ["AFC-12.00","Nul-Sera","Restricted","Mirror Clause","Unlisted. Mail goes to a mirrored buoy called Paleglass","Almost human in outline, with mirror-like skin that blurs cameras. They wear their identity as crest plates.","civilian-grade reflective coatings","information escrow, anonymous brokerage","C3","Cameras near a Nul-Sera envoy show a soft glow and no useful face.",2055],
    ["AFC-13.00","Gorruth","Treaty","Foundry Kin","Cinderhome, the forge-moons of the Ember Veil","Heat-loving, ash-gray and warm to stand near. Everything centers on shared furnaces and long apprenticeships.","firebrick, pattern books, Ohio foundry tools","alloy bars, custom castings","C1","Standing next to a Gorruth feels like standing by an open kiln.",2029],
    ["AFC-14.00","Vesper Ring","Treaty","Evening Court","Duskhold, an orbital ring in the Crown of Tesk","Winged and built for low gravity. Rank shows in dusk-colored feather dyes.","museum replicas, silk, low-gravity dance","orbital hospitality, diplomatic hosting","C2","Their reception decks stay at permanent twilight. Clocks are considered rude.",2047],
    ["AFC-15.00","Kethra Void-Clans","Restricted","Unfiled Drift","None. Born aboard slow, cold generation ships","Long, radiation-hardened frames made for drifting between stars. Clans are marked by star-chart tattoos.","star charts, dried food, radiation medicine","deep-lane piloting, unmapped shortcuts (buyer beware)","C3","They keep their cabins near freezing. Their breath fogs in rooms we call warm.",2061],
    ["AFC-16.00","Object 9 / “The Invoice”","Embargoed (direct)","First Bill of Lading","Unknown. Only the paperwork arrived","Unknown. First contact wasn’t a body. It was a tariff schedule and a docking request sent to Sol traffic control.","nothing (no verified counterparty)","the template that opened Sol-3 to lane trade","C4","Old printouts of the schedule smell faintly of ozone and machine oil.",2026]
  ];
  var grid = document.querySelector(".species-grid");
  if (!grid) return;
  var dlg = document.createElement("dialog");
  dlg.className = "dossier-dlg";
  dlg.setAttribute("aria-labelledby", "dossier-title");
  document.body.appendChild(dlg);
  var opener = null;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function stClass(st) { return "status-" + st.split(" ")[0].toLowerCase(); }
  function open(i, btn) {
    var d = D[i]; opener = btn;
    var im = btn && btn.dataset.img ? '<img class="dossier-img" src="' + esc(btn.dataset.img) + '" width="600" height="600" alt="Placeholder emblem art for the ' + esc(d[1]) + '">' : "";
    dlg.innerHTML =
      '<div class="dossier-card">' +
        '<div class="dossier-top"><span class="dossier-id">' + esc(d[0]) + ' · dossier</span>' +
        '<button type="button" class="dossier-x" aria-label="Close dossier">✕</button></div>' +
        im + '<h2 id="dossier-title">' + esc(d[1]) + '</h2>' +
        '<p class="dossier-nick">File name: “' + esc(d[3]) + '” · first contact ' + d[10] + '</p>' +
        '<span class="status ' + stClass(d[2]) + '">' + esc(d[2]) + '</span>' +
        '<dl class="dossier-dl">' +
          '<div><dt>Homeworld</dt><dd>' + esc(d[4]) + '</dd></div>' +
          '<div><dt>Traits</dt><dd>' + esc(d[5]) + '</dd></div>' +
          '<div><dt>Buys from Earth</dt><dd>' + esc(d[6]) + '</dd></div>' +
          '<div><dt>Sells</dt><dd>' + esc(d[7]) + '</dd></div>' +
          '<div><dt>Trade rating</dt><dd>' + esc(d[8]) + ' · ' + esc(RATING[d[8]]) + '</dd></div>' +
        '</dl>' +
        '<p class="dossier-note"><b>Field note:</b> ' + esc(d[9]) + '</p>' +
        '<p class="dossier-fine">Made-up species from our story world. Full stories are printed on the cards.</p>' +
      '</div>';
    dlg.querySelector(".dossier-x").addEventListener("click", function () { dlg.close(); });
    dlg.showModal();
    dlg.querySelector(".dossier-x").focus();
  }
  dlg.addEventListener("close", function () { if (opener) opener.focus(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); }); // backdrop click
  grid.addEventListener("click", function (e) {
    var b = e.target.closest(".dossier-btn"); if (b) open(+b.dataset.idx, b);
  });
  var hint = document.querySelector(".dossier-hint"); if (hint) hint.hidden = false;
  window.__eeDossiers = { count: D.length, names: D.map(function (d) { return d[1]; }) };
})();
```
