// ==UserScript==
// @name         黑料网
// @version      2.0
// @description  去除 heiliao.com 首页弹窗、开屏广告及后续元素
// @match        https://heiliao.com/*
// @match        https://www.heiliao.com/*
// @author       Yuehua & Gemini
// @icon         https://heiliao.com/static/pc/icons/icon_64x64.qscd.png
// @grant        GM_addStyle
// @run-at       document-start
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/556459/%E9%BB%91%E6%96%99%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/556459/%E9%BB%91%E6%96%99%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🔴 黑名单配置中心：把你想删除的元素都放在这里
    const removeSelectors = [
        '.event-notice',      // 刚才你发的新元素
        '#notice_container',  // 你之前的旧元素
    ];

    // ==========================================
    // 核心逻辑区域（一般不需要改动）
    // ==========================================

    // 1. ⚡ 光速隐身术 (CSS)
    // 防止元素闪烁，直接从视觉上隐藏
    const cssRule = removeSelectors.join(', ') + ' { display: none !important; }';
    GM_addStyle(cssRule);

    // 2. 🧹 强力清除术 (JS)
    // 彻底从代码中移除节点
    function nukeElements() {
        removeSelectors.forEach(selector => {
            // 尝试查找元素
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el) {
                    el.remove();
                    // 只有在控制台开启时才打印，保持清爽
                    // console.log(`已移除垃圾: ${selector}`);
                }
            });
        });
    }

    // 3. 🛡️ 持续防御
    // 网页刚开始加载就执行
    nukeElements();
    
    // 页面加载完成后再执行一次
    window.addEventListener('load', nukeElements);

    // 每500毫秒巡逻一次（针对那种滑到底部才出来的广告，或者是延迟加载的弹窗）
    // 为了性能，我们不设置停止时间，因为现代浏览器运行这个非常快，不耗电
    setInterval(nukeElements, 500);

})();