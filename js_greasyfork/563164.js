// ==UserScript==
// @name         Map Making App Marker Size Custom
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Customize marker size and opacity
// @author       wang
// @match        https://map-making.app/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563164/Map%20Making%20App%20Marker%20Size%20Custom.user.js
// @updateURL https://update.greasyfork.org/scripts/563164/Map%20Making%20App%20Marker%20Size%20Custom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MARKER_SCALE = parseFloat(localStorage.getItem('markerScale') || '0.5');
    const MARKER_OPACITY = parseFloat(localStorage.getItem('markerOpacity1') || '1');

    const originalDefineProperty = Object.defineProperty;
    Object.defineProperty = function(obj, prop, descriptor) {
        if (prop === 'sizeScale' && descriptor && descriptor.value !== undefined) {
            descriptor.value = descriptor.value * MARKER_SCALE;
        }
        if (prop === 'opacity' && descriptor && descriptor.value !== undefined && typeof descriptor.value === 'number') {
            descriptor.value = descriptor.value * MARKER_OPACITY;
        }
        return originalDefineProperty.call(this, obj, prop, descriptor);
    };

    const origAssign = Object.assign;
    Object.assign = function(target, ...sources) {
        const result = origAssign.call(this, target, ...sources);
        if (result && typeof result === 'object') {
            if ('sizeScale' in result) {
                result.sizeScale = (result.sizeScale || 1) * MARKER_SCALE;
            }
            if ('getSize' in result && typeof result.getSize === 'number') {
                result.getSize = result.getSize * MARKER_SCALE;
            }
            if ('opacity' in result && typeof result.opacity === 'number') {
                result.opacity = result.opacity * MARKER_OPACITY;
            }
        }
        return result;
    };

    const origParse = JSON.parse;
    JSON.parse = function(text, reviver) {
        const result = origParse.call(this, text, reviver);
        function modifyProps(obj) {
            if (obj && typeof obj === 'object') {
                if ('sizeScale' in obj) {
                    obj.sizeScale = (obj.sizeScale || 1) * MARKER_SCALE;
                }
                if ('opacity' in obj && typeof obj.opacity === 'number') {
                    obj.opacity = obj.opacity * MARKER_OPACITY;
                }
                for (let key in obj) {
                    if (obj[key] && typeof obj[key] === 'object') {
                        modifyProps(obj[key]);
                    }
                }
            }
        }
        modifyProps(result);
        return result;
    };

    function checkDeckGL() {
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            const parent = canvas.parentElement;
            if (parent && parent.__DECKGL_WIDGET__) {
                const deck = parent.__DECKGL_WIDGET__;
            }
        });
    }

    let checkCount = 0;
    const checkInterval = setInterval(() => {
        checkDeckGL();
        checkCount++;
        if (checkCount > 20) {
            clearInterval(checkInterval);
        }
    }, 1000);

    function createPanel() {
        const observer = new MutationObserver((mutations) => {
            const popup = document.querySelector('.settings-popup');
            if (popup && !popup.querySelector('.marker-settings-fieldset')) {
                addSettingsToPopup(popup);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        const existingPopup = document.querySelector('.settings-popup');
        if (existingPopup && !existingPopup.querySelector('.marker-settings-fieldset')) {
            addSettingsToPopup(existingPopup);
        }
    }

    function addSettingsToPopup(popup) {
        const markerSize = parseFloat(localStorage.getItem('markerScale') || MARKER_SCALE);
        const markerOpacity = parseFloat(localStorage.getItem('markerOpacity1') || '1');
        const fieldset = document.createElement('fieldset');
        fieldset.className = 'fieldset marker-settings-fieldset';
        fieldset.innerHTML = `
            <legend class="fieldset__header">Marker appearance <span class="fieldset__divider"></span></legend>
            <label class="settings-popup__item" style="display: flex; align-items: center; justify-content: space-between;">
                <span>Marker size</span>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <input type="range" id="marker-size-slider" min="0.1" max="1" step="0.05" value="${markerSize}" style="width: 100px;">
                    <span id="marker-size-value" style="min-width: 30px; text-align: right;">${(markerSize * 100).toFixed(0)}%</span>
                </div>
            </label>
            <label class="settings-popup__item" style="display: flex; align-items: center; justify-content: space-between;">
                <span>Marker opacity</span>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <input type="range" id="marker-opacity-slider" min="0.1" max="1" step="0.1" value="${markerOpacity}" style="width: 100px;">
                    <span id="marker-opacity-value" style="min-width: 30px; text-align: right;">${(markerOpacity * 100).toFixed(0)}%</span>
                </div>
            </label>
            <div class="settings-popup__item" style="font-size: 11px; opacity: 0.7; margin-top: 4px;">
                Changes require page refresh to apply
            </div>
        `;
        popup.appendChild(fieldset);

        const sizeSlider = fieldset.querySelector('#marker-size-slider');
        const sizeValue = fieldset.querySelector('#marker-size-value');
        sizeSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            sizeValue.textContent = (val * 100).toFixed(0) + '%';
            localStorage.setItem('markerScale', val);
        });

        const opacitySlider = fieldset.querySelector('#marker-opacity-slider');
        const opacityValue = fieldset.querySelector('#marker-opacity-value');
        opacitySlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            opacityValue.textContent = (val * 100).toFixed(0) + '%';
            localStorage.setItem('markerOpacity1', val);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createPanel);
    } else {
        createPanel();
    }
})();
