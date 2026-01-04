// ==UserScript==
// @name         BypassH1 - Fast Link Shortener Bypass
// @namespace    https://github.com/tu-usuario
// @version      1.4
// @description  Bypass rápido y automático para lootdest, loot-link y sitios relacionados
// @author       TuNombre
// @match        *://loot-link.com/s?*
// @match        *://loot-links.com/s?*
// @match        *://lootlink.org/s?*
// @match        *://lootlinks.co/s?*
// @match        *://lootdest.info/s?*
// @match        *://lootdest.org/s?*
// @match        *://lootdest.com/s?*
// @match        *://links-loot.com/s?*
// @match        *://linksloot.net/s?*
// @icon         https://www.google.com/s2/favicons?domain=luarmor.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553396/BypassH1%20-%20Fast%20Link%20Shortener%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/553396/BypassH1%20-%20Fast%20Link%20Shortener%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hostname = window.location.hostname;

    // Función mejorada para esperar elementos
    function waitForElement(selector, callback, interval = 100, timeout = 10000) {
        const startTime = Date.now();
        const timer = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(timer);
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(timer);
                console.log(`BypassH1: Element "${selector}" not found within ${timeout}ms`);
            }
        }, interval);
    }

    // Función de decodificación mejorada
    function decodeURI(encodedString, prefixLength = 5) {
        try {
            let decodedString = '';
            const base64Decoded = atob(encodedString);
            const prefix = base64Decoded.substring(0, prefixLength);
            const encodedPortion = base64Decoded.substring(prefixLength);

            for (let i = 0; i < encodedPortion.length; i++) {
                const encodedChar = encodedPortion.charCodeAt(i);
                const prefixChar = prefix.charCodeAt(i % prefix.length);
                const decodedChar = encodedChar ^ prefixChar;
                decodedString += String.fromCharCode(decodedChar);
            }

            return decodedString;
        } catch (error) {
            console.error('BypassH1: Error en decodificación:', error);
            return null;
        }
    }

    // Limpiar localStorage de forma más selectiva
    function cleanLocalStorage() {
        try {
            const keysToKeep = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('t_')) {
                    // Mantener solo algunas keys, eliminar las demás
                    const keyNum = parseInt(key.replace('t_', ''));
                    if (keyNum !== 54 && keyNum < 100) {
                        localStorage.removeItem(key);
                    }
                }
            }

            // Agregar keys falsas para bypass
            for (let i = 0; i < 20; i++) {
                if (i !== 54) {
                    const key = `t_${i}`;
                    const data = {
                        value: 1,
                        expiry: new Date().getTime() + 604800000
                    };
                    localStorage.setItem(key, JSON.stringify(data));
                }
            }
            console.log('BypassH1: localStorage limpiado y preparado');
        } catch (error) {
            console.error('BypassH1: Error limpiando localStorage:', error);
        }
    }

    // CSS del spinner (mejorado)
    function addSpinnerCSS() {
        const spinnerCSS = `
            <style>
            .wheel-and-hamster {
              --dur: 1s;
              position: relative;
              width: 12em;
              height: 12em;
              margin: auto;
            }
            .wheel,
            .hamster,
            .hamster div,
            .spoke {
              position: absolute;
            }
            .wheel,
            .spoke {
              border-radius: 50%;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }
            .wheel {
              background: radial-gradient(100% 100% at center,hsla(0,0%,60%,0) 47.8%,hsl(0,0%,60%) 48%);
              z-index: 2;
            }
            .hamster {
              animation: hamster var(--dur) ease-in-out infinite;
              top: 50%;
              left: calc(50% - 3.5em);
              width: 7em;
              height: 3.75em;
              transform: rotate(4deg) translate(-0.8em,1.85em);
              transform-origin: 50% 0;
              z-index: 1;
            }
            .hamster__head {
              animation: hamsterHead var(--dur) ease-in-out infinite;
              background: hsl(30,90%,55%);
              border-radius: 70% 30% 0 100% / 40% 25% 25% 60%;
              box-shadow: 0 -0.25em 0 hsl(30,90%,80%) inset, 0.75em -1.55em 0 hsl(30,90%,90%) inset;
              top: 0;
              left: -2em;
              width: 2.75em;
              height: 2.5em;
              transform-origin: 100% 50%;
            }
            .hamster__ear {
              animation: hamsterEar var(--dur) ease-in-out infinite;
              background: hsl(0,90%,85%);
              border-radius: 50%;
              box-shadow: -0.25em 0 hsl(30,90%,55%) inset;
              top: -0.25em;
              right: -0.25em;
              width: 0.75em;
              height: 0.75em;
              transform-origin: 50% 75%;
            }
            .hamster__eye {
              animation: hamsterEye var(--dur) linear infinite;
              background-color: hsl(0,0%,0%);
              border-radius: 50%;
              top: 0.375em;
              left: 1.25em;
              width: 0.5em;
              height: 0.5em;
            }
            .hamster__nose {
              background: hsl(0,90%,75%);
              border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%;
              top: 0.75em;
              left: 0;
              width: 0.2em;
              height: 0.25em;
            }
            .hamster__body {
              animation: hamsterBody var(--dur) ease-in-out infinite;
              background: hsl(30,90%,90%);
              border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%;
              box-shadow: 0.1em 0.75em 0 hsl(30,90%,55%) inset, 0.15em -0.5em 0 hsl(30,90%,80%) inset;
              top: 0.25em;
              left: 2em;
              width: 4.5em;
              height: 3em;
              transform-origin: 17% 50%;
            }
            .hamster__limb--fr,
            .hamster__limb--fl {
              clip-path: polygon(0 0,100% 0,70% 80%,60% 100%,0% 100%,40% 80%);
              top: 2em;
              left: 0.5em;
              width: 1em;
              height: 1.5em;
              transform-origin: 50% 0;
            }
            .hamster__limb--fr {
              animation: hamsterFRLimb var(--dur) linear infinite;
              background: linear-gradient(hsl(30,90%,80%) 80%,hsl(0,90%,75%) 80%);
              transform: rotate(15deg);
            }
            .hamster__limb--fl {
              animation: hamsterFLLimb var(--dur) linear infinite;
              background: linear-gradient(hsl(30,90%,90%) 80%,hsl(0,90%,85%) 80%);
              transform: rotate(15deg);
            }
            .hamster__limb--br,
            .hamster__limb--bl {
              border-radius: 0.75em 0.75em 0 0;
              clip-path: polygon(0 0,100% 0,100% 30%,70% 90%,70% 100%,30% 100%,40% 90%,0% 30%);
              top: 1em;
              left: 2.8em;
              width: 1.5em;
              height: 2.5em;
              transform-origin: 50% 30%;
            }
            .hamster__limb--br {
              animation: hamsterBRLimb var(--dur) linear infinite;
              background: linear-gradient(hsl(30,90%,80%) 90%,hsl(0,90%,75%) 90%);
              transform: rotate(-25deg);
            }
            .hamster__limb--bl {
              animation: hamsterBLLimb var(--dur) linear infinite;
              background: linear-gradient(hsl(30,90%,90%) 90%,hsl(0,90%,85%) 90%);
              transform: rotate(-25deg);
            }
            .hamster__tail {
              animation: hamsterTail var(--dur) linear infinite;
              background: hsl(0,90%,85%);
              border-radius: 0.25em 50% 50% 0.25em;
              box-shadow: 0 -0.2em 0 hsl(0,90%,75%) inset;
              top: 1.5em;
              right: -0.5em;
              width: 1em;
              height: 0.5em;
              transform: rotate(30deg);
              transform-origin: 0.25em 0.25em;
            }
            .spoke {
              animation: spoke var(--dur) linear infinite;
              background: radial-gradient(100% 100% at center,hsl(0,0%,60%) 4.8%,hsla(0,0%,60%,0) 5%), linear-gradient(hsla(0,0%,55%,0) 46.9%,hsl(0,0%,65%) 47% 52.9%,hsla(0,0%,65%,0) 53%) 50% 50% / 99% 99% no-repeat;
            }

            @keyframes hamster {
              from, to { transform: rotate(4deg) translate(-0.8em,1.85em); }
              50% { transform: rotate(0) translate(-0.8em,1.85em); }
            }
            @keyframes hamsterHead {
              from, 25%, 50%, 75%, to { transform: rotate(0); }
              12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(8deg); }
            }
            @keyframes hamsterEye {
              from, 90%, to { transform: scaleY(1); }
              95% { transform: scaleY(0); }
            }
            @keyframes hamsterEar {
              from, 25%, 50%, 75%, to { transform: rotate(0); }
              12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(12deg); }
            }
            @keyframes hamsterBody {
              from, 25%, 50%, 75%, to { transform: rotate(0); }
              12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(-2deg); }
            }
            @keyframes hamsterFRLimb {
              from, 25%, 50%, 75%, to { transform: rotate(50deg); }
              12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(-30deg); }
            }
            @keyframes hamsterFLLimb {
              from, 25%, 50%, 75%, to { transform: rotate(-30deg); }
              12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(50deg); }
            }
            @keyframes hamsterBRLimb {
              from, 25%, 50%, 75%, to { transform: rotate(-60deg); }
              12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(20deg); }
            }
            @keyframes hamsterBLLimb {
              from, 25%, 50%, 75%, to { transform: rotate(20deg); }
              12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(-60deg); }
            }
            @keyframes hamsterTail {
              from, 25%, 50%, 75%, to { transform: rotate(30deg); }
              12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(10deg); }
            }
            @keyframes spoke {
              from { transform: rotate(0); }
              to { transform: rotate(-1turn); }
            }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', spinnerCSS);
    }

    // Intentar encontrar y seguir el enlace automáticamente
    function findAndFollowLink() {
        console.log('BypassH1: Buscando enlace de destino...');

        // Buscar enlaces comunes
        const linkSelectors = [
            'a[href*="lootdest"]',
            'a[href*="loot-link"]',
            'a[href*="lootlink"]',
            'a[href*="linksloot"]'
        ];

        for (let selector of linkSelectors) {
            const links = document.querySelectorAll(selector);
            if (links.length > 0) {
                const href = links[0].href;
                console.log('BypassH1: Redirigiendo a:', href);
                window.location.href = href;
                return;
            }
        }

        // Si no encuentra enlaces, intentar decodificar de los parámetros URL
        const urlParams = new URLSearchParams(window.location.search);
        const dataParam = urlParams.get('data');
        if (dataParam) {
            try {
                const decoded = decodeURI(dataParam);
                if (decoded && decoded.includes('http')) {
                    console.log('BypassH1: Redirigiendo a URL decodificada');
                    window.location.href = decoded;
                    return;
                }
            } catch (error) {
                console.error('BypassH1: Error decodificando URL:', error);
            }
        }

        console.log('BypassH1: No se pudo encontrar enlace de destino');
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            countdownElement.innerHTML = '<span style="color:red;">Error: No se encontró enlace</span>';
        }
    }

    // Buscar elemento con texto UNLOCK CONTENT
    function searchForUnlockContent(modifyParentElement) {
        const elements = document.querySelectorAll('body *');
        for (let element of elements) {
            if (element.textContent && element.textContent.includes("UNLOCK CONTENT")) {
                console.log('BypassH1: Elemento UNLOCK CONTENT encontrado');
                modifyParentElement(element);
                return true;
            }
        }
        return false;
    }

    // Buscar botones o enlaces de desbloqueo alternativos
    function searchForAlternativeElements(modifyParentElement) {
        const alternatives = [
            'button:contains("Unlock")',
            'a:contains("Unlock")',
            'button:contains("Get Link")',
            'a:contains("Get Link")',
            'button:contains("Continue")',
            'a:contains("Continue")'
        ];

        for (let selector of alternatives) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                console.log('BypassH1: Elemento alternativo encontrado:', selector);
                modifyParentElement(elements[0]);
                return true;
            }
        }
        return false;
    }

    // Función principal mejorada para modificar la página
    function waitForElementAndModifyParent() {
        console.log('BypassH1: Buscando elementos de bloqueo...');

        const modifyParentElement = function(targetElement) {
            const parentElement = targetElement.parentElement;

            if (parentElement) {
                console.log('BypassH1: Elemento UNLOCK CONTENT encontrado, aplicando bypass...');

                // Determinar tiempo de espera basado en imágenes
                const images = document.querySelectorAll('img');
                let countdownSeconds = 5; // Reducido significativamente

                for (let img of images) {
                    const src = img.src.toLowerCase();
                    if (src.includes('eye.png')) {
                        countdownSeconds = 3;
                        break;
                    } else if (src.includes('bell.png')) {
                        countdownSeconds = 5;
                        break;
                    } else if (src.includes('apps.png') || src.includes('fire.png')) {
                        countdownSeconds = 5;
                        break;
                    } else if (src.includes('gamers.png')) {
                        countdownSeconds = 5;
                        break;
                    }
                }

                // Limpiar el elemento padre
                parentElement.innerHTML = '';

                // Crear overlay de espera mejorado
                const popupHTML = `
<div id="tm-overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; z-index:999999; display:flex; justify-content:center; align-items:center; overflow:hidden; background:rgba(0,0,0,0.8);">
    <div style="position:relative; z-index:1; text-align:center; color:white;">
        <center>
            <div id="tm-popup" style="padding:40px; background:rgba(255,255,255,0.9); border-radius:10px; box-shadow:0 4px 20px rgba(0,0,0,0.5); color:black;">
                <h3 style="margin-bottom:20px;">BypassH1 Bypass Activado</h3>
                <div id="countdown" style="margin-bottom:20px; font-size:18px; font-weight:bold;">
                    Redirigiendo en <span id="countdown-number">${countdownSeconds}</span> segundos...
                </div>
                <div style="margin:20px 0;">
                    <div class="wheel-and-hamster" style="width: 80px; height: 80px; margin: 0 auto;">
                        <div class="wheel"></div>
                        <div class="hamster">
                            <div class="hamster__body">
                                <div class="hamster__head">
                                    <div class="hamster__ear"></div>
                                    <div class="hamster__eye"></div>
                                    <div class="hamster__nose"></div>
                                </div>
                                <div class="hamster__limb hamster__limb--fr"></div>
                                <div class="hamster__limb hamster__limb--fl"></div>
                                <div class="hamster__limb hamster__limb--br"></div>
                                <div class="hamster__limb hamster__limb--bl"></div>
                                <div class="hamster__tail"></div>
                            </div>
                        </div>
                        <div class="spoke"></div>
                    </div>
                </div>
                <div style="margin-top:20px;">
                    <button style="padding:10px 20px; background:#4CAF50; color:white; border:none; border-radius:5px; cursor:pointer; font-size:16px; margin:5px;">
                        BypassH1
                    </button>
                </div>
            </div>
        </center>
    </div>
</div>
                `;

                parentElement.insertAdjacentHTML('afterbegin', popupHTML);

                // Iniciar countdown mejorado
                let remaining = countdownSeconds;
                const countdownElement = document.getElementById('countdown-number');
                const countdownTimer = setInterval(() => {
                    remaining--;
                    if (countdownElement) {
                        countdownElement.textContent = remaining;
                    }

                    if (remaining <= 0) {
                        clearInterval(countdownTimer);
                        // Intentar encontrar y seguir el enlace automáticamente
                        findAndFollowLink();
                    }
                }, 1000);

                // Añadir CSS del spinner
                addSpinnerCSS();
            }
        };

        // Estrategia de búsqueda mejorada
        if (!searchForUnlockContent(modifyParentElement)) {
            console.log('BypassH1: Buscando elementos alternativos...');
            if (!searchForAlternativeElements(modifyParentElement)) {
                // Si no encuentra elementos específicos, usar observer
                const observer = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            if (searchForUnlockContent(modifyParentElement) || searchForAlternativeElements(modifyParentElement)) {
                                observer.disconnect();
                                break;
                            }
                        }
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                // Timeout como fallback
                setTimeout(() => {
                    observer.disconnect();
                    console.log('BypassH1: Timeout del observer');
                }, 5000);
            }
        }
    }

    // INICIALIZACIÓN PRINCIPAL
    if (['loot-link.com', 'loot-links.com', 'lootlink.org', 'lootlinks.co',
         'lootdest.info', 'lootdest.org', 'lootdest.com',
         'links-loot.com', 'linksloot.net'].includes(hostname)) {
        console.log('BypassH1: Sitio loot detectado, iniciando bypass...');
        cleanLocalStorage();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', waitForElementAndModifyParent);
        } else {
            waitForElementAndModifyParent();
        }
    }
})();