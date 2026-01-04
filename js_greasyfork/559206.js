// ==UserScript==
// @name         MiceYaa Emby TM Bridge
// @namespace    https://miceyaa.local
// @version      0.1.2
// @description  Provide window.embyRequest to bypass CORS via GM_xmlhttpRequest
// @match        https://miceyaa.com/*
// @match        http://localhost:51730/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      *
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559206/MiceYaa%20Emby%20TM%20Bridge.user.js
// @updateURL https://update.greasyfork.org/scripts/559206/MiceYaa%20Emby%20TM%20Bridge.meta.js
// ==/UserScript==

(function () {
  'use strict';
  try { unsafeWindow.__miceyaa_tm_ready = true } catch {}

  /**
   * 通用请求转发
   * @param {string} method HTTP方法
   * @param {string} url 请求地址
   * @param {any} body 请求体
   * @param {object} headers 请求头
   */
  unsafeWindow.embyRequest = (method, url, body, headers) => new Promise((resolve, reject) => {
    try {
      if (typeof GM_xmlhttpRequest !== 'function') {
        reject(new Error('GM_xmlhttpRequest unavailable'))
        return
      }

      let data = body;
      if (body && typeof body !== 'string' && !(body instanceof FormData) && !(body instanceof Blob)) {
        try {
          data = JSON.stringify(body);
        } catch (e) {
          // keep original if stringify fails or intended
        }
      }

      GM_xmlhttpRequest({
        method: method || 'GET',
        url,
        headers: headers || {},
        data: data,
        responseType: 'text',
        onload: (r) => {
          resolve({
            status: r.status,
            statusText: r.statusText,
            headers: r.responseHeaders,
            body: r.responseText
          })
        },
        onerror: (e) => reject(new Error('Network Error')),
        ontimeout: () => reject(new Error('Timeout'))
      })
    } catch (e) { reject(e) }
  })

  // 兼容旧版 embyPost (可选，为了平滑过渡，建议保留一段时间或者直接移除)
  unsafeWindow.embyPost = (url, body, headers) => unsafeWindow.embyRequest('POST', url, body, headers)
    .then(r => {
        const h = (r.headers || '').toLowerCase()
        const isJson = h.includes('application/json')
        try { return isJson ? JSON.parse(r.body) : r.body } catch { return r.body }
    });

})()
