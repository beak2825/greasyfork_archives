// ==UserScript==
// @name        Remove Yandex Mail Results Redirect
// @include     http://mail.yandex.*
// @include     https://mail.yandex.*
// @homepage    https://greasyfork.org/ru/scripts/8253-remove-yandex-mail-results-redirect
// @grant       unsafeWindow
// @version     0.21
// @description Удаляет редиректы из писем Yandex Mail.
// @namespace   https://greasyfork.org/users/9347
// @downloadURL https://update.greasyfork.org/scripts/8253/Remove%20Yandex%20Mail%20Results%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/8253/Remove%20Yandex%20Mail%20Results%20Redirect.meta.js
// ==/UserScript==
	

if(unsafeWindow.top == unsafeWindow.self){
	document.addEventListener('DOMNodeInserted',function(e){
		window.setTimeout(function(){
		var rl = document.querySelectorAll('a[data-vdir-href*="yandex"]');
		for (var l=0;l<rl.length;l++)
			rl[l].removeAttribute('data-vdir-href');
		}, 250);}
	, false);
}