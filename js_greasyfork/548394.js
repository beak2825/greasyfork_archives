// ==UserScript==
// @name         Wildberries - сокрытие отвлекающей цены
// @name:en      Wildberries - removing of a distracting price (hide a junk prices)
// @name:ru      Wildberries - сокрытие отвлекающей цены
// @namespace    http://tampermonkey.net/
// @version      2025-09-05
// @description        Убирает отвлекающие цены; красная цена - добавляет к ней 10%
// @description:ru     Убирает отвлекающие цены; красная цена - добавляет к ней 10%
// @description:en     Hide junc prices; add +10% to a red prices on search page
// @author       heXor
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wildberries.ru
// @match        https://www.wildberries.ru/*
// @match        https://global.wildberries.ru/*
// @run-at       document-start
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/548394/Wildberries%20-%20%D1%81%D0%BE%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D0%BE%D1%82%D0%B2%D0%BB%D0%B5%D0%BA%D0%B0%D1%8E%D1%89%D0%B5%D0%B9%20%D1%86%D0%B5%D0%BD%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/548394/Wildberries%20-%20%D1%81%D0%BE%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D0%BE%D1%82%D0%B2%D0%BB%D0%B5%D0%BA%D0%B0%D1%8E%D1%89%D0%B5%D0%B9%20%D1%86%D0%B5%D0%BD%D1%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // CSS:
  /* 1) Product page: hide wallet and old price; enlarge final price */
  /* 2) Search/catalog: hide "with WB Wallet" label and <del> old price */
  const css = `
    html.wb-page-detail [class*="priceBlockWalletPrice"] { display: none !important; }
    html.wb-page-detail [class*="priceBlockOldPrice"] { display: none !important; }
    html.wb-page-detail [class*="priceBlockFinalPrice"] {
      font-size: 1.25em !important;
      font-weight: 700 !important;
      line-height: 1.2 !important;
    }

    html.wb-page-search .product-card__price .price__wallet-condition-text { display: none !important; }
    html.wb-page-search .product-card__price .price__wrap del { display: none !important; }
  `;
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));

  const ensureStyle = () => {
    if (!style.isConnected) (document.head || document.documentElement).appendChild(style);
  };
  ensureStyle();
  new MutationObserver(ensureStyle).observe(document.documentElement, { childList: true, subtree: true });

  // Utilities
  const fmt = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');

  function bumpRedPrice(root = document) {
    // Red price in catalog cards
    const nodes = root.querySelectorAll('.product-card__price .price__lower-price.wallet-price.red-price');
    nodes.forEach(el => {
      if (el.dataset.bumped === '1') return;
      const raw = el.textContent || '';
      const num = parseInt(raw.replace(/[^\d]/g, ''), 10);
      if (!isNaN(num)) {
        const bumped = Math.round(num * 1.1);
        el.textContent = `${fmt(bumped)}\u00A0₽`;
        el.dataset.bumped = '1';
      }
    });
  }

  // Determine current route and apply logic
  function applyForRoute() {
    const url = new URL(location.href);
    const path = url.pathname;

    const isSearch = url.hostname.endsWith('wildberries.ru') && url.pathname === '/catalog/0/search.aspx';
    const isDetailRu = /^\/catalog\/\d+\/detail\.aspx$/i.test(path) && url.hostname.endsWith('wildberries.ru');
    const isDetailGlobal = /^\/product\/\d+/i.test(path) && url.hostname === 'global.wildberries.ru';

    document.documentElement.classList.toggle('wb-page-search', isSearch);
    document.documentElement.classList.toggle('wb-page-detail', isDetailRu || isDetailGlobal);

    if (isSearch) bumpRedPrice(document);
  }

  // Initial run
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyForRoute, { once: true });
  } else {
    applyForRoute();
  }

  // Handle dynamic catalog updates (infinite scroll, filters, etc.)
  const mo = new MutationObserver(muts => {
    if (document.documentElement.classList.contains('wb-page-search')) {
      for (const m of muts) {
        for (const n of m.addedNodes) {
          if (n.nodeType === 1) bumpRedPrice(n);
        }
      }
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });

  // Hook into SPA navigations
  const dispatchRoute = () => window.dispatchEvent(new Event('wb:locationchange'));

  const origPush = history.pushState;
  history.pushState = function () {
    const ret = origPush.apply(this, arguments);
    dispatchRoute();
    return ret;
  };

  const origReplace = history.replaceState;
  history.replaceState = function () {
    const ret = origReplace.apply(this, arguments);
    dispatchRoute();
    return ret;
  };

  window.addEventListener('popstate', dispatchRoute);
  window.addEventListener('wb:locationchange', applyForRoute);
})();
