// ==UserScript==
// @name         GGE Skip ADs
// @description  Avoid game ADs with this script
// @author       Carlitos_HD
// @version      1.0.2
// @match https://www.goodgameempire.eu/*
// @run-at document-start
// @namespace https://greasyfork.org/users/1540822
// @downloadURL https://update.greasyfork.org/scripts/556688/GGE%20Skip%20ADs.user.js
// @updateURL https://update.greasyfork.org/scripts/556688/GGE%20Skip%20ADs.meta.js
// ==/UserScript==
new MutationObserver(() => {
    const ov = document.getElementById('promoOverlay');
    if (ov) ov.remove();
}).observe(document, {childList:true, subtree:true});