// ==UserScript==
// @name           Remove KoL Topics By Specific People
// @namespace      greasyfork.org
// @description    Removes topics posted by people listed
// @include        *forums.kingdomofloathing.com*forumdisplay.php*
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/7071/Remove%20KoL%20Topics%20By%20Specific%20People.user.js
// @updateURL https://update.greasyfork.org/scripts/7071/Remove%20KoL%20Topics%20By%20Specific%20People.meta.js
// ==/UserScript==

stuff = document.getElementsByTagName('tr');
var names = [];
// Add names here.  This is case sensitive.
names[names.length] = "name1";
names[names.length] = "NamE 2";

for(i=0;i<names.length;i++) {
	names[i] = "'_self')\">" + names[i];
}

for(i=0;i<stuff.length;i++) {
	for(j=0;j<names.length;j++) {
		if(stuff[i].innerHTML.indexOf(names[j]) > -1 ) {
			stuff[i].parentNode.removeChild(stuff[i]);
			i--;
		}
	}
}