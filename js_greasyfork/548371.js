// ==UserScript==
// @name         Faction Bank No Loan
// @version      2025-09-04
// @description  avoid sending more money than the user has
// @author       Elvay [3095345]
// @match        https://www.torn.com/factions.php?step=your*
// @namespace https://greasyfork.org/users/1279378
// @downloadURL https://update.greasyfork.org/scripts/548371/Faction%20Bank%20No%20Loan.user.js
// @updateURL https://update.greasyfork.org/scripts/548371/Faction%20Bank%20No%20Loan.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function isMoneySufficient(playerName, moneyAmount) {

        const userList = document.querySelector('section[class^="money"] > section[class^="userListWrap"]');

        const items = userList.querySelectorAll('ul > li');

        for (const li of items) {
            const nameNode = li.querySelector('span.honor-text:not(.honor-text-svg)');
            const hiddenInput = li.querySelector('div[class^=input-money-group] input[type="hidden"]');

            if (!nameNode || !hiddenInput) continue;

            const name = nameNode.textContent.trim();
            const availableMoney = parseFloat(hiddenInput.value);

            if (playerName.includes(name) && moneyAmount <= availableMoney) {
                return true;
            }
        }

        return false;
    }


    document.addEventListener('click', function(e) {
        const btn = e.target.closest('button[type="submit"].ctaButton___OOMgj');
        const form = btn.closest('form');

        if (window.location.hash !== '#/tab=controls&option=give-to-user') return;

        const giveMoneyRadio = form.querySelector('#give-money');

        if (!giveMoneyRadio || !giveMoneyRadio.checked) return;

        const nameInput = form.querySelector('input[name="searchAccount"]');
        const hiddenAmountInput = form.querySelector('input[type="hidden"].input-money');

        const playerName = nameInput ? nameInput.value.trim() : '';
        const moneyAmount = hiddenAmountInput ? parseFloat(hiddenAmountInput.value) : 0;

        if (!isMoneySufficient(playerName, moneyAmount)) {
            if (!confirm("You’re about to send more money than the user has. Continue?")) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        }
    }, true);

})();