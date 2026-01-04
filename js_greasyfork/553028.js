// ==UserScript==
// @name         XDcheats - Poxel.io - friendly cheats
// @namespace    xdcheats.poxel.io.friendlycheats
// @version      1.5
// @description  this cheats is not against TOS this mod will make you feel ccomfortable for you finger and much more by Xdmad or masha
// @author       Xdmad or masha
// @match        https://poxel.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553028/XDcheats%20-%20Poxelio%20-%20friendly%20cheats.user.js
// @updateURL https://update.greasyfork.org/scripts/553028/XDcheats%20-%20Poxelio%20-%20friendly%20cheats.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Variables ---
    let autoSprint = false;
    let sprintInterval = null;
    const sprintKey = 'Shift';
    const sprintCode = 'ShiftLeft';
    const sprintKeyCode = 16;

    let autoJump = false;
    let jumpInterval = null;
    const jumpKey = ' ';
    const jumpCode = 'Space';
    const jumpKeyCode = 32;

    let autoReload = false;
    let reloadInterval = null;
    const reloadKey = 'r';
    const reloadCode = 'KeyR';
    const reloadKeyCode = 82;

    const autoReloadKey = 'u';
    const autoReloadCode = 'KeyU';
    const autoReloadKeyCode = 85;

    // Anti Lag variables
    let antiLag = false;

    // --- Create Menu ---
    const menu = document.createElement('div');
    menu.id = 'xdcheats-menu';
    menu.style.position = 'fixed';
    menu.style.top = '12px';
    menu.style.left = '12px';
    menu.style.background = 'rgba(0, 0, 0, 0.7)';
    menu.style.color = '#0f0';
    menu.style.padding = '10px';
    menu.style.fontFamily = 'monospace';
    menu.style.fontSize = '14px';
    menu.style.border = '2px solid #0f0';
    menu.style.borderRadius = '8px';
    menu.style.zIndex = 99999;
    menu.style.cursor = 'default';
    menu.innerHTML = `
        <div id="xdcheats-drag" style="font-weight:bold; cursor:move; user-select:none;">XDcheats</div>
        <div>This mod is not against TOS</div>
        <div>This mod will make you feel comfortable for your little finger</div>
        <hr style="border-color:#0f0; margin: 6px 0;">
        <div><b>T</b> - Toggle Auto Sprint</div>
        <div><b>Y</b> - Toggle Auto Jump (1 ms spam)</div>
        <div><b>U</b> - Toggle Auto Reload</div>
        <div><b>R</b> - Manual Reload (single press)</div>
        <div><b>L</b> - Toggle Anti Lag</div>
        <div><b>-</b> - Show/Hide This Menu</div>
        <div id="sprint-status" style="margin-top:8px;">Auto Sprint: OFF</div>
        <div id="jump-status" style="margin-top:4px;">Auto Jump: OFF</div>
        <div id="reload-status" style="margin-top:4px;">Auto Reload: OFF</div>
        <div id="antilag-status" style="margin-top:4px;">Anti Lag: OFF</div>
    `;
    document.body.appendChild(menu);

    // --- Drag Logic ---
    const dragHandle = document.getElementById('xdcheats-drag');
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - menu.getBoundingClientRect().left;
        offsetY = e.clientY - menu.getBoundingClientRect().top;
        document.body.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            menu.style.left = (e.clientX - offsetX) + 'px';
            menu.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = '';
    });

    // --- Helper to dispatch keyboard events ---
    function dispatchKeyEvent(type, key, code, keyCode) {
        const target = document.querySelector('canvas') || window;
        const event = new KeyboardEvent(type, {
            key,
            code,
            keyCode,
            which: keyCode,
            bubbles: true,
            cancelable: true
        });
        try {
            Object.defineProperty(event, 'keyCode', { get: () => keyCode });
            Object.defineProperty(event, 'which', { get: () => keyCode });
        } catch (e) {}
        target.dispatchEvent(event);
    }

    // --- Auto Sprint ---
    function updateSprintStatus() {
        const status = document.getElementById('sprint-status');
        if (status) status.textContent = `Auto Sprint: ${autoSprint ? 'ON' : 'OFF'}`;
    }
    function startAutoSprint() {
        if (autoSprint) return;
        autoSprint = true;
        dispatchKeyEvent('keydown', sprintKey, sprintCode, sprintKeyCode);
        sprintInterval = setInterval(() => {
            dispatchKeyEvent('keydown', sprintKey, sprintCode, sprintKeyCode);
        }, 150);
        updateSprintStatus();
    }
    function stopAutoSprint() {
        if (!autoSprint) return;
        autoSprint = false;
        clearInterval(sprintInterval);
        sprintInterval = null;
        dispatchKeyEvent('keyup', sprintKey, sprintCode, sprintKeyCode);
        updateSprintStatus();
    }

    // --- Auto Jump ---
    function updateJumpStatus() {
        const status = document.getElementById('jump-status');
        if (status) status.textContent = `Auto Jump: ${autoJump ? 'ON' : 'OFF'}`;
    }
    function startAutoJump() {
        if (autoJump) return;
        autoJump = true;
        dispatchKeyEvent('keydown', jumpKey, jumpCode, jumpKeyCode);
        jumpInterval = setInterval(() => {
            dispatchKeyEvent('keydown', jumpKey, jumpCode, jumpKeyCode);
            dispatchKeyEvent('keyup', jumpKey, jumpCode, jumpKeyCode);
        }, 1);
        updateJumpStatus();
    }
    function stopAutoJump() {
        if (!autoJump) return;
        autoJump = false;
        clearInterval(jumpInterval);
        jumpInterval = null;
        dispatchKeyEvent('keyup', jumpKey, jumpCode, jumpKeyCode);
        updateJumpStatus();
    }

    // --- Auto Reload ---
    function updateReloadStatus() {
        const status = document.getElementById('reload-status');
        if (status) status.textContent = `Auto Reload: ${autoReload ? 'ON' : 'OFF'}`;
    }
    function startAutoReload() {
        if (autoReload) return;
        autoReload = true;
        reloadInterval = setInterval(() => {
            dispatchKeyEvent('keydown', reloadKey, reloadCode, reloadKeyCode);
            dispatchKeyEvent('keyup', reloadKey, reloadCode, reloadKeyCode);
        }, 500);
        updateReloadStatus();
    }
    function stopAutoReload() {
        if (!autoReload) return;
        autoReload = false;
        clearInterval(reloadInterval);
        reloadInterval = null;
        dispatchKeyEvent('keyup', reloadKey, reloadCode, reloadKeyCode);
        updateReloadStatus();
    }
    // --- Manual Reload ---
    function manualReload() {
        dispatchKeyEvent('keydown', reloadKey, reloadCode, reloadKeyCode);
        dispatchKeyEvent('keyup', reloadKey, reloadCode, reloadKeyCode);
    }

    // --- Anti Lag ---
    function updateAntiLagStatus() {
        const status = document.getElementById('antilag-status');
        if (status) status.textContent = `Anti Lag: ${antiLag ? 'ON' : 'OFF'}`;
    }
    function startAntiLag() {
        if (antiLag) return;
        antiLag = true;
        const style = document.createElement('style');
        style.id = 'anti-lag-style';
        style.textContent = `
            .particles, .effects, .animations {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.style.imageRendering = 'pixelated';
            canvas.style.width = '75%';
            canvas.style.height = '75%';
        }
        updateAntiLagStatus();
    }
    function stopAntiLag() {
        if (!antiLag) return;
        antiLag = false;
        const style = document.getElementById('anti-lag-style');
        if (style) style.remove();
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.style.width = '';
            canvas.style.height = '';
            canvas.style.imageRendering = '';
        }
        updateAntiLagStatus();
    }

    // --- Keybinds ---
    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyT') {
            autoSprint ? stopAutoSprint() : startAutoSprint();
        }
        if (e.code === 'KeyY') {
            autoJump ? stopAutoJump() : startAutoJump();
        }
        if (e.code === 'KeyU') {
            autoReload ? stopAutoReload() : startAutoReload();
        }
        if (e.code === 'KeyR') {
            manualReload();
        }
        if (e.code === 'KeyL') {
            antiLag ? stopAntiLag() : startAntiLag();
        }
        if (e.key === '-' || e.code === 'Minus') {
            menu.style.display = (menu.style.display === 'none') ? 'block' : 'none';
        }
    });

    // --- Clean up on unload ---
    window.addEventListener('beforeunload', () => {
        stopAutoSprint();
        stopAutoJump();
        stopAutoReload();
        stopAntiLag();
    });

})();
