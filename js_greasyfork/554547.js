// ==UserScript==
// @name         BCT Defaultor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Set BCT as the default flight method
// @author       Titanic_
// @license      MIT
// @match        https://www.torn.com/page.php?sid=travel*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554547/BCT%20Defaultor.user.js
// @updateURL https://update.greasyfork.org/scripts/554547/BCT%20Defaultor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bctSelector = 'input[name="travelType"][value="business"]';
    let hasCompleted = false;

    function selectBusinessClass() {
        const bctRadio = document.querySelector(bctSelector);

        if (!bctRadio) return false;

        if (!bctRadio.disabled && !bctRadio.checked) {
            bctRadio.click();
            hasCompleted = true;
            return true;
        }

        if (bctRadio.disabled || bctRadio.checked) {
            hasCompleted = true;
            return true;
        }

        if (bctRadio.disabled && !bctRadio.checked) console.error('[BCT] You dont have any BCT');

        return false;
    }

    const observer = new MutationObserver((mutations, obs) => {
        if (selectBusinessClass()) {
            obs.disconnect();
        }
    });

    const root = document.getElementById('travel-root');
    if (root) {
        observer.observe(root, {
            childList: true,
            subtree: true
        });

        selectBusinessClass();
    } else console.error('[BCT] Couldnt find #travel-root');

    setTimeout(() => {
        if (!hasCompleted) {
            observer.disconnect();
            console.log('[BCT] Timed out');
        }
    }, 10000);

})();