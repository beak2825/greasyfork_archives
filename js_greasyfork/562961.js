// ==UserScript==
// @name         BrainSlug's Racing Theme Changer
// @namespace    brainslug.torn.racing
// @version      0.6.5
// @description  Banner Theme Changer (OG Car Names, PDA compatible) 
// @author       BrainSlug
// @TornPDA      MoDuL
// @match        https://www.torn.com/page.php?sid=racing*
// @match        https://www.torn.com/loader.php?sid=racing*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562961/BrainSlug%27s%20Racing%20Theme%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/562961/BrainSlug%27s%20Racing%20Theme%20Changer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  if (window.__BrainSlug_BANNER_LOADED_V064__) return;
  window.__BrainSlug_BANNER_LOADED_V064__ = true;

  var KEY = "BR_CRB_BANNER";
  var CLASSES = ["A", "B", "C", "D", "E"];

  var ROOT_ID = "BrainSlug_banner_root";
  var BTN_ID  = "BrainSlug_banner_btn";
  var PANEL_ID = "BrainSlug_banner_panel";
  var SELECT_ID = "BrainSlug_banner_select";
  var STYLE_ID = "BrainSlug_banner_style";

  var BTN_SIZE = 28;
var STOP_WHEN_BANNER_OFFSCREEN = true;
  // Position tuning
  var X_OFFSET = 6;     // move left from ribbon right edge
  var Y_OFFSET = -36;     // move down from ribbon bottom edge
  var EDGE_PAD = 6;     // clamp to viewport
  var IO_MARGIN = "250px 0px 250px 0px";

  var bannerInView = true;
  var selected = gmGet(KEY, "A");
  var raf = 0;

  function gmGet(k, def) {
    try { if (typeof GM_getValue === "function") return GM_getValue(k, def); } catch (e) {}
    try {
      var v = localStorage.getItem(k);
      return v == null ? def : v;
    } catch (e2) {}
    return def;
  }

  function gmSet(k, v) {
    try { if (typeof GM_setValue === "function") GM_setValue(k, v); } catch (e) {}
    try { localStorage.setItem(k, v); } catch (e2) {}
  }

  function injectCssOnce() {
    if (document.getElementById(STYLE_ID)) return;

    var css = [
      "#" + ROOT_ID + "{position:fixed;z-index:2147483647;pointer-events:none;left:0;top:0;}",
      "#" + BTN_ID + "{pointer-events:auto;width:" + BTN_SIZE + "px;height:" + BTN_SIZE + "px;border-radius:999px;display:flex;align-items:center;justify-content:center;user-select:none;-webkit-tap-highlight-color:transparent;background:rgba(255,255,255,0.10);border:1px solid rgba(255,255,255,0.20);color:#fff;box-shadow:0 6px 18px rgba(0,0,0,0.35);}",
      "#" + BTN_ID + " svg{width:18px;height:18px;display:block;}",
      "#" + PANEL_ID + "{pointer-events:auto;position:absolute;top:calc(100% + 10px);right:0;min-width:200px;padding:10px;border-radius:12px;background:rgba(20,20,20,0.94);border:1px solid rgba(255,255,255,0.10);box-shadow:0 12px 28px rgba(0,0,0,0.55);display:none;}",
      "#" + ROOT_ID + ".open #" + PANEL_ID + "{display:block;}",
      "#" + PANEL_ID + " .ttl{font-weight:700;opacity:.92;margin:2px 0 8px 0;font-size:13px;}",
      "#" + SELECT_ID + "{width:100%;border-radius:10px;padding:10px 12px;font-size:16px;background:rgba(255,255,255,0.82);}"
    ].join("\n");

    try {
      if (typeof GM_addStyle === "function") {
        GM_addStyle(css);
      } else {
        var s = document.createElement("style");
        s.id = STYLE_ID;
        s.textContent = css;
        document.head.appendChild(s);
      }
    } catch (e) {}
  }

  function pencilSvg() {
    return (
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<path fill="currentColor" d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25z"/>' +
        '<path fill="rgba(255,255,255,0.85)" d="M20.71 6.04a1.003 1.003 0 0 0 0-1.42L19.37 3.29a1.003 1.003 0 0 0-1.42 0l-1.13 1.13 3.75 3.75 1.14-1.13z"/>' +
      "</svg>"
    );
  }

  function ensureOverlay() {
    var root = document.getElementById(ROOT_ID);
    if (root && document.contains(root)) return root;

    injectCssOnce();

    root = document.createElement("div");
    root.id = ROOT_ID;

    root.innerHTML =
      '<div id="' + BTN_ID + '" title="Change banner">' + pencilSvg() + "</div>" +
      '<div id="' + PANEL_ID + '">' +
        '<div class="ttl">Banner class</div>' +
        '<select id="' + SELECT_ID + '"></select>' +
      "</div>";

    document.body.appendChild(root);

    var sel = root.querySelector("#" + SELECT_ID);
    for (var i = 0; i < CLASSES.length; i++) {
      var opt = document.createElement("option");
      opt.value = CLASSES[i];
      opt.textContent = "Class " + CLASSES[i];
      sel.appendChild(opt);
    }
    sel.value = selected;

    var btn = root.querySelector("#" + BTN_ID);

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      root.classList.toggle("open");
    });

    sel.addEventListener("change", function (e) {
      selected = e.target.value;
      gmSet(KEY, selected);

      var banner = document.querySelector(".racing-main-wrap");
      if (banner) applyBannerClass(banner, selected);

      root.classList.remove("open");
      schedule();
    });

    document.addEventListener("pointerdown", function (e) {
      var r = document.getElementById(ROOT_ID);
      if (!r) return;
      if (!r.contains(e.target)) r.classList.remove("open");
    }, true);

    return root;
  }

  function applyBannerClass(banner, raceClass) {
    for (var i = 0; i < CLASSES.length; i++) banner.classList.remove("class-" + CLASSES[i]);
    banner.classList.add("class-" + raceClass);
  }

  // Find the CLASS ribbon quickly (no full scan):
  // try common candidates near top-right; fallback to first element that contains "CLASS"
  function findClassRibbon() {
    var banner = document.querySelector(".racing-main-wrap");
    if (!banner) return null;

    // 1) Prefer elements that literally contain text "CLASS"
    var el = banner.querySelector("*:not(script):not(style)");
    // quick text search (bounded)
    var nodes = banner.querySelectorAll("div,span,a,strong,b");
    for (var i = 0; i < nodes.length && i < 250; i++) {
      var t = (nodes[i].textContent || "").trim();
      if (/^class\b/i.test(t)) return nodes[i].parentElement || nodes[i];
    }
    return null;
  }

  function parseRgb(rgb) {
    var m = String(rgb || "").match(/rgba?\(\s*(\d+)[^\d]+(\d+)[^\d]+(\d+)/i);
    if (!m) return null;
    return { r: +m[1], g: +m[2], b: +m[3] };
  }

  function applyAutoColor(ribbon) {
    var btn = document.getElementById(BTN_ID);
    if (!btn) return;

    var rgb = null;
    try {
      // if ribbon contains the text element, use its computed color
      var target = ribbon;
      var kids = ribbon.querySelectorAll("*");
      for (var i = 0; i < kids.length && i < 50; i++) {
        var t = (kids[i].textContent || "").trim();
        if (/^class\b/i.test(t)) { target = kids[i]; break; }
      }
      rgb = parseRgb(window.getComputedStyle(target).color);
    } catch (e) {}

    if (!rgb) return;

    btn.style.color = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
    btn.style.background = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.10)";
    btn.style.borderColor = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.22)";
    btn.style.boxShadow =
      "0 0 0 1px rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.18), " +
      "0 6px 18px rgba(0,0,0,0.38), " +
      "0 0 14px rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.18)";
  }

  function viewportW() {
    return (window.visualViewport && window.visualViewport.width) ? window.visualViewport.width : window.innerWidth;
  }
  function viewportH() {
    return (window.visualViewport && window.visualViewport.height) ? window.visualViewport.height : window.innerHeight;
  }

  function setHidden(hidden) {
    var btn = document.getElementById(BTN_ID);
    if (!btn) return;
    btn.style.opacity = hidden ? "0" : "1";
    btn.style.pointerEvents = hidden ? "none" : "auto";
    var root = document.getElementById(ROOT_ID);
    if (hidden && root) root.classList.remove("open");
  }

  function position() {
    if (!bannerInView) return;

    var root = ensureOverlay();
    var banner = document.querySelector(".racing-main-wrap");
    if (!banner) return;

    // hide if banner truly off-screen
    var br = banner.getBoundingClientRect();
    if (STOP_WHEN_BANNER_OFFSCREEN) {
      var vh = viewportH();
      var inViewNow = (br.bottom >= -40) && (br.top <= vh + 40);
      if (!inViewNow) { setHidden(true); bannerInView = false; return; }
    }

    setHidden(false);

    var ribbon = findClassRibbon();
    if (!ribbon) {
      // fallback: put pencil top-right INSIDE banner area (screen coords)
      var left0 = Math.round(br.right - BTN_SIZE - 10);
      var top0  = Math.round(br.top + 10);
      placeFixed(root, left0, top0);
      return;
    }

    applyAutoColor(ribbon);

    var rr = ribbon.getBoundingClientRect();

    // place UNDER ribbon, aligned near its right edge
    var left = Math.round(rr.right - BTN_SIZE - X_OFFSET);
    var top  = Math.round(rr.bottom + Y_OFFSET);

    placeFixed(root, left, top);
  }

  function placeFixed(root, left, top) {
    var vw = viewportW();
    var vh = viewportH();

    if (left < EDGE_PAD) left = EDGE_PAD;
    if (top < EDGE_PAD) top = EDGE_PAD;
    if (left + BTN_SIZE > vw - EDGE_PAD) left = vw - BTN_SIZE - EDGE_PAD;
    if (top + BTN_SIZE > vh - EDGE_PAD) top = vh - BTN_SIZE - EDGE_PAD;

    root.style.left = left + "px";
    root.style.top  = top + "px";
  }

  function schedule() {
    if (!bannerInView) return;
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      position();
    });
  }

  function setupVisibilityObserver(banner) {
    if (!banner || typeof IntersectionObserver !== "function") return;

    var io = new IntersectionObserver(function (entries) {
      var ent = entries && entries[0];
      bannerInView = !!(ent && ent.isIntersecting);
      setHidden(!bannerInView);
      if (bannerInView) schedule();
    }, { root: null, rootMargin: IO_MARGIN, threshold: 0.01 });

    io.observe(banner);
  }

  function boot() {
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      var banner = document.querySelector(".racing-main-wrap");
      if (!banner) {
        if (tries > 80) clearInterval(t);
        return;
      }
      clearInterval(t);

      ensureOverlay();
      applyBannerClass(banner, selected);
      setupVisibilityObserver(banner);
      schedule();

      // light observers / events
      window.addEventListener("resize", schedule, { passive: true });
      window.addEventListener("scroll", schedule, { passive: true });

      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", schedule, { passive: true });
        window.visualViewport.addEventListener("scroll", schedule, { passive: true });
      }

      // small delayed repositions for PDA layout
      setTimeout(schedule, 300);
      setTimeout(schedule, 900);

      // mutation observer, but throttled via rAF
      var obs = new MutationObserver(function () {
        if (!bannerInView) return;
        schedule();
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
    }, 250);
  }

  boot();
})();