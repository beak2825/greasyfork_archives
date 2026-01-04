// ==UserScript==
// @name         Mobile01 關閉 VIP提醒
// @namespace    http://tampermonkey.net/
// @version      2025-08-14
// @description  自動關閉 Mobile01 VIP 提醒
// @author       HY chen
// @match        *://www.mobile01.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mobile01.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548236/Mobile01%20%E9%97%9C%E9%96%89%20VIP%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/548236/Mobile01%20%E9%97%9C%E9%96%89%20VIP%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setCookie(name, value, days) {
        let d = new Date();
        d.setTime(d.getTime() + (days*86400*1000));
        document.cookie = `${name}=${value};expires=${d.toUTCString()};domain=.mobile01.com;path=/;SameSite=Lax;`;
    }

    function getCookie(name) {
        return document.cookie.split('; ').find(row => row.startsWith(name+'='))?.split('=')[1];
    }

    if (getCookie("vip_msg") !== "1") {
        setCookie("vip_msg", 1, 30);
        console.log("VIP 提醒已關閉 (cookie 已寫入)");
    }
})();
