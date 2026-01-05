// ==UserScript==
// @name        CoinFlip Helper for PaidVerts
// @namespace   PV_CoinFlip_Help
// @description CoinFlip helper for PaidVerts
// @include     *://*.paidverts.com/member/games/coin_flip.html
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8248/CoinFlip%20Helper%20for%20PaidVerts.user.js
// @updateURL https://update.greasyfork.org/scripts/8248/CoinFlip%20Helper%20for%20PaidVerts.meta.js
// ==/UserScript==


function nextValue() {
 var b=bet.value, i;
 if (b>=arrValues[arrValues.length-1]) return;
 b--;
 for (i=0; i<arrValues.length; i++) {
  if (b<arrValues[i]) break;
 }
 bet.value=arrValues[i+1];
 if (bet.value=="undefined") bet.value=arrValues[arrValues.length-1];
}


var arrValues=[25,53,112,230,470,960,1955,5000], iHTML="";
arrValues.forEach(function(value, index, arr) {
 iHTML+="<a class='small_submit' onclick='bet.value=this.innerHTML'>" + value + "</a><BR>";
});
iHTML+="<a class='small_submit'>▽</a>";

valuesContainer=document.createElement("DIV");
valuesContainer.style="z-index:9; top: 0px; position: relative; text-align: left; transform: rotate(270deg); line-height: 2.5";
//valuesContainer.innerHTML="<a class='small_submit' onclick='bet.value=this.innerHTML'>25</a><BR><BR><a class='small_submit' onclick='bet.value=this.innerHTML'>53</a><BR><BR><a class='small_submit' onclick='bet.value=this.innerHTML'>112</a><BR><BR><a class='small_submit' onclick='bet.value=this.innerHTML'>230</a><BR><BR><a class='small_submit' onclick='bet.value=this.innerHTML'>470</a><BR><BR><a class='small_submit' onclick='bet.value=this.innerHTML'>960</a><BR><BR><a class='small_submit' onclick='bet.value=this.innerHTML'>1955</a><BR><BR><a class='small_submit' onclick='bet.value=this.innerHTML'>5000</a>";
//valuesContainer.innerHTML="<a class='small_submit' onclick='bet.value=this.innerHTML'>25</a><BR><a class='small_submit' onclick='bet.value=this.innerHTML'>53</a><BR><a class='small_submit' onclick='bet.value=this.innerHTML'>112</a><BR><a class='small_submit' onclick='bet.value=this.innerHTML'>230</a><BR><a class='small_submit' onclick='bet.value=this.innerHTML'>470</a><BR><a class='small_submit' onclick='bet.value=this.innerHTML'>960</a><BR><a class='small_submit' onclick='bet.value=this.innerHTML'>1955</a><BR><a class='small_submit' onclick='bet.value=this.innerHTML'>5000</a>";
valuesContainer.innerHTML=iHTML;
valuesContainer.lastElementChild.onclick=nextValue;
//valuesContainer.firstElementChild.style.textDecoration="overline";
flip.appendChild(valuesContainer);