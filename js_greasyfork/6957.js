// ==UserScript==
// @name			Point.im Scripts
// @version			2025.10.21
// @description		Подкраска своих постов + горячие клавиши
// @match			http*://*.point.im/*
// @icon			https://www.google.com/s2/favicons?domain=point.im
// @author			Rainbow-Spike
// @namespace       https://greasyfork.org/users/7568
// @homepage        https://greasyfork.org/ru/users/7568-dr-yukon
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/6957/Pointim%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/6957/Pointim%20Scripts.meta.js
// ==/UserScript==

var SelfPostMarker = 1,
	limit = 10,
	me = document . querySelector ( '#menu-profile' ),
		name = ( me != null ) ? me . href . replace ( /.*\/\/(.+)\.point\.im.*/i, "$1" ) : '-',
	link, comm;

if ( SelfPostMarker == 1 ) {
	document . querySelectorAll ( '#comments article.post' ) . forEach ( function ( e ) {
		link = ( e != null ) ? e . querySelector ( 'a' ) : '';
		comm = ( link != ( '' || null ) ) ? link . href . replace ( /.*\/\/(.+)\.point\.im.*/i, "$1" ) : '';
		e . style . cssText += ( comm == name ) ? 'border: 2px dashed #ccc; border-radius: 10px; margin: -1px -2px -1px -9px; padding: 4px 2px 4px 7px;' : '';
	} );
}

document . querySelector ( '#header #new-post-label' )						. accessKey = 'w'; /* "Написать", акцесскей W */
document . querySelector ( '#new-post-wrap .buttons #new-post-hide-label' ) . accessKey = '0'; /* "Отмена", акцесскей 0 */
document . querySelector ( '#new-post-wrap .buttons input[type="submit"]' ) . accessKey = 's'; /* "Сохранить", акцесскей S */
