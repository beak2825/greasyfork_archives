// ==UserScript==
// @name         TikTok Video Speed Controller
// @name:en         TikTok Video Speed Controller
// @description  Adds an overlay and keyboard shortcuts to control TikTok web video playback speed.
// @description:en  Adds an overlay and keyboard shortcuts to control TikTok web video playback speed.
// @namespace    https://github.com/collin602
// @license      MIT
// @author       collin602
// @run-at       document-idle
// @grant        none
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @match        https://www.tiktok.com/*
// @version 0.0.1.20260119151428
// @downloadURL https://update.greasyfork.org/scripts/563253/TikTok%20Video%20Speed%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/563253/TikTok%20Video%20Speed%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SPEED_INCREMENT = 0.5;
    const MAX_SPEED = 4.0;
    const MIN_SPEED = 0.5;
    const PRESETS = [0.5, 1.0, 1.5, 2.0, 3.0];
    const STORAGE_KEY = 'tiktokSpeedController.rate';

    const getStoredSpeed = () => {
        const v = parseFloat(localStorage.getItem(STORAGE_KEY));
        return Number.isFinite(v) ? v : 1.0;
    };
    const storeSpeed = (rate) => {
        try { localStorage.setItem(STORAGE_KEY, String(rate)); } catch {}
    };

    let currentSpeed = getStoredSpeed();

    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '60px',
        left: '300px',
        zIndex: '999999',
        backgroundColor: 'rgba(22, 24, 35, 0.9)',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        fontFamily: 'ProximaNova, Arial, sans-serif',
        fontSize: '14px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        userSelect: 'none',
        backdropFilter: 'blur(4px)'
    });

    const label = document.createElement('div');
    label.textContent = `Speed: ${currentSpeed}x`;
    label.style.fontWeight = '700';
    label.style.textAlign = 'center';
    label.style.marginBottom = '4px';

    const btnContainer = document.createElement('div');
    Object.assign(btnContainer.style, {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px'
    });

    overlay.appendChild(label);
    overlay.appendChild(btnContainer);
    document.documentElement.appendChild(overlay);

    const getVideos = () => document.querySelectorAll('video');

    const applySpeed = (speed) => {
        const clamped = Math.min(Math.max(speed, MIN_SPEED), MAX_SPEED);
        currentSpeed = clamped;
        label.textContent = `Speed: ${currentSpeed}x`;
        storeSpeed(currentSpeed);

        getVideos().forEach(v => {
            if (v && typeof v.playbackRate === 'number') {
                v.playbackRate = currentSpeed;
            }
        });
    };

    // Create buttons
    PRESETS.forEach(speed => {
        const btn = document.createElement('button');
        btn.textContent = `${speed}x`;
        Object.assign(btn.style, {
            cursor: 'pointer',
            border: 'none',
            backgroundColor: '#fe2c55', // TikTok Brand Red
            color: 'white',
            padding: '6px',
            borderRadius: '4px',
            fontWeight: '600',
            fontSize: '12px'
        });

        btn.addEventListener('mouseover', () => { btn.style.opacity = '0.85'; });
        btn.addEventListener('mouseout', () => { btn.style.opacity = '1.0'; });
        btn.addEventListener('click', () => applySpeed(speed));
        btnContainer.appendChild(btn);
    });

    document.addEventListener('keydown', (e) => {
        const el = document.activeElement;
        if (!el) return;
        const tag = el.tagName ? el.tagName.toUpperCase() : '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || (el.isContentEditable === true)) return;

        switch (e.key.toLowerCase()) {
            case 'd':
                applySpeed(currentSpeed + SPEED_INCREMENT);
                break;
            case 's':
                applySpeed(currentSpeed - SPEED_INCREMENT);
                break;
            case 'r':
                applySpeed(1.0);
                break;
        }
    });

    const observer = new MutationObserver(() => {
        getVideos().forEach(v => {
            if (v.playbackRate !== currentSpeed) v.playbackRate = currentSpeed;
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const intervalId = setInterval(() => {
        getVideos().forEach(v => {
            if (!v.paused && v.playbackRate !== currentSpeed) {
                v.playbackRate = currentSpeed;
            }
        });
    }, 1000);

    window.addEventListener('beforeunload', () => {
        try { observer.disconnect(); } catch {}
        try { clearInterval(intervalId); } catch {}
    });

    applySpeed(currentSpeed);
})();