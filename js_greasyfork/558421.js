// ==UserScript==
// @name         ChangeToYouTubePremiumLogo
// @namespace    https://github.com/diligencefrozen/ChangeToYouTubePremiumLogo
// @version      20251208.14
// @description Replace YouTube’s logo with a Premium-style version. Includes color customization, dark/theater mode support, hover animation, Yoodle handling, and logo-click navigation.
// @icon         https://github.com/diligencefrozen/ChangeToYouTubePremiumLogo/blob/main/logo/original.png?raw=true
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/558421/ChangeToYouTubePremiumLogo.user.js
// @updateURL https://update.greasyfork.org/scripts/558421/ChangeToYouTubePremiumLogo.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /* ──────────── UA / Theme ──────────── */
  const isSafari = () => {
    const ua = navigator.userAgent;
    return /Safari/i.test(ua) &&
           !/Chrome|CriOS|OPiOS|EdgiOS|Edg|FxiOS|Brave|Vivaldi/i.test(ua);
  };
  const isDark = () => document.documentElement.hasAttribute("dark");
  
  // Check if on watch page (where theater mode exists)
  const isWatchPage = () => {
    return location.pathname.startsWith('/watch');
  };
  
  // Check if on Shorts page
  const isShortsPage = () => {
    return location.pathname.startsWith('/shorts/');
  };
  
  // Check if theater mode is active (background becomes black in light mode)
  // Only applies to /watch pages (not home, not shorts, not other pages)
  const isTheaterMode = () => {
    if (!isWatchPage()) return false; // Theater mode only exists on /watch pages
    if (isShortsPage()) return false; // Shorts has its own background handling
    const player = document.querySelector('#movie_player, .html5-video-player');
    return player?.classList.contains('ytp-big-mode') || 
           document.querySelector('ytd-watch-flexy[theater]') !== null;
  };

  /* ──────────── CSS Injection: Disable Hover Animations ──────────── */
  function injectDisableHoverAnimationCSS() {
    const style = document.createElement("style");
    style.textContent = `
      /* Define 360 degree rotation animation for logo with scale */
      @keyframes rotate360Premium {
        0% {
          transform: rotate(0deg) scale(1);
          filter: drop-shadow(0 0 0px var(--logo-shadow-color, rgba(255, 0, 0, 0)));
        }
        50% {
          transform: rotate(180deg) scale(1.1);
        }
        100% {
          transform: rotate(360deg) scale(1);
          filter: drop-shadow(0 0 20px var(--logo-shadow-color, rgba(255, 0, 0, 0.6)));
        }
      }
      
      /* Apply rotation animation to YouTube logo on hover */
      a#logo:hover img[data-premium-logo="1"],
      #logo:hover img[data-premium-logo="1"],
      ytd-topbar-logo-renderer:hover img[data-premium-logo="1"] {
        animation: rotate360Premium 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        transform-origin: center;
        filter: drop-shadow(0 0 20px var(--logo-shadow-color, rgba(255, 0, 0, 0.6))) 
                var(--logo-custom-filter, brightness(1) saturate(1)) !important;
      }
      
      /* Apply custom color filter if set */
      img[data-premium-logo="1"][data-custom-color="true"] {
        filter: var(--logo-custom-filter, brightness(1) saturate(1)) !important;
      }
      
      /* Smooth transition for logo container */
      a#logo,
      #logo,
      ytd-topbar-logo-renderer {
        transition: transform 0.3s ease-out;
      }
      
      a#logo:hover,
      #logo:hover,
      ytd-topbar-logo-renderer:hover {
        transform: translateY(-2px);
      }
      
      /* Disable hover animations on video grid images and thumbnails */
      ytd-grid-video-renderer img,
      ytd-video-renderer img,
      ytd-rich-item-renderer img,
      #dismissible img,
      .ytd-grid-video-renderer img,
      .ytd-video-renderer img,
      .ytd-rich-item-renderer img {
        animation: none !important;
        transition: none !important;
      }
      
      /* Disable hover effects on video cards and related containers */
      ytd-grid-video-renderer,
      ytd-video-renderer,
      ytd-rich-item-renderer,
      #dismissible {
        --ytd-video-primary-info-renderer-title-max-lines: 2;
      }
      
      /* Prevent scale/transform animations on hover */
      ytd-grid-video-renderer:hover img,
      ytd-video-renderer:hover img,
      ytd-rich-item-renderer:hover img {
        transform: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  /* ──────────── Dynamic Shadow Color Update ──────────── */
  function updateLogoShadowColor() {
    const shadowColorMap = {
      red:    "rgba(255, 0, 0, 0.6)",
      black:  "rgba(0, 0, 0, 0.6)",
      pink:   "rgba(255, 105, 180, 0.6)",
      yellow: "rgba(255, 215, 0, 0.6)",
      green:  "rgba(0, 128, 0, 0.6)",
      brown:  "rgba(165, 42, 42, 0.6)",
      grey:   "rgba(128, 128, 128, 0.6)",
      indigo: "rgba(75, 0, 130, 0.6)",
    };
    
    const shadowColor = shadowColorMap[state.color] || shadowColorMap[DEFAULT_COLOR];
    document.documentElement.style.setProperty('--logo-shadow-color', shadowColor);
  }

  /* ──────────── Assets ──────────── */
  const BASE = "https://raw.githubusercontent.com/diligencefrozen/ChangeToYouTubePremiumLogo/main/logo/";
  const DEFAULT_COLOR = "red";
  const COLOR_MAP = {
    red:    { dark: "logov1.png",  light: "logov2.png"  },
    black:  { dark: "logov3.png",  light: "logov4.png"  },
    pink:   { dark: "logov5.png",  light: "logov6.png"  },
    yellow: { dark: "logov7.png",  light: "logov8.png"  },
    green:  { dark: "logov9.png",  light: "logov10.png" },
    brown:  { dark: "logov11.png", light: "logov12.png" },
    grey:   { dark: "logov13.png", light: "logov14.png" },
    indigo: { dark: "logov15.png", light: "logov16.png" },
  };

  /* ──────────── Storage (sync/async safe) ──────────── */
  const hasLegacySync = typeof GM_getValue === "function";
  const hasModernAsync = typeof GM !== "undefined" && typeof GM.getValue === "function";
  const store = {
    async get(key, defVal) {
      if (isSafari()) return defVal;
      try {
        if (hasLegacySync) return GM_getValue(key, defVal);
        if (hasModernAsync) return await GM.getValue(key, defVal);
      } catch {}
      return defVal;
    },
    async set(key, val) {
      if (isSafari()) return;
      try {
        if (typeof GM_setValue === "function") return GM_setValue(key, val);
        if (typeof GM !== "undefined" && typeof GM.setValue === "function") return GM.setValue(key, val);
      } catch {}
    }
  };

  const state = {
    color: DEFAULT_COLOR,
    yoodleShown: new Set() // Track which yoodle logos have been shown
  };

  const getLogoURL = () => {
    const cfg  = COLOR_MAP[state.color] || COLOR_MAP[DEFAULT_COLOR];
    // Use dark logo if: 1) dark mode is on, OR 2) theater mode is active (even in light mode)
    const useDark = isDark() || isTheaterMode();
    const file = (useDark ? cfg.dark : cfg.light) || cfg.dark;
    return BASE + file;
  };

  /* ──────────── Core: replace only the SVG, keep country code ──────────── */
  function replaceSvgWithImg(svg) {
    if (!svg || svg.dataset.premiumReplaced === "1") return;

    // Create img
    const img = document.createElement("img");
    img.dataset.premiumLogo = "1";
    img.alt = "YouTube Premium";
    img.src = getLogoURL();
    img.style.cssText = "width:94px;height:auto;pointer-events:none;display:block;";

    // Keep parent structure (anchor + sup country code). Replace only the SVG node.
    svg.replaceWith(img);
    // Mark parent for theme updates
    img.closest("a#logo, #logo, ytd-topbar-logo-renderer, ytm-pivot-bar-renderer")?.setAttribute("data-premium-hasimg", "1");
  }

  function patchOnceInContainer(container) {
    if (!container) return;
    // Target newest inline SVG id prefix (e.g., yt-ringo2-svg_yt10). Cover both desktop & mweb.
    const svgs = container.querySelectorAll('svg[id^="yt-ringo2-svg_"], svg#logo-icon, a#logo svg, #logo svg');
    let touched = false;
    svgs.forEach(svg => {
      // If already replaced with our img, just refresh src for theme/color changes
      const nextIsImg = svg.tagName.toLowerCase() === "img" || svg.nextElementSibling?.dataset?.premiumLogo === "1";
      if (svg.dataset?.premiumReplaced === "1") return;

      // Only swap real SVG nodes; if container already has our <img>, update below
      if (svg instanceof SVGElement) {
        replaceSvgWithImg(svg);
        touched = true;
      }
    });

    // Handle YouTube Yoodle (special event logos like ytd-yoodle-renderer)
    const yoodleImgs = container.querySelectorAll('ytd-yoodle-renderer img, .ytd-yoodle-renderer img');
    yoodleImgs.forEach(yoodleImg => {
      if (yoodleImg.dataset.premiumReplaced === "1") return;

      // Generate unique identifier for this yoodle logo
      const yoodleId = yoodleImg.src || yoodleImg.alt || 'yoodle-' + Date.now();

      // If we haven't shown this yoodle yet, wait 15 seconds before replacing
      if (!state.yoodleShown.has(yoodleId)) {
        state.yoodleShown.add(yoodleId);
        yoodleImg.dataset.premiumReplaced = "1"; // Mark to prevent re-processing

        // Delay of 15 seconds (15000ms)
        const delay = 15000;
        setTimeout(() => {
          // Create replacement img
          const img = document.createElement("img");
          img.dataset.premiumLogo = "1";
          img.alt = "YouTube Premium";
          img.src = getLogoURL();
          img.style.cssText = "width:94px;height:auto;pointer-events:none;display:block;";

          yoodleImg.replaceWith(img);
          img.closest("a#logo, #logo, ytd-topbar-logo-renderer, ytm-pivot-bar-renderer")?.setAttribute("data-premium-hasimg", "1");
        }, delay);

        touched = true;
      }
    });

    // Also refresh existing imgs (e.g., after theme toggle)
    container.querySelectorAll('img[data-premium-logo="1"]').forEach(img => {
      img.src = getLogoURL();
      touched = true;
    });

    return touched;
  }

  function patchAll() {
    // Anchor container usually: a#logo inside ytd-topbar-logo-renderer
    const containers = [
      ...document.querySelectorAll('a#logo, #logo, ytd-topbar-logo-renderer, ytm-pivot-bar-renderer, ytd-yoodle-renderer')
    ];
    if (containers.length === 0) return;
    containers.forEach(patchOnceInContainer);

    // Update shadow color based on current logo color
    updateLogoShadowColor();
    
    // Apply custom color filter if needed
    if (state.customColor && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(state.customColor)) {
      const imgs = document.querySelectorAll('img[data-premium-logo="1"]');
      imgs.forEach(img => {
        img.dataset.customColor = "true";
        applyCustomColorFilter(img, state.customColor);
      });
    }

    // Ensure clicking the logo behaves as requested (reload/home). We bind on the anchor.
    const anchors = document.querySelectorAll('a#logo, #logo');
    anchors.forEach(a => {
      if (a.dataset.ytLogoClickBound) return;
      a.addEventListener("click", e => {
        // Allow modifier keys to open new tab etc.
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        e.stopPropagation();
        location.pathname === "/" ? location.reload() : (location.href = "/");
      }, true);
      a.dataset.ytLogoClickBound = "1";
      a.style.cursor = "pointer";
    });
  }

  /* ──────────── Apply Custom Color Filter to Logo ──────────── */
  function applyCustomColorFilter(img, hexColor) {
    // Calculate the filter to convert red logo to custom color
    // This uses CSS filters to adjust hue, saturation, and brightness
    const rgb = hexToRgb(hexColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // Apply hue rotation based on the target color's hue
    // Red is at 0°, so we calculate the rotation needed
    const hueRotation = hsl.h; // The hue angle to rotate to
    const saturation = Math.max(50, hsl.s); // Ensure good saturation
    const brightness = Math.max(0.8, Math.min(1.2, 1 + (hsl.l - 50) / 100)); // Brightness adjustment
    
    const filter = `hue-rotate(${hueRotation}deg) saturate(${saturation / 100}) brightness(${brightness})`;
    document.documentElement.style.setProperty('--logo-custom-filter', filter);
  }

  /* ──────────── Color Conversion Utilities ──────────── */
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 0, b: 0 };
  }

  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  /* ──────────── Observers ──────────── */
  const debounce = (fn, wait = 50) => {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  };
  const onDomAdded = debounce(patchAll, 50);

  function observe() {
    // New nodes (logo re-render, navigation, mweb topbar rebuild)
    new MutationObserver((muts) => {
      for (const m of muts) {
        for (const n of m.addedNodes) {
          if (n.nodeType !== 1) continue;
          if (
            n.matches?.('a#logo, #logo, ytd-topbar-logo-renderer, ytm-pivot-bar-renderer, ytd-yoodle-renderer, svg[id^="yt-ringo2-svg_"]') ||
            n.querySelector?.('a#logo, #logo, ytd-topbar-logo-renderer, ytm-pivot-bar-renderer, ytd-yoodle-renderer, svg[id^="yt-ringo2-svg_"]')
          ) {
            onDomAdded();
            break;
          }
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });

    // Theme toggle (html[dark])
    new MutationObserver(() => {
      document.querySelectorAll('img[data-premium-logo="1"]').forEach(img => (img.src = getLogoURL()));
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["dark"] });
    
    // Theater mode toggle (watch for ytd-watch-flexy[theater] attribute or player class changes)
    new MutationObserver(() => {
      document.querySelectorAll('img[data-premium-logo="1"]').forEach(img => (img.src = getLogoURL()));
    }).observe(document.body, { 
      attributes: true, 
      attributeFilter: ["theater"], 
      subtree: true 
    });
    
    // Also observe player class changes for theater mode
    const observePlayer = () => {
      const player = document.querySelector('#movie_player, .html5-video-player');
      if (player) {
        new MutationObserver(() => {
          document.querySelectorAll('img[data-premium-logo="1"]').forEach(img => (img.src = getLogoURL()));
        }).observe(player, { 
          attributes: true, 
          attributeFilter: ["class"] 
        });
      } else {
        // Retry if player not found yet
        setTimeout(observePlayer, 1000);
      }
    };
    observePlayer();
  }

  /* ──────────── Menu (no country-code hiding anywhere) ──────────── */
  function registerMenu() {
    if (isSafari() || typeof GM_registerMenuCommand !== "function") return;
    
    const label = () => `Set Logo Color (current: ${state.color})`;
    
    GM_registerMenuCommand(label(), async () => {
      showColorSelectionMenu();
    });
    
    // Add help/guide menu
    GM_registerMenuCommand("📖 Logo Color Guide", () => {
      showHelpGuide();
    });
  }

  /* ──────────── Color Selection Menu with Guide ──────────── */
  async function showColorSelectionMenu() {
    const options = Object.keys(COLOR_MAP);
    const predefinedColors = options.join(", ");
    
    const message = `🎨 Select YouTube Logo Color\n\n` +
      `Enter HEX code for custom color:\n` +
      `Example: #FF7B33 (orange)\n\n` +
      `Or use predefined color name:\n${predefinedColors}\n\n` +
      `Current: ${state.color}`;
    
    const input = prompt(message, state.color);
    if (!input) return;
    
    const trimmedInput = input.trim();
    
    // Check if it's a predefined color
    if (COLOR_MAP[trimmedInput]) {
      await store.set("logoColor", trimmedInput);
      state.color = trimmedInput;
      updateLogoShadowColor();
      patchAll();
      alert(`✅ Logo color changed to: ${trimmedInput}`);
      return;
    }
    
    // Auto-fix HEX color format (add # if missing)
    let hexColor = trimmedInput;
    if (!/^#/.test(hexColor) && /^[A-Fa-f0-9]{6}$|^[A-Fa-f0-9]{3}$/.test(hexColor)) {
      hexColor = "#" + hexColor;
      alert(`💡 Tip: Automatically added '#'\nYour input: ${trimmedInput}\nConverted to: ${hexColor}`);
    }
    
    // Validate HEX color (3 or 6 digit hex codes)
    if (!/^#[A-Fa-f0-9]{3}$|^#[A-Fa-f0-9]{6}$/.test(hexColor)) {
      alert(`❌ Invalid format\n\nValid HEX code examples:\n#FF7B33\n#FFF\n#FEFEFE`);
      return;
    }
    
    // Apply custom color
    await store.set("logoColor", hexColor);
    state.color = hexColor;
    state.customColor = hexColor;
    
    createCustomColorLogo(hexColor);
    updateLogoShadowColorCustom(hexColor);
    patchAll();
    alert(`✅ Custom logo color applied!\nColor code: ${hexColor}`);
  }

  /* ──────────── Help Guide ──────────── */
  function showHelpGuide() {
    const guide = `📖 YouTube Premium Logo Color Customization Guide\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `✨ Features\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• Change YouTube logo to any color\n` +
      `• 360° rotation animation on hover\n` +
      `• Dynamic shadow matching logo color\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🎨 Predefined Colors\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `red, black, pink, yellow,\n` +
      `green, brown, grey, indigo\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🌈 Custom Colors (HEX Code)\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `What is HEX Code?\n` +
      `A color representation using hexadecimal.\n\n` +
      `Format: #RRGGBB\n` +
      `R = Red (00-FF)\n` +
      `G = Green (00-FF)\n` +
      `B = Blue (00-FF)\n\n` +
      `📝 Examples\n` +
      `#FF0000 = Red\n` +
      `#00FF00 = Green\n` +
      `#0000FF = Blue\n` +
      `#FFD700 = Gold\n` +
      `#FF1493 = Deep Pink\n` +
      `#FEFEFE = Off-white\n\n` +
      `💡 Tips\n` +
      `• Omitting '#' is okay - it will auto-add\n` +
      `• Example: FF7B33 → #FF7B33\n\n` +
      `🔍 Finding HEX Codes\n` +
      `Search 'color picker' on Google\n` +
      `to easily find any color's HEX code.`;
    
    alert(guide);
  }

  /* ──────────── Custom Color Logo Creation ──────────── */
  function createCustomColorLogo(hexColor) {
    // Store custom color in state for reference
    state.customColor = hexColor;
  }

  function getCustomLogoURL(hexColor) {
    // For custom colors, we'll use a data URI or cached approach
    // For now, we'll use the red logo and apply CSS filter to tint it
    const baseColor = "red";
    const cfg = COLOR_MAP[baseColor];
    const useDark = isDark() || isTheaterMode();
    const file = (useDark ? cfg.dark : cfg.light) || cfg.dark;
    return BASE + file;
  }

  /* ──────────── Dynamic Shadow Color Update (Enhanced) ──────────── */
  function updateLogoShadowColorCustom(hexColor) {
    // Convert HEX to RGBA for shadow effect
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
    document.documentElement.style.setProperty('--logo-shadow-color', shadowColor);
  }

  /* ──────────── Boot ──────────── */
  async function init() {
    // NOTE: No CSS/JS that hides country code. We keep YouTube's <sup> intact.
    injectDisableHoverAnimationCSS();
    state.color = isSafari() ? DEFAULT_COLOR : await store.get("logoColor", DEFAULT_COLOR);
    
    // Check if saved color is a custom HEX color
    if (state.color && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(state.color)) {
      state.customColor = state.color;
      updateLogoShadowColorCustom(state.color);
    }
    
    patchAll();
    observe();
    registerMenu();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();