// ==UserScript==
// @name         Auto-select "Don't Notify Topic Creator" - GaiaOnline
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically selects "Don't notify topic creator" radio option on GaiaOnline mod pages
// @author       You
// @match        https://www.gaiaonline.com/forum/mod/move/*
// @match        https://www.gaiaonline.com/forum/delete/post/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548391/Auto-select%20%22Don%27t%20Notify%20Topic%20Creator%22%20-%20GaiaOnline.user.js
// @updateURL https://update.greasyfork.org/scripts/548391/Auto-select%20%22Don%27t%20Notify%20Topic%20Creator%22%20-%20GaiaOnline.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check and select the radio input
    function selectNoPMOption() {
        const radio = document.querySelector('input[type="radio"][id="mod-nopm"][name="mod_pm"][value="0"]');
        if (radio && !radio.checked) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('✅ "Don\'t notify topic creator" selected.');
            return true;
        }
        return false;
    }

    // Run immediately if the element is already available
    if (selectNoPMOption()) return;

    // Use MutationObserver to detect when the input gets added
    const observer = new MutationObserver(() => {
        if (selectNoPMOption()) {
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
