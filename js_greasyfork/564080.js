// ==UserScript==
// @name         成绩批量填充助手
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在任意列粘贴多行成绩，自动纵向填充；低于60分自动标红
// @author       You
// @match        http://10.1.0.6/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564080/%E6%88%90%E7%BB%A9%E6%89%B9%E9%87%8F%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/564080/%E6%88%90%E7%BB%A9%E6%89%B9%E9%87%8F%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 更新分数样式的函数（只处理第7列，即 cix-7）
  function updateScoreStyle(element) {
    // 使用正则表达式匹配 cix-7 格式的 ID (x 为任意整数，只匹配第7列)
    let match = element.id.match(/^ci\d+-7$/);
    if (!match) return;

    let score = parseFloat(element.textContent || element.innerText || "");
    if (isNaN(score)) return;

    // 低于 60 分使用显著标注：红色背景 + 白色粗体字
    if (score < 60) {
      element.style.backgroundColor = "red";
      element.style.color = "white";
      element.style.fontWeight = "bold";
      element.style.padding = "2px 4px";
      element.style.borderRadius = "3px";
    } else {
      // 恢复默认样式
      element.style.backgroundColor = "";
      element.style.color = "";
      element.style.fontWeight = "";
      element.style.padding = "";
      element.style.borderRadius = "";
    }
  }

  // 页面加载完成后初始化
  function initScoreHighlighting() {
    // 只查找第7列的元素：cix-7
    let scoreElements = document.querySelectorAll('[id$="-7"]');
    scoreElements.forEach(updateScoreStyle);
  }

  // 监听 DOM 变化，处理动态加载的内容
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === 1) { // 元素节点
          // 只检查第7列：cix-7
          if (node.id && node.id.match(/^ci\d+-7$/)) {
            updateScoreStyle(node);
          }
          let scoreElements = node.querySelectorAll?.('[id$="-7"]');
          scoreElements?.forEach(updateScoreStyle);
        }
      });
    });
  });

  // 等待页面加载完成
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initScoreHighlighting();
      observer.observe(document.body, { childList: true, subtree: true });
    });
  } else {
    initScoreHighlighting();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener("paste", function (event) {
    let target = event.target;

    // 【核心修改】：使用正则表达式匹配
    // 逻辑：检查 ID 是否以 "ci1-" 开头，且后面紧跟数字（即 ci1-4, ci1-5, ci1-6 等）
    let match = target.id.match(/^ci1-(\d+)$/);

    // 如果点击的不是第一行的输入框（例如点在了 ci2-5 或备注栏上），则不处理
    if (!match) {
      return;
    }

    // 提取列号 (例如从 "ci1-5" 中提取出 "5")
    let colIndex = match[1];

    let pasteData = (event.clipboardData || window.clipboardData).getData(
      "text",
    );
    if (!pasteData) return;

    event.preventDefault();
    event.stopPropagation();

    // 分割数据
    let lines = pasteData
      .split(/\r\n|\n|\r/)
      .map((line) => line.trim())
      .filter((line) => line !== "");

    console.log(`检测到在第一行第 ${colIndex} 列粘贴数据，开始批量填充...`);

    for (let i = 0; i < lines.length; i++) {
      let rowNumber = i + 1; // 当前行号 (2, 3, 4...)

      // 动态构造 ID：ci + 行号 + - + 列号
      // 比如：ci2-5, ci3-5
      let targetId = `ci${rowNumber}-${colIndex}`;

      let inputElement = document.getElementById(targetId);

      if (inputElement) {
        inputElement.value = lines[i];

        // 触发网页内部逻辑
        inputElement.dispatchEvent(new Event("input", { bubbles: true }));
        inputElement.dispatchEvent(new Event("change", { bubbles: true }));
        inputElement.blur();

        // 更新分数样式
        setTimeout(function () {
          updateScoreStyle(inputElement);
        }, 100);
      } else {
        // 找不到对应行的输入框就停止
        console.log(`找不到 ID: ${targetId}，填充结束。`);
        break;
      }
    }
  });
})();
