// ==UserScript==
// @name         Google Reddit Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a Reddit button to Google search to restrict your searches to results from reddit
// @match        https://www.google.com/search*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549557/Google%20Reddit%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/549557/Google%20Reddit%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    callback(el);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    waitForElement('#hdtb-tls', (toolsBtn) => {
        const toolbar = toolsBtn.parentNode;

        // Create the new button
        const redditBtn = document.createElement('a');
        redditBtn.textContent = "Reddit";
        redditBtn.style.cursor = "pointer";
        redditBtn.style.marginLeft = "12px";
        redditBtn.style.fontWeight = "500";
        redditBtn.style.color = "#80868b";

        redditBtn.onclick = () => {
            const params = new URLSearchParams(window.location.search);
            const q = params.get("q") || "";
            if (!q.includes("site:www.reddit.com")) {
                params.set("q", q + " site:www.reddit.com");
            }
            window.location.search = params.toString();
        };

        toolbar.appendChild(redditBtn);
        console.log("Reddit button added");
    });
})();
