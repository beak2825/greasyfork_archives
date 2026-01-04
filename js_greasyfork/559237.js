// ==UserScript==
// @name         全网视频倍速控制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  支持所有网站的视频倍速播放控制，可锁定速度防止网站重置
// @author       GQLJ
// @license      MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559237/%E5%85%A8%E7%BD%91%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/559237/%E5%85%A8%E7%BD%91%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==

  (function() {
      'use strict';

      // ==================== 配置 ====================
      const CONFIG = {
          MIN_SPEED: 0.25,
          MAX_SPEED: 5,
          STEP: 0.25,
          DEFAULT_SPEED: 1,
          QUICK_BUTTONS: [0.5, 1, 1.5, 2, 3],
          STORAGE_KEY: 'videoSpeedControl_',
          CHECK_INTERVAL: 1000,
          DEBOUNCE_DELAY: 100
      };

      // ==================== 状态 ====================
      const hostname = location.hostname;
      let currentSpeed = GM_getValue(CONFIG.STORAGE_KEY + hostname + '_speed', CONFIG.DEFAULT_SPEED);
      let isLocked = GM_getValue(CONFIG.STORAGE_KEY + hostname + '_locked', false);
      let isCollapsed = GM_getValue(CONFIG.STORAGE_KEY + 'collapsed', false);
      let panelPosition = GM_getValue(CONFIG.STORAGE_KEY + 'position', { right: 20, top: 100 });
      let checkInterval = null;
      let videos = [];

      // ==================== 工具函数 ====================

      function fixPrecision(num) {
          return Math.round(num * 100) / 100;
      }

      function debounce(fn, delay) {
          let timer = null;
          return function(...args) {
              clearTimeout(timer);
              timer = setTimeout(() => fn.apply(this, args), delay);
          };
      }

      function showToast(message) {
          const existingToast = document.getElementById('speed-toast');
          if (existingToast) existingToast.remove();

          const toast = document.createElement('div');
          toast.id = 'speed-toast';
          toast.textContent = message;
          toast.style.cssText = `
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: rgba(0, 0, 0, 0.8);
              color: #fff;
              padding: 12px 24px;
              border-radius: 8px;
              font-size: 18px;
              font-weight: bold;
              z-index: 2147483647;
              pointer-events: none;
              animation: toastFade 1.5s ease-in-out forwards;
              font-family: Arial, sans-serif;
          `;
          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 1500);
      }

      // ==================== 核心功能 ====================

      function applySpeedToAll(showTip = false) {
          videos = document.querySelectorAll('video');
          videos.forEach(video => {
              try {
                  if (video.playbackRate !== currentSpeed) {
                      video.playbackRate = currentSpeed;
                  }
              } catch (e) {
                  console.warn('[倍速控制] 设置速度失败:', e);
              }
          });
          if (showTip && videos.length > 0) {
              showToast(`${currentSpeed}x`);
          }
      }

      function setSpeed(speed, showTip = true, saveToStorage = true) {
          currentSpeed = fixPrecision(Math.max(CONFIG.MIN_SPEED, Math.min(CONFIG.MAX_SPEED, speed)));
          if (saveToStorage) {
              GM_setValue(CONFIG.STORAGE_KEY + hostname + '_speed', currentSpeed);
          }
          applySpeedToAll(showTip);
          updateUI();
          updateCheckInterval();
      }

      // 同步网站速度到面板（不保存、不提示）
      function syncSpeedFromVideo(speed) {
          if (isLocked) return; // 锁定模式不同步
          const fixedSpeed = fixPrecision(speed);
          if (fixedSpeed >= CONFIG.MIN_SPEED && fixedSpeed <= CONFIG.MAX_SPEED && fixedSpeed !== currentSpeed) {
              currentSpeed = fixedSpeed;
              updateUI();
          }
      }

      function toggleLock(locked) {
          isLocked = locked;
          GM_setValue(CONFIG.STORAGE_KEY + hostname + '_locked', isLocked);
          updateCheckInterval();

          if (isLocked) {
              applySpeedToAll();
              showToast(`🔒 锁定 ${currentSpeed}x`);
          } else {
              showToast(`🔓 跟随网站`);
          }
      }

      function updateCheckInterval() {
          if (checkInterval) {
              clearInterval(checkInterval);
              checkInterval = null;
          }

          if (isLocked && document.querySelectorAll('video').length > 0) {
              checkInterval = setInterval(() => {
                  const currentVideos = document.querySelectorAll('video');
                  if (currentVideos.length === 0) {
                      clearInterval(checkInterval);
                      checkInterval = null;
                      return;
                  }
                  applySpeedToAll();
              }, CONFIG.CHECK_INTERVAL);
          }
      }

      function setupVideoListeners(video) {
          if (video._speedControlSetup) return;
          video._speedControlSetup = true;

          // 监听速度变化
          video.addEventListener('ratechange', () => {
              if (isLocked) {
                  // 锁定模式：强制恢复
                  if (video.playbackRate !== currentSpeed) {
                      try {
                          video.playbackRate = currentSpeed;
                      } catch (e) {}
                  }
              } else {
                  // 跟随模式：同步到面板
                  syncSpeedFromVideo(video.playbackRate);
              }
          });

          // 初始应用速度
          if (isLocked || currentSpeed !== CONFIG.DEFAULT_SPEED) {
              try {
                  video.playbackRate = currentSpeed;
              } catch (e) {}
          }
      }

      // ==================== UI 相关 ====================

      let panel, miniBtn, slider, speedDisplay, lockBtn, followBtn;

      function createUI() {
          const style = document.createElement('style');
          style.textContent = `
              @keyframes toastFade {
                  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                  15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                  85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                  100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
              }
              #speed-control-panel *, #speed-mini-btn * {
                  box-sizing: border-box;
                  font-family: Arial, sans-serif;
              }
              #speed-control-panel button:hover, #speed-mini-btn:hover {
                  filter: brightness(1.1);
              }
              #speed-control-panel button:active {
                  transform: scale(0.95);
              }
          `;
          (document.head || document.documentElement).appendChild(style);

          // 迷你按钮（折叠时显示）
          miniBtn = document.createElement('div');
          miniBtn.id = 'speed-mini-btn';
          miniBtn.style.cssText = `
              position: fixed;
              right: ${panelPosition.right}px;
              top: ${panelPosition.top}px;
              width: 40px;
              height: 40px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 50%;
              display: ${isCollapsed ? 'flex' : 'none'};
              justify-content: center;
              align-items: center;
              cursor: pointer;
              z-index: 2147483646;
              box-shadow: 0 2px 10px rgba(0,0,0,0.3);
              font-size: 16px;
              transition: transform 0.2s;
          `;
          miniBtn.innerHTML = '⚡';
          miniBtn.title = `当前: ${currentSpeed}x | 点击展开`;

          // 完整面板
          panel = document.createElement('div');
          panel.id = 'speed-control-panel';
          panel.style.cssText = `
              position: fixed;
              right: ${panelPosition.right}px;
              top: ${panelPosition.top}px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 12px;
              padding: 12px;
              z-index: 2147483646;
              box-shadow: 0 4px 20px rgba(0,0,0,0.3);
              user-select: none;
              min-width: 200px;
              color: #fff;
              font-size: 14px;
              display: ${isCollapsed ? 'none' : 'block'};
          `;

          // 标题栏
          const header = document.createElement('div');
          header.id = 'speed-header';
          header.style.cssText = `
              display: flex;
              justify-content: space-between;
              align-items: center;
              cursor: move;
              padding-bottom: 8px;
              border-bottom: 1px solid rgba(255,255,255,0.2);
              margin-bottom: 10px;
          `;
          header.innerHTML = `
              <span style="font-weight: bold;">🎬 倍速控制</span>
              <span id="collapse-btn" style="cursor: pointer; font-size: 14px; padding: 2px 6px; background: rgba(255,255,255,0.2); border-radius: 4px;">收起</span>
          `;
          panel.appendChild(header);

          // 速度显示
          speedDisplay = document.createElement('div');
          speedDisplay.style.cssText = `
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              margin: 10px 0;
          `;
          speedDisplay.textContent = `${currentSpeed}x`;
          panel.appendChild(speedDisplay);

          // 滑块
          slider = document.createElement('input');
          slider.type = 'range';
          slider.min = CONFIG.MIN_SPEED;
          slider.max = CONFIG.MAX_SPEED;
          slider.step = CONFIG.STEP;
          slider.value = currentSpeed;
          slider.style.cssText = `
              width: 100%;
              margin: 10px 0;
              cursor: pointer;
          `;
          panel.appendChild(slider);

          // 快捷按钮
          const quickBtns = document.createElement('div');
          quickBtns.style.cssText = `
              display: flex;
              gap: 5px;
              flex-wrap: wrap;
              justify-content: center;
              margin: 10px 0;
          `;
          CONFIG.QUICK_BUTTONS.forEach(speed => {
              const btn = document.createElement('button');
              btn.textContent = `${speed}x`;
              btn.style.cssText = `
                  padding: 5px 10px;
                  border: none;
                  border-radius: 5px;
                  background: rgba(255,255,255,0.2);
                  color: #fff;
                  cursor: pointer;
                  transition: all 0.2s;
              `;
              btn.onclick = () => setSpeed(speed);
              quickBtns.appendChild(btn);
          });
          panel.appendChild(quickBtns);

          // 模式切换
          const modeDiv = document.createElement('div');
          modeDiv.style.cssText = `
              display: flex;
              gap: 8px;
              margin-top: 10px;
          `;

          followBtn = document.createElement('button');
          followBtn.textContent = '🔓 跟随网站';
          followBtn.style.cssText = `
              flex: 1;
              padding: 8px;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              transition: all 0.2s;
              font-size: 12px;
          `;

          lockBtn = document.createElement('button');
          lockBtn.textContent = '🔒 锁定倍速';
          lockBtn.style.cssText = `
              flex: 1;
              padding: 8px;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              transition: all 0.2s;
              font-size: 12px;
          `;

          modeDiv.appendChild(followBtn);
          modeDiv.appendChild(lockBtn);
          panel.appendChild(modeDiv);

          // 快捷键提示
          const shortcutTip = document.createElement('div');
          shortcutTip.style.cssText = `
              text-align: center;
              font-size: 11px;
              color: rgba(255,255,255,0.7);
              margin-top: 10px;
          `;
          shortcutTip.textContent = '快捷键: [ 减速 | ] 加速';
          panel.appendChild(shortcutTip);

          const appendPanel = () => {
              if (document.body) {
                  document.body.appendChild(miniBtn);
                  document.body.appendChild(panel);
                  bindEvents();
                  updateUI();
              } else {
                  requestAnimationFrame(appendPanel);
              }
          };
          appendPanel();
      }

      function updateUI() {
          if (!speedDisplay) return;

          speedDisplay.textContent = `${currentSpeed}x`;
          slider.value = currentSpeed;
          miniBtn.title = `当前: ${currentSpeed}x${isLocked ? ' 🔒' : ''} | 点击展开`;

          if (isLocked) {
              lockBtn.style.background = '#4CAF50';
              lockBtn.style.color = '#fff';
              followBtn.style.background = 'rgba(255,255,255,0.2)';
              followBtn.style.color = '#fff';
          } else {
              followBtn.style.background = '#2196F3';
              followBtn.style.color = '#fff';
              lockBtn.style.background = 'rgba(255,255,255,0.2)';
              lockBtn.style.color = '#fff';
          }
      }

      function toggleCollapse(collapsed) {
          isCollapsed = collapsed;
          panel.style.display = isCollapsed ? 'none' : 'block';
          miniBtn.style.display = isCollapsed ? 'flex' : 'none';
          GM_setValue(CONFIG.STORAGE_KEY + 'collapsed', isCollapsed);
      }

      function bindEvents() {
          const header = document.getElementById('speed-header');
          const collapseBtn = document.getElementById('collapse-btn');

          // 折叠
          collapseBtn.onclick = (e) => {
              e.stopPropagation();
              toggleCollapse(true);
          };

          // 迷你按钮点击展开（带拖拽判断）
          let miniBtnDragged = false;
          miniBtn.addEventListener('click', () => {
              if (!miniBtnDragged) {
                  toggleCollapse(false);
              }
              miniBtnDragged = false;
          });

          // 滑块事件
          const debouncedSetSpeed = debounce((value) => {
              setSpeed(parseFloat(value));
          }, CONFIG.DEBOUNCE_DELAY);

          slider.addEventListener('input', (e) => {
              speedDisplay.textContent = `${fixPrecision(parseFloat(e.target.value))}x`;
          });
          slider.addEventListener('change', (e) => {
              debouncedSetSpeed(e.target.value);
          });

          // 模式按钮
          followBtn.onclick = () => toggleLock(false);
          lockBtn.onclick = () => toggleLock(true);

          // 拖拽功能
          function makeDraggable(element, onDragEnd) {
              let isDragging = false;
              let hasMoved = false;
              let startX, startY, startRight, startTop;

              const onMouseMove = (e) => {
                  if (!isDragging) return;

                  const deltaX = startX - e.clientX;
                  const deltaY = e.clientY - startY;

                  // 判断是否真的移动了
                  if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
                      hasMoved = true;
                  }

                  const newRight = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, startRight + deltaX));
                  const newTop = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, startTop + deltaY));

                  element.style.right = newRight + 'px';
                  element.style.top = newTop + 'px';

                  // 同步另一个元素的位置
                  if (element === panel) {
                      miniBtn.style.right = newRight + 'px';
                      miniBtn.style.top = newTop + 'px';
                  } else {
                      panel.style.right = newRight + 'px';
                      panel.style.top = newTop + 'px';
                  }
              };

              const onMouseUp = () => {
                  if (isDragging) {
                      isDragging = false;
                      if (hasMoved) {
                          panelPosition = {
                              right: parseInt(element.style.right),
                              top: parseInt(element.style.top)
                          };
                          GM_setValue(CONFIG.STORAGE_KEY + 'position', panelPosition);
                          if (onDragEnd) onDragEnd(true);
                      } else {
                          if (onDragEnd) onDragEnd(false);
                      }
                  }
                  document.removeEventListener('mousemove', onMouseMove);
                  document.removeEventListener('mouseup', onMouseUp);
              };

              return (e) => {
                  if (e.target.id === 'collapse-btn') return;
                  isDragging = true;
                  hasMoved = false;
                  startX = e.clientX;
                  startY = e.clientY;
                  startRight = parseInt(element.style.right);
                  startTop = parseInt(element.style.top);
                  document.addEventListener('mousemove', onMouseMove);
                  document.addEventListener('mouseup', onMouseUp);
              };
          }

          header.addEventListener('mousedown', makeDraggable(panel));
          miniBtn.addEventListener('mousedown', makeDraggable(miniBtn, (dragged) => {
              miniBtnDragged = dragged;
          }));

          // 键盘快捷键
          document.addEventListener('keydown', (e) => {
              if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                  return;
              }

              if (e.key === '[') {
                  e.preventDefault();
                  setSpeed(currentSpeed - CONFIG.STEP);
              } else if (e.key === ']') {
                  e.preventDefault();
                  setSpeed(currentSpeed + CONFIG.STEP);
              }
          });
      }

      // ==================== 视频监听 ====================

      function observeVideos() {
          // 处理已存在的视频
          document.querySelectorAll('video').forEach(video => {
              setupVideoListeners(video);
          });

          // 监听新增视频
          const observer = new MutationObserver((mutations) => {
              let hasNewVideo = false;
              mutations.forEach(mutation => {
                  mutation.addedNodes.forEach(node => {
                      if (node.nodeName === 'VIDEO') {
                          hasNewVideo = true;
                          setupVideoListeners(node);
                      }
                      if (node.querySelectorAll) {
                          node.querySelectorAll('video').forEach(video => {
                              hasNewVideo = true;
                              setupVideoListeners(video);
                          });
                      }
                  });
              });
              if (hasNewVideo) {
                  updateCheckInterval();
              }
          });

          observer.observe(document.documentElement, {
              childList: true,
              subtree: true
          });
      }

      // ==================== 初始化 ====================

      function init() {
          createUI();

          if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', () => {
                  observeVideos();
                  updateCheckInterval();
              });
          } else {
              observeVideos();
              updateCheckInterval();
          }
      }

      init();
  })();