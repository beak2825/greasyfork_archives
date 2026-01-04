// ==UserScript==
// @name         Hide Cursor While Typing
// @namespace    http://tampermonkey.net/
// @version      1.0a
// @description  Automatically hides the cursor while typing and shows it when you stop or move the mouse
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558011/Hide%20Cursor%20While%20Typing.user.js
// @updateURL https://update.greasyfork.org/scripts/558011/Hide%20Cursor%20While%20Typing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const HIDE_DELAY = 0; // Hide cursor immediately when typing starts
    const SHOW_DELAY = 1000; // Show cursor 1 second after typing stops (in milliseconds)

    let typingTimer = null;
    let isTyping = false;

    // Create and inject style element for cursor hiding
    const style = document.createElement('style');
    style.id = 'hide-cursor-while-typing-style';
    style.textContent = `
        body.hide-cursor-typing,
        body.hide-cursor-typing * {
            cursor: none !important;
        }
    `;

    // Inject style as early as possible
    const injectStyle = () => {
        if (!document.head) {
            // If head doesn't exist yet, wait a bit
            setTimeout(injectStyle, 10);
            return;
        }
        if (!document.getElementById('hide-cursor-while-typing-style')) {
            document.head.appendChild(style);
        }
    };

    injectStyle();

    /**
     * Hides the cursor by adding a CSS class to the body
     */
    const hideCursor = () => {
        if (!isTyping) {
            document.body.classList.add('hide-cursor-typing');
            isTyping = true;
        }
    };

    /**
     * Shows the cursor by removing the CSS class from the body
     */
    const showCursor = () => {
        if (isTyping) {
            document.body.classList.remove('hide-cursor-typing');
            isTyping = false;
        }
    };

    /**
     * Handles keyboard events - hides cursor and sets timer to show it later
     * @param {KeyboardEvent} e - The keyboard event
     */
    const handleKeyPress = (e) => {
        // Ignore modifier keys alone (Shift, Ctrl, Alt, Meta)
        if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) {
            return;
        }

        // Hide cursor immediately when typing
        hideCursor();

        // Clear existing timer
        if (typingTimer) {
            clearTimeout(typingTimer);
        }

        // Set new timer to show cursor after user stops typing
        typingTimer = setTimeout(() => {
            showCursor();
        }, SHOW_DELAY);
    };

    /**
     * Handles mouse movement - shows cursor immediately
     */
    const handleMouseMove = () => {
        // Clear the typing timer if mouse moves
        if (typingTimer) {
            clearTimeout(typingTimer);
            typingTimer = null;
        }
        // Show cursor immediately on mouse movement
        showCursor();
    };

    // Attach event listeners
    document.addEventListener('keydown', handleKeyPress, true);
    document.addEventListener('mousemove', handleMouseMove, true);

    // Cleanup on page unload (good practice)
    window.addEventListener('beforeunload', () => {
        if (typingTimer) {
            clearTimeout(typingTimer);
        }
        showCursor();
    });

    console.log('[Hide Cursor While Typing] Userscript loaded successfully');
})();