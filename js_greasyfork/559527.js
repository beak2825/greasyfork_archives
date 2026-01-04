// ==UserScript==
// @name         Christmas Town Mobile Joystick
// @namespace    torn.ct.pda.fulljoystick
// @version      2.1
// @description  SPA-safe Christmas Town joystick with movable and toggleable joystick
// @match        https://www.torn.com/christmas_town.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559527/Christmas%20Town%20Mobile%20Joystick.user.js
// @updateURL https://update.greasyfork.org/scripts/559527/Christmas%20Town%20Mobile%20Joystick.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const size = 120;
    const deadZone = 20;
    let intervals = {};
    let joystickEnabled = true;
    let joystickMovable = false;
    let activeTouchId = null;
    let dragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    // Remove existing joysticks/buttons from previous loads
    document.querySelectorAll('.ct-mobile-joystick, .ct-mobile-toggle, .ct-mobile-move').forEach(el => el.remove());

    // Create joystick
    const joystick = document.createElement('div');
    joystick.className = 'ct-mobile-joystick';
    joystick.style.cssText = `
        position: fixed;
        bottom: 90px;
        left: 50%;
        transform: translateX(-50%);
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(0,0,0,0.45);
        z-index: 99999;
        touch-action: none;
    `;

    const stick = document.createElement('div');
    stick.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        width: 44px;
        height: 44px;
        margin-left: -22px;
        margin-top: -22px;
        border-radius: 50%;
        background: rgba(255,255,255,0.8);
    `;
    joystick.appendChild(stick);
    document.body.appendChild(joystick);

    // Visibility toggle button
    const toggleBtn = document.createElement('div');
    toggleBtn.className = 'ct-mobile-toggle';
    toggleBtn.textContent = 'X';
    toggleBtn.style.cssText = `
        position: fixed;
        left: 10px;
        bottom: ${90 + size / 2 - 15}px;
        width: 30px;
        height: 30px;
        background: rgba(0,0,0,0.7);
        color: white;
        font-size: 18px;
        text-align: center;
        line-height: 30px;
        border-radius: 6px;
        z-index: 100000;
        user-select: none;
        cursor: pointer;
        font-family: system-ui, sans-serif;
    `;
    document.body.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', () => {
        joystickEnabled = !joystickEnabled;
        joystick.style.display = joystickEnabled ? 'block' : 'none';
        if (!joystickEnabled) {
            ['ArrowRight','ArrowLeft','ArrowUp','ArrowDown'].forEach(dir => {
                if (intervals[dir]) clearInterval(intervals[dir]);
                intervals[dir] = null;
            });
        }
    });

    // Move joystick toggle button
    const moveBtn = document.createElement('div');
    moveBtn.className = 'ct-mobile-move';
    moveBtn.textContent = '+';
    moveBtn.style.cssText = `
        position: fixed;
        left: 10px;
        bottom: ${90 + size / 2 - 15 - 40}px;
        width: 30px;
        height: 30px;
        background: rgba(0,0,0,0.7);
        color: white;
        font-size: 18px;
        text-align: center;
        line-height: 30px;
        border-radius: 6px;
        z-index: 100000;
        user-select: none;
        cursor: pointer;
        font-family: system-ui, sans-serif;
    `;
    document.body.appendChild(moveBtn);

    moveBtn.addEventListener('click', () => {
        joystickMovable = !joystickMovable;
        moveBtn.style.background = joystickMovable ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';
    });

    // Keyboard handling
    function sendKey(type, key) {
        const keyCodeMap = { ArrowRight: 39, ArrowLeft: 37, ArrowUp: 38, ArrowDown: 40 };
        const ev = new KeyboardEvent(type, {
            key: key,
            code: key,
            keyCode: keyCodeMap[key],
            which: keyCodeMap[key],
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(ev);
    }

    function startHold(dir) {
        if (!joystickEnabled || intervals[dir]) return;
        intervals[dir] = setInterval(() => sendKey('keydown', dir), 80);
        sendKey('keydown', dir);
    }

    function stopHold(dir) {
        if (!intervals[dir]) return;
        clearInterval(intervals[dir]);
        intervals[dir] = null;
        sendKey('keyup', dir);
    }

    function updateDirection(dx, dy) {
        if (!joystickEnabled) return;
        if (dx > deadZone) startHold('ArrowRight'); else stopHold('ArrowRight');
        if (dx < -deadZone) startHold('ArrowLeft'); else stopHold('ArrowLeft');
        if (dy < -deadZone) startHold('ArrowUp'); else stopHold('ArrowUp');
        if (dy > deadZone) startHold('ArrowDown'); else stopHold('ArrowDown');
    }

    // Unified touch handling
    joystick.addEventListener('touchstart', e => {
        const touch = e.changedTouches[0];
        if (activeTouchId !== null) return; // only one touch
        activeTouchId = touch.identifier;

        if (joystickMovable) {
            dragging = true;
            const rect = joystick.getBoundingClientRect();
            dragOffsetX = touch.clientX - rect.left;
            dragOffsetY = touch.clientY - rect.top;
        }

        e.preventDefault();
    }, { passive: false });

    joystick.addEventListener('touchmove', e => {
        if (activeTouchId === null) return;

        const touch = Array.from(e.changedTouches).find(t => t.identifier === activeTouchId);
        if (!touch) return;

        if (dragging) {
            joystick.style.left = `${touch.clientX - dragOffsetX}px`;
            joystick.style.top = `${touch.clientY - dragOffsetY}px`;
            joystick.style.bottom = 'auto';
            joystick.style.transform = 'translate(0,0)';
            e.preventDefault();
            return; // skip directional movement while dragging
        }

        if (!joystickEnabled) return;

        const r = joystick.getBoundingClientRect();
        const dx = touch.clientX - (r.left + r.width / 2);
        const dy = touch.clientY - (r.top + r.height / 2);
        stick.style.transform = `translate(${dx * 0.4}px, ${dy * 0.4}px)`;
        updateDirection(dx, dy);
    }, { passive: false });

    joystick.addEventListener('touchend', e => {
        if (activeTouchId === null) return;

        const touch = Array.from(e.changedTouches).find(t => t.identifier === activeTouchId);
        if (!touch) return;

        if (!dragging) stick.style.transform = 'translate(0,0)';
        ['ArrowRight','ArrowLeft','ArrowUp','ArrowDown'].forEach(stopHold);

        dragging = false;
        activeTouchId = null;
    });

})();
