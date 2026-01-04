// ==UserScript==
// @name         大众云学yxlearning系列刷课脚本|烟台|德州|威海|日照|滨州|泰安|枣庄|淄博|东营|济宁|通用版本
// @namespace    https://jiaobenmiao.com/
// @version      2.0
// @description  该油猴脚本用于 大众云学yxlearning 的辅助看课，脚本功能如下：自动跳题/答题屏蔽
// @author       脚本喵
// @match        *://*.yxlearning.com/*
// @match        *://*.zhuanjipx.com/*
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550058/%E5%A4%A7%E4%BC%97%E4%BA%91%E5%AD%A6yxlearning%E7%B3%BB%E5%88%97%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%7C%E7%83%9F%E5%8F%B0%7C%E5%BE%B7%E5%B7%9E%7C%E5%A8%81%E6%B5%B7%7C%E6%97%A5%E7%85%A7%7C%E6%BB%A8%E5%B7%9E%7C%E6%B3%B0%E5%AE%89%7C%E6%9E%A3%E5%BA%84%7C%E6%B7%84%E5%8D%9A%7C%E4%B8%9C%E8%90%A5%7C%E6%B5%8E%E5%AE%81%7C%E9%80%9A%E7%94%A8%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/550058/%E5%A4%A7%E4%BC%97%E4%BA%91%E5%AD%A6yxlearning%E7%B3%BB%E5%88%97%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%7C%E7%83%9F%E5%8F%B0%7C%E5%BE%B7%E5%B7%9E%7C%E5%A8%81%E6%B5%B7%7C%E6%97%A5%E7%85%A7%7C%E6%BB%A8%E5%B7%9E%7C%E6%B3%B0%E5%AE%89%7C%E6%9E%A3%E5%BA%84%7C%E6%B7%84%E5%8D%9A%7C%E4%B8%9C%E8%90%A5%7C%E6%B5%8E%E5%AE%81%7C%E9%80%9A%E7%94%A8%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function checkAndHandleElement() {
        // 检测目标问题元素（带特定样式的div）
        const questionElement = document.querySelector('div.bplayer-question-wrap[style="display: flex;"]');

        if (questionElement) {
            // 检测到元素时执行删除操作
            questionElement.remove();
            console.log('已检测并删除问题元素');

            // 2秒后尝试点击播放按钮
            setTimeout(() => {
                const playButton = document.querySelector('span.icon.bplayer-play-btn');
                if (playButton) {
                    playButton.click();
                    console.log('已点击视频播放按钮');
                } else {
                    console.log('未找到播放按钮，无法执行点击');
                }
            }, 2000);
        } else {
            console.log('未检测到问题元素，继续等待下次检测');
        }
    }

    // 首次立即执行检测（避免初始等待5秒）
    checkAndHandleElement();

    // 每5秒循环执行检测（5000毫秒=5秒）
    setInterval(checkAndHandleElement, 5000);
})();
