// ==UserScript==
// @name         Glomdalen → Tlačítko s proklikem do API
// @namespace    http://tampermonkey.net/
// @description  Generování tlačítka pro proklik z glomdaleno do api
// @version      1.3
// @match        https://live.glomdalen.no/fotball/*/*/kamp/*
// @author       LM
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555744/Glomdalen%20%E2%86%92%20Tla%C4%8D%C3%ADtko%20s%20proklikem%20do%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/555744/Glomdalen%20%E2%86%92%20Tla%C4%8D%C3%ADtko%20s%20proklikem%20do%20API.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function insertButton() {
        // odstranit staré tlačítko, ať se nezdvojuje
        const oldBtn = document.getElementById("nifs-api-btn");
        if (oldBtn) oldBtn.remove();

        // match ID z URL
        const parts = window.location.pathname.split('/');
        const matchId = parts.pop() || parts.pop();

        if (!matchId || isNaN(matchId)) return;

        const apiUrl = `https://v3api.nifs.no/matches/${matchId}/`;

        const check = setInterval(() => {
            const targetDiv =
                document.querySelector(".ntb-team-match-result.ntb-team-match-result__overlay");

            if (!targetDiv) return;

            clearInterval(check);

            const linkBtn = document.createElement("a");
            linkBtn.id = "nifs-api-btn";
            linkBtn.href = apiUrl;
            linkBtn.target = "_blank";
            linkBtn.textContent = "API LIVE URL";

            linkBtn.style.cssText = `
                display: block;
                text-align: center;
                padding: 14px 22px;
                font-size: 22px;
                font-weight: 900;
                background: #ffe000;
                color: #000000;
                border: 3px solid black;
                border-radius: 10px;
                cursor: pointer;
                margin-bottom: 20px;
                width: 100%;
                text-decoration: none;
            `;

            const contentBlock =
                targetDiv.querySelector(".ntb-team-match-result__content");

            if (contentBlock) {
                contentBlock.prepend(linkBtn);
            }

        }, 300);
    }

    // hlídač změny URL / SPA navigace
    function hookHistoryEvents() {
        const pushState = history.pushState;
        const replaceState = history.replaceState;

        history.pushState = function() {
            pushState.apply(history, arguments);
            window.dispatchEvent(new Event("urlchange"));
        };

        history.replaceState = function() {
            replaceState.apply(history, arguments);
            window.dispatchEvent(new Event("urlchange"));
        };

        window.addEventListener("popstate", () =>
            window.dispatchEvent(new Event("urlchange"))
        );
    }

    hookHistoryEvents();

    // když se URL změní → znovu vlož tlačítko
    window.addEventListener("urlchange", insertButton);

    // spustit při startu
    insertButton();
})();