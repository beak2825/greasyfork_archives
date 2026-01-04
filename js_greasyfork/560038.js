// ==UserScript==
// @name         咪咕视频网页内全屏
// @namespace    http://tampermonkey.net/
// @version      0.6.0
// @description  在咪咕视频页实现“页面内全屏”，按钮插入播放器控制栏
// @match        https://www.miguvideo.com/p/live/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @author       MYH
// @downloadURL https://update.greasyfork.org/scripts/560038/%E5%92%AA%E5%92%95%E8%A7%86%E9%A2%91%E7%BD%91%E9%A1%B5%E5%86%85%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/560038/%E5%92%AA%E5%92%95%E8%A7%86%E9%A2%91%E7%BD%91%E9%A1%B5%E5%86%85%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const CLS_ON = 'tm-migu-webfull-on';
  const ROOT_ATTR = 'data-tm-migu-webfull-root';
  const BTN_ID = 'tm-migu-webfull-btn';

  GM_addStyle(`
    body.${CLS_ON} { overflow: hidden !important; }

    body.${CLS_ON} [${ROOT_ATTR}="1"] {
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      margin: 0 !important;
      z-index: 2147483646 !important;
      background: #000 !important;
    }

    body.${CLS_ON} [${ROOT_ATTR}="1"] .video-wrapper,
    body.${CLS_ON} [${ROOT_ATTR}="1"] .mg_player_wrapper,
    body.${CLS_ON} [${ROOT_ATTR}="1"] video {
      width: 100% !important;
      height: 100% !important;
    }
    body.${CLS_ON} [${ROOT_ATTR}="1"] video { object-fit: contain !important; }

    /* 按钮通用 */
    #${BTN_ID} {
      color: #fff;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      font-size: 12px;
      line-height: 1;
      white-space: nowrap;
    }

    /* 控制栏内样式（小方块） */
    #${BTN_ID}.tm-webfull-inbar {
      height: 30px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0 6px;
      padding: 0 10px;
      border-radius: 4px;
      background: rgba(255,255,255,.10);
    }
    #${BTN_ID}.tm-webfull-inbar:hover { background: rgba(255,255,255,.18); }

    /* 悬浮回退样式 */
    #${BTN_ID}.tm-webfull-float {
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 2147483647;
      background: rgba(0,0,0,.65);
      border: 1px solid rgba(255,255,255,.25);
      border-radius: 10px;
      padding: 10px 12px;
    }
    #${BTN_ID}.tm-webfull-float:hover { background: rgba(0,0,0,.85); }
  `);

  function isEditableTarget(t) {
    return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
  }

  function findVideo() {
    return document.querySelector('video#m-player') || document.querySelector('video');
  }

  function pickRoot(videoEl) {
    if (!videoEl) return null;

    const modPlayer = document.querySelector('section#mod-player.mod-player');
    if (modPlayer) return modPlayer;

    return (
      videoEl.closest('.video-wrapper') ||
      videoEl.closest('.mg_player_wrapper') ||
      videoEl.parentElement
    );
  }

  function markRoot(root) {
    if (!root) return false;
    document.querySelectorAll(`[${ROOT_ATTR}="1"]`).forEach((n) => {
      if (n !== root) n.removeAttribute(ROOT_ATTR);
    });
    root.setAttribute(ROOT_ATTR, '1');
    return true;
  }

  function ensureRoot() {
    const v = findVideo();
    const root = pickRoot(v);
    if (!root) return null;
    markRoot(root);
    return root;
  }

  function getRightControlHost() {
    return (
      document.querySelector('#mod-player .control-wrapper.fadehide .right-control') ||
      document.querySelector('#mod-player .control-wrapper .right-control')
    );
  }

  function updateButton() {
    const btn = document.getElementById(BTN_ID);
    if (!btn) return;
    const on = document.body.classList.contains(CLS_ON);
    btn.textContent = on ? '退出网页内全屏' : '网页内全屏';
    btn.title = on ? '退出网页内全屏 (Esc)' : '网页内全屏 (W)';
  }

  function ensureButton() {
    let btn = document.getElementById(BTN_ID);
    if (!btn) {
      btn = document.createElement('div');
      btn.id = BTN_ID;
      btn.addEventListener('click', () => toggle(), true);
    }

    const host = getRightControlHost();
    if (host) {
      btn.classList.remove('tm-webfull-float');
      btn.classList.add('tm-webfull-inbar');

      const anchor = host.children[1] || null;
      if (btn.parentElement !== host) host.insertBefore(btn, anchor);
    } else {
      btn.classList.remove('tm-webfull-inbar');
      btn.classList.add('tm-webfull-float');
      if (btn.parentElement !== document.body) document.body.appendChild(btn);
    }

    updateButton();
  }

  function enter() {
    if (!ensureRoot()) return;
    document.body.classList.add(CLS_ON);
    ensureButton();
    updateButton();
  }

  function exit() {
    document.body.classList.remove(CLS_ON);
    ensureButton();
    updateButton();
  }

  function toggle() {
    if (document.body.classList.contains(CLS_ON)) exit();
    else enter();
  }

  // 菜单
  GM_registerMenuCommand('切换网页内全屏', toggle);
  GM_registerMenuCommand('退出网页内全屏', exit);

  // 快捷键：W 切换，Esc 退出
  window.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && document.body.classList.contains(CLS_ON)) {
        exit();
        return;
      }
      if (isEditableTarget(e.target)) return;
      if (e.key && e.key.toLowerCase() === 'w') toggle();
    },
    true
  );

  setInterval(() => {
    const btn = document.getElementById(BTN_ID);
    const host = getRightControlHost();
    if (!host) {
      if (!btn) ensureButton();
      return;
    }
    if (!btn || btn.parentElement !== host) ensureButton();
    if (document.body.classList.contains(CLS_ON)) ensureRoot();
  }, 2000);

  for (const t of [0, 300, 800, 1500, 2500]) {
    setTimeout(() => {
      ensureRoot();
      ensureButton();
    }, t);
  }
})();