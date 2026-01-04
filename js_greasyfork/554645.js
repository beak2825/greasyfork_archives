// ==UserScript==
// @name         Finbandy URL &&
// @namespace    https://finbandy.torneopal.fi/
// @version      1.0
// @description  Přidá "&&" na konec URL na stránce s detailem zápasu
// @author       JV
// @license      MIT
// @match        https://finbandy.torneopal.fi/taso/ottelu.php*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554645/Finbandy%20URL%20.user.js
// @updateURL https://update.greasyfork.org/scripts/554645/Finbandy%20URL%20.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = window.location.href;
    if (!url.endsWith('&&')) {
        // Přesměruj na URL s &&
        window.location.replace(url + '&&');
    }
})();