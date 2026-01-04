// ==UserScript==
// @name         Grepolis Admin – Player Counter (Offset + Total Pages)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Tel spelers over ALLE pagina's met voortgang: pagina X van Y
// @match        https://*/admin/action_log*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560784/Grepolis%20Admin%20%E2%80%93%20Player%20Counter%20%28Offset%20%2B%20Total%20Pages%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560784/Grepolis%20Admin%20%E2%80%93%20Player%20Counter%20%28Offset%20%2B%20Total%20Pages%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PLAYER_LINK_SELECTOR = 'a[href*="player_tool"][href*="player_id="]';
  const PAGE_SIZE = 200;
  const DELAY_MS = 200;

  let stopRequested = false;
  let sortedResults = [];
  let totalPages = null;

  /**********************
   * UI – START BUTTON
   **********************/
  const startBtn = document.createElement('button');
  startBtn.textContent = 'Tel spelers';
  Object.assign(startBtn.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '9999',
    padding: '10px 15px',
    background: '#2c7be5',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  });
  document.body.appendChild(startBtn);

  /**********************
   * UI – SIDE PANEL
   **********************/
  const panel = document.createElement('div');
  Object.assign(panel.style, {
    position: 'fixed',
    top: '0',
    right: '0',
    width: '420px',
    height: '100%',
    background: '#fff',
    borderLeft: '1px solid #ccc',
    boxShadow: '-2px 0 6px rgba(0,0,0,0.15)',
    zIndex: '10000',
    display: 'none',
    flexDirection: 'column',
    fontFamily: 'sans-serif'
  });

  panel.innerHTML = `
    <div style="padding:12px;border-bottom:1px solid #ddd;display:flex;justify-content:space-between;align-items:center">
      <strong>Spelers overzicht</strong>
      <span id="pc_close" style="cursor:pointer;font-size:18px">✕</span>
    </div>

    <div style="padding:10px;display:flex;gap:10px;align-items:center">
      <span>Toon:</span>
      <select id="pc_limit">
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="999999">Alles</option>
      </select>

      <button id="pc_stop" style="
        margin-left:auto;
        background:#dc3545;
        color:#fff;
        border:none;
        border-radius:4px;
        padding:5px 10px;
        cursor:pointer;
      ">STOP</button>
    </div>

    <div id="pc_status" style="padding:8px 10px;font-size:12px;color:#555;border-bottom:1px solid #eee"></div>
    <div id="pc_results" style="flex:1;overflow-y:auto;padding:10px"></div>
  `;
  document.body.appendChild(panel);

  document.getElementById('pc_close').onclick = () => panel.style.display = 'none';
  document.getElementById('pc_limit').onchange = () => renderResults();
  document.getElementById('pc_stop').onclick = () => stopRequested = true;

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function setStatus(page, offset, unique) {
    const total = totalPages ? ` van ${totalPages}` : '';
    document.getElementById('pc_status').textContent =
      `Pagina ${page}${total} (offset ${offset}) – unieke spelers: ${unique}`;
  }

  function escapeHtml(str) {
    return str
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function detectTotalPages() {
    const links = [...document.querySelectorAll('a.paginator_bg[href*="offset="]')];
    if (!links.length) return null;

    const last = links[links.length - 1];
    const url = new URL(last.href);
    const offset = parseInt(url.searchParams.get('offset'), 10);

    return Math.floor(offset / PAGE_SIZE) + 1;
  }

  /**********************
   * CORE
   **********************/
  startBtn.onclick = async () => {
    startBtn.disabled = true;
    startBtn.textContent = 'Bezig…';
    stopRequested = false;
    panel.style.display = 'flex';

    totalPages = detectTotalPages();

    const counts = {};
    const linksByName = {};

    // Pagina 1 (DOM)
    document.querySelectorAll(PLAYER_LINK_SELECTOR).forEach(a => {
      const name = a.textContent.trim();
      if (!name) return;
      counts[name] = (counts[name] || 0) + 1;
      linksByName[name] = a.href;
    });

    let pageIndex = 1;
    setStatus(pageIndex, 0, Object.keys(counts).length);

    const firstPaginator = document.querySelector('a.paginator_bg[href*="offset="]');
    if (!firstPaginator) {
      finish(counts, linksByName);
      return;
    }

    const baseUrl = new URL(firstPaginator.href);
    let offset = parseInt(baseUrl.searchParams.get('offset'), 10);

    while (!stopRequested) {
      baseUrl.searchParams.set('offset', offset);

      const html = await fetch(baseUrl.toString(), { credentials: 'same-origin' }).then(r => r.text());
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const players = doc.querySelectorAll(PLAYER_LINK_SELECTOR);

      if (players.length === 0) break;

      players.forEach(a => {
        const name = a.textContent.trim();
        if (!name) return;
        counts[name] = (counts[name] || 0) + 1;
        linksByName[name] = a.href;
      });

      pageIndex++;
      setStatus(pageIndex, offset, Object.keys(counts).length);

      offset += PAGE_SIZE;
      await sleep(DELAY_MS);
    }

    finish(counts, linksByName);
  };

  function finish(counts, links) {
    sortedResults = Object.entries(counts)
      .map(([name, count]) => ({ name, count, href: links[name] }))
      .sort((a, b) => b.count - a.count);

    renderResults();
    startBtn.textContent = 'Klaar';
  }

  function renderResults() {
    const limit = parseInt(document.getElementById('pc_limit').value, 10);
    const c = document.getElementById('pc_results');
    c.innerHTML = '';

    sortedResults.slice(0, limit).forEach(p => {
      const row = document.createElement('div');
      row.style.padding = '4px 0';
      row.innerHTML = `
        <a href="${p.href}" target="_blank">${escapeHtml(p.name)}</a>
        <span style="float:right">${p.count}</span>
      `;
      c.appendChild(row);
    });
  }
})();