// ==UserScript==
// @name         WeRead Zen Mode
// @name:zh-CN   微信阅读禅模式
// @description:zh-CN  按四次a/点击Zen按钮，开启/关闭禅模式
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Toggle zen mode on WeRead by pressing 'a' three times
// @author       Van
// @match        https://weread.qq.com/web/reader/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/552443/WeRead%20Zen%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/552443/WeRead%20Zen%20Mode.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 计数器和状态
  let zCount = 0;
  let zenModeActive = false;
  let originalDisplayStates = {}; // 存储原始display状态

  // 查找目标元素
  function findTargetElement() {
    return document.querySelector('.reader_float_review_with_range_panel_wrapper');
  }

  // 隐藏指定的元素 - 带淡出效果
  function hideSpecificElements() {
    // 要隐藏的元素选择器
    const elementsToHide = [
      '.readerTopBar',
      '.readerControls.readerControls' // 注意：这个选择器可能需要根据实际HTML结构调整
    ];

    elementsToHide.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        // 保存原始display和opacity状态
        originalDisplayStates[element] = {
          display: element.style.display,
          opacity: element.style.opacity,
          transition: element.style.transition
        };

        // 设置淡出过渡
        element.style.transition = 'opacity 0.3s ease-in-out';
        element.style.opacity = '0';

        // 在过渡结束后隐藏元素
        setTimeout(() => {
          element.style.display = 'none';
        }, 300);
      });
    });
  }

  // 显示指定的元素 - 带淡入效果
  function showSpecificElements() {
    // 要显示的元素选择器
    const elementsToShow = [
      '.readerTopBar',
      '.readerControls.readerControls'
    ];

    elementsToShow.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (originalDisplayStates.hasOwnProperty(element)) {
          // 设置为可见但透明
          element.style.display = originalDisplayStates[element].display || '';
          element.style.opacity = '0';
          element.style.transition = 'opacity 0.3s ease-in-out';

          // 触发重排后设置不透明度
          element.offsetHeight; // force reflow
          element.style.opacity = '1';

          // 恢复原始过渡设置
          setTimeout(() => {
            element.style.transition = originalDisplayStates[element].transition || '';
          }, 300);
        }
      });
    });

    // 清空存储的状态
    originalDisplayStates = {};
  }

  // 切换zen模式
  function toggleZenMode() {
    if (zenModeActive) {
      // 退出zen模式
      showSpecificElements();
      zenModeActive = false;
      showNotification('退出 Zen 模式');
      // 更新按钮状态
      updateZenButton();
    } else {
      // 进入zen模式
      hideSpecificElements();
      zenModeActive = true;
      showNotification('进入 Zen 模式');
      // 更新按钮状态
      updateZenButton();
    }
  }

  // 显示通知弹窗
  function showNotification(message) {
    // 检查是否已存在通知
    const existingNotification = document.getElementById('wz-zen-notification');
    if (existingNotification) {
      // 如果存在，移除旧的
      existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.id = 'wz-zen-notification';
    notification.textContent = message;
    notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px 30px;
                border-radius: 8px;
                font-size: 18px;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
            `;

    document.body.appendChild(notification);

    // 触发动画
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 10);

    // 2秒后开始淡出
    setTimeout(() => {
      notification.style.opacity = '0';
      // 0.3秒后完全移除
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 2000); // 2秒显示时间
  }

  // 创建zen模式切换按钮
  function createZenButton() {
    const button = document.createElement('div');
    button.id = 'wz-zen-toggle-button';
    button.innerHTML = ' Zen ';
    button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 60px;
            height: 30px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 15px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0.9;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;

    // 添加悬停效果
    button.addEventListener('mouseenter', function () {
      this.style.opacity = '1';
      this.style.transform = 'scale(1.05)';
      resetButtonAutoHideTimer(); // 重置自动隐藏计时器
    });

    button.addEventListener('mouseleave', function () {
      this.style.opacity = '0.9';
      this.style.transform = 'scale(1)';
    });

    // 点击事件
    button.addEventListener('click', function () {
      toggleZenMode();
      resetButtonAutoHideTimer(); // 重置自动隐藏计时器
    });

    document.body.appendChild(button);
    updateZenButton(); // 初始化按钮状态

    // 设置自动隐藏计时器
    startButtonAutoHideTimer();
  }

  // 更新按钮状态
  function updateZenButton() {
    const button = document.getElementById('wz-zen-toggle-button');
    if (!button) return;

    if (zenModeActive) {
      button.style.backgroundColor = '#28a745'; // 绿色表示激活状态
      button.textContent = ' Zen ';
      button.title = '点击退出 Zen 模式';
    } else {
      button.style.backgroundColor = '#007bff'; // 蓝色表示非激活状态
      button.textContent = ' Zen ';
      button.title = '点击进入 Zen 模式';
    }
  }

  // 等待DOM加载完成并持续检查目标元素
  function waitForTargetElementAndSetup() {
    const targetElement = findTargetElement();
    if (targetElement) {
      setupKeyboardListener();
      // 创建浮动按钮
      if (!document.getElementById('wz-zen-toggle-button')) {
        createZenButton();
      }
      console.log('WeRead Zen Mode: Target element found, keyboard listener set up');
    } else {
      // 如果没找到元素，继续等待
      setTimeout(waitForTargetElementAndSetup, 1000);
    }
  }

  // 设置键盘监听器
  function setupKeyboardListener() {
    // 防止重复添加事件监听器
    if (window.wereadZenModeListenerAdded) {
      return;
    }

    window.wereadZenModeListenerAdded = true;

    // 键盘事件监听 - 使用更全局的事件监听
    document.addEventListener('keydown', function (event) {
      // 检查是否在输入框中，避免在文本输入时触发
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        return;
      }

      if (event.key === 'a' || event.key === 'A') {
        // 阻止默认行为以避免与其他功能冲突
        event.preventDefault();
        zCount++;
        if (zCount === 3) {
          toggleZenMode();
          zCount = 0; // 重置计数器
        }
      } else {
        zCount = 0; // 重置计数器
      }
    }, true); // 使用捕获阶段以确保事件被捕捉
  }

  // 页面加载完成后开始等待目标元素
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      console.log('WeRead Zen Mode: DOM loaded, waiting for target element...');
      waitForTargetElementAndSetup();
    });
  } else {
    console.log('WeRead Zen Mode: Document already loaded, waiting for target element...');
    waitForTargetElementAndSetup();
  }

  // 同时在页面完全加载后也检查
  window.addEventListener('load', function () {
    console.log('WeRead Zen Mode: Window loaded, waiting for target element...');
    waitForTargetElementAndSetup();
  });

  // 自动隐藏计时器变量
  let buttonAutoHideTimer = null;

  // 开始自动隐藏计时器
  function startButtonAutoHideTimer() {
    if (buttonAutoHideTimer) {
      clearTimeout(buttonAutoHideTimer);
    }

    buttonAutoHideTimer = setTimeout(() => {
      hideButtonToEdge();
    }, 3000); // 3秒无操作后自动缩进到边缘
  }

  // 重置自动隐藏计时器
  function resetButtonAutoHideTimer() {
    if (buttonAutoHideTimer) {
      clearTimeout(buttonAutoHideTimer);
    }

    // 恢复按钮到正常位置
    const button = document.getElementById('wz-zen-toggle-button');
    if (button) {
      button.style.right = '20px';
      button.style.transform = 'translateX(0)';
    }

    // 重新开始计时器
    buttonAutoHideTimer = setTimeout(() => {
      hideButtonToEdge();
    }, 3000);
  }

  // 隐藏按钮到边缘
  function hideButtonToEdge() {
    const button = document.getElementById('wz-zen-toggle-button');
    if (button) {
      // 移动到右侧边缘，只显示一半
      button.style.right = '-20px'; // 负值使按钮部分隐藏在右侧边缘
      button.style.transform = 'translateX(0)';
    }
  }

  // 为页面添加全局鼠标移动监听，重置计时器
  function setupGlobalActivityListener() {
    document.addEventListener('mousemove', resetButtonAutoHideTimer);
    document.addEventListener('keydown', resetButtonAutoHideTimer);
    document.addEventListener('click', resetButtonAutoHideTimer);
  }

  // 在适当位置调用全局监听器设置
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupGlobalActivityListener);
  } else {
    setupGlobalActivityListener();
  }

})();