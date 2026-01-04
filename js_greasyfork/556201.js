// ==UserScript==
// @name         Localhost Span Modifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide status span and change balance
// @match        https://superbet.ro/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556201/Localhost%20Span%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/556201/Localhost%20Span%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const NEW_AMOUNT = "9901.72";

    function run() {

        // 1. Скриване на "Contul nu a fost verificat"
        const dangerSpan = document.querySelector('span.subtext.subtext-status-color--danger');
        if (dangerSpan && dangerSpan.textContent.includes("Contul nu a fost verificat")) {
            dangerSpan.style.display = "none";
        }

        // 2. Промяна на balance span (settings__option__icon-title__balance)
        const balanceSpan = document.querySelector('span.settings__option__icon-title__balance');
        if (balanceSpan && balanceSpan.textContent.trim() === "15.65") {
            balanceSpan.textContent = NEW_AMOUNT;
        }

        // 3. Промяна на втория баланс span (sds-currency__amount)
        const currencySpans = document.querySelectorAll('span.sds-currency__amount');
        currencySpans.forEach(span => {
            if (span.textContent.trim() === "15.65") {
                span.textContent = NEW_AMOUNT;
            }
        });
    }

    // Изпълнява веднага и периодично (за SPA/Vue сайтове)
    run();
    setInterval(run, 500);
})();