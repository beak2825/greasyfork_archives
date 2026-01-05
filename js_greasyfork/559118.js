// ==UserScript==
// @name         YT永遠聚焦在播放器(tabview)
// @namespace    https://greasyfork.org/zh-TW/users/4839
// @version      1.0
// @description  YT滑鼠左鍵強制聚焦在播放器(文字輸入區除外)
// @author       leadra
// @match        https://www.youtube.com/watch*
// @grant        none
// @license      MIT
// @icon         https://www.youtube.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/559118/YT%E6%B0%B8%E9%81%A0%E8%81%9A%E7%84%A6%E5%9C%A8%E6%92%AD%E6%94%BE%E5%99%A8%28tabview%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559118/YT%E6%B0%B8%E9%81%A0%E8%81%9A%E7%84%A6%E5%9C%A8%E6%92%AD%E6%94%BE%E5%99%A8%28tabview%29.meta.js
// ==/UserScript==

(function() {
    'use strict';



 function getVideoElement() {
        return document.querySelector('video.html5-main-video');
    }


    function isInputElementFocused() {
        const active = document.activeElement;
        return active && (['INPUT', 'TEXTAREA','SELECT'].includes(active.tagName) || active.isContentEditable);
    }



    window.addEventListener('click', function(event) {
        if (isInputElementFocused() || event.altKey) return;

        const video = getVideoElement();
        if (!video) return;

            event.preventDefault();
            //event.stopImmediatePropagation();

                video.focus();




    }, true); // Use capture to intercept before YouTube
})();