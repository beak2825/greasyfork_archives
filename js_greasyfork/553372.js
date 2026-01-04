// ==UserScript==
// @name         Geoguessr Map Tracker by Xeliyi
// @namespace    http://tampermonkey.net/
// @version      26.0.5
// @description  A tool with smart zoom that automatically detects the incoming location in GeoGuessr and displays it to the player via the panel.
// @match        https://www.geoguessr.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      BSD-2-Clause
// @downloadURL https://update.greasyfork.org/scripts/553372/Geoguessr%20Map%20Tracker%20by%20Xeliyi.user.js
// @updateURL https://update.greasyfork.org/scripts/553372/Geoguessr%20Map%20Tracker%20by%20Xeliyi.meta.js
// ==/UserScript==
/* global google */

(function() {
'use strict';

const PANEL_ID = 'xeliyi-gmaps-panel';
const MAP_ID = 'xeliyi-gmaps-map';
const ICON_URL = 'https://i.ibb.co/VY5Jz0nB/icon.png';
const APPLE_LOGO = 'https://substackcdn.com/image/fetch/$s_!G1lk!,f_auto,q_auto:good,fl_progressive/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8ed3d547-94ff-48e1-9f20-8c14a7030a02_2000x2000.jpeg';
const APPLE_URL = 'https://www.apple.com/';
const GOOGLE_API_KEY = 'AIzaSyDG2A_QHMfTtSykt-ttEspW5ScSNF2AmQg';

let map, marker, mapReady = false;
let currentRoundCoordinates = { lat: null, lng: null };
let lastKnownCoordinates = { lat: null, lng: null };

// CSS
GM_addStyle(`
    .shine-panel::before { content: ''; position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(45deg, rgba(224,247,255,0) 25%, rgba(255,255,255,0.4) 50%, rgba(192,232,255,0) 75%); background-size: 400% 400%; animation: shine45 2.5s linear infinite; pointer-events: none; }
    @keyframes shine45 { 0% { background-position: 200% 200%; } 100% { background-position: -200% -200%; } }

    .xeliyi-shine { font-weight:600; font-size:18px; color: #ffffff; background: linear-gradient(45deg, #e0f7ff 25%, #ffffff 50%, #c0e8ff 75%); background-size: 200% 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shine 2.5s linear infinite; }
    @keyframes shine { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    #toggle-controls.shine { background: linear-gradient(45deg, #e0f7ff 25%, #ffffff 50%, #c0e8ff 75%); background-size: 200% 200%; color: black; animation: shineBtn 2s linear infinite; }
    @keyframes shineBtn { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    #country-label { position: absolute; top: 35px; left: 50%; transform: translateX(-50%) scale(1.2); background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(180,255,255,1)); color: black; font-size: 8px; font-weight: 540; padding: 2px 8px; border-radius: 6px; box-shadow: 0 0 15px rgba(255,255,255,0.9); z-index: 9; pointer-events: none; white-space: nowrap; display:none; transition: all 0.3s ease; }
`);

// XHR hijack
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
    if (method.toUpperCase() === 'POST' &&
        (url.includes('MapsJsInternalService/GetMetadata') || url.includes('MapsJsInternalService/SingleImageSearch'))) {
        this.addEventListener('load', function () {
            try {
                const pattern = /-?\d+\.\d+,-?\d+\.\d+/g;
                const match = this.responseText.match(pattern);
                if (match && match.length > 0) {
                    const coords = match[0].split(",");
                    currentRoundCoordinates.lat = parseFloat(coords[0]);
                    currentRoundCoordinates.lng = parseFloat(coords[1]);
                    if(currentRoundCoordinates.lat !== lastKnownCoordinates.lat ||
                       currentRoundCoordinates.lng !== lastKnownCoordinates.lng) {
                        updateMapPosition();
                        lastKnownCoordinates = Object.assign({}, currentRoundCoordinates);
                        userInteracted = false;
                    }
                }
            } catch(e){}
        });
    }
    return originalOpen.apply(this, arguments);
};

    const originalFetch = window.fetch;
window.fetch = async function(...args) {
    const response = await originalFetch.apply(this, args);
    const cloned = response.clone();
    cloned.text().then(text => {
        const pattern = /-?\d+\.\d+,-?\d+\.\d+/g;
        const match = text.match(pattern);
        if (match && match.length > 0) {
            const coords = match[0].split(",");
            currentRoundCoordinates.lat = parseFloat(coords[0]);
            currentRoundCoordinates.lng = parseFloat(coords[1]);
            if (currentRoundCoordinates.lat !== lastKnownCoordinates.lat ||
                currentRoundCoordinates.lng !== lastKnownCoordinates.lng) {
                updateMapPosition();
                lastKnownCoordinates = Object.assign({}, currentRoundCoordinates);
            }
        }
    }).catch(()=>{});
    return response;
};


// Panel and draggable
function createPanel() {
    if (document.getElementById(PANEL_ID)) return;
    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.style.display = 'flex';
    panel.dataset.manualToggle = 'true';
    panel.innerHTML = `
        <div id="panel-header" class="shine-panel" style="background-color: black; color:white; padding:8px; height:55px; display:flex; align-items:center; justify-content:flex-start; border-top-left-radius:8px; border-top-right-radius:8px; font-size:22px; position: relative; overflow: hidden;">
            <a href="${APPLE_URL}" target="_blank"><img src="${APPLE_LOGO}" style="width:55px; height:55px; margin-right:100px; margin-left:0px; margin-top:5px;"></a>
            <div style="margin-left:auto; display:flex; align-items:center;">
                <span style="color: rgba(255,255,255,0.5); font-size:16px; margin-right:3px;">by</span>
                <span class="xeliyi-shine" style="font-size:16px;">Xeliyi</span>
            </div>
            <button id="toggle-controls"></button>
            <div id="country-label"></div>
        </div>
        <div id="${MAP_ID}" style="flex-grow:1;height:260px;position:relative;"></div>
    `;
    panel.style.cssText = `position: fixed; top: 10px; right: 10px; z-index: 99999; width: 280px; height: 350px; background: #1a1a1a; border: 2px solid #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(255,255,255,0.3); display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; overflow: hidden;`;
    document.body.appendChild(panel);

    makeDraggable(panel);
    initMapOnce();
    observeRoundChanges();
    observeGameChanges();
    observePanelResize(panel);

    const toggleBtn = document.getElementById('toggle-controls');
    toggleBtn.style.cssText = `position: absolute; top: 0px; left: 50%; width: 20px; height: 20px; font-size: 16px; font-weight: bold; border: none; border-radius: 6px; background: rgba(255,255,255,0.25); color: white; cursor: pointer; transition: all 0.3s ease; transform: translateX(-50%) scale(1); box-shadow: 0 0 5px rgba(255,255,255,0.5); z-index: 10;`;
    toggleBtn.textContent = '≡';

    let controlsVisible = false;
    toggleBtn.addEventListener('click', () => {
        if (!map) return;
        controlsVisible = !controlsVisible;

        map.setOptions({
            zoomControl: false,
            streetViewControl: controlsVisible,
            fullscreenControl: controlsVisible,
            mapTypeControl: controlsVisible
        });

        const countryLabel = document.getElementById('country-label');
        if (controlsVisible) {
            toggleBtn.textContent = '✕';
            toggleBtn.classList.add('shine');
            countryLabel.style.display = 'block';
        } else {
            toggleBtn.textContent = '≡';
            toggleBtn.classList.remove('shine');
            countryLabel.style.display = 'none';
        }
    });
}

// Google Maps Geocoder
function getCountryName(lat, lng, callback) {
    if (!lat || !lng) { callback(""); return; }
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: {lat, lng} }, (results, status) => {
        if (status === "OK" && results[0]) {
            const countryComponent = results[0].address_components.find(c => c.types.includes("country"));
            if (countryComponent) { callback(countryComponent.long_name); return; }
        }
        callback("");
    });
}

// Map setup
function initMapOnce() {
    if (mapReady) return;
    const mapDiv = document.getElementById(MAP_ID);
    if (!mapDiv) return;
    if (typeof google === 'undefined' || !google.maps) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`;
        document.head.appendChild(script);
        script.onload = () => { setupMap(); };
    } else { setupMap(); }
}

let userInteracted = false;

function setupMap() {
    map = new google.maps.Map(document.getElementById(MAP_ID), {
        center: { lat: 0, lng: 0 },
        zoom: 3,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false,
        gestureHandling: "auto",
        scrollwheel: true
    });

    const normalIcon = { url: ICON_URL, scaledSize: new google.maps.Size(25,25) };
    const hoverIcon = { url: ICON_URL, scaledSize: new google.maps.Size(35,35) };

    marker = new google.maps.Marker({
        position: { lat: 0, lng: 0 },
        map: map,
        icon: normalIcon
    });

    marker.addListener('mouseover', () => marker.setIcon(hoverIcon));
    marker.addListener('mouseout', () => marker.setIcon(normalIcon));

    map.addListener('zoom_changed', () => { userInteracted = true; });
    map.addListener('dragstart', () => { userInteracted = true; });

    mapReady = true;
}

// Country Label Settings
function updateMapPosition(force = false) {
    if (!mapReady || !marker) return;
    const { lat, lng } = currentRoundCoordinates;
    if (!lat || !lng) return;

    if (userInteracted && !force) return;

    marker.setPosition(new google.maps.LatLng(lat, lng));
    map.setCenter(new google.maps.LatLng(lat, lng));
    map.setZoom(getZoomLevelForLatLng(lat, lng));

    getCountryName(lat, lng, name => {
        const countryLabel = document.getElementById('country-label');
        if (countryLabel) countryLabel.textContent = name;
    });
}

// Smart Zoom for Countries
function getZoomLevelForLatLng(lat,lng){
    if(isCoordInCountry(lat,lng,"Bangladesh")) return 5.7;
    if(isCoordInCountry(lat,lng,"San Marino")) return 11;
    if(isCoordInCountry(lat,lng,"Bhutan")) return 7.1;
    if(isCoordInCountry(lat,lng,"Sri Lanka")) return 6;
    if(isCoordInCountry(lat,lng,"USA")) return 4;
    if(isCoordInCountry(lat,lng,"Uruguay")) return 5.5;
    if(isCoordInCountry(lat,lng,"Nepal")) return 6.0;
    if(isCoordInCountry(lat,lng,"Gibraltar")) return 12.2;
    if(isCoordInCountry(lat,lng,"India")) return 4;
    if(isCoordInCountry(lat,lng,"Northern Ireland")) return 7;
    if(isCoordInCountry(lat,lng,"Singapore")) return 9.8;
    if(isCoordInCountry(lat,lng,"Liechtenstein")) return 9.7;
    if(isCoordInCountry(lat,lng,"Canary Islands")) return 6;
    if(isCoordInCountry(lat,lng,"Puerto Rico")) return 7.5;
    if(isCoordInCountry(lat,lng,"Isle of Man")) return 8.3;
    if(isCoordInCountry(lat,lng,"Guatemala")) return 6.5;
    if(isCoordInCountry(lat,lng,"Christmas Island")) return 10.2;
    if(isCoordInCountry(lat,lng,"Cocos Islands")) return 10.5;
    if(isCoordInCountry(lat,lng,"Macau")) return 9.3;
    if(isCoordInCountry(lat,lng,"Lithuania")) return 6;
    if(isCoordInCountry(lat,lng,"Ireland")) return 6;
    if(isCoordInCountry(lat,lng,"Ecuador")) return 6;
    if(isCoordInCountry(lat,lng,"Colombia")) return 5;
    if(isCoordInCountry(lat,lng,"Qatar")) return 7;
    if(isCoordInCountry(lat,lng,"North Macedonia")) return 7;
    if(isCoordInCountry(lat,lng,"Bolivia")) return 4.7;
    if(isCoordInCountry(lat,lng,"Peru")) return 5;
    if(isCoordInCountry(lat,lng,"Malaysia")) return 6;
    if(isCoordInCountry(lat,lng,"Brazil")) return 3.5;
    if(isCoordInCountry(lat,lng,"Kyrgyzstan")) return 5.4;
    if(isCoordInCountry(lat,lng,"Poland")) return 5.1;
    if(isCoordInCountry(lat,lng,"Alaska")) return 3.2;
    if(isCoordInCountry(lat,lng,"Austria")) return 5.9;
    if(isCoordInCountry(lat,lng,"Thailand")) return 5.4;
    if(isCoordInCountry(lat,lng,"Argentina")) return 4.7;
    if(isCoordInCountry(lat,lng,"Chile")) return 3.6;
    if(isCoordInCountry(lat,lng,"Canada")) return 4;
    if(isCoordInCountry(lat,lng,"Albania")) return 6;
    if(isCoordInCountry(lat,lng,"Switzerland")) return 6;
    if(isCoordInCountry(lat,lng,"Slovakia")) return 6;
    if(isCoordInCountry(lat,lng,"Ukraine")) return 5;
    if(isCoordInCountry(lat,lng,"Finland")) return 4.6;
    if(isCoordInCountry(lat,lng,"Israel")) return 6.5;
    if(isCoordInCountry(lat,lng,"UAE")) return 6.5;
    if(isCoordInCountry(lat,lng,"Oman")) return 5.5;
    if(isCoordInCountry(lat,lng,"Tunisia")) return 6;
    if(isCoordInCountry(lat,lng,"Malta")) return 9.4;
    if(isCoordInCountry(lat,lng,"Luxembourg")) return 7;
    if(isCoordInCountry(lat,lng,"Andorra")) return 9.1;
    if(isCoordInCountry(lat,lng,"Philippines")) return 5.5;
    if(isCoordInCountry(lat,lng,"Monaco")) return 13;
    if(isCoordInCountry(lat,lng,"Guam")) return 9.8;
    if(isCoordInCountry(lat,lng,"Bermuda")) return 10.5;
    if(isCoordInCountry(lat,lng,"Dominican Republic")) return 6.3;
    if(isCoordInCountry(lat,lng,"Faroe Islands")) return 6.5;
    if(isCoordInCountry(lat,lng,"Costa Rica")) return 6.5;
    if(isCoordInCountry(lat,lng,"Panama")) return 6.5;
    if(isCoordInCountry(lat,lng,"Greece")) return 6;
    if(isCoordInCountry(lat,lng,"Denmark")) return 6;
    if(isCoordInCountry(lat,lng,"Sweden")) return 4.4;
    if(isCoordInCountry(lat,lng,"Italy")) return 5.7;
    if(isCoordInCountry(lat,lng,"Greenland")) return 3.5;
    if(isCoordInCountry(lat,lng,"Mexico")) return 4.2;
    if(isCoordInCountry(lat,lng,"Taiwan")) return 6.3;
    if(isCoordInCountry(lat,lng,"Hong Kong")) return 9;
    if(isCoordInCountry(lat,lng,"Japan")) return 5;
    if(isMediumEuropeanCountry(lat,lng)) return 6;
    if(isLargeEuropeanCountry(lat,lng)) return 5;
    if(isSmallEuropeanCountry(lat,lng)) return 7;
    if(isLargeCountry(lat,lng)) return 3;
    if(isArchipelagoCountry(lat,lng)) return 4.2;
    if(isSmallCountry(lat,lng)) return 6.5;
    if(isCoordInCountry(lat,lng,"Australia")) return 3.8;
    return 5;
}

// Coordinate controls
function isMediumEuropeanCountry(lat,lng){ const m=["Romania","Bulgaria","Hungary","Croatia","Slovenia","Serbia","Bosnia","Moldova","Poland","Lithuania","Latvia","Estonia","Netherlands","Belgium"]; return m.some(c=>isCoordInCountry(lat,lng,c)); }
function isLargeEuropeanCountry(lat,lng){ const l=["Italy","United Kingdom","Greece","Spain","France","Germany"]; return l.some(c=>isCoordInCountry(lat,lng,c)); }
function isSmallEuropeanCountry(lat,lng){ const s=["San Marino","Monaco","Liechtenstein","Andorra"]; return s.some(c=>isCoordInCountry(lat,lng,c)); }
function isLargeCountry(lat,lng){ const l=["Russia"]; return l.some(c => isCoordInCountry(lat,lng,c)); } 
function isSmallCountry(lat,lng){ return isCoordInCountry(lat,lng,"Singapore","Gibraltar"); }
function isArchipelagoCountry(lat,lng){ const arch=["Indonesia","Philippines","Japan","Norway","New Zealand","Canary Islands"]; return arch.some(c => isCoordInCountry(lat,lng,c)); }

function isCoordInCountry(lat,lng,c){
    switch(c){
        case "Mexico": return lat>14&&lat<33 && lng>-119&&lng<-86;
        case "USA": return lat>24&&lat<49 && lng>-125&&lng<-66;
        case "San Marino": return lat>43.87 && lat<44.01 && lng>12.40 && lng<12.52;
        case "Russia": return lat>41&&lat<82 && lng>19&&lng<180;
        case "Gibraltar": return lat>36.10 && lat<36.17 && lng>-5.37 && lng<-5.32;
        case "Northern Ireland": return lat>54.0 && lat<55.4 && lng>-8.2 && lng<-5.3;
        case "Christmas Island": return lat>-11.7 && lat<-10.3 && lng>105.4 && lng<106.0;
        case "Cocos Islands": return lat>-12.3 && lat<-11.6 && lng>96.7 && lng<97.3;
        case "Macau": return lat>22.1 && lat<22.25 && lng>113.5 && lng<113.7;
        case "Brazil": return lat>-35&&lat<6 && lng>-74&&lng<-34;
        case "Ecuador": return lat > -5 && lat < 2 && lng > -81 && lng < -75;
        case "Australia": return lat>-44&&lat<-10 && lng>112&&lng<154;
        case "Indonesia": return lat>-11&&lat<6 && lng>95&&lng<141;
        case "Philippines": return lat>4&&lat<21 && lng>116&&lng<127;
        case "Japan": return lat>24&&lat<46 && lng>123&&lng<146;
        case "Norway": return lat>57&&lat<72 && lng>4&&lng<31;
        case "New Zealand": return lat>-48&&lat<-33 && lng>165&&lng<180;
        case "Italy": return lat>36&&lat<47 && lng>6&&lng<19;
        case "United Kingdom": return lat>49&&lat<60 && lng>-8&&lng<2;
        case "Greece": return lat>34&&lat<42 && lng>19&&lng<29;
        case "Spain": return lat>36&&lat<44 && lng>-9&&lng<4;
        case "France": return lat>41&&lat<51 && lng>-5&&lng<9;
        case "Germany": return lat>47&&lat<55 && lng>5&&lng<15;
        case "Romania": return lat>43&&lat<48 && lng>20&&lng<29;
        case "Bulgaria": return lat>41&&lat<44 && lng>22&&lng<28;
        case "Hungary": return lat>46&&lat<48 && lng>16&&lng<20;
        case "Croatia": return lat>42&&lat<46 && lng>15&&lng<19;
        case "Slovenia": return lat>45&&lat<47 && lng>13&&lng<16;
        case "Serbia": return lat>43&&lat<46 && lng>19&&lng<22;
        case "Bosnia": return lat>42&&lat<45 && lng>16&&lng<19;
        case "Moldova": return lat>46&&lat<48 && lng>27&&lng<30;
        case "Poland": return lat>49&&lat<55 && lng>14&&lng<24;
        case "Lithuania": return lat>53&&lat<56 && lng>20&&lng<26;
        case "Latvia": return lat>55&&lat<58 && lng>21&&lng<28;
        case "Estonia": return lat>57&&lat<60 && lng>21&&lng<28;
        case "Netherlands": return lat>50.7 && lat<53.6 && lng>3.3 && lng<7.2;
        case "Belgium": return lat>49.5 && lat<51.5 && lng>2.5 && lng<6.4;
        case "Malta": return lat>35.8&&lat<36 && lng>14.2&&lng<14.6;
        case "Monaco": return lat>43.72&&lat<43.75 && lng>7.4&&lng<7.45;
        case "Liechtenstein": return lat>47.05&&lat<47.27 && lng>9.47&&lng<9.63;
        case "Andorra": return lat>42.4&&lat<42.7 && lng>1.4&&lng<1.75;
        case "Singapore": return lat>1.2&&lat<1.5 && lng>103.6&&lng<104;
        case "Taiwan": return lat>21.5&&lat<25.5 && lng>119.5&&lng<122.5;
        case "Hong Kong": return lat>22.1&&lat<22.6 && lng>113.8&&lng<114.3;
        case "Argentina": return lat>-55&&lat<-21 && lng>-73&&lng<-53;
        case "Chile": return lat>-56&&lat<-17 && lng>-75&&lng<-66;
        case "Uruguay": return lat>-35.5 && lat<-29.5 && lng>-59 && lng<-52.5;
        case "India": return lat>6&&lat<37 && lng>68&&lng<97;
        case "Thailand": return lat>5&&lat<21 && lng>97&&lng<106;
        case "Malaysia": return lat>0.5&&lat<7.5 && lng>100&&lng<120;
        case "Kyrgyzstan": return lat>39&&lat<43 && lng>69&&lng<80;
        case "Alaska": return lat>54&&lat<72 && lng>-170&&lng<-129;
        case "Bangladesh": return lat>20.5&&lat<26.5 && lng>88&&lng<92;
        case "Sri Lanka": return lat>5.9&&lat<9.9 && lng>79.7&&lng<81.9;
        case "Austria": return lat>46.5 && lat<49.1 && lng>9.5 && lng<17;
        case "Bangladesh": return lat>20.5 && lat<26.5 && lng>88 && lng<92;
        case "Canada": return lat>41&&lat<84 && lng>-141&&lng<-52;
        case "Albania": return lat > 39 && lat < 42 && lng > 19 && lng < 21;
        case "Switzerland": return lat > 45.8 && lat < 47.8 && lng > 5.9 && lng < 10.5;
        case "Slovakia": return lat > 47.7 && lat < 49.6 && lng > 16.8 && lng < 22.6;
        case "Ukraine": return lat > 44.4 && lat < 52.4 && lng > 22 && lng < 40;
        case "Finland": return lat > 59.9 && lat < 70.1 && lng > 20.5 && lng < 31.6;
        case "Israel": return lat > 29.5 && lat < 33.5 && lng > 34.2 && lng < 35.9;
        case "UAE": return lat > 22.5 && lat < 26 && lng > 51 && lng < 56;
        case "Oman": return lat > 16.5 && lat < 26.5 && lng > 52 && lng < 60;
        case "Tunisia": return lat > 30 && lat < 38 && lng > 7 && lng < 12;
        case "Malta": return lat>35.8 && lat<36 && lng>14.2 && lng<14.6;
        case "Luxembourg": return lat>49.4 && lat<50.2 && lng>5.7 && lng<6.5;
        case "Andorra": return lat>42.4 && lat<42.7 && lng>1.4 && lng<1.75;
        case "Philippines": return lat>4 && lat<21 && lng>116 && lng<127;
        case "Monaco": return lat>43.72 && lat<43.75 && lng>7.4 && lng<7.45;
        case "Liechtenstein": return lat>47.05 && lat<47.27 && lng>9.47 && lng<9.63;
        case "Canary Islands": return lat>27.5 && lat<29.5 && lng>-18 && lng<-13;
        case "Guam": return lat>13 && lat<14 && lng>144 && lng<145;
        case "Bermuda": return lat>32.2 && lat<32.4 && lng>-64.9 && lng<-64.5;
        case "Puerto Rico": return lat>17.9 && lat<18.5 && lng>-67.3 && lng<-65.9;
        case "Dominican Republic": return lat>17.5 && lat<20 && lng>-72.0 && lng<-68.0;
        case "Guatemala": return lat>13.7 && lat<17.0 && lng>-92.0 && lng<-88.0;
        case "Faroe Islands": return lat>61.3 && lat<62.4 && lng>-7.8 && lng<-6.2;
        case "Costa Rica": return lat>8.0 && lat<11.5 && lng>-86.0 && lng<-82.5;
        case "Panama": return lat>7.0 && lat<10.5 && lng>-83.0 && lng<-77.0;
        case "North Macedonia": return lat>40.8 && lat<42.3 && lng>20.4 && lng<22.9;
        case "Denmark": return lat>54.5 && lat<57.8 && lng>8.0 && lng<12.7;
        case "Sweden": return lat>55 && lat<69.5 && lng>11 && lng<24.5;
        case "Greenland": return lat > 58 && lat < 84 && lng > -74 && lng < -11;
        case "Bolivia": return lat > -23 && lat < -9 && lng > -70 && lng < -57;
        case "Peru": return lat > -18 && lat < -0.03 && lng > -81 && lng < -68;
        case "Colombia": return lat > -4 && lat < 13 && lng > -79 && lng < -66;
        case "Ireland": return lat > 51.3 && lat < 55.5 && lng > -10.5 && lng < -5.3;
        case "Isle of Man": return lat>54.0 && lat<54.45 && lng>-4.8 && lng<-4.3;
        case "Bhutan": return lat>26.6 && lat<28.3 && lng>88.6 && lng<92.2;
        case "Nepal": return lat>26.3 && lat<30.5 && lng>80.0 && lng<88.3;
        case "Qatar": return lat>24.4 && lat<26.3 && lng>50.6 && lng<52.2;
        default: return false;
    }
}

// Observers
function observeRoundChanges(){ const target=document.getElementById('__next')||document.body; if(!target) return; const observer=new MutationObserver(()=>{ updateMapPosition(); }); observer.observe(target,{childList:true,subtree:true}); }
setInterval(() => {
    if (currentRoundCoordinates.lat && currentRoundCoordinates.lng) {
        updateMapPosition();
    }
}, 3000);
function observeGameChanges(){ const target = document.getElementById('__next') || document.body; if(!target) return; const observer = new MutationObserver(() => {}); observer.observe(target,{childList:true,subtree:true}); }
function makeDraggable(element){ const header=element.querySelector('#panel-header'); if(!header) return; let pos1=0,pos2=0,pos3=0,pos4=0; header.onmousedown=e=>{ e.preventDefault(); pos3=e.clientX; pos4=e.clientY; document.onmouseup=()=>{document.onmouseup=null;document.onmousemove=null;}; document.onmousemove=e=>{ e.preventDefault(); pos1=pos3-e.clientX; pos2=pos4-e.clientY; pos3=e.clientX; pos4=e.clientY; element.style.top=(element.offsetTop-pos2)+'px'; element.style.left=(element.offsetLeft-pos1)+'px'; }; }; }
function observePanelResize(panel){ const observer=new ResizeObserver(()=>{ if(map) google.maps.event.trigger(map,'resize'); }); observer.observe(panel); }

// Open/Close with Ctrl Key
let panelVisible = false;
window.addEventListener('keydown', (e) => {
    if (e.key === 'Control') {
        e.preventDefault();
        const panel = document.getElementById(PANEL_ID);
        if (!panel) {
            createPanel();
            panelVisible = true;
        } else {
            panelVisible = !panelVisible;
            panel.style.display = panelVisible ? 'flex' : 'none';
        }
    }
});

})();