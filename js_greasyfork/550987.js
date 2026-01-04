// ==UserScript==
// @name         Torn – Auto-open final BUY row
// @namespace    https://torn.tools/
// @version      1.1
// @description  On page load open final BUY item for a specific item (ex: Zip Ties)
// @author       SuperGogu
// @match        https://www.torn.com/index.php*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550987/Torn%20%E2%80%93%20Auto-open%20final%20BUY%20row.user.js
// @updateURL https://update.greasyfork.org/scripts/550987/Torn%20%E2%80%93%20Auto-open%20final%20BUY%20row.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*** CONFIG ***/
  // Poți seta după nume sau/și după ID-ul inputului de amount (ex: item-1429 pentru Zip Ties)
  const TARGET_NAMES = ['Zip Ties']; // nume exacte, case-sensitive în DOM (de obicei cu litere mari pe cuvinte)
  const TARGET_INPUT_IDS = ['item-1429']; // dacă știi ID-ul (Zip Ties: 1429). Lasă gol [] dacă vrei doar pe nume.


  // cât așteptăm după click pe Buy până apare rândul de confirmare
  const WAIT_MS = 6000;

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
  }

  function findTargetRow() {
    // 1) caută după ID input amount (mai sigur)
    for (const id of TARGET_INPUT_IDS) {
      const input = document.getElementById(id);
      if (input) return input.closest('.item-info-wrap');
    }
    // 2) altfel, caută după nume
    const rows = document.querySelectorAll('.item-info-wrap');
    for (const row of rows) {
      const nameEl = row.querySelector('.name');
      if (!nameEl) continue;
      const nameText = nameEl.textContent.trim();
      if (TARGET_NAMES.some(n => nameText.includes(n))) return row;
    }
    return null;
  }

  async function openConfirmRow(row) {
    if (!row) return;

    // dacă confirmarea e deja prezentă și vizibilă, doar focalizează butonul
    let confirm = row.querySelector('.confirm-buy');
    if (!confirm || !isVisible(confirm)) {
      // click pe Buy din rândul principal
      const buyLink = row.querySelector('a.buy');
      if (!buyLink) return;
      buyLink.click();

      // așteaptă să apară .confirm-buy
      const start = performance.now();
      while (performance.now() - start < WAIT_MS) {
        confirm = row.querySelector('.confirm-buy');
        if (confirm && isVisible(confirm)) break;
        await sleep(50);
      }
    }

    if (confirm && isVisible(confirm)) {
      // opțional: copiază cantitatea din câmpul de pe rândul principal
      const mainAmt = row.querySelector('.deal input.numb');
      const confirmAmt = confirm.querySelector('.amount-confirm input.numb');
      if (mainAmt && confirmAmt) {
        confirmAmt.value = mainAmt.value;
        confirmAmt.dispatchEvent(new Event('input', { bubbles: true }));
        confirmAmt.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // adu în față și evidențiază butonul final BUY
      const finalBtn = confirm.querySelector('.torn-btn, .travel-buttons button, .travel-buttons .btn');
      if (finalBtn) {
        finalBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        finalBtn.style.boxShadow = '0 0 0 3px rgba(255,200,0,.9)';
        setTimeout(() => (finalBtn.style.boxShadow = ''), 1200);
      }
    }
  }

  let triedOnceOnThisUrl = false;
  let lastUrl = location.href;

  async function tryOpen() {
    // previne spam-ul pe aceeași pagină
    if (triedOnceOnThisUrl) return;
    const row = findTargetRow();
    if (row) {
      triedOnceOnThisUrl = true;
      openConfirmRow(row);
    }
  }

  // observă schimbările de conținut (Torn e SPA, multe pagini se schimbă dinamic)
  const observer = new MutationObserver(() => {
    // dacă s-a schimbat URL-ul (navigare internă), reîncearcă o singură dată
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      triedOnceOnThisUrl = false;
    }
    // încearcă să deschidă când apare rândul țintă
    tryOpen();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  // încearcă și imediat după încărcare
  tryOpen();

})();
