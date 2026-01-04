// ==UserScript==
// @name         SeedHub 网盘链接显示
// @namespace    https://greasyfork.org/zh-CN/users/1069880-l-l
// @version      1.1
// @description  显示 SeedHub 的网站原始链接
// @author       Li
// @icon         https://www.seedhub.cc/favicon.ico
// @match        https://*.seedhub.cc/link_start/*
// @match        https://*.seedhub.top/link_start/*
// @match        https://*.seedhub.icu/link_start/*
// @match        https://*.seedhub.pro/link_start/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553827/SeedHub%20%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/553827/SeedHub%20%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 提取 panLink
  const html = document.documentElement.innerHTML;
  const match = html.match(/var\s+panLink\s*=\s*["']([^"']+)["']/);
  if (!match) return;
  const panURL = match[1];

  //等待
  function waitForElement(selector, callback) {
    const el = document.querySelector(selector);
    if (el) return callback(el);
    const obs = new MutationObserver(() => {
      const e = document.querySelector(selector);
      if (e) {
        obs.disconnect();
        callback(e);
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  waitForElement('.mobile-pan', (btn) => {
    // 容器
    const container = document.createElement('div');
    container.style.marginTop = '8px';

    // 复制
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '复制';
    copyBtn.className = 'mobile-pan';
    copyBtn.style.display = 'inline-block';
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(panURL);
        copyBtn.textContent = '✅ 已复制';
        setTimeout(() => (copyBtn.textContent = '复制'), 1500);
      } catch {
        alert('复制失败，请手动复制：' + panURL);
      }
    });

    // 网盘链接
    const link = document.createElement('a');
    link.href = panURL;
    link.textContent = panURL;
    link.target = '_blank';
    link.style.fontSize = '16px';
    link.style.textDecoration = 'underline';
    link.rel = 'noreferrer noopener';

    // 组装
    container.appendChild(copyBtn);
    container.appendChild(link);

    btn.insertAdjacentElement('afterend', container);
  });
})();
