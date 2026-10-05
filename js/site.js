(function () {
  "use strict";

  var STORAGE_KEY = "ee-face";
  var FACE_PUBLIC = "public";
  var FACE_OUTPOST = "outpost";
  var FACE_CLASSIC = "classic";

  function getStoredFace() {
    try {
      return sessionStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredFace(face) {
    try {
      sessionStorage.setItem(STORAGE_KEY, face);
    } catch (e) { /* private mode */ }
  }

  function knownFace(face) {
    if (face === FACE_PUBLIC || face === FACE_OUTPOST || face === FACE_CLASSIC) return face;
    return FACE_OUTPOST;
  }

  function applyFace(face, opts) {
    opts = opts || {};
    face = knownFace(face);
    var isPublic = face === FACE_PUBLIC;
    var isOutpost = face === FACE_OUTPOST;
    var isClassic = face === FACE_CLASSIC;
    document.documentElement.setAttribute("data-face", face);
    document.body.classList.toggle("mode-public", isPublic);
    document.body.classList.toggle("mode-outpost", isOutpost);
    document.body.classList.toggle("mode-classic", isClassic);

    var sessionVal = document.getElementById("sb-session");
    if (sessionVal) {
      sessionVal.textContent = isClassic ? "TRADE-CONSOLE" : "DECK-OPEN";
    }
    var clearanceVal = document.getElementById("sb-clearance");
    if (clearanceVal) {
      clearanceVal.textContent = isClassic ? "MERCHANT DESK" : "PUBLIC WELCOME";
    }
    var faceLabel = document.getElementById("face-label");
    if (faceLabel) {
      faceLabel.textContent = isClassic ? "Classic" : (isPublic ? "CV lounge" : "EE");
    }

    var crt = document.querySelector(".crt-overlay");
    if (crt) {
      crt.setAttribute("aria-hidden", isClassic ? "false" : "true");
      crt.hidden = !isClassic;
    }

    var toggle = document.getElementById("face-toggle");
    if (toggle) {
      toggle.textContent = isOutpost ? "CV · ◌" : "EE · ◌";
      toggle.setAttribute("aria-pressed", isOutpost ? "true" : "false");
      toggle.title = isOutpost ? "Open the CV lounge" : "Open EE";
    }
    var classicBtn = document.getElementById("face-classic");
    if (classicBtn) {
      classicBtn.setAttribute("aria-pressed", isClassic ? "true" : "false");
    }

    /* Ship-console aboard label flips with face. Amber wording stays on Classic only. */
    var aboard = document.querySelector(".console-aboard");
    if (aboard) {
      aboard.innerHTML = isClassic
        ? 'Trade console · <span>amber phosphor</span> · Ohio Outpost // Sol-3'
        : (isOutpost
          ? 'EE · <span>Ohio Outpost // Sol-3</span>'
          : 'Aboard <span>Cosmic Voyager</span> · Passenger Trade Lounge');
    }

    if (opts.persist !== false) {
      setStoredFace(face);
    }

    if (opts.hash !== false) {
      var base = location.pathname + location.search;
      var next = isClassic ? "#classic" : (isOutpost ? "#outpost" : "");
      var cur = location.hash;
      var managed = cur === "#outpost" || cur === "#classic";
      if (next) {
        if (cur !== next) history.replaceState(null, "", base + next);
      } else if (managed) {
        history.replaceState(null, "", base);
      }
    }

    document.dispatchEvent(new CustomEvent("ee:face", { detail: { face: face } }));
  }

  function resolveInitialFace() {
    if (location.hash === "#classic") return FACE_CLASSIC;
    if (location.hash === "#outpost") return FACE_OUTPOST;
    var stored = getStoredFace();
    if (stored === FACE_OUTPOST || stored === FACE_PUBLIC || stored === FACE_CLASSIC) return stored;
    return FACE_OUTPOST;
  }

  /* Apply ASAP to avoid flash of wrong face */
  applyFace(resolveInitialFace(), { persist: true, hash: location.hash === "#outpost" });

  /* Mobile nav */
  var btn = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* Live clock */
  var clockEl = document.getElementById("sb-clock");
  function tickClock() {
    if (!clockEl) return;
    var now = new Date();
    var hh = String(now.getUTCHours()).padStart(2, "0");
    var mm = String(now.getUTCMinutes()).padStart(2, "0");
    var ss = String(now.getUTCSeconds()).padStart(2, "0");
    clockEl.textContent = hh + ":" + mm + ":" + ss + " UTC";
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* Soft reveal controls */
  function enterOutpost(ev) {
    if (ev) ev.preventDefault();
    applyFace(FACE_OUTPOST);
  }
  function exitOutpost(ev) {
    if (ev) ev.preventDefault();
    applyFace(FACE_PUBLIC);
  }
  function toggleFace(ev) {
    if (ev) ev.preventDefault();
    var current = document.documentElement.getAttribute("data-face");
    if (current === FACE_PUBLIC) applyFace(FACE_OUTPOST);
    else if (current === FACE_OUTPOST) applyFace(FACE_PUBLIC);
    else applyFace(FACE_OUTPOST);
  }
  function toggleClassic(ev) {
    if (ev) ev.preventDefault();
    var current = document.documentElement.getAttribute("data-face");
    applyFace(current === FACE_CLASSIC ? FACE_OUTPOST : FACE_CLASSIC);
  }

  var faceToggle = document.getElementById("face-toggle");
  if (faceToggle) {
    faceToggle.addEventListener("click", toggleFace);
  }
  var faceClassic = document.getElementById("face-classic");
  if (faceClassic) {
    faceClassic.addEventListener("click", toggleClassic);
  }

  document.querySelectorAll("[data-face-enter]").forEach(function (el) {
    el.addEventListener("click", enterOutpost);
  });
  document.querySelectorAll("[data-face-exit]").forEach(function (el) {
    el.addEventListener("click", exitOutpost);
  });

  /* #outpost opens EE. #classic opens the original amber console.
     Other in-page hashes (#shop, #query, policy anchors) must not change
     the face or rewrite the session. */
  window.addEventListener("hashchange", function () {
    if (location.hash === "#outpost") {
      applyFace(FACE_OUTPOST, { hash: false });
    } else if (location.hash === "#classic") {
      applyFace(FACE_CLASSIC, { hash: false });
    }
  });

  /* Keyboard: Alt+O toggles outpost */
  document.addEventListener("keydown", function (ev) {
    if (ev.altKey && !ev.ctrlKey && !ev.metaKey && (ev.key === "o" || ev.key === "O")) {
      ev.preventDefault();
      toggleFace();
    }
  });


  /* ===== Earth goods / Space goods tabs (2026-09-27; supersedes launch fix #5 and the phone follow-up's scroll jump).
     Real tabs: the chosen button lights up (aria-selected + .is-active), html[data-side] drives the hero morph
     (earth-scene.js only follows that attribute, so a WebGL failure can never break the tabs), and only that
     side's products are shown: Space -> #shop "What we make", Earth -> #shelf-earth "Coming later from Earth".
     The panel that appears gets a short highlight (orange for Space, teal for Earth). No automatic scrolling.
     Default is Space (real products first); the choice is remembered for the browser tab session. ===== */
  var SIDE_KEY = "ee-side";
  var DEFAULT_SIDE = "ufo";
  var sideTabs = Array.prototype.slice.call(document.querySelectorAll('.scene-tabs [role="tab"][data-side]'));
  var flashTimer = null, switches = 0;
  function flashPanel(panel) {
    document.querySelectorAll(".goods-flash").forEach(function (x) { x.classList.remove("goods-flash"); });
    void panel.offsetWidth; // restart the transition on repeated taps
    panel.classList.add("goods-flash");
    clearTimeout(flashTimer);
    flashTimer = setTimeout(function () { panel.classList.remove("goods-flash"); }, 1800);
  }
  function applySide(side, opts) {
    opts = opts || {};
    var s = side === "earth" ? "earth" : "ufo";
    document.documentElement.setAttribute("data-side", s);
    var tag = document.getElementById("side-tag");
    if (tag) tag.textContent = s === "ufo" ? "· From Space" : "· From Earth";
    sideTabs.forEach(function (t) {
      var on = t.getAttribute("data-side") === s;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      if (on) t.classList.add("is-active"); else t.classList.remove("is-active");
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) {
        panel.hidden = !on;
        if (on && opts.flash) flashPanel(panel);
      }
    });
    try { sessionStorage.setItem(SIDE_KEY, s); } catch (e) { /* private mode */ }
    if (opts.flash) switches++;
    window.__eeTabs = { side: s, switches: switches, at: Date.now() };
  }
  var startSide = DEFAULT_SIDE;
  try { var st = sessionStorage.getItem(SIDE_KEY); if (st === "earth" || st === "ufo") startSide = st; } catch (e) {}
  if (location.hash === "#shelf-earth") startSide = "earth";
  else if (location.hash === "#shop") startSide = "ufo";
  applySide(startSide);
  sideTabs.forEach(function (t, i) {
    t.addEventListener("click", function () {
      var sd = t.getAttribute("data-side");
      if (document.documentElement.getAttribute("data-side") === sd && t.getAttribute("aria-selected") === "true") return;
      applySide(sd, { flash: true });
    });
    t.addEventListener("keydown", function (ev) {
      var next = null;
      if (ev.key === "ArrowRight" || ev.key === "ArrowDown") next = sideTabs[(i + 1) % sideTabs.length];
      else if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") next = sideTabs[(i - 1 + sideTabs.length) % sideTabs.length];
      else if (ev.key === "Home") next = sideTabs[0];
      else if (ev.key === "End") next = sideTabs[sideTabs.length - 1];
      if (next) { ev.preventDefault(); applySide(next.getAttribute("data-side"), { flash: true }); next.focus(); }
    });
  });
  /* In-page links to a goods panel (e.g. "See what we make" -> #shop) open that tab first, then the link scrolls as usual. */
  document.querySelectorAll('a[href="#shop"], a[href="#shelf-earth"]').forEach(function (a) {
    a.addEventListener("click", function () { if (sideTabs.length) applySide(a.getAttribute("href") === "#shelf-earth" ? "earth" : "ufo", { flash: true }); });
  });


  /* Scene framing: on narrow screens re-frame the SVG so the Earth arc keeps visible curvature */
  var sceneSvg = document.querySelector(".scene-svg");
  if (sceneSvg && window.matchMedia) {
    var mq = window.matchMedia("(max-width: 640px)");
    var frame = function () { sceneSvg.setAttribute("viewBox", mq.matches ? "330 -400 780 880" : "0 0 1440 480"); };
    frame();
    if (mq.addEventListener) mq.addEventListener("change", frame); else if (mq.addListener) mq.addListener(frame);
  }

  /* Deck welcome line — gentle fade */
  var loungeNote = document.getElementById("lounge-note");
  if (loungeNote && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    loungeNote.classList.add("is-settling");
    setTimeout(function () {
      loungeNote.classList.add("is-settled");
    }, 900);
  } else if (loungeNote) {
    loungeNote.classList.add("is-settled");
  }
})();
