// ==UserScript==
// @name         AliExpress Advanced Search UI
// @name:lt      AliExpress išplėstinės paieškos vartotojo sąsaja
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  Upgrades AliExpress with an advanced search UI for filtering products by keywords, phrases, and logical operators.
// @description:lt Praplečia AliExpress su išplėstine paieškos vartotojo sąsaja, skirta filtruoti produktus pagal raktinius žodžius, frazes ir loginius operatorius.
// @author       LetMeFixIt
// @license      MIT
// @match        *://*.aliexpress.com/w/wholesale*
// @match        *://*.aliexpress.com/store/*/pages/all-items*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/551244/AliExpress%20Advanced%20Search%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/551244/AliExpress%20Advanced%20Search%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_ID = 'ali-advanced-filter';
    const CONTAINER_ID = `${SCRIPT_ID}-container`;
    const FILTER_INPUT_ID = `${SCRIPT_ID}-input`;
    const CLEAR_BTN_ID = `${SCRIPT_ID}-clear-btn`;
    const TOGGLE_ID = `${SCRIPT_ID}-toggle`;
    const HELP_ID = `${SCRIPT_ID}-help`;
    const TOOLTIP_ID = `${SCRIPT_ID}-tooltip`;

    function addStyles() {
        GM_addStyle(`
            #_global_header_23_ { min-height: 100px !important; }
            /* Anchor for our filter bar */
            .pc-header--search--3hnHLKw, div[class*="shop-home-header-search-box"] {
                position: relative !important;
            }

            #${CONTAINER_ID} {
                position: absolute;
                top: 51px; /* Default for wholesale page */
                left: 0;
                width: 100%;
                display: flex;
                align-items: center;
                z-index: 999;
                padding: 0 5px;
                box-sizing: border-box;
            }
            /* Adjust position for smaller search bar on store pages */
            div[class*="shop-home-header-search-box"] #${CONTAINER_ID} {
                top: 35px;
            }

            #${FILTER_INPUT_ID} {
                flex-grow: 1;
                height: 34px;
                border: 1px solid #ccc;
                border-radius: 17px;
                padding: 0 85px 0 15px; /* Make space for all buttons */
                font-size: 14px;
                color: #000;
            }
            #${CLEAR_BTN_ID} {
                position: absolute;
                right: 80px; /* Adjusted for container padding */
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
                font-size: 24px;
                color: #999;
                display: none;
                z-index: 10;
            }
            #${CLEAR_BTN_ID}:hover { color: #333; }
            .ali-filter-switch {
                position: absolute;
                right: 40px; /* Adjusted for container padding */
                top: 50%;
                transform: translateY(-50%);
                width: 40px;
                height: 22px;
            }
            .ali-filter-switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 22px; }
            .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .slider { background-color: #2196F3; }
            input:checked + .slider:before { transform: translateX(18px); }
            #${HELP_ID} {
                position: absolute;
                right: 10px; /* Adjusted for container padding */
                top: 50%;
                transform: translateY(-50%);
                width: 20px; height: 20px; border-radius: 50%; background-color: #f0f0f0; color: #666;
                display: flex; align-items: center; justify-content: center; font-weight: bold; cursor: pointer;
            }
            #${TOOLTIP_ID} {
                display: none; position: absolute; top: 34px; right: 0; width: 300px;
                background: #FFFFE0; color: #000; border: 1px solid #ccc; border-radius: 6px;
                padding: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 99999 !important;
            }
            #${TOOLTIP_ID} ul { margin: 0; padding: 0 0 0 18px; }
            #${TOOLTIP_ID} li { margin-bottom: 5px; }
            #${HELP_ID}:hover + #${TOOLTIP_ID}, #${TOOLTIP_ID}:hover { display: block; }

            /* More robust fix for multi-line titles, anchored to the #card-list container */
            #card-list .search-card-item div[title],
            #card-list .search-card-item h3 {
                white-space: normal !important;
                text-overflow: clip !important;
                height: auto !important;
                display: -webkit-box !important;
                -webkit-line-clamp: 5 !important;
                -webkit-box-orient: vertical !important;
                overflow: hidden !important;
            }

            /* Fix for multi-line titles on store pages - scoped to be inside a link to avoid affecting other elements */
            div[st_page_id] a span[numberOfLines] {
                white-space: normal !important;
                height: auto !important;
                display: -webkit-box !important;
                -webkit-line-clamp: 5 !important; /* Allow up to 5 lines */
                -webkit-box-orient: vertical !important;
                overflow: hidden !important;
            }
        `);
    }

    function setupUI(anchorElement) {
        if (document.getElementById(CONTAINER_ID)) return;
        const filterContainer = document.createElement('div');
        filterContainer.id = CONTAINER_ID;
        filterContainer.innerHTML = ' \
            <input type="text" id="' + FILTER_INPUT_ID + '" placeholder="Filter: (a OR b) AND c -d"> \
            <span id="' + CLEAR_BTN_ID + '">&times;</span> \
            <label class="ali-filter-switch"> \
                <input type="checkbox" id="' + TOGGLE_ID + '"> \
                <span class="slider round"></span> \
            </label> \
            <span id="' + HELP_ID + '">?</span> \
            <div id="' + TOOLTIP_ID + '"> \
                <strong>Advanced Filtering Rules:</strong> \
                <ul> \
                    <li><b>Implicit AND:</b> <code>word1 word2</code></li> \
                    <li><b>Exact Phrase:</b> <code>"exact phrase"</code></li> \
                    <li><b>Exclude:</b> <code>-word</code> or <code>-"phrase"</code></li> \
                    <li><b>OR Logic:</b> <code>word1 OR word2</code></li> \
                    <li><b>Grouping:</b> <code>(word1 OR word2) AND word3</code></li> \
                </ul> \
            </div> \
        ';
        anchorElement.appendChild(filterContainer);
    }

    function parseQueryToRPN(query) {
        if (!query) return [];

        // 1. Tokenize the query string more robustly
        const tokens = query.match(/-?"[^"]+"|\bAND\b|\bOR\b|[\w-]+|[()]/g) || [];

        // 2. Insert implicit AND operators
        const processedTokens = [];
        for (let i = 0; i < tokens.length; i++) {
            processedTokens.push(tokens[i]);
            const current = tokens[i].toUpperCase();
            const next = (tokens[i + 1] || '').toUpperCase();

            const isCurrentTerm = current !== '(' && current !== 'AND' && current !== 'OR';
            const isNextTerm = next && next !== ')' && next !== 'AND' && next !== 'OR';

            if (i < tokens.length - 1 && isCurrentTerm && isNextTerm) {
                processedTokens.push('AND');
            }
        }

        // 3. Shunting-yard algorithm
        const precedence = { 'OR': 1, 'AND': 2 };
        const output = [];
        const operators = [];

        for (const token of processedTokens) {
            const upperToken = token.toUpperCase();
            if (precedence[upperToken]) {
                while (
                    operators.length &&
                    operators[operators.length - 1] !== '(' &&
                    precedence[operators[operators.length - 1]] >= precedence[upperToken]
                ) {
                    output.push(operators.pop());
                }
                operators.push(upperToken);
            } else if (token === '(') {
                operators.push(token);
            } else if (token === ')') {
                while (operators.length && operators[operators.length - 1] !== '(') {
                    output.push(operators.pop());
                }
                operators.pop(); // Pop the '('
            } else {
                output.push(token); // This is a term
            }
        }
        return output.concat(operators.reverse());
    }


    function evaluateRPN(rpn, title) {
        if (!rpn || rpn.length === 0) return true;
        const stack = [];
        for (const token of rpn) {
            if (token === 'AND' || token === 'OR') {
                if (stack.length < 2) return false; // Invalid expression
                const b = stack.pop();
                const a = stack.pop();
                stack.push(token === 'AND' ? (a && b) : (a || b));
            } else {
                let term = token.toLowerCase();
                const isNegative = term.startsWith('-');
                if (isNegative) term = term.substring(1);

                const isPhrase = term.startsWith('"') && term.endsWith('"');
                if (isPhrase) term = term.slice(1, -1);

                // If the term is empty after all stripping, treat as a neutral match.
                if (term === '') {
                    stack.push(true);
                    continue;
                }

                const match = title.includes(term);
                stack.push(isNegative ? !match : match);
            }
        }
        return stack.length === 1 ? stack.pop() : false; // Should be a single value left
    }

    function runFilter() {
        const toggle = document.getElementById(TOGGLE_ID);
        const input = document.getElementById(FILTER_INPUT_ID);
        if (!toggle || !input) return;

        const isEnabled = toggle.checked;
        const query = input.value;
        // Use :has(a) to ensure we only select product items on store pages, not other UI elements with st_page_id
        const productElements = document.querySelectorAll('div[data-tticheck="true"], div[st_page_id]:has(a)');

        if (!isEnabled) {
            productElements.forEach(p => { p.style.display = 'block'; });
            return;
        }

        const rpn = parseQueryToRPN(query);

        productElements.forEach(productEl => {
            let title = '';
            const titleEl = productEl.querySelector('h3, span[numberOfLines]');

            if (titleEl) {
                title = titleEl.textContent.toLowerCase();
            } else {
                const imgEl = productEl.querySelector('img[alt]');
                if (imgEl) {
                    title = imgEl.alt.toLowerCase();
                }
            }

            if (title) {
                try {
                    const shouldShow = query.trim() ? evaluateRPN(rpn.slice(), title) : true;
                    productEl.style.display = shouldShow ? 'block' : 'none';
                } catch (e) {
                    console.error("Filtering error:", e);
                    productEl.style.display = 'block'; // Failsafe
                }
            } else {
                 productEl.style.display = 'block'; // Failsafe if no title
            }
        });
    }

    function updateUI() {
        const input = document.getElementById(FILTER_INPUT_ID);
        const clear = document.getElementById(CLEAR_BTN_ID);
        if (!input || !clear) return;
        const hasText = input.value.length > 0;
        clear.style.display = hasText ? 'block' : 'none';
        input.style.backgroundColor = hasText ? 'lightyellow' : 'white';
    }

    function main() {
        const searchContainer = document.querySelector('.pc-header--search--3hnHLKw, div[class*="shop-home-header-search-box"]');
        if (!searchContainer) {
            console.error("AliExpress Filter: Search container not found.");
            return;
        }

        addStyles();
        setupUI(searchContainer);

        const filterInput = document.getElementById(FILTER_INPUT_ID);
        const clearBtn = document.getElementById(CLEAR_BTN_ID);
        const toggleCheckbox = document.getElementById(TOGGLE_ID);

        filterInput.value = sessionStorage.getItem('ali-filter-query') || '';
        toggleCheckbox.checked = (sessionStorage.getItem('ali-filter-enabled') || 'true') === 'true';
        updateUI();

        filterInput.addEventListener('input', () => {
            sessionStorage.setItem('ali-filter-query', filterInput.value);
            updateUI();
            runFilter();
        });

        clearBtn.addEventListener('click', () => {
            filterInput.value = '';
            sessionStorage.removeItem('ali-filter-query');
            updateUI();
            runFilter();
        });

        toggleCheckbox.addEventListener('change', () => {
            sessionStorage.setItem('ali-filter-enabled', toggleCheckbox.checked);
            runFilter();
        });

        const observer = new MutationObserver(runFilter);
        const targetNode = document.getElementById('root');
        if (targetNode) {
            setTimeout(runFilter, 1500);
            observer.observe(targetNode, { childList: true, subtree: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();