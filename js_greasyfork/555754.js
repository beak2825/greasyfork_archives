// ==UserScript==
// @name         Audiomack bar remover 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the annoying bar above the player in audiomack
// @author       Grok
// @match        https://audiomack.com/*/*
// @grant        none
// @run-at       document-start
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/555754/Audiomack%20bar%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/555754/Audiomack%20bar%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selector = '.bottom-ad-integrated_Container__ht1uQ';

    // Functie om het element te verwijderen
    function removeAd() {
        const ad = document.querySelector(selector);
        if (ad) {
            ad.remove();
            console.log('Advertentie verwijderd:', selector);
        }
    }

    // Verwijder bij laden
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeAd);
    } else {
        removeAd();
    }

    // Blijf kijken naar dynamisch toegevoegde elementen
    const observer = new MutationObserver((mutations) => {
        let shouldRemove = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) shouldRemove = true;
        });
        if (shouldRemove) removeAd();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Optioneel: forceer elke 500ms (voor extreem trage ads)
    setInterval(removeAd, 500);
})();