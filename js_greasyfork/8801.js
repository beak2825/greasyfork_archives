// ==UserScript==
// @name        MyAnimeList (MAL) History Cleaner
// @namespace   https://greasyfork.org/users/7517
// @description Helps delete episode and chapter history on myanimelist.net
// @icon        http://i.imgur.com/b7Fw8oH.png
// @version     1.5.1
// @author      akarin
// @include     /^https?:\/\/myanimelist\.net\/ajaxtb\.php/
// @include     /^https?:\/\/myanimelist\.net\/history/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8801/MyAnimeList%20%28MAL%29%20History%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/8801/MyAnimeList%20%28MAL%29%20History%20Cleaner.meta.js
// ==/UserScript==

/*jslint fudge, maxerr: 10, browser, devel, this, white, for, single */
/*global jQuery */

(function($) {
    'use strict';

var AJAX_DELAY = 50;

function clearEntry(context, withStatus) {
    if (withStatus) {
        $('#history_cleaner', context).html('&nbsp;Status: Deleting...');
    }
    var calc = 0;
    var links = $('a', context);
    links.each(function(index) {
        var entry = $(this).attr('onclick');
        if (entry.length === 0) {
            return;
        }
        var row = $(this).closest('div');
        setTimeout(function() {
            $.ajax({
                type: 'POST',
                url: '/includes/ajax.inc.php?t=' + (/removeEp/.exec(entry) ? 58 : 60),
                data: 'id=' + (/\d+/.exec(entry)),
                dataType: 'text'
            }).done(function () {
                if (withStatus) {
                    row.remove();
                    calc += 1;
                    $('#history_cleaner', context).html('&nbsp;Status: ' + calc + '/' + links.length + ' deleted');
                }
            });
        }, AJAX_DELAY * index);
    });
}

function clearHistory() {
    $('#history_cleaner').html('&nbsp;Status: Deleting...');
    var cache = {};
    var calc = 0;
    var links = $('a.lightbox');
    links.each(function(index) {
        var url = $(this).prop('href');
        if (url.length === 0) {
            return;
        }
        if (!cache.hasOwnProperty(url)) {
            cache[url] = true;
            setTimeout(function() {
                $.get(url, function(data) {
                    clearEntry(data, false);
                    calc += 1;
                    $('#history_cleaner').html('&nbsp;Status: ' + calc + '/' + links.length + ' deleted');
                });
            }, AJAX_DELAY * index);
        }
        else {
            calc += 1;
            $('#history_cleaner').html('&nbsp;Status: ' + calc + '/' + links.length + ' deleted');
        }
    });
}

if ($('#malLogin').length === 0) {
    if (document.URL.match(/\/history\//)) {
        if ($('a.lightbox').length === 0) {
            return;
        }
        $('<li id="history_cleaner" style="float: right">')
            .append($('<a href="javascript:void(0)">Clear History</a>').click(function() {
                if (confirm('Are you sure you want to clear the history?')) {
                    clearHistory();
                }
            })).prependTo('#horiznav_nav ul');
    }
    else {
        if ($('form a').length === 0) {
            return;
        }
        $('<span id="history_cleaner" class="floatRightHeader">')
            .append($('<a href="javascript:void(0)">Clear History</a>').click(function() {
                if (confirm('Are you sure you want to clear the episode/chapter history?')) {
                    clearEntry($('form'), true);
                }
            })).prependTo('.normal_header');
    }
}

}(jQuery));