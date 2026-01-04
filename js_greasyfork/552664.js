// ==UserScript==
// @name         中山教师教育网刷课脚本
// @namespace    https://jiaobenmiao.com/
// @version      1.1
// @description  该油猴脚本用于 中山教师教育网 的辅助看课，脚本功能如下：自动播放视频，自动下一节视频
// @author       You
// @match        https://m.zsjsjy.com/*
// @grant        none
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552664/%E4%B8%AD%E5%B1%B1%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/552664/%E4%B8%AD%E5%B1%B1%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setInterval(function () {
        var video = document.querySelector("video")
        if (video && video.paused && !video.ended) {
            video.play()
        }
        if (video && video.ended) {
            nextVideo()
        }
    }, 5000)

    function nextVideo() {
        for (let i = 0; i < document.querySelectorAll(".m-chapter-ul li").length; i++) {
            let item = document.querySelectorAll(".m-chapter-ul li")[i]
            if (item.innerText.indexOf("已完成") != -1) {
                continue
            }
            document.querySelectorAll(".m-chapter-ul li a")[i].click()
            break
        }
    }
})();
