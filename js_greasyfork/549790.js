// ==UserScript==
// @name         Vie Faucet Adblock Bypass
// @namespace    https://example.com/mr-tom-scripts
// @version      1.2
// @description  Bypass adblock detection on viefaucet.com
// @author       Mr. Tom
// @match        https://viefaucet.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549790/Vie%20Faucet%20Adblock%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/549790/Vie%20Faucet%20Adblock%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    Object.defineProperty(window, "adblockDetected", { value: false, writable: false });
    Object.defineProperty(window, "isUsingUBlock", { value: false, writable: false });
    Object.defineProperty(window, "hideBannerCount", { value: 0, writable: false });

    const style = document.createElement("style");
    style.innerHTML = `
        .ads { display: block !important; opacity: 1 !important; position: relative !important; }
        .ads .ifr { width: 100% !important; height: 100% !important; }
        .notyf__toast--error, .notyf__toast--warning { display: none !important; }
    `;
    document.head.appendChild(style);

    const showAds = () => {
        document.querySelectorAll(".ads").forEach(ad => {
            ad.style.display = "block";
            ad.style.opacity = "1";
            ad.style.position = "relative";
            const iframe = ad.querySelector(".ifr");
            if (iframe) {
                iframe.style.width = "100%";
                iframe.style.height = "100%";
                iframe.dispatchEvent(new Event("load"));
            }
        });
    };

    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (typeof url === "string" && (url.includes("bitcotasks.com") || url.includes("a-ads.com"))) {
            return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) });
        } else if (typeof url === "string" && url.includes("/api/faucet")) {
            console.log("Faucet claim request:", url, options);
            return originalFetch.apply(this, arguments);
        } else {
            return originalFetch.apply(this, arguments);
        }
    };

    window.addEventListener("load", () => {
        setTimeout(() => { showAds(); }, 1000);
    });

    if (window.__VUEx__ && typeof window.__VUEx__.commit === "function") {
        const originalCommit = window.__VUEx__.commit;
        window.__VUEx__.commit = function(type, payload) {
            if (type === "setAdblock" || type === "setIsUsingUBlock") return;
            return originalCommit.apply(this, arguments);
        };
    }
})();
