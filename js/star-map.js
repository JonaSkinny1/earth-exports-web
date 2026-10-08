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
  var LABEL_SIDE = {
    "trappist-1": -1,
    "fomalhaut": 1,
    "kepler-186": -1,
    "kepler-62": 1,
    "kepler-452": 1,
    "kepler-47": -1,
    "tau-ceti": -1,
    "epsilon-eridani": 1,
    "luyten": 1,
    "55-cancri": -1,
    "proxima": -1,
    "barnard": 1
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
    zone: "sol",
    lastFocus: null,
    flipBack: false
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
    els.legend = document.getElementById("canister-legend");
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
        state.species.forEach(function (s) { state.byId[s.id] = s; });
        drawSol();
        drawBeyond();
        renderLegend();
        showZone(initialZone(), false);
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
    document.addEventListener("ee:face", renderLegend);
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
      btn.innerHTML = "<span class=\"index-name\"></span><span class=\"index-world\"></span>";
      btn.querySelector(".index-name").textContent = s.name;
      btn.querySelector(".index-world").textContent = s.wander ? "No homeworld · wandering" : (s.bodyLabel || s.mapLabel || s.homeworld);
      btn.addEventListener("click", function () { openSpecies(s, true); });
      li.appendChild(btn);
      els.index.appendChild(li);
    });
  }

  function renderLegend() {
    if (!els.legend) return;
    var cv = document.documentElement.getAttribute("data-face") === "cv";
    els.legend.replaceChildren();
    var lead = document.createElement("li");
    lead.className = "legend-lead";
    lead.textContent = cv
      ? "Each glow is a species. On this deck the marker is icy blue."
      : "Marker color is the canister that species ships in.";
    els.legend.appendChild(lead);
    if (cv) return;
    CANISTERS.forEach(function (pair) {
      var li = document.createElement("li");
      li.innerHTML = "<span class=\"swatch swatch-" + pair[1] + "\" aria-hidden=\"true\"></span><span></span>";
      li.querySelector("span:last-child").textContent = pair[0];
      els.legend.appendChild(li);
    });
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
    MOON_LINKS.forEach(function (pair) {
      var a = points[pair[0]];
      var b = points[pair[1]];
      if (!a || !b) return;
      svg.appendChild(svgEl("line", {
        class: "moon-link",
        x1: a.x, y1: a.y, x2: b.x, y2: b.y
      }));
    });
    haloAndSun(svg);
    PLANETS.forEach(function (p) {
      var pt = points[p.id];
      bodyDisc(svg, pt, p.disc, p.fill, p.ring);
      placeLabel(svg, pt, p.ldx, p.ldy, p.anchor, p.name, p.sub || "");
    });
    state.species.filter(inSol).forEach(function (s) {
      if (s.wander) return;
      var g = SOL_GEOM[s.id];
      if (!g) return;
      var pt = points[s.id];
      bodyDisc(svg, pt, g.disc, g.fill, false);
      placeLabel(svg, pt, g.ldx, g.ldy, g.anchor, s.bodyLabel || s.name, "");
      addPin(els.solBoard, s, pt);
    });
    addWander(els.solBoard, svg, patrol(150, 980, 755, -36, 28), wanderSpecies());
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
        x: round(VB.cx + r * 0.98),
        y: round(VB.cy - r * 0.08)
      });
      label.textContent = ly >= 1000 ? (ly / 1000) + ",000 ly" : ly + " ly";
      if (ly === 2000) label.textContent = "2,000 ly";
      svg.appendChild(label);
    });

    haloAndSun(svg);
    var sunLabel = svgEl("text", { class: "map-label sun-word", x: VB.cx, y: VB.cy + 28, "text-anchor": "middle" });
    sunLabel.textContent = "Sol";
    svg.appendChild(sunLabel);

    var stars = state.species.filter(function (s) { return s.star && s.ra != null; }).map(function (s) {
      var ra = s.ra * Math.PI / 180;
      var r = logR(s.distanceLy);
      var radial = { x: -Math.sin(ra), y: -Math.cos(ra) };
      var tangent = { x: Math.cos(ra), y: -Math.sin(ra) };
      var nudge = (s.dec / 90) * 34;
      return {
        species: s,
        r: r,
        tx: tangent.x,
        ty: tangent.y,
        rx: radial.x,
        ry: radial.y,
        trueX: VB.cx + radial.x * r,
        trueY: VB.cy + radial.y * r,
        x: VB.cx + radial.x * r + tangent.x * nudge,
        y: VB.cy + radial.y * r + tangent.y * nudge
      };
    });
    separateTangent(stars, 54);
    stars.forEach(function (star) {
      star.x = clamp(star.x, 70, VB.w - 70);
      star.y = clamp(star.y, 64, VB.h - 56);
      var shifted = Math.hypot(star.x - star.trueX, star.y - star.trueY) > 10;
      if (shifted) {
        svg.appendChild(svgEl("line", {
          class: "moon-link",
          x1: round(star.trueX), y1: round(star.trueY),
          x2: round(star.x), y2: round(star.y)
        }));
        svg.appendChild(svgEl("circle", {
          class: "true-tick",
          cx: round(star.trueX), cy: round(star.trueY), r: 2.2
        }));
      }
      var side = LABEL_SIDE[star.species.star] || 1;
      var lx = star.x + star.tx * side * 92 + star.rx * 18;
      var ly = star.y + star.ty * side * 92 + star.ry * 18;
      lx = clamp(lx, 86, VB.w - 120);
      ly = clamp(ly, 78, VB.h - 40);
      var leader = svgEl("line", {
        class: "map-leader label-leader",
        x1: round(star.x), y1: round(star.y),
        x2: round(lx), y2: round(ly - 6)
      });
      svg.appendChild(leader);
      var anchor = lx < star.x - 6 ? "end" : "start";
      var text = svgEl("text", {
        class: "map-label star-label",
        x: round(lx),
        y: round(ly),
        "text-anchor": anchor
      });
      var name = svgEl("tspan", { x: round(lx), dy: "0" });
      name.textContent = star.species.mapLabel || star.species.homeworld;
      var dist = svgEl("tspan", { class: "star-dist", x: round(lx), dy: "14" });
      dist.textContent = star.species.distanceLabel || "";
      text.appendChild(name);
      text.appendChild(dist);
      svg.appendChild(text);
      addPin(els.beyondBoard, star.species, { x: star.x, y: star.y });
    });
    addWander(els.beyondBoard, svg, patrol(160, 960, 800, -28, 28), wanderSpecies());
  }

  function separateTangent(stars, minDist) {
    var n, i, j, dx, dy, dist, push, sign;
    for (n = 0; n < 14; n++) {
      for (i = 0; i < stars.length; i++) {
        for (j = i + 1; j < stars.length; j++) {
          dx = stars[j].x - stars[i].x;
          dy = stars[j].y - stars[i].y;
          dist = Math.hypot(dx, dy) || 0.01;
          if (dist >= minDist) continue;
          push = (minDist - dist) / 2 + 0.4;
          sign = (dx * stars[i].tx + dy * stars[i].ty) >= 0 ? -1 : 1;
          stars[i].x += stars[i].tx * sign * push;
          stars[i].y += stars[i].ty * sign * push;
          sign = (dx * stars[j].tx + dy * stars[j].ty) >= 0 ? 1 : -1;
          stars[j].x += stars[j].tx * sign * push;
          stars[j].y += stars[j].ty * sign * push;
        }
      }
    }
  }

  function addWander(board, svg, path, species) {
    if (!species) return;
    var poly = svgEl("polyline", {
      class: "wander-path",
      points: path.map(function (p) { return round(p.x) + "," + round(p.y); }).join(" ")
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
      pin._raf = requestAnimationFrame(frame);
    }
    pin._raf = requestAnimationFrame(frame);
  }

  function addPin(board, species, pt) {
    var pin = document.createElement("button");
    pin.type = "button";
    pin.className = "map-pin " + pinClass(species.canister);
    pin.style.left = (pt.x / VB.w * 100) + "%";
    pin.style.top = (pt.y / VB.h * 100) + "%";
    pin.setAttribute("aria-label", pinLabel(species) + ". Open dossier.");
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

  function bodyDisc(svg, pt, disc, fill, ring) {
    svg.appendChild(svgEl("circle", {
      class: "body-disc fill-" + fill,
      cx: round(pt.x), cy: round(pt.y), r: disc
    }));
    if (ring) {
      svg.appendChild(svgEl("ellipse", {
        class: "saturn-ring",
        cx: round(pt.x), cy: round(pt.y),
        rx: disc + 8, ry: 3.4,
        transform: "rotate(-22 " + round(pt.x) + " " + round(pt.y) + ")"
      }));
    }
  }

  function placeLabel(svg, pt, ldx, ldy, anchor, name, sub) {
    var x = pt.x + ldx;
    var y = pt.y + ldy;
    if (Math.hypot(ldx, ldy) > 8) {
      svg.appendChild(svgEl("line", {
        class: "map-leader",
        x1: round(pt.x), y1: round(pt.y),
        x2: round(x), y2: round(y - 4)
      }));
    }
    var text = svgEl("text", {
      class: "map-label",
      x: round(x),
      y: round(y),
      "text-anchor": anchor || "middle"
    });
    text.textContent = name;
    svg.appendChild(text);
    if (sub) {
      var small = svgEl("text", {
        class: "map-label map-sub",
        x: round(x),
        y: round(y + 16),
        "text-anchor": anchor || "middle"
      });
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
