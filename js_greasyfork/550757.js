// ==UserScript==
// @name         B站投币回车确认
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  按下 Enter 键自动点击页面中的 bi-btn 按钮
// @author       z
// @match        https://www.bilibili.com/video/*
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550757/B%E7%AB%99%E6%8A%95%E5%B8%81%E5%9B%9E%E8%BD%A6%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/550757/B%E7%AB%99%E6%8A%95%E5%B8%81%E5%9B%9E%E8%BD%A6%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let btn = null;

  // 使用 MutationObserver 监听弹窗 DOM 的变化
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        const found = document.querySelector('.bi-btn');
        if (found) {
          btn = found;
          console.log('[油猴] 找到 bi-btn 按钮');
          observer.disconnect(); // 找到后停止监听
        }
      }
    }
  });

  // 开始监听整个 body 的 DOM 变化
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // 监听键盘事件
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && btn) {
      btn.click();
      console.log('[油猴] 已触发 bi-btn 点击');
    }
  });
})();