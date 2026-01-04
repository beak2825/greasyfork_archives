// ==UserScript==
// @name         Live Link Cleaner
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Strip trackers and clean shared links (YouTube, Amazon, Substack, etc.), mark only real cleaned links with hover reason
// @match        *://*/*
// @match        file:///*
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554709/Live%20Link%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/554709/Live%20Link%20Cleaner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (/youtube\.com/i.test(location.hostname) || /amazon\./i.test(location.hostname)) {
        return;
    }

    // Only known trackers, do NOT include `list`
    const trackerPattern = /([?&])(si=[^&]*|utm_[^&]*|fbclid=[^&]*|gclid=[^&]*)/gi;

    function cleanUrl(url) {
        if (!url) return { cleaned: url, reason: null };
        let reason = [];
        let cleaned = url;

        // Skip Discord media / Tenor
        if (/^https?:\/\/(cdn\.discordapp\.com|media\.discordapp\.net|tenor\.com)/i.test(url)) {
            return { cleaned: url, reason: null };
        }

        // Skip YouTube clips
        if (/^https?:\/\/(www\.)?youtube\.com\/clip\//i.test(url)) {
            return { cleaned: url, reason: null };
        }

        // Shorts → watch
        const shortsMatch = url.match(/^https?:\/\/(www\.)?youtube\.com\/shorts\/([A-Za-z0-9_-]+)/i);
        if (shortsMatch) {
            reason.push("Expanded shorts → watch");
            return { cleaned: `https://www.youtube.com/watch?v=${shortsMatch[2]}`, reason: reason.join(", ") };
        }

        // watch?v= cleanup
        const watchMatch = url.match(/^https?:\/\/(www\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/i);
        if (watchMatch) {
            reason.push("Normalized watch URL");
            return { cleaned: `https://www.youtube.com/watch?v=${watchMatch[2]}`, reason: reason.join(", ") };
        }

        // youtu.be → expand
        const shortMatch = url.match(/^https?:\/\/youtu\.be\/([A-Za-z0-9_-]+)/i);
        if (shortMatch) {
            reason.push("Expanded youtu.be → watch");
            return { cleaned: `https://www.youtube.com/watch?v=${shortMatch[1]}`, reason: reason.join(", ") };
        }

        // Amazon cleanup
        if (/^https?:\/\/(www\.)?amazon\./i.test(url)) {
            const asinMatch = url.match(/\/(dp|gp\/product)\/([A-Z0-9]{10})/i);
            if (asinMatch) {
                reason.push("Amazon shortened to ASIN");
                return { cleaned: `https://www.amazon.com/dp/${asinMatch[2]}/`, reason: reason.join(", ") };
            }
        }

        // Substack cleanup - removes referral tracker ?r= or &r=
        if (/^https?:\/\/(www\.)?substack\.com/i.test(url)) {
            const subTrackers = [];
            cleaned = cleaned.replace(/([?&])(r=[^&]*)/gi, (match, sep, keyval) => {
                subTrackers.push(keyval.split("=")[0]);
                return "";
            });
            cleaned = cleaned.replace(/[?&]+$/, "");
            if (subTrackers.length > 0) {
                reason.push("Removed Substack " + subTrackers.join(", "));
            }
        }

        // Generic tracker cleanup
        const trackers = [];
        cleaned = cleaned.replace(trackerPattern, (match, sep, keyval) => {
            trackers.push(keyval.split("=")[0]);
            return "";
        });
        cleaned = cleaned.replace(/[?&]+$/, "");
        if (trackers.length > 0) {
            reason.push("Removed " + trackers.join(", "));
        }

        if (reason.length > 0) {
            return { cleaned, reason: reason.join(", ") };
        } else {
            return { cleaned: url, reason: null };
        }
    }

    function markCheck(el, reason) {
        if (!el.nextSibling || !el.nextSibling.classList || !el.nextSibling.classList.contains("link-clean-check")) {
            const check = document.createElement("span");
            check.textContent = " ✔";
            check.style.color = "#FFD700";
            check.style.fontSize = "smaller";
            check.className = "link-clean-check";
            check.title = reason || "Cleaned";
            check.setAttribute("data-clean-reason", reason || "");
            el.parentNode.insertBefore(check, el.nextSibling);
        }
    }

    function cleanLinks() {
        // Anchors
        document.querySelectorAll('a[href]').forEach(a => {
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

        // Raw text URLs
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            if (!node.nodeValue.includes("http")) continue;

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
            }
        }
    }

    cleanLinks();
    setInterval(cleanLinks, 2000);
})();