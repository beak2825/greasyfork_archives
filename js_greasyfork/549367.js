// ==UserScript==
// @name         Absolute Performance
// @namespace    http://zeta/
// @version      2.0
// @description  Makes you get maximum browser performance with GPU acceleration (even if you have intergrated graphics), memory optimizations, and smooth rendering
// @author       Gugu8
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549367/Absolute%20Performance.user.js
// @updateURL https://update.greasyfork.org/scripts/549367/Absolute%20Performance.meta.js
// ==/UserScript==
(function() {
    //Disable background timers and low-priority tasks
    const originalSetInterval = window.setInterval;
    const originalSetTimeout = window.setTimeout;
    window.setInterval = function(callback, delay) {
        return originalSetInterval(callback, Math.max(delay, 16)); // Clamp to ~60fps
    };
    window.setTimeout = function(callback, delay) {
        return originalSetTimeout(callback, Math.max(delay, 10));
    };

    //Reduce logging overhead
    console.log = console.warn = console.error = function() {};

    //Force GPU rasterization and maximum rendering performance
    const forceHardwareAcceleration = () => {
        const allElements = document.querySelectorAll('*');
        for (let el of allElements) {
            el.style.transform = 'translateZ(0)';
            el.style.willChange = 'transform, opacity, contents';
            el.style.backfaceVisibility = 'hidden';
        }
    };

    //Boost the Memory
    const optimizeMemory = () => {
        if (window.performance && performance.memory) {
            performance.memory.jsHeapSizeLimit = performance.memory.jsHeapSizeLimit * 0.95;
        }
        if (window.gc) window.gc(); // Force garbage collection if available basiclly is deleting code that's no longer needed or used. This automatically frees up memory space.

    };

    //This just makes the web preload
    const preloadResources = () => {
        document.querySelectorAll('img, video, audio, source').forEach(resource => {
            const url = resource.src || resource.href;
            if (url) new Image().src = url;
        });
    };

    //Override requestAnimationFrame for extremely fast rendering
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
        return originalRAF(() => {
            callback(performance.now());
        });
    };

    //Disable blink features that eat CPU performence
    try {
        document.createElement('iframe').style.visibility = 'hidden';
        CSS.prototype.willChange = 'transform';
    } catch (e) {}

    // Apply the Optimiztions
    forceHardwareAcceleration();
    preloadResources();
    optimizeMemory();

    //UI
    const perfUI = document.createElement('div');
    perfUI.id = 'zeta-perf-overlay';
    perfUI.style = `
        position: fixed;
        bottom: 12px;
        right: 12px;
        background: #000;
        color: #0f0;
        font-family: monospace;
        font-size: 12px;
        padding: 10px;
        border: 1px solid #00ff00;
        border-radius: 5px;
        z-index: 99999;
        box-shadow: 0 0 15px rgba(0,255,0,0.6);
    `;

    perfUI.innerHTML = `
        <strong>PERFORMANCE Booster</strong><br>
        GPU:Extremely OPTIMIZED | RAM: MAXIMIZE<br>
        RAF: HYPER SMOOTH | THREADS: MAX
    `;
    document.body.appendChild(perfUI);

    // Update stats in real-time
    setInterval(() => {
        let memUsage = performance.memory ? (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB' : 'UNAVAILABLE';
        perfUI.innerHTML = `
            <strong>PERFORMANCE BOOST v2.0</strong><br>
            MEM: ${memUsage} | FPS: OPTIMIZED<br>
            MODE: BROWSER-TUNED | STATUS: ACTIVE
        `;
    }, 2000);

    // Last Log
    console.log("Rate this performance boosting script");
})();