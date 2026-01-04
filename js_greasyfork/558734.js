// ==UserScript==
// @name         Hide Chat Messages From Users (by XID)
// @namespace    https://torn.com/
// @version      2.0
// @author       Systoned
// @description  Hides chat messages from specific users by profile XID
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558734/Hide%20Chat%20Messages%20From%20Users%20%28by%20XID%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558734/Hide%20Chat%20Messages%20From%20Users%20%28by%20XID%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'tornBlockedXIDs';

    function getBlockedXIDs() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    function saveBlockedXIDs(xids) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(xids));
    }

    function addBlockedXID(xid) {
        const xids = getBlockedXIDs();
        const cleaned = xid.trim();
        if (cleaned && !xids.includes(cleaned)) {
            xids.push(cleaned);
            saveBlockedXIDs(xids);
            hideMessages();
            return true;
        }
        return false;
    }

    function removeBlockedXID(xid) {
        const xids = getBlockedXIDs();
        const index = xids.indexOf(xid);
        if (index > -1) {
            xids.splice(index, 1);
            saveBlockedXIDs(xids);
            return true;
        }
        return false;
    }

    function hideMessages() {
        const chatRoot = document.getElementById('chatRoot');
        if (!chatRoot) return;

        const blockedXIDs = getBlockedXIDs();

        chatRoot.querySelectorAll('[class*="box___"]').forEach(box => {
            box.style.display = '';
        });

        blockedXIDs.forEach(xid => {
            chatRoot.querySelectorAll(`a[href*="profiles.php?XID=${xid}"]`).forEach(link => {
                const messageBox = link.closest('[class*="box___"]');
                if (messageBox) {
                    messageBox.style.display = 'none';
                }
            });
        });
    }

    function createPanel() {
        const existing = document.getElementById('xid-block-panel');
        if (existing) {
            existing.remove();
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'xid-block-panel';
        panel.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #1a1a1a;
                border: 1px solid #444;
                border-radius: 8px;
                padding: 16px;
                z-index: 99999;
                min-width: 280px;
                max-height: 400px;
                display: flex;
                flex-direction: column;
                font-family: Arial, sans-serif;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span style="color: #fff; font-weight: bold; font-size: 14px;">Blocked Users</span>
                    <button id="xid-panel-close" style="
                        background: none;
                        border: none;
                        color: #888;
                        font-size: 18px;
                        cursor: pointer;
                        padding: 0;
                        line-height: 1;
                    ">×</button>
                </div>
                <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                    <input id="xid-input" type="text" placeholder="Enter XID" style="
                        flex: 1;
                        padding: 8px;
                        border: 1px solid #444;
                        border-radius: 4px;
                        background: #2a2a2a;
                        color: #fff;
                        font-size: 13px;
                    ">
                    <button id="xid-add-btn" style="
                        padding: 8px 12px;
                        background: #4a7c4e;
                        border: none;
                        border-radius: 4px;
                        color: #fff;
                        cursor: pointer;
                        font-size: 13px;
                    ">Add</button>
                </div>
                <div id="xid-list" style="
                    overflow-y: auto;
                    max-height: 250px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                "></div>
            </div>
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 99998;
            " id="xid-panel-overlay"></div>
        `;

        document.body.appendChild(panel);

        function renderList() {
            const list = document.getElementById('xid-list');
            const xids = getBlockedXIDs();

            if (xids.length === 0) {
                list.innerHTML = '<span style="color: #888; font-size: 13px;">No blocked users</span>';
                return;
            }

            list.innerHTML = xids.map(xid => `
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 6px 8px;
                    background: #2a2a2a;
                    border-radius: 4px;
                ">
                    <a href="/profiles.php?XID=${xid}" target="_blank" style="color: #7cb3d9; text-decoration: none; font-size: 13px;">${xid}</a>
                    <button data-xid="${xid}" class="xid-remove-btn" style="
                        background: #8b3a3a;
                        border: none;
                        border-radius: 4px;
                        color: #fff;
                        padding: 4px 8px;
                        cursor: pointer;
                        font-size: 12px;
                    ">Remove</button>
                </div>
            `).join('');

            list.querySelectorAll('.xid-remove-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    removeBlockedXID(btn.dataset.xid);
                    renderList();
                });
            });
        }

        renderList();

        document.getElementById('xid-panel-close').addEventListener('click', () => panel.remove());
        document.getElementById('xid-panel-overlay').addEventListener('click', () => panel.remove());

        document.getElementById('xid-add-btn').addEventListener('click', () => {
            const input = document.getElementById('xid-input');
            if (addBlockedXID(input.value)) {
                input.value = '';
                renderList();
            }
        });

        document.getElementById('xid-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('xid-add-btn').click();
            }
        });
    }

    function createBlockButton() {
        const btn = document.createElement('div');
        btn.className = 'xid-block-btn';
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.style.cssText = `
            color: #888;
            font-size: 11px;
            cursor: pointer;
            padding: 2px 6px;
            margin-right: 8px;
        `;
        btn.textContent = 'Block';
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            createPanel();
        });
        return btn;
    }

    function injectButtons() {
        const headers = document.querySelectorAll('[class*="header___"]');
        headers.forEach(header => {
            if (header.querySelector('.xid-block-btn')) return;

            const minimizeIcon = header.querySelector('[class*="minimizeIcon___"]');
            if (minimizeIcon) {
                const btn = createBlockButton();
                minimizeIcon.parentNode.insertBefore(btn, minimizeIcon);
            }
        });
    }

    hideMessages();
    injectButtons();

    const observer = new MutationObserver(() => {
        hideMessages();
        injectButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();