// ==UserScript==
// @name:ja         GoogleNoRedir
// @description:ja  Googleのリダイレクト警告を回避し、検索結果のリンクを直リンクに置き換えます。
// @author:ja       甘瀬ここあ

// @name         GoogleNoRedir
// @description  Bypasses Google's redirect warnings and replaces search result links with direct URLs.
// @author       AmaseCocoa
// @namespace    https://ns.amase.cc#GoogleNoRedir
// @version      1.1
// @license MIT
// @match        *://www.google.com/url?*
// @match        *://www.google.co.jp/url?*
// @match        *://www.google.com/search*
// @match        *://www.google.co.jp/search*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562758/GoogleNoRedir.user.js
// @updateURL https://update.greasyfork.org/scripts/562758/GoogleNoRedir.meta.js
// ==/UserScript==

/* jshint esversion: 11 */
(function () {
  "use strict";

  // ==========================================
  // SETTINGS (Change true to false to disable)
  // ==========================================
  const CONFIG = {
    AUTO_REDIRECT: true,
    REWRITE_LINKS: true,
  };

  const currentUrl = window.location.href;

  if (CONFIG.AUTO_REDIRECT && currentUrl.includes("/url?")) {
    try {
      const params = new URLSearchParams(window.location.search);
      const targetUrl = params.get("url");
      if (targetUrl) {
        window.location.replace(decodeURIComponent(targetUrl));
        return;
      }
    } catch (e) {}
  }

  if (CONFIG.REWRITE_LINKS && currentUrl.includes("/search")) {
    const cleanUpGoogleUrls = () => {
      const links = document.querySelectorAll(
        'a[href^="/url?"], a[href*=".google.com/url?"]',
      );
      links.forEach((link) => {
        try {
          const params = new URLSearchParams(
            new URL(link.getAttribute("href"), window.location.origin).search,
          );
          const targetUrl = params.get("url");
          if (targetUrl) {
            link.setAttribute("href", targetUrl);
            if (link.hasAttribute("onmousedown"))
              link.removeAttribute("onmousedown");
          }
        } catch (e) {}
      });
    };

    const init = () => {
      cleanUpGoogleUrls();
      new MutationObserver(() => cleanUpGoogleUrls()).observe(document.body, {
        childList: true,
        subtree: true,
      });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
})();
