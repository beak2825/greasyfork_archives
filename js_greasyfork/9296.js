// Allow Password Remembering on webtop
// version 0.5
// 2015-04-18
// Copyright (c) 2015, Amit Palti 
// Released under the MIT license
// --------------------------------------------------------------------
//
// This is a Greasemonkey user script.
//
// To install, you need Greasemonkey: http://greasemonkey.mozdev.org/
// download the file , open it with text editor and replace everywhere you see username@@@ (lines 68 and 71)with your username and in the last line password@@@ with your password and save
// drag the edited file to firefox
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
// If you want, you can configure the Included and Excluded pages in 
//  the GreaseMonkey configuration.
//
// To uninstall, go to Tools/Manage User Scripts,
// select this file name, and click Uninstall.
//
// --------------------------------------------------------------------
//
// WHAT IT DOES:
// the webtop.co.il website will your user-name and password auto typed  
// מאפשר סיסמא אוטומטית  באתר של הסקולי
// --------------------------------------------------------------------
//
// ==UserScript==
// @name            Allow Password Remembering webtop
// @namespace       nomq
// @description     make the webtop site autocomplete my username and password
// @include         https://www.webtop.co.il/*
// @version         1.1
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/9296/Allow%20Password%20Remembering%20webtop.user.js
// @updateURL https://update.greasyfork.org/scripts/9296/Allow%20Password%20Remembering%20webtop.meta.js
// ==/UserScript==
 
 
 
 
 
var allowAutoCompleteWebtopPassword = function(element) {
    var iAttrCount = element.attributes.length;
	
    for (var i = 0; i < iAttrCount; i++) {
	var oAttr = element.attributes[i];
	if (oAttr.name == 'value') {
	    oAttr.value = "1Q2W3E4R5T";
	}
	if (oAttr.name == 'onblur') {
	    oAttr.value = "$('passwordHint').style.display='none';this.style.backgroundColor='#fff';if(this.value.length==0)this.value='1Q2W3E4R5T'";
	}
	if (oAttr.name == 'onfocus') {
	    oAttr.value = "$('passwordHint').style.display='block';this.style.backgroundColor='#fcffac';if(this.value==this.title)this.value='1Q2W3E4R5T'";
	}
	if (oAttr.name == 'autocomplete') {
	    oAttr.value = 'on';
	    break;
	}
    }
}
var allowAutoCompleteWebtopUserName = function(element) {
    var iAttrCount = element.attributes.length;
    for (var i = 0; i < iAttrCount; i++) {
	var oAttr = element.attributes[i];
	if (oAttr.name == 'value') {
	    oAttr.value = "username@@@";
		//document.getElementById("passwordWrapper").attributes[5].value="$('passwordHint').style.display='none';this.style.backgroundColor='#fff';if(this.value.length==0)this.value=1Q2W3E4R5T";
		//document.getElementById("passwordWrapper").attributes[4].value="$('passwordHint').style.display='block';this.style.backgroundColor='#fcffac';if(this.value==this.title)this.value='1Q2W3E4R5T'";
		oAttr.value = "username@@@";
	    break;
	}
	if (oAttr.name == 'autocomplete') {
	    oAttr.value = 'on';
	    break;
	}
    }
}
 
	//var forms = document.getElementsByTagName('form');
	//for (var i = 0; i < forms.length; i++)
	//{
	//	var form = forms[i];
	//	var elements = form.elements;
//
	//	allowAutoComplete(form);
//
	//	for (var j = 0; j < elements.length; j++)
	//	{
	//		allowAutoComplete(elements[j]);
	//	}
	//}
var webtopFormUserName = document.getElementById("identityNumber");
var webtopFormPassword = document.getElementById("password");
allowAutoCompleteWebtopPassword(webtopFormPassword);
allowAutoCompleteWebtopUserName(webtopFormUserName);
 
webtopFormPassword.value="password@@@"