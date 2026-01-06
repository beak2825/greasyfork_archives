// ==UserScript==
// @name         Background Lolz Profile Menu
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Turn off затемнение Бэкграунда лолз
// @author       taskill
// @license      MIT
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561089/Background%20Lolz%20Profile%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/561089/Background%20Lolz%20Profile%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const settings = JSON.parse(localStorage.getItem('lz_bg_settings_v5') || '{"selfOn":true,"selfVal":100,"othersOn":false,"othersVal":100}');

    const style = document.createElement('style');
    style.innerHTML = `
        #lz-bg-main {
            position: fixed; z-index: 100000; width: 30px; height: 30px;
            background: #272727; border: 1px solid #3d3d3d; border-radius: 6px;
            display: none; align-items: center; justify-content: center;
            cursor: pointer; user-select: none; top: 3px; right: 224px;
        }
        #lz-bg-main:hover { border-color: #4a4a4a; }
        #lz-bg-main svg { width: 14px; height: 14px; fill: #8c8c8c; pointer-events: none; }
        #lz-bg-main.active svg { fill: #00ce8e; filter: drop-shadow(0 0 5px #00ce8e); }

        #lz-bg-menu {
            position: absolute; top: 38px; right: 0; width: 190px;
            background: #222222; border: 1px solid #3d3d3d; border-radius: 8px;
            padding: 12px; display: none; flex-direction: column; gap: 15px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.8);
            font-family: 'Open Sans', sans-serif; cursor: default;
        }
        #lz-bg-menu.show { display: flex; }

        .menu-item-row { display: flex; align-items: center; justify-content: space-between; cursor: pointer; color: #bbb; font-size: 11px; font-weight: 600; }
        .menu-item-row:hover { color: #fff; }

        .toggle-dot { width: 10px; height: 10px; border-radius: 50%; background: #333; transition: all 0.3s ease; border: 1px solid #444; }
        .toggle-dot.on {
            background: #00ce8e;
            border-color: #00ffa2;
            box-shadow: 0 0 8px #00ce8e, 0 0 15px rgba(0, 206, 142, 0.4);
        }

        .slider-container { display: flex; flex-direction: column; margin-top: 8px; padding: 0 2px; }

        .lz-slider {
            appearance: none; width: 100%; height: 4px; background: #333;
            outline: none; border-radius: 4px; cursor: pointer; transition: opacity 0.2s;
        }
        .lz-slider:disabled { cursor: not-allowed; opacity: 0.2; filter: grayscale(1); }

        .lz-slider::-webkit-slider-thumb {
            appearance: none; width: 12px; height: 12px; border-radius: 50%;
            background: #00ce8e;
            box-shadow: 0 0 10px #00ce8e, 0 0 20px rgba(0, 206, 142, 0.5);
            border: 2px solid #111; cursor: pointer; transition: transform 0.1s;
        }

        .menu-footer { margin-top: 5px; padding-top: 8px; border-top: 1px solid #333; font-size: 8px; color: #444; text-align: center; text-transform: uppercase; letter-spacing: 1px; }

        html.lz-bg-active #memberBackground {
            background-image: var(--img) !important;
            background-color: transparent !important;
            filter: brightness(var(--lz-br, 1)) !important;
            opacity: 1 !important;
        }
        html.lz-bg-active #memberBackground::after,
        html.lz-bg-active #memberBackground::before { content: none !important; display: none !important; }
    `;
    document.documentElement.appendChild(style);

    function applyLogic() {
        const bg = document.getElementById('memberBackground');
        const btn = document.getElementById('lz-bg-main');

        if (btn) btn.style.display = bg ? 'flex' : 'none';
        if (!bg) {
            document.documentElement.classList.remove('lz-bg-active');
            return;
        }

        const isOthers = !!document.querySelector('.followButton');
        const isOn = isOthers ? settings.othersOn : settings.selfOn;
        const val = isOthers ? settings.othersVal : settings.selfVal;

        document.documentElement.classList.toggle('lz-bg-active', isOn);
        if (isOn) bg.style.setProperty('--lz-br', val / 100);
        if (btn) btn.classList.toggle('active', isOn);
    }

    window.addEventListener('DOMContentLoaded', () => {
        const container = document.createElement('div');
        container.id = 'lz-bg-main';
        container.innerHTML = `
            <svg viewBox="0 0 24 24"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
            <div id="lz-bg-menu">
                <div class="menu-section">
                    <div class="menu-item-row" id="tog-self"><span>Мой профиль</span><div class="toggle-dot ${settings.selfOn?'on':''}"></div></div>
                    <div class="slider-container">
                        <input type="range" class="lz-slider" id="sld-self" min="0" max="100" value="${settings.selfVal}" ${!settings.selfOn?'disabled':''}>
                    </div>
                </div>
                <div class="menu-section">
                    <div class="menu-item-row" id="tog-others"><span>Чужие профили</span><div class="toggle-dot ${settings.othersOn?'on':''}"></div></div>
                    <div class="slider-container">
                        <input type="range" class="lz-slider" id="sld-others" min="0" max="100" value="${settings.othersVal}" ${!settings.othersOn?'disabled':''}>
                    </div>
                </div>
                <div class="menu-footer">Alt + Drag — перенос</div>
            </div>
        `;
        document.body.appendChild(container);

        const menu = container.querySelector('#lz-bg-menu');
        const save = () => localStorage.setItem('lz_bg_settings_v5', JSON.stringify(settings));

        container.onclick = (e) => {
            if (!e.altKey && (e.target === container || e.target.tagName === 'svg')) menu.classList.toggle('show');
        };

        const setupToggle = (id, keyOn, sliderId) => {
            container.querySelector(id).onclick = (e) => {
                e.stopPropagation();
                settings[keyOn] = !settings[keyOn];

                const dot = e.currentTarget.querySelector('.toggle-dot');
                const sld = container.querySelector(sliderId);

                dot.classList.toggle('on', settings[keyOn]);
                sld.disabled = !settings[keyOn];

                save();
                applyLogic();
            };
        };

        setupToggle('#tog-self', 'selfOn', '#sld-self');
        setupToggle('#tog-others', 'othersOn', '#sld-others');

        container.querySelector('#sld-self').oninput = (e) => { settings.selfVal = e.target.value; save(); applyLogic(); };
        container.querySelector('#sld-others').oninput = (e) => { settings.othersVal = e.target.value; save(); applyLogic(); };

        let isDragging = false, dragOffset = {x:0, y:0};
        container.onmousedown = (e) => { if (e.altKey) { isDragging = true; const r = container.getBoundingClientRect(); dragOffset = { x: e.clientX - r.left, y: e.clientY - r.top }; e.preventDefault(); } };
        document.onmousemove = (e) => { if (isDragging) { container.style.right = (window.innerWidth - (e.clientX - dragOffset.x) - container.offsetWidth) + 'px'; container.style.top = (e.clientY - dragOffset.y) + 'px'; } };
        document.onmouseup = () => { isDragging = false; };

        applyLogic();

        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(applyLogic, 500);
            }
        }, 1000);
    });
})();