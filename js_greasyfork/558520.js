// ==UserScript==
// @name         GeoFS Model Importer
// @name:zh-CN   GeoFS 模型导入器
// @name:zh-TW   GeoFS 模型匯入器
// @description  GLTF Model placer for GeoFS
// @description:zh-CN GeoFS 的 GLTF 模型导入工具
// @description:zh-TW GeoFS 的 GLTF 模型匯入工具
// @namespace    https://github.com/GeofsExplorer/GeoFS-Model-Importer
// @version      1.2.1
// @license      MIT
// @author       GeofsExplorer and 31124呀
// @match        https://www.geo-fs.com/geofs.php?v=3.9
// @match        https://geo-fs.com/geofs.php*
// @match        https://*.geo-fs.com/geofs.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geo-fs.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558520/GeoFS%20Model%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/558520/GeoFS%20Model%20Importer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const HEADING_MULTIPLIER = 57.602;

    class ModelImporter3D {
        constructor() {
            this.scaleValue = 1.0;
            this.headingValue = 0.0;
            this.placedModels = [];
            this.isDraggingUI = false;
            this.dragOffset = { x: 0, y: 0 };
            this.currentAircraftModel = null;
            this.showCenterOfMass = true;
            this.aircraftModelUpdateHandler = null;
            this.init();
        }

        init() {
            this.createInterfaceElements();
            this.setupEventListeners();
            this.waitForGeoFSReady();
        }

        createInterfaceElements() {
            const controlButton = document.createElement('div');
            controlButton.style.cssText = `
                position: fixed;
                bottom: 10px;
                left: 10px;
                background: rgba(0,0,0,0.85);
                color: #fff;
                border: 1px solid #333;
                border-radius: 4px;
                padding: 8px 12px;
                z-index: 6000;
                font-family: Arial, sans-serif;
                font-size: 13px;
                cursor: move;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                user-select: none;
            `;
            controlButton.innerHTML = 'Model Importer';
            document.body.appendChild(controlButton);
            this.controlButton = controlButton;

            const controlPanel = document.createElement('div');
            controlPanel.style.cssText = `
                position: fixed;
                bottom: 50px;
                left: 10px;
                background: rgba(0,0,0,0.9);
                color: #fff;
                padding: 0;
                border-radius: 4px;
                z-index: 6000;
                font-family: Arial, sans-serif;
                font-size: 13px;
                width: 480px;
                border: 1px solid #333;
                box-shadow: 0 2px 10px rgba(0,0,0,0.5);
                display: none;
                height: auto;
            `;

            controlPanel.innerHTML = `
                <div style="padding: 15px; background: rgba(0,0,0,0.8); border-bottom: 1px solid #333; text-align: center;">
                    <img src="https://raw.githubusercontent.com/GeofsExplorer/GeoFS-Model-Importer/a9755c58e004a012085cdd9c856b2b88694bcd4e/GeoFS%20Model%20Importer%20Logo%20V1.png"
                         style="max-width: 100%; height: auto;"
                         alt="GeoFS Model Importer Logo">
                </div>
                <div style="padding: 15px;">
                    <div style="margin-bottom: 15px;">
                        <div style="margin-bottom: 8px; font-size: 12px;">Scale: <span id="scale-display" style="float: right;">1.0</span></div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <input id="scale-control" type="range" min="0.1" max="5" step="0.01" value="1.0"
                                   style="flex: 1; height: 4px; background: #555; border-radius: 2px; outline: none;">
                            <input id="scale-input" type="text" min="0.1" max="5" step="0.01" value="1.0"
                                   style="width: 55px; padding: 4px 6px; border: 1px solid #555; border-radius: 3px; background: #333; color: white; font-size: 11px; text-align: center;">
                        </div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <div style="margin-bottom: 8px; font-size: 12px;">Heading (Degrees): <span id="heading-display" style="float: right;">0.0°</span></div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <input id="heading-control" type="range" min="0" max="360" step="0.1" value="0.0"
                                   style="flex: 1; height: 4px; background: #555; border-radius: 2px; outline: none;">
                            <input id="heading-input" type="text" min="0" max="360" step="0.1" value="0.0"
                                   style="width: 55px; padding: 4px 6px; border: 1px solid #555; border-radius: 3px; background: #333; color: white; font-size: 11px; text-align: center;">
                        </div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <div style="margin-bottom: 5px; font-size: 12px;">Select Model:</div>
                        <input id="model-file-input" type="file" accept=".gltf,.glb"
                               style="width: 100%; min-width: 100%; max-width: 100%; padding: 8px; height: 32px; border: 1px solid #555; border-radius: 4px; background: #222; color: white; font-size: 12px; box-sizing: border-box; overflow: hidden;">
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: flex; align-items: center; gap: 8px; font-size: 12px; cursor: pointer;">
                            <input type="checkbox" id="show-center-of-mass" checked>
                            Show Center of Mass Marker
                        </label>
                    </div>

                    <div style="display: flex; gap: 8px;">
                        <button id="place-model-btn" style="flex: 1; padding: 8px; border: none; border-radius: 3px; background: #2d5aa0; color: white; font-size: 11px; cursor: pointer;">
                            Place Here
                        </button>
                        <button id="use-as-aircraft-btn" style="flex: 1; padding: 8px; border: none; border-radius: 3px; background: #2d5aa0; color: white; font-size: 11px; cursor: pointer;">
                            Use as Aircraft
                        </button>
                    </div>

                    <div style="margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 3px;">
                        <div style="font-size: 11px; color: #aaa;">
                            <strong>Note:</strong> Placing a new model or using as aircraft will remove previous ones.
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(controlPanel);
            this.controlPanel = controlPanel;
        }

        setupEventListeners() {
            this.controlButton.addEventListener("mousedown", (e) => this.startDragging(e));
            document.addEventListener("mouseup", () => this.stopDragging());
            document.addEventListener("mousemove", (e) => this.handleDrag(e));

            this.controlButton.addEventListener('click', (e) => this.togglePanelVisibility(e));
            document.addEventListener('click', (e) => this.handleOutsideClick(e));

            const scaleControl = document.getElementById("scale-control");
            const scaleInput = document.getElementById("scale-input");
            scaleControl.addEventListener('input', () => {
                this.updateScaleValue(scaleControl.value, false);
            });
            scaleInput.addEventListener('input', (e) => {
                this.updateScaleValue(e.target.value, true);
            });
            scaleInput.addEventListener('blur', (e) => {
                this.updateScaleInputDisplay();
            });

            const headingControl = document.getElementById("heading-control");
            const headingInput = document.getElementById("heading-input");
            headingControl.addEventListener('input', () => {
                this.updateHeadingValue(headingControl.value, false);
            });
            headingInput.addEventListener('input', (e) => {
                this.updateHeadingValue(e.target.value, true);
            });
            headingInput.addEventListener('blur', (e) => {
                this.updateHeadingInputDisplay();
            });

            const centerOfMassCheckbox = document.getElementById("show-center-of-mass");
            centerOfMassCheckbox.addEventListener('change', (e) => {
                this.showCenterOfMass = e.target.checked;
                this.updateAllCenterOfMassMarkers();
            });

            document.getElementById("place-model-btn").onclick = () => this.place3DModel();
            document.getElementById("use-as-aircraft-btn").onclick = () => this.replaceAircraftModel();

            window.addEventListener('resize', () => this.adjustPanelPosition());
        }

        convertFileToDataURL(fileData) {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.onload = () => resolve(fileReader.result);
                fileReader.onerror = reject;
                fileReader.readAsDataURL(fileData);
            });
        }

        updateScaleInputDisplay() {
            document.getElementById("scale-input").value = this.scaleValue.toFixed(2);
        }

        updateScaleValue(newValue, isTextInput) {
            const originalValue = newValue;
            let value = parseFloat(newValue);

            if (isTextInput && originalValue === "") {
                return;
            }
            if (isTextInput && isNaN(value)) {
                return;
            }

            if (isNaN(value)) value = 1.0;
            if (value < 0.1) value = 0.1;
            if (value > 5) value = 5;

            this.scaleValue = value;
            document.getElementById("scale-display").textContent = this.scaleValue.toFixed(2);
            document.getElementById("scale-control").value = this.scaleValue;

            if (!isTextInput) {
                this.updateScaleInputDisplay();
            }
        }

        updateHeadingInputDisplay() {
            document.getElementById("heading-input").value = this.headingValue.toFixed(1);
        }

        updateHeadingValue(newValue, isTextInput) {
            const originalValue = newValue;
            let value = parseFloat(newValue);

            if (isTextInput && originalValue === "") {
                return;
            }
            if (isTextInput && isNaN(value)) {
                return;
            }

            if (isNaN(value)) value = 0.0;

            if (value > 360) {
                value %= 360;
            } else if (value < 0) {
                value = 360 + (value % 360);
            }

            if (value > 360) value = 360;

            this.headingValue = value;
            document.getElementById("heading-display").textContent = this.headingValue.toFixed(1) + '°';
            document.getElementById("heading-control").value = this.headingValue;

            if (!isTextInput) {
                this.updateHeadingInputDisplay();
            }
        }

        adjustModelScale(modelEntity, scale) {
             if (!modelEntity || !modelEntity.model) return;
             try {
                 modelEntity.model.maximumScale = scale;
             } catch(error) {
                 console.warn('Scale adjustment failed:', error);
             }
        }

        createCenterOfMassMarker(position) {
            try {
                if (!this.showCenterOfMass) return null;
                return window.geofs.api.viewer.entities.add({
                    position: position,
                    point: {
                        pixelSize: 8,
                        color: window.Cesium.Color.RED,
                        outlineColor: window.Cesium.Color.WHITE,
                        outlineWidth: 2,
                        heightReference: window.Cesium.HeightReference.NONE,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY
                    },
                    label: {
                        text: "Center of Mass",
                        font: "12pt Arial",
                        pixelOffset: new window.Cesium.Cartesian2(0, -20),
                        fillColor: window.Cesium.Color.WHITE,
                        outlineColor: window.Cesium.Color.BLACK,
                        outlineWidth: 2,
                        showBackground: true,
                        backgroundColor: new window.Cesium.Color(0.1, 0.1, 0.1, 0.7),
                        verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
                        heightReference: window.Cesium.HeightReference.NONE
                    }
                });
            } catch(error) {
                console.warn('Failed to create center of mass marker:', error);
                return null;
            }
        }

        updateAllCenterOfMassMarkers() {
            this.placedModels.forEach(model => {
                if (model.centerOfMassMarker) {
                    model.centerOfMassMarker.show = this.showCenterOfMass;
                }
            });
        }

        removeAllPlacedModels() {
            this.placedModels.forEach(model => {
                try {
                    window.geofs.api.viewer.entities.remove(model.entity);
                    if (model.centerOfMassMarker) {
                        window.geofs.api.viewer.entities.remove(model.centerOfMassMarker);
                    }
                } catch(error) {
                    console.warn('Failed to remove model:', error);
                }
            });
            this.placedModels = [];
        }

        removeAircraftModel() {
            if (this.currentAircraftModel) {
                try {
                    if (this.aircraftModelUpdateHandler) {
                        window.geofs.api.viewer.scene.preRender.removeEventListener(this.aircraftModelUpdateHandler);
                        this.aircraftModelUpdateHandler = null;
                    }

                    if (window.geofs && window.geofs.aircraft && window.geofs.aircraft.instance) {
                        window.geofs.aircraft.instance.setVisibility(1);
                    }

                    try {
                        if (typeof this.currentAircraftModel.destroy === 'function') {
                            this.currentAircraftModel.destroy();
                        }
                    } catch(e) {
                        console.warn('Cannot destroy aircraft model, but it will be replaced:', e);
                    }

                    this.currentAircraftModel = null;
                } catch(error) {
                    console.warn('Failed to remove aircraft model:', error);
                }
            }
        }

        removeAllModels() {
            this.removeAllPlacedModels();
            this.removeAircraftModel();
        }

        startDragging(event) {
            this.isDraggingUI = true;
            this.dragOffset.initialX = event.clientX - this.dragOffset.x;
            this.dragOffset.initialY = event.clientY - this.dragOffset.y;
            this.controlButton.style.cursor = "grabbing";
        }

        stopDragging() {
            this.isDraggingUI = false;
            this.controlButton.style.cursor = "move";
            this.adjustPanelPosition();
        }

        handleDrag(event) {
            if (!this.isDraggingUI) return;

            event.preventDefault();
            this.dragOffset.x = event.clientX - this.dragOffset.initialX;
            this.dragOffset.y = event.clientY - this.dragOffset.initialY;

            this.controlButton.style.transform = `translate3d(${this.dragOffset.x}px, ${this.dragOffset.y}px, 0)`;
        }

        togglePanelVisibility(event) {
            if (this.isDraggingUI) return;

            const shouldShow = this.controlPanel.style.display !== "block";
            this.controlPanel.style.display = shouldShow ? "block" : "none";

            if (shouldShow) {
                this.adjustPanelPosition();
            }
        }

        handleOutsideClick(event) {
            if (!this.controlPanel.contains(event.target) && event.target !== this.controlButton) {
                this.controlPanel.style.display = 'none';
            }
        }

        adjustPanelPosition() {
            if (this.controlPanel.style.display !== 'block') return;

            const buttonRect = this.controlButton.getBoundingClientRect();
            const panelRect = this.controlPanel.getBoundingClientRect();

            let panelTop = buttonRect.top - panelRect.height - 10;
            let panelLeft = buttonRect.left;

            if (panelTop < 0) {
                panelTop = buttonRect.bottom + 10;
            }

            if (panelLeft + panelRect.width > window.innerWidth) {
                panelLeft = window.innerWidth - panelRect.width - 10;
            }

            this.controlPanel.style.top = `${panelTop}px`;
            this.controlPanel.style.left = `${panelLeft}px`;
            this.controlPanel.style.bottom = 'auto';
        }

        async place3DModel() {
            const fileInput = document.getElementById("model-file-input");
            const selectedFile = fileInput.files[0];

            if (!selectedFile) {
                this.showMessage("Please select a GLTF model first");
                return;
            }

            if (!this.checkGeoFSReady()) {
                this.showMessage("Error: GeoFS API not available");
                return;
            }

            try {
                this.removeAllModels();

                const modelDataURL = await this.convertFileToDataURL(selectedFile);
                const aircraft = window.geofs.aircraft.instance;
                const groundPosition = window.geofs.getGroundAltitude(aircraft.llaLocation).location;

                const headingRad = (this.headingValue * (Math.PI / 180)) * HEADING_MULTIPLIER;

                const worldPosition = window.Cesium.Cartesian3.fromDegrees(
                    groundPosition[1],
                    groundPosition[0],
                    groundPosition[2]
                );

                const orientation = window.Cesium.Transforms.headingPitchRollQuaternion(
                    worldPosition,
                    new window.Cesium.HeadingPitchRoll(headingRad, 0, 0)
                );

                const modelEntity = window.geofs.api.viewer.entities.add({
                    position: worldPosition,
                    orientation: orientation,
                    model: {
                        uri: modelDataURL,
                        maximumScale: this.scaleValue
                    }
                });

                const centerOfMassMarker = this.createCenterOfMassMarker(worldPosition);

                const modelData = {
                    entity: modelEntity,
                    centerOfMassMarker: centerOfMassMarker,
                    scale: this.scaleValue
                };
                this.placedModels.push(modelData);

                this.showMessage("Model placed successfully! Previous models have been removed.");
                this.controlPanel.style.display = 'none';
            } catch (error) {
                this.showMessage("Error placing model: " + error.message);
            }
        }

        async replaceAircraftModel() {
            const fileInput = document.getElementById("model-file-input");
            const selectedFile = fileInput.files[0];

            if (!selectedFile) {
                this.showMessage("Please select a GLTF model first");
                return;
            }

            if (!this.checkGeoFSReady()) {
                this.showMessage("Error: GeoFS API not available yet.");
                return;
            }

            try {
                this.removeAllModels();

                const modelDataURL = await this.convertFileToDataURL(selectedFile);
                const aircraft = window.geofs.aircraft.instance;

                this.currentAircraftModel = new window.geofs.api.Model(null, {
                    url: modelDataURL,
                    location: aircraft.llaLocation,
                    rotation: aircraft.htr
                });

                this.setupAircraftModelTracking();
                this.showMessage("Aircraft model replaced! Previous models have been removed.");
                this.controlPanel.style.display = 'none';
            } catch (error) {
                this.showMessage("Error replacing aircraft: " + error.message);
            }
        }

        setupAircraftModelTracking() {
            if (this.aircraftModelUpdateHandler) {
                window.geofs.api.viewer.scene.preRender.removeEventListener(this.aircraftModelUpdateHandler);
            }

            this.aircraftModelUpdateHandler = () => {
                try {
                    const currentAircraft = window.geofs.aircraft.instance;
                    if (this.currentAircraftModel) {

                        const headingRad = (this.headingValue * (Math.PI / 180)) * HEADING_MULTIPLIER;

                        const htrWithCustomHeading = [
                            headingRad,
                            currentAircraft.htr[1],
                            currentAircraft.htr[2]
                        ];

                        this.currentAircraftModel.setPositionOrientationAndScale(
                            currentAircraft.llaLocation,
                            htrWithCustomHeading,
                            this.scaleValue
                        );
                        if (this.currentAircraftModel.model) {
                            const position = this.currentAircraftModel.model.position.getValue(window.geofs.api.viewer.clock.currentTime);

                            const orientation = window.Cesium.Transforms.headingPitchRollQuaternion(
                                position,
                                new window.Cesium.HeadingPitchRoll(headingRad, currentAircraft.htr[1], currentAircraft.htr[2])
                            );

                            this.currentAircraftModel.model.orientation.setValue(orientation);
                        }

                        currentAircraft.setVisibility(0);
                    }
                } catch(error) {
                    console.warn('Aircraft model update failed:', error);
                }
            };

            window.geofs.api.viewer.scene.preRender.addEventListener(this.aircraftModelUpdateHandler);
        }

        updateAircraftModelScale() {
        }

        checkGeoFSReady() {
            return window.geofs && window.Cesium && window.geofs.api;
        }

        showMessage(text) {
            alert(text);
        }

        waitForGeoFSReady() {
            const checkReady = () => {
                if (this.checkGeoFSReady()) {
                    this.updateScaleValue(1.0, false);
                    this.updateHeadingValue(0.0, false);
                } else {
                    setTimeout(checkReady, 1000);
                }
            };
            checkReady();
        }
    }

    new ModelImporter3D();

})();
