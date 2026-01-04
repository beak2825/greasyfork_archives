// ==UserScript==
// @name         CCW 游玩时间美化 | CCW Better Play Time
// @namespace    https://www.ccw.site/
// @version      0.1.0
// @description  美化作品评论区的游玩时间显示-共创世界 | @多bug的啸天犬
// @author       多bug的啸天犬
// @match        https://*.ccw.site/detail/*
// @icon         https://favicon.im/ccw.site
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/552903/CCW%20%E6%B8%B8%E7%8E%A9%E6%97%B6%E9%97%B4%E7%BE%8E%E5%8C%96%20%7C%20CCW%20Better%20Play%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/552903/CCW%20%E6%B8%B8%E7%8E%A9%E6%97%B6%E9%97%B4%E7%BE%8E%E5%8C%96%20%7C%20CCW%20Better%20Play%20Time.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const styleElement = document.createElement("style")
    styleElement.innerHTML = `
    .c-author {
    display: flex;
    align-items: center;
    }

    .c-author-playtime {
        margin-left: auto;
        color: #888888 !important;
        transition: color 0.25s ease;
    }

    .c-author-playtime:hover {
        color: #aaaaaa !important;
    }
    `
    document.body.appendChild(styleElement)
})();
