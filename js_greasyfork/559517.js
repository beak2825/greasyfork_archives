// ==UserScript==
// @name         ChatGPT Fold (Sticky Left Gutter + Bottom-Right Controls)
// @namespace    local.tm.chatgpt.fold.min
// @version      1.4.0
// @description  Minimal fold/unfold for ChatGPT messages (user+assistant) with sticky left-gutter toggle, stable memory, and bottom-right collapse controls.
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// @license free for all!
// @downloadURL https://update.greasyfork.org/scripts/559517/ChatGPT%20Fold%20%28Sticky%20Left%20Gutter%20%2B%20Bottom-Right%20Controls%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559517/ChatGPT%20Fold%20%28Sticky%20Left%20Gutter%20%2B%20Bottom-Right%20Controls%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // -----------------------------
  // Storage (per conversation = pathname)
  // -----------------------------
  const storageKey = () => `tmFoldState:min:${location.pathname}`;

  function safeJsonParse(s, fallback) {
    try { return JSON.parse(s); } catch { return fallback; }
  }

  function loadState() {
    const parsed = safeJsonParse(localStorage.getItem(storageKey()), {});
    return (parsed && typeof parsed === 'object') ? parsed : {};
  }

  let state = loadState();
  let lastPath = location.pathname;

  function saveState() {
    if (!state || typeof state !== 'object') state = {};
    localStorage.setItem(storageKey(), JSON.stringify(state));
  }

  function reloadStateIfPathChanged() {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      state = loadState();
      processed = new WeakSet();
      ensureFloatingControls(); // keep controls alive across SPA navigation
    }
  }

  // -----------------------------
  // Sticky top offset (avoid header overlap)
  // -----------------------------
  function updateStickyTop() {
    const candidates = Array.from(document.querySelectorAll('header,[role="banner"],nav'))
      .filter(el => el && el.getBoundingClientRect)
      .map(el => ({ el, r: el.getBoundingClientRect() }))
      .filter(x => x.r.height >= 40 && x.r.height <= 180 && x.r.top <= 5 && x.r.bottom > 30);

    const headerH = candidates.length ? Math.max(...candidates.map(x => x.r.height)) : 64;
    const offset = Math.ceil(headerH + 10);
    document.documentElement.style.setProperty('--tmfold-sticky-top', `${offset}px`);
  }

  // -----------------------------
  // DOM discovery
  // -----------------------------
  function findMessageRoots() {
    return Array.from(
      document.querySelectorAll('[data-message-author-role="assistant"], [data-message-author-role="user"]')
    ).filter(Boolean);
  }

  function normalizeText(s) {
    return (s || '').replace(/\s+/g, ' ').trim();
  }

  // Stable hash (djb2) => base36
  function hashStr(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i);
    return (h >>> 0).toString(36);
  }

  function findMessageContent(root) {
    if (!root) return null;

    const preferred = [
      root.querySelector('[data-message-content]'),
      root.querySelector('.markdown'),
      root.querySelector('.prose'),
      root.querySelector('[class*="markdown"]'),
      root.querySelector('[class*="prose"]'),
      root.querySelector('[class*="whitespace-pre-wrap"]'),
      root.querySelector('[class*="break-words"]')
    ].filter(Boolean);

    if (preferred.length) {
      preferred.sort((a, b) => (b.innerText || '').length - (a.innerText || '').length);
      return preferred[0];
    }

    const descendants = Array.from(root.querySelectorAll('*'))
      .filter(el => el && el !== root)
      .filter(el => !el.closest?.('[data-tmfold-toggle="1"], [data-tmfold-preview="1"], [data-tmfold-wrap="1"]'))
      .filter(el => normalizeText(el.innerText || el.textContent || '').length > 0);

    if (!descendants.length) return null;

    descendants.sort((a, b) => {
      const la = normalizeText(a.innerText || a.textContent || '').length;
      const lb = normalizeText(b.innerText || b.textContent || '').length;
      return lb - la;
    });

    return descendants[0];
  }

  // Avoid display: contents wrappers
  function findHostElement(root, content) {
    if (!root || !content) return root;

    let el = content;
    while (el && el !== root) {
      const p = el.parentElement;
      if (!p) break;
      if (getComputedStyle(p).display !== 'contents') return p;
      el = p;
    }
    if (getComputedStyle(root).display !== 'contents') return root;
    return content.parentElement || root;
  }

  function ensurePositioning(host) {
    if (!host) return;
    const cs = getComputedStyle(host);
    if (cs.position === 'static') host.style.position = 'relative';
    if (cs.overflow !== 'visible') host.style.overflow = 'visible';
  }

  function makeOneLinePreview(contentEl) {
    const raw = normalizeText(contentEl?.innerText || contentEl?.textContent || '');
    if (!raw) return '…';
    return raw.length > 160 ? raw.slice(0, 160) + '…' : raw;
  }

  // Stable ID: role + hash of message text (cap for speed) + length
  function getStableMessageId(root, content) {
    const role = root.getAttribute('data-message-author-role') || 'msg';
    const text = normalizeText(content?.innerText || content?.textContent || '');
    const sample = text.slice(0, 3000);
    return `${role}:${hashStr(sample)}:${text.length}`;
  }

  // -----------------------------
  // Folding
  // -----------------------------
  let processed = new WeakSet();

  function setFolded(host, content, msgId, folded) {
    const preview = host.querySelector('[data-tmfold-preview="1"]');
    const btn = host.querySelector('[data-tmfold-toggle="1"]');
    if (!preview || !btn || !content) return;

    host.classList.toggle('tmfold-folded', !!folded);
    preview.style.display = folded ? 'block' : 'none';
    content.style.display = folded ? 'none' : '';

    btn.textContent = folded ? '>' : 'v';
    btn.title = folded ? 'Expand message' : 'Fold message';

    if (!state || typeof state !== 'object') state = {};
    state[msgId] = !!folded;
    saveState();
  }

  function applyToMessage(root) {
    if (!root || processed.has(root)) return;

    // Skip if already injected
    if (root.querySelector('[data-tmfold-toggle="1"]')) {
      processed.add(root);
      return;
    }

    const content = findMessageContent(root);
    if (!content) return;

    processed.add(root);

    const host = findHostElement(root, content);
    ensurePositioning(host);

    const msgId = getStableMessageId(root, content);

    // Preview (only when folded)
    const preview = document.createElement('div');
    preview.setAttribute('data-tmfold-preview', '1');
    preview.className = 'tmfold-preview';
    preview.textContent = makeOneLinePreview(content);
    preview.style.display = 'none';

    if (content.parentNode) content.parentNode.insertBefore(preview, content);
    else host.insertBefore(preview, host.firstChild);

    // Sticky wrapper for button
    const wrap = document.createElement('div');
    wrap.setAttribute('data-tmfold-wrap', '1');
    wrap.className = 'tmfold-stickywrap';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-tmfold-toggle', '1');
    btn.className = 'tmfold-toggle';
    btn.textContent = 'V';
    btn.title = 'Fold message';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const folded = host.classList.contains('tmfold-folded');
      setFolded(host, content, msgId, !folded);
    });

    wrap.appendChild(btn);
    host.insertBefore(wrap, host.firstChild);

    // No auto-collapse: default expanded unless remembered folded
    const remembered = Object.prototype.hasOwnProperty.call(state, msgId) ? state[msgId] : false;
    setFolded(host, content, msgId, !!remembered);
  }

  function rescan() {
    reloadStateIfPathChanged();
    updateStickyTop();
    findMessageRoots().forEach(applyToMessage);
  }

  // -----------------------------
  // Bottom-right controls
  // -----------------------------
  function withAllMessages(fnFolded) {
    // Ensure everything is injected first
    rescan();

    const roots = findMessageRoots();
    for (const root of roots) {
      const content = findMessageContent(root);
      if (!content) continue;

      const host = findHostElement(root, content);
      ensurePositioning(host);

      // If not injected yet for some reason, inject now
      if (!host.querySelector('[data-tmfold-toggle="1"]')) {
        applyToMessage(root);
      }

      const msgId = getStableMessageId(root, content);
      fnFolded(host, content, msgId);
    }
  }

  function collapseAll() {
    withAllMessages((host, content, msgId) => setFolded(host, content, msgId, true));
  }

  function expandAll() {
    withAllMessages((host, content, msgId) => setFolded(host, content, msgId, false));
  }

  function resetMemoryThisChat() {
    localStorage.removeItem(storageKey());
    state = {};
    // Keep UI expanded after reset (feel free to change)
    expandAll();
  }

  function ensureFloatingControls() {
    if (document.getElementById('tmfold-float-controls')) return;

    const box = document.createElement('div');
    box.id = 'tmfold-float-controls';
    box.innerHTML = `
      <button type="button" data-act="collapse" title="Collapse all">Collapse</button>
      <button type="button" data-act="expand"   title="Expand all">Expand</button>
      <button type="button" data-act="reset"    title="Reset saved folds (this chat)">Reset</button>
    `;

    box.addEventListener('click', (e) => {
      const b = e.target?.closest?.('button');
      if (!b) return;
      const act = b.getAttribute('data-act');
      if (act === 'collapse') collapseAll();
      if (act === 'expand') expandAll();
      if (act === 'reset') resetMemoryThisChat();
    });

    document.body.appendChild(box);
  }

  // -----------------------------
  // Observe dynamic updates
  // -----------------------------
  let scanScheduled = false;
  function scheduleScan() {
    if (scanScheduled) return;
    scanScheduled = true;
    requestAnimationFrame(() => {
      scanScheduled = false;
      ensureFloatingControls();
      rescan();
    });
  }

  const mo = new MutationObserver(scheduleScan);
  mo.observe(document.documentElement || document.body, { childList: true, subtree: true });

  window.addEventListener('resize', () => updateStickyTop(), { passive: true });
  window.addEventListener('popstate', scheduleScan, { passive: true });

  // -----------------------------
  // Styles
  // -----------------------------
  GM_addStyle(`
    .tmfold-stickywrap {
      position: sticky;
      top: var(--tmfold-sticky-top, 72px);
      height: 0;
      overflow: visible;
      z-index: 1;
    }

    .tmfold-toggle {
      position: absolute;
      left: -58px;
      top: 0;

      width: 28px;
      height: 22px;
      border-radius: 4px;

      display: flex;
      align-items: center;
      justify-content: center;

      padding: 0;
      background: #ffffff;
      border: 1px solid rgba(0,0,0,0.25);
      color: #111111;

      font: 300 13px/1 Arial, sans-serif;
      cursor: pointer;
      user-select: none;

      box-shadow: none;
      background-image: none;
    }

    .tmfold-toggle:hover { background: #f2f2f2; }
    .tmfold-toggle:active { background: #e6e6e6; }

    .tmfold-preview {
      margin: 8px 0;
      padding: 8px 10px;
      border: 1px solid rgba(127,127,127,0.35);
      border-radius: 6px;
      background: rgba(127,127,127,0.08);
      color: inherit;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Bottom-right controls */
    #tmfold-float-controls {
      position: fixed;
      right: 12px;
      bottom: 12px;
      z-index: 100000;

      display: flex;
      flex-direction: column;
      gap: 8px;

      pointer-events: auto;
    }

    #tmfold-float-controls button {
      width: 74px;
      height: 28px;
      border-radius: 6px;

      background: #ffffff;
      border: 1px solid rgba(0,0,0,0.25);
      color: #111111;

      font: 600 12px/1 Arial, sans-serif;
      cursor: pointer;
      user-select: none;

      box-shadow: none;
      background-image: none;
    }

    #tmfold-float-controls button:hover { background: #f2f2f2; }
    #tmfold-float-controls button:active { background: #e6e6e6; }
  `);

  // Start
  scheduleScan();
})();
