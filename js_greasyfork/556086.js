// ==UserScript==
// @name           Auto Expand Usage (Gear Browser Compatible)
// @namespace      http://tampermonkey.net/
// @version        2.0
// @description    Auto-expand all "View", "Details", "More", <details>, and aria-expanded items on usage pages.
// @match          *://*.koodomobile.com/*
// @match          *://*.telus.com/*
// @run-at         document-end
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/556086/Auto%20Expand%20Usage%20%28Gear%20Browser%20Compatible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556086/Auto%20Expand%20Usage%20%28Gear%20Browser%20Compatible%29.meta.js
// ==/UserScript==

(function() {

    function clickButtons() {
        const keywords = ["view", "details", "show", "expand", "more", "usage", "see", "open"];
        let count = 0;

        document.querySelectorAll("button, a, div[role='button'], span").forEach(el => {
            const text = (el.innerText || "").toLowerCase().trim();
            if (!text) return;

            for (let k of keywords) {
                if (text.includes(k)) {
                    try {
                        el.click();
                        count++;
                    } catch (e) {}
                    break;
                }
            }
        });

        return count;
    }

    function openDetails() {
        let opened = 0;
        document.querySelectorAll("details").forEach(d => {
            if (!d.open) {
                d.open = true;
                opened++;
            }
        });
        return opened;
    }

    function expandAria() {
        let expanded = 0;
        document.querySelectorAll("[aria-expanded='false']").forEach(el => {
            try {
                el.click();
                expanded++;
            } catch (e) {}
        });
        return expanded;
    }

    function scrollPage() {
        window.scrollBy(0, 9999);
    }

    function expandLoop() {
        let idle = 0;

        const interval = setInterval(() => {
            const a = clickButtons();
            const b = openDetails();
            const c = expandAria();

            scrollPage();

            if (a + b + c === 0) {
                idle++;
            } else {
                idle = 0;
            }

            if (idle >= 5) {
                clearInterval(interval);
            }
        }, 900);
    }

    // Start after slight delay
    setTimeout(expandLoop, 1500);

})();