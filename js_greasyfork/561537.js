// ==UserScript==
// @name        theCrag - PhotoTopo Panning
// @namespace   theCrag.com
// @version     1.0
// @description Allows dragging and panning on zoomed phototopos on mobile devices.
// @author      killakalle (Gemini)
// @match       https://www.thecrag.com/*
// @icon        https://www.google.com/s2/favicons?domain=thecrag.com
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/561537/theCrag%20-%20PhotoTopo%20Panning.user.js
// @updateURL https://update.greasyfork.org/scripts/561537/theCrag%20-%20PhotoTopo%20Panning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isDragging = false;
    let startX, startY;
    let translateX = 0, translateY = 0;

    // Listener for the start of a touch
    document.addEventListener('touchstart', function(e) {
        // Target the specific canvas element theCrag uses for topos
        const canvas = e.target.closest('.phototopo .canvas.autozoom');
        if (!canvas) return;

        // theCrag sets a scale via inline styles. We only pan if it's NOT scale(1)
        const currentTransform = canvas.style.transform || '';
        const isZoomed = currentTransform.includes('scale') && !currentTransform.includes('scale(1)');
        
        if (isZoomed) {
            isDragging = true;
            
            // Capture initial touch minus existing offset to prevent the image from snapping to 0,0
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
            
            // Remove transition for immediate finger-tracking
            canvas.style.transition = 'none'; 
        }
    }, { passive: false });

    // Listener for finger movement
    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;

        const canvas = e.target.closest('.phototopo .canvas.autozoom');
        if (!canvas) return;

        // Critical: prevents the browser from scrolling the page while panning the image
        e.preventDefault();

        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;

        // Regex to find the existing scale factor so we don't overwrite the zoom level
        const scaleMatch = canvas.style.transform.match(/scale\(([^)]+)\)/);
        const currentScale = scaleMatch ? scaleMatch[1] : 1;

        // Apply translation. We divide by scale to keep the movement speed 1:1 with the finger
        canvas.style.transform = `scale(${currentScale}) translate(${translateX / currentScale}px, ${translateY / currentScale}px)`;
    }, { passive: false });

    // Listener for touch release
    document.addEventListener('touchend', function(e) {
        isDragging = false;
        const canvas = e.target.closest('.phototopo .canvas.autozoom');
        if (canvas) {
            // Restore transitions for when the site's native code takes over (like zooming out)
            canvas.style.transition = ''; 
        }
    });

    // Reset logic: if the user clicks the topo to zoom back out, we need to clear our panning
    document.addEventListener('click', function(e) {
        const canvas = e.target.closest('.phototopo .canvas.autozoom');
        if (canvas) {
            // Short delay to allow the site's native click handler to update the transform first
            setTimeout(() => {
                if (canvas.style.transform.includes('scale(1)')) {
                    translateX = 0;
                    translateY = 0;
                    canvas.style.transform = 'scale(1) translate(0px, 0px)';
                }
            }, 100);
        }
    });

})();