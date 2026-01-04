// ==UserScript==
// @name         Faction Timezone Helper (timezones.js)
// @namespace    https://github.com/rookie99998/timezones.js
// @version      1.0.0
// @description  Adds a timezone selector/clock to Torn PDA.
// @author       rookie99998
// @match        https://www.torn.com/*
// @match        https://torn.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558766/Faction%20Timezone%20Helper%20%28timezonesjs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558766/Faction%20Timezone%20Helper%20%28timezonesjs%29.meta.js
// ==/UserScript==

(function () {

    // așteaptă încărcarea Torn PDA
    if (!window.TornPDA) {
        document.addEventListener("TornPDAReady", start);
    } else {
        start();
    }

    function start() {
        const ui = window.TornPDA.ui;
        
        const storageKey = "timezone_preference";

        const timezones = [];
        for (let i = -12; i <= 14; i++) {
            const name = `UTC${i >= 0 ? "+" + i : i}`;
            timezones.push({ label: name, value: i });
        }

        ui.addPanel({
            title: "Faction Timezone Helper",
            position: "top",
            render: async (root) => {

                let savedOffset = await ui.storage.get(storageKey);
                savedOffset = savedOffset ?? 0;

                const select = document.createElement("select");
                timezones.forEach(tz => {
                    const opt = document.createElement("option");
                    opt.value = tz.value;
                    opt.textContent = tz.label;
                    if (tz.value == savedOffset) opt.selected = true;
                    select.appendChild(opt);
                });

                const info = document.createElement("div");
                info.style.marginTop = "10px";
                info.style.fontSize = "14px";
                info.style.fontWeight = "bold";

                function updateDisplay() {
                    const tornTime = new Date().toISOString().slice(11, 19);
                    const nowUTC = new Date();
                    const local = new Date(nowUTC.getTime() + savedOffset * 3600 * 1000);

                    info.innerHTML = `\n                        Torn Time: ${tornTime}<br>\n                        Ora locală (UTC${savedOffset >= 0 ? "+" + savedOffset : savedOffset}):\n                        ${local.toISOString().slice(11, 19)}\n                    `;
                }

                select.addEventListener("change", async () => {
                    savedOffset = Number(select.value);
                    await ui.storage.set(storageKey, savedOffset);
                    updateDisplay();
                });

                root.appendChild(select);
                root.appendChild(info);

                updateDisplay();
                setInterval(updateDisplay, 1000);
            }
        });
    }

})();
