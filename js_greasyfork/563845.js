// ==UserScript==
// @name         Google Maps → OpenStreetMap button
// @author       Krzysztof "Krzysiu" Blachnicki
// @namespace    https://github.com/Krzysiu
// @license      MIT
// @version      0.3
// @description  Adds a button in Google maps which opens the same map in OpenStreetMaps
// @match        https://www.google.com/maps/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIj48cGF0aCBmaWxsPSIjNmZhYmUzIiBkPSJNMSAwczQzIDczIDQzIDExNFMwIDE4NyAxIDIyOGMwIDQxIDQzIDczIDQzIDExNCAwIDQwLTQzIDExNC00MyAxMTRzNzMgNDQgMTEzIDQ0YzQxIDAgNzQtNDMgMTE0LTQzIDQxIDAgNzMgNDMgMTE0IDQzczExNC00MyAxMTQtNDMgNDQtNzUgNDQtMTE1Yy0xLTQxLTQ0LTczLTQ0LTExNCAwLTQwIDQ0LTczIDQ0LTExNFM0NTYgMCA0NTYgMHMtNzMgNDQtMTE0IDQ0Yy00MCAwLTczLTQ0LTExNC00NC00MCAwLTczIDQzLTExNCA0M0M3NCA0MyAxIDAgMSAwem0xNzEgMTIxYzI0IDAgNDUgMTQgNTUgMzRsLTI3IDE0Yy01LTExLTE1LTE3LTI4LTE3LTE5IDAtMzIgMTMtMzIgMzIgMCAxOCAxMyAzMiAzMiAzMiAxMiAwIDIyLTYgMjctMTVoLTI4di0yNGg2M3Y3YTYyIDYyIDAgMSAxLTYyLTYzem04MCAyaDMzbDM2IDc3IDM2LTc3aDM0djEyMWgtMzF2LTY0bC0zMCA2NGgtMTdsLTMwLTY1djY1aC0zMVYxMjN6TTEyMiAyNTRhNjIgNjIgMCAxIDEgMCAxMjUgNjIgNjIgMCAwIDEgMC0xMjV6bTExOCAwYzE1IDAgMjkgNyAzOSAxOGwtMjAgMjBjLTctNy0xNC0xMS0yMC0xMS00IDAtOSAyLTkgOCAwIDE4IDU2IDcgNTYgNTMgMCAyMy0yMSAzNy00NCAzNy0yMiAwLTQwLTEzLTQ4LTI4bDI1LTE2YzUgOSAxMyAxNSAyNCAxNSA4IDAgMTItNCAxMi05IDAtMTgtNTYtOC01Ni01MCAwLTI2IDIyLTM3IDQxLTM3em02MSAyaDM0bDM1IDc3IDM3LTc3aDMzdjEyMWgtMzF2LTY1bC0zMCA2NWgtMTdsLTMwLTY1djY1aC0zMVYyNTZ6bS0xNzkgMjhjLTE4IDAtMzIgMTQtMzIgMzIgMCAxOSAxNCAzMiAzMiAzMiAxOSAwIDMyLTEzIDMyLTMyIDAtMTgtMTMtMzItMzItMzJ6Ii8+PC9zdmc+
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563845/Google%20Maps%20%E2%86%92%20OpenStreetMap%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/563845/Google%20Maps%20%E2%86%92%20OpenStreetMap%20button.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const newTab = false; // true - open in new tab; false - open in the same tab
    const addPin = true; // make OSM to add pin - useful for finding the place

    const waitForBody = setInterval(() => {
        if (!document.body) return;
        clearInterval(waitForBody);

        const btn = document.createElement('div');
        btn.textContent = '🌍 OSM';

        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            height: '20px',
            lineHeight: '20px',
            padding: '0 10px',
            background: '#1a73e8',
            color: '#fff',
            fontSize: '12px',
            borderRadius: '4px',
            cursor: 'pointer',
            zIndex: '999999',
            userSelect: 'none'
        });

        btn.addEventListener('click', () => {
            const url = window.location.href;

            const match = url.match(/@([0-9.]+),([0-9.]+),([0-9.]+)z/);
            if (!match) {
                alert('Failed to fetch coordinates from URL 😔');
                return;
            }

            const lat = match[1];
            const lon = match[2];
            const zoom = Math.round(match[3]); // Google gives zoom as float, so round it (it won't be 1:1: zoom, anywways)

            // OSM link with "a pin"
            const osmUrl = addPin ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}` : `https://www.openstreetmap.org/#map=${zoom}/${lat}/${lon}`;
            if (newTab) window.open(osmUrl, '_blank'); else window.location.href = osmUrl;
        });

        document.body.appendChild(btn);
    }, 300);
})();
