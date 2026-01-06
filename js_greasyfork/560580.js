// ==UserScript==
// @name         Fadeline Reading (AO3)
// @version      1.0.1
// @namespace    https://github.com/StarRinger/userscripts
// @description  Implement faded gradients to the beginning and end of alternate lines
// @match        *://*.archiveofourown.org/*
// @author       Star Ringer
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560580/Fadeline%20Reading%20%28AO3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560580/Fadeline%20Reading%20%28AO3%29.meta.js
// ==/UserScript==

(function() {
    const FADELINE_CLASS = 'fadeline-active';
    let fadelineEnabled = false;

    // Inject CSS styles
    const style = document.createElement('style');
    style.textContent = `
        /* Fadeline button styles */
        #fadeline-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            padding: 12px 16px;
            background-color: #4a5568;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex;
            gap: 8px;
            align-items: center;
        }

        #fadeline-button:hover {
            background-color: #2d3748;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }

        #fadeline-button.active {
            background-color: #38a169;
        }

        #fadeline-button.active:hover {
            background-color: #2f8659;
        }

        #fadeline-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }

        #fadeline-close:hover {
            transform: scale(1.2);
        }

        // Override word-wrap
        .fadeline-active p {
            word-wrap: normal;
            overflow-wrap: normal;
        }

        .fadeline-line-wrapper {
            display: block;
            width: 100%;
        }

        .fadeline-line-wrapper.odd {
            background: linear-gradient(
                to right,
                rgba(0, 102, 204, 0.25) 0%,
                rgba(0, 0, 0, 0) 30%,
                rgba(0, 0, 0, 0) 60%,
                rgba(255, 128, 0, 0.25) 100%
            );
        }

        .fadeline-line-wrapper.even {
            background: linear-gradient(
                to right,
                rgba(255, 128, 0, 0.25) 0%,
                rgba(0, 0, 0, 0) 35%,
                rgba(0, 0, 0, 0) 65%,
                rgba(0, 102, 204, 0.25) 100%
            );
        }
    `;
    document.head.appendChild(style);

    function createButton() {
        const button = document.createElement('div');
        button.id = 'fadeline-button';
        button.innerHTML = `
            <span id="fadeline-text">Fadeline</span>
            <button id="fadeline-close" title="Close">✕</button>
        `;

        button.querySelector('#fadeline-text').addEventListener('click', toggleFadeline);
        button.querySelector('#fadeline-close').addEventListener('click', hideButton);

        return button;
    }

    // Get all text nodes and their line positions
    function getLineWrappedElements(container) {
        // Process all paragraph elements
        const textElements = container.querySelectorAll('p');
        
        let globalLineIndex = 0; // Track line number across all elements
        
        textElements.forEach(element => {
            // Skip if already processed
            if (element.dataset.fadelineProcessed) {
                return;
            }

            const text = element.textContent.trim();
            if (text.length === 0) return;

            // Create spans for each word and punctuation to measure positions
            const words = text.split(/(\s+|[^\w])/);
            const fragment = document.createDocumentFragment();
            const spans = [];
            
            words.forEach(word => {
                if (word === '') return;
                
                if (/^\s+$/.test(word)) {
                    fragment.appendChild(document.createTextNode(word));
                } else {
                    const span = document.createElement('span');
                    span.textContent = word;
                    span.style.display = 'inline';
                    spans.push(span);
                    fragment.appendChild(span);
                }
            });

            // Replace content with spans
            element.innerHTML = '';
            element.appendChild(fragment);

            // Group all child nodes by visual line
            const lineGroups = [];
            let currentLineTop = -1;
            let currentLineStart = 0;

            // Get all child nodes
            const allNodes = Array.from(element.childNodes);

            for (let i = 0; i < allNodes.length; i++) {
                const node = allNodes[i];
                
                // Skip text nodes, only check spans
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                const rect = node.getBoundingClientRect();
                const top = Math.round(rect.top);

                if (currentLineTop === -1) {
                    currentLineTop = top;
                }

                if (top !== currentLineTop) {
                    // Save previous line
                    const lineNodes = allNodes.slice(currentLineStart, i);
                    if (lineNodes.length > 0) {
                        lineGroups.push(lineNodes);
                    }
                    currentLineStart = i;
                    currentLineTop = top;
                }
            }

            // Last line
            const lastLineNodes = allNodes.slice(currentLineStart);
            if (lastLineNodes.length > 0) {
                lineGroups.push(lastLineNodes);
            }

            // Wrap each line in a div
            lineGroups.forEach((lineNodes) => {
                const lineWrapper = document.createElement('div');
                lineWrapper.className = `fadeline-line-wrapper ${globalLineIndex % 2 === 0 ? 'odd' : 'even'}`;
                lineWrapper.style.display = 'block';

                // Move all nodes on this line into the wrapper
                element.insertBefore(lineWrapper, lineNodes[0]);
                lineNodes.forEach(node => {
                    lineWrapper.appendChild(node);
                });
                
                globalLineIndex++; // Increment for next line
            });

            element.dataset.fadelineProcessed = 'true';
        });
    }

    function applyFadeline() {
        if (fadelineEnabled) return;
        fadelineEnabled = true;

        // Find main content area (AO3 specific)
        const contentArea = document.querySelector('[role="main"]') || 
                           document.querySelector('article') ||
                           document.querySelector('.work') ||
                           document.body;

        // Mark container and process
        contentArea.classList.add(FADELINE_CLASS);
        getLineWrappedElements(contentArea);

        const button = document.getElementById('fadeline-button');
        if (button) button.classList.add('active');
    }

    function removeFadeline() {
        if (!fadelineEnabled) return;
        fadelineEnabled = false;

        const contentArea = document.querySelector(`.${FADELINE_CLASS}`);
        if (contentArea) {
            // Find all processed elements
            const processedElements = contentArea.querySelectorAll('[data-fadeline-processed]');
            
            processedElements.forEach(element => {
                // Collect all text content
                const textContent = element.textContent;
                
                // Remove all wrapper divs and spans
                const lineWrappers = element.querySelectorAll('.fadeline-line-wrapper');
                lineWrappers.forEach(wrapper => {
                    const children = wrapper.childNodes;
                    children.forEach(child => {
                        wrapper.parentNode.insertBefore(child, wrapper);
                    });
                    wrapper.remove();
                });
                
                // Clean up remaining spans (convert to text nodes)
                element.innerHTML = textContent;
                delete element.dataset.fadelineProcessed;
            });

            contentArea.classList.remove(FADELINE_CLASS);
        }

        const button = document.getElementById('fadeline-button');
        if (button) button.classList.remove('active');
    }

    function toggleFadeline() {
        if (fadelineEnabled) {
            removeFadeline();
        } else {
            applyFadeline();
        }
    }

    function hideButton() {
        const button = document.getElementById('fadeline-button');
        if (button) button.remove();
        removeFadeline();
    }

    function initializeButton() {
        document.body.appendChild(createButton());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeButton);
    } else {
        initializeButton();
    }
})();