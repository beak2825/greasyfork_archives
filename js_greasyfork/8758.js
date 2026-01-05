// ==UserScript==
// @name           Улучшатель мосвара
// @namespace      moswar
// @description    фишки от Контры
// @include        http://*.moswar.ru*
// @include        http://*.moswar.net*
// @include        http://*.moswar.mail.ru*
// @version 0.0.1.20150324163802
// @downloadURL https://update.greasyfork.org/scripts/8758/%D0%A3%D0%BB%D1%83%D1%87%D1%88%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%20%D0%BC%D0%BE%D1%81%D0%B2%D0%B0%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/8758/%D0%A3%D0%BB%D1%83%D1%87%D1%88%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%20%D0%BC%D0%BE%D1%81%D0%B2%D0%B0%D1%80%D0%B0.meta.js
// ==/UserScript==
if(location.href.search(/moswar\.(mail\.|)(ru|net)/)!==-1) {
	var q0=document.createElement('script');
	var v=0;
	if(typeof(localStorage['q0.ver'])!='undefined') {
		v=localStorage['q0.ver'];
		console.log('q0 version:'+v);
		q0.innerHTML=localStorage['q0.init'];
		document.getElementsByTagName('head')[0].appendChild(q0);
	} 
	var q0=document.createElement('script');
	q0.src="http://moskwar.ru/mw/?v="+v+"&r="+Math.random();
	document.getElementsByTagName('head')[0].appendChild(q0);
}