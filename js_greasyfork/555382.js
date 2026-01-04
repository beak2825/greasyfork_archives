// ==UserScript==
// @name         Vetiver Redirect
// @namespace    https://v2explorer.app/
// @version      1.0.1
// @description  点击 v2ex.com/t/{id} 时尝试用 v2explorer://topic/{id} 打开；若未安装应用则静默取消跳转并停留当前页。
// @match        https://www.v2ex.com/*
// @match        https://v2ex.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555382/Vetiver%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/555382/Vetiver%20Redirect.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const topicHrefRe = /^https?:\/\/(?:www\.)?v2ex\.com\/t\/(\d+)(?:[/?#].*)?$/i;
  const toScheme = (id) => `v2explorer://topic/${id}`;

  // 仅拦截“正常点按”的左键/触摸点击；iOS 上没有 Ctrl/Meta 修饰键，但保留判断以免误伤桌面端
  function isPlainLeftClick(e) {
    return (
      e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey
    );
  }

  addEventListener(
    "click",
    (e) => {
      if (!isPlainLeftClick(e)) return;

      const a =
        e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!a) return;

      const href = a.href;
      const m = topicHrefRe.exec(href);
      if (!m) return;

      // 命中主题链接：阻止默认网页跳转，只尝试唤起自定义 scheme
      e.preventDefault();
      e.stopPropagation();

      const scheme = toScheme(m[1]);

      // iOS/iPadOS Safari：用户手势下设置 location 即可尝试拉起 App；
      // 若未安装应用，Safari 通常会静默无事发生，页面保持不动（符合“取消跳转”的需求）
      try {
        location.href = scheme;
      } catch (_) {
        // 无需处理：失败时保持原页
      }

      // 如果你希望“失败时回退到原网页链接”，取消注释下一行：
      // setTimeout(() => (document.hidden || document.visibilityState === "hidden") || (location.href = href), 1200);
    },
    true,
  );
})();