// ==UserScript==
// @name                  ❀ 浮岚 Bilibili 快捷键补充
// @name:zh-TW            ❀ 浮嵐 Bilibili 快捷鍵補充
// @name:ja               ❀ 浮嵐 Bilibili ショートカット補充
// @name:ko               ❀ 부람 Bilibili 단축키 보충
// @name:en               ❀ Fulan Bilibili Shortcut Enhancer
// @description           对 Bilibili 视频播放界面的一系列快捷键补充
// @description:zh-TW     對 Bilibili 影片播放介面的一系列快捷鍵補充
// @description:ja        Bilibili 動画再生画面のショートカットを追加
// @description:ko        Bilibili 동영상 재생 화면의 단축키 보조
// @description:en        Additional shortcuts for the Bilibili video playback interface
// @version               1.2
// @author                嵐 @ranburiedbyacat
// @namespace             https://bento.me/ranburiedbyacat
// @license               CC-BY-NC-SA-4.0
// @match                 *://*.bilibili.com/*
// @compatible            Safari
// @compatible            Firefox
// @compatible            Chrome
// @icon                  https://www.bilibili.com/favicon.ico
// @grant                 none
// @run-at                document-idle
// @downloadURL https://update.greasyfork.org/scripts/554852/%E2%9D%80%20%E6%B5%AE%E5%B2%9A%20Bilibili%20%E5%BF%AB%E6%8D%B7%E9%94%AE%E8%A1%A5%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/554852/%E2%9D%80%20%E6%B5%AE%E5%B2%9A%20Bilibili%20%E5%BF%AB%E6%8D%B7%E9%94%AE%E8%A1%A5%E5%85%85.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 检测用户是否正在输入
  function isTyping() {
    var active = document.activeElement;
    return (
      active &&
      (active.tagName === 'INPUT' ||
        active.tagName === 'TEXTAREA' ||
        active.isContentEditable)
    );
  }

  // 模拟点击
  function simulateClick(selector) {
    var btn = document.querySelector(selector);
    if (btn) btn.click();
  }

  // 切换画中画
  function togglePIP() {
    var video = document.querySelector('video');
    if (!video) return;

    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(function(err){
        console.warn('退出画中画失败:', err);
      });
    } else {
      video.requestPictureInPicture().catch(function(err){
        console.warn('进入画中画失败:', err);
      });
    }
  }

  // 设置播放速度
  function setPlaybackRate(rate) {
    var video = document.querySelector('video');
    if (!video) return;
    video.playbackRate = rate;
    console.log('已设置播放速度为', rate, '倍速');
  }

  // 快捷键监听
  document.addEventListener('keydown', function(e) {
    if (isTyping()) return;
    if (e.repeat) return;

    // T：宽屏
    if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      simulateClick('.bpx-player-ctrl-wide, .bilibili-player-video-btn-widescreen');
    }

    // Y：网页全屏
    if (e.key === 'y' || e.key === 'Y') {
      e.preventDefault();
      simulateClick('.bpx-player-ctrl-web, .bilibili-player-video-web-fullscreen');
    }

    // P：画中画
    if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      togglePIP();
    }

    // 使用 e.code 判断物理按键，确保跨键盘布局
    // Shift + 数字3 → 3倍速
    if (e.shiftKey && e.code === 'Digit3') {
      e.preventDefault();
      setPlaybackRate(3);
    }

    // Shift + Q → 0.5倍速
    if (e.shiftKey && e.code === 'KeyQ') {
      e.preventDefault();
      setPlaybackRate(0.5);
    }

    // Shift + W → 1.5倍速
    if (e.shiftKey && e.code === 'KeyW') {
      e.preventDefault();
      setPlaybackRate(1.5);
    }

    // Shift + E → 2.5倍速
    if (e.shiftKey && e.code === 'KeyE') {
      e.preventDefault();
      setPlaybackRate(2.5);
    }
  });

})();