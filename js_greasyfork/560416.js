// ==UserScript==
// @name         Search Liked/Playlist (YouTube Music)
// @namespace    http://tampermonkey.net/
// @version      11.1
// @description  Correct 'X' positioning, YouTube-style animation, and robust text-node highlighting.
// @author       Healz4Life
// @match        https://music.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/560416/Search%20LikedPlaylist%20%28YouTube%20Music%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560416/Search%20LikedPlaylist%20%28YouTube%20Music%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const DEFAULTS = {
        DEBOUNCE_MS: 150,
        DEFAULT_LIVE_SYNC: false,
        CACHE_DEAD_NODES: false
    };

    const CONFIG = {
        SEARCH_ID: 'ytm-custom-search-v11',
        DEBOUNCE_MS: GM_getValue('DEBOUNCE_MS', DEFAULTS.DEBOUNCE_MS),
        DEFAULT_LIVE_SYNC: GM_getValue('DEFAULT_LIVE_SYNC', DEFAULTS.DEFAULT_LIVE_SYNC),
        CACHE_DEAD_NODES: GM_getValue('CACHE_DEAD_NODES', DEFAULTS.CACHE_DEAD_NODES)
    };

    // --- Menus ---
    GM_registerMenuCommand(`⚙️ Typing Speed (Current: ${CONFIG.DEBOUNCE_MS}ms)`, () => {
        const val = prompt("Enter delay in ms:", CONFIG.DEBOUNCE_MS);
        if (val && !isNaN(val)) { GM_setValue('DEBOUNCE_MS', parseInt(val)); location.reload(); }
    });
    GM_registerMenuCommand(`🔄 Live-Sync Default (Current: ${CONFIG.DEFAULT_LIVE_SYNC ? 'ON' : 'OFF'})`, () => {
        GM_setValue('DEFAULT_LIVE_SYNC', !CONFIG.DEFAULT_LIVE_SYNC);
        location.reload();
    });
    GM_registerMenuCommand(`🧠 Memory Caching (Current: ${CONFIG.CACHE_DEAD_NODES ? 'ON' : 'OFF'})`, () => {
        GM_setValue('CACHE_DEAD_NODES', !CONFIG.CACHE_DEAD_NODES);
        location.reload();
    });

    // --- State ---
    const state = {
        query: '',
        isLiveSyncOn: CONFIG.DEFAULT_LIVE_SYNC,
        textCache: new WeakMap(),
        observer: null,
        debounceTimer: null,
        renderFrame: null
    };

    // --- CSS ---
    GM_addStyle(`
        /* Main Wrapper */
        #${CONFIG.SEARCH_ID}-wrapper {
            display: flex;
            align-items: center;
            margin-right: 12px;
            gap: 8px;
        }

        /* Input Container (Holds Input + X) */
        #${CONFIG.SEARCH_ID}-input-box {
            position: relative; /* Anchor for X button */
            display: flex;
            align-items: center;
        }

        /* The Input Field */
        #${CONFIG.SEARCH_ID} {
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.15);
            border-bottom: 1px solid rgba(255,255,255,0.15);
            color: #eee;
            padding: 0 32px 0 10px; /* Right padding reserved for X */
            border-radius: 4px;
            font-family: Roboto, Noto Naskh Arabic UI, Arial, sans-serif;
            font-size: 14px;
            outline: none;
            width: 220px;
            height: 36px;
            transition: background 0.2s, border-color 0.2s;
        }
        #${CONFIG.SEARCH_ID}:focus {
            background: rgba(0,0,0,0.6);
            border-color: #292929;
        }

        /* YouTube-Style Pulse Animation */
        @keyframes ytm-search-pulse {
            0% { border-bottom-color: rgba(62, 166, 255, 0.2); box-shadow: 0 1px 0 rgba(62, 166, 255, 0.2); }
            50% { border-bottom-color: #3ea6ff; box-shadow: 0 1px 6px rgba(62, 166, 255, 0.6); }
            100% { border-bottom-color: rgba(62, 166, 255, 0.2); box-shadow: 0 1px 0 rgba(62, 166, 255, 0.2); }
        }
        .ytm-searching-anim {
            animation: ytm-search-pulse 0.4s ease-out;
        }

        /* The X Button - Absolute inside the Input Box */
        #${CONFIG.SEARCH_ID}-clear {
            position: absolute;
            right: 6px;
            color: #aaa;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            border-radius: 50%;
            display: none; /* Controlled by JS */
            z-index: 5;
        }
        #${CONFIG.SEARCH_ID}-clear:hover {
            color: #fff;
            background: rgba(255,255,255,0.1);
        }

        /* Sync Button */
        #${CONFIG.SEARCH_ID}-btn {
            background: transparent;
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 4px;
            width: 36px;
            height: 36px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ccc;
            padding: 0;
            font-size: 18px;
            line-height: 1;
            user-select: none;
        }
        #${CONFIG.SEARCH_ID}-btn:hover {
            background: rgba(255,255,255,0.1);
            color: #fff;
        }
        #${CONFIG.SEARCH_ID}-btn.active {
            background: rgba(62,166,255,0.2);
            border-color: #3ea6ff;
            color: #3ea6ff;
            text-shadow: 0 0 8px rgba(62,166,255,0.4);
        }

        /* Utils */
        .ytm-hidden-item { display: none !important; }
        .ytm-search-fallback { padding: 10px 20px; width: 100%; }

        #${CONFIG.SEARCH_ID}-no-results {
            color: #aaa;
            font-size: 12px;
            display: none;
            white-space: nowrap;
        }

        /* Highlighting */
        .ytm-highlight-match {
            color: #3ea6ff !important;
            font-weight: 700 !important;
            background: rgba(62, 166, 255, 0.1);
            border-radius: 2px;
        }
    `);

    const ICONS = {
        SYNC_ON: '∞',
        SYNC_OFF: '⏸',
        CLEAR: '✕'
    };

    // --- Robust Highlighting Logic (Text Node Replacement) ---

    function stripHighlights(node) {
        // Find our custom spans and unwrap them
        const highlights = node.querySelectorAll('.ytm-highlight-match');
        highlights.forEach(span => {
            const parent = span.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(span.textContent), span);
                parent.normalize(); // Merge adjacent text nodes
            }
        });
    }

    function highlightText(rootNode, term) {
        if (!term) return;

        // We use a TreeWalker to find all text nodes.
        // This is safer than innerHTML because it preserves event listeners on parent <a> tags.
        const walker = document.createTreeWalker(
            rootNode,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Skip text inside our own highlight spans to avoid double processing
                    if (node.parentNode && node.parentNode.classList.contains('ytm-highlight-match')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // Only process if text contains term
                    if (node.textContent.toLowerCase().includes(term)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            }
        );

        const nodesToHighlight = [];
        while (walker.nextNode()) {
            nodesToHighlight.push(walker.currentNode);
        }

        // Process nodes (must be done after walking to avoid modifying tree while walking)
        nodesToHighlight.forEach(textNode => {
            const text = textNode.textContent;
            const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');

            // If the node matches, we split it up
            const parts = text.split(regex);

            if (parts.length > 1) {
                const fragment = document.createDocumentFragment();
                parts.forEach(part => {
                    if (part.toLowerCase() === term) {
                        const span = document.createElement('span');
                        span.className = 'ytm-highlight-match';
                        span.textContent = part;
                        fragment.appendChild(span);
                    } else {
                        fragment.appendChild(document.createTextNode(part));
                    }
                });
                textNode.parentNode.replaceChild(fragment, textNode);
            }
        });
    }

    // --- Core Logic ---

    function getCachedText(node) {
        if (state.textCache.has(node)) {
            return state.textCache.get(node);
        }
        const text = node.textContent.toLowerCase();
        // Do not cache skeletons (empty text)
        if (text && text.trim().length > 0 && CONFIG.CACHE_DEAD_NODES) {
            state.textCache.set(node, text);
        }
        return text;
    }

    function triggerAnimation() {
        const input = document.getElementById(CONFIG.SEARCH_ID);
        if (input) {
            input.classList.remove('ytm-searching-anim');
            void input.offsetWidth; // Trigger reflow
            input.classList.add('ytm-searching-anim');
        }
    }

    function runFilter() {
        if (state.renderFrame) cancelAnimationFrame(state.renderFrame);
        state.renderFrame = requestAnimationFrame(() => {
            triggerAnimation(); // Visual feedback

            const shelf = document.querySelector('ytmusic-playlist-shelf-renderer');
            if (!shelf) return;

            const items = shelf.querySelectorAll('ytmusic-responsive-list-item-renderer');
            const term = state.query;
            let visibleCount = 0;

            // Update X button visibility based on input length
            const clearBtn = document.getElementById(`${CONFIG.SEARCH_ID}-clear`);
            if (clearBtn) clearBtn.style.display = (term.length > 0) ? 'block' : 'none';

            items.forEach(item => {
                // 1. Clean previous highlights
                stripHighlights(item);

                if (!term) {
                    item.classList.remove('ytm-hidden-item');
                    visibleCount++;
                    return;
                }

                const text = getCachedText(item);

                // Skeleton handling
                if (!text || text.trim() === "") {
                     item.classList.add('ytm-hidden-item');
                     return;
                }

                if (text.includes(term)) {
                    item.classList.remove('ytm-hidden-item');
                    highlightText(item, term);
                    visibleCount++;
                } else {
                    item.classList.add('ytm-hidden-item');
                }
            });

            // "No Matches" Label
            const noResLabel = document.getElementById(`${CONFIG.SEARCH_ID}-no-results`);
            if (noResLabel) {
                if (term && visibleCount === 0) {
                    noResLabel.style.display = 'block';
                    noResLabel.textContent = '0 matches';
                } else {
                    noResLabel.style.display = 'none';
                }
            }
        });
    }

    function handleInput(e) {
        state.query = e.target.value.toLowerCase();

        if (state.debounceTimer) clearTimeout(state.debounceTimer);
        state.debounceTimer = setTimeout(() => {
            runFilter();
            updateObserverState();
        }, CONFIG.DEBOUNCE_MS);

        // Immediate toggle for X button
        const clearBtn = document.getElementById(`${CONFIG.SEARCH_ID}-clear`);
        if (clearBtn) clearBtn.style.display = (state.query.length > 0) ? 'block' : 'none';
    }

    function clearSearch() {
        const input = document.getElementById(CONFIG.SEARCH_ID);
        if (input) {
            input.value = '';
            state.query = '';
            input.focus();
            runFilter();
            updateObserverState();
        }
    }

    // --- Live-Sync ---

    function updateObserverState() {
        const shouldObserve = state.isLiveSyncOn && state.query.length > 0;
        if (shouldObserve && !state.observer) startObserver();
        else if (!shouldObserve && state.observer) stopObserver();
    }

    function startObserver() {
        const list = document.querySelector('ytmusic-playlist-shelf-renderer #contents');
        if (!list) return;

        state.observer = new MutationObserver((mutations) => {
            if (mutations.some(m => m.addedNodes.length > 0)) {
                setTimeout(runFilter, 100);
            }
        });
        state.observer.observe(list, { childList: true, subtree: true });
    }

    function stopObserver() {
        if (state.observer) { state.observer.disconnect(); state.observer = null; }
    }

    // --- Button ---

    function toggleLiveSync() {
        state.isLiveSyncOn = !state.isLiveSyncOn;
        const btn = document.getElementById(`${CONFIG.SEARCH_ID}-btn`);
        if (btn) {
            if (state.isLiveSyncOn) {
                btn.classList.add('active');
                btn.textContent = ICONS.SYNC_ON;
                btn.title = "Live-Sync: ON";
            } else {
                btn.classList.remove('active');
                btn.textContent = ICONS.SYNC_OFF;
                btn.title = "Live-Sync: OFF";
            }
        }
        updateObserverState();
        runFilter();
    }

    // --- Injection ---

    function inject() {
        if (document.getElementById(CONFIG.SEARCH_ID)) return;

        const wrapper = document.createElement('div');
        wrapper.id = `${CONFIG.SEARCH_ID}-wrapper`;

        // Inner container for Input + X
        const inputContainer = document.createElement('div');
        inputContainer.id = `${CONFIG.SEARCH_ID}-input-box`;

        const input = document.createElement('input');
        input.id = CONFIG.SEARCH_ID;
        input.placeholder = 'Search playlist for...';
        input.autocomplete = 'off';
        input.addEventListener('input', handleInput);
        input.addEventListener('keydown', e => {
            if(e.key === 'Escape') clearSearch();
        });

        const clearBtn = document.createElement('div');
        clearBtn.id = `${CONFIG.SEARCH_ID}-clear`;
        clearBtn.textContent = ICONS.CLEAR;
        clearBtn.title = 'Clear';
        clearBtn.addEventListener('click', clearSearch);

        // Put input and X in their own box
        inputContainer.appendChild(input);
        inputContainer.appendChild(clearBtn);

        const btn = document.createElement('button');
        btn.id = `${CONFIG.SEARCH_ID}-btn`;
        btn.addEventListener('click', toggleLiveSync);
        if (state.isLiveSyncOn) {
            btn.classList.add('active');
            btn.textContent = ICONS.SYNC_ON;
            btn.title = "Live-Sync: ON";
        } else {
            btn.classList.remove('active');
            btn.textContent = ICONS.SYNC_OFF;
            btn.title = "Live-Sync: OFF";
        }

        const noRes = document.createElement('span');
        noRes.id = `${CONFIG.SEARCH_ID}-no-results`;

        wrapper.appendChild(inputContainer);
        wrapper.appendChild(btn);
        wrapper.appendChild(noRes);

        const headerButtons = document.querySelector('ytmusic-responsive-header-renderer .buttons');
        if (headerButtons) {
            headerButtons.insertBefore(wrapper, headerButtons.firstChild);
            return;
        }

        const content = document.querySelector('#contents.ytmusic-section-list-renderer');
        if (content) {
            wrapper.classList.add('ytm-search-fallback');
            content.parentNode.insertBefore(wrapper, content);
        }
    }

    const appObserver = new MutationObserver(() => {
        if (!document.getElementById(CONFIG.SEARCH_ID)) {
            if (location.href.includes('playlist') || location.href.includes('album') || location.href.includes('browse')) {
                inject();
            }
        }
    });

    appObserver.observe(document.body, { childList: true, subtree: true });

})();