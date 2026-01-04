// ==UserScript==
// @name         Estilo para dropdown en dashboard de la UAN
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ajusta z-index de cards con dropdown visible en la plataforma UAN
// @author       HectorUwO
// @match        https://virtual.uan.edu.mx/plataforma/my/courses.php*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/552008/Estilo%20para%20dropdown%20en%20dashboard%20de%20la%20UAN.user.js
// @updateURL https://update.greasyfork.org/scripts/552008/Estilo%20para%20dropdown%20en%20dashboard%20de%20la%20UAN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Crear un elemento <style>
    const style = document.createElement('style');
    style.textContent = `
        .card.dashboard-card:has(.dropdown.show) {
            position: relative;
            z-index: 999;
        }
    `;

    // Inyectar el estilo en el <head>
    document.head.appendChild(style);
})();
