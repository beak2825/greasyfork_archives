// ==UserScript==
// @name         GeoGuessr Better Breakdown UI
// @namespace    https://greasyfork.org/users/1179204
// @version      1.0.6
// @description  built-in StreetView Window to view where you guessed and the correct location
// @author       KaKa, Alien Perfect
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain=geoguessr.com
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563091/GeoGuessr%20Better%20Breakdown%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/563091/GeoGuessr%20Better%20Breakdown%20UI.meta.js
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
let viewer = null;
let guessMap = null;
let peekMarker = null;
let mapObserver = null;
let gameLoopTimer = null;
let coverageLayer = null;
let markerObserver = null;
let currentGameToken = null;
let lastClickedCoords = null;
let realTimePreviewTooltip = null;
let isSVFullScreen = false;
let isCoverageLayer = false;
let gameLoopRunning = false;
let clickListenerAttached = false;
let MAP_MAKING_API_KEY=GM_getValue("MAP_MAKING_API_KEY", "PASTE_YOUR_KEY_HERE");

let isRealTimeTooltip = GM_getValue("realTimeTooltip", false);
let MAP_LIST;
let LOCATION;
let previousMapId=JSON.parse(GM_getValue('previousMapId', null));
let previousTags=JSON.parse(GM_getValue('previousTags', '[]'));
const committedRounds = new Set();
const MWSTMM_STATE = defaultState();
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const full_months=['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December']


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

function toggleCoverageLayer(action) {
    if (!guessMap) return;
    if(!coverageLayer) coverageLayer = new google.maps.StreetViewCoverageLayer();
    if (isCoverageLayer && action !="on") {
        coverageLayer.setMap(null);
        isCoverageLayer = false;
        return
    }
    if(!isCoverageLayer && action !="off"){
        coverageLayer.setMap(guessMap);
        isCoverageLayer = true;
        return
    }
}


async function gameLoop() {
    if(!document.querySelector('#__next')) return
    const token = getGameToken(location.pathname);
    const round = getCurrentRound();
    const isRoundEnd = !!document.querySelector(SELECTORS.roundEnd);
    const isGameEnd = !!document.querySelector(SELECTORS.gameEnd);
    const isRoundMarker =document.querySelector(SELECTORS.roundMarker)

    if (!token || !round) return;

    if(!isRoundEnd && !isGameEnd && isCoverageLayer){
        removePeekMarker();
        toggleCoverageLayer("off");
    }

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
            'LB': '2021-05', 'NG': '2021-06', 'ST': '2024-02', 'US': '2019-01', 'VN':'2021-01', 'ES':'2023-01'
        };
        if (dateStr >= '2022-01')return 'BadCam'
        if (dateStr >= gen3Dates[country]) {
            if(country!='US')return 'BadCam'
            if(country === 'US' && lat > 52)return 'BadCam'
        }

        if (gen2Countries.has(country) && dateStr <= '2011-11') {
            return dateStr >= '2010-09' ? 'Gen2/3' : 'Gen2';
        }

        return 'Gen3';
    }
}

function parseMeta(data) {
    const tags=[]

    const panoId=data[1][0][1][1];
    const lat = data[1][0][5][0][1][0][2];
    const lng = data[1][0][5][0][1][0][3];
    const year = data[1][0][6][7][0];
    const month = data[1][0][6][7][1];
    const worldsize = data[1][0][2][2][0];
    const history =data[1][0][5][0][8];
    const links= data[1][0][5][0][3][0]


    const date = new Date(year, month - 1);
    const formattedDate = date.toLocaleString('default', { month: 'short', year: 'numeric' });

    let heading, region, locality, road, country, altitude;
    try{
        heading=data[1][0][5][0][1][2][0];
    }catch(e){
        heading=0
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
        if(parts.length > 1){
            region = parts[parts.length-1].trim();
            locality=parts[0].trim()
        } else {
            region = address;
        }
    } catch (e) {
        try{
            const address=data[1][0][3][2][0][0]
            const parts = address.split(',')
            if(parts.length > 1){
                region = parts[parts.length-1].trim();
                locality=parts[0].trim()
            }
            else region = address;
        }
        catch(e){
            region=null;
        }
    }
    try {
        road = data[1][0][5][0][12][0][0][0][2][0];
    } catch (e) {
        road = null;
    }
    try{
        altitude=data[1][0][5][0][1][1][0]
    }
    catch(e){
        altitude=null;
    }
    const generation = String(data[1][0][4]).includes('Google')?getGeneration(worldsize, country, lat, date):'ari';
    let camera;
    if (generation=='Gen4'){
        if(['IN','PR'].includes(country))camera='smallcam'
        else if (['NA', 'PA' , 'OM', 'QA', 'EC'].includes(country))camera='gen4trekker'
    }
    let isNewRoad= !history ? 'newroad' : false
    const tagFields = [formattedDate, `${year}-${month}`, `${String(year).slice(2,4)}-${month}`, year, months[month-1], full_months[month-1],
                       country, region, locality, road,
                       generation, camera, altitude?altitude.toFixed(2)+'m':null, isNewRoad].filter(Boolean);
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
        heading:Math.round(heading),
        pitch:0,
        zoom:0,
        tags,
        tagFields
    }
}
async function UE(t, e, s, d,r) {
    try {
        const url = `https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/${t}`;
        let payload = createPayload(t, e,s,d,r);

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

function createPayload(mode,coorData,s,d,r) {
    var payload;
    let type=2
    if (mode === 'GetMetadata') {
        const length=coorData.length
        if(String(coorData).substring(0,4)=='CIHM' || length!=22) type=10
        payload = [["apiv3"],["en","US"],[[[type,coorData]]],[[1,2,3,4,8,6]]];
    }
    else if (mode === 'SingleImageSearch') {
        payload=[["apiv3"],
                 [[null,null,parseFloat(coorData.lat),parseFloat(coorData.lng)],r],
                 [[null,null,null,null,null,null,null,null,null,null,[s,d]],null,null,null,null,null,null,null,[2],null,[[[type,true,2]]]],[[1,2,3,4,8,6]]]
    }
    else {
        throw new Error("Invalid mode!");
    }
    return JSON.stringify(payload);
}

async function getLOCATION(){
    const metaData = await UE('GetMetadata', viewer.getPano());
    if(metaData) {
        LOCATION = parseMeta(metaData)
        LOCATION.heading=viewer.getPov().heading;
        LOCATION.pitch = viewer.getPov().pitch;
        LOCATION.zoom = viewer.getZoom();
    }
}

async function updatePanoSelector(panoId, selector) {
    if (!svs) initSVS();
    const panoData = await new Promise((resolve, reject) => {
        svs.getPanorama({ pano: panoId }, (data, status) => {
            if (status === google.maps.StreetViewStatus.OK) {
                resolve(data);
            } else {
                reject(status);
            }
        });
    });
    if(!panoData || !panoData.time || !panoData.imageDate)return
    const optionsNeeded = 1 + (panoData.time ? panoData.time.length : 0);
    const existingOptions = selector.options.length;

    while (selector.options.length < optionsNeeded) {
        selector.add(new Option());
    }

    if (panoData.imageDate && panoData.location?.pano) {
        const [year, month] = panoData.imageDate.split('-');
        selector.options[0].value = panoData.location.pano;
        selector.options[0].text = `${full_months[parseInt(month, 10) - 1]} ${year} (Default)`;
        selector.options[0].hidden = false;
    }

    if (Array.isArray(panoData.time)) {
        let idx = 1;
        for (const entry of panoData.time) {
            const date = extractDate(entry);
            if (!date) continue;
            const year = date.getUTCFullYear();
            const month = date.getUTCMonth() + 1;
            selector.options[idx].value = entry.pano;
            selector.options[idx].text = `${full_months[month - 1]} ${year}`;
            selector.options[idx].hidden = false;
            idx++;
        }

        for (; idx < selector.options.length; idx++) {
            selector.options[idx].hidden = true;
        }
    }
}


function openNativeStreetView(pano) {
    if (!pano || pano.error) return;
    if (!guessMap)guessMap=getGuessMapInstance();
    if (!guessMap) {
        console.error("[Guess Peek] Could not find Google Maps instance");
        return;
    }
    toggleCoverageLayer("on")
    const shareDiv=document.querySelector("[class*='standard-final-result_challengeFriendButton']")
    if(shareDiv) shareDiv.style.display='none'
    const xpDiv=document.querySelector("[class*='level-up-xp-button']")
    if(xpDiv) xpDiv.style.opacity='0'
    const mapContainer = document.querySelector(SELECTORS.resultMap);
    let coverageLayerControl= document.querySelector('#layer-toggle');
    if(!coverageLayerControl){
        coverageLayerControl = document.createElement('button');
        coverageLayerControl.className = 'peek-map-control';
        coverageLayerControl.id = 'layer-toggle'
        coverageLayerControl.innerHTML = `
            <img alt="Coverage Layer Toggle" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2023%2038%22%3E%3Cpath%20d%3D%22M16.6%2038.1h-5.5l-.2-2.9-.2%202.9h-5.5L5%2025.3l-.8%202a1.53%201.53%200%2001-1.9.9l-1.2-.4a1.58%201.58%200%2001-1-1.9v-.1c.3-.9%203.1-11.2%203.1-11.2a2.66%202.66%200%20012.3-2l.6-.5a6.93%206.93%200%20014.7-12%206.8%206.8%200%20014.9%202%207%207%200%20012%204.9%206.65%206.65%200%2001-2.2%205l.7.5a2.78%202.78%200%20012.4%202s2.9%2011.2%202.9%2011.3a1.53%201.53%200%2001-.9%201.9l-1.3.4a1.63%201.63%200%2001-1.9-.9l-.7-1.8-.1%2012.7zm-3.6-2h1.7L14.9%2020.3l1.9-.3%202.4%206.3.3-.1c-.2-.8-.8-3.2-2.8-10.9a.63.63%200%2000-.6-.5h-.6l-1.1-.9h-1.9l-.3-2a4.83%204.83%200%20003.5-4.7A4.78%204.78%200%200011%202.3H10.8a4.9%204.9%200%2000-1.4%209.6l-.3%202h-1.9l-1%20.9h-.6a.74.74%200%2000-.6.5c-2%207.5-2.7%2010-3%2010.9l.3.1L4.8%2020l1.9.3.2%2015.8h1.6l.6-8.4a1.52%201.52%200%20011.5-1.4%201.5%201.5%200%20011.5%201.4l.9%208.4zm-10.9-9.6zm17.5-.1z%22%20style%3D%22isolation%3Aisolate%22%20fill%3D%22%23333%22%20opacity%3D%22.7%22/%3E%3Cpath%20d%3D%22M5.9%2013.6l1.1-.9h7.8l1.2.9%22%20fill%3D%22%23ce592c%22/%3E%3Cellipse%20cx%3D%2210.9%22%20cy%3D%2213.1%22%20rx%3D%222.7%22%20ry%3D%22.3%22%20style%3D%22isolation%3Aisolate%22%20fill%3D%22%23ce592c%22%20opacity%3D%22.5%22/%3E%3Cpath%20d%3D%22M20.6%2026.1l-2.9-11.3a1.71%201.71%200%2000-1.6-1.2H5.699999999999999a1.69%201.69%200%2000-1.5%201.3l-3.1%2011.3a.61.61%200%2000.3.7l1.1.4a.61.61%200%2000.7-.3l2.7-6.7.2%2016.8h3.6l.6-9.3a.47.47%200%2001.44-.5h.06c.4%200%20.4.2.5.5l.6%209.3h3.6L15.7%2020.3l2.5%206.6a.52.52%200%2000.66.31l1.2-.4a.57.57%200%2000.5-.7z%22%20fill%3D%22%23fdbf2d%22/%3E%3Cpath%20d%3D%22M7%2013.6l3.9%206.7%203.9-6.7%22%20style%3D%22isolation%3Aisolate%22%20fill%3D%22%23cf572e%22%20opacity%3D%22.6%22/%3E%3Ccircle%20cx%3D%2210.9%22%20cy%3D%227%22%20r%3D%225.9%22%20fill%3D%22%23fdbf2d%22/%3E%3C/svg%3E" style="color: transparent;">
        `;
        mapContainer.appendChild(coverageLayerControl);
        coverageLayerControl.onclick = (e) =>{
            toggleCoverageLayer()}
    }

    let splitContainer = mapContainer.querySelector('.peek-split-container');
    if (!splitContainer) {
        splitContainer = document.createElement('div');
        splitContainer.className = 'peek-split-container';
        splitContainer.innerHTML = `
            <div class="peek-split-resizer"></div>
            <button class="peek-control" id="peek-split-close">×</button>
            <button class="peek-control" id="peek-save" title="Save to MapMaking">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24">
                <path d="M9 6L12 3M12 3L15 6M12 3V13M7.00023 10C6.06835 10 5.60241 10 5.23486 10.1522C4.74481 10.3552 4.35523 10.7448 4.15224 11.2349C4 11.6024 4 12.0681 4 13V17.8C4 18.9201 4 19.4798 4.21799 19.9076C4.40973 20.2839 4.71547 20.5905 5.0918 20.7822C5.5192 21 6.07899 21 7.19691 21H16.8036C17.9215 21 18.4805 21 18.9079 20.7822C19.2842 20.5905 19.5905 20.2839 19.7822 19.9076C20 19.4802 20 18.921 20 17.8031V13C20 12.0681 19.9999 11.6024 19.8477 11.2349C19.6447 10.7448 19.2554 10.3552 18.7654 10.1522C18.3978 10 17.9319 10 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="peek-split-pano"></div>
        `;
        mapContainer.appendChild(splitContainer);
        document.getElementById('peek-save').addEventListener('click', async () => {
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
                        MAP_MAKING_API_KEY=result.value
                        GM_setValue("MAP_MAKING_API_KEY", result.value);
                    }
                });
            }

            if(!MAP_LIST) {
                showLoader();

                try {
                    MAP_LIST = await getMaps();
                }catch{
                    //empty
                }

                hideLoader();
            }

            if(MAP_LIST) {
                showMapList()
            }
        });

        splitContainer.querySelector('#peek-split-close').onclick = (e) => {
            e.stopPropagation();
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
        viewer.addListener("pano_changed", function() {
            updatePanoSelector(viewer.getPano(),panoSelector)
        });
    }
    else {
        viewer.setPano(pano.panoId)
        viewer.setPov({ heading: pano.heading, pitch: pano.pitch})
        viewer.setZoom(1)
    }
    let panoSelector = document.getElementById('pano-select');
    if(!panoSelector){
        panoSelector = document.createElement("select");
        panoSelector.id = "pano-select";
        panoSelector.addEventListener('change', function() {
            if(viewer)viewer.setPano(panoSelector.value);
        });
        if(splitContainer)splitContainer.appendChild(panoSelector);
    }
    requestAnimationFrame(() => {
        updatePanoSelector(pano.panoId, panoSelector)
        splitContainer.classList.add('active');
        offsetMapFocus(guessMap, pano.location);
    });
}
function showMapList() {
    if(document.getElementById('mwstmm-map-list')) return;

    const element = document.createElement('div');
    element.id = 'mwstmm-map-list';
    element.className = 'mwstmm-modal';

    let recentMapsSection = ``;
    if(MWSTMM_STATE.recentMaps.length > 0) {
        let recentMapsHTML = '';
        for(const m of MWSTMM_STATE.recentMaps) {
            if(m.archivedAt) continue;
            recentMapsHTML += `<div class="map">
                <a href="https://map-making.app/maps/${m.id}" class="map-link">
				    <span class="map-name">${m.name}</span>
                </a>
				<span class="map-buttons">
					<span class="map-add" data-id="${m.id}">ADD</span>
					<span class="map-added">ADDED</span>
				</span>
			</div>`;
        }

        recentMapsSection = `
			<h3>Recent Maps</h3>

			<div class="maps">
				${recentMapsHTML}
			</div>

			<br>
		`;
    }

    let mapsHTML = '';
    let tagButtonsHTML = '';
    if(LOCATION){
        for (const tag of LOCATION.tagFields) {
            tagButtonsHTML += `<button class="tag-button" data-tag="${tag}">${tag}</button>`;
        }
    }
    if(previousTags.length>0){
        for (const tag of previousTags) {
            tagButtonsHTML += `<button class="tag-button" data-tag="${tag}">${tag}</button>`;
        }
    }
    for(const m of MAP_LIST) {
        if(m.archivedAt) continue;
        mapsHTML += `<div class="map">
            <a href="https://map-making.app/maps/${m.id}" class="map-link">
			    <span class="map-name">${m.name}</span>
            </a>
			<span class="map-buttons">
				<span class="map-add" data-id="${m.id}">ADD</span>
				<span class="map-added">ADDED</span>
			</span>
		</div>`;
    }

    element.innerHTML = `
	<div class="inner">
		<h3>Tags (comma separated)</h3>

		<input type="text" class="tag-input" id="mwstmm-map-tags" />

        <div class="tag-buttons">
            ${tagButtonsHTML}
        </div>

		<br><br>

		${recentMapsSection}

		<h3>All Maps</h3>

		<div class="maps">
			${mapsHTML}
		</div>
	</div>

	<div class="dim"></div>
	`;

    document.body.appendChild(element);

    element.querySelector('.dim').addEventListener('click', closeMapList);

    document.getElementById('mwstmm-map-tags').addEventListener('keyup', e => e.stopPropagation());
    document.getElementById('mwstmm-map-tags').addEventListener('keydown', e => e.stopPropagation());
    document.getElementById('mwstmm-map-tags').addEventListener('keypress', e => e.stopPropagation());
    document.getElementById('mwstmm-map-tags').focus();

    for(const map of element.querySelectorAll('.maps .map-add')) {
        map.addEventListener('click', addLocationToMap);
    }

    for (const btn of element.querySelectorAll('.tag-button')) {
        btn.addEventListener('click', function () {
            const tag = this.dataset.tag;
            const input = document.getElementById('mwstmm-map-tags');

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
    const element = document.getElementById('mwstmm-map-list');
    if(element) element.remove();
}

function addLocationToMap(e) {
    e.target.parentNode.classList.add('is-added');

    const id = parseInt(e.target.dataset.id);
    previousMapId=id
    GM_setValue('previousMapId', JSON.stringify(previousMapId));


    MWSTMM_STATE.recentMaps = MWSTMM_STATE.recentMaps.filter(e => e.id !== id).slice(0, 2);
    for(const map of MAP_LIST) {
        if(map.id === id) {
            MWSTMM_STATE.recentMaps.unshift(map);
            break;
        }
    }

    saveState();
    const tagList=document.getElementById('mwstmm-map-tags').value.split(',').map(t => t.trim()).filter(t => t.length > 0)
    const customTags = tagList.filter(tag => !LOCATION.tagFields.includes(tag));
    const merged = [...customTags, ...previousTags].filter((t, i, arr) => arr.indexOf(t) === i);
    const limited = merged.slice(0, 5);
    GM_setValue('previousTags', JSON.stringify(limited));
    importLocations(id, [{
        id: -1,
        location: {lat: LOCATION.lat, lng: LOCATION.lng},
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
    const data = GM_getValue('mwstmm_state', null)
    if(!data) return;

    const dataJson = JSON.parse(data);
    if(!data) return;

    Object.assign(MWSTMM_STATE, defaultState(), dataJson);
    saveState();
}

function saveState() {
    GM_setValue('mwstmm_state', JSON.stringify(MWSTMM_STATE));
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
    if(document.getElementById('mwstmm-loader')) return;

    const element = document.createElement('div');
    element.id = 'mwstmm-loader';
    element.className = 'mwstmm-modal';
    element.innerHTML = `
		<div class="text">LOADING...</div>
		<div class="dim"></div>
	`;
    document.body.appendChild(element);
}

function hideLoader() {
    const element = document.getElementById('mwstmm-loader');
    if(element) element.remove();
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
    loadState();
    window.addEventListener("urlchange", () => {
        startMarkerObserver();
        starMapObserver();
        loadState();
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

        .peek-control {
            background: none rgb(68, 68, 68);
            border: 0px;
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
            z-index: 10008;
        }

        .peek-control:hover {
            color: #e6e6e6;
        }

        .peek-map-control {
            position:absolute;
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
            opacity:0.8;
            z-index: 10008;
        }

        .peek-map-control:hover {
            opacity: 1.0;
        }

        #peek-save{
            top: 110px;
            right: 10px;
        }

        #peek-split-close{
            top: 60px;
            right: 10px;
        }

        #layer-toggle{
            bottom: 80px;
            left: 24px;
        }

.mwstmm-modal {
	position: fixed;
	inset: 0;
	z-index: 99999;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}

.mwstmm-modal .dim {
	position: fixed;
	inset: 0;
	z-index: 0;
	background: rgba(0,0,0,0.75);
}

.mwstmm-modal .text {
	position: relative;
	z-index: 1;
}

.mwstmm-modal .inner {
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

#mwstmm-loader {
	color: #fff;
	font-weight: bold;
}
.mwstmm-settings {
	position: absolute;
	top: 1rem;
	left: 1rem;
	z-index: 9;
	display: flex;
	flex-direction: column;
	gap: 5px;
	align-items: flex-start;
}
#mwstmm-main {
 	position: absolute;
    width:40px;
    height:40px;
	top: 0.85rem;
    right: 4rem;
 	z-index: 9;
 	display: flex;
    border: none;
    border-radius: 50%;
    background: #00000099;
    background-repeat: no-repeat;
    background-position:50%;
 	flex-direction: column;
 	gap: 5px;
 	align-items: flex-start;
 }

#mwstmm-main:hover{
    cursor: pointer;
    opacity:0.8;
}

#mwstmm-main::after{
    display:none;
    content: attr(data-text);
    position:absolute;
    top:120%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 1);
    color: #fff;
    padding: 5px;
    border-radius: 5px;
    font-weight:normal;
    font-size: 11px;
    line-height: 1;
    height: auto;
    white-space: nowrap;
    transition: opacity 0.5s ease;
}

#mwstmm-main:hover::after {
    opacity: 1;
    display: block;
}

.mwstmm-settings.extra-pad {
	top: 2.5rem;
}

.mwstmm-title {
	font-size: 15px;
	font-weight: bold;
	text-shadow: rgb(204, 48, 46) 2px 0px 0px, rgb(204, 48, 46) 1.75517px 0.958851px 0px, rgb(204, 48, 46) 1.0806px 1.68294px 0px, rgb(204, 48, 46) 0.141474px 1.99499px 0px, rgb(204, 48, 46) -0.832294px 1.81859px 0px, rgb(204, 48, 46) -1.60229px 1.19694px 0px, rgb(204, 48, 46) -1.97998px 0.28224px 0px, rgb(204, 48, 46) -1.87291px -0.701566px 0px, rgb(204, 48, 46) -1.30729px -1.5136px 0px, rgb(204, 48, 46) -0.421592px -1.95506px 0px, rgb(204, 48, 46) 0.567324px -1.91785px 0px, rgb(204, 48, 46) 1.41734px -1.41108px 0px, rgb(204, 48, 46) 1.92034px -0.558831px 0px;
	position: relative;
	z-index: 1;
}

.mwstmm-subtitle {
	font-size: 12px;
	background: rgba(204, 48, 46, 0.4);
	padding: 3px 5px;
	border-radius: 5px;
	position: relative;
	z-index: 0;
	top: -8px;
	text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.mwstmm-subtitle a:hover {
	text-decoration: underline;
}

.mwstmm-settings-option {
	background: var(--ds-color-purple-100);
	padding: 6px 10px;
	border-radius: 5px;
	font-size: 12px;
	cursor: pointer;
	opacity: 0.75;
	transition: opacity 0.2s;
	pointer-events: auto;
}

.mwstmm-settings-option:hover {
	opacity: 1;
}

#mwstmm-map-list h3 {
	margin-bottom: 10px;
}

#mwstmm-map-list .tag-input {
	display: block;
	width: 100%;
	font: inherit;
    border:1px solid #ccc;
}

#mwstmm-map-list .maps {
	max-height: 200px;
	overflow-x: hidden;
	overflow-y: auto;
	font-size: 15px;
}

#mwstmm-map-list .map {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 20px;
	padding: 8px;
	transition: background 0.2s;
}

#mwstmm-map-list .map:nth-child(2n) {
	background: #f0f0f0;
}

#mwstmm-map-list .map-buttons:not(.is-added) .map-added {
	display: none !important;
}
#mwstmm-map-list .map-buttons.is-added .map-add {
	display: none !important;
}

#mwstmm-map-list .map-add {
	background: green;
	color: #fff;
	padding: 3px 6px;
	border-radius: 5px;
	font-size: 13px;
	font-weight: bold;
	cursor: pointer;
}

#mwstmm-map-list .map-added {
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
  padding:5px;
  font-size: 14px;
  color: #FFFFFF;
  position: absolute;
  bottom: 2px;
  right: 320px;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  border: none;
  cursor: pointer;
  text-align: left;
  z-index:10007;
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