// ==UserScript==
// @name         Haraj - Force Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  إجبار موقع حراج على تفعيل الوضع الداكن تلقائياً دائماً
// @match        https://haraj.com.sa/*
// @match        https://*.haraj.com.sa/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562700/Haraj%20-%20Force%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/562700/Haraj%20-%20Force%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {

    // وظيفة تفعيل الوضع الداكن
    function enableDarkMode() {
        document.documentElement.classList.add("dark");
    }

    // تفعيل الوضع الداكن مبدئياً
    enableDarkMode();

    // مراقبة أي محاولة لإزالة الوضع الداكن
    const observer = new MutationObserver(() => {
        if (!document.documentElement.classList.contains("dark")) {
            enableDarkMode();
        }
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // محاولة الضغط على زر الوضع الداكن إن وجد
    function clickDarkButtonIfExists() {
        const btn = document.querySelector('svg[data-icon="moon"], svg.fa-moon');
        if (btn) {
            btn.closest("button")?.click();
        }
    }

    // مراقبة ظهور زر الوضع الداكن
    const btnObserver = new MutationObserver(clickDarkButtonIfExists);
    btnObserver.observe(document.documentElement, { childList: true, subtree: true });

})();

