// ==UserScript==
// @name        fixpol
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace   fixpol
// @description fix_pol
// @include     http://boards.4chan.org/pol/*
// @include     boards.4chan.org/pol/*
// @include     *4chan.org/pol/*
// @version     1
// @grant       none 
// @downloadURL https://update.greasyfork.org/scripts/7049/fixpol.user.js
// @updateURL https://update.greasyfork.org/scripts/7049/fixpol.meta.js
// ==/UserScript==
 
 window.setInterval(function(){
	$("marquee").remove();  
	$("div blockquote a.deadlink").each(function() 
	{
		var postnum = $(this).attr("data-post-i-d");
		if(postnum.length == 9)
		{
			$(this).removeAttr("data-board-i-d");
			$(this).attr("class","quotelink");
			$(this).attr("href","#p"+postnum.slice(0,-1));
			$(this).removeAttr("target");
			$(this).removeAttr("data-post-i-d");
			$(this).html(">>"+postnum.slice(0,-1));
		}
	}); 
}, 5000);
