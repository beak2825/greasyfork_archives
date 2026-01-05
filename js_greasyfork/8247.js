// ==UserScript==
// @name        CoinFlip Helper for MyTrafficValue
// @namespace   MyTrafficValue CoinFlip Helper
// @description Helper for MyTrafficValue CoinFlip Game
// @include     *://*.mytrafficvalue.com/games/coin_flip.html
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8247/CoinFlip%20Helper%20for%20MyTrafficValue.user.js
// @updateURL https://update.greasyfork.org/scripts/8247/CoinFlip%20Helper%20for%20MyTrafficValue.meta.js
// ==/UserScript==

var list=$(".commissions")[0];
var arrValues=[25000,50774,103120,209430,425338,863832,1754381,3563023];

var optBox=document.createElement("SELECT"); optBox.style="width: 100%"; optBox.setAttribute("size",arrValues.length-1);
arrValues.forEach(function(value, index, arr) {
 var opt=document.createElement("OPTION"); opt.style.direction="rtl"; opt.value=value; opt.text=(value/100000).toFixed(5);
 optBox.insertBefore(opt, optBox.firstChild);
});

var frm=document.createElement("FORM");
frm.appendChild(optBox);

//var tblCommissions=$(".commissions")[0];
//tblCommissions.parentElement.insertBefore(frm, tblCommissions.previousElementSibling);
//tblCommissions.parentElement.insertBefore(document.createElement("BR"), tblCommissions.previousElementSibling);

left_menu.appendChild(document.createElement("BR"));
left_menu.appendChild(frm);

//optBox.lastChild.text="Reset   " + frm.firstChild.lastChild.text;
optBox.lastChild.value=arrValues[0];
optBox.lastChild.selected=true;
optBox.onchange=function() {
 bet.value=optBox.value/100000;
}
optBox.onchange();
optBox.focus();