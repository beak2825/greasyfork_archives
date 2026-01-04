// ==UserScript==
// @name         NexusMods – Highlight Updated & Downloaded Mods on Nexus
// @version      1.0.2
// @license      GPL-3.0-or-later
// @description  Highlights mods with "Update available" (yellow) or "Downloaded" (green) across Standard, List, and Compact views
// @author       Flimbo
// @match        https://*.nexusmods.com/games/*/mods*
// @match        https://*.nexusmods.com/profile/*/mods*
// @grant        none
// @run-at       document-idle
// @homepageURL  https://github.com/BitGrub/Userscripts
// @homepage     https://github.com/BitGrub/Userscripts
// @supportURL   https://github.com/BitGrub/Userscripts/issues
// @namespace https://greasyfork.org/users/1511951
// @downloadURL https://update.greasyfork.org/scripts/548571/NexusMods%20%E2%80%93%20Highlight%20Updated%20%20Downloaded%20Mods%20on%20Nexus.user.js
// @updateURL https://update.greasyfork.org/scripts/548571/NexusMods%20%E2%80%93%20Highlight%20Updated%20%20Downloaded%20Mods%20on%20Nexus.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const STYLE_ID  = 'nm-highlighter-style';
  const HL_UPDATE = 'nm-update-card';
  const HL_DOWN   = 'nm-downloaded-card';
  const TILE_SELECTOR = '[data-e2eid="mod-tile"],[data-e2eid="mod-tile-list"],[data-e2eid="mod-tile-standard"],[data-e2eid="mod-tile-compact"]';

  function injectCSS() {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes nm-glow {
      0%, 100% { box-shadow: 0 0 6px rgba(255,213,0,0.6); }
      50%      { box-shadow: 0 0 14px rgba(255,213,0,1); }
    }

    .${HL_UPDATE} {
      outline: 3px solid rgba(255,213,0,.85) !important;
      outline-offset: 2px;
      border-radius: 10px;
      animation: nm-glow 2s ease-in-out infinite;
    }

    .${HL_DOWN} {
      outline: 3px solid rgba(0,200,0,.8) !important;
      outline-offset: 2px;
      border-radius: 10px;
    }
  `;
  document.head.appendChild(s);
}

  function clearHighlights() {
    document.querySelectorAll(TILE_SELECTOR).forEach(t => {
      t.classList.remove(HL_UPDATE, HL_DOWN);
    });
  }

  function applyFromBadges() {
    document.querySelectorAll('[data-e2eid="mod-tile-update-available"]').forEach(b => {
      const tile = b.closest(TILE_SELECTOR);
      if (tile) tile.classList.add(HL_UPDATE);
    });

    document.querySelectorAll('[data-e2eid="mod-tile-downloaded"]').forEach(b => {
      const tile = b.closest(TILE_SELECTOR);
      if (tile && !tile.classList.contains(HL_UPDATE)) tile.classList.add(HL_DOWN);
    });
  }

  let debounceTimer = null;
  function markAllDebounced() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      clearHighlights();
      applyFromBadges();
    }, 80);
  }

  function boot() {
    injectCSS();
    markAllDebounced();

    // observe DOM for badges/tiles being added (infinite scroll / hydration)
    const mo = new MutationObserver(markAllDebounced);
    mo.observe(document.body, { childList: true, subtree: true });

    // SPA navigation hooks
    const _push = history.pushState, _replace = history.replaceState;
    history.pushState = function() { const r = _push.apply(this, arguments); markAllDebounced(); return r; };
    history.replaceState = function() { const r = _replace.apply(this, arguments); markAllDebounced(); return r; };
    addEventListener('popstate', markAllDebounced);
  }

  if (document.readyState === 'loading') {
    addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();