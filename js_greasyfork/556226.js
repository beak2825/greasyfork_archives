// ==UserScript==
// @name         Chat Squircle
// @namespace    https://loongphy.com
// @version      1.1
// @description  Adds corner-shape: squircle to chat input boxes on ChatGPT, Gemini, Grok, and AI Studio
// @author       loongphy
// @match        https://chatgpt.com/*
// @match        https://gemini.google.com/*
// @match        https://grok.com/*
// @match        https://aistudio.google.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556226/Chat%20Squircle.user.js
// @updateURL https://update.greasyfork.org/scripts/556226/Chat%20Squircle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SQUIRCLE_CSS = `
        corner-shape: squircle;
    `;

    const CONFIG = [
        {
            domain: 'chatgpt.com',
            selector: '#prompt-textarea',
            targetParent: true,
            parentDepth: 3
        },
        {
            domain: 'chatgpt.com',
            selector: '.user-message-bubble-color',
            targetParent: false,
            parentDepth: 0
        },
        {
            domain: 'chatgpt.com',
            selector: '.divide-token-border-default',
            targetParent: false,
            parentDepth: 0
        },
        {
            domain: 'gemini.google.com',
            selector: '.ql-editor',
            targetParent: true,
            parentDepth: 7
        },
        {
            domain: 'grok.com',
            selector: '[contenteditable="true"]',
            targetParent: true,
            parentDepth: 4
        },
        {
            domain: 'aistudio.google.com',
            selector: '.prompt-input-wrapper',
            targetParent: false, 
            parentDepth: 0
        }
    ];

    function getDomain() {
        return window.location.hostname;
    }

    function applySquircle() {
        const domain = getDomain();
        // Find all configs that match the current domain
        const activeConfigs = CONFIG.filter(config => domain.includes(config.domain));
        
        if (activeConfigs.length === 0) return;
        
        activeConfigs.forEach(config => {
            const elements = document.querySelectorAll(config.selector);

            elements.forEach(el => {
                let target = el;
                
                if (config.targetParent) {
                    // Traverse up to find the container that likely has the border
                    // This is heuristic: look for a div with a border or background
                    let parent = el.parentElement;
                    for(let i=0; i<config.parentDepth && parent; i++) {
                         target = parent;
                         parent = parent.parentElement;
                    }
                }

                // Apply the style directly to the target element
                if (!target.dataset.squircleApplied) {
                    target.style.cssText += SQUIRCLE_CSS;
                    target.dataset.squircleApplied = "true";
                }
            });
        });
    }

    // Initial run
    applySquircle();

    // Observe changes for dynamic SPAs
    const observer = new MutationObserver((mutations) => {
        applySquircle();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();