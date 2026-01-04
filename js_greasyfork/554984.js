// ==UserScript==
// @name         WinBet Balance Replace
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Замяна на стойности в div елемент на localhost
// @match        https://winbet.bg/sports*
// @match        https://winbet.bg/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554984/WinBet%20Balance%20Replace.user.js
// @updateURL https://update.greasyfork.org/scripts/554984/WinBet%20Balance%20Replace.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceCurrencyDivs() {
        const divs = document.querySelectorAll('div.AsjKG');

        divs.forEach(div => {
            const lvDiv = div.querySelector('.uQfA-.KPV-F:nth-child(1)');
            const eurDiv = div.querySelector('.uQfA-.KPV-F:nth-child(2)');

            if (lvDiv && eurDiv && lvDiv.textContent.includes('0.89') && eurDiv.textContent.includes('0.46')) {
                // Нов HTML формат
                const newHtml = `
                    <div class="AsjKG">
                        <div class="XrXJT kYYTV sqauJ">
                            <div class="uQfA- KPV-F">
                                12600.00 <span class="wbRfe nav-user__currency">лв</span> /
                                6442.47 <span class="wbRfe nav-user__currency">€</span>
                            </div>
                        </div>
                    </div>
                `;
                div.outerHTML = newHtml;
            }
        });
    }

    // Изпълнение при зареждане
    window.addEventListener('load', replaceCurrencyDivs);

    // Ако съдържанието се променя динамично
    const observer = new MutationObserver(() => replaceCurrencyDivs());
    observer.observe(document.body, { childList: true, subtree: true });
})();
