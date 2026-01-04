// ==UserScript==
// @name         内蒙古网络学院刷课脚本
// @namespace    https://jiaobenmiao.com/
// @version      1.0
// @description  该油猴脚本用于 内蒙古网络学院 的辅助看课，脚本功能如下：解除视频自动暂停的限制、自动1.5倍速播放、自动播放视频页面的下一集视频
// @author       脚本喵
// @match        https://wlxy.nmgdj.gov.cn/*
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550266/%E5%86%85%E8%92%99%E5%8F%A4%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/550266/%E5%86%85%E8%92%99%E5%8F%A4%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
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

    setInterval(function () {
        if (location.href.indexOf("detail/") != -1) {
            var video = document.querySelector("video")
            if (video && video.playbackRate != 1.5) {
                video.playbackRate = 1.5
            }
            if (video && !video.ended && video.paused) {
                video.play()
            }
            if (video && video.ended) {
                for (var i = 0; i < document.querySelectorAll("div.simplebar-mask div.ant-progress").length; i++) {
                    let liEle = document.querySelectorAll("div.simplebar-mask div.ant-progress")[i]
                    if (liEle.innerText.indexOf("100") == -1) {
                        liEle.click()
                        break
                    }
                }
            }
        }
    }, 3000)

})();
