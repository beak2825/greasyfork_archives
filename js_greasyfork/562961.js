// ==UserScript==
// @name         Brainslug: Racing Banner Changer (PDA Safe)
// @namespace    brainslug.torn.racing
// @version      0.6.5
// @description  Banner class changer (PDA Compatible)
// @author       Brainslug
// @contributor  MoDuL (PDA compatibility conversion)
// @match        https://www.torn.com/page.php?sid=racing*
// @match        https://www.torn.com/loader.php?sid=racing*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562961/Brainslug%3A%20Racing%20Banner%20Changer%20%28PDA%20Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562961/Brainslug%3A%20Racing%20Banner%20Changer%20%28PDA%20Safe%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Prevent double-inject
  if (window.__Brainslug_BANNER_LOADED_V065__) return;
  window.__Brainslug_BANNER_LOADED_V065__ = true;

  // -------------------- Config --------------------
  var KEY = "BR_CRB_BANNER";
  var CLASSES = ["A", "B", "C", "D", "E"];

  // Position mode:
  //  - "bannerBR" => bottom-right of the banner
  //  - "ribbon"   => under the CLASS ribbon
  var POSITION_MODE = "ribbon";

  // Bottom-right padding (bannerBR)
  var BANNER_RIGHT_PAD = 2;
  var BANNER_BOTTOM_PAD = 2;

  // Ribbon offsets
  var X_OFFSET = 6;
  var Y_OFFSET = -36;

  // Behaviour
  var STOP_WHEN_BANNER_OFFSCREEN = true;
  var OFFSCREEN_MARGIN_PX = 40;

  // UI IDs
  var ROOT_ID = "brainslug_banner_root";
  var BTN_ID = "brainslug_banner_btn";
  var PANEL_ID = "brainslug_banner_panel";
  var SELECT_ID = "brainslug_banner_select";
  var STYLE_ID = "brainslug_banner_style";

  var BTN_SIZE = 28;
  var EDGE_PAD = 6;

  // State
  var selected = gmGet(KEY, "A");
  var raf = 0;

  // -------------------- Storage helpers --------------------
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

  // -------------------- CSS --------------------
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

  // -------------------- Pencil SVG --------------------
  function pencilSvg() {
    return (
      '<svg viewBox="0 0 24 24">' +
        '<path fill="currentColor" d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25z"/>' +
        '<path fill="rgba(255,255,255,0.85)" d="M20.71 6.04a1.003 1.003 0 0 0 0-1.42L19.37 3.29a1.003 1.003 0 0 0-1.42 0l-1.13 1.13 3.75 3.75 1.14-1.13z"/>' +
      "</svg>"
    );
  }

  // -------------------- Overlay --------------------
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
    CLASSES.forEach(function (c) {
      var o = document.createElement("option");
      o.value = c;
      o.textContent = "Class " + c;
      sel.appendChild(o);
    });
    sel.value = selected;

    root.querySelector("#" + BTN_ID).onclick = function (e) {
      e.stopPropagation();
      root.classList.toggle("open");
    };

    sel.onchange = function () {
      selected = sel.value;
      gmSet(KEY, selected);
      var banner = document.querySelector(".racing-main-wrap");
      if (banner) applyBannerClass(banner, selected);
      root.classList.remove("open");
      schedule();
    };

    document.addEventListener("pointerdown", function (e) {
      if (!root.contains(e.target)) root.classList.remove("open");
    }, true);

    return root;
  }

function setHidden(hidden) {
  var root = document.getElementById(ROOT_ID);
  if (!root) return;

  if (hidden) {
    root.classList.remove("open");
    root.style.display = "none";       // HARD hide (prevents PDA “locking”)
    root.style.left = "-9999px";       // park offscreen just in case
    root.style.top  = "-9999px";
  } else {
    root.style.display = "block";
  }
} 

  // -------------------- Banner logic --------------------
  function applyBannerClass(banner, raceClass) {
    CLASSES.forEach(function (c) {
      banner.classList.remove("class-" + c);
    });
    banner.classList.add("class-" + raceClass);
  }

  function findClassRibbon() {
    var banner = document.querySelector(".racing-main-wrap");
    if (!banner) return null;
    var nodes = banner.querySelectorAll("div,span,strong,b");
    for (var i = 0; i < nodes.length && i < 250; i++) {
      if (/^class\b/i.test((nodes[i].textContent || "").trim())) {
        return nodes[i].parentElement || nodes[i];
      }
    }
    return null;
  }

  function parseRgb(rgb) {
    var m = String(rgb || "").match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return m ? { r:+m[1], g:+m[2], b:+m[3] } : null;
  }

  function applyAutoColor(ribbon) {
    var btn = document.getElementById(BTN_ID);
    if (!btn || !ribbon) return;
    var rgb = parseRgb(getComputedStyle(ribbon).color);
    if (!rgb) return;

    btn.style.color = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
    btn.style.background = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.10)";
    btn.style.borderColor = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.25)";
  }

  // -------------------- Positioning --------------------
  function position() {
    var root = ensureOverlay();
    var banner = document.querySelector(".racing-main-wrap");
    if (!banner) { setHidden(true); return; }

    var br = banner.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;

    // If banner off-screen: hide and STOP (no ribbon scan, no color work)
    if (STOP_WHEN_BANNER_OFFSCREEN) {
      var inView =
        (br.bottom >= -OFFSCREEN_MARGIN_PX) &&
        (br.top <= vh + OFFSCREEN_MARGIN_PX);

      if (!inView) { setHidden(true); return; }
    }

    setHidden(false);

    // Only do the expensive stuff when in view
    var ribbon = findClassRibbon();
    if (ribbon) applyAutoColor(ribbon);

    var left, top;

    if (POSITION_MODE === "bannerBR") {
      left = br.right - BTN_SIZE - BANNER_RIGHT_PAD;
      top  = br.bottom - BTN_SIZE - BANNER_BOTTOM_PAD;
    } else {
      var rr = ribbon ? ribbon.getBoundingClientRect() : br;
      left = rr.right - BTN_SIZE - X_OFFSET;
      top  = rr.bottom + Y_OFFSET;
    }

    // Clamp a bit
    left = Math.max(EDGE_PAD, left);
    top  = Math.max(EDGE_PAD, top);

    root.style.left = left + "px";
    root.style.top  = top + "px";
  }

  function schedule() {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      position();
    });
  }

  // -------------------- Boot --------------------
  function boot() {
    var t = setInterval(function () {
      var banner = document.querySelector(".racing-main-wrap");
      if (!banner) return;

      clearInterval(t);
      ensureOverlay();
      applyBannerClass(banner, selected);
      schedule();

      window.addEventListener("scroll", schedule, { passive:true });
      window.addEventListener("resize", schedule, { passive:true });

      if (window.visualViewport) {
        window.visualViewport.addEventListener("scroll", schedule, { passive:true });
        window.visualViewport.addEventListener("resize", schedule, { passive:true });
      }
    }, 250);
  }

  boot();
})();