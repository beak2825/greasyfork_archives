// ==UserScript==
// @name         Livemap Leaflets Disabler
// @namespace    waze-livemap-lld
// @version      1.1.1
// @description  Disables Waze Livemap leaflets.
// @author       FZ69617
// @match        https://www.waze.com/livemap*
// @match        https://www.waze.com/*/livemap*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9272/Livemap%20Leaflets%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/9272/Livemap%20Leaflets%20Disabler.meta.js
// ==/UserScript==

console.log('Livemap Leaflets Disabler started...');
var style = document.createElement('style');
style.innerHTML = '#map .leaflet-marker-icon, .leaflet-marker-shadow { display: none; }';
document.getElementById('map').appendChild(style);
