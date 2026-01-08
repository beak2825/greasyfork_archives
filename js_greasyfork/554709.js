// ==UserScript==
// @name         Link Cleaner (Full)
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Clean links (YouTube, Amazon, trackers), mark cleaned links on pages with ✔, no clipboard/paste/copy/cut/notifications
// @run-at       document-idle
// @match        *://*/*
// @match        file:///*
// @include      *
// @exclude      *://stumblechat.com/*
// @grant        none
// @noframes     false
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554709/Link%20Cleaner%20%28Full%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554709/Link%20Cleaner%20%28Full%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Do not clean links on YouTube or Amazon themselves
    if (/youtube\.com/i.test(location.hostname) || /amazon\./i.test(location.hostname)) {
        return;
    }

    // Trackers to strip
    const trackerPattern = /([?&])(si=[^&]*|utm_[^&]*|fbclid=[^&]*|gclid=[^&]*|msclkid=[^&]*|twclid=[^&]*|igshid=[^&]*|mc_eid=[^&]*)/gi;

    // Core URL cleaning logic
    function cleanUrl(url) {
        if (!url) return { cleaned: url, reason: null };
        let reasons = [];
        let cleaned = url;
        const original = url;

        // Strip trackers
        const trackers = [];
        cleaned = cleaned.replace(trackerPattern, (match, sep, keyval) => {
            trackers.push(keyval.split("=")[0]);
            return "";
        });
        cleaned = cleaned.replace(/[?&]+$/, "");
        if (trackers.length > 0) {
            trackers.forEach(t => reasons.push("Removed " + t));
        }

        // Skip Discord media / Tenor
        if (/^https?:\/\/(cdn\.discordapp\.com|media\.discordapp\.net|tenor\.com)/i.test(original)) {
            return { cleaned: original, reason: null };
        }

        // Skip YouTube clips
        if (/^https?:\/\/(www\.)?youtube\.com\/clip\//i.test(original)) {
            return { cleaned: original, reason: null };
        }

        // Shorts → watch
        const shortsMatch = cleaned.match(/^https?:\/\/(www\.)?youtube\.com\/shorts\/([A-Za-z0-9_-]+)/i);
        if (shortsMatch) {
            cleaned = `https://www.youtube.com/watch?v=${shortsMatch[2]}`;
            reasons.push("Expanded shorts → watch");
        }

        // youtu.be → expand
        const shortMatch = cleaned.match(/^https?:\/\/youtu\.be\/([A-Za-z0-9_-]+)/i);
        if (shortMatch) {
            cleaned = `https://www.youtube.com/watch?v=${shortMatch[1]}`;
            reasons.push("Expanded youtu.be → watch");
        }

        // Playlist
        const playlistMatch = cleaned.match(/^https?:\/\/(www\.)?youtube\.com\/playlist\?list=([A-Za-z0-9_-]+)/i);
        if (playlistMatch) {
            const listId = playlistMatch[2];
            cleaned = `https://www.youtube.com/playlist?list=${listId}`;
        }

        // Watch normalization
        const watchMatch = original.match(/^https?:\/\/(www\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/i);
        if (watchMatch) {
            const baseUrl = `https://www.youtube.com/watch?v=${watchMatch[2]}`;
            const trackersRemoved = trackers.length > 0;
            if (cleaned.startsWith(baseUrl) && cleaned !== original && !trackersRemoved) {
                reasons.push("Normalized watch URL");
            }
        }

        // Amazon cleanup
        if (/^https?:\/\/(www\.)?amazon\./i.test(cleaned)) {
            const asinMatch = cleaned.match(/\/(dp|gp\/product|exec\/obidos\/ASIN|o\/ASIN)\/([A-Z0-9]{10})/i);
            if (asinMatch) {
                const protocolMatch = cleaned.match(/^https?:/i);
                const protocol = protocolMatch ? protocolMatch[0] : 'https';
                const hostMatch = cleaned.match(/:\/\/([^\/]+)/);
                const hostname = hostMatch ? hostMatch[1] : 'amazon.com';
                const asin = asinMatch[2];
                const baseCleaned = cleaned.replace(/\?.*$/, '');
                const trailingSlash = baseCleaned.endsWith('/') ? '/' : '';
                const originalPath = baseCleaned.replace(/^https?:\/\/[^\/]+/, '');
                const newPath = `/dp/${asin}${trailingSlash}`;
                let newUrl = `${protocol}://${hostname}${newPath}`;

                // Extract and list removed params
                const paramPattern = /([?&])([^=]+)=[^&]*/g;
                const removedParams = [];
                let paramMatch;
                while ((paramMatch = paramPattern.exec(original)) !== null) {
                    removedParams.push(paramMatch[2]);
                }
                let changed = false;
                if (removedParams.length > 0) {
                    reasons.push("Removed Amazon " + removedParams.join(", "));
                    changed = true;
                }
                if (originalPath !== newPath) {
                    reasons.push("Amazon shortened to ASIN");
                    changed = true;
                }
                if (changed) {
                    if (hostname !== 'www.amazon.com') {
                        newUrl = newUrl.replace(hostname, 'www.amazon.com');
                        reasons.push("Normalized hostname");
                    }
                    cleaned = newUrl.replace(/\?.*$/, '');
                } else {
                    cleaned = original; // No change if clean
                }
            }
        }

        // Substack cleanup
        if (/^https?:\/\/(www\.)?substack\.com/i.test(cleaned)) {
            const subTrackers = [];
            cleaned = cleaned.replace(/([?&])r=[^&]*/gi, (match, sep) => {
                subTrackers.push('r');
                return "";
            });
            cleaned = cleaned.replace(/[?&]+$/, "");
            if (subTrackers.length > 0) {
                reasons.push("Removed Substack " + subTrackers.join(", "));
            }
        }

        if (reasons.length > 0 && cleaned !== original) {
            return { cleaned, reason: reasons.join(", ") };
        } else {
            return { cleaned: original, reason: null };
        }
    }

    // Checkmark on-page (de-duped)
    function markCheck(el, reason) {
        if (el.dataset.linkCleaned === "true") return;
        // Remove accidental old checkmark siblings
        if (el.nextSibling && el.nextSibling.classList && el.nextSibling.classList.contains("link-clean-check")) {
            el.parentNode.removeChild(el.nextSibling);
        }
        const check = document.createElement("span");
        check.textContent = " ✔";
        check.style.color = "#FFD700";
        check.style.fontSize = "smaller";
        check.className = "link-clean-check";
        check.title = reason || "Cleaned";
        el.parentNode.insertBefore(check, el.nextSibling);
        el.dataset.linkCleaned = "true";
    }

    // Sweep DOM, skip editable/input areas, de-dupe checkmarks
    function cleanLinks() {
        // Anchors
        document.querySelectorAll('a[href]').forEach(a => {
            if (a.dataset.linkCleaned === "true") return;
            const oldHref = a.href;
            const result = cleanUrl(oldHref);
            if (!result.reason) return;
            if (a.getAttribute("data-role") === "img") return;

            if (result.cleaned !== oldHref) {
                a.href = result.cleaned;
                if (a.innerText.includes(oldHref)) {
                    a.innerText = a.innerText.replace(oldHref, result.cleaned);
                }
                if (!a.querySelector("img")) {
                    markCheck(a, result.reason);
                }
            }
        });

        // Raw text nodes
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            // Don’t mess with inputs, textareas, or contentEditable
            if (node.parentNode.closest("input, textarea, [contenteditable]")) continue;
            if (!node.nodeValue.includes("http")) continue;
            if (node.parentNode.dataset.linkCleaned === "true") continue;

            const urlRegex = /(https?:\/\/[^\s]+)/gi;
            let changed = false;
            let reasonStore = null;

            const newText = node.nodeValue.replace(urlRegex, (match) => {
                const res = cleanUrl(match);
                if (res.reason) {
                    changed = true;
                    reasonStore = res.reason;
                }
                return res.cleaned;
            });

            if (changed) {
                const span = document.createElement("span");
                span.textContent = newText;
                node.parentNode.replaceChild(span, node);
                markCheck(span, reasonStore);
                span.dataset.linkCleaned = "true";
            }
        }
    }

    cleanLinks();
    setInterval(cleanLinks, 2000);
    // ---- MutationObserver for ProtonMail dynamic content ----
(function () {
    // Only run on ProtonMail
    if (!/mail\.proton\.me/i.test(location.hostname)) return;

    // Make sure the DOM is ready
    function startObserver() {
        try {
            // Pick a root element that contains the email content
            // ProtonMail changes layouts, but this usually works:
            const targetNode = document.querySelector('.message-content') || document.body;
            if (!targetNode) return;

            const observer = new MutationObserver((mutationsList) => {
                // Whenever the DOM changes, clean links!
                cleanLinks();
            });

            observer.observe(targetNode, {
                childList: true,
                subtree: true,
            });

            console.log("Link Cleaner MutationObserver attached in ProtonMail");
        } catch (err) {
            console.log("Link Cleaner MutationObserver ERROR:", err);
        }
    }

    // Run ASAP, but also on DOMContentLoaded just in case
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }
})();

})();