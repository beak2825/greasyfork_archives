// ==UserScript==
// @name 巴哈姆特訂閱通知格線佈局
// @namespace https://github.com/Max46656
// @version 1.0.1
// @description 將巴哈姆特訂閱通知頁面改為格線佈局，全寬佔用，卡片寬度根據欄位數自動計算。
// @author Max
// @supportURL https://github.com/Max46656/EverythingInGreasyFork/issues
// @license MPL2.0
// @grant GM_addStyle
// @run-at document-start
// @match https://home.gamer.com.tw/profile/notification.php*
// @downloadURL https://update.greasyfork.org/scripts/561031/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E8%A8%82%E9%96%B1%E9%80%9A%E7%9F%A5%E6%A0%BC%E7%B7%9A%E4%BD%88%E5%B1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/561031/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E8%A8%82%E9%96%B1%E9%80%9A%E7%9F%A5%E6%A0%BC%E7%B7%9A%E4%BD%88%E5%B1%80.meta.js
// ==/UserScript==

(function() {
let css = `
    :root {
        --column-count: 5;   /* 在這裡更改一行顯示幾個通知（建議 4~7） */
        --gap: 24px;         /* 格線間距 */
    }

    /* 隱藏右側邊欄，讓主要內容拉滿 */
    .main-sidebar_right {
        display: none !important;
    }

    /* 移除 inboxfeed 的寬度限制 */
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
        background: #fff !important;
        border-radius: 12px !important;
        overflow: hidden !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        transition: transform 0.3s ease, box-shadow 0.3s ease !important;
    }

    .list-item-box:hover {
        transform: translateY(-8px) !important;
        box-shadow: 0 12px 24px rgba(0,0,0,0.15) !important;
    }

    /* 序列號疊加在圖片左上角 */
    .serial-number {
        position: absolute !important;
        top: 8px !important;
        left: 8px !important;
        background: rgba(0,0,0,0.65) !important;
        color: #fff !important;
        padding: 4px 10px !important;
        border-radius: 6px !important;
        font-size: 13px !important;
        font-weight: bold !important;
        z-index: 2 !important;
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

    .list-item-title {
        font-size: 14px !important;
        line-height: 1.4 !important;
        margin-bottom: 8px !important;
        overflow: hidden !important;
        display: -webkit-box !important;
        -webkit-line-clamp: 2 !important;
        -webkit-box-orient: vertical !important;
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
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
