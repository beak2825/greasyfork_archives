// ==UserScript==
// @name         极简百度搜索框
// @namespace    https://github.com/springsea72/minimalist-baidu-search-box.git
// @version      1.1
// @description  简化了百度搜索框，去除所有其他东西，只剩下单行搜索框
// @author       springsea
// @match        https://www.baidu.com/*
// @match        https://www.baidu.com/s*
// @grant        GM_addStyle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/556484/%E6%9E%81%E7%AE%80%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/556484/%E6%9E%81%E7%AE%80%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%A1%86.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const isHome = location.hostname === 'www.baidu.com' &&
                 (location.pathname === '/' || location.pathname === '/index.html');

  // 给 html 打标记，CSS 里只对首页做强制布局
  document.documentElement.classList.toggle('tm-bd-home', isHome);

  GM_addStyle(`
    /* ======== 通用：隐藏 AI 图标/工具，只留按钮 ======== */
    #chat-input-main .chat-input-tool #left-tool,
    #chat-input-main .chat-input-tool #right-tool,
    #chat-input-main .right-tool_3we_U,
    #chat-input-main #voice-input-wrapper,
    #chat-input-main .tool-item_1e6GD,
    #chat-input-main .tools-clear-icon {
      display: none !important;
    }

    /* 防止工具层“盖住输入框导致只能点左边” */
    .san-card[tpl="chat-input"] .chat-input-tool {
      pointer-events: auto !important;
    }
    #chat-input-main.one-line-input .tools-placeholder-wrapper{
      display: none !important;
    }

    /* ======== 首页：隐藏搜索框下方那排功能条 ======== */
    .tm-bd-home .panel-list_8jHmm,
    .tm-bd-home #chat-input-extension,
    .tm-bd-home .more-dropdown-container {
      display: none !important;
    }

    /* ======== 首页：强制单行模式（不让它闪回双行） ======== */
    .tm-bd-home #chat-input-main {
      height: auto !important;
    }
    .tm-bd-home #chat-input-main.two-line-input {
      /* 只要在首页发现 two-line，就按 one-line 来画 */
      padding-bottom: 0 !important;
    }
    .tm-bd-home #chat-input-main .chat-input-wrapper .chat-input-container{
      padding-top: 9px !important;
      padding-bottom: 9px !important;
    }

    /* ======== 首页：按钮定位到最右 + 固定在输入框那一行 ======== */
    .tm-bd-home #chat-input-main.one-line-input .chat-input-tool{
      position: absolute !important;
      right: 6px !important;

      /* 固定距离顶部的像素，不再用 50% 居中，避免被联想词高度影响 */
      top: 4px !important;              /* 觉得略高/略低可以自己微调这个数 */

      transform: none !important;
      padding-top: 0 !important;
      width: auto !important;
      display: flex !important;
      align-items: center !important;
      justify-content: flex-end !important;
      background: transparent !important;
    }

    .tm-bd-home #chat-input-main.one-line-input .right-tools-wrapper{
      padding: 0 !important;
      margin: 0 !important;
      background: transparent !important;
      border-radius: 0 !important;
    }

    /* ======== 首页：按钮自身“文字强制完美居中” ======== */
    .tm-bd-home #chat-input-main.one-line-input #chat-submit-button{
      height: 38px !important;
      width: 108px !important;
      padding: 0 !important;
      line-height: 38px !important;  /* 基线居中 */
      display: flex !important;      /* 再保险 */
      align-items: center !important;
      justify-content: center !important;
      font-size: 17px !important;
      font-weight: 500 !important;
      box-sizing: border-box !important;
      border: none !important;
      vertical-align: middle !important;
    }
  `);

  function waitFor(sel, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const st = Date.now();
      const timer = setInterval(() => {
        const el = document.querySelector(sel);
        if (el) { clearInterval(timer); resolve(el); }
        else if (Date.now() - st > timeout) { clearInterval(timer); reject(); }
      }, 100);
    });
  }

  function forceHomeOneLine() {
    if (!isHome) return;

    const main = document.querySelector('#chat-input-main');
    if (!main) return;

    // 首页永远维持 one-line-input
    main.classList.add('one-line-input');
    main.classList.remove('two-line-input');

    // 万一百度动态把按钮挪走/包裹结构变动，确保 button 还在右侧 wrapper 中
    const btn = main.querySelector('#chat-submit-button');
    const rightWrap = main.querySelector('.right-tools-wrapper');
    if (btn && rightWrap && btn.parentElement !== rightWrap) {
      rightWrap.appendChild(btn);
    }
  }

  async function init() {
    try {
      await waitFor('#chat-input-main');
      forceHomeOneLine();

      // 观察 class 变化：只在首页发现它回到 two-line 时拉回 one-line
      if (isHome) {
        const main = document.querySelector('#chat-input-main');
        let lock = false;
        const obs = new MutationObserver(() => {
          if (lock) return;
          lock = true;
          requestAnimationFrame(() => {
            forceHomeOneLine();
            lock = false;
          });
        });
        obs.observe(main, { attributes: true, attributeFilter: ['class'] });
      }
    } catch (e) {}
  }

  init();

    // patch: Baidu may re-render right tools, hide again
const throttle = (fn, wait=120) => {
  let t = null;
  return () => {
    if (t) return;
    t = setTimeout(() => { t = null; fn(); }, wait);
  };
};

function hideRightToolsOnce(){
  const sel = [
    '#chat-input-main .chat-input-tool .right-tools-wrapper #right-tool',
    '#chat-input-main .chat-input-tool .right-tools-wrapper .right-tool_3we_U',
    '#chat-input-main .chat-input-tool .right-tools-wrapper #voice-input-wrapper',
    '#chat-input-main .chat-input-tool .right-tools-wrapper .tools-clear-icon',
  ];
  for (const s of sel){
    const el = document.querySelector(s);
    if (el && el.style.display !== 'none'){
      el.style.display = 'none';
      el.style.visibility = 'hidden';
      el.style.pointerEvents = 'none';
    }
  }
}

const hideThrottled = throttle(hideRightToolsOnce, 120);
hideRightToolsOnce();

const mo = new MutationObserver(hideThrottled);
mo.observe(document.body, { childList: true, subtree: true });

})();
