// ==UserScript==
// @name         Close Chat and Theater Mode on StreamEast
// @namespace    tampermonkey.net
// @version      0.11
// @description  Automatically clicks the close chat button and goes theater mode at streameast.ga
// @author       Van Inhalin
// @match        *://streameast.ga/*
// @match        *://*.streameast.ga/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/558167/Close%20Chat%20and%20Theater%20Mode%20on%20StreamEast.user.js
// @updateURL https://update.greasyfork.org/scripts/558167/Close%20Chat%20and%20Theater%20Mode%20on%20StreamEast.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById("close-chat-button").click();
    document.querySelector(".theater-mode-btn").click();


})();
