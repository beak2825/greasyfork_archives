// ==UserScript==
// @name         PnW: Hide Description and Map.
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hides the nation description and map on Politics and war nation page.
// @author       Drago
// @match        https://politicsandwar.com/nation/id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551715/PnW%3A%20Hide%20Description%20and%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/551715/PnW%3A%20Hide%20Description%20and%20Map.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const descriptionElement = document.querySelector('.ck-content');
    if (descriptionElement) {
        descriptionElement.style.display = 'none';
    }

    const mapElement = document.querySelector('#nation-map');
    if (mapElement) {
        const mapRow = mapElement.closest('tr');
        if (mapRow) {
            const headerRow = mapRow.previousElementSibling;
            mapRow.style.display = 'none';
            if (headerRow) {
                headerRow.style.display = 'none';
            }
        }
    }
})();