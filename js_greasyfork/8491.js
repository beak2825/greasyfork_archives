// ==UserScript==
// @name         PolUnblock
// @namespace    polunblock
// @version      0.14
// @description  Unblock pol.dk
// @author       UnBlocker
// @include      http://politiken.dk/*
// @include      https://politiken.dk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8491/PolUnblock.user.js
// @updateURL https://update.greasyfork.org/scripts/8491/PolUnblock.meta.js
// ==/UserScript==

    var sheet = (function () {
        var style = document.createElement("style");

        // WebKit hack :(
        style.appendChild(document.createTextNode(""));

        // Add the <style> element to the page
        document.head.appendChild(style);

        return style.sheet;
    })();

    sheet.insertRule("#meteroverlay { display: none !important; }", 0);
    sheet.insertRule("#teaserwrapper { display: none !important; }", 0);
    sheet.insertRule(".cookie-warning { display: none !important; }", 0);
    sheet.insertRule(".dit-modal-overlay--transparent { display: none !important; }", 0);
    sheet.insertRule(".not-logged-in { display: none !important; }", 0);
    sheet.insertRule("body { overflow-y: scroll !important; }", 0);
    sheet.insertRule(" body > div { display: none !important; }", 0);
    sheet.insertRule(" body > div#content { display: block !important; }", 0);
    sheet.insertRule(" body > div.main-header{ display: block !important; }", 0);