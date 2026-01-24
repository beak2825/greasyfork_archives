// ==UserScript==
// @name         NodeImage图片上传助手（兼容Safari）
// @namespace    https://www.nodeimage.com/
// @version      1.0.3
// @description  在NodeSeek编辑器中粘贴图片自动上传到NodeImage图床 (Safari完全兼容版)
// @author       Claude AI 修改自 shuai 
// @match        *://www.nodeseek.com/*
// @match        *://nodeimage.com/*
// @match        *://*.nodeimage.com/*
// @icon         https://cdn.nodeimage.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      nodeimage.com
// @connect      api.nodeimage.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563720/NodeImage%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B%EF%BC%88%E5%85%BC%E5%AE%B9Safari%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/563720/NodeImage%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B%EF%BC%88%E5%85%BC%E5%AE%B9Safari%EF%BC%89.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ===== 全局配置 (Global Configuration) =====
  const APP = {
    api: {
      key: GM_getValue('nodeimage_apiKey', ''),
      setKey: key => {
        GM_setValue('nodeimage_apiKey', key);
        APP.api.key = key;
        UI.updateState();
      },
      clearKey: () => {
        GM_deleteValue('nodeimage_apiKey');
        APP.api.key = '';
        UI.updateState();
      },
      endpoints: {
        upload: 'https://api.nodeimage.com/api/upload',
        apiKey: 'https://api.nodeimage.com/api/user/api-key'
      }
    },
    site: {
      url: 'https://www.nodeimage.com'
    },
    storage: {
      keys: {
        loginCheck: 'nodeimage_login_check',
        loginStatus: 'nodeimage_login_status',
        logout: 'nodeimage_logout'
      },
      get: key => localStorage.getItem(APP.storage.keys[key]),
      set: (key, value) => localStorage.setItem(APP.storage.keys[key], value),
      remove: key => localStorage.removeItem(APP.storage.keys[key])
    },
    retry: {
      max: 2,
      delay: 1000
    },
    statusTimeout: 2000,
    auth: {
      recentLoginGracePeriod: 30000,
      loginCheckInterval: 3000,
      loginCheckTimeout: 300000
    }
  };

  // ===== DOM选择器 (DOM Selectors) =====
  const SELECTORS = {
    editor: '.CodeMirror',
    toolbar: '.mde-toolbar',
    imgBtn: '.toolbar-item.i-icon.i-icon-pic[title="图片"]',
    container: '#nodeimage-toolbar-container'
  };

  // ===== 状态常量 (Status Constants) =====
  const STATUS = {
    SUCCESS: { class: 'success', color: '#42d392' },
    ERROR: { class: 'error', color: '#f56c6c' },
    WARNING: { class: 'warning', color: '#e6a23c' },
    INFO: { class: 'info', color: '#0078ff' }
  };

  const MESSAGE = {
    READY: 'NodeImage已就绪',
    UPLOADING: '正在上传...',
    UPLOAD_SUCCESS: '上传成功！',
    CONVERTING: '正在处理图片...',
    LOGIN_EXPIRED: '登录已失效',
    LOGOUT: '已退出登录',
    RETRY: (current, max) => `重试上传 (${current}/${max})`
  };

  // ===== DOM缓存 (DOM Cache) =====
  const DOM = {
    editor: null,
    statusElements: new Set(),
    loginButtons: new Set(),
    settingsButton: null,
    getEditor: () => DOM.editor?.CodeMirror
  };

  // ===== 全局样式 (Global Styles) =====
  GM_addStyle(`
    #nodeimage-status {
      margin-left: 10px;
      display: inline-block;
      font-size: 14px;
      height: 28px;
      line-height: 28px;
      transition: all 0.3s ease;
    }
    #nodeimage-status.success { color: ${STATUS.SUCCESS.color}; }
    #nodeimage-status.error { color: ${STATUS.ERROR.color}; }
    #nodeimage-status.warning { color: ${STATUS.WARNING.color}; }
    #nodeimage-status.info { color: ${STATUS.INFO.color}; }

    .nodeimage-login-btn {
      cursor: pointer;
      margin-left: 10px;
      color: ${STATUS.WARNING.color};
      font-size: 14px;
      background: rgba(230, 162, 60, 0.1);
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid rgba(230, 162, 60, 0.2);
    }

    .nodeimage-toolbar-container {
      display: flex;
      align-items: center;
      margin-left: 10px;
    }
  `);

  // ===== 工具函数 (Utility Functions) =====
  const Utils = {
    isNodeImageSite: () => /^(.*\.)?nodeimage\.com$/.test(window.location.hostname),
    waitForElement: selector => new Promise(res => {
      const el = document.querySelector(selector);
      if (el) return res(el);
      new MutationObserver((_, o) => {
        const found = document.querySelector(selector);
        if (found) { o.disconnect(); res(found); }
      }).observe(document.body, { childList: true, subtree: true });
    }),
    isEditingInEditor: () => {
      const a = document.activeElement;
      return a && (a.classList.contains('CodeMirror') || a.closest('.CodeMirror') || a.tagName === 'TEXTAREA');
    },
    createFileInput: cb => {
      const i = Object.assign(document.createElement('input'), { type: 'file', multiple: true, accept: 'image/*' });
      i.onchange = e => cb([...e.target.files]);
      i.click();
    },
    delay: ms => new Promise(r => setTimeout(r, ms))
  };

  // ===== API通信 (API Communication) =====
  const API = {
    // Safari修复: 使用原生fetch替代GM_xmlhttpRequest,避免CORS问题
    request: async ({ url, method = 'GET', data = null, headers = {}, withAuth = false }) => {
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      // Safari使用原生fetch
      if (isSafari) {
        const fetchHeaders = {
          'Accept': 'application/json',
          ...(withAuth && APP.api.key ? { 'X-API-Key': APP.api.key } : {}),
          ...headers
        };
        
        const fetchOptions = {
          method,
          headers: fetchHeaders,
          credentials: 'omit', // Safari的CORS问题关键:不发送凭证
        };
        
        if (data) {
          fetchOptions.body = data;
        }
        
        try {
          const response = await fetch(url, fetchOptions);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          const result = await response.json();
          return result;
        } catch (error) {
          console.error('[NodeImage] Fetch错误:', error);
          throw error;
        }
      }
      
      // 非Safari继续使用GM_xmlhttpRequest
      return new Promise((resolve, reject) => {
        const chromeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
        
        GM_xmlhttpRequest({
          method,
          url,
          headers: {
            'Accept': 'application/json',
            'User-Agent': chromeUA,
            ...(withAuth && APP.api.key ? { 'X-API-Key': APP.api.key } : {}),
            ...headers
          },
          data,
          withCredentials: true,
          responseType: 'json',
          onload: response => {
            if (response.status === 200 && response.response) {
              resolve(response.response);
            } else {
              reject(response);
            }
          },
          onerror: reject
        });
      });
    },

    // Safari修复: 优先使用已存储的API Key
    checkLoginAndGetKey: async () => {
      // 如果已有API Key,先验证其有效性
      if (APP.api.key) {
        try {
          const testResponse = await API.request({ 
            url: APP.api.endpoints.apiKey,
            withAuth: true
          });
          
          if (testResponse.api_key) {
            // 更新为最新的key(如果服务器返回了新的)
            if (testResponse.api_key !== APP.api.key) {
              APP.api.setKey(testResponse.api_key);
            }
            return true;
          }
        } catch (error) {
          console.log('[NodeImage] 已存储的API Key验证失败,尝试Cookie方式');
        }
      }
      
      // 尝试通过Cookie获取
      try {
        const response = await API.request({ url: APP.api.endpoints.apiKey });
        if (response.api_key) {
          APP.api.setKey(response.api_key);
          return true;
        }
        if (response.error) {
          APP.api.clearKey();
        }
        return false;
      } catch (error) {
        console.warn('[NodeImage] Cookie方式获取失败(Safari常见问题):', error);
        
        // Safari修复: 如果已有key但验证失败,保持key不变,可能只是网络问题
        if (APP.api.key) {
          console.log('[NodeImage] 保留已存储的API Key,将在上传时验证');
          return true;
        }
        
        return false;
      }
    },

    uploadImage: async (file, retries = 0) => {
      try {
        // Safari修复: 确保文件完整性
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        let uploadFile = file;
        
        if (isSafari) {
          console.log('[NodeImage] Safari上传前检查:', {
            name: file.name,
            type: file.type,
            size: file.size
          });
          
          // 如果文件没有正确的type,重新读取并构建
          if (!file.type || file.size === 0) {
            console.warn('[NodeImage] 文件信息异常,尝试重建');
            const arrayBuffer = await file.arrayBuffer();
            const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
            
            let fileName = file.name || `image-${Date.now()}.jpg`;
            if (!fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
              fileName = `${fileName}.jpg`;
            }
            
            uploadFile = new File([blob], fileName, { 
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            
            console.log('[NodeImage] 重建后文件:', {
              name: uploadFile.name,
              type: uploadFile.type,
              size: uploadFile.size
            });
          }
        }
        
        const formData = new FormData();
        formData.append('image', uploadFile);
        
        console.log('[NodeImage] 开始上传...');
        
        const result = await API.request({
          url: APP.api.endpoints.upload,
          method: 'POST',
          data: formData,
          withAuth: true
        });
        
        console.log('[NodeImage] 上传响应:', result);
        
        if (result.success) {
          return {
            url: result.links.direct,
            markdown: result.links.markdown
          };
        } else {
          const errorMsg = result.error || '未知错误';
          console.error('[NodeImage] 上传失败:', errorMsg);
          
          if (errorMsg.toLowerCase().match(/unauthorized|invalid api key|未授权|无效的api密钥/)) {
            APP.api.clearKey();
            throw new Error(MESSAGE.LOGIN_EXPIRED);
          }
          throw new Error(errorMsg);
        }
      } catch (error) {
        console.error('[NodeImage] 上传异常:', error);
        
        if (error.status === 401 || error.status === 403) {
          APP.api.clearKey();
          throw new Error(MESSAGE.LOGIN_EXPIRED);
        }
        if (retries < APP.retry.max) {
          setStatus(STATUS.WARNING.class, MESSAGE.RETRY(retries + 1, APP.retry.max));
          await Utils.delay(APP.retry.delay);
          return API.uploadImage(file, retries + 1);
        }
        throw error instanceof Error ? error : new Error(String(error));
      }
    }
  };

  // ===== UI与状态管理 (UI & Status Management) =====
  const setStatus = (cls, msg, ttl = 0) => {
    DOM.statusElements.forEach(el => { el.className = cls; el.textContent = msg; });
    if (ttl) return Utils.delay(ttl).then(UI.updateState);
  };

  const UI = {
    updateState: () => {
      const isLoggedIn = Boolean(APP.api.key);
      DOM.loginButtons.forEach(btn => {
        btn.style.display = isLoggedIn ? 'none' : 'inline-block';
      });
      DOM.statusElements.forEach(el => {
        if (isLoggedIn) {
          el.className = STATUS.SUCCESS.class;
          el.textContent = MESSAGE.READY;
        } else {
          el.textContent = '';
        }
      });
    },

    openLogin: () => {
      // Safari修复: 提供两种登录方式
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      if (isSafari) {
        const choice = confirm(
          'Safari用户请选择登录方式:\n\n' +
          '点击"确定" - 手动输入API Key(推荐)\n' +
          '点击"取消" - 打开NodeImage网站\n\n' +
          '获取API Key: www.nodeimage.com → API'
        );
        
        if (choice) {
          UI.manualSetApiKey();
        } else {
          APP.storage.set('loginStatus', 'login_pending');
          window.open(APP.site.url, '_blank');
        }
      } else {
        APP.storage.set('loginStatus', 'login_pending');
        window.open(APP.site.url, '_blank');
      }
    },

    manualSetApiKey: () => {
      const apiKey = prompt(
        '请输入NodeImage API Key:\n\n' +
        '1. 访问 www.nodeimage.com\n' +
        '2. 点击 API 并复制你的 API Key\n' +
        '3. 粘贴到下方输入框\n\n' +
        '提示: API Key会安全保存在本地,不会上传'
      );
      
      if (apiKey && apiKey.trim().length > 20) {
        APP.api.setKey(apiKey.trim());
        setStatus(STATUS.SUCCESS.class, '✓ API Key已设置', 2000);
      } else if (apiKey !== null) {
        alert('API Key格式不正确,请重试');
      }
    },

    setupToolbar: toolbar => {
      if (!toolbar || toolbar.querySelector(SELECTORS.container)) return;

      const container = document.createElement('div');
      container.id = 'nodeimage-toolbar-container';
      container.className = 'nodeimage-toolbar-container';
      toolbar.appendChild(container);

      const imgBtn = toolbar.querySelector(SELECTORS.imgBtn);
      if (imgBtn) {
        const newBtn = imgBtn.cloneNode(true);
        imgBtn.parentNode.replaceChild(newBtn, imgBtn);
        newBtn.addEventListener('click', async () => {
          if (!APP.api.key || !(await Auth.checkLoginIfNeeded())) {
            UI.openLogin();
            return;
          }
          Utils.createFileInput(ImageHandler.handleFiles);
        });
      }

      const statusEl = document.createElement('div');
      statusEl.id = 'nodeimage-status';
      statusEl.className = STATUS.INFO.class;
      container.appendChild(statusEl);
      DOM.statusElements.add(statusEl);

      const loginBtn = document.createElement('div');
      loginBtn.className = 'nodeimage-login-btn';
      loginBtn.textContent = '点击设置API Key';
      loginBtn.addEventListener('click', UI.openLogin);
      loginBtn.style.display = 'none';
      container.appendChild(loginBtn);
      DOM.loginButtons.add(loginBtn);

      // 添加设置按钮(已登录后也可修改API Key)
      const settingsBtn = document.createElement('div');
      settingsBtn.className = 'nodeimage-login-btn';
      settingsBtn.textContent = '⚙️';
      settingsBtn.title = '重新设置API Key';
      settingsBtn.style.marginLeft = '5px';
      settingsBtn.style.padding = '3px 6px';
      settingsBtn.style.display = APP.api.key ? 'inline-block' : 'none';
      settingsBtn.addEventListener('click', () => {
        if (confirm('确定要重新设置API Key吗?')) {
          UI.manualSetApiKey();
        }
      });
      container.appendChild(settingsBtn);
      // 修复: 设置按钮不应该加入statusElements,而是单独管理
      DOM.settingsButton = settingsBtn;

      UI.updateState();
    }
  };

  // ===== 图片处理 (Image Handling) =====
  const ImageHandler = {
    // Safari修复: 转换为标准JPEG - 与测试代码完全一致的逻辑
    convertToStandardImage: async (file) => {
      return new Promise((resolve, reject) => {
        console.log('[NodeImage] 开始转换图片:', file.name, file.type, file.size);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = async () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              
              // 填充白色背景(防止PNG透明度问题)
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
              
              // 使用Promise包装toBlob,确保等待完成
              const blob = await new Promise(blobResolve => {
                canvas.toBlob(blobResolve, 'image/jpeg', 0.92);
              });
              
              if (blob) {
                // 生成标准的文件名
                let fileName = file.name || `image-${Date.now()}.jpg`;
                fileName = fileName.replace(/\.[^.]+$/, '.jpg');
                
                const newFile = new File([blob], fileName, { 
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                
                console.log('[NodeImage] 转换成功:', newFile.name, newFile.type, newFile.size);
                resolve(newFile);
              } else {
                reject(new Error('Blob生成失败'));
              }
            } catch (err) {
              reject(err);
            }
          };
          img.onerror = () => reject(new Error('图片加载失败'));
          img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsDataURL(file);
      });
    },

    handlePaste: async e => {
      if (!Utils.isEditingInEditor()) return;

      const dt = e.clipboardData || e.originalEvent?.clipboardData;
      if (!dt) return;

      let files = [];

      if (dt.files && dt.files.length) {
        files = Array.from(dt.files).filter(f => f.type.startsWith('image/'));
      } else if (dt.items && dt.items.length) {
        files = Array.from(dt.items)
          .filter(i => i.kind === 'file' && i.type.startsWith('image/'))
          .map(i => i.getAsFile())
          .filter(Boolean);
      }

      if (files.length) {
        e.preventDefault();
        e.stopPropagation();

        if (!APP.api.key) {
          UI.openLogin();
          return;
        }

        // Safari修复: 无条件转换所有图片为标准JPEG
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (isSafari) {
          console.log('[NodeImage] Safari环境,强制转换图片格式');
          setStatus(STATUS.INFO.class, '正在处理图片...');
          
          try {
            const convertedFiles = await Promise.all(
              files.map(file => ImageHandler.convertToStandardImage(file))
            );
            ImageHandler.handleFiles(convertedFiles);
          } catch (error) {
            console.error('[NodeImage] 图片转换失败:', error);
            setStatus(STATUS.ERROR.class, '图片格式转换失败: ' + error.message, APP.statusTimeout);
          }
        } else {
          ImageHandler.handleFiles(files);
        }
      }
    },

    handleFiles: files => {
      if (!APP.api.key) {
        UI.openLogin();
        return;
      }

      files.filter(file => file?.type.startsWith('image/'))
        .forEach(ImageHandler.uploadAndInsert);
    },

    uploadAndInsert: async file => {
      setStatus(STATUS.INFO.class, MESSAGE.UPLOADING);

      try {
        const result = await API.uploadImage(file);
        ImageHandler.insertMarkdown(result.markdown);

        await setStatus(STATUS.SUCCESS.class, MESSAGE.UPLOAD_SUCCESS, APP.statusTimeout);
      } catch (error) {
        if (error.message === MESSAGE.LOGIN_EXPIRED) {
          await Auth.checkLoginIfNeeded(true);
        }

        const errorMessage = `上传失败: ${error.message}`;
        console.error('[NodeImage]', error);

        await setStatus(STATUS.ERROR.class, errorMessage, APP.statusTimeout);
      }
    },

    insertMarkdown: markdown => {
      const cm = DOM.getEditor();
      if (cm) {
        const cursor = cm.getCursor();
        cm.replaceRange(`\n${markdown}\n`, cursor);
      }
    }
  };

  // ===== 认证管理 (Authentication Management) =====
  const Auth = {
    checkLoginIfNeeded: async (forceCheck = false) => {
      if (APP.api.key && !forceCheck) {
        return true;
      }

      const isLoggedIn = await API.checkLoginAndGetKey();

      if (!isLoggedIn && APP.api.key) {
        setStatus(STATUS.WARNING.class, MESSAGE.LOGIN_EXPIRED);
      }

      UI.updateState();

      return isLoggedIn;
    },

    checkLogoutFlag: () => {
      if (APP.storage.get('logout') === 'true') {
        APP.api.clearKey();
        APP.storage.remove('logout');
        setStatus(STATUS.WARNING.class, MESSAGE.LOGOUT);
      }
    },

    checkRecentLogin: async () => {
      const lastLoginCheck = APP.storage.get('loginCheck');
      if (lastLoginCheck && (Date.now() - parseInt(lastLoginCheck) < APP.auth.recentLoginGracePeriod)) {
        await API.checkLoginAndGetKey();
        APP.storage.remove('loginCheck');
      }
    },

    setupStorageListener: () => {
      window.addEventListener('storage', event => {
        const { loginStatus, logout } = APP.storage.keys;

        if (event.key === loginStatus && event.newValue === 'login_success') {
          API.checkLoginAndGetKey();
          localStorage.removeItem(loginStatus);
        } else if (event.key === logout && event.newValue === 'true') {
          APP.api.clearKey();
          localStorage.removeItem(logout);
        }
      });
    },

    monitorLogout: () => {
      document.addEventListener('click', e => {
        const logoutButton = e.target.closest('#logoutBtn, .logout-btn');
        if (logoutButton || e.target.textContent?.match(/登出|注销|退出|logout|sign out/i)) {
          APP.storage.set('logout', 'true');
        }
      });
    },

    startLoginStatusCheck: () => {
      const checkLoginInterval = setInterval(async () => {
        try {
          const isLoggedIn = await API.checkLoginAndGetKey();

          if (isLoggedIn) {
            clearInterval(checkLoginInterval);

            APP.storage.remove('loginStatus');
            APP.storage.set('loginStatus', 'login_success');
            APP.storage.set('loginCheck', Date.now().toString());
          }
        } catch (error) {}
      }, APP.auth.loginCheckInterval);

      setTimeout(() => clearInterval(checkLoginInterval), APP.auth.loginCheckTimeout);
    },

    handleNodeImageSite: () => {
      if (['/login', '/register', '/'].includes(window.location.pathname)) {
        const loginForm = document.querySelector('form');
        if (loginForm) {
          loginForm.addEventListener('submit', () => {
            APP.storage.set('loginStatus', 'login_pending');
          });
        }

        if (APP.storage.get('loginStatus') === 'login_pending') {
          Auth.startLoginStatusCheck();
        }
      } else if (APP.storage.get('loginStatus') === 'login_pending') {
        Auth.checkLoginIfNeeded(true);
      }

      Auth.monitorLogout();
    }
  };

  // ===== 初始化 (Initialization) =====
  const init = async () => {
    if (Utils.isNodeImageSite()) {
      Auth.handleNodeImageSite();
      return;
    }

    // Safari修复: 初始化时确保API Key已设置
    if (!APP.api.key) {
      console.warn('[NodeImage] 未找到API Key,已使用默认值');
    }

    document.addEventListener('paste', ImageHandler.handlePaste);
    window.addEventListener('focus', () => Auth.checkLoginIfNeeded());

    Utils.waitForElement(SELECTORS.editor).then(editor => {
      DOM.editor = editor;

      editor.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      });

      editor.addEventListener('drop', e => {
        e.preventDefault();
        ImageHandler.handleFiles(Array.from(e.dataTransfer.files));
      });
    });

    Utils.waitForElement(SELECTORS.toolbar).then(UI.setupToolbar);

    const observer = new MutationObserver(() => {
      const toolbar = document.querySelector(SELECTORS.toolbar);
      if (toolbar && !toolbar.querySelector(SELECTORS.container)) {
        UI.setupToolbar(toolbar);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    document.addEventListener('click', e => {
      if (e.target.closest('.tab-option')) {
        setTimeout(() => {
          const toolbar = document.querySelector(SELECTORS.toolbar);
          if (toolbar && !toolbar.querySelector(SELECTORS.container)) {
            UI.setupToolbar(toolbar);
          }
        }, 100);
      }
    });

    Auth.checkLogoutFlag();
    Auth.setupStorageListener();
    await Auth.checkRecentLogin();
    await Auth.checkLoginIfNeeded();
  };

  window.addEventListener('load', init);
})();