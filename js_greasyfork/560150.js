// ==UserScript==
// @name         GitHub to Gitingest Button
// @namespace    https://github.com/abd3lraouf
// @version      1.0
// @description  Adds a Gitingest button to GitHub repository pages (works on all repo paths)
// @author       abd3lraouf
// @license      MIT
// @match        https://github.com/*
// @grant        none
// @homepageURL  https://github.com/abd3lraouf/github-to-gitingest
// @supportURL   https://github.com/abd3lraouf/github-to-gitingest/issues
// @original     https://greasyfork.org/en/scripts/527278
// @downloadURL https://update.greasyfork.org/scripts/560150/GitHub%20to%20Gitingest%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/560150/GitHub%20to%20Gitingest%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_ID = 'gitingest-button';

    /**
     * Check if current page is a repository page (including subdirectories)
     */
    function isRepoPage() {
        const pathParts = location.pathname.split('/').filter(Boolean);
        // Need at least owner/repo
        if (pathParts.length < 2) return false;

        // Exclude non-repo pages
        const nonRepoPages = ['settings', 'organizations', 'orgs', 'users', 'search', 'explore', 'marketplace', 'sponsors', 'notifications', 'new', 'login', 'signup'];
        if (nonRepoPages.includes(pathParts[0])) return false;

        return true;
    }

    /**
     * Get the repository path (owner/repo) plus any subpath
     */
    function getRepoPath() {
        return location.pathname;
    }

    /**
     * Create the Gitingest button with GitHub's native styling using safe DOM methods
     */
    function createButton() {
        // Don't duplicate
        if (document.getElementById(BUTTON_ID)) return null;

        const button = document.createElement('a');
        button.id = BUTTON_ID;
        button.href = `https://gitingest.com${getRepoPath()}`;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.className = 'prc-Button-ButtonBase-9n-Xk';
        button.setAttribute('data-loading', 'false');
        button.setAttribute('data-no-visuals', 'true');
        button.setAttribute('data-size', 'small');
        button.setAttribute('data-variant', 'default');
        button.title = 'Open in Gitingest';

        // Build button content using safe DOM methods
        const buttonContent = document.createElement('span');
        buttonContent.setAttribute('data-component', 'buttonContent');
        buttonContent.setAttribute('data-align', 'center');
        buttonContent.className = 'prc-Button-ButtonContent-Iohp5';

        const labelSpan = document.createElement('span');
        labelSpan.setAttribute('data-component', 'text');
        labelSpan.className = 'prc-Button-Label-FWkx3';
        labelSpan.textContent = 'Gitingest';

        buttonContent.appendChild(labelSpan);
        button.appendChild(buttonContent);

        // Apply GitHub button styles
        button.style.textDecoration = 'none';
        button.style.marginLeft = '4px';

        return button;
    }

    /**
     * Find the copy path button and insert our button next to it
     */
    function insertButton() {
        if (!isRepoPage()) return;
        if (document.getElementById(BUTTON_ID)) return;

        // Target: copy path button (the one with octicon-copy)
        const copyPathButton = document.querySelector('[data-testid="breadcrumbs-filename"] button[data-component="IconButton"]');

        if (copyPathButton) {
            const button = createButton();
            if (button) {
                copyPathButton.parentNode.insertBefore(button, copyPathButton.nextSibling);
                return;
            }
        }

        // Fallback: try repo header area (for main repo page)
        const repoHeader = document.querySelector('#repository-container-header');
        if (repoHeader) {
            const actionsContainer = repoHeader.querySelector('.d-flex.gap-2');
            if (actionsContainer && !document.getElementById(BUTTON_ID)) {
                const button = createButton();
                if (button) {
                    actionsContainer.prepend(button);
                    return;
                }
            }
        }

        // Another fallback: breadcrumb area
        const breadcrumbArea = document.querySelector('#repos-header-breadcrumb');
        if (breadcrumbArea && !document.getElementById(BUTTON_ID)) {
            const container = breadcrumbArea.closest('.react-code-view-header-mb--narrow');
            if (container) {
                const button = createButton();
                if (button) {
                    container.appendChild(button);
                }
            }
        }
    }

    /**
     * Remove existing button (for SPA navigation)
     */
    function removeButton() {
        const existing = document.getElementById(BUTTON_ID);
        if (existing) {
            existing.remove();
        }
    }

    // Initial insertion
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertButton);
    } else {
        insertButton();
    }

    // Handle GitHub's SPA navigation
    const observer = new MutationObserver(() => {
        // Check if we need to re-insert (page changed)
        if (!document.getElementById(BUTTON_ID) && isRepoPage()) {
            insertButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also handle turbo navigation
    document.addEventListener('turbo:load', () => {
        removeButton();
        setTimeout(insertButton, 100);
    });

    document.addEventListener('turbo:render', () => {
        setTimeout(insertButton, 100);
    });

    // Handle pjax (older GitHub navigation)
    document.addEventListener('pjax:end', () => {
        removeButton();
        setTimeout(insertButton, 100);
    });
})();