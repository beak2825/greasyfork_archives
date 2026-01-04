// ==UserScript==
// @name         Crunchyroll Picture-in-Picture (page + iframe)
// @version      1.3
// @description  Enables PiP on Crunchyroll player by fixing iframe and video element restrictions.
// @author       cyberaguiar
// @match        https://www.crunchyroll.com/*
// @match        https://static.crunchyroll.com/*vilos*/web/vilos/player.html*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crunchyroll.com
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1519555
// @downloadURL https://update.greasyfork.org/scripts/550739/Crunchyroll%20Picture-in-Picture%20%28page%20%2B%20iframe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550739/Crunchyroll%20Picture-in-Picture%20%28page%20%2B%20iframe%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const IS_IFRAME_CONTEXT = location.hostname.endsWith('static.crunchyroll.com');

  // --------- MAIN PAGE CONTEXT (crunchyroll.com) ---------
  if (!IS_IFRAME_CONTEXT) {
    // Ensure iframe has PiP permission in its "allow" attribute
    const ensurePiPAllowed = (frame) => {
      if (!(frame instanceof HTMLIFrameElement)) return;
      const cur = frame.getAttribute('allow') || '';
      if (!/\bpicture-in-picture\b/.test(cur)) {
        const updated = (cur.trim() ? cur.trim() + '; ' : '') + 'picture-in-picture *';
        frame.setAttribute('allow', updated);
      }
    };

    // Scan for Crunchyroll video player iframes
    const scanFrames = () => {
      document
        .querySelectorAll(
          'iframe.video-player, iframe[src*="/vilos/"], iframe[src*="/vilos-v2/"]'
        )
        .forEach(ensurePiPAllowed);
    };

    // Watch DOM for new/updated iframes
    new MutationObserver(scanFrames).observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'class', 'allow'],
    });

    scanFrames();
    return; // The rest runs only inside the iframe
  }

  // --------- IFRAME CONTEXT (static.crunchyroll.com) ---------
  // Remove disablepictureinpicture and keep it removed
  const enablePiPOn = (video) => {
    if (!video) return;

    video.removeAttribute('disablepictureinpicture');

    // Keep watching in case the site re-applies the attribute
    new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'attributes' && m.attributeName === 'disablepictureinpicture') {
          video.removeAttribute('disablepictureinpicture');
        }
      }
    }).observe(video, { attributes: true, attributeFilter: ['disablepictureinpicture'] });

    // Some sites set attributes late, so check again on metadata load
    video.addEventListener('loadedmetadata', () => {
      video.removeAttribute('disablepictureinpicture');
    });
  };

  // Scan all possible video elements (including shadow DOM)
  const scanVideos = () => {
    document.querySelectorAll('video, video#player0').forEach(enablePiPOn);

    document.querySelectorAll('*').forEach((el) => {
      if (el.shadowRoot) el.shadowRoot.querySelectorAll('video').forEach(enablePiPOn);
    });
  };

  // Watch DOM for video element replacements
  new MutationObserver(scanVideos).observe(document, { childList: true, subtree: true });
  scanVideos();

  // Optional: keyboard shortcut Ctrl+Alt+P to trigger PiP
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'p') {
      const direct = document.querySelector('video');
      const shadow = (() => {
        for (const el of document.querySelectorAll('*')) {
          if (el.shadowRoot) {
            const v = el.shadowRoot.querySelector('video');
            if (v) return v;
          }
        }
      })();
      const v = direct || shadow;
      if (v && document.pictureInPictureEnabled && !document.pictureInPictureElement) {
        v.requestPictureInPicture?.().catch(() => {});
      }
    }
  });
})();
