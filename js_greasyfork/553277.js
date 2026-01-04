// ==UserScript==
// @name         Bouncy Shaded Cube Final Release
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Spawns multiple bouncy 3D objects with shape selection, corrected collision, and a settings UI.
// @author       alisteveman12
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
// @require      https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js
// @run-at       document-idle
// @icon       data:image/jpeg;base64,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
// @downloadURL https://update.greasyfork.org/scripts/553277/Bouncy%20Shaded%20Cube%20Final%20Release.user.js
// @updateURL https://update.greasyfork.org/scripts/553277/Bouncy%20Shaded%20Cube%20Final%20Release.meta.js
// ==/UserScript==

(function( ) {
    'use strict';

    // Check if THREE is loaded. If not, wait and check again.
    if (typeof window.THREE === 'undefined') {
        window.setTimeout(arguments.callee, 100);
        return;
    }

    // --- Configuration (Stored in GM_values) ---
    const DEFAULT_SETTINGS = {
        SHAPE: 'Cube', // New setting
        CUBE_SIZE: 50,
        SPEED: 2,
        BOUNCE_HEIGHT: 10,
        BOUNCE_SPEED: 0.05,
        MAX_CUBES: 10,
        COLLISION_ENABLED: true,
        CUBE_COLOR: 0x00ff00 // Default green color
    };

    let settings = {};

    // --- Global State Variables ---
    let cubeIsRunning = false;
    let animationFrameId = null;
    let canvas = null;
    let renderer = null;
    let scene = null;
    let camera = null;
    let cubes = [];
    let cubeButton = null;
    let spawnMoreButton = null;
    let deleteCubeButton = null;
    let settingsButton = null;
    let settingsPanel = null;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // --- Cube Class (to manage multiple cubes) ---
    class BouncyCube {
        constructor(color) {
            let geometry;
            const size = settings.CUBE_SIZE;

            switch (settings.SHAPE) {
                case 'Sphere':
                    geometry = new THREE.SphereGeometry(size / 2, 32, 32);
                    break;
                case 'Tetrahedron':
                    geometry = new THREE.TetrahedronGeometry(size / 2);
                    break;
                case 'Custom':
                    // --- Placeholder for Custom Model Loading ---
                    console.warn("Custom Model selected, but not yet implemented. Defaulting to Cube.");
                    geometry = new THREE.BoxGeometry(size, size, size);
                    break;
                case 'Cube':
                default:
                    geometry = new THREE.BoxGeometry(size, size, size);
                    break;
            }

            this.geometry = geometry;
            const objectColor = color || Math.random() * 0xffffff;
            this.material = new THREE.MeshPhongMaterial({ color: objectColor, shininess: 30 });
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            scene.add(this.mesh);

            // Initial random position and velocity
            this.cubeX = Math.random() * width;
            this.cubeY = Math.random() * height;
            this.velocityX = (Math.random() > 0.5 ? 1 : -1) * (settings.SPEED + Math.random() * 1);
            this.velocityY = (Math.random() > 0.5 ? 1 : -1) * (settings.SPEED + Math.random() * 1);
            this.timeOffset = Math.random() * 100;

            // Set initial world position
            const worldPos = screenToWorld(this.cubeX, this.cubeY);
            this.mesh.position.x = worldPos.x;
            this.mesh.position.y = worldPos.y;
        }

        update() {
            // 1. Update position based on screen coordinates
            this.cubeX += this.velocityX;
            this.cubeY += this.velocityY;
            this.timeOffset += settings.BOUNCE_SPEED;

            // 2. Collision detection (on screen edges)
            const halfSize = settings.CUBE_SIZE / 2;
            if (this.cubeX + halfSize > width || this.cubeX - halfSize < 0) {
                this.velocityX = -this.velocityX;
                this.cubeX = Math.max(halfSize, Math.min(width - halfSize, this.cubeX));
            }

            if (this.cubeY + halfSize > height || this.cubeY - halfSize < 0) {
                this.velocityY = -this.velocityY;
                this.cubeY = Math.max(halfSize, Math.min(height - halfSize, this.cubeY));
            }

            // 3. Convert screen position to world position for rendering
            const worldPos = screenToWorld(this.cubeX, this.cubeY);
            this.mesh.position.x = worldPos.x;
            this.mesh.position.y = worldPos.y;

            // 4. "Bounce" effect (up and down along the Z-axis)
            this.mesh.position.z = Math.sin(this.timeOffset) * settings.BOUNCE_HEIGHT;

            // 5. Rotation for visual interest
            this.mesh.rotation.x += 0.01;
            this.mesh.rotation.y += 0.01;
        }

        dispose() {
            scene.remove(this.mesh);
            this.geometry.dispose();
            this.material.dispose();
        }
    }

    // --- Utility Functions ---

    function loadSettings() {
        settings = GM_getValue('bouncyCubeSettings', DEFAULT_SETTINGS);
        // Ensure all default keys exist in case of new settings
        settings = { ...DEFAULT_SETTINGS, ...settings };
    }

    function saveSettings() {
        GM_setValue('bouncyCubeSettings', settings);
    }

    // Function to convert screen coordinates to Three.js world coordinates
    function screenToWorld(x, y) {
        const vector = new THREE.Vector3();
        vector.set(
            (x / width) * 2 - 1,
            -(y / height) * 2 + 1,
            0.5
        );
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));
        return pos;
    }

    function onWindowResize() {
        if (!cubeIsRunning) return;

        width = window.innerWidth;
        height = window.innerHeight;

        // Update canvas size
        canvas.width = width;
        canvas.height = height;

        // Update camera aspect ratio
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // Update renderer size
        renderer.setSize(width, height);
    }

    function checkCollisions() {
        if (!settings.COLLISION_ENABLED) return;

        for (let i = 0; i < cubes.length; i++) {
            for (let j = i + 1; j < cubes.length; j++) {
                const cubeA = cubes[i];
                const cubeB = cubes[j];

                const dx = cubeA.cubeX - cubeB.cubeX;
                const dy = cubeA.cubeY - cubeB.cubeY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = settings.CUBE_SIZE;

                if (distance < minDistance) {
                    // Collision detected
                    const angle = Math.atan2(dy, dx);
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);

                    // Rotate velocities to the collision axis
                    const vA = { x: cubeA.velocityX, y: cubeA.velocityY };
                    const vB = { x: cubeB.velocityX, y: cubeB.velocityY };

                    const uA = {
                        x: vA.x * cos + vA.y * sin,
                        y: vA.y * cos - vA.x * sin
                    };
                    const uB = {
                        x: vB.x * cos + vB.y * sin,
                        y: vB.y * cos - vB.x * sin
                    };

                    // Swap x velocities (perfect elastic collision)
                    const vFinalA = { x: uB.x, y: uA.y };
                    const vFinalB = { x: uA.x, y: uB.y };

                    // Rotate back to original coordinate system
                    cubeA.velocityX = vFinalA.x * cos - vFinalA.y * sin;
                    cubeA.velocityY = vFinalA.y * cos + vFinalA.x * sin;

                    cubeB.velocityX = vFinalB.x * cos - vFinalB.y * sin;
                    cubeB.velocityY = vFinalB.y * cos + vFinalB.x * sin;

                    // Separation to prevent sticking (crucial fix)
                    const overlap = minDistance - distance;
                    const separationX = overlap * cos;
                    const separationY = overlap * sin;

                    // Move both cubes apart by half the overlap
                    cubeA.cubeX += separationX * 0.5;
                    cubeA.cubeY += separationY * 0.5;
                    cubeB.cubeX -= separationX * 0.5;
                    cubeB.cubeY -= separationY * 0.5;
                }
            }
        }
    }

    function animate() {
        animationFrameId = requestAnimationFrame(animate);

        // Update all cubes
        cubes.forEach(cube => cube.update());

        // Check for collisions
        checkCollisions();

        // Render the scene
        renderer.render(scene, camera);
    }

    function updateButtonVisibility() {
        const hasCubes = cubes.length > 0;

        if (spawnMoreButton) {
            spawnMoreButton.style.display = hasCubes ? 'block' : 'none';
            spawnMoreButton.textContent = `Spawn More (${cubes.length}/${settings.MAX_CUBES})`;
        }

        if (deleteCubeButton) {
            deleteCubeButton.style.display = hasCubes ? 'block' : 'none';
            deleteCubeButton.textContent = `Delete (${cubes.length})`;
        }

        if (settingsButton) {
            settingsButton.style.display = hasCubes ? 'block' : 'none';
            // Also hide the settings panel if the button is hidden
            if (!hasCubes && settingsPanel) {
                settingsPanel.style.display = 'none';
            }
        }

        // Update main toggle button text
        cubeButton.textContent = hasCubes ? 'Stop Objects' : 'Start Objects';
    }

    function spawnCube() {
        if (cubes.length >= settings.MAX_CUBES) {
            alert(`Maximum number of objects (${settings.MAX_CUBES}) reached!`);
            return;
        }
        cubes.push(new BouncyCube(settings.CUBE_COLOR));
        updateButtonVisibility();
    }

    function deleteCube() {
        if (cubes.length === 0) {
            return;
        }
        // Remove the last spawned cube
        const cubeToRemove = cubes.pop();
        cubeToRemove.dispose();

        updateButtonVisibility();

        // If all cubes are gone, stop the whole animation
        if (cubes.length === 0) {
            stopCube();
        }
    }

    // --- Main Control Functions ---

    function startCube() {
        if (cubeIsRunning) return;

        // 1. Setup Canvas
        canvas = document.createElement('canvas');
        canvas.id = 'bouncy-cube-canvas';
        canvas.style.cssText = 'position: fixed; top: 0; left: 0; pointer-events: none; z-index: 99999;';
        document.body.appendChild(canvas);

        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // 2. Three.js Setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(width, height);
        camera.position.z = 100;

        // 3. Lighting Setup
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);

        // 4. Spawn the initial cube
        cubes = [];
        spawnCube();

        // 5. Start Animation and Listeners
        window.addEventListener('resize', onWindowResize, false);
        animate();

        cubeIsRunning = true;
        updateButtonVisibility();
    }

    function stopCube() {
        if (!cubeIsRunning) return;

        // 1. Stop Animation
        cancelAnimationFrame(animationFrameId);

        // 2. Remove Canvas and Listeners
        if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
        }
        window.removeEventListener('resize', onWindowResize, false);

        // 3. Dispose of all cubes
        cubes.forEach(cube => cube.dispose());
        cubes = [];

        // 4. Cleanup Three.js objects
        renderer.dispose();
        scene = null;
        camera = null;
        renderer = null;
        canvas = null;

        cubeIsRunning = false;
        updateButtonVisibility();
    }

    function toggleCube() {
        if (cubeIsRunning) {
            stopCube();
        } else {
            startCube();
        }
    }

    function toggleSettingsPanel() {
        if (settingsPanel.style.display === 'block') {
            settingsPanel.style.display = 'none';
        } else {
            settingsPanel.style.display = 'block';
            populateSettingsPanel();
        }
    }

    function handleSettingChange(event) {
        const key = event.target.id.replace('setting-', '');
        let value;

        if (event.target.type === 'checkbox') {
            value = event.target.checked;
        } else if (event.target.type === 'color') {
            // Convert hex color string to number
            value = parseInt(event.target.value.substring(1), 16);
        } else if (event.target.tagName === 'SELECT') {
            value = event.target.value;
        } else {
            value = parseFloat(event.target.value);
            if (key === 'MAX_CUBES') {
                value = parseInt(event.target.value);
            }
        }

        settings[key] = value;
        saveSettings();

        // Special case: If a geometry-affecting setting changes, re-initialize cubes
        if (cubeIsRunning && (key === 'CUBE_SIZE' || key === 'CUBE_COLOR' || key === 'SHAPE')) {
            // Stop and restart to apply new geometry/material
            stopCube();
            startCube();
        }

        updateButtonVisibility();
    }

    function populateSettingsPanel() {
        const shapeOptions = [
            { value: 'Cube', text: 'Cube' },
            { value: 'Sphere', text: 'Sphere' },
            { value: 'Tetrahedron', text: 'Tetrahedron (Triangle)' },
            { value: 'Custom', text: 'Custom Model (Coming Soon)', disabled: true }
        ];

        let shapeSelectOptions = shapeOptions.map(opt =>
            `<option value="${opt.value}" ${settings.SHAPE === opt.value ? 'selected' : ''} ${opt.disabled ? 'disabled' : ''}>${opt.text}</option>`
        ).join('');

        settingsPanel.innerHTML = `
            <h3>Object Settings</h3>
            <div class="setting-group">
                <label for="setting-SHAPE">Shape:</label>
                <select id="setting-SHAPE">
                    ${shapeSelectOptions}
                </select>
            </div>
            <div class="setting-group">
                <label for="setting-CUBE_SIZE">Size:</label>
                <input type="range" id="setting-CUBE_SIZE" min="10" max="100" step="5" value="${settings.CUBE_SIZE}">
                <span>${settings.CUBE_SIZE}</span>
            </div>
            <div class="setting-group">
                <label for="setting-SPEED">Speed:</label>
                <input type="range" id="setting-SPEED" min="0.5" max="5" step="0.5" value="${settings.SPEED}">
                <span>${settings.SPEED}</span>
            </div>
            <div class="setting-group">
                <label for="setting-BOUNCE_HEIGHT">Bounce Height:</label>
                <input type="range" id="setting-BOUNCE_HEIGHT" min="0" max="50" step="5" value="${settings.BOUNCE_HEIGHT}">
                <span>${settings.BOUNCE_HEIGHT}</span>
            </div>
            <div class="setting-group">
                <label for="setting-BOUNCE_SPEED">Bounce Speed:</label>
                <input type="range" id="setting-BOUNCE_SPEED" min="0.01" max="0.2" step="0.01" value="${settings.BOUNCE_SPEED}">
                <span>${settings.BOUNCE_SPEED}</span>
            </div>
            <div class="setting-group">
                <label for="setting-MAX_CUBES">Max Objects:</label>
                <input type="number" id="setting-MAX_CUBES" min="1" max="50" value="${settings.MAX_CUBES}">
            </div>
            <div class="setting-group">
                <label for="setting-COLLISION_ENABLED">Collisions:</label>
                <input type="checkbox" id="setting-COLLISION_ENABLED" ${settings.COLLISION_ENABLED ? 'checked' : ''}>
            </div>
            <div class="setting-group">
                <label for="setting-CUBE_COLOR">Color:</label>
                <input type="color" id="setting-CUBE_COLOR" value="#${settings.CUBE_COLOR.toString(16).padStart(6, '0')}">
            </div>
            <button id="reset-settings">Reset to Default</button>
        `;

        // Add event listeners to all inputs
        settingsPanel.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('input', handleSettingChange);
            // Update range span dynamically
            if (input.type === 'range') {
                input.addEventListener('input', (e) => {
                    e.target.nextElementSibling.textContent = e.target.value;
                });
            }
        });

        // Add event listener for reset button
        settingsPanel.querySelector('#reset-settings').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all settings to default?')) {
                settings = DEFAULT_SETTINGS;
                saveSettings();
                populateSettingsPanel(); // Re-populate with default values

                // Stop and restart to apply all defaults
                if (cubeIsRunning) {
                    stopCube();
                    startCube();
                }
            }
        });
    }

    // --- Menu Button and Panel Setup ---

    function createMenuButtons() {
        // Consolidated CSS for all buttons and the settings panel
        GM_addStyle("#bouncy-cube-toggle, #spawn-more-cubes, #delete-cube, #settings-button { position: fixed; padding: 10px 15px; background-color: #333; color: white; border: none; border-radius: 5px; cursor: pointer; z-index: 100000; font-family: sans-serif; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.5); transition: background-color 0.3s; } #bouncy-cube-toggle:hover, #spawn-more-cubes:hover, #delete-cube:hover, #settings-button:hover { background-color: #555; } #bouncy-cube-toggle { bottom: 10px; right: 10px; } #spawn-more-cubes { bottom: 60px; right: 10px; } #delete-cube { bottom: 110px; right: 10px; background-color: #d9534f; } #delete-cube:hover { background-color: #c9302c; } #settings-button { bottom: 160px; right: 10px; background-color: #f0ad4e; } #settings-button:hover { background-color: #ec971f; } #bouncy-cube-settings-panel { position: fixed; bottom: 10px; right: 180px; width: 300px; background-color: #222; color: #fff; border: 1px solid #555; border-radius: 8px; padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 99999; display: none; font-family: sans-serif; } #bouncy-cube-settings-panel h3 { margin-top: 0; border-bottom: 1px solid #555; padding-bottom: 10px; } #bouncy-cube-settings-panel .setting-group { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; } #bouncy-cube-settings-panel input[type=\"range\"] { flex-grow: 1; margin: 0 10px; } #bouncy-cube-settings-panel input[type=\"number\"], #bouncy-cube-settings-panel input[type=\"color\"], #bouncy-cube-settings-panel select { width: 60px; color: #000; } #bouncy-cube-settings-panel button { width: 100%; margin-top: 10px; background-color: #5bc0de; color: white; } #bouncy-cube-settings-panel button:hover { background-color: #31b0d5; }");

        // 1. Start/Stop Cube Button (Bottom)
        cubeButton = document.createElement('button');
        cubeButton.id = 'bouncy-cube-toggle';
        cubeButton.textContent = 'Start Objects';
        cubeButton.addEventListener('click', toggleCube);
        document.body.appendChild(cubeButton);

        // 2. Spawn More Button (Middle-Bottom)
        spawnMoreButton = document.createElement('button');
        spawnMoreButton.id = 'spawn-more-cubes';
        spawnMoreButton.textContent = 'Spawn More';
        spawnMoreButton.style.display = 'none';
        spawnMoreButton.addEventListener('click', spawnCube);
        document.body.appendChild(spawnMoreButton);

        // 3. Delete Cube Button (Middle-Top)
        deleteCubeButton = document.createElement('button');
        deleteCubeButton.id = 'delete-cube';
        deleteCubeButton.textContent = 'Delete';
        deleteCubeButton.style.display = 'none';
        deleteCubeButton.addEventListener('click', deleteCube);
        document.body.appendChild(deleteCubeButton);

        // 4. Settings Button (Top)
        settingsButton = document.createElement('button');
        settingsButton.id = 'settings-button';
        settingsButton.textContent = 'Settings';
        settingsButton.style.display = 'none'; // Initially hidden
        settingsButton.addEventListener('click', toggleSettingsPanel);
        document.body.appendChild(settingsButton);

        // 5. Settings Panel
        settingsPanel = document.createElement('div');
        settingsPanel.id = 'bouncy-cube-settings-panel';
        document.body.appendChild(settingsPanel);
    }

    // --- Initialization ---
    loadSettings();
    createMenuButtons();

})();
