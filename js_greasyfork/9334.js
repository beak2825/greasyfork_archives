// ==UserScript==
// @name         gif appear gamevn
// @namespace     https://greasyfork.org/en/scripts/8685-rainbow-gamevn
// @description This script display gif at url in gamevn and some xenforo 4r else.
// @run-at      document-end
// @version        1.2
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @include     /^https?:\/\/.*.gamevn.com/threads/hinh-thu-gian-version-62-2015-gamevn-chao-nam-moi-de-nghi-khong-an-box-50-nua.1169467/*
// @include 	/^https?:\/\/.*.gamevn.com/threads/hinh-thu-gian-version-63-patch-odisey.1193279/*
// @downloadURL https://update.greasyfork.org/scripts/9334/gif%20appear%20gamevn.user.js
// @updateURL https://update.greasyfork.org/scripts/9334/gif%20appear%20gamevn.meta.js
// ==/UserScript==

$("[id^='post-'] a").each(function() {
    var img, href;
    href = $(this).attr("href");
    var x = 1;
    
    if (/imgur.com/.test(href) && !(/<img/.test($(this).firstChild))) {
        if (/.gifv/.test(href)) {
            $(this).mouseover(function(){
                img = href.split('/'); 
                href = img[img.length-1];
                img = href.split('.'); 
                href = img[0];
                img = $('<br><img src="//i.imgur.com/'+href+'.gif">');
                if(x) $(this).after(img);
                x = 0;
            });
        }
        else{
            $(this).mouseover(function(){
                img = href.split('/'); 
                href = img[img.length-1];
                img = $('<div><video preload="auto" autoplay="autoplay" muted="muted" loop="loop" webkit-playsinline=""><source src="http://i.imgur.com/'+href+'.webm" type="video/webm"></video></div>');
                if(x) $(this).after(img);
                x = 0;
            });
        }
    }
});