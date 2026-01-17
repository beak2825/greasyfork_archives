// ==UserScript==
// @name         禁止APK自动下载
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  通过 Navigation API 拦截以 .apk 结尾的页面跳转，防止流氓网站打开立即自动下载，并在网页顶部显示提示
// @author       wxupjack & Gemini 3 Pro
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562842/%E7%A6%81%E6%AD%A2APK%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/562842/%E7%A6%81%E6%AD%A2APK%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 用于存储用户临时允许的 URL
  const allowedUrls = new Set();

  // 简易 Toast 显示函数，支持操作按钮
  function showToast(
    message,
    type = "info",
    actionCallback = null,
    actionText = "允许一次"
  ) {
    const styleId = "apk-block-toast-style";

    // 确保样式只注入一次
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
                .apk-block-toast {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%) translateY(-20px);
                    background-color: #323232;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    z-index: 2147483647;
                    font-family: system-ui, -apple-system, sans-serif;
                    font-size: 14px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    opacity: 0;
                    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
                    pointer-events: auto; /* 允许点击按钮 */
                    max-width: 90%;
                    text-align: center;
                    word-break: break-all;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }
                .apk-block-toast.show {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                .apk-block-toast.warn {
                    background-color: #ff4d4f;
                }
                .apk-block-toast button {
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.4);
                    color: white;
                    padding: 6px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                    transition: background 0.2s;
                    width: 100%;
                    box-sizing: border-box;
                }
                .apk-block-toast button:hover {
                    background: rgba(255,255,255,0.3);
                }
            `;
      (document.head || document.documentElement).appendChild(style);
    }

    // 移除旧的 toast (如果存在，避免堆叠)
    const oldToast = document.querySelector(".apk-block-toast");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.className = `apk-block-toast ${type}`;

    const textSpan = document.createElement("span");
    textSpan.textContent = message;
    toast.appendChild(textSpan);

    let autoCloseTimer;

    // 如果提供了回调，添加按钮
    if (actionCallback) {
      const btn = document.createElement("button");
      btn.textContent = actionText;
      btn.onclick = (e) => {
        e.stopPropagation(); // 防止触发 body 点击等
        actionCallback();
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
      };
      toast.appendChild(btn);
    }

    // 尝试插入到 body，如果 body 还没加载则插入到 html
    const container = document.body || document.documentElement;
    container.appendChild(toast);

    // 触发重绘以激活动画
    void toast.offsetWidth;
    toast.classList.add("show");

    // 5秒后自动移除（如果是警告且有按钮，稍微长一点时间）
    const duration = actionCallback ? 8000 : 3000;
    autoCloseTimer = setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // 检查浏览器是否支持 Navigation API (Chrome 102+, Edge 102+)
  if (window.navigation) {
    window.navigation.addEventListener("navigate", (event) => {
      try {
        // 获取目标 URL 对象
        const destinationUrl = new URL(event.destination.url);
        const fullUrl = destinationUrl.href;

        // 检查是否在白名单中
        if (allowedUrls.has(fullUrl)) {
          console.log(`允许本次下载跳转: ${fullUrl}`);
          allowedUrls.delete(fullUrl); // 使用一次后即失效
          return; // 放行，不阻止
        }

        // 检查 URL 路径是否以 .apk 结尾 (忽略查询参数)
        // 或者 href 中包含 .apk?
        if (
          destinationUrl.pathname.endsWith(".apk") ||
          destinationUrl.href.includes(".apk?")
        ) {
          const fileName =
            destinationUrl.pathname.split("/").pop() || "unknown.apk";
          const msg = `已拦截自动 APK 下载: ${fileName}`;

          console.warn(msg);

          // 阻止导航行为
          event.preventDefault();

          // 显示带按钮的 toast
          showToast(msg, "warn", () => {
            console.log(`用户点击允许下载: ${fullUrl}`);
            allowedUrls.add(fullUrl);
            // 重新触发跳转
            window.location.href = fullUrl;
          });
        }
      } catch (e) {
        // 忽略非标准 URL
      }
    });

    const initMsg = "APK 自动下载拦截脚本已激活";
    console.log(initMsg);

    // 注释掉初始化弹窗，避免打扰
    // if (document.readyState === 'loading') {
    //     document.addEventListener('DOMContentLoaded', () => showToast(initMsg));
    // } else {
    //     showToast(initMsg);
    // }
  } else {
    const errorMsg =
      "当前浏览器不支持 Navigation API，无法拦截自动下载。请使用 Chrome/Edge 102+ 版本。";
    console.error(errorMsg);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        showToast(errorMsg, "warn")
      );
    } else {
      showToast(errorMsg, "warn");
    }
  }
})();
