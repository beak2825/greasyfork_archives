// ==UserScript==
// @name         scroll-button
// @namespace    https://github.com/livinginpurple
// @version      20260114.13
// @description  scroll-button (Draggable, Auto-Fade, Bright-on-Stop)
// @license      WTFPL
// @author       livinginpurple
// @include      *
// @exclude      *://www.plurk.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559207/scroll-button.user.js
// @updateURL https://update.greasyfork.org/scripts/559207/scroll-button.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const btnId = 'gamma-scroll-btn';
    if (document.getElementById(btnId)) return;

    // --- Helpers ---
    const ns = 'http://www.w3.org/2000/svg';
    const createSVG = (pathData, fillRule) => {
        const svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('viewBox', '0 0 16 16');
        const path = document.createElementNS(ns, 'path');
        path.setAttribute('d', pathData);
        if (fillRule) path.setAttribute('fill-rule', fillRule);
        svg.appendChild(path);
        return svg;
    };

    const getScrollDetails = (scroller) => {
        const isWin = scroller === window || scroller === document || scroller === document.documentElement || scroller === document.body;
        return {
            top: isWin ? window.scrollY : scroller.scrollTop,
            height: isWin ? document.documentElement.scrollHeight : scroller.scrollHeight,
            target: isWin ? window : scroller
        };
    };

    // --- Elements ---
    const style = document.createElement('style');
    style.textContent = `
        #${btnId} { position: fixed; right: 20px; bottom: 20px; width: 40px; height: 40px; border-radius: 50%; border: none; box-shadow: 0 0.2rem 0.5rem rgba(0,0,0,0.3); z-index: 10000; cursor: grab; display: flex; justify-content: center; align-items: center; transition: opacity 0.5s, transform 0.1s, background-color 0.2s; touch-action: none; padding: 0; background-color: rgba(33, 37, 41, 0.9); color: #fff; opacity: 0.3; }
        #${btnId} svg { width: 20px; height: 20px; fill: currentColor; }
        #${btnId}:hover, #${btnId}.is-dragging { background-color: #000; transform: scale(1.1); }
        @media (prefers-color-scheme: dark) {
            #${btnId} { background-color: rgba(240, 240, 240, 0.9); color: #000; border: 1px solid rgba(0,0,0,0.1); }
            #${btnId}:hover, #${btnId}.is-dragging { background-color: #fff; }
        }
        #gamma-trash-zone { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; border-radius: 50%; background-color: rgba(0, 0, 0, 0.5); color: #fff; display: flex; justify-content: center; align-items: center; z-index: 9999; opacity: 0; pointer-events: none; transition: opacity 0.3s, transform 0.2s, background-color 0.2s; }
        #gamma-trash-zone.visible { opacity: 1; }
        #gamma-trash-zone.active { transform: translate(-50%, -50%) scale(1.2); background-color: rgba(220, 53, 69, 0.9); }
        #gamma-trash-zone svg { width: 24px; height: 24px; fill: currentColor; }
    `;
    document.head.appendChild(style);

    const icons = {
        up: createSVG('M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z', 'evenodd'),
        down: createSVG('M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z', 'evenodd'),
        trash: createSVG('M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z')
    };

    const btn = document.createElement('button');
    btn.id = btnId;
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Scroll navigation');
    document.body.appendChild(btn);

    const trashZone = document.createElement('div');
    trashZone.id = 'gamma-trash-zone';
    trashZone.appendChild(icons.trash.cloneNode(true));
    document.body.appendChild(trashZone);

    // --- State ---
    let activeScroller = window;
    let stopTimer, fadeTimer;
    let isPressed = false, isDragging = false;
    let startX, startY, offsetX, offsetY;

    const wakeUp = (permanent = false) => {
        btn.style.opacity = '1';
        clearTimeout(stopTimer);
        clearTimeout(fadeTimer);
        if (!permanent) fadeTimer = setTimeout(() => btn.style.opacity = '0.3', 3000);
    };

    const updateIcon = () => {
        const { top } = getScrollDetails(activeScroller);
        const state = top < 50 ? 'top' : 'scrolled';
        if (btn.dataset.state === state) return;
        btn.dataset.state = state;
        btn.replaceChildren(icons[state === 'top' ? 'down' : 'up'].cloneNode(true));
    };

    // --- Handlers ---
    const handleScroll = (e) => {
        activeScroller = (e.target && e.target !== document) ? e.target : window;
        btn.style.opacity = '0.3';
        updateIcon();
        clearTimeout(stopTimer);
        clearTimeout(fadeTimer);
        stopTimer = setTimeout(wakeUp, 150);
    };

    const onMove = (e) => {
        if (!isPressed) return;
        const pointer = e.type.includes('touch') ? e.touches[0] : e;
        const dist = Math.hypot(pointer.clientX - startX, pointer.clientY - startY);

        if (!isDragging && dist > 10) {
            isDragging = true;
            const rect = btn.getBoundingClientRect();
            btn.style.left = rect.left + 'px';
            btn.style.top = rect.top + 'px';
            btn.style.right = btn.style.bottom = 'auto';
            trashZone.classList.add('visible');
        }

        if (isDragging) {
            const x = Math.max(0, Math.min(pointer.clientX - offsetX, window.innerWidth - 40));
            const y = Math.max(0, Math.min(pointer.clientY - offsetY, window.innerHeight - 40));
            btn.style.left = x + 'px';
            btn.style.top = y + 'px';

            const inTrash = Math.hypot(window.innerWidth / 2 - (x + 20), window.innerHeight / 2 - (y + 20)) < 80;
            trashZone.classList.toggle('active', inTrash);
            btn.style.opacity = inTrash ? '0.5' : '1';
            wakeUp(true);
        }
    };

    const onEnd = () => {
        if (trashZone.classList.contains('active')) {
            window.removeEventListener('scroll', handleScroll, { capture: true });
            btn.remove();
            trashZone.remove();
        } else {
            isPressed = isDragging = false;
            btn.classList.remove('is-dragging');
            trashZone.classList.remove('visible', 'active');
            wakeUp();
        }
    };

    // --- Init ---
    btn.addEventListener('mousedown', (e) => {
        isPressed = true; startX = e.clientX; startY = e.clientY;
        const rect = btn.getBoundingClientRect();
        offsetX = e.clientX - rect.left; offsetY = e.clientY - rect.top;
        btn.classList.add('is-dragging');
        wakeUp();
    });

    btn.addEventListener('touchstart', (e) => {
        isPressed = true; startX = e.touches[0].clientX; startY = e.touches[0].clientY;
        const rect = btn.getBoundingClientRect();
        offsetX = e.touches[0].clientX - rect.left; offsetY = e.touches[0].clientY - rect.top;
        btn.classList.add('is-dragging');
        wakeUp();
    }, { passive: false });

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);

    btn.addEventListener('click', (e) => {
        if (isDragging) return (isDragging = false);
        const { height, target } = getScrollDetails(activeScroller);
        target.scrollTo({ top: btn.dataset.state === 'top' ? height : 0, behavior: 'smooth' });
        wakeUp();
        btn.blur();
    });

    btn.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
        }
    });

    btn.onmouseenter = () => wakeUp();
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    updateIcon();
})();