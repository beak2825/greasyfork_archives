// ==UserScript==
// @name        kittyLink
// @namespace   http://userscripts.org/users/kumomine
// @include  http://www.javzoo.com/*
// @include http://www.javpee.com/*
// @include     http://javhot.org/*
// @include     http://maddawgjav.net/*
// @include     http://youiv.com/*
// @include     http://youiv.net/*
// @version     0.2
// @grant          GM_setClipboard
// @grant          GM_getClipboard
// @grant          GM_openInTab
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @require	http://code.jquery.com/jquery-2.1.1.min.js
// @description Hei Hei :)
// @downloadURL https://update.greasyfork.org/scripts/6340/kittyLink.user.js
// @updateURL https://update.greasyfork.org/scripts/6340/kittyLink.meta.js
// ==/UserScript==
var url = window.location.href;
if (url.indexOf('javzoo') > - 1 || url.indexOf('javpee') > - 1) {
  $('h3').each(function () {
    var tt = $(this).html();
    //alert(tt);
    ee = tt.indexOf(' ', 0);
    if (ee > 0) {
      var uu = tt.substring(0, ee);
      //alert(uu);
      $('<a target="_blank"  style="z-index:999" >[down]</a>').appendTo(this) [0].href = 'http://thepiratebay.se/search/' + uu + '/0/99/0';
      $('<a target="_blank"  style="z-index:999" >[KITTY]</a>').appendTo(this) [0].href = 'http://torrentkitty.org/search/' + uu + '/';
    }
  });
  $('div.item span').each(function (index) {
    var uu = $(this).html();
    // alert(uu);
    //if(index ==0){
    $('<a target="_blank"  style="z-index:999" >[KITTY]</a>').appendTo(this) [0].href = 'http://torrentkitty.org/search/' + uu + '/';
    $('<a target="_blank"  style="z-index:999" >[down]</a>').appendTo(this) [0].href = 'http://thepiratebay.se/search/' + uu + '/0/99/0';
    // }else{
    //$('<a target="_blank"  style="z-index:999" >[BTDIGG]</a>') .appendTo(this)[0].href="http://btdigg.org/search?info_hash=&q="+uu;
    // }
  });
} else if (url.indexOf('javhot') > - 1) {
  $('.posttitle').each(function () {
    // alert($(this).find("a"));
    var tt = $(this).find('a').html();
    var ss = tt.indexOf('[', 0);
    var ee;
    if (ss < 0) {
      ss = 0;
      ee = tt.indexOf(' ', ss);
      ss = - 1;
    } else {
      ee = tt.indexOf(']', ss);
    }
    var uu = tt.substring(ss + 1, ee - ss);
    //alert(uu);
    $('<a target="_blank"  style="z-index:999" >[BTDIGG]</a>').appendTo(this) [0].href = 'http://btdigg.org/search?info_hash=&q=' + uu;
  });
} else if (url.indexOf('maddawgjav') > - 1) {
  $('div.entry').each(function () {
    var uu = $(this).find('p').get(0).innerHTML;
  
    var yy = uu.split(' ') [0].indexOf('-')>0?uu.split(' ') [0]:uu.split(' ') [0]+" "+uu.split(' ') [1];
    
    $($(this).find('p').get(0)).append('<a target=\'_blank\' href=\'http://torrentkitty.org/search/' + yy.replace('[FHD]', '').replace('[HD]', '') + '/\'>Torrent</a>');
  });
} else if (url.indexOf('youiv') > - 1) {
  $('h3.ptn').each(function () {
    var tt = $(this).find('a').html();
    var ss = tt.indexOf('[', 0);
    var ee = tt.indexOf(']', 0);
    var uu;
    if (ss < ee) {
      uu = tt.substring(ss + 1, ee);
    } else {
      uu = tt.split(' ') [0];
    }
    $(this).parent().append('<a target=\'_blank\' href=\'http://torrentkitty.org/search/' + uu + '/\'>Torrent</a>');
  });
}else if (url.indexOf('avmask') > - 1) {
  $('.imgdiv').each(function () {
    var tt = $(this).next().find('span:first').html();
    
    $(this).parent().append('<a target=\'_blank\' href=\'http://torrentkitty.org/search/' + tt + '/\'>Torrent</a>');
  });
}
