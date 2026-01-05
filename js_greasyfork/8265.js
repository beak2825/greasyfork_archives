// ==UserScript==
// @name       Sergey Mark Relevant Images Assist
// @version    1.3
// @author	   jawz
// @description  Adds buttons to select all.
// @match	   https://s3.amazonaws.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/8265/Sergey%20Mark%20Relevant%20Images%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/8265/Sergey%20Mark%20Relevant%20Images%20Assist.meta.js
// ==/UserScript==

if (document.getElementsByTagName("h1")[0].innerHTML.indexOf('Visual Relevance of "Video Frames" and "Search Queries"') !== -1)
	run();

function run() {
    $('h1:contains("Visual Relevance of ")').parent().hide();
    $('h1:contains("Examples")').parent().hide();
    $('h1:contains("Query")').hide();
    //$('ul:contains("Youtube")').hide();
    
	var btn0 = document.createElement("BUTTON");
	btn0.innerHTML = "Not Sure";
	btn0.type = "button";
	btn0.onclick = function() { selectAll("#sortable_notsure_"); }

	var btn1 = document.createElement("BUTTON");
	btn1.innerHTML = "Not Relevant";
	btn1.type = "button";
	btn1.onclick = function() { selectAll("#sortable_nomatch_"); }

	var btn2 = document.createElement("BUTTON");
	btn2.innerHTML = "Relevant";
	btn2.type = "button";
	btn2.onclick = function() { selectAll("#sortable_partialmatch_"); }

	var btn3 = document.createElement("BUTTON");
	btn3.innerHTML = "Very Relevant";
	btn3.type = "button";
	btn3.onclick = function() { selectAll("#sortable_fullmatch_"); }

    
	var ttable = document.getElementById("images_tbl")
	ttable.parentNode.insertBefore(btn0,ttable)
	ttable.parentNode.insertBefore(btn1,ttable)
	ttable.parentNode.insertBefore(btn2,ttable)
	ttable.parentNode.insertBefore(btn3,ttable)
}

function selectAll(ID) {
    for (i=0;i<25;i++) {
        var sel = ID + i;
        $(sel).trigger('click');
    }
}
