// ==UserScript==
// @name         CSM Clan Highlighter 
// @namespace    cs-manager.com
// @version      1.0
// @releasedate	 06.01.2015	
// @description  simple clan highlighting
// @author       Christian Wöhler
// @require		 http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @match        http://www.cs-manager.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7337/CSM%20Clan%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/7337/CSM%20Clan%20Highlighter.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
// Abfrage Clanname und ggf. speichern
function changeClanName()
{
    var myClanName = prompt("Bitte Clannamen angeben", "");
    if (myClanName != null) {
        localStorage.setItem("myClanName", myClanName);
    }
	return myClanName;    
}
$(function(event)
{    
    // Link im Hauptmenu einfügen (Wo geht es besser?)
    var $mainNavigation = $('<li id="nav-options"><a id="changeClanName" href="#">Changename ändern</a></li>');
    $mainNavigation.appendTo( $('#main-nav ul:first') );

    // Clanname auslesen
    var myClanName = localStorage.getItem("myClanName");
    // Wenn nicht gesetzt eingeben und speichern lassen
    if( myClanName == null)
    {
    	myClanName = changeClanName();
    }
    
    // wenn der clanname gesetzt ist, hervorheben
    if( myClanName != null)
    {
        // alle clanumschließenden spans durchlaufen
        $('span .clan_name').each(function( index ) {
  			$( "span:contains('"+myClanName+"'):last" ).css('font-weight', 'bold'); // für die Ligatabelle, die will anders nicht
            // wenn gefunden hervorheben
            if($(this).text() === myClanName)
        	{          
        		$(this).css('font-weight', 'bold');
        	}
		});
	}
    
    $('#changeClanName').on('click', function(){ changeClanName(); });
});
