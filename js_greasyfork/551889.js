// ==UserScript==
// @name         FunnyJunk Ultimate Manager (Collapsed Default)
// @namespace    http://tampermonkey.net/
// @version      7.1
// @description  Automated Thumbs Up/Down with ID matching. Permanent list is hidden by default.
// @author       Coding Partner
// @match        https://*.funnyjunk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551889/FunnyJunk%20Ultimate%20Manager%20%28Collapsed%20Default%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551889/FunnyJunk%20Ultimate%20Manager%20%28Collapsed%20Default%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- STATE VARIABLES ---
    let isRunning = false;
    let currentMode = 'skip';
    let permanentBlocklist = new Set();
    let tempTargetSet = new Set();
    let isListExpanded = false; // CHANGED: Default is now FALSE (Closed)

    // Load saved list
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

    // --- STORAGE MANAGEMENT ---
    function loadBlocklist() {
        const saved = localStorage.getItem('fj_user_blocklist');
        if (saved) {
            permanentBlocklist = new Set(JSON.parse(saved));
        }
    }

    function saveBlocklist() {
        localStorage.setItem('fj_user_blocklist', JSON.stringify(Array.from(permanentBlocklist)));
        renderBlocklistUI();
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

    // --- 1. SCAN & INJECT ---
    function performScan() {
        const thumbs = document.querySelectorAll('.thUp');
        const usersOnPage = new Set();
        let injectedCount = 0;

        thumbs.forEach(thumb => {
            const container = thumb.closest('div[id^="c"]');
            if (!container) return;

            // 1. Find User Logic
            const userLink = container.querySelector('a[href*="/user/"]');
            if(userLink) {
                const cleanName = getUsernameFromLink(userLink);
                if(cleanName) usersOnPage.add(cleanName);

                // 2. Inject Checkbox if missing
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

    // --- 3. THE CLICKING LOGIC (SURGICAL) ---
    function clickNextThumb() {
        if (!isRunning) return;

        const thumbs = document.querySelectorAll('.thUp:not([data-processed])');
        const visibleThumbs = Array.from(thumbs).filter(el => el.offsetParent !== null);

        if (visibleThumbs.length > 0) {
            const upBtn = visibleThumbs[0];
            const container = upBtn.closest('div[id^="c"]');

            let currentName = null;
            if (container) {
                const userLink = container.querySelector('a[href*="/user/"]');
                currentName = getUsernameFromLink(userLink);
            }

            const isPermBlocked = currentName && permanentBlocklist.has(currentName);
            const isTempBlocked = currentName && tempTargetSet.has(currentName);
            const isTargeted = isPermBlocked || isTempBlocked;

            if (isTargeted) {
                if (currentMode === 'downvote') {
                    // ID Match Logic
                    const upId = upBtn.id;
                    if (upId && upId.startsWith('up_')) {
                        const downId = upId.replace('up_', 'dn_');
                        const downBtn = document.getElementById(downId);

                        if (downBtn) {
                            downBtn.click();
                            console.log(`DOWNVOTED (ID Match): ${currentName}`);
                            upBtn.setAttribute('data-processed', 'true');
                        } else {
                            console.log(`Target ${currentName}: ID Match failed (Button missing?), skipping.`);
                            upBtn.setAttribute('data-processed', 'true');
                        }
                    } else {
                        // Fallback
                        const downBtn = container.querySelector('.thDn');
                        if (downBtn) {
                            downBtn.click();
                            console.log(`DOWNVOTED (Fallback): ${currentName}`);
                        }
                        upBtn.setAttribute('data-processed', 'true');
                    }
                } else {
                    console.log(`SKIPPING: ${currentName}`);
                    upBtn.setAttribute('data-processed', 'true');
                }
            } else {
                upBtn.click();
            }

            statusText.innerText = `Scan: ${visibleThumbs.length - 1} left`;
            setTimeout(clickNextThumb, 120);
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
    const mainPanel = document.createElement('div');
    Object.assign(mainPanel.style, {
        position: 'fixed', top: '50px', right: '10px', zIndex: '10000',
        backgroundColor: '#222', color: 'white', padding: '10px',
        borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        fontFamily: 'Arial, sans-serif', fontSize: '12px', width: '220px',
        border: '2px solid #4CAF50', display: 'flex', flexDirection: 'column', gap: '8px'
    });

    const statusText = document.createElement('div');
    statusText.innerText = 'Ready';
    statusText.style.fontWeight = 'bold';
    statusText.style.textAlign = 'center';
    statusText.style.fontSize = '14px';

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

    // CHANGED: Initial Text is now [+]
    const listHeader = document.createElement('div');
    listHeader.innerText = 'Permanent List [+]';
    listHeader.style.fontWeight = 'bold';
    listHeader.style.cursor = 'pointer';
    listHeader.style.userSelect = 'none';
    listHeader.style.padding = '5px';
    listHeader.style.backgroundColor = '#333';
    listHeader.style.borderRadius = '4px';
    listHeader.style.textAlign = 'center';

    // CHANGED: Initial Display is now NONE
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

    // --- REFRESH ROW ---
    const refreshRow = document.createElement('div');
    refreshRow.style.display = 'flex';
    refreshRow.style.gap = '5px';

    const pageUserSelect = document.createElement('select');
    pageUserSelect.style.width = '100%';
    pageUserSelect.innerHTML = '<option value="">-- Load Users --</option>';

    // THE REFRESH BUTTON
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
    mainPanel.appendChild(statusText);
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

    document.body.appendChild(mainPanel);

    // Init
    renderBlocklistUI();
    setTimeout(performScan, 2000);

})();