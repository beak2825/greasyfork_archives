// ==UserScript==
// @name         Evoworld.io Echolocation (NOT WORKING)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Evoworld.io Echolocation | You can see in the dark (NOT WORKING)
// @author       King Belisarius IX
// @license      MIT
// @match        https://evoworld.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=evoworld.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513283/Evoworldio%20Echolocation%20%28NOT%20WORKING%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513283/Evoworldio%20Echolocation%20%28NOT%20WORKING%29.meta.js
// ==/UserScript==
 function echolocation() {
 visionType = 1;
}
setInterval(echolocation,0);


// script does not work anymore due to changes in how darkness is defined, now there is no single global variable like "visionType"that can be defined to a certain number 