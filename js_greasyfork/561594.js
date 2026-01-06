// ==UserScript==
// @name         视频控制工具
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  手机端视频专用：快进快退按钮与时间显示，完全嵌入视频画面
// @author       ongt
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561594/%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/561594/%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- 核心环境检测 ---
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent);
  }

  if (!isMobileDevice()) {
    console.log("【视频控制工具】检测到桌面环境，脚本已自动禁用。");
    return;
  }

  // ================= 脚本配置区 =================
  const CONFIG = {
    buttons: [
      { text: "-3m", seconds: -180 },
      { text: "-1m", seconds: -60 },
      { text: "-10s", seconds: -10 },
      { text: "+10s", seconds: 10 },
      { text: "+1m", seconds: 60 },
      { text: "+3m", seconds: 180 }
    ],
    textColor: 'rgba(255, 255, 255, 1)',
    autoHideDelay: 5000
  };

  // ================= 状态管理 =================
  let controller = null;
  let hideTimer = null;
  let isVisible = false;
  
  // 拖拽相关状态
  let isDragging = false;
  let hasMovedByUser = false; // 标记用户是否手动移动过
  let dragStartX = 0;
  let dragStartY = 0;
  let initialLeft = 0;
  let initialTop = 0;
  
  // ================= 主逻辑 =================

  function createController() {
    if (controller) return;

    controller = document.createElement("div");
    controller.id = "video-embedded-controller";
    
    // 容器样式
    controller.style.cssText = `
      position: fixed;
      bottom: 15%; 
      left: 50%;
      transform: translateX(-50%);
      background: transparent;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3px; 
      z-index: 2147483647;
      width: auto; 
      max-width: 98%;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: auto; /* 允许捕获拖拽事件 */
      user-select: none;
      -webkit-user-select: none;
      white-space: nowrap;
      touch-action: none; /* 防止拖拽时触发页面滚动 */
    `;

    // --- 绑定拖拽事件 (绑定在主容器上) ---
    controller.addEventListener('touchstart', handleDragStart, { passive: false });
    controller.addEventListener('touchmove', handleDragMove, { passive: false });
    controller.addEventListener('touchend', handleDragEnd);

    // 循环创建按钮
    CONFIG.buttons.forEach(btnConfig => {
      const btn = createCompactButton(btnConfig.text, () => adjustVideoTime(btnConfig.seconds));
      controller.appendChild(btn);
    });

    // 初始插入
    insertControllerToBestPosition();

    // 监听环境变化
    document.addEventListener("fullscreenchange", insertControllerToBestPosition);
    document.addEventListener("webkitfullscreenchange", insertControllerToBestPosition);
    window.addEventListener("orientationchange", insertControllerToBestPosition);
  }

  // --- 拖拽处理逻辑 ---
  function handleDragStart(e) {
      // 记录起始点
      const touch = e.touches[0];
      dragStartX = touch.clientX;
      dragStartY = touch.clientY;
      isDragging = false; // 重置拖拽状态

      // 获取当前实际位置，将其“冻结”为绝对定位，方便移动
      const rect = controller.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      // 切换定位模式 (移除 transform 和 bottom，改为 left/top)
      controller.style.transform = 'none';
      controller.style.bottom = 'auto';
      controller.style.left = `${initialLeft}px`;
      controller.style.top = `${initialTop}px`;
      
      // 暂时取消过渡效果，让拖拽更跟手
      controller.style.transition = 'opacity 0.2s ease'; 
  }

  function handleDragMove(e) {
      const touch = e.touches[0];
      const dx = touch.clientX - dragStartX;
      const dy = touch.clientY - dragStartY;

      // 只有移动超过一定距离才算拖拽（防止点击时的微小抖动被误判）
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          isDragging = true;
          hasMovedByUser = true; // 标记用户已介入位置控制
          e.preventDefault(); // 阻止页面滚动
          
          controller.style.left = `${initialLeft + dx}px`;
          controller.style.top = `${initialTop + dy}px`;
      }
  }

  function handleDragEnd(e) {
      // 拖拽结束后，恢复可能的过渡效果（如果需要的话）
      // 这里不做额外处理，保留位置
      resetAutoHide();
  }

  // --- 辅助函数：创建按钮 ---
  function createCompactButton(text, onClick) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.style.cssText = `
      padding: 6px 6px;
      border: none;
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.6);
      color: ${CONFIG.textColor};
      font-size: 11px;
      font-weight: 600;
      pointer-events: auto;
      backdrop-filter: blur(2px);
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      min-width: 36px;
      flex: 1;
    `;
    
    // 按钮按下反馈
    btn.addEventListener('touchstart', (e) => {
       // 不阻止冒泡，以便触发容器的 dragStart
       btn.style.background = 'rgba(66, 133, 244, 0.9)'; 
    });
    
    btn.addEventListener('touchend', (e) => {
       // 无论是否触发点击，都恢复颜色
       btn.style.background = 'rgba(0, 0, 0, 0.6)';
       
       // 关键判断：只有当【没有】发生拖拽时，才执行按钮功能
       if (!isDragging) {
           e.stopPropagation(); // 阻止点击穿透
           onClick();
       }
       resetAutoHide();
    });
    
    return btn;
  }

  // --- 智能插入与位置重置 ---
  function insertControllerToBestPosition() {
    if (!controller) return;
    
    const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
    
    // 1. 确保在 DOM 中的位置正确（全屏/非全屏切换）
    if (fsElement) {
        if (fsElement.tagName !== 'VIDEO' && !fsElement.contains(controller)) {
             fsElement.appendChild(controller);
        } else if (fsElement.tagName === 'VIDEO' && fsElement.parentNode) {
             fsElement.parentNode.appendChild(controller);
        }
    } else {
        if (document.body && !document.body.contains(controller)) {
            document.body.appendChild(controller);
        }
    }

    // 2. 位置复位逻辑
    // 如果用户从来没有手动拖拽过 (hasMovedByUser === false)，
    // 我们才根据全屏状态自动调整位置。如果用户拖过了，就留在用户放的地方。
    if (!hasMovedByUser) {
        controller.style.transform = "translateX(-50%)";
        controller.style.left = "50%";
        controller.style.top = "auto";
        if (fsElement) {
            controller.style.bottom = "12%"; 
        } else {
            controller.style.bottom = "15%";
        }
    }
  }

  // --- 控制逻辑 ---
  function adjustVideoTime(seconds) {
    document.querySelectorAll("video").forEach(v => {
        v.currentTime = Math.max(0, Math.min(v.currentTime + seconds, v.duration || Infinity));
    });
  }

  // --- 显隐控制 ---
  function showController() {
    if (!controller) createController();
    isVisible = true;
    controller.style.opacity = "1";
    insertControllerToBestPosition();
    resetAutoHide();
  }

  function hideController() {
    if (!controller || isDragging) return; // 拖拽中不隐藏
    isVisible = false;
    controller.style.opacity = "0";
    if (hideTimer) clearTimeout(hideTimer);
  }

  function toggleController(e) {
    // 忽略控制器内部的点击（由 drag 逻辑处理）
    if (controller && controller.contains(e.target)) return;
    if (['INPUT', 'SELECT', 'BUTTON'].includes(e.target.tagName)) return;
    
    if (isVisible) hideController();
    else showController();
  }

  function resetAutoHide() {
    if (hideTimer) clearTimeout(hideTimer);
    if (isVisible) {
      hideTimer = setTimeout(hideController, CONFIG.autoHideDelay);
    }
  }

  // --- 初始化 ---
  function init() {
    document.addEventListener('click', (e) => {
        if (document.querySelector('video')) toggleController(e);
    });
    
    const observer = new MutationObserver(() => {
       if (controller && !document.body.contains(controller) && !document.fullscreenElement) {
         document.body.appendChild(controller);
       }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();