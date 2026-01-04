// ==UserScript==
// @name         Greasy Fork | Quick Copy/Download/Install Script Buttons
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      1.2
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Adds Copy, Download, and Install buttons to every search result tile and script page header.
// @match        https://greasyfork.org/*
// @match        https://*.greasyfork.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @connect      update.greasyfork.org
// @connect      greasyfork.org
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560381/Greasy%20Fork%20%7C%20Quick%20CopyDownloadInstall%20Script%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/560381/Greasy%20Fork%20%7C%20Quick%20CopyDownloadInstall%20Script%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== STYLES ====================
    GM_addStyle(`
        .gf-quick-actions {
            position: absolute;
            top: 8px;
            right: 8px;
            display: flex;
            gap: 6px;
            z-index: 100;
            opacity: 1;
        }

        li[data-script-id] {
            position: relative !important;
        }

        .gf-quick-actions-page {
            position: static;
            display: inline-flex;
            gap: 6px;
            margin-left: 12px;
            opacity: 1;
            vertical-align: middle;
        }

        .gf-action-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border: 1px solid #ccc;
            border-radius: 6px;
            background: #fff;
            cursor: pointer;
            transition: all 0.2s ease;
            padding: 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .gf-action-btn:hover {
            background: #f0f0f0;
            border-color: #999;
            transform: translateY(-1px);
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .gf-action-btn:active {
            transform: translateY(0);
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .gf-action-btn svg {
            width: 16px;
            height: 16px;
            fill: currentColor;
            color: #555;
        }

        .gf-action-btn:hover svg {
            color: #333;
        }

        .gf-action-btn.gf-copy-btn:hover {
            border-color: #4a90d9;
            background: #e8f4fc;
        }
        .gf-action-btn.gf-copy-btn:hover svg {
            color: #4a90d9;
        }

        .gf-action-btn.gf-download-btn:hover {
            border-color: #5cb85c;
            background: #e8f5e8;
        }
        .gf-action-btn.gf-download-btn:hover svg {
            color: #5cb85c;
        }

        .gf-action-btn.gf-install-btn:hover {
            border-color: #d9534f;
            background: #fce8e8;
        }
        .gf-action-btn.gf-install-btn:hover svg {
            color: #d9534f;
        }

        .gf-action-btn.gf-success {
            background: #d4edda !important;
            border-color: #28a745 !important;
        }
        .gf-action-btn.gf-success svg {
            color: #28a745 !important;
        }

        .gf-action-btn.gf-loading {
            pointer-events: none;
            opacity: 0.7;
        }

        .gf-action-btn.gf-loading svg {
            animation: gf-spin 1s linear infinite;
        }

        @keyframes gf-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .gf-tooltip {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            padding: 4px 8px;
            background: #333;
            color: #fff;
            font-size: 11px;
            border-radius: 4px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
            margin-bottom: 4px;
            z-index: 1000;
        }

        .gf-action-btn:hover .gf-tooltip {
            opacity: 1;
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .gf-action-btn {
                background: #2d2d2d;
                border-color: #444;
            }
            .gf-action-btn svg {
                color: #bbb;
            }
            .gf-action-btn:hover {
                background: #3d3d3d;
                border-color: #666;
            }
            .gf-action-btn:hover svg {
                color: #fff;
            }
            .gf-action-btn.gf-copy-btn:hover {
                background: #1e3a5f;
                border-color: #4a90d9;
            }
            .gf-action-btn.gf-download-btn:hover {
                background: #1e4620;
                border-color: #5cb85c;
            }
            .gf-action-btn.gf-install-btn:hover {
                background: #5f1e1e;
                border-color: #d9534f;
            }
        }

        /* Greasyfork dark theme */
        body.dark .gf-action-btn,
        html[data-theme="dark"] .gf-action-btn {
            background: #2d2d2d;
            border-color: #444;
        }
        body.dark .gf-action-btn svg,
        html[data-theme="dark"] .gf-action-btn svg {
            color: #bbb;
        }
        body.dark .gf-action-btn:hover,
        html[data-theme="dark"] .gf-action-btn:hover {
            background: #3d3d3d;
            border-color: #666;
        }
    `);

    // ==================== CONSTANTS ====================
    const ICONS = {
        copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>`,
        download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>`,
        install: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7"/>
            <rect x="3" y="19" width="18" height="2" rx="1"/>
        </svg>`,
        check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>`,
        spinner: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
        </svg>`
    };

    const BUTTON_CONFIG = {
        copy: {
            className: 'gf-copy-btn',
            tooltip: 'Copy code to clipboard',
            successMessage: 'Copied!'
        },
        download: {
            className: 'gf-download-btn',
            tooltip: 'Download as .user.js file',
            successMessage: 'Downloaded!'
        },
        install: {
            className: 'gf-install-btn',
            tooltip: 'Install userscript',
            successMessage: null // Install redirects, no success state
        }
    };

    // ==================== UTILITY FUNCTIONS ====================

    /**
     * Fetch script code from URL
     */
    function fetchScriptCode(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.responseText);
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Copy text to clipboard
     */
    function copyToClipboard(text) {
        if (typeof GM_setClipboard === 'function') {
            GM_setClipboard(text, 'text');
            return true;
        }
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
    }

    /**
     * Trigger file download
     */
    function downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Extract filename from URL
     */
    function getFilenameFromUrl(url) {
        try {
            const pathname = new URL(url).pathname;
            const filename = decodeURIComponent(pathname.split('/').pop());
            return filename.endsWith('.user.js') ? filename : filename + '.user.js';
        } catch {
            return 'script.user.js';
        }
    }

    /**
     * Show success feedback on button
     */
    function showSuccess(button, message) {
        const originalHTML = button.innerHTML;
        const tooltip = button.querySelector('.gf-tooltip');
        const originalTooltip = tooltip ? tooltip.textContent : '';

        button.classList.add('gf-success');
        const successTooltip = message || 'Success!';
        button.innerHTML = ICONS.check + `<span class="gf-tooltip">${successTooltip}</span>`;

        setTimeout(() => {
            button.classList.remove('gf-success');
            button.innerHTML = originalHTML;
        }, 1500);
    }

    /**
     * Create a single action button
     */
    function createActionButton(type, codeUrl, scriptName) {
        const config = BUTTON_CONFIG[type];
        const button = document.createElement('button');
        button.className = `gf-action-btn ${config.className}`;
        button.innerHTML = ICONS[type] + `<span class="gf-tooltip">${config.tooltip}</span>`;
        button.title = config.tooltip;

        button.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (type === 'install') {
                // Install: just navigate to the .user.js URL
                window.location.href = codeUrl;
                return;
            }

            // For copy and download, fetch the code
            const container = button.closest('.gf-quick-actions');
            setLoading(button, true);
            if (container) container.classList.add('gf-loading');

            try {
                const code = await fetchScriptCode(codeUrl);

                if (type === 'copy') {
                    copyToClipboard(code);
                    setLoading(button, false);
                    showSuccess(button, config.successMessage);
                } else if (type === 'download') {
                    const filename = getFilenameFromUrl(codeUrl);
                    downloadFile(code, filename);
                    setLoading(button, false);
                    showSuccess(button, config.successMessage);
                }
            } catch (error) {
                console.error(`Failed to ${type}:`, error);
                setLoading(button, false);
                alert(`Failed to ${type} script`);
            }

            if (container) container.classList.remove('gf-loading');
        });

        return button;
    }

    /**
     * Show loading state on button
     */
    function setLoading(button, loading) {
        if (loading) {
            button.classList.add('gf-loading');
            button.dataset.originalIcon = button.querySelector('svg').outerHTML;
            button.querySelector('svg').outerHTML = ICONS.spinner;
        } else {
            button.classList.remove('gf-loading');
            if (button.dataset.originalIcon) {
                button.querySelector('svg').outerHTML = button.dataset.originalIcon;
                delete button.dataset.originalIcon;
            }
        }
    }

    // ==================== BUTTON CREATION ====================

    /**
     * Create action buttons container
     */
    function createActionButtons(codeUrl, scriptName, isPageHeader = false) {
        const container = document.createElement('div');
        container.className = isPageHeader ? 'gf-quick-actions gf-quick-actions-page' : 'gf-quick-actions';

        // Create all three buttons
        container.appendChild(createActionButton('copy', codeUrl, scriptName));
        container.appendChild(createActionButton('download', codeUrl, scriptName));
        container.appendChild(createActionButton('install', codeUrl, scriptName));

        return container;
    }

    // ==================== INJECTION LOGIC ====================

    /**
     * Inject buttons into search result tiles
     */
    function injectSearchResultButtons() {
        const scriptItems = document.querySelectorAll('li[data-script-id][data-code-url]');

        scriptItems.forEach(item => {
            // Skip if already processed
            if (item.querySelector('.gf-quick-actions')) return;

            const codeUrl = item.getAttribute('data-code-url');
            const scriptName = item.getAttribute('data-script-name') || 'script';

            if (!codeUrl) return;

            const buttons = createActionButtons(codeUrl, scriptName, false);
            item.appendChild(buttons);
        });
    }

    /**
     * Inject buttons into script detail page header
     */
    function injectPageHeaderButtons() {
        // Check if we're on a script page
        const scriptInfo = document.querySelector('#script-info');
        if (!scriptInfo) return;

        // Skip if already processed
        if (scriptInfo.querySelector('.gf-quick-actions-page')) return;

        // Try to find the code URL from multiple sources
        let codeUrl = null;
        let scriptId = null;

        // Method 1: From install link
        const installLink = document.querySelector('a.install-link[href*=".user.js"]');
        if (installLink) {
            codeUrl = installLink.href;
        }

        // Method 2: Extract from URL and construct code URL
        if (!codeUrl) {
            const urlMatch = window.location.pathname.match(/\/scripts\/(\d+)/);
            if (urlMatch) {
                scriptId = urlMatch[1];
                // Try to find script name from header
                const scriptName = document.querySelector('#script-info header h2')?.textContent?.trim();
                if (scriptName) {
                    const slug = scriptName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    codeUrl = `https://update.greasyfork.org/scripts/${scriptId}/${encodeURIComponent(scriptName.replace(/[^\w\s-]/g, '').replace(/\s+/g, ' '))}.user.js`;
                }
            }
        }

        // Method 3: Look for any .user.js link in the page
        if (!codeUrl) {
            const anyUserJsLink = document.querySelector('a[href*=".user.js"]');
            if (anyUserJsLink) {
                codeUrl = anyUserJsLink.href;
            }
        }

        if (!codeUrl) return;

        const scriptName = document.querySelector('#script-info header h2')?.textContent?.trim() || 'script';

        // Find the header to insert buttons
        const header = scriptInfo.querySelector('header');
        if (!header) return;

        const buttons = createActionButtons(codeUrl, scriptName, true);

        // Adjust header styles and insert buttons
        header.style.position = 'relative';
        header.insertBefore(buttons, header.firstChild);
        buttons.style.position = 'absolute';
        buttons.style.top = '0';
        buttons.style.right = '0';
    }

    /**
     * Inject buttons on code view page
     */
    function injectCodePageButtons() {
        // Check if we're on a code page
        if (!window.location.pathname.includes('/code')) return;

        const codeContainer = document.querySelector('.code-container');
        if (!codeContainer) return;

        // Skip if already processed
        if (codeContainer.querySelector('.gf-quick-actions-page')) return;

        // Find the install link
        const installLink = document.querySelector('a.install-link[href*=".user.js"]');
        if (!installLink) return;

        const codeUrl = installLink.href;
        const scriptName = document.querySelector('#script-info header h2')?.textContent?.trim() || 'script';

        const buttons = createActionButtons(codeUrl, scriptName, true);
        buttons.style.marginBottom = '12px';

        codeContainer.insertBefore(buttons, codeContainer.firstChild);
    }

    // ==================== INITIALIZATION ====================

    function init() {
        // Initial injection
        injectSearchResultButtons();
        injectPageHeaderButtons();
        injectCodePageButtons();

        // Watch for dynamic content (pagination, infinite scroll, etc.)
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;

            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches?.('li[data-script-id]') ||
                                node.querySelector?.('li[data-script-id]')) {
                                shouldCheck = true;
                                break;
                            }
                        }
                    }
                }
                if (shouldCheck) break;
            }

            if (shouldCheck) {
                // Debounce
                clearTimeout(observer.timeout);
                observer.timeout = setTimeout(() => {
                    injectSearchResultButtons();
                }, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Handle SPA navigation
        let lastUrl = location.href;
        const urlObserver = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(() => {
                    injectSearchResultButtons();
                    injectPageHeaderButtons();
                    injectCodePageButtons();
                }, 500);
            }
        });

        urlObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();