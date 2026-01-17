// ==UserScript==
// @name         Vinted - Sort by Like (Desc)
// @namespace    https://vinted.it/
// @version      0.6
// @description  Add  a button near filters to sort items by like count in descending order on Vinted member pages.
// @match        https://www.vinted.it/member/*
// @grant        none
// @author       jappoman
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562937/Vinted%20-%20Sort%20by%20Like%20%28Desc%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562937/Vinted%20-%20Sort%20by%20Like%20%28Desc%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const GRID_ITEM_SELECTOR = '[data-testid="grid-item"]';
  const LIKE_SELECTOR = '[data-testid="favourite-count-text"]';
  const FILTER_BAR_SELECTOR = '[data-testid="closet-buyer-filters"]';
  const SORT_TRIGGER_SELECTOR = '[data-testid="sort-filter-dropdown--trigger"]';
  const BUTTON_ID = 'vm-sort-likes-btn';
  const ORDER_ATTR = 'data-vm-original-index';

  function getLikeCount(item) {
    const likeEl = item.querySelector(LIKE_SELECTOR);
    if (!likeEl) return 0;
    const text = likeEl.textContent.trim().replace(/\./g, '').replace(',', '.');
    const num = parseFloat(text);
    return Number.isFinite(num) ? num : 0;
  }

  function getGridContainer() {
    const firstItem = document.querySelector(GRID_ITEM_SELECTOR);
    return firstItem ? firstItem.parentElement : null;
  }

  function ensureOriginalOrder(container) {
    const items = Array.from(container.querySelectorAll(GRID_ITEM_SELECTOR));
    items.forEach((el, i) => {
      if (!el.hasAttribute(ORDER_ATTR)) {
        el.setAttribute(ORDER_ATTR, String(i));
      }
    });
  }

  function sortItemsByLikes() {
    const container = getGridContainer();
    if (!container) return;

    ensureOriginalOrder(container);

    const items = Array.from(container.querySelectorAll(GRID_ITEM_SELECTOR));
    if (!items.length) return;

    const sorted = items
      .map((el) => ({
        el,
        likes: getLikeCount(el),
        i: Number(el.getAttribute(ORDER_ATTR)) || 0
      }))
      .sort((a, b) => (b.likes !== a.likes ? b.likes - a.likes : a.i - b.i))
      .map(x => x.el);

    const frag = document.createDocumentFragment();
    sorted.forEach(el => frag.appendChild(el));
    container.appendChild(frag);
  }

  function restoreOriginalOrder() {
    const container = getGridContainer();
    if (!container) return;

    const items = Array.from(container.querySelectorAll(GRID_ITEM_SELECTOR));
    const sorted = items
      .map(el => ({
        el,
        i: Number(el.getAttribute(ORDER_ATTR)) || 0
      }))
      .sort((a, b) => a.i - b.i)
      .map(x => x.el);

    const frag = document.createDocumentFragment();
    sorted.forEach(el => frag.appendChild(el));
    container.appendChild(frag);
  }

  function buildButton() {
    const btn = document.createElement('button');
    btn.id = BUTTON_ID;
    btn.type = 'button';
    btn.className = 'web_ui__Button__button web_ui__Button__flat web_ui__Button__medium web_ui__Button__muted';
    btn.textContent = 'Sort by Like (Desc)';
    btn.addEventListener('click', sortItemsByLikes);
    return btn;
  }

  function injectButton() {
    if (document.getElementById(BUTTON_ID)) return;

    const bar = document.querySelector(FILTER_BAR_SELECTOR);
    if (!bar) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'u-flexbox u-align-items-center';

    const spacer = document.createElement('div');
    spacer.className = 'web_ui__Spacer__regular web_ui__Spacer__vertical';

    wrapper.appendChild(spacer);
    wrapper.appendChild(buildButton());

    bar.appendChild(wrapper);
  }

  function handleSortChange(e) {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.name !== 'sort_by') return;
    restoreOriginalOrder();
  }

  const observer = new MutationObserver(() => injectButton());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener('change', handleSortChange);

  injectButton();
})();
