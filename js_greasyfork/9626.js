// ==UserScript==
// @name 		gif + video link gamevn
// @namespace 	https://greasyfork.org/en/scripts/9626
// @description This script display gif at url in gamevn and some xenforo 4r else.
// @run-at      document-end
// @version	    1.5.5
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @include 	https://*.gamevn.com/*
// @include 	http://*.gamevn.com/*
// @downloadURL https://update.greasyfork.org/scripts/9626/gif%20%2B%20video%20link%20gamevn.user.js
// @updateURL https://update.greasyfork.org/scripts/9626/gif%20%2B%20video%20link%20gamevn.meta.js
// ==/UserScript==
$(document).ready(function(){
    $("[id^='post-'] a").each(function() {
        var img, href;
        href = $(this).attr("href");
        var xxx = 1;    
        if (/\.(jpg|jpeg|png|gif|bmp)$/.test(href) && !(/<img/.test($(this).html())))
        {
            $(this).mouseover(function() {            
                img = $("<div><img src='" + href + "' title='Vui lòng nhấn vào đây để tới link ảnh gốc'/></div>");
                if(xxx)
                    $(this).after(img);
                xxx = 0;
            });
        }
        if (/\.(mp4|webm|ogg)$/.test(href)) {
            $(this).mouseover(function() { 
                var video = $('<div class="video_container"><video controls autoplay="autoplay" preload="metadata">Your browser does not support the <code>video</code> element.</video></div>');
                if(xxx){
                    video.children().attr("src", href);
                    $(this).after(video);            
                    xxx = 0;
                }
            });
        }
        if (/imgur.com/.test(href) && !(/<img/.test($(this).html()))) {
            $(this).mouseover(function(){
                if(xxx){
                    img = href.split('/'); 
                    href = img[img.length-1].split('.gifv')[0];
                    img = $('<div><video poster="http://i.imgur.com/'+href +'.jpg" preload="auto" autoplay="autoplay" muted="muted" loop="loop" webkit-playsinline=""><source src="http://i.imgur.com/'+href+'.webm" type="video/webm"></video></div>');
                    $(this).after(img);
                    xxx=0
                }
            });
        }
        if (/9gag.com/.test(href) && !(/<img/.test($(this).html()))) {
            $(this).mouseover(function(){
                if(xxx){
                    img = href.split('/'); 
                    href = img[img.length-1].split('?')[0];
                    img = $('<div><video poster="http://img-9gag-fun.9cache.com/photo/'+href +'_460s.jpg" preload="auto" autoplay="autoplay" muted="muted" loop="loop" webkit-playsinline=""><source src="http://img-9gag-fun.9cache.com/photo/'+href+'_460svwm.webm" type="video/webm"></video></div>');
                    $(this).after(img);
                    xxx=0
                }
            });
        }
    });
});