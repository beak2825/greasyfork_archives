// ==UserScript==
// @name         MoDuL's: Racing Theme Changer
// @namespace    modul.torn.racing
// @version      1.2.3
// @description  Racing Theme Changer (PDA compatible)
// @author       MoDuL, BrainSlug (Thanks for the idea buddy)
// @match        https://www.torn.com/page.php?sid=racing*
// @match        https://www.torn.com/loader.php?sid=racing*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563548/MoDuL%27s%3A%20Racing%20Theme%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/563548/MoDuL%27s%3A%20Racing%20Theme%20Changer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  if (window.__RACING_THEME_LOADED__) return;
  window.__RACING_THEME_LOADED__ = true;

  var VERSION = "1.2.4";
  var TAG = "[MoDuL Racing Theme v" + VERSION + "]";
  try { console.log(TAG, "Loaded ✅"); } catch (e) {}

  var KEY = "RT_THEME_CLASS";
  var CLASSES = ["A", "B", "C", "D", "E"];
  var selected = gmGet(KEY, "A");

  var ROOT_ID = "Racing_theme_root";
  var BTN_ID = "Racing_theme_btn";
  var PANEL_ID = "Racing_theme_panel";
  var SELECT_ID = "Racing_theme_select";
  var STYLE_ID = "Racing_theme_style";

  var IMG_SELECTOR_MAIN = ".img-track";
  var IMG_SELECTOR_ANY  = "img[class*='img-track']";

  var BTN_SIZE = 28;

  var STOP_WHEN_BANNER_OFFSCREEN = true;
  var X_OFFSET = 6;
  var Y_OFFSET = -36;
  var EDGE_PAD = 6;
  var IO_MARGIN = "250px 0px 250px 0px";

  var bannerInView = true;
  var raf = 0;
  var moTimer = 0;
  var lastImgSrc = "";
  var lastAppliedClass = "";

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
      "#" + PANEL_ID + "{pointer-events:auto;position:absolute;top:calc(100% + 10px);right:0;min-width:220px;padding:10px;border-radius:12px;background:rgba(20,20,20,0.94);border:1px solid rgba(255,255,255,0.10);box-shadow:0 12px 28px rgba(0,0,0,0.55);display:none;}",
      "#" + ROOT_ID + ".open #" + PANEL_ID + "{display:block;}",
      "#" + PANEL_ID + " .ttl{font-weight:700;opacity:.92;margin:2px 0 8px 0;font-size:13px;}",
      "#" + SELECT_ID + "{width:100%;border-radius:10px;padding:10px 12px;font-size:16px;background:rgba(255,255,255,0.82);}",
      "#racingdetails{overflow:hidden !important;height:auto !important;max-height:none !important;}",
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
      '<div id="' + BTN_ID + '" title="Change theme">' + pencilSvg() + "</div>" +
      '<div id="' + PANEL_ID + '">' +
        '<div class="ttl">Theme / Track class</div>' +
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
      var v = e && e.target ? e.target.value : "";
      setSelectedClass(v, "picker");
      root.classList.remove("open");
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

  function findClassRibbon() {
    var banner = document.querySelector(".racing-main-wrap");
    if (!banner) return null;

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

  function applyThemeToRaceDetails(rgb) {
    var ul = document.getElementById("racingdetails");
    if (!ul || !rgb) return;

    ensureRaceDetailsUnder_();

    ul.style.color = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
    ul.style.background = "linear-gradient(rgba(40,40,40,0.90),rgba(10,10,10,0.84))";
    ul.style.border = "2px solid rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.35)";
    ul.style.borderRadius = "10px";
    ul.style.boxShadow = "0 4px 14px rgba(0,0,0,0.55),0 0 0 1px rgba(0,0,0,0.6)";
    ul.style.backdropFilter = "blur(3px)";
    ul.style.webkitBackdropFilter = "blur(3px)";
  }

  function applyAutoColor(ribbon) {
    var btn = document.getElementById(BTN_ID);
    if (!btn) return;

    var rgb = null;
    try {
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

    applyThemeToRaceDetails(rgb);
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

  function positionPencil() {
    if (!bannerInView) return;

    var root = ensureOverlay();
    var banner = document.querySelector(".racing-main-wrap");
    if (!banner) return;

    var br = banner.getBoundingClientRect();
    if (STOP_WHEN_BANNER_OFFSCREEN) {
      var vh = viewportH();
      var inViewNow = (br.bottom >= -40) && (br.top <= vh + 40);
      if (!inViewNow) { setHidden(true); bannerInView = false; return; }
    }

    setHidden(false);

    var ribbon = findClassRibbon();
    if (!ribbon) {
      placeFixed(root, Math.round(br.right - BTN_SIZE - 10), Math.round(br.top + 10));
      return;
    }

    applyAutoColor(ribbon);

    var rr = ribbon.getBoundingClientRect();
    placeFixed(root, Math.round(rr.right - BTN_SIZE - X_OFFSET), Math.round(rr.bottom + Y_OFFSET));
  }

  function getTrackImg() {
    return document.querySelector(IMG_SELECTOR_MAIN);
  }

  // ✅ normalize odd Torn srcs like: "//casino/race/images/A1_s.jpg"
  function normalizeSrc_(src) {
    src = String(src || "").trim();
    if (!src) return "";
    if (src.indexOf("//casino/") === 0) src = src.slice(1); // "//casino/..." -> "/casino/..."
    return src;
  }

  // ✅ matches:
  // /casino/race/images/A1.jpg
  // /casino/race/images/A1_s.jpg   (stats thumbnails)
  function rewriteTrackSrc_(src, classLetter) {
    src = normalizeSrc_(src);
    if (!src) return null;

    // Parse safely:
    // - absolute: https://www.torn.com/...
    // - relative: /casino/...
    // - relative: casino/...  (rare)
    var url;
    try {
      url = new URL(src, location.origin);
    } catch (e) {
      return null;
    }

    var path = url.pathname || "";
    var m = path.match(/^\/casino\/race\/images\/([A-Z])(\d+)(?:_s)?\.jpg$/i);
    if (!m) return null;

    var id = m[2];
    var isSmall = /_s\.jpg$/i.test(path);
    url.pathname = "/casino/race/images/" + classLetter + id + (isSmall ? "_s" : "") + ".jpg";

    if (!url.search) url.search = "?v=" + Date.now();
    return url.toString();
  }

  function setTrackImageClass(classLetter) {
    var img = getTrackImg();
    if (!img) return;

    var src = img.getAttribute("src") || img.src || "";
    var newSrc = rewriteTrackSrc_(src, classLetter);
    if (!newSrc) return;

    img.setAttribute("src", newSrc);
  }

  // ✅ NEW: also hit stats images + any other img-track variants
  function setAllTrackThumbsClass_(classLetter) {
    var imgs = document.querySelectorAll(IMG_SELECTOR_ANY);
    for (var i = 0; i < imgs.length; i++) {
      var im = imgs[i];
      var s = im.getAttribute("src") || im.src || "";
      var ns = rewriteTrackSrc_(s, classLetter);
      if (ns && ns !== s) im.setAttribute("src", ns);
    }
  }

  function ensureRaceDetailsUnder_() {
    var ul = document.getElementById("racingdetails");
    if (!ul) return;

    var tracks = document.querySelector(".track-wrap .tracks");
    if (!tracks) return;

    if (ul.previousElementSibling !== tracks) {
      tracks.insertAdjacentElement("afterend", ul);
    }
    ul.style.position = "static";
  }

  function syncPickerValue() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    var sel = root.querySelector("#" + SELECT_ID);
    if (!sel) return;
    if (sel.value !== selected) sel.value = selected;
  }

  function applyAll(raceClass) {
    if (lastAppliedClass !== raceClass) lastAppliedClass = raceClass;

    var banner = document.querySelector(".racing-main-wrap");
    if (banner) applyBannerClass(banner, raceClass);

    ensureRaceDetailsUnder_();

    setTrackImageClass(raceClass);
    setAllTrackThumbsClass_(raceClass);

    syncPickerValue();
  }

  function setSelectedClass(newClass, sourceTag) {
    if (!newClass) return;
    newClass = String(newClass).toUpperCase();
    if (CLASSES.indexOf(newClass) === -1) return;

    if (selected !== newClass) {
      selected = newClass;
      gmSet(KEY, selected);
    }

    applyAll(selected);

    try { console.log(TAG, "Class =", selected, sourceTag ? "(" + sourceTag + ")" : ""); } catch (e) {}
    schedule();
  }

  function schedule() {
    if (!bannerInView) return;
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      positionPencil();
      applyAll(selected);
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

  function setupLightMutationObserver() {
    var root = document.getElementById("racingMainContainer") ||
               document.getElementById("racingAdditionalContainer") ||
               document.body;

    if (!root || typeof MutationObserver !== "function") return;

    var obs = new MutationObserver(function () {
      if (moTimer) return;
      moTimer = window.setTimeout(function () {
        moTimer = 0;

        ensureRaceDetailsUnder_();

        var img = getTrackImg();
        if (img) {
          var s = img.getAttribute("src") || img.src || "";
          if (s && s !== lastImgSrc) {
            lastImgSrc = s;
            setTrackImageClass(selected);
          }
        }

        setAllTrackThumbsClass_(selected);
        schedule();
      }, 250);
    });

    obs.observe(root, { childList: true, subtree: true });
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
      applyAll(selected);

      setupVisibilityObserver(banner);
      setupLightMutationObserver();

      window.addEventListener("resize", schedule, { passive: true });
      window.addEventListener("scroll", schedule, { passive: true });

      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", schedule, { passive: true });
        window.visualViewport.addEventListener("scroll", schedule, { passive: true });
      }

      setTimeout(schedule, 300);
      setTimeout(schedule, 900);
    }, 250);
  }

  boot();
})();
