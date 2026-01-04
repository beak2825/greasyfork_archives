// ==UserScript==
// @name         B站直播网页模式全屏-去除底部礼物栏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  净化直播主界面，让直播回归纯净模式
// @author       yaochao
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @require      https://code.bdstatic.com/npm/jquery@3.5.0/dist/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555171/B%E7%AB%99%E7%9B%B4%E6%92%AD%E7%BD%91%E9%A1%B5%E6%A8%A1%E5%BC%8F%E5%85%A8%E5%B1%8F-%E5%8E%BB%E9%99%A4%E5%BA%95%E9%83%A8%E7%A4%BC%E7%89%A9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/555171/B%E7%AB%99%E7%9B%B4%E6%92%AD%E7%BD%91%E9%A1%B5%E6%A8%A1%E5%BC%8F%E5%85%A8%E5%B1%8F-%E5%8E%BB%E9%99%A4%E5%BA%95%E9%83%A8%E7%A4%BC%E7%89%A9%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.$ || $;

    // 屏蔽 p2p 上传和下载
    //window.RTCPeerConnection = window.webkitRTCPeerConnection = window.mozRTCPeerConnection = null
    window.RTCDataChannel = window.DataChannel = null

    // 定时3秒后，把多余的元素删除，修改部分组件的样式
    setTimeout(function(){
        $("#web-player__bottom-bar__container").remove();
        // 选择清晰度最高的画质
        // $("li[class^=selected-]").parent().children()[0].click()
    },3000);

})();
