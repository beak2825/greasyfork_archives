// ==UserScript==
// @name         mapmaker +
// @namespace    http://tampermonkey.net/
// @version      FINAL + EXPERIMENTAL
// @description  Has a bunch of flaws use the other one
// @author       breeeee
// @match        https://mapmaker.deeeep.io/*
// @match        https://mapmaker.deeeep.io/map*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deeeep.io
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550861/mapmaker%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/550861/mapmaker%20%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    try {
        console.log('Full script: Top-level loaded (use strict OK)');
    } catch (e) {
        console.error('Full script: Fatal error at top:', e);
        return;
    }

    // Shared Variables
    let baseNudgeAmount = 2;
    const debugMode = true;
    let keyHandler = null;
    // Gradient Flip Mode (v74: Simple Visual Reverse - Independent of Eyedropper)
    let flipMode = false;  // false=normal, true=flipped (live swap, no restore - Changes persist)

    // NEW: Horizontal Mode (v74: 90° Rotation for Left-Right Flow - Separate Hotkey)
    let horizontalMode = false;  // false=normal orientation, true=90° rotate (shape tilts, gradient horizontal)
    let retryCount = 0;  // Global for max retries (prevents loop)
    const MAX_RETRIES = 3;

    // Helper: Reset Retry (Call on toggle/eyedrop)
    function resetRetry() {
        retryCount = 0;
    }

    let pixiLib = null;  // Cached PIXI (avoid hoist error)

    // Helper: Get PIXI Safely (Retry if Unavailable)
    function getPixiLib() {
        if (pixiLib) return pixiLib;
        pixiLib = window.PIXI || (typeof PIXI !== 'undefined' ? PIXI : null);
        if (!pixiLib && window.pixiApp) {
            // Try bundled via app (Pixi v6/7 common)
            pixiLib = window.pixiApp.PIXI || window.pixiApp.constructor.PIXI;
        }
        if (!pixiLib) {
            console.log('getPixiLib: PIXI not found - Will retry on demand');
        } else {
            console.log('getPixiLib: PIXI loaded successfully');
        }
        return pixiLib;
    }

    console.log('Full script: Variables defined');
    // ===== BAKING BLOCK - Updated for Native "opacity" + Direct JSON Body =====
    // SERVER BAKING: Inject scale/opacity into save JSON (data.screenObjects) - Matches native prop alpha
    let bakedChanges = {};  // {shapeId: {scale: {x:1.5, y:1.5}, opacity: 0.5}}  // Now "opacity" for compatibility

    function storeBakedChange(shapeId, prop, value) {
        if (!bakedChanges[shapeId]) bakedChanges[shapeId] = {};
        bakedChanges[shapeId][prop] = value;
        if (debugMode) console.log(`Bake: Tracked ${prop} for ID ${shapeId}:`, value);
    }

    function bakeIntoScreenObjects(screenObjects) {
        if (!Array.isArray(screenObjects)) return;
        let bakedCount = 0;
        screenObjects.forEach(obj => {
            if (!obj || !obj.id) return;
            // Ensure settings for 'H' shapes (prevents site toJsonObject crash on hSType)
            if (obj.type === 'H' && !obj.settings) {
                obj.settings = {};  // Minimal init - site populates .id if needed
                if (debugMode) console.log(`Bake: Initialized empty settings for H ID ${id} (null safety)`);
            }
            const id = obj.id;
            if (id && bakedChanges[id]) {
                const changes = bakedChanges[id];

                // Add scale (props: P/H - multiplies base size)
                if (changes.scale && (obj.type === 'P' || obj.type === 'H')) {
                    obj.scale = changes.scale;  // {x:1.5, y:1.5}
                    if (debugMode) console.log(`Bake: Added scale to prop ID ${id} (${obj.type}): ${obj.scale.x.toFixed(2)}x`);
                    bakedCount++;
                }

                // Add opacity (all: props/polygons - matches native "opacity":0.5 on H/P)
                if (changes.opacity !== undefined) {
                    obj.opacity = changes.opacity;  // 0-1 (replaces "alpha")
                    if (debugMode) console.log(`Bake: Added opacity to ${obj.type || 'shape'} ID ${id}: ${obj.opacity.toFixed(1)} (native-compatible)`);
                    bakedCount++;
                }

                // Add zIndex (all types - draw order)
                if (changes.zIndex !== undefined) {
                    obj.zIndex = changes.zIndex;  // 0-100 (higher = drawn front)
                    if (debugMode) console.log(`Bake: Added zIndex to ${obj.type} ID ${id}: ${obj.zIndex}`);
                    bakedCount++;
                }

                // Add size (alternative to scale - uniform for all)
                if (changes.size !== undefined) {
                    obj.size = changes.size;  // Scalar 1.2 (uniform scale)
                    if (debugMode) console.log(`Bake: Added size to ${obj.type} ID ${id}: ${obj.size.toFixed(2)}x`);
                    bakedCount++;
                }
                // Add collidable (polygons/terrains: settings.collidable true/false)
                if (changes.settings && changes.settings.collidable !== undefined && obj.settings) {
                    if (!obj.settings) obj.settings = {};
                    obj.settings.collidable = changes.settings.collidable;
                    if (debugMode) console.log(`Bake: Added collidable=${changes.settings.collidable} to ${obj.type} ID ${id} settings`);
                    bakedCount++;
                }
                // Add hSType (for 'H' hiding places - sprite variant)
                if (changes.hSType !== undefined && obj.type === 'H') {
                    obj.hSType = changes.hSType;
                    if (debugMode) console.log(`Bake: Added hSType=${changes.hSType} to H ID ${id}`);
                    bakedCount++;
                }
            }
        });
        if (debugMode) console.log(`Bake: Modified ${bakedCount} of ${screenObjects.length} screenObjects`);
        return screenObjects;
    }

    // 1. Fixed Fetch Hook (Similar Stringify for Object Bodies)
    let originalFetch = window.fetch;
    window.fetch = async function(url, options = {}) {
        const urlStr = url.toString();
        if (debugMode) console.log('NET DEBUG: Fetch to', urlStr, '- Method:', options?.method || 'GET');
        const isMapSave = urlStr.includes('/maps/') && (options?.method === 'PUT' || options?.method === 'POST' || options?.method === 'PATCH');
        if (isMapSave && options?.body) {
            console.log('Bake: PUT/POST to /maps intercepted!', {url: urlStr, method: options.method});
            try {
                let bodyObj = options.body;
                let wasString = false;
                if (typeof bodyObj === 'string') {
                    wasString = true;
                    bodyObj = JSON.parse(bodyObj);
                    console.log('Bake: Parsed string to object');
                } else if (bodyObj && typeof bodyObj === 'object') {
                    console.log('Bake: Direct object body - Keys:', Object.keys(bodyObj).slice(0, 5));
                } else {
                    console.log('Bake: Unexpected body type:', typeof bodyObj);
                    return originalFetch.apply(this, arguments);
                }

                // Parse & modify "data"
                let modified = false;
                if (bodyObj?.data && typeof bodyObj.data === 'string') {
                    let mapData;
                    try {
                        mapData = JSON.parse(bodyObj.data);
                        if (mapData?.screenObjects) {
                            console.log('Bake: screenObjects found (length:', mapData.screenObjects.length, ')- Applying');
                            bakeIntoScreenObjects(mapData.screenObjects);
                            bodyObj.data = JSON.stringify(mapData);
                            modified = true;
                            console.log('Bake: Inner data injected');
                        } else {
                            console.log('Bake: No screenObjects - Data snippet:', bodyObj.data.substring(0, 200));
                        }
                    } catch (parseErr) {
                        console.error('Bake: Parse data error:', parseErr);
                    }
                } else {
                    console.log('Bake: No "data" field or not string - Skipping');
                }

                // Re-stringify if was string
                if (wasString && modified) {
                    options.body = JSON.stringify(bodyObj);
                    console.log('Bake: Full body re-stringified for fetch');
                } else {
                    options.body = bodyObj;  // Keep object if original
                }
                bakedChanges = {};
                console.log('Bake: Forwarding modified body');
            } catch (e) {
                console.error('Bake fetch error:', e);
            }
        }
        return originalFetch.apply(this, arguments);
    };

    // 2. Fixed XHR Hook (String Body: Parse → Modify → Full Stringify → Send)
    const originalOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        const urlStr = url.toString();
        if (debugMode) console.log('NET DEBUG: XHR to', urlStr, '- Method:', method);
        const isMapSave = urlStr.includes('/maps/') && (method === 'PUT' || method === 'POST' || method === 'PATCH');
        if (isMapSave) {
            console.log('Bake: XHR save intercepted!', {url: urlStr, method});
            const origSend = this.send;
            this.send = function(body) {
                console.log('Bake: XHR send - Original body type/len:', typeof body, body?.length || 0, '- bakedChanges before:', Object.keys(bakedChanges || {}));
                try {
                    let bodyObj = body;
                    let wasString = false;
                    if (typeof body === 'string') {
                        wasString = true;
                        bodyObj = JSON.parse(body);
                        console.log('Bake: Parsed string to object (len:', body.length, ')');
                    } else if (body && typeof body === 'object') {
                        console.log('Bake: Direct object body - Has data?', !!bodyObj.data);
                    } else {
                        console.log('Bake: Unexpected body - Skipping');
                        return origSend.call(this, body);
                    }

                    // Parse & modify "data" (stringified map)
                    let modified = false;
                    if (bodyObj?.data && typeof bodyObj.data === 'string') {
                        let mapData;
                        try {
                            mapData = JSON.parse(bodyObj.data);
                            if (mapData?.screenObjects && Array.isArray(mapData.screenObjects)) {
                                console.log('Bake: screenObjects found (length:', mapData.screenObjects.length, ')- Applying changes');
                                bakeIntoScreenObjects(mapData.screenObjects);
                                bodyObj.data = JSON.stringify(mapData);  // Update inner data string
                                modified = true;
                                console.log('Bake: Inner data injected (new len:', bodyObj.data.length, ')');
                            } else {
                                console.log('Bake: No screenObjects - Data snippet:', bodyObj.data.substring(0, 200));
                            }
                        } catch (parseErr) {
                            console.error('Bake: Parse data error:', parseErr);
                        }
                    } else {
                        console.log('Bake: No "data" field or not string - Skipping');
                    }

                    // Re-stringify full body if was string (match original type)
                    let sendBody = body;
                    if (wasString && modified) {
                        sendBody = JSON.stringify(bodyObj);
                        console.log('Bake: Full body re-stringified (old len:', body.length, '→ new len:', sendBody.length, ')');
                    }

                    bakedChanges = {};  // Clear after
                    console.log('Bake: Forwarding', modified ? 'modified' : 'original', 'body (string)');
                    return origSend.call(this, sendBody);
                } catch (e) {
                    console.error('Bake XHR error:', e);
                    return origSend.call(this, body);  // Fallback original
                }
            };
        }
        return originalOpen.apply(this, arguments);
    };

    // 3. Internal app.saveMap Hook (For No-Network/Internal Saves)
    function hookAppSaveMap() {
        if (window.app && typeof window.app.saveMap === 'function') {
            const origSave = window.app.saveMap;
            window.app.saveMap = function(...args) {
                console.log('Bake: app.saveMap intercepted! Args:', args.length);
                let mapData = args[0] || window.app.currentMapData || window.app.mapData;
                if (mapData?.data && typeof mapData.data === 'string') {
                    let parsed = JSON.parse(mapData.data);
                    if (parsed?.screenObjects) {
                        console.log('Bake: Internal screenObjects - Applying');
                        bakeIntoScreenObjects(parsed.screenObjects);
                        mapData.data = JSON.stringify(parsed);
                        console.log('Bake: Internal injection done');
                    }
                }
                return origSave.apply(this, args);
            };
            console.log('Bake: Hooked app.saveMap (internal saves)');
        } else {
            console.log('Bake: No app.saveMap found');
        }
    }
    // Global: Patch shape creation for 'H' (init settings to prevent toJsonObject crash)
    function patchShapeCreation() {
        if (window.app && window.app.createShape) {  // Assume site has createShape or similar
            const origCreate = window.app.createShape;
            window.app.createShape = function(type, ...args) {
                const shape = origCreate.call(this, type, ...args);
                if (type === 'H' && shape && !shape.settings) {
                    shape.settings = {};
                    if (debugMode) console.log('patchShapeCreation: Initialized settings for new H shape');
                }
                return shape;
            };
            console.log('patchShapeCreation: Hooked shape creation (settings safety)');
        } else {
            // Fallback: Watch for new shapes in layers (poll every 2s post-load)
            setInterval(() => {
                if (window.app?.layers) {
                    window.app.layers.forEach(layer => {
                        if (layer?.children) {
                            layer.children.forEach(shape => {
                                if (shape.type === 'H' && !shape.settings) {
                                    shape.settings = {};
                                    if (debugMode) console.log('patchShapeCreation: Fixed existing H settings (poll)');
                                }
                            });
                        }
                    });
                }
            }, 2000);
            console.log('patchShapeCreation: Fallback poll active for H shapes');
        }
    }

    if (debugMode) console.log('Bake: Hooks ready (fetch/XHR/app.saveMap; uses "opacity" like native ID=6)');

    // Expose for console probe
    window.bakedChanges = bakedChanges;
    window.bakeIntoScreenObjects = bakeIntoScreenObjects;  // Optional: Test manual bake
    // Shared Helpers (Used by Nudges, Rotate, Eyedropper)
    function getSelectedShape() {
        try {
            if (!window.app) {
                if (debugMode) console.log('getSelectedShape: window.app missing');
                return null;
            }
            if (window.app._selectedObjects && window.app._selectedObjects.length > 0) {
                const shape = window.app._selectedObjects[0];
                if (debugMode) console.log('getSelectedShape: Found _selectedObjects[0]', { type: shape.type, points: shape.points?.length, selectedPoints: shape.selectedPoints?.length });
                return shape;
            }
            if (window.selectedShape) {
                if (debugMode) console.log('getSelectedShape: Found selectedShape');
                return window.selectedShape;
            }
            if (window.app.selectedLayer && window.app.selectedLayer.children && window.app.selectedLayer.children.length > 0) {
                if (debugMode) console.log('getSelectedShape: Found selectedLayer child');
                return window.app.selectedLayer.children[0];
            }
            if (debugMode) console.log('getSelectedShape: No selection found');
            return null;
        } catch (e) {
            console.error('getSelectedShape error:', e);
            return null;
        }
    }

    function isObjectSelected() {
        const selected = getSelectedShape() !== null;
        if (debugMode) console.log('isObjectSelected:', selected);
        return selected;
    }

    function getPosition(obj) {
        try {
            return {
                x: obj.x || (obj.position && obj.position.x) || 0,
                y: obj.y || (obj.position && obj.position.y) || 0
            };
        } catch (e) {
            console.error('getPosition error:', e);
            return { x: 0, y: 0 };
        }
    }

    console.log('Full script: Part 1 complete - Helpers ready');

    // NUDGE FUNCTIONS (Auto-Detect Point/Whole - Unchanged)
    function nudgeSelectedPoint(shape, deltaX, deltaY) {
        try {
            console.log('nudgeSelectedPoint: Starting with shape', { type: shape.type });
            let point = shape.selectedPoints?.[0] || shape.points?.[0];
            if (!point) {
                if (debugMode) console.log('nudgeSelectedPoint: No points available');
                return false;
            }

            const oldPos = getPosition(point);
            const newX = oldPos.x + deltaX;
            const newY = oldPos.y + deltaY;

            if (point.x !== undefined) {
                point.x = newX;
                point.y = newY;
            } else if (point.position) {
                point.position.x = newX;
                point.position.y = newY;
            }

            let synced = false;
            if (shape.points) {
                const idx = shape.points.findIndex(p => {
                    const px = p.x || (p.position?.x || 0);
                    const py = p.y || (p.position?.y || 0);
                    return Math.abs(px - oldPos.x) < 2 && Math.abs(py - oldPos.y) < 2;
                });
                if (idx > -1) {
                    if (shape.points[idx].x !== undefined) {
                        shape.points[idx].x = newX;
                        shape.points[idx].y = newY;
                    } else if (shape.points[idx].position) {
                        shape.points[idx].position.x = newX;
                        shape.points[idx].position.y = newY;
                    }
                    if (debugMode) console.log(`nudgeSelectedPoint: Synced to points[${idx}]`);
                    synced = true;
                } else {
                    if (debugMode) console.log('nudgeSelectedPoint: Sync skipped');
                }
            }

            if ((synced || point) && typeof shape.redraw === 'function') {
                try {
                    shape.redraw();
                    if (debugMode) console.log('nudgeSelectedPoint: shape.redraw() called (gradients/lines native)');
                } catch (e) {
                    console.error('nudgeSelectedPoint redraw error:', e);
                }
            }

            if (debugMode) console.log('nudgeSelectedPoint: Success, new pos', {x: newX, y: newY});
            return true;
        } catch (e) {
            console.error('nudgeSelectedPoint error:', e);
            return false;
        }
    }

    // NUDGE WHOLE SHAPE (Fixed: Proper Try-Catch, No Extra Return)
    function nudgeWholeShape(shape, deltaX, deltaY) {
        try {
            console.log('nudgeWholeShape: Starting with shape', { type: shape.type });
            const pos = getPosition(shape);
            const newX = pos.x + deltaX;
            const newY = pos.y + deltaY;
            if (shape.x !== undefined) {
                shape.x = newX;
                shape.y = newY;
            } else if (shape.position) {
                shape.position.x = newX;
                shape.position.y = newY;
            }

            if (typeof shape.redraw === 'function') {
                try {
                    shape.redraw();
                    if (debugMode) console.log('nudgeWholeShape: shape.redraw() called');
                } catch (e) {
                    console.error('nudgeWholeShape redraw error:', e);
                }
            }

            if (debugMode) console.log('nudgeWholeShape: Success, new pos', {x: newX, y: newY});
            return true;
        } catch (e) {
            console.error('nudgeWholeShape error:', e);
            return false;
        }
    }

    function applyNudge(deltaX, deltaY, forceWhole = false) {
        try {
            console.log('applyNudge: Starting', { deltaX, deltaY, forceWhole });
            const shape = getSelectedShape();
            if (!shape) {
                if (debugMode) console.log('applyNudge: No shape, skipping');
                return;
            }

            // AUTO-DETECT: Point if selectedPoints exist, else whole
            let isWhole = forceWhole || !(shape.selectedPoints && shape.selectedPoints.length > 0);
            if (debugMode) console.log('applyNudge: Auto-detected mode - isWhole:', isWhole, '(vertex selected?', !!(shape.selectedPoints && shape.selectedPoints.length > 0), ')');

            let success = isWhole ? nudgeWholeShape(shape, deltaX, deltaY) : nudgeSelectedPoint(shape, deltaX, deltaY);

            if (success) {
                if (window.pixiApp?.renderer?.render) {
                    window.pixiApp.renderer.render(window.pixiApp.stage);
                    console.log('applyNudge: Render called');
                } else {
                    console.log('applyNudge: pixiApp render skipped (but nudge applied)');
                }
                refreshCanvasBounds();
                const finalPos = getPosition(isWhole ? shape : (shape.selectedPoints?.[0] || shape.points?.[0] || shape));
                console.log(`applyNudge: ${isWhole ? 'Whole' : 'Point'} nudged to x=${finalPos.x}, y=${finalPos.y} (gradient-safe)`);
            } else {
                console.log('applyNudge: Failed');
            }
        } catch (e) {
            console.error('applyNudge error:', e);
        }
    }

    console.log('Full script: Part 2 complete - Nudges ready');
    // ROTATION FUNCTIONS (Whole Polygons - Center-Preserving - Unchanged)
    function getShapeCenter(shape) {
        try {
            if (shape.points && shape.points.length > 0) {
                const avgX = shape.points.reduce((sum, p) => sum + (p.x || p.position?.x || 0), 0) / shape.points.length;
                const avgY = shape.points.reduce((sum, p) => sum + (p.y || p.position?.y || 0), 0) / shape.points.length;
                return { x: avgX, y: avgY };
            }
            return getPosition(shape); // Fallback for props without points
        } catch (e) {
            console.error('getShapeCenter error:', e);
            return { x: 0, y: 0 };
        }
    }

    // ROTATE SHAPE POINTS (No Teleport: Drift-Tolerant Sync - Precision Fix)
    function rotateShapePoints(shape, angleDegrees) {
        console.log('rotateShapePoints: Starting rotation');
        if (!shape || !shape.points || shape.points.length < 3) {
            console.log('rotateShapePoints: Invalid shape/points - skip');
            return false;
        }

        const angleRad = (angleDegrees * Math.PI) / 180;  // Degrees to radians
        const cosA = Math.cos(angleRad);
        const sinA = Math.sin(angleRad);

        // Calculate original center (average points - for rotation pivot)
        let centerX = 0, centerY = 0;
        for (let i = 0; i < shape.points.length; i++) {
            centerX += shape.points[i].x;
            centerY += shape.points[i].y;
        }
        centerX /= shape.points.length;
        centerY /= shape.points.length;
        console.log(`rotateShapePoints: Original center at ${centerX.toFixed(1)}, ${centerY.toFixed(1)}`);

        // Rotate each point around center
        for (let i = 0; i < shape.points.length; i++) {
            const point = shape.points[i];
            const dx = point.x - centerX;
            const dy = point.y - centerY;
            point.x = centerX + (dx * cosA - dy * sinA);
            point.y = centerY + (dx * sinA + dy * cosA);
        }

        // Recalculate new center (check for drift due to float precision)
        let newCenterX = 0, newCenterY = 0;
        for (let i = 0; i < shape.points.length; i++) {
            newCenterX += shape.points[i].x;
            newCenterY += shape.points[i].y;
        }
        newCenterX /= shape.points.length;
        newCenterY /= shape.points.length;
        const driftX = Math.abs(newCenterX - centerX);
        const driftY = Math.abs(newCenterY - centerY);
        const totalDrift = Math.sqrt(driftX * driftX + driftY * driftY);

        // Visual update
        if (typeof shape.redraw === 'function') {
            shape.redraw();
            console.log('rotateShapePoints: shape.redraw() called');
        }

        // Sync shape.x/y only if real drift (tolerant: >0.1px - skips micro-float jumps/teleport)
        if (totalDrift > 0.1) {
            // Gentle sync (lerp if large drift - no pop)
            const lerpSteps = totalDrift > 1 ? 3 : 1;  // Multi-frame for big drifts
            let step = 0;
            const syncStep = () => {
                step++;
                const easedX = shape.x + (newCenterX - shape.x) * (step / lerpSteps);
                const easedY = shape.y + (newCenterY - shape.y) * (step / lerpSteps);
                shape.x = easedX;
                shape.y = easedY;
                if (step < lerpSteps) {
                    requestAnimationFrame(syncStep);
                } else {
                    console.log(`rotateShapePoints: Synced shape.x/y to ${newCenterX.toFixed(1)}, ${newCenterY.toFixed(1)} (drift: ${totalDrift.toFixed(2)}px)`);
                }
            };
            requestAnimationFrame(syncStep);
        } else {
            console.log('rotateShapePoints: Skipped sync (no drift - no teleport)');
        }

        console.log(`rotateShapePoints: Rotated ${shape.type || 'shape'} by ${angleDegrees}° around center (final preserved)`);
        return true;
    }

    function applyRotation(angleDegrees, forceWhole = false) {
        try {
            console.log('applyRotation: Starting', { angleDegrees, forceWhole });
            const shape = getSelectedShape();
            if (!shape) {
                if (debugMode) console.log('applyRotation: No shape, skipping');
                return;
            }

            // Only whole shapes (skip vertex mode)
            let isWhole = forceWhole || !(shape.selectedPoints && shape.selectedPoints.length > 0);
            if (!isWhole) {
                console.log('applyRotation: Vertex selected - select whole shape for rotation');
                return;
            }
            if (debugMode) console.log('applyRotation: Whole mode confirmed');

            const success = rotateShapePoints(shape, angleDegrees);

            if (success) {
                if (window.pixiApp?.renderer?.render) {
                    window.pixiApp.renderer.render(window.pixiApp.stage);
                    console.log('applyRotation: Render called');
                }
                refreshCanvasBounds();
                console.log(`applyRotation: Success - ${shape.type || 'shape'} rotated ${angleDegrees}° (gradients/lines safe)`);
            } else {
                console.log('applyRotation: Failed (check points/selection)');
            }
        } catch (e) {
            console.error('applyRotation error:', e);
        }
    }

    console.log('Full script: Part 3 complete - Rotation ready');
    // EYEDROPPER FUNCTIONS (New: Simple 9/0 Hotkeys - API Direct, Top/Bottom Gradients)
    let lastPickedColor = 0xFFFFFF;  // Not used in simple mode, but for future

    function applyEyedrop(idx) {  // idx=0 top, 1 bottom (always current colors - Independent of flip/horizontal)
        try {
            console.log(`Eyedrop: applyEyedrop called for idx=${idx} (top/bottom - independent of flip/horizontal)`);
            if (!isObjectSelected()) {
                console.log('Eyedrop: No shape selected - pick one with gradient');
                return;
            }
            const shape = getSelectedShape();
            if (!shape.colors || shape.colors.length < 2) {
                console.log('Eyedrop: Selected shape has no gradient (needs colors array >=2) - Use manual board');
                return;
            }

            const useRedFlash = false;  // Set true for red flash on opposite
            const targetLabel = idx === 0 ? 'top' : 'bottom';  // Simple, no mode

            if ('EyeDropper' in window) {
                console.log('Eyedrop: Opening browser API picker...');
                new EyeDropper().open()
                    .then((result) => {
                    const hex = result.sRGBHex;
                    const color = parseInt(hex.slice(1), 16);
                    console.log(`Eyedrop: Picked ${hex} (0x${color.toString(16).toUpperCase()}) for ${targetLabel}`);

                    const oldOpposite = shape.colors[1 - idx];

                    // Apply to current colors (no flip adjust - Independent)
                    shape.colors[idx] = color;
                    console.log(`Eyedrop: ${targetLabel} set to 0x${color.toString(16).toUpperCase()}`);

                    if (useRedFlash) {
                        shape.colors[1 - idx] = 0xFF0000;
                        console.log('Eyedrop: Red flash on opposite (1s)');
                    }

                    // Redraw only (no recreate - Keeps flip/horizontal if on, but doesn't interfere)
                    if (typeof shape.redraw === 'function') {
                        shape.redraw();
                        setTimeout(() => shape.redraw(), 50);
                    }
                    refreshCanvasBounds();  // Render only
                    console.log(`Eyedrop: Success - Set ${targetLabel} to 0x${color.toString(16).toUpperCase()} ${useRedFlash ? '+ red flash' : ''} (independent - flip/horizontal unchanged)`);

                    probeGradient(shape);
                    console.log(`Eyedrop: Post-apply colors: top=0x${shape.colors[0].toString(16).toUpperCase()}, bottom=0x${shape.colors[1].toString(16).toUpperCase()}`);

                    if (useRedFlash) {
                        setTimeout(() => {
                            shape.colors[1 - idx] = oldOpposite;
                            if (typeof shape.redraw === 'function') shape.redraw();
                            refreshCanvasBounds();
                            console.log(`Eyedrop: Reverted opposite to 0x${oldOpposite.toString(16).toUpperCase()}`);
                        }, 1000);
                    }
                })
                    .catch((err) => {
                    console.log('Eyedrop: API canceled or error:', err);  // e.g., "EyeDropper not available" - Browser issue
                });
            } else {
                console.log('Eyedrop: Browser Eyedropper API unsupported - Use manual color board');
            }
        } catch (e) {
            console.error('Eyedrop: applyEyedrop error:', e);
        }
    }
    // RECREATE & APPLY GRADIENT (v74: Simple Flip Swap + Horizontal Rotation - Independent Eyedrop)
    function recreateAndApplyGradient(shape, isFlipped, isHorizontal = false) {
        try {
            console.log(`recreateAndApplyGradient: Applying ${isFlipped ? 'flipped' : 'normal'} vertical ${isHorizontal ? '+ horizontal rotation' : ''} from [0x${shape.colors[0].toString(16).toUpperCase()}, 0x${shape.colors[1].toString(16).toUpperCase()}]`);

            // Probe first
            probeGradient(shape, true);

            // Flip: Simple live swap (no original - Changes persist, independent of eyedrop)
            if (isFlipped) {
                const temp = shape.colors[0];
                shape.colors[0] = shape.colors[1];  // Top = current bottom
                shape.colors[1] = temp;             // Bottom = current top
                console.log(`recreateAndApplyGradient: Live flipped colors [top=0x${shape.colors[0].toString(16).toUpperCase()}, bottom=0x${shape.colors[1].toString(16).toUpperCase()}] (persists after eyedrop)`);
            }

            // NEW: Horizontal - Rotate shape 90° (tilts for left-right gradient flow)
            if (isHorizontal) {
                rotateShapePoints(shape, 90);  // Fixed: No extra arg
                console.log('recreateAndApplyGradient: Rotated shape 90° for horizontal gradient (tilt warning)');
            } else if (horizontalMode === false && shape._lastRotation) {
                // Revert rotation if off (restore original points from stored)
                if (shape._originalPoints) {
                    shape.points = [...shape._originalPoints];
                    console.log('recreateAndApplyGradient: Reverted shape rotation (original points restored)');
                }
            }

            // Store original points for rotation revert (if first horizontal)
            if (isHorizontal && !shape._originalPoints) {
                shape._originalPoints = shape.points.map(p => ({x: p.x, y: p.y}));  // Deep copy
                console.log('recreateAndApplyGradient: Stored original points for horizontal revert');
            }

            // Triple redraw
            if (typeof shape.redraw === 'function') {
                shape.redraw();  // Immediate
                console.log('recreateAndApplyGradient: Shape redrawn (immediate)');
                setTimeout(() => {
                    shape.redraw();  // 50ms
                    console.log('recreateAndApplyGradient: Shape redrawn (50ms)');
                    setTimeout(() => shape.redraw(), 50);  // 100ms
                }, 50);
            }

            if (window.pixiApp?.renderer?.render) {
                window.pixiApp.renderer.render(window.pixiApp.stage);
                console.log('recreateAndApplyGradient: pixiApp render called');
            }

            probeGradient(shape, false);
            console.log(`recreateAndApplyGradient: Complete - ${isFlipped ? 'Flipped' : 'Normal'} vertical ${isHorizontal ? '(+ horizontal rotation)' : ''} (independent eyedrop - shape ${isHorizontal ? 'tilted' : 'unchanged'})`);
        } catch (e) {
            console.error('recreateAndApplyGradient error:', e);
            if (typeof shape.redraw === 'function') shape.redraw();
        }
    }

    // PROBE GRADIENT (v71: Deeper - Log shape.shape, lines, container for Hidden Fill)
    function probeGradient(shape, beforeSet = false) {
        console.log(`probeGradient: ${beforeSet ? 'Before' : 'After'} flip - Shape type: ${shape.type}, Keys:`, Object.keys(shape || {}));
        if (shape.colors) console.log(`probeGradient: Colors: [0x${shape.colors[0]?.toString(16).toUpperCase()}, 0x${shape.colors[1]?.toString(16).toUpperCase()}] | Original: [0x${shape._originalColors?.[0]?.toString(16).toUpperCase()}, 0x${shape._originalColors?.[1]?.toString(16).toUpperCase()}]`);

        // Core
        if (shape.fill) console.log(`probeGradient: shape.fill:`, shape.fill);
        if (shape._fillStyle) console.log(`probeGradient: shape._fillStyle:`, shape._fillStyle, `Color: 0x${shape._fillStyle.color?.toString(16).toUpperCase()}`);

        // shape.shape (Graphics)
        if (shape.shape) {
            console.log(`probeGradient: shape.shape (Graphics):`, shape.shape, `Keys:`, Object.keys(shape.shape));
            console.log(`probeGradient: shape.shape._fillStyle:`, shape.shape._fillStyle, `Color: 0x${shape.shape._fillStyle?.color?.toString(16).toUpperCase()}, Visible: ${shape.shape._fillStyle?.visible}`);
            console.log(`probeGradient: shape.shape.geometry:`, shape.shape.geometry, `VertexData length: ${shape.shape.vertexData?.length}`);
            if (shape.shape.batches && shape.shape.batches.length > 0) console.log(`probeGradient: shape.shape.batches[0]:`, shape.shape.batches[0]);
        }

        // shape.lines (Likely Fill Graphics - Deeper)
        if (shape.lines) {
            console.log(`probeGradient: shape.lines (Graphics?):`, shape.lines, `Keys:`, Object.keys(shape.lines));
            console.log(`probeGradient: shape.lines._fillStyle:`, shape.lines._fillStyle, `Color: 0x${shape.lines._fillStyle?.color?.toString(16).toUpperCase()}, Visible: ${shape.lines._fillStyle?.visible}`);
            console.log(`probeGradient: shape.lines.geometry:`, shape.lines.geometry, `VertexData: ${shape.lines.vertexData?.length} verts`);
            if (shape.lines._fillStyle?.texture) console.log(`probeGradient: lines fill texture (gradient?):`, shape.lines._fillStyle.texture);
            if (shape.lines.batches) console.log(`probeGradient: lines batches length: ${shape.lines.batches?.length}`);
        }

        if (shape.container?.children?.length > 0) {
            console.log(`probeGradient: container children: ${shape.container.children.length}`);
            shape.container.children.forEach((child, i) => {
                if (i < 2) {  // Limit to first 2 children (avoids spam)
                    console.log(`probeGradient: Child ${i} keys:`, Object.keys(child), `Type: ${child.type || 'Graphics?'}, Fill:`, child._fillStyle || child.fill);
                    if (child._fillStyle) console.log(`probeGradient: Child ${i} fill color: 0x${child._fillStyle.color?.toString(16).toUpperCase()}`);
                }
            });
        }

        console.log(`probeGradient: window.PIXI: ${!!window.PIXI}, pixiApp: ${!!window.pixiApp}`);
        console.log(`probeGradient: Bounds:`, shape.getBounds?.() || 'No getBounds', `Drawn: ${shape.drawn}, Selected: ${shape._selected}`);
    }

    console.log('Full script: Part 4 complete - Probe Gradient ready');
    // TOGGLE GRADIENT FLIP (v74: Simple Visual Reverse - Independent of Eyedropper)
    function toggleFlipGradient() {
        try {
            console.log(`toggleFlipGradient: Toggling flip (current: ${flipMode ? 'flipped → normal' : 'normal → flipped'})`);
            if (!isObjectSelected()) {
                console.log('toggleFlipGradient: No shape selected');
                return;
            }
            const shape = getSelectedShape();
            if (!shape.colors || shape.colors.length < 2) {
                console.log('toggleFlipGradient: No gradient (needs colors >=2)');
                return;
            }

            flipMode = !flipMode;  // Flip flag

            // Simple swap + redraw (no eyedrop mode - Picker always 9/0 top/bottom)
            recreateAndApplyGradient(shape, flipMode, false);  // No horizontal

            console.log(`toggleFlipGradient: Success - Now ${flipMode ? 'flipped' : 'normal'} vertical (live swap - eyedropper unchanged, use 9/0 for top/bottom)`);
        } catch (e) {
            console.error('toggleFlipGradient error:', e);
            flipMode = !flipMode;
        }
    }

    // TOGGLE HORIZONTAL GRADIENT (v74: 90° Rotation for Left-Right Flow - Separate from Flip)
    function toggleHorizontalGradient() {
        try {
            console.log(`toggleHorizontalGradient: Toggling horizontal (current: ${horizontalMode ? 'horizontal → normal' : 'normal → horizontal'})`);
            if (!isObjectSelected()) {
                console.log('toggleHorizontalGradient: No shape selected');
                return;
            }
            const shape = getSelectedShape();
            if (!shape.colors || shape.colors.length < 2) {
                console.log('toggleHorizontalGradient: No gradient (needs colors >=2)');
                return;
            }

            horizontalMode = !horizontalMode;  // Flip flag

            // Rotate for horizontal (tilt shape, gradient flows left-right) + redraw
            recreateAndApplyGradient(shape, flipMode, horizontalMode);  // Includes current flip if on

            console.log(`toggleHorizontalGradient: Success - Now ${horizontalMode ? 'horizontal' : 'normal'} (90° rotation - shape tilts, use X to toggle; eyedropper 9/0 unchanged)`);
        } catch (e) {
            console.error('toggleHorizontalGradient error:', e);
            horizontalMode = !horizontalMode;
        }
    }

    // REFRESH CANVAS BOUNDS (Global No-Pan: Render Only - Static View, History Red Test Style)
    function refreshCanvasBounds() {
        console.log('refreshCanvasBounds: Entered - Render only (no pan, static view)');
        try {
            if (!window.app || !window.app.viewport) {
                if (debugMode) console.log('refreshCanvasBounds: app/viewport missing - skip');
                return;
            }
            const vp = window.app.viewport;
            const shape = getSelectedShape();  // Optional for log, but no pan

            // Always render + dirty (core update, no position change)
            if (window.pixiApp?.renderer?.render) {
                window.pixiApp.renderer.render(window.pixiApp.stage);
                console.log('refreshCanvasBounds: pixiApp render called');
            }
            vp.dirty = true;  // Forces next frame without moving view

            if (shape) {
                console.log(`refreshCanvasBounds: Success - Rendered ${shape.type || 'shape'} (no pan, view static)`);
            } else {
                console.log('refreshCanvasBounds: Success - Rendered scene (no shape, no pan)');
            }
        } catch (e) {
            console.error('refreshCanvasBounds error:', e);
            // Fallback: Basic render (no pan)
            if (window.pixiApp?.renderer?.render) {
                window.pixiApp.renderer.render(window.pixiApp.stage);
                console.log('refreshCanvasBounds: Fallback render only');
            }
            if (window.app?.viewport) {
                window.app.viewport.dirty = true;
            }
        }
    }

    console.log('Full script: Part 5 complete - Toggles + Refresh ready');

    function handleKey(event) {
        try {
            const key = event.key.toLowerCase();
            if (debugMode) console.log('handleKey: Key pressed', { key, ctrl: event.ctrlKey, shift: event.shiftKey });

            let prevent = false;

            // Prop Resizing: +/- (only on props, no modifiers)
            if ((key === '+' || key === '=') && !event.ctrlKey && !event.altKey) {
                const shape = getSelectedShape();
                if (shape && (shape._texture || shape.texture)) {  // Quick prop check (from probe)
                    scaleProp(shape, 0.1);
                    prevent = true;
                } else if (debugMode) {
                    console.log('handleKey: +/= ignored - Select a PNG prop first (e.g., type "H")');
                }
            }
            if (key === '-' && !event.ctrlKey && !event.altKey) {
                const shape = getSelectedShape();
                if (shape && (shape._texture || shape.texture)) {
                    scaleProp(shape, -0.1);
                    prevent = true;
                } else if (debugMode) {
                    console.log('handleKey: - ignored - Select a PNG prop first (e.g., type "H")');
                }
            }
            // hSType Variant: V (prompt new value for 'H' hiding places)
            else if (key === 'i') {
                const shape = getSelectedShape();
                if (shape && shape.type === 'H') {
                    const newHSType = prompt(`Current hSType: ${shape.hSType || 28} (e.g., 28=bush, 46=rock, 42=algae, 44=coral)\nEnter new hSType (number):`, shape.hSType || 28);
                    if (newHSType !== null && !isNaN(newHSType)) {
                        changeHSType(shape, parseInt(newHSType));
                    }
                    prevent = true;
                } else if (debugMode) {
                    console.log('handleKey: V ignored - Select an  first');
                }
            }

            // Z-Index: Z (+10), C (-10) - No conflict with X (horizontal)
            if (key === ',' && !event.ctrlKey && !event.altKey) {  // Z: +zIndex (no mods)
                const shape = getSelectedShape();
                if (shape) {
                    const newZ = Math.min(100, (shape.zIndex || 0) + 10);  // Clamp 0-100
                    shape.zIndex = newZ;
                    storeBakedChange(shape.id, 'zIndex', newZ);
                    // Force sort for visual (Pixi draw order)
                    if (shape.parent) {
                        shape.parent.sortableChildren = true;
                        shape.parent.sortChildren();  // Sorts by zIndex
                    }
                    refreshCanvasBounds();
                    console.log(`Z-Index: +10 to ${newZ} for ${shape.type} ID ${shape.id} (sorted parent)`);
                    prevent = true;
                } else if (debugMode) {
                    console.log('handleKey: Z ignored - Select a shape first');
                }
            } else if (key === '.' && !event.ctrlKey && !event.altKey) {  // C: -zIndex (Control key, no conflict)
                const shape = getSelectedShape();
                if (shape) {
                    const newZ = Math.max(-100, (shape.zIndex || 0) - 10);  // Clamp -100-100 (negative back)
                    shape.zIndex = newZ;
                    storeBakedChange(shape.id, 'zIndex', newZ);
                    if (shape.parent) {
                        shape.parent.sortableChildren = true;
                        shape.parent.sortChildren();
                    }
                    refreshCanvasBounds();
                    console.log(`Z-Index: -10 to ${newZ} for ${shape.type} ID ${shape.id} (sorted parent)`);
                    prevent = true;
                } else if (debugMode) {
                    console.log('handleKey: C ignored - Select a shape first');
                }
            }
            // Collidable Toggle: B (true/false for terrains - walk-through)
            if (key === 'b' && !event.ctrlKey && !event.altKey) {
                const shape = getSelectedShape();
                if (shape) {
                    toggleCollidable(shape);
                    prevent = true;
                } else if (debugMode) {
                    console.log('handleKey: B ignored - Select a terrain/poly (Bg/Ter/Wat) first');
                }
            }

            // Transparency: [ / ] (decrease/increase 0.1; works on props or polygons)
            if ((key === '[' || key === ']') && !event.ctrlKey && !event.altKey) {
                const shape = getSelectedShape();
                if (shape) {
                    const delta = (key === ']') ? 0.1 : -0.1;  // ] = increase (more opaque), [ = decrease (more transparent)
                    adjustTransparency(shape, delta);
                    prevent = true;
                } else if (debugMode) {
                    console.log('handleKey: [ / ] ignored - Select a prop or polygon first');
                }
            }

            // Nudge test 'n' (v67)
            if (key === '`') {
                applyNudge(10, 10);
                prevent = true;
            }

            // Flip toggle: H (simple reverse, independent eyedrop)
            if (key === 'f') {
                console.log(`handleKey: Gradient flip toggle (H) - Current: ${flipMode ? 'flipped → normal' : 'normal → flipped'}`);
                toggleFlipGradient();
                prevent = true;
            }

            // NEW: Horizontal toggle: X (90° rotation for left-right, separate)
            if (key === 'e' && !event.shiftKey) {  // X only (no shift for zIndex conflict)
                console.log(`handleKey: Horizontal gradient toggle (X) - Current: ${horizontalMode ? 'horizontal → normal' : 'normal → horizontal'}`);
                toggleHorizontalGradient();
                prevent = true;
            }

            // Rotation R/Q (v67)
            if (key === 'q' || key === 'e') {
                const isR = key === 'q';
                const angle = (event.shiftKey ? 90 : 15) * (isR ? 1 : -1);
                applyRotation(angle);
                prevent = true;
            }

            // Nudges arrows (v67)
            if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown'].includes(key)) {
                const multiplier = event.shiftKey ? 5 : 1;
                const delta = baseNudgeAmount * multiplier;
                let deltaX = 0, deltaY = 0;
                switch (key) {
                    case 'arrowleft': deltaX = -delta; break;
                    case 'arrowright': deltaX = delta; break;
                    case 'arrowup': deltaY = -delta; break;
                    case 'arrowdown': deltaY = delta; break;
                }
                applyNudge(deltaX, deltaY);
                prevent = true;
            }

            // Eyedropper: Always 9/0 for top/bottom (independent - No 7/8, no flip/horizontal interference)
            if (key === '9' || key === '0') {
                const idx = key === '9' ? 0 : 1;
                console.log(`handleKey: Eyedropper ${key} (${idx === 0 ? 'top' : 'bottom'}) - Opening API (independent)`);
                applyEyedrop(idx);
                prevent = true;
            }

            // Ignore 7/8 (no longer used)
            if (key === '7' || key === '8') {
                console.log(`handleKey: Key ${key} ignored - Use 9/0 for top/bottom (flip/horizontal independent)`);
                prevent = true;
            }

            if (prevent) {
                event.preventDefault();
                event.stopPropagation();
                if (debugMode) console.log('handleKey: Prevented default/propagation');
            }
        } catch (e) {
            console.error('handleKey error:', e);
        }
    }

    console.log('Full script: Part 6 complete - handleKey ready');
    // RESIZE PROP (Scales PNG sprites uniformly around CENTER - Handles custom container structure)
    function scaleProp(shape, deltaScale) {
        try {
            if (!shape) {
                if (debugMode) console.log('scaleProp: No shape selected');
                return false;
            }
            // Detect prop: Custom container with _texture (PNG indicator) and scale
            if (!shape._texture && !shape.texture) {
                if (debugMode) console.log('scaleProp: Not a prop (no _texture) - Select a PNG sprite (type like "H")');
                return false;
            }
            if (!shape.scale || typeof shape.scale.x !== 'number') {
                if (debugMode) console.log('scaleProp: Prop missing valid scale (internal _x/_y?)');
                return false;
            }

            // Get current scale (handles internal _x/_y via getter)
            const oldScaleX = shape.scale.x;
            const oldScaleY = shape.scale.y;
            const newScaleX = Math.max(0.1, Math.min(5.0, oldScaleX + deltaScale));
            const newScaleY = Math.max(0.1, Math.min(5.0, oldScaleY + deltaScale));  // Uniform

            // For center-anchoring: Get current center (using _size or bounds fallback)
            let centerX, centerY;
            if (shape._size && shape._size.width && shape._size.height) {
                // Use internal _size (from probe: width/height)
                const posX = shape.position ? shape.position.x : (shape.x || 0);
                const posY = shape.position ? shape.position.y : (shape.y || 0);
                centerX = posX + (shape._size.width * oldScaleX) / 2;
                centerY = posY + (shape._size.height * oldScaleY) / 2;
            } else if (shape.getBounds) {
                // Fallback: Use Pixi bounds
                const bounds = shape.getBounds();
                centerX = bounds.x + bounds.width / 2;
                centerY = bounds.y + bounds.height / 2;
            } else {
                // Simple fallback (no center adjust if no size info)
                centerX = centerY = 0;
                if (debugMode) console.log('scaleProp: No _size/bounds - Scaling without center anchor');
            }

            // Apply scale (propagates to child _sprite)
            shape.scale.x = newScaleX;
            shape.scale.y = newScaleY;
            storeBakedChange(shape.id, 'scale', {x: newScaleX, y: newScaleY});

            // Re-center: Adjust position to keep center fixed (prevents top-left drift)
            if (centerX !== 0 || centerY !== 0) {
                const newWidth = (shape._size ? shape._size.width : 40) * newScaleX;  // Assume default if no _size
                const newHeight = (shape._size ? shape._size.height : 33) * newScaleY;
                const newPosX = centerX - newWidth / 2;
                const newPosY = centerY - newHeight / 2;

                if (shape.position) {
                    shape.position.x = newPosX;
                    shape.position.y = newPosY;
                } else {
                    shape.x = newPosX;
                    shape.y = newPosY;
                }
                if (debugMode) console.log(`scaleProp: Re-centered to (${newPosX.toFixed(1)}, ${newPosY.toFixed(1)})`);
            }

            refreshCanvasBounds();
            if (debugMode) console.log(`scaleProp: Resized prop "${shape.type || 'sprite'}" to ${newScaleX.toFixed(2)}x / ${newScaleY.toFixed(2)}y (old: ${oldScaleX.toFixed(2)}x / ${oldScaleY.toFixed(2)}y) - Type: ${shape.type}`);
            return true;
        } catch (e) {
            console.error('scaleProp error:', e);
            return false;
        }
    }

    // ADJUST TRANSPARENCY (Alpha 0-1 on props/polygons/Bg - Fill-only for polygons; Bg: alpha + _opacity sync)
    function adjustTransparency(shape, deltaAlpha) {
        try {
            if (!shape) {
                if (debugMode) console.log('adjustTransparency: No shape selected');
                return false;
            }

            let currentAlpha = 1.0;
            let isProp = shape._texture || shape.texture;
            let isPolygon = shape.points && (shape.colors || shape.shape || shape.lines);
            let isBg = shape.type === 'Bg';  // NEW: Bg detection (terrain polygons)

            if (isProp) {
                currentAlpha = shape.alpha || 1.0;
            } else if (isPolygon || isBg) {
                // Find fill object: Prioritize shape (gradient holder), fallback to lines/shape itself
                let fillObj = shape.shape || shape.lines || shape;
                if (fillObj && fillObj.parent) {  // Ensure it's a child Graphics
                    fillObj = shape.children?.find(child => child === shape.shape || child.graphicsData?.length > 0) || fillObj;
                }
                if (fillObj) {
                    currentAlpha = (fillObj._fillStyle ? fillObj._fillStyle.alpha : fillObj.alpha) || 1.0;
                } else if (isBg) {
                    // NEW: For Bg, use shape.alpha or _opacity directly (no fillStyle)
                    currentAlpha = shape.alpha || (shape._opacity !== undefined ? shape._opacity : 1.0);
                } else {
                    if (debugMode) console.log('adjustTransparency: Polygon/Bg missing fill (shape/lines)');
                    return false;
                }
            } else {
                if (debugMode) console.log('adjustTransparency: Unsupported - Select prop, polygon, or Bg');
                return false;
            }

            const newAlpha = Math.max(0.0, Math.min(1.0, currentAlpha + deltaAlpha));
            storeBakedChange(shape.id, 'opacity', newAlpha);  // Bake for save (all types)

            // NEW: Direct sync to screenObjects for immediate persistence (Bg + others if present)
            if (window.app && window.app.screenObjects) {
                const soKey = shape.id.toString();
                const soObj = window.app.screenObjects[soKey];
                if (soObj) {
                    soObj.opacity = newAlpha;  // Persistent data (reload applies to visuals)
                    if (debugMode) console.log(`adjustTransparency: Synced screenObjects['${soKey}'].opacity = ${newAlpha.toFixed(1)}`);
                }
            }

            if (isProp) {
                // OLD: Prop handling unchanged (full sprite fade)
                shape.alpha = newAlpha;
                if (debugMode) console.log(`adjustTransparency: Prop alpha set to ${newAlpha.toFixed(1)}`);
            } else if (isPolygon) {
                // OLD: Polygon handling unchanged (fill/gradient fade)
                let fillObj = shape.shape || shape.lines || shape;
                if (fillObj.parent) {
                    fillObj = shape.children?.find(child => child === shape.shape || child.graphicsData?.length > 0) || fillObj;
                }
                if (fillObj) {
                    if (fillObj._fillStyle) fillObj._fillStyle.alpha = newAlpha;
                    fillObj.alpha = newAlpha;  // Direct Graphics fade
                    if (typeof shape.redraw === 'function') {
                        shape.redraw();  // Rebuild
                        setTimeout(() => shape.redraw(), 50);  // Ensure propagation
                        setTimeout(() => shape.redraw(), 100);  // Triple for gradients
                    }
                    if (debugMode) console.log(`adjustTransparency: Polygon ${fillObj === shape.shape ? 'shape' : 'lines'} alpha set to ${newAlpha.toFixed(1)} (gradient rebuild x3)`);
                }
            } else if (isBg) {
                // NEW: Bg-specific (terrain: direct alpha + _opacity; no redraw, as Pixi handles)
                shape.alpha = newAlpha;
                if (shape._opacity !== undefined) shape._opacity = newAlpha;  // Internal prop (from probe)
                window.app.worldDirty = true;  // Flag for save
                if (debugMode) console.log(`adjustTransparency: Bg ID=${shape.id} alpha/_opacity set to ${newAlpha.toFixed(1)} (persistent via screenObjects + bake)`);
            }

            refreshCanvasBounds();
            if (debugMode) console.log(`${isProp ? 'Prop' : isBg ? 'Bg' : 'Polygon'} transparency to ${newAlpha.toFixed(1)} (old: ${currentAlpha.toFixed(1)}) - Type: ${shape.type}`);
            return true;
        } catch (e) {
            console.error('adjustTransparency error:', e);
            // Recalculate for scope (safe redraw if polygon/Bg)
            const isProp = shape._texture || shape.texture;
            const isPolygon = shape.points && (shape.colors || shape.shape || shape.lines);
            const isBg = shape.type === 'Bg';
            if ((isPolygon || isBg) && typeof shape?.redraw === 'function') shape.redraw();
            return false;
        }
    }
    // CHANGE HIDE TYPE (hSType for 'H' - Sprite variant, e.g., 28=bush → 46=rock)
    function changeHSType(shape, newHSType) {
        try {
            if (!shape) {
                if (debugMode) console.log('changeHSType: No shape selected');
                return false;
            }
            if (shape.type !== 'H') {
                if (debugMode) console.log('changeHSType: Not a hiding place - Select  (Layer 11)');
                return false;
            }
            if (!shape.settings) shape.settings = {};  // Ensure settings exists (site expects for hSType serialization)
            const oldHSType = shape.hSType || 28;  // Default bush
            if (!shape.settings) shape.settings = {};  // Ensure settings exists
            shape.hSType = newHSType;  // Live sprite/texture swap
            shape.settings.id = newHSType;  // Sync to settings.id (matches site toJsonObject expectation for hSType)
            if (debugMode) console.log(`changeHSType: Synced hSType=${newHSType} to settings.id for safety`);

            // Sync to screenObjects (immediate persistence)
            if (window.app && window.app.screenObjects) {
                const soKey = shape.id.toString();
                const soObj = window.app.screenObjects[soKey];
                if (soObj) {
                    soObj.hSType = newHSType;
                    if (debugMode) console.log(`changeHSType: Synced screenObjects['${soKey}'].hSType = ${newHSType}`);
                }
            }

            // Bake for save
            storeBakedChange(shape.id, 'hSType', newHSType);

            // Refresh visual
            if (typeof shape.redraw === 'function') {
                shape.redraw();
                setTimeout(() => shape.redraw(), 50);
            }
            refreshCanvasBounds();
            window.app.worldDirty = true;

            if (debugMode) console.log(`changeHSType: ID=${shape.id} ('H') from ${oldHSType} → ${newHSType} (e.g., 28=bush, 46=rock)`);
            return true;
        } catch (e) {
            console.error('changeHSType error:', e);
            if (typeof shape?.redraw === 'function') shape.redraw();
            return false;
        }
    }


    // TOGGLE COLLIDABLE (Settings.collidable true/false for terrains/polygons - Walk-through toggle)
    function toggleCollidable(shape) {
        try {
            if (!shape) {
                if (debugMode) console.log('toggleCollidable: No shape selected');
                return false;
            }
            if (!shape.points || !shape.settings) {
                if (debugMode) console.log('toggleCollidable: Not a terrain/poly (needs points + settings) - Select Bg/Ter/Wat/etc.');
                return false;
            }

            if (!shape.settings) shape.settings = {};  // Ensure settings exists (prevents null crash)
            const currentCollidable = shape.settings.collidable !== false;  // Default true if undefined
            const newCollidable = !currentCollidable;  //
            if (!shape.settings) shape.settings = {};
            shape.settings.collidable = newCollidable;  // Live visual/collision update

            // Sync to screenObjects (immediate persistence)
            if (window.app && window.app.screenObjects) {
                const soKey = shape.id.toString();
                const soObj = window.app.screenObjects[soKey];
                if (soObj) {
                    if (!soObj.settings) soObj.settings = {};
                    soObj.settings.collidable = newCollidable;
                    if (debugMode) console.log(`toggleCollidable: Synced screenObjects['${soKey}'].settings.collidable = ${newCollidable}`);
                }
            }

            // Bake for save (store in changes)
            storeBakedChange(shape.id, 'settings', {collidable: newCollidable});

            // Refresh collision/visuals
            window.app.worldDirty = true;  // Flag save
            if (typeof shape.redraw === 'function') {
                shape.redraw();  // Rebuild shape (collision props)
                setTimeout(() => shape.redraw(), 50);  // Ensure update
            }
            refreshCanvasBounds();  // Render + collision layer

            const status = newCollidable ? 'collidable (blocks)' : 'non-collidable (walk-through)';
            if (debugMode) console.log(`toggleCollidable: ID=${shape.id} (${shape.type}) → ${status} (persistent via screenObjects + bake)`);
            return true;
        } catch (e) {
            console.error('toggleCollidable error:', e);
            if (typeof shape?.redraw === 'function') shape.redraw();
            return false;
        }
    }


    console.log('Full script: Part 7 complete - adjustTransparency ready');

    // INIT FEATURES (Original: Retry for App Ready + Add Keydown Listeners)
    function initFeatures() {
        try {
            console.log('initFeatures: Starting initialization');
            if (!window.app) {
                console.log('initFeatures: window.app not ready - retrying...');
                setTimeout(initFeatures, 2000);  // Retry every 2s (up to ~10s total if called 5x)
                return;
            }

            // Add keydown listener (capture phase, to document/canvas/window for full coverage)
            if (!keyHandler) {
                keyHandler = (event) => handleKey(event);
                document.addEventListener('keydown', keyHandler, true);  // Capture=true for early intercept
                if (window.app.canvas) {
                    window.app.canvas.addEventListener('keydown', keyHandler, true);
                }
                window.addEventListener('keydown', keyHandler, true);
                console.log('initFeatures: Keydown listeners added (document/canvas/window)');
                hookAppSaveMap();  // Internal save hook
                console.log('Bake: Internal hook added');
                // Early PIXI probe
                getPixiLib();
                probeGradient({});  // Empty call to log global PIXI status
            } else {
                console.log('initFeatures: Key handler already active');
            }

            // Initial getSelectedShape test
            const initialShape = getSelectedShape();
            console.log('initFeatures: Initial shape check', initialShape ? { type: initialShape.type, points: initialShape.points?.length } : 'None');

            // Welcome log (deduped - clean version)
            console.log('%c🎨 MapMaker+ v2025-09-23e Loaded! 🚀', 'color: #4CAF50; font-size: 16px; font-weight: bold');
            console.log('• Arrows: Nudge (Shift x5, auto point/whole)');
            console.log('• R/Q: Rotate 15° (Shift 90°, whole only - center preserved)');
            console.log('• 9/0: Eyedropper API (top/bottom gradient colors)');
            console.log('• H: Toggle gradient flip (vertical reverse via color swap)');
            console.log('• X: Toggle horizontal gradient (90° rotation for left-right flow)');
            console.log('• +/-: Resize selected prop (0.1x steps, 0.1–5x; center-anchored)');
            console.log('• [ / ]: Adjust transparency (0.1 steps, 0–1; ]=more opaque) - Props full, polygons fill/gradient');
            console.log('• Z/C: Z-Index (+/-10,  -100 to 100; higher=front) - All shapes');
            console.log('• Debug: Console logs ON | Probe: getSelectedShape() | Reload: Ctrl+Shift+R');
            console.log('• Baking: Scale/opacity/zIndex persist on save/refresh (Network check for "id\":X")');

            console.log('initFeatures: Complete - Features active (nudges/rotate/eyedropper/baking)');
        } catch (e) {
            console.error('initFeatures error:', e);
            // Retry once more
            setTimeout(initFeatures, 2000);
        }
        // Permanent Global Exposure (for console probes)
        window.getSelectedShape = getSelectedShape;
        window.bakedChanges = bakedChanges;
        window.refreshCanvasBounds = refreshCanvasBounds;  // Bonus: For manual redraw
        console.log('Script: Exposed getSelectedShape, bakedChanges, refreshCanvasBounds globally');
    }

    // ENHANCED: restoreProps (Apply Persistent Props from screenObjects to Visuals Post-Load)
    function restoreProps(shape) {
        if (!shape || !shape.id) return false;
        const id = shape.id;
        const soKey = id.toString();
        const soObj = window.app?.screenObjects?.[soKey];
        if (!soObj) {
            if (debugMode) console.log('restoreProps: No screenObjects for ID ' + id + ' (' + shape.type + ')');
            return false;
        }
        // Ensure settings for 'H' shapes (prevents site toJsonObject crash on hSType)
        if (shape.type === 'H' && !shape.settings) {
            shape.settings = {};  // Minimal init
            if (debugMode) console.log(`restoreProps: Initialized empty settings for H ID ${id} (null safety)`);
            restored = true;  // Flag as restored (logs it)
        }

        let restored = false;
        const soChanges = {};  // Temp for logs

        // Apply Scale (for 'H'/'P' sprites - uniform x/y from saved {x,y} or scalar)
        if ((shape.type === 'H' || shape.type === 'P') && soObj.scale) {
            const savedScale = soObj.scale;
            const newScaleX = savedScale.x || 1.0;
            const newScaleY = savedScale.y || 1.0;
            shape.scale.x = newScaleX;
            shape.scale.y = newScaleY;
            soChanges.scale = {x: newScaleX, y: newScaleY};

            // Re-center anchor (prevent top-left drift on load-scale)
            let centerX, centerY;
            if (shape._size && shape._size.width && shape._size.height) {
                const posX = shape.position ? shape.position.x : (shape.x || 0);
                const posY = shape.position ? shape.position.y : (shape.y || 0);
                const baseWidth = shape._size.width;
                const baseHeight = shape._size.height;
                centerX = posX + (baseWidth * 1.0) / 2;  // Use base (pre-scale) for anchor
                centerY = posY + (baseHeight * 1.0) / 2;
                const newWidth = baseWidth * newScaleX;
                const newHeight = baseHeight * newScaleY;
                const newPosX = centerX - newWidth / 2;
                const newPosY = centerY - newHeight / 2;
                if (shape.position) {
                    shape.position.x = newPosX;
                    shape.position.y = newPosY;
                } else {
                    shape.x = newPosX;
                    shape.y = newPosY;
                }
                if (debugMode) console.log(`restoreProps: Re-centered ID ${id} (${shape.type}) after scale load`);
            }

            restored = true;
        } else if (soObj.size && (shape.type === 'H' || shape.type === 'P')) {  // Fallback scalar
            const savedSize = soObj.size || 1.0;
            shape.scale.x = savedSize;
            shape.scale.y = savedSize;
            soChanges.scale = savedSize;
            // Re-center similar to above (omit for brevity; add if needed)
            restored = true;
        }

        // Apply Opacity (all types: 'H'/'P'/Bg/polygons - from saved opacity)
        if (soObj.opacity !== undefined) {
            const savedOpacity = soObj.opacity;
            let fillObj = shape;  // Default to shape
            if (shape.type === 'Bg') {
                shape.alpha = savedOpacity;
                if (shape._opacity !== undefined) shape._opacity = savedOpacity;
            } else if (shape.points && (shape.colors || shape.shape || shape.lines)) {  // Polygons
                fillObj = shape.shape || shape.lines || shape;
                if (fillObj._fillStyle) fillObj._fillStyle.alpha = savedOpacity;
                fillObj.alpha = savedOpacity;
                if (typeof shape.redraw === 'function') {
                    shape.redraw();
                    setTimeout(() => shape.redraw(), 50);
                }
            } else {  // Props ('H'/'P')
                shape.alpha = savedOpacity;
            }
            soChanges.opacity = savedOpacity;
            restored = true;
        }

        // Apply Z-Index (all types - sort parent if needed)
        if (soObj.zIndex !== undefined) {
            shape.zIndex = soObj.zIndex;
            if (shape.parent) {
                shape.parent.sortableChildren = true;
                shape.parent.sortChildren();
            }
            soChanges.zIndex = soObj.zIndex;
            restored = true;
        }
        // Apply Collidable (terrains/polygons: from saved settings)
        if (soObj.settings && soObj.settings.collidable !== undefined && shape.settings) {
            shape.settings.collidable = soObj.settings.collidable;
            soChanges.collidable = soObj.settings.collidable;
            if (typeof shape.redraw === 'function') {
                shape.redraw();
                setTimeout(() => shape.redraw(), 50);
            }
            restored = true;
        }
        // Apply hSType (for 'H': from saved)
        if (soObj.hSType !== undefined && shape.type === 'H') {
            shape.hSType = soObj.hSType;
            soChanges.hSType = soObj.hSType;
            if (typeof shape.redraw === 'function') {
                shape.redraw();
                setTimeout(() => shape.redraw(), 50);
            }
            restored = true;
        }
        if (restored && debugMode) {
            console.log(`restoreProps: Applied to ID ${id} (${shape.type}):`, soChanges);
        }
        return restored;
    }

    // PART 9: PINK THEME OVERRIDE (#F3CFC6) for Mapmaker UI
    // Add at script end. Applies on load - Overrides grey/dark elements with pink palette.



    (function applyPinkTheme() {
        // Wait for mapmaker to load (body + canvas)
        if (!document.body || !document.querySelector('canvas')) {
            setTimeout(applyPinkTheme, 500);  // Retry
            return;
        }

        // Remove any existing theme style (avoid duplicates)
        const existing = document.getElementById('pink-theme-style');
        if (existing) existing.remove();

        // Inject CSS Theme
        const style = document.createElement('style');
        style.id = 'pink-theme-style';
        // In applyPinkTheme(): Replace the style.textContent with this
        style.textContent = `

    body, html {
        background-color: #F3CFC6 !important;
        color: #4A2C2C !important;
        font-family: Arial, sans-serif !important;
    }


    .panel, .ui-panel, .toolbar, .sidebar, .layers-panel, .tools-panel,
    .mapmaker-container, div[class*="panel"], div[class*="toolbar"],
    .left-sidebar, .tools, .m-section, .list {  /* New: Target sidebar & tools */
        background-color: rgba(243, 207, 198, 0.9) !important;
        border: 1px solid #D9A8A0 !important;
        color: #4A2C2C !important;
        box-shadow: 0 2px 8px rgba(217, 168, 160, 0.3) !important;
    }


    button, .button, input[type="button"], .btn, [class*="button"],
    .icon-button {
        background-color: #E8B8B0 !important;
        border: 0px solid #D9A8A0 !important;
        color: #4A2C2C !important;
        border-radius: 4px !important;
        padding: 3px 14px !important;
        cursor: pointer !important;
    }

    div.name {
    color: #4A2C2C !important;
    }

    .main-menu, .map-info, .map-creator, .name {
    color: #292929 !important;
    }
    .main-menu .menu .menu-item {
    padding: 0 15px;
    font-size: 1em;
    color: #292929;
    cursor: default;
    height: 22px;
    line-height: 22px;
}
.main-menu .map-info .map-name .id {
    font-size: .8em;
    color: #292929;
    margin-right: 3px;
}

.col-6 {
    width: 50%;
}

    button:hover, .button:hover, input[type="button"]:hover, .btn:hover, .icon-button:hover {
        background-color: #D9A8A0 !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 2px 4px rgba(217, 168, 160, 0.4) !important;
    }
    button:active, .button:active, .btn:active, .icon-button:active {
        background-color: #C89F90 !important;
        transform: translateY(0) !important;
    }
    .btn.icon-button.on {  /* Active state (e.g., selected tool) */
        background-color: #D9A8A0 !important;  /* Slightly darker pink for "on" */
        box-shadow: inset 0 2px 4px rgba(217, 168, 160, 0.3) !important;
    }
    /* Shrink Icon Buttons (e.g., remove_red_eye - Smaller Size) */
.btn.icon-button, .btn.icon-button.on {
    padding: 4px !important;  /* Reduce from default ~8-12px */
    width: 24px !important;   /* Fixed small width */
    height: 24px !important;  /* Fixed small height */
    min-width: unset !important;  /* Override any min-size */
    font-size: 16px !important;   /* Smaller icon */
    color: #4A2C2C !important;
    line-height: 1 !important;    /* Tighten vertical */
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transform: scale(0.9) !important;  /* Overall 10% smaller (optional - remove if too tiny) */
}
.btn.icon-button i.material-icon, .btn.icon-button.on i.material-icon {
    font-size: 16px !important;  /* Match button size */
    width: 16px !important;
    height: 16px !important;
}
.btn.icon-button:hover {
    transform: scale(1.0) !important;  /* Hover back to normal size */
}


    /* Inputs & Selects (Target .inline Specifically) */
    input, select, textarea, input.inline {  /* New: input.inline (rgb(214,214,214)) */
        background-color: #F0E6E0 !important;
        border: 1px solid #D9A8A0 !important;
        color: #4A2C2C !important;
        border-radius: 4px !important;
        padding: 6px !important;
    }
    input:focus, select:focus, textarea:focus, input.inline:focus {
        outline: 2px solid #E8B8B0 !important;
        border-color: #E8B8B0 !important;
    }

    /* Toolbars & Menus (Top/Bottom Bars - Unchanged) */
    .toolbar-top, .toolbar-bottom, .menu-bar, nav, header, footer {
        background-color: #E8B8B0 !important;
        border-bottom: 1px solid #D9A8A0 !important;
        color: #4A2C2C !important;
    }

.world-settings .setting .key[data-v-815b0b66] {
    color: #111111;
    text-align: left;
}
.world-settings .content[data-v-815b0b66] {
    font-size: .8em;
    color: #352423;
}
.layers .list .layer .meta .name[data-v-f9c33b4a] {
    font-size: .88em;
}

.right-sidebar .m-section[data-v-17e9738e] .title-bar .title {
    --tw-text-opacity: 1;
    color: rgb(255 255 255);
    background-color: #634348;
    padding: 4px 11px 1px;
    font-size: .9em;
    border-radius: 0 2px 0 0;
}


    /* Layers & Selection Panels (Enhanced for .tool & .has-tooltip) */
    .layer-item, .selected-item, ul[class*="list"], li,
    .tool, .has-tooltip {  /* New: .tool & .has-tooltip (sidebar icons/tools) */
        background-color: rgba(243, 207, 198, 0.7) !important;
        border: 1px solid #D9A8A0 !important;
        color: #4A2C2C !important;
        border-radius: 4px !important;  /* Round tools */
    }
    .layer-item:hover, .selected-item:hover, .tool:hover, .has-tooltip:hover {
        background-color: #E8B8B0 !important;
        transform: scale(1.05) !important;  /* Subtle zoom on hover */
    }
    .tool.active {  /* Active tool (e.g., pan_tool selected) */
        background-color: #D9A8A0 !important;
        border-color: #C89F90 !important;
        box-shadow: 0 0 0 2px rgba(217, 168, 160, 0.5) !important;
    }

    /* Material Icons (Grey Icons in Tools -> Pink Tint) */
    i.material-icon, .material-icon {  /* New: Icons like build, pan_tool (likely grey fill) */
        color: #4A2C2C !important;  /* Dark pink/brown for visibility */
        fill: #4A2C2C !important;  /* For SVG fills */
        background-color: transparent !important;
    }
    .tool:hover i.material-icon {
        color: #E8B8B0 !important;  /* Lighter on hover */
    }

    /* Canvas Wrapper (Unchanged - Safe) */
    .canvas-container, #gameCanvas, canvas {
        background-color: transparent !important;
    }
    .canvas-overlay, .selection-box, .grid {
        border-color: #E8B8B0 !important;
        background-color: rgba(232, 184, 176, 0.2) !important;
    }

    /* Scrollbars (Unchanged) */
    ::-webkit-scrollbar {
        width: 8px !important;
    }
    ::-webkit-scrollbar-track {
        background: #F3CFC6 !important;
    }
    ::-webkit-scrollbar-thumb {
        background: #E8B8B0 !important;
        border-radius: 4px !important;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #D9A8A0 !important;
    }

    /* Dark Elements Fallback (Unchanged) */
    [class*="dark"], .dark-theme, body.dark {
        background-color: #F3CFC6 !important;
        filter: hue-rotate(0deg) brightness(1.1) !important;
    }

    /* Specific Mapmaker Selectors (Enhanced) */
    #layers-panel, #tools-panel, .property-panel,
    .reaction-panel {  /* New: From probe - reaction-panel (transparent -> pink) */
        background: linear-gradient(to bottom, #F3CFC6, #E8B8B0) !important;
    }
    .save-button, .load-button, .export-button {
        background: #E8B8B0 !important;
        color: #4A2C2C !important;
    }
    .children-inline {  /* From probe - If needed for inline children */
        background-color: rgba(243, 207, 198, 0.5) !important;
    }

    /* Transitions for Smooth Load (Unchanged) */
    * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
    }
`;
    document.head.appendChild(style);

    // Optional: Toggle Theme Hotkey (Press 'T' to Enable/Disable)
    let themeEnabled = true;
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 't' && e.ctrlKey && !e.altKey) {  // Ctrl+T
            themeEnabled = !themeEnabled;
            if (themeEnabled) {
                style.disabled = false;
                console.log('Pink Theme: Enabled');
            } else {
                style.disabled = true;
                console.log('Pink Theme: Disabled (Grey Default)');
            }
            e.preventDefault();
        }
    });

    if (debugMode) console.log('Pink Theme (#F3CFC6) Applied! Ctrl+T to toggle. Inspect elements to refine selectors.');
})();


// Restore All Shapes After Load (Scan Layers + Apply from screenObjects)
setTimeout(() => {
    if (!window.app) {
        console.log('restoreProps: app not ready - retrying in 1s');
        setTimeout(() => {
            if (!window.app) {
                console.log('restoreProps: app not ready - retrying in 1s');
                // ... existing retry logic
            }
        }, 1000);  // Named retry via arrow function (replaces deprecated arguments.callee) ;
        return;
    }

    const layers = window.app.layers || [];
    let restoredCount = 0;
    layers.forEach((layer, layerIdx) => {
        if (layer && layer.children && layer.children.length > 0) {
            layer.children.forEach(child => {
                if (child.id && (child.type === 'H' || child.type === 'P' || child.type === 'Bg' || child.points)) {  // Target props/Bg/polygons
                    if (restoreProps(child)) restoredCount++;
                }
            });
            if (debugMode) console.log(`restoreProps: Scanned Layer ${layerIdx} (${layer.children.length} children)`);
        }
    });

    // Fallback: Scan pixiApp.stage if layers empty
    if (layers.length === 0 && window.pixiApp?.stage?.children) {
        window.pixiApp.stage.children.forEach(child => {
            if (child.id && (child.type === 'H' || child.type === 'P' || child.type === 'Bg' || child.points)) {
                if (restoreProps(child)) restoredCount++;
            }
        });
    }

    if (debugMode) console.log(`restoreProps: Complete - Restored ${restoredCount} shapes (scale/opacity/zIndex from screenObjects)`);
    window.app.worldDirty = false;  // Clear dirty flag post-restore
    refreshCanvasBounds();  // Final render (applies visuals)
}, 1500);  // Delay for full load (increase to 2000 if shapes lag)
console.log('• Persistence: Scale & alpha now survive refresh (baking via hooks; probe bakedChanges)');

// START: DOM Ready Check + Delay Init (Original)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initFeatures, 1000);  // 1s delay post-DOM for app load
    });
} else {
    setTimeout(initFeatures, 1000);  // Already loaded
}

// CLEANUP: Remove listeners on unload (prevents leaks)
window.addEventListener('beforeunload', () => {
    if (keyHandler) {
        document.removeEventListener('keydown', keyHandler, true);
        if (window.app?.canvas) {
            window.app.canvas.removeEventListener('keydown', keyHandler, true);
        }
        window.removeEventListener('keydown', keyHandler, true);
        console.log('Cleanup: Key listeners removed');
    }
});

console.log('Full script: All parts complete - IIFE closed, ready for mapmaker load!');
})();  // End of IIFE