// ==UserScript==
// @name        netauth Chula
// @description check accept agreement, auto focus captcha and submit
// @include     https://netauth.it.chula.ac.th/user/Logon.do
// @version     1.1
// @grant       none
// @namespace https://greasyfork.org/users/4947
// @downloadURL https://update.greasyfork.org/scripts/7706/netauth%20Chula.user.js
// @updateURL https://update.greasyfork.org/scripts/7706/netauth%20Chula.meta.js
// ==/UserScript==

checkY.checked=true;
var verificationCode=document.getElementsByName('verificationCode')[0];
verificationCode.addEventListener('input',function(){
	verificationCode.value.length==5 && document.forms[0].submit();
},true);
verificationCode.focus();
verificationCode.autocomplete='off';
