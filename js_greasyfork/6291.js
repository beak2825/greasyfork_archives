// ==UserScript==
// @name		P9IDFilter
// @description unofficial helper for psnine.com (PSNINE)
// @author		jimmyleo
// @namespace	com.jimmyleo.psnine.idfilter 
// @include		http://*psnine.com/*
// @version     0.04
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/6291/P9IDFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/6291/P9IDFilter.meta.js
// ==/UserScript==

var m_strBoringID = new Array(""); 

$(document).ready(function(){	
	if ( 0 === location.pathname.indexOf('/topic/') || 0 === location.pathname.indexOf('/gene/') ){
		Filter('div.post');
	}
	else{
		Filter('li');
	}
});

function Filter( ParentClassPattern ){
	$('a').each( function(index){
		var strID = $(this).text();
		if ( -1 !== $(this).attr('class').indexOf('node') ){		
			for (var i = 0; i < m_strBoringID.length; i++) {
				if ( m_strBoringID[i] == strID ) {
					$(this).parents(ParentClassPattern).hide();
					break;
				}				
			}
		}
	}
	);
}