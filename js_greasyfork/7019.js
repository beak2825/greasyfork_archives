// ==UserScript==
// @name        KoL Crimbot Image Stabilizer
// @namespace   http://greasyfork.org
// @include     http://127.0.0.1:*/choice.php*
// @include     http://localhost:*/choice.php*
// @include     http://www.kingdomofloathing.com/choice.php*
// @version     3
// @grant       none
// @require	http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @description "Stabilize" the image of the Crimbot in the Crimbot Factory
// @downloadURL https://update.greasyfork.org/scripts/7019/KoL%20Crimbot%20Image%20Stabilizer.user.js
// @updateURL https://update.greasyfork.org/scripts/7019/KoL%20Crimbot%20Image%20Stabilizer.meta.js
// ==/UserScript==

if( $("b:contains('Inside the Fully Automated Crimbo Factory')").length )
{
	$("div img[src^='http://images.kingdomofloathing.com/otherimages/crimbot/overlay']").remove();
	$("#driftypoo").attr("id", "nodrifty");
	$("#nodrifty").css("top", "25px").css("left", "25px");
}