// ==UserScript==
// @name        禁用relingo-audio-frame
// @namespace    http://tampermonkey.net/
// @version      2025-09-10
// @description  使用relingo插件会影响页面样式，禁用relingo-audio-frame
// @author       wangze
// @grant        none
// @license MIT
// @connect    baidu.com
// @connect    google.com
// @connect    google.com.hk
// @connect    google.com.jp
// @connect    bing.com
// @connect    duckduckgo.com
// @connect    dogedoge.com
// @connect    so.com
// @connect    localhost
// @connect    90dao.com
// @connect    *
// @include    *://ipv6.baidu.com/*
// @include    *://www.baidu.com/*
// @include    *://www1.baidu.com/*
// @include    *://m.baidu.com/*
// @include    *://xueshu.baidu.com/s*
// @include    *://www.so.com/s?*
// @include    *://*.bing.com/*
// @include    *://encrypted.google.*/search*
// @include    *://*.google*/search*
// @include    *://scholar.google.com/scholar*
// @include    *://*.google*/webhp*
// @include    *://*duckduckgo.com/*
// @include    *://*.dogedoge.com/*
// @include    *://*.90dao.com/*
// @include    *://*.tujidu.com/*
// @include    *://**/*
// @exclude    *://*.google*/sorry*
// @exclude    https://zhidao.baidu.com/*
// @exclude    https://*.zhidao.baidu.com/*
// @exclude    https://www.baidu.com/img/*
// @exclude    https://lens.google.com/*
// @supportURL  https://ac.tujidu.com/
// @downloadURL https://update.greasyfork.org/scripts/548996/%E7%A6%81%E7%94%A8relingo-audio-frame.user.js
// @updateURL https://update.greasyfork.org/scripts/548996/%E7%A6%81%E7%94%A8relingo-audio-frame.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个style元素
    const style = document.createElement('style');
    // 设置CSS内容
    style.textContent = '#relingo-audio-frame { display: none !important; }';
    // 将style元素添加到header中
    document.head.appendChild(style);

})();