// ==UserScript==
// @name        Losekaufen
// @namespace   Losekaufen
// @description Lose kaufen PG
// @include     http://*.pennergame.de/city/games/*
// @version     1
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/6368/Losekaufen.user.js
// @updateURL https://update.greasyfork.org/scripts/6368/Losekaufen.meta.js
// ==/UserScript==
var currency = "€";        // Euro-Zeichen
var currency1 = "";

// ***********************************************************************************************
// ***********************************************************************************************
// Funktion liefert vom String str die rechtesten n Zeichen zurück
// ***********************************************************************************************
// ***********************************************************************************************
function Right$(str, n){
    if (n <= 0)
        return "";
    else if (n > String(str).length)
        return str;
    else {
        var iLen = String(str).length;
        return String(str).substring(iLen, iLen - n);
    }
}

// **********************************************************************************
// **********************************************************************************
// lädt eine Seite neu
// **********************************************************************************
// **********************************************************************************
function refreshPage() {
    var page = location.toString();
    if (Right$(page, 18) == "activities/bottle/")
        page = page.substr(0, page.length-7);
    else if (Right$(page, 10) == "games/buy/" || Right$(page, 13) == "district/buy/")
        page = page.substr(0, page.length-4);
    else if (Right$(page, 7) == "/speed/")
        page = page.substr(0, page.length-6);
    else if (Right$(page, 9) == "/success/")
        page = page.substr(0, page.length-8);
    else if (Right$(page, 2) == "/#")
        page = page.substr(0, page.length-1);

    window.location.href = page;
}

function Losekaufen(menge, maxMenge, gewinne)
{
	if (menge <= 0) {
		document.getElementsByName('submitForm')[0].disabled = false;
		var Stat = "";
		var gesamt = 0;
		var aktcurr = " " + (currency1 != ""?currency1:currency);
		for (i = 0; i < gewinne.length; i++) {
			var win = gewinne[i][0];
			if (isNaN(win)) {
			   if (win == "auszeichnung")
				   win = "Auszeichnung";
			}
			else if (win == 0)
				win = "Niete";
			else {
				gesamt += win * gewinne[i][1];
				win += aktcurr;
			}
			Stat += gewinne[i][1] + " x " + win + ", ";
		}
		alert(Stat + "Gewinn gesamt: " + gesamt + aktcurr);
		refreshPage();
		return;
	}

	document.getElementById('NochLose').innerHTML = "Es werden noch " + menge + " Lose gekauft!";
	var bmenge = menge;
	if (bmenge > maxMenge)
		bmenge = maxMenge;

	document.getElementById('menge1').value = bmenge;
	unsafeWindow.generatePreis(1,10);

	var data = "";
	var input = document.getElementById('content').getElementsByClassName('listshop')[0].getElementsByTagName('td')[4].getElementsByTagName("input");
	for (i = 0; i < input.length; i++)
		if (input[i].name != "max")
			data += input[i].name + "=" + (input[i].name == "menge"?bmenge:input[i].value) + "&";
	GM_xmlhttpRequest({method: 'POST',
					   url: 'http://'+window.location.hostname+'/city/games/buy/',
					   headers: {'Content-type': 'application/x-www-form-urlencoded'},
					   data: encodeURI(data.substr(0,data.length-1)),
					   onload: function(responseDetails) {
								   var content = responseDetails.responseText;
								   var spl = content.split('icon money">');
								   if (spl.length > 1) {
									   var money = document.getElementsByClassName("icon money");
									   money2 = spl[1].split("</a>")[0].split(">");
									   money[0].innerHTML = money2[0]+">"+money2[1]+"</a>";
									   menge = menge - bmenge;
								   }
								   spl = content.split('swf?gewinn=');
								   for (i = 1; i < spl.length; i++) {
									   if (i % 2 == 0)
										   continue;
									   var gew = spl[i].split("&")[0];
									   if (!isNaN(gew))
										   gew = Number(gew);
									   for (j = 0; j < gewinne.length; j++)
										   if (!isNaN(gew) && gewinne[j][0] > gew) {
											   gewinne.splice(j, 0, new Array(gew, 1));
											   break;
										   }
										   else if (gewinne[j][0] == gew) {
											   gewinne[j][1]++;
											   break;
										   }
									   if (j == gewinne.length)
										   gewinne[j] = new Array(gew, 1);
								   }
								   Losekaufen(menge, maxMenge, gewinne);
							   }
					  });
}

function getAnzLose() {
	var tds = document.getElementsByTagName('table')[0].getElementsByTagName('tr')[1].getElementsByTagName('td');
	var texts = tds[0].innerHTML.split(' ');
	var NochLose = -1;
	for (i = texts.length-1; i > 0; i--)
		if (texts[i] != "" && !isNaN(texts[i])) {
			NochLose = Number(texts[i]);
			break;
		}
	return NochLose;
}

var tdlose = document.getElementById('content').getElementsByClassName('listshop')[0].getElementsByTagName('td');
tdlose[3].id = "NochLose";
var NochLose = getAnzLose();
if (NochLose < 0)
	NochLose = 500;
if (NochLose != 0) {
	var input = document.createElement('input');
	input.type = 'button';
	input.value = "max.";
	input.id = 'max';
	input.name = 'max';
	tdlose[4].appendChild(input, tdlose[4].firstChild);
	document.getElementById('submitForm1').disabled = (NochLose == 0);

	document.getElementsByName('menge')[0].parentNode.innerHTML = document.getElementsByName('menge')[0].parentNode.innerHTML.replace("1,1","1,10");
	document.getElementsByName('menge')[0].addEventListener('keyup', function onkeyup() {
		var testmenge = document.getElementsByName('menge')[0].value;
		var NochLose = getAnzLose();
		if (NochLose != -1 && Number(testmenge) > NochLose) {
			document.getElementById('menge1').value = NochLose;
			if (NochLose > 0) {
				unsafeWindow.generatePreis(1,10);
			}
		};
	},false);

	document.getElementsByName('max')[0].addEventListener('click', function start() {
		var NochLose = getAnzLose();
		if (NochLose < 0)
			NochLose = 500;
		document.getElementById('menge1').value = NochLose;
		if (NochLose > 0) {
			unsafeWindow.generatePreis(1,10);
		}
		else
			document.getElementById('submitForm1').disabled = true;
	},false);
}

if (NochLose != 0) {
	document.getElementById('content').getElementsByClassName('listshop')[0].getElementsByTagName('form')[0].onsubmit = function(event) {
		var menge = Number(document.getElementById('menge1').value);
		document.getElementsByName('submitForm')[0].disabled = true;
		Losekaufen(menge, 10, new Array());
		return false;
	}
}
