// ==UserScript==
// @name         Dynamic Cursor
// @namespace    http://tampermonkey.net/
// @version      2026-01-20
// @description  A dynamic cursor thingy
// @author       pooiod7
// @include      *
// @grant GM_registerMenuCommand
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/563301/Dynamic%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/563301/Dynamic%20Cursor.meta.js
// ==/UserScript==

// const s1332=document.createElement("style");
// s1332.textContent="button{transition:filter .5s}button:hover{filter:invert(1)}";
// document.head.appendChild(s1332);

(function() {
    if (window.DCurLoaded == true) return;
    window.DCurLoaded = true;

    var SETTINGS = {
        BASE_SIZE: { key: "size", def: "5", type: "number" },
        BASE_OPACITY: { key: "PointerOpacity", def: "0.9", type: "number" },
        OUTLINE_OPACITY: { key: "OutlineOpacity", def: "1", type: "number" },
        SELECT_OPACITY: { key: "SelectOpacity", def: "0.2", type: "number" },
        MOSTLY_OUTLINE: { key: "ForceOutline", def: false, type: "bool" },
        TEXT_CURSOR_WIDTH: { key: "TextPointerWidth", def: "2", type: "number" },
        OUTLINE_THICKNESS: { key: "OutlineThickness", def: "2", type: "number" },
        IGNORE_SITES: { key: "IgnoreSites", def: "example.com, studio.penguinmod.com, turbowarp.org", type: "text" }
    };

    var VALUES = {};
    Object.keys(SETTINGS).forEach(k => {
        VALUES[k] = GM_getValue(SETTINGS[k].key, SETTINGS[k].def);
    });

    var {
        BASE_SIZE,
        BASE_OPACITY,
        OUTLINE_OPACITY,
        SELECT_OPACITY,
        MOSTLY_OUTLINE,
        TEXT_CURSOR_WIDTH,
        OUTLINE_THICKNESS,
        IGNORE_SITES
    } = VALUES;

    Object.keys(SETTINGS).forEach(k => {
        let s = SETTINGS[k];
        let v = VALUES[k];
        GM_registerMenuCommand(`${k}: ${v}`, () => {
            let nv;
            if (s.type === "bool") {
                nv = confirm(`${k}: OK=true, Cancel=false`);
            } else {
                nv = prompt(`Set ${k}:`, v);
                if (nv === null) return;
                if (s.type === "number") nv = String(nv);
            }
            GM_setValue(s.key, nv);
            window.location.reload();
        });
    });

    var IGNORE_JSON = IGNORE_SITES.split(",").map(s => s.trim()).filter(Boolean);

    var IS_IGNORED = IGNORE_JSON.some(d => location.hostname === d || location.hostname.endsWith("." + d));
    if (IS_IGNORED) return;

    const Z_INDEX = '2147483647';
    var SMOOTH_DURATION = 200;

    const CLICKABLE_SELECTORS = 'a, button, input, textarea, select, details, [role="button"], [role="link"], g[id^="part-"]';
    const TEXT_INPUT_TYPES = ['text', 'password', 'email', 'number', 'search', 'tel', 'url', 'date', 'datetime-local', 'month', 'week', 'time'];

    const globalStyle = document.createElement('style');
    globalStyle.textContent = `*, html, body { cursor: none !important; }`;
    document.head.appendChild(globalStyle);

    const host = document.createElement('div');
    Object.assign(host.style, {
        position: 'fixed', top: '0', left: '0', width: '0', height: '0',
        zIndex: Z_INDEX, pointerEvents: 'none'
    });
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    const shadowStyle = document.createElement('style');
    shadowStyle.textContent = `
        .cursor {
            position: fixed; top: 0; left: 0;
            width: ${BASE_SIZE}px; height: ${BASE_SIZE}px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.1);
            backdrop-filter: invert(1);
            -webkit-backdrop-filter: invert(1);
            opacity: ${BASE_OPACITY};
            pointer-events: none;
            transform: translate3d(-50%, -50%, 0);
            box-sizing: border-box;
            will-change: transform, width, height, border-radius, padding;
            transition:
                width 0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
                height 0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
                border-radius 0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
                opacity 0.2s ease,
                padding 0.2s ease,
                background-color 0.2s ease;
            -webkit-mask: none;
            mask: none;
        }
        .cursor.smooth-pos {
            transition:
                width 0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
                height 0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
                border-radius 0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
                transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
                opacity 0.2s ease,
                padding 0.2s ease,
                background-color 0.2s ease;
        }
        .cursor.outline-mode {
            background-color: rgba(255, 255, 255, 0.5);
            padding: ${OUTLINE_THICKNESS}px;
            -webkit-mask: linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
        }
        .cursor.text-mode {
            border-radius: 0 !important;
            background-color: rgba(255, 255, 255, 0.5);
        }
        .cursor.hidden { opacity: 0 !important; }
    `;
    shadow.appendChild(shadowStyle);

    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    shadow.appendChild(cursor);

    let mouseX = -100, mouseY = -100;
    let currentMode = 'idle';
    let smoothRemoveTimer = null;
    let freezeCursor = false;
    let freezeTarget = null;

    const isSVGWithImage = (el) => {
        if (el.tagName.toLowerCase() === 'svg') return !!el.querySelector('image');
        return false;
    };

    const hasImage = (el) => {
        if (el.tagName.toLowerCase() === 'img') return true;
        if (isSVGWithImage(el)) return true;
        if (el.querySelector('svg') && isSVGWithImage(el.querySelector('svg'))) return true;
        if (el.querySelector('img')) return true;
        const style = window.getComputedStyle(el);
        if (style.backgroundImage !== 'none' && style.backgroundImage.includes('url')) return true;
        return false;
    };

    const getTextLineHeight = (el) => {
        const style = window.getComputedStyle(el);
        const lh = parseFloat(style.lineHeight);
        const fs = parseFloat(style.fontSize);
        return isNaN(lh) ? fs * 1.2 : lh;
    };

    const getClickable = (target) => {
        const el = target.closest(CLICKABLE_SELECTORS);
        if (el) return el;
        let traverse = target;
        while (traverse && traverse !== document.body) {
            const style = window.getComputedStyle(traverse);
            if (style.cursor === 'pointer') return traverse;
            traverse = traverse.parentElement;
        }
        return null;
    };

    const isTextBox = (el) => {
        const tag = el.tagName;
        if (tag === 'TEXTAREA') return true;
        if (tag === 'INPUT') {
            const type = el.getAttribute('type') || 'text';
            return TEXT_INPUT_TYPES.includes(type.toLowerCase());
        }
        return false;
    };

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    document.addEventListener('mousedown', (e) => {
        const target = e.target.closest(CLICKABLE_SELECTORS);
        if (target) {
            freezeCursor = target.classList.contains('freeze-cursor');
            freezeTarget = freezeCursor ? target : null;
        }
    });

    document.addEventListener('mouseup', () => {
        freezeCursor = false;
        freezeTarget = null;
    });

    document.addEventListener('mouseleave', () => cursor.classList.add('hidden'));
    document.addEventListener('mouseenter', () => cursor.classList.remove('hidden'));

    function update() {
        let currentX = mouseX;
        let currentY = mouseY;

        if (freezeCursor && freezeTarget) {
            const rect = freezeTarget.getBoundingClientRect();
            currentX = rect.left + rect.width / 2;
            currentY = rect.top + rect.height / 2;
        }

        const elUnderPoint = document.elementFromPoint(currentX, currentY);
        const target = elUnderPoint ? getClickable(elUnderPoint) : null;

        let targetX = currentX;
        let targetY = currentY;
        let targetW = BASE_SIZE;
        let targetH = BASE_SIZE;
        let targetR = '50%';
        let mode = 'idle';
        let isOutline = false;

        if (target) {
            cursor.style.opacity = SELECT_OPACITY;
            const rect = target.getBoundingClientRect();
            const style = window.getComputedStyle(target);

            if (isTextBox(target)) {
                cursor.style.opacity = BASE_OPACITY;
                mode = 'text';
                targetW = TEXT_CURSOR_WIDTH;
                targetH = getTextLineHeight(target);
                targetR = '0px';
                targetX = currentX;
                targetY = currentY;
            } else {
                mode = 'snap';
                targetW = rect.width;
                targetH = rect.height;
                const cssR = parseFloat(style.borderRadius) || 0;
                targetR = Math.max(cssR, 2) + 'px';
                targetX = rect.left + (rect.width / 2);
                targetY = rect.top + (rect.height / 2);
                if (hasImage(target)) isOutline = true;
                if (MOSTLY_OUTLINE && !target.classList.contains('freeze-cursor')) isOutline = true;
                if (isOutline) cursor.style.opacity = OUTLINE_OPACITY;
            }
        } else {
            cursor.style.opacity = BASE_OPACITY;
        }

        if (mode === 'snap') {
            cursor.classList.add('smooth-pos');
            clearTimeout(smoothRemoveTimer);
            smoothRemoveTimer = null;
        } else if (currentMode === 'snap' && mode !== 'snap') {
            cursor.classList.add('smooth-pos');
            if (!smoothRemoveTimer) {
                smoothRemoveTimer = setTimeout(() => {
                    cursor.classList.remove('smooth-pos');
                    smoothRemoveTimer = null;
                }, SMOOTH_DURATION);
            }
        } else if (mode === 'text') {
            cursor.classList.remove('smooth-pos');
            clearTimeout(smoothRemoveTimer);
            smoothRemoveTimer = null;
        }

        if (mode === 'text') {
            cursor.classList.add('text-mode');
            cursor.classList.remove('outline-mode');
        } else {
            cursor.classList.remove('text-mode');
            if (isOutline) cursor.classList.add('outline-mode');
            else cursor.classList.remove('outline-mode');
        }

        cursor.style.width = `${targetW}px`;
        cursor.style.height = `${targetH}px`;
        cursor.style.borderRadius = targetR;
        cursor.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;

        currentMode = mode;
        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
})();
