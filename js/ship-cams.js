/* Ship cams: lazy-load looping muted videos; respect reduced motion. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var tiles = document.querySelectorAll(".cam-tile[data-cam]");

  function loadVideo(video) {
    if (!video || video.getAttribute("data-loaded") === "1") return;
    var src = video.getAttribute("data-src");
    if (!src) return;
    video.src = src;
    video.setAttribute("data-loaded", "1");
    video.load();
  }

  function playVideo(tile) {
    var video = tile.querySelector("video.cam-video");
    if (!video) return;
    loadVideo(video);
    video.muted = true;
    var play = video.play();
    if (play && typeof play.then === "function") {
      play.then(function () {
        tile.classList.add("is-playing");
        tile.classList.remove("is-static");
      }).catch(function () {
        tile.classList.add("is-static");
        tile.classList.remove("is-playing");
      });
    }
  }

  function pauseVideo(tile) {
    var video = tile.querySelector("video.cam-video");
    if (!video) return;
    video.pause();
  }

  tiles.forEach(function (tile) {
    var video = tile.querySelector("video.cam-video");
    var button = tile.querySelector(".cam-play");
    if (!video) return;

    if (reduce) {
      tile.classList.add("is-static");
    }

    if (button) {
      button.addEventListener("click", function () {
        playVideo(tile);
      });
    }

    video.addEventListener("pause", function () {
      if (reduce || video.ended) {
        tile.classList.add("is-static");
        tile.classList.remove("is-playing");
      }
    });
  });

  if (!("IntersectionObserver" in window)) {
    tiles.forEach(function (tile) {
      if (!reduce) playVideo(tile);
    });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var tile = entry.target;
      if (entry.isIntersecting) {
        if (!reduce) playVideo(tile);
        else loadVideo(tile.querySelector("video.cam-video"));
      } else {
        pauseVideo(tile);
      }
    });
  }, { rootMargin: "200px 0px", threshold: 0.15 });

  tiles.forEach(function (tile) { io.observe(tile); });
})();
