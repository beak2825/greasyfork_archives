// ==UserScript==
// @name        Mineenergy Zoom on Scroll
// @namespace   http://tampermonkey.net/
// @match       *://mineenergy2.fun/*
// @grant       none
// @run-at      document-start
// @version     1.0
// @description Zoom in/out by scrolling your mouse, press Shift + R to reset to default
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556564/Mineenergy%20Zoom%20on%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/556564/Mineenergy%20Zoom%20on%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        minFov: 10,        // Minimum FOV (zoomed in)
        maxFov: 120,       // Maximum FOV (zoomed out)
        defaultFov: 50,    // Default FOV to reset to
        zoomSpeed: 4,      // How much to change FOV per scroll step
        smoothZoom: true,  // Enable smooth zoom transitions
        smoothSpeed: 0.15, // Smooth zoom interpolation speed (0-1)
    };

    let currentFov = CONFIG.defaultFov;
    let targetFov = CONFIG.defaultFov;

    // Matrix utility for perspective (column-major)
    function computePerspective(fovDeg, aspect, near, far) {
        const fovRad = fovDeg * Math.PI / 180;
        const f = 1 / Math.tan(fovRad / 2);
        const out = new Float32Array(16);

        out[0]  = f / aspect; out[1] = 0; out[2] = 0; out[3] = 0;
        out[4]  = 0; out[5] = f; out[6] = 0; out[7] = 0;
        out[8]  = 0; out[9] = 0;
        out[10] = (far + near) / (near - far);
        out[11] = -1;
        out[12] = 0; out[13] = 0;
        out[14] = (2 * far * near) / (near - far);
        out[15] = 0;

        return out;
    }

    // Handle keyboard reset: Shift + R
    function handleKeydown(e) {
        if (e.key === 'r' || e.key === 'R') {
            if (e.shiftKey) {
                targetFov = CONFIG.defaultFov;
                if (!CONFIG.smoothZoom) {
                    currentFov = CONFIG.defaultFov;
                }
            }
        }
    }

    // Extract near and far from a perspective projection matrix
    function extractNearFar(matrix) {
        if (!(matrix instanceof Float32Array) || matrix.length < 16) {
            return { near: 0.1, far: 10000 };
        }

        const m10 = matrix[10];
        const m14 = matrix[14];

        if (!Number.isFinite(m10) || !Number.isFinite(m14) || m14 === 0) {
            return { near: 0.1, far: 10000 };
        }

        const denomNear = m10 - 1;
        const denomFar = m10 + 1;

        if (denomNear === 0 || denomFar === 0) {
            return { near: 0.1, far: 10000 };
        }

        let near = m14 / denomNear;
        let far = m14 / denomFar;

        if (near < 0 && far < 0) {
            near = -near;
            far = -far;
        }

        if (!Number.isFinite(near) || !Number.isFinite(far) || near <= 0 || far <= 0) {
            return { near: 0.1, far: 10000 };
        }

        return { near, far };
    }

    // Check if a matrix is a perspective projection matrix
    function isPerspectiveMatrix(data) {
        // Perspective matrix: m[11] = -1, m[15] = 0, m[0] > 0, m[5] > 0
        const m11 = data[11];
        const m15 = data[15];
        return Math.abs(m11 + 1) < 0.001 &&
               Math.abs(m15) < 0.001 &&
               data[0] > 0 &&
               data[5] > 0;
    }

    // Handle wheel event
    function handleWheel(e) {
        e.preventDefault();
        e.stopPropagation();

        const delta = e.deltaY > 0 ? CONFIG.zoomSpeed : -CONFIG.zoomSpeed;
        targetFov = Math.max(CONFIG.minFov, Math.min(CONFIG.maxFov, targetFov + delta));

        if (!CONFIG.smoothZoom) {
            currentFov = targetFov;
        }
    }

    // Smooth zoom animation loop
    function updateSmoothZoom() {
        if (Math.abs(currentFov - targetFov) > 0.01) {
            currentFov += (targetFov - currentFov) * CONFIG.smoothSpeed;
        }
        requestAnimationFrame(updateSmoothZoom);
    }

    // WebGL hook
    const origGetCtx = HTMLCanvasElement.prototype.getContext;

    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
        const gl = origGetCtx.call(this, type, ...args);

        if (gl && !gl.__fovInit && /webgl/i.test(type)) {
            gl.__fovInit = true;

            const locNameMap = new Map();            // Map<GLUniformLocation, name>
            const projLocMap = new WeakMap();        // WeakMap<program, Set<GLUniformLocation>>
            const projParamsMap = new WeakMap();     // WeakMap<program, { near, far }>
            let currentProgram = null;

            // Track current program
            const origUseProgram = gl.useProgram;
            gl.useProgram = function(program) {
                currentProgram = program;
                if (program && !projLocMap.has(program)) {
                    projLocMap.set(program, new Set());
                }
                return origUseProgram.call(this, program);
            };

            // Track uniform locations and names
            const origGetUniformLocation = gl.getUniformLocation;
            gl.getUniformLocation = function(program, name) {
                const loc = origGetUniformLocation.call(this, program, name);
                if (loc && program) {
                    locNameMap.set(loc, name);
                }
                return loc;
            };

            // Override projection matrix upload - intercept by structure AND name
            const origUniformMatrix4fv = gl.uniformMatrix4fv;
            gl.uniformMatrix4fv = function(location, transpose, data) {
                if (!currentProgram || !(data instanceof Float32Array) || data.length < 16) {
                    return origUniformMatrix4fv.call(this, location, transpose, data);
                }

                const isProjByStructure = isPerspectiveMatrix(data);
                const name = locNameMap.get(location) || '';
                const isProjByName = /proj/i.test(name) && !/inv/i.test(name);

                // Intercept if it's a projection matrix (by name OR by structure)
                if (isProjByName || isProjByStructure) {
                    let locSet = projLocMap.get(currentProgram);
                    if (!locSet) {
                        locSet = new Set();
                        projLocMap.set(currentProgram, locSet);
                    }

                    locSet.add(location);

                    // Extract or use default near/far
                    let params = projParamsMap.get(currentProgram);
                    if (!params) {
                        params = isProjByStructure ? extractNearFar(data) : { near: 0.1, far: 10000 };
                        projParamsMap.set(currentProgram, params);
                    }

                    // Apply our FOV override
                    const canvas = gl.canvas;
                    const aspect = canvas.width / (canvas.height || 1);
                    const mat = computePerspective(currentFov, aspect, params.near, params.far);
                    return origUniformMatrix4fv.call(this, location, false, mat);
                }

                return origUniformMatrix4fv.call(this, location, transpose, data);
            };

            // Hook all draw functions to apply projection on every draw call
            const hookDrawFunction = (name) => {
                if (gl[name]) {
                    const orig = gl[name];
                    gl[name] = function(...args) {
                        _applyProjection();
                        return orig.call(this, ...args);
                    };
                }
            };

            hookDrawFunction('drawElements');
            hookDrawFunction('drawArrays');
            hookDrawFunction('drawElementsInstanced');
            hookDrawFunction('drawArraysInstanced');
            hookDrawFunction('drawElementsInstancedBaseVertexBaseInstance');
            hookDrawFunction('drawArraysInstancedBaseInstance');

            // Apply projection on every draw call
            function _applyProjection() {
                if (!currentProgram) return;

                const locSet = projLocMap.get(currentProgram);
                if (!locSet || locSet.size === 0) return;

                const params = projParamsMap.get(currentProgram);
                if (!params) return;

                const canvas = gl.canvas;
                const aspect = canvas.width / (canvas.height || 1);
                const mat = computePerspective(currentFov, aspect, params.near, params.far);

                // Apply to all projection locations for this program
                locSet.forEach(loc => {
                    try {
                        origUniformMatrix4fv.call(gl, loc, false, mat);
                    } catch (e) {
                        // Location might be invalid, ignore
                    }
                });
            }
        }

        return gl;
    };

    // Initialize
    function init() {
        document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
        document.addEventListener('keydown', handleKeydown, true);

        if (CONFIG.smoothZoom) {
            requestAnimationFrame(updateSmoothZoom);
        }
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API to window
    window.fovZoom = {
        setFov: (fov) => {
            targetFov = Math.max(CONFIG.minFov, Math.min(CONFIG.maxFov, fov));
            if (!CONFIG.smoothZoom) {
                currentFov = targetFov;
            }
            return currentFov;
        },
        getFov: () => currentFov,
        reset: () => {
            targetFov = CONFIG.defaultFov;
            if (!CONFIG.smoothZoom) {
                currentFov = CONFIG.defaultFov;
            }
            return currentFov;
        }
    };
})();
