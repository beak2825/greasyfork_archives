// ==UserScript==
// @name         CCTV直播 自动调整清晰度
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动切换CCTV直播清晰度
// @author       LuoTaoMochi
// @license      MIT
// @match        https://tv.cctv.com/live/*
// @grant        none
// @icon         http://tv.cctv.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/558207/CCTV%E7%9B%B4%E6%92%AD%20%E8%87%AA%E5%8A%A8%E8%B0%83%E6%95%B4%E6%B8%85%E6%99%B0%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/558207/CCTV%E7%9B%B4%E6%92%AD%20%E8%87%AA%E5%8A%A8%E8%B0%83%E6%95%B4%E6%B8%85%E6%99%B0%E5%BA%A6.meta.js
// ==/UserScript==

let definition = "720"; //清晰度设置：null/720/540/480/360

(function() {
    'use strict';
    let interval = setInterval(()=>{
        try{
            let tag = document.getElementById("resolution_item_" + definition +"_player");
            if(tag && !!definition) {
                tag.click();
                showToast("已自动切换至" + definition + 'P清晰度', 3000);
                clearInterval(interval);
            }
        } catch(e){
            console.log(e)
        }
    }, 100);
})();

function showToast(msg, duration){
    duration = isNaN(duration) ? 3000 : duration;
    let m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText="width:240px; height: 30px; background:rgba(0, 0, 0, 0.7);color:#fff; line-height:30px; text-align:center; border-radius:4px; position:fixed; bottom:50px; left:0;right: 0;margin: auto; z-index:999999;";
    document.body.appendChild(m);
    setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    }, duration);
}