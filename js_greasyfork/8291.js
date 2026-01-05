// ==UserScript==
// @name        KASKUS Smooth Style'15 
// @namespace   KASKUS Smooth Style'15 
// @description Bikin tampilan kaskus barumu jadi nyaman dan fresh
// @include     http://www.kaskus.co.id/thread/*
// @include     http://www.kaskus.co.id/forum/*
// @include     http://www.kaskus.co.id/post/*
// @include     http://www.kaskus.co.id/edit_post/*
// @include     http://www.kaskus.co.id/post_reply/*
// @include     http://www.kaskus.co.id/*
// @include     http://fjb.kaskus.co.id/category/*
// @include     http://fjb.kaskus.co.id/classified/*
// @include     http://fjb.kaskus.co.id/product/*
// @exclude     http://www.kaskus.co.id/show_post/*
// @version     1.3.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8291/KASKUS%20Smooth%20Style%2715.user.js
// @updateURL https://update.greasyfork.org/scripts/8291/KASKUS%20Smooth%20Style%2715.meta.js
// ==/UserScript==

//main
$('.main-content').css('width', '1170px');
$('#leader-banner').html('<img src="http://help.kaskus.co.id/img/home-logo-n.png">');
$('#leader-banner').css('line-height','80px');
$('#leader-banner').css('text-align','left');
$('.event-calendar').css('height', '400px');

//thread
$('.user-control-stick').css('width','1170px');
$('.entry-body').css('width','1040px');
$('.entry-body').css('float','right');
$('.col-sm-3').remove();
$('.related-thread').remove();