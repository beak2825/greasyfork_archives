// ==UserScript==
// @name        kaskus 2015 wide by estidi
// @namespace   kaskus 2015 wide
// @description kaskus 2015 wide
// @include     https://www.kaskus.co.id/thread/*
// @include     https://www.kaskus.co.id/forum/*
// @include     https://www.kaskus.co.id/post/*
// @include     https://www.kaskus.co.id/edit_post/*
// @include     https://www.kaskus.co.id/post_reply/*
// @include     https://www.kaskus.co.id/*
// @include     http://www.kaskus.co.id/thread/*
// @include     http://www.kaskus.co.id/forum/*
// @include     http://www.kaskus.co.id/post/*
// @include     http://www.kaskus.co.id/edit_post/*
// @include     http://www.kaskus.co.id/post_reply/*
// @include     http://www.kaskus.co.id/*
// @version     0.1.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7709/kaskus%202015%20wide%20by%20estidi.user.js
// @updateURL https://update.greasyfork.org/scripts/7709/kaskus%202015%20wide%20by%20estidi.meta.js
// ==/UserScript==
$('.momod-frame').appendTo('.header-list-cat');
$('.momod-frame').css('border-top','2px solid orange');
$('.momod-frame').css('padding-top','5px');

$('.sidebar').remove();
$('.banner-frame').remove();
$('.kaskus-ads').remove();
$('.cliponyu').remove();

$('table').css('color','#3E3E3E');

$('#leader-banner').html('<img src="http://help.kaskus.co.id/img/home-logo-n.png" alt="Kaskus">');
$('#leader-banner').css('line-height','90px');
$('#leader-banner').css('text-align','left');

//var hideButtonDiv = '<div id="hideButton"><a style="float:right; width:60px; margin-bottom:15px" class="btn btn-sm btn-red" id="btnHideButton" href="#">Show</a></div>';
//$('.sidebar-wrap').before(hideButtonDiv);
//$('.sidebar').css('width', '80px');
$('.main-content').css('width', '1170px');
$('body').css('background', 'linear-gradient(#112E5A,	#2669CC) fixed');


$('.title').css('font-size','1.2em');

//main
$('.head-title').css('background-color', '#F0F0F0');
$('.head-title').css('padding-right', '8px');
$('.hot-service-second-hand, .kaskus-hq-field-reports, .regional-community, .top-picture-video').css('background-color', '#F0F0F0');
$('.hot-service-second-hand, .kaskus-hq-field-reports, .regional-community, .top-picture-video').css('padding-bottom', '5px');
$('.list-top-thread').css('background-color', '#FFF');
$('.list-top-thread').css('margin', '0');
$('.list-top-thread li').css('padding-left', '8px');
$('.uniq-text').css('color', 'white');

//thread
$('.entry-body').css('width','1040px');
$('.entry-body').css('float','right');
$('.entry-body').css('border-left','1px solid #1998ed');
$('.post-title a').css('color','#3e3e3e');
$('.entry').css('color','#3E3E3E');

/*
$('.entry, .entry-title').css('margin-left','50px');
$('.entry, .entry-title').css('padding-left','10px');
$('.entry').css('padding-right','8px');
$('.entry, .entry-title').css('border-left','5px solid #1998ed');
$('.entry, .entry-title').css('border-right','1px solid #ccc');
$('.entry, .entry-title').css('background-color','#fefefe');
$('.entry-body').css('background', 'linear-gradient(#bcbcbc, #fefefe) fixed');*/

