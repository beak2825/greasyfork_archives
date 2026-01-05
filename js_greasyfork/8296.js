// ==UserScript==
// @id             e64cfa11-ff2f-4d8e-a0c5-71637d0a71ad
// @name           酷安网一键发现
// @version        1.2
// @namespace      
// @author         tastypear
// @description    提供一个按钮将相应页面的应用提交到酷市场
// @grant none
// @include        *www.wandoujia.com/apps/*
// @include        *play.google.com/store/apps/details?id=*
// @include        *shouji.baidu.com/*/item?docid=*
// @include        *zhushou.360.cn/detail/index/*
// @include        *shouji.com.cn/*/*.html
// @include        *android.myapp.com/myapp/detail.htm*
// @include        *android.d.cn/game/*.html
// @include        http://www.coolapk.com/faxian/create
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/8296/%E9%85%B7%E5%AE%89%E7%BD%91%E4%B8%80%E9%94%AE%E5%8F%91%E7%8E%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/8296/%E9%85%B7%E5%AE%89%E7%BD%91%E4%B8%80%E9%94%AE%E5%8F%91%E7%8E%B0.meta.js
// ==/UserScript==
var shareStr = '发现到酷安';
var cashareUrl = 'http://www.coolapk.com/faxian/create#';
var url = window.location.toString();
var share = document.createElement('a');
share.setAttribute('href', cashareUrl + url);
share.setAttribute('id', 'CASHARE');
share.setAttribute('target', '_blank');
share.innerHTML = shareStr;
var CASHARE;
function insertAfter(newEl, targetEl)
{
  var parentEl = targetEl.parentNode;
  if (parentEl.lastChild == targetEl) {
    parentEl.appendChild(newEl);
  } else {
    parentEl.insertBefore(newEl, targetEl.nextSibling);
  }
}
function setInnerHtml() {
  if (url.indexOf('wandoujia.com') >= 0) {
    var pushBtn = document.getElementsByClassName('push-btn') [0];
    share.setAttribute('class', 'push-btn');
    insertAfter(share, pushBtn);
  } else if (url.indexOf('play.google.com') >= 0) {
    url = window.location.toString();
    share.setAttribute('href', cashareUrl + url);
    var install = document.getElementsByClassName('apps medium play-button buy-button-container') [0];
    var spn = document.createElement('span');
    spn.setAttribute('class', 'apps medium play-button');
    var inner = document.createElement('span');
    share.setAttribute('style', 'color:#FFF;font-family:\'黑体\'');
    spn.appendChild(inner);
    inner.appendChild(share)
    insertAfter(spn, install);
  } else if (url.indexOf('shouji.baidu.com') >= 0) {
    var apk = document.getElementsByClassName('inst-btn-big') [0];
    share.setAttribute('class', 'apk');
    share.setAttribute('style', 'color:#F00');
    insertAfter(share, apk);
  } else if (url.indexOf('zhushou.360.cn') >= 0) {
    var item = document.getElementsByClassName('item-1') [2];
    var li = document.createElement('li');
    share.setAttribute('style', 'color:#F00');
    li.setAttribute('class', 'item-1');
    li.appendChild(share);
    insertAfter(li, item);
  } else if (url.indexOf('myapp.com') >= 0) {
    var btn = document.getElementsByClassName('det-type-box') [0];
    var div = document.createElement('div');
    div.setAttribute('class', 'det-ins-num');
    share.setAttribute('style', 'color:#F60');
    div.appendChild(share)
    insertAfter(div, btn);
  } else if (url.indexOf('android.d.cn') >= 0) {
    var item = document.getElementsByClassName('de-down') [0];
    //var item = downx.getElementsByClassName('de-head-btn')[0]
    var li = document.createElement('li');
    share.setAttribute('class', 'de-head-btn de-pc-btn');
    li.setAttribute('class', 'de-head-btn');
    li.appendChild(share);
    insertAfter(li, item);
  } else if (url.indexOf('shouji.com.cn') >= 0) {
    var item = document.getElementsByClassName('dlshow') [0];
    item.appendChild(share);    
  } else {
  }
}
function insertRun() {
  setInterval(function () {
    try {
      CASHARE = document.getElementById('CASHARE');
    } catch (e) {
      CASHARE = null;
    }
    if (CASHARE == null) {
      setInnerHtml();
    }
  }, 1000);
}
if (url.indexOf('coolapk.com') >= 0) {
  var target = url.substring(url.indexOf('#')+1, url.lenth);
  var input = document.getElementById('discoveryQueryInput').value=target;
  var btn = document.getElementsByClassName('btn btn-success') [0];
  btn.click();
} else {
  insertRun();
}
