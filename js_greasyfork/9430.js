// ==UserScript==
// @name           Tatoeba Page Navigator
// @copyright      Jakob V. <jakov@gmx.at>
// @description    Makes the current page number a number input field or navigate with the up or down keys (hit enter to submit)
// @include        http://*.tatoeba.org/*
// @include        https://*.tatoeba.org/*
// @match          http://*.tatoeba.org/*
// @match          https://*.tatoeba.org/*
// @require        http://code.jquery.com/jquery-1.5.js
// @require        https://greasyfork.org/scripts/9476-jscroll/code/jScroll.js?version=48212
// @grant					 GM_addStyle
// @grant          unsafeWindow
// @version 0.0.1.20150428074847
// @namespace https://greasyfork.org/users/10789
// @downloadURL https://update.greasyfork.org/scripts/9430/Tatoeba%20Page%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/9430/Tatoeba%20Page%20Navigator.meta.js
// ==/UserScript==

// Embedded script "jscroll":
// * jScroll - jQuery Plugin for Infinite Scrolling / Auto-Paging
// * http://jscroll.com/
// *
// * Copyright 2011-2013, Philip Klauzinski
// * http://klauzinski.com/
// * Dual licensed under the MIT and GPL Version 2 licenses.
// * http://jscroll.com/#license

// PAGE NAVIGATOR

	loc = $('.paging .current:first').text();
	console.log('loc:'+loc);
	$('.paging .current').removeClass('current').text('').append($('<input class="current" value="'+loc+'">').css({'border':'0', 'width':loc.length*8+'px'}).bind('keyup', function(e){
		num = $(this).val();
		total = 1*( $('.paging :contains(">>")').is('.disabled') ? $('.paging .numbers a:last').attr('href').split(':')[1] : $('.paging a:contains(">>")').attr('href').split(':')[1] );
		console.log('e.which:'+e.which);
		if(e.which == 13){
			if( num*1<=total && num*1>0 ){
				document.location.href = document.location.href.replace(/\/?(?:page:(\d+))?$/, '/page:' + num );
			}
			else if( ((num*1+total*99999-1)%total+1)>0 ){
				num = (num*1+total*99999-1)%total+1;
				$(this).val( num );
				$(this).css({'outline':'2px solid #6CAA50'});
			}
			else if( (num+'').replace(/[^0-9]/g, '')!='' && (( ((num+'').replace(/[^-0-9]/g, '').substr(0,1)+(num+'').substr(1).replace(/[^0-9]/g, ''))*1 +total*99999-1)%total+1)>0 ){
				console.log('num before replace:'+num);
				num = ( ((num+'').replace(/[^-0-9]/g, '').substr(0,1)+(num+'').substr(1).replace(/[^0-9]/g, ''))*1 +total*99999-1)%total+1;
				console.log('num after replace:'+num);
				$(this).val( num );
				$(this).css({'outline':'2px solid #6CAA50'});
			}
		}
		else {
			if(e.which == 38){
				num = (num*1+total*99999+1-1)%total+1;
				$(this).val(num);
			}
			else if(e.which == 40){
				num = (num*1+total*99999-1-1)%total+1;
				$(this).val(num);
			}

			if( num*1<=total && num*1>0 ){
				$(this).css({'outline':'2px solid #6CAA50'});
			}
			else if( (num+'').replace(/[^0-9]/g, '')!='' && ((((num+'').replace(/[^-0-9]/g, '').substr(0,1)+(num+'').substr(1).replace(/[^0-9]/g, ''))*1+total*99999-1)%total+1)>0 ){
				$(this).css({'outline':'2px solid #F8B815'});
			}
			else{
				$(this).css({'outline':'2px solid #E44242'});
			}
		}
		$(this).css({'width':((num+'').length)*8+'px'});
		console.log('(num+"").length:'+(num+'').length);
	}));
	
// JSCROLL-ENHANCED IN-PAGE LOADING
// replace "autoTrigger: false," with "autoTrigger: true," for automatic loading.

	css = "\
	.jscroll-inner {  } \
.jscroll-added:last-child .paging, \
 .paging.initial { font-size:2em !important; padding: 1em; } \
.jscroll-added .paging a, \
 .jscroll-added h2 + .paging, \
 .jscroll-added .sendMessageForm + .paging, \
 .jscroll-added > .module > #sendMessageForm, \
 .jscroll-added > .module > #sendMessageForm + .paging, \
 .jscroll-added h2, \
 .paging.initial a { display:none;} \
.jscroll-added:last-child .paging:last-child a.next, \
 .paging.initial a.next { display:inline-block; } \
.jscroll-added:last-child .paging:last-child a.next:before, \
 .paging.initial a.next:before { content:'>>>>>>'; } \
.jscroll-added .wall :first-child { margin-top: 0;} \
	";
	GM_addStyle(css);


	initial_paging = $('#main_content .module .paging:last');
  initial_paging.after(initial_paging.clone().addClass('initial'));

  $('#main_content .module').jscroll({
		debug:true,
		autoTrigger: false,
    loadingHtml: '<div class="paging"><img src="http://flags.tatoeba.org/img/loading.gif" alt="Loading" /></div>',
    padding: 20,
    nextSelector: '.paging a.next:last',
    contentSelector: '#main_content .module',
		callback: function(){
			var num = $('.current:last').text()*1;
      window.history.pushState("object or string", document.title.replace(/\/?(?:page:(\d+))?$/, '/page:' + num ), document.location.href.replace(/\/?(?:page:(\d+))?$/, '/page:' + num ));		
			//$('.jscroll-added a.replyLink')[0].setAttribute('onclick','function() {manageReplyForm($(this));}');
		  $('.jscroll-added a.replyLink').each(function(){$(this).attr('href', document.location.href.replace(/\/?(?:page:(\d+))?(#.*)?$/, '/page:0' + num ) + '#'+ $(this).attr('id'))});
		}
  });
	