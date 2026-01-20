// ==UserScript==
// @name         Geoguessr Better Breakdown UI
// @namespace    https://greasyfork.org/users/1179204
// @version      1.0.4
// @description  built-in StreetView Window to view where you guessed and the correct location
// @author       KaKa, Alien Perfect
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain=geoguessr.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563091/Geoguessr%20Better%20Breakdown%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/563091/Geoguessr%20Better%20Breakdown%20UI.meta.js
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
    guessMap: "[class*='guess-map_canvas']",
    resultMap:"[class*='coordinate-result-map_map']"
};

/* =======================
   State Management
======================= */
let svs = null;
let guessMap = null;
let lastClickedCoords = null;
let mapObserver = null;
let markerObserver = null;
let realTimePreviewTooltip = null;
let gameLoopTimer = null;
let currentGameToken = null;
let coverageLayer = null;
let peekMarker = null;
let viewer = null;
let gameLoopRunning = false;
let isCoverageLayer = false;
let isSVFullScreen = false;
let clickListenerAttached = false;
let isRealTimeTooltip = GM_getValue("realTimeTooltip", false);
const committedRounds = new Set();

/* =======================
   Utility Functions
======================= */
function getReactFiber(el) {
    if (!el) return null;
    const key = Object.keys(el).find(k => k.startsWith("__reactFiber"));
    return key ? el[key] : null;
}

function getGuessMapInstance() {
    let el = document.querySelector(SELECTORS.guessMap) || document.querySelector(SELECTORS.resultMap);
    const fiber = getReactFiber(el);
    try {
        return fiber?.return?.return?.memoizedProps?.map ||
            fiber?.return?.memoizedState?.memoizedState?.current?.instance || fiber?.return?.updateQueue?.lastEffect?.deps?.[0];
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
    return{
        panoId: convertPanoId(data.panoId),
        heading: data.heading,
        location: {lat:data.lat, lng:data.lng},
        pitch: data.pitch,
        radius: 0,
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
        if (!document.querySelector(SELECTORS.roundEnd) &&
            !document.querySelector(SELECTORS.gameEnd)) {
            const pano = await getNearestPano(lastClickedCoords);
            const marker = document.querySelector(SELECTORS.markerList)
            if(marker)updateRealtimePreview(marker, pano);
        }
        else{
            if(!isCoverageLayer) return
            const pano = await getNearestPano(lastClickedCoords);
            if(!pano || pano.error) return
            if (!peekMarker) {
                peekMarker = new google.maps.Marker({
                    position: pano.location,
                    map,
                    icon: {
                        url: "https://www.geoguessr.com/_next/static/media/selected-pin-square.bcb5854f.webp",
                        scaledSize: new google.maps.Size(28, 28),
                        anchor: new google.maps.Point(14, 14)
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


function scheduleGameLoop(delay=200) {
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


function startMarkerObserver() {
    stopMarkerObserver();

    markerObserver = new MutationObserver(() => {
        scheduleGameLoop(150);
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


function starMapObserver() {
    stopMapObserver();

    const targetNode = document.body;

    mapObserver = new MutationObserver((mutations) => {
        if (!mutations.some(m => m.addedNodes.length > 0)) return;

        const mapEl = document.querySelector(SELECTORS.guessMap) || document.querySelector(SELECTORS.resultMap);
        if (!mapEl) return;

        guessMap = getGuessMapInstance(mapEl);
        if (guessMap && !clickListenerAttached) {
            attachClickListener(guessMap);
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
    if(!document.querySelector('#__next')) return
    const token = getGameToken(location.pathname);
    const round = getCurrentRound();
    const isRoundEnd = !!document.querySelector(SELECTORS.roundEnd);
    const isGameEnd = !!document.querySelector(SELECTORS.gameEnd);
    const isRoundMarker =document.querySelector(SELECTORS.roundMarker)

    if (!token || !round) return;

    if (token !== currentGameToken) {
        currentGameToken = token;
        committedRounds.clear();
        lastClickedCoords = null;
    }
    if(!isRoundEnd && !isGameEnd && isCoverageLayer){
        coverageLayer.setMap(null);
        isCoverageLayer=false;
        removePeekMarker();
    }
    await commitRoundResult({
        token,
        round,
        guessCoords: (isRoundEnd || isGameEnd) ? lastClickedCoords : null,
        hasAnswerMarker: !!isRoundMarker
    });
    updateMarkersUI(token, round, isGameEnd);
}

function removePeekMarker(){
    if(peekMarker) {
        peekMarker.setMap(null);
        peekMarker =null;}
}

function updateMarkersUI(token, currentRound, isFinal) {
    const data = GM_getValue(token);
    if (!data) return;
    const markers = document.querySelectorAll(SELECTORS.markerList);
    const answerMarkers = document.querySelectorAll(SELECTORS.roundMarker);
    if (markers.length === 0) return;
    if (isFinal) {
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
            isRealTimeTooltip=false
            saveRealTimeTooltipState(false);
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
    if (marker.dataset?.peekBound === bindKey) return;
    marker.dataset.peekBound = bindKey;

    marker.style.cursor = "pointer";
    marker.style.pointerEvents = "auto";
    marker.dataset.pano = pano.error ? "false" : "true";

    marker.querySelectorAll(".peek-tooltip").forEach(t => t.remove());

    const tooltip = document.createElement("div");
    tooltip.className = "peek-tooltip";
    if (pano.error) {
        tooltip.innerHTML = `<div class="peek-error">No Street View found within 250km</div>`;
    } else {
        tooltip.innerHTML = `
            <div class="peek-header">
                <span class="peek-dist">${formatDistance(pano.radius)}</span> away
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

        marker.removeEventListener("click", marker._peekHandler);
        marker._peekHandler = clickHandler;
        marker.addEventListener("click", clickHandler);
    }

    marker.appendChild(tooltip);
}

async function applyPanoToAnswerMarker(marker, pano, roundId) {
    const bindKey = `answer_${roundId}`;
    if (marker.dataset?.peekBound === bindKey) return;
    marker.dataset.peekBound = bindKey;

    marker.style.cursor = "pointer";
    marker.style.pointerEvents = "auto";
    marker.querySelectorAll(".peek-answer-tooltip").forEach(t => t.remove());

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

    marker.removeEventListener("click", marker._peekHandler);
    marker._peekHandler = clickHandler;
    marker.addEventListener("click", clickHandler);
}

function openNativeStreetView(pano) {
    if (!pano || pano.error) return;
    if (!guessMap)guessMap=getGuessMapInstance();
    if (!guessMap) {
        console.error("[Guess Peek] Could not find Google Maps instance");
        return;
    }
    if(!isCoverageLayer){
        coverageLayer = new google.maps.StreetViewCoverageLayer();
        coverageLayer.setMap(guessMap);
        isCoverageLayer=true
    }
    const shareDiv=document.querySelector("[class*='standard-final-result_challengeFriendButton']")
    if(shareDiv) shareDiv.style.display='none'
    const xpDiv=document.querySelector("[class*='level-up-xp-button']")
    if(xpDiv) xpDiv.style.opacity='0'
    const mapContainer = document.querySelector(SELECTORS.resultMap);
    let splitContainer = mapContainer.querySelector('.peek-split-container');
    if (!splitContainer) {
        splitContainer = document.createElement('div');
        splitContainer.className = 'peek-split-container';
        splitContainer.innerHTML = `
            <div class="peek-split-resizer"></div>
            <button class="peek-split-close">×</button>
            <div class="peek-split-pano"></div>
        `;
        mapContainer.appendChild(splitContainer);

        splitContainer.querySelector('.peek-split-close').onclick = (e) => {
            e.stopPropagation();
            coverageLayer.setMap(null);
            isCoverageLayer = false;
            if(shareDiv) shareDiv.style.display='block';
            if(xpDiv) xpDiv.style.opacity='1.0';
            splitContainer.classList.remove('active');
            removePeekMarker();
        };

        const panoDiv = splitContainer.querySelector('.peek-split-pano');

        viewer=new google.maps.StreetViewPanorama(panoDiv, {
            pano: pano.panoId,
            pov: {
                heading: pano.heading || 0,
                pitch: pano.pitch || 0
            },
            zoom: 1,
            addressControl: true,
            showRoadLabels: false,
            enableCloseButton: false,
            zoomControl:true,
            clickToGo: true
        })
    }
    else {
        viewer.setPano(pano.panoId)
        viewer.setPov({ heading: pano.heading, pitch: pano.pitch})
        viewer.setZoom(1)
    }
    requestAnimationFrame(() => {
        splitContainer.classList.add('active');
        offsetMapFocus(guessMap, pano.location);
    });
}

/* =======================
   Storage & Helpers
======================= */

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
    startMarkerObserver();
    starMapObserver();

    window.addEventListener("urlchange", () => {
        startMarkerObserver();
        starMapObserver();
    });
    let onKeyDown = async (e) => {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
            return;
        }
        e.stopPropagation();
        if (e.key.toLowerCase() === 'p') {
            isRealTimeTooltip = !isRealTimeTooltip;
            if (realTimePreviewTooltip) {
                realTimePreviewTooltip.style.display = isRealTimeTooltip ? 'block' : 'none';
            }
            saveRealTimeTooltipState(isRealTimeTooltip);
        }
    }
    document.addEventListener("keydown", onKeyDown, true);
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
            z-index: 9999;
            pointer-events: none;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
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
            box-shadow: 0 4px 18px rgba(0,0,0,0.65);
            overflow: hidden;
            }

        .peek-realtime-tooltip {
            position: absolute;
            width: 300px;
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
            box-shadow: -5px 0 20px rgba(0,0,0,0.5);
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

        .peek-split-close {
            background: none rgb(68, 68, 68);
            border: 0px; margin: 10px;
            color:#b3b3b3;
            font-size:32px;
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
            top: 60px;
            right: 0px;
            z-index: 10008;
        }

        .peek-split-close:hover {
            color: #e6e6e6;
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
        .peek-note { font-size:10px; color:#ffd700; margin-top:4px; }
        .peek-body { height: 150px; background: #000; overflow: hidden; }
        .peek-thumb { width: 100%; height: 100%; object-fit: cover; }
        .peek-error { padding: 15px; color: #ff4d4d; font-size: 12px; text-align: center; }
    `);
}

main();