// ==UserScript==
// @name         Wplace Zoom Plus & Location Manager
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Zoom hotkeys and a location manager for fast travel!
// @author       Kur0
// @match        https://wplace.live/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548945/Wplace%20Zoom%20Plus%20%20Location%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/548945/Wplace%20Zoom%20Plus%20%20Location%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hooked = false;

    Object.defineProperty(Object.prototype, 'transform', {
        configurable: true,
        enumerable: false,
        set: function(value) {
            // check if it has setZoom and getCanvas
            if (!hooked && value && typeof value.setZoom === 'function' && typeof this.getCanvas === 'function') {
                hooked = true;
                const mapInstance = this;

                console.log('%cWplace Zoom Plus: Map instance captured!', 'color: limegreen; font-weight: bold;');

                // Expose globally for console debugging stuff
                unsafeWindow.myMap = mapInstance;

                console.log("Hotkeys are active: [-] for zoom out, [+] for zoom in, [ ] ] for 1:1 zoom.");

                // Cleanup: remove the hook to prevent side effects
                delete Object.prototype.transform;

                // Set the property on the actual object now that the hook is gone
                this.transform = value;

                initializeUI(mapInstance);
                return;
            }

            // For all other objects, set the property normally
            Object.defineProperty(this, 'transform', {
                value: value,
                writable: true,
                configurable: true,
                enumerable: true,
            });
        }
    });

    function initializeUI(map) {
        const STORAGE_KEY = 'wplace_locations';
        let locations = GM_getValue(STORAGE_KEY, []);

        const SETTINGS_KEY = 'wplm_settings';
        let settings = GM_getValue(SETTINGS_KEY, {});
        console.log(`wplm settings:`, settings)

        const overlay = document.createElement('div');
        overlay.id = 'wplm-overlay';

        const dragBar = document.createElement('div');
        dragBar.id = 'wplm-bar-drag';

        const headerDiv = document.createElement("div");
        headerDiv.className = "header-div";

        const headerTxt = document.createElement('h1');
        headerTxt.textContent = 'Locations';

        const animateTxt = document.createElement('p');
        animateTxt.textContent = "Animate?";

        const animateBtn = document.createElement("input")
        animateBtn.type = 'checkbox';

        if ("animate" in settings) {
            animateBtn.checked = settings.animate;
        }

        const locationsList = document.createElement('div');
        locationsList.id = 'wplm-locations-list';

        const buttonsContainer = document.createElement('div');
        buttonsContainer.id = 'wplm-buttons-container';

        const addButton = document.createElement('button');
        addButton.textContent = 'Save Current Location';

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear All';
        clearButton.style.backgroundColor = '#b91414';

        buttonsContainer.appendChild(addButton);
        buttonsContainer.appendChild(clearButton);

        overlay.appendChild(dragBar);
        overlay.appendChild(headerDiv);
        headerDiv.appendChild(headerTxt);
        headerDiv.appendChild(animateTxt);
        headerDiv.appendChild(animateBtn);
        overlay.appendChild(document.createElement('hr'));
        overlay.appendChild(locationsList);
        overlay.appendChild(document.createElement('hr'));
        overlay.appendChild(buttonsContainer);
        document.body.appendChild(overlay);

        animateBtn.onchange = () => {
            settings.animate = animateBtn.checked;
            GM_setValue(SETTINGS_KEY, settings);
        }

        const saveLocations = () => {
            GM_setValue(STORAGE_KEY, locations);
        };

        const renderLocations = () => {
            locationsList.innerHTML = '';
            if (locations.length === 0) {
                locationsList.innerHTML = '<small>No locations saved.</small>';
            }
            locations.forEach((loc, index) => {
                const item = document.createElement('div');
                item.className = 'wplm-location-item';

                const label = document.createElement('span');
                label.textContent = loc.label;
                label.className = 'wplm-location-label';
                label.onclick = () => {
                    const newLabel = prompt('Enter a new label for this location:', loc.label);
                    if (newLabel && newLabel.trim() !== '') {
                        locations[index].label = newLabel.trim();
                        saveLocations();
                        renderLocations();
                    }
                };

                const teleportButton = document.createElement('button');
                teleportButton.textContent = 'Go';
                teleportButton.onclick = () => {
                    map.flyTo({ center: loc.center, zoom: loc.zoom, animate: animateBtn.checked});
                };

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'X';
                deleteButton.className = 'wplm-delete-btn';
                deleteButton.onclick = () => {
                    if (confirm(`Are you sure you want to delete "${loc.label}"?`)) {
                        locations.splice(index, 1);
                        saveLocations();
                        renderLocations();
                    }
                };

                item.appendChild(label);
                item.appendChild(teleportButton);
                item.appendChild(deleteButton);
                locationsList.appendChild(item);
            });
        };

        addButton.onclick = () => {
            const label = prompt('Enter a label for this location:');
            if (label && label.trim() !== '') {
                locations.push({
                    label: label.trim(),
                    center: map.getCenter(),
                    zoom: map.getZoom()
                });
                saveLocations();
                renderLocations();
            }
        };

        clearButton.onclick = () => {
            if (confirm('Are you sure you want to delete ALL saved locations? This cannot be undone.')) {
                locations = [];
                saveLocations();
                renderLocations();
            }
        };

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        const move = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            const dx = clientX - startX;
            const dy = clientY - startY;
            overlay.style.left = `${initialLeft + dx}px`;
            overlay.style.top = `${initialTop + dy}px`;
            overlay.style.right = 'auto';
            overlay.style.bottom = 'auto';
        };

        const startDrag = (e) => {
            isDragging = true;
            dragBar.classList.add('dragging');
            startX = e.clientX || e.touches[0].clientX;
            startY = e.clientY || e.touches[0].clientY;
            const rect = overlay.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            document.addEventListener('mousemove', move);
            document.addEventListener('touchmove', move);
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchend', endDrag);
        };

        const endDrag = () => {
            isDragging = false;
            dragBar.classList.remove('dragging');
            document.removeEventListener('mousemove', move);
            document.removeEventListener('touchmove', move);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchend', endDrag);
        };

        dragBar.addEventListener('mousedown', startDrag);
        dragBar.addEventListener('touchstart', startDrag);

        renderLocations();
    }

    const ONE_TO_ONE_ZOOM = 11.965784285; // log2(4000)

    document.addEventListener('keydown', (event) => {
        if (!unsafeWindow.myMap) {
            return;
        }

        // Ignore input fields
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable)) {
            return;
        }

        const getZoom = unsafeWindow.myMap.getZoom.bind(unsafeWindow.myMap);
        const setZoom = unsafeWindow.myMap.setZoom.bind(unsafeWindow.myMap);
        const zoomAmount = 0.05;

        switch (event.key) {
            case '-': event.preventDefault(); setZoom(getZoom() - zoomAmount); break;
            case '+': case '=': event.preventDefault(); setZoom(getZoom() + zoomAmount); break;
            case ']': event.preventDefault(); setZoom(ONE_TO_ONE_ZOOM); break;
        }
    });

    GM_addStyle(`
        #wplm-overlay {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(21, 48, 99, 0.9);
            color: white;
            padding: 10px;
            border-radius: 8px;
            z-index: 9999;
            width: 280px;
            font-family: 'Roboto Mono', 'Courier New', monospace;
            letter-spacing: 0.05em;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            will-change: transform;
            backface-visibility: hidden;
        }
        #wplm-bar-drag {
            margin-bottom: 0.5em;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="5" height="5"><circle cx="3" cy="3" r="1.5" fill="CornflowerBlue" /></svg>') repeat;
            cursor: grab;
            width: 100%;
            height: 1em;
            border-radius: 4px;
        }
        #wplm-bar-drag.dragging {
            cursor: grabbing;
        }
        #wplm-overlay h1 {
            font-size: large;
            font-weight: bold;
            text-align: left;
            padding-left: 2px;
            flex-grow: 1;
        }
        #wplm-overlay .header-div {
            margin-bottom: 0.5em;
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
        #wplm-overlay .header-div p {
            font-size: 12px;
            margin-right: 10px;
        }


        #wplm-overlay hr {
            border-color: rgba(255, 255, 255, 0.2);
            margin: 10px 0;
        }
        #wplm-locations-list {
            max-height: 200px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        #wplm-locations-list small {
            text-align: center;
            color: lightgray;
            padding: 10px 0;
        }
        .wplm-location-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .wplm-location-label {
            flex-grow: 1;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .wplm-location-label:hover {
            text-decoration: underline;
        }
        #wplm-buttons-container {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            gap: 10px;
        }
        #wplm-overlay button {
            background-color: #144eb9;
            border: none;
            color: white;
            border-radius: 1em;
            padding: 5px 10px;
            cursor: pointer;
            font-family: inherit;
        }
        #wplm-overlay button:hover {
            background-color: #1061e5;
        }
        .wplm-delete-btn {
            background-color: #a02c2c !important;
            flex-grow: 0 !important;
            padding: 5px 12px;
        }
        .wplm-delete-btn:hover {
            background-color: #c0392b !important;
        }
    `);

})();