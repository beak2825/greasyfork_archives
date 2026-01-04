// ==UserScript==
// @name         医世界-医视在线刷课脚本
// @namespace    https://jiaobenmiao.com/
// @version      1.0
// @description  该油猴脚本用于 医世界-医视在线 的辅助看课，脚本功能如下：打开课程列表页面后，自动连续播放下一个未完成的视频
// @author       脚本喵
// @match        https://school.mvwchina.com/*
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550427/%E5%8C%BB%E4%B8%96%E7%95%8C-%E5%8C%BB%E8%A7%86%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/550427/%E5%8C%BB%E4%B8%96%E7%95%8C-%E5%8C%BB%E8%A7%86%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (location.href.indexOf("projectInfo?") != -1) {
        setTimeout(function () {
            var boxlist = document.querySelectorAll(".video_item_box")
            for (let i = 0; i < boxlist.length; i++) {
                var box = boxlist[i]
                if (box.innerText.indexOf("学习进度:100%") != -1) {
                    continue
                }
                if (box.innerText.indexOf("学习进度") == -1) {
                    continue
                }
                box.querySelector("button").click()
                break
            }
        }, 5000)

    }

    setInterval(function () {
        var video = document.querySelector("video")
        if (video && video.paused && !video.ended) {
            video.play()
        }

        if (video && video.ended) {
            document.querySelector("#root > div > div.video_title > p.left > span").click()
            setTimeout(function () {
                location.reload()
            }, 1000)
        }
    }, 5000)
})();
