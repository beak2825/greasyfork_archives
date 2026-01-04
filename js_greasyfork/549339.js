// ==UserScript==
// @name            Geoguessr Result Map Resizer
// @name:ja         Geoguessr Result Map Resizer
// @namespace       https://greasyfork.org/ja/users/1492018-sino87
// @version         1.10
// @description     Resize Google Maps on Duels Game Breakdown pages from 1.00x to 1.50x magnification
// @description:ja  DuelsのGame BreakdownページにあるGoogleマップのサイズを1.00倍から1.50倍まで調整可能
// @icon            https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @match           https://www.geoguessr.com/*
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/549339/Geoguessr%20Result%20Map%20Resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/549339/Geoguessr%20Result%20Map%20Resizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SCALE_STORAGE_KEY = "geoguessrMapScale";
    const POSITION_STORAGE_KEY = "geoguessrMapPanelPosition";

    let currentScale = parseFloat(localStorage.getItem(SCALE_STORAGE_KEY)) || 1.00;
    let panelPosition = JSON.parse(localStorage.getItem(POSITION_STORAGE_KEY)) || { top: 80, left: 20 };

    const fontStyle = document.createElement('style');
    fontStyle.textContent = `@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@600&display=swap');`;
    document.head.appendChild(fontStyle);

    function resizeMap() {
        const mapElement = document.querySelector('div.game-summary_mapContainer__iYGL5');
        if (!mapElement) return;

        if (!mapElement.dataset.originalHeight) {
            mapElement.dataset.originalHeight = mapElement.offsetHeight + '';
        }

        const originalHeight = parseFloat(mapElement.dataset.originalHeight);
        const newHeight = originalHeight * currentScale;
        mapElement.style.height = newHeight + 'px';
    }

    function initializeMapResize() {
        const mapElement = document.querySelector('div.game-summary_mapContainer__iYGL5');
        if (mapElement && !mapElement.dataset.originalHeight) {
            const height = mapElement.offsetHeight;
            if (height > 0) {
                mapElement.dataset.originalHeight = height + '';
                resizeMap();
            }
        }
    }

    function createPanel() {
        if (document.getElementById('map-scale-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'map-scale-panel';
        panel.style.cssText = `
            position: fixed;
            top: ${panelPosition.top}px;
            left: ${panelPosition.left}px;
            width: 200px;
            padding: 16px;
            background: rgba(20, 20, 35, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            color: white;
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            z-index: 9999;
            font-family: 'Noto Sans', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            transition: transform 0.1s ease;
        `;

        const title = document.createElement('div');
        title.textContent = 'MAP RESIZER';
        title.style.cssText = `
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1.5px;
            color: rgba(255, 255, 255, 0.6);
            cursor: grab;
            user-select: none;
            width: 100%;
            text-align: center;
            padding-bottom: 4px;
        `;

        const sliderContainer = document.createElement('div');
        sliderContainer.style.cssText = `
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        `;

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '100';
        slider.value = ((currentScale - 1.00) / 0.50) * 100;
        slider.style.cssText = `
            width: 100%;
            appearance: none;
            height: 6px;
            border-radius: 3px;
            background: rgba(255, 255, 255, 0.15);
            outline: none;
            cursor: pointer;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        `;

        // Dynamic background for slider track
        const updateSliderBackground = (val) => {
            const ratio = val;
            slider.style.background = `linear-gradient(90deg, #7d8cff ${ratio}%, rgba(255, 255, 255, 0.15) ${ratio}%)`;
        };
        updateSliderBackground(slider.value);


        const sliderStyle = document.createElement('style');
        sliderStyle.textContent = `
            #map-scale-panel input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #7d8cff;
                cursor: pointer;
                border: 2px solid #fff;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                transition: transform 0.1s ease;
                margin-top: -6px; /* Center thumb on track */
            }
            #map-scale-panel input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.1);
            }
            #map-scale-panel input[type="range"]::-webkit-slider-runnable-track {
                width: 100%;
                height: 6px;
                cursor: pointer;
                border-radius: 3px;
            }
        `;
        document.head.appendChild(sliderStyle);

        const scaleDisplay = document.createElement('div');
        scaleDisplay.textContent = '×' + currentScale.toFixed(2);
        scaleDisplay.style.cssText = `
            font-size: 20px;
            font-weight: 800;
            color: #7d8cff;
            text-shadow: 0 0 10px rgba(125, 140, 255, 0.3);
            font-variant-numeric: tabular-nums;
        `;

        slider.addEventListener('input', function (e) {
            const sliderValue = parseFloat(e.target.value);
            updateSliderBackground(sliderValue);

            currentScale = 1.00 + (sliderValue / 100) * 0.50;
            scaleDisplay.textContent = '×' + currentScale.toFixed(2);
            localStorage.setItem(SCALE_STORAGE_KEY, currentScale);
            resizeMap();
        });

        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        title.addEventListener('mousedown', function (e) {
            isDragging = true;
            title.style.cursor = 'grabbing';
            dragOffset.x = e.clientX - panel.offsetLeft;
            dragOffset.y = e.clientY - panel.offsetTop;
            e.preventDefault();
        });

        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                const maxX = window.innerWidth - panel.offsetWidth;
                const maxY = window.innerHeight - panel.offsetHeight;

                let newX = e.clientX - dragOffset.x;
                let newY = e.clientY - dragOffset.y;

                newX = Math.max(0, Math.min(newX, maxX));
                newY = Math.max(0, Math.min(newY, maxY));

                panel.style.left = newX + 'px';
                panel.style.top = newY + 'px';
            }
        });

        document.addEventListener('mouseup', function () {
            if (isDragging) {
                isDragging = false;
                title.style.cursor = 'grab';
                panelPosition = {
                    top: parseInt(panel.style.top),
                    left: parseInt(panel.style.left)
                };
                localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(panelPosition));
            }
        });

        panel.appendChild(title);
        panel.appendChild(scaleDisplay);
        panel.appendChild(sliderContainer);
        sliderContainer.appendChild(slider);

        document.body.appendChild(panel);
    }

    const observer = new MutationObserver(() => {
        const isDuelsResultPage = /^https:\/\/www\.geoguessr\.com(\/[^/]+)?\/duels\/[^/]+\/summary$/.test(window.location.href);

        if (isDuelsResultPage) {
            initializeMapResize();
            createPanel();
        } else {
            const panel = document.getElementById('map-scale-panel');
            if (panel) {
                panel.remove();
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
