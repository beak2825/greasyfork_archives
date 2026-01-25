// ==UserScript==
// @name         Twitch Auto Theater
// @name:ja      Twitch 自動シアターモード
// @namespace    https://greasyfork.org/users/1564283
// @version      1.2.0
// @description  Automatically enables Theater Mode on Twitch.
// @description:ja  Twitchで自動的にシアターモードを有効化します。
// @author       homma
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563973/Twitch%20Auto%20Theater.user.js
// @updateURL https://update.greasyfork.org/scripts/563973/Twitch%20Auto%20Theater.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEBUG = false;

    // SVG path signature for theater mode button detection
    const ENTER_THEATER_PATH = 'M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5Zm14 0h4v14h-4V5Zm-2 0H4v14h10V5Z';

    let checkInterval = null;
    let navigationTimeout = null;
    let isPageVisible = !document.hidden;

    /**
     * Check if current page is a video/stream page.
     * @returns {boolean} True if on a video page
     */
    const isVideoPage = () => {
        const path = location.pathname;
        return /^\/[^\/]+$|^\/videos\/|^\/[^\/]+\/clip\//.test(path) && path !== '/';
    };

    /**
     * Find button by SVG path d attribute.
     * @param {string} pathString - SVG path d attribute value
     * @returns {HTMLElement|null} Button element or null
     */
    const findButtonByPath = (pathString) => {
        const path = document.querySelector(`path[d="${pathString}"]`);
        return path ? path.closest('button') : null;
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
        const MAX_TRIES = 50; // Approximately 10 seconds

        checkInterval = setInterval(() => {
            tries++;

            const enterButton = findButtonByPath(ENTER_THEATER_PATH);

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

            if (tries >= MAX_TRIES) {
                DEBUG && console.log('Twitch Auto Theater: Gave up or already active');
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
