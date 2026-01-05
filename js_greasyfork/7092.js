// ==UserScript==
// @name   			HammerfestHeader
// @namespace  		hammerfest.fr
// @description  	Choix de la banniere Hammerfest
// @version  		1
// @include   		http://www.hammerfest.fr/*
// @match			http://www.hammerfest.fr/*
// @downloadURL https://update.greasyfork.org/scripts/7092/HammerfestHeader.user.js
// @updateURL https://update.greasyfork.org/scripts/7092/HammerfestHeader.meta.js
// ==/UserScript==

//Cacher les sites amis pendant une partie
if(document.URL.match('http://www.hammerfest.fr/play.html/solo#play')){
	document.getElementsByClassName('friends')[0].style.visibility = "hidden";}

//Fonction pour changer la bannière
function updateBanner() {
	var id = parseInt(localStorage.getItem('bannerId'));
	if (isNaN(id)) {
		id = 0;}
	var div = document.getElementsByClassName('siteHeader');
	switch(id){
		case 1:
			div[0].style.backgroundImage="url('/img/design/headers/fr/header_noel.gif')";
			break;
		case 2:
			div[0].style.backgroundImage="url('/img/design/headers/fr/header_christmas.jpg')";
			break;
		case 3:
			div[0].style.backgroundImage="url('/img/design/headers/fr/header_soccer.jpg')";
			break;
		case 4:
			div[0].style.backgroundImage="url('/img/design/headers/fr/header.jpg')";
			break;
		default:
			div[0].style.backgroundImage="url('/img/design/headers/fr/header_new.jpg')";
	}
}

function nextBanner(ev) {
	//ev.preventDefault();
	var id = parseInt(localStorage.getItem('bannerId'));
	if (isNaN(id)) {
		id = 0;}
	id = (id+1)%5;
	localStorage.setItem("bannerId",id);
	updateBanner();
	//return false;
}

//Fonction Afficher ou Cacher le bouton
function addButton(){
	var opt = document.getElementById("options");
	if (!opt) {
		return null;}
	var btn = document.createElement("a");
	btn.className = "button";
	btn.style.width = "auto";
	btn.style.marginTop = "10px";
	btn.href = "#";
	btn.innerHTML = 'Changer de theme !';
	btn.onclick = nextBanner;
	opt.appendChild(btn);
}

updateBanner();
addButton();


