// ==UserScript==
// @name         Sankaku Subscription Banner Remove
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto-close popup only on /posts/<id> pages
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankakucomplex.com
// @match        https://www.sankakucomplex.com/*
// @match        https://sankaku.app/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556557/Sankaku%20Subscription%20Banner%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/556557/Sankaku%20Subscription%20Banner%20Remove.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SHORT_RETRY_MS = [120, 360];
    let lastUrl = location.href;
    let observer = null;
    let active = false;

    function isMainPostPage(url = location.href) {
        const u = new URL(url);
        const parts = u.pathname.split('/').filter(Boolean);

        // Must start with "posts"
        if (parts[0] !== "posts") return false;

        // Exclude "/posts/changes"
        if (parts[1] === "changes") return false;

        // Exclude "/posts/<id>/something"
        if (parts.length >= 3) return false;

        // Valid page: /posts/<id>
        return parts.length === 2;
    }

    function closeDialog(dialog) {
        try {
            const btn = dialog.querySelector('button[aria-label="close"]');
            if (btn) { btn.click(); return true; }
            dialog.remove();
            return true;
        } catch {}
        return false;
    }

    function closeAllDialogs() {
        document.querySelectorAll('.MuiDialog-root').forEach(dialog => {
            closeDialog(dialog);
        });
    }

    function startObserver() {
        if (observer) return;

        observer = new MutationObserver(closeAllDialogs);
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    function stopObserver() {
        if (!observer) return;

        observer.disconnect();
        observer = null;
    }

    function enable() {
        if (active) return;
        active = true;

        startObserver();
        closeAllDialogs();

        SHORT_RETRY_MS.forEach(ms =>
            setTimeout(closeAllDialogs, ms)
        );
    }

    function disable() {
        if (!active) return;
        active = false;

        stopObserver();
    }

    function handleUrlChange() {
        const now = location.href;
        if (now === lastUrl) return;
        lastUrl = now;

        if (isMainPostPage(now)) enable();
        else disable();
    }

    const wrap = fn => function(...args) {
        const r = fn.apply(this, args);
        window.dispatchEvent(new Event('locationchange'));
        return r;
    };

    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);

    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'));
    });

    window.addEventListener('locationchange', handleUrlChange);

    if (isMainPostPage()) enable();
})();
