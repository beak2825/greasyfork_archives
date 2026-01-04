// ==UserScript==
// @name         Kick Lock Quality & Auto-Resume 🎥
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Aggressively forces the Kick player to maintain your chosen quality (e.g. 720p60) across new video loads and prevents it from reverting to "Auto".
// @author       Beatworld
// @match        https://kick.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560938/Kick%20Lock%20Quality%20%20Auto-Resume%20%F0%9F%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/560938/Kick%20Lock%20Quality%20%20Auto-Resume%20%F0%9F%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const PREF_KEY = 'kick_quality_preference_v6';
    const KICK_INTERNAL_KEY = 'stream_quality';
    const RESUME_PREFIX = 'kick_resume_v2_';

    // Kick stores qualities as strings: "1080", "720", "480", "360", "160"
    // "Auto" usually removes the key or sets it to null/undefined.
    const VALID_QUALITIES = ['1080', '720', '480', '360', '160'];

    // --- MODULE 1: THE QUALITY ENFORCER ---

    function syncQuality() {
        const currentInternal = localStorage.getItem(KICK_INTERNAL_KEY);
        const savedPref = GM_getValue(PREF_KEY, null);

        // 1. SPY: Detect if USER changed to a specific resolution
        // If the current internal value is a valid number (e.g., "720") and different from our save,
        // it means the user likely clicked the menu. We update our "Master" preference.
        if (VALID_QUALITIES.includes(currentInternal)) {
            if (currentInternal !== savedPref) {
                GM_setValue(PREF_KEY, currentInternal);
                console.log(`[Kick Enforcer] Preference updated by user: ${currentInternal}`);
            }
        }

        // 2. FORCE: If Player reverted to Auto (null/invalid), force our preference back
        // This fixes the issue where a new video loads as "Auto"
        if (savedPref) {
            // If the key is missing (Auto) OR it's different but not a valid user-selection (rare edge case)
            // We force it back to what the user wants.
            if (!currentInternal || !VALID_QUALITIES.includes(currentInternal)) {
                localStorage.setItem(KICK_INTERNAL_KEY, savedPref);
                // We also dispatch a storage event to try and notify the tab
                window.dispatchEvent(new Event("storage"));
                console.log(`[Kick Enforcer] Player tried to set Auto. Forcing quality back to: ${savedPref}`);
            }
        }
    }

    // --- MODULE 2: RESUME FUNCTIONALITY (Preserved) ---

    let currentVideoPath = null;
    let saveInterval = null;
    let restoreInterval = null;

    function getVideoElement() { return document.querySelector('video'); }
    function getKey() { return window.location.pathname; }

    function saveProgress() {
        const video = getVideoElement();
        const key = getKey();
        if (!video || !key || video.paused || video.currentTime < 5) return;
        const data = { pos: video.currentTime, ts: Date.now() };
        localStorage.setItem(RESUME_PREFIX + key, JSON.stringify(data));
    }

    function restoreProgress() {
        const key = getKey();
        const saved = localStorage.getItem(RESUME_PREFIX + key);
        if (!saved) return;
        try {
            const data = JSON.parse(saved);
            const video = getVideoElement();
            if (!video) return;
            if (Math.abs(video.currentTime - data.pos) > 5) {
                video.currentTime = data.pos;
                console.log(`[Kick Enforcer] Resumed video at ${data.pos}s`);
            }
        } catch (e) {}
    }

    function handleNavigation() {
        const newPath = window.location.pathname;
        if (newPath === currentVideoPath) return;
        currentVideoPath = newPath;

        console.log("[Kick Enforcer] New video detected. Resetting enforcer...");

        // IMMEDIATELY Force quality on navigation (before player loads)
        const savedPref = GM_getValue(PREF_KEY, null);
        if (savedPref) {
            localStorage.setItem(KICK_INTERNAL_KEY, savedPref);
        }

        // Manage intervals
        if (saveInterval) clearInterval(saveInterval);
        if (restoreInterval) clearInterval(restoreInterval);

        // Try to restore position for 10 seconds
        let attempts = 0;
        restoreInterval = setInterval(() => {
            restoreProgress();
            attempts++;
            if (attempts > 20) clearInterval(restoreInterval);
        }, 500);

        saveInterval = setInterval(saveProgress, 5000);
    }

    // --- INITIALIZATION ---

    // 1. The Loop: Run constantly to catch the player reverting to Auto
    setInterval(syncQuality, 500);

    // 2. Navigation Hooks: Handle single-page-app navigation
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        handleNavigation();
    };
    window.addEventListener('popstate', handleNavigation);

    // 3. Startup
    handleNavigation();
    // Extra kick for fast loaders
    setTimeout(syncQuality, 100);

})();