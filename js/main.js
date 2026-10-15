// Quantum Correction to Electronic Stopping Power — site behaviour

// QA mode (?qa): collapse 100vh screens into a compact flow so a single tall
// screenshot captures the whole page. No effect on the real site.
if (location.search.indexOf("qa") >= 0) document.documentElement.classList.add("qa");

// 1. Hero: reveal the "Explore" button once the ΔE video finishes playing.
(function () {
  var hv = document.getElementById("heroVideo");
  var btn = document.getElementById("exploreBtn");
  if (!hv || !btn) return;
  var reveal = function () { btn.classList.add("show"); };
  hv.addEventListener("ended", reveal);
  // Fallback: reveal shortly after the expected duration (in case "ended" is missed).
  hv.addEventListener("loadedmetadata", function () {
    var ms = (isFinite(hv.duration) ? hv.duration * 1000 : 8000) + 800;
    setTimeout(reveal, ms);
  });
  var p = hv.play();
  if (p && p.catch) p.catch(function () { /* autoplay may be blocked; ignore */ });
})();

// 2. Scroll-reveal content as each screen enters the viewport.
(function () {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add("in"); });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { obs.observe(el); });
})();

// 2b. QA/deep-link: ?s=<section-id> scrolls straight to that screen on load.
(function () {
  var m = /[?&]s=([a-z]+)/.exec(location.search);
  if (!m) return;
  function go() {
    var el = document.getElementById(m[1]);
    if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
  }
  window.addEventListener("load", function () { setTimeout(go, 150); });
})();

// 3. Pause videos while off-screen (saves CPU); resume when visible.
(function () {
  if (!("IntersectionObserver" in window)) return;
  var vobs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else { v.pause(); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll("video").forEach(function (v) { vobs.observe(v); });
})();
