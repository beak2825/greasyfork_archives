// ==UserScript==
// @name         Arrow Keys: Next/Prev Chapter
// @namespace    https://github.com/Astropilot-Fizzfaldt-Merge
// @version      1.2.0
// @description  Use arrow keys (← / →) to navigate next/previous chapters on supported sites
// @author       Astropilot + Fizzfaldt + ChatGPT
// @license      MIT
// @run-at       document-end
// @grant        none
// @noframes
// @match        https://comix.to/*
// @match        *://*.archiveofourown.org/*/chapters/*
// @match        *://*.asuracomic.net/*
// @match        *://*.asuratoon.com/*
// @match        *://*.fanfiction.net/*
// @match        *://*.flamescans.com/*chapter*
// @match        *://*.manga-scans.com/chapter/*
// @match        *://*.oglaf.com/*
// @match        *://*.realmscans.xyz/*-chapter-*
// @match        *://*.reaperscans.com/*
// @match        *://*.strongfemaleprotagonist.com/*
// @match        *://*.tthfanfic.org/*
// @match        *://*.webtoons.com/*/viewer*episode_no=*
// @match        *://*.wuxiaworld.co/*
// @match        *://*.wuxiaworld.com/*
// @match        *://*.xcalibrscans.com/*-chapter-*
// @match        *://*.mangakakalot.com/chapter/*
// @match        *://*.chapmanganato.to/manga-*/chapter-*
// @match        *://*.scyllacomics.xyz/manga/*/*
// @match        *://*.mangagalaxy.org/series/*/chapter-*
// @match        *://*.natomanga.com/manga/*/chapter-*
// @match        *://*.colamanga.com/manga-*/*/*.html
// @match        *://readcomiconline.li/Comic/*
// @match        *://*.vortexscans.org/*
// @require      https://cdn.jsdelivr.net/npm/psl@1.9.0/dist/psl.min.js
// @icon         https://cdn-icons-png.flaticon.com/512/1782/1782564.png
// @downloadURL https://update.greasyfork.org/scripts/561664/Arrow%20Keys%3A%20NextPrev%20Chapter.user.js
// @updateURL https://update.greasyfork.org/scripts/561664/Arrow%20Keys%3A%20NextPrev%20Chapter.meta.js
// ==/UserScript==

(function () {
    "use strict";

    /* ------------------------------
     * XPATH MAP (unchanged except Mangafire removed)
     * ------------------------------ */
    const xpathMap = {
        "archiveofourown.org": {
            prev: '//a[@href and text()="← Previous Chapter"]/@href',
            next: '//a[@href and text()="Next Chapter →"]/@href',
        },
        "xcalibrscans.com": {
            prev: '//a[@class="ch-prev-btn" and @href]/@href',
            next: '//a[@class="ch-next-btn" and @href]/@href',
        },
    };

    /* ------------------------------
     * SELECTOR MAP
     * Added: vortexscans.org
     * Removed: mangafire.to
     * ------------------------------ */
    const selectorMap = [
        { hosts: ["manga-scans.com"], selectors: { prev: "div.prev-post > a", next: "div.next-post > a" } },
        { hosts: ["reaperscans.com"], selectors: { prev: "main nav div.flex:nth-of-type(1) > a", next: "main nav div.flex:nth-of-type(3) > a:nth-of-type(2)" } },
        { hosts: ["webtoons.com"], selectors: { prev: "a._prevEpisode", next: "a._nextEpisode" } },
        { hosts: ["mangakakalot.com"], selectors: { prev: ".btn-navigation-chap > a.next", next: ".btn-navigation-chap > a.back" } },
        { hosts: ["chapmanganato.to"], selectors: { prev: ".navi-change-chapter-btn > a.navi-change-chapter-btn-prev", next: ".navi-change-chapter-btn > a.navi-change-chapter-btn-next" } },
        { hosts: ["scyllacomics.xyz"], selectors: { prev: "main section div.relative div.flex div.grid a:nth-of-type(1)", next: "main section div.relative div.flex div.grid a:nth-of-type(2)" } },
        { hosts: ["mangagalaxy.org"], selectors: { prev: "a[aria-label='Prev']", next: "a[aria-label='Next']" } },
        { hosts: ["natomanga.com"], selectors: { prev: ".btn-navigation-chap a.next", next: ".btn-navigation-chap a.back" } },
        { hosts: ["colamanga.com"], selectors: { prev: ".mh_headpager a.read_page_link:first-of-type", next: ".mh_headpager a.read_page_link:last-of-type" } },
        { hosts: ["readcomiconline.li"], selectors: { prev: 'img[title="Previous Issue"]', next: 'img[title="Next Issue"]' }, getLinkFromImage: true },
        { hosts: ["asuracomic.net"], selectors: { prev: "a.prev", next: "a.next" } },

        /* ★★★ NEW — vortexscans.org ★★★ */
        { hosts: ["vortexscans.org"], selectors: {
            prev: 'button[aria-label="Prev"]',
            next: 'button[aria-label="Next"]'
        }},
    ];

    /* helpers */
    const currentDomain = psl.get(window.location.hostname);
    const selectorRule = selectorMap.find(r => r.hosts.includes(currentDomain));

    function safeNavigate(href) {
        if (!href) return;
        try {
            const resolved = new URL(href, window.location.href).href;
            window.location.href = resolved;
        } catch (err) {}
    }

    function getXPathLink(expr) {
        try {
            const res = document.evaluate(expr, document, null, XPathResult.ANY_TYPE, null);
            const node = res.iterateNext();
            return node ? node.value : null;
        } catch (e) { return null; }
    }

    function genericFindLinkBySelectorRule(direction) {
        if (!selectorRule) return null;
        const sel = selectorRule.selectors[direction];
        if (!sel) return null;
        try { return document.querySelector(sel); } catch (e) { return null; }
    }

    /* ------------------------------
     * Main Key Listener
     * ------------------------------ */
    document.addEventListener("keydown", (e) => {
        if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName) || e.target.isContentEditable) return;
        if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

        const dir = e.key === "ArrowLeft" ? "prev" : "next";

        // 1) XPath rule
        const xpathRule = xpathMap[currentDomain];
        if (xpathRule && xpathRule[dir]) {
            const link = getXPathLink(xpathRule[dir]);
            if (link) {
                safeNavigate(link);
                e.preventDefault();
                return;
            }
        }

        // 2) Selector rules
        const selEl = genericFindLinkBySelectorRule(dir);
        if (selEl) {
            if (selEl.tagName === "A" && selEl.href) {
                safeNavigate(selEl.href);
            } else {
                selEl.click(); // works for VortexScans buttons
            }
            e.preventDefault();
            return;
        }

        // 3) Fallback text-based search
        const anchors = Array.from(document.querySelectorAll("a[href]"));
        for (const a of anchors) {
            const txt = a.textContent.toLowerCase();
            if (dir === "prev" && (txt.includes("prev") || txt.includes("previous"))) {
                safeNavigate(a.href);
                e.preventDefault();
                return;
            }
            if (dir === "next" && txt.includes("next")) {
                safeNavigate(a.href);
                e.preventDefault();
                return;
            }
        }
    });
})();


/* =========================================================
   APPENDED — COMIX.TO SCRIPT (UNCHANGED)
   ========================================================= */

(function () {
    'use strict';

    const SCROLL_AMOUNT = 80;

    function getScrollableElement() {
        const elements = document.querySelectorAll('*');
        let best = null;
        let maxScroll = 0;

        for (const el of elements) {
            const scrollHeight = el.scrollHeight - el.clientHeight;
            if (scrollHeight > maxScroll && scrollHeight > 200) {
                maxScroll = scrollHeight;
                best = el;
            }
        }

        return best || document.documentElement;
    }

    window.addEventListener(
        'keydown',
        function (e) {
            const el = document.activeElement;
            if (
                el &&
                (el.tagName === 'INPUT' ||
                    el.tagName === 'TEXTAREA' ||
                    el.isContentEditable)
            ) return;

            if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;

            const scrollEl = getScrollableElement();
            if (!scrollEl) return;

            e.stopImmediatePropagation();
            e.preventDefault();

            const delta = e.key === 'ArrowDown' ? SCROLL_AMOUNT : -SCROLL_AMOUNT;
            scrollEl.scrollTop += delta;
        },
        true
    );
})();
