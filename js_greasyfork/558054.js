// ==UserScript==
// @name         RedGifs Iframe to MP4
// @author       s0dfix
// @description  Detects the HD video URL and redirects the user directly to the file. Based on Invertex's "RedGifs AutoHD".
// @version      1.0
// @license GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @match        https://www.redgifs.com/ifr/*
// @connect      redgifs.com
// @grant        unsafeWindow
// @run-at       document-start
// @namespace https://greasyfork.org/users/1545033
// @downloadURL https://update.greasyfork.org/scripts/558054/RedGifs%20Iframe%20to%20MP4.user.js
// @updateURL https://update.greasyfork.org/scripts/558054/RedGifs%20Iframe%20to%20MP4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const thumbsSubDomain = 'thumbs.';
    const hdSubDomain = 'giant.';
    const mobileAffix = '-mobile.';

    // Helper to perform the redirect
    function redirectTo(url) {
        if (url && typeof url === 'string' && url !== window.location.href) {
            // Prevent redirect loops if we are already on the target URL
            window.location.replace(url);
        }
    }

    // --- 1. Handle Direct URL Replacements (Thumbs/Mobile/CDN) ---
    // This handles cases where you land on a thumbnail image or a mobile version directly.
    let currentUrl = window.location.href;
    if (currentUrl.includes(thumbsSubDomain) || currentUrl.includes(mobileAffix)) {
        let newUrl = currentUrl.replace(thumbsSubDomain, hdSubDomain);
        if (newUrl.includes(mobileAffix)) {
            newUrl = newUrl.replace(mobileAffix, '.');
        }
        redirectTo(newUrl);
        return; // Stop execution if we redirected based on URL patterns
    }

    // --- 2. API Interceptor (Main Site) ---
    // This intercepts the website's internal request for video data.
    // When the site asks "Give me the info for this video", we snatch the HD URL from the answer and redirect.

    // Save the original open function
    const originalOpen = unsafeWindow.XMLHttpRequest.prototype.open;

    // Overwrite the open function
    unsafeWindow.XMLHttpRequest.prototype.open = exportFunction(function(method, url) {
        // We only care about API calls (v1, v2, v3)
        if (url.includes('/v2/') || url.includes('/v3/') || url.includes('/v1/')) {
            this.addEventListener('readystatechange', function(e) {
                // When the request is finished (ReadyState 4)
                if (this.readyState === 4) {
                    try {
                        const content = JSON.parse(e.target.responseText);

                        // Check if the response contains a SINGLE gif (Video Page)
                        // We explicitly ignore 'content.gifs' (plural) so we don't redirect when you are just browsing the homepage feed.
                        if (content && content.gif && content.gif.urls && content.gif.urls.hd) {
                            redirectTo(content.gif.urls.hd);
                        }

                    } catch (err) {
                        // Ignore JSON parsing errors
                    }
                }
            });
        }
        // Run the actual network request
        return originalOpen.apply(this, arguments);
    }, unsafeWindow);

})();