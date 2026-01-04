// ==UserScript==
// @name         Regex Search & Highlight
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Search and highlight text using regex patterns on any webpage
// @author       AnyPortInAHurricane & ClaudeAI
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556454/Regex%20Search%20%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/556454/Regex%20Search%20%20Highlight.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Add CSS styles
    GM_addStyle(`
        #regex-search-panel {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 999999;
            background: #fff;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            min-width: 320px;
        }
        #regex-search-panel.minimized {
            min-width: auto;
        }
        #regex-search-panel h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #regex-search-panel input[type="text"] {
            width: 100%;
            padding: 8px;
            margin-bottom: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-family: monospace;
            box-sizing: border-box;
        }
        #regex-search-panel label {
            display: block;
            margin: 8px 0;
            font-size: 13px;
        }
        #regex-search-panel input[type="checkbox"] {
            margin-right: 5px;
        }
        #regex-search-panel button {
            padding: 8px 15px;
            margin: 5px 5px 0 0;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
        }
        #regex-search-btn {
            background: #4CAF50;
            color: white;
        }
        #regex-search-btn:hover {
            background: #45a049;
        }
        #regex-clear-btn {
            background: #f44336;
            color: white;
        }
        #regex-clear-btn:hover {
            background: #da190b;
        }
        #regex-toggle-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 18px;
            padding: 0;
            color: #666;
        }
        #regex-match-count {
            margin-top: 8px;
            font-size: 13px;
            color: #666;
            font-weight: bold;
        }
        .regex-highlight {
            background-color: yellow !important;
            color: black !important;
            padding: 2px 0;
            border-radius: 2px;
        }
        .regex-search-content {
            display: block;
        }
        .regex-search-content.hidden {
            display: none;
        }
    `);

    // Create the search panel
    const panel = document.createElement('div');
    panel.id = 'regex-search-panel';
    panel.className = 'minimized';
    panel.innerHTML = `
        <h3>
            Regex Search
            <button id="regex-toggle-btn" title="Minimize/Maximize">+</button>
        </h3>
        <div class="regex-search-content hidden">
            <input type="text" id="regex-pattern" placeholder="Enter regex pattern (e.g., \\b\\w+@\\w+\\.com\\b)" />
            <label>
                <input type="checkbox" id="regex-case-sensitive" />
                Case sensitive
            </label>
            <label>
                <input type="checkbox" id="regex-whole-word" />
                Whole word only
            </label>
            <div>
                <button id="regex-search-btn">Search & Highlight</button>
                <button id="regex-clear-btn">Clear</button>
            </div>
            <div id="regex-match-count"></div>
        </div>
    `;

    // Wait for body to be available
    const addPanel = () => {
        if (document.body) {
            document.body.appendChild(panel);
        } else {
            setTimeout(addPanel, 100);
        }
    };
    addPanel();

    // Store original content for restoration
    let modifiedElements = [];
    let matchCount = 0;

    // Toggle minimize/maximize
    document.addEventListener('click', (e) => {
        if (e.target.id === 'regex-toggle-btn') {
            const content = panel.querySelector('.regex-search-content');
            const btn = e.target;
            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                btn.textContent = '−';
                panel.classList.remove('minimized');
            } else {
                content.classList.add('hidden');
                btn.textContent = '+';
                panel.classList.add('minimized');
            }
        }
    });

    // Function to get all text nodes
    function getTextNodes(node) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // Skip script, style, and our panel
                    const parent = node.parentElement;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    const tag = parent.tagName;
                    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (parent.closest('#regex-search-panel')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // Only accept nodes with actual content
                    if (node.textContent.trim().length === 0) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let currentNode;
        while (currentNode = walker.nextNode()) {
            textNodes.push(currentNode);
        }
        return textNodes;
    }

    // Function to highlight matches
    function highlightMatches(pattern, caseSensitive, wholeWord) {
        clearHighlights();
        matchCount = 0;

        let flags = 'g';
        if (!caseSensitive) flags += 'i';

        let regex;
        try {
            if (wholeWord) {
                regex = new RegExp(`\\b(${pattern})\\b`, flags);
            } else {
                regex = new RegExp(pattern, flags);
            }
        } catch (e) {
            document.getElementById('regex-match-count').textContent = `Error: Invalid regex pattern`;
            return;
        }

        const textNodes = getTextNodes(document.body);

        textNodes.forEach(node => {
            const text = node.textContent;
            const matches = [...text.matchAll(regex)];

            if (matches.length > 0) {
                matchCount += matches.length;
                
                // Create a document fragment with highlighted text
                const fragment = document.createDocumentFragment();
                let lastIndex = 0;

                matches.forEach(match => {
                    // Add text before match
                    if (match.index > lastIndex) {
                        fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
                    }

                    // Add highlighted match
                    const span = document.createElement('span');
                    span.className = 'regex-highlight';
                    span.textContent = match[0];
                    fragment.appendChild(span);

                    lastIndex = match.index + match[0].length;
                });

                // Add remaining text
                if (lastIndex < text.length) {
                    fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
                }

                // Store original node and replace
                modifiedElements.push({
                    node: node,
                    original: text,
                    parent: node.parentNode
                });

                node.parentNode.replaceChild(fragment, node);
            }
        });

        document.getElementById('regex-match-count').textContent = 
            `Found ${matchCount} match${matchCount !== 1 ? 'es' : ''}`;

        // Scroll to first match
        if (matchCount > 0) {
            const firstHighlight = document.querySelector('.regex-highlight');
            if (firstHighlight) {
                firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    // Function to clear highlights
    function clearHighlights() {
        // Remove all highlight spans
        document.querySelectorAll('.regex-highlight').forEach(span => {
            const parent = span.parentNode;
            parent.replaceChild(document.createTextNode(span.textContent), span);
            parent.normalize(); // Merge adjacent text nodes
        });

        modifiedElements = [];
        matchCount = 0;
        document.getElementById('regex-match-count').textContent = '';
    }

    // Event listeners
    document.getElementById('regex-search-btn').addEventListener('click', () => {
        const pattern = document.getElementById('regex-pattern').value;
        const caseSensitive = document.getElementById('regex-case-sensitive').checked;
        const wholeWord = document.getElementById('regex-whole-word').checked;

        if (!pattern) {
            alert('Please enter a regex pattern');
            return;
        }

        highlightMatches(pattern, caseSensitive, wholeWord);
    });

    document.getElementById('regex-clear-btn').addEventListener('click', () => {
        clearHighlights();
        document.getElementById('regex-pattern').value = '';
    });

    // Allow Enter key to search
    document.getElementById('regex-pattern').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('regex-search-btn').click();
        }
    });

    // Handle dynamic content changes (for sites like Reddit)
    const observer = new MutationObserver(() => {
        // Re-apply highlights when DOM changes if there's an active search
        if (matchCount > 0) {
            const pattern = document.getElementById('regex-pattern').value;
            const caseSensitive = document.getElementById('regex-case-sensitive').checked;
            const wholeWord = document.getElementById('regex-whole-word').checked;
            if (pattern) {
                setTimeout(() => highlightMatches(pattern, caseSensitive, wholeWord), 100);
            }
        }
    });

    // Start observing with a delay to avoid initial page load chaos
    setTimeout(() => {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }, 2000);

})();