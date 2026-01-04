// ==UserScript==
// @name         chatgpt.com 写入 sessionStorage
// @namespace    https://greasyfork.org/users/your-name
// @version      1.0.0
// @description  在 chatgpt.com 的会话存储中新增键 poijcwa，值为 jwoid
// @match        https://chatgpt.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550503/chatgptcom%20%E5%86%99%E5%85%A5%20sessionStorage.user.js
// @updateURL https://update.greasyfork.org/scripts/550503/chatgptcom%20%E5%86%99%E5%85%A5%20sessionStorage.meta.js
// ==/UserScript==

(function () {
  'use strict';

  try {
    // 页面最早期就写入
    sessionStorage.setItem('poijcwa', 'jwoid');

    // 若页面切换或恢复后被清空，确保再次写入
    window.addEventListener('pageshow', () => {
      if (sessionStorage.getItem('poijcwa') !== 'jwoid') {
        sessionStorage.setItem('poijcwa', 'jwoid');
      }
    });
  } catch (e) {
    console.error('[poijcwa userscript] 写入 sessionStorage 失败：', e);
  }
})();
