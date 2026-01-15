// ==UserScript==
// @name         FreeSQL Optimizer (Pure Performance)
// @namespace    freesql-clean
// @version      1.1
// @description  Streamlined UI and optimized Monaco Editor performance for FreeSQL.com, featuring an intelligent, eye-friendly Dark Mode.
// @author       SLIYARLI
// @license      MIT
// @match        https://freesql.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562580/FreeSQL%20Optimizer%20%28Pure%20Performance%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562580/FreeSQL%20Optimizer%20%28Pure%20Performance%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 1. UI & Visual Styling
     * Injects CSS to hide bulky UI elements and applies the custom Dark Mode filter.
     */
    const injectStyles = () => {
        const style = document.createElement("style");
        style.textContent = `
            /* Hide unnecessary Oracle UI components to maximize vertical space */
            header.app-Header, #footer, #teconsent,
            oj-message-banner, .oj-c-messagebanner {
                display: none !important;
            }

            /* Global filter-based Dark Mode */
            html {
                filter: invert(85%) hue-rotate(180deg) !important;
                background: #111 !important;
            }

            /* Re-invert media elements and icons to preserve original colors */
            img, svg, video, canvas, .oj-ux-ico-*, [class*="oj-ux-ico-"] {
                filter: invert(100%) hue-rotate(180deg) !important;
            }
        `;
        (document.head || document.documentElement).appendChild(style);
    };
    injectStyles();

    /**
     * 2. Monaco Editor Configuration
     * Lightweight settings focused on performance and fixing cursor alignment (drift).
     */
    const editorConfig = {
        fontSize: 17,
        lineHeight: 18,
        fontFamily: "Hack, Menlo, Monaco, 'Courier New', monospace",
        minimap: { enabled: false },
        smoothScrolling: false,
        cursorBlinking: "solid",
        renderWhitespace: "none",
        renderIndentGuides: false,
        semanticHighlighting: false,
        scrollBeyondLastLine: false,
        wordWrap: "on",
        renderLineHighlight: "none",
        contextmenu: false,
        scrollbar: { 
            verticalScrollbarSize: 10, 
            horizontalScrollbarSize: 10 
        }
    };

    /**
     * Applies configuration to all active Monaco Editor instances.
     */
    function applyEditorSettings() {
        if (window.monaco?.editor) {
            const editors = window.monaco.editor.getEditors?.();
            if (editors?.length > 0) {
                editors.forEach(ed => ed.updateOptions(editorConfig));
                return true;
            }
        }
        return false;
    }

    /**
     * 3. DOM Observer
     * Efficiently handles dynamic UI changes and applies settings as elements load.
     */
    const observer = new MutationObserver(() => {
        applyEditorSettings();
        
        // Remove UI elements if they are re-rendered by the SPA
        const elementsToRemove = document.querySelectorAll('header.app-Header, #footer, #teconsent');
        elementsToRemove.forEach(el => el.remove());
    });

    observer.observe(document.documentElement, { 
        childList: true, 
        subtree: true 
    });

    /**
     * 4. Lifecycle Management
     * Periodic checks for the first 5 seconds to ensure late-loading editors are captured.
     */
    let initializationCheck = setInterval(() => {
        if (applyEditorSettings()) clearInterval(initializationCheck);
    }, 1000);

    setTimeout(() => clearInterval(initializationCheck), 5000);

})();