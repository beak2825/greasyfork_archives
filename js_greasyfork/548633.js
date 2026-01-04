// ==UserScript==
// @name         Neopets Lottery Quickpick
// @namespace    neopets
// @version      1.3
// @description  Adds a "Quickpick 20 tickets!" button that only buys as many as needed to reach 20 (with slight delay), plus a "Quickpick (fill only)" button.
// @match        https://www.neopets.com/games/lottery.phtml*
// @match        http://www.neopets.com/games/lottery.phtml*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548633/Neopets%20Lottery%20Quickpick.user.js
// @updateURL https://update.greasyfork.org/scripts/548633/Neopets%20Lottery%20Quickpick.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---- Config ----
  const MIN_DELAY_SEC = 6;
  const MAX_DELAY_SEC = 10;
  const DAILY_CAP = 20; // site limit per day

  const K = {
    ACTIVE: 'neo_lotto_active',
    RUNS: 'neo_lotto_runs',    // how many we've bought in the current batch
    TODO:  'neo_lotto_todo',   // how many we intend to buy in total this batch
    GUARD: 'neo_lotto_guard',
  };

  if (window[K.GUARD]) return;
  window[K.GUARD] = true;

  // ---- Helpers ----
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  function generateTicket() {
    const s = new Set();
    while (s.size < 6) s.add(randInt(1, 30));
    return [...s].sort((a, b) => a - b);
  }

  function toast(msg, ms = 2600) {
    const el = document.createElement('div');
    el.textContent = msg;
    Object.assign(el.style, {
      position: 'fixed', bottom: '12px', right: '12px',
      padding: '8px 10px', background: 'rgba(0,0,0,.8)', color: '#fff',
      font: '12px/1.35 monospace', borderRadius: '6px', zIndex: 2147483647,
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), ms);
  }

  function findForm() {
    const one = document.querySelector('input[name="one"]');
    return one ? one.closest('form') : null;
  }

  function fillNumbers(nums, form) {
    const fields = ['one','two','three','four','five','six'];
    fields.forEach((name, i) => {
      const el = form.querySelector(`input[name="${name}"]`);
      if (el) el.value = String(nums[i]);
    });
  }

  function submitForm(form) {
    const btn =
      form.querySelector('input[type="submit"][value*="Buy a Lottery Ticket"]') ||
      form.querySelector('input[type="submit"]') ||
      form.querySelector('button[type="submit"]');
    (btn && btn.click()) || form.submit();
  }

  // Count how many tickets are already listed for the next draw
  function countOwnedTickets() {
    // Count occurrences like: "Ticket 1 :" (body text is most robust across markup changes)
    const text = document.body?.innerText || '';
    const matches = text.match(/Ticket\s+\d+\s*:/g);
    return (matches ? matches.length : 0);
  }

  function scheduleOne(form, nextRunIndex, todoTotal) {
    const remaining = Math.max(0, todoTotal - (nextRunIndex - 1));
    if (remaining <= 0) {
      GM_setValue(K.ACTIVE, false);
      return;
    }

    const delaySec = randInt(MIN_DELAY_SEC, MAX_DELAY_SEC);
    toast(`Quickpick #${nextRunIndex}/${todoTotal} in ${delaySec}s…`);

    setTimeout(() => {
      const nums = generateTicket();
      fillNumbers(nums, form);

      // Persist progress BEFORE navigating
      GM_setValue(K.RUNS, nextRunIndex);

      // Stop after hitting our intended count
      if (nextRunIndex >= todoTotal) GM_setValue(K.ACTIVE, false);

      submitForm(form);
    }, delaySec * 1000);
  }

  function injectButtons(form) {
    if (document.getElementById('neo-quickpick20')) return;

    // Find submit button to place our main button beside it
    const submitBtn =
      form.querySelector('input[type="submit"][value*="Buy a Lottery Ticket"]') ||
      form.querySelector('input[type="submit"]') ||
      form.querySelector('button[type="submit"]');

    // --- Quickpick to 20 (auto-buy as needed) ---
    const qp = document.createElement('button');
    qp.type = 'button';
    qp.id = 'neo-quickpick20';
    qp.textContent = 'Quickpick 20 tickets!';
    qp.style.marginLeft = '8px';
    qp.style.padding = '3px 8px';
    qp.style.cursor = 'pointer';

    (submitBtn && submitBtn.parentNode)
      ? submitBtn.parentNode.insertBefore(qp, submitBtn.nextSibling)
      : form.appendChild(qp);

    qp.addEventListener('click', () => {
      const owned = countOwnedTickets();
      const need = Math.max(0, Math.min(DAILY_CAP, DAILY_CAP - owned));

      if (need <= 0) {
        GM_setValue(K.ACTIVE, false);
        GM_setValue(K.RUNS, 0);
        GM_setValue(K.TODO, 0);
        toast('You already have 20 tickets — nothing to buy.');
        return;
      }

      GM_setValue(K.RUNS, 0);
      GM_setValue(K.TODO, need);
      GM_setValue(K.ACTIVE, true);

      toast(`Quickpick started: buying ${need} ticket(s) with 6–10s delays.`);
      const newForm = findForm();
      if (newForm) scheduleOne(newForm, /*nextRunIndex*/ 1, /*todoTotal*/ need);
    });

    // --- Fill-only button BELOW the submit row ---
    const lowerBar = document.createElement('div');
    lowerBar.id = 'neo-quickpick-lowerbar';
    lowerBar.style.marginTop = '8px';

    const fillOnly = document.createElement('button');
    fillOnly.type = 'button';
    fillOnly.id = 'neo-quickpick-fill';
    fillOnly.textContent = 'Quickpick (fill only)';
    fillOnly.style.padding = '3px 8px';
    fillOnly.style.cursor = 'pointer';

    fillOnly.addEventListener('click', () => {
      const nums = generateTicket();
      fillNumbers(nums, form);
      toast(`Filled: ${nums.join(' ')}`);
    });

    lowerBar.appendChild(fillOnly);
    form.appendChild(lowerBar);
  }

  // ---- Wire up page ----
  const form = findForm();
  if (!form) return;

  injectButtons(form);

  // If a batch is in progress, only run up to the intended amount
  const active = !!GM_getValue(K.ACTIVE);
  const runsSoFar = Number(GM_getValue(K.RUNS) || 0);
  const todoTotal = Number(GM_getValue(K.TODO) || 0);

  if (active && runsSoFar < todoTotal) {
    scheduleOne(form, runsSoFar + 1, todoTotal);
  } else if (runsSoFar >= todoTotal) {
    GM_setValue(K.ACTIVE, false);
  }

  // ESC to stop auto-buy batch
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      GM_setValue(K.ACTIVE, false);
      toast('Quickpick stopped.');
    }
  });
})();
