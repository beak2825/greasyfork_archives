// ==UserScript==
// @name         青书学堂看视频
// @namespace    http://tampermonkey.net/
// @version      2025-09-25
// @description  由于青书视频得分是按照时长来的，因此开多个窗口一直放着就行（视频最好开四个，ppt不限制），脚本会自动重复播放视频和关闭挂机检测弹窗，理论上你一个学科选择一个窗口打开视频或者ppt就行，一个窗口5分钟2分，5小时60分。
// @author       Lqq
// @match        degree.qingshuxuetang.com/gmu/Student/Course/CourseShow*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qingshuxuetang.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550340/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E7%9C%8B%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/550340/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E7%9C%8B%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
let panle = null;
    function startRark() {
        addLog('页面初始化----');
        addLog('由于青书视频得分是按照时长来的，因此开多个窗口一直放着就行（视频最好开四个，ppt不限制），脚本会自动重复播放视频和关闭挂机检测弹窗，理论上你一个学科选择一个窗口打开视频或者ppt就行，一个窗口5分钟2分，5小时60分');
        clearInterval(window.t);
        window.t = setInterval(() => {
            document.querySelectorAll('.ui-button-text').forEach(v => { if (v.innerHTML.indexOf('确定') !== -1) { v.click();addLog('已关闭弹窗'); } });
        }, 5000);
        setTimeout(() => {
            document.querySelectorAll('.vjs-tech').forEach(v => {
                 v.addEventListener('ended', function () { v.play();addLog('循环播放'); });
                //监听播放时 自动二倍速
                // v.addEventListener('play', function () { v.playbackRate = 2; });
                v.play();
                addLog('自动播放');
            });
        }, 1000);


    }
    function addLog(t) {
        if (!panle) {
          panle = document.createElement("div");
          panle.style.cssText =
            "width: 200px; height: 200px; background-color: rgba(0,0,0,0.6);border-radius: 6px;font-size: 12px;color: white;overflow-y: auto;padding:10px;position: fixed;right:20px;bottom:20px;z-index:9999;";
          document.body.appendChild(panle);
        }
        let text = document.createElement("div");
        text.innerText = `${t} ${new Date().toLocaleTimeString()}`;
        //往前面追加
        panle.insertBefore(text, panle.firstChild);
      }

    // 页面加载完成后启动
    window.addEventListener('load', startRark);
})();