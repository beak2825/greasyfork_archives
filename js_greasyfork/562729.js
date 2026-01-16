// ==UserScript==
// @name         AJINER P.R.O. 延遲注入樣式並自動列印
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  強制阻止自動列印，延遲 5 秒注入 CSS 樣式，然後自動觸發列印。
// @author       You
// @match        https://pro.ajinerp.com/Common/PrintPage
// @grant        none
// @run-at       document-start    // 確保在網頁開始載入時就執行
// @downloadURL https://update.greasyfork.org/scripts/562729/AJINER%20PRO%20%E5%BB%B6%E9%81%B2%E6%B3%A8%E5%85%A5%E6%A8%A3%E5%BC%8F%E4%B8%A6%E8%87%AA%E5%8B%95%E5%88%97%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/562729/AJINER%20PRO%20%E5%BB%B6%E9%81%B2%E6%B3%A8%E5%85%A5%E6%A8%A3%E5%BC%8F%E4%B8%A6%E8%87%AA%E5%8B%95%E5%88%97%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DELAY_MS = 5000; // 延遲時間：5 秒

    // ----------------------------------------------------
    // 1. 樣式定義 (包含定位強化)
    // ----------------------------------------------------
    const customCSS = `
        /* 確保父元素設定相對定位，讓偽元素能正確定位 */
        table tr:nth-last-child(2) td[colspan="3"] {
            position: relative !important;
        }

        /* 字體大小規則 */
        td.bigfont {
            font-size: 26px !important;
        }
        td.bigfont > span {
            font-size: 14px !important;
        }

        /* 遮蔽規則與文字覆蓋規則 (新增 top/left 和 !important 以提高權重) */
        table tr:nth-last-child(2) td[colspan="3"]:before {
            content: "███████";
            color: #ffffff !important;
            position: absolute !important;

            letter-spacing: -0.5px !important;
        }
        table tr:nth-last-child(2) td[colspan="3"]:after {
            content: "gg" !important;
        }
    `;

    // ----------------------------------------------------
    // 2. 劫持 window.print() (需立即執行)
    // ----------------------------------------------------
    const originalPrint = window.print;

    // 使用 Object.defineProperty 強力覆蓋 window.print
    try {
        Object.defineProperty(window, 'print', {
            value: function() {
                // 攔截自動列印呼叫，不執行任何動作
                console.log('window.print() 被 Tampermonkey 攔截。');
            },
            writable: false,
            configurable: false
        });
    } catch (e) {
        // 簡單覆蓋作為備用方案
        window.print = function() {
            console.log('window.print() 被 Tampermonkey 攔截 (備用)。');
        };
    }

    // ----------------------------------------------------
    // 3. 等待頁面載入並延遲注入 CSS + 恢復列印 (主邏輯)
    // ----------------------------------------------------
    window.addEventListener('load', function() {
        console.log(`頁面載入完成，開始延遲 ${DELAY_MS / 1000} 秒注入樣式...`);

        setTimeout(function() {
            // A. 在延遲結束後，才進行 CSS 注入
            const styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.textContent = customCSS;

            // 插入到 body 結尾
            document.body.appendChild(styleElement);

            console.log('CSS 樣式已延遲注入。');

            // B. 恢復原始的 print 函數並立即呼叫列印
            if (Object.getOwnPropertyDescriptor(window, 'print') && Object.getOwnPropertyDescriptor(window, 'print').configurable === false) {
                // 如果是用 defineProperty 劫持的，直接呼叫原始函數
                originalPrint();
            } else {
                // 如果是用簡單覆蓋的方式，則先恢復再呼叫
                window.print = originalPrint;
                window.print();
            }

            console.log('✅ 延遲執行完成，樣式已注入，已自動觸發列印。');

        }, DELAY_MS); // 延遲 5 秒
    });
})();