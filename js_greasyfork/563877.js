// ==UserScript==
// @name         Torn Mailer Presets
// @namespace    torn.mailer.presets
// @version      1.1.2
// @description  Mailer presets ideal for recruitment
// @match        https://www.torn.com/page.php?sid=UserList*
// @match        https://www.torn.com/messages.php*
// @match        https://www.torn.com/profiles.php?*
// @run-at       document-end
// @grant        none
// @author       Recon-
// @license      None
// @downloadURL https://update.greasyfork.org/scripts/563877/Torn%20Mailer%20Presets.user.js
// @updateURL https://update.greasyfork.org/scripts/563877/Torn%20Mailer%20Presets.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ============================
       STORAGE
    ============================ */

    const PRESET_KEY  = 'TM_presets';
    const ACTIVE_KEY  = 'TM_activePreset';
    const DRAFT_KEY   = 'TM_mailDraft';
    const HISTORY_KEY = 'TM_sentHistory';
    const SETTINGS_KEY = 'TM_settings';
    const PROCESSED_ATTR = 'data-mail-injected';


    /* ============================
       SETTINGS
    ============================ */


    function loadSettings() {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
        const defaults = {
            iconsEnabled: true,        // show mail icons by default
            hideMailedUsers: false     // do not hide users by default
        };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaults));
        return defaults;
    }
    return JSON.parse(raw);
}

function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}


    function openSettingsPanel(panelType = 'presets') {
    if (document.getElementById('TM_settingsPanel')) return;

    let presets = loadPresets();
    let active = getActivePreset();
    const settings = loadSettings();

    let selectedPresetId = active.id;
    let isDirty = false;
    let currentPanelView = panelType;

    const panel = document.createElement('div');
    panel.id = 'TM_settingsPanel';

    panel.innerHTML = `
        <header>
            <button id="TM_panelPresets" style="margin-right:8px;color:white;">Presets</button>
            <button id="TM_panelSettings" style="color:white;">Settings</button>
        </header>
        <div id="TM_panelContent"></div>
    `;

    document.body.appendChild(panel);

        function outsideClickHandler(e) {
        if (!panel.contains(e.target)) {
            closePanelSafely();
        }
    }

    setTimeout(() => {
        document.addEventListener('mousedown', outsideClickHandler);
    }, 0);


    const presetsBtn  = panel.querySelector('#TM_panelPresets');
const settingsBtn = panel.querySelector('#TM_panelSettings');

function setActiveTab(tab) {
    presetsBtn.classList.remove('TM_activeTab');
    settingsBtn.classList.remove('TM_activeTab');

    if (tab === 'presets') {
        presetsBtn.classList.add('TM_activeTab');
    } else {
        settingsBtn.classList.add('TM_activeTab');
    }
}

presetsBtn.onclick = () => {
    setActiveTab('presets');
    currentPanelView = 'presets';
    renderPresetsPanel(true);
};


settingsBtn.onclick = () => {
    setActiveTab('settings');
    currentPanelView = 'presets';
    renderSettingsPanel();
};


    if (panelType === 'settings') {
    currentPanelView = 'settings';
    setActiveTab('settings');
    renderSettingsPanel();
} else {
    setActiveTab('presets');
    renderPresetsPanel();
}

        function animatePanelChange(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateX(10px)';

    requestAnimationFrame(() => {
        el.style.transition = 'all 0.15s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
    });
}




    /* ==========================
       Helpers
    ========================== */

    function markDirty() {
        isDirty = true;
    }

    function confirmClose() {
        if (!isDirty) return true;
        return confirm('You have unsaved changes. Close anyway?');
    }

    function closePanelSafely() {
        if (!confirmClose()) return;
        panel.remove();
        document.removeEventListener('mousedown', outsideClickHandler);
    }


     /* ============================
   Clear Storage Dialog
============================ */

function openClearStorageDialog(onComplete) {

    const content = panel.querySelector('#TM_panelContent');

    const previousView = currentPanelView;
    currentPanelView = 'clear';

    content.innerHTML = `

        <div class="TM_panelScroll">

            <div class="TM_clearBox" style="width:100%; box-sizing:border-box;">

                <h3>Clear Storage</h3>

                <div class="TM_clearRow">
                    <input type="checkbox" id="TM_clear_presets" checked>
                    <label for="TM_clear_presets">Presets</label>
                </div>

                <div class="TM_clearRow">
                    <input type="checkbox" id="TM_clear_active" checked>
                    <label for="TM_clear_active">Active Preset</label>
                </div>

                <div class="TM_clearRow">
                    <input type="checkbox" id="TM_clear_draft" checked>
                    <label for="TM_clear_draft">Mail Draft</label>
                </div>

                <div class="TM_clearRow">
                    <input type="checkbox" id="TM_clear_history" checked>
                    <label for="TM_clear_history">Send History</label>
                </div>

                <div class="TM_clearRow">
                    <input type="checkbox" id="TM_clear_settings">
                    <label for="TM_clear_settings">Settings</label>
                </div>

            </div>

        </div>

        <footer class="TM_panelFooter">
            <button id="TM_clearConfirm">Clear Selected</button>
            <button id="TM_clearCancel">Back</button>
        </footer>
    `;

    animatePanelChange(content);


    /* Back */
    content.querySelector('#TM_clearCancel').onclick = () => {

        currentPanelView = previousView;

        if (previousView === 'settings') {
            setActiveTab('settings');
            renderSettingsPanel(true);
        } else {
            setActiveTab('presets');
            renderPresetsPanel(true);
        }
    };


    /* Confirm */
    content.querySelector('#TM_clearConfirm').onclick = () => {

        if (document.getElementById('TM_clear_presets').checked) {
            localStorage.removeItem(PRESET_KEY);
        }

        if (document.getElementById('TM_clear_active').checked) {
            localStorage.removeItem(ACTIVE_KEY);
        }

        if (document.getElementById('TM_clear_draft').checked) {
            localStorage.removeItem(DRAFT_KEY);
        }

        if (document.getElementById('TM_clear_history').checked) {
            localStorage.removeItem(HISTORY_KEY);
        }

        if (document.getElementById('TM_clear_settings').checked) {
            localStorage.removeItem(SETTINGS_KEY);
        }

        if (typeof onComplete === 'function') {
            onComplete();
        }

        currentPanelView = previousView;

        if (previousView === 'settings') {
            renderSettingsPanel(true);
        } else {
            renderPresetsPanel(true);
        }
    };
}




    /* ==========================
       Presets Panel
    ========================== */

    function renderPresetsPanel(animate = false) {

        presets = loadPresets();
        active = getActivePreset();

        const content = panel.querySelector('#TM_panelContent');
        if (animate) animatePanelChange(content);

        const current = presets.find(p => p.id === selectedPresetId) || active;

        const isDefault = current.name === 'Default';

        content.innerHTML = `
    <div class="TM_panelScroll">

        <div class="row">

                <label>Preset</label>

                <select id="TM_presetSelect">
                    ${presets.map(p => {

                        const isSelected = p.id === selectedPresetId;
                        const isActive = p.id === active.id;

                        const label = isActive
                            ? `${p.name} 🗹`
                            : p.name;

                        return `<option value="${p.id}" ${isSelected ? 'selected' : ''}>${label}</option>`;

                    }).join('')}
                </select>

                <button id="TM_newPreset">New</button>

                ${isDefault ? '' : `<button id="TM_deletePreset">Delete</button>`}

                <button id="TM_setActive">Set Active</button>
            </div>

            <div class="row">
                <label>Subject</label>
                <input id="TM_subject"
                       value="${current.subject}"
                       ${isDefault ? 'readonly' : ''}
                       style="${isDefault ? 'background:#eee;' : ''}">
            </div>

            <div class="row">
                <label>Body</label>
                <textarea id="TM_body"
                          ${isDefault ? 'readonly' : ''}
                          style="${isDefault ? 'background:#eee;' : ''}">${current.body}</textarea>
            </div>

            <div class="row TM_modeRow">
                <input type="radio" name="TM_mode" value="rich"
                    ${current.mode === 'rich' ? 'checked' : ''}>

                <span>Plain Text</span>

                <input type="radio" name="TM_mode" value="html"
                    ${current.mode === 'html' ? 'checked' : ''}>

                <span>HTML</span>
            </div>

                        <div class="TM_infoBlock">
                <hr> <br>Colour Indicators:<br><br>

                <div class="TM_infoLine">
                    <span class="TM_dot green"></span> Not messaged yet
                </div>

                <div class="TM_infoLine">
                    <span class="TM_dot red"></span> Messaged with current preset
                </div>

                <div class="TM_infoLine">
                    <span class="TM_dot orange"></span> Messaged with another preset
                </div><br>

                <hr>
            </div>

            </div>
            <footer class="TM_panelFooter">
                <button id="TM_clear">Clear Storage</button>

                <div>
                    <button id="TM_save">Save</button>
                    <button id="TM_close">Close</button>
                </div>
            </footer>

        `;


        /* ==========================
           Change Tracking
        ========================== */

        content.querySelectorAll('#TM_subject,#TM_body,input[name="TM_mode"]')
            .forEach(el => {
                el.addEventListener('input', markDirty);
                el.addEventListener('change', markDirty);
            });


        /* ==========================
           Preset Switch
        ========================== */

        const presetSelect = content.querySelector('#TM_presetSelect');

        presetSelect.onchange = () => {

            if (isDirty && !confirm('Discard unsaved changes?')) {
                presetSelect.value = selectedPresetId;
                return;
            }

            selectedPresetId = presetSelect.value;
            isDirty = false;

            renderPresetsPanel();
        };


        /* ==========================
           New Preset
        ========================== */

        content.querySelector('#TM_newPreset').onclick = () => {

            const name = prompt('Preset name?');
            if (!name) return;

            const newPreset = {
                id: crypto.randomUUID(),
                name,
                subject: '',
                body: '',
                mode: 'rich'
            };

            presets.push(newPreset);
            savePresets(presets);

            selectedPresetId = newPreset.id;
            isDirty = false;

            renderPresetsPanel();
        };


        /* ==========================
           Delete Preset
        ========================== */

        const delBtn = content.querySelector('#TM_deletePreset');

        if (delBtn) {

            delBtn.onclick = () => {

                if (!confirm(`Delete "${current.name}"?`)) return;

                presets = presets.filter(p => p.id !== current.id);

                savePresets(presets);

                if (current.id === active.id) {
                    localStorage.setItem(ACTIVE_KEY, presets[0].id);
                }

                selectedPresetId = presets[0].id;
                isDirty = false;

                renderPresetsPanel();
            };
        }


        /* ==========================
           Set Active
        ========================== */

        content.querySelector('#TM_setActive').onclick = () => {

            localStorage.setItem(ACTIVE_KEY, selectedPresetId);

            active = getActivePreset();

            renderPresetsPanel();
        };


        /* ==========================
           Save
        ========================== */

        content.querySelector('#TM_save').onclick = () => {

            const p = presets.find(x => x.id === selectedPresetId);

            if (!p) return;

            p.subject = content.querySelector('#TM_subject').value;
            p.body = content.querySelector('#TM_body').value;
            p.mode = content.querySelector('input[name="TM_mode"]:checked').value;

            savePresets(presets);

            isDirty = false;

            alert('Saved.');
        };


        /* ==========================
           Clear
        ========================== */

        content.querySelector('#TM_clear').onclick = () => {

    openClearStorageDialog(() => {

        panel.remove();
        location.reload();

    });

};





        /* ==========================
           Close
        ========================== */

        content.querySelector('#TM_close').onclick = () => {

            if (!confirmClose()) return;

            panel.remove();
        };
    }


    /* ==========================
       Settings Panel
    ========================== */

    function renderSettingsPanel(animate = false) {

        const content = panel.querySelector('#TM_panelContent');
        if (animate) animatePanelChange(content);

        content.innerHTML = `
    <div class="TM_panelScroll">

            <div class="row TM_checkboxRow">
                <input type="checkbox" id="TM_iconsEnabled"
                    ${settings.iconsEnabled ? 'checked' : ''}>

                <label for="TM_iconsEnabled">Enable Mailer Icons</label>
            </div>

            <div class="row TM_checkboxRow">
                <input type="checkbox" id="TM_hideMailedUsers"
                    ${settings.hideMailedUsers ? 'checked' : ''}>

                <label for="TM_hideMailedUsers">
                    Hide mailed users
                </label>
            </div>


                        <div class="TM_infoBlock">
                <hr><br> Colour Indicators:<br><br>

                <div class="TM_infoLine">
                    <span class="TM_dot green"></span> Not messaged yet
                </div>

                <div class="TM_infoLine">
                    <span class="TM_dot red"></span> Messaged with current preset
                </div>

                <div class="TM_infoLine">
                    <span class="TM_dot orange"></span> Messaged with another preset
                </div><br>

                <hr>
            </div>

            </div>
            <footer class="TM_panelFooter">
                <button id="TM_clear">Clear Storage</button>

                <div>
                    <button id="TM_save">Save</button>
                    <button id="TM_close">Close</button>
                </div>
            </footer>

        `;


        content.querySelectorAll('input').forEach(el => {
            el.addEventListener('change', markDirty);
        });


        content.querySelector('#TM_save').onclick = () => {

            settings.iconsEnabled =
                content.querySelector('#TM_iconsEnabled').checked;

            settings.hideMailedUsers =
                content.querySelector('#TM_hideMailedUsers').checked;

            saveSettings(settings);

            applyUserHiding();

            isDirty = false;

            alert('Saved.');
        };


        content.querySelector('#TM_clear').onclick = () => {

    openClearStorageDialog(() => {

        closePanelSafely();
        location.reload();

    });

};




        content.querySelector('#TM_close').onclick = () => {

            if (!confirmClose()) return;

            closePanelSafely();
        };
    }
}


/* ==========================
   Hide users already messaged
========================== */
function applyUserHiding() {
    const settings = loadSettings();
    if (!settings.hideMailedUsers) return;

    const history = loadHistory();
    const active = getActivePreset();

    document.querySelectorAll('li[class^="user"]').forEach(li => {
        const userLink = li.querySelector('a.user.name');
        if (!userLink) return;

        const match = userLink.href.match(/XID=(\d+)/);
        if (!match) return;

        const userId = match[1];
        if (history[userId]) {
            const color = history[userId] === active.id ? '#e74c3c' : '#f39c12';
            if (color === '#f39c12' || color === '#e74c3c') {
                li.style.display = 'none'; // hide the full <li> element
            }
        }
    });
}




    /* ============================
       PRESETS
    ============================ */

    function loadPresets() {

        const raw = localStorage.getItem(PRESET_KEY);

        if (!raw) {

            const defaultPreset = {
                id: crypto.randomUUID(),
                name: 'Default',
                subject: 'Come Join us at Occultus',
                body: '<p><a href="/factions.php?step=profile&amp;ID=33097">Join Occultus</a><br />You know you want to!</p>',
                mode: 'html'
            };

            localStorage.setItem(PRESET_KEY, JSON.stringify([defaultPreset]));
            localStorage.setItem(ACTIVE_KEY, defaultPreset.id);

            return [defaultPreset];
        }

        return JSON.parse(raw);
    }


    function savePresets(presets) {
        localStorage.setItem(PRESET_KEY, JSON.stringify(presets));
    }


    function getActivePreset() {

        const presets = loadPresets();
        const activeId = localStorage.getItem(ACTIVE_KEY);

        return presets.find(p => p.id === activeId) || presets[0];
    }


    /* ============================
       HISTORY
    ============================ */

    function loadHistory() {
        return JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
    }


    function saveHistory(history) {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }


    function recordSend(playerId, presetId) {

        const history = loadHistory();

        history[playerId] = presetId;

        saveHistory(history);
    }


    function getIconColor(playerId) {

        const history = loadHistory();
        const active = getActivePreset();

        if (!history[playerId]) return '#2ecc71';
        if (history[playerId] === active.id) return '#e74c3c';

        return '#f39c12';
    }


    /* ============================
       CSS
    ============================ */

    const style = document.createElement('style');

    style.textContent = `
        .honor-text-wrap {
            position: relative;
        }

        .TM_mailIcon {
            position: absolute;
            right: -50px;
            top: 60%;
            transform: translateY(-50%);
            cursor: pointer;
            z-index: 5;
        }

        .TM_mailIcon svg {
            width: 35px;
            height: 35px;
            fill: currentColor;
            opacity: 0.7;
            transition: opacity 0.2s ease;
        }

        .TM_mailIcon:hover svg {
            opacity: 1;
        }

        #TM_settingsPanel {
    position: fixed;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    width: 450px;
    max-width: 90vw;

    /* NEW */
    height: 550px;
    display: flex;
    flex-direction: column;

    background: #e6e6e6;
    border: 2px solid #344556;
    z-index: 99999;
    font-family: Arial, Helvetica, sans-serif;
    box-sizing: border-box;
}

#TM_panelContent {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Scrollable main area */
.TM_panelScroll {
    flex: 1;
    display: flex;
    flex-direction: column;

    overflow-y: auto;
    overflow-x: hidden;
}


/* Footer always at bottom */
.TM_panelFooter {
    flex-shrink: 0;
}



        #TM_settingsPanel header {
            background: #344556;
            color: white;
            padding: 8px;
            font-weight: bold;
        }

        #TM_settingsPanel select,
        #TM_settingsPanel input,
        #TM_settingsPanel textarea {
            width: 100%;
            box-sizing: border-box;
        }

        #TM_settingsPanel textarea {
            height: 160px;
        }

        #TM_settingsPanel .row {
            padding: 8px;
        }

        /* Radio layout */
        .TM_modeRow {
            display: grid;
            grid-template-columns: auto 1fr;
            row-gap: 6px;
            column-gap: 6px;
            align-items: center;
        }

        .TM_modeRow input[type="radio"] {
            margin: 0;
        }

        #TM_settingsPanel footer {
            display: flex;
            justify-content: space-between;
            padding: 8px;
        }

        .TM_profileIndicator {
    width: 3%;
    height: 35%;
    border-radius: 50%;
    margin-right: 6px;
    display: inline-block;
    flex-shrink: 0;
}


/* Settings checkbox alignment */
.TM_checkboxRow {
    display: flex !important;
    align-items: center;
    justify-content: flex-start !important;
    gap: 6px;
}

.TM_checkboxRow input {
    width: auto !important;
    margin: 0;
}

.TM_checkboxRow label {
    width: auto !important;
    margin: 0;
    cursor: pointer;
}

/* Clear Storage Dialog */


.TM_clearBox {
    background: #e6e6e6;
    border: 2px solid #344556;
    width: 320px;
    padding: 12px;
    font-family: Arial, Helvetica, sans-serif;
}

.TM_clearBox h3 {
    margin: 0 0 10px 0;
    background: #344556;
    color: white;
    padding: 6px;
    font-size: 14px;
}

.TM_clearRow {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 6px;

    padding: 4px 0;
}


.TM_clearRow input {
    width: auto !important;
    margin: 0;
    flex-shrink: 0;
}

.TM_clearRow label {
    cursor: pointer;
    white-space: nowrap;
}


.TM_clearFooter {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
}

/* Info block in settings panel */

.TM_infoBlock {
    margin-top: auto;
    padding: 6px 10px;
    font-size: 12px;
    color: #222;
}



.TM_infoBlock hr {
    border: none;
    border-top: 1px solid #999;
    margin: 6px 0;
}

.TM_infoLine {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 2px 0;
}

.TM_infoHelp {
    margin-top: 6px;
    font-style: italic;
    color: #444;
}

/* Color dots */

.TM_dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
}

.TM_dot.green {
    background: #2ecc71;
}

.TM_dot.red {
    background: #e74c3c;
}

.TM_dot.orange {
    background: #f39c12;
}

/* Active tab highlight */

#TM_settingsPanel header button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    font-weight: bold;
    opacity: 0.7;
}

#TM_settingsPanel header button.TM_activeTab {
    border-bottom: 2px solid #fff;
    opacity: 1;
}




    `;

    document.head.appendChild(style);


    /* ============================
       TOOLBAR
    ============================ */

    function injectToolbarButton() {

        if (location.href.includes('profiles.php')) return;

        const container = document.querySelector('#top-page-links-list');

        if (!container || container.querySelector('.TM_settingsBtn')) return;

        const btn = document.createElement('a');

        btn.className = 'TM_settingsBtn t-clear h c-pointer line-h24 right last';

        btn.innerHTML = `
            <span class="icon-wrap svg-icon-wrap">
                <span class="link-icon-svg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-7 -5 25 25">
                        <path d="M9,8,0,1H18ZM4.93,6.7,0,2.85v9Zm8.14,0L18,11.88v-9Zm-1.17.91L9,9.87,6.1,7.61,0,14H18Z"></path>
                    </svg>
                </span>
            </span>
            <span>Mailer Settings</span>
        `;

        btn.onclick = e => {
    e.preventDefault();
    openSettingsPanel('presets'); // new function
};


        container.appendChild(btn);
    }


    /* ============================
       MAIL ICONS
    ============================ */

    function extractPlayerId(div) {

        const img = div.querySelector('img[alt]');
        const match = img?.alt.match(/\[(\d+)\]/);

        return match ? match[1] : null;
    }


    function createMailIcon(playerId) {

    const a = document.createElement('a');

    a.className = 'TM_mailIcon';
    a.href = `https://www.torn.com/messages.php#/p=compose&XID=${playerId}`;
    a.target = '_blank';

    // Initial color
    a.style.color = getIconColor(playerId);

    // Tooltip
    a.title = getIconColorTooltip(playerId);

    a.onclick = () => {

        const preset = getActivePreset();

        localStorage.setItem(DRAFT_KEY, JSON.stringify({
            subject: preset.subject,
            body: preset.body,
            mode: preset.mode,
            time: Date.now()
        }));

        recordSend(playerId, preset.id);

// Update icon color & tooltip immediately
a.style.color = getIconColor(playerId);
a.title = getIconColorTooltip(playerId);

// Auto-hide if enabled
applyUserHiding();

    };

    a.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-7 -9 34 34">
            <path d="M9,8,0,1H18ZM4.93,6.7,0,2.85v9Zm8.14,0L18,11.88v-9Zm-1.17.91L9,9.87,6.1,7.61,0,14H18Z"></path>
        </svg>
    `;

    return a;
}



    function injectIcons() {

    const settings = loadSettings();
    if (!settings.iconsEnabled) return; // do not inject icons if disabled

    document.querySelectorAll('.honor-text-wrap').forEach(div => {

        if (div.hasAttribute(PROCESSED_ATTR)) return;

        const id = extractPlayerId(div);
        if (!id) return;

        div.setAttribute(PROCESSED_ATTR, 'true');

        const icon = createMailIcon(id);
        div.appendChild(icon);

        // hide users if option enabled and user has been mailed (orange/red)
        if (settings.hideMailedUsers) {
            const color = getIconColor(id);
            if (color === '#f39c12' || color === '#e74c3c') {
                div.style.display = 'none';
            }
        }
    });
}



/* ============================
   PROFILE ACTION BAR
============================ */

function injectProfileActionBar() {

    if (!location.href.includes('profiles.php')) return;

    const normalBtn = document.querySelector('.TM_settingsBtn');
    if (normalBtn) normalBtn.style.display = 'none';

    setTimeout(() => {

        const profileLeft = document.querySelector('.profile-left-wrapper.left .user-information');
        if (!profileLeft) return;

        const userInfoTitle = profileLeft.querySelector('.title-black.top-round');
        if (!userInfoTitle) return;

        if (profileLeft.querySelector('.TM_profileBar')) return;

        const galleryLink = profileLeft.querySelector('.profile-image-wrapper');
        const match = galleryLink?.href.match(/XID=(\d+)/);
        if (!match) return;

        const playerId = match[1];

        const bar = document.createElement('div');
        bar.className = 'title-black top-round TM_profileBar';

        bar.style.display = 'flex';
        bar.style.justifyContent = 'space-between';
        bar.style.alignItems = 'center';
        bar.style.padding = '1px 10px';
        bar.style.fontSize = '12px';
        bar.style.fontWeight = 'bold';
        bar.style.color = '#fff';
        bar.style.marginBottom = '6px';

        // Left container: indicator + mail button
const leftContainer = document.createElement('div');
leftContainer.style.display = 'flex';
leftContainer.style.alignItems = 'center';
leftContainer.style.gap = '6px'; // space between indicator and mail button

// Colored indicator
const indicator = document.createElement('span');
indicator.className = 'TM_profileIndicator';
indicator.style.backgroundColor = getIconColor(playerId);
indicator.style.width = '10px';
indicator.style.height = '10px';
indicator.style.borderRadius = '50%';
indicator.style.flexShrink = '0';
indicator.title = getIconColorTooltip(playerId);

// Mail button
const mailBtn = document.createElement('a');
mailBtn.href = `https://www.torn.com/messages.php#/p=compose&XID=${playerId}`;
mailBtn.target = '_blank';
mailBtn.className = 't-clear h c-pointer';
mailBtn.textContent = 'Mail User';
mailBtn.style.color = '#fff';

// Mail button click updates indicator immediately
mailBtn.onclick = (e) => {
    e.preventDefault();
    const preset = getActivePreset();

    localStorage.setItem(DRAFT_KEY, JSON.stringify({
        subject: preset.subject,
        body: preset.body,
        mode: preset.mode,
        time: Date.now()
    }));

    recordSend(playerId, preset.id); // update history

// Update indicator color & tooltip
indicator.style.backgroundColor = getIconColor(playerId);
indicator.title = getIconColorTooltip(playerId);

// Auto-hide if enabled
applyUserHiding();


    window.open(mailBtn.href, '_blank');
};

leftContainer.appendChild(indicator);
leftContainer.appendChild(mailBtn);


        // Divider
        const divider = document.createElement('div');
        divider.style.width = '1px';
        divider.style.backgroundColor = '#fff';
        divider.style.height = '70%';
        divider.style.margin = '0 6px';

        // Right container: settings button
        const rightContainer = document.createElement('div');

        const settingsBtn = document.createElement('a');
        settingsBtn.href = '#';
        settingsBtn.className = 't-clear h c-pointer';
        settingsBtn.textContent = 'Presets';
        settingsBtn.style.color = '#fff';

        settingsBtn.onclick = (e) => {
            e.preventDefault();
            openSettingsPanel('presets');
        };

        rightContainer.appendChild(settingsBtn);

        // Append to bar
        bar.appendChild(leftContainer);
        bar.appendChild(divider);
        bar.appendChild(rightContainer);

        userInfoTitle.parentNode.insertBefore(bar, userInfoTitle);

    }, 100);
}


     /* ============================
       IconTooltip
    ============================ */

    function getIconColorTooltip(playerId) {
    const history = loadHistory();
    const active = getActivePreset();

    if (!history[playerId]) return 'Not messaged yet (green)';
    if (history[playerId] === active.id) return 'Messaged with current preset (red)';
    return 'Messaged with another preset (orange)';
}


    /* ============================
       AUTOFILL
    ============================ */

    function autofill() {

        if (!location.href.includes('messages.php')) return;
        if (!location.hash.includes('compose')) return;

        const raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return;

        const draft = JSON.parse(raw);

        if (Date.now() - draft.time > 30000) return;


        const subject = document.querySelector('input[name="subject"]');
        const editor  = document.querySelector('.editor-content[contenteditable]');
        const hidden  = document.querySelector('input[type="hidden"][name^="mce_"]');

        if (!subject || !editor || !hidden) return;


        subject.value = draft.subject;
        subject.dispatchEvent(new Event('input', { bubbles: true }));


        editor.innerHTML = draft.mode === 'html'
            ? draft.body
            : draft.body.split('\n').map(l => `<p>${l || '<br>'}</p>`).join('');


        hidden.value = editor.innerHTML;

        editor.dispatchEvent(new Event('input', { bubbles: true }));

        localStorage.removeItem(DRAFT_KEY);
    }


    /* ============================
       INIT
    ============================ */

    injectIcons();
    injectToolbarButton();
    injectProfileActionBar();
    autofill();


    new MutationObserver(() => {

        injectIcons();
        injectToolbarButton();
        injectProfileActionBar();
        autofill();

    }).observe(document.body, {
        childList: true,
        subtree: true
    });

})();