// ==UserScript==
// @name         WME Permanent Hazard Direction
// @description  Makes selecting permanent hazard direction easier in the Waze Map Editor.
// @version      1.1.3
// @author       brandon28au
// @license      MIT
// @match        *://*.waze.com/*editor*
// @exclude      *://*.waze.com/user/editor*
// @grant        none
// @namespace https://greasyfork.org/users/1253347
// @downloadURL https://update.greasyfork.org/scripts/551823/WME%20Permanent%20Hazard%20Direction.user.js
// @updateURL https://update.greasyfork.org/scripts/551823/WME%20Permanent%20Hazard%20Direction.meta.js
// ==/UserScript==

/* jshint esversion: 11 */
/* global getWmeSdk, W */

const arrowSvgString = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20" style="transition: transform 0.4s ease; vertical-align: middle;"><title></title><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" /></svg>`;
const twoWayArrowSvgString = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20" style="transition: transform 0.4s ease; vertical-align: middle;"><title></title><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" /></svg>`;
const iconClass = 'wme-hazard-direction-arrow';

function init() {
    const wmeSDK = getWmeSdk({scriptId: "wme-permanent-hazard-direction", scriptName: "WME Permanent Hazard Direction"});
    const toRadians = (deg) => deg * (Math.PI / 180);
    const toDegrees = (rad) => (rad * (180 / Math.PI) + 360) % 360;

    const storageKey = 'wme_permanent_hazard_direction_keyboard_shortcut_enabled';
    let shortcutsEnabled = localStorage.getItem(storageKey) === 'true';

    const cookie = document.cookie.split('; ').find(row => row.startsWith(storageKey + '='));
    if (cookie) {
        if (localStorage.getItem(storageKey) === null) {
            shortcutsEnabled = cookie.split('=')[1] === 'true';
            localStorage.setItem(storageKey, shortcutsEnabled);
        }
        document.cookie = `${storageKey}=; max-age=0; path=/; domain=.waze.com`;
    }

    /**
     * Calculates the bearing in degrees between two geographic coordinates.
     * @param {[number, number]} p1 - The starting point [lon, lat].
     * @param {[number, number]} p2 - The ending point [lon, lat].
     * @returns {number} The bearing in degrees from 0 to 360.
     */
    function calculateBearing(p1, p2) {
        const [lon1, lat1] = p1;
        const [lon2, lat2] = p2;
        const lat1Rad = toRadians(lat1);
        const lat2Rad = toRadians(lat2);
        const deltaLonRad = toRadians(lon2 - lon1);
        const y = Math.sin(deltaLonRad) * Math.cos(lat2Rad);
        const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLonRad);
        return toDegrees(Math.atan2(y, x));
    }

    /**
     * Finds the line segment of a LineString's geometry that is closest to a given point.
     * @param {[number, number]} point - The point [lon, lat].
     * @param {Array<[number, number]>} lineStringCoords - The array of coordinates for the LineString.
     * @returns {{lineSegment: [[number, number], [number, number]], distance: number}|null} The closest line segment and the distance to it.
     */
    function findClosestLineSegment(point, lineStringCoords) {
        let closestLineSegment = null;
        let minDistanceSq = Infinity;
        const tolerance = 1e-20; // A very small number to treat near-zero distances as equal

        // Iterate backwards to prioritize outgoing segments when a point is on a vertex
        for (let i = lineStringCoords.length - 2; i >= 0; i--) {
            const p1 = lineStringCoords[i];
            const p2 = lineStringCoords[i + 1];
            const dx = p2[0] - p1[0];
            const dy = p2[1] - p1[1];
            const lenSq = dx * dx + dy * dy;
            let t = 0;
            if (lenSq !== 0) {
                t = ((point[0] - p1[0]) * dx + (point[1] - p1[1]) * dy) / lenSq;
                t = Math.max(0, Math.min(1, t));
            }
            const closestPointOnSegment = [p1[0] + t * dx, p1[1] + t * dy];
            const distSq = (point[0] - closestPointOnSegment[0]) ** 2 + (point[1] - closestPointOnSegment[1]) ** 2;

            // Only update if the new distance is meaningfully smaller than the current minimum.
            // This prevents tiny floating point differences from incorrectly changing the chosen segment.
            // Designed to help align with the choice that Waze will make in its UI.
            if (distSq < minDistanceSq - tolerance) {
                minDistanceSq = distSq;
                closestLineSegment = [p1, p2];
            }
        }
        return closestLineSegment ? { lineSegment: closestLineSegment, distance: Math.sqrt(minDistanceSq) } : null;
    }

    let hazardDirectionObserver = null;
    const pressedKeys = new Set();
    let pendingTargetChip = null;

    function waitForWmeNotLoading(timeout = 3000) {
        return new Promise((resolve) => {
            const reloadButton = document.querySelector('.overlay-button.reload-button');

            // If the button doesn't exist or isn't loading, resolve immediately.
            if (!reloadButton || !reloadButton.classList.contains('is-loading')) {
                return resolve(true);
            }

            const intervalId = setInterval(() => {
                if (!reloadButton.classList.contains('is-loading')) {
                    clearInterval(intervalId);
                    clearTimeout(timeoutId);
                    setTimeout(() => resolve(true), 100);
                }
            }, 100);

            const timeoutId = setTimeout(() => {
                clearInterval(intervalId);
                resolve(false);
            }, timeout);
        });
    }

    async function handleGlobalKeyDown(e) {
        if (!shortcutsEnabled) return;
        if (!['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(e.key)) return;

        pressedKeys.add(e.key);

        const editor = document.querySelector('.permanent-hazard-feature-editor');
        const directionEditor = editor?.querySelector('[class*="direction-editor--"]');
        if (!directionEditor) return;

        const chipAB = directionEditor.querySelector('wz-checkable-chip[value="1"]');
        const chipBA = directionEditor.querySelector('wz-checkable-chip[value="2"]');
        const chipTwoWay = directionEditor.querySelector('wz-checkable-chip[value="3"]');

        if (!chipAB || !chipBA || !chipTwoWay) return;

        const isUp = pressedKeys.has('ArrowUp');
        const isDown = pressedKeys.has('ArrowDown');
        const isLeft = pressedKeys.has('ArrowLeft');
        const isRight = pressedKeys.has('ArrowRight');

        let targetChip = null;

        if ((isUp && isDown) || (isLeft && isRight)) {
            targetChip = chipTwoWay;
        } else {
            const bearingAB = parseFloat(chipAB.dataset.bearing);
            const bearingBA = parseFloat(chipBA.dataset.bearing);

            const conditions = {
                ArrowUp: (d) => (d >= 270 && d <= 359) || (d >= 0 && d <= 89),
                ArrowRight: (d) => d >= 0 && d <= 179,
                ArrowDown: (d) => d >= 90 && d <= 269,
                ArrowLeft: (d) => d >= 180 && d <= 359
            };

            if (conditions[e.key] && !isNaN(bearingAB) && !isNaN(bearingBA)) {
                if (conditions[e.key](bearingAB)) targetChip = chipAB;
                else if (conditions[e.key](bearingBA)) targetChip = chipBA;
            }
        }

        if (targetChip && !targetChip.checked && pendingTargetChip !== targetChip) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const wasActionPending = pendingTargetChip !== null;
            pendingTargetChip = targetChip;

            if (wasActionPending) return;

            try {
                const canProceed = await waitForWmeNotLoading();
                if (!canProceed) return;

                if (pendingTargetChip && !pendingTargetChip.checked) {
                    pendingTargetChip.click();
                }
            } finally {
                pendingTargetChip = null;
            }
        }
    }

    function handleGlobalKeyUp(e) {
        if (['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(e.key)) {
            pressedKeys.delete(e.key);
        }
    }

    document.addEventListener('keydown', handleGlobalKeyDown, true);
    document.addEventListener('keyup', handleGlobalKeyUp, true);
    window.addEventListener('blur', () => {
        pressedKeys.clear();
        pendingTargetChip = null;
    });

    /**
     * Updates the WME UI to display the calculated bearings on the direction chips.
     */
    function displayBearings(bearing, hazardId) {
        const editorSelector = '.permanent-hazard-feature-editor';
        const directionEditorSelector = '[class*="direction-editor--"]';

        const currentHazardEditor = document.querySelector(editorSelector);
        if (currentHazardEditor) {
            const headerElement = currentHazardEditor.querySelector('wz-section-header');
            const subtitle = headerElement ? headerElement.getAttribute('subtitle') : '';
            const match = subtitle.match(/-?\d+/);
            const uiHazardId = match ? parseInt(match[0], 10) : null;
            const directionEditor = currentHazardEditor.querySelector(directionEditorSelector);
            if (uiHazardId === hazardId && directionEditor) {
                const chipAB = directionEditor.querySelector('wz-checkable-chip[value="1"]');
                const chipBA = directionEditor.querySelector('wz-checkable-chip[value="2"]');
                const chipTwoWay = directionEditor.querySelector('wz-checkable-chip[value="3"]');
                if (chipAB && chipBA && chipTwoWay) {
                    updateChips(directionEditor, bearing, { chipAB, chipBA, chipTwoWay });
                    return;
                }
            }
        }

        hazardDirectionObserver = new MutationObserver((mutations, obs) => {
            const newHazardEditor = document.querySelector(editorSelector);
            if (!newHazardEditor) return;
            const directionEditor = newHazardEditor.querySelector(directionEditorSelector);
            if (!directionEditor) return;
            const chipAB = directionEditor.querySelector('wz-checkable-chip[value="1"]');
            const chipBA = directionEditor.querySelector('wz-checkable-chip[value="2"]');
            const chipTwoWay = directionEditor.querySelector('wz-checkable-chip[value="3"]');
            if (chipAB && chipBA && chipTwoWay) {
                obs.disconnect();
                updateChips(directionEditor, bearing, { chipAB, chipBA, chipTwoWay });
            }
        });

        hazardDirectionObserver.observe(document.getElementById('edit-panel'), {
            childList: true,
            subtree: true
        });
    }

    /**
     * Updates the direction chips with bearing information and keyboard shortcut UI.
     */
    function updateChips(directionEditor, bearing, chips) {
        const {
            chipAB = directionEditor.querySelector('wz-checkable-chip[value="1"]'),
            chipBA = directionEditor.querySelector('wz-checkable-chip[value="2"]'),
            chipTwoWay = directionEditor.querySelector('wz-checkable-chip[value="3"]')
        } = chips || {};

        if (!chipAB || !chipBA || !chipTwoWay) return;

        const createIconElement = (svgString) => {
            const template = document.createElement('template');
            template.innerHTML = svgString.trim();
            const icon = template.content.firstChild;
            icon.classList.add(iconClass);
            return icon;
        };

        const updateIconRotation = (icon, newAngle, updateTitle = true) => {
            const currentTotalAngle = parseFloat(icon.dataset.currentRotation) || 0;
            let diff = newAngle - (currentTotalAngle % 360);
            diff = ((diff + 180) % 360) - 180;
            const newTotalAngle = currentTotalAngle + diff;
            icon.dataset.currentRotation = newTotalAngle;
            icon.style.transform = `rotate(${newTotalAngle}deg)`;
            if (updateTitle) icon.querySelector('title').textContent = `${newAngle}°`;
        };

        const getOrCreateIcon = (chip, svgString, defaultTitle) => {
            let icon = chip.querySelector(`.${iconClass}`);
            if (!icon) {
                const innerChipDiv = chip.shadowRoot?.querySelector('div.wz-chip');
                if (innerChipDiv) {
                    Object.assign(innerChipDiv.style, { width: '60px', height: '24px', padding: '0', alignItems: 'center', justifyContent: 'center' });
                    const textSpan = innerChipDiv.querySelector('span.text');
                    if (textSpan) textSpan.style.margin = '0';
                }
                icon = createIconElement(svgString);
                icon.querySelector('title').textContent = defaultTitle;
                chip.replaceChildren(icon);
            }
            return icon;
        };

        const roundedBearing = Math.round(bearing);
        const oppositeBearing = (roundedBearing + 180) % 360;
        chipAB.dataset.bearing = roundedBearing;
        chipBA.dataset.bearing = oppositeBearing;

        updateIconRotation(getOrCreateIcon(chipAB, arrowSvgString, `${roundedBearing}°`), roundedBearing, true);
        updateIconRotation(getOrCreateIcon(chipBA, arrowSvgString, `${oppositeBearing}°`), oppositeBearing, true);
        updateIconRotation(getOrCreateIcon(chipTwoWay, twoWayArrowSvgString, chipTwoWay.textContent.trim() || 'Two-way'), bearing, false);

        if (document.getElementsByName('wmePermanentHazardDirectionKeyboardShortcut').length === 0) {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.position = 'relative';

            const checkbox = document.createElement('wz-checkbox');
            checkbox.name = 'wmePermanentHazardDirectionKeyboardShortcut';
            checkbox.checked = shortcutsEnabled;
            checkbox.textContent = 'Enable arrow keys';

            const infoIcon = document.createElement('i');
            infoIcon.className = 'w-icon w-icon-info';
            infoIcon.style.marginLeft = '4px';
            infoIcon.style.fontSize = '18px';
            infoIcon.style.color = '#333';

            const tooltip = document.createElement('div');
            tooltip.textContent = 'Use arrow keys to set hazard direction. Press ↑ & ↓ or ← & → for Two-way.';
            Object.assign(tooltip.style, {
                visibility: 'hidden',
                opacity: '0',
                transition: 'opacity 0.2s ease-in-out',
                position: 'absolute',
                backgroundColor: '#3D4043',
                color: '#fff',
                padding: '8px',
                borderRadius: '4px',
                fontSize: '12px',
                lineHeight: '1.2',
                width: 'max-content',
                maxWidth: '240px',
                textAlign: 'center',
                zIndex: '1000',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: '5px',
                pointerEvents: 'none'
            });

            container.append(checkbox, infoIcon, tooltip);
            directionEditor.append(container);

            infoIcon.addEventListener('mouseenter', () => { tooltip.style.visibility = 'visible'; tooltip.style.opacity = '1'; });
            infoIcon.addEventListener('mouseleave', () => { tooltip.style.visibility = 'hidden'; tooltip.style.opacity = '0'; });

            checkbox.addEventListener('change', () => {
                shortcutsEnabled = checkbox.checked;
                localStorage.setItem(storageKey, shortcutsEnabled);
                updateHazardUI();
            });
        }
    }

    /**
     * Main function called on selection change.
     */
    async function updateHazardUI() {
        if (hazardDirectionObserver) hazardDirectionObserver.disconnect();

        const selectedFeatures = wmeSDK.Editing.getSelection();
        if (!selectedFeatures || selectedFeatures.objectType !== 'permanentHazard' || !selectedFeatures.ids || selectedFeatures.ids.length !== 1) return;

        const hazardId = selectedFeatures.ids[0];
        if (!hazardId) return;

        const hazardModel = W.model.permanentHazards.getObjectById(hazardId);
        if (!hazardModel || !hazardModel.attributes?.direction) return;

        const coordinates = hazardModel.attributes.geoJSONGeometry?.coordinates;
        const segmentId = hazardModel.attributes?.segmentId;
        if (!coordinates || !segmentId) return;

        let segment;
        try { segment = await wmeSDK.DataModel.Segments.getById({ segmentId }); }
        catch (error) { return; }
        if (!segment) return;

        const closestLine = findClosestLineSegment(coordinates, segment.geometry.coordinates);
        if (!closestLine) return;

        const bearing = calculateBearing(closestLine.lineSegment[0], closestLine.lineSegment[1]);

        if (!segment.isTwoWay) return;
        displayBearings(bearing, hazardId);
    }

    wmeSDK.Events.on({
        eventName: 'wme-selection-changed',
        eventHandler: updateHazardUI
    });

    wmeSDK.Events.on({
        eventName: 'wme-after-edit',
        eventHandler: updateHazardUI
    });

    wmeSDK.Events.on({
        eventName: 'wme-after-undo',
        eventHandler: updateHazardUI
    });

    updateHazardUI();
}

window.SDK_INITIALIZED.then(init);