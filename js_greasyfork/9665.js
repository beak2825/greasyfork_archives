// ==UserScript==
// @name Neverwinter Gateway Advanced Library - Log In Window Items
// @description Adds input elements to the log-in window
// @originalAuthor Mihail Gershkovich

/*** Log In Window items ***/
var ngaLoginWindow = function () {
	/*DropDown Menu - Multi Acc Management*/
	ngaholder = document.getElementById('user');
	ngadvance = document.createElement('div');
	ngadvance.innerHTML = '<select id="nga_accounts"><option value="0">No Saved AccData</option></select>';
	ngaholder.parentNode.insertBefore(ngadvance, ngaholder);
	ngaAccOptCreate;
	document.getElementById("nga_accounts").addEventListener("change", ngaPutAccData); //

	/*Checkbox option to 'GM_SetNewAccdata'*/
	ngaholder = document.getElementById('user');
	ngadvance = document.createElement('div');
	ngadvance.innerHTML = '<input type="checkbox" id="nga_newacc"><label for="nga_newacc">Add Account to NGA</label>';
	ngaholder.parentNode.insertBefore(ngadvance, ngaholder);
	document.getElementById("nga_newacc").addEventListener("click", ngaSetNewAccData);
}

var ngaPutAccData = function () {
	ngaGamer.AccAct = document.getElementById("nga_accounts").innerHTML; //set new Actual Account
	var AccID = ngaGamer.AccName.indexOf(ngaGamer.AccAct); //define Account ID
	document.getElementById('user').value = ngaGamer.AccMail[AccID];
	document.getElementById('pass').value = ngaGamer.AccPwd[AccID];
}

var ngaSetNewAccData = function () {
	if(document.getElementById('user').checked){
		GM_setValue("NewAccMail",document.getElementById('user').value);//put user input into GM
		GM_setValue("NewAccPwd",document.getElementById('pass').value);//put user input into GM
	}
	if(!document.getElementById('user').checked) {
		GM_deleteValue("NewAccMail");//delete user input from GM
		GM_deleteValue("NewAccPwd");//delete user input from GM
	}
}

/** EndOf Login Window items **/