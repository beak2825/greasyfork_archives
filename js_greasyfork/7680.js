// ==UserScript==
// @name          Empornium Toggle All Spoilers
// @namespace     empornium.me
// @description   Toggle all spoilers on the page at the same time
// @version       1.0
// @author        Monkeys
// @include       *.empornium.me/torrents.php?id=*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/7680/Empornium%20Toggle%20All%20Spoilers.user.js
// @updateURL https://update.greasyfork.org/scripts/7680/Empornium%20Toggle%20All%20Spoilers.meta.js
// ==/UserScript==


(function(){

//this is the only code that actually runs in this script,the other functions below are for reference
function addSpoilerLink()
{//go through all links, find spoilers and all the link for toggle all spoilers
	var spoilerText = "function onclick(event) {\nBBCode.spoiler(this);\n}";
	var spoilerLink = ' &nbsp;&nbsp;&nbsp;<a onclick="(function(){var spoilers = document.getElementsByClassName(\'spoiler\'); var shownSpoilers = document.getElementsByClassName(\'spoilerShown\'); if (shownSpoilers.length > 0)	{while (shownSpoilers.length > 0) { shownSpoilers[0].className = \'spoiler hidden\';}} else {while (spoilers.length > 0)	{spoilers[0].className = \'spoilerShown\';}}})();" href="javascript:void(0);">Toggle All Spoilers</a>'
	var allLinks = document.getElementsByTagName('a');
	for (var ii = 0; ii < allLinks.length; ii++)
	{//go throughall links on page
		//console.log("Link "+allLinks[ii]);
		if (allLinks[ii].hasAttribute('onclick') && allLinks[ii].onclick.toString() == spoilerText)
		{//this link is a show spoiler link
			console.log("Link "+ii);
			allLinks[ii].nextElementSibling.insertAdjacentHTML('afterend', spoilerLink)
			ii++;
		}
	}
}

addSpoilerLink();


//none of this code is executed:
function showAll()
{//show all spoilers
	var spoilers = document.getElementsByClassName('spoiler');
	while (spoilers.length > 0)
	{
		spoilers[0].className = 'spoilerShown'; //spoilers updates every time, so [0] is always the next class
	}
}

function hideAll()
{//hide all spoilers
	var shownSpoilers = document.getElementsByClassName('spoilerShown');
	while (shownSpoilers.length > 0)
	{
		shownSpoilers[0].className = 'spoiler hidden'; //spoilers updates every time, so [0] is always the next class
	}
}

function hideShow(choice)
{//1 to show all, 0 to hide all
	if (choice) showAll();
	else hideAll();
}

function toggleHidden()
{//detect if spoilers are currently shown, and toggle the state based on that
	if (document.getElementsByClassName('spoilerShown').length > 0)
	{//spoilers are currently shown, so we hide them
		hideAll();
	}
	else
	{//spoilers are currently hidden, so we show them
		showAll();
	}
}

function clickAllSpoilers()
{//simulate clicking on all spoilers
	var spoilerText = "function onclick(event) {\nBBCode.spoiler(this);\n}";
	var allLinks = document.getElementsByTagName('a');
	for (var ii = 0; ii < allLinks.length; ii++)
	{
		if (allLinks[ii].hasAttribute('onclick') && allLinks[ii].onclick.toString() == spoilerText)
		{
			allLinks[ii].click();
		}
	}
}

})();
