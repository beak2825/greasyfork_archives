// ==UserScript==
// @name         DF Market – Sort by Quantity
// @namespace    df-market-qty
// @version      1.0
// @description  Add colum quantity to market, and ordenation by it
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561458/DF%20Market%20%E2%80%93%20Sort%20by%20Quantity.user.js
// @updateURL https://update.greasyfork.org/scripts/561458/DF%20Market%20%E2%80%93%20Sort%20by%20Quantity.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let asc = false;

  function addQuantityHeader() {
    const header = document.getElementById('tradesLabels');
    if (!header || header.querySelector('.qty-header')) return;

    const qty = document.createElement('span');
    qty.className = 'qty-header';
    qty.style.position = 'absolute';
    qty.style.left = '400px';
    qty.style.cursor = 'pointer';
    qty.style.userSelect = 'none';
    qty.innerHTML = 'Quantity <span class="icon">▼</span>';

    header.appendChild(qty);
  }

  function sortByQuantity() {
    const container = document.getElementById('itemDisplay');
    if (!container) return;

    const items = [...container.querySelectorAll('.fakeItem')];

    items.sort((a, b) => {
      return asc
        ? Number(a.dataset.quantity) - Number(b.dataset.quantity)
        : Number(b.dataset.quantity) - Number(a.dataset.quantity);
    });

    items.forEach(item => container.appendChild(item));

    const icon = document.querySelector('.qty-header .icon');
    if (icon) icon.textContent = asc ? '▲' : '▼';

    asc = !asc;
  }

  function bindSort() {
    const header = document.querySelector('.qty-header');
    if (!header || header.dataset.bound) return;

    header.dataset.bound = '1';
    header.addEventListener('click', sortByQuantity);
  }

  function init() {
    addQuantityHeader();
    bindSort();
  }

  // inicial
  init();

  // AJAX-safe
  new MutationObserver(init).observe(document.body, {
    childList: true,
    subtree: true
  });
})();
