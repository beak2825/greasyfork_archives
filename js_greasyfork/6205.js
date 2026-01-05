// ==UserScript==
// @name         MTurk Auto-Accept changer for mturkgrind.com
// @author       Kerek
// @namespace    Kerek
// @version      0.2.3x
// @description  Add a "previewandaccept" link after the preview link for HITs posted on mturk-related forums: MTurkGrind, MTurkForum, and TurkerNation.
// @require      http://code.jquery.com/jquery-latest.min.js
// @include      http://www.mturkgrind.com/*
// @include      http://mturkgrind.com/*
// @include      http://www.mturkforum.com/*
// @include      http://mturkforum.com/*
// @include      http://www.turkernation.com/*
// @include      http://turkernation.com/*
// @copyright    2014
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/6205/MTurk%20Auto-Accept%20changer%20for%20mturkgrindcom.user.js
// @updateURL https://update.greasyfork.org/scripts/6205/MTurk%20Auto-Accept%20changer%20for%20mturkgrindcom.meta.js
// ==/UserScript==


$('a[href*="/mturk/preview?"]').each(function(){
    var preview_link=$(this).attr('href').replace("preview?", "previewandaccept?");
    var link_color = $(this).find('font').attr('color');
    var link_html = "<a href='" + preview_link + "' target='_blank'><font color=" + link_color + ">ACCEPT</font></a>";
    $(this).after (" &nbsp;|&nbsp; " + link_html);    
});