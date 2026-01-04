// ==UserScript==

// @license MIT

// @name     B站视频增强：缩放、旋转、拖拽

// @name:en Bilibili Video Enhancer: Zoom, Rotate, Drag

// @namespace  http://tampermonkey.net/

// @version   1.2

// @description 为B站视频添加缩放、旋转、拖拽移动和还原功能

// @description:en Add zoom, rotate, drag and drop, and restore functions to Bilibili videos

// @author    浮云里的浮云

// @match    https://www.bilibili.com/video/*

// @icon     https://www.bilibili.com/favicon.ico

// @grant    GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/551217/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%A2%9E%E5%BC%BA%EF%BC%9A%E7%BC%A9%E6%94%BE%E3%80%81%E6%97%8B%E8%BD%AC%E3%80%81%E6%8B%96%E6%8B%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/551217/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%A2%9E%E5%BC%BA%EF%BC%9A%E7%BC%A9%E6%94%BE%E3%80%81%E6%97%8B%E8%BD%AC%E3%80%81%E6%8B%96%E6%8B%BD.meta.js
// ==/UserScript==



(function() {

  'use strict';



  // 添加自定义样式

  GM_addStyle(`

    .bili-custom-controls {

      position: relative;

      display: flex;

      align-items: center;

      gap: 12px;

      margin-left: 15px;

      margin-bottom: 4px;

    }



    .bili-control-btn {

      background: rgba(0, 0, 0, 0.5);

      border: none;

      border-radius: 4px;

      color: white;

      cursor: pointer;

      font-size: 14px;

      height: 32px;

      padding: 0 12px;

      display: flex;

      align-items: center;

      transition: all 0.2s ease;

    }



    .bili-control-btn:hover {

      background: rgba(255, 255, 255, 0.2);

    }



    .bili-control-btn i {

      margin-right: 6px;

      font-size: 16px;

    }



    .bili-zoom-controls {

      display: flex;

      align-items: center;

      gap: 6px;

    }



    .bili-zoom-btn {

      width: 32px;

      height: 32px;

      border-radius: 4px;

      background: rgba(0, 0, 0, 0.5);

      color: white;

      border: none;

      font-size: 18px;

      cursor: pointer;

      display: flex;

      align-items: center;

      justify-content: center;

    }



    .bili-zoom-display {

      min-width: 50px;

      text-align: center;

      font-size: 14px;

      color: white;

    }



    .bili-rotate-btn {

      position: relative;

    }

    .resetBtn {

       position: relative;

    }

    .resetBtn .bili-rotate-indicator {

      position: absolute;

      top: -5px;

      right: -5px;

      background: #ff4e4e;

      color: white;

      border-radius: 50%;

      width: 18px;

      height: 18px;

      font-size: 10px;

      display: flex;

      align-items: center;

      justify-content: center;

    }



    .bpx-player-container .bpx-player-video-wrap {

      transition: transform 0.3s ease;

      transform-origin: center center;

      cursor: grab;

    }



    .bpx-player-container .bpx-player-video-wrap:active {

      cursor: grabbing;

    }

  `);



  // 创建控制按钮

  function createControlButtons() {

    const controlsContainer = document.querySelector('.bpx-player-control-bottom-center');

    if (!controlsContainer || document.getElementById('biliCustomControls')) return;



    // 创建自定义控制容器

    const customControls = document.createElement('div');

    customControls.id = 'biliCustomControls';

    customControls.className = 'bili-custom-controls';



    // 缩放控制

    const zoomContainer = document.createElement('div');

    zoomContainer.className = 'bili-zoom-controls';



    const zoomOutBtn = document.createElement('button');

    zoomOutBtn.className = 'bili-zoom-btn';

    zoomOutBtn.innerHTML = '−';

    zoomOutBtn.title = '缩小视频';



    const zoomDisplay = document.createElement('div');

    zoomDisplay.className = 'bili-zoom-display';

    zoomDisplay.textContent = '100%';



    const zoomInBtn = document.createElement('button');

    zoomInBtn.className = 'bili-zoom-btn';

    zoomInBtn.innerHTML = '+';

    zoomInBtn.title = '放大视频';



    zoomContainer.appendChild(zoomOutBtn);

    zoomContainer.appendChild(zoomDisplay);

    zoomContainer.appendChild(zoomInBtn);



    // 旋转控制

    const rotateLeftBtn = document.createElement('button');

    rotateLeftBtn.className = 'bili-control-btn';

    rotateLeftBtn.innerHTML = '↺';

    rotateLeftBtn.title = '向左旋转90°';



    const rotateRightBtn = document.createElement('button');

    rotateRightBtn.className = 'bili-control-btn';

    rotateRightBtn.innerHTML = '↻';

    rotateRightBtn.title = '向右旋转90°';



    const rotateIndicator = document.createElement('div');

    rotateIndicator.className = 'bili-rotate-indicator';

    rotateIndicator.textContent = '0°';





    // 还原按钮

    const resetBtn = document.createElement('button');

    resetBtn.className = 'bili-control-btn resetBtn';

    resetBtn.innerHTML = '还原';

    resetBtn.title = '还原视频到初始状态';

    resetBtn.style.background = 'rgba(255, 50, 50, 0.6)';



    resetBtn.appendChild(rotateIndicator);



    // 添加到容器

    customControls.appendChild(zoomContainer);

    customControls.appendChild(rotateLeftBtn);

    customControls.appendChild(rotateRightBtn);

    customControls.appendChild(resetBtn);



    // 插入到控制栏

    controlsContainer.insertBefore(customControls, controlsContainer.firstChild);



    // 状态变量

    let zoomLevel = 100;

    let rotation = 0;

    let offsetX = 0;

    let offsetY = 0;

    let isDragging = false;

    let startX, startY;



    // 获取视频元素

    const videoContainer = document.querySelector('.bpx-player-video-wrap');

    if (!videoContainer) return;



    // 应用变换

    function applyTransform() {

      videoContainer.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoomLevel/100}) rotate(${rotation}deg)`;

      videoContainer.style.transformOrigin = 'center center';

      zoomDisplay.textContent = `${zoomLevel}%`;

      rotateIndicator.textContent = `${rotation}°`;

    }



    // 初始应用

    applyTransform();



    // 缩放按钮事件

    zoomOutBtn.addEventListener('click', () => {

      if (zoomLevel > 50) {

        zoomLevel -= 10;

        applyTransform();

      }

    });



    zoomInBtn.addEventListener('click', () => {

      if (zoomLevel < 200) {

        zoomLevel += 10;

        applyTransform();

      }

    });



    // 旋转按钮事件

    rotateLeftBtn.addEventListener('click', () => {

      rotation = (rotation - 90) % 360;

      applyTransform();

    });



    rotateRightBtn.addEventListener('click', () => {

      rotation = (rotation + 90) % 360;

      applyTransform();

    });



    // 还原按钮事件

    resetBtn.addEventListener('click', () => {

      zoomLevel = 100;

      rotation = 0;

      offsetX = 0;

      offsetY = 0;

      applyTransform();

    });



    // 拖拽功能

    videoContainer.addEventListener('mousedown', (e) => {

      if (zoomLevel <= 100) return;



      isDragging = true;

      startX = e.clientX - offsetX;

      startY = e.clientY - offsetY;

      videoContainer.style.cursor = 'grabbing';

    });



    document.addEventListener('mousemove', (e) => {

      if (!isDragging) return;



      offsetX = e.clientX - startX;

      offsetY = e.clientY - startY;

      applyTransform();

    });



    document.addEventListener('mouseup', () => {

      isDragging = false;

      videoContainer.style.cursor = zoomLevel > 100 ? 'grab' : 'default';

    });



    // 添加键盘快捷键

    document.addEventListener('keydown', (e) => {

      // 忽略输入框中的按键

      if (document.activeElement.tagName === 'INPUT') return;



      // Ctrl+空格键切换全屏

  if (e.ctrlKey && e.code === 'Space') {

    e.preventDefault();

    // 获取全屏按钮

      const fullscreenBtn = document.querySelector('.bpx-player-ctrl-full');

       fullscreenBtn.click();



   /**

    // 检查当前是否全屏

    const isFullscreen = document.fullscreenElement ||

              document.webkitFullscreenElement ||

              document.mozFullScreenElement ||

              document.msFullscreenElement;



    // 检查是否是网页全屏模式

    const isWebFullscreen = document.querySelector('.bpx-player-web-full');



    // 仅在非全屏状态下执行操作

    if (!isFullscreen && !isWebFullscreen) {

      // 获取全屏按钮

      const fullscreenBtn = document.querySelector('.bpx-player-ctrl-full');

      if (fullscreenBtn) {

        fullscreenBtn.click();

      }

    }

    */

  }



      // Ctrl+加号/减号 缩放

      if (e.ctrlKey && (e.key === '+' || e.key === '=' || e.keyCode == '38')) {

        e.preventDefault();

        zoomInBtn.click();

      } else if (e.ctrlKey && (e.key === '-'|| e.keyCode == '40')) {

        e.preventDefault();

        zoomOutBtn.click();

      }

      // Ctrl+L/左箭头 旋转

      if (e.ctrlKey && (e.key.toLowerCase() === 'l' || e.keyCode == '37')) {

        e.preventDefault();

        rotateLeftBtn.click();

      }

      // Ctrl+R/右箭头 旋转

      if (e.ctrlKey && (e.key.toLowerCase() === 'r' || e.keyCode == '39')) {

        e.preventDefault();

        rotateRightBtn.click();

      }



      // Ctrl+0 还原

      if (e.ctrlKey && e.key === '0') {

        e.preventDefault();

        resetBtn.click();

      }

    });

  }



  // 初始化并监听播放器加载

  function init() {

    createControlButtons();



    // 监听播放器变化（针对SPA页面）

    const observer = new MutationObserver(() => {

      createControlButtons();

    });



    observer.observe(document.body, {

      childList: true,

      subtree: true

    });

  }



  // 页面加载完成后初始化

  if (document.readyState === 'complete') {

    init();

  } else {

    window.addEventListener('load', init);

  }

})();