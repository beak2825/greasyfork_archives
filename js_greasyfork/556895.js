// ==UserScript==
// @name         河南专技在线辅助
// @version      1.0
// @description  继续教育公需科目自动播放下一个视频，因为浏览器限制，打开页面后必须手动点击一次播放按钮，后续就可以自动播放了。
// @author       makabaka
// @match        *://*.ghlearning.com/*
// @license      MIT
// @namespace https://greasyfork.org/users/1541522
// @downloadURL https://update.greasyfork.org/scripts/556895/%E6%B2%B3%E5%8D%97%E4%B8%93%E6%8A%80%E5%9C%A8%E7%BA%BF%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/556895/%E6%B2%B3%E5%8D%97%E4%B8%93%E6%8A%80%E5%9C%A8%E7%BA%BF%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function () {
    console.log('自动播放脚本已启动');
    setTimeout(() => {
        console.log('timeout 倒计时完成');
        setInterval(() => {
            const player = baiJiaYunPlayer;
            if (!player){
                console.log('未找到播放器');
                return;
            };

            if (player.paused) {
                console.log('播放器处于暂停状态，尝试播放');
                player.setVolume(0)
                player.toggle();
            }
        }, 1000)
    }, 5000)

})();
