// ==UserScript==
// @name         CSDN 增强
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  隐藏左右菜单，免关注即可查看全文，支持免登录复制代码。
// @author       WHXRR
// @license      MIT
// @match        https://blog.csdn.net/*/article/details/*
// @match        https://*.blog.csdn.net/article/details/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550948/CSDN%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/550948/CSDN%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName("head")[0];
    if (!head) {
      return;
    }
    style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = css;
    head.appendChild(style);
  }

  // 1. Inject CSS to hide side menus and expand the main content area
  addGlobalStyle(`
        #mainBox .blog_container_aside, #rightAside, #toolBarBox, #csdn-toolbar, .passport-login-container { display: none !important; }
        #mainBox { width: 100% !important; }
        .nodata .container main { width: 100% !important; }
        .nodata .container { margin-right: 0 !important; }
        body #mainBox { width: 100% !important; }
        /* Enable text selection */
        body, body * { user-select: auto !important; }
    `);

  // 2. Remove copy/selection restrictions
  document.querySelectorAll("*").forEach((item) => {
    item.oncopy = function (e) {
      e.stopPropagation();
    };
  });

  const handleDynamicContent = () => {
    // Expand elements that have inline styles
    const articleContent = document.querySelector("#article_content");
    const hideArticleBox = document.querySelector(".hide-article-box");

    if (articleContent && articleContent.style.height !== "auto") {
      articleContent.style.height = "auto";
    }
    if (hideArticleBox && hideArticleBox.style.display !== "none") {
      hideArticleBox.style.display = "none";
    }

    // 3. Override "Login to Copy" buttons
    const copyButtons = document.querySelectorAll("div.hljs-button.signin");
    copyButtons.forEach((button) => {
      if (button.dataset.copyListenerAdded) {
        return; // Skip if listener is already attached
      }

      // Remove login functionality
      button.removeAttribute("onclick");
      button.dataset.title = "复制代码";
      button.classList.remove("signin");

      // Add direct copy functionality
      button.addEventListener("click", (event) => {
        event.stopPropagation();

        const pre = button.closest("pre");
        if (!pre) return;

        const code = pre.querySelector("code");
        if (!code) return;

        navigator.clipboard
          .writeText(code.innerText)
          .then(() => {
            button.dataset.title = "已复制！";
            setTimeout(() => {
              button.dataset.title = "复制代码";
            }, 2000);
          })
          .catch((err) => {
            console.error("Failed to copy code: ", err);
            button.dataset.title = "复制失败";
            setTimeout(() => {
              button.dataset.title = "复制代码";
            }, 2000);
          });
      });

      button.dataset.copyListenerAdded = "true";
    });
  };

  // Use MutationObserver to handle all dynamically loaded content
  const observer = new MutationObserver(handleDynamicContent);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initial run to catch already present elements
  handleDynamicContent();
})();
