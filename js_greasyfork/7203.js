// ==UserScript==
// @name	lumberJocks projects images downloader
// @version 1.0.1
// @copyright	albworkshop.fr
// @namespace  http://lumberjocks.com/
// @description Able you to download LumberJocks projects image in large size.
// @include http://lumberjocks.com/projects/*
// @grant	none
// @downloadURL https://update.greasyfork.org/scripts/7203/lumberJocks%20projects%20images%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/7203/lumberJocks%20projects%20images%20downloader.meta.js
// ==/UserScript==

/** Changelog ---------------

1.0.1 (2014-12-28)
		- using the sidebar to display download links
		- adding style & title to identify links
		- publish this script on internet (http://www.albworkshop.fr)

*/

function createImagesLinks() {
	//console.debug('executing lumberJock projects image grabber');

	var BASEPATH = 'http://lumberjocks.com/assets/pictures/projects/';
	var main = document.getElementById('project-sidebar');
	if(main != null) {

		var clearer = document.createElement('div');
		clearer.style.clear = "both";
		main.appendChild(clearer);
		
		var title = document.createElement('h2');
		title.innerHTML = "Download project images"
		main.appendChild(title);

		var newDiv = document.createElement('div');
		newDiv.setAttribute('class', 'sidebar-box');
		main.appendChild(newDiv);

		var imgLinks = document.getElementsByClassName('thumbs')[0].childNodes;
		console.debug('imgLinks :', imgLinks);

		var pathStrings = '';
		for(var i = 0; i<imgLinks.length; i++) {
			var a = imgLinks[i];

			if(a != undefined && a.tagName == "A") {
				console.debug('node index:',i, ' ', a);
//				var onclickStr = a.onclick.toString();
				var onclickStr = a.getAttribute('onclick');
				console.debug('onclickStr :', onclickStr);
				var matches = onclickStr.match(/(projects\/)([0-9]+)(-438x)/);
				if(matches != null) {
					pathStrings += '<a href="' + BASEPATH + matches[2] + '.jpg' + '">image ' + i + '</a><br /> ';
				}
			}
		}

		newDiv.innerHTML = pathStrings + ' <br />';
	} else {
		console.debug('rien a faire');
	}
}


createImagesLinks();



