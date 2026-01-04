// ==UserScript==
// @name         Roblox Create 敲打模块
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       m.
// @description  仅修改拇指的两个变量和进度条已填充部分颜色；其他一概不动
// @match        https://create.roblox.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552906/Roblox%20Create%20%E6%95%B2%E6%89%93%E6%A8%A1%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/552906/Roblox%20Create%20%E6%95%B2%E6%89%93%E6%A8%A1%E5%9D%97.meta.js
// ==/UserScript==

(function () {
  // 用 6 位 HEX；光晕 = 主色 + '26'（约 15% 透明）
  const COLOR = '#ff2b2b';
  const HALO  = COLOR + '26';

  // 方式一：CSS（优先；尽量少改动）
  GM_addStyle(`
    /* 只改拇指的两个变量 */
    .MuiSlider-thumb,
    .web-blox-css-tss-1e7sest-Slider-thumb-thumb,
    [data-testid="benchmark-slider-thumb"] {
      --thumb-gradient-color: ${COLOR} !important;
      --thumb-gradient-border-color: ${HALO} !important;
    }

    /* 只改已填充轨道颜色（不动未填充的 rail、不动描边/阴影） */
    .MuiSlider-track,
    .MuiLinearProgress-bar {
      background: ${COLOR} !important;
      background-color: ${COLOR} !important;
    }
  `);

  // 方式二：兜底（如果页面脚本频繁覆盖 inline 变量/样式）
  const SEL_THUMB = '.MuiSlider-thumb, .web-blox-css-tss-1e7sest-Slider-thumb-thumb, [data-testid="benchmark-slider-thumb"]';
  const SEL_TRACK = '.MuiSlider-track, .MuiLinearProgress-bar';

  const apply = () => {
    document.querySelectorAll(SEL_THUMB).forEach(el => {
      el.style.setProperty('--thumb-gradient-color', COLOR, 'important');
      el.style.setProperty('--thumb-gradient-border-color', HALO, 'important');
    });
    document.querySelectorAll(SEL_TRACK).forEach(el => {
      el.style.setProperty('background', COLOR, 'important');
      el.style.setProperty('background-color', COLOR, 'important');
    });
  };

  if (document.readyState !== 'loading') apply();
  else document.addEventListener('DOMContentLoaded', apply);

  new MutationObserver(apply).observe(document.documentElement, {
    subtree: true, childList: true, attributes: true
  });
})();
