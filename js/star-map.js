(function () {
  "use strict";

  var VB = { w: 1100, h: 860, cx: 550, cy: 430 };
  var LOG_MIN = Math.log10(4.24);
  var LOG_MAX = Math.log10(3420);
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarseQuery = window.matchMedia("(pointer: coarse)");

  /* Stylized Sol layout. Angles are degrees from east, counterclockwise. */
  var SOL_GEOM = {
    "glass-lung": { r: 78, deg: 26, disc: 7.5, fill: "venus", ldx: 12, ldy: -18, anchor: "start" },
    "red-ledger": { r: 144, deg: 228, disc: 6.5, fill: "mars", ldx: -14, ldy: 16, anchor: "end" },
    "wellhold": { r: 178, deg: 314, disc: 5, fill: "ceres", ldx: 14, ldy: 16, anchor: "start" },
    "ganymede-yard": { r: 196, deg: 98, disc: 5, fill: "moon", ldx: -16, ldy: -18, anchor: "end" },
    "cinder-mote": { r: 252, deg: 46, disc: 4.2, fill: "io", ldx: 14, ldy: -8, anchor: "start" },
    "brine-court": { r: 250, deg: 84, disc: 4.2, fill: "europa", ldx: -4, ldy: -22, anchor: "middle" },
    "plume-kin": { r: 300, deg: 150, disc: 3.6, fill: "moon", ldx: -4, ldy: -20, anchor: "middle" },
    "haze-wick": { r: 308, deg: 188, disc: 5, fill: "titan", ldx: -16, ldy: 14, anchor: "end" },
    "cold-wake": { r: 376, deg: 200, disc: 4, fill: "moon", ldx: -16, ldy: 6, anchor: "end" },
    "charon-scale": { r: 378, deg: 334, disc: 4.2, fill: "charon", ldx: 12, ldy: 18, anchor: "start" }
  };

  var PLANETS = [
    { id: "mercury", name: "Mercury", r: 48, deg: 198, disc: 3.2, fill: "mercury", ldx: -8, ldy: 14, anchor: "end" },
    { id: "earth", name: "Earth", sub: "Sol-3", r: 110, deg: 136, disc: 7, fill: "earth", ldx: -14, ldy: 16, anchor: "end" },
    { id: "jupiter", name: "Jupiter", r: 218, deg: 64, disc: 14, fill: "jupiter", ldx: 16, ldy: 12, anchor: "start" },
    { id: "saturn", name: "Saturn", r: 268, deg: 164, disc: 11, fill: "saturn", ring: true, ldx: 8, ldy: 20, anchor: "start" },
    { id: "uranus", name: "Uranus", r: 312, deg: 114, disc: 7, fill: "uranus", ldx: 12, ldy: -16, anchor: "start" },
    { id: "neptune", name: "Neptune", r: 344, deg: 216, disc: 7.5, fill: "neptune", ldx: -12, ldy: 16, anchor: "end" },
    { id: "pluto", name: "Pluto", r: 352, deg: 348, disc: 3.4, fill: "pluto", ldx: 8, ldy: -16, anchor: "start" }
  ];

  var MOON_LINKS = [
    ["jupiter", "brine-court"],
    ["jupiter", "cinder-mote"],
    ["jupiter", "ganymede-yard"],
    ["saturn", "plume-kin"],
    ["saturn", "haze-wick"],
    ["neptune", "cold-wake"],
    ["pluto", "charon-scale"]
  ];

  var ORBIT_R = [48, 78, 110, 144, 178, 218, 268, 312, 344];

  /* Sideways slide along the sky tangent, in viewBox pixels. Distance from Sol stays put. */
  var TANGENT_NUDGE = {
    "trappist-1": -34,
    "fomalhaut": 34,
    "kepler-47": -68,
    "kepler-452": -8,
    "kepler-186": 46,
    "kepler-62": 30
  };

  /* Label anchor in viewBox space. "start" grows right, "end" grows left. */
  var STAR_LABEL = {
    "trappist-1": { x: 448, y: 148, anchor: "end" },
    "fomalhaut": { x: 720, y: 168, anchor: "start" },
    "tau-ceti": { x: 392, y: 276, anchor: "end" },
    "epsilon-eridani": { x: 328, y: 366, anchor: "end" },
    "luyten": { x: 292, y: 498, anchor: "end" },
    "55-cancri": { x: 278, y: 578, anchor: "end" },
    "barnard": { x: 760, y: 348, anchor: "end" },
    "proxima": { x: 748, y: 528, anchor: "start" },
    "kepler-47": { x: 952, y: 214, anchor: "start" },
    "kepler-452": { x: 952, y: 276, anchor: "start" },
    "kepler-186": { x: 952, y: 338, anchor: "start" },
    "kepler-62": { x: 952, y: 400, anchor: "start" }
  };

  var LENSES = [
    { id: "disposition", label: "Disposition", field: "disposition" },
    { id: "resource", label: "Resource value", field: "resource" },
    { id: "difficulty", label: "Trade difficulty", field: "difficulty" },
    { id: "danger", label: "Danger to cargo", field: "danger" }
  ];

  var RANK_LABEL = {
    friendly: "Friendly",
    neutral: "Neutral",
    wary: "Wary",
    "hostile-to-trade": "Hostile to trade",
    rich: "Rich",
    fair: "Fair",
    poor: "Poor",
    easy: "Easy",
    tricky: "Tricky",
    hard: "Hard",
    low: "Low",
    medium: "Medium",
    high: "High"
  };

  var RANK_SHAPE = {
    friendly: "circle",
    neutral: "square",
    wary: "triangle",
    "hostile-to-trade": "diamond",
    rich: "circle",
    fair: "square",
    poor: "triangle",
    easy: "circle",
    tricky: "square",
    hard: "diamond",
    low: "circle",
    medium: "square",
    high: "triangle"
  };

  var CANISTERS = [
    ["Lab quarantine", "teal"],
    ["Cargo", "orange"],
    ["Salvage worn", "purple"],
    ["Alien recover", "rose"],
    ["Wayfinder Lantern", "gold"]
  ];

  var state = {
    species: [],
    byId: {},
    routes: [],
    rivalries: [],
    zone: "sol",
    lens: "disposition",
    routesOn: true,
    rivalsOn: false,
    focusId: "",
    lastFocus: null,
    flipBack: false,
    openId: ""
  };

  var els = {};

  document.addEventListener("DOMContentLoaded", boot);

  function boot() {
    els.status = document.getElementById("map-status");
    els.solBoard = document.getElementById("sol-board");
    els.beyondBoard = document.getElementById("beyond-board");
    els.solPanel = document.getElementById("panel-sol");
    els.beyondPanel = document.getElementById("panel-beyond");
    els.tabSol = document.getElementById("tab-sol");
    els.tabBeyond = document.getElementById("tab-beyond");
    els.note = document.getElementById("map-note");
    els.indexTitle = document.getElementById("map-index-title");
    els.index = document.getElementById("map-index");
    els.scanLegend = document.getElementById("scan-legend");
    els.routeLegend = document.getElementById("route-legend");
    els.scanButtons = Array.prototype.slice.call(document.querySelectorAll("[data-lens]"));
    els.routesToggle = document.getElementById("toggle-routes");
    els.rivalsToggle = document.getElementById("toggle-rivals");
    els.pickBtn = document.getElementById("species-pick-btn");
    els.pickMenu = document.getElementById("species-menu");
    els.summary = document.getElementById("species-summary");
    els.summaryOpen = document.getElementById("species-summary-open");
    els.sumStanding = document.getElementById("sum-standing");
    els.sumWith = document.getElementById("sum-with");
    els.sumCargo = document.getElementById("sum-cargo");
    els.sumRival = document.getElementById("sum-rival");
    els.dialog = document.getElementById("species-dialog");
    els.kicker = document.getElementById("sd-kicker");
    els.title = document.getElementById("species-dialog-title");
    els.home = document.getElementById("sd-home");
    els.facts = document.getElementById("sd-facts");
    els.faces = document.getElementById("sd-faces");
    els.pending = document.getElementById("sd-pending");
    els.pendingName = document.getElementById("sd-pending-name");
    els.flip = document.getElementById("sd-flip");
    els.close = document.getElementById("sd-close");

    wireChrome();

    fetch("data/species.json")
      .then(function (res) {
        if (!res.ok) throw new Error("species file");
        return res.json();
      })
      .then(function (data) {
        state.species = data.species || [];
        state.routes = data.routes || [];
        state.rivalries = data.rivalries || [];
        state.species.forEach(function (s) { state.byId[s.id] = s; });
        drawSol();
        drawBeyond();
        fillSpeciesMenu();
        applyScan();
        showZone(initialZone(), false);
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(function () { fitStarLabels(); });
        }
        if (els.status) els.status.hidden = true;
        var hashId = hashSpecies();
        if (hashId) openSpecies(state.byId[hashId], false);
      })
      .catch(function () {
        if (els.status) {
          els.status.hidden = false;
          els.status.textContent = "The species chart didn’t load. Refresh the page.";
        }
      });
  }

  function wireChrome() {
    if (els.tabSol) els.tabSol.addEventListener("click", function () { showZone("sol", true); });
    if (els.tabBeyond) els.tabBeyond.addEventListener("click", function () { showZone("beyond", true); });
    [els.tabSol, els.tabBeyond].forEach(function (tab) {
      if (!tab) return;
      tab.addEventListener("keydown", onTabKey);
    });
    document.addEventListener("pointerdown", function (e) {
      var pin = e.target.closest ? e.target.closest(".map-pin") : null;
      document.querySelectorAll(".map-pin.is-armed").forEach(function (p) {
        if (p !== pin) p.classList.remove("is-armed");
      });
    });
    document.addEventListener("ee:face", function () {
      applyScan();
      fitStarLabels();
    });
    els.scanButtons.forEach(function (btn) {
      btn.addEventListener("click", function () { setLens(btn.getAttribute("data-lens")); });
      btn.addEventListener("keydown", onLensKey);
    });
    if (els.routesToggle) {
      els.routesToggle.addEventListener("click", function () {
        state.routesOn = !state.routesOn;
        els.routesToggle.setAttribute("aria-pressed", state.routesOn ? "true" : "false");
        syncRouteGroups();
        renderRouteLegend();
      });
    }
    if (els.rivalsToggle) {
      els.rivalsToggle.addEventListener("click", function () {
        state.rivalsOn = !state.rivalsOn;
        els.rivalsToggle.setAttribute("aria-pressed", state.rivalsOn ? "true" : "false");
        syncRouteGroups();
        renderRouteLegend();
      });
    }
    if (els.pickBtn) {
      els.pickBtn.addEventListener("click", function () { toggleSpeciesMenu(); });
      els.pickBtn.addEventListener("keydown", onPickKey);
    }
    if (els.pickMenu) els.pickMenu.addEventListener("keydown", onMenuKey);
    if (els.summaryOpen) {
      els.summaryOpen.addEventListener("click", function () {
        if (state.focusId && state.byId[state.focusId]) openSpecies(state.byId[state.focusId], true);
      });
    }
    document.addEventListener("pointerdown", function (e) {
      if (!els.pickMenu || els.pickMenu.hidden) return;
      var pick = e.target.closest ? e.target.closest(".species-pick") : null;
      if (!pick) toggleSpeciesMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && els.pickMenu && !els.pickMenu.hidden) toggleSpeciesMenu(false);
    });
    if (els.close) els.close.addEventListener("click", function () { els.dialog.close(); });
    if (els.flip) {
      els.flip.addEventListener("click", function () {
        state.flipBack = !state.flipBack;
        els.faces.classList.toggle("is-back", state.flipBack);
        els.flip.textContent = state.flipBack ? "See card front" : "See card back";
        els.flip.setAttribute("aria-pressed", state.flipBack ? "true" : "false");
      });
    }
    if (els.dialog) {
      els.dialog.addEventListener("click", function (e) {
        if (e.target === els.dialog) els.dialog.close();
      });
      els.dialog.addEventListener("close", function () {
        state.openId = "";
        if (state.lastFocus && state.lastFocus.focus) state.lastFocus.focus();
        var zoneHash = state.zone === "beyond" ? "#beyond" : "#sol";
        if (location.hash && location.hash !== zoneHash && state.byId[location.hash.slice(1)]) {
          history.replaceState(null, "", zoneHash);
        }
      });
    }
    window.addEventListener("hashchange", function () {
      var id = hashSpecies();
      if (id) {
        var species = state.byId[id];
        if (species.zones.indexOf(state.zone) === -1) showZone(species.zones[0], false);
        openSpecies(species, false);
      } else if (location.hash === "#beyond" || location.hash === "#sol") {
        showZone(location.hash.slice(1), false);
      }
    });
  }

  function setLens(id) {
    if (!id || id === state.lens) return;
    state.lens = id;
    els.scanButtons.forEach(function (btn) {
      var on = btn.getAttribute("data-lens") === id;
      btn.setAttribute("aria-checked", on ? "true" : "false");
      btn.tabIndex = on ? 0 : -1;
    });
    applyScan();
    if (state.openId && state.byId[state.openId] && els.dialog && els.dialog.open) {
      paintScan(state.byId[state.openId]);
    }
  }

  function onLensKey(e) {
    var i = els.scanButtons.indexOf(e.currentTarget);
    var next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = els.scanButtons[(i + 1) % els.scanButtons.length];
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = els.scanButtons[(i - 1 + els.scanButtons.length) % els.scanButtons.length];
    else if (e.key === "Home") next = els.scanButtons[0];
    else if (e.key === "End") next = els.scanButtons[els.scanButtons.length - 1];
    if (!next) return;
    e.preventDefault();
    setLens(next.getAttribute("data-lens"));
    next.focus();
  }

  function onTabKey(e) {
    var tabs = [els.tabSol, els.tabBeyond];
    var i = tabs.indexOf(e.currentTarget);
    var next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = tabs[(i + 1) % 2];
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = tabs[(i + 1) % 2];
    else if (e.key === "Home") next = tabs[0];
    else if (e.key === "End") next = tabs[1];
    if (!next) return;
    e.preventDefault();
    showZone(next === els.tabBeyond ? "beyond" : "sol", true);
    next.focus();
  }

  function initialZone() {
    if (location.hash === "#beyond") return "beyond";
    var id = hashSpecies();
    if (id && state.byId[id] && state.byId[id].zones.indexOf("sol") === -1) return "beyond";
    return "sol";
  }

  function hashSpecies() {
    var id = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    return state.byId[id] ? id : "";
  }

  function showZone(zone, updateHash) {
    state.zone = zone === "beyond" ? "beyond" : "sol";
    var beyond = state.zone === "beyond";
    els.solPanel.hidden = beyond;
    els.beyondPanel.hidden = !beyond;
    els.tabSol.setAttribute("aria-selected", beyond ? "false" : "true");
    els.tabBeyond.setAttribute("aria-selected", beyond ? "true" : "false");
    els.tabSol.tabIndex = beyond ? -1 : 0;
    els.tabBeyond.tabIndex = beyond ? 0 : -1;
    if (!reduced) {
      var panel = beyond ? els.beyondPanel : els.solPanel;
      panel.classList.remove("is-entering");
      void panel.offsetWidth;
      panel.classList.add("is-entering");
    }
    els.note.textContent = beyond
      ? "Direction is right ascension, counterclockwise from the 0h mark at the top, with a small sideways shift so stacked stars stay tappable. Rings are logarithmic distances in light-years. The moving marker is Tumble Fair. It has no homeworld."
      : "Stylized, not to scale, so the moons we trade with can be tapped. The moving marker is Tumble Fair, riding a visitor through the system. It has no homeworld.";
    renderIndex();
    if (updateHash && !els.dialog.open) {
      history.replaceState(null, "", beyond ? "#beyond" : "#sol");
    }
  }

  function renderIndex() {
    var zone = state.zone;
    var list = state.species.filter(function (s) { return s.zones.indexOf(zone) !== -1; });
    list.sort(function (a, b) { return a.order - b.order; });
    els.indexTitle.textContent = zone === "beyond" ? "Beyond Sol" : "Sol system";
    els.index.replaceChildren();
    list.forEach(function (s) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "index-species";
      btn.innerHTML = "<i class=\"key-shape\" aria-hidden=\"true\"></i><span class=\"index-copy\"><span class=\"index-name\"></span><span class=\"index-world\"></span></span>";
      var shape = btn.querySelector(".key-shape");
      var rank = rankOf(s);
      shape.className = "key-shape shape-" + rank.shape + " rank-" + rank.value;
      btn.querySelector(".index-name").textContent = s.name;
      btn.querySelector(".index-world").textContent = s.wander ? "No homeworld · wandering" : (s.bodyLabel || s.mapLabel || s.homeworld);
      btn.addEventListener("click", function () { openSpecies(s, true); });
      li.appendChild(btn);
      els.index.appendChild(li);
    });
  }

  function lensDef() {
    for (var i = 0; i < LENSES.length; i++) {
      if (LENSES[i].id === state.lens) return LENSES[i];
    }
    return LENSES[0];
  }

  function rankOf(species) {
    var lens = lensDef();
    var value = species && species[lens.field] ? species[lens.field] : "";
    return {
      value: value || "neutral",
      label: RANK_LABEL[value] || value || "Unrated",
      shape: RANK_SHAPE[value] || "circle"
    };
  }

  function applyScan() {
    var lens = lensDef();
    document.querySelectorAll(".map-pin").forEach(function (pin) {
      var species = state.byId[pin.dataset.id];
      if (!species) return;
      var rank = rankOf(species);
      pin.classList.remove("shape-circle", "shape-square", "shape-triangle", "shape-diamond");
      Array.prototype.slice.call(pin.classList).forEach(function (c) {
        if (c.indexOf("rank-") === 0) pin.classList.remove(c);
      });
      pin.classList.add("shape-" + rank.shape, "rank-" + rank.value);
      pin.setAttribute("aria-label", pinLabel(species) + ". " + lens.label + ": " + rank.label + ". Open dossier.");
    });
    renderScanLegend();
    renderRouteLegend();
    if (els.index && state.species.length) renderIndex();
  }

  function renderScanLegend() {
    if (!els.scanLegend) return;
    var lens = lensDef();
    var seen = [];
    var order = Object.keys(RANK_LABEL);
    state.species.forEach(function (s) {
      var value = s[lens.field];
      if (value && seen.indexOf(value) === -1) seen.push(value);
    });
    seen.sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); });
    els.scanLegend.replaceChildren();
    var lead = document.createElement("li");
    lead.className = "legend-lead";
    lead.textContent = "Scan mode · " + lens.label;
    els.scanLegend.appendChild(lead);
    seen.forEach(function (value) {
      var li = document.createElement("li");
      var mark = document.createElement("i");
      mark.className = "key-shape shape-" + (RANK_SHAPE[value] || "circle") + " rank-" + value;
      mark.setAttribute("aria-hidden", "true");
      var name = document.createElement("span");
      name.textContent = RANK_LABEL[value] || value;
      li.appendChild(mark);
      li.appendChild(name);
      els.scanLegend.appendChild(li);
    });
  }

  function renderRouteLegend() {
    if (!els.routeLegend) return;
    els.routeLegend.replaceChildren();
    var lead = document.createElement("li");
    lead.className = "legend-lead";
    lead.textContent = state.routesOn ? "Routes" : "Routes off";
    els.routeLegend.appendChild(lead);
    [
      ["route-key route-key-s3", "Frequent or valuable"],
      ["route-key route-key-s2", "Steady"],
      ["route-key route-key-s1", "Occasional"],
      ["route-key route-key-alliance", "Alliance"]
    ].forEach(function (row) {
      var li = document.createElement("li");
      var mark = document.createElement("i");
      mark.className = row[0];
      mark.setAttribute("aria-hidden", "true");
      var name = document.createElement("span");
      name.textContent = row[1];
      li.appendChild(mark);
      li.appendChild(name);
      els.routeLegend.appendChild(li);
    });
    if (state.rivalsOn) {
      var li = document.createElement("li");
      var mark = document.createElement("i");
      mark.className = "route-key route-key-rival";
      mark.setAttribute("aria-hidden", "true");
      var name = document.createElement("span");
      name.textContent = "Rivalry · no trade";
      li.appendChild(mark);
      li.appendChild(name);
      els.routeLegend.appendChild(li);
    }
  }

  function drawSol() {
    var svg = emptySvg(els.solBoard);
    chartCaption(svg, "SOL SYSTEM", "Stylized · not to scale");
    ORBIT_R.forEach(function (r) {
      svg.appendChild(svgEl("circle", {
        class: "orbit-ring",
        cx: VB.cx, cy: VB.cy, r: r
      }));
    });
    svg.appendChild(svgEl("circle", {
      class: "belt-ring",
      cx: VB.cx, cy: VB.cy, r: 178
    }));
    var points = {};
    PLANETS.forEach(function (p) { points[p.id] = at(p.r, p.deg); });
    Object.keys(SOL_GEOM).forEach(function (id) {
      var g = SOL_GEOM[id];
      points[id] = at(g.r, g.deg);
    });
    var solPath = patrol(150, 980, 755, -36, 28);
    points["tumble-fair"] = solPath[Math.floor(solPath.length * 0.28)];
    drawRouteLayer(svg, points, "sol");
    MOON_LINKS.forEach(function (pair) {
      var a = points[pair[0]];
      var b = points[pair[1]];
      if (!a || !b) return;
      svg.appendChild(svgEl("line", {
        class: "moon-link",
        x1: a.x, y1: a.y, x2: b.x, y2: b.y,
        "data-a": pair[0],
        "data-b": pair[1]
      }));
    });
    haloAndSun(svg);
    PLANETS.forEach(function (p) {
      var pt = points[p.id];
      bodyDisc(svg, pt, p.disc, p.fill, p.ring, p.id);
      placeLabel(svg, pt, p.ldx, p.ldy, p.anchor, p.name, p.sub || "", p.id);
    });
    state.species.filter(inSol).forEach(function (s) {
      if (s.wander) return;
      var g = SOL_GEOM[s.id];
      if (!g) return;
      var pt = points[s.id];
      bodyDisc(svg, pt, g.disc, g.fill, false, s.id);
      placeLabel(svg, pt, g.ldx, g.ldy, g.anchor, s.bodyLabel || s.name, "", s.id);
      addPin(els.solBoard, s, pt);
    });
    addWander(els.solBoard, svg, solPath, wanderSpecies());
  }

  function drawBeyond() {
    var svg = emptySvg(els.beyondBoard);
    chartCaption(svg, "BEYOND SOL", "Real direction · log distance");
    svg.appendChild(svgEl("line", {
      class: "ra-tick",
      x1: VB.cx, y1: 18, x2: VB.cx, y2: 48
    }));
    var raLabel = svgEl("text", { class: "ra-label", x: VB.cx + 8, y: 32 });
    raLabel.textContent = "0h";
    svg.appendChild(raLabel);

    [10, 40, 500, 2000].forEach(function (ly) {
      var r = logR(ly);
      svg.appendChild(svgEl("circle", { class: "dist-ring", cx: VB.cx, cy: VB.cy, r: round(r) }));
      var label = svgEl("text", {
        class: "ring-label",
        x: VB.cx,
        y: round(VB.cy + r + 16),
        "text-anchor": "middle"
      });
      label.textContent = ly === 2000 ? "2,000 ly" : ly + " ly";
      svg.appendChild(label);
    });

    haloAndSun(svg);
    var sunLabel = svgEl("text", { class: "map-label sun-word", x: VB.cx, y: VB.cy + 28, "text-anchor": "middle" });
    sunLabel.textContent = "Sol";
    svg.appendChild(sunLabel);

    var points = { earth: { x: VB.cx, y: VB.cy } };
    var stars = state.species.filter(function (s) { return s.star && s.ra != null; }).map(function (s) {
      var ra = s.ra * Math.PI / 180;
      var r = logR(s.distanceLy);
      var radial = { x: -Math.sin(ra), y: -Math.cos(ra) };
      var tangent = { x: Math.cos(ra), y: -Math.sin(ra) };
      var slide = (s.dec / 90) * 34 + (TANGENT_NUDGE[s.star] || 0);
      var x = VB.cx + radial.x * r + tangent.x * slide;
      var y = VB.cy + radial.y * r + tangent.y * slide;
      return { species: s, x: x, y: y };
    });
    stars.forEach(function (star) { points[star.species.id] = { x: star.x, y: star.y }; });
    var beyondPath = patrol(130, 340, 718, -16, 22);
    points["tumble-fair"] = beyondPath[Math.floor(beyondPath.length * 0.28)];
    drawRouteLayer(svg, points, "beyond");

    stars.forEach(function (star) {
      var place = STAR_LABEL[star.species.star] || { x: star.x + 36, y: star.y - 28, anchor: "start" };
      var leader = svgEl("line", {
        class: "map-leader label-leader",
        x1: round(star.x), y1: round(star.y),
        x2: round(place.x), y2: round(place.y),
        "data-body": star.species.id
      });
      svg.appendChild(leader);
      var text = svgEl("text", {
        class: "map-label star-label",
        x: round(place.x),
        y: round(place.y),
        "text-anchor": place.anchor,
        "data-x": round(place.x),
        "data-sx": round(star.x),
        "data-sy": round(star.y),
        "data-body": star.species.id
      });
      var name = svgEl("tspan", { x: round(place.x), dy: "0" });
      name.textContent = star.species.mapLabel || star.species.homeworld;
      var dist = svgEl("tspan", { class: "star-dist", x: round(place.x), dy: "14" });
      dist.textContent = star.species.distanceLabel || "";
      text.appendChild(name);
      text.appendChild(dist);
      svg.appendChild(text);
      addPin(els.beyondBoard, star.species, { x: star.x, y: star.y });
    });
    addWander(els.beyondBoard, svg, beyondPath, wanderSpecies());
  }

  function addWander(board, svg, path, species) {
    if (!species) return;
    var poly = svgEl("polyline", {
      class: "wander-path",
      points: path.map(function (p) { return round(p.x) + "," + round(p.y); }).join(" "),
      "data-body": species.id
    });
    svg.appendChild(poly);
    var pin = addPin(board, species, path[Math.floor(path.length * 0.28)]);
    pin.classList.add("pin-wander");
    if (reduced) return;
    var start = performance.now();
    var duration = 46000;
    function frame(now) {
      var t = ((now - start) % duration) / duration;
      var p = pointOnLoop(path, t);
      pin.style.left = (p.x / VB.w * 100) + "%";
      pin.style.top = (p.y / VB.h * 100) + "%";
      board.querySelectorAll(".route-line").forEach(function (line) {
        if (line.dataset.from === species.id) {
          line.setAttribute("x1", round(p.x));
          line.setAttribute("y1", round(p.y));
        }
        if (line.dataset.to === species.id) {
          line.setAttribute("x2", round(p.x));
          line.setAttribute("y2", round(p.y));
        }
      });
      pin._raf = requestAnimationFrame(frame);
    }
    pin._raf = requestAnimationFrame(frame);
  }

  function addPin(board, species, pt) {
    var pin = document.createElement("button");
    pin.type = "button";
    pin.className = "map-pin";
    pin.dataset.id = species.id;
    pin.style.left = (pt.x / VB.w * 100) + "%";
    pin.style.top = (pt.y / VB.h * 100) + "%";
    pin.setAttribute("aria-label", pinLabel(species) + ". Open dossier.");
    pin.addEventListener("pointerenter", function () { setHover(species.id); });
    pin.addEventListener("pointerleave", function () { setHover(""); });
    pin.addEventListener("focus", function () { setHover(species.id); });
    pin.addEventListener("blur", function () { setHover(""); });
    if (pt.y < 150) pin.classList.add("tip-below");
    var dot = document.createElement("span");
    dot.className = "pin-dot";
    dot.setAttribute("aria-hidden", "true");
    var tip = document.createElement("span");
    tip.className = "pin-tip";
    tip.setAttribute("aria-hidden", "true");
    var strong = document.createElement("strong");
    strong.textContent = species.name;
    var world = document.createElement("span");
    world.textContent = species.wander ? "No homeworld · just passing through" : species.homeworld;
    tip.appendChild(strong);
    tip.appendChild(world);
    pin.appendChild(dot);
    pin.appendChild(tip);
    pin.addEventListener("click", function () {
      if (coarseQuery.matches && !pin.classList.contains("is-armed")) {
        pin.classList.add("is-armed");
        return;
      }
      openSpecies(species, true);
    });
    board.appendChild(pin);
    return pin;
  }

  function openSpecies(species, fromUser) {
    if (!species || !els.dialog) return;
    state.openId = species.id;
    state.flipBack = false;
    els.faces.classList.remove("is-back");
    var where = species.zones.indexOf("beyond") !== -1 && species.zones.indexOf("sol") === -1 ? "Beyond Sol" : (species.wander ? "Wandering" : "Sol system");
    els.kicker.textContent = where;
    els.title.textContent = species.name;
    var home = species.homeworld;
    if (species.distanceLabel) {
      home += " · " + species.distanceLabel;
      if (species.constellation) home += " · " + species.constellation;
    }
    els.home.textContent = home;
    els.facts.replaceChildren();
    [
      ["realFact", "Real fact"],
      ["folklore", "Folklore nod"],
      ["look", "Look"],
      ["trade", "Trade"],
      ["tradeRule", "Trade rule"],
      ["weakness", "Weakness"],
      ["rival", "Rival"],
      ["canister", "Canister"]
    ].forEach(function (row) {
      if (!species[row[0]]) return;
      var dt = document.createElement("dt");
      dt.textContent = row[1];
      var dd = document.createElement("dd");
      dd.textContent = species[row[0]];
      els.facts.appendChild(dt);
      els.facts.appendChild(dd);
    });
    paintScan(species);
    paintRoutes(species);
    var paper = els.faces.querySelector(".sd-front.sd-paper");
    var dark = els.faces.querySelector(".sd-front.sd-dark");
    var backPaper = els.faces.querySelector(".sd-back.sd-paper");
    var backDark = els.faces.querySelector(".sd-back.sd-dark");
    if (species.card) {
      var base = "images/dossiers/" + species.card;
      paper.src = base + "-card.webp";
      dark.src = base + "-card-dark.webp";
      paper.alt = species.name + " dossier card";
      dark.alt = species.name + " dossier card, dark schematic";
      els.faces.hidden = false;
      els.pending.hidden = true;
      if (species.cardBack) {
        backPaper.src = base + "-back.webp";
        backDark.src = base + "-back-dark.webp";
        backPaper.alt = "Back of the " + species.name + " card";
        backDark.alt = "Back of the " + species.name + " card, dark schematic";
        els.flip.hidden = false;
        els.flip.textContent = "See card back";
        els.flip.setAttribute("aria-pressed", "false");
      } else {
        backPaper.removeAttribute("src");
        backDark.removeAttribute("src");
        els.flip.hidden = true;
      }
    } else {
      els.faces.hidden = true;
      els.pending.hidden = false;
      els.pendingName.textContent = species.name;
      els.flip.hidden = true;
    }
    state.lastFocus = document.activeElement;
    if (fromUser !== false) {
      history.replaceState(null, "", "#" + species.id);
    }
    if (!els.dialog.open) els.dialog.showModal();
  }

  function paintScan(species) {
    var old = document.getElementById("sd-scan");
    if (old) old.remove();
    var lens = lensDef();
    var wrap = document.createElement("div");
    wrap.id = "sd-scan";
    wrap.className = "sd-scan";
    var kicker = document.createElement("p");
    kicker.className = "sd-scan-kicker";
    kicker.textContent = "Scan · draft";
    wrap.appendChild(kicker);
    var list = document.createElement("ul");
    LENSES.forEach(function (item) {
      var value = species[item.field] || "";
      var li = document.createElement("li");
      if (item.id === lens.id) li.className = "is-on";
      var mark = document.createElement("i");
      mark.className = "key-shape shape-" + (RANK_SHAPE[value] || "circle") + " rank-" + (value || "neutral");
      mark.setAttribute("aria-hidden", "true");
      var text = document.createElement("span");
      text.textContent = item.label + " · " + (RANK_LABEL[value] || "Unrated");
      li.appendChild(mark);
      li.appendChild(text);
      list.appendChild(li);
    });
    wrap.appendChild(list);
    els.facts.insertAdjacentElement("afterend", wrap);
  }

  function paintRoutes(species) {
    var old = document.getElementById("sd-routes");
    if (old) old.remove();
    var wrap = document.createElement("div");
    wrap.id = "sd-routes";
    wrap.className = "sd-scan";
    var kicker = document.createElement("p");
    kicker.className = "sd-scan-kicker";
    kicker.textContent = "Routes · draft";
    wrap.appendChild(kicker);
    var list = document.createElement("ul");
    var found = false;
    state.routes.forEach(function (route) {
      if (route.from !== species.id && route.to !== species.id) return;
      found = true;
      var other = route.from === species.id ? route.to : route.from;
      var li = document.createElement("li");
      var word = route.type === "alliance" ? "Alliance" : (route.strength >= 3 ? "Frequent" : (route.strength === 2 ? "Steady" : "Occasional"));
      li.textContent = partnerName(other) + " · " + word + ". " + (route.note || "");
      list.appendChild(li);
    });
    state.rivalries.forEach(function (route) {
      if (route.from !== species.id && route.to !== species.id) return;
      var other = route.from === species.id ? route.to : route.from;
      var li = document.createElement("li");
      li.className = "is-rival";
      li.textContent = "No trade with " + partnerName(other) + ". " + (route.note || "");
      list.appendChild(li);
    });
    if (!found) {
      var li = document.createElement("li");
      li.textContent = "No trade route. They don't buy or sell cargo.";
      list.appendChild(li);
    }
    wrap.appendChild(list);
    var scan = document.getElementById("sd-scan");
    (scan || els.facts).insertAdjacentElement("afterend", wrap);
  }

  function partnerName(id) {
    if (id === "earth") return "Earth (Sol-3 outpost)";
    return state.byId[id] ? state.byId[id].name : id;
  }

  function drawRouteLayer(svg, points, zone) {
    var trade = svgEl("g", { class: "route-trade" });
    var rival = svgEl("g", { class: "route-rival" });
    state.routes.slice().sort(function (a, b) { return a.strength - b.strength; }).forEach(function (route) {
      addRouteLine(trade, route, points, zone, false);
    });
    state.rivalries.forEach(function (route) {
      addRouteLine(rival, route, points, zone, true);
    });
    paintBay(rival, zone);
    svg.appendChild(trade);
    svg.appendChild(rival);
    syncRouteGroups();
  }

  function addRouteLine(group, route, points, zone, isRival) {
    var a = locate(route.from, points, zone);
    var b = locate(route.to, points, zone);
    if (!a || !b || (!a.pt && !b.pt)) return;
    if (!a.onChart && !b.onChart) return;
    if (!a.onChart || !b.onChart) {
      if (!isRival) return;
      var home = a.onChart ? a.pt : b.pt;
      if (!home) return;
      if (!group._bay) group._bay = [];
      group._bay.push({
        home: home,
        missingId: a.onChart ? route.to : route.from,
        from: route.from,
        to: route.to
      });
      return;
    }
    var endA = a.pt;
    var endB = b.pt;
    var cls = "route-line";
    if (isRival) cls += " route-rival-line";
    else cls += " route-s" + clamp(route.strength || 1, 1, 3) + (route.type === "alliance" ? " route-alliance" : "");
    var line = svgEl("line", {
      class: cls,
      x1: round(endA.x), y1: round(endA.y),
      x2: round(endB.x), y2: round(endB.y),
      "data-from": route.from,
      "data-to": route.to
    });
    group.appendChild(line);
    if (!isRival && route.strength >= 3 && !reduced) {
      var flow = svgEl("line", {
        class: cls + " route-flow",
        x1: line.getAttribute("x1"), y1: line.getAttribute("y1"),
        x2: line.getAttribute("x2"), y2: line.getAttribute("y2"),
        "data-from": route.from,
        "data-to": route.to
      });
      group.appendChild(flow);
    }
  }

  function paintBay(group, zone) {
    var items = group._bay || [];
    var x = 44;
    var y0 = zone === "sol" ? 812 : 818;
    items.forEach(function (item, i) {
      var y = y0 - i * 22;
      group.appendChild(svgEl("line", {
        class: "route-line route-rival-line",
        x1: round(item.home.x), y1: round(item.home.y),
        x2: x + 4, y2: round(y - 4),
        "data-from": item.from,
        "data-to": item.to
      }));
      var tag = svgEl("text", {
        class: "map-label edge-tag",
        x: x,
        y: round(y),
        "text-anchor": "start"
      });
      tag.textContent = partnerName(item.missingId);
      group.appendChild(tag);
    });
  }

  function locate(id, points, zone) {
    if (id === "earth") {
      return points.earth ? { pt: points.earth, onChart: true } : null;
    }
    var species = state.byId[id];
    if (!species) return null;
    if (species.zones.indexOf(zone) === -1) return { pt: null, onChart: false };
    if (!points[id]) return null;
    return { pt: points[id], onChart: true };
  }

  function syncRouteGroups() {
    document.querySelectorAll(".route-trade").forEach(function (g) {
      if (state.routesOn) g.removeAttribute("display");
      else g.setAttribute("display", "none");
    });
    document.querySelectorAll(".route-rival").forEach(function (g) {
      if (state.rivalsOn) g.removeAttribute("display");
      else g.setAttribute("display", "none");
    });
  }

  function setHover(id) {
    applyHighlight(id || state.focusId || "");
  }

  function applyHighlight(id) {
    var on = !!id;
    document.querySelectorAll(".map-board").forEach(function (board) {
      board.classList.toggle("is-picked", on);
    });
    document.querySelectorAll(".route-line").forEach(function (line) {
      var hot = on && (line.dataset.from === id || line.dataset.to === id);
      line.classList.toggle("is-hot", hot);
      line.classList.toggle("is-dim", on && !hot);
    });
    document.querySelectorAll(".map-pin, [data-body], .moon-link").forEach(function (el) {
      var key = el.dataset.body || el.dataset.id || "";
      var hot = on && (key === id || el.dataset.a === id || el.dataset.b === id);
      el.classList.toggle("is-hot", hot);
    });
  }

  function fillSpeciesMenu() {
    if (!els.pickMenu) return;
    els.pickMenu.replaceChildren();
    addPickOption("", "All species");
    addPickGroup("Sol system", state.species.filter(function (s) {
      return s.zones.indexOf("sol") !== -1;
    }));
    addPickGroup("Beyond Sol", state.species.filter(function (s) {
      return s.zones.indexOf("beyond") !== -1 && s.zones.indexOf("sol") === -1;
    }));
  }

  function addPickGroup(label, list) {
    var group = document.createElement("div");
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", label);
    var head = document.createElement("p");
    head.className = "species-menu-label";
    head.textContent = label;
    group.appendChild(head);
    list.sort(function (a, b) { return a.order - b.order; }).forEach(function (s) {
      group.appendChild(pickOption(s.id, s.name));
    });
    els.pickMenu.appendChild(group);
  }

  function addPickOption(id, name) {
    els.pickMenu.appendChild(pickOption(id, name));
  }

  function pickOption(id, name) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("role", "option");
    btn.dataset.id = id;
    btn.textContent = name;
    btn.setAttribute("aria-selected", id === state.focusId ? "true" : "false");
    btn.addEventListener("click", function () {
      chooseSpecies(id);
    });
    return btn;
  }

  function toggleSpeciesMenu(force) {
    if (!els.pickMenu || !els.pickBtn) return;
    var open = typeof force === "boolean" ? force : els.pickMenu.hidden;
    els.pickMenu.hidden = !open;
    els.pickBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      var current = els.pickMenu.querySelector("[aria-selected='true']") || els.pickMenu.querySelector("button");
      if (current) current.focus();
    }
  }

  function onPickKey(e) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleSpeciesMenu(true);
    }
  }

  function onMenuKey(e) {
    var buttons = els.pickMenu.querySelectorAll("button");
    var list = Array.prototype.slice.call(buttons);
    var i = list.indexOf(document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      list[Math.min(list.length - 1, i + 1)] && list[Math.min(list.length - 1, i + 1)].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      list[Math.max(0, i - 1)] && list[Math.max(0, i - 1)].focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      list[0].focus();
    } else if (e.key === "End") {
      e.preventDefault();
      list[list.length - 1].focus();
    } else if (e.key === "Escape") {
      toggleSpeciesMenu(false);
      if (els.pickBtn) els.pickBtn.focus();
    }
  }

  function chooseSpecies(id) {
    state.focusId = id || "";
    if (els.pickBtn) els.pickBtn.textContent = id && state.byId[id] ? state.byId[id].name : "All species";
    if (els.pickMenu) {
      els.pickMenu.querySelectorAll("[role='option']").forEach(function (btn) {
        btn.setAttribute("aria-selected", btn.dataset.id === state.focusId ? "true" : "false");
      });
    }
    toggleSpeciesMenu(false);
    paintSummary(id ? state.byId[id] : null);
    applyHighlight(state.focusId);
    if (id) revealSpecies(id);
  }

  function paintSummary(species) {
    if (!els.summary) return;
    if (!species) {
      els.summary.hidden = true;
      return;
    }
    els.summary.hidden = false;
    els.summaryOpen.textContent = species.name;
    els.sumStanding.textContent = species.tradeStanding || "Unrated";
    els.sumWith.textContent = species.tradesWith || "Earth / Sol-3";
    paintCargo(species);
    els.sumRival.textContent = species.wontTradeWith || "None";
  }

  function paintCargo(species) {
    var phrase = species.valuableCargo || "Unlisted";
    var url = String(species.shop_url || "").trim();
    els.sumCargo.replaceChildren();
    if (!url) {
      els.sumCargo.textContent = phrase;
      return;
    }
    var link = document.createElement("a");
    link.href = url;
    link.textContent = phrase;
    els.sumCargo.appendChild(link);
  }

  function revealSpecies(id) {
    var species = state.byId[id];
    if (!species) return;
    if (species.zones.indexOf(state.zone) === -1) showZone(species.zones[0], true);
    var board = state.zone === "beyond" ? els.beyondBoard : els.solBoard;
    var pin = board.querySelector('.map-pin[data-id="' + id + '"]');
    if (!pin) return;
    var scroller = pin.closest(".map-scroll");
    if (scroller) {
      var pinRect = pin.getBoundingClientRect();
      var scRect = scroller.getBoundingClientRect();
      scroller.scrollLeft += (pinRect.left + pinRect.width / 2) - (scRect.left + scRect.width / 2);
      scroller.scrollTop += (pinRect.top + pinRect.height / 2) - (scRect.top + scRect.height / 2);
    }
    var panel = state.zone === "beyond" ? els.beyondPanel : els.solPanel;
    if (panel && panel.scrollIntoView) panel.scrollIntoView({ block: "nearest", inline: "nearest" });
    pin.focus({ preventScroll: true });
  }

  function fitStarLabels() {
    document.querySelectorAll(".map-board").forEach(function (board) {
      var panel = board.closest("[role='tabpanel']");
      var wasHidden = panel && panel.hidden;
      if (wasHidden) panel.hidden = false;
      board.querySelectorAll(".star-label").forEach(function (text) {
        var base = parseFloat(text.getAttribute("data-x"));
        if (!isNaN(base)) {
          text.setAttribute("x", base);
          text.querySelectorAll("tspan").forEach(function (t) { t.setAttribute("x", base); });
        }
        var box = text.getBBox();
        if (!box.width) return;
        var shift = 0;
        if (box.x < 12) shift = 12 - box.x;
        if (box.x + box.width > VB.w - 12) shift = (VB.w - 12) - (box.x + box.width);
        if (shift) {
          var x = (isNaN(base) ? box.x : base) + shift;
          text.setAttribute("x", round(x));
          text.querySelectorAll("tspan").forEach(function (t) { t.setAttribute("x", round(x)); });
          box = text.getBBox();
        }
        var leader = text.previousElementSibling;
        if (!leader || leader.tagName.toLowerCase() !== "line") return;
        var sx = parseFloat(text.getAttribute("data-sx"));
        var meetX = sx < box.x + box.width / 2 ? box.x - 8 : box.x + box.width + 8;
        var meetY = box.y + Math.min(18, box.height * 0.42);
        leader.setAttribute("x2", round(meetX));
        leader.setAttribute("y2", round(meetY));
      });
      if (wasHidden) panel.hidden = true;
    });
  }

  function pinLabel(species) {
    if (species.wander) return species.name + ". No homeworld. Just passing through";
    return species.name + ". " + species.homeworld;
  }

  function pinClass(canister) {
    var map = {
      "Lab quarantine": "pin-teal",
      "Cargo": "pin-orange",
      "Salvage worn": "pin-purple",
      "Alien recover": "pin-rose",
      "Wayfinder Lantern": "pin-gold"
    };
    return map[canister] || "pin-teal";
  }

  function inSol(s) { return s.zones.indexOf("sol") !== -1; }
  function wanderSpecies() {
    for (var i = 0; i < state.species.length; i++) {
      if (state.species[i].wander) return state.species[i];
    }
    return null;
  }

  function emptySvg(board) {
    board.querySelectorAll("svg").forEach(function (n) { n.remove(); });
    var svg = svgEl("svg", {
      viewBox: "0 0 " + VB.w + " " + VB.h,
      class: "map-svg",
      "aria-hidden": "true",
      focusable: "false"
    });
    board.appendChild(svg);
    return svg;
  }

  function chartCaption(svg, title, sub) {
    var t = svgEl("text", { class: "chart-title", x: 28, y: 40 });
    t.textContent = title;
    svg.appendChild(t);
    var s = svgEl("text", { class: "chart-sub", x: 28, y: 60 });
    s.textContent = sub;
    svg.appendChild(s);
  }

  function haloAndSun(svg) {
    svg.appendChild(svgEl("circle", { class: "sol-sun-halo", cx: VB.cx, cy: VB.cy, r: 26 }));
    svg.appendChild(svgEl("circle", { class: "sol-sun", cx: VB.cx, cy: VB.cy, r: 14 }));
  }

  function bodyDisc(svg, pt, disc, fill, ring, id) {
    var discEl = svgEl("circle", {
      class: "body-disc fill-" + fill,
      cx: round(pt.x), cy: round(pt.y), r: disc
    });
    if (id) discEl.setAttribute("data-body", id);
    svg.appendChild(discEl);
    if (ring) {
      var ringEl = svgEl("ellipse", {
        class: "saturn-ring",
        cx: round(pt.x), cy: round(pt.y),
        rx: disc + 8, ry: 3.4,
        transform: "rotate(-22 " + round(pt.x) + " " + round(pt.y) + ")"
      });
      if (id) ringEl.setAttribute("data-body", id);
      svg.appendChild(ringEl);
    }
  }

  function placeLabel(svg, pt, ldx, ldy, anchor, name, sub, id) {
    var x = pt.x + ldx;
    var y = pt.y + ldy;
    if (Math.hypot(ldx, ldy) > 8) {
      var leader = svgEl("line", {
        class: "map-leader",
        x1: round(pt.x), y1: round(pt.y),
        x2: round(x), y2: round(y - 4)
      });
      if (id) leader.setAttribute("data-body", id);
      svg.appendChild(leader);
    }
    var text = svgEl("text", {
      class: "map-label",
      x: round(x),
      y: round(y),
      "text-anchor": anchor || "middle"
    });
    if (id) text.setAttribute("data-body", id);
    text.textContent = name;
    svg.appendChild(text);
    if (sub) {
      var small = svgEl("text", {
        class: "map-label map-sub",
        x: round(x),
        y: round(y + 16),
        "text-anchor": anchor || "middle"
      });
      if (id) small.setAttribute("data-body", id);
      small.textContent = sub;
      svg.appendChild(small);
    }
  }

  function at(r, deg) {
    var a = deg * Math.PI / 180;
    return { x: VB.cx + r * Math.cos(a), y: VB.cy - r * Math.sin(a) };
  }

  function logR(ly) {
    var t = (Math.log10(ly) - LOG_MIN) / (LOG_MAX - LOG_MIN);
    return 96 + t * 286;
  }

  function patrol(x0, x1, y, amp, steps) {
  var forward = [];
  var i, t;
  for (i = 0; i < steps; i++) {
    t = i / (steps - 1);
    forward.push({ x: x0 + (x1 - x0) * t, y: y + Math.sin(t * Math.PI) * amp });
  }
  return forward.concat(forward.slice(1, -1).reverse());
}

function pointOnLoop(pts, t) {
    var n = pts.length;
    var f = t * n;
    var i = Math.floor(f) % n;
    var j = (i + 1) % n;
    var u = f - Math.floor(f);
    if (!pts[i] || !pts[j]) return pts[0];
    return {
      x: pts[i].x + (pts[j].x - pts[i].x) * u,
      y: pts[i].y + (pts[j].y - pts[i].y) * u
    };
  }

  function svgEl(name, attrs) {
    var el = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    return el;
  }

  function round(n) { return Math.round(n * 10) / 10; }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
})();
