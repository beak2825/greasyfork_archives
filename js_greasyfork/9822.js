// ==UserScript==
// @name        Deproxy gMail images onError
// @description If loading of gMail-proxied image fails, changes it's SRC to original
// @namespace   http://eldar.cz/myf/
// @include     https://mail.google.com/*
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9822/Deproxy%20gMail%20images%20onError.user.js
// @updateURL https://update.greasyfork.org/scripts/9822/Deproxy%20gMail%20images%20onError.meta.js
// ==/UserScript==
;(function()
{	"use strict"
;	deproxy_gmail_images();
;	function deproxy_gmail_images()
	{	var rxg = /.*?googleusercontent.*?#/
		,	prevent_propname = 'already tried to deproxy this image, move along'
	;	document.body.addEventListener
		(	'error'
		,	handleResourceError
		,	true
		)
	;	function handleResourceError(e)
		{	var el = e.target
		;	if( !el || !el.tagName || 'IMG' != el.tagName || el[prevent_propname] )
				return
		;	el[prevent_propname] = true
		;	if( rxg.test(el.src) )
				el.src = el.src.replace(rxg, '')
		}
	}
})();



