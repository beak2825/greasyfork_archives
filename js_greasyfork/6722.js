// ==UserScript==
// @name           hwm_cyfral_strength
// @author         Demin
// @namespace      Demin
// @description    Cyfral strength (by Demin)
// @homepage       https://greasyfork.org/users/1602-demin
// @icon           http://i.imgur.com/LZJFLgt.png
// @version        1.1
// @encoding 	   utf-8
// @include        http://*heroeswm.ru/home.php*
// @include        http://178.248.235.15/home.php*
// @include        http://209.200.152.144/home.php*
// @include        http://*lordswm.com/home.php*
// @include        http://*heroeswm.ru/pl_info.php*
// @include        http://178.248.235.15/pl_info.php*
// @include        http://209.200.152.144/pl_info.php*
// @include        http://*lordswm.com/pl_info.php*
// @include        http://*heroeswm.ru/inventory.php*
// @include        http://178.248.235.15/inventory.php*
// @include        http://209.200.152.144/inventory.php*
// @include        http://*lordswm.com/inventory.php*
// @downloadURL https://update.greasyfork.org/scripts/6722/hwm_cyfral_strength.user.js
// @updateURL https://update.greasyfork.org/scripts/6722/hwm_cyfral_strength.meta.js
// ==/UserScript==

var url_cur = location.href;
var url = 'http://'+location.hostname+'/';

if (!this.GM_addStyle || (this.GM_addStyle.toString && this.GM_addStyle.toString().indexOf("not supported")>-1)) {
	this.GM_addStyle=function (key) {
		var style = document.createElement('style');
		style.textContent = key;
		document.querySelector("head").appendChild(style);
	}
}

GM_addStyle('\
#breadcrumbs li ul {\
	z-index:20;\
}\
');

var item_hard_regexp = /: (\d+)\/(\d+)/
var item_name_regexp = /uid=(\d+)/
var item_id_regexp = /pull_off=(\d+)/

if( location.pathname=='/inventory.php' )
{
	var els = getI( "//a[contains(@href, '#')]" ) ;
	var elo = '' ;
	for( var i = 0; i < els.snapshotLength; i++ )
	{
		var el = els.snapshotItem(i);
		an = item_id_regexp.exec( el.href ) ;
		if( an )
		{
			if( elo == an[1] )
				continue
			else
				elo = an[1]
		}
		p = item_hard_regexp.exec( el.parentNode.innerHTML ) ;
	if ( p ) {
		d = document.createElement( 'div' );
		d.innerHTML = p[1] ;
		d.style.fontSize = '9px' ;
		d.style.padding = '0px 1px' ;
		d.style.border = '1px solid #eecd59' ;
		d.style.margin = '2px' ;
		d.style.background = '#FFF' ;
		d.style.position = 'absolute' ;
		el.parentNode.insertBefore( d , el ) ;
	}
	}
} else
{
	var els = getI( "//a[contains(@href, 'art_info.php')]" ) ;
	var elo = '' ;
	for( var i = 0; i < els.snapshotLength; i++ )
	{
		var el = els.snapshotItem(i);
		an = item_name_regexp.exec( el.href ) ;
		if( an )
		{
			if( elo == an[1] )
				continue
			else
				elo = an[1]
		}
		p = item_hard_regexp.exec( el.parentNode.innerHTML ) ;
		d = document.createElement( 'div' );
		d.innerHTML = p[1] ;
		d.style.fontSize = '9px' ;
		d.style.padding = '0px 1px' ;
		d.style.border = '1px solid #eecd59' ;
		d.style.margin = '2px' ;
		d.style.background = '#FFF' ;
		d.style.position = 'absolute' ;
		el.parentNode.insertBefore( d , el ) ;
	}
}

function getI(xpath,elem){return document.evaluate(xpath,(!elem?document:elem),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}

function $( id ) { return document.getElementById( id ); }
