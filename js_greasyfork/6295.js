// ==UserScript== 
// @name 			Pixiv Div Remover
// @namespace 		http://www.pixiv.net/ pixivdivremover/ 
// @description 	Exposes the images inside Pixiv div wrappers so they can be right-clicked again 
// @include 		http://www.pixiv.net/* https://www.pixiv.net/*
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @version 0.0.1.20141106114949
// @downloadURL https://update.greasyfork.org/scripts/6295/Pixiv%20Div%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/6295/Pixiv%20Div%20Remover.meta.js
// ==/UserScript==

var removeDivs = function(args) {
	if(args && !(args.target.id.indexOf('stacc_elemid') > -1)) {
		return;
	}

	var thumbs = document.getElementsByClassName("_layout-thumbnail");
	
	var thumbDivs = [];
	$.each(thumbs, function(index, thumb) {
		if(thumb.tagName.toLowerCase() === 'div') {
			thumbDivs.push(thumb);
		}
	});

	var children = [];	
	
	for(var i = 0; i < thumbDivs.length; i++) {
		var div = thumbDivs[i];
		var child = div.lastChild;	
		children.push(child);
		parent.removeChild(div);
		var parent = div.parentNode;
		parent.appendChild(child);	
	};

	for(index = 0; index < children.length; index++) {
		children[index].className = "_layout-thumbnail";		
	}
}

$('#stacc_timeline').bind('DOMNodeInserted', removeDivs);

removeDivs();