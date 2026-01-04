// ==UserScript==
// @name         Auto Claim Inteligente — @sivermsc
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Da clic automáticamente, muestra balance y tiempo restante, con ventanita flotante — @sivermsc
// @author       @sivermsc
// @match        https://faucetearner.org/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553778/Auto%20Claim%20Inteligente%20%E2%80%94%20%40sivermsc.user.js
// @updateURL https://update.greasyfork.org/scripts/553778/Auto%20Claim%20Inteligente%20%E2%80%94%20%40sivermsc.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("[AutoClaim @sivermsc] Script cargado ✅");

    const CLAIM_BUTTON_ID = "claimButton";
    const COUNTDOWN_ID = "claimCountdown";
    const INTERVAL_CHECK = 500; // Comprobar cada 0.5s
    let balanceInicial = 0;

    // === Función para obtener balance inicial y actual ===
    function obtenerBalance() {
        const el = document.querySelector("#balance, .balance, span#bal, .user-balance");
        if (!el) return 0;
        const val = parseFloat(el.innerText.replace(/[^\d.]/g, ""));
        return isNaN(val) ? 0 : val;
    }

    // === Ventanita flotante ===
    function mostrarVentana(balanceActual, ganancia, tiempo) {
        let div = document.createElement("div");
        div.innerHTML = `
            ⏱ Tiempo restante: ${tiempo} <br>
            💰 Balance: ${balanceActual.toFixed(8)} <br>
            📈 Ganancia: ${ganancia.toFixed(8)} <br>
            <span style="font-size:10px;color:#aaa;">by @sivermsc</span>
        `;
        div.style.position = "fixed";
        div.style.bottom = "40px";
        div.style.right = "20px";
        div.style.background = "#00ffb3";
        div.style.color = "#000";
        div.style.padding = "12px 18px";
        div.style.borderRadius = "10px";
        div.style.boxShadow = "0 0 12px #00000066";
        div.style.zIndex = "99999";
        div.style.fontFamily = "Arial, sans-serif";
        div.style.fontWeight = "bold";
        div.style.opacity = "0";
        div.style.transition = "opacity 0.3s ease";
        document.body.appendChild(div);

        setTimeout(() => div.style.opacity = "1", 50);
        setTimeout(() => {
            div.style.opacity = "0";
            setTimeout(() => div.remove(), 400);
        }, 2000);
    }

    // === Función de reclamo automático ===
    function autoClaim() {
        const boton = document.getElementById(CLAIM_BUTTON_ID);
        const countdown = document.getElementById(COUNTDOWN_ID);

        if (!boton || !countdown) {
            console.log("[AutoClaim @sivermsc] Botón o countdown no encontrados, reintentando...");
            setTimeout(autoClaim, INTERVAL_CHECK);
            return;
        }

        const tiempoTxt = countdown.innerText.trim();
        const [mm, ss] = tiempoTxt.split(":").map(Number);
        const tiempoSegundos = mm * 60 + ss;

        const balanceActual = obtenerBalance();
        const ganancia = balanceActual - balanceInicial;

        // Mostrar ventanita flotante con balance y tiempo restante
        mostrarVentana(balanceActual, ganancia, tiempoTxt);

        if (tiempoSegundos <= 0 && !boton.disabled) {
            console.log("[AutoClaim @sivermsc] ⏱ Tiempo agotado, enviando clic...");
            boton.click();
        }

        // Continuar verificando cada 0.5s
        setTimeout(autoClaim, INTERVAL_CHECK);
    }

    // === Inicialización ===
    setTimeout(() => {
        balanceInicial = obtenerBalance();
        console.log("[AutoClaim @sivermsc] Balance inicial:", balanceInicial);
        autoClaim();
    }, 3000);

})();
