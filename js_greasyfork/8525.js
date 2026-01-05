// ==UserScript==
// @name       simple xtube amateur and sponsored vids removal
// @description  remove sponsored and amateur 15s videos on xtube.com
// @namespace  urso/xtube
// @version    0.2
// @copyright  2015+, urso
// @include        http://www.xtube.com/
// @include        http://www.xtube.com/?*
// @include        http://www.xtube.com/*.php*
// @require        //cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/8525/simple%20xtube%20amateur%20and%20sponsored%20vids%20removal.user.js
// @updateURL https://update.greasyfork.org/scripts/8525/simple%20xtube%20amateur%20and%20sponsored%20vids%20removal.meta.js
// ==/UserScript==


/**
 * VERSION HISTORY
 *
 * 0.2  "related videos" sidebar vids coloured; march 2015
 */

/**
 * User Options
 */

// Additional users can be added to the sponsored list by adding "|username" immediately before the closing parenthesis.
var sponsoredRegex = /(xtubehouse|xtube_sponsor|xxxvids|pornhub|tube8|extremetube)/;
var amateurRegex = /\/amateur_channels\/play.php\?v=.*|\&type=preview|v=.*__/;



/**
 *	Main page and search cleanup 
 */
$("article.Card.Card--video").each(function() {  
	var username = $( this ).find("div.Card__inner div.Card__row").eq(2).find("div.Card__user a").text();
    //console.log(username);
    
    var url =  $( this ).find("div.Card__inner div.Card__row").eq(0).find("h3 a").addClass("foo").attr("href");
    //console.log(url);
    
    //console.log(amateurRegex.test(url));
    //console.log(sponsoredRegex.test(username));
    if (amateurRegex.test(url)|sponsoredRegex.test(username)) {
    	$(this).css('display','none');
	}
    
});

/**
 *	Related videos colouring 
 */

$("div.related-videos-details").each(function() {  
	var username = $( this ).find("a.username").text();
    //console.log(username);
    
    var url =  $( this ).find("a.underline").attr("href");
    //console.log(url);
    
    //console.log(amateurRegex.test(url));
    //console.log(sponsoredRegex.test(username));
    if (amateurRegex.test(url)|sponsoredRegex.test(username)) {
    	$(this).css('background-color','lightblue');
	}
    
});