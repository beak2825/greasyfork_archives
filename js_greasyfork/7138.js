// ==UserScript==
// @version     1.0.9   
// @name    Kickass with Yt & IMDb
// @description     YouTube trailer link and IMDb rating on the KAT movie page.
// @namespace     https://greasyfork.org/users/3159  
// @include     http*://kickass.*
// @include     http*://kat.*
// @downloadURL https://update.greasyfork.org/scripts/7138/Kickass%20with%20Yt%20%20IMDb.user.js
// @updateURL https://update.greasyfork.org/scripts/7138/Kickass%20with%20Yt%20%20IMDb.meta.js
// ==/UserScript==
style = document.createElement('style');
style.innerText = ".king{background: linear-gradient(to bottom, #aac559 0%, #849d3a 100%) !important;margin-left:1px} .mag{background: linear-gradient(to bottom, #70abc6 0%, #5790d0 100%) !important}.mag, .king{box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08), inset 0 -1px 0 0 rgba(0, 0, 0, 0.03), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)} #bg{background:rgba(0, 0, 0,.8);position:fixed;top:0;z-index:9001;width:100%;height:100%;display:none} .yt{background: linear-gradient(to bottom, #c8644b 0%, #b2491a 100%)} .imdb{margin-left:4px;background: linear-gradient(to bottom, #efe670 0%, #f1be00 100%)} iframe{border:0;width:640px;height:390px;max-width:90%;max-height:90%;margin:auto;position:absolute;top:0;left:0;bottom:0;right:0} em{margin-right:6px !important} .emi{top:0 !important;vertical-align:middle} .imdb:hover{background: linear-gradient(to bottom, #cfc761 0%, #d1a400 100%) !important} .yt:hover{background: linear-gradient(to bottom, #a6523d 0%, #913d16 100%) !important} .mag:hover{background: linear-gradient(to bottom, #5e8fa6 0%, #558bc9 100%) !important} .king:hover{background: linear-gradient(to bottom, #8da349 0%, #697d2e 100%) !important} .king2, .mag2 {vertical-align: middle;text-shadow: 0 1px 0 #4c4c4c}";
document.head.appendChild(style);

var box = document.getElementsByClassName('iaconbox');
var nlink = document.getElementsByClassName('cellMainLink');
var spoon = document.getElementsByClassName('partner1Button');
var names = [];

function fixTitle(title) {
	title = title.replace(/[()\[\]]/g, '').replace(/[.]/g, ' '); // remove unwanted characters
	title = title.replace(/((18|19|20)[0-9]{2}).*/, '$1'); // trim after date
	title = encodeURIComponent(title).replace(/'/g, '%27'); // replace apostrophe with %27
	return title;
}

//remove sponser
for (i = 0; i < spoon.length; i++) {
	spoon[i].style.display = "none";
}

//clean up & get names
for (i = 0; i < box.length; i++) {
	for (a = 0; a < box[i].children.length; a++) {
		var ax = box[i].children[a];
		if (ax.title == 'Verified Torrent') var king = ax;
		else if (ax.title == 'Torrent magnet link') var mag = ax;
        else if ( ax.className.match(/icommentjs/) );
		else ax.style.display = "none";
	}
	if (king) {
		king.className += " king";
		king.children[0].className = king.children[0].className.replace(/ka16/, 'king2').replace(/ka-green/, '');
	}
	if (mag) {
		mag.className += " mag";
		mag.children[0].className = mag.children[0].className.replace(/ka16/, 'mag2');
	}
	names.push(fixTitle(nlink[i].innerText));
}

if (window.location.pathname.indexOf("movies")>-1){
    
//YouTube
bg = document.createElement("div");
bg.id = "bg";
bg.onclick = function () {
	bg.style.display = "none";
	bg.innerHTML = "";
};
document.body.appendChild(bg);

for (var i = 0; i < box.length; i++) {
	box[i].insertAdjacentHTML("beforeend", "<a title=YouTube class='icon16 yt'><em class='iconvalue emi'>Yt</em></a>");
	eval("document.getElementsByClassName('yt')[i].onclick = function (){bg.style.display='block';bg.innerHTML='<iframe src=//youtube.com/embed/?listType=search&list=" + names[i] + "&autohide=1></iframe>'};");
}

//IMDb
function insertr(ir, n, ii) {
	box[n].insertAdjacentHTML("beforeend", "<a href='http://imdb.com/title/" + ii + "/' title=IMDb class='icon16 imdb'><em style='color:#000' class='iconvalue emi'>" + ir + "</em></a>");
}

for (var i = 0; i < box.length; i++) {
	var iyear = names[i].replace(/.*((18|19|20)[0-9]{2})/, '$1');
	var iname = names[i].replace(/(.*)%20(18|19|20)[0-9]{2}/, '$1');
	eval("var r" + i + "= new XMLHttpRequest;r" + i + ".open('GET', '//www.omdbapi.com/?t='+iname+'&y='+iyear, true);r" + i + ".onload = function () {var num" + i + "=JSON.parse(r" + i + ".responseText).imdbRating;var ii" + i + "=JSON.parse(r" + i + ".responseText).imdbID;insertr(num" + i + "," + i + ",ii" + i + ");};r" + i + ".send();");
}
}