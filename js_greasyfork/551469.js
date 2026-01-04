// ==UserScript==
// @name         去除rule34video的视频播放广告
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  删除rule34video的视频播放广告
// @author       MLFK
// @include      https://rule34video.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551469/%E5%8E%BB%E9%99%A4rule34video%E7%9A%84%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/551469/%E5%8E%BB%E9%99%A4rule34video%E7%9A%84%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_SELECTORS = [
        'div.fp-ui-block',
        'div[style*="position: absolute"][style*="inset: 0px"][style*="z-index: 150"]',
        'div[style*="position: absolute"][style*="inset: 0px"][style*="z-index: 160"]',
        'div.spot_under',
        'div.popup-adv'
    ];

    function removeTargetElements() {
        TARGET_SELECTORS.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.remove();
            });
        });
    }

    const observer = new MutationObserver(removeTargetElements);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setInterval(removeTargetElements, 1000);

    removeTargetElements();
})();