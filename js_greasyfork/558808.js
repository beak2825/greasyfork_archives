// ==UserScript==
// @name         asioka.net
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  cctv
// @author       You
// @match        https://asioka.net/*
// @require      https://libs.baidu.com/jquery/2.1.3/jquery.min.js
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/558808/asiokanet.user.js
// @updateURL https://update.greasyfork.org/scripts/558808/asiokanet.meta.js
// ==/UserScript==

(function() {
//document.querySelectorAll('.thumbnail>a>img')[0].src;
    if ($(".thumbnail>a>img").length>0) {
        $(".thumbnail>a>img").each(function(){
            var href = $(this).attr("src");
            href=href.replace('-360x270','');
            href=href.replace('_main','');
            $(this).attr('src',href);
        });
    }

})();