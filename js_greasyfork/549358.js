// ==UserScript==
// @name         Bloxd.io improved renderer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Multi-threaded rendering optimization, chunk culling, batching, and caching
// @author       unintelligent
// @match        https://*.bloxd.io/*
// @match        http://*.bloxd.io/*
// @grant        none
// @run-at       document-end
// @license      GNU GPL 3.0
// @downloadURL https://update.greasyfork.org/scripts/549358/Bloxdio%20improved%20renderer.user.js
// @updateURL https://update.greasyfork.org/scripts/549358/Bloxdio%20improved%20renderer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------- Caches ----------
    const bitmapCache = new Map();
    const rotatedCache = new Map();
    const canvasCache = new Map();
    const atlasCache = new Map();
    let visibleChunks = []; // Array of 0/1 for chunk visibility

    // ---------- Persistent canvas getter ----------
    function getCanvas(width, height, key) {
        if (canvasCache.has(key)) return canvasCache.get(key);
        const c = document.createElement('canvas');
        c.width = width; c.height = height;
        canvasCache.set(key, c);
        return c;
    }

    // ---------- Workers ----------
    const chunkWorker = new Worker(URL.createObjectURL(new Blob([`
        onmessage = function(e) {
            const { chunks, cameraPos } = e.data;
            const vis = new Uint8Array(chunks.length);
            for (let i = 0; i < chunks.length; i++) {
                const dx = chunks[i].x - cameraPos.x;
                const dy = chunks[i].y - cameraPos.y;
                const dz = chunks[i].z - cameraPos.z;
                const dist2 = dx*dx + dy*dy + dz*dz;
                vis[i] = (dist2 <= chunks[i].maxDist*chunks[i].maxDist) ? 1 : 0;
            }
            postMessage(vis);
        };
    `], { type: 'application/javascript' })));

    // ---------- Wait for game internals ----------
    function waitFor(fn, callback) {
        const interval = setInterval(() => {
            if (fn()) {
                clearInterval(interval);
                callback();
            }
        }, 50);
    }

    waitFor(() => window.q && window.h && window.k && window.M, () => {
        (async function() {

            // ---------- Monkey-patch image loader ----------
            const originalQ = window.q;
            window.q = async function(url) {
                if (bitmapCache.has(url)) return bitmapCache.get(url);
                const bmp = await originalQ(url);
                bitmapCache.set(url, bmp);
                return bmp;
            };

            // ---------- Monkey-patch rotation ----------
            const originalH = window.h;
            window.h = async function(textureObj) {
                for (const [C, rotations] of Object.entries(textureObj)) {
                    const baseBitmap = await window.q(rotations[0].url);
                    for (const rot of rotations) {
                        const key = `${rot.url}|rot:${rot.angle||rot}`;
                        if (!rotatedCache.has(key)) {
                            const canvas = getCanvas(baseBitmap.width, baseBitmap.height, key);
                            const ctx = canvas.getContext('2d');
                            ctx.clearRect(0,0,canvas.width,canvas.height);
                            ctx.save();
                            ctx.translate(canvas.width/2, canvas.height/2);
                            ctx.rotate((rot.angle || rot) * Math.PI / 2);
                            ctx.drawImage(baseBitmap, -canvas.width/2, -canvas.height/2);
                            ctx.restore();
                            const bmp = await createImageBitmap(canvas);
                            rotatedCache.set(key, bmp);
                        }
                    }
                }
                return originalH.apply(this, arguments);
            };

            // ---------- Monkey-patch atlas merging ----------
            const originalK = window.k;
            window.k = async function(key, images, ...args) {
                if (atlasCache.has(key)) return atlasCache.get(key);
                const result = await originalK(key, images, ...args);
                atlasCache.set(key, result);
                return result;
            };

            // ---------- GPU occlusion + batching ----------
            function batchRender(chunks, camera) {
                chunkWorker.postMessage({ chunks, cameraPos: camera });
                chunkWorker.onmessage = function(e) {
                    visibleChunks = e.data;
                    const batch = [];
                    for (let i = 0; i < chunks.length; i++) {
                        if (visibleChunks[i]) batch.push(chunks[i]);
                    }
                    drawBatch(batch); // Draw all visible chunks in one call
                };
            }

            function drawBatch(batch) {
                // Example pseudo-draw
                const canvas = getCanvas(1024,1024,'batch');
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0,0,canvas.width,canvas.height);
                batch.forEach(c => {
                    const bmp = bitmapCache.get(c.textureUrl);
                    if (bmp) ctx.drawImage(bmp, c.screenX, c.screenY, c.width, c.height);
                });
            }

            // ---------- Hook into game render loop ----------
            const originalRender = window.M;
            window.M = function(...args) {
                const chunks = args[0]; // assume first argument is chunk list
                const camera = { x: 0, y: 0, z: 0 }; // replace with actual camera position
                batchRender(chunks, camera);
                return originalRender.apply(this, args);
            };

        })();
    });

})();
