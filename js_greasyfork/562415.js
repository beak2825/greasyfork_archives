// ==UserScript==
// @name         Gamepad Controller
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  게임패드로 웹사이트 및 동영상을 제어합니다.
// @author       코딩 파트너
// @match        *://*.k-hentai.org/*
// @match        *://*.harpi.in/*
// @match        *://*.avsee.ru/*
// @match        *://*.com/webtoon*
// @match        *://*.kone.gg/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562415/Gamepad%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/562415/Gamepad%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const GP_BUTTON = {
        UP: 12, DOWN: 13, LEFT: 14, RIGHT: 15,
        LB: 4, LT: 6, SELECT: 8, L3: 10
    };

    const KEY_MAP = {
        LEFT:  { code: 37, name: 'ArrowLeft' },
        RIGHT: { code: 39, name: 'ArrowRight' },
        UP:    { code: 38, name: 'ArrowUp' },
        DOWN:  { code: 40, name: 'ArrowDown' }
    };

    const state = {
        isPressed: {},
        isLongPress: {},
        timers: {},
        lastStickTime: 0,
        rafId: null
    };

    const Actions = {
        sendKey: (keyData) => {
            document.dispatchEvent(new KeyboardEvent('keydown', {
                keyCode: keyData.code,
                key: keyData.name,
                bubbles: true
            }));
        },
        toggleFull: (selector) => {
            const target = selector ? document.querySelector(selector) : document.documentElement;
            if (!target) return;
            document.fullscreenElement ? document.exitFullscreen() : target.requestFullscreen();
        },
        click: (selector) => document.querySelector(selector)?.click(),
        backOrClose: () => {
            const currentUrl = window.location.href;
            if (window.history.length > 1) {
                window.history.back();
                setTimeout(() => { if (window.location.href === currentUrl) window.close(); }, 200);
            } else window.close();
        },
        video: {
            getEl: () => document.querySelector('video'),
            play: function() { const v = this.getEl(); if(v) v.paused ? v.play() : v.pause(); },
            skip: function(sec) { const v = this.getEl(); if(v) v.currentTime += sec; },
            volume: function(amt) { const v = this.getEl(); if(v) v.volume = Math.max(0, Math.min(1, v.volume + amt)); }
        }
    };

    const SITES_CONFIG = {
        'k-hentai.org': {
            scrollTarget: '#khReader',
            mappings: {
                [GP_BUTTON.LEFT]:   { run: () => Actions.sendKey(KEY_MAP.LEFT) },
                [GP_BUTTON.RIGHT]:  { run: () => Actions.sendKey(KEY_MAP.RIGHT) },
                [GP_BUTTON.LB]:      { run: () => Actions.toggleFull() },
                [GP_BUTTON.LT]:      { run: () => Actions.click('#khButtonReadMode') },
                [GP_BUTTON.SELECT]: { run: () => Actions.backOrClose() }
            }
        },
        'harpi.in': {
            mappings: {
                [GP_BUTTON.LEFT]:   { run: () => Actions.sendKey(KEY_MAP.LEFT) },
                [GP_BUTTON.RIGHT]:  { run: () => Actions.sendKey(KEY_MAP.RIGHT) },
                [GP_BUTTON.LB]:      { run: () => Actions.toggleFull() },
                [GP_BUTTON.LT]:      { run: () => Actions.click('#FloatingMenu-actions > button:nth-child(2)') },
                [GP_BUTTON.SELECT]: { run: () => Actions.backOrClose() }
            }
        },
        'avsee.ru': {
            mappings: {
                [GP_BUTTON.UP]:     { run: () => Actions.video.volume(0.1) },
                [GP_BUTTON.DOWN]:   { run: () => Actions.video.volume(-0.1) },
                [GP_BUTTON.LEFT]:   { run: () => Actions.video.skip(-5) },
                [GP_BUTTON.RIGHT]:  { run: () => Actions.video.skip(5) },
                [GP_BUTTON.LB]:      { run: () => Actions.toggleFull('#player') },
                [GP_BUTTON.LT]:      { run: () => Actions.video.play() },
                [GP_BUTTON.SELECT]: { run: () => Actions.backOrClose() }
            }
        },
        'newtoki': {
            mappings: {
                [GP_BUTTON.LEFT]:   { run: () => Actions.click('#goPrevBtn') },
                [GP_BUTTON.RIGHT]:  { run: () => Actions.click('#goNextBtn') },
                [GP_BUTTON.LB]:      { run: () => Actions.toggleFull() },
                [GP_BUTTON.SELECT]: { run: () => Actions.backOrClose() }
            }
        },
        'kone.gg': {
            mappings: {
                [GP_BUTTON.LEFT]:   { run: () => Actions.sendKey(KEY_MAP.LEFT) },
                [GP_BUTTON.RIGHT]:  { run: () => Actions.sendKey(KEY_MAP.RIGHT) },
                [GP_BUTTON.LB]:      { run: () => Actions.toggleFull() },
                [GP_BUTTON.SELECT]: { run: () => Actions.backOrClose() },
                [GP_BUTTON.LT]:      { run: () => {
                    const closeBtn = document.querySelector('button .lucide-x')?.parentElement;
                    if (closeBtn) return closeBtn.click();
                    const postImg = document.querySelector('#post_content')?.shadowRoot?.querySelector('img');
                    if (postImg) {
                        postImg.click();
                        setTimeout(() => {
                            const viewer = Array.from(document.querySelectorAll('[role="menuitem"]'))
                                                .find(el => el.textContent.includes('뷰어 열기'));
                            viewer?.click();
                        }, 150);
                    }
                }}
            }
        }
    };

    const config = Object.entries(SITES_CONFIG).find(([host]) => window.location.hostname.includes(host))?.[1];

    function handleButton(index, action, isPressed) {
        if (!action.run) return;

        if (isPressed) {
            if (!state.isPressed[index]) {
                state.isPressed[index] = true;
                state.isLongPress[index] = false;
                state.timers[index] = setTimeout(() => {
                    state.isLongPress[index] = true;
                    state.timers[index] = setInterval(() => action.run(), 200);
                }, 200);
            }
        } else {
            if (state.isPressed[index]) {
                state.isPressed[index] = false;
                if (!state.isLongPress[index]) action.run();

                const timerId = state.timers[index];
                clearTimeout(timerId); clearInterval(timerId);
                delete state.timers[index];
            }
        }
    }

    function mainLoop() {
        const gp = navigator.getGamepads()[0];
        if (!gp) return state.rafId = requestAnimationFrame(mainLoop);

        const now = Date.now();
        const axisX = gp.axes[0], axisY = gp.axes[1];

        if (Math.abs(axisX) > 0.3 && now - state.lastStickTime > 300) {
            if (Actions.video.getEl()) {
                Actions.video.skip(60 * (axisX > 0 ? 1 : -1));
                state.lastStickTime = now;
            }
        }

        if (Math.abs(axisY) > 0.15) {
            const target = config.scrollTarget ? document.querySelector(config.scrollTarget) : window;
            (target || window).scrollBy({ top: axisY * 30, behavior: 'instant' });
        }

        for (const [index, action] of Object.entries(config.mappings)) {
            handleButton(Number(index), action, gp.buttons[index].pressed);
        }

        state.rafId = requestAnimationFrame(mainLoop);
    }

    window.addEventListener('gamepadconnected', () => !state.rafId && mainLoop());
    if (navigator.getGamepads()[0]) mainLoop();
})();