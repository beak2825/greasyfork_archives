// ==UserScript==
// @name       Evan J HIT Helper
// @namespace  http://ericfraze.com
// @version    0.1
// @description  Changes the plain text URL into a google search link
// @include    https://s3.amazonaws.com/mturk_bulk/hits/*
// @include    https://www.mturkcontent.com/dynamic/hit*
// @copyright  2014+, Eric Fraze
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/5557/Evan%20J%20HIT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/5557/Evan%20J%20HIT%20Helper.meta.js
// ==/UserScript==
 $(document).ready(function() {
	var text = $("#mturk_form > p:nth-child(5) > b").text();
	var url = "https://www.google.com/search?q=" + encodeURIComponent("site:" + text + " careers");
     
    $("#mturk_form > p:nth-child(5) > b").html("<a href='" + text +"'>" + text + "</a>");
    $("#mturk_form > p:nth-child(5) > b").after("<br>Google Search: <a href='" + url +"'>" + url + "</a>");
 });