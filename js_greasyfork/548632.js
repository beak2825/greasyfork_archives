// ==UserScript==
// @name         Neopian Lottery – Replace Flash RIP with MP4
// @namespace    neopets
// @version      1.0.0
// @description  Replaces the Flash RIP notice on the Neopian Lottery page with a looping MP4 video and hides any lingering SWF embed.
// @author       SirStroman
// @match        https://www.neopets.com/games/lottery.phtml
// @match        http://www.neopets.com/games/lottery.phtml
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548632/Neopian%20Lottery%20%E2%80%93%20Replace%20Flash%20RIP%20with%20MP4.user.js
// @updateURL https://update.greasyfork.org/scripts/548632/Neopian%20Lottery%20%E2%80%93%20Replace%20Flash%20RIP%20with%20MP4.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MP4_URL = 'https://files.catbox.moe/lph5qc.mp4';

  /** Poll for an element until it exists, then resolve */
  function waitForEl(selector, { interval = 200, timeout = 10_000 } = {}) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const timer = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(timer);
          resolve(el);
        } else if (Date.now() - start > timeout) {
          clearInterval(timer);
          reject(new Error(`Timed out waiting for ${selector}`));
        }
      }, interval);
    });
  }

  function hideFlashEmbed() {
    // Hide obvious SWF/object embeds and the dynamic SWFObject output
    const swfLike = document.querySelectorAll(
      'embed[type*="shockwave"], object[type*="shockwave"], object[data$=".swf"], embed[src$=".swf"], [id^="flash_"]'
    );
    swfLike.forEach((n) => {
      n.style.display = 'none';
      n.style.visibility = 'hidden';
    });
  }

  function buildVideo(widthPx = 150, heightPx = 225) {
    const vid = document.createElement('video');
    vid.src = MP4_URL;
    vid.autoplay = true;
    vid.muted = true;            // required for autoplay
    vid.loop = true;
    vid.playsInline = true;      // iOS inline playback
    vid.setAttribute('playsinline', '');
    vid.setAttribute('preload', 'auto');

    Object.assign(vid.style, {
      width: `${widthPx}px`,
      height: `${heightPx}px`,
      objectFit: 'cover',
      display: 'block',
      borderRadius: '6px',
      boxShadow: '0 1px 3px rgba(0,0,0,.25)',
    });

    return vid;
  }

  async function replaceFlashRip() {
    try {
      // Flash RIP div is injected by /js/flash_rip.js and has this class
      const rip = await waitForEl('.flashRIP__2020', { interval: 200, timeout: 10000 });

      // Make sure it’s visible and empty it
      rip.style.display = 'block';
      rip.innerHTML = '';

      // Some page layouts benefit from a small wrapper to ensure sizing
      const wrap = document.createElement('div');
      Object.assign(wrap.style, {
        width: '150px',
        height: '225px',
        margin: '0 auto',
      });
      wrap.appendChild(buildVideo(150, 225));

      rip.appendChild(wrap);
    } catch (err) {
      // If the Flash RIP element never appears, try to inject near the SWF slot as a fallback
      console.warn('[Lottery MP4] FlashRIP not found, falling back:', err);

      // The SWF was written with a dynamic id 'flash_*' inside the first <td> of the lottery table
      const swfCell = document.querySelector('table[width="100%"] td[width="160"]') ||
                      document.querySelector('object[id^="flash_"], embed[id^="flash_"]')?.parentElement;

      if (swfCell) {
        // Clear and insert our video
        swfCell.innerHTML = '';
        swfCell.appendChild(buildVideo(150, 225));
      }
    }
  }

  function init() {
    hideFlashEmbed();
    replaceFlashRip();

    // If the site’s JS toggles Flash RIP visibility later, keep our video visible
    const mo = new MutationObserver(() => {
      const rip = document.querySelector('.flashRIP__2020');
      if (rip && rip.style.display === 'none') rip.style.display = 'block';
    });
    const root = document.body || document.documentElement;
    if (root) mo.observe(root, { attributes: true, childList: true, subtree: true });
  }

  // Kick off once the DOM is usable
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
