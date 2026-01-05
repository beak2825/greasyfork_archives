// ==UserScript==
// @name       fakku
// @version     1.0.0
// @description     remove all but #image    
// @namespace     https://greasyfork.org/users/3159      
// @include     http*://www.fakku.net/*/*/read*
// @downloadURL https://update.greasyfork.org/scripts/8750/fakku.user.js
// @updateURL https://update.greasyfork.org/scripts/8750/fakku.meta.js
// ==/UserScript==
document.location.hash = "#page=1";
i = document.getElementById('image');
t = document.title;
document.body.innerHTML = '';
document.head.innerHTML = '<title>' + t + '</title><style>body{margin:0;overflow:hidden}.current-page{height:100vh !important;position:absolute;margin-left:auto;margin-right:auto;left:0;right:0}</style>';
document.body.appendChild(i);
document.addEventListener("keydown", function (e) {
	switch (e.which) {
	case 39:
		if (i.style.display != "none") {
			n = document.location.hash.split('=')[1].valueOf();
			n++;
			document.location.hash = "page=" + n;
		}
		break;
	case 37:
		history.go(-1);
		break;
	}
});