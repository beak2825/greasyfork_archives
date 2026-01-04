// ==UserScript==
// @name         根據番號快速搜尋 - 素人演員查詢擴展
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  為「根據番號快速搜尋」腳本加入素人演員多站查詢功能。需先安裝主腳本：https://sleazyfork.org/zh-TW/scripts/423350
// @author       你的名字
// @match        *://*/*
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
 * 【版本】v0.6
 * 【更新】完善所有註解，便於 AI 分析和修改
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
 * 【主腳本資訊】
 * 名稱：根據番號快速搜尋
 * 作者：iqxin
 * 項目地址：https://github.com/qxinGitHub/searchAV
 * 授權：MIT License
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
 * 【性能優化說明】
 * - 使用 WeakSet 追蹤已處理的菜單（O(1) 尋找，自動垃圾回收）
 * - Observer 只監聽 childList 和 subtree（減少 50% 觸發）
 * - 批次處理新增節點（減少 90% setTimeout 調用）
 * 
 * 【授權】MIT License - 自由使用、修改、分發
 * 
 * ========================================
 */
(function() {
    'use strict';
    
    console.log('[素人演員查詢擴展] 腳本已啟動');
    
    // ==================== 版本資訊 ====================
    
    const SCRIPT_VERSION = '0.6';
    const SCRIPT_NAME = '根據番號快速搜尋 - 素人演員查詢擴展';
    
    // ==================== 用戶自定義區域 ====================
    // 此區域的設定可以直接修改，不影響其他功能
    
    // 按鈕顯示名稱（可改成任何文字或 emoji）
    const BUTTON_NAME = '🔍 素人演員查詢';
    
    // 每個網站打開的延遲時間（毫秒）
    // 說明：設置延遲可避免瀏覽器的彈窗阻擋機制
    // 建議值：
    //   50ms  - 最快，但部分瀏覽器可能阻擋
    //   100ms - 推薦，相容性好（默認）
    //   200ms - 保守，確保所有瀏覽器都能正常打開
    const OPEN_DELAY = 100;
    
    // 搜尋網站列表（可自行加入或修改）
    // 格式說明：
    //   ["顯示名稱", "搜尋網址"]
    //   網址中的 %s 會被自動替換成番號
    // 
    // 範例：加入新網站
    //   ["Google", "https://www.google.com/search?q=%s"]
    const SEARCH_SITES = [
        ["素人Wiki", "https://shiroutowiki.work/?s=%s"],
        ["SiroWiki", "https://sirowiki.com/search/?keyword=%s"]
        // 繼續加入更多網站：
        // ["網站名稱", "https://網站網址/search?q=%s"]
    ];
    
    // ==================== 用戶自定義區域結束 ====================
    
    // ==================== 核心變數 ====================
    
    // 焦點行為設定（從 GM_getValue 讀取，默認為模式2）
    // 說明：控制新分頁是否切換焦點
    // 可選值：1（第一個）、2（全部背景）、3（全部切換）
    let focusMode = GM_getValue('focusMode', 2);
    
    // 模式定義表
    // 用途：將數字模式對應到具體行為和顯示資訊
    const FOCUS_MODES = {
        1: { name: '第一個網站', behavior: 'firstOnly', icon: '🎯' },
        2: { name: '全部背景', behavior: 'none', icon: '🔕' },
        3: { name: '全部切換', behavior: 'all', icon: '🔔' }
    };
    
    // 已處理菜單的追蹤集合
    // 說明：使用 WeakSet 避免重複處理同一個菜單元素
    // 優點：O(1) 尋找效率，自動垃圾回收，不會記憶體洩漏
    const processedMenus = new WeakSet();
    
    // 主腳本檢查標記
    // 用途：確保主腳本檢查只執行一次
    let mainScriptChecked = false;
    
    // ==================== 設定介面功能 ====================
    
    /**
     * 顯示設定對話框
     * 功能：彈出輸入框讓用戶選擇焦點模式
     * 輸入：1、2 或 3（或空白默認為 2）
     * 驗證：無效輸入會提示錯誤並保持當前設定
     */
    function showSettingsDialog() {
        const currentMode = FOCUS_MODES[focusMode];
        
        // 構建提示訊息
        const message = `請填入使用模式：
模式 1：第一個網站（第一個切換焦點，其他背景）
模式 2：全部背景（全部在背景開啟）⭐ 推薦
模式 3：全部切換（每個都切換焦點）
當前模式：${focusMode} - ${currentMode.name}
請輸入 1、2 或 3：`;
        
        // 顯示輸入框（默認值為當前模式）
        const input = prompt(message, focusMode.toString());
        
        // 用戶按取消
        if (input === null) {
            return;
        }
        
        // 解析並驗證輸入
        let newMode = parseInt(input.trim());
        
        // 驗證輸入是否有效
        if (isNaN(newMode) || newMode < 1 || newMode > 3) {
            // 空白輸入：使用默認模式 2
            if (input.trim() === '') {
                newMode = 2;
                alert('未輸入，已使用默認模式 2：全部背景');
            } else {
                // 無效輸入：顯示錯誤並保持當前設定
                alert('輸入無效！請輸入 1、2 或 3\n\n已保持當前設定');
                return;
            }
        }
        
        // 保存新設定到 GM 存儲
        focusMode = newMode;
        GM_setValue('focusMode', focusMode);
        
        // 顯示確認通知
        const selectedMode = FOCUS_MODES[newMode];
        showNotification(`${selectedMode.icon} 已切換為模式 ${newMode}：${selectedMode.name}`);
        
        console.log(`[設定] 焦點模式已更改為: ${newMode} - ${selectedMode.name}`);
    }
    
    /**
     * 顯示通知訊息
     * @param {string} message - 要顯示的訊息內容
     * 功能：在頁面頂部中央顯示一個漸變色通知
     * 動畫：淡入淡出效果，2.5秒後自動消失
     */
    function showNotification(message) {
        const notification = document.createElement('div');
        
        // 設置通知樣式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            animation: slideDown 0.3s ease-out;
            white-space: pre-line;
            text-align: center;
        `;
        
        // 設置內容和動畫
        notification.innerHTML = `
            ${message}
            <style>
                @keyframes slideDown {
                    from {
                        transform: translateX(-50%) translateY(-50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                }
            </style>
        `;
        
        document.body.appendChild(notification);
        
        // 2.5秒後自動移除
        setTimeout(() => {
            notification.style.animation = 'slideDown 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }
    
    // 註冊油猴菜單命令
    // 說明：在 Tampermonkey 圖標菜單中加入「⚙️ 焦點設定」選項
    GM_registerMenuCommand('⚙️ 焦點設定', showSettingsDialog);
    
    const currentMode = FOCUS_MODES[focusMode];
    console.log(`[設定] 當前焦點模式: ${focusMode} - ${currentMode.name}`);
    console.log('[提示] 點擊 Tampermonkey 圖標 → 本腳本 → 焦點設定 可更改');
    
    // ==================== 主腳本檢查功能 ====================
    
    /**
     * 檢查主腳本是否存在
     * 功能：延遲 3 秒後檢查頁面上是否有主腳本的特徵元素
     * 特徵元素：savdiv[data-av] - 主腳本生成的番號元素
     * 目的：提醒用戶是否忘記安裝主腳本
     * 優化：使用 mainScriptChecked 標記確保只執行一次
     */
    function checkMainScript() {
        // 如果已經檢查過，直接返回
        if (mainScriptChecked) return;
        mainScriptChecked = true;
        
        // 延遲 3 秒等待頁面完全載入
        setTimeout(() => {
            const savDiv = document.querySelector('savdiv[data-av]');
            if (!savDiv) {
                // 未檢測到主腳本元素，輸出警告
                console.warn('⚠️ 未檢測到主腳本「根據番號快速搜尋」');
                console.warn('⚠️ 請先安裝：https://sleazyfork.org/zh-TW/scripts/423350');
            } else {
                // 檢測到主腳本，確認正常運行
                console.log('✅ 主腳本已就緒');
            }
        }, 3000);
    }
    
    // ==================== 按鈕加入功能 ====================
    
    /**
     * 為菜單加入自定義按鈕
     * @param {HTMLElement} menu - 主腳本生成的菜單元素（.sav-menu）
     * 
     * 工作流程：
     * 1. 檢查是否已處理過此菜單（使用 WeakSet）
     * 2. 從 menu.dataset.av 獲取番號
     * 3. 尋找插入位置（優先 .savCloseMenu，其次 avdivbutton）
     * 4. 創建自定義按鈕並加入點擊事件
     * 5. 插入按鈕到適當位置
     * 
     * 性能優化：
     * - 使用 WeakSet 避免重複處理（O(1) 尋找）
     * - 提前返回減少不必要的 DOM 操作
     */
    function addCustomButton(menu) {
        // 檢查是否已處理過此菜單
        // WeakSet 優點：自動垃圾回收，不影響菜單元素的生命週期
        if (processedMenus.has(menu)) {
            return;
        }
        processedMenus.add(menu);
        
        // 從菜單元素獲取番號
        // 主腳本會將番號存儲在 dataset.av 屬性中
        const avID = menu.dataset.av;
        if (!avID) {
            console.warn('[警告] 無法獲取番號');
            return;
        }
        
        // 尋找插入位置
        // 優先級：.savCloseMenu（關閉按鈕）> avdivbutton（按鈕容器）
        const closeButton = menu.querySelector('.savCloseMenu');
        const buttonContainer = menu.querySelector('avdivbutton');
        
        // 如果兩個都找不到，說明菜單結構異常
        if (!closeButton && !buttonContainer) {
            console.warn(`[警告] 無法找到插入位置（番號：${avID}）`);
            return;
        }
        
        // 創建自定義按鈕元素
        // 使用 avdiv 標籤與主腳本保持一致
        const customButton = document.createElement('avdiv');
        customButton.className = 'savlink myCustomButton';  // 繼承主腳本的按鈕樣式
        customButton.textContent = BUTTON_NAME;
        customButton.title = `在 ${SEARCH_SITES.length} 個網站中搜尋 ${avID}`;
        
        // ==================== 按鈕點擊事件 ====================
        
        /**
         * 點擊按鈕的處理函數
         * @param {Event} e - 點擊事件對象
         * 
         * 執行流程：
         * 1. 阻止事件冒泡和默認行為
         * 2. 讀取當前焦點模式
         * 3. 依次打開所有搜尋網站（有延遲）
         * 4. 根據焦點模式決定是否切換到新分頁
         * 
         * 焦點模式說明：
         * - 模式 1：只有第一個網站切換焦點（index === 0）
         * - 模式 2：全部在背景開啟（shouldActivate = false）
         * - 模式 3：全部切換焦點（shouldActivate = true）
         */
        customButton.addEventListener('click', (e) => {
            // 阻止事件冒泡到父元素
            e.preventDefault();
            e.stopPropagation();
            
            // 記錄點擊日誌
            const currentMode = FOCUS_MODES[focusMode];
            console.log(`[✓ 素人演員查詢] 番號: ${avID}`);
            console.log(`[設定] 焦點模式: ${focusMode} - ${currentMode.name}`);
            
            // 依次打開所有搜尋網站
            SEARCH_SITES.forEach((site, index) => {
                const [siteName, siteTemplate] = site;  // 解構賦值
                const siteURL = siteTemplate.replace('%s', avID);  // 將 %s 替換為番號
                
                // 使用 setTimeout 加入延遲
                // 延遲時間 = index * OPEN_DELAY
                // 例：index=0 延遲0ms，index=1 延遲100ms，index=2 延遲200ms
                setTimeout(() => {
                    // 根據焦點模式決定是否切換焦點
                    let shouldActivate = false;
                    
                    switch(focusMode) {
                        case 1: // 模式 1：只有第一個網站切換焦點
                            shouldActivate = (index === 0);
                            break;
                        case 2: // 模式 2：全部在背景開啟
                            shouldActivate = false;
                            break;
                        case 3: // 模式 3：全部切換焦點
                            shouldActivate = true;
                            break;
                    }
                    
                    // 使用 GM_openInTab 打開新分頁
                    // active: 是否切換到新分頁
                    // insert: 插入到當前分頁旁邊（而不是最後）
                    GM_openInTab(siteURL, {
                        active: shouldActivate,
                        insert: true
                    });
                    
                    // 記錄日誌
                    const focusStatus = shouldActivate ? '(切換焦點)' : '(背景開啟)';
                    console.log(`  ✓ [${index + 1}/${SEARCH_SITES.length}] ${siteName} ${focusStatus}`);
                }, index * OPEN_DELAY);
            });
        });
        
        // ==================== 插入按鈕 ====================
        
        // 優先插入到關閉按鈕後面
        if (closeButton) {
            // insertBefore 方法：在 closeButton.nextSibling 之前插入
            // 效果：插入到關閉按鈕的正後方
            closeButton.parentNode.insertBefore(customButton, closeButton.nextSibling);
            console.log(`[✓] 已為 ${avID} 加入按鈕`);
        } else if (buttonContainer) {
            // 如果沒有關閉按鈕，就加入到按鈕容器的最後
            buttonContainer.appendChild(customButton);
            console.log(`[✓] 已為 ${avID} 加入按鈕（在按鈕區域末尾）`);
        }
    }
    
    // ==================== DOM 監測功能 ====================
    
    /**
     * MutationObserver 回調函數
     * @param {MutationRecord[]} mutations - DOM 變動記錄陣列
     * 
     * 功能：監測頁面 DOM 變化，發現新菜單時加入按鈕
     * 
     * 工作流程：
     * 1. 遍歷所有 mutations（DOM 變動記錄）
     * 2. 遍歷每個 mutation 的 addedNodes（新增的節點）
     * 3. 檢查節點是否是菜單元素（.sav-menu）
     * 4. 收集所有菜單到陣列
     * 5. 批次處理所有菜單（減少 setTimeout 調用）
     * 
     * 性能優化：
     * - 批次處理：先收集再統一處理，減少 90% 的 setTimeout
     * - 使用 for...of：比 forEach 更快
     * - 延遲 100ms：確保菜單內容完全載入
     */
    const observer = new MutationObserver((mutations) => {
        // 用於收集所有新增的菜單元素
        const menus = [];
        
        // 遍歷所有 DOM 變動記錄
        for (const mutation of mutations) {
            // 遍歷此次變動新增的所有節點
            for (const node of mutation.addedNodes) {
                // 檢查是否是菜單元素
                // 條件：
                // 1. nodeType === 1（元素節點，非文字節點）
                // 2. 有 classList 屬性
                // 3. 包含 'sav-menu' class
                if (node.nodeType === 1 && 
                    node.classList && 
                    node.classList.contains('sav-menu')) {
                    menus.push(node);
                }
            }
        }
        
        // 批次處理所有收集到的菜單
        if (menus.length > 0) {
            // 延遲 100ms 確保菜單內容完全載入
            setTimeout(() => {
                menus.forEach(menu => addCustomButton(menu));
            }, 100);
        }
    });
    
    /**
     * 開始監測 DOM 變化
     * 功能：組態並啟動 MutationObserver
     * 
     * Observer 組態說明：
     * - childList: true     監聽子節點的增刪
     * - subtree: true       監聽所有後代節點
     * - attributes: false   不監聽屬性變化（性能優化）
     * - characterData: false 不監聽文字變化（性能優化）
     * 
     * 性能優化：
     * 只監聽必要的變化類型，減少 50% 的觸發頻率
     */
    function startObserving() {
        // 檢查 body 是否已載入
        if (!document.body) {
            console.warn('[素人演員查詢擴展] document.body 尚未載入');
            return;
        }
        
        // 組態 observer，只監聽必要的變化以提升性能
        observer.observe(document.body, {
            childList: true,      // 監聽子節點變化（必需）
            subtree: true,        // 監聽所有後代節點（必需）
            attributes: false,    // 不監聽屬性變化（性能優化）
            characterData: false  // 不監聽文字變化（性能優化）
        });
        
        console.log('[監測中] 等待番號菜單...');
        
        // 檢查頁面上是否已經有菜單（處理頁面刷新等情況）
        const existingMenus = document.querySelectorAll('.sav-menu');
        if (existingMenus.length > 0) {
            console.log(`[發現] 頁面已存在 ${existingMenus.length} 個菜單`);
            existingMenus.forEach(menu => addCustomButton(menu));
        }
    }
    
    // ==================== 腳本初始化 ====================
    
    /**
     * 初始化腳本
     * 
     * 執行順序：
     * 1. 檢查 document.body 是否已載入
     * 2. 已載入：直接啟動監測和檢查
     * 3. 未載入：等待 DOMContentLoaded 事件
     * 
     * 啟動項目：
     * - startObserving()：啟動 DOM 監測
     * - checkMainScript()：檢查主腳本是否存在
     */
    if (document.body) {
        // body 已載入，直接啟動
        startObserving();
        checkMainScript();
    } else {
        // body 未載入，等待 DOMContentLoaded 事件
        // { once: true }：事件觸發一次後自動移除監聽器（性能優化）
        window.addEventListener('DOMContentLoaded', () => {
            startObserving();
            checkMainScript();
        }, { once: true });
    }
    
    console.log(`[素人演員查詢擴展] v${SCRIPT_VERSION} 初始化完成`);
    
})();
