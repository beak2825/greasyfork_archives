// ==UserScript==
// @name         Open in AllTrails
// @namespace    alltrails-opener
// @version      1.2
// @description  Open AllTrails links in iOS App
// @match        https://www.alltrails.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549188/Open%20in%20AllTrails.user.js
// @updateURL https://update.greasyfork.org/scripts/549188/Open%20in%20AllTrails.meta.js
// ==/UserScript==

setInterval(() => {
    const linkElement = document.querySelector('a[href*="app.link"]');
    if (linkElement) {
        location.href = decodeURIComponent(new URL(linkElement.href).searchParams.get('$ios_deeplink_path'));
    }
}, 5000);
