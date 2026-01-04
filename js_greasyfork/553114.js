// ==UserScript==
// @name         Civitai Ads Blocker (Optimized CSS)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hide the "Become a Member to turn off ads today" boxes and other ad slots on Civitai search results.
// @author       Gemini
// @license      MIT
// @match        https://civitai.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553114/Civitai%20Ads%20Blocker%20%28Optimized%20CSS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553114/Civitai%20Ads%20Blocker%20%28Optimized%20CSS%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 GM_addStyle 注入 CSS 规则来隐藏广告框。
    // 这比 JavaScript DOM 操作更快，可以在广告显示之前就将其隐藏，消除闪烁。
    GM_addStyle(`
        /* ------------------------------------------------------------------------------------ */
        /* Civitai 广告卡片隐藏规则：我们只针对包含广告文字或广告占位符的顶级元素进行隐藏。 */
        /* ------------------------------------------------------------------------------------ */
        
        /* 规则 1: 定位包含会员升级广告文字的卡片（如您图片中红圈所示） */
        /* :has() 选择器用于找到包含特定子元素的父元素，这是最精确和稳定的方法。 */
        div.relative.flex.overflow-hidden:has(p:text('Become a Member to turn off ads today')) {
            display: none !important;
        }

        /* 规则 2: 定位包含实际嵌入式广告位（最小高度 250px）的卡片 */
        /* 这类卡片通常用于展示第三方广告，也应被屏蔽。 */
        div.relative.flex.overflow-hidden:has(div[style*="min-height: 250px;"]) {
            display: none !important;
        }

        /* 规则 3 (可选，基于结构差异的辅助规则): 
           广告卡片通常会包含 mx-auto min-w-80 等样式，而正常模型卡片没有。*/
        /* 仅在规则 1 和 2 失效时作为备用。 */
        div.relative.flex.overflow-hidden.mx-auto.min-w-80 {
             display: none !important;
        }
    `);
})();