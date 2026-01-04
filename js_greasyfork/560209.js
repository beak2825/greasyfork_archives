// ==UserScript==
// @name         Custom Seekbar for FB Stories
// @namespace    https://github.com/DuckCIT/Custom-FB-Stories-Seekbar
// @version      1.0.0
// @description  Adds a draggable seekbar and time display for Facebook Stories videos.
// @author       DuckCIT
// @homepageURL  https://github.com/DuckCIT/Custom-FB-Stories-Seekbar
// @supportURL   https://github.com/DuckCIT/Custom-FB-Stories-Seekbar/issues
// @icon         https://raw.githubusercontent.com/DuckCIT/Custom-FB-Stories-Seekbar/main/extension/icons/icon.png
// @match        https://www.facebook.com/*
// @match        https://m.facebook.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560209/Custom%20Seekbar%20for%20FB%20Stories.user.js
// @updateURL https://update.greasyfork.org/scripts/560209/Custom%20Seekbar%20for%20FB%20Stories.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let currentVideo = null;
  let customSeekbar = null;
  let seekBarWrapper = null;
  let timeContainer = null;
  let currentTime = null;
  let totalTime = null;
  let progressFill = null;
  let thumb = null;
  let isDragging = false;
  let progressOuterContainer = null;
  let isActive = false;
  let checkInterval = null;

  let initRetryTimer = null;
  let initRetryCount = 0;
  let storyWatcherInterval = null;

  function isOnStoryPage() {
    return window.location.href.includes('/stories/');
  }

  function isSeekableVideo(v) {
    if (!v) return false;
    if (!(v instanceof HTMLVideoElement)) return false;
    const d = v.duration;
    return Number.isFinite(d) && d > 0;
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function updateProgress() {
    if (!currentVideo || !currentVideo.duration) return;
    const percent = (currentVideo.currentTime / currentVideo.duration) * 100;
    if (progressFill) progressFill.style.width = percent + '%';
    if (currentTime) currentTime.textContent = formatTime(currentVideo.currentTime);
    if (totalTime) totalTime.textContent = formatTime(currentVideo.duration);
  }

  function seekVideo(e) {
    if (!currentVideo || !currentVideo.duration) return;
    const seekRect = customSeekbar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - seekRect.left) / seekRect.width));
    currentVideo.currentTime = percent * currentVideo.duration;
    updateProgress();
  }

  function updatePosition() {
    if (!progressOuterContainer || !seekBarWrapper || !customSeekbar || !timeContainer) return;

    const newRect = progressOuterContainer.getBoundingClientRect();
    const newSeekBarWidth = newRect.width;

    seekBarWrapper.style.top = newRect.top + 'px';
    seekBarWrapper.style.left = newRect.left + 'px';
    seekBarWrapper.style.width = newSeekBarWidth + 'px';
    seekBarWrapper.style.height = newRect.height + 'px';

    customSeekbar.style.top = newRect.top + 'px';
    customSeekbar.style.left = newRect.left + 'px';
    customSeekbar.style.width = newSeekBarWidth + 'px';
    customSeekbar.style.height = newRect.height + 'px';

    timeContainer.style.top = (newRect.top + newRect.height + 8) + 'px';
    timeContainer.style.left = newRect.left + 'px';
    timeContainer.style.width = newRect.width + 'px';
    timeContainer.style.height = 'auto';
  }

  function handleMouseDown(e) {
    isDragging = true;
    seekVideo(e);
    if (thumb) {
      thumb.style.width = '14px';
      thumb.style.height = '14px';
    }
    if (customSeekbar) customSeekbar.style.cursor = 'grabbing';
    if (timeContainer) timeContainer.style.opacity = '1';
    e.preventDefault();
    e.stopPropagation();
  }

  function handleMouseEnter() {
    if (thumb) {
      thumb.style.width = '14px';
      thumb.style.height = '14px';
    }
    if (customSeekbar) customSeekbar.style.cursor = 'grab';
    if (timeContainer) timeContainer.style.opacity = '1';
  }

  function handleMouseLeave() {
    if (!isDragging) {
      if (thumb) {
        thumb.style.width = '12px';
        thumb.style.height = '12px';
      }
      if (customSeekbar) customSeekbar.style.cursor = 'pointer';
      if (timeContainer) timeContainer.style.opacity = '0';
    }
  }

  function handleClick(e) {
    seekVideo(e);
    e.stopPropagation();
  }

  function handleMouseMove(e) {
    if (isDragging) seekVideo(e);
  }

  function handleMouseUp() {
    if (!isDragging) return;
    isDragging = false;
    if (thumb) {
      thumb.style.width = '12px';
      thumb.style.height = '12px';
    }
    if (customSeekbar) customSeekbar.style.cursor = 'grab';
    if (customSeekbar && !customSeekbar.matches(':hover')) {
      if (timeContainer) timeContainer.style.opacity = '0';
    }
  }

  function cleanup() {
    if (customSeekbar) customSeekbar.remove();
    if (seekBarWrapper) seekBarWrapper.remove();
    if (timeContainer) timeContainer.remove();

    if (currentVideo) {
      currentVideo.removeEventListener('timeupdate', updateProgress);
      currentVideo.removeEventListener('loadedmetadata', updateProgress);
    }

    window.removeEventListener('scroll', updatePosition);
    window.removeEventListener('resize', updatePosition);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    if (checkInterval) clearInterval(checkInterval);
    checkInterval = null;

    if (initRetryTimer) clearTimeout(initRetryTimer);
    initRetryTimer = null;
    initRetryCount = 0;

    currentVideo = null;
    customSeekbar = null;
    seekBarWrapper = null;
    timeContainer = null;
    progressFill = null;
    thumb = null;
    currentTime = null;
    totalTime = null;
    progressOuterContainer = null;
    isActive = false;
  }

  function ensureStoryWatcher() {
    if (storyWatcherInterval) return;

    storyWatcherInterval = setInterval(() => {
      if (!isOnStoryPage()) return;

      const v = document.querySelector('video');
      if (isActive && (!v || !isSeekableVideo(v))) {
        cleanup();
        return;
      }
      if (!isActive && v && isSeekableVideo(v)) {
        initSeekbar();
      }
    }, 500);
  }

  function initSeekbar() {
    if (!isOnStoryPage()) return;
    ensureStoryWatcher();

    if (isActive) return;

    const video = document.querySelector('video');
    if (!video) return;

    if (!isSeekableVideo(video)) {
      const onMeta = () => {
        video.removeEventListener('loadedmetadata', onMeta);
        if (!isActive && isSeekableVideo(video)) initSeekbar();
      };
      video.addEventListener('loadedmetadata', onMeta);
      return;
    }

    currentVideo = video;

    progressOuterContainer = document.querySelector('.x78zum5.xqu0tyb.x14vqqas.xbmvrgn.xod5an3.x1diwwjn.x10l6tqk.x13vifvy.x8pckko');
    if (!progressOuterContainer) return;

    const progressBarContainers = progressOuterContainer.querySelectorAll('.x1ahlmzr.x1ekkm8c.x1143rjc.xum4auv.xj21bgg.x1rg5ohu.x12lumcd.x5yr21d.x1n2onr6');
    progressBarContainers.forEach(container => {
      container.style.opacity = '0';
      container.style.visibility = 'hidden';
    });

    const rect = progressOuterContainer.getBoundingClientRect();
    const seekBarWidth = rect.width;

    seekBarWrapper = document.createElement('div');
    seekBarWrapper.style.cssText = `
      position: fixed !important;
      top: ${rect.top}px !important;
      left: ${rect.left}px !important;
      width: ${seekBarWidth}px !important;
      height: ${rect.height}px !important;
      background: rgba(255, 255, 255, 0.3) !important;
      border-radius: 2px;
      z-index: 1 !important;
      pointer-events: none !important;
    `;

    customSeekbar = document.createElement('div');
    customSeekbar.style.cssText = `
      position: fixed !important;
      top: ${rect.top}px !important;
      left: ${rect.left}px !important;
      width: ${seekBarWidth}px !important;
      height: ${rect.height}px !important;
      cursor: pointer !important;
      z-index: 2 !important;
      border-radius: 2px;
      pointer-events: auto !important;
    `;

    progressFill = document.createElement('div');
    progressFill.style.cssText = `
      position: relative;
      height: 100%;
      background: white;
      width: 0%;
      transition: width 0.1s linear;
      pointer-events: none;
      border-radius: 2px;
    `;

    thumb = document.createElement('div');
    thumb.style.cssText = `
      position: absolute;
      right: -6px;
      top: 50%;
      transform: translateY(-50%);
      width: 12px;
      height: 12px;
      background: white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.6);
      opacity: 1;
      pointer-events: none;
    `;

    timeContainer = document.createElement('div');
    timeContainer.style.cssText = `
      position: fixed;
      top: ${rect.top + rect.height + 8}px;
      left: ${rect.left}px;
      width: ${rect.width}px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      pointer-events: none;
      z-index: 1;
      font-size: 11px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
      opacity: 0;
      transition: opacity 0.2s ease;
    `;

    currentTime = document.createElement('span');
    totalTime = document.createElement('span');
    timeContainer.appendChild(currentTime);
    timeContainer.appendChild(totalTime);

    progressFill.appendChild(thumb);
    customSeekbar.appendChild(progressFill);

    document.body.appendChild(seekBarWrapper);
    document.body.appendChild(customSeekbar);
    document.body.appendChild(timeContainer);

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', updateProgress);

    customSeekbar.addEventListener('mousedown', handleMouseDown);
    customSeekbar.addEventListener('mouseenter', handleMouseEnter);
    customSeekbar.addEventListener('mouseleave', handleMouseLeave);
    customSeekbar.addEventListener('click', handleClick);

    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    isActive = true;

    setTimeout(updateProgress, 100);

    checkInterval = setInterval(() => {
      const v = document.querySelector('video');
      if (!v || !isSeekableVideo(v)) {
        cleanup();
        return;
      }
      if (v !== currentVideo) {
        cleanup();
        initSeekbar();
      }
    }, 500);
  }

  // SPA URL watcher (rough)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url === lastUrl) return;
    lastUrl = url;

    if (isOnStoryPage() && !isActive) {
      cleanup();
      ensureStoryWatcher();
      const tryInit = () => {
        if (!isOnStoryPage() || isActive) return;
        initSeekbar();
        if (!isActive && initRetryCount < 10) {
          initRetryCount++;
          initRetryTimer = setTimeout(tryInit, 500);
        }
      };
      initRetryCount = 0;
      initRetryTimer = setTimeout(tryInit, 500);
    } else if (!isOnStoryPage() && isActive) {
      cleanup();
    }
  }).observe(document, { subtree: true, childList: true });

  if (isOnStoryPage()) {
    ensureStoryWatcher();
    const tryInit = () => {
      if (!isOnStoryPage() || isActive) return;
      initSeekbar();
      if (!isActive && initRetryCount < 10) {
        initRetryCount++;
        initRetryTimer = setTimeout(tryInit, 500);
      }
    };
    initRetryCount = 0;
    initRetryTimer = setTimeout(tryInit, 500);
  }

  console.log('✅ Custom seekbar (Auto-Hide Time) đã cài đặt!');
})();