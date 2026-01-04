// ==UserScript==
// @name         Splitclicker (Left = R, Right = T)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto clicks left mouse on R, right mouse on T (toggle keys)
// @author       ItsSAE (Credits to r0Cker_Cats_YT)
// @match        *://bloxd.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557216/Splitclicker%20%28Left%20%3D%20R%2C%20Right%20%3D%20T%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557216/Splitclicker%20%28Left%20%3D%20R%2C%20Right%20%3D%20T%29.meta.js
// ==/UserScript==
 
 
(function () {
    'use strict';
 
    const CPS = 10000000000000000; // clicks per second
    const interval = 1 / CPS;
 
    let leftClicking = false;
    let rightClicking = false;
    let lastClickTime = 0;
    let targetCanvas = null;
 
    function getCanvas() {
        if (!targetCanvas || !document.contains(targetCanvas)) {
            targetCanvas = document.querySelector('canvas');
        }
        return targetCanvas;
    }
 
    function clickCanvas(button = 0) {
        const canvas = getCanvas();
        if (!canvas) return;
 
        const rect = canvas.getBoundingClientRect();
        const clientX = rect.left + rect.width / 2;
        const clientY = rect.top + rect.height / 2;
 
        ["mousedown", "mouseup", "click"].forEach(type => {
            const event = new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX,
                clientY,
                button
            });
            canvas.dispatchEvent(event);
        });
    }
 
    function loop(timestamp) {
        if (timestamp - lastClickTime >= interval) {
            if (leftClicking) clickCanvas(0); // Left click
            if (rightClicking) clickCanvas(2); // Right click
            lastClickTime = timestamp;
        }
        requestAnimationFrame(loop);
    }
 
    document.addEventListener("keydown", e => {
        if (e.key.toLowerCase() === "r") {
            leftClicking = !leftClicking;
            console.log(`[AutoClicker] Left clicks: ${leftClicking ? "ON" : "OFF"}`);
        }
        if (e.key.toLowerCase() === "t") {
            rightClicking = !rightClicking;
            console.log(`[AutoClicker] Right clicks: ${rightClicking ? "ON" : "OFF"}`);
        }
    });
 
    requestAnimationFrame(loop);
})();