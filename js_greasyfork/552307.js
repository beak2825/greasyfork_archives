// ==UserScript==
// @name        FMP Working Player Info
// @version     4.7
// @description Instantly display all 14 position ratings (2 columns) and weekly training results under the player name
// @match       https://footballmanagerproject.com/Team/Player*
// @match       https://footballmanagerproject.com/Team/Training*
// @grant       none
// @namespace https://greasyfork.org/users/1024463
// @downloadURL https://update.greasyfork.org/scripts/552307/FMP%20Working%20Player%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/552307/FMP%20Working%20Player%20Info.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Cache training data when on the Training page
  if (location.pathname.startsWith('/Team/Training')) {
    setTimeout(cacheTrainingData, 1500);
  }

  // On Player page, render ratings and training
  if (location.pathname.startsWith('/Team/Player')) {
    setTimeout(renderPlayerEnhancements, 800);
  }

  function renderPlayerEnhancements() {
    renderPositionRatings();
    renderTrainingResults();
  }

  // — Extract and display the 14 ratings from window.player.info.allRatings —
  function renderPositionRatings() {
    const info = window.player?.info?.allRatings;
    const box = makeBox('📊 Position Ratings');
    const container = document.createElement('div');
    container.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 8px;
    `;

    if (info) {
      ['GK','DC','DL','DR','DMC','DML','DMR','MC','ML','MR','OMC','OML','OMR','FC'].forEach(pos => {
        const rating = (info[pos] / 10).toFixed(1);
        const color = getColor(rating);
        const item = document.createElement('div');
        item.style.cssText = `
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px; background: #2a2a2a; border-radius: 6px; border:1px solid #444;
        `;
        item.innerHTML = `
          <span style="color:#fff;font-weight:bold">${pos}</span>
          <span style="color:${color};font-weight:bold">${rating}</span>
        `;
        container.appendChild(item);
      });
    } else {
      const msg = document.createElement('div');
      msg.style.cssText = 'color:#ff6666;text-align:center;padding:20px';
      msg.textContent = 'Position ratings unavailable';
      container.appendChild(msg);
    }

    box.appendChild(container);
    insertBox(box);
  }

  // — Render cached training results —
  function renderTrainingResults() {
    const pid = location.search.match(/id=(\d+)/)?.[1];
    if (!pid) return;

    const raw = localStorage.getItem('fmp_training');
    const data = raw && JSON.parse(raw)[pid];
    const box = makeBox('🏃‍♂️ Weekly Training Results');

    const content = document.createElement('div');
    content.style.cssText = 'padding:12px; background:#2a2a2a; border-radius:6px;';

    if (data) {
      content.innerHTML = `
        <div style="display:flex;justify-content:space-around;margin-bottom:8px">
          <div style="text-align:center"><b style="color:#0f0">${data.intensity}</b><br><small>Intensity</small></div>
          <div style="text-align:center"><b style="color:#7f0">${data.gi}</b><br><small>GI</small></div>
          <div style="text-align:center"><b style="color:#fa0">${data.isGK?'GK':'OUT'}</b><br><small>Type</small></div>
        </div>
        <div style="text-align:center;color:#888;font-size:11px">Cached: ${new Date(data.ts).toLocaleTimeString()}</div>
      `;
    } else {
      content.innerHTML = `
        <div style="text-align:center;color:#ccc;padding:20px">
          No training data<br>
          <a href="/Team/Training" style="color:#4CAF50">Cache here</a>
        </div>
      `;
    }

    box.appendChild(content);
    insertBox(box);
  }

  // — Cache training data from the Training page —
  function cacheTrainingData() {
    const table = {};
    document.querySelectorAll('tr').forEach(row => {
      const a = row.querySelector('a[href*="Player?id="]');
      if (!a) return;
      const id = a.href.match(/id=(\d+)/)[1];
      const cells = row.querySelectorAll('td');
      const gi = parseInt(cells[5]?.textContent) || 0;
      const intensity = row.textContent.includes('110%')?'110%':'100%';
      const isGK = cells[4]?.textContent.includes('GK');
      if (gi > 0) table[id] = { gi, intensity, isGK, ts: Date.now() };
    });
    localStorage.setItem('fmp_training', JSON.stringify(table));
    notify(`Cached training for ${Object.keys(table).length} players`);
  }

  // — Helper to create a styled box with title —
  function makeBox(title) {
    const box = document.createElement('div');
    box.className = 'fmpx board box';
    box.style.margin = '10px 0';
    box.innerHTML = `<div class="title"><div class="main">${title}</div></div>`;
    return box;
  }

  // — Insert under player name —
  function insertBox(box) {
    const target = document.querySelector('h1')?.parentNode || document.body;
    target.appendChild(box);
  }

  // — Rating color scale —
  function getColor(r) {
    const x = parseFloat(r);
    if (x >= 18) return '#00ff00';
    if (x >= 15) return '#7fff00';
    if (x >= 12) return '#ffff00';
    if (x >= 9) return '#ff7f00';
    if (x >= 6) return '#ff4500';
    return '#ff0000';
  }

  function notify(msg) {
    const n = document.createElement('div');
    n.style.cssText = `
      position:fixed;top:20px;right:20px;background:#4CAF50;color:#fff;
      padding:8px 16px;border-radius:6px;z-index:9999`;
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
  }
})();
