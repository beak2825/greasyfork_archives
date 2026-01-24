// ==UserScript==
// @name         Gemini Tab Renamer
// @namespace    https://github.com/Ergates/GeminiTabRenamer
// @version      1.0
// @description  Automatically updates the tab title to match the current chat name or user input.
// @author       Ergates
// @match        https://gemini.google.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563853/Gemini%20Tab%20Renamer.user.js
// @updateURL https://update.greasyfork.org/scripts/563853/Gemini%20Tab%20Renamer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        checkInterval: 500,       // How often to check for title updates (ms)
        typingPrefix: "... ",     // Prefix shown while user is typing
        genericTitle: "Gemini",   // The generic title we want to replace
        maxTitleLength: 40        // Truncate long input to this length
    };

    function updateTitle() {
        try {
            // 1. INPUT TRACKING
            // If the user is actively typing, reflect that intent immediately.
            const active = document.activeElement;
            const isTyping = active && (
                active.tagName === 'TEXTAREA' ||
                active.getAttribute('contenteditable') === 'true'
            );

            if (isTyping) {
                const text = active.innerText || active.value;
                if (text && text.length > 2) {
                    const cleanText = text.replace(/\n/g, ' ').trim().slice(0, CONFIG.maxTitleLength);
                    const typingTitle = `${CONFIG.typingPrefix}${cleanText}`;
                    
                    if (document.title !== typingTitle) {
                        document.title = typingTitle;
                    }
                    return; // Stop here; input takes precedence.
                }
            }

            // 2. CONVERSATION TITLE (Primary Source)
            // Look for the main header title visible in the chat window.
            // Selector derived from Gemini UI: <span class="conversation-title">
            const headerTitle = document.querySelector('span.conversation-title');
            
            if (headerTitle) {
                const titleText = headerTitle.textContent.split('\n')[0].trim();
                applyTitle(titleText);
                return;
            }

            // 3. SIDEBAR FALLBACK (Secondary Source)
            // If the header isn't found (e.g., UI update), try the active sidebar item.
            const activeSidebarItem = document.querySelector('nav [aria-current="page"]');
            if (activeSidebarItem) {
                const sidebarText = activeSidebarItem.textContent.split('\n')[0].trim();
                applyTitle(sidebarText);
            }

        } catch (e) {
            // Fail silently to avoid console clutter
        }
    }

    // Helper to safely apply the title
    function applyTitle(text) {
        if (!text || text.length === 0) return;
        
        // Ignore generic or action-based titles
        if (text.includes("Rename") || text.includes("Delete") || text === CONFIG.genericTitle) return;

        // Only update if it changed to prevent browser overhead
        if (document.title !== text) {
            document.title = text;
        }
    }

    // Start the engine
    setInterval(updateTitle, CONFIG.checkInterval);
    
    // Optional: Log start
    console.log("Gemini Tab Renamer: Active");

})();