// ==UserScript==
// @name         Twitch Auto Theater
// @namespace    https://greasyfork.org/users/1564283
// @version      1.0.0
// @description  Automatically enables Theater Mode on Twitch.
// @author       YourName
// @match        twitch.tv/*
// @match        *.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563973/Twitch%20Auto%20Theater.user.js
// @updateURL https://update.greasyfork.org/scripts/563973/Twitch%20Auto%20Theater.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEBUG = false;

    const enterSelector =
        '[aria-label*="Theatre Mode"]:not([aria-label*="Exit"]), ' +
        '[aria-label*="シアターモード"]:not([aria-label*="終了"])';

    const exitSelector =
        '[aria-label*="Exit"][aria-label*="Theatre Mode"], ' +
        '[aria-label*="シアターモード"][aria-label*="終了"]';

    let checkInterval = null;
    let navigationTimeout = null;
    let isPageVisible = !document.hidden;

    /**
     * Check if current page is a video/stream page.
     */
    const isVideoPage = () => {
        const path = location.pathname;
        return /^\/[^\/]+$|^\/videos\/|^\/[^\/]+\/clip\//.test(path) && path !== '/';
    };

    /**
     * Try to enable Theater Mode.
     */
    const startAutoTheater = () => {
        if (!isPageVisible || !isVideoPage()) {
            DEBUG && console.log('Twitch Auto Theater: Skipped (not video page or hidden)');
            return;
        }

        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
        }

        let tries = 0;
        const MAX_TRIES = 50; // 10sec

        checkInterval = setInterval(() => {
            tries++;

            const enterButton = document.querySelector(enterSelector);
            const exitButton = document.querySelector(exitSelector);

            if (enterButton) {
                try {
                    enterButton.click();
                    DEBUG && console.log('Twitch Auto Theater: Activated');
                } catch (error) {
                    DEBUG && console.error('Twitch Auto Theater: Click failed', error);
                }
                clearInterval(checkInterval);
                checkInterval = null;
                return;
            }

            if (exitButton) {
                DEBUG && console.log('Twitch Auto Theater: Already active');
                clearInterval(checkInterval);
                checkInterval = null;
                return;
            }

            if (tries >= MAX_TRIES) {
                DEBUG && console.log('Twitch Auto Theater: Gave up');
                clearInterval(checkInterval);
                checkInterval = null;
            }
        }, 200);
    };

    /**
     * Debounced start to avoid excessive calls.
     */
    const debouncedStart = () => {
        if (navigationTimeout) clearTimeout(navigationTimeout);
        navigationTimeout = setTimeout(() => {
            startAutoTheater();
        }, 100);
    };

    /**
     * Setup efficient SPA navigation detection via History API interception.
     */
    const setupNavigationDetection = () => {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function () {
            const result = originalPushState.apply(this, arguments);
            DEBUG && console.log('Twitch Auto Theater: pushState navigation detected');
            debouncedStart();
            return result;
        };

        history.replaceState = function () {
            const result = originalReplaceState.apply(this, arguments);
            DEBUG && console.log('Twitch Auto Theater: replaceState navigation detected');
            debouncedStart();
            return result;
        };

        window.addEventListener('popstate', () => {
            DEBUG && console.log('Twitch Auto Theater: popstate navigation detected');
            debouncedStart();
        });
    };

    /**
     * Handle page visibility changes.
     */
    document.addEventListener('visibilitychange', () => {
        isPageVisible = !document.hidden;
        DEBUG && console.log('Twitch Auto Theater: Visibility changed', isPageVisible);

        if (isPageVisible && isVideoPage()) {
            debouncedStart();
        }
    });

    /**
     * Cleanup on page unload to prevent memory leaks.
     */
    window.addEventListener('beforeunload', () => {
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
        }
        if (navigationTimeout) {
            clearTimeout(navigationTimeout);
            navigationTimeout = null;
        }
    });

    // Setup navigation detection
    setupNavigationDetection();

    // Initial run with slight delay
    setTimeout(() => {
        debouncedStart();
    }, 100);
})();
