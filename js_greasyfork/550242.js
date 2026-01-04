// ==UserScript==
// @name         B站自动打开字幕（2025年9月更新）
// @namespace    http://tampermonkey.net/
// @version      2025-09-21
// @description  bilibili b站 哔哩哔哩 播放视频时自动打开网站字幕
// @author       Hungry Shark
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550242/B%E7%AB%99%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%AD%97%E5%B9%95%EF%BC%882025%E5%B9%B49%E6%9C%88%E6%9B%B4%E6%96%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/550242/B%E7%AB%99%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%AD%97%E5%B9%95%EF%BC%882025%E5%B9%B49%E6%9C%88%E6%9B%B4%E6%96%B0%EF%BC%89.meta.js
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
        setTimeout(() => { document.querySelector('.bpx-player-ctrl-subtitle-language-item-text').click(); }, 1000)
    }
})();