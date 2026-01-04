// ==UserScript==
// @name         Enter Key Open First Car Edit Instead of View
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Pressing Enter redirects to the edit page of the first car instead of view page
// @author       OpenAI
// @match        https://salsabeelcars.site/index.php/admin*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548223/Enter%20Key%20Open%20First%20Car%20Edit%20Instead%20of%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/548223/Enter%20Key%20Open%20First%20Car%20Edit%20Instead%20of%20View.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();

            const button = document.querySelector("#carList > tbody > tr > td.text-center > a:nth-child(1)");
            if (button) {
                // Take its href and replace "car_view" with "car_edit"
                const editUrl = button.href.replace("car_view", "car_edit");
                window.location.href = editUrl;
            } else {
                console.warn('No matching button found.');
            }
        }
    });
})();
