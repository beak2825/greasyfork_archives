// ==UserScript==
// @name         Site Cleaner
// @namespace    softforum
// @version      1.6
// @description  Remove ad blocks on page
// @match        *://*.51.ca/*
// @match        *://*.redflagdeals.com/*
// @match        *://*.wenxuecity.com/*
// @match        *://*.iphoneincanada.ca/*
// @grant        GM.addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551465/Site%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/551465/Site%20Cleaner.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const host = location.hostname;

    // Helper to remove elements by selector
    function removeElems(selectors, root = document) {
        selectors.forEach(sel => {
            try {
                root.querySelectorAll(sel).forEach(el => el.remove());
            } catch (e) {
                // Ignore selectors not supported (e.g. :has in some browsers)
            }
        });
    }

    // Helper to disable YouTube autoplay
    function fixIframeSrc(iframe) {
        if (!iframe.src.includes("youtube.com/embed/")) return false;

        const url = new URL(iframe.src, window.location.href);

        // Remove autoplay
        if (url.searchParams.has("autoplay")) {
            url.searchParams.delete("autoplay");
        }

        // Force mute
        url.searchParams.set("mute", "1");

        // Only update src if changed
        if (iframe.src !== url.toString()) {
            iframe.src = url.toString();
        }

        return true;
    }

    function scanAndFix(root = document) {
        root.querySelectorAll('iframe[src*="youtube.com/embed/"]').forEach(fixIframeSrc);
    }
    
    // --- 51.ca ---
    if (host.includes("51.ca")) {
        const selectors = [
            "div.slide-banner",
            "div.swiper",
            "div.top-a-container",
            "div.wg51__merchant-moments",
            "div[class$='-ads']",
            "li.merchant-moment",
            "li.stream-mixed-large",
            "li[class*='article-']"
        ];

        // Initial cleanup
        removeElems(selectors);
        scanAndFix();

        // Wait for body to exist
        function waitForBody(callback) {
            if (document.body) return callback();
            new MutationObserver((mutations, obs) => {
                if (document.body) {
                    obs.disconnect();
                    callback();
                }
            }).observe(document.documentElement, { childList: true });
        }
        
        waitForBody(() => {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(m => {
                    m.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            removeElems(selectors, node);
                            scanAndFix(node);
                            if (selectors.some(sel => node.matches(sel))) node.remove();
                        }
                    });
                });
            });
        
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // --- redflagdeals.com ---
    else if (host.includes("redflagdeals.com")) {
        removeElems([
            "*[id*='_deal']",
            "li.ad_box"
        ]);
    }

    // --- wenxuecity.com ---
    else if (host.includes("wenxuecity.com")) {
        removeElems([
            "div.banner:has(> div#gg_topbanner)",
            "div.block div.title0",
            "div.classified_left",
            "div.classified_right",
            "div.content:has(a[href^='/radio/'])",
            "div.contop",
            "div.wrapper:has(> .logo)",
            "div[style*='height: 380px;']",
            "img[width='1px']",
            "p:has(iframe[src*='/radio/'])"
        ]);

        GM.addStyle(`
            body, div.content, div#content {
                font-family: "PingFang SC","Noto Sans SC","Microsoft Yahei" !important;
            }
        `);
    }
    
    else if (host.includes("iphoneincanada.ca")) {
        removeElems([
            "div.adthrive"
        ]);
    }
})();
