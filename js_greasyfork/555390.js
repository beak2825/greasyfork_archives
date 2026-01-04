// ==UserScript==
// @name         RoyaleAPI - Highlight Player
// @namespace    https://github.com/VenomousRhyme41/RoyaleAPI-Highlight-Player
// @version      1.1
// @description  Highlights any player in the clan page
// @icon         https://cdn.royaleapi.com/static/img/branding/royaleapi-logo-128.png?t=feb800c3c
// @author       VenomousRhyme41
// @match        *://royaleapi.com/clan/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555390/RoyaleAPI%20-%20Highlight%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/555390/RoyaleAPI%20-%20Highlight%20Player.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'highlight_player_tag';
    let TARGET_TAG = GM_getValue(STORAGE_KEY, '').trim().toUpperCase();

    const FORCE_RED = 'background-color: #ffcccc !important; background: #ffcccc !important;';

    let targetRow = null;

    function applyRed() {
        if (!TARGET_TAG) return;

        const row = document.querySelector(`tr[data-tag="${TARGET_TAG}"]`);
        if (!row) return;

        targetRow = row;
        row.style.cssText = FORCE_RED;
        row.dataset.permaHighlight = 'true';

        row.querySelectorAll('*').forEach(el => {
            el.style.color = '';
            el.style.fontWeight = '';
        });

        if (!row.dataset.scrolled) {
            row.dataset.scrolled = 'true';
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function createButton() {
        if (document.getElementById('hl-btn')) return;

        const btn = document.createElement('div');
        btn.id = 'hl-btn';
        btn.innerHTML = `Highlight<br><span style="font-size:16px;">#${TARGET_TAG || '???'}</span>`;
        btn.style.cssText = `
            position:fixed;bottom:20px;right:20px;background:#ff6666;color:white;
            padding:10px 14px;border-radius:6px;font-weight:bold;font-size:13px;
            cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,0.4);z-index:999999;
            border:2px solid white;user-select:none;font-family:sans-serif;
        `;
        btn.onclick = () => {
            const tag = prompt(`Player tag (e.g. PRLGCJGC)\nCurrent: #${TARGET_TAG || 'None'}`, TARGET_TAG);
            if (!tag) return;
            const clean = tag.trim().replace(/^#/g, '').toUpperCase();
            if (!clean) return alert('Invalid tag');
            GM_setValue(STORAGE_KEY, clean);
            location.reload();
        };
        document.body.appendChild(btn);
    }

    GM_registerMenuCommand('Set Player Tag', () => {
        const tag = prompt(`Player tag:`, TARGET_TAG);
        if (tag && tag.trim()) {
            GM_setValue(STORAGE_KEY, tag.trim().replace(/^#/g, '').toUpperCase());
            location.reload();
        }
    });

    const start = () => {
        if (!document.querySelector('.tr_member')) {
            return setTimeout(start, 500);
        }

        createButton();
        applyRed();

        setInterval(applyRed, 1000);

        const table = document.querySelector('table');
        if (table) {
            new MutationObserver(applyRed).observe(table, { childList: true, subtree: true });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

    console.log(`%cPLAYER HIGHLIGHT ACTIVE → #${TARGET_TAG || 'Not set'}`, 'color: #ff0000; font-weight: bold;');
})();