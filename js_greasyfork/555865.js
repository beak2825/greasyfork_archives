// ==UserScript==
// @name         YouTube Key Navigation
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add fast, customizable keyboard shortcuts to YouTube. Instantly open Home, Watch Later, and History, or perform actions like Like, Dislike, Subscribe, Toggle Notifications, and Voice Search — all without refreshing the page. Fully configurable keybindings for seamless YouTube navigation and control.
// @icon               https://www.google.com/s2/favicons?sz=64&domain=youtube.com

// @author       Anurag Kashyap
// @match        *://www.youtube.com/*
// @match        *://youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555865/YouTube%20Key%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/555865/YouTube%20Key%20Navigation.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**********************************************************
     * 🛠 KEYBIND CONFIG - EDIT THIS PART ONLY
     *
     * Just change the keys in the arrays below.
     * Use lowercase for convenience; script will match both
     * lowercase and uppercase automatically.
     **********************************************************/
    const KEYBINDS = {
        home: ['u'],           // h → go to Home
        watchLater: ['q'],     // . → go to Watch Later
        history: ['h'],        // q → go to History
        notifications: ['z'],  // z → toggle notifications
        voiceSearch: ['x'],    // x → search with your voice
        like: ['b'],           // v → like video
        dislike: ['n'],        // n → dislike video
        subscribe: ['e'],      // b → subscribe to channel
    };
    /**********************************************************/

    // Utility: Check if user is typing in an input/textarea/contenteditable
    function isTypingInInput(e) {
        const target = e.target;
        if (!target) return false;

        const tag = target.tagName;
        const editable = target.isContentEditable;

        return (
            editable ||
            tag === 'INPUT' ||
            tag === 'TEXTAREA' ||
            tag === 'SELECT'
        );
    }

    // Utility: Try multiple selectors until one works
    function clickFirstSelector(selectors) {
        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el) {
                el.click();
                return true;
            }
        }
        return false;
    }

    // NAVIGATION HELPERS
    function goHome() {
        const success = clickFirstSelector([
            'a[title="Home"]',
            'a[aria-label="Home"]',
            'a[endpoint*="FEwhat_to_watch"]',
            'a[href="/"]'
        ]);

        if (!success) console.warn('Home link not found.');
    }

    function goWatchLater() {
        const success = clickFirstSelector([
            'a[title="Watch later"]',
            'a[aria-label^="Watch later"]',
            'a[href*="&list=WL"]',
            'a[href*="playlist?list=WL"]'
        ]);

        if (!success) console.warn('Watch later link not found.');
    }

    function goHistory() {
        const success = clickFirstSelector([
            'a[title="History"]',
            'a[aria-label="History"]',
            'a[href="/feed/history"]'
        ]);

        if (!success) console.warn('History link not found.');
    }

    // ACTION HELPERS
   function toggleNotifications() {
    // Prefer the top-right notifications bell in the masthead
    let btn = document.querySelector('ytd-notification-topbar-button-renderer button');

    // Fallback: search all "Notifications" buttons but keep only the one in the topbar
    if (!btn) {
        const candidates = Array.from(
            document.querySelectorAll('button[aria-label*="Notification"]')
        );

        btn = candidates.find(el =>
            el.closest('ytd-notification-topbar-button-renderer') ||
            el.closest('ytd-masthead')
        );
    }

    if (btn) {
        btn.click();
    } else {
        console.warn('Topbar notification button not found.');
    }
}


    function voiceSearch() {
        const success = clickFirstSelector([
            'button[aria-label="Search with your voice"]',
            'button[aria-label*="voice"]',
            'ytd-microphone-button button'
        ]);

        if (!success) console.warn('Voice search button not found.');
    }

    function likeVideo() {
        const success = clickFirstSelector([
            'ytd-segmented-like-dislike-button-renderer yt-button-shape:nth-of-type(1) button',
            'button[aria-label^="Like this video"]',
            'button[aria-pressed][aria-label^="like this video" i]'
        ]);

        if (!success) console.warn('Like button not found.');
    }

    function dislikeVideo() {
        const success = clickFirstSelector([
            'ytd-segmented-like-dislike-button-renderer yt-button-shape:nth-of-type(2) button',
            'button[aria-label^="Dislike this video"]',
            'button[aria-pressed][aria-label^="dislike this video" i]'
        ]);

        if (!success) console.warn('Dislike button not found.');
    }

    function subscribeChannel() {
        const btn = document.querySelector(
            'ytd-subscribe-button-renderer tp-yt-paper-button,' +
            'ytd-subscribe-button-renderer button,' +
            'button[aria-label^="Subscribe"],' +
            'button[aria-label^="Subscribed"]'
        );

        if (!btn) {
            console.warn('Subscribe button not found.');
            return;
        }

        const pressed = btn.getAttribute('aria-pressed');
        if (pressed === 'true') {
            console.log('Already subscribed (aria-pressed=true). No action taken.');
            return;
        }

        btn.click();
    }

    // Build key → action map from KEYBINDS config
    const keyToAction = {};
    function registerKeys() {
        const actions = {
            home: goHome,
            watchLater: goWatchLater,
            history: goHistory,
            notifications: toggleNotifications,
            voiceSearch: voiceSearch,
            like: likeVideo,
            dislike: dislikeVideo,
            subscribe: subscribeChannel,
        };

        for (const [actionName, keys] of Object.entries(KEYBINDS)) {
            const handler = actions[actionName];
            if (!handler) continue;

            keys.forEach(k => {
                if (!k) return;
                const key = String(k).toLowerCase();
                keyToAction[key] = handler;
            });
        }
    }

    registerKeys();

    // KEY LISTENER
    window.addEventListener('keydown', function (e) {
        if (!/\.youtube\.com$/.test(location.hostname)) return;
        if (e.altKey || e.ctrlKey || e.metaKey) return;
        if (isTypingInInput(e)) return;

        const key = e.key.toLowerCase();
        const action = keyToAction[key];

        if (action) {
            e.preventDefault();
            action();
        }
    });
})();
