// ==UserScript==
// @name         WPARTY Account Switcher (For WParty)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Переключение аккаунтов.
// @author       AlliSighs, cheatsHaz, ClonersYT, FunPay Tools Developer
// @match        https://wparty.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wparty.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558426/WPARTY%20Account%20Switcher%20%28For%20WParty%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558426/WPARTY%20Account%20Switcher%20%28For%20WParty%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const AUTH_KEYS = ['user', 'wparty-username', 'wparty-clientid', 'wparty-setting'];
    const DATA_KEY = 'wparty_multiacc_data';
    const POS_KEY = 'wparty_multiacc_pos_v3';

    const style = document.createElement('style');
    style.innerHTML = `
        #wp-native-switch {
            position: fixed;
            z-index: 999999;
            width: 70px;
            background: #121212;
            border: 1px solid #333;
            border-radius: 8px;
            font-family: sans-serif;
            box-shadow: 0 5px 20px rgba(0,0,0,0.8);
            user-select: none;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: width 0.2s;
        }
        .wp-header {
            height: 24px; background: #1f1f1f; border-bottom: 1px solid #2a2a2a;
            display: flex; justify-content: center; align-items: center; cursor: move;
        }
        .wp-min-btn { cursor: pointer; color: #666; font-size: 16px; font-weight: bold; line-height: 1; }
        .wp-min-btn:hover { color: #fff; }
        .wp-list { padding: 5px 0; margin: 0; max-height: 400px; overflow-y: auto; background: #121212; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .wp-list.hidden { display: none; }
        .wp-row { position: relative; width: 40px; height: 40px; cursor: pointer; transition: transform 0.1s; }
        .wp-row:hover { transform: scale(1.05); }
        .wp-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #333; background: #222; }
        .wp-row.active .wp-avatar { border-color: #27ae60; box-shadow: 0 0 5px rgba(39, 174, 96, 0.5); }
        .wp-placeholder { width: 40px; height: 40px; border-radius: 50%; background: #444; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; border: 2px solid #333; text-transform: uppercase; }
        .wp-row.active .wp-placeholder { border-color: #27ae60; }
        .wp-del { position: absolute; top: -2px; right: -2px; width: 14px; height: 14px; background: #e74c3c; color: white; border-radius: 50%; font-size: 10px; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; z-index: 10; }
        .wp-row:hover .wp-del { opacity: 1; }
        .wp-footer { padding: 5px; border-top: 1px solid #2a2a2a; background: #1a1a1a; display: flex; justify-content: center; }
        .wp-footer.hidden { display: none; }
        .wp-add-btn { background: transparent; border: 1px dashed #444; color: #666; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 18px; line-height: 1; display: flex; align-items: center; justify-content: center; }
        .wp-add-btn:hover { border-color: #888; color: #fff; background: rgba(255,255,255,0.05); }
    `;
    document.head.appendChild(style);

    const savedPos = JSON.parse(localStorage.getItem(POS_KEY)) || { top: '100px', left: '20px', minimized: false };
    const container = document.createElement('div');
    container.id = 'wp-native-switch';
    container.style.top = savedPos.top;
    container.style.left = savedPos.left;
    document.documentElement.appendChild(container);

    function getSaved() {
        try { return JSON.parse(localStorage.getItem(DATA_KEY) || '[]'); } catch { return []; }
    }
    function getCurrUID() {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return null;
            return JSON.parse(userStr).uid;
        } catch { return null; }
    }

    function findAvatarOnPage() {
        let img = document.querySelector('.user__avatar img');
        if (!img) img = document.querySelector('.userInfo .avatar img');

        if (!img) img = document.querySelector('img.ui.avatar.image');

        return img ? img.src : null;
    }

    function render() {
        const accounts = getSaved();
        const currUID = getCurrUID();
        const isMin = savedPos.minimized;

        let html = `
            <div class="wp-header" id="wp-drag">
                <span class="wp-min-btn" title="${isMin ? 'Развернуть' : 'Свернуть'}">${isMin ? '+' : '−'}</span>
            </div>
            <div class="wp-list ${isMin ? 'hidden' : ''}">
        `;
        if (accounts.length === 0) html += `<div style="font-size:10px; color:#555;">пусто</div>`;

        accounts.forEach((acc, idx) => {
            const isActive = acc.uid === currUID;
            const hasAvatar = acc.avatar && acc.avatar.length > 5;
            const letter = acc.username ? acc.username.charAt(0) : '?';

            html += `
                <div class="wp-row ${isActive ? 'active' : ''}" title="${acc.username}">
                    <div class="wp-select" data-idx="${idx}">
                        ${hasAvatar
                            ? `<img src="${acc.avatar}" class="wp-avatar">`
                            : `<div class="wp-placeholder">${letter}</div>`
                        }
                    </div>
                    <div class="wp-del" data-idx="${idx}">×</div>
                </div>
            `;
        });
        html += `</div><div class="wp-footer ${isMin ? 'hidden' : ''}"><button class="wp-add-btn" id="wp-add" title="Обновить текущий">+</button></div>`;
        container.innerHTML = html;

        container.querySelector('.wp-min-btn').onclick = toggleMin;
        const addBtn = container.querySelector('#wp-add');
        if(addBtn) addBtn.onclick = addAcc;
        container.querySelectorAll('.wp-select').forEach(el => el.onclick = () => switchAcc(el.dataset.idx));
        container.querySelectorAll('.wp-del').forEach(el => {
            el.onclick = (e) => { e.stopPropagation(); delAcc(el.dataset.idx); };
        });
        initDrag(container.querySelector('#wp-drag'));
    }

    function addAcc() {
        const userStr = localStorage.getItem('user');
        const name = localStorage.getItem('wparty-username');
        if (!userStr || !name) return alert('нет данных');
        let uid;
        try { uid = JSON.parse(userStr).uid; } catch (e) { return alert('ошибка данных'); }

        const currentAvatarUrl = findAvatarOnPage();
        if (!currentAvatarUrl) console.log('WPARTY Switcher: Аватарка не найдена на странице');

        const accs = getSaved();
        const existingIdx = accs.findIndex(a => a.uid === uid);

        const newAcc = {
            uid,
            username: name,
            avatar: currentAvatarUrl,
            data: {}
        };
        AUTH_KEYS.forEach(k => newAcc.data[k] = localStorage.getItem(k));

        if (existingIdx !== -1) {
            accs[existingIdx] = newAcc;
        } else {
            accs.push(newAcc);
        }
        localStorage.setItem(DATA_KEY, JSON.stringify(accs));
        render();
    }

    function switchAcc(idx) {
        const target = getSaved()[idx];
        if (!target) return;
        if (target.uid === getCurrUID()) return;
        AUTH_KEYS.forEach(k => {
            if (target.data[k]) localStorage.setItem(k, target.data[k]);
            else localStorage.removeItem(k);
        });
        location.reload();
    }

    function delAcc(idx) {
        const accs = getSaved();
        if(confirm(`удалить ${accs[idx].username}?`)) {
            accs.splice(idx, 1);
            localStorage.setItem(DATA_KEY, JSON.stringify(accs));
            render();
        }
    }

    function toggleMin() { savedPos.minimized = !savedPos.minimized; savePos(); render(); }
    function savePos() { savedPos.top = container.style.top; savedPos.left = container.style.left; localStorage.setItem(POS_KEY, JSON.stringify(savedPos)); }
    function initDrag(handle) {
        let isDown = false; let offX, offY;
        handle.onmousedown = (e) => {
            if(e.target.closest('.wp-min-btn')) return;
            e.preventDefault(); isDown = true;
            const rect = container.getBoundingClientRect();
            offX = e.clientX - rect.left; offY = e.clientY - rect.top;
            document.addEventListener('mousemove', move); document.addEventListener('mouseup', up);
        };
        function move(e) { if (!isDown) return; container.style.left = (e.clientX - offX) + 'px'; container.style.top = (e.clientY - offY) + 'px'; }
        function up() { isDown = false; document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); savePos(); }
    }

    setTimeout(render, 1000);
})();