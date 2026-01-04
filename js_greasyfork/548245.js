// ==UserScript==
// @name         Remove StartPage's sponsored results
// @namespace    http://tampermonkey.net/
// @version      2025-09-03
// @description  Remove top and bottom sponsored results from StartPage searches
// @author       pdcmoreira
// @match        https://www.startpage.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=startpage.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548245/Remove%20StartPage%27s%20sponsored%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/548245/Remove%20StartPage%27s%20sponsored%20results.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(id) {
        return new Promise(resolve => {
            const element = document.getElementById(id)

            if (element) {
                return resolve(element);
            }

            const observer = new MutationObserver(mutations => {
                const element = document.getElementById(id)

                if (element) {
                    observer.disconnect();

                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    ['gcsa-top', 'gcsa-bottom'].forEach((id) => {
        waitForElement(id).then((el) => {
            el.remove();
        });
    })
})();