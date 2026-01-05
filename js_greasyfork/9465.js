// ==UserScript==
// @name        GitHub: fix Asciidoc rendering
// @namespace   https://github.com/powerman/userjs-github-asciidoc
// @description Fix Asciidoc rendering on GitHub: add standard Asciidoc icons to NOTE/TIP/etc., highlight block titles, fix TOC.
// @include     /^https://github.com/[^/]+/[^/]+([#?].*)?$/
// @include     /^https://github.com/[^/]+/[^/]+/blob/.*\.(asciidoc|adoc|asc)([#?].*)?$/
// @include     /^https://github.com/[^/]+/[^/]+/wiki.*$/
// @include     /^https://gist.github.com/[^/]+/.*$/
// @version     1.7
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/9465/GitHub%3A%20fix%20Asciidoc%20rendering.user.js
// @updateURL https://update.greasyfork.org/scripts/9465/GitHub%3A%20fix%20Asciidoc%20rendering.meta.js
// ==/UserScript==

(function(window,$){
	'use strict';

	var icons = 'https://raw.githubusercontent.com/powerman/asciidoc-cheatsheet/master/images/icons/';
	var handler = function(){

		if(window.location.host==='gist.github.com'){
			var filename = $('strong.file-name').html();
			if(filename===undefined || !filename.match('\\.(asciidoc|adoc|asc)$')){
				return;
			}
		}

		// Replace text with icons for NOTE/TIP/etc.
		$('tbody > tr > td:first-child > div')
			.filter(function(){ return this.innerHTML==='Note'; })
			.html('<img src="'+icons+'note.png">');
		$('tbody > tr > td:first-child > div')
			.filter(function(){ return this.innerHTML==='Tip'; })
			.html('<img src="'+icons+'tip.png">');
		$('tbody > tr > td:first-child > div')
			.filter(function(){ return this.innerHTML==='Important'; })
			.html('<img src="'+icons+'important.png">');
		$('tbody > tr > td:first-child > div')
			.filter(function(){ return this.innerHTML==='Warning'; })
			.html('<img src="'+icons+'warning.png">');
		$('tbody > tr > td:first-child > div')
			.filter(function(){ return this.innerHTML==='Caution'; })
			.html('<img src="'+icons+'caution.png">');
		// Remove border around NOTE/TIP/etc and fix it width.
		$('tbody:has(> tr > td:first-child > div > img)').find('tr, td').css({'border':'none'});
		$('tbody > tr > td:first-child > div > img').css({'max-width':'none'});

		// Make block titles bold
		$('.markdown-body div > div:first-child + *').prev().filter(':not(:has(*))').css({'font-weight':'bold'});
		$('.markdown-body td > div:first-child').filter(':not(:has(*))').css({'font-weight':'bold'});
	};

	window.addEventListener('load', handler, false);
	$(document).on('pjax:end', handler);

})(window,$);
