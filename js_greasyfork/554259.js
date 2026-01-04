// ==UserScript==
// @name         B站调速器
// @namespace    https://github.com/Germxu
// @homepage     https://github.com/Germxu/Scripts-for-TamperMonkey
// @supportURL   https://github.com/Germxu/Scripts-for-TamperMonkey/issues/new
// @version      1.1
// @description  滚轮控制B站视频播放速度，右键恢复1x，刷新/切换视频后保持速度
// @author       Finn (enhanced)
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554259/B%E7%AB%99%E8%B0%83%E9%80%9F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554259/B%E7%AB%99%E8%B0%83%E9%80%9F%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const minRate = 0.3;
  const maxRate = 5.0;
  const STORAGE_KEY_PREFIX = 'bilibili-playback-rate-';

  // 获取当前视频的唯一标识（BV号或路径）
  function getVideoId() {
    const path = location.pathname; // 如 /video/BV1xx411c7mu
    // return path.split('/')[ 2 ] || 'global'; // BV号或 fallback
    return 'global';
  }

  // 获取存储键
  function getStorageKey() {
    return STORAGE_KEY_PREFIX + getVideoId();
  }

  // 保存播放速度
  function savePlaybackRate(rate) {
    try {
      localStorage.setItem(getStorageKey(), rate.toFixed(2));
    } catch (e) {
      console.warn("无法保存播放速度", e);
    }
  }

  // 读取保存的播放速度
  function loadPlaybackRate() {
    try {
      const saved = localStorage.getItem(getStorageKey());
      if (saved) {
        const rate = parseFloat(saved);
        return isNaN(rate) ? null : Math.max(minRate, Math.min(maxRate, rate));
      }
    } catch (e) {
      console.warn("无法读取播放速度", e);
    }
    return null;
  }

  // 查找视频元素
  function getVideoElement() {
    return document.querySelector("video") ||
      document.querySelector("video.bpx-player-video-video-tag");
  }

  // 获取播放倍速按钮
  function getPlaybackRateButton() {
    return document.querySelector("#bilibili-player .bpx-player-ctrl-playbackrate");
  }

  // 设置播放速度并更新 UI + 持久化
  function setPlaybackRate(video, rate) {
    if (!video) return;

    rate = Math.max(minRate, Math.min(maxRate, rate));
    video.playbackRate = rate;

    // 更新按钮显示
    const rateBtn = getPlaybackRateButton();
    if (rateBtn) {
      const label = rateBtn.querySelector("span");
      if (label) {
        label.textContent = rate.toFixed(2) + "x";
      }
    }

    // 持久化存储
    savePlaybackRate(rate);
  }

  // 恢复默认播放速度
  function resetPlaybackRate(video) {
    setPlaybackRate(video, 1.00);
  }

  // 滚轮调节速度
  function handleWheel(event) {
    event.preventDefault();
    const video = getVideoElement();
    if (!video) return;

    let rate = video.playbackRate;
    const step = (rate > 1.2 && rate < 2) ? 0.01 : 0.04;

    if (event.deltaY < 0) {
      rate += step; // 向上滚：加速
    } else {
      rate -= step; // 向下滚：减速
    }

    rate = Math.round(rate * 100) / 100;
    setPlaybackRate(video, rate);
  }

  // 绑定事件到按钮
  function bindEvents(rateBtn) {
    // 防止重复绑定
    rateBtn.removeEventListener("wheel", handleWheel);
    rateBtn.removeEventListener("contextmenu", handleContextMenu);

    rateBtn.addEventListener("wheel", handleWheel, { passive: false });

    rateBtn.addEventListener("contextmenu", handleContextMenu, { passive: false });
  }

  // 右键处理函数
  function handleContextMenu(event) {
    event.preventDefault();
    const video = getVideoElement();
    if (video) {
      resetPlaybackRate(video);
    }
  }

  // 尝试恢复速度并绑定事件
  function tryRestoreAndBind() {
    const rateBtn = getPlaybackRateButton();
    const video = getVideoElement();

    if (rateBtn && video) {
      bindEvents(rateBtn);

      // 恢复保存的速度（如果有）
      const savedRate = loadPlaybackRate();
      if (savedRate !== null && Math.abs(video.playbackRate - savedRate) > 0.01) {
        setPlaybackRate(video, savedRate);
      }

      console.log("B站调速器已激活，速度已恢复:", video.playbackRate.toFixed(2) + "x");
      return true; // 成功绑定
    }
    return false;
  }

  // 使用 MutationObserver 监听播放器动态加载（更可靠）
  function observePlayer() {
    const observer = new MutationObserver((mutations, obs) => {
      if (tryRestoreAndBind()) {
        obs.disconnect(); // 绑定成功后停止观察
      }
    });

    // 开始观察 document.body 的子节点变化
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 同时尝试立即绑定（防止已加载）
    if (tryRestoreAndBind()) {
      observer.disconnect();
    }

    // 超时保险（最多等 10 秒）
    setTimeout(() => {
      if (observer) observer.disconnect();
    }, 10000);
  }

  // 页面完全加载后启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observePlayer);
  } else {
    observePlayer();
  }

  // 可选：监听 URL 变化（支持 SPA 切换视频）
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(observePlayer, 1000); // 延迟等待新播放器加载
    }
  }).observe(document, { subtree: true, childList: true });

})();