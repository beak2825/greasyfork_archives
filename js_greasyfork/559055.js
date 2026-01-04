// ==UserScript==
// @name         Zabiják „Přehled od AI“
// @namespace    https://greasyfork.org/users/1548584-damianvcechov
// @version      1.0
// @description  Skript ve vyhledávání google.com a google.cz odstraňuje Přehled od AI.
// @author       DamianVCechov
// @match        *://*.google.com/search*
// @match        *://*.google.cz/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559055/Zabij%C3%A1k%20%E2%80%9EP%C5%99ehled%20od%20AI%E2%80%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/559055/Zabij%C3%A1k%20%E2%80%9EP%C5%99ehled%20od%20AI%E2%80%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeAI() {
        const headings = document.getElementsByTagName('h1');
        for (let h1 of headings) {
            if (h1.textContent.trim() === "Přehled od AI" || h1.textContent.trim() === "AI Overview") {
               if (h1.parentElement) {
                    h1.parentElement.style.display = 'none';
                    h1.parentElement.setAttribute('data-tampermonkey-hidden', 'true');
                    console.log('Tampermonkey: "Přehled od AI" byl úspěšně odstraněn.');
                }
            }
        }
        const divs = document.querySelectorAll('div[aria-hidden="true"]');
        divs.forEach(div => {
             if (div.textContent.trim() === "Přehled od AI") {
                 const container = div.closest('.YzCcne') || div.closest('[data-mcpr]');
                 if (container) {
                     container.style.display = 'none';
                 }
             }
        });
    }
    removeAI();
    // Spustit při každé změně v DOMu (Google načítá věci postupně)
    const observer = new MutationObserver((mutations) => {
        removeAI();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();