// ==UserScript==
// @name        B站、YouTube视频在新页打开
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/video/*
// @match       https://www.youtube.com/watch?*
// @match       https://www.youtube.com/*
// @match       https://userstyles.world/user*
// @grant       none
// @version     1.0
// @author      glman
// @license      GPL-3.0 License
// @icon        https://pic1.imgdb.cn/item/69411a2e0dd29e7e2247404e.png
// @run-at       document-end
// @description 使页面上所有链接在新标签页中打开
// @downloadURL https://update.greasyfork.org/scripts/559314/B%E7%AB%99%E3%80%81YouTube%E8%A7%86%E9%A2%91%E5%9C%A8%E6%96%B0%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/559314/B%E7%AB%99%E3%80%81YouTube%E8%A7%86%E9%A2%91%E5%9C%A8%E6%96%B0%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function () {
  const host = location.host;

  // -------------------------------
  // 1. B站专用逻辑（只处理 /video/ 链接）
  // -------------------------------
  if (host.includes("bilibili.com")) {
    function interceptBili() {
      document.querySelectorAll("a[href]").forEach((a) => {
        const url = a.href;

        // 只处理 video 链接（避免误伤）
        if (!/bilibili\.com\/video\//.test(url)) return;

        if (a._bili_fixed) return;
        a._bili_fixed = true;

        a.addEventListener(
          "click",
          (e) => {
            e.stopImmediatePropagation();
            e.preventDefault();
            window.open(url, "_blank");
          },
          true
        );
      });
    }

    document.addEventListener("DOMContentLoaded", interceptBili);
    new MutationObserver(interceptBili).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    return; // ⚠️ 超重要：不执行下面的通用逻辑
  }

  // -------------------------------
  // 2. 其他网站通用逻辑（简单强制新标签打开）
  // -------------------------------
  function interceptGeneric() {
    document.querySelectorAll("a[href]").forEach((a) => {
      if (a._generic_fixed) return;
      a._generic_fixed = true;

      a.addEventListener(
        "click",
        (e) => {
          if (e.button !== 0) return; // 仅拦截左键
          e.stopImmediatePropagation();
          e.preventDefault();
          window.open(a.href, "_blank");
        },
        true
      );
    });
  }

  document.addEventListener("DOMContentLoaded", interceptGeneric);
  new MutationObserver(interceptGeneric).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
