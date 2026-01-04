// ==UserScript==
// @name         B站视频无大会员最高清
// @namespace    https://github.com/RAMBOO1990
// @version      1.0
// @description  B站视频自动选择非大会员最高清晰度
// @author       RAMBOO
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @icon         https://www.bilibili.com//favicon.ico
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552786/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%97%A0%E5%A4%A7%E4%BC%9A%E5%91%98%E6%9C%80%E9%AB%98%E6%B8%85.user.js
// @updateURL https://update.greasyfork.org/scripts/552786/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%97%A0%E5%A4%A7%E4%BC%9A%E5%91%98%E6%9C%80%E9%AB%98%E6%B8%85.meta.js
// ==/UserScript==

(function() {
    const video = document.getElementsByTagName("video")[0];
    video.onplay = (event) => {
        const qualityList = document.getElementsByClassName("bpx-player-ctrl-quality-menu-item");
        const targetQuality = Array.from(qualityList).find(item => !item.innerText.includes("大会员"));

        if (targetQuality) {
            targetQuality.click();
            console.log("已选择清晰度:", targetQuality.innerText.trim());
        } else {
            console.log("没有找到不含大会员的清晰度选项");
        }
    };
})();