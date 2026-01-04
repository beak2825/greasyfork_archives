// ==UserScript==
// @name         Coomer/Kemono Tagger
// @version      1.0
// @description  Tag authors on coomer.st and kemono.cr
// @namespace    CK Tagger
// @author       glauthentica
// @match        https://coomer.st/*/user/*
// @match        https://kemono.cr/*/user/*
// @homepageURL      https://boosty.to/glauthentica
// @contributionURL  https://boosty.to/glauthentica
// @license      MIT
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.addValueChangeListener
// @grant        GM_addStyle
// @run-at       document-end
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/548251/CoomerKemono%20Tagger.user.js
// @updateURL https://update.greasyfork.org/scripts/548251/CoomerKemono%20Tagger.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    let siteName = 'CK';
    let siteKey = 'coomer_kemono';

    if (window.location.hostname.includes('coomer.st')) {
        siteName = 'Coomer';
        siteKey = 'coomer';
    } else if (window.location.hostname.includes('kemono.cr')) {
        siteName = 'Kemono';
        siteKey = 'kemono';
    }

    console.log(`[CK Tagger] v1.3.2 Script starting on ${siteName}...`);

    const DB_KEY = `${siteKey}_user_tags_db`;

    GM_addStyle(`
        .user-header__info { z-index: 100 !important; }
        #ckt-tags-display-container { position: absolute; width: auto; max-width: 400px; display: flex; flex-wrap: wrap; gap: 5px; z-index: 101; }
        #ckt-input-container { position: absolute; padding: 0; border: none; background-color: transparent; box-sizing: border-box; z-index: 102; width: 200px; }
        body.ckt-panel-open { overflow: hidden; }
        #ckt-tag-input {
            width: 100%;
            padding: 6px 2px;
            background-color: transparent;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            color: #fff;
            border-radius: 0;
            box-sizing: border-box;
            text-shadow: 0 0 4px rgba(0, 0, 0, 0.8), 0 0 2px rgba(0, 0, 0, 0.8);
        }
        #ckt-tag-input::placeholder { color: #ccc; opacity: 1; text-shadow: 0 0 4px rgba(0, 0, 0, 0.8), 0 0 2px rgba(0, 0, 0, 0.8); }
        .ckt-tag { background-color: #ff9900; color: #000; padding: 3px 8px; border-radius: 10px; font-size: 12px; font-weight: bold; display: inline-flex; align-items: center; cursor: default; }
        .ckt-tag-remove { margin-left: 5px; cursor: pointer; font-weight: bold; color: #502d00; }
        .ckt-tag-remove:hover { color: #000; }
        #ckt-manage-btn { position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px; background-color: #ff9900; color: #000; border-radius: 50%; border: none; font-size: 24px; line-height: 50px; text-align: center; cursor: pointer; z-index: 9998; box-shadow: 0 2px 10px rgba(0,0,0,0.5); }
        #ckt-panel-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.8); z-index: 9999; display: none; justify-content: flex-end; align-items: center; padding-right: 20px; box-sizing: border-box; }
        #ckt-panel { background-color: #1e1e1e; color: #fff; width: 80%; max-width: 600px; height: 95vh; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.7); display: flex; flex-direction: column; overflow: hidden; }
        .ckt-panel-header { padding: 15px; background-color: #111; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; } .ckt-panel-header h2 { margin: 0; font-size: 18px; color: #ff9900; } #ckt-close-panel { font-size: 24px; cursor: pointer; color: #888; } #ckt-close-panel:hover { color: #fff; }
        .ckt-panel-body { display: flex; flex-grow: 1; overflow: hidden; }
        .ckt-tags-list-container { width: 45%; padding: 15px; overflow-y: auto; border-right: 1px solid #444; overscroll-behavior: contain; }
        .ckt-users-list-container { width: 55%; padding: 15px; overflow-y: auto; overscroll-behavior: contain; }
        .ckt-panel-body h4 { margin-bottom: 15px; }
        .ckt-panel-footer { padding: 15px; background-color: #111; border-top: 1px solid #444; display: flex; gap: 10px; } .ckt-btn { padding: 8px 15px; background-color: #555; border: none; color: #fff; cursor: pointer; border-radius: 4px; } .ckt-btn:hover { background-color: #666; } .ckt-btn.primary { background-color: #ff9900; color: #000; font-weight: bold; } .ckt-btn.primary:hover { background-color: #ffac33; }
        .ckt-user-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 10px; border-radius: 4px; margin-bottom: 1px; }
        .ckt-user-row:hover { background-color: #2a2a2a; }
        .ckt-user-row a { color: #fff; text-decoration: none; flex-grow: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ckt-user-remove-btn { background-color: #5e2828; color: #ddd; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-weight: bold; font-size: 16px; line-height: 1; flex-shrink: 0; margin-left: 10px; transition: background-color 0.2s, color 0.2s; }
        .ckt-user-remove-btn:hover { background-color: #c53030; color: #fff; }
        #ckt-autocomplete-container {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: #2a2a2a;
            border: 1px solid #555;
            border-top: none;
            border-radius: 0 0 4px 4px;
            box-sizing: border-box;
            z-index: 10000;
            max-height: 150px;
            overflow-y: auto;
        }
        .ckt-autocomplete-item { padding: 8px 10px; font-size: 13px; color: #ddd; cursor: pointer; }
        .ckt-autocomplete-item:hover, .ckt-autocomplete-item.highlight { background-color: #ff9900; color: #000; font-weight: bold; }
        .ckt-kb-highlight { background-color: #4a4a4a !important; border: 1px solid #ff9900 !important; }
        .ckt-panel-tag { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; margin-bottom: 5px; background-color: #333; border-radius: 4px; cursor: pointer; border: 1px solid transparent; }
        .ckt-panel-tag.active, .ckt-panel-tag:hover { background-color: #ff9900; color: #000; font-weight: bold; }
        .ckt-tag-count-badge { background-color: #555; color: #ddd; padding: 1px 7px; border-radius: 10px; font-size: 11px; font-weight: bold; margin-left: 10px; }
        .ckt-panel-tag.active .ckt-tag-count-badge, .ckt-panel-tag:hover .ckt-tag-count-badge { background-color: #ab6800; color: #fff; }
    `);

    const DB = {
        data: {},
        async load() { this.data = await GM.getValue(DB_KEY, {}); },
        async save() { await GM.setValue(DB_KEY, this.data); },
        getUser(usernameKey) { return this.data[usernameKey.toLowerCase()]; },
        updateUser(usernameKey, displayName, url) {
            const dbKey = usernameKey.toLowerCase();
            if (!this.data[dbKey]) {
                this.data[dbKey] = { displayName: displayName, url: url, tags: [] };
            } else {
                this.data[dbKey].displayName = displayName;
                this.data[dbKey].url = url;
            }
        },
        async addTag(usernameKey, displayName, url, tag) {
            const dbKey = usernameKey.toLowerCase();
            if (!this.data[dbKey]) {
                this.data[dbKey] = { displayName: displayName, url: url, tags: [] };
            }
            const user = this.data[dbKey];
            if (!user.tags.includes(tag)) {
                user.tags.push(tag);
                user.tags.sort();
                await this.save();
            }
        },
        async removeTag(usernameKey, tag) {
            const dbKey = usernameKey.toLowerCase();
            const user = this.data[dbKey];
            if (user) {
                user.tags = user.tags.filter(t => t !== tag);
                if (user.tags.length === 0) {
                    delete this.data[dbKey];
                }
                await this.save();
            }
        },
        getAllTags() {
            const allTags = new Set();
            Object.values(this.data).forEach(user => user.tags.forEach(tag => allTags.add(tag)));
            return Array.from(allTags).sort();
        },
        getUsersForTag(tag) {
            const users = [];
            for (const key in this.data) {
                const user = this.data[key];
                if (user.tags.includes(tag)) {
                    users.push({ displayName: user.displayName || key, url: user.url, keyName: key });
                }
            }
            return users.sort((a, b) => a.displayName.localeCompare(b.displayName));
        }
    };

    const UI = {
        currentUserInfo: null, inputContainerElement: null, tagsDisplayContainerElement: null,
        anchorElement: null, resizeObserver: null,
        injectionParent: null, autocompleteIndex: -1, panelFocusColumn: 'tags', panelTagIndex: -1, panelUserIndex: -1, scrollbarWidth: 0,

        async init() {
            const scrollDiv = document.createElement('div'); scrollDiv.style.width = '100px'; scrollDiv.style.height = '100px'; scrollDiv.style.overflow = 'scroll'; scrollDiv.style.position = 'absolute'; scrollDiv.style.top = '-9999px'; document.body.appendChild(scrollDiv); this.scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth; document.body.removeChild(scrollDiv);
            await DB.load();
            this.createManagementPanel();
            const manageBtn = document.createElement('button'); manageBtn.id = 'ckt-manage-btn'; manageBtn.innerHTML = '&#9737;'; manageBtn.title = "Manage Tags (Hotkey: 'T')"; manageBtn.onclick = () => this.togglePanel(); document.body.appendChild(manageBtn);

            const selectorsToTry = [
                'a.user-header__profile',
                '.user-header__name',
                '[itemprop="name"]'
            ];
            this.anchorElement = document.querySelector(selectorsToTry.join(', '));
            const urlInfo = this.getUserInfoFromUrl();

            if (this.anchorElement && urlInfo) {
                this.injectionParent = this.anchorElement.closest('.user-header__info, .card-list__header') || this.anchorElement.parentElement;
                const displayName = this.anchorElement.textContent.trim();
                const finalUserInfo = { keyName: urlInfo.keyName, displayName: displayName, url: urlInfo.url };

                DB.updateUser(finalUserInfo.keyName, finalUserInfo.displayName, finalUserInfo.url);
                await DB.save();
                this.injectTaggingUI(finalUserInfo);

                if (this.resizeObserver) this.resizeObserver.disconnect();
                this.resizeObserver = new ResizeObserver(() => this.repositionUI());
                this.resizeObserver.observe(document.body);
                window.addEventListener('scroll', () => this.repositionUI(), true);
                window.addEventListener('resize', () => this.repositionUI());
            }

            GM.addValueChangeListener(DB_KEY, (name, oldValue, newValue, remote) => { if (remote) this.handleStorageChange(newValue); });
            document.addEventListener('click', (e) => { if (!e.target.closest('#ckt-input-container')) this.hideAutocomplete(); });
            document.addEventListener('keydown', (e) => { if (e.code === 'KeyT' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); this.togglePanel(); } else if (document.getElementById('ckt-panel-overlay')?.style.display === 'flex') { if (e.key === 'Escape') this.togglePanel(); else this.handlePanelKeyboardNav(e); } });
        },

        injectTaggingUI(userInfo) {
            this.currentUserInfo = userInfo;
            if (!this.inputContainerElement) {
                this.inputContainerElement = document.createElement('div'); this.inputContainerElement.id = 'ckt-input-container';
                const tagInput = document.createElement('input'); tagInput.type = 'text'; tagInput.id = 'ckt-tag-input'; tagInput.placeholder = 'Add a tag...'; tagInput.autocomplete = 'off';
                this.inputContainerElement.appendChild(tagInput);
                this.tagsDisplayContainerElement = document.createElement('div');
                this.tagsDisplayContainerElement.id = 'ckt-tags-display-container';
                document.body.appendChild(this.inputContainerElement);
                document.body.appendChild(this.tagsDisplayContainerElement);
                this.renderUserTags();
                tagInput.addEventListener('input', () => this.handleAutocomplete(tagInput));
                tagInput.addEventListener('keydown', (e) => this.handleKeyboard(e, tagInput));
            } else {
                this.renderUserTags();
            }
        },

        repositionUI() {
            if (!this.anchorElement || !document.body.contains(this.anchorElement)) {
                if (this.inputContainerElement) this.inputContainerElement.style.display = 'none';
                if (this.tagsDisplayContainerElement) this.tagsDisplayContainerElement.style.display = 'none';
                return;
            }

            if (this.inputContainerElement) this.inputContainerElement.style.display = 'block';
            if (this.tagsDisplayContainerElement) this.tagsDisplayContainerElement.style.display = 'flex';

            if (this.tagsDisplayContainerElement) {
                const anchorRect = this.anchorElement.getBoundingClientRect();
                const tagsHeight = this.tagsDisplayContainerElement.offsetHeight;
                const tagsTop = window.scrollY + anchorRect.top - tagsHeight - 5;
                const tagsLeft = window.scrollX + anchorRect.left;
                this.tagsDisplayContainerElement.style.setProperty('top', `${tagsTop}px`, 'important');
                this.tagsDisplayContainerElement.style.setProperty('left', `${tagsLeft}px`, 'important');
                this.tagsDisplayContainerElement.style.setProperty('width', `${anchorRect.width}px`, 'important');
            }

            const similarCreatorsTab = document.querySelector('.tabs a[href*="/recommended"]');
            if (this.inputContainerElement && similarCreatorsTab) {
                const tabRect = similarCreatorsTab.getBoundingClientRect();
                const gap = 15;
                const inputTop = window.scrollY + tabRect.top + (tabRect.height / 2) - (this.inputContainerElement.offsetHeight / 2);
                const inputLeft = window.scrollX + tabRect.right + gap;
                this.inputContainerElement.style.setProperty('top', `${inputTop}px`, 'important');
                this.inputContainerElement.style.setProperty('left', `${inputLeft}px`, 'important');
            }
        },

        renderUserTags() {
            const container = this.tagsDisplayContainerElement;
            if (!container || !this.currentUserInfo) return;
            container.innerHTML = '';
            const user = DB.getUser(this.currentUserInfo.keyName);
            if (user && user.tags.length > 0) {
                user.tags.forEach(tag => {
                    const tagEl = document.createElement('span'); tagEl.className = 'ckt-tag'; tagEl.textContent = tag;
                    const removeEl = document.createElement('span'); removeEl.className = 'ckt-tag-remove'; removeEl.innerHTML = '&times;';
                    removeEl.onclick = async () => { await DB.removeTag(this.currentUserInfo.keyName, tag); this.renderUserTags(); };
                    tagEl.appendChild(removeEl); container.appendChild(tagEl);
                });
                container.style.display = 'flex';
            } else {
                container.style.display = 'none';
            }
            setTimeout(() => this.repositionUI(), 50);
        },

        handleAutocomplete(inputElement) {
            const value = inputElement.value.trim().toLowerCase();
            if (!value) { this.hideAutocomplete(); return; }
            const user = DB.getUser(this.currentUserInfo.keyName);
            const currentUserTags = user ? user.tags : [];
            const filtered = DB.getAllTags().filter(tag => tag.startsWith(value) && !currentUserTags.includes(tag));
            if (filtered.length > 0) { this.showAutocomplete(filtered); }
            else { this.hideAutocomplete(); }
        },

        showAutocomplete(suggestions) { this.hideAutocomplete(); this.autocompleteIndex = -1; const container = document.createElement('div'); container.id = 'ckt-autocomplete-container'; suggestions.forEach((tag) => { const item = document.createElement('div'); item.className = 'ckt-autocomplete-item'; item.textContent = tag; item.onmousedown = (e) => { e.preventDefault(); this.addTagFromSuggestion(tag); }; container.appendChild(item); }); this.inputContainerElement.appendChild(container); },
        hideAutocomplete() { const container = document.getElementById('ckt-autocomplete-container'); if (container) container.remove(); },
        async addTagFromSuggestion(tag) { const tagInput = document.getElementById('ckt-tag-input'); await DB.addTag(this.currentUserInfo.keyName, this.currentUserInfo.displayName, this.currentUserInfo.url, tag); this.renderUserTags(); tagInput.value = ''; this.hideAutocomplete(); tagInput.focus(); },
        handleKeyboard(e, inputElement) { const container = document.getElementById('ckt-autocomplete-container'); if (e.key === 'Escape') { this.hideAutocomplete(); return; } if (!container) { if (e.key === 'Enter' && inputElement.value.trim() !== '') { this.addTagFromSuggestion(inputElement.value.trim().toLowerCase()); } return; } const items = container.querySelectorAll('.ckt-autocomplete-item'); if (!items.length) return; if (e.key === 'ArrowDown') { e.preventDefault(); this.autocompleteIndex = (this.autocompleteIndex + 1) % items.length; } else if (e.key === 'ArrowUp') { e.preventDefault(); this.autocompleteIndex = (this.autocompleteIndex - 1 + items.length) % items.length; } else if (e.key === 'Enter') { e.preventDefault(); if (this.autocompleteIndex > -1) { this.addTagFromSuggestion(items[this.autocompleteIndex].textContent); } else if (inputElement.value.trim() !== '') { this.addTagFromSuggestion(inputElement.value.trim().toLowerCase()); } return; } this.highlightAutocompleteItem(items); },
        highlightAutocompleteItem(items) { items.forEach(item => item.classList.remove('highlight')); if (this.autocompleteIndex > -1) { items[this.autocompleteIndex].classList.add('highlight'); items[this.autocompleteIndex].scrollIntoView({ block: 'nearest' }); } },
        getUserInfoFromUrl() {
            const path = window.location.pathname.split('/');
            if (path.length >= 4 && path[2] === 'user') {
                const service = path[1];
                const userId = path[3];
                const keyName = `${service}-${userId}`;
                return { keyName: keyName, url: window.location.pathname };
            }
            return null;
        },
        handleStorageChange(newValue) { DB.data = newValue; if (this.inputContainerElement && this.currentUserInfo) { this.renderUserTags(); } if (document.getElementById('ckt-panel-overlay')?.style.display === 'flex') { this.refreshManagementPanel(); } },

        createManagementPanel() { const overlay = document.createElement('div'); overlay.id = 'ckt-panel-overlay'; overlay.innerHTML = `<div id="ckt-panel"><div class="ckt-panel-header"><h2>Tag Management</h2><span id="ckt-close-panel">&times;</span></div><div class="ckt-panel-body"><div class="ckt-tags-list-container" id="ckt-all-tags-list"></div><div class="ckt-users-list-container" id="ckt-users-for-tag"><p>Select a tag.</p></div></div><div class="ckt-panel-footer"><button id="ckt-backup-btn" class="ckt-btn primary">Backup Data</button><button id="ckt-restore-btn" class="ckt-btn">Restore from Backup</button></div></div>`; document.body.appendChild(overlay); document.getElementById('ckt-close-panel').onclick = () => this.togglePanel(); overlay.onclick = (e) => { if (e.target === overlay) this.togglePanel(); }; document.getElementById('ckt-backup-btn').onclick = () => this.backupData(); document.getElementById('ckt-restore-btn').onclick = () => this.restoreData(); return overlay; },
        refreshManagementPanel() { const tagsListContainer = document.getElementById('ckt-all-tags-list'); const usersListContainer = document.getElementById('ckt-users-for-tag'); if (tagsListContainer) this.renderAllTagsList(tagsListContainer); if (usersListContainer) usersListContainer.innerHTML = '<p>Select a tag on the left.</p>'; },
        renderAllTagsList(container) { container.innerHTML = '<h4>All Tags</h4>'; const tags = DB.getAllTags(); if (tags.length === 0) { container.innerHTML += '<p>No tags yet.</p>'; return; } tags.forEach((tag, index) => { const userCount = DB.getUsersForTag(tag).length; const tagEl = document.createElement('div'); tagEl.className = 'ckt-panel-tag'; tagEl.innerHTML = `<span>${tag}</span><span class="ckt-tag-count-badge" title="${userCount} user(s) with this tag">${userCount}</span>`; tagEl.onclick = () => { document.querySelectorAll('.ckt-panel-tag.active').forEach(el => el.classList.remove('active')); tagEl.classList.add('active'); this.renderUsersForTag(document.getElementById('ckt-users-for-tag'), tag); this.panelUserIndex = -1; this.panelFocusColumn = 'tags'; this.panelTagIndex = index; this.updatePanelHighlight(); }; container.appendChild(tagEl); }); },
        renderUsersForTag(container, tag) { container.innerHTML = `<h4>Users with tag: "${tag}"</h4>`; const users = DB.getUsersForTag(tag); if (users.length === 0) { container.innerHTML += '<p>No users found for this tag.</p>'; return; } users.forEach(user => { const row = document.createElement('div'); row.className = 'ckt-user-row'; row.dataset.keyName = user.keyName; row.innerHTML = `<a href="${user.url}" target="_blank">${user.displayName}</a><span class="ckt-user-remove-btn" title="Remove tag '${tag}' from ${user.displayName}">&times;</span>`; row.querySelector('.ckt-user-remove-btn').onclick = async (e) => { e.stopPropagation(); await DB.removeTag(user.keyName, tag); if (this.currentUserInfo && this.currentUserInfo.keyName === user.keyName) { this.renderUserTags(); } const activeTagElement = document.querySelector('.ckt-panel-tag.active'); this.refreshManagementPanel(); const allTagElements = document.querySelectorAll('.ckt-panel-tag'); if (allTagElements.length > 0) { const newIndex = Math.min(this.panelTagIndex, allTagElements.length - 1); allTagElements[newIndex]?.click(); } else { document.getElementById('ckt-users-for-tag').innerHTML = '<p>Select a tag on the left.</p>'; } }; container.appendChild(row); }); },
        togglePanel() { const panelOverlay = document.getElementById('ckt-panel-overlay'); if (!panelOverlay) return; const isVisible = panelOverlay.style.display === 'flex'; const pageHasScrollbar = document.documentElement.scrollHeight > document.documentElement.clientHeight; if (isVisible) { panelOverlay.style.display = 'none'; document.body.classList.remove('ckt-panel-open'); document.body.style.paddingRight = ''; } else { panelOverlay.style.display = 'flex'; if (pageHasScrollbar) { document.body.style.paddingRight = `${this.scrollbarWidth}px`; } document.body.classList.add('ckt-panel-open'); this.refreshManagementPanel(); this.panelFocusColumn = 'tags'; this.panelTagIndex = 0; this.panelUserIndex = -1; this.updatePanelHighlight(); } },
        handlePanelKeyboardNav(e) { const tagItems = document.querySelectorAll('#ckt-all-tags-list .ckt-panel-tag'); const userItems = document.querySelectorAll('#ckt-users-for-tag .ckt-user-row'); if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Delete'].includes(e.key)) e.preventDefault(); switch (e.key) { case 'ArrowDown': if (this.panelFocusColumn === 'tags' && tagItems.length > 0) this.panelTagIndex = (this.panelTagIndex + 1) % tagItems.length; else if (this.panelFocusColumn === 'users' && userItems.length > 0) this.panelUserIndex = (this.panelUserIndex + 1) % userItems.length; break; case 'ArrowUp': if (this.panelFocusColumn === 'tags' && tagItems.length > 0) this.panelTagIndex = (this.panelTagIndex - 1 + tagItems.length) % tagItems.length; else if (this.panelFocusColumn === 'users' && userItems.length > 0) this.panelUserIndex = (this.panelUserIndex - 1 + userItems.length) % userItems.length; break; case 'ArrowRight': if (this.panelFocusColumn === 'tags' && document.querySelector('.ckt-panel-tag.active') && userItems.length > 0) { this.panelFocusColumn = 'users'; this.panelUserIndex = 0; } break; case 'ArrowLeft': if (this.panelFocusColumn === 'users') { this.panelFocusColumn = 'tags'; this.panelUserIndex = -1; } break; case 'Enter': if (this.panelFocusColumn === 'tags' && this.panelTagIndex > -1) tagItems[this.panelTagIndex]?.click(); else if (this.panelFocusColumn === 'users' && this.panelUserIndex > -1) userItems[this.panelUserIndex]?.querySelector('a')?.click(); break; case 'Delete': if (this.panelFocusColumn === 'users' && this.panelUserIndex > -1) { userItems[this.panelUserIndex]?.querySelector('.ckt-user-remove-btn')?.click(); } break; } this.updatePanelHighlight(); },
        updatePanelHighlight() { document.querySelectorAll('.ckt-kb-highlight').forEach(el => el.classList.remove('ckt-kb-highlight')); if (this.panelFocusColumn === 'tags') { const items = document.querySelectorAll('#ckt-all-tags-list .ckt-panel-tag'); if (this.panelTagIndex > -1 && items[this.panelTagIndex]) { items[this.panelTagIndex].classList.add('ckt-kb-highlight'); items[this.panelTagIndex].scrollIntoView({ block: 'nearest' }); } } else if (this.panelFocusColumn === 'users') { const items = document.querySelectorAll('#ckt-users-for-tag .ckt-user-row'); if (this.panelUserIndex > -1 && items[this.panelUserIndex]) { items[this.panelUserIndex].classList.add('ckt-kb-highlight'); items[this.panelUserIndex].scrollIntoView({ block: 'nearest' }); } } },

        backupData() {
            const dataStr = JSON.stringify(DB.data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const filename = `${siteName} Tags Backup (${new Date().toISOString().slice(0, 10)}).json`;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
            alert(`Backup created: ${filename}`);
        },
        restoreData() {
            if (!confirm(`This will overwrite ALL current tags for ${siteName}. Are you sure?`)) return;
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = e => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async (event) => {
                    try {
                        const restoredData = JSON.parse(event.target.result);
                        if (typeof restoredData === 'object' && restoredData !== null) {
                            DB.data = restoredData;
                            await DB.save();
                            alert('Data restored!');
                            this.refreshManagementPanel();
                            if (this.currentUserInfo) this.renderUserTags();
                        } else throw new Error('Invalid file format.');
                    } catch (err) {
                        alert('Error restoring file: ' + err.message);
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        },
    };

    setTimeout(() => UI.init(), 500);

})();