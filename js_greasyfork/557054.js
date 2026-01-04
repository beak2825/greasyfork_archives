// ==UserScript==
// @name         学习通允许粘贴 去除粘贴限制
// @version      1.0.0
// @description  只对文本编辑区开放粘贴；不拦截上传组件的拖拽/放置。
// @author       Dogxi
// @license      MIT
// @homepage     https://dogxi.me
// @match        https://mooc1-api.chaoxing.com/*
// @match        https://mooc1.chaoxing.com/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1436051
// @downloadURL https://update.greasyfork.org/scripts/557054/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%85%81%E8%AE%B8%E7%B2%98%E8%B4%B4%20%E5%8E%BB%E9%99%A4%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/557054/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%85%81%E8%AE%B8%E7%B2%98%E8%B4%B4%20%E5%8E%BB%E9%99%A4%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(() => {
  // 编辑区白名单选择器
  const EDITABLE_SELECTORS = [
    'body.view',
    '[contenteditable="true"]',
    '.editor',
    '.richedit',
    '.rich-text',
    '.nr1',
    '.content',
    '.textArea'
  ];

  // 上传区域黑名单选择器
  const UPLOAD_SELECTORS = [
    '#popLocal_Upload',
    '.popLocal_Upload',
    '.webuploader-container',
    '.webuploader-pick'
  ];

  function isInside(el, selectors) {
    return selectors.some(sel => {
      try {
        const node = document.querySelector(sel);
        return node && (el === node || node.contains(el));
      } catch { return false; }
    });
  }

  function unlockEditable(el) {
    if (!el) return;
    // 移除内联阻断属性（仅编辑区）
    ['ondragstart', 'ondragenter', 'ondragover', 'ondrop', 'onpaste'].forEach(a => {
      if (el.hasAttribute && el.hasAttribute(a)) el.removeAttribute(a);
    });
    try { el.contentEditable = 'true'; } catch {}
    try { el.spellcheck = true; } catch {}

    // 在捕获阶段允许粘贴/拖拽文本，但如果事件发生在上传区域内则不拦截
    const bypass = e => {
      const target = e.target instanceof Node ? e.target : null;
      if (target && isInside(target, UPLOAD_SELECTORS)) {
        // 上传区域：不做任何处理，让站点的上传逻辑正常运作
        return;
      }
      // 仅在编辑区阻断站点的阻止器（不阻止默认行为）
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
    };

    // 允许粘贴；保留文本拖拽到编辑区（不影响上传区域）
    ['paste', 'dragstart', 'dragenter', 'dragover', 'drop'].forEach(t => {
      el.addEventListener(t, bypass, { capture: true });
    });
  }

  function run() {
    // 解锁所有编辑区（白名单）
    EDITABLE_SELECTORS.forEach(sel => {
      document.querySelectorAll(sel).forEach(unlockEditable);
    });

    // iframe 富文本（若存在）
    document.querySelectorAll('iframe').forEach(iframe => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        const targets = [];
        EDITABLE_SELECTORS.forEach(sel => {
          doc.querySelectorAll(sel).forEach(el => targets.push(el));
        });
        targets.forEach(unlockEditable);
      } catch {}
    });
  }

  document.addEventListener('DOMContentLoaded', run);
  if (document.readyState !== 'loading') run();

  new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
})();
