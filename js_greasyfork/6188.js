// showlinks.user.js
//
// ==UserScript==
// @name          showlinks
// @namespace     http://www.devoresoftware.com/gm/showlinks
// @description	Show links of page as text following the link
// @include       *
// @version			2.0
// @downloadURL https://update.greasyfork.org/scripts/6188/showlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/6188/showlinks.meta.js
// ==/UserScript==
//

function main()
{
	var anchors = document.getElementsByTagName('A');
	var len = anchors.length;
	for (var i = 0; i < len; i++)
	{
		var anchor = anchors[i];
		var hrefValue = anchor.getAttribute('href');
		var expansion = " [" + hrefValue + "] ";
		anchor.appendChild(document.createTextNode(expansion));
	}
}

main();
