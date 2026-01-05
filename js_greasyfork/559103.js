// ==UserScript==
// @name         上科大回放视频去水印 (ELRC Watermark Remover)
// @namespace    https://greasyfork.org/zh-CN/scripts/559103-%E4%B8%8A%E7%A7%91%E5%A4%A7%E5%9B%9E%E6%94%BE%E8%A7%86%E9%A2%91%E5%8E%BB%E6%B0%B4%E5%8D%B0-elrc-watermark-remover
// @version      1.0
// @description  移除 elrc.shanghaitech.edu.cn 视频播放页面的 id="wm_div_id" 水印
// @author       FrozenYears
// @match        https://elrc.shanghaitech.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shanghaitech.edu.cn
// @grant        GM_addStyle
// @license      GPL License
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559103/%E4%B8%8A%E7%A7%91%E5%A4%A7%E5%9B%9E%E6%94%BE%E8%A7%86%E9%A2%91%E5%8E%BB%E6%B0%B4%E5%8D%B0%20%28ELRC%20Watermark%20Remover%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559103/%E4%B8%8A%E7%A7%91%E5%A4%A7%E5%9B%9E%E6%94%BE%E8%A7%86%E9%A2%91%E5%8E%BB%E6%B0%B4%E5%8D%B0%20%28ELRC%20Watermark%20Remover%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心逻辑：注入 CSS 样式
    // 使用 !important 强制覆盖网页原有的内联样式
    // display: none 彻底隐藏元素
    // opacity: 0 和 visibility: hidden 作为双重保险
    // pointer-events: none 确保鼠标点击能穿透（虽然隐藏了通常不需要，但作为保险）

    const css = `
        #wm_div_id,
        div[id^="mask_div_id"] {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            z-index: -9999 !important;
        }
    `;

    GM_addStyle(css);

    // 控制台输出日志，确认脚本已运行
    console.log('✅ 上科大去水印脚本已加载，样式已注入。');
})();