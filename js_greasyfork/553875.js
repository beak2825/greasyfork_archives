// ==UserScript==
// @name         Spicy Writer Token Counter
// @namespace    https://greasyfork.org/en/scripts/553875-spicy-writer-token-counter
// @version      1.5.1
// @description  A token counter for SpicyWriter conversations with warnings to start a new thread to avoid context degradation.
// @author       Google Gemini 2.5 Pro
// @match        https://spicywriter.com/*
// @match        https://*.spicywriter.com/*
// @require      https://cdn.jsdelivr.net/npm/gpt-tokenizer@3.2/dist/o200k_base.min.js
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553875/Spicy%20Writer%20Token%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/553875/Spicy%20Writer%20Token%20Counter.meta.js
// ==/UserScript==

/* global GPTTokenizer_o200k_base */

(function() {
    'use strict';

    // --- User-configurable Settings ---
    const SETTINGS = {
        corner: 'top-right',	// 'top-right' or 'bottom-right'
        verticalMargin: 60,		// in pixels
        horizontalMargin: 15,	// in pixels
        debounceDelay: 300,		// in milliseconds
    };

    // --- Configuration for Token Thresholds ---
    const THRESHOLDS = {
        green:	{ key: 'green', limit: 8000, color: '#10b981', tip: "Optimal performance. Conversation is fresh. AI will respond with full accuracy." },
        lime:	{ key: 'lime', limit: 16000, color: '#84cc16', tip: "Good quality. AI is still performing well, but consider starting new conversation soon." },
        yellow:	{ key: 'yellow', limit: 24000, color: '#f59e0b', tip: "Quality may decline. AI might miss some context. Consider starting new conversation." },
        orange:	{ key: 'orange', limit: 32000, color: '#f97316', tip: "Performance declining. AI may give less accurate responses. Start new conversation to restore quality." },
        red:	{ key: 'red', limit: Infinity, color: '#ef4444', tip: "Poor performance zone. Start new conversation now to avoid unexpected problems." }
    };

    // --- Main Script ---
    const DEBUG_MODE = false;

    const GLOW_COOLDOWN_MS = 60000; // Cooldown for the glow/tooltip animation

    // --- State Management ---
    let totalBaseTokens = 0;
    let totalClaudeTokens = 0;
    let mainObserver = null;
    let overlay = null;
    let currentStatusKey = null;
    let lastGlowTimestamp = 0; // [BUG FIX] Timestamp for animation cooldown.
    let inputHandler = null;

    // --- Utility Functions ---
    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function getTokenCounts(text) {
        if (!text || typeof text !== 'string') return { base: 0, claude: 0 };
        const base = GPTTokenizer_o200k_base.countTokens(text);
        // Heuristic: Claude models use ~16% more tokens than OpenAI's o200k for similar text.
        const claude = base * 1.16;
        return { base, claude };
    }

    function formatTokenCount(num) {
        if (num < 1000) {
            return '~' + (Math.ceil(num / 100) * 100);
        }
        const k = num / 1000;
        return '~' + k.toFixed(k < 10 ? 1 : 0) + 'k';
    }

    function formatForTooltip(num) {
        if (num < 1000) return String(Math.round(num / 10) * 10);
        const k = num / 1000;
        return k.toFixed(1) + 'k';
    }

    // --- Overlay Management ---
    function createOverlay() {
        if (document.getElementById('token-counter-overlay')) return;
        overlay = document.createElement('div');
        overlay.id = 'token-counter-overlay';
        document.body.appendChild(overlay);

        overlay.style.top = SETTINGS.corner.startsWith('top-') ? `${SETTINGS.verticalMargin}px` : 'auto';
        overlay.style.bottom = SETTINGS.corner.startsWith('bottom-') ? `${SETTINGS.verticalMargin}px` : 'auto';
        overlay.style.right = SETTINGS.corner.endsWith('-right') ? `${SETTINGS.horizontalMargin}px` : 'auto';
        overlay.dataset.position = SETTINGS.corner;

        overlay.addEventListener('animationend', (event) => {
            if (event.animationName === 'subtleGlow') {
                overlay.classList.remove('glow-warning');
            }
            if (event.animationName === 'fadeInOut') {
                overlay.classList.remove('show-tooltip-animation');
            }
        });

        GM_addStyle(`
            /* Main Overlay Style */
            #token-counter-overlay {
                position: fixed; color: #ffffff; padding: 5px 10px; border-radius: 7px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                font-size: 12px; font-weight: 500; z-index: 9999; display: none;
                white-space: nowrap; transition: background-color 0.3s ease;
            }
            /* Tooltip Style */
            #token-counter-overlay:hover::after,
            #token-counter-overlay.show-tooltip-animation::after {
                content: attr(data-tooltip); position: absolute; background-color: #0c0505;
                border: 1px solid #513737; color: #f9fafb; padding: 10px 14px; border-radius: 6px;
                font-size: 12px; white-space: pre-wrap;
                width: 250px; text-align: left;
                pointer-events: none; z-index: 10000;
                opacity: 1;
            }
            #token-counter-overlay[data-position="top-right"]:hover::after,
            #token-counter-overlay.show-tooltip-animation[data-position="top-right"]::after { top: calc(100% + 5px); right: 0; }

            #token-counter-overlay[data-position="bottom-right"]:hover::after,
            #token-counter-overlay.show-tooltip-animation[data-position="bottom-right"]::after { bottom: calc(100% + 5px); right: 0; }

            /* --- Keyframe Animations --- */
            @keyframes fadeInOut {
              0%, 100% { opacity: 0; }
              5%, 80% { opacity: 1; }
            }
            @keyframes subtleGlow {
              0%, 100% { box-shadow: 0 0 4px rgba(255, 255, 255, 0.2); }
              50% { box-shadow: 0 0 12px 3px rgba(255, 255, 255, 0.6); }
            }
            /* --- Animation Trigger Classes --- */
            #token-counter-overlay.show-tooltip-animation::after {
                animation: fadeInOut 7s ease-in-out forwards;
            }
            #token-counter-overlay.glow-warning {
                animation: subtleGlow 1.5s ease-in-out;
            }
        `);
    }

    function updateOverlay() {
        if (!overlay) createOverlay();

        const displayTokens = totalClaudeTokens;
        const formattedTokens = formatTokenCount(displayTokens);

        if (displayTokens > 50) {
            let status = THRESHOLDS.red;
            if (displayTokens < THRESHOLDS.green.limit) status = THRESHOLDS.green;
            else if (displayTokens < THRESHOLDS.lime.limit) status = THRESHOLDS.lime;
            else if (displayTokens < THRESHOLDS.yellow.limit) status = THRESHOLDS.yellow;
            else if (displayTokens < THRESHOLDS.orange.limit) status = THRESHOLDS.orange;

            const newStatusKey = status.key;
            if (currentStatusKey && newStatusKey !== currentStatusKey) {
                const isWarningTransition = (newStatusKey === 'orange' && currentStatusKey === 'yellow') ||
                                            (newStatusKey === 'red' && currentStatusKey === 'orange');

                // [BUG FIX] Check for a warning transition AND ensure the cooldown period has passed.
                if (isWarningTransition && (Date.now() - lastGlowTimestamp > GLOW_COOLDOWN_MS)) {
                    // Update timestamp immediately to start the cooldown.
                    lastGlowTimestamp = Date.now();
                    overlay.classList.remove('show-tooltip-animation', 'glow-warning');
                    setTimeout(() => {
                        overlay.classList.add('show-tooltip-animation');
                        overlay.classList.add('glow-warning');
                    }, 50);
                }
            }
            currentStatusKey = newStatusKey;

            const formattedMin = formatForTooltip(totalBaseTokens);
            const formattedMax = formatForTooltip(totalClaudeTokens);
            const detailLine = `~${formattedMin}-${formattedMax} tokens in this conversation.`;
            const fullTooltip = `${detailLine}\n\n${status.tip}`;

            overlay.textContent = `${formattedTokens} tokens`;
            overlay.style.backgroundColor = status.color;
            overlay.setAttribute('data-tooltip', fullTooltip);
            overlay.style.display = 'block';
        } else {
            overlay.style.display = 'none';
            currentStatusKey = null;
        }
    }

    // --- Core Caching & Calculation Logic ---
    function recountAllTokens() {
        totalBaseTokens = 0;
        totalClaudeTokens = 0;

        const elements = [
            ...document.querySelectorAll('.message-text'),
            ...document.querySelectorAll('textarea.edit-textarea'),
            document.querySelector('textarea#message-input')
        ];

        elements.forEach(el => {
            if (!el) return;
            const text = el.tagName.toLowerCase() === 'textarea' ? el.value : el.innerText;
            const counts = getTokenCounts(text);
            totalBaseTokens += counts.base;
            totalClaudeTokens += counts.claude;
        });

        updateOverlay();
    }

    const debouncedRecount = debounce(recountAllTokens, SETTINGS.debounceDelay);

    // --- Mutation Observer ---
    function getCountableDescendants(nodeList) {
        const elements = [];
        nodeList.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.matches('.message-text, textarea.edit-textarea')) {
                    elements.push(node);
                }
                elements.push(...node.querySelectorAll('.message-text, textarea.edit-textarea'));
            }
        });
        return elements;
    }

    function handleMutations(mutations) {
        let hasRelevantChanges = false;
        let hasNewEditArea = false;

        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                const added = getCountableDescendants(mutation.addedNodes);
                const removed = getCountableDescendants(mutation.removedNodes);

                if (added.length > 0 || removed.length > 0) {
                    hasRelevantChanges = true;
                    if (added.some(el => el.matches('textarea.edit-textarea'))) {
                        hasNewEditArea = true;
                    }
                }
            }
        }

        if (hasRelevantChanges && !hasNewEditArea) {
            // Debounced call for general updates (new messages, deleted messages).
            debouncedRecount();
        }

        if (hasNewEditArea) {
            // A new edit textarea was added. The framework needs a moment to populate its value.
            // Schedule a non-debounced, corrective recount to fix the count accurately.
            setTimeout(recountAllTokens, 150);
        }
    }


    // --- Main Initialization ---
    function initialize() {
        if (DEBUG_MODE) console.log("Spicy Writer Token Counter: Initializing...");
        createOverlay();

        const chatContainer = document.querySelector('[role="log"]');
        const mainInput = document.querySelector('textarea#message-input');
        if(!chatContainer || !mainInput) {
            console.error("Spicy Writer Token Counter: Could not find critical elements.");
            return;
        }

        recountAllTokens();

        if (mainObserver) mainObserver.disconnect();
        mainObserver = new MutationObserver(handleMutations);
        mainObserver.observe(chatContainer, { childList: true, subtree: true });

		if (inputHandler) {
    		document.body.removeEventListener('input', inputHandler);
		}

		inputHandler = (event) => {
    		if (event.target.tagName.toLowerCase() === 'textarea' &&
        		(event.target.id === 'message-input' || event.target.classList.contains('edit-textarea'))) {
        		debouncedRecount();
    		}
		};
		document.body.addEventListener('input', inputHandler);
    }

    // --- Startup Logic ---
    function startup() {
        const chatContainer = document.querySelector('[role="log"]');
        if (chatContainer && document.querySelector('textarea#message-input')) {
            initialize();
        } else {
            const initialObserver = new MutationObserver(() => {
                const chatLog = document.querySelector('[role="log"]');
                const messageInput = document.querySelector('textarea#message-input');
                if (chatLog && messageInput) {
                    if (DEBUG_MODE) console.log("Spicy Writer Token Counter: Chat container found, initializing.");
                    initialize();
                    initialObserver.disconnect();
                }
            });
            initialObserver.observe(document.body, { childList: true, subtree: true });
        }
    }

    startup();

})();