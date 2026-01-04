// ==UserScript==
// @name         Discord Friends Bulk Checker + Remover (Panel Selection)
// @namespace    https://discord.com
// @version      1.0.0
// @description  Select friends from an in-panel list (no inline checkboxes). Scan All to harvest names/IDs, then bulk remove safely.
// @author       blanco
// @match        https://discord.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547946/Discord%20Friends%20Bulk%20Checker%20%2B%20Remover%20%28Panel%20Selection%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547946/Discord%20Friends%20Bulk%20Checker%20%2B%20Remover%20%28Panel%20Selection%29.meta.js
// ==/UserScript==

/*\
WHY: Automation may violate Discord's Terms of Service and trigger rate limits. Use at your own risk.
*/

(function () {
  'use strict';

  // --- Tunables -------------------------------------------------------------
  const DELETE_DELAY_MS = 1750;          // Cushion for rate limits
  const MENU_APPEAR_TIMEOUT = 5000;
  const MODAL_APPEAR_TIMEOUT = 5000;
  const SCAN_SCROLL_STEP = 800;          // px per tick
  const SCAN_SCROLL_PAUSE = 120;         // ms between steps
  const SCAN_STALL_TICKS = 20;           // stop after this many ticks without discovering new items
  const LOCATE_MAX_TICKS = 400;          // cap search scrolls per item

  // --- Styles ---------------------------------------------------------------
  GM_addStyle(`
    .tm-bulk-panel { position: fixed; right: 18px; bottom: 18px; z-index: 999999; background: var(--background-secondary, #2b2d31); color: var(--text-normal, #fff); border: 1px solid var(--background-tertiary, #1e1f22); border-radius: 12px; padding: 12px; box-shadow: 0 8px 24px rgba(0,0,0,.4); min-width: 360px; max-width: 420px; font-family: var(--font-primary, system-ui, sans-serif); display: none; }
    .tm-bulk-panel.tm-visible { display: block; }
    .tm-bulk-panel h4 { margin: 0 0 8px 0; font-size: 14px; font-weight: 700; }
    .tm-bulk-row { display:flex; gap:8px; margin:6px 0; align-items:center; }
    .tm-bulk-row button { flex:1; border: 1px solid var(--background-tertiary, #1e1f22); background: var(--background-primary, #313338); color: var(--text-normal, #fff); border-radius: 8px; padding: 8px 10px; cursor: pointer; font-size: 12px; }
    .tm-bulk-row button:hover { filter: brightness(1.08); }
    .tm-danger { background: #a12828 !important; border-color:#8b1f1f !important; }
    .tm-muted  { opacity: .7; }
    .tm-chip { display:inline-block; font-size:11px; padding:2px 6px; border-radius:6px; background: var(--background-tertiary, #1e1f22); color: var(--text-muted, #b5bac1); }
    .tm-input { flex: 1; border-radius: 8px; border: 1px solid var(--background-tertiary, #1e1f22); background: var(--background-primary, #313338); color: var(--text-normal, #fff); padding: 8px 10px; font-size: 12px; }
    .tm-list { max-height: 260px; overflow: auto; border: 1px solid var(--background-tertiary, #1e1f22); border-radius: 8px; padding: 6px; }
    .tm-item { display:flex; align-items:center; gap:8px; padding: 4px 6px; border-radius: 6px; }
    .tm-item:hover { background: var(--background-tertiary, #1e1f22); }
    .tm-item label { display:flex; align-items:center; gap:8px; width: 100%; cursor: pointer; }
    .tm-name { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tm-id { font-size: 10px; opacity: .7; }
  `);

  // --- Selectors (with fallbacks) ------------------------------------------
  const SELECTORS = {
    listContainer: '.peopleList__5ec2f, [data-list-id="people-list"]',
    listItem: '.peopleListItem_cc6179, [data-list-item-id], li[class*="peopleListItem"]',
    usernameSpan: '.username__0a06e, [class*="username"], h3[role="heading"]',
    moreButton: '.actions_fc004c [aria-label="More"], [aria-label="More"]',
    menuRemoveFriendById: '#friend-row-remove-friend',
    confirmRemoveButtonText: 'Remove Friend',
    friendsHeaderNav: 'section.container__9293f[role="navigation"], section[role="navigation"]',
    friendsToolbar: 'section.container__9293f[role="navigation"] .toolbar__9293f .inviteToolbar__133bf, section[role="navigation"] .toolbar__9293f .inviteToolbar__133bf'
  };

  // --- State ----------------------------------------------------------------
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const seenIds = new Set();                   // All discovered row IDs
  const selectedIds = new Set();               // Selection made in panel
  const friendIndex = new Map();               // id -> { id, name }
  let isCancelling = false;                    // Stop flag

  // --- Utils ----------------------------------------------------------------
  function inDoc(el){ return el && el.isConnected; }

  function waitForSelector(selector, root = document, timeout = 10000) {
    const start = performance.now();
    return new Promise((resolve, reject) => {
      const quick = root.querySelector(selector);
      if (quick) return resolve(quick);
      const obs = new MutationObserver(() => {
        const el = root.querySelector(selector);
        if (el) { obs.disconnect(); resolve(el); }
        else if (performance.now() - start > timeout) { obs.disconnect(); reject(new Error(`Timeout waiting for ${selector}`)); }
      });
      obs.observe(root, { childList: true, subtree: true });
      setTimeout(() => { obs.disconnect(); reject(new Error(`Timeout waiting for ${selector}`)); }, timeout);
    });
  }

  function qsAllSafe(root, selector){
    try { return root.querySelectorAll(selector); }
    catch (e) {
      try {
        const parts = String(selector).split(',').map(s => s.trim()).filter(Boolean);
        const uniq = new Set();
        parts.forEach(sel => { try { root.querySelectorAll(sel).forEach(n => uniq.add(n)); } catch {} });
        return Array.from(uniq);
      } catch { return []; }
    }
  }

  function safeClick(el) {
    if (!el) return false;
    const v = (el.ownerDocument && el.ownerDocument.defaultView) || window;
    const optsMouse = { bubbles: true, cancelable: true, view: v, composed: true };
    const optsPtr = { bubbles: true, cancelable: true, view: v, composed: true, pointerId: 1, isPrimary: true, pointerType: 'mouse' };
    try {
      el.dispatchEvent(new MouseEvent('mouseover', optsMouse));
      if (typeof PointerEvent !== 'undefined') {
        el.dispatchEvent(new PointerEvent('pointerdown', optsPtr));
      }
      el.dispatchEvent(new MouseEvent('mousedown', optsMouse));
      el.dispatchEvent(new MouseEvent('mouseup', optsMouse));
      if (typeof PointerEvent !== 'undefined') {
        el.dispatchEvent(new PointerEvent('pointerup', optsPtr));
      }
      el.click();
      return true;
    } catch (e) {
      try { el.click(); } catch {}
      return false;
    }
  }

  const getRowId = (li) => li?.getAttribute('data-list-item-id') || '';
  function getUsernameFromItem(li) {
    const el = li?.querySelector(SELECTORS.usernameSpan);
    return el ? (el.textContent || '').trim() : null;
  }

  // --- Harvest (no inline checkboxes) --------------------------------------
  function harvestRowsInContainer(container) {
    let discovered = 0;
    const items = qsAllSafe(container, SELECTORS.listItem);
    items.forEach(li => {
      const id = getRowId(li);
      if (!id) return;
      if (!seenIds.has(id)) discovered++;
      seenIds.add(id);
      const name = getUsernameFromItem(li) || friendIndex.get(id)?.name || '(unknown)';
      if (!friendIndex.has(id) || friendIndex.get(id)?.name !== name) {
        friendIndex.set(id, { id, name });
      }
    });
    if (discovered > 0) scheduleRender();
    return discovered;
  }

  function getContainer(){ return document.querySelector(SELECTORS.listContainer); }

  // --- Menu & Modal ---------------------------------------------------------
  async function openMoreMenuForItem(li) {
    if (!li) throw new Error('Row not found');
    if (inDoc(li)) { li.scrollIntoView({ block: 'center' }); await sleep(160); }
    const moreBtn = li.querySelector(SELECTORS.moreButton);
    if (!moreBtn) throw new Error('More button not found');
    safeClick(moreBtn);
    await waitForSelector(SELECTORS.menuRemoveFriendById + ', [role="menuitem"]', document.body, MENU_APPEAR_TIMEOUT);
  }

  function findRemoveFriendMenuItem(){
    const byId = document.body.querySelector(SELECTORS.menuRemoveFriendById);
    if (byId) return byId;
    const items = [...document.body.querySelectorAll('[role="menuitem"], button, div[aria-role="menuitem"]')];
    return items.find(n => /remove\s+friend/i.test(n.textContent || '')) || null;
  }

  async function clickRemoveFriendInMenu() {
    const item = findRemoveFriendMenuItem();
    if (!item) throw new Error('Remove Friend menu item not found');
    safeClick(item);
  }

  async function confirmRemovalModal() {
    // Some builds delete immediately with no modal. Treat missing modal as success after a short grace period.
    const t = (SELECTORS.confirmRemoveButtonText || 'Remove Friend').toLowerCase();
    const start = Date.now();
    const SOFT_WAIT = 1200; // decide if no modal is coming
    const HARD_WAIT = MODAL_APPEAR_TIMEOUT;
    while (Date.now() - start < HARD_WAIT) {
      const buttons = [...document.body.querySelectorAll('button')];
      const dialog = document.body.querySelector('[role="dialog"], .root-1gCeng');
      const btn = buttons.find(b => (b.textContent || '').trim().toLowerCase() === t);
      if (btn) { safeClick(btn); return; }
      if (!dialog && Date.now() - start > SOFT_WAIT) return; // no modal
      await sleep(80);
    }
    // Timeout treated as no-op; continue
  }

  // --- Locate row by ID (virtualization-safe) -------------------------------
  async function locateRowById(rowId, container) {
    let li = [...qsAllSafe(container, SELECTORS.listItem)].find(el => getRowId(el) === rowId);
    if (li) return li;
    let tick = 0, dir = 1, lastTop = container.scrollTop;
    while (tick++ < LOCATE_MAX_TICKS) {
      container.scrollTop += dir * SCAN_SCROLL_STEP;
      await sleep(SCAN_SCROLL_PAUSE);
      li = [...qsAllSafe(container, SELECTORS.listItem)].find(el => getRowId(el) === rowId);
      if (li) return li;
      if (container.scrollTop === 0 && dir === -1) break;
      if (container.scrollTop === lastTop) { if (dir === 1) dir = -1; else break; }
      lastTop = container.scrollTop;
    }
    return null;
  }

  // --- Bulk Delete ----------------------------------------------------------
  async function bulkDeleteSelected(statusCb) {
    const ids = [...selectedIds];
    if (ids.length === 0) { statusCb?.('No friends selected.'); return; }
    statusCb?.(`Starting removal of ${ids.length} friend(s)... Press Stop or ESC to cancel.`);
    isCancelling = false;
    const container = getContainer();
    if (!container) { statusCb?.('Friends list not found.'); return; }

    for (let i = 0; i < ids.length; i++) {
      if (isCancelling) { statusCb?.('Cancelled.'); break; }
      const rowId = ids[i];
      try {
        const friend = friendIndex.get(rowId);
        const label = friend?.name || rowId;
        statusCb?.(`(${i + 1}/${ids.length}) Locating ${label}...`);
        const li = await locateRowById(rowId, container);
        if (!li) { statusCb?.(`(${i + 1}/${ids.length}) ${label}: not found in viewport.`); continue; }
        statusCb?.(`(${i + 1}/${ids.length}) ${label}: opening menu...`);
        await openMoreMenuForItem(li);
        statusCb?.(`(${i + 1}/${ids.length}) ${label}: clicking "Remove Friend"...`);
        await clickRemoveFriendInMenu();
        statusCb?.(`(${i + 1}/${ids.length}) ${label}: confirming modal...`);
        await confirmRemovalModal();
        selectedIds.delete(rowId);
        renderList();
        statusCb?.(`(${i + 1}/${ids.length}) ${label}: removed. Cooling down...`);
        await sleep(DELETE_DELAY_MS);
      } catch (err) {
        statusCb?.(`(${i + 1}/${ids.length}) ${rowId}: FAILED — ${err.message}`);
        await sleep(800);
      }
    }
    statusCb?.('Done. Scan/Refresh if needed.');
    updateCount();
  }

  // --- Scanner --------------------------------------------------------------
  async function scanEntireList(container, statusCb) {
    let lastSeenCount = seenIds.size;
    let stallTicks = 0;
    container.scrollTop = 0; await sleep(150);

    while (true) {
      harvestRowsInContainer(container);
      if (seenIds.size > lastSeenCount) { lastSeenCount = seenIds.size; stallTicks = 0; }
      else { stallTicks++; }
      if (stallTicks >= SCAN_STALL_TICKS) break;
      container.scrollTop += SCAN_SCROLL_STEP;
      await sleep(SCAN_SCROLL_PAUSE);
    }

    stallTicks = 0;
    while (true) {
      harvestRowsInContainer(container);
      if (seenIds.size > lastSeenCount) { lastSeenCount = seenIds.size; stallTicks = 0; }
      else { stallTicks++; }
      if (stallTicks >= SCAN_STALL_TICKS) break;
      container.scrollTop -= SCAN_SCROLL_STEP;
      if (container.scrollTop <= 0) break;
      await sleep(SCAN_SCROLL_PAUSE);
    }

    container.scrollTop = 0; await sleep(100);
    harvestRowsInContainer(container);
    statusCb?.(`Found ~${seenIds.size} rows (via data-list-item-id).`);
    renderList();
    return seenIds.size;
  }

  // --- UI: Panel with in-panel selection -----------------------------------
  let dom = {};
  function addPanel() {
    if (document.querySelector('.tm-bulk-panel')) return;

    const panel = document.createElement('div');
    panel.className = 'tm-bulk-panel';
    panel.innerHTML = `
      <h4>Friends Bulk Tools</h4>
      <div class="tm-bulk-row">
        <input id="tm-search" class="tm-input" placeholder="Search name..." />
        <span class="tm-chip" id="tm-count">0 selected · 0 seen</span>
      </div>
      <div class="tm-bulk-row">
        <button id="tm-scan">Scan All</button>
        <button id="tm-refresh">Refresh</button>
      </div>
      <div class="tm-bulk-row">
        <button id="tm-select-filtered">Select All (filtered)</button>
        <button id="tm-select-none">None</button>
      </div>
      <div class="tm-bulk-row">
        <button id="tm-delete" class="tm-danger">Delete Selected</button>
        <button id="tm-stop">Stop</button>
      </div>
      <div class="tm-bulk-row">
        <div id="tm-list" class="tm-list" aria-label="Friends list (panel)"></div>
      </div>
      <div class="tm-bulk-row">
        <div id="tm-status" class="tm-chip" style="flex:1; max-height:160px; overflow:auto;"></div>
      </div>
    `;
    document.body.appendChild(panel);

    dom = {
      panel,
      search: panel.querySelector('#tm-search'),
      count: panel.querySelector('#tm-count'),
      scan: panel.querySelector('#tm-scan'),
      refresh: panel.querySelector('#tm-refresh'),
      selectFiltered: panel.querySelector('#tm-select-filtered'),
      selectNone: panel.querySelector('#tm-select-none'),
      del: panel.querySelector('#tm-delete'),
      stop: panel.querySelector('#tm-stop'),
      list: panel.querySelector('#tm-list'),
      status: panel.querySelector('#tm-status'),
    };

    const setStatus = (msg) => { const t = new Date().toLocaleTimeString(); dom.status.innerHTML = `${t}: ${msg}<br>` + dom.status.innerHTML; };
    dom.search.addEventListener('input', () => renderList());

    dom.refresh.addEventListener('click', () => {
      const c = getContainer();
      if (!c) return setStatus('Friends list not found.');
      const n = harvestRowsInContainer(c);
      renderList();
      setStatus(n ? `Refreshed. +${n} discovered.` : 'Refreshed visible rows.');
    });

    dom.scan.addEventListener('click', async () => {
      const c = getContainer();
      if (!c) return setStatus('Friends list not found.');
      dom.scan.disabled = true; dom.scan.classList.add('tm-muted');
      try {
        const total = await scanEntireList(c, setStatus);
        setStatus(`Scan done. Discovered ${total} rows.`);
      } finally {
        dom.scan.disabled = false; dom.scan.classList.remove('tm-muted');
      }
    });

    dom.selectFiltered.addEventListener('click', () => {
      dom.list.querySelectorAll('input[type="checkbox"][data-id]').forEach(cb => selectedIds.add(cb.dataset.id));
      renderList();
    });

    dom.selectNone.addEventListener('click', () => { selectedIds.clear(); renderList(); });

    dom.del.addEventListener('click', async () => {
      dom.del.disabled = true; dom.del.classList.add('tm-muted');
      try { await bulkDeleteSelected(setStatus); }
      finally { dom.del.disabled = false; dom.del.classList.remove('tm-muted'); }
    });

    dom.stop.addEventListener('click', () => { isCancelling = true; setStatus('Cancel requested.'); });

    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') { isCancelling = true; setStatus('Cancel requested.'); } });

    updateCount();
  }

  function updateCount(){ if (dom.count) dom.count.textContent = `${selectedIds.size} selected · ${seenIds.size} seen`; }

  let renderScheduled = false;
  function scheduleRender(){ if (!renderScheduled) { renderScheduled = true; requestAnimationFrame(() => { renderScheduled = false; renderList(); }); } }

  function renderList(){
    if (!dom.list) return;
    const q = (dom.search?.value || '').trim().toLowerCase();
    const entries = [...friendIndex.values()].sort((a,b) => a.name.localeCompare(b.name));
    const filtered = q ? entries.filter(e => (e.name || '').toLowerCase().includes(q)) : entries;

    const frag = document.createDocumentFragment();
    filtered.forEach(e => {
      const row = document.createElement('div');
      row.className = 'tm-item';
      const idShort = e.id.length > 10 ? e.id.slice(-8) : e.id;
      row.innerHTML = `
        <label>
          <input type="checkbox" data-id="${e.id}" ${selectedIds.has(e.id) ? 'checked' : ''}/>
          <span class="tm-name">${escapeHtml(e.name || '(unknown)')}</span>
          <span class="tm-id">${idShort}</span>
        </label>`;
      const cb = row.querySelector('input[type="checkbox"]');
      cb.addEventListener('change', () => { if (cb.checked) selectedIds.add(e.id); else selectedIds.delete(e.id); updateCount(); });
      frag.appendChild(row);
    });

    dom.list.innerHTML = '';
    dom.list.appendChild(frag);
    updateCount();
  }

  function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); }

  // Header opener
  async function addHeaderOpener() {
    try {
      await waitForSelector(SELECTORS.friendsHeaderNav, document, 10000);
      const toolbar = await waitForSelector(SELECTORS.friendsToolbar, document, 10000);
      if (toolbar.querySelector('.tm-opener')) return;
      const opener = document.createElement('button');
      opener.className = 'tm-opener';
      opener.type = 'button';
      opener.title = 'Open Bulk Tools';
      opener.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" role="img" style="width:20px;height:20px;color:currentColor">
          <path fill="currentColor" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2Zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2Zm0 6h10a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2Z"></path>
          <path fill="currentColor" d="M17.3 16.3a1 1 0 0 1 1.4 1.4l-3 3a1 1 0 0 1-1.4 0l-1.5-1.5a1 1 0 1 1 1.4-1.4l.8.8 2.3-2.3Z"></path>
        </svg>`;
      opener.addEventListener('click', () => { const panel = document.querySelector('.tm-bulk-panel'); if (panel) panel.classList.toggle('tm-visible'); });
      toolbar.appendChild(opener);
    } catch {/* noop */}
  }

  function observe() {
    const obs = new MutationObserver(() => {
      const list = getContainer();
      if (list) harvestRowsInContainer(list);
      addHeaderOpener();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  async function init() {
    addPanel();
    addHeaderOpener();
    observe();
    const list = getContainer();
    if (list) harvestRowsInContainer(list);
    renderList();
  }

  init();
})();
