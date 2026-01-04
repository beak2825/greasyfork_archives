// ==UserScript==
// @name         Repuls.io QoL (Fixed)
// @namespace    repuls-qol-fixed
// @version      1.1
// @description  Adds FPS counter, crosshair, and auto-respawn overlays for Repuls.io
// @match        https://repuls.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559657/Repulsio%20QoL%20%28Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559657/Repulsio%20QoL%20%28Fixed%29.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // Wait until body exists
    function ready(fn) {
        if (document.body) fn();
        else setTimeout(() => ready(fn), 100);
    }

    ready(() => {
        console.log('[Repuls QoL] Script started');

        /* ---------- FPS COUNTER ---------- */
        const fpsBox = document.createElement('div');
        fpsBox.textContent = 'FPS: --';
        fpsBox.style.position = 'fixed';
        fpsBox.style.top = '10px';
        fpsBox.style.right = '10px';
        fpsBox.style.color = '#00ff00';
        fpsBox.style.background = 'rgba(0,0,0,0.6)';
        fpsBox.style.font = '12px monospace';
        fpsBox.style.padding = '6px';
        fpsBox.style.zIndex = '2147483647';
        document.body.appendChild(fpsBox);

        let frames = 0;
        let last = performance.now();

        function fpsLoop(now) {
            frames++;
            if (now - last >= 1000) {
                fpsBox.textContent = 'FPS: ' + frames;
                frames = 0;
                last = now;
            }
            requestAnimationFrame(fpsLoop);
        }
        requestAnimationFrame(fpsLoop);

        /* ---------- CROSSHAIR ---------- */
        const crosshair = document.createElement('div');
        crosshair.style.position = 'fixed';
        crosshair.style.left = '50%';
        crosshair.style.top = '50%';
        crosshair.style.width = '10px';
        crosshair.style.height = '10px';
        crosshair.style.border = '2px solid cyan';
        crosshair.style.transform = 'translate(-50%, -50%)';
        crosshair.style.pointerEvents = 'none';
        crosshair.style.zIndex = '2147483646';
        document.body.appendChild(crosshair);

        /* ---------- KEYBINDS ---------- */
        document.addEventListener('keydown', e => {
            if (e.code === 'KeyC') {
                crosshair.style.display =
                    crosshair.style.display === 'none' ? 'block' : 'none';
            }
            if (e.code === 'KeyF') {
                fpsBox.style.display =
                    fpsBox.style.display === 'none' ? 'block' : 'none';
            }
        });

        /* ---------- AUTO RESPAWN ---------- */
        setInterval(() => {
            const btns = document.getElementsByTagName('button');
            for (const b of btns) {
                if (b.innerText && b.innerText.toLowerCase().includes('respawn')) {
                    b.click();
                    break;
                }
            }
        }, 1200);

        console.log('[Repuls QoL] Loaded successfully');
    });
})();
