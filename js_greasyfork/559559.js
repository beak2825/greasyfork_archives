// ==UserScript==
  // @name         Animekai Volume + Speed Helper
  // @namespace    ak-volume
  // @description set animekai vid speed to 1.25x and lower total volume to make slider usable.
  // @version 0.1.0
  // @run-at       document-start
  // @grant        none
  // @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/559559/Animekai%20Volume%20%2B%20Speed%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/559559/Animekai%20Volume%20%2B%20Speed%20Helper.meta.js
  // ==/UserScript==
  (() => {
    'use strict';

    // Only activate on animekai pages/frames (including third-party iframes opened from animekai)
    const isAnimekaiContext = (() => {
      const h = location.hostname;
      if (h === 'animekai.to' || h.endsWith('.animekai.to')) return true;
      try {
        const rh = new URL(document.referrer || '').hostname;
        if (rh === 'animekai.to' || (rh && rh.endsWith('.animekai.to'))) return true;
      } catch {}
      return false;
    })();
    if (!isAnimekaiContext) return;

    // CONFIG
    const volumeScale = 0.15;     // 0.2 = 20% of site volume (make lower for quieter)
    const defaultRate = 1.25;    // default playback speed
    const eps = 0.0005;

    const V = self.HTMLMediaElement && HTMLMediaElement.prototype;
    if (!V) return;

    // Monkey-patch volume so page UI sees "raw" volume but actual audio is scaled down.
    const volDesc = Object.getOwnPropertyDescriptor(V, 'volume');
    if (volDesc?.get && volDesc?.set) {
      const origGet = volDesc.get;
      const origSet = volDesc.set;
      const rawMap = new WeakMap();

      Object.defineProperty(V, 'volume', {
        get() {
          let raw = rawMap.get(this);
          if (raw == null) {
            const actual = origGet.call(this);
            raw = Math.max(0, Math.min(1, actual / volumeScale));
            rawMap.set(this, raw);
          }
          return raw;
        },
        set(val) {
          val = Number(val);
          if (!isFinite(val)) return;
          val = Math.max(0, Math.min(1, val));
          rawMap.set(this, val);
          const desired = Math.max(0, Math.min(1, val * volumeScale));
          try { origSet.call(this, desired); } catch {}
        },
        configurable: true,
        enumerable: volDesc.enumerable
      });
    }

    // Apply default playback rate on load; allow user changes to stick.
    function setupRate(el) {
      if (!el || el._ak_rateSetup) return;
      el._ak_rateSetup = true;
      el._ak_adjustingRate = false;
      el._ak_userRateChanged = false;

      const approxEq = (a, b, tol = 0.01) => Math.abs(a - b) <= tol;

      function applyDefaultIfNeeded() {
        if (el._ak_userRateChanged) return; // user changed speed; don't fight it
        const cur = Number(el.playbackRate) || 1;
        if (approxEq(cur, 1)) {
          el._ak_adjustingRate = true;
          try { el.playbackRate = defaultRate; } catch {}
          el._ak_adjustingRate = false;
        }
      }

      // Mark when speed changes away from our default (likely user action)
      el.addEventListener('ratechange', () => {
        if (el._ak_adjustingRate) return;
        const r = Number(el.playbackRate) || 1;
        // If it moves to something not ~1 and not ~default, treat as user intent
        if (!approxEq(r, 1) && !approxEq(r, defaultRate)) {
          el._ak_userRateChanged = true;
        }
      }, { passive: true });

      el.addEventListener('loadedmetadata', applyDefaultIfNeeded, { passive: true });
      el.addEventListener('play', applyDefaultIfNeeded, { passive: true });
      el.addEventListener('playing', applyDefaultIfNeeded, { passive: true });

      // Initial attempt
      applyDefaultIfNeeded();
    }

    function init(root = document) {
      root.querySelectorAll?.('video,audio').forEach(el => {
        try {
          // Trigger our volume scaling by re-setting to the same logical value
          el.volume = el.volume;
        } catch {}
        setupRate(el);
      });
    }

    if (document.readyState === 'loading') {
      addEventListener('DOMContentLoaded', () => init(), { once: true });
    } else {
      init();
    }

    new MutationObserver(muts => {
      for (const m of muts) {
        for (const n of m.addedNodes) {
          if (n instanceof HTMLMediaElement) {
            try { n.volume = n.volume; } catch {}
            setupRate(n);
          } else if (n && n.querySelectorAll) {
            init(n);
          }
        }
      }
    }).observe(document, { childList: true, subtree: true });
  })();