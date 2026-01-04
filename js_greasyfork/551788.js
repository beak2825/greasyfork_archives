// ==UserScript==
// @name         Faction Target Finder
// @version      1.5.0
// @namespace    http://tampermonkey.net/
// @description  Adds a draggable, minimizable window to find targets from a custom faction list.
// @author       GNS-C4 [3960752]
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/551788/Faction%20Target%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/551788/Faction%20Target%20Finder.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // --- SCRIPT CONFIGURATION ---
    const DEBUG = true; // Set to true to enable detailed console logging for troubleshooting.

    // Default list of faction IDs to scan. Users can override this in the script's settings menu.
    let defaultFacIDs = [];

    // Failsafe target range for the "Chain Save" button if no other targets can be found.
    const NO_API_MIN_ID = 3700000;
    const NO_API_MAX_ID = 3900000;

    // --- END OF CONFIGURATION ---


    // --- GLOBAL VARIABLES ---
    let facIDs, maxLevel, apiKey, attackLink, newTab, randTarget, randFaction, ffScouterApiKey, maxStats, maxStatsRaw, db;
    let isDragging = false;
    let offsetX, offsetY;

    // IndexedDB constants for caching FFScouter stats
    const DB_NAME = 'FTF_Cache';
    const STORE_NAME = 'ff_stats';
    const DB_VERSION = 1;
    const CACHE_DURATION = 10 * 24 * 60 * 60 * 1000; // 10 days


    // --- UTILITY & HELPER FUNCTIONS ---

    function logDebug(...args) {
        if (DEBUG) {
            console.log('[FTF Debug]', ...args);
        }
    }

    // Parses numbers with suffixes like '100k', '2.5b', etc.
    function parseSuffixedNumber(input) {
        if (!input) return 0;
        const s = String(input).trim().toLowerCase();
        const lastChar = s.slice(-1);
        let value = parseFloat(s);

        if (isNaN(value)) return 0;

        switch (lastChar) {
            case 'k': value *= 1e3; break;
            case 'm': value *= 1e6; break;
            case 'b': value *= 1e9; break;
            case 't': value *= 1e12; break;
            case 'q': value *= 1e15; break;
        }
        return Math.floor(value);
    }

    // --- DOM ELEMENT CREATION ---

    function createButton(text, className, onClick) {
        const button = document.createElement('button');
        button.className = className;
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;
    }

    function createDiv(className) {
        const div = document.createElement('div');
        div.className = className;
        return div;
    }

    function createInput(id, text, value, type) {
        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.value = value;
        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = text;
        return { input, label };
    }

    function createCheckbox(id, text, value) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.checked = value;
        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = text;
        return { checkbox, label };
    }


    // --- INDEXEDDB FOR STATS CACHING ---

    function initDB() {
        return new Promise((resolve, reject) => {
            if (db) return resolve(db);
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = event => {
                const dbInstance = event.target.result;
                if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                    dbInstance.createObjectStore(STORE_NAME, { keyPath: 'userId' });
                }
            };

            request.onsuccess = event => {
                db = event.target.result;
                logDebug("IndexedDB initialized successfully.");
                resolve(db);
            };

            request.onerror = event => {
                console.error("[FTF] IndexedDB error:", event.target.errorCode);
                reject(event.target.errorCode);
            };
        });
    }

    function getStatsFromDB(userIds) {
        return new Promise((resolve, reject) => {
            if (!db) return reject("DB not initialized");
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const results = {};
            if (userIds.length === 0) return resolve(results);

            let processedCount = 0;
            userIds.forEach(id => {
                const request = store.get(id);
                request.onsuccess = event => {
                    const result = event.target.result;
                    if (result && (Date.now() - result.timestamp < CACHE_DURATION)) {
                        results[id] = result;
                    }
                    if (++processedCount === userIds.length) resolve(results);
                };
                request.onerror = () => {
                    if (++processedCount === userIds.length) resolve(results);
                };
            });
        });
    }

    function saveStatsToDB(statsArray) {
        return new Promise((resolve, reject) => {
            if (!db) return reject("DB not initialized");
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            statsArray.forEach(statData => store.put({
                userId: statData.player_id,
                stats: statData,
                timestamp: Date.now()
            }));

            transaction.oncomplete = () => {
                logDebug(`Saved ${statsArray.length} user stats to DB.`);
                resolve();
            };
            transaction.onerror = event => reject(event.target.error);
        });
    }


    // --- API & DATA FETCHING ---

    function fetchFFScouterStats(targetIds) {
        return new Promise((resolve) => {
            if (!ffScouterApiKey || targetIds.length === 0) return resolve([]);
            const FFSCOUTER_TARGETS_PER_REQ = 205;
            const promises = [];

            for (let i = 0; i < targetIds.length; i += FFSCOUTER_TARGETS_PER_REQ) {
                const chunk = targetIds.slice(i, i + FFSCOUTER_TARGETS_PER_REQ);
                const endpoint = `https://ffscouter.com/api/v1/get-stats?key=${ffScouterApiKey}&targets=${chunk.join(",")}`;
                promises.push(new Promise(resolveChunk => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: endpoint,
                        onload: response => {
                            try {
                                const responseData = JSON.parse(response.responseText);
                                if (Array.isArray(responseData)) resolveChunk(responseData);
                                else {
                                    console.error(`[FTF] FFScouter API Error:`, responseData.error || responseData);
                                    resolveChunk([]);
                                }
                            } catch (e) {
                                console.error(`[FTF] FFScouter JSON Parse Error:`, e);
                                resolveChunk([]);
                            }
                        },
                        onerror: error => {
                            console.error("[FTF] FFScouter Fetch Error:", error);
                            resolveChunk([]);
                        }
                    });
                }));
            }
            Promise.all(promises).then(results => resolve([].concat(...results)));
        });
    }


    // --- CORE LOGIC ---

    async function init() {
        const storedFacIDs = await GM_getValue('FTF_FACTIONS', defaultFacIDs.join(','));
        facIDs = storedFacIDs.split(',').map(Number).filter(id => !isNaN(id) && id > 0);

        maxLevel = await GM_getValue('FTF_LEVEL', 100);
        apiKey = await GM_getValue('FTF_API', null);
        attackLink = await GM_getValue('FTF_PROFILE', false);
        newTab = await GM_getValue('FTF_NEWTAB', false);
        randFaction = await GM_getValue('FTF_RAND_FACTION', false);
        randTarget = await GM_getValue('FTF_RAND_TARGET', false);
        ffScouterApiKey = await GM_getValue('FTF_FF_API', '');
        maxStatsRaw = await GM_getValue('FTF_MAX_STATS', '');
        maxStats = parseSuffixedNumber(maxStatsRaw);

        logDebug('Script initialized with settings:', {
            facIDs, maxLevel, apiKey: apiKey ? '***' : 'Not Set', attackLink, newTab, randFaction, randTarget, ffScouterApiKey: ffScouterApiKey ? '***' : 'Not Set', maxStats
        });
    }

    function findTarget() {
        if (!apiKey) {
            alert('Please set your Torn API key in the settings first.');
            toggleSettings();
            return;
        }

        initDB().then(() => {
            logDebug("Checking personal Target List first...");
            processTargetList(null, (targetID) => {
                if (!targetID) {
                    logDebug("No suitable targets in personal list, checking factions.");
                    processUrls();
                }
            });
        }).catch(err => {
            console.error("[FTF] Failed to initialize DB. Stat checking will be disabled.", err);
            processTargetList(null, (targetID) => {
                if (!targetID) processUrls();
            });
        });
    }

    async function filterAndSelectTarget(potentialTargets) {
        if (potentialTargets.length === 0) return null;

        if (!maxStats || maxStats <= 0 || !ffScouterApiKey) {
            const target = randTarget ? potentialTargets[Math.floor(Math.random() * potentialTargets.length)] : potentialTargets[0];
            const targetId = typeof target === 'object' ? target.id : target;
            logDebug(`Stat filtering disabled. Selected target: ${targetId}`);
            return targetId;
        }

        logDebug(`Stat filtering ${potentialTargets.length} potential targets (max stats: ${maxStats.toLocaleString()})`);
        const targetIds = potentialTargets.map(t => typeof t === 'object' ? t.id : t);

        try {
            const cachedStats = await getStatsFromDB(targetIds);
            const idsToFetch = targetIds.filter(id => !cachedStats[id]);

            if (idsToFetch.length > 0) {
                logDebug(`Fetching ${idsToFetch.length} users from FFScouter.`);
                const fetchedStats = await fetchFFScouterStats(idsToFetch);
                if (fetchedStats.length > 0) await saveStatsToDB(fetchedStats);
                fetchedStats.forEach(data => cachedStats[data.player_id] = { stats: data });
            }

            const finalTargets = potentialTargets.filter(target => {
                const id = typeof target === 'object' ? target.id : target;
                const statInfo = cachedStats[id];
                if (!statInfo || !statInfo.stats || statInfo.stats.bs_estimate === undefined) {
                    logDebug(`No stat info for ${id}, keeping in list.`);
                    return true;
                }
                const passesFilter = statInfo.stats.bs_estimate <= maxStats;
                logDebug(`User ${id} has ${statInfo.stats.bs_estimate.toLocaleString()} stats. Passes filter: ${passesFilter}`);
                return passesFilter;
            });

            logDebug(`After stat filtering, ${finalTargets.length} targets remain.`);
            if (finalTargets.length === 0) return null;

            const finalTarget = randTarget ? finalTargets[Math.floor(Math.random() * finalTargets.length)] : finalTargets[0];
            const finalId = typeof finalTarget === 'object' ? finalTarget.id : finalTarget;
            logDebug(`Selected final target after filtering: ${finalId}`);
            return finalId;
        } catch (error) {
            console.error("[FTF] Error during stat filtering, skipping.", error);
            const fallbackTarget = randTarget ? potentialTargets[Math.floor(Math.random() * potentialTargets.length)] : potentialTargets[0];
            return typeof fallbackTarget === 'object' ? fallbackTarget.id : fallbackTarget;
        }
    }

    function processTargetList(url, callback) {
        const apiUrl = url || `https://api.torn.com/user/?selections=profile&key=${apiKey}&comment=FactionTargetFinder`;
        logDebug("Fetching personal target list from:", apiUrl);

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload(response) {
                const data = JSON.parse(response.responseText);

                if (data.error) {
                    console.error("[FTF] Failed fetching user data, reason:", data.error.error);
                    return callback(null);
                }

                const targets = data.friends || {};
                const suitableTargets = Object.entries(targets)
                    .filter(([id, user]) => user.level <= maxLevel && user.status.state === "Okay")
                    .map(([id, user]) => ({ id: Number(id), ...user }));

                logDebug(`Found ${suitableTargets.length} suitable targets in personal list.`);

                filterAndSelectTarget(suitableTargets).then(targetId => {
                    if (targetId) {
                        console.log(`[FTF] Suitable target found in personal list: ${targetId}. Stopping search.`);
                        openTargetPage(targetId);
                        return callback(targetId);
                    }
                    return callback(null);
                });
            },
            onerror(error) {
                console.error("[FTF] Error loading user data URL:", error);
                return callback(null);
            }
        });
    }

    function processUrls(index = 0, checked = new Set()) {
        if (facIDs.length === 0) {
            alert("Your faction list is empty. Please add some faction IDs in the settings panel.");
            return;
        }

        if (checked.size >= facIDs.length) {
            logDebug("No players met the conditions in any faction. Using failsafe random target.");
            openRandomNoApiTarget();
            return;
        }

        if (randFaction) {
            do {
                index = Math.floor(Math.random() * facIDs.length);
            } while (checked.has(index));
        }

        checked.add(index);

        const url = `https://api.torn.com/faction/${facIDs[index]}?selections=basic&timestamp=${Date.now()}&key=${apiKey}`;
        logDebug(`Checking faction ID: ${facIDs[index]}`);

        GM_xmlhttpRequest({
            method: "GET",
            url,
            onload(response) {
                const roster = JSON.parse(response.responseText);
                const potentialTargets = checkCondition(roster);

                if (potentialTargets && potentialTargets.length > 0) {
                    filterAndSelectTarget(potentialTargets).then(targetId => {
                        if (targetId) {
                            openTargetPage(targetId);
                        } else {
                            logDebug(`No targets passed stat filter in faction ${facIDs[index]}. Moving on.`);
                            processUrls(randFaction ? 0 : index + 1, checked);
                        }
                    });
                } else {
                    processUrls(randFaction ? 0 : index + 1, checked);
                }
            },
            onerror() {
                console.error(`[FTF] Error loading URL for faction ${facIDs[index]}`);
                processUrls(randFaction ? 0 : index + 1, checked);
            }
        });
    }

    function checkCondition(roster) {
        if ("error" in roster) {
            console.error("[FTF] Failed fetching faction roster, reason:", roster.error.error);
            return [];
        }

        const members = Object.entries(roster.members)
            .map(([id, member]) => ({ id: Number(id), ...member }))
            .filter(member => member.level <= maxLevel && member.status.state === "Okay" && member.days_in_faction >= 15);

        logDebug(`Found ${members.length} potential targets in faction ${roster.name}.`);
        return members;
    }

    function openTargetPage(targetId) {
        let profileLink;
        if (attackLink) {
            profileLink = `https://www.torn.com/loader.php?sid=attack&user2ID=${targetId}`;
        } else {
            profileLink = `https://www.torn.com/profiles.php?XID=${targetId}`;
        }
        console.log(`[FTF] Opening target page: ${profileLink}`);
        if (newTab) window.open(profileLink, '_blank');
        else window.location.href = profileLink;
    }

    function openRandomNoApiTarget() {
        const randomID = Math.floor(Math.random() * (NO_API_MAX_ID - NO_API_MIN_ID + 1)) + NO_API_MIN_ID;
        logDebug(`Opening random (no-API) chain-save target: ${randomID}`);
        openTargetPage(randomID);
    }


    // --- GUI & SETTINGS MODAL ---

    let settingsModal;
    let factionListContainer;

    async function saveFactions() {
        await GM_setValue('FTF_FACTIONS', facIDs.join(','));
        logDebug("Auto-saved faction list:", facIDs);
    }

    function renderFactionList() {
        if (!factionListContainer) return;
        factionListContainer.innerHTML = '';
        if (facIDs.length === 0) {
            factionListContainer.textContent = 'No factions in list.';
            return;
        }
        facIDs.forEach(id => {
            const item = document.createElement('div');
            item.className = 'ftf-faction-item';
            item.innerHTML = `<span>${id}</span>`;
            const removeBtn = createButton('✖', 'ftf-remove-btn', async () => {
                const index = facIDs.indexOf(id);
                if (index > -1) {
                    facIDs.splice(index, 1);
                    renderFactionList();
                    await saveFactions();
                }
            });
            item.appendChild(removeBtn);
            factionListContainer.appendChild(item);
        });
    }

    function createSettingsModal() {
        const modalOverlay = createDiv('ftf-modal-overlay');
        modalOverlay.id = 'ftf-settings-modal';
        modalOverlay.style.display = 'none';

        const modalContent = createDiv('ftf-modal-content');
        const modalBody = createDiv('ftf-modal-body');

        const appendElements = (parent, ...elements) => {
            const tempDiv = document.createElement('div');
            tempDiv.classList.add('ftf-settings-row');
            elements.forEach(el => tempDiv.append(el));
            parent.append(tempDiv);
        };

        const { input: apiKeyInput, label: apiKeyLabel } = createInput('ftf-api', "API Key (Limited)", apiKey, "text");
        apiKeyInput.addEventListener('input', async () => {
            apiKey = apiKeyInput.value.trim();
            await GM_setValue('FTF_API', apiKey);
            logDebug("Auto-saved API Key.");
        });
        appendElements(modalBody, apiKeyLabel, apiKeyInput);

        const { input: ffApiInput, label: ffApiLabel } = createInput('ftf-ff-api', "FFScouter Key", ffScouterApiKey, "text");
        ffApiInput.addEventListener('input', async () => {
            ffScouterApiKey = ffApiInput.value.trim();
            await GM_setValue('FTF_FF_API', ffScouterApiKey);
            logDebug("Auto-saved FFScouter API Key.");
        });
        appendElements(modalBody, ffApiLabel, ffApiInput);

        const { input: maxInput, label: maxLabel } = createInput('ftf-max-level', "Max Level", maxLevel, "number");
        maxInput.addEventListener('input', async () => {
            const newLevel = parseInt(maxInput.value, 10);
            if (!isNaN(newLevel) && newLevel >= 0 && newLevel <= 100) {
                maxLevel = newLevel;
                await GM_setValue('FTF_LEVEL', newLevel);
                logDebug("Auto-saved Max Level:", newLevel);
            }
        });
        appendElements(modalBody, maxLabel, maxInput);

        const { input: maxStatsInput, label: maxStatsLabel } = createInput('ftf-max-stats', "Max Stats (k,m,b...)", maxStatsRaw, "text");
        maxStatsInput.addEventListener('input', async () => {
            maxStatsRaw = maxStatsInput.value;
            maxStats = parseSuffixedNumber(maxStatsRaw);
            await GM_setValue('FTF_MAX_STATS', maxStatsRaw);
            logDebug("Auto-saved Max Stats:", maxStatsRaw);
        });
        appendElements(modalBody, maxStatsLabel, maxStatsInput);

        const addFactionWrapper = createDiv('ftf-settings-row');
        addFactionWrapper.innerHTML = `<label>Faction List</label>`;
        const addControlsDiv = createDiv('ftf-add-controls');
        const { input: addFactionInput } = createInput('ftf-add-faction-id', '', '', "number");
        addFactionInput.placeholder = 'Add ID...';

        const addFactionBtn = createButton('Add', 'ftf-add-btn', () => {
            const newId = parseInt(addFactionInput.value, 10);
            if (newId && !isNaN(newId) && newId > 0) {
                if (!facIDs.includes(newId)) {
                    facIDs.push(newId);
                    renderFactionList();
                    addFactionInput.value = '';
                    saveFactions();
                } else { alert('That faction ID is already in the list.'); }
            } else { alert('Please enter a valid faction ID.'); }
        });
        addControlsDiv.append(addFactionInput, addFactionBtn);
        addFactionWrapper.append(addControlsDiv);
        modalBody.append(addFactionWrapper);

        factionListContainer = createDiv('ftf-faction-list-container');
        factionListContainer.id = 'ftf-faction-list-container';
        modalBody.append(factionListContainer);

        const { checkbox: profileCheckbox, label: profileLabel } = createCheckbox('ftf-profile', "Open directly to attack page?", attackLink);
        profileCheckbox.addEventListener('change', async () => {
            attackLink = profileCheckbox.checked;
            await GM_setValue('FTF_PROFILE', attackLink);
            logDebug("Auto-saved Attack Page setting:", attackLink);
        });
        appendElements(modalBody, profileCheckbox, profileLabel);

        const { checkbox: tabCheckbox, label: tabLabel } = createCheckbox('ftf-newtab', "Open in new tab?", newTab);
        tabCheckbox.addEventListener('change', async () => {
            newTab = tabCheckbox.checked;
            await GM_setValue('FTF_NEWTAB', newTab);
            logDebug("Auto-saved New Tab setting:", newTab);
        });
        appendElements(modalBody, tabCheckbox, tabLabel);

        const { checkbox: randomFCheckbox, label: randomFLabel } = createCheckbox('ftf-random-faction', "Check random faction first?", randFaction);
        randomFCheckbox.addEventListener('change', async () => {
            randFaction = randomFCheckbox.checked;
            await GM_setValue('FTF_RAND_FACTION', randFaction);
            logDebug("Auto-saved Random Faction setting:", randFaction);
        });
        appendElements(modalBody, randomFCheckbox, randomFLabel);

        const { checkbox: randomTCheckbox, label: randomTLabel } = createCheckbox('ftf-random-target', "Select random target from list?", randTarget);
        randomTCheckbox.addEventListener('change', async () => {
            randTarget = randomTCheckbox.checked;
            await GM_setValue('FTF_RAND_TARGET', randTarget);
            logDebug("Auto-saved Random Target setting:", randTarget);
        });
        appendElements(modalBody, randomTCheckbox, randomTLabel);


        const buttonContainer = createDiv('ftf-modal-buttons');
        const closeBtn = createButton('Close', 'ftf-close', toggleSettings);

        const resetBtn = createButton('Reset Position', 'ftf-reset-pos', async () => {
            if (confirm("Are you sure you want to reset the GUI position? The window will return to its default location after a page refresh.")) {
                await GM_deleteValue('FTF_POS_TOP');
                await GM_deleteValue('FTF_POS_LEFT');
                await GM_deleteValue('FTF_MINIMIZED');
                alert("Position has been reset. Please refresh the page.");
                toggleSettings();
            }
        });

        buttonContainer.append(resetBtn, closeBtn);

        modalContent.append(modalBody, buttonContainer);
        modalOverlay.append(modalContent);
        document.body.appendChild(modalOverlay);
        settingsModal = modalOverlay;
        renderFactionList();
    }

    function toggleSettings() {
        if (!settingsModal) return;
        settingsModal.style.display = settingsModal.style.display === 'none' ? 'flex' : 'none';
    }

    // --- CROSS-TAB SYNC ---

    function setupChangeListeners() {
        logDebug("Setting up cross-tab sync listeners.");

        GM_addValueChangeListener('FTF_API', (name, old_value, new_value, remote) => {
            if (remote) {
                logDebug(`[Sync] API Key changed remotely.`);
                apiKey = new_value;
                const input = document.querySelector('#ftf-api');
                if (input) input.value = new_value;
            }
        });

        GM_addValueChangeListener('FTF_FF_API', (name, old_value, new_value, remote) => {
            if (remote) {
                logDebug(`[Sync] FFScouter Key changed remotely.`);
                ffScouterApiKey = new_value;
                const input = document.querySelector('#ftf-ff-api');
                if (input) input.value = new_value;
            }
        });

        GM_addValueChangeListener('FTF_LEVEL', (name, old_value, new_value, remote) => {
            if (remote) {
                logDebug(`[Sync] Max Level changed remotely to ${new_value}.`);
                maxLevel = new_value;
                const input = document.querySelector('#ftf-max-level');
                if (input) input.value = new_value;
            }
        });

        GM_addValueChangeListener('FTF_MAX_STATS', (name, old_value, new_value, remote) => {
            if (remote) {
                logDebug(`[Sync] Max Stats changed remotely to ${new_value}.`);
                maxStatsRaw = new_value;
                maxStats = parseSuffixedNumber(new_value);
                const input = document.querySelector('#ftf-max-stats');
                if (input) input.value = new_value;
            }
        });

        GM_addValueChangeListener('FTF_FACTIONS', (name, old_value, new_value, remote) => {
            if (remote) {
                logDebug(`[Sync] Faction list changed remotely.`);
                facIDs = (new_value || '').split(',').map(Number).filter(id => !isNaN(id) && id > 0);
                renderFactionList();
            }
        });

        GM_addValueChangeListener('FTF_PROFILE', (name, old_value, new_value, remote) => {
            if (remote) {
                logDebug(`[Sync] Attack Link setting changed remotely to ${new_value}.`);
                attackLink = new_value;
                const checkbox = document.querySelector('#ftf-profile');
                if (checkbox) checkbox.checked = new_value;
            }
        });

        GM_addValueChangeListener('FTF_NEWTAB', (name, old_value, new_value, remote) => {
            if (remote) {
                logDebug(`[Sync] New Tab setting changed remotely to ${new_value}.`);
                newTab = new_value;
                const checkbox = document.querySelector('#ftf-newtab');
                if (checkbox) checkbox.checked = new_value;
            }
        });

        GM_addValueChangeListener('FTF_RAND_FACTION', (name, old_value, new_value, remote) => {
            if (remote) {
                logDebug(`[Sync] Random Faction setting changed remotely to ${new_value}.`);
                randFaction = new_value;
                const checkbox = document.querySelector('#ftf-random-faction');
                if (checkbox) checkbox.checked = new_value;
            }
        });

        GM_addValueChangeListener('FTF_RAND_TARGET', (name, old_value, new_value, remote) => {
            if (remote) {
                logDebug(`[Sync] Random Target setting changed remotely to ${new_value}.`);
                randTarget = new_value;
                const checkbox = document.querySelector('#ftf-random-target');
                if (checkbox) checkbox.checked = new_value;
            }
        });
    }

    // --- CHAIN BAR ENHANCEMENTS ---

    function updateTimerColor(timerElement) {
        const wrapper = timerElement.parentNode;
        if (!wrapper || !wrapper.classList.contains('ftf-timer-wrapper')) return;

        const timeText = timerElement.textContent;
        const parts = timeText.split(':').map(Number);
        if (parts.length < 2) return;

        const [minutes, seconds] = parts;
        const totalSeconds = (minutes * 60) + seconds;

        wrapper.classList.remove('ftf-timer-red', 'ftf-timer-yellow', 'ftf-timer-green');

        if (totalSeconds == 0) return
        else if (totalSeconds < 60) wrapper.classList.add('ftf-timer-red');
        else if (totalSeconds <= 180) wrapper.classList.add('ftf-timer-yellow');
        else wrapper.classList.add('ftf-timer-green');
    }

    const chainBarObserver = new MutationObserver((mutations, obs) => {
        const timerElement = document.querySelector('.bar-timeleft___B9RGV');
        if (timerElement) {
            timerElement.addEventListener('click', openRandomNoApiTarget);

            const timerWrapper = document.createElement('div');
            timerWrapper.className = 'ftf-timer-wrapper';
            timerElement.parentNode.insertBefore(timerWrapper, timerElement);
            timerWrapper.appendChild(timerElement);

            const timerTextObserver = new MutationObserver(() => updateTimerColor(timerElement));
            timerTextObserver.observe(timerElement, { characterData: true, childList: true, subtree: true });

            updateTimerColor(timerElement);
            obs.disconnect();
        }
    });


    // --- MAIN GUI SETUP & DRAGGING LOGIC ---

    async function setupGUI() {
        const container = createDiv('ftf-container');
        const header = createDiv('ftf-header');
        header.textContent = 'FTF';

        const minimizeBtn = createButton('', 'ftf-minimize-btn', () => toggleMinimize(container));
        header.appendChild(minimizeBtn);

        const buttonWrapper = createDiv('ftf-button-wrapper');
        const findBtn = createButton('Find Target', 'ftf-btn', findTarget);
        const chainSaveBtn = createButton('Chain Save', 'ftf-chain-save', openRandomNoApiTarget);
        const settBtn = createButton('Settings', 'ftf-settings', toggleSettings);

        buttonWrapper.append(chainSaveBtn, findBtn, settBtn);
        container.append(header, buttonWrapper);
        document.body.appendChild(container);

        // --- POSITION & STATE LOADING ---
        const savedTop = await GM_getValue('FTF_POS_TOP');
        const savedLeft = await GM_getValue('FTF_POS_LEFT');
        const isMinimized = await GM_getValue('FTF_MINIMIZED', false);


        let top = parseInt(savedTop, 10);
        let left = parseInt(savedLeft, 10);

        if (isNaN(top) || isNaN(left) || top < 0 || left < 0) {
            logDebug("Invalid or no position saved. Resetting to default.");
            container.style.top = '150px';
            container.style.left = '10px';
        } else {
            logDebug("Loading saved position:", { top: `${top}px`, left: `${left}px` });
            container.style.top = `${top}px`;
            container.style.left = `${left}px`;
        }

        if (isMinimized) {
            container.classList.add('minimized');
        }


        // --- DRAGGING LOGIC (Mobile Friendly) ---
        function startDrag(e) {
            isDragging = true;
            const clientX = e.clientX ?? e.touches[0].clientX;
            const clientY = e.clientY ?? e.touches[0].clientY;
            offsetX = clientX - container.offsetLeft;
            offsetY = clientY - container.offsetTop;
            container.style.transition = 'none';
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchmove', onMouseMove, { passive: false });
            document.addEventListener('touchend', endDrag);
        }

        function onMouseMove(e) {
            if (!isDragging) return;
            if (e.type === 'touchmove') {
                e.preventDefault();
            }
            const clientX = e.clientX ?? e.touches[0].clientX;
            const clientY = e.clientY ?? e.touches[0].clientY;
            const newTop = clientY - offsetY;
            const newLeft = clientX - offsetX;
            container.style.top = `${newTop}px`;
            container.style.left = `${newLeft}px`;
        }

        async function endDrag() {
            if (!isDragging) return;
            isDragging = false;
            container.style.transition = '';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchmove', onMouseMove);
            document.removeEventListener('touchend', endDrag);

            await GM_setValue('FTF_POS_TOP', parseInt(container.style.top, 10));
            await GM_setValue('FTF_POS_LEFT', parseInt(container.style.left, 10));
            logDebug('Saved new position:', { top: container.style.top, left: container.style.left });
        }

        header.addEventListener('mousedown', startDrag);
        header.addEventListener('touchstart', startDrag);


        async function toggleMinimize(container) {
            container.classList.toggle('minimized');
            const minimized = container.classList.contains('minimized');
            await GM_setValue('FTF_MINIMIZED', minimized);
            logDebug('Toggled minimize, state is now:', minimized);
        }
    }


    // --- STYLES ---

    function addGlobalStyle(css) {
        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
    }

    addGlobalStyle(`
        /* Main Container */
        .ftf-container {
            position: fixed;
            z-index: 9999;
            background-color: #222;
            border: 1px solid #444;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            transition: height 0.3s ease, width 0.3s ease;
            overflow: hidden;
        }
        .ftf-header {
            background-color: #333;
            color: #ccc;
            padding: 4px 8px;
            cursor: move;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }
        .ftf-button-wrapper {
            display: flex;
            flex-direction: column;
            gap: 5px;
            padding: 8px;
        }

        /* Minimize/Maximize Button & State */
        .ftf-minimize-btn {
            background: transparent;
            border: 1px solid #888;
            color: #ccc;
            border-radius: 50%;
            cursor: pointer;
            width: 20px;
            height: 20px;
            font-size: 20px;
            line-height: 17px;
            text-align: center;
            padding: 0;
            font-weight: bold;
            user-select: none;
            transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .ftf-minimize-btn:hover {
            background-color: #555;
            border-color: #aaa;
        }
        .ftf-container.minimized .ftf-button-wrapper,
        .ftf-container.minimized .ftf-settings,
        .ftf-container.minimized .ftf-btn,
        .ftf-container.minimized .ftf-chain-save {
            display: none;
        }
        .ftf-container.minimized .ftf-minimize-btn::before {
            content: '＋';
        }
        .ftf-container:not(.minimized) .ftf-minimize-btn::before {
            content: '−';
            position: relative;
            top: -1px;
        }

        /* Action Buttons */
        .ftf-btn, .ftf-settings, .ftf-chain-save {
            font-size: 1em;
            padding: 5px 12px;
            cursor: pointer;
            border: 1px solid #666;
            border-radius: 5px;
            color: #ddd;
            text-shadow: 1px 1px 1px #000;
        }
        .ftf-btn { background: #5a5a5a; }
        .ftf-btn:hover { background: #6b6b6b; }
        .ftf-settings { background: #222; }
        .ftf-settings:hover { background: #333; }
        .ftf-chain-save { background: #7a5a00; }
        .ftf-chain-save:hover { background: #8b6b00; }

        /* Settings Modal */
        .ftf-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 100000;
            display: flex; align-items: center; justify-content: center;
        }
        .ftf-modal-content {
            color: #ccc; background: #111; border-radius: 8px;
            max-width: 450px; max-height: 80vh;
            display: flex; flex-direction: column; overflow: hidden;
        }
        .ftf-modal-body {
            padding: 15px; display: flex; flex-direction: column;
            gap: 10px; overflow-y: auto; flex: 1;
        }
        .ftf-settings-row {
            display: grid; grid-template-columns: 1fr 1fr;
            gap: 10px; align-items: center;
        }
        .ftf-settings-row label { color: orange; font-weight: bold; }
        #ftf-api, #ftf-ff-api, #ftf-max-level, #ftf-max-stats, #ftf-add-faction-id {
            background-color: transparent; border: 1px solid #444; color: white;
            padding: 5px; border-radius: 4px;
        }
        .ftf-settings-row input[type="checkbox"] { display: none; }
        .ftf-settings-row input[type="checkbox"]+label {
            position: relative; padding-left: 25px; cursor: pointer;
            color: white; font-weight: normal;
            grid-column: 2 / 3;
            justify-self: start;
        }
        .ftf-settings-row input[type="checkbox"]+label:before {
            content: ''; position: absolute; left: 0;
            width: 16px; height: 16px;
            border: 1px solid #444; border-radius: 5px;
        }
        .ftf-settings-row input[type="checkbox"]:checked+label:after {
            content: '✔'; position: absolute; left: 4px; top: 1px;
            font-size: 1em; color: green;
        }
        .ftf-add-controls { display: flex; gap: 5px; }
        #ftf-add-faction-id { flex-grow: 1; }
        #ftf-faction-list-container {
            background: #222; border: 1px solid #444; padding: 5px;
            border-radius: 4px; min-height: 80px; max-height: 150px;
            overflow-y: auto; grid-column: 1 / -1;
        }
        .ftf-faction-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 3px; border-bottom: 1px solid #333;
        }
        .ftf-faction-item:last-child { border-bottom: none; }
        .ftf-modal-buttons {
            display: flex; justify-content: flex-end; gap: 10px;
            border-top: 1px solid #555; padding: 10px; background: #222;
        }
        .ftf-save, .ftf-close, .ftf-add-btn, .ftf-remove-btn, .ftf-reset-pos {
            padding: 6px 15px; cursor: pointer; border-radius: 5px; text-shadow: 1px 1px 1px #000;
        }
        .ftf-save { color: #fff; background: #507b34; border: 1px solid #365223; }
        .ftf-save:hover { background: #5c8f3c; }
        .ftf-close { color: #ddd; background: #5a5a5a; border: 1px solid #333; }
        .ftf-close:hover { background: #6b6b6b; }
        .ftf-add-btn { padding: 6px 10px; color: #fff; background: #34687b; border: 1px solid #234752; }
        .ftf-add-btn:hover { background: #3c7a8f; }
        .ftf-remove-btn { padding: 2px 8px; font-size: 1.1em; color: #fff; background: #9d2f2f; border: 1px solid #712020; }
        .ftf-remove-btn:hover { background: #b13535; }
        .ftf-reset-pos { background: #7a2b2b; border: 1px solid #551e1e; color: #fff; }
        .ftf-reset-pos:hover { background: #8f3232; }

        /* Chain Timer Styles */
        .bar-stats___E_LqA { display: block !important; }
        .ftf-timer-wrapper {
            display: inline-block; border-radius: 8px; padding: 3px 5px;
            transition: all 0.3s ease;
        }
        .bar-timeleft___B9RGV { font-size: 60px; cursor: pointer; transition: color 0.3s; }
        .ftf-timer-green { color: #4CAF50 !important; background-color: rgba(76, 175, 80, 0.2) !important; }
        .ftf-timer-yellow { color: #FFC107 !important; background-color: rgba(255, 193, 7, 0.2) !important; }
        .ftf-timer-red { color: #F44336 !important; background-color: rgba(244, 67, 54, 0.3); animation: pulse-red 3s infinite; }
        @keyframes pulse-red {
            0%, 100% { background-color: rgba(244, 67, 54, 0.3); }
            50% { background-color: rgba(244, 67, 54, 0.6); }
        }
    `);


    // --- SCRIPT START ---
    await init();
    await setupGUI();
    createSettingsModal();
    setupChangeListeners();
    chainBarObserver.observe(document.body, { childList: true, subtree: true });

})();

