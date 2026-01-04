// ==UserScript==
// @name         Gpop.io Autoplayer [Reuploaded]
// @namespace    http://tampermonkey.net/
// @version      1.2.5
// @description  v1.0 release (copyright update)
// @author       find
// @match        https://gpop.io/play/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559687/Gpopio%20Autoplayer%20%5BReuploaded%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/559687/Gpopio%20Autoplayer%20%5BReuploaded%5D.meta.js
// ==/UserScript==
 
// ill let u upload this brody
 
(function() {
    'use strict';
 
    const AUTOPLAYER_INTERVAL = 1;
    const HIT_OFFSET = -0.010;
    const HIT_WINDOW_PAST = 0.050;
 
    console.log("Gpop.io Autoplayer v1.2.3 (Hybrid Fix) injected...");
 
    let autoplayerLoop = null;
    let isAutoplayerOn = false;
    const toggleButton = document.createElement('button');
 
    function cleanupNoteState() {
        if (typeof window._$W === 'undefined' || !window._$W._$2n) return;
        for (const note of window._$W._$2n) {
            if (note.handledByBot) delete note.handledByBot;
        }
        console.log("Autoplayer state cleaned.");
    }
 
    function startAutoplayer() {
        if (isAutoplayerOn) return;
        cleanupNoteState();
 
        autoplayerLoop = setInterval(() => {
            if (typeof window._$W === 'undefined' || window._$W === null) return;
 
            const currentTime = window._$W._$ad();
            if (typeof currentTime !== 'number') return;
 
            const activeNotes = window._$W._$2n;
            if (!activeNotes || !Array.isArray(activeNotes)) return;
 
            for (const note of activeNotes) {
                const noteData = note.notedata;
 
                if (!noteData || noteData._$aP || note.handledByBot) {
                    continue;
                }
 
                const noteTime = noteData.time;
                const noteKey = noteData.key;
                const noteType = noteData.type;
 
                const isHittable = (currentTime >= noteTime + HIT_OFFSET) && (currentTime <= noteTime + HIT_WINDOW_PAST);
 
                if (isHittable) {
                    note.handledByBot = true;
                    window._$W._$q(noteKey);
 
                    if (noteType === 0) {
                        window._$W._$9B(noteKey);
                    } else if (noteType === 1) {
                        const holdDurationMs = noteData._$ak * 1000;
                        setTimeout(() => {
                            if (!isAutoplayerOn) return;
                            window._$W._$9B(noteKey);
                        }, holdDurationMs);
                    }
                }
            }
        }, AUTOPLAYER_INTERVAL);
 
        isAutoplayerOn = true;
        toggleButton.textContent = 'Autoplayer ON';
        toggleButton.style.backgroundColor = '#4CAF50';
        console.log("Autoplayer started.");
    }
 
    function stopAutoplayer() {
        if (!isAutoplayerOn) return;
        clearInterval(autoplayerLoop);
        isAutoplayerOn = false;
        toggleButton.textContent = 'Autoplayer OFF';
        toggleButton.style.backgroundColor = '#f44336';
        console.log("Autoplayer stopped.");
    }
 
    function initialize() {
        toggleButton.style.position = 'fixed';
        toggleButton.style.bottom = '10px';
        toggleButton.style.right = '10px';
        toggleButton.style.zIndex = '9999';
        toggleButton.style.border = 'none';
        toggleButton.style.padding = '10px 20px';
        toggleButton.style.cursor = 'pointer';
        document.body.appendChild(toggleButton);
 
        toggleButton.addEventListener('click', () => {
            if (isAutoplayerOn) {
                stopAutoplayer();
            } else {
                startAutoplayer();
            }
        });
 
        startAutoplayer();
    }
 
    const waitForGame = setInterval(() => {
        if (typeof window._$W !== 'undefined' && window._$W !== null) {
            clearInterval(waitForGame);
            console.log("Game object `window._$W` found! Initializing autoplayer.");
            initialize();
        }
    }, 500);
 
})();