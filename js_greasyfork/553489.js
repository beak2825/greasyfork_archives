// ==UserScript==
// @name         Zedtools - Blacklist Manager
// @namespace    http://tampermonkey.net/
// @version      1.2
// @match        https://zed.city/*
// @match        https://*.zed.city/*
// @grant        none
// @description  Adds a cleaner, persistent chat blacklist manager to Zed.city.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553489/Zedtools%20-%20Blacklist%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/553489/Zedtools%20-%20Blacklist%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "ChatBlacklist";
    const PANEL_STATE_KEY = "ChatBlacklistPanelVisible";
    let USER_BLACKLIST = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const saveBlacklist = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(USER_BLACKLIST));
    const savePanelState = (isVisible) => localStorage.setItem(PANEL_STATE_KEY, JSON.stringify(isVisible));
    const getPanelState = () => JSON.parse(localStorage.getItem(PANEL_STATE_KEY) ?? "true");

    const cleanText = str => str.trim().toLowerCase();

    const hideMessage = msg => {
        const senderEl = msg.querySelector('.sender-name');
        if (!senderEl) return;
        const username = cleanText(senderEl.textContent);
        msg.style.display = USER_BLACKLIST.some(u => cleanText(u) === username) ? 'none' : '';
    };

    const hideAllMessages = () => {
        document.querySelectorAll('.msg-cont').forEach(hideMessage);
    };

    const waitForChat = () => {
        const chatContainer = document.querySelector('.q-infinite-scroll');
        if (chatContainer) {
            observeChat(chatContainer);
            hideAllMessages();
        } else {
            setTimeout(waitForChat, 1000);
        }
    };

    const observeChat = container => {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations)
                for (const node of mutation.addedNodes)
                    if (node.nodeType === 1) hideMessage(node);
        });
        observer.observe(container, { childList: true, subtree: true });
    };

    function createUIPanel() {
        const panel = document.createElement("div");
        Object.assign(panel.style, {
            position: "fixed", bottom: "70px", left: "20px",
            width: "260px", background: "rgba(25,25,25,0.95)",
            color: "#fff", borderRadius: "12px", fontFamily: "Inter, Arial, sans-serif",
            fontSize: "13px", zIndex: 9999, boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
            transition: "opacity 0.3s ease", backdropFilter: "blur(6px)"
        });

        panel.innerHTML = `
            <div id="chatBlkHeader" style="padding:8px 10px; font-weight:600; text-align:center; background:#2f2f2f; border-radius:12px 12px 0 0; display:flex; justify-content:space-between; align-items:center; cursor:move;">
                ⚡ Chat Blacklist
                <span id="toggleBtn" style="font-size:16px; cursor:pointer;">&#9650;</span>
            </div>
            <div id="chatBlkBody" style="padding:10px; max-height:340px; overflow-y:auto;">
                <div style="display:flex; gap:6px; margin-bottom:8px;">
                    <input type="text" id="blkInput" placeholder="Add username" style="flex:1; padding:6px 8px; border-radius:6px; border:1px solid #444; background:#1b1b1b; color:#fff;">
                    <button id="blkAddBtn" style="background:#3a8bff; color:white; border:none; border-radius:6px; padding:6px 10px; cursor:pointer;">+</button>
                </div>
                <div id="blkListContainer" style="display:flex; flex-direction:column; gap:4px;"></div>
            </div>
        `;
        document.body.appendChild(panel);

        const input = panel.querySelector('#blkInput');
        const addBtn = panel.querySelector('#blkAddBtn');
        const listContainer = panel.querySelector('#blkListContainer');
        const panelBody = panel.querySelector('#chatBlkBody');
        const toggleBtn = panel.querySelector('#toggleBtn');
        const header = panel.querySelector('#chatBlkHeader');

        // Restore visibility
        if (!getPanelState()) {
            panel.style.display = 'none';
            panel.style.opacity = '0';
        }

        // Collapse toggle
        let collapsed = false;
        toggleBtn.addEventListener('click', () => {
            collapsed = !collapsed;
            panelBody.style.display = collapsed ? 'none' : 'block';
            toggleBtn.innerHTML = collapsed ? '&#9660;' : '&#9650;';
        });

        // Render list cleanly
        function renderList() {
            listContainer.innerHTML = '';
            if (!USER_BLACKLIST.length) {
                listContainer.innerHTML = `<div style="color:#888; text-align:center; padding:6px;">No users blacklisted</div>`;
                return;
            }

            USER_BLACKLIST.forEach((user, i) => {
                const row = document.createElement('div');
                Object.assign(row.style, {
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '6px 8px',
                    background: '#1e1e1e', borderRadius: '6px',
                    border: '1px solid #333', transition: 'background 0.2s'
                });
                row.innerHTML = `
                    <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1;">${user}</span>
                    <button data-index="${i}" style="background:#ff4040; color:white; border:none; border-radius:4px; width:22px; height:22px; cursor:pointer; font-weight:bold;">×</button>
                `;
                row.addEventListener('mouseenter', () => row.style.background = '#292929');
                row.addEventListener('mouseleave', () => row.style.background = '#1e1e1e');
                listContainer.appendChild(row);
            });

            listContainer.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    USER_BLACKLIST.splice(e.target.dataset.index, 1);
                    saveBlacklist();
                    renderList();
                    hideAllMessages();
                });
            });
        }

        addBtn.addEventListener('click', () => {
            const val = input.value.trim();
            if (val && !USER_BLACKLIST.includes(val)) {
                USER_BLACKLIST.push(val);
                saveBlacklist();
                input.value = '';
                renderList();
                hideAllMessages();
            }
        });

        input.addEventListener('keypress', e => {
            if (e.key === 'Enter') addBtn.click();
        });

        renderList();

        // === Draggable panel ===
        let isDragging = false, offsetX, offsetY;
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            panel.style.left = `${e.clientX - offsetX}px`;
            panel.style.top = `${e.clientY - offsetY}px`;
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        });
        document.addEventListener('mouseup', () => { isDragging = false; });
    }

    // === Toolbar icon integration ===
    function insertToolbarIcon() {
        try {
            const notifIcon = document.querySelector('a[href="/notifications"]');
            if (!notifIcon || document.getElementById('chatBlkToolbarBtn')) return false;

            const iconLink = document.createElement('a');
            iconLink.id = 'chatBlkToolbarBtn';
            iconLink.className = notifIcon.className;
            iconLink.href = 'javascript:void(0)';
            Object.assign(iconLink.style, {
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                height: notifIcon.offsetHeight + 'px', width: notifIcon.offsetWidth + 'px',
                marginLeft: '4px'
            });
            iconLink.innerHTML = `
                <span class="q-focus-helper"></span>
                <span class="q-btn__content text-center col items-center q-anchor--skip justify-center row" style="font-size:1.3em;">
                    <i class="q-icon fal fa-ban" style="font-size:1em;" aria-hidden="true"></i>
                </span>`;
            iconLink.title = "Chat Blacklist";

            iconLink.addEventListener('click', () => {
                const panel = document.querySelector('#chatBlkHeader')?.parentElement;
                if (!panel) return;
                const visible = panel.style.display !== 'none' && panel.style.opacity !== '0';
                if (visible) {
                    panel.style.opacity = '0';
                    setTimeout(() => { panel.style.display = 'none'; }, 250);
                    savePanelState(false);
                } else {
                    panel.style.display = 'block';
                    setTimeout(() => { panel.style.opacity = '1'; }, 10);
                    savePanelState(true);
                }
            });

            const computed = window.getComputedStyle(notifIcon);
            iconLink.style.color = computed.color;
            iconLink.addEventListener("mouseenter", () => iconLink.style.opacity = "0.8");
            iconLink.addEventListener("mouseleave", () => iconLink.style.opacity = "1");

            notifIcon.parentElement.insertBefore(iconLink, notifIcon.nextSibling);
            return true;
        } catch (e) {
            console.error("[ChatBlacklist] insertToolbarIcon error:", e);
            return false;
        }
    }

    const toolbarCheck = setInterval(() => {
        if (insertToolbarIcon()) clearInterval(toolbarCheck);
    }, 1000);

    waitForChat();
    createUIPanel();
})();
