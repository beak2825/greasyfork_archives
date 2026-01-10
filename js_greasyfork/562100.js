// ==UserScript==
// @name         Discogs Edit Helper
// @namespace    https://github.com/chr1sx/Discogs-Edit-Helper
// @version      1.0
// @description  Extracts durations, artists, featuring artists and remixers from track titles and assigns them to the appropriate fields.
// @author       chr1sx
// @match        https://www.discogs.com/release/edit/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=discogs.com&sz=64
// @downloadURL https://update.greasyfork.org/scripts/562100/Discogs%20Edit%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/562100/Discogs%20Edit%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* =========================
       Configuration
       ========================= */
    const CONFIG = {
        INACTIVITY_TIMEOUT_MS: 60 * 1000, // 60 seconds auto-collapse
        INFO_TEXT_COLOR: '#28a745',
        THEME_KEY: 'discogs_helper_theme_v2',
        FEAT_REMOVE_KEY: 'discogs_helper_removeFeat',
        MAX_LOG_MESSAGES: 200,
        RETRY_ATTEMPTS: 4,
        RETRY_DELAY_MS: 140
    };

    /* =========================
       State Management
       ========================= */
    const state = {
        logMessages: [],
        hideTimeout: null,
        actionHistory: [],
        isCollapsed: false,
        removeFeatFromTitle: true
    };

    /* =========================
       Initialization
       ========================= */
    function initializeState() {
        try {
            const storedFeat = localStorage.getItem(CONFIG.FEAT_REMOVE_KEY);
            if (storedFeat === '0' || storedFeat === '1') {
                state.removeFeatFromTitle = (storedFeat === '1');
            }
        } catch (e) {
            console.warn('[Discogs Edit Helper] Could not load settings:', e);
        }
    }

    /* =========================
       Logging & UI Updates
       ========================= */
    function log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        state.logMessages.push({ timestamp, message, type });

        // Keep only recent messages
        if (state.logMessages.length > CONFIG.MAX_LOG_MESSAGES) {
            state.logMessages = state.logMessages.slice(-CONFIG.MAX_LOG_MESSAGES);
        }

        console.log(`[Discogs Edit Helper] ${message}`);
        updatePanelLog();
    }

    function updatePanelLog() {
        const logContainer = document.getElementById('log-container');
        if (!logContainer) return;

        const colors = {
            info: '#9aa0a6',
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545'
        };

        logContainer.innerHTML = state.logMessages
            .slice(-CONFIG.MAX_LOG_MESSAGES)
            .map(entry => `<div style="color: ${colors[entry.type]}; margin: 2px 0;">[${entry.timestamp}] ${escapeHtml(entry.message)}</div>`)
            .join('');
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function setInfoSingleLine(text, success = true) {
        const infoDiv = document.getElementById('track-info');
        if (!infoDiv) return;

        infoDiv.style.display = 'block';
        infoDiv.style.whiteSpace = 'nowrap';
        infoDiv.style.overflow = 'hidden';
        infoDiv.style.textOverflow = 'ellipsis';
        infoDiv.style.padding = '8px';
        infoDiv.style.borderRadius = '4px';
        infoDiv.style.fontSize = '12px';
        infoDiv.style.textAlign = 'center';
        infoDiv.style.color = CONFIG.INFO_TEXT_COLOR;
        infoDiv.textContent = text;
    }

    /* =========================
       Timer Management
       ========================= */
    function resetHideTimer() {
        if (state.hideTimeout) {
            clearTimeout(state.hideTimeout);
        }
        state.hideTimeout = setTimeout(() => {
            if (!state.isCollapsed) {
                collapsePanel();
            }
        }, CONFIG.INACTIVITY_TIMEOUT_MS);
    }

    function collapsePanel() {
        const content = document.getElementById('panel-content');
        const collapseBtn = document.getElementById('collapse-panel');
        if (content && collapseBtn) {
            content.style.display = 'none';
            collapseBtn.textContent = '▼';
            collapseBtn.title = 'Expand';
            state.isCollapsed = true;
        }
    }

    function expandPanel() {
        const content = document.getElementById('panel-content');
        const collapseBtn = document.getElementById('collapse-panel');
        if (content && collapseBtn) {
            content.style.display = 'block';
            collapseBtn.textContent = '▲';
            collapseBtn.title = 'Collapse';
            state.isCollapsed = false;
            resetHideTimer();
        }
    }

    /* =========================
       DOM Manipulation Helpers
       ========================= */
    function setReactValue(element, value) {
        if (!element) return;

        try {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                'value'
            ).set;
            nativeInputValueSetter.call(element, value);
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.focus();
            element.blur();
        } catch (e) {
            log(`Error setting value: ${e.message}`, 'error');
        }
    }

    function dispatchMouseClick(el) {
        if (!el) return false;

        try {
            el.click();
            ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                el.dispatchEvent(new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    function escapeRegExp(str) {
        return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function cleanupArtistName(str) {
        if (!str) return '';
        const trimmed = String(str).trim();
        return trimmed.replace(/^[\s\(\[\-:]+|[\s\)\]\-:;,.]+$/g, '');
    }

    /* =========================
       Find/Remove Helpers
       ========================= */
    function findRemoveButtonIn(container) {
        if (!container) return null;

        const selectors = [
            'button.editable_input_remove',
            'button[aria-label="Remove"]',
            'button[title="Remove"]'
        ];

        for (const selector of selectors) {
            const button = container.querySelector(selector);
            if (button) return button;
        }

        const icon = container.querySelector('i.icon.icon-times, svg.icon-times');
        if (icon) {
            return icon.closest('button') || icon;
        }

        return null;
    }

    function findRemoveNear(node) {
        if (!node) return null;

        const row = node.closest('tr');
        if (!row) return null;

        const selectors = [
            'button.editable_input_remove',
            'button[aria-label="Remove"]',
            'i.icon.icon-times'
        ];

        for (const selector of selectors) {
            const el = row.querySelector(selector);
            if (el) {
                return el.closest('button') || el;
            }
        }

        return null;
    }

    /* =========================
       Add Artist/Credit Helpers
       ========================= */
    async function clickAddArtistButton(row) {
        return new Promise((resolve) => {
            const artistTd = row.querySelector('td.subform_track_artists');
            const addButton = artistTd?.querySelector('button.add-credit-button');

            if (!addButton) {
                resolve({ success: false });
                return;
            }

            const before = Array.from(artistTd.querySelectorAll(
                'input[data-type="artist-name"], input.credit-artist-name-input'
            ));

            addButton.click();

            let attempts = 0;
            const maxAttempts = 40;

            const interval = setInterval(() => {
                attempts++;
                const inputs = Array.from(artistTd.querySelectorAll(
                    'input[data-type="artist-name"], input.credit-artist-name-input'
                ));
                const newInput = inputs.find(input => !before.includes(input));

                if (newInput) {
                    clearInterval(interval);
                    const artistContainer = newInput.closest('li.editable_artist_item') ||
                                          newInput.closest('fieldset') ||
                                          newInput.parentElement;
                    const removeButton = findRemoveButtonIn(artistContainer) ||
                                       artistTd.querySelector('button.editable_input_remove') ||
                                       findRemoveNear(newInput);

                    setTimeout(() => resolve({
                        success: true,
                        artistInput: newInput,
                        artistContainer,
                        removeButton
                    }), 30);
                    return;
                }

                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    resolve({ success: false });
                }
            }, 100);
        });
    }

    async function clickAddCreditButton(row) {
        return new Promise((resolve) => {
            const titleTd = row.querySelector('td.subform_track_title');

            if (!titleTd) {
                log('Title TD not found for track.', 'error');
                resolve(false);
                return;
            }

            let creditsEditableList = Array.from(titleTd.querySelectorAll('.editable_list')).find(list => {
                const span = list.querySelector('span:not([data-reactid*="track-number"])');
                return span && span.textContent && span.textContent.includes('Credits');
            });

            if (!creditsEditableList) {
                creditsEditableList = Array.from(titleTd.querySelectorAll('.editable_list'))
                    .find(list => list.querySelector('button.add-credit-button'));
            }

            let addButton = creditsEditableList?.querySelector('button.add-credit-button');
            if (!addButton) {
                addButton = titleTd.querySelector('button.add-credit-button') ||
                          row.querySelector('button.add-credit-button');
            }

            if (!addButton) {
                log('Could not find Credits editable list.', 'error');
                resolve(false);
                return;
            }

            const artistInputsInRow = Array.from(row.querySelectorAll('input.credit-artist-name-input'));
            let beforeMax = -1;

            artistInputsInRow.forEach(input => {
                const id = input.id || '';
                const match = id.match(/artist-name-credits-input-(\d+)/);
                if (match) {
                    beforeMax = Math.max(beforeMax, parseInt(match[1], 10));
                }
            });

            addButton.click();

            let attempts = 0;
            const maxAttempts = 60;

            const interval = setInterval(() => {
                attempts++;

                const nowArtistInputs = Array.from(row.querySelectorAll('input.credit-artist-name-input'));
                let newMax = beforeMax;

                nowArtistInputs.forEach(input => {
                    const id = input.id || '';
                    const match = id.match(/artist-name-credits-input-(\d+)/);
                    if (match) {
                        newMax = Math.max(newMax, parseInt(match[1], 10));
                    }
                });

                if (newMax > beforeMax) {
                    const roleSel = `#add-role-input-${newMax}`;
                    const artistSel = `#artist-name-credits-input-${newMax}`;
                    let roleInput = row.querySelector(roleSel);
                    let artistInput = row.querySelector(artistSel);

                    if (!roleInput || !artistInput) {
                        const creditItemsList = titleTd.querySelector('ul.editable_items_list') ||
                                               row.querySelector('ul.editable_items_list');
                        if (creditItemsList) {
                            const items = Array.from(creditItemsList.querySelectorAll(
                                'li.editable_item, li, fieldset'
                            ));
                            const candidate = items[items.length - 1];

                            if (candidate) {
                                const li = candidate.closest('li.editable_item') ||
                                         candidate.closest('li') ||
                                         candidate;
                                roleInput = roleInput || li.querySelector('input.add-credit-role-input');
                                artistInput = artistInput || li.querySelector('input.credit-artist-name-input');
                                const removeButton = li.querySelector('button.editable_input_remove') ||
                                                    findRemoveNear(li);

                                clearInterval(interval);
                                setTimeout(() => resolve({
                                    roleInput,
                                    artistInput,
                                    newCreditItem: li,
                                    removeButton
                                }), 20);
                                return;
                            }
                        }
                    }

                    if (!roleInput || !artistInput) {
                        const allRoles = Array.from(document.querySelectorAll('input.add-credit-role-input'));
                        const allArtists = Array.from(document.querySelectorAll('input.credit-artist-name-input'));

                        if (allRoles.length && allArtists.length) {
                            roleInput = roleInput || allRoles[allRoles.length - 1];
                            artistInput = artistInput || allArtists[allArtists.length - 1];
                        }
                    }

                    const newCreditItem = (roleInput && roleInput.closest('li.editable_item')) ||
                                        (artistInput && artistInput.closest('li.editable_item')) ||
                                        (roleInput && roleInput.closest('li')) ||
                                        (artistInput && artistInput.closest('li')) ||
                                        (roleInput && roleInput.closest('fieldset')) ||
                                        (artistInput && artistInput.closest('fieldset')) ||
                                        null;

                    const removeButton = newCreditItem ?
                        (newCreditItem.querySelector('button.editable_input_remove') || findRemoveNear(newCreditItem)) :
                        (titleTd.querySelector('button.editable_input_remove') || findRemoveNear(row));

                    clearInterval(interval);
                    setTimeout(() => resolve({
                        roleInput,
                        artistInput,
                        newCreditItem,
                        removeButton
                    }), 20);
                    return;
                }

                const creditItemsList = titleTd.querySelector('ul.editable_items_list') ||
                                       row.querySelector('ul.editable_items_list');
                if (creditItemsList) {
                    const items = Array.from(creditItemsList.querySelectorAll(
                        'li.editable_item, li, fieldset'
                    ));

                    if (items.length > 0) {
                        const last = items[items.length - 1];
                        const li = last.closest('li.editable_item') || last.closest('li') || last;
                        const roleInput = li.querySelector(
                            'input.add-credit-role-input[aria-label="Add Artist Role"], input.add-credit-role-input'
                        );
                        const artistInput = li.querySelector(
                            'input.credit-artist-name-input[aria-label="Add Artist"], input.credit-artist-name-input'
                        );

                        if (roleInput && artistInput) {
                            clearInterval(interval);
                            const removeButton = li.querySelector('button.editable_input_remove') ||
                                                findRemoveNear(li);
                            setTimeout(() => resolve({
                                roleInput,
                                artistInput,
                                newCreditItem: li,
                                removeButton
                            }), 20);
                            return;
                        }
                    }
                }

                const allRoles = Array.from(document.querySelectorAll('input.add-credit-role-input'));
                const allArtists = Array.from(document.querySelectorAll('input.credit-artist-name-input'));

                if (allRoles.length > 0 && allArtists.length > 0) {
                    const roleInput = allRoles[allRoles.length - 1];
                    const artistInput = allArtists[allArtists.length - 1];
                    const newCreditItem = (roleInput && roleInput.closest('li.editable_item')) ||
                                        (artistInput && artistInput.closest('li.editable_item')) ||
                                        (roleInput && roleInput.closest('li')) ||
                                        (artistInput && artistInput.closest('li')) ||
                                        null;

                    clearInterval(interval);
                    const removeButton = newCreditItem ?
                        (newCreditItem.querySelector('button.editable_input_remove') || findRemoveNear(newCreditItem)) :
                        findRemoveNear(row);

                    setTimeout(() => resolve({
                        roleInput,
                        artistInput,
                        newCreditItem,
                        removeButton
                    }), 20);
                    return;
                }

                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    log('Timeout waiting for credit inputs to appear', 'error');
                    resolve(false);
                }
            }, 100);
        });
    }

    /* =========================
       Extraction Functions
       ========================= */
    function scanAndExtract() {
        setInfoSingleLine('Processing...');
        log('Starting duration scan...', 'info');

        let trackRows = document.querySelectorAll('tr.track_row');
        if (trackRows.length === 0) {
            trackRows = document.querySelectorAll('tr[class*="track"]');
        }

        if (trackRows.length === 0) {
            log('No track rows found', 'error');
            setInfoSingleLine('No tracks found', false);
            return;
        }

        let processed = 0;
        const changes = [];

        trackRows.forEach((row) => {
            const titleInput = row.querySelector('input[data-type="track-title"], input[id*="track-title"]');
            const durationInput = row.querySelector('td.subform_track_duration input, input[aria-label*="duration" i]');

            if (!titleInput || !durationInput) return;

            const title = titleInput.value.trim();
            const match = title.match(/(\d+:\d+)\s*$/);

            if (match) {
                const duration = match[1];
                const newTitle = title.replace(/\s*\d+:\d+\s*$/, '').trim();

                changes.push({
                    titleInput,
                    oldTitle: title,
                    newTitle,
                    durationInput,
                    oldDuration: durationInput.value.trim(),
                    newDuration: duration
                });

                setReactValue(titleInput, newTitle);
                setReactValue(durationInput, duration);
                processed++;
            }
        });

        if (changes.length > 0) {
            state.actionHistory.push({ type: 'durations', changes });
            updateRevertButton();
        }

        if (processed > 0) {
            const plural = processed > 1 ? 's' : '';
            setInfoSingleLine(`Done! Extracted ${processed} duration${plural}`, true);
            log(`Done! Extracted ${processed} duration${plural}`, 'success');
        } else {
            setInfoSingleLine('No durations found', false);
        }
    }

    async function extractArtists() {
        setInfoSingleLine('Processing...');
        log('Starting artist extraction...', 'info');

        let trackRows = document.querySelectorAll('tr.track_row');
        if (trackRows.length === 0) {
            trackRows = document.querySelectorAll('tr[class*="track"]');
        }

        let processed = 0;
        const changes = [];

        for (let i = 0; i < trackRows.length; i++) {
            const row = trackRows[i];
            const titleInput = row.querySelector('input[data-type="track-title"], input[id*="track-title"]');

            if (!titleInput) continue;

            const title = titleInput.value.trim();
            const match = title.match(/^(.+?)\s*[-—]\s*(.+)$/);

            if (!match) continue;

            const artist = match[1].trim();
            const newTitle = match[2].trim();

            let existingArtistInput = row.querySelector('td.subform_track_artists input[data-type="artist-name"]');
            if (existingArtistInput && existingArtistInput.value.trim()) continue;

            const result = await clickAddArtistButton(row);
            if (!result.success) continue;

            existingArtistInput = result.artistInput;

            changes.push({
                titleInput,
                oldTitle: title,
                newTitle,
                artistInput: existingArtistInput,
                artistContainer: result.artistContainer,
                removeButton: result.removeButton,
                oldArtist: existingArtistInput.value.trim(),
                newArtist: artist
            });

            setReactValue(titleInput, newTitle);
            setReactValue(existingArtistInput, artist);
            processed++;
        }

        if (changes.length > 0) {
            state.actionHistory.push({ type: 'artists', changes });
            updateRevertButton();
        }

        if (processed > 0) {
            const plural = processed > 1 ? 's' : '';
            setInfoSingleLine(`Done! Extracted ${processed} artist${plural}`, true);
            log(`Done! Extracted ${processed} artist${plural}`, 'success');
        } else {
            setInfoSingleLine('No artists found', false);
        }
    }

    async function extractFeaturing() {
        setInfoSingleLine('Processing...');
        log('Starting featuring artist extraction...', 'info');

        let trackRows = document.querySelectorAll('tr.track_row');
        if (trackRows.length === 0) {
            trackRows = document.querySelectorAll('tr[class*="track"]');
        }

        let processed = 0;
        const changes = [];

        for (let i = 0; i < trackRows.length; i++) {
            const row = trackRows[i];
            const titleInput = row.querySelector('input[data-type="track-title"], input[id*="track-title"]');

            if (!titleInput) continue;

            let title = titleInput.value.trim();
            let found = false;
            let featArtist = null;
            let newTitle = title;

            const parenRegex = /\(([^)]+)\)/g;
            let match;

            while ((match = parenRegex.exec(title)) !== null) {
                const inner = match[1];
                const featMatch = inner.match(/(?:^|\b)(?:feat\.?|featuring)\s+([^\-\/;,\)]+)/i);

                if (featMatch) {
                    found = true;
                    featArtist = cleanupArtistName(featMatch[1]);
                    let cleanedInner = inner.replace(
                        new RegExp(`(?:\\b(?:feat\\.?|featuring)\\s+${escapeRegExp(featMatch[1].trim())})(\\s*[-\\/;:,])?`, 'i'),
                        ''
                    ).trim();
                    cleanedInner = cleanedInner.replace(/^[\s\-–—:;\/,]+|[\s\-–—:;\/,]+$/g, '').trim();

                    if (cleanedInner.length > 0) {
                        newTitle = newTitle.replace(match[0], `(${cleanedInner})`);
                    } else {
                        newTitle = newTitle.replace(match[0], ' ');
                    }
                    break;
                }
            }

            if (!found) {
                const outsideFeat = newTitle.match(/\b(?:feat\.?|featuring)\s+([^\(\)\-–—,;]+)/i);
                if (outsideFeat) {
                    found = true;
                    featArtist = cleanupArtistName(outsideFeat[1]);
                    newTitle = newTitle.replace(outsideFeat[0], ' ');
                }
            }

            if (found && featArtist) {
                newTitle = newTitle.replace(/\s{2,}/g, ' ').replace(/\s*-\s*$/g, '').trim();

                const creditFields = await clickAddCreditButton(row);
                if (!creditFields) {
                    log(`Track ${i + 1}: Failed to open credit fields for featuring`, 'error');
                    continue;
                }

                const { roleInput, artistInput, newCreditItem, removeButton } = creditFields;
                const oldArtistValue = artistInput ? (artistInput.value || '').trim() : '';

                setReactValue(roleInput, 'Featuring');
                setReactValue(artistInput, featArtist);

                if (state.removeFeatFromTitle) {
                    setReactValue(titleInput, newTitle);
                }

                changes.push({
                    titleInput,
                    oldTitle: title,
                    newTitle,
                    roleInput,
                    artistInput,
                    role: 'Featuring',
                    artist: featArtist,
                    oldArtist: oldArtistValue,
                    creditItem: newCreditItem,
                    removeButton
                });

                processed++;
            }
        }

        if (changes.length > 0) {
            state.actionHistory.push({ type: 'featuring', changes });
            updateRevertButton();
        }

        if (processed > 0) {
            const plural = processed > 1 ? 's' : '';
            setInfoSingleLine(`Done! Extracted ${processed} feat. artist${plural}`, true);
            log(`Done! Extracted ${processed} feat. artist${plural}`, 'success');
        } else {
            setInfoSingleLine('No featuring artists found', false);
        }
    }

    async function extractRemixers() {
        setInfoSingleLine('Processing...');
        log('Starting remixer extraction...', 'info');

        let trackRows = document.querySelectorAll('tr.track_row');
        if (trackRows.length === 0) {
            trackRows = document.querySelectorAll('tr[class*="track"]');
        }

        let processed = 0;
        const changes = [];

        for (let i = 0; i < trackRows.length; i++) {
            const row = trackRows[i];
            const titleInput = row.querySelector('input[data-type="track-title"], input[id*="track-title"]');

            if (!titleInput) continue;

            const title = titleInput.value.trim();
            let remixer = null;

            const parenRegex = /\(([^)]+)\)/g;
            let match;

            while ((match = parenRegex.exec(title)) !== null) {
                const inner = match[1];
                const remBy = inner.match(/(?:remix|rmx)\s+by\s+([^\-\/;,\)]+)/i);

                if (remBy && remBy[1]) {
                    remixer = cleanupArtistName(remBy[1]);
                    break;
                }

                const remBy2 = inner.match(/([^\-\/;,\)]+?)\s+(?:remix|rmx)\s+by\s+([^\-\/;,\)]+)/i);
                if (remBy2 && remBy2[2]) {
                    remixer = cleanupArtistName(remBy2[2]);
                    break;
                }

                const remBefore = inner.match(/([^\-\/;,\)]+?)\s+(?:remix|rmx)\b/i);
                if (remBefore && remBefore[1] && !/feat\.?|featuring/i.test(inner)) {
                    remixer = cleanupArtistName(remBefore[1]);
                    break;
                }
            }

            if (!remixer) {
                const remByOut = title.match(/(?:remix|rmx)\s+by\s+([^\(\)\-–—,;]+)/i);
                if (remByOut && remByOut[1]) {
                    remixer = cleanupArtistName(remByOut[1]);
                } else {
                    const remEnd = title.match(/([A-Z0-9][A-Za-z0-9\s&+]+?)\s+(?:remix|rmx)\b\s*$/i);
                    if (remEnd && remEnd[1]) {
                        remixer = cleanupArtistName(remEnd[1]);
                    }
                }
            }

            if (remixer) {
                const creditFields = await clickAddCreditButton(row);
                if (!creditFields) {
                    log(`Track ${i + 1}: Failed to open credit fields for remixer`, 'error');
                    continue;
                }

                const { roleInput, artistInput, newCreditItem, removeButton } = creditFields;
                const oldArtistValue = artistInput ? (artistInput.value || '').trim() : '';

                setReactValue(roleInput, 'Remix');
                setReactValue(artistInput, remixer);

                changes.push({
                    titleInput,
                    oldTitle: title,
                    newTitle: title,
                    roleInput,
                    artistInput,
                    role: 'Remix',
                    artist: remixer,
                    oldArtist: oldArtistValue,
                    creditItem: newCreditItem,
                    removeButton
                });

                processed++;
            }
        }

        if (changes.length > 0) {
            state.actionHistory.push({ type: 'remixers', changes });
            updateRevertButton();
        }

        if (processed > 0) {
            const plural = processed > 1 ? 's' : '';
            setInfoSingleLine(`Done! Extracted ${processed} remixer${plural}`, true);
            log(`Done! Extracted ${processed} remixer${plural}`, 'success');
        } else {
            setInfoSingleLine('No remixers found', false);
        }
    }

    /* =========================
       Revert Functions
       ========================= */
    async function tryClickAndWait(removeEl, targetNode, attempts = CONFIG.RETRY_ATTEMPTS, delayMs = CONFIG.RETRY_DELAY_MS) {
        if (!removeEl) return false;

        for (let i = 0; i < attempts; i++) {
            try {
                dispatchMouseClick(removeEl);
            } catch (e) {
                log(`Error clicking remove button: ${e.message}`, 'warning');
            }

            await new Promise(resolve => setTimeout(resolve, delayMs));

            if (!targetNode || !targetNode.isConnected) {
                return true;
            }
        }

        return (!targetNode || !targetNode.isConnected);
    }

    async function clickRemoveCandidateAndVerify(change) {
        const creditItem = change.creditItem || change.artistContainer || null;
        const artistInput = change.artistInput || null;
        const storedRemove = change.removeButton || null;

        if (creditItem) {
            const li = creditItem.tagName && creditItem.tagName.toLowerCase() === 'li' ?
                creditItem :
                (creditItem.closest ? creditItem.closest('li.editable_item') || creditItem.closest('li') : creditItem);

            if (li && li.isConnected) {
                const rb = findRemoveButtonIn(li);
                if (rb) {
                    const success = await tryClickAndWait(rb, li);
                    if (success) return true;
                }
            }
        }

        if (storedRemove && storedRemove.isConnected) {
            const success = await tryClickAndWait(storedRemove, creditItem || artistInput);
            if (success) return true;
        }

        if (artistInput && artistInput.isConnected) {
            const li2 = artistInput.closest('li.editable_item') ||
                       artistInput.closest('li') ||
                       artistInput.closest('fieldset');

            if (li2 && li2.isConnected) {
                const rb = findRemoveButtonIn(li2);
                if (rb) {
                    const success = await tryClickAndWait(rb, li2);
                    if (success) return true;
                }
            }
        }

        const near = (artistInput && findRemoveNear(artistInput)) ||
                    (creditItem && findRemoveNear(creditItem));
        if (near) {
            const success = await tryClickAndWait(near, creditItem || artistInput);
            if (success) return true;
        }

        if (creditItem && creditItem.isConnected) {
            const icon = creditItem.querySelector('i.icon.icon-times, svg.icon-times');
            if (icon) {
                const success = await tryClickAndWait(icon, creditItem);
                if (success) return true;
            }
        }

        return false;
    }

    async function revertLastAction() {
        if (state.actionHistory.length === 0) {
            log('No action to revert', 'warning');
            setInfoSingleLine('No changes to revert', false);
            return;
        }

        setInfoSingleLine('Processing...');
        const lastAction = state.actionHistory.pop();
        log(`Reverting: ${lastAction.type}`, 'info');

        if (lastAction.type === 'durations') {
            let restored = 0;
            for (const change of lastAction.changes) {
                if (change.titleInput) {
                    setReactValue(change.titleInput, change.oldTitle);
                }
                if (change.durationInput) {
                    setReactValue(change.durationInput, change.oldDuration || '');
                }
                restored++;
            }
            updateRevertButton();
            const plural = restored > 1 ? 's' : '';
            setInfoSingleLine(`Done! Reverted ${restored} duration${plural}`, true);
            log(`Done! Reverted ${restored} duration${plural}`, 'success');
            return;
        }

        if (lastAction.type === 'artists') {
            let removed = 0;
            let failed = 0;

            for (const change of lastAction.changes) {
                if (change.titleInput) {
                    setReactValue(change.titleInput, change.oldTitle);
                }
                if (change.artistInput) {
                    setReactValue(change.artistInput, change.oldArtist || '');
                }

                const success = await clickRemoveCandidateAndVerify(change);
                if (success) {
                    removed++;
                } else {
                    failed++;
                    if (change.artistInput && change.oldArtist !== undefined) {
                        setReactValue(change.artistInput, change.oldArtist || '');
                    }
                }
            }

            updateRevertButton();
            const plural = removed !== 1 ? 's' : '';
            const summary = `Reverted ${removed} artist${plural}`;

            if (removed > 0) {
                setInfoSingleLine(`Done! ${summary}`, true);
                log(`Done! ${summary}`, 'success');
            }
            if (failed > 0) {
                log(`${failed} removal(s) failed`, 'warning');
                if (removed === 0) {
                    setInfoSingleLine(`${failed} removal(s) failed`, false);
                }
            }
            return;
        }

        if (lastAction.type === 'featuring' || lastAction.type === 'remixers') {
            let removed = 0;
            let failed = 0;

            for (const change of lastAction.changes) {
                if (lastAction.type === 'featuring' && change.titleInput) {
                    setReactValue(change.titleInput, change.oldTitle);
                }
                if (change.roleInput) {
                    setReactValue(change.roleInput, '');
                }
                if (change.artistInput) {
                    setReactValue(change.artistInput, change.oldArtist || '');
                }

                const success = await clickRemoveCandidateAndVerify(change);
                if (success) {
                    removed++;
                } else {
                    failed++;
                    if (change.artistInput && change.oldArtist !== undefined) {
                        setReactValue(change.artistInput, change.oldArtist || '');
                    }
                }
            }

            updateRevertButton();
            const word = lastAction.type === 'featuring' ? 'feat. artist' : 'remixer';
            const plural = removed !== 1 ? 's' : '';
            const summary = `Reverted ${removed} ${word}${plural}`;

            if (removed > 0) {
                setInfoSingleLine(`Done! ${summary}`, true);
                log(`Done! ${summary}`, 'success');
            }
            if (failed > 0) {
                log(`${failed} removal(s) failed`, 'warning');
                if (removed === 0) {
                    setInfoSingleLine(`${failed} removal(s) failed`, false);
                }
            }
            return;
        }

        updateRevertButton();
        setInfoSingleLine('Done! Reverted', true);
        log('Done! Reverted', 'success');
    }

    function updateRevertButton() {
        const btn = document.getElementById('revert-last');
        if (!btn) return;

        if (state.actionHistory.length > 0) {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.textContent = `↩️ Revert Actions (${state.actionHistory.length})`;
        } else {
            btn.disabled = true;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'default';
            btn.textContent = '↩️ Revert Actions';
        }
    }

    /* =========================
       Theme Management
       ========================= */
    function applyTheme(theme) {
        const panel = document.getElementById('durations-helper-panel');
        if (!panel) return;

        const panelContent = panel.querySelector('#panel-content');
        const styleButtons = panel.querySelectorAll('.dh-btn');
        const themeBtn = panel.querySelector('#theme-toggle');
        const collapseBtn = panel.querySelector('#collapse-panel');
        const closeBtn = panel.querySelector('#close-panel');
        const logContainer = panel.querySelector('#log-container');
        const infoDiv = panel.querySelector('#track-info');
        const headerTitle = panel.querySelector('.panel-header strong');
        const featToggle = document.getElementById('toggle-feat-remove');

        const activeBlueLight = '#1e66d6';
        const activeBlueDark = '#0b5fd6';
        const inactiveBgLight = '#e6e6e6';
        const inactiveBgDark = '#2b2b2b';

        if (theme === 'dark') {
            panel.style.background = '#0f1112';
            panel.style.color = '#ddd';
            if (panelContent) panelContent.style.background = '#111216';

            styleButtons.forEach(btn => {
                btn.style.background = '#1f2224';
                btn.style.color = '#ddd';
                btn.style.border = '1px solid #262626';
            });

            if (infoDiv) {
                infoDiv.style.background = '#161718';
                infoDiv.style.color = CONFIG.INFO_TEXT_COLOR;
            }

            if (logContainer) {
                logContainer.style.background = '#0e0f10';
                logContainer.style.color = '#cfcfcf';
            }

            if (themeBtn) {
                themeBtn.textContent = '☀';
                themeBtn.style.color = '#fff';
            }
            if (collapseBtn) collapseBtn.style.color = '#fff';
            if (closeBtn) closeBtn.style.color = '#fff';

            if (headerTitle) {
                headerTitle.style.color = '#fff';
                headerTitle.style.whiteSpace = 'nowrap';
                headerTitle.style.overflow = 'hidden';
                headerTitle.style.textOverflow = 'ellipsis';
            }

            if (featToggle) {
                featToggle.style.background = state.removeFeatFromTitle ? activeBlueDark : inactiveBgDark;
                featToggle.style.color = '#fff';
                featToggle.style.border = '1px solid #1b446f';
            }
        } else {
            panel.style.background = '#fff';
            panel.style.color = '#111';
            if (panelContent) panelContent.style.background = '#fff';

            styleButtons.forEach(btn => {
                btn.style.background = '#f1f3f5';
                btn.style.color = '#111';
                btn.style.border = '1px solid #e4e6e8';
            });

            if (infoDiv) {
                infoDiv.style.background = '#f8f9fa';
                infoDiv.style.color = CONFIG.INFO_TEXT_COLOR;
            }

            if (logContainer) {
                logContainer.style.background = '#f8f9fa';
                logContainer.style.color = '#6b6b6b';
            }

            if (themeBtn) {
                themeBtn.textContent = '☾';
                themeBtn.style.color = '#111';
            }
            if (collapseBtn) collapseBtn.style.color = '#111';
            if (closeBtn) closeBtn.style.color = '#111';

            if (headerTitle) {
                headerTitle.style.color = '#111';
                headerTitle.style.whiteSpace = 'nowrap';
                headerTitle.style.overflow = 'hidden';
                headerTitle.style.textOverflow = 'ellipsis';
            }

            if (featToggle) {
                featToggle.style.background = state.removeFeatFromTitle ? activeBlueLight : inactiveBgLight;
                featToggle.style.color = state.removeFeatFromTitle ? '#fff' : '#111';
                featToggle.style.border = '1px solid #bfcfe8';
            }
        }

        if (featToggle) {
            featToggle.title = `Remove feat text from title: ${state.removeFeatFromTitle ? 'ON' : 'OFF'}`;
            featToggle.textContent = state.removeFeatFromTitle ? '✓' : '';
        }
    }

    function initThemeFromStorage() {
        let theme = 'light';
        try {
            const stored = localStorage.getItem(CONFIG.THEME_KEY);
            if (stored === 'dark' || stored === 'light') {
                theme = stored;
            }
        } catch (e) {
            log('Could not load theme preference', 'warning');
        }
        applyTheme(theme);
    }

    /* =========================
       Panel Styling
       ========================= */
    function addPanelStyles() {
        if (document.getElementById('discogs-helper-panel-styles')) return;

        const css = `
            #durations-helper-panel {
                border-radius: 8px !important;
                overflow: hidden !important;
                box-sizing: border-box !important;
            }
            #durations-helper-panel .panel-header strong {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
                vertical-align: middle;
            }
            #durations-helper-panel #panel-content {
                box-sizing: border-box;
                background: transparent;
            }
            #durations-helper-panel #log-container {
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
                box-sizing: border-box;
            }
            #durations-helper-panel,
            #durations-helper-panel * {
                box-sizing: border-box;
            }
            #toggle-feat-remove {
                width: 18px;
                height: 18px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                font-size: 12px;
                line-height: 1;
                cursor: pointer;
                user-select: none;
            }
            #toggle-feat-remove:focus {
                outline: 2px solid rgba(30, 102, 214, 0.3);
                outline-offset: 2px;
            }
        `;

        const style = document.createElement('style');
        style.id = 'discogs-helper-panel-styles';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    /* =========================
       Panel Creation
       ========================= */
    function createPanel() {
        const existing = document.getElementById('durations-helper-panel');
        if (existing) existing.remove();

        const panel = document.createElement('div');
        panel.id = 'durations-helper-panel';
        panel.style.cssText = `
            position: fixed;
            right: 20px;
            top: 165px;
            width: 255px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
            z-index: 10000;
            font-family: Arial, sans-serif;
            box-sizing: border-box;
        `;

        panel.innerHTML = `
            <div class="panel-header" style="padding: 8px 10px; display: flex; align-items: center; gap: 8px; box-sizing: border-box;">
                <strong style="font-size: 14px; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Discogs Edit Helper</strong>
                <div style="display: flex; gap: 6px; align-items: center;">
                    <button id="theme-toggle" title="Toggle theme" style="background: none; border: none; cursor: pointer; font-size: 14px; padding: 2px 4px;">☾</button>
                    <button id="collapse-panel" title="Collapse" style="background: none; border: none; cursor: pointer; font-size: 16px; padding: 2px 4px;">▲</button>
                    <button id="close-panel" title="Close" style="background: none; border: none; cursor: pointer; font-size: 18px; padding: 2px 4px;">✕</button>
                </div>
            </div>
            <div id="panel-content" style="padding: 12px; box-sizing: border-box;">
                <button id="scan-and-extract" class="dh-btn">🕛 Extract Durations</button>
                <button id="extract-artists" class="dh-btn">👤 Extract Artists</button>
                <button id="extract-featuring" class="dh-btn">👥 Extract Feat. Artists</button>
                <button id="extract-remixers" class="dh-btn">🪩 Extract Remixers</button>
                <button id="revert-last" class="dh-btn" style="margin-top: 8px;">↩️ Revert Actions</button>
                <div id="track-info" style="background: #f8f9fa; padding: 8px; border-radius: 4px; margin-top: 8px; font-size: 12px; display: block; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Ready</div>
                <div id="log-section" style="margin-top: 10px; display: block;">
                    <div id="log-toggle" style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; cursor: pointer;">
                        <strong style="font-size: 11px; color: #666;">Activity Log</strong>
                        <span id="log-arrow" style="font-size: 12px; color: #666;">▼</span>
                    </div>
                    <div id="log-container" style="max-height: 160px; overflow-y: auto; font-size: 10px; font-family: monospace; background: #f8f9fa; padding: 6px; border-radius: 4px; display: none;"></div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        addPanelStyles();

        const styleButtons = panel.querySelectorAll('.dh-btn');
        styleButtons.forEach(btn => {
            btn.style.cssText = `
                display: block;
                width: 100%;
                box-sizing: border-box;
                padding: 10px 12px;
                margin-bottom: 8px;
                background: #f1f3f5;
                color: #111;
                border: 1px solid #e4e6e8;
                border-radius: 6px;
                text-align: left;
                cursor: pointer;
                font-weight: 500;
            `;
        });

        const featBtn = document.getElementById('extract-featuring');
        if (featBtn) {
            featBtn.style.display = 'flex';
            featBtn.style.alignItems = 'center';
            featBtn.style.justifyContent = 'space-between';
            featBtn.style.gap = '8px';

            const featToggle = document.createElement('span');
            featToggle.id = 'toggle-feat-remove';
            featToggle.setAttribute('role', 'button');
            featToggle.setAttribute('tabindex', '0');
            featToggle.textContent = state.removeFeatFromTitle ? '✓' : '';
            featToggle.title = `Remove feat text from title: ${state.removeFeatFromTitle ? 'ON' : 'OFF'}`;
            featToggle.style.cssText = `
                flex: 0 0 auto;
                margin: 0;
                padding: 0;
                width: 18px;
                height: 18px;
                font-size: 12px;
                border-radius: 4px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                user-select: none;
            `;

            function toggleFeatHandler(e) {
                if (e && e.stopPropagation) e.stopPropagation();
                if (e && e.preventDefault) e.preventDefault();

                state.removeFeatFromTitle = !state.removeFeatFromTitle;
                featToggle.textContent = state.removeFeatFromTitle ? '✓' : '';
                featToggle.title = `Remove feat text from title: ${state.removeFeatFromTitle ? 'ON' : 'OFF'}`;

                try {
                    localStorage.setItem(CONFIG.FEAT_REMOVE_KEY, state.removeFeatFromTitle ? '1' : '0');
                } catch (err) {
                    log('Could not save feat setting', 'warning');
                }

                const current = localStorage.getItem(CONFIG.THEME_KEY) === 'dark' ? 'dark' : 'light';
                applyTheme(current);
            }

            featToggle.addEventListener('click', toggleFeatHandler);
            featToggle.addEventListener('keydown', (ev) => {
                if (ev.key === ' ' || ev.key === 'Enter') {
                    toggleFeatHandler(ev);
                }
            });

            featBtn.appendChild(featToggle);
        }

        const collapseBtn = document.getElementById('collapse-panel');
        const closeBtn = document.getElementById('close-panel');
        const themeBtn = document.getElementById('theme-toggle');
        const logToggle = document.getElementById('log-toggle');
        const logContainer = document.getElementById('log-container');

        closeBtn.onclick = () => {
            panel.style.display = 'none';
            if (state.hideTimeout) {
                clearTimeout(state.hideTimeout);
            }
        };

        collapseBtn.onclick = () => {
            const content = document.getElementById('panel-content');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                collapseBtn.textContent = '▲';
                collapseBtn.title = 'Collapse';
                state.isCollapsed = false;
                resetHideTimer();
            } else {
                content.style.display = 'none';
                collapseBtn.textContent = '▼';
                collapseBtn.title = 'Expand';
                state.isCollapsed = true;
            }
        };

        document.getElementById('scan-and-extract').onclick = scanAndExtract;
        document.getElementById('extract-artists').onclick = extractArtists;
        document.getElementById('extract-featuring').onclick = extractFeaturing;
        document.getElementById('extract-remixers').onclick = extractRemixers;
        document.getElementById('revert-last').onclick = revertLastAction;

        logToggle.onclick = () => {
            if (!logContainer) return;
            if (logContainer.style.display === 'none' || logContainer.style.display === '') {
                logContainer.style.display = 'block';
                document.getElementById('log-arrow').textContent = '▲';
            } else {
                logContainer.style.display = 'none';
                document.getElementById('log-arrow').textContent = '▼';
            }
        };

        themeBtn.onclick = () => {
            const current = localStorage.getItem(CONFIG.THEME_KEY) === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';

            try {
                localStorage.setItem(CONFIG.THEME_KEY, next);
            } catch (e) {
                log('Could not save theme preference', 'warning');
            }

            applyTheme(next);
        };

        initThemeFromStorage();
        log('Panel initialized');
        resetHideTimer();
        updateRevertButton();
    }

    /* =========================
       Initialization
       ========================= */
    function initialize() {
        initializeState();
        createPanel();
        updateRevertButton();
        log('Ready');

        document.body.addEventListener('mousemove', resetHideTimer);
        document.body.addEventListener('keydown', resetHideTimer);
        document.body.addEventListener('click', resetHideTimer);

        const panel = document.getElementById('durations-helper-panel');
        if (panel) {
            panel.addEventListener('mousemove', resetHideTimer);
            panel.addEventListener('keydown', resetHideTimer);
            panel.addEventListener('click', resetHideTimer);
        }
    }

    setTimeout(initialize, 900);

})();