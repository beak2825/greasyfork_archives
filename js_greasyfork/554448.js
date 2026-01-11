// ==UserScript==
// @name         根據番號快速搜尋 - 素人演員查詢擴展
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  為「根據番號快速搜尋」腳本加入素人演員多站查詢功能。需先安裝主腳本：https://sleazyfork.org/zh-TW/scripts/423350
// @author       你的名字 & AI Assistant
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sleazyfork.org
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554448/%E6%A0%B9%E6%93%9A%E7%95%AA%E8%99%9F%E5%BF%AB%E9%80%9F%E6%90%9C%E5%B0%8B%20-%20%E7%B4%A0%E4%BA%BA%E6%BC%94%E5%93%A1%E6%9F%A5%E8%A9%A2%E6%93%B4%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/554448/%E6%A0%B9%E6%93%9A%E7%95%AA%E8%99%9F%E5%BF%AB%E9%80%9F%E6%90%9C%E5%B0%8B%20-%20%E7%B4%A0%E4%BA%BA%E6%BC%94%E5%93%A1%E6%9F%A5%E8%A9%A2%E6%93%B4%E5%B1%95.meta.js
// ==/UserScript==

/*
 * ========================================
 * 根據番號快速搜尋 - 素人演員查詢擴展
 * ========================================
 *
 * 【版本】v0.7
 * 【更新】整合完整元數據與優化註解架構
 *
 * 【關於本擴展】
 * 這是一個為「根據番號快速搜尋」腳本開發的輔助擴展工具
 * 主要功能：在番號菜單中加入素人演員多站查詢按鈕
 *
 * 【前置需求】
 * ⚠️ 本擴展需配合主腳本使用，請先安裝：
 * 主腳本名稱：根據番號快速搜尋
 * 主腳本地址：https://sleazyfork.org/zh-TW/scripts/423350
 *
 * 【核心工作原理】
 * 1. 使用 MutationObserver 監測主腳本生成的 .sav-menu 菜單元素
 * 2. 從菜單的 dataset.av 屬性獲取番號
 * 3. 在 .savCloseMenu 關閉按鈕後面插入自定義按鈕
 * 4. 點擊按鈕後使用 GM_openInTab 同時打開多個搜尋網站
 *
 * 【設定方式】
 * 點擊 Tampermonkey 圖標 → 本腳本 → ⚙️ 焦點設定
 * 可選擇 3 種焦點模式：
 *   模式 1：第一個網站切換焦點，其他背景
 *   模式 2：全部背景開啟（推薦，默認）
 *   模式 3：全部切換焦點
 *
 * ========================================
 */

(function() {
    'use strict';

    console.log('[素人演員查詢擴展] 腳本已啟動');

    // ==================== 版本資訊 ====================

    const SCRIPT_VERSION = '0.7';
    const SCRIPT_NAME = '根據番號快速搜尋 - 素人演員查詢擴展';

    // ==================== 用戶自定義區域 ====================
    // 此區域的設定可以直接修改，不影響其他功能

    // 按鈕顯示名稱（可改成任何文字或 emoji）
    const BUTTON_NAME = '🔍 素人演員查詢';

    // 每個網站打開的延遲時間（毫秒）
    // 說明：設置延遲可避免瀏覽器的彈窗阻擋機制
    // 建議值：50ms (最快), 100ms (推薦), 200ms (保守)
    const OPEN_DELAY = 100;

    // 搜尋網站列表（可自行加入或修改）
    // 格式說明：["顯示名稱", "搜尋網址"]
    // 網址中的 %s 會被自動替換成番號
    const SEARCH_SITES = [
        ["素人Wiki", "https://shiroutowiki.work/?s=%s"],
        ["SiroWiki", "https://sirowiki.com/search/?keyword=%s"]
        // 範例：加入 Google
        // ["Google", "https://www.google.com/search?q=%s"]
    ];

    // ==================== 核心變數與設定 ====================

    // 焦點行為設定（從 GM_getValue 讀取，默認為模式2）
    // 可選值：1（第一個）、2（全部背景）、3（全部切換）
    let focusMode = GM_getValue('focusMode', 2);

    // 模式定義表
    const FOCUS_MODES = {
        1: { name: '第一個網站', behavior: 'firstOnly', icon: '🎯' },
        2: { name: '全部背景', behavior: 'none', icon: '🔕' },
        3: { name: '全部切換', behavior: 'all', icon: '🔔' }
    };

    // 已處理菜單的追蹤集合 (WeakSet 避免記憶體洩漏)
    const processedMenus = new WeakSet();

    // 主腳本檢查標記
    let mainScriptChecked = false;

    // ==================== 設定介面功能 ====================

    /**
     * 顯示設定對話框
     */
    function showSettingsDialog() {
        const currentMode = FOCUS_MODES[focusMode];
        const message = `請填入使用模式：
模式 1：第一個網站（第一個切換焦點，其他背景）
模式 2：全部背景（全部在背景開啟）⭐ 推薦
模式 3：全部切換（每個都切換焦點）
當前模式：${focusMode} - ${currentMode.name}
請輸入 1、2 或 3：`;

        const input = prompt(message, focusMode.toString());
        if (input === null) return;

        let newMode = parseInt(input.trim());

        // 驗證輸入
        if (isNaN(newMode) || newMode < 1 || newMode > 3) {
            if (input.trim() === '') {
                newMode = 2;
                alert('未輸入，已使用默認模式 2：全部背景');
            } else {
                alert('輸入無效！請輸入 1、2 或 3\n\n已保持當前設定');
                return;
            }
        }

        focusMode = newMode;
        GM_setValue('focusMode', focusMode);

        const selectedMode = FOCUS_MODES[newMode];
        showNotification(`${selectedMode.icon} 已切換為模式 ${newMode}：${selectedMode.name}`);
        console.log(`[設定] 焦點模式已更改為: ${newMode} - ${selectedMode.name}`);
    }

    /**
     * 顯示浮動通知訊息
     */
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; padding: 12px 24px; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 999999;
            font-family: Arial, sans-serif; font-size: 14px; font-weight: bold;
            animation: slideDown 0.3s ease-out; white-space: pre-line; text-align: center;
        `;
        notification.innerHTML = `${message}<style>@keyframes slideDown {from {transform: translateX(-50%) translateY(-50px);opacity: 0;}to {transform: translateX(-50%) translateY(0);opacity: 1;}}</style>`;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideDown 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }

    // 註冊油猴菜單命令
    GM_registerMenuCommand('⚙️ 焦點設定', showSettingsDialog);

    // ==================== 主腳本檢查功能 ====================

    /**
     * 檢查主腳本是否存在，若不存在則在控制台發出警告
     */
    function checkMainScript() {
        if (mainScriptChecked) return;
        mainScriptChecked = true;

        setTimeout(() => {
            const savDiv = document.querySelector('savdiv[data-av]');
            if (!savDiv) {
                console.warn('[提示] 未檢測到主腳本「根據番號快速搜尋」活動跡象。');
                console.warn('如果您尚未安裝，請訪問：https://sleazyfork.org/zh-TW/scripts/423350');
            } else {
                console.log('✅ 主腳本已就緒');
            }
        }, 3000);
    }

    // ==================== 按鈕加入功能 ====================

    /**
     * 為菜單加入自定義按鈕
     * @param {HTMLElement} menu - 主腳本生成的菜單元素
     */
    function addCustomButton(menu) {
        if (processedMenus.has(menu)) return;
        processedMenus.add(menu);

        // 獲取番號
        const avID = menu.dataset.av;
        if (!avID) return;

        // 尋找插入位置 (優先關閉按鈕旁，其次按鈕容器內)
        const closeButton = menu.querySelector('.savCloseMenu');
        const buttonContainer = menu.querySelector('avdivbutton');

        if (!closeButton && !buttonContainer) return;

        // 創建按鈕
        const customButton = document.createElement('avdiv');
        customButton.className = 'savlink myCustomButton'; // 繼承主腳本樣式
        customButton.textContent = BUTTON_NAME;
        customButton.title = `在 ${SEARCH_SITES.length} 個網站中搜尋 ${avID}`;
        customButton.style.cursor = 'pointer';

        // 點擊事件處理
        customButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const currentMode = FOCUS_MODES[focusMode];
            console.log(`[✓ 素人演員查詢] 番號: ${avID} (模式: ${currentMode.name})`);

            SEARCH_SITES.forEach((site, index) => {
                const [siteName, siteTemplate] = site;
                const siteURL = siteTemplate.replace('%s', avID);

                setTimeout(() => {
                    let shouldActivate = false;
                    switch(focusMode) {
                        case 1: shouldActivate = (index === 0); break;
                        case 2: shouldActivate = false; break;
                        case 3: shouldActivate = true; break;
                    }

                    GM_openInTab(siteURL, { active: shouldActivate, insert: true });
                }, index * OPEN_DELAY);
            });
        });

        // 插入 DOM
        if (closeButton) {
            closeButton.parentNode.insertBefore(customButton, closeButton.nextSibling);
        } else if (buttonContainer) {
            buttonContainer.appendChild(customButton);
        }
    }

    // ==================== DOM 監測功能 ====================

    /**
     * MutationObserver 監測頁面變動
     * 批次處理新增節點以優化效能
     */
    const observer = new MutationObserver((mutations) => {
        const menus = [];
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1 && node.classList && node.classList.contains('sav-menu')) {
                    menus.push(node);
                }
            }
        }
        if (menus.length > 0) {
            setTimeout(() => { menus.forEach(menu => addCustomButton(menu)); }, 100);
        }
    });

    function startObserving() {
        if (!document.body) return;

        // 啟動監測
        observer.observe(document.body, { childList: true, subtree: true });

        // 初始檢查 (處理頁面載入時已存在的選單)
        const existingMenus = document.querySelectorAll('.sav-menu');
        if (existingMenus.length > 0) {
            existingMenus.forEach(menu => addCustomButton(menu));
        }
    }

    // ==================== 腳本初始化 ====================

    if (document.body) {
        startObserving();
        checkMainScript();
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            startObserving();
            checkMainScript();
        }, { once: true });
    }

    console.log(`[素人演員查詢擴展] v${SCRIPT_VERSION} 準備就緒`);

})();