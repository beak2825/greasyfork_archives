// ==UserScript==
// @name        Nexus Clash Stat Bars Alternative Version
// @namespace   http://userscripts.org/users/125692
// @description Adds bars to AP HP and MP
// @include        http://nexusclash.com/modules.php?name=Game*
// @include        http://www.nexusclash.com/modules.php?name=Game*
// @grant          GM_getValue
// @grant          GM_setValue 
// @grant          GM_addStyle
// @version     1.08
// @downloadURL https://update.greasyfork.org/scripts/9654/Nexus%20Clash%20Stat%20Bars%20Alternative%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/9654/Nexus%20Clash%20Stat%20Bars%20Alternative%20Version.meta.js
// ==/UserScript==
//for nexus clash. this script
// adds coloured bars to under AP/HP/MP to provide visual referenece to depletion of these stats.
//1.01  - changed to math.round from parseInt for negligible increase in accuracy
//1.02  - added border to bars
//1.03  - added colour change for when over max
//1.04  - handles negative stats properly now.
//1.05 - this version has differing colors for the bars so make it easier to distinguish at a glance
//1.06 - add try catch to chrome test

try{	
if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {
    this.GM_getValue=function (key,def) {
        return localStorage[key] || def;
    };
    this.GM_setValue=function (key,value) {
        return localStorage[key]=value;
    };
    this.GM_deleteValue=function (key) {
        return delete localStorage[key];
    };
  }
} catch (err) { console.log('Test if GM_getValue supported error:\n' + err.message); }

//check if start screen and store max values.
var isstart = document.evaluate(
	"//h2[starts-with(.,'Welcome back to Nexus Clash!')]", 
	document, 
	null,
	XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
	null);

if (isstart.snapshotLength == 1) {
	//we on start screen.
	//Store max ap/hp/mp values.
	var charlinks = document.evaluate( 
		"//a[starts-with(@href,'modules.php?name=Game&op=character&id=')]",
		document,
		null,
		XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
		null );
	var charid;
	var charmaxhp=0;
	var charmaxap=0;
	var charmaxmp=0;
	if (charlinks.snapshotLength > 1) {//found some charlinks
		var charlink=0;
		for (i=0;charlink=charlinks.snapshotItem(i);i++){
			//alert(i);
			charid=charlink.href.match(/id=(\d+)/)[1];
			
			charlink=charlink.parentNode.nextElementSibling.nextElementSibling;
			charmaxap=charlink.textContent.match(/\/(\d+)/)[1];
			
			charlink=charlink.nextElementSibling;
			charmaxhp=charlink.textContent.match(/\/(\d+)/)[1];
			
			charlink=charlink.nextElementSibling;
			charmaxmp=charlink.textContent.match(/\/(\d+)/)[1];	
			
			//now store 'em away
			GM_setValue("maxap"+charid,charmaxap);
			GM_setValue("maxhp"+charid,charmaxhp);
			GM_setValue("maxmp"+charid,charmaxmp);		
		} 
	}
	return; //as that is all we want to do as we are on the start screen
}


//we not on start screen so we probably in game so apply rest of script.
//add styles
GM_addStyle(".barap{height:10px;background-color:#84f084;border-top:1px solid #000000;}");//COLOUR FOR BACKGROUND OF AP BAR ##0000ff is blue	
GM_addStyle(".barhp{height:10px;background-color:#ff0000;border-top:1px solid #000000;}"); //COLOUR FOR BACKGROUND OF HP BAR ##FF0000 is red
GM_addStyle(".barmp{height:10px;background-color:#99d9ea;border-top:1px solid #000000;}");//COLOUR FOR BACKGROUND OF MP BAR ##8000ff is purple	
GM_addStyle(".barslider{height:9px;position:absolute;left:0px;background-color:#008800;}");// SET COLOUR FOR FOREGROUND OF BAR 00ff00 is green
GM_addStyle(".statbardiv{width:100%;position:absolute;top:19px;bottom:0px;left:0px;right:0px;}");
GM_addStyle(".bartd{position:relative;}");

var OVERMAXCOLOUR="#0000FF";//colour to make bar for when over max


//ADD COLOUR BARS TO AP/HP/MP
if(document.getElementById("CharacterInfo")){

	var charinfodiv=document.getElementById("CharacterInfo");
	var charlinks = document.evaluate( 
		".//a[starts-with(@href,'modules.php?name=Game&op=character&id=')]",
		charinfodiv,
		null,
		XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
		null );
	var charid=0;
	if (charlinks.snapshotLength==1){
			charid=charlinks.snapshotItem(0).href.match(/id=(\d+)/)[1];
	}
	var charmax = new Array();//lol at this way. makes code a bit shorter in for
	charmax[0]=GM_getValue("maxap"+charid,0);
	charmax[1]=GM_getValue("maxhp"+charid,0);
	charmax[2]=GM_getValue("maxmp"+charid,0);
  //alert("heh");
	if (charmax[0]&&charmax[1]&&charmax[2]){//only if all are true(ie we got a proper value)
		for(i=0;i<3;i++){//for each stat add bar
		
			var statbardiv=document.createElement('div');
			var backdiv=document.createElement('div');
			var frontdiv=document.createElement('div');	
			
			statbardiv.className="statbardiv";
			backdiv.className = i==0?"barap":i==1?"barhp":"barmp";
			frontdiv.className="barslider";
			
			var font=charinfodiv.getElementsByTagName("font")[i];//get font
			charstat=font.innerHTML.match(/-?\d+/); //get ap/hp/mp  and if -ve
			if(i==1){//the hp doesn't refill automatically most of the time.
				backdiv.title=charstat+"/"+charmax[i]+" Need "+
				(Number(charmax[i])-Number(charstat))+"hp healed";
			}
			else{// for ap and mp
				backdiv.title = charstat+"/"+charmax[i]+" Full in "+ 
				(Number(charmax[i])-Number(charstat))/4+" hours";//assume ap/mp +1 per tick
			}
	

			var frontwidth=Math.round(100*(Number(charstat)/Number(charmax[i])));
			if (frontwidth>100){//for some reason we over max
				frontwidth=100;
				frontdiv.style.backgroundColor=OVERMAXCOLOUR;//set to blue to signify over max
			}
			else if (frontwidth<0){//for some reason we at -ve values
				frontwidth=0;
			}
			frontdiv.style.width=""+frontwidth+"%";//Doing it as %;
			frontdiv.title=charstat+"/"+charmax[i];
			//alert('here');
			var hptd = charinfodiv.getElementsByTagName("td")[i+2];
			hptd.className='bartd';
			backdiv.appendChild(frontdiv);
			statbardiv.appendChild(backdiv);
			hptd.appendChild(statbardiv);
		}
	}
}