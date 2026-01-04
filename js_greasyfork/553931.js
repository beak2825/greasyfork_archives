// ==UserScript==
// @name         浙江省安全生产网络学院刷课脚本
// @namespace    https://jiaobenmiao.com/
// @version      1.0
// @description  该油猴脚本用于 浙江省安全生产网络学院 的辅助看课，脚本功能如下：解除视频自动暂停限制，视频自动播放
// @author       脚本喵
// @match        https://yjaqxy.zjyjxj.cn/*
// @grant        none
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553931/%E6%B5%99%E6%B1%9F%E7%9C%81%E5%AE%89%E5%85%A8%E7%94%9F%E4%BA%A7%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/553931/%E6%B5%99%E6%B1%9F%E7%9C%81%E5%AE%89%E5%85%A8%E7%94%9F%E4%BA%A7%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

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

    setTimeout(function () {
        var video = document.querySelector("video")
        if (video.paused) {
            video.play()
        }
    }, 3000)
})();
