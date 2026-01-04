// ==UserScript==
// @name         安徽省卫生从业人员培训平台刷课脚本
// @namespace    https://docs.scriptcat.org/
// @version      1.0
// @description  该油猴脚本用于 国家药品安全专业技术人员培训网 的辅助学习，脚本功能如下：自动播放视频，定时触发鼠标事件避免弹窗提示长时间未操作
// @author       脚本喵
// @match        https://www.ahwsjdxh.cn/*
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550918/%E5%AE%89%E5%BE%BD%E7%9C%81%E5%8D%AB%E7%94%9F%E4%BB%8E%E4%B8%9A%E4%BA%BA%E5%91%98%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/550918/%E5%AE%89%E5%BE%BD%E7%9C%81%E5%8D%AB%E7%94%9F%E4%BB%8E%E4%B8%9A%E4%BA%BA%E5%91%98%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let posX = 10;
    setInterval(() => {
        // 生成交替坐标避免重复
        posX = (posX === 10) ? 20 : 10;

        // 创建并派发鼠标事件
        const moveEvent = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            clientX: posX,
            clientY: 10
        });
        document.dispatchEvent(moveEvent);
    }, 1 * 60 * 1000);


    setInterval(function () {
        var video = document.querySelector("video")
        if (video && video.paused && !video.ended) {
            video.play()
        }
    }, 5 * 1000)
})();
