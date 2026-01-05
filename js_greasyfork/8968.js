// ==UserScript==
// @name           Bugmenot Button 2015
// @namespace      BB2014
// @version        3.0.1
// @description    Adds menu button that opens the Bugmenot user/password page for the current site you are visiting.
// @run-at         document-start
// @include        *
// @include        http://bugmenot.com/*
// @grant          GM_registerMenuCommand
// @author         drhouse
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/datejs/1.0/date.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/tinysort/2.2.2/tinysort.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment.min.js
// @icon           http://bugmenot.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/8968/Bugmenot%20Button%202015.user.js
// @updateURL https://update.greasyfork.org/scripts/8968/Bugmenot%20Button%202015.meta.js
// ==/UserScript==

GM_registerMenuCommand("BugMeNot Button", function() {
	location.replace("javascript:("+ function() {
		window.open('http://www.bugmenot.com/view/'+window.location.host+'#content', '_blank', 'width=500,height=400,menu=no');
	} + ")()");
});


if (location.href.toString().indexOf("bugmenot.com") != -1) {
	$(document).ready(function () {

		function formatDate(d) {
			var dd = d.getDate();
			var mm = d.getMonth()+1;
			var yy = d.getFullYear() % 100;
			yy = 2000 + yy;

			return yy+'-'+mm+'-'+dd;
		}

		$("#content > article > dl > dd.stats > ul > li:nth-child(3)").text(function(index, text) {
			var x = text.replace('old', 'ago');
			x = x.replace(x, Date.parse(x));
			x = x.replace('(Eastern Daylight Time)', '');
			x = x.replace('(Eastern Standard Time)', '');
			var d = new Date(x);
			return x.replace(x,formatDate(d));
		});

		a = $('#share-it').detach();
		b = $('#content > h2').detach();   
		c = $('#content > ul').detach();
		d = $('#page > footer').detach();

		tinysort.defaults.order = 'desc';
		tinysort('#content > article ',{selector:'#content > article > dl > dd.stats > ul > li:nth-child(3)'});

		a.appendTo("#content");
		b.appendTo("#content");
		c.appendTo("#content");
		d.appendTo("#content");

		$("#content > article > dl > dd.stats > ul > li:nth-child(3)").text(function(index, text) {
			var day = new Date(text);
			var dayWrapper = moment(day).fromNow();
			return text.replace(text, dayWrapper) + ' |  ' + text;
		});

	});
}