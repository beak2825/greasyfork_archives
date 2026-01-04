// ==UserScript==
// @name         Block YouTube Videos by Titles, Keywords and Channels
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Blocks videos by title keywords and channels (Right-click to select channel)
// @author       Superflyin
// @match        *://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555250/Block%20YouTube%20Videos%20by%20Titles%2C%20Keywords%20and%20Channels.user.js
// @updateURL https://update.greasyfork.org/scripts/555250/Block%20YouTube%20Videos%20by%20Titles%2C%20Keywords%20and%20Channels.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const STORAGE_KEY_TITLES = "blockedTitleKeywords";
    const STORAGE_KEY_CHANNELS = "blockedChannelNames";
    const HEADER_BUTTON_ID = "yt-blocker-header-btn";
    const SETTINGS_MODAL_ID = "yt-blocker-settings-overlay";

    let processedKeywordSets = [];
    let blockedChannelNames = [];
    let lastRightClickedName = null;

    // --- === SVG Icon === ---
    // This is the "block" icon
    const BLOCK_ICON_SVG = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zM17 7.5L7.5 17 6 15.5 15.5 6 17 7.5z"/>
        </svg>
    `;

    // --- === New Settings Modal CSS === ---
    GM_addStyle(`
        #${SETTINGS_MODAL_ID} {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.7);
            z-index: 2000;
            display: none;
            align-items: center;
            justify-content: center;
            font-family: "Roboto", "Arial", sans-serif;
        }
        #yt-blocker-settings-content {
            background: var(--yt-spec-brand-background-solid, #282828);
            color: var(--yt-spec-text-primary, #fff);
            border-radius: 12px;
            padding: 24px;
            width: 90%;
            max-width: 600px; /* Wider for two columns */
            z-index: 2001;
        }
        #yt-blocker-settings-content h2 {
            font-size: 20px;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 20px;
        }
        .yt-blocker-settings-section {
            display: flex;
            flex-direction: column;
            margin-bottom: 16px;
        }
        .yt-blocker-settings-section label {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 4px;
        }
        .yt-blocker-settings-section p {
            font-size: 13px;
            color: var(--yt-spec-text-secondary, #aaa);
            margin: 0 0 8px 0;
            line-height: 1.4;
        }
        .yt-blocker-settings-section p code {
            background-color: var(--yt-spec-badge-chip-background, #383838);
            color: var(--yt-spec-text-secondary, #aaa);
            padding: 2px 4px;
            border-radius: 4px;
            font-size: 0.9em;
        }
        .yt-blocker-textarea {
            width: 100%;
            height: 200px;
            background: var(--yt-spec-badge-chip-background, #383838);
            color: var(--yt-spec-text-primary, #fff);
            border: 1px solid var(--yt-spec-text-disabled, #717171);
            border-radius: 8px;
            padding: 10px;
            font-family: monospace;
            font-size: 14px;
            resize: vertical;
        }
        .yt-blocker-settings-buttons {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        }
        .yt-blocker-settings-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 600;
            margin-left: 10px;
        }
        .yt-blocker-btn-close {
            background: var(--yt-spec-badge-chip-background, #383838);
            color: var(--yt-spec-text-primary, #fff);
        }
        .yt-blocker-btn-save {
            background: var(--yt-spec-call-to-action, #3ea6ff);
            color: var(--yt-spec-always-black, #000);
        }

        /* Style for the new header button */
        #${HEADER_BUTTON_ID} {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--yt-spec-text-primary, #fff);
            padding: 8px;
            margin: 0 8px;
            border-radius: 50%;
        }
        #${HEADER_BUTTON_ID}:hover {
            background-color: var(--yt-spec-badge-chip-background, #383838);
        }
    `);


    // --- === New Settings Modal Functions === ---

    function injectSettingsModal() {
        if (document.getElementById(SETTINGS_MODAL_ID)) return;

        const modalHTML = `
            <div id="${SETTINGS_MODAL_ID}">
                <div id="yt-blocker-settings-content">
                    <h2>Blocker Settings</h2>

                    <div class="yt-blocker-settings-section">
                        <label for="yt-blocker-titles-textarea">Block by Title Keywords</label>
                        <p>One entry per line. <br>
                           - <code>daily vlog</code> (no quotes): Blocks if title contains "daily" AND "vlog".<br>
                           - <code>"daily vlog"</code> (with quotes): Blocks if title contains the exact phrase "daily vlog".
                        </p>
                        <textarea id="yt-blocker-titles-textarea" class="yt-blocker-textarea"></textarea>
                    </div>

                    <div class="yt-blocker-settings-section">
                        <label for="yt-blocker-channels-textarea">Block by Channel Names</label>
                        <p>One channel name per line (e.g., <code>MrBeast</code>). Not case-sensitive. Do not include the <code>@</code> symbol.</p>
                        <textarea id="yt-blocker-channels-textarea" class="yt-blocker-textarea"></textarea>
                    </div>

                    <div class="yt-blocker-settings-buttons">
                        <button id="yt-blocker-settings-cancel" class="yt-blocker-settings-btn yt-blocker-btn-close">Cancel</button>
                        <button id="yt-blocker-settings-save" class="yt-blocker-settings-btn yt-blocker-btn-save">Save</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add event listeners
        document.getElementById('yt-blocker-settings-cancel').addEventListener('click', closeSettingsModal);
        document.getElementById('yt-blocker-settings-save').addEventListener('click', saveSettings);
        document.getElementById(SETTINGS_MODAL_ID).addEventListener('click', (e) => {
            if (e.target.id === SETTINGS_MODAL_ID) {
                closeSettingsModal();
            }
        });
    }

    function openSettingsModal() {
        // Load current settings into textareas
        const currentTitles = GM_getValue(STORAGE_KEY_TITLES, []).join("\n");
        const currentChannels = GM_getValue(STORAGE_KEY_CHANNELS, []).join("\n");

        document.getElementById('yt-blocker-titles-textarea').value = currentTitles;
        document.getElementById('yt-blocker-channels-textarea').value = currentChannels;

        // Show modal
        document.getElementById(SETTINGS_MODAL_ID).style.display = 'flex';
    }

    function closeSettingsModal() {
        document.getElementById(SETTINGS_MODAL_ID).style.display = 'none';
    }

    function saveSettings() {
        // Save Title Keywords
        const newTitles = document.getElementById('yt-blocker-titles-textarea').value
            .split('\n')
            .map(k => k.trim()) // Keep original case for quote-checking
            .filter(k => k.length > 0);
        GM_setValue(STORAGE_KEY_TITLES, [...new Set(newTitles)]);

        // Save Channel Names
        const newChannels = document.getElementById('yt-blocker-channels-textarea').value
            .split('\n')
            .map(h => h.trim().toLowerCase()) // Always save as lowercase
            .filter(h => h.length > 0);
        GM_setValue(STORAGE_KEY_CHANNELS, [...new Set(newChannels)]);

        // Reload internal state and re-run blocker
        loadTitleKeywords();
        loadChannelNames();
        blockContent();

        // Close modal
        closeSettingsModal();
    }

    // --- === New Header Button Function === ---

    function injectHeaderButton() {
        // Check if button already exists
        if (document.getElementById(HEADER_BUTTON_ID)) {
            return;
        }

        // More robust injection logic for Firefox
        const headerButtonsContainer = document.querySelector('ytd-masthead #end');

        if (headerButtonsContainer) {
            // Create the button
            const newButton = document.createElement('button');
            newButton.id = HEADER_BUTTON_ID;
            newButton.title = "Blocker Settings";
            newButton.innerHTML = BLOCK_ICON_SVG;
            newButton.addEventListener('click', openSettingsModal);

            // Prepend the button to the container.
            // This makes it the first item in the top-right cluster.
            headerButtonsContainer.prepend(newButton);
        }
    }

    // --- === Load Keywords/Names === ---

    function loadTitleKeywords() {
        const storedKeywordEntries = GM_getValue(STORAGE_KEY_TITLES, []);
        // Add logic to support both "phrase" and "all words"
        processedKeywordSets = storedKeywordEntries.map(entry => {
            entry = entry.trim();
            // Check if entry is a phrase in quotes
            if (entry.startsWith('"') && entry.endsWith('"')) {
                // It's a phrase. Return it as a single-item array.
                // Remove quotes and convert to lowercase.
                return [entry.substring(1, entry.length - 1).toLowerCase()];
            } else {
                // It's a set of keywords. Split by space.
                return entry.toLowerCase().split(' ')
                    .map(k => k.trim())
                    .filter(k => k.length > 0);
            }
        });
    }

    function loadChannelNames() {
        const storedNames = GM_getValue(STORAGE_KEY_CHANNELS, []);
        blockedChannelNames = storedNames.map(h => h.toLowerCase());
    }

    // --- === Helper Function: Get Channel Name === ---
    function getChannelNameFromContainer(container) {
        // This selector list covers grid videos, list videos, suggested videos,
        // shorts, community posts, and the main video owner.
        const channelSelector = [
            'ytd-channel-name a', // Standard video meta
            'a.yt-core-attributed-string__link[href*="/@"]', // New handle link
            'a.yt-core-attributed-string__link[href*="/c/"]', // Old custom URL
            'a.yt-core-attributed-string__link[href*="/user/"]', // Old username URL
            'yt-formatted-string#channel-name', // Compact video (sidebar)
            'span#author-name', // Shorts
            'div#author-name', // Shorts (alternative)
            'a#author-text', // Community posts
            // Selector for old suggested video layout (from user snippet)
            'div.yt-content-metadata-view-model__metadata-row > span.yt-content-metadata-view-model__metadata-text'
        ].join(', ');

        const channelElement = container.querySelector(channelSelector);
        let channelName = null;

        if (channelElement) {
            let name = "";
            // Community posts have text in a child span
            if (channelElement.matches('a#author-text')) {
                const nameSpan = channelElement.querySelector('span.yt-core-attributed-string');
                name = nameSpan ? nameSpan.textContent : channelElement.textContent;
            }
            // Most other links/spans have the name as the first text node (to avoid "Verified" badges)
            else if (channelElement.childNodes.length > 0 && channelElement.childNodes[0].nodeType === Node.TEXT_NODE) {
                name = channelElement.childNodes[0].textContent;
            }
            // Fallback to all text content
            else {
                name = channelElement.textContent;
            }
            // Filter out view counts, etc. that might be caught by the new selector
            if (!name.match(/view/i) && !name.match(/ago/i)) {
                 channelName = name.trim().toLowerCase();
            }
        }
        return channelName;
    }


    // --- === Quick Block (Right-Click) Functions === ---

    function captureRightClick(event) {
        lastRightClickedName = null;
        let channelName = null;

        // Reverted the container query to only use custom element tag names.
        // This is more stable and prevents matching child elements.
        const container = event.target.closest(
            'yt-lockup-view-model, ytd-rich-grid-media, ytd-rich-item-renderer, ' +
            'ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ' +
            'ytd-playlist-panel-video-renderer, ytd-reel-item-renderer, ytd-playlist-renderer, ' +
            'ytd-ad-slot-renderer, ytd-promoted-video-renderer, ytd-display-ad-renderer, ytd-post-renderer'
        );

        if (container) {
            channelName = getChannelNameFromContainer(container);
        } else if (window.location.href.includes("/watch")) {
             // Main video page
             const ownerContainer = document.querySelector('ytd-video-owner-renderer');
             if (ownerContainer) {
                 channelName = getChannelNameFromContainer(ownerContainer);
             }
        }

        if (channelName && channelName.length > 0) {
            lastRightClickedName = channelName;
        }
    }

    function blockCurrentChannel() {
        if (!lastRightClickedName) {
             // Updated error message text
             showCustomAlert("Error: Could not find a channel to block.\n\n" +
                   "Please right-click *on the video or post* you wish to block, then select 'Block This Channel' from the Tampermonkey menu.");
             return;
        }

        const nameToBlock = lastRightClickedName;
        lastRightClickedName = null;

        const currentNames = GM_getValue(STORAGE_KEY_CHANNELS, []);
        if (currentNames.includes(nameToBlock)) {
            showCustomAlert("Channel '" + nameToBlock + "' is already on your blocklist.");
            return;
        }

        // Use a custom confirm instead of window.confirm
        showCustomConfirm("Block this channel: '" + nameToBlock + "'?\n\nThis will hide all videos from this channel.", () => {
            currentNames.push(nameToBlock);
            GM_setValue(STORAGE_KEY_CHANNELS, [...new Set(currentNames)]);
            loadChannelNames();
            blockContent();
        });
    }


    // --- === Main Blocker Function === ---

    function blockContent() {
        if (processedKeywordSets.length === 0 && blockedChannelNames.length === 0) {
            return;
        }

        // This list matches the right-click list.
        const containers = document.querySelectorAll(
            'yt-lockup-view-model, ytd-rich-grid-media, ytd-rich-item-renderer, ' +
            'ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ' +
            'ytd-playlist-panel-video-renderer, ytd-reel-item-renderer, ytd-playlist-renderer, ' +
            'ytd-ad-slot-renderer, ytd-promoted-video-renderer, ytd-display-ad-renderer, ytd-post-renderer'
        );

        containers.forEach(container => {
            if (container.style.display === 'none') { return; }
            let shouldBlock = false;

            // 1. Title Keyword Check
            if (processedKeywordSets.length > 0) {
                // --- MODIFICATION START (v8.8) ---
                // Re-ordered selectors to prioritize subscription/grid titles
                // before falling back to the generic 'a#video-title'.
                const titleElement = container.querySelector(
                    'a#video-title-link', // Grid view (subscriptions) link
                    'yt-formatted-string#video-title', // Grid view (subscriptions) text
                    'a#video-title', // Standard, compact, grid
                    '.yt-lockup-metadata-view-model__title', // Old lockup
                    '#ad-title', // Ads
                    '#title a', // Ads
                    '.title', // Ads
                    'span#content-text', // Community posts
                    '#post-text', // Community posts (alt)
                    '#content' // Community posts (alt)
                );
                // --- MODIFICATION END (v8.8) ---
                if (titleElement) {
                    const titleText = (titleElement.getAttribute('aria-label') || titleElement.title || titleElement.textContent || "").toLowerCase();
                    if (titleText) {
                        for (const keywordSet of processedKeywordSets) {
                            // This now checks if ALL keywords in the set are present
                            // This supports both "phrase" (1 item) and "all words" (N items)
                            if (keywordSet.every(keyword => titleText.includes(keyword))) {
                                shouldBlock = true;
                                break;
                            }
                        }
                    }
                }
            }

            // 2. Channel Name Check
            if (!shouldBlock && blockedChannelNames.length > 0) {
                const channelName = getChannelNameFromContainer(container);
                if (channelName && blockedChannelNames.includes(channelName)) {
                    shouldBlock = true;
                }
            }

            // 3. Block Action
            if (shouldBlock) {
                container.style.display = 'none';
            }
        });
    }

    // --- === Custom Alert/Confirm Modals === ---
    // (To avoid issues with browser alert/confirm)

    function injectAlertModal() {
        if (document.getElementById('yt-blocker-alert-overlay')) return;
        const alertHTML = `
            <div id="yt-blocker-alert-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); z-index: 2002; justify-content: center; align-items: center;">
                <div id="yt-blocker-alert-content" style="background: var(--yt-spec-brand-background-solid, #282828); color: var(--yt-spec-text-primary, #fff); border-radius: 12px; padding: 24px; width: 90%; max-width: 450px; z-index: 2003; font-family: 'Roboto', 'Arial', sans-serif;">
                    <p id="yt-blocker-alert-text" style="font-size: 16px; margin: 0 0 20px 0; line-height: 1.5; white-space: pre-wrap;"></p>
                    <div id="yt-blocker-alert-buttons" style="display: flex; justify-content: flex-end;">
                        <button id="yt-blocker-alert-ok" class="yt-blocker-settings-btn yt-blocker-btn-save" style="margin-left: 0;">OK</button>
                    </div>
                    <div id="yt-blocker-confirm-buttons" style="display: none; justify-content: flex-end;">
                        <button id="yt-blocker-confirm-cancel" class="yt-blocker-settings-btn yt-blocker-btn-close">Cancel</button>
                        <button id="yt-blocker-confirm-ok" class="yt-blocker-settings-btn yt-blocker-btn-save">OK</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', alertHTML);

        document.getElementById('yt-blocker-alert-ok').addEventListener('click', closeCustomAlert);
        document.getElementById('yt-blocker-confirm-cancel').addEventListener('click', closeCustomAlert);
        document.getElementById('yt-blocker-alert-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'yt-blocker-alert-overlay') {
                closeCustomAlert();
            }
        });
    }

    function showCustomAlert(message) {
        injectAlertModal();
        document.getElementById('yt-blocker-alert-text').textContent = message;
        document.getElementById('yt-blocker-alert-buttons').style.display = 'flex';
        document.getElementById('yt-blocker-confirm-buttons').style.display = 'none';
        document.getElementById('yt-blocker-alert-overlay').style.display = 'flex';
    }

    function showCustomConfirm(message, callback) {
        injectAlertModal();
        document.getElementById('yt-blocker-alert-text').textContent = message;
        document.getElementById('yt-blocker-alert-buttons').style.display = 'none';
        document.getElementById('yt-blocker-confirm-buttons').style.display = 'flex';

        // Remove old listener and add new one
        const confirmOk = document.getElementById('yt-blocker-confirm-ok');
        const newConfirmOk = confirmOk.cloneNode(true);
        confirmOk.parentNode.replaceChild(newConfirmOk, confirmOk);
        newConfirmOk.addEventListener('click', () => {
            closeCustomAlert();
            callback();
        });

        document.getElementById('yt-blocker-alert-overlay').style.display = 'flex';
    }

    function closeCustomAlert() {
        document.getElementById('yt-blocker-alert-overlay').style.display = 'none';
    }


    // --- --- Script Start --- ---

    // Inject all modals (they start hidden)
    injectSettingsModal();
    injectAlertModal();

    // Load blocklists from storage
    loadTitleKeywords();
    loadChannelNames();

    // Register ONLY the right-click menu command
    GM_registerMenuCommand("Block This Channel", blockCurrentChannel);

    // Add listener for right-clicks
    document.addEventListener('mousedown', (e) => {
        if (e.button === 2) { // 2 is for right-click
            captureRightClick(e);
        }
    }, true);

    // Run tasks repeatedly
    function runTasks() {
        injectHeaderButton(); // Constantly check if header button needs to be re-injected
        blockContent();       // Constantly check for new content to block
    }

    setInterval(runTasks, 500);

})();