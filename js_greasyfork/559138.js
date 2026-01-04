// ==UserScript==
// @name         Slither.io Zoom Hack WORKING 2025
// @namespace    http://slither.io/
// @version      1.0
// @description  Allows zooming in and out in Slither.io using keys scroll wheel on mouse. Key 1 reset the zoom - The domain name changed for slither so this has been updated to work.
// @author       Icewerve
// @grant        none
// @match        http://slither.com/io
// @match        http://slither.io/?c
// @match        http://slither.io
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/559138/Slitherio%20Zoom%20Hack%20WORKING%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/559138/Slitherio%20Zoom%20Hack%20WORKING%202025.meta.js
// ==/UserScript==

// Enable debug logging
window.logDebugging = false;
window.log = function() {
    if (window.logDebugging) {
        console.log.apply(console, arguments);
    }
};

window.zoomMultiplier = 1.0;

window.updateZoom = function() {
    window.gsc = window.zoomMultiplier;
    // Updated overlay text to reflect new controls
    document.getElementById("zoom_overlay").innerHTML =
        `Scroll to change zoom: ${window.zoomMultiplier.toFixed(1)}`;
};


window.recursiveZoomUpdate = function() {
    window.gsc = window.zoomMultiplier;
    requestAnimationFrame(window.recursiveZoomUpdate);
};


window.resetZoom = function() {
    window.zoomMultiplier = 1.0;
    window.updateZoom();
};

window.adjustZoom = function(amount) {
    // Zoom step adjusted for a smoother scroll experience
    window.zoomMultiplier = Math.max(0.2, Math.min(3.0, window.zoomMultiplier + amount));
    window.updateZoom();
};

// --- REMOVED KEYDOWN HANDLER FOR 8/9 ---
// The original keydown function is preserved for key 1 (reset zoom)
document.oldKeyDown = document.onkeydown;
document.onkeydown = function(e) {
    if (typeof document.oldKeyDown === "function") {
        document.oldKeyDown(e);
    }

    // Only keep the reset zoom functionality (key 49 is '1')
    // and ensure we are not typing in a text field
    if (document.activeElement.parentElement !== window.nick_holder) {
        // Original key codes: 57 ('9'), 56 ('8'), 49 ('1')
        // We only keep the reset zoom (key '1')
        if (e.keyCode === 49) {
            window.resetZoom();
        }
        // Removed: 57 (zoom in) and 56 (zoom out)
    }
};


// --- ADDED MOUSE WHEEL HANDLER ---

document.onwheel = function(e) {
    // We REMOVE the "if (e.ctrlKey)" check here.

    // Prevent the default browser zoom behavior (important!)
    e.preventDefault();

    let zoomStep = 0.05;

    if (e.deltaY < 0) {
        // Scroll up (Zoom In)
        window.adjustZoom(zoomStep);
    } else if (e.deltaY > 0) {
        // Scroll down (Zoom Out)
        window.adjustZoom(-zoomStep);
    }
};


window.initZoomOverlay = function() {
    let overlay = document.createElement("div");
    overlay.id = "zoom_overlay";
    overlay.style = "color: #FFF; font-family: Arial, sans-serif; font-size: 18px; position: fixed; left: 30px; top: 65px; z-index: 1000;";
    // Updated initial overlay text
    overlay.innerHTML = "Scroll to change zoom: " +window.zoomMultiplier.toFixed(1) + '</span>';
    document.body.appendChild(overlay);
};

window.initt = function() {
    window.initZoomOverlay();
    window.updateZoom();
    window.recursiveZoomUpdate();
};

window.initt();