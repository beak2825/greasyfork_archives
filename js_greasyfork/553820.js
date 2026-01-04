// ==UserScript==
// @name         抖音已看视频标记
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在抖音用户主页标记已经看过的视频
// @author       You
// @match        https://www.douyin.com/user/*
 // 请确保此URL模式与抖音用户主页的URL匹配
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/553820/%E6%8A%96%E9%9F%B3%E5%B7%B2%E7%9C%8B%E8%A7%86%E9%A2%91%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/553820/%E6%8A%96%E9%9F%B3%E5%B7%B2%E7%9C%8B%E8%A7%86%E9%A2%91%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 配置一个观察器，以在动态加载内容时触发
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length) {
        // 当有新节点加入时，尝试标记视频
        setTimeout(markWatchedVideos, 100);
      }
    });
  });

  // 启动观察器，监听整个body的变化
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // 初始标记
  setTimeout(markWatchedVideos, 500);

  // 获取存储的已看视频ID数组
  function getWatchedVideoIds() {
    const stored = GM_getValue('douyin_watched_videos');
    return stored ? JSON.parse(stored) : {};
  }

  // 保存已看视频ID
  function addToWatched(videoId) {
    const watched = getWatchedVideoIds();
    // 使用对象存储，键为videoId，值为true，方便快速查找
    if (!watched[videoId]) {
      watched[videoId] = true;
      GM_setValue('douyin_watched_videos', JSON.stringify(watched));
      // 添加标记
      markVideoAsWatched(videoId);
    }
  }

  // 标记单个视频
  function markVideoAsWatched(videoId) {
    // 根据实际页面结构调整选择器
    const videoElement = document.querySelector(`[data-video-id="${videoId}"]`);
    if (videoElement) {
      // 添加一个已看样式类
      videoElement.classList.add('watched-video');
    }
  }

  // 主标记函数
  function markWatchedVideos() {
    const watchedVideoIds = getWatchedVideoIds();
    // 获取当前页面所有视频卡片，选择器需要根据抖音实际结构调整
    const videoCards = document.querySelectorAll('.xB1uit-1'); // 示例选择器，需替换
    videoCards.forEach((card) => {
      // 获取视频ID，方式取决于页面结构
      const videoId = card.getAttribute('data-video-id') || card.querySelector('a')?.href?.match(/video\/(\d+)/)?.[1];
      if (videoId && watchedVideoIds[videoId]) {
        card.classList.add('watched-video');
      }
    });
  }

  // 为视频添加监听，例如点击或可见性变化
  function addVideoListeners() {
    // 示例：监听视频卡片点击
    document.body.addEventListener('click', function (e) {
      const videoCard = e.target.closest('.xB1uit-1'); // 示例选择器，需替换
      if (videoCard) {
        const videoId = videoCard.getAttribute('data-video-id');
        if (videoId) {
          addToWatched(videoId);
        }
      }
    }, true);

    // 示例：监听视频进入视口（Intersection Observer）
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const videoCard = entry.target;
          const videoId = videoCard.getAttribute('data-video-id');
          if (videoId) {
            addToWatched(videoId);
          }
        }
      });
    }, { threshold: 0.5 }); // 当50%进入视口时触发

    // 观察所有视频卡片
    document.querySelectorAll('.xB1uit-1').forEach(card => io.observe(card)); // 示例选择器，需替换
  }

  // 添加自定义样式
  const style = document.createElement('style');
  style.textContent = `
    .watched-video {
      opacity: 0.7; /* 降低透明度 */
      border: 2px solid #ff0000; /* 红色边框 */
    }
    /* 你可以在.watched-video类下添加更多样式，例如在角落添加“已看”标签 */
  `;
  document.head.appendChild(style);

  // 初始化监听器
  addVideoListeners();
})();