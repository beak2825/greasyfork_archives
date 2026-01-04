// ==UserScript==
// @name         YouTube Rainbow Theme Switcher
// @namespace    https://youtube.com/
// @version      1.0
// @description  Movable GUI to switch YouTube rainbow themes (Red, Orange, Yellow, Green, Blue, Purple, Pink, White, Black)
// @author       sonic
// @match        *://*.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/fe2fda87/img/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/547970/YouTube%20Rainbow%20Theme%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/547970/YouTube%20Rainbow%20Theme%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const themes = {
        "Red": `
            html { --yt-spec-general-background-a: #330000 !important; --yt-spec-general-background-b: #440000 !important; --yt-spec-text-primary: #ffcccc !important; }
        `,
        "Orange": `
            html { --yt-spec-general-background-a: #331a00 !important; --yt-spec-general-background-b: #442200 !important; --yt-spec-text-primary: #ffe6cc !important; }
        `,
        "Yellow": `
            html { --yt-spec-general-background-a: #333300 !important; --yt-spec-general-background-b: #4d4d00 !important; --yt-spec-text-primary: #ffffcc !important; }
        `,
        "Green": `
            html { --yt-spec-general-background-a: #001a00 !important; --yt-spec-general-background-b: #003300 !important; --yt-spec-text-primary: #ccffcc !important; }
        `,
        "Blue": `
            html { --yt-spec-general-background-a: #00001a !important; --yt-spec-general-background-b: #000033 !important; --yt-spec-text-primary: #cce6ff !important; }
        `,
        "Purple": `
            html { --yt-spec-general-background-a: #1a001a !important; --yt-spec-general-background-b: #330033 !important; --yt-spec-text-primary: #f0ccff !important; }
        `,
        "Pink": `
            html { --yt-spec-general-background-a: #1a0010 !important; --yt-spec-general-background-b: #33001a !important; --yt-spec-text-primary: #ffd6e6 !important; }
        `,
        "White": `
            html { --yt-spec-general-background-a: #e6e6e6 !important; --yt-spec-general-background-b: #f2f2f2 !important; --yt-spec-text-primary: #000 !important; }
        `,
        "Black": `
            html { --yt-spec-general-background-a: #000 !important; --yt-spec-general-background-b: #111 !important; --yt-spec-text-primary: #fff !important; }
        `
    };

    const styleEl = document.createElement("style");
    document.head.appendChild(styleEl);

    function applyTheme(themeName) {
        if (!themes[themeName]) return;
        styleEl.innerHTML = themes[themeName];
        localStorage.setItem("ytRainbowTheme", themeName);
    }

    // Load saved theme
    const saved = localStorage.getItem("ytRainbowTheme") || "Red";
    applyTheme(saved);

    // Create GUI
    const gui = document.createElement("div");
    gui.id = "yt-theme-switcher";
    gui.innerHTML = `<b>🎨 Themes</b><br>` + 
        Object.keys(themes).map(t => `<button data-theme="${t}">${t}</button>`).join(" ");
    document.body.appendChild(gui);

    GM_addStyle(`
        #yt-theme-switcher {
            position: fixed;
            top: 100px;
            left: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 8px;
            z-index: 999999;
            font-size: 14px;
            user-select: none;
            cursor: move;
        }
        #yt-theme-switcher button {
            margin: 2px;
            padding: 5px 8px;
            background: #333;
            color: white;
            border: 1px solid #555;
            border-radius: 4px;
            cursor: pointer;
        }
        #yt-theme-switcher button:hover {
            background: #555;
        }
        @media (max-width: 600px) {
            #yt-theme-switcher {
                top: 60px;
                left: 10px;
                font-size: 12px;
                padding: 6px;
            }
            #yt-theme-switcher button {
                padding: 3px 5px;
                font-size: 12px;
            }
        }
    `);

    // Draggable GUI
    let isDragging = false, offsetX, offsetY;
    gui.addEventListener("mousedown", e => {
        isDragging = true;
        offsetX = e.clientX - gui.offsetLeft;
        offsetY = e.clientY - gui.offsetTop;
    });
    document.addEventListener("mousemove", e => {
        if (isDragging) {
            gui.style.left = (e.clientX - offsetX) + "px";
            gui.style.top = (e.clientY - offsetY) + "px";
        }
    });
    document.addEventListener("mouseup", () => isDragging = false);

    // Theme button click
    gui.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
    });
})();