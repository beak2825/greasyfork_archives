// ==UserScript==
// @name         Scroll Position Saver
// @namespace    http://greasyfork.org/
// @version      1.1
// @description  Save scroll position in session cookies (clears on browser exit)
// @author       Bui Quoc Dung
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562011/Scroll%20Position%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/562011/Scroll%20Position%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const storageKey = 'scrollPosition_' + window.location.href;

    const savePosition = function() {
        try {
            const scrollData = {
                horizontalCoordinate: window.scrollX,
                verticalCoordinate: window.scrollY
            };
            sessionStorage.setItem(storageKey, JSON.stringify(scrollData));
        } catch (error) {}
    };

    const restorePosition = function() {
        try {
            const savedScrollPosition = sessionStorage.getItem(storageKey);
            if (savedScrollPosition) {
                const parsedPositionData = JSON.parse(savedScrollPosition);
                const horizontalCoordinate = parsedPositionData.horizontalCoordinate;
                const verticalCoordinate = parsedPositionData.verticalCoordinate;

                window.scrollTo(horizontalCoordinate, verticalCoordinate);

                window.addEventListener('load', function() {
                    window.scrollTo(horizontalCoordinate, verticalCoordinate);
                }, {
                    once: true
                });
            }
        } catch (error) {}
    };

    restorePosition();

    let scrollTimeoutTimer;

    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeoutTimer);
        scrollTimeoutTimer = setTimeout(savePosition, 3000);
    }, {
        passive: true
    });

    window.addEventListener('beforeunload', savePosition);
})();