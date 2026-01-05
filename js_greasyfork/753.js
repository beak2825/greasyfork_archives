// ==UserScript==
// @name        whatimg - add [img] tags
// @namespace   diff
// @description you need to set 'upload layout' to boxed in whatimg settings
// @include     https://whatimg.com/
// @include     https://whatimg.com/upload.php
// @require     https://greasyfork.org/scripts/1003-wait-for-key-elements/code/Wait%20for%20key%20elements.js?version=2765
// @version     0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/753/whatimg%20-%20add%20%5Bimg%5D%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/753/whatimg%20-%20add%20%5Bimg%5D%20tags.meta.js
// ==/UserScript==

// using waitForKeyElements.js so this works with the drag'n'drop upload script: http://userscripts.org/scripts/show/105520

function doit() {
	var a = document.querySelector('textarea.input_field');
	var output = "";
	
	if (a) {
		var list = a.value.match(/(https?:\S*?\S\.(png|jpg|jpeg|gif))$/gim);
		for (i=0; i<list.length; i++) {
			output += "[img]" + list[i] + "[/img]\n";
		}
		
		a.value = a.value.replace(/^\s+(?=http)/gim, ""); // remove leading space from original links
		
		a.value += "\n[img] tags only:\n" + output;
	}
}

waitForKeyElements ("textarea.input_field", doit);