// ==UserScript==
// @name         Smart Abbreviation Expander (AI) / Prompt manger
// @namespace    https://github.com/quantavil
// @version      1.15
// @description  Expand abbreviations with Shift+Space, open palette with Alt+P. Gemini grammar/tone correction with Alt+G. Supports {{date}}, {{time}}, {{day}}, {{clipboard}}, and {{cursor}}. Works in inputs, textareas, and contenteditable with robust insertion. Inline editing, in-panel settings, hotkey customization, and API key verify+save. Fallback: if no caret, insert at end-of-line in a reasonable field.
// @author       quantavil
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      generativelanguage.googleapis.com
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552467/Smart%20Abbreviation%20Expander%20%28AI%29%20%20Prompt%20manger.user.js
// @updateURL https://update.greasyfork.org/scripts/552467/Smart%20Abbreviation%20Expander%20%28AI%29%20%20Prompt%20manger.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ----------------------
  // Config
  // ----------------------
  const CONFIG = {
    trigger: { shift: true, alt: false, ctrl: false, meta: false }, // Space-based (Shift+Space)
    palette: { code: 'KeyP', alt: true, shift: false, ctrl: false, meta: false }, // Alt+P
    correct: { code: 'KeyG', alt: true, shift: false, ctrl: false, meta: false }, // Alt+G
    customPrompt: { code: 'KeyG', alt: true, shift: true, ctrl: false, meta: false },
    maxAbbrevLen: 80,
    styleId: 'sae-styles',
    storeKeys: {
      dict: 'sae.dict.v1',
      tone: 'sae.gemini.tone.v1',
      keys: 'sae.keys.v1',
      apiKey: 'sae.gemini.apiKey.v1',
      userPrompt: 'sae.gemini.userPrompt.v1',
    },
    toast: { throttleMs: 3000 },
    clipboardReadTimeoutMs: 350,
    searchDebounceMs: 150,
    gemini: {
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
      model: 'gemini-2.5-flash-lite',
      temperature: 0.15,
      timeoutMs: 20000,
      maxInputChars: 32000,
      apiKey: '' // user-configurable via Settings; do not hardcode keys here
    }
  };

  // ----------------------
  // Default dictionary
  // ----------------------
  const DEFAULT_DICT = {
    brb: 'Be right back.',
    ty: 'Thank you!',
    hth: 'Hope this helps!',
    opt: 'Optional: {{cursor}}',
    log: 'Log Entry - {{date:iso}} {{time}}: {{cursor}}',
    track: 'The tracking number for your order is {{clipboard}}. {{cursor}}',
    dt: 'Today is {{day}}, {{date:long}} at {{time}}.',
  };

  // ----------------------
  // GM-safe helpers + style injection (idempotent)
  // ----------------------
  function addStyleOnce(css) {
    const id = CONFIG.styleId;
    const existing = document.getElementById(id);
    if (existing) return existing;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
    return s;
  }

  const GMX = {
    getValue: (k, d) => (typeof window.GM_getValue === 'function' ? window.GM_getValue(k, d) : JSON.parse(localStorage.getItem(k) || JSON.stringify(d))),
    setValue: (k, v) => (typeof window.GM_setValue === 'function' ? window.GM_setValue(k, v) : localStorage.setItem(k, JSON.stringify(v))),
    addStyle: addStyleOnce,
    registerMenuCommand: (title, fn) => typeof window.GM_registerMenuCommand === 'function' && window.GM_registerMenuCommand(title, fn),
    request: (opts) => new Promise((resolve, reject) => {
      const { method = 'GET', url, headers = {}, data, timeout = CONFIG.gemini.timeoutMs } = opts;
      if (typeof window.GM_xmlhttpRequest === 'function') {
        window.GM_xmlhttpRequest({
          method, url, headers, data, timeout,
          onload: (res) => resolve({ status: res.status, text: res.responseText }),
          onerror: () => reject(new Error('Network error')),
          ontimeout: () => reject(new Error('Request timed out')),
        });
      } else {
        const controller = new AbortController(); const t = setTimeout(() => controller.abort(), timeout);
        fetch(url, { method, headers, body: data, signal: controller.signal })
          .then(async res => { clearTimeout(t); resolve({ status: res.status, text: await res.text() }); })
          .catch(err => { clearTimeout(t); reject(err); });
      }
    }),
  };

  // ----------------------
  // Small utilities
  // ----------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const debounce = (fn, wait) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); }; };
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const pad2 = n => String(n).padStart(2, '0');

  // ----------------------
  // Notifier (toast + busy bubble)
  // ----------------------
  function notifier() {
    let el = null, timer = null;
    const place = () => {
      const left = Math.max(8, window.innerWidth - 320);
      const top = Math.max(8, window.innerHeight - 80);
      el.style.left = `${left}px`; el.style.top = `${top}px`;
    };
    return {
      toast(msg, ms = 2200) {
        this.close();
        el = document.createElement('div');
        el.className = 'sae-bubble';
        el.textContent = msg;
        document.documentElement.appendChild(el);
        place();
        timer = setTimeout(() => this.close(), ms);
      },
      busy(msg) {
        this.close();
        el = document.createElement('div');
        el.className = 'sae-bubble';
        el.textContent = msg;
        document.documentElement.appendChild(el);
        place();
        return { update: (m) => { el.textContent = m; }, close: () => this.close() };
      },
      close() { if (timer) clearTimeout(timer); el?.remove(); el = timer = null; }
    };
  }
  const notify = notifier();

  // ----------------------
  // State
  // ----------------------
  const state = {
    dict: null,
    lastEditable: null,
    _lastToastAt: 0,
    tone: 'neutral',
    _lastFocusedEditable: null,
    activeIndex: 0,
    apiKey: '',
    apiKeyIndex: 0,
    userPrompt: '',
  };
  let paletteEl = null;
  let hotkeyCapture = null; // { kind: 'spaceOnly' | 'code', resolve, bubble }
  let prevOverflow = '';

  // ----------------------
  // Styles
  // ----------------------
  const STYLES = `
    .sae-bubble{position:fixed;z-index:2147483647;max-width:min(560px,80vw);box-shadow:0 8px 24px rgba(0,0,0,.18);border:1px solid rgba(255,255,255,.1);border-radius:8px;background:#111;color:#fff;padding:10px 12px;font:13px/1.35 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;white-space:pre-wrap;pointer-events:auto}
    .sae-palette{position:fixed;z-index:2147483647;inset:0;display:none;align-items:center;justify-content:center;backdrop-filter:blur(2px);background:rgba(0,0,0,.25)}
    .sae-palette.open{display:flex}
    .sae-panel{width:min(720px,92vw);max-height:78vh;overflow:hidden;background:#111;color:#fff;border:1px solid rgba(255,255,255,.08);border-radius:10px;box-shadow:0 12px 36px rgba(0,0,0,.35);display:flex;flex-direction:column;font:13px/1.35 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
    .sae-panel-header{display:grid;grid-template-columns:1fr auto auto auto;align-items:center;gap:8px;padding:10px;border-bottom:1px solid rgba(255,255,255,.06)}
    .sae-search{width:100%;background:#1b1b1b;color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:6px;padding:8px 10px;outline:none}
    .sae-icon-btn{padding:6px;border-radius:6px;border:1px solid rgba(255,255,255,.12);background:#1b1b1b;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s ease}
    .sae-icon-btn:hover{background:#252525;border-color:rgba(255,255,255,.2)}
    .sae-icon-btn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
    .sae-list{overflow:auto;padding:6px}
    .sae-item{display:grid;grid-template-columns:160px 1fr auto;gap:10px;padding:8px;border-radius:6px;border:1px solid transparent;cursor:pointer;align-items:center}
    .sae-item:hover,.sae-item.active{background:#1b1b1b;border-color:rgba(255,255,255,.08)}
    .sae-key{opacity:.85;font-weight:600;color:#86b7ff}
    .sae-val{color:#ddd;white-space:pre-wrap}
    .sae-item-actions{display:flex;gap:4px;margin-left:auto}
    .sae-item-actions button{padding:4px 8px;border-radius:4px;border:1px solid rgba(255,255,255,.12);background:#1b1b1b;color:#fff;cursor:pointer;font-size:11px}
    .sae-item-actions button:hover{background:#252525}
    .sae-item.editing{background:#1a1a2e;border-color:#4a4aff}
    .sae-item.editing input{background:#0c0c0c;color:#fff;border:1px solid rgba(255,255,255,.2);border-radius:4px;padding:4px 6px;width:100%;font:inherit}
    .sae-item.editing .sae-key{padding:0}
    .sae-item.editing .sae-val{padding:0}
    .sae-add-new{padding:10px;text-align:center;border-top:1px solid rgba(255,255,255,.06)}
    .sae-add-new button{padding:8px 16px;border-radius:6px;border:1px solid rgba(255,255,255,.12);background:#1b1b1b;color:#86b7ff;cursor:pointer;font-weight:600}
    .sae-add-new button:hover{background:#252525}
    .sae-footer{padding:8px 10px;border-top:1px solid rgba(255,255,255,.06);opacity:.8}

    /* Settings screen */
    .sae-panel.settings-open .sae-list,
    .sae-panel.settings-open .sae-add-new,
    .sae-panel.settings-open .sae-search { display: none; }
    .sae-settings-view{display:none;padding:8px 10px;overflow:auto;max-height:78vh}
    .sae-panel.settings-open .sae-settings-view{display:block}
    .sae-hrow{display:grid;grid-template-columns:180px 1fr auto;align-items:center;gap:10px;padding:8px;border-bottom:1px solid rgba(255,255,255,.06)}
    .sae-hrow:last-child{border-bottom:none}
    .sae-select,.sae-text,.sae-textarea{background:#1b1b1b;color:#fff;border:1px solid rgba(255,255,255,.12);border-radius:6px;padding:6px 8px;font:inherit;width:100%}
    .sae-textarea{min-height:88px;resize:vertical}
    .sae-help{font-size:11px;opacity:.8;margin-top:6px;color:#ccc}
    .sae-btn{padding:6px 10px;border-radius:6px;border:1px solid rgba(255,255,255,.12);background:#1b1b1b;color:#fff;cursor:pointer;transition:all .15s ease}
    .sae-btn:hover{background:#252525}
    .sae-btn.ok{background:#174f2b;border-color:#2b9a4a;color:#eaffea}
    .sae-chip{display:inline-block;padding:4px 8px;border-radius:6px;border:1px solid rgba(255,255,255,.12);background:#1b1b1b;color:#ddd;margin-right:8px}
    .sae-settings-actions{display:flex;gap:8px;flex-wrap:wrap}
    .sae-settings-footer{padding-top:8px;display:flex;justify-content:flex-end}
  `;

  // ----------------------
  // Boot
  // ----------------------
  init().catch(console.error);

  async function init() {
    state.dict = normalizeDict(await GMX.getValue(CONFIG.storeKeys.dict, DEFAULT_DICT)) || normalizeDict(DEFAULT_DICT);
    state.tone = await GMX.getValue(CONFIG.storeKeys.tone, 'neutral');

    // Load saved hotkeys
    const savedKeys = await GMX.getValue(CONFIG.storeKeys.keys, null);
    if (savedKeys?.trigger) Object.assign(CONFIG.trigger, savedKeys.trigger);
    if (savedKeys?.palette) Object.assign(CONFIG.palette, savedKeys.palette);
    if (savedKeys?.correct) Object.assign(CONFIG.correct, savedKeys.correct);
    if (savedKeys?.customPrompt) Object.assign(CONFIG.customPrompt, savedKeys.customPrompt);

    // API key
    state.apiKey = await GMX.getValue(CONFIG.storeKeys.apiKey, CONFIG.gemini.apiKey || '');
    state.userPrompt = await GMX.getValue(CONFIG.storeKeys.userPrompt, '');


    // Remember last focused editable (ignore palette UI)
    document.addEventListener('focusin', (e) => {
      if (e.target.closest('.sae-palette')) return;
      const el = isEditable(e.target);
      if (el) state._lastFocusedEditable = el;
    }, true);

    const isVM = typeof GM_info !== 'undefined' && GM_info && /Violentmonkey/i.test(GM_info.scriptHandler || '');
    GMX.registerMenuCommand('Open Abbreviation Palette', () => { state.lastEditable = captureEditableContext(); openPalette(); });
    if (!isVM) {
      GMX.registerMenuCommand('Export Dictionary (.json)', exportDict);
      GMX.registerMenuCommand('Import Dictionary', () => importDict());
      GMX.registerMenuCommand('Reset Dictionary to Defaults', async () => {
        if (confirm('Reset dictionary to defaults?')) await setDict(DEFAULT_DICT, 'Dictionary reset to defaults.');
      });
      GMX.registerMenuCommand('Gemini: Correct Selection/Field (Alt+G)', triggerGeminiCorrection);
      GMX.registerMenuCommand('Gemini: Set Tone (neutral/friendly/formal/casual/concise)', async () => {
        const val = prompt('Tone (neutral, friendly, formal, casual, concise):', state.tone || 'neutral');
        if (val == null) return;
        const t = (val || '').trim().toLowerCase();
        const allowed = ['neutral', 'friendly', 'formal', 'casual', 'concise'];
        if (!allowed.includes(t)) return toast('Invalid tone.');
        state.tone = t;
        await GMX.setValue(CONFIG.storeKeys.tone, state.tone);
        toast(`Tone set to ${state.tone}.`);
      });
      GMX.registerMenuCommand('Gemini: Set API Key', async () => {
        const val = prompt('Enter Gemini API key(s) separated by ;', state.apiKey || '');
        if (val == null) return;
        state.apiKey = val.trim();
        await GMX.setValue(CONFIG.storeKeys.apiKey, state.apiKey);
        toast(state.apiKey ? 'API key saved.' : 'API key cleared.');
      });
    }

    document.addEventListener('keydown', onKeyDownCapture, true);
  }

  

  // ----------------------
  // Hotkeys
  // ----------------------
  function matchHotkey(e, spec) {
    const mods = (e.shiftKey === !!spec.shift) && (e.altKey === !!spec.alt) && (e.ctrlKey === !!spec.ctrl) && (e.metaKey === !!spec.meta);
    if (!mods) return false;
    if (spec.code) return e.code === spec.code;
    return e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar';
  }

  const HOTKEYS = [
    { spec: () => CONFIG.palette, needsEditable: false, handler: () => { state.lastEditable = captureEditableContext(); openPalette(); } },
    { spec: () => CONFIG.correct, needsEditable: true, handler: () => triggerGeminiCorrection() },
    { spec: () => CONFIG.customPrompt, needsEditable: true, handler: () => triggerGeminiCustomPrompt() },
    { spec: () => CONFIG.trigger, needsEditable: true, handler: () => doExpansion() },
  ];

  async function onKeyDownCapture(e) {
    if (e.defaultPrevented || e.isComposing) return;

    // Capturing hotkeys in settings
    if (hotkeyCapture) {
      e.preventDefault(); e.stopPropagation();
      if (e.key === 'Escape') { hotkeyCapture.bubble?.update('Canceled.'); setTimeout(() => hotkeyCapture.bubble?.close(), 600); hotkeyCapture.resolve(null); hotkeyCapture = null; return; }
      if (hotkeyCapture.kind === 'spaceOnly') {
        if (e.code !== 'Space') { hotkeyCapture.bubble?.update('Expand hotkey must include Space (e.g., Shift+Space). Esc to cancel.'); return; }
        const spec = { shift: e.shiftKey, alt: e.altKey, ctrl: e.ctrlKey, meta: e.metaKey };
        hotkeyCapture.bubble?.update(`Set: ${hotkeyToString(spec, true)}`); setTimeout(() => hotkeyCapture.bubble?.close(), 600); hotkeyCapture.resolve(spec); hotkeyCapture = null; return;
      } else {
        if (/^Shift|Alt|Control|Meta$/.test(e.key)) { hotkeyCapture.bubble?.update('Press a non-modifier key (with modifiers if you want).'); return; }
        const spec = { code: e.code, shift: e.shiftKey, alt: e.altKey, ctrl: e.ctrlKey, meta: e.metaKey };
        hotkeyCapture.bubble?.update(`Set: ${hotkeyToString(spec, false)}`); setTimeout(() => hotkeyCapture.bubble?.close(), 600); hotkeyCapture.resolve(spec); hotkeyCapture = null; return;
      }
    }

    if (paletteEl && paletteEl.classList.contains('open') && paletteEl.contains(e.target)) return;

    for (const hk of HOTKEYS) {
      const spec = hk.spec();
      if (matchHotkey(e, spec)) {
        if (hk.needsEditable && !isEditable(e.target)) return;
        e.preventDefault(); e.stopPropagation();
        hk.handler();
        return;
      }
    }
  }

  function captureHotkey(kind) { return new Promise((resolve) => { const bubble = notify.busy(kind === 'spaceOnly' ? 'Press new Expand hotkey (must include Space). Esc to cancel.' : 'Press new hotkey. Use modifiers if you want. Esc to cancel.'); hotkeyCapture = { kind, resolve, bubble }; }); }
  async function setHotkey(name, captureKind) {
    const spec = await captureHotkey(captureKind);
    if (!spec) return;
    const existing = {
      trigger: CONFIG.trigger,
      palette: CONFIG.palette,
      correct: CONFIG.correct,
      customPrompt: CONFIG.customPrompt,
    };
    for (const [k, v] of Object.entries(existing)) {
      if (k === name) continue;
      const a = spec.code ? spec.code : 'Space';
      const b = v.code ? v.code : 'Space';
      const conflict = a === b && !!spec.shift === !!v.shift && !!spec.alt === !!v.alt && !!spec.ctrl === !!v.ctrl && !!spec.meta === !!v.meta;
      if (conflict) { toast(`Conflict: already used by ${k}.`); return; }
    }
    CONFIG[name] = spec;
    const keys = await GMX.getValue(CONFIG.storeKeys.keys, {});
    keys[name] = spec;
    await GMX.setValue(CONFIG.storeKeys.keys, keys);
    toast(`${name} hotkey set to ${hotkeyToString(spec, captureKind === 'spaceOnly')}`);
  }

  // ----------------------
  // Editable detection & selection helpers
  // ----------------------
  function isEditable(el) {
    if (!el) return null;
    if (el instanceof HTMLTextAreaElement) return el;
    if (el instanceof HTMLInputElement) {
      const type = (el.type || 'text').toLowerCase();
      if (type === 'password') return null;
      if (['text', 'search', 'url', 'email', 'tel'].includes(type)) return el;
      return null;
    }
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) if (n.nodeType === 1 && n.isContentEditable) return n;
    return null;
  }
  function getSafeSelection() { const sel = window.getSelection?.(); return (!sel || sel.rangeCount === 0) ? null : sel; }

  function captureEditableContext() {
    const active = document.activeElement; const el = isEditable(active); if (!el) return null;
    if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
      return { kind: 'input', el, start: el.selectionStart ?? 0, end: el.selectionEnd ?? 0, collapsed: (el.selectionStart === el.selectionEnd) };
    } else {
      const root = el; const sel = getSafeSelection(); if (!sel || sel.rangeCount === 0) return null;
      const range = sel.getRangeAt(0);
      return { kind: 'ce', root, range: range.cloneRange(), collapsed: range.collapsed };
    }
  }

  // ----------------------
  // Editor abstraction (unifies input and contenteditable)
  // ----------------------
  function makeEditor(ctx) {
    if (ctx.kind === 'input') {
      const el = ctx.el;
      return {
        getSelectionRange() { const start = el.selectionStart ?? 0, end = el.selectionEnd ?? 0; return { start, end, collapsed: start === end }; },
        getSelectedText() { const { start, end } = this.getSelectionRange(); return el.value.slice(start, end); },
        getAllText() { return el.value; },
        replaceRange(text, start, end, caretIndex = text.length) {
          el.setRangeText(text, start, end, 'end');
          el.selectionStart = el.selectionEnd = start + caretIndex;
          dispatchInput(el, (end > start ? 'insertReplacementText' : 'insertText'), text);
        },
        replaceSelection(text, caretIndex) { const { start, end } = this.getSelectionRange(); this.replaceRange(text, start, end, caretIndex); }
      };
    } else {
      const root = ctx.root;
      return {
        getSelectionRange() { const sel = getSafeSelection(); let range = sel?.rangeCount ? sel.getRangeAt(0).cloneRange() : null; return { range, collapsed: !!range?.collapsed }; },
        getSelectedText() { const { range } = this.getSelectionRange(); return range ? range.toString() : ''; },
        getAllText() { const r = document.createRange(); r.selectNodeContents(root); return r.toString(); },
        replaceRangeWithText(range, text, caretIndex = text.length) {
          let ok = false;
          try {
            const sel = getSafeSelection();
            sel && sel.removeAllRanges();
            sel && sel.addRange(range);
            const mark = '\u200B';
            const t = (caretIndex >= 0 && caretIndex <= text.length) ? (String(text).slice(0, caretIndex) + mark + String(text).slice(caretIndex)) : (String(text) + mark);
            ok = document.execCommand('insertText', false, t);
            if (!ok) ok = document.execCommand('insertHTML', false, t);
            if (ok) {
              const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
              let foundNode = null, foundIdx = -1;
              for (let n = walker.nextNode(); n; n = walker.nextNode()) {
                const i = n.nodeValue.indexOf(mark);
                if (i !== -1) { foundNode = n; foundIdx = i; break; }
              }
              if (foundNode) {
                const v = foundNode.nodeValue;
                foundNode.nodeValue = v.slice(0, foundIdx) + v.slice(foundIdx + 1);
                const r = document.createRange();
                r.setStart(foundNode, foundIdx);
                r.collapse(true);
                const s2 = getSafeSelection();
                s2 && s2.removeAllRanges();
                s2 && s2.addRange(r);
              }
              dispatchInput(root, 'insertReplacementText', String(text));
              return;
            }
          } catch {}
          range.deleteContents();
          const { fragment, cursorNode, cursorOffset, lastNode } = buildFragment(String(text), caretIndex);
          range.insertNode(fragment);
          const sel2 = getSafeSelection(); placeCaretAfterInsertion(sel2, range, cursorNode, cursorOffset, lastNode);
          dispatchInput(root, 'insertReplacementText', String(text));
        },
        replaceSelection(text, caretIndex) { const { range } = this.getSelectionRange(); if (!range) return; this.replaceRangeWithText(range, text, caretIndex); }
      };
    }
  }

  function applyRendered(ctx, rendered, opts = {}) {
    const editor = makeEditor(ctx);
    if (ctx.kind === 'input' && typeof opts.start === 'number' && typeof opts.end === 'number') {
      editor.replaceRange(rendered.text, opts.start, opts.end, rendered.cursorIndex);
    } else if (ctx.kind === 'ce' && opts.range instanceof Range) {
      editor.replaceRangeWithText(opts.range, rendered.text, rendered.cursorIndex);
    } else {
      editor.replaceSelection(rendered.text, rendered.cursorIndex);
    }
  }

  // ----------------------
  // Abbreviation token extraction
  // ----------------------
  const isWordChar = (() => {
    try { const re = new RegExp('[\\p{L}\\p{N}_-]', 'u'); return ch => re.test(ch); }
    catch { return ch => /[A-Za-z0-9_-]/.test(ch); }
  })();

  function extractAbbrevBeforeCaret(ctx) {
    if (ctx.kind === 'input') {
      const { el, start, end } = ctx; if (start !== end) return null;
      const text = el.value.slice(0, start);
      let i = text.length - 1, count = 0;
      for (; i >= 0; i--) { const ch = text[i]; if (!isWordChar(ch)) break; if (++count > CONFIG.maxAbbrevLen) break; }
      const tokenStart = Math.max(0, i + 1);
      return { token: text.slice(tokenStart), tokenStart, tokenEnd: start };
    } else {
      const sel = getSafeSelection(); if (!sel || sel.rangeCount === 0) return null;
      const caretRange = sel.getRangeAt(0); if (!caretRange.collapsed) return null;
      const prefixRange = document.createRange(); prefixRange.selectNodeContents(ctx.root);
      try { prefixRange.setEnd(caretRange.startContainer, caretRange.startOffset); } catch { return null; }
      const prefix = prefixRange.toString();
      let i = prefix.length - 1, count = 0;
      for (; i >= 0; i--) { const ch = prefix[i]; if (!isWordChar(ch)) break; if (++count > CONFIG.maxAbbrevLen) break; }
      const token = prefix.slice(Math.max(0, i + 1));
      const tokenRange = caretRange.cloneRange(); moveRangeStartByChars(tokenRange, token.length, ctx.root);
      return { token, tokenRange };
    }
  }

  function moveRangeStartByChars(range, n, root) {
    let remaining = n;
    while (remaining > 0) {
      let sc = range.startContainer, so = range.startOffset;
      if (sc.nodeType === Node.TEXT_NODE) {
        const move = Math.min(so, remaining);
        so -= move; remaining -= move; range.setStart(sc, so);
        if (remaining === 0) break;
        const prev = previousTextNode(root, sc); if (!prev) break; range.setStart(prev, prev.nodeValue.length);
      } else {
        const candidate = so > 0 ? lastTextDescendant(sc.childNodes[so - 1]) : previousTextNode(root, sc);
        if (!candidate) break; range.setStart(candidate, candidate.nodeValue.length);
      }
    }
  }
  function previousTextNode(root, node) { const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let prev = null; for (let n = walker.nextNode(); n; n = walker.nextNode()) { if (n === node) return prev; prev = n; } return null; }
  function lastTextDescendant(start) { if (!start) return null; if (start.nodeType === Node.TEXT_NODE) return start; let walker = document.createTreeWalker(start, NodeFilter.SHOW_TEXT), last = null; for (let n = walker.nextNode(); n; n = walker.nextNode()) last = n; return last; }

  // ----------------------
  // Template rendering (plugin-based tags)
  // ----------------------
  const TAGS = {
    cursor: async () => ({ text: '', cursor: true }),
    date: async (arg, now) => ({ text: formatDate(now, arg) }),
    time: async (arg, now) => ({ text: formatTime(now, arg) }),
    day: async (arg, now) => ({ text: formatDay(now, arg) }),
    clipboard: async () => ({ text: await readClipboardSafe() || '' }),
  };

  async function renderTemplate(template) {
    const now = new Date(); let out = '', cursorIndex = -1;
    const re = /{{\s*([a-zA-Z]+)(?::([^}]+))?\s*}}/g; let idx = 0; let m;
    while ((m = re.exec(template))) {
      out += template.slice(idx, m.index); idx = m.index + m[0].length;
      const tag = (m[1] || '').toLowerCase(), arg = (m[2] || '').trim();
      const handler = TAGS[tag];
      if (!handler) { out += m[0]; continue; }
      const res = await handler(arg, now);
      if (res.cursor && cursorIndex === -1) cursorIndex = out.length;
      out += res.text ?? '';
    }
    out += template.slice(idx);
    return { text: out, cursorIndex: cursorIndex >= 0 ? cursorIndex : out.length };
  }

  function formatDate(d, arg) {
    const a = (arg || 'iso').toLowerCase();
    switch (a) {
      case 'iso': case 'ymd': return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
      case 'mdy': case 'us': return `${pad2(d.getMonth() + 1)}/${pad2(d.getDate())}/${d.getFullYear()}`;
      case 'dmy': return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
      case 'long': return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      case 'short': return d.toLocaleDateString();
      default: return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    }
  }
  function formatTime(d, arg) {
    const mode = (arg || '12').toLowerCase();
    if (mode === '24' || mode === '24h') return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    let h = d.getHours(); const m = pad2(d.getMinutes()), ampm = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    return `${pad2(h)}:${m} ${ampm}`;
  }
  function formatDay(d, arg) {
    return d.toLocaleDateString(undefined, (!arg || arg.toLowerCase() === 'long') ? { weekday: 'long' } : { weekday: 'short' });
  }

  async function readClipboardSafe() {
    let resolved = false;
    const timeout = new Promise(r => setTimeout(() => { if (!resolved) { resolved = true; r(''); } }, CONFIG.clipboardReadTimeoutMs));
    const read = (async () => {
      try {
        if (!navigator.clipboard?.readText) return '';
        const t = await navigator.clipboard.readText();
        if (!resolved) { resolved = true; return t ?? ''; }
        return '';
      } catch {
        if (!resolved) { resolved = true; throttledToast('Clipboard read blocked — allow permission to use {{clipboard}}.'); }
        return '';
      }
    })();
    return await Promise.race([read, timeout]);
  }

  // ----------------------
  // Build/insert fragments + dispatch input
  // ----------------------
  function buildFragment(text, cursorIndex) {
    const frag = document.createDocumentFragment(); let pos = 0, cursorNode = null, cursorOffset = 0;
    const parts = String(text).split('\n'); let lastNode = null;
    parts.forEach((part, idx) => {
      const t = document.createTextNode(part); frag.appendChild(t); lastNode = t;
      if (cursorNode == null && cursorIndex <= pos + part.length) { cursorNode = t; cursorOffset = clamp(cursorIndex - pos, 0, t.nodeValue.length); }
      pos += part.length;
      if (idx < parts.length - 1) { frag.appendChild(document.createElement('br')); pos += 1; }
    });
    if (!cursorNode && lastNode) { cursorNode = lastNode; cursorOffset = lastNode.nodeValue.length; }
    return { fragment: frag, cursorNode, cursorOffset, lastNode };
  }

  function placeCaretAfterInsertion(sel, refRange, cursorNode, cursorOffset, lastNode) {
    const newRange = document.createRange();
    if (cursorNode) newRange.setStart(cursorNode, cursorOffset);
    else if (lastNode) newRange.setStartAfter(lastNode);
    else newRange.setStart(refRange.startContainer, refRange.startOffset);
    newRange.collapse(true); sel.removeAllRanges(); sel.addRange(newRange);
  }

  function dispatchInput(node, inputType, data) {
    try { node.dispatchEvent(new InputEvent('input', { bubbles: true, inputType, data })); }
    catch { node.dispatchEvent(new Event('input', { bubbles: true })); }
  }

  // ----------------------
  // Expansion
  // ----------------------
  async function doExpansion() {
    const ctx = captureEditableContext(); if (!ctx || !ctx.collapsed) return;
    const tokenInfo = extractAbbrevBeforeCaret(ctx); if (!tokenInfo || !tokenInfo.token) return;
    if (tokenInfo.token.length > CONFIG.maxAbbrevLen) return;
    const tmpl = state.dict[tokenInfo.token.toLowerCase()]; if (!tmpl) return;
    try {
      const rendered = await renderTemplate(tmpl);
      if (ctx.kind === 'input') {
        applyRendered(ctx, rendered, { start: tokenInfo.tokenStart, end: tokenInfo.tokenEnd });
      } else {
        applyRendered(ctx, rendered, { range: tokenInfo.tokenRange });
      }
    } catch (err) { console.warn('SAE expand error:', err); }
  }

  // ----------------------
  // Gemini correction
  // ----------------------
  async function triggerGeminiCorrection() {
    const ctx = captureEditableContext(); if (!ctx) return;
    const bubble = notify.busy('Polishing text with Gemini…');
    try {
      const editor = makeEditor(ctx);
      let text = editor.getSelectedText();
      if (!text) text = editor.getAllText();
      if (!text) { bubble.update('Nothing to rewrite.'); return setTimeout(() => bubble.close(), 1200); }
      const truncated = maybeTruncate(text, CONFIG.gemini.maxInputChars);
      if (truncated.truncated) throttledToast(`Note: input truncated to ${CONFIG.gemini.maxInputChars} chars for correction.`);
      const correctedRaw = await correctWithGemini(truncated.text, bubble);
      if (correctedRaw == null) return;
      const corrected = stripModelArtifacts(correctedRaw);
      editor.replaceSelection(corrected, corrected.length);
      bubble.update('Rewritten ✓');
      setTimeout(() => bubble.close(), 900);
    } catch (err) {
      console.warn('Gemini correction error:', err);
      bubble.update('AI Fix failed — check console.');
      setTimeout(() => bubble.close(), 1400);
    }
  }

  async function triggerGeminiCustomPrompt() {
    const ctx = captureEditableContext(); if (!ctx) return;
    const bubble = notify.busy('Applying prompt…');
    try {
      const editor = makeEditor(ctx);
      let text = editor.getSelectedText();
      if (!text) text = editor.getAllText();
      if (!text) { bubble.update('Nothing to transform.'); return setTimeout(() => bubble.close(), 1200); }
      const pRaw = String(state.userPrompt || '').trim();
      if (!pRaw) { bubble.update('Set Custom Prompt in Settings.'); throttledToast('No custom prompt set. Open Settings to add it.'); return setTimeout(() => bubble.close(), 1400); }
      const truncated = maybeTruncate(text, CONFIG.gemini.maxInputChars);
      if (truncated.truncated) throttledToast(`Note: input truncated to ${CONFIG.gemini.maxInputChars} chars for prompt.`);
      const prompt = pRaw.includes('{}') ? pRaw.replaceAll('{}', truncated.text) : [pRaw, '', 'Return only the transformed text.', '', 'Text:', truncated.text].join('\n');
      const out = await geminiGenerate(prompt, bubble);
      if (out == null) return;
      const cleaned = stripModelArtifacts(out);
      editor.replaceSelection(cleaned, cleaned.length);
      bubble.update('Applied ✓');
      setTimeout(() => bubble.close(), 900);
    } catch (err) {
      console.warn('Gemini custom prompt error:', err);
      bubble.update('AI prompt failed — check console.');
      setTimeout(() => bubble.close(), 1400);
    }
  }

  function maybeTruncate(text, max) { return text.length <= max ? { text, truncated: false } : { text: text.slice(0, max), truncated: true }; }

  async function correctWithGemini(text, bubble) {
    const tone = (state.tone || 'neutral').toLowerCase();
    const prompt = [
      `You are a writing assistant.`,
      `Task: Correct grammar, spelling, punctuation; improve clarity and flow.`,
      `Tone: ${tone}. Preserve meaning. Keep the language and details.`,
      `Do not add explanations or quotes. Return only the corrected text.`,
      `Keep line breaks where reasonable.`,
      ``, `Text:`, text
    ].join('\n');

    try { return await geminiGenerate(prompt, bubble); } catch (err) { console.warn('Gemini request failed:', err); bubble?.update('Gemini request failed.'); throttledToast('Gemini request failed. Check connection.'); setTimeout(() => bubble && bubble.close(), 1400); return null; }
  }

  async function geminiGenerate(prompt, bubble) {
    const raw = String(state.apiKey || '').trim();
    const keys = raw ? raw.split(';').map(k => k.trim()).filter(k => k) : [];
    if (!keys.length) { bubble?.update('Set your Gemini API key in Settings.'); throttledToast('No Gemini API key set.'); setTimeout(() => bubble && bubble.close(), 1400); return null; }
    const start = Number.isInteger(state.apiKeyIndex) ? state.apiKeyIndex % keys.length : 0;
    for (let i = 0; i < keys.length; i++) {
      const idx = (start + i) % keys.length;
      const key = keys[idx];
      const url = `${CONFIG.gemini.endpoint}/${encodeURIComponent(CONFIG.gemini.model)}:generateContent?key=${encodeURIComponent(key)}`;
      try {
        const res = await GMX.request({ method: 'POST', url, headers: { 'Content-Type': 'application/json' }, data: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: CONFIG.gemini.temperature } }), timeout: CONFIG.gemini.timeoutMs });
        if (res.status < 200 || res.status >= 300) { continue; }
        let json; try { json = JSON.parse(res.text); } catch { continue; }
        const cand = json.candidates && json.candidates[0];
        const parts = (cand && cand.content && cand.content.parts) || [];
        const out = parts.map(p => p.text || '').join('').trim();
        if (!out) { continue; }
        state.apiKeyIndex = idx;
        return out;
      } catch (e) {
        continue;
      }
    }
    bubble?.update('Gemini error: all keys failed.');
    throttledToast('Gemini error: all keys failed.');
    setTimeout(() => bubble && bubble.close(), 1400);
    return null;
  }

  function stripModelArtifacts(s) {
    if (!s) return s; let out = String(s).trim();
    const m = out.match(/^\s*```(?:\w+)?\s*([\s\S]*?)\s*```\s*$/); if (m) out = m[1].trim();
    if ((out.startsWith('"') && out.endsWith('"')) || (out.startsWith("'") && out.endsWith("'"))) out = out.slice(1, -1);
    return out;
  }

  // ----------------------
  // Palette UI + dict management + Hotkeys + Settings
  // ----------------------
  async function setDict(obj, msg) {
    const normalized = normalizeDict(obj);
    if (!normalized || Object.keys(normalized).length === 0) { paletteEl?.__render?.(); toast('Dictionary unchanged — no valid entries.'); return; }
    state.dict = normalized;
    await GMX.setValue(CONFIG.storeKeys.dict, state.dict);
    paletteEl?.__render?.(); toast(msg || 'Dictionary updated.');
  }

  function pickFile(accept = '.json') {
    return new Promise(resolve => { const input = document.createElement('input'); input.type = 'file'; input.accept = accept; input.onchange = () => resolve(input.files?.[0] || null); input.click(); });
  }
  function exportDict() {
    const data = JSON.stringify(state.dict, null, 2);
    const name = `sae-dict-${new Date().toISOString().slice(0, 10)}.json`;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name;
    document.documentElement.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Dictionary exported.');
  }
  async function importDict() {
    const file = await pickFile('.json'); if (!file) return;
    try {
      const text = await file.text(); let obj = JSON.parse(text);
      if (obj && typeof obj === 'object' && obj.dict && typeof obj.dict === 'object') obj = obj.dict;
      const imported = normalizeDict(obj); const count = Object.keys(imported).length;
      if (!count) return toast('Import failed: no entries detected.');
      const next = { ...state.dict, ...imported };
      await setDict(next, `Imported ${count} entr${count === 1 ? 'y' : 'ies'}.`);
    } catch (err) { console.warn('Import failed:', err); toast('Import failed: invalid JSON.'); }
  }

  function mountRowEditor(container, { key = '', val = '', onSave, onCancel }) {
    container.classList.add('editing');
    container.innerHTML = `
      <div class="sae-key"><input type="text" class="edit-key" value="${escapeHtml(key)}" placeholder="abbreviation" /></div>
      <div class="sae-val"><input type="text" class="edit-val" value="${escapeHtml(val)}" placeholder="Expansion text..." /></div>
      <div class="sae-item-actions">
        <button data-action="save">Save</button>
        <button data-action="cancel">Cancel</button>
      </div>
    `;
    const keyInput = $('.edit-key', container);
    const valInput = $('.edit-val', container);
    const save = async () => { const k = keyInput.value.trim().toLowerCase(); if (!/^[\w-]+$/.test(k)) { toast('Invalid key — use letters, numbers, _ or -'); return; } await onSave?.(k, valInput.value.trim()); };
    const cancel = () => onCancel?.();

    $('[data-action="save"]', container).addEventListener('click', save);
    $('[data-action="cancel"]', container).addEventListener('click', cancel);

    [keyInput, valInput].forEach(inp => inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); (inp === keyInput ? valInput.focus() : save()); }
      if (e.key === 'Escape') { e.preventDefault(); cancel(); }
    }));

    keyInput.focus();
    keyInput.select?.();
  }

  function ensurePalette() {
    if (paletteEl) return paletteEl;

    const wrap = document.createElement('div');
    wrap.className = 'sae-palette';
    wrap.innerHTML = `
      <div class="sae-panel" role="dialog" aria-label="Abbreviation Palette">
        <div class="sae-panel-header">
          <input class="sae-search" type="search" placeholder="Search abbreviations…" />
          <button class="sae-icon-btn" data-action="settings" title="Settings">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v10M1 12h6m6 0h10"></path>
              <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24M19.07 4.93l-4.24 4.24m-5.66 5.66-4.24 4.24"></path>
            </svg>
          </button>
          <button class="sae-icon-btn" data-action="back" title="Back" style="display:none">
            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button class="sae-icon-btn" data-action="close" title="Close">
            <svg viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="sae-settings-view"></div>
        <div class="sae-list" tabindex="0"></div>
        <div class="sae-add-new">
          <button data-action="add">+ Add New Abbreviation</button>
        </div>
        <div class="sae-footer">Alt+P to open · Shift+Space to expand · Alt+G to correct grammar/tone</div>
      </div>
    `;
    document.documentElement.appendChild(wrap);

    const panel = $('.sae-panel', wrap);
    const search = $('.sae-search', wrap);
    const list = $('.sae-list', wrap);
    const settingsBtn = $('[data-action="settings"]', wrap);
    const backBtn = $('[data-action="back"]', wrap);
    const closeBtn = $('[data-action="close"]', wrap);
    const addNewBtn = $('.sae-add-new button', wrap);
    const settingsView = $('.sae-settings-view', wrap);

    function renderList(filter = '') {
      const q = filter.trim().toLowerCase();
      const keys = Object.keys(state.dict).sort();
      const items = q ? keys.filter(k => k.includes(q) || state.dict[k].toLowerCase().includes(q)) : keys;

      if (state.activeIndex >= items.length) state.activeIndex = Math.max(0, items.length - 1);

      list.innerHTML = items.map((k, i) => `
        <div class="sae-item${i === state.activeIndex ? ' active' : ''}" data-key="${escapeHtml(k)}" data-index="${i}">
          <div class="sae-key">${escapeHtml(k)}</div>
          <div class="sae-val">${escapeHtml(state.dict[k])}</div>
          <div class="sae-item-actions">
            <button data-action="edit">Edit</button>
            <button data-action="delete">Delete</button>
          </div>
        </div>`).join('');
    }

    // Event delegation for list items
    list.addEventListener('click', (e) => {
      const item = e.target.closest('.sae-item');
      if (!item) return;
      const action = e.target.closest('[data-action]')?.dataset.action;
      const key = item.dataset.key;

      if (item.classList.contains('editing')) return;

      if (action === 'edit') {
        e.stopPropagation();
        const value = state.dict[key];
        item.classList.add('editing');
        mountRowEditor(item, {
          key, val: value,
          onSave: async (newKey, newVal) => {
            if (!newKey || !newVal) return toast('Key and value cannot be empty.');
            const updated = { ...state.dict };
            if (newKey !== key) delete updated[key];
            updated[newKey] = newVal;
            await setDict(updated, 'Abbreviation saved.');
          },
          onCancel: () => renderList(search.value),
        });
      } else if (action === 'delete') {
        e.stopPropagation();
        deleteItem(key);
      } else if (e.target.closest('.sae-key, .sae-val')) {
        selectAndInsert(key);
      }
    });

    function deleteItem(key) {
      if (!confirm(`Delete abbreviation "${key}"?`)) return;
      const updated = { ...state.dict };
      delete updated[key];
      setDict(updated, 'Abbreviation deleted.');
    }

    function addNewItem() {
      search.value = ''; // ADD THIS LINE
      renderList(''); // Pass empty string explicitly

      const tempDiv = document.createElement('div');
      tempDiv.className = 'sae-item editing';
      list.insertBefore(tempDiv, list.firstChild);
      mountRowEditor(tempDiv, {
        onSave: async (newKey, newVal) => {
          if (!newKey || !newVal) return toast('Key and value cannot be empty.');
          const updated = { ...state.dict, [newKey]: newVal };
          await setDict(updated, 'Abbreviation added.');
        },
        onCancel: () => { tempDiv.remove(); renderList(search.value); }
      });
    }

    async function selectAndInsert(key) {
      // Prefer the saved context captured when opening palette click
      let ctx = null;
      const saved = state.lastEditable;
      if (saved && (
        (saved.kind === 'input' && saved.el?.isConnected) ||
        (saved.kind === 'ce' && saved.root?.isConnected)
      )) {
        ctx = saved;
      } else {
        ctx = getBestInsertionContext();
      }

      closePalette();

      const tmpl = state.dict[key];
      if (!tmpl || !ctx) { if (!ctx) toast('No editable field found.'); return; }

      try { (ctx.kind === 'input' ? ctx.el : ctx.root).focus({ preventScroll: true }); } catch { }

      const rendered = await renderTemplate(tmpl);

      // ADD TRY/CATCH HERE:
      try {
        if (ctx.kind === 'input') {
          const start = typeof ctx.start === 'number' ? ctx.start : (ctx.el.selectionStart ?? ctx.el.value.length);
          const end = typeof ctx.end === 'number' ? ctx.end : (ctx.el.selectionEnd ?? ctx.el.value.length);
          applyRendered(ctx, rendered, { start, end });
        } else if (ctx.kind === 'ce' && ctx.range instanceof Range) {
          // Validate range before using
          ctx.range.startContainer; // Throws if detached
          applyRendered(ctx, rendered, { range: ctx.range });
        } else {
          applyRendered(ctx, rendered);
        }
      } catch (err) {
        console.warn('SAE: Saved context invalid, using fallback insertion:', err);
        // Fallback: try current selection or end-of-field
        const freshCtx = captureEditableContext() || getBestInsertionContext();
        if (freshCtx) {
          try {
            applyRendered(freshCtx, rendered);
          } catch (e2) {
            toast('Insertion failed — field may have changed.');
          }
        } else {
          toast('No editable field available.');
        }
      }
    }

    function openSettingsView() {
      panel.classList.add('settings-open');
      backBtn.style.display = 'flex';
      renderSettingsView();
    }
    function closeSettingsView() {
      panel.classList.remove('settings-open');
      backBtn.style.display = 'none';
      search.focus({ preventScroll: true });
    }

    function renderSettingsView() {
      const hkExpand = hotkeyToString(CONFIG.trigger, true);
      const hkPalette = hotkeyToString(CONFIG.palette, false);
      const hkCorrect = hotkeyToString(CONFIG.correct, false);
      const hkCustom = hotkeyToString(CONFIG.customPrompt, false);
      const tones = ['neutral', 'friendly', 'formal', 'casual', 'concise'];

      settingsView.innerHTML = `
        <div class="sae-hrow">
          <div>Tone (Gemini)</div>
          <div><select class="sae-select tone-select">
            ${tones.map(t => `<option value="${t}" ${t === state.tone ? 'selected' : ''}>${t}</option>`).join('')}
          </select></div>
          <div></div>
        </div>
        <div class="sae-hrow">
          <div>Gemini API Key(s)</div>
          <div>
            <input type="text" class="sae-text api-key-input" placeholder="Enter API keys separated by ;" value="${escapeHtml(state.apiKey || '')}" />
            <div class="sae-help">Supports multiple keys separated by ; — rotates on error/limits.</div>
          </div>
          <div><button class="sae-btn verify-api">Verify</button></div>
        </div>
        <div class="sae-hrow">
          <div>Hotkeys</div>
          <div>
            <div style="margin-bottom:6px">
              <span class="sae-chip">Expand: ${hkExpand}</span>
              <button class="sae-btn" data-hk="trigger">Change</button>
            </div>
            <div style="margin-bottom:6px">
              <span class="sae-chip">Palette: ${hkPalette}</span>
              <button class="sae-btn" data-hk="palette">Change</button>
            </div>
            <div>
              <span class="sae-chip">Correct: ${hkCorrect}</span>
              <button class="sae-btn" data-hk="correct">Change</button>
            </div>
            <div style="margin-top:6px">
              <span class="sae-chip">Custom Prompt: ${hkCustom}</span>
              <button class="sae-btn" data-hk="customPrompt">Change</button>
            </div>
          </div>
          <div></div>
        </div>
        <div class="sae-hrow">
          <div>Custom Prompt</div>
          <div>
            <textarea class="sae-textarea user-prompt-input" placeholder="Write your instruction. Use {} to insert selection. Example: Rewrite to concise, friendly tone: {}">${escapeHtml(state.userPrompt || '')}</textarea>
            <div class="sae-help">Use {} to insert the selected text. Example: Rewrite to concise, friendly tone: {}</div>
          </div>
          <div></div>
        </div>
        <div class="sae-hrow">
          <div>Dictionary</div>
          <div class="sae-settings-actions">
            <button class="sae-btn" data-action="export">Export JSON</button>
            <button class="sae-btn" data-action="import">Import JSON</button>
            <button class="sae-btn" data-action="reset">Reset to Defaults</button>
          </div>
          <div></div>
        </div>
        <div class="sae-settings-footer">
          <button class="sae-btn" data-action="done">Done</button>
        </div>
      `;

      // Tone change
      $('.tone-select', settingsView).addEventListener('change', async (e) => {
        state.tone = e.target.value;
        await GMX.setValue(CONFIG.storeKeys.tone, state.tone);
        toast(`Tone set to ${state.tone}.`);
      });

      // Verify API key
      const verifyBtn = $('.verify-api', settingsView);
      const apiInput = $('.api-key-input', settingsView);
      verifyBtn.addEventListener('click', async () => {
        await verifyAndSaveApiKey(apiInput.value.trim(), verifyBtn);
      });
      apiInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') { e.preventDefault(); await verifyAndSaveApiKey(apiInput.value.trim(), verifyBtn); }
      });

      // Hotkeys
      settingsView.querySelectorAll('[data-hk]').forEach(btn => {
        btn.addEventListener('click', async () => {
          const name = btn.getAttribute('data-hk');
          const kind = (name === 'trigger') ? 'spaceOnly' : 'code';
          await setHotkey(name, kind);
          renderSettingsView();
        });
      });

      const promptInput = $('.user-prompt-input', settingsView);
      const autoSize = (el) => { el.style.height = 'auto'; el.style.height = Math.min(420, el.scrollHeight) + 'px'; };
      autoSize(promptInput);
      promptInput.addEventListener('input', async (e) => { autoSize(promptInput); state.userPrompt = e.target.value; await GMX.setValue(CONFIG.storeKeys.userPrompt, state.userPrompt); });
      promptInput.addEventListener('change', async (e) => { autoSize(promptInput); state.userPrompt = e.target.value; await GMX.setValue(CONFIG.storeKeys.userPrompt, state.userPrompt); toast('Custom prompt saved.'); });

      // Dict actions
      $('[data-action="export"]', settingsView).addEventListener('click', () => exportDict());
      $('[data-action="import"]', settingsView).addEventListener('click', () => importDict());
      $('[data-action="reset"]', settingsView).addEventListener('click', () => {
        if (confirm('Reset dictionary to defaults?')) setDict(DEFAULT_DICT, 'Dictionary reset.');
      });
      $('[data-action="done"]', settingsView).addEventListener('click', () => closeSettingsView());
    }

    const renderListDebounced = debounce(() => { state.activeIndex = 0; renderList(search.value); }, CONFIG.searchDebounceMs);
    search.addEventListener('input', () => renderListDebounced());

    settingsBtn.addEventListener('click', () => openSettingsView());
    backBtn.addEventListener('click', () => closeSettingsView());
    closeBtn.addEventListener('click', closePalette);
    addNewBtn.addEventListener('click', addNewItem);

    // Keyboard (list view only)
    wrap.addEventListener('keydown', (e) => {
      const panel = $('.sae-panel', wrap);
      if (panel.classList.contains('settings-open')) return;
      if (e.target.closest('.sae-item.editing')) return;
      if (e.key === 'Escape') { e.preventDefault(); closePalette(); return; }
      if (e.key === 'Enter') {
        e.preventDefault();
        renderList(search.value);
        const active = wrap.querySelector('.sae-item.active:not(.editing)');
        if (active) selectAndInsert(active.dataset.key);
        return;
      }
      const items = [...wrap.querySelectorAll('.sae-item:not(.editing)')];
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[state.activeIndex]?.classList.remove('active');
        state.activeIndex = Math.min(items.length - 1, state.activeIndex + 1);
        items[state.activeIndex]?.classList.add('active');
        items[state.activeIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[state.activeIndex]?.classList.remove('active');
        state.activeIndex = Math.max(0, state.activeIndex - 1);
        items[state.activeIndex]?.classList.add('active');
        items[state.activeIndex]?.scrollIntoView({ block: 'nearest' });
      }
    });

    renderList();
    wrap.__render = () => renderList(search.value);
    paletteEl = wrap;
    return wrap;
  }

  function openPalette() {
    const p = ensurePalette();
    p.classList.add('open');

    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const panel = p.querySelector('.sae-panel');
    panel.classList.remove('settings-open');
    const backBtn = p.querySelector('[data-action="back"]');
    if (backBtn) backBtn.style.display = 'none';
    const search = p.querySelector('.sae-search');
    search.value = '';
    state.activeIndex = 0;
    p.__render?.();
    search.focus({ preventScroll: true });
  }

  function closePalette() {
    if (!paletteEl) return;
    document.body.style.overflow = prevOverflow; prevOverflow = '';
    const panel = paletteEl.querySelector('.sae-panel');
    if (panel) panel.classList.remove('settings-open');
    const backBtn = paletteEl.querySelector('[data-action="back"]');
    if (backBtn) backBtn.style.display = 'none';
    if (hotkeyCapture) { hotkeyCapture.bubble?.close(); hotkeyCapture.resolve(null); hotkeyCapture = null; }
    paletteEl.classList.remove('open');
  }

  // ----------------------
  // Fallback helpers
  // ----------------------
  function elementIsVisible(el) {
    if (!el || !(el instanceof Element)) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
    const r = el.getBoundingClientRect();
    if ((r.width === 0 && r.height === 0) || (r.bottom < 0 || r.right < 0 || r.top > window.innerHeight || r.left > window.innerWidth)) return false;
    return true;
  }

  function fallbackFindEditable() {
    const lf = state._lastFocusedEditable && isEditable(state._lastFocusedEditable);
    if (lf && elementIsVisible(lf)) return lf;

    const ae = isEditable(document.activeElement);
    if (ae && elementIsVisible(ae)) return ae;

    const sel = 'textarea, input[type="text"], input[type="search"], input[type="url"], input[type="email"], input[type="tel"], [contenteditable]:not([contenteditable="false"])';
    const nodes = Array.from(document.querySelectorAll(sel));
    for (const n of nodes) {
      const ed = isEditable(n);
      if (ed && elementIsVisible(ed) && !(ed instanceof HTMLInputElement && ed.disabled)) {
        return ed;
      }
    }
    return null;
  }

  function buildEndContextForEl(el) {
    if (!el) return null;
    if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
      const pos = el.value.length;
      try { el.focus({ preventScroll: true }); } catch { }
      return { kind: 'input', el, start: pos, end: pos, collapsed: true };
    }
    let root = el;
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      if (n.isContentEditable) { root = n; break; }
    }
    try { root.focus({ preventScroll: true }); } catch { }
    const range = document.createRange();
    range.selectNodeContents(root);
    range.collapse(false);
    return { kind: 'ce', root, range, collapsed: true };
  }

  function getBestInsertionContext() {
    const ctx = captureEditableContext();
    if (ctx) return ctx;

    if (state.lastEditable && ((state.lastEditable.kind === 'input' && state.lastEditable.el?.isConnected) ||
      (state.lastEditable.kind === 'ce' && state.lastEditable.root?.isConnected))) {
      const el = (state.lastEditable.kind === 'input') ? state.lastEditable.el : state.lastEditable.root;
      return buildEndContextForEl(el);
    }

    const el = fallbackFindEditable();
    if (!el) return null;
    return buildEndContextForEl(el);
  }

  // ----------------------
  // Utils
  // ----------------------
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function normalizeDict(obj) {
    const out = {}; let dropped = 0;
    for (const [k, v] of Object.entries(obj || {})) {
      if (typeof k === 'string' && typeof v === 'string' && k.trim()) out[k.trim().toLowerCase()] = v;
      else dropped++;
    }
    if (dropped > 0) console.warn(`SAE: Dropped ${dropped} invalid dictionary entries during normalization.`);
    return out;
  }
  function hotkeyToString(spec, isSpace) {
    const parts = [];
    if (spec.ctrl) parts.push('Ctrl');
    if (spec.meta) parts.push('Meta');
    if (spec.alt) parts.push('Alt');
    if (spec.shift) parts.push('Shift');
    if (isSpace || !spec.code) parts.push('Space'); else parts.push(codeToHuman(spec.code));
    return parts.join('+');
  }
  function codeToHuman(code) { if (!code) return 'Space'; if (code.startsWith('Key')) return code.slice(3); if (code.startsWith('Digit')) return code.slice(5); if (code === 'Space') return 'Space'; return code; }
  function toast(msg, ms = 2200) { notify.toast(msg, ms); }
  function throttledToast(msg, ms = 2200) { const now = Date.now(); if (now - state._lastToastAt < CONFIG.toast.throttleMs) return; state._lastToastAt = now; toast(msg, ms); }

  // API key verify + save
  async function verifyAndSaveApiKey(keyInput, btn) {
    if (!keyInput) { toast('Enter API key(s) first.'); return; }
    const oldText = btn.textContent;
    btn.textContent = 'Verifying…'; btn.disabled = true; btn.classList.remove('ok');
    try {
      const keys = keyInput.split(';').map(k => k.trim()).filter(k => k);
      if (!keys.length) { btn.textContent = 'Verify'; toast('Enter valid API key(s).'); return; }
      const results = [];
      let okIdx = -1;
      for (let i = 0; i < keys.length; i++) {
        const url = `${CONFIG.gemini.endpoint}?key=${encodeURIComponent(keys[i])}`;
        try {
          const res = await GMX.request({ method: 'GET', url, timeout: CONFIG.gemini.timeoutMs });
          if (res.status >= 200 && res.status < 300) { results.push({ i, ok: true }); if (okIdx === -1) okIdx = i; }
          else { results.push({ i, ok: false, code: res.status }); }
        } catch (e) {
          results.push({ i, ok: false, code: 'ERR' });
        }
      }
      const failed = results.filter(r => !r.ok).map(r => r.i + 1);
      const succeeded = results.filter(r => r.ok).map(r => r.i + 1);
      if (okIdx >= 0) {
        state.apiKey = keys.join(';');
        state.apiKeyIndex = okIdx;
        await GMX.setValue(CONFIG.storeKeys.apiKey, state.apiKey);
        btn.classList.add('ok'); btn.textContent = 'Verified ✓';
        if (failed.length) toast(`Verified: #${succeeded.join(', #')} • Failed: #${failed.join(', #')}`);
        else toast(`Verified: #${succeeded.join(', #')}`);
      } else {
        btn.textContent = 'Verify';
        toast(`Verification failed for all keys: #${failed.join(', #')}`);
      }
    } catch (err) {
      console.warn('Verify key failed:', err);
      btn.textContent = 'Verify';
      toast('Verification failed — check console/network.');
    } finally {
      setTimeout(() => { btn.disabled = false; if (!btn.classList.contains('ok')) btn.textContent = oldText; }, 800);
    }
  }

  // ----------------------
  // Styles injection (once, at document-start)
  // ----------------------
  GMX.addStyle(STYLES);

})();