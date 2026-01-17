// ==UserScript==
// @name         浏览器字体渲染
// @namespace    fontrenderning.script.cmos4k
// @version      1.3.1
// @description  解决Windows平台浏览器默认情况下字体渲染偏细的问题。适用于Edge、Chrome、Firefox等。
// @author       太极
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562740/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%AD%97%E4%BD%93%E6%B8%B2%E6%9F%93.user.js
// @updateURL https://update.greasyfork.org/scripts/562740/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%AD%97%E4%BD%93%E6%B8%B2%E6%9F%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    const config = {
        shadowSize: '0.75px',
        shadowColor: '#7C7C7CDD',
        strokeSize: '0px',
        strokeColor: 'transparent'
    };

    // --- 排除列表 ---
    const excludeSelectors = [
        'i', '[class*="glyph"]', '[class*="icon"]', '[class*="fa-"]', '[class*="vjs-"]',
        '[class*="watermark"]', '.textLayer *', 'pre', 'pre *', 'code', 'code *',
        '.mjx-container *', '.katex *'
    ].join(',');

    // --- 生成 CSS ---
    const css = `
        /* 1. 全局抗锯齿 */
        html {
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            text-rendering: optimizeLegibility !important;
            -webkit-text-size-adjust: 100% !important;
        }

        /* 2. 核心渲染 */
        body, * {
            text-shadow: 0 0 ${config.shadowSize} ${config.shadowColor};
            -webkit-text-stroke: ${config.strokeSize} ${config.strokeColor};
        }

        /* 3. 排除项 */
        ${excludeSelectors} {
            text-shadow: none !important;
            -webkit-text-stroke: 0px transparent !important;
        }

        /* 4. 选中样式修复 */
        ::selection {
            background: Highlight !important;
            color: HighlightText !important;
            text-shadow: none !important;
            -webkit-text-stroke: 0px transparent !important;
        }
    `;

    // --- 注入样式 ---
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }

})();