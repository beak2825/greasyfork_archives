// ==UserScript==
// @name         Gpop.io Autoplayer
// @locale
// @namespace    http://tampermonkey.net/
// @author       find
// @description a cool thing
// @match        https://gpop.io/play/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @version 1.0.0
// @downloadURL https://update.greasyfork.org/scripts/552093/Gpopio%20Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/552093/Gpopio%20Autoplayer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🎯 TIMING CONSTANTS: TWEAK THIS FOR PERFECTION!
    // The perfect value is system-dependent. Adjust by +/- 0.001 until you get 'Perfect' hits.
    const AUTOPLAYER_INTERVAL = 1;
    const HIT_OFFSET = -0.011;
    const HIT_WINDOW_PAST = 0.051;

    console.log("Gpop.io Autoplayer v1.4.0 (Zero-Miss Candidate) injected...");

    let autoplayerLoop = null;
    let isAutoplayerOn = false;
    let game_object_found = false;
    const toggleButton = document.createElement('button');

    // ⭐ NEW: Map to track key and release time for actively held notes
    const activeHolds = new Map();

    function cleanupNoteState() {
        if (typeof window._$W === 'undefined' || !window._$W._$2n) return;

        // Clear active holds on cleanup to prevent issues on reset
        activeHolds.clear();

        for (const note of window._$W._$2n) {
            if (note.handledByBot) delete note.handledByBot;
        }
        console.log("Autoplayer state cleaned.");
    }

    function stopAutoplayer() {
        if (!isAutoplayerOn) return;
        clearInterval(autoplayerLoop);
        autoplayerLoop = null;
        isAutoplayerOn = false;
        activeHolds.clear(); // Ensure holds are cleared on manual stop
        toggleButton.textContent = 'Autoplayer OFF';
        toggleButton.style.backgroundColor = '#f44336';
        console.log("Autoplayer stopped.");
    }

    function startAutoplayer() {
        if (isAutoplayerOn) return;
        cleanupNoteState(); // Clears note states AND the activeHolds map

        autoplayerLoop = setInterval(() => {
            if (typeof window._$W === 'undefined' || window._$W === null) return;

            const currentTime = window._$W._$ad();
            if (typeof currentTime !== 'number') return;

            const activeNotes = window._$W._$2n;
            if (!activeNotes || !Array.isArray(activeNotes)) return;

            // --- 1. Check for NEW notes to PRESS (Tap or Start of Hold) ---
            for (const note of activeNotes) {
                const noteData = note.notedata;

                // Skip if no data, already hit/processed (_$aP), or handled by this bot instance
                if (!noteData || noteData._$aP || note.handledByBot) {
                    continue;
                }

                const noteTime = noteData.time;
                const noteKey = noteData.key;
                const noteType = noteData.type;

                // Check if the note is within the hittable window
                const isHittable = (currentTime >= noteTime + HIT_OFFSET) && (currentTime <= noteTime + HIT_WINDOW_PAST);

                if (isHittable) {
                    note.handledByBot = true;
                    window._$W._$q(noteKey); // Press the key

                    if (noteType === 0) { // Standard Tap Note
                        window._$W._$9B(noteKey); // Immediately release
                    } else if (noteType === 1) { // Hold Note
                        // ⭐ NEW: Calculate the precise release time and track it
                        const releaseTime = noteTime + noteData._$ak;
                        activeHolds.set(noteKey, { releaseTime, note });
                    }
                }
            }

            // --- 2. Check for ACTIVE holds to RELEASE ---
            const holdsToRelease = [];
            for (const [key, hold] of activeHolds.entries()) {
                // If current game time is past the release time
                if (currentTime >= hold.releaseTime) {
                    window._$W._$9B(key); // Release the key
                    holdsToRelease.push(key);
                }
            }

            // Remove released holds from the tracking map
            for (const key of holdsToRelease) {
                activeHolds.delete(key);
            }
            // --------------------------------------------------------------------

        }, AUTOPLAYER_INTERVAL);

        isAutoplayerOn = true;
        toggleButton.textContent = 'Autoplayer ON';
        toggleButton.style.backgroundColor = '#4CAF50';
        console.log("Autoplayer started.");
    }

    // ⭐ Initialization logic that runs when the game object is found
    function initialize() {
        // Only run if the game object is valid and we haven't started
        if (window._$W && !isAutoplayerOn) {
            startAutoplayer();
        }
    }

    // 🔄 Continuous watcher loop to detect game object changes and handle reset
    const watcherLoop = setInterval(() => {
        const gameObj = window._$W;

        if (gameObj && !game_object_found) {
            // New game object found (e.g., starting a new level or reset)
            game_object_found = true;
            console.log("Game object `window._$W` found! Initializing autoplayer.");
            initialize();
        } else if (!gameObj && game_object_found) {
            // Game object disappeared (e.g., level finished or reset)
            game_object_found = false;
            if (isAutoplayerOn) {
                stopAutoplayer();
                console.log("Game object lost. Autoplayer stopped.");
            }
        }
    }, 500);

})();