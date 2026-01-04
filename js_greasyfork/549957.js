// ==UserScript==
// @name         融学国培网chinahrt.com刷课脚本
// @namespace    https://jiaobenmiao.com/
// @version      2.0
// @description  该油猴脚本用于 融学国培网chinahrt.com 的辅助看课，脚本功能如下：自动点击播放下一节视频
// @author       脚本喵
// @match        https://*.chinahrt.com/*
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549957/%E8%9E%8D%E5%AD%A6%E5%9B%BD%E5%9F%B9%E7%BD%91chinahrtcom%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/549957/%E8%9E%8D%E5%AD%A6%E5%9B%BD%E5%9F%B9%E7%BD%91chinahrtcom%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 设置定时器一直检测，每10s检测一次
    setInterval(() => {
        const nextButton = document.querySelector('[data-title="点击播放"]');
        if (nextButton && nextButton.style.display !== "none") {
            // 获取 nextButton 的父元素
            const parentElement = nextButton.parentElement;

            // 在父元素中查找 canvas 标签
            const canvas = parentElement.querySelector('canvas');

            if (canvas) {
                canvas.click();
                console.log("自动点击了下一节按钮的 canvas");
            } else {
                console.log("未找到 canvas 元素");
            }
        }
    }, 10000);
})();
