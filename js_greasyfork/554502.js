// ==UserScript==
// @name         Google AI Studio | Conversation/Chat MarkDown-Export/Download (DOM-based)
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      3.0
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Export AI Studio conversations to Markdown with intelligent mode detection, toolbar integration, and abortable processing. Features dual-mode extraction and configurable filters.
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aistudio.google.com
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554502/Google%20AI%20Studio%20%7C%20ConversationChat%20MarkDown-ExportDownload%20%28DOM-based%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554502/Google%20AI%20Studio%20%7C%20ConversationChat%20MarkDown-ExportDownload%20%28DOM-based%29.meta.js
// ==/UserScript==

/**
 * AI Studio Export Script - Advanced Conversation Capture Tool
 * ============================================================
 *
 * A comprehensive userscript that exports Google AI Studio conversations to Markdown format
 * with intelligent mode detection, automated Raw Mode toggle, and high-performance scrolling.
 *
 * CREDITS & INSPIRATION
 * ---------------------
 * This script builds upon concepts from two projects:
 *
 * 1. Userscript: Google AI Studio 聊天记录导出器** (now deleted)
 *    • author: qwerty
 *    • Uploader: https://greasyfork.org/en/users/1462896-max-tab
 *    • Script: https://greasyfork.org/en/scripts/534177-google-ai-studio-chat-record-exporter
 *
 * 2. Extension: Gemini to PDF
 *    • Developer: Hamza Wasim (hamzaw31@gmail.com)
 *    • Extension: https://chromewebstore.google.com/detail/gemini-to-pdf/blndbnmpkgfoopgmcejnhdnepfejgipe
 *    • Website: https://geminitoolbox.com/
 *    • Announcement: https://www.reddit.com/r/Bard/comments/1lshanb/built_a_free_extension_to_save_gemini_and_ai/
 *
 * CORE FEATURES
 * -------------
 * • Intelligent Mode Detection: Auto-detects Raw vs Rendered Mode
 * • Abortable Processing: Cancel extraction mid-process
 * • Toolbar Integration: Seamlessly integrated into AI Studio's toolbar
 * • Configurable Filters: Real-time control over export content
 * • High-Performance: 50ms scroll delays with smart batching
 * • Auto-Recovery: Handles dynamic UI re-rendering automatically
 * • CSP-Compliant: Full compliance with AI Studio's security policies
 *
 * USER INTERFACE
 * --------------
 * • Export Button: Toolbar icon with visual state feedback (Idle/Working/Success/Error)
 * • Settings Panel: Gear icon opens configuration with export filters
 * • Abort Control: Click button during processing to cancel operation
 * • Dynamic Positioning: Panel adapts to window changes
 *
 * CONFIGURATION
 * -------------
 * • Prefer Raw Mode: Auto-switch to Raw Mode for cleaner extraction
 * • Include User Messages: Control user prompt inclusion
 * • Include AI Responses: Control AI answer inclusion
 * • Include AI Thinking: Control AI reasoning/thought process inclusion
 *
 * TECHNICAL ARCHITECTURE
 * ----------------------
 * • MutationObserver: Watches toolbar changes for auto-recovery
 * • AbortController: Implements responsive cancellation
 * • Multi-Strategy DOM: Fallback selectors for reliable extraction
 * • Memory Efficient: DOM element keys for data association
 * • Scroll Intelligence: Advanced detection of conversation boundaries
 *
 * USAGE
 * -----
 * 1. Find export/download icon in AI Studio toolbar
 * 2. Click gear icon to configure export filters (optional)
 * 3. Click export button to begin automated capture
 * 4. Monitor progress via button state changes
 * 5. Click button again to abort if needed
 * 6. Download starts automatically when complete
 *
 * PERFORMANCE
 * -----------
 * • Ultra-Fast: 50ms scroll delays with intelligent batching
 * • Smart Detection: Multiple passes ensure complete capture
 * • Error Recovery: Automatic retry with graceful failure handling
 * • Browser Support: Compatible with Tampermonkey, Violentmonkey
 */

(function() {
    'use strict';

    //================================================================================
    // CONFIGURATION - All script settings, constants, and tunable parameters
    //================================================================================

    //--------------------------------------------------------------------------------
    // CORE EXPORT PREFERENCES - The most important settings for the user
    //--------------------------------------------------------------------------------
    // Mode Preference: Set to true to extract in "Raw Mode" (clean markdown), or false for "Rendered Mode".
    let PREFER_RAW_MODE = true;

    // Content Filtering: Control which parts of the conversation to include in the export.
    let INCLUDE_USER_MESSAGES = true;    // true to include user prompts/questions
    let INCLUDE_AI_RESPONSES = true;     // true to include the AI's main answers/replies
    let INCLUDE_AI_THINKING = false;     // true to include the AI's reasoning/thought process

    //--------------------------------------------------------------------------------
    // FILE OUTPUT SETTINGS - Customize the exported file name
    //--------------------------------------------------------------------------------
    const EXPORT_FILENAME_PREFIX = 'aistudio_chat_export_';

    //--------------------------------------------------------------------------------
    // CORE EXTRACTION BEHAVIOR - Settings that affect how content is captured
    //--------------------------------------------------------------------------------
    const THOUGHT_EXPAND_DELAY_MS = 500;       // Wait time after expanding "thinking" sections to allow content to load.
    const THOUGHT_MIN_LENGTH = 10;             // Minimum text length for a "thinking" block to be considered valid.

    //--------------------------------------------------------------------------------
    // PERFORMANCE & TIMING - Advanced settings to balance speed and reliability
    //--------------------------------------------------------------------------------
    const SCROLL_DELAY_MS = 50;                // Main scroll delay: 50ms for "machine-gun" speed. Lower values are faster but may miss content on slow connections.
    const RAW_MODE_MENU_DELAY_MS = 200;        // Wait for the "Raw Mode" dropdown menu to appear after clicking "More".
    const RAW_MODE_RENDER_DELAY_MS = 300;      // Wait for the UI to re-render after toggling Raw Mode.
    const FINAL_CAPTURE_DELAY_MS = 50;         // Delay before the final data extraction pass after scrolling is complete.
    const POST_EXTRACTION_DELAY_MS = 100;      // Delay for any cleanup or final processing after extraction.
    const FINAL_COLLECTION_DELAY_MS = 300;     // Delay at each final scroll position (top, middle, bottom) to ensure all content is loaded.
    const SUCCESS_RESET_TIMEOUT_MS = 2500;     // Time in ms before the button resets from 'Success' to 'Idle' (2.5 seconds).
    const ERROR_RESET_TIMEOUT_MS = 4000;       // Time in ms before the button resets from 'Failure' to 'Idle' (4 seconds).
    const UPWARD_SCROLL_DELAY_MS = 1000;       // Delay for content to load when starting a scroll-up operation from the bottom.

    //--------------------------------------------------------------------------------
    // SCROLL BEHAVIOR - Advanced parameters controlling the auto-scrolling mechanism
    //--------------------------------------------------------------------------------
    const MAX_SCROLL_ATTEMPTS = 10000;         // Maximum scroll attempts before giving up to prevent infinite loops.
    const SCROLL_INCREMENT_INITIAL = 150;      // Initial scroll increment in pixels per step.
    const SCROLL_INCREMENT_LARGE = 500;        // A larger initial jump for the first scroll pass to load content faster.
    const BOTTOM_DETECTION_TOLERANCE = 10;     // Pixel tolerance for detecting the bottom of the scroll area.
    const PROBLEMATIC_JUMP_FACTOR = 1.25;      // Factor to detect problematic scroll jumps (e.g., 125% of intended distance).
    const MIN_SCROLL_DISTANCE_THRESHOLD = 5;   // Minimum pixel distance to detect if scrolling has effectively stopped.
    const SCROLL_PARENT_SEARCH_DEPTH = 5;      // How many parent elements to search upwards to find the main scroll container.


    //--------------------------------------------------------------------------------
    // LOG CONSOLE UI - Styling for the debug log panel
    //--------------------------------------------------------------------------------
    const LOG_ENTRY_INFO_COLOR = '#e8eaed';
    const LOG_ENTRY_SUCCESS_COLOR = '#34a853';
    const LOG_ENTRY_WARN_COLOR = '#fbbc04';
    const LOG_ENTRY_ERROR_COLOR = '#ea4335';

    // State variables
    let isScrolling = false;
    let collectedData = new Map();
    let scrollCount = 0;
    let noChangeCounter = 0;
    let scrollIncrement = SCROLL_INCREMENT_LARGE;
    let exportButtonState = 'IDLE'; // Can be 'IDLE', 'WORKING', 'SUCCESS', 'ERROR'
    let abortController;

     // UI Elements
    let exportButton, exportIcon;
    let settingsPanel;
    let preferRawModeCheckbox, includeUserMessagesCheckbox, includeAiResponsesCheckbox, includeAiThinkingCheckbox;

    //================================================================================
    // HELPER FUNCTIONS - Utility functions for script operation
    //================================================================================

    /**
     * Creates a Trusted Types policy to handle Content Security Policy compliance
     * for DOM manipulation in Google AI Studio's environment.
     */
    let trustedTypesPolicy = null;
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            // Policy names for userscripts often require a specific format.
            trustedTypesPolicy = window.trustedTypes.createPolicy('aistudio-export-policy#userscript', {
                createHTML: string => string
            });
        } catch (e) {
            console.warn("[AI Studio Export] Could not create a new Trusted Types policy. This might happen if the policy already exists. The script will attempt to continue.", e.message);
        }
    }

    /**
     * Creates a trusted HTML string for DOM manipulation while respecting CSP policies.
     * @param {string} htmlString - The HTML string to be processed.
     * @returns {string} - A trusted HTML string compatible with Content Security Policy.
     */
    function getTrustedHTML(htmlString) {
        if (trustedTypesPolicy) {
            return trustedTypesPolicy.createHTML(htmlString);
        }
        return htmlString;
    }

    /**
     * Creates a delay/promise for asynchronous operations.
     * @param {number} ms - Time in milliseconds to delay.
     * @returns {Promise} - Promise that resolves after the specified delay.
     */
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Generates a timestamp string in format YYYYMMDD_HHMMSS for file naming.
     * @returns {string} - Formatted timestamp string.
     */
    function getCurrentTimestamp() {
        const n = new Date();
        const YYYY = n.getFullYear();
        const MM = (n.getMonth() + 1).toString().padStart(2, '0');
        const DD = n.getDate().toString().padStart(2, '0');
        const hh = n.getHours().toString().padStart(2, '0');
        const mm = n.getMinutes().toString().padStart(2, '0');
        const ss = n.getSeconds().toString().padStart(2, '0');
        return `${YYYY}${MM}${DD}_${hh}${mm}${ss}`;
    }

    /**
     * Logs a message to the browser console with consistent formatting.
     * @param {string} message - The message to log.
     */
    function logToConsole(message) {
        console.log(`[AI Studio Export] ${message}`);
    }

    /**
     * Logs a message to both console and visual panel for consistent output.
     * This function replaces the old logToConsole calls throughout the script.
     * @param {string} message - The message to log.
     * @param {string} type - The log type: 'info', 'success', 'warn', 'error' (optional).
     */
    function log(message, type = 'info') {
        const style = `color: ${type === 'success' ? LOG_ENTRY_SUCCESS_COLOR : type === 'warn' ? LOG_ENTRY_WARN_COLOR : type === 'error' ? LOG_ENTRY_ERROR_COLOR : LOG_ENTRY_INFO_COLOR};`;
        console.log(`%c[AI Studio Export] ${message}`, style);
    }

    /**
     * Detects whether the page is currently in Raw Mode or Rendered Mode.
     * Raw Mode shows plain markdown text in .very-large-text-container
     * Rendered Mode shows formatted content in ms-cmark-node elements
     * @returns {string} - 'raw' or 'rendered'
     */
    function detectCurrentMode() {
        // Strategy 1: Check for Raw Mode indicator in a user turn
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

        // Strategy 2: Check URL or page state
        // (AI Studio might have a parameter or class indicating mode)
        const body = document.body;
        if (body.classList.contains('raw-mode')) {
            log("Detected mode: Raw Mode (via body class)", 'info');
            return 'raw';
        }

        // Default assumption (most common state)
        log("Could not detect mode, assuming Rendered Mode", 'warn');
        return 'rendered';
    }

    /**
     * Expands collapsed AI thinking sections to expose hidden content.
     * Uses multiple selector strategies to find and expand thinking panels.
     * @async
     * @param {Element} modelDiv - The model DOM element to expand thinking in.
     * @param {number} turnIndex - The index of the turn being processed.
     * @returns {Promise<boolean>} - True if thinking sections were expanded, false otherwise.
     */
    async function expandThinkingSections(modelDiv, turnIndex = 0) {
        let expanded = false;

        try {
            // Strategy 1: Find collapsed expansion panels with thought-related text
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
                        log(`Expanded thinking section (panel method) for turn ${turnIndex}`, 'info');
                    }
                }
            }

            // Strategy 2: Find expand buttons with thought-related text
            const expandButtons = modelDiv.querySelectorAll('button');
            for (const button of expandButtons) {
                const buttonText = button.textContent?.toLowerCase() || '';
                if ((buttonText.includes('expand') || buttonText.includes('show more')) &&
                    buttonText.includes('thought')) {
                    button.click();
                    expanded = true;
                    log(`Expanded thinking section (button method) for turn ${turnIndex}`, 'info');
                }
            }

            // Strategy 3: Click any "Show more" buttons in thought chunks
            const thoughtChunks = modelDiv.querySelectorAll('ms-thought-chunk');
            for (const chunk of thoughtChunks) {
                const showMoreButton = chunk.querySelector('button[aria-expanded="false"], button:not([aria-expanded])');
                if (showMoreButton && showMoreButton.textContent?.toLowerCase().includes('more')) {
                    showMoreButton.click();
                    expanded = true;
                    log(`Expanded thinking section (chunk method) for turn ${turnIndex}`, 'info');
                }
            }

            // Wait for expansion to complete
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
     * Clean and validate HTML snippet, removing unwanted elements.
     * Uses CSP-compliant DOM parsing to handle AI Studio's strict Content Security Policy.
     * @param {string} htmlSnippet - The HTML content to be cleaned and validated.
     * @returns {string|null} - The cleaned HTML string, or null if validation fails.
     */
    function cleanAndValidateSnippet(htmlSnippet) {
        if (!htmlSnippet || "string" !== typeof htmlSnippet) {
            return null;
        }

        let docFragment;
        try {
            // Use Range.createContextualFragment to safely parse HTML, avoiding DOMParser CSP issues.
            const range = document.createRange();
            range.selectNode(document.body); // Set a context for parsing.
            docFragment = range.createContextualFragment(htmlSnippet);
        } catch (parseError) {
            console.error("[AI Studio Export] Error creating contextual fragment during cleaning:", parseError, htmlSnippet.substring(0, 100));
            return null; // Return null if parsing fails
        }

        const turnDiv = docFragment.firstElementChild;
        if (!turnDiv) {
            console.warn("[AI Studio Export] Cleaning: Snippet did not contain a valid root element.", htmlSnippet.substring(0, 100));
            return null;
        }

        // Skip HTML cleaning due to strict CSP. Return raw HTML for fallback.
        // This method is CSP-compliant and won't trigger TrustedHTML errors.
        return htmlSnippet;
    }

    /**
     * Convert HTML to Markdown format with comprehensive formatting support.
     * Handles code blocks, links, images, inline code, emphasis, lists, headings, and paragraphs.
     * @param {string} html - The HTML content to convert to Markdown.
     * @returns {string} - The converted Markdown string.
     */
    function convertToMarkdown(html) {
        if (!html) return "";
        try {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = getTrustedHTML(html);

            const ignoreStartRegex = /^\s*<!--\s*IGNORE_WHEN_COPYING_START\s*-->\s*(\r?\n)?/im;
            const ignoreEndRegex = /^\s*<!--\s*IGNORE_WHEN_COPYING_END\s*-->\s*(\r?\n)?/im;

            const sourceElement = tempDiv.querySelector(".turn-content") || tempDiv;

            // Process code blocks
            sourceElement.querySelectorAll("ms-code-block").forEach(block => {
                const pre = block.querySelector("pre");
                if (pre) {
                    pre.innerHTML = getTrustedHTML(pre.innerHTML.replaceAll(ignoreStartRegex, "").replaceAll(ignoreEndRegex, ""));
                }

                const code = pre ? pre.textContent : block.textContent.replaceAll(ignoreStartRegex, "").replaceAll(ignoreEndRegex, "");
                const langMatch = code.match(/^(\w+)\s*\n/);
                const lang = langMatch ? langMatch[1] : "";
                const codeContent = langMatch ? code.substring(langMatch[0].length) : code;

                block.replaceWith(`\n\n\`\`\`${lang}\n${codeContent.trim()}\n\`\`\`\n\n`);
            });

            // Process links
            sourceElement.querySelectorAll("a").forEach(a => {
                a.replaceWith(`[${a.textContent || a.innerText || ""}](${a.getAttribute("href") || ""})`);
            });

            // Process images
            sourceElement.querySelectorAll("img").forEach(img => {
                img.replaceWith(`\n\n![${img.getAttribute("alt") || "image"}](${img.getAttribute("src") || ""})\n\n`);
            });

            // Process inline code
            sourceElement.querySelectorAll("code:not(pre code)").forEach(code => {
                code.replaceWith(`\`${code.textContent}\``);
            });

            // Process emphasis
            sourceElement.querySelectorAll("strong, b").forEach(el => {
                el.replaceWith(`**${el.textContent}**`);
            });
            sourceElement.querySelectorAll("em, i").forEach(el => {
                el.replaceWith(`*${el.textContent}*`);
            });

            // Process lists
            sourceElement.querySelectorAll("ul, ol").forEach(list => {
                let listMd = "\n";
                Array.from(list.children).forEach((li, index) => {
                    let liContent = li.innerHTML.replace(/<br\s*\/?>/gi, "\n");
                    const tempLiDiv = document.createElement("div");
                    tempLiDiv.innerHTML = getTrustedHTML(liContent);

                    // Clean formatting within list items
                    tempLiDiv.querySelectorAll("strong, b").forEach(el => {
                        el.replaceWith(`**${el.textContent}**`);
                    });
                    tempLiDiv.querySelectorAll("em, i").forEach(el => {
                        el.replaceWith(`*${el.textContent}*`);
                    });
                    tempLiDiv.querySelectorAll("code:not(pre code)").forEach(el => {
                        el.replaceWith(`\`${el.textContent}\``);
                    });
                    tempLiDiv.querySelectorAll("a").forEach(el => {
                        el.replaceWith(`[${el.textContent}](${el.getAttribute("href")})`);
                    });

                    const content = tempLiDiv.textContent?.trim() || "";
                    listMd += `${list.tagName === "OL" ? index + 1 + "." : "*"} ${content}\n`;
                });
                list.replaceWith(listMd);
            });

            // Process headings
            sourceElement.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(h => {
                const level = parseInt(h.tagName.substring(1), 10);
                h.replaceWith(`\n\n${"#".repeat(level)} ${h.textContent}\n\n`);
            });

            // Process paragraphs
            sourceElement.querySelectorAll("p").forEach(p => {
                const next = p.nextElementSibling;
                if (!p.textContent.trim() || (next && ["H1", "H2", "H3", "H4", "H5", "H6", "UL", "OL", "PRE", "BLOCKQUOTE", "HR", "TABLE", "MS-CODE-BLOCK"].includes(next?.tagName))) {
                    return; // Skip empty paragraphs and those followed by block elements
                }
                p.after("\n\n");
            });

            let text = sourceElement.innerText || sourceElement.textContent || "";
            return text = text.replace(/(\n\s*){3,}/g, "\n\n"), text.trim();

        } catch (e) {
            console.error("Error converting HTML snippet to Markdown:", e, html.substring(0, 100));
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = getTrustedHTML(html);
            return tempDiv.textContent || "";
        }
    }

    //================================================================================
    // CORE FUNCTIONS - Main business logic and automation
    //================================================================================

    /**
     * Automates the Raw Mode toggle functionality in Google AI Studio.
     * This function finds and clicks the "more actions" button, then selects "Raw Mode"
     * from the dropdown menu to expose the pure Markdown content.
     * @async
     * @returns {Promise<boolean>} - True if Raw Mode was successfully toggled, false otherwise.
     */
    async function toggleRawMode() {
    log("Attempting to toggle Raw Mode...");

    // 1. Find and click the 'More' button
    const moreButton = document.querySelector('button[aria-label="View more actions"]');
    if (!moreButton) {
        log("Error: 'More actions' button not found.", 'error');
        return false;
    }
    moreButton.click();
    log("'More actions' button clicked.");

    // 2. Wait for the menu to appear and click the 'Raw Mode' button
    await delay(RAW_MODE_MENU_DELAY_MS); // Wait for menu animation

    const rawModeButton = Array.from(document.querySelectorAll('button[role="menuitem"]'))
                               .find(btn => btn.textContent.includes('Raw Mode'));

    if (!rawModeButton) {
        log("Error: 'Raw Mode' button not found in the menu.", 'error');
        // Attempt to close the menu by clicking the 'More' button again
        moreButton.click();
        return false;
    }

    rawModeButton.click();
    log("'Raw Mode' button clicked.");
    await delay(RAW_MODE_RENDER_DELAY_MS); // Wait for the UI to re-render after toggling
    return true;
}

    /**
     * Identifies and returns the main scrollable element for AI Studio conversations.
     * Uses a cascade of selectors starting with the most specific, then falling back
     * to more general approaches, finally defaulting to document.documentElement.
     * @returns {Element} - The identified scrollable element.
     */
    function getMainScrollerElement_AiStudio() {
        log("Searching for page scroll container...");

        // Try the proven selectors from the extension
        let scroller = document.querySelector('ms-autoscroll-container');
        if (scroller) {
            log("Found scroll container (ms-autoscroll-container)", 'success');
            return scroller;
        }

        // Fallback to chat turns parent
        const chatTurnsContainer = document.querySelector('ms-chat-turn')?.parentElement;
        if (chatTurnsContainer) {
            let parent = chatTurnsContainer;
            for (let i = 0; i < SCROLL_PARENT_SEARCH_DEPTH && parent; i++) {
                if (parent.scrollHeight > parent.clientHeight + BOTTOM_DETECTION_TOLERANCE &&
                    (window.getComputedStyle(parent).overflowY === 'auto' ||
                     window.getComputedStyle(parent).overflowY === 'scroll')) {
                    log("Found scroll container (searching parent elements)", 'success');
                    return parent;
                }
                parent = parent.parentElement;
            }
        }

        log("Warning: Using document.documentElement as fallback", 'warn');
        return document.documentElement;
    }

    /**
     * Extracts data from all visible chat turns in the current AI Studio conversation.
     * Uses DOM traversal with CSP-compliant selectors to capture user prompts,
     * AI responses, and AI thinking output. Maintains a Map of collected data.
     * @returns {boolean} - True if new data was found or existing data was updated, false otherwise.
     */
    async function extractDataIncremental_AiStudio(extractionMode = 'raw') {
        let newlyFoundCount = 0;
        let dataUpdatedInExistingTurn = false;
        const currentTurns = document.querySelectorAll('ms-chat-turn');

        for (const [index, turn] of currentTurns.entries()) {
            const turnKey = turn; // Use turn element as key (consistent with MaxTab)
            const turnContainer = turn.querySelector('.chat-turn-container.user, .chat-turn-container.model');
            if (!turnContainer) continue; // Skip only if no container found

            // ✅ Check if new turn, but DON'T skip existing ones
            let isNewTurn = !collectedData.has(turnKey);
            let extractedInfo = collectedData.get(turnKey) || {
                domOrder: index,
                type: 'unknown',
                userText: null,
                thoughtText: null,
                responseText: null
            };

            if (isNewTurn) {
                collectedData.set(turnKey, extractedInfo);
                newlyFoundCount++;
            }

            let dataWasUpdatedThisTime = false;

            // Extract based on container type (exactly like MaxTab)
            if (turnContainer.classList.contains('user')) {
                if (extractedInfo.type === 'unknown') extractedInfo.type = 'user';
                if (!extractedInfo.userText) {
                    let userText = null;
                    if (extractionMode === 'raw') {
                        // RAW MODE: .very-large-text-container
                        const rawContainer = turn.querySelector('ms-text-chunk .very-large-text-container');
                        if (rawContainer) {
                            userText = rawContainer.textContent.trim();
                        }
                    } else {
                        // RENDERED MODE: ms-cmark-node
                        let userNode = turn.querySelector('.turn-content ms-cmark-node');
                        if (userNode) {
                            userText = userNode.innerText.trim();
                        }
                    }
                    if (userText) {
                        extractedInfo.userText = userText;
                        dataWasUpdatedThisTime = true;
                        log(`Extracted user text from turn ${index}: "${userText.substring(0, 50)}..."`);
                    }
                }
            } else if (turnContainer.classList.contains('model')) {
                if (extractedInfo.type === 'unknown') extractedInfo.type = 'model';

                // ✅ NEW: Expand collapsed thinking sections BEFORE extraction
                await expandThinkingSections(turn, index);

                // Extract AI thinking output with multiple strategies
                if (!extractedInfo.thoughtText) {
                    let thoughtText = null;

                    if (extractionMode === 'raw') {
                        // RAW MODE selector
                        const rawThought = turn.querySelector('ms-thought-chunk .very-large-text-container');
                        if (rawThought) {
                            thoughtText = rawThought.textContent.trim();
                        }
                    } else {
                        // RENDERED MODE selector
                        let thoughtNode = turn.querySelector('ms-thought-chunk .mat-expansion-panel-body ms-cmark-node');
                        if (thoughtNode) {
                            thoughtText = thoughtNode.textContent.trim();
                        }
                    }

                    if (thoughtText && thoughtText.length >= THOUGHT_MIN_LENGTH) {
                        extractedInfo.thoughtText = thoughtText;
                        dataWasUpdatedThisTime = true;
                        log(`Extracted AI thinking from turn ${index}: "${thoughtText.substring(0, 50)}..."`);
                    }
                }


                // Extract AI response (exactly like MaxTab)
                if (!extractedInfo.responseText) {
                    const responseChunks = Array.from(turn.querySelectorAll('.turn-content > ms-prompt-chunk'));
                    const responseTexts = responseChunks
                        .filter(chunk => !chunk.querySelector('ms-thought-chunk'))
                        .map(chunk => {
                            if (extractionMode === 'raw') {
                                // RAW MODE selector
                                const rawContainer = chunk.querySelector('ms-text-chunk .very-large-text-container');
                                if (rawContainer) {
                                    return rawContainer.textContent.trim();
                                }
                            } else {
                                // RENDERED MODE selector
                                const cmarkNode = chunk.querySelector('ms-cmark-node');
                                if (cmarkNode) {
                                    return cmarkNode.innerText.trim();
                                }
                            }
                            return chunk.innerText.trim(); // Fallback
                        })
                        .filter(text => text);

                    if (responseTexts.length > 0) {
                        extractedInfo.responseText = responseTexts.join('\n\n');
                        dataWasUpdatedThisTime = true;
                        log(`Extracted AI response from turn ${index} with ${responseTexts.length} chunks`);
                    } else if (!extractedInfo.thoughtText) {
                        // Fallback only if no thinking was found (like MaxTab)
                        const turnContent = turn.querySelector('.turn-content');
                        if (turnContent) {
                            extractedInfo.responseText = turnContent.innerText.trim();
                            dataWasUpdatedThisTime = true;
                            log(`Extracted AI response from turn ${index} using fallback`);
                        }
                    }
                }

                // Set turn type (exactly like MaxTab)
                if (dataWasUpdatedThisTime) {
                    if (extractedInfo.thoughtText && extractedInfo.responseText) extractedInfo.type = 'model_thought_reply';
                    else if (extractedInfo.responseText) extractedInfo.type = 'model_reply';
                    else if (extractedInfo.thoughtText) extractedInfo.type = 'model_thought';
                }
            }

            // Update collected data if anything changed
            if (dataWasUpdatedThisTime) {
                collectedData.set(turnKey, extractedInfo);
                dataUpdatedInExistingTurn = true;
            }
        }

        if (currentTurns.length > 0 && collectedData.size === 0) {
            log("Warning: Chat turns exist but no data could be extracted. Please check selectors.", 'warn');
        } else {
            log(`Scroll ${scrollCount}/${MAX_SCROLL_ATTEMPTS}... Found ${collectedData.size} total records`);
        }

        return newlyFoundCount > 0 || dataUpdatedInExistingTurn;
    }

    /**
     * Performs high-speed auto-scrolling through AI Studio conversations to capture all content.
     * Uses incremental scrolling with hardcoded delays for maximum speed, detecting end conditions
     * and handling problematic scroll jumps. Performs final collection passes for completeness.
     * @async
     * @param {string} direction - The direction to scroll ('down' or 'up').
     * @returns {Promise<boolean>} - True if the scrolling completed successfully, false otherwise.
     */
    /**
     * Preloads conversation history by repeatedly scrolling to the top.
     * This forces the AI Studio UI to load older, virtualized messages.
     * @async
     * @param {Element} scroller - The main scrollable element.
     */
    async function preloadHistory(scroller) {
        log("Preloading history by scrolling to top...");
        let lastHeight = 0;
        const isWindowScroller = (scroller === document.documentElement || scroller === document.body);
        const getScrollHeight = () => isWindowScroller ? document.documentElement.scrollHeight : scroller.scrollHeight;

        for (let i = 0; i < 5; i++) { // Loop a few times to ensure lazy-loaded content is fetched
            if (isWindowScroller) { window.scrollTo({ top: 0, behavior: 'instant' }); }
            else { scroller.scrollTo({ top: 0, behavior: 'instant' }); }

            await delay(UPWARD_SCROLL_DELAY_MS);

            const newHeight = getScrollHeight();
            if (newHeight <= lastHeight + MIN_SCROLL_DISTANCE_THRESHOLD) { // Use existing constant for stability check
                log(`History preloading stable at height: ${newHeight}px`, 'success');
                break;
            }
            lastHeight = newHeight;
            log(`Preloading... scrollHeight grew to ${newHeight}px`);
        }

        // After preloading, the scroller is at the top, ready for the main downward scroll.
        log("Preloading complete, starting capture from the top.");
    }

    async function autoScroll_AiStudio(direction = 'down') {
        log(`Starting auto-scroll (direction: ${direction})...`);
        isScrolling = true;
        collectedData.clear();
        scrollCount = 0;
        noChangeCounter = 0;
        scrollIncrement = SCROLL_INCREMENT_INITIAL; // Reset to initial value

        const scroller = getMainScrollerElement_AiStudio();
        if (!scroller) {
            log('Error: Cannot find scroll area!', 'error');
            alert('Unable to find chat scroll area. Auto-scroll cannot proceed.');
            isScrolling = false;
            return false;
        }

        log(`Using scroll element: ${scroller.tagName}.${scroller.className.split(' ').join('.')}`);

        const isWindowScroller = (scroller === document.documentElement || scroller === document.body);
        const getScrollTop = () => isWindowScroller ? window.scrollY : scroller.scrollTop;
        const getScrollHeight = () => isWindowScroller ? document.documentElement.scrollHeight : scroller.scrollHeight;
        const getClientHeight = () => isWindowScroller ? window.innerHeight : scroller.clientHeight;

        // Fix: Artificial tiny upward scroll to initiate
        if (isWindowScroller) { window.scrollBy(0, -10); }
        else { scroller.scrollTop -= 10; }
        await delay(100);

        // Preload history to handle lazy-loading chats and position scroller at the top.
        await preloadHistory(scroller);

        log(`Starting incremental scroll (up to ${MAX_SCROLL_ATTEMPTS} attempts)...`);
        let lastScrollTop = -1;
        let reachedEnd = false;
        let scrollMessages = ["scrolling...", "scrolling..", "scrolling.", "scrolling"];

        // Initial collection
        const desiredMode = PREFER_RAW_MODE ? 'raw' : 'rendered';
        const initialNewCount = await extractDataIncremental_AiStudio(desiredMode);
        log(`Initial collection: ${collectedData.size} messages`);

        while (scrollCount < MAX_SCROLL_ATTEMPTS && !reachedEnd && isScrolling) {
            if (abortController.signal.aborted) {
                log('Scroll aborted by user.', 'warn');
                isScrolling = false;
                break;
            }
            const currentTop = scroller.scrollTop;
            const clientHeight = scroller.clientHeight;
            const scrollHeight = scroller.scrollHeight;

            // End detection: Check if we've reached the bottom.
            // IMPORTANT: `scrollCount > 0` prevents exiting on the first pass if already at the bottom.
            if (scrollCount > 0 && currentTop + clientHeight >= scrollHeight - BOTTOM_DETECTION_TOLERANCE) {
                log("Reached bottom of conversation - no more content to scroll", 'success');
                reachedEnd = true;
                break;
            }

            // Calculate the next scroll target position
            // Add the increment to the current position, but don't exceed the maximum possible scroll
            let intendedScrollTarget = currentTop + scrollIncrement;
            const maxPossibleScrollTop = scrollHeight - clientHeight;
            if (intendedScrollTarget > maxPossibleScrollTop) {
                intendedScrollTarget = maxPossibleScrollTop; // Clamp to bottom
            }

            // Execute the scroll operation
            scroller.scrollTop = intendedScrollTarget;
            scrollCount++;

            // Machine-gun speed delay: 50ms for maximum performance
            // May miss content on very slow connections
            await delay(SCROLL_DELAY_MS);

            const effectiveScrollTop = scroller.scrollTop;
            const actualScrolledDistance = effectiveScrollTop - currentTop;

            // Detect problematic scroll jumps that might indicate UI issues
            // A jump > configured factor of intended distance suggests the UI may have re-arranged
            let isProblematicJump = false;
            if (actualScrolledDistance > PROBLEMATIC_JUMP_FACTOR * scrollIncrement && intendedScrollTarget < maxPossibleScrollTop - BOTTOM_DETECTION_TOLERANCE) {
                isProblematicJump = true;
                log(`Scroll jump detected. From: ${currentTop}, Aimed: ${intendedScrollTarget}, Got: ${effectiveScrollTop}`, 'warn');
            }

            // Detect when scrolling has effectively stopped (conversation end)
            // If we moved less than the minimum threshold and this isn't the first scroll, assume we're at the end
            if (actualScrolledDistance < MIN_SCROLL_DISTANCE_THRESHOLD && scrollCount > 1) {
                log("Scroll effectively stopped, assuming end of conversation", 'success');
                reachedEnd = true;
                break;
            }

            // Extract any newly visible messages after this scroll position
            const newlyAddedCount = await extractDataIncremental_AiStudio(desiredMode);

            // Update progress indicator with cycling messages for better UX
            const loadingMessage = scrollMessages[(scrollCount - 1) % scrollMessages.length];
            const indicatorMessage = `${loadingMessage} (Found ${collectedData.size} messages)`;

            log(indicatorMessage);

            // Update tracking variables for next iteration
            lastScrollTop = effectiveScrollTop;
        }

        // Handle different completion scenarios with detailed logging
        if (!isScrolling && scrollCount < MAX_SCROLL_ATTEMPTS && !abortController.signal.aborted) {
            log(`Scroll manually stopped by user (total ${scrollCount} attempts).`, 'warn');
        } else if (scrollCount >= MAX_SCROLL_ATTEMPTS) {
            log(`Reached maximum scroll attempts limit (${MAX_SCROLL_ATTEMPTS}). Some content may be missing.`, 'warn');
        } else if (reachedEnd) {
            log(`Scroll completed successfully after ${scrollCount} attempts. All conversation content captured.`, 'success');
        }

        // Final collection passes to ensure no content was missed
        // These additional passes capture any content that might have been loaded during scrolling
        log("Performing final collection passes to ensure completeness...");

        // Pass 1: Top of conversation
        scroller.scrollTop = 0;
        await delay(FINAL_COLLECTION_DELAY_MS);
        await extractDataIncremental_AiStudio(desiredMode);

        // Pass 2: Middle of conversation
        scroller.scrollTop = scroller.scrollHeight / 2;
        await delay(FINAL_COLLECTION_DELAY_MS);
        await extractDataIncremental_AiStudio(desiredMode);

        // Pass 3: Bottom of conversation
        scroller.scrollTop = scroller.scrollHeight;
        await delay(FINAL_COLLECTION_DELAY_MS);
        await extractDataIncremental_AiStudio(desiredMode);

        log(`Final data collection complete. Total records: ${collectedData.size}`, 'success');
        isScrolling = false;
        return true;
    }

    /**
     * Formats collected conversation data and triggers the download of a Markdown file.
     * Sorts data by DOM order, formats user prompts and AI responses with proper Markdown
     * structure, and generates a downloadable .md file with timestamp.
     * @returns {boolean} - True if the file was successfully created and downloaded, false otherwise.
     */
    function formatAndTriggerDownload() {
        log(`Processing ${collectedData.size} records and generating file...`);
        const finalTurnsInDom = document.querySelectorAll('ms-chat-turn');
        let sortedData = [];

        // Sort by DOM order - now using the turn elements as keys
        finalTurnsInDom.forEach(turnNode => {
            if (collectedData.has(turnNode)) {
                sortedData.push(collectedData.get(turnNode));
            }
        });

        log(`Final export: ${sortedData.length} records found for export`);

        if (sortedData.length === 0) {
            log('No valid records found for export!', 'error');
            alert('After scrolling, no chat records were found for export. Please check the console for details.');
            return false;
        }

        let fileContent = 'Google AI Studio Chat Records (Auto-Scroll Capture)\n';
        fileContent += '=========================================\n\n';
        fileContent += `Exported: ${new Date().toLocaleString()}\n`;
        fileContent += `Total Records: ${sortedData.length}\n\n`;

        sortedData.forEach(item => {
            let parts = [];

            if (INCLUDE_USER_MESSAGES && item.type === 'user' && item.userText) {
                parts.push(`--- User ---\n${item.userText}`);
            }

            // Include AI thinking output
            if (INCLUDE_AI_THINKING && (item.type === 'model_thought' || item.type === 'model_thought_reply')) {
                if (item.thoughtText) {
                    parts.push(`--- AI Thinking ---\n${item.thoughtText}`);
                }
            }

            // Include AI response
            if (INCLUDE_AI_RESPONSES && (item.type === 'model_reply' || item.type === 'model_thought_reply')) {
                if (item.responseText) {
                    parts.push(`--- AI Response ---\n${item.responseText}`);
                }
            }

            if (parts.length > 0) {
                const turnContent = parts.join('\n\n');
                fileContent += turnContent + '\n\n------------------------------\n\n';
            }
        });

        // Add warning if no content was exported due to filters
        if (sortedData.length > 0 && !fileContent.includes('---')) {
            log('Warning: All content was filtered out based on configuration settings', 'warn');
            alert('No content to export based on current filter settings. Please check INCLUDE_* configuration options.');
            return false;
        }

        // Clean up trailing separator
        fileContent = fileContent.replace(/\n\n------------------------------\n\n$/, '\n').trim();

        try {
            const blob = new Blob([fileContent], { type: 'text/markdown;charset=utf-8' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = `${EXPORT_FILENAME_PREFIX}${getCurrentTimestamp()}.md`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            log("File successfully generated and download triggered.", 'success');
            return true;
        } catch (e) {
            log(`File creation failed: ${e.message}`, 'error');
            alert("Error creating download file: " + e.message);
            return false;
        }
    }

    /**
     * Aborts the currently running extraction process.
     */
    function abortExtraction() {
        if (abortController) {
            abortController.abort();
        }
        isScrolling = false;
        log('Extraction manually aborted by user.', 'warn');
        setButtonState('IDLE');
    }

    /**
     * Main orchestrator function for the export process.
     * Handles the complete workflow including Raw Mode toggle, scrolling, data extraction,
     * and file download. Ensures proper error handling and UI state management.
     * @async
     */
    async function handleScrollExtraction() {
        abortController = new AbortController();
        setButtonState('WORKING');

        const currentMode = detectCurrentMode();
        const desiredMode = PREFER_RAW_MODE ? 'raw' : 'rendered';
        let needsToggle = (currentMode !== desiredMode);
        let modeWasToggled = false;

        try {
            if (needsToggle) {
                log(`Switching from ${currentMode} to ${desiredMode} mode...`);
                modeWasToggled = await toggleRawMode();
                if (!modeWasToggled) {
                    throw new Error(`Failed to switch to ${desiredMode} Mode.`);
                }
            } else {
                log(`Already in desired ${desiredMode} mode, no toggle needed.`);
            }

            if (abortController.signal.aborted) throw new Error("Aborted after mode switch.");

            const scrollSuccess = await autoScroll_AiStudio('down');
            if (scrollSuccess === false && !abortController.signal.aborted) {
                throw new Error("Scrolling process failed or was incomplete.");
            }

            if (abortController.signal.aborted) throw new Error("Aborted during scroll.");

            log('Scroll completed, preparing final data processing...');
            await delay(FINAL_CAPTURE_DELAY_MS);
            await extractDataIncremental_AiStudio(desiredMode);
            await delay(POST_EXTRACTION_DELAY_MS);

            const downloadSuccess = formatAndTriggerDownload();
            if (!downloadSuccess) {
                 throw new Error("File generation or download failed.");
            }

            setButtonState('SUCCESS');

        } catch (error) {
            if (!abortController.signal.aborted) {
                log(`Error during processing: ${error.message}`, 'error');
                // alert(`An error occurred: ${error.message}`);
                setButtonState('ERROR');
            } else {
                log('Process was aborted, cleaning up.', 'warn');
            }
        } finally {
            if (modeWasToggled) {
                log(`Switching back to ${currentMode} mode...`);
                await toggleRawMode();
            }
            isScrolling = false;
        }
    }

  /**
	 * Displays a dominant upgrade promo banner (Top-Center, Auto-dismiss with countdown).
	 */
	function showUpgradePromo() {
		// Check if user has permanently dismissed
		const dismissed = localStorage.getItem('aistudio_dom_promo_dismissed');
		if (dismissed === 'true') return;

		// Prevent multiple toasts stacking up
		if (document.getElementById('ai-studio-upgrade-toast')) return;

		// The URL to the new dual-mode script
		const NEW_SCRIPT_URL = "https://greasyfork.org/en/scripts/557309-google-ai-studio-conversation-chat-markdown-export-download-xhr-dom/post-install";

		// Add animations
		const style = document.createElement('style');
		style.textContent = `
			@keyframes upgradeSlideDown {
				from {
					opacity: 0;
					transform: translate(-50%, -30px);
				}
				to {
					opacity: 1;
					transform: translate(-50%, 0);
				}
			}
			@keyframes upgradePulse {
				0%, 100% { transform: scale(1); }
				50% { transform: scale(1.05); }
			}
		`;
		document.head.appendChild(style);

		const toast = document.createElement('div');
		toast.id = 'ai-studio-upgrade-toast';
		toast.style.cssText = `
			position: fixed;
			top: 40px;
			left: 50%;
			transform: translateX(-50%);
			background: linear-gradient(135deg, #1a73e8 0%, #1557b0 100%);
			color: #fff;
			padding: 32px 40px;
			border-radius: 20px;
			box-shadow: 0 12px 32px rgba(26, 115, 232, 0.4), 0 2px 8px rgba(0,0,0,0.3);
			z-index: 2147483647;
			font-family: 'Google Sans', Roboto, sans-serif;
			border: 2px solid rgba(255,255,255,0.3);
			animation: upgradeSlideDown 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
			min-width: 600px;
			backdrop-filter: blur(10px);
		`;

		// Main content wrapper
		const mainContent = document.createElement('div');
		mainContent.style.cssText = 'display: flex; gap: 32px; align-items: center;';

		// Left section with icon
		const iconSection = document.createElement('div');
		iconSection.style.cssText = `
			background: rgba(255,255,255,0.2);
			width: 72px;
			height: 72px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 36px;
			flex-shrink: 0;
			animation: upgradePulse 2s ease-in-out infinite;
		`;
		iconSection.textContent = '⚡';
		mainContent.appendChild(iconSection);

		// Middle section with text
		const textSection = document.createElement('div');
		textSection.style.cssText = 'flex: 1; display: flex; flex-direction: column; gap: 10px;';

		const title = document.createElement('div');
		title.style.cssText = `
			font-size: 22px;
			font-weight: 700;
			letter-spacing: -0.5px;
		`;
		title.textContent = 'Upgrade to Dual-Mode Export';
		textSection.appendChild(title);

		const subtitle = document.createElement('div');
		subtitle.style.cssText = `
			font-size: 15px;
			opacity: 0.95;
			line-height: 1.6;
		`;
		subtitle.textContent = 'XHR instant capture (0.1s) + DOM fallback. Best of both worlds!';
		textSection.appendChild(subtitle);

		// Features row
		const features = document.createElement('div');
		features.style.cssText = 'display: flex; gap: 20px; margin-top: 4px;';

		const feature1 = document.createElement('span');
		feature1.style.cssText = 'font-size: 13px; opacity: 0.9;';
		feature1.textContent = '✓ Instant XHR';
		features.appendChild(feature1);

		const feature2 = document.createElement('span');
		feature2.style.cssText = 'font-size: 13px; opacity: 0.9;';
		feature2.textContent = '✓ DOM Fallback';
		features.appendChild(feature2);

		const feature3 = document.createElement('span');
		feature3.style.cssText = 'font-size: 13px; opacity: 0.9;';
		feature3.textContent = '✓ No Scrolling';
		features.appendChild(feature3);

		textSection.appendChild(features);

		// Checkbox
		const checkboxWrapper = document.createElement('label');
		checkboxWrapper.style.cssText = `
			display: flex;
			align-items: center;
			gap: 8px;
			font-size: 12px;
			opacity: 0.85;
			cursor: pointer;
			user-select: none;
			transition: opacity 0.2s;
			margin-top: 4px;
		`;

		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.id = 'promo-dismiss-forever';
		checkbox.style.cssText = 'cursor: pointer; accent-color: #fff; width: 16px; height: 16px;';

		const checkboxLabel = document.createTextNode("Don't show this again");

		checkboxWrapper.appendChild(checkbox);
		checkboxWrapper.appendChild(checkboxLabel);
		checkboxWrapper.addEventListener('mouseenter', () => checkboxWrapper.style.opacity = '1');
		checkboxWrapper.addEventListener('mouseleave', () => checkboxWrapper.style.opacity = '0.85');
		textSection.appendChild(checkboxWrapper);

		mainContent.appendChild(textSection);

		// Right section with button and timer
		const actionSection = document.createElement('div');
		actionSection.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 16px; margin-left: 8px;';

		const link = document.createElement('a');
		link.href = NEW_SCRIPT_URL;
		link.target = '_blank';
		link.textContent = 'INSTALL NOW';
		link.style.cssText = `
			background: #fff;
			color: #1a73e8;
			text-decoration: none;
			padding: 16px 36px;
			border-radius: 8px;
			font-weight: 700;
			font-size: 15px;
			white-space: nowrap;
			box-shadow: 0 4px 12px rgba(0,0,0,0.2);
			transition: all 0.2s;
			letter-spacing: 0.5px;
		`;
		link.addEventListener('mouseenter', () => {
			link.style.transform = 'translateY(-2px)';
			link.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
		});
		link.addEventListener('mouseleave', () => {
			link.style.transform = 'translateY(0)';
			link.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
		});
		actionSection.appendChild(link);

		// Countdown timer
		const countdown = document.createElement('div');
		countdown.style.cssText = `
			color: rgba(255,255,255,0.7);
			font-size: 12px;
			font-weight: 500;
		`;
		countdown.textContent = 'Auto-closes in 15s';
		actionSection.appendChild(countdown);

		mainContent.appendChild(actionSection);
		toast.appendChild(mainContent);

		// Close button
		const closeBtn = document.createElement('div');
		closeBtn.textContent = '✕';
		closeBtn.style.cssText = `
			position: absolute;
			top: 16px;
			right: 16px;
			cursor: pointer;
			color: rgba(255,255,255,0.7);
			font-size: 26px;
			width: 36px;
			height: 36px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			transition: all 0.2s;
			line-height: 1;
		`;
		closeBtn.addEventListener('mouseenter', () => {
			closeBtn.style.background = 'rgba(255,255,255,0.2)';
			closeBtn.style.color = '#fff';
		});
		closeBtn.addEventListener('mouseleave', () => {
			closeBtn.style.background = 'transparent';
			closeBtn.style.color = 'rgba(255,255,255,0.7)';
		});
		toast.appendChild(closeBtn);

		document.body.appendChild(toast);

		// Countdown logic
		let timeLeft = 15;
		const countdownInterval = setInterval(() => {
			timeLeft--;
			if (timeLeft > 0) {
				countdown.textContent = `Auto-closes in ${timeLeft}s`;
			} else {
				clearInterval(countdownInterval);
			}
		}, 1000);

		// Close logic
		const closeToast = () => {
			clearInterval(countdownInterval);
			if (checkbox.checked) {
				localStorage.setItem('aistudio_dom_promo_dismissed', 'true');
				log('Upgrade promo permanently dismissed.', 'info');
			}
			toast.style.animation = 'upgradeSlideDown 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) reverse';
			setTimeout(() => toast.remove(), 300);
		};

		closeBtn.onclick = closeToast;

		// Auto-remove after 15 seconds
		setTimeout(closeToast, 15000);
	}

    //================================================================================
    // UI CREATION - User interface components and interactions
    //================================================================================

    /**
     * Sets the visual state of the export button.
     * @param {'IDLE'|'WORKING'|'SUCCESS'|'ERROR'} state The target state.
     */
    function setButtonState(state) {
        exportButtonState = state;
        if (!exportButton || !exportIcon) return;

        // Remove existing color classes
        exportButton.classList.remove('success', 'error');

        switch (state) {
            case 'IDLE':
                exportIcon.textContent = 'download';
                exportButton.title = 'Export Chat to Markdown';
                exportButton.disabled = false;
                break;
            case 'WORKING':
                exportIcon.textContent = 'cancel';
                exportIcon.style.color = '#d93025'; // Red color for stop
                exportButton.title = 'Stop Export';
                exportButton.disabled = false;
                break;
            case 'SUCCESS':
                exportIcon.textContent = 'check_circle';
                exportIcon.style.color = '#1e8e3e'; // Green color for success
                exportButton.title = 'Export Successful!';
                exportButton.disabled = true;
                setTimeout(() => setButtonState('IDLE'), SUCCESS_RESET_TIMEOUT_MS);
                break;
            case 'ERROR':
                exportIcon.textContent = 'error';
                exportIcon.style.color = '#d93025'; // Red color for error
                exportButton.title = 'Export Failed!';
                exportButton.disabled = true;
                setTimeout(() => setButtonState('IDLE'), ERROR_RESET_TIMEOUT_MS);
                break;
        }

        // Reset color for non-transient states
        if (state === 'IDLE') {
            exportIcon.style.color = ''; // Use default color
        }
    }

    /**
     * Creates and initializes the export button UI element with Google-styled appearance.
     * Positions the button fixed at the bottom-left of the page and attaches the export handler.
     */
    function createUI() {
        const toolbarRight = document.querySelector('ms-toolbar .toolbar-right');
        if (!toolbarRight || document.getElementById('export-button-container')) {
            return;
        }

        log('Toolbar found, creating export button...');

        // Create container for the button group
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'export-button-container';
        buttonContainer.style.cssText = 'display: flex; align-items: center; margin: 0 4px; position: relative; z-index: 2147483647;';

        // Create main export button
        exportButton = document.createElement('button');
        exportButton.id = 'aistudio-export-button';
        exportButton.setAttribute('ms-button', '');
        exportButton.setAttribute('variant', 'icon-borderless');
        exportButton.className = 'mat-mdc-tooltip-trigger ms-button-borderless ms-button-icon';

		exportButton.addEventListener('click', () => {
            if (exportButtonState === 'IDLE') {
                // Show upgrade promo only when starting extraction (not when stopping)
                showUpgradePromo();
                handleScrollExtraction();
            } else if (exportButtonState === 'WORKING') {
                abortExtraction();
            }
        });

        exportIcon = document.createElement('span');
        exportIcon.className = 'material-symbols-outlined notranslate ms-button-icon-symbol';
        exportButton.appendChild(exportIcon);

        // Create settings button
        const settingsButton = document.createElement('button');
        settingsButton.id = 'aistudio-settings-button';
        settingsButton.title = 'Export Settings';
        settingsButton.setAttribute('ms-button', '');
        settingsButton.setAttribute('variant', 'icon-borderless');
        settingsButton.className = 'mat-mdc-tooltip-trigger ms-button-borderless ms-button-icon';

        const settingsIcon = document.createElement('span');
        settingsIcon.className = 'material-symbols-outlined notranslate ms-button-icon-symbol';
        settingsIcon.textContent = 'settings';
        settingsButton.appendChild(settingsIcon);

        // Append buttons to container
        buttonContainer.appendChild(exportButton);
        buttonContainer.appendChild(settingsButton);

        // Create settings panel with ALTERNATIVE STRATEGY 1: position: fixed
        // This moves the panel out of the toolbar hierarchy entirely
        settingsPanel = document.createElement('div');
        settingsPanel.id = 'aistudio-settings-panel';
        settingsPanel.style.cssText = `
            position: fixed;
            top: 52px;
            right: 16px;
            width: 240px;
            background: #2d2e30;
            border: 1px solid #5f6368;
            border-radius: 8px;
            z-index: 2147483647;
            font-family: 'Google Sans', sans-serif;
            font-size: 14px;
            display: none;
            flex-direction: column;
            box-sizing: border-box;
            padding-top: 16px;
            padding-right: 16px;
            padding-bottom: 16px;
            padding-left: 16px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
            color: #e8eaed;
            isolation: isolate;
            transform: translateZ(0);
        `;

        function createCheckbox(label, configVar, callback) {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'display: flex; align-items: center; margin-bottom: 10px;';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = configVar;
            // Generate a unique ID that won't conflict between chat sessions
            const timestamp = Date.now();
            const randomId = Math.floor(Math.random() * 10000);
            checkbox.id = `export-checkbox-${label.replace(/\s+/g, '-')}-${timestamp}-${randomId}`;
            const labelEl = document.createElement('label');
            labelEl.textContent = label;
            labelEl.style.marginLeft = '10px';
            labelEl.style.cursor = 'pointer'; // Visual hint that it's clickable
            labelEl.setAttribute('for', checkbox.id);

            // Store a reference to the callback for both label and checkbox
            const handleChange = (checked) => {
                checkbox.checked = checked;
                callback(checked);
            };

            // Make the label directly toggle the checkbox
            labelEl.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default behavior
                handleChange(!checkbox.checked);
            });

            // Also ensure the checkbox itself works
            checkbox.addEventListener('change', (event) => callback(event.target.checked));

            wrapper.appendChild(checkbox);
            wrapper.appendChild(labelEl);
            settingsPanel.appendChild(wrapper);
            return checkbox;
        }

        preferRawModeCheckbox = createCheckbox('Prefer Raw Mode', PREFER_RAW_MODE, (val) => PREFER_RAW_MODE = val);
        includeUserMessagesCheckbox = createCheckbox('Include User Messages', INCLUDE_USER_MESSAGES, (val) => INCLUDE_USER_MESSAGES = val);
        includeAiResponsesCheckbox = createCheckbox('Include AI Responses', INCLUDE_AI_RESPONSES, (val) => INCLUDE_AI_RESPONSES = val);
        includeAiThinkingCheckbox = createCheckbox('Include AI Thinking', INCLUDE_AI_THINKING, (val) => INCLUDE_AI_THINKING = val);

        // Add separator line before Ko-Fi button
        const separator = document.createElement('div');
        separator.style.cssText = `
            height: 1px;
            background: #5f6368;
            margin: 12px 0;
        `;
        settingsPanel.appendChild(separator);

        // Ko-Fi donation button
        const kofiLink = document.createElement('a');
        kofiLink.href = 'https://ko-fi.com/piknockyou';
        kofiLink.target = '_blank';
        kofiLink.rel = 'noopener noreferrer';
        kofiLink.title = 'Support this script on Ko-Fi';
        kofiLink.textContent = '☕ Support';
        kofiLink.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            background: #1a73e8;
            color: #fff;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            transition: background 0.15s;
        `;
        kofiLink.addEventListener('mouseenter', () => {
            kofiLink.style.background = '#1557b0';
        });
        kofiLink.addEventListener('mouseleave', () => {
            kofiLink.style.background = '#1a73e8';
        });
        kofiLink.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        settingsPanel.appendChild(kofiLink);

        // ALTERNATIVE STRATEGY 1: Append panel to body instead of buttonContainer
        // This completely removes it from the toolbar stacking context
        document.body.appendChild(settingsPanel);

        // Update position dynamically based on button location
        const updatePanelPosition = () => {
            const buttonRect = settingsButton.getBoundingClientRect();
            settingsPanel.style.top = `${buttonRect.bottom + 4}px`;
            settingsPanel.style.right = `${window.innerWidth - buttonRect.right}px`;
        };

        // Settings button logic
        settingsButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const isHidden = settingsPanel.style.display === 'none' || settingsPanel.style.display === '';

            if (isHidden) {
                updatePanelPosition(); // Update position before showing
            }

            settingsPanel.style.display = isHidden ? 'flex' : 'none';
        });

        // Update position on scroll/resize
        window.addEventListener('scroll', () => {
            if (settingsPanel.style.display === 'flex') {
                updatePanelPosition();
            }
        });
        window.addEventListener('resize', () => {
            if (settingsPanel.style.display === 'flex') {
                updatePanelPosition();
            }
        });

        // Close panel on outside click
        document.addEventListener('click', (event) => {
            if (!settingsPanel.contains(event.target) && !settingsButton.contains(event.target)) {
                settingsPanel.style.display = 'none';
            }
        });

        // Inject into toolbar (before the overflow-menu-wrapper which contains more_vert)
        const overflowWrapper = toolbarRight.querySelector('.overflow-menu-wrapper');
        if (overflowWrapper) {
            toolbarRight.insertBefore(buttonContainer, overflowWrapper);
        } else {
            toolbarRight.appendChild(buttonContainer);
        }

        log("Toolbar UI initialization complete.", 'success');
        setButtonState('IDLE'); // Set the initial state of the button
    }

    //================================================================================
    // MAIN EXECUTION - Script initialization and startup
    //================================================================================

    /**
     * Main entry point function that initializes the AI Studio Export script.
     * Creates the UI and sets up the script for user interaction.
     */
    function initialize() {
        log("Initializing AI Studio Export...");
        // Initial attempt to create the UI in case the toolbar is already present.
        createUI();

        // Set up an observer to re-create the UI if the toolbar is ever re-rendered
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && (node.tagName === 'MS-TOOLBAR' || node.querySelector('ms-toolbar'))) {
                            createUI();
                            return; // We found the toolbar, no need to keep searching
                        }
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        log("MutationObserver is now watching for toolbar changes.");
    }

    initialize();

})();