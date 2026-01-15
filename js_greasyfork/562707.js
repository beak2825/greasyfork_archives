// ==UserScript==
// @name         Automatically disables Google SafeSearch
// @name:ar      معطل فلتر البحث الآمن من جوجل
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically disables Google SafeSearch on all search pages by intercepting URLs, form submissions, and history API calls. Works on all Google domains.
// @description:ar يعطل فلتر البحث الآمن من جوجل تلقائياً على جميع صفحات البحث   .
// @author       
// @match        *://*.google.com/search*
// @match        *://*.google.ad/search*
// @match        *://*.google.ae/search*
// @match        *://*.google.com.af/search*
// @match        *://*.google.com.ag/search*
// @match        *://*.google.com.ai/search*
// @match        *://*.google.al/search*
// @match        *://*.google.am/search*
// @match        *://*.google.co.ao/search*
// @match        *://*.google.com.ar/search*
// @match        *://*.google.as/search*
// @match        *://*.google.at/search*
// @match        *://*.google.com.au/search*
// @match        *://*.google.az/search*
// @match        *://*.google.ba/search*
// @match        *://*.google.com.bd/search*
// @match        *://*.google.be/search*
// @match        *://*.google.bf/search*
// @match        *://*.google.bg/search*
// @match        *://*.google.com.bh/search*
// @match        *://*.google.bi/search*
// @match        *://*.google.bj/search*
// @match        *://*.google.com.bn/search*
// @match        *://*.google.com.bo/search*
// @match        *://*.google.com.br/search*
// @match        *://*.google.bs/search*
// @match        *://*.google.bt/search*
// @match        *://*.google.co.bw/search*
// @match        *://*.google.*/search*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562707/Automatically%20disables%20Google%20SafeSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/562707/Automatically%20disables%20Google%20SafeSearch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- الجزء الجديد: تعيين الكوكيز ---
    // هذه الدالة تضبط كوكيز SAFE_SEARCH ليكون 'OFF' لمدة عامين
    function setSafeSearchCookie() {
        try {
            // تحديد النطاق الصحيح (مثل .google.com)
            const hostname = window.location.hostname;
            const domainParts = hostname.split('.');
            let domain = `.${domainParts.slice(-2).join('.')}`; // مثال: .google.com

            // في حال كان النطاق مكوناً من جزأين فقط (مثل google.co.uk)
            if (domainParts.length > 2 && (domainParts[domainParts.length - 2] === 'co' || domainParts[domainParts.length - 2] === 'com')) {
                domain = `.${domainParts.slice(-3).join('.')}`; // مثال: .google.co.uk
            }

            const expirationDate = new Date();
            expirationDate.setFullYear(expirationDate.getFullYear() + 2); // صلاحية لمدة عامين

            const cookieString = `SAFE_SEARCH=OFF; expires=${expirationDate.toUTCString()}; path=/; domain=${domain}; SameSite=Lax; Secure`;

            // تعيين الكوكيز
            document.cookie = cookieString;
        } catch (e) {
            console.error("SafeSearch Bypasser: Could not set cookie.", e);
        }
    }

    // استدعاء الدالة فوراً لضمان تعيين الكوكيز قبل أي شيء آخر
    setSafeSearchCookie();


    // --- الدالة الأساسية لتعديل الرابط ---
    function ensureSafeSearchOff(urlString) {
        try {
            const url = new URL(urlString, window.location.href);
            if (url.searchParams.has('safe') && url.searchParams.get('safe') !== 'off') {
                url.searchParams.set('safe', 'off');
                return url.toString();
            } else if (!url.searchParams.has('safe')) {
                url.searchParams.set('safe', 'off');
                return url.toString();
            }
        } catch (e) {
            console.error("SafeSearch Bypasser: Error parsing URL", e);
        }
        return urlString;
    }

    // --- 1. التعامل مع تحميل الصفحة الأولي ---
    const initialUrl = ensureSafeSearchOff(window.location.href);
    if (initialUrl !== window.location.href) {
        window.location.replace(initialUrl);
        return;
    }

    // --- 2. التعامل مع التنقل داخل الصفحة (SPA) ---
    const originalPushState = history.pushState;
    history.pushState = function(state, title, url) {
        if (typeof url === 'string') {
            arguments[2] = ensureSafeSearchOff(url);
        }
        return originalPushState.apply(this, arguments);
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function(state, title, url) {
        if (typeof url === 'string') {
            arguments[2] = ensureSafeSearchOff(url);
        }
        return originalReplaceState.apply(this, arguments);
    };

    // --- 3. التعامل مع إرسال نموذج البحث (طبقة حماية إضافية) ---
    document.addEventListener('DOMContentLoaded', () => {
        const searchForm = document.querySelector('form[action*="/search"]');
        if (searchForm) {
            searchForm.addEventListener('submit', (event) => {
                let safeInput = searchForm.querySelector('input[name="safe"]');
                if (!safeInput) {
                    safeInput = document.createElement('input');
                    safeInput.type = 'hidden';
                    safeInput.name = 'safe';
                    searchForm.appendChild(safeInput);
                }
                safeInput.value = 'off';
            });
        }
    });

})();
