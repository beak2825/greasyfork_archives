// ==UserScript==
// @name         Firefox Mobile Background Video
// @namespace    firefox-mobile-background-video
// @version      1.1.0
// @description  Forces Page Visibility API to "visible" on selected domains so background video/audio keeps playing.
// @license      GPL-3.0-or-later
// @match        *://amazon.com/*
// @match        *://*.amazon.com/*
// @match        *://amazon.de/*
// @match        *://*.amazon.de/*
// @match        *://audible.com/*
// @match        *://*.audible.com/*
// @match        *://audible.de/*
// @match        *://*.audible.de/*
// @match        *://brightcove.com/*
// @match        *://*.brightcove.com/*
// @match        *://coursera.org/*
// @match        *://*.coursera.org/*
// @match        *://dailymotion.com/*
// @match        *://*.dailymotion.com/*
// @match        *://disneyplus.com/*
// @match        *://*.disneyplus.com/*
// @match        *://facebook.com/*
// @match        *://*.facebook.com/*
// @match        *://instagram.com/*
// @match        *://*.instagram.com/*
// @match        *://jwplayer.com/*
// @match        *://*.jwplayer.com/*
// @match        *://loom.com/*
// @match        *://*.loom.com/*
// @match        *://metacafe.com/*
// @match        *://*.metacafe.com/*
// @match        *://mixcloud.com/*
// @match        *://*.mixcloud.com/*
// @match        *://netflix.com/*
// @match        *://*.netflix.com/*
// @match        *://spotify.com/*
// @match        *://*.spotify.com/*
// @match        *://primevideo.com/*
// @match        *://*.primevideo.com/*
// @match        *://soundcloud.com/*
// @match        *://*.soundcloud.com/*
// @match        *://streamable.com/*
// @match        *://*.streamable.com/*
// @match        *://tiktok.com/*
// @match        *://*.tiktok.com/*
// @match        *://tv.apple.com/*
// @match        *://*.tv.apple.com/*
// @match        *://twitch.tv/*
// @match        *://*.twitch.tv/*
// @match        *://twitter.com/*
// @match        *://*.twitter.com/*
// @match        *://udemy.com/*
// @match        *://*.udemy.com/*
// @match        *://vidyard.com/*
// @match        *://*.vidyard.com/*
// @match        *://vimeo.com/*
// @match        *://*.vimeo.com/*
// @match        *://x.com/*
// @match        *://*.x.com/*
// @match        *://youtube-nocookie.com/*
// @match        *://*.youtube-nocookie.com/*
// @match        *://youtube.com/*
// @match        *://*.youtube.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563406/Firefox%20Mobile%20Background%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/563406/Firefox%20Mobile%20Background%20Video.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ============================================================
  // SETTINGS (User configurable)
  // ============================================================
  const CFG = {
    ENABLED: true,

    // Allow running inside iframes/embeds (recommended for many video players)
    ALLOW_IFRAMES: true,

    // Runtime whitelist (suffix match: "youtube.com" matches "m.youtube.com")
    HOST_SUFFIXES: [
      // 'your-domain.tld',
      'amazon.com',
      'amazon.de',
      'audible.com',
      'audible.de',
      'brightcove.com',
      'coursera.org',
      'dailymotion.com',
      'disneyplus.com',
      'facebook.com',
      'instagram.com',
      'jwplayer.com',
      'loom.com',
      'metacafe.com',
      'mixcloud.com',
      'netflix.com',
      'spotify.com',
      'primevideo.com',
      'soundcloud.com',
      'streamable.com',
      'tiktok.com',
      'tv.apple.com',
      'twitch.tv',
      'twitter.com',
      'udemy.com',
      'vidyard.com',
      'vimeo.com',
      'x.com',
      'youtube-nocookie.com',
      'youtube.com',
    ],

    // Core: Spoof Page Visibility API (no event-blocking)
    SPOOF_VISIBILITY: true,

    // Optional: synthetic activity to keep some sites "awake"
    // Disabled by default because it can cause UI side effects (hover/tooltips).
    SYNTHETIC_ACTIVITY: false,

    // Synthetic activity tuning
    ACTIVITY_INTERVAL_MS: 60_000,     // every 60s
    ACTIVITY_MIN_INTERVAL_MS: 5_000,  // safety floor
  };

  // ============================================================
  // Basic guards
  // ============================================================
  if (!CFG.ENABLED) return;
  if (!CFG.ALLOW_IFRAMES && window.top !== window.self) return;

  const host = (location.hostname || '').toLowerCase();

  const isTargetHost = CFG.HOST_SUFFIXES.some((sfx) => {
    sfx = (sfx || '').toLowerCase().trim();
    return sfx && (host === sfx || host.endsWith('.' + sfx));
  });

  if (!isTargetHost) return;

  // ============================================================
  // Visibility spoofing (ONLY spoofing, no visibilitychange blocking)
  // ============================================================
  const STATE_VISIBLE = 'visible';

  function safeDefine(obj, prop, desc) {
    try {
      Object.defineProperty(obj, prop, desc);
      return true;
    } catch (_) {
      return false;
    }
  }

  function installVisibilitySpoof() {
    if (!CFG.SPOOF_VISIBILITY) return;

    // Prefer prototype (works for most sites)
    const protoOK1 = safeDefine(Document.prototype, 'visibilityState', {
      configurable: true,
      enumerable: true,
      get: () => STATE_VISIBLE,
    });

    const protoOK2 = safeDefine(Document.prototype, 'hidden', {
      configurable: true,
      enumerable: true,
      get: () => false,
    });

    // WebKit aliases
    const protoOK3 = safeDefine(Document.prototype, 'webkitVisibilityState', {
      configurable: true,
      enumerable: true,
      get: () => STATE_VISIBLE,
    });

    const protoOK4 = safeDefine(Document.prototype, 'webkitHidden', {
      configurable: true,
      enumerable: true,
      get: () => false,
    });

    // Fallback: patch document instance if prototype was blocked
    if (!protoOK1) {
      safeDefine(document, 'visibilityState', { configurable: true, get: () => STATE_VISIBLE });
    }
    if (!protoOK2) {
      safeDefine(document, 'hidden', { configurable: true, get: () => false });
    }
    if (!protoOK3) {
      safeDefine(document, 'webkitVisibilityState', { configurable: true, get: () => STATE_VISIBLE });
    }
    if (!protoOK4) {
      safeDefine(document, 'webkitHidden', { configurable: true, get: () => false });
    }
  }

  // ============================================================
  // Synthetic user activity (optional)
  // ============================================================
  let activityTimer = null;

  function emitSyntheticActivity() {
    try {
      const w = window.innerWidth || 360;
      const h = window.innerHeight || 640;

      const x = Math.max(1, Math.min(w - 2, Math.floor(w * 0.5 + (Math.random() - 0.5) * 40)));
      const y = Math.max(1, Math.min(h - 2, Math.floor(h * 0.5 + (Math.random() - 0.5) * 40)));

      window.dispatchEvent(new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: false,
        clientX: x,
        clientY: y,
        screenX: x,
        screenY: y,
      }));

      if (typeof PointerEvent === 'function') {
        window.dispatchEvent(new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: false,
          clientX: x,
          clientY: y,
          pointerId: 1,
          pointerType: 'mouse',
          isPrimary: true,
        }));
      }
    } catch (_) {
      // ignore
    }
  }

  function startActivityTick() {
    if (!CFG.SYNTHETIC_ACTIVITY) return;

    // Safe integer conversion (avoid bitwise casts like "|0")
    const requested = Math.floor(Number(CFG.ACTIVITY_INTERVAL_MS));
    const interval = Math.max(
      CFG.ACTIVITY_MIN_INTERVAL_MS,
      Number.isFinite(requested) ? requested : 0
    );

    activityTimer = window.setInterval(emitSyntheticActivity, interval);
    window.setTimeout(emitSyntheticActivity, 1500);
  }

  // ============================================================
  // Init
  // ============================================================
  installVisibilitySpoof();
  startActivityTick();

  // Optional debug marker
  try { window.__BGVIDEO_ALWAYS_VISIBLE__ = true; } catch (_) {}
})();
