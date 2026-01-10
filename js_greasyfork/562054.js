// ==UserScript==
// @licence      Open Source
// @name         BNBMiners Cleaner & Wallet Auto-Fill
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Limpieza de anuncios, eliminación de bloqueos y auto-llenado de wallet
// @author       Gemini_Partner
// @match        https://bnbminers.site/earn/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562054/BNBMiners%20Cleaner%20%20Wallet%20Auto-Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/562054/BNBMiners%20Cleaner%20%20Wallet%20Auto-Fill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WALLETS = {
        "bitcoin":   "",
        "doge":      "",
        "tron":      "",
        "feyorra":   "",
        "litecoin":  "",
        "binance":   "",
        "ethereum":  ""
    };

    const log = (m) => console.log(`%c[CLEANER-BOT] ${m}`, "color: #00ffff; font-weight: bold;");

    const currentCoin = Object.keys(WALLETS).find(coin => window.location.href.includes(coin));
    const myWallet = WALLETS[currentCoin];

    // --- LIMPIEZA AGRESIVA ---
    function cleanInterface() {
        // 1. Eliminar iframes de publicidad (ignora captchas y cloudflare)
        document.querySelectorAll('iframe').forEach(f => {
            try {
                const src = f.src.toLowerCase();
                const isSafe = src.includes('google.com/recaptcha') || src.includes('hcaptcha') || src.includes('cloudflare');
                if (!isSafe) {
                    f.remove();
                }
            } catch(e) { f.remove(); }
        });

        // 2. Eliminar overlays invisibles o bloqueadores (z-index alto sin contenido útil)
        document.querySelectorAll('div').forEach(d => {
            const zIndex = parseInt(window.getComputedStyle(d).zIndex);
            if (zIndex > 100 && !d.querySelector('iframe')) {
                d.remove();
            }
        });

        // 3. Forzar visibilidad de elementos que el sitio oculte para forzar anuncios
        document.querySelectorAll('.btn-primary, .btn-success, input[name="address"]').forEach(el => {
            el.style.display = 'block';
            el.style.visibility = 'visible';
            el.style.opacity = '1';
        });
    }

    // --- INYECCIÓN DE DATOS ---
    function fillWallet() {
        if (!myWallet) return;

        const walletInput = document.querySelector('input[name="address"]') ||
                            document.querySelector('input[id="address"]') ||
                            document.querySelector('input[type="text"]');

        if (walletInput && walletInput.value !== myWallet) {
            log(`Inyectando wallet: ${currentCoin.toUpperCase()}`);
            walletInput.value = myWallet;

            // Disparar eventos para que el backend del sitio reconozca el input
            ['input', 'change', 'blur'].forEach(evt => {
                walletInput.dispatchEvent(new Event(evt, { bubbles: true }));
            });
        }
    }

    // --- BUCLE DE CONTROL ---
    function run() {
        cleanInterface();
        fillWallet();
    }

    // Bloqueo de popups nativo (Redirección de window.open)
    window.open = function() { return null; };

    // Ejecución constante para manejar contenido dinámico
    setInterval(run, 3000);

    // Refresco de seguridad (evita sesiones muertas)
    const refreshTime = window.location.href.includes('bitcoin') ? 630000 : 180000;
    setTimeout(() => window.location.reload(), refreshTime);

    log("Modo limpieza e inyección activado.");

})();