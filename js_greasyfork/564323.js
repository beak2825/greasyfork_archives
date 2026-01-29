// ==UserScript==
// @name         Bangumi Redirector
// @namespace    http://tampermonkey.net/
// @icon         https://bgm.tv/img/ico/ico_ios.png
// @version      1.1
// @description  自動將 bangumi.tv 請求重定向到 bgm.tv
// @license      MIT
// @match        *://bangumi.tv/*
// @match        *://*.bangumi.tv/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564323/Bangumi%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/564323/Bangumi%20Redirector.meta.js
// ==/UserScript==
 
window.stop(); // 1. 強制中斷舊頁面載入
location.replace('https://bgm.tv' + location.pathname + location.search + location.hash); // 2. 直接替換域名並跳轉至 HTTPS