// ==UserScript==
// @name         zoom.earth Radar 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  RainViewer radar iframe on zoom.earth site.
// @author       enduro
// @match        *://zoom.earth/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548154/zoomearth%20Radar.user.js
// @updateURL https://update.greasyfork.org/scripts/548154/zoomearth%20Radar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const iframeWidthNormal = '33vw';
    const iframeHeightNormal = '36vh';
    const iframeWidthMaximized = '100vw';
    const iframeHeightMaximized = '89.5vh';
    const iframeOffsetBottom = '22px';
    const iframeOffsetLeft = '6px';

    // Create the button elements
    const radarButton = document.createElement('button');
    radarButton.id = 'radarButton';
    radarButton.textContent = 'Radar';
    radarButton.style.cssText = `
        position: fixed;
        bottom: ${iframeOffsetBottom};
        left: ${iframeOffsetLeft};
        padding: 8px 12px;
        background-color: #1a73e8;
        color: white;
        border: none;
        border-radius: 5px;
        z-index: 9999;
        height: 30px;
        width: 60px;
        box-shadow: 0 0 1.5px rgba(255,255,255,.65);
        overflow: hidden;
        cursor: pointer;
    `;
    document.body.appendChild(radarButton);

    const maximizeButton = document.createElement('button');
    maximizeButton.id = 'maximizeButton';
    maximizeButton.innerHTML = '&#x26F6;'; // Unicode for a rectangle/square icon
    maximizeButton.style.cssText = `
        position: fixed;
        bottom: calc(${iframeHeightNormal} + ${iframeOffsetBottom} + 3px);
        left: calc(${iframeWidthNormal} + ${iframeOffsetLeft} - 55px);
        height: 25px;
        width: 25px;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        border-radius: 3px;
        z-index: 10000;
        cursor: pointer;
        display: none;
        font-size: 14px;
        padding: 0;
        line-height: 1;
        text-align: center;
    `;
    document.body.appendChild(maximizeButton);

    const closeButton = document.createElement('button');
    closeButton.id = 'closeButton';
    closeButton.innerHTML = '&#x2716;'; // Unicode for a cross/X icon
    closeButton.style.cssText = `
        position: fixed;
        bottom: calc(${iframeHeightNormal} + ${iframeOffsetBottom}3px);
        left: calc(${iframeWidthNormal} + ${iframeOffsetLeft} - 28px);
        height: 25px;
        width: 25px;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        border-radius: 3px;
        z-index: 10000;
        cursor: pointer;
        display: none;
        font-size: 14px;
        padding: 0;
        line-height: 1;
        text-align: center;
    `;
    document.body.appendChild(closeButton);

    // Create the iframe element
    const iframe = document.createElement('iframe');
    iframe.id = 'radarIframe';
    iframe.style.cssText = `
        position: fixed;
        bottom: ${iframeOffsetBottom};
        left: ${iframeOffsetLeft};
        width: ${iframeWidthNormal};
        height: ${iframeHeightNormal};
        border: none;
        z-index: 9999;
        display: none;
        transition: width 0.3s, height 0.3s, bottom 0.3s, left 0.3s;
    `;
    document.body.appendChild(iframe);

    let isMaximized = false;

    // Add click event listener to the "Radar" button
    radarButton.addEventListener('click', () => {
        let rainviewerUrl;
        const currentUrl = window.location.href;
        const match = currentUrl.match(/#view=([\d.-]+,[\d.-]+),([\d.]+z)\/overlays=/);

        if (match && match[1] && match[2]) {
            const coordinates = match[1];
            const zoomFactor = Math.max(1, parseFloat(match[2]) - 1);
            rainviewerUrl = `https://www.rainviewer.com/map.html?loc=${coordinates},${zoomFactor}&oCS=1&c=3&o=83&lm=1&layer=radar&sm=1`;
        } else {
            console.log('Coordinates not found in URL. Fallback to default.');
            rainviewerUrl = 'https://www.rainviewer.com/map.html';
        }

        iframe.src = rainviewerUrl;
        iframe.style.display = 'block';
        maximizeButton.style.display = 'block';
        closeButton.style.display = 'block';
        isMaximized = false;

        iframe.style.width = iframeWidthNormal;
        iframe.style.height = iframeHeightNormal;
        iframe.style.bottom = '${iframeOffsetBottom}';
        iframe.style.left = '${iframeOffsetLeft}';
        maximizeButton.style.bottom = `calc(${iframeHeightNormal} + ${iframeOffsetBottom} + 3px)`;
        maximizeButton.style.left = `calc(${iframeWidthNormal} + ${iframeOffsetLeft} - 55px)`;
        closeButton.style.bottom = `calc(${iframeHeightNormal} + ${iframeOffsetBottom} + 3px)`;
        closeButton.style.left = `calc(${iframeWidthNormal} + ${iframeOffsetLeft} - 28px)`;
    });

    // Add click event listener to the "Maximize" button
    maximizeButton.addEventListener('click', () => {
        if (isMaximized) {
            // Demaximize
            iframe.style.width = iframeWidthNormal;
            iframe.style.height = iframeHeightNormal;
            maximizeButton.style.left = `calc(${iframeWidthNormal} + ${iframeOffsetLeft} - 55px)`;
            maximizeButton.style.bottom = `calc(${iframeHeightNormal} + ${iframeOffsetBottom} + 3px)`;
            closeButton.style.left = `calc(${iframeWidthNormal} + ${iframeOffsetLeft} - 28px)`;
            closeButton.style.bottom = `calc(${iframeHeightNormal} + ${iframeOffsetBottom} + 3px)`;
        } else {
            // Maximize
            iframe.style.width = `calc(${iframeWidthMaximized} - ${iframeOffsetLeft} - ${iframeOffsetLeft})`;
            iframe.style.height = iframeHeightMaximized;
            maximizeButton.style.left = `calc(${iframeWidthMaximized} - 55px)`;
            maximizeButton.style.bottom = `calc(${iframeHeightMaximized} + ${iframeOffsetBottom} + 3px)`;
            closeButton.style.left = `calc(${iframeWidthMaximized} - 28px)`;
            closeButton.style.bottom = `calc(${iframeHeightMaximized} + ${iframeOffsetBottom} + 3px)`;
        }
        isMaximized = !isMaximized;
    });

    closeButton.addEventListener('click', () => {
        iframe.style.display = 'none';
        maximizeButton.style.display = 'none';
        closeButton.style.display = 'none';
        isMaximized = false;
    });
})();