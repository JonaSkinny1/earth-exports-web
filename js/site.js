(function () {
  "use strict";

  var STORAGE_KEY = "ee-face";
  var FACE_PUBLIC = "public";
  var FACE_CV = "cv";

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

  function applyFace(face, opts) {
    opts = opts || {};
    /* Anything other than CV, including old outpost/classic values, is EE. */
    var isCv = face === FACE_CV;
    document.documentElement.setAttribute("data-face", isCv ? FACE_CV : FACE_PUBLIC);
    document.body.classList.toggle("mode-public", !isCv);
    document.body.classList.remove("mode-outpost");
    document.body.classList.remove("mode-classic");

    var sessionVal = document.getElementById("sb-session");
    if (sessionVal) {
      sessionVal.textContent = "DECK-OPEN";
    }
    var clearanceVal = document.getElementById("sb-clearance");
    if (clearanceVal) {
      clearanceVal.textContent = isCv ? "CREW ONLY" : "PUBLIC WELCOME";
    }
    var faceLabel = document.getElementById("face-label");
    if (faceLabel) {
      faceLabel.textContent = isCv ? "CV" : "EE";
    }

    var crt = document.querySelector(".crt-overlay");
    if (crt) {
      crt.setAttribute("aria-hidden", "true");
      crt.hidden = true;
    }

    var toggle = document.getElementById("face-toggle");
    if (toggle) {
      toggle.textContent = isCv ? "EE · ◌" : "CV · ◌";
      toggle.setAttribute("aria-pressed", isCv ? "true" : "false");
      toggle.title = isCv ? "Return to EE" : "Open the CV lounge";
    }

    /* Amber wording stays off both faces. EE keeps the passenger-lounge line. */
    var aboard = document.querySelector(".console-aboard");
    if (aboard) {
      aboard.innerHTML = isCv
        ? 'Crew deck · <span>restricted</span> · Ohio Outpost // Sol-3'
        : 'Aboard <span>Cosmic Voyager</span> · Passenger Trade Lounge';
    }

    if (opts.persist !== false) {
      setStoredFace(isCv ? FACE_CV : FACE_PUBLIC);
    }

    document.dispatchEvent(new CustomEvent("ee:face", { detail: { face: isCv ? FACE_CV : FACE_PUBLIC } }));
  }

  function resolveInitialFace() {
    /* New visitors, and anyone who stored the removed amber/classic face, land on EE.
       #outpost, #classic, #shop, and other hashes do not choose a face. */
    return getStoredFace() === FACE_CV ? FACE_CV : FACE_PUBLIC;
  }

  /* Apply ASAP to avoid flash of the wrong face. Do not rewrite the URL hash. */
  applyFace(resolveInitialFace(), { persist: true });

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

  function enterCv(ev) {
    if (ev) ev.preventDefault();
    playTick();
    applyFace(FACE_CV);
  }
  function exitCv(ev) {
    if (ev) ev.preventDefault();
    playTick();
    applyFace(FACE_PUBLIC);
  }
  function reduceMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* Soft mechanical tick. User toggles only. Reduced motion stays silent. */
  var tickCtx = null;
  function playTick() {
    if (reduceMotion()) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!tickCtx) tickCtx = new AC();
      if (tickCtx.state === "suspended") tickCtx.resume();
      var t = tickCtx.currentTime;
      var osc = tickCtx.createOscillator();
      var gain = tickCtx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(740, t);
      osc.frequency.exponentialRampToValueAtTime(360, t + 0.045);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.03, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
      osc.connect(gain);
      gain.connect(tickCtx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    } catch (e) { /* no audio output */ }
  }

  function toggleFace(ev) {
    if (ev) ev.preventDefault();
    playTick();
    var current = document.documentElement.getAttribute("data-face");
    applyFace(current === FACE_CV ? FACE_PUBLIC : FACE_CV);
  }

  var faceToggle = document.getElementById("face-toggle");
  if (faceToggle) {
    faceToggle.addEventListener("click", toggleFace);
  }

  document.querySelectorAll("[data-face-enter]").forEach(function (el) {
    el.addEventListener("click", enterCv);
  });
  document.querySelectorAll("[data-face-exit]").forEach(function (el) {
    el.addEventListener("click", exitCv);
  });

  /* In-page hashes never change the face or the stored choice. */

  /* Keyboard: Alt+O toggles EE and CV */
  document.addEventListener("keydown", function (ev) {
    if (ev.altKey && !ev.ctrlKey && !ev.metaKey && (ev.key === "o" || ev.key === "O")) {
      ev.preventDefault();
      toggleFace();
    }
  });

  /* One-line ship log. CV only. Original lines, no clock. */
  var LOG_LINES = [
    "Voyager holding station · Ohio Outpost",
    "Flea table packed · lamps on",
    "This batch stays under stamp",
    "Sol-3 in the window · deck quiet",
    "Helion vault shut · answer is no"
  ];
  var logIndex = 0;
  function paintLog() {
    var el = document.getElementById("cv-log");
    if (!el) return;
    var on = document.documentElement.getAttribute("data-face") === FACE_CV;
    el.setAttribute("aria-hidden", on ? "false" : "true");
    if (!on) return;
    el.textContent = LOG_LINES[logIndex];
  }
  function armLog() {
    paintLog();
    if (reduceMotion()) return;
    setInterval(function () {
      if (document.documentElement.getAttribute("data-face") !== FACE_CV) return;
      var el = document.getElementById("cv-log");
      if (!el) return;
      el.classList.add("is-dim");
      window.setTimeout(function () {
        logIndex = (logIndex + 1) % LOG_LINES.length;
        paintLog();
        el.classList.remove("is-dim");
      }, 280);
    }, 6800);
  }
  document.addEventListener("ee:face", paintLog);
  armLog();

  /* Decorative batch serials. Not inventory. Hidden unless CV. */
  document.querySelectorAll(".product-card").forEach(function (card, i) {
    if (card.querySelector(".cv-serial")) return;
    var heading = card.querySelector("h3");
    var name = heading ? heading.textContent : String(i);
    var n = 0;
    for (var c = 0; c < name.length; c++) n = (n + name.charCodeAt(c) * (c + 3)) % 900;
    var serial = document.createElement("span");
    serial.className = "cv-serial";
    serial.textContent = "OH-" + String(100 + n);
    serial.setAttribute("aria-hidden", "true");
    card.appendChild(serial);
    card.addEventListener("pointerup", function (ev) {
      if (document.documentElement.getAttribute("data-face") !== FACE_CV) return;
      if (ev.target.closest("a, button, summary, input, textarea, select")) return;
      card.classList.toggle("is-serial");
    });
  });

  /* Short key sequence. CV only. Shows a reticle flash and a toast, then clears. */
  var SEQUENCE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  var seqAt = 0;
  var toastTimer = null;
  var toast = document.createElement("div");
  toast.className = "cv-toast";
  toast.id = "cv-toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-hidden", "true");
  document.body.appendChild(toast);
  function clearPayload() {
    toast.classList.remove("is-on");
    toast.textContent = "";
    toast.setAttribute("aria-hidden", "true");
    var ret = document.querySelector(".cv-reticle");
    if (ret) ret.classList.remove("is-flash");
  }
  function showPayload() {
    if (document.documentElement.getAttribute("data-face") !== FACE_CV) return;
    var ret = document.querySelector(".cv-reticle");
    if (ret) ret.classList.add("is-flash");
    toast.textContent = "Payload secured";
    toast.classList.add("is-on");
    toast.setAttribute("aria-hidden", "false");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(clearPayload, 1600);
  }
  document.addEventListener("keydown", function (ev) {
    var tag = ev.target && ev.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (ev.target && ev.target.isContentEditable)) {
      seqAt = 0;
      return;
    }
    var key = ev.key.length === 1 ? ev.key.toLowerCase() : ev.key;
    if (key === SEQUENCE[seqAt]) {
      seqAt += 1;
      if (seqAt === SEQUENCE.length) {
        seqAt = 0;
        showPayload();
      }
    } else {
      seqAt = key === SEQUENCE[0] ? 1 : 0;
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
