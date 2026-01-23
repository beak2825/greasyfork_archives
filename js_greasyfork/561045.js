// ==UserScript==
// @name         巴哈姆特通知格線佈局
// @name:en      Bahamut Notification Grid Layout
// @name:ja      バハムート通知グリッドレイアウト

// @description  將巴哈姆特通知頁面改為格線佈局，全寬佔用，卡片寬度根據欄位數自動計算。
// @description:en  Transform the Bahamut notification page into a grid layout with full-width utilization, where card width is automatically calculated based on the number of columns.
// @description:ja  バハムートの通知ページをグリッドレイアウトに変更し、全幅を使用。カードの幅は列數に応じて自動計算されます。

// @author       Max
// @namespace    https://github.com/Max46656
// @supportURL   https://github.com/Max46656/EverythingInGreasyFork/issues

// @version      1.0.2
// @icon         https://i2.bahamut.com.tw/anime/baha_s.png
// @license      MPL2.0

// @match        https://home.gamer.com.tw/profile/notification.php
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561045/Bahamut%20Notification%20Grid%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/561045/Bahamut%20Notification%20Grid%20Layout.meta.js
// ==/UserScript==

class BahamutGridLayout {
    constructor() {
        this.injectStyles();
    }

    injectStyles() {
        GM_addStyle(`
            :root {
                --column-count: 5;           /* 在這裡更改一padding行顯示幾個通知（建議 3~7） */
                --gap: 24px;                 /* 格線間距 */
                --card-color: #fff;          /* 卡片背景顏色 */

                /* 標題文字顯示模式控制
                   模式 1（推薦大字體）：設為 "cut" → 大字體 + 直接裁切（clip）
                   模式 2（完整顯示）：設為 "fit"   → 小字體，完整標題 */
                --title-mode: "fit";

                --title-font-size-cut: 14px;   /* "cut" 模式下的字體大小，可自行調整 */
                --title-font-size-fit: 12px;      /* "fit" 模式下的基礎字體大小（會再自動縮小） */
            }

            /* 隱藏右側邊欄*/
            .main-sidebar_right {
                display: none !important;
            }

            /* 移除通知欄父元素的寬度限制 */
            .inboxfeed {
                max-width: none !important;
                width: 100% !important;
                padding: 0 !important;
                box-sizing: border-box !important;
            }

            /* 主容器壁與背景牆滿寬 */
            .main-container_wall,
            .box-shadow__fromabove {
                width: 100% !important;
                max-width: none !important;
                padding: 0 !important;
                margin: 0 auto !important;
                box-sizing: border-box !important;
            }

            /* 主容器格線：滿寬 + 自動計算每個卡片寬度 */
            #container {
                display: grid !important;
                grid-template-columns: repeat(var(--column-count),
                    calc((100% - (var(--column-count) - 1) * var(--gap)) / var(--column-count))) !important;
                gap: var(--gap) !important;
                padding: var(--gap) !important;
                width: 100% !important;
                max-width: none !important;
                margin: 0 auto !important;
                box-sizing: border-box !important;
            }

            /* 每個項目卡片 */
            .list-item-box {
                display: flex !important;
                flex-direction: column !important;
                background: var(--card-color) !important;
                border-radius: 6px !important;
                overflow: hidden !important;
                padding: 0px !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
                transition: transform 0.3s ease, box-shadow 0.3s ease !important;
            }

            .list-item-box:hover {
                transform: translateY(-12px) !important;
                box-shadow: 0 12px 24px rgba(0,0,0,0.15) !important;
            }

            /* 序列號疊加在圖片左上角 */
            .serial-number {
                display: none !important;
            }

            /* 外層 a：正方形縮圖容器 */
            a.list-item-img {
                position: relative !important;
                width: 100% !important;
                padding-top: 100% !important;
                overflow: hidden !important;
                display: block !important;
            }

            span.list-item-img {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                display: block !important;
            }

            .list-item-img img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                object-position: center !important;
                transition: transform 0.4s ease !important;
            }

            .list-item-box:hover .list-item-img img {
                transform: scale(1.08) !important;
            }

            /* 資訊區 */
            .list-item-info {
                padding: 12px !important;
                flex-grow: 1 !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
            }

            /* 標題文字：根據 --title-mode 切換兩種模式 */
            .list-item-title {
                line-height: 1.4 !important;
                margin-bottom: 8px !important;
                overflow: hidden !important;
            }

            /* 模式 1：cut - 大字體 + 直接裁切 */
            :root[data-title-mode="cut"] .list-item-title,
            :root:not([data-title-mode]) .list-item-title {
                font-size: var(--title-font-size-cut) !important;
                display: -webkit-box !important;
                -webkit-line-clamp: 2 !important;
                -webkit-box-orient: vertical !important;
                text-overflow: clip !important;
            }

            /* 模式 2：fit - 自動縮小字體，完整顯示標題 */
            :root[data-title-mode="fit"] .list-item-title {
                font-size: var(--title-font-size-fit) !important;
                display: block !important;
                white-space: normal !important;
                overflow: visible !important;       /* 允許文字超出容器但不裁切 */
                word-break: break-word !important;  /* 長詞自動斷行 */
            }

            .list-item-info-text {
                font-size: 12px !important;
                color: #888 !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
            }

            .btn-text {
                font-size: 12px !important;
                padding: 6px 10px !important;
                background: #f5f5f5 !important;
                border-radius: 6px !important;
            }

            .btn-text:hover {
                background: #e0e0e0 !important;
            }

            /* 小螢幕響應式 */
            @media (max-width: 768px) {
                :root { --column-count: 3; --gap: 16px; }
                #container {
                    grid-template-columns: repeat(var(--column-count), minmax(160px, 1fr)) !important;
                    padding: var(--gap) !important;
                }
            }

            @media (max-width: 480px) {
                :root { --column-count: 2; }
            }
        `);

        const updateTitleMode = () => {
            const mode = getComputedStyle(document.documentElement).getPropertyValue('--title-mode').trim().replace(/["']/g, '');
            document.documentElement.dataset.titleMode = mode;
        };

        updateTitleMode();
    }
}

new BahamutGridLayout();
