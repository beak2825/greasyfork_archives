// ==UserScript==
// @name         Google AI Studio | Quick Actions Toolbar (Delete + Copy Markdown)
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      2.2
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Adds Delete and Copy as Markdown buttons directly to the message hover toolbar
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aistudio.google.com
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559802/Google%20AI%20Studio%20%7C%20Quick%20Actions%20Toolbar%20%28Delete%20%2B%20Copy%20Markdown%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559802/Google%20AI%20Studio%20%7C%20Quick%20Actions%20Toolbar%20%28Delete%20%2B%20Copy%20Markdown%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self !== window.top) return;

    //=============================================================================
    // CONFIGURATION
    //=============================================================================
    const CONFIG = {
        DEBUG: false,
        TOOLBAR_SELECTOR: '.actions.hover-or-edit',
        MENU_CONTAINER_SELECTOR: 'ms-chat-turn-options',

        // Timing (ms)
        SCAN_DEBOUNCE_MS: 50,
        MENU_OPEN_DELAY_MS: 1,
        COPY_FEEDBACK_MS: 1000
    };

    const log = (...args) => CONFIG.DEBUG && console.log('[Quick Actions]', ...args);

    //=============================================================================
    // STYLES
    //=============================================================================
    GM_addStyle(`
        .qa-custom-btn {
            margin: 0 2px;
            cursor: pointer;
        }
        .qa-delete-btn span.material-symbols-outlined {
            color: #ea4335 !important;
        }
        .qa-copy-md-btn span.material-symbols-outlined {
            color: #1a73e8 !important;
        }
    `);

    //=============================================================================
    // BUTTON FACTORY
    //=============================================================================
    function createQuickActionButton(iconName, tooltipText, cssClass) {
        const button = document.createElement('button');
        button.setAttribute('ms-button', '');
        button.setAttribute('variant', 'icon-borderless');
        button.setAttribute('mattooltipposition', 'below');
        button.setAttribute('aria-label', tooltipText);
        button.setAttribute('title', tooltipText);
        button.setAttribute('aria-disabled', 'false');
        button.className = `mat-mdc-tooltip-trigger ms-button-borderless ms-button-icon qa-custom-btn ${cssClass}`;
        button.dataset.qaIcon = iconName;

        const iconSpan = document.createElement('span');
        iconSpan.className = 'material-symbols-outlined notranslate ms-button-icon-symbol';
        iconSpan.setAttribute('aria-hidden', 'true');
        iconSpan.textContent = iconName;

        button.appendChild(iconSpan);
        return button;
    }

    //=============================================================================
    // MENU ACTION HELPER
    //=============================================================================

    /**
     * Click a menu item by icon name — opens menu, finds item, clicks it (synchronous)
     */
    function clickMenuItemByIcon(toolbar, iconName) {
        try {
            const menuButton = toolbar.querySelector(`${CONFIG.MENU_CONTAINER_SELECTOR} button`);
            if (!menuButton) {
                log('Menu button not found');
                return false;
            }

            menuButton.click();

            const menuItems = document.querySelectorAll('.cdk-overlay-container .mat-mdc-menu-content button');
            for (const item of menuItems) {
                const icon = item.querySelector('.material-symbols-outlined');
                if (icon && icon.textContent.trim() === iconName) {
                    item.click();
                    log(`${iconName} clicked`);
                    return true;
                }
            }

            document.body.click();
            log(`Menu item '${iconName}' not found`);
            return false;
        } catch (error) {
            log(`Error clicking '${iconName}':`, error);
            return false;
        }
    }

    function copyMarkdownDirect(toolbar) {
        const success = clickMenuItemByIcon(toolbar, 'markdown_copy');
        if (success) showCopyFeedback(toolbar);
        return success;
    }

    function deleteTurnDirect(toolbar) {
        return clickMenuItemByIcon(toolbar, 'delete');
    }

    /**
     * Show visual feedback for copy action
     */
    function showCopyFeedback(toolbar) {
        const copyBtn = toolbar.querySelector('.qa-copy-md-btn');
        if (!copyBtn) return;

        const icon = copyBtn.querySelector('.material-symbols-outlined');
        const originalIcon = icon.textContent;

        icon.textContent = 'check';
        icon.style.color = '#34a853';

        setTimeout(() => {
            icon.textContent = originalIcon;
            icon.style.color = '';
        }, CONFIG.COPY_FEEDBACK_MS);
    }

    //=============================================================================
    // TOOLBAR ENHANCEMENT
    //=============================================================================
    function enhanceToolbar(toolbar) {
        // Skip if already enhanced
        if (toolbar.querySelector('[data-qa-icon]')) return;

        const menuContainer = toolbar.querySelector(CONFIG.MENU_CONTAINER_SELECTOR);
        if (!menuContainer) {
            log('Menu container not found in toolbar');
            return;
        }

        // Create Delete button
        const deleteButton = createQuickActionButton('delete', 'Delete', 'qa-delete-btn');
        deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            deleteTurnDirect(toolbar);
        });

        // Create Copy as Markdown button
        const copyMdButton = createQuickActionButton('markdown_copy', 'Copy as markdown', 'qa-copy-md-btn');
        copyMdButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            copyMarkdownDirect(toolbar);
        });

        // Insert buttons before the menu container
        toolbar.insertBefore(copyMdButton, menuContainer);
        toolbar.insertBefore(deleteButton, menuContainer);

        log('Enhanced toolbar');
    }

    //=============================================================================
    // SCANNING & OBSERVATION
    //=============================================================================
    let scanTimeoutId = null;
    const pendingScanRoots = new Set();

    function scheduleToolbarScan() {
        if (scanTimeoutId !== null) return;

        scanTimeoutId = setTimeout(() => {
            scanTimeoutId = null;

            // Scan only newly-added subtrees when possible; fall back to full document scan.
            const roots = pendingScanRoots.size ? Array.from(pendingScanRoots) : [document];
            pendingScanRoots.clear();

            for (const root of roots) {
                try {
                    if (!root) continue;

                    // Root itself might be a toolbar
                    if (root.matches?.(CONFIG.TOOLBAR_SELECTOR)) {
                        enhanceToolbar(root);
                    }

                    // Root may contain toolbars
                    const toolbars = (root === document)
                        ? document.querySelectorAll(CONFIG.TOOLBAR_SELECTOR)
                        : root.querySelectorAll?.(CONFIG.TOOLBAR_SELECTOR);

                    if (toolbars) {
                        toolbars.forEach(enhanceToolbar);
                    }
                } catch (error) {
                    log('Scan error:', error);
                }
            }
        }, CONFIG.SCAN_DEBOUNCE_MS);
    }

    const domObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (!mutation.addedNodes || mutation.addedNodes.length === 0) continue;

            for (const node of mutation.addedNodes) {
                if (node?.nodeType !== 1) continue; // Elements only
                pendingScanRoots.add(node);
            }
        }

        if (pendingScanRoots.size > 0) {
            scheduleToolbarScan();
        }
    });

    //=============================================================================
    // INITIALIZATION
    //=============================================================================
    function initialize() {
        log('Initializing...');

        // Initial scan for existing toolbars
        scheduleToolbarScan();

        // Start observing for new toolbars
        domObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        log('Initialization complete');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();