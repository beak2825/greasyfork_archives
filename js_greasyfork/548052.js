// ==UserScript==
// @name         Eliminar elementos con ID ek-overlay y ek-modal en Canvas UC
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Elimina elementos con ID ek-overlay y ek-modal en https://cursos.canvas.uc.cl/
// @author       Tú
// @match        https://cursos.canvas.uc.cl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=canvas.uc.cl
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548052/Eliminar%20elementos%20con%20ID%20ek-overlay%20y%20ek-modal%20en%20Canvas%20UC.user.js
// @updateURL https://update.greasyfork.org/scripts/548052/Eliminar%20elementos%20con%20ID%20ek-overlay%20y%20ek-modal%20en%20Canvas%20UC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElementsById() {
        const overlay = document.getElementById('ek-overlay');
        const modal = document.getElementById('ek-modal');

        if (overlay) {
            overlay.remove();
            console.log('Elemento con ID ek-overlay eliminado');
        }

        if (modal) {
            modal.remove();
            console.log('Elemento con ID ek-modal eliminado');
        }
    }

    // Ejecutar al cargar
    window.addEventListener('load', () => {
        removeElementsById();

        // Observar si aparecen dinámicamente
        const observer = new MutationObserver(() => {
            removeElementsById();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();
