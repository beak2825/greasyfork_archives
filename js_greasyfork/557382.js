// ==UserScript==
// @name         Rule 34 AutoPlay + AutoNext 
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Autoplay video and always move to next post (detects ALL next link types)
// @match        https://rule34.xxx/*
// @match        https://www.rule34.xxx/*
// @grant        none
// @license      Codying34
// @downloadURL https://update.greasyfork.org/scripts/557382/Rule%2034%20AutoPlay%20%2B%20AutoNext.user.js
// @updateURL https://update.greasyfork.org/scripts/557382/Rule%2034%20AutoPlay%20%2B%20AutoNext.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const VIDEO_SELECTOR = "#gelcomVideoPlayer";
    let nextTriggered = false;

    function log(...msg) { console.log('[R34-Auto]', ...msg); }

    // UNIVERSAL NEXT LINK FINDER
    function findNextLink() {
        const selectors = [
            "#next_search_link", // from search pages
            "a[rel='next']", // semantic navigation
            "a.prevnext", // older navigation bars
            "div.linkList a[href*='id=']", // linkList navigation
            "div#hd a[href*='id=']", // header nav
            "a.thumb[href*='id=']", // thumbnail navigation
            "a[href*='s=view'][href*='id=']" // fallback rule: any post link
        ];

        for (let sel of selectors) {
            const el = document.querySelector(sel);
            if (el) return el;
        }

        // LAST RESORT: any link with “next” text
        const links = [...document.querySelectorAll("a")];
        const nextByText = links.find(a => /next|>/i.test(a.innerText));
        if (nextByText) return nextByText;

        return null;
    }

    function goNext() {
        if (nextTriggered) return;
        nextTriggered = true;

        const next = findNextLink();
        if (!next) {
            log("No next link found in ANY pattern.");
            return;
        }

        // Direct navigation if href is valid
        if (next.href && next.href !== "#" && next.href.trim() !== "") {
            log("Navigating:", next.href);
            window.location.href = next.href;
            return;
        }

        // Otherwise try clicking
        next.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        if (typeof next.click === "function") next.click();
    }

    function autoplay(video) {
        const play = () => {
            video.play().catch(() => setTimeout(play, 200));
        };
        play();
    }

    function setup(video) {
        log("Video found:", video);

        // Kill loop behavior
        video.loop = false;
        video.removeAttribute("loop");

        autoplay(video);

        // Standard ended event
        video.addEventListener("ended", () => {
            log("ENDED fired");
            goNext();
        });

        // Near-end detection
        video.addEventListener("timeupdate", () => {
            if (!video.duration || nextTriggered) return;
            if (video.duration - video.currentTime < 0.4) {
                log("Near end");
                goNext();
            }
        });

        // Pause at end detection
        video.addEventListener("pause", () => {
            if (!video.duration || nextTriggered) return;
            if (video.currentTime >= video.duration - 0.4) {
                log("Pause at end");
                goNext();
            }
        });
    }

    function findVideo() {
        return document.querySelector(VIDEO_SELECTOR) || document.querySelector("video");
    }

    // Initial
    let vid = findVideo();
    if (vid) setup(vid);

    // If loaded later
    new MutationObserver(() => {
        const v = findVideo();
        if (v && v !== vid) {
            vid = v;
            setup(v);
        }
    }).observe(document.body, { childList: true, subtree: true });

})();

