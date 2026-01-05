// ==UserScript==
// @name        Little Blue's Forum Cleaner
// @author      LittleBlue
// @namespace   https://greasyfork.org/
// @description Properly label herp derp
// @require     http://code.jquery.com/jquery-latest.min.js
// @match       https://www.warlight.net/Forum/*
// @match       https://www.warlight.net/forum/*
// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/7093/Little%20Blue%27s%20Forum%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/7093/Little%20Blue%27s%20Forum%20Cleaner.meta.js
// ==/UserScript==

$( document ).ready( function() {
    
    var clanWolf = $( document ).find( 'a[title="The Lost Wolves"]' );
    var clanFalcon = $( document ).find( 'a[title="The Royal Falcons"]' );
    var clanWolfTable = clanWolf.parent().parent(); 
    var clanFalconTable = clanFalcon.parent().parent(); 
    var tempImage;
    var tempName
    
    for ( var i = 0; i < clanWolf.length; i++ ) {
        clanWolf.eq( i ).parent().next().text( 'Herp Derp' );
        clanWolfTable = clanWolf.eq( i ).parent().parent();
        tempImage = clanWolfTable.find( 'img:first' ).attr( "src", "http://i.imgur.com/l3LRFUI.png" );
        tempName = clanWolfTable.find( 'a' ).eq( 1 ).text( 'Derpity' );
    }
    
    for ( var i = 0; i < clanFalcon.length; i++ ) {
        clanFalcon.eq( i ).parent().next().text( 'Derp Herp' );
        clanFalconTable = clanFalcon.eq( i ).parent().parent();
        tempImage = clanFalconTable.find( 'img:first' ).attr( "src", "http://i.imgur.com/Oj9cZKC.png" );
        tempName = clanFalconTable.find( 'a' ).eq( 1 ).text( 'Herpity' );
    }
    
} );