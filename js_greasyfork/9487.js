// ==UserScript==
// @name        mmmturkeybacon Preview Overlay
// @version     1.02
// @description Covers a HIT's workspace with a gray overlay if the HIT has not been accepted. Clicking once on the overlay will remove the gray foreground and allow you to interact with the HIT's contents while still showing a message warning you the hit has not been accepted.
// @author      mmmturkeybacon
// @namespace   http://userscripts.org/users/523367
// @include     http://*/*
// @include     https://*/*
// @exclude     https://www.mturk.com/mturk/takequalificationtest
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/9487/mmmturkeybacon%20Preview%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/9487/mmmturkeybacon%20Preview%20Overlay.meta.js
// ==/UserScript==

$(window).load(function()
{
    var $hit_wrapper = $('div[id="hit-wrapper"]');
    if(window.location.hostname == 'www.mturk.com' && $hit_wrapper.length > 0)
    {//internal HIT
        $hit_wrapper.css({"position": "relative"});
        var offset = $hit_wrapper.offset();
        $hit_wrapper.append('<div id="mtb_preview_overlay" \
                               title="This HIT has not been accepted. Click once to interact with content." \
                               style="position: absolute; left: 0px; top: 0px; \
                                      width: 100%; height: 100%; \
                                      opacity: 0.6; background-color: #000; z-index: 99; \
                                      color: #333; \
                                      font-family: &quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif; \
                                      font-size: 14px; \
                                      line-height: 20px; \
                                      cursor: not-allowed"> \
                                 <h1 style="position: fixed; left: '+offset.left+'; top:'+offset.top+';  \
                                     color: #333; \
                                     font-family: inherit; \
                                     font-weight: 700; \
                                     color: inherit; \
                                     text-rendering: optimizelegibility; \
                                     line-height: 40px; \
                                     font-size: 10em; \
                                     margin: 0px auto; \
                                     padding: 75px 0px 0px 0px; \
                                     text-align:center; \
                                     width: 100%;">Preview</h1></div>');

        $('div[id="mtb_preview_overlay"]').bind('click', function()
        {
            this.style.pointerEvents = "none";
            this.style.backgroundColor = "rgba(0, 0, 0, 0.0)";
            this.style.color = "#F00";
        });
    }
    else if(window.location != window.top.location === true && window.location.href.indexOf("ASSIGNMENT_ID_NOT_AVAILABLE") > -1)
    {//external HIT
        $('div[id="preview_overlay"]').remove();
        $('body').append('<div id="mtb_preview_overlay" \
                               title="This HIT has not been accepted. Click once to interact with content." \
                               style="position: fixed; left: 0px; top: 0px; \
                                      width: 100%; height: 100%; \
                                      opacity: 0.6; background-color: #000; z-index: 99; \
                                      color: #333; \
                                      font-family: &quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif; \
                                      font-size: 14px; \
                                      line-height: 20px; \
                                      cursor: not-allowed"> \
                              <h1 style="color: #333; \
                                        font-family: inherit; \
                                        font-weight: 700; \
                                        color: inherit; \
                                        text-rendering: optimizelegibility; \
                                        line-height: 40px; \
                                        font-size: 10em; \
                                        margin: 0px auto; \
                                        padding: 75px 0px 0px 0px; \
                                        text-align:center; \
                                        width: 100%;">Preview</h1></div>');

        $('div[id="mtb_preview_overlay"]').bind('click', function()
        {
            this.style.pointerEvents = "none";
            this.style.backgroundColor = "rgba(0, 0, 0, 0.0)";
            this.style.color = "#F00";
        });
    }
});