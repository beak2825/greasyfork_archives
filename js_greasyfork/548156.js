// ==UserScript==
// @name         BitLabs Survey Hourly Calculator and Sorter (CashInStyle)
// @namespace    https://bitlabs.ai/
// @author       DevDad
// @version      0.2
// @description  Adds a button to calculate true dollar amount and hourly rate for BitLabs surveys, then sorts them by highest hourly.
// @match        https://web.bitlabs.ai/surveys*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548156/BitLabs%20Survey%20Hourly%20Calculator%20and%20Sorter%20%28CashInStyle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548156/BitLabs%20Survey%20Hourly%20Calculator%20and%20Sorter%20%28CashInStyle%29.meta.js
// ==/UserScript==

(() => {
  /* ───────────────────────── 1.  Add the button ──────────────────────── */
  function injectButton() {
    if (document.getElementById('bl-calc-btn')) return;

    const btn = Object.assign(document.createElement('button'), {
      id: 'bl-calc-btn',
      textContent: 'Calculate',
    });

    Object.assign(btn.style, {
      position: 'fixed',
      top: '12px',
      right: '12px',
      zIndex: 10_000,
      background: '#0d6efd',
      color: '#fff',
      padding: '8px 14px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      cursor: 'pointer',
    });

    btn.addEventListener('click', handleCalculate);
    document.body.appendChild(btn);
  }

  /* ───────────────────────── 2.  Core logic ─────────────────────────── */
  function handleCalculate() {
    const grid =
      document.querySelector('.survey-offerwall .grid') ||
      document.querySelector('#app div.survey-offerwall div.grid');

    if (!grid) {
      alert('Survey grid not found.');
      return;
    }

    const tiles = Array.from(grid.children);
    const parsed = [];

    tiles.forEach((tile) => {
      let hourly;

      /* ---------- Already processed? ---------- */
      if (tile.dataset.processed === 'yes') {
        hourly = parseFloat(tile.dataset.hourly) || 0;
        parsed.push({ tile, hourly });
        return;
      }

      /* ---------- Extract & convert points ---------- */
      const valueNode = tile.querySelector('[data-testid="survey-tile-value"]');
      if (!valueNode) return;

      let raw = valueNode.textContent.trim();
      let dollars;

      if (raw.includes('$')) {
        // Already in $ format (tile added after previous run)
        dollars = parseFloat(raw.replace(/[^0-9.]/g, ''));
      } else {
        const pts = parseFloat(raw.replace(/points/gi, '').replace(/[^0-9.]/g, ''));
        if (isNaN(pts)) return;
        dollars = pts / 100;               // 1 pt = $0.01
        const span = valueNode.querySelector('span:last-child');
        if (span) span.textContent = `$${dollars.toFixed(2)}`;
      }

      /* ---------- Extract minutes ---------- */
      const minutesNode = tile
        .querySelector('.fa-clock')
        ?.parentElement?.querySelector('div');
      if (!minutesNode) return;

      const mMatch = minutesNode.textContent.match(/(\d+(?:\.\d+)?)/);
      if (!mMatch) return;

      const minutes = parseFloat(mMatch[1]);
      if (!minutes) return;

      /* ---------- Compute rates ---------- */
      const dollarsPerMinute = dollars / minutes;
      hourly = dollarsPerMinute * 60;

      /* ---------- Show badge ---------- */
      let badge = tile.querySelector('.rate-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'rate-badge';
        Object.assign(badge.style, {
          position: 'absolute',
          top: '6px',
          right: '6px',
          background: 'rgba(0,0,0,0.75)',
          color: '#fff',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600',
        });
        tile.style.position = 'relative';
        tile.appendChild(badge);
      }
      badge.textContent = `$${hourly.toFixed(2)}/hr`;

      /* ---------- Flag as processed ---------- */
      tile.dataset.processed = 'yes';
      tile.dataset.hourly = hourly.toFixed(4);

      parsed.push({ tile, hourly });
    });

    /* ---------- Sort tiles ---------- */
    parsed
      .sort((a, b) => b.hourly - a.hourly)
      .forEach(({ tile }) => grid.appendChild(tile));
  }

  /* ──────────────────────── 3.  Observe SPA changes ─────────────────── */
  const observer = new MutationObserver(() => {
    if (document.querySelector('.survey-offerwall .grid')) injectButton();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
