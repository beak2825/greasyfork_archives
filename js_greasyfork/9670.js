// ==UserScript==
// @name NGA
// @description Enchances the Neverwinter Gateway Experiance, allows for automatisation of processes.
// @namespace 
// @include http://gateway*.playneverwinter.com/*
// @include https://gateway*.playneverwinter.com/*
// @include http://gateway.*.perfectworld.eu/*
// @include https://gateway.*.perfectworld.eu/*

// @version 0.1.1
// @license http://creativecommons.org/licenses/by-nc-sa/3.0/us/
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_listValues
// @grant GM_deleteValue
// @grant GM_addStyle
// @grant GM_getResourceText
// @resource ngal_css	http://greasyfork.org/scripts/9734-ngal-css/code/NGAL_CSS.js
// @resource nga_css		http://greasyfork.org/scripts/9902-nga-css/code/NGA_CSS.js
// @require https://greasyfork.org/scripts/10349-ngal-mutationdetective/code/NGAL_MutationDetective.js
// @downloadURL https://update.greasyfork.org/scripts/9670/NGA.user.js
// @updateURL https://update.greasyfork.org/scripts/9670/NGA.meta.js
// ==/UserScript==

/*** Environment Setup ***/
console.log("Loading Environment");
var ngaGamer = {PauseGo:0, AccAct: 0, AutoLogIn:1, AutoSwitch:1, SwitchTime:18000};//nga Gamer config, for all Accounts!
var ngaAcc = {};//Accounts Data.
var ngaHeroProfOpt = {Train:1,BuyR:0,BuyPorr:0}; //Singe Char options. Seems unnecessary in this way. Probably should go to Account or even Gamer options.
var ngaHeroProfSlots = [0,0,0,0,0,0,0,0,0];// Professions for each Hero, here: 9 slots.
var tempGM; //temporary GM memory holder, to prevent unnecessary GM function calls. We declare it global for debugging possibilities.
var ngaholder, ngadvance, ngaAccID; // Variables for HTML DOM and Account Management.

function ngaGamerLoad() { //Loads data for Gamer, Memory Level 1
	tempGM = GM_getValue("Gamer");
	if (tempGM) {ngaGamer = JSON.parse(tempGM); console.log("ngaGamer data load complete");}
   else {console.log("ngaGamer data load failed");}
}

function ngaAccLoad() { //Loads data for Gamer accounts, Memory Level 2
	tempGM = GM_getValue("Accounts");
	if (tempGM) {ngaAcc = JSON.parse(tempGM); console.log("ngaAcc data load complete");}
	else {console.log("ngaAcc data load failed");}
	ngaNoAcc();
}

/*** NGA Gateway Enchantment ***/
function ngaCustomElements() {                        console.log("Enchanting gateway GUI");
    GM_addStyle(GM_getResourceText("nga_css"));       console.log("Custom CSS for gateway loaded"); 
    console.log('Gateway Enchantments loaded');
}
/** EndOf Gateway Enchantment **/

/*** NGA Control Board ***/
function ngaGuiInject() {                               console.log("Loading nga GUI");
    GM_addStyle(GM_getResourceText("ngal_css"));        console.log("CSS for NGA loaded");
    ngadvance = document.createElement('form');         console.log("Creating NGA control");
    ngadvance.id ="NGA_html";
    ngadvance.innerHTML = [
        '<input type="checkbox" id="NGA_PauseGo"><label for="NGA_PauseGo">PauseGo</label>\n',
        '<input type="checkbox" id="NGA_MenuState"><label for="NGA_MenuState">NGA</label>\n'
        ].join("");
    document.body.appendChild(ngadvance);               console.log("NGA control created");
    document.getElementById("NGA_PauseGo").checked = ngaGamer.PauseGo;
    document.getElementById("NGA_PauseGo").addEventListener("click", ngaPauseGo); //Add Listener to PauseGo element 
	console.log("Loading GUI complete");
}

/* Control Board items */

/* Control Board listeners */
function ngaPauseGo () {
	var pgostate = document.getElementById("NGA_PauseGo").checked;
	ngaGamer.PauseGo = pgostate; //save state to var
	GM_setValue("PauseGo", pgostate); //push state to GM
	console.log("PauseGo completed");
}

/** EndOf NGA Control Board **/

/*** Log In Page items ***/
function ngaLoginPage() {
    ngaMDStop(); //stop mutation observer
    var attr2check = document.querySelector('#content_login').getAttribute('ngAdvanced');
    if(attr2check!=1){
	/*DropDown Menu - Multi Acc Management*/
	ngaholder = document.getElementById('form');
	ngadvance = document.createElement('form');
	ngadvance.innerHTML = '<select id="nga_accounts"></select>';
	ngaholder.parentNode.insertBefore(ngadvance, ngaholder);
	console.log("creating AccSelect element complete");
	ngaAccOptCreate();
	document.getElementById("nga_accounts").addEventListener("change", ngaPutAccData); //Fills in saved Acc Data into log in form.

	/*Checkbox option to SetNewAccdata*/
	ngaholder = document.getElementById('form');
	ngadvance = document.createElement('form');
	ngadvance.innerHTML = '<input type="checkbox" id="nga_newacc"><label for="nga_newacc">Save LogIn to NGA</label>';
	ngaholder.parentNode.insertBefore(ngadvance, ngaholder);
	document.getElementById("nga_newacc").addEventListener("click", ngaSetNewAccData);
	console.log("NewAccData Option created");
    document.querySelector('#content_login').setAttribute('ngAdvanced', 1);
    } else {console.log('LogIn Page already advanced');}
    ngaMDGo();
}

function ngaPutAccData () {
	ngaGamer.AccAct = document.getElementById("nga_accounts").value; //set new Actual Account
	document.getElementById('user').value = ngaAcc[ngaGamer.AccAct].Mail;
	document.getElementById('pass').value = ngaAcc[ngaGamer.AccAct].Pwd;
	console.log("LogIn values changed");
}

function ngaSetNewAccData () {
	if(document.getElementById('nga_newacc').checked){ //if option enabled (checked) we insert userinput to GM
		var ngaNewAcc = JSON.stringify([document.getElementById('user').value, document.getElementById('pass').value]);
		GM_setValue("NewAcc",ngaNewAcc);//put user input into GM
		console.log("saved NewAcc user input to GM");
	}
	if(!document.getElementById('nga_newacc').checked) { //if option is disabled (unchecked) we delete userinput from GM
		GM_deleteValue("NewAcc");//delete user input from GM
		console.log("cleared NewAcc user input from GM");
	}
	//no other options are reviewed here.
    
}
/** EndOf Login Page items **/

/*** Profession Page items ***/
function ngaProfessionsPage() {
	/*Collect all finished tasks button*/
	try {ngaholder = document.getElementById('content_professions');} //tests if necessary parent element is there
	catch(e) {window.setTimeout(function () {ngaProfessionsWindow();}, delay.SHORT);return;}
	var ngaCollectAllProfsButton =[
	'  <div class="input-bg-left"></div>',
	'  <div class="input-bg-mid"></div>',
	'  <div class="input-bg-right"></div>',
	'  <div class="" style="opacity: 0;">',
	'    <div class="input-bg-left"></div>',
	'    <div class="input-bg-mid"></div>',
	'    <div class="input-bg-right"></div>',
	'  </div>',
	'<button id="ngaCollectAllProfs">Collect all</button>'
	].join("");
	ngadvance = document.createElement('div');
	ngadvance.setAttribute("class", "input-field button epic");
	ngadvance.setAttribute("id", "ngaCollectAllProfsButton");
	ngadvance.innerHTML = ngaCollectAllProfsButton;
	ngaholder.appendChild(ngadvance);
	console.log("creating AccSelect element complete");
//	document.getElementById("nga_accounts").addEventListener("change", ngaPutAccData); //Fills in saved Acc Data into log in form.
}
/** EndOf Profession Page items **/

/*** Account Management ***/
// Important! First load available GM Data!
function ngaGamerPushGM () {
	var gamer = JSON.stringify(ngaGamer);
	GM_setValue("Gamer", gamer);
	if(gamer) {console.log("Gamer Data saved to GM");}
   else {console.log("saving Gamer Data to GM failed");}
}

function ngaAccPushGM () {
	var accounts = JSON.stringify(ngaAcc);
	GM_setValue("Accounts", accounts);
	if(accounts) {console.log("Gamer Accounts Data saved to GM");}
	else {console.log("saving Gamer Accounts Data to GM failed");}
}

function ngaAccManage () {console.log("Processing account data");
	ngaGamer.AccAct = client.dataModel.model.loginInfo.publicaccountname; console.log('Actual Account Name: '+ngaGamer.AccAct);
	var NewAccN = GM_getValue("NewAcc");
	if (NewAccN) {console.log('NewAcc GM data detected:', NewAccN);
		var NewAcc = JSON.parse(NewAccN); console.log('parsed NewAcc data:', NewAcc);
		ngaAcc[ngaGamer.AccAct]={Mail:NewAcc[0], Pwd:NewAcc[1], Timer:"", HeroAct:""}; console.log('New ngaAcc:', ngaAcc);
	   ngaAccPushGM(); 					console.log('GM accounts data updated');
		GM_deleteValue("NewAcc");		console.log('NewAcc GM data deleted');
   }
   if (!ngaAcc) {ngaNoAcc();}
}

function ngaAccOptCreate() {
	console.log('reading ngaAcc', ngaAcc);
	var accounts = Object.getOwnPropertyNames(ngaAcc).sort();
	for(var i = 0; i < accounts.length; i++) {
	  var item = document.createElement('option');
	  item.setAttribute("value", accounts[i]);
	  item.appendChild(document.createTextNode(accounts[i]));
	  document.getElementById("nga_accounts").appendChild(item);
	}
	console.log("account list created");
}

function ngaDelAcc() {	//delete account
	delete ngaAcc[ngaGamer.AccAct]; console.log("selected account data deleted");
	ngaAccPushGM(); console.log("updated accounts data saved to GM");
}

function ngaNoAcc() {
ngaAcc['NoAcc']={Mail:"", Pwd:"", Timer:"-1", HeroAct:"0"}; 	
}
/** End of Account Management**/

/*** artificial triggers ***/
ngaGamerLoad();
ngaAccLoad();
ngaGuiInject();
ngaCustomElements();
ngaMDGo();
/** EndOf artificial triggers **/