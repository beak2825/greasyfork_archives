// ==UserScript==
// @name         只用小红书搜索 - JS 版
// @namespace    https://maxchang.me
// @version      0.0.2
// @description  使用小红书网页版作为搜索引擎，隐藏主页的时间线，搜索框页面居中。RAASE™ (Rednote as a Search Engine)
// @author       Max Chang
// @license      MIT
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @include      https://www.xiaohongshu.com/*
// @downloadURL https://update.greasyfork.org/scripts/552896/%E5%8F%AA%E7%94%A8%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%90%9C%E7%B4%A2%20-%20JS%20%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/552896/%E5%8F%AA%E7%94%A8%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%90%9C%E7%B4%A2%20-%20JS%20%E7%89%88.meta.js
// ==/UserScript==

(function() {
  const css = `
    #mfContainer {
      display: none;
    }
    .mask-paper {
      background: none!important;
      backdrop-filter: none!important;
      min-height: 100vh;
    }
    .input-box {
      top: 35%;
      left: 55% !important;
    }
    .side-bar {
      z-index: 999;
    }
    @media screen and (max-width: 695px) {
      .input-box {
        width: 80% !important;
        padding: 0 84px 0 16px !important;
      }
      .min-width-search-icon {
        display: none !important
      }
      .input-button {
        opacity: 1 !important;
      }
      #search-input {
        padding: 10px;
      }
    }
  `;

  let styleNode = null;

  function addStyle() {
    if (styleNode) return;
    styleNode = document.createElement("style");
    styleNode.textContent = css;
    (document.head || document.documentElement).appendChild(styleNode);
  }

  function removeStyle() {
    if (styleNode) {
      styleNode.remove();
      styleNode = null;
    }
  }

  function checkURL() {
    const path = location.pathname;
    // 只在 /explore 或 /explore?xxx 生效
    if (path === "/explore" && !path.endsWith("/")) {
      addStyle();
    } else {
      removeStyle();
    }
  }

  // 包含 pushState / replaceState / popstate 的 URL 变动检测
  const _wr = function(type) {
    const orig = history[type];
    return function() {
      const rv = orig.apply(this, arguments);
      unsafeWindow.dispatchEvent(new Event("urlchange"));
      return rv;
    };
  };
  history.pushState = _wr("pushState");
  history.replaceState = _wr("replaceState");
  unsafeWindow.addEventListener("popstate", () => unsafeWindow.dispatchEvent(new Event("urlchange")));

  // 监听并立即执行一次
  unsafeWindow.addEventListener("urlchange", checkURL);
  checkURL();
})();
