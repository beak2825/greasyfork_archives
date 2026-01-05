// ==UserScript==
// @name          EVERYTHING SPINS
// @namespace     Tattoo
// @description   You spin me right round, baby Right round like a record, baby Right round round round 
// @include       http://www.thetechgame.com/Members_Shout.html 
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @version       3
// @grant         GM_info
// @grant         GM_getValue
// @grant         GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/8627/EVERYTHING%20SPINS.user.js
// @updateURL https://update.greasyfork.org/scripts/8627/EVERYTHING%20SPINS.meta.js
// ==/UserScript==

$('body').on('DOMNodeInserted', '#chatwindow', function(e) {
  $("img[class^='vam']").addClass( "vam trollin" );
    $("marquee[direction^='right']").addClass( "vam trollin" );
             });

