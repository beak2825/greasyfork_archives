// ==UserScript==
// @name         Discogs Edit Helper
// @namespace    https://github.com/chr1sx/Discogs-Edit-Helper
// @version      1.2
// @description  Extracts durations, artists, featuring artists and remixers from track titles and assigns them to the appropriate fields
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

    const CONFIG = {
        INACTIVITY_TIMEOUT_MS: 45 * 1000,
        INFO_TEXT_COLOR: '#28a745',
        THEME_KEY: 'discogs_helper_theme_v2',
        FEAT_REMOVE_KEY: 'discogs_helper_removeFeat',
        REMIX_OPTIONAL_KEY: 'discogs_helper_remix_optional',
        MAX_LOG_MESSAGES: 200,
        RETRY_ATTEMPTS: 4,
        RETRY_DELAY_MS: 140,
        FEATURING_PATTERNS: ['featuring', 'feat', 'ft', 'f/', 'w/'],
        REMIX_PATTERNS: ['remix', 'rmx'],
        REMIX_PATTERNS_OPTIONAL: ['edit', 'mix', 'rework', 'version'],
        REMIX_BY_PATTERNS: ['remixed by', 'remix by', 'rmx by', 'reworked by', 'rework by', 'edited by', 'edit by', 'mixed by', 'mix by', 'version by'],
        ARTIST_SPLITTER_PATTERNS: ['vs', '&', '+', '/']
    };

    const state = {
        logMessages: [],
        hideTimeout: null,
        actionHistory: [],
        isCollapsed: false,
        removeFeatFromTitle: false,
        remixOptionalEnabled: false
    };

    function log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        state.logMessages.push({ timestamp, message, type });
        if (state.logMessages.length > CONFIG.MAX_LOG_MESSAGES) {
            state.logMessages = state.logMessages.slice(-CONFIG.MAX_LOG_MESSAGES);
        }
        updatePanelLog();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function escapeRegExp(str) {
        return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function setReactValue(element, value) {
        if (!element) return;
        try {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(element, value);
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.focus();
            element.blur();
        } catch (e) {
            log(`Error setting value: ${e.message}`, 'error');
        }
    }

    function updatePanelLog() {
        const logContainer = document.getElementById('log-container');
        if (!logContainer) return;
        const colors = { info: '#9aa0a6', success: '#28a745', warning: '#ffc107', error: '#dc3545' };
        logContainer.innerHTML = state.logMessages
            .slice(-CONFIG.MAX_LOG_MESSAGES)
            .map(entry => `<div style="color: ${colors[entry.type]}; margin: 2px 0;">[${entry.timestamp}] ${escapeHtml(entry.message)}</div>`)
            .join('');
        logContainer.scrollTop = logContainer.scrollHeight;
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

    function initializeState() {
        try {
            const storedFeat = localStorage.getItem(CONFIG.FEAT_REMOVE_KEY);
            if (storedFeat === '0' || storedFeat === '1') {
                state.removeFeatFromTitle = (storedFeat === '1');
            }
        } catch (e) { }
        try {
            const storedRemixOpt = localStorage.getItem(CONFIG.REMIX_OPTIONAL_KEY);
            if (storedRemixOpt === '0' || storedRemixOpt === '1') {
                state.remixOptionalEnabled = (storedRemixOpt === '1');
            }
        } catch (e) { }
    }

    function cleanupArtistName(str) {
        if (!str) return '';
        let s = String(str).trim();
        s = s.replace(/^[\s\(\[\-:\.]+/, '');
        s = s.replace(/[\s\-\:;,]+$/g, '');
        if ((s.startsWith('(') && s.endsWith(')')) || (s.startsWith('[') && s.endsWith(']'))) {
            s = s.slice(1, -1).trim();
        }
        return s;
    }

    function isAlphaToken(tok) {
        return /^[A-Za-z]+$/.test(tok);
    }

    function buildFeaturingPattern() {
        const alphaAlts = CONFIG.FEATURING_PATTERNS
            .filter(isAlphaToken)
            .map(t => escapeRegExp(t) + '\\.?');
        const nonAlphaAlts = CONFIG.FEATURING_PATTERNS
            .filter(t => !isAlphaToken(t))
            .map(t => escapeRegExp(t));
        const parts = [];
        if (alphaAlts.length) parts.push(`(?<!\\w)(?:${alphaAlts.join('|')})(?!\\w)`);
        if (nonAlphaAlts.length) parts.push(`(?:${nonAlphaAlts.join('|')})`);
        return parts.join('|');
    }

    function buildSplitterCaptureRegex(includeFeaturing = false) {
        const parts = [];
        if (includeFeaturing) parts.push(buildFeaturingPattern());
        for (const s of CONFIG.ARTIST_SPLITTER_PATTERNS) {
            if (isAlphaToken(s)) {
                parts.push(`(?<!\\w)(?:${escapeRegExp(s)}\\.?)(?!\\w)`);
            } else {
                parts.push(`(?:${escapeRegExp(s)})`);
            }
        }
        const pattern = parts.join('|');
        return new RegExp(`\\s*(${pattern})\\s*`, 'i');
    }

    function buildSplitterRegex() {
        const parts = CONFIG.ARTIST_SPLITTER_PATTERNS.map(s => {
            if (isAlphaToken(s)) {
                return `(?<!\\w)(?:${escapeRegExp(s)}\\.?)(?!\\w)`;
            }
            return `(?:${escapeRegExp(s)})`;
        });
        const pattern = parts.join('|');
        return new RegExp(`\\s*(?:${pattern})\\s*`, 'i');
    }

    function findRemoveButtonIn(container) {
        if (!container) return null;
        const selectors = ['button.editable_input_remove', 'button[aria-label="Remove"]', 'button[title="Remove"]'];
        for (const selector of selectors) {
            const button = container.querySelector(selector);
            if (button) return button;
        }
        const icon = container.querySelector('i.icon.icon-times, svg.icon-times');
        if (icon) return icon.closest('button') || icon;
        return null;
    }

    function findRemoveNear(node) {
        if (!node) return null;
        const row = node.closest('tr');
        if (!row) return null;
        const selectors = ['button.editable_input_remove', 'button[aria-label="Remove"]', 'i.icon.icon-times'];
        for (const selector of selectors) {
            const el = row.querySelector(selector);
            if (el) return el.closest('button') || el;
        }
        return null;
    }

    async function clickAddArtistButton(row) {
        return new Promise((resolve) => {
            const artistTd = row.querySelector('td.subform_track_artists');
            const addButton = artistTd?.querySelector('button.add-credit-button');
            if (!addButton) { resolve({ success: false }); return; }
            const before = Array.from(artistTd.querySelectorAll('input[data-type="artist-name"], input.credit-artist-name-input'));
            addButton.click();
            let attempts = 0;
            const maxAttempts = 40;
            const interval = setInterval(() => {
                attempts++;
                const inputs = Array.from(artistTd.querySelectorAll('input[data-type="artist-name"], input.credit-artist-name-input'));
                const newInput = inputs.find(input => !before.includes(input));
                if (newInput) {
                    clearInterval(interval);
                    const artistContainer = newInput.closest('li.editable_item') || newInput.closest('li') || newInput.closest('fieldset') || newInput.parentElement;
                    const removeButton = findRemoveButtonIn(artistContainer) || findRemoveNear(newInput);
                    setTimeout(() => resolve({ success: true, artistInput: newInput, artistContainer, removeButton }), 30);
                    return;
                }
                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    resolve({ success: false });
                }
            }, 100);
        });
    }

    async function createArtistInputs(row, count) {
        const artistTd = row.querySelector('td.subform_track_artists');
        const addButton = artistTd?.querySelector('button.add-credit-button');
        if (!addButton || count <= 0) return [];
        const before = Array.from(artistTd.querySelectorAll('input[data-type="artist-name"], input.credit-artist-name-input'));
        const beforeCount = before.length;
        for (let i = 0; i < count; i++) try { addButton.click(); } catch (e) { }
        const timeout = 1200;
        const pollInterval = 40;
        const start = Date.now();
        let nowInputs = Array.from(artistTd.querySelectorAll('input[data-type="artist-name"], input.credit-artist-name-input'));
        while (nowInputs.length < beforeCount + count && (Date.now() - start) < timeout) {
            await new Promise(r => setTimeout(r, pollInterval));
            nowInputs = Array.from(artistTd.querySelectorAll('input[data-type="artist-name"], input.credit-artist-name-input'));
        }
        return nowInputs.slice(beforeCount).map(inp => {
            const container = inp.closest('li.editable_item') || inp.closest('li') || inp.closest('fieldset') || inp.parentElement;
            const removeButton = findRemoveButtonIn(container) || findRemoveNear(inp);
            return { artistInput: inp, artistContainer: container, removeButton };
        });
    }

    async function clickAddCreditButton(row) {
        return new Promise((resolve) => {
            const titleTd = row.querySelector('td.subform_track_title');
            if (!titleTd) { log('Title TD not found for track.', 'error'); resolve(false); return; }
            let creditsEditableList = Array.from(titleTd.querySelectorAll('.editable_list')).find(list => {
                const span = list.querySelector('span:not([data-reactid*="track-number"])');
                return span && span.textContent && span.textContent.includes('Credits');
            });
            if (!creditsEditableList) creditsEditableList = Array.from(titleTd.querySelectorAll('.editable_list')).find(list => list.querySelector('button.add-credit-button'));
            let addButton = creditsEditableList?.querySelector('button.add-credit-button');
            if (!addButton) addButton = titleTd.querySelector('button.add-credit-button') || row.querySelector('button.add-credit-button');
            if (!addButton) { log('Could not find Credits editable list.', 'error'); resolve(false); return; }
            const artistInputsInRow = Array.from(row.querySelectorAll('input.credit-artist-name-input'));
            let beforeMax = -1;
            artistInputsInRow.forEach(input => {
                const id = input.id || '';
                const match = id.match(/artist-name-credits-input-(\d+)/);
                if (match) beforeMax = Math.max(beforeMax, parseInt(match[1], 10));
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
                    if (match) newMax = Math.max(newMax, parseInt(match[1], 10));
                });
                if (newMax > beforeMax) {
                    const roleSel = `#add-role-input-${newMax}`;
                    const artistSel = `#artist-name-credits-input-${newMax}`;
                    let roleInput = row.querySelector(roleSel);
                    let artistInput = row.querySelector(artistSel);
                    if (!roleInput || !artistInput) {
                        const creditItemsList = titleTd.querySelector('ul.editable_items_list') || row.querySelector('ul.editable_items_list');
                        if (creditItemsList) {
                            const items = Array.from(creditItemsList.querySelectorAll('li.editable_item, li, fieldset'));
                            const candidate = items[items.length - 1];
                            if (candidate) {
                                const li = candidate.closest('li.editable_item') || candidate.closest('li') || candidate;
                                roleInput = roleInput || li.querySelector('input.add-credit-role-input');
                                artistInput = artistInput || li.querySelector('input.credit-artist-name-input');
                                const removeButton = li.querySelector('button.editable_input_remove') || findRemoveNear(li);
                                clearInterval(interval);
                                setTimeout(() => resolve({ roleInput, artistInput, newCreditItem: li, removeButton }), 20);
                                return;
                            }
                        }
                    }
                    if (!roleInput || !artistInput) {
                        const allRoles = Array.from(document.querySelectorAll('input.add-credit-role-input'));
                        const allArtists = Array.from(document.querySelectorAll('input.credit-artist-name-input'));
                        if (allRoles.length && allArtists.length) {
                            roleInput = allRoles[allRoles.length - 1];
                            artistInput = allArtists[allArtists.length - 1];
                        }
                    }
                    const newCreditItem = (roleInput && roleInput.closest('li.editable_item')) || (artistInput && artistInput.closest('li.editable_item')) || (roleInput && roleInput.closest('li')) || (artistInput && artistInput.closest('li')) || null;
                    const removeButton = newCreditItem ? (newCreditItem.querySelector('button.editable_input_remove') || findRemoveNear(newCreditItem)) : (titleTd.querySelector('button.editable_input_remove') || findRemoveNear(row));
                    clearInterval(interval);
                    setTimeout(() => resolve({ roleInput, artistInput, newCreditItem, removeButton }), 20);
                    return;
                }
                const creditItemsList = titleTd.querySelector('ul.editable_items_list') || row.querySelector('ul.editable_items_list');
                if (creditItemsList) {
                    const items = Array.from(creditItemsList.querySelectorAll('li.editable_item, li, fieldset'));
                    if (items.length > 0) {
                        const last = items[items.length - 1];
                        const li = last.closest('li.editable_item') || last.closest('li') || last;
                        const roleInput = li.querySelector('input.add-credit-role-input[aria-label="Add Artist Role"], input.add-credit-role-input');
                        const artistInput = li.querySelector('input.credit-artist-name-input[aria-label="Add Artist"], input.credit-artist-name-input');
                        if (roleInput && artistInput) {
                            clearInterval(interval);
                            const removeButton = li.querySelector('button.editable_input_remove') || findRemoveNear(li);
                            setTimeout(() => resolve({ roleInput, artistInput, newCreditItem: li, removeButton }), 20);
                            return;
                        }
                    }
                }
                const allRoles = Array.from(document.querySelectorAll('input.add-credit-role-input'));
                const allArtists = Array.from(document.querySelectorAll('input.credit-artist-name-input'));
                if (allRoles.length > 0 && allArtists.length > 0) {
                    const roleInput = allRoles[allRoles.length - 1];
                    const artistInput = allArtists[allArtists.length - 1];
                    const newCreditItem = (roleInput && roleInput.closest('li.editable_item')) || (artistInput && artistInput.closest('li.editable_item')) || null;
                    clearInterval(interval);
                    const removeButton = newCreditItem ? (newCreditItem.querySelector('button.editable_input_remove') || findRemoveNear(newCreditItem)) : findRemoveNear(row);
                    setTimeout(() => resolve({ roleInput, artistInput, newCreditItem, removeButton }), 20);
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

    async function createCreditItems(row, count) {
        const titleTd = row.querySelector('td.subform_track_title');
        if (!titleTd || count <= 0) return [];
        let addButton = titleTd.querySelector('button.add-credit-button') || row.querySelector('button.add-credit-button');
        if (!addButton) {
            const editableLists = Array.from(titleTd.querySelectorAll('.editable_list'));
            for (const list of editableLists) {
                const btn = list.querySelector('button.add-credit-button');
                if (btn) { addButton = btn; break; }
            }
        }
        if (!addButton) return [];
        const beforeRoles = Array.from(row.querySelectorAll('input.add-credit-role-input'));
        const beforeArtists = Array.from(row.querySelectorAll('input.credit-artist-name-input'));
        const beforeCount = Math.max(beforeRoles.length, beforeArtists.length);
        for (let i = 0; i < count; i++) try { addButton.click(); } catch (e) { }
        const timeout = 1200;
        const pollInterval = 40;
        const start = Date.now();
        let nowRoles = Array.from(row.querySelectorAll('input.add-credit-role-input'));
        let nowArtists = Array.from(row.querySelectorAll('input.credit-artist-name-input'));
        while ((Math.max(nowRoles.length, nowArtists.length) < beforeCount + count) && (Date.now() - start) < timeout) {
            await new Promise(r => setTimeout(r, pollInterval));
            nowRoles = Array.from(row.querySelectorAll('input.add-credit-role-input'));
            nowArtists = Array.from(row.querySelectorAll('input.credit-artist-name-input'));
        }
        const result = [];
        for (let i = 0; i < count; i++) {
            const role = nowRoles[beforeCount + i] || null;
            const artist = nowArtists[beforeCount + i] || null;
            let container = null;
            if (artist) container = artist.closest('li.editable_item') || artist.closest('li') || artist.closest('fieldset');
            if (!container && role) container = role.closest('li.editable_item') || role.closest('li') || role.closest('fieldset');
            const removeButton = container ? (findRemoveButtonIn(container) || findRemoveNear(container)) : null;
            result.push({ roleInput: role, artistInput: artist, newCreditItem: container, removeButton });
        }
        return result;
    }

    async function scanAndExtract() {
        setInfoSingleLine('Processing...');
        await new Promise(r => setTimeout(r, 0));
        log('Starting duration scan...', 'info');
        let trackRows = document.querySelectorAll('tr.track_row');
        if (trackRows.length === 0) trackRows = document.querySelectorAll('tr[class*="track"]');
        if (trackRows.length === 0) {
            log('No track rows found', 'error');
            setInfoSingleLine('No tracks found', false);
            return;
        }
        let processed = 0;
        const changes = [];
        trackRows.forEach((row, index) => {
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
                log(`Track ${index + 1}: Extracted duration "${duration}" and updated title to "${newTitle}"`, 'success');
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
        await new Promise(r => setTimeout(r, 0));
        log('Starting artist extraction...', 'info');
        let trackRows = document.querySelectorAll('tr.track_row');
        if (trackRows.length === 0) trackRows = document.querySelectorAll('tr[class*="track"]');
        let processed = 0;
        const changes = [];
        for (let i = 0; i < trackRows.length; i++) {
            const row = trackRows[i];
            const titleInput = row.querySelector('input[data-type="track-title"], input[id*="track-title"]');
            if (!titleInput) continue;
            const title = titleInput.value.trim();

            let match = title.match(/^(.+?)\s+[-–—]\s+(.+)$/);
            if (!match) match = title.match(/^(.+?)\s*[-—]\s*(.+)$/);

            if (!match) continue;
            const artistText = match[1].trim();
            const newTitle = match[2].trim();
            const existingArtistInput = row.querySelector('td.subform_track_artists input[data-type="artist-name"]');
            if (existingArtistInput && existingArtistInput.value.trim()) continue;
            const splitterWithCapture = buildSplitterCaptureRegex(true);
            const rawTokens = artistText.split(splitterWithCapture).map(s => s.trim()).filter(s => s !== '');
            let artistParts = [];
            let separators = [];
            if (rawTokens.length === 1) {
                artistParts = artistText.split(buildSplitterRegex()).map(p => cleanupArtistName(p)).filter(Boolean);
                separators = [];
            } else {
                for (let t = 0; t < rawTokens.length; t++) {
                    if (t % 2 === 0) artistParts.push(cleanupArtistName(rawTokens[t]));
                    else separators.push(rawTokens[t]);
                }
            }
            if (artistParts.length === 0) continue;
            const created = await createArtistInputs(row, artistParts.length);
            if (created.length < artistParts.length) {
                for (let m = created.length; m < artistParts.length; m++) {
                    const res = await clickAddArtistButton(row);
                    if (res.success) created.push({ artistInput: res.artistInput, artistContainer: res.artistContainer, removeButton: res.removeButton });
                }
            }
            let joinInputs = Array.from(row.querySelectorAll('input[placeholder="Join"], input[aria-label="Join"]'));
            for (let idx = 0; idx < artistParts.length; idx++) {
                const part = artistParts[idx] || '';
                const added = created[idx];
                if (!added) { log(`Track ${i + 1}: missing input for "${part}"`, 'warning'); continue; }
                const artistInput = added.artistInput;
                const artistContainer = added.artistContainer;
                const removeButton = added.removeButton;
                const oldArtistValue = artistInput ? (artistInput.value || '').trim() : '';
                setReactValue(artistInput, part);
                if (idx < separators.length) {
                    const sepRaw = separators[idx] || '';
                    const joinValue = sepRaw.trim();
                    let joinInput = joinInputs[idx] || getJoinInputForArtistRow(row, artistInput, artistContainer, idx);
                    if (joinInput) setReactValue(joinInput, joinValue);
                }
                changes.push({
                    titleInput,
                    oldTitle: title,
                    newTitle,
                    artistInput,
                    artistContainer,
                    removeButton,
                    oldArtist: oldArtistValue,
                    newArtist: part
                });
                processed++;
                log(`Track ${i + 1}: Extracted main artist "${part}"`, 'success');
            }
            setReactValue(titleInput, newTitle);
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
        await new Promise(r => setTimeout(r, 0));
        log('Starting featuring artist extraction...', 'info');
        let trackRows = document.querySelectorAll('tr.track_row');
        if (trackRows.length === 0) trackRows = document.querySelectorAll('tr[class*="track"]');
        let processed = 0;
        const changes = [];
        const featPattern = buildFeaturingPattern();
        const splitterRegex = buildSplitterRegex();
        const containerRegex = /([\(\[\uFF08\uFF3B]\s*(.*?)\s*[\)\]\uFF09\uFF3D])/g;

        const remixByPatternWords = CONFIG.REMIX_BY_PATTERNS.map(p => escapeRegExp(p)).join('|');
        const remixByRegex = new RegExp(`\\b(?:${remixByPatternWords})\\b`, 'i');

        for (let i = 0; i < trackRows.length; i++) {
            const row = trackRows[i];
            const titleInput = row.querySelector('input[data-type="track-title"], input[id*="track-title"]');
            if (!titleInput) continue;
            let originalTitle = titleInput.value.trim();
            let title = originalTitle;
            let found = false;
            let matchedFeatTextForRemoval = '';
            let match;

            while ((match = containerRegex.exec(title)) !== null) {
                const fullBracketedText = match[1];
                const innerText = match[2];

                const featTokenRegex = new RegExp(`(?:${featPattern})\\b`, 'i');
                const featTokenMatch = featTokenRegex.exec(innerText);
                if (!featTokenMatch) continue;

                const featTokenIndex = featTokenMatch.index;
                const rawStart = featTokenIndex + featTokenMatch[0].length;
                let raw = innerText.substring(rawStart).trim();
                if (!raw) continue;

                found = true;
                let adjustedFullBracketReplacement = null;

                const remByBeforeIndex = innerText.search(remixByRegex);
                if (remByBeforeIndex !== -1 && remByBeforeIndex < featTokenIndex) {
                    const remCaptureRegex = new RegExp(`(?:${remixByPatternWords})\\s+(.+?)(?=(?:${featPattern})\\b|$)`, 'i');
                    const remCapture = remCaptureRegex.exec(innerText);
                    if (remCapture && remCapture[0]) {
                        const remPhrase = remCapture[0].trim();
                        adjustedFullBracketReplacement = fullBracketedText.replace(innerText, remPhrase);
                    }
                } else {
                    const remIndexInRaw = raw.search(remixByRegex);
                    if (remIndexInRaw !== -1) {
                        const truncated = raw.substring(0, remIndexInRaw).trim();
                        if (truncated) {
                            raw = truncated;
                            const featRemoveRegex = new RegExp(`(?:${featPattern})\\s*${escapeRegExp(truncated)}`, 'i');
                            let newInner = innerText.replace(featRemoveRegex, '').trim();
                            newInner = newInner.replace(/^[,;:\-\s]+/, '').replace(/[,;:\-\s]+$/, '').replace(/\s{2,}/g, ' ').trim();
                            adjustedFullBracketReplacement = fullBracketedText.replace(innerText, newInner);
                        }
                    }
                }

                if (!raw) {
                    if (adjustedFullBracketReplacement !== null) {
                        const idx = title.indexOf(fullBracketedText);
                        if (idx !== -1) {
                            const newTitleCandidate = title.slice(0, idx) + adjustedFullBracketReplacement + title.slice(idx + fullBracketedText.length);
                            title = newTitleCandidate.replace(/\s{2,}/g, ' ').trim();
                        }
                    }
                    break;
                }

                const parts = raw.split(splitterRegex).map(p => cleanupArtistName(p)).filter(Boolean);
                if (parts.length === 0) {
                    if (adjustedFullBracketReplacement !== null) {
                        const idx = title.indexOf(fullBracketedText);
                        if (idx !== -1) {
                            const newTitleCandidate = title.slice(0, idx) + adjustedFullBracketReplacement + title.slice(idx + fullBracketedText.length);
                            title = newTitleCandidate.replace(/\s{2,}/g, ' ').trim();
                        }
                    }
                    break;
                }

                const createdCredits = await createCreditItems(row, parts.length);
                if (createdCredits.length < parts.length) {
                    for (let k = createdCredits.length; k < parts.length; k++) {
                        const res = await clickAddCreditButton(row);
                        if (res) createdCredits.push({ roleInput: res.roleInput, artistInput: res.artistInput, newCreditItem: res.newCreditItem, removeButton: res.removeButton });
                    }
                }
                for (let k = 0; k < parts.length; k++) {
                    const part = parts[k];
                    const credit = createdCredits[k] || (await clickAddCreditButton(row)) || {};
                    const roleInput = credit.roleInput || null;
                    const artistInput = credit.artistInput || null;
                    const newCreditItem = credit.newCreditItem || null;
                    const removeButton = credit.removeButton || null;
                    const oldArtistValue = artistInput ? (artistInput.value || '').trim() : '';
                    if (roleInput) setReactValue(roleInput, 'Featuring');
                    if (artistInput) setReactValue(artistInput, part);
                    changes.push({
                        titleInput,
                        oldTitle: originalTitle,
                        newTitle: state.removeFeatFromTitle ? title : originalTitle,
                        roleInput,
                        artistInput,
                        role: 'Featuring',
                        artist: part,
                        oldArtist: oldArtistValue,
                        creditItem: newCreditItem,
                        removeButton
                    });
                    processed++;
                    log(`Track ${i + 1}: Extracted featuring artist "${part}"`, 'success');
                }

                if (adjustedFullBracketReplacement !== null) {
                    const idx = title.indexOf(fullBracketedText);
                    if (idx !== -1) {
                        const newTitleCandidate = title.slice(0, idx) + adjustedFullBracketReplacement + title.slice(idx + fullBracketedText.length);
                        title = newTitleCandidate.replace(/\s{2,}/g, ' ').trim();
                    }
                } else {
                    matchedFeatTextForRemoval = fullBracketedText;
                }
                break;
            }

            if (!found) {
                const outsideRegex = new RegExp(`(?:${featPattern})\\s+([^\\(\\)\\[\\]\\-–—,;]+)`, 'i');
                const outsideFeat = title.match(outsideRegex);
                if (outsideFeat) {
                    found = true;
                    let raw = outsideFeat[1].trim();
                    let truncated = raw;
                    const remIndex = raw.search(remixByRegex);
                    if (remIndex !== -1) {
                        truncated = raw.substring(0, remIndex).trim();
                    }
                    if (!truncated) {
                        continue;
                    }
                    const parts = truncated.split(splitterRegex).map(p => cleanupArtistName(p)).filter(Boolean);
                    const createdCredits = await createCreditItems(row, parts.length);
                    if (createdCredits.length < parts.length) {
                        for (let k = createdCredits.length; k < parts.length; k++) {
                            const res = await clickAddCreditButton(row);
                            if (res) createdCredits.push({ roleInput: res.roleInput, artistInput: res.artistInput, newCreditItem: res.newCreditItem, removeButton: res.removeButton });
                        }
                    }
                    for (let k = 0; k < parts.length; k++) {
                        const part = parts[k];
                        const credit = createdCredits[k] || (await clickAddCreditButton(row)) || {};
                        const roleInput = credit.roleInput || null;
                        const artistInput = credit.artistInput || null;
                        const newCreditItem = credit.newCreditItem || null;
                        const removeButton = credit.removeButton || null;
                        const oldArtistValue = artistInput ? (artistInput.value || '').trim() : '';
                        if (roleInput) setReactValue(roleInput, 'Featuring');
                        if (artistInput) setReactValue(artistInput, part);
                        changes.push({
                            titleInput,
                            oldTitle: originalTitle,
                            newTitle: state.removeFeatFromTitle ? title : originalTitle,
                            roleInput,
                            artistInput,
                            role: 'Featuring',
                            artist: part,
                            oldArtist: oldArtistValue,
                            creditItem: newCreditItem,
                            removeButton
                        });
                        processed++;
                        log(`Track ${i + 1}: Extracted featuring artist "${part}"`, 'success');
                    }

                    const fullMatch = outsideFeat[0];
                    if (truncated && fullMatch) {
                        const idx = fullMatch.toLowerCase().indexOf(truncated.toLowerCase());
                        if (idx !== -1) {
                            matchedFeatTextForRemoval = fullMatch.substring(0, idx + truncated.length);
                        } else {
                            matchedFeatTextForRemoval = fullMatch;
                        }
                    } else {
                        matchedFeatTextForRemoval = fullMatch;
                    }
                }
            }

            if (found && state.removeFeatFromTitle) {
                if (matchedFeatTextForRemoval) {
                    const removalRegex = new RegExp(`\\s*${escapeRegExp(matchedFeatTextForRemoval)}\\s*$|\\s*${escapeRegExp(matchedFeatTextForRemoval)}`, 'i');
                    let newTitleCandidate = title.replace(removalRegex, (m, suffixMatch) => suffixMatch ? '' : ' ');
                    newTitleCandidate = newTitleCandidate
                        .replace(/\s{2,}/g, ' ')
                        .replace(/\s*([,;:])\s*/g, '$1 ')
                        .replace(/\s*([—\-])\s*/g, ' $1 ')
                        .replace(/\s*([\)\]])\s*/g, '$1')
                        .replace(/([\(\[])\s*/g, '$1')
                        .replace(/[\(\[]\s*[\)\]]/g, '')
                        .trim();
                    newTitleCandidate = newTitleCandidate.replace(/\s+([.,!?;:—\-])/g, '$1');
                    setReactValue(titleInput, newTitleCandidate);
                }
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

    function getActiveRemixTokens() {
        if (state.remixOptionalEnabled) {
            return CONFIG.REMIX_PATTERNS.concat(CONFIG.REMIX_PATTERNS_OPTIONAL);
        }
        return CONFIG.REMIX_PATTERNS.slice();
    }

    function updateRemixToggleUI() {
        const toggle = document.getElementById('toggle-remix-optional');
        if (!toggle) return;
        toggle.textContent = state.remixOptionalEnabled ? '✓' : '';
        toggle.title = `Optional Keywords: ${CONFIG.REMIX_PATTERNS_OPTIONAL.join(', ')}`;
        updateRemixButtonTitle();
    }

    function updateRemixButtonTitle() {
        const remixBtn = document.getElementById('extract-remixers');
        if (!remixBtn) return;
        let remixKeywords = `Keywords: ${CONFIG.REMIX_PATTERNS.join(', ')}\nKeywords: ${CONFIG.REMIX_BY_PATTERNS.join(', ')}`;
        if (state.remixOptionalEnabled) {
            remixKeywords += `\nOptional Keywords: ${CONFIG.REMIX_PATTERNS_OPTIONAL.join(', ')}`;
        }
        remixBtn.title = remixKeywords;
    }

    function hasSplitterToken(str) {
        if (!str) return false;
        for (const s of CONFIG.ARTIST_SPLITTER_PATTERNS) {
            const re = new RegExp(escapeRegExp(s), 'i');
            if (re.test(str)) return true;
        }
        return false;
    }

    function lastWordsCandidate(str) {
        if (!str) return '';
        const words = str.trim().split(/\s+/);
        if (words.length === 0) return '';
        if (words.length === 1) return words[0];
        return words.slice(-2).join(' ');
    }

    async function extractRemixers() {
        setInfoSingleLine('Processing...');
        await new Promise(r => setTimeout(r, 0));
        log('Starting remixer extraction...', 'info');

        const remixPatternWords = getActiveRemixTokens().map(p => escapeRegExp(p)).join('|');
        const remixByPatternWords = CONFIG.REMIX_BY_PATTERNS.map(p => escapeRegExp(p)).join('|');
        const splitterRegex = buildSplitterRegex();
        const remixAnyPattern = [remixPatternWords, remixByPatternWords].filter(Boolean).join('|');
        const remixAnyRegex = remixAnyPattern ? new RegExp(`\\b(?:${remixAnyPattern})\\b`, 'i') : null;

        let trackRows = document.querySelectorAll('tr.track_row');
        if (trackRows.length === 0) trackRows = document.querySelectorAll('tr[class*="track"]');

        let processed = 0;
        const changes = [];

        for (let i = 0; i < trackRows.length; i++) {
            const row = trackRows[i];
            const titleInput = row.querySelector('input[data-type="track-title"], input[id*="track-title"]');
            if (!titleInput) continue;
            const title = titleInput.value.trim();

            const containerRegex = /[\(\[]([^\])]+)[\)\]]/g;
            let matchInContainer;
            let handled = false;

            while ((matchInContainer = containerRegex.exec(title)) !== null) {
                const inner = matchInContainer[1].trim();

                if (remixByPatternWords) {
                    const remByRegex = new RegExp(`(?:${remixByPatternWords})\\s+(.+)$`, 'i');
                    const remByMatch = inner.match(remByRegex);
                    if (remByMatch && remByMatch[1]) {
                        let raw = remByMatch[1].trim();

                        const featTokens = CONFIG.FEATURING_PATTERNS.map(escapeRegExp).join('|');
                        const featRegex = new RegExp(`(?:${featTokens})`, 'i');
                        const featMatch = featRegex.exec(raw);

                        let remixes = [];
                        if (featMatch) {
                            const featIndex = featMatch.index;
                            const beforeFeat = raw.substring(0, featIndex).trim();
                            if (hasSplitterToken(beforeFeat)) {
                                remixes = beforeFeat.split(splitterRegex).map(p => cleanupArtistName(p)).filter(Boolean);
                            } else {
                                const first = cleanupArtistName(beforeFeat);
                                if (first) remixes = [first];
                            }
                        } else {
                            remixes = raw.split(splitterRegex).map(p => cleanupArtistName(p)).filter(Boolean);
                        }

                        if (remixes.length === 0) break;

                        const createdCredits = await createCreditItems(row, remixes.length);
                        if (createdCredits.length < remixes.length) {
                            for (let k = createdCredits.length; k < remixes.length; k++) {
                                const res = await clickAddCreditButton(row);
                                if (res) createdCredits.push({ roleInput: res.roleInput, artistInput: res.artistInput, newCreditItem: res.newCreditItem, removeButton: res.removeButton });
                            }
                        }

                        for (let k = 0; k < remixes.length; k++) {
                            const part = remixes[k];
                            const credit = createdCredits[k] || (await clickAddCreditButton(row)) || {};
                            const roleInput = credit.roleInput || null;
                            const artistInput = credit.artistInput || null;
                            const newCreditItem = credit.newCreditItem || null;
                            const removeButton = credit.removeButton || null;
                            const oldArtistValue = artistInput ? (artistInput.value || '').trim() : '';
                            if (roleInput) setReactValue(roleInput, 'Remix');
                            if (artistInput) setReactValue(artistInput, part);
                            changes.push({
                                titleInput,
                                oldTitle: title,
                                newTitle: title,
                                roleInput,
                                artistInput,
                                role: 'Remix',
                                artist: part,
                                oldArtist: oldArtistValue,
                                creditItem: newCreditItem,
                                removeButton
                            });
                            processed++;
                            log(`Track ${i + 1}: Extracted remixer "${part}" (Remix)`, 'success');
                        }

                        handled = true;
                        break;
                    }
                }

                if (remixAnyRegex && remixAnyRegex.test(inner)) {
                    const remMatch = inner.match(remixAnyRegex);
                    if (!remMatch) continue;
                    const remIndex = remMatch.index;
                    const beforeRemix = inner.substring(0, remIndex).trim();
                    if (!beforeRemix) continue;

                    const featTokens = CONFIG.FEATURING_PATTERNS.map(escapeRegExp).join('|');
                    const featRegexGlobal = new RegExp(`(?:${featTokens})`, 'ig');
                    let lastFeatMatch = null;
                    let fm;
                    while ((fm = featRegexGlobal.exec(beforeRemix)) !== null) { lastFeatMatch = fm; }

                    let remixes = [];

                    if (lastFeatMatch) {
                        const lastFeatIndex = lastFeatMatch.index;
                        const featToken = lastFeatMatch[0];
                        const afterFeat = beforeRemix.substring(lastFeatIndex + featToken.length).trim();
                        if (afterFeat) {
                            if (hasSplitterToken(afterFeat)) {
                                const parts = afterFeat.split(splitterRegex).map(p => cleanupArtistName(p)).filter(Boolean);
                                if (parts.length) remixes = [parts[parts.length - 1]];
                            } else {
                                const cand = lastWordsCandidate(afterFeat);
                                if (cand) remixes = [cleanupArtistName(cand)];
                            }
                        } else {
                            const beforeFeatOnly = beforeRemix.substring(0, lastFeatIndex).trim();
                            if (hasSplitterToken(beforeFeatOnly)) {
                                const parts = beforeFeatOnly.split(splitterRegex).map(p => cleanupArtistName(p)).filter(Boolean);
                                if (parts.length) remixes = [parts[0]];
                            } else {
                                const lastCand = lastWordsCandidate(beforeFeatOnly);
                                if (lastCand) remixes = [cleanupArtistName(lastCand)];
                            }
                        }
                    } else {
                        if (hasSplitterToken(beforeRemix)) {
                            remixes = beforeRemix.split(splitterRegex).map(p => cleanupArtistName(p)).filter(Boolean);
                        } else {
                            remixes = [cleanupArtistName(beforeRemix)];
                        }
                    }

                    if (remixes.length === 0) continue;

                    const createdCredits = await createCreditItems(row, remixes.length);
                    if (createdCredits.length < remixes.length) {
                        for (let k = createdCredits.length; k < remixes.length; k++) {
                            const res = await clickAddCreditButton(row);
                            if (res) createdCredits.push({ roleInput: res.roleInput, artistInput: res.artistInput, newCreditItem: res.newCreditItem, removeButton: res.removeButton });
                        }
                    }

                    for (let k = 0; k < remixes.length; k++) {
                        const part = remixes[k];
                        const credit = createdCredits[k] || (await clickAddCreditButton(row)) || {};
                        const roleInput = credit.roleInput || null;
                        const artistInput = credit.artistInput || null;
                        const newCreditItem = credit.newCreditItem || null;
                        const removeButton = credit.removeButton || null;
                        const oldArtistValue = artistInput ? (artistInput.value || '').trim() : '';
                        if (roleInput) setReactValue(roleInput, 'Remix');
                        if (artistInput) setReactValue(artistInput, part);
                        changes.push({
                            titleInput,
                            oldTitle: title,
                            newTitle: title,
                            roleInput,
                            artistInput,
                            role: 'Remix',
                            artist: part,
                            oldArtist: oldArtistValue,
                            creditItem: newCreditItem,
                            removeButton
                        });
                        processed++;
                        log(`Track ${i + 1}: Extracted remixer "${part}" (Remix)`, 'success');
                    }

                    handled = true;
                    break;
                }
            }

            if (handled) continue;

            if (remixByPatternWords) {
                const remByOutRegex = new RegExp(`(?:${remixByPatternWords})\\s+([^\\(\\)\\[\\]\\-–—,;]+)`, 'i');
                const remByOutMatch = title.match(remByOutRegex);
                if (remByOutMatch && remByOutMatch[1]) {
                    let raw = remByOutMatch[1].trim();
                    const featTokens = CONFIG.FEATURING_PATTERNS.map(escapeRegExp).join('|');
                    const featRegex = new RegExp(`(?:${featTokens})`, 'i');
                    const featMatch = featRegex.exec(raw);

                    let remixes = [];
                    if (featMatch) {
                        const featIndex = featMatch.index;
                        const beforeFeat = raw.substring(0, featIndex).trim();
                        if (hasSplitterToken(beforeFeat)) remixes = beforeFeat.split(splitterRegex).map(p => cleanupArtistName(p)).filter(Boolean);
                        else {
                            const first = cleanupArtistName(beforeFeat);
                            if (first) remixes = [first];
                        }
                    } else {
                        remixes = raw.split(splitterRegex).map(p => cleanupArtistName(p)).filter(Boolean);
                    }

                    if (remixes.length === 0) continue;
                    const createdCredits = await createCreditItems(row, remixes.length);
                    if (createdCredits.length < remixes.length) {
                        for (let k = createdCredits.length; k < remixes.length; k++) {
                            const res = await clickAddCreditButton(row);
                            if (res) createdCredits.push({ roleInput: res.roleInput, artistInput: res.artistInput, newCreditItem: res.newCreditItem, removeButton: res.removeButton });
                        }
                    }
                    for (let k = 0; k < remixes.length; k++) {
                        const part = remixes[k];
                        const credit = createdCredits[k] || (await clickAddCreditButton(row)) || {};
                        const roleInput = credit.roleInput || null;
                        const artistInput = credit.artistInput || null;
                        const newCreditItem = credit.newCreditItem || null;
                        const removeButton = credit.removeButton || null;
                        const oldArtistValue = artistInput ? (artistInput.value || '').trim() : '';
                        if (roleInput) setReactValue(roleInput, 'Remix');
                        if (artistInput) setReactValue(artistInput, part);
                        changes.push({
                            titleInput,
                            oldTitle: title,
                            newTitle: title,
                            roleInput,
                            artistInput,
                            role: 'Remix',
                            artist: part,
                            oldArtist: oldArtistValue,
                            creditItem: newCreditItem,
                            removeButton
                        });
                        processed++;
                        log(`Track ${i + 1}: Extracted remixer "${part}" (Remix)`, 'success');
                    }
                    continue;
                }
            }

            if (remixAnyRegex) {
                const remEndRegex = new RegExp(`([^\\(\\)\\[\\]\\-–—,;]+?)\\s+(?:${remixPatternWords})\\b\\s*$`, 'i');
                const remEndMatch = title.match(remEndRegex);
                if (remEndMatch && remEndMatch[1]) {
                    let raw = remEndMatch[1].trim();
                    const featTokens = CONFIG.FEATURING_PATTERNS.map(escapeRegExp).join('|');
                    const featRegex = new RegExp(`(?:${featTokens})`, 'i');
                    const featMatch = featRegex.exec(raw);

                    let remixes = [];
                    if (featMatch) {
                        const featIndex = featMatch.index;
                        const afterFeat = raw.substring(featIndex + featMatch[0].length).trim();
                        if (afterFeat) {
                            if (hasSplitterToken(afterFeat)) {
                                const parts = afterFeat.split(splitterRegex).map(p => cleanupArtistName(p)).filter(Boolean);
                                const last = parts.length ? parts[parts.length - 1] : cleanupArtistName(afterFeat);
                                if (last) remixes = [last];
                            } else {
                                const cand = lastWordsCandidate(afterFeat);
                                if (cand) remixes = [cleanupArtistName(cand)];
                            }
                        }
                    } else {
                        remixes = raw.split(splitterRegex).map(p => cleanupArtistName(p)).filter(Boolean);
                    }

                    if (remixes.length === 0) continue;
                    const createdCredits = await createCreditItems(row, remixes.length);
                    if (createdCredits.length < remixes.length) {
                        for (let k = createdCredits.length; k < remixes.length; k++) {
                            const res = await clickAddCreditButton(row);
                            if (res) createdCredits.push({ roleInput: res.roleInput, artistInput: res.artistInput, newCreditItem: res.newCreditItem, removeButton: res.removeButton });
                        }
                    }
                    for (let k = 0; k < remixes.length; k++) {
                        const part = remixes[k];
                        const credit = createdCredits[k] || (await clickAddCreditButton(row)) || {};
                        const roleInput = credit.roleInput || null;
                        const artistInput = credit.artistInput || null;
                        const newCreditItem = credit.newCreditItem || null;
                        const removeButton = credit.removeButton || null;
                        const oldArtistValue = artistInput ? (artistInput.value || '').trim() : '';
                        if (roleInput) setReactValue(roleInput, 'Remix');
                        if (artistInput) setReactValue(artistInput, part);
                        changes.push({
                            titleInput,
                            oldTitle: title,
                            newTitle: title,
                            roleInput,
                            artistInput,
                            role: 'Remix',
                            artist: part,
                            oldArtist: oldArtistValue,
                            creditItem: newCreditItem,
                            removeButton
                        });
                        processed++;
                        log(`Track ${i + 1}: Extracted remixer "${part}" (Remix)`, 'success');
                    }
                    continue;
                }
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

    async function tryClickAndWait(removeEl, targetNode, attempts = CONFIG.RETRY_ATTEMPTS, delayMs = CONFIG.RETRY_DELAY_MS) {
        if (!removeEl) return false;
        for (let i = 0; i < attempts; i++) {
            try { dispatchMouseClick(removeEl); } catch (e) { log(`Error clicking remove button: ${e.message}`, 'warning'); }
            await new Promise(resolve => setTimeout(resolve, delayMs));
            if (!targetNode || !targetNode.isConnected) return true;
        }
        return (!targetNode || !targetNode.isConnected);
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
            const li2 = artistInput.closest('li.editable_item') || artistInput.closest('li') || artistInput.closest('fieldset');
            if (li2 && li2.isConnected) {
                const rb = findRemoveButtonIn(li2);
                if (rb) {
                    const success = await tryClickAndWait(rb, li2);
                    if (success) return true;
                }
            }
        }
        const near = (artistInput && findRemoveNear(artistInput)) || (creditItem && findRemoveNear(creditItem));
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
        await new Promise(r => setTimeout(r, 0));
        const lastAction = state.actionHistory.pop();
        log(`Reverting: ${lastAction.type}`, 'info');
        if (lastAction.type === 'durations') {
            let restored = 0;
            for (const change of lastAction.changes) {
                if (change.titleInput) setReactValue(change.titleInput, change.oldTitle);
                if (change.durationInput) setReactValue(change.durationInput, change.oldDuration || '');
                restored++;
            }
            updateRevertButton();
            const plural = restored > 1 ? 's' : '';
            setInfoSingleLine(`Done! Reverted ${restored} duration${plural}`, true);
            log(`Done! Reverted ${restored} duration${plural}`, 'success');
            return;
        }
        if (lastAction.type === 'artists' || lastAction.type === 'featuring' || lastAction.type === 'remixers') {
            for (const change of lastAction.changes) {
                if (change.titleInput && change.oldTitle !== undefined) {
                    setReactValue(change.titleInput, change.oldTitle);
                }
            }
            const removeActions = [];
            for (const change of lastAction.changes) {
                const creditItem = change.creditItem || change.artistContainer || null;
                const artistInput = change.artistInput || null;
                const storedRemove = change.removeButton || null;
                let removeEl = null;
                let targetNode = creditItem || artistInput;
                if (creditItem) {
                    const li = (creditItem.tagName && creditItem.tagName.toLowerCase() === 'li') ?
                        creditItem :
                        (creditItem.closest ? (creditItem.closest('li.editable_item') || creditItem.closest('li')) : creditItem);
                    if (li) {
                        removeEl = findRemoveButtonIn(li);
                        targetNode = li;
                    }
                }
                if (!removeEl && storedRemove && storedRemove.isConnected) removeEl = storedRemove;
                if (!removeEl && artistInput && artistInput.isConnected) {
                    const li2 = artistInput.closest('li.editable_item') || artistInput.closest('li') || artistInput.closest('fieldset');
                    if (li2) removeEl = findRemoveButtonIn(li2);
                    if (!removeEl) removeEl = findRemoveNear(artistInput);
                }
                if (!removeEl && (creditItem || artistInput)) {
                    removeEl = (creditItem && findRemoveNear(creditItem)) || (artistInput && findRemoveNear(artistInput));
                }
                removeActions.push({ removeEl, targetNode, change });
            }
            for (const act of removeActions) {
                if (act.removeEl && act.removeEl.isConnected) {
                    try { dispatchMouseClick(act.removeEl); } catch (e) { }
                }
            }
            const timeout = 1200;
            const pollInterval = 60;
            const start = Date.now();
            let unresolved = removeActions.filter(a => a.targetNode && a.targetNode.isConnected);
            while (unresolved.length > 0 && (Date.now() - start) < timeout) {
                await new Promise(r => setTimeout(r, pollInterval));
                unresolved = removeActions.filter(a => a.targetNode && a.targetNode.isConnected);
            }
            let removed = 0;
            let failed = 0;
            for (const act of removeActions) {
                const change = act.change;
                if (!act.targetNode || !act.targetNode.isConnected) {
                    removed++;
                    continue;
                }
                const success = await clickRemoveCandidateAndVerify(change);
                if (success) removed++; else {
                    failed++;
                    if (change.artistInput && change.oldArtist !== undefined) setReactValue(change.artistInput, change.oldArtist || '');
                    if (change.roleInput) setReactValue(change.roleInput, '');
                }
            }
            updateRevertButton();
            const word = lastAction.type === 'artists' ? 'artist' : (lastAction.type === 'featuring' ? 'feat. artist' : 'remixer');
            const plural = removed !== 1 ? 's' : '';
            const summary = `Reverted ${removed} ${word}${plural}`;
            if (removed > 0) { setInfoSingleLine(`Done! ${summary}`, true); log(`Done! ${summary}`, 'success'); }
            if (failed > 0) { log(`${failed} removal(s) failed`, 'warning'); if (removed === 0) setInfoSingleLine(`${failed} removal(s) failed`, false); }
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
        const remixToggle = document.getElementById('toggle-remix-optional');
        const activeBlueLight = '#1e66d6';
        const activeBlueDark = '#0b5fd6';
        const inactiveBgLight = '#e6e6e6';
        const inactiveBgDark = '#2b2b2b';
        if (theme === 'dark') {
            panel.style.background = '#0f1112';
            panel.style.color = '#ddd';
            if (panelContent) panelContent.style.background = '#111216';
            styleButtons.forEach(btn => { btn.style.background = '#1f2224'; btn.style.color = '#ddd'; btn.style.border = '1px solid #262626'; });
            if (infoDiv) { infoDiv.style.background = '#161718'; infoDiv.style.color = CONFIG.INFO_TEXT_COLOR; }
            if (logContainer) { logContainer.style.background = '#0e0f10'; logContainer.style.color = '#cfcfcf'; }
            if (themeBtn) { themeBtn.textContent = '☀'; themeBtn.style.color = '#fff'; }
            if (collapseBtn) collapseBtn.style.color = '#fff';
            if (closeBtn) closeBtn.style.color = '#fff';
            if (headerTitle) { headerTitle.style.color = '#fff'; headerTitle.style.whiteSpace = 'nowrap'; headerTitle.style.overflow = 'hidden'; headerTitle.style.textOverflow = 'ellipsis'; }
            if (featToggle) { featToggle.style.background = state.removeFeatFromTitle ? activeBlueDark : inactiveBgDark; featToggle.style.color = '#fff'; featToggle.style.border = '1px solid #1b446f'; }
            if (remixToggle) { remixToggle.style.background = state.remixOptionalEnabled ? activeBlueDark : inactiveBgDark; remixToggle.style.color = '#fff'; remixToggle.style.border = '1px solid #1b446f'; }
        } else {
            panel.style.background = '#fff';
            panel.style.color = '#111';
            if (panelContent) panelContent.style.background = '#fff';
            styleButtons.forEach(btn => { btn.style.background = '#f1f3f5'; btn.style.color = '#111'; btn.style.border = '1px solid #e4e6e8'; });
            if (infoDiv) { infoDiv.style.background = '#f8f9fa'; infoDiv.style.color = CONFIG.INFO_TEXT_COLOR; }
            if (logContainer) { logContainer.style.background = '#f8f9fa'; logContainer.style.color = '#6b6b6b'; }
            if (themeBtn) { themeBtn.textContent = '☾'; themeBtn.style.color = '#111'; }
            if (collapseBtn) collapseBtn.style.color = '#111';
            if (closeBtn) closeBtn.style.color = '#111';
            if (headerTitle) { headerTitle.style.color = '#111'; headerTitle.style.whiteSpace = 'nowrap'; headerTitle.style.overflow = 'hidden'; headerTitle.style.textOverflow = 'ellipsis'; }
            if (featToggle) { featToggle.style.background = state.removeFeatFromTitle ? activeBlueLight : inactiveBgLight; featToggle.style.color = state.removeFeatFromTitle ? '#fff' : '#111'; featToggle.style.border = '1px solid #bfcfe8'; }
            if (remixToggle) { remixToggle.style.background = state.remixOptionalEnabled ? activeBlueLight : inactiveBgLight; remixToggle.style.color = state.remixOptionalEnabled ? '#fff' : '#111'; remixToggle.style.border = '1px solid #bfcfe8'; }
        }
        if (featToggle) { featToggle.title = `Remove feat text from title`; featToggle.textContent = state.removeFeatFromTitle ? '✓' : ''; }
        if (remixToggle) updateRemixToggleUI();
    }

    function initThemeFromStorage() {
        let theme = 'light';
        try {
            const stored = localStorage.getItem(CONFIG.THEME_KEY);
            if (stored === 'dark' || stored === 'light') theme = stored;
        } catch (e) { log('Could not load theme preference', 'warning'); }
        applyTheme(theme);
    }

    function addPanelStyles() {
        if (document.getElementById('discogs-helper-panel-styles')) return;
        const css = `
            #durations-helper-panel { border-radius: 8px !important; overflow: hidden !important; box-sizing: border-box !important; }
            #durations-helper-panel .panel-header strong { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block; vertical-align: middle; }
            #durations-helper-panel #panel-content { box-sizing: border-box; background: transparent; }
            #durations-helper-panel #log-container { border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; box-sizing: border-box; }
            #durations-helper-panel, #durations-helper-panel * { box-sizing: border-box; }
            #toggle-feat-remove, #toggle-remix-optional { width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; border-radius: 4px; font-size: 12px; line-height: 1; cursor: pointer; user-select: none; }
            #toggle-feat-remove:focus, #toggle-remix-optional:focus { outline: 2px solid rgba(30, 102, 214, 0.3); outline-offset: 2px; }
        `;
        const style = document.createElement('style');
        style.id = 'discogs-helper-panel-styles';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

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
                <button id="scan-and-extract" class="dh-btn" title="Extracts durations from the end of track titles">🕛 Extract Durations</button>
                <button id="extract-artists" class="dh-btn" title="Splitter Keywords: ${CONFIG.ARTIST_SPLITTER_PATTERNS.join(', ')}">👤 Extract Artists</button>
                <button id="extract-featuring" class="dh-btn" title="Keywords: ${CONFIG.FEATURING_PATTERNS.join(', ')}">👥 Extract Feat. Artists</button>
                <div style="display:flex; gap:8px; align-items:center;">
                    <button id="extract-remixers" class="dh-btn" style="flex:1;">🎶 Extract Remixers</button>
                </div>
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

        const remixBtn = document.getElementById('extract-remixers');
        if (remixBtn) {
            remixBtn.style.display = 'flex';
            remixBtn.style.alignItems = 'center';
            remixBtn.style.justifyContent = 'space-between';
            remixBtn.style.gap = '8px';
            const remixToggle = document.createElement('span');
            remixToggle.id = 'toggle-remix-optional';
            remixToggle.setAttribute('role', 'button');
            remixToggle.setAttribute('tabindex', '0');
            remixToggle.textContent = state.remixOptionalEnabled ? '✓' : '';
            remixToggle.title = `Optional Keywords: ${CONFIG.REMIX_PATTERNS_OPTIONAL.join(', ')}`;
            remixToggle.style.cssText = `
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
            remixToggle.addEventListener('click', (e) => {
                if (e && e.stopPropagation) e.stopPropagation();
                if (e && e.preventDefault) e.preventDefault();
                state.remixOptionalEnabled = !state.remixOptionalEnabled;
                try { localStorage.setItem(CONFIG.REMIX_OPTIONAL_KEY, state.remixOptionalEnabled ? '1' : '0'); } catch (err) { log('Could not save remix optional setting', 'warning'); }
                updateRemixToggleUI();
                const current = localStorage.getItem(CONFIG.THEME_KEY) === 'dark' ? 'dark' : 'light';
                applyTheme(current);
            });
            remixToggle.addEventListener('keydown', (ev) => { if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); remixToggle.click(); } });
            remixBtn.appendChild(remixToggle);
        }

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
            featToggle.title = `Remove feat text from title`;
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
                featToggle.title = `Remove feat text from title`;
                try { localStorage.setItem(CONFIG.FEAT_REMOVE_KEY, state.removeFeatFromTitle ? '1' : '0'); } catch (err) { log('Could not save feat setting', 'warning'); }
                const current = localStorage.getItem(CONFIG.THEME_KEY) === 'dark' ? 'dark' : 'light';
                applyTheme(current);
            }
            featToggle.addEventListener('click', toggleFeatHandler);
            featToggle.addEventListener('keydown', (ev) => { if (ev.key === ' ' || ev.key === 'Enter') toggleFeatHandler(ev); });
            featBtn.appendChild(featToggle);
        }

        const collapseBtn = document.getElementById('collapse-panel');
        const closeBtn = document.getElementById('close-panel');
        const themeBtn = document.getElementById('theme-toggle');
        const logToggle = document.getElementById('log-toggle');
        const logContainer = document.getElementById('log-container');
        closeBtn.onclick = () => { panel.style.display = 'none'; if (state.hideTimeout) clearTimeout(state.hideTimeout); };
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
            try { localStorage.setItem(CONFIG.THEME_KEY, next); } catch (e) { log('Could not save theme preference', 'warning'); }
            applyTheme(next);
        };
        initThemeFromStorage();
        updateRemixToggleUI();
        updateRemixButtonTitle();
        log('Panel initialized');
        resetHideTimer();
        updateRevertButton();
    }

    function resetHideTimer() {
        if (state.hideTimeout) clearTimeout(state.hideTimeout);
        state.hideTimeout = setTimeout(() => { if (!state.isCollapsed) collapsePanel(); }, CONFIG.INACTIVITY_TIMEOUT_MS);
    }

    function collapsePanel() {
        const content = document.getElementById('panel-content');
        const collapseBtn = document.getElementById('collapse-panel');
        if (content && collapseBtn && content.style.display !== 'none') {
            content.style.display = 'none';
            collapseBtn.textContent = '▼';
            collapseBtn.title = 'Expand';
            state.isCollapsed = true;
        }
    }

    setTimeout(() => {
        initializeState();
        createPanel();
        updateRevertButton();
        log('Discogs Edit Helper ready');
        document.body.addEventListener('mousemove', resetHideTimer);
        document.body.addEventListener('keydown', resetHideTimer);
        document.body.addEventListener('click', resetHideTimer);
        const panel = document.getElementById('durations-helper-panel');
        if (panel) {
            panel.addEventListener('mousemove', resetHideTimer);
            panel.addEventListener('keydown', resetHideTimer);
            panel.addEventListener('click', resetHideTimer);
        }
    }, 900);

})();