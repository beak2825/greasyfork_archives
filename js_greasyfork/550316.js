// ==UserScript==
// @name         TMN iFrame
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  TMN iFrame Setup
// @author       Pap
// @license      MIT
// @match        https://www.tmn2010.net/authenticated/crimes.aspx*
// @match        https://www.tmn2010.net/authenticated/playerproperty.aspx?p=g&cleanup
// @match        https://www.tmn2010.net/authenticated/jail.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmn2010.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550316/TMN%20iFrame.user.js
// @updateURL https://update.greasyfork.org/scripts/550316/TMN%20iFrame.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self == window.top) {
        return;
    }

    const $divContentIn = $("#divContentIn");
    $divContentIn.parent().prevAll().hide();
    $divContentIn.parent().nextAll().hide();
    $divContentIn.parent().parent().prevAll().hide();
    $divContentIn.parent().parent().nextAll().hide();
    $divContentIn.parent().width("100%");
    $divContentIn.parent().css("left", "0");
    $divContentIn.parent().css("top", "0");
    $divContentIn.parent().css("bottom", "0");
})();