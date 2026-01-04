// ==UserScript==
// @name         QuickTicket 姓名替换：曹仕文 → GUO HAO（含假名，持续保持+加速）
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  在 cloak-quickticket.moala.fun 把姓名显示为“GUO HAO（グオハオ）”；汉字/假名分开保留原字体；支持页面变动时持续保持；手机端加速显示
// @match        https://cloak-quickticket.moala.fun/*
// @run-at       document-idle
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550127/QuickTicket%20%E5%A7%93%E5%90%8D%E6%9B%BF%E6%8D%A2%EF%BC%9A%E6%9B%B9%E4%BB%95%E6%96%87%20%E2%86%92%20GUO%20HAO%EF%BC%88%E5%90%AB%E5%81%87%E5%90%8D%EF%BC%8C%E6%8C%81%E7%BB%AD%E4%BF%9D%E6%8C%81%2B%E5%8A%A0%E9%80%9F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550127/QuickTicket%20%E5%A7%93%E5%90%8D%E6%9B%BF%E6%8D%A2%EF%BC%9A%E6%9B%B9%E4%BB%95%E6%96%87%20%E2%86%92%20GUO%20HAO%EF%BC%88%E5%90%AB%E5%81%87%E5%90%8D%EF%BC%8C%E6%8C%81%E7%BB%AD%E4%BF%9D%E6%8C%81%2B%E5%8A%A0%E9%80%9F%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CSS = `
  .ticket-owner-name-container .name-kana.__orig-hidden {
    display: none !important;
  }

  .ticket-owner-name-container .name-kanji[data-replaced="1"]{
    display: inline !important;
    font-size: 0 !important;
    line-height: inherit !important;
    letter-spacing: inherit !important;
    position: static !important;
    white-space: nowrap !important;
  }

  .ticket-owner-name-container .name-kanji[data-replaced="1"]::before{
    content: attr(data-han-display);
    font-family: var(--kanji-font-family, inherit);
    font-size:   var(--kanji-font-size,   initial);
    font-weight: var(--kanji-font-weight, inherit);
    letter-spacing: var(--kanji-letter-spacing, inherit);
    line-height: var(--kanji-line-height, inherit);
    white-space: nowrap;
  }

  .ticket-owner-name-container .name-kanji[data-replaced="1"]::after{
    content: attr(data-kana-display);
    margin-left: var(--kana-gap, 0.25em);
    font-family: var(--kana-font-family, inherit);
    font-size:   var(--kana-font-size,   initial);
    font-weight: var(--kana-font-weight, inherit);
    letter-spacing: var(--kana-letter-spacing, inherit);
    line-height: var(--kana-line-height, inherit);
    white-space: nowrap;
  }
  `;
  const style = document.createElement('style');
  style.textContent = CSS;
  (document.head || document.documentElement).appendChild(style);

  const RAW_FROM = '曹仕文';
  const DISPLAY_HAN  = 'GUO HAO';
  const DISPLAY_KANA = '（グオハオ）';

  const ZERO_WS_RE = /[\s\u200B-\u200D\uFEFF]/g;
  const norm = s => (s || '').replace(ZERO_WS_RE, '');

  const SEL_KANJI = '.ticket-owner-name-container .name-kanji';
  const SEL_KANA  = '.ticket-owner-name-container .name-kana';

  function applyReplace() {
    const elKanji = document.querySelector(SEL_KANJI);
    const elKana  = document.querySelector(SEL_KANA);

    if (elKanji && norm(elKanji.textContent || '') === RAW_FROM) {
      if (elKanji.dataset.replaced === '1') return; // 已替换过

      // 读取 .name-kanji 样式
      const ks = getComputedStyle(elKanji);
      elKanji.style.setProperty('--kanji-font-family',   ks.fontFamily);
      elKanji.style.setProperty('--kanji-font-size',     ks.fontSize);
      elKanji.style.setProperty('--kanji-font-weight',   ks.fontWeight);
      elKanji.style.setProperty('--kanji-letter-spacing',ks.letterSpacing);
      elKanji.style.setProperty('--kanji-line-height',   ks.lineHeight);

      // 读取 .name-kana 样式
      if (elKana) {
        const cs = getComputedStyle(elKana);
        elKanji.style.setProperty('--kana-font-family',    cs.fontFamily);
        elKanji.style.setProperty('--kana-font-size',      cs.fontSize);
        elKanji.style.setProperty('--kana-font-weight',    cs.fontWeight);
        elKanji.style.setProperty('--kana-letter-spacing', cs.letterSpacing);
        elKanji.style.setProperty('--kana-line-height',    cs.lineHeight);
        elKanji.style.setProperty('--kana-gap',            cs.marginLeft || '0.25em');
        elKana.classList.add('__orig-hidden');
      }

      elKanji.setAttribute('data-han-display',  DISPLAY_HAN);
      elKanji.setAttribute('data-kana-display', DISPLAY_KANA);
      elKanji.setAttribute('data-replaced', '1');
    }
  }

  // —— 首次执行 —— //
  applyReplace();

  // —— 观察器：保持更新 —— //
  function observeContainer() {
    const container = document.querySelector('.ticket-owner-name-container');
    if (!container) return;
    const obs = new MutationObserver(() => {
      applyReplace();
    });
    obs.observe(container, { childList: true, subtree: true });
  }
  observeContainer();

  // —— 启动期快速轮询（2 秒内每 150ms 执行一次） —— //
  const FAST_INTERVAL = 10;
  const FAST_WINDOW_MS = 2000;
  const fastTimer = setInterval(applyReplace, FAST_INTERVAL);
  setTimeout(() => clearInterval(fastTimer), FAST_WINDOW_MS);

  // —— 常驻低频兜底（每 2 秒一次） —— //
  setInterval(applyReplace, 2000);

  // —— 当页面从后台回到前台时，立即再替换一次 —— //
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) applyReplace();
  }, false);

})();
