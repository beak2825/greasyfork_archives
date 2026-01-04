// ==UserScript==
// @name         youtube 默认2倍速
// @namespace    http://tampermonkey.net/
// @version      2025.10.23
// @description  youtube 播放视频时自动 默认2倍速
// @author       Nobody
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553476/youtube%20%E9%BB%98%E8%AE%A42%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/553476/youtube%20%E9%BB%98%E8%AE%A42%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let queryValue = '';
    // 定时检测URL是否发生变化
    let timer = setInterval(function() {
        // 获取URL中的查询字符串部分
        const queryString = window.location.search;
        // 解析查询字符串，将参数以对象的形式存储
        const params = new URLSearchParams(queryString);
        // 获取特定参数的值
        const value = params.get('p');
        if (queryValue !== value) {
            openSubtitle();
            queryValue = value;
        }
    }, 2000);

    window.addEventListener('unload', function(_event) {
        clearInterval(timer)
    });

    function openSubtitle(){
        setTimeout(() => { document.querySelector("video").playbackRate = 2;
                            //document.querySelector('.bpx-player-ctrl-btn[aria-label="Subtitle"] .bpx-common-svg-icon').click();
                         }, 1000)
    }
    // Your code here...
})();