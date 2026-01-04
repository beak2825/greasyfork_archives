// ==UserScript==
// @name         New Year Vibe 2026
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  Новогодний вайб для lolz
// @match        https://lolz.live/*
// @grant        none
// @license MIT  Dimeria
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560322/New%20Year%20Vibe%202026.user.js
// @updateURL https://update.greasyfork.org/scripts/560322/New%20Year%20Vibe%202026.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_SETTINGS = {
        snow: true,
        frostyHeaders: true,
        frozenAvatars: true,
        fluffyStyle: true,
        garland: true,
        threadToy: true,
        candyBorder: true,
        textReplace: true,
        candyColor1: '#ff6464',
        candyColor2: '#ffffff',
        candyOpacity: 0.8,
        candyBrightness: 1.0,
        snowAmount: 50,
        snowSizeMin: 1,
        snowSizeMax: 10,
        snowSpeed: 5
    };

    let settings = { ...DEFAULT_SETTINGS };

    function loadSettings() {
        try {
            const saved = localStorage.getItem('newYearVibe_settings');
            if (saved) {
                settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
            }
        } catch (e) {}
    }

    function saveSettings() {
        try {
            localStorage.setItem('newYearVibe_settings', JSON.stringify(settings));
        } catch (e) {}
    }

    loadSettings();

    const imgDropSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAUCAYAAABc0f5lAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABWElEQVQ4jZ2SvUtCURhAn3vvilYt/QELCg0RDRUtNghFk4tDQ0s1tTjY0t/Q3B/Q0B8QQUuD0JCLi4s1FkFDg5aWSIKCLi4i4u71dDjc+3pB6AOncM75zXnPAY5t27hP6t0iIgIA27axbRvX6zUajQbq9Tp8Ph98Ph+i0ai0220q1SpSqRTS6TQEQUCpVEKxWMRgMEDrX4rFIqLRKNbrNQBgMpmg2+3i+fmZqtUq/H4/kskks9ksg8Egrq6uYBgGnU4HpmlhtVrB4/HA5/PB4XDg+PiYh4cHFItFdDodyLIMADg9PaVarfL7/ZFlWd4XCoX3x8dHBEFAu91GJBIhTdMIgqAAwP39PbLZbL/f74dlWTg4OMDr6yuWyyXsdjt0XYfFYkG5XEa73SbHcfB6vbAsCx8fH9jf3wcA8DyP0WjEWq2G09NT5PN58DyPX+U9/4kCgQCy2Szr9TrC4TCSySR+AV81d0e+wQ1/AAAAAElFTkSuQmCC";

    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --nyv-candy-c1: 255,100,100;
            --nyv-candy-c2: 255,255,255;
            --nyv-candy-opacity: 0.8;
            --nyv-candy-brightness: 1;
        }

        .garland-wrapper, .sidebarWrapper, .section, .secondaryContent {
            overflow: visible !important;
            position: relative !important;
            z-index: 1;
        }

        .snow-wrapper { position: relative !important; overflow: visible !important; }

        .snowflake {
            position: fixed;
            top: -50px;
            color: rgba(255, 255, 255, 0.9);
            user-select: none;
            pointer-events: none;
            z-index: 9999;
            animation: fall linear forwards;
            will-change: transform;
            text-shadow: 0 0 3px rgba(255,255,255,0.8);
        }
        @keyframes fall {
            to { transform: translateY(110vh) rotate(360deg); }
        }

        .style-frosty::before {
            content: '';
            position: absolute;
            top: -8px;
            left: -2px;
            right: -2px;
            height: 14px;
            background: linear-gradient(180deg, #ffffff 20%, #b3e5fc 100%);
            box-shadow: 0 0 5px rgba(135, 206, 250, 0.5), inset 0 -1px 3px rgba(255,255,255, 0.8);
            border-radius: 50% 50% 40% 40% / 80% 80% 20% 20%;
            z-index: 100;
            pointer-events: none;
        }

        .style-avatar-frost { position: relative !important; }
        .style-avatar-frost::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 45%;
            background-image:
                linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(220, 245, 255, 0.7) 70%, rgba(220, 245, 255, 0.0) 100%),
                radial-gradient(circle at 10% 20%, rgba(255,255,255,0.9) 1px, transparent 2px),
                radial-gradient(circle at 30% 10%, rgba(255,255,255,0.9) 2px, transparent 3px),
                radial-gradient(circle at 50% 30%, rgba(255,255,255,1) 2px, transparent 4px),
                radial-gradient(circle at 90% 25%, rgba(255,255,255,0.9) 2px, transparent 3px);
            background-repeat: no-repeat;
            box-shadow: inset 0 2px 15px rgba(255,255,255, 1), 0 1px 5px rgba(135, 206, 250, 0.6);
            border-radius: 0 0 30% 30% / 0 0 20% 20%;
            border-bottom: 2px solid rgba(255, 255, 255, 0.5);
            z-index: 999;
            pointer-events: none;
        }

        .style-fluffy::before {
            content: '';
            position: absolute;
            top: -12px;
            left: -5px;
            right: -5px;
            height: 25px;
            background: linear-gradient(to bottom, #ffffff 40%, #eef6ff 100%);
            border-radius: 40% 40% 50% 50% / 50% 50% 30% 30%;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25), inset 0 2px 5px rgba(255,255,255,1);
            z-index: 100;
            pointer-events: none;
        }

        #page_info_wrap.style-fluffy::before {
            background: linear-gradient(to bottom,
                rgba(255, 255, 255, 0.95) 0%,
                rgba(255, 255, 255, 0.8) 60%,
                rgba(179, 229, 252, 0.3) 100%
            ) !important;
            box-shadow: inset 0 2px 5px rgba(255, 255, 255, 0.9), 0 2px 5px rgba(255, 255, 255, 0.1) !important;
            border-bottom: none !important;
            height: 35px !important;
        }

        .frost-drop {
            position: absolute;
            top: 5px;
            width: 6px;
            height: 6px;
            background: #29b6f6;
            box-shadow: 0 0 4px #0288d1;
            border-radius: 0 50% 50% 50%;
            transform: rotate(45deg);
            z-index: 99;
            opacity: 0;
            pointer-events: none;
            will-change: transform;
        }
        @keyframes frostDripAnim {
            0% { top: 2px; opacity: 0; transform: rotate(45deg) scale(0); }
            20% { opacity: 1; transform: rotate(45deg) scale(1); }
            40% { top: 4px; }
            100% { top: 35px; opacity: 0; transform: rotate(45deg) scale(0.5); }
        }

        .img-drop {
            position: absolute;
            top: 10px;
            width: 6px;
            height: 9px;
            z-index: 99;
            opacity: 0;
            pointer-events: none;
            will-change: transform;
        }
        @keyframes imgDripAnim {
            0% { transform: translateY(0) scaleX(1); opacity: 0; }
            5% { opacity: 1; }
            15% { transform: translateY(3px) scaleX(1.1); }
            85% { opacity: 0.8; transform: translateY(40px) scaleX(0.9); }
            100% { transform: translateY(45px) scaleX(0.5); opacity: 0; }
        }

        .garland-bulb {
            position: absolute;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            z-index: 10001;
            animation: flash 1s infinite alternate;
            pointer-events: none;
        }
        .bulb-red { background: #ff3333; box-shadow: 0 0 4px #ff3333; animation-delay: 0s; }
        .bulb-gold { background: #ffcc00; box-shadow: 0 0 4px #ffcc00; animation-delay: 0.25s; }
        .bulb-green { background: #33ff33; box-shadow: 0 0 4px #33ff33; animation-delay: 0.5s; }
        .bulb-blue { background: #3333ff; box-shadow: 0 0 4px #3333ff; animation-delay: 0.75s; }
        @keyframes flash {
            from { opacity: 0.5; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1.3); box-shadow: 0 0 8px currentColor; }
        }

        .thread-toy {
            position: absolute;
            top: -5px;
            right: 20px;
            width: 20px;
            height: 40px;
            pointer-events: none;
            z-index: 50;
            transform-origin: top center;
            animation: swing 1.5s ease-in-out infinite alternate;
        }
        .thread-toy::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            width: 1px;
            height: 25px;
            background: rgba(255, 255, 255, 0.5);
        }
        .thread-toy::after {
            content: '';
            position: absolute;
            left: 50%;
            top: 25px;
            transform: translateX(-50%);
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, #ff6b6b, #c0392b);
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .thread-toy .shine {
            position: absolute;
            top: 27px;
            left: 7px;
            width: 3px;
            height: 3px;
            background: #fff;
            border-radius: 50%;
            opacity: 0.8;
            z-index: 51;
        }
        @keyframes swing {
            from { transform: rotate(-8deg); }
            to { transform: rotate(8deg); }
        }

        .style-candy-border {
            position: relative !important;
            background: #2d2d2d !important;
            z-index: 1;
            border-radius: 4px;
        }
        .style-candy-border::before {
            content: '';
            position: absolute;
            top: -1px;
            left: -1px;
            right: -1px;
            bottom: -1px;
            z-index: -1;
            border-radius: 5px;
            background: repeating-linear-gradient(
                45deg,
                rgba(var(--nyv-candy-c1), var(--nyv-candy-opacity)),
                rgba(var(--nyv-candy-c1), var(--nyv-candy-opacity)) 10px,
                rgba(var(--nyv-candy-c2), var(--nyv-candy-opacity)) 10px,
                rgba(var(--nyv-candy-c2), var(--nyv-candy-opacity)) 20px
            );
            background-size: 200% 200%;
            animation: candyWrap 30s linear infinite !important;
            filter: brightness(var(--nyv-candy-brightness));
            will-change: background-position;
        }

        @keyframes candyWrap {
            0% { background-position: 0% 0%; }
            100% { background-position: 100% 100%; }
        }

        #nyv-settings-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 40px;
            height: 40px;
            background: none;
            border: none;
            cursor: pointer;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            transition: transform 0.2s;
            user-select: none;
            filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
        }
        #nyv-settings-btn:hover {
            transform: scale(1.15);
        }

        #nyv-settings-modal {
            position: fixed;
            bottom: 70px;
            left: 20px;
            z-index: 10001;
            display: none;
        }
        #nyv-settings-modal.active {
            display: block;
        }

        #nyv-settings-panel {
            background: linear-gradient(135deg, #1a3a1a 0%, #0d1f0d 100%);
            border: 2px solid #4a7c23;
            border-radius: 12px;
            padding: 20px;
            width: 320px;
            max-height: 70vh;
            overflow-y: auto;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(74, 124, 35, 0.3);
            color: #fff;
        }

        #nyv-settings-panel h2 {
            margin: 0 0 15px 0;
            font-size: 20px;
            color: #7fc843;
            text-align: center;
            text-shadow: 0 0 10px rgba(127, 200, 67, 0.5);
        }

        .nyv-setting-item {
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(74, 124, 35, 0.3);
        }

        .nyv-setting-item:last-child {
            border-bottom: none;
        }

        .nyv-checkbox-item {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            padding: 6px;
            border-radius: 6px;
            transition: background 0.2s;
        }

        .nyv-checkbox-item:hover {
            background: rgba(74, 124, 35, 0.2);
        }

        .nyv-checkbox {
            width: 18px;
            height: 18px;
            border: 2px solid #4a7c23;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .nyv-checkbox.checked::after {
            content: '✓';
            color: #7fc843;
            font-size: 14px;
            font-weight: bold;
        }

        .nyv-label {
            font-size: 13px;
        }

        .nyv-color-controls {
            display: grid;
            gap: 12px;
        }

        .nyv-color-item {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .nyv-color-item label {
            min-width: 70px;
            font-size: 12px;
        }

        .nyv-color-item input[type="color"] {
            width: 50px;
            height: 30px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }

        .nyv-slider-item {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .nyv-slider-label {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
        }

        .nyv-slider {
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: #333;
            outline: none;
            -webkit-appearance: none;
        }

        .nyv-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #4a7c23;
            cursor: pointer;
        }

        .nyv-slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #4a7c23;
            cursor: pointer;
            border: none;
        }

        .nyv-buttons {
            display: flex;
            gap: 8px;
            margin-top: 15px;
        }

        .nyv-btn {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            transition: opacity 0.2s;
        }

        .nyv-btn:hover {
            opacity: 0.8;
        }

        .nyv-btn-reset {
            background: #c0392b;
            color: #fff;
        }

        .nyv-btn-close {
            background: #4a7c23;
            color: #fff;
        }

        #nyv-settings-panel::-webkit-scrollbar {
            width: 8px;
        }

        #nyv-settings-panel::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.3);
            border-radius: 4px;
        }

        #nyv-settings-panel::-webkit-scrollbar-thumb {
            background: #4a7c23;
            border-radius: 4px;
        }

        #nyv-settings-panel::-webkit-scrollbar-thumb:hover {
            background: #5a9c33;
        }
    `;

    const headObserver = new MutationObserver(() => {
        if (document.head) {
            document.head.appendChild(style);
            headObserver.disconnect();
        }
    });
    headObserver.observe(document.documentElement, { childList: true });

    let snowInterval = null;

    function updateCandyColors() {
        const color1 = settings.candyColor1;
        const color2 = settings.candyColor2;
        const opacity = settings.candyOpacity;
        const brightness = settings.candyBrightness;

        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);

        const root = document.documentElement.style;
        root.setProperty('--nyv-candy-c1', `${rgb1.r},${rgb1.g},${rgb1.b}`);
        root.setProperty('--nyv-candy-c2', `${rgb2.r},${rgb2.g},${rgb2.b}`);
        root.setProperty('--nyv-candy-opacity', opacity);
        root.setProperty('--nyv-candy-brightness', brightness);
    }

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 100, b: 100 };
    }

    function initSnow() {
        if (snowInterval) {
            clearInterval(snowInterval);
            snowInterval = null;
        }

        if (!settings.snow) {
            document.querySelectorAll('.snowflake').forEach(el => el.remove());
            return;
        }

        const getInterval = () => {
            const amount = settings.snowAmount;
            if (amount <= 0) return 10000;
            return Math.max(50, Math.floor(10000 / amount));
        };

        const spawnSnowflake = () => {
            const el = document.createElement('div');
            el.className = 'snowflake';
            el.innerHTML = '❄';
            el.style.left = Math.random() * 100 + 'vw';

            const speedFactor = settings.snowSpeed / 5;
            const baseDuration = Math.random() * 7 + 5;
            const duration = baseDuration / speedFactor;

            el.style.animationDuration = duration + 's';

            const sizeRange = settings.snowSizeMax - settings.snowSizeMin;
            const size = settings.snowSizeMin + Math.random() * sizeRange;
            el.style.fontSize = size + 'px';

            el.style.opacity = Math.random() * 0.7 + 0.3;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), duration * 1000);
        };

        snowInterval = setInterval(spawnSnowflake, getInterval());
    }

    function safeReplaceText(element, searchText, replaceText) {
        if (!settings.textReplace) return;
        if (!element.textContent.includes(searchText)) return;
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            if (node.nodeValue.includes(searchText)) {
                node.nodeValue = node.nodeValue.replace(new RegExp(searchText, 'g'), replaceText);
            }
        }
    }

    function spawnFrostDrops(block) {
        if (!settings.frostyHeaders) return;
        const width = block.offsetWidth || 300;
        const count = Math.floor(width / 35);
        for (let i = 0; i < count; i++) {
            const d = document.createElement('div');
            d.className = 'frost-drop';
            d.style.left = (Math.random() * 94 + 3) + '%';
            d.style.animation = `frostDripAnim ${Math.random()*2+3}s ease-in-out infinite ${Math.random()*5}s`;
            block.appendChild(d);
        }
    }

    function spawnImgDrops(block) {
        if (!settings.fluffyStyle) return;
        const width = block.offsetWidth || 300;
        const count = Math.floor(width / 50);
        for (let i = 0; i < count; i++) {
            const img = document.createElement('img');
            img.src = imgDropSrc;
            img.className = 'img-drop';
            img.style.left = (Math.random() * 90 + 5) + '%';
            img.style.animation = `imgDripAnim ${Math.random()*3+4}s ease-in infinite ${Math.random()*5}s`;
            block.appendChild(img);
        }
    }

    const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
            requestAnimationFrame(() => createGarland(entry.target));
        }
    });

    function createGarland(block) {
        if (!settings.garland) return;
        block.querySelectorAll('.garland-bulb').forEach(b => b.remove());

        const w = block.offsetWidth;
        const h = block.offsetHeight;
        if (h === 0) return;

        const offset = -6;
        const spacing = 14;
        const colors = ['bulb-red', 'bulb-gold', 'bulb-green', 'bulb-blue'];
        let colorIdx = 0;

        const addBulb = (t, l, r, b) => {
            const bulb = document.createElement('div');
            bulb.className = `garland-bulb ${colors[colorIdx++ % 4]}`;
            if (t !== null) bulb.style.top = t + 'px';
            if (l !== null) bulb.style.left = l + 'px';
            if (r !== null) bulb.style.right = r + 'px';
            if (b !== null) bulb.style.bottom = b + 'px';
            block.appendChild(bulb);
        };

        const isSidebar = block.classList.contains('sidebarWrapper');

        if (isSidebar) {
            const createSegmentedLine = (length, callback) => {
                let pos = 0;
                while (pos < length) {
                    const segmentLength = Math.floor(Math.random() * 3 + 4) * spacing;
                    const gapLength = Math.floor(Math.random() * 3 + 3) * spacing;

                    const segmentEnd = Math.min(pos + segmentLength, length);
                    for (let i = pos; i < segmentEnd; i += spacing) {
                        callback(i);
                    }
                    pos = segmentEnd + gapLength;
                }
            };

            createSegmentedLine(w, (i) => addBulb(offset, i, null, null));
            createSegmentedLine(h, (i) => addBulb(i, null, offset, null));
            createSegmentedLine(w, (i) => addBulb(null, null, i, offset));
            createSegmentedLine(h, (i) => addBulb(null, offset, null, i));
        } else {
            for (let i = 0; i < w; i += spacing) {
                addBulb(offset, i, null, null);
            }
            for (let i = 0; i < h; i += spacing) {
                addBulb(i, null, offset, null);
            }
            for (let i = w; i >= 0; i -= spacing) {
                addBulb(null, null, i, offset);
            }
            for (let i = h; i >= 0; i -= spacing) {
                addBulb(null, offset, null, i);
            }
        }
    }

    function addThreadToy(block) {
        if (!settings.threadToy) return;
        const toy = document.createElement('div');
        toy.className = 'thread-toy';
        const shine = document.createElement('div');
        shine.className = 'shine';
        toy.appendChild(shine);
        block.appendChild(toy);
    }

    function applyStyles() {
        document.querySelectorAll('.snow-wrapper').forEach(el => {
            if (!el.classList.contains('garland-wrapper')) {
                el.classList.remove('snow-wrapper', 'style-frosty', 'style-avatar-frost', 'style-fluffy');
                el.querySelectorAll('.frost-drop, .img-drop, .thread-toy').forEach(child => child.remove());
            } else {
                el.querySelectorAll('.frost-drop, .img-drop, .thread-toy').forEach(child => child.remove());
            }
        });

        processNode(document.body);
        document.querySelectorAll('*').forEach(processNode);
    }

    function processNode(node) {
        if (node.nodeType !== 1) return;

        if (node.matches('.sidebar') || node.closest('.sidebar')) {
            safeReplaceText(node, 'Меценат', 'Санта');
            safeReplaceText(node, 'Страховой депозит', 'Tpаховой депозит');
        }

        if (node.matches('dl.pairsJustified') || node.querySelector('dl.pairsJustified')) {
            const targets = node.matches('dl.pairsJustified') ? [node] : node.querySelectorAll('dl.pairsJustified');
            targets.forEach(dl => {
                safeReplaceText(dl, 'симпатии', 'снежинок');
                safeReplaceText(dl, 'Симпатии', 'Снежинки');
            });
        }

        if (node.matches('.insuranceMoney.amount') || node.querySelector('.insuranceMoney.amount')) {
            const targets = node.matches('.insuranceMoney.amount') ? [node] : node.querySelectorAll('.insuranceMoney.amount');
            targets.forEach(el => {
                if (/^0\s*₽$/.test(el.textContent.trim())) {
                    el.textContent = 'Нищ ₽';
                }
            });
        }

        if (node.matches('.ToggleTrigger.JsOnly') || node.querySelector('.ToggleTrigger.JsOnly')) {
            const targets = node.matches('.ToggleTrigger.JsOnly') ? [node] : node.querySelectorAll('.ToggleTrigger.JsOnly');
            targets.forEach(el => {
                safeReplaceText(el, 'Заметка о пользователе', 'Обозначь пидopa');
            });
        }

        if (settings.frostyHeaders && (node.matches('.hotThreadsContainer .header') || node.querySelector('.hotThreadsContainer .header'))) {
            const el = node.matches('.header') ? node : node.querySelector('.hotThreadsContainer .header');
            if (el && !el.classList.contains('snow-wrapper')) {
                el.classList.add('snow-wrapper', 'style-frosty');
                spawnFrostDrops(el);
            }
        }

        if (settings.fluffyStyle && (node.matches('.heroBlock') || node.querySelector('.heroBlock'))) {
            const el = node.matches('.heroBlock') ? node : node.querySelector('.heroBlock');
            if (el && !el.classList.contains('snow-wrapper')) {
                el.classList.add('snow-wrapper', 'style-fluffy');
                spawnImgDrops(el);
            }
        }

        if (settings.fluffyStyle && (node.matches('.chat2-header') || node.querySelector('.chat2-header'))) {
            const el = node.matches('.chat2-header') ? node : node.querySelector('.chat2-header');
            if (el && !el.classList.contains('snow-wrapper')) {
                el.classList.add('snow-wrapper', 'style-fluffy');
            }
        }

        if (settings.garland && (node.matches('.sidebarWrapper') || node.querySelector('.sidebarWrapper'))) {
            const wrappers = node.matches('.sidebarWrapper') ? [node] : node.querySelectorAll('.sidebarWrapper');
            wrappers.forEach(wrapper => {
                if (!wrapper.classList.contains('garland-wrapper') && wrapper.offsetHeight > 50) {
                    wrapper.classList.add('garland-wrapper', 'snow-wrapper');
                    createGarland(wrapper);
                    resizeObserver.observe(wrapper);
                }
            });
        }

        if (settings.garland && (node.matches('.nodeBlock') || node.querySelector('.nodeBlock'))) {
            const blocks = node.matches('.nodeBlock') ? [node] : node.querySelectorAll('.nodeBlock');
            blocks.forEach(el => {
                if (!el.classList.contains('garland-wrapper')) {
                    el.classList.add('garland-wrapper', 'snow-wrapper');
                    createGarland(el);
                    resizeObserver.observe(el);
                }
            });
        }

        const avatarBlockSelector = '.secondaryContent .avatarScaler';
        if (settings.frozenAvatars && (node.matches(avatarBlockSelector) || node.querySelector(avatarBlockSelector))) {
            const targets = node.matches(avatarBlockSelector) ? [node] : node.querySelectorAll(avatarBlockSelector);
            targets.forEach(el => {
                if (!el.classList.contains('snow-wrapper')) {
                    el.classList.add('snow-wrapper', 'style-avatar-frost');
                }
            });
        }

        if (settings.fluffyStyle && (node.matches('#page_info_wrap') || node.querySelector('#page_info_wrap'))) {
            const el = node.matches('#page_info_wrap') ? node : node.querySelector('#page_info_wrap');
            if (el && !el.classList.contains('snow-wrapper')) {
                el.classList.add('snow-wrapper', 'style-fluffy');
            }
        }

        const threadSelector = '.discussionList .discussionListItem';
        if (settings.threadToy && (node.matches(threadSelector) || node.querySelector(threadSelector))) {
            const targets = node.matches(threadSelector) ? [node] : node.querySelectorAll(threadSelector);
            targets.forEach(el => {
                if (!el.classList.contains('snow-wrapper')) {
                    el.classList.add('snow-wrapper');
                    addThreadToy(el);
                }
            });
        }

        if (settings.candyBorder && (node.matches('.text_Ads') || node.querySelector('.text_Ads'))) {
            const el = node.matches('.text_Ads') ? node : node.querySelector('.text_Ads');
            if (el && !el.classList.contains('style-candy-border')) {
                el.classList.add('style-candy-border');
            }
        }

        if (settings.candyBorder && (node.matches('.profile_threads_list.Sortable') || node.querySelector('.profile_threads_list.Sortable'))) {
            const el = node.matches('.profile_threads_list.Sortable') ? node : node.querySelector('.profile_threads_list.Sortable');
            if (el && !el.classList.contains('style-candy-border')) {
                el.classList.add('style-candy-border');
            }
        }
    }

    function createUI() {
        const btn = document.createElement('div');
        btn.id = 'nyv-settings-btn';
        btn.innerHTML = '🎄';
        btn.addEventListener('click', () => {
            modal.classList.toggle('active');
        });

        const modal = document.createElement('div');
        modal.id = 'nyv-settings-modal';
        modal.innerHTML = `
            <div id="nyv-settings-panel">
                <h2>🎄 New Year Vibe 🎄</h2>

                <div class="nyv-setting-item">
                    <div class="nyv-checkbox-item" data-setting="snow">
                        <div class="nyv-checkbox ${settings.snow ? 'checked' : ''}"></div>
                        <span class="nyv-label">Снег</span>
                    </div>
                </div>

                <div class="nyv-setting-item nyv-color-controls">
                    <div class="nyv-slider-item">
                        <div class="nyv-slider-label">
                            <span>Количество снежинок:</span>
                            <span id="nyv-snow-amount-value">${settings.snowAmount}</span>
                        </div>
                        <input type="range" class="nyv-slider" id="nyv-snow-amount" min="0" max="200" value="${settings.snowAmount}">
                    </div>

                    <div class="nyv-slider-item">
                        <div class="nyv-slider-label">
                            <span>Размер от:</span>
                            <span id="nyv-snow-size-min-value">${settings.snowSizeMin}px</span>
                        </div>
                        <input type="range" class="nyv-slider" id="nyv-snow-size-min" min="1" max="30" value="${settings.snowSizeMin}">
                    </div>

                    <div class="nyv-slider-item">
                        <div class="nyv-slider-label">
                            <span>Размер до:</span>
                            <span id="nyv-snow-size-max-value">${settings.snowSizeMax}px</span>
                        </div>
                        <input type="range" class="nyv-slider" id="nyv-snow-size-max" min="1" max="30" value="${settings.snowSizeMax}">
                    </div>

                    <div class="nyv-slider-item">
                        <div class="nyv-slider-label">
                            <span>Скорость падения:</span>
                            <span id="nyv-snow-speed-value">${settings.snowSpeed}</span>
                        </div>
                        <input type="range" class="nyv-slider" id="nyv-snow-speed" min="1" max="10" value="${settings.snowSpeed}">
                    </div>
                </div>

                <div class="nyv-setting-item">
                    <div class="nyv-checkbox-item" data-setting="frostyHeaders">
                        <div class="nyv-checkbox ${settings.frostyHeaders ? 'checked' : ''}"></div>
                        <span class="nyv-label">Морозные заголовки</span>
                    </div>
                </div>

                <div class="nyv-setting-item">
                    <div class="nyv-checkbox-item" data-setting="frozenAvatars">
                        <div class="nyv-checkbox ${settings.frozenAvatars ? 'checked' : ''}"></div>
                        <span class="nyv-label">Замерзшие аватары</span>
                    </div>
                </div>

                <div class="nyv-setting-item">
                    <div class="nyv-checkbox-item" data-setting="fluffyStyle">
                        <div class="nyv-checkbox ${settings.fluffyStyle ? 'checked' : ''}"></div>
                        <span class="nyv-label">Снежное оформление</span>
                    </div>
                </div>

                <div class="nyv-setting-item">
                    <div class="nyv-checkbox-item" data-setting="garland">
                        <div class="nyv-checkbox ${settings.garland ? 'checked' : ''}"></div>
                        <span class="nyv-label">Гирлянда</span>
                    </div>
                </div>

                <div class="nyv-setting-item">
                    <div class="nyv-checkbox-item" data-setting="threadToy">
                        <div class="nyv-checkbox ${settings.threadToy ? 'checked' : ''}"></div>
                        <span class="nyv-label">Игрушки на темах</span>
                    </div>
                </div>

                <div class="nyv-setting-item">
                    <div class="nyv-checkbox-item" data-setting="candyBorder">
                        <div class="nyv-checkbox ${settings.candyBorder ? 'checked' : ''}"></div>
                        <span class="nyv-label">Леденцовая рамка</span>
                    </div>
                </div>

                <div class="nyv-setting-item">
                    <div class="nyv-checkbox-item" data-setting="textReplace">
                        <div class="nyv-checkbox ${settings.textReplace ? 'checked' : ''}"></div>
                        <span class="nyv-label">Замена текста</span>
                    </div>
                </div>

                <div class="nyv-setting-item nyv-color-controls">
                    <div class="nyv-color-item">
                        <label>Цвет 1:</label>
                        <input type="color" id="nyv-color1" value="${settings.candyColor1}">
                    </div>
                    <div class="nyv-color-item">
                        <label>Цвет 2:</label>
                        <input type="color" id="nyv-color2" value="${settings.candyColor2}">
                    </div>

                    <div class="nyv-slider-item">
                        <div class="nyv-slider-label">
                            <span>Прозрачность:</span>
                            <span id="nyv-opacity-value">${Math.round(settings.candyOpacity * 100)}%</span>
                        </div>
                        <input type="range" class="nyv-slider" id="nyv-opacity" min="0" max="100" value="${settings.candyOpacity * 100}">
                    </div>

                    <div class="nyv-slider-item">
                        <div class="nyv-slider-label">
                            <span>Яркость:</span>
                            <span id="nyv-brightness-value">${Math.round(settings.candyBrightness * 100)}%</span>
                        </div>
                        <input type="range" class="nyv-slider" id="nyv-brightness" min="50" max="150" value="${settings.candyBrightness * 100}">
                    </div>
                </div>

                <div class="nyv-buttons">
                    <button class="nyv-btn nyv-btn-reset">Сброс</button>
                    <button class="nyv-btn nyv-btn-close">Закрыть</button>
                </div>
            </div>
        `;

        document.body.appendChild(btn);
        document.body.appendChild(modal);

        document.addEventListener('click', (e) => {
            if (!modal.contains(e.target) && !btn.contains(e.target) && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });

        modal.querySelectorAll('.nyv-checkbox-item').forEach(item => {
            item.addEventListener('click', () => {
                const setting = item.dataset.setting;
                settings[setting] = !settings[setting];
                const checkbox = item.querySelector('.nyv-checkbox');
                checkbox.classList.toggle('checked');
                saveSettings();

                if (setting === 'snow') {
                    initSnow();
                } else if (setting === 'candyBorder') {
                    if (settings.candyBorder) {
                        document.querySelectorAll('.text_Ads, .profile_threads_list.Sortable').forEach(el => {
                            if (!el.classList.contains('style-candy-border')) {
                                el.classList.add('style-candy-border');
                            }
                        });
                    } else {
                        document.querySelectorAll('.style-candy-border').forEach(el => {
                            el.classList.remove('style-candy-border');
                        });
                    }
                } else if (setting === 'garland') {
                    if (settings.garland) {
                        document.querySelectorAll('.sidebarWrapper, .nodeBlock').forEach(el => {
                            el.querySelectorAll('.garland-bulb').forEach(b => b.remove());
                            el.classList.add('garland-wrapper', 'snow-wrapper');
                            createGarland(el);
                            resizeObserver.observe(el);
                        });
                    } else {
                        document.querySelectorAll('.garland-wrapper').forEach(el => {
                            el.querySelectorAll('.garland-bulb').forEach(b => b.remove());
                            el.classList.remove('garland-wrapper', 'snow-wrapper');
                            resizeObserver.unobserve(el);
                        });
                    }
                } else {
                    applyStyles();
                }
            });
        });

        const color1Input = modal.querySelector('#nyv-color1');
        const color2Input = modal.querySelector('#nyv-color2');
        const opacityInput = modal.querySelector('#nyv-opacity');
        const brightnessInput = modal.querySelector('#nyv-brightness');
        const opacityValue = modal.querySelector('#nyv-opacity-value');
        const brightnessValue = modal.querySelector('#nyv-brightness-value');

        const snowAmountInput = modal.querySelector('#nyv-snow-amount');
        const snowAmountValue = modal.querySelector('#nyv-snow-amount-value');
        const snowSizeMinInput = modal.querySelector('#nyv-snow-size-min');
        const snowSizeMinValue = modal.querySelector('#nyv-snow-size-min-value');
        const snowSizeMaxInput = modal.querySelector('#nyv-snow-size-max');
        const snowSizeMaxValue = modal.querySelector('#nyv-snow-size-max-value');
        const snowSpeedInput = modal.querySelector('#nyv-snow-speed');
        const snowSpeedValue = modal.querySelector('#nyv-snow-speed-value');

        snowAmountInput.addEventListener('input', (e) => {
            settings.snowAmount = parseInt(e.target.value);
            snowAmountValue.textContent = settings.snowAmount;
            initSnow();
        });

        snowAmountInput.addEventListener('change', () => {
            saveSettings();
        });

        snowSizeMinInput.addEventListener('input', (e) => {
            settings.snowSizeMin = parseInt(e.target.value);
            snowSizeMinValue.textContent = `${settings.snowSizeMin}px`;
            if (settings.snowSizeMin > settings.snowSizeMax) {
                settings.snowSizeMax = settings.snowSizeMin;
                snowSizeMaxInput.value = settings.snowSizeMax;
                snowSizeMaxValue.textContent = `${settings.snowSizeMax}px`;
            }
        });

        snowSizeMinInput.addEventListener('change', () => {
            saveSettings();
        });

        snowSizeMaxInput.addEventListener('input', (e) => {
            settings.snowSizeMax = parseInt(e.target.value);
            snowSizeMaxValue.textContent = `${settings.snowSizeMax}px`;
            if (settings.snowSizeMax < settings.snowSizeMin) {
                settings.snowSizeMin = settings.snowSizeMax;
                snowSizeMinInput.value = settings.snowSizeMin;
                snowSizeMinValue.textContent = `${settings.snowSizeMin}px`;
            }
        });

        snowSizeMaxInput.addEventListener('change', () => {
            saveSettings();
        });

        snowSpeedInput.addEventListener('input', (e) => {
            settings.snowSpeed = parseInt(e.target.value);
            snowSpeedValue.textContent = settings.snowSpeed;
            initSnow();
        });

        snowSpeedInput.addEventListener('change', () => {
            saveSettings();
        });

        color1Input.addEventListener('input', (e) => {
            settings.candyColor1 = e.target.value;
            updateCandyColors();
        });

        color1Input.addEventListener('change', () => {
            saveSettings();
        });

        color2Input.addEventListener('input', (e) => {
            settings.candyColor2 = e.target.value;
            updateCandyColors();
        });

        color2Input.addEventListener('change', () => {
            saveSettings();
        });

        opacityInput.addEventListener('input', (e) => {
            settings.candyOpacity = e.target.value / 100;
            opacityValue.textContent = `${Math.round(e.target.value)}%`;
            updateCandyColors();
        });

        opacityInput.addEventListener('change', () => {
            saveSettings();
        });

        brightnessInput.addEventListener('input', (e) => {
            settings.candyBrightness = e.target.value / 100;
            brightnessValue.textContent = `${Math.round(e.target.value)}%`;
            updateCandyColors();
        });

        brightnessInput.addEventListener('change', () => {
            saveSettings();
        });

        modal.querySelector('.nyv-btn-reset').addEventListener('click', () => {
            if (confirm('Сбросить все настройки?')) {
                settings = { ...DEFAULT_SETTINGS };
                saveSettings();
                location.reload();
            }
        });

        modal.querySelector('.nyv-btn-close').addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach(processNode);
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll('*').forEach(processNode);
        initSnow();
        updateCandyColors();
        setTimeout(createUI, 500);
    });

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(() => {
            document.querySelectorAll('*').forEach(processNode);
            initSnow();
            updateCandyColors();
            createUI();
        }, 100);
    }

})();
