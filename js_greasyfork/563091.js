// ==UserScript==
// @name         Geoguessr Better Breakdown UI
// @namespace    https://greasyfork.org/users/1179204
// @version      1.1.7
// @description  built-in StreetView Window to view where you guessed and the correct location
// @author       KaKa, Alien Perfect
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain=geoguessr.com
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563091/Geoguessr%20Better%20Breakdown%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/563091/Geoguessr%20Better%20Breakdown%20UI.meta.js
// ==/UserScript==

"use strict";

const SEARCH_RADIUS = 250000;
const STORAGE_CAP = 50;
const committedRounds = new Set();
const PEEK_STATE = defaultState();
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// WeakMap for storing marker data to avoid DOM dataset operations
const markerDataMap = new WeakMap();
const markerHandlerMap = new WeakMap();

// DOM element cache to reduce repeated queries
const domCache = {
    _nextRoot: null,
    _lastNextRootCheck: 0,
    get nextRoot() {
        const now = Date.now();
        if (!this._nextRoot || now - this._lastNextRootCheck > 1000) {
            this._nextRoot = document.querySelector('#__next');
            this._lastNextRootCheck = now;
        }
        return this._nextRoot;
    },
    clear() {
        this._nextRoot = null;
        this._lastNextRootCheck = 0;
    }
};

// Throttle utility function
function throttle(fn, delay) {
    let lastCall = 0;
    let timeoutId = null;
    return function(...args) {
        const now = Date.now();
        const remaining = delay - (now - lastCall);
        if (remaining <= 0) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            lastCall = now;
            fn.apply(this, args);
        } else if (!timeoutId) {
            timeoutId = setTimeout(() => {
                lastCall = Date.now();
                timeoutId = null;
                fn.apply(this, args);
            }, remaining);
        }
    };
}

const SELECTORS = {
    markerList: "[class*='map-pin_']:not([data-qa='correct-location-marker'])",
    roundMarker: "[data-qa='correct-location-marker']",
    duelMarker:"[class*='result-map_roundPin']",
    roundEnd: "[data-qa='close-round-result']",
    gameEnd: "[data-qa='play-again-button']",
    duelEnd:"[class*='game-summary']",
    roundNumber: "[data-qa='round-number']",
    guessMap: "[class*='guess-map_canvas']",
    resultMap: "[class*='coordinate-result-map_map']",
    duelMap:"[class*='result-map_map']",
};

const SVG_SOURCE = {
    COPY: `<svg height="24" width="24" viewBox="0 0 24 24"><path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" fill="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
    LOADING: `<svg height="24" width="24" viewBox="0 0 24 24"><path d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z" fill="currentColor"></path></svg>`,
    SUCCESS: `<svg height="24" width="24" viewBox="0 0 24 24"><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" fill="currentColor"></path></svg>`,
    SAVE: `<svg viewBox="0 0 24 24" fill="none" width="24" height="24"> <path d="M9 6L12 3M12 3L15 6M12 3V13M7.00023 10C6.06835 10 5.60241 10 5.23486 10.1522C4.74481 10.3552 4.35523 10.7448 4.15224 11.2349C4 11.6024 4 12.0681 4 13V17.8C4 18.9201 4 19.4798 4.21799 19.9076C4.40973 20.2839 4.71547 20.5905 5.0918 20.7822C5.5192 21 6.07899 21 7.19691 21H16.8036C17.9215 21 18.4805 21 18.9079 20.7822C19.2842 20.5905 19.5905 20.2839 19.7822 19.9076C20 19.4802 20 18.921 20 17.8031V13C20 12.0681 19.9999 11.6024 19.8477 11.2349C19.6447 10.7448 19.2554 10.3552 18.7654 10.1522C18.3978 10 17.9319 10 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    SPAWN:`<svg height="24" width="24" viewBox="0 0 24 24"><path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" fill="currentColor"></path></svg>`,
    PANEL:`<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3,9H17V7H3V9M3,13H17V11H3V13M3,17H17V15H3V17M19,17H21V15H19V17M19,7V9H21V7H19M19,13H21V11H19V13Z" /></svg>`,
    CAMERA:`<svg height="24" width="24" viewBox="0 0 24 24"><path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" fill="currentColor"></path></svg>`
};

let svs = null;
let spawn = null;
let viewer = null;
let guessMap = null;
let cleanStyle = null;
let peekMarker = null;
let mapObserver = null;
let panoSelector = null;
let closeControl = null;
let gameLoopTimer = null;
let coverageLayer = null;
let markerObserver = null;
let currentGameToken = null;
let lastClickedCoords = null;
let movementPath = [];
let pathPolyline = null;

let isPhotoMode = false;
let isCoverageLayer = false;
let gameLoopRunning = false;
let clickListenerAttached = false;

let MAP_MAKING_API_KEY = GM_getValue("MAP_MAKING_API_KEY", "PASTE_YOUR_KEY_HERE");
let MAP_LIST;
let LOCATION;
let previousMapId = JSON.parse(GM_getValue('previousMapId', null));
let previousTags = JSON.parse(GM_getValue('previousTags', '[]'));

function getReactFiber(el) {
    if (!el) return null;
    const key = Object.keys(el).find(k => k.startsWith("__reactFiber"));
    return key ? el[key] : null;
}

function getGuessMapInstance(el) {
    const fiber = getReactFiber(el);
    try {
        return fiber?.return?.memoizedState?.memoizedState?.current?.instance || fiber?.return?.updateQueue?.lastEffect?.deps?.[0]||null;
    } catch { return null; }
}

function getRoundData() {
    let el = document.querySelector(SELECTORS.roundMarker);
    const fiber = getReactFiber(el);
    try {
        return fiber?.return?.return?.return?.return?.return?.memoizedProps?.rounds[0] || null;
    } catch { return null; }
}

function getDuelData(marker){
    const fiber = getReactFiber(marker);
    if (!fiber) return null;
    return fiber.return?.return?.return?.return?.memoizedProps?.round || fiber.return?.return?.return?.return?.pendingProps || null;
}

function initSVS() {
    if (!svs && unsafeWindow.google?.maps?.StreetViewService) {
        svs = new unsafeWindow.google.maps.StreetViewService();
    }
}

async function getNearestPano(coords) {
    const nearestPano = { error: true };
    let radius = SEARCH_RADIUS;
    let oldRadius;
    if (!svs) initSVS();

    for (; ;) {
        try {
            const pano = await svs.getPanorama({
                location: coords,
                radius: radius,
                sources: ["outdoor"],
                preference: "nearest",
            });

            radius = getRadius(coords, pano.data.location.latLng);
            if (oldRadius && radius >= oldRadius) break;

            nearestPano.radius = radius;
            nearestPano.location = pano.data.location.latLng
            nearestPano.panoId = pano.data.location.pano
            nearestPano.heading = pano.data.tiles.originHeading
            nearestPano.pitch = pano.data.tiles.originPitch
            nearestPano.error = false
            oldRadius = radius;
        } catch (e) {
            break;
        }
    }

    return nearestPano;
}

function fetchAnswerPanoFromRoundData() {
    const data = getRoundData();
    if (!data) return null;
    return {
        panoId: convertPanoId(data.panoId),
        heading: data.heading,
        location: { lat: data.lat, lng: data.lng },
        pitch: data.pitch,
        radius: 0,
        zoom:data.zoom,
        error: false
    }
}

function offsetMapFocus(map, coords) {
    if (!map || !coords) return;

    map.setCenter(coords);

    const mapDiv = map.getDiv();
    const width = mapDiv.offsetWidth;

    const offsetX = width / 4;

    map.panBy(offsetX, 0);
}

function attachClickListener(map) {
    map.addListener("click", async (e) => {
        lastClickedCoords = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        };
        if (document.querySelector(SELECTORS.roundEnd) ||
            document.querySelector(SELECTORS.gameEnd)||
            (document.querySelector(SELECTORS.duelEnd))){
            if (!isCoverageLayer) return
            const pano = await getNearestPano(lastClickedCoords);
            if (!pano || pano.error) return
            if (!peekMarker) {
                peekMarker = new google.maps.Marker({
                    position: pano.location,
                    map,
                    icon: {
                        url: "https://www.geoguessr.com/_next/static/media/selected-pin-square.bcb5854f.webp",
                        scaledSize: new google.maps.Size(28, 28),
                        anchor: new google.maps.Point(14, 28)
                    },
                    zIndex: 10008
                });
            } else {
                peekMarker.setPosition(pano.location);
            }
            openNativeStreetView(pano)
        }
    });

}


function scheduleGameLoop(delay = 200) {
    if (gameLoopTimer) {
        clearTimeout(gameLoopTimer);
    }

    gameLoopTimer = setTimeout(async () => {
        if (gameLoopRunning) return;

        gameLoopRunning = true;
        try {
            await gameLoop();
        } catch (err) {
            console.error('[Guess Peek] gameLoop error:', err);
        } finally {
            gameLoopRunning = false;
        }
    }, delay);
}


// Throttled game loop scheduler to reduce callback frequency
const throttledScheduleGameLoop = throttle(() => scheduleGameLoop(150), 100);

function startMarkerObserver() {
    stopMarkerObserver();

    markerObserver = new MutationObserver((mutations) => {
        // More precise filtering: only trigger on relevant mutations
        const hasRelevantChange = mutations.some(m =>
                                                 m.addedNodes.length > 0 || m.removedNodes.length > 0
                                                );
        if (hasRelevantChange) {
            throttledScheduleGameLoop();
        }
    });

    markerObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

function stopMarkerObserver() {
    if (markerObserver) {
        markerObserver.disconnect();
        markerObserver = null;
    }

    if (gameLoopTimer) {
        clearTimeout(gameLoopTimer);
        gameLoopTimer = null;
    }
}


function startMapObserver() {
    stopMapObserver();

    const targetNode = document.body;

    mapObserver = new MutationObserver((mutations) => {
        if (!mutations.some(m => m.addedNodes.length > 0)) return;
        const duelMap = document.querySelector(SELECTORS.duelMap)
        const mapEl = document.querySelector(SELECTORS.guessMap) || document.querySelector(SELECTORS.resultMap)|| duelMap;
        if (!mapEl) return;
        guessMap = getGuessMapInstance(mapEl);
        if (guessMap && !clickListenerAttached) {
            attachClickListener(guessMap);
            clickListenerAttached = true;
            if(duelMap && window.location.href.includes('summary'))makeMapResizable()
            stopMapObserver();
        }
    });

    mapObserver.observe(targetNode, {
        childList: true,
        subtree: true,
        attributes: false,
    });
}

function stopMapObserver() {
    if (mapObserver) {
        mapObserver.disconnect();
        mapObserver = null;
    }
    clickListenerAttached = false;
}

function toggleCoverageLayer(action) {
    if (!guessMap) return;
    if (!coverageLayer) coverageLayer = new google.maps.StreetViewCoverageLayer();

    if (isCoverageLayer && action !== "on") {
        coverageLayer.setMap(null);
        isCoverageLayer = false;
    } else if (!isCoverageLayer && action !== "off") {
        coverageLayer.setMap(guessMap);
        isCoverageLayer = true;
    }
}

function addCreditToPage() {
    const isDuelEnd = document.querySelector(SELECTORS.duelMap) && window.location.href.includes('summary')
    let container = document.querySelector(`div[data-qa="result-view-top"]`);
    if (!container && isDuelEnd) {
        container = isDuelEnd.parentElement;
    }

    if (!container || document.getElementById('peek-credit-container')) return;
    const element = document.createElement('div');
    element.id = 'peek-credit-container';
    element.className = 'peek-credit';
    element.innerHTML = `
		<div class="peek-credit-title">GeoGuessr Better Breakdown UI</div>
		<div class="peek-credit-subtitle">by <a href="https://greasyfork.org/users/1179204-kakageo/" target="_blank" rel="noopener noreferrer">kakageo</a>.</div>
	`;
    container.appendChild(element);
    if(isDuelEnd)element.style.left='4rem';
    else element.style.left='1rem';
}

async function gameLoop() {
    if (!domCache.nextRoot) return;
    const token = getGameToken(location.pathname);
    const round = getCurrentRound();
    const roundEndEl = document.querySelector(SELECTORS.roundEnd);
    const gameEndEl = document.querySelector(SELECTORS.gameEnd);
    const duelEndEl = document.querySelector(SELECTORS.duelEnd);
    const isRoundEnd = !!roundEndEl;
    const isGameEnd = !!gameEndEl;
    const isDuelEnd = !!duelEndEl
    const isRoundMarker = document.querySelector(SELECTORS.roundMarker);

    if ((!token || !round) && !isDuelEnd) return;
    if (!isRoundEnd && !isGameEnd && !isDuelEnd && isCoverageLayer) {
        removePeekMarker();
        toggleCoverageLayer("off");
    }

    if (isRoundEnd || isGameEnd||isDuelEnd) {
        addCreditToPage()
    }
    if(isDuelEnd){
        const markers = document.querySelectorAll(SELECTORS.duelMarker);
        for (const marker of markers) {
            const data = getDuelData(marker);
            if(!data) continue
            await applyPanoToDuelMarker(marker, data);
        }
        if(window.location.href.includes('summary'))addDuelRoundsPanel();
    }
    else{
        if (token !== currentGameToken) {
            currentGameToken = token;
            committedRounds.clear();
            lastClickedCoords = null;
        }

        await commitRoundResult({
            token,
            round,
            guessCoords: (isRoundEnd || isGameEnd) ? lastClickedCoords : null,
            hasAnswerMarker: !!isRoundMarker
        });
        updateMarkersUI(token, round, isGameEnd);
    }
}

function removePeekMarker() {
    if (peekMarker) {
        peekMarker.setMap(null);
        peekMarker = null;
    }
}

function updateMarkersUI(token, currentRound, isFinal) {
    const data = GM_getValue(token);
    if (!data) return;
    const markers = document.querySelectorAll(SELECTORS.markerList);
    const answerMarkers = document.querySelectorAll(SELECTORS.roundMarker);
    if (markers.length === 0) return;
    if (isFinal) {
        let rNum = 1;
        for (const marker of markers) {
            if (data.guess?.[rNum]) {
                applyPanoToGuessMarker(marker, data.guess[rNum], rNum);
            }
            rNum++;
        }
        if (answerMarkers && data.answer) {
            let answerNum = 1;
            for (const marker of answerMarkers) {
                if (data.answer?.[answerNum]) {
                    applyPanoToAnswerMarker(marker, data.answer[answerNum], answerNum);
                }
                answerNum++;
            }
        }
    } else {
        const pano = data.guess?.[currentRound];
        if (pano) {
            applyPanoToGuessMarker(markers[0], pano, currentRound);
        }
        const answer = data.answer?.[currentRound];
        if (answer) {
            applyPanoToAnswerMarker(answerMarkers[0], answer, currentRound);
        }
    }
}

function positionTooltip(marker, tooltip) {
    const mapContainer = document.querySelector(SELECTORS.guessMap);
    if (!mapContainer) return;

    const markerRect = marker.getBoundingClientRect();
    const mapRect = mapContainer.getBoundingClientRect();

    const TOOLTIP_WIDTH = 300;
    const BUFFER = 10;

    if (markerRect.top >= mapRect.height / 2) {

        tooltip.style.bottom = "100%";
        tooltip.style.top = "auto";
        tooltip.style.marginBottom = "15px";
        tooltip.style.marginTop = "0";
    } else {
        tooltip.style.top = "100%";
        tooltip.style.bottom = "auto";
        tooltip.style.marginTop = "5px";
        tooltip.style.marginBottom = "0";
    }

    const markerCenterX = markerRect.left + markerRect.width / 2;

    const overflowLeft =
          markerCenterX - TOOLTIP_WIDTH / 2 < mapRect.left + BUFFER;

    const overflowRight =
          markerCenterX + TOOLTIP_WIDTH / 2 > mapRect.right - BUFFER;

    if (overflowLeft) {
        tooltip.style.left = "0";
        tooltip.style.right = "auto";
        tooltip.style.transform = "translateX(0)";
    } else if (overflowRight) {
        tooltip.style.left = "auto";
        tooltip.style.right = "0";
        tooltip.style.transform = "translateX(0)";
    } else {
        tooltip.style.left = "50%";
        tooltip.style.right = "auto";
        tooltip.style.transform = "translateX(-50%)";
    }
}

function applyPanoToGuessMarker(marker, pano, roundId) {
    const bindKey = `bound_${roundId}`;
    const markerData = markerDataMap.get(marker) || {};
    if (markerData.peekBound === bindKey) return;

    markerData.peekBound = bindKey;
    markerData.pano = pano.error ? "false" : "true";
    markerDataMap.set(marker, markerData);

    marker.style.cursor = "pointer";
    marker.style.pointerEvents = "auto";
    marker.dataset.pano = markerData.pano; // Keep for CSS selectors

    // Remove existing tooltips
    const existingTooltips = marker.querySelectorAll(".peek-tooltip");
    for (const t of existingTooltips) t.remove();

    const tooltip = document.createElement("div");
    tooltip.className = "peek-tooltip";
    if (pano.error) {
        tooltip.innerHTML = `<div class="peek-error">No Street View found within 250km</div>`;
    } else {
        tooltip.innerHTML = `
            <div class="peek-header">
                <span class="peek-dist">${formatDistance(pano.radius)}</span> away from the nearest street view
            </div>
            <div class="peek-body">
                <img src="${getStreetViewThumbUrl(pano)}" class="peek-thumb" alt="Preview">
            </div>
            <div class="peek-note">Click pin to view Street View</div>
        `;

        const clickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            removePeekMarker();
            openNativeStreetView(pano);
        };

        // Use WeakMap for event handler cleanup
        const oldHandler = markerHandlerMap.get(marker);
        if (oldHandler) {
            marker.removeEventListener("click", oldHandler);
        }
        markerHandlerMap.set(marker, clickHandler);
        marker.addEventListener("click", clickHandler);
    }

    marker.appendChild(tooltip);
}

// WeakMap to track initialized containers
const initializedContainers = new WeakMap();

function addDuelRoundsPanel() {
    const mapContainer = document.querySelector('[class*="game-summary_mapContainer"]');
    if (!mapContainer || initializedContainers.get(mapContainer)?.duelPanel) return;

    initializedContainers.set(mapContainer, { ...initializedContainers.get(mapContainer), duelPanel: true });
    mapContainer.style.position = 'relative';
    mapContainer.style.overflow = 'hidden';

    const playedRounds = document.querySelectorAll('[class*="game-summary_playedRounds"]');

    if (!playedRounds.length) {
        console.error('Duel rounds elements not found', {playedRounds});
        return;
    }

    const toggleButton = document.createElement('button');
    toggleButton.className = 'peek-duel-rounds-button';
    toggleButton.innerHTML = SVG_SOURCE.PANEL;
    toggleButton.title = 'Toggle rounds panel';

    const panel = document.createElement('div');
    panel.className = 'peek-duel-rounds-panel';

    const panelContent = document.createElement('div');
    panelContent.className = 'peek-duel-rounds-content';

    const roundsContainer = document.createElement('div');
    roundsContainer.className = 'peek-duel-rounds-list';

    for (const round of playedRounds) {
        const clonedRound = round.cloneNode(true);
        roundsContainer.appendChild(clonedRound);
    }
    const summaryTitle = document.querySelector('[class*="game-summary_summaryTitle"]');
    if (summaryTitle) summaryTitle.style.display = "none";

    const gameModeBrand = document.querySelector('[class*="game-mode-brand_root"]');
    const gameMode = document.querySelector('[class*="game-mode-brand_selected"]');
    const mapName=document.querySelector('[class*="game-mode-brand_mapName"]');
    gameModeBrand.style.display = "none";

    const gameModeHeader = document.createElement('div');
    gameModeHeader.className = 'peek-duel-game-header';

    const gameModeContainer = document.createElement('div');
    gameModeContainer.className = 'peek-duel-game-info';

    if (gameMode) {
        const clonedGameMode = gameMode.cloneNode(true);
        // Reset positioning styles that might cause misalignment
        clonedGameMode.style.position = 'static';
        clonedGameMode.style.transform = 'none';
        clonedGameMode.style.left = 'auto';
        clonedGameMode.style.top = 'auto';
        clonedGameMode.style.right = 'auto';
        clonedGameMode.style.bottom = 'auto';
        gameModeContainer.appendChild(clonedGameMode);
    }

    if (mapName) {
        const clonedMapName = mapName.cloneNode(true);
        // Reset positioning styles that might cause misalignment
        clonedMapName.style.position = 'static';
        clonedMapName.style.transform = 'none';
        clonedMapName.style.left = 'auto';
        clonedMapName.style.top = 'auto';
        clonedMapName.style.right = 'auto';
        clonedMapName.style.bottom = 'auto';
        gameModeContainer.appendChild(clonedMapName);
    }

    if (gameMode || mapName) {
        gameModeHeader.appendChild(gameModeContainer);
        panelContent.appendChild(gameModeHeader);
    }
    const clonedRoundElements = roundsContainer.querySelectorAll('[class*="game-summary_playedRound"]');
    const originalRoundElements = document.querySelectorAll('[class*="game-summary_playedRounds"]:not(.peek-duel-rounds-list) [class*="game-summary_playedRound"]');

    const getSelectedClass = (element) => {
        return Array.from(element.classList).find(cls => cls.includes('game-summary_selectedRound'));
    };

    const roundIndicator = document.createElement('div');
    roundIndicator.className = 'peek-round-indicator';
    roundIndicator.textContent = 'Round 1';
    mapContainer.appendChild(roundIndicator);
    const updateRoundIndicator = () => {
        const selectedElement = roundsContainer.querySelector('[class*="game-summary_selectedRound"]');
        if (selectedElement) {
            const textElement = selectedElement.querySelector('[class*="game-summary_text__"]');
            if (textElement) {
                const match = textElement.textContent.match(/Round\s+(\d+)/i);
                if (match) {
                    roundIndicator.textContent = `Round ${match[1]}`;
                }
            }
        }
    };

    clonedRoundElements.forEach((roundElement, index) => {
        roundElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const selectedClass = getSelectedClass(roundElement);
            const isAlreadySelected = selectedClass && roundElement.classList.contains(selectedClass);

            if (isAlreadySelected) {
                return;
            }

            // Remove selected class from all cloned elements
            for (const el of clonedRoundElements) {
                const selectedClass = getSelectedClass(el);
                if (selectedClass) el.classList.remove(selectedClass);
            }

            // Remove selected class from all original elements
            for (const el of originalRoundElements) {
                const selectedClass = getSelectedClass(el);
                if (selectedClass) el.classList.remove(selectedClass);
            }

            const originalElement = originalRoundElements[index - 2];
            if (originalElement && typeof originalElement.click === 'function') {
                // Trigger the original element click
                originalElement.click();

                // Wait for the original element to be processed, then sync both elements
                setTimeout(() => {
                    const selectedClass = getSelectedClass(originalElement);
                    if (selectedClass) {
                        // Keep both original and cloned elements selected
                        if (!originalElement.classList.contains(selectedClass)) {
                            originalElement.classList.add(selectedClass);
                        }
                        if (!roundElement.classList.contains(selectedClass)) {
                            roundElement.classList.add(selectedClass);
                        }
                    }
                    // 更新回合指示器
                    updateRoundIndicator();
                }, 50); // Increase timeout to ensure proper state synchronization
            }

            if (closeControl) closeControl.click();
            toggleCoverageLayer("off");
        });
    });
    panelContent.appendChild(roundsContainer);
    panel.appendChild(panelContent);

    originalRoundElements.forEach((originalEl, index) => {
        const clonedEl = clonedRoundElements[index + 2];
        if (clonedEl) {
            originalEl.addEventListener('click', () => {
                setTimeout(() => {
                    const selectedClass = getSelectedClass(originalEl);
                    if (selectedClass && originalEl.classList.contains(selectedClass)) {
                        clonedRoundElements.forEach(el => {
                            const cls = getSelectedClass(el);
                            if (cls) el.classList.remove(cls);
                        });
                        clonedEl.classList.add(selectedClass);
                        updateRoundIndicator();
                    }
                }, 50);
            });
        }
        originalEl.style.display='none'
    });

    // 初始化回合指示器
    updateRoundIndicator();

    const closeButton = document.createElement('button');
    closeButton.className = 'peek-duel-rounds-close';
    closeButton.innerHTML = '×';
    closeButton.title = 'Close panel';
    panel.appendChild(closeButton);

    mapContainer.appendChild(toggleButton);
    mapContainer.appendChild(panel);


    const togglePanel = () => {
        const isActive = panel.classList.toggle('active');
        toggleButton.classList.toggle('active');
        toggleButton.style.opacity = isActive ? '0' : '1';
        toggleButton.style.pointerEvents = isActive ? 'none' : 'auto';
    };

    const closePanel = () => {
        panel.classList.remove('active');
        toggleButton.classList.remove('active');
        toggleButton.style.opacity = '1';
        toggleButton.style.pointerEvents = 'auto';
    };

    toggleButton.addEventListener('click', togglePanel);
    closeButton.addEventListener('click', closePanel);

    panel.addEventListener('click', (e) => {
        if (e.target === panel) {
            togglePanel();
        }
    });
}

function makeMapResizable() {
    const summaryContainer =document.querySelector('[class^="game-summary_innerContainer"]');
    const summaryBottom = document.querySelector('[class^="game-summary_bottom"]');
    if(summaryContainer)summaryContainer.style.paddingBottom='0'
    if(summaryBottom) summaryBottom.style.minHeight= '4rem'
    const mapContainer = document.querySelector('[class*="game-summary_mapContainer"]');
    if (!mapContainer) return;

    const containerData = initializedContainers.get(mapContainer) || {};
    if (containerData.resizable) return;

    containerData.resizable = true;
    initializedContainers.set(mapContainer, containerData);
    mapContainer.style.position = 'relative';

    const savedSize = GM_getValue('mapContainerSize', { width: null, height: null });
    if (savedSize.width && savedSize.height) {
        mapContainer.style.width = `${savedSize.width}px`;
        mapContainer.style.height = `${Math.min(window.innerHeight-160,savedSize.height)}px`;
    }

    const resizerStyle = {
        position: 'fixed',
        background: 'rgba(100, 100, 255, 0.3)',
        transition: 'background 0.2s',
        zIndex: 10010
    };

    const resizers = [
        { name: 'top', cursor: 'n-resize', style: 'top: 0; left: 0; right: 0; height: 5px;' },
        { name: 'bottom', cursor: 's-resize', style: 'bottom: 0; left: 0; right: 0; height: 5px;' },
        { name: 'left', cursor: 'w-resize', style: 'left: 0; top: 0; bottom: 0; width: 5px;' },
        { name: 'right', cursor: 'e-resize', style: 'right: 0; top: 0; bottom: 0; width: 5px;' },
        { name: 'top-left', cursor: 'nw-resize', style: 'top: 0; left: 0; width: 10px; height: 10px;' },
        { name: 'top-right', cursor: 'ne-resize', style: 'top: 0; right: 0; width: 10px; height: 10px;' },
        { name: 'bottom-left', cursor: 'sw-resize', style: 'bottom: 0; left: 0; width: 10px; height: 10px;' },
        { name: 'bottom-right', cursor: 'se-resize', style: 'bottom: 0; right: 0; width: 10px; height: 10px;' }
    ];

    let isResizing = false;
    let currentResizer = null;
    let startX = 0, startY = 0;
    let startWidth = 0, startHeight = 0;
    let startLeft = 0, startTop = 0;

    for (const config of resizers) {
        const resizer = document.createElement('div');
        resizer.className = `map-resizer-${config.name}`;
        resizer.style.cssText = `${config.style} position: absolute; cursor: ${config.cursor}; z-index: ${resizerStyle.zIndex}; background: ${resizerStyle.background};`;

        resizer.addEventListener('mouseenter', () => {
            resizer.style.background = 'rgba(100, 100, 255, 0.6)';
        });

        resizer.addEventListener('mouseleave', () => {
            if (!isResizing) resizer.style.background = resizerStyle.background;
        });

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            currentResizer = config.name;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = mapContainer.offsetWidth;
            startHeight = mapContainer.offsetHeight;

            const rect = mapContainer.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            document.body.style.cursor = config.cursor;
            document.body.style.userSelect = 'none';
            e.preventDefault();
            e.stopPropagation();
        });

        mapContainer.appendChild(resizer);
    }

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;

        if (currentResizer.includes('right')) {
            newWidth = startWidth + deltaX;
        } else if (currentResizer.includes('left')) {
            newWidth = startWidth - deltaX;
        }

        if (currentResizer.includes('bottom')) {
            newHeight = startHeight + deltaY;
        } else if (currentResizer.includes('top')) {
            newHeight = startHeight - deltaY;
        }

        const minWidth = 300;
        const maxWidth = window.innerWidth - 100;
        const minHeight = 250;
        const maxHeight = window.innerHeight-160;

        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

        mapContainer.style.width = `${newWidth}px`;
        mapContainer.style.height = `${newHeight}px`;
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            currentResizer = null;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';

            GM_setValue('mapContainerSize', {
                width: mapContainer.offsetWidth,
                height: mapContainer.offsetHeight
            });

            const resizerElements = mapContainer.querySelectorAll('[class^="map-resizer-"]');
            for (const r of resizerElements) {
                r.style.background = resizerStyle.background;
            }
        }
    });
}

async function applyPanoToDuelMarker(marker, data){
    if (!data) return;
    let pano;
    if(data.panorama){
        pano= {
            panoId:convertPanoId(data.panorama.panoId),
            location:{lat:data.panorama.lat,lng:data.panorama.lng},
            heading:data.panorama.heading,
            pitch:data.panorama.pitch,
            zoom:data.panorama.zoom
        };
    }
    else{
        pano = await getNearestPano({lat:data.lat,lng:data.lng});
    }
    marker.style.cursor = "pointer";
    marker.style.pointerEvents = "auto";
    if (!data.panorama) marker.dataset.pano = pano.error ? "false" : "true";

    if(marker.querySelector(".peek-duel-tooltip")||marker.querySelector(".peek-duel-answer-tooltip"))return;

    const tooltip = document.createElement("div");
    tooltip.className = "peek-duel-tooltip";
    if (pano.error) {
        tooltip.innerHTML = `<div class="peek-error">No Street View found within 250km</div>`;
    }
    else if (data.panorama){
        tooltip.className = "peek-duel-answer-tooltip";
        tooltip.innerHTML = `
            <div class="peek-note">Click pin to view Street View</div>
            <div class="peek-body">
                <img src="${getStreetViewThumbUrl(pano)}" class="peek-thumb">
            </div>
        `;
    }
    else {
        tooltip.innerHTML = `
            <div class="peek-header">
                <span class="peek-dist">${formatDistance(pano.radius)}</span> away from the nearest street view
            </div>
            <div class="peek-body">
                <img src="${getStreetViewThumbUrl(pano)}" class="peek-thumb" alt="Preview">
            </div>
            <div class="peek-note">Click pin to view Street View</div>
        `;
    }
    const clickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        removePeekMarker();
        openNativeStreetView(pano);
    };

    // Use WeakMap for event handler cleanup
    const oldHandler = markerHandlerMap.get(marker);
    if (oldHandler) {
        marker.removeEventListener("click", oldHandler);
    }
    markerHandlerMap.set(marker, clickHandler);
    marker.addEventListener("click", clickHandler);

    marker.appendChild(tooltip);
}

function applyPanoToAnswerMarker(marker, pano, roundId) {
    const bindKey = `answer_${roundId}`;
    const markerData = markerDataMap.get(marker) || {};
    if (markerData.peekBound === bindKey) return;

    markerData.peekBound = bindKey;
    markerDataMap.set(marker, markerData);

    marker.style.cursor = "pointer";
    marker.style.pointerEvents = "auto";

    // Remove existing tooltips
    const existingTooltips = marker.querySelectorAll(".peek-answer-tooltip");
    for (const t of existingTooltips) t.remove();

    const tooltip = document.createElement("div");
    tooltip.className = "peek-answer-tooltip";
    tooltip.innerHTML = `
            <div class="peek-note">Click pin to view Street View</div>
            <div class="peek-body">
                <img src="${getStreetViewThumbUrl(pano)}" class="peek-thumb">
            </div>
        `;
    marker.appendChild(tooltip);
    const clickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        removePeekMarker();
        openNativeStreetView(pano);
    };

    // Use WeakMap for event handler cleanup
    const oldHandler = markerHandlerMap.get(marker);
    if (oldHandler) {
        marker.removeEventListener("click", oldHandler);
    }
    markerHandlerMap.set(marker, clickHandler);
    marker.addEventListener("click", clickHandler);
}
function getGeneration(worldsize, country, lat, date) {
    if (!worldsize) return 'Ari';
    if (worldsize === 1664) return 'Gen1';
    if (worldsize === 8192) return 'Gen4';
    if (worldsize === 6656) {
        const dateStr = date.toISOString().slice(0, 7);
        const gen2Countries = new Set(['AU', 'BR', 'CA', 'CL', 'JP', 'GB', 'IE', 'NZ', 'MX', 'RU', 'US', 'IT', 'DK', 'GR', 'RO',
                                       'PL', 'CZ', 'CH', 'SE', 'FI', 'BE', 'LU', 'NL', 'ZA', 'SG', 'TW', 'HK', 'MO', 'MC', 'NO',
                                       'SM', 'AD', 'IM', 'JE', 'FR', 'DE', 'ES', 'PT', 'SJ']);
        const gen3Dates = {
            'BD': '2021-04', 'EC': '2022-03', 'FI': '2020-09', 'IN': '2021-10', 'LK': '2021-02', 'KH': '2022-10',
            'LB': '2021-05', 'NG': '2021-06', 'ST': '2024-02', 'US': '2019-01', 'VN': '2021-01', 'ES': '2023-01'
        };
        if (dateStr >= '2022-01') return 'BadCam'
        if (dateStr >= gen3Dates[country]) {
            if (country != 'US') return 'BadCam'
            if (country === 'US' && lat > 52) return 'BadCam'
        }

        if (gen2Countries.has(country) && dateStr <= '2011-11') {
            return dateStr >= '2010-09' ? 'Gen2/3' : 'Gen2';
        }

        return 'Gen3';
    }
}

function parseMeta(data) {
    const tags = []

    const panoId = data[1][0][1][1];
    const lat = data[1][0][5][0][1][0][2];
    const lng = data[1][0][5][0][1][0][3];
    const year = data[1][0][6][7][0];
    const month = data[1][0][6][7][1];
    const worldsize = data[1][0][2][2][0];
    const history = data[1][0][5][0][8];
    const links = data[1][0][5][0][3][0]


    const date = new Date(year, month - 1);
    const formattedDate = date.toLocaleString('default', { month: 'short', year: 'numeric' });

    let heading, region, locality, road, country, altitude;
    try {
        heading = data[1][0][5][0][1][2][0];
    } catch (e) {
        heading = 0
    }
    try {
        country = data[1][0][5][0][1][4];
        if (['TW', 'HK', 'MO'].includes(country)) {
            country = 'CN';
        }
    } catch (e) {
        country = null;
    }

    try {
        const address = data[1][0][3][2][1][0];
        const parts = address.split(',')
        if (parts.length > 1) {
            region = parts[parts.length - 1].trim();
            locality = parts[0].trim()
        } else {
            region = address;
        }
    } catch (e) {
        try {
            const address = data[1][0][3][2][0][0]
            const parts = address.split(',')
            if (parts.length > 1) {
                region = parts[parts.length - 1].trim();
                locality = parts[0].trim()
            }
            else region = address;
        }
        catch (e) {
            region = null;
        }
    }
    try {
        road = data[1][0][5][0][12][0][0][0][2][0];
    } catch (e) {
        road = null;
    }
    try {
        altitude = data[1][0][5][0][1][1][0]
    }
    catch (e) {
        altitude = null;
    }
    const generation = String(data[1][0][4]).includes('Google') ? getGeneration(worldsize, country, lat, date) : 'ari';
    let camera;
    if (generation == 'Gen4') {
        if (['IN', 'PR'].includes(country)) camera = 'smallcam'
        else if (['NA', 'PA', 'OM', 'QA', 'EC'].includes(country)) camera = 'gen4trekker'
    }
    const isNewRoad = !history ? 'newroad' : false;
    const tagFields = [
        formattedDate, `${year}-${month}`, `${String(year).slice(2, 4)}-${month}`, year,
        MONTHS_SHORT[month - 1], MONTHS_FULL[month - 1],
        country, region, locality, road,
        generation, camera, altitude ? altitude.toFixed(2) + 'm' : null, isNewRoad
    ].filter(Boolean);
    return {
        lat,
        lng,
        altitude,
        panoId,
        year,
        month,
        country,
        region,
        locality,
        road,
        generation,
        links,
        history,
        heading: Math.round(heading),
        pitch: 0,
        zoom: 0,
        tags,
        tagFields
    }
}
async function UE(t, e, s, d, r) {
    try {
        const url = `https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/${t}`;
        let payload = createPayload(t, e, s, d, r);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json+protobuf",
                "x-user-agent": "grpc-web-javascript/0.1"
            },
            body: payload,
            mode: "cors",
            credentials: "omit"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            return await response.json();
        }
    } catch (error) {
        console.error(`There was a problem with the UE function: ${error.message}`);
    }
}

function createPayload(mode, coorData, s, d, r) {
    var payload;
    let type = 2
    if (mode === 'GetMetadata') {
        const length = coorData.length
        if (String(coorData).substring(0, 4) == 'CIHM' || length != 22) type = 10
        payload = [["apiv3"], ["en", "US"], [[[type, coorData]]], [[1, 2, 3, 4, 8, 6]]];
    }
    else if (mode === 'SingleImageSearch') {
        payload = [["apiv3"],
                   [[null, null, parseFloat(coorData.lat), parseFloat(coorData.lng)], r],
                   [[null, null, null, null, null, null, null, null, null, null, [s, d]], null, null, null, null, null, null, null, [2], null, [[[type, true, 2]]]], [[1, 2, 3, 4, 8, 6]]]
    }
    else {
        throw new Error("Invalid mode!");
    }
    return JSON.stringify(payload);
}

async function getLOCATION() {
    const metaData = await UE('GetMetadata', viewer.getPano());
    if (metaData) {
        LOCATION = parseMeta(metaData)
        LOCATION.heading = viewer.getPov().heading;
        LOCATION.pitch = viewer.getPov().pitch;
        LOCATION.zoom = viewer.getZoom();
    }
}

function calculateFOV(zoom) {
    const pi = Math.PI;
    const argument = (3 / 4) * Math.pow(2, 1 - zoom);
    const radians = Math.atan(argument);
    const degrees = (360 / pi) * radians;
    return degrees;
}

async function getShortLink() {
    const url = 'https://www.google.com/maps/rpc/shorturl';
    if (!viewer) {
        return fallbackLink();
    }

    const aElements = document.querySelectorAll('[rel="noopener"]');
    if (!aElements || aElements.length < 2) {
        return fallbackLink();
    }

    const ShareLinkElement = aElements[aElements.length - 2];
    const regex = /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)a,(-?\d+(?:\.\d+)?)y,(-?\d+(?:\.\d+)?)h,(-?\d+(?:\.\d+)?)t\/data=!3m4!1e\d+!3m2!1s([^!]+)!2e\d+(?:\?.*)?/;
    const shareLink = ShareLinkElement.getAttribute('href');
    const match = shareLink.match(regex);

    if (match) {
        const [, lat, lng, , y, h, t, panoId] = match;
        const payload = `!1shttps://www.google.com/maps/@${lat},${lng},3a,${y}y,${h}h,${t}t/data=*213m5*211e1*213m3*211s${panoId}*212e0*216shttps%3A%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3D${panoId}%26cb_client%3Dmaps_sv.share%26w%3D900%26h%3D600%26yaw%3D${h}%26pitch%3D${90 - parseFloat(t)}%26thumbfov%3D100*217i16384*218i8192?coh=205410&entry=tts!2m1!7e81!6b1`;

        const params = new URLSearchParams({
            authuser: '0',
            hl: 'en',
            gl: 'us',
            pb: payload
        }).toString();
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${url}?${params}`,
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        const text = response.responseText;
                        const match = text.match(/"([^"]+)"/);
                        if (match && match[1]) {
                            resolve(match[1]);
                        } else {
                            resolve(fallbackLink());
                        }
                    } else {
                        resolve(fallbackLink());
                    }
                },
                onerror: function () {
                    resolve(fallbackLink());
                }
            });
        });
    } else {
        return fallbackLink();
    }

    function fallbackLink() {
        return `https://www.google.com/maps/@?api=1&map_action=pano&heading=${viewer.getPov().heading}&pitch=${viewer.getPov().pitch}&fov=${calculateFOV(viewer.getZoom())}&pano=${viewer.getPano()}`;
    }
}

async function updatePanoSelector(pano, selector) {
    if (!svs) initSVS();
    const panoData = await new Promise((resolve, reject) => {
        svs.getPanorama(
            pano.panoId ? { pano: pano.panoId } : { location: pano.location },
            (data, status) => {
                if (status === google.maps.StreetViewStatus.OK) {
                    resolve(data);
                } else {
                    reject(new Error(`StreetView request failed: ${status}`));
                }
            }
        );
    });
    if (!panoData || !panoData.time || !panoData.imageDate) return
    const frag = document.createDocumentFragment();
    let [defaultYear, defaultMonth] = panoData.imageDate.split("-");
    if (panoData.imageDate && panoData.location?.pano) {
        frag.appendChild(new Option(
            `${MONTHS_FULL[defaultMonth - 1]} ${defaultYear} (Current)`,
            panoData.location.pano
        ));
    }

    if (Array.isArray(panoData.time) && panoData.time.length > 1) {
        for (const entry of panoData.time) {
            const date = extractDate(entry);
            if (!date) continue;
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            if (year == defaultYear && month == defaultMonth) continue;
            frag.appendChild(new Option(
                `${MONTHS_FULL[month - 1]} ${year}`,
                entry.pano
            ));
        }
    }
    selector.replaceChildren(frag);
}

function enterFullscreen(panoDiv) {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (panoDiv.requestFullscreen) {
            panoDiv.requestFullscreen();
        } else if (panoDiv.webkitRequestFullscreen) {
            panoDiv.webkitRequestFullscreen();
        } else if (panoDiv.msRequestFullscreen) {
            panoDiv.msRequestFullscreen();
        }
    }
}

function trackMovement() {
    if (!viewer || !guessMap) return;

    const position = viewer.getPosition();
    if (!position) return;

    const newPoint = {
        lat: position.lat(),
        lng: position.lng()
    };

    movementPath.push(newPoint);

    if (movementPath.length > 1) {
        if (pathPolyline) {
            pathPolyline.setPath(movementPath);
        } else {
            pathPolyline = new google.maps.Polyline({
                path: movementPath,
                geodesic: true,
                strokeColor: 'rgb(204, 48, 46)',
                strokeOpacity: 0.9,
                strokeWeight: 4,
                map: guessMap,
                zIndex: 10000
            });
        }
    }
}

function clearMovementPath() {
    if (pathPolyline) {
        pathPolyline.setMap(null);
        pathPolyline = null;
    }
    movementPath = [];
}

function togglePhotoMode(photoControl, viewer) {
    isPhotoMode = !isPhotoMode;
    const panoDiv = document.querySelector('.peek-split-pano');
    const controls = document.querySelectorAll('.peek-control');
    const panoSelect = document.getElementById('pano-select');

    if (isPhotoMode) {
        enterFullscreen(panoDiv);

        const footer = document.querySelectorAll('.gmnoprint');
        for (const el of footer) {
            el.style.display = 'none';
        }

        for (const ctrl of controls) {
            ctrl.style.display = 'none';
        }
        if (panoSelect) panoSelect.style.display = 'none';

        viewer.setOptions({
            addressControl: false,
            linksControl: false,
            fullscreenControl: false,
            clickToGo: false,
        });

        photoControl.style.opacity = '0.1';
        photoControl.title = 'Exit Photo Mode';

        cleanStyle = GM_addStyle(`
      .embed-controls {display: none !important}
      .SLHIdE-sv-links-control {display: none !important}
      [alt="Google"] {display: none !important}
      [class$="gmnoprint"], [class$="gm-style-cc"], [class$="gm-compass"] {display: none !important}
    `);
    } else {
        for (const ctrl of controls) {
            ctrl.style.display = '';
        }
        if (panoSelect) panoSelect.style.display = '';

        viewer.setOptions({
            addressControl: true,
            linksControl: true,
            fullscreenControl: true,
            clickToGo: true,
        });

        if (cleanStyle) {
            cleanStyle.remove();
            cleanStyle = null;
        }

        photoControl.style.opacity = '1';
        photoControl.title = 'Photo Mode (Hide UI)';
    }
}

function openNativeStreetView(pano) {
    if (!pano || pano.error) return;
    if (!guessMap) guessMap = getGuessMapInstance();
    if (!guessMap) {
        console.error("[Guess Peek] Could not find Google Maps instance");
        return;
    }
    toggleCoverageLayer("on")
    const shareDiv = document.querySelector("[class*='standard-final-result_challengeFriendButton']")
    if (shareDiv) shareDiv.style.display = 'none'
    const xpDiv = document.querySelector("[class*='level-up-xp-button']")
    if (xpDiv) xpDiv.style.opacity = '0'
    const mapContainer = document.querySelector(SELECTORS.resultMap)|| document.querySelector(SELECTORS.duelMap);
    const isDuelMode = !!document.querySelector(SELECTORS.duelMap);
    const actualContainer = isDuelMode ? mapContainer.parentElement : mapContainer;

    //offsetMapFocus(guessMap, pano.location);

    let coverageLayerControl = document.getElementById('layer-toggle');
    if (!coverageLayerControl) {
        coverageLayerControl = document.createElement('button');
        coverageLayerControl.className = 'peek-map-control';
        coverageLayerControl.id = 'layer-toggle'
        coverageLayerControl.innerHTML = `
            <img alt="Coverage Layer Toggle" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2023%2038%22%3E%3Cpath%20d%3D%22M16.6%2038.1h-5.5l-.2-2.9-.2%202.9h-5.5L5%2025.3l-.8%202a1.53%201.53%200%2001-1.9.9l-1.2-.4a1.58%201.58%200%2001-1-1.9v-.1c.3-.9%203.1-11.2%203.1-11.2a2.66%202.66%200%20012.3-2l.6-.5a6.93%206.93%200%20014.7-12%206.8%206.8%200%20014.9%202%207%207%200%20012%204.9%206.65%206.65%200%2001-2.2%205l.7.5a2.78%202.78%200%20012.4%202s2.9%2011.2%202.9%2011.3a1.53%201.53%200%2001-.9%201.9l-1.3.4a1.63%201.63%200%2001-1.9-.9l-.7-1.8-.1%2012.7zm-3.6-2h1.7L14.9%2020.3l1.9-.3%202.4%206.3.3-.1c-.2-.8-.8-3.2-2.8-10.9a.63.63%200%2000-.6-.5h-.6l-1.1-.9h-1.9l-.3-2a4.83%204.83%200%20003.5-4.7A4.78%204.78%200%200011%202.3H10.8a4.9%204.9%200%2000-1.4%209.6l-.3%202h-1.9l-1%20.9h-.6a.74.74%200%2000-.6.5c-2%207.5-2.7%2010-3%2010.9l.3.1L4.8%2020l1.9.3.2%2015.8h1.6l.6-8.4a1.52%201.52%200%20011.5-1.4%201.5%201.5%200%20011.5%201.4l.9%208.4zm-10.9-9.6zm17.5-.1z%22%20style%3D%22isolation%3Aisolate%22%20fill%3D%22%23333%22%20opacity%3D%22.7%22/%3E%3Cpath%20d%3D%22M5.9%2013.6l1.1-.9h7.8l1.2.9%22%20fill%3D%22%23ce592c%22/%3E%3Cellipse%20cx%3D%2210.9%22%20cy%3D%2213.1%22%20rx%3D%222.7%22%20ry%3D%22.3%22%20style%3D%22isolation%3Aisolate%22%20fill%3D%22%23ce592c%22%20opacity%3D%22.5%22/%3E%3Cpath%20d%3D%22M20.6%2026.1l-2.9-11.3a1.71%201.71%200%2000-1.6-1.2H5.699999999999999a1.69%201.69%200%2000-1.5%201.3l-3.1%2011.3a.61.61%200%2000.3.7l1.1.4a.61.61%200%2000.7-.3l2.7-6.7.2%2016.8h3.6l.6-9.3a.47.47%200%2001.44-.5h.06c.4%200%20.4.2.5.5l.6%209.3h3.6L15.7%2020.3l2.5%206.6a.52.52%200%2000.66.31l1.2-.4a.57.57%200%2000.5-.7z%22%20fill%3D%22%23fdbf2d%22/%3E%3Cpath%20d%3D%22M7%2013.6l3.9%206.7%203.9-6.7%22%20style%3D%22isolation%3Aisolate%22%20fill%3D%22%23cf572e%22%20opacity%3D%22.6%22/%3E%3Ccircle%20cx%3D%2210.9%22%20cy%3D%227%22%20r%3D%225.9%22%20fill%3D%22%23fdbf2d%22/%3E%3C/svg%3E" style="color: transparent;">
        `;
        mapContainer.appendChild(coverageLayerControl);
        coverageLayerControl.onclick = () => toggleCoverageLayer();
    }

    let splitContainer = actualContainer.querySelector('.peek-split-container');

    if (!splitContainer) {
        if (isDuelMode && actualContainer) {
            actualContainer.style.position = 'relative';
        }

        splitContainer = document.createElement('div');
        splitContainer.className = 'peek-split-container';
        splitContainer.innerHTML = `
            <div class="peek-split-resizer"></div>
            <div class="peek-split-pano" id="peek-pano"></div>
        `;
        actualContainer.appendChild(splitContainer);

        const resizer = splitContainer.querySelector('.peek-split-resizer');
        let isResizing = false;
        let startX = 0;
        let startWidth = 0;

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startWidth = splitContainer.offsetWidth;
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const deltaX = startX - e.clientX;
            const newWidth = startWidth + deltaX;
            const containerWidth = mapContainer.offsetWidth;

            const minWidth = containerWidth * 0.2;
            const maxWidth = containerWidth * 0.8;

            if (newWidth >= minWidth && newWidth <= maxWidth) {
                const widthPercent = (newWidth / containerWidth) * 100;
                splitContainer.style.width = widthPercent + '%';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        });

        const panoDiv = document.getElementById('peek-pano');

        viewer = new google.maps.StreetViewPanorama(panoDiv, {
            pov: {
                heading: pano.heading || 0,
                pitch: pano.pitch || 0
            },
            zoom: pano.zoom||1,
            addressControl: true,
            showRoadLabels: false,
            enableCloseButton: false,
            zoomControl: true,
            clickToGo: true
        })

        pano.panoId?viewer.setPano(pano.panoId):viewer.setPosition(pano.location)

        viewer.addListener("pano_changed", function () {
            updatePanoSelector({panoId:viewer.getPano()}, panoSelector)
        });

        viewer.addListener("position_changed", function () {
            trackMovement();
        });

        closeControl = document.createElement('button')
        closeControl.className = 'peek-control'
        closeControl.id = 'peek-split-close'
        closeControl.textContent = '×'
        closeControl.onclick = (e) => {
            e.stopPropagation();
            if (shareDiv) shareDiv.style.display = 'block';
            if (xpDiv) xpDiv.style.opacity = '1.0';
            splitContainer.classList.remove('active');
            removePeekMarker();
            clearMovementPath();
            toggleCoverageLayer("off")
        };
        viewer.controls[google.maps.ControlPosition.RIGHT_TOP].push(closeControl);

        const saveControl = document.createElement('button')
        saveControl.className = 'peek-control'
        saveControl.id = 'peek-save'
        saveControl.title = 'Save to MapMaking'
        saveControl.innerHTML = SVG_SOURCE.SAVE
        saveControl.addEventListener('click', async () => {
            await getLOCATION()
            if (MAP_MAKING_API_KEY === 'PASTE_YOUR_KEY_HERE') {
                await Swal.fire({
                    icon: 'warning',
                    title: 'API Key Required',
                    html: `To save locations to <strong>Map Making App</strong>, please enter your API key below.<br><br>
           You can generate an API key <a href="https://map-making.app/keys" target="_blank" style="color: #007bff; text-decoration: none;"><strong>here</strong></a>.`,
                    input: 'text',
                    inputPlaceholder: 'Enter your API key',
                    showCancelButton: true,
                    confirmButtonText: 'Save',
                    cancelButtonText: 'Cancel',
                    backdrop: null,
                    preConfirm: (value) => {
                        if (!value) {
                            Swal.showValidationMessage('API key cannot be empty');
                        }
                        return value;
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        MAP_MAKING_API_KEY = result.value
                        GM_setValue("MAP_MAKING_API_KEY", result.value);
                    }
                });
            }

            if (!MAP_LIST) {
                showLoader();

                try {
                    MAP_LIST = await getMaps();
                } catch {
                }

                hideLoader();
            }

            if (MAP_LIST) {
                showMapList()
            }
        });
        viewer.controls[google.maps.ControlPosition.RIGHT_TOP].push(saveControl);

        const copyControl = document.createElement('button')
        copyControl.className = 'peek-control'
        copyControl.id = 'peek-copy'
        copyControl.title = 'Copy Link'
        copyControl.innerHTML = SVG_SOURCE.COPY
        copyControl.addEventListener("click", async () => {
            copyControl.innerHTML = SVG_SOURCE.LOADING;
            const shortUrl = await getShortLink();
            copyControl.innerHTML = SVG_SOURCE.SUCCESS;
            await GM_setClipboard(shortUrl);

            setTimeout(() => {
                copyControl.innerHTML = SVG_SOURCE.COPY;
            }, 1500);
        });
        viewer.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(copyControl);

        const spawnControl=document.createElement('button')
        spawnControl.className = 'peek-control'
        spawnControl.id = 'peek-spawn'
        spawnControl.title = 'Back to Spawn'
        spawnControl.innerHTML = SVG_SOURCE.SPAWN
        spawnControl.addEventListener('click', async () => {
            if(spawn &&(spawn.panoId||spawn.location)){
                spawn.panoId?viewer.setPano(spawn.panoId):viewer.setPosition(spawn.location);
                viewer.setPov({heading:spawn.heading||0,pitch:spawn.pitch||0});
                viewer.setZoom(spawn.zoom||1);
            }
        });
        viewer.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(spawnControl);

        const photoControl = document.createElement('button')
        photoControl.className = 'peek-control'
        photoControl.id = 'peek-photo'
        photoControl.title = 'Photo Mode (Hide UI)'
        photoControl.innerHTML = SVG_SOURCE.CAMERA
        photoControl.addEventListener('click', () => {
            togglePhotoMode(photoControl, viewer);
        });
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement && isPhotoMode) {
                togglePhotoMode(photoControl, viewer);
            }
        });
        viewer.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(photoControl);

        if(!panoSelector)panoSelector = document.createElement("select");
        panoSelector.id = "pano-select";
        panoSelector.addEventListener('change', function () {
            if (viewer) viewer.setPano(panoSelector.value);
        });
        viewer.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(panoSelector);
    }
    else {
        pano.panoId? viewer.setPano(pano.panoId):viewer.setPosition(pano.location)
        if(pano.heading&&pano.pitch)viewer.setPov({ heading: pano.heading||0, pitch: pano.pitch||0 })
        if(pano.zoom)viewer.setZoom(pano.zoom);

    }

    requestAnimationFrame(() => {
        spawn=pano;
        updatePanoSelector(pano, document.getElementById('pano-select'));
        clearMovementPath();
        splitContainer.classList.add('active');
    });
}

function showMapList() {
    if (document.getElementById('peek-map-list')) return;

    const element = document.createElement('div');
    element.id = 'peek-map-list';
    element.className = 'peek-modal';

    // Use array join for better string concatenation performance
    let recentMapsSection = '';
    if (PEEK_STATE.recentMaps.length > 0) {
        const recentMapsArr = [];
        for (const m of PEEK_STATE.recentMaps) {
            if (m.archivedAt) continue;
            recentMapsArr.push(`<div class="map">
                <a href="https://map-making.app/maps/${m.id}" class="map-link">
				    <span class="map-name">${m.name}</span>
                </a>
				<span class="map-buttons">
					<span class="map-add" data-id="${m.id}">ADD</span>
					<span class="map-added">ADDED</span>
				</span>
			</div>`);
        }

        recentMapsSection = `
			<h3>Recent Maps</h3>

			<div class="maps">
				${recentMapsArr.join('')}
			</div>

			<br>
		`;
    }

    const mapsArr = [];
    const tagButtonsArr = [];
    if (LOCATION) {
        for (const tag of LOCATION.tagFields) {
            tagButtonsArr.push(`<button class="tag-button" data-tag="${tag}">${tag}</button>`);
        }
    }
    if (previousTags.length > 0) {
        for (const tag of previousTags) {
            tagButtonsArr.push(`<button class="tag-button" data-tag="${tag}">${tag}</button>`);
        }
    }
    for (const m of MAP_LIST) {
        if (m.archivedAt) continue;
        mapsArr.push(`<div class="map">
            <a href="https://map-making.app/maps/${m.id}" class="map-link">
			    <span class="map-name">${m.name}</span>
            </a>
			<span class="map-buttons">
				<span class="map-add" data-id="${m.id}">ADD</span>
				<span class="map-added">ADDED</span>
			</span>
		</div>`);
    }

    element.innerHTML = `
	<div class="inner">
		<h3>Tags (comma separated)</h3>

		<input type="text" class="tag-input" id="peek-map-tags" />

        <div class="tag-buttons">
            ${tagButtonsArr.join('')}
        </div>

		<br><br>

		${recentMapsSection}

		<h3>All Maps</h3>

		<div class="maps">
			${mapsArr.join('')}
		</div>
	</div>

	<div class="dim"></div>
	`;

    document.body.appendChild(element);

    element.querySelector('.dim').addEventListener('click', closeMapList);

    const tagInput = document.getElementById('peek-map-tags');
    tagInput.addEventListener('keyup', e => e.stopPropagation());
    tagInput.addEventListener('keydown', e => e.stopPropagation());
    tagInput.addEventListener('keypress', e => e.stopPropagation());
    tagInput.focus();

    for (const map of element.querySelectorAll('.maps .map-add')) {
        map.addEventListener('click', addLocationToMap);
    }

    for (const btn of element.querySelectorAll('.tag-button')) {
        btn.addEventListener('click', function () {
            const tag = this.dataset.tag;
            const input = document.getElementById('peek-map-tags');

            let currentTags = input.value.split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);

            if (this.classList.contains('active')) {
                currentTags = currentTags.filter(t => t !== tag);
                this.classList.remove('active');
            } else {
                if (!currentTags.includes(tag)) {
                    currentTags.push(tag);
                }
                this.classList.add('active');
            }

            input.value = currentTags.join(', ');
        });
    }
}

function closeMapList() {
    const element = document.getElementById('peek-map-list');
    if (element) element.remove();
}

function addLocationToMap(e) {
    e.target.parentNode.classList.add('is-added');

    const id = parseInt(e.target.dataset.id);
    previousMapId = id;
    GM_setValue('previousMapId', JSON.stringify(id));


    PEEK_STATE.recentMaps = PEEK_STATE.recentMaps.filter(e => e.id !== id).slice(0, 2);
    for (const map of MAP_LIST) {
        if (map.id === id) {
            PEEK_STATE.recentMaps.unshift(map);
            break;
        }
    }

    saveState();
    const tagList = document.getElementById('peek-map-tags').value.split(',').map(t => t.trim()).filter(t => t.length > 0);
    // Use Set for efficient deduplication
    const tagFieldsSet = new Set(LOCATION.tagFields);
    const customTags = tagList.filter(tag => !tagFieldsSet.has(tag));
    const mergedSet = new Set([...customTags, ...previousTags]);
    const limited = [...mergedSet].slice(0, 5);
    GM_setValue('previousTags', JSON.stringify(limited));
    importLocations(id, [{
        id: -1,
        location: { lat: LOCATION.lat, lng: LOCATION.lng },
        panoId: LOCATION.panoId ?? null,
        heading: LOCATION.heading ?? 90,
        pitch: LOCATION.pitch ?? 0,
        zoom: LOCATION.zoom === 0 ? null : LOCATION.zoom,
        tags: tagList,
        flags: LOCATION.panoId ? 1 : 0
    }]);
}

function defaultState() {
    return {
        recentMaps: []
    }
}

function loadState() {
    const data = GM_getValue('peek_state', null);
    if (!data) return;

    const dataJson = JSON.parse(data);
    Object.assign(PEEK_STATE, defaultState(), dataJson);
    saveState();
}

function saveState() {
    GM_setValue('peek_state', JSON.stringify(PEEK_STATE));
}

async function mmaFetch(url, options = {}) {
    const response = await fetch(new URL(url, 'https://map-making.app'), {
        ...options,
        headers: {
            accept: 'application/json',
            authorization: `API ${MAP_MAKING_API_KEY.trim()}`,
            ...options.headers
        }
    });
    if (!response.ok) {
        let message = 'Unknown error';
        try {
            const res = await response.json();
            if (res.message) {
                message = res.message;
            }
        } catch {
            //empty
        }
        alert(`An error occurred while trying to connect to Map Making App. ${message}`);
        throw Object.assign(new Error(message), { response });
    }
    return response;
}

async function getMaps() {
    const response = await mmaFetch(`/api/maps`);
    const maps = await response.json();
    return maps;
}

function showLoader() {
    if (document.getElementById('peek-loader')) return;

    const element = document.createElement('div');
    element.id = 'peek-loader';
    element.className = 'peek-modal';
    element.innerHTML = `
		<div class="text">LOADING...</div>
		<div class="dim"></div>
	`;
    document.body.appendChild(element);
}

function hideLoader() {
    const element = document.getElementById('peek-loader');
    if (element) element.remove();
}

async function importLocations(mapId, locations) {
    const response = await mmaFetch(`/api/maps/${mapId}/locations`, {
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            edits: [{
                action: { type: 4 },
                create: locations,
                remove: []
            }]
        })
    });
    await response.json();
}

async function commitRoundResult({
    token,
    round,
    guessCoords = null,
    hasAnswerMarker = false
}) {
    if (!token || round == null) return;

    const commitKey = `${token}_${round}`;
    if (committedRounds.has(commitKey)) return;

    const pending = {};

    if (guessCoords) {
        try {
            pending.guess = await getNearestPano(guessCoords);
            pending.guess.location = guessCoords
        } catch (err) {
            console.error("[commitRoundResult] getNearestPano failed", err);
        }
    }

    if (hasAnswerMarker) {
        try {
            pending.answer = fetchAnswerPanoFromRoundData();
        } catch (err) {
            console.error("[commitRoundResult] fetchAnswer failed", err);
        }
    }

    if (!pending.guess && !pending.answer) return;

    const data = GM_getValue(token, { guess: {}, answer: {} });

    if (pending.guess) {
        data.guess[round] = pending.guess;
    }

    if (pending.answer) {
        data.answer[round] = pending.answer;
    }

    GM_setValue(token, data);

    if (pending.guess) {
        updateHistory(`${token}_guess`, "guess");
    }

    if (pending.answer) {
        updateHistory(`${token}_answer`, "answer");
    }

    committedRounds.add(commitKey);
}

function updateHistory(token, listKey) {
    let list = GM_getValue(listKey, []);
    list = list.filter(t => t !== token);
    list.unshift(token);
    while (list.length > STORAGE_CAP) {
        GM_deleteValue(list.pop());
    }
    GM_setValue(listKey, list);
}

function getGameToken(url) {
    const m = url.match(/[0-9a-zA-Z]{16}/);
    return m ? m[0] : null;
}

function getCurrentRound() {
    const el = document.querySelector(SELECTORS.roundNumber);
    if (!el) return null;
    const m = el.textContent.match(/\d+/);
    return m ? Number(m[0]) : null;
}

function formatDistance(num) {
    return num >= 1000 ? `${(num / 1000).toFixed(1)} km` : `${Math.floor(num)} m`;
}

function extractDate(entry) {
    for (const key in entry) {
        const value = entry[key];
        if (value instanceof Date) {
            return value;
        }
        if (typeof value === 'string' && !isNaN(Date.parse(value))) {
            return new Date(value);
        }
    }
    return null;
}

function convertPanoId(panoId) {
    if(!panoId) return null;
    try {
        const bytes = new Uint8Array(panoId.match(/.{1,2}/g).map(b => parseInt(b, 16)));
        return new TextDecoder("utf-8").decode(bytes);
    } catch (e) {
        console.error("Error:", e);
        return panoId;
    }
}

function getStreetViewThumbUrl(pano) {
    if (pano.panoId) {
        return `https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=${pano.panoId}&cb_client=maps_sv.tactile.gps&w=1024&h=768&yaw=${pano.heading || 0}&pitch=${pano.pitch || 0}&thumbfov=120`;
    } else if (pano.location) {
        return `https://maps.googleapis.com/maps/api/streetview?size=1024x768&location=${pano.location.lat},${pano.location.lng}&heading=${pano.heading || 0}&pitch=${pano.pitch || 0}&fov=120&key=AIzaSyDqRTXlnHXELLKn7645Q1L_5oc4CswKZK4`;
    }
    return null
}

function getRadius(coords1, coords2) {
    return unsafeWindow.google.maps.geometry.spherical.computeDistanceBetween(
        coords1,
        coords2,
    );
}

function inResults() {
    return location.pathname.includes("/results/");
}


function main() {
    startMarkerObserver();
    startMapObserver();
    loadState();
    window.addEventListener("urlchange", () => {
        startMarkerObserver();
        startMapObserver();
        loadState();
    });

    GM_addStyle(`
    .peek-tooltip {
        display: none;
        position: absolute;
        width: 300px;
        background: rgba(26, 26, 26, 0.95);
        color: white;
        border: 1px solid #ffd700;
        border-radius: 4px;
        padding: 8px;
        font-size: 12px;
        left: 50%;
        bottom: 45px;
        transform: translateX(-50%);
        z-index: 10000;
        pointer-events: none;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    }

    .peek-duel-tooltip {
        display: none;
        position: absolute;
        width: 280px;
        background: rgba(26, 26, 26, 0.95);
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px;
        font-size: 12px;
        left: 50%;
        bottom: 45px;
        transform: translateX(-50%);
        z-index: 10000;
        pointer-events: none;
        text-align: center;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.6);
    }

    .peek-duel-answer-tooltip {
        display: none;
        position: absolute;
        width: 280px;
        background: rgba(30, 30, 35, 0.96);
        color: white;
        border: none;
        border-radius: 6px;
        padding: 0;
        left: 50%;
        bottom: 45px;
        transform: translateX(-50%);
        z-index: 10000;
        pointer-events: none;
        text-align: center;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.65);
        overflow: hidden;
    }

    [data-pano="true"]:hover .peek-duel-tooltip,
    [data-pano="false"]:hover .peek-duel-tooltip {
        display: block;
    }

    [class*='result-map_roundPin']:hover .peek-duel-answer-tooltip {
        display: block;
    }

    .peek-answer-tooltip {
        display: none;
        position: absolute;
        width: 300px;
        background: rgba(30, 30, 35, 0.96);
        color: white;
        border: 1px solid #4ade80;
        border-radius: 6px;
        padding: 0;
        left: 50%;
        bottom: 45px;
        transform: translateX(-50%);
        z-index: 10000;
        pointer-events: none;
        text-align: center;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.65);
        overflow: hidden;
    }

    .peek-close-btn {
        position: absolute;
        top: 2px;
        right: 4px;
        background: rgba(0, 0, 0, 0.4);
        color: #ff6b6b;
        border: none;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        font-size: 12px;
        line-height: 16px;
        cursor: pointer;
        z-index: 10003;
    }

    .peek-close-btn:hover {
        background: rgba(255, 107, 107, 0.3);
    }

    .peek-split-container {
        position: absolute;
        top: 0;
        right: 0;
        width: 50%;
        height: 100%;
        background: #000;
        z-index: 10006;
        transform: translateX(100%);
        transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        overflow: hidden;
        box-shadow: -5px 0 20px rgba(0, 0, 0, 0.5);
    }

    .peek-split-container.active {
        transform: translateX(0);
    }

    .peek-split-resizer {
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        background: #7dcc4c;
        cursor: ew-resize;
        z-index: 10007;
    }

    .peek-split-pano {
        width: 100%;
        height: 100%;
    }

    .peek-control {
        background: none rgb(68, 68, 68);
        border: 0px;
        color: #b3b3b3;
        font-size: 32px;
        margin: 8px 10px;
        padding: 0px;
        text-transform: none;
        appearance: none;
        position: absolute;
        cursor: pointer;
        user-select: none;
        border-radius: 2px;
        height: 40px;
        width: 40px;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
        overflow: hidden;
        z-index: 10008;
    }

    .peek-control:hover {
        color: #e6e6e6;
    }

    .peek-map-control {
        background: rgb(0, 0, 0, 0.8);
        border: 0px;
        padding: 8px;
        text-transform: none;
        appearance: none;
        position: absolute;
        cursor: pointer;
        user-select: none;
        border-radius: 100%;
        height: 40px;
        width: 40px;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
        overflow: hidden;
        opacity: 0.8;
        z-index: 9999;
    }

    .peek-map-control:hover {
        opacity: 1.0;
    }

    #layer-toggle {
        bottom: 32px;
        left: 24px;
    }

    .peek-modal {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .peek-modal .dim {
        position: fixed;
        inset: 0;
        z-index: 0;
        background: rgba(0, 0, 0, 0.75);
    }

    .peek-modal .text {
        position: relative;
        z-index: 1;
    }

    .peek-modal .inner {
        box-sizing: border-box;
        position: relative;
        z-index: 1;
        background: #fff;
        padding: 20px;
        margin: 20px;
        width: calc(100% - 40px);
        max-width: 500px;
        overflow: auto;
        color: #000;
        flex: 0 1 auto;
    }

    #peek-loader {
        color: #fff;
        font-weight: bold;
    }

    .peek-credit {
        position: absolute;
        top: 1rem;
        z-index: 9;
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: flex-start;
    }

    #peek-main {
        position: absolute;
        width: 40px;
        height: 40px;
        top: 0.85rem;
        right: 4rem;
        z-index: 9;
        display: flex;
        border: none;
        border-radius: 50%;
        background: #00000099;
        background-repeat: no-repeat;
        background-position: 50%;
        flex-direction: column;
        gap: 5px;
        align-items: flex-start;
    }

    #peek-main:hover {
        cursor: pointer;
        opacity: 0.8;
    }

    #peek-main::after {
        display: none;
        content: attr(data-text);
        position: absolute;
        top: 120%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 1);
        color: #fff;
        padding: 5px;
        border-radius: 5px;
        font-weight: normal;
        font-size: 11px;
        line-height: 1;
        height: auto;
        white-space: nowrap;
        transition: opacity 0.5s ease;
    }

    #peek-main:hover::after {
        opacity: 1;
        display: block;
    }

    .peek-credit.extra-pad {
        top: 2.5rem;
    }

    .peek-credit-title {
        font-size: 15px;
        font-weight: bold;
        text-shadow: rgb(204, 48, 46) 2px 0px 0px, rgb(204, 48, 46) 1.75517px 0.958851px 0px, rgb(204, 48, 46) 1.0806px 1.68294px 0px, rgb(204, 48, 46) 0.141474px 1.99499px 0px, rgb(204, 48, 46) -0.832294px 1.81859px 0px, rgb(204, 48, 46) -1.60229px 1.19694px 0px, rgb(204, 48, 46) -1.97998px 0.28224px 0px, rgb(204, 48, 46) -1.87291px -0.701566px 0px, rgb(204, 48, 46) -1.30729px -1.5136px 0px, rgb(204, 48, 46) -0.421592px -1.95506px 0px, rgb(204, 48, 46) 0.567324px -1.91785px 0px, rgb(204, 48, 46) 1.41734px -1.41108px 0px, rgb(204, 48, 46) 1.92034px -0.558831px 0px;
        position: relative;
        z-index: 1;
    }

    .peek-credit-subtitle {
        font-size: 12px;
        background: rgba(204, 48, 46, 0.4);
        padding: 3px 5px;
        border-radius: 5px;
        position: relative;
        z-index: 0;
        top: -8px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    .peek-credit-subtitle a:hover {
        text-decoration: underline;
    }

    .peek-settings-option {
        background: var(--ds-color-purple-100);
        padding: 6px 10px;
        border-radius: 5px;
        font-size: 12px;
        cursor: pointer;
        opacity: 0.75;
        transition: opacity 0.2s;
        pointer-events: auto;
    }

    .peek-settings-option:hover {
        opacity: 1;
    }

    #peek-map-list h3 {
        margin-bottom: 10px;
    }

    #peek-map-list .tag-input {
        display: block;
        width: 100%;
        font: inherit;
        border: 1px solid #ccc;
    }

    #peek-map-list .maps {
        max-height: 200px;
        overflow-x: hidden;
        overflow-y: auto;
        font-size: 15px;
    }

    #peek-map-list .map {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        padding: 8px;
        transition: background 0.2s;
    }

    #peek-map-list .map:nth-child(2n) {
        background: #f0f0f0;
    }

    #peek-map-list .map-buttons:not(.is-added) .map-added {
        display: none !important;
    }

    #peek-map-list .map-buttons.is-added .map-add {
        display: none !important;
    }

    #peek-map-list .map-add {
        background: green;
        color: #fff;
        padding: 3px 6px;
        border-radius: 5px;
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
    }

    #peek-map-list .map-added {
        background: #000;
        color: #fff;
        padding: 3px 6px;
        border-radius: 5px;
        font-size: 13px;
        font-weight: bold;
    }

    #pano-select {
        width: 200px;
        height: 40px;
        padding: 5px;
        font-size: 14px;
        color: #FFFFFF;
        position: absolute;
        bottom: 4px !important;
        border-radius: 5px;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
        border: none;
        cursor: pointer;
        text-align: left;
        z-index: 10007;
        background-color: rgb(34, 34, 34, 0.9);
    }

    .map-name {
        color: #007b8b;
        text-decoration: underline;
    }

    .tag-buttons {
        margin-top: 10px;
    }

    .tag-button {
        margin: 5px 5px 0 0;
        padding: 4px 10px;
        border: 1px solid #ccc;
        background: #f0f0f0;
        border-radius: 4px;
        cursor: pointer;
        transition: 0.2s;
        font-size: 16px;
        font-weight: bold;
    }

    .tag-button:hover {
        background: #e0e0e0;
    }

    .tag-button.active {
        background-color: green;
        color: white;
        border-color: green;
    }

    [data-pano="true"]:hover .peek-tooltip,
    [data-pano="false"]:hover .peek-tooltip {
        display: block;
    }

    [data-qa='correct-location-marker']:hover .peek-answer-tooltip {
        display: block;
    }

    [data-pano="true"]> :first-child {
        cursor: pointer;
        --border-size-factor: 1.5 !important;
    }

    [data-pano="true"]:not([class^='result-map_map'])> :first-child {
    --border-color: #E91E63 !important;
    }

    [data-pano="false"]:not([class^='result-map_map'])> :first-child {
        cursor: initial;
        --border-color: #323232 !important;
        --border-size-factor: 1.5 !important;
    }

    [data-qa='guess-marker'] {
        cursor: pointer !important;
        z-index: 1000 !important;
        transition: transform 0.2s;
    }

    .peek-header {
        background: #111;
        padding: 6px;
        font-size: 11px;
        color: #888;
        text-align: center;
        border-bottom: 1px solid #333;
    }

    .peek-dist {
        color: #ffd700;
        font-weight: bold;
        font-size: 13px;
    }

    .peek-note {
        font-size: 10px;
        color: #ffd700;
        margin-top: 4px;
    }

    .peek-body {
        height: 150px;
        background: #000;
        overflow: hidden;
        cursor: default;
    }

    .peek-thumb {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .peek-error {
        padding: 15px;
        color: #ff4d4d;
        font-size: 12px;
        text-align: center;
    }

    .peek-duel-rounds-button {
        position: absolute;
        top: 15px;
        left: 15px;
        z-index: 10005;
        width: 44px;
        height: 44px;
        background: rgba(34, 34, 34, 0.9);
        border: none;
        border-radius: 6px;
        cursor: pointer;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 6px;
        transition: all 0.2s;
        opacity:0.7;
    }

    .peek-duel-rounds-button:hover {
        background: rgba(50, 50, 50, 0.95);
        transform: scale(1.05);
    }

    .peek-duel-rounds-button.active {
        background: rgba(66, 133, 244, 0.9);
    }

    .peek-duel-rounds-panel {
        position: absolute;
        top: 0;
        left: -400px;
        width: 400px;
        height: 100%;
        background: rgba(28, 28, 30, 0.98);
        backdrop-filter: blur(10px);
        z-index: 10004;
        transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        opacity:0.9;
    }

    .peek-duel-rounds-panel.active {
        left: 0;
    }

    .peek-duel-rounds-content {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 15px;
        padding-top: 50px;
    }

    .peek-duel-game-header {
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .peek-duel-game-info {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
    }

    .peek-duel-game-info * {
        position: static !important;
        transform: none !important;
        left: auto !important;
        top: auto !important;
        right: auto !important;
        bottom: auto !important;
    }

    .peek-duel-game-info [class*="game-mode-brand_selected"] {
        margin: 0;
    }

    .peek-duel-game-info [class*="game-mode-brand_mapName"] {
        font-size: 14px;
        opacity: 0.8;
        margin: 0;
    }

    .peek-duel-rounds-list {
        transform: scale(0.85);
        transform-origin: top left;
        width: 117.65%;
        margin-bottom: -70%;
    }

    .peek-duel-rounds-content [class*="game-summary_playedRound"] {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 6px;
        margin-bottom: 8px;
        transition: background 0.2s;
        cursor: pointer;
        font-size: 0.75em;
    }

    .peek-duel-rounds-content [class*="game-summary_playedRound"]:hover {
        background: rgba(255, 255, 255, 0.08);
    }

    .peek-duel-rounds-content [class*="game-summary_selectedRound"] {
        background: rgba(66, 133, 244, 0.3) !important;
        border-left: 3px solid rgba(66, 133, 244, 0.9);
    }

    .peek-duel-rounds-close {
        position: absolute;
        top: 15px;
        right: 20px;
        width: 28px;
        height: 28px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        border-radius: 50%;
        color: #ffffff;
        font-size: 20px;
        line-height: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        z-index: 10;
    }

    .peek-duel-rounds-close:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: rotate(90deg);
    }

    .peek-round-indicator {
        position: absolute;
        top: 15px;
        right: 50%;
        z-index: 10003;
        background: linear-gradient(135deg, rgba(121, 80, 229, 0.95) 0%, rgba(74, 35, 153, 0.95) 100%);
        backdrop-filter: blur(10px);
        color: rgb(255, 255, 255);
        padding: 0.5rem 1.25rem;
        border-radius: 6px;
        font-family: 'ggFont', sans-serif;
        font-size: 1rem;
        line-height: 1.25rem;
        font-weight: 700;
        font-style: italic;
        box-shadow: 0 0.375rem 0.625rem rgb(26 26 26/30%), 0 0.125rem 1.25rem 0 rgb(26 26 26/20%);
        border: 1px solid rgba(166, 133, 255, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        user-select: none;
    }

    .peek-round-indicator:hover {
        transform: translateY(-2px);
        box-shadow: 0 0.5rem 1rem rgb(26 26 26/40%), 0 0.25rem 1.5rem 0 rgb(26 26 26/30%);
    }

    @media (max-width: 768px) {
        .peek-duel-rounds-panel {
            width: 100%;
            left: -100%;
        }

        .peek-duel-rounds-panel.active {
            left: 0;
        }

        .peek-round-indicator {
            top: 10px;
            right: 10px;
            padding: 0.4rem 1rem;
            font-size: 0.875rem;
            line-height: 1rem;
        }
    }
    `)
}



main();