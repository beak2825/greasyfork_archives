// ==UserScript==
// @name        SearchGoogleWithSwagbucks
// @namespace   shatranjkakhiladi
// @description Searches Google when searched on Swagbucks
// @include     http://www.swagbucks.com/*q=*
// @include     https://www.swagbucks.com/*q=*
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9995/SearchGoogleWithSwagbucks.user.js
// @updateURL https://update.greasyfork.org/scripts/9995/SearchGoogleWithSwagbucks.meta.js
// ==/UserScript==

var url = window.location.href.toLowerCase();
var title = document.title;
var googleTab = null;
var SECONDS_TO_KEEP_GOOGLE_PAGE = 3;

function getQuerystring(key, default_)
{
  if (default_===null) default_="";
  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
  var qs = regex.exec(window.location.href);
  if(qs === null)
	return default_;
  else
	return qs[1];
}


function SearchGoogle()
{
	var swagbucksSearchQuery = getQuerystring('q');
	googleTab = window.open("https://www.google.com/search?q=" + swagbucksSearchQuery + "&ie=utf-8&oe=utf-8");
	if(googleTab)
		window.setTimeout(function() { googleTab.close(); }, SECONDS_TO_KEEP_GOOGLE_PAGE * 1000);
}

 
window.setTimeout(SearchGoogle, 1000);

