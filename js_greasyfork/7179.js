// ==UserScript==
// @name        BTN Advent summary
// @namespace   enforcer
// @description add up all your advent gifts
// @include     https://broadcasthe.net/advent.php*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7179/BTN%20Advent%20summary.user.js
// @updateURL https://update.greasyfork.org/scripts/7179/BTN%20Advent%20summary.meta.js
// ==/UserScript==

lists =  document.querySelectorAll("div.box:nth-child(2) > ul:nth-child(1) > li");

for(i = lists.length-1; i > -1; i--){
	li = lists[i];
	if(li.textContent.match("The prizes you have won so far are") != null){
		
		liitems = li.textContent.split(": ")[1];
		liitems = liitems.split(", ");
		
		gb = [0];
		bp = [0];
		lumens = [0];
		goldstars = lists[6].getElementsByTagName("b")[0].textContent;
		
		for(j = 0; j < liitems.length; j++){
			
			if(liitems[j].match("GB Upload") != null){
				gb.push(Number(liitems[j].split("GB Upload")[0]));
				continue;
				}
						
			if(liitems[j].match("BP") != null){
				bp.push(Number(liitems[j].split(" BP")[0]));
				continue;
				}
						
			if(liitems[j].match("Lumens") != null){
				lumens.push(Number(liitems[j].split("Lumens")[0].trim()));
				}
			}	
		
		gbsum = gb.reduce(function(a, b){return a+b;});
		bpsum = bp.reduce(function(a, b){return a+b;});
		lumensum = lumens.reduce(function(a, b){return a+b;});
		
		var totals = document.createElement('li');
		totalstring = ("In total: " + gbsum + " GB, " + bpsum + " BP, " + lumensum + " Lumens and " + goldstars + " Gold Star");
		if(goldstars == 1){
			totalstring += ".";
			} else {
			totalstring += "s.";
			}
		totals.appendChild(document.createTextNode(totalstring));
		
		lists[0].parentNode.appendChild(totals);
		
		break;		
		}
	}
	