// ==UserScript==
// @name          mTurk - Show Auto-App time & Link Turkopticon
// @author        antithought
// @description   Shows auto-approval time and links to requester on Turkopticon, on HIT preview pages.
// @match         https://www.mturk.com/mturk/accept*
// @match         https://www.mturk.com/mturk/preview*
// @match         https://www.mturk.com/mturk/continue*
// @match         https://www.mturk.com/mturk/submit
// @match         https://www.mturk.com/mturk/return*
// @require       http://code.jquery.com/jquery-latest.min.js
// @version       1.02
// @namespace     https://greasyfork.org/users/6438
// @downloadURL https://update.greasyfork.org/scripts/6135/mTurk%20-%20Show%20Auto-App%20time%20%20Link%20Turkopticon.user.js
// @updateURL https://update.greasyfork.org/scripts/6135/mTurk%20-%20Show%20Auto-App%20time%20%20Link%20Turkopticon.meta.js
// ==/UserScript==

// Based off https://userscripts-mirror.org/scripts/show/130470

this.$ = this.jQuery = jQuery.noConflict(true);

if ( document.forms[1] )
{
    if ( document.forms[1].action.search(/accept|submit/gi) != -1 ) {
        showAutoAppTime();
        showRequesterID();
    }
}

function showAutoAppTime() {
    var AutoAppTime = $('[name=hitAutoAppDelayInSeconds]').attr('value');
    var top = $(document.getElementById("qualifications.tooltip")).parent().parent();
    $(top).append($('<td class="capsule_field_title" align="right" valign="top" nowrap width="100%"><p style="color:#369;">Auto-Approval Time:&nbsp;&nbsp;</p></td>'));
    var Days  = Math.floor(AutoAppTime / (60*60*24));
    var Hours = Math.floor(AutoAppTime / (60*60)%24);
    var Mins  = Math.floor(AutoAppTime / (60)%60);
    var Secs  = AutoAppTime % 60;
    $(top).append($('<td nowrap>' +
	   (Days  == 0 ? "" : Days  + (Days  > 1 ? " days "    : " day "))    +
	   (Hours == 0 ? "" : Hours + (Hours > 1 ? " hours "   : " hour "))   + 
	   (Mins  == 0 ? "" : Mins  + (Mins  > 1 ? " minutes " : " minute ")) + 
	   (Secs  == 0 ? "" : Secs  + (Secs  > 1 ? " seconds " : " second ")) + '</td>'));
}

function showRequesterID() {
    var base = "https://turkopticon.ucsd.edu/";
    var id = $("input[name=requesterId]").attr("value");
    if (!id) {
        var src = $("[name=ExternalQuestionIFrame]").attr("src");
        var rgx = new RegExp("requesterId=([^&]+?)&", "i");
        var match = rgx.exec(src);
        if (match != null) { id = match[1]; }
    }
    document.getElementById('requester.tooltip').innerHTML = '&nbsp;<a href="' + base + (id ? id :
        "main/php_search?query=" + $(document.getElementById("requester.tooltip")).parent().next().text().trim().replace(/ /g, "+") ) + '">Requester</a>:';
}
