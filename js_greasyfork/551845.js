// ==UserScript==
// @name         bilibili自动开启中文字幕
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  自动打开字幕并选中“中文”，可修改为ENGLISH
// @match        https://www.bilibili.com/video/*
// @author       zzx114
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551845/bilibili%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/551845/bilibili%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%E4%B8%AD%E6%96%87%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* 想匹配的字幕文案，以后改了直接改这里 */
  const SUBTITLE_TEXT = '中文';

  /* 通用“等节点→回调”工具 */
  const waitNode = (selector, cb, maxWait = 10_000) => {
    const st = Date.now();
    const id = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) { clearInterval(id); cb(el); }
      else if (Date.now() - st > maxWait) clearInterval(id);   // 超时放弃
    }, 300);
  };

  /* 第一步：打开字幕总开关 */
  const openSubtitlePanel = () => waitNode('.bpx-player-ctrl-btn.bpx-player-ctrl-subtitle', btn => {
    // 如果按钮上已经有“开启”类名，说明面板已开，直接走第二步
    const isOpen = btn.classList.contains('bpx-state-active');
    if (!isOpen) btn.click();
    selectChinese();
  });

  /* 第二步：选“中文” */
  const selectChinese = () => waitNode('.bpx-player-ctrl-subtitle-language-item-text', listItem => {
    // 面板里可能同时渲染多个语言，精准匹配文案
    const chinese = [...document.querySelectorAll('.bpx-player-ctrl-subtitle-language-item-text')]
                    .find(el => el.textContent.trim() === SUBTITLE_TEXT);
    if (chinese) chinese.click();
  });

  /* 主入口：等 video 标签出现后再开始 */
  waitNode('video', video => {
    if (video.readyState >= 2) {          // 已经加载过
      openSubtitlePanel();
    } else {
      video.addEventListener('loadeddata', openSubtitlePanel, { once: true });
    }
  });
})();