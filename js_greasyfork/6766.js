// ==UserScript==
// @name        KoL Hiding Places
// @namespace   http://pekaje.homenet.org/
// @include     http://www.kingdomofloathing.com/fight.php*
// @include     http://www.kingdomofloathing.com/choice.php*
// @include     http://127.0.0.1:60080/fight.php*
// @include     http://127.0.0.1:60080/choice.php*
// @include     http://localhost:60080/fight.php*
// @include     http://localhost:60080/choice.php*
// @description Extracts "sneaky wrapping paper" hiding places and formats for wiki inclusion.
// @version     2
// @grant       none
// @require	http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/6766/KoL%20Hiding%20Places.user.js
// @updateURL https://update.greasyfork.org/scripts/6766/KoL%20Hiding%20Places.meta.js
// ==/UserScript==

var genericplaces = [
"under a recliner",
"behind a nightstand",
"in the cushions of a couch",
"behind a tree",
"in a mailbox",
"buried near a tree",
"under a rock",
"behind a stalactite",
"behind a stalagmite",
"in a darkened cranny",
"inside a conch shell",
"under an anemone",
"behind a clownfish",
"in a barnacle",
"in a sunken chest"
];

if ( $( "a:contains('Adventure Again')" ).length )
{
	$.get( "api.php?what=status&for=KoL_Hiding_Places", function ( data )
		{
			var charinfo = JSON.parse( data );
			var uselink = document.location.origin + "/inv_use.php?pwd=" + charinfo.pwd + "&which=99&whichitem=7934";
			$( "a:contains('Adventure Again')" ).append( $( "<p><a href='" + uselink + "'>Hide something here</a></p>" ) );
		} );
}
if ( $( "b:contains('Hide a Gift!')" ).length )
{
	var locRe = /<center>You look around for good hiding places in ([^<]*).<p>/;
	var loc = document.body.innerHTML.match(locRe)[1];
	var sel = $( "select[name='whichhole'] > option" );
	var wikitext = "|-\n|[[" + loc + "]]";
	var maxplaces = 8;
	for ( var i = 0 ; i < sel.length; i++ )
	{
		if ( genericplaces.indexOf( sel[i].text ) == -1 )
		{
			wikitext = wikitext + "\n|" + sel[i].text;
			maxplaces--;
		}
	}
	for ( var i = 0; i < maxplaces; i++ )
	{
		wikitext = wikitext + "\n|";
	}
	$( "center > table[width='95%']" ).parent().parent().append( $("<p style='text-align:right'><div><pre>" + wikitext + "</pre></div></p>") );
}
