// ==UserScript==
// @name         Auto wybór oldboya
// @namespace    http://tampermonkey.net/
// @version      1.7.2
// @description  Wybiera ostatniego przeciwnika którego możesz pokonać + pokazuje konsolkę z info (poprawione SV)
// @author       mleko95
// @match        *://*.gangsters.pl/*
// @grant        none
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/548518/Auto%20wyb%C3%B3r%20oldboya.user.js
// @updateURL https://update.greasyfork.org/scripts/548518/Auto%20wyb%C3%B3r%20oldboya.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function parseNumber(str) {
        return parseInt(str.replace(/[^\d]/g, ""), 10);
    }

    // Tworzymy panel do podglądu
    function createConsole() {
        let box = document.createElement("div");
        box.id = "ppConsole";
        box.style.position = "fixed";
        box.style.bottom = "20px";
        box.style.right = "20px";
        box.style.background = "rgba(0,0,0,0.8)";
        box.style.color = "lime";
        box.style.fontSize = "13px";
        box.style.fontFamily = "monospace";
        box.style.padding = "8px 12px";
        box.style.border = "1px solid lime";
        box.style.borderRadius = "6px";
        box.style.zIndex = "99999";
        box.innerHTML = "⌛ Oczekiwanie na dane...";
        document.body.appendChild(box);
        return box;
    }

    function updateConsole(mySV, enemyName, enemySV) {
        let box = document.getElementById("ppConsole");
        if (!box) box = createConsole();
        box.innerHTML =
            `<b>Moje SV:</b> ${mySV.toLocaleString("pl-PL")}<br>` +
            (enemyName ?
                `<b>Przeciwnik:</b> ${enemyName}<br><b>SV:</b> ${enemySV.toLocaleString("pl-PL")}` :
                "❌ Brak przeciwnika do pokonania");
    }

    function getMySV() {
        // Znajdź div SV po linku 'SV' w div.label
        let labels = document.querySelectorAll("div.label a.titleTooltip");
        for (let a of labels) {
            if (a.textContent.trim() === "SV") {
                // rodzic div.label
                let parentDiv = a.closest("div").parentNode;
                let text = parentDiv.textContent.replace(/\s+/g, " ").trim();
                // wyciągnij tylko liczbę przed "pkt"
                let match = text.match(/([\d\s]+)pkt/);
                if (match) return parseNumber(match[1]);
            }
        }
        return null;
    }

    function selectBestOpponent() {
        let myStrength = getMySV();
        if (!myStrength) return;

        let select = document.querySelector("select[name='ppOpponent']");
        if (!select) return;

        let chosen = null;

        for (let opt of select.options) {
            let match = opt.textContent.match(/min\.\s*([\d\s]+)\s*SV/i);
            if (match) {
                let enemyStrength = parseNumber(match[1]);
                let adjustedEnemy = Math.round(enemyStrength * 1.15);
                if (myStrength >= adjustedEnemy) {
                    chosen = { option: opt, sv: enemyStrength };
                } else {
                    break;
                }
            }
        }

        if (chosen) {
            select.value = chosen.option.value;
            select.dispatchEvent(new Event("change", { bubbles: true }));
            updateConsole(myStrength, chosen.option.textContent.trim(), chosen.sv);
            console.log("✅ Wybrano:", chosen.option.textContent.trim(),
                        " (SV:", chosen.sv.toLocaleString("pl-PL"), ")");
        } else {
            updateConsole(myStrength, null, null);
            console.log("❌ Nie znaleziono przeciwnika słabszego ode mnie.");
        }
    }

    const observer = new MutationObserver(() => {
        let select = document.querySelector("select[name='ppOpponent']");
        if (select && select.options.length > 1) {
            observer.disconnect();
            selectBestOpponent();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
