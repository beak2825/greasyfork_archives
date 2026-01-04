// ==UserScript==
// @name         Torn — Weapon bonus on new line
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds weapon bonus (e.g. Revitalize 10%) on its own line beneath the weapon name in listings.
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553306/Torn%20%E2%80%94%20Weapon%20bonus%20on%20new%20line.user.js
// @updateURL https://update.greasyfork.org/scripts/553306/Torn%20%E2%80%94%20Weapon%20bonus%20on%20new%20line.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function getTiles(root = document) {
    return Array.from(root.querySelectorAll('[class^="itemTile___"]'));
  }

  function getBonusText(tile) {
    const bonusIcons = tile.querySelectorAll('[data-bonus-attachment-title][data-bonus-attachment-description]');
    if (!bonusIcons.length) return null;

    const bonuses = Array.from(bonusIcons).map(el => {
      const name = el.getAttribute('data-bonus-attachment-title');
      const desc = el.getAttribute('data-bonus-attachment-description') || '';
      const match = desc.match(/(\d+(?:\.\d+)?)\s*%/);
      const pct = match ? match[1] + '%' : '';
      return pct ? `${name} ${pct}` : name;
    });

    return bonuses.join(', ');
  }

  function insertNewLine(tile, text) {
    const titleBlock = tile.querySelector(':scope > [class^="title___"]');
    if (!titleBlock) return;

    // Find the name element inside the title block
    const nameEl = titleBlock.querySelector('[class^="name___"]');
    if (!nameEl) return;

    // Skip if we already inserted one
    if (titleBlock.querySelector('.tm-bonus-line')) return;

    // Create a new line element
    const bonusLine = document.createElement('div');
    bonusLine.className = 'tm-bonus-line';
    bonusLine.textContent = text;
    bonusLine.style.fontSize = '11px';
    bonusLine.style.fontWeight = '600';
    bonusLine.style.color = '#d4af37'; // soft gold tone for visibility
    bonusLine.style.marginTop = '2px';

    // Insert right after the weapon name
    nameEl.insertAdjacentElement('afterend', bonusLine);

    tile.dataset.tmBonusDone = '1';
  }

  function processTile(tile) {
    if (tile.dataset.tmBonusDone === '1') return;
    const text = getBonusText(tile);
    if (text) insertNewLine(tile, text);
  }

  function scan(root = document) {
    getTiles(root).forEach(processTile);
  }

  function observe() {
    const obs = new MutationObserver(muts => {
      for (const m of muts) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches?.('[class^="itemTile___"]')) processTile(node);
          else if (node.querySelector?.('[class^="itemTile___"]')) scan(node);
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  scan(document);
  observe();
})();
