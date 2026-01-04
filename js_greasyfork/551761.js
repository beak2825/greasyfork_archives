// ==UserScript==
// @name         TORN Mug Assist
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  TORN Mug Assistant - Watches the item market for changes and create links to attack the seller.
// @author       SuperGogu
// @match        https://www.torn.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551761/TORN%20Mug%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/551761/TORN%20Mug%20Assist.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Storage keys (localStorage for API key & item, GM_* for panel position/visibility)
  const LS = {
    api: 'tma_api_key',
    item: 'tma_item_id',
  };
  const K = {
    x: 'tma_panel_x',
    y: 'tma_panel_y',
    visible: 'tma_panel_visible'
  };

  // ——— Panel style (rounded + white border) ———
  GM_addStyle(`
    #tma-panel {
      position: fixed;
      top: 120px;
      left: 120px;
      width: 420px;
      max-width: 85vw;
      min-height: 180px;
      background: #1f2330;
      color: #e9ecf1;
      border-radius: 16px;
      border: 3px solid #fff;
      box-shadow:
        0 10px 28px rgba(0,0,0,.65),
        inset 0 -2px 0 rgba(255,255,255,.06),
        inset 0 0 0 1px rgba(255,255,255,.10);
      z-index: 999999;
      display: none;
      user-select: none;
      -webkit-font-smoothing: antialiased;
      font-family: Inter, system-ui, Segoe UI, Roboto, Arial, sans-serif;
    }
    #tma-panel .tma-header {
      height: 34px;
      cursor: move;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 8px;
      background: transparent;
    }
    #tma-panel .tma-close {
      width: 26px;
      height: 26px;
      line-height: 24px;
      text-align: center;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,.25);
      background: rgba(255,255,255,.06);
      color: #fff;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      user-select: none;
    }
    #tma-panel .tma-close:hover { background: rgba(255,255,255,.14); }
    #tma-panel .tma-body {
      padding: 12px;
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
      user-select: text;
      cursor: default;
    }
    #tma-panel a { color: #b7d7ff; }

    /* Inputs / buttons */
    #tma-panel .row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
    #tma-panel label { font-size: 12px; opacity: .9; min-width: 62px; }
    #tma-panel input[type="text"] {
      flex: 1;
      min-width: 0;
      padding: 6px 8px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,.22);
      background: rgba(0,0,0,.25);
      color: #e9ecf1;
      outline: none;
    }
    #tma-panel input[type="text"]::placeholder { color: #9aa3b2; }
    #tma-panel button {
      padding: 6px 10px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,.25);
      background: rgba(255,255,255,.08);
      color: #fff;
      font-weight: 600;
      cursor: pointer;
    }
    #tma-panel button:hover { background: rgba(255,255,255,.16); }

    /* Results table */
    #tma-results {
      margin-top: 6px;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 10px;
      overflow: hidden;
      font-size: 12px;
    }
    #tma-results .tma-row { display: grid; grid-template-columns: 1fr 120px 70px; gap: 8px; padding: 6px 8px; }
    #tma-results .tma-row:nth-child(odd) { background: rgba(255,255,255,.04); }
    #tma-results .tma-row.head { font-weight: 700; background: rgba(255,255,255,.08); }
    #tma-status { margin-top: 6px; font-size: 11px; opacity: .8; }
    #tma-error { margin-top: 6px; color: #ff9e9e; font-size: 12px; }

    /* GOLD "M" toggle (17x17, no sprites) */
    li#tma-toggle { list-style: none; margin-left: 4px; }
    li#tma-toggle a {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      border: 2px solid #d4af37;
      color: #d4af37;
      font-weight: 900;
      font-size: 10px;
      line-height: 1;
      text-decoration: none !important;
      outline: none;
      background: transparent !important;
      background-image: none !important;
      cursor: pointer;
    }
    li#tma-toggle a::before,
    li#tma-toggle a::after { content: none !important; background: none !important; }
    li#tma-toggle a:hover, li#tma-toggle a:focus { background: rgba(212,175,55,0.15) !important; }
  `);

  let panel, header, closeBtn, body;
  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  // Watch state
  let intervalId = null;

  function createPanel() {
    if (panel) return panel;

    panel = document.createElement('div');
    panel.id = 'tma-panel';

    header = document.createElement('div');
    header.className = 'tma-header';

    closeBtn = document.createElement('div');
    closeBtn.className = 'tma-close';
    closeBtn.title = 'Close panel';
    closeBtn.textContent = '×';

    header.appendChild(closeBtn);

    body = document.createElement('div');
    body.className = 'tma-body';
    body.innerHTML = `
      <div class="row">
        <label for="tma-api">API Key</label>
        <input id="tma-api" type="text" placeholder="Your TORN API key" />
        <button id="tma-save">Save</button>
      </div>
      <div class="row">
        <label for="tma-item">Item ID</label>
        <input id="tma-item" type="text" placeholder="e.g. 283" />
        <button id="tma-watch">Watch</button>
      </div>
      <div id="tma-status"></div>
      <div id="tma-error"></div>
      <div id="tma-results">
        <div class="tma-row head"><div>Item</div><div>Price</div><div>Amount</div></div>
      </div>
    `;

    panel.appendChild(header);
    panel.appendChild(body);
    document.body.appendChild(panel);

    // Restore position
    const sx = Number(GM_getValue(K.x, NaN));
    const sy = Number(GM_getValue(K.y, NaN));
    if (!Number.isNaN(sx) && !Number.isNaN(sy)) {
      panel.style.left = sx + 'px';
      panel.style.top  = sy + 'px';
      clampToViewport();
    }

    // Load saved API key & item id
    const apiInput = document.getElementById('tma-api');
    const itemInput = document.getElementById('tma-item');
    apiInput.value = localStorage.getItem(LS.api) || '';
    itemInput.value = localStorage.getItem(LS.item) || '';

    // Handlers
    header.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', endDrag);
    window.addEventListener('resize', clampToViewport);
    closeBtn.addEventListener('click', hidePanel);

    document.getElementById('tma-save').addEventListener('click', () => {
      localStorage.setItem(LS.api, apiInput.value.trim());
      setStatus('API key saved.');
      clearError();
    });

    const watchBtn = document.getElementById('tma-watch');
    watchBtn.addEventListener('click', () => {
      if (intervalId) stopWatching();
      else startWatching();
    });

    // If item saved, allow Enter to toggle
    itemInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (intervalId) stopWatching(); else startWatching();
      }
    });

    return panel;
  }

  function setStatus(txt) {
    const el = document.getElementById('tma-status');
    if (el) el.textContent = txt || '';
  }
  function setError(txt) {
    const el = document.getElementById('tma-error');
    if (el) el.textContent = txt || '';
  }
  function clearError() { setError(''); }

  function renderListings(json) {
    const box = document.getElementById('tma-results');
    if (!box) return;

    // Remove old rows (keep header)
    box.querySelectorAll('.tma-row:not(.head)').forEach(n => n.remove());

    const itemName = json?.itemmarket?.item?.name ?? 'Unknown';
    const listings = json?.itemmarket?.listings ?? [];

    listings.slice(0, 5).forEach(l => {
      const row = document.createElement('div');
      row.className = 'tma-row';
      const price = Number(l.price || 0).toLocaleString('en-US');
      const amt = String(l.amount ?? '');
      row.innerHTML = `<div>${itemName}</div><div>${price}</div><div>${amt}</div>`;
      box.appendChild(row);
    });

    if (!listings.length) {
      const row = document.createElement('div');
      row.className = 'tma-row';
      row.innerHTML = `<div>${itemName}</div><div>—</div><div>—</div>`;
      box.appendChild(row);
    }
  }

  // NOTE: Using window.fetch to avoid changing the userscript header (as requested).
  // If CORS blocks these requests, we can switch to GM_xmlhttpRequest later (that would require header changes).
  async function fetchListings(itemId, apiKey) {
    const url = `https://api.torn.com/v2/market/${encodeURIComponent(itemId)}/itemmarket?limit=5&offset=0&comment=mug-assist&key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, { headers: { 'accept': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  function startWatching() {
    const apiKey = (document.getElementById('tma-api').value || '').trim();
    const itemId = (document.getElementById('tma-item').value || '').trim();
    if (!apiKey) { setError('Missing API key.'); return; }
    if (!itemId) { setError('Missing Item ID.'); return; }
    clearError();

    localStorage.setItem(LS.api, apiKey);
    localStorage.setItem(LS.item, itemId);

    const btn = document.getElementById('tma-watch');
    if (btn) btn.textContent = 'Stop';

    setStatus(`Watching item ${itemId}…`);

    // Immediate fetch, then every 1s
    const tick = async () => {
      try {
        const data = await fetchListings(itemId, apiKey);
        renderListings(data);
        clearError();
      } catch (e) {
        setError(`Failed to fetch: ${e.message || e}`);
      }
    };
    tick();
    intervalId = setInterval(tick, 1000);
  }

  function stopWatching() {
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
    const btn = document.getElementById('tma-watch');
    if (btn) btn.textContent = 'Watch';
    setStatus('Stopped.');
  }

  function startDrag(e) {
    if (!panel) return;
    isDragging = true;
    const r = panel.getBoundingClientRect();
    offsetX = e.clientX - r.left;
    offsetY = e.clientY - r.top;
    e.preventDefault();
  }
  function onDrag(e) {
    if (!isDragging || !panel) return;
    panel.style.left = (e.clientX - offsetX) + 'px';
    panel.style.top  = (e.clientY - offsetY) + 'px';
  }
  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    clampToViewport(); // save
  }
  function clampToViewport() {
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    const maxL = Math.max(0, window.innerWidth - rect.width);
    const maxT = Math.max(0, window.innerHeight - rect.height);
    let l = parseFloat(panel.style.left || '120');
    let t = parseFloat(panel.style.top  || '120');
    if (Number.isNaN(l)) l = 120;
    if (Number.isNaN(t)) t = 120;
    l = Math.min(Math.max(0, l), maxL);
    t = Math.min(Math.max(0, t), maxT);
    panel.style.left = l + 'px';
    panel.style.top  = t + 'px';
    GM_setValue(K.x, l);
    GM_setValue(K.y, t);
  }

  function showPanel() {
    createPanel();
    panel.style.display = 'block';
    GM_setValue(K.visible, true);
  }
  function hidePanel() {
    if (!panel) return;
    panel.style.display = 'none';
    GM_setValue(K.visible, false);
  }
  function togglePanel() {
    if (!panel || panel.style.display === 'none') showPanel();
    else hidePanel();
  }

  // GM Menu: Show only
  GM_registerMenuCommand('Show Mug Panel', showPanel);

  // GOLD "M" toggle icon injection
  function injectToggleIcon(root) {
    if (!root || document.getElementById('tma-toggle')) return;
    const ul =
      root.querySelector('ul[class*="status-icons"]') ||
      document.querySelector('ul[class*="status-icons"]');
    if (!ul) return;

    const li = document.createElement('li');
    li.id = 'tma-toggle';
    const a = document.createElement('a');
    a.href = '#';
    a.setAttribute('aria-label', 'Mug Assist Panel');
    a.setAttribute('tabindex', '0');
    a.textContent = 'M';
    a.addEventListener('click', (e) => { e.preventDefault(); togglePanel(); });
    a.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePanel(); }
    });

    li.appendChild(a);
    ul.appendChild(li);
  }

  const obs = new MutationObserver((muts) => {
  for (const m of muts) {
    if (m.type === 'childList') {
      m.addedNodes.forEach((n) => {
        if (n.nodeType === 1) injectToggleIcon(n);
      });
    }
  }
  // also try once on the whole document
  injectToggleIcon(document);
}); // <-- close MutationObserver callback

obs.observe(document.documentElement, { childList: true, subtree: true });

// Fallback: in case the MO misses the bar (dynamic loads)
let tries = 0;
const togglePoll = setInterval(() => {
  injectToggleIcon(document);
  if (document.getElementById('tma-toggle') || ++tries > 50) {
    clearInterval(togglePoll);
  }
}, 250);

// Auto-show panel if last state was visible
if (GM_getValue(K.visible, false)) {
  showPanel();
}
})();

