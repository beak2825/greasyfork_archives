// ==UserScript==
// @name         Chapter Vertical Progress
// @version      1.0
// @namespace    https://www.mvlempyr.com
// @description  yes
// @match        https://www.mvlempyr.com/chapter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553850/Chapter%20Vertical%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/553850/Chapter%20Vertical%20Progress.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // CONFIG
    const RETRY_INTERVAL_MS = 500;
    const MAX_RETRIES = 40; // ~20s total
    const PAR_SELECTOR = 'p[style*="margin-bottom: 1em"]';
    const LOG_PREFIX = '[ChapterProgress]';

    let retries = 0;
    let paras = [];
    let total = 0;
    let wrap, bar, fill, label;
    let chapterContent, chapter;

    function log(...args) { console.log(LOG_PREFIX, ...args); }
    function warn(...args) { console.warn(LOG_PREFIX, ...args); }
    function err(...args) { console.error(LOG_PREFIX, ...args); }

    function findElements() {
        chapterContent = document.querySelector('#chapter-content');
        chapter = document.querySelector('#chapter');
        log('Searching for elements...', { chapterContentFound: !!chapterContent, chapterFound: !!chapter });
        return !!chapterContent && !!chapter;
    }

    function scanParas() {
        if (!chapter) {
            paras = [];
            total = 0;
            log('scanParas: #chapter not found, cleared paras.');
            return;
        }
        paras = Array.from(chapter.querySelectorAll(PAR_SELECTOR));
        total = paras.length;
        log('scanParas: found paragraphs', { selector: PAR_SELECTOR, total });
        // log first few for debugging
        paras.slice(0, 6).forEach((p, i) => {
            log(`para[${i}] sample text:`, (p.textContent || '').slice(0, 80).replace(/\s+/g,' '));
        });
    }

    function createUI() {
        if (!chapterContent) {
            err('createUI: #chapter-content missing.');
            return;
        }

        // ensure positionable parent
        const cs = getComputedStyle(chapterContent);
        if (cs.position === 'static') {
            chapterContent.style.position = 'relative';
            log('createUI: changed #chapter-content position from static to relative');
        }

        // wrapper
        wrap = document.createElement('div');
        wrap.style.cssText = `
            position: fixed;
            left: 0px;
            top: 35px;
            width: 18px;
            display: flex;
            flex-direction: column;
            align-items: center;
            font: 11px sans-serif;
            color: #444;
            z-index: 999999;
            pointer-events: none;
        `;

        // bar shell
        bar = document.createElement('div');
        bar.style.cssText = `
            width: 6px;
            height: calc(100vh - 65px);
            background: rgba(255,255,255,.12);
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 6px;
        `;

        fill = document.createElement('div');
        fill.style.cssText = `
            width: 100%;
            height: 0%;
            background: #7b61ff;
        `;

        bar.appendChild(fill);

        label = document.createElement('div');
        label.textContent = `0/0`;
        label.style.cssText = `
            font-size: 11px;
            white-space: nowrap;
            pointer-events: none;
            color: #eee;
            transform: rotate(90deg);
            margin-top: 35px;
            visibility: hidden;
        `;

        wrap.appendChild(bar);
        wrap.appendChild(label);

        chapterContent.appendChild(wrap);
        log('createUI: UI appended to #chapter-content');
    }

    function updateProgress() {
        if (!paras || total === 0) {
            fill.style.height = '0%';
            label.textContent = `0/${total}`;
            log('updateProgress: no paras to track');
            return;
        }

        const mid = window.innerHeight / 2;
        let passed = 0;

        // compute passed count and log a sample rect occasionally
        for (let i = 0; i < paras.length; i++) {
            const p = paras[i];
            const r = p.getBoundingClientRect();
            if (r.bottom < mid) passed++;
            // if first few, log rects to help debug
            if (i < 3) {
                log(`para[${i}] rect:`, { top: r.top, bottom: r.bottom, height: r.height });
            }
        }

        const pct = total === 0 ? 0 : (passed / total) * 100;
        fill.style.height = pct + '%';
        label.textContent = `${passed}/${total}`;
        log('updateProgress:', { passed, total, pct: pct.toFixed(2) });
    }

    function attachEvents() {
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', () => {
            log('window resized -> rescanning paras and updating');
            scanParas();
            updateProgress();
        });

        // watch for dynamic changes inside #chapter (new paragraphs, style changes, etc)
        if (chapter) {
            try {
                const mo = new MutationObserver((mutList) => {
                    let changed = false;
                    for (const m of mutList) {
                        if (m.type === 'childList' || m.type === 'attributes') {
                            changed = true;
                            break;
                        }
                    }
                    if (changed) {
                        log('MutationObserver: DOM changed inside #chapter, rescanning paragraphs');
                        scanParas();
                        updateProgress();
                    }
                });
                mo.observe(chapter, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
                log('attachEvents: MutationObserver attached to #chapter');
            } catch (e) {
                warn('attachEvents: failed to attach MutationObserver', e);
            }
        } else {
            warn('attachEvents: chapter missing; skipping MutationObserver');
        }
    }

    // main init with retries in case content loads late
    function initOnce() {
        if (findElements()) {
            log('initOnce: required elements found, initializing...');
            try {
                scanParas();
                createUI();
                attachEvents();
                updateProgress();
                log('initOnce: initialization complete', { total });
            } catch (e) {
                err('initOnce: initialization error', e);
            }
            return true;
        } else {
            retries++;
            if (retries >= MAX_RETRIES) {
                err('initOnce: max retries reached, aborting. Elements not found.', { retries, MAX_RETRIES });
                return false;
            }
            log(`initOnce: elements not present yet, retrying in ${RETRY_INTERVAL_MS}ms (attempt ${retries}/${MAX_RETRIES})`);
            setTimeout(initOnce, RETRY_INTERVAL_MS);
            return false;
        }
    }

    // run
    try {
        log('Script started. Waiting for #chapter-content and #chapter...');
        initOnce();
    } catch (e) {
        err('Top-level error', e);
    }

})();
