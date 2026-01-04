// ==UserScript==
// @name         优课在线（Uooc Online）视频防暂停
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  防止优课在线的视频在窗口失去焦点（例如鼠标移出）时自动暂停。
// @author       (hona_cao)
// @match        https://www.uooconline.com/home/learn/index*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555669/%E4%BC%98%E8%AF%BE%E5%9C%A8%E7%BA%BF%EF%BC%88Uooc%20Online%EF%BC%89%E8%A7%86%E9%A2%91%E9%98%B2%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/555669/%E4%BC%98%E8%AF%BE%E5%9C%A8%E7%BA%BF%EF%BC%88Uooc%20Online%EF%BC%89%E8%A7%86%E9%A2%91%E9%98%B2%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('优课在线防暂停脚本已加载');

    // 您提供的核心代码
    setInterval(function () {
        // 寻找页面中的第一个 <video> 元素
        var current_video = document.getElementsByTagName('video')[0];

        // 检查视频元素是否存在，防止在没有视频的页面上报错
        if (current_video) {
            // 尝试播放视频
            // .play() 会返回一个 Promise，但为了保持和你代码一致的简单性，我们直接调用
            current_video.play();
        }
    }, 1000); // 每1000毫秒（1秒）检查并执行一次
})();