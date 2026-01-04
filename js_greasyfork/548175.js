// ==UserScript==
// @name            Kick Player Quality Changer (one-shot)
// @description     Auto-pick your preferred quality on Kick exactly once per stream/VOD.
// @namespace       https://github.com/you/kick-quality
// @version         0.3.0
// @author          elfahdo
// @match           https://kick.com/*
// @match           https://*.kick.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @license         MIT
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/548175/Kick%20Player%20Quality%20Changer%20%28one-shot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548175/Kick%20Player%20Quality%20Changer%20%28one-shot%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ── customize ────────────────────────────────────────────────────────────────
  // Common: "1080p60","1080p","720p60","720p","480p","360p"
  const PreferredQuality = "360p";
  const AllQualities = ["1080p60","1080p","720p60","720p","480p","360p"];
  // ─────────────────────────────────────────────────────────────────────────────

  const log = (...a) => console.log("[KickQuality]", ...a);

  // one-shot guards
  const DoneKeys = new Set();             // remembers streams/VODs we handled
  let href = location.href;                // SPA URL change detection

  // ——— helpers ———
  function findMainVideo() {
    const vids = Array.from(document.querySelectorAll('video'))
      .filter(v => v.offsetParent !== null && v.clientWidth*v.clientHeight > 0);
    vids.sort((a,b) => (b.clientWidth*b.clientHeight) - (a.clientWidth*a.clientHeight));
    return vids[0] || null;
  }

  // derive a key that changes when stream/VOD changes
  function getVideoKey(v) {
    const src = (v.currentSrc || v.src || "").split("?")[0];
    // fallback to pathname if src not ready yet
    return `${location.pathname}::${src || "no-src"}`;
  }

  function looksLikeAvatar(btn) {
    if (btn.closest('header')) return true;
    if (btn.querySelector('img,[data-testid*="avatar" i]')) return true;
    const aria = (btn.getAttribute('aria-label') || "").toLowerCase();
    return /\b(profile|account|avatar|user)\b/.test(aria);
  }

  function center(el) {
    const r = el.getBoundingClientRect();
    return { x:r.left+r.width/2, y:r.top+r.height/2 };
  }
  function isOverRect(el, rect) {
    const c = center(el);
    return c.x >= rect.left && c.x <= rect.right && c.y >= rect.top && c.y <= rect.bottom + 60;
  }
  function distToBottomRight(el, rect) {
    const c = center(el);
    return Math.hypot(rect.right - c.x, rect.bottom - c.y);
  }

  function findSettingsButton(video) {
    if (!video) return null;
    const vRect = video.getBoundingClientRect();

    // 1) aria-label contains "Settings" and sits over/near the video
    const explicit = Array.from(document.querySelectorAll('button[aria-haspopup="menu"]'))
      .find(b => /settings/i.test(b.getAttribute('aria-label') || "") && isOverRect(b, vRect));
    if (explicit) return explicit;

    // 2) any menu button over the video area, pick bottom-right-most (typical cog spot)
    const menuish = Array.from(document.querySelectorAll('button[aria-haspopup="menu"]'))
      .filter(b => isOverRect(b, vRect) && !looksLikeAvatar(b));
    menuish.sort((a,b) => distToBottomRight(a, vRect) - distToBottomRight(b, vRect));
    return menuish[0] || null;
  }

  function simulateClick(el) {
    if (!el) return;
    el.focus();
    ['pointerover','pointerenter','pointerdown','mousedown','pointerup','mouseup','click']
      .forEach(type => el.dispatchEvent(new PointerEvent(type, {
        bubbles:true, cancelable:true, composed:true,
        pointerId:1, pointerType:'mouse', isPrimary:true
      })));
  }

  function pickQualityOnce(closeMenuCb) {
    const items = Array.from(document.querySelectorAll('[role="menuitemradio"]'));
    if (!items.length) return false;

    const clean = t => t.trim().replace(/\s+/g,'');
    let picked = false;

    // exact
    const exact = items.find(i => clean(i.textContent) === clean(PreferredQuality));
    if (exact) { exact.click(); picked = true; }

    // fallback along our list
    if (!picked) {
      const start = AllQualities.indexOf(PreferredQuality);
      if (start >= 0) {
        for (let i=start; i<AllQualities.length && !picked; i++) {
          const q = AllQualities[i];
          const node = items.find(it => clean(it.textContent) === clean(q));
          if (node) { node.click(); picked = true; }
        }
      }
    }

    // lowest non-auto
    if (!picked) {
      const nonAuto = items.filter(i => !/auto/i.test(i.textContent));
      const last = nonAuto[nonAuto.length-1] || items[items.length-1];
      if (last) { last.click(); picked = true; }
    }

    if (picked && typeof closeMenuCb === 'function') closeMenuCb();
    return picked;
  }

  // ——— main one-shot runner ———
  function runOnceForThisVideo(maxTries = 20) {
    let tries = 0;
    const tick = () => {
      const v = findMainVideo();
      if (!v) return (++tries < maxTries) && setTimeout(tick, 250);

      const key = getVideoKey(v);
      if (DoneKeys.has(key)) return; // already handled this stream/VOD

      const cog = findSettingsButton(v);
      if (!cog) return (++tries < maxTries) && setTimeout(tick, 250);

      // open menu
      simulateClick(cog);

      // wait briefly for radios to mount, then pick once
      let waited = 0;
      const waitForMenu = setInterval(() => {
        waited++;
        const success = pickQualityOnce(() => simulateClick(cog)); // close after pick
        if (success || waited > 12) { // ~3s max
          clearInterval(waitForMenu);
          if (success) {
            DoneKeys.add(key);       // ✅ mark done — prevents repeats
            log("Applied once for:", key);
          }
        }
      }, 250);
    };
    tick();
  }

  // initial attempt
  runOnceForThisVideo();

  // rerun on SPA URL changes (but still one-shot thanks to DoneKeys)
  setInterval(() => {
    if (location.href !== href) {
      href = location.href;
      runOnceForThisVideo();
    }
  }, 500);

  // rerun if a *new* <video> element mounts or src changes (player remounts/ads)
  const mo = new MutationObserver(() => {
    // if a new video appeared with a new key, we’ll handle it once
    runOnceForThisVideo();
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // also watch for src changes on the main video (some players swap sources)
  const srcWatch = setInterval(() => {
    const v = findMainVideo();
    if (!v) return;
    const key = getVideoKey(v);
    if (!DoneKeys.has(key)) runOnceForThisVideo(); // handle once if new src
  }, 1500);
})();
