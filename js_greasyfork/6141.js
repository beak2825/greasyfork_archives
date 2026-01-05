// ==UserScript==
// @name                MTurkGrind.com Plus
// @author              Chet Manley
// @version             0.2.1.1x
// @description         Style tweaks and keyboard shortcuts for MTurkGrind.com forum.
// @include             http://www.mturkgrind.com/*
// @include             http://mturkgrind.com/*
// @require		http://code.jquery.com/jquery-latest.min.js
// @grant       GM_log
// @namespace https://greasyfork.org/users/6438
// @downloadURL https://update.greasyfork.org/scripts/6141/MTurkGrindcom%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/6141/MTurkGrindcom%20Plus.meta.js
// ==/UserScript==

// v0.2x, 2015-01-17: updates by clickhappier for MTG migration from vbulletin to xenforo

// v0.1, 2013-10-19		Style tweaks and keyboard shortcuts on MTurkGrind.com
//                      ---------------------------------------------------------------------------

$(document).ready(function () {
    $('.messageText').attr('style', 'font-size: 15px;');
//    $('a.quickreply').hide().next().hide();

    $(window).keyup(function (e) {
        if (!$('input, textarea').is(':focus')) {
            var key = (e.keyCode ? e.keyCode : e.which);
            switch (key) {
                case 37: // Left arrow - Previous page
                    if ($('div.PageNav > nav > a:contains("Prev")').first().attr('href')) {
                        window.location.href = $('div.PageNav > nav > a:contains("Prev")').first().attr('href');
                    }
                    break;
                case 39: // Right arrow - Next page
                    if ($('div.PageNav > nav > a:contains("Next")').first().attr('href')) {
                        window.location.href = $('div.PageNav > nav > a:contains("Next")').first().attr('href');
                    }
                    break;
                case 73: // I - Inbox
                    window.location.href = 'http://www.mturkgrind.com/conversations/';
                    break;
                case 82: // R - Start a reply
                    $('html, body').animate({ scrollTop: $("form#QuickReply").offset().top }, 100);
                    break;
                case 83: // S - Settings
                    window.location.href = 'http://www.mturkgrind.com/account/';
                    break;
                default:
                    break;
            }
        }
    });
});