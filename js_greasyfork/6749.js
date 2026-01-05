// ==UserScript==
// @name         pic.inmac links handler
// @version      0.5
// @description  Allows to get links for all uploaded links in one click
// @author       DevMan
// @include      http*://pic.inmac.org/*
// @grant        none
// @namespace	 https://greasyfork.org/users/7303
// @require      https://code.jquery.com/jquery-2.1.1.min.js
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/6749/picinmac%20links%20handler.user.js
// @updateURL https://update.greasyfork.org/scripts/6749/picinmac%20links%20handler.meta.js
// ==/UserScript==

(function() {
    var $ = jQuery.noConflict();

	$('.nav').append('<li><a href="#" id="do-copy">Copy links</a></li>');
	$('#do-copy').click(function(){doCopy();});

	function getLinks() {
		var links = $('input#show_url');
	    var result = {
	        direct: [],
	        th: [],
	        img: []
	    }
	    for( var i = 0, size = links.length; i < size; i+=3 ) {
	        result.direct.push( $(links[i]).val() );
	        result.th.push( $(links[i+1]).val() );
	        result.img.push( $(links[i+2]).val() );
	    }
	    return result;
	}

	function doCopy() {
	    var links = getLinks();
	    if( links.direct.length == 0 ) {
	        return;
	    }
    
	    $('#links').remove();
	    $('.navbar').after('<div class="container" id="links" style="white-space: pre-line;"></div>');
	    var el = $('#links');
	    el.append('<h5>Direct links:</h5>');
	    for( var i in links.direct ) {
	        el.append( links.direct[i] + '<br>' );
	    }
	    el.append('<h5>TH links:</h5>');
	    for( var i in links.th ) {
	        el.append( links.th[i] + ' ' );
	    }
	    el.append('<h5>Forum links:</h5>');
	    for( var i in links.img ) {
	        el.append( links.img[i] + ' ' );
	    }
	    $( window ).scrollTop( 0 );
	}
})();