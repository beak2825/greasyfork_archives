// ==UserScript==
// @name         ytb搜索数据改色
// @namespace    http://tampermonkey.net/
// @version      2025-12-12
// @description  ytb改色
// @author       tommychen
// @match        https://www.youtube.com/results?*
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563200/ytb%E6%90%9C%E7%B4%A2%E6%95%B0%E6%8D%AE%E6%94%B9%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/563200/ytb%E6%90%9C%E7%B4%A2%E6%95%B0%E6%8D%AE%E6%94%B9%E8%89%B2.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ----------------------------------------------------------------------------------------------------------------
  // 工具函数：日期改色
  // 定义需要检查的年份
  const years = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"];
  const year2024 = ["2年"];
  const year2025 = ["1年"];

  const mon = ["月"];

  // 处理日期元素
  function processDateElements() {
    const dateElements = document.querySelectorAll(
      "#metadata-line >span:nth-of-type(2)"
    );
    dateElements.forEach((element) => {
      const textContent = element.textContent.trim();

      // 检查文本内容中的数值是否大于1000且小于10000
      const matches = textContent.match(/\d+/g); // 匹配所有数字

      // 今年
      if (mon.some((year) => textContent.includes(year))) {
        element.style.color = "#ff4e4e";
      }

      // 2025年
      if (year2025.some((year) => textContent.includes(year))) {
        element.style.color = "#6bd167";
      }

      // 2024年
      if (year2024.some((year) => textContent.includes(year))) {
        element.style.color = "#ee82ee";
      }
    });
  }

  // ----------------------------------------------------------------------------------------------------------------
  // 工具函数：播放量改色
  const COLOR_5K_10W = "#ee82ee"; // 紫色
  const COLOR_10W_100W = "#6bd167"; // 绿色
  const COLOR_100W_UP = "#ff4e4e"; // 红色

  function dyeFirstPlayCountElements() {
    const selector =
      "#metadata-line >span:nth-of-type(1)";
    const nodes = document.querySelectorAll(selector);

    nodes.forEach((element) => {
      const rawText = element.textContent.trim();
      const match = rawText.match(/^(\d+(?:\.\d+)?)\s*万?$/);
      if (!match) return; // 匹配不到就跳过

      let num = parseFloat(match[1]);
      if (rawText.includes("万")) num *= 10_000;

      if (num >= 1_000_000) {
        element.style.cssText = `color:${COLOR_100W_UP} !important`;
      } else if (num >= 10_000 && num < 1_000_000) {
        element.style.cssText = `color:${COLOR_10W_100W} !important`;
      } else if (num >= 5_000 && num < 10_000) {
        element.style.cssText = `color:${COLOR_5K_10W} !important`;
      } else {
        element.style.color = ""; // 小于 5k 恢复默认
      }
    });
  }

  // ----------------------------------------------------------------------------------------------------------------
  // 工具函数：时长改色
  function processDurationElements() {
    const durationElements = document.querySelectorAll(
      "badge-shape"
    );
    durationElements.forEach((element) => {
      const textContent = element.textContent.trim();
      const durationMatch = textContent.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
      if (durationMatch) {
        let totalSeconds = 0;
        if (durationMatch[3]) {
          // 如果有小时部分
          const hours = parseInt(durationMatch[1], 10);
          const minutes = parseInt(durationMatch[2], 10);
          const seconds = parseInt(durationMatch[3], 10);
          totalSeconds = hours * 3600 + minutes * 60 + seconds;
        } else {
          // 只有分钟和秒
          const minutes = parseInt(durationMatch[1], 10);
          const seconds = parseInt(durationMatch[2], 10);
          totalSeconds = minutes * 60 + seconds;
        }

        if (totalSeconds <= 300) {
          // 0-5分钟
          element.style.color = "#6bd167";
        } else if (totalSeconds > 300 && totalSeconds <= 900) {
          // 5-15分钟
          element.style.color = "#ee82ee";
        } else if (totalSeconds > 900 && totalSeconds <= 3600) {
          // 15-60分钟
          element.style.color = "white";
        } else {
          // 大于60分钟
          element.style.color = "#ff4e4e";
        }
      }
    });
  }

  // 初始运行
  processDateElements();
  dyeFirstPlayCountElements();
  processDurationElements();

  // 监听DOM变化
  const observer = new MutationObserver(() => {
    processDateElements();
    dyeFirstPlayCountElements();
    processDurationElements();
  });

  // 开始监听
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
})();
