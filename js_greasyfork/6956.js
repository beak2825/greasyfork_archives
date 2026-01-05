// ==UserScript==
// @name           Wikimapia CenterCrossCutter
// @description    Удаление центрального крестика на картах Викимапии
// @icon           http://wikimapia.org/favicon.ico
// @include        http*://*wikimapia.org/*
// @grant          none
// @version 0.0.1.20141212214624
// @namespace https://greasyfork.org/users/7568
// @downloadURL https://update.greasyfork.org/scripts/6956/Wikimapia%20CenterCrossCutter.user.js
// @updateURL https://update.greasyfork.org/scripts/6956/Wikimapia%20CenterCrossCutter.meta.js
// ==/UserScript==

var link = document.getElementById("map-center-cross");
link.parentNode.removeChild(link);