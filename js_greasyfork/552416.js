// ==UserScript==
// @name         Trello Unsaved Comment Tracker
// @namespace    https://greasyfork.org/en/users/1525721-moshiwake
// @version      1.3.1
// @description  Tracks unsaved comment drafts via a small chip on the bottom right, and alerts you if any unsaved comments exist when leaving Trello
// @author       Ruben Van den Broeck
// @license      MIT
// @match        https://trello.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552416/Trello%20Unsaved%20Comment%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/552416/Trello%20Unsaved%20Comment%20Tracker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const POLL_MS = 700;              // sample editor
  const URL_POLL_MS = 600;          // refresh chip/unload hooks
  const TYPING_STABLE_FOR_MS = 900; // stable text before saving
  const ENABLE_BEFOREUNLOAD = true;
  const STORAGE_KEY = 'trello_unsaved_drafts_v4';

  const now = () => Date.now();

  // ---------- URL/card helpers ----------
  function getCardIdFromUrl(url = location.href) {
    const m = url.match(/\/c\/([A-Za-z0-9]+)\b/) || url.match(/\/card\/[^/]+\/([A-Za-z0-9]+)/);
    return m ? m[1] : null;
  }

  // ---------- editor detection ----------
  function visible(el) { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; }

  function findCommentEditor() {
    const scopes = [
      '[data-testid="card-detail-window"]',
      '[data-testid="card-detail-view"]',
      '[role="dialog"]',
      'body'
    ];
    const sels = [
      '[data-testid="comment-composer"] [contenteditable="true"]',
      '[data-test-id="comment-composer"] [contenteditable="true"]',
      'textarea.js-new-comment-input',
      'textarea[placeholder*="comment"]',
      '[role="textbox"][contenteditable="true"]',
      '[contenteditable="true"]'
    ];
    for (const scopeSel of scopes) {
      const scope = document.querySelector(scopeSel);
      if (!scope) continue;
      for (const sel of sels) {
        const el = scope.querySelector(sel);
        if (el && visible(el)) return el;
      }
    }
    return null;
  }

  function readEditorText(el) {
    if (!el) return '';
    const raw = 'value' in el ? (el.value || '') : (el.innerText || el.textContent || '');
    const cleaned = (raw || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
    // Filter out Trello's placeholder text
    if (cleaned === 'Write a comment…' || cleaned === 'Write a comment...') return '';
    return cleaned;
  }

  function setEditorText(el, text) {
    if (!el) return;
    text = text || '';
    try {
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel.removeAllRanges(); sel.addRange(range);
      document.execCommand('delete', false, null);
      if (text) document.execCommand('insertText', false, text);
    } catch {
      if ('value' in el) el.value = text;
      else el.textContent = text;
    }
  }

  // ---------- drafts ----------
  function readAllDrafts() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; } }
  function writeAllDrafts(map) { localStorage.setItem(STORAGE_KEY, JSON.stringify(map)); updateChip(); maybeArmBeforeUnload(); }
  function getDraft(cardId) { return readAllDrafts()[cardId] || null; }
  function setDraft(cardId, payload) {
    const map = readAllDrafts();
    if (!payload || !payload.text || !payload.text.trim()) {
      delete map[cardId];
    } else {
      map[cardId] = { text: payload.text.trim(), updatedAt: now(), url: location.href, title: document.title };
    }
    writeAllDrafts(map);
  }
  const draftCount = () => Object.keys(readAllDrafts()).length;
  function listDraftsSorted() {
    const all = readAllDrafts();
    return Object.entries(all).map(([cardId, d]) => ({ cardId, ...d }))
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }

  // ---------- UI: chip + panel ----------
  let chipEl, panelEl, panelListEl;
  function ensureRoot() {
    let root = document.getElementById('tmk-drafts-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'tmk-drafts-root';
      root.style.all = 'initial';
      root.style.position = 'fixed';
      root.style.zIndex = '2147483647';
      document.documentElement.appendChild(root);
    }
    return root;
  }

  function ensureChip() {
    if (chipEl) return chipEl;
    const root = ensureRoot();
    chipEl = document.createElement('div');
    Object.assign(chipEl.style, {
      position: 'fixed', bottom: '16px', right: '16px',
      background: '#0a84ff', color: '#fff', padding: '6px 10px',
      borderRadius: '999px', font: '12px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
      boxShadow: '0 6px 20px rgba(0,0,0,.25)', cursor: 'pointer', userSelect: 'none', opacity: '0',
      transition: 'opacity .15s ease'
    });
    chipEl.textContent = 'Drafts: 0';
    chipEl.title = 'Click to see unsaved comment drafts';
    chipEl.addEventListener('click', togglePanel, true);
    root.appendChild(chipEl);
    return chipEl;
  }

  function ensurePanel() {
    if (panelEl) return panelEl;
    const root = ensureRoot();
    panelEl = document.createElement('div');
    Object.assign(panelEl.style, {
      position: 'fixed', bottom: '54px', right: '16px',
      background: '#fff', color: '#111', minWidth: '280px', maxWidth: '360px', maxHeight: '50vh',
      borderRadius: '12px', boxShadow: '0 12px 28px rgba(0,0,0,.28)', border: '1px solid rgba(0,0,0,.08)',
      display: 'none', font: '12px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif'
    });

    const header = document.createElement('div');
    header.textContent = 'Unsaved drafts';
    Object.assign(header.style, { fontWeight: '600', padding: '10px 12px', borderBottom: '1px solid rgba(0,0,0,.06)' });

    panelListEl = document.createElement('div');
    Object.assign(panelListEl.style, { padding: '4px 0', overflow: 'auto' });

    panelEl.appendChild(header);
    panelEl.appendChild(panelListEl);
    root.appendChild(panelEl);
    return panelEl;
  }

  function togglePanel(e) {
    e.stopPropagation();
    const p = ensurePanel();
    if (p.style.display === 'none') {
      renderPanelList();
      p.style.display = 'block';
      const outside = (ev) => {
        if (!p.contains(ev.target) && ev.target !== chipEl) {
          p.style.display = 'none';
          document.removeEventListener('click', outside, true);
        }
      };
      setTimeout(() => document.addEventListener('click', outside, true), 0);
    } else {
      p.style.display = 'none';
    }
  }

  function renderPanelList() {
    const list = listDraftsSorted();
    panelListEl.innerHTML = '';
    if (list.length === 0) {
      const empty = document.createElement('div');
      empty.textContent = 'No drafts.';
      Object.assign(empty.style, { padding: '10px 12px', color: '#555' });
      panelListEl.appendChild(empty);
      return;
    }
    for (const d of list) {
      const item = document.createElement('div');
      Object.assign(item.style, {
        padding: '8px 12px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '6px',
        cursor: 'pointer', alignItems: 'baseline'
      });
      item.addEventListener('click', () => { location.href = d.url; });

      const left = document.createElement('div');
      const ttl = document.createElement('div');
      ttl.textContent = (d.title || '').replace(/\s+— Trello.*$/, '') || d.cardId;
      ttl.style.fontWeight = '600';

      const snippet = document.createElement('div');
      snippet.textContent = (d.text || '').slice(0, 140).replace(/\s+/g, ' ').trim();
      snippet.style.color = '#444';

      left.appendChild(ttl);
      left.appendChild(snippet);

      const ts = document.createElement('div');
      ts.textContent = timeAgo(d.updatedAt);
      ts.style.color = '#666';

      item.appendChild(left);
      item.appendChild(ts);

      item.addEventListener('mouseenter', () => item.style.background = 'rgba(0,0,0,.04)');
      item.addEventListener('mouseleave', () => item.style.background = 'transparent');

      panelListEl.appendChild(item);
    }
  }

  function timeAgo(t) {
    if (!t) return '';
    const s = Math.max(1, Math.floor((now() - t) / 1000));
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    const d = Math.floor(h / 24);
    return `${d}d`;
  }

  function updateChip() {
    const n = draftCount();
    const c = ensureChip();
    c.textContent = `Drafts: ${n}`;
    c.style.opacity = n > 0 ? '1' : '0';
  }

  // ---------- network hook: clear on real comment POST ----------
  hookNetworkForComments();

  function hookNetworkForComments() {
    // fetch
    const ofetch = window.fetch;
    window.fetch = async function(input, init) {
      const url = typeof input === 'string' ? input : (input && input.url) || '';
      const method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
      const looksLikeComment = isCommentEndpoint(url, init && init.body);
      const res = await ofetch.apply(this, arguments);
      // Clear draft on successful POST (new comment) or PUT (edit comment)
      if ((method === 'POST' || method === 'PUT') && looksLikeComment && res && res.ok) {
        const cid = getCardIdFromUrl();
        if (cid) setDraft(cid, null);
      }
      return res;
    };

    // XHR
    const OX = window.XMLHttpRequest;
    function X() { return new OX(); }
    X.prototype = OX.prototype;
    window.XMLHttpRequest = X;

    const openOrig = OX.prototype.open;
    const sendOrig = OX.prototype.send;

    OX.prototype.open = function(method, url) {
      this.__unsaved__ = { method: String(method || 'GET').toUpperCase(), url: String(url || '') };
      return openOrig.apply(this, arguments);
    };
    OX.prototype.send = function(body) {
      const info = this.__unsaved__ || {};
      const looksLikeComment = isCommentEndpoint(info.url, body);
      // Clear draft on successful POST (new comment) or PUT (edit comment)
      if ((info.method === 'POST' || info.method === 'PUT') && looksLikeComment) {
        this.addEventListener('load', () => {
          if (this.status >= 200 && this.status < 300) {
            const cid = getCardIdFromUrl();
            if (cid) setDraft(cid, null);
          }
        });
      }
      return sendOrig.apply(this, arguments);
    };
  }

  function isCommentEndpoint(url, body) {
    // cover REST v1, internal /actions/comments, and GraphQL
    if (!url) return false;
    // New comment creation
    if (/\/1\/cards\/[^/]+\/actions\/comments\b/.test(url)) return true;
    // Editing existing comment (PUT to /1/actions/[actionId])
    // Match: https://trello.com/1/actions/682c11ccb82b8e67e5cb752f
    if (/\/1\/actions\/[a-f0-9]{24}\b/.test(url)) return true;
    if (/\/actions\b/.test(url) && body && /text=|comment/i.test(String(body))) return true;
    if (/graphql/i.test(url) && body && /comment/i.test(String(body))) return true;
    return false;
  }

  // ---------- sampling loop: save/restore ----------
  let currentCardId = null;
  let lastSampleText = '';
  let lastSampleAt = 0;

  setInterval(() => {
    const cid = getCardIdFromUrl();
    if (cid !== currentCardId) {
      currentCardId = cid;
      lastSampleText = '';
      lastSampleAt = 0;
      if (cid) restoreDraftIntoEditor(cid);
    }
    if (!cid) return;

    const editor = findCommentEditor();
    if (!editor) return;

    const txt = readEditorText(editor);
    const changed = txt !== lastSampleText;
    const since = now() - lastSampleAt;

    if (changed) {
      lastSampleText = txt;
      lastSampleAt = now();
      // Clear draft immediately if text is empty (no need to wait for stable delay)
      if (!txt || !txt.trim()) {
        if (getDraft(cid)) setDraft(cid, null);
      }
      return;
    }

    if (since >= TYPING_STABLE_FOR_MS) {
      if (txt && txt.trim()) setDraft(cid, { text: txt });
      else if (getDraft(cid)) setDraft(cid, null);
    }
  }, POLL_MS);

  function restoreDraftIntoEditor(cid) {
    const d = getDraft(cid);
    if (!d || !d.text) return;
    const editor = findCommentEditor();
    if (!editor) return;
    const current = readEditorText(editor);
    if (!current) setEditorText(editor, d.text);
  }

  // ---------- beforeunload ----------
  function maybeArmBeforeUnload() {
    if (!ENABLE_BEFOREUNLOAD) return;
    const anyDrafts = draftCount() > 0;
    const handler = (e) => {
      if (draftCount() > 0) { e.preventDefault(); e.returnValue = ''; return ''; }
    };
    if (anyDrafts && !window.__trello_unload_bound) {
      window.addEventListener('beforeunload', handler);
      window.__trello_unload_bound = true;
      window.__trello_unload_handler = handler;
    } else if (!anyDrafts && window.__trello_unload_bound) {
      window.removeEventListener('beforeunload', window.__trello_unload_handler);
      window.__trello_unload_bound = false;
      window.__trello_unload_handler = null;
    }
  }
  setInterval(() => { updateChip(); maybeArmBeforeUnload(); }, URL_POLL_MS);

  // ---------- init ----------
  ensureChip();
  ensurePanel();
  updateChip();
  maybeArmBeforeUnload();
})();