// ==UserScript==
// @name         不太靈影視資源擷取
// @name:zh-TW   不太靈影視資源擷取
// @name:zh-CN   不太灵影视資源擷取
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  移除頁面上的VIP內容提示，並解除內容的模糊效果及點擊限制
// @description:zh-CN 移除頁面上的VIP內容提示，並解除內容的模糊效果及點擊限制
// @description:zh-TW 移除頁面上的VIP內容提示，並解除內容的模糊效果及點擊限制
// @author       Mark
// @match        https://web2.mukaku.com/mv/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547979/%E4%B8%8D%E5%A4%AA%E9%9D%88%E5%BD%B1%E8%A6%96%E8%B3%87%E6%BA%90%E6%93%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/547979/%E4%B8%8D%E5%A4%AA%E9%9D%88%E5%BD%B1%E8%A6%96%E8%B3%87%E6%BA%90%E6%93%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 選擇要移除的提示元素
    const overlaySelector = 'div[data-v-0dc0d6d1].vip-gate-overlay';

    // 選擇要解除模糊效果的內容元素
    const contentSelector = 'div[data-v-0dc0d6d1][style*="filter: blur"]';

    // 刪除提示元素並解除內容模糊
    function processElements() {
        // 移除 VIP 提示框
        const overlay = document.querySelector(overlaySelector);
        if (overlay) {
            overlay.remove();
            console.log('移除VIP內容提示成功');
        }

        // 解除內容模糊
        const content = document.querySelector(contentSelector);
        if (content) {
            content.removeAttribute('style');
            console.log('解除內容模糊效果成功');
        }
    }

    // 初始載入時執行一次
    processElements();

    // 使用 MutationObserver 監聽 DOM 變化，以應對動態載入的內容
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                processElements();
            }
        }
    });

    // 設定要監聽的目標節點和選項
    observer.observe(document.body, { childList: true, subtree: true });

})();