// ==UserScript==
// @name         [TMS] Discord Server Members Scraper
// @namespace    https://greasyfork.org/en/users/30331-setcher
// @version      1.0
// @description  Scrape and manage Discord server members - toolbar buttons + saved lists
// @author       Setcher
// @match        *://discord.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/562898/%5BTMS%5D%20Discord%20Server%20Members%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/562898/%5BTMS%5D%20Discord%20Server%20Members%20Scraper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let settings = {
        autoSave: GM_getValue('autoSave', false),
        saveInterval: GM_getValue('saveInterval', 20),
        duplicateKey: GM_getValue('duplicateKey', 'username'), // 'id', 'username', 'displayName'
        divider: GM_getValue('divider', ';'),
    };

    let autoSaveTimer = null;
    let lastSavedCount = 0;
    let toolbarButtonsAdded = false;
    let toolbarAutoSaveContainer = null;

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%);
            background: rgba(0,0,0,0.85); color: #fff; padding: 12px 24px;
            border-radius: 10px; font-size: 16px; z-index: 10001;
            transition: opacity 0.5s; opacity: 1; pointer-events: none;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.style.opacity = '0', 2200);
        setTimeout(() => toast.remove(), 2800);
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Clipboard failed:', err);
        }
    }

    function getServerName() {
        const placeholder = document.querySelector('div.public-DraftEditorPlaceholder-inner');
        if (placeholder && placeholder.textContent.startsWith('Search ')) {
            return placeholder.textContent.replace('Search ', '').trim();
        }
        return 'Unknown Server';
    }

    function extractMembers() {
        const members = [];
        document.querySelectorAll('[role="listitem"][data-list-item-id^="members-"]').forEach(el => {
            const nameEl = el.querySelector('span[class*="name"]');
            if (!nameEl) return;

            const displayName = nameEl.textContent.trim();

            let color = ''
            const c = nameEl.innerHTML.match(/class=".*?nameContainer"\s*style="color:\s*(rgb\([^\)]+\))/);
            if (c) {
                color = c[1].replace(/ /g, '');
            }

            let id = '';
            const img = el.querySelector('img[class*="avatar"]');
            if (img?.src) {
                const m = img.src.match(/avatars\/(\d+)\//);
                if (m) id = m[1];
            }
            if (!id) id = el.getAttribute('data-list-item-id') || '';

            // FIXED: Extract username from aria-label of avatar wrapper
            let username = '';
            const avatarWrapper = el.querySelector('div[role="img"]');
            if (avatarWrapper && avatarWrapper.hasAttribute('aria-label')) {
                const ariaLabel = avatarWrapper.getAttribute('aria-label');
                // aria-label format: "username, Status"
                const match = ariaLabel.match(/^([^,]+),/);
                if (match) {
                    username = match[1].trim();
                }
            }

            // Fallback to display name without emojis if aria-label not found
            if (!username) {
                username = displayName.replace(/[^\w\s]/g, '').trim().toLowerCase().replace(/\s+/g, '');
            }

            members.push({
                id,
                displayName,
                username, // Now correctly extracted from aria-label
                color,
                role: '',
                lastSeen: Date.now()
            });
        });
        return members;
    }

    function getDuplicateKey(m) {
        if (settings.duplicateKey === 'id' && m.id) return m.id;
        if (settings.duplicateKey === 'username') return m.username;
        return m.displayName;
    }

    function saveMembers(showMessage = true) {
        const server = getServerName();
        if (server === 'Unknown Server') return;

        const current = extractMembers();
        if (!current.length) return;

        let stored = GM_getValue(`members_${server}`, []);
        const map = new Map();

        stored.forEach(m => {
            map.set(getDuplicateKey(m), m);
        });

        let added = 0;
        let updated = 0;

        current.forEach(m => {
            const key = getDuplicateKey(m);
            const existing = map.get(key);

            if (!existing) {
                map.set(key, m);
                added++;
            } else {
                map.set(key, { ...existing, ...m, lastSeen: Date.now() });
                if (existing.color !== m.color || existing.displayName !== m.displayName) {
                    updated++;
                }
            }
        });

        const newStored = Array.from(map.values());
        GM_setValue(`members_${server}`, newStored);

        lastSavedCount = newStored.length;
        updateCounterDisplay();

        if (showMessage && (added > 0 || updated > 0)) {
            const parts = [];
            if (added) parts.push(`+${added}`);
            if (updated) parts.push(`~${updated}`);
            showToast(`Saved → ${server} (${lastSavedCount})`);
        }
    }

    function copySavedList(server = null, showToastMsg = true) {
        if (!server) server = getServerName();
        if (server === 'Unknown Server') return;

        const list = GM_getValue(`members_${server}`, []);
        if (!list.length) {
            if (showToastMsg) showToast('No saved members for this server');
            return;
        }

        const lines = [server];
        const divider = settings.divider;
        list.forEach(m => {
            const line = m.displayName + divider + m.username + divider + m.color + divider + m.role + divider + m.lastSeen;
            lines.push(line);
        });

        copyToClipboard(lines.join('\n'));

        if (showToastMsg) {
            showToast(`Copied ${list.length} saved member${list.length === 1 ? '' : 's'}`);
        }
    }

    function createToolbarButtons() {
        const toggleBtn = document.querySelector('div[aria-label*="Member List"]');
        if (!toggleBtn || toolbarButtonsAdded) return;

        const toolbar = toggleBtn.closest('div[class*="toolbar"]');
        if (!toolbar) return;

        const container = document.createElement('div');
        container.style.cssText = 'display:inline-flex; align-items:center; gap:10px; margin-left:12px;';

        // Save + count
        const saveWrap = document.createElement('div');
        saveWrap.style.cssText = 'display:flex; align-items:center; gap:4px;';

        const saveBtn = document.createElement('span');
        saveBtn.textContent = '💾';
        saveBtn.title = 'Save visible members';
        saveBtn.style.cursor = 'pointer';
        saveBtn.onclick = () => saveMembers();

        const countSpan = document.createElement('span');
        countSpan.id = 'dms-saved-count';
        countSpan.style.cssText = 'font-size:0.8em; color:#b9bbbe; min-width:20px; text-align:center;';
        countSpan.textContent = lastSavedCount;

        saveWrap.append(saveBtn, countSpan);

        // Copy saved
        const copySavedBtn = document.createElement('span');
        copySavedBtn.textContent = '✂️';
        copySavedBtn.title = 'Copy full saved list';
        copySavedBtn.style.cursor = 'pointer';
        copySavedBtn.onclick = () => copySavedList();

        // Autosave toggle + interval
        const autoSaveWrap = document.createElement('div');
        autoSaveWrap.style.cssText = 'display:flex; align-items:center; gap:6px; font-size:0.85em;';

        const autoCheck = document.createElement('input');
        autoCheck.type = 'checkbox';
        autoCheck.checked = settings.autoSave;
        autoCheck.title = 'Auto-save';
        autoCheck.onchange = () => {
            settings.autoSave = autoCheck.checked;
            GM_setValue('autoSave', settings.autoSave);
            updateModalAutosave();
            setupAutoSave();
        };

        const intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.min = 1;
        intervalInput.max = 300;
        intervalInput.value = settings.saveInterval;
        intervalInput.style.cssText = 'width:50px; font-size:0.85em;';
        intervalInput.title = 'Auto-save interval (s)';
        intervalInput.onchange = () => {
            let val = parseInt(intervalInput.value) || 20;
            val = Math.max(1, Math.min(300, val));
            settings.saveInterval = val;
            GM_setValue('saveInterval', val);
            intervalInput.value = val;
            updateModalInterval();
            setupAutoSave();
        };

        autoSaveWrap.append(autoCheck, intervalInput, document.createTextNode('s'));

        const gearBtn = document.createElement('span');
        gearBtn.textContent = '⚙️';
        gearBtn.title = 'Settings';
        gearBtn.style.cursor = 'pointer';
        gearBtn.onclick = () => {
            modal.style.display = 'flex';
            refreshServerList();
        };

        container.append(saveWrap, copySavedBtn, autoSaveWrap, gearBtn);
        toggleBtn.after(container);

        toolbarButtonsAdded = true;
        toolbarAutoSaveContainer = autoSaveWrap;
        console.log('[Discord Members Scraper] Toolbar controls added');
    }

    function updateCounterDisplay() {
        const el = document.getElementById('dms-saved-count');
        if (el) el.textContent = lastSavedCount;
    }

    function updateModalAutosave() {
        const check = document.getElementById('dms-autosave-check');
        if (check) check.checked = settings.autoSave;
    }

    function updateModalInterval() {
        const input = document.getElementById('dms-interval-input');
        if (input) input.value = settings.saveInterval;
    }

    function tryAddButtonsAndObserve() {
        createToolbarButtons();

        const observer = new MutationObserver(() => {
            createToolbarButtons();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function setupAutoSave() {
        if (autoSaveTimer) clearInterval(autoSaveTimer);
        if (settings.autoSave && settings.saveInterval >= 1) {
            autoSaveTimer = setInterval(() => {
                saveMembers(false);
            }, settings.saveInterval * 1000);
        }
    }

    // ────────────────────────────────────────────────
    // Styles & Modal
    GM_addStyle(`
        #dms-settings-modal {
            display: none;
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.65);
            z-index: 10002;
            align-items: center; justify-content: center;
        }
        .dms-modal-content {
            background: #36393f; color: #dcddde;
            padding: 24px; border-radius: 10px;
            width: 90%; max-width: 460px; max-height: 88vh;
            overflow-y: auto; box-shadow: 0 10px 36px rgba(0,0,0,0.7);
        }
        .dms-modal-close { float:right; font-size:30px; cursor:pointer; color:#72767d; }
        .dms-setting { margin:20px 0; }
        .dms-checkbox-label { display:flex; align-items:center; gap:10px; }
        .dms-radio-group { display:flex; gap:16px; margin-top:8px; }
        .dms-server-list { max-height:220px; overflow-y:auto; border:1px solid #2f3136; padding:10px; border-radius:6px; background:#2f3136; }
        .dms-server-row { display:flex; align-items:center; justify-content:space-between; padding:6px 0; border-bottom:1px solid #40444b; }
        .dms-server-row:last-child { border-bottom:none; }
        .dms-copy-btn, .dms-delete-btn { cursor:pointer; padding:0 6px; font-size:1.1em; }
        .dms-copy-btn { color:#43b581; }
        .dms-delete-btn { color:#f04747; }
    `);

    const modal = document.createElement('div');
    modal.id = 'dms-settings-modal';
    modal.innerHTML = `
        <div class="dms-modal-content">
            <span class="dms-modal-close">×</span>
            <h2 style="margin:0 0 16px;">Members Scraper</h2>

            <div class="dms-setting">
                <label class="dms-checkbox-label">
                    <input type="checkbox" id="dms-autosave-check"> Auto-save members
                </label>
            </div>

            <div class="dms-setting">
                <label>Auto-save interval (seconds, min 1)</label>
                <input type="number" id="dms-interval-input" min="1" max="300" value="${settings.saveInterval}">
            </div>

            <div class="dms-setting">
                <label>Detect duplicates by:</label>
                <div class="dms-radio-group">
                    <label><input type="radio" name="dupKey" value="id" ${settings.duplicateKey === 'id' ? 'checked' : ''}> User ID</label>
                    <label><input type="radio" name="dupKey" value="username" ${settings.duplicateKey === 'username' ? 'checked' : ''}> Username</label>
                    <label><input type="radio" name="dupKey" value="displayName" ${settings.duplicateKey === 'displayName' ? 'checked' : ''}> Display Name</label>
                </div>
            </div>

            <div class="dms-setting">
                <label>Saved Servers</label>
                <div class="dms-server-list" id="dms-server-list"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.dms-modal-close');
    const autoSaveCheck = modal.querySelector('#dms-autosave-check');
    const intervalInput = modal.querySelector('#dms-interval-input');
    const serverListDiv = modal.querySelector('#dms-server-list');

    // Radio buttons sync
    modal.querySelectorAll('input[name="dupKey"]').forEach(radio => {
        radio.onchange = () => {
            settings.duplicateKey = radio.value;
            GM_setValue('duplicateKey', settings.duplicateKey);
        };
    });

    intervalInput.disabled = !settings.autoSave;
    autoSaveCheck.checked = settings.autoSave;
    intervalInput.value = settings.saveInterval;

    closeBtn.onclick = () => modal.style.display = 'none';
    modal.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

    autoSaveCheck.onchange = () => {
        settings.autoSave = autoSaveCheck.checked;
        GM_setValue('autoSave', settings.autoSave);
        intervalInput.disabled = !settings.autoSave;
        if (toolbarAutoSaveContainer) {
            const check = toolbarAutoSaveContainer.querySelector('input[type="checkbox"]');
            if (check) check.checked = settings.autoSave;
        }
        setupAutoSave();
    };

    intervalInput.onchange = () => {
        let val = parseInt(intervalInput.value) || 20;
        val = Math.max(1, Math.min(300, val));
        settings.saveInterval = val;
        GM_setValue('saveInterval', val);
        intervalInput.value = val;
        if (toolbarAutoSaveContainer) {
            const input = toolbarAutoSaveContainer.querySelector('input[type="number"]');
            if (input) input.value = val;
        }
        setupAutoSave();
    };

    function refreshServerList() {
        serverListDiv.innerHTML = '';
        GM_listValues().forEach(key => {
            if (!key.startsWith('members_')) return;
            const server = key.replace('members_', '');
            const data = GM_getValue(key, []);
            const row = document.createElement('div');
            row.className = 'dms-server-row';
            row.innerHTML = `
                <span>${server} — ${data.length}</span>
                <div>
                    <span class="dms-copy-btn" title="Copy list">✂️</span>
                    <span class="dms-delete-btn" title="Delete">🗑️</span>
                </div>
            `;
            row.querySelector('.dms-copy-btn').onclick = () => copySavedList(server);
            row.querySelector('.dms-delete-btn').onclick = () => {
                GM_deleteValue(key);
                refreshServerList();
            };
            serverListDiv.appendChild(row);
        });
        if (!serverListDiv.children.length) {
            serverListDiv.innerHTML = '<div style="color:#72767d; text-align:center; padding:16px;">No saved servers yet</div>';
        }
    }

    // Start
    function init() {
        tryAddButtonsAndObserve();
        setupAutoSave();

        const server = getServerName();
        if (server !== 'Unknown Server') {
            const stored = GM_getValue(`members_${server}`, []);
            lastSavedCount = stored.length;
            updateCounterDisplay();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();