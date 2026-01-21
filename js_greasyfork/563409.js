// ==UserScript==
// @name         Twitch Agartha© Edition™
// @namespace    https://twitch.com/
// @version      1.0.0
// @description  Wiggatech™ True Agartha© experience
// @license      MIT
// @match        https://www.twitch.tv/*
// @match        https://m.twitch.tv/*
// @match        https://player.twitch.tv/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/563409/Twitch%20Agartha%C2%A9%20Edition%E2%84%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/563409/Twitch%20Agartha%C2%A9%20Edition%E2%84%A2.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // ====== HOTKEYS ======
  // Alt+C         -> CRT on/off
  // Alt+I         -> Images on/off
  // Alt+Shift+Q   -> All effects on/off
  // Alt+Shift+B   -> Badge on/off
  // Alt+Shift+Y   -> YouTube on/off
  // Alt+Y         -> YouTube play/pause
  // Alt+Shift+N   -> YouTube next track
  // Alt+Shift+P   -> YouTube previous track

  // ====== CONFIG ======
  const CONFIG = {
    // Image URLs (gif/jpg/png).
    // Positions: top-left, top-center, top-right, center, bottom-left,
    // bottom-center, bottom-right, random
    // Can be a string or object: { url: "...", position: "top-center" }
    // Empty list disables images.
    imageUrls: [
      "https://media1.tenor.com/m/VjKFrLEHMAMAAAAd/charlie-kirk-agartha.gif",
      "https://media1.tenor.com/m/BkkJME83dxwAAAAd/agartha-ksi.gif",
      { url: "https://media1.tenor.com/m/OBtp1QjATpUAAAAd/vril-agartha.gif", position: "bottom-right" },
      "https://media1.tenor.com/m/X1wCSEZxpMcAAAAd/agartha-hyperborea.gif",
      { url: "https://media1.tenor.com/m/chdXrfgk0WoAAAAC/agartha-flight-reacts.gif", position: "bottom-left" },
      "https://media1.tenor.com/m/5v3pSqZHqb0AAAAd/jeffrey-epstein-agartha.gif",
      "https://media1.tenor.com/m/b-ppyFoNE0MAAAAd/agartha.gif",
      "https://media1.tenor.com/m/FegUSEADWYgAAAAd/agartha-vril.gif",
      "https://media1.tenor.com/m/J-0yQ-uAG3wAAAAd/agartha-pharaoh.gif",
      "https://media1.tenor.com/m/_jCVI2CzgZAAAAAd/sliper93-spin.gif",
      "https://media1.tenor.com/m/3kMgMv753AAAAAAd/mc-lc.gif",
      "https://media1.tenor.com/m/WUAtrd_CgWAAAAAd/bog-bogged.gif",
      "https://media1.tenor.com/m/2mBytYoOCtEAAAAd/monster.gif",
      "https://media1.tenor.com/m/RAe_PJ81cwAAAAAd/agartha.gif",
      "https://media1.tenor.com/m/3Cyp-UXe454AAAAd/meme-antarctica.gif",
      "https://media1.tenor.com/m/bE9eL9iTp2oAAAAd/agartha-linus.gif",
      "https://media1.tenor.com/m/WykyyGnk8GgAAAAd/juzef-juzef-skowron.gif",
      "https://media1.tenor.com/m/_qNzcnd_TRIAAAAd/agartha-vril.gif",
      "https://media1.tenor.com/m/hegt2BQe9HcAAAAd/agartha-phonk.gif",
      "https://media1.tenor.com/m/pOpVCjWcrdEAAAAd/%D0%BF%D0%BE%D1%82%D1%83%D0%B6%D0%BD%D0%BE.gif",
      "https://media1.tenor.com/m/NH9t0vK5RY8AAAAd/agartha-agarthan.gif",
      "https://media1.tenor.com/m/fOLeI9RGY5UAAAAd/ec74.gif",
      "https://media1.tenor.com/m/jU_bgUfMDywAAAAd/agartha-impressed.gif",
      "https://media1.tenor.com/m/kZYrQNXN03YAAAAd/charlie-kirk.gif",
      "https://media1.tenor.com/m/rQsTP3OzsIsAAAAd/azerbaijan-technology-snow.gif",
      "https://media1.tenor.com/m/1rqG4jK1KnIAAAAd/agartha.gif",
      "https://media1.tenor.com/m/FzQ1VJmZkv8AAAAd/ksi-pharaoh.gif",
      "https://media1.tenor.com/m/_VtmkmjMpSQAAAAd/taemtaem-eyes.gif",
      "https://media1.tenor.com/m/G_FtneLjc4sAAAAd/boykisser-epstein.gif",
      "https://media1.tenor.com/m/z7G6R4fIrtMAAAAd/agartha-agarthian.gif",
      "https://media1.tenor.com/m/s2m8OS1F7xEAAAAd/rainbow-six-agartha.gif",
      "https://media1.tenor.com/m/DIeVnmKX8nUAAAAd/agartha-agartha-oni.gif",
      "https://media1.tenor.com/m/okLX7FrXbhcAAAAd/agartha.gif",
      "https://media1.tenor.com/m/pQlujPj3zVUAAAAd/white-monster-effect-monster.gif",
      "https://media1.tenor.com/m/GdZo-Jd5_DEAAAAd/agatha-silence.gif",
      "https://media1.tenor.com/m/TIH7T5Wz43oAAAAd/agartha.gif",
      "https://media1.tenor.com/m/zgFX6XRlkRMAAAAd/agartha-bunny.gif",
      "https://media1.tenor.com/m/28LVMaJReLIAAAAC/vril-esoteric.gif",
      "https://media1.tenor.com/m/27xd1NuE1VMAAAAd/agartha-welcome.gif",
      "https://media1.tenor.com/m/HG8lrt-dJPcAAAAd/edp-agartha.gif",
      "https://media1.tenor.com/m/noxzA2sJSt8AAAAd/tno-hoi4.gif",
      "https://media1.tenor.com/m/2OIHEpqXmr4AAAAd/white-monster-wmster.gif",
      "https://media1.tenor.com/m/2vaZCDRwyzUAAAAC/frieren-white-monster-frieren-potion.gif",
      "https://media1.tenor.com/m/iStLL9PlkBcAAAAd/this-person-is-ashtar-sheran.gif",
      "https://media1.tenor.com/m/ouArSPlSMu4AAAAd/how-it-feels-bosego.gif",
      "https://media.tenor.com/x6G5QCNemMkAAAAj/dancing-letter-letter.gif",
      "https://media1.tenor.com/m/cRprjDrCVAIAAAAC/ryson-vril.gif",
      "https://media1.tenor.com/m/m3UwtDyk3z8AAAAd/usmog-ai-baby.gif",
      "https://media1.tenor.com/m/TxqCGUisxjoAAAAd/what-if-this-happened-patchwork.gif",
      "https://media1.tenor.com/m/6JDuC6Qo6V8AAAAd/hyperborea-car-hyperboria.gif",
      "https://media1.tenor.com/m/YhqIxd8oB9cAAAAd/whats-up.gif",
      "https://media1.tenor.com/m/rhquqsdYBqoAAAAd/ashtar-milk.gif",
      "https://media1.tenor.com/m/6SY-NLzAN24AAAAd/tno-hoi4.gif",
      "https://media1.tenor.com/m/-eCXF01zlBMAAAAd/astolfo-hyperborea.gif",
      "https://media1.tenor.com/m/aU21qrfKmqgAAAAd/%D0%BD%D0%B0%D1%81%D0%BE%D1%81%D0%BD%D1%8B%D0%B9-%D0%B7%D0%B0%D0%B2%D0%BE%D0%B4-%D0%BE%D0%B4%D0%B8%D0%BD%D1%86%D0%BE%D0%B2%D0%BE.gif",
      "https://media1.tenor.com/m/wSGzN4FxqmMAAAAd/%D0%B3%D0%B8%D0%BF%D0%B5%D1%80%D0%B1%D0%BE%D1%80%D0%B5%D1%8F-%D1%81%D0%BB%D0%B0%D0%B2%D1%8F%D0%BD%D0%B5.gif",
      "https://media1.tenor.com/m/Y60vkpxOcf4AAAAd/trump-donald.gif",
      "https://media1.tenor.com/m/LSJCoNuxhL8AAAAd/ozon-ozon671games.gif",
      "https://media1.tenor.com/m/BT4AmQb503UAAAAd/gabe-newell-agartha.gif",
      "https://media1.tenor.com/m/1S1R1snUyzIAAAAd/agartha-slavic.gif",
      "https://media1.tenor.com/m/GZVeOUzXmFAAAAAd/ritz-balls-soyjak.gif",
      "https://media1.tenor.com/m/S-PyI4KO2lIAAAAd/soyjak-wojak.gif",
      "https://media1.tenor.com/m/-KEBep6QabYAAAAd/agartha-monster.gif",
      "https://media1.tenor.com/m/eQUA7CI121EAAAAd/gold-city-agartha.gif",
      "https://media1.tenor.com/m/DS7xn5SuPLYAAAAd/agartha-prime.gif",
      "https://media1.tenor.com/m/FyO7S82GK58AAAAd/agartha.gif",
      "https://media1.tenor.com/m/XoOUEqE78LcAAAAd/holdfast-3e-suisse.gif",
      "https://media1.tenor.com/m/z7G6R4fIrtMAAAAd/agartha-agarthian.gif",
      "https://media1.tenor.com/m/Z2YbaybHKdIAAAAd/yakub-glaze.gif",
      "https://media1.tenor.com/m/4miAseD7Ea8AAAAd/agartha.gif",
      "https://media1.tenor.com/m/_6aZf10OA4YAAAAd/alien-ufo.gif",
      "https://media1.tenor.com/m/u9vMaKrOu3cAAAAd/extraterrestre-alien.gif",
      "https://media1.tenor.com/m/x_JY4eylSFsAAAAC/hvorostdumb-hvorost.gif"
    ],

    // Image appearance interval (ms)
    imageIntervalMin: 6_000,
    imageIntervalMax: 20_000,
    imageDisplayMs: 5_000,
    imageRandomTiltDeg: 25,
    glitchDurationMs: 100,
    imageLoadTimeoutMs: 5000,
    gifFallbackDurationMs: 12000,
    randomAvoidCenterRatio: 0.35,
    storageKey: "tm_agartha_config",
    portalImageUrl: "https://media.tenor.com/GTtlri8rVHQAAAAi/portal-transparent.gif",
    portalDurationMs: 1000,

    // Size limits
    maxScreenAreaRatio: 0.15, // max 15% of screen area
    maxScreenUsageRatio: 0.9, // max 90% of width/height

    // YouTube audio
    youtube: {
      enabled: true,
      // Example: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"]
      urls: [
        "https://www.youtube.com/watch?v=3hVXt9NYiJA",
        "https://www.youtube.com/watch?v=IwcIdaLzbgA",
        "https://www.youtube.com/watch?v=7ot3hXfJVkQ",
        "https://www.youtube.com/watch?v=3eluGhGwbtI",
        "https://www.youtube.com/watch?v=3BhKDlHa5hg",
        "https://www.youtube.com/watch?v=PRyVBv8T2s4",
        "https://www.youtube.com/watch?v=eMJZOsYSh7k",
        "https://www.youtube.com/watch?v=_Gb7JtNukNE",
        "https://www.youtube.com/watch?v=fFbPRQ0Haqw",
        "https://www.youtube.com/watch?v=g3AopCQywqs",
        "https://www.youtube.com/watch?v=lriSHOYI4vc",
        "https://www.youtube.com/watch?v=ZKje4PX7-VU",
        "https://www.youtube.com/watch?v=qUI9QlmDf_0",
        "https://www.youtube.com/watch?v=UFyxfQ1VkWQ",
        "https://www.youtube.com/watch?v=fSG7--Q3npU",
        "https://www.youtube.com/watch?v=20LgtP63RWM",
        "https://www.youtube.com/watch?v=8RvIE4xL8kA"
      ],
      volume: 10 // 0..100
    },

    // Hotkeys
    hotkeys: {
      toggleImages: "KeyI", // Alt+I
      toggleCrt: "KeyC", // Alt+C
      toggleAll: "KeyQ", // Alt+Shift+Q
      toggleBadge: "KeyB", // Alt+Shift+B
      toggleYouTube: "KeyY", // Alt+Shift+Y
      pauseYouTube: "KeyY", // Alt+Y
      nextYouTube: "KeyN", // Alt+Shift+N
      prevYouTube: "KeyP" // Alt+Shift+P
    }
  };

  // ====== CRT Effect ======
  GM_addStyle(`
    .tm-crt-overlay {
      pointer-events: none;
      position: absolute;
      inset: 0;
      z-index: 9999;
      mix-blend-mode: screen;
      opacity: 0.6;
      background:
        repeating-linear-gradient(
          to bottom,
          rgba(0,0,0,0.28) 0px,
          rgba(0,0,0,0.28) 1px,
          rgba(0,0,0,0) 2px,
          rgba(0,0,0,0) 3px
        ),
        repeating-linear-gradient(
          to right,
          rgba(255,0,0,0.05) 0px,
          rgba(0,255,0,0.05) 1px,
          rgba(0,0,255,0.05) 2px,
          rgba(0,0,0,0) 3px
        ),
        radial-gradient(circle at 50% 50%,
          rgba(255,255,255,0.11),
          rgba(0,0,0,0.35)
        );
    }
    .tm-crt-burst .tm-crt-overlay {
      opacity: 0.8;
      animation: tm-scan-burst 0.7s steps(2) infinite;
    }
    .tm-crt-glitch video {
      filter:
        contrast(1.95)
        saturate(2.6)
        brightness(0.68)
        hue-rotate(-20deg);
      transform: scale(1.06) skewX(2.4deg) skewY(1.2deg);
      animation: tm-wave var(--tm-glitch-duration, 450ms) steps(2) infinite;
    }
    .tm-crt-glitch .tm-crt-overlay {
      opacity: 1;
      filter: brightness(1.7) saturate(1.8);
      animation: tm-glitch var(--tm-glitch-duration, 450ms) steps(2) infinite;
    }
    .tm-crt-glitch .tm-crt-rgb {
      opacity: 0.9;
      animation: tm-rgb-split var(--tm-glitch-duration, 450ms) steps(2) infinite;
    }
    .tm-crt-glitch .tm-crt-lines {
      opacity: 0.55;
      animation: tm-lines var(--tm-glitch-duration, 450ms) steps(2) infinite;
    }
    .tm-crt-glitch .tm-crt-noise {
      opacity: 0.4;
    }
    .tm-crt-noise {
      pointer-events: none;
      position: absolute;
      inset: 0;
      z-index: 10000;
      opacity: 0.13;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='120' height='120' filter='url(%23n)' opacity='0.4'/></svg>");
      mix-blend-mode: soft-light;
      animation: tm-noise 0.5s steps(2) infinite;
    }
    .tm-crt-rgb {
      pointer-events: none;
      position: absolute;
      inset: 0;
      z-index: 10000;
      opacity: 0.25;
      mix-blend-mode: screen;
      background:
        repeating-linear-gradient(
          to right,
          rgba(255,0,0,0.16) 0px,
          rgba(255,0,0,0.16) 1px,
          rgba(0,255,0,0.16) 2px,
          rgba(0,255,0,0.16) 3px,
          rgba(0,0,255,0.16) 4px,
          rgba(0,0,255,0.16) 5px,
          rgba(0,0,0,0) 6px
        );
      filter: blur(0.4px);
    }
    .tm-crt-lines {
      pointer-events: none;
      position: absolute;
      inset: 0;
      z-index: 10001;
      opacity: 0.12;
      background-image:
        linear-gradient(transparent 0 6px, rgba(255,255,255,0.10) 6px 7px),
        linear-gradient(90deg, rgba(0,0,0,0.24), rgba(0,0,0,0));
      background-size: 100% 7px, 100% 100%;
      mix-blend-mode: screen;
    }
    .tm-crt-vignette {
      pointer-events: none;
      position: absolute;
      inset: 0;
      z-index: 10001;
      box-shadow: inset 0 0 160px rgba(0,0,0,0.65);
      border-radius: 6px;
    }
    .tm-crt-filter video {
      filter:
        contrast(1.25)
        saturate(1.45)
        brightness(0.9)
        hue-rotate(-1deg);
      transform: scale(1.006);
    }
    .tm-crt-disabled .tm-crt-overlay,
    .tm-crt-disabled .tm-crt-noise,
    .tm-crt-disabled .tm-crt-rgb,
    .tm-crt-disabled .tm-crt-lines,
    .tm-crt-disabled .tm-crt-vignette {
      display: none;
    }
    .tm-crt-disabled video {
      filter: none !important;
      transform: none !important;
    }
    .tm-master-pulse {
      animation: tm-master-pulse 1.2s ease-in-out both;
      box-shadow: 0 0 0 2px rgba(191,199,214,0.35), 0 0 18px rgba(191,199,214,0.6);
    }
    @keyframes tm-noise {
      0% { transform: translate(0, 0); }
      50% { transform: translate(-1px, 1px); }
      100% { transform: translate(1px, -1px); }
    }
    @keyframes tm-scan-burst {
      0% { filter: brightness(1); }
      50% { filter: brightness(1.08); }
      100% { filter: brightness(1); }
    }
    @keyframes tm-wave {
      0% { transform: scale(1.06) skewX(2.4deg) skewY(1.2deg) translate(0, 0); }
      25% { transform: scale(1.06) skewX(-2.8deg) skewY(-1.6deg) translate(-14px, -6px); }
      50% { transform: scale(1.06) skewX(3.2deg) skewY(1deg) translate(14px, 6px); }
      75% { transform: scale(1.06) skewX(-2deg) skewY(-1.2deg) translate(-10px, 4px); }
      100% { transform: scale(1.06) skewX(2.4deg) skewY(1.2deg) translate(0, 0); }
    }
    @keyframes tm-glitch {
      0% { filter: brightness(1.7) saturate(1.8); transform: translateX(0); }
      30% { filter: brightness(2) saturate(2.2); transform: translateX(-8px); }
      60% { filter: brightness(1.4) saturate(1.4); transform: translateX(10px); }
      100% { filter: brightness(1.7) saturate(1.8); transform: translateX(0); }
    }
    @keyframes tm-lines {
      0% { background-position: 0 0, 0 0; }
      25% { background-position: -20px -6px, 0 0; }
      50% { background-position: 26px 6px, 0 0; }
      75% { background-position: -14px -5px, 0 0; }
      100% { background-position: 0 0, 0 0; }
    }
    @keyframes tm-rgb-split {
      0% { transform: translate(0, 0); }
      30% { transform: translate(-6px, 2px); }
      60% { transform: translate(6px, -2px); }
      100% { transform: translate(0, 0); }
    }
    @keyframes tm-master-pulse {
      0% { box-shadow: 0 0 0 0 rgba(191,199,214,0); }
      35% { box-shadow: 0 0 0 2px rgba(191,199,214,0.45), 0 0 18px rgba(191,199,214,0.7); }
      100% { box-shadow: 0 0 0 0 rgba(191,199,214,0); }
    }
    .tm-portal {
      pointer-events: none;
      position: absolute;
      inset: 0;
      z-index: 10010;
      opacity: 0;
      background-size: 100% 100%;
      background-position: center;
      transform-origin: 50% 50%;
      will-change: transform, opacity, clip-path;
      clip-path: circle(60% at 50% 50%);
    }
    .tm-portal.tm-portal-animate {
      animation: tm-portal var(--tm-portal-duration, 1000ms) cubic-bezier(0.16, 0.7, 0.2, 1) forwards;
    }
    .tm-portal-boost video {
      filter:
        blur(1.2px)
        saturate(1.3)
        contrast(1.1);
    }
    .tm-portal-boost .tm-crt-rgb {
      opacity: 0.6;
      background:
        repeating-linear-gradient(
          to right,
          rgba(40,110,255,0.28) 0px,
          rgba(40,110,255,0.28) 1px,
          rgba(90,180,255,0.22) 2px,
          rgba(90,180,255,0.22) 3px,
          rgba(160,220,255,0.18) 4px,
          rgba(160,220,255,0.18) 5px,
          rgba(0,0,0,0) 6px
        );
    }
    @keyframes tm-portal {
      0% {
        opacity: 1;
        transform: scale(1);
        clip-path: circle(60% at 50% 50%);
      }
      50% {
        opacity: 1;
        transform: scale(3.2);
        clip-path: circle(36% at 50% 50%);
      }
      100% {
        opacity: 0;
        transform: scale(5.6);
        clip-path: circle(14% at 50% 50%);
      }
    }
  `);

  let crtEnabled = false;
  let crtContainer = null;

  function attachCrt() {
    const video = document.querySelector("video");
    if (!video) return false;

    const container = video.closest(".video-player__container") || video.parentElement;
    if (!container) return false;

    container.classList.add("tm-crt-filter");
    container.style.position = "relative";
    container.classList.toggle("tm-crt-disabled", !crtEnabled || !effectsEnabled);
    container.style.setProperty("--tm-glitch-duration", `${CONFIG.glitchDurationMs}ms`);
    crtContainer = container;

    if (!container.querySelector(".tm-crt-overlay")) {
      const overlay = document.createElement("div");
      overlay.className = "tm-crt-overlay";
      container.appendChild(overlay);
    }

    if (!container.querySelector(".tm-crt-noise")) {
      const noise = document.createElement("div");
      noise.className = "tm-crt-noise";
      container.appendChild(noise);
    }

    if (!container.querySelector(".tm-crt-rgb")) {
      const rgb = document.createElement("div");
      rgb.className = "tm-crt-rgb";
      container.appendChild(rgb);
    }

    if (!container.querySelector(".tm-crt-lines")) {
      const lines = document.createElement("div");
      lines.className = "tm-crt-lines";
      container.appendChild(lines);
    }

    if (!container.querySelector(".tm-crt-vignette")) {
      const vignette = document.createElement("div");
      vignette.className = "tm-crt-vignette";
      container.appendChild(vignette);
    }

    ensurePortal(container);
    ensureUi(container);
    ensureBadge(container);
    updateBadge();
    ensureVolumeControl(container);

    return true;
  }

  function getPlayerContainer() {
    if (crtContainer && document.body.contains(crtContainer)) return crtContainer;
    const video = document.querySelector("video");
    if (!video) return null;
    return video.closest(".video-player__container") || video.parentElement;
  }

  function ensurePortal(container) {
    if (portalEl && container.contains(portalEl)) return;
    portalEl = document.createElement("div");
    portalEl.className = "tm-portal";
    container.appendChild(portalEl);
  }

  function playPortalEffect() {
    if (!CONFIG.portalImageUrl) return;
    const container = getPlayerContainer();
    if (!container) return;
    ensurePortal(container);
    portalEl.style.backgroundImage = `url("${CONFIG.portalImageUrl}")`;
    portalEl.style.setProperty("--tm-portal-duration", `${CONFIG.portalDurationMs}ms`);
    container.classList.add("tm-portal-boost");
    portalEl.classList.remove("tm-portal-animate");
    void portalEl.offsetWidth;
    portalEl.classList.add("tm-portal-animate");
    setTimeout(() => {
      container.classList.remove("tm-portal-boost");
    }, CONFIG.portalDurationMs);
  }

  function ensureUi(container) {
    if (uiContainer && container.contains(uiContainer)) return;
    uiContainer = document.createElement("div");
    uiContainer.style.position = "absolute";
    uiContainer.style.right = "8px";
    uiContainer.style.top = "8px";
    uiContainer.style.zIndex = "10020";
    uiContainer.style.display = "flex";
    uiContainer.style.flexDirection = "column";
    uiContainer.style.alignItems = "flex-end";
    uiContainer.style.gap = "6px";
    uiContainer.style.pointerEvents = "auto";

    const btnStyle = (btn) => {
      btn.style.border = "1px solid rgba(255,255,255,0.25)";
      btn.style.background = "rgba(0,0,0,0.7)";
      btn.style.color = "#e6e6e6";
      btn.style.borderRadius = "4px";
      btn.style.padding = "4px 8px";
      btn.style.cursor = "pointer";
      btn.style.fontSize = "13px";
      btn.style.fontFamily = "monospace";
      btn.style.lineHeight = "1.2";
      btn.style.whiteSpace = "nowrap";
    };

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.gap = "6px";
    row.style.alignItems = "center";

    masterBtn = document.createElement("button");
    masterBtn.type = "button";
    btnStyle(masterBtn);
    masterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      setAllEffects(!anyEffectsOn());
    });

    gearBtn = document.createElement("button");
    gearBtn.type = "button";
    btnStyle(gearBtn);
    gearBtn.textContent = "⚙";
    gearBtn.style.padding = "4px 6px";
    gearBtn.style.minWidth = "0";
    gearBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleBadge();
    });

    row.appendChild(masterBtn);
    row.appendChild(gearBtn);
    uiContainer.appendChild(row);

    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }
    container.appendChild(uiContainer);
    updateMasterButton();
    scheduleMasterPulse();
  }

  function ensureBadge(container) {
    if (!badgeEnabled) return;
    if (badgeEl && uiContainer && uiContainer.contains(badgeEl)) return;
    badgeEl = document.createElement("div");
    badgeEl.style.position = "relative";
    badgeEl.style.right = "0";
    badgeEl.style.top = "0";
    badgeEl.style.zIndex = "10020";
    badgeEl.style.pointerEvents = "auto";
    badgeEl.style.fontSize = "13px";
    badgeEl.style.fontFamily = "monospace";
    badgeEl.style.color = "#e6e6e6";
    badgeEl.style.background = "rgba(0,0,0,0.6)";
    badgeEl.style.border = "1px solid rgba(255,255,255,0.2)";
    badgeEl.style.borderRadius = "4px";
    badgeEl.style.padding = "4px 6px";
    badgeEl.style.display = "flex";
    badgeEl.style.flexDirection = "column";
    badgeEl.style.gap = "6px";

    badgeHeaderEl = document.createElement("div");
    badgeHeaderEl.style.display = "flex";
    badgeHeaderEl.style.alignItems = "center";
    badgeHeaderEl.style.justifyContent = "space-between";
    badgeHeaderEl.style.gap = "8px";

    const title = document.createElement("span");
    title.textContent = "🛸 AGARTHA CONTROL PANEL 🛸";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.textContent = "×";
    closeBtn.style.border = "none";
    closeBtn.style.background = "transparent";
    closeBtn.style.color = "#e6e6e6";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "16px";
    closeBtn.style.lineHeight = "1";
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleBadge();
    });

    badgeHeaderEl.appendChild(title);
    badgeHeaderEl.appendChild(closeBtn);
    badgeEl.appendChild(badgeHeaderEl);

    badgeTextEl = document.createElement("a");
    badgeTextEl.style.whiteSpace = "pre";
    badgeTextEl.style.maxWidth = "320px";
    badgeTextEl.style.wordBreak = "break-word";
    badgeTextEl.style.pointerEvents = "none";
    badgeTextEl.style.textDecoration = "underline";
    badgeTextEl.style.color = "inherit";
    badgeTextEl.style.cursor = "pointer";
    badgeTextEl.target = "_blank";
    badgeTextEl.rel = "noopener noreferrer";
    badgeTextEl.style.pointerEvents = "auto";
    badgeEl.appendChild(badgeTextEl);

    const toggles = document.createElement("div");
    toggles.style.display = "flex";
    toggles.style.flexDirection = "column";
    toggles.style.gap = "6px";

    const toggleStyle = (btn) => {
      btn.style.border = "1px solid rgba(255,255,255,0.2)";
      btn.style.background = "rgba(0,0,0,0.35)";
      btn.style.color = "#e6e6e6";
      btn.style.borderRadius = "3px";
      btn.style.padding = "2px 6px";
      btn.style.cursor = "pointer";
      btn.style.fontSize = "13px";
      btn.style.lineHeight = "1.1";
    };

    const rowStyle = (row) => {
      row.style.display = "flex";
      row.style.gap = "6px";
      row.style.alignItems = "center";
    };

    const makePlusBtn = (handler) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "+";
      toggleStyle(btn);
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        handler();
      });
      return btn;
    };

    const crtRow = document.createElement("div");
    rowStyle(crtRow);
    crtToggleBtn = document.createElement("button");
    crtToggleBtn.type = "button";
    toggleStyle(crtToggleBtn);
    crtToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleCrt();
    });
    crtRow.appendChild(crtToggleBtn);
    toggles.appendChild(crtRow);

    const imgRow = document.createElement("div");
    rowStyle(imgRow);
    const imgPlus = makePlusBtn(openImageEditor);
    imgToggleBtn = document.createElement("button");
    imgToggleBtn.type = "button";
    toggleStyle(imgToggleBtn);
    imgToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleImages();
    });
    imgRow.appendChild(imgPlus);
    imgRow.appendChild(imgToggleBtn);
    toggles.appendChild(imgRow);

    const ytRow = document.createElement("div");
    rowStyle(ytRow);
    const ytPlus = makePlusBtn(openYouTubeEditor);
    ytToggleBtn = document.createElement("button");
    ytToggleBtn.type = "button";
    toggleStyle(ytToggleBtn);
    ytToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleYouTubeEnabled();
    });
    ytRow.appendChild(ytPlus);
    ytRow.appendChild(ytToggleBtn);
    toggles.appendChild(ytRow);

    const pulseRow = document.createElement("div");
    rowStyle(pulseRow);
    const pulseBtn = document.createElement("button");
    pulseBtn.type = "button";
    toggleStyle(pulseBtn);
    const updatePulseLabel = () => {
      pulseBtn.textContent = `PULSE: ${pulseEnabled ? "ON" : "OFF"}`;
    };
    updatePulseLabel();
    pulseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      pulseEnabled = !pulseEnabled;
      updatePulseLabel();
      scheduleMasterPulse();
    });
    pulseRow.appendChild(pulseBtn);
    toggles.appendChild(pulseRow);
    badgeEl.appendChild(toggles);
    updateEffectButtons();
    if (uiContainer) {
      uiContainer.appendChild(badgeEl);
    } else {
      if (getComputedStyle(container).position === "static") {
        container.style.position = "relative";
      }
      container.appendChild(badgeEl);
    }
  }

  function updateBadge() {
    if (!badgeEnabled || !badgeEl || !badgeTextEl) return;
    const ytStatus = ytEnabled && getEnabledYouTubeUrls().length > 0 ? (currentYtTitle || ytState) : "disabled";
    const nextText = `YT: ${truncateTitle(ytStatus, 30)}`;
    if (nextText === badgeText) return;
    badgeText = nextText;
    badgeTextEl.textContent = nextText;
    if (currentYtUrl) {
      badgeTextEl.href = currentYtUrl;
      badgeTextEl.style.pointerEvents = "auto";
    } else {
      badgeTextEl.removeAttribute("href");
      badgeTextEl.style.pointerEvents = "none";
    }
    updateEffectButtons();
    updateMasterButton();
  }

  function truncateTitle(text, maxLen) {
    const str = String(text || "");
    if (str.length <= maxLen) return str;
    return `${str.slice(0, maxLen)}...`;
  }

  function anyEffectsOn() {
    return effectsEnabled && (crtEnabled || imagesEnabled || ytEnabled);
  }

  function updateMasterButton() {
    if (!masterBtn) return;
    masterBtn.textContent = anyEffectsOn() ? "LEAVE AGARTHA" : "ENTER AGARTHA";
  }

  function updateEffectButtons() {
    if (crtToggleBtn) crtToggleBtn.textContent = `CRT: ${crtEnabled ? "ON" : "OFF"}`;
    if (imgToggleBtn) imgToggleBtn.textContent = `IMG: ${imagesEnabled ? "ON" : "OFF"}`;
    if (ytToggleBtn) ytToggleBtn.textContent = `YT: ${ytEnabled ? "ON" : "OFF"}`;
  }

  function scheduleMasterPulse() {
    if (pulseTimer) {
      clearInterval(pulseTimer);
      pulseTimer = null;
    }
    if (!pulseEnabled || !masterBtn) return;
    if (anyEffectsOn()) return;
    masterBtn.classList.remove("tm-master-pulse");
    pulseTimer = setInterval(() => {
      if (!pulseEnabled || !masterBtn) return;
      if (anyEffectsOn()) return;
      masterBtn.classList.add("tm-master-pulse");
      setTimeout(() => {
        if (masterBtn) masterBtn.classList.remove("tm-master-pulse");
      }, 1200);
    }, 30_000);
  }

  function loadStoredConfig() {
    try {
      const raw = localStorage.getItem(CONFIG.storageKey);
      if (!raw) return;
      storedConfig = JSON.parse(raw);
    } catch (err) {
      log("config load failed");
    }
  }

  function storeConfig() {
    try {
      const payload = {
        imageCustom: imageItems.filter((item) => item.source === "user"),
        imagePreEnabled: imageItems
          .filter((item) => item.source === "pre")
          .reduce((acc, item) => {
            acc[item.url] = !!item.enabled;
            return acc;
          }, {}),
        youtubeCustom: ytItems.filter((item) => item.source === "user"),
        youtubePreEnabled: ytItems
          .filter((item) => item.source === "pre")
          .reduce((acc, item) => {
            acc[item.url] = !!item.enabled;
            return acc;
          }, {})
      };
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(payload));
    } catch (err) {
      log("config save failed");
    }
  }

  function initItemState() {
    const preImages = (CONFIG.imageUrls || []).map((item) => {
      const asset = normalizeAsset(item);
      return {
        url: asset.url,
        position: asset.position || "random",
        enabled: true,
        source: "pre"
      };
    });
    const preYt = (CONFIG.youtube.urls || []).map((url) => ({
      url,
      enabled: true,
      source: "pre"
    }));

    const cfg = storedConfig || {};
    if (cfg.imagePreEnabled) {
      preImages.forEach((item) => {
        if (Object.prototype.hasOwnProperty.call(cfg.imagePreEnabled, item.url)) {
          item.enabled = !!cfg.imagePreEnabled[item.url];
        }
      });
    }
    if (cfg.youtubePreEnabled) {
      preYt.forEach((item) => {
        if (Object.prototype.hasOwnProperty.call(cfg.youtubePreEnabled, item.url)) {
          item.enabled = !!cfg.youtubePreEnabled[item.url];
        }
      });
    }

    const customImages = Array.isArray(cfg.imageCustom) ? cfg.imageCustom.map((item) => {
      const asset = normalizeAsset(item);
      return {
        url: asset.url,
        position: asset.position || "random",
        enabled: item.enabled !== false,
        source: "user"
      };
    }) : [];

    const customYt = Array.isArray(cfg.youtubeCustom) ? cfg.youtubeCustom.map((item) => ({
      url: typeof item === "string" ? item : item.url,
      enabled: typeof item === "string" ? true : item.enabled !== false,
      source: "user"
    })) : [];

    imageItems = [...preImages, ...customImages].filter((item) => item.url);
    ytItems = [...preYt, ...customYt].filter((item) => item.url);
  }

  function refreshEffectsFromToggles() {
    const anyOn = crtEnabled || imagesEnabled || ytEnabled;
    effectsEnabled = anyOn;
    if (masterBtn && effectsEnabled) masterBtn.classList.remove("tm-master-pulse");
    if (!effectsEnabled) {
      if (crtContainer) crtContainer.classList.add("tm-crt-disabled");
      if (ytPlayer) ytPlayer.stopVideo();
      ytState = "disabled";
      currentYtTitle = "";
      currentYtUrl = "";
    } else {
      if (crtContainer) crtContainer.classList.toggle("tm-crt-disabled", !crtEnabled);
    }
    updateVolumeControlVisibility();
    updateBadge();
    updateMasterButton();
    scheduleMasterPulse();
  }

  function setAllEffects(on) {
    effectsEnabled = on;
    crtEnabled = on;
    imagesEnabled = on;
    const hasYt = getEnabledYouTubeUrls().length > 0;
    ytEnabled = on ? (ytDefaultEnabled && hasYt) : false;
    if (masterBtn) masterBtn.classList.remove("tm-master-pulse");
    if (!on) {
      if (crtContainer) crtContainer.classList.add("tm-crt-disabled");
      if (ytPlayer) ytPlayer.stopVideo();
      ytState = "disabled";
      currentYtTitle = "";
      currentYtUrl = "";
    } else {
      ensureMediaInit();
      if (crtContainer) crtContainer.classList.toggle("tm-crt-disabled", !crtEnabled);
      if (ytPlayer) ytPlayer.playVideo();
      ytState = "playing";
      if (ytPlayOrder.length === 0) resetYtPlayOrder();
      playPortalEffect();
    }
    updateVolumeControlVisibility();
    updateBadge();
    updateMasterButton();
    scheduleMasterPulse();
  }

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function getInitialVolume() {
    const ytVol = typeof CONFIG.youtube.volume === "number" ? CONFIG.youtube.volume / 100 : 0.5;
    return clamp01(ytVol);
  }

  function setGlobalVolume(value) {
    const vol = clamp01(value);
    CONFIG.youtube.volume = Math.round(vol * 100);
    if (ytPlayer) ytPlayer.setVolume(Math.round(vol * 100));
  }

  function updateVolumeControlVisibility() {
    if (!volumeEl) return;
    const show = badgeEnabled && effectsEnabled && ytEnabled && getEnabledYouTubeUrls().length > 0;
    volumeEl.style.display = show ? "flex" : "none";
  }

  function ensureVolumeControl(container) {
    if (!badgeEnabled || !badgeEl) {
      if (volumeEl) {
        volumeEl.remove();
        volumeEl = null;
        volumeRange = null;
      }
      return;
    }
    if (volumeEl && badgeEl.contains(volumeEl)) return;
    volumeEl = document.createElement("div");
    volumeEl.style.display = "flex";
    volumeEl.style.alignItems = "center";
    volumeEl.style.gap = "6px";
    volumeEl.style.pointerEvents = "auto";
    volumeEl.style.color = "#e6e6e6";
    volumeEl.style.fontSize = "13px";
    volumeEl.style.fontFamily = "monospace";

    const label = document.createElement("span");
    label.textContent = "VOL";

    volumeRange = document.createElement("input");
    volumeRange.type = "range";
    volumeRange.min = "0";
    volumeRange.max = "100";
    volumeRange.step = "1";
    volumeRange.value = String(Math.round(getInitialVolume() * 100));
    volumeRange.style.width = "120px";
    volumeRange.addEventListener("input", () => {
      setGlobalVolume(parseInt(volumeRange.value, 10) / 100);
    });

    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.gap = "6px";

    const btnStyle = (btn) => {
      btn.style.border = "1px solid rgba(255,255,255,0.2)";
      btn.style.background = "rgba(0,0,0,0.35)";
      btn.style.color = "#e6e6e6";
      btn.style.borderRadius = "3px";
      btn.style.padding = "2px 6px";
      btn.style.cursor = "pointer";
      btn.style.fontSize = "14px";
      btn.style.lineHeight = "1";
    };

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.textContent = "⏮";
    btnStyle(prevBtn);
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      controlPrevTrack();
    });

    const pauseBtn = document.createElement("button");
    pauseBtn.type = "button";
    pauseBtn.textContent = "⏯";
    btnStyle(pauseBtn);
    pauseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      controlPause();
    });

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.textContent = "⏭";
    btnStyle(nextBtn);
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      controlNextTrack();
    });

    controls.appendChild(prevBtn);
    controls.appendChild(pauseBtn);
    controls.appendChild(nextBtn);

    volumeEl.appendChild(label);
    volumeEl.appendChild(volumeRange);
    volumeEl.appendChild(controls);

    badgeEl.appendChild(volumeEl);
    updateVolumeControlVisibility();
  }

  function closeEditor() {
    if (!editorOverlay) return;
    editorOverlay.remove();
    editorOverlay = null;
    editorSaveHandler = null;
  }

  function openEditorBase(titleText) {
    if (editorOverlay) editorOverlay.remove();
    editorSaveHandler = null;
    editorOverlay = document.createElement("div");
    editorOverlay.style.position = "fixed";
    editorOverlay.style.inset = "0";
    editorOverlay.style.zIndex = "10030";
    editorOverlay.style.background = "rgba(0,0,0,0.55)";
    editorOverlay.style.display = "flex";
    editorOverlay.style.alignItems = "center";
    editorOverlay.style.justifyContent = "center";
    editorOverlay.addEventListener("click", (e) => {
      if (e.target !== editorOverlay) return;
      if (typeof editorSaveHandler === "function") {
        editorSaveHandler();
      } else {
        closeEditor();
      }
    });

    const panel = document.createElement("div");
    panel.style.width = "520px";
    panel.style.maxWidth = "90vw";
    panel.style.maxHeight = "80vh";
    panel.style.overflow = "auto";
    panel.style.background = "rgba(0,0,0,0.85)";
    panel.style.border = "1px solid rgba(255,255,255,0.2)";
    panel.style.borderRadius = "6px";
    panel.style.padding = "10px";
    panel.style.color = "#e6e6e6";
    panel.style.fontFamily = "monospace";
    panel.style.fontSize = "14px";
    panel.style.display = "flex";
    panel.style.flexDirection = "column";
    panel.style.gap = "10px";

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    const title = document.createElement("div");
    title.textContent = titleText;
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.textContent = "×";
    closeBtn.style.border = "none";
    closeBtn.style.background = "transparent";
    closeBtn.style.color = "#e6e6e6";
    closeBtn.style.cursor = "pointer";
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeEditor();
    });
    header.appendChild(title);
    header.appendChild(closeBtn);

    panel.appendChild(header);
    editorOverlay.appendChild(panel);
    document.body.appendChild(editorOverlay);
    return panel;
  }

  function openImageEditor() {
    const panel = openEditorBase("Edit Images");
    const preDetails = document.createElement("details");
    const preSummary = document.createElement("summary");
    preSummary.textContent = "Predefined images";
    preDetails.appendChild(preSummary);

    const preList = document.createElement("div");
    preList.style.display = "flex";
    preList.style.flexDirection = "column";
    preList.style.gap = "6px";
    preDetails.appendChild(preList);

    const list = document.createElement("div");
    list.style.display = "flex";
    list.style.flexDirection = "column";
    list.style.gap = "6px";

    const isTenorUrl = (url) => /tenor\.com/i.test(url || "");
    const shortTenor = (url) => {
      try {
        const clean = url.split("?")[0].split("#")[0];
        const parts = clean.split("/");
        return parts[parts.length - 1] || url;
      } catch (err) {
        return url;
      }
    };
    const applyTenorDisplay = (input) => {
      const full = input.dataset.fullUrl || input.value.trim();
      if (isTenorUrl(full)) {
        input.value = shortTenor(full);
      }
    };

    const makeEyeButton = (enabled) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.style.border = "1px solid rgba(255,255,255,0.2)";
      btn.style.background = "rgba(0,0,0,0.35)";
      btn.style.color = "#e6e6e6";
      btn.style.borderRadius = "3px";
      btn.style.cursor = "pointer";
      btn.style.display = "flex";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "center";
      btn.style.width = "26px";
      btn.style.height = "26px";
      btn.dataset.enabled = enabled ? "1" : "0";
      btn.textContent = enabled ? "👁" : "🚫";
      btn.addEventListener("click", () => {
        const next = btn.dataset.enabled !== "1";
        btn.dataset.enabled = next ? "1" : "0";
        btn.textContent = next ? "👁" : "🚫";
      });
      return btn;
    };

    const addRow = (url = "", position = "random", enabled = true) => {
      const row = document.createElement("div");
      row.style.display = "grid";
      row.style.gridTemplateColumns = "26px 1fr 120px 30px";
      row.style.gap = "6px";

      const enabledBtn = makeEyeButton(enabled);

      const urlInput = document.createElement("input");
      urlInput.type = "text";
      urlInput.placeholder = "Image URL";
      urlInput.value = url;
      urlInput.style.width = "100%";
      urlInput.dataset.fullUrl = url;
      applyTenorDisplay(urlInput);
      urlInput.addEventListener("focus", () => {
        if (urlInput.dataset.fullUrl) {
          urlInput.value = urlInput.dataset.fullUrl;
        }
      });
      urlInput.addEventListener("blur", () => {
        urlInput.dataset.fullUrl = urlInput.value.trim();
        applyTenorDisplay(urlInput);
      });

      const posSelect = document.createElement("select");
      ["random", "top-left", "top-center", "top-right", "center", "bottom-left", "bottom-center", "bottom-right"]
        .forEach((pos) => {
          const opt = document.createElement("option");
          opt.value = pos;
          opt.textContent = pos;
          posSelect.appendChild(opt);
        });
      posSelect.value = position;

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.textContent = "🗑";
      delBtn.style.border = "1px solid rgba(255,255,255,0.2)";
      delBtn.style.background = "rgba(0,0,0,0.35)";
      delBtn.style.color = "#e6e6e6";
      delBtn.style.borderRadius = "3px";
      delBtn.style.cursor = "pointer";
      delBtn.style.display = "flex";
      delBtn.style.alignItems = "center";
      delBtn.style.justifyContent = "center";
      delBtn.addEventListener("click", () => row.remove());

      row.appendChild(enabledBtn);
      row.appendChild(urlInput);
      row.appendChild(posSelect);
      row.appendChild(delBtn);
      list.appendChild(row);
    };

    imageItems.filter((item) => item.source === "pre").forEach((item) => {
      const row = document.createElement("div");
      row.style.display = "grid";
      row.style.gridTemplateColumns = "26px 1fr 120px";
      row.style.gap = "6px";

      const enabledBtn = makeEyeButton(!!item.enabled);
      enabledBtn.dataset.url = item.url;

      const urlInput = document.createElement("input");
      urlInput.type = "text";
      urlInput.value = item.url;
      urlInput.readOnly = true;
      urlInput.dataset.fullUrl = item.url;
      applyTenorDisplay(urlInput);
      urlInput.addEventListener("focus", () => {
        if (urlInput.dataset.fullUrl) {
          urlInput.value = urlInput.dataset.fullUrl;
        }
      });
      urlInput.addEventListener("blur", () => {
        applyTenorDisplay(urlInput);
      });

      const posInput = document.createElement("input");
      posInput.type = "text";
      posInput.value = item.position || "random";
      posInput.readOnly = true;

      row.appendChild(enabledBtn);
      row.appendChild(urlInput);
      row.appendChild(posInput);
      preList.appendChild(row);
    });

    imageItems.filter((item) => item.source === "user").forEach((item) => {
      addRow(item.url || "", item.position || "random", item.enabled !== false);
    });

    if (list.childElementCount === 0) addRow();

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.textContent = "Add new image";
    addBtn.addEventListener("click", () => addRow());

    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.textContent = "Save";
    const saveHandler = () => {
      const preEnabled = {};
      Array.from(preList.querySelectorAll("button[data-url]")).forEach((btn) => {
        preEnabled[btn.dataset.url] = btn.dataset.enabled === "1";
      });

      const rows = Array.from(list.children);
      const nextCustom = rows.map((row) => {
        const enabledBtn = row.querySelector("button");
        const inputs = row.querySelectorAll("input, select");
        const urlInput = inputs[0];
        const posSelect = inputs[1];
        const fullUrl = (urlInput.dataset.fullUrl || urlInput.value).trim();
        return { url: fullUrl, position: posSelect.value, enabled: enabledBtn && enabledBtn.dataset.enabled === "1", source: "user" };
      }).filter((item) => item.url);

      imageItems = imageItems
        .filter((item) => item.source === "pre")
        .map((item) => ({ ...item, enabled: preEnabled[item.url] !== false }));
      imageItems = [...imageItems, ...nextCustom];
      imageQueue = [];
      imageQueueKey = "";
      CONFIG.imageUrls = imageItems.map((item) => ({
        url: item.url,
        position: item.position || "random"
      }));
      storeConfig();
      updateBadge();
      closeEditor();
    };
    saveBtn.addEventListener("click", saveHandler);
    editorSaveHandler = saveHandler;

    panel.appendChild(preDetails);
    panel.appendChild(list);
    panel.appendChild(addBtn);
    panel.appendChild(saveBtn);
  }

  function openYouTubeEditor() {
    const panel = openEditorBase("Edit YouTube");
    const preDetails = document.createElement("details");
    const preSummary = document.createElement("summary");
    preSummary.textContent = "Predefined YouTube";
    preDetails.appendChild(preSummary);

    const preList = document.createElement("div");
    preList.style.display = "flex";
    preList.style.flexDirection = "column";
    preList.style.gap = "6px";
    preDetails.appendChild(preList);

    const list = document.createElement("div");
    list.style.display = "flex";
    list.style.flexDirection = "column";
    list.style.gap = "6px";

    const fetchYouTubeTitle = (url, cb) => {
      if (!url) return cb("");
      if (ytTitleCache[url]) return cb(ytTitleCache[url]);
      const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      GM_xmlhttpRequest({
        method: "GET",
        url: oembed,
        responseType: "json",
        timeout: 5000,
        onload: (resp) => {
          const title = resp.response && resp.response.title ? resp.response.title : "";
          ytTitleCache[url] = title || "Unknown title";
          cb(ytTitleCache[url]);
        },
        onerror: () => cb("Unknown title"),
        ontimeout: () => cb("Unknown title")
      });
    };

    const applyYtTitleDisplay = (input) => {
      const full = input.dataset.fullUrl || input.value.trim();
      if (!full) return;
      fetchYouTubeTitle(full, (text) => {
        input.value = text || full;
      });
    };

    const makeSpeakerButton = (enabled) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.style.border = "1px solid rgba(255,255,255,0.2)";
      btn.style.background = "rgba(0,0,0,0.35)";
      btn.style.color = "#e6e6e6";
      btn.style.borderRadius = "3px";
      btn.style.cursor = "pointer";
      btn.style.display = "flex";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "center";
      btn.style.width = "26px";
      btn.style.height = "26px";
      btn.dataset.enabled = enabled ? "1" : "0";
      btn.textContent = enabled ? "🔊" : "🔇";
      btn.addEventListener("click", () => {
        const next = btn.dataset.enabled !== "1";
        btn.dataset.enabled = next ? "1" : "0";
        btn.textContent = next ? "🔊" : "🔇";
      });
      return btn;
    };

    const makePlayButton = (handler) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "▶️";
      btn.style.border = "1px solid rgba(255,255,255,0.2)";
      btn.style.background = "rgba(0,0,0,0.35)";
      btn.style.color = "#e6e6e6";
      btn.style.borderRadius = "3px";
      btn.style.cursor = "pointer";
      btn.style.display = "flex";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "center";
      btn.style.width = "26px";
      btn.style.height = "26px";
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        handler();
      });
      return btn;
    };

    const addRow = (url = "", enabled = true) => {
      const row = document.createElement("div");
      row.style.display = "grid";
      row.style.gridTemplateColumns = "26px 26px 1fr 30px";
      row.style.gap = "6px";
      const enabledBtn = makeSpeakerButton(enabled);
      const urlInput = document.createElement("input");
      urlInput.type = "text";
      urlInput.placeholder = "YouTube URL";
      urlInput.value = url;
      urlInput.style.width = "100%";
      urlInput.dataset.fullUrl = url;
      applyYtTitleDisplay(urlInput);
      urlInput.addEventListener("focus", () => {
        if (urlInput.dataset.fullUrl) {
          urlInput.value = urlInput.dataset.fullUrl;
        }
      });
      urlInput.addEventListener("blur", () => {
        const val = urlInput.value.trim();
        urlInput.dataset.fullUrl = val;
        applyYtTitleDisplay(urlInput);
      });
      const playBtn = makePlayButton(() => {
        enabledBtn.dataset.enabled = "1";
        enabledBtn.textContent = "🔊";
        playSpecificYtUrl(urlInput.dataset.fullUrl || urlInput.value.trim());
      });
      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.textContent = "🗑";
      delBtn.style.border = "1px solid rgba(255,255,255,0.2)";
      delBtn.style.background = "rgba(0,0,0,0.35)";
      delBtn.style.color = "#e6e6e6";
      delBtn.style.borderRadius = "3px";
      delBtn.style.cursor = "pointer";
      delBtn.style.display = "flex";
      delBtn.style.alignItems = "center";
      delBtn.style.justifyContent = "center";
      delBtn.addEventListener("click", () => wrap.remove());
      row.appendChild(enabledBtn);
      row.appendChild(playBtn);
      row.appendChild(urlInput);
      row.appendChild(delBtn);
      list.appendChild(row);
    };

    ytItems.filter((item) => item.source === "pre").forEach((item) => {
      const row = document.createElement("div");
      row.style.display = "grid";
      row.style.gridTemplateColumns = "26px 26px 1fr";
      row.style.gap = "6px";
      const enabledBtn = makeSpeakerButton(!!item.enabled);
      enabledBtn.dataset.url = item.url;
      const urlInput = document.createElement("input");
      urlInput.type = "text";
      urlInput.value = item.url;
      urlInput.readOnly = true;
      urlInput.dataset.fullUrl = item.url;
      applyYtTitleDisplay(urlInput);
      urlInput.addEventListener("focus", () => {
        if (urlInput.dataset.fullUrl) {
          urlInput.value = urlInput.dataset.fullUrl;
        }
      });
      urlInput.addEventListener("blur", () => {
        applyYtTitleDisplay(urlInput);
      });
      const playBtn = makePlayButton(() => {
        enabledBtn.dataset.enabled = "1";
        enabledBtn.textContent = "🔊";
        playSpecificYtUrl(item.url);
      });
      row.appendChild(enabledBtn);
      row.appendChild(playBtn);
      row.appendChild(urlInput);
      preList.appendChild(row);
    });
    ytItems.filter((item) => item.source === "user").forEach((item) => {
      addRow(item.url || "", item.enabled !== false);
    });
    if (list.childElementCount === 0) addRow();

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.textContent = "Add new URL";
    addBtn.addEventListener("click", () => addRow());

    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.textContent = "Save";
    const saveHandler = () => {
      const preEnabled = {};
      Array.from(preList.querySelectorAll("button[data-url]")).forEach((btn) => {
        preEnabled[btn.dataset.url] = btn.dataset.enabled === "1";
      });

      const rows = Array.from(list.children);
      const nextCustom = rows.map((row) => {
        const enabledBtn = row.querySelector("button");
        const inputs = row.querySelectorAll("input");
        const urlInput = inputs[0];
        const fullUrl = (urlInput.dataset.fullUrl || urlInput.value).trim();
        return { url: fullUrl, enabled: enabledBtn && enabledBtn.dataset.enabled === "1", source: "user" };
      }).filter((item) => item.url);

      ytItems = ytItems
        .filter((item) => item.source === "pre")
        .map((item) => ({ ...item, enabled: preEnabled[item.url] !== false }));
      ytItems = [...ytItems, ...nextCustom];
      CONFIG.youtube.urls = ytItems.map((item) => item.url);
      resetYtPlayOrder();
      ytIds = ytPlayOrder.map(extractYouTubeId).filter(Boolean);
      ytIndex = 0;
      storeConfig();
      updateBadge();
      closeEditor();
    };
    saveBtn.addEventListener("click", saveHandler);
    editorSaveHandler = saveHandler;

    panel.appendChild(preDetails);
    panel.appendChild(list);
    panel.appendChild(addBtn);
    panel.appendChild(saveBtn);
  }

  // ====== Random Images ======
  let imagesEnabled = false;
  let audioResumeHooked = false;
  let badgeEl = null;
  let badgeTextEl = null;
  let badgeHeaderEl = null;
  let crtToggleBtn = null;
  let imgToggleBtn = null;
  let ytToggleBtn = null;
  let uiContainer = null;
  let masterBtn = null;
  let gearBtn = null;
  let editorOverlay = null;
  let editorSaveHandler = null;
  let pulseEnabled = true;
  let pulseTimer = null;
  let lastPathname = "";
  let imageItems = [];
  let ytItems = [];
  let storedConfig = null;
  let ytTitleCache = {};
  let currentYtTitle = "";
  let currentYtUrl = "";
  let portalEl = null;
  let ytState = "idle";
  let badgeText = "";
  let badgeEnabled = false;
  let effectsEnabled = false;
  let ytEnabled = false;
  let ytDefaultEnabled = CONFIG.youtube.enabled;
  let ytInited = false;
  let ytIds = [];
  let ytIndex = 0;
  let volumeEl = null;
  let volumeRange = null;
  let imageQueue = [];
  let imageQueueKey = "";
  let ytPlayOrder = [];
  let ytPlayIndex = 0;

  function log(message, data) {
    if (data !== undefined) {
      console.log("[TM-CRT]", message, data);
    } else {
      console.log("[TM-CRT]", message);
    }
  }


  function getEnabledImages() {
    return imageItems.filter((item) => item.enabled);
  }

  function getEnabledYouTubeUrls() {
    return ytItems.filter((item) => item.enabled).map((item) => item.url);
  }

  function enableYtItem(url) {
    const item = ytItems.find((entry) => entry.url === url);
    if (item) item.enabled = true;
  }

  function buildImageQueue(enabled) {
    const queue = enabled.slice();
    for (let i = queue.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    return queue;
  }

  function getImageQueueKey(enabled) {
    return enabled.map((item) => `${item.url}|${item.position || "random"}|${item.enabled ? 1 : 0}`).join(";");
  }

  function pickImageAsset() {
    const enabled = getEnabledImages();
    if (enabled.length === 0) return null;
    const nextKey = getImageQueueKey(enabled);
    if (imageQueue.length === 0 || imageQueueKey !== nextKey) {
      imageQueue = buildImageQueue(enabled);
      imageQueueKey = nextKey;
    }
    const asset = imageQueue.shift();
    if (imageQueue.length === 0) {
      imageQueue = buildImageQueue(enabled);
    }
    return asset || null;
  }

  function randomDelay(min, max) {
    return Math.floor(min + Math.random() * (max - min));
  }

  function normalizeAsset(item) {
    if (typeof item === "string") return { url: item, position: "random" };
    return { url: item.url, position: item.position || "random" };
  }

  function isGifUrl(url) {
    return /\.gif(\?|#|$)/i.test(url);
  }

  function parseContentType(headers) {
    const match = headers.match(/content-type:\s*([^\r\n]+)/i);
    return match ? match[1].split(";")[0].trim() : "";
  }

  function gmRequestArrayBuffer(url, timeoutMs) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        responseType: "arraybuffer",
        timeout: timeoutMs || 0,
        onload: (resp) => resolve(resp),
        onerror: (err) => reject(err),
        ontimeout: () => reject(new Error("timeout"))
      });
    });
  }

  async function getGifDurationMsFromBuffer(buf) {
    try {
      const bytes = new Uint8Array(buf);
      if (bytes.length < 10) return null;
      const header = String.fromCharCode(...bytes.slice(0, 6));
      if (header !== "GIF87a" && header !== "GIF89a") return null;

      let i = 6;
      const packed = bytes[i + 4];
      const gctFlag = (packed & 0x80) >> 7;
      const gctSize = 3 * (2 ** ((packed & 0x07) + 1));
      i += 7;
      if (gctFlag) i += gctSize;

      let total = 0;
      while (i < bytes.length) {
        const blockId = bytes[i++];
        if (blockId === 0x21) {
          const label = bytes[i++];
          if (label === 0xF9) {
            const blockSize = bytes[i++];
            if (blockSize === 0x04) {
              let delay = bytes[i + 1] | (bytes[i + 2] << 8);
              if (delay === 0) delay = 10;
              total += delay * 10;
            }
            i += blockSize;
            i++; // block terminator
          } else {
            while (i < bytes.length) {
              const size = bytes[i++];
              if (size === 0) break;
              i += size;
            }
          }
        } else if (blockId === 0x2C) {
          i += 9;
          const lctPacked = bytes[i++];
          const lctFlag = (lctPacked & 0x80) >> 7;
          const lctSize = 3 * (2 ** ((lctPacked & 0x07) + 1));
          if (lctFlag) i += lctSize;
          i++; // LZW min code size
          while (i < bytes.length) {
            const size = bytes[i++];
            if (size === 0) break;
            i += size;
          }
        } else if (blockId === 0x3B) {
          break;
        } else {
          break;
        }
      }

      return total || null;
    } catch (err) {
      return null;
    }
  }

  function pickPosition(position, w, h, vw, vh) {
    const maxLeft = Math.max(0, vw - w);
    const maxTop = Math.max(0, vh - h);
    const avoidW = Math.floor(vw * CONFIG.randomAvoidCenterRatio);
    const avoidH = Math.floor(vh * CONFIG.randomAvoidCenterRatio);
    const avoidLeft = Math.floor((vw - avoidW) / 2);
    const avoidTop = Math.floor((vh - avoidH) / 2);
    const avoidRect = {
      left: avoidLeft,
      top: avoidTop,
      right: avoidLeft + avoidW,
      bottom: avoidTop + avoidH
    };

    const overlapsAvoid = (left, top) => {
      const right = left + w;
      const bottom = top + h;
      return !(right <= avoidRect.left || left >= avoidRect.right || bottom <= avoidRect.top || top >= avoidRect.bottom);
    };

    switch (position) {
      case "top-left":
        return { left: 0, top: 0 };
      case "top-center":
        return { left: Math.floor(maxLeft / 2), top: 0 };
      case "top-right":
        return { left: maxLeft, top: 0 };
      case "center":
        return { left: Math.floor(maxLeft / 2), top: Math.floor(maxTop / 2) };
      case "bottom-left":
        return { left: 0, top: maxTop };
      case "bottom-center":
        return { left: Math.floor(maxLeft / 2), top: maxTop };
      case "bottom-right":
        return { left: maxLeft, top: maxTop };
      default:
        for (let i = 0; i < 30; i += 1) {
          const left = Math.floor(Math.random() * (maxLeft + 1));
          const top = Math.floor(Math.random() * (maxTop + 1));
          if (!overlapsAvoid(left, top)) return { left, top };
        }
        const left = Math.floor(Math.random() * (maxLeft + 1));
        const top = Math.floor(Math.random() * (maxTop + 1));
        if (!overlapsAvoid(left, top)) return { left, top };
        const pushLeft = left < avoidRect.left ? Math.max(0, avoidRect.left - w) : Math.min(maxLeft, avoidRect.right);
        const pushTop = top < avoidRect.top ? Math.max(0, avoidRect.top - h) : Math.min(maxTop, avoidRect.bottom);
        if (!overlapsAvoid(pushLeft, top)) return { left: pushLeft, top };
        if (!overlapsAvoid(left, pushTop)) return { left, top: pushTop };
        return { left: pushLeft, top: pushTop };
    }
  }

  async function showRandomImage() {
    if (!effectsEnabled || !imagesEnabled || getEnabledImages().length === 0) return;

    const container = getPlayerContainer();
    if (!container) return;

    const asset = pickImageAsset();
    if (!asset || !asset.url) return;
    const img = new Image();
    img.decoding = "async";

    let objectUrl = "";
    let gifDurationMs = null;
    let isGifAsset = false;
    try {
      const resp = await gmRequestArrayBuffer(asset.url, CONFIG.imageLoadTimeoutMs);
      const contentType = parseContentType(resp.responseHeaders || "");
      isGifAsset = isGifUrl(asset.url) || contentType === "image/gif";
      if (isGifAsset) {
        gifDurationMs = await getGifDurationMsFromBuffer(resp.response);
      }
      const blob = new Blob([resp.response], {
        type: contentType || "application/octet-stream"
      });
      objectUrl = URL.createObjectURL(blob);
      img.src = objectUrl;
    } catch (err) {
      log("image fetch failed", asset.url);
      return;
    }

    const loadTimeout = setTimeout(() => {
      img.src = "";
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }, CONFIG.imageLoadTimeoutMs);

    img.onerror = () => {
      clearTimeout(loadTimeout);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };

    img.onload = async () => {
      clearTimeout(loadTimeout);
      log("image loaded", asset.url);
      if (getComputedStyle(container).position === "static") {
        container.style.position = "relative";
      }
      const rect = container.getBoundingClientRect();
      const vw = Math.max(1, Math.floor(rect.width));
      const vh = Math.max(1, Math.floor(rect.height));

      const maxArea = vw * vh * CONFIG.maxScreenAreaRatio;
      const scaleByArea = Math.sqrt(maxArea / (img.naturalWidth * img.naturalHeight));
      const scaleByFit = Math.min(
        (vw * CONFIG.maxScreenUsageRatio) / img.naturalWidth,
        (vh * CONFIG.maxScreenUsageRatio) / img.naturalHeight
      );
      const scale = Math.min(1, scaleByArea, scaleByFit);

      const w = Math.floor(img.naturalWidth * scale);
      const h = Math.floor(img.naturalHeight * scale);

      const wrapper = document.createElement("div");
      wrapper.style.position = "absolute";
      wrapper.style.zIndex = "9000";
      wrapper.style.pointerEvents = "none";
      wrapper.style.width = `${w}px`;
      wrapper.style.height = `${h}px`;
      const pos = pickPosition(asset.position, w, h, vw, vh);
      wrapper.style.left = `${pos.left}px`;
      wrapper.style.top = `${pos.top}px`;
      if (asset.position === "random") {
        const maxTilt = Math.max(0, CONFIG.imageRandomTiltDeg || 0);
        const tilt = (Math.random() * 2 - 1) * maxTilt;
        wrapper.style.transform = `rotate(${tilt.toFixed(2)}deg)`;
      }

      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";

      wrapper.appendChild(img);
      container.appendChild(wrapper);

      if (effectsEnabled && crtContainer) {
        crtContainer.classList.add("tm-crt-glitch");
        setTimeout(() => {
          if (crtContainer) crtContainer.classList.remove("tm-crt-glitch");
        }, CONFIG.glitchDurationMs);
      }

      let displayMs = Math.max(4000, CONFIG.imageDisplayMs);
      if (gifDurationMs) {
        displayMs = Math.max(displayMs, gifDurationMs);
      } else if (isGifAsset) {
        displayMs = Math.max(displayMs, CONFIG.gifFallbackDurationMs);
      }

      setTimeout(() => {
        wrapper.remove();
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      }, displayMs);
    };
  }

  function scheduleImages() {
    setTimeout(() => {
      showRandomImage();
      scheduleImages();
    }, randomDelay(CONFIG.imageIntervalMin, CONFIG.imageIntervalMax));
  }

  // YouTube Iframe API (optional)
  let ytPlayer = null;
  function extractYouTubeId(url) {
    const idMatch = url.match(/[?&]v=([^&]+)/);
    return idMatch ? idMatch[1] : "";
  }

  function normalizeYouTubeList() {
    return getEnabledYouTubeUrls();
  }

  function buildYtPlayOrder(urls) {
    if (urls.length <= 1) return urls.slice();
    const first = urls[0];
    const rest = urls.slice(1);
    for (let i = rest.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    return [first, ...rest];
  }

  function resetYtPlayOrder() {
    const urls = normalizeYouTubeList();
    ytPlayOrder = buildYtPlayOrder(urls);
    ytPlayIndex = 0;
  }

  function playSpecificYtUrl(url) {
    if (!url) return;
    enableYtItem(url);
    if (!ytEnabled) ytEnabled = true;
    if (!effectsEnabled) effectsEnabled = true;
    ensureMediaInit();
    if (!ytPlayer) return;
    if (ytPlayOrder.length === 0) resetYtPlayOrder();
    const idx = ytPlayOrder.indexOf(url);
    if (idx >= 0) {
      ytPlayIndex = idx;
    }
    const id = extractYouTubeId(url);
    if (!id) return;
    ytIndex = ytPlayIndex;
    ytPlayer.loadVideoById(id);
    ytState = "playing";
    currentYtTitle = "";
    currentYtUrl = url;
    refreshEffectsFromToggles();
  }

  function initYouTubeAudio() {
    if (!ytEnabled) return;

    resetYtPlayOrder();
    if (ytPlayOrder.length === 0) return;
    ytIds = ytPlayOrder.map(extractYouTubeId).filter(Boolean);
    if (ytIds.length === 0) return;
    ytIndex = 0;

    ytState = "loading";
    updateBadge();
    log("yt init", ytIds);

    const createPlayer = () => {
      const holder = document.createElement("div");
      holder.id = "tm-yt-audio";
      holder.style.position = "fixed";
      holder.style.width = "1px";
      holder.style.height = "1px";
      holder.style.opacity = "0";
      holder.style.pointerEvents = "none";
      document.body.appendChild(holder);

      ytPlayer = new w.YT.Player("tm-yt-audio", {
        videoId: ytIds[ytIndex],
        playerVars: { autoplay: 1, controls: 0, playsinline: 1, modestbranding: 1 },
        events: {
          onReady: (e) => {
            e.target.setVolume(CONFIG.youtube.volume);
            e.target.playVideo();
            ytState = "ready";
            currentYtTitle = e.target.getVideoData().title || "";
            currentYtUrl = ytPlayOrder[ytPlayIndex] || "";
            updateBadge();
            log("yt ready", ytIds[ytIndex]);
          },
          onStateChange: (e) => {
            const states = w.YT.PlayerState || {};
            if (e.data === states.PLAYING) {
              ytState = "playing";
              currentYtTitle = e.target.getVideoData().title || "";
              currentYtUrl = ytPlayOrder[ytPlayIndex] || "";
            }
            else if (e.data === states.PAUSED) ytState = "paused";
            else if (e.data === states.ENDED) ytState = "ended";
            else if (e.data === states.BUFFERING) ytState = "buffering";
            else if (e.data === states.CUED) ytState = "cued";
            updateBadge();
            if (e.data === w.YT.PlayerState.ENDED) {
              ytPlayIndex += 1;
              if (ytPlayIndex >= ytIds.length) {
                resetYtPlayOrder();
                ytIds = ytPlayOrder.map(extractYouTubeId).filter(Boolean);
                ytPlayIndex = 0;
              }
              ytIndex = ytPlayIndex;
              e.target.loadVideoById(ytIds[ytIndex]);
              currentYtUrl = ytPlayOrder[ytPlayIndex] || "";
              log("yt next (shuffled)", ytIds[ytIndex]);
            }
          },
          onError: (e) => {
            ytState = "error";
            updateBadge();
            log("yt error", e.data);
          }
        }
      });
    };

    const w = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

    if (w.YT && w.YT.Player) {
      createPlayer();
      ytInited = true;
      return;
    }

    if (!w.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    w.onYouTubeIframeAPIReady = () => {
      createPlayer();
      ytInited = true;
    };
  }

  function toggleCrt() {
    crtEnabled = !crtEnabled;
    refreshEffectsFromToggles();
    log("crt toggle", crtEnabled);
  }

  function toggleImages() {
    imagesEnabled = !imagesEnabled;
    refreshEffectsFromToggles();
    log("images toggle", imagesEnabled);
  }

  function scheduleScanlineBurst() {
    const delay = randomDelay(15_000, 40_000);
    setTimeout(() => {
      if (effectsEnabled && crtEnabled && crtContainer) {
        crtContainer.classList.add("tm-crt-burst");
        setTimeout(() => {
          if (crtContainer) crtContainer.classList.remove("tm-crt-burst");
        }, 1200);
      }
      scheduleScanlineBurst();
    }, delay);
  }

  function ensureMediaInit() {
    if (!ytInited) initYouTubeAudio();
  }

  function toggleAllEffects() {
    setAllEffects(!anyEffectsOn());
    log("effects toggle", effectsEnabled);
  }

  function toggleYouTubeEnabled() {
    ytEnabled = !ytEnabled;
    if (ytEnabled && getEnabledYouTubeUrls().length === 0) {
      ytEnabled = false;
      ytState = "disabled";
      refreshEffectsFromToggles();
      return;
    }
    if (!ytEnabled && ytPlayer) {
      ytPlayer.stopVideo();
      ytState = "disabled";
      currentYtTitle = "";
      currentYtUrl = "";
    }
    if (ytEnabled) {
      ensureMediaInit();
      if (ytPlayOrder.length === 0) resetYtPlayOrder();
      if (ytPlayer) {
        ytPlayer.playVideo();
        ytState = "playing";
      } else {
        initYouTubeAudio();
      }
    }
    refreshEffectsFromToggles();
    log("yt toggle", ytEnabled);
  }

  function toggleYouTubePause() {
    if (!ytEnabled) return;
    ensureMediaInit();
    if (!ytPlayer) return;
    const state = ytPlayer.getPlayerState();
    if (state === 1) {
      ytPlayer.pauseVideo();
      ytState = "paused";
    } else {
      ytPlayer.playVideo();
      ytState = "playing";
    }
    updateBadge();
    log("yt pause", ytState);
  }

  function nextYouTubeTrack() {
    if (!ytEnabled) return;
    ensureMediaInit();
    if (!ytPlayer) return;
    if (ytPlayOrder.length === 0) resetYtPlayOrder();
    if (ytPlayOrder.length === 0) return;
    ytPlayIndex += 1;
    if (ytPlayIndex >= ytPlayOrder.length) {
      resetYtPlayOrder();
    }
    ytIds = ytPlayOrder.map(extractYouTubeId).filter(Boolean);
    ytIndex = ytPlayIndex;
    ytPlayer.loadVideoById(ytIds[ytIndex]);
    ytState = "playing";
    currentYtUrl = ytPlayOrder[ytPlayIndex] || url;
    updateBadge();
    log("yt next (manual)", ytIds[ytIndex]);
  }

  function prevYouTubeTrack() {
    if (!ytEnabled) return;
    ensureMediaInit();
    if (!ytPlayer) return;
    if (ytPlayOrder.length === 0) resetYtPlayOrder();
    if (ytPlayOrder.length === 0) return;
    ytPlayIndex -= 1;
    if (ytPlayIndex < 0) ytPlayIndex = ytPlayOrder.length - 1;
    ytIds = ytPlayOrder.map(extractYouTubeId).filter(Boolean);
    ytIndex = ytPlayIndex;
    ytPlayer.loadVideoById(ytIds[ytIndex]);
    ytState = "playing";
    currentYtUrl = ytPlayOrder[ytPlayIndex] || "";
    updateBadge();
    log("yt prev (manual)", ytIds[ytIndex]);
  }

  function controlPrevTrack() {
    prevYouTubeTrack();
  }

  function controlPause() {
    toggleYouTubePause();
  }

  function controlNextTrack() {
    nextYouTubeTrack();
  }

  function toggleBadge() {
    badgeEnabled = !badgeEnabled;
    if (!badgeEnabled && badgeEl) {
      badgeEl.remove();
      badgeEl = null;
      badgeText = "";
      badgeTextEl = null;
      badgeHeaderEl = null;
      crtToggleBtn = null;
      imgToggleBtn = null;
      ytToggleBtn = null;
    }
    const container = getPlayerContainer();
    if (badgeEnabled && container) {
      ensureBadge(container);
      updateBadge();
      ensureVolumeControl(container);
    }
    updateVolumeControlVisibility();
    updateEffectButtons();
    updateMasterButton();
    scheduleMasterPulse();
    log("badge toggle", badgeEnabled);
  }

  function closeBadgeIfOpen() {
    if (badgeEnabled) {
      toggleBadge();
    }
  }

  function isStreamPage(pathname) {
    if (!pathname || pathname === "/") return false;
    const blocked = new Set([
      "directory", "videos", "settings", "subscriptions", "inventory", "drops",
      "wallet", "friends", "user", "downloads", "p", "search", "team", "turbo",
      "store", "jobs", "blog", "about", "privacy", "login", "signup",
      "creatorcamp", "products", "prime", "primegaming", "bits", "support",
      "download", "clip", "clips", "moderator", "dashboard", "analytics",
      "messages", "notifications", "community", "safety", "help"
    ]);
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length !== 1) return false;
    return !blocked.has(parts[0].toLowerCase());
  }

  function monitorStreamNavigation() {
    const current = window.location.pathname;
    if (current === lastPathname) return;
    lastPathname = current;
    if (isStreamPage(current)) {
      setAllEffects(false);
    }
  }

  function resumeYouTubeIfBlocked() {
    if (ytPlayer && ytEnabled && effectsEnabled) {
      const state = ytPlayer.getPlayerState();
      if (state !== 1) ytPlayer.playVideo();
    }
  }

  function hookAudioResume() {
    if (audioResumeHooked) return;
    audioResumeHooked = true;
    const handler = () => {
      resumeYouTubeIfBlocked();
      document.removeEventListener("click", handler, true);
      document.removeEventListener("keydown", handler, true);
      document.removeEventListener("touchstart", handler, true);
    };
    document.addEventListener("click", handler, true);
    document.addEventListener("keydown", handler, true);
    document.addEventListener("touchstart", handler, true);
  }

  // ====== Hotkeys ======
  window.addEventListener("keydown", (e) => {
    if (!e.altKey) return;

    if (e.code === CONFIG.hotkeys.toggleImages) {
      toggleImages();
    }

    if (e.code === CONFIG.hotkeys.toggleCrt) {
      toggleCrt();
    }

    if (e.code === CONFIG.hotkeys.toggleAll && e.shiftKey) {
      toggleAllEffects();
    }

    if (e.code === CONFIG.hotkeys.toggleBadge && e.shiftKey) {
      toggleBadge();
    }

    if (e.code === CONFIG.hotkeys.toggleYouTube && e.shiftKey) {
      toggleYouTubeEnabled();
    }

    if (e.code === CONFIG.hotkeys.pauseYouTube && !e.shiftKey) {
      toggleYouTubePause();
    }

    if (e.code === CONFIG.hotkeys.nextYouTube && e.shiftKey) {
      nextYouTubeTrack();
    }

    if (e.code === CONFIG.hotkeys.prevYouTube && e.shiftKey) {
      prevYouTubeTrack();
    }

  });

  // ====== Init ======
  const mo = new MutationObserver(() => attachCrt());
  mo.observe(document.documentElement, { childList: true, subtree: true });

  loadStoredConfig();
  initItemState();
  attachCrt();
  scheduleImages();
  scheduleScanlineBurst();
  if (effectsEnabled) {
    initYouTubeAudio();
  }
  hookAudioResume();
  lastPathname = window.location.pathname;
  setInterval(monitorStreamNavigation, 1000);
  document.addEventListener("click", (e) => {
    if (editorOverlay) return;
    if (!badgeEnabled || !badgeEl) return;
    if (badgeEl.contains(e.target)) return;
    if (uiContainer && uiContainer.contains(e.target)) return;
    closeBadgeIfOpen();
  }, true);
  log("init");
})();
