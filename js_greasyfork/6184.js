// ==UserScript==
// @name        如意淘
// @namespace   times.eu.org
// @version     1.0
// @description 如意淘脚本版
// @include     http://*.yixun.com/*
// @include     http://*.jd.com/*
// @include     http://*.taobao.com/*
// @include     http://*.tmall.com/*
// @include     http://*.amazon.cn/*
// @include     http://*.z.cn/*
// @include     http://*.yhd.com/*
// @include     http://*.paipai.com/*
// @include     http://*.okbuy.com/*
// @include     http://*.letao.com/*
// @include     http://*.vipshop.com/*
// @grant       none
// @update 2013-09-16
// @downloadURL https://update.greasyfork.org/scripts/6184/%E5%A6%82%E6%84%8F%E6%B7%98.user.js
// @updateURL https://update.greasyfork.org/scripts/6184/%E5%A6%82%E6%84%8F%E6%B7%98.meta.js
// ==/UserScript==
 (function(){
var s = document.createElement('script');s.setAttribute('src','http://ruyi.taobao.com/extension/bookmarklet.js?t=');
var b = document.createElement('style');b.textContent='#ruyitao-price-comparation-wrapper{bottom:50px !important;}';
document.body.appendChild(s).appendChild(b);
})()