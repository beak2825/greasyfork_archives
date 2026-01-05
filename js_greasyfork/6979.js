// ==UserScript== 
// @name          TheTechgame Refresh
// @include       http://www.thetechgame.com/Members_Shout.html 
// @namespace     Everyone
// @description   Refreshes shoutbox 
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @version       1.0
// @grant         GM_info 	
// @downloadURL https://update.greasyfork.org/scripts/6979/TheTechgame%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/6979/TheTechgame%20Refresh.meta.js
// ==/UserScript==   


$(window).ready (function() { 
    timer = setTimeout(function(){window.location.reload(1);}, 300000);
})