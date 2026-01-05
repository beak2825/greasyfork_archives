// ==UserScript==
// @name         Always-visible Tumblr Tools
// @namespace    http://blackjackkent.tumblr.com
// @version      0.2
// @description  Forces newly-dropdownable user tools back into the right sidebar
// @author       BlackjackKent (blackjackkent.tumblr.com)
// @match        https://www.tumblr.com/*
// @match        http://www.tumblr.com/*
// @grant        none
// @locale       English (en)
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/9097/Always-visible%20Tumblr%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/9097/Always-visible%20Tumblr%20Tools.meta.js
// ==/UserScript==

$(document).ready(function() {
    var checkExist = setInterval(function() {
        $('.tab_nav_account').click();
        if ($('.popover--account-popover').length) {
            console.log("Exists!");
            clearInterval(checkExist);
            var pop = $('.popover--account-popover');
            var html = pop.html();
            $('#right_column').prepend(html);
            pop.remove();
            $('.tab_nav_account').click();
            $('#right_column .popover').css('position','relative');
        }
    }, 500); // check every 100ms
});