// ==UserScript==
// @name         Disable Shopify Cart Sync
// @namespace    https://bushiroad-store.com/
// @version      1.1
// @description  Disable cart sync by UA spoofing + DOM blocking + request interception
// @match        https://bushiroad-store.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564163/Disable%20Shopify%20Cart%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/564163/Disable%20Shopify%20Cart%20Sync.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*****************************************************************
   * 方案三：欺骗浏览器判断，让 initShopCartSync 直接 return
   *****************************************************************/
  if ('userAgentData' in navigator) {
    try {
      Object.defineProperty(navigator, 'userAgentData', {
        configurable: true,
        get() {
          return {
            brands: [
              { brand: 'Not.A/Brand', version: '99' }
            ],
            mobile: false,
            getHighEntropyValues: async () => ({})
          };
        }
      });
      console.log('[CartSync] userAgentData spoofed (disable init)');
    } catch (e) {
      console.warn('[CartSync] Failed to spoof userAgentData', e);
    }
  }

  /*****************************************************************
   * 方案二：阻止 <shop-cart-sync> Web Component 被插入 DOM
   *****************************************************************/
  const originalAppendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function (el) {
    try {
      if (el && el.tagName === 'SHOP-CART-SYNC') {
        console.log('[CartSync] <shop-cart-sync> blocked');
        return el;
      }
    } catch (_) {}
    return originalAppendChild.call(this, el);
  };

  const originalInsertBefore = Element.prototype.insertBefore;
  Element.prototype.insertBefore = function (el, ref) {
    try {
      if (el && el.tagName === 'SHOP-CART-SYNC') {
        console.log('[CartSync] <shop-cart-sync> blocked (insertBefore)');
        return el;
      }
    } catch (_) {}
    return originalInsertBefore.call(this, el, ref);
  };

  /*****************************************************************
   * 方案一：兜底拦截 /cart/change?quantity=0 请求
   *****************************************************************/

  // fetch 拦截
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    try {
      const url = typeof input === 'string' ? input : input.url;
      if (url && url.includes('/cart/change') && url.includes('quantity=0')) {
        console.warn('[CartSync] Blocked fetch:', url);
        return Promise.resolve(new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }
    } catch (_) {}
    return originalFetch.apply(this, arguments);
  };

  // XMLHttpRequest 拦截（Shopify 仍大量使用）
  const OriginalXHR = window.XMLHttpRequest;
  function XHRProxy() {
    const xhr = new OriginalXHR();
    const originalOpen = xhr.open;

    xhr.open = function (method, url) {
      this._url = url;
      return originalOpen.apply(this, arguments);
    };

    const originalSend = xhr.send;
    xhr.send = function () {
      if (this._url &&
          this._url.includes('/cart/change') &&
          this._url.includes('quantity=0')) {
        console.warn('[CartSync] Blocked XHR:', this._url);
        this.abort();
        return;
      }
      return originalSend.apply(this, arguments);
    };

    return xhr;
  }
  window.XMLHttpRequest = XHRProxy;

})();
