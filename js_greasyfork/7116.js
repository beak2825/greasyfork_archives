// ==UserScript==
// @name     Manga cleaner & loader
// @version     1.0.9
// @description     img:click/arrow-key, back:top-left, width:top-right/w-key, load:bottom-right, remove crap
// @namespace     https://greasyfork.org/users/3159
// @grant     GM_getValue
// @grant     GM_setValue
// @include     http*://*e-hentai.org/s/*
// @include     http*://exhentai.org/s/*
// @include     http*://*hentairules.net/galleries*/picture.php?/*
// @downloadURL https://update.greasyfork.org/scripts/7116/Manga%20cleaner%20%20loader.user.js
// @updateURL https://update.greasyfork.org/scripts/7116/Manga%20cleaner%20%20loader.meta.js
// ==/UserScript==

//startup
var loc = location.hostname.indexOf('hentairules.net') > -1 ? 1 : 2;
var next,o,t;
if (loc == 1) {
    location.href = document.getElementById('derivativeSwitchBox').children[5].href; //need to reload page for this to take effect

    //next = document.getElementById('linkNext').href;
    next = document.getElementsByClassName('pwg-button-icon-right')[0].href;

	o = document.getElementById('theMainImage').src;
	t = document.getElementsByClassName('browsePath')[0].children[1].innerText;
}
else if (loc == 2) {
	var a = document.getElementsByTagName('a');
	next = a[2].href;
	var last = a[3].href;
	o = a[4].children[0].src;
	t = document.title;
}
var array = [o];
var w = 0;
var i = 0;
var y = 0;
document.head.innerHTML = '<title>' + t + '</title><style>html{height:100%}body{height:100%;margin:0}img{width:100%;max-width:100%;margin-left:auto;margin-right:auto;display:block}div{width:100px;height:100px;position:fixed}div:hover{background:rgba(0,0,0,.5)}</style>';
document.body.innerHTML = '';
var img = new Image();
img.src = o;
document.body.appendChild(img);

//background
var gi;
function current() {
	gi = document.getElementsByTagName('img');
	for (var a = 0; a < gi.length; a++) {
		if (window.pageYOffset + window.innerHeight >= gi[a].offsetTop) {
			o = a;
		}
	}
	return o;
}

function cnimage(i) {
	if (!gi[i] && array[i]) {
		var bimg = new Image();
		bimg.src = array[i];
		document.body.appendChild(bimg);
	}
}

var onScrollStart = function () {
	if (y) {
		var x = current();
		cnimage(x + 1);
		cnimage(x + 2);
		cnimage(x + 3);
		cnimage(x + 4);
	}
};

window.addEventListener("scroll", onScrollStart, false);

function parray() {
	var r = document.implementation.createHTMLDocument("temp");
	var x = new XMLHttpRequest();
	x.onreadystatechange = function () {
		if (x.readyState == 4 && x.status == 200) {
			var a = x.responseText;
			r.documentElement.innerHTML = a;
			if (loc == 1) {
				var ti = r.getElementsByTagName('img')[0].outerHTML.split('src="')[1].split('"')[0];
				var nn = r.getElementsByClassName('pwg-button-icon-right')[0].outerHTML;
				next = nn.split('href="')[1] ? nn.split('href="')[1].split('"')[0] : "";
				if (next === "") {
					w = 2;
				}
			}
			else if (loc == 2) {
				var aa = r.getElementsByTagName('a');
				ti = aa[4].children[0].src;
				next = aa[2].href;
				if (next == last) {
					w++;
				}
			}
			array.push(ti);
			if (w < 2) {
				parray();
			}
		}
	};
	x.open('GET', next, true);
	x.send();
	return;
}
parray();

img.onclick = function () {
	if ((i + 1) < array.length) {
		img.src = array[++i];
	}
};

window.document.onkeydown = function () {};
document.addEventListener("keydown", function (e) {
	switch (e.which) {
	case 39:
		if ((i + 1) < array.length) {
			img.src = array[++i];
		}
		break;
	case 37:
		if (i > 0) {
			img.src = array[--i];
		}
		break;
	case 87:
		cwidth();
		break;
	}
});

var timg1 = new Image();
var timg2 = new Image();
var timg3 = new Image();
var timg4 = new Image();
var timg5 = new Image();
var timg6 = new Image();
var timg7 = new Image();
var timg8 = new Image();

img.onload = function () {
	window.scrollTo(0, 0);
	array[i + 1] ? timg1.src = array[i + 1] : null;
	array[i + 2] ? timg2.src = array[i + 2] : null;
	array[i + 3] ? timg3.src = array[i + 3] : null;
	array[i + 4] ? timg4.src = array[i + 4] : null;
	array[i - 1] ? timg5.src = array[i - 1] : null;
	array[i - 2] ? timg6.src = array[i - 2] : null;
	array[i - 3] ? timg7.src = array[i - 3] : null;
	array[i - 4] ? timg8.src = array[i - 4] : null;
};

//buttons

var load = document.createElement("div");
load.style.cssText = "right:0;bottom:0";
load.onclick = function () {
	y = 1;
	load.style.display = "none";
	width.style.position = back.style.position = "absolute";
	if (array[1]) {
		var aimg = new Image();
		aimg.src = array[1];
		document.body.appendChild(aimg);
	}
};

var back = document.createElement("div");
back.style.cssText = "top:0;left:0";
back.onclick = function () {
	if (i > 0) {
		img.src = array[--i];
	}
};

var sstyle = document.createElement("style");
document.head.appendChild(sstyle);

if (GM_getValue("magsave")) {
	sstyle.innerText = "img{max-height:100%;width:inherit}";
}

function cwidth() {
	if (GM_getValue("magsave")) {
		sstyle.innerText = "img{max-height:inherit;width:100%}";
		GM_setValue("magsave", 0);
	} else {
		sstyle.innerText = "img{max-height:100%;width:inherit}";
		GM_setValue("magsave", 1);
	}
}

var width = document.createElement("div");
width.style.cssText = "top:0;right:0";
width.onclick = function () {
	cwidth();
};

var down = document.createElement("div");
down.style.cssText = "bottom:0;left:0";
down.onclick = function () {
	var images = document.getElementsByTagName("img");
	var urls = '';
	for (i = 0; i < images.length; i++) {
		urls += images[i].src;
		urls += "<br />";
	}
    urls += "copy links<br />in terminal use nano to create a file called urls<br />run the command:<br />mkdir a && cd a && xargs -n 1 curl -O < ../urls && echo 'done'";
	document.body.innerHTML = urls;
};

document.body.appendChild(back);
document.body.appendChild(width);
document.body.appendChild(load);
document.body.appendChild(down);
