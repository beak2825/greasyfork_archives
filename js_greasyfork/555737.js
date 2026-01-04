// ==UserScript==
// @name         ❀ 浮岚 Bilibili 禁用快捷音量调节
// @description  禁用 B 站视频播放时的键盘上下键、触控板滚动手势、鼠标滚轮的音量调节
// @version      1.0.1
// @author       嵐 @ranburiedbyacat
// @namespace    https://bento.me/ranburiedbyacat
// @license      CC-BY-NC-SA-4.0
// @match        *://www.bilibili.com/video/*
// @compatible   Safari
// @compatible   Firefox
// @compatible   Chrome
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555737/%E2%9D%80%20%E6%B5%AE%E5%B2%9A%20Bilibili%20%E7%A6%81%E7%94%A8%E5%BF%AB%E6%8D%B7%E9%9F%B3%E9%87%8F%E8%B0%83%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/555737/%E2%9D%80%20%E6%B5%AE%E5%B2%9A%20Bilibili%20%E7%A6%81%E7%94%A8%E5%BF%AB%E6%8D%B7%E9%9F%B3%E9%87%8F%E8%B0%83%E8%8A%82.meta.js
// ==/UserScript==

(function () {
  'use strict';

    // 键盘上下键防音量调整
  var origAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (type === 'keydown') {
      var wrapped = function (e) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.stopImmediatePropagation();
          return;
        }
        return listener.call(this, e);
      };
      return origAddEventListener.call(this, type, wrapped, options);
    }
    return origAddEventListener.call(this, type, listener, options);
  };

  // 滚轮防音量调整
  var waitForVideo = setInterval(function () {
    var video = document.querySelector('video');
    if (!video) return;
    clearInterval(waitForVideo);

    document.addEventListener(
      'wheel',
      function (e) {
        var path = [];
        if (typeof e.composedPath === 'function') {
          path = e.composedPath();
        } else {
          // 手动构建事件路径（兼容不支持 composedPath 的浏览器）
          var el = e.target;
          while (el) {
            path.push(el);
            el = el.parentElement;
          }
        }

        // 是否作用于 video 元素
        var onVideoElement = false;
        for (var i = 0; i < path.length; i++) {
          if (path[i] instanceof HTMLVideoElement) {
            onVideoElement = true;
            break;
          }
        }

        // 是否位于控制层区域
        var inControlArea = false;
        for (var j = 0; j < path.length; j++) {
          var el2 = path[j];
          if (
            el2 &&
            el2.classList &&
            el2.classList.contains('bpx-player-video-wrap')
          ) {
            inControlArea = true;
            break;
          }
        }

        // 是否处于全屏状态
        var isFullscreen =
          document.fullscreenElement &&
          document.fullscreenElement.contains(video);

        // 满足“全屏且滚动目标为 video 或控制层”时阻止默认行为
        if ((onVideoElement || inControlArea) && isFullscreen) {
          e.stopImmediatePropagation();
          e.preventDefault();
        }
      },
      { capture: true, passive: false }
    );
  }, 300);
})();