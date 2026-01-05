// ==UserScript==
// @name        Note ECE
// @namespace   Guitton Nicolas
// @description Permet de connaitre les moyennes/notes pour campus
// @include     http://webapps.ece.fr/mes-notes/actuelles/*
// @namespace https://greasyfork.org/fr/scripts/7529-note-ece
// @date 2015-01-16
// @author  Snaquekiller
// @version     5
// @grant  GM_getValue
// @grant  GM_setValue
// @grant  GM_xmlhttpRequest
// @history 5 Rajout de la LVL 2 dans les points
// @history 4 correction si pas de point assos
//@history 3 correction de la moyenne G avec les points assos
// @downloadURL https://update.greasyfork.org/scripts/7529/Note%20ECE.user.js
// @updateURL https://update.greasyfork.org/scripts/7529/Note%20ECE.meta.js
// ==/UserScript==


function coeff(numerob){
	var moyenne=0.00;
	var nb = 0;
	var coef = 0.0;
	var depart = numerob;
	var tr = document.getElementById("main").getElementsByTagName('table')[0].getElementsByTagName('tr');
	while(tr[depart].onmouseout != null){
		depart--;
	}
	
	for(var i =depart+1; i<tr.length;i++){
		if(tr[i].onmouseout == null){
			if(tr[i].className=="moyenne" || tr[i].className=="moyenneassos"){
				
				tr[i].getElementsByTagName('td')[1].innerHTML = (moyenne/coef).toFixed(2);
				i = i +1;
				moyenne = 0.00;
				coef = 0
				
				if(numerob !=0){
					i= tr.length+5;
				}
			}
		}else{
			var coeffecrit = tr[i].getElementsByTagName('input')[0].value;
			coef = coef + parseFloat(coeffecrit);
			var nom = tr[i].getElementsByTagName('td')[0].innerHTML.split("(")[1].split(")")[0].replace("-","_");
			GM_setValue("ece_"+nom,coeffecrit);
			moyenne = moyenne + parseFloat(tr[i].getElementsByTagName('td')[1].innerHTML.replace(",","."))*coeffecrit;
			nb ++;	
		}
	}
		
	var moyennelvl2 = 0 ;
	if(document.getElementsByClassName("moyennelvl2")[0]){
		moyennelvl2 = parseFloat(document.getElementsByClassName("moyennelvl2")[0].innerHTML.replace(",","."));
	}
	if(document.getElementById("LFH")){document.getElementById("LFH").innerHTML = parseFloat(document.getElementById("LFH").innerHTML) + moyennelvl2;}
	
	var classemoyenne = document.getElementsByClassName("moyenne");
	var moyenneg  = 0.00;
	for(var i=0;i<classemoyenne.length;i++){
		moyenneg = moyenneg + parseFloat(classemoyenne[i].getElementsByTagName('td')[1].innerHTML);
	}
	var moyennea = 0 ;
	if(document.getElementsByClassName("moyennea")[0]){
		moyennea = parseFloat(document.getElementsByClassName("moyennea")[0].innerHTML.replace(",","."));
	}
	

	
	document.getElementsByClassName("moyenneg")[0].getElementsByTagName('td')[1].innerHTML = ((moyenneg + moyennea)/classemoyenne.length).toFixed(2);;
}
var css = document.createElement("style");
css.type ="text/css";
css.innerHTML =".moyenne,.moyennea,.moyenneassos{"
		+"	background-color:#C9DAF2;"
		+"}"
		+".moyenneg { background-color:#9E4A4B;text;color: #FFFFFF;font-weight: bold;}";

document.getElementsByTagName('head')[0].insertBefore(css, document.getElementsByTagName('head')[0].firstChild);
var tr = document.getElementById("main").getElementsByTagName('table')[0].getElementsByTagName('tr');
document.getElementById("main").getElementsByTagName('table')[0].getElementsByTagName('td')[0].colspan = "4";
tr[1].innerHTML = tr[1].innerHTML +"<td> Coef </td>";
var nom;

var titre = tr[2].getElementsByTagName('td')[0].innerHTML.replace(new RegExp(" ", 'g'),"_"); 

for(var i =3; i<tr.length;i++){
	if(tr[i].onmouseout == null){
		var newItem = document.createElement("tr")        // Create a <li> node
		if(titre.search("Langues") != -1 && titre.search("Humaines") != -1){
			newItem.innerHTML = "<td colspan='3' >Moyenne </td><td id='LFH'>0</td>";
		}
		newItem.innerHTML = "<td colspan='3' >Moyenne </td><td>0</td>";
		if(nom != "ASSO" && nom != "2ND_LANGUE"){
			newItem.className ="moyenne";
		}else{
			newItem.className ="moyenneassos";
		}
	
		var t = document.getElementById("main").getElementsByTagName('tbody')[0];
		t.insertBefore(newItem,  t.getElementsByTagName('tr')[i]); 
		i++;
		titre = tr[i].getElementsByTagName('td')[0].innerHTML.replace(new RegExp(" ", 'g'),"_");
	}else{
		//rajouter les coefs
		nom = tr[i].getElementsByTagName('td')[0].innerHTML.split("(")[1].split(")")[0].replace("-","_");
		var value = GM_getValue("ece_"+nom,"1");
		if(nom == "ASSOS"){
			tr[i].getElementsByTagName('td')[1].className = "moyennea";
		}else if (nom == "2ND_LANGUE"){
			tr[i].getElementsByTagName('td')[1].className = "moyennelvl2";
		}
		tr[i].innerHTML = tr[i].innerHTML + "<td><input type='text' id="+ nom+" name='coef"+i+"'' size='4px' value='"+ value +"' id=></td>";
		tr[i].getElementsByTagName('td')[3].getElementsByTagName('input')[0].addEventListener("change",function(event){coeff(this.name.split("coef")[1]);}, true);		
	}
}

var newItem = document.createElement("tr")        // Create a <li> node
newItem.innerHTML = "<td colspan='3'>Moyenne Générale </td><td>0</td>";
newItem.className ="moyenneg";

var t = document.getElementById("main").getElementsByTagName('tbody')[0];
t.insertBefore(newItem,  t.getElementsByTagName('tr')[i]); 

coeff(0);




