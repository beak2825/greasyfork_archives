// ==UserScript==
// @id             2bb27cf9-bf9c-48b3-9a3d-477bf0dee797
// @name           erp.szboanda.com.login
// @version        1.0
// @namespace      szboanda.com
// @author         Andy
// @description    免key登录
// @include        https://erp.szboanda.com/erp/
// @include	   http://erp.szboanda.com:8889/erp/
// @run-at         document-end
// @grant	   none
// @downloadURL https://update.greasyfork.org/scripts/7162/erpszboandacomlogin.user.js
// @updateURL https://update.greasyfork.org/scripts/7162/erpszboandacomlogin.meta.js
// ==/UserScript==

(function() {
    document.getElementById('userid').value = '3F62000000007023';
    document.getElementById('password').value = '1';
	document.getElementById('yhlable').value = '王勇';
})();
