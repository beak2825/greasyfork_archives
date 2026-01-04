// ==UserScript==
// @name         Jenkins Job Color Highlighter (URL Based)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Jenkins 页面根据 URL 中 Job 名称高亮显示颜色，支持 SPA 点击左侧菜单
// @author       You
// @match        *://*/view/*/job/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554506/Jenkins%20Job%20Color%20Highlighter%20%28URL%20Based%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554506/Jenkins%20Job%20Color%20Highlighter%20%28URL%20Based%29.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function getJobNameFromUrl() {
        // URL 中匹配 /job/<jobName>/
        const match = location.pathname.match(/\/job\/([^\/]+)\//);
        return match ? match[1].toLowerCase() : '';
    }

    function applyColor() {
        const jobName = getJobNameFromUrl();
        let bgColor = '';

        if (jobName.includes('test')) {
            bgColor = '#d4f8d4'; // 浅绿色
        } else if (jobName.includes('prod')) {
            bgColor = '#f8d4d4'; // 浅红色
        }

        // 左侧侧边栏
        const sidebar = document.querySelector('#side-panel') || document.querySelector('.pane.sidebar');
        if (sidebar) sidebar.style.backgroundColor = bgColor || '';

        console.log(`Job "${jobName}" 高亮显示颜色: ${bgColor}`);
    }

    // 首次执行
    applyColor();

    // 监控 URL 变化（SPA 点击左侧菜单）
    let lastPath = location.pathname;
    setInterval(() => {
        if (location.pathname !== lastPath) {
            lastPath = location.pathname;
            applyColor();
        }
    }, 500);

})();
