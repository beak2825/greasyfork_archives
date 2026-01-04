// ==UserScript==
// @name         chiaic.gitee.graceful
// @namespace    http://tampermonkey.net/
// @version      2025-09-27
// @description  复制 chiaic.gitee 标题和网址、去除水印
// @author       You
// @match        https://gitee.chiaic.com/bigdata/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chiaic.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550857/chiaicgiteegraceful.user.js
// @updateURL https://update.greasyfork.org/scripts/550857/chiaicgiteegraceful.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        // 去除水印
        var h = setInterval(function(){
            var wm = document.getElementById('wm');
            if (wm && wm.style.display != 'none') {
                wm.style.display = 'none';
                console.log('水印已去除');
            }
        }, 200);
        // 复制标题和网址
        document.body.addEventListener('click', function(event) {
            const target = event.target;
            const titleElm = target.closest('.ge-drawer-layer .issue-detail__title');
            if (titleElm) {
                const txt = titleElm.innerText;
                const url = window.location.href;
                const code = url.match(/(?<=issue=)(\w+)\b/)[0];
                const content = `#${code} ${txt}\n${url}`;
                navigator.clipboard.writeText(content);
                console.log('已复制', content);
            }
        });
    };
})();