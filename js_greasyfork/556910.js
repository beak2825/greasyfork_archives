// ==UserScript==
// @name         Bilibili-中文AI字幕（加载网页3秒后自动点击一次）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @date         2025-11-26
// @description  自动打开B站中文AI字幕
// @author       GFred
// @match        https://www.bilibili.com/*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556910/Bilibili-%E4%B8%AD%E6%96%87AI%E5%AD%97%E5%B9%95%EF%BC%88%E5%8A%A0%E8%BD%BD%E7%BD%91%E9%A1%B53%E7%A7%92%E5%90%8E%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E4%B8%80%E6%AC%A1%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/556910/Bilibili-%E4%B8%AD%E6%96%87AI%E5%AD%97%E5%B9%95%EF%BC%88%E5%8A%A0%E8%BD%BD%E7%BD%91%E9%A1%B53%E7%A7%92%E5%90%8E%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E4%B8%80%E6%AC%A1%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const delayTime=3800; //延迟时间
    setTimeout(()=>{
        try{
            //1.打开网页的时候切换中文AI字幕
            let zhongwen = document.querySelector('.bpx-player-ctrl-subtitle-language-item-text');
            zhongwen.click();
            //2.点击分P的时候会刷新，切换中文AI字幕
            let playListItems = document.querySelectorAll('.title-txt');
            playListItems.forEach((n,m)=>{
                n.addEventListener('mouseup',()=>{
                    //点击分P后又要加载，所以再加一个定时器
                    setTimeout(()=>{
                        zhongwen.click();
                    },delayTime)
                })
            })
            //3.视频自动切集的时候，切换中文AI字幕
            let vdo = document.querySelector(".bpx-player-video-wrap>video");
            vdo.addEventListener('durationchange',()=>{
                setTimeout(()=>{
                    zhongwen.click();
                },delayTime)
            })
        }catch(e){
            console.log(e)
        }
    },delayTime)
})();