// ==UserScript==
// @name        Fed Outlaw Assistant
// @namespace   
// @author		Wes R
// @description This script will check the Federation's list of Outlaw pilots against your foes list, and will create a list of who you have not foelisted and display it beneath the lookup button for easy selection and foelisting.  If nobody needs foelisting a link to the Outlaw's List on the forums is displayed.
// @include     http://orion.pardus.at/diplomacy.php
// @include     https://orion.pardus.at/diplomacy.php
// @version     1.9
// @downloadURL https://update.greasyfork.org/scripts/6528/Fed%20Outlaw%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/6528/Fed%20Outlaw%20Assistant.meta.js
// ==/UserScript==


//v1.0
// Outlaws on script launch 
// Dactyl Dave, Erius, Firkin Tall, Goldberry, Sara, Shimokita Phantom, Smoker, Zaphood Jack, Zopa
//v1.1 added Esmerelda, The Man in Black
//v1.2 fixed The Man In Black capitalization
//v1.5 added Esmerelda, The Man In Black,Clive Rickter, added A Laggy Grunt to EXCLUDE since he would be pulled up //on accident via "lookup"
//v1.6 added Nukk Tador
//v1.7 Nukk Tador renamed to Full Clip
//v1.8 Westwood, Nailo Mzah
//v1.9 Xena

/*This finds the foes option list*/
var selectTables = document.getElementsByTagName("select");
var currentFoes = selectTables[selectTables.length-7];
var drawLocation = document.getElementsByTagName("form");

/*Our current list of Outlaws, shoved into an Array.*/
var Outlaws = new Array();
var removeOutlaws = new Array();

var h3 = document.getElementsByTagName("h3");
var inners = h3[5].innerHTML;

/*If for some reason you are not going to foe a pilot, just replace their name with another outlaw in this list.*/
Outlaws[0] = "Clive Rickter";
Outlaws[1] = "Dactyl Dave";
Outlaws[2] = "Erius";
Outlaws[3] = "Esmerelda";
Outlaws[4] = "Firkin Tall";
Outlaws[5] = "Goldberry";
Outlaws[6] = "Sara";
Outlaws[7] = "Shimokita Phantom";
Outlaws[8] = "Smoker";
Outlaws[9] = "The Man In Black";
Outlaws[10] = "Zaphood Jack";
Outlaws[11] = "Zopa";
Outlaws[12] = "Full Clip";
Outlaws[13] = "Westwood";
Outlaws[14] = "Nailo Mzah";
Outlaws[15] = "Xena";
/*Outlaws[9] = "";
Outlaws[10] = "";
Outlaws[11] = "";
Outlaws[13] = "";
Outlaws[14] = "";
Outlaws[15] = "";
Outlaws[16] = "";
Outlaws[17] = "";
Outlaws[18] = "";
Outlaws[19] = "";*/
//Outlaws[] = "";
Outlaws.sort();

removeOutlaws[0] = "A Laggy Grunt";
removeOutlaws[1] = "Aahz";
//removeOutlaws[2] = "Aahz";



/*function check outlaws with current foes this function will find who you have not foelisted, and add them to the list of who to foe				                      																	*/ //if(inners.match(/[A-Za-z0-9\/.:='"<_]*Inner Assembly/g) == "Inner Assembly"){}else{Outlaws = new Array();}

/*this will be the position in the outlaw array*/
var x = 0;
var Rx = 0;

/*position to look in the foes array*/
var position = 0;
var Rposition = 0;

/*position to add foesNeeded*/
var f = 0;
var foesNeeded = new Array();

while(x<Outlaws.length){
	
	/*this will be the position in the foes array*/
	var y = position;
	
	while(y<currentFoes.length){
		if(Outlaws[x] == currentFoes[y].value){
			currentFoes[y].setAttribute('style', "color:red");			
			position = y;
			y += 9999;
		}else{	
			++y;
		}
	}
	
	/*if y is less than the length, a match was not found, adds x to the foesNeeded array.*/
	if(y < currentFoes.length+2){
		foesNeeded[f] = Outlaws[x];
		++f;
	}
	
	++x;
}

var focus = true;
var removeCount = 0;

while(Rx<removeOutlaws.length){
	
	/*this will be the position in the foes array*/
	var Ry = Rposition;
	
	while(Ry<currentFoes.length){
		if(removeOutlaws[Rx] == currentFoes[Ry].value){
			currentFoes[Ry].setAttribute('style', "color:blue");	
			if(focus == true){
				currentFoes[Ry].setAttribute('selected', true);
				focus = false;
			}
			if(currentFoes[Ry].value == removeOutlaws[0]){
				alert("A Laggy Grunt is not a foe and may have been added incorrectly.  Be sure to select a foe from the list prior to looking up a pilot's name.");}			
			if(currentFoes[Ry].value == removeOutlaws[1]){
				alert("Aahz is not a foe and may have been added incorrectly.  Be sure to select a foe from the list prior to looking up a pilot's name.");

			}
			Rposition = Ry;
			Ry += 9999;
			++removeCount;			
		}else{	
			++Ry;
		}
	}
	++Rx;
}

/*if there are no pilots to foe, we really don't need all this stuff so don't do it*/
if(f > 0){

	var drawList = document.createElement("select");
	var optionList = document.createElement("option");

	var counter = 0;

	while(counter < foesNeeded.length){

		optionList = document.createElement("option");
		optionList.setAttribute('value', foesNeeded[counter]);
		drawList.appendChild(optionList);
		drawList.options[drawList.length-1].text = foesNeeded[counter];
		++counter;
	}

	drawList.setAttribute("name", "outlawList");
	drawList.setAttribute("id", "outlawList");
	drawList.setAttribute("onclick", "document.dipl_lookup.lookup_name.value = (outlawList.options[outlawList.options.selectedIndex].value)");
	drawList.setAttribute("size", f);
	drawList.setAttribute("style", "width:4.5cm");


	var drawText = document.createElement("h7");

	if(removeCount > 0){
		//can add forum links to threads
		drawText.innerHTML = removeCount + " pilots can be removed from your foes lists.<br><a href = 'http://orionfederation.kersare.net/forum/index.php' target='_blank'> These (" + f + ") pilots</a> are not foelisted:";
	}
	else{
		drawText.innerHTML = "<a href = 'http://orionfederation.kersare.net/forum/index.php' target='_blank'>These (" + f + ") pilots</a> are not foelisted:";
	}
	drawLocation[0].parentNode.appendChild(drawText);
	drawLocation[0].parentNode.appendChild(drawList);

}else{

	var outlawsLabel = document.createElement("h7");
	
	if(removeCount > 0){
		outlawsLabel.innerHTML = "Federation enemies are all foelisted.<br>" + removeCount + " pilots can be removed from your foes lists.<br><a href = 'http://orionfederation.kersare.net/forum/index.php' target='_blank'>A complete list with their crimes can be found here.</a>";
	}
	else{
		outlawsLabel.innerHTML = "Federation enemies are all foelisted.<br><a href = 'http://orionfederation.kersare.net/forum/index.php' target='_blank'>A complete list with their crimes can be found here.</a>";
	}
	
	drawLocation[0].parentNode.appendChild(outlawsLabel);
}