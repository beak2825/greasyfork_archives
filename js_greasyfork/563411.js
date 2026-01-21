// ==UserScript==
// @name         YouTube Video Hider v1
// @namespace    yt-video-hider
// @version      1
// @description  Hide YouTube videos individually or globally, panel shows only thumbnail and title, mobile-friendly, hide button fixed
// @match        https://www.youtube.com/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563411/YouTube%20Video%20Hider%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/563411/YouTube%20Video%20Hider%20v1.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /* ---------------- STORAGE ---------------- */
    const STORAGE_KEY = 'CA_hiddenVideos_v4';
    const UI_KEY = 'CA_hiddenUI_state_v4';

    const STATE = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const UI_STATE = JSON.parse(localStorage.getItem(UI_KEY) || '{"open":true,"x":40,"y":40,"globalHide":true}');

    const saveState = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
    const saveUI = () => localStorage.setItem(UI_KEY, JSON.stringify(UI_STATE));

    /* ---------------- PAGE TAB ---------------- */
    function currentTab() {
        const p = location.pathname;
        if (p.includes('/streams')) return 'streams';
        if (p.includes('/videos')) return 'videos';
        if (p.startsWith('/@') || p.startsWith('/channel')) return 'channel';
        if (p.startsWith('/shorts')) return 'shorts';
        if (p === '/') return 'home';
        return 'other';
    }

    /* ---------------- VIDEO UTILS ---------------- */
    function getVideoId(card) {
        const a = card.querySelector('a[href*="watch?v="]') || card.querySelector('a#video-title-link');
        if (!a) return null;
        return new URL(a.href, location.origin).searchParams.get('v');
    }

    function getMeta(card) {
        const titleEl = card.querySelector('#video-title')
                     || card.querySelector('h3 a')
                     || card.querySelector('h3 yt-formatted-string')
                     || card.querySelector('a#video-title-link');

        const title = titleEl?.textContent?.trim();
        return { title };
    }

    /* ---------------- HIDE / RESTORE ---------------- */
    function hideCard(card) {
        card.dataset.caHidden = '1';
        card.style.display = 'none';
    }

    function restoreCard(card) {
        delete card.dataset.caHidden;
        card.style.display = '';
    }

    function applyHidden() {
        document.querySelectorAll(CARD_SELECTOR).forEach(card => {
            const id = getVideoId(card);
            if (!id) return;
            if (STATE[id] && (UI_STATE.globalHide || STATE[id].tab === currentTab())) hideCard(card);
        });
    }

    function restoreVideo(id) {
        delete STATE[id];
        saveState();
        document.querySelectorAll(CARD_SELECTOR).forEach(card => {
            if (getVideoId(card) === id) restoreCard(card);
        });
        renderUI();
    }

    function restoreAll() {
        Object.keys(STATE).forEach(id => restoreVideo(id));
    }

    /* ---------------- HIDE BUTTON ---------------- */
    function attachHideButton(card) {
        if (card.querySelector('.ca-hide-btn')) return;

        const btn = document.createElement('button');
        btn.className = 'ca-hide-btn';
        btn.textContent = '✕';
        btn.title = 'Hide this video';

        btn.onclick = e => {
            e.stopPropagation();
            e.preventDefault();
            const id = getVideoId(card);
            if (!id) return;

            const meta = getMeta(card);

            // Save the video even if title is missing
            STATE[id] = {
                id,
                tab: currentTab(),
                title: meta.title || ''
            };

            saveState();
            hideCard(card);
            renderUI();
        };

        card.style.position = 'relative';
        card.appendChild(btn);
    }

    /* ---------------- UI ---------------- */
    const ui = document.createElement('div');
    ui.id = 'ca-ui';
    ui.innerHTML = `
        <div id="ca-ui-header">
            <span>Hidden Videos</span>
            <button id="ca-ui-close">✕</button>
        </div>
        <div id="ca-ui-controls">
            <label><input type="checkbox" id="ca-global-toggle"> Global Hide</label>
            <button id="ca-restore-all">Restore All</button>
        </div>
        <div id="ca-ui-list"></div>
    `;
    document.body.appendChild(ui);

    ui.style.left = UI_STATE.x + 'px';
    ui.style.top = UI_STATE.y + 'px';
    ui.style.display = UI_STATE.open ? 'block' : 'none';

    document.getElementById('ca-ui-close').onclick = () => {
        UI_STATE.open = false;
        ui.style.display = 'none';
        saveUI();
    };

    const globalToggle = document.getElementById('ca-global-toggle');
    globalToggle.checked = UI_STATE.globalHide;
    globalToggle.onchange = () => {
        UI_STATE.globalHide = globalToggle.checked;
        saveUI();
        applyHidden();
    };

    document.getElementById('ca-restore-all').onclick = restoreAll;

    function renderUI() {
        const list = document.getElementById('ca-ui-list');
        list.innerHTML = '';

        Object.values(STATE).forEach(v => {
            if (!v.id) return;

            const row = document.createElement('div');
            row.className = 'ca-ui-row';

            row.innerHTML = `
                <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg">
                <div class="meta">
                    <div class="title">${v.title || 'Unknown Title'}</div>
                </div>
                <button>Restore</button>
            `;

            row.querySelector('button').onclick = () => restoreVideo(v.id);
            list.appendChild(row);
        });
    }

    renderUI();

    /* ---------------- DRAGGABLE ---------------- */
    (() => {
        let down = false, ox = 0, oy = 0;
        ui.querySelector('#ca-ui-header').addEventListener('mousedown', e => {
            down = true;
            ox = e.clientX - ui.offsetLeft;
            oy = e.clientY - ui.offsetTop;
        });

        document.addEventListener('mousemove', e => {
            if (!down) return;
            ui.style.left = Math.max(0, Math.min(e.clientX - ox, window.innerWidth - ui.offsetWidth)) + 'px';
            ui.style.top = Math.max(0, Math.min(e.clientY - oy, window.innerHeight - ui.offsetHeight)) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (!down) return;
            down = false;
            UI_STATE.x = ui.offsetLeft;
            UI_STATE.y = ui.offsetTop;
            saveUI();
        });
    })();

    /* ---------------- MENU TOGGLE ---------------- */
    GM_registerMenuCommand('Toggle Hidden Videos UI', () => {
        UI_STATE.open = !UI_STATE.open;
        ui.style.display = UI_STATE.open ? 'block' : 'none';
        saveUI();
    });

    /* ---------------- OBSERVER (LAG-FREE) ---------------- */
    const CARD_SELECTOR = `
        ytd-rich-item-renderer,
        ytd-video-renderer,
        ytd-grid-video-renderer,
        ytd-reel-shelf-renderer,
        ytd-rich-grid-media,
        ytd-short-form-video-renderer
    `;

    let rafPending = false;
    const observer = new MutationObserver(() => {
        if (rafPending) return;
        rafPending = true;

        requestAnimationFrame(() => {
            rafPending = false;
            document.querySelectorAll(CARD_SELECTOR).forEach(card => attachHideButton(card));
            applyHidden();
        });
    });

    observer.observe(document.querySelector('ytd-page-manager') || document.body, { childList: true, subtree: true });

    /* ---------------- STYLES ---------------- */
    const css = document.createElement('style');
    css.textContent = `
        .ca-hide-btn {
            position: absolute;
            top: 6px;
            left: 6px;
            background: #e53935;
            color: #fff;
            border: none;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            cursor: pointer;
            z-index: 50;
            font-weight: bold;
        }

        #ca-ui {
            position: fixed;
            width: 360px;
            max-width: 90vw;
            background: #0f0f0f;
            color: #fff;
            border: 1px solid #333;
            z-index: 99999;
            font-family: Roboto, Arial, sans-serif;
        }

        #ca-ui-header {
            display: flex;
            justify-content: space-between;
            padding: 8px;
            background: #181818;
            cursor: move;
        }

        #ca-ui-controls {
            padding: 6px 8px;
            border-bottom: 1px solid #222;
            display: flex;
            gap: 8px;
            align-items: center;
        }

        #ca-ui-controls button {
            background: #2e7d32;
            border: none;
            color: #fff;
            padding: 4px 6px;
            cursor: pointer;
        }

        #ca-ui-list {
            max-height: 420px;
            overflow-y: auto;
        }

        .ca-ui-row {
            display: flex;
            gap: 8px;
            padding: 6px;
            align-items: center;
            border-bottom: 1px solid #222;
        }

        .ca-ui-row img {
            width: 120px;
            flex-shrink: 0;
        }

        .ca-ui-row .title {
            font-size: 13px;
            font-weight: 500;
        }

        .ca-ui-row button {
            margin-left: auto;
            background: #2e7d32;
            border: none;
            color: #fff;
            padding: 4px 6px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(css);
})();
