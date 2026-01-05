// ==UserScript==
// @name        Entré Portal Modifikation
// @namespace   hantverksdata.entre.portal.mod
// @description Modifikation för entré portal plus.
// @include     *portal.hantverksdata.se*
// @version     0.1.3
// @require     http://code.jquery.com/jquery-1.11.1.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6470/Entr%C3%A9%20Portal%20Modifikation.user.js
// @updateURL https://update.greasyfork.org/scripts/6470/Entr%C3%A9%20Portal%20Modifikation.meta.js
// ==/UserScript==

/*
DEBUG DEFINES:
1 = Print debug info
2 = Print debug info + v (verbose)
4 = Print debug info + vv
8 = Print debug info + vvv
*/
var debug = 4;
var myVar='';
var saved;
function myTimer(){
var anchors = document.getElementsByTagName('tr');
		numOrders=0;
		var id=0;
		var msg;
		for(var i = 0; i < anchors.length; i++) {
			var cur= anchors[i].getAttribute('id');
			var descElement;
			msg = "mcph_OrderListGrid_DXDataRow" + id;
			if (cur == msg) {
				var curID = anchors[i].childNodes[1].innerHTML;
				
				descElement = anchors[i].childNodes[3];
				saved = getCookie(curID + "c");
				descElement.innerHTML = saved;
				var description = getCookie(curID);
	
				
				if(description){
					descElement.innerHTML = "<font color=\"gray\">"+descElement.innerHTML + "</font>" + "<br><font color=darkred>Arbetsbeskrivning:</font>" + description;
					
				}
				if(getCookie(anchors[i].childNodes[1].innerHTML)){
					log("	Found: " + anchors[i].childNodes[1].innerHTML + " (" + description + ")", 4);
				}
				numOrders++;
				id=id+1;
			//	anchors[i].setAttribute('onclick', "console.log(lastselected); if(lastselected){document.getElementById(lastselected).setAttribute(\'class\', \'dxgvDataRow\'); } this.setAttribute(\'class\',\'dxgvSelectedRow\'); var lastselected=this.getAttribute('id'); alert(lastselected);");
				//anchors[i].setAttribute('onmouseout', "this.setAttribute(\'class\',\'dxgvDataRow\');");
			}else{

				log("Check current element: cur=" + cur + " and we are looking for:=" + msg, 8);
			}
		}
	
	//window.clearInterval(myVar);	
}
function timer(){

}
/* id:lp */

$(document).ready(function () {
	log("loaded");

	if (/\bOrderList\.aspx\b/.test(window.location)) {
		myVar=setInterval(function () {myTimer()}, 1000);
		
	}
	else if (/\bEditOrder\.aspx\?order=\b/.test(window.location)) {
		/* Get current open order Id (top right corner) and parse*/
		var orderId = document.getElementById('HeaderBarContentPlaceHolder_TopicLabel').innerHTML;
		orderId = orderId.split(' ')[1];
		
		log("Current window location: " + window.location.href + "\nEdit Order: "+orderInfo, 4);
		/* Get order description from form textbox mcph_txt_OR1_Order_ORDINFO_0 */
		var orderInfo = document.getElementById('mcph_txt_OR1_Order_ORDINFO_0').innerHTML;
		orderInfo = orderInfo.replace('\n', ' ');		orderInfo = orderInfo.replace('\n', ' ');		orderInfo = orderInfo.replace('\n', ' ');		orderInfo = orderInfo.replace('\n', ' ');		orderInfo = orderInfo.replace('\n', ' ');    
		
		/* Create cookies with Marke and another one for description. Name of cookie = orderId 
			Name for cookie Marke = orderID+"c"*/
		var elementMarke = document.getElementById('mcph_txt_OR1_Order_MARKE_0');
		log("Creating cookie:"+orderId+" with value:"+orderInfo, 8);
		log("Creating cookie:"+orderId+"c"+" with value:"+elementMarke.value, 8);
		setCookie(orderId, orderInfo,1);
		setCookie(orderId+"c", elementMarke.value, 1);
	}

});    
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = 'expires=' + d.toGMTString();
	document.cookie = cname + '=' + cvalue + '; ' + expires;
}
function getCookie(c_name) {
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + '=');
		if (c_start != - 1) {
			c_start = c_start + c_name.length + 1;
			c_end = document.cookie.indexOf(';', c_start);
			if (c_end == - 1) c_end = document.cookie.length;
			return unescape(document.cookie.substring(c_start, c_end));
		}
	}
	return '';
}
function log(msg, verbose){
	if (typeof verbose === 'undefined') { verbose = 1; }
	if(debug){
		if(verbose <= debug){
			console.log(msg);
		}
	}
}
