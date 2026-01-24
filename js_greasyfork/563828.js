// ==UserScript==
// @name         Higgsfield Prompt Expander
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhances Higgsfield.ai prompt editor with a toggleable expanded view and smart indentation (Tab/Shift+Tab) support.
// @author       archicode
// @icon         https://higgsfield.ai/favicon.ico
// @match        https://higgsfield.ai/*
// @match        https://higgsfield.ai/image/*
// @grant        GM_addStyle
// @license      AGPL-3.0
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563828/Higgsfield%20Prompt%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/563828/Higgsfield%20Prompt%20Expander.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS for expanded state
    const expandedStyles = `
        fieldset[data-model] {
            max-height: none !important;
        }
        fieldset[data-model] textarea.reference-prompt {
            max-height: none !important;
            height: 400px !important;
            resize: vertical !important;
            overflow-y: auto !important;
            min-height: 120px !important;
        }
        #hf-expand-btn-container {
            background: rgba(0, 150, 0, 0.15) !important;
            border-color: rgba(0, 200, 0, 0.3) !important;
        }
    `;

    // CSS for contracted state
    const contractedStyles = `
        fieldset[data-model] {
            max-height: initial !important;
        }
        fieldset[data-model] textarea.reference-prompt {
            max-height: 7rem !important;
            height: 40px !important;
            resize: none !important;
            overflow-y: auto !important;
            min-height: 40px !important;
        }
        fieldset[data-model] textarea.reference-prompt::-webkit-resizer {
            display: none !important;
        }
        fieldset[data-model] textarea.reference-prompt::-moz-resizer {
            display: none !important;
        }
        #hf-expand-btn-container {
            background: rgba(34, 34, 34, 1) !important;
            border-color: rgba(209, 254, 23, 0.05) !important;
        }
    `;

    const globalStyles = `
        fieldset[data-model] textarea.reference-prompt::-webkit-resizer {
            display: none !important;
            visibility: hidden !important;
        }
        fieldset[data-model] textarea.reference-prompt::-moz-resizer {
            display: none !important;
            visibility: hidden !important;
        }
        .expand-icon-path {
            transition: all 0.3s ease;
        }
    `;

    let styleElement = null;
    let isExpanded = false;
    let textarea = null;

    // Handle Tab and Shift+Tab indentation
    function handleIndent(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;

            // If text is selected, indent/outdent the entire block
            if (start !== end) {
                const text = this.value;
                const lineStart = text.lastIndexOf('\n', start - 1) + 1;
                const lineEnd = text.indexOf('\n', end);
                const finalEnd = lineEnd === -1 ? text.length : lineEnd;

                const selectedText = text.substring(lineStart, finalEnd);
                const lines = selectedText.split('\n');

                if (e.shiftKey) {
                    // Shift+Tab: Remove indentation
                    const unindentedLines = lines.map(line =>
                        line.startsWith('  ') ? line.substring(2) : line
                    );
                    const newText = unindentedLines.join('\n');
                    this.value = text.substring(0, lineStart) + newText + text.substring(finalEnd);
                    this.selectionStart = lineStart;
                    this.selectionEnd = lineStart + newText.length;
                } else {
                    // Tab: Add indentation
                    const indentedLines = lines.map(line => '  ' + line);
                    const newText = indentedLines.join('\n');
                    this.value = text.substring(0, lineStart) + newText + text.substring(finalEnd);
                    this.selectionStart = lineStart;
                    this.selectionEnd = lineStart + newText.length;
                }
            } else {
                // No selection: handle single line indentation
                if (e.shiftKey) {
                    // Shift+Tab: Remove indentation from current line
                    const text = this.value;
                    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
                    const line = text.substring(lineStart, start);

                    if (line.endsWith('  ')) {
                        this.value = text.substring(0, start - 2) + text.substring(start);
                        this.selectionStart = this.selectionEnd = start - 2;
                    }
                } else {
                    // Tab: Insert 2 spaces
                    this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
                    this.selectionStart = this.selectionEnd = start + 2;
                }
            }
        }
    }

    // Initialize core features
    function initFeatures() {
        textarea = document.querySelector('textarea.reference-prompt');
        if (!textarea) return;

        textarea.addEventListener('keydown', handleIndent);
        console.log('Tab/Shift+Tab support enabled');
    }

    // Toggle between expanded and contracted views
    function togglePrompt() {
        isExpanded = !isExpanded;

        if (styleElement) {
            styleElement.remove();
        }

        styleElement = GM_addStyle(isExpanded ? expandedStyles : contractedStyles);

        // Update icon with animation
        const svg = document.querySelector('#hf-expand-icon');
        if (svg) {
            if (isExpanded) {
                // Fold icon (contract)
                svg.innerHTML = `
                    <path class="expand-icon-path" d="M12 5.25 L8 9 L4 5.25 M12 18.75 L8 15 L4 18.75"
                          stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                `;
            } else {
                // Unfold icon (expand)
                svg.innerHTML = `
                    <path class="expand-icon-path" d="M12 9 L8 5.25 L4 9 M12 15 L8 18.75 L4 15"
                          stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                `;
            }
        }
    }

    // Create the UI toggle button
    function createExpandButton() {
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'hf-expand-btn-container';
        buttonContainer.className = 'h-10! justify-center! rounded-xl border border-primary-5 bg-neutral-surface! md:bg-neutral-surface-subtle!';
        buttonContainer.style.cssText = 'cursor: pointer; transition: all 0.2s ease; overflow: hidden;';

        // Initial icon: Unfold (expand)
        buttonContainer.innerHTML = `
            <button id="hf-expand-btn" type="button" class="text-caption-l font-medium flex items-center px-3 py-2.5 gap-1.5 h-full w-full" style="background: transparent; border: none; color: white; cursor: pointer; transition: all 0.2s ease; overflow: hidden;">
                <svg id="hf-expand-icon" width="16" height="24" viewBox="0 0 16 24" fill="none" style="flex-shrink: 0;">
                    <path class="expand-icon-path" d="M12 9 L8 5.25 L4 9 M12 15 L8 18.75 L4 15"
                          stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span style="font-size: 0.875rem; white-space: nowrap;">Expand</span>
            </button>
        `;

        buttonContainer.addEventListener('click', togglePrompt);
        return buttonContainer;
    }

    // Inject the button into the site UI
    function injectButton() {
        const observer = new MutationObserver((mutations, obs) => {
            // Locate the main controls container
            const controlsContainer = document.querySelector('div.h-9.flex.items-center.gap-2');

            // Find the "Draw" button to use as a position reference
            const drawButton = controlsContainer?.querySelector('div[class*="cursor-pointer"][class*="flex items-center px-3"]');

            if (controlsContainer && drawButton && !document.getElementById('hf-expand-btn-container')) {
                const expandBtn = createExpandButton();

                // Insert the button to the left of the Draw button
                drawButton.parentNode.insertBefore(expandBtn, drawButton);

                GM_addStyle(globalStyles);
                styleElement = GM_addStyle(contractedStyles);

                // Short delay to ensure DOM is ready for features
                setTimeout(initFeatures, 500);

                console.log('Expansion button injected next to Generate button');
                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Main execution entry point
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectButton);
    } else {
        injectButton();
    }
})();