// ==UserScript==
// @name ImageZoom
// @author ElDoRado1239
// @description [Maxthon] Autofits images in separate tabs to fill the window and enables you to zoom with the mousewheel. Doubleclick the image to reset the size.
// @version 1.0
// @grant none
// @include *.jpg*
// @include *.JPG*
// @include *.jpeg*
// @include *.JPEG*
// @include *.png*
// @include *.PNG*
// @include *.gif*
// @include *.GIF*
// @include *.bmp*
// @include *.BMP*
// @namespace https://greasyfork.org/users/6103
// @downloadURL https://update.greasyfork.org/scripts/5812/ImageZoom.user.js
// @updateURL https://update.greasyfork.org/scripts/5812/ImageZoom.meta.js
// ==/UserScript==

var img;
setTimeout(init,100);

function init(){
	img = document.getElementById('img_elem');
	if(img.naturalWidth==0){setTimeout(init,100);return;}
	var s = document.title;
	if(s.indexOf(img.src.substr(img.src.lastIndexOf('/')+1))==-1 || s.indexOf(img.naturalWidth+'')==-1 || s.indexOf(img.naturalHeight+'')==-1) return;
	img.id = "img";
	img.class = "";
	img.style["-webkit-backface-visibility"] = "hidden";
	img.style["position"] = "absolute";
	img.style["left"] = "0px";
	img.style["top"] = "0px";
	document.ondblclick = fit;
	document.addEventListener('mousewheel',mouseWheel,false);
	document.getElementById('scroll_v').outerHTML = '';
	document.getElementById('scroll_h').outerHTML = '';
	window.addEventListener('resize',fit,false);
	window.addEventListener('change',fit,false);
	fit();
}
function mouseWheel(e){
	var ratio = img.naturalHeight/img.naturalWidth;
	var prewidth = img.width;
	var preheight = img.height;
	if(e.wheelDelta > 0){
		img.style.width = parseInt(img.style.width)*1.1 + 'px';
		img.style.height = parseInt(img.style.width)*ratio + 'px';
	}
	if(e.wheelDelta < 0){
		img.style.width = parseInt(img.style.width)*0.90 + 'px';
		img.style.height = parseInt(img.style.width)*ratio + 'px';
	}
	img.style.left = (window.innerWidth/2-parseInt(img.style.width)/2)+"px";
	img.style.top = (window.innerHeight/2-parseInt(img.style.height)/2)+"px";
}
function fit(){
	if(img.naturalHeight>=img.naturalWidth){
		img.style.height = window.innerHeight;
		img.style.width = window.innerHeight*(img.naturalWidth/img.naturalHeight);
		img.style.left = ((window.innerWidth-parseInt(img.style.width))/2)+"px";
		img.style.top = "0px";
	}
	if(img.naturalWidth>img.naturalHeight){
		img.style.width = window.innerWidth;
		img.style.height = window.innerWidth*(img.naturalHeight/img.naturalWidth);
		img.style.left = "0px";
		img.style.top = ((window.innerHeight-parseInt(img.style.height))/2)+"px";
	}
	if(parseInt(img.style.width)>window.innerWidth){
		img.style.width = window.innerWidth;
		img.style.height = window.innerWidth*(img.naturalHeight/img.naturalWidth);
		img.style.left = "0px";
		img.style.top = ((window.innerHeight-parseInt(img.style.height))/2)+"px";
	}
	if(parseInt(img.style.height)>window.innerHeight){
		img.style.height = window.innerHeight;
		img.style.width = window.innerHeight*(img.naturalWidth/img.naturalHeight);
		img.style.left = ((window.innerWidth-parseInt(img.style.width))/2)+"px";
		img.style.top = "0px";
	}
}