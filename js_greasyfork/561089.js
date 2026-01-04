// ==UserScript==
// @name         Background Lolz Profile Menu
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Turn off затемнение Бэкграунда лолз
// @author       MARYXANAX
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

    const settings = JSON.parse(localStorage.getItem('lz_bg_settings') || '{"self":true,"others":false}');
    const L_TOP = "3px";
    const L_RIGHT = "224px";

    const style = document.createElement('style');
    style.innerHTML = `
        #lz-bg-main {
            position: fixed; z-index: 100000;
            width: 30px; height: 30px;
            background: #272727; border: 1px solid #3d3d3d; border-radius: 6px;
            display: none; align-items: center; justify-content: center;
            cursor: pointer; user-select: none;
            top: ${L_TOP}; right: ${L_RIGHT};
        }
        #lz-bg-main:hover { border-color: #4a4a4a; }
        #lz-bg-main svg { width: 14px; height: 14px; fill: #8c8c8c; pointer-events: none; }
        #lz-bg-main.active svg { fill: #00ce8e; filter: drop-shadow(0 0 2px #00ce8e); }

        #lz-bg-menu {
            position: absolute; top: 35px; right: 0; width: 160px;
            background: #272727; border: 1px solid #3d3d3d; border-radius: 8px;
            padding: 4px; display: none; flex-direction: column;
            box-shadow: 0 5px 15px rgba(0,0,0,0.6);
            font-family: 'Open Sans', 'Segoe UI', sans-serif;
        }
        #lz-bg-menu.show { display: flex; }
        .menu-item { display: flex; align-items: center; justify-content: space-between; color: #ccc; font-size: 11px; cursor: pointer; padding: 6px 10px; border-radius: 5px; }
        .menu-item:hover { background: #323232; color: #fff; }
        .toggle-dot { width: 8px; height: 8px; border-radius: 50%; background: #444; }
        .toggle-dot.on { background: #00ce8e; box-shadow: 0 0 5px #00ce8e; }
        .menu-footer { margin-top: 2px; padding: 5px 8px; border-top: 1px solid #363636; font-size: 8px; color: #555; text-align: center; text-transform: uppercase; }

        html.lz-clean-bg #memberBackground {
            background-image: var(--img) !important;
            background-color: transparent !important;
            filter: none !important; opacity: 1 !important;
        }
        html.lz-clean-bg #memberBackground::after,
        html.lz-clean-bg #memberBackground::before { content: none !important; display: none !important; }
    `;
    document.documentElement.appendChild(style);

    if (settings.self || settings.others) document.documentElement.classList.add('lz-clean-bg');

    function applyLogic() {
        const hasBg = !!document.getElementById('memberBackground');
        const btn = document.getElementById('lz-bg-main');
        if (!hasBg) {
            if (btn) btn.style.display = 'none';
            document.documentElement.classList.remove('lz-clean-bg');
            return;
        }
        const isOthers = !!document.querySelector('.followButton');
        const isMy = !!document.querySelector('a[href="account/personal-details"]');
        const shouldClean = (isMy && !isOthers && settings.self) || (isOthers && settings.others);

        document.documentElement.classList.toggle('lz-clean-bg', shouldClean);
        if (btn) { btn.style.display = 'flex'; btn.classList.toggle('active', shouldClean); }
    }

    const init = () => {
        if (document.getElementById('lz-bg-main')) return;
        const container = document.createElement('div');
        container.id = 'lz-bg-main';
        container.innerHTML = `
            <svg viewBox="0 0 24 24"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
            <div id="lz-bg-menu">
                <div class="menu-item" id="set-self"><span>Мой профиль</span> <div class="toggle-dot ${settings.self?'on':''}"></div></div>
                <div class="menu-item" id="set-others"><span>Чужие профили</span> <div class="toggle-dot ${settings.others?'on':''}"></div></div>
                <div class="menu-footer">Alt + Drag — перенос</div>
            </div>
        `;
        document.body.appendChild(container);

        container.onclick = (e) => { if (!e.altKey) container.querySelector('#lz-bg-menu').classList.toggle('show'); };
        container.querySelectorAll('.menu-item').forEach(item => {
            item.onclick = (e) => {
                e.stopPropagation();
                const key = item.id === 'set-self' ? 'self' : 'others';
                settings[key] = !settings[key];
                item.querySelector('.toggle-dot').classList.toggle('on');
                localStorage.setItem('lz_bg_settings', JSON.stringify(settings));
                applyLogic();
            };
        });

        let isDragging = false, dragOffset = {x:0, y:0};
        container.onmousedown = (e) => { if (e.altKey) { isDragging = true; const r = container.getBoundingClientRect(); dragOffset = { x: e.clientX - r.left, y: e.clientY - r.top }; } };
        document.onmousemove = (e) => { if (isDragging) { container.style.right = (window.innerWidth - (e.clientX - dragOffset.x) - container.offsetWidth) + 'px'; container.style.top = (e.clientY - dragOffset.y) + 'px'; } };
        document.onmouseup = () => { isDragging = false; };

        applyLogic();
    };

    const observer = new MutationObserver(() => { if (document.body) init(); applyLogic(); });
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();