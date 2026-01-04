// ==UserScript==
// @name         Nugg's SpeedRacer
// @author       Nugg [1897371]
// @license      MIT
// @namespace    https://greasyfork.org/en/users/1537526-nugg
// @version      1.0.0
// @description  Racing script for Torn PDA. Helps you easily see the best race to join.  
// @match        https://www.torn.com/loader.php?sid=racing*
// @match        https://www.torn.com/page.php?sid=racing*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555766/Nugg%27s%20SpeedRacer.user.js
// @updateURL https://update.greasyfork.org/scripts/555766/Nugg%27s%20SpeedRacer.meta.js
// ==/UserScript==




(function () {
    'use strict';

    const ALLOWED_TRACK_SUBSTRINGS = ['Docks', 'Speedway'];
    const REQUIRED_LAPS = 100;

    const HIDE_PASSWORD_RACES = true;
    const HIDE_FEE_RACES = true;

    let isApplying = false;

    // --- helpers ---

    function waitForElement(selector, callback) {
        const checkInterval = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(checkInterval);
                callback(el);
            }
        }, 200);
    }

    function parseDrivers(driversText) {
        if (!driversText) return null;
        const clean = driversText.replace(/\s+/g, ' ').trim();
        const m = clean.match(/(\d+)\s*\/\s*(\d+)/);
        if (!m) return null;
        return {
            current: parseInt(m[1], 10),
            max: parseInt(m[2], 10)
        };
    }

    function looksPasswordProtected(raceEl) {
        if (!HIDE_PASSWORD_RACES) return false;

        const txt = raceEl.textContent || '';
        if (/password/i.test(txt)) return true;
        if (raceEl.querySelector('.icon-lock, .t-icon-lock, [class*="lock"]')) {
            return true;
        }
        return false;
    }

    function looksLikeHasFee(raceEl) {
        if (!HIDE_FEE_RACES) return false;

        const txt = raceEl.textContent || '';
        if (/entry\s*fee/i.test(txt)) return true;
        if (/join\s*fee/i.test(txt)) return true;
        return false;
    }

    function getClassCell(raceEl) {
        // Cell that originally contains “Any class”, “Stock Class D”, etc.
        const cells = Array.from(raceEl.querySelectorAll('li'));
        return cells.find(li =>
            !li.classList.contains('track') &&
            !li.classList.contains('drivers') &&
            /class/i.test(li.textContent || '')
        ) || null;
    }

    function ensureOriginalClassText(classCell) {
        if (!classCell) return '';
        if (!classCell.dataset.originalText) {
            classCell.dataset.originalText = classCell.textContent.trim();
        }
        return classCell.dataset.originalText;
    }

    function shouldKeepRace(raceEl) {
        const trackEl = raceEl.querySelector('li.track');
        const driversEl = raceEl.querySelector('li.drivers');
        const classCell = getClassCell(raceEl);

        if (!trackEl || !driversEl || !classCell) {
            return false;
        }

        const trackText = trackEl.textContent.trim();
        const classOriginal = ensureOriginalClassText(classCell);

        // Track must be Docks or Speedway
        const matchesTrack = ALLOWED_TRACK_SUBSTRINGS.some(substr =>
            trackText.includes(substr)
        );
        if (!matchesTrack) return false;

        // Must have originally said “Any class”
        if (!/any\s+class/i.test(classOriginal)) return false;

        // Laps: pull number from track text "(100 laps)"
        const lapsMatch = trackText.match(/(\d+)\s*laps?/i);
        const laps = lapsMatch ? parseInt(lapsMatch[1], 10) : null;
        if (laps !== REQUIRED_LAPS) return false;

        // Drivers: must not be full
        const driversInfo = parseDrivers(driversEl.textContent);
        if (!driversInfo) return false;
        if (driversInfo.current >= driversInfo.max) return false;

        // Optionally exclude password/fee races
        if (looksPasswordProtected(raceEl)) return false;
        if (looksLikeHasFee(raceEl)) return false;

        return true;
    }

    function annotateRace(raceEl, driversInfo) {
        const classCell = getClassCell(raceEl);
        if (!classCell || !driversInfo) return;

        // Show only driver count, e.g. "19/100"
        classCell.textContent = driversInfo.current + '/' + driversInfo.max;
    }

    function applyFilter() {
        if (isApplying) return;
        isApplying = true;

        const list = document.querySelector('ul.events-list');
        if (!list) {
            isApplying = false;
            return;
        }

        const races = Array.from(list.children);
        const kept = [];

        races.forEach(raceEl => {
            const driversEl = raceEl.querySelector('li.drivers');
            const driversInfo = driversEl ? parseDrivers(driversEl.textContent) : null;

            if (shouldKeepRace(raceEl) && driversInfo) {
                raceEl.style.display = '';
                annotateRace(raceEl, driversInfo);
                kept.push({ el: raceEl, current: driversInfo.current });
            } else {
                raceEl.style.display = 'none';
            }
        });

        // Sort kept races by number of racers, high → low
        kept.sort((a, b) => b.current - a.current);
        kept.forEach(item => list.appendChild(item.el));

        isApplying = false;
    }

    function setupObserver() {
        const list = document.querySelector('ul.events-list');
        if (!list) return;

        const observer = new MutationObserver(() => {
            applyFilter();
        });

        observer.observe(list, { childList: true, subtree: true });
    }

    // entry point
    waitForElement('ul.events-list', () => {
        applyFilter();
        setupObserver();
    });
})();
