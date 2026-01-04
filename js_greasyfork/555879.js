// ==UserScript==
// @name         TinyTyper+ — Auto Typing Snippets
// @namespace    http://tampermonkey.net/
// @version      1.6.8
// @description  Human-like typing snippets with GM storage, volatile "Hide" items, single-select radio, EN/JA UI, auto-typing toggle, import/export, and Tampermonkey menu. UI styles are fixed so they are not broken by site CSS or dark themes.
// @license      MIT
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555879/TinyTyper%2B%20%E2%80%94%20Auto%20Typing%20Snippets.user.js
// @updateURL https://update.greasyfork.org/scripts/555879/TinyTyper%2B%20%E2%80%94%20Auto%20Typing%20Snippets.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  /* ---------- Keys & defaults ---------- */
  const STORAGE_KEY = 'tinystyper_plus.snippets.v1';
  const LS_LEGACY_KEY = 'tinystyper_plus.snippets.v1.ls';
  const LANG_KEY = 'tinystyper_plus.lang';
  const PANEL_VISIBLE_KEY = 'tinystyper_plus.panelVisible';
  const AUTO_KEY = 'tinystyper_plus.autotype';
  const DEFAULT_DELAY_MS = 100;
  const RANDOMIZE_DEFAULT = true;
  const AUTO_DEFAULT = true;
  const AUTO_MIGRATE_FROM_LS = true;

  /* ---------- i18n ---------- */
  const LANGS = {
    ja: {
      title: 'TinyTyper+',
      clear: '解除',
      manage: '管理',
      close: '×',
      addPlaceholder: '新しいスニペットを追加...',
      hide: '隠す',
      add: '追加',
      delay: '遅延(ms)',
      random: 'ランダム',
      simkeys: 'キーイベントをシミュレート',
      simkeysNote: '(オンにすると keydown/keypress/input/keyup を発火)',
      howto: '使い方: 「隠す」にチェックしたものは保存されません（セッション限定）。管理ボタンで全データの一括削除ができます。',
      edit: '編集',
      del: '削除',
      pin: 'ピン/解除',
      maskTitle: '隠す（volatile）: リロードで消えます',
      btnLang: 'EN/JA',
      menuToggle: 'TinyTyper+: 表示/非表示',
      menuErr: '表示切替でエラーが発生しました。コンソールを確認してください。',
      needText: 'テキストを入力してください',
      gmList: '全スニペット一覧（先頭60文字）:',
      gmOps: '操作:\n1 = 全削除\n2 = エクスポート（JSONをコピー）\n3 = インポート（JSONを貼り付け）\n何もしないなら空でキャンセル',
      confirmDelAll: '本当に全スニペットを削除しますか？（復元不可）',
      delAllDone: '全削除しました',
      copied: 'JSON をクリップボードにコピーしました。',
      importPrompt: 'インポートする JSON を貼り付けてください：',
      importFail: 'インポート失敗: ',
      invalidOp: '無効な操作です',
      editPrompt: '編集：',
      autoOn: '自動入力 ON',
      autoOff: '自動入力 OFF',
      autoTitle: 'クリックすると自動入力のオン/オフを切り替えます'
    },
    en: {
      title: 'TinyTyper+',
      clear: 'Clear',
      manage: 'Manage',
      close: '×',
      addPlaceholder: 'Add a new snippet...',
      hide: 'Hide',
      add: 'Add',
      delay: 'Delay(ms)',
      random: 'Random',
      simkeys: 'Simulate key events',
      simkeysNote: '(fires keydown/keypress/input/keyup when on)',
      howto: "How to: Checked 'Hide' items are session-only. Use Manage to bulk delete/export/import.",
      edit: 'Edit',
      del: 'Delete',
      pin: 'Pin/Unpin',
      maskTitle: 'Hidden (volatile): will be cleared on reload',
      btnLang: 'EN/JA',
      menuToggle: 'TinyTyper+: Show/Hide',
      menuErr: 'Error while toggling. See console.',
      needText: 'Please enter text.',
      gmList: 'All snippets (first 60 chars):',
      gmOps: 'Actions:\n1 = Delete all\n2 = Export (copy JSON)\n3 = Import (paste JSON)\nLeave empty to cancel',
      confirmDelAll: 'Really delete ALL snippets? (irreversible)',
      delAllDone: 'Deleted all.',
      copied: 'Copied JSON to clipboard.',
      importPrompt: 'Paste JSON to import:',
      importFail: 'Import failed: ',
      invalidOp: 'Invalid action',
      editPrompt: 'Edit:',
      autoOn: 'Auto type ON',
      autoOff: 'Auto type OFF',
      autoTitle: 'Toggle auto typing on/off'
    }
  };

  let lang = (await GM_getValue(LANG_KEY, 'ja')) || 'ja';
  const t = (k) => (LANGS[lang] && LANGS[lang][k]) || LANGS.ja[k] || k;
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  let autoTypeEnabled = await GM_getValue(AUTO_KEY, AUTO_DEFAULT);

  /* ---------- storage helpers ---------- */
  async function loadSavedSnippets() {
    try {
      const raw = await GM_getValue(STORAGE_KEY, null);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async function saveSavedSnippets(arr) {
    try {
      await GM_setValue(STORAGE_KEY, JSON.stringify(arr));
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteAllSavedSnippets() {
    try {
      await GM_deleteValue(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }

  async function migrateFromLocalStorageIfNeeded() {
    try {
      if (!AUTO_MIGRATE_FROM_LS) return;
      const current = await loadSavedSnippets();
      if (current.length > 0) return;
      const raw = localStorage.getItem(LS_LEGACY_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        await saveSavedSnippets(parsed);
        localStorage.removeItem(LS_LEGACY_KEY);
      }
    } catch (e) {
      console.error('Migration error', e);
    }
  }

  function isTypeable(el) {
    if (!el) return false;
    if (el.isContentEditable) return true;
    if (el.tagName === 'TEXTAREA') return true;
    if (el.tagName === 'INPUT') {
      const tp = (el.type || '').toLowerCase();
      return ['text', 'search', 'email', 'url', 'tel', 'password', 'number'].includes(tp);
    }
    return false;
  }

  /* ---------- panel creation ---------- */
  const panel = document.createElement('div');
  panel.id = 'tinystyper-plus-panel';
  panel.style.cssText = `
    position: fixed; right: 18px; bottom: 18px; width: 420px; max-height: 72vh;
    background: rgba(255,255,255,0.97); border: 1px solid rgba(0,0,0,0.2);
    box-shadow: 0 10px 32px rgba(0,0,0,0.25);
    z-index: 2147483647; padding: 10px; font-family: system-ui,Segoe UI,Roboto,Helvetica,Arial;
    overflow:auto; border-radius:10px; font-size:13px; backdrop-filter: blur(2px);
  `;
  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <strong id="tsp-title" style="font-size:14px">${t('title')}</strong>
      <div style="display:flex;gap:6px;align-items:center">
        <button id="tsp-lang" style="font-size:12px;padding:4px 6px">${t('btnLang')}</button>
        <button id="tsp-auto" title="${t('autoTitle')}" style="font-size:12px;padding:4px 6px"></button>
        <button id="tsp-clearchecks" style="font-size:12px;padding:4px 6px">${t('clear')}</button>
        <button id="tsp-global-manage" style="font-size:12px;padding:4px 6px">${t('manage')}</button>
        <button id="tsp-close" style="font-size:12px;padding:4px 6px">${t('close')}</button>
      </div>
    </div>
    <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px;">
      <input id="tsp-newtext" placeholder="${t('addPlaceholder')}" style="flex:1;padding:6px;font-size:13px" />
      <label style="display:flex;align-items:center;gap:6px;font-size:12px;">
        <input id="tsp-hide-new" type="checkbox"/> ${t('hide')}
      </label>
      <button id="tsp-add" style="padding:6px;font-size:13px">${t('add')}</button>
    </div>
    <div style="margin-bottom:6px;display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
      <label style="font-size:12px">${t('delay')}</label>
      <input id="tsp-delay" type="number" min="0" value="${DEFAULT_DELAY_MS}" style="width:80px;padding:4px" />
      <label style="font-size:12px;margin-left:6px;"><input id="tsp-random" type="checkbox" ${RANDOMIZE_DEFAULT ? 'checked' : ''}/> ${t('random')}</label>
      <label style="font-size:12px;margin-left:10px;"><input id="tsp-simkeys" type="checkbox"/> ${t('simkeys')}</label>
      <span style="font-size:12px;color:#666;margin-left:6px;">${t('simkeysNote')}</span>
    </div>
    <div id="tsp-list" style="font-size:13px"></div>
    <div style="margin-top:8px;font-size:11px;color:#777">${t('howto')}</div>
  `;

  (document.body || document.documentElement).appendChild(panel);
  try { window.tinystyperPanel = panel; } catch (e) {}

  // ★ 固定スタイル（サイトのCSSやダークテーマに負けない）
  const tspStyle = document.createElement('style');
  tspStyle.textContent = `
    #tinystyper-plus-panel,
    #tinystyper-plus-panel * {
      box-sizing: border-box !important;
      font-family: system-ui,Segoe UI,Roboto,Helvetica,Arial !important;
      color: #000000 !important;
    }
    #tinystyper-plus-panel input,
    #tinystyper-plus-panel button,
    #tinystyper-plus-panel textarea,
    #tinystyper-plus-panel select {
      background: #ffffff !important;
      color: #000000 !important;
      border: 1px solid #cccccc !important;
    }
    /* カスタムチェックボックス／ラジオ（常に同じ見た目） */
    #tinystyper-plus-panel input[type="checkbox"],
    #tinystyper-plus-panel input[type="radio"] {
      appearance: none !important;
      -webkit-appearance: none !important;
      -moz-appearance: none !important;
      background: #ffffff !important;
      border: 1px solid #666666 !important;
      width: 14px !important;
      height: 14px !important;
      padding: 0 !important;
      margin: 0 3px 0 0 !important;
      border-radius: 3px !important;
      position: relative !important;
      box-shadow: none !important;
    }
    #tinystyper-plus-panel input[type="radio"] {
      border-radius: 50% !important;
    }
    #tinystyper-plus-panel input[type="checkbox"]:checked::after {
      content: "✔";
      position: absolute;
      top: -3px;
      left: 1px;
      font-size: 14px;
      line-height: 1;
      color: #000000;
    }
    #tinystyper-plus-panel input[type="radio"]:checked::after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      right: 3px;
      bottom: 3px;
      border-radius: inherit;
      background: #333333;
    }
  `;
  document.head.appendChild(tspStyle);

  async function setPanelVisible(flag) {
    panel.style.display = flag ? 'block' : 'none';
    await GM_setValue(PANEL_VISIBLE_KEY, flag);
  }
  const initialVisible = await GM_getValue(PANEL_VISIBLE_KEY, true);
  panel.style.display = initialVisible ? 'block' : 'none';

  async function togglePanelDisplay() {
    const willShow = panel.style.display === 'none';
    await setPanelVisible(willShow);
  }

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand(t('menuToggle'), () => {
      togglePanelDisplay().catch(e => {
        console.error('TinyTyper menu toggle error', e);
        alert(t('menuErr'));
      });
    });
  }

  // ドラッグで移動
  (function makeDraggable(node) {
    let isDown = false, startX, startY, startLeft, startTop;
    node.addEventListener('mousedown', (e) => {
      if (['INPUT', 'BUTTON', 'TEXTAREA', 'LABEL', 'SELECT'].includes(e.target.tagName)) return;
      isDown = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = node.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      e.preventDefault();
    }, true);
    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      node.style.left = (startLeft + (e.clientX - startX)) + 'px';
      node.style.top = (startTop + (e.clientY - startY)) + 'px';
      node.style.right = 'auto';
      node.style.bottom = 'auto';
    }, true);
    window.addEventListener('mouseup', () => { isDown = false; }, true);
  })(panel);

  // UI 要素
  const listEl = document.getElementById('tsp-list');
  const inputNew = document.getElementById('tsp-newtext');
  const hideNewChk = document.getElementById('tsp-hide-new');
  const delayInput = document.getElementById('tsp-delay');
  const randomChk = document.getElementById('tsp-random');
  const simKeysChk = document.getElementById('tsp-simkeys');
  const btnAdd = document.getElementById('tsp-add');
  const btnClose = document.getElementById('tsp-close');
  const btnClear = document.getElementById('tsp-clearchecks');
  const btnManage = document.getElementById('tsp-global-manage');
  const btnLang = document.getElementById('tsp-lang');
  const btnAuto = document.getElementById('tsp-auto');

  function syncAutoButton() {
    btnAuto.textContent = autoTypeEnabled ? t('autoOn') : t('autoOff');
    btnAuto.style.background = autoTypeEnabled ? '#e0f0ff' : 'transparent';
    btnAuto.style.border = autoTypeEnabled ? '1px solid #88a' : '1px solid transparent';
  }
  syncAutoButton();

  btnAuto.addEventListener('click', async () => {
    autoTypeEnabled = !autoTypeEnabled;
    await GM_setValue(AUTO_KEY, autoTypeEnabled);
    syncAutoButton();
  });

  /* ---------- state ---------- */
  await migrateFromLocalStorageIfNeeded();
  let savedCache = await loadSavedSnippets();
  let volatileSnippets = [];   // 隠す＝セッション限定

  const getAllSnippets = () => [
    ...volatileSnippets,
    ...savedCache.map(x => ({ ...x, volatile: false }))
  ];

  function escapeHtml(s) {
    return String(s).replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
  }

  function renderList() {
    listEl.innerHTML = '';
    const arr = getAllSnippets().sort((a, b) => {
      const pa = a.pinned ? 1 : 0;
      const pb = b.pinned ? 1 : 0;
      if (pa !== pb) return pb - pa;
      return (b.lastUsed || 0) - (a.lastUsed || 0);
    });

    for (const s of arr) {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px;padding:4px;border-radius:6px;';
      if (s.volatile) {
        wrap.style.opacity = '0.95';
        wrap.title = t('maskTitle');
      } else if (s.pinned) {
        wrap.style.background = 'linear-gradient(90deg,#fffdf5,#fff)';
      }
      wrap.innerHTML = `
        <input class="tsp-chk" type="radio" name="tsp-selected" data-id="${s.id}" ${s.checked ? 'checked' : ''}/>
        <div class="tsp-text" data-id="${s.id}" title="${t('edit')}" style="flex:1;word-break:break-all;cursor:pointer;">
          ${s.volatile ? '♥♥♥♥♥' : escapeHtml(s.text)}
        </div>
        <label style="font-size:12px;display:flex;align-items:center;gap:4px;">
          <input class="tsp-hide" type="checkbox" data-id="${s.id}" ${s.volatile ? 'checked' : ''}/> ${t('hide')}
        </label>
        <button class="tsp-pin" data-id="${s.id}" style="font-size:12px">${t('pin')}</button>
        <button class="tsp-edit" data-id="${s.id}" style="font-size:12px">${t('edit')}</button>
        <button class="tsp-del" data-id="${s.id}" style="font-size:12px">${t('del')}</button>
      `;
      listEl.appendChild(wrap);
    }
  }

  // 言語切替
  btnLang.addEventListener('click', async () => {
    lang = (lang === 'ja' ? 'en' : 'ja');
    await GM_setValue(LANG_KEY, lang);
    location.reload();
  });

  // 追加
  btnAdd.addEventListener('click', async () => {
    const v = inputNew.value.trim();
    if (!v) {
      alert(t('needText'));
      return;
    }
    const now = Date.now();
    if (hideNewChk.checked) {
      volatileSnippets.unshift({
        id: uid(),
        text: v,
        checked: false,
        pinned: false,
        lastUsed: now,
        volatile: true
      });
    } else {
      savedCache.push({
        id: uid(),
        text: v,
        checked: false,
        pinned: false,
        lastUsed: now
      });
      await saveSavedSnippets(savedCache);
    }
    inputNew.value = '';
    hideNewChk.checked = false;
    renderList();
  });

  // リスト内操作
  listEl.addEventListener('click', async (e) => {
    const id = e.target.getAttribute('data-id');
    if (!id) return;
    const sIdx = savedCache.findIndex(x => x.id === id);
    const vIdx = volatileSnippets.findIndex(x => x.id === id);

    // 削除
    if (e.target.classList.contains('tsp-del')) {
      if (vIdx >= 0) volatileSnippets.splice(vIdx, 1);
      if (sIdx >= 0) savedCache.splice(sIdx, 1);
      await saveSavedSnippets(savedCache);
      renderList();
      return;
    }

    // ピン
    if (e.target.classList.contains('tsp-pin')) {
      const now = Date.now();
      if (vIdx >= 0) {
        volatileSnippets[vIdx].pinned = !volatileSnippets[vIdx].pinned;
        volatileSnippets[vIdx].lastUsed = now;
      } else if (sIdx >= 0) {
        savedCache[sIdx].pinned = !savedCache[sIdx].pinned;
        savedCache[sIdx].lastUsed = now;
        await saveSavedSnippets(savedCache);
      }
      renderList();
      return;
    }

    // 編集
    if (e.target.classList.contains('tsp-edit') || (e.target.classList.contains('tsp-text') && e.detail === 2)) {
      const target = (vIdx >= 0 ? volatileSnippets[vIdx] : savedCache[sIdx]);
      const nt = prompt(t('editPrompt'), target.text);
      if (nt == null) return;
      target.text = nt;
      target.lastUsed = Date.now();
      await saveSavedSnippets(savedCache);
      renderList();
      return;
    }

    // チェック
    if (e.target.classList.contains('tsp-chk') || e.target.classList.contains('tsp-text')) {
      savedCache.forEach(a => a.checked = false);
      volatileSnippets.forEach(a => a.checked = false);
      if (vIdx >= 0) {
        volatileSnippets[vIdx].checked = true;
        volatileSnippets[vIdx].lastUsed = Date.now();
      } else if (sIdx >= 0) {
        savedCache[sIdx].checked = true;
        savedCache[sIdx].lastUsed = Date.now();
        await saveSavedSnippets(savedCache);
      }
      renderList();
      return;
    }

    // 隠す
    if (e.target.classList.contains('tsp-hide')) {
      const hidden = e.target.checked;
      if (hidden && sIdx >= 0) {
        const item = savedCache.splice(sIdx, 1)[0];
        item.volatile = true;
        item.checked = false;
        volatileSnippets.unshift(item);
        await saveSavedSnippets(savedCache);
      } else if (!hidden && vIdx >= 0) {
        const item = volatileSnippets.splice(vIdx, 1)[0];
        delete item.volatile;
        savedCache.push(item);
        await saveSavedSnippets(savedCache);
      }
      renderList();
      return;
    }
  });

  // 選択解除
  btnClear.addEventListener('click', async () => {
    savedCache.forEach(a => a.checked = false);
    volatileSnippets.forEach(a => a.checked = false);
    await saveSavedSnippets(savedCache);
    renderList();
  });

  // パネル閉じる
  btnClose.addEventListener('click', () => {
    setPanelVisible(false).catch(e => console.error(e));
  });

  // グローバル管理
  btnManage.addEventListener('click', async () => {
    const items = savedCache.map(s => `• ${s.text.slice(0, 60).replace(/\n/g, ' ')} (${s.id})`).join('\n') || '(none)';
    const a = prompt(`${t('gmList')}\n\n${items}\n\n${t('gmOps')}`);
    if (!a) return;
    const v = a.trim();
    if (v === '1') {
      if (!confirm(t('confirmDelAll'))) return;
      await deleteAllSavedSnippets();
      savedCache = [];
      renderList();
      alert(t('delAllDone'));
      return;
    }
    if (v === '2') {
      const raw = JSON.stringify(savedCache, null, 2);
      try {
        await navigator.clipboard.writeText(raw);
        alert(t('copied'));
      } catch (e) {
        prompt('Copy JSON:', raw);
      }
      return;
    }
    if (v === '3') {
      const txt = prompt(t('importPrompt'));
      if (!txt) return;
      try {
        const parsed = JSON.parse(txt);
        if (!Array.isArray(parsed)) throw new Error('Array required');
        savedCache = parsed;
        await saveSavedSnippets(savedCache);
        renderList();
      } catch (err) {
        alert(t('importFail') + (err && err.message ? err.message : String(err)));
      }
      return;
    }
    alert(t('invalidOp'));
  });

  /* ---------- key events & typing ---------- */
  function inferKeyProps(ch) {
    if (ch === undefined || ch === null) return { key: 'Unidentified', code: 'Unidentified', keyCode: 0, charCode: 0 };
    if (ch === ' ') return { key: ' ', code: 'Space', keyCode: 32, charCode: 32 };
    if (ch === '\n' || ch === '\r') return { key: 'Enter', code: 'Enter', keyCode: 13, charCode: 13 };
    const c = ch.charCodeAt(0);
    if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122)) {
      const upper = String.fromCharCode(c).toUpperCase();
      return { key: ch, code: 'Key' + upper, keyCode: upper.charCodeAt(0), charCode: upper.charCodeAt(0) };
    }
    if (c >= 48 && c <= 57) {
      const digit = String.fromCharCode(c);
      return { key: digit, code: 'Digit' + digit, keyCode: c, charCode: c };
    }
    return { key: ch, code: 'Unidentified', keyCode: c, charCode: c };
  }

  function dispatchKeyEvent(target, type, ch) {
    const props = inferKeyProps(ch);
    try {
      const ev = new KeyboardEvent(type, {
        key: props.key,
        code: props.code,
        location: 0,
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
        repeat: false,
        isComposing: false,
        bubbles: true,
        cancelable: true
      });
      try { Object.defineProperty(ev, 'keyCode', { get: () => props.keyCode }); } catch (e) {}
      try { Object.defineProperty(ev, 'which', { get: () => props.keyCode }); } catch (e) {}
      try { Object.defineProperty(ev, 'charCode', { get: () => props.charCode }); } catch (e) {}
      target.dispatchEvent(ev);
    } catch (e) {
      const ev = document.createEvent('Event');
      ev.initEvent(type, true, true);
      target.dispatchEvent(ev);
    }
  }

  let typingCancelToken = null;

  async function typeLikeHumanInto(el, text) {
    if (!text) return;
    if (typingCancelToken) typingCancelToken.cancel = true;
    const myToken = { cancel: false };
    typingCancelToken = myToken;

    const baseDelay = Number(delayInput.value) || DEFAULT_DELAY_MS;
    const randomize = randomChk.checked;
    const simulateKeys = simKeysChk.checked;

    el.focus();
    const isCE = el.isContentEditable;

    for (let i = 0; i < text.length; i++) {
      if (myToken.cancel) break;
      const ch = text[i];
      try {
        if (simulateKeys) {
          dispatchKeyEvent(el, 'keydown', ch);
          dispatchKeyEvent(el, 'keypress', ch);
        }

        if (isCE) {
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            const node = document.createTextNode(ch);
            range.insertNode(node);
            range.setStartAfter(node);
            range.setEndAfter(node);
            sel.removeAllRanges();
            sel.addRange(range);
          } else {
            el.innerText = (el.innerText || '') + ch;
          }
        } else {
          const start = ('selectionStart' in el) ? el.selectionStart : el.value.length;
          const end = ('selectionEnd' in el) ? el.selectionEnd : start;
          const before = el.value.slice(0, start);
          const after = el.value.slice(end);
          el.value = before + ch + after;
          const pos = (before + ch).length;
          if (typeof el.setSelectionRange === 'function') el.setSelectionRange(pos, pos);
        }

        try {
          const inputEv = new InputEvent('input', { data: ch, bubbles: true, cancelable: true });
          el.dispatchEvent(inputEv);
        } catch (e) {
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }

        if (simulateKeys) {
          dispatchKeyEvent(el, 'keyup', ch);
        }

      } catch (err) {
        console.error('TinyTyper error:', err);
      }

      const delay = randomize
        ? Math.max(0, Math.round(baseDelay * (0.7 + Math.random() * 0.6)))
        : baseDelay;
      await new Promise(r => setTimeout(r, delay));
    }

    try {
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (e) {}

    if (typingCancelToken === myToken) typingCancelToken = null;
  }

  // クリックで自動入力
  let lastClickTarget = null;

  document.addEventListener('click', (e) => {
    if (!autoTypeEnabled) return;
    const el = e.target;
    if (!isTypeable(el)) return;

    const all = getAllSnippets();
    const selected = all.find(a => a.checked);
    if (!selected) return;

    if (lastClickTarget === el) return;
    lastClickTarget = el;
    setTimeout(() => {
      typeLikeHumanInto(el, selected.text).finally(() => {
        lastClickTarget = null;
      });
    }, 50);
  }, true);

  // 初期描画
  renderList();

  // Ctrl+Alt+T でパネル表示切替
  window.addEventListener('keydown', (e) => {
    try {
      if (e.ctrlKey && e.altKey && e.key && e.key.toLowerCase() === 't') {
        togglePanelDisplay().catch(err => console.error(err));
      }
    } catch (err) {
      console.error(err);
    }
  }, true);

})();
