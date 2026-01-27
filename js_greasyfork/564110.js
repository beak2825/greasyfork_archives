// ==UserScript==
// @name         Koishi Forum Discourse Reacter
// @namespace    https://github.com/shangxueink
// @version      0.5.1
// @description  长按爱心按钮为 Koishi 论坛的当前帖子所有可点赞内容点赞，松开停止
// @author       shangxueink
// @license      MIT
// @match        https://forum.koishi.xyz/*
// @icon         https://koishi.chat/logo.png
// @grant        none
// @homepageURL  https://github.com/koakuuma/tampermonkey-scripts
// @supportURL   https://github.com/koakuuma/tampermonkey-scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/564110/Koishi%20Forum%20Discourse%20Reacter.user.js
// @updateURL https://update.greasyfork.org/scripts/564110/Koishi%20Forum%20Discourse%20Reacter.meta.js
// ==/UserScript==
/******/ (() => { // webpackBootstrap
// Koishi Forum Discourse Reacter
// 长按爱心按钮为当前帖子所有可点赞内容点赞

(function () {
  'use strict';

  // 状态变量
  let isLongPressing = false;
  let longPressTimer = null;
  let reactInterval = null;
  let heartButton = null;
  let heartPath = null;

  // 长按触发时间（毫秒）
  const LONG_PRESS_DURATION = 500;
  // 点赞间隔时间（毫秒）
  const REACT_INTERVAL = 300;

  // 创建样式
  const style = document.createElement('style');
  style.textContent = `
        .koishi-heart-button-container {
            position: relative;
            display: inline-block;
        }
        
        .koishi-heart-button {
            cursor: pointer;
            user-select: none;
            transition: transform 0.2s ease;
            background: none;
            border: none;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .koishi-heart-button:hover {
            transform: scale(1.1);
        }
        
        .koishi-heart-button:active {
            transform: scale(0.95);
        }
        
        .koishi-heart-svg {
            width: 24px;
            height: 24px;
            stroke: currentColor;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            transition: transform 0.3s ease;
        }
        
        .koishi-heart-path {
            fill: none;
            transition: fill 0.3s ease;
        }
        
        .koishi-heart-path.filled {
            fill: #ff6b6b;
            stroke: #ff6b6b;
        }
        
        .koishi-heart-svg.beat {
            animation: heartbeat 0.3s ease-in-out;
        }
        
        @keyframes heartbeat {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
        }
    `;
  document.head.appendChild(style);

  // 显示实心爱心并触发跳动动画
  function showFilledHeart() {
    var _heartButton;
    if (heartPath) {
      heartPath.classList.add('filled');
    }

    // 触发跳动动画
    const heartSvg = (_heartButton = heartButton) === null || _heartButton === void 0 ? void 0 : _heartButton.querySelector('.koishi-heart-svg');
    if (heartSvg) {
      heartSvg.classList.add('beat');
      // 动画结束后移除类
      setTimeout(() => {
        heartSvg.classList.remove('beat');
      }, 300);
    }
  }

  // 显示空心爱心
  function showEmptyHeart() {
    if (heartPath) {
      heartPath.classList.remove('filled');
    }
  }

  // 执行点赞操作
  function reactToPosts() {
    if (!window.location.href.startsWith('https://forum.koishi.xyz/t/topic/')) {
      return;
    }
    try {
      // 查找所有未点赞的点赞按钮
      const postControls = document.querySelectorAll('nav.post-controls.collapsed');
      postControls.forEach(control => {
        const reactionButton = control.querySelector('.discourse-reactions-actions:not(.has-reacted) .btn-toggle-reaction-like:not([title="请注册或登录以点赞此帖子"])');
        if (reactionButton) {
          console.log('[Koishi Reacter] 点赞帖子');
          reactionButton.click();
        }
      });
    } catch (error) {
      console.error('[Koishi Reacter] 点赞过程中出错:', error);
    }
  }

  // 开始长按点赞
  function startLongPress() {
    if (isLongPressing) {
      return;
    }
    isLongPressing = true;
    showFilledHeart();

    // 立即执行一次点赞
    reactToPosts();

    // 设置定时器持续点赞
    reactInterval = window.setInterval(() => {
      reactToPosts();
    }, REACT_INTERVAL);
    console.log('[Koishi Reacter] 开始长按点赞');
  }

  // 停止长按点赞
  function stopLongPress() {
    if (!isLongPressing) {
      return;
    }
    isLongPressing = false;
    showEmptyHeart();
    if (reactInterval !== null) {
      clearInterval(reactInterval);
      reactInterval = null;
    }
    console.log('[Koishi Reacter] 停止长按点赞');
  }

  // 处理单击事件
  function handleClick(event) {
    // 如果是长按触发的，不执行单击操作
    if (isLongPressing || longPressTimer !== null) {
      return;
    }

    // 单击跳转到未读帖子页面
    window.location.href = 'https://forum.koishi.xyz/search?q=in%3Aunseen%20order%3Alatest';
  }

  // 处理鼠标按下事件
  function handleMouseDown(event) {
    event.preventDefault();

    // 清除之前的定时器
    if (longPressTimer !== null) {
      clearTimeout(longPressTimer);
    }

    // 设置长按定时器
    longPressTimer = window.setTimeout(() => {
      startLongPress();
      longPressTimer = null;
    }, LONG_PRESS_DURATION);
  }

  // 处理鼠标松开事件
  function handleMouseUp(event) {
    // 如果是长按状态，停止点赞
    if (isLongPressing) {
      stopLongPress();
      event.preventDefault();
      return;
    }

    // 清除长按定时器
    if (longPressTimer !== null) {
      clearTimeout(longPressTimer);
      longPressTimer = null;

      // 如果没有触发长按，执行单击操作
      handleClick(event);
    }
  }

  // 处理触摸开始事件（移动端）
  function handleTouchStart(event) {
    event.preventDefault();
    if (longPressTimer !== null) {
      clearTimeout(longPressTimer);
    }
    longPressTimer = window.setTimeout(() => {
      startLongPress();
      longPressTimer = null;
    }, LONG_PRESS_DURATION);
  }

  // 处理触摸结束事件（移动端）
  function handleTouchEnd(event) {
    // 如果是长按状态，停止点赞
    if (isLongPressing) {
      stopLongPress();
      event.preventDefault();
      return;
    }

    // 清除长按定时器
    if (longPressTimer !== null) {
      clearTimeout(longPressTimer);
      longPressTimer = null;

      // 如果没有触发长按，执行单击操作（跳转）
      window.location.href = 'https://forum.koishi.xyz/search?q=in%3Aunseen%20order%3Alatest';
    }
  }

  // 添加爱心按钮到页面
  function addHeartButton() {
    const headerButtons = document.querySelector('.icons.d-header-icons');
    if (!headerButtons) {
      console.warn('[Koishi Reacter] 未找到页面头部按钮区域');
      return;
    }

    // 检查是否已经添加过按钮
    if (document.getElementById('koishi-reacter-heart-button')) {
      return;
    }
    const buttonContainer = document.createElement('li');
    buttonContainer.innerHTML = `
            <div class="koishi-heart-button-container">
                <button class="btn no-text btn-icon icon btn-flat koishi-heart-button" 
                        id="koishi-reacter-heart-button" 
                        title="单击：打开未读帖子 | 长按：为当前帖子所有内容点赞" 
                        aria-label="点赞按钮" 
                        type="button">
                    <svg class="koishi-heart-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path class="koishi-heart-path" fill-rule="evenodd" clip-rule="evenodd" d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"/>
                    </svg>
                </button>
            </div>
        `;
    headerButtons.insertBefore(buttonContainer, headerButtons.firstChild);

    // 获取按钮元素和爱心路径
    heartButton = document.getElementById('koishi-reacter-heart-button');
    heartPath = buttonContainer.querySelector('.koishi-heart-path');
    if (heartButton) {
      // 添加鼠标事件监听器
      heartButton.addEventListener('mousedown', handleMouseDown);
      heartButton.addEventListener('mouseup', handleMouseUp);
      heartButton.addEventListener('mouseleave', handleMouseUp);

      // 添加触摸事件监听器（移动端）
      heartButton.addEventListener('touchstart', handleTouchStart, {
        passive: false
      });
      heartButton.addEventListener('touchend', handleTouchEnd);
      heartButton.addEventListener('touchcancel', handleTouchEnd);
      console.log('[Koishi Reacter] 爱心按钮已添加');
    }
  }

  // 初始化
  function init() {
    // 等待页面加载完成后添加按钮
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addHeartButton);
    } else {
      addHeartButton();
    }

    // 使用 MutationObserver 监听页面变化，确保按钮始终存在
    const observer = new MutationObserver(() => {
      if (!document.getElementById('koishi-reacter-heart-button')) {
        addHeartButton();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    console.log('[Koishi Reacter] 脚本已初始化');
  }

  // 启动脚本
  init();
})();
/******/ })()
;