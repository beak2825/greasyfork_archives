// ==UserScript==
// @name         Torn Raceway — VIPs to Top (PDA-safe)
// @author       Fu11y [2774724]
// @namespace    torn.racepin.pda
// @version      1.4
// @description  Hoist chosen races to the top of the Custom Races list. Match by host name, host ID, or keywords anywhere in the row. PDA/WebView safe. Draggable panel with saved position & tap-friendly header.
// @match        https://www.torn.com/*
// @match        https://www.torn.com/loader.php?sid=racing*
// @match        https://www.torn.com/racing*
// @run-at       document-idle
// @grant        none
// @license      GNU GPLv3
//
// @downloadURL https://update.greasyfork.org/scripts/553135/Torn%20Raceway%20%E2%80%94%20VIPs%20to%20Top%20%28PDA-safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553135/Torn%20Raceway%20%E2%80%94%20VIPs%20to%20Top%20%28PDA-safe%29.meta.js
// ==/UserScript==
//
// Credits: Fizzy_ [3253722]- Testing and PDA feedback

(function () {
  'use strict';

  const LS_KEY = 'racepin.settings.v2';
  const POS_KEY = 'racepin.panel.pos.v1';

  function loadSettings() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return { hosts: ['changme'], hostIds: [], keywords: ['change','me'] };
      const s = JSON.parse(raw);
      s.hosts = (s.hosts || []).map(x => String(x).toLowerCase().trim()).filter(Boolean);
      s.hostIds = (s.hostIds || []).map(x => parseInt(x, 10)).filter(Number.isFinite);
      s.keywords = (s.keywords || []).map(x => String(x).toLowerCase().trim()).filter(Boolean);
      return s;
    } catch { return { hosts: [], hostIds: [], keywords: [] }; }
  }
  function saveSettings(s){ localStorage.setItem(LS_KEY, JSON.stringify(s)); }
  let SETTINGS = loadSettings();

  const isRacingScreen = () => {
    const u = location.href.toLowerCase();
    if (/sid=racing|\/racing/.test(u)) return true;
    const t = (document.body.textContent || '').toLowerCase();
    return t.includes('torn city raceway') || t.includes('custom races');
  };

  const byText = (root, pred) => {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const out = [];
    while (w.nextNode()) {
      const t = w.currentNode.nodeValue.trim();
      if (t && pred(t)) out.push(w.currentNode);
    }
    return out;
  };

  function parseRaceRow(row) {
    const text = (row.textContent || '').replace(/\s+/g, ' ').trim();
    const lower = text.toLowerCase();
    const m = text.match(/([\w.\-\s]{1,32})'s race\b/i);
    const creator = m ? m[1].trim() : null;
    let xid = null;
    const a = row.querySelector('a[href*="profiles.php?XID="]');
    if (a) { const mx = a.href.match(/XID=(\d+)/i); if (mx) xid = parseInt(mx[1], 10); }
    return { creator, xid, text, lower };
  }

  function isVIPRow(row) {
    const { creator, xid, lower } = parseRaceRow(row);
    const byName = creator && SETTINGS.hosts.includes(creator.toLowerCase());
    const byId   = xid != null && SETTINGS.hostIds.includes(xid);
    const byKw   = SETTINGS.keywords.length > 0 && SETTINGS.keywords.some(k => lower.includes(k));
    return byName || byId || byKw;
  }

  function findListContainer() {
    const candidates = Array.from(document.querySelectorAll(
      '.table-body, .content, .table, .body, .m-row, .table-list, ul, .racing-wrap, .racing-table, .tableCont, .cont-rounded'
    ));
    for (const c of candidates) {
      const kids = Array.from(c.children || []);
      if (kids.length < 5) continue;
      const score = kids.reduce((acc, k) => {
        const t = (k.textContent || '').toLowerCase();
        return acc + (t.includes('join this race') || t.includes('drivers') ? 1 : 0);
      }, 0);
      if (score >= 3) return c;
    }
    return null;
  }

  function resolveRowWithinContainer(node, container) {
    let el = node.nodeType === 3 ? node.parentElement : node;
    while (el && el.parentElement && el.parentElement !== container) el = el.parentElement;
    if (el && el.parentElement === container) {
      const txt = (el.textContent || '').toLowerCase();
      if (txt.includes('join this race') || txt.includes('drivers') || txt.includes('waiting')) return el;
    }
    return null;
  }

  // -------- Panel (draggable; tap-friendly) --------
  let panel, headerEl, listEl, countEl;
  function ensurePanel() {
    if (panel) return;
    const pos = (() => { try { return JSON.parse(localStorage.getItem(POS_KEY) || '{}'); } catch { return {}; } })();
    panel = document.createElement('div');
    panel.style.cssText = `
      position: fixed; z-index: 99999;
      left: ${Number.isFinite(pos.x)?pos.x:8}px; bottom: ${Number.isFinite(pos.y)?pos.y:8}px;
      background: rgba(0,0,0,.85); color: #fff; font: 14px/1.3 system-ui, sans-serif;
      padding: 8px 10px; border-radius: 8px; max-width: 92vw; max-height: 46vh; overflow:auto;
      box-shadow: 0 2px 10px rgba(0,0,0,.4);
    `;
    panel.innerHTML = `
      <div id="rp-header" style="display:flex;gap:8px;align-items:center;margin-bottom:6px;cursor:move;user-select:none;">
        <strong>Pinned races</strong>
        <span id="vipCount" style="opacity:.8"></span>
        <div style="margin-left:auto; display:flex; gap:6px;">
          <button id="vipSettings" style="background:#333;border:0;color:#fff;border-radius:6px;padding:2px 6px;cursor:pointer">CFG</button>
          <button id="vipCollapse" style="background:#333;border:0;color:#fff;border-radius:6px;padding:2px 6px;cursor:pointer">–</button>
          <button id="vipHide" style="background:#333;border:0;color:#fff;border-radius:6px;padding:2px 6px;cursor:pointer">X</button>
        </div>
      </div>
      <div id="vipList" style="display:grid;gap:6px;"></div>
    `;
    document.documentElement.appendChild(panel);
    headerEl = panel.querySelector('#rp-header');
    listEl   = panel.querySelector('#vipList');
    countEl  = panel.querySelector('#vipCount');

    // Buttons
    panel.querySelector('#vipCollapse').addEventListener('click', () => {
      listEl.style.display = listEl.style.display === 'none' ? 'grid' : 'none';
    });
    panel.querySelector('#vipHide').addEventListener('click', () => { panel.style.display = 'none'; });
    panel.querySelector('#vipSettings').addEventListener('click', openSettings);

    // Drag with click-vs-drag threshold and button guard
    let dragging = false, start = null, offset = null;
    const THRESH = 6;

    headerEl.addEventListener('mousedown', startDrag);
    headerEl.addEventListener('touchstart', startDrag, {passive:false});

    function startDrag(ev) {

      if (ev.target.closest('button')) return;

      const p = getPoint(ev);
      start = p;
      const rect = panel.getBoundingClientRect();
      offset = { dx: p.x - rect.left, dy: p.y - rect.top };
      dragging = false; // not yet; wait until threshold
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onMove, {passive:false});
      window.addEventListener('mouseup', endDrag, {once:true});
      window.addEventListener('touchend', endDrag, {once:true});
    }
    function onMove(ev) {
      if (!start) return;
      const p = getPoint(ev);
      const moved = Math.hypot(p.x - start.x, p.y - start.y);
      if (!dragging && moved < THRESH) return; // still a click
      dragging = true;
      ev.preventDefault(); // only prevent once we are truly dragging
      const x = clamp(p.x - offset.dx, 4, window.innerWidth  - panel.offsetWidth  - 4);
      const yTop = clamp(p.y - offset.dy, 4, window.innerHeight - panel.offsetHeight - 4);
      const yBottom = window.innerHeight - (yTop + panel.offsetHeight);
      panel.style.left = `${x}px`;
      panel.style.bottom = `${yBottom}px`;
    }
    function endDrag() {
      if (!start) return;
      if (dragging) {
        const rect = panel.getBoundingClientRect();
        const x = rect.left;
        const yBottom = window.innerHeight - (rect.top + rect.height);
        localStorage.setItem(POS_KEY, JSON.stringify({x, y:yBottom}));
      }
      start = null; dragging = false; offset = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
    }
    function getPoint(ev){
      if (ev.touches && ev.touches[0]) return {x: ev.touches[0].clientX, y: ev.touches[0].clientY};
      return {x: ev.clientX, y: ev.clientY};
    }
    function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }
  }

  function openSettings() {
    const wrap = document.createElement('div');
    wrap.style.cssText = `position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 100000;
                          display:flex; align-items:center; justify-content:center;`;
    const box = document.createElement('div');
    box.style.cssText = `background:#121212;color:#fff;border:1px solid #444;border-radius:10px;
                          padding:14px;width:min(640px,94vw);`;
    box.innerHTML = `
      <h3 style="margin:0 0 10px 0;">Racepin Settings</h3>
      <div style="display:grid; gap:10px;">
        <label>Hosts (names, comma-separated)
          <input id="rp-hosts" style="width:100%; padding:6px; margin-top:4px; background:#1f1f1f; color:#fff; border:1px solid #444; border-radius:6px;">
        </label>
        <label>Host IDs (XIDs, comma-separated)
          <input id="rp-ids" style="width:100%; padding:6px; margin-top:4px; background:#1f1f1f; color:#fff; border:1px solid #444; border-radius:6px;">
        </label>
        <label>Keywords (comma-separated — matches anywhere in a row)
          <input id="rp-kws" style="width:100%; padding:6px; margin-top:4px; background:#1f1f1f; color:#fff; border:1px solid #444; border-radius:6px;">
        </label>
        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button id="rp-save" style="background:#2e7d32; border:0; color:#fff; padding:6px 10px; border-radius:6px; cursor:pointer;">Save</button>
          <button id="rp-cancel" style="background:#333; border:0; color:#fff; padding:6px 10px; border-radius:6px; cursor:pointer;">Cancel</button>
        </div>
      </div>
    `;
    wrap.appendChild(box);
    document.body.appendChild(wrap);

    const S = SETTINGS;
    box.querySelector('#rp-hosts').value = S.hosts.join(', ');
    box.querySelector('#rp-ids').value   = S.hostIds.join(', ');
    box.querySelector('#rp-kws').value   = S.keywords.join(', ');

    box.querySelector('#rp-cancel').onclick = () => wrap.remove();
    box.querySelector('#rp-save').onclick = () => {
      const hosts = box.querySelector('#rp-hosts').value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      const ids   = box.querySelector('#rp-ids').value.split(',').map(s => parseInt(s.trim(),10)).filter(Number.isFinite);
      const kws   = box.querySelector('#rp-kws').value.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      SETTINGS = { hosts, hostIds: ids, keywords: kws };
      saveSettings(SETTINGS);
      wrap.remove();
      bubbleVIPs();
    };
  }

  function renderPinnedPanel(rows) {
    ensurePanel();
    const vipRows = rows.filter(isVIPRow);
    listEl.innerHTML = '';
    if (!vipRows.length) {
      listEl.innerHTML = `<div style="opacity:.7;">No VIP races detected.</div>`;
      countEl.textContent = '';
      return;
    }
    countEl.textContent = `(${vipRows.length})`;
    vipRows.forEach(row => {
      const { creator, text } = parseRaceRow(row);
      const btn = document.createElement('button');
      btn.style.cssText = `text-align:left;background:#1f1f1f;border:1px solid #444;border-radius:6px;color:#fff;padding:6px 8px;cursor:pointer;`;
      btn.textContent = (creator ? creator + ' — ' : '') + text.slice(0, 110);
      btn.addEventListener('click', e => {
        e.preventDefault();
        const join = row.querySelector('a, button');
        if (join) join.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        row.style.outline = '2px solid #ffcc00';
        setTimeout(() => (row.style.outline = ''), 1200);
      });
      listEl.appendChild(btn);
    });
  }

  function bubbleVIPs() {
    if (!isRacingScreen()) return;
    const container = findListContainer();
    if (!container) { renderPinnedPanel([]); return; }

    const textNodes = byText(container, t => /'s race\b/i.test(t));
    const rows = [];
    const seen = new WeakSet();
    for (const tn of textNodes) {
      const row = resolveRowWithinContainer(tn, container);
      if (!row || seen.has(row)) continue;
      seen.add(row);
      rows.push(row);
    }
    if (rows.length === 0) {
      Array.from(container.children).forEach(r => {
        const t = (r.textContent || '').toLowerCase();
        if (t.includes('join this race') || t.includes('drivers')) rows.push(r);
      });
    }

    renderPinnedPanel(rows);

    const vipRows = rows.filter(isVIPRow);
    if (!vipRows.length) return;

    const anchor = container.firstElementChild;
    vipRows.forEach(r => {
      if (!r.__vip_moved) {
        container.insertBefore(r, anchor);
        r.__vip_moved = true;
        r.style.outline = '2px solid #ffcc00';
        setTimeout(() => (r.style.outline = ''), 1200);
      }
    });
  }

  const mo = new MutationObserver(() => {
    clearTimeout(bubbleVIPs._t);
    bubbleVIPs._t = setTimeout(bubbleVIPs, 180);
  });
  mo.observe(document.documentElement, { subtree: true, childList: true, characterData: true });

  bubbleVIPs();
})();
