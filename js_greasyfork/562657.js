// ==UserScript==
// @name         InvestAnchors Navbar Remover (刪除導覽列)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  移除 investanchors.com 上的 navbar-default navbar-custom 元素
// @author       You
// @match        https://investanchors.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562657/InvestAnchors%20Navbar%20Remover%20%28%E5%88%AA%E9%99%A4%E5%B0%8E%E8%A6%BD%E5%88%97%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562657/InvestAnchors%20Navbar%20Remover%20%28%E5%88%AA%E9%99%A4%E5%B0%8E%E8%A6%BD%E5%88%97%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 設定目標 Class 選擇器
    const targetSelector = '.navbar.navbar-default.navbar-custom';

    // 1. CSS 隱藏法 (速度最快，防止閃爍)
    // 即使 JavaScript 執行稍慢，CSS 規則會強制該元素不顯示
    const style = document.createElement('style');
    style.innerHTML = `${targetSelector} { display: none !important; }`;
    document.head.appendChild(style);

    // 2. DOM 移除法 (徹底刪除)
    // 等待頁面載入後，實際將元素從結構中移除
    window.addEventListener('load', function() {
        const elements = document.querySelectorAll(targetSelector);
        elements.forEach(el => el.remove());
        console.log('InvestAnchors Navbar 已移除');
    });

})();