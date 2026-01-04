// ==UserScript==
// @name         巴哈姆特置頂切換
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  預設隱藏置頂標題並提供切換功能
// @author       Dxzy
// @match        https://forum.gamer.com.tw/B.php?*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551906/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E7%BD%AE%E9%A0%82%E5%88%87%E6%8F%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/551906/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E7%BD%AE%E9%A0%82%E5%88%87%E6%8F%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 創建切換按鈕樣式(左上定位)
    GM_addStyle(`
        .sticky-toggle-btn {
            position: fixed;
            top: 60px;
            left: 20px;
            z-index: 9999;
            padding: 8px 12px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
    `);

    // 創建切換按鈕
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'sticky-toggle-btn';
    toggleBtn.textContent = '置頂';
    document.body.appendChild(toggleBtn);

    // 初始化隱藏置頂元素
    const stickyElements = document.querySelectorAll(
        'form > .b-imglist-wrap03.b-list-wrap > .b-list > tbody > tr.b-list__row--sticky.b-list__row'
    );
    stickyElements.forEach(el => {
        el.style.display = 'none';
        el.style.visibility = 'collapse';
    });

    // 切換功能
    let isStickyVisible = false;
    function toggleSticky() {
        stickyElements.forEach(el => {
            el.style.display = isStickyVisible ? 'none' : 'table-row';
            el.style.visibility = isStickyVisible ? 'collapse' : 'visible';
        });
        isStickyVisible = !isStickyVisible;
    }

    // 綁定按鈕點擊事件
    toggleBtn.addEventListener('click', toggleSticky);
})();
