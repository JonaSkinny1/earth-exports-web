/* Card grids with a hover (desktop) / tap (phone) enlarged view of one card. */
(function () {
  var V = "?v=20261012-cards2";
  var SOL = ["Ventkin","Icecutters","Hazedrift","Veilborn","Red Watchers","Slagbacks","Wellkeepers","Farfallen","Lodestars","Edgewardens","Starwake Comet"];
  var BEYOND = ["Greylight","Bronzeridge","Ceti Highborn","Darkreed","The Kindled","Amberhive","Greenlings","The Forgotten Men","Junkwrights","Bisola","The Hushed","Mimics"];
  var DARK = ["Ventkin","Hazedrift","Red Watchers","Edgewardens"];
  function slug(n) { return n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function c(n, dark) { return { src: "images/cards/" + slug(n) + (dark ? "-cv" : "-ee") + ".webp" + V, alt: n + (dark ? " dark crew-file card" : " light Earth-file card") }; }
  var BACK_EE = { src: "images/cards/back-ee.webp" + V, alt: "Card back" }, BACK_CV = { src: "images/cards/back-cv.webp" + V, alt: "Card back, crew face" };
  var SETS = {
    starter: { cols: 6, cards: SOL.map(function (n) { return c(n); }).concat(DARK.map(function (n) { return c(n, true); }), [BACK_CV]) },
    beyond: { cols: 4, cards: BEYOND.map(function (n) { return c(n); }) },
    all: { cols: 6, cards: SOL.concat(BEYOND).map(function (n) { return c(n); }).concat([BACK_EE]) }
  };
  var grids = [];
  document.querySelectorAll("[data-cardset]").forEach(function (fig) {
    var set = SETS[fig.getAttribute("data-cardset")]; if (!set) return;
    var rows = Math.ceil(set.cards.length / set.cols);
    var grid = document.createElement("div");
    grid.className = "card-grid";
    grid.style.setProperty("--cols", set.cols);
    grid.style.setProperty("--rows", rows);
    set.cards.forEach(function (k) {
      var i = document.createElement("img");
      i.src = k.src; i.alt = k.alt; i.width = 750; i.height = 1050; i.loading = "lazy"; i.decoding = "async";
      i.setAttribute("data-zoom", ""); grid.appendChild(i);
    });
    fig.innerHTML = ""; fig.appendChild(grid);
    grids.push({ el: grid, cols: set.cols, rows: rows });
  });
  function fit() {
    grids.forEach(function (g) {
      var W = g.el.clientWidth, H = g.el.clientHeight, gap = Math.max(3, W * 0.012);
      var w = Math.min((W - gap * (g.cols + 1)) / g.cols, ((H - gap * (g.rows + 1)) / g.rows) * 5 / 7);
      g.el.style.setProperty("--cw", Math.floor(w) + "px"); g.el.style.gap = gap + "px";
    });
  }
  fit(); window.addEventListener("resize", fit);
  if (window.ResizeObserver) grids.forEach(function (g) { new ResizeObserver(fit).observe(g.el); });

  var pop = document.createElement("div");
  pop.className = "card-zoom"; pop.hidden = true; pop.setAttribute("role", "dialog"); pop.setAttribute("aria-label", "Enlarged card");
  var big = document.createElement("img"); pop.appendChild(big);
  document.body.appendChild(pop);
  var current = null, touchMode = false;
  function show(img) {
    current = img; big.src = img.src; big.alt = img.alt; pop.hidden = false;
    pop.classList.toggle("is-tap", touchMode);
  }
  function hide() { current = null; pop.hidden = true; }
  document.addEventListener("pointerover", function (e) {
    if (e.pointerType !== "mouse") return;
    var img = e.target.closest && e.target.closest("img[data-zoom], .packs-cards img");
    if (img) { touchMode = false; show(img); }
  });
  document.addEventListener("pointerout", function (e) {
    if (e.pointerType !== "mouse") return;
    var img = e.target.closest && e.target.closest("img[data-zoom], .packs-cards img");
    if (img && img === current && !(e.relatedTarget && img.contains(e.relatedTarget))) hide();
  });
  document.addEventListener("click", function (e) {
    if (!pop.hidden && touchMode) { e.preventDefault(); e.stopPropagation(); hide(); return; }
    var img = e.target.closest && e.target.closest("img[data-zoom], .packs-cards img");
    if (img && (e.pointerType ? e.pointerType !== "mouse" : matchMedia("(hover: none)").matches)) {
      e.preventDefault(); e.stopPropagation(); touchMode = true; show(img);
    }
  }, true);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") hide(); });
})();
