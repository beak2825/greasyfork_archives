// ==UserScript==
// @name         Oculta el botón 'Preguntar' de youtube.
// @name:en      Hide the YouTube 'Ask' button.
// @namespace    https://greasyfork.org/es/users/1354104-eterve-nallo
// @version      1.1
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
        const btn = document.querySelector("#top-level-buttons-computed > yt-button-view-model:nth-child(3) > button-view-model > button");
        if (!btn) return;

        //Se Busca el path del ícono
        const pathNode = btn.querySelector("svg path");
        const pathValue = pathNode?.getAttribute("d") || "";

        if (pathValue === knownPath) {
            btn.style.display = "none"; // Ocultar por coincidencia del ícono
            return;
        }

        // Respaldo basado en texto (por si cambia el ícono)
        const textNode = btn.querySelector(".yt-spec-button-shape-next__button-text-content");
        const text = textNode?.innerText?.trim().toLowerCase() || "";
        const possible = ["ask", "preguntar", "pregunta"];

        if (possible.includes(text)) {
            btn.style.display = "none";
        } else {
            btn.style.display = ""; // No tocar si no coincide
        }
    }

    const observer = new MutationObserver(hideAskButton);
    observer.observe(document.body, { childList: true, subtree: true });

    hideAskButton();
})();
