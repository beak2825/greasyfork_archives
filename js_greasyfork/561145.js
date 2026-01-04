// ==UserScript==
// @name         哔哩哔哩优化
// @namespace    https://zyco.uk/
// @version      2025-10-16
// @description  消除视频暂停时右下角的小电视图标
// @author       zyco
// @match        https://www.bilibili.com/*
// @grant        none
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/561145/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/561145/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('.bpx-player-state-wrap').remove();
})();