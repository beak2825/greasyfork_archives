// ==UserScript==
// @name         Torn PDA - Colored World Map
// @namespace    TornPDA
// @version      2.0
// @description  Changes travel screen to use colored world map with enhanced features
// @author       Torn PDA Community
// @match        https://www.torn.com/travel.php
// @match        https://www.torn.com/travelagency.php
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560937/Torn%20PDA%20-%20Colored%20World%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/560937/Torn%20PDA%20-%20Colored%20World%20Map.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        useColoredMap: true,
        autoSwitch: true,
        showCoordinates: true,
        highlightCurrent: true,
        customColors: false,
        mapVersion: 'colored' // 'colored', 'detailed', 'minimal'
    };

    // Style injection for colored map
    function injectStyles() {
        const css = `
            /* Colored Map Styles */
            .travel-wrapper .world-map.colored {
                background-image: url('https://www.torn.com/images/v2/maps/world-colored.png') !important;
                background-size: contain !important;
                background-repeat: no-repeat !important;
            }
            
            /* Map Selector Buttons */
            .pda-map-selector {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 1000;
                background: rgba(0,0,0,0.8);
                padding: 10px;
                border-radius: 5px;
                border: 1px solid #666;
            }
            
            .map-btn {
                background: #2c3e50;
                color: white;
                border: none;
                padding: 8px 12px;
                margin: 5px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
                transition: background 0.3s;
            }
            
            .map-btn:hover {
                background: #3498db;
            }
            
            .map-btn.active {
                background: #e74c3c;
                font-weight: bold;
            }
            
            /* Enhanced City Labels */
            .city-marker.colored {
                color: #fff;
                text-shadow: 1px 1px 3px #000;
                font-weight: bold;
                padding: 2px 5px;
                border-radius: 3px;
                background: rgba(0,0,0,0.5);
            }
            
            /* Current Location Highlight */
            .current-location {
                animation: pulse 2s infinite;
                border: 2px solid #ffeb3b !important;
                box-shadow: 0 0 10px #ffeb3b;
            }
            
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.7; }
                100% { opacity: 1; }
            }
            
            /* Travel Info Panel */
            .pda-travel-info {
                background: rgba(0,0,0,0.9);
                border: 1px solid #444;
                border-radius: 5px;
                padding: 10px;
                margin-top: 10px;
                color: #ddd;
                font-size: 12px;
            }
        `;
        
        GM_addStyle(css);
    }

    // Switch to colored map
    function switchToColoredMap() {
        const mapContainer = document.querySelector('.travel-wrapper .world-map, #mapContainer, .world-map');
        
        if (mapContainer) {
            // Remove existing map classes
            mapContainer.classList.remove('default', 'detailed', 'minimal');
            mapContainer.classList.add('colored');
            
            // Update map source
            const mapImage = mapContainer.querySelector('img');
            if (mapImage) {
                mapImage.src = 'https://www.torn.com/images/v2/maps/world-colored.png';
                mapImage.style.maxWidth = '100%';
                mapImage.style.height = 'auto';
            }
            
            // Update background if it's a div with background image
            if (mapContainer.style.backgroundImage) {
                mapContainer.style.backgroundImage = "url('https://www.torn.com/images/v2/maps/world-colored.png')";
            }
            
            console.log('[Torn PDA] Switched to colored world map');
            return true;
        }
        return false;
    }

    // Create map selector UI
    function createMapSelector() {
        if (document.getElementById('pda-map-selector')) return;
        
        const selector = document.createElement('div');
        selector.id = 'pda-map-selector';
        selector.className = 'pda-map-selector';
        selector.innerHTML = `
            <div style="color: #fff; margin-bottom: 5px; font-size: 11px;">Map Type:</div>
            <button class="map-btn active" data-map="colored">Colored</button>
            <button class="map-btn" data-map="default">Default</button>
            <button class="map-btn" data-map="detailed">Detailed</button>
            <div style="margin-top: 10px;">
                <label style="color: #fff; font-size: 11px;">
                    <input type="checkbox" id="pda-auto-switch" checked> Auto-switch
                </label>
            </div>
        `;
        
        document.body.appendChild(selector);
        
        // Add button events
        selector.querySelectorAll('.map-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const mapType = this.dataset.map;
                
                // Update buttons
                selector.querySelectorAll('.map-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Switch map
                switchMapType(mapType);
                
                // Save preference
                GM_setValue('pda_map_preference', mapType);
            });
        });
        
        // Auto-switch checkbox
        const autoSwitch = selector.querySelector('#pda-auto-switch');
        autoSwitch.checked = CONFIG.autoSwitch;
        autoSwitch.addEventListener('change', function() {
            GM_setValue('pda_auto_switch', this.checked);
        });
    }

    // Switch between map types
    function switchMapType(type) {
        const mapContainer = document.querySelector('.travel-wrapper .world-map, #mapContainer, .world-map');
        
        if (!mapContainer) return;
        
        // Remove all map classes
        mapContainer.classList.remove('colored', 'default', 'detailed', 'minimal');
        
        switch(type) {
            case 'colored':
                mapContainer.classList.add('colored');
                mapContainer.style.backgroundImage = "url('https://www.torn.com/images/v2/maps/world-colored.png')";
                break;
            case 'default':
                mapContainer.style.backgroundImage = "url('https://www.torn.com/images/v2/maps/world.png')";
                break;
            case 'detailed':
                mapContainer.style.backgroundImage = "url('https://www.torn.com/images/v2/maps/world-detailed.png')";
                break;
        }
        
        console.log(`[Torn PDA] Switched to ${type} map`);
    }

    // Enhance city markers
    function enhanceCityMarkers() {
        const markers = document.querySelectorAll('.city-marker, .travel-city');
        
        markers.forEach(marker => {
            marker.classList.add('colored');
            
            // Add click effect
            marker.style.cursor = 'pointer';
            marker.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.zIndex = '100';
            });
            
            marker.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.zIndex = '';
            });
        });
    }

    // Main initialization
    function init() {
        console.log('[Torn PDA] Colored World Map script loading...');
        
        // Inject styles
        injectStyles();
        
        // Wait for page to load
        const checkInterval = setInterval(() => {
            const mapLoaded = document.querySelector('.world-map, #mapContainer, .travel-wrapper');
            
            if (mapLoaded) {
                clearInterval(checkInterval);
                
                // Load saved preferences
                const savedMap = GM_getValue('pda_map_preference', 'colored');
                const autoSwitch = GM_getValue('pda_auto_switch', true);
                
                // Apply preferences
                if (autoSwitch || savedMap === 'colored') {
                    setTimeout(() => {
                        switchToColoredMap();
                        enhanceCityMarkers();
                    }, 500);
                }
                
                // Create UI controls
                createMapSelector();
                
                // Apply saved map preference
                if (savedMap) {
                    setTimeout(() => switchMapType(savedMap), 1000);
                }
                
                console.log('[Torn PDA] Colored World Map script loaded successfully');
            }
        }, 500);
        
        // Also listen for dynamic content changes
        const observer = new MutationObserver(() => {
            if (document.querySelector('.world-map')) {
                switchToColoredMap();
                enhanceCityMarkers();
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();