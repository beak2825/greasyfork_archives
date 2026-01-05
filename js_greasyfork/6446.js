// ==UserScript==
// @name          Alargador de minimapa
// @include       http://kube.es.muxxu.com/*
// @description   Alarga el minimapa para ver un poco más allá.
// @version 0.0.1.20141113235108
// @namespace https://greasyfork.org/users/6838
// @downloadURL https://update.greasyfork.org/scripts/6446/Alargador%20de%20minimapa.user.js
// @updateURL https://update.greasyfork.org/scripts/6446/Alargador%20de%20minimapa.meta.js
// ==/UserScript==

if (document.getElementById('minimap') != null) {
	document.getElementById('minimap').width = 650;
}
