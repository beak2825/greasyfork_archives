// ==UserScript==
// @name         SOOP: 채팅 락 (응원봉 용도)
// @namespace    melderland-chat-lock
// @version      2025-09-30.8
// @description  입력창 문구 잠금 + 전송 후 자동 복원 + 아프리카 복붙 활성화 + 0.7s 쿨다운(잠금 사용 시).
// @match        https://play.sooplive.co.kr/*
// @match        https://www.sooplive.co.kr/*
// @grant        none
// @license      All rights reserved
// @downloadURL https://update.greasyfork.org/scripts/551083/SOOP%3A%20%EC%B1%84%ED%8C%85%20%EB%9D%BD%20%28%EC%9D%91%EC%9B%90%EB%B4%89%20%EC%9A%A9%EB%8F%84%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551083/SOOP%3A%20%EC%B1%84%ED%8C%85%20%EB%9D%BD%20%28%EC%9D%91%EC%9B%90%EB%B4%89%20%EC%9A%A9%EB%8F%84%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- config ----------
  const OFFSET_Y = -12;           // UI Y 위치 (px, 위로 올리려면 음수)
  const CHEER_COOLDOWN_MS = 1100;  // 쿨다운(ms) — 응원봉모드(=잠금 사용 시) 전송 간 최소 간격

  // ---------- state ----------
  const ROOM_KEY = location.hostname + location.pathname;
  const LS_TEXT = 'chat_lock_text::' + ROOM_KEY;
  const LS_ENABLED = 'chat_lock_enabled::' + ROOM_KEY;

  let writeArea, lockedText = '', lockEnabled = false, ui = null;
  let mo = null;              // MutationObserver
  let lastSendTs = 0;         // 마지막 전송 시각(쿨다운용)

  // ---------- utils ----------
  const q = (s, r = document) => r.querySelector(s);
  const el = (t, a = {}, ...kids) => { const e = document.createElement(t); Object.entries(a).forEach(([k, v]) => { if (k === 'style' && v && typeof v === 'object') Object.assign(e.style, v); else if (k === 'class') e.className = v; else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v, {passive:true}); else e.setAttribute(k, v); }); kids.flat().forEach(c => e.append(c)); return e; };
  const save = () => { localStorage.setItem(LS_TEXT, lockedText || ''); localStorage.setItem(LS_ENABLED, lockEnabled ? '1' : '0'); };
  const load = () => { lockedText = localStorage.getItem(LS_TEXT) || ''; lockEnabled = localStorage.getItem(LS_ENABLED) === '1'; };

  function findWriteArea() {
    return document.getElementById('write_area') || q('.write_area[contenteditable="true"]') || q('[contenteditable="true"][id*="write"]');
  }

  function triggerInput(el) {
    try { el.dispatchEvent(new InputEvent('input', { bubbles: true })); } catch { el.dispatchEvent(new Event('input', { bubbles: true })); }
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function setText(txt) {
    if (!writeArea) return;
    writeArea.innerText = txt || '';
    triggerInput(writeArea);
    placeCaretAtEnd(writeArea);
  }

  function getText() {
    if (!writeArea) return '';
    return (writeArea.innerText || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function placeCaretAtEnd(target) {
    if (!target) return;
    const range = document.createRange();
    range.selectNodeContents(target);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    target.focus();
  }

  // ---------- theming ----------
  const isDark = () => (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) || document.documentElement.classList.contains('dark');
  function applyTheme(box) {
    const dark = isDark();
    box.style.setProperty('--cl-bg', dark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.78)');
    box.style.setProperty('--cl-border', dark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.25)');
    box.style.setProperty('--cl-fg', dark ? '#f2f4f8' : '#111');
  }

  // ---------- UI (pinned right-top) ----------
  function findToolbarHost() {
    const toolArea = writeArea && (writeArea.parentElement?.querySelector(':scope > .tool-area') || writeArea.closest('.tool-area'));
    return toolArea || (writeArea && writeArea.parentElement) || document.body;
  }

  function ensureRelative(host) {
    const cs = getComputedStyle(host);
    if (cs.position === 'static') host.style.position = 'relative';
  }

  function buildUI() {
    if (!writeArea || document.getElementById('__chat_lock_ui_pin')) return;
    const host = findToolbarHost();
    ensureRelative(host);

    const box = el('div', {
      id: '__chat_lock_ui_pin',
      style: {
        position: 'absolute', right: '8px', top: OFFSET_Y + 'px',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        height: '22px', padding: '0 8px',
        fontSize: '12px', lineHeight: '1', whiteSpace: 'nowrap',
        background: 'var(--cl-bg)', color: 'var(--cl-fg)',
        border: '1px solid var(--cl-border)', borderRadius: '8px',
        zIndex: 9999, backdropFilter: 'blur(2px)'
      }
    });
    applyTheme(box);

    const chk = el('input', { type: 'checkbox', style: { width: '14px', height: '14px', cursor: 'pointer' }, onchange: e => {
      if (e.target.checked) { const cur = getText(); if (cur) lockedText = cur; lockEnabled = true; }
      else { lockEnabled = false; }
      save(); applyLockedState();
    }});
    const lbl = el('span', { style: { userSelect: 'none', cursor: 'pointer', fontWeight: 600 }, onclick: () => chk.click(), title: '체크 시 현재 입력을 고정, 체크 해제 시 비활성화' }, '🔒 고정');

    box.append(chk, lbl);
    host.appendChild(box);
    ui = { box, chk };

    try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme(box)); } catch {}
  }

  // ---------- clipboard enable (Afreeca copy/paste) ----------
  function enableClipboard(el) {
    if (!el || el.dataset.clipboardEnabled === '1') return;
    const handler = (e) => { e.stopImmediatePropagation(); /* allow default clipboard */ };
    ['cut','copy','paste'].forEach(type => el.addEventListener(type, handler, { capture: true }));
    el.dataset.clipboardEnabled = '1';
    try { console.log('아프리카 복붙 활성화'); } catch {}
  }

  // ---------- behaviors ----------
  function applyLockedState() {
    if (!writeArea) return;
    if (lockEnabled && lockedText) {
      if (getText() !== lockedText) setText(lockedText);
      writeArea.classList.add('__locked');
      writeArea.title = '고정됨: ' + lockedText;
    } else {
      writeArea.classList.remove('__locked');
      writeArea.title = '';
    }
    if (ui) ui.chk.checked = !!lockEnabled;
  }

  function flashCooldown() {
    if (!writeArea) return;
    writeArea.classList.add('__cd');
    setTimeout(() => writeArea && writeArea.classList.remove('__cd'), 140);
  }

  function installObservers() {
    // 엔터 전송(응원봉모드=잠금 사용) 쿨다운
    writeArea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        if (lockEnabled) {
          const now = Date.now();
          if (now - lastSendTs < CHEER_COOLDOWN_MS) {
            // 쿨타임 미충족 → 전송 차단
            e.preventDefault();
            e.stopPropagation();
            flashCooldown();
            return;
          }
          lastSendTs = now;
        }
        // 정상 전송 후 잠금 문구 복원
        setTimeout(() => { if (lockEnabled && lockedText) setText(lockedText); }, 60);
      }
    }, {passive:false});

    // 내용 변경 감시 -> 복원(잠금 시)
    mo = new MutationObserver(() => { if (!lockEnabled || !lockedText) return; if (getText() !== lockedText) setTimeout(() => setText(lockedText), 30); });
    mo.observe(writeArea, { childList: true, characterData: true, subtree: true });

    // 포커스 시 커서 끝으로 + 클립보드 허용
    writeArea.addEventListener('focus', () => { if (lockEnabled && lockedText) placeCaretAtEnd(writeArea); enableClipboard(writeArea); }, {passive:true});

    // 입력칸 교체 대비(1초 체크)
    setInterval(() => {
      if (!writeArea || !document.contains(writeArea)) {
        const wa = findWriteArea();
        if (wa) { writeArea = wa; enableClipboard(writeArea); }
      } else if (writeArea && writeArea.dataset.clipboardEnabled !== '1') {
        enableClipboard(writeArea);
      }
    }, 1000);

    // 처음 한번
    enableClipboard(writeArea);
  }

  // ---------- style ----------
  const style = document.createElement('style');
  style.textContent = `
    .write_area.__locked { outline: 1px dashed rgba(127,127,127,.55) !important; }
    .write_area.__cd { outline: 2px solid rgba(255,80,80,.85) !important; }
    #__chat_lock_ui_pin { -webkit-user-select: none; user-select: none; }
    #__chat_lock_ui_pin input { accent-color: #3aa3ff; }
  `;
  document.documentElement.appendChild(style);

  // ---------- init ----------
  function init() {
    load();
    const timer = setInterval(() => {
      writeArea = findWriteArea();
      if (writeArea) {
        clearInterval(timer);
        buildUI();
        applyLockedState();
        installObservers();
      }
    }, 250);

    let lastPath = location.pathname;
    setInterval(() => { if (location.pathname !== lastPath) { lastPath = location.pathname; load(); applyLockedState(); const wa = findWriteArea(); if (wa) { writeArea = wa; enableClipboard(writeArea); } } }, 1000);
  }

  init();
})();
