/* Earth Exports · Vex early-access chat (the shop's early-access email list, told as a friendly "DM").
   Original character; playful, never menacing. Separate from the RINGHEART / Helion easter egg (js/vex.js).
   Auto-shows once per visitor after ~25–40 s on the site or after scrolling past halfway, never in the
   first 10 s, never on contact.html / policies.html, and never while it would cover the hero Earth goods /
   Space goods buttons (small phones; it waits until they scroll away). "Not now" (or closing it) snoozes it for 7 days.
   The footer "Early access" Vex button reopens it any time. Signup = Formspree NOTIFY_FORM_ID via
   window.EEForms (js/contact-form.js), falling back to a "Notify me" mailto while the ID is a placeholder. */
(function () {
  "use strict";
  if (/(^|\/)(contact|policies)\.html$/.test(location.pathname)) return;
  var KEY = "ee-vexchat", T0KEY = "ee-site-t0", THRKEY = "ee-vc-thr", DAY = 864e5;
  var TIM = window.__eeVexChatTiming || { floor: 10000, min: 25000, max: 40000 };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }
  var t0 = +ss(T0KEY); if (!t0) { t0 = Date.now(); ss(T0KEY, String(t0)); }
  var thr = +ss(THRKEY); if (!thr || thr < TIM.min || thr > TIM.max) { thr = Math.round(TIM.min + Math.random() * (TIM.max - TIM.min)); ss(THRKEY, String(thr)); }

  var AV = '<svg class="vc-avatar" viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
    '<rect x="6" y="6" width="108" height="108" rx="54" class="vf-bg"/>' +
    '<path class="vf-coat" d="M22 110 C26 88 42 80 60 80 C78 80 94 88 98 110 Z"/>' +
    '<path class="vf-collar" d="M38 90 L60 102 L82 90 L76 83 L60 92 L44 83 Z"/>' +
    '<ellipse class="vf-head" cx="60" cy="52" rx="23" ry="25"/>' +
    '<path class="vf-hat" d="M35 36 C41 21 79 21 85 36 Z M29 38 h62 v5 h-62 Z"/>' +
    '<circle class="vf-eye" cx="51" cy="55" r="3"/><circle class="vf-eye" cx="69" cy="55" r="3"/>' +
    '<path class="vf-mouth" d="M50 65 q10 7 20 0"/>' +
    '<path class="vf-gem" d="M86 94 l5 6 -5 10 -5 -10 Z"/></svg>';
  var LINES = {
    hello: "Psst. Want to see the underground stuff before anyone else?",
    ask: "Smart. Drop your email and I’ll slip you word before the shop opens to everyone.",
    ok: "Done. You’re on the early-access list. Act natural.",
    mailto: "Your email app should pop open. Hit send and you’re on the list. Act natural.",
    err: "Hm, the line crackled. Try again, or email the shop at earthexportsshop@gmail.com.",
    again: "Back so soon? The early-access list is still open."
  };

  var el, log, actions, form, opener = null, open = false, typingTimer = null;
  function build() {
    el = document.createElement("aside");
    el.className = "vex-chat" + (reduce ? " vc-calm" : "");
    el.id = "vex-chat";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "false");
    el.setAttribute("aria-labelledby", "vc-title");
    el.setAttribute("aria-describedby", "vc-note");
    el.hidden = true;
    el.innerHTML =
      '<div class="vc-head">' + AV +
        '<div class="vc-id"><p class="vc-title" id="vc-title">Vex <span>· early access</span></p>' +
        '<p class="vc-sub">Earth Exports shop newsletter</p></div>' +
        '<button type="button" class="vc-x" aria-label="Close the early-access chat">✕</button>' +
      '</div>' +
      '<div class="vc-log" aria-live="polite"></div>' +
      '<div class="vc-actions" hidden><button type="button" class="btn btn-primary vc-yes">Show me</button><button type="button" class="btn btn-secondary vc-no">Not now</button></div>' +
      '<form class="vc-form" hidden action="mailto:earthexportsshop@gmail.com?subject=Notify%20me" method="post" enctype="text/plain">' +
        '<label class="sr-only" for="vc-email">Email address for the early-access list</label>' +
        '<div class="vc-row"><input type="email" id="vc-email" name="email" required autocomplete="email" placeholder="you@example.com">' +
        '<button type="submit" class="btn btn-primary vc-send">Join</button></div>' +
        '<input type="text" name="_gotcha" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
        '<input type="hidden" name="source" value="Vex chat">' +
        '<p class="form-status" role="status" aria-live="polite"></p>' +
      '</form>' +
      '<p class="vc-note" id="vc-note">The shop’s early-access email list: one note when we open. <a href="policies.html#privacy">Privacy</a></p>';
    var pl = document.querySelector('footer a[href$="policies.html"]');
    if (pl) el.querySelector(".vc-note a").setAttribute("href", pl.getAttribute("href") + "#privacy");
    document.body.appendChild(el);
    log = el.querySelector(".vc-log"); actions = el.querySelector(".vc-actions"); form = el.querySelector(".vc-form");
    el.querySelector(".vc-x").addEventListener("click", function () { close("x"); });
    el.querySelector(".vc-no").addEventListener("click", function () { close("notnow"); });
    el.querySelector(".vc-yes").addEventListener("click", showForm);
    if (window.EEForms) {
      window.EEForms.wire(form, (window.EEForms.cfg || {}).NOTIFY_FORM_ID, function () {
        return window.EEForms.notifyMail(el.querySelector("#vc-email").value.trim());
      }, "You’re on the early-access list.", { onResult: function (kind) {
        if (kind === "ok" || kind === "mailto") { var s = load(); s.joined = Date.now(); save(s); }
        if (kind !== "err") { form.hidden = true; log.innerHTML = ""; }
        say(LINES[kind] || LINES.err, 0);
        pad();
      } });
    }
  }
  function msg(text, cls) { var p = document.createElement("p"); p.className = "vc-msg" + (cls ? " " + cls : ""); p.textContent = text; log.appendChild(p); pad(); return p; }
  function say(text, delay, then) {
    if (reduce || !delay) { msg(text); if (then) then(); return; }
    var t = document.createElement("p"); t.className = "vc-typing"; t.setAttribute("aria-label", "Vex is typing");
    t.innerHTML = "<span></span><span></span><span></span>"; log.appendChild(t); pad();
    typingTimer = setTimeout(function () { t.remove(); msg(text); if (then) then(); }, delay);
  }
  function pad() { if (!open) return; requestAnimationFrame(function () { document.body.style.paddingBottom = (el.offsetHeight + 24) + "px"; }); }
  function showForm() {
    actions.hidden = true;
    log.innerHTML = ""; // keep the bubble short on phones
    msg("Show me", "vc-me");
    say(LINES.ask, 700, function () {
      form.hidden = false; pad();
      var inp = el.querySelector("#vc-email"); if (inp) inp.focus(); // user asked for it: focus is expected here
    });
  }
  function show(manual) {
    if (open) { if (manual) el.querySelector(".vc-x").focus(); return; }
    if (!el) build();
    open = true; el.hidden = false; log.innerHTML = ""; actions.hidden = true; form.hidden = true;
    var st = form.querySelector(".form-status"); if (st) st.innerHTML = "";
    requestAnimationFrame(function () { el.classList.add("vc-in"); });
    var s = load();
    if (!manual) { s.shown = Date.now(); save(s); }
    say(manual && s.joined ? LINES.again : LINES.hello, 1100, function () {
      actions.hidden = false; pad();
      if (manual) { var y = el.querySelector(".vc-yes"); if (y) y.focus(); }
    });
    api.open = true; api.shows++; api.openedAt = Date.now() - t0;
  }
  function close(why) {
    if (!open) return;
    clearTimeout(typingTimer);
    var hadFocus = el.contains(document.activeElement);
    open = false; el.classList.remove("vc-in"); el.hidden = true; document.body.style.paddingBottom = "";
    var s = load();
    if (!s.joined) { s.snooze = Date.now() + 7 * DAY; save(s); }
    api.open = false; api.lastClose = why;
    if (hadFocus && opener && document.contains(opener)) opener.focus();
    opener = null;
  }
  function eligible() {
    var s = load();
    if (s.joined) return false;
    if (s.snooze && Date.now() < s.snooze) return false;
    if (s.shown && !(s.snooze && Date.now() >= s.snooze)) return false; // once per visitor (again only after a snooze runs out)
    return true;
  }
  function busy() {
    var a = document.activeElement, tag = a && a.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (a && a.isContentEditable)) return true; // visitor is typing
    if (window.__eeVex && window.__eeVex.active) return true; // RINGHEART / Helion transmission running
    if (document.querySelector("dialog[open]")) return true; // a dossier is open
    var nt = document.querySelector(".nav-toggle[aria-expanded=true]"); if (nt) return true;
    if (coversHeroTabs()) return true; // 2026-09-27: never pop up on top of the Earth goods / Space goods buttons
    return false;
  }
  function coversHeroTabs() {
    // Worst-case box the panel can take (bottom-right, up to 330px wide and min(60vh, 420px) tall, 12px margins).
    var w = Math.min(330, innerWidth - 24), h = Math.min(innerHeight * 0.6, 420);
    var L = innerWidth - 12 - w, T = innerHeight - 12 - h, R = innerWidth - 12, B = innerHeight - 12;
    var tabs = document.querySelectorAll(".scene-tabs .side-tab");
    for (var i = 0; i < tabs.length; i++) {
      var r = tabs[i].getBoundingClientRect();
      if (r.width && r.right > L && r.left < R && r.bottom > T && r.top < B) return true;
    }
    return false;
  }
  function scrolledHalf() {
    var h = document.documentElement.scrollHeight - innerHeight;
    return h > innerHeight * 0.3 && scrollY / h >= 0.5;
  }
  var timer = null;
  function check() {
    if (open || !eligible()) return;
    var el_ = Date.now() - t0;
    if (el_ < TIM.floor) return;
    if (el_ >= thr || scrolledHalf()) { if (busy()) return; show(false); stop(); }
  }
  function stop() { clearInterval(timer); window.removeEventListener("scroll", onScroll); }
  function onScroll() { check(); }
  if (eligible()) { timer = setInterval(check, 500); window.addEventListener("scroll", onScroll, { passive: true }); }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && open && !(window.__eeVex && window.__eeVex.active)) {
      var a = document.activeElement;
      // Esc closes the chat; if focus is in some other field, let that field keep its own Esc behaviour too.
      close("esc");
      if (el.contains(a)) e.preventDefault();
    }
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".vex-chat-open");
    if (!b) return;
    e.preventDefault(); opener = b; show(true);
  });
  var api = window.__eeVexChat = { open: false, shows: 0, lastClose: null, show: function () { show(true); }, close: close,
    state: load, timing: TIM, threshold: function () { return thr; }, sinceStart: function () { return Date.now() - t0; } };
})();
