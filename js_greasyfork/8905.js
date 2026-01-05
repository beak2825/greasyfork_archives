// ==UserScript==
// @name           1024 videowood.tv/embed
// @author         SevenStar
// @namespace      SevenStar
// @description    videowood视频地址提取.
// @version        1.00.01
// @create         2014-02-07
// @lastmodified   2014-02-07
// @include        http://videowood.tv/embed/*
// @copyright      2014+, SevenStar
// @grant          unsafeWindow
// @run-at         document-end
// @require       http://libs.useso.com/js/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/8905/1024%20videowoodtvembed.user.js
// @updateURL https://update.greasyfork.org/scripts/8905/1024%20videowoodtvembed.meta.js
// ==/UserScript==
(function() {
    // http://10240.tk/*
    var Lc = location,
        lurl = location.href;
    var dhost = location.hostname.replace(/\w+\./, '');
    var win = (typeof unsafeWindow == 'undefined') ? window : unsafeWindow;
    title = $('.videotitle span').eq(0).text();
    time = $('.videotitle span').eq(1).text();
    $('.videotitle').remove();
    $("#player").remove();
    $('html').html('');
    $('html').html('<style>*{margin:0;padding:0;overflow:hidden;font-family:"\5FAE\8F6F\96C5\9ED1",helvetica,arial,sans-serif}a{color:#fff}.videotitle{position:absolute;top:0;left:0;width:100%;color:white;background:rgb(0,0,0);background:rgba(0,0,0,0.7);font-size:10px;padding-left:3px;padding-right:3px;z-index:999}</style><div class="videotitle" style="height: 25px; font-size: 14px; padding-left: 0; padding-right: 0; top:0; position:absolute; display:block; z-index:9999; width:100%"><span style="vertical-align: middle"><a href="'+config['file']+'" target="_blank"> '+title+'</a></span><span style="vertical-align: middle; line-height: 25px;float:right" class="pull-right">'+time+' </span></div><div style="position: absolute; display: block;top: 0;left: 0;height: 100%;width: 100%; margin: 0; padding: 0;background:#000"><video controls="controls" preload="preload" name="media" width="100%" height="100%"><source src="'+config['file']+'" type="video/mp4"></video></div>');
    console.log('标题：'+title+'，时长'+time);
})();