// ==UserScript==
// @name         CH Anti-LinkBlocker
// @namespace    http://your.homepage/
// @version      0.2
// @description  Fuck CH.
// @author       SwaggMan
// @match        http://www.collegehumor.com/*
// @grant        none
// @require 	 https://code.jquery.com/jquery-2.1.3.min.js
// @require		 https://code.jquery.com/ui/1.11.3/jquery-ui.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/8146/CH%20Anti-LinkBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/8146/CH%20Anti-LinkBlocker.meta.js
// ==/UserScript==

$("head").append (
    '<link '
  + 'href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/themes/smoothness/jquery-ui.min.css" '
  + 'rel="stylesheet" type="text/css">'
);

$("body").append("<div id=\"gmOverlayDialog\"><form><input type=\"text\" name=\"url\" id=\"url\" class=\"text ui-widget-content ui-corner-all\" size=\"38\" /></form></div>");

var images = $(".blankimg");

images.bind("dblclick", function() {
    
    $("#gmOverlayDialog").dialog({
    modal:         false,
    title:         "Image URL",
    minWidth:      400,
    minHeight:     50,
    zIndex:        3666,
    closeOnEscape: true
	})
	.dialog("widget").draggable("option", "containment", "none");
    
    $("#gmOverlayDialog #url").attr("value", images.next().attr("src")).select();
});