// ==UserScript==
// @name         FV - Daily Panel Shortcut in Daily Streak
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      4.1
// @description  Adds quick-access buttons for daily collection features (The Daily Wheel and Warehouse Exchange)
// @author       necroam
// @match        https://www.furvilla.com/dailies
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555640/FV%20-%20Daily%20Panel%20Shortcut%20in%20Daily%20Streak.user.js
// @updateURL https://update.greasyfork.org/scripts/555640/FV%20-%20Daily%20Panel%20Shortcut%20in%20Daily%20Streak.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function insertTicketBox() {
        const streakBox = document.querySelector('.registration-well.text-center');
        if (!streakBox || document.getElementById('warehouse-ticket-box')) return;

        const ticketBox = document.createElement('div');
        ticketBox.className = 'registration-well text-center';
        ticketBox.id = 'warehouse-ticket-box';
        ticketBox.style.cssText = `
            margin-top: 20px;
            font-size: 18px;
            line-height: 1.6;
        `;

        const buttonStyle = `
            font-size: 18px;
            padding: 12px 24px;
            display: inline-block;
            margin-bottom: 15px;
        `;

        ticketBox.innerHTML = `
            <h2><b>Daily Claim Shortcuts</b></h2>
            <a href="https://www.furvilla.com/wheel" class="btn" style="${buttonStyle}">
                <i class="fas fa-dharmachakra" aria-hidden="true" style="margin-right: 8px;"></i>
                The Daily Wheel
            </a>
            <a href="https://www.furvilla.com/warehouse" class="btn" style="${buttonStyle}">
                <i class="fa-solid fa-ticket" aria-hidden="true" style="margin-right: 8px;"></i>
                To Warehouse Exchange
            </a>
        `;

        streakBox.insertAdjacentElement('afterend', ticketBox);
    }

    // Use DOMContentLoaded for better cross-browser support
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertTicketBox);
    } else {
        insertTicketBox();
    }
})();
