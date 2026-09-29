/* Earth Exports · Vex transmission (optional easter egg, IN-WORLD FICTION).
   Triggers: click the Helion crystal in the footer 4 times (within ~4 s), or type RINGHEART
   anywhere outside a form field. Sequence ~6.5 s: soft signal glitch -> Vex cuts in ->
   bridge cuts the channel -> ship recovers. Kid-safe. Photosensitivity: no flashes; the only
   repeating motion is a slow scanline drift and <=2.5 position shifts per second.
   Reduced motion: calm card, no glitch. Esc or "Close" dismisses at any time. */
(function () {
  "use strict";
  var CODE = "RINGHEART", CLICKS = 4, WINDOW_MS = 4000;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var ov = null, timers = [], lastFocus = null, clicks = [], typed = "", runs = 0;
  var api = window.__eeVex = { active: false, phase: "idle", runs: 0, trigger: start, dismiss: function () { end(true); } };

  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function phase(p) { api.phase = p; if (ov) ov.setAttribute("data-phase", p); }

  function build(calm) {
    var el = document.createElement("div");
    el.className = "vex-ov" + (calm ? " vex-calm" : "");
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", "Incoming transmission (story easter egg)");
    el.innerHTML =
      '<div class="vex-scan" aria-hidden="true"></div>' +
      '<div class="vex-bar" aria-hidden="true"><span class="vex-dot"></span><span class="vex-bar-t">Signal intrusion · unregistered hull</span></div>' +
      '<div class="vex-card">' +
        '<div class="vex-head"><span class="vex-ch">CH-7 · incoming</span><span class="vex-q">video degraded</span></div>' +
        '<div class="vex-body">' +
          '<svg class="vex-face" viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
            '<rect x="6" y="6" width="108" height="108" rx="10" class="vf-bg"/>' +
            '<path class="vf-coat" d="M18 114 C22 88 40 80 60 80 C80 80 98 88 102 114 Z"/>' +
            '<path class="vf-collar" d="M36 90 L60 104 L84 90 L78 82 L60 92 L42 82 Z"/>' +
            '<ellipse class="vf-head" cx="60" cy="52" rx="24" ry="26"/>' +
            '<path class="vf-hat" d="M34 36 C40 20 80 20 86 36 Z M28 38 h64 v5 h-64 Z"/>' +
            '<path class="vf-brow" d="M44 48 l10 3 M76 48 l-10 3"/>' +
            '<circle class="vf-eye" cx="50" cy="56" r="3"/><circle class="vf-eye" cx="70" cy="56" r="3"/>' +
            '<path class="vf-mouth" d="M50 68 q10 -5 20 0"/>' +
            '<path class="vf-gem" d="M88 96 l5 6 -5 10 -5 -10 Z"/>' +
          '</svg>' +
          '<div class="vex-text">' +
            '<p class="vex-who">VEX <span>· collector, not cleared</span></p>' +
            '<p class="vex-line" aria-hidden="true"></p>' +
            '<p class="vex-sub">He wants the Helion crystals. The Manifest says no.</p>' +
          '</div>' +
        '</div>' +
        '<p class="vex-cut" aria-hidden="true">Transmission cut by the bridge</p>' +
      '</div>' +
      '<div class="vex-ok" aria-hidden="true"><span class="vex-ok-dot"></span>Systems nominal · Helion vault still locked</div>' +
      '<button type="button" class="vex-close">Close <kbd>Esc</kbd></button>' +
      '<p class="sr-only vex-live" aria-live="assertive"></p>';
    el.querySelector(".vex-close").addEventListener("click", function () { end(true); });
    return el;
  }

  function typeLine(el, text, ms) {
    var i = 0, step = Math.max(40, Math.floor(ms / text.length));
    (function tick() { el.textContent = text.slice(0, ++i); if (i < text.length) at(step, tick); })();
  }

  function start() {
    if (api.active) return;
    var calm = reduce.matches;
    api.active = true; lastFocus = document.activeElement;
    ov = build(calm); document.body.appendChild(ov);
    document.documentElement.classList.add("vex-on");
    var live = ov.querySelector(".vex-live"), line = ov.querySelector(".vex-line");
    ov.querySelector(".vex-close").focus({ preventScroll: true });
    requestAnimationFrame(function () { ov.classList.add("in"); });
    live.textContent = "Incoming transmission from Vex: Where's my crystals? The bridge cuts the channel.";
    if (calm) {
      phase("vex"); line.textContent = "“Where’s my crystals?”";
      at(3600, function () { phase("cut"); });
      at(4800, function () { phase("recover"); });
      at(6200, function () { end(false); });
      return;
    }
    phase("glitch"); document.documentElement.classList.add("vex-glitch");
    at(1000, function () { document.documentElement.classList.remove("vex-glitch"); phase("vex"); typeLine(line, "“Where’s my crystals?”", 900); });
    at(3900, function () { phase("cut"); });
    at(5000, function () { phase("recover"); });
    at(6600, function () { end(false); });
  }

  function end(early) {
    if (!api.active) return;
    timers.forEach(clearTimeout); timers = [];
    document.documentElement.classList.remove("vex-glitch", "vex-on");
    var el = ov; ov = null;
    if (el) { el.classList.remove("in"); el.classList.add("out"); setTimeout(function () { el.remove(); }, reduce.matches ? 0 : 300); }
    api.active = false; api.phase = "idle"; api.runs = ++runs; api.early = !!early;
    if (lastFocus && document.contains(lastFocus) && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    if (window.__eeFeed && window.__eeFeed.push && !api.logged) {
      api.logged = true;
      window.__eeFeed.push(["CUSTOMS", "Unregistered hull hailed the lounge asking about crystals. Channel cut. Helion vault still locked."]);
    }
  }

  document.addEventListener("keydown", function (e) {
    if (api.active) {
      if (e.key === "Escape") { e.preventDefault(); end(true); }
      else if (e.key === "Tab") { e.preventDefault(); var b = ov && ov.querySelector(".vex-close"); if (b) b.focus(); }
      return;
    }
    var t = e.target, tag = t && t.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (t && t.isContentEditable)) return;
    if (e.ctrlKey || e.metaKey || e.altKey || !e.key || e.key.length !== 1) return;
    typed = (typed + e.key.toUpperCase()).slice(-CODE.length);
    if (typed === CODE) { typed = ""; start(); }
  });

  document.addEventListener("click", function (e) {
    var gem = e.target.closest && e.target.closest(".helion-crystal");
    if (!gem) return;
    var now = Date.now();
    clicks = clicks.filter(function (t) { return now - t < WINDOW_MS; }); clicks.push(now);
    gem.classList.remove("hc-ping"); void gem.offsetWidth; gem.classList.add("hc-ping");
    if (clicks.length >= CLICKS) { clicks = []; start(); }
  });
})();
