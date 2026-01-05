// ==UserScript==
// @name         joshua l rogers HIT Helper
// @namespace    http://ericfraze.com
// @version      0.2
// @description  Opens the link for "joshua l rogers".
// @author       Eric Fraze
// @match        https://www.mturkcontent.com/dynamic/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/6302/joshua%20l%20rogers%20HIT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/6302/joshua%20l%20rogers%20HIT%20Helper.meta.js
// ==/UserScript==

$(document).ready( function() {
	if ( ( $("#DataCollection > div.row.col-xs-12.col-md-12 > div.panel.panel-primary > div.panel-body > p:nth-child(2):contains('Next, go the gallery website [NOT the Artsy contact page], find the')").length )
		&& ( $("input[value='Submit']").length ) ) {
	    var url = $("#DataCollection > div.row.col-xs-12.col-md-12 > table > tbody > tr > td:nth-child(2)").text();
	    $("#DataCollection > div.row.col-xs-12.col-md-12 > table > tbody > tr > td:nth-child(2)").html("<a href='http://" + url + "'>" + url + "</a>");
	    GM_openInTab("http://" + url);
	}
});