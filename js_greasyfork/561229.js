// ==UserScript==
// @name         LPIPE-NEXT
// @namespace    https://liquipedia.net/
// @version      2026-01-13 Update 1
// @description  Enable IPE NEXT in Liquipedia
// @author       OTSEndPoem
// @match        https://liquipedia.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561229/LPIPE-NEXT.user.js
// @updateURL https://update.greasyfork.org/scripts/561229/LPIPE-NEXT.meta.js
// ==/UserScript==
!(function() {
  // RLQ是MediaWiki保存异步执行函数的数组
  window.RLQ = RLQ || [];
  RLQ.push(() => {
    // 等待jQuery加载完毕
    var _count = 0;
    var _interval = setInterval(() => {
      _count++;
      if (typeof jQuery !== "undefined") {
        // jQuery加载完毕
        clearInterval(_interval);
        // 防止网站并不是MediaWiki时报错
        try {
            mw.loader.load('https://cdn.jsdelivr.net/npm/@inpageedit/core/lib/index.umd.js')
            mw.loader.load('https://cdn.jsdelivr.net/npm/@inpageedit/core/lib/style.css','text/css')
        } catch (e) {}
      } else if (_count > 30 * 5) {
        // 加载超时
        clearInterval(_interval);
      }
    }, 200);
  });
})();