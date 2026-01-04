// ==UserScript==
// @name         Twitter/X Archive - bypass infinite scroll showing only part of a page at a time (Robust Sync)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Archive tweets into a sidebar and keep them continuously synced, even after multiple "Show more" clicks or React re-renders.
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549683/TwitterX%20Archive%20-%20bypass%20infinite%20scroll%20showing%20only%20part%20of%20a%20page%20at%20a%20time%20%28Robust%20Sync%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549683/TwitterX%20Archive%20-%20bypass%20infinite%20scroll%20showing%20only%20part%20of%20a%20page%20at%20a%20time%20%28Robust%20Sync%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Create archive sidebar ---
    const archive = document.createElement('div');
    Object.assign(archive.style, {
        position: 'fixed',
        top: '50px',
        right: '0',
        width: '450px',
        height: '90%',
        overflowY: 'auto',
        background: 'white',
        borderLeft: '2px solid #ccc',
        zIndex: 99999,
        fontSize: '14px',
        padding: '8px',
        boxSizing: 'border-box'
    });
    archive.innerHTML = "<h3 style='margin:4px 0 8px;font-weight:bold;'>Archived Tweets (Robust Sync)</h3><div id='archive-contents'></div>";
    document.body.appendChild(archive);
    const archiveContents = archive.querySelector('#archive-contents');

    // --- Track tweets ---
    const seen = new Map(); // tweetId → { original, clone, observer }

    // --- Helper: create clone container ---
    function makeCloneContainer(article) {
        const div = document.createElement("div");
        div.style.border = "1px solid #ddd";
        div.style.margin = "6px 0";
        div.style.padding = "6px";
        div.style.background = "#fff";
        div.style.maxWidth = "100%";
        div.innerHTML = article.innerHTML;
        return div;
    }

    // --- Attach a new observer to keep clone synced ---
    function attachObserver(tweetId, article, clone) {
        // Disconnect old one if exists
        if (seen.get(tweetId)?.observer) {
            seen.get(tweetId).observer.disconnect();
        }

        const innerObserver = new MutationObserver(() => {
            clone.innerHTML = article.innerHTML;
        });

        innerObserver.observe(article, { childList: true, subtree: true, characterData: true });

        // Update mapping
        seen.set(tweetId, { original: article, clone, observer: innerObserver });
    }

    // --- Process a tweet article ---
    function processArticle(article) {
        const link = article.querySelector('a[href*="/status/"]');
        if (!link) return;
        const tweetId = link.getAttribute('href');
        if (!tweetId) return;

        // Already archived?
        if (seen.has(tweetId)) {
            const entry = seen.get(tweetId);
            if (entry.original !== article) {
                // Original was replaced → reattach observer
                console.log("♻️ Tweet DOM replaced, reattaching observer:", tweetId);
                attachObserver(tweetId, article, entry.clone);
            }
            return;
        }

        // First time seeing this tweet
        const clone = makeCloneContainer(article);
        archiveContents.appendChild(clone);
        console.log("📌 Archived new tweet:", tweetId);

        attachObserver(tweetId, article, clone);
    }

    // --- Global observer for new tweets ---
    const observer = new MutationObserver(mutations => {
        for (let m of mutations) {
            for (let node of m.addedNodes) {
                if (node.nodeType !== 1) continue;

                if (node.tagName === "ARTICLE") {
                    processArticle(node);
                }

                const articles = node.querySelectorAll ? node.querySelectorAll("article") : [];
                articles.forEach(a => processArticle(a));
            }
        }
    });

    // --- Attach to timeline ---
    function watchTimeline() {
        const timeline = document.querySelector('[role="feed"], [aria-label^="Timeline"]');
        if (timeline) {
            console.log("✅ Archive: timeline found, robust syncing active...");
            const articles = timeline.querySelectorAll("article");
            articles.forEach(a => processArticle(a));
            observer.observe(timeline, { childList: true, subtree: true });
        } else {
            console.log("⏳ Archive: timeline not found yet, retrying...");
            setTimeout(watchTimeline, 1000);
        }
    }

    watchTimeline();
})();
