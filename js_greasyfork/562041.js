// ==UserScript==
// @name         YouTube Speed Control (v13)
// @namespace    http://tampermonkey.net/
// @author       Solomon
// @license      CC-BY-4.0
// @version      13
// @description  Modern speed button with readable colors. Located between channel and like buttons.
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562041/YouTube%20Speed%20Control%20%28v13%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562041/YouTube%20Speed%20Control%20%28v13%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SPEEDS = [1, 1.25, 1.5, 1.75, 2];
    const SAVE_KEY = 'yt_speed_save_v13';
    const SPEED_KEY = 'yt_speed_value_v13';

    if (localStorage.getItem(SAVE_KEY) === null) {
        localStorage.setItem(SAVE_KEY, 'true');
    }

    const isSaveOn = () => localStorage.getItem(SAVE_KEY) === 'true';
    const getSavedSpeed = () => parseFloat(localStorage.getItem(SPEED_KEY)) || 1;
    const saveSpeed = (s) => localStorage.setItem(SPEED_KEY, String(s));

    let currentSpeed = isSaveOn() ? getSavedSpeed() : 1;
    let btn = null;
    let menu = null;
    let checkbox = null;
    let isOpen = false;
    let inserted = false;

    // ===== STYLES =====
    const css = document.createElement('style');
    css.textContent = `
        #ytspeed-wrapper {
            display: inline-flex !important;
            align-items: center !important;
            position: relative !important;
            margin-left: 8px !important;
            margin-right: 8px !important;
            vertical-align: middle !important;
        }

        /* ===== MAIN BUTTON ===== */
        #ytspeed-btn {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            height: 36px !important;
            padding: 0 16px !important;
            background: #cc0000 !important;
            color: #ffffff !important;
            border: none !important;
            border-radius: 18px !important;
            font-family: "YouTube Sans", "Roboto", Arial, sans-serif !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            user-select: none !important;
            transition: all 0.2s ease !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
        }

        #ytspeed-btn:hover {
            background: #aa0000 !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }

        #ytspeed-btn:active {
            transform: translateY(0) scale(0.98) !important;
        }

        #ytspeed-btn.open {
            background: #990000 !important;
        }

        /* Icon */
        .ytspeed-icon {
            font-size: 14px !important;
            line-height: 1 !important;
        }

        /* Speed text */
        .ytspeed-text {
            font-size: 14px !important;
            font-weight: 600 !important;
            line-height: 1 !important;
        }

        /* ===== DROPDOWN MENU ===== */
        #ytspeed-menu {
            position: absolute !important;
            bottom: calc(100% + 10px) !important;
            left: 50% !important;
            transform: translateX(-50%) scale(0.95) !important;
            opacity: 0 !important;
            visibility: hidden !important;
            background: #282828 !important;
            border: 1px solid #404040 !important;
            border-radius: 12px !important;
            padding: 8px !important;
            min-width: 130px !important;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important;
            z-index: 9999 !important;
            font-family: "YouTube Sans", "Roboto", Arial, sans-serif !important;
            transition: all 0.2s ease !important;
        }

        #ytspeed-menu.open {
            opacity: 1 !important;
            visibility: visible !important;
            transform: translateX(-50%) scale(1) !important;
        }

        /* Menu arrow */
        #ytspeed-menu::after {
            content: "" !important;
            position: absolute !important;
            bottom: -8px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            border-left: 8px solid transparent !important;
            border-right: 8px solid transparent !important;
            border-top: 8px solid #282828 !important;
        }

        /* ===== SPEED OPTIONS ===== */
        .ytspeed-item {
            padding: 10px 16px !important;
            color: #ffffff !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            text-align: center !important;
            border-radius: 8px !important;
            margin: 2px 0 !important;
            transition: background 0.15s ease !important;
        }

        .ytspeed-item:hover {
            background: #404040 !important;
        }

        .ytspeed-item.active {
            background: #cc0000 !important;
            color: #ffffff !important;
        }

        /* ===== DIVIDER ===== */
        .ytspeed-divider {
            height: 1px !important;
            background: #404040 !important;
            margin: 8px 4px !important;
        }

        /* ===== SAVE TOGGLE ===== */
        .ytspeed-save {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            padding: 10px 16px !important;
            color: #aaaaaa !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            border-radius: 8px !important;
            transition: all 0.15s ease !important;
        }

        .ytspeed-save:hover {
            background: #353535 !important;
            color: #ffffff !important;
        }

        /* Checkbox */
        .ytspeed-save input {
            appearance: none !important;
            -webkit-appearance: none !important;
            width: 16px !important;
            height: 16px !important;
            border: 2px solid #666666 !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            transition: all 0.15s ease !important;
            position: relative !important;
            background: transparent !important;
        }

        .ytspeed-save input:checked {
            background: #cc0000 !important;
            border-color: #cc0000 !important;
        }

        .ytspeed-save input:checked::after {
            content: "✓" !important;
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            color: #ffffff !important;
            font-size: 11px !important;
            font-weight: bold !important;
            line-height: 1 !important;
        }
    `;
    document.head.appendChild(css);

    // ===== CREATE ELEMENTS =====
    function createElements() {
        const wrapper = document.createElement('div');
        wrapper.id = 'ytspeed-wrapper';

        btn = document.createElement('button');
        btn.id = 'ytspeed-btn';
        btn.title = 'Playback Speed (Double-click to reset)';

        // Icon
        const icon = document.createElement('span');
        icon.className = 'ytspeed-icon';
        icon.textContent = '⚡';

        // Text
        const text = document.createElement('span');
        text.className = 'ytspeed-text';
        text.textContent = currentSpeed + 'x';

        btn.appendChild(icon);
        btn.appendChild(text);

        // Menu
        menu = document.createElement('div');
        menu.id = 'ytspeed-menu';

        SPEEDS.forEach(speed => {
            const item = document.createElement('div');
            item.className = 'ytspeed-item' + (Math.abs(speed - currentSpeed) < 0.01 ? ' active' : '');
            item.setAttribute('data-speed', speed);
            item.textContent = speed + 'x';
            item.onclick = (e) => {
                e.stopPropagation();
                setSpeed(speed);
            };
            menu.appendChild(item);
        });

        const divider = document.createElement('div');
        divider.className = 'ytspeed-divider';
        menu.appendChild(divider);

        const saveRow = document.createElement('label');
        saveRow.className = 'ytspeed-save';

        checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isSaveOn();
        checkbox.onclick = (e) => e.stopPropagation();
        checkbox.onchange = () => {
            localStorage.setItem(SAVE_KEY, checkbox.checked ? 'true' : 'false');
            if (checkbox.checked) saveSpeed(currentSpeed);
        };

        saveRow.appendChild(checkbox);
        saveRow.appendChild(document.createTextNode('Remember'));
        menu.appendChild(saveRow);

        wrapper.appendChild(btn);
        wrapper.appendChild(menu);

        btn.onclick = (e) => {
            e.stopPropagation();
            isOpen = !isOpen;
            menu.classList.toggle('open', isOpen);
            btn.classList.toggle('open', isOpen);
        };

        btn.ondblclick = (e) => {
            e.stopPropagation();
            setSpeed(1);
        };

        return wrapper;
    }

    // ===== INSERT INTO PAGE =====
    function insertButton() {
        if (document.getElementById('ytspeed-wrapper')) {
            inserted = true;
            btn = document.getElementById('ytspeed-btn');
            menu = document.getElementById('ytspeed-menu');
            checkbox = menu?.querySelector('input[type="checkbox"]');
            return;
        }

        const targets = [
            '#owner',
            '#top-row #owner',
            'ytd-watch-metadata #owner',
            '#above-the-fold #owner'
        ];

        let owner = null;
        for (const sel of targets) {
            owner = document.querySelector(sel);
            if (owner) break;
        }

        if (!owner) return;

        const wrapper = createElements();

        if (owner.nextSibling) {
            owner.parentNode.insertBefore(wrapper, owner.nextSibling);
        } else {
            owner.parentNode.appendChild(wrapper);
        }

        inserted = true;
        console.log('[YouTube Speed v13] ⚡ Button inserted!');
    }

    // ===== UPDATE UI =====
    function updateUI() {
        if (btn) {
            const text = btn.querySelector('.ytspeed-text');
            if (text) text.textContent = currentSpeed + 'x';
        }
        if (menu) {
            menu.querySelectorAll('.ytspeed-item').forEach(item => {
                const speed = parseFloat(item.getAttribute('data-speed'));
                item.classList.toggle('active', Math.abs(speed - currentSpeed) < 0.01);
            });
        }
    }

    // ===== SET SPEED =====
    function setSpeed(speed) {
        currentSpeed = speed;

        const video = document.querySelector('video');
        if (video) video.playbackRate = speed;

        if (checkbox?.checked) saveSpeed(speed);

        updateUI();
    }

    // ===== APPLY SPEED =====
    function applySpeed() {
        const video = document.querySelector('video');
        if (video && Math.abs(video.playbackRate - currentSpeed) > 0.01) {
            video.playbackRate = currentSpeed;
        }
    }

    // ===== CLOSE MENU =====
    document.addEventListener('click', (e) => {
        if (isOpen && btn && menu && e.target !== btn && !btn.contains(e.target) && !menu.contains(e.target)) {
            isOpen = false;
            menu.classList.remove('open');
            btn.classList.remove('open');
        }
    });

    // ===== KEYBOARD =====
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

        if (e.key === '[') setSpeed(Math.max(0.25, currentSpeed - 0.25));
        if (e.key === ']') setSpeed(Math.min(4, currentSpeed + 0.25));
        if (e.key === '\\') setSpeed(1);
        if (e.key === 'p' || e.key === 'P') setSpeed(1.25);
    });

    // ===== INIT =====
    function init() {
        insertButton();
        applySpeed();
        updateUI();
    }

    init();

    const observer = new MutationObserver(() => {
        if (!document.getElementById('ytspeed-wrapper')) inserted = false;
        if (!inserted) init();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('yt-navigate-finish', () => {
        inserted = false;
        setTimeout(init, 500);
    });

    setInterval(applySpeed, 1000);

})();