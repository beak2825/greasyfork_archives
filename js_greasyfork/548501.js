// ==UserScript==
// @name         Force Replace main.css with mainblue.css
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces all references to /css/main.css with /css/mainblue.css
// @match        *://*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548501/Force%20Replace%20maincss%20with%20mainbluecss.user.js
// @updateURL https://update.greasyfork.org/scripts/548501/Force%20Replace%20maincss%20with%20mainbluecss.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Intercept all requests for /css/main.css
    const observer = new MutationObserver(() => {
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            if (link.href.includes("/css/main.css")) {
                link.href = link.href.replace("/css/main.css", "/css/mainblue.css");
            }
        });
    });

    // Watch DOM changes
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Also handle fetch() and XHR requests
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes("/css/main.css")) {
            url = url.replace("/css/main.css", "/css/mainblue.css");
        }
        return origOpen.apply(this, arguments);
    };

    // For fetch API
    const origFetch = window.fetch;
    window.fetch = function(input, init) {
        if (typeof input === "string" && input.includes("/css/main.css")) {
            input = input.replace("/css/main.css", "/css/mainblue.css");
        } else if (input.url && input.url.includes("/css/main.css")) {
            input = new Request(input.url.replace("/css/main.css", "/css/mainblue.css"), input);
        }
        return origFetch(input, init);
    };
})();