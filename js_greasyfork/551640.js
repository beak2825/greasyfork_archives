// ==UserScript==
// @name         OK Site Beautifier
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Applies a modern, material design with dark mode and syntax highlighting to okmij.org.
// @author       Your Name
// @match        *://okmij.org/ftp/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-ocaml.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-haskell.min.js
// @resource     PRISM_CSS_LIGHT https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css
// @resource     PRISM_CSS_DARK https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-okaidia.min.css
// @grant        GM_getResourceText
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551640/OK%20Site%20Beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/551640/OK%20Site%20Beautifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. CONFIGURATION ---
    const config = {
        theme: GM_getValue('theme', 'light'), // 'light' or 'dark'
        syntaxHighlighting: GM_getValue('syntaxHighlighting', true) // true or false
    };

     /**
     * Removes common leading whitespace from a code block.
     * Specifically targets the 4-space indent found on the site.
     * @param {string} code The raw code string.
     * @returns {string} The dedented code string.
     */
    function dedent(code) {
        const lines = code.split('\n');

        // Don't process empty or single-line blocks
        if (lines.length <= 1) return code;

        // Check if all content-bearing lines start with 4 spaces.
        const canDedent = lines
            .filter(line => line.trim() !== '') // Ignore empty lines
            .every(line => line.startsWith('    '));

        if (canDedent) {
            return lines.map(line => line.substring(4)).join('\n');
        }

        // If the pattern doesn't match, return the original code.
        return code;
    }

    // --- 2. STYLES ---

    // Load PrismJS syntax highlighting themes
    const prismCssLight = GM_getResourceText('PRISM_CSS_LIGHT');
    const prismCssDark = GM_getResourceText('PRISM_CSS_DARK');

    GM_addStyle(`
        /* --- Base & Variables --- */
        :root {
            --bg-color: #f9f9f9;
            --text-color: #212121;
            --primary-color: #007acc;
            --link-color: #005a99;
            --card-bg: #ffffff;
            --border-color: #e0e0e0;
            --code-bg: #f0f0f0;
            --header-color: #333;
            --hr-color: #ccc;
            --shadow-color: rgba(0, 0, 0, 0.08);
        }

        body.dark-mode {
            --bg-color: #1e1e1e;
            --text-color: #e0e0e0;
            --primary-color: #2196F3;
            --link-color: #64b5f6;
            --card-bg: #2a2a2a;
            --border-color: #424242;
            --code-bg: #333;
            --header-color: #f5f5f5;
            --hr-color: #444;
            --shadow-color: rgba(0, 0, 0, 0.3);
        }

        /* --- General Layout & Typography --- */
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: 1.7;
            padding: 2rem 1rem;
            max-width: 900px;
            margin: 0 auto;
            transition: background-color 0.3s, color 0.3s;
        }

        h1, h2, h3 {
            color: var(--header-color);
            font-weight: 600;
            margin-top: 2.5em;
            margin-bottom: 1em;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 0.3em;
        }

        h1 { font-size: 2.5rem; text-align: center; }
        h2 { font-size: 2rem; }
        h3 { font-size: 1.5rem; }

        a {
            color: var(--link-color);
            text-decoration: none;
            transition: color 0.2s;
        }
        a:hover {
            color: var(--primary-color);
            text-decoration: underline;
        }

        hr {
            border: none;
            border-top: 1px solid var(--hr-color);
            margin: 2rem auto;
        }

        /* --- Content Sections (using dl as cards) --- */
        dl {
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1.5rem 2rem;
            margin: 2rem 0;
            box-shadow: 0 4px 12px var(--shadow-color);
            transition: background-color 0.3s, border-color 0.3s;
        }

        dt {
            font-weight: bold;
            color: var(--primary-color);
            margin-top: 1em;
        }

        dd {
            margin-left: 0;
            padding-bottom: 1em;
            border-bottom: 1px dashed var(--border-color);
        }
        dd:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }
        dl > dd:first-of-type {
             margin-top: 0.5rem;
        }


        /* --- Lists --- */
        ul {
            padding-left: 20px;
        }
        li {
            margin-bottom: 0.5rem;
        }
        li.separator {
            list-style-type: none;
            height: 1rem;
        }

        /* --- Code Blocks --- */
        pre {
            background-color: var(--code-bg) !important;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: 1rem;
            overflow-x: auto;
            font-family: "Fira Code", "Consolas", "Menlo", monospace;
            font-size: 0.9rem;
            line-height: 1.5;
            transition: background-color 0.3s, border-color 0.3s;
        }

        code {
             font-family: "Fira Code", "Consolas", "Menlo", monospace;
        }

        /* Hide syntax highlighting by default, enable with a class */
        .prism-highlight-disabled pre[class*="language-"] {
             color: var(--text-color) !important; /* Override prism styles */
        }
        .prism-highlight-disabled .token {
             all: unset !important; /* Forcefully remove token styling */
        }

        /* --- Navigation Bar --- */
        #navbar {
            text-align: center;
            padding: 1rem 0;
            border-bottom: 1px solid var(--border-color);
        }

        /* --- Footer --- */
        #footer {
            margin-top: 4rem;
            text-align: center;
            font-size: 0.9rem;
            color: #888;
        }
        body.dark-mode #footer {
            color: #777;
        }

        /* --- UI Controls --- */
        #userscript-controls {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 9999;
        }

        #userscript-controls button {
            background-color: var(--card-bg);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            border-radius: 50%;
            width: 48px;
            height: 48px;
            font-size: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px var(--shadow-color);
            transition: all 0.2s ease-in-out;
        }
        #userscript-controls button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px var(--shadow-color);
            color: var(--primary-color);
        }
    `);

    // --- 3. UI CONTROLS (BUTTONS) ---
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'userscript-controls';
    controlsContainer.innerHTML = `
        <button id="theme-switcher" title="Toggle Light/Dark Mode"></button>
        <button id="highlight-switcher" title="Toggle Syntax Highlighting"></button>
    `;
    document.body.appendChild(controlsContainer);

    const themeSwitcher = document.getElementById('theme-switcher');
    const highlightSwitcher = document.getElementById('highlight-switcher');

    // --- 4. LOGIC & EVENT HANDLERS ---

    // Function to apply syntax highlighting
    function applySyntaxHighlighting() {
        if (config.syntaxHighlighting) {
            document.body.classList.remove('prism-highlight-disabled');
            // Inject correct Prism CSS based on theme
            if (document.getElementById('prism-styles')) document.getElementById('prism-styles').remove();
            const prismStyle = document.createElement('style');
            prismStyle.id = 'prism-styles';
            prismStyle.textContent = (config.theme === 'dark') ? prismCssDark : prismCssLight;
            document.head.appendChild(prismStyle);

            // Add language classes to <pre> tags for Prism
            document.querySelectorAll('pre').forEach(pre => {
                // Heuristic to guess language if not specified
                const codeElement = pre.querySelector('code') || pre;
                codeElement.textContent = dedent(codeElement.textContent);

                const codeContent = pre.textContent;
                let lang = '';
                
                if (/(::|->|=>|data|where|do)\b/.test(codeContent)) {
                    lang = 'haskell';
                } else {
                    lang = "ocaml";

                }

                if (lang) {
                    pre.classList.add(`language-${lang}`);
                    // Prism expects a <code> tag inside <pre>
                    if (!pre.querySelector('code')) {
                        pre.innerHTML = `<code class="language-${lang}">${pre.innerHTML}</code>`;
                    } else {
                         pre.querySelector('code').classList.add(`language-${lang}`);
                    }
                }
            });
            Prism.highlightAll();
        } else {
            document.body.classList.add('prism-highlight-disabled');
        }
        updateHighlightButton();
    }

    // Function to update theme
    function updateTheme() {
        document.body.classList.toggle('dark-mode', config.theme === 'dark');
        themeSwitcher.innerHTML = config.theme === 'dark' ? '☀️' : '🌙';
        // Re-apply highlighting to get the correct theme
        applySyntaxHighlighting();
    }

    // Function to update highlight button
    function updateHighlightButton() {
        highlightSwitcher.innerHTML = '✨';
        highlightSwitcher.style.opacity = config.syntaxHighlighting ? '1' : '0.5';
    }


    // Event Listeners
    themeSwitcher.addEventListener('click', () => {
        config.theme = (config.theme === 'light') ? 'dark' : 'light';
        GM_setValue('theme', config.theme);
        updateTheme();
    });

    highlightSwitcher.addEventListener('click', () => {
        config.syntaxHighlighting = !config.syntaxHighlighting;
        GM_setValue('syntaxHighlighting', config.syntaxHighlighting);
        applySyntaxHighlighting();
    });

    // --- 5. INITIALIZATION ---
    function init() {
        console.log("Oleg Kiselyov's Site Beautifier Initialized.");
        updateTheme(); // This will also call applySyntaxHighlighting
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // The DOM is already ready.
        init();
    }

})();