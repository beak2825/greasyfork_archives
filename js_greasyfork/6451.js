// ==UserScript==
// @name        What.cd add Wiki and Collage search boxes
// @description Add Wiki and Collage search boxes to What.cd
// @namespace   funeral_meat
// @include     http*://*what.cd/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6451/Whatcd%20add%20Wiki%20and%20Collage%20search%20boxes.user.js
// @updateURL https://update.greasyfork.org/scripts/6451/Whatcd%20add%20Wiki%20and%20Collage%20search%20boxes.meta.js
// ==/UserScript==

searchbars = document.querySelectorAll("#searchbars ul");

//Wiki
$(searchbars) //uncomments existing code
	.contents()
	.filter(function(){return this.nodeType === 8;}) //get the comments
	.replaceWith(function(){return this.data;})

	
//Collages
forumsHTML = searchbars[0].children[3].innerHTML; // copy html code from forums box and substitute text
collagesHTML = forumsHTML.replace(/forums/g, "collages").replace(/Forums/g, "Collages");

searchbars[0].innerHTML += collagesHTML;

//add sorting args
orderingHTML = '<input name="order_by" value="Name" type="hidden"><input name="order_way" value="Ascending" type="hidden">';
document.getElementById("collagessearch").previousElementSibling.outerHTML += orderingHTML;