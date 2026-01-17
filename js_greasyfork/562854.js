// ==UserScript==
// @name        : to focus the search box
// @namespace   Violentmonkey Scripts
// @match       youtube.com/*
// @grant       none
// @version     1.0
// @author      thomaslinux
// @description 16/01/2026 11:19:00
// @downloadURL https://update.greasyfork.org/scripts/562854/%3A%20to%20focus%20the%20search%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/562854/%3A%20to%20focus%20the%20search%20box.meta.js
// ==/UserScript==
document.addEventListener('keydown', function(event) {
    if (event.key === ':') {
        const input = document.querySelector('.ytSearchboxComponentInput');
        if (input) {
            input.focus();
            event.preventDefault(); // Empêche le comportement par défaut de la touche si nécessaire
        }
    }
});
