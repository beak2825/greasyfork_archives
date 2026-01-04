// ==UserScript==
// @name        Mantener visibilidad activa
// @namespace   yourNamespace
// @version     1.0
// @description Este script mantiene la visibilidad de la página activa siempre
// @author      Your Name
// @match       http://*/*
// @match       https://*/*
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550296/Mantener%20visibilidad%20activa.user.js
// @updateURL https://update.greasyfork.org/scripts/550296/Mantener%20visibilidad%20activa.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Sobreescribir las propiedades de la API de visibilidad de la página
    Object.defineProperties(document, {
        'hidden': { value: false, configurable: true },
        'visibilityState': { value: 'visible', configurable: true }
    });

    // Detectar cambios en la visibilidad y prevenir su propagación
    window.addEventListener('visibilitychange', function(event) {
        event.stopImmediatePropagation();
        Object.defineProperties(document, {
            'hidden': { value: false, configurable: true },
            'visibilityState': { value: 'visible', configurable: true }
        });
    }, true);
})();
