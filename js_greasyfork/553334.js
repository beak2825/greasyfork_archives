// ==UserScript==
// @name         😈 Empire Streaming xyz - Ultimate Redirect Blocker
// @namespace    Balta zar
// @version      1.0
// @description  Block malicious redirect and ad domains, sanitize links, stop forced popups
// @match        *://empire-streami.xyz/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553334/%F0%9F%98%88%20Empire%20Streaming%20xyz%20-%20Ultimate%20Redirect%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/553334/%F0%9F%98%88%20Empire%20Streaming%20xyz%20-%20Ultimate%20Redirect%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BLOCKED_HOSTS = [
        "ak.weewoogloogru.net",
        "agileskincareunrented.com",
        "zrlqm.com",
        "rirki.com",
        "0lin.com",
        "ak.argrowlitheor.com",
        "cdn.nsuky.com",
        "dlrju1yrc85wj.bar",
        "onclickperformance.com",
        "sexytalk.tv"
    ];

    function escapeForRegex(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    const negativePattern = BLOCKED_HOSTS.map(escapeForRegex).join('|');

    function isBlocked(input) {
        if (!input) return false;
        const s = String(input).toLowerCase();
        return BLOCKED_HOSTS.some(host => s.includes(host.toLowerCase()));
    }

    function extractCleanUrl(input) {
        try {
            const decoded = decodeURIComponent(String(input));
            const rx = new RegExp(`https?:\\/\\/(?!.*(?:${negativePattern}))[^\\"'\\s)]+`, 'i');
            const match = decoded.match(rx);
            if (!match) return null;
            const candidate = match[0];
            try {
                const u = new URL(candidate);
                if (BLOCKED_HOSTS.some(h => u.host.toLowerCase().includes(h.toLowerCase()))) return null;
                return u.href;
            } catch {
                return candidate;
            }
        } catch {
            return null;
        }
    }

    // 1) sanitize clicks
    document.addEventListener('click', function(e) {
        const el = e.target.closest('a, button');
        if (!el) return;

        if (el.tagName === "A" && el.href && isBlocked(el.href)) {
            e.preventDefault();
            e.stopImmediatePropagation();
            const cleanUrl = extractCleanUrl(el.href);
            if (cleanUrl) {
                console.info("[Anti-Redirect] Clean redirect →", cleanUrl);
                window.location.assign(cleanUrl);
            } else {
                console.warn("[Anti-Redirect] Blocked malicious redirect:", el.href);
            }
        }

        if (el.tagName === "BUTTON") {
            const onclick = el.getAttribute('onclick');
            if (onclick && isBlocked(onclick)) {
                e.preventDefault();
                e.stopImmediatePropagation();
                el.removeAttribute('onclick');
                console.info("[Anti-Redirect] Removed malicious onclick.");
                const safeLink = extractCleanUrl(onclick);
                if (safeLink) window.location.assign(safeLink);
            }
        }
    }, true);

    // 2) mutation observer to sanitize dynamic DOM
    const observer = new MutationObserver(() => {
        document.querySelectorAll('a[href], button[onclick]').forEach(el => {
            try {
                if (el.href && isBlocked(el.href)) el.href = extractCleanUrl(el.href) || "#";
                const onclick = el.getAttribute('onclick');
                if (onclick && isBlocked(onclick)) el.removeAttribute('onclick');
            } catch {}
        });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // 3) override window.open to block popups
    const nativeOpen = window.open;
    window.open = function(url, ...args) {
        if (typeof url === "string" && isBlocked(url)) {
            console.warn("[Popup Blocker] Blocked:", url);
            return null;
        }
        const popup = nativeOpen.apply(this, [url, ...args]);
        if (popup && (!url || url === "about:blank")) {
            setTimeout(() => { try { popup.close(); } catch {} }, 100);
        }
        return popup;
    };

})();