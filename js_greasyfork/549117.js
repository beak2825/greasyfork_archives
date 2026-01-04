// ==UserScript==
// @name         Wplace Toggleable Spacebar Painter
// @namespace    Violentmonkey Scripts
// @version      1.1
// @description  Rebind Spacebar to Q key (default) or in whatever key you want.
// @author       Matsu
// @license MIT
// @match        https://wplace.live/*
// @downloadURL https://update.greasyfork.org/scripts/549117/Wplace%20Toggleable%20Spacebar%20Painter.user.js
// @updateURL https://update.greasyfork.org/scripts/549117/Wplace%20Toggleable%20Spacebar%20Painter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let enabled = false;
    let keybind = localStorage.getItem("painter-keybind") || "q";

    const savedPos = JSON.parse(localStorage.getItem("painter-indicator-pos")) || { top: 10, left: 10 };

    const indicator = document.createElement("div");
    indicator.id = "painter-indicator";
    indicator.style.position = "fixed";
    indicator.style.top = savedPos.top + "px";
    indicator.style.left = savedPos.left + "px";
    indicator.style.padding = "6px 12px";
    indicator.style.fontSize = "14px";
    indicator.style.fontWeight = "bold";
    indicator.style.borderRadius = "6px";
    indicator.style.background = "rgba(200, 0, 0, 0.8)";
    indicator.style.color = "white";
    indicator.style.zIndex = "9999";
    indicator.style.fontFamily = "Arial, sans-serif";
    indicator.style.cursor = "move";
    indicator.textContent = `Painter: OFF (Key: ${keybind.toUpperCase()})`;
    document.body.appendChild(indicator);

    function updateIndicator() {
        indicator.textContent = `Painter: ${enabled ? "ON" : "OFF"} (Key: ${keybind.toUpperCase()})`;
        indicator.style.background = enabled ? "rgba(0, 200, 0, 0.8)" : "rgba(200, 0, 0, 0.8)";
    }

    function dispatchKeyEvent(type) {
        const evt = new KeyboardEvent(type, {
            key: " ",
            code: "Space",
            keyCode: 32,
            which: 32,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(evt);
    }

    document.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === keybind && !e.repeat) {
            enabled = !enabled;
            if (enabled) {
                dispatchKeyEvent("keydown");
            } else {
                dispatchKeyEvent("keyup");
            }
            updateIndicator();
        }
    });

    indicator.addEventListener("contextmenu", (e) => {
        e.preventDefault();

        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.style.width = "20px";
        input.style.marginLeft = "6px";
        input.style.fontSize = "14px";
        input.style.fontWeight = "bold";
        input.value = keybind.toUpperCase();

        indicator.textContent = `Set key: `;
        indicator.appendChild(input);
        input.focus();

        input.addEventListener("blur", () => {
            const newKey = input.value.trim().toLowerCase();
            if (newKey && newKey.length === 1) {
                keybind = newKey;
                localStorage.setItem("painter-keybind", keybind);
                console.log(`[Wplace Script] Keybind changed to: ${keybind.toUpperCase()}`);
            }
            updateIndicator();
        });

        input.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter") {
                input.blur();
            }
        });
    });

    updateIndicator();

    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    indicator.addEventListener("mousedown", (e) => {
        if (e.button === 0) { 
            isDragging = true;
            offsetX = e.clientX - indicator.getBoundingClientRect().left;
            offsetY = e.clientY - indicator.getBoundingClientRect().top;
            indicator.style.transition = "none";
        }
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;
            indicator.style.left = `${newLeft}px`;
            indicator.style.top = `${newTop}px`;
        }
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            indicator.style.transition = "all 0.1s ease";

            const pos = {
                left: parseInt(indicator.style.left, 10),
                top: parseInt(indicator.style.top, 10)
            };
            localStorage.setItem("painter-indicator-pos", JSON.stringify(pos));
        }
    });
})();