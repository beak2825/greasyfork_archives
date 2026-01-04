// ==UserScript==
// @name         HDEX TW 助手 v1.00
// @namespace    https://www.facebook.com/airlife917339
// @version      1.00
// @description  feel free to donate BTC: 1xb8F4x76ptN2H9MUAhZjvofKw2im1sdq
// @author       Kevin Chang
// @license      None
// @match        https://hdex.com.tw/*
// @icon         https://hdex.com.tw/img/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558264/HDEX%20TW%20%E5%8A%A9%E6%89%8B%20v100.user.js
// @updateURL https://update.greasyfork.org/scripts/558264/HDEX%20TW%20%E5%8A%A9%E6%89%8B%20v100.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 找到所有 price__sale 區塊
document.querySelectorAll('.price__sale').forEach(section => {
    const regularEl = section.querySelector('.price-item.price-item--regular');
    const saleEl = section.querySelector('.price-item.price-item--sale.price-item--last');

    if (!regularEl || !saleEl) return;

    // 取數字：去掉 $, 逗號等符號
    const regular = parseFloat(regularEl.textContent.replace(/[^0-9.]/g, ''));
    const sale = parseFloat(saleEl.textContent.replace(/[^0-9.]/g, ''));

    // 計算折數 (例如：3480 / 4350 = 0.8 = 8 折)
    const discountRate = sale / regular;
    const discountText = (discountRate * 100).toFixed(2) + '%'; // 幾折（百分比）
    const offText = ((1 - discountRate) * 100).toFixed(2) + '% OFF';

    console.log(`原價: ${regular}, 售價: ${sale} → 折扣: ${discountText} / ${offText}`);

    //（可選）直接加到網頁顯示
    const display = document.createElement('div');
    display.style.color = 'red';
    display.textContent = `Discount: ${offText}`;
    section.appendChild(display);
});

})();