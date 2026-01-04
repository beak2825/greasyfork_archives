// ==UserScript==
// @name         sorceryntax3裝備孔洞顏色高亮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  根據裝備孔洞數量改變顏色顯示
// @match        https://sorceryntax3.onrender.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555508/sorceryntax3%E8%A3%9D%E5%82%99%E5%AD%94%E6%B4%9E%E9%A1%8F%E8%89%B2%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/555508/sorceryntax3%E8%A3%9D%E5%82%99%E5%AD%94%E6%B4%9E%E9%A1%8F%E8%89%B2%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 顏色配置
    const COLOR_CONFIG = {
        0: {}, // 無孔洞，使用預設樣式
        1: { // 1個孔洞 - 紫色
            borderColor: '#8B5CF6', // 紫色
            textColor: '#C4B5FD',   // 淺紫色
            rarity: '稀有'
        },
        2: { // 2個孔洞 - 金色
            borderColor: '#F59E0B', // 金色
            textColor: '#FCD34D',   // 淺金色
            rarity: '史詩'
        },
        3: { // 3個孔洞 - 橙色
            borderColor: '#EA580C', // 橙色
            textColor: '#FDBA74',   // 淺橙色
            rarity: '傳說'
        },
        4: { // 4個孔洞及以上 - 紅色
            borderColor: '#DC2626', // 紅色
            textColor: '#FCA5A5',   // 淺紅色
            rarity: '神話'
        }
    };

    // 檢測孔洞數量的函數
    function getSocketCount(element) {
        // 查找孔洞指示器元素
        const socketIndicator = element.querySelector('.css-10sf1q0');
        if (!socketIndicator) return 0;

        // 計算✦符號的數量
        const filledSockets = socketIndicator.querySelectorAll('.css-hwqf06').length; // 已鑲嵌的孔
        const emptySockets = socketIndicator.querySelectorAll('.css-1lo8ipw').length; // 空孔

        return filledSockets + emptySockets;
    }

    // 應用樣式的函數
    function applyStyle(element, socketCount) {
        if (socketCount === 0) return; // 無孔洞不處理

        const config = COLOR_CONFIG[socketCount] || COLOR_CONFIG[4]; // 4個以上使用最高級配置

        // 應用到主元素
        element.style.border = `2px solid ${config.borderColor}`;
        element.style.borderRadius = '4px';
        element.style.padding = '2px';

        // 應用文字顏色
        const textElement = element.querySelector('p.css-9y6172');
        if (textElement) {
            textElement.style.color = config.textColor;
            textElement.style.fontWeight = 'bold';
        }

        // 添加提示文字（可選）
        element.title = `${config.rarity}裝備 - ${socketCount}個孔洞`;
    }

    // 觀察DOM變化
    function observeChanges() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // 元素節點
                        if (node.matches && node.matches('[data-scope="tooltip"][data-part="trigger"]')) {
                            processElement(node);
                        }
                        // 檢查子節點
                        const elements = node.querySelectorAll && node.querySelectorAll('[data-scope="tooltip"][data-part="trigger"]');
                        if (elements) {
                            elements.forEach(processElement);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 處理單個元素
    function processElement(element) {
        // 檢查是否已經處理過
        if (element.hasAttribute('data-socket-processed')) {
            return;
        }

        const socketCount = getSocketCount(element);
        applyStyle(element, socketCount);

        // 標記為已處理
        element.setAttribute('data-socket-processed', 'true');
    }

    // 初始化處理現有元素
    function init() {
        const elements = document.querySelectorAll('[data-scope="tooltip"][data-part="trigger"]');
        elements.forEach(processElement);

        // 開始觀察新元素
        observeChanges();
    }

    // 頁面載入完成後執行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();