// ==UserScript==
// @name         去e招金除水印
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除页面中 class 包含 "watermark-canvas safe-watermark" 的 div 元素
// @author       明明不远
// @match        https://xt.zhaojin.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553068/%E5%8E%BBe%E6%8B%9B%E9%87%91%E9%99%A4%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/553068/%E5%8E%BBe%E6%8B%9B%E9%87%91%E9%99%A4%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeWatermarks() {
        // 查找所有符合条件的 div 元素
        const watermarks = document.querySelectorAll('div.watermark-canvas.safe-watermark');
        watermarks.forEach(watermark => {
            watermark.remove(); // 移除水印元素
        });
    }

    // 页面加载完成后执行
    window.addEventListener('load', removeWatermarks);

    // 监听 DOM 变化，防止水印是异步加载的
    const observer = new MutationObserver(removeWatermarks);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();