// ==UserScript==
// @name         Hybrid Performance Booster
// @namespace    http://zeta/
// @version      3.5
// @description  Balanced performance script with safe acceleration + optional aggressive mode.
// @author       Gugu8
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549381/Hybrid%20Performance%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/549381/Hybrid%20Performance%20Booster.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- GPU Acceleration (Balanced) ---
    const enableGPU = () => {
        const targets = document.querySelectorAll('video, canvas, [style*="transform"], [style*="animation"]');
        for (const el of targets) {
            el.style.transform = 'translateZ(0)';
            el.style.willChange = 'transform, opacity';
        }
    };

    // --- Optional: Aggressive GPU Override (Uncomment to enable) ---
    // const enableAggressiveGPU = () => {
    //     document.querySelectorAll('*').forEach(el => {
    //         el.style.transform = 'translate3d(0,0,0)';
    //         el.style.willChange = 'transform, opacity';
    //     });
    // };

    // --- Performance UI (Smooth) ---
    const startPerformanceUI = () => {
        const ui = document.createElement('div');
        ui.id = 'perf-ui';
        ui.style.cssText = `
            position: fixed; bottom: 12px; right: 12px;
            background: #000; color: #0f0; font-family: monospace;
            padding: 10px; border: 1px solid #00ff00; border-radius: 5px;
            z-index: 99999; font-size: 12px;
        `;
        document.body.appendChild(ui);

        let fps = 0, lastTime = performance.now();
        const update = () => {
            const now = performance.now();
            fps = Math.round(1000 / (now - lastTime));
            lastTime = now;
            ui.innerHTML = `FPS: <strong>${fps}</strong> | MODE: HYBRID`;
            requestAnimationFrame(update);
        };
        update();
    };

    // --- Init ---
    document.addEventListener('DOMContentLoaded', () => {
        enableGPU();
        if ('requestIdleCallback' in window) {
            requestIdleCallback(startPerformanceUI);
        } else {
            setTimeout(startPerformanceUI, 1000);
        }
    });

})();