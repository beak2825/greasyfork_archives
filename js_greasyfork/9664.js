// ==UserScript==
// @name Neverwinter Gateway Advanced Library - Account Management
// @description Adds account management functions
// @originalAuthor Mihail Gershkovich

/*** Account Management ***/
// Important! First load available GM Data!
function ngaAccPushGM () {
	GM_setValue("AccName",ngaGamer.AccName.join(',')); //
	GM_setValue("AccMail",ngaGamer.AccMail.join(',')); //
	GM_setValue("AccPwd",ngaGamer.AccPwd.join(',')); //
	GM_setValue("AccTimer",ngaGamer.AccTimer.join(',')); //
	GM_setValue("AccQ",ngaGamer.AccName.length); //
}

function ngaAddAcc () {if(GM_getValue("NewAccMail")&&GM_getValue("NewAccPwd")) {//	check GM for NewAccMail and NewAccPwd
	var NGA_NewAccName = client.dataModel.model.loginInfo.publicaccountname; //read actual Account name
	if (!NGA_AccName.indexOf(NGA_NewAccName)) { //add new acc if there is no such element, else - substitute
	NGA_AccName.push(NGA_NewAccName);// push new Acc Name to array
	}
	AccID = NGA_AccName.indexOf(NGA_NewAccName); //get AccID
	NGA_AccMail[AccID] = GM_getValue("NewAccMail");// push new AccMail to array
	NGA_AccPwd[AccID]= GM_getValue("NewAccPwd");// push new AccPwd to array
	NGA_AccTimer[AccID]= 0;// push new AccPwd to array
	//now we push new data to GM:
	ngaAccPushGM();
	//now we add account options to NGA_Accounts select element:
	ngaAccOptCreate();
	NGA_NewAccName = null;
}}//endif and endfunction

function ngaAccOptCreate() {
	for(var i = 0; i < ngaGamer.AccName.length; i++) {
	  var item = document.createElement('option');
	  item.appendChild(document.createTextNode(ngaGamer.AccName[i]));
	  document.getElementById("nga_accounts").appendChild(item);
	}
}

function ngaDelAcc () {	//delete account
	AccID = NGA_AccName.indexOf(ngaGamer.AccAct); //get AccID
	NGA_AccMail.splice(AccID, 1);// delete actual AccMail from array
	NGA_AccPwd.splice(AccID, 1);// delete actual AccPwd from array
	NGA_AccTimer.splice(AccID, 1);// delete actual AccPwd from array
	ngaAccPushGM;
}

/** End of Account Management**/