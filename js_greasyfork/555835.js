// ==UserScript==
// @name         Eliminar último div antes del cierre de html en jkanime
// @namespace    https://jkanime.net
// @version      1.0
// @description  Borra el último div justo antes de cerrar el html en jkanime sin importar clase
// @author       Anónimo
// @match        https://jkanime.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555835/Eliminar%20%C3%BAltimo%20div%20antes%20del%20cierre%20de%20html%20en%20jkanime.user.js
// @updateURL https://update.greasyfork.org/scripts/555835/Eliminar%20%C3%BAltimo%20div%20antes%20del%20cierre%20de%20html%20en%20jkanime.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeLastDivBeforeHtmlClose() {
        const html = document.documentElement;
        if (!html) return;

        // Obtener todos los hijos directos div del <html>
        const divs = Array.from(html.children).filter(node => node.tagName.toLowerCase() === 'div');

        if(divs.length > 0) {
            divs[divs.length -1].remove();
        }
    }

    // Ejecutar al cargar con retraso para cuando el DOM esté listo
    setTimeout(removeLastDivBeforeHtmlClose, 500);

    // Observar cambios en el html para eliminar si vuelve a aparecer
    const observer = new MutationObserver(mutations => {
        removeLastDivBeforeHtmlClose();
    });

    observer.observe(document.documentElement, { childList: true });

    // Polling de respaldo cada 2 segundos
    setInterval(removeLastDivBeforeHtmlClose, 2000);

})();