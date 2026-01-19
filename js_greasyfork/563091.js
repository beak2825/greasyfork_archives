// ==UserScript==
// @name         Guess Peek (Geoguessr)-Fixed
// @namespace    https://greasyfork.org/users/1179204
// @version      0.1.6
// @description  Click on your pin to see where you've guessed! (originally made by Alien Perfect)
// @author       Alien Perfect, KaKa
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain=geoguessr.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563091/Guess%20Peek%20%28Geoguessr%29-Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/563091/Guess%20Peek%20%28Geoguessr%29-Fixed.meta.js
// ==/UserScript==

"use strict";

/* =======================
   Config & Constants
======================= */
const SEARCH_RADIUS = 250000;
const STORAGE_CAP = 50;

const SELECTORS = {
    markerList: "[class*='map-pin_']:not([data-qa='correct-location-marker'])",
    roundMarker:"[data-qa='correct-location-marker']",
    roundEnd: "[data-qa='close-round-result']",
    gameEnd: "[data-qa='play-again-button']",
    roundNumber: "[data-qa='round-number']",
    guessMap: ".guess-map_canvas__cvpqv",
};

/* =======================
   State Management
======================= */
let svs = null;
let lastClickedCoords = null;
let mapObserver = null;
let markerObserver = null;
let clickListenerAttached = false;
let realTimePreviewTooltip = false;
let isRealTimeTooltip = GM_getValue("realTimeTooltip", false);
let processedRounds = new Set(); // Round numbers already fetched in this game
let currentGameToken = null;

/* =======================
   Utility Functions
======================= */
function getReactFiber(el) {
    if (!el) return null;
    const key = Object.keys(el).find(k => k.startsWith("__reactFiber"));
    return key ? el[key] : null;
}

function getGuessMapInstance() {
    let el = document.querySelector(SELECTORS.guessMap);
    const fiber = getReactFiber(el);
    try {
        return fiber?.return?.return?.memoizedProps?.map ||
            fiber?.return?.memoizedState?.memoizedState?.current?.instance || null;
    } catch { return null; }
}

function getRoundData(){
    let el = document.querySelector(SELECTORS.roundMarker);
    const fiber = getReactFiber(el);
    try {
        return fiber?.return?.return?.return?.return?.return?.memoizedProps?.rounds[0] || null;
    } catch { return null; }
}

function initSVS() {
    if (!svs && unsafeWindow.google?.maps?.StreetViewService) {
        svs = new unsafeWindow.google.maps.StreetViewService();
    }
}

async function getNearestPano(coords) {
    const nearestPano = {error: true};
    let radius = SEARCH_RADIUS;
    let oldRadius;
    if (!svs) initSVS();

    for (;;) {
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
            nearestPano.location = coords
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
    return{
        panoId: convertPanoId(data.panoId),
        heading: data.heading,
        pitch: data.pitch,
        radius: 0,
        error: false
    }
}

function attachClickListener(map) {
    map.addListener("click", async (e) => {
        if (!document.querySelector(SELECTORS.roundEnd) ||
            !document.querySelector(SELECTORS.gameEnd)) {

            lastClickedCoords = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            };

        }
        const pano = await getNearestPano(lastClickedCoords);
        const marker = document.querySelector(SELECTORS.markerList);
        if (marker&&!document.querySelector(SELECTORS.roundEnd) &&
            !document.querySelector(SELECTORS.gameEnd)) {
            updateRealtimePreview(marker, pano);
        }
    });
}

function startObserver() {
    stopObserver();
    markerObserver = new MutationObserver(async () => {
        await gameLoop()
    });

    markerObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

function stopObserver() {
    if (markerObserver) markerObserver.disconnect();
}

function observeMapContainer() {
    stopMapObserver();

    const targetNode = document.body;

    mapObserver = new MutationObserver((mutations) => {
        if (!mutations.some(m => m.addedNodes.length > 0)) return;

        const mapEl = document.querySelector(SELECTORS.guessMap);
        if (!mapEl) return;

        const mapInstance = getGuessMapInstance(mapEl);
        if (mapInstance && !clickListenerAttached) {
            attachClickListener(mapInstance);
            clickListenerAttached = true;
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

async function gameLoop() {
    const token = getGameToken(location.pathname);
    const round = getCurrentRound();
    const isRoundEnd = !!document.querySelector(SELECTORS.roundEnd);
    const isGameEnd = !!document.querySelector(SELECTORS.gameEnd);
    const isRoundMarker =document.querySelector(SELECTORS.roundMarker)

    if (!token || !round) return;

    if (token !== currentGameToken) {
        currentGameToken = token;
        processedRounds.clear();
        lastClickedCoords = null;
    }

    if ((isRoundEnd || isGameEnd)) {
        if (lastClickedCoords) {
            const pano = await getNearestPano(lastClickedCoords);
            saveGuess(token, round, pano);
        }
        if(isRoundMarker){
            const answer= fetchAnswerPanoFromRoundData()
            saveAnswer(token,round,answer)
        }
    }
    updateMarkersUI(token, round, isGameEnd);
}

function updateMarkersUI(token, currentRound, isFinalResults) {
    const data = GM_getValue(token);
    if (!data) return;

    const markers = document.querySelectorAll(SELECTORS.markerList);
    const answerMarkers = document.querySelectorAll(SELECTORS.roundMarker);
    if (markers.length === 0) return;
    if (isFinalResults) {
        markers.forEach((marker, index) => {
            const rNum = index + 1;
            if (data.guess?.[rNum]) {
                applyPanoToGuessMarker(marker, data.guess[rNum], rNum);
            }
        });
        if(answerMarkers && data.answer){
            answerMarkers.forEach((marker, index) => {
                const rNum = index + 1;
                if (data.answer?.[rNum]) {
                    applyPanoToAnswerMarker(marker, data.answer[rNum], rNum);
                }
            });
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
    const TOOLTIP_HEIGHT = 180;
    const BUFFER = 10;

    const spaceAbove = markerRect.top - mapRect.top;
    const spaceBelow = mapRect.bottom - markerRect.bottom;

    if (markerRect.top >= mapRect.height/2) {

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

function updateRealtimePreview(marker, pano) {
    if(!realTimePreviewTooltip){
        realTimePreviewTooltip = document.createElement("div");
        realTimePreviewTooltip.className = "peek-realtime-tooltip";
        if(isRealTimeTooltip){
            realTimePreviewTooltip.style.display='block'
        }
        else{
            realTimePreviewTooltip.style.display='none'
        }
        realTimePreviewTooltip.innerHTML = `
            <button class="peek-close-btn">×</button>
            <div class="peek-body">
                <img class="peek-thumb" alt="Street View Preview" loading="lazy">
            </div>
            <div class="peek-error" style="display:none;">No Street View found within 250km</div>
        `;
        realTimePreviewTooltip.querySelector(".peek-close-btn")?.addEventListener("click", (e) => {
            e.stopPropagation();
            realTimePreviewTooltip.style.display = "none"
        });

        marker.style.cursor = "pointer";
        marker.style.pointerEvents = "auto";
    }

    const imgEl = realTimePreviewTooltip.querySelector(".peek-thumb");
    const peakBody = realTimePreviewTooltip.querySelector(".peek-body");
    const peakError = realTimePreviewTooltip.querySelector(".peek-error");
    if (pano.error) {
        peakError.style.display='block'
        peakBody.style.display = "none";
    }
    else{
        peakError.style.display='none'
        peakBody.style.display='block'
        imgEl.src = getStreetViewThumbUrl(pano);
    }

    positionTooltip(marker,realTimePreviewTooltip)
    if(!marker.querySelector('.peek-realtime-tooltip'))marker.appendChild(realTimePreviewTooltip)

}

function applyPanoToGuessMarker(marker, pano, roundId) {
    const bindKey = `bound_${roundId}`;
    if (marker.dataset.peekBound === bindKey) return;
    marker.dataset.peekBound = bindKey;

    marker.style.cursor = "pointer";
    marker.style.pointerEvents = "auto";
    marker.dataset.pano = pano.error ? "false" : "true";

    marker.querySelectorAll(".peek-tooltip").forEach(t => t.remove());

    const tooltip = document.createElement("div");
    tooltip.className = "peek-tooltip";
    if (pano.error) {
        tooltip.innerHTML = `<div class="peek-error">No Street View within 250km</div>`;
    } else {
        tooltip.innerHTML = `
            <div class="peek-header">
                <span class="peek-dist">${formatDistance(pano.radius)}</span> away
            </div>
            <div class="peek-body">
                <img src="${getStreetViewThumbUrl(pano)}" class="peek-thumb" alt="Preview">
            </div>
        `;

        const clickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            GM_openInTab(getStreetViewUrl(pano.panoId), { active: true });
        };

        marker.removeEventListener("click", marker._peekHandler);
        marker._peekHandler = clickHandler;
        marker.addEventListener("click", clickHandler);
    }

    marker.appendChild(tooltip);
}

async function applyPanoToAnswerMarker(marker, pano, roundId) {
    const bindKey = `answer_${roundId}`;
    if (marker.dataset.peekBound === bindKey) return;
    marker.dataset.peekBound = bindKey;

    marker.style.cursor = "pointer";
    marker.style.pointerEvents = "auto";
    marker.querySelectorAll(".peek-answer-tooltip").forEach(t => t.remove());

    const tooltip = document.createElement("div");
    tooltip.className = "peek-answer-tooltip";
    tooltip.innerHTML = `
            <div class="peek-body">
                <img src="${getStreetViewThumbUrl(pano)}" class="peek-thumb">
            </div>
        `;
    marker.appendChild(tooltip);
}

/* =======================
   Storage & Helpers
======================= */

function saveGuess(token, round, pano) {
    let data = GM_getValue(token, { guess: {}, answer: {} });
    data.guess[round] = pano;
    GM_setValue(token, data);
    updateHistory(token, "history");
}

function saveAnswer(token, round, pano) {
    let data = GM_getValue(token, { guess: {}, answer: {} });
    data.answer[round] = pano;
    GM_setValue(token, data);
    updateHistory(token, "answer");
}

function saveRealTimeTooltipState(state){
    GM_setValue("realTimeTooltip", state);
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

function getStreetViewUrl(panoId) {
    return `https://www.google.com/maps/@?api=1&map_action=pano&pano=${panoId}`;
}

function convertPanoId(panoId) {
    try {
        const bytes = new Uint8Array(panoId.match(/.{1,2}/g).map(b => parseInt(b, 16)));
        return new TextDecoder("utf-8").decode(bytes);
    } catch (e) {
        console.error("Error:", e);
        return panoId;
    }
}

function getStreetViewThumbUrl(pano){
    return `https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=${pano.panoId}&cb_client=maps_sv.tactile.gps&w=1024&h=768&yaw=${pano.heading}&pitch=${pano.pitch}&thumbfov=120`
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
    observeMapContainer();
    startObserver();

    window.addEventListener("urlchange", () => {
        stopMapObserver();
        startObserver();
        observeMapContainer();
    });
    let onKeyDown = async (e) => {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
            return;
        }
        if ((e.key === 'p' || e.key === 'P')){
            if(!isRealTimeTooltip){
                realTimePreviewTooltip.style.display='block'
                isRealTimeTooltip=true
            }
            else{
                realTimePreviewTooltip.style.display='none'
                isRealTimeTooltip=false
            }
            saveRealTimeTooltipState(isRealTimeTooltip)
        }
    }
    document.addEventListener("keydown", onKeyDown, true);
    GM_addStyle(`
        .peek-tooltip {
            display: none;
            position: absolute;
            width: 200px;
            background: rgba(26, 26, 26, 0.95);
            color: white;
            border: 1px solid #ffd700;
            border-radius: 4px;
            padding: 8px;
            font-size: 12px;
            left: 50%;
            bottom: 45px;
            transform: translateX(-50%);
            z-index: 9999;
            pointer-events: none;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            }

        .peek-answer-tooltip {
            display: none;
            position: absolute;
            width: 200px;
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
            box-shadow: 0 4px 18px rgba(0,0,0,0.65);
            overflow: hidden;
            }

        .peek-realtime-tooltip {
            position: absolute;
            width: 200px;
            background: rgba(30, 30, 35, 0.96);
            color: white;
            border: 1px solid #4ade80;
            border-radius: 6px;
            padding: 0;
            z-index: 10002;
            pointer-events: auto;
            box-shadow: 0 4px 18px rgba(0,0,0,0.65);
            overflow: hidden;
            }

        .peek-close-btn {
            position: absolute;
            top: 2px;
            right: 4px;
            background: rgba(0,0,0,0.4);
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
            background: rgba(255,107,107,0.3);
            }

        [data-pano="true"]:hover .peek-tooltip,
        [data-pano="false"]:hover .peek-tooltip {display: block;}
        [data-qa='correct-location-marker']:hover .peek-answer-tooltip {display: block;}
        [data-pano="true"] > :first-child {
            cursor: pointer;
            --border-color: #E91E63 !important;
            --border-size-factor: 1.8 !important;}
        [data-pano="false"] > :first-child {
            cursor: initial;
            --border-color: #323232 !important;
            --border-size-factor: 1.5 !important;}
        [data-qa='guess-marker'] { cursor: pointer !important; z-index: 1000 !important; transition: transform 0.2s; }

        .peek-header { background: #111; padding: 6px; font-size: 11px; color: #888; text-align: center; border-bottom: 1px solid #333; }
        .peek-dist { color: #ffd700; font-weight: bold; font-size: 13px; }
        .peek-body { height: 100px; background: #000; overflow: hidden; }
        .peek-thumb { width: 100%; height: 100%; object-fit: cover; }
        .peek-error { padding: 15px; color: #ff4d4d; font-size: 12px; text-align: center; }
    `);
}

main();