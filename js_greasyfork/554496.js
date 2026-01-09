// ==UserScript==
// @name         YouTube Theater Fill (Brave) — v3.3 clean + OSD
// @namespace    https://greasyfork.org/users/1533208
// @version      3.3-stable
// @description  Stability-first build for Brave: prefer native theater toggle + fill viewport height with clean letterboxing.
// @author       Martin (Left234) & Lina
// @license      MIT
// @match        https://*.youtube.com/*
// @exclude      https://*.youtube.com/embed/*
// @exclude      https://music.youtube.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554496/YouTube%20Theater%20Fill%20%28Brave%29%20%E2%80%94%20v33%20clean%20%2B%20OSD.user.js
// @updateURL https://update.greasyfork.org/scripts/554496/YouTube%20Theater%20Fill%20%28Brave%29%20%E2%80%94%20v33%20clean%20%2B%20OSD.meta.js
// ==/UserScript==
(() => {
  "use strict";

  const CLASS    = "ytf-fill";
  const COVER    = "ytf-cover-header";
  const STYLE_ID = "ytf-fill-style";

  const LS_THEATER_PREF_KEYS = [
    "yt-player-theater-mode-preference",
    "ytd-player-theater-mode-preference",
  ];

  // ---------- utils ----------
  function onReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") fn();
    else document.addEventListener("DOMContentLoaded", fn, { once: true });
  }
  const $ = (sel, root=document) => root.querySelector(sel);

  function initViewportUnit() {
    let unit = "100vh";
    try {
      if (CSS.supports("height: 100dvh")) unit = "100dvh";
      else if (CSS.supports("height: 100svh")) unit = "100svh";
    } catch {}
    document.documentElement.style.setProperty("--ytf-viewport", unit);
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const css = `
/* Base */
body.${CLASS} { overflow-x: hidden !important; }
body.${CLASS} ytd-app { position: static !important; }

/* Size the main host containers to the usable viewport */
body.${CLASS} ytd-watch-flexy[theater] #player-theater-container.ytd-watch-flexy,
body.${CLASS} ytd-watch-flexy[theater] #player-full-bleed-container.ytd-watch-flexy,
body.${CLASS} ytd-watch-flexy[theater] #player-full-bleed-container,
body.${CLASS} ytd-watch-flexy[theater] #full-bleed-container.ytd-watch-flexy,
body.${CLASS} ytd-watch-grid[theater]   #player-theater-container.ytd-watch-grid,
body.${CLASS} ytd-watch-grid[theater]   #player-full-bleed-container.ytd-watch-grid,
body.${CLASS} ytd-watch-grid[theater]   #player-full-bleed-container,
body.${CLASS} ytd-watch-grid[theater]   #full-bleed-container.ytd-watch-grid {
  height: calc(var(--ytf-viewport, 100vh) - var(--ytf-offset, 56px)) !important;
  max-height: calc(var(--ytf-viewport, 100vh) - var(--ytf-offset, 56px)) !important;
  width: 100vw !important;
  max-width: 100vw !important;
  background: #000 !important;
  position: relative !important;
  inset: auto !important;
  left: 0 !important; right: 0 !important;
  transform: none !important;
  margin: 0 auto !important; padding: 0 !important;
}

/* These inner containers must stretch to 100% */
body.${CLASS} ytd-watch-flexy[theater] #player-container-outer.ytd-watch-flexy,
body.${CLASS} ytd-watch-flexy[theater] #player-container-inner.ytd-watch-flexy,
body.${CLASS} ytd-watch-flexy[theater] #player-container.ytd-watch-flexy,
body.${CLASS} ytd-watch-grid[theater]   #player-container-outer.ytd-watch-grid,
body.${CLASS} ytd-watch-grid[theater]   #player-container-inner.ytd-watch-grid,
body.${CLASS} ytd-watch-grid[theater]   #player-container.ytd-watch-grid {
  height: 100% !important; width: 100% !important;
  display: flex !important; justify-content: center !important; align-items: stretch !important;
  left: 0 !important; right: 0 !important; transform: none !important;
  margin: 0 !important; padding: 0 !important;
  position: relative !important; /* anchor for absolute fill below */
}

/* Ensure player + video absolutely fill the anchored box */
#movie_player,
#movie_player .html5-video-player,
#movie_player .html5-video-container,
#movie_player video.html5-main-video {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
}

#movie_player video.html5-main-video {
  display: block !important;
  object-fit: contain !important;
  object-position: center center !important;
}

/* Avoid ambient cinematics fighting our sizing */
body.${CLASS} #cinematics,
body.${CLASS} #cinematics-container { display: none !important; }

/* Header cover when fullscreen (prevents stray bars) */
body.${CLASS}.${COVER} { --ytf-offset: 0px !important; }
body.${CLASS}.${COVER} ytd-app #masthead-container.ytd-app,
body.${CLASS}.${COVER} ytd-masthead {
  position: absolute !important;
  top: 0 !important; left: 0 !important; right: 0 !important;
  z-index: 2020 !important; width: 100% !important;
}

/* If YouTube tries "cover", force contain to preserve full frame visibility */
.ytp-fit-cover-video .html5-main-video { object-fit: contain !important; }

/* Ensure clean bars on extra-wide videos (avoid page peeking) */
ytd-watch-flexy[theater] #player-theater-container.ytd-watch-flexy,
ytd-watch-grid[theater]   #player-theater-container.ytd-watch-grid {
  background: #000 !important;
}
`;
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
  }

  function masthead() {
    return document.getElementById("masthead-container") || $("ytd-masthead");
  }

  function updateOffset() {
    if (!document.body) return;
    if (document.body.classList.contains(COVER)) {
      document.documentElement.style.setProperty("--ytf-offset", "0px");
    } else {
      const h = masthead()?.offsetHeight || 56;
      document.documentElement.style.setProperty("--ytf-offset", h + "px");
    }
  }

  function isWatchUrl() {
    return location.pathname === "/watch" || /[?&]v=/.test(location.search);
  }
  const onWatch = () => isWatchUrl() || !!$("ytd-watch-flexy, ytd-watch-grid");

  function setTheaterPref() {
    try { LS_THEATER_PREF_KEYS.forEach(k => localStorage.setItem(k, "DEFAULT_ON")); } catch {}
  }

  // Prefer native theater toggle (same pathway as pressing 'T')
  function ensureTheaterNative() {
    setTheaterPref();
    const isTheater = !!$("ytd-watch-flexy[theater], ytd-watch-grid[theater]");
    if (isTheater) return;

    const btn = document.querySelector(".ytp-size-button");
    if (btn) btn.click();
  }

  function whenFlexy(cb) {
    const tryNow = () => {
      const el = $("ytd-watch-flexy, ytd-watch-grid");
      if (!el) return false;
      cb(el);
      return true;
    };
    if (tryNow()) return;
    const mo = new MutationObserver(() => { if (tryNow()) mo.disconnect(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  function isFullscreen() {
    return !!(document.fullscreenElement ||
              document.webkitFullscreenElement ||
              document.mozFullScreenElement ||
              document.msFullscreenElement);
  }
  function onFullscreenChange(){
    if (!document.body) return;
    document.body.classList.toggle(COVER, isFullscreen());
    updateOffset();
  }

  function apply(){
    if (!document.body) return;
    if (!onWatch()) { document.body.classList.remove(CLASS, COVER); return; }
    document.body.classList.add(CLASS);

    whenFlexy(() => {
      // Run theater enable on next frame so the player is fully attached.
      requestAnimationFrame(() => {
        ensureTheaterNative();
        updateOffset();
      });
    });
  }

  // ---------- init ----------
  initViewportUnit();
  injectStyle();

  onReady(() => {
    apply();
    updateOffset();

    document.addEventListener("yt-navigate-finish", apply);
    window.addEventListener("load", apply);
    window.addEventListener("resize", updateOffset);

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    document.addEventListener("mozfullscreenchange", onFullscreenChange);
    document.addEventListener("MSFullscreenChange", onFullscreenChange);
  });

  // ---- Minimal Volume OSD + Arrow Up/Down hotkeys (no layout changes) ----
  (function ytfMinimalVolumeOSD(){
    const VOL_STEP = 0.05;
    const SHIFT_MULT = 2;
    let osd, timer;

    function isEditable(el){
      if (!el) return false;
      if (el.isContentEditable) return true;
      const t = el.tagName;
      if (!t) return false;
      return /^(INPUT|TEXTAREA|SELECT)$/i.test(t) || !!el.closest('input, textarea, select, [contenteditable="true"]');
    }

    function getVideo(){
      return document.querySelector("video.html5-main-video") ||
             document.querySelector("#movie_player video") ||
             document.querySelector("ytd-player video") ||
             document.querySelector("video");
    }

    function ensureOSD(){
      if (osd) return osd;
      osd = document.createElement("div");
      osd.style.cssText = [
        "position:fixed","left:50%","top:35%","transform:translate(-50%,-50%)",
        "padding:0","background:transparent","color:#fff",
        "font:600 40px/1.08 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, Apple Color Emoji, Segoe UI Emoji",
        "letter-spacing:.2px","-webkit-font-smoothing:antialiased","text-rendering:optimizeLegibility",
        "-webkit-text-stroke:.35px rgba(0,0,0,.30)","text-shadow:0 0 8px rgba(0,0,0,.28)",
        "z-index:2147483647","pointer-events:none","opacity:0","transition:opacity .12s ease"
      ].join(";");
      document.documentElement.appendChild(osd);
      return osd;
    }

    function positionToVideo(){
      const v = getVideo(); if (!v || !osd) return;
      const r = v.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const x = r.left + r.width / 2;
      const y = r.top + r.height * 0.382;
      osd.style.left = x + "px";
      osd.style.top  = y + "px";
    }

    function show(val){
      ensureOSD();
      osd.textContent = typeof val === "number" ? `${val}%` : String(val);
      positionToVideo();
      osd.style.opacity = "1";
      clearTimeout(timer);
      timer = setTimeout(() => { osd.style.opacity = "0"; }, 900);
    }

    function clamp(v, lo, hi){ return Math.min(hi, Math.max(lo, v)); }

    function onKey(e){
      if (isEditable(e.target)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "ArrowUp" || e.key === "ArrowDown"){
        const v = getVideo(); if (!v) return;
        const mult = e.shiftKey ? SHIFT_MULT : 1;
        const delta = (e.key === "ArrowUp" ? 1 : -1) * VOL_STEP * mult;
        const newVol = clamp(Math.round((v.volume + delta) * 100) / 100, 0, 1);
        if (newVol !== v.volume){
          if (v.muted && newVol > 0) v.muted = false;
          v.volume = newVol;
          v.dispatchEvent(new Event('volumechange'));
          show(Math.round(newVol * 100));
        }
        e.preventDefault(); e.stopImmediatePropagation();
      } else if (e.key === "m" || e.key === "M"){
        const v = getVideo(); if (!v) return;
        v.muted = !v.muted;
        v.dispatchEvent(new Event('volumechange'));
        show(v.muted ? "Muted" : Math.round(v.volume * 100));
        e.preventDefault(); e.stopImmediatePropagation();
      }
    }

    const bind = () => { window.addEventListener("keydown", onKey, true); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind, { once: true });
    else bind();

    window.addEventListener("resize", positionToVideo);
    document.addEventListener("fullscreenchange", positionToVideo);
    document.addEventListener("webkitfullscreenchange", positionToVideo);
    document.addEventListener("mozfullscreenchange", positionToVideo);
    document.addEventListener("MSFullscreenChange", positionToVideo);
  })();

})();
