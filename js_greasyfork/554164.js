// ==UserScript==
// @name         YouTube Music Volume Booster
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Aumenta el volumen de YouTube Music más allá del límite normal
// @author       TuNombre
// @match        https://music.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554164/YouTube%20Music%20Volume%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/554164/YouTube%20Music%20Volume%20Booster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let audioCtx = null;
    let gainNode = null;
    let boosted = false;

    function boostVolume() {
        if (boosted) return;

        const video = document.querySelector('video');
        if (!video) return;

        audioCtx = new AudioContext();
        const source = audioCtx.createMediaElementSource(video);
        gainNode = audioCtx.createGain();
        gainNode.gain.value = 2.0; // Puedes ajustar este valor (1.0 = normal, 2.0 = el doble)

        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        boosted = true;
        console.log('🔊 Volumen aumentado con GainNode');
    }

    // Espera a que el video esté disponible
    const observer = new MutationObserver(() => {
        const video = document.querySelector('video');
        if (video) {
            boostVolume();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
