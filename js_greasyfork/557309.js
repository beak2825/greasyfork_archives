// ==UserScript==
// @name         Google AI Studio | Conversation/Chat Markdown-Export/Download (XHR/DOM)
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      2.7
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Exports the full conversation to Markdown with collapsible thinking blocks. Supports dual extraction modes: XHR (instant, recommended) and DOM (scroll-based fallback).
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aistudio.google.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557309/Google%20AI%20Studio%20%7C%20ConversationChat%20Markdown-ExportDownload%20%28XHRDOM%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557309/Google%20AI%20Studio%20%7C%20ConversationChat%20Markdown-ExportDownload%20%28XHRDOM%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //================================================================================
    // GLOBAL STATE
    //================================================================================

    // XHR State
    let capturedChatData = null;
    let capturedTimestamp = 0;

    // DOM State
    let isScrolling = false;
    let collectedDOMData = new Map();
    let scrollCount = 0;
    let abortController = null;

    // UI State
    let downloadButton = null;
    let downloadIcon = null;
    let tooltipElement = null;
    let currentTooltipTarget = null;

    //================================================================================
    // CONFIGURATION
    //================================================================================
    const DEFAULT_CONFIG = {
        EXTRACTION_MODE: 'xhr',  // 'xhr' or 'dom'
        INCLUDE_USER: true,
        INCLUDE_MODEL: true,
        INCLUDE_THINKING: true,
        COLLAPSIBLE_THINKING: true,
        HINT_DISMISSED: false
    };

    let CONFIG = { ...DEFAULT_CONFIG };

    //================================================================================
    // DOM EXTRACTION CONSTANTS
    //================================================================================
    const SCROLL_DELAY_MS = 50;
    const RAW_MODE_RENDER_DELAY_MS = 300;
    const THOUGHT_EXPAND_DELAY_MS = 500;
    const THOUGHT_MIN_LENGTH = 10;
    const MAX_SCROLL_ATTEMPTS = 10000;
    const BOTTOM_DETECTION_TOLERANCE = 10;
    const MIN_SCROLL_DISTANCE_THRESHOLD = 5;
    const SCROLL_PARENT_SEARCH_DEPTH = 5;
    const FINAL_COLLECTION_DELAY_MS = 300;
    const UPWARD_SCROLL_DELAY_MS = 1000;
    const SCROLL_INCREMENT_INITIAL = 150;

    //================================================================================
    // SETTINGS STORAGE
    //================================================================================
    function loadSettings() {
        try {
            const saved = GM_getValue('aistudio_export_config', null);
            if (saved) {
                CONFIG = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
                log('Settings loaded from storage.', 'success');
            }
        } catch (e) {
            log(`Failed to load settings: ${e.message}`, 'error');
        }
    }

    function saveSettings() {
        try {
            GM_setValue('aistudio_export_config', JSON.stringify(CONFIG));
            log('Settings saved.', 'success');
        } catch (e) {
            log(`Failed to save settings: ${e.message}`, 'error');
        }
    }

    function log(msg, type = 'info') {
        const color = type === 'success' ? '#34a853' : type === 'error' ? '#ea4335' : type === 'warn' ? '#fbbc04' : '#e8eaed';
        console.log(`%c[AI Studio Export] ${msg}`, `color: ${color}; font-weight: bold;`);
    }

    //================================================================================
    // CORE XHR INTERCEPTOR
    //================================================================================
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener('load', function() {
            if (this._url && (
                this._url.includes('ResolveDriveResource') ||
                this._url.includes('CreatePrompt') ||
                this._url.includes('UpdatePrompt')
            )) {
                try {
                    const rawText = this.responseText.replace(/^\)\]\}'/, '').trim();
                    let json = JSON.parse(rawText);

                    if (Array.isArray(json) && json.length > 0) {
                        // Determine endpoint type for logging
                        let endpoint = 'ResolveDriveResource';
                        if (this._url.includes('CreatePrompt')) endpoint = 'CreatePrompt';
                        else if (this._url.includes('UpdatePrompt')) endpoint = 'UpdatePrompt';

                        // Normalize structure: ResolveDriveResource returns [[...]], others return [...]
                        // Wrap to [[...]] format so capturedChatData[0] always gives the prompt data
                        if (typeof json[0] === 'string' && json[0].startsWith('prompts/')) {
                            json = [json];
                        }

                        log(`${endpoint} intercepted. Size: ${rawText.length} chars.`, 'success');
                        capturedChatData = json;
                        capturedTimestamp = Date.now();
                    }
                } catch (err) {
                    log(`XHR interceptor error: ${err.message}`, 'error');
                }
            }
        });
        return originalSend.apply(this, arguments);
    };

    //================================================================================
    // XHR PARSING LOGIC
    //================================================================================

    function isTurn(arr) {
        if (!Array.isArray(arr)) return false;
        return arr.includes('user') || arr.includes('model');
    }

    function findHistoryRecursive(node, depth = 0) {
        if (depth > 4) return null;
        if (!Array.isArray(node)) return null;

        const firstFew = node.slice(0, 5);
        const childrenAreTurns = firstFew.some(child => isTurn(child));

        if (childrenAreTurns) {
            log(`Found history at depth ${depth}. Contains ${node.length} items.`, 'info');
            return node;
        }

        for (const child of node) {
            if (Array.isArray(child)) {
                const result = findHistoryRecursive(child, depth + 1);
                if (result) return result;
            }
        }
        return null;
    }

    function extractTextFromTurn(turn) {
        let candidates = [];

        function scan(item, d=0) {
            if (d > 3) return;
            if (typeof item === 'string' && item.length > 1) {
                if (!['user', 'model', 'function'].includes(item)) candidates.push(item);
            } else if (Array.isArray(item)) {
                item.forEach(sub => scan(sub, d+1));
            }
        }

        scan(turn.slice(0, 3));
        return candidates.sort((a, b) => b.length - a.length)[0] || "";
    }

    function isThinkingTurn(turn) {
        // Position 19 = 1 indicates a thinking/reasoning block
        return Array.isArray(turn) && turn.length > 19 && turn[19] === 1;
    }

    function isResponseTurn(turn) {
        // Position 16 = 1 indicates a regular response
        return Array.isArray(turn) && turn.length > 16 && turn[16] === 1;
    }

    //================================================================================
    // DOM EXTRACTION MODULE
    //================================================================================

    /**
     * Creates a delay/promise for asynchronous operations.
     */
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Detects whether the page is currently in Raw Mode or Rendered Mode.
     * Raw Mode shows plain markdown text in .very-large-text-container
     * Rendered Mode shows formatted content in ms-cmark-node elements
     */
    function detectCurrentMode() {
        const firstUserTurn = document.querySelector('ms-chat-turn .chat-turn-container.user');
        if (firstUserTurn) {
            const hasRawContainer = firstUserTurn.querySelector('ms-text-chunk .very-large-text-container');
            const hasCmarkNode = firstUserTurn.querySelector('ms-text-chunk ms-cmark-node');

            if (hasRawContainer && !hasCmarkNode) {
                log("Detected mode: Raw Mode", 'info');
                return 'raw';
            }
            if (hasCmarkNode && !hasRawContainer) {
                log("Detected mode: Rendered Mode", 'info');
                return 'rendered';
            }
        }

        log("Could not detect mode, assuming Rendered Mode", 'warn');
        return 'rendered';
    }

    /**
     * Automates the Raw Mode toggle functionality in Google AI Studio.
     * Uses synchronous click sequence to prevent menu from visually appearing.
     */
    async function toggleRawMode() {
        log("Attempting to toggle Raw Mode silently...");

        try {
            const moreButton = document.querySelector('button[aria-label="View more actions"]');
            if (!moreButton) {
                log("Error: 'More actions' button not found.", 'error');
                return false;
            }

            // Open menu + find Raw Mode + click — all synchronous = no visible menu flash
            moreButton.click();

            // Immediately query menu items (synchronous, no delay)
            const menuItems = document.querySelectorAll('.cdk-overlay-container .mat-mdc-menu-content button[role="menuitem"]');
            let rawModeClicked = false;

            for (const item of menuItems) {
                if (item.textContent.includes('Raw Mode')) {
                    item.click();
                    rawModeClicked = true;
                    log("Raw Mode toggled silently.", 'success');
                    break;
                }
            }

            if (!rawModeClicked) {
                // Close menu if Raw Mode not found
                document.body.click();
                log("Error: 'Raw Mode' button not found in menu.", 'error');
                return false;
            }

            // Wait for UI to re-render after mode switch
            await delay(RAW_MODE_RENDER_DELAY_MS);
            return true;

        } catch (error) {
            log(`Error toggling Raw Mode: ${error.message}`, 'error');
            return false;
        }
    }

    /**
     * Identifies and returns the main scrollable element for AI Studio conversations.
     */
    function getScrollContainer() {
        log("Searching for scroll container...");

        let scroller = document.querySelector('ms-autoscroll-container');
        if (scroller) {
            log("Found scroll container (ms-autoscroll-container)", 'success');
            return scroller;
        }

        const chatTurnsContainer = document.querySelector('ms-chat-turn')?.parentElement;
        if (chatTurnsContainer) {
            let parent = chatTurnsContainer;
            for (let i = 0; i < SCROLL_PARENT_SEARCH_DEPTH && parent; i++) {
                if (parent.scrollHeight > parent.clientHeight + BOTTOM_DETECTION_TOLERANCE &&
                    (window.getComputedStyle(parent).overflowY === 'auto' ||
                     window.getComputedStyle(parent).overflowY === 'scroll')) {
                    log("Found scroll container (parent search)", 'success');
                    return parent;
                }
                parent = parent.parentElement;
            }
        }

        log("Warning: Using document.documentElement as fallback", 'warn');
        return document.documentElement;
    }

    /**
     * Expands collapsed AI thinking sections to expose hidden content.
     */
    async function expandThinkingSections(modelDiv, turnIndex = 0) {
        let expanded = false;

        try {
            const collapsedPanels = modelDiv.querySelectorAll('mat-expansion-panel[aria-expanded="false"]');
            for (const panel of collapsedPanels) {
                const headerText = panel.querySelector('.mat-expansion-panel-header-title')?.textContent?.toLowerCase() || '';
                const buttonText = panel.querySelector('button[aria-expanded="false"]')?.textContent?.toLowerCase() || '';

                if (headerText.includes('thought') || headerText.includes('thinking') ||
                    buttonText.includes('thought') || buttonText.includes('thinking')) {
                    const expandButton = panel.querySelector('button[aria-expanded="false"]');
                    if (expandButton) {
                        expandButton.click();
                        expanded = true;
                        log(`Expanded thinking section for turn ${turnIndex}`, 'info');
                    }
                }
            }

            const thoughtChunks = modelDiv.querySelectorAll('ms-thought-chunk');
            for (const chunk of thoughtChunks) {
                const showMoreButton = chunk.querySelector('button[aria-expanded="false"], button:not([aria-expanded])');
                if (showMoreButton && showMoreButton.textContent?.toLowerCase().includes('more')) {
                    showMoreButton.click();
                    expanded = true;
                    log(`Expanded thinking chunk for turn ${turnIndex}`, 'info');
                }
            }

            if (expanded) {
                await delay(THOUGHT_EXPAND_DELAY_MS);
            }

            return expanded;
        } catch (error) {
            log(`Error expanding thinking sections for turn ${turnIndex}: ${error.message}`, 'warn');
            return false;
        }
    }

    /**
     * Extracts data from all visible chat turns in the current AI Studio conversation.
     * Always uses Raw Mode selectors since we switch to Raw Mode before extraction.
     */
    async function extractDOMDataIncremental() {
        let newlyFoundCount = 0;
        let dataUpdatedInExistingTurn = false;
        const currentTurns = document.querySelectorAll('ms-chat-turn');

        for (const [index, turn] of currentTurns.entries()) {
            const turnKey = turn;
            const turnContainer = turn.querySelector('.chat-turn-container.user, .chat-turn-container.model');
            if (!turnContainer) continue;

            let isNewTurn = !collectedDOMData.has(turnKey);
            let extractedInfo = collectedDOMData.get(turnKey) || {
                type: 'unknown',
                userText: null,
                thoughtText: null,
                responseText: null
            };

            if (isNewTurn) {
                collectedDOMData.set(turnKey, extractedInfo);
                newlyFoundCount++;
            }

            let dataWasUpdatedThisTime = false;

            if (turnContainer.classList.contains('user')) {
                if (extractedInfo.type === 'unknown') extractedInfo.type = 'user';
                if (!extractedInfo.userText) {
                    // Raw Mode selector
                    const rawContainer = turn.querySelector('ms-text-chunk .very-large-text-container');
                    if (rawContainer) {
                        extractedInfo.userText = rawContainer.textContent.trim();
                        dataWasUpdatedThisTime = true;
                        log(`Extracted user text from turn ${index}: "${extractedInfo.userText.substring(0, 50)}..."`);
                    }
                }
            } else if (turnContainer.classList.contains('model')) {
                if (extractedInfo.type === 'unknown') extractedInfo.type = 'model';

                await expandThinkingSections(turn, index);

                // Extract AI thinking output (Raw Mode selector)
                if (!extractedInfo.thoughtText) {
                    const rawThought = turn.querySelector('ms-thought-chunk .very-large-text-container');
                    if (rawThought) {
                        const thoughtText = rawThought.textContent.trim();
                        if (thoughtText && thoughtText.length >= THOUGHT_MIN_LENGTH) {
                            extractedInfo.thoughtText = thoughtText;
                            dataWasUpdatedThisTime = true;
                            log(`Extracted AI thinking from turn ${index}: "${thoughtText.substring(0, 50)}..."`);
                        }
                    }
                }

                // Extract AI response (Raw Mode selector)
                if (!extractedInfo.responseText) {
                    const responseChunks = Array.from(turn.querySelectorAll('.turn-content > ms-prompt-chunk'));
                    const responseTexts = responseChunks
                        .filter(chunk => !chunk.querySelector('ms-thought-chunk'))
                        .map(chunk => {
                            const rawContainer = chunk.querySelector('ms-text-chunk .very-large-text-container');
                            if (rawContainer) {
                                return rawContainer.textContent.trim();
                            }
                            return chunk.innerText.trim();
                        })
                        .filter(text => text);

                    if (responseTexts.length > 0) {
                        extractedInfo.responseText = responseTexts.join('\n\n');
                        dataWasUpdatedThisTime = true;
                        log(`Extracted AI response from turn ${index} with ${responseTexts.length} chunks`);
                    } else if (!extractedInfo.thoughtText) {
                        const turnContent = turn.querySelector('.turn-content');
                        if (turnContent) {
                            extractedInfo.responseText = turnContent.innerText.trim();
                            dataWasUpdatedThisTime = true;
                            log(`Extracted AI response from turn ${index} using fallback`);
                        }
                    }
                }

                // Set turn type
                if (dataWasUpdatedThisTime) {
                    if (extractedInfo.thoughtText && extractedInfo.responseText) extractedInfo.type = 'model_thought_reply';
                    else if (extractedInfo.responseText) extractedInfo.type = 'model_reply';
                    else if (extractedInfo.thoughtText) extractedInfo.type = 'model_thought';
                }
            }

            if (dataWasUpdatedThisTime) {
                collectedDOMData.set(turnKey, extractedInfo);
                dataUpdatedInExistingTurn = true;
            }
        }

        return newlyFoundCount > 0 || dataUpdatedInExistingTurn;
    }

    /**
     * Preloads conversation history by repeatedly scrolling to the top.
     */
    async function preloadHistory(scroller) {
        log("Preloading history by scrolling to top...");
        let lastHeight = 0;
        const isWindowScroller = (scroller === document.documentElement || scroller === document.body);
        const getScrollHeight = () => isWindowScroller ? document.documentElement.scrollHeight : scroller.scrollHeight;

        for (let i = 0; i < 5; i++) {
            if (isWindowScroller) { window.scrollTo({ top: 0, behavior: 'instant' }); }
            else { scroller.scrollTo({ top: 0, behavior: 'instant' }); }

            await delay(UPWARD_SCROLL_DELAY_MS);

            const newHeight = getScrollHeight();
            if (newHeight <= lastHeight + MIN_SCROLL_DISTANCE_THRESHOLD) {
                log(`History preloading stable at height: ${newHeight}px`, 'success');
                break;
            }
            lastHeight = newHeight;
            log(`Preloading... scrollHeight grew to ${newHeight}px`);
        }

        log("Preloading complete, starting capture from the top.");
    }

    /**
     * Performs high-speed auto-scrolling through AI Studio conversations to capture all content.
     */
    async function autoScrollAndCapture() {
        log("Starting auto-scroll...");
        isScrolling = true;
        collectedDOMData.clear();
        scrollCount = 0;

        const scroller = getScrollContainer();
        log(`Using scroll element: ${scroller.tagName}.${scroller.className.split(' ').join('.')}`);

        const isWindowScroller = (scroller === document.documentElement || scroller === document.body);

        // Artificial tiny upward scroll to initiate
        if (isWindowScroller) { window.scrollBy(0, -10); }
        else { scroller.scrollTop -= 10; }
        await delay(100);

        await preloadHistory(scroller);

        log(`Starting incremental scroll (up to ${MAX_SCROLL_ATTEMPTS} attempts)...`);
        let reachedEnd = false;
        const scrollIncrement = SCROLL_INCREMENT_INITIAL;

        // Initial collection
        await extractDOMDataIncremental();
        log(`Initial collection: ${collectedDOMData.size} messages`);

        while (scrollCount < MAX_SCROLL_ATTEMPTS && !reachedEnd && isScrolling) {
            if (abortController && abortController.signal.aborted) {
                log('Scroll aborted by user.', 'warn');
                isScrolling = false;
                break;
            }

            const currentTop = scroller.scrollTop;
            const clientHeight = scroller.clientHeight;
            const scrollHeight = scroller.scrollHeight;

            // End detection
            if (scrollCount > 0 && currentTop + clientHeight >= scrollHeight - BOTTOM_DETECTION_TOLERANCE) {
                log("Reached bottom of conversation", 'success');
                reachedEnd = true;
                break;
            }

            // Calculate next scroll position
            let intendedScrollTarget = currentTop + scrollIncrement;
            const maxPossibleScrollTop = scrollHeight - clientHeight;
            if (intendedScrollTarget > maxPossibleScrollTop) {
                intendedScrollTarget = maxPossibleScrollTop;
            }

            scroller.scrollTop = intendedScrollTarget;
            scrollCount++;

            await delay(SCROLL_DELAY_MS);

            const effectiveScrollTop = scroller.scrollTop;
            const actualScrolledDistance = effectiveScrollTop - currentTop;

            if (actualScrolledDistance < MIN_SCROLL_DISTANCE_THRESHOLD && scrollCount > 1) {
                log("Scroll effectively stopped, assuming end of conversation", 'success');
                reachedEnd = true;
                break;
            }

            await extractDOMDataIncremental();

            // Update tooltip with progress (throttled)
            if (scrollCount % 20 === 0) {
                updateDOMProgressTooltip();
            }

            log(`Scroll ${scrollCount}/${MAX_SCROLL_ATTEMPTS}... Found ${collectedDOMData.size} messages`);
        }

        if (scrollCount >= MAX_SCROLL_ATTEMPTS) {
            log(`Reached maximum scroll attempts limit (${MAX_SCROLL_ATTEMPTS}).`, 'warn');
        } else if (reachedEnd) {
            log(`Scroll completed after ${scrollCount} attempts.`, 'success');
        }

        // Final collection passes
        log("Performing final collection passes...");

        scroller.scrollTop = 0;
        await delay(FINAL_COLLECTION_DELAY_MS);
        await extractDOMDataIncremental();

        scroller.scrollTop = scroller.scrollHeight / 2;
        await delay(FINAL_COLLECTION_DELAY_MS);
        await extractDOMDataIncremental();

        scroller.scrollTop = scroller.scrollHeight;
        await delay(FINAL_COLLECTION_DELAY_MS);
        await extractDOMDataIncremental();

        log(`Final data collection complete. Total records: ${collectedDOMData.size}`, 'success');
        isScrolling = false;
        return !abortController?.signal.aborted;
    }

    /**
     * Updates the tooltip during DOM extraction to show progress.
     */
    function updateDOMProgressTooltip() {
        if (tooltipElement && downloadButton) {
            tooltipElement.textContent = `Extracting conversation...\nFound: ${collectedDOMData.size} messages\nClick to abort`;
        }
    }

    //================================================================================
    // SHARED MARKDOWN GENERATION
    //================================================================================

    /**
     * Generates markdown from XHR data (normalized turn arrays).
     */
    function generateMarkdownFromXHR(historyArray, title) {
        let mdContent = `# ${title}\n\n`;
        let pendingThinking = [];

        historyArray.forEach((turn) => {
            const isUser = turn.includes('user');
            const isModel = turn.includes('model');

            if (isUser) {
                if (CONFIG.INCLUDE_USER) {
                    let text = extractTextFromTurn(turn);
                    if (text) {
                        mdContent += `### **USER**\n\n${text}\n\n---\n\n`;
                    }
                }
                pendingThinking = [];
            } else if (isModel) {
                const thinking = isThinkingTurn(turn);
                const response = isResponseTurn(turn);

                if (thinking && !response) {
                    if (CONFIG.INCLUDE_THINKING) {
                        let thinkingText = extractTextFromTurn(turn);
                        if (thinkingText) {
                            pendingThinking.push(thinkingText);
                        }
                    }
                } else if (CONFIG.INCLUDE_MODEL) {
                    let text = extractTextFromTurn(turn);

                    mdContent += `### **MODEL**\n\n`;

                    if (CONFIG.INCLUDE_THINKING && pendingThinking.length > 0) {
                        const thinkingContent = pendingThinking.join('\n\n').trim();
                        const cleanedContent = thinkingContent
                            .replace(/(\n\s*)+$/g, '')
                            .replace(/\n{3,}/g, '\n\n');
                        const quoted = cleanedContent.replace(/\n/g, '\n> ');

                        if (CONFIG.COLLAPSIBLE_THINKING) {
                            mdContent += `<details>\n<summary><strong>Thinking</strong></summary>\n\n> ${quoted}\n\n</details>\n\n`;
                        } else {
                            mdContent += `> **Thinking:**\n>\n> ${quoted}\n\n`;
                        }
                        pendingThinking = [];
                    }

                    if (text) {
                        mdContent += `${text}\n\n`;
                    }

                    mdContent += `---\n\n`;
                } else {
                    pendingThinking = [];
                }
            }
        });

        return mdContent;
    }

    /**
     * Generates markdown from DOM data (collected Map).
     * Uses buffering approach to merge thinking with subsequent response (like XHR).
     */
    function generateMarkdownFromDOM(title) {
        const finalTurnsInDom = document.querySelectorAll('ms-chat-turn');
        let sortedData = [];

        finalTurnsInDom.forEach(turnNode => {
            if (collectedDOMData.has(turnNode)) {
                sortedData.push(collectedDOMData.get(turnNode));
            }
        });

        log(`Generating markdown from ${sortedData.length} DOM records`);

        if (sortedData.length === 0) {
            return null;
        }

        let mdContent = `# ${title}\n\n`;
        let pendingThinking = [];

        sortedData.forEach(item => {
            if (item.type === 'user') {
                if (CONFIG.INCLUDE_USER && item.userText) {
                    mdContent += `### **USER**\n\n${item.userText}\n\n---\n\n`;
                }
                pendingThinking = []; // Clear pending thinking on user turn
            } else if (item.type === 'model_thought') {
                // Thinking-only turn, buffer it for the next response
                if (CONFIG.INCLUDE_THINKING && item.thoughtText) {
                    pendingThinking.push(item.thoughtText);
                }
            } else if (item.type === 'model_reply' || item.type === 'model_thought_reply') {
                // Response turn (may or may not have inline thinking)
                if (CONFIG.INCLUDE_MODEL) {
                    mdContent += `### **MODEL**\n\n`;

                    // First add any buffered thinking from previous model_thought turns
                    if (CONFIG.INCLUDE_THINKING && pendingThinking.length > 0) {
                        const thinkingContent = pendingThinking.join('\n\n').trim();
                        const cleanedContent = thinkingContent
                            .replace(/(\n\s*)+$/g, '')
                            .replace(/\n{3,}/g, '\n\n');
                        const quoted = cleanedContent.replace(/\n/g, '\n> ');

                        if (CONFIG.COLLAPSIBLE_THINKING) {
                            mdContent += `<details>\n<summary><strong>Thinking</strong></summary>\n\n> ${quoted}\n\n</details>\n\n`;
                        } else {
                            mdContent += `> **Thinking:**\n>\n> ${quoted}\n\n`;
                        }
                        pendingThinking = [];
                    }

                    // Then add inline thinking if this turn has it (model_thought_reply)
                    // and we didn't just output buffered thinking
                    if (CONFIG.INCLUDE_THINKING && item.thoughtText && item.type === 'model_thought_reply') {
                        const cleanedContent = item.thoughtText
                            .replace(/(\n\s*)+$/g, '')
                            .replace(/\n{3,}/g, '\n\n');
                        const quoted = cleanedContent.replace(/\n/g, '\n> ');

                        if (CONFIG.COLLAPSIBLE_THINKING) {
                            mdContent += `<details>\n<summary><strong>Thinking</strong></summary>\n\n> ${quoted}\n\n</details>\n\n`;
                        } else {
                            mdContent += `> **Thinking:**\n>\n> ${quoted}\n\n`;
                        }
                    }

                    if (item.responseText) {
                        mdContent += `${item.responseText}\n\n`;
                    }

                    mdContent += `---\n\n`;
                } else {
                    pendingThinking = []; // Clear if model responses disabled
                }
            }
        });

        return mdContent;
    }

    //================================================================================
    // DOWNLOAD ORCHESTRATION
    //================================================================================

    /**
     * Triggers file download with given content and filename.
     */
    function triggerDownload(content, filename) {
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Process and download using XHR method (instant).
     */
    function processAndDownloadXHR() {
        if (!capturedChatData) {
            log('No data available. Nothing to download.', 'error');
            updateButtonState('ERROR');
            return;
        }

        try {
            const root = capturedChatData[0];

            let title = `AI_Studio_Export_${new Date().toISOString().slice(0,10)}`;
            if (Array.isArray(root[4]) && typeof root[4][0] === 'string') title = root[4][0];

            const safeFilename = title.replace(/[<>:"/\\|?*]/g, '_').trim().substring(0, 100) + ".md";

            const historyArray = findHistoryRecursive(root);

            if (!historyArray) {
                log("Recursive search failed.", 'warn');
                throw new Error("Could not locate chat history in XHR response.");
            }

            const mdContent = generateMarkdownFromXHR(historyArray, title);

            triggerDownload(mdContent, safeFilename);
            updateButtonState('SUCCESS');

        } catch (e) {
            log(`Parsing failed: ${e.message}`, 'error');
            updateButtonState('ERROR');
        }
    }

    /**
     * Process and download using DOM method (scroll-based).
     */
    async function processAndDownloadDOM() {
        abortController = new AbortController();
        updateButtonState('WORKING');

        const originalMode = detectCurrentMode();
        let modeWasToggled = false;

        try {
            // Switch to Raw Mode if needed
            if (originalMode !== 'raw') {
                log("Switching to Raw Mode for extraction...");
                modeWasToggled = await toggleRawMode();
                if (!modeWasToggled) {
                    log("Failed to switch to Raw Mode, continuing anyway...", 'warn');
                }
            } else {
                log("Already in Raw Mode, no toggle needed.");
            }

            if (abortController.signal.aborted) throw new Error("Aborted");

            // Scroll and capture
            const scrollSuccess = await autoScrollAndCapture();

            if (abortController.signal.aborted) {
                log('Extraction aborted by user. Discarding data.', 'warn');
                throw new Error("Aborted");
            }

            if (!scrollSuccess) {
                throw new Error("Scroll extraction failed.");
            }

            // Generate markdown
            let title = `AI_Studio_Export_${new Date().toISOString().slice(0,10)}`;

            // Try to get title from page toolbar
            const titleElement = document.querySelector('ms-toolbar .page-title h1.mode-title');
            if (titleElement && titleElement.textContent.trim()) {
                title = titleElement.textContent.trim();
            }

            const safeFilename = title.replace(/[<>:"/\\|?*]/g, '_').trim().substring(0, 100) + ".md";

            const mdContent = generateMarkdownFromDOM(title);

            if (!mdContent) {
                throw new Error("No content extracted from DOM.");
            }

            triggerDownload(mdContent, safeFilename);
            updateButtonState('SUCCESS');

        } catch (error) {
            if (error.message !== "Aborted") {
                log(`DOM extraction error: ${error.message}`, 'error');
                updateButtonState('ERROR');
            } else {
                updateButtonState('IDLE');
            }
        } finally {
            // Restore original mode
            if (modeWasToggled) {
                log("Restoring original mode...");
                await toggleRawMode();
            }
            isScrolling = false;
            hideTooltip();
        }
    }

    /**
     * Main download handler - branches by extraction mode.
     */
    function processAndDownload() {
        if (CONFIG.EXTRACTION_MODE === 'xhr') {
            processAndDownloadXHR();
        } else {
            processAndDownloadDOM();
        }
    }

    /**
     * Abort DOM extraction if in progress.
     */
    function abortDOMExtraction() {
        if (abortController) {
            abortController.abort();
        }
        isScrolling = false;
        log('Extraction aborted by user.', 'warn');
        updateButtonState('IDLE');
    }

    //================================================================================
    // STYLES & CONSTANTS
    //================================================================================
    const Z_INDEX = 2147483647;

    const PANEL_STYLES = `
        :host {
            all: initial;
        }

        * {
            box-sizing: border-box;
        }

        .settings-panel {
            position: fixed;
            background: #2d2e30;
            border: 1px solid #5f6368;
            border-radius: 8px;
            padding: 12px 16px;
            padding-top: 28px;
            font-family: 'Google Sans', Roboto, sans-serif;
            font-size: 13px;
            color: #e8eaed;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
            min-width: 220px;
            user-select: none;
            pointer-events: auto;
        }

        .settings-panel .close-button {
            position: absolute;
            top: 6px;
            right: 6px;
            width: 20px;
            height: 20px;
            border: none;
            background: transparent;
            color: #9aa0a6;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            padding: 0;
            line-height: 1;
        }

        .settings-panel .close-button:hover {
            background: #5f6368;
            color: #e8eaed;
        }

        .settings-panel label {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 6px 0;
            cursor: pointer;
            user-select: none;
        }

        .settings-panel label:hover {
            color: #8ab4f8;
        }

        .settings-panel input[type="checkbox"] {
            width: 16px;
            height: 16px;
            cursor: pointer;
            accent-color: #8ab4f8;
        }

        .settings-panel .section-title {
            font-size: 11px;
            color: #9aa0a6;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid #5f6368;
        }

        .settings-panel .sub-option {
            padding-left: 26px;
            font-size: 12px;
            color: #bdc1c6;
        }

        .settings-panel .separator {
            height: 1px;
            background: #5f6368;
            margin: 12px 0;
        }

        .settings-panel .toggle-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 8px 0 4px 0;
        }

        .settings-panel .toggle-label {
            font-size: 12px;
            color: #9aa0a6;
            font-weight: 500;
            transition: color 0.2s ease;
            cursor: pointer;
        }

        .settings-panel .toggle-label.active {
            color: #8ab4f8;
            font-weight: 600;
        }

        .settings-panel .toggle-switch {
            position: relative;
            width: 44px;
            height: 22px;
            background: #5f6368;
            border-radius: 11px;
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .settings-panel .toggle-switch::after {
            content: '';
            position: absolute;
            top: 3px;
            left: 3px;
            width: 16px;
            height: 16px;
            background: #e8eaed;
            border-radius: 50%;
            transition: transform 0.2s ease;
        }

        .settings-panel .toggle-switch.dom::after {
            transform: translateX(22px);
        }

        .settings-panel .toggle-switch:hover {
            background: #6f7378;
        }
    `;

    GM_addStyle(`
        /* Custom tooltip - Material Design style */
        #aistudio-export-tooltip {
            position: fixed;
            background: #303134;
            border: 1px solid #5f6368;
            border-radius: 4px;
            padding: 6px 10px;
            font-family: 'Google Sans', Roboto, sans-serif;
            font-size: 11px;
            font-weight: 500;
            color: #e8eaed;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            z-index: ${Z_INDEX};
            pointer-events: none;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.1s ease, visibility 0.1s ease;
            white-space: pre-line;
            text-align: center;
            line-height: 1.4;
            max-width: 250px;
        }

        #aistudio-export-tooltip.visible {
            opacity: 1;
            visibility: visible;
        }

        /* Tooltip arrow positioning */
        #aistudio-export-tooltip::before,
        #aistudio-export-tooltip::after {
            content: '';
            position: absolute;
            left: var(--tooltip-arrow-left, 50%);
            transform: translateX(-50%);
            width: 0;
            height: 0;
        }

        /* Tooltip ABOVE button -> arrow points DOWN */
        #aistudio-export-tooltip.pos-top::before {
            bottom: -6px;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid #5f6368;
        }
        #aistudio-export-tooltip.pos-top::after {
            bottom: -5px;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid #303134;
        }

        /* Tooltip BELOW button -> arrow points UP */
        #aistudio-export-tooltip.pos-bottom::before {
            top: -6px;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 6px solid #5f6368;
        }
        #aistudio-export-tooltip.pos-bottom::after {
            top: -5px;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 5px solid #303134;
        }

        #aistudio-export-hint {
            position: fixed;
            background: #1a73e8;
            color: #fff;
            padding: 12px 16px;
            border-radius: 8px;
            font-family: 'Google Sans', Roboto, sans-serif;
            font-size: 13px;
            z-index: ${Z_INDEX - 1};
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            line-height: 1.5;
            max-width: 280px;
            animation: hintSlideIn 0.3s ease-out;
        }

        @keyframes hintSlideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        #aistudio-export-hint::before {
            content: '';
            position: absolute;
            top: -8px;
            right: 16px;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid #1a73e8;
        }

        #aistudio-export-hint .hint-title {
            font-weight: 600;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        #aistudio-export-hint .hint-text {
            margin-bottom: 12px;
            opacity: 0.95;
        }

        #aistudio-export-hint .hint-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }

        #aistudio-export-hint .hint-checkbox-label {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            opacity: 0.85;
            cursor: pointer;
            user-select: none;
        }

        #aistudio-export-hint .hint-checkbox-label input {
            cursor: pointer;
            accent-color: #fff;
            width: 14px;
            height: 14px;
        }

        #aistudio-export-hint .hint-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: #fff;
            padding: 6px 14px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
        }

        #aistudio-export-hint .hint-close:hover {
            background: rgba(255,255,255,0.3);
        }
    `);

    //================================================================================
    // TOOLTIP
    //================================================================================
    function getTooltipElement() {
        if (tooltipElement && document.body.contains(tooltipElement)) {
            return tooltipElement;
        }
        tooltipElement = document.createElement('div');
        tooltipElement.id = 'aistudio-export-tooltip';
        document.body.appendChild(tooltipElement);
        return tooltipElement;
    }

    function positionAndShowTooltip(targetElement, message) {
        const tooltip = getTooltipElement();
        tooltip.textContent = message;
        currentTooltipTarget = targetElement;

        tooltip.classList.remove('pos-top', 'pos-bottom', 'visible');

        const btnRect = targetElement.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;

        // Reset display to measure dimensions
        tooltip.style.display = 'block';
        tooltip.style.visibility = 'hidden';

        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;

        const MARGIN = 8;
        const GAP = 12;

        // Calculate horizontal position (centered on button)
        let left = btnCenterX - (tooltipWidth / 2);
        left = Math.max(MARGIN, Math.min(window.innerWidth - tooltipWidth - MARGIN, left));

        // Calculate vertical position (prefer above)
        const topCandidate = btnRect.top - tooltipHeight - GAP;
        const bottomCandidate = btnRect.bottom + GAP;

        let top;
        let placement;

        if (topCandidate >= MARGIN) {
            top = topCandidate;
            placement = 'pos-top';
        } else {
            top = bottomCandidate;
            placement = 'pos-bottom';
        }

        tooltip.classList.add(placement);

        // Arrow positioning
        const arrowX = btnCenterX - left;
        const arrowClamped = Math.max(10, Math.min(tooltipWidth - 10, arrowX));
        tooltip.style.setProperty('--tooltip-arrow-left', `${arrowClamped}px`);

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;

        tooltip.style.visibility = '';
        tooltip.offsetHeight; // Force reflow
        tooltip.classList.add('visible');
    }

    function showTooltip(targetElement, customText = null) {
        if (currentTooltipTarget && currentTooltipTarget !== targetElement) {
            hideTooltip();
        }

        const message = customText || 'Left-click: Export to Markdown\nRight-click: Export settings';
        positionAndShowTooltip(targetElement, message);
    }

    function hideTooltip(owner = null) {
        if (owner && currentTooltipTarget && owner !== currentTooltipTarget) return;

        if (tooltipElement) {
            tooltipElement.classList.remove('visible');
        }
        currentTooltipTarget = null;
    }

    //================================================================================
    // SETTINGS PANEL (Shadow DOM Isolated)
    //================================================================================
    const SettingsPanel = {
        shadowHost: null,
        shadowRoot: null,
        panel: null,
        isOpen: false,
        checkboxRefs: {},
        toggleSwitch: null,
        toggleLabelXHR: null,
        toggleLabelDOM: null,
        closeHandler: null,
        escapeHandler: null,

        init() {
            if (this.shadowHost) return;

            this.shadowHost = document.createElement('div');
            this.shadowHost.id = 'aistudio-export-settings-host';
            Object.assign(this.shadowHost.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '0',
                height: '0',
                overflow: 'visible',
                zIndex: Z_INDEX.toString(),
                pointerEvents: 'none'
            });

            this.shadowRoot = this.shadowHost.attachShadow({ mode: 'closed' });

            const style = document.createElement('style');
            style.textContent = PANEL_STYLES;
            this.shadowRoot.appendChild(style);

            this.panel = document.createElement('div');
            this.panel.className = 'settings-panel';
            this.panel.style.display = 'none';

            // Close button
            const closeButton = document.createElement('button');
            closeButton.className = 'close-button';
            closeButton.textContent = '✕';
            closeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hide();
            });
            this.panel.appendChild(closeButton);

            // Export Options Title
            const title = document.createElement('div');
            title.className = 'section-title';
            title.textContent = 'Export Options';
            this.panel.appendChild(title);

            const createCheckbox = (id, label, configKey, isSubOption = false) => {
                const wrapper = document.createElement('label');
                if (isSubOption) wrapper.classList.add('sub-option');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = id;
                checkbox.checked = CONFIG[configKey];

                checkbox.addEventListener('change', (e) => {
                    e.stopPropagation();
                    CONFIG[configKey] = checkbox.checked;
                    saveSettings();
                    this.updateCheckboxStates();
                });

                const text = document.createTextNode(label);
                wrapper.appendChild(checkbox);
                wrapper.appendChild(text);

                return { wrapper, checkbox };
            };

            const userCheck = createCheckbox('exp-user', 'Include User Messages', 'INCLUDE_USER');
            const modelCheck = createCheckbox('exp-model', 'Include Model Responses', 'INCLUDE_MODEL');
            const thinkingCheck = createCheckbox('exp-thinking', 'Include Thinking', 'INCLUDE_THINKING', true);
            const collapsibleCheck = createCheckbox('exp-collapsible', 'Collapsible Thinking', 'COLLAPSIBLE_THINKING', true);

            this.checkboxRefs = { userCheck, modelCheck, thinkingCheck, collapsibleCheck };

            this.panel.appendChild(userCheck.wrapper);
            this.panel.appendChild(modelCheck.wrapper);
            this.panel.appendChild(thinkingCheck.wrapper);
            this.panel.appendChild(collapsibleCheck.wrapper);

            // Separator
            const separator = document.createElement('div');
            separator.className = 'separator';
            this.panel.appendChild(separator);

            // Extraction Method Title
            const methodTitle = document.createElement('div');
            methodTitle.className = 'section-title';
            methodTitle.textContent = 'Extraction Method';
            this.panel.appendChild(methodTitle);

            // Toggle Container
            const toggleContainer = document.createElement('div');
            toggleContainer.className = 'toggle-container';

            // XHR Label
            this.toggleLabelXHR = document.createElement('span');
            this.toggleLabelXHR.className = 'toggle-label';
            this.toggleLabelXHR.textContent = 'XHR';
            this.toggleLabelXHR.addEventListener('click', () => this.setExtractionMode('xhr'));

            // Toggle Switch
            this.toggleSwitch = document.createElement('div');
            this.toggleSwitch.className = 'toggle-switch';
            this.toggleSwitch.addEventListener('click', () => {
                const newMode = CONFIG.EXTRACTION_MODE === 'xhr' ? 'dom' : 'xhr';
                this.setExtractionMode(newMode);
            });

            // DOM Label
            this.toggleLabelDOM = document.createElement('span');
            this.toggleLabelDOM.className = 'toggle-label';
            this.toggleLabelDOM.textContent = 'DOM';
            this.toggleLabelDOM.addEventListener('click', () => this.setExtractionMode('dom'));

            toggleContainer.appendChild(this.toggleLabelXHR);
            toggleContainer.appendChild(this.toggleSwitch);
            toggleContainer.appendChild(this.toggleLabelDOM);

            this.panel.appendChild(toggleContainer);

            // Toggle tooltip on hover
            let toggleTooltipTimeout = null;
            let toggleTooltipElement = null;

            const showToggleTooltip = () => {
                toggleTooltipTimeout = setTimeout(() => {
                    toggleTooltipElement = document.createElement('div');
                    toggleTooltipElement.style.cssText = `
                        position: fixed;
                        background: #3c4043;
                        color: #e8eaed;
                        padding: 8px 12px;
                        border-radius: 4px;
                        font-family: 'Google Sans', Roboto, sans-serif;
                        font-size: 11px;
                        z-index: ${Z_INDEX + 1};
                        pointer-events: none;
                        white-space: pre;
                        width: max-content;
                        max-width: calc(100vw - 24px);
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        line-height: 1.4;
                    `;
                    toggleTooltipElement.textContent = 'XHR: Instant capture via network (recommended)\nDOM: Scrolls through UI to extract (fallback)';

                    this.shadowRoot.appendChild(toggleTooltipElement);

                    const rect = toggleContainer.getBoundingClientRect();
                    const tooltipRect = toggleTooltipElement.getBoundingClientRect();

                    // Horizontal centering
                    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                    if (left < 8) left = 8;
                    if (left + tooltipRect.width > window.innerWidth - 8) {
                        left = window.innerWidth - tooltipRect.width - 8;
                    }

                    // Prefer above if there's room, otherwise below
                    let top;
                    const spaceAbove = rect.top - 8;
                    const spaceBelow = window.innerHeight - rect.bottom - 8;

                    if (spaceAbove >= tooltipRect.height + 8) {
                        // Position above
                        top = rect.top - tooltipRect.height - 8;
                    } else if (spaceBelow >= tooltipRect.height + 16) {
                        // Position below with cursor offset
                        top = rect.bottom + 16;
                    } else {
                        // Default to above even if tight
                        top = rect.top - tooltipRect.height - 8;
                    }

                    toggleTooltipElement.style.left = `${left}px`;
                    toggleTooltipElement.style.top = `${top}px`;
                }, 1000);
            };

            const hideToggleTooltip = () => {
                if (toggleTooltipTimeout) {
                    clearTimeout(toggleTooltipTimeout);
                    toggleTooltipTimeout = null;
                }
                if (toggleTooltipElement) {
                    toggleTooltipElement.remove();
                    toggleTooltipElement = null;
                }
            };

            toggleContainer.addEventListener('mouseenter', showToggleTooltip);
            toggleContainer.addEventListener('mouseleave', hideToggleTooltip);

            this.shadowRoot.appendChild(this.panel);
            document.body.appendChild(this.shadowHost);

            // Block events from propagating through the panel (bubble phase, not capture)
            // This prevents outside-click detection from closing the panel when clicking inside
            this.panel.addEventListener('mousedown', (e) => e.stopPropagation());
            this.panel.addEventListener('mouseup', (e) => e.stopPropagation());
            this.panel.addEventListener('click', (e) => e.stopPropagation());
            this.panel.addEventListener('pointerdown', (e) => e.stopPropagation());
            this.panel.addEventListener('pointerup', (e) => e.stopPropagation());

            this.updateCheckboxStates();
            this.updateToggleState();
        },

        setExtractionMode(mode) {
            CONFIG.EXTRACTION_MODE = mode;
            saveSettings();
            this.updateToggleState();
            log(`Extraction mode set to: ${mode.toUpperCase()}`, 'info');
        },

        updateToggleState() {
            if (!this.toggleSwitch || !this.toggleLabelXHR || !this.toggleLabelDOM) return;

            if (CONFIG.EXTRACTION_MODE === 'xhr') {
                this.toggleSwitch.classList.remove('dom');
                this.toggleLabelXHR.classList.add('active');
                this.toggleLabelDOM.classList.remove('active');
            } else {
                this.toggleSwitch.classList.add('dom');
                this.toggleLabelXHR.classList.remove('active');
                this.toggleLabelDOM.classList.add('active');
            }
        },

        updateCheckboxStates() {
            const { thinkingCheck, collapsibleCheck } = this.checkboxRefs;
            if (!thinkingCheck || !collapsibleCheck) return;

            thinkingCheck.checkbox.disabled = !CONFIG.INCLUDE_MODEL;
            thinkingCheck.wrapper.style.opacity = CONFIG.INCLUDE_MODEL ? '1' : '0.5';
            if (!CONFIG.INCLUDE_MODEL) {
                CONFIG.INCLUDE_THINKING = false;
                thinkingCheck.checkbox.checked = false;
                saveSettings();
            }

            collapsibleCheck.checkbox.disabled = !CONFIG.INCLUDE_THINKING;
            collapsibleCheck.wrapper.style.opacity = CONFIG.INCLUDE_THINKING ? '1' : '0.5';
        },

        show(anchorElement) {
            if (!this.shadowHost) this.init();

            if (!document.body.contains(this.shadowHost)) {
                document.body.appendChild(this.shadowHost);
            }

            // Sync states
            this.checkboxRefs.userCheck.checkbox.checked = CONFIG.INCLUDE_USER;
            this.checkboxRefs.modelCheck.checkbox.checked = CONFIG.INCLUDE_MODEL;
            this.checkboxRefs.thinkingCheck.checkbox.checked = CONFIG.INCLUDE_THINKING;
            this.checkboxRefs.collapsibleCheck.checkbox.checked = CONFIG.COLLAPSIBLE_THINKING;
            this.updateCheckboxStates();
            this.updateToggleState();

            const rect = anchorElement.getBoundingClientRect();
            this.panel.style.top = `${rect.bottom + 4}px`;
            this.panel.style.right = `${window.innerWidth - rect.right}px`;
            this.panel.style.left = 'auto';

            this.panel.style.display = 'block';
            this.isOpen = true;

            if (this.closeHandler) {
                document.removeEventListener('mousedown', this.closeHandler, true);
            }

            this.closeHandler = (e) => {
                if (!this.isOpen) return;

                const path = e.composedPath();
                if (path.includes(this.shadowHost)) return;

                if (e.target === downloadButton || downloadButton.contains(e.target)) return;

                this.hide();
            };

            this.escapeHandler = (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.hide();
                }
            };

            setTimeout(() => {
                document.addEventListener('mousedown', this.closeHandler, true);
                document.addEventListener('keydown', this.escapeHandler, true);
            }, 100);
        },

        hide() {
            if (this.panel) {
                this.panel.style.display = 'none';
            }
            this.isOpen = false;

            if (this.closeHandler) {
                document.removeEventListener('mousedown', this.closeHandler, true);
                this.closeHandler = null;
            }

            if (this.escapeHandler) {
                document.removeEventListener('keydown', this.escapeHandler, true);
                this.escapeHandler = null;
            }
        },

        toggle(anchorElement) {
            if (this.isOpen) {
                this.hide();
            } else {
                this.show(anchorElement);
            }
        }
    };

    function toggleSettingsPanel(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        hideTooltip();

        SettingsPanel.toggle(downloadButton);
    }

    //================================================================================
    // UI INTEGRATION
    //================================================================================
    function updateButtonState(state) {
        if (!downloadButton || !downloadIcon) return;

        downloadIcon.style.color = '#34a853'; // Default green
        downloadButton.style.opacity = '1';
        downloadButton.style.cursor = 'pointer';
        downloadButton.disabled = false;

        switch (state) {
            case 'WORKING':
                downloadIcon.textContent = 'cancel';
                downloadIcon.style.color = '#ea4335'; // Red for cancel/abort
                break;

            case 'SUCCESS':
                downloadIcon.textContent = 'check_circle';
                setTimeout(() => updateButtonState('IDLE'), 3000);
                break;

            case 'ERROR':
                downloadIcon.textContent = 'error';
                downloadIcon.style.color = '#ea4335';
                alert('No chat data available yet.\n\nStart or continue a conversation first.');
                setTimeout(() => updateButtonState('IDLE'), 3000);
                break;

            default: // IDLE
                downloadIcon.textContent = 'download';
                break;
        }
    }

    function createUI() {
        const toolbarRight = document.querySelector('ms-toolbar .toolbar-right');
        if (!toolbarRight || document.getElementById('aistudio-xhr-export-btn')) return;

        log('Injecting toolbar button.', 'info');

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; align-items: center; margin: 0 4px; position: relative;';

        downloadButton = document.createElement('button');
        downloadButton.id = 'aistudio-xhr-export-btn';
        downloadButton.setAttribute('ms-button', '');
        downloadButton.setAttribute('variant', 'icon-borderless');
        downloadButton.className = 'mat-mdc-tooltip-trigger ms-button-borderless ms-button-icon';
        downloadButton.style.cursor = 'pointer';

        downloadIcon = document.createElement('span');
        downloadIcon.className = 'material-symbols-outlined notranslate ms-button-icon-symbol';
        downloadIcon.textContent = 'download';

        downloadButton.appendChild(downloadIcon);
        buttonContainer.appendChild(downloadButton);

        // The more_vert button is now wrapped in .overflow-menu-wrapper, so insert before that wrapper
        const overflowWrapper = toolbarRight.querySelector('.overflow-menu-wrapper');
        if (overflowWrapper) {
            toolbarRight.insertBefore(buttonContainer, overflowWrapper);
        } else {
            toolbarRight.appendChild(buttonContainer);
        }

        // Left-click: Export or Abort
        downloadButton.addEventListener('click', (e) => {
            if (e.button === 0) {
                hideTooltip();

                // If DOM extraction is in progress, abort it
                if (isScrolling && CONFIG.EXTRACTION_MODE === 'dom') {
                    abortDOMExtraction();
                } else {
                    processAndDownload();
                }
            }
        });

        // Right-click: Settings
        downloadButton.addEventListener('contextmenu', toggleSettingsPanel);

        // Tooltip on hover
        downloadButton.addEventListener('mouseenter', () => {
            if (isScrolling) {
                showTooltip(downloadButton, `Extracting conversation...\nFound: ${collectedDOMData.size} messages\nClick to abort`);
            } else {
                showTooltip(downloadButton);
            }
        });
        downloadButton.addEventListener('mouseleave', () => {
            hideTooltip(downloadButton);
        });

        updateButtonState('IDLE');

        // Show hint on first load if not dismissed
        if (!CONFIG.HINT_DISMISSED) {
            setTimeout(() => showExportHint(), 800);
        }
    }

    /**
     * Shows a hint banner pointing to the export button explaining RMB functionality.
     * Uses programmatic element creation to comply with Trusted Types CSP.
     */
    function showExportHint() {
        if (CONFIG.HINT_DISMISSED) return;
        if (document.getElementById('aistudio-export-hint')) return;
        if (!downloadButton) return;

        const hint = document.createElement('div');
        hint.id = 'aistudio-export-hint';

        // Title
        const title = document.createElement('div');
        title.className = 'hint-title';
        title.textContent = '💡 Tip: Right-Click for Options';
        hint.appendChild(title);

        // Text
        const text = document.createElement('div');
        text.className = 'hint-text';
        text.textContent = 'Right-click the download button to access export settings: toggle messages, thinking blocks, collapsible sections, and switch extraction modes.';
        hint.appendChild(text);

        // Footer
        const footer = document.createElement('div');
        footer.className = 'hint-footer';

        // Checkbox label
        const label = document.createElement('label');
        label.className = 'hint-checkbox-label';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'hint-dismiss-forever';

        const labelText = document.createTextNode("Don't show again");

        label.appendChild(checkbox);
        label.appendChild(labelText);
        footer.appendChild(label);

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'hint-close';
        closeBtn.textContent = 'Got it';
        footer.appendChild(closeBtn);

        hint.appendChild(footer);
        document.body.appendChild(hint);

        // Position below the button, arrow pointing up to button
        const rect = downloadButton.getBoundingClientRect();
        hint.style.top = `${rect.bottom + 12}px`;
        hint.style.right = `${window.innerWidth - rect.right - 8}px`;

        const closeHint = () => {
            if (checkbox.checked) {
                CONFIG.HINT_DISMISSED = true;
                saveSettings();
                log('Export hint permanently dismissed.', 'info');
            }
            hint.style.animation = 'none';
            hint.style.opacity = '0';
            hint.style.transform = 'translateY(-10px)';
            hint.style.transition = 'opacity 0.2s, transform 0.2s';
            setTimeout(() => hint.remove(), 200);
        };

        closeBtn.addEventListener('click', closeHint);

        // Close on outside click
        const outsideClickHandler = (e) => {
            if (!hint.contains(e.target) && e.target !== downloadButton && !downloadButton.contains(e.target)) {
                closeHint();
                document.removeEventListener('mousedown', outsideClickHandler);
            }
        };
        setTimeout(() => {
            document.addEventListener('mousedown', outsideClickHandler);
        }, 300);

        // Auto-dismiss after 20 seconds
        setTimeout(() => {
            if (document.getElementById('aistudio-export-hint')) {
                closeHint();
            }
        }, 20000);
    }

    function initialize() {
        loadSettings();
        createUI();
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    const toolbar = document.querySelector('ms-toolbar .toolbar-right');
                    if (toolbar) createUI();
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    //================================================================================
    // NAVIGATION HANDLER (Clears data on chat switch/new prompt)
    //================================================================================
    function clearCapturedData() {
        // Don't clear if data was captured very recently (within 2 seconds)
        // This handles the race condition where pushState fires right after CreatePrompt
        if (Date.now() - capturedTimestamp < 2000) {
            return;
        }
        capturedChatData = null;
        capturedTimestamp = 0;
    }

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
        clearCapturedData();
        return originalPushState.apply(this, arguments);
    };

    history.replaceState = function() {
        clearCapturedData();
        return originalReplaceState.apply(this, arguments);
    };

    window.addEventListener('popstate', clearCapturedData);

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();