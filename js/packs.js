(function () {
  var SOL = ["Ventkin","Icecutters","Hazedrift","Veilborn","Red Watchers","Slagbacks","Wellkeepers","Farfallen","Lodestars","Edgewardens","Starwake Comet"];
  var BEYOND = ["Greylight","Bronzeridge","Ceti Highborn","Darkreed","The Kindled","Amberhive","Greenlings","The Forgotten Men","Junkwrights","Bisola","The Hushed","Mimics"];
  var STARTER_DARK = ["Ventkin","Hazedrift","Red Watchers","Edgewardens"];
  function slug(n) { return n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function card(n, dark) { return { src: "images/cards/" + slug(n) + (dark ? "-cv" : "-ee") + ".webp?v=20261012-cards2", alt: n + (dark ? " dark crew-file card" : " light Earth-file card") }; }
  var PACKS = {
    starter: { desc: "The full merchant trading game for 2 players (up to 4). It has all 11 Sol species as light cards plus 4 dark crew-file cards (Ventkin, Hazedrift, Red Watchers, Edgewardens). It also includes cargo, ship, event and route cards, a Sol port reference sheet, a rules sheet and Stamp tokens.",
      cards: SOL.map(function (n) { return card(n, false); }).concat(STARTER_DARK.map(function (n) { return card(n, true); })) },
    beyond: { desc: "Expansion for the Merchant Starter. It adds the 12 Beyond Sol species as light cards, plus outer-system cargo, ships, events and routes. You need the Starter to play.",
      cards: BEYOND.map(function (n) { return card(n, false); }) },
    booster: { desc: "5 cards: 3 commons, 1 uncommon and 1 rare. The rare can be a dark crew-file species, a rare event, a ship upgrade or a foil Helion Crystal chase card. Boosters are how you collect the rest of the dark cards. Shown here: the dark species cards you can pull.",
      cards: SOL.concat(BEYOND).filter(function (n) { return STARTER_DARK.indexOf(n) === -1; }).map(function (n) { return card(n, true); }) },
    twin: { desc: "Coming later, not in year one. The light and dark cards of one species, sold as a pair. Example shown: Lodestars.",
      cards: [card("Lodestars", false), card("Lodestars", true)] }
  };
  var sel = document.getElementById("pack-pick"), desc = document.getElementById("pack-desc"), box = document.getElementById("pack-cards");
  if (!sel) return;
  function show() {
    var p = PACKS[sel.value]; desc.textContent = p.desc; box.innerHTML = "";
    p.cards.forEach(function (c) { var i = document.createElement("img"); i.src = c.src; i.alt = c.alt; i.width = 750; i.height = 1050; i.loading = "lazy"; i.decoding = "async"; box.appendChild(i); });
  }
  sel.addEventListener("change", show); show();
})();
