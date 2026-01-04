// ==UserScript==
// @name         QQ auto redirect
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  当QQ点击链接跳转到外部浏览器，却被腾讯拦截时，脚本会自动跳转到目标网页
// @author       Poker
// @match        http*://c.pc.qq.com/*
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553644/QQ%20auto%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/553644/QQ%20auto%20redirect.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function getParam(name) {
        const url = new URL(window.location.href);
        return url.searchParams.get(name);
    }

    let target = getParam("pfurl") || getParam("url");
    if (!target) return;

    try { target = decodeURIComponent(target); } catch (e) {}
    
    if (target.endsWith('/')) {
        target = target.slice(0, -1);
    }

    window.location.replace(target);
})();
