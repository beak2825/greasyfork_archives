// ==UserScript==
// @name         Oculta el botón 'Preguntar' de youtube.
// @name:en      Hide the YouTube 'Ask' button.
// @namespace    https://greasyfork.org/es/users/1354104-eterve-nallo
// @version      2.0
// @description  Oculta el botón de "Preguntame" de la interfaz de youtube.
// @description:en   Hide the "Ask" button from the YouTube interface.
// @author       Dektsuki
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/560273/Oculta%20el%20bot%C3%B3n%20%27Preguntar%27%20de%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/560273/Oculta%20el%20bot%C3%B3n%20%27Preguntar%27%20de%20youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const knownPath = 'M480-80q0-83-31.5-156T363-363q-54-54-127-85.5T80-480q83 0 156-31.5T363-597q54-54 85.5-127T480-880q0 83 31.5 156T597-597q54 54 127 85.5T880-480q-83 0-156 31.5T597-363q-54 54-85.5 127T480-80Z';

    GM_addStyle(`
        #flexible-item-buttons .ytd-menu-renderer,
        #top-level-buttons-computed yt-button-view-model.ytd-menu-renderer,
        ytd-download-button-renderer.style-scope.ytd-menu-renderer,
        ytd-button-renderer#loop-button {
            margin: 0px 5px 0px 0px !important;
        }
        .ytSegmentedLikeDislikeButtonViewModelHost {
            display: block;
            margin-right: 10px !important;
        }
    `);

    function hideAskButton() {
        const btnWrapper = document.querySelector("#top-level-buttons-computed > yt-button-view-model:nth-child(3)");
        if (!btnWrapper) return false;

        // Evitar aplicar el paso final más de una vez en este botón
        if (btnWrapper.dataset.finalStyleApplied === "true") return false;

        const btn = btnWrapper.querySelector("button-view-model > button");
        if (!btn) return false;

        let found = false;

        // Chequeo por icono
        const pathNode = btn.querySelector("svg path");
        const pathValue = pathNode?.getAttribute("d") || "";
        if (pathValue === knownPath) {
            btn.style.display = "none";
            found = true;
        } else {
            // Chequeo por texto como respaldo
            const textNode = btn.querySelector(".yt-spec-button-shape-next__button-text-content");
            const text = textNode?.innerText?.trim().toLowerCase() || "";
            const possible = ["ask", "preguntar", "pregunta"];
            if (possible.includes(text)) {
                btn.style.display = "none";
                found = true;
            } else {
                btn.style.display = "";
                return false;
            }
        }

        // Paso final: solo si encontramos el botón y no se aplicó antes a este botón
        if (found) {
            btnWrapper.setAttribute("style", "margin: 0px !important;");
            btnWrapper.dataset.finalStyleApplied = "true"; // Marcamos que ya se aplicó
        }

        return found;
    }

    function waitForContainerAndObserve() {
        const container = document.querySelector("#above-the-fold");
        if (!container) {
            setTimeout(waitForContainerAndObserve, 300);
            return;
        }

        // Reintentos limitados
        let attempts = 0;
        const maxAttempts = 5;
        const retryInterval = 400;

        const retryTimer = setInterval(() => {
            const success = hideAskButton();
            attempts++;
            if (success || attempts >= maxAttempts) {
                clearInterval(retryTimer);
            }
        }, retryInterval);

        // Observar cambios en el contenedor
        const observer = new MutationObserver(hideAskButton);
        observer.observe(container, { childList: true, subtree: true });
    }

    waitForContainerAndObserve();
})();
