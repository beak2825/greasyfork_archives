// ==UserScript==
// @name         GSMArena 快速複製 - 廣告屏蔽與佈局優化 v3.7
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  快速複製選單、獨立複製按鈕、屏蔽廣告、右移品牌選單區塊，新增 Launch 發布/發售日期(年/月)辨識與一鍵複製，5G 檢測標記，面板大小控制
// @author       BUTTST
// @license MIT; https://opensource.org/licenses/MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAABnRSTlMAAAAAAABupgeRAAABK0lEQVR4AXxPg7KCURDuvbOt8b3ZbhgfINu2xrlxbTqzfzpcfJilweJyBVye8P7iw4EKHNRF6DeoxWztdrr4xKJxANOgTWRILBHLNpvNmbqAczUhOPymkmmEfCNwkDzE//96AjqdTpgAgNcZ+HzRfDYnoGAg+EZAaMjD4QhBFPIFlUr7ywHi8Wh8bx8OB6lUoVJqPsyAOTy+yG53lktll9MN6RcCPlRDkUi6Wi7fZqCCuByegMHEKmaTtdFo1qq1y0A2wGMNjno93SfJKPTZ2XZkZ6BbjumktrycSVLyQDRRSg5E6ut1RUc219bDzWVoQPZxQ9MEPT2QOkmQajiaqKTc6+XZWloC0oBsY3tx4URz0wnmphMtgCQCTYQxWiorQQkWzaFAhCvcgIoBJZjGKHBXJhMAAAAASUVORK5CYII=
// @match        https://www.gsmarena.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558860/GSMArena%20%E5%BF%AB%E9%80%9F%E8%A4%87%E8%A3%BD%20-%20%E5%BB%A3%E5%91%8A%E5%B1%8F%E8%94%BD%E8%88%87%E4%BD%88%E5%B1%80%E5%84%AA%E5%8C%96%20v37.user.js
// @updateURL https://update.greasyfork.org/scripts/558860/GSMArena%20%E5%BF%AB%E9%80%9F%E8%A4%87%E8%A3%BD%20-%20%E5%BB%A3%E5%91%8A%E5%B1%8F%E8%94%BD%E8%88%87%E4%BD%88%E5%B1%80%E5%84%AA%E5%8C%96%20v37.meta.js
// ==/UserScript==

/*
 * 版本號: 3.7
 * 更新時間: 2025/12/16 12:17
 * 
 * 功能說明:
 * 1. 屏蔽所有廣告區塊
 * 2. 將 Phone Finder 區塊移至頁面頂部
 * 3. 優化佈局，讓手機資料列表佔據左側空間，提升橫向顯示效果
 * 4. 快速複製功能：尺寸、指紋位置、屏下指紋類型
 * 5. 彈出界面顯示複製內容預覽
 * 6. 開發者設置界面顯示調試信息
 * 7. Launch 發布/發售日期(年/月)辨識與一鍵複製
 * 8. 5G 檢測與標記顯示
 * 9. 面板大小控制功能
 * 
 * 版本更新記錄:
 * v3.7 (2025/12/16 12:17):
 * - 修復：刷新按鈕無法正常抓取數據的問題，確保數據保存完成後再刷新表格
 * - 修復：清除數據後快照未重置的問題，立即重置 lastSummarySnapshot
 * - 改進：刷新按鈕邏輯，先刷新核心數據再收集，添加數據收集失敗提示
 * - 改進：快照更新時機，只在數據保存完成後更新，避免覆蓋新數據提示
 * - 優化：列複製按鈕移至右上角，避免與標題文字重疊
 * - 優化：行複製按鈕改為行號右側橫向排列，縮小尺寸並添加懸停效果
 *
 * v3.6 (2025/12/15 14:56):
 * - 行為：長按清除同步移除自訂列/行設定、縮放、行列尺寸與快照；關閉頁面時也清空
 * - 刷新：按鈕點擊先抓取本頁再刷新；新資料才亮呼吸綠燈，刷新後熄滅
 * - 拖拽：行拖曳改用 pageId 唯一識別，避免索引錯位；行號為唯一把手，移除與行高拖曳衝突
 *
 * v3.5 (2025/12/15 14:37):
 * - 行為：匯總表格不自動刷新，僅手動按「抓取/刷新數據」；有新數據才亮呼吸綠燈，刷新後熄滅
 * - 交互：行拖拽重新修復（行號把手），避免與行高調整衝突；列拖拽把手與列寬拖曳互不干擾
 * - 清理：長按3秒清除時顯示左→右進度條，並重置行/列/寬高/自訂欄位；關閉頁面即清空存儲
 *
 * v3.4 (2025/12/15 14:25):
 * - 修復：行拖拽再次可用，改為行號拖曳把手並避免與行高調整衝突
 * - 交互：列拖拽改為專屬拖曳把手，避免與列寬調整互相干擾
 * - 控制：刷新按鈕僅在偵測到新數據時呼吸綠燈，刷新後自動熄滅
 *
 * v3.3 (2025/12/15 14:00):
 * - 修復：匯總表格拖拽排序失效，恢復行/列拖放並加上高亮
 * - 體驗：行/列尺寸改為邊框拖曳調整（類似 Excel），移除 ± 按鈕
 * - 功能：新增列按鈕改為「+ 新增列」置中佔滿整列，新增行/列真正寫入資料
 * - 控制：匯總表格整體大小與列寬/行高可拖曳調整並記憶
 * - 行為：刷新按鈕僅以「呼吸綠燈」提示新數據，不自動刷新
 *
 * v3.2 (2025/12/15 13:45):
 * - 修復：匯總表格未包含當前頁面數據的問題，進入匯總時會先收集本頁數據
 * - 行為：匯總表格不再自動刷新，偵測到新數據時以「呼吸綠燈」提示刷新按鈕
 * - 體驗：拖拽行/列時提供來源與目標高亮；複製按鈕移至行首
 * - 控制：面板大小控制移至設置頂部；匯總表格新增整體大小控制；行/列可單獨調整尺寸
 * - 其他：新數據提示避免干擾現有表格內容，手動刷新後清除提示
 *
 * v3.1 (2025/12/15 13:18):
 * - 新增：跨頁面數據共享機制（BroadcastChannel + localStorage）
 * - 新增：數據匯總表格面板（彈窗形式，可拖拽）
 * - 新增：表格功能（拖拽排序行/列、新增行/列、複製行/列、可編輯單元格）
 * - 新增：數據收集按鈕（抓取/刷新數據，按住3秒清除）
 * - 改進：將開發者界面移至設置界面中（配色主題下方）
 * - 改進：匯總表格按鈕取代原本的開發者按鈕
 * 
 * v2.8 (2025/12/15 12:55):
 * - 新增：5G 檢測功能，自動檢測 Network Technology 是否支援 5G
 * - 新增：5G 標記顯示於「發布日期 / 發售日期（年/月）」標題右側（方形倒圓角設計）
 * - 新增：面板大小控制選項（左上角，版本號下方），支援 70%-150% 縮放
 * - 改進：統一調整各階層文本大小，確保視覺一致性
 * - 改進：標題樣式統一（margin: 0 0 8px 0, padding-bottom: 6px）
 * 
 * v2.7 (2025/12/14 18:00):
 * - 新增：辨識 Launch 內 Announced / Released 日期，轉為「發布日期 年/月」「發售日期 年/月」顯示於面板
 * - 新增：發布日期/發售日期 各自提供一鍵複製（單個儲存格）
 * - 新增：在 Launch 的 Announced / Status 標籤右側加入 📋 小按鈕（單格複製年/月）
 * 
 * v2.6 (2025/12/13 14:20):
 * - 改進：調整配色方案，更新為4種新的漸變配色選項
 * - 改進：複製按鈕和整體界面外框也應用主題配色
 * - 改進：標題文字調整為18px，上下間隔各1px
 * - 改進：標題內容改為"面板 ＋ 指紋位置、類型"（去掉前綴排序）
 * - 改進：界面預設展開時為最小尺寸（寬度300px，高度385px，內容區域最大高度345px）
 * 
 * v2.5 (2025/12/12 14:11):
 * - 改進：添加頁面類型判斷，僅在單一手機型號頁面啟用插件（排除品牌匯總頁面）
 * - 新增：真正的設置菜單（⚙️），提供配色選擇功能
 * - 新增：設置界面提供多種漸變背景配色選項
 * - 改進：優化頁面檢測邏輯，避免在品牌匯總頁面產生衝突
 * 
 * v2.0.4 (2025/12/12 13:21):
 * - 修復：在主界面（https://www.gsmarena.com/）禁用插件功能，避免界面異常
 * - 改進：插件界面自動匹配 GSMArena 當前配色（從 .article-info-line 提取）
 * - 修復：phone-finder-top 遮蓋右側內容問題，添加適當間距
 * - 改進：版本號放置在標題欄最左上角（絕對定位），不影響手機型號標題
 * 
 * v1.0.6:
 * - 重新編寫 Phone Finder 按鈕布局代碼
 * - 基於原始 HTML 結構重新設計
 * - 方案1: 簡單 inline-block（當前啟用，使用 font-size: 0 技巧）
 * 
 * v1.0.5:
 * - 提供多種 Phone Finder 按鈕布局方案供測試
 * - 方案1: Flexbox 布局（當前啟用）
 * - 方案2-5: 其他備選方案（已註釋）
 * - 請測試後選擇可用方案，刪除其他方案
 * 
 * v1.0.4:
 * - 添加腳本 LOGO 圖標
 * - 完善修復 Phone Finder 按鈕區域布局問題
 * - 優化按鈕換行和排列
 * 
 * v1.0.3:
 * - 修復 Phone Finder 按鈕區域 UI 錯亂問題
 * - 添加左側內邊距，避免內容太貼近窗口邊緣
 * - 優化按鈕排列和樣式
 * 
 * v1.0.2:
 * - 修復誤隱藏主要內容的問題
 * - 更精確的廣告識別機制
 * - 添加內容保護白名單
 */

(function() {
    'use strict';

    // ========== 保護的重要內容選擇器 ==========
    // 這些選擇器對應的元素絕對不能被隱藏，確保主要內容區域的安全
    const PROTECTED_SELECTORS = [
        '.main',              // 主內容區域
        '.main-review',       // 評測頁面主內容
        '.main-content',      // 主內容容器
        '.review-header',     // 評測頁面標題區域
        '.makers',            // 手機列表容器
        '.specs-list',        // 規格列表
        '#specs-list',        // 規格列表（ID 選擇器）
        '#body',              // 主體容器
        '#outer',             // 外層容器
        '#wrapper',           // 包裝器容器
        '.article-info',      // 文章資訊
        '.user-comments',     // 用戶評論
        '.review-item',       // 評測項目
        '.news-item'          // 新聞項目
    ];

    /**
     * 檢查元素是否在保護列表中
     * 
     * @param {Element} element - 要檢查的 DOM 元素
     * @returns {boolean} - 如果元素在保護列表中返回 true，否則返回 false
     * 
     * 功能說明：
     * 1. 檢查元素是否匹配保護選擇器列表
     * 2. 檢查元素的父元素是否在保護列表中
     * 3. 檢查元素的 class 和 id 是否包含重要內容關鍵字
     * 4. 確保主要內容區域絕對不會被誤隱藏
     */
    function isProtected(element) {
        // 如果元素不存在，視為保護內容（安全起見）
        if (!element) return true;
        
        // ========== 檢查1: 是否匹配保護選擇器列表 ==========
        for (const selector of PROTECTED_SELECTORS) {
            // 檢查元素本身是否匹配
            if (element.matches && element.matches(selector)) {
                return true;
            }
            // 檢查元素的父元素是否匹配（向上查找）
            if (element.closest && element.closest(selector)) {
                return true;
            }
        }
        
        // ========== 檢查2: 檢查 class 和 id 是否包含重要內容關鍵字 ==========
        const importantClasses = ['main', 'review', 'specs', 'article', 'content', 'body'];
        const className = element.className || '';
        const id = element.id || '';
        
        for (const cls of importantClasses) {
            // 檢查 class 名稱
            if (className.includes(cls) && !className.includes('ad')) {
                // 進一步檢查，確保不是廣告（檢查文字內容）
                const text = element.textContent || '';
                if (!text.includes('ADVERTISEMENT') && !text.includes('ADVERT')) {
                    return true;  // 是重要內容，需要保護
                }
            }
            // 檢查 id 名稱
            if (id.includes(cls) && !id.includes('ad') && !id.includes('Ad')) {
                return true;  // 是重要內容，需要保護
            }
        }
        
        // 不在保護列表中，可以進行操作
        return false;
    }

    /**
     * 屏蔽所有廣告
     * 
     * 功能說明：
     * 1. 精確匹配並隱藏頂部廣告 (#topAdv)
     * 2. 使用 TreeWalker 遍歷 DOM，查找包含 "ADVERTISEMENT" 文字的元素
     * 3. 識別並隱藏常見的廣告容器（.adv, .advertisement, gpt-ad 等）
     * 4. 隱藏 .l-box 中的廣告元素
     * 5. 使用保護機制確保不會誤隱藏主要內容
     */
    function hideAllAds() {
        // ========== 步驟1: 屏蔽頂部廣告 ==========
        // 精確匹配 #topAdv 元素並完全隱藏
        const topAdv = document.getElementById('topAdv');
        if (topAdv && !isProtected(topAdv)) {
            topAdv.style.display = 'none';
            topAdv.style.visibility = 'hidden';
            topAdv.style.height = '0';
            topAdv.style.overflow = 'hidden';
            topAdv.style.margin = '0';
            topAdv.style.padding = '0';
        }

        // ========== 步驟2: 查找所有包含 "ADVERTISEMENT" 文字的元素 ==========
        // 使用 TreeWalker API 遍歷 DOM 樹，精確定位包含廣告文字的元素
        // TreeWalker 比 querySelector 更高效，特別適合遍歷大量節點
        const walker = document.createTreeWalker(
            document.body,           // 從 body 開始遍歷
            NodeFilter.SHOW_TEXT,    // 只遍歷文字節點
            null,                    // 不過濾任何節點
            false                    // 不擴展實體引用
        );

        const adElements = new Set();  // 使用 Set 避免重複添加
        let node;
        
        // 遍歷所有文字節點
        while (node = walker.nextNode()) {
            const text = node.textContent.trim();
            // 檢查文字節點是否包含廣告標記
            if (text === 'ADVERTISEMENT' || text === 'ADVERT') {
                // 向上查找包含此文字節點的容器元素
                let parent = node.parentElement;
                while (parent && parent !== document.body) {
                    // 如果父元素是保護內容，停止向上查找
                    if (isProtected(parent)) {
                        break;
                    }
                    
                    // 檢查父元素是否為廣告容器
                    const parentText = parent.textContent || '';
                    const parentId = parent.id || '';
                    const parentClass = parent.className || '';
                    
                    // 判斷是否為廣告容器的條件：
                    // 1. ID 為 topAdv
                    // 2. class 包含 l-box、adv 或 ad-
                    // 3. 文字內容僅為 "ADVERTISEMENT"
                    // 4. 文字內容包含 "ADVERTISEMENT" 且內容較短（廣告通常內容較少）
                    if (parentId === 'topAdv' || 
                        parentClass.includes('l-box') ||
                        parentClass.includes('adv') ||
                        parentClass.includes('ad-') ||
                        parentText.trim() === 'ADVERTISEMENT' ||
                        (parentText.includes('ADVERTISEMENT') && parentText.length < 200)) {
                        adElements.add(parent);  // 添加到廣告元素集合
                        break;  // 找到容器後停止向上查找
                    }
                    parent = parent.parentElement;  // 繼續向上查找
                }
            }
        }

        // 隱藏所有找到的廣告元素（再次檢查保護機制）
        adElements.forEach(el => {
            if (!isProtected(el)) {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.style.height = '0';
                el.style.overflow = 'hidden';
                el.style.margin = '0';
                el.style.padding = '0';
            }
        });

        // ========== 步驟3: 屏蔽明確的廣告容器 ==========
        // 使用常見的廣告選擇器查找並隱藏廣告元素
        const adContainers = [
            '.adv',                    // 廣告容器類
            '.advertisement',          // 廣告類
            '.ad-container',           // 廣告容器
            '.ad-wrapper',             // 廣告包裝器
            '.ad-banner',              // 廣告橫幅
            '[class*="adv"]',          // class 包含 "adv" 的元素
            '[id*="gpt-ad"]',          // Google Publisher Tag 廣告 ID
            '[id*="div-gpt"]'          // Google Publisher Tag div ID
        ];

        // 遍歷每個廣告選擇器
        adContainers.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    // 跳過保護內容
                    if (isProtected(el)) return;
                    
                    const text = el.textContent || '';
                    const id = el.id || '';
                    const className = el.className || '';
                    
                    // 只隱藏明確的廣告元素（多重檢查確保準確性）
                    if (text.includes('ADVERTISEMENT') || 
                        text.includes('ADVERT') ||
                        id.includes('gpt-ad') ||        // Google Publisher Tag 廣告
                        id.includes('div-gpt') ||       // Google Publisher Tag div
                        className.includes('adv') ||
                        className.includes('advertisement')) {
                        // 再次確認不是保護內容（雙重檢查）
                        if (!isProtected(el)) {
                            el.style.display = 'none';
                            el.style.visibility = 'hidden';
                        }
                    }
                });
            } catch (e) {
                // 忽略選擇器錯誤（某些選擇器可能不兼容，不影響整體功能）
            }
        });

        // ========== 步驟4: 屏蔽 .l-box 中的廣告 ==========
        // .l-box 是網站常用的容器類，需要檢查內容是否為廣告
        const lBoxes = document.querySelectorAll('.l-box');
        lBoxes.forEach(box => {
            // 跳過保護內容
            if (isProtected(box)) return;
            
            const text = box.textContent || '';
            const id = box.id || '';
            
            // 只隱藏明確是廣告的 l-box
            // 判斷條件：包含 "ADVERTISEMENT" 且為 topAdv 或內容較短（廣告通常內容較少）
            if ((text.includes('ADVERTISEMENT') || text.includes('ADVERT')) &&
                (id === 'topAdv' || text.trim().length < 200)) {
                box.style.display = 'none';
                box.style.visibility = 'hidden';
                box.style.height = '0';
                box.style.overflow = 'hidden';
            }
        });
    }

    /**
     * 移動 Phone Finder 至頂部
     * 
     * 功能說明：
     * 1. 查找左側邊欄中的 Phone Finder 區塊
     * 2. 複製 Phone Finder 內容到新容器
     * 3. 將新容器插入到頁面頂部（主要內容之前）
     * 4. 隱藏原始左側邊欄
     * 5. 優化按鈕樣式和布局，使其橫向排列並能自動換行
     */
    function movePhoneFinderToTop() {
        // 檢查是否已經移動過，避免重複執行
        if (document.getElementById('phone-finder-top')) {
            return;
        }

        // 查找所有左側邊欄
        const sidebars = document.querySelectorAll('aside.sidebar.col.left');
        
        for (const sidebar of sidebars) {
            const text = sidebar.textContent || '';
            // 檢查是否包含 Phone Finder 內容
            if (text.includes('Phone finder') || text.includes('PHONE FINDER')) {
                // 查找 brandmenu-v2 容器（包含 Phone Finder 和品牌列表）
                const brandMenu = sidebar.querySelector('.brandmenu-v2');
                if (!brandMenu) continue;

                // ========== 步驟1: 創建新容器 ==========
                const container = document.createElement('div');
                container.id = 'phone-finder-top';
                container.style.cssText = `
                    width: 100% !important;
                    background: #f5f5f5;
                    padding: 15px;
                    margin: 0 0 20px 0 !important;
                    border-bottom: 2px solid #ddd;
                    box-sizing: border-box;
                    clear: both;
                    position: relative;
                    z-index: 1 !important;
                    word-wrap: break-word !important;
                    overflow-wrap: break-word !important;
                `;

                // ========== 步驟2: 複製 brandmenu 內容 ==========
                const clone = brandMenu.cloneNode(true);
                clone.style.display = 'block';
                clone.style.width = '100%';
                container.appendChild(clone);
                
                // ========== 步驟3: 調整 brandmenu 容器樣式 ==========
                const brandMenuInContainer = container.querySelector('.brandmenu-v2');
                if (brandMenuInContainer) {
                    brandMenuInContainer.style.cssText = `
                        display: block !important;
                        width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    `;
                }
                
                // ========== 步驟4: 調整列表布局（使用 inline-block + font-size: 0 技巧）==========
                // 原理說明：
                // - ul 設置 font-size: 0 可以消除 inline-block 元素之間的空白間隙
                // - li 設置為 inline-block 可以讓按鈕橫向排列
                // - 當容器寬度不足時，按鈕會自動換行
                const ulElements = container.querySelectorAll('ul');
                const liElements = container.querySelectorAll('li');
                
                // 調整 ul 列表樣式
                ulElements.forEach(ul => {
                    ul.style.cssText = `
                        display: block !important;
                        list-style: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                        font-size: 0 !important;  /* 消除 inline-block 之間的空白 */
                    `;
                });
                
                // 調整 li 列表項樣式
                liElements.forEach(li => {
                    li.style.cssText = `
                        display: inline-block !important;  /* 橫向排列 */
                        list-style: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        vertical-align: top !important;
                        font-size: 14px !important;  /* 恢復字體大小 */
                    `;
                });
                
                // ========== 步驟5: 調整所有連結按鈕樣式 ==========
                const links = container.querySelectorAll('a');
                links.forEach(link => {
                    // 檢查按鈕類型（Phone finder 主按鈕或品牌連結）
                    const isPhoneFinder = link.classList.contains('pad-finder');
                    const isPadMultiple = link.classList.contains('pad-multiple');
                    
                    // 所有按鈕使用統一樣式（目前 Phone finder 和品牌連結樣式相同）
                    link.style.cssText = `
                        display: inline-block !important;
                        margin: 5px 10px 5px 0 !important;
                        padding: 6px 12px !important;
                        background: #fff !important;
                        border: 1px solid #ddd !important;
                        border-radius: 4px !important;
                        text-decoration: none !important;
                        color: #333 !important;
                        font-size: 14px !important;
                        transition: all 0.2s !important;
                        white-space: nowrap !important;  /* 防止按鈕文字換行 */
                    `;
                    
                    // 添加懸停效果
                    link.addEventListener('mouseenter', function() {
                        this.style.background = '#e8e8e8';
                        this.style.borderColor = '#999';
                    });
                    link.addEventListener('mouseleave', function() {
                        this.style.background = '#fff';
                        this.style.borderColor = '#ddd';
                    });
                });
                
                // ========== 步驟6: 調整 p.pad 容器樣式 ==========
                // p.pad 包含 Phone finder 主按鈕和 All brands/Rumor mill 按鈕
                const padElements = container.querySelectorAll('p.pad');
                padElements.forEach(pad => {
                    pad.style.cssText = `
                        display: block !important;
                        margin: 10px 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                    `;
                });

                // ========== 步驟7: 插入到頁面頂部 ==========
                // 優先插入到 #body 或 #outer 容器內，在主要內容之前
                const bodyElement = document.getElementById('body');
                const outerElement = document.getElementById('outer');
                const targetContainer = bodyElement || outerElement || document.body;
                
                // 查找第一個主要內容元素
                const firstContent = targetContainer.querySelector('.main, .main-review, .review-header, .makers, #specs-list');
                
                if (firstContent && firstContent.parentNode) {
                    // 插入到主要內容之前
                    firstContent.parentNode.insertBefore(container, firstContent);
                } else if (targetContainer) {
                    // 如果找不到主要內容，插入到容器開頭
                    const firstChild = targetContainer.firstElementChild;
                    if (firstChild) {
                        targetContainer.insertBefore(container, firstChild);
                    } else {
                        targetContainer.appendChild(container);
                    }
                } else {
                    // 最後備選方案：插入到 body 開頭
                    document.body.insertBefore(container, document.body.firstChild);
                }

                // ========== 步驟8: 隱藏原始側邊欄 ==========
                sidebar.style.display = 'none';
                sidebar.style.visibility = 'hidden';
                sidebar.style.width = '0';
                sidebar.style.height = '0';
                sidebar.style.overflow = 'hidden';
                sidebar.style.margin = '0';
                sidebar.style.padding = '0';
                
                break; // 只處理第一個找到的 Phone Finder 側邊欄
            }
        }
    }

    /**
     * 優化佈局
     * 
     * 功能說明：
     * 1. 隱藏左側邊欄（Phone Finder 已經移動到頂部）
     * 2. 為主內容區域添加左側內邊距，避免內容太貼近窗口邊緣
     * 3. 針對不同頁面類型（列表頁面、規格頁面）採用不同的調整策略
     * 4. 調整主容器（#outer, #wrapper）的寬度和邊距
     * 5. 確保手機資料列表能夠充分利用橫向空間
     */
    function optimizeLayout() {
        // ========== 步驟1: 隱藏左側邊欄 ==========
        // Phone Finder 已經移動到頂部，隱藏原始左側邊欄以釋放空間
        const leftSidebars = document.querySelectorAll('aside.sidebar.col.left');
        leftSidebars.forEach(sidebar => {
            const text = sidebar.textContent || '';
            if (text.includes('Phone finder') || text.includes('PHONE FINDER')) {
                sidebar.style.display = 'none';
                sidebar.style.visibility = 'hidden';
                sidebar.style.width = '0';
                sidebar.style.height = '0';
                sidebar.style.overflow = 'hidden';
                sidebar.style.margin = '0';
                sidebar.style.padding = '0';
            }
        });

        // ========== 步驟2: 添加左側內邊距 ==========
        // 避免內容太貼近窗口邊緣，提供視覺緩衝空間
        const leftPadding = '20px';
        
        // 2.1 調整手機列表頁面的主內容區域
        const makers = document.querySelector('.makers');
        if (makers) {
            // 這是手機列表頁面（如 /samsung-phones-9.php）
            const makersParent = makers.parentElement;
            if (makersParent && !isProtected(makersParent)) {
                makersParent.style.marginLeft = '0';
                makersParent.style.paddingLeft = leftPadding;
                makersParent.style.width = '100%';
                makersParent.style.maxWidth = '100%';
                makersParent.style.boxSizing = 'border-box';
            }
            
            // 調整 makers 容器本身
            makers.style.marginLeft = '0';
            makers.style.paddingLeft = '0';
            makers.style.width = '100%';
            makers.style.maxWidth = '100%';
        }

        // 2.2 調整規格頁面的主內容（如 /samsung_galaxy_m17_5g-14221.php）
        const mainReview = document.querySelector('.main.main-review');
        const specsList = document.getElementById('specs-list');
        if (mainReview || specsList) {
            // 這是規格頁面
            const bodyElement = document.getElementById('body');
            if (bodyElement) {
                // 添加左側內邊距
                bodyElement.style.paddingLeft = leftPadding;
                bodyElement.style.boxSizing = 'border-box';
                
                // 確保主內容區域的 z-index 高於 phone-finder-top，避免被遮蓋
                bodyElement.style.position = 'relative';
                bodyElement.style.zIndex = '2';
                
                // 如果原本有左側邊距（可能是為了避開左側邊欄），移除它
                const currentMarginLeft = window.getComputedStyle(bodyElement).marginLeft;
                if (parseInt(currentMarginLeft) > 50) {
                    bodyElement.style.marginLeft = '0';
                }
            }
            
            // 也為 main-review 添加左側內邊距（如果原本沒有）
            if (mainReview) {
                const currentPaddingLeft = window.getComputedStyle(mainReview).paddingLeft;
                if (parseInt(currentPaddingLeft) < 20) {
                    mainReview.style.paddingLeft = leftPadding;
                    mainReview.style.boxSizing = 'border-box';
                }
                // 確保 main-review 的 z-index 正確
                mainReview.style.position = 'relative';
                mainReview.style.zIndex = '2';
            }
            
            // 確保 specs-list 的 z-index 正確
            if (specsList) {
                specsList.style.position = 'relative';
                specsList.style.zIndex = '2';
            }
        }

        // 2.3 調整 #outer 容器（主內容外層容器）
        const outer = document.getElementById('outer');
        if (outer && !isProtected(outer)) {
            outer.style.marginLeft = '0';
            outer.style.paddingLeft = leftPadding;
            outer.style.width = '100%';
            outer.style.maxWidth = '100%';
            outer.style.boxSizing = 'border-box';
        }

        // 2.4 調整 #wrapper 容器（最外層容器）
        const wrapper = document.getElementById('wrapper');
        if (wrapper && !isProtected(wrapper)) {
            wrapper.style.marginLeft = '0';
            wrapper.style.paddingLeft = leftPadding;
            wrapper.style.width = '100%';
            wrapper.style.maxWidth = '100%';
            wrapper.style.boxSizing = 'border-box';
        }
        
        // 2.5 為 Phone Finder 頂部容器也添加左側內邊距
        // 保持與主內容區域一致的左側邊距
        const phoneFinderTop = document.getElementById('phone-finder-top');
        if (phoneFinderTop) {
            phoneFinderTop.style.paddingLeft = leftPadding;
            phoneFinderTop.style.boxSizing = 'border-box';
        }
    }

    // ========== 快速複製功能相關變數 ==========
    let copyPanel = null;           // 彈出界面元素
    let devPanel = null;            // 開發者設置界面元素
    let settingsPanel = null;       // 設置界面元素
    let summaryPanel = null;        // 匯總表格面板元素
    let isPanelMinimized = false;   // 彈出界面是否已縮小
    let isDevPanelVisible = false;  // 開發者設置界面是否顯示
    let isSettingsPanelVisible = false; // 設置界面是否顯示
    let isSummaryPanelVisible = false; // 匯總表格面板是否顯示
    let selectedTheme = 'default';  // 當前選擇的主題
    
    // ========== 跨頁面數據共享相關變數 ==========
    const STORAGE_KEY = 'gsmarena-summary-data';
    const CHANNEL_NAME = 'gsmarena-data-channel';
    let broadcastChannel = null;     // BroadcastChannel 實例
    let pageOpenTime = Date.now();  // 頁面打開時間（用於排序）
    let collectedData = null;       // 當前頁面收集的數據
    let summarySizeScale = 1;
    let summaryNewDataPending = false;
    let lastSummarySnapshot = '';
    let columnWidthMap = {};
    let rowHeightMap = {};
    let extractedData = {           // 提取的數據
        dimensions: { length: '', width: '', thickness: '' },
        fingerprint: { position: '', type: '' },
        launch: {
            announcedRaw: '',
            releasedRaw: '',
            announcedYM: '',
            releasedYM: ''
        },
        has5G: false  // 是否有 5G 支援
    };

    // 配色主題選項
    const themeOptions = {
        'default': {
            name: '預設',
            backgroundColor: '#485461',
            backgroundImage: 'linear-gradient(315deg, #485461 0%, #28313b 74%)'
        },
        'teal-purple': {
            name: '青紫漸變',
            backgroundColor: '#0cbaba',
            backgroundImage: 'linear-gradient(315deg, #0cbaba 0%, #380036 74%)'
        },
        'blue-gray': {
            name: '藍灰漸變',
            backgroundColor: '#bdd4e7',
            backgroundImage: 'linear-gradient(315deg, #bdd4e7 0%, #8693ab 74%)'
        },
        'blue-dark': {
            name: '深藍漸變',
            backgroundColor: '#537895',
            backgroundImage: 'linear-gradient(315deg, #537895 0%, #09203f 74%)'
        }
    };

    /**
     * 套用主面板大小縮放
     */
    function applyPanelSizeScale() {
        if (!copyPanel) return;
        
        const baseWidth = 300;
        const baseHeight = 470;
        const baseFontSize = 14;
        
        copyPanel.style.width = (baseWidth * panelSizeScale) + 'px';
        copyPanel.style.height = (baseHeight * panelSizeScale) + 'px';
        copyPanel.style.minWidth = (baseWidth * panelSizeScale) + 'px';
        copyPanel.style.minHeight = (baseHeight * panelSizeScale) + 'px';
        
        const content = copyPanel.querySelector('.panel-content');
        if (content) {
            content.style.maxHeight = (430 * panelSizeScale) + 'px';
            content.style.fontSize = (baseFontSize * panelSizeScale) + 'px';
        }
        
        const titles = copyPanel.querySelectorAll('h3.section-title');
        titles.forEach(title => {
            title.style.fontSize = (18 * panelSizeScale) + 'px';
        });
        
        const contentTexts = copyPanel.querySelectorAll('.section-content, .section-launch-content');
        contentTexts.forEach(el => {
            el.style.fontSize = (12 * panelSizeScale) + 'px';
        });
        
        const buttons = copyPanel.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.style.fontSize = (12 * panelSizeScale) + 'px';
            if (btn.textContent.includes('複製')) {
                btn.style.padding = (6 * panelSizeScale) + 'px ' + (8 * panelSizeScale) + 'px';
            }
        });
        
        const hints = copyPanel.querySelectorAll('.launch-hint, .section-note');
        hints.forEach(hint => {
            hint.style.fontSize = (10 * panelSizeScale) + 'px';
        });
        
        const badge5G = copyPanel.querySelector('.badge-5g');
        if (badge5G) {
            badge5G.style.fontSize = (11 * panelSizeScale) + 'px';
            badge5G.style.padding = (2 * panelSizeScale) + 'px ' + (8 * panelSizeScale) + 'px';
        }
    }

    function setPanelSizeScale(newScale) {
        const clamped = Math.min(MAX_SIZE_SCALE, Math.max(MIN_SIZE_SCALE, newScale));
        panelSizeScale = clamped;
        try {
            localStorage.setItem('gsmarena-panel-size-scale', panelSizeScale.toString());
        } catch (e) {}
        applyPanelSizeScale();
    }

    function loadPanelSizeScale() {
        try {
            const savedScale = localStorage.getItem('gsmarena-panel-size-scale');
            if (savedScale) {
                const scale = parseFloat(savedScale);
                if (scale >= MIN_SIZE_SCALE && scale <= MAX_SIZE_SCALE) {
                    panelSizeScale = scale;
                }
            }
        } catch (e) {}
    }

    /**
     * 解析尺寸數據
     * 從 <td data-spec="dimensions"> 元素中提取長、寬、厚
     * 
     * @param {Element} element - 包含尺寸信息的元素
     * @returns {Object} - { length, width, thickness }
     */
    function parseDimensions(element) {
        if (!element) return { length: '', width: '', thickness: '' };
        
        const text = element.textContent || '';
        // 匹配格式：167.4 x 77.4 x 7.6 mm
        const match = text.match(/([\d.]+)\s*x\s*([\d.]+)\s*x\s*([\d.]+)\s*mm/i);
        
        if (match && match.length >= 4) {
            return {
                length: match[1].trim(),
                width: match[2].trim(),
                thickness: match[3].trim()
            };
        }
        
        return { length: '', width: '', thickness: '' };
    }

    // ========== v2.7 新增：日期辨識（年/月） ==========
    const MONTH_MAP = {
        january: 1, jan: 1,
        february: 2, feb: 2,
        march: 3, mar: 3,
        april: 4, apr: 4,
        may: 5,
        june: 6, jun: 6,
        july: 7, jul: 7,
        august: 8, aug: 8,
        september: 9, sep: 9, sept: 9,
        october: 10, oct: 10,
        november: 11, nov: 11,
        december: 12, dec: 12
    };

    function normalizeSpaces(s) {
        return (s || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function toYM(year, month) {
        if (!year || !month) return '';
        const mm = String(month).padStart(2, '0');
        return `${year}/${mm}`;
    }

    function parseYearMonth(text) {
        const t = normalizeSpaces(text);
        if (!t) return { year: '', month: '', ym: '' };

        // 1) 2024, June 13 / 2024, Jun / 2024, 6
        let m = t.match(/(\d{4})\s*,\s*([A-Za-z]+|\d{1,2})\b/i);
        if (m) {
            const year = m[1];
            let monthRaw = m[2];
            let month = '';
            if (/^\d{1,2}$/.test(monthRaw)) {
                month = parseInt(monthRaw, 10);
            } else {
                month = MONTH_MAP[monthRaw.toLowerCase()] || '';
            }
            return { year, month, ym: toYM(year, month) };
        }

        // 2) June 13, 2024 / Jun, 2024
        m = t.match(/([A-Za-z]+)\b(?:\s+\d{1,2})?\s*,\s*(\d{4})/i);
        if (m) {
            const month = MONTH_MAP[m[1].toLowerCase()] || '';
            const year = m[2];
            return { year, month, ym: toYM(year, month) };
        }

        // 3) 2024-06 / 2024/06
        m = t.match(/(\d{4})\s*[-/]\s*(\d{1,2})/);
        if (m) {
            const year = m[1];
            const month = parseInt(m[2], 10);
            return { year, month, ym: toYM(year, month) };
        }

        // 4) 2024 (只有年，無法產生年/月)
        m = t.match(/(\d{4})/);
        if (m) {
            return { year: m[1], month: '', ym: '' };
        }

        return { year: '', month: '', ym: '' };
    }

    function extractReleasedPart(statusText) {
        const t = normalizeSpaces(statusText);
        const m = t.match(/Released\s+(.+)$/i);
        return m ? m[1] : t;
    }

    function refreshLaunchData() {
        const announcedEl = document.querySelector('td[data-spec="year"]');
        const statusEl = document.querySelector('td[data-spec="status"]');
        const announcedRaw = normalizeSpaces(announcedEl ? announcedEl.textContent : '');
        const statusRaw = normalizeSpaces(statusEl ? statusEl.textContent : '');

        // Released 也可能存在於上方 quickfacts：span[data-spec="released-hl"]
        const releasedHL = document.querySelector('span[data-spec="released-hl"]');
        const releasedHLRaw = normalizeSpaces(releasedHL ? releasedHL.textContent : '');

        const announcedParsed = parseYearMonth(announcedRaw);
        const releasedSource = releasedHLRaw || extractReleasedPart(statusRaw);
        const releasedParsed = parseYearMonth(releasedSource);

        extractedData.launch.announcedRaw = announcedRaw;
        extractedData.launch.releasedRaw = releasedSource;
        extractedData.launch.announcedYM = announcedParsed.ym || '';
        extractedData.launch.releasedYM = releasedParsed.ym || '';
    }

    /**
     * 解析指紋信息
     * 從 <td data-spec="sensors"> 元素中提取指紋位置和類型
     * 
     * @param {Element} element - 包含傳感器信息的元素
     * @returns {Object} - { position, type }
     */
    function parseFingerprint(element) {
        if (!element) return { position: '無', type: '' };
        
        const text = element.textContent || '';
        let position = '無';
        let type = '';
        
        // 檢查指紋類型
        if (text.includes('Fingerprint')) {
            if (text.includes('under display') || text.includes('under-display')) {
                position = '屏幕下';
                // 檢查屏下指紋類型
                if (text.includes('optical')) {
                    type = '光學';
                } else if (text.includes('ultrasonic')) {
                    type = '超音波';
                }
                // 如果沒有找到類型，留空（但仍保留欄位）
            } else if (text.includes('side-mounted') || text.includes('side mounted')) {
                position = '側邊指紋';
            } else if (text.includes('rear-mounted') || text.includes('rear mounted')) {
                position = '後置';
            } else {
                // 其他指紋類型，預設為無
                position = '無';
            }
        }
        
        return { position, type };
    }

    /**
     * 生成複製內容 - 區域1：面板＋指紋位置＋屏下指紋類型
     * 格式：全面屏\t中上\t屏下指紋\t光學
     */
    function generateCopyText1() {
        const panel = '全面屏';
        const frontCamera = '中上'; // 預設值
        const fingerprintPos = extractedData.fingerprint.position || '無';
        const fingerprintType = extractedData.fingerprint.type || '';
        
        return `${panel}\t${frontCamera}\t${fingerprintPos}\t${fingerprintType}`;
    }

    /**
     * 生成複製內容 - 區域2：長寬厚（mm）
     * 格式：157.3\t74.7\t8.2
     */
    function generateCopyText2() {
        const length = extractedData.dimensions.length || '';
        const width = extractedData.dimensions.width || '';
        const thickness = extractedData.dimensions.thickness || '';
        
        return `${length}\t${width}\t${thickness}`;
    }

    /**
     * 生成複製內容 - Launch 發布日期（年/月，單格）
     */
    function generateCopyLaunchAnnouncedSingle() {
        return extractedData.launch.announcedYM || '';
    }

    /**
     * 生成複製內容 - Launch 發售日期（年/月，單格）
     */
    function generateCopyLaunchReleasedSingle() {
        return extractedData.launch.releasedYM || '';
    }

    /**
     * 複製文本到剪貼板
     * 
     * @param {string} text - 要複製的文本
     */
    function copyToClipboard(text) {
        const val = (text || '').toString();
        if (!val) {
            showToast('無可複製資料');
            return;
        }

        const textarea = document.createElement('textarea');
        textarea.value = val;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            showToast('已複製！');
        } catch (err) {
            console.error('複製失敗:', err);
            showToast('複製失敗', '#d9534f');
        }
        
        document.body.removeChild(textarea);
    }

    /**
     * 顯示提示訊息
     * 
     * @param {string} msg - 提示訊息
     * @param {string} bgColor - 背景顏色（可選）
     */
    function showToast(msg, bgColor) {
        const themeColor = bgColor || getGSMArenaThemeColor();
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${themeColor};
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            user-select: none;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 1800);
    }

    /**
     * 通用小📋按鈕（頁面內）
     * 
     * @param {Object} options - 選項 { type, title, getText }
     * @returns {Element} - 創建的按鈕元素
     */
    function createMiniCopyButton({ type, title, getText }) {
        const currentTheme = themeOptions[selectedTheme] || themeOptions['default'];
        const btn = document.createElement('button');
        btn.className = `gsmarena-copy-btn gsmarena-copy-btn-${type}`;
        btn.textContent = '📋';
        btn.title = title || '點擊複製';
        btn.style.cssText = `
            display: inline-block;
            margin-left: 8px;
            padding: 4px 8px;
            background: ${currentTheme.backgroundImage};
            background-color: ${currentTheme.backgroundColor};
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            vertical-align: middle;
            transition: all 0.2s;
        `;

        btn.addEventListener('mouseenter', function() {
            this.style.opacity = '0.85';
            this.style.transform = 'scale(1.1)';
            showPreview(type);
        });

        btn.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });

        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const text = typeof getText === 'function' ? getText() : '';
            copyToClipboard(text);
        });

        return btn;
    }

    /**
     * 創建複製按鈕
     * 
     * @param {string} type - 按鈕類型：'dimensions' 或 'sensors'
     * @param {Element} targetElement - 目標元素（在旁邊插入按鈕）
     * @returns {Element} - 創建的按鈕元素
     */
    function createCopyButton(type, targetElement) {
        // 獲取當前主題色
        const currentTheme = themeOptions[selectedTheme] || themeOptions['default'];
        const button = document.createElement('button');
        button.className = `gsmarena-copy-btn gsmarena-copy-btn-${type}`;
        button.textContent = '📋';
        button.title = '點擊複製';
        button.style.cssText = `
            display: inline-block;
            margin-left: 8px;
            padding: 4px 8px;
            background: ${currentTheme.backgroundImage};
            background-color: ${currentTheme.backgroundColor};
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            vertical-align: middle;
            transition: all 0.2s;
        `;
        
        // 懸停效果（使用稍微深一點的顏色）
        button.addEventListener('mouseenter', function() {
            // 將顏色稍微變深
            const rgb = currentTheme.backgroundColor.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
                const r = Math.max(0, parseInt(rgb[0]) - 20);
                const g = Math.max(0, parseInt(rgb[1]) - 20);
                const b = Math.max(0, parseInt(rgb[2]) - 20);
                this.style.background = `rgb(${r}, ${g}, ${b})`;
            } else {
                this.style.opacity = '0.8';
            }
            this.style.transform = 'scale(1.1)';
            // 顯示預覽
            showPreview(type);
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.background = currentTheme.backgroundImage;
            this.style.backgroundColor = currentTheme.backgroundColor;
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        // 點擊複製
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            let copyText = '';
            if (type === 'dimensions') {
                copyText = generateCopyText2();
            } else if (type === 'sensors') {
                copyText = generateCopyText1();
            }
            copyToClipboard(copyText);
        });
        
        return button;
    }

    /**
     * 顯示預覽（懸停時）
     * 
     * @param {string} type - 類型：'dimensions'、'sensors'、'launch-announced'、'launch-released'
     */
    function showPreview(type) {
        if (!copyPanel) return;
        
        const flash = (el) => {
            if (!el) return;
            const oldBg = el.style.background;
            const oldBorder = el.style.border;
            el.style.background = '#fff3cd';
            el.style.border = '1px solid #ffc107';
            setTimeout(() => {
                el.style.background = oldBg || '';
                el.style.border = oldBorder || '';
            }, 900);
        };

        if (type === 'dimensions') {
            flash(copyPanel.querySelector('.section-2-content'));
        } else if (type === 'sensors') {
            flash(copyPanel.querySelector('.section-1-content'));
        } else if (type === 'launch-announced') {
            flash(copyPanel.querySelector('.launch-announced-row'));
        } else if (type === 'launch-released') {
            flash(copyPanel.querySelector('.launch-released-row'));
        }
    }

    /**
     * 獲取手機型號
     * 
     * @returns {string} - 手機型號
     */
    function getPhoneModel() {
        const modelElement = document.querySelector('h1.specs-phone-name-title[data-spec="modelname"]');
        if (modelElement) {
            return modelElement.textContent.trim();
        }
        return '快速複製面板';
    }

    /**
     * 創建可調整大小的邊框
     * 
     * @param {Element} panel - 要添加邊框調整功能的面板元素
     * @param {Object} options - 選項 { minWidth, minHeight, onResize }
     */
    function addResizeHandles(panel, options = {}) {
        const minWidth = options.minWidth || 300;
        const minHeight = options.minHeight || 200;
        const onResize = options.onResize || (() => {});
        
        // 創建四個邊框調整手柄
        const handles = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
        const handleElements = {};
        
        handles.forEach(dir => {
            const handle = document.createElement('div');
            handle.className = `resize-handle resize-handle-${dir}`;
            handle.style.cssText = `
                position: absolute;
                background: transparent;
                z-index: 10002;
            `;
            
            // 設置位置和大小
            if (dir === 'n' || dir === 's') {
                handle.style.left = '0';
                handle.style.right = '0';
                handle.style.height = '5px';
                handle.style.cursor = 'ns-resize';
                if (dir === 'n') handle.style.top = '0';
                if (dir === 's') handle.style.bottom = '0';
            } else if (dir === 'e' || dir === 'w') {
                handle.style.top = '0';
                handle.style.bottom = '0';
                handle.style.width = '5px';
                handle.style.cursor = 'ew-resize';
                if (dir === 'e') handle.style.right = '0';
                if (dir === 'w') handle.style.left = '0';
            } else if (dir === 'ne') {
                handle.style.top = '0';
                handle.style.right = '0';
                handle.style.width = '10px';
                handle.style.height = '10px';
                handle.style.cursor = 'nesw-resize';
            } else if (dir === 'nw') {
                handle.style.top = '0';
                handle.style.left = '0';
                handle.style.width = '10px';
                handle.style.height = '10px';
                handle.style.cursor = 'nwse-resize';
            } else if (dir === 'se') {
                handle.style.bottom = '0';
                handle.style.right = '0';
                handle.style.width = '10px';
                handle.style.height = '10px';
                handle.style.cursor = 'nwse-resize';
            } else if (dir === 'sw') {
                handle.style.bottom = '0';
                handle.style.left = '0';
                handle.style.width = '10px';
                handle.style.height = '10px';
                handle.style.cursor = 'nesw-resize';
            }
            
            handleElements[dir] = handle;
            panel.appendChild(handle);
            
            // 添加調整大小事件
            let isResizing = false;
            let startX, startY, startWidth, startHeight, startLeft, startTop;
            
            handle.addEventListener('mousedown', function(e) {
                e.preventDefault();
                e.stopPropagation();
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = panel.offsetWidth;
                startHeight = panel.offsetHeight;
                startLeft = panel.offsetLeft;
                startTop = panel.offsetTop;
                
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            });
            
            function handleMouseMove(e) {
                if (!isResizing) return;
                
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                
                let newWidth = startWidth;
                let newHeight = startHeight;
                let newLeft = startLeft;
                let newTop = startTop;
                
                // 獲取當前面板位置（考慮 right/bottom 定位）
                const rect = panel.getBoundingClientRect();
                const currentLeft = rect.left;
                const currentTop = rect.top;
                
                // 根據方向調整
                if (dir.includes('e')) {
                    newWidth = Math.max(minWidth, startWidth + deltaX);
                    // 確保不超出右邊界
                    if (currentLeft + newWidth > window.innerWidth) {
                        newWidth = window.innerWidth - currentLeft;
                    }
                }
                if (dir.includes('w')) {
                    const newW = Math.max(minWidth, startWidth - deltaX);
                    const newL = currentLeft + deltaX;
                    // 確保不超出左邊界且不小於最小寬度
                    if (newL >= 0 && newW >= minWidth) {
                        newWidth = newW;
                        newLeft = newL;
                    }
                }
                if (dir.includes('s')) {
                    newHeight = Math.max(minHeight, startHeight + deltaY);
                    // 確保不超出下邊界
                    if (currentTop + newHeight > window.innerHeight) {
                        newHeight = window.innerHeight - currentTop;
                    }
                }
                if (dir.includes('n')) {
                    const newH = Math.max(minHeight, startHeight - deltaY);
                    const newT = currentTop + deltaY;
                    // 確保不超出上邊界且不小於最小高度
                    if (newT >= 0 && newH >= minHeight) {
                        newHeight = newH;
                        newTop = newT;
                    }
                }
                
                // 應用新尺寸
                panel.style.width = newWidth + 'px';
                panel.style.height = newHeight + 'px';
                if (dir.includes('w')) {
                    panel.style.left = newLeft + 'px';
                    panel.style.right = 'auto';
                }
                if (dir.includes('n')) {
                    panel.style.top = newTop + 'px';
                    panel.style.bottom = 'auto';
                }
                
                // 觸發內容響應
                onResize(newWidth, newHeight);
            }
            
            function handleMouseUp() {
                isResizing = false;
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            }
        });
        
        return handleElements;
    }

    /**
     * 響應式調整內容（根據面板大小自動調整）
     * 
     * @param {Element} panel - 面板元素
     * @param {number} width - 新寬度
     * @param {number} height - 新高度
     */
    function responsiveContent(panel, width, height) {
        const content = panel.querySelector('.panel-content, .dev-content');
        if (!content) return;
        
        // 計算基礎字體大小（根據寬度和高度）
        const baseFontSize = Math.max(9, Math.min(14, Math.min(width / 30, height / 25)));
        content.style.fontSize = baseFontSize + 'px';
        
        // 確保內容不被隱藏
        const minContentWidth = 250;
        const minContentHeight = 200; // 增加最小高度，確保複製按鈕可見
        
        if (width < minContentWidth) {
            content.style.overflowX = 'auto';
            content.style.wordBreak = 'break-all';
        } else {
            content.style.overflowX = 'visible';
            content.style.wordBreak = 'normal';
        }
        
        // 確保內容區域有足夠高度顯示所有按鈕
        const headerHeight = panel.querySelector('.panel-header')?.offsetHeight || 40;
        const availableHeight = height - headerHeight;
        
        if (availableHeight < minContentHeight) {
            content.style.overflowY = 'auto';
            content.style.maxHeight = availableHeight + 'px';
        } else {
            content.style.overflowY = 'auto';
            content.style.maxHeight = availableHeight + 'px';
        }
        
        // 調整按鈕大小
        const buttons = content.querySelectorAll('button');
        buttons.forEach(btn => {
            const btnFontSize = Math.max(9, baseFontSize - 1);
            btn.style.fontSize = btnFontSize + 'px';
            btn.style.padding = Math.max(4, btnFontSize / 2) + 'px ' + Math.max(6, btnFontSize) + 'px';
            btn.style.minHeight = (btnFontSize + 8) + 'px';
        });
        
        // 調整標題大小
        const titles = content.querySelectorAll('h3');
        titles.forEach(title => {
            title.style.fontSize = Math.max(11, baseFontSize + 1) + 'px';
        });
        
        // 調整區塊內邊距
        const sections = content.querySelectorAll('.copy-section');
        sections.forEach(section => {
            section.style.padding = Math.max(6, baseFontSize / 2) + 'px';
        });
    }

    /**
     * 創建彈出界面
     */
    function createCopyPanel() {
        if (copyPanel) return copyPanel;
        
        // 載入保存的大小設定
        loadPanelSizeScale();
        
        // 查找右側邊欄位置（Phone Finder 下方）
        const rightSidebar = document.querySelector('aside.sidebar.col.right');
        const phoneFinderTop = document.getElementById('phone-finder-top');
        
        // 計算初始位置（右下角，避免與其他元素重疊）
        let initialBottom = 20;
        let initialRight = 20;
        
        // 如果有右側邊欄，調整位置避免重疊
        if (rightSidebar) {
            const rect = rightSidebar.getBoundingClientRect();
            if (rect.bottom < window.innerHeight - 400) {
                // 如果右側邊欄上方有空間，放在上方
                initialBottom = window.innerHeight - rect.top + 20;
            }
        }
        
        // 獲取 GSMArena 主題配色
        const themeColor = getGSMArenaThemeColor();
        
        copyPanel = document.createElement('div');
        copyPanel.id = 'gsmarena-copy-panel';
        copyPanel.style.cssText = `
            position: fixed;
            bottom: ${initialBottom}px;
            right: ${initialRight}px;
            width: 300px;
            height: 470px;
            background: white;
            border: 2px solid ${themeColor};
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            overflow: hidden;
            min-width: 300px;
            min-height: 470px;
        `;
        
        // 標題欄（可拖移）
        const header = document.createElement('div');
        header.className = 'panel-header';
        header.style.cssText = `
            background: ${themeColor};
            color: white;
            padding: 10px 15px;
            cursor: move;
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
        `;
        
        // 版本號與大小控制（絕對定位在標題欄最左上角）
        const versionLabel = document.createElement('span');
        versionLabel.textContent = 'v' + VERSION;
        versionLabel.className = 'panel-version';
        versionLabel.style.cssText = `
            position: absolute;
            top: 2px;
            left: 2px;
            font-size: 8px;
            opacity: 0.4;
            user-select: none;
            pointer-events: none;
            z-index: 1;
            line-height: 1;
        `;
        
        const title = document.createElement('span');
        title.className = 'panel-title';
        title.textContent = getPhoneModel();
        title.style.fontWeight = 'bold';
        title.style.flex = '1';
        title.style.overflow = 'hidden';
        title.style.textOverflow = 'ellipsis';
        title.style.whiteSpace = 'nowrap';
        title.style.marginLeft = '0';
        title.style.paddingLeft = '0';
        
        const controls = document.createElement('div');
        controls.style.cssText = 'display: flex; gap: 10px;';
        
        header.appendChild(versionLabel);
        
        // 展開/縮小按鈕
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '−';
        toggleBtn.className = 'panel-toggle';
        toggleBtn.style.cssText = `
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
        `;
        
        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            togglePanel();
        });
        
        controls.appendChild(toggleBtn);
        header.appendChild(title);
        header.appendChild(controls);
        
        // 內容區域
        const content = document.createElement('div');
        content.className = 'panel-content';
        content.style.cssText = `
            padding: 10px;
            max-height: 430px;
            overflow-y: auto;
            box-sizing: border-box;
        `;
        
        // ===== v2.7 新增：發布/發售日期（年/月） =====
        const sectionLaunch = document.createElement('div');
        sectionLaunch.className = 'copy-section';
        sectionLaunch.style.cssText = `
            margin-bottom: 12px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #fafafa;
        `;

        const sectionLaunchTitle = document.createElement('h3');
        sectionLaunchTitle.className = 'section-title';
        sectionLaunchTitle.style.cssText = `
            margin: 0 0 8px 0;
            font-size: 18px;
            color: #333;
            font-weight: bold;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        const titleText = document.createElement('span');
        titleText.textContent = '發布日期 / 發售日期（年/月）';
        sectionLaunchTitle.appendChild(titleText);
        
        // 5G 標記（如果有 5G 支援）
        const badge5G = document.createElement('span');
        badge5G.className = 'badge-5g';
        badge5G.textContent = '5G';
        badge5G.style.cssText = `
            display: none;
            padding: 2px 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 6px;
            font-size: 11px;
            font-weight: bold;
            line-height: 1.2;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        sectionLaunchTitle.appendChild(badge5G);

        const launchBox = document.createElement('div');
        launchBox.className = 'section-content section-launch-content';
        launchBox.style.cssText = `
            background: #f5f5f5;
            padding: 8px;
            border: 1px solid #e0e0e0;
            border-radius: 3px;
            font-family: monospace;
            font-size: 12px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        `;

        function buildLaunchRow(rowClass, labelText, getValueFn, miniType) {
            const row = document.createElement('div');
            row.className = rowClass;
            row.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 4px 6px;
                border-radius: 3px;
            `;

            const label = document.createElement('div');
            label.textContent = labelText;
            label.style.cssText = `width: 88px; color:#333; flex: 0 0 auto;`;

            const val = document.createElement('div');
            val.className = `${rowClass}-value`;
            val.textContent = getValueFn() || '';
            val.style.cssText = `
                flex: 1 1 auto;
                color:#111;
                padding: 2px 6px;
                border-radius: 3px;
                background: rgba(255,255,255,0.7);
                border: 1px solid rgba(0,0,0,0.05);
            `;

            const currentTheme = themeOptions[selectedTheme] || themeOptions['default'];
            const btn = document.createElement('button');
            btn.textContent = '📋';
            btn.title = '點擊複製（單格）';
            btn.style.cssText = `
                flex: 0 0 auto;
                padding: 4px 8px;
                background: ${currentTheme.backgroundImage};
                background-color: ${currentTheme.backgroundColor};
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            `;

            btn.addEventListener('mouseenter', function() {
                this.style.opacity = '0.85';
                this.style.transform = 'scale(1.05)';
                showPreview(miniType);
            });

            btn.addEventListener('mouseleave', function() {
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            });

            btn.addEventListener('click', function() {
                const v = getValueFn() || '';
                copyToClipboard(v);
            });

            row.appendChild(label);
            row.appendChild(val);
            row.appendChild(btn);

            return { row, valEl: val, btnEl: btn };
        }

        const launchAnnouncedRow = buildLaunchRow(
            'launch-announced-row',
            '發布日期：',
            generateCopyLaunchAnnouncedSingle,
            'launch-announced'
        );

        const launchReleasedRow = buildLaunchRow(
            'launch-released-row',
            '發售日期：',
            generateCopyLaunchReleasedSingle,
            'launch-released'
        );

        launchBox.appendChild(launchAnnouncedRow.row);
        launchBox.appendChild(launchReleasedRow.row);

        const launchHint = document.createElement('div');
        launchHint.className = 'launch-hint';
        launchHint.style.cssText = `margin-top: 6px; font-size: 10px; color: #999; line-height: 1.4;`;
        launchHint.textContent = '複製為單格「年/月」便於直接貼到試算表。';

        sectionLaunch.appendChild(sectionLaunchTitle);
        sectionLaunch.appendChild(launchBox);
        sectionLaunch.appendChild(launchHint);

        // 區域1：面板＋指紋信息
        const section1 = document.createElement('div');
        section1.className = 'copy-section';
        section1.style.cssText = `
            margin-bottom: 12px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #fafafa;
        `;
        
        const section1Title = document.createElement('h3');
        section1Title.className = 'section-title';
        section1Title.textContent = '面板 ＋ 指紋位置、類型';
        section1Title.style.cssText = `
            margin: 0 0 8px 0;
            font-size: 18px;
            color: #333;
            font-weight: bold;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 6px;
        `;
        
        const section1Content = document.createElement('div');
        section1Content.className = 'section-content section-1-content';
        section1Content.style.cssText = `
            background: #f5f5f5;
            padding: 8px;
            border: 1px solid #e0e0e0;
            border-radius: 3px;
            margin-bottom: 8px;
            font-family: monospace;
            white-space: pre-wrap;
            word-break: break-all;
            font-size: 12px;
        `;
        section1Content.textContent = generateCopyText1();
        
        const section1CopyBtn = document.createElement('button');
        section1CopyBtn.textContent = '📋 複製區域1';
        section1CopyBtn.style.cssText = `
            width: 100%;
            padding: 6px;
            background: ${themeColor};
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            margin-bottom: 6px;
        `;
        section1CopyBtn.addEventListener('click', function() {
            copyToClipboard(generateCopyText1());
        });
        
        const section1Note = document.createElement('div');
        section1Note.className = 'section-note';
        section1Note.style.cssText = `
            font-size: 10px;
            color: #999;
            font-style: italic;
            line-height: 1.4;
        `;
        section1Note.innerHTML = '⚠️注意⚠️ 預設填入"全面屏"<br>需自行確認 [水滴屏、曲面屏] 面板樣式';
        
        section1.appendChild(section1Title);
        section1.appendChild(section1Content);
        section1.appendChild(section1CopyBtn);
        section1.appendChild(section1Note);
        
        // 區域2：尺寸信息
        const section2 = document.createElement('div');
        section2.className = 'copy-section';
        section2.style.cssText = `
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #fafafa;
        `;
        
        const section2Title = document.createElement('h3');
        section2Title.className = 'section-title';
        section2Title.textContent = '長寬厚（mm）';
        section2Title.style.cssText = `
            margin: 0 0 8px 0;
            font-size: 18px;
            color: #333;
            font-weight: bold;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 6px;
        `;
        
        const section2Content = document.createElement('div');
        section2Content.className = 'section-content section-2-content';
        section2Content.style.cssText = `
            background: #f5f5f5;
            padding: 8px;
            border: 1px solid #e0e0e0;
            border-radius: 3px;
            margin-bottom: 8px;
            font-family: monospace;
            white-space: pre-wrap;
            word-break: break-all;
            font-size: 12px;
        `;
        section2Content.textContent = generateCopyText2();
        
        const section2CopyBtn = document.createElement('button');
        section2CopyBtn.textContent = '📋 複製區域2';
        section2CopyBtn.className = 'section-2-copy-btn';
        section2CopyBtn.style.cssText = `
            width: 100%;
            padding: 6px;
            background: ${themeColor};
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        `;
        section2CopyBtn.addEventListener('click', function() {
            copyToClipboard(generateCopyText2());
        });
        
        section2.appendChild(section2Title);
        section2.appendChild(section2Content);
        section2.appendChild(section2CopyBtn);
        
        // 組裝
        content.appendChild(sectionLaunch);
        content.appendChild(section1);
        content.appendChild(section2);
        
        // 定期更新內容
        setInterval(function() {
            const newModel = getPhoneModel();
            if (title.textContent !== newModel) {
                title.textContent = newModel;
            }
            
            // Refresh extracted data
            refreshLaunchData();
            check5GSupport();
            
            // 更新 5G 標記顯示
            if (badge5G) {
                badge5G.style.display = extractedData.has5G ? 'inline-block' : 'none';
            }
            
            // 更新面板內容
            if (section1Content) section1Content.textContent = generateCopyText1();
            if (section2Content) section2Content.textContent = generateCopyText2();
            launchAnnouncedRow.valEl.textContent = generateCopyLaunchAnnouncedSingle() || '';
            launchReleasedRow.valEl.textContent = generateCopyLaunchReleasedSingle() || '';
        }, 1000);
        
        copyPanel.appendChild(header);
        copyPanel.appendChild(content);
        
        // 實現拖移功能
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        
        header.addEventListener('mousedown', function(e) {
            if (e.target === toggleBtn || e.target.closest('button')) return;
            isDragging = true;
            const rect = copyPanel.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            // 限制在視窗內
            const maxX = window.innerWidth - copyPanel.offsetWidth;
            const maxY = window.innerHeight - copyPanel.offsetHeight;
            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));
            
            copyPanel.style.left = currentX + 'px';
            copyPanel.style.top = currentY + 'px';
            copyPanel.style.right = 'auto';
            copyPanel.style.bottom = 'auto';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
        
        // 添加邊框調整大小功能
        addResizeHandles(copyPanel, {
            minWidth: 300,
            minHeight: 470, // 最小高度，確保複製按鈕不被隱藏
            onResize: function(width, height) {
                responsiveContent(copyPanel, width, height);
                // 確保區域2的複製按鈕可見
                ensureCopyButtonVisible();
            }
        });
        
        // 確保複製按鈕可見的函數
        function ensureCopyButtonVisible() {
            const section2CopyBtn = copyPanel.querySelector('.section-2-copy-btn');
            if (section2CopyBtn) {
                const btnRect = section2CopyBtn.getBoundingClientRect();
                const panelRect = copyPanel.getBoundingClientRect();
                // 如果按鈕被隱藏，調整內容區域或面板高度
                if (btnRect.bottom > panelRect.bottom - 10) {
                    const content = copyPanel.querySelector('.panel-content');
                    if (content) {
                        const currentHeight = copyPanel.offsetHeight;
                        const headerHeight = copyPanel.querySelector('.panel-header').offsetHeight;
                        const neededHeight = headerHeight + content.scrollHeight + 20;
                        if (neededHeight > currentHeight) {
                            copyPanel.style.height = Math.max(280, neededHeight) + 'px';
                        }
                    }
                }
            }
        }
        
        document.body.appendChild(copyPanel);
        
        // 應用初始大小設定
        applyPanelSizeScale();
        
        return copyPanel;
    }

    /**
     * 切換面板展開/縮小狀態
     */
    function togglePanel() {
        if (!copyPanel) return;
        
        isPanelMinimized = !isPanelMinimized;
        const content = copyPanel.querySelector('.panel-content');
        const toggleBtn = copyPanel.querySelector('.panel-toggle');
        const resizeHandles = copyPanel.querySelectorAll('.resize-handle');
        
        if (isPanelMinimized) {
            content.style.display = 'none';
            copyPanel.style.width = 'auto';
            copyPanel.style.height = 'auto';
            copyPanel.style.minWidth = 'auto';
            copyPanel.style.minHeight = 'auto';
            toggleBtn.textContent = '+';
            copyPanel.style.opacity = '0.7';
            // 隱藏調整大小手柄
            resizeHandles.forEach(handle => {
                handle.style.display = 'none';
            });
        } else {
            content.style.display = 'block';
            copyPanel.style.width = '300px';
            copyPanel.style.height = '470px';
            copyPanel.style.minWidth = '300px';
            copyPanel.style.minHeight = '470px';
            toggleBtn.textContent = '−';
            copyPanel.style.opacity = '1';
            // 顯示調整大小手柄
            resizeHandles.forEach(handle => {
                handle.style.display = 'block';
            });
            // 觸發內容響應
            responsiveContent(copyPanel, copyPanel.offsetWidth, copyPanel.offsetHeight);
        }
    }

    /**
     * 創建開發者設置界面
     */
    function createDevPanel() {
        if (devPanel) return devPanel;
        
        const themeColor = getGSMArenaThemeColor();
        
        devPanel = document.createElement('div');
        devPanel.id = 'gsmarena-dev-panel';
        devPanel.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 500px;
            height: 600px;
            background: #1e1e1e;
            color: #d4d4d4;
            border: 2px solid ${themeColor};
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10001;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 12px;
            display: none;
            overflow: hidden;
            min-width: 400px;
            min-height: 300px;
        `;
        
        const header = document.createElement('div');
        header.className = 'dev-panel-header';
        header.style.cssText = `
            background: ${themeColor};
            color: white;
            padding: 10px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
        `;
        
        const title = document.createElement('span');
        title.textContent = '開發者設置界面';
        title.style.fontWeight = 'bold';
        title.style.flex = '1';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 20px;
            line-height: 1;
        `;
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            devPanel.style.display = 'none';
            isDevPanelVisible = false;
        });
        
        // 實現拖移功能
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        
        header.addEventListener('mousedown', function(e) {
            if (e.target === closeBtn || e.target.closest('button')) return;
            isDragging = true;
            const rect = devPanel.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            // 限制在視窗內
            const maxX = window.innerWidth - devPanel.offsetWidth;
            const maxY = window.innerHeight - devPanel.offsetHeight;
            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));
            
            devPanel.style.left = currentX + 'px';
            devPanel.style.top = currentY + 'px';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        const content = document.createElement('div');
        content.className = 'dev-content';
        content.style.cssText = `
            padding: 15px;
            max-height: 550px;
            overflow-y: auto;
        `;
        
        // 更新開發者信息
        function updateDevInfo() {
            const themeColor = getGSMArenaThemeColor();
            const dimEl = document.querySelector('td[data-spec="dimensions"]');
            const senEl = document.querySelector('td[data-spec="sensors"]');
            const yearEl = document.querySelector('td[data-spec="year"]');
            const statusEl = document.querySelector('td[data-spec="status"]');
            
            const dimRaw = normalizeSpaces(dimEl ? dimEl.textContent : '未找到');
            const senRaw = normalizeSpaces(senEl ? senEl.textContent : '未找到');
            const yearRaw = normalizeSpaces(yearEl ? yearEl.textContent : '未找到');
            const statusRaw = normalizeSpaces(statusEl ? statusEl.textContent : '未找到');
            
            const announcedYM = extractedData.launch.announcedYM || '(空)';
            const releasedYM = extractedData.launch.releasedYM || '(空)';
            
            content.innerHTML = `
                <div style="margin-bottom:14px;">
                    <h3 style="color:${themeColor};margin:0 0 10px 0;font-size:14px;">Launch 日期 (年/月)</h3>
                    <div style="background:#252526;padding:10px;border-radius:4px;">
                        <div style="color:#9cdcfe;margin-bottom:5px;">Announced 原始文本:</div>
                        <div style="color:#ce9178;margin-left:15px;">${yearRaw}</div>
                        <div style="color:#9cdcfe;margin-top:10px;margin-bottom:5px;">Status/Released 原始文本:</div>
                        <div style="color:#ce9178;margin-left:15px;">${statusRaw}</div>
                        <div style="color:#9cdcfe;margin-top:10px;margin-bottom:5px;">解析結果:</div>
                        <div style="color:#ce9178;margin-left:15px;">
                            發布日期(年/月): ${announcedYM}<br>
                            發售日期(年/月): ${releasedYM}
                        </div>
                    </div>
                </div>
                <div style="margin-bottom:14px;">
                    <h3 style="color: ${themeColor}; margin: 0 0 10px 0; font-size: 14px;">尺寸信息 (Dimensions)</h3>
                    <div style="background: #252526; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
                        <div style="color: #9cdcfe; margin-bottom: 5px;">原始文本:</div>
                        <div style="color: #ce9178; margin-left: 15px;">${dimRaw}</div>
                        <div style="color: #9cdcfe; margin-top: 10px; margin-bottom: 5px;">解析結果:</div>
                        <div style="color: #ce9178; margin-left: 15px;">
                            長: ${extractedData.dimensions.length || '(空)'}<br>
                            寬: ${extractedData.dimensions.width || '(空)'}<br>
                            厚: ${extractedData.dimensions.thickness || '(空)'}
                        </div>
                        <div style="color: #9cdcfe; margin-top: 10px; margin-bottom: 5px;">複製內容:</div>
                        <div style="color: #ce9178; margin-left: 15px; font-family: monospace;">${generateCopyText2()}</div>
                    </div>
                </div>
                
                <div style="margin-bottom:14px;">
                    <h3 style="color: ${themeColor}; margin: 0 0 10px 0; font-size: 14px;">傳感器信息 (Sensors)</h3>
                    <div style="background: #252526; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
                        <div style="color: #9cdcfe; margin-bottom: 5px;">原始文本:</div>
                        <div style="color: #ce9178; margin-left: 15px;">${senRaw}</div>
                        <div style="color: #9cdcfe; margin-top: 10px; margin-bottom: 5px;">解析結果:</div>
                        <div style="color: #ce9178; margin-left: 15px;">
                            指紋位置: ${extractedData.fingerprint.position || '(空)'}<br>
                            屏下類型: ${extractedData.fingerprint.type || '(空)'}
                        </div>
                        <div style="color: #9cdcfe; margin-top: 10px; margin-bottom: 5px;">複製內容:</div>
                        <div style="color: #ce9178; margin-left: 15px; font-family: monospace;">${generateCopyText1()}</div>
                    </div>
                </div>
                
                <div style="margin-top:18px;padding-top:12px;border-top:1px solid #444;">
                    <div style="color: #9cdcfe; margin-bottom: 5px;">變數名稱:</div>
                    <div style="color: #ce9178; margin-left: 15px; font-family: monospace;">
                        extractedData.dimensions<br>
                        extractedData.fingerprint<br>
                        extractedData.launch<br>
                        generateCopyText1()<br>
                        generateCopyText2()<br>
                        generateCopyLaunchAnnouncedSingle()<br>
                        generateCopyLaunchReleasedSingle()
                    </div>
                </div>
            `;
        }
        
        devPanel.appendChild(header);
        devPanel.appendChild(content);
        
        // 添加邊框調整大小功能
        addResizeHandles(devPanel, {
            minWidth: 400,
            minHeight: 300,
            onResize: function(width, height) {
                responsiveContent(devPanel, width, height);
            }
        });
        
        document.body.appendChild(devPanel);
        
        // 定期更新信息
        setInterval(updateDevInfo, 1000);
        updateDevInfo();
        
        return devPanel;
    }

    /**
     * 檢測是否有 5G 支援
     */
    function check5GSupport() {
        const nettechElement = document.querySelector('a[data-spec="nettech"], td[data-spec="nettech"]');
        if (nettechElement) {
            const text = (nettechElement.textContent || '').toUpperCase();
            extractedData.has5G = text.includes('5G');
        } else {
            extractedData.has5G = false;
        }
        return extractedData.has5G;
    }

    /**
     * 初始化跨頁面通信機制
     */
    function initCrossPageCommunication() {
        // 創建 BroadcastChannel
        try {
            broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
            
            // 監聽其他頁面的數據更新
            broadcastChannel.onmessage = function(event) {
                if (event.data && event.data.type === 'data-updated') {
                    summaryNewDataPending = true;
                    const btn = document.getElementById('summary-refresh-btn');
                    if (btn) {
                        btn.classList.add('breathing-green');
                        btn.textContent = '刷新數據';
                        btn.disabled = false;
                        btn.style.opacity = '1';
                    }
                }
            };
        } catch (e) {
            console.warn('BroadcastChannel 不支持，使用 localStorage 替代:', e);
        }
        
        // 頁面關閉時清除所有數據與設定
        window.addEventListener('beforeunload', function() {
            clearAllData(true);
        });
    }

    /**
     * 收集當前頁面的數據
     */
    function collectCurrentPageData() {
        const model = getPhoneModel();
        if (!model || model === '快速複製面板') {
            return null;
        }
        
        refreshCoreData();
        
        const data = {
            pageId: window.location.href,
            model: model,
            openTime: pageOpenTime,
            data: {
                announcedYM: extractedData.launch.announcedYM || '',
                releasedYM: extractedData.launch.releasedYM || '',
                panelType: '全面屏',
                frontCameraPos: '中上',
                fingerprintPos: extractedData.fingerprint.position || '無',
                fingerprintType: extractedData.fingerprint.type || '',
                length: extractedData.dimensions.length || '',
                width: extractedData.dimensions.width || '',
                thickness: extractedData.dimensions.thickness || '',
                has5G: extractedData.has5G ? '是' : '否'
            }
        };
        
        // 確保所有自定義列也有對應的數據
        const columnOrder = JSON.parse(localStorage.getItem('gsmarena-column-order') || 'null');
        if (columnOrder) {
            columnOrder.forEach(col => {
                if (col.key.startsWith('custom_') && !data.data[col.key]) {
                    data.data[col.key] = '';
                }
            });
        }
        
        collectedData = data;
        return data;
    }

    /**
     * 保存數據到共享存儲
     */
    function saveDataToStorage(data) {
        if (!data) return;
        
        try {
            const allData = getAllDataFromStorage();
            // 檢查是否已存在（根據 pageId）
            const existingIndex = allData.findIndex(item => item.pageId === data.pageId);
            if (existingIndex >= 0) {
                allData[existingIndex] = data;
            } else {
                allData.push(data);
            }
            
            // 按打開時間排序
            allData.sort((a, b) => a.openTime - b.openTime);
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
            
            // 廣播更新
            if (broadcastChannel) {
                broadcastChannel.postMessage({ type: 'data-updated' });
            } else {
                // 使用 storage 事件作為備選
                window.dispatchEvent(new StorageEvent('storage', {
                    key: STORAGE_KEY,
                    newValue: JSON.stringify(allData)
                }));
            }
        } catch (e) {
            console.warn('無法保存數據:', e);
        }
    }

    /**
     * 從共享存儲獲取所有數據
     */
    function getAllDataFromStorage() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.warn('無法讀取數據:', e);
            return [];
        }
    }

    /**
     * 清除當前頁面的數據
     */
    function clearCurrentPageData() {
        try {
            const allData = getAllDataFromStorage();
            const filtered = allData.filter(item => item.pageId !== window.location.href);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
            
            if (broadcastChannel) {
                broadcastChannel.postMessage({ type: 'data-updated' });
            }
        } catch (e) {
            console.warn('無法清除數據:', e);
        }
    }

    /**
     * 清除所有數據
     */
    function clearAllData(resetSettings = false) {
        try {
            localStorage.removeItem(STORAGE_KEY);
            lastSummarySnapshot = ''; // 立即重置快照
            summaryNewDataPending = false;
            
            if (resetSettings) {
                localStorage.removeItem('gsmarena-column-order');
                localStorage.removeItem('gsmarena-column-widths');
                localStorage.removeItem('gsmarena-row-heights');
                localStorage.removeItem('gsmarena-summary-size-scale');
                columnWidthMap = {};
                rowHeightMap = {};
                summarySizeScale = 1;
            }
            
            if (broadcastChannel) {
                broadcastChannel.postMessage({ type: 'data-updated' });
            }
            if (summaryPanel) {
                refreshSummaryTable(true);
            }
        } catch (e) {
            console.warn('無法清除所有數據:', e);
        }
    }

    /**
     * 自動收集數據（頁面加載時）
     */
    function autoCollectData() {
        const data = collectCurrentPageData();
        if (data) {
            saveDataToStorage(data);
        }
    }

    /**
     * 刷新核心數據
     */
    function refreshCoreData() {
        const dimensionsElement = document.querySelector('td[data-spec="dimensions"]');
        if (dimensionsElement) {
            extractedData.dimensions = parseDimensions(dimensionsElement);
        }
        
        const sensorsElement = document.querySelector('td[data-spec="sensors"]');
        if (sensorsElement) {
            extractedData.fingerprint = parseFingerprint(sensorsElement);
        }
        
        refreshLaunchData();
        check5GSupport();
    }

    /**
     * 創建匯總表格面板
     */
    function createSummaryPanel() {
        if (summaryPanel) return summaryPanel;
        
        // 初始化尺寸配置與樣式
        const summaryStylesId = 'gsmarena-summary-styles';
        if (!document.getElementById(summaryStylesId)) {
            const styleEl = document.createElement('style');
            styleEl.id = summaryStylesId;
            styleEl.textContent = `
                @keyframes breathing-green {
                    0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
                    50% { box-shadow: 0 0 8px 4px rgba(76, 175, 80, 0.25); }
                    100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
                }
                .breathing-green {
                    animation: breathing-green 1.6s ease-in-out infinite;
                }
                .drag-source {
                    outline: 2px solid #4caf50;
                    background: #e8f5e9 !important;
                }
                .drag-target {
                    outline: 2px dashed #2196f3;
                    background: #e3f2fd !important;
                }
            `;
            document.head.appendChild(styleEl);
        }
        
        const themeColor = getGSMArenaThemeColor();
        
        summaryPanel = document.createElement('div');
        summaryPanel.id = 'gsmarena-summary-panel';
        summaryPanel.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 900px;
            height: 700px;
            background: white;
            border: 2px solid ${themeColor};
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10001;
            font-family: Arial, sans-serif;
            font-size: 13px;
            display: none;
            overflow: hidden;
            min-width: 600px;
            min-height: 400px;
        `;
        
        const header = document.createElement('div');
        header.className = 'summary-panel-header';
        header.style.cssText = `
            background: ${themeColor};
            color: white;
            padding: 10px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
        `;
        
        const title = document.createElement('span');
        title.textContent = '數據匯總表格';
        title.style.fontWeight = 'bold';
        title.style.flex = '1';

        // 表格大小控制
        const summarySizeControl = document.createElement('div');
        summarySizeControl.style.cssText = `
            display: flex;
            align-items: center;
            gap: 6px;
            margin-right: 10px;
        `;
        const summarySizeLabel = document.createElement('span');
        summarySizeLabel.textContent = '表格大小';
        summarySizeLabel.style.fontSize = '12px';
        const summarySizeMinus = document.createElement('button');
        summarySizeMinus.textContent = '−';
        summarySizeMinus.style.cssText = `
            width: 24px;height:24px;border:none;border-radius:4px;
            background: rgba(255,255,255,0.2);color:white;cursor:pointer;font-size:14px;line-height:1;
        `;
        const summarySizeValue = document.createElement('span');
        summarySizeValue.style.cssText = 'min-width:42px;text-align:center;font-size:12px;';
        const summarySizePlus = document.createElement('button');
        summarySizePlus.textContent = '+';
        summarySizePlus.style.cssText = `
            width: 24px;height:24px;border:none;border-radius:4px;
            background: rgba(255,255,255,0.2);color:white;cursor:pointer;font-size:14px;line-height:1;
        `;
        const applySummarySizeScale = () => {
            if (!summaryPanel) return;
            const container = summaryPanel.querySelector('#summary-table-container');
            if (container) {
                container.style.transform = `scale(${summarySizeScale})`;
                container.style.transformOrigin = 'top left';
            }
            summarySizeValue.textContent = Math.round(summarySizeScale * 100) + '%';
            try { localStorage.setItem('gsmarena-summary-size-scale', summarySizeScale.toString()); } catch (e) {}
        };
        summarySizeMinus.addEventListener('click', (e) => {
            e.stopPropagation();
            summarySizeScale = Math.max(0.7, summarySizeScale - 0.1);
            applySummarySizeScale();
        });
        summarySizePlus.addEventListener('click', (e) => {
            e.stopPropagation();
            summarySizeScale = Math.min(1.6, summarySizeScale + 0.1);
            applySummarySizeScale();
        });
        summarySizeControl.appendChild(summarySizeLabel);
        summarySizeControl.appendChild(summarySizeMinus);
        summarySizeControl.appendChild(summarySizeValue);
        summarySizeControl.appendChild(summarySizePlus);
        try {
            const saved = localStorage.getItem('gsmarena-summary-size-scale');
            if (saved) summarySizeScale = Math.min(1.6, Math.max(0.7, parseFloat(saved)));
        } catch (e) {}
        summarySizeValue.textContent = Math.round(summarySizeScale * 100) + '%';
        
         const refreshBtn = document.createElement('button');
        refreshBtn.id = 'summary-refresh-btn';
        refreshBtn.textContent = '抓取數據';
        refreshBtn.title = '點擊刷新數據，按住3秒清除所有數據';
        refreshBtn.style.cssText = `
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            margin-right: 10px;
            transition: all 0.2s;
        `;
        
        // 刷新按鈕狀態管理
        function updateRefreshButton() {
            const allData = getAllDataFromStorage();
            const hasData = allData.length > 0;
            refreshBtn.textContent = hasData ? '刷新數據' : '抓取數據';
            refreshBtn.style.opacity = hasData ? '1' : '0.8';
            refreshBtn.style.cursor = 'pointer';
            refreshBtn.disabled = false;
            if (!summaryNewDataPending) {
                refreshBtn.classList.remove('breathing-green');
            }
        }
        
        // 刷新數據
        let refreshTimeout = null;
        let longPressDelayTimer = null;
        const LONG_PRESS_DELAY = 300; // 延遲 300ms 才開始判斷為長按
        
        refreshBtn.addEventListener('mousedown', function(e) {
            e.preventDefault();
            
            // 延遲啟動長按檢測，避免點擊被誤判為長按
            longPressDelayTimer = setTimeout(function() {
                // 超過延遲時間才啟動長按清除（進度條效果）
                let elapsed = 0;
                refreshBtn.style.background = 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.4) 0%, transparent 0%)';
                refreshTimeout = setInterval(function() {
                    elapsed += 100;
                    const pct = Math.min(100, Math.round(elapsed / 30));
                    refreshBtn.style.background = `linear-gradient(90deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.45) ${pct}%, transparent ${pct}%)`;
                    if (elapsed >= 3000) {
                        clearInterval(refreshTimeout);
                        refreshTimeout = null;
                        if (confirm('確定要清除所有數據並重置表格？')) {
                            clearAllData(true);
                            summaryNewDataPending = false;
                            refreshBtn.classList.remove('breathing-green');
                            updateRefreshButton();
                        }
                        refreshBtn.style.background = 'rgba(255,255,255,0.2)';
                    }
                }, 100);
            }, LONG_PRESS_DELAY);
        });
        
        refreshBtn.addEventListener('mouseup', function(e) {
            // 清除延遲定時器
            if (longPressDelayTimer) {
                clearTimeout(longPressDelayTimer);
                longPressDelayTimer = null;
            }
            
            if (refreshTimeout) {
                // 長按清除流程
                clearInterval(refreshTimeout);
                refreshTimeout = null;
                refreshBtn.style.background = 'rgba(255,255,255,0.2)';
                return; // 長按時不執行刷新
            }
            
            // 快速點擊：先刷新核心數據，再收集，再保存，最後刷新表格
            refreshCoreData(); // 確保數據是最新的
            const collected = collectCurrentPageData();
            
            if (collected) {
                saveDataToStorage(collected);
                // 使用 setTimeout 確保數據已保存
                setTimeout(() => {
                    refreshSummaryTable(true);
                    summaryNewDataPending = false;
                    refreshBtn.classList.remove('breathing-green');
                    updateRefreshButton();
                    // 更新快照（在數據保存後）
                    const allData = getAllDataFromStorage();
                    lastSummarySnapshot = JSON.stringify(allData);
                }, 50);
            } else {
                showToast('無法收集當前頁面數據，請確認頁面已完全載入', '#d9534f');
            }
        });
        
        refreshBtn.addEventListener('mouseleave', function() {
            // 清除延遲定時器
            if (longPressDelayTimer) {
                clearTimeout(longPressDelayTimer);
                longPressDelayTimer = null;
            }
            if (refreshTimeout) {
                clearInterval(refreshTimeout);
                refreshTimeout = null;
                refreshBtn.style.background = 'rgba(255,255,255,0.2)';
            }
        });
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 20px;
            line-height: 1;
        `;
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            summaryPanel.style.display = 'none';
            isSummaryPanelVisible = false;
        });
        
        header.appendChild(title);
        header.appendChild(summarySizeControl);
        header.appendChild(refreshBtn);
        header.appendChild(closeBtn);
        
        // 實現拖移功能
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        
        header.addEventListener('mousedown', function(e) {
            if (e.target === closeBtn || e.target === refreshBtn || e.target.closest('button')) return;
            isDragging = true;
            const rect = summaryPanel.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            const maxX = window.innerWidth - summaryPanel.offsetWidth;
            const maxY = window.innerHeight - summaryPanel.offsetHeight;
            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));
            
            summaryPanel.style.left = currentX + 'px';
            summaryPanel.style.top = currentY + 'px';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
        
        const content = document.createElement('div');
        content.className = 'summary-content';
        content.style.cssText = `
            padding: 15px;
            height: calc(100% - 50px);
            overflow: auto;
        `;
        
        // 表格容器
        const tableContainer = document.createElement('div');
        tableContainer.id = 'summary-table-container';
        tableContainer.style.cssText = `
            width: 100%;
            overflow: auto;
        `;
        
        content.appendChild(tableContainer);
        summaryPanel.appendChild(header);
        summaryPanel.appendChild(content);
        
        // 添加邊框調整大小功能
        addResizeHandles(summaryPanel, {
            minWidth: 600,
            minHeight: 400,
            onResize: function(width, height) {
                content.style.height = (height - 50) + 'px';
            }
        });
        
         document.body.appendChild(summaryPanel);
        
        // 初始化刷新按鈕狀態
        updateRefreshButton();
        
        // 定期更新按鈕狀態（僅在面板顯示時）
        setInterval(function() {
            if (isSummaryPanelVisible) {
                updateRefreshButton();
            }
        }, 1000);
        
        // 監聽 storage 事件（跨頁面數據更新）- 不自動刷新，只給提示
        window.addEventListener('storage', function(e) {
            if (e.key === STORAGE_KEY) {
                const snapshot = e.newValue || '';
                if (snapshot && snapshot !== lastSummarySnapshot) {
                    summaryNewDataPending = true;
                    refreshBtn.classList.add('breathing-green');
                    refreshBtn.textContent = '刷新數據';
                    refreshBtn.disabled = false;
                    refreshBtn.style.opacity = '1';
                }
            }
        });
        
        return summaryPanel;
    }

    /**
     * 刷新匯總表格
     */
    function refreshSummaryTable(isManual = false) {
        if (!summaryPanel) return;
        
        const container = summaryPanel.querySelector('#summary-table-container');
        if (!container) return;

        // 讀取儲存的行列尺寸
        try {
            columnWidthMap = JSON.parse(localStorage.getItem('gsmarena-column-widths') || '{}');
        } catch (e) { columnWidthMap = {}; }
        try {
            rowHeightMap = JSON.parse(localStorage.getItem('gsmarena-row-heights') || '{}');
        } catch (e) { rowHeightMap = {}; }
        
        const allData = getAllDataFromStorage();
        // 只在手動刷新且數據已保存後才更新快照
        if (isManual) {
            summaryNewDataPending = false;
            // 延遲更新快照，確保數據已保存
            setTimeout(() => {
                lastSummarySnapshot = JSON.stringify(getAllDataFromStorage());
            }, 100);
        } else {
            // 自動刷新時不更新快照（避免覆蓋新數據提示）
            lastSummarySnapshot = JSON.stringify(allData);
        }
        
        // 定義列配置（可拖拽調整順序）
        let columnOrder = JSON.parse(localStorage.getItem('gsmarena-column-order') || 'null');
        if (!columnOrder) {
            columnOrder = [
                { key: 'model', label: '型號名稱' },
                { key: 'announcedYM', label: '發布日期（年/月）' },
                { key: 'releasedYM', label: '發售日期（年/月）' },
                { key: 'panelType', label: '面板類型' },
                { key: 'frontCameraPos', label: '前置攝像頭位置' },
                { key: 'fingerprintPos', label: '指紋位置' },
                { key: 'fingerprintType', label: '屏下指紋類型' },
                { key: 'length', label: '長度（mm）' },
                { key: 'width', label: '寬度（mm）' },
                { key: 'thickness', label: '厚度（mm）' },
                { key: 'has5G', label: '5G支持' }
            ];
        }
        
        // 創建表格
        const table = document.createElement('table');
        table.id = 'summary-table';
        table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            background: white;
        `;
        
        // 創建表頭
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.style.cssText = 'background: #f5f5f5;';
        
        // 添加行號列 + 行控制 / 複製
        const rowNumHeader = document.createElement('th');
        rowNumHeader.style.cssText = `
            padding: 8px;
            border: 1px solid #ddd;
            text-align: center;
            min-width: 40px;
            background: #f0f0f0;
            position: sticky;
            left: 0;
            z-index: 10;
        `;
        headerRow.appendChild(rowNumHeader);
        
        // 添加列標題（可拖拽）
        columnOrder.forEach((col, colIndex) => {
            const th = document.createElement('th');
            th.dataset.columnKey = col.key;
            th.dataset.columnIndex = colIndex;
            th.style.cssText = `
                padding: 0;
                border: 1px solid #ddd;
                text-align: center;
                min-width: ${columnWidthMap[col.key] || 120}px;
                user-select: none;
                background: #f0f0f0;
                position: relative;
            `;
            const colInner = document.createElement('div');
            colInner.style.cssText = `
                padding: 8px;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
            `;
            const colDragHandle = document.createElement('div');
            colDragHandle.textContent = col.label;
            colDragHandle.style.cssText = `
                width: 100%;
                height: 100%;
                cursor: move;
            `;
            colDragHandle.draggable = true;
            colInner.appendChild(colDragHandle);
            th.appendChild(colInner);
            
            // 列複製按鈕（移至右上角，避免與標題重疊）
            const colCopyBtn = document.createElement('button');
            colCopyBtn.textContent = '📋';
            colCopyBtn.title = '複製整列';
            colCopyBtn.style.cssText = `
                position: absolute;
                right: 2px;
                top: 2px;
                background: rgba(0,0,0,0.1);
                border: none;
                border-radius: 2px;
                cursor: pointer;
                font-size: 9px;
                padding: 1px 3px;
                opacity: 0.6;
                z-index: 12;
                line-height: 1;
                min-width: 16px;
                min-height: 16px;
            `;
            colCopyBtn.addEventListener('mouseenter', function() {
                this.style.opacity = '1';
                this.style.background = 'rgba(0,0,0,0.2)';
            });
            colCopyBtn.addEventListener('mouseleave', function() {
                this.style.opacity = '0.6';
                this.style.background = 'rgba(0,0,0,0.1)';
            });
            colCopyBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                copyColumn(col.key, columnOrder);
            });
            th.appendChild(colCopyBtn);

            // 列寬拖曳控制（類似 Excel）
            const colResizer = document.createElement('div');
            colResizer.className = 'col-resizer';
            colResizer.style.cssText = `
                position: absolute;
                top: 0;
                right: -3px;
                width: 6px;
                height: 100%;
                cursor: col-resize;
                z-index: 11;
            `;
            let startX = 0;
            let startWidth = 0;
            const onColResizeMove = (e) => {
                const delta = e.clientX - startX;
                let newW = Math.max(80, Math.min(500, startWidth + delta));
                th.style.minWidth = newW + 'px';
                columnWidthMap[col.key] = newW;
            };
            const onColResizeUp = () => {
                document.removeEventListener('mousemove', onColResizeMove);
                document.removeEventListener('mouseup', onColResizeUp);
                localStorage.setItem('gsmarena-column-widths', JSON.stringify(columnWidthMap));
                refreshSummaryTable(true);
            };
            colResizer.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                startX = e.clientX;
                startWidth = th.offsetWidth;
                document.addEventListener('mousemove', onColResizeMove);
                document.addEventListener('mouseup', onColResizeUp);
            });
            th.appendChild(colResizer);
            
            // 拖拽功能
            colDragHandle.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', colIndex);
                e.dataTransfer.effectAllowed = 'move';
                th.classList.add('drag-source');
            });
            colDragHandle.addEventListener('dragend', function() {
                th.classList.remove('drag-source');
            });
            th.addEventListener('dragover', function(e) {
                e.preventDefault();
                const targetIndex = parseInt(e.currentTarget.dataset.columnIndex);
                if (targetIndex !== colIndex) {
                    e.currentTarget.classList.add('drag-target');
                }
            });
            th.addEventListener('dragleave', function(e) {
                e.currentTarget.classList.remove('drag-target');
            });
            th.addEventListener('drop', function(e) {
                e.preventDefault();
                e.currentTarget.classList.remove('drag-target');
                const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
                if (sourceIndex !== colIndex) {
                    // 交換列順序
                    const temp = columnOrder[sourceIndex];
                    columnOrder[sourceIndex] = columnOrder[colIndex];
                    columnOrder[colIndex] = temp;
                    localStorage.setItem('gsmarena-column-order', JSON.stringify(columnOrder));
                    refreshSummaryTable();
                }
            });
            
            headerRow.appendChild(th);
        });
        
        // 添加新增列按鈕
        const addColHeader = document.createElement('th');
        addColHeader.style.cssText = `
            padding: 0;
            border: 1px solid #ddd;
            min-width: 120px;
            background: #e8f5e9;
            text-align: center;
        `;
        const addColBtn = document.createElement('button');
        addColBtn.textContent = '+ 新增列';
        addColBtn.style.cssText = `
            width: 100%;
            height: 100%;
            padding: 12px 8px;
            border: none;
            background: #e8f5e9;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
        `;
        addColBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const colName = prompt('請輸入新列名稱:');
            if (colName) {
                const newKey = 'custom_' + Date.now();
                columnOrder.push({ key: newKey, label: colName });
                // 填充現有資料的空值
                const allData = getAllDataFromStorage();
                allData.forEach(item => {
                    if (!item.data) item.data = {};
                    if (item.data[newKey] === undefined) item.data[newKey] = '';
                });
                localStorage.setItem('gsmarena-column-order', JSON.stringify(columnOrder));
                localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
                refreshSummaryTable(true);
            }
        });
        addColHeader.appendChild(addColBtn);
        headerRow.appendChild(addColHeader);
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // 創建表體
        const tbody = document.createElement('tbody');
        
        // 添加數據行（可拖拽排序）
        allData.forEach((item, rowIndex) => {
            const tr = document.createElement('tr');
            tr.dataset.rowIndex = rowIndex;
            tr.dataset.pageId = item.pageId;
            tr.style.cssText = 'position: relative;';
            const savedRowH = rowHeightMap[item.pageId];
            if (savedRowH) {
                tr.style.height = savedRowH + 'px';
            }
            
            // 行號
            const rowNumCell = document.createElement('td');
            rowNumCell.style.cssText = `
                padding: 6px 4px;
                border: 1px solid #ddd;
                background: #f9f9f9;
                position: sticky;
                left: 0;
                z-index: 5;
                min-width: 64px;
            `;
            const rowBox = document.createElement('div');
            rowBox.style.cssText = 'display:flex;flex-direction:row;align-items:center;gap:4px;justify-content:center;';
            const rowIndexLabel = document.createElement('div');
            rowIndexLabel.textContent = rowIndex + 1;
            rowIndexLabel.style.cssText = 'font-weight:bold; cursor: move; min-width: 20px;';
            rowIndexLabel.draggable = true;
            rowIndexLabel.className = 'row-drag-handle';
            const rowCopyBtn = document.createElement('button');
            rowCopyBtn.textContent = '📋';
            rowCopyBtn.title = '複製整行';
            rowCopyBtn.style.cssText = `
                width: 20px;
                height: 20px;
                padding: 0;
                border: none;
                background: rgba(0,0,0,0.05);
                border-radius: 2px;
                cursor: pointer;
                font-size: 10px;
                opacity: 0.6;
                line-height: 1;
                flex-shrink: 0;
            `;
            rowCopyBtn.addEventListener('mouseenter', function() {
                this.style.opacity = '1';
                this.style.background = 'rgba(0,0,0,0.15)';
            });
            rowCopyBtn.addEventListener('mouseleave', function() {
                this.style.opacity = '0.6';
                this.style.background = 'rgba(0,0,0,0.05)';
            });
            rowCopyBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                copyRow(rowIndex, columnOrder);
            });
            rowBox.appendChild(rowIndexLabel);
            rowBox.appendChild(rowCopyBtn);
            rowNumCell.appendChild(rowBox);
            tr.appendChild(rowNumCell);
            
            // 數據單元格（可編輯）
            columnOrder.forEach(col => {
                const td = document.createElement('td');
                td.contentEditable = true;
                td.dataset.columnKey = col.key;
                td.style.cssText = `
                    padding: 6px 8px;
                    border: 1px solid #ddd;
                    min-width: ${columnWidthMap[col.key] || 120}px;
                    white-space: nowrap;
                `;
                
                // 根據列鍵獲取值
                let value = '';
                if (col.key === 'model') {
                    value = item.model || '';
                } else if (item.data) {
                    // 直接使用col.key作為數據鍵，如果不存在則為空
                    value = item.data[col.key] || '';
                }
                
                td.textContent = value;
                
                // 編輯時保存數據
                td.addEventListener('blur', function() {
                    const newValue = td.textContent.trim();
                    if (col.key === 'model') {
                        item.model = newValue;
                    } else {
                        if (!item.data) {
                            item.data = {};
                        }
                        item.data[col.key] = newValue;
                    }
                    saveDataToStorage(item);
                });
                
                tr.appendChild(td);
            });

            // 與新增列列對齊的佔位格
            const addColPlaceholder = document.createElement('td');
            addColPlaceholder.style.cssText = `
                padding: 0;
                border: 1px solid #ddd;
                background: #f8fbf8;
                min-width: 80px;
            `;
            tr.appendChild(addColPlaceholder);

            // 行高拖曳控制（底部邊框）
            const rowResizer = document.createElement('div');
            rowResizer.className = 'row-resizer';
            rowResizer.style.cssText = `
                position: absolute;
                left: 0;
                right: 0;
                bottom: -3px;
                height: 6px;
                cursor: ns-resize;
                z-index: 4;
            `;
            let rowStartY = 0;
            let rowStartH = tr.offsetHeight || 32;
            const onRowResizeMove = (e) => {
                const delta = e.clientY - rowStartY;
                const newH = Math.max(28, Math.min(220, rowStartH + delta));
                tr.style.height = newH + 'px';
                rowHeightMap[item.pageId] = newH;
            };
            const onRowResizeUp = () => {
                document.removeEventListener('mousemove', onRowResizeMove);
                document.removeEventListener('mouseup', onRowResizeUp);
                localStorage.setItem('gsmarena-row-heights', JSON.stringify(rowHeightMap));
                refreshSummaryTable(true);
            };
            rowResizer.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                rowStartY = e.clientY;
                rowStartH = tr.offsetHeight || 32;
                document.addEventListener('mousemove', onRowResizeMove);
                document.addEventListener('mouseup', onRowResizeUp);
            });
            tr.appendChild(rowResizer);
            
            // 行拖拽功能（僅行號為拖曳把手）
            rowIndexLabel.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', item.pageId);
                e.dataTransfer.effectAllowed = 'move';
                tr.classList.add('drag-source');
            });
            rowIndexLabel.addEventListener('dragend', function() {
                tr.classList.remove('drag-source');
            });
            tr.addEventListener('dragover', function(e) {
                if (!e.dataTransfer.types.includes('text/plain')) return;
                e.preventDefault();
                const sourceId = e.dataTransfer.getData('text/plain');
                const targetId = e.currentTarget.dataset.pageId;
                if (sourceId && targetId && sourceId !== targetId) {
                    e.currentTarget.classList.add('drag-target');
                }
            });
            tr.addEventListener('dragleave', function(e) {
                e.currentTarget.classList.remove('drag-target');
            });
            tr.addEventListener('drop', function(e) {
                e.preventDefault();
                e.currentTarget.classList.remove('drag-target');
                const sourceId = e.dataTransfer.getData('text/plain');
                const targetId = e.currentTarget.dataset.pageId;
                if (!sourceId || !targetId || sourceId === targetId) return;
                const sourceIndex = allData.findIndex(d => d.pageId === sourceId);
                const targetIndex = allData.findIndex(d => d.pageId === targetId);
                if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) return;
                const temp = allData[sourceIndex];
                allData[sourceIndex] = allData[targetIndex];
                allData[targetIndex] = temp;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
                refreshSummaryTable(true);
            });
            
            tbody.appendChild(tr);
        });
        
        // 添加新增行按鈕
        const addRowTr = document.createElement('tr');
        const addRowCell = document.createElement('td');
        addRowCell.colSpan = columnOrder.length + 2;
        addRowCell.innerHTML = '<button style="width:100%;padding:8px;border:none;background:#e8f5e9;cursor:pointer;font-size:16px;">+ 新增行</button>';
        addRowCell.style.cssText = `
            padding: 0;
            border: 1px solid #ddd;
            text-align: center;
        `;
        addRowCell.querySelector('button').addEventListener('click', function() {
            const newRow = {
                pageId: 'manual_' + Date.now(),
                model: '',
                openTime: Date.now(),
                data: {}
            };
            columnOrder.forEach(col => {
                if (col.key !== 'model') {
                    newRow.data[col.key] = '';
                }
            });
            const allData = getAllDataFromStorage();
            allData.push(newRow);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
            refreshSummaryTable(true);
        });
        addRowTr.appendChild(addRowCell);
        tbody.appendChild(addRowTr);
        
        table.appendChild(tbody);
        container.innerHTML = '';
        container.appendChild(table);

        // 套用表格縮放
        container.style.transform = `scale(${summarySizeScale})`;
        container.style.transformOrigin = 'top left';
    }

    /**
     * 複製整行數據
     */
    function copyRow(rowIndex, columnOrder) {
        const allData = getAllDataFromStorage();
        if (rowIndex >= allData.length) return;
        
        const row = allData[rowIndex];
        const values = [];
        
        columnOrder.forEach(col => {
            let value = '';
            if (col.key === 'model') {
                value = row.model || '';
            } else if (row.data) {
                value = row.data[col.key] || '';
            }
            values.push(value);
        });
        
        copyToClipboard(values.join('\t'));
    }

    /**
     * 複製整列數據
     */
    function copyColumn(columnKey, columnOrder) {
        const allData = getAllDataFromStorage();
        const values = [];
        
        allData.forEach(item => {
            let value = '';
            if (columnKey === 'model') {
                value = item.model || '';
            } else if (item.data) {
                value = item.data[columnKey] || '';
            }
            values.push(value);
        });
        
        copyToClipboard(values.join('\n'));
    }

    /**
     * 附加複製按鈕到頁面
     */
    function attachCopyButtons() {
        // Dimensions 小📋
        const dimensionsElement = document.querySelector('td[data-spec="dimensions"]');
        if (dimensionsElement && !document.querySelector('.gsmarena-copy-btn-dimensions')) {
            const row = dimensionsElement.closest('tr');
            let label = null;
            if (row) {
                row.querySelectorAll('th, td.ttl').forEach((el) => {
                    const t = el.textContent || '';
                    if (!label && (t.includes('Dimensions') || t.includes('dimensions'))) {
                        label = el;
                    }
                });
            }
            
            const btn = createMiniCopyButton({
                type: 'dimensions',
                title: '點擊複製（長寬厚）',
                getText: generateCopyText2
            });
            
            if (label) {
                label.appendChild(btn);
            } else {
                dimensionsElement.parentNode.insertBefore(btn, dimensionsElement.nextSibling);
            }
        }
        
        // Sensors 小📋
        const sensorsElement = document.querySelector('td[data-spec="sensors"]');
        if (sensorsElement && !document.querySelector('.gsmarena-copy-btn-sensors')) {
            const row = sensorsElement.closest('tr');
            let label = null;
            if (row) {
                row.querySelectorAll('th, td.ttl').forEach((el) => {
                    const t = el.textContent || '';
                    if (!label && (t.includes('Sensors') || t.includes('sensors'))) {
                        label = el;
                    }
                });
            }
            
            const btn = createMiniCopyButton({
                type: 'sensors',
                title: '點擊複製（面板+指紋）',
                getText: generateCopyText1
            });
            
            if (label) {
                label.appendChild(btn);
            } else {
                sensorsElement.parentNode.insertBefore(btn, sensorsElement.nextSibling);
            }
        }
        
        // v2.7：Launch Announced 小📋（單格年/月）
        const yearEl = document.querySelector('td[data-spec="year"]');
        if (yearEl && !document.querySelector('.gsmarena-copy-btn-launch-announced')) {
            const row = yearEl.closest('tr');
            let label = null;
            if (row) {
                row.querySelectorAll('th, td.ttl').forEach((el) => {
                    const t = el.textContent || '';
                    if (!label && (t.includes('Announced') || t.includes('announced'))) {
                        label = el;
                    }
                });
            }
            
            const btn = createMiniCopyButton({
                type: 'launch-announced',
                title: '點擊複製（發布日期 年/月 單格）',
                getText: generateCopyLaunchAnnouncedSingle
            });
            
            if (label) {
                label.appendChild(btn);
            } else {
                yearEl.parentNode.insertBefore(btn, yearEl.nextSibling);
            }
        }
        
        // v2.7：Launch Released 小📋（單格年/月）
        const statusEl = document.querySelector('td[data-spec="status"]');
        if (statusEl && !document.querySelector('.gsmarena-copy-btn-launch-released')) {
            const row = statusEl.closest('tr');
            let label = null;
            if (row) {
                row.querySelectorAll('th, td.ttl').forEach((el) => {
                    const t = el.textContent || '';
                    if (!label && (t.includes('Status') || t.includes('status'))) {
                        label = el;
                    }
                });
            }
            
            const btn = createMiniCopyButton({
                type: 'launch-released',
                title: '點擊複製（發售日期 年/月 單格）',
                getText: generateCopyLaunchReleasedSingle
            });
            
            if (label) {
                label.appendChild(btn);
            } else {
                statusEl.parentNode.insertBefore(btn, statusEl.nextSibling);
            }
        }
    }

    /**
     * 初始化快速複製功能
     */
    function initCopyFeature() {
        // 先載入保存的主題（如果有的話），這樣創建按鈕時就能使用正確的主題色
        try {
            const savedTheme = localStorage.getItem('gsmarena-theme');
            if (savedTheme && themeOptions[savedTheme]) {
                selectedTheme = savedTheme;
            }
        } catch (e) {
            console.warn('無法載入主題設置:', e);
        }
        
        refreshCoreData();
        attachCopyButtons();
        
        // 創建彈出界面
        createCopyPanel();
        
        // 創建設置界面（但不顯示）
        createSettingsPanel();
        
        // 創建匯總表格面板（但不顯示）
        createSummaryPanel();
        
        // 應用保存的主題（如果有的話）
        try {
            const savedTheme = localStorage.getItem('gsmarena-theme');
            if (savedTheme && themeOptions[savedTheme]) {
                selectedTheme = savedTheme;
                applyTheme(savedTheme);
            }
        } catch (e) {
            console.warn('無法載入主題設置:', e);
        }
        
        // 添加設置和開發者按鈕（在彈出界面標題欄）
        if (copyPanel) {
            const header = copyPanel.querySelector('.panel-header');
            const controls = copyPanel.querySelector('.panel-header > div:last-child');
            
            // 設置按鈕（⚙️）
            const settingsBtn = document.createElement('button');
            settingsBtn.textContent = '⚙️';
            settingsBtn.title = '設置';
            settingsBtn.style.cssText = `
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                line-height: 1;
            `;
            settingsBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                isSettingsPanelVisible = !isSettingsPanelVisible;
                if (settingsPanel) {
                    settingsPanel.style.display = isSettingsPanelVisible ? 'block' : 'none';
                }
            });
            
            // 匯總表格按鈕（📊）
            const summaryBtn = document.createElement('button');
            summaryBtn.textContent = '📊';
            summaryBtn.title = '數據匯總表格';
            summaryBtn.style.cssText = `
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                line-height: 1;
            `;
            summaryBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (!summaryPanel) {
                    createSummaryPanel();
                }
                isSummaryPanelVisible = !isSummaryPanelVisible;
                if (summaryPanel) {
                    summaryPanel.style.display = isSummaryPanelVisible ? 'block' : 'none';
                    if (isSummaryPanelVisible) {
                        autoCollectData();
                        refreshSummaryTable(true);
                        summaryNewDataPending = false;
                        const refreshBtnEl = summaryPanel.querySelector('#summary-refresh-btn');
                        if (refreshBtnEl) refreshBtnEl.classList.remove('breathing-green');
                    }
                }
            });
            
            controls.insertBefore(settingsBtn, controls.firstChild);
            controls.insertBefore(summaryBtn, settingsBtn.nextSibling);
        }
    }

    /**
     * 應用主題配色
     * 
     * @param {string} themeKey - 主題鍵值
     */
    function applyTheme(themeKey) {
        if (!themeOptions[themeKey]) return;
        
        selectedTheme = themeKey;
        const theme = themeOptions[themeKey];
        
        // 應用主題到所有相關元素
        if (copyPanel) {
            const header = copyPanel.querySelector('.panel-header');
            if (header) {
                header.style.background = theme.backgroundImage;
                header.style.backgroundColor = theme.backgroundColor;
            }
            
            // 使用主題色作為邊框顏色（使用漸變的起始顏色）
            copyPanel.style.borderColor = theme.backgroundColor;
            
            // 更新邊框寬度，確保可見
            copyPanel.style.borderWidth = '2px';
            
            // 更新所有複製按鈕顏色（包括彈出界面內和頁面上的）
            const buttons = copyPanel.querySelectorAll('button');
            buttons.forEach(btn => {
                if (btn.textContent.includes('複製')) {
                    btn.style.background = theme.backgroundImage;
                    btn.style.backgroundColor = theme.backgroundColor;
                }
            });
            
            // 更新頁面上的複製按鈕
            const pageButtons = document.querySelectorAll('.gsmarena-copy-btn');
            pageButtons.forEach(btn => {
                btn.style.background = theme.backgroundImage;
                btn.style.backgroundColor = theme.backgroundColor;
            });
        }
        
        // 保存到 localStorage
        try {
            localStorage.setItem('gsmarena-theme', themeKey);
        } catch (e) {
            console.warn('無法保存主題設置:', e);
        }
    }

    /**
     * 創建設置界面
     */
    function createSettingsPanel() {
        if (settingsPanel) return settingsPanel;
        
        const themeColor = getGSMArenaThemeColor();
        
        settingsPanel = document.createElement('div');
        settingsPanel.id = 'gsmarena-settings-panel';
        settingsPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            max-height: 600px;
            background: white;
            border: 2px solid ${themeColor};
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10002;
            font-family: Arial, sans-serif;
            font-size: 14px;
            display: none;
            overflow: hidden;
        `;
        
        const header = document.createElement('div');
        header.style.cssText = `
            background: ${themeColor};
            color: white;
            padding: 10px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
        `;
        
        const title = document.createElement('span');
        title.textContent = '設置';
        title.style.fontWeight = 'bold';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 20px;
            line-height: 1;
        `;
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            settingsPanel.style.display = 'none';
            isSettingsPanelVisible = false;
        });
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        const content = document.createElement('div');
        content.style.cssText = `
            padding: 15px;
            max-height: 550px;
            overflow-y: auto;
        `;
        
        // 面板大小控制（移至設置頂部）
        const sizeSection = document.createElement('div');
        sizeSection.style.cssText = 'margin-bottom: 20px;';
        
        const sizeTitle = document.createElement('h3');
        sizeTitle.textContent = '面板大小';
        sizeTitle.style.cssText = 'margin: 0 0 10px 0; font-size: 16px; color: #333;';
        
        const sizeControl = document.createElement('div');
        sizeControl.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        const sizeLabel = document.createElement('span');
        sizeLabel.textContent = '面板縮放：';
        sizeLabel.style.cssText = 'font-size: 13px;';
        
        const sizeMinusBtn = document.createElement('button');
        sizeMinusBtn.textContent = '−';
        sizeMinusBtn.style.cssText = `
            width: 28px;
            height: 28px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background: #f7f7f7;
            cursor: pointer;
            font-size: 16px;
        `;
        
        const sizeValue = document.createElement('span');
        sizeValue.style.cssText = 'min-width: 60px; text-align: center; font-weight: bold;';
        
        const sizePlusBtn = document.createElement('button');
        sizePlusBtn.textContent = '+';
        sizePlusBtn.style.cssText = `
            width: 28px;
            height: 28px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background: #f7f7f7;
            cursor: pointer;
            font-size: 16px;
        `;
        
        const refreshSizeUI = () => {
            sizeValue.textContent = Math.round(panelSizeScale * 100) + '%';
        };
        
        sizeMinusBtn.addEventListener('click', function() {
            setPanelSizeScale(panelSizeScale - SIZE_SCALE_STEP);
            refreshSizeUI();
        });
        
        sizePlusBtn.addEventListener('click', function() {
            setPanelSizeScale(panelSizeScale + SIZE_SCALE_STEP);
            refreshSizeUI();
        });
        
        refreshSizeUI();
        
        sizeControl.appendChild(sizeLabel);
        sizeControl.appendChild(sizeMinusBtn);
        sizeControl.appendChild(sizeValue);
        sizeControl.appendChild(sizePlusBtn);
        sizeSection.appendChild(sizeTitle);
        sizeSection.appendChild(sizeControl);
        content.appendChild(sizeSection);
        
        // 配色選擇區域
        const themeSection = document.createElement('div');
        themeSection.style.cssText = 'margin-bottom: 20px;';
        
        const themeTitle = document.createElement('h3');
        themeTitle.textContent = '配色主題';
        themeTitle.style.cssText = 'margin: 0 0 15px 0; font-size: 16px; color: #333;';
        
        const themeList = document.createElement('div');
        themeList.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
        
        // 創建每個主題選項
        Object.keys(themeOptions).forEach(themeKey => {
            const theme = themeOptions[themeKey];
            const themeItem = document.createElement('div');
            themeItem.style.cssText = `
                display: flex;
                align-items: center;
                padding: 10px;
                border: 2px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
            `;
            
            const themePreview = document.createElement('div');
            themePreview.style.cssText = `
                width: 40px;
                height: 40px;
                border-radius: 4px;
                background: ${theme.backgroundColor};
                background-image: ${theme.backgroundImage};
                margin-right: 10px;
                border: 1px solid #ddd;
            `;
            
            const themeLabel = document.createElement('span');
            themeLabel.textContent = theme.name;
            themeLabel.style.flex = '1';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'theme';
            radio.value = themeKey;
            radio.checked = (themeKey === selectedTheme);
            radio.style.marginLeft = '10px';
            
            radio.addEventListener('change', function() {
                if (this.checked) {
                    applyTheme(themeKey);
                    // 更新所有單選按鈕狀態
                    themeList.querySelectorAll('input[type="radio"]').forEach(r => {
                        r.checked = (r.value === themeKey);
                    });
                }
            });
            
            themeItem.addEventListener('click', function() {
                radio.checked = true;
                applyTheme(themeKey);
                themeList.querySelectorAll('input[type="radio"]').forEach(r => {
                    r.checked = (r.value === themeKey);
                });
            });
            
            themeItem.appendChild(themePreview);
            themeItem.appendChild(themeLabel);
            themeItem.appendChild(radio);
            themeList.appendChild(themeItem);
        });
        
        themeSection.appendChild(themeTitle);
        themeSection.appendChild(themeList);
        content.appendChild(themeSection);
        
        // 分隔線
        const divider = document.createElement('div');
        divider.style.cssText = `
            height: 1px;
            background: #ddd;
            margin: 20px 0;
        `;
        content.appendChild(divider);
        
        // 開發者設置區域
        const devSection = document.createElement('div');
        devSection.style.cssText = 'margin-bottom: 20px;';
        
        const devTitle = document.createElement('h3');
        devTitle.textContent = '開發者設置';
        devTitle.style.cssText = 'margin: 0 0 15px 0; font-size: 16px; color: #333;';
        
        const devToggleBtn = document.createElement('button');
        devToggleBtn.textContent = '📑 顯示開發者信息';
        devToggleBtn.style.cssText = `
            width: 100%;
            padding: 10px;
            background: #f5f5f5;
            border: 2px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        `;
        devToggleBtn.addEventListener('mouseenter', function() {
            this.style.background = '#e8e8e8';
        });
        devToggleBtn.addEventListener('mouseleave', function() {
            this.style.background = '#f5f5f5';
        });
        
        const devContent = document.createElement('div');
        devContent.id = 'dev-content-in-settings';
        devContent.style.cssText = `
            margin-top: 15px;
            padding: 15px;
            background: #1e1e1e;
            color: #d4d4d4;
            border-radius: 4px;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 12px;
            display: none;
            max-height: 400px;
            overflow-y: auto;
        `;
        
        let isDevContentVisible = false;
        devToggleBtn.addEventListener('click', function() {
            isDevContentVisible = !isDevContentVisible;
            devContent.style.display = isDevContentVisible ? 'block' : 'none';
            devToggleBtn.textContent = isDevContentVisible ? '📑 隱藏開發者信息' : '📑 顯示開發者信息';
            if (isDevContentVisible) {
                updateDevInfoInSettings();
            }
        });
        
        // 更新開發者信息（在設置界面中）
        function updateDevInfoInSettings() {
            const themeColor = getGSMArenaThemeColor();
            const dimEl = document.querySelector('td[data-spec="dimensions"]');
            const senEl = document.querySelector('td[data-spec="sensors"]');
            const yearEl = document.querySelector('td[data-spec="year"]');
            const statusEl = document.querySelector('td[data-spec="status"]');
            
            const dimRaw = normalizeSpaces(dimEl ? dimEl.textContent : '未找到');
            const senRaw = normalizeSpaces(senEl ? senEl.textContent : '未找到');
            const yearRaw = normalizeSpaces(yearEl ? yearEl.textContent : '未找到');
            const statusRaw = normalizeSpaces(statusEl ? statusEl.textContent : '未找到');
            
            const announcedYM = extractedData.launch.announcedYM || '(空)';
            const releasedYM = extractedData.launch.releasedYM || '(空)';
            
            devContent.innerHTML = `
                <div style="margin-bottom:14px;">
                    <h3 style="color:${themeColor};margin:0 0 10px 0;font-size:14px;">Launch 日期 (年/月)</h3>
                    <div style="background:#252526;padding:10px;border-radius:4px;">
                        <div style="color:#9cdcfe;margin-bottom:5px;">Announced 原始文本:</div>
                        <div style="color:#ce9178;margin-left:15px;">${yearRaw}</div>
                        <div style="color:#9cdcfe;margin-top:10px;margin-bottom:5px;">Status/Released 原始文本:</div>
                        <div style="color:#ce9178;margin-left:15px;">${statusRaw}</div>
                        <div style="color:#9cdcfe;margin-top:10px;margin-bottom:5px;">解析結果:</div>
                        <div style="color:#ce9178;margin-left:15px;">
                            發布日期(年/月): ${announcedYM}<br>
                            發售日期(年/月): ${releasedYM}
                        </div>
                    </div>
                </div>
                <div style="margin-bottom:14px;">
                    <h3 style="color: ${themeColor}; margin: 0 0 10px 0; font-size: 14px;">尺寸信息 (Dimensions)</h3>
                    <div style="background: #252526; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
                        <div style="color: #9cdcfe; margin-bottom: 5px;">原始文本:</div>
                        <div style="color: #ce9178; margin-left: 15px;">${dimRaw}</div>
                        <div style="color: #9cdcfe; margin-top: 10px; margin-bottom: 5px;">解析結果:</div>
                        <div style="color: #ce9178; margin-left: 15px;">
                            長: ${extractedData.dimensions.length || '(空)'}<br>
                            寬: ${extractedData.dimensions.width || '(空)'}<br>
                            厚: ${extractedData.dimensions.thickness || '(空)'}
                        </div>
                        <div style="color: #9cdcfe; margin-top: 10px; margin-bottom: 5px;">複製內容:</div>
                        <div style="color: #ce9178; margin-left: 15px; font-family: monospace;">${generateCopyText2()}</div>
                    </div>
                </div>
                
                <div style="margin-bottom:14px;">
                    <h3 style="color: ${themeColor}; margin: 0 0 10px 0; font-size: 14px;">傳感器信息 (Sensors)</h3>
                    <div style="background: #252526; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
                        <div style="color: #9cdcfe; margin-bottom: 5px;">原始文本:</div>
                        <div style="color: #ce9178; margin-left: 15px;">${senRaw}</div>
                        <div style="color: #9cdcfe; margin-top: 10px; margin-bottom: 5px;">解析結果:</div>
                        <div style="color: #ce9178; margin-left: 15px;">
                            指紋位置: ${extractedData.fingerprint.position || '(空)'}<br>
                            屏下類型: ${extractedData.fingerprint.type || '(空)'}
                        </div>
                        <div style="color: #9cdcfe; margin-top: 10px; margin-bottom: 5px;">複製內容:</div>
                        <div style="color: #ce9178; margin-left: 15px; font-family: monospace;">${generateCopyText1()}</div>
                    </div>
                </div>
                
                <div style="margin-top:18px;padding-top:12px;border-top:1px solid #444;">
                    <div style="color: #9cdcfe; margin-bottom: 5px;">變數名稱:</div>
                    <div style="color: #ce9178; margin-left: 15px; font-family: monospace;">
                        extractedData.dimensions<br>
                        extractedData.fingerprint<br>
                        extractedData.launch<br>
                        generateCopyText1()<br>
                        generateCopyText2()<br>
                        generateCopyLaunchAnnouncedSingle()<br>
                        generateCopyLaunchReleasedSingle()
                    </div>
                </div>
            `;
        }
        
        // 定期更新開發者信息
        setInterval(function() {
            if (isDevContentVisible && devContent.style.display === 'block') {
                updateDevInfoInSettings();
            }
        }, 1000);
        
        devSection.appendChild(devTitle);
        devSection.appendChild(devToggleBtn);
        devSection.appendChild(devContent);
        content.appendChild(devSection);
        
        settingsPanel.appendChild(header);
        settingsPanel.appendChild(content);
        document.body.appendChild(settingsPanel);
        
        // 實現拖移功能
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        
        header.addEventListener('mousedown', function(e) {
            if (e.target === closeBtn || e.target.closest('button')) return;
            isDragging = true;
            const rect = settingsPanel.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            const maxX = window.innerWidth - settingsPanel.offsetWidth;
            const maxY = window.innerHeight - settingsPanel.offsetHeight;
            currentX = Math.max(0, Math.min(currentX, maxX));
            currentY = Math.max(0, Math.min(currentY, maxY));
            
            settingsPanel.style.left = currentX + 'px';
            settingsPanel.style.top = currentY + 'px';
            settingsPanel.style.transform = 'none';
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
        
        // 從 localStorage 載入保存的主題
        try {
            const savedTheme = localStorage.getItem('gsmarena-theme');
            if (savedTheme && themeOptions[savedTheme]) {
                selectedTheme = savedTheme;
                applyTheme(savedTheme);
                // 更新單選按鈕狀態
                const savedRadio = settingsPanel.querySelector(`input[value="${savedTheme}"]`);
                if (savedRadio) {
                    savedRadio.checked = true;
                }
            }
        } catch (e) {
            console.warn('無法載入主題設置:', e);
        }
        
        return settingsPanel;
    }

    // ========== 初始化控制變數 ==========
    let isInitialized = false;      // 標記是否已初始化，避免重複執行
    let phoneFinderMoved = false;   // 標記 Phone Finder 是否已移動，避免重複移動
    const VERSION = '3.7';
    
    // ========== 大小控制選項 ==========
    let panelSizeScale = 1.0;  // 面板大小縮放比例（預設 1.0 = 100%）
    const MIN_SIZE_SCALE = 0.7;  // 最小縮放比例
    const MAX_SIZE_SCALE = 1.5;  // 最大縮放比例
    const SIZE_SCALE_STEP = 0.1;  // 縮放步進值

    /**
     * 檢查是否為主界面（首頁）
     * 主界面路徑為 https://www.gsmarena.com/ 或 https://www.gsmarena.com/index.php
     * 
     * @returns {boolean} - 如果是主界面返回 true
     */
    function isMainPage() {
        const path = window.location.pathname;
        return path === '/' || path === '/index.php' || path === '';
    }

    /**
     * 檢查是否為單一手機型號頁面
     * 單一手機型號頁面特徵：
     * - URL 包含下劃線（如 xiaomi_poco_f8_pro_5g）
     * - 不包含品牌匯總頁面的關鍵詞（-phones-、-tablets-等）
     * - 通常以 -數字.php 結尾（ID 通常較大）
     * 
     * @returns {boolean} - 如果是單一手機型號頁面返回 true
     */
    function isPhoneDetailPage() {
        const path = window.location.pathname;
        
        // 排除主界面
        if (path === '/' || path === '/index.php' || path === '') {
            return false;
        }
        
        // 檢查是否包含下劃線（單一手機型號頁面的特徵）
        if (!path.includes('_')) {
            return false;
        }
        
        // 排除品牌匯總頁面的特徵模式
        if (path.includes('-phones-') || path.includes('-tablets-') || 
            path.includes('-wearables-') || path.includes('-accessories-')) {
            return false;
        }
        
        // 檢查是否以 -數字.php 結尾（單一手機型號頁面的特徵）
        const match = path.match(/-(\d+)\.php$/);
        if (match && match[1]) {
            const id = parseInt(match[1]);
            // 單一手機型號的ID通常較大（>1000），品牌匯總頁面的數字通常較小（<1000）
            // 但為了更可靠，主要依賴下劃線的存在
            return true;
        }
        
        return false;
    }

    /**
     * 獲取 GSMArena 主題配色
     * 從 .article-info-line 元素提取顏色
     * 
     * @returns {string} - 主配色（十六進制顏色值）
     */
    function getGSMArenaThemeColor() {
        const articleInfoLine = document.querySelector('.article-info-line');
        if (articleInfoLine) {
            const computedStyle = window.getComputedStyle(articleInfoLine);
            const color = computedStyle.color || computedStyle.borderColor || computedStyle.backgroundColor;
            if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
                return color;
            }
        }
        // 如果找不到，返回默認顏色
        return '#4CAF50';
    }

    /**
     * 初始化函數 - 執行所有優化功能
     * 
     * 功能說明：
     * 1. 檢查是否為主界面，如果是則不執行插件功能
     * 2. 立即執行一次所有優化功能
     * 3. 使用 MutationObserver 監聽 DOM 變化，處理動態載入的內容
     * 4. 使用多個延遲執行確保所有元素都已載入
     * 5. 避免重複執行，提升性能
     */
    function init() {
        // 初始化跨頁面通信機制
        initCrossPageCommunication();
        
        // 自動收集當前頁面數據
        setTimeout(function() {
            autoCollectData();
        }, 2000); // 延遲2秒確保頁面數據已加載
        // 如果已經初始化，直接返回
        if (isInitialized) {
            return;
        }

        // 檢查是否為主界面或非單一手機型號頁面，如果是則不執行插件功能
        if (isMainPage() || !isPhoneDetailPage()) {
            console.log('GSMArena 快速複製插件：僅在單一手機型號頁面啟用');
            return;
        }

        // ========== 初始化跨頁面通信機制 ==========
        initCrossPageCommunication();
        
        // ========== 立即執行一次 ==========
        hideAllAds();
        if (!phoneFinderMoved) {
            movePhoneFinderToTop();
            phoneFinderMoved = true;
        }
        optimizeLayout();
        initCopyFeature();
        
        // ========== 自動收集當前頁面數據 ==========
        setTimeout(function() {
            autoCollectData();
        }, 2000); // 延遲2秒確保頁面數據已加載

        // ========== 使用 MutationObserver 監聽 DOM 變化 ==========
        // 處理動態載入的內容（如 AJAX 載入的廣告或內容）
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            mutations.forEach(mutation => {
                // 如果檢測到新元素加入，標記需要更新
                if (mutation.addedNodes.length > 0) {
                    shouldUpdate = true;
                }
            });
            
            // 執行更新（但不再移動 Phone Finder，因為已經移動過了）
            if (shouldUpdate) {
                hideAllAds();
                // 只有在 Phone Finder 還沒移動且找到側邊欄時才移動
                if (!phoneFinderMoved && document.querySelector('aside.sidebar.col.left')) {
                    movePhoneFinderToTop();
                    phoneFinderMoved = true;
                }
                optimizeLayout();
                // 檢查是否需要重新初始化複製功能
                refreshCoreData();
                attachCopyButtons();
            }
        });

        // 開始監聽 body 及其子元素的變化
        observer.observe(document.body, {
            childList: true,    // 監聽子元素的添加和移除
            subtree: true       // 監聽所有後代元素的變化
        });

        // ========== 延遲執行，確保所有元素都已載入 ==========
        // 有些內容可能通過 JavaScript 動態載入，需要延遲執行以確保捕獲到
        
        // 延遲 500ms 執行（處理較快的動態內容）
        setTimeout(() => {
            hideAllAds();
            if (!phoneFinderMoved) {
                movePhoneFinderToTop();
                phoneFinderMoved = true;
            }
            optimizeLayout();
            refreshCoreData();
            attachCopyButtons();
        }, 500);

        // 延遲 1500ms 執行（處理較慢的動態內容）
        setTimeout(() => {
            hideAllAds();
            if (!phoneFinderMoved) {
                movePhoneFinderToTop();
                phoneFinderMoved = true;
            }
            optimizeLayout();
            refreshCoreData();
            attachCopyButtons();
        }, 1500);

            // 延遲 3000ms 最後執行一次（確保所有內容都已載入）
        setTimeout(() => {
            hideAllAds();
            optimizeLayout();
            // 注意：這裡不再移動 Phone Finder，因為應該已經移動過了
            refreshCoreData();
            attachCopyButtons();
            // 再次收集數據（確保數據是最新的）
            autoCollectData();
        }, 3000);

        // 標記為已初始化
        isInitialized = true;
    }

    // ========== 執行初始化 ==========
    // 根據 DOM 載入狀態選擇執行時機
    if (document.readyState === 'loading') {
        // DOM 還在載入中，等待 DOMContentLoaded 事件
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM 已經載入完成，立即執行
        init();
    }

})();
