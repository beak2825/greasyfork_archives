// ==UserScript==
// @name         Close popup on renshuu
// @namespace    Bill
// @version      0.12
// @author       Bill
// @description  Close the "Add this term" popup when clicking outside or pressing Esc.
// @license      GNU GPLv3
// @match        https://www.renshuu.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563305/Close%20popup%20on%20renshuu.user.js
// @updateURL https://update.greasyfork.org/scripts/563305/Close%20popup%20on%20renshuu.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let activeTipp = null;

    const observer = new MutationObserver(() => {
        activeTipp = document.querySelector('div.tipp');
    });

    observer.observe(document.body, {
        childList: true,
    });

    function getTipp() {
        return document.querySelector('div.tipp');
    }

    function getTippCloseButton() {
        return activeTipp?.querySelector('i.far.fa-times.lnk');
    }

    function closeTipp() {
        const closeButton = getTippCloseButton();
        if (closeButton) {
            closeButton.click();
        }
    }

    document.addEventListener(
        'mousedown',
        (e) => {
            if (activeTipp && !activeTipp.contains(e.target)) {
                closeTipp();
            }
        },
        true
    );

    document.addEventListener('keydown', (e) => {
        if (activeTipp && e.key === 'Escape') {
            closeTipp();
        }
    });
})();