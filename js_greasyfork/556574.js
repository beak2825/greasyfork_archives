// ==UserScript==
// @name         Mandiner Troll Filter – 2025 november (végleges, cache-barát)
// @namespace    https://github.com/grok-script
// @version      1.3
// @description  Eltünteti a trollokat anélkül, hogy a Mandiner cache-e bugolna
// @match        https://mandiner.hu/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556574/Mandiner%20Troll%20Filter%20%E2%80%93%202025%20november%20%28v%C3%A9gleges%2C%20cache-bar%C3%A1t%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556574/Mandiner%20Troll%20Filter%20%E2%80%93%202025%20november%20%28v%C3%A9gleges%2C%20cache-bar%C3%A1t%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'mandiner_troll_list_2025';
    let blockedUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        .map(n => n.trim()).filter(n => n.length >= 2);

    function getAuthorName(card) {
        const link = card.querySelector('a[href^="/profil/hozzaszolasok/"]');
        if (!link) return null;
        const name = link.textContent.trim();
        if (!name || name.length < 2 || name === 'Vendég') return null;
        return name;
    }

    // ÚJ: helyette egy "elrejtve" placeholder, ami nem zavarja a Mandiner cache-et
    function hideComment(card, name) {
        if (card.dataset.trollHidden) return;

        const placeholder = document.createElement('div');
        placeholder.textContent = `➖ ${name} (troll elrejtve – kattints a megjelenítéshez)`;
        placeholder.style.cssText = `
            padding: 12px 16px;
            background: #2c2c2c;
            color: #888;
            font-style: italic;
            cursor: pointer;
            border-left: 4px solid #c0392b;
            margin: 8px 0;
        `;
        placeholder.onclick = (e) => {
            e.stopPropagation();
            card.style.display = '';
            placeholder.remove();
            card.dataset.trollHidden = false;
        };

        card.style.display = 'none';
        card.dataset.trollHidden = 'true';
        card.parentNode.insertBefore(placeholder, card);
    }

    function processComments() {
        document.querySelectorAll('man-comment-card').forEach(card => {
            if (card.dataset.trollProcessed) return;
            card.dataset.trollProcessed = 'true';

            const name = getAuthorName(card);
            if (name && blockedUsers.includes(name)) {
                hideComment(card, name);
            }
        });
    }

    // Jobb klikk (ugyanaz)
    document.addEventListener('contextmenu', e => {
        const link = e.target.closest('a[href^="/profil/hozzaszolasok/"]');
        if (!link) return;
        const card = link.closest('man-comment-card');
        if (!card) return;
        const name = getAuthorName(card);
        if (!name) return;

        e.preventDefault();
        if (blockedUsers.includes(name)) {
            if (confirm(`Kiveszed: ${name}?`)) {
                blockedUsers = blockedUsers.filter(n => n !== name);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(blockedUsers));
                location.reload();
            }
        } else {
            if (confirm(`Blokkolod: ${name}?`)) {
                blockedUsers.push(name);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(blockedUsers));
                hideComment(card, name);
                processComments();
            }
        }
    });

    const observer = new MutationObserver(() => setTimeout(processComments, 200));
    observer.observe(document.body, { childList: true, subtree: true });

    // Gomb ugyanaz
    function addButton() {
        if (!document.body) return setTimeout(addButton, 500);
        const btn = document.createElement('div');
        btn.textContent = `🚫 Trollok (${blockedUsers.length})`;
        btn.style.cssText = 'position:fixed;top:10px;right:10px;z-index:99999;background:#c0392b;color:white;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:13px;box-shadow:0 4px 12px rgba(0,0,0,0.4);';
        btn.onclick = () => {
            const input = prompt(`Blokkolva (${blockedUsers.length}):\n${blockedUsers.join('\n') || '(üres)'}\n\nÚj lista:`, blockedUsers.join(', '));
            if (input !== null) {
                blockedUsers = input.split(/[\n,]/).map(n => n.trim()).filter(n => n.length >= 2);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(blockedUsers));
                location.reload();
            }
        };
        document.body.appendChild(btn);
    }

    setTimeout(() => { addButton(); processComments(); }, 1200);
})();