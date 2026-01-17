// ==UserScript==
// @description  1ms script,.. if don't work tell me pls..
// @name         Taming.io AutoClick + Spike (1ms)
// @namespace    https://greasyfork.org/
// @version      1.5
// @match        https://taming.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562902/Tamingio%20AutoClick%20%2B%20Spike%20%281ms%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562902/Tamingio%20AutoClick%20%2B%20Spike%20%281ms%29.meta.js
// ==/UserScript==
 (function () {
    'use strict';

    let enabled = true;
    let clickInterval = null;
    let holdingC = false;

    const indicator = document.createElement("div");
    indicator.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        padding: 5px 8px;
        background: rgba(0,0,0,0.7);
        color: #00ff00;
        font-family: Arial;
        font-size: 12px;
        border-radius: 5px;
        z-index: 9999;
        user-select: none;
    `;
    indicator.textContent = "ON";
    document.body.appendChild(indicator);

    function updateIndicator() {
        indicator.textContent = enabled ? "ON" : "OFF";
        indicator.style.color = enabled ? "#00ff00" : "#ff3333";
    }

    function gameClick() {
        if (!enabled) return;

        const canvas = document.querySelector("canvas");
        if (!canvas) return;

        const r = canvas.getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;

        canvas.dispatchEvent(new MouseEvent("mousedown", {
            bubbles: true,
            clientX: x,
            clientY: y,
            buttons: 1
        }));

        setTimeout(() => {
            canvas.dispatchEvent(new MouseEvent("mouseup", {
                bubbles: true,
                clientX: x,
                clientY: y,
                buttons: 1
            }));
        }, 1);
    }

    document.addEventListener("keydown", e => {
        if (e.repeat) return;

        if (e.code === "KeyX") {
            enabled = !enabled;
            holdingC = false;
            clearInterval(clickInterval);
            clickInterval = null;
            updateIndicator();
            return;
        }

        if (!enabled) return;

        if (e.code === "KeyC" && !holdingC) {
            holdingC = true;
            gameClick();
            clickInterval = setInterval(gameClick, 1);
        }

        if (e.code === "KeyV") {
            window.dispatchEvent(new KeyboardEvent("keydown", {
                key: "v",
                code: "KeyV",
                bubbles: true
            }));
            setTimeout(() => {
                window.dispatchEvent(new KeyboardEvent("keyup", {
                    key: "v",
                    code: "KeyV",
                    bubbles: true
                }));
            }, 1);
        }
    });

    document.addEventListener("keyup", e => {
        if (e.code === "KeyC") {
            holdingC = false;
            clearInterval(clickInterval);
            clickInterval = null;
        }
    });

})();   
