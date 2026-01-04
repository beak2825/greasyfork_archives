// ==UserScript==
// @name         Gemini 內文寬屏神器 V11.2 (Sidebar Fix)
// @namespace    http://tampermonkey.net/
// @version      11.2
// @description  基於 V11.1 修正：將「強制換行」的樣式限制在對話區域內，修復左側邊欄標題被錯誤換行的問題 (恢復為 ... 省略號)。核心功能：解除寬度限制、對話強制靠右、輸入框置中。
// @author       Gemini User
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/559460/Gemini%20%E5%85%A7%E6%96%87%E5%AF%AC%E5%B1%8F%E7%A5%9E%E5%99%A8%20V112%20%28Sidebar%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559460/Gemini%20%E5%85%A7%E6%96%87%E5%AF%AC%E5%B1%8F%E7%A5%9E%E5%99%A8%20V112%20%28Sidebar%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 1. 基礎 CSS 設定 ===
    const css = `
        /* [修正] 內容斷字設定 - 限制作用範圍 */
        /* 只針對右側主要內容區 (mat-sidenav-content) 應用換行規則 */
        /* 這樣就不會影響到左側邊欄 (mat-sidenav) 的標題顯示 */
        mat-sidenav-content .query-text-line, 
        mat-sidenav-content p, 
        mat-sidenav-content div, 
        mat-sidenav-content span, 
        mat-sidenav-content li {
            overflow-wrap: anywhere !important; /* 確保長亂碼 (1111...) 仍會換行 */
            word-break: normal !important;      /* 讓瀏覽器依據標準語法換行 (不切斷英文單字) */
            white-space: pre-wrap !important;   /* 保留原本的換行格式 */
        }
        
        /* 針對代碼區塊，保持原本的斷行邏輯 */
        pre, code {
            word-break: break-all !important; 
        }

        /* [保險] 強制左側邊欄文字不換行 */
        /* 確保標題過長時顯示 ... */
        mat-sidenav span, mat-sidenav div {
            white-space: nowrap !important;
            /* text-overflow: ellipsis !important; (Google 原本就有設，這裡不強制覆蓋以免影響排版) */
        }

        /* 輸入框保護：限制最大寬度並置中 */
        div[class*="input-area"], div[class*="bottom-bar"] {
             max-width: 900px !important;
             margin: 0 auto !important;
        }

        /* 側邊欄層級保護 */
        mat-sidenav { z-index: 9999 !important; }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // === 2. 核心邏輯：層層破防 (V11 破城槌) ===
    function fixLayout() {
        // 鎖定使用者輸入的文字行
        const textLines = document.querySelectorAll('.query-text-line');

        textLines.forEach(text => {
            let current = text;
            let bubble = null;

            // 往上遍歷 10 層父容器
            for (let i = 0; i < 10; i++) {
                if (!current.parentElement) break;
                current = current.parentElement;

                const tagName = current.tagName;

                // --- A. 尋找氣泡本體 ---
                if (!bubble) {
                    const style = window.getComputedStyle(current);
                    if ((style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') || 
                        current.classList.contains('user-query-container')) {
                        bubble = current;
                    }
                }

                // --- B. 解除寬度限制 ---
                // 只要不是最外層的系統框架，全部強制設為 100% 寬
                if (tagName !== 'BODY' && tagName !== 'HTML' && tagName !== 'MAIN' && tagName !== 'MAT-SIDENAV-CONTENT') {
                    current.style.maxWidth = 'none';
                    current.style.width = '100%';
                    current.style.marginLeft = '0';
                    current.style.marginRight = '0';
                    current.style.paddingLeft = '0';
                    current.style.paddingRight = '0';
                    current.style.alignItems = 'stretch'; // 針對 Flex 容器
                }
            }

            // --- C. 使用者氣泡整形 ---
            if (bubble) {
                // 設定氣泡樣式：靠右 + 90% 寬
                bubble.style.width = 'auto';
                bubble.style.maxWidth = '90%'; 
                bubble.style.minWidth = '50%';
                
                // 強制推向右邊
                bubble.style.marginLeft = 'auto'; 
                bubble.style.marginRight = '20px'; // 右側留白
                
                // 顯示設定
                bubble.style.display = 'block';
                bubble.style.borderRadius = '12px';
                
                // 確保氣泡的父容器也允許靠右排列
                if (bubble.parentElement) {
                    bubble.parentElement.style.display = 'flex';
                    bubble.parentElement.style.flexDirection = 'column';
                    bubble.parentElement.style.alignItems = 'flex-end';
                }
            }
        });
    }

    // === 3. 執行 ===
    setInterval(fixLayout, 1000);

})();