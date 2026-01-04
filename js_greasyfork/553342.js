// ==UserScript==
// @name         REDgifs CPU% Saver
// @version      1.4.1
// @description  Pause offscreen videos and gently fade in visible ones for smooth, efficient browsing.
// @author       Raizuto & ChatGPT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=redgifs.com
// @match        *://*.redgifs.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @homepageURL  https://github.com/Raizuto/Tamper_Violentmonkey-Scripts/
// @supportURL   https://github.com/Raizuto/Tamper_Violentmonkey-Scripts/issues
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/553342/REDgifs%20CPU%25%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/553342/REDgifs%20CPU%25%20Saver.meta.js
// ==/UserScript==

// Adjust the @match if you want to use this elsewhere. :D 
// Change the MAX_ACTIVE below to the desired number of allowed videos 
// to be loaded at once (this includes off screen videos)!
// Set to 1 by default for 21.5" monitors whether they are landscape or portrait.
// So if it doesn't work quite right for you tweak the Visible Threshold below

(() => {
  'use strict';
  const KEYS = { ENABLE: 'svs_enabled', DEBUG: 'svs_debug', PERF: 'svs_perf' };
  const MAX_ACTIVE = 1, OFFSET = 800, VISIBLE_THRESHOLD = 0.85, DELAY = 550;
  const get = (k, d) => GM_getValue(k, d);
  const set = (k, v) => GM_setValue(k, v);
  const log = (...a) => get(KEYS.DEBUG, false) && console.log('[SVS]', ...a);

  if (get(KEYS.ENABLE) === undefined) set(KEYS.ENABLE, true);
  if (get(KEYS.DEBUG) === undefined) set(KEYS.DEBUG, false);
  if (get(KEYS.PERF) === undefined) set(KEYS.PERF, true);

  if (!get(KEYS.ENABLE, true) || !get(KEYS.PERF, false)) return;

  const active = new Set();
  const videos = new Set();

  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      const v = e.target;
      if (!(v instanceof HTMLVideoElement)) continue;
      const mostlyVisible = e.intersectionRatio >= VISIBLE_THRESHOLD;
      if (mostlyVisible && active.size < MAX_ACTIVE) {
        if (v.dataset.fade !== '1') {
          v.style.opacity = 0;
          v.style.transition = 'opacity 0.5s ease';
          v.dataset.fade = '1';
        }
        setTimeout(() => {
          if (e.intersectionRatio >= VISIBLE_THRESHOLD) {
            v.play().catch(() => {});
            v.style.opacity = 1;
            active.add(v);
            log('Playing', v);
          }
        }, DELAY);
      } else if (!mostlyVisible) {
        v.pause();
        v.style.opacity = 0.6;
        v.currentTime = 0;
        active.delete(v);
        log('Paused', v);
      }
    }
  }, { rootMargin: `${OFFSET}px`, threshold: Array.from({ length: 11 }, (_, i) => i / 10) });

  const watch = () => {
    document.querySelectorAll('video').forEach(v => {
      if (!v.dataset.svs) {
        v.dataset.svs = '1';
        videos.add(v);
        io.observe(v);
        log('Observed', v);
      }
    });
  };

  const mo = new MutationObserver(() => watch());
  document.addEventListener('DOMContentLoaded', watch);
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
