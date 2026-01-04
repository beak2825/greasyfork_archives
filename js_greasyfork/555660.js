// ==UserScript==
// @name         天遊二次元論壇簽到狀態檢測
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在天遊簽到頁面自動檢測今日是否已簽到，並以視覺提示標記狀態（支援簡繁體）
// @author       You
// @match        https://www.tiangal.com/zh-tw/sign.html
// @match        https://www.tiangal.com/zh-tw/sign.html?lang=redirected
// @match        https://www.tiangal.com/zh-cn/sign.html
// @icon         https://www.tiangal.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555660/%E5%A4%A9%E9%81%8A%E4%BA%8C%E6%AC%A1%E5%85%83%E8%AB%96%E5%A3%87%E7%B0%BD%E5%88%B0%E7%8B%80%E6%85%8B%E6%AA%A2%E6%B8%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/555660/%E5%A4%A9%E9%81%8A%E4%BA%8C%E6%AC%A1%E5%85%83%E8%AB%96%E5%A3%87%E7%B0%BD%E5%88%B0%E7%8B%80%E6%85%8B%E6%AA%A2%E6%B8%AC.meta.js
// ==/UserScript==

/**
 * 【腳本功能說明】
 *
 * 此腳本用於天遊二次元論壇的簽到頁面，自動判斷用戶今日是否已完成簽到。
 *
 * 【實現原理】
 * 1. 從頁面中提取兩個日期資訊：
 *    - 「當前時間」/「当前时间」：系統當前日期（格式：YYYY-MM-DD）
 *    - 「上次簽到」/「上次签到」：用戶最後一次簽到的日期（格式：YYYY-MM-DD）
 *
 * 2. 比對兩個日期：
 *    - 日期相同 → 今日已簽到 → 顯示綠色「✓ 已簽到」標籤
 *    - 日期不同 → 今日未簽到 → 顯示紅色「⚠ 尚未簽到」標籤（帶脈衝動畫）
 *
 * 【技術細節】
 * - 使用正則表達式提取日期字串（兼容簡繁體中文）
 * - 不修改原始 DOM 元素樣式，僅在後方插入提示標籤
 * - 採用半透明背景色適配深色主題
 * - 包含自動重試機制，應對動態載入內容
 *
 * 【更新日誌】
 * v1.1 (2025-10-26)
 * - 修復簡繁體混用導致無法識別的問題
 * - 增強正則表達式兼容性
 * - 優化錯誤提示信息
 *
 * 【DOM 結構參考】
 * 原始頁面結構（簡繁體混合）：
 * <span>873天，当前时间：2025-10-26 00:03:36，上次签到</span>
 * <span id="signtime">2025-10-25 00:05:16</span>
 *
 * 腳本執行後：
 * <span>873天，当前时间：2025-10-26 00:03:36，上次签到</span>
 * <span id="signtime">2025-10-25 00:05:16</span>
 * <span style="...">⚠ 尚未簽到</span>  ← 新增的狀態標籤
 */

(function() {
    'use strict';

    /**
     * 語言檢測函數（用於調試）
     * @returns {object} 包含語言檢測結果的對象
     */
    function detectLanguage() {
        const bodyText = document.body.textContent;
        const hasSimplified = bodyText.includes('当前时间') || bodyText.includes('签到');
        const hasTraditional = bodyText.includes('當前時間') || bodyText.includes('簽到');

        console.log('[簽到檢測] 語言檢測 - 簡體:', hasSimplified, '繁體:', hasTraditional);

        return {
            hasSimplified,
            hasTraditional,
            isMixed: hasSimplified && hasTraditional
        };
    }

    /**
     * 主初始化函數
     * @returns {boolean} 成功返回 true，失敗返回 false
     */
    function init() {
        // ===== 步驟 0：語言檢測 =====
        const langInfo = detectLanguage();
        if (langInfo.isMixed) {
            console.log('[簽到檢測] ⚠️ 檢測到簡繁體混用，已啟用兼容模式');
        }

        // ===== 步驟 1：定位 DOM 元素 =====

        // 選擇器1：包含「當前時間」/「当前时间」資訊的 span 元素
        // 此元素顯示格式：「XXX天，当前时间：YYYY-MM-DD HH:MM:SS，上次签到」
        const infoSpan = document.querySelector(
            'body > section > div.pagewrapper.clearfix > div > div.article-content > div > div:nth-child(2) > div.mission-always-settings > div:nth-child(1) > span:nth-child(4)'
        );

        // 選擇器2：#signtime 元素
        // 此元素顯示格式：「YYYY-MM-DD HH:MM:SS」（上次簽到的完整時間）
        const signTimeElement = document.querySelector('#signtime');

        // 檢查元素是否存在
        if (!infoSpan || !signTimeElement) {
            console.log('[簽到檢測] 找不到目標元素，稍後重試...');
            return false;
        }

        // ===== 步驟 2：提取「當前時間」的日期部分 =====

        const infoText = infoSpan.textContent.trim();
        console.log('[簽到檢測] 信息文字:', infoText);

        // 使用正則表達式匹配「當前時間」或「当前时间」後面的日期
        // 正則說明：
        // - [当當] → 匹配簡體「当」或繁體「當」
        // - 前 → 匹配「前」字
        // - [时時] → 匹配簡體「时」或繁體「時」
        // - [间間] → 匹配簡體「间」或繁體「間」
        // - [：:] → 匹配中英文冒號
        // - \s* → 匹配任意空白字符
        // - (\d{4}-\d{2}-\d{2}) → 捕獲 YYYY-MM-DD 格式的日期
        const currentTimeMatch = infoText.match(/[当當]前[时時][间間][：:]\s*(\d{4}-\d{2}-\d{2})/);

        if (!currentTimeMatch) {
            console.error('[簽到檢測] ❌ 無法提取當前時間');
            console.error('[簽到檢測] 調試信息 - 原始文本:', infoText);
            console.error('[簽到檢測] 請檢查頁面是否改版或網絡問題');
            return false;
        }

        const currentDate = currentTimeMatch[1]; // 例如: "2025-10-26"
        console.log('[簽到檢測] ✅ 當前日期:', currentDate);

        // ===== 步驟 3：提取「上次簽到」的日期部分 =====

        const signTimeText = signTimeElement.textContent.trim();
        console.log('[簽到檢測] 簽到時間文字:', signTimeText);

        // 使用正則表達式匹配日期部分
        // 正則說明：(\d{4}-\d{2}-\d{2}) → 捕獲 YYYY-MM-DD 格式
        const signDateMatch = signTimeText.match(/(\d{4}-\d{2}-\d{2})/);

        if (!signDateMatch) {
            console.error('[簽到檢測] ❌ 無法提取簽到日期');
            console.error('[簽到檢測] 調試信息 - 原始文本:', signTimeText);
            return false;
        }

        const signDate = signDateMatch[1]; // 例如: "2025-10-25"
        console.log('[簽到檢測] ✅ 簽到日期:', signDate);

        // ===== 步驟 4：比對日期並顯示狀態標籤 =====

        // 檢查是否已經添加過狀態標籤（避免重複執行）
        if (signTimeElement.nextSibling && signTimeElement.nextSibling.classList &&
            signTimeElement.nextSibling.classList.contains('tiangal-signin-status')) {
            console.log('[簽到檢測] 狀態標籤已存在，跳過');
            return true;
        }

        const statusBadge = document.createElement('span');
        statusBadge.className = 'tiangal-signin-status'; // 添加類名，用於防止重複添加

        if (currentDate === signDate) {
            // --- 情況 A：日期相同，今日已簽到 ---

            statusBadge.textContent = '✓ 已簽到';
            statusBadge.style.cssText = `
                background-color: rgba(76, 175, 80, 0.15);  /* 半透明綠色背景 */
                color: #4CAF50;                              /* 綠色文字 */
                padding: 4px 12px;
                border-radius: 4px;
                font-weight: bold;
                margin-left: 8px;
                display: inline-block;
                border: 1px solid rgba(76, 175, 80, 0.3);   /* 綠色邊框 */
                box-shadow: 0 2px 4px rgba(76, 175, 80, 0.1);
                transition: all 0.2s ease;
            `;

            console.log('[簽到檢測] ✅ 狀態: 今日已簽到');

        } else {
            // --- 情況 B：日期不同，今日未簽到 ---

            statusBadge.textContent = '⚠ 尚未簽到';
            statusBadge.style.cssText = `
                background-color: rgba(255, 87, 34, 0.15);  /* 半透明紅色背景 */
                color: #FF5722;                              /* 紅色文字 */
                padding: 4px 12px;
                border-radius: 4px;
                font-weight: bold;
                margin-left: 8px;
                display: inline-block;
                border: 1px solid rgba(255, 87, 34, 0.3);   /* 紅色邊框 */
                animation: tiangal-pulse 2s infinite;        /* 脈衝動畫 */
                box-shadow: 0 2px 4px rgba(255, 87, 34, 0.1);
                transition: all 0.2s ease;
            `;

            console.log('[簽到檢測] ⚠️ 狀態: 今日尚未簽到');
        }

        // Hover 效果
        statusBadge.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
        });

        statusBadge.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = currentDate === signDate
                ? '0 2px 4px rgba(76, 175, 80, 0.1)'
                : '0 2px 4px rgba(255, 87, 34, 0.1)';
        });

        // 將狀態標籤插入到 #signtime 元素後面
        signTimeElement.parentNode.insertBefore(statusBadge, signTimeElement.nextSibling);

        // ===== 步驟 5：添加 CSS 動畫 =====

        // 檢查是否已經添加過樣式（避免重複添加）
        if (!document.getElementById('tiangal-signin-style')) {
            const style = document.createElement('style');
            style.id = 'tiangal-signin-style';
            style.textContent = `
                @keyframes tiangal-pulse {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.7;
                        transform: scale(1.02);
                    }
                }

                /* 響應式設計：在小螢幕上調整樣式 */
                @media (max-width: 768px) {
                    .tiangal-signin-status {
                        display: block !important;
                        margin-left: 0 !important;
                        margin-top: 6px !important;
                        font-size: 12px !important;
                        padding: 3px 10px !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        return true; // 執行成功
    }

    // ===== 主執行邏輯 =====

    /**
     * 根據頁面載入狀態選擇執行策略
     *
     * 策略說明：
     * 1. 如果頁面還在載入中（loading）：等待 DOMContentLoaded 事件
     * 2. 如果頁面已載入完成：立即嘗試執行，並設置重試機制
     *
     * 重試機制：
     * - 每 500ms 嘗試一次
     * - 最多嘗試 10 次（共 5 秒）
     * - 一旦成功就停止重試
     */
    if (document.readyState === 'loading') {
        // 頁面還在載入，等待 DOM 完全解析
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(init, 500); // 延遲 500ms 再執行，確保內容已渲染
        });
    } else {
        // 頁面已經載入完成，設置重試機制
        let attempts = 0;           // 當前嘗試次數
        const maxAttempts = 10;     // 最大嘗試次數

        const interval = setInterval(() => {
            attempts++;

            // 執行初始化函數
            const success = init();

            // 如果成功或達到最大嘗試次數，停止重試
            if (success || attempts >= maxAttempts) {
                clearInterval(interval);

                if (!success && attempts >= maxAttempts) {
                    console.error('[簽到檢測] ❌ 達到最大重試次數，停止嘗試');
                    console.error('[簽到檢測] 💡 建議：請檢查頁面結構是否改版');
                } else if (success) {
                    console.log('[簽到檢測] ✅ 初始化成功，共嘗試', attempts, '次');
                }
            }
        }, 500); // 每 500ms 重試一次
    }

    console.log('[簽到檢測] 🚀 天遊論壇腳本已載入 v1.1 (支援簡繁體)');
})();