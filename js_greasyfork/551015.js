// ==UserScript==
// @name         湖北智慧教育平台自动播放列表 + 倍速 + 修正
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动顺序播放视频，支持静音和最高16倍速，带悬浮控制面板，避免死循环，解放双手！
// @author       Luffy One
// @license      MIT
// @match        https://*.basic.hubei.smartedu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smartedu.cn
// @grant        none
// @run-at       document-idle
// @homepageURL  https://greasyfork.org/zh-CN/scripts
// @supportURL   https://greasyfork.org/zh-CN/scripts
// @noframes
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   safari
// @tag          自动播放
// @tag          倍速播放
// @tag          智慧教育
// @downloadURL https://update.greasyfork.org/scripts/551015/%E6%B9%96%E5%8C%97%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E5%88%97%E8%A1%A8%20%2B%20%E5%80%8D%E9%80%9F%20%2B%20%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/551015/%E6%B9%96%E5%8C%97%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E5%88%97%E8%A1%A8%20%2B%20%E5%80%8D%E9%80%9F%20%2B%20%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 创建控制面板
  function createControlPanel() {
    const panel = document.createElement('div');
    panel.id = 'smart-edu-control-panel';
    panel.innerHTML = `
      <div class="control-header">
        <span>智慧教育控制面板</span>
        <button class="close-btn">×</button>
      </div>
      <div class="control-body">
        <div class="control-group">
          <label class="switch">
            <input type="checkbox" id="autoPlaySwitch" checked>
            <span class="slider"></span>
          </label>
          <span class="control-label">自动播放</span>
        </div>
        <div class="control-group">
          <label class="switch">
            <input type="checkbox" id="muteSwitch" checked>
            <span class="slider"></span>
          </label>
          <span class="control-label">静音播放</span>
        </div>
        <div class="control-group">
          <label for="speedControl">播放速度:</label>
          <select id="speedControl">
            <option value="1">1x</option>
            <option value="2">2x</option>
            <option value="4">4x</option>
            <option value="8">8x</option>
            <option value="16" selected>16x</option>
          </select>
        </div>
        <div class="control-group">
          <button id="resetBtn" class="action-btn">重置进度</button>
          <button id="dragBtn" class="drag-handle">≡</button>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      #smart-edu-control-panel {
        position: fixed;
        top: 100px;
        right: 20px;
        width: 250px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        color: white;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        z-index: 10000;
        user-select: none;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
      }

      .control-header {
        background: rgba(0,0,0,0.2);
        padding: 12px 15px;
        border-radius: 12px 12px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        font-size: 14px;
      }

      .close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .close-btn:hover {
        background: rgba(255,255,255,0.2);
      }

      .control-body {
        padding: 15px;
      }

      .control-group {
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .control-label {
        font-size: 14px;
        margin-left: 10px;
      }

      /* 开关样式 */
      .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
      }

      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 24px;
      }

      .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }

      input:checked + .slider {
        background-color: #4CAF50;
      }

      input:checked + .slider:before {
        transform: translateX(26px);
      }

      /* 下拉选择框样式 */
      #speedControl {
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 6px;
        color: white;
        padding: 5px 10px;
        font-size: 14px;
      }

      #speedControl option {
        background: #667eea;
        color: white;
      }

      /* 按钮样式 */
      .action-btn {
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 6px;
        color: white;
        padding: 8px 12px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .action-btn:hover {
        background: rgba(255,255,255,0.3);
        transform: translateY(-1px);
      }

      .drag-handle {
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 4px;
        color: white;
        cursor: move;
        padding: 5px;
        font-size: 14px;
      }
    `;
    document.head.appendChild(style);

    return panel;
  }

  // 初始化控制面板
  function initControlPanel() {
    const panel = createControlPanel();
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    // 获取或初始化设置
    const getSetting = (key, defaultValue) => {
      const value = localStorage.getItem(`smartEdu_${key}`);
      return value !== null ? JSON.parse(value) : defaultValue;
    };

    const setSetting = (key, value) => {
      localStorage.setItem(`smartEdu_${key}`, JSON.stringify(value));
    };

    // 初始化开关状态
    const autoPlaySwitch = document.getElementById('autoPlaySwitch');
    const muteSwitch = document.getElementById('muteSwitch');
    const speedControl = document.getElementById('speedControl');

    autoPlaySwitch.checked = getSetting('autoPlay', true);
    muteSwitch.checked = getSetting('muted', true);
    speedControl.value = getSetting('speed', 16);

    // 开关事件处理
    autoPlaySwitch.addEventListener('change', function() {
      setSetting('autoPlay', this.checked);
      log(`自动播放 ${this.checked ? '开启' : '关闭'}`);
    });

    muteSwitch.addEventListener('change', function() {
      setSetting('muted', this.checked);
      const video = document.querySelector('#vjs_video_1_html5_api');
      if (video) {
        video.muted = this.checked;
      }
      log(`静音 ${this.checked ? '开启' : '关闭'}`);
    });

    speedControl.addEventListener('change', function() {
      const speed = parseFloat(this.value);
      setSetting('speed', speed);
      const video = document.querySelector('#vjs_video_1_html5_api');
      if (video) {
        video.playbackRate = speed;
      }
      log(`播放速度设置为: ${speed}x`);
    });

    // 重置按钮
    document.getElementById('resetBtn').addEventListener('click', function() {
      localStorage.removeItem('autoPlayIndex');
      log('播放进度已重置');
      alert('播放进度已重置，将从第一个视频开始播放');
    });

    // 关闭按钮
    document.querySelector('.close-btn').addEventListener('click', function() {
      panel.style.display = 'none';
    });

    // 拖动功能
    const dragHandle = document.getElementById('dragBtn');
    dragHandle.addEventListener('mousedown', startDrag);

    function startDrag(e) {
      isDragging = true;
      const rect = panel.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', stopDrag);
    }

    function onDrag(e) {
      if (!isDragging) return;
      panel.style.left = (e.clientX - dragOffset.x) + 'px';
      panel.style.top = (e.clientY - dragOffset.y) + 'px';
      panel.style.right = 'auto';
    }

    function stopDrag() {
      isDragging = false;
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDrag);
    }

    return {
      isAutoPlayEnabled: () => getSetting('autoPlay', true),
      isMuted: () => getSetting('muted', true),
      getSpeed: () => getSetting('speed', 16)
    };
  }

  // 主逻辑
  setTimeout(() => {
    const AUTO_PLAY_KEY = 'autoPlayIndex';
    let index = parseInt(localStorage.getItem(AUTO_PLAY_KEY) || '0');

    function log(msg) {
      console.log(`[智慧教育脚本] ${msg}`);
    }

    // 初始化控制面板
    const controls = initControlPanel();

    const video = document.querySelector('#vjs_video_1_html5_api');
    const list = document.querySelectorAll('.index-module_catalog-resource_nuJax');
    const testdom = document.getElementsByClassName('vjs-poster');

    // 视频播放页面
    if (video) {
      // 应用设置
      video.playbackRate = controls.getSpeed();
      video.muted = controls.isMuted();

      if (testdom.length > 0) {
        testdom[0].click();
      }

      // 只在自动播放开启时添加事件监听
      if (controls.isAutoPlayEnabled()) {
        video.addEventListener('ended', handleVideoEnded);
      }

      function handleVideoEnded() {
        if (!controls.isAutoPlayEnabled()) {
          return; // 如果自动播放被关闭，不执行任何操作
        }

        let index = parseInt(localStorage.getItem(AUTO_PLAY_KEY) || '0');
        index++; // 下一条视频

        if (index >= list.length) {
          alert('所有视频已播放完成');
          localStorage.removeItem(AUTO_PLAY_KEY);
          return;
        }

        localStorage.setItem(AUTO_PLAY_KEY, index);
        log(`视频播放完毕，准备播放下一个视频 (索引 ${index})`);

        setTimeout(() => {
          if (list[index]) {
            list[index].click();
          }
        }, 500);
      }

      log('视频页面初始化完成');
      return;
    }

    log('控制面板初始化完成');
  }, 4000);
})();