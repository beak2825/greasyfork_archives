// ==UserScript==
// @name         TuringLab Auto Click
// @namespace    https://turinglab-auto.scripts/usuario123
// @version      1.0
// @description  Automatiza el clic en el botón "Run" en TuringLab
// @author       TuNombre
// @match        https://*.turinglab.co/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548082/TuringLab%20Auto%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/548082/TuringLab%20Auto%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', () => {
        const runButton = document.querySelector("button[data-action='run']");
        if (runButton) {
            runButton.click();
        }
    });
})();
