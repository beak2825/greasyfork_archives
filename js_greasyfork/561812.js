// ==UserScript==
// @name         P3 – Auto Feed Alpha Puma
// @namespace    https://tampermonkey.net/p3_auto_feed_alpha_bulletproof
// @version      1.5
// @description  Auto-feeds Alpha Puma when hunger > 49, highlights hungry Alphas, with persistent toggle bar.
// @match        https://pocketpumapets.com/item_feed.php?id=*
// @icon         https://www.pocketpumapets.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/561812/P3%20%E2%80%93%20Auto%20Feed%20Alpha%20Puma.user.js
// @updateURL https://update.greasyfork.org/scripts/561812/P3%20%E2%80%93%20Auto%20Feed%20Alpha%20Puma.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const HUNGER_THRESHOLD = 49;
    const REFRESH_MS = 6263;
    const STORAGE_KEY = "p3_autoFeedAlpha_enabled";

    let enabled = localStorage.getItem(STORAGE_KEY) !== "false";

    function waitForAlphaTable(callback, attempts = 0) {
        const tables = [...document.querySelectorAll("table.centerdiv")];
        const alphaTable = tables.find(t =>
            t.querySelector("input[type='radio'][name='puma_id']")
        );

        if (alphaTable) callback(alphaTable);
        else if (attempts < 20) setTimeout(() => waitForAlphaTable(callback, attempts + 1), 300);
    }

    function addBar() {
        const bar = document.createElement("div");
        bar.style.cssText = `
            position: fixed;
            top: 0; left: 0; right: 0;
            background: #111;
            color: #fff;
            padding: 6px 10px;
            font-size: 12px;
            z-index: 99999;
            display: flex;
            justify-content: space-between;
        `;

        const label = document.createElement("span");
        label.textContent = "P3 Auto Feed Alpha Puma";

        const btn = document.createElement("button");

        function sync() {
            btn.textContent = enabled ? "Stop" : "Start";
            btn.style.background = enabled ? "#c0392b" : "#27ae60";
            btn.style.color = "#fff";
        }

        btn.onclick = () => {
            enabled = !enabled;
            localStorage.setItem(STORAGE_KEY, enabled);
            sync();
        };

        sync();
        bar.append(label, btn);
        document.body.prepend(bar);
        document.body.style.marginTop = "34px";
    }

    function process(alphaTable) {
        const rows = [...alphaTable.querySelectorAll("tr")].slice(1);
        if (!rows.length || !enabled) return;

        const topRow = rows[0];
        const cells = topRow.querySelectorAll("td");
        if (!cells[3]) return;

        const hunger = parseInt(cells[3].textContent.trim(), 10);

        if (hunger > HUNGER_THRESHOLD) {
            const radio = topRow.querySelector("input[name='puma_id']");
            const form = radio?.closest("form");
            if (!form) return;

            radio.checked = true;

            if (form.requestSubmit) {
                form.requestSubmit();
            } else {
                form.submit();
            }

            // ✅ Chromebook-safe reload
            setTimeout(() => {
                window.location.href = window.location.href;
            }, 3500);
        }
    }

    addBar();

    waitForAlphaTable(alphaTable => {
        process(alphaTable);

        setTimeout(() => {
            if (enabled) {
                window.location.href = window.location.href;
            }
        }, REFRESH_MS);
    });

})();
