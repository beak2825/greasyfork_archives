// ==UserScript==
// @name        oglaf NextPage clarifier
// @namespace   https://greasyfork.org/users/2226-adam
// @description Oglaf has stories which may have 1 or more pages. The "Next Page" button takes you to the next story if there isn't a next page, which is a bit unclear.
// @include     htt*://oglaf.com/*
// @version     1.0
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/5750/oglaf%20NextPage%20clarifier.user.js
// @updateURL https://update.greasyfork.org/scripts/5750/oglaf%20NextPage%20clarifier.meta.js
// ==/UserScript==
function main()
{
	var navlinks = $('[id=nav]');
	var nextPageLink = navlinks.children()[2];
	var nextStoryLink = navlinks.children()[4];
	if(nextPageLink.href == nextStoryLink.href)
	{
		var NoNextPageElm = document.createElement('div');
		NoNextPageElm.id="nnx";
		NoNextPageElm.className="nav_ro";
		nextPageLink.parentNode.replaceChild(NoNextPageElm, nextPageLink);
	}
}
$(document).ready(main);
