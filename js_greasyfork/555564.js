// ==UserScript==
// @name         Auto-Tick options in Github / GHES
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description Auto-tick skip, untick GHES modules, populate search with ${SEARCH_PREFIX}, set default branch to YourUserName.
// @locale en
// @match        https://github.com/*/*/workflows*
// @match        https://github.*.co.nz/*/*/actions/workflows/*
// @match        https://github.*.co.nz/*/*/actions/runs/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555564/Auto-Tick%20options%20in%20Github%20%20GHES.user.js
// @updateURL https://update.greasyfork.org/scripts/555564/Auto-Tick%20options%20in%20Github%20%20GHES.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEBUG = true; // Set to false to disable logging
    const log = (...args) => DEBUG && console.log('[RL-AutoTick]', ...args);
    const logState = () => log('State:', { allowTick, allowDevTick, branchSet, searchSet, userModified, url: window.location.href });

    let allowTick = false; // Start as false - only enable after branch is selected
    let allowDevTick = true;
    let lastBranch = null;
    let branchSet = false;
    let searchSet = false;
    let userModified = false;
    let branchSelectionAttempted = false;

    const SEARCH_PREFIX = "feature/RickyL";

    log('Script initialized');
    logState();

    const targetId = "input_3"; // skipPROD checkbox
    const untickTargetId = "input_1"; // use-modules-on-ghes checkbox

    let skipProdDone = false;
    let ghesModulesDone = false;
    let skipProdUserModified = false;

    const tickSkipProdBox = () => {
        if (skipProdUserModified) {
            log('tickSkipProdBox() - skipping, user has modified this checkbox');
            skipProdDone = true;
            return false;
        }
        const el = document.getElementById(targetId);
        if (el && !el.checked) {
            log('tickSkipProdBox() - found unchecked, ticking now');
            el.checked = true;
            el.dispatchEvent(new Event("change", { bubbles: true }));
            log('✓ Ticked skipPROD checkbox');
            skipProdDone = true;
            // Add listener to detect user modification (only once)
            if (!el.dataset.rlListenerAdded) {
                el.dataset.rlListenerAdded = 'true';
                el.addEventListener('click', () => {
                    log('User clicked skipPROD checkbox');
                    skipProdUserModified = true;
                });
            }
            return true;
        } else if (el && el.checked) {
            skipProdDone = true; // Already checked
            // Add listener even if already checked
            if (!el.dataset.rlListenerAdded) {
                el.dataset.rlListenerAdded = 'true';
                el.addEventListener('click', () => {
                    log('User clicked skipPROD checkbox');
                    skipProdUserModified = true;
                });
            }
        }
        return false;
    };

    let ghesModulesUserModified = false;

    const tickGhesBox = () => {
        if (ghesModulesUserModified) {
            log('tickGhesBox() - skipping, user has modified this checkbox');
            ghesModulesDone = true;
            return false;
        }
        const el = document.getElementById(untickTargetId);
        if (el && !el.checked) {
            log('tickGhesBox() - found unchecked, ticking now');
            el.checked = true;
            el.dispatchEvent(new Event("change", { bubbles: true }));
            log('✓ Ticked GHES modules checkbox');
            ghesModulesDone = true;
            // Add listener to detect user modification (only once)
            if (!el.dataset.rlGhesListenerAdded) {
                el.dataset.rlGhesListenerAdded = 'true';
                el.addEventListener('click', () => {
                    log('User clicked GHES modules checkbox');
                    ghesModulesUserModified = true;
                });
            }
            return true;
        } else if (el && el.checked) {
            ghesModulesDone = true; // Already checked
            // Add listener even if already checked
            if (!el.dataset.rlGhesListenerAdded) {
                el.dataset.rlGhesListenerAdded = 'true';
                el.addEventListener('click', () => {
                    log('User clicked GHES modules checkbox');
                    ghesModulesUserModified = true;
                });
            }
        }
        return false;
    };

    // Helper function to check if approval overlay is visible
    const isApprovalOverlayVisible = () => {
        // Look for the dialog with class js-gates-dialog that has the 'open' attribute
        const dialog = document.querySelector('dialog.js-gates-dialog[open]');
        if (!dialog) return false;

        // Double-check that it contains the approval environment elements
        const approvalEnv = dialog.querySelector('.ActionsApprovalOverlay-environment');
        return !!approvalEnv;
    };

    const tickDevBox = () => {
        // Find DEV checkbox by looking for the label containing "DEV" text
        const labels = document.querySelectorAll('.ActionsApprovalOverlay-environment');
        if (labels.length === 0) return false;

        for (const label of labels) {
            const text = label.textContent.trim();
            if (text.startsWith('DEV') || text.match(/^DEV\s/)) {
                const checkbox = label.querySelector('input[type="checkbox"]');
                if (checkbox && !checkbox.checked) {
                    log('tickDevBox() - found unchecked DEV, ticking now');
                    // Trigger a real click event instead of just setting checked
                    checkbox.click();
                    log('✓ Ticked DEV checkbox');
                    return true;
                }
            }
        }
        return false;
    };


    const setBranch = () => {
        if (branchSet) return;
        const buttons = document.querySelectorAll('button[name="branch"]');
        if (buttons.length === 0) return;

        branchSelectionAttempted = true;
        log('setBranch() - found', buttons.length, 'branch buttons, checking for match');

        let foundMatch = false;
        for (const btn of buttons) {
            if (btn.value.startsWith(SEARCH_PREFIX + '/')) {
                log('✓ Clicking branch button:', btn.value);
                btn.click();
                branchSet = true;
                foundMatch = true;

                // Tick checkboxes after branch selection
                // Wait for form to reset, then tick
                setTimeout(() => {
                    log('Post-setBranch: enabling checkbox ticking');
                    skipProdDone = false;
                    ghesModulesDone = false;
                    allowTick = true;
                    tickSkipProdBox();
                    tickGhesBox();
                }, 500);

                return;
            }
        }

        if (!foundMatch) {
            log('No matching branch found with prefix:', SEARCH_PREFIX);
            // No matching branch found, but a branch is already selected
            // Enable checkbox ticking for the current branch
            const branchButton = document.querySelector('button[data-hotkey="b"]');
            if (branchButton) {
                const span = branchButton.querySelector('span[data-menu-button]');
                const currentBranch = span ? span.textContent.trim() : '';
                if (currentBranch) {
                    log('Using existing branch:', currentBranch);
                    setTimeout(() => {
                        log('No custom branch found, ticking checkboxes for existing branch');
                        skipProdDone = false;
                        ghesModulesDone = false;
                        allowTick = true;
                        tickSkipProdBox();
                        tickGhesBox();
                    }, 400);
                }
            }
        }
    };

    // Watch for branch changes by monitoring the branch display button
    let branchObserverSetup = false;
    const watchBranchChanges = () => {
        // Find the branch button that shows the currently selected branch
        const branchButton = document.querySelector('button[data-hotkey="b"]');
        if (!branchButton) {
            return false;
        }

        const getCurrentBranch = () => {
            const span = branchButton.querySelector('span[data-menu-button]');
            return span ? span.textContent.trim() : '';
        };

        const currentBranch = getCurrentBranch();
        if (lastBranch === null && currentBranch) {
            lastBranch = currentBranch;
            log('Initial branch detected:', lastBranch);

            // If branch already selected on load, tick checkboxes
            setTimeout(() => {
                log('Branch present on load, ticking checkboxes');
                skipProdDone = false;
                ghesModulesDone = false;
                allowTick = true;
                tickSkipProdBox();
                tickGhesBox();
            }, 400);
        }

        if (branchObserverSetup) return true;

        // Set up observer on the branch button
        const branchObs = new MutationObserver(() => {
            const newBranch = getCurrentBranch();
            if (newBranch && newBranch !== lastBranch) {
                log('Branch changed from', lastBranch, 'to', newBranch);
                lastBranch = newBranch;

                // Reset and re-enable checkbox ticking after branch change
                skipProdDone = false;
                ghesModulesDone = false;
                allowTick = true;

                // Wait for form to reset, then tick checkboxes
                setTimeout(() => {
                    log('Post-branch-change: ticking checkboxes');
                    tickSkipProdBox();
                    tickGhesBox();
                }, 400);
            }
        });

        branchObs.observe(branchButton, { childList: true, subtree: true, characterData: true });
        log('Branch observer set up successfully on branch button');
        branchObserverSetup = true;
        return true;
    };

    // Track overlay state to detect close events
    let overlayWasOpen = false;

    // Observe for approval overlay appearance and disappearance
    const approvalObs = new MutationObserver(() => {
        const isOpen = isApprovalOverlayVisible();

        if (isOpen && !overlayWasOpen) {
            log('🔵 Review pending deployments menu OPENED');
            overlayWasOpen = true;
            // Overlay is visible - ensure flag is set to allow ticking
            if (!allowDevTick) {
                log('Re-enabling allowDevTick');
                allowDevTick = true;
            }
        } else if (!isOpen && overlayWasOpen) {
            // Overlay just closed - reset flag for next time it opens
            log('🔴 Review pending deployments menu CLOSED');
            overlayWasOpen = false;
            allowDevTick = true;
        }
    });
    approvalObs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

    // Trigger lazy-loading of branch list by simulating hover
    const triggerBranchLoad = (menu) => {
        log('Triggering branch list lazy-load');
        // Find the scrollable list container
        const list = menu.querySelector('.SelectMenu-list');
        if (list) {
            // Dispatch mouse events to trigger lazy loading
            list.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            list.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

            // Also try focusing on the container
            const container = menu.querySelector('[role="menu"]') || list;
            if (container) {
                container.focus();
            }
        }
    };

    // Observe for modal appearance or visibility - with smarter branch detection
    let modalOpenTime = 0;
    let branchLoadTriggered = false;
    const modalObs = new MutationObserver(() => {
        const menu = document.querySelector('.SelectMenu-modal');
        if (menu && (menu.offsetHeight > 0 || menu.style.display !== 'none')) {
            const now = Date.now();
            // Only log once per modal open
            if (now - modalOpenTime > 500) {
                log('Branch selection modal opened');
                modalOpenTime = now;
                branchLoadTriggered = false;
            }

            // Trigger lazy-load if not already done
            if (!branchLoadTriggered && !branchSet) {
                triggerBranchLoad(menu);
                branchLoadTriggered = true;
            }

            const el = document.getElementById("context-commitish-filter-field");
            if (el && !searchSet) {
                const populateSearchField = (attempt = 1) => {
                    // Check if modal is still open before retrying
                    const menuStillOpen = document.querySelector('.SelectMenu-modal');
                    if (!menuStillOpen || menuStillOpen.offsetHeight === 0) {
                        log('Modal closed, stopping search field population');
                        return;
                    }

                    // Check if element is ready for input
                    if (el && el.offsetParent !== null && !el.disabled) {
                        if (el.value === "") {
                            log('Populating search field with:', SEARCH_PREFIX);
                            el.focus(); // Ensure field has focus
                            el.value = SEARCH_PREFIX;
                            el.dispatchEvent(new Event("input", { bubbles: true }));
                            el.dispatchEvent(new Event("change", { bubbles: true })); // Additional event
                            searchSet = true;
                            el.addEventListener('input', () => {
                                if (el.value !== SEARCH_PREFIX) {
                                    log('User modified search field');
                                    userModified = true;
                                }
                            });
                        }
                    } else if (attempt < 8) {
                        log('Search field not ready, retry', attempt);
                        // More retries with longer delays for Mac performance
                        setTimeout(() => populateSearchField(attempt + 1), 300 * attempt);
                    }
                };
                setTimeout(() => populateSearchField(), 150);
            }

            // Only try setBranch if we haven't already attempted AND buttons exist
            if (!branchSelectionAttempted) {
                const buttons = document.querySelectorAll('button[name="branch"]');
                if (buttons.length > 0) {
                    setBranch();
                }
            }
        }
    });
    modalObs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

    // Observe for branch selection modal close to re-tick checkboxes
    let branchModalWasOpen = false;
    const menuWaitObs = new MutationObserver(() => {
        const menu = document.querySelector('.SelectMenu-modal');
        const isModalOpen = menu && menu.offsetHeight > 0;

        if (isModalOpen && !branchModalWasOpen) {
            branchModalWasOpen = true;
        } else if (!isModalOpen && branchModalWasOpen) {
            log('🔄 Branch selection modal CLOSED - re-ticking checkboxes');
            branchModalWasOpen = false;

            // Reset search state if user modified
            if (userModified) {
                searchSet = false;
                userModified = false;
            }

            // Check if popover is still open
            const popover = document.querySelector('.Popover-message');
            const popoverStillOpen = popover &&
                                    popover.offsetParent !== null &&
                                    popover.offsetHeight > 0 &&
                                    window.getComputedStyle(popover).display !== 'none';

            if (popoverStillOpen) {
                // Popover still open, re-tick checkboxes after modal closes
                setTimeout(() => {
                    log('Modal closed, popover still open - re-ticking checkboxes');
                    skipProdDone = false;
                    ghesModulesDone = false;
                    allowTick = true;
                    tickSkipProdBox();
                    tickGhesBox();
                }, 200);
            }
        }
    });
    menuWaitObs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

    // Observe for Run Workflow Popover close to reset state
    // The popover exists in the DOM but is hidden, so check for visibility differently
    let popoverWasOpen = false;
    let popoverCheckCount = 0;
    const popoverObs = new MutationObserver(() => {
        const popover = document.querySelector('.Popover-message');

        // Check if popover is actually visible (not just in DOM)
        const isOpen = popover &&
                      popover.offsetParent !== null &&
                      popover.offsetHeight > 0 &&
                      window.getComputedStyle(popover).display !== 'none';

        popoverCheckCount++;
        if (popoverCheckCount % 100 === 0) {
            log('Popover check #' + popoverCheckCount + ' - found:', !!popover, 'visible:', isOpen, 'wasOpen:', popoverWasOpen);
        }

        if (isOpen && !popoverWasOpen) {
            log('🎯 Run workflow popover OPENED');
            popoverWasOpen = true;
        } else if (!isOpen && popoverWasOpen) {
            log('🎯 Run workflow popover CLOSED - resetting state for next open');
            popoverWasOpen = false;
            // Reset state so checkboxes can be ticked again next time
            allowTick = false;
            skipProdDone = false;
            ghesModulesDone = false;
            skipProdUserModified = false;
            ghesModulesUserModified = false;
            branchSet = false;
            branchSelectionAttempted = false;
            searchSet = false;
            userModified = false;
            logState();
        }
    });
    popoverObs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    log('Popover observer set up, watching for .Popover-message');

    // Set up branch watcher first
    log('Setting up branch change watcher');
    watchBranchChanges();

    // Try DEV checkbox immediately
    log('Initial attempt to tick DEV checkbox');
    tickDevBox();

    // Try setting branch immediately (if no branch selected yet)
    log('Initial attempt to set branch');
    setBranch();

    // DOM is dynamic → observe until element appears
    // Throttle to reduce excessive calls but not too aggressive
    let lastObsRun = 0;
    const obs = new MutationObserver(() => {
        const now = Date.now();
        if (now - lastObsRun < 50) return; // Throttle to max 20 calls/sec (less aggressive)
        lastObsRun = now;

        // Set up branch watcher if not already done
        if (!branchObserverSetup) {
            watchBranchChanges();
        }

        if (allowTick) {
            tickSkipProdBox();
            tickGhesBox();

            // Only disable allowTick when BOTH are done
            if (skipProdDone && ghesModulesDone) {
                allowTick = false;
                log('Both checkboxes handled, disabling allowTick');
                logState();
            }
        }
        if (allowDevTick) {
            const devTicked = tickDevBox();
            if (devTicked) {
                allowDevTick = false; // Disable after successful tick, just like skip PROD
                log('Mutation observer DEV tick successful, disabling allowDevTick');
                logState();
            }
        }
        // Don't call setBranch here - it's handled by modalObs when buttons exist
    });

    obs.observe(document.body, { childList: true, subtree: true });

    // Monitor URL changes for SPA navigation - multiple detection methods
    let lastUrl = window.location.href;

    const resetStateForNewPage = () => {
        log('Navigated to workflows/runs page - resetting state');
        allowTick = false; // Start false, enable after branch selection
        allowDevTick = true;
        searchSet = false;
        branchSet = false;
        branchSelectionAttempted = false;
        skipProdDone = false;
        ghesModulesDone = false;
        skipProdUserModified = false;
        ghesModulesUserModified = false;
        lastBranch = null;
        branchObserverSetup = false;
        popoverWasOpen = false;
        branchModalWasOpen = false;
        overlayWasOpen = false;
        logState();

        // Set up branch watcher for new page
        setTimeout(() => watchBranchChanges(), 100);
    };

    const handleUrlChange = (newUrl) => {
        if (newUrl !== lastUrl) {
            log('URL changed from', lastUrl, 'to', newUrl);
            lastUrl = newUrl;
            if (newUrl.includes('/workflows') || newUrl.includes('/actions/runs/') || newUrl.includes('/actions/workflows/')) {
                resetStateForNewPage();
            }
        }
    };

    // Method 1: Polling (fallback)
    setInterval(() => {
        handleUrlChange(window.location.href);
    }, 200);

    // Method 2: Listen to popstate (browser back/forward)
    window.addEventListener('popstate', () => {
        log('popstate event detected');
        setTimeout(() => handleUrlChange(window.location.href), 50);
    });

    // Method 3: Monitor pushState/replaceState (GitHub's SPA navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        log('pushState detected');
        setTimeout(() => handleUrlChange(window.location.href), 50);
    };

    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        log('replaceState detected');
        setTimeout(() => handleUrlChange(window.location.href), 50);
    };

    // Method 4: Watch for turbo:load event (GitHub uses Turbo)
    document.addEventListener('turbo:load', () => {
        log('turbo:load event detected');
        setTimeout(() => handleUrlChange(window.location.href), 50);
    });

    // Method 5: Watch for pjax events (older GitHub navigation)
    document.addEventListener('pjax:end', () => {
        log('pjax:end event detected');
        setTimeout(() => handleUrlChange(window.location.href), 50);
    });

    log('All observers set up, monitoring for changes');

})();