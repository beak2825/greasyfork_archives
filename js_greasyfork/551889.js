// ==UserScript==
// @name         FunnyJunk Ultimate Thumb Manager
// @namespace    http://tampermonkey.net/
// @version      9.1
// @description  Automated Thumbs Up/Down. Fixes issue where the checked comment itself was skipped.
// @author       Emanon
// @match        https://*.funnyjunk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551889/FunnyJunk%20Ultimate%20Thumb%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/551889/FunnyJunk%20Ultimate%20Thumb%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- STATE VARIABLES ---
    let isRunning = false;
    let currentMode = 'skip';
    let permanentBlocklist = new Set();
    let tempTargetSet = new Set();
    let isListExpanded = false;

    // --- STORAGE ---
    function loadBlocklist() {
        try {
            const saved = localStorage.getItem('fj_user_blocklist');
            if (saved) {
                permanentBlocklist = new Set(JSON.parse(saved));
            }
        } catch (e) {
            console.error("FJ Manager: Error loading list. Resetting.", e);
            permanentBlocklist = new Set();
        }
    }

    function saveBlocklist() {
        try {
            localStorage.setItem('fj_user_blocklist', JSON.stringify(Array.from(permanentBlocklist)));
            renderBlocklistUI();
        } catch (e) {
            console.error("FJ Manager: Could not save list.", e);
        }
    }

    loadBlocklist();

    // --- HELPER: CLEAN USERNAME ---
    function getUsernameFromLink(linkElement) {
        if (!linkElement) return null;
        const href = linkElement.getAttribute('href');
        if (!href) return null;
        const match = href.match(/\/user\/([^\/]+)/);
        if (match && match[1]) {
            return match[1].toLowerCase();
        }
        return null;
    }

    function addToBlocklist(username) {
        if (!username) return;
        username = username.toLowerCase().trim();
        permanentBlocklist.add(username);
        saveBlocklist();
    }

    function removeFromBlocklist(username) {
        permanentBlocklist.delete(username);
        saveBlocklist();
    }

    // --- HELPER: HUMAN CLICK SIMULATION ---
    function triggerHumanClick(element) {
        if (!element) return;
        const events = ['mouseover', 'mousedown', 'mouseup', 'click'];
        events.forEach(eventType => {
            const event = new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(event);
        });
    }

    // --- 1. SCAN & INJECT ---
    function performScan() {
        const thumbs = document.querySelectorAll('.thUp');
        const usersOnPage = new Set();
        let injectedCount = 0;

        thumbs.forEach(thumb => {
            const container = thumb.closest('div[id^="c"]');
            if (!container) return;

            const userLink = container.querySelector('a[href*="/user/"]');
            if(userLink) {
                const cleanName = getUsernameFromLink(userLink);
                if(cleanName) usersOnPage.add(cleanName);

                if (!container.querySelector('.fj-auto-checkbox')) {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'fj-auto-checkbox';
                    checkbox.dataset.cleanName = cleanName;

                    checkbox.style.marginRight = '8px';
                    checkbox.style.cursor = 'pointer';
                    checkbox.style.width = '18px';
                    checkbox.style.height = '18px';
                    checkbox.style.accentColor = 'red';
                    checkbox.style.verticalAlign = 'middle';
                    checkbox.title = `Target User: ${cleanName}`;

                    userLink.parentNode.insertBefore(checkbox, userLink);
                    injectedCount++;
                }
            }
        });

        updatePageUserDropdown(usersOnPage);
        return injectedCount;
    }

    // --- 2. BUILD TEMP LIST ---
    function buildTempList() {
        tempTargetSet.clear();
        const checkedBoxes = document.querySelectorAll('.fj-auto-checkbox:checked');
        checkedBoxes.forEach(box => {
            const name = box.dataset.cleanName;
            if (name) tempTargetSet.add(name);
        });
    }

    // --- 3. CLICK ENGINE ---
    function clickNextThumb() {
        if (!isRunning) return;

        const thumbs = document.querySelectorAll('.thUp:not([data-processed])');
        const visibleThumbs = Array.from(thumbs).filter(el => el.offsetParent !== null);

        if (visibleThumbs.length > 0) {
            const upBtn = visibleThumbs[0];
            const container = upBtn.closest('div[id^="c"]');

            let currentName = null;
            let isDirectlyChecked = false; // NEW: Check specifically for this comment's box

            if (container) {
                const userLink = container.querySelector('a[href*="/user/"]');
                currentName = getUsernameFromLink(userLink);

                // DIRECT CHECK: Is the checkbox next to this specific comment checked?
                const localCheckbox = container.querySelector('.fj-auto-checkbox');
                if (localCheckbox && localCheckbox.checked) {
                    isDirectlyChecked = true;
                }
            }

            const isPermBlocked = currentName && permanentBlocklist.has(currentName);
            const isTempBlocked = currentName && tempTargetSet.has(currentName);

            // LOGIC UPDATE: Target if blocked OR if this specific box is checked
            const isTargeted = isPermBlocked || isTempBlocked || isDirectlyChecked;

            if (isTargeted) {
                // TARGET FOUND
                if (currentMode === 'downvote') {
                    // 1. Calculate Down ID
                    let downBtn = null;
                    if (upBtn.id && upBtn.id.startsWith('up_')) {
                        const downId = upBtn.id.replace('up_', 'dn_');
                        downBtn = document.getElementById(downId);
                    }
                    if (!downBtn && container) {
                         downBtn = container.querySelector('.thDn');
                    }

                    if (downBtn) {
                        // 2. CHECK STATE (Prevent toggling off)
                        const isActive = downBtn.className.includes('_i') || downBtn.classList.length > 1;
                        if (isActive) {
                            console.log(`Target ${currentName} already downvoted. Skipping.`);
                            upBtn.setAttribute('data-processed', 'true');
                        } else {
                            triggerHumanClick(downBtn);
                            console.log(`DOWNVOTED: ${currentName}`);
                            upBtn.setAttribute('data-processed', 'true');
                        }
                    } else {
                        console.log(`Target found (${currentName}) but NO down button. Skipping.`);
                        upBtn.setAttribute('data-processed', 'true');
                    }
                } else {
                    // Skip
                    console.log(`SKIPPING: ${currentName}`);
                    upBtn.setAttribute('data-processed', 'true');
                }
            } else {
                // NEUTRAL USER (Upvote)
                const isUpActive = upBtn.className.includes('_i') || upBtn.classList.length > 1;
                if (!isUpActive) {
                    triggerHumanClick(upBtn);
                } else {
                    upBtn.setAttribute('data-processed', 'true');
                }
            }

            statusText.innerText = `Scan: ${visibleThumbs.length - 1} left`;
            setTimeout(clickNextThumb, 150);
        } else {
            finishClicking();
        }
    }

    function finishClicking() {
        isRunning = false;
        statusText.innerText = 'Finished!';
        mainPanel.style.borderColor = '#4CAF50';
        setTimeout(() => {
            statusText.innerText = 'Ready';
        }, 3000);
    }

    function toggleProcess() {
        if (isRunning) {
            isRunning = false;
            statusText.innerText = 'Stopped';
            return;
        }

        performScan();
        buildTempList();

        statusText.innerText = 'Running...';
        mainPanel.style.borderColor = '#FF0000';
        isRunning = true;
        clickNextThumb();
    }

    // --- 4. UI CONSTRUCTION ---

    // --- RESTORE BUTTON (Hidden by default) ---
    const restoreBtn = document.createElement('div');
    restoreBtn.innerText = 'M';
    Object.assign(restoreBtn.style, {
        position: 'fixed', top: '50px', right: '10px', zIndex: '9999',
        backgroundColor: 'rgba(76, 175, 80, 0.7)', color: 'white',
        width: '30px', height: '30px', borderRadius: '50%',
        display: 'none', justifyContent: 'center', alignItems: 'center',
        cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
    });
    restoreBtn.title = 'Restore Manager';

    // --- MAIN PANEL ---
    const mainPanel = document.createElement('div');
    Object.assign(mainPanel.style, {
        position: 'fixed', top: '50px', right: '10px', zIndex: '10000',
        backgroundColor: '#222', color: 'white', padding: '10px',
        borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        fontFamily: 'Arial, sans-serif', fontSize: '12px', width: '220px',
        border: '2px solid #4CAF50', display: 'flex', flexDirection: 'column', gap: '8px'
    });

    function minimizePanel() {
        mainPanel.style.display = 'none';
        restoreBtn.style.display = 'flex';
    }

    function restorePanel() {
        mainPanel.style.display = 'flex';
        restoreBtn.style.display = 'none';
    }

    restoreBtn.addEventListener('click', restorePanel);

    const headerRow = document.createElement('div');
    headerRow.style.display = 'flex';
    headerRow.style.justifyContent = 'space-between';
    headerRow.style.alignItems = 'center';

    const statusText = document.createElement('div');
    statusText.innerText = 'Ready';
    statusText.style.fontWeight = 'bold';
    statusText.style.fontSize = '14px';

    const minBtn = document.createElement('div');
    minBtn.innerText = '_';
    minBtn.style.cursor = 'pointer';
    minBtn.style.fontWeight = 'bold';
    minBtn.style.padding = '0 5px';
    minBtn.style.color = '#aaa';
    minBtn.title = "Hide Panel";
    minBtn.style.border = '1px solid #555';
    minBtn.style.borderRadius = '3px';
    minBtn.addEventListener('click', minimizePanel);

    headerRow.appendChild(statusText);
    headerRow.appendChild(minBtn);

    const btn = document.createElement('button');
    btn.innerText = 'START / STOP';
    Object.assign(btn.style, {
        backgroundColor: '#4CAF50', color: 'white', border: 'none',
        padding: '8px', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px'
    });
    btn.addEventListener('click', toggleProcess);

    const modeSelect = document.createElement('select');
    modeSelect.style.padding = '5px';
    const optSkip = new Option('Mode: Skip Targets', 'skip');
    const optDown = new Option('Mode: Downvote Targets', 'downvote');
    modeSelect.add(optSkip);
    modeSelect.add(optDown);
    modeSelect.addEventListener('change', (e) => currentMode = e.target.value);

    const divider = document.createElement('hr');
    divider.style.width = '100%';
    divider.style.borderColor = '#555';
    divider.style.margin = '5px 0';

    const listHeader = document.createElement('div');
    listHeader.innerText = 'Permanent List [+]';
    listHeader.style.fontWeight = 'bold';
    listHeader.style.cursor = 'pointer';
    listHeader.style.userSelect = 'none';
    listHeader.style.padding = '5px';
    listHeader.style.backgroundColor = '#333';
    listHeader.style.borderRadius = '4px';
    listHeader.style.textAlign = 'center';

    const listContent = document.createElement('div');
    listContent.style.display = 'none';
    listContent.style.flexDirection = 'column';
    listContent.style.gap = '8px';

    listHeader.addEventListener('click', () => {
        isListExpanded = !isListExpanded;
        if (isListExpanded) {
            listContent.style.display = 'flex';
            listHeader.innerText = 'Permanent List [-]';
        } else {
            listContent.style.display = 'none';
            listHeader.innerText = 'Permanent List [+]';
        }
    });

    const refreshRow = document.createElement('div');
    refreshRow.style.display = 'flex';
    refreshRow.style.gap = '5px';

    const pageUserSelect = document.createElement('select');
    pageUserSelect.style.width = '100%';
    pageUserSelect.innerHTML = '<option value="">-- Load Users --</option>';

    const refreshBtn = document.createElement('button');
    refreshBtn.innerText = '⟳';
    refreshBtn.title = 'Scan page for new users';
    refreshBtn.style.cursor = 'pointer';
    refreshBtn.style.fontWeight = 'bold';
    refreshBtn.addEventListener('click', () => {
        const count = performScan();
        statusText.innerText = `Scanned ${count || 'page'}`;
        setTimeout(() => { if(!isRunning) statusText.innerText = 'Ready'; }, 2000);
    });

    refreshRow.appendChild(pageUserSelect);
    refreshRow.appendChild(refreshBtn);

    const addFromPageBtn = document.createElement('button');
    addFromPageBtn.innerText = 'Add Selected User';
    addFromPageBtn.style.cursor = 'pointer';
    addFromPageBtn.addEventListener('click', () => {
        if(pageUserSelect.value) {
            addToBlocklist(pageUserSelect.value);
            pageUserSelect.value = "";
        }
    });

    const manualInput = document.createElement('input');
    manualInput.placeholder = 'Type username...';
    manualInput.style.width = '95%';

    const addManualBtn = document.createElement('button');
    addManualBtn.innerText = 'Add Manual User';
    addManualBtn.style.cursor = 'pointer';
    addManualBtn.addEventListener('click', () => {
        if(manualInput.value) {
            addToBlocklist(manualInput.value);
            manualInput.value = '';
        }
    });

    const blocklistView = document.createElement('div');
    Object.assign(blocklistView.style, {
        maxHeight: '100px', overflowY: 'auto', backgroundColor: '#333',
        padding: '5px', borderRadius: '4px', border: '1px solid #555'
    });

    function renderBlocklistUI() {
        blocklistView.innerHTML = '';
        if (permanentBlocklist.size === 0) {
            blocklistView.innerText = '(List empty)';
            return;
        }
        permanentBlocklist.forEach(user => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.justifyContent = 'space-between';
            row.style.marginBottom = '2px';

            const nameSpan = document.createElement('span');
            nameSpan.innerText = user;

            const delBtn = document.createElement('span');
            delBtn.innerText = '❌';
            delBtn.style.cursor = 'pointer';
            delBtn.onclick = () => removeFromBlocklist(user);

            row.appendChild(nameSpan);
            row.appendChild(delBtn);
            blocklistView.appendChild(row);
        });
    }

    function updatePageUserDropdown(usersSet) {
        const previousVal = pageUserSelect.value;
        pageUserSelect.innerHTML = '<option value="">-- Select from Page --</option>';
        const sortedUsers = Array.from(usersSet).sort();

        if (sortedUsers.length === 0) {
             pageUserSelect.innerHTML = '<option value="">No users found yet</option>';
        }

        sortedUsers.forEach(user => {
            const opt = new Option(user, user);
            pageUserSelect.add(opt);
        });

        if (usersSet.has(previousVal)) {
            pageUserSelect.value = previousVal;
        }
    }

    // --- ASSEMBLE ---
    mainPanel.appendChild(headerRow);
    mainPanel.appendChild(btn);
    mainPanel.appendChild(modeSelect);
    mainPanel.appendChild(divider);
    mainPanel.appendChild(listHeader);

    listContent.appendChild(refreshRow);
    listContent.appendChild(addFromPageBtn);
    listContent.appendChild(manualInput);
    listContent.appendChild(addManualBtn);
    listContent.appendChild(blocklistView);

    mainPanel.appendChild(listContent);

    document.body.appendChild(restoreBtn);
    document.body.appendChild(mainPanel);

    // Init
    renderBlocklistUI();
    setTimeout(performScan, 2000);

})();