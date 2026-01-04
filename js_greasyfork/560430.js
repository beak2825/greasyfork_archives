// ==UserScript==
// @name         Cambridge Dictionary Helper
// @namespace    yaser.cambridge.popup.dictionary
// @version      1.7.4
// @description  Select text and press a configurable hotkey to show Cambridge Dictionary results with pronunciation + audio. Popup UI is style-isolated using Shadow DOM. Audio playback is CSP-safe by using blob URLs only. TrustedTypes-safe: no innerHTML. Modal key shield: blocks page/browser shortcuts while popup is open.
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      dictionary.cambridge.org
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560430/Cambridge%20Dictionary%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/560430/Cambridge%20Dictionary%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DEFAULT_HOTKEY = {
    altKey: true,
    ctrlKey: false,
    shiftKey: false,
    metaKey: false,
    code: 'KeyD',
  };

  const UI = {
    hostId: 'cambridge-popup-dict-host',
    backdropId: 'cambridge-popup-dict-backdrop',
    storageKeyPos: 'cambridge_popup_dict_position_v1',
    storageKeyHotkey: 'cambridge_popup_dict_hotkey_v1',
    maxItems: 8,
    signature: 'cpd-shadow-ui-v4-tt-safe-modal',
  };

  let ACTIVE_HOTKEY = loadHotkey();
  let isCapturingHotkey = false;
  let hotkeyCaptureListener = null;
  let isShortcutView = false;

  let currentAudio = {
    uk: null,
    us: null,
  };

  let lastViewState = {
    type: 'input',
    payload: {
      prefill: '',
    },
  };

  const audioBlobCache = new Map();
  let activeAudioEl = null;

  function clamp(value, min, max) {
    if (Number.isNaN(value)) {
      return min;
    }

    return Math.max(min, Math.min(max, value));
  }

  function stripTags(s) {
    return String(s || '').replace(/<[^>]*>/g, '');
  }

  function decodeEntities(s) {
    let out = String(s || '');

    const named = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#039;': "'",
      '&apos;': "'",
      '&nbsp;': ' ',
      '&hellip;': '...',
      '&ndash;': '-',
      '&mdash;': '-',
      '&middot;': '·',
    };

    for (const [k, v] of Object.entries(named)) {
      out = out.split(k).join(v);
    }

    out = out.replace(/&#(\d+);/g, (_, num) => {
      const code = Number(num);

      if (!Number.isFinite(code)) {
        return _;
      }

      return String.fromCodePoint(code);
    });

    out = out.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      const code = parseInt(hex, 16);

      if (!Number.isFinite(code)) {
        return _;
      }

      return String.fromCodePoint(code);
    });

    return out;
  }

  function cleanText(s) {
    return decodeEntities(stripTags(s))
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeCambridgeUrl(url) {
    if (!url) {
      return '';
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    if (url.startsWith('/')) {
      return `https://dictionary.cambridge.org${url}`;
    }

    return `https://dictionary.cambridge.org/${url}`;
  }

  function buildUrl(query) {
    const safe = encodeURIComponent(String(query || '').toLowerCase());

    return `https://dictionary.cambridge.org/dictionary/english/${safe}`;
  }

  function loadHotkey() {
    const stored = GM_getValue(
      UI.storageKeyHotkey,
      null,
    );

    if (!stored || typeof stored !== 'object') {
      return DEFAULT_HOTKEY;
    }

    return {
      altKey: Boolean(stored.altKey),
      ctrlKey: Boolean(stored.ctrlKey),
      shiftKey: Boolean(stored.shiftKey),
      metaKey: Boolean(stored.metaKey),
      code: String(stored.code || DEFAULT_HOTKEY.code),
    };
  }

  function saveHotkey(hotkey) {
    GM_setValue(
      UI.storageKeyHotkey,
      hotkey,
    );
  }

  function hotkeyToString(h) {
    const parts = [];

    if (h.ctrlKey) {
      parts.push('Ctrl');
    }

    if (h.altKey) {
      parts.push('Alt');
    }

    if (h.shiftKey) {
      parts.push('Shift');
    }

    if (h.metaKey) {
      parts.push('Meta');
    }

    let key = h.code || '';
    if (key.startsWith('Key')) {
      key = key.slice(3);
    } else if (key.startsWith('Digit')) {
      key = key.slice(5);
    }

    parts.push(key);

    return parts.join(' + ');
  }

  function isModifierEvent(e) {
    const modifierKeys = new Set([
      'Alt',
      'Shift',
      'Control',
      'Meta',
    ]);

    const modifierCodes = new Set([
      'AltLeft',
      'AltRight',
      'ShiftLeft',
      'ShiftRight',
      'ControlLeft',
      'ControlRight',
      'MetaLeft',
      'MetaRight',
    ]);

    if (modifierKeys.has(e.key)) {
      return true;
    }

    if (modifierCodes.has(e.code)) {
      return true;
    }

    return false;
  }

  function matchesHotkey(e) {
    return (
      e.code === ACTIVE_HOTKEY.code &&
      e.altKey === ACTIVE_HOTKEY.altKey &&
      e.ctrlKey === ACTIVE_HOTKEY.ctrlKey &&
      e.shiftKey === ACTIVE_HOTKEY.shiftKey &&
      e.metaKey === ACTIVE_HOTKEY.metaKey
    );
  }

  function isEditableTarget(target) {
    if (!target) {
      return false;
    }

    const tag = (target.tagName || '').toLowerCase();

    if (tag === 'input' || tag === 'textarea') {
      return true;
    }

    return Boolean(target.isContentEditable);
  }

  function fetchCambridgeHtml(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: {
          Accept: 'text/html',
        },
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) {
            resolve(res.responseText);

            return;
          }

          reject(new Error(`HTTP ${res.status}`));
        },
        onerror: () => reject(new Error('Network error')),
        ontimeout: () => reject(new Error('Timeout')),
        timeout: 15000,
      });
    });
  }

  function fetchMp3AsBlobUrl(mp3Url) {
    if (audioBlobCache.has(mp3Url)) {
      return Promise.resolve(audioBlobCache.get(mp3Url));
    }

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: mp3Url,
        responseType: 'arraybuffer',
        onload: (res) => {
          if (res.status < 200 || res.status >= 300) {
            reject(new Error(`Audio HTTP ${res.status}`));

            return;
          }

          try {
            const bytes = res.response;
            const blob = new Blob([bytes], { type: 'audio/mpeg' });
            const blobUrl = URL.createObjectURL(blob);

            audioBlobCache.set(mp3Url, blobUrl);

            resolve(blobUrl);
          } catch (err) {
            reject(err);
          }
        },
        onerror: () => reject(new Error('Audio network error')),
        ontimeout: () => reject(new Error('Audio timeout')),
        timeout: 15000,
      });
    });
  }

  function matchFirst(html, re) {
    const m = re.exec(html);

    if (!m) {
      return '';
    }

    return cleanText(m[1] || '');
  }

  function matchFirstRaw(html, re) {
    const m = re.exec(html);

    if (!m) {
      return '';
    }

    return String(m[1] || '').trim();
  }

  function extractAudio(html, variant) {
    const re = variant === 'uk'
      ? /class="uk[^"]*dpron-i[\s\S]*?<source[^>]+type="audio\/mpeg"[^>]+src="([^"]+\.mp3[^"]*)"/i
      : /class="us[^"]*dpron-i[\s\S]*?<source[^>]+type="audio\/mpeg"[^>]+src="([^"]+\.mp3[^"]*)"/i;

    const raw = matchFirstRaw(html, re);

    return normalizeCambridgeUrl(raw);
  }

  function parseCambridge(html) {
    const notFound =
      /di-search-error/i.test(html) ||
      /did not match any words/i.test(html);

    const headword =
      matchFirst(html, /class="hw\s+dhw"[^>]*>([\s\S]*?)<\/span>/i) ||
      matchFirst(html, /class="hw"[^>]*>([\s\S]*?)<\/span>/i) ||
      '';

    const pos =
      matchFirst(html, /class="pos\s+dpos"[^>]*>([\s\S]*?)<\/span>/i) ||
      '';

    const ukPron = matchFirst(
      html,
      /class="uk[^"]*dpron-i[\s\S]*?class="pron\s+dpron"[^>]*>([\s\S]*?)<\/span>/i,
    );
    const usPron = matchFirst(
      html,
      /class="us[^"]*dpron-i[\s\S]*?class="pron\s+dpron"[^>]*>([\s\S]*?)<\/span>/i,
    );

    const ukAudio = extractAudio(html, 'uk');
    const usAudio = extractAudio(html, 'us');

    const senses = [];
    const defRe = /class="def\s+ddef_d[^"]*"[^>]*>([\s\S]*?)<\/span>/gi;

    let defMatch;
    while ((defMatch = defRe.exec(html)) !== null) {
      const defText = cleanText(defMatch[1]);
      if (!defText) {
        continue;
      }

      let exText = '';

      const start = defMatch.index;
      const windowHtml = html.slice(start, start + 2500);

      const ex = /class="eg\s+deg[^"]*"[^>]*>([\s\S]*?)<\/span>/i.exec(windowHtml);
      if (ex && ex[1]) {
        exText = cleanText(ex[1]);
      }

      senses.push({
        def: defText,
        ex: exText,
      });

      if (senses.length >= UI.maxItems) {
        break;
      }
    }

    return {
      headword,
      pos,
      ukPron,
      usPron,
      ukAudio,
      usAudio,
      senses,
      notFound,
    };
  }

  function removeBrokenUI() {
    const existingHost = document.getElementById(UI.hostId);
    const existingBackdrop = document.getElementById(UI.backdropId);

    if (existingHost) {
      try {
        existingHost.remove();
      } catch (_) {
        // ignore
      }
    }

    if (existingBackdrop) {
      try {
        existingBackdrop.remove();
      } catch (_) {
        // ignore
      }
    }
  }

  function uiLooksValid(host) {
    if (!host) {
      return false;
    }

    if (host.getAttribute('data-cpd-signature') !== UI.signature) {
      return false;
    }

    const shadow = host.shadowRoot;
    if (!shadow) {
      return false;
    }

    const requiredRoles = [
      'word',
      'pos',
      'ukPron',
      'usPron',
      'playUk',
      'playUs',
      'shortcut',
      'open',
      'close',
      'searchInput',
      'searchSubmit',
      'body',
      'drag',
    ];

    for (const role of requiredRoles) {
      if (!shadow.querySelector(`[data-role="${role}"]`)) {
        return false;
      }
    }

    return true;
  }

  function el(tag, attrs = {}, text = null) {
    const node = document.createElement(tag);

    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'style') {
        node.style.cssText = String(v);

        continue;
      }

      if (k === 'className') {
        node.className = String(v);

        continue;
      }

      if (k.startsWith('data-')) {
        node.setAttribute(k, String(v));

        continue;
      }

      if (k === 'type') {
        node.type = String(v);

        continue;
      }

      if (k === 'value') {
        node.value = String(v);

        continue;
      }

      if (k === 'spellcheck') {
        node.spellcheck = Boolean(v);

        continue;
      }

      if (k === 'autocomplete') {
        node.setAttribute('autocomplete', String(v));

        continue;
      }

      if (k === 'autocapitalize') {
        node.setAttribute('autocapitalize', String(v));

        continue;
      }

      if (k === 'title') {
        node.title = String(v);

        continue;
      }

      if (k === 'href') {
        node.setAttribute('href', String(v));

        continue;
      }

      if (k === 'rel') {
        node.setAttribute('rel', String(v));

        continue;
      }

      if (k === 'target') {
        node.setAttribute('target', String(v));

        continue;
      }

      node.setAttribute(k, String(v));
    }

    if (text !== null && text !== undefined) {
      node.textContent = String(text);
    }

    return node;
  }

  function clearChildren(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function isVisible() {
    const host = document.getElementById(UI.hostId);

    return Boolean(host && host.style.display === 'block');
  }

  function show() {
    const { host, backdrop } = ensureUI();
    backdrop.style.display = 'block';
    host.style.display = 'block';
  }

  function hide() {
    cancelHotkeyCapture();

    const host = document.getElementById(UI.hostId);
    const backdrop = document.getElementById(UI.backdropId);

    if (host) {
      host.style.display = 'none';
    }

    if (backdrop) {
      backdrop.style.display = 'none';
    }
  }

  function isEventInsidePopup(e) {
    const host = document.getElementById(UI.hostId);

    if (!host) {
      return false;
    }

    const path = typeof e.composedPath === "function" ? e.composedPath() : [];

    if (path.includes(host)) {
      return true;
    }

    return Boolean(e.target && host.contains(e.target));
  }

  function isPopupEditableTarget(target) {
    if (!target) {
      return false;
    }

    const tag = (target.tagName || '').toLowerCase();

    if (tag === 'input' || tag === 'textarea') {
      return true;
    }

    return Boolean(target.isContentEditable);
  }

  function bindShadowKeyShield(shadow) {
    if (!shadow || shadow.__cpdKeyShieldBound) {
      return;
    }

    shadow.__cpdKeyShieldBound = true;

    shadow.addEventListener(
      'keydown',
      (e) => {
        if (!isVisible()) {
          return;
        }

        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();

          hide();

          return;
        }

        // Stop keys from escaping the shadow root to the page/app.
        // Let editable elements behave normally (typing), but still stop bubbling to the page.
        e.stopPropagation();

        const editable = isPopupEditableTarget(e.target);

        // If focus is NOT in an input/textarea/contenteditable, prevent browser/page shortcuts.
        if (!editable) {
          e.preventDefault();
        }
      },
      false,
    );
  }

  function ensureUI() {
    let backdrop = document.getElementById(UI.backdropId);
    let host = document.getElementById(UI.hostId);

    if (host && !uiLooksValid(host)) {
      removeBrokenUI();
      backdrop = null;
      host = null;
    }

    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = UI.backdropId;
      backdrop.style.cssText = [
        'position:fixed',
        'inset:0',
        'background:rgba(0,0,0,0.18)',
        'z-index:2147483646',
        'display:none',
      ].join(';');
      document.body.appendChild(backdrop);

      if (!backdrop.dataset.cpdBound) {
        backdrop.dataset.cpdBound = '1';
        backdrop.addEventListener('click', () => hide());
      }
    }

    if (!host) {
      host = document.createElement('div');
      host.id = UI.hostId;
      host.setAttribute('data-cpd-signature', UI.signature);

      host.style.cssText = [
        'all:initial',
        'position:fixed',
        'left:12px',
        'top:12px',
        'z-index:2147483647',
        'display:none',
      ].join(';');

      document.body.appendChild(host);

      const shadow = host.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = `
        :host { all: initial; }

        .root {
          width: min(640px, calc(100vw - 24px));
          max-height: min(78vh, 760px);
          background: #0b1220;
          color: #e8eefc;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px;
          box-shadow: 0 18px 50px rgba(0,0,0,0.45);
          overflow: hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        .header {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.06);
          cursor: move;
          user-select: none;
        }

        .headerRow1 {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          min-width: 0;
        }

        .title {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .title .word {
          font-size: 15px;
          font-weight: 750;
          letter-spacing: 0.2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 460px;
        }

        .title .meta {
          font-size: 12px;
          opacity: 0.92;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }

        .pill {
          padding: 2px 8px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.08);
          border-radius: 999px;
          font-size: 11px;
          opacity: 0.95;
          white-space: nowrap;
        }

        .actions {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-shrink: 0;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        button { all: unset; }

        .btn {
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.10);
          border-radius: 10px;
          padding: 6px 10px;
          font-size: 12px;
          cursor: pointer;
          transition: transform 0.06s ease, background 0.12s ease;
          white-space: nowrap;
          color: #e8eefc;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          user-select: none;
        }

        .btn:hover { background: rgba(255,255,255,0.14); }
        .btn:active { transform: translateY(1px); }
        .btn.icon { padding: 6px 9px; }
        .btn.closeIcon { padding: 6px 10px; font-size: 16px; line-height: 1; }

        .searchRow {
          display: flex;
          gap: 8px;
          width: 100%;
          cursor: default;
          user-select: text;
        }

        input { all: unset; }

        .searchInput {
          flex: 1;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.2);
          background: #0f172a;
          color: #f1f6ff;
          font-size: 14px;
          outline: none;
          cursor: text;
        }

        .searchInput::placeholder { color: rgba(232, 238, 252, 0.65); }

        .body {
          padding: 12px;
          overflow: auto;
          max-height: calc(min(78vh, 760px) - 118px);
        }

        .loading {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          opacity: 0.95;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          border: 2px solid rgba(255,255,255,0.18);
          border-top-color: rgba(255,255,255,0.90);
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .error {
          padding: 10px 12px;
          border: 1px solid rgba(255, 99, 99, 0.32);
          background: rgba(255, 99, 99, 0.10);
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.6;
        }

        .sense {
          padding: 12px 12px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          border-radius: 12px;
          margin-bottom: 10px;
        }

        .def {
          font-size: 14px;
          line-height: 1.65;
          margin: 0 0 8px 0;
          color: #f1f6ff;
        }

        .ex {
          font-size: 13px;
          line-height: 1.6;
          margin: 8px 0 0 0;
          padding-left: 10px;
          border-left: 2px solid rgba(255,255,255,0.14);
          opacity: 0.92;
          color: #d7e4ff;
        }

        .footer {
          margin-top: 10px;
          font-size: 12px;
          opacity: 0.9;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }

        a { color: #9cc2ff; text-decoration: none; }
        a:hover { text-decoration: underline; }
      `;

      const root = el('div', { className: 'root' });

      const header = el('div', { className: 'header', 'data-role': 'drag' });
      const headerRow1 = el('div', { className: 'headerRow1' });

      const title = el('div', { className: 'title' });
      const word = el('div', { className: 'word', 'data-role': 'word' }, 'Cambridge Dictionary');

      const meta = el('div', { className: 'meta' });
      const pos = el('span', { 'data-role': 'pos' }, '');
      const ukPron = el('span', { className: 'pill', 'data-role': 'ukPron', style: 'display:none;' }, '');
      const usPron = el('span', { className: 'pill', 'data-role': 'usPron', style: 'display:none;' }, '');

      meta.appendChild(pos);
      meta.appendChild(ukPron);
      meta.appendChild(usPron);

      title.appendChild(word);
      title.appendChild(meta);

      const actions = el('div', { className: 'actions' });

      const playUk = el(
        'button',
        {
          className: 'btn icon',
          type: 'button',
          'data-role': 'playUk',
          title: 'Play UK audio',
          style: 'display:none;',
        },
        '🔊 UK',
      );

      const playUs = el(
        'button',
        {
          className: 'btn icon',
          type: 'button',
          'data-role': 'playUs',
          title: 'Play US audio',
          style: 'display:none;',
        },
        '🔊 US',
      );

      const shortcut = el(
        'button',
        {
          className: 'btn',
          type: 'button',
          'data-role': 'shortcut',
        },
        'Shortcut',
      );

      const open = el(
        'button',
        {
          className: 'btn',
          type: 'button',
          'data-role': 'open',
        },
        'Open',
      );

      const close = el(
        'button',
        {
          className: 'btn closeIcon',
          type: 'button',
          'data-role': 'close',
          title: 'Close',
        },
        '✕',
      );

      actions.appendChild(playUk);
      actions.appendChild(playUs);
      actions.appendChild(shortcut);
      actions.appendChild(open);
      actions.appendChild(close);

      headerRow1.appendChild(title);
      headerRow1.appendChild(actions);

      const searchRow = el('div', { className: 'searchRow', 'data-role': 'searchRow' });

      const searchInput = el('input', {
        type: 'text',
        className: 'searchInput',
        'data-role': 'searchInput',
        placeholder: 'Type a word and press Enter...',
        value: '',
        autocomplete: 'off',
        autocapitalize: 'none',
        spellcheck: false,
      });

      const searchSubmit = el(
        'button',
        {
          className: 'btn',
          type: 'button',
          'data-role': 'searchSubmit',
          style: 'padding:10px 14px;',
        },
        'Search',
      );

      searchRow.appendChild(searchInput);
      searchRow.appendChild(searchSubmit);

      header.appendChild(headerRow1);
      header.appendChild(searchRow);

      const body = el('div', { className: 'body', 'data-role': 'body' });

      root.appendChild(header);
      root.appendChild(body);

      shadow.appendChild(style);
      shadow.appendChild(root);

      bindShadowKeyShield(shadow);
      bindUIEvents(host, root);

      setupDrag(host, root.querySelector('[data-role="drag"]'));
      restorePosition(host);
    }

    return {
      backdrop,
      host,
      shadow: host.shadowRoot,
    };
  }

  function bindUIEvents(host, root) {
    if (host.dataset.cpdBound === '1') {
      return;
    }

    host.dataset.cpdBound = '1';

    root.querySelector('[data-role="close"]').addEventListener('click', () => hide());

    root.querySelector('[data-role="open"]').addEventListener('click', () => {
      const url = host.getAttribute('data-url');
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });

    root.querySelector('[data-role="shortcut"]').addEventListener('click', () => {
      if (isShortcutView) {
        showMainView();

        return;
      }

      showHotkeyConfig();
    });

    root.querySelector('[data-role="playUk"]').addEventListener('click', () => {
      playAudio('uk');
    });

    root.querySelector('[data-role="playUs"]').addEventListener('click', () => {
      playAudio('us');
    });

    const searchInput = root.querySelector('[data-role="searchInput"]');
    const searchSubmit = root.querySelector('[data-role="searchSubmit"]');

    const triggerSearch = () => {
      const value = searchInput.value.trim();
      if (!value) {
        searchInput.focus();

        return;
      }

      lookupWord(value);
    };

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerSearch();
      }
    });

    searchSubmit.addEventListener('click', () => {
      triggerSearch();
    });
  }

  function qs(role) {
    const { shadow, host } = ensureUI();
    const elx = shadow.querySelector(`[data-role="${role}"]`);

    if (elx) {
      return elx;
    }

    if (!uiLooksValid(host)) {
      removeBrokenUI();
      const rebuilt = ensureUI();

      return rebuilt.shadow.querySelector(`[data-role="${role}"]`);
    }

    return null;
  }

  function setHeader({ word, pos, url, ukPron, usPron, ukAudio, usAudio }) {
    const { host } = ensureUI();

    const wordEl = qs('word');
    const posEl = qs('pos');

    if (!wordEl || !posEl) {
      removeBrokenUI();
      ensureUI();

      return;
    }

    wordEl.textContent = word || 'Cambridge Dictionary';
    posEl.textContent = pos || '';

    host.setAttribute('data-url', url || '');
    host.setAttribute('data-current-word', word || '');

    currentAudio = {
      uk: ukAudio || null,
      us: usAudio || null,
    };

    const ukPronEl = qs('ukPron');
    const usPronEl = qs('usPron');

    if (ukPronEl) {
      if (ukPron) {
        ukPronEl.textContent = `UK /${ukPron}/`;
        ukPronEl.style.display = 'inline-flex';
      } else {
        ukPronEl.style.display = 'none';
      }
    }

    if (usPronEl) {
      if (usPron) {
        usPronEl.textContent = `US /${usPron}/`;
        usPronEl.style.display = 'inline-flex';
      } else {
        usPronEl.style.display = 'none';
      }
    }

    const playUk = qs('playUk');
    const playUs = qs('playUs');

    if (playUk) {
      playUk.style.display = currentAudio.uk ? 'inline-flex' : 'none';
    }

    if (playUs) {
      playUs.style.display = currentAudio.us ? 'inline-flex' : 'none';
    }
  }

  function setSearchValue(value) {
    const input = qs('searchInput');
    if (!input) {
      return;
    }

    input.value = value || '';
  }

  function setBodyContent(builder) {
    const body = qs('body');
    if (!body) {
      return;
    }

    clearChildren(body);

    if (typeof builder === 'function') {
      builder(body);
    }
  }

  function savePosition(host) {
    const rect = host.getBoundingClientRect();
    const payload = {
      left: Math.round(rect.left),
      top: Math.round(rect.top),
    };

    try {
      GM_setValue(
        UI.storageKeyPos,
        payload,
      );
    } catch (_) {
      // ignore
    }
  }

  function restorePosition(host) {
    try {
      const parsed = GM_getValue(
        UI.storageKeyPos,
        null,
      );

      if (!parsed) {
        return;
      }

      const left = clamp(
        parsed.left,
        8,
        window.innerWidth - host.offsetWidth - 8,
      );
      const top = clamp(
        parsed.top,
        8,
        window.innerHeight - host.offsetHeight - 8,
      );

      host.style.left = `${left}px`;
      host.style.top = `${top}px`;
    } catch (_) {
      // ignore
    }
  }

  function setupDrag(host, handle) {
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    const onMouseDown = (e) => {
      if (e.button !== 0) {
        return;
      }

      dragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = host.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;

      document.addEventListener('mousemove', onMouseMove, true);
      document.addEventListener('mouseup', onMouseUp, true);

      e.preventDefault();
      e.stopPropagation();
    };

    const onMouseMove = (e) => {
      if (!dragging) {
        return;
      }

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const nextLeft = clamp(
        startLeft + dx,
        8,
        window.innerWidth - host.offsetWidth - 8,
      );
      const nextTop = clamp(
        startTop + dy,
        8,
        window.innerHeight - host.offsetHeight - 8,
      );

      host.style.left = `${nextLeft}px`;
      host.style.top = `${nextTop}px`;

      savePosition(host);
    };

    const onMouseUp = () => {
      dragging = false;

      document.removeEventListener('mousemove', onMouseMove, true);
      document.removeEventListener('mouseup', onMouseUp, true);
    };

    handle.addEventListener('mousedown', onMouseDown);
  }

  function cancelHotkeyCapture() {
    if (hotkeyCaptureListener) {
      document.removeEventListener('keydown', hotkeyCaptureListener, true);
      hotkeyCaptureListener = null;
    }

    isCapturingHotkey = false;
  }

  async function playAudio(which) {
    const src = which === 'uk' ? currentAudio.uk : currentAudio.us;

    if (!src) {
      return;
    }

    if (activeAudioEl) {
      try {
        activeAudioEl.pause();
      } catch (_) {
        // ignore
      }
    }

    const url = document.getElementById(UI.hostId)?.getAttribute('data-url') || '';
    const word = document.getElementById(UI.hostId)?.getAttribute('data-current-word') || 'Audio';

    try {
      const blobUrl = await fetchMp3AsBlobUrl(src);

      const audio = new Audio(blobUrl);
      activeAudioEl = audio;

      await audio.play();
    } catch (err) {
      setError(
        word,
        `Audio failed: ${err?.message || 'blocked or failed to fetch'}. Try "Open" on Cambridge.`,
        url,
      );
    }
  }

  function setLoading(query) {
    lastViewState = {
      type: 'loading',
      payload: {
        query,
      },
    };

    isShortcutView = false;
    cancelHotkeyCapture();

    setHeader({
      word: query,
      pos: '',
      url: '',
      ukPron: '',
      usPron: '',
      ukAudio: null,
      usAudio: null,
    });

    setSearchValue(query);

    setBodyContent((body) => {
      const loading = el('div', { className: 'loading' });
      loading.appendChild(el('span', { className: 'spinner' }));
      loading.appendChild(el('span', {}, 'Looking up Cambridge Dictionary...'));

      const footer = el('div', { className: 'footer' });
      footer.appendChild(el('span', {}, `Hotkey: ${hotkeyToString(ACTIVE_HOTKEY)}`));
      footer.appendChild(el('span', {}, 'Esc to close'));

      body.appendChild(loading);
      body.appendChild(footer);
    });
  }

  function setError(query, message, url) {
    lastViewState = {
      type: 'error',
      payload: {
        query,
        message,
        url,
      },
    };

    isShortcutView = false;
    cancelHotkeyCapture();

    setHeader({
      word: query,
      pos: '',
      url: url || '',
      ukPron: '',
      usPron: '',
      ukAudio: null,
      usAudio: null,
    });

    setSearchValue(query);

    setBodyContent((body) => {
      body.appendChild(el('div', { className: 'error' }, message));

      const footer = el('div', { className: 'footer' });

      if (url) {
        footer.appendChild(
          el(
            'a',
            {
              href: url,
              target: '_blank',
              rel: 'noopener noreferrer',
            },
            'Open on Cambridge',
          ),
        );
      }

      footer.appendChild(el('span', {}, 'Tip: click Open and play audio there'));

      body.appendChild(footer);
    });
  }

  function renderResult({ headword, pos, ukPron, usPron, ukAudio, usAudio, senses, url }) {
    lastViewState = {
      type: 'result',
      payload: {
        headword,
        pos,
        ukPron,
        usPron,
        ukAudio,
        usAudio,
        senses,
        url,
      },
    };

    isShortcutView = false;
    cancelHotkeyCapture();

    setHeader({
      word: headword || 'Result',
      pos,
      url,
      ukPron: ukPron || '',
      usPron: usPron || '',
      ukAudio: ukAudio || null,
      usAudio: usAudio || null,
    });

    setSearchValue(headword || '');

    if (!senses.length) {
      setBodyContent((body) => {
        const box = el('div', { className: 'error' }, 'I found the page, but couldn’t extract definitions.');
        const hint = el(
          'div',
          { style: 'margin-top:8px; opacity:0.9;' },
          'This usually means Cambridge served a consent/interstitial page or changed markup again.',
        );
        box.appendChild(hint);

        const footer = el('div', { className: 'footer' });
        footer.appendChild(el('a', { href: url, target: '_blank', rel: 'noopener noreferrer' }, 'Open on Cambridge'));
        footer.appendChild(el('span', {}, `Hotkey: ${hotkeyToString(ACTIVE_HOTKEY)}`));

        body.appendChild(box);
        body.appendChild(footer);
      });

      return;
    }

    setBodyContent((body) => {
      for (const s of senses) {
        const sense = el('div', { className: 'sense' });

        sense.appendChild(el('p', { className: 'def' }, s.def));

        if (s.ex) {
          sense.appendChild(el('p', { className: 'ex' }, s.ex));
        }

        body.appendChild(sense);
      }

      const footer = el('div', { className: 'footer' });
      footer.appendChild(el('a', { href: url, target: '_blank', rel: 'noopener noreferrer' }, 'Open on Cambridge'));
      footer.appendChild(el('span', {}, `Hotkey: ${hotkeyToString(ACTIVE_HOTKEY)}`));
      footer.appendChild(el('span', {}, 'Esc to close'));

      body.appendChild(footer);
    });
  }

  function showMainView() {
    isShortcutView = false;
    cancelHotkeyCapture();

    if (lastViewState.type === 'result') {
      renderResult(lastViewState.payload);

      return;
    }

    if (lastViewState.type === 'error') {
      setError(
        lastViewState.payload.query,
        lastViewState.payload.message,
        lastViewState.payload.url,
      );

      return;
    }

    setHeader({
      word: 'Cambridge Dictionary',
      pos: '',
      url: '',
      ukPron: '',
      usPron: '',
      ukAudio: null,
      usAudio: null,
    });

    setSearchValue(lastViewState.payload?.prefill || '');

    setBodyContent((body) => {
      const sense = el('div', { className: 'sense' });

      sense.appendChild(el('p', { className: 'def' }, 'Type a word in the search box above and press Enter.'));
      sense.appendChild(el('p', { className: 'ex' }, 'Tip: you can also select text on the page and use the hotkey.'));

      const footer = el('div', { className: 'footer' });
      footer.appendChild(el('span', {}, `Hotkey: ${hotkeyToString(ACTIVE_HOTKEY)}`));
      footer.appendChild(el('span', {}, 'Esc to close'));

      body.appendChild(sense);
      body.appendChild(footer);
    });
  }

  function showHotkeyConfig() {
    show();
    cancelHotkeyCapture();

    isShortcutView = true;
    isCapturingHotkey = true;

    setHeader({
      word: 'Shortcut settings',
      pos: '',
      url: '',
      ukPron: '',
      usPron: '',
      ukAudio: null,
      usAudio: null,
    });

    setBodyContent((body) => {
      const sense = el('div', { className: 'sense' });

      const p1 = el('p', { className: 'def', style: 'margin-bottom:6px;' }, 'Current shortcut');
      const current = el('div', { className: 'ex', style: 'border-left:none; padding-left:0; opacity:1;' }, hotkeyToString(ACTIVE_HOTKEY));

      const p2 = el('p', { className: 'def', style: 'margin-top:12px; margin-bottom:6px;' }, 'Set new shortcut');
      const info = el(
        'div',
        { className: 'ex', style: 'border-left:none; padding-left:0;' },
        'Hold modifiers (Ctrl/Alt/Shift/Meta) and press a key. Example: hold Alt, then press G.',
      );

      const footer = el('div', { className: 'footer', style: 'margin-top:12px;' });
      footer.appendChild(el('span', {}, 'Must include at least one modifier'));
      footer.appendChild(el('span', {}, 'Esc to cancel'));
      footer.appendChild(el('span', {}, 'Click “Shortcut” again to go back'));

      sense.appendChild(p1);
      sense.appendChild(current);
      sense.appendChild(p2);
      sense.appendChild(info);
      sense.appendChild(footer);

      body.appendChild(sense);
    });

    hotkeyCaptureListener = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        cancelHotkeyCapture();
        showMainView();

        return;
      }

      if (isModifierEvent(e)) {
        return;
      }

      const hasModifier = Boolean(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey);
      if (!hasModifier) {
        return;
      }

      ACTIVE_HOTKEY = {
        code: e.code,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        metaKey: e.metaKey,
      };

      saveHotkey(ACTIVE_HOTKEY);

      cancelHotkeyCapture();
      showMainView();
    };

    document.addEventListener('keydown', hotkeyCaptureListener, true);
  }

  async function lookupWord(query) {
    const normalized = String(query || '').trim();
    if (!normalized) {
      showMainView();

      return;
    }

    const url = buildUrl(normalized);

    show();
    setLoading(normalized);

    try {
      const html = await fetchCambridgeHtml(url);
      const parsed = parseCambridge(html);

      if (parsed.notFound) {
        setError(
          normalized,
          'No Cambridge entry found for this word.',
          url,
        );

        return;
      }

      renderResult({
        headword: parsed.headword || normalized,
        pos: parsed.pos,
        ukPron: parsed.ukPron,
        usPron: parsed.usPron,
        ukAudio: parsed.ukAudio,
        usAudio: parsed.usAudio,
        senses: parsed.senses,
        url,
      });
    } catch (err) {
      setError(
        normalized,
        `Lookup failed: ${err?.message || 'unknown error'}.`,
        url,
      );
    }
  }

  function getSelectionText() {
    const text = (window.getSelection?.().toString() || '').trim();

    if (!text) {
      return '';
    }

    return text
      .replace(/\s+/g, ' ')
      .replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '')
      .trim();
  }

  function focusSearch() {
    try {
      const input = qs('searchInput');
      if (input) {
        input.focus();
      }
    } catch (_) {
      // ignore
    }
  }

  function wireSearchPrefillFromSelection(selected) {
    if (!selected) {
      return;
    }

    setSearchValue(selected);
    focusSearch();
  }

  // Modal key shield (document-capture):
  // - If popup is open and the key event originates OUTSIDE the popup, block it hard.
  // - If it originates INSIDE, let it reach the popup; the shadow root will stop it from reaching the page.
  document.addEventListener(
    'keydown',
    (e) => {
      if (!isVisible()) {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        hide();

        return;
      }

      if (isEventInsidePopup(e)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    },
    true,
  );

  // Hotkey + overall behavior
  document.addEventListener(
    'keydown',
    (e) => {
      if (isCapturingHotkey) {
        return;
      }

      if (isEditableTarget(e.target)) {
        return;
      }

      if (!matchesHotkey(e)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      show();

      const selected = getSelectionText();
      if (selected) {
        wireSearchPrefillFromSelection(selected);
        lookupWord(selected);

        return;
      }

      showMainView();
      focusSearch();
    },
    true,
  );
})();
