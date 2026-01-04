// ==UserScript==
// @name         Mass 'ignore players'
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ignore players on trade
// @author       lialyhina10
// @match        https://www.pathofexile.com/trade/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pathofexile.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554893/Mass%20%27ignore%20players%27.user.js
// @updateURL https://update.greasyfork.org/scripts/554893/Mass%20%27ignore%20players%27.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const TEXTO_OBJETIVO = "Ignore Player";
    const INTERVALO_ESCANEO = 1000;
    const RETRASO_ENTRE_CLICS = 600;
    let activo = false;

    const botonControl = document.createElement("button");
    botonControl.textContent = "AutoClick OFF";
    Object.assign(botonControl.style, {
        position: "fixed",
        top: "30px",
        right: "1px",
        zIndex: "9999",
        padding: "1px 12px",
        backgroundColor: "#444",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        boxShadow: "0 0 5px rgba(0,0,0,0.3)"
    });
    document.body.appendChild(botonControl);

    botonControl.addEventListener("click", () => {
        if (!activo) {
            const confirmar = confirm("⚠️ Autoclick will be enabled on all current players. Do you wish to continue?");
            if (confirmar) {
                activo = true;
                botonControl.textContent = "AutoClick ON";
                botonControl.style.backgroundColor = "#c00";
            }
        } else {
            activo = false;
            botonControl.textContent = "AutoClick OFF";
            botonControl.style.backgroundColor = "#444";
        }
    });
    function escanearYClickear() {
        if (!activo) return;

        const botones = Array.from(document.querySelectorAll("button"))
            .filter(b => b.innerText.trim() === TEXTO_OBJETIVO && !b.dataset.yaClickeado);

        if (botones.length === 0) return;

        console.log(`🎯 Detected ${botones.length} "Ignore Player"`);

        botones.forEach((boton, i) => {
            setTimeout(() => {
                if (!boton.dataset.yaClickeado) {
                    boton.click();
                    boton.dataset.yaClickeado = "true";
                    // console.log(`button clicked ${i + 1}:`, boton);
                }
            }, i * RETRASO_ENTRE_CLICS);
        });
    }
    setInterval(escanearYClickear, INTERVALO_ESCANEO);
})();