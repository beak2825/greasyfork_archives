// ==UserScript==
// @name         Wysyłacz herosów na dcka
// @version      1.0
// @description  Panel do wysyłki herosów z wyborem przywo/bez przywo
// @match        http://*.margonem.pl/*
// @match        https://*.margonem.pl/*
// @grant        none
// @namespace https://greasyfork.org/users/1543311
// @downloadURL https://update.greasyfork.org/scripts/557474/Wysy%C5%82acz%20heros%C3%B3w%20na%20dcka.user.js
// @updateURL https://update.greasyfork.org/scripts/557474/Wysy%C5%82acz%20heros%C3%B3w%20na%20dcka.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WEBHOOK_URL = "https://discord.com/api/webhooks/1444846233477709876/OpxQDgoPNuR6waVEHvcRJ55QeiJxzaTeUwvD6l6zoJsuvKVplFr9_gtMMJ2PCqVqg6YE";
    let lastSentHero = null;

    // Funkcja wysyłająca webhooka
    function sendHero(heroName, withSummon) {
        let content = `@here Heros: **${heroName}**`;
        if (withSummon) content += " (przywo)";
        else content += " (bez przywo)";

        fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content })
        }).catch(console.error);

        console.log("[Wysyłacz herosów] Wysłano:", content);
    }

    // Funkcja tworząca panel przy nowym herosie
    function createHeroPanel(heroName) {
        const panel = document.createElement("div");
        panel.style.position = "fixed";
        panel.style.top = "20px";
        panel.style.left = "50%";
        panel.style.transform = "translateX(-50%)";
        panel.style.backgroundColor = "rgba(0,0,0,0.85)";
        panel.style.color = "#fff";
        panel.style.padding = "15px 20px";
        panel.style.borderRadius = "10px";
        panel.style.zIndex = "9999";
        panel.style.fontFamily = "Arial, sans-serif";
        panel.style.boxShadow = "0 0 10px #000";

        const title = document.createElement("div");
        title.innerText = `Znaleziono herosa: ${heroName}`;
        title.style.marginBottom = "10px";
        panel.appendChild(title);

        const checkboxLabel = document.createElement("label");
        checkboxLabel.style.display = "block";
        checkboxLabel.style.marginBottom = "10px";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true; // domyślnie przywo
        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(document.createTextNode(" Przywo"));
        panel.appendChild(checkboxLabel);

        const btnSend = document.createElement("button");
        btnSend.innerText = "Wyślij";
        btnSend.style.marginRight = "10px";
        btnSend.style.padding = "5px 10px";
        btnSend.style.cursor = "pointer";

        const btnCancel = document.createElement("button");
        btnCancel.innerText = "Anuluj";
        btnCancel.style.padding = "5px 10px";
        btnCancel.style.cursor = "pointer";

        panel.appendChild(btnSend);
        panel.appendChild(btnCancel);
        document.body.appendChild(panel);

        btnSend.addEventListener("click", () => {
            sendHero(heroName, checkbox.checked);
            panel.remove();
        });

        btnCancel.addEventListener("click", () => {
            panel.remove();
        });
    }

    // OBSERVER wykrywający nowe herosy
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;
                const text = node.innerText;
                if (!text) continue;

                if (text.includes("Znaleziono herosa")) {
                    const match = text.match(/Znaleziono herosa\s+(.+?)\s*\(/);
                    if (!match) continue;

                    const heroName = match[1].trim();
                    if (!heroName) continue;
                    if (lastSentHero === heroName) continue;

                    lastSentHero = heroName;

                    // Tworzymy panel do decyzji
                    createHeroPanel(heroName);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
