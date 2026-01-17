// ==UserScript==
// @name         GitHub Link Cleaner
// @namespace    https://spin.rip/
// @version      1.1
// @description  remove github hydro tracking attrs from all links + force noreferrer/noopener
// @author       Spinfal
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @run-at       document-idle
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/563053/GitHub%20Link%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/563053/GitHub%20Link%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'gh_link_cleaner_total_cleaned_v1';

    // session counters
    const pageStart = performance.now();
    let cleanedSincePageLoad = 0;

    // total (persisted) counter
    let cleanedSinceInstall = 0;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        cleanedSinceInstall = raw ? Number(raw) : 0;
        if (!Number.isFinite(cleanedSinceInstall) || cleanedSinceInstall < 0) cleanedSinceInstall = 0;
    } catch (_) {
        cleanedSinceInstall = 0;
    }

    function saveTotal() {
        try {
            localStorage.setItem(STORAGE_KEY, String(cleanedSinceInstall));
        } catch (_) {}
    }

    // console styling helpers
    const badge = (text, bg) => [
        `%c${text}`,
        `background:${bg};color:#fff;padding:2px 8px;border-radius:999px;font-weight:700;`
    ];

    const dim = 'color:#9aa0a6;';
    const key = 'color:#e8eaed;font-weight:700;';
    const val = 'color:#c7d2fe;font-weight:700;';

    function logStatus(reason, newlyCleaned) {
        const t = Math.round(performance.now() - pageStart);
        const [b1, s1] = badge('gh link cleaner', '#7c3aed');
        const [b2, s2] = badge(reason, '#111827');

        // compact, readable, and actually useful
        console.log(
            `${b1} ${b2} %c+%c${newlyCleaned}%c links cleaned %c|%c page %c${cleanedSincePageLoad}%c total %c|%c install %c${cleanedSinceInstall}%c %c(${t}ms)`,
            s1, s2,
            dim, val, dim,
            dim, dim, key, dim,
            dim, dim, key, dim,
            dim, dim
        );
    }

    // helper to clean a single link, returns true if we changed anything
    function cleanLink(a) {
        let changed = false;

        // remove hydro tracking attrs
        const attrsToRemove = [
            'data-hydro-click',
            'data-hydro-click-hmac',
            'data-hydro-view',
            'data-hydro-view-hmac',
            'data-hovercard-url',
            'data-hovercard-type'
        ];

        for (const attr of attrsToRemove) {
            if (a.hasAttribute(attr)) {
                a.removeAttribute(attr);
                changed = true;
            }
        }

        // harden rel attribute
        const existingRel = a.getAttribute('rel') || '';
        const parts = existingRel.split(/\s+/).filter(Boolean);
        const set = new Set(parts);

        if (!set.has('noopener')) {
            set.add('noopener');
            changed = true;
        }
        if (!set.has('noreferrer')) {
            set.add('noreferrer');
            changed = true;
        }

        const newRel = Array.from(set).join(' ').trim();
        if (newRel !== existingRel.trim()) {
            a.setAttribute('rel', newRel);
            changed = true;
        }

        return changed;
    }

    // run on all existing links; returns count of links actually modified
    function cleanAllLinks(root = document) {
        let count = 0;
        root.querySelectorAll('a').forEach(a => {
            if (cleanLink(a)) count++;
        });
        return count;
    }

    function bumpCounters(n) {
        if (!n) return;
        cleanedSincePageLoad += n;
        cleanedSinceInstall += n;
        saveTotal();
    }

    // initial pass
    const initial = cleanAllLinks();
    bumpCounters(initial);
    logStatus('page load', initial);

    // observe new nodes added dynamically
    const observer = new MutationObserver(muts => {
        let batch = 0;

        for (const mut of muts) {
            for (const node of mut.addedNodes) {
                if (!node || node.nodeType !== 1) continue;

                // if the node itself is a link
                if (node.tagName === 'A') {
                    if (cleanLink(node)) batch++;
                }

                // or contains links
                if (node.querySelectorAll) {
                    node.querySelectorAll('a').forEach(a => {
                        if (cleanLink(a)) batch++;
                    });
                }
            }
        }

        if (batch) {
            bumpCounters(batch);
            logStatus('dom update', batch);
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // show an explicit "installed/running" log even if nothing changed
    if (!initial) logStatus('running', 0);
})();