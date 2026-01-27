// ==UserScript==
// @name         DeepSeek Chat Code Exporter
// @namespace    https://tampermonkey.net/
// @version      1.2.0
// @description  Extract visible code blocks from DeepSeek chat with a draggable UI.
// @match        https://chat.deepseek.com/*
// @grant        GM_download
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564272/DeepSeek%20Chat%20Code%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/564272/DeepSeek%20Chat%20Code%20Exporter.meta.js
// ==/UserScript==


(() => {
  'use strict';

  const DEBUG = true; // set false once working
  const STORAGE_KEY = 'ds_code_exporter_state_v1_hardened';
  const DEFAULT_STATE = { x: 24, y: 24, prependMode: 'none', collapsed: false };

  const log = (...args) => DEBUG && console.log('%c[DS-EXPORT]', 'color:#7dd3fc;font-weight:700', ...args);
  const warn = (...args) => console.warn('[DS-EXPORT]', ...args);

  // ---- Confirm script executed at all
  log('Userscript loaded', { href: location.href, readyState: document.readyState });

  // One-time native signal if injection keeps failing (proves script runs)
  const alertOnce = (() => {
    let fired = false;
    return (msg) => {
      if (fired) return;
      fired = true;
      alert(msg);
    };
  })();

  function loadState() {
    try { return { ...DEFAULT_STATE, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) }; }
    catch { return { ...DEFAULT_STATE }; }
  }
  function saveState(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }

  function debounce(fn, ms = 250) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  function isVisible(el) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
    return (h >>> 0).toString(16);
  }

  function sanitize(s) {
    return (s || '')
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '')
      .slice(0, 80);
  }

  function nowToken() {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}_${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}${String(d.getSeconds()).padStart(2,'0')}`;
  }

  function getTitleToken() {
    // Best-effort: use document.title (works on most SPAs)
    return sanitize(document.title || 'DeepSeek_Chat') || 'DeepSeek_Chat';
  }

  function extFromLang(lang) {
    const L = (lang || '').toLowerCase().trim().replace(/^language-/, '');
    const map = {
      js:'js', javascript:'js', node:'js',
      ts:'ts', typescript:'ts',
      py:'py', python:'py',
      bash:'sh', sh:'sh', shell:'sh', zsh:'sh',
      ps1:'ps1', powershell:'ps1',
      json:'json',
      yml:'yml', yaml:'yml',
      md:'md', markdown:'md',
      html:'html', xml:'xml',
      css:'css', scss:'scss',
      go:'go',
      rs:'rs', rust:'rs',
      java:'java',
      c:'c',
      cpp:'cpp', 'c++':'cpp',
      cs:'cs', csharp:'cs',
      php:'php',
      rb:'rb', ruby:'rb',
      sql:'sql',
      toml:'toml',
      ini:'ini',
      diff:'diff',
      txt:'txt'
    };
    return map[L] || 'txt';
  }

  function download(filename, text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    if (typeof GM_download === 'function') {
      GM_download({
        url,
        name: filename,
        saveAs: true,
        onload: () => URL.revokeObjectURL(url),
        onerror: (e) => {
          warn('GM_download failed, falling back', e);
          fallback(url, filename);
        }
      });
    } else {
      fallback(url, filename);
    }
  }

  function fallback(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ---------- Resilient code block detection ----------
  function detectCodeBlocks() {
    // Primary: <pre><code>…</code></pre>
    const pres = Array.from(document.querySelectorAll('pre')).filter(isVisible);

    const out = [];
    const seen = new Set();

    for (const pre of pres) {
      const codeEl = pre.querySelector('code') || pre;
      const code = (codeEl.textContent || '').replace(/\u00a0/g, ' ');
      if (!code.trim()) continue;

      // language tags from class: language-js, lang-js, etc.
      const cls = (codeEl.className || '') + ' ' + (pre.className || '');
      const m = cls.match(/\b(?:language|lang)-([a-z0-9#+._-]+)\b/i);
      const lang = m ? m[1] : (codeEl.getAttribute('data-language') || pre.getAttribute('data-language') || '');

      const id = hash((lang || '').toLowerCase() + '::' + code);
      if (seen.has(id)) continue;
      seen.add(id);

      out.push({ id, lang: lang || '', code });
    }

    return out;
  }

  // ---------- UI / Live Plan ----------
  let state = loadState();
  let detected = [];
  let lastSig = '';
  let ui = null;

  function buildPrefix() {
    const parts = [];
    if (state.prependMode === 'timestamp' || state.prependMode === 'both') parts.push(nowToken());
    if (state.prependMode === 'title' || state.prependMode === 'both') parts.push(getTitleToken());
    return parts.length ? parts.join('__') + '__' : '';
  }

  function buildPlanAndUpdate() {
    const blocks = detectCodeBlocks();

    const sig = state.prependMode + '::' + blocks.map(b => b.id).join('|');
    if (sig === lastSig && ui) return;
    lastSig = sig;

    const prefix = buildPrefix();
    detected = blocks.map((b, i) => {
      const idx = String(i + 1).padStart(3, '0');
      const ext = extFromLang(b.lang);
      const filename = `${prefix}code_${idx}.${ext}`;
      return { ...b, idx, ext, filename };
    });

    if (ui) updateUI();
  }

  const refresh = debounce(buildPlanAndUpdate, 250);

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #dsx-root {
        position: fixed;
        z-index: 2147483647;
        width: 340px;
        max-width: 46vw;
        color: #eee;
        background: rgba(18,18,20,.94);
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 12px;
        box-shadow: 0 14px 40px rgba(0,0,0,.45);
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        user-select: none;
      }
      #dsx-header {
        padding: 10px 12px;
        cursor: move;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        background: rgba(255,255,255,.05);
        border-bottom: 1px solid rgba(255,255,255,.10);
      }
      #dsx-title { font-size: 12.5px; font-weight: 750; letter-spacing: .2px; }
      #dsx-collapse {
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.06);
        color: #fff;
        padding: 4px 8px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 12px;
      }
      #dsx-body { padding: 10px 12px 12px; }
      #dsx-status { font-size: 12px; opacity: .9; margin-bottom: 8px; }
      #dsx-row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
      #dsx-row label { font-size: 12px; opacity: .85; white-space: nowrap; }
      #dsx-prepend {
        flex: 1;
        background: rgba(255,255,255,.06);
        border: 1px solid rgba(255,255,255,.12);
        color: #fff;
        border-radius: 8px;
        padding: 7px 8px;
        font-size: 12px;
        outline: none;
      }
      #dsx-preview {
        height: 150px;
        overflow: auto;
        white-space: pre;
        background: rgba(0,0,0,.28);
        border: 1px solid rgba(255,255,255,.10);
        border-radius: 10px;
        padding: 8px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
        font-size: 11.5px;
        line-height: 1.35;
        user-select: text;
      }
      #dsx-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
      .dsx-btn {
        cursor: pointer;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.06);
        color: #fff;
        border-radius: 10px;
        padding: 9px 10px;
        font-size: 12px;
        font-weight: 750;
      }
      .dsx-btn:disabled { cursor: not-allowed; opacity: .55; }
    `;
    document.head.appendChild(style);
  }

  function createUI() {
    // Don’t create twice
    if (document.getElementById('dsx-root')) return;

    injectStyles();

    const root = document.createElement('div');
    root.id = 'dsx-root';
    root.style.left = `${state.x}px`;
    root.style.top = `${state.y}px`;

    root.innerHTML = `
      <div id="dsx-header">
        <div id="dsx-title">DeepSeek Code Exporter</div>
        <button id="dsx-collapse" type="button">${state.collapsed ? 'Expand' : 'Collapse'}</button>
      </div>
      <div id="dsx-body" style="display:${state.collapsed ? 'none' : 'block'}">
        <div id="dsx-status">Scanning…</div>
        <div id="dsx-row">
          <label for="dsx-prepend">Prepend:</label>
          <select id="dsx-prepend">
            <option value="none">None</option>
            <option value="timestamp">Timestamp</option>
            <option value="title">Conversation title</option>
            <option value="both">Timestamp + title</option>
          </select>
        </div>
        <div id="dsx-preview">—</div>
        <div id="dsx-btns">
          <button class="dsx-btn" id="dsx-sep" type="button">Export as Separate Files</button>
          <button class="dsx-btn" id="dsx-one" type="button">Export as Single File</button>
        </div>
      </div>
    `;

    document.body.appendChild(root);

    ui = {
      root,
      header: root.querySelector('#dsx-header'),
      body: root.querySelector('#dsx-body'),
      status: root.querySelector('#dsx-status'),
      preview: root.querySelector('#dsx-preview'),
      prepend: root.querySelector('#dsx-prepend'),
      collapse: root.querySelector('#dsx-collapse'),
      sep: root.querySelector('#dsx-sep'),
      one: root.querySelector('#dsx-one')
    };

    ui.prepend.value = state.prependMode;

    // Dragging (header only; ignore collapse button)
    let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;

    ui.header.addEventListener('mousedown', (e) => {
      if (e.target && e.target.id === 'dsx-collapse') return;
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      const r = ui.root.getBoundingClientRect();
      ox = r.left; oy = r.top;
      e.preventDefault();
      e.stopPropagation();
    }, true);

    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const nx = ox + (e.clientX - sx);
      const ny = oy + (e.clientY - sy);
      ui.root.style.left = `${nx}px`;
      ui.root.style.top = `${ny}px`;
      state.x = nx; state.y = ny;
      saveState(state);
    }, true);

    window.addEventListener('mouseup', () => { dragging = false; }, true);

    ui.collapse.addEventListener('click', () => {
      state.collapsed = !state.collapsed;
      ui.body.style.display = state.collapsed ? 'none' : 'block';
      ui.collapse.textContent = state.collapsed ? 'Expand' : 'Collapse';
      saveState(state);
    });

    ui.prepend.addEventListener('change', () => {
      state.prependMode = ui.prepend.value;
      saveState(state);
      buildPlanAndUpdate();
    });

    ui.sep.addEventListener('click', () => {
      buildPlanAndUpdate();
      if (!detected.length) return;
      for (const d of detected) download(d.filename, d.code);
    });

    ui.one.addEventListener('click', () => {
      buildPlanAndUpdate();
      if (!detected.length) return;

      const prefix = buildPrefix();
      const singleName = `${sanitize(prefix + 'deepseek_code_blocks')}.txt`;

      const out = [];
      out.push(`DeepSeek Code Export`);
      out.push(`ExportedAt: ${new Date().toISOString()}`);
      out.push(`Title: ${document.title || ''}`);
      out.push(`Blocks: ${detected.length}`);
      out.push('');
      out.push('============================================================');
      out.push('');

      for (const d of detected) {
        const lang = (d.lang || 'unknown').trim() || 'unknown';
        out.push(`----- BEGIN BLOCK ${d.idx} | lang=${lang} | suggestedFile=${d.filename} -----`);
        out.push(d.code);
        out.push(`----- END BLOCK ${d.idx} -----`);
        out.push('');
      }

      download(singleName, out.join('\n'));
    });

    updateUI();
    log('UI injected');
  }

  function updateUI() {
    if (!ui) return;

    const n = detected.length;
    ui.status.textContent = n ? `Detected ${n} code block(s)` : 'No visible code blocks detected.';
    ui.sep.disabled = n === 0;
    ui.one.disabled = n === 0;

    if (!n) {
      ui.preview.textContent = '—';
      return;
    }

    ui.preview.textContent = detected
      .map(d => `${d.idx}  ${d.filename}${d.lang ? ` (${d.lang})` : ''}`)
      .join('\n');
  }

  // ---------- Robust boot (retries until body exists, then observes SPA changes)
  function boot() {
    let attempts = 0;

    const tryStart = () => {
      attempts++;

      if (!document.body || !document.head) {
        if (attempts < 40) return setTimeout(tryStart, 250);
        warn('Failed to start: body/head missing too long');
        alertOnce('DeepSeek exporter: script ran, but page body/head never became available. Check extension permissions.');
        return;
      }

      // If the page is iframe-heavy, UI may be in a different frame than you expect.
      // We inject into current frame. If you see it nowhere, the script might be in the wrong frame.
      createUI();

      // Observe SPA mutations
      const obs = new MutationObserver(refresh);
      obs.observe(document.body, { childList: true, subtree: true, characterData: true });

      // Initial scans
      buildPlanAndUpdate();
      setTimeout(buildPlanAndUpdate, 800);
      setTimeout(buildPlanAndUpdate, 2000);
    };

    tryStart();
  }

  boot();
})();
