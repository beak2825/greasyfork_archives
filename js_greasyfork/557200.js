// ==UserScript==
// @name         淘金币页面图片屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  阻止淘金币页面加载商品图片，提高页面加载速度
// @author       mattpower
// @match        https://huodong.taobao.com/wow/z/tbhome/pc-growth/tao-coin*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557200/%E6%B7%98%E9%87%91%E5%B8%81%E9%A1%B5%E9%9D%A2%E5%9B%BE%E7%89%87%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/557200/%E6%B7%98%E9%87%91%E5%B8%81%E9%A1%B5%E9%9D%A2%E5%9B%BE%E7%89%87%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 注入 CSS 样式阻止图片加载
     * 在 document-start 时机执行，尽早阻止图片请求
     */
    function injectBlockingStyles() {
        const style = document.createElement('style');
        style.id = 'taocoin-block-images'; // 样式标识，便于调试
        style.textContent = `
            /* 阻止商品卡片背景图片加载 */
            .goods-img {
                background-image: none !important;
                background-color: #f0f0f0 !important;
            }

            /* 阻止可能存在的 img 标签加载（如果有的话） */
            .goods-card img,
            .goods-link img {
                display: none !important;
            }

            /* 可选：为被屏蔽的图片区域添加占位提示 */
            .goods-img::after {
                content: '🚫';
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                font-size: 24px;
                color: #ccc;
            }
        `;

        // 尽早注入样式
        if (document.head) {
            document.head.appendChild(style);
        } else if (document.documentElement) {
            document.documentElement.appendChild(style);
        } else {
            // 如果连 documentElement 都没有，等待 DOM 开始构建
            document.addEventListener('DOMContentLoaded', () => {
                document.head.appendChild(style);
            });
        }

        console.log('[图片屏蔽脚本] CSS 样式已注入，商品图片将被屏蔽');
    }

    // 立即执行
    injectBlockingStyles();

})();

