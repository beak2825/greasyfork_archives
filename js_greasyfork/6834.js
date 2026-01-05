// ==UserScript==
// @name        BTN advent notifier 
// @description alert if BTN advent is ready / update timer
// @namespace   enforcer
// @include     *
// @version     1.2.2
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/6834/BTN%20advent%20notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/6834/BTN%20advent%20notifier.meta.js
// ==/UserScript==

var d = new Date();

//Create GM_btn_next_advent timer value if it doesn't already exist
if(GM_getValue("GM_btn_next_advent") === undefined){
	oneminuteahead = d.getTime() + 60*1000;
	GM_setValue("GM_btn_next_advent", oneminuteahead);
	console.log("advent alerts should start in ~ 1 minute");
	}

//Create BTN_advent_claimed, might be useless
if(GM_getValue("BTN_advent_claimed") === undefined){
	GM_setValue("BTN_advent_claimed", false);
	}
	
/*
//reset = false; //uncomment, set true to delete timer value and halt script execution
if(reset){
	GM_deleteValue("GM_btn_next_advent");
	throw new Error("Stopping as reset = true, line ~ 27");
}
*/

if(d.getMonth() == 11){
	//It's December
	
	adventready = GM_getValue("GM_btn_next_advent");
	//if(d.getTime() < Number(adventready) && !GM_getValue("BTN_advent_claimed")){ // for testing
	if(d.getTime() > Number(adventready) && !GM_getValue("BTN_advent_claimed")){
		//remake box icon in bottom left <div id="top-present" style="position:fixed;bottom:5px;left:5px;z-index:999;opacity:0.2;">
		var present = document.createElement('div');
		document.body.appendChild(present);
		present.style.position = "fixed";
		present.style.bottom = "5px";
		present.style.left = "5px";
		present.style.zIndex = "998" //will not cover the built-in BTN icon on BTN, but that might not matter
		present.innerHTML = '<a href="https://broadcasthe.net/advent.php?action=claimprize"><img src="https://cdn.broadcasthe.net/common/smallgift.png"</a>';
		}

	if(document.URL.match(/https:\/\/broadcasthe\.net\/advent\.php\?action=claimprize/) !== null) {
		adventnotice = document.querySelectorAll("div.box:nth-child(6) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)");
		if(adventnotice[0].innerHTML.match(/Congratulations!/) !== null || adventnotice[0].innerHTML.match(/Sorry\, Too Early!/) !== null){ 
			//next midnight @ UTC 
			d2 = new Date(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()+1,0,-d.getTimezoneOffset());
			GM_setValue("GM_btn_next_advent", d2.getTime());
		}
	}
}