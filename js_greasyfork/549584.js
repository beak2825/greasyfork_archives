// ==UserScript==
// @name         SKLive 自动跳转
// @version      1.0
// @description  跳转原视频源：YouTube、Twitch
// @author       yzcjd
// @author2     ChatGPT4辅助
// @namespace    https://greasyfork.org/users/1171320
// @license     MIT
// @match        https://skknower.com/twitch/*
// @match        https://sk-knower.com/live*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549584/SKLive%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/549584/SKLive%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let host = window.location.host;
    let pathname = window.location.pathname;
    let search = window.location.search;

    // 规则1: skknower.com/twitch/*** → twitch.com/***
    if (host === 'skknower.com' && pathname.startsWith('/twitch/')) {
        let path = pathname.replace(/^\/twitch\//, '');
        let targetUrl = 'https://twitch.com/' + path;
        window.location.replace(targetUrl);
    }

    // 规则2: sk-knower.com/live?v=xxx → youtube.com/watch?v=xxx
    if (host === 'sk-knower.com' && pathname === '/live') {
        // 从参数中提取 v
        let params = new URLSearchParams(search);
        let v = params.get('v');
        if (v) {
            let targetUrl = 'https://www.youtube.com/watch?v=' + v;
            window.location.replace(targetUrl);
        }
    }
})();
