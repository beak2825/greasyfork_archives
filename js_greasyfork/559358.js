// ==UserScript==
// @name         IP信息显示 - 液态玻璃版
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  苹果液态玻璃风格IP信息显示 - 悬停展开（带国旗）
// @author       GQLJ
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      ip-api.com
// @connect      cloudflare.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559358/IP%E4%BF%A1%E6%81%AF%E6%98%BE%E7%A4%BA%20-%20%E6%B6%B2%E6%80%81%E7%8E%BB%E7%92%83%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/559358/IP%E4%BF%A1%E6%81%AF%E6%98%BE%E7%A4%BA%20-%20%E6%B6%B2%E6%80%81%E7%8E%BB%E7%92%83%E7%89%88.meta.js
// ==/UserScript==
  (function() {
      'use strict';

      // 从本地存储读取位置设置
      const savedPosition = GM_getValue('ipbox_position', 'middle');
      const savedCustomTop = GM_getValue('ipbox_custom_top', null);
      const savedSide = GM_getValue('ipbox_side', 'right');

      // 创建主容器
      const ipBox = document.createElement('div');
      ipBox.id = 'ip-info-box';
      ipBox.style.cssText = `
          position: fixed;
          top: 50%;
          right: 0;
          transform: translateY(-50%) translateX(calc(100% - 36px)) translateZ(0);
          background: linear-gradient(135deg,
              rgba(255, 255, 255, 0.12) 0%,
              rgba(255, 255, 255, 0.06) 100%);
          backdrop-filter: blur(30px) saturate(180%) brightness(1.15);
          -webkit-backdrop-filter: blur(30px) saturate(180%) brightness(1.15);
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          border-right: none;
          color: white;
          padding: 14px 10px;
          border-radius: 50px 0 0 50px;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Arial, sans-serif;
          font-size: 13px;
          box-shadow:
              -10px 0 50px rgba(0, 0, 0, 0.15),
              -2px 0 20px rgba(255, 255, 255, 0.05),
              inset 0 1px 1px rgba(255, 255, 255, 0.25),
              inset 0 -1px 1px rgba(0, 0, 0, 0.1);
          z-index: 999999;
          min-width: 36px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
          font-weight: 500;
          overflow: hidden;
          will-change: transform;
          contain: layout style paint;
      `;

      // 添加动画关键帧
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
          @keyframes float {
              0%, 100% {
                  transform: translateY(0px) translateZ(0);
              }
              50% {
                  transform: translateY(-3px) translateZ(0);
              }
          }

          @keyframes breathe {
              0%, 100% {
                  transform: scale(1) translateZ(0);
                  opacity: 0.85;
              }
              50% {
                  transform: scale(1.08) translateZ(0);
                  opacity: 1;
              }
          }

          @keyframes pulse {
              0%, 100% {
                  opacity: 1;
                  transform: scale(1);
              }
              50% {
                  opacity: 0.6;
                  transform: scale(0.98);
              }
          }

          @keyframes rainbow {
              0% { filter: hue-rotate(0deg); }
              100% { filter: hue-rotate(360deg); }
          }

          @keyframes countUp {
              0% {
                  opacity: 0;
                  transform: translateY(10px) translateZ(0);
              }
              100% {
                  opacity: 1;
                  transform: translateY(0) translateZ(0);
              }
          }

          @keyframes shimmerLoad {
              0% {
                  background-position: -200% center;
              }
              100% {
                  background-position: 200% center;
              }
          }

          @keyframes menuFadeIn {
              0% {
                  opacity: 0;
                  transform: scale(0.92) translateY(-5px) translateZ(0);
              }
              100% {
                  opacity: 1;
                  transform: scale(1) translateY(0) translateZ(0);
              }
          }

          @keyframes spin {
              0% {
                  transform: rotate(0deg) translateZ(0);
              }
              100% {
                  transform: rotate(360deg) translateZ(0);
              }
          }

          .ip-info-value {
              animation: countUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          .ip-info-row:nth-child(1) .ip-info-value { animation-delay: 0.05s; opacity: 0; }
          .ip-info-row:nth-child(2) .ip-info-value { animation-delay: 0.1s; opacity: 0; }
          .ip-info-row:nth-child(3) .ip-info-value { animation-delay: 0.15s; opacity: 0; }
          .ip-info-row:nth-child(4) .ip-info-value { animation-delay: 0.2s; opacity: 0; }

          .ip-context-menu {
              animation: menuFadeIn 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          /* 页面不可见时暂停动画 */
          .animations-paused * {
              animation-play-state: paused !important;
          }
      `;
      document.head.appendChild(styleSheet);

      // 顶部光泽层
      const glossLayer = document.createElement('div');
      glossLayer.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 60%;
          background: linear-gradient(180deg,
              rgba(255, 255, 255, 0.2) 0%,
              rgba(255, 255, 255, 0) 100%);
          pointer-events: none;
          border-radius: 50px 0 0 0;
          transition: border-radius 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: border-radius;
      `;
      ipBox.appendChild(glossLayer);

      // 彩虹光晕层
      const rainbowGlow = document.createElement('div');
      rainbowGlow.style.cssText = `
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg,
              rgba(255, 50, 150, 0.4),
              rgba(100, 150, 255, 0.4),
              rgba(150, 255, 150, 0.4));
          border-radius: 50px 0 0 50px;
          opacity: 0;
          transition: opacity 0.4s ease, border-radius 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          pointer-events: none;
          z-index: -1;
          filter: blur(18px);
          will-change: opacity;
      `;
      ipBox.appendChild(rainbowGlow);

      // 内容容器
      const contentDiv = document.createElement('div');
      contentDiv.style.cssText = 'position: relative; z-index: 1;';
      contentDiv.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center;">
              <span style="font-size: 18px; animation: spin 2s linear infinite;">🌐</span>
          </div>
      `;
      ipBox.appendChild(contentDiv);

      document.body.appendChild(ipBox);

      let isExpanded = false; // 默认收起
      let ipData = null;
      let pingTime = null;
      let isDragging = false;
      let dragStartY = 0;
      let boxStartTop = 0;
      let currentSide = savedSide;
      let expandTimer = null;
      let collapseTimer = null;
      let isAnimating = false;

      // 页面可见性监控
      let isPageVisible = !document.hidden;
      document.addEventListener('visibilitychange', () => {
          isPageVisible = !document.hidden;
          if (!isPageVisible) {
              ipBox.classList.add('animations-paused');
          } else {
              ipBox.classList.remove('animations-paused');
          }
      });

      // 应用侧边样式
      function applySideStyle(side, instant = false) {
          currentSide = side;

          if (instant) {
              ipBox.style.transition = 'none';
          }

          if (side === 'left') {
              ipBox.style.left = '0';
              ipBox.style.right = 'auto';
              ipBox.style.borderLeft = 'none';
              ipBox.style.borderRight = '1.5px solid rgba(255, 255, 255, 0.2)';
              ipBox.style.borderRadius = '0 50px 50px 0';
              glossLayer.style.borderRadius = '0 50px 0 0';
              rainbowGlow.style.borderRadius = '0 50px 50px 0';
              ipBox.style.boxShadow = `
                  10px 0 50px rgba(0, 0, 0, 0.15),
                  2px 0 20px rgba(255, 255, 255, 0.05),
                  inset 0 1px 1px rgba(255, 255, 255, 0.25),
                  inset 0 -1px 1px rgba(0, 0, 0, 0.1)
              `;
          } else {
              ipBox.style.right = '0';
              ipBox.style.left = 'auto';
              ipBox.style.borderRight = 'none';
              ipBox.style.borderLeft = '1.5px solid rgba(255, 255, 255, 0.2)';
              ipBox.style.borderRadius = '50px 0 0 50px';
              glossLayer.style.borderRadius = '50px 0 0 0';
              rainbowGlow.style.borderRadius = '50px 0 0 50px';
              ipBox.style.boxShadow = `
                  -10px 0 50px rgba(0, 0, 0, 0.15),
                  -2px 0 20px rgba(255, 255, 255, 0.05),
                  inset 0 1px 1px rgba(255, 255, 255, 0.25),
                  inset 0 -1px 1px rgba(0, 0, 0, 0.1)
              `;
          }

          if (instant) {
              requestAnimationFrame(() => {
                  ipBox.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
              });
          }

          applyPosition(GM_getValue('ipbox_position', 'middle'), GM_getValue('ipbox_custom_top', null));
          updateTransform();
      }

      // 应用保存的位置
      function applyPosition(position, customTop = null) {
          if (position === 'custom' && customTop !== null) {
              ipBox.style.top = customTop + 'px';
              ipBox.style.bottom = 'auto';
          } else {
              switch(position) {
                  case 'top':
                      ipBox.style.top = '80px';
                      ipBox.style.bottom = 'auto';
                      break;
                  case 'bottom':
                      ipBox.style.top = 'auto';
                      ipBox.style.bottom = '80px';
                      break;
                  case 'middle':
                  default:
                      ipBox.style.top = '50%';
                      ipBox.style.bottom = 'auto';
                      break;
              }
          }
      }

      // 更新 transform
      function updateTransform() {
          const position = GM_getValue('ipbox_position', 'middle');
          let translateY = position === 'middle' && GM_getValue('ipbox_custom_top', null) === null
              ? 'translateY(-50%)'
              : 'translateY(0)';

          let translateX;

          if (isExpanded) {
              translateX = currentSide === 'left' ? 'translateX(8px)' : 'translateX(-8px)';
          } else {
              if (currentSide === 'left') {
                  translateX = 'translateX(calc(-100% + 36px))';
              } else {
                  translateX = 'translateX(calc(100% - 36px))';
              }
          }

          ipBox.style.transform = `${translateY} ${translateX} translateZ(0)`;
      }

      // 初始化侧边和位置
      applySideStyle(savedSide, true);

      // 创建右键菜单
      function createContextMenu(e) {
          e.preventDefault();
          e.stopPropagation();

          const existingMenu = document.getElementById('ip-context-menu');
          if (existingMenu) {
              existingMenu.remove();
          }

          const menu = document.createElement('div');
          menu.id = 'ip-context-menu';
          menu.className = 'ip-context-menu';
          menu.style.cssText = `
              position: fixed;
              background: rgba(25, 25, 30, 0.98);
              backdrop-filter: blur(30px) saturate(150%);
              -webkit-backdrop-filter: blur(30px) saturate(150%);
              border: 1px solid rgba(255, 255, 255, 0.18);
              border-radius: 14px;
              padding: 6px;
              min-width: 180px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
              z-index: 10000000;
              color: white;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              font-size: 13px;
              left: ${e.clientX}px;
              top: ${e.clientY}px;
          `;

          const menuItems = [
              { label: '◀ 吸附到左侧', value: 'left', type: 'side' },
              { label: '吸附到右侧 ▶', value: 'right', type: 'side' },
              { type: 'separator' },
              { label: '📌 固定在顶部', value: 'top' },
              { label: '📌 固定在中间', value: 'middle' },
              { label: '📌 固定在底部', value: 'bottom' },
              { type: 'separator' },
              { label: '✋ 拖拽自由定位', value: 'drag', hint: '长按' }
          ];

          menuItems.forEach(item => {
              if (item.type === 'separator') {
                  const separator = document.createElement('div');
                  separator.style.cssText = `
                      height: 1px;
                      background: rgba(255, 255, 255, 0.08);
                      margin: 4px 8px;
                  `;
                  menu.appendChild(separator);
                  return;
              }

              const menuItem = document.createElement('div');
              menuItem.style.cssText = `
                  padding: 9px 14px;
                  border-radius: 8px;
                  cursor: pointer;
                  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  user-select: none;
              `;

              let isActive = false;
              if (item.type === 'side') {
                  isActive = currentSide === item.value;
              } else if (item.value !== 'drag') {
                  const currentPos = GM_getValue('ipbox_position', 'middle');
                  isActive = currentPos === item.value;
              }

              if (isActive) {
                  menuItem.style.background = 'rgba(100, 150, 255, 0.35)';
              }

              menuItem.innerHTML = `
                  <span>${item.label}</span>
                  ${item.hint ? `<span style="font-size: 11px; opacity: 0.5; margin-left: 8px;">${item.hint}</span>` : ''}
              `;

              menuItem.addEventListener('mouseenter', () => {
                  if (!isActive) {
                      menuItem.style.background = 'rgba(255, 255, 255, 0.12)';
                  }
              });

              menuItem.addEventListener('mouseleave', () => {
                  if (!isActive) {
                      menuItem.style.background = 'transparent';
                  }
              });

              menuItem.addEventListener('click', () => {
                  if (item.value === 'drag') {
                      showNotification('💡 长按面板可拖动到任意位置');
                  } else if (item.type === 'side') {
                      GM_setValue('ipbox_side', item.value);
                      applySideStyle(item.value);
                      showNotification(`✓ 已吸附到${item.value === 'left' ? '左侧' : '右侧'}`);
                  } else {
                      GM_setValue('ipbox_position', item.value);
                      GM_setValue('ipbox_custom_top', null);
                      applyPosition(item.value);
                      updateTransform();
                      showNotification(`✓ 已固定到${item.label.replace('📌 固定在', '')}`);
                  }
                  menu.style.opacity = '0';
                  menu.style.transform = 'scale(0.95)';
                  setTimeout(() => menu.remove(), 150);
              });

              menu.appendChild(menuItem);
          });

          document.body.appendChild(menu);

          setTimeout(() => {
              const closeMenu = (clickEvent) => {
                  if (!menu.contains(clickEvent.target)) {
                      menu.style.opacity = '0';
                      menu.style.transform = 'scale(0.95)';
                      setTimeout(() => menu.remove(), 150);
                      document.removeEventListener('click', closeMenu);
                  }
              };
              document.addEventListener('click', closeMenu);
          }, 100);
      }

      // 显示通知
      function showNotification(text) {
          const notification = document.createElement('div');
          notification.style.cssText = `
              position: fixed;
              top: 20px;
              ${currentSide === 'left' ? 'left' : 'right'}: 20px;
              background: rgba(25, 25, 30, 0.98);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.2);
              color: white;
              padding: 14px 22px;
              border-radius: 14px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              font-size: 13px;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
              z-index: 10000001;
              opacity: 0;
              transform: translateY(-10px) translateZ(0);
              transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
              will-change: transform, opacity;
          `;
          notification.textContent = text;
          document.body.appendChild(notification);

          requestAnimationFrame(() => {
              notification.style.opacity = '1';
              notification.style.transform = 'translateY(0) translateZ(0)';
          });

          setTimeout(() => {
              notification.style.opacity = '0';
              notification.style.transform = 'translateY(-10px) translateZ(0)';
              setTimeout(() => notification.remove(), 300);
          }, 2200);
      }

      // 测试延迟
      function measurePing() {
          const start = performance.now();
          GM_xmlhttpRequest({
              method: 'HEAD',
              url: 'https://www.cloudflare.com',
              timeout: 3000,
              onload: function() {
                  pingTime = Math.round(performance.now() - start);
                  if (ipData && isExpanded) {
                      updateDisplay(true);
                  }
              },
              onerror: function() {
                  pingTime = null;
              }
          });
      }

      // 获取IP信息
      GM_xmlhttpRequest({
          method: 'GET',
          url: 'http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query',
          onload: function(response) {
              try {
                  const data = JSON.parse(response.responseText);
                  ipData = data;

                  if (data.status === 'success') {
                      measurePing();
                      // 加载完成后显示收起状态，带国旗
                      updateDisplay(false);
                  } else {
                      contentDiv.innerHTML = '<div style="display: flex; flex-direction: column; align-items: center;"><span style="font-size: 18px;">❌</span></div>';
                  }
              } catch (e) {
                  contentDiv.innerHTML = '<div style="display: flex; flex-direction: column; align-items: center;"><span style="font-size: 18px;">❌</span></div>';
              }
          },
          onerror: function() {
              contentDiv.innerHTML = '<div style="display: flex; flex-direction: column; align-items: center;"><span style="font-size: 18px;">❌</span></div>';
          }
      });

      // 获取国旗emoji
      function getFlag(countryCode) {
          if (!countryCode) return '🌍';
          const codePoints = countryCode
              .toUpperCase()
              .split('')
              .map(char => 127397 + char.charCodeAt());
          return String.fromCodePoint(...codePoints);
      }

      // 格式化ISP名称
      function formatISP(isp) {
          if (!isp) return '未知';
          return isp.length > 25 ? isp.substring(0, 22) + '...' : isp;
      }

      // 更新显示内容
      function updateDisplay(expanded) {
          if (!ipData || ipData.status !== 'success') return;
          if (isAnimating) return;

          isAnimating = true;
          isExpanded = expanded;

          if (expanded) {
              ipBox.style.minWidth = '260px';
              ipBox.style.padding = '18px 22px';

              if (currentSide === 'left') {
                  ipBox.style.borderRadius = '0 20px 20px 0';
                  glossLayer.style.borderRadius = '0 20px 0 0';
                  rainbowGlow.style.borderRadius = '0 20px 20px 0';
              } else {
                  ipBox.style.borderRadius = '20px 0 0 20px';
                  glossLayer.style.borderRadius = '20px 0 0 0';
                  rainbowGlow.style.borderRadius = '20px 0 0 20px';
              }

              updateTransform();

              const pingDisplay = pingTime !== null
                  ? `<div style="display: inline-block; background: rgba(0, 255, 150, 0.25);
                      padding: 3px 10px; border-radius: 10px; font-size: 11px; font-weight: 600;
                      border: 1px solid rgba(0, 255, 150, 0.4);">
                      <span style="color: #00ff96; margin-right: 4px;">●</span>${pingTime}ms
                     </div>`
                  : '';

              const arrowIcon = currentSide === 'left' ? '›' : '‹';

              contentDiv.innerHTML = `
                  <div style="margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between;">
                      <div style="display: flex; align-items: center; gap: 8px;">
                          <span style="font-size: 20px; animation: float 4s ease-in-out infinite;">📍</span>
                          <span style="font-weight: 600; font-size: 16px; letter-spacing: -0.5px;">
                              IP 信息
                          </span>
                      </div>
                      <div style="display: flex; align-items: center; gap: 10px;">
                          ${pingDisplay}
                          <span style="font-size: 20px; opacity: 0.5; font-weight: 300;">${arrowIcon}</span>
                      </div>
                  </div>

                  <div style="background: rgba(0, 0, 0, 0.18); padding: 12px; border-radius: 12px;
                      border: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 10px;">
                      <div class="ip-info-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                          <span style="opacity: 0.7; font-size: 12px;">IP 地址</span>
                          <span class="ip-info-value" style="font-weight: 600; letter-spacing: 0.5px;
                              font-family: 'SF Mono', Consolas, monospace; font-size: 13px;">
                              ${ipData.query}
                          </span>
                      </div>

                      <div class="ip-info-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                          <span style="opacity: 0.7; font-size: 12px;">国家/地区</span>
                          <span class="ip-info-value" style="font-weight: 600; font-size: 13px;">
                              ${getFlag(ipData.countryCode)} ${ipData.country}
                          </span>
                      </div>

                      <div class="ip-info-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                          <span style="opacity: 0.7; font-size: 12px;">城市</span>
                          <span class="ip-info-value" style="font-weight: 600; font-size: 13px;">
                              ${ipData.city || '未知'}
                          </span>
                      </div>

                      <div class="ip-info-row" style="display: flex; justify-content: space-between; align-items: center;">
                          <span style="opacity: 0.7; font-size: 12px;">运营商</span>
                          <span class="ip-info-value" style="font-weight: 600; font-size: 11px;">
                              ${formatISP(ipData.isp)}
                          </span>
                      </div>
                  </div>

                  <div style="display: flex; justify-content: space-between; align-items: center;
                      font-size: 10px; opacity: 0.6; padding: 8px 4px 0;">
                      <span>${ipData.timezone}</span>
                      <span>${ipData.lat.toFixed(2)}°, ${ipData.lon.toFixed(2)}°</span>
                  </div>
              `;
          } else {
              // 收起状态 - 显示国旗！
              ipBox.style.minWidth = '36px';
              ipBox.style.padding = '14px 10px';

              if (currentSide === 'left') {
                  ipBox.style.borderRadius = '0 50px 50px 0';
                  glossLayer.style.borderRadius = '0 50px 0 0';
                  rainbowGlow.style.borderRadius = '0 50px 50px 0';
              } else {
                  ipBox.style.borderRadius = '50px 0 0 50px';
                  glossLayer.style.borderRadius = '50px 0 0 0';
                  rainbowGlow.style.borderRadius = '50px 0 0 50px';
              }

              updateTransform();

              // 显示国旗emoji，带呼吸动画
              contentDiv.innerHTML = `
                  <div style="display: flex; flex-direction: column; align-items: center;">
                      <span style="font-size: 22px; animation: breathe 4s ease-in-out infinite;">${getFlag(ipData.countryCode)}</span>
                  </div>
              `;
          }

          setTimeout(() => {
              isAnimating = false;
          }, 400);
      }

      // 右键显示菜单
      ipBox.addEventListener('contextmenu', createContextMenu);

      // 拖拽功能
      ipBox.addEventListener('mousedown', (e) => {
          if (e.button === 0) {
              isDragging = false;
              dragStartY = e.clientY;
              boxStartTop = ipBox.getBoundingClientRect().top;

              const threshold = 8;

              const onMouseMove = (moveEvent) => {
                  const deltaY = Math.abs(moveEvent.clientY - dragStartY);

                  if (deltaY > threshold) {
                      isDragging = true;
                      ipBox.style.cursor = 'grabbing';
                      ipBox.style.transition = 'none';

                      // 取消展开/收起
                      clearTimeout(expandTimer);
                      clearTimeout(collapseTimer);

                      const newTop = boxStartTop + (moveEvent.clientY - dragStartY);
                      ipBox.style.top = Math.max(0, Math.min(window.innerHeight - 100, newTop)) + 'px';
                      ipBox.style.bottom = 'auto';

                      const position = GM_getValue('ipbox_position', 'middle');
                      const translateY = position === 'middle' ? 'translateY(0)' : 'translateY(0)';
                      const translateX = isExpanded
                          ? (currentSide === 'left' ? 'translateX(8px)' : 'translateX(-8px)')
                          : (currentSide === 'left' ? 'translateX(calc(-100% + 36px))' : 'translateX(calc(100% - 36px))');
                      ipBox.style.transform = `${translateY} ${translateX} translateZ(0)`;
                  }
              };

              const onMouseUp = () => {
                  if (isDragging) {
                      ipBox.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                      const finalTop = ipBox.getBoundingClientRect().top;
                      GM_setValue('ipbox_position', 'custom');
                      GM_setValue('ipbox_custom_top', finalTop);
                      showNotification('✓ 位置已保存');

                      setTimeout(() => {
                          isDragging = false;
                          ipBox.style.cursor = 'pointer';
                      }, 100);
                  }
                  document.removeEventListener('mousemove', onMouseMove);
                  document.removeEventListener('mouseup', onMouseUp);
              };

              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
          }
      });

      // 鼠标悬停展开
      ipBox.addEventListener('mouseenter', () => {
          if (!isDragging && !isAnimating) {
              clearTimeout(collapseTimer);

              // 立即应用悬停样式
              ipBox.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.1) 100%)';

              if (currentSide === 'left') {
                  ipBox.style.boxShadow = `
                      15px 0 60px rgba(0, 0, 0, 0.22),
                      3px 0 25px rgba(255, 255, 255, 0.08),
                      inset 0 1px 2px rgba(255, 255, 255, 0.3),
                      inset 0 -1px 2px rgba(0, 0, 0, 0.15)
                  `;
              } else {
                  ipBox.style.boxShadow = `
                      -15px 0 60px rgba(0, 0, 0, 0.22),
                      -3px 0 25px rgba(255, 255, 255, 0.08),
                      inset 0 1px 2px rgba(255, 255, 255, 0.3),
                      inset 0 -1px 2px rgba(0, 0, 0, 0.15)
                  `;
              }

              rainbowGlow.style.opacity = '0.5';

              // 延迟展开，避免误触
              expandTimer = setTimeout(() => {
                  if (!isDragging && !isAnimating) {
                      updateDisplay(true);
                  }
              }, 150);
          }
      });

      // 鼠标移开收起
      ipBox.addEventListener('mouseleave', () => {
          if (!isDragging && !isAnimating) {
              clearTimeout(expandTimer);

              // 恢复默认样式
              ipBox.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)';

              if (currentSide === 'left') {
                  ipBox.style.boxShadow = `
                      10px 0 50px rgba(0, 0, 0, 0.15),
                      2px 0 20px rgba(255, 255, 255, 0.05),
                      inset 0 1px 1px rgba(255, 255, 255, 0.25),
                      inset 0 -1px 1px rgba(0, 0, 0, 0.1)
                  `;
              } else {
                  ipBox.style.boxShadow = `
                      -10px 0 50px rgba(0, 0, 0, 0.15),
                      -2px 0 20px rgba(255, 255, 255, 0.05),
                      inset 0 1px 1px rgba(255, 255, 255, 0.25),
                      inset 0 -1px 1px rgba(0, 0, 0, 0.1)
                  `;
              }

              rainbowGlow.style.opacity = '0';

              // 延迟收起，避免频繁切换
              collapseTimer = setTimeout(() => {
                  if (!isDragging && !isAnimating) {
                      updateDisplay(false);
                  }
              }, 200);
          }
      });

      // 清理函数
      window.addEventListener('beforeunload', () => {
          clearTimeout(expandTimer);
          clearTimeout(collapseTimer);
      });

  })();