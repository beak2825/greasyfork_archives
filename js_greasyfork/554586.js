// ==UserScript==
// @name         Universal Video Temp Speed + Double-Tap 6×/4×
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Double-tap , → 6× | Double-tap . → 4× | Hold , → 3× | Hold . → 2× | Full-screen OK
// @author       LGJA
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554586/Universal%20Video%20Temp%20Speed%20%2B%20Double-Tap%206%C3%974%C3%97.user.js
// @updateURL https://update.greasyfork.org/scripts/554586/Universal%20Video%20Temp%20Speed%20%2B%20Double-Tap%206%C3%974%C3%97.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        MIN_SPEED: 0.10,
        MAX_SPEED: 16.0,
        SENSITIVITY: 150,
        TEMP_3X: 3.0,     // Hold ,
        TEMP_2X: 2.0,     // Hold .
        DOUBLE_6X: 6.0,   // Double-tap ,
        DOUBLE_4X: 4.0    // Double-tap .
    };

    let isDragging = false;
    let isTempSpeed = false;
    let originalSpeed = 1;
    let startX = 0;
    let startSpeed = 1;
    let lastTap = 0;
    let holdTimeout = null;
    let customSpeed = 1;
    let isHolding = false;
    let tempKey = null;
    let lastKey = null;
    let tapCount = 0;
    let doubleTapTimer = null;
    let badge = null;

    function getVideo() {
        return document.querySelector('video');
    }

    function getContainer() {
        const video = getVideo();
        if (!video) return null;
        return video.closest('div, section, [class*="player"], [class*="container"]') || document.body;
    }

    function ensureBadge() {
        if (badge) return badge;
        badge = document.createElement('div');
        badge.id = 'universal-speed-badge';
        Object.assign(badge.style, {
            position: 'fixed',
            top: '2%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.05)',
            color: '#fff',
            font: '500 14px/1 "YouTube Noto", Roboto, Arial, sans-serif',
            padding: '6px 12px',
            borderRadius: '4px',
            zIndex: '2147483647',
            pointerEvents: 'none',
            opacity: '0',
            transition: 'opacity 0.15s ease',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        });
        return badge;
    }

    function showBadge(speed) {
        ensureBadge();
        updateBadgeParent();

        const display = speed === CONFIG.DOUBLE_6X ? '6×' :
                       speed === CONFIG.DOUBLE_4X ? '4×' :
                       speed === CONFIG.TEMP_3X ? '3×' :
                       speed === CONFIG.TEMP_2X ? '2×' :
                       `${speed.toFixed(1)}×`;

        badge.textContent = display;
        badge.style.opacity = '1';
    }

    function hideBadge() {
        if (badge) badge.style.opacity = '0';
    }

    function updateBadgeParent() {
        if (!badge) return;
        const container = getContainer();
        if (container && badge.parentElement !== container) {
            container.appendChild(badge);
        }
    }

    function setSpeed(speed) {
        const video = getVideo();
        if (!video) return;
        speed = Math.max(CONFIG.MIN_SPEED, Math.min(CONFIG.MAX_SPEED, speed));
        video.playbackRate = speed;
        if (isTempSpeed) showBadge(speed);
    }

    // ——— TEMP SPEED CONTROL ———
    const startTempSpeed = (multiplier) => {
        const video = getVideo();
        if (!video || isTempSpeed) return;
        originalSpeed = video.playbackRate;
        isTempSpeed = true;
        setSpeed(originalSpeed * multiplier);
    };

    const endTempSpeed = () => {
        if (!isTempSpeed) return;
        isTempSpeed = false;
        setSpeed(originalSpeed);
        hideBadge();
    };

    // ——— KEY HANDLING WITH DOUBLE-TAP ———
    const onKeyDown = (e) => {
        if (isEditable(document.activeElement) || isDragging) return;
        const video = getVideo();
        if (!video) return;

        const now = Date.now();
        const key = e.key;

        if (key === ',' || key === '.') {
            e.preventDefault();

            // Double-tap detection
            if (lastKey === key && now - lastTap < 300) {
                tapCount++;
                clearTimeout(doubleTapTimer);
            } else {
                tapCount = 1;
                lastKey = key;
            }

            lastTap = now;

            doubleTapTimer = setTimeout(() => {
                if (tapCount >= 2) {
                    // DOUBLE-TAP: 6× or 4×
                    tempKey = null;
                    if (key === ',') {
                        startTempSpeed(CONFIG.DOUBLE_6X);
                    } else if (key === '.') {
                        startTempSpeed(CONFIG.DOUBLE_4X);
                    }
                } else {
                    // SINGLE PRESS & HOLD: 3× or 2×
                    if (!tempKey) {
                        tempKey = key;
                        if (key === ',') {
                            startTempSpeed(CONFIG.TEMP_3X);
                        } else if (key === '.') {
                            startTempSpeed(CONFIG.TEMP_2X);
                        }
                    }
                }
                tapCount = 0;
            }, 300);
        }
    };

    const onKeyUp = (e) => {
        if (e.key === ',' || e.key === '.') {
            if (tempKey === e.key || (tapCount >= 2 && lastKey === e.key)) {
                endTempSpeed();
                tempKey = null;
                clearTimeout(doubleTapTimer);
                tapCount = 0;
            }
        }
    };

    // ——— DRAG TO SET SPEED ———
    const onMouseDown = e => {
        const video = getVideo();
        if (!video || isTempSpeed) return;
        const container = e.target.closest('video') || e.target.closest('div, section, [class*="player"]');
        if (!container || !container.querySelector('video')) return;

        const now = Date.now();
        if (now - lastTap < 300) {
            isDragging = true;
            startX = e.clientX;
            startSpeed = video.playbackRate;
            customSpeed = startSpeed * 2;
            holdTimeout = setTimeout(() => {
                isHolding = true;
                setSpeed(customSpeed);
            }, 400);
            e.preventDefault();
        } else {
            isDragging = true;
            startX = e.clientX;
            startSpeed = video.playbackRate;
        }
        lastTap = now;
    };

    const onMouseMove = e => {
        if (!isDragging || isTempSpeed) return;
        const delta = e.clientX - startX;
        let newSpeed = startSpeed + delta / CONFIG.SENSITIVITY;
        newSpeed = Math.max(CONFIG.MIN_SPEED, Math.min(CONFIG.MAX_SPEED, newSpeed));
        if (isHolding) customSpeed = newSpeed;
        else setSpeed(newSpeed);
    };

    const onMouseUp = () => {
        if (isDragging && holdTimeout) clearTimeout(holdTimeout);
        isDragging = false;
        isHolding = false;
    };

    // ——— INPUT DETECTION ———
    const isEditable = el => {
        if (!el) return false;
        const tag = el.tagName?.toUpperCase();
        return (tag === 'INPUT' && !['checkbox', 'radio'].includes(el.type)) ||
               tag === 'TEXTAREA' ||
               el.isContentEditable;
    };

    // ——— EVENT LISTENERS ———
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('keyup', onKeyUp, true);
    document.addEventListener('mousedown', onMouseDown, true);
    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('mouseup', onMouseUp, true);

    // ——— FULL-SCREEN & DOM OBSERVER ———
    const observer = new MutationObserver(updateBadgeParent);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('fullscreenchange', () => {
        setTimeout(updateBadgeParent, 100);
    });

    // Initial setup
    ensureBadge();
    updateBadgeParent();

})();