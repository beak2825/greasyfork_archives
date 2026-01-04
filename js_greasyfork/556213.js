// ==UserScript==
// @name         FV - Herbalist Multi-Plant Seed Limit
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.8
// @description  Expands seed dropdowns to match available (empty) Herbalist Pots.
// @author       necroam
// @match        https://www.furvilla.com/career/herbalist/*
// @match        https://www.furvilla.com/career/plant-all/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556213/FV%20-%20Herbalist%20Multi-Plant%20Seed%20Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/556213/FV%20-%20Herbalist%20Multi-Plant%20Seed%20Limit.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function getTotalPots() {
    const well = document.querySelector('p.well');
    if (!well) return 0;
    const match = well.textContent.trim().match(/\/\s*(\d+)\s*seeds/i);
    return match ? parseInt(match[1], 10) || 0 : 0;
  }

  function getSelectedTotal() {
    let sum = 0;
    document.querySelectorAll('select.plantable-quantity').forEach(sel => {
      const val = parseInt(sel.value, 10);
      if (!isNaN(val)) sum += val;
    });
    return sum;
  }

  function rebuildDropdown(select, maxAllowed) {
    if (document.activeElement === select) return; // don't touch active dropdown
    const currentValue = parseInt(select.value, 10);
    select.innerHTML = '';
    for (let i = 0; i <= maxAllowed; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i;
      select.appendChild(opt);
    }
    select.value = String(!isNaN(currentValue) ? Math.min(currentValue, maxAllowed) : 0);
  }

  function enforceDropdowns() {
    const totalPots = getTotalPots();
    if (totalPots <= 0) return;

    document.querySelectorAll('select.plantable-quantity').forEach(select => {
      // read max seeds from last option in the dropdown
      const options = select.querySelectorAll('option');
      const maxSeeds = options.length ? parseInt(options[options.length - 1].value, 10) : totalPots;

      const maxAllowed = Math.min(maxSeeds, totalPots);

      rebuildDropdown(select, maxAllowed);

      if (!select.dataset.lastValue) {
        select.dataset.lastValue = select.value;
      }

      select.addEventListener('focus', () => {
        select.dataset.lastValue = select.value;
      });

      select.addEventListener('change', e => {
        const sum = getSelectedTotal();
        if (sum > totalPots) {
          e.target.value = select.dataset.lastValue;
        } else {
          select.dataset.lastValue = select.value;
        }
      });
    });
  }

  // Delay 
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(enforceDropdowns, 300);
  });

  // Debounced observer to avoid freezing
  let debounce;
  const observer = new MutationObserver(() => {
    clearTimeout(debounce);
    debounce = setTimeout(enforceDropdowns, 200);
  });

  const container =
    document.querySelector('#modal') ||
    document.querySelector('.career-content') ||
    document.body;

  observer.observe(container, { childList: true, subtree: true });
})();


