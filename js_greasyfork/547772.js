// ==UserScript==
// @name         OC Track CPR
// @namespace    heartflower.torn
// @version      1.0.8
// @description  Show CPR data, add status icon to unavailable, highlight member inefficiency
// @author       Heartflower
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/547772/OC%20Track%20CPR.user.js
// @updateURL https://update.greasyfork.org/scripts/547772/OC%20Track%20CPR.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[HF] OC Track CPR running');

    // API SETTINGS //

    let apiKey;
    let storedAPIKey = localStorage.getItem('hf-tornstats-apiKey');

    if (storedAPIKey) {
        apiKey = storedAPIKey;
        if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('Remove API key', removeAPIKey);
    } else {
        setAPIkey();
    }

    let pda = ('xmlhttpRequest' in GM);
    let httpRequest = pda ? 'xmlhttpRequest' : 'xmlHttpRequest';

    let settings = {};
    let savedSettings = localStorage.getItem('hf-oc-cpr-settings');
    if (savedSettings) {
        try {
            settings = JSON.parse(savedSettings);
        } catch (e) {
            console.warn('[HF] Failed to parse saved settings, using defaults');
            settings = {};
        }
    }

    let tornStatsData = {};
    let cachedTornStatsData = localStorage.getItem('hf-cached-ts-oc-data');
    if (cachedTornStatsData) {
        try {
            tornStatsData = JSON.parse(cachedTornStatsData);
        } catch (e) {
            console.warn('[HF] Failed to parse cached TornStats data');
            tornStatsData = {};
        }
    }

    let localData = {};
    let cachedLocalData = localStorage.getItem('hf-cached-local-oc-data');
    if (cachedLocalData) {
        try {
            localData = JSON.parse(cachedLocalData);
        } catch (e) {
            console.warn('[HF] Failed to parse cached local data');
            localData = {};
        }
    }

    let crimeLevelData = {};
    let storedLevels = localStorage.getItem('hf-oc-level-data');
    if (storedLevels) {
        try {
            crimeLevelData = JSON.parse(storedLevels);
        } catch (e) {
            console.warn('[HF] Failed to parse crime level data');
            crimeLevelData = {};
        }
    }

    let difficultyTiers = {
        1: 'introductory',
        2: 'simple',
        3: 'intermediate',
        4: 'advanced',
        5: 'elaborate',
    }

    function setAPIkey() {
        let enterAPIKey = prompt('Enter the API key you used to create TornStats here:');
        if (enterAPIKey !== null && enterAPIKey.trim() !== '') {
            localStorage.setItem('hf-tornstats-apiKey', enterAPIKey);
            alert('API key set succesfully');

            apiKey = enterAPIKey;
            if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('Remove API key', removeAPIKey);
        } else {
            alert('No valid API key entered!');
            if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('Set API key', setAPIkey);
        }
    }

    function removeAPIKey() {
        let wantToDelete = confirm('Are you sure you want to remove your API key?');

        if (wantToDelete) {
            localStorage.removeItem('hf-tornstats-apiKey');
            alert('API key successfully removed.');
        } else {
            alert('API key not removed.');
        }
    }

    // REST OF THE SCRIPT //

    function hookFetch(target) {
        if (!target || !target.fetch) return;

        const originalFetch = target.fetch;
        target.fetch = function (...args) {
            return originalFetch.apply(this, args).then(async (response) => {
                const cloned = response.clone();

                let text;
                try {
                    text = await cloned.text();
                } catch (e) {
                    text = '[Could not read response]';
                }

                let url = args[0];
                if (!url) return response;

                // If url is a Request object
                if (url instanceof Request) url = url.url;

                if (url.includes('usersNotInvolved')) {
                    try {
                        listenRecruitBtn(JSON.parse(text));
                    } catch (err) {
                        console.error('[HF] Failed to parse usersNotInvolved:', err);
                    }
                } else if (url.includes('crimeList')) {
                    try {
                        crimeList(JSON.parse(text));
                    } catch (err) {
                        console.error('[HF] Failed to parse crimeList:', err);
                    }
                }

                return response; // return original so site still works
            });
        };
    }


    async function handleUninvoled(data, uninvolvedEls, lists) {
        let statuses = await fetchMembers();

        for (let user of data.users) {
            let userId = user.userID;
            let status = statuses[userId];

            for (let element of uninvolvedEls) {
                let elementUserId = Number(element.href.replace('https://www.torn.com', '').replace('/profiles.php?XID=', ''));
                if (elementUserId === userId) {
                    let username = element.textContent;

                    let existingIcon = element.parentNode.querySelector('.hf-activity-icon');
                    if (existingIcon) break;

                    let icon = document.createElement('div');
                    icon.classList.add('hf-activity-icon');

                    if (status === 'Online') {
                        icon.style.backgroundPosition = '0 0';
                    } else if (status === 'Idle') {
                        icon.style.backgroundPosition = '-1098px 0';
                    } else if (status === 'Offline') {
                        icon.style.backgroundPosition = '-18px 0';
                    }

                    icon.addEventListener('click', function() {
                        createCPRmodal(username, userId);
                    });

                    element.parentNode.style.display = 'flex';
                    element.parentNode.style.alignItems = 'center';
                    element.parentNode.prepend(icon);
                    element.parentNode.parentNode.style.gridTemplateColumns = 'repeat(auto-fill, minmax(125px, 1fr))';

                    break;
                }
            }
        }

        for (let list of lists) {
            let a = list.querySelector('a');
            if (!a) list.style.display = 'none';
        }
    }

    async function listenRecruitBtn(data) {
        let recruitBtn = document.body.querySelector('.button___cwmLf');

        if (recruitBtn.classList.contains('active___ImR61')) {
            findCrimeRoot(data);
        } else {
            recruitBtn.addEventListener('click', function() {
                findCrimeRoot(data);
            });
        }
    }

    async function crimeList(data) {
        let loggedInUserId = JSON.parse(document.body.querySelector('#torn-user')?.value)?.id;

        let members = {};
        let existingMembers = localStorage.getItem('hf-cached-local-oc-data');
        if (existingMembers) {
            try {
                members = JSON.parse(existingMembers);
            } catch (e) {
                console.warn('[HF] Failed to parse existing members data');
                members = {};
            }
        }

        for (let crime of data.data) {
            let crimeName = crime.scenario.name;
            let roles = [];
            let cpr = {};

            let slots = crime.playerSlots;

            for (let slot of slots) {

                let position = slot.name.replace(/ #\d+$/, "");

                if (!roles.includes(position)) {
                    roles.push(position);
                }

                let userId = slot.player?.ID;
                if (!userId) {
                    members[loggedInUserId] = members[loggedInUserId] || {};
                    members[loggedInUserId][crimeName] = members[loggedInUserId][crimeName] || {};
                    members[loggedInUserId][crimeName][position] = slot.successChance;

                    continue;
                }

                cpr[userId] = slot.successChance;

                members[userId] = members[userId] || {};
                members[userId][crimeName] = members[userId][crimeName] || {};

                if (!members[userId][crimeName][position] || Number(members[userId][crimeName][position]) < Number(slot.successChance)) {
                    members[userId][crimeName][position] = slot.successChance;
                }
            }

            if (crimeName && crime.scenario.level && crime.scenario.difficultyTier) {
                crimeLevelData[crimeName] = {
                    'level': crime.scenario.level,
                    'difficulty': difficultyTiers[crime.scenario.difficultyTier],
                    'roles': roles,
                }
            }

            let crimeId = crime.ID;
            let crimeEl = await findOC(crimeId);

            let slotEls = crimeEl?.querySelectorAll('.slotBody___oxizq');
            if (!slotEls || slotEls.length < 2) continue;

            for (let slotEl of slotEls) {
                let wrapper = slotEl.parentNode;
                if (wrapper.classList.contains('waitingJoin___jq10k')) continue;

                let crimeName = wrapper.parentNode.parentNode.querySelector('.panelTitle___aoGuV')?.textContent;
                let role = wrapper.querySelector('.title___UqFNy')?.textContent.replace(/ #\d+$/, "");

                let a = slotEl.querySelector('.slotMenuItem___vkbGP');
                if (!a) continue;
                let userId = Number(a.href.replace('https://www.torn.com', '').replace('/profiles.php?XID=', ''));

                highlightCPR(cpr, userId, slotEl, crimeName, role);
                showCPRinfo(a.parentNode, userId);
            }
        }

        localData = members;
        localStorage.setItem('hf-cached-local-oc-data', JSON.stringify(localData));
        localStorage.setItem('hf-oc-level-data', JSON.stringify(crimeLevelData));

        if (settings.sendpersonaldata && settings.sendpersonaldata === 'true') sendToTornStats();
    }

    async function highlightCPR(cpr, userId, slotEl, crimeName, role) {
        let unavailable = false;

        let slotIcon = slotEl.parentNode.querySelector('.slotIcon___VVnQy');
        let svg = slotIcon?.querySelector('svg');
        let path = svg?.querySelector('path');

        if (path?.getAttribute('fill') === '#ff794c') unavailable = true;

        let active = document.body.querySelector('.active___ImR61').textContent;
        if (active === 'Completed') unavailable = false;

        let slotHeader = slotEl.parentNode.querySelector('.slotHeader___K2BS_');

        if (!settings[crimeName]) settings[crimeName] = {};
        if (!settings[crimeName][role]) settings[crimeName][role] = 65;

        if (settings.highlight === 'true' && (Number(cpr[userId]) < Number(settings[crimeName][role]) || unavailable === true)) {
            slotEl.style.background = 'var(--default-bg-17-gradient)'; // Red
            slotHeader.style.background = 'var(--default-bg-17-gradient)'; // Red
        }
    }

    async function showCPRinfo(slotMenu, userId) {
        let existingBtn = slotMenu.querySelector('.hf-cpr-data-btn');
        if (existingBtn) return;

        let span = document.createElement('span');
        span.textContent = 'CPR Data';
        span.classList.add('slotMenuItem___vkbGP');
        span.classList.add('hf-cpr-data-btn');
        slotMenu.prepend(span);

        let username = slotMenu.parentNode?.querySelector('.badge___E7fuw')?.textContent;
        if (!username) return;

        span.addEventListener('click', function() {
            createCPRmodal(username, userId);
        });
    }

    function fetchTornStatsData() {
        let apiUrl = `https://www.tornstats.com/api/v2/${apiKey}/faction/cpr`;

        GM[httpRequest]({
            method: 'GET',
            url: apiUrl,
            responseType: 'json',
            onload: function(response) {
                try {
                    response.response ??= JSON.parse(response.responseText); // In order for it to work with Torn PDA

                    let data = response.response;

                    tornStatsData = data.members;

                    localStorage.setItem('hf-cached-ts-oc-data', JSON.stringify(tornStatsData));
                } catch (error) {
                    console.warn('TornStats Error:', error);
                    return;
                }
            },
            onerror: function(response) {
                console.error('Error fetching TornStats data:', response);
            }
        });
    }

    // HELPER function to create the SETTINGS modal
    function createCPRmodal(username, userId, retries = 30) {
        let tornStats = true;

        let crimeData = tornStatsData[userId];
        if (!crimeData) {
            tornStats = false;
            if (localData && localData[userId]) crimeData = localData[userId];
        }

        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');

        let modal = document.createElement('div');
        modal.classList.add('hf-modal');
        document.body.appendChild(modal);

        // Prevent body scrolling
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        let cancelButton = document.createElement('button');
        cancelButton.textContent = '✕';
        cancelButton.classList.add('hf-cancel-btn');
        cancelButton.addEventListener('click', function () {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollY);
            modal.remove();
        });
        modal.appendChild(cancelButton);

        let titleContainer = document.createElement('div');
        titleContainer.textContent = `${username} CPR Data`;
        titleContainer.classList.add('hf-title');
        modal.appendChild(titleContainer);

        let subTitle = document.createElement('span');
        if (tornStats) {
            subTitle.textContent = 'Gathered by TornStats';
        } else if (crimeData) {
            subTitle.textContent = 'No TornStats data, using localStorage';
        } else {
            subTitle.textContent = 'No data found';
        }
        subTitle.classList.add('hf-subtitle');
        modal.appendChild(subTitle);

        let scrollContainer = document.createElement('div');
        scrollContainer.classList.add('hf-scroll-container');
        modal.appendChild(scrollContainer);

        let mainContainer = document.createElement('div');
        mainContainer.classList.add('hf-main-container');
        scrollContainer.appendChild(mainContainer);

        if (!crimeData) return;

        // Convert crimeData into an array so we can sort
        let crimes = Object.keys(crimeData).map(crime => {
            if (!crimeLevelData[crime]) {
                crimeLevelData[crime] = { level: 0, difficulty: 'unknown' };
            }

            let level = crimeLevelData[crime].level;
            let difficulty = crimeLevelData[crime].difficulty;
            let difficultyTier = Number(Object.keys(difficultyTiers).find(
                key => difficultyTiers[key] === difficulty
            )) || 0; // unknown = 0

            return { crime, level, difficulty, difficultyTier };
        });

        // Sort: difficultyTier high → low, then level high → low
        crimes.sort((a, b) => {
            if (a.difficultyTier !== b.difficultyTier) {
                return b.difficultyTier - a.difficultyTier;
            }
            return b.level - a.level;
        });

        // Now loop in sorted order
        for (let { crime, level, difficulty } of crimes) {
            if (settings[crime] && settings[crime].hidden && settings[crime].hidden === 'true') continue;

            let crimeContainer = document.createElement('div');
            crimeContainer.classList.add('hf-crime-container');
            crimeContainer.classList.add(`hf-${difficulty}`);
            mainContainer.appendChild(crimeContainer);

            let crimeTitle = document.createElement('span');
            crimeTitle.textContent = `${crime} (${level})`;
            crimeTitle.classList.add('hf-crime-title');
            crimeTitle.classList.add(`hf-${difficulty}`);
            crimeContainer.appendChild(crimeTitle);

            if (difficulty === 'unknown') crimeTitle.title = `Find this crime in any planned/finished crimes to complete the data`;

            let scoreContainer = document.createElement('div');
            scoreContainer.classList.add('hf-crime-score-container');
            crimeContainer.appendChild(scoreContainer);

            let roles = Object.entries(crimeData[crime]); // [[role1, 10], [role2, 5], [role3, 15]]

            // Sort by score descending
            roles.sort((a, b) => b[1] - a[1]);

            // Iterate over sorted roles
            for (let [role, score] of roles) {
                let score = Number(crimeData[crime][role]);

                let roleContainer = document.createElement('div');
                roleContainer.classList.add('hf-role-container');

                if (!settings[crime]) settings[crime] = {};
                if (!settings[crime][role]) settings[crime][role] = 65;

                if (score >= 75) {
                    roleContainer.classList.add('hf-good-cpr');
                } else if (score >= 50) {
                    roleContainer.classList.add('hf-medium-cpr');
                } else {
                    roleContainer.classList.add('hf-bad-cpr');
                }

                let roleSpan = document.createElement('span');
                roleSpan.textContent = role;
                roleSpan.classList.add('hf-crime-role-span');
                roleContainer.appendChild(roleSpan);

                let scoreSpan = document.createElement('span');
                scoreSpan.textContent = score;
                scoreSpan.classList.add('hf-crime-score-span');
                roleContainer.appendChild(scoreSpan);

                scoreContainer.appendChild(roleContainer);
            }
        }

        return modal;
    }

    async function findOC(neededId, retries = 30) {
        let crimes = document.body.querySelectorAll('.wrapper___U2Ap7');
        if (!crimes || crimes.length < 3) {
            if (retries > 0) {
                return new Promise(resolve =>
                                   setTimeout(() => resolve(findOC(neededId, retries - 1)), 100)
                                  );
            } else {
                console.warn('[HF] Gave up looking for OCs after 30 retries.');
                return null;
            }
        }

        for (let crime of crimes) {
            let crimeId = crime.getAttribute('data-oc-id');
            if (neededId == crimeId) return crime;
        }
    }

    async function findCrimeRoot(data, retries = 30) {
        let crimeRoot = document.body.querySelector('#faction-crimes-root');
        if (!crimeRoot) {
            if (retries > 0) {
                setTimeout(() => findCrimeRoot(data, retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for crime root after 30 retries.');
            }
            return;
        }

        createObserver(crimeRoot, data);
    }

    async function findUninvolved(node, info, retries = 30) {
        let uninvolved = node.querySelectorAll('.list___dkw9S .item___kkKxv a');
        if (!uninvolved || uninvolved.length < 1) {
            if (retries > 0) {
                setTimeout(() => findUninvolved(node, info, retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for uninvolveds after 30 retries.');
                return;
            }
        }

        let lists = node.querySelectorAll('.list___dkw9S .item___kkKxv');

        handleUninvoled(info, uninvolved, lists);
    }

    async function fetchMembers() {
        let currentEpoch = Math.floor(Date.now() / 1000);
        let fromTimestamp = currentEpoch - (7 * 24 * 60 * 60); // One week ago

        let apiUrl = `https://api.torn.com/v2/faction/members?striptags=true&key=${apiKey}`;

        try {
            let response = await fetch(apiUrl);
            let data = await response.json();

            let statuses = {};
            for (let member of data.members) {
                statuses[member.id] = member.last_action.status;
            }

            return statuses;
        } catch (error) {
            console.error('Error fetching data: ' + error);
            return {}; // return empty object on error
        }
    }

    function addSettingsTab(retries = 30) {
        let btnContainer = document.body.querySelector('.buttonsContainer___aClaa');
        let contentArea = document.getElementById('oc-content-area');

        if (!contentArea) contentArea = document.body.querySelector('.wrapper___U2Ap7')?.parentNode;

        if (!btnContainer || !contentArea) {
            if (retries > 0) {
                setTimeout(() => addSettingsTab(retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for the button container after 30 retries.');
            }
            return;
        }

        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');

        let otherButtons = btnContainer.querySelectorAll('.button___cwmLf');

        let wrappers = contentArea.querySelectorAll(':scope > div');

        let div = document.createElement('div');
        div.classList.add('hf-cpr-config-container');
        contentArea.appendChild(div);

        showSettings(div);

        let button = document.createElement('button');
        button.textContent = 'CPR Configuration';
        if (mobile) button.textContent = 'CPR';
        button.classList.add('button___cwmLf');
        button.classList.add('hf-cpr-config-btn');
        btnContainer.appendChild(button);

        btnContainer.addEventListener('click', function(e) {
            const clicked = e.target.closest('.button___cwmLf');
            if (!clicked) return;

            if (clicked !== button) {
                button.classList.remove('active___ImR61');
                div.classList.remove('hf-active');
            }
        });


        button.addEventListener('click', function() {
            for (let button of otherButtons) {
                if (button.classList.contains('active___ImR61')) button.classList.remove('active___ImR61');
            }

            for (let wrapper of wrappers) {
                if (wrapper.classList.contains('hf-cpr-config-container')) continue;
                wrapper.style.display = 'none';
            }

            button.classList.add('active___ImR61');
            div.classList.add('hf-active');
        });
    }

    function showSettings(element) {
        let mobile = !document.body.querySelector('.searchFormWrapper___LXcWp');

        let titleContainer = document.createElement('div');
        titleContainer.classList.add('hf-title-container');
        element.appendChild(titleContainer);

        let title = document.createElement('div');
        title.textContent = `CPR Requirements Configuration`;
        if (mobile) title.textContent = `CPR Requirements Config`;
        title.classList.add('hf-title');
        titleContainer.appendChild(title);

        let subTitle = document.createElement('span');
        subTitle.textContent = 'Configure minimum CPR requirements for each crime and role';
        subTitle.classList.add('hf-subtitle');
        titleContainer.appendChild(subTitle);

        let mainContainer = document.createElement('div');
        mainContainer.classList.add('hf-main-container');
        element.appendChild(mainContainer);

        let deleteKey = document.createElement('span');
        deleteKey.classList.add('hf-remove-key-span');
        deleteKey.textContent = 'Remove your API key';
        deleteKey.addEventListener('click', function() {
            removeAPIKey();
        });
        mainContainer.appendChild(deleteKey);

        let toggleContainer = document.createElement('div');
        toggleContainer.classList.add('hf-toggle-container');
        mainContainer.appendChild(toggleContainer);

        let highlightToggle = addToggle(toggleContainer, 'Highlight unavailable and unfit members', 'highlight');
        highlightToggle.addEventListener('change', function () {
            if (highlightToggle.checked) {
                settings.highlight = 'true';
            } else {
                settings.highlight = 'false';
            }

            localStorage.setItem('hf-oc-cpr-settings', JSON.stringify(settings));
        });

        let sendToTSToggle = addToggle(toggleContainer, 'Send your personal CPR data to TornStats', 'sendpersonaldata');
        sendToTSToggle.addEventListener('change', function () {
            if (sendToTSToggle.checked) {
                settings.sendpersonaldata = 'true';
            } else {
                settings.sendpersonaldata = 'false';
            }

            localStorage.setItem('hf-oc-cpr-settings', JSON.stringify(settings));
        });

        let crimeArray = Object.entries(crimeLevelData);

        let tierValues = Object.fromEntries(
            Object.entries(difficultyTiers).map(([key, value]) => [value, Number(key)])
        );

        crimeArray.sort((a, b) => {
            let crimeA = a[1];
            let crimeB = b[1];

            // Sort by difficulty tier (high → low)
            let diffA = tierValues[crimeA.difficulty] || 0;
            let diffB = tierValues[crimeB.difficulty] || 0;
            if (diffB !== diffA) return diffB - diffA;

            // Sort by level (high → low)
            return Number(crimeB.level) - Number(crimeA.level);
        });

        // Convert back to object if needed
        let sortedCrimeData = Object.fromEntries(crimeArray);

        for (let crimeName in sortedCrimeData) {

            if (!settings[crimeName]) settings[crimeName] = {};

            let crime = sortedCrimeData[crimeName];

            if (!crime.roles || crime.roles.length < 2) continue;

            let crimeContainer = document.createElement('div');
            crimeContainer.classList.add('hf-crime-container');
            crimeContainer.classList.add(`hf-${crime.difficulty}`);
            mainContainer.appendChild(crimeContainer);

            let crimeTitleContainer = document.createElement('div');
            crimeTitleContainer.classList.add('hf-crime-title-container');
            crimeContainer.appendChild(crimeTitleContainer);

            let crimeTitle = document.createElement('span');
            crimeTitle.textContent = `${crimeName} (${crime.level})`;
            crimeTitle.classList.add('hf-crime-title');
            crimeTitle.classList.add(`hf-${crime.difficulty}`);
            crimeTitleContainer.appendChild(crimeTitle);

            let scoreContainer = document.createElement('div');
            scoreContainer.classList.add('hf-crime-score-container');
            crimeContainer.appendChild(scoreContainer);

            let hideShowBtn = document.createElement('div');
            let hidden = false;
            if (!settings[crimeName].hidden) settings[crimeName].hidden = false;
            if (settings[crimeName].hidden === 'true') hidden = true;

            hideShowBtn.classList.add('hf-oc-hide-show-btn');

            function updateState() {
                scoreContainer.classList.toggle('hf-hidden', hidden);
                settings[crimeName].hidden = hidden ? 'true' : 'false';
                localStorage.setItem('hf-oc-cpr-settings', JSON.stringify(settings));

                hideShowBtn.innerHTML = hidden
                    ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="feather feather-eye-off">
                     <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8
                     a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4
                     c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19
                     m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                     <line x1="1" y1="1" x2="23" y2="23"></line></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="feather feather-eye">
                     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11
                     8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
            }

            updateState();
            hideShowBtn.addEventListener('click', function () {
                hidden = !hidden;
                updateState();
            });

            crimeTitleContainer.appendChild(hideShowBtn);

            for (let role of crime.roles) {
                let roleContainer = document.createElement('div');
                roleContainer.classList.add('hf-role-container');
                scoreContainer.appendChild(roleContainer);

                let roleSpan = document.createElement('span');
                roleSpan.textContent = role;
                roleSpan.classList.add('hf-crime-role-span');
                roleContainer.appendChild(roleSpan);

                let scoreInput = createNumberInput(crimeName, role, crimeContainer);
                scoreInput.classList.add('hf-crime-score-input');
                roleContainer.appendChild(scoreInput);
            }
        }
    }

    function createNumberInput(crimeName, role, element) {
        let className = crimeName.toLowerCase().replace(/\s+/g, '-');

        if (!settings[crimeName][role]) {
            settings[crimeName][role] = 65;
            localStorage.setItem('hf-oc-cpr-settings', JSON.stringify(settings));
        }

        let input = document.createElement('input');
        input.classList.add('hf-number-input');
        input.classList.add(className);
        input.type = 'number';
        input.min = 1;
        input.max = 100;
        input.value = settings[crimeName][role] || 65;

        element.appendChild(input);

        input.addEventListener('input', function () {
            settings[crimeName][role] = input.value;
            localStorage.setItem('hf-oc-cpr-settings', JSON.stringify(settings));
        });

        return input;
    }

    function addToggle(element, content, settingsName) {
        let container = document.createElement('div');
        container.classList.add('hf-toggle-subcontainer');

        let label = document.createElement('label');
        label.classList.add('hf-switch');

        let text = document.createElement('span');
        text.classList.add('hf-input-text');
        text.textContent = content;

        let input = document.createElement('input');
        input.type = 'checkbox';
        input.classList.add('hf-checkbox');

        let slider = document.createElement('span');
        slider.classList.add('hf-slider', 'round');

        if (settings[settingsName] === 'true') input.checked = true;

        label.appendChild(input);
        label.appendChild(slider);

        container.appendChild(label);
        container.appendChild(text);

        element.appendChild(container);

        return input;
    }

    // HELPER function to create a mutation observer and check nerve
    function createObserver(element, info) {
        let target;
        target = element;

        if (!target) {
            console.error(`[HF] Mutation Observer target not found.`);
            return;
        }

        let observer = new MutationObserver(function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.classList && node.classList.contains('notInvolvedMembers___ifZnn')) {
                            findUninvolved(node, info);
                        }
                    });
                }
            }
        });

        let config = { attributes: true, childList: true, subtree: true, characterData: true };
        observer.observe(target, config);
    }

    function sendToTornStats() {
        let userId = JSON.parse(document.body.querySelector('#torn-user')?.value)?.id;
        let data = localData[userId];

        let apiUrl = `https://www.tornstats.com/api/v2/${apiKey}/crime_pass_rates/store`;

        GM[httpRequest]({
            method: 'POST',
            url: apiUrl,
            responseType: 'json',
            onload: function(response) {
                try {
                    console.log('Personal CPR data sent to TornStats');
                } catch (error) {
                    console.warn('TornStats Error:', error);
                    return;
                }
            },
            onerror: function(response) {
                console.error('Error fetching TornStats data:', response);
            }
        });
    }

    function addStyle(css) {
        let style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
    }

    function runScript() {
        if (document.hfOCTrackCpr) return;

        if (window.location.href.includes('factions') && window.location.href.includes('tab=crimes')) {
            document.hfOCTrackCpr = true;

            hookFetch(window);
            if (typeof unsafeWindow !== 'undefined') hookFetch(unsafeWindow);

            fetchTornStatsData();
            addSettingsTab();
        } else {
            document.hfOCTrackCpr = false;
        }
    }

    runScript();

    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            runScript();
        }
    }).observe(document, {subtree: true, childList: true});

    // Styles
    addStyle(`
      .hf-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px 20px 0px 20px;
        background-color: var(--sidebar-area-bg-attention);
        border: 2px solid var(--default-tabs-color);
        border-radius: 15px;
        max-width: fit-content;
        width: 60vw;
        z-index: 9999;
        max-height: 75vh;
        display: flex;
        flex-direction: column;
        line-height: normal;
      }

      .hf-cancel-btn {
        position: absolute;
        right: 10px;
        top: -10px;
        cursor: pointer;
        background-color: #CCC;
        color: black;
        border-radius: 99px;
        z-index: 9;
        font-size: medium;
      }

      .hf-title-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 auto;
      }

      .hf-title {
        font-size: x-large;
        font-weight: bolder;
        text-align: center;
        text-wrap: balance;
      }

      .hf-subtitle {
        text-align: center;
        padding-bottom: 8px;
        padding-top: 4px;
      }

      .hf-scroll-container {
        max-height: 100%;
        flex: 1;
        overflow-y: auto;
        margin-top: 8px;
        padding-bottom: 20px;
      }

      .hf-main-container {
        margin: 0 auto;
        display: flex;
        flex-direction: column;
      }

      .hf-crime-title-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .hf-crime-container {
        background: #516574;
        border-radius: 5px;
        margin: 5px;
        border-left: 4px solid grey;
        padding: 8px;
      }

      .hf-crime-title {
        font-size: 15px;
        font-weight: bold;
      }

      .hf-crime-score-container {
        padding-top: 8px;
        margin-bottom: -4px;
      }

      .hf-crime-score-container.hf-hidden {
        display: none;
      }

      .hf-role-container {
        padding: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 2px solid #989898;
        border-radius: 5px;
        margin-bottom: 6px;
        background: #647b8c
      }

      .hf-crime-score-span {
        font-weight: bold;
      }

      .hf-crime-role-span {
        color: white;
      }

      .hf-crime-score-input {
        padding: 5px;
        border-radius: 5px;
        border: 1px solid #ccc;
        width: 35px;
        height: 5px;
        margin-left: 5px;
        background: #516574;
        color: #fff;
      }

      .hf-cpr-icon {
        cursor: pointer;
        margin-right: 10px;
      }

      .hf-oc-hide-show-btn {
        cursor: pointer;
        display: flex;
      }

      .hf-oc-hide-show-btn svg {
        width: 20px;
        height: 20px;
      }

      .hf-bad-cpr {
        background: #ff794c40;
      }

      .hf-bad-cpr .hf-crime-score-span {
        color: #ff794c !important;
      }

      .hf-medium-cpr {
        background: #fcc41940;
      }

      .hf-medium-cpr .hf-crime-score-span {
        color: #fcc419 !important;
      }

      .hf-good-cpr {
        background: #94d82d40;
      }

      .hf-good-cpr .hf-crime-score-span {
        color: #94d82d !important;
      }

      .hf-crime-title.hf-introductory {
       color: #8ce99a;
      }

      .hf-crime-container.hf-introductory {
        border-color: #8ce99a !important;
      }

      .hf-crime-title.hf-simple {
        color: #ffe066;
      }

      .hf-crime-container.hf-simple {
        border-color: #ffe066 !important;
      }

      .hf-crime-title.hf-intermediate {
        color: #ffa94d;
      }

      .hf-crime-container.hf-intermediate {
        border-color: #ffa94d !important;
      }

      .hf-crime-title.hf-advanced {
        color: #ff8787;
      }

      .hf-crime-container.hf-advanced {
        border-color: #ff8787 !important;
      }

      .hf-crime-title.hf-elaborate {
        color: #b197fc;
      }

      .hf-crime-container.hf-elaborate {
        border-color: #b197fc !important;
      }

      .hf-crime-title.hf-unknown {
        color: #9e9e9e;
      }

      .hf-crime-container.hf-unknown {
        border-color: #9e9e9e !important;
      }

      .hf-activity-icon {
        background-image: url(https://www.torn.com/images/v2/svg_icons/sprites/user_status_icons_sprite.svg);
        height: 17px;
        width: 17px;
        margin-right: 4px;
        cursor: pointer;
      }

      .hf-cpr-config-btn {
        font-size: 12px;
      }

      .hf-cpr-config-container {
        width: max-content;
        max-width: 90vw;
        justify-self: center;
        display: none;
        margin: 0 auto;
      }

      .hf-cpr-config-container.hf-active {
        display: block !important;
      }

      .hf-toggle-container {
        align-self: center;
        padding: 8px;
        display: flex;
        flex-direction: column;
      }

      .hf-toggle-subcontainer {
        padding-bottom: 4px;
      }

      .hf-input-text {
        padding-left: 5px;
      }

      .hf-switch {
        position: relative;
        display: inline-block;
        width: 20px;
        height: 10px;
        top: 1px;
      }

      .hf-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .hf-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #ccc;
        transition: .4s;
      }

      .hf-slider:before {
        position: absolute;
        content: "";
        height: 10px;
        width: 10px;
        background-color: white;
        transition: .4s;
      }

      input:checked + .hf-slider {
        background-color: #2196F3;
      }

      input:focus + .hf-slider {
        box-shadow: 0 0 1px #2196F3;
      }

      input:checked + .hf-slider:before {
        transform: translateX(10px);
      }

      .hf-slider.round {
        border-radius: 34px;
      }

      .hf-slider.round:before {
        border-radius: 50%;
      }

      .hf-remove-key-span {
        color: var(--default-blue-color);
        padding: 4px;
        align-self: center;
        cursor: pointer;
      }
    `);

    let colorScheme = {
        "bad-cpr": "#ff794c",
        "medium-cpr": "#fcc419",
        "good-cpr": "#94d82d",
        "introductory": "#8ce99a",
        "simple": "#ffe066",
        "intermediate": "#ffa94d",
        "advanced": "#ff8787",
        "elaborate": "#b197fc",
    };
})();