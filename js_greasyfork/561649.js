// ==UserScript==
// @name         Let it Snow (for all websites)
// @version      1.0
// @description  Snowfall effect with accumulation on page elements
// @author       headmetwall
// @match        *://*/*
// @license MIT
// @grant        none
// @namespace https://greasyfork.org/users/1556902
// @downloadURL https://update.greasyfork.org/scripts/561649/Let%20it%20Snow%20%28for%20all%20websites%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561649/Let%20it%20Snow%20%28for%20all%20websites%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Configuration
    const SNOWFLAKE_COUNT = 200;
    const MAX_ACCUMULATION = 20;
    const WIND_VARIANCE = 1.0;
    const MELT_RATE = 0.002;
    const ELEMENT_SCAN_INTERVAL = 3000;
    const MIN_OBSTACLE_WIDTH = 30;
    const MIN_OBSTACLE_HEIGHT = 15;
    const SPATIAL_GRID_SIZE = 50;

    // Setup Canvas with better compatibility
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: '999999',
        imageRendering: 'auto'
    });

    // Wait for body to exist
    function initCanvas() {
        if (document.body) {
            document.body.appendChild(canvas);
        } else {
            setTimeout(initCanvas, 100);
        }
    }
    initCanvas();

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Resize handler with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            scanElements();
        }, 150);
    }, { passive: true });

    // State
    const snowflakes = [];
    const accumulation = [];
    let obstacles = [];
    let spatialGrid = new Map(); // For faster collision detection

    // Spatial grid helpers
    function getGridKey(x, y) {
        const gx = Math.floor(x / SPATIAL_GRID_SIZE);
        const gy = Math.floor(y / SPATIAL_GRID_SIZE);
        return `${gx},${gy}`;
    }

    function addToGrid(obstacle) {
        // Add obstacle to all grid cells it spans
        const startX = Math.floor(obstacle.left / SPATIAL_GRID_SIZE);
        const endX = Math.floor(obstacle.right / SPATIAL_GRID_SIZE);
        const gridY = Math.floor(obstacle.y / SPATIAL_GRID_SIZE);

        for (let gx = startX; gx <= endX; gx++) {
            const key = `${gx},${gridY}`;
            if (!spatialGrid.has(key)) {
                spatialGrid.set(key, []);
            }
            spatialGrid.get(key).push(obstacle);
        }
    }

    function getNearbyObstacles(x, y) {
        const key = getGridKey(x, y);
        return spatialGrid.get(key) || [];
    }

    // Optimized element scanning with Intersection Observer hints
    let visibleElements = new Set();
    let scanInProgress = false;

    function scanElements() {
        if (scanInProgress) return;
        scanInProgress = true;

        // Use requestIdleCallback for better performance
        const scan = () => {
            const selector = 'div, p, h1, h2, h3, h4, h5, h6, img, button, nav, header, footer, section, article';
            const elements = document.querySelectorAll(selector);

            // Clear old data
            obstacles = [];
            spatialGrid.clear();

            const viewH = height;
            const viewW = width;
            let count = 0;
            const maxObstacles = 100; // Limit for performance

            for (let i = 0; i < elements.length && count < maxObstacles; i++) {
                const el = elements[i];
                const rect = el.getBoundingClientRect();

                // More aggressive filtering
                if (rect.bottom < -50 || rect.top > viewH + 50) continue;
                if (rect.width < MIN_OBSTACLE_WIDTH || rect.height < MIN_OBSTACLE_HEIGHT) continue;
                if (rect.top <= 1) continue;
                if (rect.height > viewH * 0.9) continue;
                if (rect.right < 0 || rect.left > viewW) continue;

                // Quick visibility check
                const style = window.getComputedStyle(el);
                if (parseFloat(style.opacity) < 0.1 || style.visibility === 'hidden' || style.display === 'none') continue;

                const obstacle = {
                    y: rect.top,
                    left: Math.max(0, rect.left),
 right: Math.min(viewW, rect.right)
                };

                obstacles.push(obstacle);
                addToGrid(obstacle);
                count++;
            }

            scanInProgress = false;
        };

        if ('requestIdleCallback' in window) {
            requestIdleCallback(scan, { timeout: 1000 });
        } else {
            setTimeout(scan, 0);
        }
    }

    // Throttled scanning
    let scanTimeout;
    function requestScan() {
        if (!scanTimeout) {
            scanTimeout = setTimeout(() => {
                scanElements();
                scanTimeout = null;
            }, ELEMENT_SCAN_INTERVAL);
        }
    }

    window.addEventListener('scroll', requestScan, { passive: true });

    // Initial scan after page settles
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(scanElements, 500));
    } else {
        setTimeout(scanElements, 500);
    }

    class Snowflake {
        constructor(reset = false) {
            this.init(reset);
        }

        init(reset) {
            this.x = Math.random() * width;
            this.y = reset ? -20 : Math.random() * height;
            this.size = (Math.random() * 2 + 1) / 2;
            this.speedY = Math.random() * 1 + 1 + (this.size / 5);
            this.speedX = (Math.random() - 0.5) * WIND_VARIANCE;
            this.opacity = Math.random() * 0.5 + 0.5;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;

            // Optimized collision detection using spatial grid
            const nearby = getNearbyObstacles(this.x, this.y);
            for (let obs of nearby) {
                if (this.x >= obs.left && this.x <= obs.right) {
                    const prevY = this.y - this.speedY;
                    if (this.y >= obs.y && prevY < obs.y) {
                        return true;
                    }
                }
            }

            // Screen boundaries
            if (this.y > height) {
                this.init(true);
            }
            if (this.x > width) this.x = 0;
            if (this.x < 0) this.x = width;

            return false;
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class AccumulatedFlake {
        constructor(x, y, size, opacity) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.opacity = opacity;
        }

        update() {
            this.opacity -= MELT_RATE;
            return this.opacity <= 0;
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize flakes
    for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
        snowflakes.push(new Snowflake());
    }

    // Animation with performance monitoring
    let lastFrameTime = performance.now();
    let fps = 60;
    let frameCount = 0;
    let isVisible = !document.hidden;

    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
    });

    function animate(currentTime) {
        // Skip animation if tab is not visible
        if (!isVisible) {
            requestAnimationFrame(animate);
            return;
        }

        // Calculate FPS every 60 frames
        frameCount++;
        if (frameCount % 60 === 0) {
            const delta = currentTime - lastFrameTime;
            fps = 60000 / delta;
            lastFrameTime = currentTime;
        }

        ctx.clearRect(0, 0, width, height);

        // Update and draw falling snowflakes
        for (let i = 0; i < snowflakes.length; i++) {
            const flake = snowflakes[i];
            const collided = flake.update();

            if (collided && accumulation.length < MAX_ACCUMULATION) {
                accumulation.push(new AccumulatedFlake(flake.x, flake.y, flake.size, flake.opacity));
                flake.init(true);
            } else {
                flake.draw();
            }
        }

        // Update and draw accumulated snow
        for (let i = accumulation.length - 1; i >= 0; i--) {
            const acc = accumulation[i];
            if (acc.update()) {
                accumulation.splice(i, 1);
            } else {
                acc.draw();
            }
        }

        requestAnimationFrame(animate);
    }

    animate(performance.now());

})();
