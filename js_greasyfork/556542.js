// ==UserScript==
// @name         B站伪装不被拉黑（relation intercept）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  将所有 relation 接口中 be_relation.attribute = 128 改为 0，前端显示为未被拉黑（仅本地显示）
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556542/B%E7%AB%99%E4%BC%AA%E8%A3%85%E4%B8%8D%E8%A2%AB%E6%8B%89%E9%BB%91%EF%BC%88relation%20intercept%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/556542/B%E7%AB%99%E4%BC%AA%E8%A3%85%E4%B8%8D%E8%A2%AB%E6%8B%89%E9%BB%91%EF%BC%88relation%20intercept%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 拦截所有包含 "/relation?" 的请求（B站关系接口特征）
  const RELATION_PATTERN = /\/relation\?/;

  // --- 拦截 fetch ---
  const _fetch = window.fetch;
  window.fetch = function (...args) {
    return _fetch.apply(this, args).then(async (res) => {
      try {
        const url = (typeof args[0] === 'string') ? args[0] : (args[0]?.url || '');
        if (RELATION_PATTERN.test(url)) {
          const cloned = res.clone();
          const txt = await cloned.text();
          let json;
          try {
            json = JSON.parse(txt);
          } catch {
            return res; // 非 JSON 响应，跳过
          }
          if (json?.data?.be_relation?.attribute === 128) {
            json.data.be_relation.attribute = 0;
            console.log('[mask-relation] fetch: 改写 be_relation.attribute -> 0', url);
            const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
            const newHeaders = new Headers(res.headers);
            return new Response(blob, {
              status: res.status,
              statusText: res.statusText,
              headers: newHeaders
            });
          }
        }
      } catch (e) {
        console.warn('[mask-relation] fetch 修改失败', e);
      }
      return res;
    });
  };

  // --- 拦截 XMLHttpRequest ---
  const XHR = window.XMLHttpRequest;
  const origOpen = XHR.prototype.open;
  XHR.prototype.open = function (method, url) {
    this._mask_url = url?.toString() || '';
    return origOpen.apply(this, arguments);
  };

  const origSend = XHR.prototype.send;
  XHR.prototype.send = function (...args) {
    this.addEventListener('load', function () {
      try {
        const url = this._mask_url || '';
        if (RELATION_PATTERN.test(url)) {
          let json;
          try {
            json = JSON.parse(this.responseText);
          } catch {
            return; // 跳过非 JSON
          }
          if (json?.data?.be_relation?.attribute === 128) {
            json.data.be_relation.attribute = 0;
            const out = JSON.stringify(json);
            try {
              Object.defineProperty(this, 'responseText', { get: () => out });
              Object.defineProperty(this, 'response', { get: () => out });
            } catch (e) {
              /* 忽略 */
            }
            console.log('[mask-relation] XHR: 改写 be_relation.attribute -> 0', url);
          }
        }
      } catch (e) {
        console.warn('[mask-relation] XHR 修改失败', e);
      }
    });
    return origSend.apply(this, args);
  };

  console.log('[mask-relation] 已启用：全局伪装“被拉黑”状态');
})();