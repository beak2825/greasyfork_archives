// ==UserScript==
// @name         Redirect X.com and Twitter to Nitter
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Redirect Twitter/X (including t.co) URLs to a Nitter instance
// @author       Pete Johns (@johnsyweb)
// @match        *://x.com/*
// @match        *://www.x.com/*
// @match        *://mobile.x.com/*
// @match        *://twitter.com/*
// @match        *://www.twitter.com/*
// @match        *://mobile.twitter.com/*
// @match        *://t.co/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @icon         https://nitter.net/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/564322/Redirect%20Xcom%20and%20Twitter%20to%20Nitter.user.js
// @updateURL https://update.greasyfork.org/scripts/564322/Redirect%20Xcom%20and%20Twitter%20to%20Nitter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const nitterInstance = 'https://nitter.net';

    const redirectToNitter = () => {
        const url = window.location.href;
        const twitterRegex = /^https?:\/\/(?:www\.|mobile\.)?(x\.com|twitter\.com)/;
        if (twitterRegex.test(url)) {
            const nitterUrl = url.replace(twitterRegex, nitterInstance);
            window.location.replace(nitterUrl);
        }
    };

    const handleTcoRedirect = () => {
        // Wait for the browser to resolve the t.co shortlink
        const observer = new MutationObserver(() => {
            const finalUrl = window.location.href;
            const isTwitter = finalUrl.includes('x.com') || finalUrl.includes('twitter.com');
            if (isTwitter) {
                const nitterUrl = finalUrl.replace(/^https?:\/\/(?:www\.|mobile\.)?(x\.com|twitter\.com)/, nitterInstance);
                window.location.replace(nitterUrl);
            }
        });

        observer.observe(document, { subtree: true, childList: true });
    };

    const hostname = window.location.hostname;

    if (hostname.includes('x.com') || hostname.includes('twitter.com')) {
        redirectToNitter();
    } else if (hostname === 't.co') {
        handleTcoRedirect();
    }
})();
