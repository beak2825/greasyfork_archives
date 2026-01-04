// ==UserScript==
// @name         cctv手机版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  cctv电脑版适配手机版
// @author       happmaoo
// @license MIT
// @match        https://tv.cctv.com/live/*
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554822/cctv%E6%89%8B%E6%9C%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/554822/cctv%E6%89%8B%E6%9C%BA%E7%89%88.meta.js
// ==/UserScript==
function viewport() {
    if (document.querySelector('meta[name="viewport"]')) {
      return;
    }
    const el = document.createElement("meta");
    el.name = "viewport";
    el.content = "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no";
    document.head.append(el);
  }

(function() {
    'use strict';
viewport();

/*普通页面*/
var mycss = `
body{min-width:auto!important;background:#fff!important;}
#aaaaa,.dragLayer,.nav_wrapper_bg,.header_nav,.floatNav,.video_btnBar,.video_right,.vspace,.column_wrapper,#page_bottom,.video_btn_l{display:none;width:auto!important;}
.playingVideo{width:100%!important;height:auto!important;}
.video_left{float:none!important;width:auto!important;height:auto!important;background:#fff!important;}
#player{width:100%!important;height:auto!important;}

.links{height: 25px;   overflow: visible;margin:10px 0;}
.links a{width:auto;height:18px;background:#eee;display:block;float: left;padding:2px 10px;margin:2px 5px;}
`;

GM_addStyle(mycss);

var html1 = `
<div class="links">

<a href="https://tv.cctv.com/live/cctv1">1</a>
<a href="https://tv.cctv.com/live/cctv2">2</a>
<a href="https://tv.cctv.com/live/cctv3">3</a>
<a href="https://tv.cctv.com/live/cctv4">4</a>
<a href="https://tv.cctv.com/live/cctv6">6</a>
<a href="https://tv.cctv.com/live/cctv7">7</a>
<a href="https://tv.cctv.com/live/cctv8">8</a>
<a href="https://tv.cctv.com/live/cctvjilu">9纪录</a>
<a href="https://tv.cctv.com/live/cctv10">10</a>
<a href="https://tv.cctv.com/live/cctv13">13</a>

<a href="https://tv.cctv.com/epg/"  target="_blank">节目表</a>
</div>
`;
$("body").append(html1);


})();
