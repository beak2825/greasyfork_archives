// ==UserScript==
// @name         GPT5版 asobi 姓名修改器
// @namespace    https://asobiticket2.asobistore.jp/
// @version      1.0.0
// @description  Replace companion-name text to your name on entries pages
// @match        https://asobiticket2.asobistore.jp/mypage/entries/*
// @run-at       document-start
// @noframes
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552614/GPT5%E7%89%88%20asobi%20%E5%A7%93%E5%90%8D%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552614/GPT5%E7%89%88%20asobi%20%E5%A7%93%E5%90%8D%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SELECTOR = '.companion-name';
  const TARGET_TEXT = 'ZHOU QIAOFEI';

  function rewriteOnce(root = document) {
    let changed = 0;
    // Ensure we can query within this root
    const list = (root.querySelectorAll ? root.querySelectorAll(SELECTOR) : []);
    list.forEach(el => {
      if (el && el.textContent !== TARGET_TEXT) {
        el.textContent = TARGET_TEXT;
        changed++;
      }
    });
    return changed;
  }

  // Run immediately (document-start; may not find anything yet)
  rewriteOnce();

  // Batch updates triggered by DOM mutations
  let scheduled = false;
  function scheduleRewrite() {
    if (scheduled) return;
    scheduled = true;
    (window.requestAnimationFrame || window.setTimeout)(() => {
      scheduled = false;
      rewriteOnce();
    });
  }

  // Observe early to catch SPA/late render; auto-stop after a short window
  const observer = new MutationObserver(() => {
    scheduleRewrite();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // Also run once when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => rewriteOnce(), { once: true });
  } else {
    rewriteOnce();
  }

  // Safety: disconnect after 10s (可按需调整或去掉)
  setTimeout(() => observer.disconnect(), 10000);
})();
