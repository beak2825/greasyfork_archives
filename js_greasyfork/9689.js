// ==UserScript==
// @name        Nexus Clash Stat Bars Vertical
// @namespace   http://userscripts.org/users/125692
// @description Adds bars to AP HP and MP
// @include        http://nexusclash.com/modules.php?name=Game*
// @include        http://www.nexusclash.com/modules.php?name=Game*
// @grant          GM_getValue
// @grant          GM_setValue 
// @grant          GM_addStyle
// @version     1.04
// @downloadURL https://update.greasyfork.org/scripts/9689/Nexus%20Clash%20Stat%20Bars%20Vertical.user.js
// @updateURL https://update.greasyfork.org/scripts/9689/Nexus%20Clash%20Stat%20Bars%20Vertical.meta.js
// ==/UserScript==
//for nexus clash. this script
// adds coloured bars to under AP/HP/MP to provide visual referenece to depletion of these stats.
//this version adds the bars vertically in the larger cells under the ap/hp/mp numbers.
//1.01  -muted ap bar green background
//1.02 - try catch about GM_getValue test
//1.03 - bugfix for overmax being broken
//1.04 - bugfix for overmax value 
(function() {
//this copied off the web
//http://stackoverflow.com/questions/9447950/script-to-save-settings
// for chrome as no GM_getValue and GMsetValue available.
//altered thanks to AuxAuv	
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

GM_addStyle(".vbarap{display:inline;margin: 0 0 0 0;padding: 0 0 0 0;position:absolute;top:0px;bottom:0px;left:0px;right:0px;border:1px solid #777777;"+
		"background-color:#84f084;z-index:1;");//  AP bar background
GM_addStyle(".vbarhp{display:inline;margin: 0 0 0 0;padding: 0 0 0 0;position:absolute;top:0px;bottom:0px;left:0px;right:0px;border:1px solid #777777;"+
		"background-color:#ff0000;z-index:1;");// HP bar background is red
GM_addStyle(".vbarmp{display:inline;margin: 0 0 0 0;padding: 0 0 0 0;position:absolute;top:0px;bottom:0px;left:0px;right:0px;border:1px solid #777777;"+
		"background-color:#99d9ea;z-index:1;");// MP bar background light-blue	
GM_addStyle(".vbar2{display:inline;margin: 0 0 0 0;padding: 0 0 0 0;position:absolute;bottom:0px;left:0px;right:0px;"+
		"background-color:#00c000;z-index:2;}");// SET COLOUR FOR FOREGROUND OF BAR 00ff00 is very dark green	
GM_addStyle(".vbarcell{position:relative;min-width:20px}");// Set the containing cell to postion relative so bars can be absolute
GM_addStyle(".vbarcellother{position:relative;z-index:20;}");//set other cell children to relative so z-index can set it overlaid the bars	
GM_addStyle(".vtext{position:absolute;top:-10px;left:-20px;z-index:100;width:100%;height:100%;}");// SET COLOUR FOR FOREGROUND OF BAR 00ff00 is very dark green	
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

	//do it this way as the fonts are removed each loop
	var fontlist = new Array();
	fontlist[0]=charinfodiv.getElementsByTagName("font")[0];//get font
	fontlist[1]=charinfodiv.getElementsByTagName("font")[1];//get font
	fontlist[2]=charinfodiv.getElementsByTagName("font")[2];//get font
	fontlist[3]=charinfodiv.getElementsByTagName("font")[3];
	fontlist[4]=charinfodiv.getElementsByTagName("font")[4];
	fontlist[5]=charinfodiv.getElementsByTagName("font")[5];
	
	if (charmax[0]&&charmax[1]&&charmax[2]){//only if all are true(ie we got a proper value)
		for(i=0;i<3;i++){//for each stat add bar
			
			var font=fontlist[i];
			charstat=font.innerHTML.match(/-?\d+/); //get ap/hp/mp  and if -ve
	
			var vfont=fontlist[i+3];
			var vreddiv=document.createElement('div');
			vreddiv.className = i==0?"vbarap":i==1?"vbarhp":"vbarmp";
			
			if(i==1){//the hp doesn't refill automatically most of the time.
				vreddiv.title=charstat+"/"+charmax[i]+" Need "+
				(Number(charmax[i])-Number(charstat))+"hp healed";
			}
			else{// for ap and mp
				vreddiv.title = charstat+"/"+charmax[i]+" Full in "+ 
				(Number(charmax[i])-Number(charstat))/4+" hours";//assume ap/mp +1 per tick
			}
		
		//right then lets do this.
		//we need to make cell be position relative.
		//div position absolute   t b r l =0px to stretch
		//		div position absolute b r l to ~0px to stretch 
		//other child to postion relative	
		
			var vgreendiv=document.createElement('div');
			var vgreenheight=Math.round(100*(Number(charstat)/Number(charmax[i])));
			if (vgreenheight>100){//for some reason we over max
				vgreenheight=100;
				vgreendiv.style.backgroundColor=OVERMAXCOLOUR;//set to blue to signify over max
			}
			else if (vgreenheight<0){//for some reason we at -ve values
				vgreenheight=0;
			}
			vgreendiv.className="vbar2"; 
			vgreendiv.style.height=""+vgreenheight+"%"//to make out of 20 as int;
			vgreendiv.title=charstat+"/"+charmax[i];
			
			//this bit fixes the width of the cells at 20px.
			var firstcell=font.parentNode;
			firstcell = i==0?font.parentNode.parentNode:font.parentNode;
			firstcell.width='20px';
				
		//put the vertical bars in	
		var vfirstcell=vfont.parentNode.parentNode;//verical bars are one deeper than horizontal
		var vlinkelement=vfont.parentNode;
		if(i==0){//first time is nested deeper
			vfirstcell=vfont.parentNode.parentNode.parentNode;//ap is in extra b tag
			vlinkelement=vfont.parentNode.parentNode;
		}
					
		//for vertical replace vfont with a span with class and stuff	
		var vtext=vfont.innerHTML;
		//remove font element
    vlinkelement.removeChild(vlinkelement.firstChild);//empty the a link?
		vlinkelement.textContent=vtext;
		
		vfirstcell.className="vbarcell";
		vfirstcell.align='center';
		vfirstcell.insertBefore(vlinkelement,vfirstcell.firstChild);
		vfirstcell.lastChild.className+="vbarcellother";//set the style of the vertical bar containing cell
		vreddiv.insertBefore(vgreendiv,vreddiv.firstChild);//put top bar in lower background bar 
		vfirstcell.insertBefore(vreddiv,vfirstcell.firstChild);//put the bars into the cell
			
		}
	}
}
//EOF
})();