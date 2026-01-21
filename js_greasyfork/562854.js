// ==UserScript==
// @name        hotkey : for input search box
// @namespace   Violentmonkey Scripts
// @match       *://www.youtube.com/*
// @match       *://m.youtube.com/*
// @match       *://www.youtube-nocookie.com/*
// @grant       none
// @version     20260120.16.52
// @author      thomaslinux
// @description 16/01/2026 11:19:00
// @downloadURL https://update.greasyfork.org/scripts/562854/hotkey%20%3A%20for%20input%20search%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/562854/hotkey%20%3A%20for%20input%20search%20box.meta.js
// ==/UserScript==
document.addEventListener('keydown', function(event) {
    if (event.key === ':') {
        const input = document.querySelector('.ytSearchboxComponentInput');
        if (input) {
            input.click();
            input.dispatchEvent(new Event('change')); // alternative to input.focus compatible with the site functions associated to a click
            event.preventDefault();
        }
    }
});
