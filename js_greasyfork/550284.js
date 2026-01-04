// ==UserScript==
// @name        v2ex 脚本
// @namespace   github.com/Labolasya
// @match       https://*.v2ex.com/t/*
// @grant       none
// @version     1.1.1
// @author      Labolasya
// @license     MIT
// @description 功能：按喜欢排序 | 界面微调
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/550284/v2ex%20%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/550284/v2ex%20%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// main
(function () {
  "use strict";
  sortElements(
    ".box .cell[id]",
    "span.small.fade:has(img)",
    ".box:has(.cell[id]) > .cell:not([id])"
  );
  ui();
})();

function ui() {
  const element = document.querySelector(".outdated");
  element.textContent = element.textContent.replace(/(\d+)\s*天/g, function(match, p1) {
    // 将匹配到的天数转换为数字并计算成年数
    let days = parseInt(p1, 10);
    let years = (days / 365).toFixed(2); // 保留两位小数
    return `${years} 年`;
  });
}

// sortElements(selector_list, selector_number)
async function sortElements(
  selector_list,
  selector_number,
  selector_insertTarget
) {
  let arr = Array.from(document.querySelectorAll(selector_list)); // 将 NodeList 转换为数组

  // 排序逻辑 start
  arr.sort((a, b) => {
    const getNumber = (element) => {
      const span = element.querySelector(selector_number);
      if (span === null) return 0;
      return parseInt(span.textContent, 10) || 0; // 将文本内容转换为整数
    };

    const numberA = getNumber(a);
    const numberB = getNumber(b);
    return numberA - numberB; // 升序排序
  });
  // 排序逻辑 end

  // 按排序后顺序重新插入元素
  const insertEles = document.querySelectorAll(selector_insertTarget);
  const insertEle = insertEles.length == 1 ? insertEles[0] : insertEles[1];
  arr.forEach((a) => insertEle.insertAdjacentElement("afterend", a));
}