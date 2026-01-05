// ==UserScript==
// @name         RSortBtn
// @namespace    r-sort-btn
// @version      0.1.3
// @description  Redditに独自のソート機能を追加する
// @include      *old.reddit.com*

// @exclude      /comments/
// @exclude      /Dashboard
// @exclude      com/toolbar/
// @exclude      com/tb/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8690/RSortBtn.user.js
// @updateURL https://update.greasyfork.org/scripts/8690/RSortBtn.meta.js
// ==/UserScript==


// 強制終了URL
//var url = location.href;
//if (url.match(/\/user\//) || url.match(/\/comments/) || url.match(/\/r\/Dashboard/) || url.match(/com\/toolbar\//) || url.match(/com\/tb\//)) {
//    exit();
//}

var btnSelectedBgColor = 'red';

$(function () {
    $('#siteTable').parent().prepend('<div id="rsbtnArea"></div>');
    $('#rsbtnArea').append('<button class="rsbtn" id="rsDefaultBtn">デフォルト</button>');
    $('#rsbtnArea').append('<button class="rsbtn rsbtnTypeSort" id="rsIkioiBtn">勢い順</button>');
    $('#rsbtnArea').append('<button class="rsbtn rsbtnTypeSort" id="rsCommentBtn">コメント数順</button>');
    $('#rsbtnArea').append('<button class="rsbtn rsbtnTypeSort" id="rsScoreBtn">スコア順</button>');
    $('#rsbtnArea').append('<button class="rsbtn rsbtnTypeSort" id="rsNewBtn">新着順</button>');
    $('#rsbtnArea').append('<button class="rsbtn rsbtnTypeTime" id="rs1hBtn">～1時間</button>');
    $('#rsbtnArea').append('<button class="rsbtn rsbtnTypeTime" id="rs3hBtn">～3時間</button>');
    $('#rsbtnArea').append('<button class="rsbtn rsbtnTypeTime" id="rs12hBtn">～12時間</button>');
    $('#rsbtnArea').append('<button class="rsbtn rsbtnTypeTime" id="rs24hBtn">～24時間</button>');
    $('#rsbtnArea').append('<button class="rsbtn rsbtnTypeTime" id="rs72hBtn">～72時間</button>');
    $('#rsbtnArea').append('<button class="rsbtn rsbtnTypeTime" id="rs1wBtn">～1週間</button>');
    
var ccc = 0;
    // 各サブミにソート情報付与
    $(".linklisting > .thing").each(function(i) {
        // 投稿時間
        var post_time = new Date($(this).find('time').attr('title'));
        // コメント数
        var comment_str = $(this).find('.comments').text();
        var comment_num = parseInt(comment_str);
        if (isNaN(comment_num)) {
            comment_num = 0;
        }
        
        ccc += comment_num;
        
        // 現在時間
        var now_time = new Date();
        // 経過時間
        var keika_fun = (now_time - post_time) / (1000 * 60);
        // 勢い計算
        var ikioi = (comment_num / keika_fun) * 60 * 24;
        ikioi *= 10;
        ikioi = Math.floor(ikioi);
        ikioi /= 10;
        // デフォルト
        var rank = $(this).find('.rank').text();
        var rank_num = parseInt(rank);
        if (isNaN(rank_num)) {
            rank_num = 0;
        }
        // スコア
        var unvoted = $(this).find('.score.unvoted').text();
        var unvoted_num = parseInt(unvoted);
        if (isNaN(unvoted_num)) {
            unvoted_num = 0;
        }

        // 属性挿入
        $(this).attr('ikioi', ikioi * 10);
        $(this).find('.entry').prepend('<span style="color:red; font-size: 1.2em; float: right; margin-left: 10px;">' + ikioi + '</span>');
        $(this).attr('comment_num', comment_num);
        $(this).attr('rank_num', rank_num);
        $(this).attr('unvoted_num', unvoted_num);
        $(this).attr('keika_fun', keika_fun);
        if (keika_fun <= 60) {
            $(this).attr('rs1hBtn', 'yes');
        }
        if (keika_fun <= 180) {
            $(this).attr('rs3hBtn', 'yes');
        }
        if (keika_fun <= 720) {
            $(this).attr('rs12hBtn', 'yes');
        }
        if (keika_fun <= 1440) {
            $(this).attr('rs24hBtn', 'yes');
        }
        if (keika_fun <= 4320) {
            $(this).attr('rs72hBtn', 'yes');
        }
        if (keika_fun <= 10080) {
            $(this).attr('rs1wBtn', 'yes');
        }
    });
});






$.fn.eachsort = function(cb) {
    return this.each(function(){
        return $(this).html(
            $(this).children('.thing').sort(cb)
        );
    });
}
$(function() {
    $('#rsDefaultBtn').click(function() {
        $('.rsbtn').css('background-color', '');
        $(".linklisting > .thing").show();
        $("#siteTable").eachsort(function(a, b) {
            return parseInt($(a).attr('rank_num'), 10) - parseInt($(b).attr('rank_num'), 10);
        });
    });
    $('#rsIkioiBtn').click(function() {
        $('.rsbtnTypeSort').css('background-color', '');
        $(this).css('background-color', btnSelectedBgColor);
        $("#siteTable").eachsort(function(a, b) {
            return parseInt($(b).attr('ikioi'), 10) - parseInt($(a).attr('ikioi'), 10);
        });
    });
    $('#rsCommentBtn').click(function() {
        $('.rsbtnTypeSort').css('background-color', '');
        $(this).css('background-color', btnSelectedBgColor);
        $("#siteTable").eachsort(function(a, b) {
            return parseInt($(b).attr('comment_num'), 10) - parseInt($(a).attr('comment_num'), 10);
        });
    });
    $('#rsScoreBtn').click(function() {
        $('.rsbtnTypeSort').css('background-color', '');
        $(this).css('background-color', btnSelectedBgColor);
        $("#siteTable").eachsort(function(a, b) {
            return parseInt($(b).attr('unvoted_num'), 10) - parseInt($(a).attr('unvoted_num'), 10);
        });
    });
    $('#rsNewBtn').click(function() {
        $('.rsbtnTypeSort').css('background-color', '');
        $(this).css('background-color', btnSelectedBgColor);
        $("#siteTable").eachsort(function(a, b) {
            return parseInt($(a).attr('keika_fun'), 10) - parseInt($(b).attr('keika_fun'), 10);
        });
    });
    $('#rs1hBtn').click(function() {
        $('.rsbtnTypeTime').css('background-color', '');
        $(this).css('background-color', btnSelectedBgColor);
        $(".linklisting > .thing").show();
        $(".linklisting > .thing:not([rs1hBtn]").hide();
    });
    $('#rs3hBtn').click(function() {
        $('.rsbtnTypeTime').css('background-color', '');
        $(this).css('background-color', btnSelectedBgColor);
        $(".linklisting > .thing").show();
        $(".linklisting > .thing:not([rs3hBtn]").hide();
    });
    $('#rs12hBtn').click(function() {
        $('.rsbtnTypeTime').css('background-color', '');
        $(this).css('background-color', btnSelectedBgColor);
        $(".linklisting > .thing").show();
        $(".linklisting > .thing:not([rs12hBtn]").hide();
    });
    $('#rs24hBtn').click(function() {
        $('.rsbtnTypeTime').css('background-color', '');
        $(this).css('background-color', btnSelectedBgColor);
        $(".linklisting > .thing").show();
        $(".linklisting > .thing:not([rs24hBtn]").hide();
    });
    $('#rs72hBtn').click(function() {
        $('.rsbtnTypeTime').css('background-color', '');
        $(this).css('background-color', btnSelectedBgColor);
        $(".linklisting > .thing").show();
        $(".linklisting > .thing:not([rs72hBtn]").hide();
    });
    $('#rs1wBtn').click(function() {
        $('.rsbtnTypeTime').css('background-color', '');
        $(this).css('background-color', btnSelectedBgColor);
        $(".linklisting > .thing").show();
        $(".linklisting > .thing:not([rs1wBtn]").hide();
    });
});

