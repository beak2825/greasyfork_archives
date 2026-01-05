// ==UserScript==
// @name        MarscAutoTest
// @namespace   Marsc
// @author      Dolev
// @icon        http://marsc.ipanel.co.il/MARSC.NET.Hebrew/App_Themes/MARSC/images/favicon.ico
// @include     http://marsc.ipanel.co.il/MARSC.NET.Hebrew/SampleManager/SamplesList.aspx?id=*
// @version     1.6
// @grant       Dolev
// @description Add automatically the list of the emails into the "TEST" frame
// @downloadURL https://update.greasyfork.org/scripts/7241/MarscAutoTest.user.js
// @updateURL https://update.greasyfork.org/scripts/7241/MarscAutoTest.meta.js
// ==/UserScript==

var txtEmail1 = "ipaneltestemail@walla.co.il";
var txtEmail2 = "ipaneltestemail@gmail.com";
var txtEmail3 = "ipaneltestemail3@yahoo.com";
var txtEmail4 = "ipaneltest@outlook.com";
var txtEmail5 = "";

var List2txtEmail1 = "@midgam.co.il";		//must be different than txtEmail1
var List2txtEmail2 = "ipaneltestemail@gmail.com";
var List2txtEmail3 = "ipaneltestemail3@yahoo.com";
var List2txtEmail4 = "ipaneltest@outlook.com";
var List2txtEmail5 = "ipaneltestemail@walla.co.il";

var secondIframeEventTimer

window.onload=function(){
	secondIframeEventTimer = setInterval(secondIframeEvent, 100);
};

function secondIframeEvent(){
	var secondList;
	var secondIframe = document.getElementsByName('wndModalReuseablePopup')[0].contentWindow.document.getElementsByName('wndMerge')[0].contentWindow;
	if (secondIframe.document.getElementById("txtEmail1") != null){
		secondIframe.document.getElementById("txtEmail1").value= txtEmail1;
		secondIframe.document.getElementById("txtEmail2").value= txtEmail2;
		secondIframe.document.getElementById("txtEmail3").value= txtEmail3;
		secondIframe.document.getElementById("txtEmail4").value= txtEmail4;
		secondIframe.document.getElementById("txtEmail5").value= txtEmail5;
		
		if (secondIframe.document.getElementById("btnSecondList")==null){
			secondList = document.createElement("input");
			secondList.value = "Switch lists";
			secondList.setAttribute("class","button");
			secondList.type="button";
			secondList.id="btnSecondList";
			secondIframe.document.getElementsByClassName("popupbuttons")[0].appendChild(secondList);
		}
		
		secondList.onclick = function(){
			if(secondIframe.document.getElementById("txtEmail1").value == txtEmail1){
				secondIframe.document.getElementById("txtEmail1").value= List2txtEmail1;
				secondIframe.document.getElementById("txtEmail2").value= List2txtEmail2;
				secondIframe.document.getElementById("txtEmail3").value= List2txtEmail3;
				secondIframe.document.getElementById("txtEmail4").value= List2txtEmail4;
				secondIframe.document.getElementById("txtEmail5").value= List2txtEmail5;
			}else{
				secondIframe.document.getElementById("txtEmail1").value= txtEmail1;
				secondIframe.document.getElementById("txtEmail2").value= txtEmail2;
				secondIframe.document.getElementById("txtEmail3").value= txtEmail3;
				secondIframe.document.getElementById("txtEmail4").value= txtEmail4;
				secondIframe.document.getElementById("txtEmail5").value= txtEmail5;
			}
		};
		
		clearInterval(secondIframeEventTimer);
		
		secondIframe.document.getElementById("btnCancel").addEventListener('click', function(){
			secondIframeEventTimer = setInterval(secondIframeEvent, 100);
		},true )
		
		secondIframe.document.getElementById("btnTest").addEventListener('click', function(){
			secondIframeEventTimer = setInterval(secondIframeEvent, 100);
		},true )
	}
}