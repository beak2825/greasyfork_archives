// ==UserScript==
// @name         GGE Hide Support Hidden Icon
// @description  Avoid the hidden icon taking up space
// @author       Carlitos_HD
// @version      1.0.0
// @match https://www.goodgameempire.eu/*
// @run-at document-start
// @namespace https://greasyfork.org/users/1540822
// @downloadURL https://update.greasyfork.org/scripts/558645/GGE%20Hide%20Support%20Hidden%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/558645/GGE%20Hide%20Support%20Hidden%20Icon.meta.js
// ==/UserScript==
new MutationObserver(() => {
    const iframe = document.getElementById('hs-web-sdk-iframe-launcher');
    if (iframe) iframe.remove();
}).observe(document, {childList:true, subtree:true});