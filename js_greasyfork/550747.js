// ==UserScript==
// @name         LSTSim Sync Vehicles Multiplayer
// @namespace    http://tampermonkey.net/
// @version      3.3|03_10_2025
// @description  Sincronizza i veicoli da LSTSim a Google Sheets in tabella unificata
// @match        https://*.lstsim.de/*
// @match        https://lstsim.de/*
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @downloadURL https://update.greasyfork.org/scripts/550747/LSTSim%20Sync%20Vehicles%20Multiplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/550747/LSTSim%20Sync%20Vehicles%20Multiplayer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PLAYER_NAME = "INSERIRE_NOME_UTENTE"; // 🔹 cambia per ogni client
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwZ6rWtUjfK756_oQgE_3e7BQ0M_6r4AB37OkrzLHzItUqJtPdd13P5IXXNvbwrsifx/exec"; // 🔹 NON MODIFICARE

    function collectVehicles() {
        let vehicles = [...document.querySelectorAll("div.container")].map(div => {
            let status = div.querySelector(".status_row .status")?.innerText.trim() || "N/A";
            let name = div.querySelector(".car")?.innerText.trim() || "Sconosciuto";
            return { nome: name, stato: status };
        });

        console.log("[LSTSync] Dati raccolti:", vehicles);
        sendToGoogleSheets(vehicles);
    }

    function sendToGoogleSheets(vehicles) {
        GM_xmlhttpRequest({
            method: "POST",
            url: GOOGLE_SCRIPT_URL,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ player: PLAYER_NAME, vehicles: vehicles }),
            onload: function(response) {
                console.log("[LSTSync] Risposta Google:", response.responseText);
            },
            onerror: function(error) {
                console.error("[LSTSync] Errore invio:", error);
            }
        });
    }

    setInterval(collectVehicles, 10000);

})();