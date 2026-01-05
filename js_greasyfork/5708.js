/*
 * Title: DeviantArt Link Tweaker
 * Description: Tweaks the way certain links are displayed on DeviantArt
 * Author: IE User
 * Updated: 9/1/2014
 * 
 */

// ==UserScript==
// @name DeviantArt Link Tweaker
// @description Tweaks the way certain links are displayed on DeviantArt
// @include http://*.deviantart.com/*
// @namespace https://greasyfork.org/users/6055
// @version 0.0.1.20141015044729
// @downloadURL https://update.greasyfork.org/scripts/5708/DeviantArt%20Link%20Tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/5708/DeviantArt%20Link%20Tweaker.meta.js
// ==/UserScript==

var $;

// Add jQuery
    (function(){
        if (typeof unsafeWindow.jQuery == 'undefined') {
            var GM_Head = document.getElementsByTagName('head')[0] || document.documentElement,
                GM_JQ = document.createElement('script');
    
            GM_JQ.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
            GM_JQ.type = 'text/javascript';
            GM_JQ.async = true;
    
            GM_Head.insertBefore(GM_JQ, GM_Head.firstChild);
        }
        GM_wait();
    })();

// Check if jQuery's loaded
    function GM_wait() {
        if (typeof unsafeWindow.jQuery == 'undefined') {
            window.setTimeout(GM_wait, 100);
        } else {
            $ = unsafeWindow.jQuery.noConflict(true);
            letsJQuery();
        }
    }

// All your GM code must be inside this function
    function letsJQuery() {
        //alert($); // check if the dollar (jquery) function works
        //alert($().jquery); // check jQuery version

        $('a.thumb').each(function() {
        	h = $(this).find('img:last-of-type').attr('src');
        	if (h) {
        		$(this).attr('href', h.replace('200H/','') );
        	}
        });
        $(document.head).append('<style>.tt-fh.crop-h:hover .tt-bookendh{display:none!important}body.maturefilter .ismature::after{transform:rotate(45deg);transform-origin:bottom;background:red;color:#fff;content:"mature";font-size:8px;height:10px;position:absolute;right:-10px;top:10px;width:60px}html body.maturefilter .ismature{background:0!important;overflow:hidden}html body.maturefilter .ismature img,html body.maturefilter span.shadow-holder .ismature img{opacity:.15;transition:opacity .5s;visibility:visible!important}html body.maturefilter .ismature:hover img{opacity:1}iframe:not(.flashtime){display:none}</style>');
    }