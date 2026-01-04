// ==UserScript==
// @name         让你的飞书文档更好用
// @namespace    https://bytedance.com
// @version      0.11.0
// @description  保留飞书右键菜单；复制时写入 text/html 与 text/plain，保持格式；接口层强制 copy=1；轻量 CSS 去水印
// @author       merge by ChatGPT (based on NOABC & Tom-yang)
// @match        *://*.feishu.cn/*
// @match        *://*.larkoffice.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feishu.cn
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552236/%E8%AE%A9%E4%BD%A0%E7%9A%84%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%E6%9B%B4%E5%A5%BD%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552236/%E8%AE%A9%E4%BD%A0%E7%9A%84%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%E6%9B%B4%E5%A5%BD%E7%94%A8.meta.js
// ==/UserScript==

(function () {
  if (window.__FEISHU_COPY_FIX_MERGED__) return;
  window.__FEISHU_COPY_FIX_MERGED__ = true;

  /******** 1) 复制：写入 text/html + text/plain，保留格式；不碰 contextmenu ********/
  function selectionToHTMLAndText() {
    const sel = window.getSelection && window.getSelection();
    if (!sel || sel.rangeCount === 0) return { html: '', text: '' };
    const range = sel.getRangeAt(0).cloneRange();
    // 若是输入框/textarea，使用其原生 value 作为 plain text
    const anchorNode = sel.anchorNode && (sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentNode : sel.anchorNode);
    const isFormControl = anchorNode && (anchorNode.nodeName === 'TEXTAREA' || (anchorNode.nodeName === 'INPUT' && /text|search|url|email|password|tel/i.test(anchorNode.type)));
    let plain = '';
    let html = '';
    if (isFormControl) {
      plain = anchorNode.value?.substring(anchorNode.selectionStart, anchorNode.selectionEnd) || '';
      html = plain.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    } else {
      const container = document.createElement('div');
      container.appendChild(range.cloneContents());
      html = container.innerHTML;
      plain = (sel + '') || container.textContent || '';
    }
    return { html, text: plain };
  }

  // 不再重写 EventTarget.prototype.addEventListener，避免和站点逻辑冲突、也减少崩溃源
  // 采用捕获阶段的全局监听，最先拿到事件，写入我们想要的剪贴板内容
  document.addEventListener('copy', function(e) {
    try {
      const data = selectionToHTMLAndText();
      if (!data) return;
      // 有些选区为空则不处理
      if (!data.text && !data.html) return;

      // 写入两种 MIME，确保富文本粘贴保留结构，纯文本也可用
      if (e.clipboardData) {
        if (data.html) e.clipboardData.setData('text/html', data.html);
        if (data.text) e.clipboardData.setData('text/plain', data.text);
        e.preventDefault(); // 确保用我们写入的内容
      }
    } catch(_) {}
    // 不 stopImmediatePropagation，尽量减少副作用；我们已经 preventDefault 了，站点就算再写也覆盖不了
  }, true); // 捕获阶段

  // 保留浏览器默认复制行为的回退（在极端情况下）
  try {
    Object.defineProperty(document, 'oncopy', { configurable: true, get: () => null, set: () => {} });
    Object.defineProperty(window, 'oncopy',    { configurable: true, get: () => null, set: () => {} });
  } catch (_) {}

  /******** 2) 接口层：强制 copy=1（XHR + fetch） ********/
  (function patchXHR() {
    const XHR = XMLHttpRequest;
    if (!XHR || XHR.prototype.open.__patched_for_feishu_copy__) return;

    const rawOpen = XHR.prototype.open;
    XHR.prototype.open = function(method, url, ...rest) {
      try { this.__fs_target_url__ = String(url || ''); } catch(_) {}
      this.addEventListener('readystatechange', function () {
        if (this.readyState !== 4) return;
        const urlStr = this.__fs_target_url__ || '';
        const isPermissionState =
          (urlStr.includes('/space/api/suite/permission/') && urlStr.includes('/actions/state/')) ||
          (urlStr.includes('/permission/') && urlStr.includes('/actions/state'));
        if (!isPermissionState) return;

        try {
          let json = null;
          if (typeof this.responseText === 'string') {
            json = JSON.parse(this.responseText);
          } else if (this.response && typeof this.response === 'object') {
            json = this.response;
          }
          if (json?.data?.actions && json.data.actions.copy !== 1) {
            json.data.actions.copy = 1;
            try { Object.defineProperty(this, 'responseText', { configurable: true, get: () => JSON.stringify(json) }); } catch(_) {}
            try { Object.defineProperty(this, 'response', { configurable: true, get: () => json }); } catch(_) {}
          }
        } catch(_) {}
      }, false);
      return rawOpen.call(this, method, url, ...rest);
    };
    XHR.prototype.open.__patched_for_feishu_copy__ = true;
  })();

  (function patchFetch() {
    if (!window.fetch || window.fetch.__patched_for_feishu_copy__) return;
    const rawFetch = window.fetch;
    window.fetch = async function (...args) {
      const res = await rawFetch(...args);
      try {
        const urlStr = String(args[0] || '');
        const isPermissionState =
          (urlStr.includes('/space/api/suite/permission/') && urlStr.includes('/actions/state/')) ||
          (urlStr.includes('/permission/') && urlStr.includes('/actions/state'));
        if (!isPermissionState) return res;

        const clone = res.clone();
        const json = await clone.json().catch(() => null);
        if (json?.data?.actions && json.data.actions.copy !== 1) {
          json.data.actions.copy = 1;
          return new Response(JSON.stringify(json), {
            status: res.status,
            statusText: res.statusText,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } catch(_) {}
      return res;
    };
    window.fetch.__patched_for_feishu_copy__ = true;
  })();

  /******** 3) 轻量去水印（仅 CSS） ********/
  (function injectWatermarkCSS() {
    if (typeof window.GM_addStyle === 'undefined') {
      window.GM_addStyle = (css) => {
        const head = document.head || document.documentElement;
        if (!head) return null;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        head.appendChild(style);
        return style;
      };
    }
    const bgImageNone = '{background-image: none !important;}';
    const gen = (sel) => `${sel}${bgImageNone}`;
    const css =
      [
        gen('[class*="watermark"]'),
        gen('[style*="pointer-events: none"]'),
        gen('.ssrWaterMark'),
        gen('body>div>div>div>div[style*="position: fixed"]:not(:has(*))'),
        gen('[class*="TIAWBFTROSIDWYKTTIAW"]'),
        gen('body>div[style*="position: fixed"]:not(:has(*))'),
        gen('#watermark-cache-container'),
        gen('body>div[style*="inset: 0px;"]:not(:has(*))'),
        gen('.chatMessages>div[style*="inset: 0px;"]'),
        '* { -webkit-user-select: text !important; user-select: text !important; }'
      ].join('\n');

    try { window.GM_addStyle(css); } catch(_) {}
  })();

})();
