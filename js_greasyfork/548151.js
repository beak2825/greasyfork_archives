// ==UserScript==
// @name         WorldGuessr Location Helper
// @namespace    http://tampermonkey.net/
// @author       Omkar04
// @version      1.3
// @description  Extract coords → reverse geocode → show city/state/country with Maps button
// @match        https://www.worldguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=worldguessr.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/548151/WorldGuessr%20Location%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/548151/WorldGuessr%20Location%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** ---------- Helpers ---------- **/

    // Making the menu draggable
    function makeDraggable(elem, handle) {
        let offsetX = 0, offsetY = 0, isDown = false;

        handle.addEventListener("mousedown", (e) => {
            if (elem.style.opacity === "0") return;
            isDown = true;
            offsetX = e.clientX - elem.offsetLeft;
            offsetY = e.clientY - elem.offsetTop;
            handle.style.cursor = "grabbing";
            e.preventDefault();
        });

        document.addEventListener("mouseup", () => {
            if (elem.style.opacity === "0") return;
            isDown = false;
            handle.style.cursor = "grab";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            if (elem.style.opacity === "0") return;
            elem.style.left = (e.clientX - offsetX) + "px";
            elem.style.top = (e.clientY - offsetY) + "px";
        });
    }

    // Finds the iframe and extracts lat/lng
    function getCoordsFromIframe() {
        const iframe = document.querySelector('iframe[src*="svEmbed"]');
        if (!iframe) return null;

        const url = new URL(iframe.src);
        const lat = parseFloat(url.searchParams.get('lat'));
        const lng = parseFloat(url.searchParams.get('long'));

        return (!isNaN(lat) && !isNaN(lng)) ? { lat, lng } : null;
    }

    // Reverse geocode coords into city/state/country
    async function reverseGeocode(lat, lng) {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            const data = await res.json();
            const addr = data.address || {};

            // Build clean string without empty commas
            const parts = [];
            if (addr.city || addr.town || addr.village) parts.push(addr.city || addr.town || addr.village);
            if (addr.state) parts.push(addr.state);
            if (addr.country) parts.push(addr.country);

            return parts.join(", ") || data.display_name || "Unknown location";
        } catch (e) {
            console.error("Reverse geocoding failed:", e);
            return "Unknown location";
        }
    }

    // Create or get the overlay UI
    function getOrCreateOverlay() {
        let overlay = document.getElementById("coords-overlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "coords-overlay";
            overlay.style.position = "absolute";
            overlay.style.top = "10px";
            overlay.style.padding = "8px 12px";
            overlay.style.background = "rgba(0,0,0,0.8)";
            overlay.style.color = "#0f0";
            overlay.style.fontFamily = "monospace";
            overlay.style.zIndex = "99999";
            overlay.style.opacity = "1";

            // Title
            const header = document.createElement("div");
            header.setAttribute("id", "cmTitle");
            header.textContent = "Cheat Menu ⚡ [Press F1 to show/hide]";
            header.style.fontWeight = "bold";
            header.style.padding = "4px";
            header.style.cursor = "grab";
            header.style.background = "#333";
            header.style.borderBottom = "1px solid #555";
            overlay.prepend(header);

            // Info text
            const info = document.createElement("div");
            info.id = "coords-info";
            overlay.appendChild(info);

            // Open Google Maps Button
            const btn = document.createElement("button");
            btn.textContent = "🌍 Open in Maps for exact location";
            btn.style.marginTop = "6px";
            btn.style.padding = "4px 8px";
            btn.style.background = "#222";
            btn.style.color = "#0f0";
            btn.style.border = "1px solid #0f0";
            btn.style.cursor = "pointer";
            btn.onclick = () => {
                const coords = getCoordsFromIframe();
                if (coords) {
                    window.open(
                        `https://www.google.com/maps/place/${coords.lat},${coords.lng}/@${coords.lat},${coords.lng},5z`,
                        "_blank"
                    );
                }
            };
            overlay.appendChild(btn);

            document.body.appendChild(overlay);
        }
        return overlay;
    }

    function hideOrShowMenu(e) {
        if (e.key === "F1") {
            e.preventDefault();
            let menu = document.querySelector("#coords-overlay");
            if (menu) {
                 menu.style.opacity = menu.style.opacity === "0" ? "1" : "0";
            }
        }
    }

    /** ---------- Main Loop ---------- **/

    let madeDraggable = false;
    async function updateLocation() {
        const coords = getCoordsFromIframe();
        if (!coords) return;

        const overlay = getOrCreateOverlay();
        const title = overlay.querySelector("#cmTitle");
        const infoBox = overlay.querySelector("#coords-info");

        if (!madeDraggable) {
            makeDraggable(overlay, title);
        }

        // Fetch reverse geocode
        const locationStr = await reverseGeocode(coords.lat, coords.lng);
        infoBox.textContent = `📍 ${locationStr}`;
    }

    document.addEventListener("keydown", hideOrShowMenu);
    setInterval(updateLocation, 1000);
})();
