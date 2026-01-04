// ==UserScript==
// @name         街景标签管理简洁模式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  删除街景移动的元素，便于截图
// @author       Asukaprpr
// @license      BSD
// @match        https://tuxun.fun/mapTagger/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556495/%E8%A1%97%E6%99%AF%E6%A0%87%E7%AD%BE%E7%AE%A1%E7%90%86%E7%AE%80%E6%B4%81%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/556495/%E8%A1%97%E6%99%AF%E6%A0%87%E7%AD%BE%E7%AE%A1%E7%90%86%E7%AE%80%E6%B4%81%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var ab = [
    '//*[@id="viewer"]/div/div[2]/div[1]/div[10]',
    '//*[@id="viewer"]/div/div[12]/div/div',
    '//*[@id="root"]/div/div[2]/div/main/div[2]/div/div[2]',
  ];
  function cd(ef) {
    return document.evaluate(
      ef,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
  }
  function gh() {
    ab.forEach(function (ij) {
      var kl = cd(ij);
      if (kl) {
        kl.remove();
      }
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", gh);
  } else {
    gh();
  }
  var mn = new MutationObserver(function (op) {
    gh();
  });
  mn.observe(document.body, { childList: true, subtree: true });
  setInterval(gh, 1000);
})();
