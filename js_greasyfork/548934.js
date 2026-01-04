// ==UserScript==
// @name         Cookie 管理工具
// @namespace    cookie
// @version      1.7
// @description  在开发环境下方便地种植和管理 Cookie，支持设置过期时间
// @author       wangshiwei
// @license      MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_log
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/548934/Cookie%20%E7%AE%A1%E7%90%86%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/548934/Cookie%20%E7%AE%A1%E7%90%86%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  // 添加调试信息
  console.log('Cookie Tool Script Loaded on:', window.location.href);
  
  // 样式
  GM_addStyle(`
      .cookie-dialog {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 9999;
          width: 400px;
          font-family: Arial, sans-serif;
      }

      .cookie-dialog h3 {
          margin-top: 0;
          color: #333;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
      }

      .tab-container {
          margin-bottom: 20px;
      }

      .tab-buttons {
          display: flex;
          border-bottom: 1px solid #ddd;
          margin-bottom: 20px;
      }

      .tab-button {
          flex: 1;
          padding: 10px 15px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          color: #666;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
      }

      .tab-button.active {
          color: #4285f4;
          border-bottom-color: #4285f4;
      }

      .tab-button:hover {
          color: #4285f4;
          background-color: #f5f5f5;
      }

      .tab-content {
          display: none;
      }

      .tab-content.active {
          display: block;
      }

      .form-group {
          margin-bottom: 15px;
      }

      .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #555;
      }

      .form-group input, .form-group select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
      }

      .button-group {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
      }

      .button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
      }

      .primary-button {
          background-color: #4285f4;
          color: white;
      }

      .secondary-button {
          background-color: #f1f1f1;
          color: #333;
      }

      .danger-button {
          background-color: #dc3545;
          color: white;
      }

      .cookie-list {
          max-height: 200px;
          overflow-y: auto;
          margin-top: 15px;
          border: 1px solid #eee;
          border-radius: 4px;
          padding: 10px;
      }

      .cookie-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 0;
          border-bottom: 1px solid #f1f1f1;
      }

      .cookie-item:last-child {
          border-bottom: none;
      }

      .cookie-item .cookie-info {
          flex: 1;
          min-width: 0;
          margin-right: 10px;
      }

      .cookie-item .cookie-key {
          font-weight: bold;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
      }

      .cookie-item .cookie-value {
          color: #666;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
      }

      .cookie-item .cookie-actions {
          display: flex;
          gap: 5px;
          flex-shrink: 0;
      }

      .cookie-item button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 3px;
          transition: background-color 0.2s;
      }

      .cookie-item button:hover {
          background-color: #f0f0f0;
      }

      .cookie-item button.set-cookie {
          color: #4285f4;
      }

      .cookie-item button.delete-cookie {
          color: #dc3545;
      }

      .domain-info {
          font-size: 12px;
          color: #666;
          margin-bottom: 15px;
      }

      .cookie-trigger {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9998;
          padding: 8px 16px;
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          user-select: none;
      }

      .cookie-trigger:hover {
          background-color: #3367d6;
      }

      .cookie-trigger.dragging {
          opacity: 0.8;
      }

      .expiry-info {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
      }

      .current-cookies {
          max-height: 200px;
          overflow-y: auto;
          margin-top: 15px;
          border: 1px solid #eee;
          border-radius: 4px;
          padding: 10px;
      }

      .current-cookie-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 0;
          border-bottom: 1px solid #f1f1f1;
      }

      .current-cookie-item:last-child {
          border-bottom: none;
      }

      .current-cookie-item .cookie-info {
          flex: 1;
          min-width: 0;
          margin-right: 10px;
      }

      .current-cookie-item .cookie-key {
          font-weight: bold;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
      }

      .current-cookie-item .cookie-value {
          color: #666;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 150px;
      }

      .current-cookie-item .cookie-actions {
          display: flex;
          gap: 5px;
          flex-shrink: 0;
      }

      .current-cookie-item button {
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 3px;
          transition: background-color 0.2s;
      }

      .current-cookie-item button:hover {
          background-color: #f0f0f0;
      }

      .security-warning {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
          padding: 10px;
          border-radius: 4px;
          margin: 10px 0;
          font-size: 12px;
      }

      .cookie-details {
          font-size: 11px;
          color: #666;
          margin-top: 5px;
      }
  `);

  // 存储键前缀
  const STORAGE_PREFIX = 'cookie_tool_';
  const POSITION_KEY = 'cookie_tool_position';
  const DEFAULT_EXPIRY_DAYS = 7; // 默认过期时间7天

  // 过期时间选项
  const EXPIRY_OPTIONS = [
      { value: 1, label: "1天" },
      { value: 7, label: "7天" },
      { value: 30, label: "30天" },
      { value: 365, label: "1年" },
      { value: 3650, label: "10年" },
      { value: -1, label: "会话Cookie(关闭浏览器失效)" }
  ];

  // 获取当前域名
  const currentDomain = window.location.hostname;

  // 获取当前页面的所有Cookie（包含详细信息）
  function getCurrentCookies() {
      const cookies = document.cookie.split(';');
      const cookieList = [];
      
      cookies.forEach(cookie => {
          const trimmed = cookie.trim();
          if (trimmed) {
              const [key, value] = trimmed.split('=');
              if (key && value) {
                  cookieList.push({ 
                      key: key.trim(), 
                      value: value.trim(),
                      // 尝试获取更多信息
                      canDelete: true // 默认假设可以删除
                  });
              }
          }
      });
      
      return cookieList;
  }

  // 检查Cookie是否可以被JavaScript删除
  function checkCookieDeletability(key) {
      try {
          // 尝试设置一个测试Cookie
          document.cookie = `test_${key}=test; path=/`;
          const canSet = document.cookie.includes(`test_${key}=test`);
          
          if (canSet) {
              // 尝试删除测试Cookie
              document.cookie = `test_${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
              const canDelete = !document.cookie.includes(`test_${key}=`);
              return canDelete;
          }
          return false;
      } catch (e) {
          console.warn('Cookie deletability check failed:', e);
          return false;
      }
  }

  // 增强的Cookie删除函数
  function deleteCookie(key) {
      console.log('Attempting to delete cookie:', key);
      
      // 获取当前页面的所有Cookie
      const currentCookies = getCurrentCookies();
      const targetCookie = currentCookies.find(c => c.key === key);
      
      if (!targetCookie) {
          console.log('Cookie not found in current page:', key);
          return Promise.resolve(false);
      }
      
      console.log('Found cookie to delete:', targetCookie);
      
      // 检查Cookie是否可以被删除
      const canDelete = checkCookieDeletability(key);
      if (!canDelete) {
          console.warn('Cookie may be protected by browser security policies:', key);
      }
      
      // 使用多种方式删除Cookie
      const deletionMethods = [
          // 方法1: 标准删除 - 设置过期时间为过去
          () => {
              const pastDate = new Date(0).toUTCString();
              document.cookie = `${key}=; expires=${pastDate}; path=/`;
              document.cookie = `${key}=; expires=${pastDate}; path=/; domain=${currentDomain}`;
              document.cookie = `${key}=; expires=${pastDate}; path=/; domain=.${currentDomain}`;
          },
          
          // 方法2: 设置空值
          () => {
              document.cookie = `${key}=; path=/`;
              document.cookie = `${key}=; path=/; domain=${currentDomain}`;
              document.cookie = `${key}=; path=/; domain=.${currentDomain}`;
          },
          
          // 方法3: 使用昨天的时间
          () => {
              const yesterday = new Date();
              yesterday.setTime(yesterday.getTime() - 24 * 60 * 60 * 1000);
              const expires = yesterday.toUTCString();
              document.cookie = `${key}=; expires=${expires}; path=/`;
              document.cookie = `${key}=; expires=${expires}; path=/; domain=${currentDomain}`;
              document.cookie = `${key}=; expires=${expires}; path=/; domain=.${currentDomain}`;
          },
          
          // 方法4: 尝试不同的path组合
          () => {
              const pastDate = new Date(0).toUTCString();
              const paths = ['/', '/path/', window.location.pathname, window.location.pathname + '/'];
              const domains = [currentDomain, '.' + currentDomain, ''];
              
              paths.forEach(path => {
                  domains.forEach(domain => {
                      const domainStr = domain ? `; domain=${domain}` : '';
                      document.cookie = `${key}=; expires=${pastDate}; path=${path}${domainStr}`;
                  });
              });
          },
          
          // 方法5: 尝试设置SameSite属性
          () => {
              const pastDate = new Date(0).toUTCString();
              document.cookie = `${key}=; expires=${pastDate}; path=/; SameSite=Lax`;
              document.cookie = `${key}=; expires=${pastDate}; path=/; SameSite=Strict`;
              document.cookie = `${key}=; expires=${pastDate}; path=/; SameSite=None`;
          }
      ];
      
      // 执行所有删除方法
      deletionMethods.forEach((method, index) => {
          try {
              console.log(`Trying deletion method ${index + 1}`);
              method();
          } catch (e) {
              console.warn(`Deletion method ${index + 1} failed:`, e);
          }
      });
      
      // 等待一段时间后验证删除结果
      return new Promise((resolve) => {
          setTimeout(() => {
              const cookies = document.cookie.split(';');
              const stillExists = cookies.some(cookie => {
                  const trimmed = cookie.trim();
                  return trimmed.startsWith(key + '=') && trimmed.split('=')[1];
              });
              
              if (!stillExists) {
                  console.log('Cookie successfully deleted:', key);
                  resolve(true);
              } else {
                  console.warn('Cookie deletion failed or still exists:', key);
                  console.log('Current cookies after deletion attempt:', document.cookie);
                  resolve(false);
              }
          }, 500); // 增加等待时间
      });
  }

  // 截断文本
  function truncateText(text, maxLength = 18) {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
  }

  // 显示对话框
  function showCookieDialog() {
      console.log('Opening cookie dialog for domain:', currentDomain);
      
      // 如果已经存在对话框，则先移除
      const existingDialog = document.querySelector('.cookie-dialog');
      if (existingDialog) {
          existingDialog.remove();
      }

      // 创建对话框元素
      const dialog = document.createElement('div');
      dialog.className = 'cookie-dialog';

      // 获取已保存的cookie
      const savedCookies = GM_getValue(`${STORAGE_PREFIX}${currentDomain}`, []);
      const currentCookies = getCurrentCookies();

      // 生成过期时间选项
      const expiryOptionsHTML = EXPIRY_OPTIONS.map(option =>
          `<option value="${option.value}">${option.label}</option>`
      ).join('');

      dialog.innerHTML = `
          <h3>Cookie 管理工具</h3>
          <div class="domain-info">当前域名: ${currentDomain}</div>
          
          <div class="security-warning">
              <strong>注意：</strong>某些Cookie可能由于浏览器安全策略（如HttpOnly、SameSite等）无法通过JavaScript删除。
              如果删除失败，请手动在浏览器开发者工具中删除。
          </div>

          <div class="tab-container">
              <div class="tab-buttons">
                  <button class="tab-button active" data-tab="add">添加 Cookie</button>
                  <button class="tab-button" data-tab="delete">删除 Cookie</button>
              </div>

              <!-- 添加Cookie标签页 -->
              <div class="tab-content active" id="add-tab">
                  <div class="form-group">
                      <label for="cookie-key">Key:</label>
                      <input type="text" id="cookie-key" placeholder="输入 cookie 名称">
                  </div>

                  <div class="form-group">
                      <label for="cookie-value">Value:</label>
                      <input type="text" id="cookie-value" placeholder="输入 cookie 值">
                  </div>

                  <div class="form-group">
                      <label for="cookie-expiry">过期时间:</label>
                      <select id="cookie-expiry">
                          ${expiryOptionsHTML}
                      </select>
                      <div class="expiry-info">默认: ${DEFAULT_EXPIRY_DAYS}天</div>
                  </div>

                  ${savedCookies.length > 0 ? `
                  <div class="cookie-list">
                      <h4>已保存的 Cookie</h4>
                      ${savedCookies.map(cookie => `
                          <div class="cookie-item">
                              <div class="cookie-info">
                                  <div class="cookie-key" title="${cookie.key}">${truncateText(cookie.key)}</div>
                                  <div class="cookie-value" title="${cookie.value}">${truncateText(cookie.value)}</div>
                              </div>
                              <div class="cookie-actions">
                                  <button class="set-cookie" data-key="${cookie.key}" data-value="${cookie.value}" data-expiry="${cookie.expiry || DEFAULT_EXPIRY_DAYS}">设置</button>
                                  <button class="delete-cookie" data-key="${cookie.key}">删除</button>
                              </div>
                          </div>
                      `).join('')}
                  </div>
                  ` : ''}

                  <div class="button-group">
                      <button class="button secondary-button" id="cancel-button">取消</button>
                      <button class="button primary-button" id="confirm-button">确定</button>
                  </div>
              </div>

              <!-- 删除Cookie标签页 -->
              <div class="tab-content" id="delete-tab">
                  <div class="form-group">
                      <label for="delete-cookie-key">要删除的 Cookie Key:</label>
                      <input type="text" id="delete-cookie-key" placeholder="输入要删除的 cookie 名称">
                  </div>

                  ${currentCookies.length > 0 ? `
                  <div class="current-cookies">
                      <h4>当前页面的 Cookie</h4>
                      ${currentCookies.map(cookie => `
                          <div class="current-cookie-item">
                              <div class="cookie-info">
                                  <div class="cookie-key" title="${cookie.key}">${truncateText(cookie.key)}</div>
                                  <div class="cookie-value" title="${cookie.value}">${truncateText(cookie.value)}</div>
                                  <div class="cookie-details">${cookie.canDelete ? '可删除' : '可能受保护'}</div>
                              </div>
                              <div class="cookie-actions">
                                  <button class="delete-current-cookie" data-key="${cookie.key}">删除</button>
                              </div>
                          </div>
                      `).join('')}
                  </div>
                  ` : '<p>当前页面没有Cookie</p>'}

                  <div class="button-group">
                      <button class="button secondary-button" id="cancel-delete-button">取消</button>
                      <button class="button danger-button" id="confirm-delete-button">删除</button>
                  </div>
              </div>
          </div>
      `;

      // 设置默认选中7天
      dialog.querySelector('#cookie-expiry').value = DEFAULT_EXPIRY_DAYS;

      document.body.appendChild(dialog);

      // Tab切换功能
      dialog.querySelectorAll('.tab-button').forEach(button => {
          button.addEventListener('click', () => {
              const tabName = button.dataset.tab;
              
              // 移除所有active类
              dialog.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
              dialog.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
              
              // 添加active类
              button.classList.add('active');
              dialog.querySelector(`#${tabName}-tab`).classList.add('active');
          });
      });

      // 添加Cookie事件监听器
      dialog.querySelector('#confirm-button').addEventListener('click', () => {
          const key = dialog.querySelector('#cookie-key').value.trim();
          const value = dialog.querySelector('#cookie-value').value.trim();
          const expiryDays = parseInt(dialog.querySelector('#cookie-expiry').value);

          if (key && value) {
              setCookie(key, value, expiryDays);
              saveCookie(key, value, expiryDays);
              dialog.remove();
              console.log('Cookie set:', key, '=', value);
          } else {
              alert('请输入有效的 Key 和 Value');
          }
      });

      // 删除Cookie事件监听器
      dialog.querySelector('#confirm-delete-button').addEventListener('click', async () => {
          const key = dialog.querySelector('#delete-cookie-key').value.trim();
          
          if (key) {
              const deleted = await deleteCookie(key);
              if (deleted) {
                  // 刷新当前标签页的Cookie列表
                  setTimeout(() => {
                      showCookieDialog();
                  }, 100);
              } else {
                  alert(`Cookie "${key}" 删除失败。可能原因：\n1. Cookie设置了HttpOnly标志\n2. Cookie设置了SameSite限制\n3. 浏览器安全策略限制\n\n请手动在浏览器开发者工具中删除。`);
              }
          } else {
              alert('请输入要删除的 Cookie Key');
          }
      });

      dialog.querySelector('#cancel-button').addEventListener('click', () => {
          dialog.remove();
      });

      dialog.querySelector('#cancel-delete-button').addEventListener('click', () => {
          dialog.remove();
      });

      // 为已保存的cookie添加事件
      dialog.querySelectorAll('.set-cookie').forEach(button => {
          button.addEventListener('click', () => {
              const key = button.dataset.key;
              const value = button.dataset.value;
              const expiryDays = parseInt(button.dataset.expiry) || DEFAULT_EXPIRY_DAYS;
              setCookie(key, value, expiryDays);
              console.log('Cookie set from saved:', key, '=', value);
          });
      });

      dialog.querySelectorAll('.delete-cookie').forEach(button => {
          button.addEventListener('click', () => {
              const key = button.dataset.key;
              deleteSavedCookie(key);
              // 刷新添加标签页的Cookie列表
              setTimeout(() => {
                  showCookieDialog();
              }, 100);
              console.log('Cookie deleted from saved:', key);
          });
      });

      // 为当前页面的cookie添加删除事件
      dialog.querySelectorAll('.delete-current-cookie').forEach(button => {
          button.addEventListener('click', async () => {
              const key = button.dataset.key;
              const deleted = await deleteCookie(key);
              if (deleted) {
                  // 刷新当前标签页的Cookie列表
                  setTimeout(() => {
                      showCookieDialog();
                  }, 100);
              } else {
                  alert(`Cookie "${key}" 删除失败。可能原因：\n1. Cookie设置了HttpOnly标志\n2. Cookie设置了SameSite限制\n3. 浏览器安全策略限制\n\n请手动在浏览器开发者工具中删除。`);
              }
              console.log('Current cookie deleted:', key);
          });
      });
  }

  // 设置cookie
  function setCookie(key, value, days = DEFAULT_EXPIRY_DAYS) {
      let expires = "";

      if (days > 0) {
          const date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "expires=" + date.toUTCString() + ";";
      }

      const cookieString = `${key}=${value}; ${expires} path=/; domain=${currentDomain}`;
      document.cookie = cookieString;
      
      console.log('Cookie set:', cookieString);
      
      // 验证cookie是否设置成功
      setTimeout(() => {
          const cookies = document.cookie.split(';');
          const targetCookie = cookies.find(cookie => cookie.trim().startsWith(key + '='));
          if (targetCookie) {
              console.log('Cookie verified:', targetCookie.trim());
          } else {
              console.warn('Cookie setting failed or domain restriction applied');
          }
      }, 100);
  }

  // 保存cookie到存储
  function saveCookie(key, value, expiryDays = DEFAULT_EXPIRY_DAYS) {
      const savedCookies = GM_getValue(`${STORAGE_PREFIX}${currentDomain}`, []);

      // 检查是否已存在
      const existingIndex = savedCookies.findIndex(c => c.key === key);

      if (existingIndex >= 0) {
          // 更新现有cookie
          savedCookies[existingIndex].value = value;
          savedCookies[existingIndex].expiry = expiryDays;
      } else {
          // 添加新cookie
          savedCookies.push({ key, value, expiry: expiryDays });
      }

      GM_setValue(`${STORAGE_PREFIX}${currentDomain}`, savedCookies);
      console.log('Cookie saved to storage:', key, '=', value);
  }

  // 从存储中删除cookie
  function deleteSavedCookie(key) {
      const savedCookies = GM_getValue(`${STORAGE_PREFIX}${currentDomain}`, []);
      const updatedCookies = savedCookies.filter(c => c.key !== key);
      GM_setValue(`${STORAGE_PREFIX}${currentDomain}`, updatedCookies);
  }

  // 创建可拖动的触发按钮
  function createDraggableTrigger() {
      console.log('Creating draggable trigger button...');
      
      const trigger = document.createElement('button');
      trigger.className = 'cookie-trigger';
      trigger.textContent = 'Cookie Tool';

      // 获取保存的位置或使用默认位置
      const savedPosition = GM_getValue(POSITION_KEY, { bottom: '20px', right: '20px' });
      Object.assign(trigger.style, savedPosition);

      // 点击事件 - 显示对话框
      trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          showCookieDialog();
      });

      // 拖动功能
      let isDragging = false;
      let offsetX, offsetY;

      trigger.addEventListener('mousedown', (e) => {
          if (e.button !== 0) return; // 只响应左键

          isDragging = true;
          trigger.classList.add('dragging');

          // 计算鼠标在按钮内的偏移量
          const rect = trigger.getBoundingClientRect();
          offsetX = e.clientX - rect.left;
          offsetY = e.clientY - rect.top;

          e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
          if (!isDragging) return;

          // 计算新位置
          const x = e.clientX - offsetX;
          const y = e.clientY - offsetY;

          // 确保按钮不会移出视口
          const maxX = window.innerWidth - trigger.offsetWidth;
          const maxY = window.innerHeight - trigger.offsetHeight;

          const clampedX = Math.max(0, Math.min(x, maxX));
          const clampedY = Math.max(0, Math.min(y, maxY));

          // 应用新位置
          trigger.style.left = `${clampedX}px`;
          trigger.style.top = `${clampedY}px`;
          trigger.style.right = 'auto';
          trigger.style.bottom = 'auto';
      });

      document.addEventListener('mouseup', () => {
          if (isDragging) {
              isDragging = false;
              trigger.classList.remove('dragging');

              // 保存位置
              const position = {
                  left: trigger.style.left,
                  top: trigger.style.top,
                  right: trigger.style.right,
                  bottom: trigger.style.bottom
              };
              GM_setValue(POSITION_KEY, position);
          }
      });

      document.body.appendChild(trigger);
      console.log('Draggable trigger button created successfully');
  }

  // 初始化脚本
  function initScript() {
      console.log('Initializing Cookie Tool...');
      console.log('Current domain:', currentDomain);
      
      // 检查是否已经存在按钮
      const existingTrigger = document.querySelector('.cookie-trigger');
      if (existingTrigger) {
          console.log('Trigger button already exists, removing...');
          existingTrigger.remove();
      }
      
      createDraggableTrigger();
      
      // 注册菜单命令
      GM_registerMenuCommand("打开 Cookie 种植工具", showCookieDialog);
      
      console.log('Cookie Tool initialized successfully');
  }

  // 页面加载完成后创建可拖动按钮
  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initScript);
  } else {
      initScript();
  }

  // 添加全局错误处理
  window.addEventListener('error', (e) => {
      console.error('Cookie Tool Error:', e.error);
  });

})();