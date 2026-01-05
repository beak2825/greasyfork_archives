// ==UserScript==
// @name        去除CL1024需要插件提醒
// @namespace   times.eu.org
// @description 去除1024论坛 播放在线视频需要安装插件的提示
// @homepageURL https://greasyfork.org/zh-CN/scripts/5998
// @include http://*cl*
// @include http://*184*
// @include http://*t66y*
// @include http://*1024*
// @include http://*caoliu*
// @include http://wo.yao.cl
// @include http://*shenyingwang*
// @exclude http://*baidu*
// @version     2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5998/%E5%8E%BB%E9%99%A4CL1024%E9%9C%80%E8%A6%81%E6%8F%92%E4%BB%B6%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/5998/%E5%8E%BB%E9%99%A4CL1024%E9%9C%80%E8%A6%81%E6%8F%92%E4%BB%B6%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function (embedList) {
  [
  ].forEach.call(embedList, function (i) {
    var iframe = document.createElement('iframe');
    iframe.src = i.src,
    iframe.width = i.width,
    iframe.height = i.height;
    i.parentNode.replaceChild(iframe, i);
  });
}) (document.querySelectorAll('embed'));
