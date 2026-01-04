// ==UserScript==
// @name         Perplexity Model Watcher
// @name:ru      Perplexity модель ответа
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  Observer for the actual model used in Perplexity. Elegant interface, drag-and-drop, model mismatch detection.
// @description:ru Наблюдатель за реальной моделью в Perplexity. Элегантный интерфейс, перетаскивание, детектор подмены модели.
// @author       MaxScorpy
// @match        https://*.perplexity.ai/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556547/Perplexity%20Model%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/556547/Perplexity%20Model%20Watcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration & State
    const CONFIG = { apiDelay: 1000 };
    const STATE = { lastDisplay: null, lastSelected: null };
    const STORE_KEY_POS = 'mw_pos_release_v1'; // Storage key for position

    // --- 1. CSS: Styling (Dark Glassmorphism) ---
    function injectStyles() {
        if (document.getElementById('mw-perfect-style')) return;
        const css = `
            /* Animations */
            @keyframes mw-glow-red {
                0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); border-color: rgba(239, 68, 68, 0.2); }
                50% { box-shadow: 0 0 12px 2px rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.5); }
                100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); border-color: rgba(239, 68, 68, 0.2); }
            }
            @keyframes mw-glow-green {
                0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                50% { box-shadow: 0 0 12px 1px rgba(16, 185, 129, 0.2); }
                100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
            }

            /* Main Container (Pill) */
            #mw-pill {
                position: fixed;
                z-index: 99999;
                /* Default position */
                bottom: 30px;
                left: 50%;
                /* Note: Transform is used for centering unless dragged. JS handles this. */

                display: flex;
                align-items: center;
                justify-content: center;

                height: 36px;
                padding: 0 20px;
                gap: 10px;

                /* Visual Style (Dark & Neon) */
                background: rgba(15, 15, 15, 0.85);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 99px;

                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 13px;
                color: #ececec;

                cursor: grab;
                user-select: none;
                box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                transition: width 0.3s, background 0.3s, border-color 0.3s, opacity 0.3s;

                opacity: 0; /* Hidden until initialized */
            }

            #mw-pill.mw-visible { opacity: 1; }
            #mw-pill:active { cursor: grabbing; }

            /* Status Dot */
            .mw-dot {
                width: 6px; height: 6px;
                border-radius: 50%;
                background: #555;
                flex-shrink: 0;
                transition: 0.3s;
            }

            /* Content Text */
            .mw-content {
                display: flex;
                align-items: center;
                gap: 8px;
                white-space: nowrap;
                transform: translateX(0px);
            }
            .mw-model { font-weight: 500; letter-spacing: 0.3px; }
            .mw-arrow { color: #888; font-size: 11px; margin: 0 2px; }
            .mw-err { color: #fca5a5; text-shadow: 0 0 10px rgba(239, 68, 68, 0.4); }

            /* Close/Minimize Button (Absolute to prevent layout shift) */
            .mw-close-btn {
                position: absolute;
                right: 6px;
                width: 24px; height: 24px;
                border-radius: 50%;
                background: rgba(255,255,255,0.1);
                color: #fff;
                display: flex; align-items: center; justify-content: center;
                font-size: 14px;
                line-height: 1;
                cursor: pointer;

                opacity: 0;
                transform: scale(0.8);
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: none;
            }

            .mw-close-btn:hover { background: rgba(255,255,255,0.25); transform: scale(1.1); }

            /* Show button on hover */
            #mw-pill:hover .mw-close-btn {
                opacity: 1;
                transform: scale(1);
                pointer-events: auto;
            }

            /* Status States */
            #mw-pill.st-ok { animation: mw-glow-green 4s infinite; border-color: rgba(16, 185, 129, 0.3); }
            #mw-pill.st-ok .mw-dot { background: #10b981; box-shadow: 0 0 8px #10b981; }

            #mw-pill.st-bad { animation: mw-glow-red 2s infinite; }
            #mw-pill.st-bad .mw-dot { background: #ef4444; box-shadow: 0 0 8px #ef4444; }

            /* Minimized State */
            #mw-pill.mw-minimized {
                width: 36px; /* Circle */
                padding: 0;
                justify-content: center;
                gap: 0;
            }
            #mw-pill.mw-minimized .mw-content { display: none; }
            #mw-pill.mw-minimized .mw-close-btn { display: none; }

        `;
        const s = document.createElement('style');
        s.id = 'mw-perfect-style';
        s.textContent = css;
        document.head.appendChild(s);
    }

    // --- 2. Logic: Create, Drag, Restore ---
    function createPill() {
        if (document.getElementById('mw-pill')) return;

        const pill = document.createElement('div');
        pill.id = 'mw-pill';
        // Insert structure
        pill.innerHTML = `
            <div class="mw-dot"></div>
            <div class="mw-content" id="mw-text">Waiting...</div>
            <div class="mw-close-btn" title="Minimize">×</div>
        `;

        document.body.appendChild(pill);
        restoreState(pill);

        // Fade in animation
        requestAnimationFrame(() => pill.classList.add('mw-visible'));

        // --- Drag Logic ---
        let isDragging = false;
        let startX, startY, initLeft, initTop;

        pill.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('mw-close-btn')) return;
            if (e.button !== 0) return; // Left click only

            isDragging = true;
            pill.style.transition = 'none'; // Disable transition during drag

            // If element was centered via transform, switch to absolute coordinates on first drag
            const rect = pill.getBoundingClientRect();

            pill.style.transform = 'none';
            pill.style.bottom = 'auto';
            pill.style.left = rect.left + 'px';
            pill.style.top = rect.top + 'px';

            startX = e.clientX;
            startY = e.clientY;
            initLeft = rect.left;
            initTop = rect.top;

            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            pill.style.left = (initLeft + dx) + 'px';
            pill.style.top = (initTop + dy) + 'px';
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                pill.style.transition = ''; // Re-enable animations
                saveState(pill);
            }
        });

        // --- Minimize Logic ---
        const closeBtn = pill.querySelector('.mw-close-btn');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            pill.classList.add('mw-minimized');
            saveState(pill);
        });

        // Expand on click
        pill.addEventListener('click', (e) => {
            if (pill.classList.contains('mw-minimized')) {
                pill.classList.remove('mw-minimized');
                saveState(pill);
            }
        });
    }

    function saveState(el) {
        const rect = el.getBoundingClientRect();
        const state = {
            top: rect.top,
            left: rect.left,
            minimized: el.classList.contains('mw-minimized')
        };
        GM_setValue(STORE_KEY_POS, state);
    }

    function restoreState(el) {
        const state = GM_getValue(STORE_KEY_POS);
        if (state) {
            // Restore position
            el.style.transform = 'none';
            el.style.bottom = 'auto';
            el.style.top = state.top + 'px';
            el.style.left = state.left + 'px';

            if (state.minimized) el.classList.add('mw-minimized');
        } else {
            // Default: Center bottom
            el.style.transform = 'translateX(-50%)';
        }
    }

    // --- 3. Data & Update ---
    function updateUI(disp, sel) {
        STATE.lastDisplay = disp;
        STATE.lastSelected = sel;

        const pill = document.getElementById('mw-pill');
        const textContainer = document.getElementById('mw-text');
        if (!pill || !textContainer) return;

        pill.classList.remove('st-ok', 'st-bad', 'st-wait');

        if (!disp && !sel) {
            pill.classList.add('st-wait');
            textContainer.innerHTML = `<span style="opacity:0.5">Analyzing...</span>`;
            return;
        }

        if (disp === sel) {
            // OK
            pill.classList.add('st-ok');
            textContainer.innerHTML = `<span class="mw-model">${disp}</span>`;
        } else {
            // MISMATCH: Selected -> Arrow -> Display
            pill.classList.add('st-bad');
            textContainer.innerHTML = `
                <span class="mw-model" style="opacity:0.7">${sel || '?'}</span>
                <span class="mw-arrow">→</span>
                <span class="mw-model mw-err">${disp || '?'}</span>
            `;
        }
    }

    // --- 4. Network & parsing ---

    // Active Fetch (to get data even if page is cached)
    async function fetchThreadData(slug) {
        try {
            const response = await fetch(`/rest/thread/${slug}`);
            if (response.ok) processText(await response.text());
        } catch (e) {}
    }

    function checkCurrentPage() {
        const path = location.pathname;
        if (path.startsWith('/search/') || path.startsWith('/collections/')) {
            const slug = path.split('/').pop();
            if (slug && slug.length > 5) setTimeout(() => fetchThreadData(slug), CONFIG.apiDelay);
        }
    }

    function deepFind(obj) {
        let res = {};
        function walk(v, depth = 0) {
            if (depth > 20 || !v || typeof v !== 'object') return;
            if (res.display_model && res.user_selected_model) return;
            if (v.display_model) res.display_model = v.display_model;
            if (v.user_selected_model) res.user_selected_model = v.user_selected_model;
            for (let k in v) walk(v[k], depth + 1);
        }
        walk(obj);
        return res;
    }

    function processText(text) {
        if (!text || typeof text !== 'string') return;
        if (!text.includes('display_model') && !text.includes('user_selected_model')) return;
        try {
            const json = JSON.parse(text);
            const found = deepFind(json);
            if (found.display_model || found.user_selected_model) {
                updateUI(found.display_model, found.user_selected_model);
                return;
            }
        } catch (e) {}
        const dm = /"display_model"\s*:\s*"([^"]+)"/.exec(text);
        const um = /"user_selected_model"\s*:\s*"([^"]+)"/.exec(text);
        if (dm || um) updateUI(dm ? dm[1] : null, um ? um[1] : null);
    }

    // Inject script into page context to hook window.fetch
    function injectInterceptor() {
        const script = document.createElement('script');
        script.textContent = `
        (function() {
            function post(t) { window.postMessage({ __mw: true, type: 'M', text: t }, '*'); }
            const origFetch = window.fetch;
            window.fetch = function(...args) {
                return origFetch.apply(this, args).then(res => {
                    try { res.clone().text().then(post).catch(()=>{}); } catch(e) {}
                    return res;
                });
            };
        })();
        `;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    }

    // --- Init ---
    function init() {
        injectStyles();
        createPill();
        injectInterceptor();

        window.addEventListener('message', (e) => {
            if (e.data?.type === 'M') processText(e.data.text);
        });

        // SPA handling: re-inject if body changes significantly
        new MutationObserver(() => {
            if (!document.getElementById('mw-pill') && document.body) createPill();
        }).observe(document, {subtree: true, childList: true});

        // URL change handling
        let lastUrl = location.href;
        new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                updateUI(null, null);
                checkCurrentPage();
            }
        }).observe(document, {subtree: true, childList: true});

        checkCurrentPage();
    }

    if (document.body) init();
    else document.addEventListener('DOMContentLoaded', init);

})();