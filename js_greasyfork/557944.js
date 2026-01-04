// ==UserScript==
// @name         Universal Captcha Cleaner
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically clears all site data after any captcha is solved on the page (reCAPTCHA v2/v3, hCaptcha, invisible) without breaking site load
// @author       GPT-5
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557944/Universal%20Captcha%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/557944/Universal%20Captcha%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Функция очистки всех данных сайта ---
    function clearSiteData() {
        try { localStorage.clear(); } catch(e){}
        try { sessionStorage.clear(); } catch(e){}
        try {
            document.cookie.split(";").forEach(function(c) {
                document.cookie = c.replace(/^ +/, "")
                                   .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
        } catch(e){}
        if (window.indexedDB && indexedDB.databases) {
            indexedDB.databases().then(dbs => {
                dbs.forEach(db => indexedDB.deleteDatabase(db.name));
            });
        }
        console.log('[Captcha Cleaner] Site data cleared!');
    }

    // --- Проверка наличия и решения капчи ---
    function checkCaptchaSolved() {
        const solved = [];

        // reCAPTCHA v2 / invisible
        document.querySelectorAll('textarea[g-recaptcha-response]').forEach(el => {
            if (el.value && el.value.length > 0 && !el.dataset.cleared) {
                el.dataset.cleared = "true";
                solved.push('reCAPTCHA');
            }
        });

        // hCaptcha
        document.querySelectorAll('textarea[name="h-captcha-response"]').forEach(el => {
            if (el.value && el.value.length > 0 && !el.dataset.cleared) {
                el.dataset.cleared = "true";
                solved.push('hCaptcha');
            }
        });

        // Можно добавить проверку других капч по аналогии, например:
        // textarea[name="some-other-captcha-response"]

        if (solved.length > 0) {
            console.log('[Captcha Cleaner] Detected solved captcha(s):', solved.join(', '));
            clearSiteData();
        }
    }

    // --- Наблюдение за DOM ---
    const observer = new MutationObserver(checkCaptchaSolved);
    observer.observe(document.body, { childList: true, subtree: true });

    // --- Периодическая проверка на случай динамически загружаемых капч ---
    setInterval(checkCaptchaSolved, 1000);

})();
