// ==UserScript==
// @name         Website Text Editor
// @namespace    https://ember2819.dev
// @version      1.0
// @description  Lets you click any text on any website and edit it like Inspect Element.
// @author       Ember2819
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556721/Website%20Text%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/556721/Website%20Text%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Floating Menu ---
    const menu = document.createElement("div");
    menu.style.position = "fixed";
    menu.style.top = "20px";
    menu.style.right = "20px";
    menu.style.zIndex = "999999";
    menu.style.background = "rgba(20,20,20,0.9)";
    menu.style.color = "#fff";
    menu.style.padding = "12px 15px";
    menu.style.borderRadius = "10px";
    menu.style.fontFamily = "Arial";
    menu.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
    menu.style.cursor = "pointer";
    menu.textContent = "Editor: OFF";
    document.body.append(menu);

    let enabled = false;

    // --- Highlight box ---
    const highlight = document.createElement("div");
    highlight.style.position = "absolute";
    highlight.style.border = "2px dashed #00e1ff";
    highlight.style.pointerEvents = "none";
    highlight.style.zIndex = "999998";
    highlight.style.display = "none";
    document.body.append(highlight);

    let currentTarget = null;

    // --- Toggle mod mode ---
    menu.addEventListener("click", () => {
        enabled = !enabled;
        menu.textContent = enabled ? "Editor: ON" : "Editor: OFF";
        highlight.style.display = enabled ? "block" : "none";
    });

    // --- Mouse tracking for highlighting ---
    document.addEventListener("mousemove", (e) => {
        if (!enabled) return;

        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (!el || el === menu) return;

        currentTarget = el;
        const rect = el.getBoundingClientRect();

        highlight.style.top = rect.top + "px";
        highlight.style.left = rect.left + "px";
        highlight.style.width = rect.width + "px";
        highlight.style.height = rect.height + "px";
    });

    // --- Click to edit text ---
    document.addEventListener("click", (e) => {
        if (!enabled) return;
        if (e.target === menu) return;
        e.preventDefault();
        e.stopPropagation();

        const newText = prompt("Enter new text:", e.target.innerText);
        if (newText !== null) {
            e.target.innerText = newText;
        }
    }, true);

})();
