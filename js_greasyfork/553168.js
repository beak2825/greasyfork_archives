// ==UserScript==
// @name         Wiki 去掉文章目录
// @namespace    http://tampermonkey.net/
// @version      2025-10-20(02)
// @description  去掉视觉占地方的无用文章目录
// @author       You
// @match        http://192.168.1.111:7001/*
// @exclude      http://192.168.1.111:7001/e/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553168/Wiki%20%E5%8E%BB%E6%8E%89%E6%96%87%E7%AB%A0%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/553168/Wiki%20%E5%8E%BB%E6%8E%89%E6%96%87%E7%AB%A0%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        const mainWrap = document.querySelector('.v-main__wrap');
        if (!mainWrap) {
            return false;
        }

        const div1 = mainWrap.lastElementChild;
        if (!div1 || div1.tagName !== 'DIV') {
            return false;
        }

        const div2 = div1.querySelector('div:first-child');
        if (!div2) {
            return false;
        }

        const leftDiv = div2.querySelector('div:first-child');
        const rightDiv = div2.querySelector(':scope > div:nth-child(2)');
        if (!leftDiv || !rightDiv) {
            return false;
        }

        leftDiv.remove();
        rightDiv.classList.remove('lg9');


        // 横向过长内容，左右滚动条
        // table 会有过长情况
        let style = document.createElement('style');
        style.innerHTML = 'div.contents { overflow-x: scroll; }';
        document.head.appendChild(style);

        return true;
    }


    let done = false;

    // 100ms 检查一次
    let intervalId = window.setInterval(function() {
        if (init()) {
            done = true;
            window.clearInterval(intervalId);
        }
    }, 100);

    // 10秒内，没有执行成功，之后1秒检查一次
    setTimeout(function() {
        window.clearInterval(intervalId);
        if (!done) {
            intervalId = window.setInterval(function() {
                if (init()) {
                    done = true;
                    window.clearInterval(intervalId);
                }
            }, 1000);
        }
    }, 10000);
})();