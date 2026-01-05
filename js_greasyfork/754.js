// ==UserScript==
// @name        KG - upload: add [img] tags
// @description adds link to auto tag image URLs
// @namespace   KG
// @include     http*://*karagarga.in/upload.php*
// @grant	none
// @version     0.4
// @downloadURL https://update.greasyfork.org/scripts/754/KG%20-%20upload%3A%20add%20%5Bimg%5D%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/754/KG%20-%20upload%3A%20add%20%5Bimg%5D%20tags.meta.js
// ==/UserScript==

var d = document.getElementsByName("descr")[0];

if (d && d.type != 'hidden') {  // only run on second step of upload.php

	 var code = 'javascript: '
		 + 'var d = document.getElementsByName("descr")[0];'
		 + 'd.value = d.value.replace(/^\\s+(?=http)/gim, "");'		 
		 + 'd.value = d.value.replace(/(https?:\\S*?\\S\\.(png|jpg|jpeg|gif))/gi, "[img]$1[/img]\\n");'
		 + 'return false;'
		 ;
	 
	 var tagImg = document.createElement("a");
	 tagImg.setAttribute("onclick", code);
	 tagImg.textContent = "Add [IMG][/IMG] tags";
	 tagImg.href = "#";
	 
	 d.parentNode.insertBefore(tagImg, d.nextSibling);
}