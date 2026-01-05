// ==UserScript==
// @name            Random bible quote for SG
// @version         1.0
// @namespace       http://www.steamgifts.com
// @author          patetico
// @description     Gives you random bibles quotes for comments on Steamgifts
// @include         http://www.steamgifts.com*
// @run-at          document-end
// @require         http://code.jquery.com/jquery-2.1.3.min.js
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/8164/Random%20bible%20quote%20for%20SG.user.js
// @updateURL https://update.greasyfork.org/scripts/8164/Random%20bible%20quote%20for%20SG.meta.js
// ==/UserScript==

var submitBtn = $('.comment__description .comment__submit-button');
var quoteBtn = $('<div class="comment__submit-button">Bible quote</div>').insertAfter(submitBtn);

function getQuote(e) {
    quoteBtn.html('<i class="fa fa-spin fa-refresh"></i> Loading...');
    var txtarea = $(e.target).parent().siblings('textarea');
    GM_xmlhttpRequest({
        url: 'http://labs.bible.org/api/?passage=random',
        onload: function(r) {
            console.log(r);

            txtarea.val(r.responseText.replace('<b>', '**').replace('</b>', '**\n>'));
            quoteBtn.html('Bible quote');
        }
    });
}

quoteBtn.click(getQuote);