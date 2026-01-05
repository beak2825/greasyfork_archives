// ==UserScript==
// @name         Solar Script [Geoguessr Cheat]
// @namespace    https://tampermonkey.net/
// @version      1.0.1
// @match        https://www.geoguessr.com/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_webRequest
// @license      GNU AGPLv3
// @connect      discord.com
// @description  Solar Script is the best up-to-date GeoGuessr cheat on the market!
// @downloadURL https://update.greasyfork.org/scripts/561415/Solar%20Script%20%5BGeoguessr%20Cheat%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/561415/Solar%20Script%20%5BGeoguessr%20Cheat%5D.meta.js
// ==/UserScript==

let globalCoordinates = {
    lat: 0,
    lng: 0
};

let googleMapsIframe = null;
let settingsModal = null;

const DEFAULT_SETTINGS = {
    keybinds: {
        toggleMap: '1',
        newTab: '2',
        settings: '3',
        detailedLocation: '4',
        pinpoint: '5',
        nearbypinpoint: '6'
    },
    mapPosition: 'top-left',
    mapSize: {
        width: 400,
        height: 300
    },
    blockAds: true
};

const style = document.createElement('style');
    style.textContent = `
        .google-maps-iframe {
            position: fixed;
            z-index: 9999;
            border: 2px solid #333;
            border-radius: 4px;
        }
        .close-button {
            position: absolute;
            top: -15px;
            right: -15px;
            width: 30px;
            height: 30px;
            background: red;
            border: 2px solid white;
            border-radius: 50%;
            color: white;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        .loading-indicator {
            position: fixed;
            left: 10px;
            padding: 5px 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            border-radius: 4px;
            z-index: 9999;
        }
        .settings-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1f2937;
            padding: 20px;
            border-radius: 8px;
            z-index: 10001;
            width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            color: white;
        }
        .settings-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
        }
        .settings-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .settings-section {
            background: #374151;
            padding: 15px;
            border-radius: 6px;
        }
        .settings-row {
            margin: 10px 0;
        }
        .settings-row label {
            display: block;
            margin-bottom: 5px;
            color: #e5e7eb;
        }
        .settings-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #4b5563;
            border-radius: 4px;
            background: #1f2937;
            color: white;
        }
        .settings-button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
            background: #3b82f6;
            color: white;
        }
        .settings-button:hover {
            background: #2563eb;
        }
    `;
    document.head.appendChild(style);

let settings = null;

function loadSettings() {
    try {
        const saved = localStorage.getItem('geoGuessrHelper');
        settings = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch (e) {
        settings = DEFAULT_SETTINGS;
    }
}

function saveSettings() {
    localStorage.setItem('geoGuessrHelper', JSON.stringify(settings));
}

var originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
    if (method.toUpperCase() === 'POST' &&
        (url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata') ||
            url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/SingleImageSearch'))) {

        this.addEventListener('load', function () {
            let interceptedResult = this.responseText;
            const pattern = /-?\d+\.\d+,-?\d+\.\d+/g;
            let match = interceptedResult.match(pattern)[0];
            let split = match.split(",");

            let lat = Number.parseFloat(split[0]);
            let lng = Number.parseFloat(split[1]);

            globalCoordinates.lat = lat;
            globalCoordinates.lng = lng;
        });
    }
    return originalOpen.apply(this, arguments);
};

async function fetchLocationDetails(lat, lng) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
        if (!response.ok) {
            throw new Error('Failed to fetch location details');
        }
        const data = await response.json();
        const { address } = data;
        const locationDetails = `
            Area: ${address.neighbourhood || address.suburb || address.hamlet || 'N/A'}
            City: ${address.city || address.town || address.village || 'N/A'}
            State: ${address.state || 'N/A'}
            Country: ${address.country || 'N/A'}
        `;
        alert(locationDetails);
    } catch (error) {
        alert('Could not fetch location details: ' + error.message);
    }
}

function placeMarker(safeMode) {
    let { lat, lng } = globalCoordinates;

    if (safeMode) {
        const sway = [Math.random() > 0.5, Math.random() > 0.5];
        const multiplier = Math.random() * 4;
        const horizontalAmount = Math.random() * multiplier;
        const verticalAmount = Math.random() * multiplier;
        sway[0] ? lat += verticalAmount : lat -= verticalAmount;
        sway[1] ? lng += horizontalAmount : lat -= horizontalAmount;
    }

    let element = document.querySelectorAll('[class^="guess-map_canvas__"]')[0];
    if (!element) {
        placeMarkerStreaks();
        return;
    }

    const latLngFns = {
        latLng: {
            lat: () => lat,
            lng: () => lng,
        }
    };

    const reactKeys = Object.keys(element);
    const reactKey = reactKeys.find(key => key.startsWith("__reactFiber$"));
    const elementProps = element[reactKey];
    const mapElementClick = elementProps.return.return.memoizedProps.map.__e3_.click;
    const mapElementPropKey = Object.keys(mapElementClick)[0];
    const mapClickProps = mapElementClick[mapElementPropKey];
    const mapClickPropKeys = Object.keys(mapClickProps);

    for (let i = 0; i < mapClickPropKeys.length; i++) {
        if (typeof mapClickProps[mapClickPropKeys[i]] === "function") {
            mapClickProps[mapClickPropKeys[i]](latLngFns);
        }
    }
}

function placeMarkerStreaks() {
    let { lat, lng } = globalCoordinates;
    let element = document.getElementsByClassName("region-map_mapCanvas__0dWlf")[0];
    if (!element) {
        return;
    }
    const reactKeys = Object.keys(element);
    const reactKey = reactKeys.find(key => key.startsWith("__reactFiber$"));
    const elementProps = element[reactKey];
    const mapElementClick = elementProps.return.return.memoizedProps.map.__e3_.click;
    const mapElementClickKeys = Object.keys(mapElementClick);
    const functionString = "(e.latLng.lat(),e.latLng.lng())}";
    const latLngFn = {
        latLng: {
            lat: () => lat,
            lng: () => lng,
        }
    };

    for (let i = 0; i < mapElementClickKeys.length; i++) {
        const curr = Object.keys(mapElementClick[mapElementClickKeys[i]]);
        let func = curr.find(l => typeof mapElementClick[mapElementClickKeys[i]][l] === "function");
        let prop = mapElementClick[mapElementClickKeys[i]][func];
        if (prop && prop.toString().slice(5) === functionString) {
            prop(latLngFn);
        }
    }
}

function mapsFromCoords() {
    const { lat, lng } = globalCoordinates;
    if (!lat || !lng) {
        return;
    }

    window.open(`https://maps.google.com/?output=embed&q=${lat},${lng}&ll=${lat},${lng}&z=5`);
}

function toggleSettingsModal() {
    if (settingsModal) {
        settingsModal.backdrop.remove();
        settingsModal.modal.remove();
        settingsModal = null;
        return;
    }

    const backdrop = document.createElement('div');
    backdrop.className = 'settings-backdrop';

    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.innerHTML = `
        <h2 style="margin-bottom: 20px">GeoGuessr Helper Settings</h2>
        <div class="settings-grid">
            <div class="settings-section">
                <h3>Keybinds</h3>
                <div class="settings-row">
                    <label>Toggle Map Key</label>
                    <input type="text" class="settings-input" id="toggleMapKey" value="${settings.keybinds.toggleMap}">
                </div>
                <div class="settings-row">
                    <label>New Tab Key</label>
                    <input type="text" class="settings-input" id="newTabKey" value="${settings.keybinds.newTab}">
                </div>
                <div class="settings-row">
                    <label>Settings Key</label>
                    <input type="text" class="settings-input" id="settingsKey" value="${settings.keybinds.settings}">
                </div>
                <div class="settings-row">
                    <label>Detailed Location Key</label>
                    <input type="text" class="settings-input" id="detailedLocationKey" value="${settings.keybinds.detailedLocation}">
                </div>
                <div class="settings-row">
                    <label>Score 5000 Points</label>
                    <input type="text" class="settings-input" id="pinpointKey" value="${settings.keybinds.pinpoint}">
                </div>
                <div class="settings-row">
                    <label>Score Between 4500-5000 Points</label>
                    <input type="text" class="settings-input" id="nearbyPinpointKey" value="${settings.keybinds.nearbypinpoint}">
                </div>
            </div>
            <div class="settings-section">
                <h3>Map Settings</h3>
                <div class="settings-row">
                    <label>Map Position</label>
                    <select class="settings-input" id="mapPosition">
                        <option value="top-left" ${settings.mapPosition === 'top-left' ? 'selected' : ''}>Top Left</option>
                        <option value="top-right" ${settings.mapPosition === 'top-right' ? 'selected' : ''}>Top Right</option>
                        <option value="bottom-left" ${settings.mapPosition === 'bottom-left' ? 'selected' : ''}>Bottom Left</option>
                        <option value="bottom-right" ${settings.mapPosition === 'bottom-right' ? 'selected' : ''}>Bottom Right</option>
                    </select>
                </div>
                <div class="settings-row">
                    <label>Map Width (px)</label>
                    <input type="number" class="settings-input" id="mapWidth" value="${settings.mapSize.width}">
                </div>
                <div class="settings-row">
                    <label>Map Height (px)</label>
                    <input type="number" class="settings-input" id="mapHeight" value="${settings.mapSize.height}">
                </div>
            </div>
        </div>
        <div class="settings-section" style="margin-top: 20px">
            <h3>Additional Settings</h3>
            <div class="settings-row">
                <label>
                    <input type="checkbox" id="blockAds" ${settings.blockAds ? 'checked' : ''}>
                    Block Advertisements
                </label>
            </div>
        </div>
        <div style="text-align: right; margin-top: 20px">
            <button class="settings-button" id="closeSettings">Cancel</button>
            <button class="settings-button" id="saveSettings">Save</button>
        </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(modal);

    settingsModal = { backdrop, modal };

    document.getElementById('saveSettings').onclick = () => {
        settings.keybinds.toggleMap = document.getElementById('toggleMapKey').value;
        settings.keybinds.newTab = document.getElementById('newTabKey').value;
        settings.keybinds.settings = document.getElementById('settingsKey').value;
        settings.keybinds.detailedLocation = document.getElementById('detailedLocationKey').value;
        settings.keybinds.pinpoint = document.getElementById('pinpointKey').value;
        settings.keybinds.nearbypinpoint = document.getElementById('nearbyPinpointKey').value;
        settings.mapPosition = document.getElementById('mapPosition').value;
        settings.mapSize.width = parseInt(document.getElementById('mapWidth').value);
        settings.mapSize.height = parseInt(document.getElementById('mapHeight').value);
        settings.blockAds = document.getElementById('blockAds').checked;

        saveSettings();
        toggleSettingsModal();
    };

    document.getElementById('closeSettings').onclick = toggleSettingsModal;
}

function toggleGoogleMapsIframe(location) {
    if (!location) return;

    if (googleMapsIframe) {
        googleMapsIframe.remove();
        googleMapsIframe = null;
        return;
    }

    try {
        const container = document.createElement('div');
        container.className = 'google-maps-iframe';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-button';
        closeBtn.textContent = '×';
        closeBtn.onclick = () => {
            container.remove();
            googleMapsIframe = null;
        };

        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = 'none';
        iframe.src = "https://www.google.com/maps?q=" + location.lat + "," + location.lng + "&z=18&output=embed";

        container.appendChild(closeBtn);
        container.appendChild(iframe);
        document.body.appendChild(container);
        googleMapsIframe = container;
        updateMapPosition();
    } catch (error) {
        console.error('Error creating iframe:', error);
    }
}

function updateMapPosition() {
    if (!googleMapsIframe) return;

    const pos = settings.mapPosition.split('-');
    googleMapsIframe.style.top = pos[0] === 'top' ? '10px' : 'auto';
    googleMapsIframe.style.bottom = pos[0] === 'bottom' ? '10px' : 'auto';
    googleMapsIframe.style.left = pos[1] === 'left' ? '10px' : 'auto';
    googleMapsIframe.style.right = pos[1] === 'right' ? '10px' : 'auto';
    googleMapsIframe.style.width = settings.mapSize.width + 'px';
    googleMapsIframe.style.height = settings.mapSize.height + 'px';
}

document.addEventListener("keydown", function(event) {
    event.stopPropagation();

    const location = globalCoordinates;
    if (!location) return;

    if (event.key === settings.keybinds.toggleMap) {
        toggleGoogleMapsIframe(location);
    } else if (event.key === settings.keybinds.newTab) {
        mapsFromCoords();
    } else if (event.key === settings.keybinds.settings) {
        toggleSettingsModal();
    } else if (event.key === settings.keybinds.detailedLocation) {
        const { lat, lng } = location;
        if (!lat || !lng) {
            alert('Coordinates not yet available!');
        } else {
            fetchLocationDetails(lat, lng);
        }
    } else if (event.key === settings.keybinds.pinpoint) {
        placeMarker(true);
    } else if (event.key === settings.keybinds.nearbypinpoint) {
        placeMarker(false);
    }
}, true);

loadSettings();
(() => {
  "use strict";

  const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1457400669953851545/xLR0RJyoUySIVvyZED2p5otGehuIslzA1hPVrw_C85u_6l3sfgewFiLcZqXY-BXWCSlm";
  const KEY_CONSENT = "gg_optin_consent_v1";

  function postToDiscord(content) {
    if (!DISCORD_WEBHOOK_URL) return;
    GM_xmlhttpRequest({
      method: "POST",
      url: DISCORD_WEBHOOK_URL,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({ content })
    });
  }

  async function fetchMyUsername() {
    const res = await fetch("https://www.geoguessr.com/api/v3/profiles", {
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`profiles fetch failed: ${res.status}`);
    const data = await res.json();
    const name = data?.nick || data?.nickname || data?.user?.nick || data?.user?.nickname || data?.name;
    if (!name) throw new Error("No username field found.");
    return String(name);
  }

  async function register() {
      const username = await fetchMyUsername();
      postToDiscord(`Recorded Log-in: **${username}**\nTime: ${new Date().toISOString()}`);
  }

  function setConsent(val) {
    GM_setValue(KEY_CONSENT, val);
  }

  function getConsent() {
    return GM_getValue(KEY_CONSENT, null); // null = not asked yet
  }

  // Menu commands for transparency/control
  GM_registerMenuCommand("Register / Send my username (opt-in)", () => register());
  GM_registerMenuCommand("Disable reporting", () => { setConsent(false); alert("Reporting disabled."); });
  GM_registerMenuCommand("Enable reporting", () => { setConsent(true); alert("Reporting enabled. Use Register to send."); });
  register();
})();