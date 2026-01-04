// ==UserScript==
// @name         pr0gramm Keybindings remapper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Rebind pr0gramm.com keybindings to your liking. Defaults are for Colemak-DH keyboard layout (easily customizable)
// @author       wallawallah
// @match        https://pr0gramm.com/*
// @icon         https://pr0gramm.com/favicon.ico
// @match        https://www.pr0gramm.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550032/pr0gramm%20Keybindings%20remapper.user.js
// @updateURL https://update.greasyfork.org/scripts/550032/pr0gramm%20Keybindings%20remapper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Colemak-DH key mappings for ortholinear keyboard
    // New key you press -> Original QWERTY key pr0gramm expects
    const keyMappings = {
        // Navigation
        'r': 'a',  // Press R -> sends A (Previous upload)
        't': 'd',  // Press T -> sends D (Next upload)

        // Voting
        'f': 'w',  // Press F -> sends W (Downvote)

        // Actions
        'g': 'f',  // Press G -> sends F (Favorite)
    };

    // Function to intercept and remap keydown events
    function remapKeyboardEvent(event) {
        // Skip if this event was already remapped by us
        if (event.remappedByColemakDH) {
            return;
        }

        // Only process if no modifier keys are pressed
        if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) {
            return;
        }

        // Only process if not in an input field
        const activeElement = document.activeElement;
        if (activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.contentEditable === 'true'
        )) {
            return;
        }

        const pressedKey = event.key.toLowerCase();

        // Check if this key should be remapped
        if (keyMappings.hasOwnProperty(pressedKey)) {
            const targetKey = keyMappings[pressedKey];

            // Prevent the original event
            event.preventDefault();
            event.stopPropagation();

            // Create and dispatch a new event with the target key
            const newEvent = new KeyboardEvent('keydown', {
                key: targetKey,
                code: `Key${targetKey.toUpperCase()}`,
                keyCode: targetKey.toUpperCase().charCodeAt(0),
                which: targetKey.toUpperCase().charCodeAt(0),
                bubbles: true,
                cancelable: true
            });

            // Mark this event as already remapped to prevent re-processing
            newEvent.remappedByColemakDH = true;

            // Dispatch the remapped event to the same target
            event.target.dispatchEvent(newEvent);

            console.log(`pr0gramm Colemak-DH: Remapped ${pressedKey.toUpperCase()} -> ${targetKey.toUpperCase()}`);
            return;
        }
    }

    // Function to show current key mappings
    function showKeyMappings() {
        console.log('pr0gramm Colemak-DH Ortholinear Key Mappings:');
        console.log('============================================');
        console.log('Press Key -> Function (sends original key)');
        console.log('R -> Previous upload (sends A)');
        console.log('T -> Next upload (sends D)');
        console.log('F -> Upvote upload (sends W)');
        console.log('G -> Favorite upload (sends F)');
        console.log('============================================');
    }

    // Initialize the script
    function init() {
        console.log('pr0gramm Colemak-DH keybinding remapper loaded');

        // Add event listener for keydown events
        document.addEventListener('keydown', remapKeyboardEvent, true);

        // Show mappings on load
        showKeyMappings();

        // Add a way to show mappings again (Ctrl+Shift+?)
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.shiftKey && event.key === '?') {
                showKeyMappings();
            }
        });
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();