// ==UserScript==
// @name         MaruMori Scaled Bars
// @namespace    https://marumori.io/
// @version      1.2
// @description  Globally scaled bar segments with dominant-based slots and strict max-width cap using water-fill algorithm
// @match        https://marumori.io/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marumori.io
// @run-at       document-idle
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/562118/MaruMori%20Scaled%20Bars.user.js
// @updateURL https://update.greasyfork.org/scripts/562118/MaruMori%20Scaled%20Bars.meta.js
// ==/UserScript==

    (() => {
        'use strict';

      const style = document.createElement('style');
style.textContent = `
.tooltip {
  z-index: 1000 !important;
}
`;
document.head.appendChild(style);


        const isDarkMode = document.documentElement.classList.contains('dark-theme');
        const LEVELS = ['beginner', 'novice', 'intermediate', 'expert', 'master'];
        const MAX_SLOT_PERCENT = 30;
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
                applyGlobalLayout(bars[0], bars[1]);
            } else {
                waitForBars();
            }
        }

        function waitForBars() {
            const observer = new MutationObserver(() => {
                const bars = document.querySelectorAll('.bars');
                if (bars.length >= 2) {
                    observer.disconnect();
                    applyGlobalLayout(bars[0], bars[1]);
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

        function injectSlotLabel(bar, left, width, text) {
            const label = document.createElement('div');
            label.className = 'slot-label';
            label.textContent = text;

            Object.assign(label.style, {
                position: 'absolute',
                left: `${left}%`,
                width: `${width}%`,
                top: '0',
                bottom: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontFamily: 'Noto Sans Japanese, MuseoSansRounded, Hiragino Sans GB, parts, partsF',
                fontWeight: isDarkMode ? '600' : '500',
                color: 'var(--dark)',
                textShadow: isDarkMode ? '0 1px 2px rgba(0,0,0,.6)' : 'none',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                zIndex: 'auto'
            });

            bar.appendChild(label);
        }

        /* ---------- CORE LOGIC ---------- */

        function applyGlobalLayout(barA, barB) {
            [barA, barB].forEach(bar => {
                bar.style.position = 'relative';
                bar.style.overflow = 'visible';
                clearOld(bar);
            });

            const segments = LEVELS.map(level => {
                const segA = barA.querySelector(`.bar.${level}`);
                const segB = barB.querySelector(`.bar.${level}`);
                if (!segA || !segB) return null;

                const countA = getSegmentCount(segA);
                const countB = getSegmentCount(segB);
                const dominant = Math.max(countA, countB);

                if (dominant === 0) return null;
                return { level, segA, segB, countA, countB, dominant };
            }).filter(Boolean);

            const globalTotal = segments.reduce((s, x) => s + x.dominant, 0) || 1;

            // ---------- STRICT CAPPED NORMALIZATION ----------
            let remaining = 100;
            let remainingSegments = segments.slice();

            segments.forEach(s => s.finalWidth = 0);

            while (remainingSegments.length) {
                const totalDominant = remainingSegments.reduce((s, x) => s + x.dominant, 0) || 1;
                let cappedThisPass = false;

                for (const s of remainingSegments) {
                    const proposed = (s.dominant / totalDominant) * remaining;

                    if (proposed > MAX_SLOT_PERCENT) {
                        s.finalWidth = MAX_SLOT_PERCENT;
                        remaining -= MAX_SLOT_PERCENT;
                        remainingSegments = remainingSegments.filter(x => x !== s);
                        cappedThisPass = true;
                        break;
                    }
                }

                if (!cappedThisPass) {
                    remainingSegments.forEach(s => {
                        s.finalWidth = (s.dominant / totalDominant) * remaining;
                    });
                    break;
                }
            }

            // ---------- LAYOUT ----------
            let cursor = 0;

            segments.forEach(({ level, segA, segB, countA, countB, dominant, finalWidth }) => {
                layoutSegment(barA, segA, cursor, finalWidth, countA, dominant);
                layoutSegment(barB, segB, cursor, finalWidth, countB, dominant);

                injectSlotLabel(barA, cursor, finalWidth, getLevelValues(segA, level).join(' / '));
                injectSlotLabel(barB, cursor, finalWidth, getLevelValues(segB, level).join(' / '));

                cursor += finalWidth;
            });
        }

        function layoutSegment(bar, seg, left, slotWidth, count, dominant) {
            const visibleWidth = dominant > 0
                ? slotWidth * (count / dominant)
                : 0;

            const fillerWidth = slotWidth - visibleWidth;

            seg.style.left = `${left}%`;
            seg.style.width = `${visibleWidth}%`;
            seg.style.zIndex = 'auto';

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