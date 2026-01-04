// ==UserScript==
// @name         MyAnimeList - Staff List Enhancer
// @namespace    MonkeyBall
// @version      1.0
// @description  Reorder, filter, and block staff entries with customizable priority settings
// @author       Super
// @match        https://myanimelist.net/anime/*
// @match        https://myanimelist.net/manga/*
// @icon         https://cdn.myanimelist.net/images/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.jikan.moe
// @license      GPL-3.0
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560688/MyAnimeList%20-%20Staff%20List%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/560688/MyAnimeList%20-%20Staff%20List%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'mal_staff_enhancer_settings';
    const MAX_STAFF_ON_MAIN_PAGE = 8;

    const DEFAULT_ROLE_PRIORITIES = {
        // Priority 1: Original Creator
        'Original Creator': 1,

        // Priority 2: Director
        'Director': 2,

        // Priority 3: Key Creative Roles
        'Series Composition': 3,
        'Character Design': 3,
        'Chief Animation Director': 3,

        // Priority 4: Creative Core
        'Script': 4,
        'Screenplay': 4,
        'Music': 4,
        'Sound Director': 4,

        // Priority 5: Visual Direction
        'Animation Director': 5,
        'Art Director': 5,
        'Episode Director': 5,

        // Priority 6: Direction Support
        'Assistant Director': 6,
        'Storyboard': 6,

        // Priority 7: Music & Songs
        'Theme Song Composition': 7,
        'Theme Song Lyrics': 7,
        'Theme Song Arrangement': 7,
        'Theme Song Performance': 7,
        'Inserted Song Performance': 7,

        // Priority 8: Animation Core
        'Key Animation': 8,
        'Assistant Animation Director': 8,
        'Animation Check': 8,

        // Priority 9: Animation Support
        '2nd Key Animation': 9,
        'In-Between Animation': 9,

        // Priority 10: Technical/Art
        'Background Art': 10,
        'Director of Photography': 10,
        'Color Design': 10,
        'Color Setting': 10,
        'CG Director': 10,
        '3D CG': 10,
        'Special Effects': 10,

        // Priority 11: Post-Production & Sound
        'Online Editor': 11,
        'Editing': 11,
        'Sound Effects': 11,
        'Recording': 11,
        'Recording Engineer': 11,
        'Dialogue Editing': 11,
        'ADR Director': 11,

        // Priority 12: Admin & Publicity
        'Planning': 12,
        'Publicity': 12,

        // Priority 99: Business/Production
        'Executive Producer': 99,
        'Producer': 99,
        'Assistant Producer': 99,
        'Associate Producer': 99,
    };

    const DEFAULT_SETTINGS = {
        version: 2,
        rolePriorities: { ...DEFAULT_ROLE_PRIORITIES },
        hiddenRoles: [],
        blockedPeople: [],
        unknownRolePriority: 50,
    };

    function loadSettings() {
        try {
            const stored = typeof GM_getValue !== 'undefined'
                ? GM_getValue(STORAGE_KEY, null)
                : localStorage.getItem(STORAGE_KEY);

            if (stored) {
                const parsed = typeof stored === 'string' ? JSON.parse(stored) : stored;
                return {
                    ...DEFAULT_SETTINGS,
                    ...parsed,
                    rolePriorities: { ...DEFAULT_ROLE_PRIORITIES, ...parsed.rolePriorities },
                };
            }
        } catch (e) {
            console.error('MAL Staff Enhancer: Error loading settings', e);
        }
        return { ...DEFAULT_SETTINGS };
    }

    function saveSettings(settings) {
        try {
            const data = JSON.stringify(settings);
            if (typeof GM_setValue !== 'undefined') {
                GM_setValue(STORAGE_KEY, data);
            } else {
                localStorage.setItem(STORAGE_KEY, data);
            }
        } catch (e) {
            console.error('MAL Staff Enhancer: Error saving settings', e);
        }
    }

    let currentSettings = loadSettings();

    function injectStyles() {
        const css = `
            .mse-modal-overlay {
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.7); z-index: 99999;
                display: flex; align-items: center; justify-content: center;
            }

            .mse-modal {
                background: var(--mse-bg, #fff); color: var(--mse-text, #333);
                border-radius: 4px; width: 700px; max-width: 90vw; max-height: 60vh; min-height: 60vh;
                display: flex; flex-direction: column;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                font-family: Verdana, Arial, sans-serif; font-size: 11px;
                --mse-bg: #fff; --mse-bg-alt: #f9f9f9; --mse-bg-hover: #f0f0f0;
                --mse-text: #333; --mse-text-muted: #666;
                --mse-border: #ddd; --mse-border-light: #e5e5e5;
                --mse-input-bg: #fff; --mse-input-border: #ccc;
            }

            [data-skin="dark"] .mse-modal, .dark-mode .mse-modal {
                --mse-bg: #1c1c1c; --mse-bg-alt: #2a2a2a; --mse-bg-hover: #383838;
                --mse-text: #e0e0e0; --mse-text-muted: #999;
                --mse-border: #444; --mse-border-light: #3a3a3a;
                --mse-input-bg: #2a2a2a; --mse-input-border: #555;
            }

            .mse-modal-header {
                background: #2e51a2; color: #fff; padding: 12px 16px;
                display: flex; justify-content: space-between; align-items: center;
                border-radius: 4px 4px 0 0;
            }
            .mse-modal-header h2 { margin: 0 !important; padding: 0 !important; color: #fff !important; font-size: 14px !important; font-weight: bold !important; border: none !important; }
            .mse-modal-close { background: none; border: none; color: #fff; font-size: 20px; cursor: pointer; padding: 0 4px; line-height: 1; }
            .mse-modal-close:hover { color: #ccc; }

            .mse-tabs { display: flex; background: var(--mse-bg-alt); border-bottom: 1px solid var(--mse-border); }
            .mse-tab {
                padding: 10px 16px; cursor: pointer; border: none; background: transparent;
                font-size: 11px; font-family: inherit; color: var(--mse-text);
                border-bottom: 2px solid transparent;
            }
            .mse-tab:hover { background: var(--mse-bg-hover); }
            .mse-tab.active { background: var(--mse-bg); border-bottom-color: #2e51a2; font-weight: bold; }

            .mse-modal-body { flex: 1; overflow-y: auto; padding: 16px; background: var(--mse-bg); color: var(--mse-text); }
            .mse-modal-body p { color: var(--mse-text-muted); }
            .mse-tab-content { display: none; }
            .mse-tab-content.active { display: block; }

            .mse-priority-table, .mse-blocked-table { width: 100%; border-collapse: collapse; }
            .mse-priority-table th, .mse-blocked-table th { background: #2e51a2; color: #fff; padding: 8px; text-align: left; font-weight: bold; }
            .mse-priority-table td, .mse-blocked-table td { padding: 6px 8px; border-bottom: 1px solid var(--mse-border-light); color: var(--mse-text); background: var(--mse-bg); }
            .mse-priority-table tr:nth-child(odd) td, .mse-blocked-table tr:nth-child(odd) td { background: var(--mse-bg-alt); }
            .mse-priority-table tr:hover td { background: var(--mse-bg-hover); }
            .mse-blocked-table { margin-bottom: 16px; }

            .mse-priority-input { width: 50px; padding: 4px; border: 1px solid var(--mse-input-border); border-radius: 3px; text-align: center; background: var(--mse-input-bg); color: var(--mse-text); }

            .mse-checkbox-list { column-count: 3; column-gap: 24px; max-width: fit-content; margin: 0 auto; }
            .mse-checkbox-item { display: flex; align-items: center; gap: 8px; color: var(--mse-text); padding: 5px 0; font-size: 12px; }
            .mse-checkbox-item span { color: var(--mse-text); }
            .mse-checkbox-item input { margin: 0; width: 16px; height: 16px; }

            .mse-add-block-form { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; padding: 12px; background: var(--mse-bg-alt); border-radius: 4px; }
            .mse-add-block-form input, .mse-add-block-form select { padding: 6px 8px; border: 1px solid var(--mse-input-border); border-radius: 3px; font-size: 11px; background: var(--mse-input-bg); color: var(--mse-text); }
            .mse-add-block-form input { flex: 1; min-width: 150px; }

            .mse-btn { padding: 6px 12px; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; font-family: inherit; transition: background 0.2s; }
            .mse-btn-primary { background: #2e51a2; color: #fff; }
            .mse-btn-primary:hover { background: #1d439b; }
            .mse-btn-danger { background: #d9534f; color: #fff; }
            .mse-btn-danger:hover { background: #c9302c; }
            .mse-btn-secondary { background: #6c757d; color: #fff; }
            .mse-btn-secondary:hover { background: #5a6268; }
            .mse-btn-small { padding: 3px 8px; font-size: 10px; }

            .mse-modal-footer { padding: 12px 16px; border-top: 1px solid var(--mse-border); display: flex; justify-content: space-between; gap: 8px; background: var(--mse-bg-alt); border-radius: 0 0 4px 4px; }
            .mse-footer-left, .mse-footer-right { display: flex; gap: 8px; }

            .mse-hide-btn { display: inline !important; cursor: pointer; color: #999; margin-left: 4px !important; padding: 2px 4px; font-size: 10px; opacity: 0.5; transition: opacity 0.2s; }
            .mse-hide-btn:hover { color: #d9534f; opacity: 1; }
            tr:hover .mse-hide-btn, table:hover .mse-hide-btn, .mse-hide-btn.active { opacity: 1; }

            .mse-hide-popup { position: absolute; background: #fff; color: #333; border: 1px solid #bebebe; box-shadow: 0 2px 8px rgba(0,0,0,0.15); padding: 6px; z-index: 100000; font-size: 11px; font-family: Verdana, Arial, sans-serif; }
            html.dark-mode .mse-hide-popup { background: #1c1c1c !important; color: #e0e0e0 !important; border-color: #444 !important; }
            .mse-hide-popup-header { font-weight: bold; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #e5e5e5; font-size: 11px; }
            html.dark-mode .mse-hide-popup-header { border-bottom-color: #444; color: #e0e0e0; }
            .mse-hide-popup-actions { display: flex; flex-direction: column; gap: 4px; }
            html.dark-mode .mse-hide-popup .inputButton { background: #2e51a2 !important; color: #fff !important; border-color: #1d439b !important; }

            .mse-empty-state { text-align: center; padding: 20px; color: var(--mse-text-muted, #666); }
            .mse-staff-notice { padding: 16px; text-align: center; color: #666; font-style: italic; background: #f9f9f9; border: 1px dashed #ddd; border-radius: 4px; margin: 8px 0; }

            @keyframes mse-fade-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
            .mse-new-entry { animation: mse-fade-in 0.3s ease-out; }
            [data-skin="dark"] .mse-staff-notice { background: #2a2a2a; border-color: #444; color: #999; }
            .mse-loading { padding: 16px; text-align: center; color: #666; }
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function getAllKnownRoles() {
        const roles = new Set(Object.keys(DEFAULT_ROLE_PRIORITIES));
        if (currentSettings.rolePriorities) {
            Object.keys(currentSettings.rolePriorities).forEach(r => roles.add(r));
        }
        return Array.from(roles);
    }

    function getRolesSortedByPriority() {
        return getAllKnownRoles().sort((a, b) => {
            const pA = currentSettings.rolePriorities[a] ?? currentSettings.unknownRolePriority;
            const pB = currentSettings.rolePriorities[b] ?? currentSettings.unknownRolePriority;
            return pA !== pB ? pA - pB : a.localeCompare(b);
        });
    }

    function createSettingsModal() {
        const overlay = document.createElement('div');
        overlay.className = 'mse-modal-overlay';

        const rolesByPriority = getRolesSortedByPriority();
        const rolesAlpha = getAllKnownRoles().sort();

        overlay.innerHTML = `
            <div class="mse-modal">
                <div class="mse-modal-header">
                    <h2><i class="fa-solid fa-sliders"></i> Staff List Enhancer Settings</h2>
                    <button class="mse-modal-close" title="Close">&times;</button>
                </div>
                <div class="mse-tabs">
                    <button class="mse-tab active" data-tab="priorities">Role Priorities</button>
                    <button class="mse-tab" data-tab="hidden">Hidden Roles</button>
                    <button class="mse-tab" data-tab="blocked">Blocked People</button>
                </div>
                <div class="mse-modal-body">
                    <div class="mse-tab-content active" data-tab="priorities">
                        <p style="margin-bottom: 8px;">Lower numbers = higher priority. Staff with multiple roles are sorted by their highest-priority role.</p>
                        <table class="mse-priority-table">
                            <thead><tr><th>Role</th><th style="width:80px;">Priority</th></tr></thead>
                            <tbody>
                                ${rolesByPriority.map(role => `
                                    <tr>
                                        <td>${role}</td>
                                        <td><input type="number" class="mse-priority-input" data-role="${role}" value="${currentSettings.rolePriorities[role] || currentSettings.unknownRolePriority}" min="1" max="100"></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div class="mse-tab-content" data-tab="hidden">
                        <p style="margin-bottom: 8px;">Check roles to hide them completely from staff lists.</p>
                        <div class="mse-checkbox-list">
                            ${rolesAlpha.map(role => `
                                <label class="mse-checkbox-item">
                                    <input type="checkbox" data-role="${role}" ${currentSettings.hiddenRoles.includes(role) ? 'checked' : ''}>
                                    <span>${role}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    <div class="mse-tab-content" data-tab="blocked">
                        <p style="margin-bottom: 8px;">Block specific people from appearing in staff lists.</p>
                        <table class="mse-blocked-table" id="mse-blocked-list">
                            <thead><tr><th>Name</th><th>Role Filter</th><th style="width:60px;">Action</th></tr></thead>
                            <tbody>
                                ${currentSettings.blockedPeople.length === 0 
                                    ? '<tr class="mse-empty-row"><td colspan="3" class="mse-empty-state">No blocked people</td></tr>'
                                    : currentSettings.blockedPeople.map((block, i) => `
                                        <tr data-index="${i}">
                                            <td>${block.name}</td>
                                            <td>${block.role || 'All Roles'}</td>
                                            <td><button class="mse-btn mse-btn-danger mse-btn-small mse-remove-block">Remove</button></td>
                                        </tr>
                                    `).join('')}
                            </tbody>
                        </table>
                        <div class="mse-add-block-form">
                            <input type="text" id="mse-block-name" placeholder="Person name (e.g., Cook, Justin)">
                            <select id="mse-block-role">
                                <option value="">All Roles</option>
                                ${rolesAlpha.map(role => `<option value="${role}">${role}</option>`).join('')}
                            </select>
                            <button class="mse-btn mse-btn-primary" id="mse-add-block">Add Block</button>
                        </div>
                    </div>
                </div>
                <div class="mse-modal-footer">
                    <div class="mse-footer-left">
                        <button class="mse-btn mse-btn-secondary" id="mse-export">Export</button>
                        <button class="mse-btn mse-btn-secondary" id="mse-import">Import</button>
                        <button class="mse-btn mse-btn-danger" id="mse-reset">Reset Defaults</button>
                    </div>
                    <div class="mse-footer-right">
                        <button class="mse-btn mse-btn-secondary mse-modal-close">Cancel</button>
                        <button class="mse-btn mse-btn-primary" id="mse-save">Save & Reload</button>
                    </div>
                </div>
            </div>
        `;

        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
        overlay.querySelectorAll('.mse-modal-close').forEach(btn => btn.addEventListener('click', () => overlay.remove()));

        overlay.querySelector('.mse-tabs').addEventListener('click', (e) => {
            const tab = e.target.closest('.mse-tab');
            if (!tab || tab.classList.contains('active')) return;
            e.preventDefault();
            e.stopPropagation();
            overlay.querySelectorAll('.mse-tab').forEach(t => t.classList.remove('active'));
            overlay.querySelectorAll('.mse-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            overlay.querySelector(`.mse-tab-content[data-tab="${tab.dataset.tab}"]`).classList.add('active');
        });

        overlay.querySelector('#mse-add-block').addEventListener('click', () => {
            const nameInput = overlay.querySelector('#mse-block-name');
            const roleSelect = overlay.querySelector('#mse-block-role');
            const name = nameInput.value.trim();
            const role = roleSelect.value || null;

            if (!name) { alert('Please enter a name'); return; }
            if (currentSettings.blockedPeople.some(b => b.name.toLowerCase() === name.toLowerCase() && b.role === role)) {
                alert('This block already exists'); return;
            }

            currentSettings.blockedPeople.push({ name, role });
            const tbody = overlay.querySelector('#mse-blocked-list tbody');
            const emptyRow = tbody.querySelector('.mse-empty-row');
            if (emptyRow) emptyRow.remove();

            const newRow = document.createElement('tr');
            newRow.dataset.index = currentSettings.blockedPeople.length - 1;
            newRow.innerHTML = `<td>${name}</td><td>${role || 'All Roles'}</td><td><button class="mse-btn mse-btn-danger mse-btn-small mse-remove-block">Remove</button></td>`;
            tbody.appendChild(newRow);
            nameInput.value = '';
            roleSelect.value = '';
        });

        overlay.querySelector('#mse-blocked-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('mse-remove-block')) {
                const row = e.target.closest('tr');
                currentSettings.blockedPeople.splice(parseInt(row.dataset.index, 10), 1);
                row.remove();
                overlay.querySelectorAll('#mse-blocked-list tbody tr').forEach((r, i) => r.dataset.index = i);
                if (currentSettings.blockedPeople.length === 0) {
                    overlay.querySelector('#mse-blocked-list tbody').innerHTML = '<tr class="mse-empty-row"><td colspan="3" class="mse-empty-state">No blocked people</td></tr>';
                }
            }
        });

        const collectSettings = () => {
            overlay.querySelectorAll('.mse-priority-input').forEach(input => {
                currentSettings.rolePriorities[input.dataset.role] = parseInt(input.value, 10) || 50;
            });
            currentSettings.hiddenRoles = [];
            overlay.querySelectorAll('.mse-tab-content[data-tab="hidden"] input[type="checkbox"]:checked').forEach(cb => {
                currentSettings.hiddenRoles.push(cb.dataset.role);
            });
        };

        overlay.querySelector('#mse-save').addEventListener('click', () => {
            collectSettings();
            saveSettings(currentSettings);
            overlay.remove();
            location.reload();
        });

        overlay.querySelector('#mse-reset').addEventListener('click', () => {
            if (confirm('Reset all settings to defaults? This cannot be undone.')) {
                currentSettings = { ...DEFAULT_SETTINGS, rolePriorities: { ...DEFAULT_ROLE_PRIORITIES } };
                saveSettings(currentSettings);
                overlay.remove();
                location.reload();
            }
        });

        overlay.querySelector('#mse-export').addEventListener('click', () => {
            collectSettings();
            const blob = new Blob([JSON.stringify(currentSettings, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mal-staff-enhancer-settings.json';
            a.click();
            URL.revokeObjectURL(url);
        });

        overlay.querySelector('#mse-import').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        const imported = JSON.parse(ev.target.result);
                        currentSettings = { ...DEFAULT_SETTINGS, ...imported, rolePriorities: { ...DEFAULT_ROLE_PRIORITIES, ...imported.rolePriorities } };
                        saveSettings(currentSettings);
                        overlay.remove();
                        location.reload();
                    } catch (err) { alert('Invalid settings file'); }
                };
                reader.readAsText(file);
            };
            input.click();
        });

        document.body.appendChild(overlay);
    }

    function injectDropdownLink() {
        const dropdown = document.querySelector('.header-profile-dropdown ul');
        if (!dropdown) return;

        const logoutForm = dropdown.querySelector('form[action*="logout"]');
        if (!logoutForm) return;

        const li = document.createElement('li');
        li.innerHTML = `<a href="javascript:void(0);" id="mse-settings-link"><i class="fa-solid fa-fw fa-sliders mr4"></i>Staff Enhancer</a>`;
        dropdown.insertBefore(li, logoutForm.parentElement);

        li.querySelector('#mse-settings-link').addEventListener('click', (e) => {
            e.preventDefault();
            createSettingsModal();
        });
    }

    function getAnimeIdFromUrl() {
        const match = window.location.pathname.match(/\/(anime|manga)\/(\d+)/);
        return match ? { type: match[1], id: match[2] } : null;
    }

    function fetchStaffFromJikan(animeId) {
        return new Promise((resolve, reject) => {
            const url = `https://api.jikan.moe/v4/anime/${animeId}/staff`;
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                GM_xmlhttpRequest({
                    method: 'GET', url,
                    onload: (r) => { try { resolve(JSON.parse(r.responseText).data || []); } catch (e) { reject(e); } },
                    onerror: reject
                });
            } else {
                fetch(url).then(r => r.json()).then(d => resolve(d.data || [])).catch(reject);
            }
        });
    }

    const isBlocked = (name, roles) => {
        const nameLower = name.toLowerCase().trim();
        return currentSettings.blockedPeople.some(b => {
            if (b.name.toLowerCase().trim() !== nameLower) return false;
            return b.role === null || roles.some(r => r.toLowerCase() === b.role.toLowerCase());
        });
    };

    const getEffectivePriority = (roles) => {
        let min = currentSettings.unknownRolePriority;
        roles.forEach(role => {
            const p = currentSettings.rolePriorities[role] ?? currentSettings.unknownRolePriority;
            if (p < min) min = p;
        });
        return min;
    };

    const hasHiddenRole = (roles) => roles.some(role => currentSettings.hiddenRoles.includes(role));

    function createStaffTableElement(staff) {
        const table = document.createElement('table');
        table.setAttribute('border', '0');
        table.setAttribute('cellpadding', '0');
        table.setAttribute('cellspacing', '0');
        table.setAttribute('width', '100%');

        const rawImgUrl = staff.person?.images?.jpg?.image_url || 'https://cdn.myanimelist.net/images/questionmark_23.gif';
        const imgUrl = rawImgUrl.replace('/images/', '/r/42x62/images/');
        const personUrl = staff.person?.url || '#';
        const name = staff.person?.name || 'Unknown';
        const roleText = (staff.positions || []).join(', ');

        table.innerHTML = `
            <tbody><tr>
                <td valign="top" width="27" class="ac borderClass">
                    <div class="picSurround">
                        <a href="${personUrl}" class="fw-n">
                            <img alt="${name}" width="42" height="62" src="${imgUrl}" loading="lazy">
                        </a>
                    </div>
                </td>
                <td valign="top" class="borderClass">
                    <a href="${personUrl}">${name}</a>
                    <div class="spaceit_pad"><small>${roleText}</small></div>
                </td>
            </tr></tbody>
        `;
        return table;
    }

    function createHideButton(staffData) {
        const btn = document.createElement('span');
        btn.className = 'mse-hide-btn';
        btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
        btn.title = 'Block this person';
        btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); showHidePopup(staffData, btn); });
        return btn;
    }

    function showHidePopup(staffData, anchorElement) {
        document.querySelectorAll('.mse-hide-popup').forEach(p => p.remove());
        document.querySelectorAll('.mse-hide-btn.active').forEach(b => b.classList.remove('active'));
        anchorElement.classList.add('active');

        const popup = document.createElement('div');
        popup.className = 'mse-hide-popup';
        const roles = staffData.roles || [];
        const name = staffData.name || '(Unknown)';

        let html = `<div class="mse-hide-popup-header">${name}</div><div class="mse-hide-popup-actions">`;
        html += `<input type="button" class="inputButton" value="Block from all roles" data-action="all">`;
        if (roles.length === 1) {
            html += `<input type="button" class="inputButton" value="Block from '${roles[0]}' only" data-action="role" data-role="${roles[0]}">`;
        } else if (roles.length > 1) {
            roles.forEach(role => html += `<input type="button" class="inputButton" value="Block from '${role}'" data-action="role" data-role="${role}">`);
        }
        html += `</div>`;
        popup.innerHTML = html;

        const rect = anchorElement.getBoundingClientRect();
        popup.style.left = `${rect.left + window.scrollX}px`;
        popup.style.top = `${rect.bottom + window.scrollY + 4}px`;
        document.body.appendChild(popup);

        const closePopup = () => { popup.remove(); anchorElement.classList.remove('active'); };

        popup.addEventListener('click', (e) => {
            const btn = e.target.closest('.inputButton');
            if (!btn) return;
            const action = btn.dataset.action;
            if (action === 'all') currentSettings.blockedPeople.push({ name: staffData.name, role: null });
            else if (action === 'role') currentSettings.blockedPeople.push({ name: staffData.name, role: btn.dataset.role });
            saveSettings(currentSettings);
            closePopup();
            if (cachedApiEntries) {
                renderStaffList();
            } else if (staffData.element) {
                staffData.element.style.display = 'none';
            }
        });

        setTimeout(() => {
            document.addEventListener('click', function handleOutsideClick(e) {
                if (!popup.contains(e.target) && !anchorElement.contains(e.target)) {
                    closePopup();
                    document.removeEventListener('click', handleOutsideClick);
                }
            });
        }, 0);
    }

    function createEmptyStateMessage() {
        const notice = document.createElement('div');
        notice.className = 'mse-staff-notice';
        notice.textContent = 'All staff entries have been hidden by your Staff Enhancer settings. Adjust your hidden roles or blocked people in the settings to show staff.';
        return notice;
    }

    function parseStaffEntry(table) {
        const nameLink = table.querySelector('.borderClass > a[href*="/people/"]') || table.querySelector('td:not(.ac) a[href*="/people/"]');
        const roleElement = table.querySelector('td small') || table.querySelector('.borderClass small');
        if (!nameLink) return null;

        const name = nameLink.textContent.trim();
        const roleText = roleElement ? roleElement.textContent.trim() : '';
        const roles = roleText.split(',').map(r => r.trim()).filter(Boolean);
        return { name, personUrl: nameLink.href, roles, roleText, element: table };
    }

    function processAndFilterTables(tables, onEmpty) {
        const entries = [];
        tables.forEach(table => {
            const data = parseStaffEntry(table);
            if (!data) return;
            if (isBlocked(data.name, data.roles) || hasHiddenRole(data.roles)) {
                table.style.display = 'none';
                return;
            }
            table.style.display = '';

            const nameCell = table.querySelector('td:not(.ac)');
            if (nameCell && !nameCell.querySelector('.mse-hide-btn')) {
                const hideBtn = createHideButton(data);
                const nameLink = nameCell.querySelector('a');
                if (nameLink) nameLink.parentNode.insertBefore(hideBtn, nameLink.nextSibling);
            }

            entries.push({ ...data, priority: getEffectivePriority(data.roles), roleCount: data.roles.length });
        });

        if (entries.length === 0 && tables.length > 0) { onEmpty(); return []; }

        entries.sort((a, b) => a.priority !== b.priority ? a.priority - b.priority : b.roleCount - a.roleCount);
        return entries;
    }

    async function processStaffList() {
        const staffHeader = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.trim().toLowerCase() === 'staff');
        if (!staffHeader) return;

        const twoColumnContainer = staffHeader.parentElement?.nextElementSibling;
        if (twoColumnContainer?.classList?.contains('detail-characters-list')) {
            await processTwoColumnLayoutWithApi(staffHeader, twoColumnContainer);
        } else {
            processSingleColumnLayout(staffHeader);
        }
    }

    let cachedApiEntries = null;
    let cachedColumns = null;

    function renderStaffList() {
        if (!cachedApiEntries || !cachedColumns) return;
        const { leftColumn, rightColumn } = cachedColumns;
        
        const visibleEntries = cachedApiEntries.filter(e => !isBlocked(e.name, e.roles));
        
        leftColumn.innerHTML = '';
        if (rightColumn) rightColumn.innerHTML = '';
        
        if (visibleEntries.length === 0) {
            leftColumn.appendChild(createEmptyStateMessage());
            return;
        }
        
        const toShow = visibleEntries.slice(0, MAX_STAFF_ON_MAIN_PAGE);
        const midpoint = Math.ceil(toShow.length / 2);
        
        toShow.forEach((entry, index) => {
            const table = createStaffTableElement(entry.apiData);
            if (!entry.wasShown) {
                table.classList.add('mse-new-entry');
                entry.wasShown = true;
            }
            entry.element = table;
            const nameCell = table.querySelector('td:not(.ac)');
            if (nameCell) {
                const hideBtn = createHideButton(entry);
                const nameLink = nameCell.querySelector('a');
                if (nameLink) nameLink.parentNode.insertBefore(hideBtn, nameLink.nextSibling);
            }
            (index < midpoint ? leftColumn : rightColumn || leftColumn).appendChild(table);
        });
    }

    async function processTwoColumnLayoutWithApi(staffHeader, container) {
        const leftColumn = container.querySelector('.left-column.fl-l');
        const rightColumn = container.querySelector('.left-right.fl-r');
        if (!leftColumn) return;

        const mediaInfo = getAnimeIdFromUrl();
        if (!mediaInfo || mediaInfo.type !== 'anime') {
            processTwoColumnLayoutFromDom(container);
            return;
        }

        const loadingEl = document.createElement('div');
        loadingEl.className = 'mse-loading';
        loadingEl.textContent = 'Loading staff data...';
        container.prepend(loadingEl);

        try {
            const staffFromApi = await fetchStaffFromJikan(mediaInfo.id);
            loadingEl.remove();
            
            const entries = [];
            staffFromApi.forEach(staff => {
                const name = staff.person?.name || '';
                const roles = staff.positions || [];
                if (hasHiddenRole(roles)) return;
                entries.push({ name, personUrl: staff.person?.url || '#', roles, imageUrl: staff.person?.images?.jpg?.image_url, priority: getEffectivePriority(roles), roleCount: roles.length, apiData: staff });
            });

            entries.sort((a, b) => a.priority !== b.priority ? a.priority - b.priority : b.roleCount - a.roleCount);
            
            cachedApiEntries = entries;
            cachedColumns = { leftColumn, rightColumn };
            
            renderStaffList();
        } catch (error) {
            console.error('MAL Staff Enhancer: Failed to fetch from Jikan API', error);
            loadingEl.remove();
            processTwoColumnLayoutFromDom(container);
        }
    }

    function processTwoColumnLayoutFromDom(container) {
        const leftColumn = container.querySelector('.left-column.fl-l');
        const rightColumn = container.querySelector('.left-right.fl-r');
        if (!leftColumn) return;

        const tables = Array.from(container.querySelectorAll('table'));
        const entries = processAndFilterTables(tables, () => {
            leftColumn.innerHTML = '';
            if (rightColumn) rightColumn.innerHTML = '';
            leftColumn.appendChild(createEmptyStateMessage());
        });

        if (entries.length === 0) return;

        leftColumn.innerHTML = '';
        if (rightColumn) rightColumn.innerHTML = '';

        const midpoint = Math.ceil(entries.length / 2);
        entries.forEach((entry, index) => {
            (index < midpoint ? leftColumn : rightColumn || leftColumn).appendChild(entry.element);
        });
    }

    function processSingleColumnLayout(staffHeader) {
        const staffAnchor = document.querySelector('a[name="staff"]');
        if (!staffAnchor) return;

        const tables = [];
        let sibling = staffAnchor.nextElementSibling;
        while (sibling) {
            if (sibling.tagName === 'TABLE') tables.push(sibling);
            else if (sibling.tagName === 'A' && sibling.name) break;
            sibling = sibling.nextElementSibling;
        }

        const entries = processAndFilterTables(tables, () => {
            staffHeader.parentElement.after(createEmptyStateMessage());
        });

        if (entries.length === 0) return;

        entries.forEach(entry => entry.element.remove());
        const headerContainer = staffHeader.parentElement;
        let lastInserted = headerContainer;
        entries.forEach(entry => {
            lastInserted.after(entry.element);
            lastInserted = entry.element;
        });

        entries.forEach((entry, index) => {
            entry.element.querySelectorAll('td').forEach(cell => {
                cell.classList.remove('bgColor1', 'bgColor2');
                cell.classList.add(index % 2 === 0 ? 'bgColor1' : 'bgColor2');
            });
        });
    }

    function init() {
        injectStyles();
        injectDropdownLink();
        processStaffList();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();