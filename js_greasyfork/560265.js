// ==UserScript==
// @name         TPB 宽屏终极兼容版（Quick Filters 100% 正常）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  只拉宽 + 文件名单行完整显示 + 原站 Quick Filters 完美兼容
// @author       Grok
// @match        https://thepiratebay.org/search.php*
// @match        https://*.thepiratebay.org/search.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560265/TPB%20%E5%AE%BD%E5%B1%8F%E7%BB%88%E6%9E%81%E5%85%BC%E5%AE%B9%E7%89%88%EF%BC%88Quick%20Filters%20100%25%20%E6%AD%A3%E5%B8%B8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560265/TPB%20%E5%AE%BD%E5%B1%8F%E7%BB%88%E6%9E%81%E5%85%BC%E5%AE%B9%E7%89%88%EF%BC%88Quick%20Filters%20100%25%20%E6%AD%A3%E5%B8%B8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        /* 隐藏左侧栏 */
        #detCol, aside, .sidebar { display: none !important; }

        /* 主体拉满 */
        #main-content, .container { max-width: none !important; width: 100% !important; }

        /* 搜索结果真正宽屏 */
        section.col-center {
            width: 98vw !important;
            max-width: 98vw !important;
            min-width: 1600px !important;
            margin: 10px auto !important;
            padding: 0 1vw !important;
            box-sizing: border-box !important;
        }

        /* 关键：不改 li 的 display，保持原站 filter_list2() 正常工作 */
        ol#torrents { width: 100% !important; }

        /* 只改 span 的宽度 */
        span.item-name     { width: 64% !important; min-width: 64% !important; }
        span.item-type     { width: 11% !important; }
        span.item-uploaded { width: 8%  !important; }
        span.item-icons    { width: 9%  !important; }
        span.item-size     { width: 7%  !important; }
        span.item-seed     { width: 4%  !important; }
        span.item-leech    { width: 4%  !important; }
        span.item-user     { width: 6%  !important; }

        /* 强制文件名单行完整显示 */
        span.item-name a {
            white-space: nowrap !important;
            display: block !important;
            overflow: visible !important;
        }
    `;

    document.head.appendChild(Object.assign(document.createElement('style'), {textContent: css}));

    // JS 兜底：每次页面变化都强制一次单行（兼容原站过滤后重新渲染）
    const forceSingleLine = () => {
        document.querySelectorAll('span.item-name a').forEach(a => {
            a.style.whiteSpace = 'nowrap';
            a.style.overflow = 'visible';
            a.style.display = 'block';
        });
    };

    // 页面加载完 + 每次可能触发过滤后都执行
    window.addEventListener('load', forceSingleLine);
    setInterval(forceSingleLine, 800);  // 轻量轮询，完美兼容原站 Quick Filters

})();