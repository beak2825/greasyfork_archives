// ==UserScript==
// @name         FFPaid 壁纸自动解锁器
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  直接免费获取壁纸
// @author       TheRain
// @match        https://ffpaid2.18ir.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561593/FFPaid%20%E5%A3%81%E7%BA%B8%E8%87%AA%E5%8A%A8%E8%A7%A3%E9%94%81%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/561593/FFPaid%20%E5%A3%81%E7%BA%B8%E8%87%AA%E5%8A%A8%E8%A7%A3%E9%94%81%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.cookie = "paid=1; path=/; max-age=31536000; Secure; SameSite=Lax";
    const originalGetItem = localStorage.getItem.bind(localStorage);
    localStorage.getItem = function(key) {
        if (key === 'paid_cards') {
            return JSON.stringify(new Proxy({}, {
                get: () => Date.now()
            }));
        }
        if (key === 'isUnlockPaidCards') return 'true';
        return originalGetItem(key);
    };

    window.getCookie = function(name) {
        if (name === 'paid') return '1';
        return "";
    };


})();