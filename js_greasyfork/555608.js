// ==UserScript==
// @name         Torn Stocks — Color rows (robust, multi)
// @namespace    user.tamper.scripts
// @version      0.3.1
// @description  Evidențiază rândurile pentru acțiunile selectate. Fără butoane. Mai robust la schimbări DOM.
// @author       SuperGogu
// @match        https://www.torn.com/page.php?sid=stocks*
// @match        https://www.torn.com/*stocks*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555608/Torn%20Stocks%20%E2%80%94%20Color%20rows%20%28robust%2C%20multi%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555608/Torn%20Stocks%20%E2%80%94%20Color%20rows%20%28robust%2C%20multi%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // — CONFIG —
  const TARGET_NAMES = [
    'Feathery Hotels Group',
    'Torn City Investments',
    'Symbiotic Ltd',
    'Performance Ribaldry',
    'West Side University',
  ];
  const HIGHLIGHT_HEX = '#E6C229';

  // — HELPERS —
  const toRgb = (hex) => {
    const m = String(hex).trim().replace('#','');
    const n = m.length === 3 ? m.split('').map(c => c + c).join('') : m;
    const num = parseInt(n, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255].join(', ');
  };
  const norm = (s) => (s || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[\u00A0\s]+/g, ' ')
    .replace(/[.,/\\|_*~^`'":;?!]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const TARGET_SET = new Set(TARGET_NAMES.map(norm));

  // — STYLES — (doar pe <ul> = rândul întreg)
  const style = document.createElement('style');
  style.textContent = `
  ul[role="tablist"][data-tse-accent]{
    position: relative;
    border-radius: 12px;
    overflow: hidden; /* ca să taie colțurile */
    /* contur pe tot rândul, în interior */
    outline: 2px solid var(--tse-accent, ${HIGHLIGHT_HEX});
    outline-offset: -2px;
  }
  /* film de culoare foarte ușor peste întreg rândul */
  ul[role="tablist"][data-tse-accent]::before{
    content:"";
    position:absolute; inset:0; border-radius:12px;
    background: rgba(var(--tse-accent-rgb, 230,194,41), .10);
    pointer-events:none;
  }
  /* nu colorăm/conturăm celula de preț ca să evităm dublura */
  li[role="tab"][data-name="priceTab"]{
    box-shadow: none !important;
    outline: none !important;
  }
  `;
  document.documentElement.appendChild(style);

  function getStockNameFromNameTab(nameLi){
    if (!nameLi) return '';
    const aria = nameLi.getAttribute('aria-label') || '';
    const m = aria.match(/^Stock:\s*(.+)$/i);
    if (m && m[1]) return m[1].trim();
    const preferred = nameLi.querySelector('.tt-acronym-container') || nameLi;
    return (preferred.textContent || '').replace(/\([^)]+\)/g,'').trim();
  }

  function highlightRow(rowUl, hex){
    if (!rowUl) return;
    if (!rowUl.hasAttribute('data-tse-accent')) {
      rowUl.setAttribute('data-tse-accent','1');
    }
    rowUl.style.setProperty('--tse-accent', hex);
    rowUl.style.setProperty('--tse-accent-rgb', toRgb(hex));
  }

  function process(container=document){
    const nameTabs = container.querySelectorAll('li[role="tab"][data-name="nameTab"]');
    nameTabs.forEach((nameLi)=>{
      const pretty = getStockNameFromNameTab(nameLi);
      if (!pretty) return;
      if (!TARGET_SET.has(norm(pretty))) return;
      const row = nameLi.closest('ul[role="tablist"]');
      if (row) highlightRow(row, HIGHLIGHT_HEX);
    });
  }

  // run
  process();
  setTimeout(process, 600);
  setTimeout(process, 1500);
  setTimeout(process, 4000);

  const obs = new MutationObserver(()=>process());
  obs.observe(document.body, {childList:true, subtree:true});

  // util
  window.tseReapply = () => process();
})();
