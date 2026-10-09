/* Alien Index field guides. EE shows the parchment page. CV shows the dark poster.
   A visitor can switch either way. Tapping a page opens it larger. */
(function () {
  "use strict";
  var root = document.querySelector(".fg-index");
  var dlg = document.getElementById("fg-view");
  var viewImg = document.getElementById("fg-view-img");
  var viewTitle = document.getElementById("fg-view-title");
  var viewKicker = document.getElementById("fg-view-kicker");
  var guideBtn = document.getElementById("fg-pick-guide");
  var posterBtn = document.getElementById("fg-pick-poster");
  var closeBtn = document.getElementById("fg-close");
  if (!root || !dlg || !viewImg || !guideBtn || !posterBtn || !closeBtn) return;

  var opener = null;
  var current = null;

  function themeSheet() {
    return document.documentElement.getAttribute("data-face") === "cv" ? "poster" : "guide";
  }

  function activeSheet() {
    return root.getAttribute("data-sheet") || themeSheet();
  }

  function paintToggle() {
    var sheet = activeSheet();
    guideBtn.setAttribute("aria-pressed", sheet === "guide" ? "true" : "false");
    posterBtn.setAttribute("aria-pressed", sheet === "poster" ? "true" : "false");
  }

  function choose(sheet) {
    root.setAttribute("data-sheet", sheet);
    if (current) current.forced = true;
    paintToggle();
    if (dlg.open && current) paintView();
  }

  function paintView() {
    var scene = current.kind === "scene" && !current.forced;
    var sheet = activeSheet();
    var poster = !scene && sheet === "poster";
    viewImg.src = scene ? current.scene : (poster ? current.poster : current.guide);
    viewImg.alt = scene ? current.altScene : (poster ? current.altPoster : current.altGuide);
    viewTitle.textContent = current.name;
    viewKicker.textContent = scene ? "Triton scene" : (poster ? "Science poster" : "Field guide");
  }

  guideBtn.addEventListener("click", function () { choose("guide"); });
  posterBtn.addEventListener("click", function () { choose("poster"); });

  document.addEventListener("ee:face", function () {
    root.removeAttribute("data-sheet");
    if (current) current.forced = false;
    paintToggle();
    if (dlg.open && current) paintView();
  });

  root.addEventListener("click", function (e) {
    var btn = e.target.closest(".fg-open");
    if (!btn || !root.contains(btn)) return;
    opener = btn;
    current = {
      kind: btn.getAttribute("data-kind") || "page",
      name: btn.getAttribute("data-name"),
      guide: btn.getAttribute("data-guide"),
      poster: btn.getAttribute("data-poster"),
      scene: btn.getAttribute("data-scene") || "",
      altGuide: btn.getAttribute("data-alt-guide") || (btn.querySelector(".fg-guide") ? btn.querySelector(".fg-guide").alt : ""),
      altPoster: btn.getAttribute("data-alt-poster") || (btn.querySelector(".fg-poster") ? btn.querySelector(".fg-poster").alt : ""),
      altScene: btn.getAttribute("data-alt-scene") || (btn.querySelector(".fg-scene") ? btn.querySelector(".fg-scene").alt : ""),
      forced: false
    };
    paintView();
    dlg.showModal();
    closeBtn.focus();
  });

  closeBtn.addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", function () {
    if (opener) opener.focus();
  });

  paintToggle();
})();
