// ==UserScript==
// @name         MaruMori: Maru Exporter
// @namespace    http://tampermonkey.net/
// @version      2026-01-11.1
// @license      MIT
// @description  Copy cards from a study deck
// @match        https://marumori.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562187/MaruMori%3A%20Maru%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/562187/MaruMori%3A%20Maru%20Exporter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const UI = {
    barId: 'mmx-bar',
    modalBackdropId: 'mmx-modal-backdrop',
    modalId: 'mmx-modal',
    toastId: 'mmx-toast',
    styleId: 'mmx-style',
  };

  const Store = {
    apiItems: null,
    apiUrl: null,
    lastUpdatedAt: null,
    currentListId: null,
    started: false,
    hooksInstalled: false,
    mounted: false,
  };

  function isManagePath(pathname) {
    return /^\/study-lists\/[^/]+\/manage\/?$/.test(String(pathname || ''));
  }

  function getListId(pathname) {
    const m = String(pathname || '').match(/\/study-lists\/([^/]+)\/manage/);
    return m?.[1] || null;
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function toast(msg) {
    let el = document.getElementById(UI.toastId);
    if (!el) {
      el = document.createElement('div');
      el.id = UI.toastId;
      el.style.cssText = `
        position: fixed; right: 18px; bottom: 18px; z-index: 9999999;
        background: rgba(25,25,25,0.92); color: #fff;
        border: 1px solid rgba(255,255,255,0.14);
        border-radius: 14px; padding: 10px 12px;
        font: 13px/1.25 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        box-shadow: 0 10px 26px rgba(0,0,0,0.42);
        max-width: 360px;
        transition: opacity 180ms ease;
      `;
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => (el.style.opacity = '0'), 2200);
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok;
      } catch {
        return false;
      }
    }
  }

  function escapeCsv(value) {
    const s = String(value ?? '');
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }

  function downloadText(filename, text, mime = 'text/plain;charset=utf-8') {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function uniquePreserveOrder(arr) {
    const seen = new Set();
    const out = [];
    for (const v of arr) {
      if (!seen.has(v)) {
        seen.add(v);
        out.push(v);
      }
    }
    return out;
  }

  function formatWords(words, format) {
    if (format === 'comma') return words.join(', ');
    if (format === 'tab') return words.join('\t');
    if (format === 'csv') return ['word', ...words.map(escapeCsv)].join('\n');
    return words.join('\n');
  }

  function mapStatusFromDomRow(row) {
    if (row.querySelector('td.status span.block.known')) return 'known';
    if (row.querySelector('td.status span.block.learning')) return 'learning';
    if (row.querySelector('td.status span.block.new')) return 'new';
    if (row.querySelector('td.status span.block.unknown')) return 'unknown';
    return 'other';
  }

  function mapWordFromDomRow(row) {
    return row.querySelector('span.item.vocabulary')?.textContent?.trim() || '';
  }

  function collectItemsFromDOM() {
    return Array.from(document.querySelectorAll('tr.item-row'))
      .map((row) => ({ word: mapWordFromDomRow(row), status: mapStatusFromDomRow(row) }))
      .filter((x) => x.word);
  }

  function flattenApiItems(payload) {
    const buckets = payload?.items;
    if (!Array.isArray(buckets)) return [];
    const flat = [];
    for (const b of buckets) {
      if (Array.isArray(b)) {
        for (const obj of b) if (obj && typeof obj === 'object') flat.push(obj);
      } else if (b && typeof b === 'object') {
        flat.push(b);
      }
    }
    return flat;
  }

  function statusToLabel(n) {
    const v = Number(n);
    if (Number.isNaN(v)) return 'other';
    if (v === 2) return 'known';
    if (v === 1) return 'learning';
    if (v === 0) return 'new';
    return 'other';
  }

  function normalizeApiItems(payload) {
    const flat = flattenApiItems(payload);
    return flat
      .map((it) => ({
        word: (typeof it.item === 'string' && it.item.trim()) || '',
        status: statusToLabel(it.status),
      }))
      .filter((x) => x.word);
  }

  function setApiItemsFromPayload(payload, url) {
    const items = normalizeApiItems(payload);
    if (!items.length) return false;
    Store.apiItems = items;
    Store.apiUrl = url || Store.apiUrl;
    Store.lastUpdatedAt = Date.now();
    refreshSubline();
    return true;
  }

  function getEffectiveItems() {
    return Array.isArray(Store.apiItems) && Store.apiItems.length ? Store.apiItems : collectItemsFromDOM();
  }

  function filterWords(items, status) {
    const filtered = status === 'all' ? items : items.filter((x) => x.status === status);
    return uniquePreserveOrder(filtered.map((x) => x.word));
  }

  function injectStyles() {
    if (document.getElementById(UI.styleId)) return;
    const style = document.createElement('style');
    style.id = UI.styleId;
    style.textContent = `
      #${UI.barId} {
        position: fixed; left: 50%; transform: translateX(-50%);
        bottom: 18px; z-index: 9999998;
        display: flex; gap: 10px; align-items: center;
        padding: 10px 12px; border-radius: 16px;
        background: rgba(18,18,18,0.92);
        border: 1px solid rgba(255,255,255,0.16);
        box-shadow: 0 14px 38px rgba(0,0,0,0.5);
        backdrop-filter: blur(10px);
        color: #fff; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        max-width: min(900px, calc(100vw - 28px));
      }
      #${UI.barId} .mmx-title {
        font-weight: 900; padding: 6px 10px;
        border-radius: 12px;
        background: rgba(255,255,255,0.10);
        border: 1px solid rgba(255,255,255,0.10);
      }
      #${UI.barId} .mmx-sub { font-size: 12px; opacity: 0.85; }
      #${UI.barId} button {
        border-radius: 12px; padding: 8px 10px;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.10);
        color: #fff; font-weight: 800; cursor: pointer;
      }
      #${UI.modalBackdropId} {
        position: fixed; inset: 0; display: none;
        z-index: 9999999; background: rgba(0,0,0,0.55);
        backdrop-filter: blur(4px);
        align-items: center; justify-content: center;
        padding: 18px;
      }
      #${UI.modalId} {
        width: min(860px, 100%);
        background: rgba(18,18,18,0.96);
        border-radius: 18px;
        border: 1px solid rgba(255,255,255,0.16);
        box-shadow: 0 20px 60px rgba(0,0,0,0.65);
        color: #fff;
      }
      #${UI.modalId} .mmx-head {
        display: flex; justify-content: space-between; align-items: center;
        padding: 14px;
        border-bottom: 1px solid rgba(255,255,255,0.10);
      }
      #${UI.modalId} .mmx-body {
        padding: 14px; display: grid;
        grid-template-columns: 1.2fr 1fr; gap: 14px;
      }
      @media (max-width: 760px) {
        #${UI.modalId} .mmx-body { grid-template-columns: 1fr; }
      }
      #${UI.modalId} .mmx-card {
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: 14px; padding: 12px;
      }
      #${UI.modalId} .mmx-row { display: grid; grid-template-columns: 1fr; gap: 10px; }
      #${UI.modalId} select, #${UI.modalId} input {
        width: 100%;
        padding: 9px 10px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(10,10,10,0.55);
        color: #fff;
        outline: none;
        font-size: 13px;
      }
      #${UI.modalId} .mmx-actions { display:flex; gap:10px; flex-wrap:wrap; }
      #${UI.modalId} .mmx-preview {
        width: 100%; min-height: 260px; max-height: 420px; resize: vertical;
        background: rgba(10,10,10,0.55);
        color: #fff; border-radius: 12px;
        padding: 10px; font-size: 12px;
        border: 1px solid rgba(255,255,255,0.14);
        white-space: pre; overflow: auto;
      }
      #${UI.modalId} .mmx-meta {
        font-size: 12px; opacity: 0.85; margin-top: 10px; line-height: 1.3;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureBar() {
    if (document.getElementById(UI.barId)) return;
    const bar = document.createElement('div');
    bar.id = UI.barId;
    bar.innerHTML = `
      <div class="mmx-title">Maru Exporter</div>
      <div class="mmx-sub" id="mmx-sub">Waiting for list data…</div>
      <button id="mmx-open">Open</button>
      <button id="mmx-quick">Quick: Known</button>
    `;
    document.body.appendChild(bar);
    bar.querySelector('#mmx-open').onclick = openModal;
    bar.querySelector('#mmx-quick').onclick = quickCopyKnown;
    refreshSubline();
  }

  function removeUI() {
    document.getElementById(UI.barId)?.remove();
    document.getElementById(UI.modalBackdropId)?.remove();
    Store.mounted = false;
  }

  function refreshSubline() {
    const el = document.getElementById('mmx-sub');
    if (!el) return;
    const src = Array.isArray(Store.apiItems) && Store.apiItems.length ? `API (${Store.apiItems.length})` : `DOM (~${collectItemsFromDOM().length})`;
    el.textContent = `Source: ${src}`;
  }

  async function quickCopyKnown() {
    const items = getEffectiveItems();
    const words = filterWords(items, 'known');
    if (!words.length) return toast('No known words found');
    const ok = await copyToClipboard(formatWords(words, 'newline'));
    toast(ok ? `Copied ${words.length}` : 'Copy failed');
  }

  function ensureModal() {
    if (document.getElementById(UI.modalBackdropId)) return;
    const backdrop = document.createElement('div');
    backdrop.id = UI.modalBackdropId;
    backdrop.innerHTML = `
      <div id="${UI.modalId}">
        <div class="mmx-head">
          <strong>Maru Exporter</strong>
          <button id="mmx-close">Close</button>
        </div>
        <div class="mmx-body">
          <div class="mmx-card">
            <div class="mmx-row">
              <select id="mmx-status">
                <option value="known">Known</option>
                <option value="learning">Learning</option>
                <option value="new">New</option>
                <option value="all">All</option>
              </select>
              <select id="mmx-format">
                <option value="newline">New lines</option>
                <option value="comma">Comma</option>
                <option value="tab">Tab</option>
                <option value="csv">CSV</option>
              </select>
              <input id="mmx-filename" value="marumori_export.csv" />
              <div class="mmx-actions">
                <button id="mmx-refresh">Refresh Preview</button>
                <button id="mmx-copy">Copy</button>
                <button id="mmx-dl">Download CSV</button>
                <button id="mmx-api">Reload from API</button>
              </div>
              <div class="mmx-meta" id="mmx-meta"></div>
            </div>
          </div>
          <div class="mmx-card">
            <textarea id="mmx-preview" class="mmx-preview" readonly></textarea>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    backdrop.onclick = (e) => e.target === backdrop && closeModal();
    document.getElementById('mmx-close').onclick = closeModal;
    document.getElementById('mmx-refresh').onclick = () => { refreshMeta(); refreshPreview(); };
    document.getElementById('mmx-copy').onclick = async () => {
      const { text, count } = buildExport();
      if (!count) return toast('Nothing to export');
      const ok = await copyToClipboard(text);
      toast(ok ? `Copied ${count}` : 'Copy failed');
    };
    document.getElementById('mmx-dl').onclick = () => {
      const { words } = buildExport();
      if (!words.length) return toast('Nothing to export');
      const filename = (document.getElementById('mmx-filename').value || 'marumori_export.csv').trim();
      downloadText(filename.endsWith('.csv') ? filename : `${filename}.csv`, formatWords(words, 'csv'), 'text/csv;charset=utf-8');
      toast(`Downloaded ${words.length}`);
    };
    document.getElementById('mmx-api').onclick = async () => {
      const ok = await tryFetchApiNow();
      refreshSubline();
      refreshMeta();
      refreshPreview();
      toast(ok ? `Loaded ${Store.apiItems.length} from API` : 'API load failed');
    };
    document.getElementById('mmx-status').onchange = () => { refreshMeta(); refreshPreview(); };
    document.getElementById('mmx-format').onchange = () => refreshPreview();
  }

  function openModal() {
    ensureModal();
    document.getElementById(UI.modalBackdropId).style.display = 'flex';
    refreshSubline();
    refreshMeta();
    refreshPreview();
  }

  function closeModal() {
    const b = document.getElementById(UI.modalBackdropId);
    if (b) b.style.display = 'none';
  }

  function buildExport() {
    const items = getEffectiveItems();
    const status = document.getElementById('mmx-status')?.value || 'known';
    const format = document.getElementById('mmx-format')?.value || 'newline';
    const words = filterWords(items, status);
    return { words, text: formatWords(words, format), count: words.length };
  }

  function refreshPreview() {
    const preview = document.getElementById('mmx-preview');
    if (!preview) return;
    const { text, count } = buildExport();
    preview.value = count ? text : 'Nothing loaded';
  }

  function refreshMeta() {
    const meta = document.getElementById('mmx-meta');
    if (!meta) return;
    const items = getEffectiveItems();
    const counts = items.reduce((acc, it) => {
      acc.all++;
      if (acc[it.status] !== undefined) acc[it.status]++;
      return acc;
    }, { all: 0, known: 0, learning: 0, new: 0 });
    const src = Array.isArray(Store.apiItems) && Store.apiItems.length ? `API (${Store.apiItems.length})` : `DOM (~${collectItemsFromDOM().length})`;
    meta.textContent = `Source: ${src} | Total: ${counts.all} | Known: ${counts.known} | Learning: ${counts.learning} | New: ${counts.new}`;
  }

  function hookFetch() {
    if (Store.hooksInstalled) return;
    Store.hooksInstalled = true;

    const origFetch = window.fetch;
    window.fetch = async function (...args) {
      const res = await origFetch.apply(this, args);
      try {
        const url = String(args?.[0]?.url || args?.[0] || '');
        if (url.includes('api.marumori.io') && url.includes('/studylists/items/')) {
          const clone = res.clone();
          clone.json().then((data) => setApiItemsFromPayload(data, url)).catch(() => {});
        }
      } catch {}
      return res;
    };

    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      this.__mmx_url = url;
      return origOpen.call(this, method, url, ...rest);
    };

    XMLHttpRequest.prototype.send = function (...args) {
      try {
        this.addEventListener('load', function () {
          try {
            const url = String(this.__mmx_url || '');
            if (url.includes('api.marumori.io') && url.includes('/studylists/items/')) {
              const txt = this.responseText;
              if (txt && typeof txt === 'string') setApiItemsFromPayload(JSON.parse(txt), url);
            }
          } catch {}
        });
      } catch {}
      return origSend.apply(this, args);
    };
  }

  async function tryFetchApiNow() {
    const listId = getListId(location.pathname);
    if (!listId) return false;
    const url = `https://api.marumori.io/studylists/items/${encodeURIComponent(listId)}`;
    Store.apiUrl = url;
    try {
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) return false;
      const data = await res.json();
      return setApiItemsFromPayload(data, url);
    } catch {
      return false;
    }
  }

  function resetForList(listId) {
    Store.currentListId = listId;
    Store.apiItems = null;
    Store.apiUrl = null;
    Store.lastUpdatedAt = null;
  }

  function installRouterWatcher() {
    if (installRouterWatcher._done) return;
    installRouterWatcher._done = true;

    const fire = () => window.dispatchEvent(new Event('mmx:route'));

    const wrap = (name) => {
      const orig = history[name];
      history[name] = function (...args) {
        const r = orig.apply(this, args);
        fire();
        return r;
      };
    };

    wrap('pushState');
    wrap('replaceState');
    window.addEventListener('popstate', fire);
  }

  async function mountIfNeeded() {
    const onManage = isManagePath(location.pathname);
    if (!onManage) {
      if (Store.mounted) removeUI();
      return;
    }

    const id = getListId(location.pathname);
    if (!id) return;

    if (Store.currentListId !== id) resetForList(id);

    injectStyles();

    for (let i = 0; i < 80; i++) {
      if (document.body) break;
      await sleep(25);
    }

    ensureBar();
    Store.mounted = true;

    setTimeout(() => { tryFetchApiNow().then(() => refreshSubline()); }, 0);
  }

  async function boot() {
    hookFetch();
    installRouterWatcher();

    await mountIfNeeded();

    window.addEventListener('mmx:route', () => {
      mountIfNeeded();
    });

    let scheduled = false;
    const obs = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        if (!isManagePath(location.pathname)) return;
        injectStyles();
        ensureBar();
      });
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  boot();
})();
