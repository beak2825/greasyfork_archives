// ==UserScript==
// @name         Frosty's Geoguessr Location Revealer
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Displays Nearest Town/city-Region/territory-Country (with flag) aswell as Configurable Hotkeys for it aswell as the following | Safe Marker - Place random close guess (~4700 points) | Exact Marker - Place exact marker | Open in Google Maps.
// @author       ItsFrosty
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_webRequest
// @downloadURL https://update.greasyfork.org/scripts/549894/Frosty%27s%20Geoguessr%20Location%20Revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/549894/Frosty%27s%20Geoguessr%20Location%20Revealer.meta.js
// ==/UserScript==

let globalCoordinates = { lat: 0, lng: 0 };
let countryDisplayEl = null;
let overlayVisible = true;
let latestLocation = { town: "", region: "", country: "", code: "" };

/* ======================== HOTKEY CONFIG ======================== */
const HOTKEYS = {
    safeMarker: "1",        // Place random close guess (~4700 points)
    exactMarker: "2",       // Place exact marker
    openGoogleMaps: "3",    // Open Google Maps
    toggleOverlay: "4"      // Toggle overlay visibility
};

/* ======================== DISPLAY ======================== */
function createCountryDisplay() {
    countryDisplayEl = document.createElement("div");
    countryDisplayEl.style.position = "fixed";
    countryDisplayEl.style.top = "10%";
    countryDisplayEl.style.right = "20px";
    countryDisplayEl.style.padding = "10px 15px";
    countryDisplayEl.style.backgroundColor = "rgba(0,0,0,0.7)";
    countryDisplayEl.style.color = "white";
    countryDisplayEl.style.fontSize = "16px";
    countryDisplayEl.style.fontFamily = "Arial, sans-serif";
    countryDisplayEl.style.borderRadius = "5px";
    countryDisplayEl.style.zIndex = "9999";
    countryDisplayEl.style.pointerEvents = "none";
    countryDisplayEl.style.transform = "translateY(-50%)";
    countryDisplayEl.style.display = "flex";
    countryDisplayEl.style.alignItems = "center";
    countryDisplayEl.style.gap = "8px";
    countryDisplayEl.innerHTML = "🌍 Detecting...";
    document.body.appendChild(countryDisplayEl);
}
createCountryDisplay();

/* ======================== UPDATE LOCATION ======================== */
async function updateCountry(lat, lng) {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const data = await res.json();
        const addr = data.address || {};

        let town = addr.city || addr.town || addr.village || "";
        let region = addr.state || addr.region || addr.county || addr.province || "";
        let territory = addr.territory || addr.island || "";

        let displayRegion = territory || region;
        let country = addr.country || "Unknown";
        let code = (addr.country_code || "").toLowerCase();

        // store latest location for overlay
        latestLocation = { town, region: displayRegion, country, code };

        // only render if overlay visible
        if (countryDisplayEl && overlayVisible) renderCountryDisplay();

    } catch {
        if (countryDisplayEl && overlayVisible) countryDisplayEl.innerHTML = "⚠️ Failed to load location";
    }
}

/* ======================== RENDER FUNCTION ======================== */
function renderCountryDisplay() {
    const { town, region, country, code } = latestLocation;
    let leftPart = town ? `<b>${town}</b> – ` : "";
    let middlePart = region ? `${region}, ${country}` : country;

    countryDisplayEl.innerHTML = `
        <span>${leftPart}${middlePart}</span>
        <img src="https://flagcdn.com/24x18/${code}.png"
             alt="${country}"
             style="border:1px solid #fff; border-radius:3px;">
    `;
}

/* ======================== INTERCEPT GOOGLE API ======================== */
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url) {
    if (method.toUpperCase() === "POST" && (url.includes("GetMetadata") || url.includes("SingleImageSearch"))) {
        this.addEventListener("load", function () {
            const pattern = /-?\d+\.\d+,-?\d+\.\d+/g;
            let match = this.responseText.match(pattern)?.[0];
            if (!match) return;
            let [lat, lng] = match.split(",").map(Number);
            globalCoordinates.lat = lat;
            globalCoordinates.lng = lng;
            updateCountry(lat, lng);
        });
    }
    return originalOpen.apply(this, arguments);
};

/* ======================== PLACE MARKER ======================== */
function placeMarker(safeMode) {
    let { lat, lng } = globalCoordinates;
    if (safeMode) {
        const sway = [Math.random() > 0.5, Math.random() > 0.5];
        const multiplier = Math.random() * 2.5; // ~4700 points safe mode
        const horizontalAmount = Math.random() * multiplier;
        const verticalAmount = Math.random() * multiplier;
        sway[0] ? lat += verticalAmount : lat -= verticalAmount;
        sway[1] ? lng += horizontalAmount : lat -= horizontalAmount;
    }

    const element = document.querySelector('[class^="guess-map_canvas__"]');
    if (!element) return;

    const latLngFns = { latLng: { lat: () => lat, lng: () => lng } };
    const reactKeys = Object.keys(element);
    const reactKey = reactKeys.find(k => k.startsWith("__reactFiber$"));
    const elementProps = element[reactKey];
    const mapElementClick = elementProps.return.return.memoizedProps.map.__e3_.click;
    const mapElementPropKey = Object.keys(mapElementClick)[Object.keys(mapElementClick).length - 1];
    const mapClickProps = mapElementClick[mapElementPropKey];
    const mapElementPropKeys = Object.keys(mapClickProps);

    for (let i = 0; i < mapElementPropKeys.length; i++) {
        if (typeof mapClickProps[mapElementPropKeys[i]] === "function") {
            mapClickProps[mapElementPropKeys[i]](latLngFns);
        }
    }
}

/* ======================== OPEN GOOGLE MAPS ======================== */
function mapsFromCoords() {
    const { lat, lng } = globalCoordinates;
    if (!lat || !lng) return;
    const url = `https://maps.google.com/?output=embed&q=${lat},${lng}&ll=${lat},${lng}&z=5`;
    window.open(url, "_blank");
}

/* ======================== HOTKEYS ======================== */
document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (key === HOTKEYS.safeMarker) { e.stopImmediatePropagation(); placeMarker(true); }
    if (key === HOTKEYS.exactMarker) { e.stopImmediatePropagation(); placeMarker(false); }
    if (key === HOTKEYS.openGoogleMaps) { e.stopImmediatePropagation(); mapsFromCoords(); }
    if (key === HOTKEYS.toggleOverlay) {
        overlayVisible = !overlayVisible;
        countryDisplayEl.style.display = overlayVisible ? "flex" : "none";
        if (overlayVisible) renderCountryDisplay(); // immediately show latest location
    }
});
