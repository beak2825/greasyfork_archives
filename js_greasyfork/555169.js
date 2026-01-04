// ==UserScript==
// @name         cldisk Thumb → PDF Helper
// @namespace    https://greasyfork.org/users/yourname
// @version      1.2
// @description  自动将 cldisk 缩略图 URL (…/thumb/96.png) 转换为对应 PDF 链接 (…/pdf/{hash}.pdf)，支持复制与一键打开。
// @author       你（基于 GPT 辅助编写）
// @license      MIT
// @icon         https://s3.cldisk.com/favicon.ico
// @match        https://s3.cldisk.com/*
// @grant        GM_notification
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555169/cldisk%20Thumb%20%E2%86%92%20PDF%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/555169/cldisk%20Thumb%20%E2%86%92%20PDF%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const HOST_FILTER = 's3.cldisk.com';

  function thumbUrlToPdfUrl(rawUrl) {
    if (!rawUrl) return null;
    try {
      const url = new URL(rawUrl, location.href);
      if (HOST_FILTER && url.host !== HOST_FILTER) return null;
      const idx = url.pathname.indexOf('/thumb/');
      if (idx === -1) return null;
      const beforeThumb = url.pathname.slice(0, idx);
      const segments = beforeThumb.split('/').filter(Boolean);
      if (!segments.length) return null;
      const hash = segments[segments.length - 1];
      const prefix = '/' + segments.join('/');
      const pdfPath = `${prefix}/pdf/${hash}.pdf`;
      return `${url.protocol}//${url.host}${pdfPath}`;
    } catch {
      return null;
    }
  }

  function notify(msg) {
    if (typeof GM_notification === 'function') GM_notification({ text: msg, timeout: 2000 });
    else console.log('[cldisk-helper]', msg);
  }

  function handleThumb(url) {
    const pdfUrl = thumbUrlToPdfUrl(url);
    if (pdfUrl) {
      console.log('[cldisk-helper] thumb =>', pdfUrl);
      notify('检测到缩略图，已解析对应 PDF');
    }
  }

  // Hook fetch
  if (window.fetch) {
    const f = window.fetch;
    window.fetch = function (input, init) {
      if (typeof input === 'string') handleThumb(input);
      return f.apply(this, arguments);
    };
  }

  // Hook XHR
  const o = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    handleThumb(url);
    return o.apply(this, arguments);
  };

  // 扫描页面元素并添加按钮
  function attachBtn(el, url) {
    const pdf = thumbUrlToPdfUrl(url);
    if (!pdf || el.dataset.clPdf) return;
    const btn = document.createElement('button');
    btn.textContent = '打开 PDF';
    btn.style.marginLeft = '5px';
    btn.onclick = () => window.open(pdf, '_blank');
    el.insertAdjacentElement('afterend', btn);
    el.dataset.clPdf = 1;
  }

  function scan() {
    document.querySelectorAll('img,a').forEach(el => {
      const url = el.src || el.href;
      if (url) attachBtn(el, url);
    });
  }

  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });

})();
