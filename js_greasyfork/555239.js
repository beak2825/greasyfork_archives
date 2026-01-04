// ==UserScript==
// @name         Papanads PF ADV menus (draggable)
// @namespace    https://torn.com/
// @version      8.3
// @description  Plushie/flower helper anywhere. Counts API display + (inventory if available) + items page. Shows market total. Market update button. Shows 3 weakest for next set. Draggable tab launcher, position saved.
// @author       you
// @license      MIT
// @match        https://www.torn.com/*
// @match        https://www.torn.com/page.php*
// @match        https://www.torn.com/item.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/555239/Papanads%20PF%20ADV%20menus%20%28draggable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555239/Papanads%20PF%20ADV%20menus%20%28draggable%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log('[PF] userscript loaded');

  // =========================
  // CONFIG / STORAGE KEYS
  // =========================
  const API_STORAGE_KEY = 'pf_sets_api_key';
  const GOAL_PLUSH_KEY = 'pf_sets_goal_plush';
  const GOAL_FLOWER_KEY = 'pf_sets_goal_flower';
  const CACHE_STORAGE = 'pf_sets_cached_counts';
  const MARKET_CACHE_STORAGE = 'pf_sets_market_cache';
  const POS_X_KEY = 'pf_sets_pos_x';
  const POS_Y_KEY = 'pf_sets_pos_y';
  const REFRESH_MS = 30 * 1000;

  // =========================
  // KNOWN ITEM IDS
  // =========================
  const PLUSHIES = [
    { id: 187, name: 'Teddy Bear' },
    { id: 384, name: 'Camel' },
    { id: 273, name: 'Chamois' },
    { id: 258, name: 'Jaguar' },
    { id: 215, name: 'Kitten' },
    { id: 281, name: 'Lion' },
    { id: 269, name: 'Monkey' },
    { id: 266, name: 'Nessie' },
    { id: 274, name: 'Panda' },
    { id: 268, name: 'Red Fox' },
    { id: 186, name: 'Sheep' },
    { id: 618, name: 'Stingray' },
    { id: 261, name: 'Wolverine' },
  ];
  const FLOWERS = [
    { id: 260, name: 'Dahlia' },
    { id: 264, name: 'Orchid' },
    { id: 282, name: 'African Violet' },
    { id: 277, name: 'Cherry Blossom' },
    { id: 276, name: 'Peony' },
    { id: 271, name: 'Ceibo Flower' },
    { id: 272, name: 'Edelweiss' },
    { id: 263, name: 'Crocus' },
    { id: 267, name: 'Heather' },
    { id: 385, name: 'Tribulus Omanense' },
    { id: 617, name: 'Banana Orchid' },
  ];
  const PLUSH_ID_SET = new Set(PLUSHIES.map(p => p.id));
  const FLOWER_ID_SET = new Set(FLOWERS.map(f => f.id));

  // =========================
  // STATE
  // =========================
  let apiKey = GM_getValue(API_STORAGE_KEY, '') || '';
  let plushCounts = {};
  let flowerCounts = {};
  let lastApiError = '';
  let currentTab = 'plush';
  let panelOpen = false;
  let intervalsStarted = false;
  let marketData = loadMarketCache();
  let launcherEl = null;
  let panelEl = null;

  // =========================
  // INIT
  // =========================
  window.addEventListener('load', () => {
    createUI();
    loadCachedCounts();
    renderCurrent();

    if (!apiKey) {
      const entered = prompt('PF menus: enter your Torn API key (user:display, maybe user:inventory, torn:items for market):', '');
      if (entered) {
        apiKey = entered.trim();
        GM_setValue(API_STORAGE_KEY, apiKey);
      }
    }

    if (apiKey) {
      fetchUserItems();
    } else {
      // still try to read items page
      mergePageInventory(plushCounts, flowerCounts);
      renderCurrent();
    }

    startIntervals();
  });

  // =========================
  // PERIODIC FETCH
  // =========================
  function startIntervals() {
    if (intervalsStarted) return;
    intervalsStarted = true;
    setInterval(() => {
      if (apiKey) fetchUserItems();
      else {
        mergePageInventory(plushCounts, flowerCounts);
        renderCurrent();
      }
    }, REFRESH_MS);
  }

  // =========================
  // API FETCH
  // =========================
  function fetchUserItems() {
    if (!apiKey) return;

    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://api.torn.com/user/?selections=inventory,display&key=' + encodeURIComponent(apiKey),
      timeout: 10000,
      onload: function (res) {
        try {
          const data = JSON.parse(res.responseText);
          if (data.error) {
            lastApiError = `API error ${data.error.code}: ${data.error.error}`;
            renderCurrent();
            return;
          }

          const newPlush = {};
          const newFlower = {};

          // inventory
          const inv = data.inventory;
          if (Array.isArray(inv)) {
            inv.forEach(it => addToBuckets(it, newPlush, newFlower));
          } else if (inv && typeof inv === 'object') {
            Object.values(inv).forEach(it => addToBuckets(it, newPlush, newFlower));
          } else if (typeof inv === 'string') {
            if (inv.trim() === 'The inventory selection is no longer available') {
              lastApiError = 'Torn API: inventory selection is no longer available for this key.';
            } else {
              lastApiError = 'Inventory came back as text: ' + inv;
            }
          }

          // display
          const disp = data.display;
          if (Array.isArray(disp)) {
            disp.forEach(it => addToBuckets(it, newPlush, newFlower));
          } else if (disp && typeof disp === 'object') {
            Object.values(disp).forEach(it => addToBuckets(it, newPlush, newFlower));
          }

          // also merge page items (if on item page)
          mergePageInventory(newPlush, newFlower);

          plushCounts = newPlush;
          flowerCounts = newFlower;

          if (typeof inv !== 'string') {
            lastApiError = '';
          }

          saveCachedCounts();
          renderCurrent();
        } catch (e) {
          lastApiError = 'Could not read API response.';
          renderCurrent();
        }
      },
      onerror: () => {
        lastApiError = 'Request failed.';
        renderCurrent();
      },
      ontimeout: () => {
        lastApiError = 'API request timed out.';
        renderCurrent();
      }
    });
  }

  // =========================
  // MERGE PAGE INVENTORY (ITEMS PAGE)
  // =========================
  function mergePageInventory(plushBucket, flowerBucket) {
    const isItemsPage =
      location.pathname.includes('/item.php') ||
      document.querySelector('.items-cont') ||
      document.querySelector('[class*="inventoryWrapper"]');

    if (!isItemsPage) return;

    const possibleItemNodes = document.querySelectorAll('[data-item], [data-id], li.item, div.item');
    if (!possibleItemNodes.length) return;

    possibleItemNodes.forEach(node => {
      let id = node.getAttribute('data-item') || node.getAttribute('data-id');
      if (!id && node.dataset) {
        id = node.dataset.item || node.dataset.id;
      }
      if (!id) return;
      const numId = Number(id);
      if (!numId) return;

      let qty = 1;
      const qtyNode = node.querySelector('[class*="amount"], .qty, .quantity, [data-amount]');
      if (qtyNode) {
        const txt = qtyNode.textContent || qtyNode.getAttribute('data-amount') || '1';
        const m = txt.match(/\d+/);
        if (m) qty = Number(m[0]);
      }

      if (PLUSH_ID_SET.has(numId)) {
        plushBucket[numId] = (plushBucket[numId] || 0) + qty;
      } else if (FLOWER_ID_SET.has(numId)) {
        flowerBucket[numId] = (flowerBucket[numId] || 0) + qty;
      }
    });
  }

  // =========================
  // MARKET UPDATE
  // =========================
  function updateMarketData() {
    if (!apiKey) {
      lastApiError = 'Set API key first.';
      renderCurrent();
      return;
    }
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://api.torn.com/torn/?selections=items&key=' + encodeURIComponent(apiKey),
      timeout: 10000,
      onload: function (res) {
        try {
          const data = JSON.parse(res.responseText);
          if (data.error) {
            lastApiError = `Market error ${data.error.code}: ${data.error.error}`;
            renderCurrent();
            return;
          }
          const items = data.items || {};
          const newMarket = {};
          const wanted = new Set([...PLUSHIES.map(p => p.id), ...FLOWERS.map(f => f.id)]);
          Object.keys(items).forEach(idStr => {
            const id = Number(idStr);
            if (!wanted.has(id)) return;
            const item = items[idStr];
            newMarket[id] = {
              market_value: item.market_value || 0,
              name: item.name || ''
            };
          });
          marketData = newMarket;
          saveMarketCache();
          lastApiError = '';
          renderCurrent();
        } catch (e) {
          lastApiError = 'Could not read market response.';
          renderCurrent();
        }
      },
      onerror: () => {
        lastApiError = 'Market request failed.';
        renderCurrent();
      },
      ontimeout: () => {
        lastApiError = 'Market request timed out.';
        renderCurrent();
      }
    });
  }

  // =========================
  // HELPERS
  // =========================
  function addToBuckets(it, plushBucket, flowerBucket) {
    if (!it) return;
    const id = Number(it.ID || it.id);
    const qty = Number(it.quantity || it.qty || 1);
    if (!id || !qty) return;
    if (PLUSH_ID_SET.has(id)) {
      plushBucket[id] = (plushBucket[id] || 0) + qty;
    } else if (FLOWER_ID_SET.has(id)) {
      flowerBucket[id] = (flowerBucket[id] || 0) + qty;
    }
  }

  function calcMarketTotal(bucket) {
    let total = 0;
    Object.keys(bucket).forEach(idStr => {
      const id = Number(idStr);
      const qty = bucket[id] || 0;
      const m = marketData[id];
      if (m && m.market_value) {
        total += m.market_value * qty;
      }
    });
    return total;
  }

  // =========================
  // CACHE
  // =========================
  function saveCachedCounts() {
    GM_setValue(CACHE_STORAGE, JSON.stringify({ plushCounts, flowerCounts, ts: Date.now() }));
  }
  function loadCachedCounts() {
    const raw = GM_getValue(CACHE_STORAGE, '');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (data.plushCounts) plushCounts = data.plushCounts;
      if (data.flowerCounts) flowerCounts = data.flowerCounts;
    } catch (e) {}
  }
  function saveMarketCache() {
    GM_setValue(MARKET_CACHE_STORAGE, JSON.stringify(marketData));
  }
  function loadMarketCache() {
    const raw = GM_getValue(MARKET_CACHE_STORAGE, '');
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch (e) {
      return {};
    }
  }

  // =========================
  // RENDER
  // =========================
  function renderCurrent() {
    if (currentTab === 'plush') renderPlush();
    else if (currentTab === 'flower') renderFlower();
    else renderSettings();
    updatePanelPosition();
  }

  function renderPlush() {
    const header = document.getElementById('pf-header-title');
    const content = document.getElementById('pf-content');
    if (!header || !content) return;

    header.textContent = 'Plushie Sets';

    const counts = PLUSHIES.map(p => plushCounts[p.id] || 0);
    const sets = counts.length ? Math.min(...counts) : 0;
    const target = sets + 1;

    const weakest = PLUSHIES
      .map(p => ({
        id: p.id,
        name: p.name + ' Plushie',
        have: plushCounts[p.id] || 0
      }))
      .sort((a, b) => a.have - b.have)
      .slice(0, 3);

    const marketTotal = calcMarketTotal(plushCounts);

    const savedGoalStr = GM_getValue(GOAL_PLUSH_KEY, '');
    const savedGoal = savedGoalStr ? Number(savedGoalStr) : null;
    const goalReached = savedGoal !== null && sets >= savedGoal;

    let html = '';
    html += `<div class="pf-market-total">Market value (inv + display): $${marketTotal.toLocaleString()}</div>`;
    html += `<div class="pf-top pf-top-plush">Plushies tracked: ${counts.reduce((a, b) => a + b, 0)}</div>`;
    html += `<div class="pf-main-sets-line">
      <span>You: ${sets}</span>
      <span class="pf-goal-inline ${goalReached ? 'pf-goal-inline-green' : 'pf-goal-inline-red'}">Goal: ${savedGoal !== null ? savedGoal : '–'}</span>
    </div>`;
    html += `<div class="pf-goal-toggle" id="pf-goal-toggle">Goal settings ▼</div>
      <div class="pf-goal-panel" id="pf-goal-panel" style="display:none;">
        <label>Goal sets:</label>
        <input type="number" id="pf-goal-input" min="0" value="${savedGoal !== null ? savedGoal : ''}">
        <button id="pf-goal-save" class="pf-goal-btn">Save</button>
      </div>`;
    html += `<div class="pf-section-title">Weakest for next set (aim for ≥ ${target})</div>`;

    if (weakest.length) {
      html += `<div class="pf-list">` + weakest.map(item => {
        const market = marketData[item.id];
        const priceStr = market && market.market_value ? ` <span class="pf-market">m$${market.market_value.toLocaleString()}</span>` : '';
        return `
          <div class="pf-row">
            <span class="pf-name">${item.name}${priceStr}</span>
            <span class="pf-right">you have ${item.have}</span>
          </div>
        `;
      }).join('') + `</div>`;
    } else {
      html += `<div class="pf-empty">Already enough for next set.</div>`;
    }

    if (lastApiError) {
      html += `<div class="pf-error">${lastApiError}</div>`;
    }

    content.innerHTML = html;

    const tog = document.getElementById('pf-goal-toggle');
    const pnl = document.getElementById('pf-goal-panel');
    const inp = document.getElementById('pf-goal-input');
    const saveBtn = document.getElementById('pf-goal-save');
    if (tog && pnl) {
      tog.addEventListener('click', () => {
        const vis = pnl.style.display !== 'none';
        pnl.style.display = vis ? 'none' : 'block';
        tog.textContent = vis ? 'Goal settings ▼' : 'Goal settings ▲';
      });
    }
    if (saveBtn && inp) {
      saveBtn.addEventListener('click', () => {
        GM_setValue(GOAL_PLUSH_KEY, inp.value);
        renderPlush();
      });
    }

    panelEl.classList.remove('pf-flower-theme');
    panelEl.classList.add('pf-plush-theme');
  }

  function renderFlower() {
    const header = document.getElementById('pf-header-title');
    const content = document.getElementById('pf-content');
    if (!header || !content) return;

    header.textContent = 'Flower Sets';

    const counts = FLOWERS.map(f => flowerCounts[f.id] || 0);
    const sets = counts.length ? Math.min(...counts) : 0;
    const target = sets + 1;

    const weakest = FLOWERS
      .map(f => ({
        id: f.id,
        name: f.name,
        have: flowerCounts[f.id] || 0
      }))
      .sort((a, b) => a.have - b.have)
      .slice(0, 3);

    const marketTotal = calcMarketTotal(flowerCounts);

    const savedGoalStr = GM_getValue(GOAL_FLOWER_KEY, '');
    const savedGoal = savedGoalStr ? Number(savedGoalStr) : null;
    const goalReached = savedGoal !== null && sets >= savedGoal;

    let html = '';
    html += `<div class="pf-market-total">Market value (inv + display): $${marketTotal.toLocaleString()}</div>`;
    html += `<div class="pf-top pf-top-flower">Flowers tracked: ${counts.reduce((a, b) => a + b, 0)}</div>`;
    html += `<div class="pf-main-sets-line">
      <span>You: ${sets}</span>
      <span class="pf-goal-inline ${goalReached ? 'pf-goal-inline-green' : 'pf-goal-inline-red'}">Goal: ${savedGoal !== null ? savedGoal : '–'}</span>
    </div>`;
    html += `<div class="pf-goal-toggle" id="pf-goal-toggle">Goal settings ▼</div>
      <div class="pf-goal-panel" id="pf-goal-panel" style="display:none;">
        <label>Goal sets:</label>
        <input type="number" id="pf-goal-input" min="0" value="${savedGoal !== null ? savedGoal : ''}">
        <button id="pf-goal-save" class="pf-goal-btn">Save</button>
      </div>`;
    html += `<div class="pf-section-title">Weakest for next set (aim for ≥ ${target})</div>`;

    if (weakest.length) {
      html += `<div class="pf-list">` + weakest.map(item => {
        const market = marketData[item.id];
        const priceStr = market && market.market_value ? ` <span class="pf-market">m$${market.market_value.toLocaleString()}</span>` : '';
        return `
          <div class="pf-row">
            <span class="pf-name">${item.name}${priceStr}</span>
            <span class="pf-right">you have ${item.have}</span>
          </div>
        `;
      }).join('') + `</div>`;
    } else {
      html += `<div class="pf-empty">Already enough for next set.</div>`;
    }

    if (lastApiError) {
      html += `<div class="pf-error">${lastApiError}</div>`;
    }

    content.innerHTML = html;

    const tog = document.getElementById('pf-goal-toggle');
    const pnl = document.getElementById('pf-goal-panel');
    const inp = document.getElementById('pf-goal-input');
    const saveBtn = document.getElementById('pf-goal-save');
    if (tog && pnl) {
      tog.addEventListener('click', () => {
        const vis = pnl.style.display !== 'none';
        pnl.style.display = vis ? 'none' : 'block';
        tog.textContent = vis ? 'Goal settings ▼' : 'Goal settings ▲';
      });
    }
    if (saveBtn && inp) {
      saveBtn.addEventListener('click', () => {
        GM_setValue(GOAL_FLOWER_KEY, inp.value);
        renderFlower();
      });
    }

    panelEl.classList.remove('pf-plush-theme');
    panelEl.classList.add('pf-flower-theme');
  }

  function renderSettings() {
    const header = document.getElementById('pf-header-title');
    const content = document.getElementById('pf-content');
    if (!header || !content) return;

    header.textContent = 'PF ADV settings';
    const masked = apiKey ? mask(apiKey) : '(none)';

    content.innerHTML = `
      <div class="pf-settings-block">
        <div class="pf-settings-label">Saved API key:</div>
        <div class="pf-settings-value">${masked}</div>
        <input type="text" id="pf-api-input" placeholder="New API key..." style="width:100%;margin-top:6px;">
        <div class="pf-settings-btns">
          <button id="pf-api-save">Save key</button>
          <button id="pf-api-clear">Clear</button>
          <button id="pf-api-refresh">Refresh items</button>
          <button id="pf-market-refresh">Market update</button>
        </div>
        <div class="pf-settings-note">Tip: you can drag the tab buttons anywhere (mobile/PDA safe).</div>
        ${lastApiError ? `<div class="pf-settings-note" style="color:#ff6666;">${lastApiError}</div>` : ''}
      </div>
    `;

    const inpt = document.getElementById('pf-api-input');
    const save = document.getElementById('pf-api-save');
    const clr = document.getElementById('pf-api-clear');
    const ref = document.getElementById('pf-api-refresh');
    const mref = document.getElementById('pf-market-refresh');

    if (save && inpt) {
      save.addEventListener('click', () => {
        const v = inpt.value.trim();
        if (v) {
          apiKey = v;
          GM_setValue(API_STORAGE_KEY, v);
          fetchUserItems();
        }
      });
    }
    if (clr) {
      clr.addEventListener('click', () => {
        apiKey = '';
        GM_setValue(API_STORAGE_KEY, '');
        lastApiError = 'API key cleared.';
        renderSettings();
      });
    }
    if (ref) {
      ref.addEventListener('click', () => {
        if (apiKey) fetchUserItems();
        else {
          mergePageInventory(plushCounts, flowerCounts);
          renderCurrent();
        }
      });
    }
    if (mref) {
      mref.addEventListener('click', () => {
        updateMarketData();
      });
    }

    panelEl.classList.remove('pf-plush-theme', 'pf-flower-theme');
  }

  function mask(k) {
    if (k.length <= 6) return '***';
    return k.slice(0, 3) + '...' + k.slice(-3);
  }

  // =========================
  // UI / DRAGGABLE LAUNCHER
  // =========================
  function createUI() {
    const wrap = document.createElement('div');
    wrap.id = 'pf-wrap';
    document.body.appendChild(wrap);
    launcherEl = wrap;

    const savedX = GM_getValue(POS_X_KEY, 20);
    const savedY = GM_getValue(POS_Y_KEY, 20);
    wrap.style.left = savedX + 'px';
    wrap.style.top = savedY + 'px';

    const tabPlush = document.createElement('div');
    tabPlush.id = 'pf-tab-plush';
    tabPlush.className = 'pf-tab pf-tab-active';
    tabPlush.textContent = '🧸';
    wrap.appendChild(tabPlush);

    const tabFlower = document.createElement('div');
    tabFlower.id = 'pf-tab-flower';
    tabFlower.className = 'pf-tab';
    tabFlower.textContent = '🌸';
    wrap.appendChild(tabFlower);

    const tabSettings = document.createElement('div');
    tabSettings.id = 'pf-tab-settings';
    tabSettings.className = 'pf-tab pf-tab-settings';
    tabSettings.textContent = '⚙️';
    wrap.appendChild(tabSettings);

    const panel = document.createElement('div');
    panel.id = 'pf-panel';
    panel.innerHTML = `
      <div id="pf-panel-inner">
        <div class="pf-header" id="pf-header-title">
          Plushie Sets
          <span id="pf-close-btn">✖</span>
        </div>
        <div id="pf-content">Loading…</div>
      </div>
    `;
    document.body.appendChild(panel);
    panelEl = panel;

    tabPlush.addEventListener('click', () => {
      currentTab = 'plush';
      renderPlush();
      togglePanel('plush');
    });
    tabFlower.addEventListener('click', () => {
      currentTab = 'flower';
      renderFlower();
      togglePanel('flower');
    });
    tabSettings.addEventListener('click', () => {
      currentTab = 'settings';
      renderSettings();
      togglePanel('settings');
    });

    panel.querySelector('#pf-close-btn').addEventListener('click', () => {
      panel.classList.remove('pf-open');
      panelOpen = false;
    });

    makeDraggable(wrap);
    addStyles();
    updatePanelPosition();
  }

  function makeDraggable(el) {
    let isDown = false;
    let startX = 0;
    let startY = 0;
    let origX = 0;
    let origY = 0;

    const startDrag = (clientX, clientY) => {
      isDown = true;
      startX = clientX;
      startY = clientY;
      const rect = el.getBoundingClientRect();
      origX = rect.left;
      origY = rect.top;
    };

    const moveDrag = (clientX, clientY) => {
      if (!isDown) return;
      const dx = clientX - startX;
      const dy = clientY - startY;
      const newX = origX + dx;
      const newY = origY + dy;
      el.style.left = newX + 'px';
      el.style.top = newY + 'px';
      updatePanelPosition();
    };

    const endDrag = () => {
      if (!isDown) return;
      isDown = false;
      const rect = el.getBoundingClientRect();
      GM_setValue(POS_X_KEY, Math.round(rect.left));
      GM_setValue(POS_Y_KEY, Math.round(rect.top));
    };

    el.addEventListener('mousedown', e => {
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
    });
    document.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
    document.addEventListener('mouseup', endDrag);

    el.addEventListener('touchstart', e => {
      const t = e.touches[0];
      startDrag(t.clientX, t.clientY);
    }, { passive: true });
    document.addEventListener('touchmove', e => {
      if (!isDown) return;
      const t = e.touches[0];
      moveDrag(t.clientX, t.clientY);
    }, { passive: true });
    document.addEventListener('touchend', endDrag);
  }

  function togglePanel(tabName) {
    if (!panelEl) return;
    if (panelOpen && currentTab === tabName) {
      panelEl.classList.remove('pf-open');
      panelOpen = false;
    } else {
      setActiveTab(tabName);
      updatePanelPosition();
      panelEl.classList.add('pf-open');
      panelOpen = true;
    }
  }

  function setActiveTab(tab) {
    const p = document.getElementById('pf-tab-plush');
    const f = document.getElementById('pf-tab-flower');
    const s = document.getElementById('pf-tab-settings');
    p && p.classList.remove('pf-tab-active');
    f && f.classList.remove('pf-tab-active');
    s && s.classList.remove('pf-tab-active');
    if (tab === 'plush' && p) p.classList.add('pf-tab-active');
    else if (tab === 'flower' && f) f.classList.add('pf-tab-active');
    else if (tab === 'settings' && s) s.classList.add('pf-tab-active');
  }

  function updatePanelPosition() {
    if (!launcherEl || !panelEl) return;
    const rect = launcherEl.getBoundingClientRect();
    const panelWidth = 280;
    const margin = 10;
    let left = rect.right + margin;
    let top = rect.top;

    if (left + panelWidth > window.innerWidth) {
      left = rect.left - panelWidth - margin;
    }
    if (left < 0) left = margin;
    if (top + panelEl.offsetHeight > window.innerHeight) {
      top = window.innerHeight - panelEl.offsetHeight - margin;
    }
    if (top < margin) top = margin;

    panelEl.style.left = left + 'px';
    panelEl.style.top = top + 'px';
  }

  // =========================
  // STYLES
  // =========================
  function addStyles() {
    const css = `
      @keyframes pfGlowGreen {
        0% { box-shadow: 0 0 0 rgba(0,255,0,0); }
        50% { box-shadow: 0 0 12px rgba(0,255,0,0.9); }
        100% { box-shadow: 0 0 0 rgba(0,255,0,0); }
      }
      @keyframes pfGlowYellow {
        0% { box-shadow: 0 0 0 rgba(255,255,0,0); }
        50% { box-shadow: 0 0 12px rgba(255,255,0,1); }
        100% { box-shadow: 0 0 0 rgba(255,255,0,0); }
      }

      #pf-wrap {
        position: fixed;
        display: flex;
        flex-direction: column;
        gap: 6px;
        z-index: 999999;
        bottom: 20px;
        left: 20px;
        touch-action: none;
      }
      .pf-tab {
        width: 52px;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        cursor: grab;
        font-size: 26px;
        background: rgba(0,0,0,0.55);
        transition: transform .15s;
        backdrop-filter: blur(4px);
      }
      .pf-tab:active {
        cursor: grabbing;
      }
      #pf-tab-plush {
        border: 1px solid rgba(0,255,0,0.7);
        animation: pfGlowGreen 3s ease-in-out infinite;
      }
      #pf-tab-flower {
        border: 1px solid rgba(255,255,0,0.7);
        animation: pfGlowYellow 3.2s ease-in-out infinite;
      }
      .pf-tab-settings {
        border: 1px solid rgba(255,255,255,0.35);
        font-size: 22px;
      }
      .pf-tab-active {
        transform: scale(1.02);
      }

      #pf-panel {
        position: fixed;
        width: 280px;
        max-height: 65vh;
        overflow-y: auto;
        border-radius: 12px;
        transform: translateX(-360px);
        opacity: 0;
        pointer-events: none;
        transition: opacity .2s ease-out;
        z-index: 999998;
      }
      #pf-panel.pf-open {
        transform: translateX(0);
        opacity: 1;
        pointer-events: auto;
      }

      .pf-header {
        padding: 9px 12px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      #pf-content {
        padding: 8px 10px 10px 10px;
        font-size: 12px;
      }
      .pf-top {
        font-weight: bold;
        border-radius: 6px;
        padding: 4px 6px;
        margin-bottom: 6px;
      }
      .pf-main-sets-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
      }
      .pf-goal-inline {
        font-weight: bold;
      }
      .pf-goal-inline-red {
        color: #ff5c5c;
      }
      .pf-goal-inline-green {
        color: #6dff6d;
      }
      .pf-goal-toggle {
        font-size: 11px;
        cursor: pointer;
        opacity: .85;
        margin-bottom: 4px;
      }
      .pf-goal-panel {
        background: rgba(0,0,0,0.15);
        border: 1px solid rgba(255,255,255,0.05);
        border-radius: 4px;
        padding: 4px;
        margin-bottom: 6px;
      }
      .pf-goal-panel input {
        width: 70px;
        margin-right: 6px;
      }
      .pf-goal-btn {
        background: rgba(255,255,255,0.12);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 4px;
        padding: 2px 6px;
        font-size: 11px;
        cursor: pointer;
      }
      .pf-section-title {
        font-weight: bold;
        margin: 6px 0 4px 0;
        font-size: 12px;
      }
      .pf-list {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }
      .pf-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2px 4px;
        border-radius: 4px;
        background: rgba(255,255,255,0.03);
      }
      .pf-name {
        flex: 1;
      }
      .pf-right {
        font-size: 11px;
        font-weight: bold;
      }
      .pf-empty {
        opacity: .7;
        font-style: italic;
      }
      .pf-error {
        margin-top: 6px;
        color: #ff6666;
        font-size: 11px;
      }
      .pf-market {
        font-size: 10px;
        opacity: .7;
        margin-left: 4px;
      }
      .pf-market-total {
        font-size: 11px;
        margin-bottom: 4px;
        opacity: .8;
      }

      .pf-plush-theme {
        background: rgba(0,0,0,0.7);
        border: 1px solid rgba(0,255,0,0.4);
        color: #bfff00;
      }
      .pf-plush-theme .pf-top-plush {
        background: rgba(0,255,0,0.08);
        border: 1px solid rgba(0,255,0,0.25);
      }
      .pf-flower-theme {
        background: rgba(0,0,0,0.7);
        border: 1px solid rgba(255,255,0,0.4);
        color: #ffe066;
      }
      .pf-flower-theme .pf-top-flower {
        background: rgba(255,255,0,0.05);
        border: 1px solid rgba(255,255,0,0.25);
      }

      .pf-settings-block {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 6px;
        padding: 6px;
        font-size: 12px;
      }
      .pf-settings-label {
        font-weight: bold;
        margin-bottom: 2px;
      }
      .pf-settings-value {
        margin-bottom: 4px;
      }
      .pf-settings-note {
        font-size: 11px;
        opacity: .6;
        margin-top: 6px;
      }
      .pf-settings-btns {
        display: flex;
        gap: 6px;
        margin-top: 6px;
        flex-wrap: wrap;
      }
      .pf-settings-btns button {
        background: rgba(255,255,255,0.12);
        border: 1px solid rgba(255,255,255,0.25);
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        padding: 3px 6px;
      }

      @media (max-width: 768px) {
        #pf-wrap {
          gap: 5px;
        }
        .pf-tab {
          width: 50px;
          height: 50px;
        }
        #pf-panel {
          max-height: 60vh;
        }
      }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
// =========================
// CUSTOM POSITION + FONT SIZE TWEAKS
// =========================
const style = document.createElement('style');
style.textContent = `
  /* Move launcher to bottom-left */
  #pf-launcher {
    left: 20px !important;
    right: auto !important;
    bottom: 30px !important;
    top: auto !important;
  }

  /* Tabs bigger text */
  #pf-launcher .pf-tab {
    font-size: 15px !important;
    padding: 6px 10px !important;
  }

  /* Panel header text bigger */
  #pf-header-title {
    font-size: 18px !important;
    font-weight: 700 !important;
  }

  /* Main content text slightly bigger */
  #pf-content {
    font-size: 15px !important;
  }

  .pf-row .pf-name,
  .pf-row .pf-right {
    font-size: 15px !important;
  }

  /* Goal + market labeling slightly bigger */
  .pf-market-total,
  .pf-main-sets-line,
  .pf-goal-inline,
  .pf-section-title {
    font-size: 15px !important;
  }
`;
document.head.appendChild(style);

})();
