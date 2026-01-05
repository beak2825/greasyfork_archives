// ==UserScript==
// @name        CU e-Thesis auto login
// @match       https://ethesis.grad.chula.ac.th/
// @description Automatically login to CU e-Thesis
// @version     0.1
// @grant       none
// @namespace   https://greasyfork.org/users/4947
// @downloadURL https://update.greasyfork.org/scripts/9975/CU%20e-Thesis%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/9975/CU%20e-Thesis%20auto%20login.meta.js
// ==/UserScript==

submit();
function submit(){
	if (document.getElementsByName('Username')[0].value && document.getElementsByName('Password')[0].value){
		document.getElementsByName('Remember')[0].checked=true;
		document.getElementById('form-login').submit();
	}
	else
		setTimeout(submit);
}
