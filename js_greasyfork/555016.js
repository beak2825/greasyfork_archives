// ==UserScript==
// @name         重庆师范大学考试平台 倍速播放
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  适配 ks.cqsdx.cn/exam/ 视频，防检测倍速+自动同步进度
// @author       Richard Tyson
// @match        *://ks.cqsdx.cn/exam/*
// @grant        none
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/555016/%E9%87%8D%E5%BA%86%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E8%80%83%E8%AF%95%E5%B9%B3%E5%8F%B0%20%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/555016/%E9%87%8D%E5%BA%86%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E8%80%83%E8%AF%95%E5%B9%B3%E5%8F%B0%20%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 等待播放器加载（最长等5秒）
  const checkInterval = setInterval(() => {
    const video = findCqsdxVideo();
    if (video) {
      clearInterval(checkInterval);
      // 设置倍速：倍速建议控制在 1.5~2.5x，这个平台对超过 3x 的倍速检测较严
      video.playbackRate = 2.5;
      // 自动同步进度+模拟鼠标移动（防检测）
      setInterval(() => {
        video.dispatchEvent(new Event('timeupdate'));
        video.dispatchEvent(new Event('progress'));
        // 模拟鼠标在视频区域移动
        const mouseEvent = new MouseEvent('mousemove', { clientX: 100, clientY: 200 });
        video.dispatchEvent(mouseEvent);
      }, 20000);
    }
  }, 500);

  function findCqsdxVideo() {
    const containers = [
      document.querySelector('.video-container video'),
      document.querySelector('[id*="video-player"] video'),
      document.querySelector('[class*="exam-video"] video'),
      document.querySelector('iframe[src*="video"]')?.contentDocument?.querySelector('video')
    ];
    return containers.find(v => v && v.duration > 0);
  }
})();