// ==UserScript==
// @name Require Test Scarpt
// @version 1
// @include *.pardus.at*
// @grant GM_getResourceURL
// @grant GM_getResourceText
// @resource logo   http://static.pardus.at/img/std/opponents/space_dragon_young.png
// @resource someJs http://static.pardus.at/js/audio.js
// @require https://greasyfork.org/scripts/7341-pardusmonkey-abstraction-layer/code/PardusMonkey%20Abstraction%20Layer.js?version=30850
// @namespace www.pardus.at
// @description Tests require implementation
// @downloadURL https://update.greasyfork.org/scripts/7340/Require%20Test%20Scarpt.user.js
// @updateURL https://update.greasyfork.org/scripts/7340/Require%20Test%20Scarpt.meta.js
// ==/UserScript==

var PAL = PardusMonkey("RQUIRE TEST", "PAL54ac5239b1354");

PAL.Toast("It works!");

var img = document.createElement('img');
img.src = GM_getResourceURL("logo");
document.body.appendChild(img);

var s = GM_getResourceText("someJs");

console.log(s);