// ==UserScript==
// @name         禁止自动弹出登录弹窗
// @namespace    https://github.com/ewigl/zhihu-enhanced/blob/main/disableSignFlowModal.user.js
// @version      1.0
// @description  禁用非登录状态下访问知乎时自动弹出的登录弹窗。
// @icon         https://www.zhihu.com/favicon.ico
// @match        *://*.zhihu.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551236/%E7%A6%81%E6%AD%A2%E8%87%AA%E5%8A%A8%E5%BC%B9%E5%87%BA%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/551236/%E7%A6%81%E6%AD%A2%E8%87%AA%E5%8A%A8%E5%BC%B9%E5%87%BA%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 当 header 上的登录/用户按钮出现时，给它绑定一次性 click 处理，用来停止观察器
  function bindHeaderButton() {
    const btn = document.querySelector(
      "button.AppHeader-login, .AppHeader-userInfo > .AppHeader-profile > div > button.Button--blue"
    );
    if (btn) {
      btn.addEventListener(
        "click",
        function () {
          observerModal.disconnect();
          observerHeader.disconnect();
        },
        { once: true }
      );
    }
  }

  // 观察 modal 出现并自动点击关闭
  const observerModal = new MutationObserver(() => {
    const closeBtn = document.querySelector(
      ".Modal-wrapper .signFlowModal > .Modal-closeButton"
    );
    if (closeBtn) {
      // 找到就点击并断开观察器
      observerModal.disconnect();
      observerHeader.disconnect();
      try {
        closeBtn.click();
      } catch (e) {
        /* 忽略点击异常 */
      }
    }
  });

  // 观察 DOM 变化以绑定 header 的按钮
  const observerHeader = new MutationObserver(bindHeaderButton);

  observerModal.observe(document, { childList: true, subtree: true });
  observerHeader.observe(document, { childList: true, subtree: true });

  // 超时保护：5 秒后停止观察（防止长期占用）
  setTimeout(() => {
    try {
      observerModal.disconnect();
      observerHeader.disconnect();
    } catch (e) {
      /* noop */
    }
  }, 5000);
})();
