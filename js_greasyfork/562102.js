// ==UserScript==
// @name         MaruMori Justified scaled bar segments
// @namespace    https://marumori.io/
// @version      1.1
// @description  Justified bar segments with values displayed
// @match        https://marumori.io/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marumori.io
// @run-at       document-idle
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/562102/MaruMori%20Justified%20scaled%20bar%20segments.user.js
// @updateURL https://update.greasyfork.org/scripts/562102/MaruMori%20Justified%20scaled%20bar%20segments.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const isDarkMode = document.documentElement.classList.contains('dark-theme');

    const LEVELS = ['beginner', 'novice', 'intermediate', 'expert', 'master'];
    const SLOT_WIDTH = 100 / LEVELS.length;

    const LEVEL_RANGES = {
        beginner: [1, 4],
        novice: [5, 6],
        intermediate: [7, 7],
        expert: [8, 8],
        master: [9, 9]
    };

    let lastUrl = location.href;

    /* ---------- SPA WATCHER ---------- */
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            route();
        }
    }, 250);

    route();

function route() {
    if (!location.href.includes('/home')) return;

    const bars = document.querySelectorAll('.bars');
    if (bars.length >= 2) {
        applySlotLayout(bars[0], bars[1]);
    } else {
        waitForBars();
    }
}

function waitForBars() {
    const observer = new MutationObserver(() => {
        const bars = document.querySelectorAll('.bars');
        if (bars.length >= 2) {
            observer.disconnect();
            applySlotLayout(bars[0], bars[1]);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}


    /* ---------- HELPERS ---------- */

    function getSegmentCount(seg) {
        return [...seg.querySelectorAll('strong')]
            .map(el => parseInt(el.textContent, 10))
            .filter(Number.isFinite)
            .reduce((a, b) => a + b, 0);
    }

    function getLevelValues(seg, level) {
        const [start, end] = LEVEL_RANGES[level];
        const map = {};

        seg.querySelectorAll('.list span').forEach(span => {
            const match = span.textContent.match(/Level\s+(\d+)/i);
            const strong = span.querySelector('strong');
            if (match && strong) {
                map[+match[1]] = parseInt(strong.textContent, 10);
            }
        });

        const values = [];
        for (let i = start; i <= end; i++) {
            values.push(map[i] ?? 0);
        }
        return values;
    }

    function clearOld(bar) {
        bar.querySelectorAll('.slot-filler, .slot-label').forEach(e => e.remove());
    }

    function injectSlotLabel(bar, left, text) {
        const label = document.createElement('div');
        label.className = 'slot-label';
        label.textContent = text;

        Object.assign(label.style, {
            position: 'absolute',
            left: `${left}%`,
            width: `${SLOT_WIDTH}%`,
            top: '0',
            bottom: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontFamily: 'Noto Sans Japanese, MuseoSansRounded, Hiragino Sans GB, parts, partsF',
            fontWeight: isDarkMode ? '600' : '500',
            color: isDarkMode ? '#fff' : 'var(--dark)',
            textShadow: isDarkMode ? '0 1px 2px rgba(0,0,0,.6)' : 'none',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: '2'
        });

        bar.appendChild(label);
    }

    /* ---------- CORE LOGIC ---------- */

    function applySlotLayout(barA, barB) {
        [barA, barB].forEach(bar => {
            bar.style.position = 'relative';
            bar.style.overflow = 'hidden';
            clearOld(bar);
        });

        LEVELS.forEach((level, index) => {
            const segA = barA.querySelector(`.bar.${level}`);
            const segB = barB.querySelector(`.bar.${level}`);
            if (!segA || !segB) return;

            const countA = getSegmentCount(segA);
            const countB = getSegmentCount(segB);
            const max = Math.max(countA, countB, 1);
            const left = index * SLOT_WIDTH;

            layoutSegment(barA, segA, left, countA, max);
            layoutSegment(barB, segB, left, countB, max);

            const valuesA = getLevelValues(segA, level);
            const valuesB = getLevelValues(segB, level);

            injectSlotLabel(barA, left, valuesA.join(' / '));
            injectSlotLabel(barB, left, valuesB.join(' / '));
        });
    }

    function layoutSegment(bar, seg, left, count, max) {
        const visibleWidth = SLOT_WIDTH * (count / max);
        const fillerWidth = SLOT_WIDTH - visibleWidth;

        seg.style.left = `${left}%`;
        seg.style.width = `${visibleWidth}%`;
        seg.style.zIndex = '1';

        if (fillerWidth > 0) {
            const filler = seg.cloneNode(false);
            filler.classList.add('slot-filler');
            filler.style.left = `${left + visibleWidth}%`;
            filler.style.width = `${fillerWidth}%`;
            filler.style.opacity = '0';
            filler.style.pointerEvents = 'none';
            filler.style.zIndex = '0';
            bar.insertBefore(filler, seg.nextSibling);
        }
    }
})();