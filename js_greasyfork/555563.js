// ==UserScript==
// @name         GitHub Actions - Extra Buttons
// @namespace    https://github.com/
// @version      1.0
// @description  Adds a button on GitHub Actions pages to scroll to the top easily
// @author       chaoscreater
// @match        https://github.com/*/actions/runs/*/job/*
// @match        https://github.*.co.nz/*/*/actions/runs/*/job/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555563/GitHub%20Actions%20-%20Extra%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/555563/GitHub%20Actions%20-%20Extra%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if current URL matches the @match patterns
    function shouldShowButton() {
        const url = window.location.href;
        // Match: https://github.com/*/actions/runs/*/job/*
        const pattern1 = /^https:\/\/github\.com\/[^/]+\/[^/]+\/actions\/runs\/[^/]+\/job\/[^/]+/;
        // Match: https://github.*.co.nz/*/*/actions/runs/*/job/*
        const pattern2 = /^https:\/\/github[^/]*\.co\.nz\/[^/]+\/[^/]+\/actions\/runs\/[^/]+\/job\/[^/]+/;
        return pattern1.test(url) || pattern2.test(url);
    }

    // Helper function to create a button
    function createButton(text, backgroundColor, bottom) {
        const button = document.createElement('button');
        button.innerText = text;
        Object.assign(button.style, {
            position: 'fixed',
            bottom: bottom,
            left: '20px',
            padding: '4px 7px',
            fontSize: '11px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: backgroundColor,
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            zIndex: '9999',
            opacity: '0.8',
            transition: 'opacity 0.2s, transform 0.2s',
        });

        // Hover effect
        button.addEventListener('mouseenter', () => {
            button.style.opacity = '1';
            button.style.transform = 'scale(1.05)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.opacity = '0.8';
            button.style.transform = 'scale(1.0)';
        });

        return button;
    }

    // Create the Top button
    const topBtn = createButton('⬆️ Top', '#2ea44f', '20px');
    topBtn.addEventListener('click', () => {
        // Find all workflow step details elements and close them
        const stepDetails = document.querySelectorAll('.js-checks-log-details');
        stepDetails.forEach(detail => {
            if (detail.hasAttribute('open')) {
                detail.removeAttribute('open');
            }
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Create the Collapse All button
    const collapseBtn = createButton('➖ Collapse All', '#0969da', '50px');
    collapseBtn.addEventListener('click', () => {
        const stepDetails = document.querySelectorAll('.js-checks-log-details');
        stepDetails.forEach(detail => {
            if (detail.hasAttribute('open')) {
                detail.removeAttribute('open');
            }
        });
    });

    // Create the Expand All button
    const expandBtn = createButton('➕ Expand All', '#8250df', '80px');
    expandBtn.addEventListener('click', () => {
        const stepDetails = document.querySelectorAll('.js-checks-log-details');
        stepDetails.forEach(detail => {
            if (!detail.hasAttribute('open')) {
                detail.setAttribute('open', '');
            }
        });
    });

    // Create the Summary button
    const summaryBtn = createButton('📋 Summary', '#bf8700', '110px');
    summaryBtn.addEventListener('click', () => {
        // Extract the run ID from current URL and navigate to summary
        const url = window.location.href;
        const runMatch = url.match(/\/actions\/runs\/(\d+)/);
        if (runMatch) {
            const runId = runMatch[1];
            const baseUrl = url.split('/actions/')[0];
            window.location.href = `${baseUrl}/actions/runs/${runId}`;
        }
    });

    // Create the Workflow button
    const workflowBtn = createButton('🔄 Workflow', '#6e7781', '140px');
    workflowBtn.addEventListener('click', () => {
        // Try to find the workflow link from the page header
        const workflowLink = document.querySelector('a.Link[href*="/actions/workflows/"]');
        if (workflowLink && workflowLink.href) {
            window.location.href = workflowLink.href;
        } else {
            // Fallback to actions page if link not found
            const url = window.location.href;
            const baseUrl = url.split('/actions/')[0];
            window.location.href = `${baseUrl}/actions`;
        }
    });

    // Update button visibility based on URL
    function updateButtonVisibility() {
        const buttons = [topBtn, collapseBtn, expandBtn, summaryBtn, workflowBtn];
        if (shouldShowButton()) {
            buttons.forEach(btn => {
                if (!btn.parentElement) {
                    document.body.appendChild(btn);
                }
                btn.style.display = 'block';
            });
        } else {
            buttons.forEach(btn => {
                btn.style.display = 'none';
            });
        }
    }

    // Initial check
    updateButtonVisibility();

    // Monitor URL changes (GitHub uses client-side routing)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            updateButtonVisibility();
        }
    }).observe(document, { subtree: true, childList: true });
})();
