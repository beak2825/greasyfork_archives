// ==UserScript==
// @name         YouTube Hide Miniplayer in Context Menu
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide the "Miniplayer" entry from the YouTube player/context menu
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552346/YouTube%20Hide%20Miniplayer%20in%20Context%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/552346/YouTube%20Hide%20Miniplayer%20in%20Context%20Menu.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Add or edit keywords here (all lower-case). Keep them short so they match localized variants if possible.
  const KEYWORDS = ['miniplayer', 'mini player', 'mini'];

  // Find the logical menu-item root from any descendant node
  function findMenuItemRoot(el) {
    let depth = 0;
    while (el && depth < 12) {
      if (el.matches &&
         (el.matches('.ytp-menuitem') ||
          el.matches('ytd-menu-service-item-renderer') ||
          el.matches('tp-yt-paper-item') ||
          el.getAttribute && el.getAttribute('role') === 'menuitem')) {
        return el;
      }
      el = el.parentElement;
      depth++;
    }
    return null;
  }

  function hideMiniplayerItems() {
    const selectors = [
      '.ytp-menuitem',
      'ytd-menu-service-item-renderer',
      'tp-yt-paper-item',
      'paper-item',
      '.ytp-contextmenu .ytp-menuitem'
    ];
    const nodes = document.querySelectorAll(selectors.join(','));
    nodes.forEach(node => {
      const root = findMenuItemRoot(node) || node;
      if (root.__miniplayer_hidden) return; // already handled

      const text = ((root.innerText || root.textContent) + '').trim().toLowerCase().replace(/\s+/g, ' ');
      const aria = ((root.getAttribute && (root.getAttribute('aria-label') || root.getAttribute('title'))) || '').toLowerCase();

      const shouldHide = KEYWORDS.some(k => text.includes(k) || aria.includes(k));
      if (shouldHide) {
        // hide the whole menu entry
        root.style.display = 'none';
        root.setAttribute('aria-hidden', 'true');
        root.__miniplayer_hidden = true;
      }
    });
  }

  // MutationObserver: catches menu DOM additions / changes
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      if ((m.addedNodes && m.addedNodes.length) || m.type === 'attributes') {
        hideMiniplayerItems();
        break;
      }
    }
  });
  observer.observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });

  // Also run right after a contextmenu event (menu is typically created right after)
  document.addEventListener('contextmenu', () => setTimeout(hideMiniplayerItems, 25), true);

  // Initial run (in case menu exists)
  setTimeout(hideMiniplayerItems, 500);
})();
