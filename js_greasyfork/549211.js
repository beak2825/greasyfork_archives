// ==UserScript==
// @name         Webdoc - kopiera personnummer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Lägg till knapp för att kopiera personnummer i Webdoc
// @author       Du
// @match        https://webdoc.atlan.se/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/549211/Webdoc%20-%20kopiera%20personnummer.user.js
// @updateURL https://update.greasyfork.org/scripts/549211/Webdoc%20-%20kopiera%20personnummer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButton() {
        const span = document.querySelector('span[data-patientid]');
        if (!span) return;

        if (document.getElementById('bdkCopyBtn')) return;

        const btn = document.createElement('button');
        btn.innerText = 'PNR';
        btn.id = 'bdkCopyBtn';
        btn.style.marginLeft = '10px';
        btn.style.padding = '2px 6px';
        btn.style.cursor = 'pointer';

        // Använd event.stopPropagation() för att förhindra oönskad textmarkering.
        btn.addEventListener('click', (event) => {
            event.stopPropagation();
            const text = span.textContent.trim();
            const parts = text.split(/\s+/);
            const pnr = parts[parts.length - 1];

            navigator.clipboard.writeText(pnr).then(() => {
                btn.innerText = 'Kopierat!';
                setTimeout(() => btn.innerText = 'BDK', 1500);
            }).catch(err => {
                console.error('Kunde inte kopiera:', err);
            });
        });

        span.insertAdjacentElement('afterend', btn);
    }

    const observer = new MutationObserver(() => addButton());
    observer.observe(document.body, { childList: true, subtree: true });

    addButton();

})();