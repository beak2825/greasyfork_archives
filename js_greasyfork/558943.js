// ==UserScript==
// @name         Шапочки lolz ДОБРОТА
// @license      DOBROTA
// @namespace    lzt-hat-color-palette
// @match        https://lolz.live/*
// @description  Changes hat color on Lolz avatar using a small color palette panel.
// @match        https://lolz.guru/*
// @run-at       document-end
// @version 0.0.1.20251214210314
// @downloadURL https://update.greasyfork.org/scripts/558943/%D0%A8%D0%B0%D0%BF%D0%BE%D1%87%D0%BA%D0%B8%20lolz%20%D0%94%D0%9E%D0%91%D0%A0%D0%9E%D0%A2%D0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/558943/%D0%A8%D0%B0%D0%BF%D0%BE%D1%87%D0%BA%D0%B8%20lolz%20%D0%94%D0%9E%D0%91%D0%A0%D0%9E%D0%A2%D0%90.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const STORAGE_KEY = 'lzt_hat_palette_hue';
    const PALETTE = [
        { name: 'Red',hue: -40, color: '#ff4d4d' },
        { name: 'Orange', hue: 10, color: '#ff944d' },
        { name: 'Yellow', hue: 40, color: '#ffe74d' },
        { name: 'Green', hue: 80, color: '#4dff4d' },
        { name: 'Cyan', hue: 140, color: '#4dffe7' },
        { name: 'Blue', hue: 200, color: '#4d7dff' },
        { name: 'Purple', hue: 250, color: '#b84dff' },
        { name: 'Pink', hue: 300, color: '#ff4dcd' }
    ];

    function injectFilter(hueDeg) {
        const filterValue = `hue-rotate(${hueDeg}deg) saturate(2) brightness(1.1)`;
        let style = document.getElementById('hat-filter-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'hat-filter-style';
            document.head.appendChild(style);
        }
        style.textContent = `
        .navTab.account .avatar::before,
        .messageUserInfo .messageUserBlock .avatarHolder .avatar::before,
        .discussionListMainPage .threadHeader .threadHeaderAvatar .avatar::before {
            filter: ${filterValue} !important;
        }`;
    }

    function createPanel() {
        if (document.getElementById('hat-color-palette-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'hat-color-palette-panel';
        panel.style.position = 'fixed';
        panel.style.bottom = '20px';
        panel.style.right = '20px';
        panel.style.zIndex = '9999';
        panel.style.background = 'rgba(20,20,20,0.95)';
        panel.style.border = '1px solid #444';
        panel.style.borderRadius = '6px';
        panel.style.padding = '6px 8px';
        panel.style.display = 'flex';
        panel.style.alignItems = 'center';
        panel.style.gap = '6px';
        panel.style.pointerEvents = 'auto';

        const title = document.createElement('span');
        title.textContent = 'Шапка:';
        title.style.fontSize = '12px';
        title.style.color = '#fff';

        const colorsWrap = document.createElement('div');
        colorsWrap.style.display = 'flex';
        colorsWrap.style.gap = '4px';

        const savedHue = localStorage.getItem(STORAGE_KEY);
        const initialHue = savedHue !== null ? Number(savedHue) : 0;
        injectFilter(initialHue);

        PALETTE.forEach(item => {
            const btn = document.createElement('button');
            btn.title = item.name;
            btn.style.width = '18px';
            btn.style.height = '18px';
            btn.style.borderRadius = '50%';
            btn.style.border = '1px solid #555';
            btn.style.background = item.color;
            btn.style.cursor = 'pointer';
            btn.style.padding = '0';
            btn.style.outline = 'none';
            btn.style.display = 'block';

            btn.addEventListener('click', () => {
                injectFilter(item.hue);
                localStorage.setItem(STORAGE_KEY, String(item.hue));
            });

            colorsWrap.appendChild(btn);
        });

        panel.appendChild(title);
        panel.appendChild(colorsWrap);
        document.body.appendChild(panel);
    }

    function init() {
        createPanel();
    }

    init();

    const observer = new MutationObserver(() => init());
    observer.observe(document.body, { childList: true, subtree: true });
})();
