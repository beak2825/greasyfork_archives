// ==UserScript==
// @name         bypasserapid
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @description jsndjfkdks
// @namespace https://google.py
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/557306/bypasserapid.user.js
// @updateURL https://update.greasyfork.org/scripts/557306/bypasserapid.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Création du div pour les logs ---
    const logDiv = document.createElement("div");
    logDiv.style.position = "fixed";
    logDiv.style.top = "10px";
    logDiv.style.right = "10px";
    logDiv.style.backgroundColor = "yellow";
    logDiv.style.color = "black";
    logDiv.style.padding = "5px 10px";
    logDiv.style.fontFamily = "Arial, sans-serif";
    logDiv.style.fontSize = "12px";
    logDiv.style.zIndex = 99999;
    logDiv.style.maxWidth = "300px";
    logDiv.style.whiteSpace = "pre-wrap";
    document.body.appendChild(logDiv);

    function addLog(msg) {
        const timestamp = new Date().toLocaleTimeString();
        logDiv.textContent = `[${timestamp}] ${msg}\n` + logDiv.textContent;
    }

    // --- Fonction pour envoyer les coordonnées ---
    function sendClickCoords(type, x, y) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://127.0.0.1:5001/click",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ type: type, x: x, y: y }),
            onload: function() {
                addLog(`Clic envoyé: ${type} (${Math.round(x)}, ${Math.round(y)})`);
            },
            onerror: function() {
                addLog(`Erreur en envoyant: ${type}`);
            }
        });
    }

    // --- Scanner la page pour "start" et "nextbtn" ---
    function scan() {
        // Start par texte
        const startElements = Array.from(document.querySelectorAll("*")).filter(el => 
            (el.innerText || "").toLowerCase().trim().includes("start")
        );
        startElements.forEach(el => {
            const r = el.getBoundingClientRect();
            const x = r.left + r.width / 2;
            const y = r.top + r.height / 2;
            sendClickCoords("start", x, y);
        });

        // Next par ID
        const nextBtn = document.getElementById("nextbtn");
        if(nextBtn) {
            const r = nextBtn.getBoundingClientRect();
            const x = r.left + r.width / 2;
            const y = r.top + r.height / 2;
            sendClickCoords("next", x, y);
        }
    }

    // --- Lancer le scan toutes les 500 ms ---
    setInterval(scan, 500);

})();