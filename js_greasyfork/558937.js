// ==UserScript==
// @name         Lolz Christmas Hats
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Разноцветные шапки + Настройка
// @author       You
// @match        https://lolz.live/*
// @license      MIT
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558937/Lolz%20Christmas%20Hats.user.js
// @updateURL https://update.greasyfork.org/scripts/558937/Lolz%20Christmas%20Hats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'lolz_hat_config_v10';
    const VISITOR_KEY = '___visitor_self___';

    GM_addStyle(`
        :root {
            --hat-hue: 0deg;
            --hat-bright: 100%;
            --hat-sat: 100%;
            --hat-scale: 1;
            --ui-color: #2BAD72;
            --ui-color-hover: #38cf89;
        }
        .avatar::before {
            filter: hue-rotate(var(--hat-hue)) brightness(var(--hat-bright)) saturate(var(--hat-sat)) !important;
            transition: filter 0.1s linear, transform 0.1s linear;
            will-change: filter, transform;
            pointer-events: none;
        }
        .avatar:not(:has(.navTab--visitorAvatar)):not(.navTab .avatar)::before {
            transform: translateX(-79%) scale(var(--hat-scale)) !important;
        }
        .navTab .avatar::before,
        .avatar:has(.navTab--visitorAvatar)::before {
            content: "" !important;
            width: 22px !important;
            height: 62px !important;
            top: -32px !important;
            right: -56% !important;
            left: auto !important;
            position: absolute !important;
            background-size: 100% !important;
            transform: translateX(-50%) scaleX(-1) rotate(326deg) scale(var(--hat-scale)) !important;
        }
        #hat-customizer-modal {
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            background: #2d2d2d;
            border: 1px solid #3d3d3d;
            border-radius: 12px;
            box-shadow: 0 5px 30px rgba(0,0,0,0.8);
            z-index: 99999;
            padding: 20px;
            font-family: 'Segoe UI', Tahoma, sans-serif;
            display: none;
            color: #f0f0f0;
        }
        #hat-customizer-modal.active { display: block; animation: hatFadeIn 0.2s ease; }
        @keyframes hatFadeIn { from { opacity: 0; transform: translate(-50%, -45%); } to { opacity: 1; transform: translate(-50%, -50%); } }
        #hat-customizer-modal h3 {
            margin: 0 0 20px 0;
            font-size: 16px;
            text-align: center;
            color: var(--ui-color);
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        #hat-target-user { display: block; text-align: center; font-size: 10px; color: #555; margin-top: 15px; font-family: monospace; }
        .hat-control-group { margin-bottom: 12px; }
        .hat-control-group label { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 5px; color: #bbb; text-transform: uppercase; font-weight: 600; }
        .hat-control-group input[type=range] { width: 100%; cursor: pointer; height: 6px; -webkit-appearance: none; background: #444; border-radius: 3px; }
        .hat-control-group input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none; width: 16px; height: 16px;
            background: var(--ui-color); border-radius: 50%; cursor: pointer; transition: 0.1s;
        }
        .hat-control-group input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.2); }
        .hat-buttons { display: flex; gap: 10px; margin-top: 20px; }
        .hat-btn { flex: 1; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px; transition: 0.2s; }
        .hat-btn-save { background: var(--ui-color); color: #fff; }
        .hat-btn-save:hover { background: var(--ui-color-hover); }
        .hat-btn-reset { background: #333; color: #aaa; border: 1px solid #444; }
        .hat-btn-reset:hover { background: #444; color: #fff; }
        .hat-btn-close { position: absolute; top: 12px; right: 12px; background: none; border: none; color: #666; cursor: pointer; font-size: 20px; line-height: 1; }
        .hat-btn-close:hover { color: #fff; }
    `);

    const modalHTML = `
        <div id="hat-customizer-modal">
            <button class="hat-btn-close">×</button>
            <h3>Настройка Шапки</h3>
            <div class="hat-control-group">
                <label>Цвет (Hue) <span id="val-hue">0</span></label>
                <input type="range" id="inp-hue" min="0" max="360" value="0">
            </div>
            <div class="hat-control-group">
                <label>Яркость <span id="val-bright">1.0</span></label>
                <input type="range" id="inp-bright" min="0.5" max="2.0" step="0.05" value="1.0">
            </div>
            <div class="hat-control-group">
                <label>Насыщенность <span id="val-sat">1.0</span></label>
                <input type="range" id="inp-sat" min="0" max="3.0" step="0.1" value="1.0">
            </div>
            <div class="hat-control-group">
                <label>Размер <span id="val-scale">1.0</span></label>
                <input type="range" id="inp-scale" min="0.5" max="1.5" step="0.05" value="1.0">
            </div>
            <div class="hat-buttons">
                <button class="hat-btn hat-btn-reset">Сброс</button>
                <button class="hat-btn hat-btn-save">Сохранить</button>
            </div>
            <span id="hat-target-user"></span>
        </div>
    `;

    function injectModal() {
        const div = document.createElement('div');
        div.innerHTML = modalHTML;
        document.body.appendChild(div);
        initModalEvents();
    }

    let savedConfig = {};
    try { savedConfig = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) {}

    function saveConfig(userKey, config) {
        if (!config) delete savedConfig[userKey];
        else savedConfig[userKey] = config;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedConfig));
    }

    function getUserKey(avatar) {
        if (avatar.querySelector('.navTab--visitorAvatar') || avatar.closest('.navTab--visitorAvatar')) {
            return VISITOR_KEY;
        }
        const link = avatar.closest('a');
        if (link) return parseUrlPath(link.href);
        return null;
    }

    function parseUrlPath(fullUrl) {
        try {
            const urlObj = new URL(fullUrl, window.location.origin);
            let path = urlObj.pathname.replace(/^\/|\/$/g, '');
            if (!path || ['login', 'register', 'lost-password', 'search', 'account'].includes(path)) return null;
            return path;
        } catch (e) { return null; }
    }

    let currentGlobalHue = Math.floor(Math.random() * 360);
    const GOLDEN_ANGLE = 137.508;
    function getNextUniqueHue() {
        currentGlobalHue = (currentGlobalHue + GOLDEN_ANGLE) % 360;
        return currentGlobalHue + (Math.floor(Math.random() * 10) - 5);
    }
    function random(min, max) { return Math.random() * (max - min) + min; }

    function applyStyle(avatar, forceUpdate = false) {
        if (avatar.dataset.hatColored && !forceUpdate) return;
        if (avatar.closest('#hat-customizer-modal')) return;

        const userKey = getUserKey(avatar);
        let config;

        if (userKey && savedConfig[userKey]) {
            config = savedConfig[userKey];
            avatar.dataset.hatCustom = "true";
        } else {
            if (avatar.dataset.hatColored && !avatar.dataset.hatCustom && !forceUpdate) return;
            const hue = getNextUniqueHue();
            config = { h: hue, b: random(0.9, 1.25).toFixed(2), s: random(0.85, 1.4).toFixed(2), sc: random(0.95, 1.05).toFixed(2) };
        }
        setAvatarVars(avatar, config);
        avatar.dataset.hatColored = 'true';
    }

    function setAvatarVars(avatar, config) {
        avatar.style.setProperty('--hat-hue', config.h + 'deg');
        avatar.style.setProperty('--hat-bright', (config.b * 100) + '%');
        avatar.style.setProperty('--hat-sat', (config.s * 100) + '%');
        avatar.style.setProperty('--hat-scale', config.sc);
    }

    let currentEditingAvatar = null;
    let currentEditingKey = null;

    function initGlobalEvents() {
        document.addEventListener('click', function(e) {
            if (!e.altKey) return;
            const avatar = e.target.closest('.avatar');
            if (avatar) {
                e.preventDefault(); e.stopPropagation();
                openEditor(avatar);
            }
        }, true);
    }

    function openEditor(avatar) {
        const userKey = getUserKey(avatar);
        if (!userKey) {
            alert('Не удалось определить пользователя.');
            return;
        }
        currentEditingAvatar = avatar;
        currentEditingKey = userKey;
        let h = parseFloat(avatar.style.getPropertyValue('--hat-hue')) || 0;
        let b = parseFloat(avatar.style.getPropertyValue('--hat-bright')) / 100 || 1;
        let s = parseFloat(avatar.style.getPropertyValue('--hat-sat')) / 100 || 1;
        let sc = parseFloat(avatar.style.getPropertyValue('--hat-scale')) || 1;
        document.getElementById('inp-hue').value = h;
        document.getElementById('inp-bright').value = b;
        document.getElementById('inp-sat').value = s;
        document.getElementById('inp-scale').value = sc;
        const displayName = (userKey === VISITOR_KEY) ? 'Menu Avatar (Self)' : userKey;
        document.getElementById('hat-target-user').textContent = displayName;
        updateLabels();
        document.getElementById('hat-customizer-modal').classList.add('active');
    }

    function updateLabels() {
        document.getElementById('val-hue').textContent = Math.round(document.getElementById('inp-hue').value);
        document.getElementById('val-bright').textContent = document.getElementById('inp-bright').value;
        document.getElementById('val-sat').textContent = document.getElementById('inp-sat').value;
        document.getElementById('val-scale').textContent = document.getElementById('inp-scale').value;
    }

    function initModalEvents() {
        const inputs = document.querySelectorAll('#hat-customizer-modal input[type=range]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                updateLabels();
                const config = {
                    h: document.getElementById('inp-hue').value,
                    b: document.getElementById('inp-bright').value,
                    s: document.getElementById('inp-sat').value,
                    sc: document.getElementById('inp-scale').value
                };
                if (currentEditingKey) updateAllAvatarsOfUser(currentEditingKey, config);
            });
        });
        document.querySelector('.hat-btn-save').addEventListener('click', () => {
            const config = {
                h: document.getElementById('inp-hue').value,
                b: document.getElementById('inp-bright').value,
                s: document.getElementById('inp-sat').value,
                sc: document.getElementById('inp-scale').value
            };
            saveConfig(currentEditingKey, config);
            closeModal();
            updateAllAvatarsOfUser(currentEditingKey, config, true);
        });
        document.querySelector('.hat-btn-reset').addEventListener('click', () => {
            saveConfig(currentEditingKey, null);
            const newHue = getNextUniqueHue();
            const config = {
                h: newHue,
                b: random(0.9, 1.25).toFixed(2),
                s: random(0.85, 1.4).toFixed(2),
                sc: random(0.95, 1.05).toFixed(2)
            };
            document.getElementById('inp-hue').value = config.h;
            document.getElementById('inp-bright').value = config.b;
            document.getElementById('inp-sat').value = config.s;
            document.getElementById('inp-scale').value = config.sc;
            updateLabels();
            document.querySelectorAll('.avatar').forEach(av => {
                if (getUserKey(av) === currentEditingKey) {
                    delete av.dataset.hatCustom;
                    setAvatarVars(av, config);
                }
            });
        });
        const closeFunc = () => closeModal();
        document.querySelector('.hat-btn-close').addEventListener('click', closeFunc);
    }

    function updateAllAvatarsOfUser(userKey, config, setCustomFlag = false) {
        document.querySelectorAll('.avatar').forEach(av => {
            if (getUserKey(av) === userKey) {
                setAvatarVars(av, config);
                if (setCustomFlag) av.dataset.hatCustom = "true";
            }
        });
    }

    function closeModal() {
        document.getElementById('hat-customizer-modal').classList.remove('active');
        currentEditingAvatar = null;
        currentEditingKey = null;
    }

    function colorizeNode(node) {
        if (node.id === 'hat-customizer-modal') return;
        if (node.matches && node.matches('.avatar')) applyStyle(node);
        else if (node.querySelectorAll) {
            const nested = node.querySelectorAll('.avatar');
            for (let i = 0; i < nested.length; i++) applyStyle(nested[i]);
        }
    }

    initGlobalEvents();
    const bodyObserver = new MutationObserver(() => {
        if (document.body) {
            injectModal();
            bodyObserver.disconnect();
        }
    });
    bodyObserver.observe(document.documentElement, { childList: true });
    const observer = new MutationObserver((mutations) => {
        for (let i = 0; i < mutations.length; i++) {
            const addedNodes = mutations[i].addedNodes;
            if (!addedNodes.length) continue;
            for (let j = 0; j < addedNodes.length; j++) colorizeNode(addedNodes[j]);
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener("DOMContentLoaded", () => {
        const existing = document.querySelectorAll('.avatar');
        for (let i = 0; i < existing.length; i++) applyStyle(existing[i]);
    });
})();