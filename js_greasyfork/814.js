// ==UserScript==
// @name            Yarolds Exchange Cycler V2
// @namespace       Yarolds
// @description     Cycles between the exchange pages
// @include         http://swle.yarold.eu/main.php?s=-1
// @include         http://swle.yarold.eu/history.php#tab1
// @include         http://swle.yarold.eu/dynasty_ex.php?s=3
// @version         1.0.1
// @copyright       2012+, DemonicJ & the crazy crew from The Mob
// @homepage	    http://swle.yarold.eu
// @downloadURL https://update.greasyfork.org/scripts/814/Yarolds%20Exchange%20Cycler%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/814/Yarolds%20Exchange%20Cycler%20V2.meta.js
// ==/UserScript==

// Update the following array with your own urls, these should match the @include lines above
var cycleUrls = new Array('http://swle.yarold.eu/main.php?s=-1','http://swle.yarold.eu/history.php#tab1','http://swle.yarold.eu/dynasty_ex.php?s=3');
var cycleDuration = 10000;  // 10 seconds, change to suit your needs
var redirectUrl;

for (var i = 0; i < cycleUrls.length; i++)
{
	if (location.href == cycleUrls[i])
	{
		redirectUrl = (i + 1 < cycleUrls.length) ? cycleUrls[i + 1] : redirectUrl = cycleUrls[0];
		setTimeout(urlCycle,cycleDuration);
	}
}

function urlCycle()
{
	location.href = redirectUrl;
}