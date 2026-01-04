// ==UserScript==
// @name         Auto-Click Review Deployments on GHES
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically click "Review deployments" button and optionally auto-approve DEV deployments
// @locale       en
// @match        https://github.*.co.nz/*/*/actions/runs/*
// @match        https://github.*.co.nz/*/*/actions/workflows/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557830/Auto-Click%20Review%20Deployments%20on%20GHES.user.js
// @updateURL https://update.greasyfork.org/scripts/557830/Auto-Click%20Review%20Deployments%20on%20GHES.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentInterval = null;
    let waitingForReviewInterval = null;
    let initialUrl = location.href;
    let autoApproveEnabled = localStorage.getItem('rl-auto-approve-dev') === 'true';
    let toggleButton = null;

    function clickWaitingForReview() {
        // Look for "waiting for review" text in workflow jobs
        const allElements = document.querySelectorAll('*');
        let clickedCount = 0;

        for (const element of allElements) {
            const text = element.textContent.trim();
            if (text === 'waiting for review') {
                console.log(`[RL - Auto-Click Review] ✓ Found "waiting for review" element`);

                // Find the parent link (the job link)
                const jobLink = element.closest('streaming-graph-job')?.querySelector('a.WorkflowJob-title');
                if (jobLink) {
                    console.log(`[RL - Auto-Click Review] ✓ Clicking job link: ${jobLink.href}`);
                    jobLink.click();
                    clickedCount++;
                }
            }
        }

        return clickedCount > 0;
    }

    function autoApproveIfDevChecked(dialog) {
        if (!autoApproveEnabled) {
            console.log('[RL - Auto-Click Review] Auto-approve is disabled, skipping.');
            return false;
        }

        // Find all environment checkboxes
        const checkboxes = dialog.querySelectorAll('.js-gates-dialog-environment-checkbox');
        console.log(`[RL - Auto-Click Review] Found ${checkboxes.length} environment checkboxes`);

        let devCheckbox = null;
        for (const checkbox of checkboxes) {
            const label = checkbox.closest('label');
            if (label) {
                const text = label.textContent.trim();
                console.log(`[RL - Auto-Click Review] Checkbox environment: "${text}"`);

                // Check if this is the DEV environment (case-insensitive)
                if (/\bDEV\b/i.test(text)) {
                    devCheckbox = checkbox;
                    console.log(`[RL - Auto-Click Review] ✓ Found DEV checkbox, checked: ${checkbox.checked}`);
                    break;
                }
            }
        }

        if (!devCheckbox) {
            console.log('[RL - Auto-Click Review] ✗ DEV checkbox not found');
            return false;
        }

        if (!devCheckbox.checked) {
            console.log('[RL - Auto-Click Review] ✗ DEV checkbox is not checked');
            return false;
        }

        // DEV is checked, find and click the approve button
        const approveButton = dialog.querySelector('.js-gates-approval-dialog-approve-button');
        if (approveButton && !approveButton.disabled) {
            console.log('[RL - Auto-Click Review] ✓ DEV is checked! Clicking approve button...');
            approveButton.click();
            return true;
        } else {
            console.log(`[RL - Auto-Click Review] ✗ Approve button not found or disabled: ${approveButton?.disabled}`);
            return false;
        }
    }

    function clickReviewButton() {
        // First, look for "Review deployments" buttons
        const buttons = document.querySelectorAll('button[data-show-dialog-id]');
        console.log(`[RL - Auto-Click Review] Found ${buttons.length} buttons with data-show-dialog-id`);

        let clickedCount = 0;
        for (const button of buttons) {
            const text = button.textContent.trim();
            console.log(`[RL - Auto-Click Review] Button text: "${text}"`);

            // Check for "Review deployments" buttons first
            if (text.includes('Review deployments') && !text.includes('Review pending deployments')) {
                const dialogId = button.getAttribute('data-show-dialog-id');
                console.log(`[RL - Auto-Click Review] ✓ Review deployments button found: "${text}", dialog ID: ${dialogId}`);

                // Click the button
                button.click();
                clickedCount++;

                // Wait a bit and check if dialog opened
                setTimeout(() => {
                    const dialog = document.getElementById(dialogId);
                    if (dialog) {
                        console.log(`[RL - Auto-Click Review] Dialog ${dialogId} exists, has 'open' attribute: ${dialog.hasAttribute('open')}`);

                        // Force the dialog to open if it's not already
                        if (!dialog.hasAttribute('open')) {
                            console.log(`[RL - Auto-Click Review] ⚠️ Dialog not open, forcing it to open...`);
                            dialog.setAttribute('open', '');
                            dialog.showModal?.();
                        }

                        // Ensure dialog is visible
                        dialog.style.display = 'block';
                        dialog.style.visibility = 'visible';
                        dialog.style.opacity = '1';
                        console.log(`[RL - Auto-Click Review] ✓ Dialog ${dialogId} should now be visible`);

                        // Try to auto-approve if enabled
                        setTimeout(() => autoApproveIfDevChecked(dialog), 500);
                    } else {
                        console.log(`[RL - Auto-Click Review] ✗ Dialog ${dialogId} not found in DOM`);
                    }
                }, 300);
            }
        }

        // If no "Review deployments" buttons were clicked, check for "Review pending deployments" button
        if (clickedCount === 0) {
            console.log(`[RL - Auto-Click Review] No "Review deployments" buttons found, checking for "Review pending deployments"...`);

            // Look for "Review pending deployments" button
            for (const button of buttons) {
                const text = button.textContent.trim();
                if (text.includes('Review pending deployments')) {
                    const dialogId = button.getAttribute('data-show-dialog-id');
                    console.log(`[RL - Auto-Click Review] ✓ "Review pending deployments" button found, dialog ID: ${dialogId}`);

                    // Click the button
                    button.click();
                    clickedCount++;

                    // Wait a bit and check if dialog opened
                    setTimeout(() => {
                        const dialog = document.getElementById(dialogId);
                        if (dialog) {
                            console.log(`[RL - Auto-Click Review] Dialog ${dialogId} exists, has 'open' attribute: ${dialog.hasAttribute('open')}`);

                            // Force the dialog to open if it's not already
                            if (!dialog.hasAttribute('open')) {
                                console.log(`[RL - Auto-Click Review] ⚠️ Dialog not open, forcing it to open...`);
                                dialog.setAttribute('open', '');
                                dialog.showModal?.();
                            }

                            // Ensure dialog is visible
                            dialog.style.display = 'block';
                            dialog.style.visibility = 'visible';
                            dialog.style.opacity = '1';
                            console.log(`[RL - Auto-Click Review] ✓ Dialog ${dialogId} should now be visible`);

                            // Try to auto-approve if enabled
                            setTimeout(() => autoApproveIfDevChecked(dialog), 500);
                        } else {
                            console.log(`[RL - Auto-Click Review] ✗ Dialog ${dialogId} not found in DOM`);
                        }
                    }, 300);

                    break;
                }
            }
        }

        return clickedCount > 0;
    }

    function startWaitingForReviewCheck() {
        // Check if URL matches the pattern: https://github.*.co.nz/*/*/actions/runs/*
        // but NOT: https://github.*.co.nz/*/*/actions/runs/*/*/*
        const urlPattern = /^https:\/\/github[^\/]*\.co\.nz\/[^\/]+\/[^\/]+\/actions\/runs\/[^\/]+\/?$/;

        if (!urlPattern.test(location.href)) {
            console.log('[RL - Auto-Click Review] ⏭️ Skipping continuous "waiting for review" check - URL pattern does not match.');
            return;
        }

        // Clear any existing waiting-for-review interval
        if (waitingForReviewInterval) {
            clearInterval(waitingForReviewInterval);
        }

        const checkIntervalMs = 5000; // Check every 5 seconds
        const timeoutMs = 50 * 60 * 1000; // 50 minutes
        const startTime = Date.now();
        const startUrl = location.href;

        console.log('[RL - Auto-Click Review] 🔍 Starting continuous check for "waiting for review" (50 min timeout)...');

        waitingForReviewInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const minutesElapsed = Math.floor(elapsed / 60000);

            // Check if page has refreshed or URL changed
            if (location.href !== startUrl) {
                clearInterval(waitingForReviewInterval);
                console.log('[RL - Auto-Click Review] 🔄 URL changed, stopping "waiting for review" check.');
                return;
            }

            // Check if timeout reached
            if (elapsed >= timeoutMs) {
                clearInterval(waitingForReviewInterval);
                console.log('[RL - Auto-Click Review] ⏱️ 50-minute timeout reached, stopping "waiting for review" check.');
                return;
            }

            console.log(`[RL - Auto-Click Review] Checking for "waiting for review" (${minutesElapsed} min elapsed)...`);

            if (clickWaitingForReview()) {
                clearInterval(waitingForReviewInterval);
                console.log('[RL - Auto-Click Review] ✓ Clicked "waiting for review" job(s)!');
            }
        }, checkIntervalMs);
    }

    function createToggleButton() {
        // Remove existing button if present
        if (toggleButton) {
            toggleButton.remove();
        }

        // Create toggle button
        toggleButton = document.createElement('button');
        toggleButton.id = 'rl-auto-approve-toggle';
        toggleButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M14.064 0h.186C15.216 0 16 .784 16 1.75v.186a8.752 8.752 0 0 1-2.564 6.186l-.458.459c-.314.314-.641.616-.979.904v3.207c0 .608-.315 1.172-.833 1.49l-2.774 1.707a.749.749 0 0 1-1.11-.418l-.954-3.102a1.214 1.214 0 0 1-.145-.125L3.754 9.816a1.218 1.218 0 0 1-.124-.145L.528 8.717a.749.749 0 0 1-.418-1.11l1.71-2.774A1.748 1.748 0 0 1 3.31 4h3.204c.288-.338.59-.665.904-.979l.459-.458A8.749 8.749 0 0 1 14.064 0ZM8.938 3.623h-.002l-.458.458c-.76.76-1.437 1.598-2.02 2.5l-1.5 2.317 2.143 2.143 2.317-1.5c.902-.583 1.74-1.26 2.499-2.02l.459-.458a7.25 7.25 0 0 0 2.123-5.127V1.75a.25.25 0 0 0-.25-.25h-.186a7.249 7.249 0 0 0-5.125 2.123ZM3.56 14.56c-.732.732-2.334 1.045-3.005 1.148a.234.234 0 0 1-.201-.064.234.234 0 0 1-.064-.201c.103-.671.416-2.273 1.15-3.003a1.502 1.502 0 1 1 2.12 2.12Zm6.94-3.935c-.088.06-.177.118-.266.175l-2.35 1.521.548 1.783 1.949-1.2a.25.25 0 0 0 .119-.213ZM3.678 8.116 5.2 5.766c.058-.09.117-.178.176-.266H3.309a.25.25 0 0 0-.213.119l-1.2 1.95ZM12 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
            </svg>
        `;
        toggleButton.title = autoApproveEnabled ? 'Auto-approve DEV: ON' : 'Auto-approve DEV: OFF';

        // Style the button
        Object.assign(toggleButton.style, {
            position: 'fixed',
            top: '60px',
            right: '15px',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: '1px solid',
            borderColor: autoApproveEnabled ? '#2da44e' : '#d0d7de',
            backgroundColor: autoApproveEnabled ? '#2da44e' : '#ffffff',
            color: autoApproveEnabled ? '#ffffff' : '#656d76',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '9999',
            padding: '0',
            transition: 'all 0.2s ease'
        });

        // Add hover effect
        toggleButton.addEventListener('mouseenter', () => {
            toggleButton.style.transform = 'scale(1.1)';
        });
        toggleButton.addEventListener('mouseleave', () => {
            toggleButton.style.transform = 'scale(1)';
        });

        // Toggle functionality
        toggleButton.addEventListener('click', () => {
            autoApproveEnabled = !autoApproveEnabled;
            localStorage.setItem('rl-auto-approve-dev', autoApproveEnabled.toString());

            // Update button appearance
            toggleButton.style.backgroundColor = autoApproveEnabled ? '#2da44e' : '#ffffff';
            toggleButton.style.color = autoApproveEnabled ? '#ffffff' : '#656d76';
            toggleButton.style.borderColor = autoApproveEnabled ? '#2da44e' : '#d0d7de';
            toggleButton.title = autoApproveEnabled ? 'Auto-approve DEV: ON' : 'Auto-approve DEV: OFF';

            console.log(`[RL - Auto-Click Review] Auto-approve toggled: ${autoApproveEnabled ? 'ON' : 'OFF'}`);
        });

        // Add to page
        document.body.appendChild(toggleButton);
        console.log('[RL - Auto-Click Review] Toggle button created');
    }

    function startSearching() {
        // Clear any existing interval
        if (currentInterval) {
            clearInterval(currentInterval);
        }
        // Clear any existing waiting-for-review interval when starting a new search
        if (waitingForReviewInterval) {
            clearInterval(waitingForReviewInterval);
        }

        // Update initial URL on new search
        initialUrl = location.href;

        let attempts = 0;
        const maxAttempts = 5; // Try for 2.5 seconds (5 * 500ms)

        console.log('[RL - Auto-Click Review] 🔍 Starting search for Review deployments button...');

        currentInterval = setInterval(() => {
            attempts++;
            console.log(`[RL - Auto-Click Review] === Attempt ${attempts} ===`);

            if (clickReviewButton()) {
                clearInterval(currentInterval);
                console.log('[RL - Auto-Click Review] ✓ Review buttons found and processed!');
            } else if (attempts >= maxAttempts) {
                clearInterval(currentInterval);
                console.log('[RL - Auto-Click Review] ✗ No review buttons found, checking for "waiting for review"...');

                // Fallback: try clicking "waiting for review" jobs
                if (clickWaitingForReview()) {
                    console.log('[RL - Auto-Click Review] ✓ Clicked "waiting for review" job(s)!');
                    // Start continuous checking for "waiting for review"
                    startWaitingForReviewCheck();
                } else {
                    console.log('[RL - Auto-Click Review] ✗ No "waiting for review" jobs found either.');
                    // Still start continuous checking in case it appears later
                    startWaitingForReviewCheck();
                }
            }
        }, 650);
    }

    // Create toggle button
    createToggleButton();

    // Start on initial page load
    startSearching();

    // Listen for Turbo/PJAX navigation events (GitHub's internal navigation)
    document.addEventListener('turbo:load', () => {
        console.log('[RL - Auto-Click Review] 🔄 Turbo navigation detected, restarting search...');
        createToggleButton();
        startSearching();
    });

    // Fallback: Listen for URL changes using MutationObserver
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('[RL - Auto-Click Review] 🔄 URL changed, restarting search...');
            startSearching();
        }
    }).observe(document, { subtree: true, childList: true });

    console.log('[RL - Auto-Click Review] ✅ Script initialized with navigation listeners');
})();
