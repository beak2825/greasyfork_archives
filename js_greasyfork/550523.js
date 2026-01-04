// ==UserScript==
// @name         四川干部网络学院视频自动监控与标签页管理
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  使用：把要看的视频标签页打开，看完当前标签页视频后，自动关闭当前页面，自动播放看下一个标签页的视频
// @author       Thruon
// @match        https://web.scgb.gov.cn/*
// @include      https://web.scgb.gov.cn/*
// @grant        none
// @license      MIT
// @supportURL   3339607643（QQ）
// @downloadURL https://update.greasyfork.org/scripts/550523/%E5%9B%9B%E5%B7%9D%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%9B%91%E6%8E%A7%E4%B8%8E%E6%A0%87%E7%AD%BE%E9%A1%B5%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/550523/%E5%9B%9B%E5%B7%9D%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%9B%91%E6%8E%A7%E4%B8%8E%E6%A0%87%E7%AD%BE%E9%A1%B5%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let pausedSeconds = 0; // 记录视频暂停的秒数
    let checkInterval; // 状态检测的间隔计时器
    const MAX_PAUSED_TIME = 5; // 最大允许暂停时间（秒）

    function main() {
        console.log('视频开始检测');
/**
        checkInterval = setInterval(() => {
          reloadPage();
          if (document.visibilityState === 'visible' && !document.querySelector('.ivu-tag-color-white')) {
              document.querySelector('#videoPlayer_html5_api').play()
          }else{
              document.querySelector('#videoPlayer_html5_api').pause();
              if (document.querySelector('#videoPlayer_html5_api').paused && document.visibilityState === 'visible') {
                  pausedSeconds++;
                  console.log(`视频已暂停 ${pausedSeconds} 秒`);

                  // 如果暂停超过设定时间
                  if (pausedSeconds >= MAX_PAUSED_TIME) {
                      clearInterval(checkInterval);
                    //  attemptTabManagement();
                  }
              } else {
                  pausedSeconds = 0;
              }
          }
       } , 1000); */

        checkInterval = setInterval(() =>{
            // 播放完当前视频，重新加载一下页面
            palyFinishReload();

            // 获取当前页面是否可见、视频是否播放完毕
            let visib = checkCurrentVisible();
            let finsh = checkVideoFinsh();

            // 如果标签页不可见，停止播放
            if( !visib ) {
                getVideoElement().pause();
                return;
            }
            // 如果视频全部播放完毕，关闭当前标签页
            if( finsh ) {
                clearInterval(checkInterval);
                closeWindow();
            }else {
                // 如果标签页可见并且没有播放完毕，继续播放
                getVideoElement().play();
            }
        } ,1000);
    }

    function closeWindow() {
        setTimeout(() => {
            window.close();
        }, 1000);
    }

    function palyFinishReload() {
        let video = getVideoElement();
        let progress = (video.currentTime / video.duration) * 100;
        if (progress >= 100) {
            location.reload();
        }
    }

    function checkCurrentVisible() {
        if(document.visibilityState === 'visible') {
           return true;
        }
        return false;
    }

    function getVideoElement() {
       return document.querySelector('#videoPlayer_html5_api')
    }

    function checkVideoFinsh() {
        let videoTargetNum = document.getElementsByClassName('name').length;
        let videoFinishNum = document.getElementsByClassName('ivu-tag-text').length;
        if (videoTargetNum === videoFinishNum) {
            return true;
        }
        return false;
    }


    //启动程序
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    };


})();