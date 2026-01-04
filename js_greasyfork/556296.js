// ==UserScript==
// @name         Overleaf VIM Keybindings and Zen mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  The name
// @match        https://www.overleaf.com/project/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556296/Overleaf%20VIM%20Keybindings%20and%20Zen%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/556296/Overleaf%20VIM%20Keybindings%20and%20Zen%20mode.meta.js
// ==/UserScript==


(function() {
    'use strict';

    window.addEventListener("UNSTABLE_editor:extensions", (event) => {
    const { CodeMirror, CodeMirrorVim, extensions } = event.detail;


    // add custom keybindings
    CodeMirrorVim.Vim.map("j", "gj", "normal");
    CodeMirrorVim.Vim.map("k", "gk", "normal");

    CodeMirrorVim.Vim.map("j", "gj", "visual");
    CodeMirrorVim.Vim.map("k", "gk", "visual");

    // Zen mode
    CodeMirrorVim.Vim.defineAction('toggleinterface', toggle_interface);
    CodeMirrorVim.Vim.mapCommand("<C-f>", "action", "toggleinterface");
});
})();



//--------------------------------------------------
//                Functions
//--------------------------------------------------
let flex_elements, block_elements, pdf_viewer;
let interface_active = true;

const style_pdf_margin = document.createElement('style');
document.head.appendChild(style_pdf_margin);

function toggle_interface() {
    flex_elements = [
        ...document.getElementsByClassName("toolbar"),                              // Top bar and PDF bar
        document.getElementsByClassName("cm-panels")[0],                            // Tex bar
        document.getElementsByClassName("review-mode-switcher-container")[0]        // Bottom for changing edit/review mode
    ];

    block_elements = [
        ...document.getElementsByClassName("horizontal-resize-handle")              // Vertical bars
    ];
    pdf_viewer = document.querySelector('[data-testid="pdf-viewer"]');              // PDF viewer, for removing margins


    interface_active = ! interface_active;

    if (interface_active) {
        // Reset orginal setting
        flex_elements.forEach(e => e.style.display = "flex");
        block_elements.forEach(e => e.style.display = "block");
        pdf_viewer.style.top = "var(--toolbar-small-height)";

        style_pdf_margin.textContent = `
            .page {
                margin: var(--spacing-05) auto !important;
            }
        `;

    } else {
        // Remove innecessary ui
        flex_elements.forEach(e => e.style.display = "none");
        block_elements.forEach(e => e.style.display = "none");
        pdf_viewer.style.top = 0;

        style_pdf_margin.textContent = `
            .page {
                margin: 0 !important;
            }
        `;
    }
}