// ==UserScript==
// @name         超星学习通 反黑屏暂停随堂检测 反检测刷课
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  每隔1秒检测并移除指定div，然后200ms后点击播放按钮
// @match        https://*.chaoxing.com/*
// @run-at       document-idle
// @grant        none
// @author       kaesinol
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553067/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%20%E5%8F%8D%E9%BB%91%E5%B1%8F%E6%9A%82%E5%81%9C%E9%9A%8F%E5%A0%82%E6%A3%80%E6%B5%8B%20%E5%8F%8D%E6%A3%80%E6%B5%8B%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/553067/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%20%E5%8F%8D%E9%BB%91%E5%B1%8F%E6%9A%82%E5%81%9C%E9%9A%8F%E5%A0%82%E6%A3%80%E6%B5%8B%20%E5%8F%8D%E6%A3%80%E6%B5%8B%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const selectorDiv = '.x-container.ans-timelineobjects.x-container-default';
    const selectorBtn = 'button.vjs-play-control.vjs-control.vjs-button.vjs-paused';

    setInterval(() => {
        const divs = document.querySelectorAll(selectorDiv);
        if (divs.length > 0) {
            divs.forEach(div => div.remove());
            console.log(`[remove-ans] removed ${divs.length} node(s)`);
        }
        setTimeout(() => {
            const btn = document.querySelector(selectorBtn);
            if (btn) {
                btn.click();
                console.log('[remove-ans] clicked play button');
            } else {
                console.log('[remove-ans] play button not found');
            }
        }, 200);
    }, 1000);

})();
