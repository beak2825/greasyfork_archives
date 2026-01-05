// ==UserScript==
// @name           fantasti.cc load images from thumbnails
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
// @author         jesuis-parapluie
// @description    Show images instead of thumbnails (+ endless scrolling with AutoPager)
//
// @include        /^https?://(.+\.)?fantasti\.cc/(.+/)?images/.*$/
// @exclude        /^https?://(.+\.)?fantasti\.cc/(.+/)?images/image/.*$/
// @exclude        http://fantasti.cc/category/tagcloud/images/*
//
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
//
// @version        0.12
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/9324/fantasticc%20load%20images%20from%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/9324/fantasticc%20load%20images%20from%20thumbnails.meta.js
// ==/UserScript==

(function ($) {
    "use strict";
    /*jslint browser:true */
    /*global $, jQuery */
    var loadImgs = function () {
        var query = $('div#loop'),
            q = $("div[id*='post_']");
        if (!query.size()) {
            query = $('div#archive');
            q = $('.xxx').parent();
        }
        query.each(function () {
            if (!$(this).hasClass('done')) {
                var imgs, p;
                $(this).addClass('done');
                imgs = $('<div>', {
                    'class': 'images'
                });
                p = $(this).find('.pages').last();
                if (p.size()) {
                    $(this).before(p.parent(), imgs);
                } else {
                    imgs.appendTo($(this));
                }
                $(this).find(q).each(function () {
                    if (!$(this).hasClass('imgdone')) {
                        $(this).addClass('imgdone');
                        var href = $(this).find('a').attr('href');
                        $.get(href, function (data) {
                            var link = $('<a>', {
                                'href': href
                            });
                            link.append($(data).find('div[id*=\'albums\']').find('img'));
                            imgs.append(link);
                        });
                    }
                });
            }
        });
    };
    $(function () {
        var link = $('<a>', {
            'id': 'loadImgs',
            'class': 'subm_link',
            'style': 'color:#FF4700;cursor:pointer;font-weight:bold;',
            'text': 'Show images'
        }).click(function () {
            var query;
            if ($('a#loadImgs').hasClass('imagesVisible')) {
                $('a#loadImgs').removeClass('imagesVisible');
                $('a#loadImgs').html('Show images');
                $('div.images').hide();
                query = $("div[id*='post_']");
                if (!$(query).size()) {
                    query = $('.xxx').parent();
                }
                query.show();
                $('div#extra_webcams').show();
            } else {
                $('a#loadImgs').addClass('imagesVisible');
                $('a#loadImgs').html('Show thumbnails');
                $('div.images').show();
                query = $("div[id*='post_']");
                if (!$(query).size()) {
                    query = $('.xxx').parent();
                }
                query.hide();
                $('div#extra_webcams').hide();
                loadImgs();
            }
        });
        $('.sm-navlist').append($('<li>').append(link));
        $('head').append('<style>.images img { width: 100%!important; height: 100%!important; margin-left: 20px; };</style>');

        $(document).bind('DOMNodeInserted', function (e) {
            if ($('a#loadImgs').hasClass('imagesVisible') && e.target.tagName === 'DIV' && e.target.getAttribute('id') && (e.target.getAttribute('id') === 'loop' || e.target.getAttribute('id') === 'archive')) {
                $('div.images').show();
                $('div[id*="post_"]').hide();
                var query = $("div[id*='post_']");
                if (!query.size()) {
                    query = $('.xxx').parent();
                }
                query.hide();
                loadImgs();
            }
        });
    });
}(jQuery));
