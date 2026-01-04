// ==UserScript==
// @name         X自动跳转到sotwe（按用户名）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  访问 x.com 的用户页或推文页时，截取用户名并跳转到 https://www.sotwe.com/<username>
// @author       代码简单说
// @match        https://x.com/*
// @match        https://www.x.com/*
// @run-at       document-start
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/551524/X%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0sotwe%EF%BC%88%E6%8C%89%E7%94%A8%E6%88%B7%E5%90%8D%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/551524/X%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0sotwe%EF%BC%88%E6%8C%89%E7%94%A8%E6%88%B7%E5%90%8D%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 防止在目标站点或非 x 域时误触
  try {
    const host = location.hostname.toLowerCase();
    if (!host.includes('x.com')) return;
    if (host.includes('sotwe.com')) return;

    // pathname 可能是 "/" 或 "/username" 或 "/username/status/123..." 等
    const path = location.pathname || '/';
    const parts = path.split('/').filter(Boolean); // 去掉空字符串
    if (parts.length === 0) return; // 根路径，不处理

    const username = parts[0];

    // 简单过滤：避免把内置路径（比如 i, home, explore, search 等）当作用户名跳转
    const reserved = new Set(['home', 'i', 'explore', 'search', 'notifications', 'messages', 'compose']);
    if (!username || reserved.has(username.toLowerCase())) return;

    // 如果 username 看起来像用户名（可根据需要加强验证）
    // 允许字母数字和下划线以及点，长度 1-30（Twitter/X 常见规则）
    const valid = /^[A-Za-z0-9._]{1,30}$/.test(username);
    if (!valid) return;

    const target = 'https://www.sotwe.com/' + encodeURIComponent(username);

    // 使用 replace 避免在历史记录留下原页（更像直接跳转）
    window.location.replace(target);
  } catch (e) {
    // 出错则静默不干扰页面
    console.error('X->sotwe redirect script error:', e);
  }
})();
