// ==UserScript==
// @name         Bangumi Redirector
// @namespace    http://tampermonkey.net/
// @icon         https://bgm.tv/img/ico/ico_ios.png
// @version      1.02
// @author       Eidos
// @description  自動將 bangumi.tv 請求重定向到 bgm.tv
// @license      MIT
// @match        *://bangumi.tv/*
// @match        *://*.bangumi.tv/*
// @match        *://bgm.tv/*
// @match        *://*.bgm.tv/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563039/Bangumi%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/563039/Bangumi%20Redirector.meta.js
// ==/UserScript==

// 增加判斷：只有當目前域名「不是」 bgm.tv 時，才執行跳轉
if (location.hostname !== 'bgm.tv') {
    window.stop(); // 1. 強制中斷舊頁面載入
    location.replace('https://bgm.tv' + location.pathname + location.search + location.hash); // 2. 跳轉至 HTTPS 版 bgm.tv
}