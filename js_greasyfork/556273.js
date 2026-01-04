// ==UserScript==
// @name         必应中国至谷歌重定向（仅连通性正常时）
// @name:zh-CN   必应中国至谷歌重定向（仅连通性正常时）
// @name:en      Bing to Google redirect with fast connectivity check
// @namespace    http://tampermonkey.net/
// @version      2025-11-19
// @description  在cn.bing.com的搜索页面上，快速检查与Google的连通性（<500 ms）。如果可用，则重定向至Google。
// @description:zh-CN  在cn.bing.com的搜索页面上，快速检查与Google的连通性（<500 ms）。如果可用，则重定向至Google。
// @description:en  On cn.bing.com search pages, quickly check connectivity to Google (<500ms). If reachable, redirect to equivalent Google search.
// @author       shiraha
// @match        https://cn.bing.com/search*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @license      free
// @downloadURL https://update.greasyfork.org/scripts/556273/%E5%BF%85%E5%BA%94%E4%B8%AD%E5%9B%BD%E8%87%B3%E8%B0%B7%E6%AD%8C%E9%87%8D%E5%AE%9A%E5%90%91%EF%BC%88%E4%BB%85%E8%BF%9E%E9%80%9A%E6%80%A7%E6%AD%A3%E5%B8%B8%E6%97%B6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/556273/%E5%BF%85%E5%BA%94%E4%B8%AD%E5%9B%BD%E8%87%B3%E8%B0%B7%E6%AD%8C%E9%87%8D%E5%AE%9A%E5%90%91%EF%BC%88%E4%BB%85%E8%BF%9E%E9%80%9A%E6%80%A7%E6%AD%A3%E5%B8%B8%E6%97%B6%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- Config ---
  const CONNECTIVITY_URL = 'https://www.google.com/generate_204'; // lightweight reachability probe
  const TIMEOUT_MS = 500;

  // --- Helpers ---
  function getParam(name) {
    const url = new URL(window.location.href);
    const value = url.searchParams.get(name);
    return value !== null ? value : null;
  }

  function buildGoogleSearchUrl(query) {
    const url = new URL('https://www.google.com/search');
    url.searchParams.set('q', query);
    return url.toString();
  }

  function isEligiblePage() {
    // Only act on Bing search pages that actually have a query
    const q = getParam('q');
    if (!q || q.trim() === '') return false;
    // Avoid redirect loops or special cases (not strictly needed since we match only Bing)
    return true;
  }

  function checkGoogleConnectivityFast(callback) {
    // Use GM_xmlhttpRequest to avoid CORS blocks; short timeout to keep page snappy
    GM_xmlhttpRequest({
      method: 'GET',
      url: CONNECTIVITY_URL,
      timeout: TIMEOUT_MS,
      // Minimal headers; keep it simple
      onload: function (response) {
        // Accept typical success statuses; generate_204 returns 204 when reachable
        const ok = response.status === 204 || response.status === 200;
        callback(ok);
      },
      onerror: function () {
        callback(false);
      },
      ontimeout: function () {
        callback(false);
      }
    });
  }

  function redirectToGoogle(query) {
    const target = buildGoogleSearchUrl(query);
    // Use location.replace to avoid adding to history
    window.location.replace(target);
  }

  // --- Main ---
  if (!isEligiblePage()) return;

  const query = getParam('q');

  checkGoogleConnectivityFast(function (reachable) {
    if (!reachable) return; // Stay on Bing if Google is not reachable within 500ms
    redirectToGoogle(query);
  });
})();
