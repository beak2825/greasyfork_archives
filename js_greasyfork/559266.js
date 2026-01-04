// ==UserScript==
// @name         YouTube - Proper Description
// @description  Forces the video description to live below the video with a reliable open/close toggle. Updated for modern YouTube DOM (no yt.msgs_ dependency).
// @namespace    http://tampermonkey.net/
// @icon         https://cdn-icons-png.flaticon.com/64/2504/2504965.png
// @version      0.0.5
// @author       rxm
// @match        *://www.youtube.com/watch*
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559266/YouTube%20-%20Proper%20Description.user.js
// @updateURL https://update.greasyfork.org/scripts/559266/YouTube%20-%20Proper%20Description.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function waitFor(selector) {
    return new Promise(resolve => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);

      const mo = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          mo.disconnect();
          resolve(el);
        }
      });
      mo.observe(document, { childList: true, subtree: true });
    });
  }

  function init() {
    waitFor('#meta ytd-video-secondary-info-renderer ytd-expander').then(expander => {
      if (expander.dataset.fixed) return;
      expander.dataset.fixed = '1';

      const more = expander.querySelector('tp-yt-paper-button#more');
      const less = expander.querySelector('tp-yt-paper-button#less');

      if (!more || !less) return;

      // Custom toggle
      const toggle = document.createElement('div');
      toggle.style.cursor = 'pointer';
      toggle.style.marginTop = '8px';
      toggle.style.fontWeight = '500';
      toggle.style.color = 'var(--yt-spec-text-primary)';
      toggle.textContent = expander.hasAttribute('collapsed')
        ? more.textContent.replace('...', '').trim() || 'Show more'
        : less.textContent.replace('...', '').trim() || 'Show less';

      expander.appendChild(toggle);

      function update() {
        toggle.textContent = expander.hasAttribute('collapsed')
          ? more.textContent.replace('...', '').trim() || 'Show more'
          : less.textContent.replace('...', '').trim() || 'Show less';
      }

      toggle.addEventListener('click', () => {
        if (expander.hasAttribute('collapsed')) {
          expander.removeAttribute('collapsed');
          more.setAttribute('hidden', '');
          less.removeAttribute('hidden');
        } else {
          expander.setAttribute('collapsed', '');
          less.setAttribute('hidden', '');
          more.removeAttribute('hidden');
        }
        update();
      });

      new MutationObserver(update).observe(expander, {
        attributes: true,
        attributeFilter: ['collapsed']
      });

      update();
    });
  }

  // Initial load
  init();

  // SPA navigation support
  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      if (location.pathname === '/watch') {
        setTimeout(init, 500);
      }
    }
  }, 500);
})();