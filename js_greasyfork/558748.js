// ==UserScript==
// @name         ASOBI Ticket 日期强制替换
// @namespace    local
// @version      1.0
// @description Replace
// @match        https://asobiticket2.asobistore.jp/*

// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558748/ASOBI%20Ticket%20%E6%97%A5%E6%9C%9F%E5%BC%BA%E5%88%B6%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/558748/ASOBI%20Ticket%20%E6%97%A5%E6%9C%9F%E5%BC%BA%E5%88%B6%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(() => {
  const FROM = '2000年8月1日';
  const TO   = '2002年7月10日';

  function replaceInTextNodes(root) {
    if (!root) return;

    // 普通 DOM 文本节点
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let n;
    while ((n = walker.nextNode())) {
      if (n.nodeValue && n.nodeValue.includes(FROM)) {
        n.nodeValue = n.nodeValue.split(FROM).join(TO);
      }
    }

    // Shadow DOM（如果有）
    const els = root.querySelectorAll ? root.querySelectorAll('*') : [];
    for (const el of els) {
      if (el.shadowRoot) replaceInTextNodes(el.shadowRoot);
    }
  }

  function scanAll() {
    replaceInTextNodes(document.documentElement);

    // 输入框/文本域（以防日期在 value 里）
    document.querySelectorAll?.('input, textarea').forEach(el => {
      if (typeof el.value === 'string' && el.value.includes(FROM)) {
        el.value = el.value.split(FROM).join(TO);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  // 1) 初次扫描
  scanAll();

  // 2) DOM 变化就再扫描（应对框架重绘）
  const mo = new MutationObserver(() => scanAll());
  mo.observe(document.documentElement, { childList: true, subtree: true, characterData: true });

  // 3) SPA 路由跳转也触发扫描（Angular/React 常见）
  const hookHistory = (type) => {
    const orig = history[type];
    history[type] = function () {
      const ret = orig.apply(this, arguments);
      setTimeout(scanAll, 0);
      setTimeout(scanAll, 50);
      setTimeout(scanAll, 200);
      return ret;
    };
  };
  hookHistory('pushState');
  hookHistory('replaceState');
  window.addEventListener('popstate', () => {
    setTimeout(scanAll, 0);
    setTimeout(scanAll, 50);
    setTimeout(scanAll, 200);
  });

  // 4) 前几秒定时扫（对付疯狂刷新 UI）
  let times = 0;
  const timer = setInterval(() => {
    scanAll();
    if (++times >= 40) clearInterval(timer); // 约 10 秒
  }, 250);

  window.addEventListener('load', () => scanAll());
})();