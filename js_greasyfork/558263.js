// ==UserScript==
// @name         Missav.ai 助手 v1.00
// @namespace    https://www.facebook.com/airlife917339
// @version      1.00
// @description  feel free to donate BTC: 1xb8F4x76ptN2H9MUAhZjvofKw2im1sdq
// @author       Kevin Chang
// @license      None
// @match        https://missav.ai/*
// @icon         https://missav.ai/img/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558263/Missavai%20%E5%8A%A9%E6%89%8B%20v100.user.js
// @updateURL https://update.greasyfork.org/scripts/558263/Missavai%20%E5%8A%A9%E6%89%8B%20v100.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 將以下載的影片標題 highlight
  function highlightElementsWithPredefinedList(predefinedList) {
    // 獲取所有需要處理的 <h6> 元素 my-2 text-sm text-nord4 truncate
    //const h6Elements = document.querySelectorAll('div.my-2.text-sm.text-nord4.truncate > a');
    const menu = document.querySelectorAll('div.my-2.text-sm.text-nord4.truncate > a');
    const title = document.querySelectorAll('div > div.flex-1.order-first > div.mt-4 > h1');
    const side = document.querySelectorAll('div.max-h-14.overflow-y-hidden.text-sm a.text-secondary');
    const h6Elements = [...menu, ...title, ...side];

    // 創建一個新的 <style> 元素
    const styleElement = document.createElement('style');

    // 定義 .highlighted 類的樣式
    const cssText = `
      .highlighted {
        background-color: red;
      }
    `;

    // 將樣式添加到 <style> 元素中
    styleElement.textContent = cssText;

    // 將 <style> 元素添加到文檔的 <head> 元素中
    document.head.appendChild(styleElement);

    // 遍歷每個 <h6> 元素，檢查其文本內容是否與預設列表中的項匹配
    h6Elements.forEach((h6Element) => {
      const text = h6Element.textContent.trim();

      // 使用正則表達式匹配帶有後綴的標識符，例如 "NHDTB-740B"
      const matches = text.match(/[A-Z0-9]+(?:-[A-Z0-9]+){1,2}/g);
      if (matches && matches.length > 0 && predefinedList.includes(matches[0])) {
        // 添加自定義的 class，改變背景顏色
        h6Element.classList.add('highlighted'); // 將 'highlighted' 替換為你自定義的 class 名稱
      }
    });
  }

  // 從 CSV URL 獲取數據並將其轉換為預定義列表
  async function getDataAndConvertToPredefinedList(csvUrl) {
    try {
      // 使用 fetch 函數獲取 CSV 數據
      const response = await fetch(csvUrl);

      // 將 CSV 數據轉換為文本格式
      const csvData = await response.text();

      // 將 CSV 數據解析為數組
      predefinedList = csvData.split(/\r?\n/);

      // 調用函數，傳入預設的列表
      highlightElementsWithPredefinedList(predefinedList);
    } catch (error) {
      console.error('Error fetching and converting data:', error);
    }
  }

  // 獲取當前網頁的 URL
  const currentUrl = window.location.href;

  // 使用 CSV URL 獲取數據並將其轉換為預定義列表
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQXUmxIo4wPfrrN0xDI4B-h_pe3k4EIZ-J-eE8LfUJoQzZpgkRyz_sOvsY5rvHo66fwoEndEREJOr9s/pub?gid=1410841251&single=true&output=csv';

  // 預設的列表
  let predefinedList = []; // 添加你的預設項

  // 獲取數據並將其轉換為預定義列表
  getDataAndConvertToPredefinedList(csvUrl);

})();