// ==UserScript==
// @name        i漫画
// @namespace   piscat
// @include     http://www.imanhua.com/*
// @version     1.0
// @author      piscat
// @grant       none
// @description:en used in the imanhua.com to display all the pages in the same window.
// @description used in the imanhua.com to display all the pages in the same window.
// @downloadURL https://update.greasyfork.org/scripts/8590/i%E6%BC%AB%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/8590/i%E6%BC%AB%E7%94%BB.meta.js
// ==/UserScript==
var btns = document.getElementsByClassName('main-btn') [0];
btns.innerHTML = btns.innerHTML + '<a class="btn-red" href="javascript:gen();">单窗浏览</a>';
window.number = function (a, l) {
  if (a === 0) return '000';
  var d = l - parseInt(Math.log10(a)) - 1;
  while (d !== 0)
  {
    a = '0' + a;
    d = d - 1;
  }
  return a;
}
window.gen = function () {
  var url = location.href;
  var a = url.split('comic/') [1].split('/') [0];
  var b = url.split('list_') [1].split('.') [0];
  var pn = document.getElementById('pageSelect').children.length;
  img = document.getElementById('comic').getAttribute('src');
  img_pre = img.split(a) [0];
  img_suf = img.split(b) [1];
  if (img_suf.indexOf('imanhua') != - 1) {
    var html = '';
    if (img_suf.indexOf('jpg') != - 1) {
      for (i = 1; i <= pn; i++)
      {
        html = html + '<img src="' + img_pre + a + '/' + b + '/imanhua_' + number(i, 3) + '.jpg"></img></br>';
      }
    } else {
      for (i = 1; i <= pn; i++)
      {
        html = html + '<img src="' + img_pre + a + '/' + b + '/imanhua_' + number(i, 3) + '.png"></img></br>';
      }
    }
    document.getElementsByTagName('body') [0].innerHTML = html;
  } else {
    var html = '';
    if (img_suf.indexOf('jpg') != - 1) {
      for (i = 1; i <= pn; i++)
      {
        html = html + '<img src="' + img_pre + a + '/' + b + '/' + number(i, img_suf.split('.') [0].length - 1) + '.jpg"></img></br>';
      }
    } else {
      for (i = 1; i <= pn; i++)
      {
        html = html + '<img src="' + img_pre + a + '/' + b + '/' + number(i, img_suf.split('.') [0].length - 1) + '.png"></img></br>';
      }
    }
    document.getElementsByTagName('body') [0].innerHTML = html;
  }
}
