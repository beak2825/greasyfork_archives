// ==UserScript==
// @name        DailyMail article only
// @namespace   tag://kwhitefoot@hotmail.com
// @description Remove the picture links carousel, the Facebook, g+, etc., icons, comments, and other junk leaving only the article.
// @include     http://www.dailymail.co.uk/*
// @version     0.1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant       none
// @license     GPL3
// @compatible  firefox 
// @supportURL  kwhitefoot@hotmail.com
// @downloadURL https://update.greasyfork.org/scripts/9556/DailyMail%20article%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/9556/DailyMail%20article%20only.meta.js
// ==/UserScript==

/*


Kevin Whitefoot, 2015-04-27.

You might need to use noscript as well to forbid the taboola scripts.

*/

window.$(document).ready(function () {
    window.$('#mini-carousel-wrapper').remove();
    window.$('.branding').remove();
    window.$('.floating-menu').remove();
    window.$('.related-carousel').remove();
    window.$('.rotator').remove();
    window.$('.rotator-pages').remove();
    window.$('.shareArticles').remove();
    window.$('.thumbBlock').remove();
    window.$('.thumbnail-overlay').remove();
    window.$('.trc_rbox').remove();
    window.$('.trc_rbox_container').remove();
    window.$('.trc_rbox_div').remove();
    window.$('.trc_rbox_outer').remove();
    window.$('.videoCube').remove();
    window.$('.wocc').remove();
    window.$('.image-wrap').remove();
    window.$('.mol-img').remove();
    window.$('.mobile-gallery').remove();
    window.$('.mobile-gallery-icon').remove();
    window.$('#articleIconLinksContainer').remove();
    window.$('#taboola-below-main-column').remove();
    window.$('#most-watched-videos-wrapper').remove();
    window.$('#most-watched-videos').remove();


});

