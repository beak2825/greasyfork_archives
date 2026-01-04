// ==UserScript==
// @name         Telegram t.me → t.me/s/ Redirector
// @namespace    https://violentmonkey.github.io/
// @version      1.0
// @description  Automatically and Safely redirects from t.me/* to t.me/s/*, prevents infinite reloads
// @author       Streampunk
// @icon         data:image/png;base64,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
// @match        https://t.me/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553668/Telegram%20tme%20%E2%86%92%20tmes%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/553668/Telegram%20tme%20%E2%86%92%20tmes%20Redirector.meta.js
// ==/UserScript==

// Prevent infinite redirect loop using sessionStorage
const REDIRECT_KEY = 'tme_safe_redirect_done';

if (
    location.hostname === 't.me' &&
    !location.pathname.startsWith('/s/') &&
    sessionStorage.getItem(REDIRECT_KEY) !== 'true'
) {
    // Mark that we've done the redirect this session
    sessionStorage.setItem(REDIRECT_KEY, 'true');

    // Build safe URL
    const newUrl = 'https://t.me/s' + location.pathname + location.search + location.hash;

    // Instant redirect without adding to history
    location.replace(newUrl);
}

// Optional: Clear flag on page unload (if needed in future)
// window.addEventListener('beforeunload', () => {
//     sessionStorage.removeItem(REDIRECT_KEY);
// });