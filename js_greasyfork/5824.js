// ==UserScript==
// @name       yunfile_auto_click
// @namespace  yunfile.com
// @version    0.1
// @description  enter something useful
// @include    *.yunfile.com/*
// @match      *.yunfile.com/*
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/5824/yunfile_auto_click.user.js
// @updateURL https://update.greasyfork.org/scripts/5824/yunfile_auto_click.meta.js
// ==/UserScript==

if( document.getElementById('downbtn') ){
	var a = document.querySelectorAll('#downbtn a')
    for(var x in a){
		if ( a.hasOwnProperty(x) ) {
			if( a[x].innerHTML == '這裡下載' ){
				simulateClick(a[x])
				break;
			}
		}
    }
}

function simulateClick(e){
	e.nodeType || (e=e.length==1?e[0]:null);
	if( e )
	{
	  var Event;
	  Event = document.createEvent("MouseEvents");
	  Event.initEvent("mousedown", true, true);
	  e.dispatchEvent(Event);
	  Event = document.createEvent("MouseEvents");
	  Event.initEvent("click", true, true);
	  e.dispatchEvent(Event);
	  Event = document.createEvent("MouseEvents");
	  Event.initEvent("mouseup", true, true);
	  e.dispatchEvent(Event);
	}
}
var vcode = document.getElementById('vcode');
if( vcode ){
	var auto_wait = setInterval(function(){
		if( document.getElementById('showmsgdiv').css.display == 'block' ){
			setTimeout(function(){
				document.getElementById('showmsgdiv').css.display = 'none';
			},5000);
		}
		if( vcode.value.length == 4){
		  simulateClick( document.getElementById('slow_button') )
		}
	},30000);
}