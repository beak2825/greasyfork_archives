// ==UserScript==
// @name        iframe F5
// @description enables F5 reload of focused iframe
// @author      DCI
// @namespace   http://redpandanetwork.org/
// @include     *
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9387/iframe%20F5.user.js
// @updateURL https://update.greasyfork.org/scripts/9387/iframe%20F5.meta.js
// ==/UserScript==

document.addEventListener( "keydown", press, false);

function press(i) {

if ( i.keyCode == 116 ) { //F5 - 
i.preventDefault();
location.reload(true);
}}