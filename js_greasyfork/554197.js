// ==UserScript==
// @name         中国医师协会远程教育平台刷课脚本
// @namespace    https://jiaobenmiao.com/
// @version      1.0
// @description  该油猴脚本用于 中国医师协会远程教育平台 的辅助看课，脚本功能如下：解除视频自动暂停限制
// @author       脚本喵
// @match        https://www.cmdacme.com/*
// @grant        none
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554197/%E4%B8%AD%E5%9B%BD%E5%8C%BB%E5%B8%88%E5%8D%8F%E4%BC%9A%E8%BF%9C%E7%A8%8B%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/554197/%E4%B8%AD%E5%9B%BD%E5%8C%BB%E5%B8%88%E5%8D%8F%E4%BC%9A%E8%BF%9C%E7%A8%8B%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
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


    let oldadd = EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener = function (...args) {
        if (window.onblur !== null) {
            window.onblur = null;
        }
        if (args.length !== 0 && args[0] === 'visibilitychange') {
            console.log('劫持visibilitychange成功，奥利给！')
            return;
        }
        return oldadd.call(this, ...args)
    }
})();
