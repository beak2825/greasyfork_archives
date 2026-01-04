// ==UserScript==
// @name         北京市继续医学教育全员必修课培训刷课脚本
// @namespace    https://jiaobenmiao.com/
// @version      1.0
// @description  该油猴脚本用于北京市继续医学教育全员必修课培训的辅助看课，脚本功能如下：在课程目录自动学习未学习的课程，自动播放视频，视频结束后播放下一视频
// @author       脚本喵
// @match        https://bjsqypx.haoyisheng.com/*
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/549907/%E5%8C%97%E4%BA%AC%E5%B8%82%E7%BB%A7%E7%BB%AD%E5%8C%BB%E5%AD%A6%E6%95%99%E8%82%B2%E5%85%A8%E5%91%98%E5%BF%85%E4%BF%AE%E8%AF%BE%E5%9F%B9%E8%AE%AD%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/549907/%E5%8C%97%E4%BA%AC%E5%B8%82%E7%BB%A7%E7%BB%AD%E5%8C%BB%E5%AD%A6%E6%95%99%E8%82%B2%E5%85%A8%E5%91%98%E5%BF%85%E4%BF%AE%E8%AF%BE%E5%9F%B9%E8%AE%AD%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(function () {
        if (location.href.indexOf("?course_id=") != -1 && document.querySelectorAll(".table_checkbox").length > 0) {
            let courseIndexPageUrl = location.href
            GM_setValue("courseIndexPageUrl", courseIndexPageUrl)

            nextVideo()
        }
    }, 2500)

    function nextVideo() {
        for (let i = 0; i < document.querySelectorAll("tbody tr").length; i++) {
            let trEle = document.querySelectorAll("tbody tr")[i]
            if (trEle.innerText.indexOf("未学习") != -1) {
                trEle.querySelector("a").click()
                break
            }
        }
    }

    setTimeout(function () {
        if (document.querySelectorAll("video").length > 0) {
            var video = document.querySelectorAll("video")[0]
            if (video.paused && !video.ended) {
                video.play()
            }

            setInterval(function () {
                if (video.ended) {
                    location.href = GM_getValue("courseIndexPageUrl")
                }
            }, 5000)
        }
    }, 2500)

})();
