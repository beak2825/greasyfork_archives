// ==UserScript==
// @name    redditスタンプ入力支援
// @namespace    http://dnote.biz/
// @version    1.5
// @description    スタンプが使えるサブレのコメント入力部分上部の「stamp」クリックして選んでください
// @author    purinxxx
// @match    http://*.reddit.com/r/*
// @match    https://*.reddit.com/r/*
// @grant    none
// @require    http://cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.js
// @downloadURL https://update.greasyfork.org/scripts/8828/reddit%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%97%E5%85%A5%E5%8A%9B%E6%94%AF%E6%8F%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/8828/reddit%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%97%E5%85%A5%E5%8A%9B%E6%94%AF%E6%8F%B4.meta.js
// ==/UserScript==

var stamp = "http://dnote.biz/cors/?url=" + $('link[title="applied_subreddit_stylesheet"]').attr('href');
$.ajax({
    type: 'GET',
    url: stamp,
    dataType: 'html',
    success: function(data) {
        if(data!=''){
            $('body').after('<div id="stamp" style="display: none;"></div>')
            $('#stamp').append(data);
            $('body .md textarea').before('<a class="box" href="#stamp">stamp</a>');
            $('head link:last').after('<link rel="stylesheet" href="http://dnote.biz/sample/jquery.fancybox.min.css">')
            $('.box').fancybox({
                fitToView   : false,
                width       : '80%',
                height      : '80%',
                autoSize    : false,
                closeClick  : false,
                openEffect  : 'none',
                closeEffect : 'none'
            });
            $('.box').click(function () {
                var oya = $(this).parents('form');
                target = "#" + $(oya[0]).attr("id") + " .usertext-edit .md textarea";
            });
            $('#stamp a').click(function () {
                var which = $(this).attr('href');
                var text = $(target).val() + '[](' + which + ')';
                $(target).val(text);
                javascript:jQuery.fancybox.close();
            });
        }
    }
});
