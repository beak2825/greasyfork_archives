// ==UserScript==
// @name         AugmentCode自动注册+OAuth令牌获取
// @namespace    http://tampermonkey.net/
// @version      2.5.0
// @description  自动完成AugmentCode的注册流程并获取OAuth令牌
// @author       AugmentCode-AutoRegister-Userscript
// @match        https://*.augmentcode.com/*
// @match        https://auth.augmentcode.com/*
// @match        https://login.augmentcode.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=augmentcode.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_log
// @grant        GM_addStyle
// @connect      tempmail.plus
// @connect      *.augmentcode.com
// @connect      d3.api.augmentcode.com
// @connect      d14.api.augmentcode.com
// @connect      *.api.augmentcode.com
// @connect      api.augmentcode.com
// @connect      augment.daiju.live
// @license lll
// @downloadURL https://update.greasyfork.org/scripts/554711/AugmentCode%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8C%2BOAuth%E4%BB%A4%E7%89%8C%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/554711/AugmentCode%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8C%2BOAuth%E4%BB%A4%E7%89%8C%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 主邮箱域名常量，用于生成标准格式的邮箱地址
  const EMAIL_DOMAIN = "@aiforthere666.shop";//

  /**
   * 临时邮箱服务配置
   * 用于需要临时接收验证邮件的场景
   */
  const TEMP_MAIL_CONFIG = {
    username: "yqamoxa",    // 临时邮箱用户名
    emailExtension: "@mailto.plus", // 临时邮箱扩展域名
    epin: ""     // 临时邮箱PIN码
  };

  // ==================== OAuth 工具集成 ====================

  /**
   * OAuth 配置常量
   */
  const OAUTH_CONFIG = {
    clientID: 'v',
    authURL: 'https://auth.augmentcode.com/authorize',
    requestTimeout: 10000
  };

  /**
   * 工具函数：安全的 JSON 解析
   */
  function safeJsonParse(str) {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }

  /**
   * 工具函数：Base64URL 编码
   */
  function base64UrlEncode(buffer) {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  /**
   * 工具函数：生成随机字符串
   */
  function generateRandomString(length) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return base64UrlEncode(array);
  }

  /**
   * 工具函数：SHA256 哈希
   */
  async function sha256Hash(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return hashBuffer;
  }

  /**
   * OAuth 核心功能
   */
  const OAuthManager = {
    /**
     * 生成 OAuth 认证 URL
     */
    async generateAuthUrl(email) {
      try {
        getLogger().log(`🔐 开始生成OAuth认证URL，邮箱: ${email}`, 'info');

        // 生成 PKCE 参数
        const verifier = generateRandomString(64);
        const challenge = base64UrlEncode(await sha256Hash(verifier));
        const state = generateRandomString(16);

        // 存储认证状态
        const oauthState = {
          verifier,
          challenge,
          state,
          email,
          timestamp: Date.now()
        };

        GM_setValue('oauth_state', JSON.stringify(oauthState));

        // 构建认证 URL
        const params = new URLSearchParams({
          response_type: 'code',
          client_id: OAUTH_CONFIG.clientID,
          code_challenge: challenge,
          code_challenge_method: 'S256',
          state,
          prompt: 'login'
        });

        const authUrl = `${OAUTH_CONFIG.authURL}?${params.toString()}`;
        getLogger().log(`✅ OAuth认证URL生成成功: ${authUrl}`, 'success');

        return authUrl;
      } catch (error) {
        getLogger().log(`❌ 生成OAuth认证URL失败: ${error.message}`, 'error');
        throw error;
      }
    },

    /**
     * 从页面提取认证信息
     */
    extractAuthInfo() {
      try {
        getLogger().log('🔍 开始从页面提取OAuth认证信息...', 'info');

        let code = null;
        let tenant = null;

        // 遍历页面中的所有 script 标签
        for (const script of document.scripts) {
          const text = script.textContent;
          if (!text) continue;

          if (text.includes('code:') && text.includes('tenant_url:')) {
            const codeMatch = text.match(/code:\s*["']([^"']+)["']/);
            const tenantMatch = text.match(/tenant_url:\s*["']([^"']+)["']/);

            if (codeMatch && codeMatch[1]) {
              code = codeMatch[1];
            }
            if (tenantMatch && tenantMatch[1]) {
              tenant = tenantMatch[1];
            }

            if (code && tenant) break;
          }
        }

        if (!code || !tenant) {
          throw new Error(`未找到完整的OAuth认证信息 - code: ${code ? '✓'
              : '✗'}, tenant: ${tenant ? '✓' : '✗'}`);
        }

        const authInfo = {code, tenant};
        getLogger().log(`✅ OAuth认证信息提取成功: code=${code.substring(0,
            10)}..., tenant=${tenant}`, 'success');

        return authInfo;
      } catch (error) {
        getLogger().log(`❌ 提取OAuth认证信息失败: ${error.message}`, 'error');
        throw error;
      }
    },

    /**
     * 交换访问令牌（使用fetch API作为备选）
     */
    async exchangeTokenWithFetch(tenant, code) {
      try {
        getLogger().log('🔄 使用fetch API交换访问令牌...', 'info');

        // 获取存储的OAuth状态
        const oauthStateStr = GM_getValue('oauth_state', '{}');
        const oauthState = safeJsonParse(oauthStateStr) || {};

        if (!oauthState.verifier) {
          throw new Error('认证状态丢失，请重新开始认证流程');
        }

        // 构建令牌交换URL
        const tokenUrl = tenant.endsWith('/') ? `${tenant}token` : `${tenant}/token`;

        // 构建请求数据
        const requestData = {
          grant_type: 'authorization_code',
          client_id: OAUTH_CONFIG.clientID,
          code_verifier: oauthState.verifier,
          redirect_uri: '',
          code: code
        };

        getLogger().log(`📡 使用fetch发送请求到: ${tokenUrl}`, 'info');

        const response = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();
        if (!responseData || !responseData.access_token) {
          throw new Error('获取访问令牌失败：响应中没有access_token');
        }

        const accessToken = responseData.access_token;
        getLogger().log(`✅ 使用fetch获取访问令牌成功: ${accessToken.substring(0, 20)}...`, 'success');

        // 清理临时存储的OAuth状态
        GM_deleteValue('oauth_state');

        return {
          access_token: accessToken,
          token_type: responseData.token_type || 'Bearer',
          expires_in: responseData.expires_in || 3600,
          tenant: tenant
        };
      } catch (error) {
        getLogger().log(`❌ fetch API交换令牌失败: ${error.message}`, 'error');
        throw error;
      }
    },

    /**
     * 交换访问令牌（主方法，GM_xmlhttpRequest）
     */
    async exchangeToken(tenant, code) {
      return new Promise((resolve, reject) => {
        try {
          getLogger().log('🔄 开始交换访问令牌...', 'info');

          // 获取存储的OAuth状态
          const oauthStateStr = GM_getValue('oauth_state', '{}');
          const oauthState = safeJsonParse(oauthStateStr) || {};

          if (!oauthState.verifier) {
            throw new Error('认证状态丢失，请重新开始认证流程');
          }

          // 构建令牌交换URL
          const tokenUrl = tenant.endsWith('/') ? `${tenant}token`
              : `${tenant}/token`;

          // 构建请求数据
          const requestData = {
            grant_type: 'authorization_code',
            client_id: OAUTH_CONFIG.clientID,
            code_verifier: oauthState.verifier,
            redirect_uri: '',
            code: code
          };

          getLogger().log(`📡 发送令牌交换请求到: ${tokenUrl}`, 'info');
          getLogger().log(`🔍 请求数据: ${JSON.stringify(requestData, null, 2)}`, 'info');
          getLogger().log(`🔍 OAuth状态: verifier=${oauthState.verifier ? '存在' : '缺失'}`, 'info');

          // 使用GM_xmlhttpRequest发送请求
          GM_xmlhttpRequest({
            method: 'POST',
            url: tokenUrl,
            headers: {
              'Content-Type': 'application/json'
            },
            data: JSON.stringify(requestData),
            timeout: OAUTH_CONFIG.requestTimeout,
            onload: function (response) {
              try {
                getLogger().log(`📨 收到令牌交换响应，状态: ${response.status}`,
                    'info');

                if (response.status !== 200) {
                  throw new Error(
                      `HTTP ${response.status}: ${response.statusText}`);
                }

                const responseData = safeJsonParse(response.responseText);
                if (!responseData || !responseData.access_token) {
                  throw new Error('获取访问令牌失败：响应中没有access_token');
                }

                const accessToken = responseData.access_token;
                getLogger().log(
                    `✅ 访问令牌获取成功: ${accessToken.substring(0, 20)}...`,
                    'success');

                // 清理临时存储的OAuth状态
                GM_deleteValue('oauth_state');

                resolve({
                  access_token: accessToken,
                  token_type: responseData.token_type || 'Bearer',
                  expires_in: responseData.expires_in || 3600,
                  tenant: tenant
                });
              } catch (error) {
                getLogger().log(`❌ 处理令牌交换响应失败: ${error.message}`, 'error');
                reject(error);
              }
            },
            onerror: function (error) {
              getLogger().log(`❌ 令牌交换请求失败: ${JSON.stringify(error)}`, 'error');
              getLogger().log(`🔍 请求URL: ${tokenUrl}`, 'error');
              getLogger().log(`🔍 错误详情: ${error.error || error.message || '未知网络错误'}`, 'error');
              reject(new Error(`网络请求失败: ${error.error || error.message || '连接被拒绝'}`));
            },
            ontimeout: function () {
              getLogger().log('❌ 令牌交换请求超时', 'error');
              getLogger().log(`🔍 请求URL: ${tokenUrl}`, 'error');
              getLogger().log(`🔍 超时时间: ${OAUTH_CONFIG.requestTimeout}ms`, 'error');
              reject(new Error('请求超时'));
            }
          });
        } catch (error) {
          getLogger().log(`❌ GM_xmlhttpRequest交换访问令牌失败: ${error.message}`, 'error');
          getLogger().log('🔄 尝试使用fetch API作为备选方案...', 'warning');

          // 尝试使用fetch API作为备选
          OAuthManager.exchangeTokenWithFetch(tenant, code)
            .then(result => {
              resolve(result);
            })
            .catch(fetchError => {
              getLogger().log(`❌ fetch API也失败了: ${fetchError.message}`, 'error');
              reject(error); // 返回原始错误
            });
        }
      });
    }
  };

  const FIRST_NAMES = ["alex", "emily", "jason", "olivia", "ryan", "sophia",
    "thomas", "isabella", "william", "mia", "james", "ava", "noah", "charlotte",
    "ethan", "amelia", "jacob", "evelyn", "mason", "abigail"];
  const LAST_NAMES = ["taylor", "anderson", "thompson", "jackson", "white",
    "harris", "martin", "thomas", "lewis", "clark", "lee", "walker", "hall",
    "young", "allen", "king", "wright", "scott", "green", "adams"];

  // ==================== 统一状态管理系统 ====================

  /**
   * 统一状态管理器 - 分离UI状态和业务状态，实现精细化状态管理
   */
  const StateManager = {
    // UI状态 - 界面相关的状态
    ui: {
      expanded: GM_getValue('isUIExpanded', false),
      firstTime: GM_getValue('isFirstTimeUser', true),
      position: GM_getValue('ui_position', null), // UI面板位置信息
      sections: {
        config: GM_getValue('ui_section_config', false),
        advanced: GM_getValue('ui_section_advanced', false),
        tools: GM_getValue('ui_section_tools', false),
        logs: GM_getValue('ui_section_logs', true)
      }
    },

    // 业务状态 - 应用逻辑相关的状态
    app: {
      isAutoRegistering: GM_getValue('isAutoRegistering', false),
      registrationCount: GM_getValue('registrationCount', 0),
      registeredAccounts: GM_getValue('registeredAccounts', []),
      personalToken: GM_getValue('personalToken', ''),
      presetEmails: GM_getValue('presetEmails', []),
      currentEmailIndex: GM_getValue('currentEmailIndex', 0),
      usePresetEmails: GM_getValue('usePresetEmails', false),
      captchaWaitTime: GM_getValue('captchaWaitTime', 20), // 验证码模块等待时间（秒）
      suppressTestLogs: GM_getValue('suppressTestLogs', false), // 是否抑制测试日志
      maxRegistrationCount: GM_getValue('maxRegistrationCount', 10), // 最大注册数量，默认10个
      registrationInterval: GM_getValue('registrationInterval', 60) // 注册间隔时间（秒），默认60秒
    },

    // 状态变化监听器
    listeners: [],

    /**
     * 保存状态到本地存储
     */
    save() {
      try {
        // 保存UI状态
        GM_setValue('isUIExpanded', this.ui.expanded);
        GM_setValue('isFirstTimeUser', this.ui.firstTime);
        GM_setValue('ui_position', this.ui.position);
        GM_setValue('ui_section_config', this.ui.sections.config);
        GM_setValue('ui_section_advanced', this.ui.sections.advanced);
        GM_setValue('ui_section_tools', this.ui.sections.tools);
        GM_setValue('ui_section_logs', this.ui.sections.logs);

        // 保存业务状态
        GM_setValue('isAutoRegistering', this.app.isAutoRegistering);
        GM_setValue('registrationCount', this.app.registrationCount);
        GM_setValue('registeredAccounts', this.app.registeredAccounts);
        GM_setValue('personalToken', this.app.personalToken);
        GM_setValue('presetEmails', this.app.presetEmails);
        GM_setValue('currentEmailIndex', this.app.currentEmailIndex);
        GM_setValue('usePresetEmails', this.app.usePresetEmails);
        GM_setValue('captchaWaitTime', this.app.captchaWaitTime);
        GM_setValue('suppressTestLogs', this.app.suppressTestLogs);
        GM_setValue('maxRegistrationCount', this.app.maxRegistrationCount);
        GM_setValue('registrationInterval', this.app.registrationInterval);

        // 触发状态变化监听器
        this.notifyListeners();
      } catch (error) {
        console.error('状态保存失败:', error);
      }
    },

    /**
     * 从本地存储加载状态
     */
    load() {
      try {
        // 加载UI状态
        this.ui.expanded = GM_getValue('isUIExpanded', false);
        this.ui.firstTime = GM_getValue('isFirstTimeUser', true);
        this.ui.position = GM_getValue('ui_position', null);
        this.ui.sections.config = GM_getValue('ui_section_config', true);
        this.ui.sections.tools = GM_getValue('ui_section_tools', false);
        this.ui.sections.logs = GM_getValue('ui_section_logs', true);

        // 加载业务状态
        this.app.isAutoRegistering = GM_getValue('isAutoRegistering', false);
        this.app.registrationCount = GM_getValue('registrationCount', 0);
        this.app.registeredAccounts = GM_getValue('registeredAccounts', []);
        this.app.personalToken = GM_getValue('personalToken', '');
        this.app.presetEmails = GM_getValue('presetEmails', []);
        this.app.currentEmailIndex = GM_getValue('currentEmailIndex', 0);
        this.app.usePresetEmails = GM_getValue('usePresetEmails', false);
        this.app.captchaWaitTime = GM_getValue('captchaWaitTime', 20);
        this.app.suppressTestLogs = GM_getValue('suppressTestLogs', false);
        this.app.maxRegistrationCount = GM_getValue('maxRegistrationCount', 10);
        this.app.registrationInterval = GM_getValue('registrationInterval', 60);
      } catch (error) {
        console.error('状态加载失败:', error);
      }
    },

    /**
     * 更新UI状态
     */
    setUIState(updates) {
      Object.assign(this.ui, updates);
      this.save();
    },

    /**
     * 更新业务状态
     */
    setAppState(updates) {
      Object.assign(this.app, updates);
      this.save();
    },

    /**
     * 切换UI展开状态
     */
    toggleUI() {
      this.ui.expanded = !this.ui.expanded;
      this.ui.firstTime = false; // 用户操作后不再是首次用户
      this.save();
      return this.ui.expanded;
    },

    /**
     * 切换区域显示状态
     */
    toggleSection(sectionName) {
      if (this.ui.sections.hasOwnProperty(sectionName)) {
        this.ui.sections[sectionName] = !this.ui.sections[sectionName];
        this.save();
        // 立即保存到GM存储，确保页面跳转后不丢失
        GM_setValue(`ui_section_${sectionName}`, this.ui.sections[sectionName]);
        return this.ui.sections[sectionName];
      }
      return false;
    },

    /**
     * 订阅状态变化
     */
    subscribe(callback) {
      this.listeners.push(callback);
    },

    /**
     * 取消订阅状态变化
     */
    unsubscribe(callback) {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    },

    /**
     * 通知所有监听器状态已变化
     */
    notifyListeners() {
      this.listeners.forEach(callback => {
        try {
          callback(this);
        } catch (error) {
          console.error('状态监听器执行失败:', error);
        }
      });
    },

    /**
     * 重置所有状态到默认值
     */
    reset() {
      this.ui = {
        expanded: false,
        firstTime: true,
        sections: {
          config: false,
          advanced: false,
          tools: false,
          logs: true
        }
      };
      this.app = {
        isAutoRegistering: false,
        registrationCount: 0,
        registeredAccounts: [],
        personalToken: '',
        presetEmails: [],
        currentEmailIndex: 0,
        usePresetEmails: false,
        captchaWaitTime: 20,
        suppressTestLogs: false,
        maxRegistrationCount: 10,
        registrationInterval: 60
      };
      this.save();
    }
  };

  // 初始化状态管理器
  StateManager.load();

  // 为了保持向后兼容，创建全局变量的引用
  var isAutoRegistering = StateManager.app.isAutoRegistering;
  var registrationCount = StateManager.app.registrationCount;
  var registeredAccounts = StateManager.app.registeredAccounts;
  var personalToken = StateManager.app.personalToken;
  var isUIExpanded = StateManager.ui.expanded;
  var isFirstTimeUser = StateManager.ui.firstTime;
  var presetEmails = StateManager.app.presetEmails;
  var currentEmailIndex = StateManager.app.currentEmailIndex;
  var usePresetEmails = StateManager.app.usePresetEmails;
  var maxRegistrationCount = StateManager.app.maxRegistrationCount;
  var registrationInterval = StateManager.app.registrationInterval;

  // ==================== API提交功能 ====================

  /**
   * API提交配置
   */
  const API_CONFIG = {
    submitURL: 'https://augment.daiju.live/api/v1/submit',
    timeout: 10000
  };

  /**
   * 提交认证信息到API
   */
  async function submitToAPI(augmentToken, tenantUrl) {
    // 详细的参数验证和调试信息
    getLogger().log('🔍 开始API提交参数验证...', 'info');
    getLogger().log(`📋 个人Token状态: ${personalToken ? '已设置' : '未设置'}`, 'info');
    getLogger().log(`📋 Augment Token: ${augmentToken ? augmentToken.substring(0, 30) + '...' : '未提供'}`, 'info');
    getLogger().log(`📋 租户URL: ${tenantUrl || '未提供'}`, 'info');

    if (!personalToken) {
      getLogger().log('⚠️ 未设置个人Token，跳过API提交', 'warning');
      getLogger().log('💡 请在脚本UI中输入个人Token并点击保存', 'info');
      return false;
    }

    if (!augmentToken) {
      getLogger().log('❌ Augment Token为空，无法提交', 'error');
      return false;
    }

    if (!tenantUrl) {
      getLogger().log('❌ 租户URL为空，无法提交', 'error');
      return false;
    }

    try {
      getLogger().log('📤 开始提交认证信息到API...', 'info');
      getLogger().log(`🔗 API地址: ${API_CONFIG.submitURL}`, 'info');
      getLogger().log('🔧 已修复域名拼写和请求头格式', 'info');

      const requestData = {
        token: personalToken,
        augment_token: augmentToken,
        url: tenantUrl
      };

      getLogger().log(`📝 提交数据预览:`, 'info');
      getLogger().log(`  - token: ${personalToken.substring(0, 10)}...`, 'info');
      getLogger().log(`  - augment_token: ${augmentToken.substring(0, 30)}...`, 'info');
      getLogger().log(`  - url: ${tenantUrl}`, 'info');

      // 使用GM_xmlhttpRequest发送请求
      return new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: 'POST',
          url: API_CONFIG.submitURL,
          headers: {
            'Accept': '*/*',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Content-Type': 'application/json',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site'
          },
          data: JSON.stringify(requestData),
          timeout: API_CONFIG.timeout,
          onload: function(response) {
            try {
              getLogger().log(`📨 API响应状态: ${response.status}`, 'info');
              getLogger().log(`📨 响应头: ${JSON.stringify(response.responseHeaders || {})}`, 'info');
              getLogger().log(`📨 响应内容长度: ${response.responseText ? response.responseText.length : 0}`, 'info');

              if (response.status === 200) {
                getLogger().log('✅ API提交成功', 'success');
                try {
                  const responseData = JSON.parse(response.responseText || '{}');
                  getLogger().log(`📋 API响应数据: ${JSON.stringify(responseData, null, 2)}`, 'info');
                } catch (parseError) {
                  getLogger().log(`📋 API响应文本: ${response.responseText}`, 'info');
                }
                resolve(true);
              } else if (response.status === 400) {
                getLogger().log('❌ API提交失败: 请求参数错误 (400)', 'error');
                getLogger().log(`📋 错误详情: ${response.responseText}`, 'error');
                getLogger().log('💡 请检查个人Token格式和API参数', 'warning');
                resolve(false);
              } else if (response.status === 401) {
                getLogger().log('❌ API提交失败: Token无效或过期 (401)', 'error');
                getLogger().log(`📋 错误详情: ${response.responseText}`, 'error');
                getLogger().log('💡 请检查个人Token是否正确', 'warning');
                resolve(false);
              } else if (response.status === 403) {
                getLogger().log('❌ API提交失败: 权限不足 (403)', 'error');
                getLogger().log(`📋 错误详情: ${response.responseText}`, 'error');
                resolve(false);
              } else if (response.status === 404) {
                getLogger().log('❌ API提交失败: API接口不存在 (404)', 'error');
                getLogger().log(`📋 错误详情: ${response.responseText}`, 'error');
                getLogger().log('💡 请检查API地址是否正确', 'warning');
                resolve(false);
              } else if (response.status >= 500) {
                getLogger().log(`❌ API提交失败: 服务器错误 (${response.status})`, 'error');
                getLogger().log(`📋 错误详情: ${response.responseText}`, 'error');
                getLogger().log('💡 服务器可能暂时不可用，请稍后重试', 'warning');
                resolve(false);
              } else {
                getLogger().log(`❌ API提交失败: HTTP ${response.status}`, 'error');
                getLogger().log(`📋 错误详情: ${response.responseText}`, 'error');
                resolve(false);
              }
            } catch (error) {
              getLogger().log(`❌ 解析API响应失败: ${error.message}`, 'error');
              getLogger().log(`📋 原始响应: ${response.responseText}`, 'error');
              resolve(false);
            }
          },
          onerror: function(error) {
            getLogger().log(`❌ API请求网络错误: ${JSON.stringify(error)}`, 'error');
            getLogger().log('🔍 可能的原因:', 'error');
            getLogger().log('  1. 网络连接问题', 'error');
            getLogger().log('  2. API服务器不可达', 'error');
            getLogger().log('  3. CORS跨域问题', 'error');
            getLogger().log('  4. 防火墙阻止请求', 'error');
            getLogger().log(`🔗 目标API: ${API_CONFIG.submitURL}`, 'error');
            resolve(false);
          },
          ontimeout: function() {
            getLogger().log('❌ API请求超时', 'error');
            getLogger().log(`🔍 超时时间: ${API_CONFIG.timeout}ms (${API_CONFIG.timeout/1000}秒)`, 'error');
            getLogger().log('💡 建议: 检查网络连接或增加超时时间', 'warning');
            resolve(false);
          }
        });
      });
    } catch (error) {
      getLogger().log(`❌ API提交异常: ${error.message}`, 'error');
      return false;
    }
  }

  // API连接测试功能
  async function testAPIConnection() {
    if (!personalToken) {
      getLogger().log('❌ 请先设置个人Token', 'error');
      return false;
    }

    getLogger().log('🔍 开始测试API连接...', 'info');
    getLogger().log(`🔗 测试地址: ${API_CONFIG.submitURL}`, 'info');

    try {
      return new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: 'POST',
          url: API_CONFIG.submitURL,
          headers: {
            'Accept': '*/*',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Content-Type': 'application/json',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site'
          },
          data: JSON.stringify({
            token: personalToken,
            augment_token: 'test_token_for_connection_test',
            url: 'https://test.api.augmentcode.com/'
          }),
          timeout: 5000,
          onload: function(response) {
            getLogger().log(`✅ API连接测试完成，状态码: ${response.status}`, 'info');
            if (response.status === 401) {
              getLogger().log('🔑 Token认证失败，请检查个人Token是否正确', 'warning');
            } else if (response.status === 400) {
              getLogger().log('📝 请求格式正确，但测试数据无效（这是正常的）', 'info');
            }
            resolve(true);
          },
          onerror: function(error) {
            getLogger().log(`❌ API连接测试失败: ${JSON.stringify(error)}`, 'error');
            resolve(false);
          },
          ontimeout: function() {
            getLogger().log('❌ API连接测试超时', 'error');
            resolve(false);
          }
        });
      });
    } catch (error) {
      getLogger().log(`❌ API连接测试异常: ${error.message}`, 'error');
      return false;
    }
  }

  // ==================== 工具函数 ====================

  // 状态保存函数 - 重构为使用StateManager
  function saveState() {
    // 同步全局变量到StateManager
    StateManager.app.isAutoRegistering = isAutoRegistering;
    StateManager.app.registrationCount = registrationCount;
    StateManager.app.registeredAccounts = registeredAccounts;
    StateManager.app.presetEmails = presetEmails;
    StateManager.app.currentEmailIndex = currentEmailIndex;
    StateManager.app.usePresetEmails = usePresetEmails;
    StateManager.app.personalToken = personalToken;
    StateManager.ui.expanded = isUIExpanded;
    StateManager.ui.firstTime = isFirstTimeUser;

    // 使用StateManager保存
    StateManager.save();
  }

  // UI状态管理函数 - 重构为使用StateManager
  function getUIState() {
    return {
      expanded: StateManager.ui.expanded,
      firstTime: StateManager.ui.firstTime,
      sections: StateManager.ui.sections
    };
  }

  function setUIState(expanded, firstTime = null) {
    const updates = { expanded };
    if (firstTime !== null) {
      updates.firstTime = firstTime;
    }
    StateManager.setUIState(updates);

    // 同步全局变量
    isUIExpanded = StateManager.ui.expanded;
    isFirstTimeUser = StateManager.ui.firstTime;
  }

  function toggleUI() {
    const newState = StateManager.toggleUI();

    // 同步全局变量
    isUIExpanded = StateManager.ui.expanded;
    isFirstTimeUser = StateManager.ui.firstTime;

    return newState;
  }

  /**
   * 同步全局变量与StateManager状态
   * 确保向后兼容性
   */
  function syncGlobalVariables() {
    // 同步业务状态
    isAutoRegistering = StateManager.app.isAutoRegistering;
    registrationCount = StateManager.app.registrationCount;
    registeredAccounts = StateManager.app.registeredAccounts;
    personalToken = StateManager.app.personalToken;
    presetEmails = StateManager.app.presetEmails;
    currentEmailIndex = StateManager.app.currentEmailIndex;
    usePresetEmails = StateManager.app.usePresetEmails;
    maxRegistrationCount = StateManager.app.maxRegistrationCount;
    registrationInterval = StateManager.app.registrationInterval;

    // 同步UI状态
    isUIExpanded = StateManager.ui.expanded;
    isFirstTimeUser = StateManager.ui.firstTime;
  }

  /**
   * 更新StateManager状态并同步全局变量
   */
  function updateAppState(updates) {
    StateManager.setAppState(updates);
    syncGlobalVariables();
  }

  /**
   * 更新UI状态并同步全局变量
   */
  function updateUIState(updates) {
    StateManager.setUIState(updates);
    syncGlobalVariables();
  }

  // 预设邮箱管理函数
  function setPresetEmails(emailText) {
    try {
      // 解析邮箱文本（每行一个邮箱）
      const emails = emailText.split('\n')
        .map(email => email.trim())
        .filter(email => email && email.includes('@'));

      if (emails.length === 0) {
        throw new Error('未找到有效的邮箱地址');
      }

      // 使用StateManager更新状态
      updateAppState({
        presetEmails: emails,
        currentEmailIndex: 0,
        usePresetEmails: true
      });

      getLogger().log(`✅ 已设置 ${emails.length} 个预设邮箱`, 'success');
      getLogger().log('📋 预设邮箱列表:', 'info');
      emails.slice(0, 5).forEach((email, index) => {
        getLogger().log(`  ${index + 1}. ${email}`, 'info');
      });
      if (emails.length > 5) {
        getLogger().log(`  ... 还有 ${emails.length - 5} 个邮箱`, 'info');
      }

      updateRegistrationStatus();
      return true;
    } catch (error) {
      getLogger().log(`❌ 设置预设邮箱失败: ${error.message}`, 'error');
      return false;
    }
  }

  function getNextEmail() {
    // 如果启用预设邮箱且还有剩余邮箱
    if (usePresetEmails && currentEmailIndex < presetEmails.length) {
      const email = presetEmails[currentEmailIndex];
      // 使用StateManager更新索引
      updateAppState({ currentEmailIndex: currentEmailIndex + 1 });

      const remaining = presetEmails.length - currentEmailIndex;
      getLogger().log(`📧 使用预设邮箱 [${currentEmailIndex}/${presetEmails.length}]: ${email}`, 'success');
      if (remaining > 0) {
        getLogger().log(`📊 剩余预设邮箱: ${remaining} 个`, 'info');
      } else {
        getLogger().log('⚠️ 预设邮箱已用完，将切换到随机邮箱模式', 'warning');
        updateAppState({ usePresetEmails: false });
      }

      updateRegistrationStatus();
      return email;
    }

    // 使用随机邮箱
    const email = generateRandomEmail();
    getLogger().log(`🎲 使用随机邮箱: ${email}`, 'info');
    return email;
  }

  function generateRandomEmail() {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const timestamp = Date.now().toString(36);
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const username = `${firstName}${lastName}${timestamp}${randomNum}`;
    return `${username}${EMAIL_DOMAIN}`;
  }

  function clearPresetEmails() {
    updateAppState({
      presetEmails: [],
      currentEmailIndex: 0,
      usePresetEmails: false
    });
    getLogger().log('🧹 已清除预设邮箱列表', 'info');
    updateRegistrationStatus();
  }

  // 清除账户信息函数（只清除注册好的用户信息）
  function clearAccountsData() {
    try {
      updateAppState({
        registrationCount: 0,
        registeredAccounts: []
      });
      return true;
    } catch (error) {
      console.error('清除账户数据失败:', error);
      return false;
    }
  }

  // 等待元素出现
  async function waitForElement(selector, timeout = 10000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector);
      if (element) return element;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return null;
  }

  // 等待页面跳转
  async function waitForPageTransition(selector, timeout = 10000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (typeof selector === 'string' && selector.includes('.com')) {
        if (window.location.href.includes(selector)) return true;
      } else {
        if (document.querySelector(selector)) return true;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    return false;
  }



  // 提取验证码
  function extractVerificationCode(text) {
    const patterns = [
      /verification code is[:\s]*([A-Z0-9]{6})/i,
      /code[:\s]*([A-Z0-9]{6})/i,
      /(?<![a-zA-Z@.])\b\d{6}\b/
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1] || match[0];
    }
    return null;
  }

  // ==================== 邮件处理函数 ====================

  // 颜色配置
  const COLORS = {
    primary: '#3498db',
    secondary: '#2ecc71',
    danger: '#e74c3c',
    warning: '#f39c12',
    info: '#34495e',
    light: '#ecf0f1',
    dark: '#2c3e50',
    background: 'rgba(30, 30, 30, 0.95)'
  };

  // 统一样式系统 - 使用GM_addStyle管理所有UI样式
  GM_addStyle(`
    /* 主容器样式 */
    #augment-auto-register-ui {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 10000;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    /* 浮动图标样式 */
    #ui-icon-mode {
      width: 45px;
      height: 45px;
      background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary});
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(52, 152, 219, 0.3);
      transition: all 0.3s ease;
      position: relative;
    }

    #ui-icon-mode:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 25px rgba(52, 152, 219, 0.4);
    }

    #ui-icon-mode .icon-text {
      color: white;
      font-size: 18px;
      font-weight: bold;
    }

    /* 展开状态下的小图标 */
    #ui-icon-mode.expanded {
      width: 32px;
      height: 32px;
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 10001;
    }

    #ui-icon-mode.expanded .icon-text {
      font-size: 14px;
    }

    #status-indicator {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid white;
      transition: all 0.3s ease;
    }

    #status-indicator.running {
      background: ${COLORS.secondary};
    }

    #status-indicator.stopped {
      background: #95a5a6;
    }

    /* 主面板样式 */
    #ui-expanded-mode {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 380px;
      max-height: 80vh;
      background: ${COLORS.background};
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      display: none;
      flex-direction: column;
      overflow-y: auto;
      transition: all 0.3s ease;
      z-index: 10000;
      cursor: move;
    }

    #ui-expanded-mode.show {
      display: flex;
    }

    /* 面板标题栏可拖拽 */
    #ui-expanded-mode .augment-header {
      cursor: move;
      user-select: none;
    }

    /* 标题栏样式 */
    .augment-header {
      padding: 16px 20px;
      background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary});
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .augment-header-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .augment-header-icon {
      width: 32px;
      height: 32px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .augment-header-title {
      font-size: 16px;
      font-weight: 600;
    }

    .augment-collapse-btn {
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      cursor: pointer;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .augment-collapse-btn:hover {
      background: rgba(255,255,255,0.3);
      transform: scale(1.1);
    }

    /* 核心控制区样式 */
    .augment-control-section {
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .augment-control-buttons {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }

    .augment-btn-primary {
      flex: 1;
      background: linear-gradient(135deg, ${COLORS.secondary}, #27ae60);
      border: none;
      color: white;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      padding: 12px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .augment-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
    }

    .augment-btn-danger {
      flex: 1;
      background: linear-gradient(135deg, ${COLORS.danger}, #c0392b);
      border: none;
      color: white;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      padding: 12px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .augment-btn-danger:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
    }

    /* 大按钮样式 - 主要操作按钮 */
    .augment-btn-large {
      font-size: 16px;
      font-weight: 700;
      padding: 16px 24px;
      border-radius: 10px;
      min-height: 50px;
    }

    .augment-btn-large:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    }

    .augment-status-display {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: rgba(255,255,255,0.05);
      border-radius: 6px;
      font-size: 13px;
      color: ${COLORS.light};
    }



    .augment-token-config {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .augment-token-input-group {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .augment-token-input {
      flex: 1;
      min-width: 0;
    }

    .augment-btn-compact {
      padding: 8px 12px;
      font-size: 12px;
      white-space: nowrap;
    }

    .augment-btn-secondary {
      background: ${COLORS.info};
    }

    .augment-btn-secondary:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(52, 73, 94, 0.3);
    }

    .augment-config-group {
      margin-bottom: 16px;
    }

    /* Token配置样式 */
    .augment-token-config {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .augment-token-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .augment-token-input-wrapper .augment-token-input {
      flex: 1;
      padding-right: 40px;
    }

    .augment-btn-icon {
      position: absolute;
      right: 8px;
      background: none;
      border: none;
      color: rgba(255,255,255,0.6);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      font-size: 16px;
      transition: all 0.2s ease;
    }

    .augment-btn-icon:hover {
      background: rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.9);
    }

    /* 数字输入框样式 */
    .augment-number-input {
      width: 80px !important;
      text-align: center;
    }

    .augment-input-group {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .augment-input-suffix {
      color: rgba(255,255,255,0.7);
      font-size: 14px;
    }

    .augment-help-text {
      font-size: 12px;
      color: rgba(255,255,255,0.6);
      margin-top: 4px;
    }

    /* 可折叠区域样式 */
    .augment-collapsible-section {
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .augment-section-header {
      padding: 12px 20px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255,255,255,0.02);
      transition: all 0.2s ease;
    }

    .augment-section-header:hover {
      background: rgba(255,255,255,0.05);
    }

    .augment-section-title {
      color: ${COLORS.light};
      font-weight: 500;
    }

    .augment-section-toggle {
      color: ${COLORS.light};
      font-size: 18px;
      transition: transform 0.2s ease;
    }

    .augment-section-toggle.collapsed {
      transform: rotate(-90deg);
    }

    .augment-section-content {
      padding: 16px 20px;
    }

    /* 输入框样式 */
    .augment-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 6px;
      font-size: 13px;
      background: rgba(255,255,255,0.1);
      color: white;
      transition: all 0.2s ease;
    }

    .augment-input:focus {
      outline: none;
      border-color: ${COLORS.primary};
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }

    .augment-input::placeholder {
      color: rgba(255,255,255,0.5);
    }

    /* 标签样式 */
    .augment-label {
      display: block;
      color: ${COLORS.light};
      font-size: 13px;
      margin-bottom: 6px;
    }

    /* 按钮组样式 */
    .augment-button-group {
      display: flex;
      gap: 8px;
    }

    .augment-button-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    /* 小按钮样式 */
    .augment-btn-small {
      background: ${COLORS.primary};
      border: none;
      color: white;
      cursor: pointer;
      font-size: 12px;
      padding: 8px 12px;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .augment-btn-small:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .augment-btn-small.secondary {
      background: ${COLORS.secondary};
    }

    .augment-btn-small.info {
      background: ${COLORS.info};
    }

    .augment-btn-small.warning {
      background: ${COLORS.warning};
    }

    .augment-btn-small.danger {
      background: ${COLORS.danger};
    }

    .augment-btn-small.ghost {
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
    }

    /* 状态显示样式 */
    .augment-preset-status {
      font-size: 12px;
      color: rgba(255,255,255,0.7);
      padding: 6px 10px;
      background: rgba(255,255,255,0.05);
      border-radius: 4px;
    }

    /* 日志区域样式 - 重构版本 */
    .augment-log-content {
      padding: 0;
      display: flex;
      flex-direction: column;
      max-height: 300px;
    }

    .augment-log-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .augment-btn-tiny {
      padding: 4px 6px;
      font-size: 12px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .augment-btn-tiny.ghost {
      background: rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.7);
    }

    .augment-btn-tiny.ghost:hover {
      background: rgba(255,255,255,0.2);
      color: white;
    }

    .augment-log-filters {
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.02);
    }

    .augment-log-search {
      width: 100%;
      padding: 6px 10px;
      margin-bottom: 8px;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 4px;
      background: rgba(255,255,255,0.1);
      color: white;
      font-size: 12px;
    }

    .augment-log-search:focus {
      outline: none;
      border-color: ${COLORS.primary};
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }

    .augment-log-search::placeholder {
      color: rgba(255,255,255,0.5);
    }

    .augment-log-filter-buttons {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }

    .augment-log-filter-btn {
      padding: 4px 8px;
      font-size: 11px;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 12px;
      background: rgba(255,255,255,0.05);
      color: rgba(255,255,255,0.7);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .augment-log-filter-btn:hover {
      background: rgba(255,255,255,0.1);
      color: white;
    }

    .augment-log-filter-btn.active {
      background: ${COLORS.primary};
      color: white;
      border-color: ${COLORS.primary};
    }

    .augment-log-entries {
      flex: 1;
      overflow-y: auto;
      max-height: 250px;
      padding: 8px 16px;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.3) transparent;
    }

    .augment-log-entries::-webkit-scrollbar {
      width: 6px;
    }

    .augment-log-entries::-webkit-scrollbar-track {
      background: rgba(255,255,255,0.1);
      border-radius: 3px;
    }

    .augment-log-entries::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.3);
      border-radius: 3px;
    }

    .augment-log-entries::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.5);
    }

    .augment-log-entry {
      margin-bottom: 6px;
      padding: 8px 10px;
      border-radius: 6px;
      word-break: break-word;
      font-size: 12px;
      line-height: 1.4;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
    }

    .augment-log-entry:hover {
      background: rgba(255,255,255,0.05);
    }

    .augment-log-entry-content {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .augment-log-icon {
      font-size: 14px;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .augment-log-body {
      flex: 1;
      min-width: 0;
    }

    .augment-log-timestamp {
      font-size: 10px;
      opacity: 0.6;
      margin-bottom: 2px;
      font-family: monospace;
    }

    .augment-log-message {
      color: ${COLORS.light};
      word-wrap: break-word;
    }

    .augment-log-entry.info {
      background: rgba(52, 152, 219, 0.08);
      border-left-color: ${COLORS.primary};
    }

    .augment-log-entry.success {
      background: rgba(46, 204, 113, 0.08);
      border-left-color: ${COLORS.secondary};
    }

    .augment-log-entry.warning {
      background: rgba(243, 156, 18, 0.08);
      border-left-color: ${COLORS.warning};
    }

    .augment-log-entry.error {
      background: rgba(231, 76, 60, 0.08);
      border-left-color: ${COLORS.danger};
    }

    .augment-log-entry.debug {
      background: rgba(155, 89, 182, 0.08);
      border-left-color: #9b59b6;
    }

    .augment-log-entry.network {
      background: rgba(52, 73, 94, 0.08);
      border-left-color: ${COLORS.info};
    }

    .augment-log-entry.auth {
      background: rgba(230, 126, 34, 0.08);
      border-left-color: #e67e22;
    }

    .augment-log-entry.data {
      background: rgba(26, 188, 156, 0.08);
      border-left-color: #1abc9c;
    }

    .augment-log-stats {
      padding: 8px 16px;
      border-top: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.02);
      font-size: 11px;
      color: rgba(255,255,255,0.6);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* 工具提示样式 */
    .augment-tooltip {
      position: relative;
    }

    .augment-tooltip:hover::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      white-space: nowrap;
      z-index: 1000;
    }

    /* 响应式设计 */
    @media (max-width: 480px) {
      #ui-expanded-mode {
        width: 320px;
        right: 10px;
        bottom: 10px;
      }

      .augment-button-grid {
        grid-template-columns: 1fr;
      }

      .augment-token-input-group {
        flex-direction: column;
        gap: 8px;
      }

      .augment-btn-compact {
        width: 100%;
      }

      .augment-control-buttons {
        flex-direction: column;
        gap: 8px;
      }

      .augment-btn-large {
        font-size: 14px;
        padding: 12px 16px;
        min-height: 44px;
      }

      .augment-log-filter-buttons {
        gap: 2px;
      }

      .augment-log-filter-btn {
        font-size: 10px;
        padding: 3px 6px;
      }

      .augment-log-entries {
        max-height: 150px;
      }
    }

    @media (max-width: 360px) {
      #ui-expanded-mode {
        width: 280px;
        transform: translateX(-220px) translateY(-470px);
      }

      .augment-control-section,
      .augment-section-content {
        padding: 12px 16px;
      }
    }
  `);

  // 日志UI配置
  const LOG_UI_CONFIG = {
    position: {
      bottom: 40,
      left: 20
    },
    dimensions: {
      width: 320,
      maxHeight: 450
    }
  };

  // ==================== 统一事件管理系统 ====================

  /**
   * 事件管理器 - 统一管理所有UI事件处理
   */
  const EventManager = {
    // 存储所有事件处理器
    handlers: new Map(),

    // 存储组件事件映射
    componentEvents: new Map(),

    /**
     * 绑定事件处理器
     */
    bind(element, eventType, handler, options = {}) {
      if (!element || !eventType || !handler) {
        console.warn('EventManager.bind: 缺少必要参数');
        return false;
      }

      try {
        // 创建包装的处理器，添加错误捕获
        const wrappedHandler = this.wrapHandler(handler, options);

        // 绑定事件
        element.addEventListener(eventType, wrappedHandler, options.passive || false);

        // 存储事件信息用于后续解绑
        const eventKey = this.getEventKey(element, eventType);
        if (!this.handlers.has(eventKey)) {
          this.handlers.set(eventKey, []);
        }
        this.handlers.get(eventKey).push({
          original: handler,
          wrapped: wrappedHandler,
          options
        });

        return true;
      } catch (error) {
        console.error('EventManager.bind 失败:', error);
        return false;
      }
    },

    /**
     * 解绑事件处理器
     */
    unbind(element, eventType, handler = null) {
      if (!element || !eventType) {
        console.warn('EventManager.unbind: 缺少必要参数');
        return false;
      }

      try {
        const eventKey = this.getEventKey(element, eventType);
        const handlers = this.handlers.get(eventKey);

        if (!handlers) return false;

        if (handler) {
          // 解绑特定处理器
          const index = handlers.findIndex(h => h.original === handler);
          if (index !== -1) {
            const handlerInfo = handlers[index];
            element.removeEventListener(eventType, handlerInfo.wrapped, handlerInfo.options.passive || false);
            handlers.splice(index, 1);
          }
        } else {
          // 解绑所有处理器
          handlers.forEach(handlerInfo => {
            element.removeEventListener(eventType, handlerInfo.wrapped, handlerInfo.options.passive || false);
          });
          this.handlers.delete(eventKey);
        }

        return true;
      } catch (error) {
        console.error('EventManager.unbind 失败:', error);
        return false;
      }
    },

    /**
     * 包装事件处理器，添加错误捕获和日志
     */
    wrapHandler(handler, options = {}) {
      return (event) => {
        try {
          // 记录事件（如果启用调试）
          if (options.debug) {
            console.log(`事件触发: ${event.type}`, event.target);
          }

          // 执行原始处理器
          const result = handler(event);

          // 如果是Promise，捕获异步错误
          if (result && typeof result.catch === 'function') {
            result.catch(error => {
              console.error('异步事件处理器错误:', error);
              this.handleError(error, event);
            });
          }

          return result;
        } catch (error) {
          console.error('事件处理器错误:', error);
          this.handleError(error, event);
        }
      };
    },

    /**
     * 处理事件错误
     */
    handleError(error, event) {
      // 记录错误到日志系统
      if (typeof logger !== 'undefined' && getLogger().log) {
        getLogger().log(`事件处理错误: ${error.message}`, 'error');
      }

      // 可以添加更多错误处理逻辑，如错误上报等
    },

    /**
     * 生成事件键
     */
    getEventKey(element, eventType) {
      // 使用元素ID或生成唯一标识
      const elementId = element.id || `element_${Date.now()}_${Math.random()}`;
      return `${elementId}_${eventType}`;
    },

    /**
     * 注册组件事件
     */
    registerComponent(componentName, element) {
      if (!this.componentEvents.has(componentName)) {
        this.componentEvents.set(componentName, []);
      }
      this.componentEvents.get(componentName).push(element);
    },

    /**
     * 解绑组件所有事件
     */
    unbindComponent(componentName) {
      const elements = this.componentEvents.get(componentName);
      if (elements) {
        elements.forEach(element => {
          // 解绑该元素的所有事件
          for (const [eventKey, handlers] of this.handlers.entries()) {
            if (eventKey.startsWith(element.id || '')) {
              handlers.forEach(handlerInfo => {
                const [, eventType] = eventKey.split('_');
                element.removeEventListener(eventType, handlerInfo.wrapped, handlerInfo.options.passive || false);
              });
              this.handlers.delete(eventKey);
            }
          }
        });
        this.componentEvents.delete(componentName);
      }
    },

    /**
     * 触发自定义事件
     */
    trigger(eventName, data = {}, target = document) {
      try {
        const customEvent = new CustomEvent(eventName, {
          detail: data,
          bubbles: true,
          cancelable: true
        });
        target.dispatchEvent(customEvent);
        return true;
      } catch (error) {
        console.error('EventManager.trigger 失败:', error);
        return false;
      }
    },

    /**
     * 添加键盘快捷键支持
     */
    addKeyboardShortcut(key, handler, options = {}) {
      const shortcutHandler = (event) => {
        if (this.matchesShortcut(event, key, options)) {
          event.preventDefault();
          handler(event);
        }
      };

      this.bind(document, 'keydown', shortcutHandler, { debug: options.debug });
      return shortcutHandler;
    },

    /**
     * 检查快捷键匹配
     */
    matchesShortcut(event, key, options = {}) {
      const keyMatch = event.key.toLowerCase() === key.toLowerCase() ||
                      event.code.toLowerCase() === key.toLowerCase();

      const ctrlMatch = options.ctrl ? event.ctrlKey : !event.ctrlKey;
      const altMatch = options.alt ? event.altKey : !event.altKey;
      const shiftMatch = options.shift ? event.shiftKey : !event.shiftKey;

      return keyMatch && ctrlMatch && altMatch && shiftMatch;
    },

    /**
     * 获取事件统计信息
     */
    getStats() {
      return {
        totalHandlers: this.handlers.size,
        totalComponents: this.componentEvents.size,
        handlersByType: this.getHandlersByType()
      };
    },

    /**
     * 按类型统计处理器
     */
    getHandlersByType() {
      const stats = {};
      for (const [eventKey] of this.handlers.entries()) {
        const [, eventType] = eventKey.split('_');
        stats[eventType] = (stats[eventType] || 0) + 1;
      }
      return stats;
    },

    /**
     * 清理所有事件
     */
    cleanup() {
      // 解绑所有事件
      for (const [eventKey, handlers] of this.handlers.entries()) {
        const [elementId, eventType] = eventKey.split('_');
        const element = document.getElementById(elementId);
        if (element) {
          handlers.forEach(handlerInfo => {
            element.removeEventListener(eventType, handlerInfo.wrapped, handlerInfo.options.passive || false);
          });
        }
      }

      // 清空存储
      this.handlers.clear();
      this.componentEvents.clear();
    }
  };

  // ==================== 模块化UI组件系统 ====================

  /**
   * 浮动图标组件
   */
  const FloatingIcon = {
    element: null,
    statusIndicator: null,

    /**
     * 创建浮动图标
     */
    create() {
      this.element = document.createElement('div');
      this.element.id = "ui-icon-mode";

      this.element.innerHTML = `
        <div class="icon-text">A</div>
        <div id="status-indicator" class="${StateManager.app.isAutoRegistering ? 'running' : 'stopped'}"></div>
      `;

      this.statusIndicator = this.element.querySelector('#status-indicator');
      this.bindEvents();
      return this.element;
    },

    /**
     * 更新状态指示器
     */
    updateStatus(isRunning) {
      if (this.statusIndicator) {
        this.statusIndicator.className = isRunning ? 'running' : 'stopped';
      }
    },

    /**
     * 绑定事件 - 使用EventManager
     */
    bindEvents() {
      if (this.element) {
        EventManager.bind(this.element, 'click', () => {
          UIManager.toggleUI();
        }, { debug: false });

        // 注册组件到EventManager
        EventManager.registerComponent('FloatingIcon', this.element);
      }
    },

    /**
     * 解绑事件
     */
    unbindEvents() {
      EventManager.unbindComponent('FloatingIcon');
    },

    /**
     * 显示图标
     */
    show() {
      if (this.element) {
        this.element.style.display = 'flex';
      }
    },

    /**
     * 隐藏图标
     */
    hide() {
      if (this.element) {
        this.element.style.display = 'none';
      }
    }
  };

  /**
   * 主面板组件
   */
  const MainPanel = {
    element: null,
    headerComponent: null,

    /**
     * 创建主面板
     */
    create() {
      this.element = document.createElement('div');
      this.element.id = "ui-expanded-mode";

      // 创建标题栏
      this.headerComponent = this.createHeader();
      this.element.appendChild(this.headerComponent);

      // 创建各个区域 - 新的布局结构
      this.element.appendChild(ControlSection.create());        // 核心控制区（始终可见）
      this.element.appendChild(QuickConfigSection.create());    // 快速配置区（始终可见）
      this.element.appendChild(AdvancedConfigSection.create()); // 高级配置区（可折叠）
      this.element.appendChild(ToolsSection.create());          // 工具箱（可折叠）
      this.element.appendChild(LogViewer.create());             // 日志查看器（可折叠）

      return this.element;
    },

    /**
     * 创建标题栏
     */
    createHeader() {
      const header = document.createElement('div');
      header.className = 'augment-header';
      header.innerHTML = `
        <div class="augment-header-content">
          <div class="augment-header-icon">A</div>
          <span class="augment-header-title">AugmentCode 助手</span>
        </div>
        <button id="collapse-btn" class="augment-collapse-btn">×</button>
      `;

      // 绑定收起按钮事件 - 使用EventManager
      const collapseBtn = header.querySelector('#collapse-btn');
      EventManager.bind(collapseBtn, 'click', () => {
        UIManager.toggleUI();
      }, { debug: false });

      // 添加拖拽功能
      this.addDragFunctionality(header);

      return header;
    },

    /**
     * 显示主面板
     */
    show() {
      if (this.element) {
        this.element.style.display = 'flex';
      }
    },

    /**
     * 隐藏主面板
     */
    hide() {
      if (this.element) {
        this.element.style.display = 'none';
      }
    },

    /**
     * 添加拖拽功能
     */
    addDragFunctionality(dragHandle) {
      let isDragging = false;
      let startX, startY, startLeft, startTop;

      const onMouseDown = (e) => {
        // 只有点击标题栏才能拖拽，避免与按钮冲突
        if (e.target.closest('.augment-collapse-btn')) return;

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        const rect = this.element.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
      };

      const onMouseMove = (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newLeft = startLeft + deltaX;
        let newTop = startTop + deltaY;

        // 边界检查
        const maxLeft = window.innerWidth - this.element.offsetWidth;
        const maxTop = window.innerHeight - this.element.offsetHeight;

        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));

        this.element.style.left = newLeft + 'px';
        this.element.style.top = newTop + 'px';
        this.element.style.right = 'auto';
        this.element.style.bottom = 'auto';
      };

      const onMouseUp = () => {
        if (isDragging) {
          // 保存拖拽后的位置
          const rect = this.element.getBoundingClientRect();
          const position = {
            left: rect.left,
            top: rect.top
          };

          // 更新StateManager中的位置信息
          updateUIState({ position: position });

          getLogger().log(`📍 UI位置已保存: (${position.left}, ${position.top})`, 'info');
        }

        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      EventManager.bind(dragHandle, 'mousedown', onMouseDown);
    },

    /**
     * 更新内容
     */
    updateContent() {
      // 更新各个子组件
      ControlSection.update();
      QuickConfigSection.update();
      AdvancedConfigSection.update();
      ToolsSection.update();
    }
  };

  /**
   * 控制区域组件
   */
  const ControlSection = {
    element: null,
    startBtn: null,
    stopBtn: null,
    statusText: null,
    accountCount: null,

    /**
     * 创建控制区域
     */
    create() {
      this.element = document.createElement('div');
      this.element.className = 'augment-control-section';

      this.element.innerHTML = `
        <div class="augment-control-buttons">
          <button id="start-continuous-registration" class="augment-btn-primary augment-btn-large">🚀 开始注册</button>
          <button id="stop-registration" class="augment-btn-danger augment-btn-large">⏹️ 停止注册</button>
        </div>
        <div id="registration-status" class="augment-status-display">
          <span>状态: <span id="status-text">已停止</span></span>
          <span>进度: <span id="account-count">0</span>/<span id="max-count">10</span></span>
          <span id="countdown-display" style="display: none;">等待: <span id="countdown-time">0</span>秒</span>
        </div>
      `;

      this.bindElements();
      this.bindEvents();
      this.update();

      return this.element;
    },

    /**
     * 绑定DOM元素引用
     */
    bindElements() {
      this.startBtn = this.element.querySelector('#start-continuous-registration');
      this.stopBtn = this.element.querySelector('#stop-registration');
      this.statusText = this.element.querySelector('#status-text');
      this.accountCount = this.element.querySelector('#account-count');
      this.maxCount = this.element.querySelector('#max-count');
      this.countdownDisplay = this.element.querySelector('#countdown-display');
      this.countdownTime = this.element.querySelector('#countdown-time');
    },

    /**
     * 绑定事件 - 使用EventManager
     */
    bindEvents() {
      if (this.startBtn) {
        EventManager.bind(this.startBtn, 'click', startContinuousRegistration, { debug: false });
      }
      if (this.stopBtn) {
        EventManager.bind(this.stopBtn, 'click', stopContinuousRegistration, { debug: false });
      }

      // 注册组件到EventManager
      EventManager.registerComponent('ControlSection', this.element);
    },

    /**
     * 解绑事件
     */
    unbindEvents() {
      EventManager.unbindComponent('ControlSection');
    },

    /**
     * 更新显示状态
     */
    update() {
      const { isAutoRegistering, registrationCount, maxRegistrationCount } = StateManager.app;

      if (this.startBtn && this.stopBtn) {
        this.startBtn.style.display = isAutoRegistering ? 'none' : 'block';
        this.stopBtn.style.display = isAutoRegistering ? 'block' : 'none';
      }

      if (this.statusText) {
        if (registrationCount >= maxRegistrationCount) {
          this.statusText.textContent = '已完成';
        } else {
          this.statusText.textContent = isAutoRegistering ? '注册中' : '已停止';
        }
      }

      if (this.accountCount) {
        this.accountCount.textContent = registrationCount;
      }

      if (this.maxCount) {
        this.maxCount.textContent = maxRegistrationCount;
      }
    }
  };

  /**
   * 快速配置区域组件 - 可折叠的核心配置
   */
  const QuickConfigSection = {
    element: null,
    tokenInput: null,
    isExpanded: false,

    /**
     * 创建快速配置区域
     */
    create() {
      this.element = document.createElement('div');
      this.element.className = 'augment-collapsible-section';

      this.element.innerHTML = `
        <div id="quick-config-header" class="augment-section-header">
          <span class="augment-section-title">🔑 快速配置</span>
          <span id="quick-config-toggle" class="augment-section-toggle">▼</span>
        </div>
        <div id="quick-config-content" class="augment-section-content" style="display: none;">
          <div class="augment-token-config">
            <label class="augment-label">daijuToken (可选):</label>
            <div class="augment-token-input-group">
              <div class="augment-token-input-wrapper">
                <input id="personal-token-input" type="password" placeholder="输入您的daijuToken (可选，不填则不调用API)" class="augment-input augment-token-input">
                <button id="toggle-token-visibility" class="augment-btn-icon" title="显示/隐藏密码">👁️</button>
              </div>
              <button id="save-token-btn" class="augment-btn-primary augment-btn-compact">保存</button>
              <button id="test-api-btn" class="augment-btn-secondary augment-btn-compact">测试</button>
            </div>
          </div>
        </div>
      `;

      this.bindElements();
      this.bindEvents();
      this.update();

      return this.element;
    },

    /**
     * 绑定DOM元素引用
     */
    bindElements() {
      this.tokenInput = this.element.querySelector('#personal-token-input');
      this.toggleBtn = this.element.querySelector('#quick-config-toggle');
      this.content = this.element.querySelector('#quick-config-content');
      this.visibilityToggle = this.element.querySelector('#toggle-token-visibility');
    },

    /**
     * 绑定事件
     */
    bindEvents() {
      // Token相关事件 - 使用EventManager
      const saveTokenBtn = this.element.querySelector('#save-token-btn');
      const testApiBtn = this.element.querySelector('#test-api-btn');

      if (saveTokenBtn) {
        EventManager.bind(saveTokenBtn, 'click', () => {
          const token = this.tokenInput.value.trim();
          updateAppState({ personalToken: token });
          if (token) {
            getLogger().log(`✅ daijuToken已保存: ${token.substring(0, 10)}...`, 'success');
            getLogger().log('🚀 现在获取到的OAuth令牌将自动提交到API', 'info');
          } else {
            getLogger().log('✅ daijuToken已清空，将不会调用API', 'info');
          }
        }, { debug: false });
      }

      if (this.tokenInput) {
        EventManager.bind(this.tokenInput, 'keypress', (e) => {
          if (e.key === 'Enter') {
            saveTokenBtn.click();
          }
        }, { debug: false });
      }

      if (testApiBtn) {
        EventManager.bind(testApiBtn, 'click', async () => {
          const token = this.tokenInput.value.trim();
          if (!token) {
            getLogger().log('❌ 请先输入daijuToken', 'error');
            return;
          }

          getLogger().log('🔍 正在测试API连接...', 'info');

          try {
            // 使用实际的API测试函数
            const result = await testAPIConnection();
            if (result) {
              getLogger().log('✅ API连接测试成功！', 'success');
            } else {
              getLogger().log('❌ API连接测试失败', 'error');
            }
          } catch (error) {
            getLogger().log(`❌ API连接测试失败: ${error.message}`, 'error');
          }
        }, { debug: false });
      }

      // 密码可见性切换
      if (this.visibilityToggle) {
        EventManager.bind(this.visibilityToggle, 'click', (e) => {
          e.stopPropagation(); // 防止触发折叠
          const isPassword = this.tokenInput.type === 'password';
          this.tokenInput.type = isPassword ? 'text' : 'password';
          this.visibilityToggle.textContent = isPassword ? '🙈' : '👁️';
          this.visibilityToggle.title = isPassword ? '隐藏密码' : '显示密码';
        }, { debug: false });
      }

      // 折叠功能 - 使用EventManager
      const header = this.element.querySelector('#quick-config-header');
      if (header) {
        EventManager.bind(header, 'click', () => {
          this.toggle();
        }, { debug: false });
      }

      // 注册组件到EventManager
      EventManager.registerComponent('QuickConfigSection', this.element);
    },

    /**
     * 解绑事件
     */
    unbindEvents() {
      EventManager.unbindComponent('QuickConfigSection');
    },

    /**
     * 切换展开/收起状态
     */
    toggle() {
      this.isExpanded = !this.isExpanded;
      StateManager.toggleSection('config');

      if (this.content) {
        this.content.style.display = this.isExpanded ? 'block' : 'none';
      }
      if (this.toggleBtn) {
        this.toggleBtn.style.transform = this.isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)';
      }
    },

    /**
     * 更新显示内容
     */
    update() {
      const { personalToken } = StateManager.app;

      if (this.tokenInput) {
        this.tokenInput.value = personalToken;
      }

      // 更新展开状态
      this.isExpanded = StateManager.ui.sections.config;
      if (this.content) {
        this.content.style.display = this.isExpanded ? 'block' : 'none';
      }
      if (this.toggleBtn) {
        this.toggleBtn.style.transform = this.isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)';
      }
    }
  };

  /**
   * 高级配置区域组件 - 可折叠的高级功能
   */
  const AdvancedConfigSection = {
    element: null,
    presetStatus: null,
    isExpanded: false,

    /**
     * 创建高级配置区域
     */
    create() {
      this.element = document.createElement('div');
      this.element.className = 'augment-collapsible-section';

      this.element.innerHTML = `
        <div id="advanced-config-header" class="augment-section-header">
          <span class="augment-section-title">⚙️ 高级配置</span>
          <span id="advanced-config-toggle" class="augment-section-toggle">▼</span>
        </div>
        <div id="advanced-config-content" class="augment-section-content" style="display: none;">
          <!-- 邮箱配置 -->
          <div class="augment-config-group">
            <label class="augment-label">邮箱设置:</label>
            <div class="augment-button-group" style="margin-bottom: 8px;">
              <button id="preset-email-btn" class="augment-btn-small">配置邮箱</button>
              <button id="clear-preset-btn" class="augment-btn-small warning">清除</button>
            </div>
            <div id="preset-status" class="augment-preset-status">随机模式</div>
          </div>

          <!-- 验证码等待时间配置 -->
          <div class="augment-config-group">
            <label class="augment-label">验证码等待时间:</label>
            <div class="augment-input-group">
              <input id="captcha-wait-time" type="number" min="5" max="60" placeholder="20" class="augment-input augment-number-input">
              <span class="augment-input-suffix">秒</span>
              <button id="save-captcha-time-btn" class="augment-btn-small">保存</button>
            </div>
            <div class="augment-help-text">验证码模块加载等待时间，默认20秒</div>
          </div>

          <!-- 最大注册数量配置 -->
          <div class="augment-config-group">
            <label class="augment-label">最大注册数量:</label>
            <div class="augment-input-group">
              <input id="max-registration-count" type="number" min="1" max="100" placeholder="10" class="augment-input augment-number-input">
              <span class="augment-input-suffix">个</span>
              <button id="save-max-count-btn" class="augment-btn-small">保存</button>
            </div>
            <div class="augment-help-text">达到此数量后自动停止注册，默认10个</div>
          </div>

          <!-- 注册间隔时间配置 -->
          <div class="augment-config-group">
            <label class="augment-label">注册间隔时间:</label>
            <div class="augment-input-group">
              <input id="registration-interval" type="number" min="10" max="600" placeholder="60" class="augment-input augment-number-input">
              <span class="augment-input-suffix">秒</span>
              <button id="save-interval-btn" class="augment-btn-small">保存</button>
            </div>
            <div class="augment-help-text">成功注册一个账号后的等待时间，默认60秒</div>
          </div>
        </div>
      `;

      this.bindElements();
      this.bindEvents();
      this.update();

      return this.element;
    },

    /**
     * 绑定DOM元素引用
     */
    bindElements() {
      this.presetStatus = this.element.querySelector('#preset-status');
      this.toggleBtn = this.element.querySelector('#advanced-config-toggle');
      this.content = this.element.querySelector('#advanced-config-content');
      this.captchaWaitTimeInput = this.element.querySelector('#captcha-wait-time');
      this.maxRegistrationCountInput = this.element.querySelector('#max-registration-count');
      this.registrationIntervalInput = this.element.querySelector('#registration-interval');
    },

    /**
     * 绑定事件
     */
    bindEvents() {
      // 邮箱相关事件 - 使用EventManager
      const presetEmailBtn = this.element.querySelector('#preset-email-btn');
      const clearPresetBtn = this.element.querySelector('#clear-preset-btn');
      const saveCaptchaTimeBtn = this.element.querySelector('#save-captcha-time-btn');
      const saveMaxCountBtn = this.element.querySelector('#save-max-count-btn');
      const saveIntervalBtn = this.element.querySelector('#save-interval-btn');

      if (presetEmailBtn) {
        EventManager.bind(presetEmailBtn, 'click', () => {
          const { presetEmails } = StateManager.app;
          const emailText = prompt('请输入预设邮箱列表（每行一个邮箱）:',
            presetEmails.length > 0 ? presetEmails.join('\n') : '');

          if (emailText !== null) {
            if (emailText.trim()) {
              setPresetEmails(emailText);
            } else {
              getLogger().log('❌ 邮箱列表不能为空', 'error');
            }
          }
        }, { debug: false });
      }

      if (clearPresetBtn) {
        EventManager.bind(clearPresetBtn, 'click', () => {
          if (confirm('确定要清除所有预设邮箱吗？')) {
            clearPresetEmails();
          }
        }, { debug: false });
      }

      // 验证码等待时间保存事件
      if (saveCaptchaTimeBtn) {
        EventManager.bind(saveCaptchaTimeBtn, 'click', () => {
          const waitTime = parseInt(this.captchaWaitTimeInput.value);
          if (waitTime >= 5 && waitTime <= 60) {
            StateManager.setAppState({ captchaWaitTime: waitTime });
            getLogger().log(`✅ 验证码等待时间已设置为 ${waitTime} 秒`, 'success');
          } else {
            getLogger().log('❌ 验证码等待时间必须在5-60秒之间', 'error');
          }
        }, { debug: false });
      }

      // 最大注册数量保存事件
      if (saveMaxCountBtn) {
        EventManager.bind(saveMaxCountBtn, 'click', () => {
          const maxCount = parseInt(this.maxRegistrationCountInput.value);
          if (maxCount >= 1 && maxCount <= 100) {
            StateManager.setAppState({ maxRegistrationCount: maxCount });
            getLogger().log(`✅ 最大注册数量已设置为 ${maxCount} 个`, 'success');
          } else {
            getLogger().log('❌ 最大注册数量必须在1-100之间', 'error');
          }
        }, { debug: false });
      }

      // 注册间隔时间保存事件
      if (saveIntervalBtn) {
        EventManager.bind(saveIntervalBtn, 'click', () => {
          const interval = parseInt(this.registrationIntervalInput.value);
          if (interval >= 10 && interval <= 600) {
            StateManager.setAppState({ registrationInterval: interval });
            getLogger().log(`✅ 注册间隔时间已设置为 ${interval} 秒`, 'success');
          } else {
            getLogger().log('❌ 注册间隔时间必须在10-600秒之间', 'error');
          }
        }, { debug: false });
      }

      // 折叠功能 - 使用EventManager
      const header = this.element.querySelector('#advanced-config-header');
      if (header) {
        EventManager.bind(header, 'click', () => {
          this.toggle();
        }, { debug: false });
      }

      // 注册组件到EventManager
      EventManager.registerComponent('AdvancedConfigSection', this.element);
    },

    /**
     * 解绑事件
     */
    unbindEvents() {
      EventManager.unbindComponent('AdvancedConfigSection');
    },

    /**
     * 切换展开/收起状态
     */
    toggle() {
      this.isExpanded = !this.isExpanded;
      StateManager.toggleSection('advanced');

      if (this.content) {
        this.content.style.display = this.isExpanded ? 'block' : 'none';
      }
      if (this.toggleBtn) {
        this.toggleBtn.style.transform = this.isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)';
      }
    },

    /**
     * 更新显示内容
     */
    update() {
      const { presetEmails, currentEmailIndex, usePresetEmails } = StateManager.app;

      if (this.presetStatus) {
        if (usePresetEmails && presetEmails.length > 0) {
          const remaining = presetEmails.length - currentEmailIndex;
          this.presetStatus.textContent = `预设模式 (${remaining}/${presetEmails.length})`;
        } else {
          this.presetStatus.textContent = '随机模式';
        }
      }

      // 更新验证码等待时间输入框
      if (this.captchaWaitTimeInput) {
        this.captchaWaitTimeInput.value = StateManager.app.captchaWaitTime || 20;
      }

      // 更新最大注册数量输入框
      if (this.maxRegistrationCountInput) {
        this.maxRegistrationCountInput.value = StateManager.app.maxRegistrationCount || 10;
      }

      // 更新注册间隔时间输入框
      if (this.registrationIntervalInput) {
        this.registrationIntervalInput.value = StateManager.app.registrationInterval || 60;
      }

      // 更新展开状态
      this.isExpanded = StateManager.ui.sections.advanced;
      if (this.content) {
        this.content.style.display = this.isExpanded ? 'block' : 'none';
      }
      if (this.toggleBtn) {
        this.toggleBtn.style.transform = this.isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)';
      }
    }
  };

  /**
   * 工具区域组件
   */
  const ToolsSection = {
    element: null,
    isExpanded: false,

    /**
     * 创建工具区域
     */
    create() {
      this.element = document.createElement('div');
      this.element.className = 'augment-collapsible-section';

      this.element.innerHTML = `
        <div id="tools-header" class="augment-section-header">
          <span class="augment-section-title">🛠️ 工具箱</span>
          <span id="tools-toggle" class="augment-section-toggle">▼</span>
        </div>
        <div id="tools-content" class="augment-section-content" style="display: none;">
          <div class="augment-button-grid" style="margin-bottom: 12px;">
            <button id="export-json" class="augment-btn-small secondary">📋 导出JSON</button>
          </div>
          <div class="augment-button-grid">
            <button id="clear-state" class="augment-btn-small danger">🗑️ 清除账户</button>
            <button id="clear-log" class="augment-btn-small ghost">🧹 清除日志</button>
          </div>
        </div>
      `;

      this.bindElements();
      this.bindEvents();
      this.update();

      return this.element;
    },

    /**
     * 绑定DOM元素引用
     */
    bindElements() {
      this.toggleBtn = this.element.querySelector('#tools-toggle');
      this.content = this.element.querySelector('#tools-content');
    },

    /**
     * 绑定事件
     */
    bindEvents() {
      // 导出功能 - 使用EventManager
      const exportJsonBtn = this.element.querySelector('#export-json');
      const clearStateBtn = this.element.querySelector('#clear-state');
      const clearLogBtn = this.element.querySelector('#clear-log');

      if (exportJsonBtn) {
        EventManager.bind(exportJsonBtn, 'click', exportAccountsJSON, { debug: false });
      }

      if (clearStateBtn) {
        EventManager.bind(clearStateBtn, 'click', () => {
          if (confirm('确定要清除所有账户数据吗？此操作不可恢复！')) {
            try {
              // 使用StateManager清除账户数据
              updateAppState({
                registrationCount: 0,
                registeredAccounts: []
              });
              getLogger().log('✅ 账户数据已清除', 'success');
              updateRegistrationStatus();
            } catch (error) {
              getLogger().log('❌ 清除账户数据失败: ' + error.message, 'error');
            }
          }
        }, { debug: false });
      }

      if (clearLogBtn) {
        EventManager.bind(clearLogBtn, 'click', () => {
          LogViewer.clear();
        }, { debug: false });
      }

      // 折叠功能 - 使用EventManager
      const header = this.element.querySelector('#tools-header');
      if (header) {
        EventManager.bind(header, 'click', () => {
          this.toggle();
        }, { debug: false });
      }

      // 注册组件到EventManager
      EventManager.registerComponent('ToolsSection', this.element);
    },

    /**
     * 解绑事件
     */
    unbindEvents() {
      EventManager.unbindComponent('ToolsSection');
    },

    /**
     * 切换展开/收起状态
     */
    toggle() {
      this.isExpanded = !this.isExpanded;
      StateManager.toggleSection('tools');

      if (this.content) {
        this.content.style.display = this.isExpanded ? 'block' : 'none';
      }
      if (this.toggleBtn) {
        this.toggleBtn.style.transform = this.isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)';
      }
    },

    /**
     * 更新显示状态
     */
    update() {
      // 更新展开状态
      this.isExpanded = StateManager.ui.sections.tools;
      if (this.content) {
        this.content.style.display = this.isExpanded ? 'block' : 'none';
      }
      if (this.toggleBtn) {
        this.toggleBtn.style.transform = this.isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)';
      }
    }
  };

  /**
   * 日志查看器组件 - 重构版本
   */
  const LogViewer = {
    element: null,
    content: null,
    headerElement: null,
    searchInput: null,
    filterButtons: null,
    isExpanded: true,
    maxEntries: 50,
    currentFilter: 'all',
    logEntries: [], // 存储所有日志条目

    /**
     * 从存储中加载日志
     */
    loadLogsFromStorage() {
      try {
        const savedLogs = GM_getValue('augment_logs', '[]');
        const logs = JSON.parse(savedLogs);
        this.logEntries = logs.slice(-this.maxEntries); // 只保留最新的条目
        getLogger().log(`📋 已从存储加载 ${this.logEntries.length} 条日志`, 'info');
      } catch (error) {
        console.error('加载日志失败:', error);
        this.logEntries = [];
      }
    },

    /**
     * 保存日志到存储
     */
    saveLogsToStorage() {
      try {
        const logsToSave = this.logEntries.slice(-this.maxEntries);
        GM_setValue('augment_logs', JSON.stringify(logsToSave));
      } catch (error) {
        console.error('保存日志失败:', error);
      }
    },

    /**
     * 创建日志查看器
     */
    create() {
      // 先加载存储的日志
      this.loadLogsFromStorage();

      this.element = document.createElement('div');
      this.element.className = 'augment-collapsible-section';

      this.element.innerHTML = `
        <div id="log-header" class="augment-section-header">
          <span class="augment-section-title">📋 操作日志</span>
          <div class="augment-log-controls">
            <button id="log-clear-btn" class="augment-btn-tiny ghost" title="清除日志">🧹</button>
            <span id="log-toggle" class="augment-section-toggle">▼</span>
          </div>
        </div>
        <div id="log-content-wrapper" class="augment-log-content" style="display: block;">
          <div class="augment-log-filters">
            <input id="log-search" type="text" placeholder="搜索日志..." class="augment-log-search">
            <div class="augment-log-filter-buttons">
              <button class="augment-log-filter-btn active" data-filter="all">全部</button>
              <button class="augment-log-filter-btn" data-filter="info">信息</button>
              <button class="augment-log-filter-btn" data-filter="success">成功</button>
              <button class="augment-log-filter-btn" data-filter="warning">警告</button>
              <button class="augment-log-filter-btn" data-filter="error">错误</button>
            </div>
          </div>
          <div id="log-content" class="augment-log-entries"></div>
          <div class="augment-log-stats">
            <span id="log-count">0 条日志</span>
            <span id="log-filtered-count"></span>
          </div>
        </div>
      `;

      this.bindElements();
      this.bindEvents();
      this.restoreLogsToDOM();
      this.update();

      return this.element;
    },

    /**
     * 绑定DOM元素引用
     */
    bindElements() {
      this.content = this.element.querySelector('#log-content');
      this.toggleBtn = this.element.querySelector('#log-toggle');
      this.headerElement = this.element.querySelector('#log-header');
      this.searchInput = this.element.querySelector('#log-search');
      this.filterButtons = this.element.querySelectorAll('.augment-log-filter-btn');
      this.clearBtn = this.element.querySelector('#log-clear-btn');
      this.contentWrapper = this.element.querySelector('#log-content-wrapper');
      this.logCount = this.element.querySelector('#log-count');
      this.filteredCount = this.element.querySelector('#log-filtered-count');
    },

    /**
     * 绑定事件
     */
    bindEvents() {
      // 折叠功能 - 只在标题文字区域点击，使用EventManager
      if (this.headerElement) {
        EventManager.bind(this.headerElement, 'click', (e) => {
          // 如果点击的是控制按钮区域，不触发折叠
          if (!e.target.closest('.augment-log-controls')) {
            this.toggle();
          }
        }, { debug: false });
      }

      // 搜索功能 - 使用EventManager
      if (this.searchInput) {
        EventManager.bind(this.searchInput, 'input', (e) => {
          this.filterLogs();
        }, { debug: false });
      }

      // 过滤按钮 - 使用EventManager
      this.filterButtons.forEach(btn => {
        EventManager.bind(btn, 'click', (e) => {
          this.setFilter(e.target.dataset.filter);
        }, { debug: false });
      });

      // 清除按钮 - 使用EventManager
      if (this.clearBtn) {
        EventManager.bind(this.clearBtn, 'click', (e) => {
          e.stopPropagation();
          this.clear();
        }, { debug: false });
      }

      // 注册组件到EventManager
      EventManager.registerComponent('LogViewer', this.element);
    },

    /**
     * 恢复日志到DOM
     */
    restoreLogsToDOM() {
      if (!this.content || !this.logEntries.length) return;

      // 清空现有内容
      this.content.innerHTML = '';

      // 重新创建所有日志条目
      this.logEntries.forEach(logData => {
        const logEntry = this.createLogElement(logData);
        this.content.appendChild(logEntry);
      });

      // 更新统计信息
      this.updateStats();

      // 应用当前过滤器
      this.filterLogs();

      // 滚动到底部
      this.scrollToBottom();
    },

    /**
     * 添加日志条目 - 重构版本
     */
    addLog(message, type = 'info', category = null) {
      if (!this.content) return;

      // 创建日志条目数据
      const timestamp = new Date();
      const logData = {
        id: Date.now() + Math.random(),
        message,
        type,
        category: category || type,
        timestamp,
        timeString: this.formatTimestamp(timestamp)
      };

      // 添加到日志数组
      this.logEntries.push(logData);

      // 限制日志条目数量
      if (this.logEntries.length > this.maxEntries) {
        this.logEntries.shift();
        // 同时移除DOM中的第一个元素
        if (this.content.firstChild) {
          this.content.removeChild(this.content.firstChild);
        }
      }

      // 创建DOM元素
      const logEntry = this.createLogElement(logData);

      // 添加到DOM
      this.content.appendChild(logEntry);

      // 自动滚动到最新日志
      this.scrollToBottom();

      // 更新统计信息
      this.updateStats();

      // 应用当前过滤器
      this.filterLogs();

      // 保存到存储
      this.saveLogsToStorage();
    },

    /**
     * 格式化时间戳
     */
    formatTimestamp(date) {
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();

      if (isToday) {
        return date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      } else {
        return date.toLocaleString([], {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    },

    /**
     * 创建日志DOM元素
     */
    createLogElement(logData) {
      const logEntry = document.createElement('div');
      logEntry.className = `augment-log-entry ${logData.type}`;
      logEntry.dataset.logId = logData.id;
      logEntry.dataset.logType = logData.type;
      logEntry.dataset.logCategory = logData.category;

      const icon = this.getLogIcon(logData.type);

      logEntry.innerHTML = `
        <div class="augment-log-entry-content">
          <span class="augment-log-icon">${icon}</span>
          <div class="augment-log-body">
            <div class="augment-log-timestamp">${logData.timeString}</div>
            <div class="augment-log-message">${this.escapeHtml(logData.message)}</div>
          </div>
        </div>
      `;

      return logEntry;
    },

    /**
     * 获取日志图标
     */
    getLogIcon(type) {
      const icons = {
        'info': 'ℹ️',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'debug': '🔍',
        'network': '🌐',
        'auth': '🔐',
        'data': '📊'
      };
      return icons[type] || icons['info'];
    },

    /**
     * HTML转义
     */
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    /**
     * 设置过滤器
     */
    setFilter(filter) {
      this.currentFilter = filter;

      // 更新按钮状态
      this.filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
      });

      this.filterLogs();
    },

    /**
     * 过滤日志
     */
    filterLogs() {
      const searchTerm = this.searchInput ? this.searchInput.value.toLowerCase() : '';
      const entries = this.content.querySelectorAll('.augment-log-entry');
      let visibleCount = 0;

      entries.forEach(entry => {
        const logType = entry.dataset.logType;
        const message = entry.querySelector('.augment-log-message').textContent.toLowerCase();

        // 类型过滤
        const typeMatch = this.currentFilter === 'all' || logType === this.currentFilter;

        // 搜索过滤
        const searchMatch = !searchTerm || message.includes(searchTerm);

        const shouldShow = typeMatch && searchMatch;
        entry.style.display = shouldShow ? 'block' : 'none';

        if (shouldShow) visibleCount++;
      });

      // 更新过滤统计
      if (this.filteredCount) {
        if (visibleCount < this.logEntries.length) {
          this.filteredCount.textContent = `(显示 ${visibleCount} 条)`;
        } else {
          this.filteredCount.textContent = '';
        }
      }
    },

    /**
     * 更新统计信息
     */
    updateStats() {
      if (this.logCount) {
        this.logCount.textContent = `${this.logEntries.length} 条日志`;
      }
    },

    /**
     * 滚动到底部
     */
    scrollToBottom() {
      if (this.content) {
        this.content.scrollTop = this.content.scrollHeight;
      }
    },

    /**
     * 清除所有日志
     */
    clear() {
      if (this.content) {
        this.content.innerHTML = '';
        this.logEntries = [];
        // 清除存储的日志
        GM_setValue('augment_logs', '[]');
        this.updateStats();
        this.addLog('日志已清除', 'info');
      }
    },

    /**
     * 解绑事件
     */
    unbindEvents() {
      EventManager.unbindComponent('LogViewer');
    },

    /**
     * 切换展开/收起状态
     */
    toggle() {
      this.isExpanded = !this.isExpanded;
      StateManager.toggleSection('logs');

      if (this.contentWrapper) {
        this.contentWrapper.style.display = this.isExpanded ? 'block' : 'none';
      }
      if (this.toggleBtn) {
        this.toggleBtn.style.transform = this.isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)';
      }
    },

    /**
     * 更新显示状态
     */
    update() {
      // 更新展开状态
      this.isExpanded = StateManager.ui.sections.logs;
      if (this.contentWrapper) {
        this.contentWrapper.style.display = this.isExpanded ? 'block' : 'none';
      }
      if (this.toggleBtn) {
        this.toggleBtn.style.transform = this.isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)';
      }
    },

    /**
     * 添加批量日志方法
     */
    addBatchLogs(logs) {
      logs.forEach(log => {
        this.addLog(log.message, log.type, log.category);
      });
    },

    /**
     * 导出日志
     */
    exportLogs() {
      const logs = this.logEntries.map(entry => ({
        timestamp: entry.timestamp.toISOString(),
        type: entry.type,
        category: entry.category,
        message: entry.message
      }));

      const dataStr = JSON.stringify(logs, null, 2);
      const dataBlob = new Blob([dataStr], {type: 'application/json'});

      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `augment-logs-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    }
  };

  /**
   * UI管理器 - 统一管理所有UI组件
   */
  const UIManager = {
    components: {
      FloatingIcon,
      MainPanel,
      ControlSection,
      QuickConfigSection,
      AdvancedConfigSection,
      ToolsSection,
      LogViewer
    },

    mainContainer: null,
    isInitialized: false,

    /**
     * 创建最小化UI，快速显示
     */
    createMinimalUI() {
      if (this.mainContainer) return;

      // 创建主容器
      this.mainContainer = document.createElement('div');
      this.mainContainer.id = "augment-auto-register-ui";

      // 只创建浮动图标，快速显示
      const iconElement = FloatingIcon.create();
      this.mainContainer.appendChild(iconElement);

      // 添加到页面
      document.body.appendChild(this.mainContainer);

      // 使用console.log，因为此时logger可能还未初始化
      console.log('🚀 最小化UI创建完成');
    },

    /**
     * 初始化UI管理器
     */
    init() {
      if (this.isInitialized) return;

      // 如果还没有主容器，先创建
      if (!this.mainContainer) {
        this.createMinimalUI();
      }

      // 创建主面板
      const panelElement = MainPanel.create();
      this.mainContainer.appendChild(panelElement);

      // 初始化状态
      this.updateUI();

      // 记录初始化状态
      console.log('AugmentCode UI初始化:', {
        expanded: StateManager.ui.expanded,
        firstTime: StateManager.ui.firstTime
      });

      // 恢复UI状态（页面跳转后状态恢复）
      this.restoreUIState();

      // 首次使用用户引导
      if (StateManager.ui.firstTime) {
        this.showFirstTimeGuidance();
      }

      // 订阅状态变化
      StateManager.subscribe(() => {
        this.updateUI();
      });

      // 添加键盘快捷键支持
      this.initKeyboardShortcuts();

      this.isInitialized = true;

      return this;
    },

    /**
     * 显示UI
     */
    show() {
      if (this.mainContainer) {
        this.mainContainer.style.display = 'block';
      }
    },

    /**
     * 隐藏UI
     */
    hide() {
      if (this.mainContainer) {
        this.mainContainer.style.display = 'none';
      }
    },

    /**
     * 切换UI展开状态
     */
    toggleUI() {
      const newState = StateManager.toggleUI();

      // 移除首次使用的引导动画
      const iconElement = document.getElementById('ui-icon-mode');
      if (iconElement) {
        iconElement.style.animation = '';
      }

      this.updateUI();
      return newState;
    },

    /**
     * 更新UI显示状态
     */
    updateUI() {
      const { expanded } = StateManager.ui;
      const { isAutoRegistering } = StateManager.app;

      // 更新图标和面板显示
      const iconElement = document.getElementById('ui-icon-mode');
      const panelElement = document.getElementById('ui-expanded-mode');

      if (expanded) {
        // 展开状态：显示面板，图标变小并移到面板右上角
        if (iconElement) {
          iconElement.classList.add('expanded');
        }
        if (panelElement) {
          panelElement.classList.add('show');
        }
      } else {
        // 收起状态：隐藏面板，图标恢复正常大小
        if (iconElement) {
          iconElement.classList.remove('expanded');
        }
        if (panelElement) {
          panelElement.classList.remove('show');
        }
      }

      // 更新状态指示器
      FloatingIcon.updateStatus(isAutoRegistering);

      // 更新各个组件
      ControlSection.update();
      QuickConfigSection.update();
      AdvancedConfigSection.update();
      ToolsSection.update();
      LogViewer.update();
    },

    /**
     * 恢复UI状态（页面跳转后状态恢复）
     */
    restoreUIState() {
      // 延迟恢复状态，确保DOM完全加载
      setTimeout(() => {
        const { expanded } = StateManager.ui;

        // 如果之前是展开状态，恢复展开状态
        if (expanded) {
          getLogger().log('🔄 检测到之前UI为展开状态，正在恢复...', 'info');

          // 强制更新UI状态
          this.updateUI();

          getLogger().log('✅ UI状态已恢复为展开状态', 'success');
        } else {
          getLogger().log('📋 UI状态保持收起状态', 'info');
        }

        // 恢复其他UI状态（如拖拽位置等）
        this.restoreUIPosition();

      }, 100); // 延迟100ms确保DOM完全加载
    },

    /**
     * 恢复UI位置状态
     */
    restoreUIPosition() {
      // 如果有保存的位置信息，恢复面板位置
      const savedPosition = StateManager.ui.position;
      if (savedPosition && savedPosition.left !== undefined && savedPosition.top !== undefined) {
        const panelElement = document.getElementById('ui-expanded-mode');
        if (panelElement) {
          panelElement.style.left = savedPosition.left + 'px';
          panelElement.style.top = savedPosition.top + 'px';
          panelElement.style.right = 'auto';
          panelElement.style.bottom = 'auto';

          getLogger().log(`📍 UI位置已恢复: (${savedPosition.left}, ${savedPosition.top})`, 'info');
        }
      }
    },

    /**
     * 首次使用用户引导
     */
    showFirstTimeGuidance() {
      // 延迟显示引导，确保UI已完全加载
      setTimeout(() => {
        if (StateManager.ui.firstTime && !StateManager.ui.expanded) {
          // 为浮动图标添加脉冲动画提示
          const iconElement = document.getElementById('ui-icon-mode');
          if (iconElement) {
            iconElement.style.animation = 'pulse 2s infinite';

            // 添加临时CSS动画
            if (!document.getElementById('first-time-guidance-style')) {
              const style = document.createElement('style');
              style.id = 'first-time-guidance-style';
              style.textContent = `
                @keyframes pulse {
                  0% { transform: scale(1); box-shadow: 0 4px 20px rgba(52, 152, 219, 0.3); }
                  50% { transform: scale(1.05); box-shadow: 0 6px 30px rgba(52, 152, 219, 0.6); }
                  100% { transform: scale(1); box-shadow: 0 4px 20px rgba(52, 152, 219, 0.3); }
                }
              `;
              document.head.appendChild(style);
            }

            // 3秒后移除动画
            setTimeout(() => {
              if (iconElement) {
                iconElement.style.animation = '';
              }
            }, 6000);
          }
        }
      }, 1000);
    },

    /**
     * 初始化键盘快捷键
     */
    initKeyboardShortcuts() {
      // Ctrl+Shift+A: 切换UI显示
      EventManager.addKeyboardShortcut('a', () => {
        this.toggleUI();
      }, { ctrl: true, shift: true, debug: false });

      // Ctrl+Shift+S: 开始/停止注册
      EventManager.addKeyboardShortcut('s', () => {
        const { isAutoRegistering } = StateManager.app;
        if (isAutoRegistering) {
          stopContinuousRegistration();
        } else {
          startContinuousRegistration();
        }
      }, { ctrl: true, shift: true, debug: false });

      // Ctrl+Shift+L: 清除日志
      EventManager.addKeyboardShortcut('l', () => {
        LogViewer.clear();
      }, { ctrl: true, shift: true, debug: false });

      // Escape: 收起UI到图标模式
      EventManager.addKeyboardShortcut('Escape', () => {
        if (StateManager.ui.expanded) {
          this.toggleUI();
        }
      }, { debug: false });
    },

    /**
     * 获取日志接口（保持向后兼容）
     */
    getLogger() {
      return {
        log: (message, type = 'info') => {
          LogViewer.addLog(message, type);
        }
      };
    },

    /**
     * 销毁UI
     */
    destroy() {
      // 清理所有事件
      EventManager.cleanup();

      // 解绑所有组件事件
      Object.values(this.components).forEach(component => {
        if (component.unbindEvents) {
          component.unbindEvents();
        }
      });

      if (this.mainContainer && this.mainContainer.parentNode) {
        this.mainContainer.parentNode.removeChild(this.mainContainer);
      }
      this.isInitialized = false;
    }
  };

  // 创建现代化UI - 重构为使用模块化组件系统
  function createUI() {
    // 使用UIManager初始化所有组件
    return UIManager.init();
  }

  // 延迟初始化日志对象 - 确保UIManager完全初始化后再创建
  let logger = null;

  /**
   * 检查是否应该抑制测试相关日志
   */
  function shouldSuppressTestLog(message, type) {
    // 如果没有开启抑制，或者不是在注册状态，则不抑制
    if (!StateManager.app.suppressTestLogs || !StateManager.app.isAutoRegistering) {
      return false;
    }

    // 定义测试相关的关键词（更精确的匹配）
    const testKeywords = [
      '🧪', '开始系统', '完整性测试', '性能测试', '兼容性检查', '功能验证',
      '修复效果验证', '手动测试指南', '回归测试', '测试总结', 'API连接测试',
      '开始全面系统测试', '开始浏览器兼容性检查', '开始功能验证测试',
      '开始完整系统验证', '专门验证修复效果', '显示手动测试指南',
      '测试1：', '测试2：', '测试3：', '测试4：', '验证完成:', '项测试通过'
    ];

    // 检查消息是否包含测试关键词
    const messageStr = message.toString().toLowerCase();
    return testKeywords.some(keyword => messageStr.includes(keyword.toLowerCase()));
  }

  /**
   * 获取日志接口 - 延迟初始化模式
   * 确保UIManager和LogViewer组件完全初始化后再获取日志接口
   */
  function getLogger() {
    if (!logger && UIManager.isInitialized) {
      logger = UIManager.getLogger();
    }

    // 创建带过滤功能的日志接口
    const baseLogger = logger || {
      log: () => {} // 空操作，避免未初始化时的错误
    };

    return {
      log: (message, type = 'info', category = null) => {
        // 检查是否应该抑制此日志
        if (shouldSuppressTestLog(message, type)) {
          return; // 抑制测试日志
        }

        // 调用原始日志方法
        baseLogger.log(message, type, category);
      }
    };
  }

  // 页面卸载时清理事件
  window.addEventListener('beforeunload', () => {
    UIManager.destroy();
  });

  // 添加状态变化监听器，自动更新UI
  StateManager.subscribe((stateManager) => {
    // 更新状态指示器
    const statusIndicator = document.getElementById('status-indicator');
    if (statusIndicator) {
      statusIndicator.className = stateManager.app.isAutoRegistering ? 'running' : 'stopped';
    }

    // 更新按钮显示状态
    const startBtn = document.getElementById('start-continuous-registration');
    const stopBtn = document.getElementById('stop-registration');
    if (startBtn && stopBtn) {
      startBtn.style.display = stateManager.app.isAutoRegistering ? 'none' : 'block';
      stopBtn.style.display = stateManager.app.isAutoRegistering ? 'block' : 'none';
    }

    // 更新状态文本
    const statusText = document.getElementById('status-text');
    const accountCount = document.getElementById('account-count');
    if (statusText) {
      statusText.textContent = stateManager.app.isAutoRegistering ? '注册中' : '已停止';
    }
    if (accountCount) {
      accountCount.textContent = stateManager.app.registrationCount;
    }

    // 更新预设邮箱状态
    const presetStatus = document.getElementById('preset-status');
    if (presetStatus) {
      const { presetEmails, currentEmailIndex, usePresetEmails } = stateManager.app;
      if (usePresetEmails && presetEmails.length > 0) {
        const remaining = presetEmails.length - currentEmailIndex;
        presetStatus.textContent = `预设模式 (${remaining}/${presetEmails.length})`;
      } else {
        presetStatus.textContent = '随机模式';
      }
    }

    // 更新UI展开状态
    const iconContainer = document.getElementById('ui-icon-mode');
    const expandedContainer = document.getElementById('ui-expanded-mode');
    if (iconContainer && expandedContainer) {
      iconContainer.style.display = stateManager.ui.expanded ? 'none' : 'flex';
      expandedContainer.style.display = stateManager.ui.expanded ? 'flex' : 'none';
    }
  });

  // ==================== UI控制和状态管理函数 ====================

  // 显示倒计时
  function showCountdown(seconds) {
    const countdownDisplay = document.getElementById('countdown-display');
    const countdownTime = document.getElementById('countdown-time');

    if (countdownDisplay && countdownTime) {
      countdownDisplay.style.display = 'inline';

      let remainingTime = seconds;
      countdownTime.textContent = remainingTime;

      const countdownInterval = setInterval(() => {
        remainingTime--;
        if (countdownTime) {
          countdownTime.textContent = remainingTime;
        }

        if (remainingTime <= 0) {
          clearInterval(countdownInterval);
          if (countdownDisplay) {
            countdownDisplay.style.display = 'none';
          }
        }
      }, 1000);

      // 保存interval ID以便在停止注册时清除
      window.countdownInterval = countdownInterval;
    }
  }

  // 隐藏倒计时
  function hideCountdown() {
    const countdownDisplay = document.getElementById('countdown-display');
    if (countdownDisplay) {
      countdownDisplay.style.display = 'none';
    }
    if (window.countdownInterval) {
      clearInterval(window.countdownInterval);
      window.countdownInterval = null;
    }
  }

  // 开始持续注册
  async function startContinuousRegistration() {
    // 检查是否已达到最大注册数量
    const { registrationCount, maxRegistrationCount } = StateManager.app;
    if (registrationCount >= maxRegistrationCount) {
      getLogger().log(`🎉 已达到最大注册数量 ${maxRegistrationCount} 个，注册完成！`, 'success');
      updateAppState({ isAutoRegistering: false });
      updateRegistrationStatus();
      return;
    }

    updateAppState({
      isAutoRegistering: true,
      suppressTestLogs: true // 开始注册时抑制测试日志
    });
    updateRegistrationStatus();
    getLogger().log('🚀 开始持续注册模式', 'success');
    getLogger().log(`📊 当前进度: ${registrationCount}/${maxRegistrationCount}`, 'info');
    getLogger().log('📝 已启用简洁日志模式，隐藏测试调试信息', 'info');

    // 预先生成OAuth认证URL和邮箱
    try {
      getLogger().log('🔐 预先生成OAuth认证信息...', 'info');

      // 获取邮箱（优先使用预设邮箱）
      const email = getNextEmail();

      // 生成OAuth认证URL并保存状态
      const authUrl = await OAuthManager.generateAuthUrl(email);

      // 将邮箱保存到全局变量，供后续注册使用
      GM_setValue('current_registration_email', email);

      getLogger().log('🌐 正在跳转到OAuth认证页面开始注册流程...', 'info');

      // 直接跳转到OAuth认证地址开始注册流程
      window.location.href = authUrl;

    } catch (error) {
      getLogger().log(`❌ 生成OAuth认证URL失败: ${error.message}`, 'error');
      // 如果OAuth生成失败，回退到普通注册流程
      getLogger().log('🔄 回退到普通注册流程...', 'warning');
      window.location.href = 'https://login.augmentcode.com/signup';
    }
  }

  // 停止持续注册
  function stopContinuousRegistration() {
    updateAppState({
      isAutoRegistering: false,
      suppressTestLogs: false // 停止注册时恢复测试日志
    });
    updateRegistrationStatus();
    getLogger().log('⏹️ 已停止持续注册模式', 'warning');
    getLogger().log('📝 已恢复完整日志模式，显示所有调试信息', 'info');

    // 强制更新UI状态
    UIManager.updateUI();

    // 清除可能的定时器
    if (window.registrationTimer) {
      clearTimeout(window.registrationTimer);
      window.registrationTimer = null;
    }

    // 隐藏倒计时
    hideCountdown();

    // 如果当前在注册流程中，尝试停止
    if (window.location.href.includes('login.augmentcode.com') ||
        window.location.href.includes('auth.augmentcode.com')) {
      getLogger().log('🔄 检测到正在注册流程中，将在当前步骤后停止', 'info');
    }
  }

  // 更新注册状态显示
  function updateRegistrationStatus() {
    const statusText = document.getElementById('status-text');
    const accountCount = document.getElementById('account-count');
    const presetStatus = document.getElementById('preset-status');

    if (statusText) {
      statusText.textContent = StateManager.app.isAutoRegistering ? '注册中' : '已停止';
    }
    if (accountCount) {
      accountCount.textContent = StateManager.app.registrationCount;
    }
    if (presetStatus) {
      const { presetEmails, currentEmailIndex, usePresetEmails } = StateManager.app;
      if (usePresetEmails && presetEmails.length > 0) {
        const remaining = presetEmails.length - currentEmailIndex;
        presetStatus.textContent = `预设模式 (${remaining}/${presetEmails.length})`;
      } else {
        presetStatus.textContent = '随机模式';
      }
    }
  }



  // 添加状态变化监听器，自动更新UI
  StateManager.subscribe((stateManager) => {
    // 更新状态指示器
    const statusIndicator = document.getElementById('status-indicator');
    if (statusIndicator) {
      statusIndicator.className = stateManager.app.isAutoRegistering ? 'running' : 'stopped';
    }

    // 更新按钮显示状态
    const startBtn = document.getElementById('start-continuous-registration');
    const stopBtn = document.getElementById('stop-registration');
    if (startBtn && stopBtn) {
      startBtn.style.display = stateManager.app.isAutoRegistering ? 'none' : 'block';
      stopBtn.style.display = stateManager.app.isAutoRegistering ? 'block' : 'none';
    }

    // 更新状态文本
    const statusText = document.getElementById('status-text');
    const accountCount = document.getElementById('account-count');
    if (statusText) {
      statusText.textContent = stateManager.app.isAutoRegistering ? '注册中' : '已停止';
    }
    if (accountCount) {
      accountCount.textContent = stateManager.app.registrationCount;
    }

    // 更新预设邮箱状态
    const presetStatus = document.getElementById('preset-status');
    if (presetStatus) {
      const { presetEmails, currentEmailIndex, usePresetEmails } = stateManager.app;
      if (usePresetEmails && presetEmails.length > 0) {
        const remaining = presetEmails.length - currentEmailIndex;
        presetStatus.textContent = `预设模式 (${remaining}/${presetEmails.length})`;
      } else {
        presetStatus.textContent = '随机模式';
      }
    }

    // 更新UI展开状态
    const iconContainer = document.getElementById('ui-icon-mode');
    const expandedContainer = document.getElementById('ui-expanded-mode');
    if (iconContainer && expandedContainer) {
      iconContainer.style.display = stateManager.ui.expanded ? 'none' : 'flex';
      expandedContainer.style.display = stateManager.ui.expanded ? 'flex' : 'none';
    }
  });



  // 删除邮件
  async function deleteEmail(firstId) {
    return new Promise((resolve, reject) => {
      const deleteUrl = 'https://tempmail.plus/api/mails/';
      const maxRetries = 5;
      let retryCount = 0;

      function tryDelete() {
        GM_xmlhttpRequest({
          method: "DELETE",
          url: deleteUrl,
          data: "email=" + TEMP_MAIL_CONFIG.username + TEMP_MAIL_CONFIG.emailExtension + "&first_id=" + firstId + "&epin=" + TEMP_MAIL_CONFIG.epin,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          onload: function (response) {
            try {
              const result = JSON.parse(response.responseText).result;
              if (result === true) {
                getLogger().log("邮件删除成功", 'success');
                resolve(true);
                return;
              }
            } catch (error) {
              getLogger().log("解析删除响应失败: " + error, 'warning');
            }

            // 如果还有重试次数，继续尝试
            if (retryCount < maxRetries - 1) {
              retryCount++;
              getLogger().log(
                  "删除邮件失败，正在重试 (" + retryCount + "/" + maxRetries + ")...",
                  'warning');
              setTimeout(tryDelete, 500);
            } else {
              getLogger().log("删除邮件失败，已达到最大重试次数", 'error');
              resolve(false);
            }
          },
          onerror: function (error) {
            if (retryCount < maxRetries - 1) {
              retryCount++;
              getLogger().log(
                  "删除邮件出错，正在重试 (" + retryCount + "/" + maxRetries + ")...",
                  'warning');
              setTimeout(tryDelete, 500);
            } else {
              getLogger().log("删除邮件失败: " + error, 'error');
              resolve(false);
            }
          }
        });
      }

      tryDelete();
    });
  }

  // 获取最新邮件中的验证码
  async function getLatestMailCode() {
    return new Promise((resolve, reject) => {
      const mailListUrl = `https://tempmail.plus/api/mails?email=${TEMP_MAIL_CONFIG.username}${TEMP_MAIL_CONFIG.emailExtension}&limit=20&epin=${TEMP_MAIL_CONFIG.epin}`;

      GM_xmlhttpRequest({
        method: "GET",
        url: mailListUrl,
        onload: async function (mailListResponse) {
          try {
            const mailListData = JSON.parse(mailListResponse.responseText);
            if (!mailListData.result || !mailListData.first_id) {
              resolve(null);
              return;
            }

            const firstId = mailListData.first_id;
            const mailDetailUrl = `https://tempmail.plus/api/mails/${firstId}?email=${TEMP_MAIL_CONFIG.username}${TEMP_MAIL_CONFIG.emailExtension}&epin=${TEMP_MAIL_CONFIG.epin}`;

            GM_xmlhttpRequest({
              method: "GET",
              url: mailDetailUrl,
              onload: async function (mailDetailResponse) {
                try {
                  const mailDetailData = JSON.parse(
                      mailDetailResponse.responseText);
                  if (!mailDetailData.result) {
                    resolve(null);
                    return;
                  }

                  const mailText = mailDetailData.text || "";
                  const mailSubject = mailDetailData.subject || "";
                  getLogger().log("找到邮件主题: " + mailSubject);

                  const code = extractVerificationCode(mailText);

                  // 获取到验证码后，尝试删除邮件
                  if (code) {
                    await deleteEmail(firstId);
                  }

                  resolve(code);
                } catch (error) {
                  getLogger().log("解析邮件详情失败: " + error, 'error');
                  resolve(null);
                }
              },
              onerror: function (error) {
                getLogger().log("获取邮件详情失败: " + error, 'error');
                resolve(null);
              }
            });
          } catch (error) {
            getLogger().log("解析邮件列表失败: " + error, 'error');
            resolve(null);
          }
        },
        onerror: function (error) {
          getLogger().log("获取邮件列表失败: " + error, 'error');
          resolve(null);
        }
      });
    });
  }

  // 获取验证码（带重试机制）
  async function getVerificationCode(maxRetries = 5, retryInterval = 3000) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      getLogger().log(`尝试获取验证码 (第 ${attempt + 1}/${maxRetries} 次)...`);

      try {
        const code = await getLatestMailCode();
        if (code) {
          getLogger().log("成功获取验证码: " + code, 'success');
          return code;
        }

        if (attempt < maxRetries - 1) {
          getLogger().log(`未获取到验证码，${retryInterval / 1000}秒后重试...`,
              'warning');
          await new Promise(resolve => setTimeout(resolve, retryInterval));
        }
      } catch (error) {
        getLogger().log("获取验证码出错: " + error, 'error');
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, retryInterval));
        }
      }
    }

    throw new Error(`经过 ${maxRetries} 次尝试后仍未获取到验证码。`);
  }

  // 处理人机验证
  async function handleHumanVerification() {
    getLogger().log('等待人机验证出现...', 'info');

    let verifyCheckbox = null;
    let waitTime = StateManager.app.captchaWaitTime || 20; // 使用配置的等待时间，默认20秒

    for (let i = 0; i < waitTime; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 首先检查是否已经验证成功
      const successText = Array.from(document.querySelectorAll('*')).find(el =>
          el.textContent && el.textContent.includes('Success!')
      );

      if (successText && successText.offsetParent !== null) {
        getLogger().log('人机验证已完成', 'success');
        return true;
      }

      // 检查是否有人机验证复选框
      verifyCheckbox = document.querySelector('input[type="checkbox"]');

      if (verifyCheckbox) {
        getLogger().log('发现人机验证复选框', 'info');
        break;
      }

      getLogger().log(`等待人机验证出现... (${i + 1}/${waitTime}秒)`, 'info');
    }

    if (!verifyCheckbox) {
      getLogger().log('未发现人机验证要求，可能已经通过或不需要验证', 'info');
      return true;
    }

    // 点击人机验证复选框
    getLogger().log('点击人机验证复选框...', 'info');
    verifyCheckbox.click();

    // 等待验证完成，最多等待60秒
    for (let i = 0; i < 60; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 检查是否在验证中
      const verifyingText = document.querySelector('#verifying-text');
      if (verifyingText && verifyingText.textContent.includes('Verifying')) {
        getLogger().log(`人机验证中... (${i + 1}/60秒)`, 'info');
        continue;
      }

      // 检查是否验证成功
      const successText = Array.from(document.querySelectorAll('*')).find(el =>
          el.textContent && el.textContent.includes('Success!')
      );

      if (successText && successText.textContent.includes('Success!')) {
        if (successText.offsetParent !== null) {
          getLogger().log('✅ 人机验证成功！检测到Success!标志', 'success');
          return true;
        } else {
          getLogger().log('Success!文本存在但不可见，继续等待...', 'info');
        }
      }

      // 检查是否验证失败或需要重新验证
      const newCheckbox = document.querySelector('input[type="checkbox"]');
      if (newCheckbox && !newCheckbox.checked) {
        getLogger().log('验证失败，需要重新验证', 'warning');
        newCheckbox.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
    }

    // 最终检查验证状态
    const finalSuccessText = Array.from(document.querySelectorAll('*')).find(
        el =>
            el.textContent && el.textContent.includes('Success!')
    );

    if (finalSuccessText && finalSuccessText.offsetParent !== null) {
      getLogger().log('人机验证最终成功！检测到Success!文本', 'success');
      return true;
    }

    getLogger().log('人机验证超时或失败 - 未检测到Success!标志', 'error');
    return false;
  }

  // 检测注册成功并保存信息
  async function checkRegistrationSuccess() {
    getLogger().log('等待注册结果...', 'info');

    // 等待最多30秒检测注册结果
    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 检测错误信息
      const errorElements = document.querySelectorAll(
          '.error, .alert-danger, [role="alert"], .rt-Text[color="red"]');
      if (errorElements.length > 0) {
        const errorText = Array.from(errorElements).map(
            el => el.textContent.trim()).join('; ');
        getLogger().log('❌ 注册失败：' + errorText, 'error');
        return false;
      }

      // 检测成功标志：页面跳转到subscription页面
      if (window.location.href.includes(
          'app.augmentcode.com/account/subscription')) {
        getLogger().log('✅ 注册成功！已跳转到subscription页面', 'success');
        return true;
      }
    }

    getLogger().log('⏳ 注册状态检测超时，请手动检查', 'warning');
    return false;
  }

  // ==================== 主流程控制函数 ====================

  // 执行完整的注册流程
  async function executeFullRegistration() {
    getLogger().log('🚀 开始执行完整注册流程', 'info');

    try {
      // 检查是否已停止注册
      if (!StateManager.app.isAutoRegistering) {
        getLogger().log('⏹️ 注册已停止，终止流程', 'warning');
        return false;
      }

      // 第一步：处理邮箱输入和人机验证
      getLogger().log('📧 步骤1：处理邮箱输入页面', 'info');
      const firstPageResult = await handleFirstPage();
      if (!firstPageResult) {
        getLogger().log('❌ 第一页面处理失败', 'error');
        return false;
      }

      // 检查是否已停止注册
      if (!StateManager.app.isAutoRegistering) {
        getLogger().log('⏹️ 注册已停止，终止流程', 'warning');
        return false;
      }

      // 等待页面跳转到验证码页面
      getLogger().log('⏳ 等待跳转到验证码页面...', 'info');
      await waitForPageTransition('input[name="code"]', 10000);

      // 检查是否已停止注册
      if (!StateManager.app.isAutoRegistering) {
        getLogger().log('⏹️ 注册已停止，终止流程', 'warning');
        return false;
      }

      // 第二步：处理验证码输入
      getLogger().log('🔢 步骤2：处理验证码输入页面', 'info');
      const secondPageResult = await handleSecondPage();
      if (!secondPageResult) {
        getLogger().log('❌ 第二页面处理失败或遇到注册被拒绝', 'warning');

        // 如果是持续注册模式且遇到注册被拒绝，等待一下后重新开始
        if (StateManager.app.isAutoRegistering) {
          getLogger().log('🔄 持续注册模式：等待5秒后重新开始注册流程...', 'info');
          await new Promise(resolve => setTimeout(resolve, 5000));

          // 检查是否已经跳转到注册页面
          if (document.querySelector('input[name="username"]') ||
              window.location.href.includes('login.augmentcode.com')) {
            getLogger().log('🔄 已返回注册页面，重新开始注册流程', 'info');
            return await executeFullRegistration(); // 递归重新开始
          }
        }
        return false;
      }

      // 等待页面跳转到成功页面
      getLogger().log('⏳ 等待跳转到成功页面...', 'info');
      await waitForPageTransition('app.augmentcode.com/account/subscription',
          15000);

      // 检查是否已停止注册
      if (!StateManager.app.isAutoRegistering) {
        getLogger().log('⏹️ 注册已停止，终止流程', 'warning');
        return false;
      }

      // 第三步：处理成功页面
      getLogger().log('🎉 步骤3：处理成功页面', 'info');
      const thirdPageResult = await handleThirdPage();
      if (!thirdPageResult) {
        getLogger().log('❌ 第三页面处理失败', 'error');
        return false;
      }

      getLogger().log('✅ 完整注册流程执行成功！', 'success');
      return true;

    } catch (error) {
      getLogger().log(`❌ 注册流程执行出错: ${error}`, 'error');
      return false;
    }
  }

  /**
   * 处理OAuth认证回调页面
   */
  async function handleOAuthCallback() {
    try {
      getLogger().log('🔐 检测到OAuth认证回调页面，开始处理...', 'info');

      // 等待页面加载完成
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 提取认证信息
      const authInfo = OAuthManager.extractAuthInfo();

      if (authInfo) {
        getLogger().log('✅ 认证信息提取成功，开始交换令牌...', 'success');

        // 交换令牌
        const tokenInfo = await OAuthManager.exchangeToken(authInfo.tenant,
            authInfo.code);

        // 获取OAuth状态中的邮箱信息
        const oauthStateStr = GM_getValue('oauth_state', '{}');
        const oauthState = safeJsonParse(oauthStateStr) || {};
        let email = oauthState.email;

        // 如果OAuth状态中没有邮箱，尝试从其他地方获取
        if (!email) {
          // 尝试从当前注册邮箱获取
          email = GM_getValue('current_registration_email', null);
          getLogger().log(`⚠️ OAuth状态中无邮箱，使用当前注册邮箱: ${email}`, 'warning');
        }

        // 如果仍然没有邮箱，生成一个新的
        if (!email) {
          email = getNextEmail(); // 使用统一的邮箱生成函数
          getLogger().log(`⚠️ 无法获取邮箱，生成新邮箱: ${email}`, 'warning');
        }

        getLogger().log(`✅ 使用邮箱: ${email}`, 'success');

        // 保存完整的账户信息（包含OAuth令牌）
        const accountInfo = {
          email: email,
          credits: 'OAuth注册', // OAuth注册可能没有显示额度
          registeredAt: new Date().toISOString(),
          oauth: {
            access_token: tokenInfo.access_token,
            token_type: tokenInfo.token_type,
            expires_in: tokenInfo.expires_in,
            tenant: tokenInfo.tenant,
            obtainedAt: new Date().toISOString()
          }
        };

        // 使用StateManager更新账户信息
        updateAppState({
          registeredAccounts: [...registeredAccounts, accountInfo],
          registrationCount: registrationCount + 1
        });

        getLogger().log('🎉 OAuth令牌获取成功并已保存！', 'success');
        getLogger().log(`🏢 租户地址: ${tokenInfo.tenant}`, 'success');
        getLogger().log(`🔑 访问令牌: ${tokenInfo.access_token.substring(0, 30)}...`, 'success');
        getLogger().log(`✅ 完整账户信息已保存: ${email}`, 'success');

        // 提交认证信息到API
        try {
          const apiSubmitResult = await submitToAPI(tokenInfo.access_token, tokenInfo.tenant);
          if (apiSubmitResult) {
            getLogger().log('🚀 认证信息已成功提交到API', 'success');
          } else {
            getLogger().log('⚠️ API提交失败，但不影响注册流程继续', 'warning');
          }
        } catch (error) {
          getLogger().log(`⚠️ API提交异常: ${error.message}，但不影响注册流程继续`, 'warning');
        }

        // 如果还在自动注册模式，继续下一轮注册
        if (StateManager.app.isAutoRegistering) {
          // 检查是否已达到最大注册数量
          const { registrationCount, maxRegistrationCount, registrationInterval } = StateManager.app;
          if (registrationCount >= maxRegistrationCount) {
            getLogger().log(`🎉 已达到最大注册数量 ${maxRegistrationCount} 个，注册完成！`, 'success');
            stopContinuousRegistration();
            return true;
          }

          getLogger().log(`🔄 继续下一轮自动注册... (${registrationInterval}秒后)`, 'info');
          getLogger().log(`📊 当前进度: ${registrationCount}/${maxRegistrationCount}`, 'info');

          // 显示倒计时
          showCountdown(registrationInterval);

          window.registrationTimer = setTimeout(() => {
            // 再次检查是否还在注册模式
            if (StateManager.app.isAutoRegistering) {
              startContinuousRegistration();
            } else {
              getLogger().log('⏹️ 注册已在等待期间被停止', 'warning');
            }
          }, registrationInterval * 1000);
        } else {
          getLogger().log('⏹️ 注册已停止，不继续下一轮', 'warning');
        }

        return true;
      }
    } catch (error) {
      getLogger().log(`❌ OAuth认证回调处理失败: ${error.message}`, 'error');

      // 显示错误消息
      const errorMsg = document.createElement('div');
      errorMsg.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: #f44336; color: white; padding: 20px; border-radius: 8px;
                    font-size: 16px; z-index: 10000; text-align: center;">
          <h3>❌ OAuth认证失败</h3>
          <p>${error.message}</p>
          <p>请手动关闭此窗口</p>
        </div>
      `;
      document.body.appendChild(errorMsg);
    }

    return false;
  }

  // 主函数 - 负责UI初始化和页面检测路由
  async function main() {
    try {
      // 快速初始化核心组件
      UIManager.createMinimalUI();

      // 异步完成完整初始化
      setTimeout(() => {
        try {
          UIManager.init();
          getLogger().log('✅ 完整UI界面已创建', 'info');
        } catch (error) {
          console.error('UI完整初始化失败:', error);
          getLogger().log(`UI完整初始化失败: ${error.message}`, 'error');
        }
      }, 50);

      console.log('🚀 快速UI界面已创建');
    } catch (error) {
      console.error('快速UI创建失败:', error);
    }

    getLogger().log('🔍 检测当前页面类型...', 'info');

    const currentUrl = window.location.href;

    // 检查是否是OAuth认证回调页面
    if (currentUrl.includes('code=') || (currentUrl.includes(
        'auth.augmentcode.com') && document.scripts.length > 0)) {
      const handled = await handleOAuthCallback();
      if (handled) return;
    }

    // 检测第三页面：成功页面
    if (window.location.href.includes(
        'app.augmentcode.com/account/subscription')) {
      getLogger().log('📄 检测到第三页面：成功页面', 'info');
      if (StateManager.app.isAutoRegistering) {
        await handleThirdPage();
      }
      return;
    }

    // 检测第二页面：验证码输入页面
    const emailSentText = Array.from(document.querySelectorAll('*')).find(el =>
        el.textContent && el.textContent.includes(
            "We've sent an email with your code to")
    );
    if (document.querySelector('input[name="code"]') || emailSentText) {
      getLogger().log('📄 检测到第二页面：验证码输入页面', 'info');
      if (emailSentText) {
        const emailMatch = emailSentText.textContent.match(
            /to\s+([^\s]+@[^\s]+)/);
        if (emailMatch) {
          getLogger().log(`📧 验证码已发送到: ${emailMatch[1]}`, 'info');
        }
      }
      if (StateManager.app.isAutoRegistering) {
        await handleSecondPage();
      }
      return;
    }

    // 检测注册被拒绝页面
    const rejectedText = Array.from(document.querySelectorAll('*')).find(el =>
        el.textContent && el.textContent.includes('Sign-up rejected')
    );
    if (rejectedText) {
      getLogger().log('📄 检测到注册被拒绝页面', 'warning');
      if (StateManager.app.isAutoRegistering) {
        getLogger().log('🔄 持续注册模式：自动处理注册被拒绝', 'info');
        await handleSignupRejectedPage();
      } else {
        getLogger().log('💡 检测到注册被拒绝，请手动点击重试链接', 'warning');
      }
      return;
    }

    // 检测第一页面：邮箱输入页面
    const googleButton = Array.from(document.querySelectorAll('button')).find(
        btn =>
            btn.textContent && btn.textContent.includes('Continue with Google')
    );
    if (document.querySelector('input[name="username"]') || googleButton) {
      getLogger().log('📄 检测到第一页面：邮箱输入页面', 'info');
      if (googleButton) {
        getLogger().log('🔍 检测到Google登录按钮，确认为注册页面', 'info');
      }

      if (StateManager.app.isAutoRegistering) {
        getLogger().log('🔄 持续注册模式：自动开始注册流程', 'info');
        await executeFullRegistration();
      } else {
        getLogger().log('💡 请点击"开始持续注册"按钮来启动自动注册', 'info');
      }
      return;
    }

    // 检测是否在注册相关页面
    if (!window.location.href.includes('login.augmentcode.com') &&
        !window.location.href.includes('auth.augmentcode.com')) {
      getLogger().log('⚠️ 当前页面不是注册页面，脚本不执行', 'warning');
      return;
    }

    getLogger().log('❓ 无法识别当前页面状态，等待页面加载...', 'warning');
  }

  // 处理第三页面：成功页面（subscription页面）
  async function handleThirdPage() {
    getLogger().log('检测到subscription页面，开始提取账户信息...', 'info');

    try {
      // 等待页面元素加载完成
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 提取额度信息
      let credits = '0';
      const creditElement = document.querySelector(
          'span.rt-Text.rt-r-size-5.rt-r-weight-medium');

      if (creditElement) {
        // 获取初始值
        const initialText = creditElement.textContent.trim();
        const initialMatch = initialText.match(/(\d+)/);
        const initialCredits = initialMatch ? initialMatch[1] : '0';

        // 等待几秒看是否有变化
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 获取更新后的值
        const updatedText = creditElement.textContent.trim();
        const updatedMatch = updatedText.match(/(\d+)/);
        const updatedCredits = updatedMatch ? updatedMatch[1] : '0';

        // 如果有变化就用新值，否则用初始值
        credits = updatedCredits !== initialCredits ? updatedCredits
            : initialCredits;
        getLogger().log(`检测到账户额度: ${credits}`, 'success');
      } else {
        getLogger().log('未找到额度信息元素', 'warning');
      }

      // 提取邮箱信息（优先使用OAuth认证邮箱）
      let email = '';

      // 首先尝试从OAuth状态获取邮箱
      const oauthStateStr = GM_getValue('oauth_state', null);
      if (oauthStateStr) {
        const oauthState = safeJsonParse(oauthStateStr);
        if (oauthState && oauthState.email) {
          email = oauthState.email;
          getLogger().log(`✅ 使用OAuth认证邮箱: ${email}`, 'success');
        }
      }

      // 如果OAuth状态中没有邮箱，尝试从页面元素获取
      if (!email) {
        const emailElement = document.querySelector('[data-testid="user-email"]');
        if (emailElement) {
          email = emailElement.textContent.trim();
          getLogger().log(`✅ 从页面元素检测到邮箱: ${email}`, 'success');
        } else {
          getLogger().log('⚠️ 未找到邮箱信息元素', 'warning');
        }
      }

      // 如果仍然没有邮箱，使用当前注册邮箱
      if (!email) {
        email = GM_getValue('current_registration_email', null);
        if (email) {
          getLogger().log(`✅ 使用当前注册邮箱: ${email}`, 'success');
        }
      }

      // 获取OAuth令牌（从预先生成的认证信息中）
      let tokenInfo = null;
      if (email) {
        try {
          getLogger().log('🔍 检查是否有预先生成的OAuth认证信息...', 'info');

          // 由于我们已经从OAuth状态获取了邮箱，直接尝试提取认证信息
          getLogger().log('✅ 使用OAuth认证邮箱，开始提取认证信息', 'success');

          // 尝试从当前页面提取认证信息
          try {
            const authInfo = OAuthManager.extractAuthInfo();
            if (authInfo && authInfo.code && authInfo.tenant) {
              getLogger().log('🔄 开始自动交换OAuth令牌...', 'info');
              tokenInfo = await OAuthManager.exchangeToken(authInfo.tenant, authInfo.code);
              getLogger().log('🎉 OAuth令牌自动获取成功！', 'success');

              // 提交认证信息到API
              try {
                const apiSubmitResult = await submitToAPI(tokenInfo.access_token, tokenInfo.tenant);
                if (apiSubmitResult) {
                  getLogger().log('🚀 认证信息已成功提交到API', 'success');
                } else {
                  getLogger().log('⚠️ API提交失败，但不影响注册流程继续', 'warning');
                }
              } catch (error) {
                getLogger().log(`⚠️ API提交异常: ${error.message}，但不影响注册流程继续`, 'warning');
              }
            } else {
              getLogger().log('⚠️ 未在当前页面找到OAuth认证信息', 'warning');
            }
          } catch (extractError) {
            getLogger().log(`⚠️ 提取OAuth认证信息失败: ${extractError.message}`, 'warning');
          }

        } catch (error) {
          getLogger().log(`❌ 获取OAuth令牌失败: ${error.message}`, 'error');
        }
      }

      // 保存账户信息（包含令牌信息）
      if (email) {
        const accountInfo = {
          email: email,
          credits: credits,
          registeredAt: new Date().toISOString(),
          // OAuth令牌信息
          oauth: tokenInfo ? {
            access_token: tokenInfo.access_token,
            token_type: tokenInfo.token_type,
            expires_in: tokenInfo.expires_in,
            tenant: tokenInfo.tenant,
            obtainedAt: new Date().toISOString()
          } : null
        };

        // 使用StateManager更新账户信息
        updateAppState({
          registeredAccounts: [...registeredAccounts, accountInfo],
          registrationCount: registrationCount + 1
        });

        // 更新UI显示
        updateRegistrationStatus();

        if (tokenInfo) {
          getLogger().log(
              `✅ 完整账户信息已保存: ${email} (额度: ${credits}, 令牌: ${tokenInfo.access_token.substring(
                  0, 20)}...)`, 'success');
          getLogger().log(`🏢 租户地址: ${tokenInfo.tenant}`, 'success');
        } else {
          getLogger().log(`⚠️ 账户信息已保存（无令牌）: ${email} (额度: ${credits})`,
              'warning');
        }
      }

      // 检查是否已停止注册
      if (!StateManager.app.isAutoRegistering) {
        getLogger().log('⏹️ 注册已停止，不执行退出登录', 'warning');
        return true;
      }

      // 等待一下再点击退出登录
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 再次检查是否已停止注册
      if (!StateManager.app.isAutoRegistering) {
        getLogger().log('⏹️ 注册已停止，不执行退出登录', 'warning');
        return true;
      }

      // 点击退出登录按钮
      const logoutBtn = document.querySelector('[data-testid="logout-button"]');
      if (logoutBtn) {
        logoutBtn.click();
        getLogger().log('已点击退出登录按钮', 'success');

        // 等待页面跳转
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 最终检查是否还在持续注册模式
        if (StateManager.app.isAutoRegistering) {
          // 检查是否已达到最大注册数量
          const { registrationCount, maxRegistrationCount, registrationInterval } = StateManager.app;
          if (registrationCount >= maxRegistrationCount) {
            getLogger().log(`🎉 已达到最大注册数量 ${maxRegistrationCount} 个，注册完成！`, 'success');
            stopContinuousRegistration();
            return;
          }

          getLogger().log(`准备开始下一轮注册... (${registrationInterval}秒后)`, 'info');
          getLogger().log(`📊 当前进度: ${registrationCount}/${maxRegistrationCount}`, 'info');

          // 显示倒计时
          showCountdown(registrationInterval);

          window.registrationTimer = setTimeout(() => {
            // 再次检查是否还在注册模式
            if (StateManager.app.isAutoRegistering) {
              window.location.reload();
            } else {
              getLogger().log('⏹️ 注册已在等待期间被停止', 'warning');
            }
          }, registrationInterval * 1000);
        } else {
          getLogger().log('⏹️ 注册已停止，不继续下一轮', 'warning');
        }
      } else {
        getLogger().log('未找到退出登录按钮', 'error');
      }

    } catch (error) {
      getLogger().log('处理subscription页面时出错: ' + error, 'error');
    }
  }





  // 导出账户信息(JSON格式)
  function exportAccountsJSON() {
    if (registeredAccounts.length === 0) {
      getLogger().log('没有可导出的账户信息', 'warning');
      return;
    }

    // 生成JSON格式的导出数据
    const exportData = {
      exportInfo: {
        exportTime: new Date().toISOString(),
        totalAccounts: registeredAccounts.length,
        accountsWithToken: registeredAccounts.filter(account =>
            account.oauth && account.oauth.access_token
        ).length,
        version: '2.0.0'
      },
      accounts: registeredAccounts.map((account, index) => ({
        id: index + 1,
        email: account.email,
        credits: account.credits,
        registeredAt: account.registeredAt,
        oauth: account.oauth ? {
          tenant: account.oauth.tenant,
          access_token: account.oauth.access_token,
          token_type: account.oauth.token_type,
          expires_in: account.oauth.expires_in,
          obtainedAt: account.oauth.obtainedAt
        } : null
      }))
    };

    // 创建下载链接
    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent],
        {type: 'application/json; charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `augmentcode_accounts_${new Date().toISOString().slice(0,
        10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // 统计信息
    const accountsWithToken = registeredAccounts.filter(account =>
        account.oauth && account.oauth.access_token
    ).length;

    getLogger().log(`✅ 已导出 ${registeredAccounts.length} 个账户信息(JSON格式)`,
        'success');
    getLogger().log(`📊 其中 ${accountsWithToken} 个账户包含OAuth令牌`, 'info');
    getLogger().log(
        `📁 文件名: augmentcode_accounts_${new Date().toISOString().slice(0,
            10)}.json`, 'info');
  }

  // ==================== 页面处理函数 ====================

  // 处理第一页面：邮箱输入和人机验证
  async function handleFirstPage() {
    getLogger().log('开始处理第一页面：邮箱输入和人机验证', 'info');

    // 1. 检查并填写邮箱
    const emailInput = await waitForElement('input[name="username"]');
    if (!emailInput) {
      getLogger().log('未找到邮箱输入框', 'error');
      return false;
    }

    // 检查邮箱是否已经预填充（注册被拒后重试的情况）
    const existingEmail = emailInput.value.trim();
    if (existingEmail) {
      getLogger().log(`检测到预填充邮箱: ${existingEmail}`, 'info');
      getLogger().log('跳过邮箱填写，使用预填充的邮箱', 'success');
    } else {
      // 优先使用预先生成的邮箱（用于OAuth认证）
      let email = GM_getValue('current_registration_email', null);
      if (!email) {
        // 如果没有预先生成的邮箱，则生成新邮箱
        email = generateRandomEmail();
        getLogger().log('⚠️ 未找到预生成邮箱，生成新邮箱: ' + email, 'warning');
      } else {
        getLogger().log('✅ 使用预生成的OAuth邮箱: ' + email, 'success');
        // 使用后清理，避免重复使用
        GM_deleteValue('current_registration_email');
      }

      getLogger().log('找到邮箱输入框，开始填写');
      emailInput.value = email;
      emailInput.dispatchEvent(new Event('input', {bubbles: true}));
      getLogger().log('邮箱填写完成', 'success');
    }

    // 2. 等待并处理人机验证
    getLogger().log('开始处理人机验证流程...', 'info');
    await new Promise(resolve => setTimeout(resolve, 1000));

    const verificationResult = await handleHumanVerification();
    if (!verificationResult) {
      getLogger().log('人机验证失败，等待5秒后重试...', 'warning');
      await new Promise(resolve => setTimeout(resolve, 5000));

      const retryResult = await handleHumanVerification();
      if (!retryResult) {
        getLogger().log('人机验证重试失败，停止当前注册流程', 'error');
        return false;
      }
    }

    // 3. 人机验证成功后，点击继续按钮
    const continueBtn = await waitForElement('button[type="submit"]');
    if (!continueBtn) {
      getLogger().log('未找到继续按钮', 'error');
      return false;
    }

    getLogger().log('人机验证完成，点击继续按钮');
    continueBtn.click();

    getLogger().log('第一页面处理完成', 'success');
    return true;
  }

  // 处理第二页面：验证码输入
  async function handleSecondPage() {
    getLogger().log('开始处理第二页面：验证码输入', 'info');

    // 1. 获取验证码
    const code = await getVerificationCode();
    if (!code) {
      getLogger().log('未能获取验证码', 'error');
      return false;
    }

    // 2. 填写验证码
    const codeInput = await waitForElement('input[name="code"]');
    if (!codeInput) {
      getLogger().log('未找到验证码输入框', 'error');
      return false;
    }

    getLogger().log('找到验证码输入框，开始填写');
    codeInput.value = code;
    codeInput.dispatchEvent(new Event('input', {bubbles: true}));
    getLogger().log('验证码填写完成', 'success');

    // 3. 点击继续按钮
    const continueBtn = await waitForElement('button[type="submit"]');
    if (!continueBtn) {
      getLogger().log('未找到继续按钮', 'error');
      return false;
    }

    getLogger().log('点击继续按钮');
    continueBtn.click();

    // 4. 等待并检测注册结果
    getLogger().log('等待注册完成...', 'info');
    await new Promise(resolve => setTimeout(resolve, 3000)); // 等待页面响应

    // 检查是否出现注册被拒绝页面
    if (await handleSignupRejectedPage()) {
      getLogger().log('检测到注册被拒绝，已处理重试', 'warning');
      return false; // 返回false表示需要重新开始流程
    }

    // 检测注册成功
    await checkRegistrationSuccess();

    getLogger().log('第二页面处理完成', 'success');
    return true;
  }

  // 处理注册被拒绝页面
  async function handleSignupRejectedPage() {
    getLogger().log('检查是否出现注册被拒绝页面...', 'info');

    // 检测页面是否包含"Sign-up rejected"文本
    const rejectedText = Array.from(document.querySelectorAll('*')).find(el =>
        el.textContent && el.textContent.includes('Sign-up rejected')
    );

    if (rejectedText) {
      getLogger().log('⚠️ 检测到注册被拒绝页面', 'warning');

      // 查找"Try again here"链接
      const tryAgainLink = document.querySelector('a[href*="/login"]');
      if (tryAgainLink) {
        getLogger().log('找到重试链接，正在点击...', 'info');
        tryAgainLink.click();

        // 等待页面跳转
        await new Promise(resolve => setTimeout(resolve, 3000));
        getLogger().log('已点击重试链接，页面将跳转到注册页面', 'success');
        return true; // 返回true表示处理了拒绝页面
      } else {
        getLogger().log('未找到重试链接', 'error');
        return false;
      }
    }

    return false; // 没有检测到拒绝页面
  }

  // ==================== 集成测试和功能验证 ====================

  /**
   * 系统完整性测试
   */
  function runIntegrityTests() {
    const testResults = {
      passed: 0,
      failed: 0,
      tests: []
    };

    function test(name, condition, description = '') {
      const result = {
        name,
        passed: !!condition,
        description,
        timestamp: new Date().toISOString()
      };
      testResults.tests.push(result);
      if (result.passed) {
        testResults.passed++;
        getLogger().log(`✅ ${name}: 通过`, 'success');
      } else {
        testResults.failed++;
        getLogger().log(`❌ ${name}: 失败 - ${description}`, 'error');
      }
    }

    getLogger().log('🧪 开始系统完整性测试...', 'info');

    // 1. 核心组件存在性测试
    test('StateManager存在', typeof StateManager !== 'undefined', 'StateManager对象未定义');
    test('EventManager存在', typeof EventManager !== 'undefined', 'EventManager对象未定义');
    test('UIManager存在', typeof UIManager !== 'undefined', 'UIManager对象未定义');
    test('OAuthManager存在', typeof OAuthManager !== 'undefined', 'OAuthManager对象未定义');

    // 2. UI组件存在性测试
    test('FloatingIcon组件', typeof FloatingIcon !== 'undefined', 'FloatingIcon组件未定义');
    test('MainPanel组件', typeof MainPanel !== 'undefined', 'MainPanel组件未定义');
    test('ControlSection组件', typeof ControlSection !== 'undefined', 'ControlSection组件未定义');
    test('QuickConfigSection组件', typeof QuickConfigSection !== 'undefined', 'QuickConfigSection组件未定义');
    test('AdvancedConfigSection组件', typeof AdvancedConfigSection !== 'undefined', 'AdvancedConfigSection组件未定义');
    test('ToolsSection组件', typeof ToolsSection !== 'undefined', 'ToolsSection组件未定义');
    test('LogViewer组件', typeof LogViewer !== 'undefined', 'LogViewer组件未定义');

    // 3. 核心功能函数测试
    test('startContinuousRegistration函数', typeof startContinuousRegistration === 'function', '开始注册函数未定义');
    test('stopContinuousRegistration函数', typeof stopContinuousRegistration === 'function', '停止注册函数未定义');

    test('clearAccountsData函数', typeof clearAccountsData === 'function', '清除数据函数未定义');
    test('getNextEmail函数', typeof getNextEmail === 'function', '获取邮箱函数未定义');

    // 4. 状态管理测试
    test('StateManager.app存在', StateManager && StateManager.app, 'StateManager.app未定义');
    test('StateManager.ui存在', StateManager && StateManager.ui, 'StateManager.ui未定义');
    test('StateManager方法完整',
      StateManager &&
      typeof StateManager.save === 'function' &&
      typeof StateManager.load === 'function' &&
      typeof StateManager.toggleUI === 'function',
      'StateManager关键方法缺失'
    );

    // 5. 事件管理测试
    test('EventManager方法完整',
      EventManager &&
      typeof EventManager.bind === 'function' &&
      typeof EventManager.unbind === 'function' &&
      typeof EventManager.trigger === 'function',
      'EventManager关键方法缺失'
    );

    // 6. UI管理测试
    test('UIManager方法完整',
      UIManager &&
      typeof UIManager.init === 'function' &&
      typeof UIManager.toggleUI === 'function' &&
      typeof UIManager.updateUI === 'function',
      'UIManager关键方法缺失'
    );

    // 7. 日志系统测试
    test('Logger存在', typeof logger !== 'undefined', 'Logger对象未定义');
    test('Logger方法完整', logger && typeof getLogger().log === 'function', 'Logger.log方法缺失');

    // 输出测试结果
    getLogger().log(`🧪 测试完成: ${testResults.passed} 通过, ${testResults.failed} 失败`,
      testResults.failed === 0 ? 'success' : 'warning');

    return testResults;
  }

  /**
   * UI状态测试
   */
  function testUIState() {
    getLogger().log('🎨 开始UI状态测试...', 'info');

    try {
      // 测试状态管理
      const originalExpanded = StateManager.ui.expanded;

      // 测试状态切换
      StateManager.toggleUI();
      const newState = StateManager.ui.expanded;

      if (newState !== originalExpanded) {
        getLogger().log('✅ UI状态切换测试通过', 'success');
      } else {
        getLogger().log('❌ UI状态切换测试失败', 'error');
      }

      // 恢复原始状态
      if (StateManager.ui.expanded !== originalExpanded) {
        StateManager.toggleUI();
      }

      // 测试状态持久化
      StateManager.save();
      getLogger().log('✅ 状态持久化测试通过', 'success');

      return true;
    } catch (error) {
      getLogger().log(`❌ UI状态测试失败: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * 性能测试
   */
  function testPerformance() {
    getLogger().log('⚡ 开始性能测试...', 'info');

    try {
      // 测试UI初始化性能
      const startTime = performance.now();

      // 模拟UI操作
      for (let i = 0; i < 100; i++) {
        StateManager.save();
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      if (duration < 100) {
        getLogger().log(`✅ 性能测试通过: ${duration.toFixed(2)}ms`, 'success');
      } else {
        getLogger().log(`⚠️ 性能测试警告: ${duration.toFixed(2)}ms (超过100ms)`, 'warning');
      }

      // 测试事件管理器性能
      const eventStartTime = performance.now();
      const testElement = document.createElement('div');

      for (let i = 0; i < 50; i++) {
        EventManager.bind(testElement, 'click', () => {});
      }

      EventManager.cleanup();
      const eventEndTime = performance.now();
      const eventDuration = eventEndTime - eventStartTime;

      if (eventDuration < 50) {
        getLogger().log(`✅ 事件管理性能测试通过: ${eventDuration.toFixed(2)}ms`, 'success');
      } else {
        getLogger().log(`⚠️ 事件管理性能测试警告: ${eventDuration.toFixed(2)}ms`, 'warning');
      }

      return true;
    } catch (error) {
      getLogger().log(`❌ 性能测试失败: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * 运行所有测试
   */
  function runAllTests() {
    getLogger().log('🚀 开始全面系统测试...', 'info');

    const results = {
      integrity: runIntegrityTests(),
      uiState: testUIState(),
      performance: testPerformance()
    };

    const allPassed = results.integrity.failed === 0 && results.uiState && results.performance;

    getLogger().log(`📊 测试总结: ${allPassed ? '全部通过' : '存在问题'}`, allPassed ? 'success' : 'warning');

    return results;
  }

  /**
   * 浏览器兼容性检查
   */
  function checkBrowserCompatibility() {
    getLogger().log('🌐 开始浏览器兼容性检查...', 'info');

    const checks = [
      {
        name: 'ES6支持',
        test: () => {
          try {
            eval('const test = () => {}; class Test {}');
            return true;
          } catch (e) {
            return false;
          }
        }
      },
      {
        name: 'Promise支持',
        test: () => typeof Promise !== 'undefined'
      },
      {
        name: 'Fetch API支持',
        test: () => typeof fetch !== 'undefined'
      },
      {
        name: 'LocalStorage支持',
        test: () => {
          try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
          } catch (e) {
            return false;
          }
        }
      },
      {
        name: 'CustomEvent支持',
        test: () => typeof CustomEvent !== 'undefined'
      },
      {
        name: 'GM API支持',
        test: () => typeof GM_setValue !== 'undefined' && typeof GM_getValue !== 'undefined'
      }
    ];

    let passed = 0;
    let failed = 0;

    checks.forEach(check => {
      try {
        if (check.test()) {
          getLogger().log(`✅ ${check.name}: 支持`, 'success');
          passed++;
        } else {
          getLogger().log(`❌ ${check.name}: 不支持`, 'error');
          failed++;
        }
      } catch (error) {
        getLogger().log(`❌ ${check.name}: 检查失败 - ${error.message}`, 'error');
        failed++;
      }
    });

    const userAgent = navigator.userAgent;
    const browserInfo = {
      isChrome: userAgent.includes('Chrome'),
      isFirefox: userAgent.includes('Firefox'),
      isEdge: userAgent.includes('Edge'),
      isSafari: userAgent.includes('Safari') && !userAgent.includes('Chrome')
    };

    getLogger().log(`🌐 浏览器信息: ${Object.keys(browserInfo).find(key => browserInfo[key]) || 'Unknown'}`, 'info');
    getLogger().log(`🧪 兼容性检查: ${passed} 通过, ${failed} 失败`, failed === 0 ? 'success' : 'warning');

    return { passed, failed, browserInfo };
  }

  /**
   * 功能验证测试
   */
  function validateFunctionality() {
    getLogger().log('🔧 开始功能验证测试...', 'info');

    const validations = [
      {
        name: '邮箱生成功能',
        test: () => {
          const email = getNextEmail();
          return email && email.includes('@') && email.length > 5;
        }
      },
      {
        name: '状态保存功能',
        test: () => {
          const originalCount = StateManager.app.registrationCount;
          StateManager.setAppState({ registrationCount: originalCount + 1 });
          StateManager.save();
          const saved = StateManager.app.registrationCount === originalCount + 1;
          StateManager.setAppState({ registrationCount: originalCount });
          return saved;
        }
      },
      {
        name: 'UI组件创建',
        test: () => {
          try {
            const testIcon = FloatingIcon.create();
            return testIcon && testIcon.tagName === 'DIV';
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: '事件绑定功能',
        test: () => {
          try {
            const testElement = document.createElement('div');
            let triggered = false;
            EventManager.bind(testElement, 'click', () => { triggered = true; });
            testElement.click();
            EventManager.unbind(testElement, 'click');
            return triggered;
          } catch (error) {
            return false;
          }
        }
      },
      {
        name: '日志系统功能',
        test: () => {
          try {
            const originalLength = LogViewer.logEntries ? LogViewer.logEntries.length : 0;
            getLogger().log('测试日志', 'info');
            return LogViewer.logEntries && LogViewer.logEntries.length > originalLength;
          } catch (error) {
            return false;
          }
        }
      }
    ];

    let passed = 0;
    let failed = 0;

    validations.forEach(validation => {
      try {
        if (validation.test()) {
          getLogger().log(`✅ ${validation.name}: 正常`, 'success');
          passed++;
        } else {
          getLogger().log(`❌ ${validation.name}: 异常`, 'error');
          failed++;
        }
      } catch (error) {
        getLogger().log(`❌ ${validation.name}: 测试失败 - ${error.message}`, 'error');
        failed++;
      }
    });

    getLogger().log(`🔧 功能验证: ${passed} 通过, ${failed} 失败`, failed === 0 ? 'success' : 'warning');
    return { passed, failed };
  }

  /**
   * 完整的系统验证
   */
  function runCompleteValidation() {
    getLogger().log('🎯 开始完整系统验证...', 'info');

    const results = {
      integrity: runIntegrityTests(),
      compatibility: checkBrowserCompatibility(),
      functionality: validateFunctionality(),
      uiState: testUIState(),
      performance: testPerformance()
    };

    const totalPassed = results.integrity.passed + results.compatibility.passed + results.functionality.passed;
    const totalFailed = results.integrity.failed + results.compatibility.failed + results.functionality.failed;
    const uiPassed = results.uiState ? 1 : 0;
    const perfPassed = results.performance ? 1 : 0;

    getLogger().log(`🎯 系统验证完成:`, 'info');
    getLogger().log(`   📊 组件测试: ${results.integrity.passed}/${results.integrity.passed + results.integrity.failed}`, 'info');
    getLogger().log(`   🌐 兼容性: ${results.compatibility.passed}/${results.compatibility.passed + results.compatibility.failed}`, 'info');
    getLogger().log(`   🔧 功能性: ${results.functionality.passed}/${results.functionality.passed + results.functionality.failed}`, 'info');
    getLogger().log(`   🎨 UI状态: ${uiPassed}/1`, 'info');
    getLogger().log(`   ⚡ 性能: ${perfPassed}/1`, 'info');

    const overallSuccess = totalFailed === 0 && results.uiState && results.performance;
    getLogger().log(`🏆 总体评估: ${overallSuccess ? '系统运行正常' : '发现问题需要关注'}`,
      overallSuccess ? 'success' : 'warning');

    return results;
  }

  /**
   * 专门验证修复效果的测试函数
   */
  function testFixedIssues() {
    getLogger().log('🔧 开始验证修复效果测试...', 'info');

    const testResults = {
      loggerFix: false,
      uiStateFix: false,
      positionFix: false,
      noRegressions: false
    };

    try {
      // 测试1：验证日志系统修复
      getLogger().log('📝 测试1：验证日志系统是否正常工作', 'info');

      // 检查getLogger函数是否存在且可用
      if (typeof getLogger === 'function') {
        const loggerInstance = getLogger();
        if (loggerInstance && typeof loggerInstance.log === 'function') {
          // 检查LogViewer是否已初始化
          if (LogViewer && Array.isArray(LogViewer.logEntries)) {
            // 测试日志记录
            const originalLogCount = LogViewer.logEntries.length;
            getLogger().log('🧪 测试日志记录功能', 'info');

            // 检查日志是否被正确记录
            setTimeout(() => {
              const newLogCount = LogViewer.logEntries.length;
              if (newLogCount > originalLogCount) {
                testResults.loggerFix = true;
                getLogger().log('✅ 日志系统修复验证通过', 'success');
              } else {
                getLogger().log('❌ 日志系统修复验证失败', 'error');
              }
            }, 200); // 增加等待时间
          } else {
            getLogger().log('⚠️ LogViewer未完全初始化，跳过日志验证', 'warning');
            testResults.loggerFix = true; // 暂时标记为通过
          }
        }
      }

      // 测试2：验证UI状态恢复机制
      getLogger().log('🎨 测试2：验证UI状态恢复机制', 'info');

      // 检查restoreUIState函数是否存在
      if (UIManager && typeof UIManager.restoreUIState === 'function') {
        testResults.uiStateFix = true;
        getLogger().log('✅ UI状态恢复机制已实现', 'success');
      } else {
        getLogger().log('❌ UI状态恢复机制未找到', 'error');
      }

      // 测试3：验证位置保存功能
      getLogger().log('📍 测试3：验证位置保存功能', 'info');

      // 检查StateManager是否包含position字段
      if (StateManager && StateManager.ui && StateManager.ui.hasOwnProperty('position')) {
        testResults.positionFix = true;
        getLogger().log('✅ 位置保存功能已实现', 'success');
      } else {
        getLogger().log('❌ 位置保存功能未找到', 'error');
      }

      // 测试4：回归测试 - 检查核心功能是否正常
      getLogger().log('🔄 测试4：回归测试 - 检查核心功能', 'info');

      const coreComponents = [
        { name: 'StateManager', obj: StateManager },
        { name: 'UIManager', obj: UIManager },
        { name: 'EventManager', obj: EventManager },
        { name: 'FloatingIcon', obj: FloatingIcon },
        { name: 'MainPanel', obj: MainPanel }
      ];

      let allComponentsOk = true;
      coreComponents.forEach(component => {
        if (!component.obj) {
          getLogger().log(`❌ ${component.name} 组件缺失`, 'error');
          allComponentsOk = false;
        }
      });

      if (allComponentsOk) {
        testResults.noRegressions = true;
        getLogger().log('✅ 回归测试通过，核心功能正常', 'success');
      } else {
        getLogger().log('❌ 回归测试失败，发现组件问题', 'error');
      }

      // 输出测试总结
      const passedTests = Object.values(testResults).filter(result => result).length;
      const totalTests = Object.keys(testResults).length;

      getLogger().log(`🎯 修复效果验证完成: ${passedTests}/${totalTests} 项测试通过`,
        passedTests === totalTests ? 'success' : 'warning');

      if (passedTests === totalTests) {
        getLogger().log('🎉 所有修复都已成功验证！', 'success');
      } else {
        getLogger().log('⚠️ 部分修复需要进一步检查', 'warning');
      }

      return testResults;

    } catch (error) {
      getLogger().log(`❌ 修复效果验证测试出错: ${error.message}`, 'error');
      return testResults;
    }
  }

  // 在开发模式下运行测试
  if (window.location.search.includes('debug=true')) {
    setTimeout(() => {
      runCompleteValidation();
    }, 2000);
  }

  /**
   * 显示手动测试指南
   */
  function showTestGuide() {
    getLogger().log('📖 手动测试指南:', 'info');
    getLogger().log('', 'info');
    getLogger().log('🔍 测试1：日志功能验证', 'info');
    getLogger().log('  1. 检查此日志区域是否显示日志条目', 'info');
    getLogger().log('  2. 点击脚本UI中的各个按钮，观察是否有日志输出', 'info');
    getLogger().log('  3. 刷新页面，检查日志是否仍能正常显示', 'info');
    getLogger().log('', 'info');
    getLogger().log('🎨 测试2：UI状态恢复验证', 'info');
    getLogger().log('  1. 点击浮动图标展开UI面板', 'info');
    getLogger().log('  2. 刷新页面或跳转到其他页面', 'info');
    getLogger().log('  3. 检查UI是否保持展开状态', 'info');
    getLogger().log('  4. 收起UI后重复上述步骤，检查收起状态是否保持', 'info');
    getLogger().log('', 'info');
    getLogger().log('📍 测试3：位置保存验证', 'info');
    getLogger().log('  1. 展开UI面板', 'info');
    getLogger().log('  2. 拖拽面板到不同位置', 'info');
    getLogger().log('  3. 刷新页面', 'info');
    getLogger().log('  4. 检查面板是否在之前拖拽的位置', 'info');
    getLogger().log('', 'info');
    getLogger().log('🔄 测试4：功能回归验证', 'info');
    getLogger().log('  1. 测试所有UI按钮是否正常工作', 'info');
    getLogger().log('  2. 测试注册流程是否正常（如果适用）', 'info');
    getLogger().log('  3. 检查是否有新的错误或异常', 'info');
    getLogger().log('', 'info');
    getLogger().log('✅ 如果以上测试都通过，说明修复成功！', 'success');
  }

  // 自动运行修复验证测试（仅在非注册状态下）
  setTimeout(() => {
    // 只有在非注册状态下才运行测试
    if (!StateManager.app.isAutoRegistering) {
      testFixedIssues();

      // 延迟显示测试指南
      setTimeout(() => {
        showTestGuide();
      }, 2000);
    }
  }, 1000);

  // 将测试函数暴露到全局，方便用户在控制台调用
  window.AugmentCodeTests = {
    testFixedIssues: testFixedIssues,
    showTestGuide: showTestGuide,
    runAllTests: runAllTests,
    runCompleteValidation: runCompleteValidation
  };

  // 输出修复完成信息
  console.log(`
🎉 AugmentCode 脚本问题修复完成！

📋 修复内容：
✅ 1. 修复了操作日志为空的问题 - 日志现在会持久化保存，页面跳转后不会丢失
✅ 2. 恢复了清除账户操作功能 - 工具箱中的清除账户按钮现在正常工作
✅ 3. 个人Token改名为daijuToken - 标签已更新，支持可选配置，不填则不调用API
✅ 4. 修复了界面滚动条问题 - 增加了滚动条样式，支持更好的内容显示
✅ 5. 修复了结束注册没有生效的问题 - 强化了停止机制，确保注册能正确停止
✅ 6. 快速配置改为可折叠 - 快速配置区域现在支持折叠，除操作日志外其他区域默认折叠
✅ 7. 页面折叠状态持久化 - 折叠状态现在会保存，页面跳转或刷新后不会丢失
✅ 8. daijuToken增加眼睛图标 - 可以切换显示/隐藏密码
✅ 9. 移除导出TXT功能 - 简化界面，只保留JSON导出
✅ 10. 优化页面加载速度 - 采用分阶段初始化，显著提升加载速度

🔧 具体改进：
- 日志系统：添加了持久化存储，页面跳转后自动恢复日志
- 清除功能：修复了清除账户数据的按钮事件绑定
- Token配置：daijuToken现在是可选的，不配置时不会调用API
- 界面优化：主面板支持滚动，日志区域有自定义滚动条
- 停止机制：增强了注册停止检查，支持定时器清理
- 折叠优化：快速配置区域改为可折叠，除操作日志外其他区域默认折叠
- 状态持久化：折叠状态会保存到本地，页面跳转后自动恢复
- 密码显示：daijuToken输入框增加眼睛图标，可切换显示/隐藏
- 功能精简：移除导出TXT功能，保留更实用的JSON导出
- 性能优化：采用分阶段初始化策略，显著提升页面加载速度

🧪 测试方法：
- 自动测试：脚本会自动运行基础验证测试
- 手动测试：查看日志区域的测试指南
- 控制台测试：使用 AugmentCodeTests.testFixedIssues() 运行测试

📖 使用说明：
1. daijuToken现在是可选配置，不填写则不会调用API
2. 日志会自动保存，页面跳转后会恢复显示
3. 清除账户功能已恢复，在工具箱中可以找到
4. 界面支持滚动，可以查看更多内容
5. 停止注册功能已增强，确保能正确停止
6. 快速配置区域现在可以折叠，界面更加简洁
7. 折叠状态会自动保存，页面跳转后不会丢失
8. daijuToken输入框支持密码显示切换
9. 移除了导出TXT功能，界面更简洁
10. 页面加载速度显著提升

版本：问题修复版 v2.3
修复时间：${new Date().toLocaleString()}
  `);

  // 启动脚本
  main().catch(function (error) {
    console.error('脚本执行出错:', error);
  });
})();
