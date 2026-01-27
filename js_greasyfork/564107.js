// ==UserScript==
// @name        Auto switch theme
// @namespace   Violentmonkey Scripts
// @match       *://mammouth.ai/*
// @match       *://*.simplelogin.io/*
// @match       *://*.freecodecamp.org/*
// @match       *://*.coinstats.app/*
// @match       *://*.kucoin.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 12/8/2025, 3:46:54 AM
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/564107/Auto%20switch%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/564107/Auto%20switch%20theme.meta.js
// ==/UserScript==

function applyThemeClass() {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const element = document.documentElement;
    const currentTheme = document.documentElement.dataset.theme;
    const systemTheme = isDark ? "dark" : "light";

    if (systemTheme !== currentTheme) {
        const button = document.querySelector('[data-inspector="inspector_header_theme"]');
        if (button) {
            button.click();
        }
    }

    if (isDark) {
        document.documentElement.dataset.theme="dark"
        document.documentElement.classList.replace("light", "dark");
        document.documentElement.classList.replace("light-mode", "dark-mode");
        document.body.classList.replace("light-palette","dark-palette")
    } else {
        document.documentElement.dataset.theme="light"
        document.documentElement.classList.replace("dark","light");
        document.documentElement.classList.replace("dark-mode","light-mode");
        document.body.classList.replace("dark-palette","light-palette")
    }
}

applyThemeClass();

// Listen for OS theme changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyThemeClass);