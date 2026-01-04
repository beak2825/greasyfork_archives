// ==UserScript==
// @name         Google Calendar Highlight Today
// @namespace    https://example.com
// @version      1.0.0
// @description  Highlights today's date in Google Calendar with an orange border and glow effect for better visibility
// @author       https://github.com/AJLoveChina
// @license      MIT
// @match        https://calendar.google.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555658/Google%20Calendar%20Highlight%20Today.user.js
// @updateURL https://update.greasyfork.org/scripts/555658/Google%20Calendar%20Highlight%20Today.meta.js
// ==/UserScript==

(function () {
  const HIGHLIGHT_CLASS = "ai-today-highlight";
  const STYLE_ID = "ai-today-highlight-style";

  // 🎨 注入全局样式
  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .${HIGHLIGHT_CLASS} {
        border: 2px solid #FFA726 !important;
        box-shadow: 0 0 12px rgba(255, 167, 38, 0.8) !important;
        border-radius: 8px;
      }
    `;
    document.head.appendChild(style);
  }

  // 🧹 清理旧 class
  function clearHighlights() {
    document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach((el) => {
      el.classList.remove(HIGHLIGHT_CLASS);
    });
  }

  // ✨ 高亮今日日期单元格
  function applyHighlight() {
    const circleElem = [...document.querySelectorAll("h2.w48V4c")].find((el) => {
      const style = getComputedStyle(el);
      return style.borderRadius === "50%" && style.backgroundColor !== "rgba(0, 0, 0, 0)";
    });

    if (!circleElem) return;
    const cell = circleElem.parentElement;
    cell.classList.add(HIGHLIGHT_CLASS);
  }

  function highlightToday() {
    clearHighlights();
    applyHighlight();
  }

  injectStyle();

  // 👁️ 监听DOM变化以自动更新
  const observer = new MutationObserver(() => highlightToday());
  observer.observe(document.body, { childList: true, subtree: true });

  highlightToday();
  setInterval(highlightToday, 1000);
})();
