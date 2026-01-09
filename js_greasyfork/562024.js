// ==UserScript==
// @name         Phone Link Redirector
// @namespace    http://tampermonkey.net/
// @version      1.2.5
// @description  Redirects Bing searches from Phone Link notifications to actual web applications. Configure custom redirect rules via the Tampermonkey menu.
// @author       bosmanx
// @match        https://www.bing.com/search*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @homepageURL  https://github.com/bosmanx/phone-link-redirector
// @supportURL   https://github.com/bosmanx/phone-link-redirector/issues
// @downloadURL https://update.greasyfork.org/scripts/562024/Phone%20Link%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/562024/Phone%20Link%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract version from userscript header (GM_info is always available in Tampermonkey)
    const VERSION = (typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.version) 
        ? GM_info.script.version 
        : '1.2.5'; // Fallback if GM_info not available

    // Default redirect rules
    const DEFAULT_RULES = [
        { query: 'Whatsapp', redirect: 'https://web.whatsapp.com/' },
        { query: 'Bankieren', redirect: 'https://mijn.ing.nl/login/' },
        { query: 'Calendar', redirect: 'https://calendar.google.com/' },
        { query: 'Photos', redirect: 'https://photos.google.com/' },
        { query: 'Maps', redirect: 'https://maps.google.com/' },
        { query: 'Messenger', redirect: 'https://www.messenger.com/desktop' }
    ];

    /**
     * Extract and decode the 'q' parameter from a Bing search URL
     * @param {string} url - The full URL
     * @returns {string|null} - The decoded query string, or null if not found
     */
    function parseBingQuery(url) {
        try {
            const urlObj = new URL(url);
            const query = urlObj.searchParams.get('q');
            if (!query) {
                return null;
            }
            return decodeURIComponent(query);
        } catch (e) {
            console.error('Error parsing Bing query:', e);
            return null;
        }
    }

    /**
     * Find a matching rule for the given query (case-insensitive)
     * @param {string} query - The search query
     * @param {Array} rules - Array of rule objects {query: string, redirect: string}
     * @returns {Object|null} - The matching rule object, or null if no match
     */
    function findMatchingRule(query, rules) {
        if (!query || !rules || rules.length === 0) {
            return null;
        }

        const normalizedQuery = query.trim().toLowerCase();
        
        for (const rule of rules) {
            if (!rule.query || !rule.redirect) {
                continue; // Skip invalid rules
            }
            
            const normalizedRuleQuery = rule.query.trim().toLowerCase();
            if (normalizedQuery === normalizedRuleQuery) {
                return rule;
            }
        }

        return null;
    }

    /**
     * Check if redirect should occur (prevents redirect loops)
     * @param {string} currentUrl - Current page URL
     * @param {string} targetUrl - Target redirect URL
     * @returns {boolean} - True if redirect should occur
     */
    function shouldRedirect(currentUrl, targetUrl) {
        try {
            const current = new URL(currentUrl);
            const target = new URL(targetUrl);
            
            // Don't redirect if already on the target domain
            if (current.hostname === target.hostname) {
                return false;
            }
            
            return true;
        } catch (e) {
            console.error('Error checking redirect:', e);
            return false;
        }
    }

    /**
     * Load redirect rules from storage, with fallback to defaults
     * @returns {Array} - Array of rule objects
     */
    function loadRules() {
        try {
            const stored = GM_getValue('redirectRules', null);
            if (stored && Array.isArray(stored) && stored.length > 0) {
                return stored;
            }
            return DEFAULT_RULES;
        } catch (e) {
            console.error('Error loading rules:', e);
            return DEFAULT_RULES;
        }
    }

    /**
     * Save redirect rules to storage
     * @param {Array} rules - Array of rule objects to save
     * @returns {boolean} - True if saved successfully
     */
    function saveRules(rules) {
        try {
            if (!Array.isArray(rules)) {
                console.error('Invalid rules format: must be an array');
                return false;
            }
            GM_setValue('redirectRules', rules);
            return true;
        } catch (e) {
            console.error('Error saving rules:', e);
            return false;
        }
    }

    /**
     * Show configuration UI for managing redirect rules
     */
    function showConfigurationUI() {
        const rules = loadRules();
        
        // Ensure we have rules (fallback to defaults if empty)
        const rulesToDisplay = (rules && Array.isArray(rules) && rules.length > 0) ? rules : DEFAULT_RULES;
        
        // Create HTML for configuration interface
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Phone Link Redirector ${VERSION} - Configuration</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 20px auto;
                        padding: 20px;
                        background: #f5f5f5;
                    }
                    .container {
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    h1 {
                        color: #333;
                        margin-top: 0;
                    }
                    .rule-item {
                        display: flex;
                        gap: 10px;
                        margin-bottom: 3px;
                        padding: 6px;
                        background: #f9f9f9;
                        border-radius: 4px;
                        align-items: center;
                    }
                    .rule-item input.invalid {
                        border-color: #d13438;
                        background-color: #fff5f5;
                    }
                    .rule-item .error-message {
                        color: #d13438;
                        font-size: 11px;
                        margin-top: 2px;
                    }
                    .rule-item input {
                        flex: 1;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                    }
                    button {
                        padding: 8px 16px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                    }
                    .btn-primary {
                        background: #0078d4;
                        color: white;
                    }
                    .btn-danger {
                        background: #d13438;
                        color: white;
                    }
                    .btn-secondary {
                        background: #6c757d;
                        color: white;
                    }
                    .btn-success {
                        background: #107c10;
                        color: white;
                    }
                    button:hover {
                        opacity: 0.9;
                    }
                    .actions {
                        margin-top: 20px;
                        display: flex;
                        gap: 10px;
                    }
                    .empty-state {
                        text-align: center;
                        color: #666;
                        padding: 40px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Phone Link Redirector ${VERSION} - Configuration</h1>
                    <div id="rules-container"></div>
                    <div class="actions">
                        <button class="btn-success" id="btn-add-rule">Add Rule</button>
                        <button class="btn-secondary" id="btn-reset-defaults">Reset to Defaults</button>
                        <button class="btn-primary" id="btn-save">Save</button>
                        <button class="btn-secondary" id="btn-close">Close</button>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        // Open configuration window using blob URL to avoid CSP restrictions
        // Create blob URL to avoid CSP restrictions from parent page
        const blob = new Blob([html], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        
        // Calculate center position for the window
        const width = 900;
        const height = 600;
        const left = (screen.width / 2) - (width / 2);
        const top = (screen.height / 2) - (height / 2);
        
        const configWindow = window.open(blobUrl, 'PhoneLinkRedirectorConfig', 
            `width=${width},height=${height},left=${left},top=${top},resizable=yes`);
        if (!configWindow) {
            URL.revokeObjectURL(blobUrl);
            alert('Please allow popups for this site to use the configuration UI.');
            return;
        }
        
        // Inject script dynamically after window loads to avoid CSP restrictions
        const injectScript = function() {
            if (!configWindow.document) {
                setTimeout(injectScript, 50);
                return;
            }
            
            // Wait for body and all elements to be ready
            if (!configWindow.document.body || !configWindow.document.getElementById('btn-add-rule')) {
                setTimeout(injectScript, 50);
                return;
            }
            
            // Create script content
            const scriptContent = `
                (function() {
                    // URL validation function
                    function isValidUrl(url) {
                        if (!url || !url.trim()) {
                            return false;
                        }
                        try {
                            const urlObj = new URL(url.trim());
                            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
                        } catch (e) {
                            return false;
                        }
                    }
                    
                    let rules = ${JSON.stringify(rulesToDisplay)};
                    const DEFAULT_RULES_EMBEDDED = ${JSON.stringify(DEFAULT_RULES)};
                    
                    // Sync current input values to rules array before rebuilding
                    function syncInputsToRules() {
                        for (let i = 0; i < rules.length; i++) {
                            const queryEl = document.getElementById('query-' + i);
                            const redirectEl = document.getElementById('redirect-' + i);
                            if (queryEl && redirectEl) {
                                rules[i].query = queryEl.value;
                                rules[i].redirect = redirectEl.value;
                            }
                        }
                    }
                    
                    function renderRules() {
                        const container = document.getElementById('rules-container');
                        if (!container) {
                            return;
                        }
                        
                        if (!rules || !Array.isArray(rules) || rules.length === 0) {
                            container.innerHTML = '<div class="empty-state">No rules configured. Click "Add Rule" to create one.</div>';
                            return;
                        }
                        
                        container.innerHTML = rules.map((rule, index) => {
                            const queryEscaped = (rule.query || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                            const redirectEscaped = (rule.redirect || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                            const isValid = isValidUrl(rule.redirect);
                            const isEmpty = !rule.redirect || !rule.redirect.trim();
                            const invalidClass = (!isEmpty && !isValid) ? ' invalid' : '';
                            const errorMsg = isEmpty ? 'URL is required' : (!isValid ? 'Invalid URL (must start with http:// or https://)' : '');
                            
                            return '<div class="rule-item">' +
                                '<input type="text" id="query-' + index + '" value="' + queryEscaped + '" placeholder="Search query (e.g., Whatsapp)">' +
                                '<div style="flex: 1; display: flex; flex-direction: column;">' +
                                '<input type="text" id="redirect-' + index + '" class="' + invalidClass + '" value="' + redirectEscaped + '" placeholder="Redirect URL (e.g., https://web.whatsapp.com/)">' +
                                (errorMsg ? '<div class="error-message">' + errorMsg + '</div>' : '') +
                                '</div>' +
                                '<button class="btn-danger btn-delete-rule" data-rule-index="' + index + '" tabindex="-1">Delete</button>' +
                                '</div>';
                        }).join('');
                        
                        // Attach input change listeners for real-time validation
                        attachInputListeners();
                    }
                    
                    // Update validation for a specific input without rebuilding
                    function updateValidation(index) {
                        const redirectEl = document.getElementById('redirect-' + index);
                        if (!redirectEl) return;
                        
                        const redirect = redirectEl.value;
                        const isValid = isValidUrl(redirect);
                        const isEmpty = !redirect || !redirect.trim();
                        const invalidClass = (!isEmpty && !isValid) ? ' invalid' : '';
                        const errorMsg = isEmpty ? 'URL is required' : (!isValid ? 'Invalid URL (must start with http:// or https://)' : '');
                        
                        // Update class
                        redirectEl.className = invalidClass;
                        
                        // Update error message
                        const errorContainer = redirectEl.parentElement;
                        let errorDiv = errorContainer.querySelector('.error-message');
                        if (errorMsg) {
                            if (!errorDiv) {
                                errorDiv = document.createElement('div');
                                errorDiv.className = 'error-message';
                                errorContainer.appendChild(errorDiv);
                            }
                            errorDiv.textContent = errorMsg;
                        } else if (errorDiv) {
                            errorDiv.remove();
                        }
                    }
                    
                    // Attach listeners to inputs for real-time validation
                    function attachInputListeners() {
                        for (let i = 0; i < rules.length; i++) {
                            const redirectEl = document.getElementById('redirect-' + i);
                            if (redirectEl) {
                                redirectEl.addEventListener('input', function() {
                                    const index = parseInt(this.id.split('-')[1], 10);
                                    syncInputsToRules();
                                    updateValidation(index);
                                });
                            }
                        }
                    }
                    
                    function addRule() {
                        syncInputsToRules(); // Save current values before adding
                        const newIndex = rules.length;
                        rules.push({ query: '', redirect: '' });
                        renderRules();
                        
                        // Focus on the first field of the newly added rule
                        setTimeout(function() {
                            const queryEl = document.getElementById('query-' + newIndex);
                            if (queryEl) {
                                queryEl.focus();
                            }
                        }, 0);
                    }
                    
                    function removeRule(index) {
                        syncInputsToRules(); // Save current values before removing
                        rules.splice(index, 1);
                        renderRules();
                    }
                    
                    function resetDefaults() {
                        if (confirm('Reset all rules to defaults? This will remove any custom rules.')) {
                            rules = JSON.parse(JSON.stringify(DEFAULT_RULES_EMBEDDED));
                            renderRules();
                        }
                    }
                    
                    function saveRules() {
                        const newRules = [];
                        const errors = [];
                        const seenQueries = new Map(); // Track queries to detect duplicates
                        
                        for (let i = 0; i < rules.length; i++) {
                            const queryEl = document.getElementById('query-' + i);
                            const redirectEl = document.getElementById('redirect-' + i);
                            if (queryEl && redirectEl) {
                                const query = queryEl.value.trim();
                                const redirect = redirectEl.value.trim();
                                
                                if (!query && !redirect) {
                                    continue; // Skip empty rows
                                }
                                
                                if (!query) {
                                    errors.push('Rule ' + (i + 1) + ': Query is required');
                                    continue;
                                }
                                
                                if (!redirect) {
                                    errors.push('Rule ' + (i + 1) + ' ("' + query + '"): URL is required');
                                    continue;
                                }
                                
                                if (!isValidUrl(redirect)) {
                                    errors.push('Rule ' + (i + 1) + ' ("' + query + '"): Invalid URL. Must start with http:// or https://');
                                    continue;
                                }
                                
                                // Check for duplicate queries (case-insensitive)
                                const normalizedQuery = query.toLowerCase();
                                if (seenQueries.has(normalizedQuery)) {
                                    const firstOccurrence = seenQueries.get(normalizedQuery);
                                    errors.push('Rule ' + (i + 1) + ' ("' + query + '"): Duplicate query. Already defined in rule ' + firstOccurrence);
                                    continue;
                                }
                                
                                seenQueries.set(normalizedQuery, i + 1);
                                newRules.push({ query, redirect });
                            }
                        }
                        
                        if (errors.length > 0) {
                            alert('Please fix the following errors:\\n\\n' + errors.join('\\n'));
                            return;
                        }
                        
                        if (newRules.length === 0) {
                            alert('Please add at least one valid rule.');
                            return;
                        }
                        
                        if (window.opener) {
                            window.opener.postMessage({
                                type: 'PHONE_LINK_REDIRECTOR_SAVE',
                                rules: newRules
                            }, '*');
                            window.close();
                        } else {
                            alert('Error: Cannot communicate with parent window.');
                        }
                    }
                    
                    // Flag to ensure event listeners are only attached once
                    let listenersAttached = false;
                    
                    // Delete handler function (stored so we can remove it if needed)
                    function deleteHandler(e) {
                        if (e.target && e.target.classList.contains('btn-delete-rule')) {
                            const index = parseInt(e.target.getAttribute('data-rule-index'), 10);
                            if (!isNaN(index) && index >= 0 && index < rules.length) {
                                removeRule(index);
                            }
                        }
                    }
                    
                    // Attach event listeners (with null checks)
                    function attachEventListeners() {
                        if (listenersAttached) {
                            return;
                        }
                        
                        const btnAddRule = document.getElementById('btn-add-rule');
                        const btnResetDefaults = document.getElementById('btn-reset-defaults');
                        const btnSave = document.getElementById('btn-save');
                        const btnClose = document.getElementById('btn-close');
                        const container = document.getElementById('rules-container');
                        
                        if (!btnAddRule || !btnResetDefaults || !btnSave || !btnClose || !container) {
                            setTimeout(attachEventListeners, 50);
                            return;
                        }
                        
                        btnAddRule.addEventListener('click', addRule);
                        btnResetDefaults.addEventListener('click', resetDefaults);
                        btnSave.addEventListener('click', saveRules);
                        btnClose.addEventListener('click', function() { window.close(); });
                        container.addEventListener('click', deleteHandler);
                        
                        listenersAttached = true;
                    }
                    
                    // Initialize UI
                    let uiInitialized = false;
                    function initializeUI() {
                        if (uiInitialized) {
                            return;
                        }
                        
                        // Ensure all elements exist before initializing
                        const container = document.getElementById('rules-container');
                        const btnAddRule = document.getElementById('btn-add-rule');
                        if (!container || !btnAddRule) {
                            setTimeout(initializeUI, 50);
                            return;
                        }
                        
                        attachEventListeners();
                        renderRules();
                        uiInitialized = true;
                    }
                    
                    // Initialize when DOM is ready with multiple fallbacks
                    function tryInitialize() {
                        if (document.readyState === 'complete' || document.readyState === 'interactive') {
                            initializeUI();
                        } else {
                            document.addEventListener('DOMContentLoaded', initializeUI);
                            window.addEventListener('load', initializeUI);
                            // Fallback timeout
                            setTimeout(initializeUI, 100);
                        }
                    }
                    
                    tryInitialize();
                })();
            `;
            
            // Create and inject script element
            const script = configWindow.document.createElement('script');
            script.textContent = scriptContent;
            configWindow.document.body.appendChild(script);
            URL.revokeObjectURL(blobUrl);
        };
        
        // Wait for window to load, then inject script
        if (configWindow.document.readyState === 'complete') {
            injectScript();
        } else {
            configWindow.addEventListener('load', injectScript, { once: true });
            // Also try immediately in case it's already loaded
            setTimeout(injectScript, 100);
        }
        
        // Listen for save message from config window
        window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'PHONE_LINK_REDIRECTOR_SAVE') {
                if (!saveRules(event.data.rules)) {
                    alert('Error saving rules. Please try again.');
                }
            }
        });
    }

    /**
     * Main redirect logic - runs at document-start
     */
    function main() {
        const currentUrl = window.location.href;
        const query = parseBingQuery(currentUrl);
        
        if (!query) {
            return; // No query parameter, let page load normally
        }
        
        const rules = loadRules();
        const matchingRule = findMatchingRule(query, rules);
        
        if (matchingRule && shouldRedirect(currentUrl, matchingRule.redirect)) {
            console.log(`Phone Link Redirector: Redirecting "${query}" to ${matchingRule.redirect}`);
            window.location.replace(matchingRule.redirect);
        }
    }

    // Register configuration menu command
    GM_registerMenuCommand('Configure Redirect Rules', showConfigurationUI);

    // Run main redirect logic
    main();
})();
