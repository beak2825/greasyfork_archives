// ==UserScript==
// @name         iOS风格密码小眼睛显示/隐藏（聚焦才显示）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在密码输入框右侧插入 iOS 风格小眼睛，只有聚焦时才显示，点击可切换显示/隐藏密码。支持动态加载，Chrome内核浏览器可用。
// @author       佳佳张
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551138/iOS%E9%A3%8E%E6%A0%BC%E5%AF%86%E7%A0%81%E5%B0%8F%E7%9C%BC%E7%9D%9B%E6%98%BE%E7%A4%BA%E9%9A%90%E8%97%8F%EF%BC%88%E8%81%9A%E7%84%A6%E6%89%8D%E6%98%BE%E7%A4%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/551138/iOS%E9%A3%8E%E6%A0%BC%E5%AF%86%E7%A0%81%E5%B0%8F%E7%9C%BC%E7%9D%9B%E6%98%BE%E7%A4%BA%E9%9A%90%E8%97%8F%EF%BC%88%E8%81%9A%E7%84%A6%E6%89%8D%E6%98%BE%E7%A4%BA%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 小眼睛图标（SVG）
  const eyeSVG = {
    show: `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `,
    hide: `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-7 0-11-8-11-8a20.56 20.56 0 0 1 5.06-6.94"></path>
        <path d="M1 1l22 22"></path>
      </svg>
    `
  };

  // 注入样式
  const style = document.createElement("style");
  style.textContent = `
    .tm-eye-btn {
      position: absolute;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      color: rgba(60, 60, 67, 0.6); /* iOS 灰色半透明 */
      background: rgba(118, 118, 128, 0.12); /* iOS 输入框按钮背景 */
      border-radius: 50%;
      padding: 4px;
      display: none; /* 默认隐藏 */
      align-items: center;
      justify-content: center;
      transition: color 0.2s ease, background 0.2s ease;
    }
    .tm-eye-btn:hover {
      color: rgba(60, 60, 67, 0.9);
      background: rgba(118, 118, 128, 0.2);
    }
    .tm-eye-wrapper {
      position: relative;
      display: inline-block;
      width: 100%;
    }
    input.tm-eye-added {
      padding-right: 34px !important; /* 给按钮留出空间 */
    }
    input.tm-eye-focus + .tm-eye-btn {
      display: flex !important; /* 聚焦时显示 */
    }
  `;
  document.head.appendChild(style);

  // 给单个密码框添加小眼睛
  function addEye(input) {
    if (!(input instanceof HTMLInputElement)) return;
    if (input.type !== "password") return;
    if (input.classList.contains("tm-eye-added")) return;

    input.classList.add("tm-eye-added");

    const wrapper = document.createElement("div");
    wrapper.className = "tm-eye-wrapper";
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    const btn = document.createElement("div");
    btn.className = "tm-eye-btn";
    btn.innerHTML = eyeSVG.show;
    wrapper.appendChild(btn);

    btn.addEventListener("click", () => {
      if (input.type === "password") {
        input.type = "text";
        btn.innerHTML = eyeSVG.hide;
      } else {
        input.type = "password";
        btn.innerHTML = eyeSVG.show;
      }
      input.focus(); // 点击后保持光标
    });

    // 聚焦时显示按钮
    input.addEventListener("focus", () => {
      input.classList.add("tm-eye-focus");
    });

    // 失焦时隐藏按钮
    input.addEventListener("blur", () => {
      input.classList.remove("tm-eye-focus");
    });
  }

  // 扫描页面
  function scan() {
    document.querySelectorAll('input[type="password"]').forEach(addEye);
  }

  // 初始执行
  scan();

  // 监听 DOM 动态变化
  const observer = new MutationObserver(() => scan());
  observer.observe(document.body, { childList: true, subtree: true });
})();