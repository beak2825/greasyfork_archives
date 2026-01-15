// ==UserScript==
// @name         Yandex disable SafeSearch
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically disable SafeSearch, and  "Show" for sensitive content on Yandex.
// @match        https://yandex.com/*
// @match        https://*.yandex.com/*
// @match        https://yandex.ru/*
// @match        https://*.yandex.ru/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562706/Yandex%20disable%20SafeSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/562706/Yandex%20disable%20SafeSearch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hostname = window.location.hostname;

    // ------------------ 1. قبول الكوكيز تلقائيًا ------------------
    function acceptCookies() {
        const allowButton = document.getElementById('gdpr-popup-v3-button-all');
        if (allowButton) {
            allowButton.click();
            console.log("[Yandex Cookies] Accepted automatically!");
        }
    }

    // ------------------ 2. تعطيل SafeSearch عبر الكوكيز ------------------
    const TARGET_YP = "1796812933.sp.family%3A0";
    const TARGET_FSS = "0";
    const TARGET_FAMILY = "no";

    function enforceCookies() {
        const cookies = document.cookie.split(";").map(c => c.trim());

        const ypCookie = cookies.find(c => c.startsWith("yp="));
        const fssCookie = cookies.find(c => c.startsWith("fss="));
        const familyCookie = cookies.find(c => c.startsWith("family="));

        if (!ypCookie || ypCookie.split("=")[1] !== TARGET_YP) {
            document.cookie = `yp=${TARGET_YP}; domain=.${hostname}; path=/;`;
            console.log("[SafeSearch Killer] yp cookie updated.");
        }

        if (!fssCookie || fssCookie.split("=")[1] !== TARGET_FSS) {
            document.cookie = `fss=${TARGET_FSS}; domain=.${hostname}; path=/;`;
            console.log("[SafeSearch Killer] fss cookie updated.");
        }

        if (!familyCookie || familyCookie.split("=")[1] !== TARGET_FAMILY) {
            document.cookie = `family=${TARGET_FAMILY}; domain=.${hostname}; path=/;`;
            console.log("[SafeSearch Killer] family cookie updated.");
        }
    }

    // ------------------ 3. إظهار المحتوى الحساس (الضغط على الزر) ------------------
    function autoClickShowSensitive() {
        // البحث عن الزر بناءً على الكلاس و الـ aria-label الذي وفرته
        const showButton = document.querySelector('.SafeSearchModesSelect-Buttons a[aria-label="Show"]');
        if (showButton) {
            showButton.click();
            console.log("[Sensitive Content] 'Show' button clicked!");
        }
    }

    // ------------------ التنفيذ الأولي ------------------
    acceptCookies();
    enforceCookies();
    autoClickShowSensitive();

    // ------------------ مراقبة التغييرات باستخدام Observer واحد ------------------
    const observer = new MutationObserver((mutationsList) => {
        acceptCookies();
        enforceCookies();
        autoClickShowSensitive();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["cookie"]
    });

})();

