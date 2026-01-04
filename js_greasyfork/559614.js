// ==UserScript==
// @name         Torn Christmas Town Pot Helper (Draggable + Resizable + Flexible Threshold)
// @namespace    https://torn.com/
// @version      1.2.4
// @description  Calculates pot value from item IDs (bazaar avg), displays pot info + persistent stats, locks Add until configurable threshold(s), draggable + resizable UI.
// @match        https://www.torn.com/christmas_town.php*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @author       WinterValor [3945658]
// @downloadURL https://update.greasyfork.org/scripts/559614/Torn%20Christmas%20Town%20Pot%20Helper%20%28Draggable%20%2B%20Resizable%20%2B%20Flexible%20Threshold%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559614/Torn%20Christmas%20Town%20Pot%20Helper%20%28Draggable%20%2B%20Resizable%20%2B%20Flexible%20Threshold%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /********************************************************************
   * STORAGE
   ********************************************************************/
  const STORAGE_CONFIG_KEY = 'tm_ct_pot_config_v2';
  const STORAGE_STATS_KEY  = 'tm_ct_pot_stats_v2';

  const DEFAULT_CONFIG = {
    thresholdMode: 'pot', // 'pot' | 'items' | 'and' | 'or'
    minPotValue: 5_000_000,
    minItems: 30,

    lockAddButton: true,
    showPanel: true,
    panelCollapsed: false,

    panelPos: null,           // { left, top }
    panelSize: null,          // { width, height } last known
    panelSizeExpanded: null,  // { width, height } restore on expand

    debug: false,
  };

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? { ...fallback, ...JSON.parse(raw) } : { ...fallback };
    } catch {
      return { ...fallback };
    }
  }
  function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  const config = loadJSON(STORAGE_CONFIG_KEY, DEFAULT_CONFIG);

  const stats = loadJSON(STORAGE_STATS_KEY, {
    rounds: 0,
    totalItemsToEnd: 0,
    minItemsToEnd: null,
    maxItemsToEnd: null,

    totalPotValueToEnd: 0,
    minPotValueToEnd: null,
    maxPotValueToEnd: null,

    hist: {},
    lastRounds: [],
  });

  function persist() {
    saveJSON(STORAGE_CONFIG_KEY, config);
    saveJSON(STORAGE_STATS_KEY, stats);
  }

  const log = (...args) => { if (config.debug) console.log('[CT Pot]', ...args); };

  /********************************************************************
   * PRICE MAP (bazaarAvgPrice)
   ********************************************************************/
  const PRICE_BY_ITEM_ID = Object.freeze({
    // Alcohol
    924: 1228518, 873: 999992, 984: 938428, 541: 261505, 552: 245935, 638: 134378,
    542: 128077, 551: 125352, 531: 52054, 550: 50941, 181: 2990, 294: 1476, 426: 628, 180: 597,
    // Candy
    1028: 2830766, 1312: 945522, 1039: 357265, 151: 317931, 587: 316976, 586: 316460,
    556: 109624, 529: 107285, 634: 59151, 528: 54850, 36: 44268, 527: 41772,
    310: 587, 35: 522, 209: 538, 210: 524, 37: 525, 39: 516, 38: 529,
    // Energy Drinks
    533: 3240579, 555: 3192999, 532: 1760719, 554: 1742831, 530: 1216712,
    553: 1190135, 987: 793440, 986: 490034, 985: 251917,
  });

  /********************************************************************
   * ROUND STATE
   ********************************************************************/
  const currentRound = {
    startedAt: Date.now(),
    itemsByArmouryId: new Map(), // armouryID -> itemId
    potValue: 0,
    unknownItemIds: new Set(),
  };

  function getCurrentItemCount() {
    return currentRound.itemsByArmouryId.size;
  }

  function resetCurrentRound(reason = '') {
    log('resetCurrentRound:', reason);
    currentRound.startedAt = Date.now();
    currentRound.itemsByArmouryId.clear();
    currentRound.potValue = 0;
    currentRound.unknownItemIds.clear();
    updateUI();
    enforceAddButton();
  }

  /********************************************************************
   * LEAK PREVENTION (IMPORTANT)
   ********************************************************************/
  // After endGame, ignore dropItem briefly (stragglers)
  let ignoreDropItemUntilMs = 0;

  // Ignore dropItem whose server time <= last endGame cutoff time (seconds float)
  let dropItemCutoffServerTime = null;

  // Used to arm “start-of-next-round” reset from the miniGameAction state call
  let pendingStartAfterEndGame = false;

  // Dedupe by message.key (if present)
  const seenDropKeys = new Set();
  function alreadySeenDropKey(k) {
    if (!k) return false;
    if (seenDropKeys.has(k)) return true;
    seenDropKeys.add(k);
    if (seenDropKeys.size > 8000) seenDropKeys.clear();
    return false;
  }

  function getDropServerTime(msg) {
    const t = Number(msg?.time);
    if (Number.isFinite(t) && t > 0) return t;

    const key = msg?.key;
    if (typeof key === 'string') {
      const parts = key.split('_');
      if (parts.length >= 2) {
        const kt = Number(parts[1]);
        if (Number.isFinite(kt) && kt > 0) return kt;
      }
    }
    return null;
  }

  function getEndGameServerTime(msg) {
    // endGame sometimes has board.list[].time (int seconds)
    const direct = Number(msg?.time);
    if (Number.isFinite(direct) && direct > 0) return direct;

    const list = msg?.board?.list;
    if (Array.isArray(list) && list.length) {
      let mx = null;
      for (const row of list) {
        const t = Number(row?.time);
        if (Number.isFinite(t) && t > 0) mx = (mx == null) ? t : Math.max(mx, t);
      }
      if (mx != null) return mx;
    }
    return (Date.now() / 1000);
  }

  /********************************************************************
   * STATS
   ********************************************************************/
  function addRoundToStats(itemsToEnd, potValue) {
    const nItems = Number(itemsToEnd);
    const nPot = Number(potValue);
    if (!Number.isFinite(nItems) || nItems <= 0) return;

    stats.rounds += 1;
    stats.totalItemsToEnd += nItems;
    stats.minItemsToEnd = (stats.minItemsToEnd === null) ? nItems : Math.min(stats.minItemsToEnd, nItems);
    stats.maxItemsToEnd = (stats.maxItemsToEnd === null) ? nItems : Math.max(stats.maxItemsToEnd, nItems);

    if (Number.isFinite(nPot)) {
      stats.totalPotValueToEnd += nPot;
      stats.minPotValueToEnd = (stats.minPotValueToEnd === null) ? nPot : Math.min(stats.minPotValueToEnd, nPot);
      stats.maxPotValueToEnd = (stats.maxPotValueToEnd === null) ? nPot : Math.max(stats.maxPotValueToEnd, nPot);
    }

    const key = String(nItems);
    stats.hist[key] = (stats.hist[key] || 0) + 1;

    stats.lastRounds.unshift({ ts: Date.now(), itemsToEnd: nItems, potValue: Number.isFinite(nPot) ? nPot : 0 });
    if (stats.lastRounds.length > 200) stats.lastRounds.length = 200;

    persist();
  }

  function calcMedianFromHist(histObj) {
    const entries = Object.entries(histObj)
      .map(([k, v]) => [Number(k), Number(v)])
      .filter(([k, v]) => Number.isFinite(k) && Number.isFinite(v) && v > 0)
      .sort((a, b) => a[0] - b[0]);

    const total = entries.reduce((s, [, v]) => s + v, 0);
    if (total === 0) return null;

    const mid1 = Math.floor((total - 1) / 2);
    const mid2 = Math.floor(total / 2);

    let acc = 0;
    let m1 = null, m2 = null;
    for (const [k, v] of entries) {
      const next = acc + v;
      if (m1 === null && mid1 < next) m1 = k;
      if (m2 === null && mid2 < next) { m2 = k; break; }
      acc = next;
    }
    if (m1 === null || m2 === null) return null;
    return (m1 + m2) / 2;
  }

  function formatMoney(n) {
    const num = Number(n) || 0;
    try {
      return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(num);
    } catch {
      return String(num);
    }
  }

  /********************************************************************
   * THRESHOLD
   ********************************************************************/
  function meetsThreshold(potValue, itemCount) {
    const potOk = potValue >= (Number(config.minPotValue) || 0);
    const itemsOk = itemCount >= (Number(config.minItems) || 0);
    switch (config.thresholdMode) {
      case 'pot': return potOk;
      case 'items': return itemsOk;
      case 'and': return potOk && itemsOk;
      case 'or': return potOk || itemsOk;
      default: return potOk;
    }
  }

  function thresholdLabel() {
    const pot = `$${formatMoney(config.minPotValue)}`;
    const items = `${Number(config.minItems) || 0} items`;
    switch (config.thresholdMode) {
      case 'pot': return pot;
      case 'items': return items;
      case 'and': return `${items} AND ${pot}`;
      case 'or': return `${items} OR ${pot}`;
      default: return pot;
    }
  }

  /********************************************************************
   * UI
   ********************************************************************/
  GM_addStyle(`
    #tm-ct-pot-panel, #tm-ct-pot-panel * { box-sizing: border-box; }

    #tm-ct-pot-panel {
      position: fixed;
      right: 12px;
      bottom: 12px;
      width: 320px;
      height: auto;
      z-index: 999999;
      background: rgba(20,20,20,0.92);
      color: #f2f2f2;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 10px;
      padding: 10px 10px 8px;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      font-size: 12px;
      line-height: 1.35;
      box-shadow: 0 8px 24px rgba(0,0,0,0.35);
      user-select: none;
      overflow: hidden;
    }

    #tm-ct-pot-panel.dragging { opacity: 0.97; cursor: grabbing; }
    #tm-ct-pot-panel.resizing { opacity: 0.98; }

    #tm-ct-pot-panel .row { display: flex; justify-content: space-between; gap: 8px; margin: 4px 0; }
    #tm-ct-pot-panel .title {
      font-weight: 700;
      font-size: 13px;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: grab;
    }
    #tm-ct-pot-panel .title:active { cursor: grabbing; }

    #tm-ct-pot-panel .muted { color: rgba(255,255,255,0.75); }
    #tm-ct-pot-panel .btns { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
    #tm-ct-pot-panel button {
      cursor: pointer;
      border: 1px solid rgba(255,255,255,0.18);
      background: rgba(255,255,255,0.08);
      color: #fff;
      border-radius: 8px;
      padding: 6px 8px;
      font-size: 12px;
    }
    #tm-ct-pot-panel button:hover { background: rgba(255,255,255,0.12); }

    #tm-ct-pot-panel.collapsed .body { display: none; }

    #tm-ct-resize {
      position: absolute;
      right: 6px;
      bottom: 6px;
      width: 14px;
      height: 14px;
      cursor: nwse-resize;
      opacity: 0.55;
      border-right: 2px solid rgba(255,255,255,0.35);
      border-bottom: 2px solid rgba(255,255,255,0.35);
      border-bottom-right-radius: 3px;
    }
    #tm-ct-resize:hover { opacity: 0.9; }
  `);

  let panelEl = null;

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function applyPanelPosition(el) {
    if (config.panelPos && Number.isFinite(config.panelPos.left) && Number.isFinite(config.panelPos.top)) {
      el.style.left = `${config.panelPos.left}px`;
      el.style.top = `${config.panelPos.top}px`;
      el.style.right = 'auto';
      el.style.bottom = 'auto';
    } else {
      el.style.right = '12px';
      el.style.bottom = '12px';
      el.style.left = 'auto';
      el.style.top = 'auto';
    }
  }

  function applyPanelSize(el) {
    if (config.panelCollapsed) {
      const w = config.panelSizeExpanded?.width ?? config.panelSize?.width;
      if (Number.isFinite(w)) el.style.width = `${w}px`;
      el.style.height = 'auto';
      return;
    }
    const sz = config.panelSizeExpanded || config.panelSize;
    if (sz && Number.isFinite(sz.width)) el.style.width = `${sz.width}px`;
    if (sz && Number.isFinite(sz.height) && sz.height > 120) el.style.height = `${sz.height}px`;
    else el.style.height = 'auto';
  }

  function saveExpandedSizeFromElement(el) {
    const rect = el.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    if (Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0) {
      config.panelSizeExpanded = { width, height };
      config.panelSize = { width, height };
    }
  }

  function toggleCollapsed(el) {
    if (!config.panelCollapsed) {
      saveExpandedSizeFromElement(el);
      config.panelCollapsed = true;
      el.classList.add('collapsed');
      applyPanelSize(el);
    } else {
      config.panelCollapsed = false;
      el.classList.remove('collapsed');
      applyPanelSize(el);
    }
    persist();
  }

  function makePanelDraggable(el, handleEl) {
    let dragging = false;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;
    let raf = 0;

    const onMouseDown = (e) => {
      const target = e.target;
      if (target && (target.tagName === 'BUTTON' || target.closest('button'))) return;

      dragging = true;
      el.classList.add('dragging');

      const rect = el.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;

      startX = e.clientX;
      startY = e.clientY;

      config.panelPos = { left: startLeft, top: startTop };
      applyPanelPosition(el);

      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!dragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const rect = el.getBoundingClientRect();
      const w = rect.width || 320;
      const h = rect.height || 200;

      const nextLeft = clamp(startLeft + dx, 0, window.innerWidth - w);
      const nextTop = clamp(startTop + dy, 0, window.innerHeight - h);

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.left = `${nextLeft}px`;
        el.style.top = `${nextTop}px`;
        config.panelPos = { left: nextLeft, top: nextTop };
      });
    };

    const onMouseUp = () => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('dragging');
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      persist();
    };

    handleEl.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function makePanelResizable(el, handleEl) {
    let resizing = false;
    let startX = 0, startY = 0;
    let startW = 0, startH = 0;
    let raf = 0;

    const MIN_W = 260;
    const MIN_H = 160;

    const onMouseDown = (e) => {
      if (config.panelCollapsed) {
        config.panelCollapsed = false;
        el.classList.remove('collapsed');
      }

      resizing = true;
      el.classList.add('resizing');

      const rect = el.getBoundingClientRect();
      startW = rect.width;
      startH = rect.height;

      startX = e.clientX;
      startY = e.clientY;

      e.preventDefault();
      e.stopPropagation();
    };

    const onMouseMove = (e) => {
      if (!resizing) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const nextW = clamp(startW + dx, MIN_W, window.innerWidth);
      const nextH = clamp(startH + dy, MIN_H, window.innerHeight);

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.width = `${nextW}px`;
        el.style.height = `${nextH}px`;

        const width = Math.round(nextW);
        const height = Math.round(nextH);
        config.panelSizeExpanded = { width, height };
        config.panelSize = { width, height };
      });
    };

    const onMouseUp = () => {
      if (!resizing) return;
      resizing = false;
      el.classList.remove('resizing');
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      persist();
    };

    handleEl.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function ensurePanel() {
    if (!config.showPanel) return;
    if (panelEl) return;

    const el = document.createElement('div');
    el.id = 'tm-ct-pot-panel';
    if (config.panelCollapsed) el.classList.add('collapsed');

    el.innerHTML = `
      <div class="title" id="tm-ct-drag-handle" title="Drag me">
        <div>Pot Helper</div>
        <div><button id="tm-ct-toggle" title="Collapse/expand">▾</button></div>
      </div>

      <div class="body">
        <div class="row"><div class="muted">Pot value</div><div id="tm-ct-pot">$0</div></div>
        <div class="row"><div class="muted">Items in pot</div><div id="tm-ct-items">0</div></div>
        <div class="row"><div class="muted">Unknown IDs</div><div id="tm-ct-unknown">0</div></div>

        <hr style="border:0;border-top:1px solid rgba(255,255,255,0.12); margin: 8px 0;">

        <div class="row"><div class="muted">Enable Add when</div><div id="tm-ct-thresh">—</div></div>

        <hr style="border:0;border-top:1px solid rgba(255,255,255,0.12); margin: 8px 0;">

        <div class="row"><div class="muted">Rounds tracked</div><div id="tm-ct-rounds">0</div></div>
        <div class="row"><div class="muted">Avg items to end</div><div id="tm-ct-avg">0</div></div>
        <div class="row"><div class="muted">Avg pot value to end</div><div id="tm-ct-avgpot">$0</div></div>
        <div class="row"><div class="muted">Median</div><div id="tm-ct-med">—</div></div>
        <div class="row"><div class="muted">Min / Max</div><div id="tm-ct-minmax">—</div></div>
        <div class="row"><div class="muted">Most common</div><div id="tm-ct-top">—</div></div>

        <div class="btns">
          <button id="tm-ct-config">Configure threshold</button>
          <button id="tm-ct-reset">Reset stats</button>
        </div>

        <div class="muted" style="margin-top:8px">
          Tip: refresh mid-round resets live pot value until new dropItem events arrive.
        </div>
      </div>

      <div id="tm-ct-resize" title="Resize"></div>
    `;

    el.querySelector('#tm-ct-toggle').addEventListener('click', () => toggleCollapsed(el));
    el.querySelector('#tm-ct-config').addEventListener('click', () => openConfigDialog());
    el.querySelector('#tm-ct-reset').addEventListener('click', () => {
      if (!confirm('Reset all tracked round statistics?')) return;

      stats.rounds = 0;
      stats.totalItemsToEnd = 0;
      stats.minItemsToEnd = null;
      stats.maxItemsToEnd = null;

      stats.totalPotValueToEnd = 0;
      stats.minPotValueToEnd = null;
      stats.maxPotValueToEnd = null;

      stats.hist = {};
      stats.lastRounds = [];

      persist();
      updateUI();
    });

    document.documentElement.appendChild(el);
    panelEl = el;

    applyPanelPosition(panelEl);
    applyPanelSize(panelEl);

    makePanelDraggable(panelEl, panelEl.querySelector('#tm-ct-drag-handle'));
    makePanelResizable(panelEl, panelEl.querySelector('#tm-ct-resize'));

    updateUI();
  }

  function updateUI() {
    if (!panelEl) return;

    const pot = currentRound.potValue;
    const items = getCurrentItemCount();
    const unknown = currentRound.unknownItemIds.size;

    panelEl.querySelector('#tm-ct-pot').textContent = `$${formatMoney(pot)}`;
    panelEl.querySelector('#tm-ct-items').textContent = String(items);
    panelEl.querySelector('#tm-ct-unknown').textContent = String(unknown);

    panelEl.querySelector('#tm-ct-thresh').textContent = thresholdLabel();
    panelEl.querySelector('#tm-ct-rounds').textContent = String(stats.rounds);

    const avgItems = stats.rounds ? (stats.totalItemsToEnd / stats.rounds) : 0;
    panelEl.querySelector('#tm-ct-avg').textContent = stats.rounds ? avgItems.toFixed(2) : '0';

    const avgPot = stats.rounds ? (stats.totalPotValueToEnd / stats.rounds) : 0;
    panelEl.querySelector('#tm-ct-avgpot').textContent = `$${formatMoney(Math.floor(avgPot))}`;

    const med = calcMedianFromHist(stats.hist);
    panelEl.querySelector('#tm-ct-med').textContent = (med === null) ? '—' : String(med);

    const mm = (stats.minItemsToEnd === null) ? '—' : `${stats.minItemsToEnd} / ${stats.maxItemsToEnd}`;
    panelEl.querySelector('#tm-ct-minmax').textContent = mm;

    const top = Object.entries(stats.hist)
      .map(([k, v]) => [Number(k), Number(v)])
      .filter(([k, v]) => Number.isFinite(k) && Number.isFinite(v))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => `${k} (${v})`)
      .join(', ');
    panelEl.querySelector('#tm-ct-top').textContent = top || '—';
  }

  function openConfigDialog() {
    const modeHint =
`Choose threshold mode:
- pot   => enable when pot value >= min pot
- items => enable when items >= min items
- and   => enable when items >= min items AND pot >= min pot
- or    => enable when items >= min items OR pot >= min pot`;

    const mode = prompt(`${modeHint}\n\nEnter mode (pot/items/and/or):`, String(config.thresholdMode || 'pot'));
    if (mode === null) return;

    const m = String(mode).trim().toLowerCase();
    if (!['pot', 'items', 'and', 'or'].includes(m)) {
      alert('Invalid mode. Use: pot, items, and, or');
      return;
    }

    let pot = config.minPotValue;
    let items = config.minItems;

    if (m === 'pot' || m === 'and' || m === 'or') {
      const pv = prompt('Minimum pot value (number):', String(pot));
      if (pv === null) return;
      const n = Number(String(pv).replace(/[,_\s]/g, ''));
      if (!Number.isFinite(n) || n < 0) return alert('Invalid pot value.');
      pot = Math.floor(n);
    }

    if (m === 'items' || m === 'and' || m === 'or') {
      const iv = prompt('Minimum items in pot (integer):', String(items));
      if (iv === null) return;
      const n = Number(String(iv).replace(/[,_\s]/g, ''));
      if (!Number.isFinite(n) || n < 0) return alert('Invalid item count.');
      items = Math.floor(n);
    }

    config.thresholdMode = m;
    config.minPotValue = pot;
    config.minItems = items;
    persist();

    updateUI();
    enforceAddButton();
  }

  /********************************************************************
   * ADD BUTTON LOCKING
   ********************************************************************/
  function findAddButton() {
    const candidates = Array.from(document.querySelectorAll('button'))
      .filter(b => (b.textContent || '').trim() === 'Add');
    if (candidates.length === 0) return null;

    const root = document.getElementById('christmastownroot');
    if (root) {
      const inside = candidates.find(b => root.contains(b));
      if (inside) return inside;
    }
    return candidates[0];
  }

  function enforceAddButton() {
    if (!config.lockAddButton) return;

    const btn = findAddButton();
    if (!btn) return;

    const pot = currentRound.potValue;
    const items = getCurrentItemCount();
    const shouldEnable = meetsThreshold(pot, items);

    btn.disabled = !shouldEnable;
    btn.style.opacity = shouldEnable ? '' : '0.5';
    btn.title = shouldEnable ? '' : `Disabled until: ${thresholdLabel()} (now: ${items} items, $${formatMoney(pot)})`;
  }

  /********************************************************************
   * POT GAME MESSAGE HANDLING (NO "NEW WS" RESET ANYMORE)
   ********************************************************************/
  let lastEndGameAtMs = 0;

  function handlePotGameMessage(messageObj) {
    if (!messageObj || typeof messageObj !== 'object') return;

    const action = messageObj.action;
    const namespace = messageObj.namespace;
    if (namespace && namespace !== 'christmasTown') return;

    if (action === 'dropItem') {
      // ignore stragglers after endGame
      if (Date.now() < ignoreDropItemUntilMs) return;

      if (alreadySeenDropKey(messageObj.key)) return;

      const t = getDropServerTime(messageObj);
      if (dropItemCutoffServerTime != null && t != null && t <= dropItemCutoffServerTime) {
        // old item from previous round
        return;
      }

      const armouryID = messageObj.armouryID ?? messageObj.armouryId;
      const itemIdRaw = messageObj.item_id ?? messageObj.itemId ?? messageObj.itemID;
      const itemId = Number(itemIdRaw);

      if (!armouryID) return;
      if (!Number.isFinite(itemId)) return;

      if (currentRound.itemsByArmouryId.has(armouryID)) {
        updateUI();
        enforceAddButton();
        return;
      }

      currentRound.itemsByArmouryId.set(armouryID, itemId);

      const price = PRICE_BY_ITEM_ID[itemId];
      if (typeof price === 'number') currentRound.potValue += price;
      else currentRound.unknownItemIds.add(itemId);

      // Once we see valid new drops, we're definitely in the new round
      // (we still keep cutoff; it only blocks <= cutoff anyway)
      updateUI();
      enforceAddButton();
      return;
    }

    if (action === 'endGame') {
      const now = Date.now();
      if (now - lastEndGameAtMs < 1200) return; // debounce
      lastEndGameAtMs = now;

      const itemsToEnd = Number(messageObj.prizes ?? getCurrentItemCount());
      addRoundToStats(itemsToEnd, currentRound.potValue);

      // establish cutoff to block late old drops
      dropItemCutoffServerTime = getEndGameServerTime(messageObj);
      ignoreDropItemUntilMs = Date.now() + 1200;

      pendingStartAfterEndGame = true; // arm “new round started” reset via miniGameAction

      resetCurrentRound('endGame');
      return;
    }

    // If server ever sends an explicit start action, use it
    if (action === 'startGame' || action === 'newGame' || action === 'resetGame') {
      log('explicit start/reset action:', action);
      pendingStartAfterEndGame = false;
      dropItemCutoffServerTime = null;
      ignoreDropItemUntilMs = 0;
      resetCurrentRound(action);
    }
  }

  function handleWsPayload(raw) {
    let obj;
    try { obj = JSON.parse(raw); } catch { return; }

    const channel = obj?.push?.channel;
    if (channel !== 'potGame') return;

    const msg = obj?.push?.pub?.data?.message;
    if (!msg) return;

    handlePotGameMessage(msg);
  }

  function installWebSocketHook() {
    const w = unsafeWindow;
    if (!w || !w.WebSocket) return;
    if (w.WebSocket.__tm_ct_hooked) return;

    const NativeWebSocket = w.WebSocket;

    class WebSocketProxy extends NativeWebSocket {
      constructor(url, protocols) {
        super(url, protocols);

        this.addEventListener('message', (ev) => {
          const data = ev?.data;
          if (typeof data === 'string') {
            handleWsPayload(data);
          } else if (data instanceof Blob) {
            data.text().then(handleWsPayload).catch(() => {});
          }
        });
      }
    }

    WebSocketProxy.__tm_ct_hooked = true;
    try { Object.defineProperty(WebSocketProxy, 'name', { value: 'WebSocket' }); } catch {}
    w.WebSocket = WebSocketProxy;
  }

  /********************************************************************
   * HOOK miniGameAction "state" call (your POST) to detect new run start
   ********************************************************************/
  function isPotStateRequest(url, bodyStr) {
    if (!url || typeof url !== 'string') return false;
    if (!url.includes('christmas_town.php')) return false;
    if (!url.includes('q=miniGameAction')) return false;

    if (typeof bodyStr !== 'string') return false;
    // cheap checks; robust enough
    return bodyStr.includes('"action"') && bodyStr.includes('state') &&
           bodyStr.includes('"gameType"') && bodyStr.includes('gamePot');
  }

  function onPotStateSignal(source, maybeJson) {
    // IMPORTANT: only treat as "new run started" if we just ended a round.
    if (!pendingStartAfterEndGame) {
      log('pot state signal ignored (not pending)', source);
      return;
    }

    log('pot state signal => new round start', source, maybeJson ? '(json)' : '');
    pendingStartAfterEndGame = false;

    // This is a hard boundary: new run.
    // Clear cutoff/cooldown and re-reset to ensure no leaked late items survive.
    dropItemCutoffServerTime = null;
    ignoreDropItemUntilMs = 0;
    resetCurrentRound('miniGameAction state => new round');
  }

  function installFetchHook() {
    const w = unsafeWindow;
    if (!w || !w.fetch) return;
    if (w.fetch.__tm_ct_hooked) return;

    const nativeFetch = w.fetch.bind(w);

    w.fetch = async (...args) => {
      const res = await nativeFetch(...args);

      try {
        const input = args[0];
        const init = args[1] || {};
        const url = (typeof input === 'string') ? input : (input && input.url) ? input.url : '';
        const method = (init.method || (input && input.method) || 'GET').toUpperCase();
        const body = init.body;

        const bodyStr = typeof body === 'string' ? body : null;

        if (method === 'POST' && isPotStateRequest(url, bodyStr)) {
          const cloned = res.clone();
          cloned.json().then((j) => {
            log('miniGameAction state response (fetch):', j);
            onPotStateSignal('fetch', j);
          }).catch(() => {
            onPotStateSignal('fetch', null);
          });
        }
      } catch {}

      return res;
    };

    w.fetch.__tm_ct_hooked = true;
  }

  function installXhrHook() {
    const w = unsafeWindow;
    if (!w || !w.XMLHttpRequest) return;
    if (w.XMLHttpRequest.__tm_ct_hooked) return;

    const NativeXHR = w.XMLHttpRequest;

    function XHRProxy() {
      const xhr = new NativeXHR();

      let _url = '';
      let _method = 'GET';
      let _bodyStr = null;

      const open = xhr.open;
      xhr.open = function (method, url, ...rest) {
        _method = String(method || 'GET').toUpperCase();
        _url = String(url || '');
        return open.call(this, method, url, ...rest);
      };

      const send = xhr.send;
      xhr.send = function (body) {
        _bodyStr = (typeof body === 'string') ? body : null;

        // attach load handler once per request
        xhr.addEventListener('load', () => {
          try {
            if (_method === 'POST' && isPotStateRequest(_url, _bodyStr)) {
              let j = null;
              try { j = JSON.parse(xhr.responseText); } catch {}
              log('miniGameAction state response (xhr):', j || xhr.responseText);
              onPotStateSignal('xhr', j);
            }
          } catch {}
        }, { once: true });

        return send.call(this, body);
      };

      return xhr;
    }

    w.XMLHttpRequest = XHRProxy;
    w.XMLHttpRequest.__tm_ct_hooked = true;
  }

  /********************************************************************
   * MENU
   ********************************************************************/
  GM_registerMenuCommand('CT Pot Helper: Configure threshold…', () => openConfigDialog());

  GM_registerMenuCommand(`CT Pot Helper: ${config.lockAddButton ? 'Disable' : 'Enable'} Add lock`, () => {
    config.lockAddButton = !config.lockAddButton;
    persist();
    enforceAddButton();
    alert(`Add lock is now: ${config.lockAddButton ? 'ON' : 'OFF'}`);
  });

  GM_registerMenuCommand(`CT Pot Helper: Debug logs (${config.debug ? 'ON' : 'OFF'})`, () => {
    config.debug = !config.debug;
    persist();
    alert(`Debug logs: ${config.debug ? 'ON' : 'OFF'} (open console)`);
  });

  GM_registerMenuCommand('CT Pot Helper: Reset panel position + size', () => {
    config.panelPos = null;
    config.panelSize = null;
    config.panelSizeExpanded = null;
    config.panelCollapsed = false;
    persist();
    if (panelEl) {
      panelEl.classList.remove('collapsed');
      applyPanelPosition(panelEl);
      applyPanelSize(panelEl);
    }
    alert('Panel position/size reset.');
  });

  /********************************************************************
   * STARTUP
   ********************************************************************/
  installWebSocketHook();
  installFetchHook();
  installXhrHook();

  const domReady = () => {
    if (config.showPanel) ensurePanel();

    const mo = new MutationObserver(() => {
      if (config.showPanel && !panelEl) ensurePanel();
      enforceAddButton();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    setInterval(() => {
      if (config.showPanel && !panelEl) ensurePanel();
      enforceAddButton();
    }, 1000);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', domReady, { once: true });
  } else {
    domReady();
  }
})();
