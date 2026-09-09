(function () {
  /* Mobile nav */
  var btn = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* Live clock in status bar (Earth local display) */
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

  /* Soft unauthorized → public declassified resolve */
  var banner = document.querySelector(".access-banner");
  if (banner && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setTimeout(function () {
      banner.classList.add("is-resolved");
    }, 1600);
  } else if (banner) {
    banner.classList.add("is-resolved");
  }

  /* Home boot sequence — hide after play; skip if reduced motion */
  var boot = document.getElementById("boot-sequence");
  if (boot) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      boot.hidden = true;
    } else {
      setTimeout(function () {
        boot.setAttribute("aria-hidden", "true");
        boot.style.opacity = "0.55";
      }, 3200);
    }
  }
})();
