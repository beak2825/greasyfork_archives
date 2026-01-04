// ==UserScript==
// @name         Instagram Bulk Remover
// @homepage     https://github.com/rahaaatul/userscripts
// @namespace    https://github.com/rahaaatul/userscripts
// @version      1.0.0
// @description  Bulk unlike/delete with stable duplicate button injection and settings dialog
// @author       Rahatul Ghazi
// @match        https://www.instagram.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/551908/Instagram%20Bulk%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/551908/Instagram%20Bulk%20Remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =================================================================================
    // CONSTANTS & SETTINGS
    // =================================================================================
    const BULK_ACTIONS_SETTINGS_ID = 'insta-bulk-actions-settings';
    const IS_RUNNING_KEY = 'isBulkActionRunning';
    const DEFAULT_MAX_POSTS = 20, MIN_POSTS_LIMIT = 1, MAX_POSTS_LIMIT = 100;
    const DEFAULT_DELAY_MS = 1000, MIN_DELAY_MS = 0, MAX_DELAY_MS = 3000;
    let isRunning = false;
    let currentTimeout = null;

    const PAGE_CONFIGS = {
        likes: { url: '/your_activity/interactions/likes', appid: 'com.instagram.privacy.activity_center.liked_unlike', headerText: 'Unlike Settings', actionText: 'Unlike' },
        comments: { url: '/your_activity/interactions/comments', appid: 'com.instagram.privacy.activity_center.comments_delete', headerText: 'Uncomment Settings', actionText: 'Delete' },
        story_replies: { url: '/your_activity/interactions/story_replies', appid: 'com.instagram.privacy.activity_center.story_replies_delete', headerText: 'Unreply Settings', actionText: 'Delete' }
    };

    let nextCursor = null; // Variable to hold the pagination cursor

    function getCurrentPageConfig() {
        // Normalize current path by removing trailing slash if it exists
        const normalizedPath = window.location.pathname.replace(/\/$/, '');
        return Object.values(PAGE_CONFIGS).find(p =>
            // Also normalize the config URL for a robust comparison
            normalizedPath.startsWith(p.url));
    }

    function getConfig(key, defaultValue) { return GM_getValue(key, defaultValue); }
    function setConfig(key, value) { GM_setValue(key, value); }

    // =================================================================================
    // DIALOG & UI
    // =================================================================================
    function updateSliderVisuals(slider) {
        const valueDisplay = document.querySelector(`.native-slider-value[data-slider-id="${slider.id}"]`);
        if (valueDisplay) valueDisplay.textContent = slider.value;
    }
    // STABLE BUTTON INJECTION
    // =================================================================================
    const TARGET_SELECTOR = 'div[role="button"][aria-label="Sort & filter"]';

    function showSettingsDialog() {
        const pageConfig = getCurrentPageConfig();
        if (!pageConfig || document.getElementById(`${BULK_ACTIONS_SETTINGS_ID}-container`)) return;

        const maxPosts = getConfig('maxPosts', DEFAULT_MAX_POSTS);
        const delayMs = getConfig('delayMs', DEFAULT_DELAY_MS);
        const autoScroll = getConfig('autoScroll', false);

        const overlay = document.createElement('div');
        overlay.id = `${BULK_ACTIONS_SETTINGS_ID}-overlay`;
        overlay.addEventListener('click', closeSettingsDialog);

        const container = document.createElement('div');
        container.id = `${BULK_ACTIONS_SETTINGS_ID}-container`;
        container.innerHTML = `
            <div class="native-popup-header">
                <div class="native-popup-close"><svg aria-label="Close" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M18 6.4L17.6 6 12 11.6 6.4 6 6 6.4 11.6 12 6 17.6 6.4 18 12 12.4 17.6 18 18 17.6 12.4 12 18 6.4z"></path></svg></div>
                <h1 class="native-popup-title">${pageConfig.headerText}</h1>
            </div>
            <div class="native-popup-content">
                <div class="native-control-group">
                    <p class="native-slider-label" id="maxPostsLabel">Items per Batch</p>
                    <div class="native-slider-container">
                        <input type="range" id="maxPosts" min="${MIN_POSTS_LIMIT}" max="${MAX_POSTS_LIMIT}" value="${maxPosts}">
                        <span class="native-slider-value" data-slider-id="maxPosts">${maxPosts}</span>
                    </div>
                </div>
                <div class="native-control-group">
                    <p class="native-slider-label">Delay per Action (ms)</p>
                    <div class="native-slider-container">
                        <input type="range" id="delayMs" min="${MIN_DELAY_MS}" max="${MAX_DELAY_MS}" step="1" value="${delayMs}">
                        <span class="native-slider-value" data-slider-id="delayMs">${delayMs}</span>
                    </div>
                </div>
                <button id="run-stop-button"></button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(container);
        setTimeout(() => { overlay.classList.add('visible'); container.classList.add('visible'); }, 10);

        container.querySelector('.native-popup-close').addEventListener('click', closeSettingsDialog);
        container.querySelectorAll('input[type="range"]').forEach(slider => {
            updateSliderVisuals(slider); // Set initial value display
            slider.addEventListener('input', () => {
                updateSliderVisuals(slider);
                setConfig(slider.id, parseInt(slider.value));
            });
        });

        container.querySelector('#run-stop-button').addEventListener('click', toggleScript);
        updateRunButtonState();
    }

    function closeSettingsDialog() {
        const overlay = document.getElementById(`${BULK_ACTIONS_SETTINGS_ID}-overlay`);
        const container = document.getElementById(`${BULK_ACTIONS_SETTINGS_ID}-container`);
        if (overlay && container) {
            overlay.classList.remove('visible');
            container.classList.remove('visible');
            setTimeout(() => { overlay.remove(); container.remove(); }, 300);
        }
    }

    function updateRunButtonState() {
        const btn = document.getElementById('run-stop-button');
        if (!btn) return;
        btn.textContent = isRunning ? 'Stop' : 'Start';
        btn.setAttribute('data-running', isRunning);
    }

    function toggleScript() {
        isRunning = !isRunning;
        setConfig(IS_RUNNING_KEY, isRunning);
        updateRunButtonState();
        if (isRunning) runAutomationLoop();
        else if (currentTimeout) { clearTimeout(currentTimeout); currentTimeout = null; }
    }

    // Custom error for clean loop termination
    class ScriptStoppedError extends Error {
        constructor(message = "Script execution was stopped.") {
            super(message);
            this.name = "ScriptStoppedError";
        }
    }

    function delay(ms) {
        return new Promise((resolve, reject) => {
            if (!isRunning) { reject(new ScriptStoppedError()); return; }
            currentTimeout = setTimeout(() => { if (isRunning) resolve(); else reject(new ScriptStoppedError()); }, ms);
        });
    }

    // =================================================================================
    // BULK AUTOMATION
    // =================================================================================
    async function waitForElement(selector, options = {}) {
        const { textContent, findAll = false, timeout = 10000 } = options;
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            if (!isRunning) return null;

            const elements = Array.from(document.querySelectorAll(selector));
            if (findAll) {
                if (elements.length > 0) return elements;
            } else {
                const target = textContent
                    ? elements.find(el => el.textContent.trim() === textContent)
                    : elements[0];
                if (target) return target;
            }
            await new Promise(resolve => setTimeout(resolve, 250)); // Use native timeout to avoid cancellation issues here
        }
        console.warn(`[IBR] Timed out waiting for element: ${selector}`);
        return null;
    }

    async function waitForElementToDisappear(selector, options = {}) {
        const { textContent, timeout = 10000 } = options;
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            if (!isRunning) return;
            const elements = Array.from(document.querySelectorAll(selector));
            const target = textContent ? elements.find(el => el.textContent.trim() === textContent) : elements[0];
            if (!target) return; // Element has disappeared
            await new Promise(resolve => setTimeout(resolve, 250));
        }
        console.warn(`[IBR] Timed out waiting for element to disappear: ${selector}`);
    }

    async function runAutomationLoop() {
        const pageConfig = getCurrentPageConfig();
        if (!pageConfig) return;

        try {
            while (isRunning) {
                // --- State Reset: Ensure we are not in selection mode before starting a new cycle ---
                const cancelButton = await waitForElement('span', { textContent: 'Cancel', timeout: 1000 }); // Short timeout, it's just a check
                if (cancelButton) {
                    console.log('[IBR] In selection mode unexpectedly. Resetting UI state...');
                    cancelButton.click();
                    await waitForElementToDisappear('span', { textContent: 'Cancel' }); // Wait for it to disappear
                }

                const selectButton = await waitForElement('span', { textContent: 'Select', timeout: 30000 });
                if (!selectButton) {
                    console.warn('[IBR] "Select" button not found after 30s. Retrying...');
                    await delay(2000);
                    continue;
                }
                selectButton.click();
                await delay(500);

                const maxPosts = getConfig('maxPosts', DEFAULT_MAX_POSTS);
                const clickDelay = getConfig('delayMs', DEFAULT_DELAY_MS);

                // --- Scroll until enough items are loaded ---
                let collectedCheckboxes = [];
                let lastTotalCount = 0;
                let stableCount = 0;
                console.log(`[IBR] Goal: Find up to ${maxPosts} items.`);

                while (isRunning && collectedCheckboxes.length < maxPosts && stableCount < 3) {
                    collectedCheckboxes = Array.from(document.querySelectorAll('div[role="button"][aria-label="Toggle checkbox"]'));

                    if (collectedCheckboxes.length >= maxPosts) {
                        console.log(`[IBR] Found ${collectedCheckboxes.length} items, meeting goal of ${maxPosts}.`);
                        break;
                    }

                    if (collectedCheckboxes.length === lastTotalCount) {
                        stableCount++;
                        console.log(`[IBR] Scroll check ${stableCount}/3: No new items loaded. Found ${collectedCheckboxes.length}.`);
                    } else {
                        stableCount = 0;
                        console.log(`[IBR] Found ${collectedCheckboxes.length}/${maxPosts}. Scrolling for more...`);
                    }
                    lastTotalCount = collectedCheckboxes.length;

                    const scrollableContainer = document.querySelector('div[data-bloks-name="bk.components.Collection"]');
                    if (scrollableContainer) {
                        scrollableContainer.scrollTop = scrollableContainer.scrollHeight - 500;
                    } else {
                        console.warn('[IBR] Could not find scrollable container. Stopping scroll.');
                        break;
                    }
                    await delay(1500);
                }

                if (collectedCheckboxes.length === 0) {
                    alert('[IBR] No items found on the page to process. Automation finished.');
                    break;
                }

                // --- Select the items ---
                const effectiveMax = Math.min(collectedCheckboxes.length, maxPosts);
                console.log(`[IBR] Selecting the first ${effectiveMax} items...`);
                for (let i = 0; i < effectiveMax; i++) {
                    if (!isRunning) throw new ScriptStoppedError();
                    const checkbox = collectedCheckboxes[i];
                    if (checkbox) {
                        checkbox.click();
                    }
                    await delay(clickDelay);
                }

                // --- Perform the final action ---
                const totalSelected = document.querySelectorAll('div[role="button"][aria-label="Toggle checkbox"][aria-checked="true"]').length;
                console.log(`[IBR] Finished selecting ${totalSelected} items. Performing final action...`);
                const initialActionButton = await waitForElement('div[role="button"] span', { textContent: pageConfig.actionText });
                if (initialActionButton) initialActionButton.click();
                await delay(500);
                const confirmActionButton = await waitForElement('button', { textContent: pageConfig.actionText });
                if (confirmActionButton) {
                    confirmActionButton.click();
                    // Wait for the confirmation dialog to disappear before proceeding
                    await waitForElementToDisappear('button', { textContent: pageConfig.actionText });
                }
                // Wait for the main "Select" button to reappear, indicating the UI is ready
                await waitForElement('span', { textContent: 'Select', timeout: 30000 });
            }
        } catch (e) {
            if (e.name === "ScriptStoppedError") {
                console.log('[IBR] Automation stopped by user.');
            } else {
                console.error('[IBR] An unexpected error occurred:', e);
                alert(`[IBR] An error occurred: ${e.message}. Check console for details.`);
            }
        }

        // Once the loop is done, ensure the state is set to "stopped".
        if (isRunning) toggleScript();
    }
    // =================================================================================
    // DUPLICATE "SORT & FILTER" BUTTON STABLY
    // =================================================================================
    function customAction(event, original, duplicate) {
        event.stopPropagation();
        event.preventDefault();
        // First, check if we are on a page where the script can run.
        if (getCurrentPageConfig()) {
            showSettingsDialog();
        } else {
            alert('This feature is only available on the "Your Activity" pages (Likes, Comments, etc.). Please navigate there to use it.');
        }
    }

    function createDuplicate(original) {
        if (!original || original.dataset.dupCreated) return null;

        const clone = original.cloneNode(true);
        clone.dataset.dupCreated = '1';
        clone.id = (original.id || 'sort_filter_orig') + '_dup_' + Date.now();

        const pageConfig = getCurrentPageConfig();
        const buttonText = pageConfig ? pageConfig.headerText : 'Instagram Bulk Remover';
        // Change the button's accessible name and visible text
        clone.setAttribute('aria-label', buttonText);
        clone.querySelector('span').textContent = buttonText;

        clone.style.marginLeft = '10px';
        clone.style.zIndex = '9999';
        clone.style.pointerEvents = 'auto';

        clone.addEventListener('click', function (e) {
            customAction(e, original, clone);
        }, true);

        original.parentNode.insertBefore(clone, original.nextSibling);
        return clone;
    }

    function findAndDuplicateOnce() {
        const original = document.querySelector(TARGET_SELECTOR);
        if (!original) return;
        if (original.dataset.dupCreated) return;
        createDuplicate(original);
        original.dataset.dupCreated = '1';
    }

    const observer = new MutationObserver(() => {
        findAndDuplicateOnce();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener('load', () => { setTimeout(findAndDuplicateOnce, 800); });
    setTimeout(findAndDuplicateOnce, 2000);

    // =================================================================================
    // STYLES
    // =================================================================================
    GM_addStyle(`
        #${BULK_ACTIONS_SETTINGS_ID}-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.65); z-index:10000; opacity:0; transition:opacity 150ms ease; }
        #${BULK_ACTIONS_SETTINGS_ID}-overlay.visible { opacity:1; }
        #${BULK_ACTIONS_SETTINGS_ID}-container { position:fixed; top:50%; left:50%; width:500px; max-width:90vw; background:#262626; color:#fafafa; border-radius:24px; z-index:10001; display:flex; flex-direction:column; opacity:0; transform:translate(-50%, -50%) scale(0.95); max-height:90vh; font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size:14px; animation:ig-dialog-bounce-in 300ms ease-out forwards; }
        #${BULK_ACTIONS_SETTINGS_ID}-container.visible { opacity:1; transform:translate(-50%, -50%) scale(1); }
        @keyframes ig-dialog-bounce-in {0%{opacity:0;transform:translate(-50%,-50%) scale(1.15);}50%{opacity:1;transform:translate(-50%,-50%) scale(1.03);}80%{transform:translate(-50%,-50%) scale(0.99);}100%{transform:translate(-50%,-50%) scale(1);}}
        .native-popup-header { display:flex; align-items:center; justify-content:center; position:relative; padding:12px 16px; border-bottom:1px solid #363636; }
        .native-popup-title { font-size:16px; font-weight:700; }
        .native-popup-close { position:absolute; left:0; top:0; bottom:0; display:flex; align-items:center; padding:0 16px; cursor:pointer; }
        .native-popup-content { padding:16px; overflow-y:auto; display: flex; flex-direction: column; gap: 16px; }
        .native-control-group { margin-bottom:0; }
        .native-slider-label { font-size:14px; font-weight:400; margin-bottom:16px; display:block; color:#a8a8a8; transition: color 200ms ease; }
        .native-slider-container { display:flex; align-items:center; gap:16px; }
        .native-slider-value { font-size:14px; font-variant-numeric:tabular-nums; color:#f5f5f5; }
        #${BULK_ACTIONS_SETTINGS_ID}-container input[type="range"] { -webkit-appearance:none; appearance:none; width:100%; height:4px; border-radius:2px; cursor:pointer; background:#363636; }
        #${BULK_ACTIONS_SETTINGS_ID}-container input[type="range"]::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:20px; height:20px; border-radius:50%; border:none; background:#f5f5f5; box-shadow:0 0 2px rgba(0,0,0,0.5);}
        #${BULK_ACTIONS_SETTINGS_ID}-container #run-stop-button { width:100%; min-height:44px; font-family:inherit; font-size:14px; font-weight:700; border:none; border-radius:8px; cursor:pointer; transition:background-color 0.2s; margin-top: 10px; }
        #${BULK_ACTIONS_SETTINGS_ID}-container #run-stop-button[data-running="false"] { background-color:#0095f6; color:#fff; }
        #${BULK_ACTIONS_SETTINGS_ID}-container #run-stop-button[data-running="true"] { background-color:#ed4956; color:#fff; }
    `);

    // This init function is no longer needed as the code is now self-contained and runs on load.
    // The observer and initial calls handle the button injection.
    function init() {
        console.log('[IBR] Script initializing...');
        // Reset running state on script load/reload
        if (getConfig(IS_RUNNING_KEY, false)) {
            setConfig(IS_RUNNING_KEY, false);
        }
        isRunning = false;
    }

    init();

})();
