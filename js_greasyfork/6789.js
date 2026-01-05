// ==UserScript==
// @name            Next Previous Buttons
// @description     Hi all my fellow bronies
// @include         *funnyjunk.com/comment/anonymous/user/*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version 0.0.1.20141204175510
// @namespace https://greasyfork.org/users/3806
// @downloadURL https://update.greasyfork.org/scripts/6789/Next%20Previous%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/6789/Next%20Previous%20Buttons.meta.js
// ==/UserScript==
$(document).ready(function(){
        $("<input>",
		{
			value: "Prev <----",
			type: "button",
     	    class: "greenButton",
            onclick: "window.location = 'http://funnyjunk.com/comment/anonymous/user/' + (contentId - 1)"
		}).appendTo("#main");
    	 $("<input>",
		{
			value: "----> Next",
			type: "button",
     	    class: "greenButton",
            onclick: "window.location = 'http://funnyjunk.com/comment/anonymous/user/' + (contentId + 1)"
		}).appendTo("#main");
});