// ==UserScript==
// @name         Scroll Position Saver
// @namespace    http://greasyfork.org/
// @version      1.0
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

    function getStorageKey() {
        return 'scrollPos_' + window.location.href;
    }

    function saveScrollPosition() {
        const scrollData = {
            x: window.scrollX || window.pageXOffset,
            y: window.scrollY || window.pageYOffset,
            timestamp: Date.now()
        };

        try {
            sessionStorage.setItem(getStorageKey(), JSON.stringify(scrollData));
        } catch (e) {}
    }

    function restoreScrollPosition() {
        try {
            const savedData = sessionStorage.getItem(getStorageKey());

            if (savedData) {
                const scrollData = JSON.parse(savedData);
                window.scrollTo(scrollData.x, scrollData.y);

                window.addEventListener('load', function() {
                    window.scrollTo(scrollData.x, scrollData.y);
                }, { once: true });
            }
        } catch (e) {}
    }

    function cleanOldEntries() {
        const oneHour = 60 * 60 * 1000;
        const now = Date.now();

        try {
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);

                if (key && key.startsWith('scrollPos_')) {
                    const data = JSON.parse(sessionStorage.getItem(key));

                    if (data.timestamp && (now - data.timestamp) > oneHour) {
                        sessionStorage.removeItem(key);
                    }
                }
            }
        } catch (e) {}
    }

    restoreScrollPosition();

    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(saveScrollPosition, 150);
    }, { passive: true });

    window.addEventListener('beforeunload', function() {
        saveScrollPosition();
    });

    window.addEventListener('load', function() {
        cleanOldEntries();
    }, { once: true });
})();