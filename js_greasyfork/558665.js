// ==UserScript==
// @name         Reddit Match System Theme
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Change Reddit theme according to your system preferences dynamically
// @author       MattD
// @license      MIT
// @match        https://*.reddit.com/*
// @icon         https://www.redditstatic.com/shreddit/assets/favicon/64x64.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558665/Reddit%20Match%20System%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/558665/Reddit%20Match%20System%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const switchTheme = () => {
        if (window.matchMedia('(prefers-color-scheme: light)').matches && document.documentElement.classList.contains("theme-dark")) {
            document.documentElement.classList.add("theme-light")
            document.documentElement.classList.remove("theme-dark")
            console.log(`Reddit Match System Theme : Switched to light`);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches && document.documentElement.classList.contains("theme-light")) {
            document.documentElement.classList.add("theme-dark")
            document.documentElement.classList.remove("theme-light")
            console.log(`Reddit Match System Theme : Switched to dark`);
        }
    }
    const init = () => {
        console.log(`Reddit Match System Theme Init`);
        let timer = null;
        new MutationObserver(() => {
            clearTimeout(timer);
            timer = setTimeout(() => {switchTheme()}, 200);
        }).observe(document.body, {childList: true, subtree: true, attributes: true, characterData: true});
        new MutationObserver(() => {
            switchTheme();
        }).observe(document.querySelector("title"), { childList: true });
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', switchTheme);
    };
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
})();