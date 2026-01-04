// ==UserScript==
// @name         Optimized Bar-I Suite
// @namespace    https://greasyfork.org/users/1516265
// @version      5.05.07
// @description  Optimized
// @author       Nicolai Mihaic
// @license      MIT
// @match        https://app.bar-i.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bar-i.com
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551169/Optimized%20Bar-I%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/551169/Optimized%20Bar-I%20Suite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration with feature toggles
    const CONFIG = {
        FEATURES: {
            customStyles: true,
            invoiceHelper: true,
            stepHighlighting: true,   // Re-enabled
            quickFilters: true,       // Re-enabled
            accountTextHighlighting: true,  // Account manager name highlighting
            tableSortEnhancer: true,  // Re-enabled with fixes
            tableCollection: true,   // Auto-load all pages and copy table
            textareaSelection: false, // Keep disabled for now
            commTableVesselSort: true, // Communication table vessel sorting
            clickToCopy: true, // Click to copy table cells/rows
            comparisonsCopy: true // Copy data from Accountability, Liquor Cost, and Weekly Sales tabs
        },
        // Click-to-copy table configurations
        // Format: { elementSelector: string, clickColumnIndex: number, copyMode: 0 (cell only) | 1 (entire row) }
        CLICK_TO_COPY_TABLES: [
            { elementSelector: 'app-review-variance-items', clickColumnIndex: 0, copyMode: 0 },
            { elementSelector: 'app-sub-category-wise-analysis', clickColumnIndex: 2, copyMode: 1 },
            { elementSelector: 'app-communication-detials', clickColumnIndex: 2, copyMode: 0 },
            // Add more table configurations here as needed
            // Example: { elementSelector: 'app-other-table', clickColumnIndex: 2, copyMode: 0 },
            
        ]
    };

    // Simple state without complex observers
    let initialized = false;
    let invoiceHelperButtons = null;
    let quickFiltersToolbar = null;
    let tableSortEnhancerButton = null;
    let tableSortActive = false;
    let qfBusy = false; // Quick filters busy state
    let qfButtonStates = { 1: false, 2: false, 5: false, 6: false }; // Quick filters button states
    let collectedTableData = null; // Store collected table data from all pages

    console.log('[NxTweaks] Starting with minimal DOM interference...');

    // FEATURE 1: Custom Styles (No DOM observation needed)
    function initCustomStyles() {
        if (!CONFIG.FEATURES.customStyles) return;

        GM_addStyle(`
            /* Search box and sidebar styles */
            app-search {
                position: relative !important;
                display: inline-block !important;
            }
            .search-box input.bg-fa {
                background-color: #e9ecef;
                border: 1px solid gray;
                width: 400px;
                font-size: 12px;
            }
            app-search .clear-search {
                position: absolute !important;
                right: 12px !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 10 !important;
                margin-top: 0 !important;
                padding: 0 !important;
            }
            app-search .clear-search em {
                pointer-events: none;
            }
            .left-sidebar ul li a.active, .left-sidebar ul li a:active {
                background-color: #ca302d40;
            }
            .left-sidebar ul li a[aria-expanded=true]{
                background: #ebe7e7;
                color: #ca302d;
            }
            .top-tab-btn a.btn {
                border-radius: 10px;
                margin: 0 3px;
                border-left-width: 1px;
            }
            .btn-primary {
                border-radius: 5px;
            }

            /* Sticky topbar styles */
            .gray-alertbar {
                position: static !important;
                width: 100% !important;
                z-index: 9999 !important;
                text-align: center !important;
                background: #979797 !important;
                color: #fff !important;
                padding: 3px 15px !important;
                font-size: 12px !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            }

            .gray-alertbar a {
                display: inline-block !important;
                color: #f7f0f0 !important;
                background: #ca302d !important;
                border-color: #ca302d !important;
                padding: 2px 6px !important;
                border-radius: 3px !important;
                text-decoration: none !important;
                font-weight: 500 !important;
                border: 1px solid #ca302d !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
                margin-left: 8px !important;
                font-size: 12px !important;
                opacity: 1 !important;
            }

            .gray-alertbar a:hover {
                background: #b02825 !important;
                border-color: #b02825 !important;
                text-decoration: none !important;
            }


            .btn-primary.btn-primary.disabled, .btn-primary.btn-primary:disabled {
                color: #de807f !important;
                opacity: 1 !important;
                background: #ca302d !important;
                border-color: #ca302d !important;
            }

            /* Step highlighting styles */
            .conservative-ubies-step1-invoices {
                color: #28a745 !important;
                font-weight: bold;
            }
            .conservative-ubies-step2-count {
                color: #dc3545 !important;
                font-weight: bold;
            }
            .conservative-ubies-step3-sales {
                color: #fa7d34 !important;
                font-weight: bold;
            }
            .conservative-ubies-step4-communication {
                color: #34ccfa !important;
                font-weight: bold;
            }
            .conservative-ubies-step5-variance {
                color: #f0bd18 !important;
                font-weight: bold;
            }
            .conservative-ubies-step234-done {
                color: #1b54afff !important;
                font-weight: bold;
            }

            /* Account manager text highlighting in gray-alertbar */
            .conservative-ubies-account-name {
                font-weight: 500;
                font-size: 13px !important;
                font-family: Verdana, Tahoma, Arial, sans-serif !important;
                color: #f0bd18 !important;
            }

            /* Copy feedback tooltip */
            .conservative-ubies-copy-feedback {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
                z-index: 10000;
                pointer-events: none;
                animation: conservative-ubies-fadeout 1s forwards;
            }

            @keyframes conservative-ubies-fadeout {
                0%, 70% { opacity: 1; }
                100% { opacity: 0; }
            }

            /* Quick Filter button styles */
            .qf-filter-btn {
                margin-right: 8px;
                padding: 6px 12px;
                border: 1px solid #ddd;
                background: #f8f9fa;
                color: #333;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 500;
                font-size: 12px;
                transition: all 0.2s;
            }
            .qf-filter-btn:last-child {
                margin-right: 0;
            }
            .qf-filter-btn.active {
                background: #007bff;
                color: white;
                border-color: #0056b3;
                font-weight: 600;
            }
        `);

        console.log('[NxTweaks] Custom styles applied');
    }

    // FEATURE 2: Invoice Helper (URL-based show/hide)
    function initInvoiceHelper() {
        if (!CONFIG.FEATURES.invoiceHelper) return;

        console.log('[NxTweaks] Invoice helper initializing...');

        // Check URL immediately and periodically
        checkInvoicePageAndToggleButtons();
        setInterval(checkInvoicePageAndToggleButtons, 1000);
    }

    function checkInvoicePageAndToggleButtons() {
        const isOnInvoicePage = /\/barI\/analysis-workflow\/add-invoice\//.test(location.href);

        if (isOnInvoicePage && !invoiceHelperButtons) {
            // On invoice page but buttons don't exist - create them
            createInvoiceButtons();
        } else if (!isOnInvoicePage && invoiceHelperButtons) {
            // Not on invoice page but buttons exist - remove them
            removeInvoiceButtons();
        }
    }

    function removeInvoiceButtons() {
        if (invoiceHelperButtons) {
            if (invoiceHelperButtons.btnZero && invoiceHelperButtons.btnZero.parentNode) {
                invoiceHelperButtons.btnZero.parentNode.removeChild(invoiceHelperButtons.btnZero);
            }
            if (invoiceHelperButtons.btnLoad && invoiceHelperButtons.btnLoad.parentNode) {
                invoiceHelperButtons.btnLoad.parentNode.removeChild(invoiceHelperButtons.btnLoad);
            }
            invoiceHelperButtons = null;
            console.log('[NxTweaks] Invoice buttons removed');
        }
    }

    function createInvoiceButtons() {
        if (invoiceHelperButtons) return; // Already created

        console.log('[NxTweaks] Creating invoice buttons...');

        // ZERO button
        const btnZero = document.createElement('button');
        btnZero.innerHTML = '🔢 ZERO out invoice';
        btnZero.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 160px;
            z-index: 2147483647;
            padding: 8px 16px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font: bold 13px/1.3 system-ui;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;

        btnZero.addEventListener('click', async () => {
            if (!confirm('Fill all quantity inputs with 0?')) return;
            btnZero.style.opacity = '0.6';
            try {
                await fillAllInputs();
                alert('All inputs filled with 0!');
            } catch (error) {
                alert('Error: ' + error.message);
            } finally {
                btnZero.style.opacity = '1';
            }
        });

        // Load All button
        const btnLoad = document.createElement('button');
        btnLoad.innerHTML = '📦 Load all';
        btnLoad.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 320px;
            z-index: 2147483647;
            padding: 8px 16px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font: bold 13px/1.3 system-ui;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;

        btnLoad.addEventListener('click', async () => {
            btnLoad.style.opacity = '0.6';
            try {
                await performLazyScroll();
            } catch (error) {
                alert('Error: ' + error.message);
            } finally {
                btnLoad.style.opacity = '1';
            }
        });

        document.body.appendChild(btnZero);
        document.body.appendChild(btnLoad);

        invoiceHelperButtons = { btnZero, btnLoad };
        console.log('[NxTweaks] Invoice buttons created');
    }

    async function fillAllInputs() {
        // Find vessel tab
        const vesselTab = Array.from(document.querySelectorAll('label'))
            .find(l => l.textContent.trim().toLowerCase() === 'vessel');
        if (vesselTab) vesselTab.click();

        await sleep(500);

        // Load all products first
        await performLazyScroll();
        await sleep(1000);

        // Fill quantity inputs
        const inputs = document.querySelectorAll("input[id^='quantity_fo']");
        for (const input of inputs) {
            fireEvents(input, '0');
            await sleep(5);
        }

        // Fill total input
        const totalInput = document.querySelector("#enter_total");
        if (totalInput) {
            fireEvents(totalInput, '0');
        }

        // Handle extras tab
        const extrasTab = Array.from(document.querySelectorAll('label'))
            .find(l => l.textContent.trim().toLowerCase() === 'extras');
        if (extrasTab) {
            extrasTab.click();
            await sleep(500);
            const extrasInputs = document.querySelectorAll("input[id^='extra_quantity_fo']");
            for (const input of extrasInputs) {
                fireEvents(input, '0');
                await sleep(5);
            }
        }

        // Return to vessel tab
        if (vesselTab) vesselTab.click();
    }

    async function performLazyScroll() {
        console.log('[NxTweaks] Starting dynamic lazy loading...');

        let lastCount = 0;
        let stableAttempts = 0;

        for (let i = 0; i < 50; i++) {
            const currentElements = document.querySelectorAll("input[id^='quantity_fo']");
            const currentCount = currentElements.length;

            console.log(`[NxTweaks] Attempt ${i + 1}: Found ${currentCount} products`);

            // Smooth scroll to bottom with visible movement
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });

            // Wait for smooth scroll to complete
            await sleep(1000);

            // Also try alternative scrolling methods
            document.documentElement.scrollTop = document.documentElement.scrollHeight;

            // Dispatch scroll events to ensure all listeners are triggered
            const scrollEvent = new Event('scroll', { bubbles: true, cancelable: true });
            window.dispatchEvent(scrollEvent);
            document.dispatchEvent(scrollEvent);

            // Dispatch wheel events as well
            const wheelEvent = new WheelEvent('wheel', {
                bubbles: true,
                cancelable: true,
                deltaY: 100,
                deltaMode: 0
            });
            window.dispatchEvent(wheelEvent);
            document.dispatchEvent(wheelEvent);

            // Wait for API response and any animations
            await sleep(1500);

            // Check if more items loaded
            const newElements = document.querySelectorAll("input[id^='quantity_fo']");
            const newCount = newElements.length;

            if (newCount > lastCount) {
                console.log(`[NxTweaks] ✅ Progress! ${lastCount} → ${newCount} products`);
                lastCount = newCount;
                stableAttempts = 0;
            } else {
                stableAttempts++;
                console.log(`[NxTweaks] No change (${stableAttempts}/2) - may be complete`);

                // Stop after 2 attempts with no new items
                if (stableAttempts >= 2) {
                    console.log(`[NxTweaks] 🎉 Complete! Loaded all ${newCount} products`);
                    break;
                }
            }
        }

        // Scroll back to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log('[NxTweaks] Done - scrolled back to top');
    }

    function fireEvents(input, value) {
        input.focus();
        input.value = value;
        const events = ['focus', 'keydown', 'input', 'keyup', 'change', 'blur'];
        events.forEach(type => {
            const evt = type === 'input' ? new InputEvent(type, { bubbles: true, cancelable: true })
                : type.startsWith('key') ? new KeyboardEvent(type, { key: value, bubbles: true, cancelable: true })
                : new Event(type, { bubbles: true, cancelable: true });
            input.dispatchEvent(evt);
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Helper: Monitor URL changes and call callback when pattern matches
    function monitorUrlPattern(pattern, callback, intervals = [500, 2000]) {
        let lastUrl = location.href;
        const check = () => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) lastUrl = currentUrl;
            callback(pattern.test(currentUrl));
        };
        intervals.forEach(delay => setTimeout(check, delay));
        setInterval(check, 3000);
    }

    // FEATURE 3: Account Text Highlighting (Gray-alertbar account manager name)
    function initAccountTextHighlighting() {
        if (!CONFIG.FEATURES.accountTextHighlighting) return;

        console.log('[NxTweaks] Account text highlighting initializing...');

        // Multiple checks at different intervals to catch dynamic content
        setTimeout(() => highlightAccountText(), 1000);  // Early check
        setTimeout(() => highlightAccountText(), 3000);  // Mid check
        setTimeout(() => highlightAccountText(), 6000);  // Late check

        // Then periodic checks every 5 seconds
        setInterval(highlightAccountText, 5000);

        // Check on URL changes (SPA navigation)
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(highlightAccountText, 1000); // Check after navigation
            }
        }, 1000);
    }

    function highlightAccountText() {
        const PREFIX = 'You are viewing as Bar Account Manager for ';
        const alertBars = document.querySelectorAll('.gray-alertbar');

        for (const bar of alertBars) {
            if (bar.getAttribute('data-conservative-ubies-styled') === '1') {
                continue; // Already processed
            }

            // Find text node containing the prefix
            const walker = document.createTreeWalker(
                bar,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        return node.nodeValue && node.nodeValue.indexOf(PREFIX) !== -1
                            ? NodeFilter.FILTER_ACCEPT
                            : NodeFilter.FILTER_REJECT;
                    }
                },
                false
            );

            const textNode = walker.nextNode();
            if (!textNode) continue;

            const text = textNode.nodeValue;
            const start = text.indexOf(PREFIX);
            if (start === -1) continue;

            const afterPrefixOffset = start + PREFIX.length;
            const accountAndRest = textNode.splitText(afterPrefixOffset);

            if (!/\s$/.test(textNode.nodeValue)) {
                textNode.nodeValue += ' ';
            }

            let accountText = accountAndRest.nodeValue;
            const match = accountText.match(/^(.*?)(\.\s*)?$/);
            let accountCore = match ? match[1] : accountText;

            accountAndRest.splitText(accountCore.length);

            const span = document.createElement('span');
            span.className = 'conservative-ubies-account-name';
            span.textContent = accountAndRest.nodeValue.trim();

            accountAndRest.parentNode.replaceChild(span, accountAndRest);

            // Ensure proper spacing
            const next = span.nextSibling;
            if (!(next && next.nodeType === Node.TEXT_NODE && /^\s/.test(next.nodeValue))) {
                const backLink = bar.querySelector('a');
                span.parentNode.insertBefore(document.createTextNode(' '), next || backLink);
            }

            // Enhance the "Back to Dashboard" link
            enhanceBackToDashboardLink(bar);

            bar.setAttribute('data-conservative-ubies-styled', '1');
            console.log('[NxTweaks] Account name highlighted in gray-alertbar');
        }
    }

    function enhanceBackToDashboardLink(alertBar) {
        // Remove body class for margin compensation since topbar is no longer sticky
        document.body.classList.remove('has-sticky-topbar');

        // Find and enhance the "Back To Dashboard" link
        const dashboardLink = alertBar.querySelector('a');
        if (dashboardLink && !dashboardLink.getAttribute('data-conservative-ubies-enhanced')) {
            // Set the href if it's not already set
            if (!dashboardLink.href || dashboardLink.href === '') {
                dashboardLink.href = 'https://app.bar-i.com/barI/manager/dashboard';
            }

            // Add click tracking
            dashboardLink.addEventListener('click', function(e) {
                console.log('[NxTweaks] Back To Dashboard clicked');
                // The link will navigate naturally, no need to prevent default
            });

            // Mark as enhanced to avoid duplicate processing
            dashboardLink.setAttribute('data-conservative-ubies-enhanced', '1');
            console.log('[NxTweaks] Back to Dashboard link enhanced');
        }
    }

    // FEATURE 4: Step Highlighting (Conservative approach)
    function initStepHighlighting() {
        if (!CONFIG.FEATURES.stepHighlighting) return;

        console.log('[NxTweaks] Step highlighting initializing...');

        // Multiple checks at different intervals to catch dynamic content
        setTimeout(() => highlightStepCells(), 1000);  // Early check
        setTimeout(() => highlightStepCells(), 3000);  // Mid check
        setTimeout(() => highlightStepCells(), 6000);  // Late check

        // Then periodic checks every 5 seconds (more frequent than before)
        setInterval(highlightStepCells, 5000);

        // Also check when user scrolls (content might load during scroll)
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(highlightStepCells, 500);
        });

        // Check on URL changes (SPA navigation)
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(highlightStepCells, 1000); // Check after navigation
            }
        }, 1000);
    }

    function highlightStepCells() {
        const cells = document.querySelectorAll('td');
        for (const cell of cells) {
            const text = (cell.textContent || '').trim();

            if (text === 'Step 1 Invoices' && !cell.classList.contains('conservative-ubies-step1-invoices')) {
                cell.classList.add('conservative-ubies-step1-invoices');
            }
            if (text === 'Step 2 Count' && !cell.classList.contains('conservative-ubies-step2-count')) {
                cell.classList.add('conservative-ubies-step2-count');
            }
            if (text === 'Step 3 Sales' && !cell.classList.contains('conservative-ubies-step3-sales')) {
                cell.classList.add('conservative-ubies-step3-sales');
            }
            if (text === 'Step 4 Communication' && !cell.classList.contains('conservative-ubies-step4-communication')) {
                cell.classList.add('conservative-ubies-step4-communication');
            }
            if (text === 'Step 5 Variance Report' && !cell.classList.contains('conservative-ubies-step5-variance')) {
                cell.classList.add('conservative-ubies-step5-variance');
            }
            if (text === 'Step 2,3,4 Done' && !cell.classList.contains('conservative-ubies-step234-done')) {
                cell.classList.add('conservative-ubies-step234-done');
            }
        }
    }

    // FEATURE 5: Quick Filters (Dashboard only, conservative approach)
    function initQuickFilters() {
        if (!CONFIG.FEATURES.quickFilters) return;

        // Only run on dashboard (improved pattern matching)
        if (!/^https?:\/\/app\.bar-i\.com\/barI\/manager\/dashboard(\/|$)/i.test(location.href)) return;

        console.log('[NxTweaks] Quick filters initializing...');

        // Add stealth modal styling to prevent flash
        addStealthModalStyling();

        // Try multiple times with different delays
        setTimeout(() => tryCreateQuickFilters(), 1000);
        setTimeout(() => tryCreateQuickFilters(), 3000);
        setTimeout(() => tryCreateQuickFilters(), 5000);

    }

    function addStealthModalStyling() {
        if (document.getElementById('conservative_ubies_stealth_css')) return;

        const stealthStyle = document.createElement('style');
        stealthStyle.id = 'conservative_ubies_stealth_css';
        stealthStyle.textContent = `
            app-filter-modal .modal.conservative-ubies-stealth {
                opacity: 0 !important;
                pointer-events: none !important;
                position: fixed !important;
                top: -9999px !important;
                left: -9999px !important;
            }
        `;
        document.head.appendChild(stealthStyle);
    }

    function enableStealthModal() {
        const modal = document.querySelector('app-filter-modal .modal');
        if (modal) {
            modal.classList.add('conservative-ubies-stealth');
        }
    }

    function disableStealthModal() {
        const modal = document.querySelector('app-filter-modal .modal');
        if (modal) {
            modal.classList.remove('conservative-ubies-stealth');
        }
    }

    function tryCreateQuickFilters() {
        if (quickFiltersToolbar || document.querySelector('#conservative_ubies_qf_toolbar')) return;
        if (isNotificationsOn()) {
            createQuickFiltersToolbar();
        }
    }

    function isNotificationsOn() {
        const notifToggles = document.querySelectorAll('.top-toggel-btn span');
        for (const span of notifToggles) {
            if (span.textContent.trim() === 'Notifications' && span.classList.contains('color-green')) {
                return true;
            }
        }
        return false;
    }

    function createQuickFiltersToolbar() {
        if (quickFiltersToolbar || document.querySelector('#conservative_ubies_qf_toolbar')) return;

        // Find table and insertion point
        const table = document.querySelector('table.table') || document.querySelector('table');
        if (!table) return;

        const tableResponsive = table.closest('.table-responsive');
        const insertionTarget = tableResponsive || table;
        const insertionParent = insertionTarget.parentNode;
        if (!insertionParent) return;

        const container = document.createElement('div');
        container.id = 'conservative_ubies_qf_toolbar';
        container.style.cssText = 'margin:0 0 -20px 0;padding:1px;background:#fff;font-size:12px;border-radius:6px;';
        container.innerHTML = `
            <button id="conservative_ubies_qf_btn_1" class="qf-filter-btn" data-value="1">Step 1 Invoice</button>
            <button id="conservative_ubies_qf_btn_2" class="qf-filter-btn" data-value="2">Step 2 Count</button>
            <button id="conservative_ubies_qf_btn_5" class="qf-filter-btn" data-value="5">Step 2,3,4 Done</button>
            <button id="conservative_ubies_qf_btn_6" class="qf-filter-btn" data-value="6">Step 5 Variance</button>
        `;

        insertionParent.insertBefore(container, insertionTarget);
        quickFiltersToolbar = container;

        // Setup event listeners with better error handling
        [1,2,5,6].forEach(val => {
            const button = document.getElementById(`conservative_ubies_qf_btn_${val}`);
            if (button) {
                button.addEventListener('click', async (e) => {
                    if (qfBusy) {
                        console.log(`[NxTweaks] Filter ${val} blocked - operation in progress`);
                        return;
                    }

                    const currentState = qfButtonStates[val];
                    const desired = !currentState; // Toggle state
                    console.log(`[NxTweaks] Filter ${val} toggled to:`, desired);

                    try {
                        qfBusy = true;

                        if (!desired) {
                            // Turning off a filter
                            const othersActive = [1,2,5,6].some(v => v !== val && qfButtonStates[v]);
                            if (!othersActive) {
                                // This is the last filter being turned off - reset all
                                await resetAllFiltersWithModal();
                                // Update all button states
                                [1,2,5,6].forEach(v => {
                                    qfButtonStates[v] = false;
                                    updateQFButtonAppearance(v, false);
                                });
                            } else {
                                // Other filters still active - just turn this one off
                                await applyFilterWithModal(val, false);
                                qfButtonStates[val] = false;
                                updateQFButtonAppearance(val, false);
                            }
                        } else {
                            // Turning on a filter
                            await applyFilterWithModal(val, true);
                            qfButtonStates[val] = true;
                            updateQFButtonAppearance(val, true);
                        }

                        console.log(`[NxTweaks] Filter ${val} operation completed successfully`);
                    } catch (err) {
                        console.error('[NxTweaks] Quick filter error:', err);
                        alert(`Filter operation failed: ${err.message}`);
                    } finally {
                        qfBusy = false;
                    }
                });
            }
        });

        console.log('[NxTweaks] Quick filters toolbar created successfully');
    }

    function removeQuickFiltersIfExists() {
        const existingToolbar = document.querySelector('#conservative_ubies_qf_toolbar');
        if (existingToolbar) {
            existingToolbar.remove();
            quickFiltersToolbar = null;
            qfButtonStates = { 1: false, 2: false, 5: false, 6: false };
            console.log('[NxTweaks] Quick filters toolbar removed - notifications are off');
        }
    }


    function updateQFButtonAppearance(val, isActive) {
        const button = document.getElementById(`conservative_ubies_qf_btn_${val}`);
        if (button) {
            button.classList.toggle('active', isActive);
        }
    }

    function addLogoToTop() {
        // Check if logo already exists
        if (document.querySelector('#conservative_ubies_top_logo')) {
            return;
        }

        // Only add logo on the manager dashboard
        if (!/^https?:\/\/app\.bar-i\.com\/barI\/manager\/dashboard(\/|$)/i.test(location.href)) {
            console.log('[NxTweaks] Not on manager dashboard - logo will not be added');
            return;
        }

        console.log('[NxTweaks] Adding logo to top of page...');

        // Create the logo element
        const logoDiv = document.createElement('div');
        logoDiv.id = 'conservative_ubies_top_logo';
        logoDiv.className = 'logo-area cursor-pointer';
        logoDiv.innerHTML = '<img alt="" src="assets/images/logo2.svg">';

        // Style it to be centered at the top
        logoDiv.style.cssText = `
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9998;
            background: white;
            padding: 8px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            cursor: pointer;
        `;

        // Style the image
        const img = logoDiv.querySelector('img');
        if (img) {
            img.style.cssText = `
                height: 32px;
                width: auto;
                display: block;
            `;
        }

        // Add click handler to navigate to dashboard
        logoDiv.addEventListener('click', () => {
            if (window.location.href.includes('/barI/manager/dashboard')) {
                // Already on dashboard, just reload
                window.location.reload();
            } else {
                // Navigate to dashboard
                window.location.href = '/barI/manager/dashboard';
            }
        });

        // Add to page
        document.body.appendChild(logoDiv);

        console.log('[NxTweaks] Logo added to top of page');
    }

    async function openFilterModal() {
        const filterBtn = document.querySelector('.icon-filter.filter-btn');
        if (!filterBtn) return null;

        enableStealthModal();
        filterBtn.click();
        await sleep(800);

        // Wait for modal
        for (let i = 0; i < 10; i++) {
            const modal = document.querySelector('app-filter-modal .modal');
            if (modal) return modal;
            await sleep(200);
        }

        disableStealthModal();
        return null;
    }

    async function applyFilterWithModal(targetValue, targetChecked) {
        const modal = await openFilterModal();
        if (!modal) return;

        // Toggle specific checkbox
        const checkbox = document.querySelector(`input[formcontrolname="notify_type_li"][value="${targetValue}"]`);
        if (checkbox && checkbox.checked !== targetChecked) {
            checkbox.click();
            await sleep(300);
        }

        // Apply changes
        const applyBtn = document.querySelector('.notify-flt-button-area button:last-child');
        if (applyBtn && !applyBtn.disabled) {
            applyBtn.click();
            await sleep(1500);
        } else if (applyBtn?.disabled) {
            document.querySelector('.modal-backdrop')?.click();
        }

        disableStealthModal();

        // Trigger step highlighting
        [100, 500, 1000].forEach(delay => setTimeout(highlightStepCells, delay));
    }

    async function resetAllFiltersWithModal() {
        const modal = await openFilterModal();
        if (!modal) return;

        // Click reset button
        const resetBtn = document.querySelector('.notify-flt-button-area button:first-child');
        if (resetBtn) {
            resetBtn.click();
            await sleep(300);
        }

        // Apply changes
        const applyBtn = document.querySelector('.notify-flt-button-area button:last-child');
        if (applyBtn && !applyBtn.disabled) {
            applyBtn.click();
            await sleep(1500);
        }

        disableStealthModal();

        // Reset UI
        [1,2,5,6].forEach(val => {
            qfButtonStates[val] = false;
            updateQFButtonAppearance(val, false);
        });

        // Trigger step highlighting
        [100, 500, 1000].forEach(delay => setTimeout(highlightStepCells, delay));
    }

    // FEATURE 6: Table Sort Enhancer (Improved - SPA-safe, hidden-column aware)
    function initTableSortEnhancer() {
        if (!CONFIG.FEATURES.tableSortEnhancer) return;
        console.log('[NxTweaks] Table sort enhancer initializing...');
        monitorUrlPattern(/\/accountability-analysis\/?/i, isMatch => {
            isMatch ? createTableSortButton() : removeTableSortButton();
        });
    }

    async function waitForAccountabilityTable(timeoutMs = 15000) {
        const t0 = performance.now();
        while (performance.now() - t0 < timeoutMs) {
            // Look for table within app-sub-category-wise-analysis component
            const component = document.querySelector('app-sub-category-wise-analysis');
            if (component) {
                const table = component.querySelector('table.table.less-spacing-with-color');
                if (table && table.tBodies && table.tBodies[0]) {
                    console.log('[NxTweaks] Found accountability table');
                    return table;
                }
            }

            // Fallback: look for any table with the specific classes
            const table = document.querySelector('table.table.less-spacing-with-color.horizontal-stripes');
            if (table && table.tBodies && table.tBodies[0]) {
                console.log('[NxTweaks] Found accountability table (fallback)');
                return table;
            }

            await new Promise(r => setTimeout(r, 200));
        }
        console.log('[NxTweaks] No accountability table found after timeout');
        return null;
    }

    function createTableSortButton() {
        const buttonId = 'conservative_ubies_table_sort_btn';
        document.getElementById(buttonId)?.remove();

        const btn = document.createElement('button');
        btn.id = buttonId;
        btn.textContent = 'Enable Table Sort';
        btn.style.cssText = 'position:fixed;bottom:20px;left:20px;z-index:2147483647;padding:8px 12px;background:#28a745;color:#fff;border:2px solid #fff;border-radius:8px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3);font:bold 14px/1.2 system-ui,sans-serif;min-width:120px;text-align:center';

        btn.addEventListener('click', async () => {
            if (!tableSortActive) {
                btn.textContent = 'Sort Enabled';
                btn.style.background = '#218838';
                await initTableSort();
                tableSortActive = true;
            } else {
                btn.textContent = 'Sort Disabled';
                btn.style.background = '#6c757d';
                disableTableSort();
                tableSortActive = false;
            }
        });

        document.body.appendChild(btn);
        tableSortEnhancerButton = btn;
    }

    function removeTableSortButton() {
        if (document.getElementById('conservative_ubies_table_sort_btn')?.remove()) {
            tableSortEnhancerButton = null;
            tableSortActive = false;
        }
    }

    async function initTableSort() {
        const table = await waitForAccountabilityTable();
        if (!table) {
            console.log('[NxTweaks] No accountability table found for sorting');
            return;
        }

        bindTableHeaders(table);
        console.log('[NxTweaks] Table sort initialized for accountability table');
    }

    function bindTableHeaders(table) {
        // Store current table reference
        window.conservativeUBIESCurrentTable = table;

        const headers = table.querySelectorAll('th');
        const headerMap = createHeaderMap(table);

        headers.forEach((th, headerIndex) => {
            if (th._conservativeUBIESSortListener) return; // Already bound

            th.style.cursor = 'pointer';
            th.style.userSelect = 'none';

            const handler = (event) => {
                const columnIndex = headerMap.get(th);
                if (columnIndex !== undefined) {
                    sortTable(table, columnIndex, event.shiftKey);
                    updateHeaderIndicators(table, headerMap);
                }
            };

            th.addEventListener('click', handler);
            th._conservativeUBIESSortListener = handler;
        });

        // Find and sort by Missing Servings/Units column
        let missingServeUnitsIndex = -1;
        headers.forEach((header, index) => {
            const text = header.textContent.trim();
            if (text.includes('Missing Servings/Units')) {
                missingServeUnitsIndex = headerMap.get(header);
            }
        });

        if (missingServeUnitsIndex !== -1) {
            console.log('[NxTweaks] Auto-sorting by Missing Servings/Units at column:', missingServeUnitsIndex);
            sortTable(table, missingServeUnitsIndex, false); // Sort by Missing Servings/Units column
            updateHeaderIndicators(table, headerMap);
        } else {
            console.log('[NxTweaks] Missing Servings/Units column not found for auto-sort');
        }
    }

    function createHeaderMap(table) {
        const map = new Map();
        const headers = table.querySelectorAll('th');
        let visibleIndex = 0;

        headers.forEach(th => {
            const isVisible = th.offsetWidth > 0 && th.offsetHeight > 0 &&
                             getComputedStyle(th).visibility !== 'hidden';
            if (isVisible) {
                map.set(th, visibleIndex);
                visibleIndex++;
            }
        });

        return map;
    }

    function sortTable(table, columnIndex, bySecond = false) {
        const tbody = table.tBodies[0];
        if (!tbody) return;

        const rows = Array.from(tbody.rows);
        const ascending = !table._conservativeUBIESLastAscending ||
                         table._conservativeUBIESLastColumn !== columnIndex;

        table._conservativeUBIESLastAscending = ascending;
        table._conservativeUBIESLastColumn = columnIndex;
        table._conservativeUBIESBySecond = bySecond;

        rows.sort((rowA, rowB) => {
            const cellA = rowA.cells[columnIndex];
            const cellB = rowB.cells[columnIndex];

            if (!cellA || !cellB) return 0;

            // Get text from span or cell
            const textA = (cellA.querySelector('span') || cellA).textContent.trim();
            const textB = (cellB.querySelector('span') || cellB).textContent.trim();

            // Parse numbers, handling fractions (9.46/0.07) and percentages
            const cleanNum = str => {
                if (str.includes('/')) {
                    const parts = str.split('/');
                    str = parts[bySecond ? 1 : 0] || '0';
                }
                return parseFloat(str.replace(/^[\*\$\s]+/, '').replace(/[\s%]+$/, '')) || 0;
            };
            
            const numA = cleanNum(textA);
            const numB = cleanNum(textB);

            return ascending ? numA - numB : numB - numA;
        });

        // Update DOM
        const fragment = document.createDocumentFragment();
        rows.forEach(row => fragment.appendChild(row));
        tbody.appendChild(fragment);
    }

    function updateHeaderIndicators(table, headerMap) {
        const headers = table.querySelectorAll('th');

        headers.forEach(th => {
            // Clear existing indicators
            th.textContent = th.textContent.replace(/[\u25B2\u25BC][SU]?/g, '').trim();
            th.style.backgroundColor = '';
        });

        // Add indicator to sorted column
        const sortedColumnIndex = table._conservativeUBIESLastColumn;
        if (sortedColumnIndex !== undefined) {
            for (const [th, index] of headerMap) {
                if (index === sortedColumnIndex) {
                    const arrow = table._conservativeUBIESLastAscending ? ' ▲' : ' ▼';
                    const mode = table._conservativeUBIESBySecond ? 'U' : 'S';
                    th.textContent += arrow + mode;
                    th.style.backgroundColor = '#ff000061';
                    break;
                }
            }
        }
    }

    function disableTableSort() {
        const table = window.conservativeUBIESCurrentTable;
        if (table) {
            unbindTableHeaders(table);
        }

        // Also try to find current accountability table
        const component = document.querySelector('app-sub-category-wise-analysis');
        if (component) {
            const currentTable = component.querySelector('table.table.less-spacing-with-color');
            if (currentTable) {
                unbindTableHeaders(currentTable);
            }
        }

        window.conservativeUBIESCurrentTable = null;
        console.log('[NxTweaks] Table sort disabled');
    }

    function unbindTableHeaders(table) {
        const headers = table.querySelectorAll('th');
        headers.forEach(th => {
            if (th._conservativeUBIESSortListener) {
                th.removeEventListener('click', th._conservativeUBIESSortListener);
                th._conservativeUBIESSortListener = null;
                th.style.cursor = '';
                th.style.backgroundColor = '';
                // Clear sort indicators
                th.textContent = th.textContent.replace(/[\u25B2\u25BC][SU]?/g, '').trim();
            }
        });
    }

    // FEATURE 7: Click-to-Copy Table Cells/Rows
    function initClickToCopy() {
        if (!CONFIG.FEATURES.clickToCopy) return;
        if (!CONFIG.CLICK_TO_COPY_TABLES || CONFIG.CLICK_TO_COPY_TABLES.length === 0) return;

        console.log('[NxTweaks] Click-to-copy initializing...');

        // Check for tables periodically
        setTimeout(() => setupAllClickToCopyTables(), 1000);
        setTimeout(() => setupAllClickToCopyTables(), 3000);
        setTimeout(() => setupAllClickToCopyTables(), 5000);

        // Monitor for new tables every 3 seconds
        setInterval(setupAllClickToCopyTables, 3000);
    }

    function setupAllClickToCopyTables() {
        CONFIG.CLICK_TO_COPY_TABLES.forEach(config => {
            setupClickToCopyTable(config);
        });
    }

    function setupClickToCopyTable(config) {
        const { elementSelector, clickColumnIndex, copyMode } = config;
        const element = document.querySelector(elementSelector);
        if (!element) return;

        // Helper to add click-to-copy to a cell
        const setupCell = (cell, getCells) => {
            cell.style.cssText = 'cursor:pointer;position:relative';
            
            cell.addEventListener('mouseenter', () => cell.style.backgroundColor = '#e3f2fd');
            cell.addEventListener('mouseleave', () => cell.style.backgroundColor = '');
            cell.addEventListener('click', () => {
                const text = copyMode === 0 
                    ? extractCellText(cell)
                    : getCells().map(c => extractCellText(c)).join('\t');
                copyToClipboard(text, cell);
            });
        };

        // Handle traditional HTML tables
        element.querySelectorAll('table').forEach(table => {
            if (table._conservativeUBIESClickToCopyEnabled) return;
            
            const tbody = table.querySelector('tbody');
            if (!tbody) return;

            tbody.querySelectorAll('tr').forEach(row => {
                const cell = row.cells[clickColumnIndex];
                if (cell) setupCell(cell, () => Array.from(row.cells));
            });

            table._conservativeUBIESClickToCopyEnabled = true;
        });

        // Handle custom div-based tables
        const customBody = element.querySelector('.custom-table-body');
        if (customBody && !customBody._conservativeUBIESClickToCopyEnabled) {
            const rows = customBody.querySelectorAll('.table-row');
            if (rows.length === 0) return;

            rows.forEach(row => {
                const columns = Array.from(row.querySelectorAll('.table-col'));
                const cell = columns[clickColumnIndex];
                if (cell) setupCell(cell, () => columns);
            });

            customBody._conservativeUBIESClickToCopyEnabled = true;
        }
    }

    function extractCellText(cell) {
        // Try to get text from textarea first (for editable cells)
        const textarea = cell.querySelector('textarea');
        if (textarea) {
            return textarea.value.trim();
        }

        // Try to get text from input fields
        const input = cell.querySelector('input');
        if (input) {
            return input.value.trim();
        }

        // Try to get text from spans with tooltips
        const tooltipSpan = cell.querySelector('.tooltip-outer');
        if (tooltipSpan) {
            return tooltipSpan.textContent.trim();
        }

        // Otherwise get all text content
        return cell.textContent.trim();
    }

    function copyToClipboard(text, targetElement) {
        // Try GM_setClipboard first (most reliable for userscripts)
        if (typeof GM_setClipboard !== 'undefined') {
            try {
                GM_setClipboard(text);
                showCopyFeedback(targetElement, true);
                return;
            } catch (err) {
                console.error('[NxTweaks] Copy failed:', err);
            }
        }

        // Fallback: Try execCommand, then modern Clipboard API
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.cssText = 'position:fixed;top:0;left:0;width:2em;height:2em;padding:0;border:none;outline:none;box-shadow:none;background:transparent;opacity:0;z-index:-1';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            showCopyFeedback(targetElement, success);
        } catch (err) {
            document.body.removeChild(textarea);
            // Last resort: modern Clipboard API
            if (navigator.clipboard?.writeText) {
                navigator.clipboard.writeText(text)
                    .then(() => showCopyFeedback(targetElement, true))
                    .catch(() => showCopyFeedback(targetElement, false));
            } else {
                showCopyFeedback(targetElement, false);
            }
        }
    }

    function showCopyFeedback(element, success) {
        const feedback = document.createElement('div');
        feedback.className = 'conservative-ubies-copy-feedback';
        feedback.textContent = success ? '✓ Copied!' : '✗ Failed';
        feedback.style.background = success ? '#4caf50' : '#f44336';
        
        element.style.position = 'relative';
        element.appendChild(feedback);
        
        setTimeout(() => feedback.remove(), 1000);
    }

    // FEATURE 8: Communication Table Vessel Sort (Accountability Analysis page only)
    function initCommTableVesselSort() {
        if (!CONFIG.FEATURES.commTableVesselSort) return;
        console.log('[NxTweaks] Communication table vessel sort initializing...');
        monitorUrlPattern(/\/accountability-analysis\/?/i, isMatch => {
            if (isMatch) setupCommTableVesselSort();
        }, [500, 1500, 3000]);
    }

    function setupCommTableVesselSort() {
        // Find the communication table
        const commComponent = document.querySelector('app-communication-detials');
        if (!commComponent) {
            return;
        }

        const table = commComponent.querySelector('table.comm-table-main-table');
        if (!table) {
            return;
        }

        // Check if already set up
        if (table._conservativeUBIESCommSortEnabled) {
            return;
        }

        // Find the Vessel header (3rd column)
        const headers = table.querySelectorAll('thead th');
        let vesselHeader = null;

        headers.forEach(th => {
            const text = th.textContent.trim();
            if (text === 'Vessel') {
                vesselHeader = th;
            }
        });

        if (!vesselHeader) {
            console.log('[NxTweaks] Vessel header not found in communication table');
            return;
        }

        // Make header clickable
        vesselHeader.style.cursor = 'pointer';
        vesselHeader.style.userSelect = 'none';

        // Track sort state
        let ascending = true;

        // Add click handler
        vesselHeader.addEventListener('click', () => {
            sortCommTableByVessel(table, ascending);
            ascending = !ascending;

            // Update header indicator
            const arrow = ascending ? ' ▼' : ' ▲';
            vesselHeader.textContent = vesselHeader.textContent.replace(/[\u25B2\u25BC]/g, '').trim() + arrow;
        });

        // Mark as set up
        table._conservativeUBIESCommSortEnabled = true;

        // Add initial indicator
        vesselHeader.textContent += ' ▼';

        console.log('[NxTweaks] Communication table vessel sort enabled');
    }

    function sortCommTableByVessel(table, ascending) {
        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.sort((rowA, rowB) => {
            // Get vessel textarea values (3rd column, index 2)
            const cellA = rowA.cells[2];
            const cellB = rowB.cells[2];

            if (!cellA || !cellB) return 0;

            // Get textarea content
            const textareaA = cellA.querySelector('textarea');
            const textareaB = cellB.querySelector('textarea');

            const textA = textareaA ? textareaA.value.trim().toUpperCase() : '';
            const textB = textareaB ? textareaB.value.trim().toUpperCase() : '';

            // Compare alphabetically
            if (textA < textB) return ascending ? -1 : 1;
            if (textA > textB) return ascending ? 1 : -1;
            return 0;
        });

        // Update DOM
        const fragment = document.createDocumentFragment();
        rows.forEach(row => fragment.appendChild(row));
        tbody.appendChild(fragment);

        console.log('[NxTweaks] Communication table sorted by vessel:', ascending ? 'ascending' : 'descending');
    }

    // FEATURE 9: Table Collection (Auto-load all pages and add copy button)
    function initTableCollection() {
        if (!CONFIG.FEATURES.tableCollection) return;

        console.log('[NxTweaks] Table collection initializing...');

        // Check for accountability analysis page periodically
        setTimeout(() => checkAccountabilityAnalysisPage(), 1000);
        setTimeout(() => checkAccountabilityAnalysisPage(), 3000);
        setTimeout(() => checkAccountabilityAnalysisPage(), 5000);

        // Monitor URL changes
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(checkAccountabilityAnalysisPage, 1000);
            }
        }, 1000);

        // Periodic check
        setInterval(checkAccountabilityAnalysisPage, 5000);
    }

    function checkAccountabilityAnalysisPage() {
        const isAccountabilityPage = /\/accountability-analysis\//i.test(location.href);
        const element = document.querySelector('app-sub-category-wise-analysis');
        const existingButton = document.getElementById('conservative_ubies_table_collection_btn');
        const existingCopyButton = document.getElementById('conservative_ubies_copy_subcategory_btn');

        if (isAccountabilityPage && element) {
            if (!existingButton) {
                createTableCollectionButton();
            }
            if (!existingCopyButton) {
                createSubCategoryCopyButton();
            }
        } else {
            if (existingButton) existingButton.remove();
            if (existingCopyButton) existingCopyButton.remove();
        }
    }

    function createTableCollectionButton() {
        const btn = document.createElement('button');
        btn.id = 'conservative_ubies_table_collection_btn';
        btn.textContent = '📄 Load All Pages';

        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            left: '165px',
            zIndex: '2147483647',
            padding: '8px 16px',
            backgroundColor: '#17a2b8',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            font: 'bold 14px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
            minWidth: '140px',
            textAlign: 'center'
        });

        btn.addEventListener('click', async () => {
            btn.textContent = '⏳ Loading...';
            btn.disabled = true;

            try {
                await loadAllTablePages();
                btn.textContent = '✓ All Loaded!';
                btn.style.backgroundColor = '#28a745';
                setTimeout(() => {
                    btn.textContent = '📄 Load All Pages';
                    btn.style.backgroundColor = '#17a2b8';
                    btn.disabled = false;
                }, 3000);
            } catch (error) {
                console.error('[NxTweaks] Load all pages failed:', error);
                btn.textContent = '✗ Failed';
                btn.style.backgroundColor = '#dc3545';
                setTimeout(() => {
                    btn.textContent = '📄 Load All Pages';
                    btn.style.backgroundColor = '#17a2b8';
                    btn.disabled = false;
                }, 3000);
            }
        });

        document.body.appendChild(btn);
        console.log('[NxTweaks] Table collection button created');
    }

    function createSubCategoryCopyButton() {
        const btn = document.createElement('button');
        btn.id = 'conservative_ubies_copy_subcategory_btn';
        btn.textContent = '📋 Copy Table';

        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            left: '322px',
            zIndex: '2147483647',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            font: 'bold 14px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
            minWidth: '140px',
            textAlign: 'center'
        });

        btn.addEventListener('click', async () => {
            btn.textContent = '⏳ Copying...';
            btn.disabled = true;

            try {
                await copySubCategoryTable();
                btn.textContent = '✓ Copied!';
                btn.style.backgroundColor = '#28a745';
                setTimeout(() => {
                    btn.textContent = '📋 Copy Table';
                    btn.style.backgroundColor = '#007bff';
                    btn.disabled = false;
                }, 2000);
            } catch (error) {
                console.error('[NxTweaks] Copy failed:', error);
                btn.textContent = '✗ Failed';
                btn.style.backgroundColor = '#dc3545';
                setTimeout(() => {
                    btn.textContent = '📋 Copy Table';
                    btn.style.backgroundColor = '#007bff';
                    btn.disabled = false;
                }, 2000);
            }
        });

        document.body.appendChild(btn);
        console.log('[NxTweaks] Sub-category copy button created');
    }

    async function loadAllTablePages() {
        console.log('[NxTweaks] Starting to load all table pages...');

        const element = document.querySelector('app-sub-category-wise-analysis');
        if (!element) {
            throw new Error('Sub-category element not found');
        }

        // Create progress indicator
        const progressIndicator = document.createElement('div');
        progressIndicator.id = 'conservative_ubies_page_indicator';
        progressIndicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            font: bold 16px/1.5 system-ui;
            z-index: 2147483647;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            text-align: center;
        `;
        progressIndicator.textContent = 'Loading Page 1...';
        document.body.appendChild(progressIndicator);

        const rowMap = new Map(); // Use Map to track unique rows by their unique key
        let headers = null;
        let pageCount = 0;
        const maxPages = 50; // Safety limit
        let totalRowsProcessed = 0;

        // Collect data from current page first
        const table = element.querySelector('table');
        if (table) {
            // Extract headers
            const thead = table.querySelector('thead');
            if (thead) {
                const headerRow = thead.querySelector('tr');
                if (headerRow) {
                    headers = Array.from(headerRow.querySelectorAll('th')).map(th => th.textContent.trim());
                    console.log('[NxTweaks] Headers:', headers);
                }
            }

            // Extract current page rows
            const tbody = table.querySelector('tbody');
            if (tbody) {
                const currentRows = tbody.querySelectorAll('tr');
                console.log(`[NxTweaks] Page 1 DOM has ${currentRows.length} rows`);
                currentRows.forEach(row => {
                    const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim());
                    if (cells.length > 2) {
                        totalRowsProcessed++;
                        // Use columns 2 + 3 (Product) as unique key (index 1 and 2 in 0-based array)
                        const rowKey = cells.slice(1, 3).join('|');
                        if (!rowMap.has(rowKey)) {
                            rowMap.set(rowKey, cells);
                            console.log(`[NxTweaks] Page 1 - Added new row with key: ${rowKey.substring(0, 50)}...`);
                        } else {
                            console.log(`[NxTweaks] Page 1 - Skipped duplicate row with key: ${rowKey.substring(0, 50)}...`);
                        }
                    }
                });
            }
        }

        console.log(`[NxTweaks] Collected page 1: ${rowMap.size} unique rows out of ${totalRowsProcessed} processed`);
        progressIndicator.textContent = `Page 1 collected ✓\n${rowMap.size} rows`;

        // Now load remaining pages
        while (pageCount < maxPages) {
            // Find the next button
            const nextButton = document.querySelector('li.pagination-next.page-item:not(.disabled) a.page-link');

            if (!nextButton) {
                console.log('[NxTweaks] No more pages - finished loading all pages');
                break;
            }

            // Store current first product to detect when new content loads
            const currentTable = element.querySelector('table');
            const currentTbody = currentTable ? currentTable.querySelector('tbody') : null;
            let beforeFirstProduct = '';
            if (currentTbody) {
                const firstRow = currentTbody.querySelector('tr');
                if (firstRow) {
                    const cells = Array.from(firstRow.querySelectorAll('td')).map(td => td.textContent.trim());
                    beforeFirstProduct = cells.slice(1, 3).join('|'); // Col 2 + Col 3
                }
            }
            
            pageCount++;
            console.log(`[NxTweaks] Current first product: ${beforeFirstProduct.substring(0, 50)}...`);
            console.log(`[NxTweaks] Clicking to load page ${pageCount + 1}...`);

            // Update progress indicator
            progressIndicator.textContent = `Loading Page ${pageCount + 1}...`;

            // Click the next button
            nextButton.click();

            // Wait a moment for the click to register
            await sleep(300);

            // Wait for content to change by checking if the table data has actually changed
            let contentChanged = false;
            let waitAttempts = 0;
            const maxWaitAttempts = 30; // 30 attempts * 300ms = 9 seconds max

            while (!contentChanged && waitAttempts < maxWaitAttempts) {
                await sleep(300);
                waitAttempts++;

                const newTable = element.querySelector('table');
                const newTbody = newTable ? newTable.querySelector('tbody') : null;
                let afterFirstProduct = '';
                if (newTbody) {
                    const firstRow = newTbody.querySelector('tr');
                    if (firstRow) {
                        const cells = Array.from(firstRow.querySelectorAll('td')).map(td => td.textContent.trim());
                        afterFirstProduct = cells.slice(1, 3).join('|'); // Col 2 + Col 3
                    }
                }

                // Check if content is different (first product changed)
                if (afterFirstProduct && afterFirstProduct !== beforeFirstProduct) {
                    contentChanged = true;
                    console.log(`[NxTweaks] Page ${pageCount + 1} loaded! New first product: ${afterFirstProduct.substring(0, 50)}... (took ${waitAttempts * 300}ms)`);
                }
            }

            if (!contentChanged) {
                console.log(`[NxTweaks] WARNING: Page ${pageCount + 1} content did NOT change after ${waitAttempts * 300}ms - stopping pagination`);
                break; // Stop trying to load more pages if content isn't changing
            }

            // Additional buffer to ensure everything is rendered
            await sleep(500);

            // Collect data from this page
            const pageTable = element.querySelector('table');
            if (pageTable) {
                const tbody = pageTable.querySelector('tbody');
                if (tbody) {
                    const currentRows = tbody.querySelectorAll('tr');
                    console.log(`[NxTweaks] Page ${pageCount + 1} DOM has ${currentRows.length} rows`);
                    let newRowsOnPage = 0;
                    let skippedRowsOnPage = 0;
                    currentRows.forEach(row => {
                        const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim());
                        if (cells.length > 2) {
                            totalRowsProcessed++;
                            // Use columns 2 + 3 (Product) as unique key (index 1 and 2 in 0-based array)
                            const rowKey = cells.slice(1, 3).join('|');
                            if (!rowMap.has(rowKey)) {
                                rowMap.set(rowKey, cells);
                                newRowsOnPage++;
                                console.log(`[NxTweaks] Page ${pageCount + 1} - Added new row with key: ${rowKey.substring(0, 50)}...`);
                            } else {
                                skippedRowsOnPage++;
                                console.log(`[NxTweaks] Page ${pageCount + 1} - Skipped duplicate row with key: ${rowKey.substring(0, 50)}...`);
                            }
                        }
                    });
                    console.log(`[NxTweaks] Collected page ${pageCount + 1}: ${newRowsOnPage} new unique rows, ${skippedRowsOnPage} duplicates skipped (total unique: ${rowMap.size})`);
                    
                    // Update progress indicator
                    progressIndicator.textContent = `Page ${pageCount + 1} collected ✓\n${rowMap.size} total rows`;
                }
            }
        }

        if (pageCount >= maxPages) {
            console.log('[NxTweaks] Reached maximum page limit');
        }

        // Convert Map to array
        const allRows = Array.from(rowMap.values());

        // Store the collected data
        collectedTableData = {
            headers: headers,
            rows: allRows
        };

        console.log(`[NxTweaks] Finished! Collected ${allRows.length} unique rows across ${pageCount + 1} pages`);

        // Update progress indicator with completion message
        progressIndicator.textContent = `✓ Complete!\n${allRows.length} rows from ${pageCount + 1} pages`;
        progressIndicator.style.background = 'rgba(40, 167, 69, 0.9)';

        // Now replace the table with all collected data
        displayCollectedTableData(element);

        // Remove progress indicator after 2 seconds
        setTimeout(() => {
            if (progressIndicator.parentNode) {
                progressIndicator.parentNode.removeChild(progressIndicator);
            }
        }, 2000);
    }

    function displayCollectedTableData(element) {
        if (!collectedTableData) {
            console.log('[NxTweaks] No collected data to display');
            return;
        }

        const table = element.querySelector('table');
        if (!table) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        console.log('[NxTweaks] Replacing table with all collected rows...');

        // Clear existing rows
        tbody.innerHTML = '';

        // Add all collected rows
        collectedTableData.rows.forEach(rowData => {
            const tr = document.createElement('tr');
            rowData.forEach(cellData => {
                const td = document.createElement('td');
                td.textContent = cellData;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        // Hide pagination since all data is now displayed
        const pagination = document.querySelector('.pagination');
        if (pagination) {
            pagination.style.display = 'none';
        }

        console.log(`[NxTweaks] Displayed ${collectedTableData.rows.length} rows in table`);
    }

    async function copySubCategoryTable() {
        let textToCopy = '';

        // Check if we have collected data from "Load All Pages"
        if (collectedTableData) {
            console.log('[NxTweaks] Using collected data from all pages');

            // Build tab-separated text from collected data
            const rows = [];

            // Add headers
            if (collectedTableData.headers) {
                rows.push(collectedTableData.headers.join('\t'));
            }

            // Add all rows
            collectedTableData.rows.forEach(rowData => {
                rows.push(rowData.join('\t'));
            });

            textToCopy = rows.join('\n');
            console.log(`[NxTweaks] Copying ${collectedTableData.rows.length} rows from collected data`);
        } else {
            // Fallback: copy only current table view
            console.log('[NxTweaks] No collected data - copying current table view only');

            const element = document.querySelector('app-sub-category-wise-analysis');
            if (!element) {
                throw new Error('Sub-category table element not found');
            }

            const table = element.querySelector('table');
            if (!table) {
                throw new Error('Table not found in sub-category element');
            }

            textToCopy = extractTableData(table);

            if (!textToCopy) {
                throw new Error('No table data found');
            }
        }

        // Copy to clipboard
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.opacity = '0';
        textarea.style.zIndex = '-1';

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        const success = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (!success) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                throw new Error('Clipboard operation failed');
            }
        }

        console.log('[NxTweaks] Copied table data:', textToCopy.split('\n').length, 'lines');
    }

    // FEATURE 10: Product Loss Report Copy Button
    function initProductLossReportCopyButton() {
        console.log('[NxTweaks] Product loss report copy button initializing...');

        // Check for the page periodically
        setTimeout(() => checkProductLossReportPage(), 1000);
        setTimeout(() => checkProductLossReportPage(), 3000);
        setTimeout(() => checkProductLossReportPage(), 5000);

        // Monitor URL changes
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(checkProductLossReportPage, 1000);
            }
        }, 1000);

        // Periodic check
        setInterval(checkProductLossReportPage, 5000);
    }

    function checkProductLossReportPage() {
        const element = document.querySelector('app-product-loss-report');
        const existingButton = document.getElementById('conservative_ubies_product_loss_copy_btn');

        if (element && !existingButton) {
            createProductLossCopyButton();
        } else if (!element && existingButton) {
            existingButton.remove();
        }
    }

    function createProductLossCopyButton() {
        const btn = document.createElement('button');
        btn.id = 'conservative_ubies_product_loss_copy_btn';
        btn.textContent = '📋 Copy Table';

        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '2147483647',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            font: 'bold 14px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
            minWidth: '120px',
            textAlign: 'center'
        });

        btn.addEventListener('click', async () => {
            btn.textContent = '⏳ Copying...';
            btn.disabled = true;

            try {
                await copyProductLossTable();
                btn.textContent = '✓ Copied!';
                btn.style.backgroundColor = '#28a745';
                setTimeout(() => {
                    btn.textContent = '📋 Copy Table';
                    btn.style.backgroundColor = '#007bff';
                    btn.disabled = false;
                }, 2000);
            } catch (error) {
                console.error('[NxTweaks] Copy failed:', error);
                btn.textContent = '✗ Failed';
                btn.style.backgroundColor = '#dc3545';
                setTimeout(() => {
                    btn.textContent = '📋 Copy Table';
                    btn.style.backgroundColor = '#007bff';
                    btn.disabled = false;
                }, 2000);
            }
        });

        document.body.appendChild(btn);
        console.log('[NxTweaks] Product loss copy button created');
    }

    async function copyProductLossTable() {
        const element = document.querySelector('app-product-loss-report');
        if (!element) {
            throw new Error('Table element not found');
        }

        // Try to find both traditional table and custom div-based table
        let textToCopy = '';

        // Check for traditional HTML table first
        const htmlTable = element.querySelector('table');
        if (htmlTable) {
            textToCopy = extractTableData(htmlTable);
        } else {
            // Check for custom div-based table
            const customTableBody = element.querySelector('.custom-table-body');
            if (customTableBody) {
                textToCopy = extractCustomTableData(customTableBody);
            }
        }

        if (!textToCopy) {
            throw new Error('No table data found');
        }

        // Copy to clipboard using the reliable method
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.opacity = '0';
        textarea.style.zIndex = '-1';

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        const success = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (!success) {
            // Try modern API as fallback
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                throw new Error('Clipboard operation failed');
            }
        }

        console.log('[NxTweaks] Copied table data:', textToCopy.split('\n').length, 'lines');
    }

    function extractTableData(table) {
        const rows = [];

        // Extract headers
        const thead = table.querySelector('thead');
        if (thead) {
            const headerRow = thead.querySelector('tr');
            if (headerRow) {
                const headers = Array.from(headerRow.querySelectorAll('th')).map(th => th.textContent.trim());
                rows.push(headers.join('\t'));
            }
        }

        // Extract body rows
        const tbody = table.querySelector('tbody');
        if (tbody) {
            const bodyRows = tbody.querySelectorAll('tr');
            bodyRows.forEach(row => {
                const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim());
                rows.push(cells.join('\t'));
            });
        }

        return rows.join('\n');
    }

    function extractCustomTableData(customTableBody) {
        const rows = [];

        // Try to find header in parent element
        const parentElement = customTableBody.closest('app-product-loss-report');
        if (parentElement) {
            const headerRow = parentElement.querySelector('.custom-table-header, .table-header');
            if (headerRow) {
                const headers = Array.from(headerRow.querySelectorAll('.table-col, .header-col')).map(col => col.textContent.trim());
                if (headers.length > 0) {
                    rows.push(headers.join('\t'));
                }
            }
        }

        // Extract body rows
        const bodyRows = customTableBody.querySelectorAll('.table-row');
        bodyRows.forEach(row => {
            const cells = Array.from(row.querySelectorAll('.table-col')).map(col => col.textContent.trim());
            rows.push(cells.join('\t'));
        });

        return rows.join('\n');
    }

    // Global navigation handler for SPA
    function initGlobalNavigation() {
        console.log('[NxTweaks] Global navigation handler initializing...');

        // Check current page with multiple quick attempts
        setTimeout(checkDashboardFeatures, 100);
        setTimeout(checkDashboardFeatures, 500);
        setTimeout(checkDashboardFeatures, 1000);
        setTimeout(checkDashboardFeatures, 3000);

        // URL change detection for SPA navigation
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                const oldUrl = lastUrl;
                lastUrl = location.href;
                console.log('[NxTweaks] Navigation detected:', oldUrl, '->', lastUrl);

                // Quick checks similar to highlighting timing
                setTimeout(checkDashboardFeatures, 100);   // Very fast check
                setTimeout(checkDashboardFeatures, 500);   // Fast check
                setTimeout(checkDashboardFeatures, 1000);  // Standard check
                setTimeout(checkDashboardFeatures, 3000);  // Final check
            }
        }, 1000);

        // Periodic checks to ensure features stay active (more frequent)
        setInterval(checkDashboardFeatures, 5000);
    }

    function checkDashboardFeatures() {
        const isDashboard = /^https?:\/\/app\.bar-i\.com\/barI\/manager\/dashboard(\/|$)/i.test(location.href);

        if (isDashboard) {
            console.log('[NxTweaks] On dashboard - checking features...');

            // Handle quick filters based on notifications status
            const notificationsOn = isNotificationsOn();
            console.log('[NxTweaks] Notifications status for toolbar creation:', notificationsOn);
            if (notificationsOn) {
                console.log('[NxTweaks] Attempting to create quick filters toolbar...');
                createQuickFiltersToolbar();
            } else {
                console.log('[NxTweaks] Notifications off - checking if toolbar needs to be removed');
                removeQuickFiltersIfExists();
            }

            // Try to create logo
            addLogoToTop();
        } else {
            // Remove dashboard-specific elements when not on dashboard
            removeDashboardElements();
        }
    }

    function removeDashboardElements() {
        // Remove logo if it exists
        const logo = document.querySelector('#conservative_ubies_top_logo');
        if (logo) {
            logo.remove();
            console.log('[NxTweaks] Logo removed - not on dashboard');
        }

        // Remove quick filters toolbar if it exists
        const toolbar = document.querySelector('#conservative_ubies_qf_toolbar');
        if (toolbar) {
            toolbar.remove();
            quickFiltersToolbar = null;
            // Reset button states
            qfButtonStates = { 1: false, 2: false, 5: false, 6: false };
            console.log('[NxTweaks] Quick filters removed - not on dashboard');
        }
    }

    // FEATURE 11: Comparisons Copy (Accountability, Liquor Cost, Weekly Sales)
    function initComparisonsCopy() {
        if (!CONFIG.FEATURES.comparisonsCopy) return;
        console.log('[NxTweaks] Comparisons copy initializing...');
        monitorUrlPattern(/\/accountability-analysis\//i, isMatch => {
            isMatch ? createComparisonsCopyButton() : removeComparisonsCopyButton();
        });
    }

    function createComparisonsCopyButton() {
        const buttonId = 'conservative_ubies_comparisons_copy_btn';

        // Check if comparisons element exists - required to show button
        const comparisonsElement = document.querySelector('app-comparisons');
        if (!comparisonsElement) {
            // Remove button if it exists but comparisons element is gone
            const existingButton = document.getElementById(buttonId);
            if (existingButton) {
                existingButton.remove();
                console.log('[NxTweaks] Comparisons copy button removed - element not found');
            }
            return;
        }

        // Don't create if already exists
        const existingButton = document.getElementById(buttonId);
        if (existingButton) return; // Already exists

        const btn = document.createElement('button');
        btn.id = buttonId;
        btn.textContent = '📊 Copy Comparisons';

        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            left: '165px',
            zIndex: '2147483647',
            padding: '8px 12px',
            backgroundColor: '#6f42c1',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            font: 'bold 14px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
            minWidth: '140px',
            textAlign: 'center',
            display: 'block !important',
            visibility: 'visible !important',
            opacity: '1 !important'
        });

        btn.addEventListener('click', async () => {
            btn.textContent = '⏳ Collecting...';
            btn.disabled = true;

            // Create progress indicator immediately
            const progressIndicator = document.createElement('div');
            progressIndicator.id = 'conservative_ubies_comparisons_indicator_main';
            progressIndicator.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.85);
                color: white;
                padding: 20px 30px;
                border-radius: 10px;
                font: bold 16px/1.5 system-ui;
                z-index: 2147483647;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                text-align: center;
            `;
            progressIndicator.textContent = 'Starting collection...';
            document.body.appendChild(progressIndicator);

            try {
                await collectComparisonsData(progressIndicator);
                btn.textContent = '✓ Copied!';
                btn.style.backgroundColor = '#28a745';
                setTimeout(() => {
                    btn.textContent = '📊 Copy Comparisons';
                    btn.style.backgroundColor = '#6f42c1';
                    btn.disabled = false;
                }, 2000);
            } catch (error) {
                console.error('[NxTweaks] Comparisons copy failed:', error);
                
                // Remove indicator on error
                if (progressIndicator.parentNode) {
                    progressIndicator.remove();
                }
                
                alert('Failed to copy comparisons: ' + error.message);
                btn.textContent = '✗ Failed';
                btn.style.backgroundColor = '#dc3545';
                setTimeout(() => {
                    btn.textContent = '📊 Copy Comparisons';
                    btn.style.backgroundColor = '#6f42c1';
                    btn.disabled = false;
                }, 3000);
            }
        });

        document.body.appendChild(btn);
        console.log('[NxTweaks] Comparisons copy button created');
    }

    function removeComparisonsCopyButton() {
        const buttonId = 'conservative_ubies_comparisons_copy_btn';
        const button = document.getElementById(buttonId);
        if (button) {
            button.remove();
            console.log('[NxTweaks] Comparisons copy button removed');
        }
    }

    async function waitForTableToLoad(comparisonsElement, tabName) {
        // Initial wait for the click to register
        await sleep(500);

        // Get last cell value (last row, last column)
        const getLastCellValue = () => {
            const tbody = comparisonsElement.querySelector('table tbody');
            if (!tbody) return '';
            const rows = tbody.querySelectorAll('tr');
            if (rows.length === 0) return '';
            const lastRow = rows[rows.length - 1];
            const cells = lastRow.querySelectorAll('td');
            if (cells.length === 0) return '';
            const lastCell = cells[cells.length - 1];
            return lastCell.textContent.trim();
        };

        const initialCellValue = getLastCellValue();
        console.log(`[NxTweaks] Waiting for ${tabName} table to load... (initial last cell: "${initialCellValue}")`);

        // For Liquor Cost, always wait for content to change or timeout
        // For others, allow quick exit if already on the right tab
        const requireChange = (tabName === 'Liquor Cost');

        // Poll for cell value change with a maximum timeout
        const maxWaitTime = 15000; // 15 seconds max
        const checkInterval = 300; // Check every 300ms
        const startTime = Date.now();
        let stableCount = 0;
        let lastCellValue = initialCellValue;

        while (Date.now() - startTime < maxWaitTime) {
            await sleep(checkInterval);

            const currentCellValue = getLastCellValue();

            // Check if cell value has changed from initial
            if (currentCellValue !== initialCellValue && currentCellValue.length > 0) {
                // Cell changed - now check if it's stable
                if (currentCellValue === lastCellValue) {
                    stableCount++;
                    if (stableCount >= 3) {
                        console.log(`[NxTweaks] ${tabName} table loaded and stable (last cell: "${currentCellValue}")`);
                        return;
                    }
                } else {
                    // Cell still changing
                    console.log(`[NxTweaks] ${tabName} cell changed: "${lastCellValue}" -> "${currentCellValue}"`);
                    lastCellValue = currentCellValue;
                    stableCount = 0;
                }
            } else if (currentCellValue === initialCellValue) {
                // Cell hasn't changed
                if (requireChange) {
                    // For Liquor Cost, keep waiting - content must change
                    // Don't increment stableCount, just wait for timeout
                    continue;
                } else {
                    // For other tabs, allow quick exit if already on correct tab
                    stableCount++;
                    if (stableCount >= 10) {
                        console.log(`[NxTweaks] ${tabName} table already loaded (last cell unchanged: "${currentCellValue}")`);
                        return;
                    }
                }
            }
        }

        // If we got here, we timed out - just proceed with whatever we have
        console.log(`[NxTweaks] ${tabName} table load timeout - proceeding with current content`);
    }

    async function collectComparisonsData(progressIndicator) {
        console.log('[NxTweaks] Starting comparisons data collection...');

        const comparisonsElement = document.querySelector('app-comparisons');
        if (!comparisonsElement) {
            throw new Error('Comparisons element not found');
        }

        const allData = [];

        // Tab configuration: label text and the data it contains
        const tabs = [
            { label: 'Accountability', name: 'Accountability' },
            { label: 'Liquor Cost', name: 'Liquor Cost' },
            { label: 'Weekly Sales ($)', name: 'Weekly Sales ($)' }
        ];

        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            console.log(`[NxTweaks] Collecting data from ${tab.name} tab...`);
            
            // Update progress indicator
            progressIndicator.textContent = `Collecting ${tab.name}...`;

            // Find and click the radio button for this tab
            const radioLabels = comparisonsElement.querySelectorAll('.custom-radio');
            let targetRadio = null;

            for (const label of radioLabels) {
                const span = label.querySelector('span');
                if (span && span.textContent.trim() === tab.label) {
                    targetRadio = label.querySelector('input[type="radio"]');
                    break;
                }
            }

            if (!targetRadio) {
                throw new Error(`Radio button for ${tab.name} not found`);
            }

            // Click the radio button
            targetRadio.click();
            console.log(`[NxTweaks] Clicked ${tab.name} tab`);

            // Wait for table to load with polling approach
            await waitForTableToLoad(comparisonsElement, tab.name);

            // Extract table data
            const table = comparisonsElement.querySelector('table');
            if (!table) {
                throw new Error(`Table not found for ${tab.name}`);
            }

            const tableData = extractComparisonsTableData(table, tab.name);
            allData.push(tableData);
            console.log(`[NxTweaks] Collected ${tableData.rows.length} rows from ${tab.name}`);
        }

        // Combine all data into one tab-separated text
        const combinedText = formatComparisonsData(allData);

        // Update progress indicator
        progressIndicator.textContent = `✓ Complete!\n${combinedText.split('\n').length} lines copied`;
        progressIndicator.style.background = 'rgba(40, 167, 69, 0.9)';

        // Use GM_setClipboard which works even after async operations
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(combinedText);
            console.log('[NxTweaks] All comparisons data copied to clipboard:', combinedText.split('\n').length, 'lines');
        } else {
            // Fallback to execCommand for environments without GM_setClipboard
            const textarea = document.createElement('textarea');
            textarea.value = combinedText;
            textarea.style.position = 'fixed';
            textarea.style.top = '0';
            textarea.style.left = '0';
            textarea.style.opacity = '0';
            textarea.style.zIndex = '-1';

            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            const success = document.execCommand('copy');
            document.body.removeChild(textarea);

            if (!success) {
                progressIndicator.remove();
                throw new Error('Clipboard operation failed');
            }

            console.log('[NxTweaks] All comparisons data copied to clipboard:', combinedText.split('\n').length, 'lines');
        }

        // Remove progress indicator after 2 seconds
        setTimeout(() => {
            if (progressIndicator.parentNode) {
                progressIndicator.parentNode.removeChild(progressIndicator);
            }
        }, 2000);
    }

    function extractComparisonsTableData(table, tabName) {
        const data = {
            name: tabName,
            headers: [],
            rows: []
        };

        // Extract headers
        const thead = table.querySelector('thead');
        if (thead) {
            const headerRow = thead.querySelector('tr');
            if (headerRow) {
                const headers = Array.from(headerRow.querySelectorAll('th')).map(th => th.textContent.trim());
                data.headers = headers;
            }
        }

        // Extract rows
        const tbody = table.querySelector('tbody');
        if (tbody) {
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = Array.from(row.querySelectorAll('td')).map(td => {
                    // Get text content, handling <strong> tags
                    return td.textContent.trim();
                });
                data.rows.push(cells);
            });
        }

        return data;
    }

    function formatComparisonsData(allData) {
        const lines = [];

        allData.forEach((tabData, index) => {
            // Add tab name as header
            lines.push(tabData.name);
            lines.push(''); // Empty line

            // Add headers
            if (tabData.headers.length > 0) {
                lines.push(tabData.headers.join('\t'));
            }

            // Add rows
            tabData.rows.forEach(row => {
                lines.push(row.join('\t'));
            });

            // Add separator between tabs (except after last tab)
            if (index < allData.length - 1) {
                lines.push('');
                lines.push('---');
                lines.push('');
            }
        });

        return lines.join('\n');
    }

    // FEATURE 12: Dark Theme Toggle
    function initDarkTheme() {
        if (!CONFIG.FEATURES.darkTheme) return;

        console.log('[NxTweaks] Dark theme initializing...');

        // Apply saved theme state
        if (darkThemeEnabled) {
            document.body.classList.add('nxtweaks-dark-theme');
        }

        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'nxtweaks-dark-theme-toggle';
        toggleBtn.innerHTML = darkThemeEnabled ? '🌙' : '☀️';
        toggleBtn.title = darkThemeEnabled ? 'Switch to Light Mode' : 'Switch to Dark Mode';

        toggleBtn.addEventListener('click', () => {
            darkThemeEnabled = !darkThemeEnabled;
            document.body.classList.toggle('nxtweaks-dark-theme', darkThemeEnabled);
            toggleBtn.innerHTML = darkThemeEnabled ? '🌙' : '☀️';
            toggleBtn.title = darkThemeEnabled ? 'Switch to Light Mode' : 'Switch to Dark Mode';
            localStorage.setItem('nxtweaks_dark_theme', darkThemeEnabled);
            console.log('[NxTweaks] Dark theme:', darkThemeEnabled ? 'enabled' : 'disabled');
        });

        document.body.appendChild(toggleBtn);
        console.log('[NxTweaks] Dark theme toggle button created');
    }

    // Main initialization - NO DOM OBSERVERS
    function initialize() {
        if (initialized) return;
        initialized = true;

        console.log('[NxTweaks] Initializing with document-idle timing...');

        // Initialize features without aggressive DOM observation
        initCustomStyles();
        initDarkTheme(); // Dark theme toggle
        initInvoiceHelper();
        initAccountTextHighlighting();
        initStepHighlighting();
        initQuickFilters();
        initTableSortEnhancer();
        initClickToCopy(); // Click-to-copy table cells/rows
        initCommTableVesselSort(); // Communication table vessel sorting
        initTableCollection(); // Auto-load all pages and copy table
        initProductLossReportCopyButton(); // Product loss report copy button
        initComparisonsCopy(); // Copy Accountability, Liquor Cost, and Weekly Sales comparisons
        initGlobalNavigation(); // Handle SPA navigation for dashboard features

        console.log('[NxTweaks] Initialization complete - minimal DOM observation');
    }

    // Initialize when DOM is ready (already using document-idle)
    initialize();

})();