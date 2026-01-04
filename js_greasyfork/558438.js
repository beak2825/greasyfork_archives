// ==UserScript==
// @name         Neal.fun Perfect Circle Drawer (Guarantee it works!)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Draws a perfect circle in Neal.fun's game when pressing the button or Ctrl+Z
// @author       Suomynona589
// @match        https://neal.fun/perfect-circle/
// @grant        none
// @icon         https://neal.fun/favicons/perfect-circle.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558438/Nealfun%20Perfect%20Circle%20Drawer%20%28Guarantee%20it%20works%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558438/Nealfun%20Perfect%20Circle%20Drawer%20%28Guarantee%20it%20works%21%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to draw the circle
    function drawCircle() {
        let s = document.querySelector("main svg").getBoundingClientRect(),
            cx = s.width / 2 + s.x,
            cy = s.height / 2 + s.y,
            r = s.width / 3,
            d = document.querySelector("main div"),
            a = 0;

        for (let e = 0; e < 50; e++) {
            a += Math.acos(1 - Math.pow(60 / r, 2) / 2);
            let t = Math.round(cx + r * Math.cos(a)),
                n = Math.round(cy + r * Math.sin(a));

            if (e === 0) {
                d.dispatchEvent(new MouseEvent("mousedown", { clientX: t, clientY: n }));
            }
            d.dispatchEvent(new MouseEvent("mousemove", { clientX: t, clientY: n }));
        }

        d.dispatchEvent(new MouseEvent("mouseup"));
    }

    // Create button in bottom-left of screen
    const btn = document.createElement("button");
    btn.textContent = "Draw Perfect Circle";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.left = "20px";
    btn.style.zIndex = "9999";
    btn.style.padding = "12px 20px";
    btn.style.fontSize = "16px";
    btn.style.background = "#4CAF50";
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.borderRadius = "8px";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 4px 6px rgba(0,0,0,0.2)";
    btn.title = "Shortcut: Ctrl+Z";

    btn.addEventListener("click", function() {
        drawCircle();
    });

    document.body.appendChild(btn);

    // Keyboard shortcut: Ctrl+Z
    document.addEventListener("keydown", function(e) {
        if (e.ctrlKey && e.key.toLowerCase() === "z") {
            drawCircle();
        }
    });
})();