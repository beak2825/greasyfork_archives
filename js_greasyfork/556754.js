// ==UserScript==
// @name         E-learning
// @namespace    E-learning
// @version      2025-11-24
// @description  E-learning自动二倍速+自动点击继续学习
// @author       ycccccc
// @match        https://eccom.yunxuetang.cn/kng/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yunxuetang.cn
// @license      123
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556754/E-learning.user.js
// @updateURL https://update.greasyfork.org/scripts/556754/E-learning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 点击继续学习
    setInterval(autoContinue, 1000);
    function autoContinue() {
        var continueBtn = document.querySelector("#reStartStudy");
        if (continueBtn && continueBtn.click) {
            var imitateMousedown = document.createEvent("MouseEvents");
            imitateMousedown.initEvent("mousedown", true, true);
            continueBtn.dispatchEvent(imitateMousedown);
            continueBtn.click();

            if (console && console.log) {
                console.log('找到并点击了[继续学习]');
            }
        }
    }

    // 二倍速
    function setDoubleSpeedOnce() {
        if (window.player && player.bdPlayer) {
            player.bdPlayer.setPlaybackRate(2);
            if (!player.bdPlayer.getMute()) {
                player.bdPlayer.setMute(true);
            }
            console.log('已设置二倍速并静音');
        } else {
            setTimeout(setDoubleSpeedOnce, 1000);
        }
    }

    setDoubleSpeedOnce();

})();