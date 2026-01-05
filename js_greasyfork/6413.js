// ==UserScript==
// @name        kyomh Image Link
// @namespace   http://allencch.wordpress.com
// @description Generate image link
// @include     http://*.kyomh.com/comic/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6413/kyomh%20Image%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/6413/kyomh%20Image%20Link.meta.js
// ==/UserScript==



function padZero(num,width) {
	s = num.toString();
	while(s.length<width)
		s = "0" + s;
	return s;
}

function getImageLink() {
	return document.getElementById('Img').src;
}

function getNumPages() {
	var length = document.getElementsByName('select2')[0].children.length;
	return length;
}

window.generateLink = function() {
	var mainDiv,newElement;	
	var mainDivs = document.getElementsByClassName('page');
	mainDiv = mainDivs[mainDivs.length -1];
	
	if(mainDiv) {
		newElement = document.createElement('div');
		newElement.setAttribute('id','gm_elem');
		newElement.setAttribute('style','text-align:center');
		mainDiv.parentNode.insertBefore(newElement,mainDiv.nextSibling);
	}
	
	var gmElem = document.getElementById('gm_elem');
	
	//Generate all the links element
	var myLinks = new Array();
	var myText = new Array();
	
	var numPages = getNumPages();
	var link = getImageLink();
	
	var path = link.substring(0,link.lastIndexOf('/')+1);
	var filename = link.substring(link.lastIndexOf('/')+1);
	
	var match = filename.match(/[^\d]*?(\d+)\./);	
	var width = match[1].length;

	
	//var suffix = filename.substring(filename.lastIndexOf('.'));
	//var width = filename.length - 4; //-4 for image suffix
	
	for(var i=0;i<numPages;i++) {
		var regex = new RegExp(match[1]);
		myLinks[i] = path + filename.replace(regex,padZero(i+1,width));

		//myLinks[i] = getImageLink(i+1);
		//myLinks[i] = path + padZero(i+1,width) + suffix;
		myText[i] = '<a target="_blank" href="'+myLinks[i]+'">'+padZero(i+1,3)+'</a> ';
	}
	
	if(gmElem){
		gmElem.innerHTML = '<hr>';
		for(var i=0;i<numPages;i++) {
			gmElem.innerHTML += myText[i];
			if((i+1)%20 == 0)
				gmElem.innerHTML += '<br/>';
		}
		gmElem.innerHTML += 'end';
	}
}

window.setTimeout(function() {
		generateLink();
},0.5*1000);