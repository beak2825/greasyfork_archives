// ==UserScript==
// @name           Stack Exchange: "View Vote totals" without 1000 rep
// @namespace      Rob W
// @description    Enables the total vote counts feature without requiring an account or 1k+ reputation.
// @match          *://*.stackoverflow.com/questions/*
// @match          *://superuser.com/questions/*
// @match          *://meta.superuser.com/questions/*
// @match          *://serverfault.com/questions/*
// @match          *://meta.serverfault.com/questions/*
// @match          *://askubuntu.com/questions/*
// @match          *://meta.askubuntu.com/questions/*
// @match          *://mathoverflow.net/questions/*
// @match          *://meta.mathoverflow.net/questions/*
// @match          *://*.stackexchange.com/questions/*
// @match          *://answers.onstartups.com/questions/*
// @match          *://meta.answers.onstartups.com/questions/*
// @match          *://stackapps.com/questions/*
// @match          *://*.stackoverflow.com/review/*
// @match          *://superuser.com/review/*
// @match          *://meta.superuser.com/review/*
// @match          *://serverfault.com/review/*
// @match          *://meta.serverfault.com/review/*
// @match          *://askubuntu.com/review/*
// @match          *://meta.askubuntu.com/review/*
// @match          *://mathoverflow.net/review/*
// @match          *://meta.mathoverflow.net/review/*
// @match          *://*.stackexchange.com/review/*
// @match          *://answers.onstartups.com/review/*
// @match          *://meta.answers.onstartups.com/review/*
// @match          *://stackapps.com/review/*
// @match          *://*.stackoverflow.com/search*
// @match          *://superuser.com/search*
// @match          *://meta.superuser.com/search*
// @match          *://serverfault.com/search*
// @match          *://meta.serverfault.com/search*
// @match          *://askubuntu.com/search*
// @match          *://meta.askubuntu.com/search*
// @match          *://mathoverflow.net/search*
// @match          *://meta.mathoverflow.net/search*
// @match          *://*.stackexchange.com/search*
// @match          *://answers.onstartups.com/search*
// @match          *://meta.answers.onstartups.com/search*
// @match          *://stackapps.com/search*
// @exclude        *://area51.stackexchange.com/*
// @author         Rob Wu <rob@robwu.nl>
// @version        1.5.11
// @website        https://stackapps.com/q/3082/9699
// @run-at         document-end
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/6192/Stack%20Exchange%3A%20%22View%20Vote%20totals%22%20without%201000%20rep.user.js
// @updateURL https://update.greasyfork.org/scripts/6192/Stack%20Exchange%3A%20%22View%20Vote%20totals%22%20without%201000%20rep.meta.js
// ==/UserScript==

// Chrome extension: https://chrome.google.com/webstore/detail/oibfliilcglieepgkdkahpfiiigdijdd
// Greasemonkey script: https://greasyfork.org/en/scripts/6192-stack-exchange-view-vote-totals-without-1000-rep

// @history        06-feb-2012 Release
// @history        07-feb-2012 Added CSS fix for IE7-. Added reference to optimized bookmarklet.
// @history        07-feb-2012 Modified click handler, so that it's also working after voting.
// @history        13-jun-2012 Upgraded to the SE 2.0 API (from 1.1)
// @history        10-nov-2012 Released Chrome extension
// @history        16-nov-2012 Added support for /review/ (previously limited to /questions/ only)
// @history        16-nov-2012 Added support for older jQuery versions (1.4.4 at Area 51)
// @history        16-nov-2012 Added support for /review/ (Suggested edits)
// @history        19-nov-2012 Corrected one-letter typo
// @history        12-dec-2012 Corrected $.fn.click override: .call replaced with .apply
// @history        23-may-2013 Added support for /questions/tagged/... and /search
// @history        05-sep-2013 Added Math Overflow to list of sites
// @history        21-feb-2014 Use https SE API on https SE sites.
// @history        18-jun-2014 Replace http with * to match https as well.
// @history        31-oct-2014 Use *.stackoverflow.com to match pt.stackoverflow.com and others.
// @history        25-sep-2016 Fix match pattern for meta.askubuntu.com.
// @history        23-dec-2018 Support updated StackExchange layout.
// @history        05-jul-2020 Disable script when user already has 1k+ rep in the updated layout.
// @history        05-jul-2020 Support Stack Overflow's dark theme.
// @history        06-jul-2024 Rely on data-post-id instead of an unnamed hidden input field.
// @history        06-jul-2024 Use lighter vote colors following 2023's "New colors launched".
// @history        06-jul-2024 Chrome extension update to Manifest Version 3.

/*
 * How does this script work?
 * - The Vote count feature is detected through the existence of the
 *          tooltip (title) on the Vote Count buttons.
 *  When the title is present, the script does not have any side-effects.
 *  When the title is absent, this script adds the feature:
 * 1) A style is appended to the head, which turns the cursor in a pointer on the 
 *      Vote Count elements.
 * 2) One global event listener is bound to the document.
 *    This click listener captures clicks on the Vote Count elements (now + future)
 * 3) On click, the vote counts are requested through the Stack Exchange API.
 *    The response is parsed, and the vote totals are shown.
 *    A tooltip is also added, in accordance with the normal behaviour.
 *    As a result, the Vote count button is not affected by the script any more.
 * 
 *  Usually, when a user casts a vote, the buttons are reset, and a click handler
 *  is added. This click handler is attached in a closure, and cannot be modified.
 * To prevent this method from being triggered, jQuery.fn.click() is modified.
 */

/* This script injection method is used to have one single script that works in all modern browsers.
 * Against sandboxed window-objects (Chrome)
 * The code itself has successfully been tested in:
 * Firefox 3.0 - 127.0
 * Opera 9.00 - 12.00
 * Chrome 1 - 126
 * IE 7 - 10 (for IE6, see http://web.archive.org/web/20131104100735/http://userscripts.org/scripts/show/125051)
 * Safari 3.2.3 - 5.1.7 */

/*This script can ALSO be used as a BOOKMARKLET. Just copy-paste anything below this line!*/

javascript:void(function(doc){
var head = (doc.head||doc.getElementsByTagName('head')[0]||doc.documentElement);
var style = doc.createElement('style');
var css = '/*Added through UserScript*/' + 
          '.js-vote-count{cursor:pointer;}' + 
          '.js-vote-count[title]{cursor:default;}' +
          '.vote-count-separator{height:0;*margin-left:0;}'; /* IE7- */
head.appendChild(style);

if (style.styleSheet) {
    /* This is for IE-users.*/
    style.styleSheet.cssText = css;
} else {
    style.appendChild(doc.createTextNode(css));
}


(function() {
    var api_url = location.protocol + '//api.stackexchange.com/2.0/posts/';
    var api_filter_and_site = '?filter=!)q3b*aB43Xc&key=DwnkTjZvdT0qLs*o8rNDWw((&site=' + location.host;
    var canViewVotes = 1; /* Intercepts click handler when the user doesn't have 1k rep.*/
    var b = StackExchange.helpers;
    var original_click = $.fn.click;
    $.fn.click = function() {
        if (this.hasClass('js-vote-count') && !canViewVotes) return this;
        return original_click.apply(this, arguments);
    };
    var voteCountClickHandler = function(e) {
        var $this = $(this), t=this.title, $tmp;
        if (!t) {
            // ...
            var tooltipElemId = $this.attr('aria-describedby');
            if (tooltipElemId) {
                t = $(document.getElementById(tooltipElemId)).text();
            }
        }
        if (/up \/ |upvotes/.test(t) || /View/.test(t) && canViewVotes) return;
        canViewVotes = 0; /* At this point, not a 1k+ user */
        var postId;
        if (!postId) {
            // Questions and answers at /questions/.
            // At /review/, for instance:
            // Also at /questions/ as of 2020.
            $tmp = $this.closest('[data-post-id]');
            postId = $tmp.attr('data-post-id');
        }
        if (!postId) {
            // At /review/ of Suggested edits
            $tmp =  $this.closest('.suggested-edit');
            postId = $.trim($tmp.find('.post-id').text());
        }
        if (!postId) {
            // At /questions/tagged/....
            // At /search
            $tmp = $this.closest('.question-summary');
            postId = /\d+/.exec($tmp.attr('id'));
            postId = postId && postId[0];
        }
        if (!postId) {
            console.error('Post ID not found! Please report this at http://stackapps.com/q/3082/9699');
            return;
        }
        b.addSpinner($this);
        $.ajax({
            type: 'GET',
            url: api_url + postId + api_filter_and_site + '&callback=?', /* JSONP for cross-site requests */
            dataType: 'json',
            success: function(json) {
                json = json.items[0];
                var up = json.up_vote_count, down = json.down_vote_count;

                // up/down are numbers from the Stack Exchange API. To avoid
                // any XSS risk should the domain somehow ever change ownership,
                // coerce the type to be a number.
                up *= 1;
                down *= 1;

                up = up ? '+' + up : 0;       /* If up > 0, prefix a plus sign*/
                down = down ? '-' + down : 0; /* If down > 0, prefix a minus sign */
                $this.parent().find('.message-error').fadeOut('fast', function() {
                    $(this).remove();
                });
                $this.css('cursor','default').attr('title', up + ' up / ' + down + ' down')
                     .html('<div class="fc-green-500">' + up + '</div>' +
                           '<div class="vote-count-separator"></div>'  +
                           '<div class="fc-red-500">' + down + '</div>');
            },
            error: function(N) {
                b.removeSpinner();
                b.showErrorPopup($this.parent(), N.responseText && N.responseText.length < 100 ?
                        N.responseText : 'An error occurred during vote count fetch');
            }
        });
        e.stopImmediatePropagation();
    };
    $(document).on('click', '.js-vote-count', voteCountClickHandler);
})();
})(document);
