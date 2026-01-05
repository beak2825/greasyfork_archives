// ==UserScript==
// @name        MyAnimeList (MAL) All Entries Add
// @namespace   https://greasyfork.org/users/7517
// @description Add all MAL entries to your lists.
// @icon        http://i.imgur.com/b7Fw8oH.png
// @version     1.2.3
// @author      akarin
// @include     /^https?:\/\/myanimelist\.net\/(?!(anime|manga)list)/
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/6916/MyAnimeList%20%28MAL%29%20All%20Entries%20Add.user.js
// @updateURL https://update.greasyfork.org/scripts/6916/MyAnimeList%20%28MAL%29%20All%20Entries%20Add.meta.js
// ==/UserScript==

/*jslint fudge, maxerr: 10, browser, devel, this, white, for, single */
/*global jQuery */

(function($) {
    'use strict';

var mal = {
    username: '',
    total: { anime: 0, manga: 0 }
};

mal.process = function(type, offset) {
    if (offset === 0) {
        if (confirm('Add all missing ' + type + ' entries?')) {
            mal.total[type] = 0;
            $('div#all_entries_' + type).html('Total: 0');
        } else {
            return;
        }
    }

    if (mal.total[type] % 50 !== 0) {
        return;
    }

    $.get('/' + type + '.php?o=9&show=' + offset, function(data) {
        var el = $('#content > .normal_header:contains(Search Results)', data);
        if (el.length === 0 || el.next().text().match('No titles that matched your query were found.')) {
            return;
        }

        $('#content > div.list a.Lightbox_AddEdit', data).each(function() {
            mal.total[type] += 1;
            var id = $(this).prop('href').match(/\d+/)[0];

            if ($(this).hasClass('button_add')) {
                $.ajax({
                    type: 'POST',
                    url: '/ownlist/' + type + '/add.json',
                    dataType: 'json',
                    async: false,
                    data: JSON.stringify(type === 'anime' ? {
                        'anime_id': parseInt(id),
                        'status': 6
                    } : {
                        'manga_id': parseInt(id),
                        'status': 6
                    })
                });
                console.log('New: ' + id + '; ' + $(this).prev().text());
            }
        });

        $('div#all_entries_' + type).html('Total: ' + mal.total[type]);
        setTimeout(function() {
            mal.process(type, offset + 50);
        }, 3000);
    });
};

if ($('#malLogin').length === 0) {
    $.ajaxSetup({ timeout: 40000 });
    mal.username = $('.page-common .header-profile-link').text().trim();

    $('<div class="header-menu-unit" id="all_entries_manga" />')
        .append($('<a href="javascript:void(0);">Manga</a>').click(function() {
            mal.process('manga', 0);
        }))
        .prependTo('#header-menu');

    $('<div class="header-menu-unit" id="all_entries_anime" />')
        .append($('<a href="javascript:void(0);">Anime</a>').click(function() {
            mal.process('anime', 0);
        }))
        .prependTo('#header-menu');
}

}(jQuery));