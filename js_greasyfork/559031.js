// ==UserScript==
// @name         Auto Tyranu Evavu
// @author       MoonLord
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Auto-plays Tyranu Evavu with persistent Start/Stop UI.
// @match        https://www.neopets.com/games/tyranuevavu.phtml*
// @icon         https://pixsector.com/cache/afa23d3a/av1c12f667576e96088e6.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559031/Auto%20Tyranu%20Evavu.user.js
// @updateURL https://update.greasyfork.org/scripts/559031/Auto%20Tyranu%20Evavu.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("Tyranu Evavu: script cargado");

    const STORAGE_KEY = "tyranu_evavu_running";

    let intervalId = null;
    let isRunning = localStorage.getItem(STORAGE_KEY) === "true";

    /* =========================
       UI
    ========================== */
    function createUI() {
        const panel = document.createElement("div");
        panel.id = "tyranu-evavu-ui";
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #1e1e1e;
            color: #fff;
            padding: 10px;
            border-radius: 8px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 12px;
            box-shadow: 0 0 10px rgba(0,0,0,.6);
            text-align: center;
        `;

        panel.innerHTML = `
            <div style="font-weight:bold; margin-bottom:6px;">
                Tyranu Evavu Bot
            </div>
            <button id="tev-start" style="margin:2px; padding:4px 8px;">Start</button>
            <button id="tev-stop" style="margin:2px; padding:4px 8px;">Stop</button>
        `;

        document.body.appendChild(panel);

        document.getElementById("tev-start").onclick = startBot;
        document.getElementById("tev-stop").onclick = stopBot;

        syncUI();
    }

    function syncUI() {
        document.getElementById("tev-start").disabled = isRunning;
        document.getElementById("tev-stop").disabled = !isRunning;
    }

    /* =========================
       Game Logic
    ========================== */
    function getCardValue() {
        const img = document.querySelector('img[src*="cards/"]');
        if (!img) return null;

        const match = img.src.match(/\/(\d+)_/);
        if (!match) return null;

        return parseInt(match[1], 10);
    }

    function clickStartGame() {
        const btn = [...document.querySelectorAll('input[type="submit"]')]
            .find(b => b.value.includes("Play"));
        if (btn) {
            console.log("Iniciando juego...");
            btn.click();
            return true;
        }
        return false;
    }

    function clickPlayAgain() {
        const btn = [...document.querySelectorAll('input[type="submit"]')]
            .find(b => b.value.toLowerCase().includes("again"));
        if (btn) {
            console.log("Jugando nuevamente...");
            btn.click();
            return true;
        }
        return false;
    }

    function playRound() {
        if (!isRunning) return;

        const value = getCardValue();

        if (!value) {
            console.log("No detecto carta. Intento iniciar/continuar...");
            if (clickStartGame()) return;
            if (clickPlayAgain()) return;
            return;
        }

        console.log("Carta detectada:", value);

        const isLower = value >= 7;
        const action = isLower ? "lower" : "higher";

        const link = document.querySelector(`a[href*="action=${action}"]`);
        if (link) {
            console.log("Jugando:", action.toUpperCase());
            link.click();
        } else {
            console.log("No encontré links. Intento Play Again...");
            clickPlayAgain();
        }
    }

    /* =========================
       Controls
    ========================== */
    function startBot() {
        if (isRunning) return;

        console.log("Bot iniciado");
        isRunning = true;
        localStorage.setItem(STORAGE_KEY, "true");

        syncUI();

        intervalId = setInterval(playRound, 1500);
    }

    function stopBot() {
        console.log("Bot detenido");
        isRunning = false;
        localStorage.setItem(STORAGE_KEY, "false");

        syncUI();

        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    /* =========================
       Init
    ========================== */
    createUI();

    // 🔥 AUTO-REANUDAR tras refresh
    if (isRunning) {
        console.log("Bot reanudado automáticamente tras recarga");
        intervalId = setInterval(playRound, 1500);
    }
})();
