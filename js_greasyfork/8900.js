// ==UserScript==
// @name        twitter_dout
// @namespace   elzup.com
// @include     https://twitter.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @version     1.3
// @grant       none
// @description Twitter にダウトボタンを追加するスクリプト
// @downloadURL https://update.greasyfork.org/scripts/8900/twitter_dout.user.js
// @updateURL https://update.greasyfork.org/scripts/8900/twitter_dout.meta.js
// ==/UserScript==
$(function() {
    $('.stream-items').hover(function() {
            $(this).find('.tweet').each(function() {
            if ($(this).find('.ProfileTweet-action--dout').length != 0) {
                return;
            }
            var tweet_id = $(this).find('li.js-stream-item').attr('data-item-id');
            if (tweet_id == undefined) {
                tweet_id = $(this).find('.js-stream-tweet').attr('data-item-id');
            }
            var $btn_div = $('<div/>').addClass('ProfileTweet-action ProfileTweet-action--dout').append(
                $('<a/>').attr('href', 'https://twitter.com/intent/tweet?text=%E3%83%80%E3%82%A6%E3%83%88%EF%BC%81%20%20%23%e3%83%80%e3%82%a6%e3%83%88%e3%83%9c%e3%82%bf%e3%83%b3&in_reply_to=' + tweet_id).attr('target', '_blank').append(
                    $('<span/>').addClass('Icon Icon--reply')
                )
            );
            $(this).find('.ProfileTweet-action.ProfileTweet-action--more').after($btn_div);
        });
    });
});

