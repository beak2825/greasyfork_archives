// ==UserScript==
// @name         Cryptor.plus Auto Collect + Auto Login
// @namespace    https://greasyfork.org/users/rochera
// @version      1.7
// @description  Auto COLLECT
// @match        https://cryptor.plus/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564056/Cryptorplus%20Auto%20Collect%20%2B%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/564056/Cryptorplus%20Auto%20Collect%20%2B%20Auto%20Login.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const INTERVALO = 60 * 60 * 1000;
    const CHECK_EVERY = 30 * 1000;

    const KEY_LAST = 'cryptor_last_collect';
    const KEY_REFRESH = 'cryptor_refresh_pending';

    const EMAIL = 'yourmail';
    const PASSWORD = 'yourpass';

    function log(msg) {
        console.log(`[CryptorBot] ${msg}`);
    }

    function delay(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    function randomDelay(min, max) {
        return delay(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    function puedeCollect() {
        const last = Number(localStorage.getItem(KEY_LAST) || 0);
        return (Date.now() - last) >= INTERVALO;
    }

    function marcarCollect() {
        localStorage.setItem(KEY_LAST, Date.now().toString());
    }

    function hayFormularioLogin() {
        return !!(
            document.querySelector('input[name="email"]') &&
            document.querySelector('input.pass_show') &&
            document.querySelector('button[type="submit"].btn')
        );
    }

    function estaLogueado() {
        return !!(
            document.querySelector('button.btn.btn2.btn-success.merc') ||
            document.querySelector('a[href*="logout"]') ||
            document.querySelector('.user-balance')
        );
    }

    async function intentarLogin() {
        if (!hayFormularioLogin()) return;

        log('Formulario de login detectado. Iniciando login...');

        const email = document.querySelector('input[name="email"]');
        const pass = document.querySelector('input.pass_show');
        const btn = document.querySelector('button[type="submit"].btn');

        await randomDelay(1200, 2000);
        email.value = EMAIL;
        email.dispatchEvent(new Event('input', { bubbles: true }));

        await randomDelay(1200, 2200);
        pass.value = PASSWORD;
        pass.dispatchEvent(new Event('input', { bubbles: true }));

        await randomDelay(1500, 3000);
        btn.click();
        log('Login enviado.');
    }

    async function intentarCollect() {
        if (!puedeCollect()) {
            const restante = Math.ceil(
                (INTERVALO - (Date.now() - Number(localStorage.getItem(KEY_LAST)))) / 1000
            );
            log(`COLLECT aún en cooldown. Restan ${restante}s.`);
            return;
        }

        // REFRESH PREVENTIVO (una sola vez)
        if (!sessionStorage.getItem(KEY_REFRESH)) {
            log('Cooldown cumplido. Refrescando página para validar sesión...');
            sessionStorage.setItem(KEY_REFRESH, '1');
            location.reload();
            return;
        }

        sessionStorage.removeItem(KEY_REFRESH);

        if (!estaLogueado()) {
            log('Sesión inválida tras refresh. Abortando COLLECT.');
            return;
        }

        const boton = document.querySelector('button.btn.btn2.btn-success.merc');
        if (!boton) {
            log('Botón COLLECT no encontrado tras refresh.');
            return;
        }

        log('Sesión válida confirmada. Ejecutando COLLECT...');
        await randomDelay(1500, 3000);
        boton.click();
        marcarCollect();
        log('Botón COLLECT pulsado. Temporizador reiniciado.');
    }

    async function ciclo() {
        if (hayFormularioLogin()) {
            await intentarLogin();
            return;
        }

        if (estaLogueado()) {
            await intentarCollect();
            return;
        }

        log('Estado indeterminado. Esperando...');
    }

    setTimeout(() => {
        log('Inicio de comprobación.');
        ciclo();
    }, 3000);

    setInterval(() => {
        log('Inicio de comprobación.');
        ciclo();
    }, CHECK_EVERY);

})();
