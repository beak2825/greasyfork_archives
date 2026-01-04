// ==UserScript==
// @name         Google Maps LatLon Extractor
// @namespace    gmaps-latlon
// @version      1.0
// @description  Adds a small floating button to Google Maps that extracts and copies the latitude and longitude from the current URL.
// @author       bekkibau
// @license      MIT
// @match        https://www.google.com/maps/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554308/Google%20Maps%20LatLon%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/554308/Google%20Maps%20LatLon%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create floating button
    const btn = document.createElement('button');
    btn.textContent = 'Get LatLon';
    Object.assign(btn.style, {
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 9999,
        background: '#fff',
        color: '#000',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '6px 10px',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        fontSize: '14px'
    });
    document.body.appendChild(btn);

    // Extract latitude and longitude from the URL
    const getLatLon = () => {
        const match = location.href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        return match ? { lat: match[1], lon: match[2] } : null;
    };

    // Show popup with copy button
    const showPopup = ({ lat, lon }) => {
        const popup = document.createElement('div');
        Object.assign(popup.style, {
            position: 'fixed',
            top: '120px',
            right: '20px',
            background: '#fff',
            color: '#000',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            zIndex: 9999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            fontSize: '13px'
        });
        popup.innerHTML = `
            <div><b>Latitude:</b> ${lat}</div>
            <div><b>Longitude:</b> ${lon}</div>
            <button id="copyLatLon" style="
                margin-top:6px;
                background:#4285f4;
                color:#fff;
                border:none;
                border-radius:5px;
                padding:4px 8px;
                cursor:pointer;">Copy</button>
        `;
        document.body.appendChild(popup);

        popup.querySelector('#copyLatLon').onclick = () => {
            navigator.clipboard.writeText(`${lat}, ${lon}`);
            popup.querySelector('#copyLatLon').textContent = 'Copied!';
            setTimeout(() => popup.remove(), 1500);
        };
    };

    // Handle button click
    btn.addEventListener('click', () => {
        const coords = getLatLon();
        if (coords) showPopup(coords);
        else alert('Could not find coordinates in URL.');
    });
})();
