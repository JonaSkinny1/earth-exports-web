/* Earth Exports · Ship's log cargo feed (IN-WORLD FICTION, decorative).
   Not real-time data, not social proof: no customer names, no real places
   (Sol-3 / Ohio Outpost // Sol-3 is the house), no prices, no counts of buyers.
   Species = canon Alien Index designations; sectors, galaxies and trader names are invented. */
(function () {
  "use strict";
  var ENTRIES = [
    ["ALERT", "Incoming blueprints from Sector 4592 (Bla-bla Galaxy). Routing to the STL files bay.", "sector-04.html"],
    ["INCOMING", "STL cache from a Viridane shipwright, Sector 7710 (Drift of Ommu). Measured twice, filed once.", "sector-04.html"],
    ["OUTBOUND", "Card decks crated for a Vel-Keth trade barge. Tuck boxes sealed.", "sector-01.html"],
    ["OUTBOUND", "One field relic, oxide finish, departs for the Pelagra tide-markets. Serial plate checked.", "sector-02.html"],
    ["CUSTOMS", "Hold on one Torvann crate labeled “definitely not snacks.” Inspection in progress."],
    ["SIGHTING", "Rare Helion crystal glow reported near the ringheart lane. Bridge says: look, don’t touch."],
    ["EARTH-SIDE", "Herbs & mugs arriving soon from the gravity well. Shelf reserved."],
    ["ORDER", "A Sol-3 traveler at the Ohio Outpost flea table asks for a dossier deck. Request filed.", "sector-01.html"],
    ["INCOMING", "Dossier requests from the Orrin archive-choir, Sector 3318 (Lantern Reach).", "archives.html"],
    ["CUSTOMS", "Vex spotted near Cargo Bay 3 asking about crystals. Manifest says no. Crates stay sealed."],
    ["LOG", "Bracken-Moot envoy traded three songs for one card deck. Quartermaster accepts songs."],
    ["OUTBOUND", "MANIFEST game boxes routed to the Ixen study-halls, Sector 0907 (Quiet Spiral).", "sector-01.html"],
    ["INCOMING", "Printed prop hull panels from the Gorruth forge-moons, Sector 5521 (Ember Veil).", "sector-02.html"],
    ["ALERT", "Kethra Void-Clans signal on the long-range scope. Hatches sealed, smiles on, sales careful."],
    ["CUSTOMS", "Husk Consortium crate delayed: the paperwork is also a crate. Clearing soon."],
    ["LOG", "Mirenth observers watched the Earth arc for forty minutes. Rated it “very blue.”"],
    ["OUTBOUND", "Alien Index extracts copied for the Vesper Ring archive, Sector 8804 (Crown of Tesk).", "archives.html"],
    ["INCOMING", "Tarn Vessik trader Oob-Varr requests STL files for a cockpit console. Clearance pending.", "sector-04.html"],
    ["EARTH-SIDE", "Tea tins stamped in the gravity well. Not on the shelf yet."],
    ["ALERT", "Object 9 file remains embargoed. Please stop asking the vending unit."],
    ["LOG", "A Rhell pilot left a thank-you note in a language we’re still decoding."],
    ["OUTBOUND", "The relic run stays at four crates. Year-one rule. Not even for the Nul-Sera.", "sector-02.html"],
    ["CUSTOMS", "Nul-Sera diplomatic pouch scanned. Contents: one very polite rock."],
    ["INCOMING", "Viridane weather-language swatches for the relic finishers, Sector 2046 (Glass Tides).", "sector-02.html"],
    ["ORDER", "Sol-3 visitor asks if STL files ship by tractor beam. They download. Filed anyway.", "sector-04.html"],
    ["LOG", "F.R.A.N.K. topped up the trust prop. Lounge lamps set to warm."],
    ["SIGHTING", "Faint Helion shimmer in Bay 2. It was the coffee. Stand down."],
    ["OUTBOUND", "Dossier decks bound for the Orrin choir-ships. They asked for extra jokers.", "sector-01.html"],
    ["ALERT", "Cargo drone GL-7 stuck in a loop around the Earth arc again. Retrieval crew dispatched."],
    ["INCOMING", "Pelagra tide-charts for a new card set, Sector 6130 (Bla-bla Galaxy). Archivists thrilled.", "sector-01.html"],
    ["CUSTOMS", "Gorruth crate hums at middle C. Customs cleared it after a short duet."],
    ["EARTH-SIDE", "Cuttings in life-support canisters waiting on the Manifest. Coming soon."],
    ["INCOMING", "Recorded Earth music requested by Viridane thread-singers, Glass Tides. Speakers set to gentle."],
    ["OUTBOUND", "Crate of hand tools bound for Tarn Vessik haulers at Anvil Reach. Rock dust not included."],
    ["LOG", "The dock mechanic found a loose coolant seal by ear. The scanners agreed an hour later."],
    ["SIGHTING", "A Vesper Ring yacht passed the Earth arc with its running lights on. We blinked back."],
    ["LOG", "A plant is growing in a broken fuel cell in the lounge. Some things shouldn’t survive but do."]
  ];
  var TAGCLASS = { "ALERT": "hz", "INCOMING": "hz", "OUTBOUND": "hz", "CUSTOMS": "hz", "SIGHTING": "hel", "EARTH-SIDE": "tl", "ORDER": "tl", "LOG": "tl", "NOTICE": "hz" };
  var feed = document.querySelector(".cargo-feed");
  if (!feed) return;
  var track = feed.querySelector(".cf-track");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var list = shuffle(ENTRIES.slice());

  function item(e, clone) {
    var li = document.createElement("li"); li.className = "cf-item";
    var tag = document.createElement("span"); tag.className = "cf-tag " + (TAGCLASS[e[0]] || "tl"); tag.textContent = e[0];
    li.appendChild(tag);
    var body;
    if (e[2]) { body = document.createElement("a"); body.href = e[2]; body.tabIndex = -1; }
    else body = document.createElement("span");
    body.className = "cf-text"; body.textContent = e[1];
    li.appendChild(body);
    if (clone) li.setAttribute("aria-hidden", "true");
    return li;
  }

  var rotTimer = null, rotIdx = 0;
  var MARQUEE_SPEED = 32; // px/s — quieter pass; build and resize share this rate
  function paused() { return feed.matches(":hover") || feed.matches(":focus-within"); }
  function setMarqueeDuration() {
    var half = track.scrollWidth / 2;
    track.style.setProperty("--cf-dur", Math.max(60, Math.round(half / MARQUEE_SPEED)) + "s");
  }

  function buildMarquee() {
    clearInterval(rotTimer); feed.classList.remove("cf-static");
    track.textContent = "";
    list.forEach(function (e) { track.appendChild(item(e, false)); });
    list.forEach(function (e) { track.appendChild(item(e, true)); });   // seamless loop copy
    requestAnimationFrame(function () {
      setMarqueeDuration();
      feed.classList.add("cf-running");
    });
  }
  function buildStatic() {
    feed.classList.remove("cf-running"); feed.classList.add("cf-static");
    track.style.removeProperty("--cf-dur");
    track.textContent = ""; rotIdx = 0;
    track.appendChild(item(list[0], false));
    clearInterval(rotTimer);
    rotTimer = setInterval(function () {             // slow, motion-free rotation (opacity only)
      if (paused() || document.hidden) return;
      var cur = track.firstChild; if (!cur) return;
      cur.classList.add("cf-fade");
      setTimeout(function () {
        rotIdx = (rotIdx + 1) % list.length;
        track.replaceChildren(item(list[rotIdx], false));
      }, 400);
    }, 12000);
  }
  function build() { reduce.matches ? buildStatic() : buildMarquee(); }
  build();
  if (reduce.addEventListener) reduce.addEventListener("change", build);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!reduce.matches) buildMarquee(); });
  var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { if (!reduce.matches) setMarqueeDuration(); }, 150); });
  /* push(entry): prepend a live line (e.g. after the Vex transmission) and rebuild */
  function push(e) {
    ENTRIES.push(e); list.unshift(e);
    window.__eeFeed.count = ENTRIES.length;
    if (reduce.matches) { rotIdx = 0; track.replaceChildren(item(e, false)); } else buildMarquee();
  }
  window.__eeFeed = { count: ENTRIES.length, entries: ENTRIES, push: push };
})();
