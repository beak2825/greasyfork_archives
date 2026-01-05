// ==UserScript==
// @name        Frambreaker Prevention
// @namespace   pendevin
// @description adds all sandbox restrictions to iframes except allow-same-origin
// @include     *
// @version     1
// @grant       none
// @require     http://code.jquery.com/jquery-2.1.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/9211/Frambreaker%20Prevention.user.js
// @updateURL https://update.greasyfork.org/scripts/9211/Frambreaker%20Prevention.meta.js
// ==/UserScript==

//ll breaks without noconflict jquery
this.$ = this.jQuery = jQuery.noConflict(true);

$('iframe').attr('sandbox','allow-same-origin');