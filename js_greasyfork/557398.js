// ==UserScript==
// @name         Douyin Auto Pause + Smart Unmute
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  进入抖音网页和切换视频时自动暂停并静音；用户点击播放时自动打开声音，下一个视频重新静音并自动暂停。
// @match        https://www.douyin.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557398/Douyin%20Auto%20Pause%20%2B%20Smart%20Unmute.user.js
// @updateURL https://update.greasyfork.org/scripts/557398/Douyin%20Auto%20Pause%20%2B%20Smart%20Unmute.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 最近一次用户交互时间
  let lastUserInteraction = 0;

  // 记录用户交互（点击、键盘、触摸等）
  function setupUserInteractionTracker() {
    const updateInteractionTime = () => {
      lastUserInteraction = Date.now();
    };

    ['click', 'keydown', 'touchstart', 'pointerdown'].forEach(type => {
      window.addEventListener(type, updateInteractionTime, true);
    });
  }

  function pauseVideo(video) {
    try {
      video.muted = true;   // 确保静音
      video.pause();
    } catch (e) {
      console.error('Pause video failed:', e);
    }
  }

  function pauseAndMuteAllVideosExcept(exceptVideo) {
    const videos = document.querySelectorAll('video');
    videos.forEach(v => {
      if (v === exceptVideo) return;
      pauseVideo(v);
    });
  }

  // 尝试给当前播放器“点一下”音量按钮，让 UI 同步
  function clickPlayerVolumeButton() {
    try {
      // 你提供的那个 selector，我们尽量找到它的上层可点击元素
      const svg = document.querySelector(
        '#sliderVideo xg-icon.xgplayer-volume .xg-volume-mute svg'
      );
      if (svg) {
        const clickable = svg.closest('xg-icon, button, div');
        if (clickable) {
          clickable.dispatchEvent(
            new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
          );
          return;
        }
      }

      // 如果上面那个找不到，退而求其次找通用的音量图标
      const genericIcon = document.querySelector('#sliderVideo xg-icon.xgplayer-volume');
      if (genericIcon) {
        genericIcon.dispatchEvent(
          new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
        );
      }
    } catch (e) {
      console.error('Click volume button failed:', e);
    }
  }

  // 取消静音当前视频
  function unmuteVideo(video) {
    try {
      video.muted = false;
      if (video.volume === 0) {
        video.volume = 1.0;
      }
    } catch (e) {
      console.error('Unmute video failed:', e);
    }

    // 尝试“点一下”播放器的音量图标，让 UI 同步
    clickPlayerVolumeButton();
  }

  // 暂停页面上所有 video（用于初始 & 新增）
  function pauseAllVideos() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      pauseVideo(video);
    });
  }

  // 钩住 play 事件：分辨自动播放 & 用户点击播放
  function hookPlayEvent() {
    document.addEventListener(
      'play',
      function (e) {
        const target = e.target;
        if (!target || target.tagName !== 'VIDEO') return;

        const now = Date.now();
        const delta = now - lastUserInteraction;

        // 没有用户操作，或者时间差太久 => 认为是自动播放，拦截
        if (delta > 500) {
          setTimeout(() => {
            pauseVideo(target);
          }, 0);
        } else {
          // 用户刚刚有交互 => 允许播放 & 打开声音 & 其它视频静音暂停
          unmuteVideo(target);
          pauseAndMuteAllVideosExcept(target);
        }
      },
      true // 捕获阶段，优先于页面自己的监听
    );
  }

  // 监听 DOM 变化，发现新 video 就暂停并静音
  function observeNewVideos() {
    const observer = new MutationObserver(mutations => {
      let needPause = false;

      for (const mutation of mutations) {
        mutation.addedNodes.forEach(node => {
          if (!(node instanceof HTMLElement)) return;

          if (node.tagName === 'VIDEO') {
            needPause = true;
          }

          const videosInside =
            node.querySelectorAll && node.querySelectorAll('video');
          if (videosInside && videosInside.length > 0) {
            needPause = true;
          }
        });
      }

      if (needPause) {
        pauseAllVideos();
      }
    });

    const target = document.documentElement || document.body;
    if (target) {
      observer.observe(target, {
        childList: true,
        subtree: true
      });
    }
  }

  function init() {
    setupUserInteractionTracker();
    hookPlayEvent();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        pauseAllVideos();
      });
    } else {
      pauseAllVideos();
    }

    observeNewVideos();
  }

  init();
})();
