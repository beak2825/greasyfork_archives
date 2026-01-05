// ==UserScript==
// @name         UNDYING!
// @namespace    dentarthurdent
// @version      1
// @description  Changes the flavor text on a button in the Kingdom of Loathing.
// @include      http://www.kingdomofloathing.com/choice.php*
// @include      http://127.0.0.1:*/choice.php*
// @include      http://localhost:*/choice.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8166/UNDYING%21.user.js
// @updateURL https://update.greasyfork.org/scripts/8166/UNDYING%21.meta.js
// ==/UserScript==


var inputs = document.getElementsByTagName('input');
for (var j = 0; j < inputs.length; ++j)
{
	if( inputs[j].value.search("Go right back to the fight!") >= 0 )
	{
		inputs[j].value = inputs[j].value.replace( "Go right back to the fight!", "UNDYING!" );
		break;
	}
	if( inputs[j].value.search("Return to the fight!") >= 0 )
	{
		inputs[j].value = inputs[j].value.replace( "Return to the fight!", "UNDYING!" );
		break;
	}
}
