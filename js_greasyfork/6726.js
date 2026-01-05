// ==UserScript==
// @name           FJ Alt Manager ALPHA
// @description    Allows relogging to alts
// @author         posttwo (Post15951)
// @include        *funnyjunk.com*
// @exclude        *funnyjunk.com/sfw_mod/*
// @version        0.1
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js

// @namespace https://greasyfork.org/users/3806
// @downloadURL https://update.greasyfork.org/scripts/6726/FJ%20Alt%20Manager%20ALPHA.user.js
// @updateURL https://update.greasyfork.org/scripts/6726/FJ%20Alt%20Manager%20ALPHA.meta.js
// ==/UserScript==

$(document).ready(function ()
{
	$(".userbarBttn").append('<input type="text" id="dorkALotta" style="margin-top: 5px; width: 170px; height: 19px; background: #606060; border: 1px solid black; border-radius: 4px; padding: 4px 5px 0 5px; color: #fff;">');
	$("#dorkALotta").keyup(function (e) {
    if (e.keyCode == 13) {
			var username = $("#dorkALotta").val();
			var passwordALTs = '';
			var passwordJOSH = '';
			
			var usePassword = passwordALTs
			if(username == 'joshlol')
				usePassword = passwordJOSH;
			users.showLoginForm();
				$('input[name="username"]').val(username);
				$('input[name="password"]').val(usePassword);
				$("span:contains('Login')").click();
		}
	});
    

});