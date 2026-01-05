// ==UserScript==
// @name          Village Page Reorganizer
// @namespace     FaxCelestis
// @description   Highlights, rearranges, and adds context to village page
// @include       *animecubed.com/billy/bvs/village.h*
// @grant         GM_addStyle
// @author        FaxCelestis
// @version       1.1d
// 0.1 - Does Stuff. And possibly also Things.
// 0.1a - successfully implemented tabs for left bar boxes
// 0.1b - in process of parsing village info and putting it into vinfo tab. Getting the villager list was a bitch and a half. Still not sure what's causing the weird overhang on the right, but that needs to comment out anyway
// 0.1c - weird overhang handled, most of village page parsed into tabs
// 1.0 - initial release. Still does not handle zombjas, snow, resupply, or festival
// 1.0a - now handles zombjas, but still no snow, resupply, or festival. Or Hidden Ho-Claus for that matter.
// 1.0b - now handles snow. Still need HHC, resupply, festival, possibly dice altar. Also incidentally realigns the leave village box with the left margin because its centered alignment was annoying me.
// 1.0c - now handles HHC, added contract milling back in, whoops.
// 1.0d - fixes an issue with prepped invasions
// 1.0e - commentary and general cleanup, recolorization of tab headers for better integration. Also invasion prep issue fixed for real.
// 1.0f - possible FF bugfix?
// 1.0g - actual FF bugfix
// 1.0h - fixes issue with kaiju summoning
// 1.0i - fixes issue with ingredient hunting, moves Fighto and Lucha to Battle tab, moves Leave Village to Village Admin tab
// 1.1 - adds village applications. New version ID because this is a big change. Currently does not interact with wandering genin, but all other application and member functions are now functional.
// 1.1a - really fixes the issue with ingredient hunting for real this time
// 1.1b - fixes an issue with regex not finding the ability to mill contracts in Firefox
// 1.1c - fixes an issue with peacetime
// 1.1d - adds festival functionality, resupply action

// @downloadURL https://update.greasyfork.org/scripts/9410/Village%20Page%20Reorganizer.user.js
// @updateURL https://update.greasyfork.org/scripts/9410/Village%20Page%20Reorganizer.meta.js
// ==/UserScript==
// get player and password hash from html, necessary to build task boxes
var player = document.getElementsByName("player")[1].value;
var pass = document.getElementsByName("pwd")[1].value;

//determine availability of features with binary variables
var isCandyween = (document.body.innerHTML.match(/document.candyween.submit/g) || []).length;
var isFestival = (document.body.innerHTML.match(/document.festival.submit/g) || []).length;
var hasPF = (document.body.innerHTML.match(/document.pgfestival.submit/g) || []).length;
var isSnow = (document.body.innerHTML.match(/document.snowday.submit/g) || []).length;
var isHHC = (document.body.innerHTML.match(/document.hoclaus.submit/g) || []).length;
var kaijuAvail = (document.body.innerHTML.match(/document.kat.submit/g) || []).length;
var zombjasAvail = (document.body.innerHTML.match(/document.zat.submit/g) || []).length;
var phaseAvail = (document.body.innerHTML.match(/document.phases.submit/g) || []).length;
var pwAvail = (document.body.innerHTML.match(/document.pizzamenu.submit/g) || []).length;
var bConAvail = (document.body.innerHTML.match(/document.concenter.submit/g) || []).length;
var canSpy = (document.body.innerHTML.match(/document.spy.submit/g) || []).length;
var canAttack = (document.body.innerHTML.match(/document.vattack.submit/g) || []).length;
var canBingo = (document.body.innerHTML.match(/document.bbook.submit/g) || []).length;
var canSci = (document.body.innerHTML.match(/document.science.submit/g) || []).length;
var marketAvail = (document.body.innerHTML.match(/document.market.submit/g) || []).length;
var canEnhance = (document.body.innerHTML.match(/document.jenhance.submit/g) || []).length;
var canFighto = (document.body.innerHTML.match(/document.robofighto.submit/g) || []).length;
var canVaca = (document.body.innerHTML.match(/document.ninjabeach.submit/g) || []).length;
var canPerm = (document.body.innerHTML.match(/document.setperm.submit/g) || []).length;
var canInquisit = (document.body.innerHTML.match(/document.irreport.submit/g) || []).length;
var canGetSpies = (document.body.innerHTML.match(/document.spyreport.submit/g) || []).length;
var canEat = (document.body.innerHTML.match(/document.ramen.submit/g) || []).length;
var canChillax = (document.body.innerHTML.match(/document.brotime.submit/g) || []).length;
var BTVAvail = (document.body.innerHTML.match(/document.tvtime.submit/g) || []).length;
var canLemonaid = (document.body.innerHTML.match(/document.lemonaid.submit/g) || []).length;
var canRock = (document.body.innerHTML.match(/document.blackstones.submit/g) || []).length;
var canRoll = (document.body.innerHTML.match(/document.dicetime.submit/g) || []).length; //ha ha, canRock and canRoll
var canStudy = (document.body.innerHTML.match(/document.pandtime.submit/g) || []).length;
var canLucha = (document.body.innerHTML.match(/document.eldiablo.submit/g) || []).length;
var canHunt = (document.body.innerHTML.match(/document.ingredienthunt.submit/g) || []).length;
var canNoteProtect = (document.body.innerHTML.match(/document.obscure.submit/g) || []).length;
var fieldsAvail = (document.body.innerHTML.match(/document.fieldmenu.submit/g) || []).length;
var spendZR = (document.body.innerHTML.match(/document.zrt.submit/g) || []).length;
var canCollect = (document.body.innerHTML.match(/document.rescol.submit/g) || []).length;
var canPatrol = (document.body.innerHTML.match(/document.patrol.submit/g) || []).length;
var canPaperwork = (document.body.innerHTML.match(/document.paperwork.submit/g) || []).length;
var canRepair = (document.body.innerHTML.match(/document.repcol.submit/g) || []).length;
var canSiege = (document.body.innerHTML.match(/document.sgrs.submit/g) || []).length;
var canDeclare = (document.body.innerHTML.match(/document.vwars.submit/g) || []).length;
var canDonate = (document.body.innerHTML.match(/document.cryo.submit/g) || []).length;
var canApprove = (document.body.innerHTML.match(/document.allapp.submit/g) || []).length;
var canOpenApp = (document.body.innerHTML.match(/document.allapp2.submit/g) || []).length;
var canResupply = (document.body.innerHTML.match(/document.zatrs.submit/g) || []).length;

//inject tab CSS into stylesheet
function addTabCSS() {
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = "ul#tabs { list-style-type: none; margin: 30px 0 0 0; padding: 0 0 0.3em 0; } ul#tabs { list-style-type: none; margin: 30px 0 0 0; padding: 0 0 0.3em 0; } ul#tabs li { display: inline; } ul#tabs li a { color: #59421b; background-color: #dabb86; border: 1px solid #59421b; border-bottom: none; padding: 0.3em; text-decoration: none; font-size: 0.75em } ul#tabs li a:hover { background-color: #e8d4b3; font-size: 0.75em } ul#tabs li a.selected { color: #000000; background-color: #dabb86; font-weight: bold; padding: 0.7em 0.3em 0.38em 0.3em; font-size: 0.9em } div.tabContent { border: 1px solid #59421b; padding: 0.5em; background-color: #E0C69A; } div.tabContent.hide { display: none; }";
    document.head.appendChild(css);
}

//declare some variables for later and start the tables for the content divs
var contentInsert = [];
var events = "<table width=\"220\">";
var battle = "<table width=\"220\">";
var attack = "<table width=\"440\"><tr valign=\"top\"><td>";
var admin = "<table width=\"440\"><tr><td><table width=\"220\">";
var vcenter = "<table width=\"440\"><tr valign=\"top\"><td>";
var vinfo = "<table width=\"440\">";

//build content divs based upon initial binary variable declarations
vcenter = vcenter.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#040449;background-image:url(/billy/layout/phousevilbg.jpg);color:white;background-color:black;font-size:12px;font-family:arial\">Chat, relax, and win fabulous prizes!<br><form name=\"partyhouse\" style=\"margin:0\" action=\"partyhouse.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.partyhouse.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Party House</b></a></p><noscript><input type=\"submit\" VALUE=\"Party House\"></noscript></form></tr></table>");

vcenter = vcenter.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#040449;background-color:#111153;color:white;font-size:12px;font-family:arial\">Give and Take Items in the Storehouse!<br><form name=\"shouse\" style=\"margin:0\" action=\"villagestorehouse.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.shouse.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Storehouse &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"Storehouse &gt;\"></noscript></form></tr></table>");

if (isCandyween > 0) {
    events = events.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#E27119;background-color:#000000;color:#E27119;font-family:arial;font-size:12px\">It's Candyween!<br><form name=\"candyween\" style=\"margin:0\" action=\"villagecandyween.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.candyween.submit();\" onfocus=\"this.blur();\" style=\"color:#F07020; font-size:14px\"><b>Candyween! &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"Candyween!\"></noscript></form></td></tr>");
}

if (isFestival > 0) {
    events = events.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#000033;background-color:#000099;background-image:url(/billy/layout/festivallink.jpg);color:white;font-family:arial;font-size:12px\">It's Festival Day!<br><form name=\"festival\" style=\"margin:0\" action=\"festival.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.festival.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Festival Day! &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"Festival Day!\"></noscript></form></tr>");
}

if (hasPF > 0) {
    events = events.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#000033;background-color:#000099;background-image:url(/billy/layout/festivallink.jpg);color:white;font-family:arial;font-size:12px\">It\'s Festival day - if you want it to be!<br><div align=\"right\">(Personal Festival ends at Dayroll!)</div><br><form name=\"pgfestival\" style=\"margin:0\" action=\"village.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.pgfestival.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Start Personal Festival!</b></a><br><input type=\"checkbox\" name=\"pgfestival\" value=\"1\"><font color=\"FFFFFF\"> (confirm)</font></p><noscript><input type=\"submit\" VALUE=\"Start your Personal Festival!\"></noscript></form></tr>");
}

if (isSnow > 0) {
    events = events.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#FFFFFF;background-color:#444488;color:white;font-family:arial;font-size:12px\">Oh, man, look at all the snow...<br><form name=\"snowday\" style=\"margin:0\" action=\"villagesnowday.html\" method=\"post\"><input name=\"player\" value=\"" + player + "\" type=\"hidden\"><input name=\"pwd\" value=\"" + pass + "\" type=\"hidden\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.snowday.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Snow Day! &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"Snow Day!\"></noscript></form></td></tr>");
}

if (isHHC > 0) {
    events = events.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#660000;background-color:#006600;color:white;font-family:arial;font-size:12px\">It's Ninja-Mas Eve!<br><form name=\"hoclaus\" style=\"margin:0\" action=\"villagehoclaus.html\" method=\"post\"><input name=\"player\" value=\"" + player + "\" type=\"hidden\"><input name=\"pwd\" value=\"" + pass + "\" type=\"hidden\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.hoclaus.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Hidden HoClaus! &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"Hidden HoClaus!\"></noscript></form></td></tr>");
}

if (kaijuAvail > 0) {
    battle = battle.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#411E01;background-color:#000000;color:white;font-family:arial;font-size:12px\">Your village is under attack by a giant monster!<br><form name=\"kat\" style=\"margin:0\" action=\"villagemonsterfight.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.kat.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Kaiju Battle! &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"Monster Fight\"></noscript></form></td></tr>");
}

if (zombjasAvail > 0) {
    battle = battle.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#014E01;background-color:#003300;color:white;font-family:arial;font-size:12px\">Zombjas have attacked your Village!<br><form name=\"zat\" style=\"margin:0\" action=\"zombjas.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.zat.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Zombja Battle! &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"Zombja Fight\"></noscript></form></td></tr>");
}

if (phaseAvail > 0) {
    battle = battle.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#1E4101;background-color:#000000;color:white;font-family:arial;font-size:12px\">Multi-Dimensional Kaiju!<br><form name=\"phases\" style=\"margin:0\" action=\"villagephases.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.phases.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Phase Menu &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"Phase Menu\"></noscript></form></td></tr>");
}

if (pwAvail > 0) {
    vcenter = vcenter.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#990000;background-color:white;color:006600;font-family:arial;font-size:12px\">Drop By PizzaWitch!<br><form name=\"pizzamenu\" style=\"margin:0\" action=\"pizzawitchgarage.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.pizzamenu.submit();\" onfocus=\"this.blur();\" style=\"color:#006600; font-size:14px\"><b>PizzaWitch Delivery &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"Deliveries &gt;\"></noscript></form></td></tr></table>");
}

if (bConAvail > 0) {
    vcenter = vcenter.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#1E0141;background-color:#000040;color:white;font-family:arial;font-size:12px\">Go to the Convention Center!<br><form name=\"concenter\" style=\"margin:0\" action=\"billycon-register.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.concenter.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Register for BillyCon &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"Register for BillyCon\"></noscript></form></td></tr></table>");
}

if (canSpy > 0) //TODO: if-bingoed statement
{
    attack = attack.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#411E01;background-color:#834411;color:white;font-family:arial;font-size:12px\">Spy on other villages to find out where to get the rare resources your village needs!<br><form name=\"spy\" style=\"margin:0\" action=\"villagespy.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.spy.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Spy on Other Villages &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"Spy on Other Villages\"></noscript></form></tr></table>");
}

if (canAttack > 0) //TODO: if-bingoed statement
{
    attack = attack.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#490404;background-color:#530606;color:white;font-size:12px\">Attack other villages for resources and XP!<br><form name=\"vattack\" style=\"margin:0\" action=\"villageattack.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.vattack.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Attack Other Villages &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"Attack Other Villages\"></noscript></form></tr></table>");
}

if (canBingo > 0) //TODO: if-bingoed statement
{
    attack = attack.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#490404;background-color:#831111;color:white;font-size:12px\">Sick of enemy Ninja raiding your village? Take care of them first!<br><form name=\"bbook\" style=\"margin:0\" action=\"bingo.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.bbook.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Go To Bingo Book &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"Bingo Book\"></noscript></form></tr></table>");
}

if (canSci > 0) {
    admin = admin.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#040449;background-color:#831111;color:white;font-size:12px;font-family:arial\">Perform mad experiments to enhance your village!<br><form name=\"science\" style=\"margin:0\" action=\"villagescience.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.science.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>SCIENCE!</b></a></p><noscript><input type=\"submit\" VALUE=\"SCIENCE!\"></noscript></form></td></tr>");
}

if (marketAvail > 0) {
    vcenter = vcenter.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#404409;background-color:#444411;color:white;font-size:12px;font-family:arial\">Buy and sell items!<br><form name=\"market\" style=\"margin:0\" action=\"villagemarketplace.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.market.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Marketplace &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"Marketplace &gt;\"></noscript></form></tr></table>");
}

if (canEnhance > 0) {
    vcenter = vcenter.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#490404;background-color:#111141;color:white;font-size:12px;font-family:arial\">Enhance the quality of your Jutsu!<br><form name=\"jenhance\" style=\"margin:0\" action=\"villagejenhance.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.jenhance.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Jutsu Enhancement</b></a></p><noscript><input type=\"submit\" VALUE=\"Jutsu Enhancement\"></noscript></form></tr></table>");
}

if (canFighto > 0) {
    battle = battle.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#490404;background-color:#114111;color:white;font-size:12px;font-family:arial\">Enter the ROBO FIGHTO!<br><form name=\"robofighto\" style=\"margin:0\" action=\"villagerobofighto.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.robofighto.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>FIGHTO</b></a></p><noscript><input type=\"submit\" VALUE=\"FIGHTO\"></noscript></form></tr>");
}

if (canVaca > 0) {
    vcenter = vcenter.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#111E01;background-color:#434411;color:white;font-family:arial;font-size:12px\">Relax on the beach!<br><form name=\"ninjabeach\" style=\"margin:0\" action=\"villagebeach.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.ninjabeach.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Vacation!</b></a></p><noscript><input type=\"submit\" VALUE=\"Vacation!\"></noscript></form></tr>");
}

if (canPerm > 0) {
    admin = admin.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#040449;background-color:#531111;color:white;font-size:12px;font-family:arial\">Set Villager Permissions!<br><form name=\"setperm\" style=\"margin:0\" action=\"villagepermissions.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.setperm.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Permissions &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"Permissions &gt;\"></noscript></form></td></tr>");
}

if (canInquisit > 0) {
    attack = attack.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#240904;background-color:#230606;color:white;font-size:12px;font-family:arial\">Check your Village for Spies!<br><form name=\"irreport\" style=\"margin:0\" action=\"village.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"hidden\" name=\"interrocheck\" value=\"go\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.irreport.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Launch Inquisition</b></a></p><noscript><input type=\"submit\" VALUE=\"Interrogate\"></noscript></form></tr></table>");
}

if (canGetSpies > 0) {
    attack = attack.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#440409;background-color:#531111;color:white;font-size:12px;font-family:arial\">Get a Report from all active Spies<br><form name=\"spyreport\" style=\"margin:0\" action=\"village.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"hidden\" name=\"network\" value=\"go\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.spyreport.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Get Spy Report</b></a></p><noscript><input type=\"submit\" VALUE=\"Get Spy Report\"></noscript></form></tr></table>");
}

if (canEat > 0) {
    var pullsAllowed = /Pulls allowed today: ([\d]+)/.exec(document.body.innerHTML)[1];
    var currentJXP = /Current JXP: ([\d,]+)/.exec(document.body.innerHTML)[1];
    vcenter = vcenter.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#040449;background-color:#115311;color:white;font-size:12px;font-family:arial\">Swipe some eats at the Ramen Shop!<br>Pulls allowed today: " + pullsAllowed + "<br>Current JXP: " + currentJXP + "<br>All costs x10 for second ramen!<br><form name=\"ramen\" style=\"margin:0\" action=\"village.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"radio\" name=\"ramentobuy\" value=\"chak\" ><b>Chicken Ramen</b><br>&nbsp;&nbsp;(+500 Chakra) - 15,000 JXP<br><input type=\"radio\" name=\"ramentobuy\" value=\"app\" ><b>Diet Ramen</b><br>&nbsp;&nbsp;(+40 Appetite) - 15,000 JXP<br><input type=\"radio\" name=\"ramentobuy\" value=\"bonus\" ><b>Red Fox Ramen</b><br>&nbsp;&nbsp;(+3 Levels on Missions today) - 60,000 JXP<br><input type=\"radio\" name=\"ramentobuy\" value=\"stam\" ><b>Beef Ramen</b><br>&nbsp;&nbsp;(+30 Stamina) - 90,000 JXP<br><input type=\"radio\" name=\"ramentobuy\" value=\"find\" ><b>Ichi Special</b><br>&nbsp;&nbsp;(+100% Find Ninja/Items Chance) - 100,000 JXP<br><input type=\"radio\" name=\"ramentobuy\" value=\"stam2\" ><b>Teriyaki Ramen</b><br>&nbsp;&nbsp;(+100 Stamina) - 400,000 JXP<br><input type=\"radio\" name=\"ramentobuy\" value=\"glad\" ><b>The Gladiator</b> (It's Got Electrolytes!)<br>&nbsp;&nbsp;(+10 Arena Fights) - 1,000,000 JXP<br><input type=\"radio\" name=\"ramentobuy\" value=\"dou\" ><b>Greassy Ramen</b> (Mmm, Grindy!)<br>&nbsp;&nbsp;(+200% Dou AP / -80% Ranking XP) - 3,000,000 JXP<br><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.ramen.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Purchase Ramen</b></a></p><noscript><input type=\"submit\" VALUE=\"Purchase Ramen\"></noscript></form></tr></table></td><td>");
}

if (canChillax > 0) {
    vcenter = vcenter.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#000000;background-color:#111166;color:white;font-size:12px;font-family:arial\">Chillax in front of the Manly Altar!<br><form name=\"brotime\" style=\"margin:0\" action=\"village.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"hidden\" name=\"brofist\" value=\"1\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.brotime.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Chillax, Bro.</b></a></p><noscript><input type=\"submit\" VALUE=\"Chillax, Bro.\"></noscript></form></tr></table>");
}

if (BTVAvail > 0) {
    vcenter = vcenter.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#000000;background-color:#116611;color:white;font-size:12px;font-family:arial\">Go see how a hit show is made!<br><form name=\"tvtime\" style=\"margin:0\" action=\"billytv.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.tvtime.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>It's BillyTV!</b></a></p><noscript><input type=\"submit\" VALUE=\"It's BillyTV!\"></noscript></form></tr></table>");
}

if (canLemonaid > 0) {
    vcenter = vcenter.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#000000;background-color:#444400;color:white;font-size:12px;font-family:arial\">Have some tasty Lemonade!<br><form name=\"lemonaid\" style=\"margin:0\" action=\"village.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"hidden\" name=\"lemonaid\" value=\"1\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.lemonaid.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>More like Lemon-\"aid\" amirite? &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"More like Lemon-aid amirite? &gt;\"></noscript></form></tr></table>");
}

if (canRock > 0) {
    vcenter = vcenter.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#000000;background-color:#116611;color:white;font-size:12px;font-family:arial\">Go to a Black Stones Concert!<br><form name=\"blackstones\" style=\"margin:0\" action=\"village.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><input type=\"hidden\" name =\"blackstone\" value=\"1\"><a href=\"javascript:document.blackstones.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Rock On!</b></a></p><noscript><input type=\"submit\" VALUE=\"Rock On!\"></noscript></form></tr></table>");
}

if (canRoll > 0) // no idea why the font color tags are't working here
{
    var LWC = (document.body.innerHTML.match(/auto-rerolls/g).length || []);
    if (LWC > 0) {
        vcenter = vcenter.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#000000;background-color:#116611;color:white;font-size:12px;font-family:arial\">The Dice call to you...<br><form name=\"dicetime\" style=\"margin:0\" action=\"village.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><br><input type=\"hidden\" name=\"diceuse\" value=\"1\">Preferred Roll: <select name=\"diceuseb\"><option value=\"0\">Not Pestilence</option><option value=\"1\">Food</option><option value=\"2\">Coin</option><option value=\"3\">Workers</option></select><font style=\"font-size:12px\"><i><br>(auto-rerolls once if chosen type not rolled)</i></font><br><a href=\"javascript:document.dicetime.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Roll That Die!</b></a></p><noscript><input type=\"submit\" VALUE=\"Roll That Die!\"></noscript></form></tr></table>");
    } else {
        vcenter = vcenter.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#000000;background-color:#331100;color:white;font-size:12px;font-family:arial\">The Dice call to you...<br><form name=\"dicetime\" style=\"margin:0\" action=\"village.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><input type=\"hidden\" name=\"diceuse\" value=\"0\"><a href=\"javascript:document.dicetime.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Roll That Die!</b></a></p><noscript><input type=\"submit\" VALUE=\"Roll That Die!\"></noscript></form></tr></table>");
    }
}

if (canStudy > 0) {
    vcenter = vcenter.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#000000;background-color:#661111;color:white;font-size:12px;font-family:arial\">Study at the Pandora Library!<br><form name=\"pandtime\" style=\"margin:0\" action=\"village.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"hidden\" name=\"pandlib\" value=\"1\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.pandtime.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Get your Learn On!</b></a></p><noscript><input type=\"submit\" VALUE=\"Get your Learn On!\"></noscript></form></tr></table>");
}

if (canLucha > 0) {
    battle = battle.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#000000;background-color:#660000;color:white;font-size:12px;font-family:arial\">Face off against<br><font style=\"font-variant:small-caps;font-size:16px\"><b><i>El Diablo Supreme!</i></b></font><br><form name=\"eldiablo\" style=\"margin:0\" action=\"villagediablo.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.eldiablo.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>&#161;Lucha!</b></a></p><noscript><input type=\"submit\" VALUE=\"&#161;Lucha!\"></noscript></form></tr>");
}

if (canHunt > 0) {
    var huntVars = /Hunt for Ingredients!<br>([\w\W]+)<b>Choose Area/.exec(document.body.innerHTML);
    huntVars = huntVars[1];
    var dumpster = (document.body.innerHTML.match(/BurgerNinja Dumpster/g) || []).length;
    var trash = (document.body.innerHTML.match(/TV Actor Trashcans/g) || []).length;
    var trickOrTreat = (document.body.innerHTML.match(/Trick or Treating/g) || []).length;
    var gothgoth = (document.body.innerHTML.match(/Perfect Girl Evolution: Goth Goth/g) || []).length;

    vcenter = vcenter.concat("<table width=\"220\"><tr><td style=\"border-width:2px;border-style:solid;border-color:#044409;background-color:#115311;color:white;font-size:12px;font-family:arial\">Hunt for Ingredients!<br>" + huntVars + "<br><form name=\"ingredienthunt\" style=\"margin:0\" action=\"village.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"hidden\" name=\"ingredients\" value=\"go\"><b>Choose Area:</b><br><input type=\"radio\" name=\"ingredientplace\" value=\"forest\"> Forest<br>");
    if (dumpster > 0) {
        vcenter = vcenter.concat("<input type=\"radio\" name=\"ingredientplace\" value=\"dumpster\"> BurgerNinja Dumpster<br>");
    }
    if (trash > 0) {
        vcenter = vcenter.concat("<input type=\"radio\" name=\"ingredientplace\" value=\"idol\"> TV Actor Trashcans<br>");
    }
    if (trickOrTreat > 0) {
        vcenter = vcenter.concat("<input type=\"radio\" name=\"ingredientplace\" value=\"treat\"> Trick or Treating<br>");
    }
    if (gothgoth > 0) {
        vcenter = vcenter.concat("<input type=\"checkbox\" name=\"gothgoth\" value=\"go\" > Use <b>Perfect Girl Evolution: Goth Goth</b><br>&nbsp;&nbsp;&nbsp;&nbsp;(-50 Stamina, +5 Ingredients per Pull)<br>");
    }
    vcenter = vcenter.concat("<p style=\"margin:0; text-align:right\"><a href=\"javascript:document.ingredienthunt.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Hunt for Ingredients</b></a></p><noscript><input type=\"submit\" VALUE=\"Hunt for Ingredients\"></noscript></form></tr></table>");
}

if (canDeclare > 0) {

    attack = attack.concat("<table width=\"220\" style=\"background-color:#000000;border-color:#CC0000;border-style:solid;border-width:2px;color:white;font-size:12px;font-family:arial\"><tr><td>Declare War and Siege!<form action=\"villagewars.html\" name=\"vwars\" method=\"post\" style=\"margin:0\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><a href=\"javascript:document.vwars.submit();\" onfocus=\"this.blur();\" style=\"color:A10000; font-variant: small-caps; font-size:14px\"><p style=\"margin:0; text-align:right\"><b><font color=\"FF0000\">The Bunker &gt;</font></b></a></p><noscript><input type=\"submit\" VALUE=\"The Bunker &gt;\"></noscript></form></td></tr></table>");
}

if (canNoteProtect > 0) {
    var isNotProtected = (document.body.innerHTML.match(/You are <b>Not Protected<\/b>/g) || []).length;
    var levCost = /24 hours\. ([\d,]+) Ryo per Level/g.exec(document.body.innerHTML)[1];
    var cost = /Obfuscation Timer \(([\d,]+) Ryo/g.exec(document.body.innerHTML)[1];

    attack = attack.concat("</td><td><table width=\"220\"><table width=\"220\"><tr><td style=\"font-variant: small-caps; border-width:2px;border-style:solid;border-color:#040404;background-color:#111111;color:white;font-size:12px;font-family:arial\">Protect Yourself from The Note<br>for 24 hours. " + levCost + " Ryo per Level.<br>(You are ");
    if (isNotProtected > 0) {
        attack = attack.concat("<b>Not Protected</b>)<br></center>");
    } else {
        attack = attack.concat("<b>Currently Protected</b>)<br></center>");
    }
    attack = attack.concat("<form name=\"obscure\" style=\"margin:0\" action=\"village.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"checkbox\" name=\"obscure\" value=\"doit\" > Add 86400 seconds to your<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Obfuscation Timer (" + cost + " Ryo).<br><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.obscure.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Obscure your Name</b></a></p><noscript><input type=\"submit\" VALUE=\"Obscure your Name\"></noscript></form><br><center>(costs increase 50 per level after each use. to reset cost, go without protection for 48 hours.)</center></tr></table>");
}

if (fieldsAvail > 0) {
    battle = battle.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#1E4101;background-color:#004000;color:white;font-family:arial;font-size:12px\">Explore other Fields!<br><form name=\"fieldmenu\" style=\"margin:0\" action=\"villagefields.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.fieldmenu.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Field Menu &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"Field Menu\"></noscript></form></tr>");
}

if (spendZR > 0) {
    battle = battle.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#4E0101;background-color:#330000;color:white;font-family:arial;font-size:12px\">Spend your Z-Rewards!<br><form name=\"zrt\" style=\"margin:0\" action=\"zombjarewards.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.zrt.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Spend Z-Rewards &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"Spend Z-Rewards\"></noscript></form></tr>");
}

if (canCollect > 0) {
    admin = admin.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#044904;background-color:#115311;color:white;font-size:12px;font-family:arial\">Gather resources to build Village Upgrades!<br><form name=\"rescol\" style=\"margin:0\" action=\"village.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"hidden\" name=\"helpvillage\" value=\"collect\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.rescol.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Collect Resources</b></a></p><noscript><input type=\"submit\" VALUE=\"Help Collect Resources\"></noscript></form></td></tr>");
}

if (canPatrol > 0) {
    admin = admin.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#490404;background-color:#531111;color:white;font-size:12px;font-family:arial\">Patrol to defend your village from attacks!<br><form name=\"patrol\" style=\"margin:0\" action=\"village.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"hidden\" name=\"helpvillage\" value=\"patrol\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.patrol.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Patrol</b></a></p><noscript><input type=\"submit\" VALUE=\"Go On Patrol\"></noscript></form></td></tr>");
}

if (canPaperwork > 0) {
    admin = admin.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#490404;background-color:#531111;color:white;font-size:12px;font-family:arial\">Help the Village with submitting Mission Results!<br><form name=\"paperwork\" style=\"margin:0\" action=\"village.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"hidden\" name=\"helpvillage\" value=\"paperwork\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.paperwork.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Do Paperwork</b></a></p><noscript><input type=\"submit\" VALUE=\"Do Paperwork\"></noscript></form></td></tr>");
}

if (canRepair > 0) {
    admin = admin.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#044904;background-color:#111153;color:white;font-size:12px;font-family:arial\">Help Repair your Village!<br><form name=\"repcol\" style=\"margin:0\" action=\"village.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"hidden\" name=\"helpvillage\" value=\"repair\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.repcol.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Help with Repairs</b></a></p><noscript><input type=\"submit\" VALUE=\"Help Repair\"></noscript></form></td></tr>");
}

if (canSiege > 0) {
    admin = admin.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#0E0101;background-color:#220000;color:white;font-family:arial;font-size:12px\">Siege enemy Villages!<br><form name=\"repcol\" style=\"margin:0\" action=\"village.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"hidden\" name=\"helpvillage\" value=\"siege\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.sgrs.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Siege! &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"Siege!\"></noscript></form></td></tr>");
}

if (canResupply > 0) {
    admin = admin.concat("<tr><td style=\"border-width:2px;border-style:solid;border-color:#010E01;background-color:#002200;color:white;font-family:arial;font-size:12px\">Resupply the Z-Fighters!!<br><form name=\"zatrs\" style=\"margin:0\" action=\"village.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"hidden\" name=\"helpvillage\" value=\"resupply\"><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.zatrs.submit();\" onfocus=\"this.blur();\" style=\"color:white; font-size:14px\"><b>Resupply! &gt;</b></a></p><noscript><input type=\"submit\" VALUE=\"Resupply!\"></noscript></form></td></tr>");
}


//declare some variables for purposes of building village info
var resources = [];
var bRes = [];
var aRes = [];
var PM = [];
var MW = [];
var BC = [];
var SF = [];
var UI = [];
var pcbRes = [];
var pcaRes = [];
var vryo = [];
var bankium = [];

//check to see if the village is NRF and has bankium
var NRF = (document.body.innerHTML.match(/Percentage Chance of finding an Advanced Resource:/g) || []).length;
var hasBankium = (document.body.innerHTML.match(/Bankium Bars:/g) || []).length;

if (NRF > 0) {
    bRes = /Resource: ([\w\s]+)<br>Advanced Resource: ([\w\s]+)/g.exec(document.body.innerHTML)[1];
    aRes = /Resource: ([\w\s]+)<br>Advanced Resource: ([\w\s]+)/g.exec(document.body.innerHTML)[2];
    PM = /<li>Precious Metals: ([\d]+)/g.exec(document.body.innerHTML)[1];
    MW = /<li>Medicinal Water: ([\d]+)/g.exec(document.body.innerHTML)[1];
    BC = /<li>Brilliant Crystals: ([\d]+)/g.exec(document.body.innerHTML)[1];
    SF = /<li>Solid Fire: ([\d]+)/g.exec(document.body.innerHTML)[1];
    UI = /<li>Unmelting Ice: ([\d]+)/g.exec(document.body.innerHTML)[1];
    vryo = /<li>Village Ryo: ([\d,]+)/g.exec(document.body.innerHTML)[1];
    pcbRes = /Percentage Chance of finding a Resource: ([\d]+)%/g.exec(document.body.innerHTML)[1];
    pcaRes = /Percentage Chance of finding an Advanced Resource: ([\d]+)%/g.exec(document.body.innerHTML)[1];
    vinfo = vinfo.concat("<tr><td><table width=\"440\"><tr><td align=\"left\" width=\"220\"><br><font style=\"font-size:14px\"><b>Resources:</b></font></td><td align=\"left\" width=\"220\"><br><font style=\"font-size:14px\"><b>Stats:</b></font></td></tr></table><table width=\"440\" style=\"border-width:1px;border-style:dotted;border-color:#A75928;background-color:#E0C69A;font-size:12px\"><tr><td>Resource: " + bRes + "<br>Advanced Resource: " + aRes + "<br><br>Percentage Chance of finding a Resource: " + pcbRes + "%<br><br>Percentage Chance of finding an Advanced Resource: " + pcaRes + "%<br><br><ul style=\"margin:0\"><li>Brilliant Crystals: " + BC + "</li><li>Medicinal Water: " + MW + "</li><li>Precious Metals: " + PM + "</li><li>Solid Fire: " + SF + "</li><li>Unmelting Ice: " + UI + "</li><li>Village Ryo: " + vryo + "</li>");
} else {
    bRes = /Resource: ([\w\s]+)<br>/g.exec(document.body.innerHTML)[1];
    PM = /<li>Precious Metals: ([\d]+)/g.exec(document.body.innerHTML)[1];
    MW = /<li>Medicinal Water: ([\d]+)/g.exec(document.body.innerHTML)[1];
    BC = /<li>Brilliant Crystals: ([\d]+)/g.exec(document.body.innerHTML)[1];
    vryo = /<li>Village Ryo: ([\d,]+)/g.exec(document.body.innerHTML)[1];
    pcbRes = /Percentage Chance of finding a Resource: ([\d]+)%/g.exec(document.body.innerHTML)[1];
    vinfo = vinfo.concat("<tr><td><table width=\"220\"><tr><td align=\"left\"><br><font style=\"font-size:14px\"><b>Resources:</b></font></td><td align=\"left\" width=\"220\"><br><font style=\"font-size:14px\"><b>Stats:</b></font></td></tr></table><table width=\"220\" style=\"border-width:1px;border-style:dotted;border-color:#A75928;background-color:#E0C69A;font-size:12px\"><tr><td>Resource: " + bRes + "<br>Advanced Resource: " + aRes + "<br><br>Percentage Chance of finding a Resource: " + pcbRes + "%<br><br><ul style=\"margin:0\"><li>Brilliant Crystals: " + BC + "</li><li>Medicinal Water: " + MW + "</li><li>Precious Metals: " + PM + "</li><li>Village Ryo: " + vryo + "</li>");
}

if (hasBankium > 0) {
    bankium = /<li>Bankium Bars: ([\d]+)/g.exec(document.body.innerHTML)[1];
    vinfo = vinfo.concat("<li>Bankium Bars: " + bankium + "</li></ul></td>");
} else {
    vinfo = vinfo.concat("</ul></td>");
}

// declare some variables for building the villager structure
var rootnin = [];
var sannin = [];
var jonin = [];
var specjo = [];
var chunin = [];
var genin = [];
var nonja = [];

var numroot = 0;
var numsan = 0;
var numjon = 0;
var numspecjo = 0;
var numchu = 0;
var numgen = 0;
var numnon = 0;

// this is really complicated, but it works
var indRoot = document.body.innerHTML.indexOf("R00t+:");
var indSan = document.body.innerHTML.indexOf("<b>Sannin:</b>");
var indJo = document.body.innerHTML.indexOf("<b>Jonin:</b>");
var indSpecJo = document.body.innerHTML.indexOf("Sp. Jonin:");
var indChu = document.body.innerHTML.indexOf("Chunin:");
var indGen = document.body.innerHTML.indexOf("Genin:");
var indNon = document.body.innerHTML.indexOf("Nonja:");
var memKey = document.body.innerHTML.indexOf("-- Member Key");

if (indRoot > 0) {
    if (indSan > 0) {
        rootnin = document.body.innerHTML.slice(indRoot, indSan);
    } else if (indJo > 0) {
        rootnin = document.body.innerHTML.slice(indRoot, indJo);
    } else if (indSpecJo > 0) {
        rootnin = document.body.innerHTML.slice(indRoot, indSpecJo);
    } else if (indChu > 0) {
        rootnin = document.body.innerHTML.slice(indRoot, indChu);
    } else if (indGen > 0) {
        rootnin = document.body.innerHTML.slice(indRoot, indGen);
    } else if (indNon > 0) {
        rootnin = document.body.innerHTML.slice(indRoot, indNon);
    } else {
        rootnin = document.body.innerHTML.slice(indRoot, memKey);
    }
} else {
    rootnin = "None!";
}

if (indSan > 0) {
    if (indJo > 0) {
        sannin = document.body.innerHTML.slice(indSan, indJo);
    } else if (indSpecJo > 0) {
        sannin = document.body.innerHTML.slice(indSan, indSpecJo);
    } else if (indChu > 0) {
        sannin = document.body.innerHTML.slice(indSan, indChu);
    } else if (indGen > 0) {
        sannin = document.body.innerHTML.slice(indSan, indGen);
    } else if (indNon > 0) {
        sannin = document.body.innerHTML.slice(indSan, indNon);
    } else {
        sannin = document.body.innerHTML.slice(indSan, memKey);
    }
} else {
    sannin = "None!";
}

if (indJo > 0) {
    if (indSpecJo > 0) {
        jonin = document.body.innerHTML.slice(indJo, indSpecJo);
    } else if (indChu > 0) {
        jonin = document.body.innerHTML.slice(indJo, indChu);
    } else if (indGen > 0) {
        jonin = document.body.innerHTML.slice(indJo, indGen);
    } else if (indNon > 0) {
        jonin = document.body.innerHTML.slice(indJo, indNon);
    } else {
        jonin = document.body.innerHTML.slice(indJo, memKey);
    }
} else {
    jonin = "None!";
}

if (indSpecJo > 0) {
    if (indChu > 0) {
        specjo = document.body.innerHTML.slice(indSpecJo, indChu);
    } else if (indGen > 0) {
        specjo = document.body.innerHTML.slice(indSpecJo, indGen);
    } else if (indNon > 0) {
        specjo = document.body.innerHTML.slice(indSpecJo, indNon);
    } else {
        specjo = document.body.innerHTML.slice(indSpecJo, memKey);
    }
} else {
    specjo = "None!";
}

if (indChu > 0) {
    if (indGen > 0) {
        chunin = document.body.innerHTML.slice(indChu, indGen);
    } else if (indNon > 0) {
        chunin = document.body.innerHTML.slice(indChu, indNon);
    } else {
        chunin = document.body.innerHTML.slice(indChu, memKey);
    }
} else {
    chunin = "None!";
}

if (indGen > 0) {
    if (indNon > 0) {
        genin = document.body.innerHTML.slice(indGen, indNon);
    } else {
        genin = document.body.innerHTML.slice(indGen, memKey);
    }
} else {
    genin = "None!";
}

if (indNon > 0) {
    nonja = document.body.innerHTML.slice(indNon, memKey);
} else {
    nonja = "None!";
}

if (rootnin !== "None!") {
    rootnin = rootnin.replace(/R00t\+:<\/b><br>/g, "");
    rootnin = rootnin.replace(/<br>\n<br>/gm, "");
    rootnin = rootnin.replace(/<br>/g, ", ");
    numroot = (rootnin.match(/<a/g).length);
}

if (sannin !== "None!") {
    sannin = sannin.replace(/<b>Sannin:<\/b><br>/g, "");
    sannin = sannin.replace(/<br>\n<br>/gm, "");
    sannin = sannin.replace(/<br><\/ul><\/td><td width=\"110\" valign=\"top\" align=\"left\"><ul style=\"list-style:disc;margin-left: 0;padding-left: 1em;font-size:12px\">/g, "");
    sannin = sannin.replace(/<br>/g, ", ");
    sannin = sannin.substr(0, sannin.length - 3);
    numsan = (sannin.match(/<a/g).length);
}

if (jonin !== "None!") {
    jonin = jonin.replace(/<b>Jonin:<\/b><br>/g, "");
    jonin = jonin.replace(/<br>\n<br>/gm, "");
    jonin = jonin.replace(/<\/ul><\/td><td width=\"110\" valign=\"top\" align=\"left\"><ul style=\"list-style:disc;margin-left: 0;padding-left: 1em;font-size:12px\"><br>/g, "");
    jonin = jonin.replace(/<br>/g, ", ");
    jonin = jonin.substr(0, jonin.length - 3);
    numjon = (jonin.match(/<a/g).length);
}

if (specjo !== "None!") {
    specjo = specjo.replace(/Sp\. Jonin:<\/b><br>/g, "");
    specjo = specjo.replace(/<br>\n<br>/gm, "");
    specjo = specjo.replace(/<\/ul><\/td><td width=\"110\" valign=\"top\" align=\"left\"><ul style=\"list-style:disc;margin-left: 0;padding-left: 1em;font-size:12px\"><br>/g, "");
    specjo = specjo.replace(/<br>/g, ", ");
    specjo = specjo.substr(0, specjo.length - 3);
    numspecjo = (specjo.match(/<a/g).length);
}

if (chunin !== "None!") {
    chunin = chunin.replace(/Chunin:<\/b><br>/g, "");
    chunin = chunin.replace(/<br>\n<br>/gm, "");
    chunin = chunin.replace(/<\/ul><\/td><td width=\"110\" valign=\"top\" align=\"left\"><ul style=\"list-style:disc;margin-left: 0;padding-left: 1em;font-size:12px\"><br>/g, "");
    chunin = chunin.replace(/<br>/g, ", ");
    chunin = chunin.substr(0, chunin.length - 3);
    numchu = (chunin.match(/<a/g).length);
}

if (genin !== "None!") {
    genin = genin.replace(/Genin:<\/b><br>/g, "");
    genin = genin.replace(/<br>\n<br>/gm, "");
    genin = genin.replace(/<\/ul><\/td><td width=\"110\" valign=\"top\" align=\"left\"><ul style=\"list-style:disc;margin-left: 0;padding-left: 1em;font-size:12px\"><br>/g, "");
    genin = genin.replace(/<br>/g, ", ");
    genin = genin.substr(0, genin.length - 3);
    numgen = (genin.match(/<a/g).length);
}

if (nonja !== "None!") {
    nonja = nonja.replace(/Nonja:<\/b><br>/g, "");
    nonja = nonja.replace(/<br>\n<br>/gm, "");
    nonja = nonja.replace(/<\/ul><\/td><td width=\"110\" valign=\"top\" align=\"left\"><ul style=\"list-style:disc;margin-left: 0;padding-left: 1em;font-size:12px\"><br>/g, "");
    nonja = nonja.replace(/<\/ul>\n<\/td><\/tr><\/tbody><\/table>/gm, "");
    nonja = nonja.replace(/<br>/g, ", ");
    nonja = nonja.substr(0, nonja.length - 3);
    numnon = (nonja.match(/, /g).length + 1 || []);
}

var vSize = numroot + numsan + numjon + numspecjo + numchu + numgen + numnon;
vSize = vSize + " (" + numnon + " nonja)";
var vActive = parseInt(/Village size: ([\d]+)/g.exec(document.body.innerHTML)[1], 10);
var curTax = parseInt(/Current Tax Rate: ([\d]+)%/g.exec(document.body.innerHTML)[1], 10);
var numUps = parseInt(/Number of Upgrades: <b>([\d]+)<\/b>/g.exec(document.body.innerHTML)[1], 10);
var curUpk = parseInt(/Current Upkeep: ([\d]+)%/g.exec(document.body.innerHTML)[1], 10);
var tomPpwk = parseInt(/Paperwork: -([\d]+)% Upkeep Tomorrow/g.exec(document.body.innerHTML)[1], 10);

vinfo = vinfo.concat("<td width=\"220\" valign=\"top\">Village Size: " + vSize + "<br>Active Ninja: " + vActive + "<br><br>Current Tax Rate: " + curTax + "%<br>Current Upkeep: " + curUpk + "%<br>Paperwork: -" + tomPpwk + "% Upkeep Tomorrow<br><br><br>Number of Upgrades: " + numUps + "</td></tr></table></td></tr>");

vinfo = vinfo.concat("<tr><td><table width=\"440\"><tr><td align=\"left\"><br><font style=\"font-size:14px\"><b>Villagers:</b></font></td></tr></table><table width=\"440\" style=\"border-width:1px;border-style:dotted;border-color:#A75928;background-color:#E0C69A;font-size:12px\"><tr><td width=\"75\"><b>R00t+</b> (" + numroot + ")</td><td>" + rootnin + "</td></tr></table><table width=\"440\" style=\"border-width:1px;border-style:dotted;border-color:#A75928;background-color:#E0C69A;font-size:12px\"><tr><td width=\"75\"><b>Sannin</b> (" + numsan + ")</td><td>" + sannin + "</td></tr></table><table width=\"440\" style=\"border-width:1px;border-style:dotted;border-color:#A75928;background-color:#E0C69A;font-size:12px\"><tr><td width=\"75\"><b>Jonin</b> (" + numjon + ")</td><td>" + jonin + "</td></tr></table><table width=\"440\" style=\"border-width:1px;border-style:dotted;border-color:#A75928;background-color:#E0C69A;font-size:12px\"><tr><td width=\"75\"><b>Special Jonin</b> (" + numspecjo + ")</td><td>" + specjo + "</td></tr></table><table width=\"440\" style=\"border-width:1px;border-style:dotted;border-color:#A75928;background-color:#E0C69A;font-size:12px\"><tr><td width=\"75\"><b>Chunin</b> (" + numchu + ")</td><td>" + chunin + "</td></tr></table><table width=\"440\" style=\"border-width:1px;border-style:dotted;border-color:#A75928;background-color:#E0C69A;font-size:12px\"><tr><td width=\"75\"><b>Genin</b> (" + numgen + ")</td><td>" + genin + "</td></tr></table><table width=\"440\" style=\"border-width:1px;border-style:dotted;border-color:#A75928;background-color:#E0C69A;font-size:12px\"><tr><td width=\"75\"><b>Nonja</b> (" + numnon + ")</td><td>" + nonja + "</td></tr></table><form action=\"village.html\" name=\"showallvils\" style=\"margin:1px\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"hidden\" name=\"showallvillagers\" value=\"1\"><a href=\"javascript:document.showallvils.submit();\" onfocus=\"this.blur();\" style=\"color:A10000\"><p style=\"margin:0; text-align:right; font-size:10px\"><b>Parse Villagers</b></p></a><noscript><input type=\"submit\" VALUE=\"Show All Villagers\"></noscript></form></table>");

// build in the box if the village is daamged
var repairsNeeded = (document.body.innerHTML.match(/document.repairnow.submit/g) || []).length;
var vDamage = [];
var repAvail = [];
var bankBlocked = [];

if (repairsNeeded > 0) {
    vDamage = /<b>Total Village Damage: ([\d,]*)<\/b>/g.exec(document.body.innerHTML);
    vDamage = vDamage[1].replace(/,/g, "");
    vDamage = parseInt(vDamage, 10);
    repAvail = /Repair Ryo Available: ([\d,]*)<br>/g.exec(document.body.innerHTML);
    repAvail = repAvail[1].replace(/,/g, "");
    repAvail = parseInt(repAvail, 10);
    bankBlocked = /Bankium Blocked: ([\d,]*)<br>/g.exec(document.body.innerHTML);
    bankBlocked = bankBlocked[1].replace(/,/g, "");
    bankBlocked = parseInt(bankBlocked, 10);

    attack = attack.concat("<table width=\"220\" style=\"background-color:#A10000;border-color:#CC0000;border-style:solid;border-width:1px\"><tr><td><font style=\"font-size:12px;color:white\"><b>Total Village Damage: " + vDamage + "</b><br>Bankium Blocked: " + bankBlocked + "<br>(250K VRyo each to remove)<br>Repair Ryo Available: " + repAvail + "<br>Total Village Ryo " + vryo + "<br><form action=\"village.html\" name=\"repairnow\" style=\"margin:1px\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"checkbox\" name=\"repairall\" value=\"1\"><a href=\"javascript:document.repairnow.submit();\" onfocus=\"this.blur();\" style=\"color:white\"><b><font color=\"FFFFFF\">Repair All &gt;</font></b></a><noscript><input type=\"submit\" VALUE=\"Repair All\"></noscript></form><br><form action=\"villagerepair.html\" name=\"gorepair\" style=\"margin:1px\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><a href=\"javascript:document.gorepair.submit();\" onfocus=\"this.blur();\" style=\"color:white\"><b><font color=\"FFFFFF\">Go to Repair Menu &gt;</font></b></a><noscript><input type=\"submit\" VALUE=\"Go to Repair Menu\"></noscript></form></font></td></tr></table>");
}

// build the attack other villages boxes
var invPrepAvail = (document.body.innerHTML.match(/Planning to Invade:/g) || []).length;
var saboAvail = (document.body.innerHTML.match(/Head Saboteur:/g) || []).length;
var invTarget = [];
var saboteur = [];
var peacetime = [];
var patrolBonus = [];
var patrolBonusTomorrow = [];
var canTarget = (document.body.innerHTML.match(/switchattackfocus/g) || []).length;
var validTargets = [];
var targetsStart = [];
var targetsEnd = [];
var timesSwitched = [];

if (invPrepAvail > 0) {
    invTarget = /Planning to Invade: <b><b>[\w\s]+<\/b> Village<\/b><br>[Minutes until Invasion is ready: \d|<b>Invasion Timer Cleared!<\/b>]+<br><br>/g.exec(document.body.innerHTML);
    attack = attack.concat("</table><table width=\"440\" style=\"border-width:1px;border-style:dotted;border-color:#A75928;background-color:#E0C69A;font-size:12px\"><tr><td>" + invTarget + "</td>");
    if (saboAvail > 0) {
        saboteur = /Head Saboteur: <b>[\w\d]+<\/b><br><br>/g.exec(document.body.innerHTML);
        attack = attack.concat("<td>" + saboteur + "</td>");
    }
    peacetime = (document.body.innerHTML.match(/<b>--Peacetime Bonus--<\/b><br>(\+[\d]+) Successes Needed to Attack you/g) || []).length;
    if (peacetime > 0) {
        peacetime = /<b>--Peacetime Bonus--<\/b><br>(\+[\d]+) Successes Needed to Attack you/g.exec(document.body.innerHTML)[1];
    } else {
        peacetime = "+0";
    }
    patrolBonus = /Patrol Bonus Today: (\+[\d]+)/g.exec(document.body.innerHTML)[1];
    patrolBonusTomorrow = /Patrol Bonus For Tomorrow: (\+[\d]+)<br>/g.exec(document.body.innerHTML)[1];

    attack = attack.concat("</tr><tr><td colspan=\"2\"><b>Peacetime Bonus:</b> " + peacetime + " Successes needed to attack you<br><b>Patrol Bonus Today:</b> " + patrolBonus + "<br><b>Patrol Bonus Tomorrow:</b> " + patrolBonusTomorrow + "</td></tr>");

    if (canTarget > 0) {
        targetsStart = document.body.innerHTML.indexOf("switchattackfocus");
        targetsEnd = document.body.innerHTML.lastIndexOf("</select>");

        validTargets = document.body.innerHTML.slice(targetsStart, targetsEnd);

        timesSwitched = /Times switched today: ([\d]+)!/g.exec(document.body.innerHTML)[1];

        attack = attack.concat("<tr></tr><tr><td width=\"220\" valign=\"top\"><b>Invasion Preparations</b><br>Attacking a village nets you Ryo - if you prepare to invade them first, though, it is harder, but you'll take Resources instead! (You may switch this twice a day - you may target any attackable village you have a Spy in)</td><td valign=\"top\"><u>Choose Village:</u><br><img src=\"/billy/layout/blank.gif\" height=3 width=8><form action=\"village.html\" name=\"attackfocus\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><SELECT NAME=\"" + validTargets + "</select><br><a href=\"javascript:document.attackfocus.submit();\" onfocus=\"this.blur();\" style=\"color:000000\"><b><font color=\"A10000\">Make Preparations &gt;</font></b></a><noscript><input type=\"submit\" VALUE=\"Make Preparations &gt;\"></noscript><br>Times switched today: " + timesSwitched + "!</form></td></tr>");
    }

    attack = attack.concat("</table>");
}

// build the monster summoning box
var canSummon = (document.body.innerHTML.match(/document.newmon.submit/g) || []).length;
var canUseBC = (document.body.innerHTML.match(/<option name=\"Brilliant Crystals\">/g) || []).length;
var canUseMW = (document.body.innerHTML.match(/<option name=\"Medicinal Water\">/g) || []).length;
var canUsePM = (document.body.innerHTML.match(/<option name=\"Precious Metals\">/g) || []).length;
var canUseSF = (document.body.innerHTML.match(/<option name=\"Solid Fire\">/g) || []).length;
var canUseUI = (document.body.innerHTML.match(/<option name=\"Unmelting Ice\">/g) || []).length;

var summonOptions = [];

var wanderStatus = [];

if (canUseBC > 0) {
    summonOptions = summonOptions.concat("<option name=\"Brilliant Crystals\">Brilliant Crystals</option>");
}

if (canUseMW > 0) {
    summonOptions = summonOptions.concat("<option name=\"Medicinal Water\">Medicinal Water</option>");
}

if (canUsePM > 0) {
    summonOptions = summonOptions.concat("<option name=\"Precious Metals\">Precious Metals</option>");
}

if (canUseSF > 0) {
    summonOptions = summonOptions.concat("<option name=\"Solid Fire\">Solid Fire</option>");
}

if (canUseUI > 0) {
    summonOptions = summonOptions.concat("<option name=\"Unmelting Ice\">Unmelting Ice</option>");
}

if (canSummon > 0) {
    wanderStatus = /<br>Current Status: <b>([\w\s\d]+)<\/b>/g.exec(document.body.innerHTML)[1];

    battle = battle.concat("</table><table width=\"440\" style=\"border-width:1px;border-style:dotted;border-color:#A75928;background-color:#E0C69A;font-size:12px\"><tr><td width=\"220\">Attracting a Monster costs 8 of any single Basic Resource, or 3 of any Advanced Resource. To attract a monster, choose your resource to use, type \"Monster\" (without the quotes, WITH proper capitalization) to confirm.<br>To allow <b>possible</b> attraction of Major Kaiju (100K+ HP), type \"MONSTER\" (yes, in all caps).</td><td valign=\"top\"><form action=\"village.html\" name=\"newmon\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><select name=\"monrestouse\">" + summonOptions + "</select><br><input type=\"text\" name=\"attractmonster\" value=\" \"><br><a href=\"javascript:document.newmon.submit();\" onfocus=\"this.blur();\" style=\"color:A10000\"><b><font color=\"A10000\">Attract Monster</font></b></a><noscript><input type=\"submit\" VALUE=\"Attract Monster\"></noscript></form></td></tr><tr><td colspan=\"2\"><b>Wandering Kaiju</b><form action=\"village.html\" name=\"nowand\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\">You can adjust the Altar to keep Wandering Kaiju from showing up - however, if you activate this effect, all the Kaiju you entice will start with <b>+10% Base HP.</b><br>Current Status: <b>" + wanderStatus + "</b><input type=\"hidden\" name=\"nowand\" value=\"1\"><br><a href=\"javascript:document.nowand.submit();\" onfocus=\"this.blur();\" style=\"color:A10000\"><b><font color=\"A10000\">Deny Wandering Kaiju for 3 Days</font></b></a><noscript><input type=\"submit\" VALUE=\"Deny Wandering Kaiju for 3 Days\"></noscript></form>");
}

vinfo = vinfo.concat("<table width=\"440\"><tr><td align=\"left\"><font style=\"font-size:14px\"><b>Yesterday's Report:</b></font><br><p style=\"margin:0\"><a href=\"javascript:expandSmallMenu(\'yesterrep\',\'15em\');\" onfocus=\"this.blur();\" style=\"color:000000; font-size:10px\"><b>Expand/Contract List</b></a></p></td></tr></table><table width=\"440\" style=\"border-width:1px;border-style:dotted;border-color:#A75928;background-color:#E0C69A;font-size:12px\"><tr><td><div style=\"height:15em;overflow:auto;overflow-x:hidden;\" id=\"yesterrep\">" + document.getElementById("yesterrep").innerHTML + "</div></table>");

admin = admin.concat("</table>");

// build the compression and decompression boxes
var canDecomp = (document.body.innerHTML.match(/document.decompress.submit/g) || []).length;
var canComp = (document.body.innerHTML.match(/document.compress.submit/g) || []).length;
var decompCost = [];
var comcost = [];
var compCostA = [];
var compCostB = [];
var noSF = [];
var noUI = [];
var noSFc = [];
var noUIc = [];

if (canDecomp > 0) {
    comcost = document.getElementsByName("comcost")[1].value;
    decompCost = /Number of Advanced required: <b>([\d]+)<\/b>/g.exec(document.body.innerHTML)[1];
    noSF = (document.body.innerHTML.match(/<input type=\"radio\" name=\"decompress\" value=\"1\" disabled/g) || []).length;
    noUI = (document.body.innerHTML.match(/<input type=\"radio\" name=\"decompress\" value=\"2\" disabled/g) || []).length;

    if (noSF > 0) {
        noSF = "disabled";
    } else {
        noSF = "";
    }

    if (noUI > 0) {
        noUI = "disabled";
    } else {
        noUI = "";
    }

    admin = admin.concat("<td width=\"220\" valign=\"top\" style=\"border-width:1px;border-style:dotted;border-color:#A75928;background-color:#E0C69A;font-size:12px\"><b>Elemental Decompression</b><br>Decompress your Advanced Resources into 1 of each Basic Resource!<br><br>Number of Advanced required: <b>" + decompCost + "</b><form action=\"village.html\" name=\"decompress\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"hidden\" name=\"comcost\" value=" + comcost + "><input type=\"radio\" name=\"decompress\" value=\"1\" " + noSF + "> Break Apart Solid Fire<br><input type=\"radio\" name=\"decompress\" value=\"2\" " + noUI + "> Break Apart Unmelting Ice<br><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.decompress.submit();\" onfocus=\"this.blur();\" style=\"color:000000\"><b><font color=\"A10000\">Decompress Resource &gt;</font></b></a></p><noscript><input type=\"submit\" VALUE=\"Decompress Resource &gt;\"></noscript></form>");
}

if (canComp > 0) {
    comcost = document.getElementsByName("comcost")[1].value;
    compCostA = /Number of each Basics to make:<br>\s<b>Solid Fire - <i>([\d]+)<\/i><br>\sUnmelting Ice - <i>([\d]+)<\/i><br>/g.exec(document.body.innerHTML)[1];
    compCostB = /Number of each Basics to make:<br>\s<b>Solid Fire - <i>([\d]+)<\/i><br>\sUnmelting Ice - <i>([\d]+)<\/i><br>/g.exec(document.body.innerHTML)[2];
    noSFc = (document.body.innerHTML.match(/<input type=\"radio\" name=\"compress\" value=\"1\" disabled/g) || []).length;
    noUIc = (document.body.innerHTML.match(/<input type=\"radio\" name=\"compress\" value=\"2\" disabled/g) || []).length;

    if (noSFc > 0) {
        noSFc = "disabled";
    } else {
        noSFc = "";
    }

    if (noUIc > 0) {
        noUIc = "disabled";
    } else {
        noUIc = "";
    }

    admin = admin.concat("<hr><b>Elemental Compression</b><br>Compress your Basic Resources into Advanced Resources!<br><br>Number of each Basics to make:<br><b>Solid Fire - <i>" + compCostA + "</i><br>Unmelting Ice - <i>" + compCostB + "</i><br></b><form action=\"village.html\" name=\"compress\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"hidden\" name=\"comcost\" value=\"" + comcost + "\"><input type=\"radio\" name=\"compress\" value=\"1\" " + noSFc + " > Create Solid Fire<br><input type=\"radio\" name=\"compress\" value=\"2\" " + noUIc + " > Create Unmelting Ice<br><p style=\"margin:0; text-align:right\"><a href=\"javascript:document.compress.submit();\" onfocus=\"this.blur();\" style=\"color:000000\"><b><font color=\"A10000\">Compress Resource &gt;</font></b></a><noscript><input type=\"submit\" VALUE=\"Compress Resource &gt;\"></p></noscript></form>");

}

// build the RP box

var RPAvail = (document.body.innerHTML.match(/document.respoints.submit/g) || []).length;
var majorAvail = (document.body.innerHTML.match(/> Major Contract:/g) || []).length;
var minorAvail = (document.body.innerHTML.match(/> Minor Contract:/g) || []).length;
var numMajor = [];
var numMinor = [];
var amtMajor = [];
var amtMinor = [];
var canMill = (document.body.innerHTML.match(/Check to Mill Contracts/g) || []).length;

if (canDonate > 0) {
    if (majorAvail > 0) {
        numMajor = parseInt(/> Major Contract: ([\d]+)/g.exec(document.body.innerHTML)[1], 10);
        amtMajor = parseInt(/> Major Contract: ([\d]+)&nbsp;&nbsp;&nbsp;\(\+([\d]+) Ryo\)/g.exec(document.body.innerHTML)[2], 10);
        majorAvail = "<input type=\"radio\" name=\"sellcontract\" value=\"Major\">Major Contract: " + numMajor + " (+" + amtMajor + " Ryo)<br>";
    } else {
        majorAvail = "";
    }
    if (minorAvail > 0) {
        numMinor = parseInt(/> Minor Contract: ([\d]+)/g.exec(document.body.innerHTML)[1], 10);
        amtMinor = parseInt(/> Minor Contract: ([\d]+)&nbsp;&nbsp;&nbsp;\(\+([\d]+) Ryo\)/g.exec(document.body.innerHTML)[2], 10);
        minorAvail = "<input type=\"radio\" name=\"sellcontract\" value=\"Minor\">Minor Contract: " + numMinor + " (+" + amtMinor + " Ryo)<br>";
    } else {
        minorAvail = "";
    }
    if (canMill > 0) {
        canMill = "<input type=\"checkbox\" name=\"millem\" value=\"1\"> Check to Mill Contracts<br>    (random Ryo, chance of resources)<br>";
    } else {
        canMill = "";
    }
    admin = admin.concat("</td></tr></table><table width=\"440\"><tr><td align=\"left\"><font style=\"font-size:14px\"><b>Village Contracts:</b></font></td></tr></table><table width=\"440\" style=\"border-width:1px;border-style:dotted;border-color:#A75928;background-color:#E0C69A;font-size:12px\"><tr><td><b>Contracts</b> apply immediately to your Village Ryo!<br><form style=\"margin:0\" name=\"cryo\" action=\"village.html\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\">" + majorAvail + minorAvail + "<input type=\"text\" name=\"numbercontract\" value=\"1\" size=\"1\"> Number to submit<br>" + canMill + "<a href=\"javascript:document.cryo.submit();\" onfocus=\"this.blur();\" style=\"color:black; font-size:12px\"><b>Donate Contract</b></b></a><noscript><input type=\"submit\" VALUE=\"Donate Contract\"></noscript></form>");
}

if (RPAvail > 0) {
    admin = admin.concat("</td></tr></table><table width=\"440\"><tr><td align=\"left\"><font style=\"font-size:14px\"><b>Resource Points:</b></font></td></tr></table><table width=\"440\" style=\"border-width:1px;border-style:dotted;border-color:#A75928;background-color:#E0C69A;font-size:12px\"><tr><td>Break Resources down to give to Villagers!<br><form action=\"villageresourcepoints.html\" name=\"respoints\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><a href=\"javascript:document.respoints.submit();\" onfocus=\"this.blur();\" style=\"color:000000\"><b><font color=\"A10000\">Give Resource Points &gt;</font></b></a><noscript><input type=\"submit\" VALUE=\"Give Resource Points &gt;\"></noscript></form></td></tr></table>");
}

// build the applications box TODO: WANDERS

var appStatus = [];
var blurb = [];
var autoAcc = [];
var addNinja = [];
var denyNinja = [];
var ninShown = [];
var remNin = [];
var getNin = [];

if (canApprove > 0) {
    appStatus = /You currently <b>([\w]+)<\/b> applications to your village/g.exec(document.body.innerHTML)[1];
    blurb = /<br>---<br>([\S\s]+)<br>---<br>/g.exec(document.body.innerHTML)[1];
    autoAcc = /You are ([\w\s-]+) apps.<br>/g.exec(document.body.innerHTML)[1];
    addNinja = /Characters applying:<br>([\s\w\d<=\"\.>:\;-]+)<\/div>/.exec(document.body.innerHTML)[1];
    denyNinja = /turn off and on apps\):<br>([\s\w\d<=\"\.>:\;-]+)<\/div>/.exec(document.body.innerHTML)[1];
    ninHidden = (document.body.innerHTML.match(/remnin.submit\(\);\" onfocus=\"this.blur\(\);\" style="color:A10000\"><b>Show All Villagers/g) || []).length;
    if (ninHidden > 0) {
        remNin = "<input type=\"hidden\" name=\"showallvillagers\" value=\"1\"><a href=\"javascript:document.remnin.submit();\" onfocus=\"this.blur();\" style=\"color:A10000\"><b>Show All Villagers</b></a><noscript><input type=\"submit\" VALUE=\"Show All Villagers\"></noscript></form>";
    } else {
        kickStart = document.body.innerHTML.indexOf("whotodel");
        kickEnd = document.body.innerHTML.lastIndexOf("kickplayerconfirm");
        getNin = document.body.innerHTML.slice(kickStart, kickEnd);
        remNin = "<select name=\"whotodel\">" + getNin + "kickplayerconfirm\" value=\"go\"> Click to Confirm<br><a href=\"javascript:document.remnin.submit();\" onfocus=\"this.blur();\" style=\"color:A10000\"><b><font color=\"A10000\">Remove Ninja</font></b></a><noscript><input type=\"submit\" VALUE=\"Remove Ninja\"></noscript></form>";
    }
    admin = admin.concat("<table width=\"440\"><tr><td align=\"left\"><font style=\"font-size:14px\"><b>Applications/Members:</b></font></td></tr></table><table width=\"440\" style=\"border-width:1px;border-style:dotted;border-color:#A75928;background-color:#E0C69A;font-size:12px\"><tr><td>You currently <b>" + appStatus + "</b> applications to your village! Your Recruitment blurb:<br>---<br>" + blurb + "<br>---<br><form action=\"village.html\" name=\"swapaaapp\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\">You are " + autoAcc + " applications to your village. <br><input type=\"hidden\" name=\"swapaaapp\" value=\"1\"><a href=\"javascript:document.swapaaapp.submit();\" onfocus=\"this.blur();\" style=\"color:A10000\"><b><font color=\"A10000\">Toggle Auto-Accept &gt;</font></b></a><noscript><input type=\"submit\" VALUE=\"Toggle Auto-Accept &gt;\"></noscript></form>To change your application text, you must disallow and then reallow applications (so they join under the same conditions they applied to).<br>Characters applying:<br>" + addNinja + "</div><a href=\"javascript:document.allapp.submit();\" onfocus=\"this.blur();\" style=\"color:A10000\"><b><font color=\"A10000\">Allow Ninja to Join Village</font></b></a><noscript><input type=\"submit\" VALUE=\"Allow Ninja to Join Village\"></noscript></form><br>Deny applications here (if you deny someone, they cannot re-ask until you turn off and on apps):<br>" + denyNinja + "</div>Message (optional, be nice):<br><input type=\"text\" name=\"villagedenymsg\" value=\"\"><br><a href=\"javascript:document.dnapp.submit();\" onfocus=\"this.blur();\" style=\"color:A10000\"><b><font color=\"A10000\">Deny Application</font></b></a><noscript><input type=\"submit\" VALUE=\"Deny Application\"></noscript></form><form action=\"village.html\" name=\"disapp\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"hidden\" name=\"villageallow\" value=\"disallow\">Village the way you want it? Turn off applications here.<br><a href=\"javascript:document.disapp.submit();\" onfocus=\"this.blur();\" style=\"color:A10000\"><b><font color=\"A10000\">Stop Allowing Applications</font></b></a><noscript><input type=\"submit\" VALUE=\"Stop Allowing Applications\"></noscript></form><b>Wandering Genin</b><br> Too high or low Member Count and/or Village Size to allow wandering Genin (must be between 5 and 45 Members and Size)<hr><b>Remove Characters from Village</b><form action=\"village.html\" name=\"remnin\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\">" + remNin + "<br><b>Duplicate Player Check</b><br>Check the IPs of your current players and applicants for duplicates.<br><form action=\"villagecheckip.html\" name=\"ipboard\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><a href=\"javascript:document.ipboard.submit();\" onfocus=\"this.blur();\" style=\"color:000000\"><b><font color=\"A10000\">IP Check &gt;</font></b></a><noscript><input type=\"submit\" VALUE=\"IP Check &gt;\"></noscript></form><br><b>Manage Ban List</b><br>Manage the Ban List for your Village.<br><form action=\"villagebanlist.html\" name=\"vbanlist\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><a href=\"javascript:document.vbanlist.submit();\" onfocus=\"this.blur();\" style=\"color:000000\"><b><font color=\"A10000\">Village Ban List &gt;</font></b></a><noscript><input type=\"submit\" VALUE=\"Village Ban List &gt;\"></noscript></form></td></tr></table>");
}

if (canOpenApp > 0) {
    ninHidden = (document.body.innerHTML.match(/remnin.submit\(\);\" onfocus=\"this.blur\(\);\" style="color:A10000\"><b>Show All Villagers/g) || []).length;
    if (ninHidden > 0) {
        remNin = "<input type=\"hidden\" name=\"showallvillagers\" value=\"1\"><a href=\"javascript:document.remnin.submit();\" onfocus=\"this.blur();\" style=\"color:A10000\"><b>Show All Villagers</b></a><noscript><input type=\"submit\" VALUE=\"Show All Villagers\"></noscript></form>";
    } else {
        kickStart = document.body.innerHTML.indexOf("whotodel");
        kickEnd = document.body.innerHTML.lastIndexOf("kickplayerconfirm");
        getNin = document.body.innerHTML.slice(kickStart, kickEnd);
        remNin = "<select name=\"whotodel\">" + getNin + "kickplayerconfirm\" value=\"go\"> Click to Confirm<br><a href=\"javascript:document.remnin.submit();\" onfocus=\"this.blur();\" style=\"color:A10000\"><b><font color=\"A10000\">Remove Ninja</font></b></a><noscript><input type=\"submit\" VALUE=\"Remove Ninja\"></noscript></form>";
    }
    admin = admin.concat("<table width=\"440\"><tr><td align=\"left\"><font style=\"font-size:14px\"><b>Applications/Members:</b></font></td></tr></table><table width=\"440\" style=\"border-width:1px;border-style:dotted;border-color:#A75928;background-color:#E0C69A;font-size:12px\"><tr><td>Your village is currently <b>closed</b> to new members.<form action=\"village.html\" name=\"allapp2\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"hidden\" name=\"villageallow\" value=\"allow\">Type your recruiting blurb here! (more than 10 and less than 300 characters, no HTML or cursing)<br><input type=\"text\" name=\"villageallowtext\" value=\"\"><br><br><input type=\"checkbox\" name=\"vil_default\" value=\"1\"> Auto-Accept all applicants<br><a href=\"javascript:document.allapp2.submit();\" onfocus=\"this.blur();\" style=\"color:A10000\"><b><font color=\"A10000\">Allow Applications</font></b></a><noscript><input type=\"submit\" VALUE=\"Allow Applications\"></noscript></form><hr><b>Remove Characters from Village</b><form action=\"village.html\" name=\"remnin\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\">" + remNin + "<br><b>Duplicate Player Check</b><br>Check the IPs of your current players and applicants for duplicates.<br><form action=\"villagecheckip.html\" name=\"ipboard\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><a href=\"javascript:document.ipboard.submit();\" onfocus=\"this.blur();\" style=\"color:000000\"><b><font color=\"A10000\">IP Check &gt;</font></b></a><noscript><input type=\"submit\" VALUE=\"IP Check &gt;\"></noscript></form><br><b>Manage Ban List</b><br>Manage the Ban List for your Village.<br><form action=\"villagebanlist.html\" name=\"vbanlist\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><a href=\"javascript:document.vbanlist.submit();\" onfocus=\"this.blur();\" style=\"color:000000\"><b><font color=\"A10000\">Village Ban List &gt;</font></b></a><noscript><input type=\"submit\" VALUE=\"Village Ban List &gt;\"></noscript></form></td></tr></table>");
}

// conclude the content divs with tables
events = events.concat("</table>");
battle = battle.concat("</table>");
attack = attack.concat("</table>");
admin = admin.concat("<table width=\"440\"><tr><td align=\"left\"><font style=\"font-size:14px\"><b>Leave Village:</b></font></td></tr></table><table width=\"440\" style=\"border-width:1px;border-style:dotted;border-color:#A75928;background-color:#E0C69A;font-size:12px\"><tr><td>Want to leave your village? just type your password in here and hit \'Leave Village\'.<form action=\"villagejoin.html\" name=\"leavev\" method=\"post\"><input type=\"hidden\" name=\"player\" value=\"" + player + "\"><input type=\"hidden\" name=\"pwd\" value=\"" + pass + "\"><input type=\"hidden\" name=\"leavevillage\" value=\"go\"><input type=\"password\" name=\"pwdconfirm\" value=\"\"><br><input type=\"checkbox\" name=\"leaveconfirm\" value=\"1\"> (click to confirm)<br><a href=\"javascript:document.leavev.submit();\" onfocus=\"this.blur();\" style=\"color:A10000\"><b><font color=\"A10000\">Leave Village</font></b></a><noscript><input type=\"submit\" VALUE=\"Leave Village\"></noscript></form></td></tr></table>");
vcenter = vcenter.concat("</table>");
vinfo = vinfo.concat("</table>");

// insert content divs for the tabs later

contentInsert = "<ul id=\"tabs\"><li><a href=\"#events\">Events</a></li><li><a href=\"#battle\">Battle</a></li><li><a href=\"#attack\">Attack Other Villages</a></li><li><a href=\"#vcenter\">Village Center</a></li><li><a href=\"#admin\">Village Admin</a></li><li><a href=\"#vinfo\">Village Info</a></li></ul><div class=\"tabContent\" id=\"events\">" + events + "</div><div class=\"tabContent\" id=\"battle\">" + battle + "</div><div class=\"tabContent\" id=\"attack\">" + attack + "</div><div class=\"tabContent\" id=\"vcenter\">" + vcenter + "</div><div class=\"tabContent\" id=\"admin\">" + admin + "</div><div class=\"tabContent\" id=\"vinfo\">" + vinfo + "</div>";

// comment out the old village page
document.body.innerHTML = document.body.innerHTML.replace(/<table style=\"font-family:arial\">/g, "<table style=\"font-family:arial\"><tr><td valign=\"top\" align=\"center\"><!--");

document.body.innerHTML = document.body.innerHTML.replace(/<b>Leave Village/g, "-->" + contentInsert + "<!--<br><p align\"left\"><table width=\"220\"><tr><td align=left><font style=\"font-size:14px\"><b>Leave Village");

// document.body.innerHTML = document.body.innerHTML.replace(/View Villages Accepting Apps &gt;<\/b><\/a>/g, "View Villages Accepting Apps &gt;</b></a></p><!--");

document.body.innerHTML = document.body.innerHTML.replace(/<p style=\"margin:0 0 2px 0;text-align:right\">/g, "--><p style=\"margin:0 0 2px 0;text-align:right\">");

// make the tabs work

var tabLinks = [];
var contentDivs = [];

function initTabs() {

    // Grab the tab links and content divs from the page
    var tabListItems = document.getElementById('tabs').childNodes;
    for (var i = 0; i < tabListItems.length; i++) {
        if (tabListItems[i].nodeName == "LI") {
            var tabLink = getFirstChildWithTagName(tabListItems[i], 'A');
            var id = getHash(tabLink.getAttribute('href'));
            tabLinks[id] = tabLink;
            contentDivs[id] = document.getElementById(id);
        }
    }

    // Assign onclick events to the tab links, and
    // highlight the first tab
    i = 0;

    for (id in tabLinks) {
        tabLinks[id].onclick = showTab;
        tabLinks[id].onfocus = function() {
            this.blur()
        };
        if (i === 0) { 
            tabLinks[id].className = 'selected';
        }
        i++;
    }

    // Hide all content divs except the first
    i = 0;

    for (id in contentDivs) {
        if (i !== 0) {
            contentDivs[id].className = 'tabContent hide';
        }
        i++;
    }
}

function showTab() {
    var selectedId = getHash(this.getAttribute('href'));

    // Highlight the selected tab, and dim all others.
    // Also show the selected content div, and hide all others.
    for (id in contentDivs) {
        if (id == selectedId) {
            tabLinks[id].className = 'selected';
            contentDivs[id].className = 'tabContent';
        } else {
            tabLinks[id].className = '';
            contentDivs[id].className = 'tabContent hide';
        }
    }

    // Stop the browser following the link
    return false;
}

function getFirstChildWithTagName(element, tagName) {
    for (i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].nodeName == tagName) {
            return element.childNodes[i];
        }
    }
}

function getHash(url) {
    var hashPos = url.lastIndexOf('#');
    return url.substring(hashPos + 1);
}

addTabCSS();
initTabs();