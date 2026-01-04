// ==UserScript==
// @name        AdGuard DNS + Anti-Adblock Handler
// @description Blocks ad/tracker domains and handles anti-adblock popups
// @match       *://*/*
// @version 0.0.1.20251028121705
// @namespace https://greasyfork.org/users/1531587
// @downloadURL https://update.greasyfork.org/scripts/553958/AdGuard%20DNS%20%2B%20Anti-Adblock%20Handler.user.js
// @updateURL https://update.greasyfork.org/scripts/553958/AdGuard%20DNS%20%2B%20Anti-Adblock%20Handler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FILTER_URL = "https://adguardteam.github.io/AdGuardSDNSFilter/Filters/filter.txt";
    const CACHE_KEY = "adguard_filter_cache";
    const CACHE_TIME_KEY = "adguard_filter_cache_time";
    const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h
    let blockedDomains = [];

    async function loadFilterList() {
        const lastFetch = parseInt(localStorage.getItem(CACHE_TIME_KEY) || "0", 10);
        const now = Date.now();

        if (now - lastFetch < CACHE_TTL) {
            blockedDomains = JSON.parse(localStorage.getItem(CACHE_KEY) || "[]");
            console.log("[AdGuard] Loaded cached domains:", blockedDomains.length);
            return;
        }

        try {
            const res = await fetch(FILTER_URL);
            const text = await res.text();
            blockedDomains = text.split("\n")
                .filter(line => line.startsWith("||"))
                .map(line => line.replace("||", "").replace("^", "").trim());
            localStorage.setItem(CACHE_KEY, JSON.stringify(blockedDomains));
            localStorage.setItem(CACHE_TIME_KEY, now.toString());
            console.log("[AdGuard] Updated filter list:", blockedDomains.length);
        } catch (e) {
            console.warn("[AdGuard] Failed to fetch filter list", e);
            blockedDomains = JSON.parse(localStorage.getItem(CACHE_KEY) || "[]");
        }
    }

    // Block fetch requests
    const origFetch = window.fetch;
    window.fetch = function(input, init) {
        const url = typeof input === "string" ? input : input.url;
        if (blockedDomains.some(domain => url.includes(domain))) {
            console.warn("[AdGuard] Blocked fetch:", url);
            return Promise.reject("Blocked by AdGuard Userscript");
        }
        return origFetch.apply(this, arguments);
    };

    // Block XHR requests
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (blockedDomains.some(domain => url.includes(domain))) {
            console.warn("[AdGuard] Blocked XHR:", url);
            return;
        }
        return origOpen.apply(this, arguments);
    };

    // Remove ad elements dynamically
    const observer = new MutationObserver(() => {
        blockedDomains.forEach(domain => {
            document.querySelectorAll(`img[src*="${domain}"], iframe[src*="${domain}"], script[src*="${domain}"]`)
                .forEach(el => {
                    console.warn("[AdGuard] Removed element:", el.src);
                    el.remove();
                });
        });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Anti-Adblock detection
    function showAntiAdblockModal() {
        if (document.getElementById("adblock-modal")) return;
        const modal = document.createElement("div");
        modal.innerHTML = `
            <div id="adblock-modal" style="
                position: fixed; inset: 0;
                background: rgba(0,0,0,0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;">
                <div style="
                    background: #fff;
                    padding: 20px 30px;
                    border-radius: 8px;
                    max-width: 400px;
                    text-align: center;
                    font-family: Arial, sans-serif;">
                    <h2 style="margin:0 0 10px; color:#e74c3c;">⚠ AdBlock Detected</h2>
                    <p style="margin:0 0 15px; font-size:15px; color:#333;">
                        This site detected you are using an Ad Blocker.<br>
                        Please disable it to continue smoothly.
                    </p>
                    <button id="disable-adblock-btn" style="
                        background:#e74c3c; color:#fff; padding:10px 20px;
                        border:none; border-radius:5px; font-size:14px; cursor:pointer;">
                        I Understand
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById("disable-adblock-btn").addEventListener("click", () => {
            modal.remove();
        });
    }

    function antiAdblockWatcher() {
        const bait = document.createElement("div");
        bait.className = "ad ad-banner ad-unit adblock-detect";
        bait.style.position = "absolute";
        bait.style.left = "-9999px";
        document.body.appendChild(bait);

        setTimeout(() => {
            if (bait.offsetParent === null || bait.offsetHeight === 0 || bait.offsetWidth === 0) {
                showAntiAdblockModal();
            }
            bait.remove();
        }, 1500);
    }

    window.addEventListener("load", async () => {
        await loadFilterList();
        antiAdblockWatcher();
    });
})();