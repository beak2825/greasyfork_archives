// ==UserScript==
// @name          hanime1网站工具
// @namespace     http://tampermonkey.net/
// @namespace     https://greasyfork.org/zh-CN/users/1196880-ling2ling4
// @version       0.0.2
// @author        Ling2Ling4
// @description   在hanime1页面, 允许选中视频详情内容, 并且双击标题可以复制标题文本。
// @license MIT
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAABLCAMAAADqDk+0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAsVBMVEUAAAD/AAD/AFX/AAC/QEDMMzPVKyvbJCTjHDnfICDmGjPRFy7VKyvYJyfdIjPbJCTfICvZISvbHyrcHi3bIC7bHy3ZIS7bIC3dHi7cHy3aIizbISvaHyzbISvbHyvbICzbICzbICzaISvbIC3bICzbHyzbISzbICzbIC3bICzbHyzbIC3bICzbICzbICvaICzcICvbHyzbICzbICzbICzbICzbICzbHyzbICzbICzbICyToObtAAAAOnRSTlMAAQMCBAUGBwkICgsMDQ8OGC8xMzg5PT9DSUxNUlRruLm6vMjJy8zNztLT1NXW2djf4/D09fb6+/3+PvP7WAAAAP1JREFUeNrtltkOgjAQRVtoccF9w33fd8WF6f9/mJpI+2LiKFKj4T7e5OSUoZAhKntxj5cj9FZQYk/9DjrkUY7CD/UZspRd/yFzEH5Mycxl13vCsDcYQ4NHJ8M/5Olq8HyfcYM8j2Io3mPhzxbIwyQT7tzwHjfQO03FMtlb7OQS7VHdGMtAJV+tN1vNhuNs0Gc7S1qgGZUwGPcdT8T8CAMCwPM8AMAz2/V8MhwMJ7PNCc20a9VSsVAsO60dlgHVjdEe1Y1eYBi3LIu/8g+xY2n7mlQ8uUIzCcIN0zQNyhZ/sR+waK/Sv4tRXXML18Oj+yZ49P0IQ9O9Vp6fm/UFwSt7O0hMcz0AAAAASUVORK5CYII=
// @match         *://hanime1.me/*
// @run-at document-body
// @compatible    chrome
// @compatible    edge
// @compatible    firefox
// @downloadURL https://update.greasyfork.org/scripts/551780/hanime1%E7%BD%91%E7%AB%99%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/551780/hanime1%E7%BD%91%E7%AB%99%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    // 1. 设置 .video-description-panel 元素内容可选取
    const detailsWrapper = document.querySelector(".video-description-panel");
    if (detailsWrapper) {
      // 允许用户选中元素内的文本内容
      detailsWrapper.style.userSelect = "text";
      detailsWrapper.style.webkitUserSelect = "text"; // 针对旧版 Safari/Chrome
      detailsWrapper.style.mozUserSelect = "text"; // 针对 Firefox
      detailsWrapper.style.msUserSelect = "text"; // 针对 IE/Edge
    }

    // 2. 通过事件委托给 h1, h2, h3, h4 绑定双击事件进行复制
    // 使用 document 作为委托的父元素，因为它总是存在的。
    document.body.addEventListener("dblclick", function (event) {
      const target = event.target;

      // 检查双击的元素是否是 h1, h2, h3, 或 h4
      //if (target.matches("h1, h2, h3, h4")) {
        const textToCopy = target.textContent.trim();

        if (textToCopy) {
          // 使用 Clipboard API 复制文本
          navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
              console.log(`Successfully copied: "${textToCopy}"`);
              // 可选：添加视觉反馈，例如短暂改变元素的背景色
              target.style.transition = "background-color 0.3s";
              target.style.backgroundColor = "#d3f1d3"; // 浅绿色
              setTimeout(() => {
                target.style.backgroundColor = "";
              }, 500);
            })
            .catch((err) => {
              console.error("Failed to copy text: ", err);
              // 兼容性或权限问题时的降级处理（较旧方法）
              fallbackCopyTextToClipboard(textToCopy);
            });
        }
      //}
    });

    // 兼容旧浏览器的复制方法（作为备用）
    function fallbackCopyTextToClipboard(text) {
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // 避免在屏幕上显示
      textArea.style.position = "fixed";
      textArea.style.top = 0;
      textArea.style.left = 0;
      textArea.style.opacity = 0;

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        const msg = successful ? "successful" : "unsuccessful";
        console.log("Fallback copying was " + msg);
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
      }

      document.body.removeChild(textArea);
    }
  });
})();
