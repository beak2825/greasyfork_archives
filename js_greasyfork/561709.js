// ==UserScript==
// @name         抖音PC删除弹幕输入框和稍后再播
// @namespace    https://douyin.com/
// @version      2.0
// @description  仅移除抖音网页版弹幕条和稍后再播（因为有时候拖动进度的时候鼠标移到表情包的位置会有弹窗挡住调进度条）
// @author       余某人
// @match        https://www.douyin.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561709/%E6%8A%96%E9%9F%B3PC%E5%88%A0%E9%99%A4%E5%BC%B9%E5%B9%95%E8%BE%93%E5%85%A5%E6%A1%86%E5%92%8C%E7%A8%8D%E5%90%8E%E5%86%8D%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/561709/%E6%8A%96%E9%9F%B3PC%E5%88%A0%E9%99%A4%E5%BC%B9%E5%B9%95%E8%BE%93%E5%85%A5%E6%A1%86%E5%92%8C%E7%A8%8D%E5%90%8E%E5%86%8D%E6%92%AD.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function removeDanmuOnly() {
    const grids = document.querySelectorAll("xg-controls xg-inner-controls xg-left-grid");

    grids.forEach(grid => {
      Array.from(grid.children).forEach(child => {
        // ✅ 明确保留播放器核心控件
        if (
          child.tagName === "XG-ICON" ||
          child.classList.contains("xgplayer-play") ||
          child.classList.contains("xgplayer-time")
        ) {
          return;
        }

        // ❌ 只处理弹幕相关的 div（索引随机的罪魁祸首）
        if (child.tagName === "DIV") {
          child.style.display = "none";
          // 或彻底删除：
          // child.remove();
        }
      });
    });

    const rightGrids = document.querySelectorAll("xg-controls xg-inner-controls xg-right-grid");

    rightGrids.forEach(grid => {
      const watchLater = grid.querySelector(".xgplayer-watch-later");
      if (watchLater) {
        watchLater.remove();
      }
    });
  }

  // 初次执行
  removeDanmuOnly();

  // 监听 DOM 变化（切视频 / 自动播放）
  const observer = new MutationObserver(() => {
    removeDanmuOnly();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
