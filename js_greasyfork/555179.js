// ==UserScript==
// @name         Alipan to Aliyundrive Redirect
// @namespace    Violentmonkey Scripts
// @version      1.0
// @license      MIT
// @description  自动将 alipan.com 的分享链接转换为 aliyundrive.com 域名
// @match        *://*.alipan.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555179/Alipan%20to%20Aliyundrive%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/555179/Alipan%20to%20Aliyundrive%20Redirect.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 当前页面的 URL
  const currentUrl = window.location.href;

  // 检查是否为 alipan.com 域名
  if (currentUrl.includes('alipan.com')) {
    // 替换为 aliyundrive.com 域名
    const newUrl = currentUrl.replace('alipan.com', 'aliyundrive.com');

    // 执行重定向
    window.location.replace(newUrl);
  }
})();