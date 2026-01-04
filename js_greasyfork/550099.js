// ==UserScript==
// @name         LinusTechTips Auto Hyperlink Creator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-create hyperlinks by highlighting text and pasting URL with Ctrl+V
// @author       Skipple / Claude
// @match        https://linustechtips.com/*
// @match        https://www.linustechtips.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550099/LinusTechTips%20Auto%20Hyperlink%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/550099/LinusTechTips%20Auto%20Hyperlink%20Creator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if a string is a valid URL
    function isValidURL(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    // Function to get the current selection and its range
    function getSelectionInfo() {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return null;

        const range = selection.getRangeAt(0);
        const selectedText = selection.toString().trim();

        return {
            selection,
            range,
            selectedText
        };
    }

    // Function to create hyperlink
    function createHyperlink(text, url, range) {
        // Create the anchor element
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('data-cke-saved-href', url);
        link.textContent = text;

        // Delete the selected text and insert the link
        range.deleteContents();
        range.insertNode(link);

        // Clear selection and place cursor after the link
        const selection = window.getSelection();
        selection.removeAllRanges();
        range.setStartAfter(link);
        range.collapse(true);
        selection.addRange(range);
    }

    // Main paste event handler
    function handlePaste(event) {
        // Only handle paste events in the CKEditor
        const editor = event.target.closest('.cke_wysiwyg_div');
        if (!editor) return;

        // Check if Ctrl+V was pressed
        if (!(event.ctrlKey && event.key === 'v')) return;

        // Get selection info
        const selectionInfo = getSelectionInfo();
        if (!selectionInfo || !selectionInfo.selectedText) return;

        // Prevent default paste behavior
        event.preventDefault();
        event.stopPropagation();

        // Get clipboard content
        navigator.clipboard.readText().then(clipboardText => {
            const trimmedText = clipboardText.trim();

            // Check if clipboard contains a valid URL
            if (isValidURL(trimmedText)) {
                // Create hyperlink with selected text and clipboard URL
                createHyperlink(selectionInfo.selectedText, trimmedText, selectionInfo.range);

                // Optional: Show confirmation
                console.log(`Hyperlink created: "${selectionInfo.selectedText}" -> ${trimmedText}`);

                // Trigger change event to notify CKEditor
                const changeEvent = new Event('input', { bubbles: true });
                editor.dispatchEvent(changeEvent);
            } else {
                // If not a URL, perform normal paste
                document.execCommand('paste');
            }
        }).catch(err => {
            console.error('Failed to read clipboard:', err);
            // Fallback to normal paste
            document.execCommand('paste');
        });
    }

    // Wait for the page to load and then attach event listeners
    function initialize() {
        // Use event delegation to handle dynamically loaded editors
        document.addEventListener('keydown', handlePaste, true);

        console.log('LinusTechTips Auto Hyperlink Creator loaded');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();