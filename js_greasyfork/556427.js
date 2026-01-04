// ==UserScript==
// @name         Thin Moving Crosshair
// @match        *://*.shellshock.io/*
// @grant        none
// @description moving cross hair
// @version 0.0.1.20251120194352
// @namespace https://greasyfork.org/users/1357667
// @downloadURL https://update.greasyfork.org/scripts/556427/Thin%20Moving%20Crosshair.user.js
// @updateURL https://update.greasyfork.org/scripts/556427/Thin%20Moving%20Crosshair.meta.js
// ==/UserScript==

(function () {
    function waitForElement(id) {
        return new Promise(resolve => {
            const check = setInterval(() => {
                const el = document.getElementById(id);
                if (el) {
                    clearInterval(check);
                    resolve(el);
                }
            }, 100);
        });
    }

    waitForElement("crosshairContainer").then(container => {
        console.log("Crosshair container found!");

        
        const ch = document.createElement("div");
        ch.id = "thinCrosshair";
        Object.assign(ch.style, {
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 1
        });

        const vert = document.createElement("div");
        Object.assign(vert.style, {
            position: "absolute",
            width: "1.2px",
            height: "24px",
            background: "#ffffff",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)"
        });

        const horiz = document.createElement("div");
        Object.assign(horiz.style, {
            position: "absolute",
            width: "24px",
            height: "1.2px",
            background: "#ffffff",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)"
        });

        ch.appendChild(vert);
        ch.appendChild(horiz);
        container.appendChild(ch);

        
        let offsetX = 0, offsetY = 0;
        const strength = 0.28;  // how much it moves
        const smoothing = 0.15; // reduce jitter

        document.addEventListener("mousemove", e => {
            
            if (document.pointerLockElement == null) return;

            offsetX += e.movementX * strength;
            offsetY += e.movementY * strength;
        });

        function animate() {
  
            offsetX *= (1 - smoothing);
            offsetY *= (1 - smoothing);

            ch.style.transform =
                `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;

            requestAnimationFrame(animate);
        }
        animate();
    });
})();
