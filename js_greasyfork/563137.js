// ==UserScript==
// @name         W2G Extras
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  W2G Extras: Toggle Playlist & User List
// @author       ClarkyAU
// @match        https://*.w2g.tv/*
// @grant        none
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/563137/W2G%20Extras.user.js
// @updateURL https://update.greasyfork.org/scripts/563137/W2G%20Extras.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self !== window.top) return;

    // --- Config & Selectors ---
    const STORAGE_KEY = 'w2g_extras_config';
    const STYLE_ID = 'w2g-extras-styles';

    const UI = {
        sidebar: '.relative.flex.flex-col.items-center.justify-between.h-full',
        sidebarIcons: 'div, nav',
        playlist: '.w2g-content-right.w2g-bind-layout',
        userList: '.bg-w2g-dark-userlist'
    };

    // --- State Management ---
    let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        hidePlaylist: false,
        hideUsers: false
    };

    // --- DOM Helper ---
    const el = (tag, props = {}, parent = null) => {
        const node = document.createElement(tag);
        if (props.id) node.id = props.id;
        if (props.cls) node.className = props.cls;
        if (props.text) node.innerText = props.text;
        if (props.html) node.innerHTML = props.html;
        if (props.type) node.type = props.type;
        if (props.checked !== undefined) node.checked = props.checked;
        if (props.click) node.addEventListener('click', props.click);
        if (props.change) node.addEventListener('change', props.change);
        if (parent) parent.appendChild(node);
        return node;
    };

    // --- Styles ---
    const styles = `
        /* Dynamic Hiding */
        body.w2g-hide-playlist ${UI.playlist} { display: none !important; }
        body.w2g-hide-users ${UI.userList} { display: none !important; }

        /* Sidebar Button */
        #w2g-extras-btn {
            position: relative; z-index: 9999; pointer-events: auto;
            cursor: pointer; height: 40px; display: flex;
            align-items: center; justify-content: center;
            margin-top: 15px; padding: 0 8px; border-radius: 6px;
            color: #aaa; font-family: ui-sans-serif, system-ui, sans-serif;
            font-size: 10px; font-weight: 700; text-transform: uppercase;
            letter-spacing: 0.05em; border: 1px solid transparent;
            transition: all 0.2s;
        }
        #w2g-extras-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }

        /* Modal Overlay */
        #w2g-overlay {
            display: none; position: fixed; top: 0; left: 0;
            width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7);
            z-index: 99998; backdrop-filter: blur(2px);
        }

        /* Modal Window */
        #w2g-modal {
            display: none; position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%); width: 300px;
            background: #1a1a1a; border: 1px solid #444; border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.8); z-index: 99999;
            font-family: ui-sans-serif, system-ui, sans-serif; color: #eee;
            overflow: hidden;
        }

        .w2g-header {
            background: #252525; padding: 12px 15px; border-bottom: 1px solid #333;
            display: flex; justify-content: space-between; align-items: center;
        }
        .w2g-title { font-size: 14px; font-weight: 700; text-transform: uppercase; color: #fff; }
        .w2g-close { cursor: pointer; color: #888; font-weight: bold; font-size: 18px; line-height: 1; }
        .w2g-close:hover { color: #fff; }

        .w2g-body { padding: 20px; display: flex; flex-direction: column; gap: 15px; }
        .w2g-row {
            display: flex; align-items: center; justify-content: space-between;
            padding: 8px 0; border-bottom: 1px solid #2a2a2a;
        }
        .w2g-row:last-child { border-bottom: none; }
        .w2g-lbl { font-size: 13px; color: #ccc; }
        .w2g-chk { width: 16px; height: 16px; cursor: pointer; accent-color: #d32f2f; }

        /* Save Button States */
        #w2g-save {
            margin-top: 10px; padding: 8px; border-radius: 4px; text-align: center;
            font-weight: bold; font-size: 12px; text-transform: uppercase;
            cursor: pointer; transition: all 0.2s; color: white; border: 1px solid transparent;
        }
        #w2g-save.is-grey  { background: #444; color: #aaa; border-color: #555; }
        #w2g-save.is-grey:hover { background: #555; color: #fff; }

        #w2g-save.is-red   { background: #d32f2f; border-color: #b71c1c; box-shadow: 0 0 5px rgba(211,47,47,0.4); }
        #w2g-save.is-red:hover { background: #e53935; }

        #w2g-save.is-green { background: #2e7d32; border-color: #1b5e20; }
        #w2g-save.is-green:hover { background: #388e3c; }
    `;

    // --- Core Logic ---

    const applyState = () => {
        document.body.classList.toggle('w2g-hide-playlist', state.hidePlaylist);
        document.body.classList.toggle('w2g-hide-users', state.hideUsers);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        window.dispatchEvent(new Event('resize'));
    };

    const updateSaveBtn = (forceSuccess = false) => {
        const btn = document.getElementById('w2g-save');
        const playlistInput = document.getElementById('chk-playlist');
        const usersInput = document.getElementById('chk-users');

        if (!btn || !playlistInput || !usersInput) return;

        if (forceSuccess) {
            btn.className = 'is-green';
            btn.innerText = 'Settings Saved';
            return;
        }

        const hasChanges = (playlistInput.checked !== state.hidePlaylist) ||
                           (usersInput.checked !== state.hideUsers);

        if (hasChanges) {
            btn.className = 'is-red';
            btn.innerText = 'Save Changes';
        } else {
            btn.className = 'is-grey';
            btn.innerText = 'No Changes';
        }
    };

    const toggleModal = (show) => {
        const overlay = document.getElementById('w2g-overlay');
        const modal = document.getElementById('w2g-modal');

        if (show) {
            // Reset inputs to match saved state
            const pInput = document.getElementById('chk-playlist');
            const uInput = document.getElementById('chk-users');
            if (pInput) pInput.checked = state.hidePlaylist;
            if (uInput) uInput.checked = state.hideUsers;
            updateSaveBtn();
        }

        const display = show ? 'block' : 'none';
        if (overlay) overlay.style.display = display;
        if (modal) modal.style.display = display;
    };

    const save = () => {
        const pInput = document.getElementById('chk-playlist');
        const uInput = document.getElementById('chk-users');

        if (pInput) state.hidePlaylist = pInput.checked;
        if (uInput) state.hideUsers = uInput.checked;

        applyState();
        updateSaveBtn(true);
    };

    // --- UI Rendering ---

    const injectStyles = () => {
        if (document.getElementById(STYLE_ID)) return;
        const sheet = document.createElement('style');
        sheet.id = STYLE_ID;
        sheet.innerText = styles;
        document.head.appendChild(sheet);
    };

    const buildModal = () => {
        if (document.getElementById('w2g-modal')) return;

        // Overlay
        el('div', { id: 'w2g-overlay', click: () => toggleModal(false) }, document.body);

        // Modal
        const modal = el('div', { id: 'w2g-modal' }, document.body);

        // Header
        const header = el('div', { cls: 'w2g-header' }, modal);
        el('div', { cls: 'w2g-title', text: 'W2G Extras Settings' }, header);
        el('div', { cls: 'w2g-close', html: '&times;', click: () => toggleModal(false) }, header);

        // Body
        const body = el('div', { cls: 'w2g-body' }, modal);
        const row1 = el('div', { cls: 'w2g-row' }, body);
        el('span', { cls: 'w2g-lbl', text: 'Hide Playlist' }, row1);
        el('input', { id: 'chk-playlist', type: 'checkbox', cls: 'w2g-chk', checked: state.hidePlaylist, change: () => updateSaveBtn() }, row1);

        const row2 = el('div', { cls: 'w2g-row' }, body);
        el('span', { cls: 'w2g-lbl', text: 'Hide User List' }, row2);
        el('input', { id: 'chk-users', type: 'checkbox', cls: 'w2g-chk', checked: state.hideUsers, change: () => updateSaveBtn() }, row2);

        // Save Button
        el('div', { id: 'w2g-save', cls: 'is-grey', text: 'No Changes', click: save }, body);
    };

    const init = () => {
        // Ensure styles are present (SPA handling)
        injectStyles();

        if (document.getElementById('w2g-extras-btn')) return;

        const sidebar = document.querySelector(UI.sidebar);
        const target = sidebar?.querySelector(UI.sidebarIcons);

        if (target) {
            const btn = el('div', { id: 'w2g-extras-btn', text: 'W2G Extras' });
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleModal(true);
            });
            target.appendChild(btn);
            buildModal();
        }
    };

    // --- Execution ---

    const start = () => {
        init();
        applyState();

        // Keyboard Listener (Esc to close)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') toggleModal(false);
        });

        // Watch for SPA changes
        const observer = new MutationObserver(() => {
            init();
            if (state.hidePlaylist) document.body.classList.add('w2g-hide-playlist');
            if (state.hideUsers) document.body.classList.add('w2g-hide-users');
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    setTimeout(start, 500);

})();