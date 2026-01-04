// ==UserScript==
// @name         简化版API拦截器配置面板
// @name:zh-CN   简化版API拦截器配置面板
// @name:en      API Interceptor Configuration Panel
// @namespace    https://github.com/wuqi-y/interceptor
// @version      1.4.2
// @description  带配置面板的API拦截器，支持本地存储，支持域名级别配置隔离，支持XHR和Fetch拦截
// @description:zh-CN  功能强大的API拦截器，支持完全替换和部分修改两种模式，支持全局Header注入，按域名隔离配置，可拖拽悬浮按钮
// @description:en     Powerful API Interceptor with configuration panel, supports both XHR and Fetch, domain-isolated configs
// @author       wuqi-y
// @match        *://*/*
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="80">⚙️</text></svg>
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      cdn.jsdelivr.net
// @connect      raw.githubusercontent.com
// @connect      github.com
// @connect      *
// @grant        GM_notification
// @grant        unsafeWindow
// @run-at       document-start
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560919/%E7%AE%80%E5%8C%96%E7%89%88API%E6%8B%A6%E6%88%AA%E5%99%A8%E9%85%8D%E7%BD%AE%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/560919/%E7%AE%80%E5%8C%96%E7%89%88API%E6%8B%A6%E6%88%AA%E5%99%A8%E9%85%8D%E7%BD%AE%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const CURRENT_VERSION = '1.4.2';

  // ============================================
  // 🚫 只在顶层窗口运行，忽略 iframe
  // ============================================
  if (window.self !== window.top) {
    console.log('⏭️ [API拦截器] 检测到iframe，跳过执行', window.location.href);
    return;
  }
  console.log('✅ [API拦截器] 在顶层窗口中运行');

  // ============================================
  // 🔔 网页内通知系统
  // ============================================
  function showInPageNotification (title, message, type = 'info', duration = 3000, onclick = null) {
    // 创建通知容器（如果不存在）
    let container = document.getElementById('interceptor-notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'interceptor-notification-container';
      container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
      document.body.appendChild(container);
    }

    // 创建通知元素
    const notification = document.createElement('div');
    const notificationId = 'notification-' + Date.now();
    notification.id = notificationId;

    // 根据类型选择颜色
    const colors = {
      info: { bg: '#007acc', icon: '🔍' },
      success: { bg: '#28a745', icon: '✅' },
      warning: { bg: '#ffc107', icon: '⚠️' },
      error: { bg: '#dc3545', icon: '❌' },
      update: { bg: '#17a2b8', icon: '🔄' }
    };

    const color = colors[type] || colors.info;

    notification.style.cssText = `
    background: ${color.bg};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    min-width: 300px;
    max-width: 400px;
    pointer-events: auto;
    cursor: ${onclick ? 'pointer' : 'default'};
    animation: slideIn 0.3s ease-out;
    transition: all 0.3s ease;
  `;

    notification.innerHTML = `
    <div style="display: flex; align-items: flex-start; gap: 12px;">
      <div style="font-size: 24px; line-height: 1;">${color.icon}</div>
      <div style="flex: 1;">
        <div style="font-weight: bold; margin-bottom: 5px; font-size: 14px;">${title}</div>
        <div style="font-size: 12px; line-height: 1.4; white-space: pre-line;">${message}</div>
      </div>
      <div style="font-size: 20px; opacity: 0.7; cursor: pointer; line-height: 1;" 
           onclick="this.parentElement.parentElement.remove()">×</div>
    </div>
  `;

    // 添加动画样式
    if (!document.getElementById('interceptor-notification-style')) {
      const style = document.createElement('style');
      style.id = 'interceptor-notification-style';
      style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
      document.head.appendChild(style);
    }

    // 点击事件
    if (onclick) {
      notification.onclick = function () {
        onclick();
        notification.remove();
      };

      // 鼠标悬停效果
      notification.onmouseenter = function () {
        this.style.transform = 'scale(1.02)';
        this.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
      };
      notification.onmouseleave = function () {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
      };
    }

    container.appendChild(notification);

    // 自动消失
    if (duration > 0) {
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
          notification.remove();
          // 如果容器为空，删除容器
          if (container.children.length === 0) {
            container.remove();
          }
        }, 300);
      }, duration);
    }

    return notification;
  }

  // ============================================
  // 🔄 自定义更新检查（带降级和详细提示）
  // ============================================
  const UPDATE_URLS = [
    'https://raw.githubusercontent.com/wuqi-y/interceptor/main/simple_interceptor_panel.user.js',
    'https://cdn.jsdelivr.net/gh/wuqi-y/interceptor@main/simple_interceptor_panel.user.js',
    'https://github.com/wuqi-y/interceptor/raw/main/simple_interceptor_panel.user.js'
  ];

  // 检查更新
  function checkForUpdates (isManual = false) {
    const lastCheck = GM_getValue('last_update_check', 0);
    const now = Date.now();

    // 自动检查：每24小时检查一次
    if (!isManual && now - lastCheck < 24 * 60 * 60 * 1000) {
      console.log('⏭️ [更新检查] 距上次检查未满24小时，跳过');
      return;
    }

    console.log('🔍 [更新检查] 开始检查更新...');

    // 显示开始检查的提示（仅手动检查时）
    if (isManual) {
      showInPageNotification(
        '🔍 API拦截器',
        '正在检查更新...\n请稍候',
        'info',
        3000
      );
    }

    tryNextUpdateUrl(0, isManual);
  }

  function tryNextUpdateUrl (index, isManual) {
    if (index >= UPDATE_URLS.length) {
      console.warn('⚠️ [更新检查] 所有更新源均失败');
      GM_setValue('last_update_check', Date.now());

      // 所有源都失败时的提示
      if (isManual) {
        showInPageNotification(
          '❌ 更新检查失败',
          '所有更新源均无法访问\n请检查网络连接或稍后重试',
          'error',
          5000
        );
      }
      return;
    }

    const url = UPDATE_URLS[index];
    const sourceName = url.includes('jsdelivr') ? 'jsDelivr CDN' :
      url.includes('raw.githubusercontent') ? 'GitHub Raw' : 'GitHub';

    console.log(`🔍 [更新检查] 尝试源 ${index + 1}/${UPDATE_URLS.length}: ${sourceName}`);

    // 显示正在尝试的源（仅手动检查时，且不是第一个源）
    if (isManual && index > 0) {
      showInPageNotification(
        '🔄 切换更新源',
        `正在尝试: ${sourceName}\n(${index + 1}/${UPDATE_URLS.length})`,
        'update',
        2000
      );
    }

    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      timeout: 10000,
      onload: function (response) {
        if (response.status === 200) {
          const scriptContent = response.responseText;

          // 提取版本号
          const versionMatch = scriptContent.match(/@version\s+([\d.]+)/);
          if (versionMatch) {
            const remoteVersion = versionMatch[1];
            console.log(`✅ [更新检查] 远程版本: ${remoteVersion}, 当前版本: ${CURRENT_VERSION}`);

            if (compareVersion(remoteVersion, CURRENT_VERSION) > 0) {
              // 发现新版本
              const updateUrl = url.replace('@main', '@latest');
              showInPageNotification(
                '🎉 发现新版本！',
                `v${remoteVersion} 可用 (当前: v${CURRENT_VERSION})\n来源: ${sourceName}\n\n点击安装更新`,
                'success',
                0, // 不自动消失
                function () {
                  window.open(updateUrl, '_blank');
                }
              );
              console.log(`🎉 [更新检查] 发现新版本: ${remoteVersion}，来源: ${sourceName}`);
            } else {
              console.log('✅ [更新检查] 当前已是最新版本');

              // 已是最新版本的提示（仅手动检查时）
              if (isManual) {
                showInPageNotification(
                  '✅ 已是最新版本',
                  `当前版本: v${CURRENT_VERSION}\n检查源: ${sourceName}\n\n无需更新`,
                  'success',
                  5000
                );
              }
            }

            GM_setValue('last_update_check', Date.now());
          } else {
            console.warn(`⚠️ [更新检查] 无法从响应中提取版本号`);
            tryNextUpdateUrl(index + 1, isManual);
          }
        } else {
          console.warn(`⚠️ [更新检查] ${sourceName} 返回 ${response.status}，尝试下一个源...`);
          tryNextUpdateUrl(index + 1, isManual);
        }
      },
      onerror: function () {
        console.warn(`⚠️ [更新检查] ${sourceName} 连接失败，尝试下一个源...`);
        tryNextUpdateUrl(index + 1, isManual);
      },
      ontimeout: function () {
        console.warn(`⚠️ [更新检查] ${sourceName} 超时，尝试下一个源...`);
        tryNextUpdateUrl(index + 1, isManual);
      }
    });
  }

  // 比较版本号
  function compareVersion (v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      if (p1 > p2) return 1;
      if (p1 < p2) return -1;
    }
    return 0;
  }

  // ============================================
  // 📋 配置管理（新数据结构）
  // ============================================
  const ALL_CONFIGS_KEY = 'interceptor_all_domain_configs'; // 所有域名配置的总key

  // 默认配置（单个域名）
  const DEFAULT_DOMAIN_CONFIG = {
    enabled: false, // 该域名是否启用拦截器
    rules: [],
    globalHeaders: {
      enabled: false,
      headers: []
    },
    panelVisible: false
  };

  // ========== 获取当前域名 ==========
  function getCurrentDomain () {
    return window.location.hostname;
  }

  // ========== 加载所有域名配置 ==========
  function loadAllConfigs () {
    try {
      const saved = GM_getValue(ALL_CONFIGS_KEY);
      if (saved) {
        return typeof saved === 'string' ? JSON.parse(saved) : saved;
      }
      return {}; // { "domain1.com": {...config}, "domain2.com": {...config} }
    } catch (e) {
      console.error('❌ 加载所有配置失败:', e);
      return {};
    }
  }

  // ========== 保存所有域名配置 ==========
  function saveAllConfigs (allConfigs) {
    try {
      GM_setValue(ALL_CONFIGS_KEY, allConfigs);
      console.log('✅ 所有域名配置已保存');
    } catch (e) {
      console.error('❌ 保存所有配置失败:', e);
    }
  }

  // ========== 获取当前域名的配置（不自动创建空配置） ==========
  function getCurrentDomainConfig () {
    const domain = getCurrentDomain();
    const allConfigs = loadAllConfigs();
    // 如果当前域名没有配置，返回默认配置（但不保存）
    if (!allConfigs[domain]) {
      console.log(`📋 域名 ${domain} 没有保存的配置，使用默认配置`);
      return JSON.parse(JSON.stringify(DEFAULT_DOMAIN_CONFIG));
    }
    return allConfigs[domain];
  }

  // ========== 保存当前域名的配置（优化：如果配置为空则删除） ==========
  function saveCurrentDomainConfig (config) {
    const domain = getCurrentDomain();
    const allConfigs = loadAllConfigs();
    // 判断配置是否为空（没有规则且没有Header）
    const hasRules = config.rules && config.rules.length > 0;
    const hasHeaders = config.globalHeaders?.headers && config.globalHeaders.headers.length > 0;
    if (!hasRules && !hasHeaders) {
      // 如果配置为空，删除该域名的配置
      delete allConfigs[domain];
      console.log(`🗑️ 域名 ${domain} 配置为空，已从缓存中删除`);
    } else {
      // 否则保存配置
      allConfigs[domain] = config;
      console.log(`✅ 域名 ${domain} 的配置已保存`);
    }
    saveAllConfigs(allConfigs);
    // 同步到页面环境
    if (unsafeWindow.__interceptorConfig) {
      unsafeWindow.__interceptorConfig = JSON.parse(JSON.stringify(config));
    }
  }

  // ========== 获取当前域名的开关状态 ==========
  function isInterceptorEnabled () {
    const config = getCurrentDomainConfig();
    return config.enabled === true;
  }

  // ========== 设置当前域名的开关状态 ==========
  function setInterceptorEnabled (enabled) {
    const config = getCurrentDomainConfig();
    config.enabled = enabled;
    saveCurrentDomainConfig(config);

    // 同步到页面环境
    if (unsafeWindow.__setInterceptorEnabled) {
      unsafeWindow.__setInterceptorEnabled(enabled);
    }

    console.log(`🔄 当前域名(${getCurrentDomain()})拦截器已${enabled ? '启用' : '禁用'}`);
  }

  // ========== 获取所有已配置的域名列表 ==========
  function getAllDomains () {
    const allConfigs = loadAllConfigs();
    return Object.keys(allConfigs).sort();
  }

  // 当前域名的配置
  let config = getCurrentDomainConfig();

  // 保存配置（简化版，直接保存当前域名）
  function saveConfig () {
    saveCurrentDomainConfig(config);
  }

  // ============================================
  // 🎯 核心拦截逻辑 - 注入到页面环境
  // ============================================
  function injectInterceptor () {
    const script = document.createElement('script');
    const initialEnabled = isInterceptorEnabled();

    script.textContent = `
(function() {
  console.log('🚀 [API拦截器] 开始注入到页面环境');

  // 全局开关状态
  window.__interceptorEnabled = ${initialEnabled};

  window.__setInterceptorEnabled = function(enabled) {
    window.__interceptorEnabled = enabled;
    console.log('🔄 [API拦截器] 全局开关已' + (enabled ? '启用' : '禁用'));
  };

  window.__getInterceptorEnabled = function() {
    return window.__interceptorEnabled;
  };

  // 配置访问函数
  window.__interceptorConfig = ${JSON.stringify(config)};

  window.__getConfig = function() {
    return window.__interceptorConfig || {};
  };

  window.__updateConfig = function(newConfig) {
    window.__interceptorConfig = newConfig;
  };

  // 工具函数
  function findMatchingRule(url) {
    if (!window.__getInterceptorEnabled()) {
      return null;
    }

    const cfg = window.__getConfig();
    if (!cfg || !cfg.rules) return null;
    return cfg.rules.find(rule => {
      if (!rule.enabled) return false;
      return url.includes(rule.match);
    });
  }

  function isDomainMatch(url, domains) {
    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      return true;
    }
    try {
      const urlObj = new URL(url, window.location.origin);
      const hostname = urlObj.hostname.toLowerCase();
      return domains.some(domain => {
        const domainLower = domain.toLowerCase();
        return hostname === domainLower || hostname.endsWith('.' + domainLower);
      });
    } catch (e) {
      return true;
    }
  }

  function getEnabledGlobalHeaders(url) {
    if (!window.__getInterceptorEnabled()) {
      return {};
    }

    const cfg = window.__getConfig();
    if (!cfg || !cfg.globalHeaders || !cfg.globalHeaders.enabled) {
      return {};
    }
    const headers = {};
    (cfg.globalHeaders.headers || []).forEach(header => {
      if (header && header.enabled && header.name && isDomainMatch(url, header.domains)) {
        headers[header.name] = header.value || '';
      }
    });
    return headers;
  }

  function executeModifyScript(script, originalData, requestInfo) {
    try {
      const modifyFunction = new Function('modified', 'originalData', 'requestInfo', script);
      const modified = JSON.parse(JSON.stringify(originalData));
      modifyFunction(modified, originalData, requestInfo);
      return modified;
    } catch (e) {
      console.error('❌ 执行修改脚本失败:', e);
      return originalData;
    }
  }

  // ===== 拦截 XMLHttpRequest =====
  const OriginalXHR = window.XMLHttpRequest;

  window.XMLHttpRequest = function() {
    const xhr = new OriginalXHR();
    const originalOpen = xhr.open;
    const originalSend = xhr.send;
    const originalSetRequestHeader = xhr.setRequestHeader;

    let interceptRule = null;
    let requestInfo = { method: '', url: '', timestamp: Date.now() };
    let requestHeaders = {};
    let isHeadersLocked = false;

    xhr.setRequestHeader = function(name, value) {
      if (!isHeadersLocked) {
        requestHeaders[name] = value;
      }
      return originalSetRequestHeader.apply(this, arguments);
    };

    xhr.open = function(method, url, ...args) {
      requestInfo.method = method;
      requestInfo.url = url;
      interceptRule = findMatchingRule(url);
      return originalOpen.apply(this, [method, url, ...args]);
    };

    xhr.send = function(body) {
      const self = this;

      const globalHeaders = getEnabledGlobalHeaders(requestInfo.url);
      Object.keys(globalHeaders).forEach(name => {
        try {
          originalSetRequestHeader.call(this, name, globalHeaders[name]);
          console.log(\`🌐 [XHR] 注入全局Header: \${name} = \${globalHeaders[name]}\`);
        } catch (e) {
          console.error(\`❌ [XHR] 注入Header失败: \${name}\`, e);
        }
      });

      isHeadersLocked = true;

      if (interceptRule) {
        console.log(\`🎯 [XHR] 拦截请求: \${requestInfo.url}\`, interceptRule);

        const originalOnReadyStateChange = this.onreadystatechange;

        this.onreadystatechange = function() {
          if (this.readyState === 4) {
            try {
              let modifiedData;

              if (this.status === 200) {
                const originalData = JSON.parse(this.responseText || '{}');

                if (interceptRule.mode === 'replace') {
                  modifiedData = interceptRule.responseData;
                  console.log('✅ [XHR] 使用完全替换模式');
                } else if (interceptRule.mode === 'modify') {
                  modifiedData = executeModifyScript(
                    interceptRule.modifyScript,
                    originalData,
                    requestInfo
                  );
                  console.log('✅ [XHR] 使用部分修改模式');
                }
              } else {
                console.warn(\`⚠️ [XHR] 请求失败(status: \${this.status}), 使用mock数据\`);

                if (interceptRule.mode === 'replace') {
                  modifiedData = interceptRule.responseData;
                } else {
                  modifiedData = executeModifyScript(
                    interceptRule.modifyScript,
                    {},
                    requestInfo
                  );
                }

                Object.defineProperty(this, 'status', {
                  writable: true,
                  configurable: true,
                  value: 200
                });
                Object.defineProperty(this, 'statusText', {
                  writable: true,
                  configurable: true,
                  value: 'OK'
                });
              }

              if (modifiedData) {
                const modifiedText = JSON.stringify(modifiedData);

                Object.defineProperty(this, 'responseText', {
                  writable: true,
                  configurable: true,
                  value: modifiedText
                });

                Object.defineProperty(this, 'response', {
                  writable: true,
                  configurable: true,
                  value: modifiedText
                });

                console.log('✅ [XHR] 响应数据已修改');
              }
            } catch (e) {
              console.error('❌ [XHR] 修改响应失败:', e);
            }
          }

          if (originalOnReadyStateChange) {
            originalOnReadyStateChange.apply(this, arguments);
          }
        };

        const originalOnError = this.onerror;
        this.onerror = function(e) {
          console.warn('⚠️ [XHR] 请求错误, 返回mock数据');

          try {
            let modifiedData;
            if (interceptRule.mode === 'replace') {
              modifiedData = interceptRule.responseData;
            } else {
              modifiedData = executeModifyScript(interceptRule.modifyScript, {}, requestInfo);
            }

            Object.defineProperty(this, 'status', { value: 200, writable: true });
            Object.defineProperty(this, 'statusText', { value: 'OK', writable: true });
            Object.defineProperty(this, 'readyState', { value: 4, writable: true });
            Object.defineProperty(this, 'responseText', { value: JSON.stringify(modifiedData), writable: true });
            Object.defineProperty(this, 'response', { value: JSON.stringify(modifiedData), writable: true });

            if (this.onreadystatechange) {
              this.onreadystatechange();
            }
          } catch (err) {
            console.error('❌ [XHR] 错误处理失败:', err);
            if (originalOnError) {
              originalOnError.apply(this, arguments);
            }
          }
        };
      }

      return originalSend.apply(this, arguments);
    };

    return xhr;
  };

  window.XMLHttpRequest.prototype = OriginalXHR.prototype;

  // ===== 拦截 Fetch =====
  if (window.fetch) {
    const originalFetch = window.fetch;

    window.fetch = function(url, options = {}) {
      const requestUrl = typeof url === 'string' ? url : url.url;
      const requestInfo = {
        method: options.method || 'GET',
        url: requestUrl,
        timestamp: Date.now()
      };

      const globalHeaders = getEnabledGlobalHeaders(requestUrl);
      if (Object.keys(globalHeaders).length > 0) {
        options = { ...options };
        options.headers = options.headers || {};

        if (options.headers instanceof Headers) {
          const headersObj = {};
          for (let [key, value] of options.headers.entries()) {
            headersObj[key] = value;
          }
          options.headers = headersObj;
        }

        Object.assign(options.headers, globalHeaders);
        console.log('🌐 [Fetch] 注入全局Headers:', globalHeaders);
      }

      const interceptRule = findMatchingRule(requestUrl);

      if (interceptRule) {
        console.log(\`🎯 [Fetch] 拦截请求: \${requestUrl}\`, interceptRule);

        return originalFetch.call(this, url, options)
          .then(response => {
            return response.clone().text().then(text => {
              try {
                const originalData = text ? JSON.parse(text) : {};
                let modifiedData;

                if (interceptRule.mode === 'replace') {
                  modifiedData = interceptRule.responseData;
                  console.log('✅ [Fetch] 使用完全替换模式');
                } else {
                  modifiedData = executeModifyScript(
                    interceptRule.modifyScript,
                    originalData,
                    requestInfo
                  );
                  console.log('✅ [Fetch] 使用部分修改模式');
                }

                return new Response(
                  JSON.stringify(modifiedData),
                  {
                    status: 200,
                    statusText: 'OK',
                    headers: response.headers
                  }
                );
              } catch (e) {
                console.error('❌ [Fetch] 处理响应失败:', e);
                return response;
              }
            });
          })
          .catch(error => {
            console.warn('⚠️ [Fetch] 请求失败, 返回mock数据:', error);

            let modifiedData;
            if (interceptRule.mode === 'replace') {
              modifiedData = interceptRule.responseData;
            } else {
              modifiedData = executeModifyScript(interceptRule.modifyScript, {}, requestInfo);
            }

            return new Response(
              JSON.stringify(modifiedData),
              {
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json' })
              }
            );
          });
      }

      return originalFetch.call(this, url, options);
    };
  }

  console.log('✅ [API拦截器] 注入完成，当前状态:', window.__getInterceptorEnabled() ? '启用' : '禁用');
})();
    `;

    (document.head || document.documentElement).appendChild(script);
    script.remove();
  }

  // ============================================
  // 渲染函数
  // ============================================
  function renderGlobalHeaders () {
    const headersList = document.getElementById('global-headers-list');
    if (!headersList) return;

    if (!config.globalHeaders || !config.globalHeaders.headers || config.globalHeaders.headers.length === 0) {
      headersList.innerHTML = '<div style="color: #999; font-size: 12px; font-style: italic; padding: 8px; text-align: center;">暂无Header配置</div>';
      return;
    }

    headersList.innerHTML = config.globalHeaders.headers.map((header, index) => {
      const domainText = header.domains && header.domains.length > 0
        ? header.domains.join(', ')
        : '所有域名';

      return `
        <div style="border: 1px solid ${header.enabled ? '#28a745' : '#ddd'};
                    padding: 10px; margin-bottom: 8px; border-radius: 4px;
                    background: ${header.enabled ? '#f8fff8' : '#f9f9f9'};">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="font-size: 13px; color: #333;">${escapeHtml(header.name || '未命名')}</strong>
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input type="checkbox" ${header.enabled ? 'checked' : ''}
                     data-action="toggleHeader" data-index="${index}"
                     style="margin-right: 5px; cursor: pointer;">
              <span style="font-size: 12px; color: ${header.enabled ? '#28a745' : '#666'};">
                ${header.enabled ? '已启用' : '已禁用'}
              </span>
            </label>
          </div>
          <div style="font-size: 11px; color: #666; margin-bottom: 4px; word-break: break-all;">
            值: <code style="background: #f5f5f5; padding: 2px 4px; border-radius: 2px;">${escapeHtml(header.value || '')}</code>
          </div>
          <div style="font-size: 11px; color: #007acc; margin-bottom: 8px;">
            🌍 域名: ${escapeHtml(domainText)}
          </div>
          <div style="display: flex; gap: 6px;">
            <button data-action="editHeader" data-index="${index}"
                    style="background: #ffc107; color: #000; border: none;
                           padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px;">
              ✏️ 编辑
            </button>
            <button data-action="deleteHeader" data-index="${index}"
                    style="background: #dc3545; color: white; border: none;
                           padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px;">
              🗑️ 删除
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderRulesList () {
    const rulesList = document.getElementById('rules-list');
    if (!rulesList) return;

    if (!config.rules || config.rules.length === 0) {
      rulesList.innerHTML = '<div style="color: #999; font-size: 12px; font-style: italic; padding: 12px; text-align: center; border: 1px dashed #ddd; border-radius: 4px;">暂无拦截规则</div>';
      return;
    }

    rulesList.innerHTML = config.rules.map(rule => `
      <div style="border: 1px solid ${rule.enabled ? '#007acc' : '#ddd'};
                  padding: 10px; margin-bottom: 10px; border-radius: 4px;
                  background: ${rule.enabled ? '#f0f8ff' : '#f9f9f9'};">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <strong style="font-size: 13px; color: #333;">${escapeHtml(rule.name)}</strong>
          <label style="display: flex; align-items: center; cursor: pointer;">
                   <input type="checkbox" ${rule.enabled ? 'checked' : ''}
                          data-action="toggleRule" data-id="${rule.id}"
                          onclick="event.preventDefault();"
                          style="margin-right: 5px; cursor: pointer;">
            <span style="font-size: 12px; color: ${rule.enabled ? '#007acc' : '#666'};">
              ${rule.enabled ? '已启用' : '已禁用'}
            </span>
          </label>
        </div>
        <div style="font-size: 11px; color: #666; margin-bottom: 4px; word-break: break-all;">
          🎯 匹配: <code style="background: #f5f5f5; padding: 2px 4px; border-radius: 2px;">${escapeHtml(rule.match)}</code>
        </div>
        <div style="font-size: 11px; color: #007acc; margin-bottom: 8px;">
          🔧 模式: ${rule.mode === 'replace' ? '完全替换' : '部分修改'}
        </div>
        <div style="display: flex; gap: 6px;">
          <button data-action="editRule" data-id="${rule.id}"
                  style="background: #ffc107; color: #000; border: none;
                         padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px;">
            ✏️ 编辑
          </button>
          <button data-action="deleteRule" data-id="${rule.id}"
                  style="background: #dc3545; color: white; border: none;
                         padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px;">
            🗑️ 删除
          </button>
          <button data-action="duplicateRule" data-id="${rule.id}"
                  style="background: #6c757d; color: white; border: none;
                         padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px;">
            📋 复制
          </button>
        </div>
      </div>
    `).join('');
  }

  // ========== 新增：渲染所有域名列表 ==========
  function renderDomainList () {
    const domainListEl = document.getElementById('domain-list');
    if (!domainListEl) return;
    const allDomains = getAllDomains();
    const currentDomain = getCurrentDomain();
    if (allDomains.length === 0) {
      domainListEl.innerHTML = '<div style="color: #999; font-size: 12px; padding: 8px; text-align: center;">暂无已配置的域名</div>';
      return;
    }
    domainListEl.innerHTML = allDomains.map(domain => {
      const domainConfig = loadAllConfigs()[domain];
      const isCurrent = domain === currentDomain;
      const enabled = domainConfig.enabled;
      const rulesCount = domainConfig.rules?.length || 0;
      const headersCount = domainConfig.globalHeaders?.headers?.length || 0;
      return `
      <div style="border: 1px solid ${isCurrent ? '#007acc' : '#ddd'};
                  padding: 10px; margin-bottom: 8px; border-radius: 4px;
                  background: ${isCurrent ? '#e3f2fd' : '#f9f9f9'};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
          <div style="flex: 1;">
            <div style="font-size: 13px; font-weight: bold; color: #333; margin-bottom: 4px;">
              ${isCurrent ? '🔵 ' : ''}${escapeHtml(domain)}
              ${isCurrent ? '<span style="color: #007acc; font-size: 11px;">(当前)</span>' : ''}
            </div>
            <div style="font-size: 11px; color: #666;">
              状态: <span style="color: ${enabled ? '#28a745' : '#dc3545'};">${enabled ? '✅ 已启用' : '⭕ 已禁用'}</span> |
              规则: ${rulesCount}个 |
              Header: ${headersCount}个
            </div>
          </div>
          <div style="display: flex; gap: 4px; flex-direction: column;">
            <button data-action="copyDomainConfig" data-domain="${escapeHtml(domain)}"
                    style="background: #17a2b8; color: white; border: none;
                           padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px;
                           white-space: nowrap;">
              📋 复制配置
            </button>
            ${!isCurrent ? `
              <button data-action="deleteDomain" data-domain="${escapeHtml(domain)}"
                      style="background: #dc3545; color: white; border: none;
                             padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px;">
                🗑️ 删除
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    }).join('');
  }

  function updateMasterSwitchUI () {
    const masterSwitch = document.getElementById('master-switch');
    const switchStatus = document.getElementById('switch-status');
    const currentDomainEl = document.getElementById('current-domain');
    const rulesCountEl = document.getElementById('rules-count');
    const headersCountEl = document.getElementById('headers-count');

    if (masterSwitch && switchStatus && currentDomainEl) {
      const enabled = isInterceptorEnabled();
      masterSwitch.checked = enabled;
      switchStatus.textContent = enabled ? '已启用' : '已禁用';
      switchStatus.style.color = enabled ? '#28a745' : '#dc3545';
      currentDomainEl.textContent = getCurrentDomain();

      if (rulesCountEl) {
        rulesCountEl.textContent = `${config.rules?.length || 0}个`;
      }
      if (headersCountEl) {
        headersCountEl.textContent = `${config.globalHeaders?.headers?.length || 0}个`;
      }
    }
  }

  function escapeHtml (text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================
  // 🎨 JSON/脚本编辑器弹窗
  // ============================================
  function showJsonEditor (data, onSave) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 10000000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
    background: white;
    border-radius: 8px;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  `;

    dialog.innerHTML = `
    <div style="padding: 15px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
      <h3 style="margin: 0; color: #333; font-size: 16px;">📝 编辑响应数据 (JSON)</h3>
      <button id="close-json-editor" style="background: none; border: none; font-size: 24px; color: #999; cursor: pointer; padding: 0; width: 30px; height: 30px;">×</button>
    </div>
    <div style="flex: 1; padding: 15px; overflow: hidden; display: flex; flex-direction: column;">
      <textarea id="json-editor-textarea" style="
        flex: 1;
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.5;
        resize: none;
        outline: none;
      "></textarea>
      <div id="json-error" style="color: #dc3545; font-size: 12px; margin-top: 8px; display: none;"></div>
    </div>
    <div style="padding: 15px 20px; border-top: 1px solid #eee; display: flex; gap: 10px; justify-content: flex-end;">
      <button id="format-json-btn" style="background: #17a2b8; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
        🎨 格式化
      </button>
      <button id="cancel-json-btn" style="background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
        ❌ 取消
      </button>
      <button id="save-json-btn" style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
        ✅ 保存
      </button>
    </div>
  `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const textarea = dialog.querySelector('#json-editor-textarea');
    const errorDiv = dialog.querySelector('#json-error');

    // 初始化内容（格式化显示）
    textarea.value = JSON.stringify(data, null, 2);

    // 格式化按钮
    dialog.querySelector('#format-json-btn').onclick = () => {
      try {
        const parsed = JSON.parse(textarea.value);
        textarea.value = JSON.stringify(parsed, null, 2);
        errorDiv.style.display = 'none';
      } catch (e) {
        errorDiv.textContent = '❌ JSON格式错误: ' + e.message;
        errorDiv.style.display = 'block';
      }
    };

    // 保存按钮
    dialog.querySelector('#save-json-btn').onclick = () => {
      try {
        const parsed = JSON.parse(textarea.value);
        document.body.removeChild(overlay);
        onSave(parsed);
      } catch (e) {
        errorDiv.textContent = '❌ JSON格式错误: ' + e.message;
        errorDiv.style.display = 'block';
      }
    };

    // 取消按钮
    dialog.querySelector('#cancel-json-btn').onclick = () => {
      document.body.removeChild(overlay);
    };

    // 关闭按钮
    dialog.querySelector('#close-json-editor').onclick = () => {
      document.body.removeChild(overlay);
    };

    // 点击遮罩关闭
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    };

    // 自动聚焦
    setTimeout(() => textarea.focus(), 100);
  }

  function showScriptEditor (script, onSave) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 10000000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
    background: white;
    border-radius: 8px;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  `;

    dialog.innerHTML = `
    <div style="padding: 15px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
      <h3 style="margin: 0; color: #333; font-size: 16px;">📝 编辑修改脚本</h3>
      <button id="close-script-editor" style="background: none; border: none; font-size: 24px; color: #999; cursor: pointer; padding: 0; width: 30px; height: 30px;">×</button>
    </div>
    <div style="flex: 1; padding: 15px; overflow: hidden; display: flex; flex-direction: column;">
      <div style="background: #f8f9fa; padding: 10px; border-radius: 4px; margin-bottom: 10px; font-size: 12px; color: #666;">
        💡 <strong>提示：</strong>使用 <code>modified</code> 对象修改数据，可访问 <code>originalData</code> 和 <code>requestInfo</code>
      </div>
      <textarea id="script-editor-textarea" style="
        flex: 1;
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.5;
        resize: none;
        outline: none;
      " placeholder="// 示例：&#10;modified.resultObj.ticketTitle = '新标题';&#10;modified.success = false;"></textarea>
    </div>
    <div style="padding: 15px 20px; border-top: 1px solid #eee; display: flex; gap: 10px; justify-content: flex-end;">
      <button id="cancel-script-btn" style="background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
        ❌ 取消
      </button>
      <button id="save-script-btn" style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
        ✅ 保存
      </button>
    </div>
  `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const textarea = dialog.querySelector('#script-editor-textarea');
    textarea.value = script;

    // 保存按钮
    dialog.querySelector('#save-script-btn').onclick = () => {
      document.body.removeChild(overlay);
      onSave(textarea.value);
    };

    // 取消按钮
    dialog.querySelector('#cancel-script-btn').onclick = () => {
      document.body.removeChild(overlay);
    };

    // 关闭按钮
    dialog.querySelector('#close-script-editor').onclick = () => {
      document.body.removeChild(overlay);
    };

    // 点击遮罩关闭
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    };

    // 自动聚焦
    setTimeout(() => textarea.focus(), 100);
  }

  // ============================================
  // 操作函数
  // ============================================
  const operations = {
    toggleRule (id) {
      const rule = config.rules.find(r => r.id === parseInt(id));
      if (!rule) return;

      // 如果是启用操作，检查是否有相同匹配规则
      if (!rule.enabled) {
        // 只查找已启用的相同匹配URL的规则
        const enabledConflicts = config.rules.filter(r =>
          r.id !== rule.id &&
          r.match === rule.match &&
          r.enabled
        );

        // 只有存在已启用的冲突规则时才提示
        if (enabledConflicts.length > 0) {
          let warningMsg = `⚠️ 匹配URL冲突检测\n\n`;
          warningMsg += `当前规则: "${rule.name}"\n`;
          warningMsg += `匹配URL: ${rule.match}\n\n`;
          warningMsg += `🔴 以下${enabledConflicts.length}个规则正在使用相同的匹配URL（将被自动禁用）:\n`;
          enabledConflicts.forEach((r, i) => {
            warningMsg += `${i + 1}. "${r.name}" [模式: ${r.mode === 'replace' ? '完全替换' : '部分修改'}]\n`;
          });
          warningMsg += `\n💡 提示: 同一匹配URL只能有一个规则生效\n\n`;
          warningMsg += `是否继续启用当前规则？`;

          if (!confirm(warningMsg)) {
            // 👈 取消时不做任何操作，保持原状态
            console.log(`❌ 用户取消启用规则 "${rule.name}"`);
            return;
          }

          // 禁用所有相同匹配的已启用规则
          enabledConflicts.forEach(r => {
            r.enabled = false;
            console.log(`🔄 自动禁用规则 "${r.name}"（匹配URL: ${r.match}）`);
          });

          console.log(`✅ 已自动禁用 ${enabledConflicts.length} 个冲突规则`);
        }
      }

      // 切换当前规则状态
      rule.enabled = !rule.enabled;

      saveConfig();
      renderRulesList();  // 👈 重新渲染，确保UI状态正确
      updateMasterSwitchUI();

      console.log(`🔄 规则 "${rule.name}" 已${rule.enabled ? '启用' : '禁用'}`);
    },

    deleteRule (id) {
      const rule = config.rules.find(r => r.id === parseInt(id));
      if (rule && confirm(`⚠️ 确定要删除规则 "${rule.name}" 吗？`)) {
        config.rules = config.rules.filter(r => r.id !== parseInt(id));
        saveConfig();
        renderRulesList();
        updateMasterSwitchUI();
        alert('✅ 规则已删除');
      }
    },

    duplicateRule (id) {
      const rule = config.rules.find(r => r.id === parseInt(id));
      if (rule) {
        const newRule = JSON.parse(JSON.stringify(rule));
        newRule.id = Date.now();
        newRule.name = rule.name + ' (副本)';
        newRule.enabled = false;
        config.rules.push(newRule);
        saveConfig();
        renderRulesList();
        updateMasterSwitchUI();
        alert('✅ 规则已复制');
      }
    },

    editRule (id) {
      const rule = config.rules.find(r => r.id === parseInt(id));
      if (!rule) return;

      const newName = prompt('📝 规则名称:', rule.name);
      if (newName === null) return;

      const newMatch = prompt('🎯 匹配URL:', rule.match);
      if (newMatch === null) return;

      const modeChoice = confirm('🔧 点击"确定"选择"部分修改"模式\n点击"取消"选择"完全替换"模式\n\n当前模式: ' + (rule.mode === 'replace' ? '完全替换' : '部分修改'));
      const newMode = modeChoice ? 'modify' : 'replace';

      rule.name = newName.trim() || rule.name;
      rule.match = newMatch.trim() || rule.match;
      rule.mode = newMode;

      if (newMode === 'replace') {
        // ========== 修改：使用弹窗编辑JSON ==========
        showJsonEditor(rule.responseData, (newData) => {
          rule.responseData = newData;
          saveConfig();
          renderRulesList();
          alert('✅ 规则已更新');
        });
      } else {
        // ========== 修改：使用弹窗编辑脚本 ==========
        showScriptEditor(rule.modifyScript || '', (newScript) => {
          rule.modifyScript = newScript;
          saveConfig();
          renderRulesList();
          alert('✅ 规则已更新');
        });
      }
    },

    toggleHeader (index) {
      index = parseInt(index);
      if (!config.globalHeaders?.headers?.[index]) return;

      config.globalHeaders.headers[index].enabled = !config.globalHeaders.headers[index].enabled;
      saveConfig();
      renderGlobalHeaders();
      console.log(`🔄 Header "${config.globalHeaders.headers[index].name}" 已${config.globalHeaders.headers[index].enabled ? '启用' : '禁用'}`);
    },

    // ========== 新增：复制域名配置到剪贴板 ==========
    copyDomainConfig (domain) {
      try {
        const allConfigs = loadAllConfigs();
        const domainConfig = allConfigs[domain];

        if (!domainConfig) {
          alert('❌ 未找到该域名的配置');
          return;
        }
        // 准备导出格式（与导出功能一致）
        const exportConfig = {
          domain: domain,
          enabled: domainConfig.enabled,
          rules: domainConfig.rules || [],
          globalHeaders: domainConfig.globalHeaders || DEFAULT_DOMAIN_CONFIG.globalHeaders,
          exportTime: new Date().toISOString(),
          version: '1.4.0'
        };
        const configText = JSON.stringify(exportConfig, null, 2);
        // 复制到剪贴板
        if (navigator.clipboard && navigator.clipboard.writeText) {
          // 现代浏览器
          navigator.clipboard.writeText(configText).then(() => {
            alert(`✅ 配置已复制到剪贴板！\n\n源域名: ${domain}\n规则数: ${exportConfig.rules.length}\nHeader数: ${exportConfig.globalHeaders.headers?.length || 0}\n\n可以在其他域名的"从文本导入"处粘贴使用`);
          }).catch(err => {
            console.error('复制失败:', err);
            fallbackCopy(configText, domain, exportConfig);
          });
        } else {
          // 降级方案
          fallbackCopy(configText, domain, exportConfig);
        }
        // 降级复制方案
        function fallbackCopy (text, domain, exportConfig) {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.top = '0';
          textarea.style.left = '0';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();

          try {
            const successful = document.execCommand('copy');
            if (successful) {
              alert(`✅ 配置已复制到剪贴板！\n\n源域名: ${domain}\n规则数: ${exportConfig.rules.length}\nHeader数: ${exportConfig.globalHeaders.headers?.length || 0}\n\n可以在其他域名的"从文本导入"处粘贴使用`);
            } else {
              // 如果复制失败，显示配置让用户手动复制
              showConfigDialog(text, domain);
            }
          } catch (err) {
            console.error('降级复制也失败:', err);
            showConfigDialog(text, domain);
          } finally {
            document.body.removeChild(textarea);
          }
        }
        // 显示配置对话框（作为最后的降级方案）
        function showConfigDialog (text, domain) {
          const dialog = document.createElement('div');
          dialog.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border: 2px solid #007acc;
          border-radius: 8px;
          padding: 20px;
          z-index: 10000000;
          max-width: 600px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;

          dialog.innerHTML = `
          <h3 style="margin: 0 0 10px 0; color: #007acc;">📋 复制配置 - ${escapeHtml(domain)}</h3>
          <p style="margin: 0 0 10px 0; font-size: 13px; color: #666;">
            请手动复制下方配置内容：
          </p>
          <textarea readonly style="width: 100%; height: 300px; padding: 10px;
                                    font-family: monospace; font-size: 12px;
                                    border: 1px solid #ddd; border-radius: 4px;">${text}</textarea>
          <div style="margin-top: 10px; text-align: right;">
            <button id="close-config-dialog" style="background: #007acc; color: white;
                                                    border: none; padding: 8px 16px;
                                                    border-radius: 4px; cursor: pointer;">
              关闭
            </button>
          </div>
        `;

          document.body.appendChild(dialog);

          // 自动选中文本
          const textarea = dialog.querySelector('textarea');
          textarea.select();

          // 关闭按钮
          dialog.querySelector('#close-config-dialog').onclick = () => {
            document.body.removeChild(dialog);
          };
        }

      } catch (e) {
        console.error('复制配置失败:', e);
        alert('❌ 复制配置失败：' + e.message);
      }
    },
    deleteDomain (domain) {
      if (domain === getCurrentDomain()) {
        alert('❌ 不能删除当前域名的配置');
        return;
      }
      if (confirm(`⚠️ 确定要删除域名 "${domain}" 的所有配置吗？\n\n这将删除该域名下的所有规则和Header配置。`)) {
        const allConfigs = loadAllConfigs();
        delete allConfigs[domain];
        saveAllConfigs(allConfigs);
        renderDomainList();
        alert('✅ 域名配置已删除');
      }
    },

    editHeader (index) {
      index = parseInt(index);
      if (!config.globalHeaders?.headers?.[index]) return;

      const header = config.globalHeaders.headers[index];

      const newName = prompt('📝 Header名称:', header.name);
      if (newName === null) return;

      const newValue = prompt('📝 Header值:', header.value);
      if (newValue === null) return;

      const currentDomains = header.domains?.join(', ') || '';
      const newDomains = prompt('🌍 域名过滤 (逗号分隔，留空表示所有域名):', currentDomains);
      if (newDomains === null) return;

      header.name = newName.trim() || header.name;
      header.value = newValue.trim() || header.value;
      header.domains = newDomains.trim()
        ? newDomains.split(',').map(d => d.trim()).filter(d => d)
        : [];

      saveConfig();
      renderGlobalHeaders();
      alert('✅ Header已更新');
    },

    // ========== 新增：删除域名配置 ==========
    deleteDomain (domain) {
      if (domain === getCurrentDomain()) {
        alert('❌ 不能删除当前域名的配置');
        return;
      }

      if (confirm(`⚠️ 确定要删除域名 "${domain}" 的所有配置吗？\n\n这将删除该域名下的所有规则和Header配置。`)) {
        const allConfigs = loadAllConfigs();
        delete allConfigs[domain];
        saveAllConfigs(allConfigs);
        renderDomainList();
        alert('✅ 域名配置已删除');
      }
    }
  };

  // ============================================
  // 创建配置面板
  // ============================================
  function createPanel () {
    const existingPanel = document.getElementById('interceptor-panel');
    if (existingPanel) {
      existingPanel.remove();
    }

    const panel = document.createElement('div');
    panel.id = 'interceptor-panel';
    panel.innerHTML = `
      <div style="position: fixed; top: 10px; right: 10px; width: 500px; max-height: 85vh;
                  background: white; border: 2px solid #007acc; border-radius: 8px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 999999;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                  font-size: 14px; display: ${config.panelVisible ? 'block' : 'block'};">

        <div style="background: linear-gradient(135deg, #007acc 0%, #0056a3 100%);
                    color: white; padding: 12px 15px;
                    display: flex; justify-content: space-between; align-items: center;
                    border-radius: 6px 6px 0 0;">
          <h3 style="margin: 0; font-size: 16px; font-weight: 600;">⚙️ API拦截器配置</h3>
          <button id="close-panel" style="background: rgba(255,255,255,0.2); border: none;
                                         color: white; font-size: 20px; cursor: pointer;
                                         width: 28px; height: 28px; border-radius: 4px;">×</button>
        </div>

        <div style="padding: 15px; max-height: calc(85vh - 60px); overflow-y: auto;">

          <!-- 主开关区域 -->
          <div style="margin-bottom: 20px; border: 2px solid #007acc; border-radius: 6px;
                      padding: 15px; background: linear-gradient(to bottom, #e3f2fd 0%, #ffffff 100%);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <div style="flex: 1;">
                <h4 style="margin: 0 0 5px 0; color: #007acc; font-size: 16px; font-weight: 600;">
                  🔌 拦截器总开关
                </h4>
                <div style="font-size: 11px; color: #666; margin-bottom: 4px;">
                  域名: <code id="current-domain" style="background: #f5f5f5; padding: 2px 6px; border-radius: 2px;">${getCurrentDomain()}</code>
                </div>
                <div style="font-size: 11px; color: #666;">
                  规则: <span id="rules-count">${config.rules?.length || 0}个</span> |
                  Header: <span id="headers-count">${config.globalHeaders?.headers?.length || 0}个</span>
                </div>
              </div>
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" id="master-switch" ${isInterceptorEnabled() ? 'checked' : ''}
                       style="margin-right: 8px; width: 20px; height: 20px; cursor: pointer;">
                <span id="switch-status" style="font-size: 16px; font-weight: bold; color: ${isInterceptorEnabled() ? '#28a745' : '#dc3545'};">
                  ${isInterceptorEnabled() ? '已启用' : '已禁用'}
                </span>
              </label>
            </div>
            <div style="font-size: 12px; color: #666; background: #fff3cd; padding: 8px; border-radius: 4px; border-left: 3px solid #ffc107;">
              💡 <strong>按域名隔离：</strong>每个域名的配置独立存储，互不影响
            </div>
          </div>

          <!-- ========== 新增：已配置域名列表 ========== -->
          <div style="margin-bottom: 20px; border: 1px solid #6c757d; border-radius: 6px;
                      padding: 12px; background: #f8f9fa;">
            <h4 style="margin: 0 0 12px 0; color: #6c757d; font-size: 14px; display: flex; justify-content: space-between; align-items: center;">
              <span>🌐 已配置的域名</span>
              <button id="toggle-domain-list" style="background: none; border: 1px solid #6c757d;
                                                     color: #6c757d; padding: 2px 8px; border-radius: 3px;
                                                     cursor: pointer; font-size: 11px;">
                展开/收起
              </button>
            </h4>
            <div id="domain-list" style="display: none;"></div>
          </div>

          <!-- 全局Header配置 -->
          <div style="margin-bottom: 20px; border: 1px solid #28a745; border-radius: 6px;
                      padding: 12px; background: #f8fff8;">
            <h4 style="margin: 0 0 12px 0; color: #28a745; font-size: 14px;">
              🌐 全局Header配置 <span style="font-size: 11px; color: #666;">(仅当前域名)</span>
            </h4>
            <div style="margin-bottom: 12px;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" id="global-headers-enabled"
                       ${config.globalHeaders?.enabled ? 'checked' : ''}
                       style="margin-right: 8px;">
                <span>启用全局Header注入</span>
              </label>
            </div>
            <div id="global-headers-list"></div>
            <div style="display: flex; gap: 6px; margin-bottom: 8px;">
              <input type="text" id="new-header-name" placeholder="Header名称"
                     style="flex: 1; padding: 6px 8px; border: 1px solid #ddd; border-radius: 4px;">
              <input type="text" id="new-header-value" placeholder="Header值"
                     style="flex: 2; padding: 6px 8px; border: 1px solid #ddd; border-radius: 4px;">
              <button id="add-header" style="background: #28a745; color: white; border: none;
                                            padding: 6px 12px; border-radius: 4px; cursor: pointer;">
                ➕ 添加
              </button>
            </div>
            <input type="text" id="new-header-domains"
                   placeholder="域名过滤（留空=所有域名）"
                   style="width: 100%; padding: 6px 8px; border: 1px solid #ddd; border-radius: 4px;">
          </div>

          <!-- 拦截规则列表 -->
          <div style="margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">
              📋 拦截规则列表 <span style="font-size: 11px; color: #666;">(仅当前域名)</span>
            </h4>
            <div id="rules-list"></div>
          </div>

          <!-- 添加新规则 -->
          <div style="border-top: 1px solid #eee; padding-top: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">➕ 添加新规则</h4>
            <input type="text" id="new-rule-name" placeholder="规则名称"
                   style="width: 100%; padding: 6px 8px; margin-bottom: 6px; border: 1px solid #ddd; border-radius: 4px;">
            <input type="text" id="new-rule-match" placeholder="匹配URL"
                   style="width: 100%; padding: 6px 8px; margin-bottom: 8px; border: 1px solid #ddd; border-radius: 4px;">

            <div style="margin-bottom: 10px; padding: 8px; background: #f5f5f5; border-radius: 4px;">
              <label style="display: inline-flex; align-items: center; margin-right: 20px; cursor: pointer;">
                <input type="radio" name="new-rule-mode" value="replace" checked style="margin-right: 6px;">
                <span>完全替换</span>
              </label>
              <label style="display: inline-flex; align-items: center; cursor: pointer;">
                <input type="radio" name="new-rule-mode" value="modify" style="margin-right: 6px;">
                <span>部分修改</span>
              </label>
            </div>

            <div id="replace-mode-content">
              <textarea id="new-rule-response" placeholder='响应数据 (JSON格式)'
                        style="width: 100%; height: 100px; padding: 8px; margin-bottom: 10px;
                               border: 1px solid #ddd; border-radius: 4px;
                               font-family: monospace; resize: vertical;"></textarea>
            </div>

            <div id="modify-mode-content" style="display: none;">
              <textarea id="new-rule-modify-script"
                        placeholder="// 修改脚本&#10;modified.data.newField = 'value';"
                        style="width: 100%; height: 120px; padding: 8px; margin-bottom: 10px;
                               border: 1px solid #ddd; border-radius: 4px;
                               font-family: monospace; resize: vertical;"></textarea>
            </div>

            <button id="add-rule" style="background: #28a745; color: white; border: none;
                                        padding: 8px 16px; border-radius: 4px; cursor: pointer;">
              ➕ 添加规则
            </button>
          </div>

         <!-- 配置管理 -->
          <div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">🔧 配置管理</h4>
            
            <!-- 当前域名配置 -->
            <div style="margin-bottom: 15px;">
              <div style="font-size: 12px; color: #666; background: #e7f3ff; padding: 8px; border-radius: 4px; margin-bottom: 10px; border-left: 3px solid #007acc;">
                💡 以下操作仅针对<strong>当前域名(${getCurrentDomain()})</strong>
              </div>
              <div style="display: flex; gap: 8px; margin-bottom: 10px; flex-wrap: wrap;">
                <button id="export-config" style="background: #17a2b8; color: white; border: none;
                                                padding: 7px 14px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                  📤 导出当前域名
                </button>
                <label for="import-config-file" style="background: #6f42c1; color: white;
                                                      padding: 7px 14px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                  📥 导入到当前域名
                </label>
                <input type="file" id="import-config-file" accept=".json" style="display: none;">
                <button id="reset-config" style="background: #dc3545; color: white; border: none;
                                                padding: 7px 14px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                  🔄 重置当前域名
                </button>
              </div>
            </div>

            <!-- 全局配置 -->
            <div style="margin-bottom: 15px; border-top: 1px dashed #ddd; padding-top: 15px;">
              <div style="font-size: 12px; color: #666; background: #fff3cd; padding: 8px; border-radius: 4px; margin-bottom: 10px; border-left: 3px solid #ffc107;">
                🌐 以下操作针对<strong>所有域名</strong>的配置
              </div>
              <div style="display: flex; gap: 8px; margin-bottom: 10px; flex-wrap: wrap;">
                <button id="export-all-config" style="background: #28a745; color: white; border: none;
                                                    padding: 7px 14px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                  📦 导出所有域名
                </button>
                <label for="import-all-config-file" style="background: #fd7e14; color: white;
                                                          padding: 7px 14px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                  📥 导入所有域名
                </label>
                <input type="file" id="import-all-config-file" accept=".json" style="display: none;">
                <button id="reset-all-config" style="background: #dc3545; color: white; border: none;
                                                  padding: 7px 14px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                  ⚠️ 清空所有配置
                </button>
              </div>
            </div>

            <!-- 通用操作 -->
            <!-- 更新管理 -->
            <div style="border-top: 1px dashed #ddd; padding-top: 15px; margin-top: 15px;">
              <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">🔄 更新管理</h4>
              <div style="font-size: 12px; color: #666; background: #f8f9fa; padding: 8px; border-radius: 4px; margin-bottom: 10px;">
                💡 当前版本: <strong>v${CURRENT_VERSION}</strong><br>
                📍 当前域名: <strong>${getCurrentDomain()}</strong><br>
                ${isInterceptorEnabled()
        ? '✅ 自动检查: <strong style="color: #28a745;">已启用</strong> (每24小时)'
        : '⏭️ 自动检查: <strong style="color: #dc3545;">已跳过</strong> (拦截器未启用)'}
              </div>
              <div style="display: flex; gap: 8px; margin-bottom: 10px; flex-wrap: wrap;">
                <button id="check-update-btn" style="background: #007acc; color: white; border: none;
                                                    padding: 7px 14px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                  🔍 检查更新
                </button>
                <button id="view-update-info-btn" style="background: #17a2b8; color: white; border: none;
                                                        padding: 7px 14px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                  ℹ️ 更新信息
                </button>
                <button id="reload-page" style="background: #ffc107; color: #000; border: none;
                                              padding: 7px 14px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                  🔃 刷新页面
                </button>
              </div>
            </div>

            <textarea id="import-config-text"
                      placeholder="或粘贴配置JSON（支持单域名或全局配置）..."
                      style="width: 100%; height: 80px; padding: 8px; border: 1px solid #ddd;
                            border-radius: 4px; font-family: monospace; margin-bottom: 6px; resize: vertical;"></textarea>
            <button id="import-config-text-btn" style="background: #28a745; color: white; border: none;
                                                    padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
              📥 从文本导入
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // 事件委托
    panel.addEventListener('click', function (e) {
      const target = e.target;
      const action = target.dataset.action;

      if (action && operations[action]) {
        const id = target.dataset.id;
        const index = target.dataset.index;
        const domain = target.dataset.domain;

        if (id) {
          operations[action](id);
        } else if (index !== undefined) {
          operations[action](index);
        } else if (domain) {
          operations[action](domain);
        }
      }
    });

    panel.addEventListener('change', function (e) {
      const target = e.target;
      const action = target.dataset.action;

      if (action && operations[action]) {
        const id = target.dataset.id;
        const index = target.dataset.index;

        if (id) {
          operations[action](id);
        } else if (index !== undefined) {
          operations[action](index);
        }
      }
    });

    bindPanelEvents();
    renderRulesList();
    renderGlobalHeaders();
    renderDomainList();
    updateMasterSwitchUI();
  }

  // ============================================
  // 绑定面板事件
  // ============================================
  function bindPanelEvents () {
    // 关闭面板
    const closeBtn = document.getElementById('close-panel');
    if (closeBtn) {
      closeBtn.onclick = () => {
        config.panelVisible = false;
        const panel = document.getElementById('interceptor-panel');
        if (panel) panel.style.display = 'none';
        saveConfig();
      };
    }

    // ========== 新增：展开/收起域名列表 ==========
    const toggleDomainListBtn = document.getElementById('toggle-domain-list');
    if (toggleDomainListBtn) {
      toggleDomainListBtn.onclick = () => {
        const domainList = document.getElementById('domain-list');
        if (domainList) {
          const isHidden = domainList.style.display === 'none';
          domainList.style.display = isHidden ? 'block' : 'none';
          if (isHidden) {
            renderDomainList();
          }
        }
      };
    }

    // 主开关事件
    const masterSwitch = document.getElementById('master-switch');
    if (masterSwitch) {
      masterSwitch.onchange = function () {
        const enabled = this.checked;
        setInterceptorEnabled(enabled);
        updateMasterSwitchUI();

        if (enabled) {
          alert(`✅ 拦截器已启用\n\n当前域名: ${getCurrentDomain()}\n\n页面将自动刷新以生效...`);
          setTimeout(() => location.reload(), 500);
        } else {
          alert(`⚠️ 拦截器已禁用\n\n当前域名: ${getCurrentDomain()}\n\n页面将自动刷新以生效...`);
          setTimeout(() => location.reload(), 500);
        }
      };
    }

    // 模式切换
    document.querySelectorAll('input[name="new-rule-mode"]').forEach(radio => {
      radio.onchange = function () {
        const isReplace = this.value === 'replace';
        const replaceContent = document.getElementById('replace-mode-content');
        const modifyContent = document.getElementById('modify-mode-content');
        if (replaceContent) replaceContent.style.display = isReplace ? 'block' : 'none';
        if (modifyContent) modifyContent.style.display = isReplace ? 'none' : 'block';
      };
    });

    // 添加规则
    const addRuleBtn = document.getElementById('add-rule');
    if (addRuleBtn) {
      addRuleBtn.onclick = () => {
        const name = document.getElementById('new-rule-name')?.value.trim();
        const match = document.getElementById('new-rule-match')?.value.trim();
        const mode = document.querySelector('input[name="new-rule-mode"]:checked')?.value;

        if (!name || !match) {
          alert('❌ 请填写规则名称和匹配URL');
          return;
        }

        const newRule = {
          id: Date.now(),
          name: name,
          match: match,
          type: 'string',
          enabled: true,
          mode: mode || 'replace',
          responseData: {},
          modifyScript: ''
        };

        if (mode === 'replace') {
          const responseText = document.getElementById('new-rule-response')?.value.trim();
          if (!responseText) {
            alert('❌ 请填写响应数据');
            return;
          }
          try {
            newRule.responseData = JSON.parse(responseText);
          } catch (e) {
            alert('❌ JSON格式错误: ' + e.message);
            return;
          }
        } else {
          const modifyScript = document.getElementById('new-rule-modify-script')?.value.trim();
          if (!modifyScript) {
            alert('❌ 请填写修改脚本');
            return;
          }
          newRule.modifyScript = modifyScript;
        }

        config.rules.push(newRule);
        saveConfig();
        renderRulesList();
        updateMasterSwitchUI();

        ['new-rule-name', 'new-rule-match', 'new-rule-response', 'new-rule-modify-script'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });

        alert('✅ 规则添加成功');
      };
    }

    // 全局Header启用
    const globalHeadersEnabled = document.getElementById('global-headers-enabled');
    if (globalHeadersEnabled) {
      globalHeadersEnabled.onchange = function () {
        if (!config.globalHeaders) {
          config.globalHeaders = JSON.parse(JSON.stringify(DEFAULT_DOMAIN_CONFIG.globalHeaders));
        }
        config.globalHeaders.enabled = this.checked;
        saveConfig();
        console.log(`🌐 全局Header注入已${this.checked ? '启用' : '禁用'}`);
      };
    }

    // 添加Header
    const addHeaderBtn = document.getElementById('add-header');
    if (addHeaderBtn) {
      addHeaderBtn.onclick = () => {
        const name = document.getElementById('new-header-name')?.value.trim();
        const value = document.getElementById('new-header-value')?.value.trim();
        const domainsText = document.getElementById('new-header-domains')?.value.trim();

        if (!name || !value) {
          alert('❌ 请填写Header名称和值');
          return;
        }

        if (!config.globalHeaders) {
          config.globalHeaders = JSON.parse(JSON.stringify(DEFAULT_DOMAIN_CONFIG.globalHeaders));
        }
        if (!config.globalHeaders.headers) {
          config.globalHeaders.headers = [];
        }

        const domains = domainsText
          ? domainsText.split(',').map(d => d.trim()).filter(d => d)
          : [];

        config.globalHeaders.headers.push({
          name: name,
          value: value,
          enabled: true,
          domains: domains
        });

        saveConfig();
        renderGlobalHeaders();
        updateMasterSwitchUI();

        ['new-header-name', 'new-header-value', 'new-header-domains'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });

        alert('✅ Header添加成功');
      };
    }

    // 重置配置
    const resetBtn = document.getElementById('reset-config');
    if (resetBtn) {
      resetBtn.onclick = () => {
        if (confirm(`⚠️ 确定要重置当前域名(${getCurrentDomain()})的配置吗？`)) {
          config = JSON.parse(JSON.stringify(DEFAULT_DOMAIN_CONFIG));
          saveConfig();
          renderRulesList();
          renderGlobalHeaders();
          updateMasterSwitchUI();
          renderDomainList();
          alert('✅ 配置已重置');
        }
      };
    }

    // 刷新页面
    const reloadBtn = document.getElementById('reload-page');
    if (reloadBtn) {
      reloadBtn.onclick = () => {
        if (confirm('🔃 确定要刷新页面吗？')) {
          location.reload();
        }
      };
    }

    // ========== 新增：手动检查更新 ==========
    const checkUpdateBtn = document.getElementById('check-update-btn');
    if (checkUpdateBtn) {
      checkUpdateBtn.onclick = () => {
        console.log('🔄 [手动更新] 用户触发更新检查');

        // 清除检查时间，强制检查
        GM_setValue('last_update_check', 0);

        // 清除全局锁（如果使用了方案3）
        if (typeof UPDATE_CHECK_LOCK_KEY !== 'undefined') {
          GM_setValue(UPDATE_CHECK_LOCK_KEY, 0);
        }

        // 执行检查（传入 true 表示手动检查）
        checkForUpdates(true);
      };
    }

    // ========== 新增：查看更新信息 ==========
    const viewUpdateInfoBtn = document.getElementById('view-update-info-btn');
    if (viewUpdateInfoBtn) {
      viewUpdateInfoBtn.onclick = () => {
        const lastCheck = GM_getValue('last_update_check', 0);
        const lastCheckDate = lastCheck ? new Date(lastCheck).toLocaleString('zh-CN') : '从未检查';
        const nextCheck = lastCheck
          ? new Date(lastCheck + 24 * 60 * 60 * 1000).toLocaleString('zh-CN')
          : '未知';

        const enabled = isInterceptorEnabled();
        const domain = getCurrentDomain();

        const info = `
          🔄 更新信息
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          📦 当前版本: v${CURRENT_VERSION}
          📍 当前域名: ${domain}
          🔌 拦截器状态: ${enabled ? '✅ 已启用' : '❌ 未启用'}

          ⏰ 更新检查
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          🕐 上次检查: ${lastCheckDate}
          ⏰ 下次自动检查: ${enabled ? nextCheck : '跳过（拦截器未启用）'}

          🔗 更新源
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1️⃣ jsDelivr CDN (主源，全球CDN)
          2️⃣ GitHub Raw (备源)
          3️⃣ GitHub (备源)

          💡 说明
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          • 自动检查: 仅在启用拦截器的域名上执行
          • 检查频率: 每24小时一次
          • 手动检查: 随时点击"检查更新"按钮
          • 发现新版本会弹出通知提示
              `.trim();

        alert(info);
      };
    }

    // 文件导入
    const importFileInput = document.getElementById('import-config-file');
    if (importFileInput) {
      importFileInput.onchange = function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
          try {
            const importedConfig = JSON.parse(e.target.result);
            if (validateConfig(importedConfig)) {
              if (confirm(`⚠️ 确定要导入到当前域名(${getCurrentDomain()})吗？\n\n这将覆盖当前域名的所有配置。`)) {
                importConfig(importedConfig);
              }
            } else {
              alert('❌ 配置文件格式错误');
            }
          } catch (err) {
            alert('❌ 导入失败：' + err.message);
          }
        };
        reader.readAsText(file);
        e.target.value = '';
      };
    }

    // 文本导入
    const importTextBtn = document.getElementById('import-config-text-btn');
    if (importTextBtn) {
      importTextBtn.onclick = () => {
        const text = document.getElementById('import-config-text')?.value.trim();
        if (!text) {
          alert('❌ 请输入配置JSON');
          return;
        }

        try {
          const importedConfig = JSON.parse(text);
          if (validateConfig(importedConfig)) {
            if (confirm(`⚠️ 确定要导入到当前域名(${getCurrentDomain()})吗？\n\n这将覆盖当前域名的所有配置。`)) {
              importConfig(importedConfig);
            }
          } else {
            alert('❌ 配置格式错误');
          }
        } catch (err) {
          alert('❌ 导入失败：' + err.message);
        }
      };
    }

    // 导出配置
    const exportBtn = document.getElementById('export-config');
    if (exportBtn) {
      exportBtn.onclick = () => {
        const exportConfig = {
          domain: getCurrentDomain(),
          enabled: config.enabled,
          rules: config.rules || [],
          globalHeaders: config.globalHeaders || DEFAULT_DOMAIN_CONFIG.globalHeaders,
          exportTime: new Date().toISOString(),
          version: '1.4.0'
        };

        const dataStr = JSON.stringify(exportConfig, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        const safeDomain = getCurrentDomain().replace(/[^a-z0-9]/gi, '-');
        link.download = `interceptor-${safeDomain}-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('✅ 配置导出成功');
      };
    }

    // ========== 新增：导出所有域名配置 ==========
    const exportAllBtn = document.getElementById('export-all-config');
    if (exportAllBtn) {
      exportAllBtn.onclick = () => {
        const allConfigs = loadAllConfigs();
        const domainCount = Object.keys(allConfigs).length;

        if (domainCount === 0) {
          alert('❌ 没有任何域名配置可导出');
          return;
        }

        const exportData = {
          type: 'all_domains',
          version: '1.4.1',
          exportTime: new Date().toISOString(),
          totalDomains: domainCount,
          configs: allConfigs
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `interceptor-all-domains-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log(`✅ 已导出 ${domainCount} 个域名的配置`);
        alert(`✅ 配置导出成功！\n\n总域名数: ${domainCount}\n导出时间: ${new Date().toLocaleString()}`);
      };
    }

    // ========== 新增：导入所有域名配置（文件） ==========
    const importAllFileInput = document.getElementById('import-all-config-file');
    if (importAllFileInput) {
      importAllFileInput.onchange = function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
          try {
            const importedData = JSON.parse(e.target.result);

            if (importedData.type === 'all_domains' && importedData.configs) {
              const domainCount = Object.keys(importedData.configs).length;
              const confirmMsg = `⚠️ 确定要导入所有域名配置吗？\n\n`;
              const msg = confirmMsg +
                `导入的域名数: ${domainCount}\n` +
                `导出时间: ${importedData.exportTime ? new Date(importedData.exportTime).toLocaleString() : '未知'}\n\n` +
                `⚠️ 警告: 这将覆盖所有已存在的域名配置！`;

              if (confirm(msg)) {
                importAllConfigs(importedData.configs);
              }
            } else {
              alert('❌ 不是有效的全局配置文件\n\n请确保导入的是"导出所有域名"生成的文件');
            }
          } catch (err) {
            alert('❌ 导入失败：' + err.message);
          }
        };
        reader.readAsText(file);
        e.target.value = '';
      };
    }

    // ========== 新增：清空所有配置 ==========
    const resetAllBtn = document.getElementById('reset-all-config');
    if (resetAllBtn) {
      resetAllBtn.onclick = () => {
        const allConfigs = loadAllConfigs();
        const domainCount = Object.keys(allConfigs).length;

        if (domainCount === 0) {
          alert('ℹ️ 当前没有任何域名配置');
          return;
        }

        const confirmMsg = `⚠️⚠️⚠️ 危险操作 ⚠️⚠️⚠️\n\n` +
          `即将清空所有域名的配置！\n\n` +
          `当前配置的域名数: ${domainCount}\n` +
          `域名列表: ${Object.keys(allConfigs).join(', ')}\n\n` +
          `此操作不可恢复，是否继续？`;

        if (confirm(confirmMsg)) {
          if (confirm('🚨 最后确认：真的要删除所有配置吗？')) {
            GM_setValue(ALL_CONFIGS_KEY, {});
            config = JSON.parse(JSON.stringify(DEFAULT_DOMAIN_CONFIG));
            renderRulesList();
            renderGlobalHeaders();
            updateMasterSwitchUI();
            renderDomainList();
            alert('✅ 所有域名配置已清空');
            console.log('🗑️ 已清空所有域名配置');
          }
        }
      };
    }
  }

  // ============================================
  // 配置验证和导入
  // ============================================
  function validateConfig (importedConfig) {
    try {
      if (!importedConfig || typeof importedConfig !== 'object') {
        return false;
      }

      if (!Array.isArray(importedConfig.rules)) {
        return false;
      }

      for (let rule of importedConfig.rules) {
        if (!rule.id || !rule.name || !rule.match) {
          return false;
        }
        if (rule.mode === 'replace' && rule.responseData === undefined) {
          return false;
        }
        if (rule.mode === 'modify' && !rule.modifyScript) {
          return false;
        }
      }

      if (importedConfig.globalHeaders) {
        if (importedConfig.globalHeaders.headers && !Array.isArray(importedConfig.globalHeaders.headers)) {
          return false;
        }
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  function importConfig (importedConfig) {
    try {
      // 更新当前域名的配置
      config.enabled = importedConfig.enabled !== undefined ? importedConfig.enabled : config.enabled;
      config.rules = importedConfig.rules || [];
      config.globalHeaders = importedConfig.globalHeaders || JSON.parse(JSON.stringify(DEFAULT_DOMAIN_CONFIG.globalHeaders));
      config.panelVisible = false;

      saveConfig();

      renderRulesList();
      renderGlobalHeaders();
      updateMasterSwitchUI();
      renderDomainList();

      const importTextArea = document.getElementById('import-config-text');
      if (importTextArea) importTextArea.value = '';

      alert(`✅ 配置导入成功！\n域名: ${getCurrentDomain()}\n规则: ${config.rules.length}个\nHeader: ${config.globalHeaders.headers?.length || 0}个`);
    } catch (e) {
      alert('❌ 导入失败：' + e.message);
    }
  }

  // ============================================
  // 导入所有域名配置
  // ============================================
  function importAllConfigs (configs) {
    try {
      if (!configs || typeof configs !== 'object') {
        throw new Error('无效的配置格式');
      }

      // 验证每个域名的配置
      let validCount = 0;
      let invalidDomains = [];

      for (let domain in configs) {
        if (validateConfig(configs[domain])) {
          validCount++;
        } else {
          invalidDomains.push(domain);
        }
      }

      if (invalidDomains.length > 0) {
        alert(`⚠️ 以下域名的配置格式无效，将被跳过:\n\n${invalidDomains.join('\n')}`);
      }

      // 保存所有配置
      saveAllConfigs(configs);

      // 重新加载当前域名配置
      config = getCurrentDomainConfig();

      renderRulesList();
      renderGlobalHeaders();
      updateMasterSwitchUI();
      renderDomainList();

      const importTextArea = document.getElementById('import-config-text');
      if (importTextArea) importTextArea.value = '';

      const totalDomains = Object.keys(configs).length;
      alert(
        `✅ 全局配置导入成功！\n\n` +
        `总域名数: ${totalDomains}\n` +
        `有效配置: ${validCount}\n` +
        `无效配置: ${invalidDomains.length}\n\n` +
        `当前域名: ${getCurrentDomain()}\n` +
        `当前规则: ${config.rules?.length || 0}个\n` +
        `当前Header: ${config.globalHeaders?.headers?.length || 0}个`
      );

      console.log(`✅ 已导入 ${validCount} 个域名的配置`);
    } catch (e) {
      alert('❌ 导入失败：' + e.message);
      console.error('导入所有配置失败:', e);
    }
  }

  // ============================================
  // 显示/隐藏面板
  // ============================================
  function showPanel () {
    console.log('showPanel');

    let panel = document.getElementById('interceptor-panel');

    // 如果面板不存在，先创建
    if (!panel) {
      // 确保body已经存在
      if (!document.body) {
        console.warn('⚠️ document.body 还未加载，延迟创建面板');
        setTimeout(showPanel, 100);
        return;
      }
      createPanel();
      panel = document.getElementById('interceptor-panel');
    }

    if (panel) {
      panel.style.display = 'block';
      config.panelVisible = true;
      saveConfig();
      updateMasterSwitchUI();
    }
  }

  function hidePanel () {
    const panel = document.getElementById('interceptor-panel');
    if (panel) {
      panel.style.display = 'none';
      config.panelVisible = false;
      saveConfig();
    }
  }

  // ============================================
  // 初始化
  // ============================================
  function init () {
    console.log('🚀 [API拦截器] 开始初始化...');
    console.log('📍 当前域名:', getCurrentDomain());
    console.log('🔌 拦截器状态:', isInterceptorEnabled() ? '启用' : '禁用');

    // 注入拦截代码
    injectInterceptor();

    // 创建UI
    const createUI = () => {
      // ========== 修改：确保body存在 ==========
      if (!document.body) {
        console.warn('⚠️ document.body 还未加载，延迟100ms创建UI');
        setTimeout(createUI, 100);
        return;
      }
      const floatBtn = document.createElement('div');
      floatBtn.id = 'interceptor-float-btn';
      const enabled = isInterceptorEnabled();
      floatBtn.innerHTML = enabled ? '⚙️' : '⚙️';
      floatBtn.title = `API拦截器 - ${enabled ? '已启用' : '已禁用'}\n域名: ${getCurrentDomain()}\n点击打开配置面板\n长按可拖动`;

      // 从存储中读取位置，如果没有则使用默认位置
      const savedPosition = GM_getValue('interceptor_float_btn_position', { bottom: 20, right: 20 });

      floatBtn.style.cssText = `
  position: fixed;
  bottom: ${savedPosition.bottom}px;
  right: ${savedPosition.right}px;
  width: 56px;
  height: 56px;
  background: ${enabled ? 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)' : 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: move;
  z-index: 999998;
  box-shadow: 0 4px 12px ${enabled ? 'rgba(40, 167, 69, 0.4)' : 'rgba(108, 117, 125, 0.4)'};
  transition: box-shadow 0.3s ease;
  user-select: none;
  touch-action: none;
`;

      // ============================================
      // 🎯 拖拽功能（PC + 移动端）
      // ============================================
      let isDragging = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let btnStartBottom = savedPosition.bottom;
      let btnStartRight = savedPosition.right;
      let dragTimer = null;
      let hasMoved = false;
      let longPressTriggered = false;

      // 获取事件坐标（兼容PC和移动端）
      function getEventCoords (e) {
        if (e.touches && e.touches.length > 0) {
          return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
      }

      // 开始拖拽
      function startDrag (e) {
        hasMoved = false;
        longPressTriggered = false;

        const coords = getEventCoords(e);
        dragStartX = coords.x;
        dragStartY = coords.y;

        btnStartBottom = parseInt(floatBtn.style.bottom);
        btnStartRight = parseInt(floatBtn.style.right);

        // 长按200ms后才能拖动
        dragTimer = setTimeout(() => {
          longPressTriggered = true;
          isDragging = true;
          floatBtn.style.transition = 'none';
          floatBtn.style.opacity = '0.8';
          floatBtn.style.cursor = 'grabbing';
          console.log('🎯 长按触发，开始拖拽模式');
        }, 200);
      }

      // 拖拽中
      function onDrag (e) {
        if (!isDragging) {
          // 即使还没进入拖拽模式，也检测是否移动了
          const coords = getEventCoords(e);
          const moveX = Math.abs(coords.x - dragStartX);
          const moveY = Math.abs(coords.y - dragStartY);
          if (moveX > 5 || moveY > 5) {
            hasMoved = true;
          }
          return;
        }

        hasMoved = true;
        const coords = getEventCoords(e);
        const deltaX = dragStartX - coords.x;
        const deltaY = dragStartY - coords.y;

        let newBottom = btnStartBottom + deltaY;
        let newRight = btnStartRight + deltaX;

        // 边界限制
        const maxBottom = window.innerHeight - 56;
        const maxRight = window.innerWidth - 56;

        newBottom = Math.max(0, Math.min(newBottom, maxBottom));
        newRight = Math.max(0, Math.min(newRight, maxRight));

        floatBtn.style.bottom = newBottom + 'px';
        floatBtn.style.right = newRight + 'px';

        e.preventDefault();
      }

      // 结束拖拽
      function endDrag (e) {
        clearTimeout(dragTimer);

        if (isDragging) {
          isDragging = false;
          floatBtn.style.transition = 'box-shadow 0.3s ease';
          floatBtn.style.opacity = '1';
          floatBtn.style.cursor = 'move';

          // 保存位置
          const finalPosition = {
            bottom: parseInt(floatBtn.style.bottom),
            right: parseInt(floatBtn.style.right)
          };
          GM_setValue('interceptor_float_btn_position', finalPosition);
          console.log('💾 按钮位置已保存:', finalPosition);
        }

        // 重置状态
        setTimeout(() => {
          longPressTriggered = false;
          hasMoved = false;
        }, 10);
      }

      // PC端事件
      floatBtn.addEventListener('mousedown', startDrag);
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', endDrag);

      // 移动端事件
      floatBtn.addEventListener('touchstart', startDrag, { passive: false });
      document.addEventListener('touchmove', onDrag, { passive: false });
      document.addEventListener('touchend', endDrag);

      // 点击事件（只有没拖动且没长按时才触发）
      floatBtn.addEventListener('click', function (e) {
        console.log('🖱️ 点击事件触发 - hasMoved:', hasMoved, 'longPressTriggered:', longPressTriggered);
        if (!hasMoved && !longPressTriggered) {
          console.log('✅ 打开面板');
          showPanel();
        } else {
          console.log('❌ 阻止打开面板（拖拽操作）');
          e.preventDefault();
          e.stopPropagation();
        }
      });

      // 悬停效果（仅PC端）
      floatBtn.addEventListener('mouseenter', function () {
        if (!isDragging) {
          this.style.boxShadow = enabled
            ? '0 6px 16px rgba(40, 167, 69, 0.6)'
            : '0 6px 16px rgba(108, 117, 125, 0.6)';
        }
      });

      floatBtn.addEventListener('mouseleave', function () {
        if (!isDragging) {
          this.style.boxShadow = enabled
            ? '0 4px 12px rgba(40, 167, 69, 0.4)'
            : '0 4px 12px rgba(108, 117, 125, 0.4)';
        }
      });

      document.body.appendChild(floatBtn);
      // ========== 修改：如果上次面板是打开的，延迟打开（确保DOM完全加载） ==========
      if (config.panelVisible) {
        setTimeout(() => {
          showPanel();
        }, 200);
      }
      console.log('✅ [API拦截器] UI初始化完成');
    };
    // ========== 修改：改进DOM加载检测 ==========
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createUI);
    } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
      // 即使DOM已经加载，也要确保body存在
      if (document.body) {
        createUI();
      } else {
        // body还不存在，等待一下
        setTimeout(createUI, 100);
      }
    }
    console.log('✅ [API拦截器] 初始化完成');
    console.log('📊 当前配置:', {
      域名: getCurrentDomain(),
      拦截器启用: isInterceptorEnabled(),
      规则数: config.rules?.length || 0,
      Header数: config.globalHeaders?.headers?.length || 0,
      全局Header启用: config.globalHeaders?.enabled || false,
      所有已配置域名: getAllDomains()
    });
  }

  // 启动
  init();

  // ========== 智能更新检查（仅已启用的域名） ==========
  setTimeout(() => {
    const enabled = isInterceptorEnabled();
    const domain = getCurrentDomain();

    if (enabled) {
      console.log(`✅ [更新检查] 当前域名(${domain})已启用拦截器，将自动检查更新`);
      checkForUpdates(false);
    } else {
      console.log(`⏭️ [更新检查] 当前域名(${domain})未启用拦截器，跳过自动更新检查`);
      console.log(`💡 提示: 启用拦截器后会自动检查更新，或手动点击"检查更新"按钮`);
    }
  }, 3000);

})();
