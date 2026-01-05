// ==UserScript==
// @name        AcFun Fix
// @namespace   http://www.talkshowcn.com/js/acfunfix.html
// @description AcFun Fix, 包含修复 AcFun 问题的一些功能
// @include     http://www.acfun.tv/v/*
// @include     http://acfun.tv/v/*
// @include     http://hengyang.acfun.tv/v/*
// @include     http://wenzhou.acfun.tv/v/*
// @version     1.0.0.1
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/8722/AcFun%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/8722/AcFun%20Fix.meta.js
// ==/UserScript==
var a = function () {
  var b = $('a.active.primary').attr('data-from');
  window._getPlayer = function () {
    return document.getElementById('ACFlashPlayer-re') ? document.getElementById('ACFlashPlayer-re')  : (document.getElementById('not-ACFlashPlayer-re') ? document.getElementById('not-ACFlashPlayer-re')  : document.getElementById('area-player'));
  };
  window.c = function (d, e) {
    player = _getPlayer();
    if (player.id == 'area-player') {
      $(player).html('<div class="inner ui-draggable"><iframe id="ACFlashPlayer-re" ></iframe></div>');
      player = document.getElementById('ACFlashPlayer-re');
    }
    player.outerHTML = '<object style="visibility:visible;width:100%;height:100%" id="not-ACFlashPlayer-re" data="' + d + '" src="' + d + '" allowscriptaccess="always" allowfullscreen="true" allowfullscreeninteractive="true" type="application/x-shockwave-flash"><param value="true" name="allowFullscreenInteractive"><param value="true" name="allowfullscreen"><param value="always" name="allowscriptaccess"><param value="' + e + '" name="flashvars"><param name=movie value="' + d + '"></object>';
  };
  if (!document.getElementById('video-download')) {
    $('#txt-title-view').append('<span id="video-download"><a class="btn primary" href="http://www.talkshowcn.com/page/acfun_danmu.html?vid=' + $('a.active.primary').attr('data-vid') + '&p=' + (parseInt($('#area-part-view').attr('data-part')) + 1).toString() + '" title="视频详细信息及视频弹幕下载" style="float:none;color:#fff;margin-left:8px;" target="_blank"><i class="icon icon-download"></i>详细信息及下载</a></span>');
  }
  if (b == 'youku2') {
    b = 'youku';
  }
  if (b == 'qq2') {
    b = 'qq';
  }
  sourceList = {
    'sina': '新浪视频',
    'youku': '优酷网',
    'tudou': '土豆网',
    'qq': '腾讯视频',
    'pps': 'PPS.tv',
    'ku6': '酷六网',
    'letv': '乐视云',
    'letv2': '乐视网',
    'sohu': '搜狐视频',
    'iqiyi': '爱奇艺',
    '56': '56网',
    'pptv': 'PPTV'
  };
  if (b != 'letv') {
    c('http://static.ragnaroks.org/private/acfun/AcPlayer201412121.swf', 'oldcs=1&host=http://www.talkshowcn.com&vid=' + $('a.active.primary').attr('data-vid') + '|' + b + '|' + $('a.active.primary').attr('data-sid'));
    $('#video-download').append('<a class="btn primary" onclick="$(_getPlayer()).prop(\'outerHTML\',$(_getPlayer()).prop(\'outerHTML\').replace(/acfun.tv/,\'talkshowcn.com\'))" style="float:none;color:#fff;margin-left:8px;" target="_blank"><i class="icon icon-refresh"></i>若解析失败点这儿刷新几次</a>');
  }
  window.setCookie = function (d, f) {
    var e = 365;
    var g = new Date();
    g.setTime(g.getTime() + e * 24 * 60 * 60 * 1000);
    document.cookie = d + '=' + escape(f) + ';expires=' + g.toGMTString();
  };
  function a(e) {
    var d,
    f = new RegExp('(^| )' + e + '=([^;]*)(;|$)');
    if (d = document.cookie.match(f)) {
      return unescape(d[2]);
    } else {
      return null;
    }
  }
  if (a('fuckqqtips') != 1 && b == 'qq') {
    setCookie('fuckqqtips', 1);
  }
}.toString();
var b = document.createElement("script");
b.innerHTML  = "("+a+")()";
document.body.appendChild(b);
