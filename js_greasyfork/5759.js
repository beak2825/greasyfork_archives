// ==UserScript==
// @name           Mangareader
// @namespace      Snaquekiller
// @version        0.5
// @author       snaquekiller
// @creator       snaquekiller
// @description   Help for the website mangareader, to view your manga you read 
// @date 2015-12-09
// @include       http://*mangareader.net/*
// @include       http://*mangadoom.*
// @grant GM_getValue
// @grant GM_setValue
// @compat Firefox
// @downloadURL https://update.greasyfork.org/scripts/5759/Mangareader.user.js
// @updateURL https://update.greasyfork.org/scripts/5759/Mangareader.meta.js
// ==/UserScript==

////https://greasyfork.org/en/scripts/5759-mangareader
/*=================================================================================================================*/

//{ Fonctions de compatibilitÃ©
// Si ces fonctions n'existent pas, elle sont crÃ©Ã©es

	// merci mushroonm et Lame noire qui mon donner cette function
	function insertAfter(elem, after){
		var dad = after.parentNode;
		if(dad.lastchild == after)
			dad.appendChild(elem);
		else
			dad.insertBefore(elem, after.nextSibling);
	}
	
var nom_moi = GM_getValue("mangareader","").split("|");

var nom_mangamoi = new Array("Ability","Assasination Classroom","All You Need Is Kill","Absolute Duo","Bleach","Black Bullet","Bakudan! - Bakumatsu Danshi","Claymore","Code Breaker","Dragons rioting","D.Gray-Man","drifters","Dr. Duo","Fairy Tail","Flow","id","half prince","head trick","kenichi","kurogane","Mahouka Koukou no Rettousei","Naruto","One piece","Owari no Seraph","rosario+vampire","Shinmai Mao no Keiyakusha","Tail star","The Breaker New Waves","Toriko","The gamer","taboo tatoo","World Trigger", "Crepuscule");
var nom_manga = '';
var manga_trouve = false;



if(document.URL.match(".*mangareader.*")){
//mangareader
	var liste = document.getElementsByClassName("c6")
	var balise_nom = "strong";
	var numero_balise = 1;
	var numero_balise2 = 0;
	var bal2 = "td";
}else{
//ùangadoom
	var liste = document.getElementById("sct_latest_chapter").getElementsByTagName("li");
	var balise_nom = "a";
	var numero_balise = 0;
	var numero_balise2 = 1;
	var bal2 = "span";
}

for(var i =0; i <liste.length;i++){
	nom_manga = liste[i].getElementsByTagName(balise_nom)[numero_balise2].innerHTML.trim();
	if(!document.URL.match(".*mangareader.*")){
		nom_manga= nom_manga.split("<")[0].trim();
	}		
				
	var td_in = "";
	for(var j=0; j <nom_moi.length;j++){
    	if(nom_manga == nom_moi[j]){
			
			manga_trouve = true
			td_in = "<td> <a class=moin> - </a>";
    		liste[i].getElementsByTagName(balise_nom)[numero_balise2].innerHTML = '<span style="color:#660000;font-size:18px;position:relative;left:100px;background-color:" >'+nom_manga +'</span>';
			liste[i].style.background="#83E983"; 
    	}
	}
	if(manga_trouve == false){
		td_in = "<td> <a class=plus> + </a>";
	}
	manga_trouve = false;
	var td = document.createElement("td"); // on cree une balise span
	td.setAttribute("id", "test"); // on y ajoute un id
	td.innerHTML = td_in;
	var where = liste[i].getElementsByTagName(bal2)[numero_balise];	
	insertAfter(td,where);
}

function plus(a){
			var nom_add = a.parentNode.parentNode.getElementsByTagName(balise_nom)[numero_balise2].innerHTML.trim();
			if(!document.URL.match(".*mangareader.*")){
				nom_add= nom_add.split("<")[0].trim();
			}		
					
			nom_moi = nom_moi.join("|") + "|"+nom_add;
			nom_moi = nom_moi.replace("\|\s+\|","");
			nom_moi = nom_moi.replace("\|+","\|");
			GM_setValue("mangareader",nom_moi);
			nom_moi = nom_moi.split("|");
			a.className = "moin";
			a.innerHTML = "-";
			a.addEventListener("click", function(event){moin(a)}, true);
			a.parentNode.parentNode.getElementsByTagName(balise_nom)[numero_balise2].innerHTML = '<span style="color:#660000;font-size:18px;position:relative;left:100px;background-color:" >'+nom_add +'</span>';
			a.parentNode.parentNode.style.background="#83E983";
}

function moin(a){
	var nom_add = a.parentNode.parentNode.getElementsByTagName(balise_nom)[numero_balise2].getElementsByTagName('span')[0].innerHTML.trim();
	if(!document.URL.match(".*mangareader.*")){
		nom_add= nom_add.split("<")[0].trim();
	}	
	nom_moi = nom_moi.join("|");
	nom_moi = nom_moi.replace(nom_add," ");
	nom_moi = nom_moi.replace("\|\s+\|","");
	nom_moi = nom_moi.replace("\|+","\|");
	
	GM_setValue("mangareader",nom_moi);
	nom_moi = nom_moi.split("|");
	a.className = "plus";
	a.innerHTML = "+";
	a.parentNode.parentNode.getElementsByTagName(balise_nom)[numero_balise2].innerHTML = nom_add;
	a.parentNode.parentNode.style.background="";
	a.addEventListener("click",function(event){plus(a)}, true);
}

for(var i =0; i <document.getElementsByClassName("plus").length;i++){
	document.getElementsByClassName("plus")[i].addEventListener("click",function(event){ plus(this)}, true);
}

for(var i =0; i <document.getElementsByClassName("moin").length;i++){
	document.getElementsByClassName("moin")[i].addEventListener("click",function(event){ moin(this)}, true);
}