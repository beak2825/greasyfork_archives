// ==UserScript==
// @name         Yandex自动翻译
// @namespace    https://viayoo.com/
// @version      2.3
// @description  Yandex自动翻译小部件 | 自动翻译所有网站 | 简化界面 | 使用Ctrl+Shift+Y切换 | 增强俄语支持
// @author       You
// @run-at       document-start
// @match        https://*/*
// @match        http://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/561557/Yandex%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/561557/Yandex%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  // 脚本配置
  const CONFIG = {
    widgetId: 'ytWidget',
    storageKey: 'yandex_widget_enabled',
    whitelistKey: 'yandex_whitelist',
    defaultEnabled: false,
    hotkey: 'Ctrl+Shift+Y',
    // 俄语域名后缀
    russianDomains: ['.ru', '.рф', '.su', '.by', '.kz', '.ua', '.com.ru'],
    // 俄语关键词（用于检测俄语内容）
    russianKeywords: [
      'программы', 'андроид', 'скачать', 'русский', 'приложение',
      'софт', 'игры', 'утилиты', 'бесплатно', 'android'
    ]
  };
  
  // 脚本状态
  let widgetEnabled = CONFIG.defaultEnabled;
  let isWhitelistedDomain = false;
  let mainMenuCommandId = null;
  let whitelistMenuCommandId = null;
  let manageWhitelistMenuCommandId = null;
  let widgetContainer = null;
  let yandexScript = null;
  let isModalOpen = false;
  let cachedWhitelist = null;
  let currentDomain = '';
  let isRussianSite = false;
  
  // 获取当前域名
  function getCurrentDomain() {
    return location.hostname;
  }
  
  // 检测是否为俄语网站
  function detectRussianSite() {
    currentDomain = getCurrentDomain();
    
    // 检查域名后缀
    for (const suffix of CONFIG.russianDomains) {
      if (currentDomain.includes(suffix)) {
        return true;
      }
    }
    
    // 检查页面语言
    const htmlLang = document.documentElement.lang;
    if (htmlLang && (htmlLang.startsWith('ru') || htmlLang.startsWith('RU'))) {
      return true;
    }
    
    // 检查meta语言标签
    const metaLang = document.querySelector('meta[http-equiv="Content-Language"]');
    if (metaLang && (metaLang.content.startsWith('ru') || metaLang.content.startsWith('RU'))) {
      return true;
    }
    
    // 检查内容中的俄语关键词
    const bodyText = document.body ? document.body.textContent.toLowerCase() : '';
    for (const keyword of CONFIG.russianKeywords) {
      if (bodyText.includes(keyword.toLowerCase())) {
        return true;
      }
    }
    
    return false;
  }
  
  // 获取白名单（带缓存）
  function getWhitelist() {
    if (cachedWhitelist !== null) {
      return cachedWhitelist;
    }
    
    const whitelistStr = GM_getValue(CONFIG.whitelistKey, '[]');
    try {
      cachedWhitelist = JSON.parse(whitelistStr);
    } catch (e) {
      cachedWhitelist = [];
    }
    return cachedWhitelist;
  }
  
  // 保存白名单（更新缓存）
  function saveWhitelist(whitelist) {
    cachedWhitelist = whitelist;
    GM_setValue(CONFIG.whitelistKey, JSON.stringify(whitelist));
  }
  
  // 检查当前域名是否在白名单中
  function checkWhitelist() {
    const currentDomain = getCurrentDomain();
    const whitelist = getWhitelist();
    isWhitelistedDomain = whitelist.includes(currentDomain);
    return isWhitelistedDomain;
  }
  
  // 切换当前域名的白名单状态
  function toggleWhitelist() {
    const currentDomain = getCurrentDomain();
    let whitelist = getWhitelist();
    
    if (whitelist.includes(currentDomain)) {
      // 从白名单中移除
      whitelist = whitelist.filter(domain => domain !== currentDomain);
      showStatusMessage(`已从白名单中移除: ${currentDomain}`);
    } else {
      // 添加到白名单
      whitelist.push(currentDomain);
      showStatusMessage(`已添加到白名单: ${currentDomain}`);
    }
    
    saveWhitelist(whitelist);
    
    // 重新检查白名单状态
    checkWhitelist();
    
    // 重新注册菜单
    registerMenuCommands();
  }
  
  // 管理白名单（查看、单独删除和清除）
  function manageWhitelist() {
    const whitelist = getWhitelist();
    
    if (whitelist.length === 0) {
      alert('白名单为空');
      return;
    }
    
    // 设置模态框打开状态
    isModalOpen = true;
    
    // 创建模态框
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 2147483647;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: Arial, sans-serif;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    
    // 标题
    const title = document.createElement('h3');
    title.textContent = `白名单管理 (${whitelist.length}个域名)`;
    title.style.cssText = `
      margin-top: 0;
      margin-bottom: 20px;
      color: #333;
      text-align: center;
    `;
    modalContent.appendChild(title);
    
    // 域名列表
    const listContainer = document.createElement('div');
    listContainer.style.cssText = `
      margin-bottom: 20px;
      max-height: 300px;
      overflow-y: auto;
    `;
    
    whitelist.forEach((domain, index) => {
      const domainItem = document.createElement('div');
      domainItem.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: ${index % 2 === 0 ? '#f5f5f5' : 'white'};
        border-radius: 4px;
        margin-bottom: 5px;
      `;
      
      const domainText = document.createElement('span');
      domainText.textContent = domain;
      domainText.style.cssText = `
        flex-grow: 1;
        word-break: break-all;
      `;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '删除';
      deleteBtn.style.cssText = `
        background-color: #ff4757;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        margin-left: 10px;
        flex-shrink: 0;
        min-width: 50px;
      `;
      
      deleteBtn.addEventListener('click', function() {
        if (confirm(`确定要从白名单中删除 "${domain}" 吗？`)) {
          let updatedWhitelist = getWhitelist();
          updatedWhitelist = updatedWhitelist.filter(d => d !== domain);
          saveWhitelist(updatedWhitelist);
          
          showStatusMessage(`已从白名单中删除: ${domain}`);
          
          // 关闭模态框并重新打开
          document.body.removeChild(modal);
          setTimeout(manageWhitelist, 100);
        }
      });
      
      domainItem.appendChild(domainText);
      domainItem.appendChild(deleteBtn);
      listContainer.appendChild(domainItem);
    });
    
    modalContent.appendChild(listContainer);
    
    // 按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    `;
    
    // 清除所有按钮
    const clearAllBtn = document.createElement('button');
    clearAllBtn.textContent = '清除所有白名单';
    clearAllBtn.style.cssText = `
      background-color: #ffa502;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      flex: 1;
      margin-right: 10px;
    `;
    
    clearAllBtn.addEventListener('click', function() {
      if (confirm(`确定要清除所有 ${whitelist.length} 个白名单域名吗？`)) {
        cachedWhitelist = [];
        GM_deleteValue(CONFIG.whitelistKey);
        showStatusMessage('已清除所有白名单');
        document.body.removeChild(modal);
        
        // 重新检查白名单并更新
        setTimeout(function() {
          checkWhitelist();
          registerMenuCommands();
        }, 100);
      }
    });
    
    // 关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    closeBtn.style.cssText = `
      background-color: #747d8c;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      flex: 1;
      margin-left: 10px;
    `;
    
    closeBtn.addEventListener('click', function() {
      document.body.removeChild(modal);
      isModalOpen = false;
    });
    
    buttonContainer.appendChild(clearAllBtn);
    buttonContainer.appendChild(closeBtn);
    modalContent.appendChild(buttonContainer);
    
    modal.appendChild(modalContent);
    
    // 点击模态框背景关闭
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        document.body.removeChild(modal);
        isModalOpen = false;
      }
    });
    
    // ESC键关闭模态框
    const escHandler = function(e) {
      if (e.key === 'Escape') {
        document.body.removeChild(modal);
        document.removeEventListener('keydown', escHandler);
        isModalOpen = false;
      }
    };
    document.addEventListener('keydown', escHandler);
    
    document.body.appendChild(modal);
  }
  
  // 初始化函数
  function init() {
    // 从存储中读取状态，如果没有保存过则使用默认值false
    const savedState = GM_getValue(CONFIG.storageKey, CONFIG.defaultEnabled);
    widgetEnabled = savedState;
    
    // 检测是否为俄语网站
    isRussianSite = detectRussianSite();
    
    // 检查当前域名是否在白名单中
    checkWhitelist();
    
    // 注册菜单命令
    registerMenuCommands();
    
    // 设置键盘快捷键
    setupHotkey();
    
    // 根据状态初始化小部件
    updateWidgetBasedOnSettings();
    
    // 新安装提示
    if (GM_getValue('firstRun', true)) {
      setTimeout(function() {
        showStatusMessage('Yandex自动翻译已安装，默认关闭。按Ctrl+Shift+Y开启');
        GM_setValue('firstRun', false);
      }, 1000);
    }
    
    // 已移除俄语网站检测提示
  }
  
  // 根据设置更新小部件
  function updateWidgetBasedOnSettings() {
    // 白名单域名始终显示小部件，不受主开关影响
    const shouldShowWidget = isWhitelistedDomain || widgetEnabled;
    
    if (shouldShowWidget && !widgetContainer) {
      createWidget();
    } else if (!shouldShowWidget && widgetContainer) {
      removeWidget();
    }
  }
  
  // 注册菜单命令
  function registerMenuCommands() {
    // 注销所有之前注册的菜单
    [mainMenuCommandId, whitelistMenuCommandId, manageWhitelistMenuCommandId].forEach(function(id) {
      if (id !== null) {
        try { GM_unregisterMenuCommand(id); } catch (e) {}
      }
    });
    
    // 重置ID
    mainMenuCommandId = null;
    whitelistMenuCommandId = null;
    manageWhitelistMenuCommandId = null;
    
    // 注册主开关菜单（永远在第一位）
    let mainMenuText = widgetEnabled ? 
      '❌ 关闭Yandex自动翻译' : 
      '✅ 开启Yandex自动翻译';
    
    // 如果是俄语网站，添加标识
    if (isRussianSite) {
      mainMenuText += ' 🇷🇺';
    }
    
    mainMenuCommandId = GM_registerMenuCommand(mainMenuText, toggleWidget, 't');
    
    // 注册白名单切换菜单（第二位）
    const currentDomain = getCurrentDomain();
    const whitelist = getWhitelist();
    const isInWhitelist = whitelist.includes(currentDomain);
    
    const whitelistText = isInWhitelist ? 
      `⭐ 从白名单中移除: ${currentDomain}` : 
      `☆ 添加到白名单: ${currentDomain}`;
    
    whitelistMenuCommandId = GM_registerMenuCommand(whitelistText, toggleWhitelist, 'a');
    
    // 注册管理白名单菜单（第三位）
    manageWhitelistMenuCommandId = GM_registerMenuCommand('📋 管理白名单', manageWhitelist, 'w');
  }
  
  // 设置键盘快捷键
  function setupHotkey() {
    document.addEventListener('keydown', function(e) {
      // 如果模态框打开，不响应快捷键
      if (isModalOpen) return;
      
      // Ctrl+Shift+Y - 切换主开关
      if (e.ctrlKey && e.shiftKey && e.key === 'Y') {
        e.preventDefault();
        toggleWidget();
      }
      
      // Ctrl+Shift+W - 切换白名单状态
      if (e.ctrlKey && e.shiftKey && e.key === 'W') {
        e.preventDefault();
        toggleWhitelist();
      }
      
      // Ctrl+Shift+R - 快速添加到俄语网站白名单
      if (isRussianSite && e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        toggleWhitelist();
      }
    }, true);
  }
  
  // 创建小部件
  function createWidget() {
    if (widgetContainer) {
      return; // 已存在
    }
    
    // 等待body加载
    if (!document.body) {
      setTimeout(createWidget, 100);
      return;
    }
    
    // 创建容器
    widgetContainer = document.createElement("div");
    widgetContainer.id = CONFIG.widgetId;
    widgetContainer.className = "yandex-translate-widget";
    
    // 添加自定义CSS，简化Yandex小部件界面
    const style = document.createElement("style");
    style.textContent = `
      /* 隐藏复杂的Yandex小部件界面 */
      #${CONFIG.widgetId} iframe {
        width: 200px !important;
        height: 60px !important;
        border: none !important;
        border-radius: 8px !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
        overflow: hidden !important;
      }
      
      /* 简化Yandex小部件内部的样式 */
      .yandex-translate-widget {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        z-index: 2147483646 !important;
        pointer-events: auto !important;
      }
      
      /* 移动设备适配 */
      @media (max-width: 768px) {
        .yandex-translate-widget {
          bottom: 10px !important;
          right: 10px !important;
        }
        
        #${CONFIG.widgetId} iframe {
          width: 180px !important;
          height: 50px !important;
        }
      }
      
      /* 在Yandex小部件加载后，隐藏复杂的元素 */
      #${CONFIG.widgetId} [style*="background-color"],
      #${CONFIG.widgetId} [style*="border-radius: 16px"],
      #${CONFIG.widgetId} [style*="box-shadow"] {
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }
      
      /* 针对俄语网站的额外样式 */
      .russian-site-widget #${CONFIG.widgetId} iframe {
        width: 220px !important;
        height: 70px !important;
      }
    `;
    document.head.appendChild(style);
    
    // 如果是俄语网站，添加特殊类名
    if (isRussianSite) {
      widgetContainer.classList.add('russian-site-widget');
    }
    
    // 添加到页面
    document.body.appendChild(widgetContainer);
    
    // 加载Yandex脚本（使用自动翻译模式）
    loadYandexScript();
    
    console.log(`Yandex自动翻译已启用${isWhitelistedDomain ? ' (白名单强制)' : ''}${isRussianSite ? ' (俄语网站优化)' : ''}`);
  }
  
  // 加载Yandex脚本
  function loadYandexScript() {
    // 避免重复加载
    if (yandexScript || window.YandexTranslateWidgetLoaded) {
      return;
    }
    
    yandexScript = document.createElement("script");
    
    // 根据网站类型选择不同的翻译设置
    let widgetParams = `widgetId=${CONFIG.widgetId}&widgetTheme=minimal&autoMode=true`;
    
    if (isRussianSite) {
      // 对于俄语网站，设置源语言为俄语，目标语言为中文
      widgetParams = `widgetId=${CONFIG.widgetId}&pageLang=ru&widgetLang=zh&widgetTheme=minimal&autoMode=true`;
    } else {
      // 对于其他网站，使用自动检测
      widgetParams = `widgetId=${CONFIG.widgetId}&pageLang=auto&widgetLang=zh&widgetTheme=minimal&autoMode=true`;
    }
    
    yandexScript.src = `https://translate.yandex.net/website-widget/v1/widget.js?${widgetParams}`;
    
    yandexScript.async = true;
    yandexScript.defer = true;
    
    yandexScript.onload = function() {
      window.YandexTranslateWidgetLoaded = true;
      console.log('Yandex自动翻译脚本加载成功');
      
      // 等待小部件完全加载后，进一步简化界面
      setTimeout(simplifyWidgetInterface, 2000);
      
      // 如果是俄语网站，添加额外的事件监听
      if (isRussianSite) {
        enhanceRussianSiteSupport();
      }
    };
    
    yandexScript.onerror = function() {
      console.warn('Yandex自动翻译脚本加载失败，尝试备用URL');
      window.YandexTranslateWidgetLoaded = false;
      loadYandexScriptFallback();
    };
    
    document.body.appendChild(yandexScript);
  }
  
  // 增强俄语网站支持
  function enhanceRussianSiteSupport() {
    console.log('增强俄语网站翻译支持');
    
    // 创建样式来优化俄语网站的翻译显示
    const russianStyle = document.createElement('style');
    russianStyle.textContent = `
      /* 优化俄语网站翻译后的文本显示 */
      .translated-text {
        font-family: Arial, "Helvetica Neue", Helvetica, sans-serif !important;
        line-height: 1.5 !important;
      }
      
      /* 确保翻译后的内容不会破坏布局 */
      [data-translated="true"] {
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
      }
      
      /* 针对俄语网站的特殊优化 */
      .russian-site-widget #${CONFIG.widgetId} {
        opacity: 0.95 !important;
      }
      
      .russian-site-widget #${CONFIG.widgetId}:hover {
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(russianStyle);
    
    // 监听页面变化，确保翻译效果持续
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.addedNodes.length > 0) {
            // 新节点添加到DOM时，可以检查是否需要重新触发翻译
            setTimeout(function() {
              if (window.Ya && window.Ya.translate && window.Ya.translate.Translator) {
                // 尝试重新翻译新内容
                window.Ya.translate.Translator.getInstance().translatePage();
              }
            }, 1000);
          }
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }
  
  // 备用加载方法
  function loadYandexScriptFallback() {
    yandexScript = document.createElement("script");
    
    // 使用相同的参数设置
    let widgetParams = `widgetId=${CONFIG.widgetId}&widgetTheme=minimal&autoMode=true`;
    
    if (isRussianSite) {
      widgetParams = `widgetId=${CONFIG.widgetId}&pageLang=ru&widgetLang=zh&widgetTheme=minimal&autoMode=true`;
    } else {
      widgetParams = `widgetId=${CONFIG.widgetId}&pageLang=auto&widgetLang=zh&widgetTheme=minimal&autoMode=true`;
    }
    
    yandexScript.src = `https://translate.yandex.com/website-widget/v1/widget.js?${widgetParams}`;
    yandexScript.async = true;
    yandexScript.defer = true;
    
    yandexScript.onload = function() {
      window.YandexTranslateWidgetLoaded = true;
      console.log('Yandex自动翻译脚本（备用）加载成功');
      setTimeout(simplifyWidgetInterface, 2000);
      
      if (isRussianSite) {
        enhanceRussianSiteSupport();
      }
    };
    
    document.body.appendChild(yandexScript);
  }
  
  // 简化Yandex小部件界面
  function simplifyWidgetInterface() {
    try {
      // 尝试查找Yandex小部件的iframe
      const iframe = document.querySelector(`#${CONFIG.widgetId} iframe`);
      if (iframe) {
        console.log('找到Yandex小部件iframe，开始简化界面');
        
        // 尝试简化小部件界面
        const additionalStyle = document.createElement("style");
        additionalStyle.textContent = `
          /* 隐藏复杂的界面元素 */
          #${CONFIG.widgetId} div,
          #${CONFIG.widgetId} span,
          #${CONFIG.widgetId} button {
            font-size: 12px !important;
          }
          
          /* 最小化界面 */
          #${CONFIG.widgetId} {
            min-width: 200px !important;
            max-width: 200px !important;
            min-height: 60px !important;
            max-height: 60px !important;
          }
          
          /* 隐藏不必要的装饰 */
          #${CONFIG.widgetId}::before,
          #${CONFIG.widgetId}::after {
            display: none !important;
          }
          
          /* 俄语网站的特殊优化 */
          .russian-site-widget #${CONFIG.widgetId} {
            min-width: 220px !important;
            max-width: 220px !important;
          }
        `;
        document.head.appendChild(additionalStyle);
      }
    } catch (e) {
      console.log('简化界面时出错:', e);
    }
  }
  
  // 移除小部件
  function removeWidget() {
    // 如果是白名单域名，不允许移除
    if (isWhitelistedDomain) {
      return;
    }
    
    if (widgetContainer && widgetContainer.parentNode) {
      widgetContainer.parentNode.removeChild(widgetContainer);
      widgetContainer = null;
    }
    
    // 移除Yandex脚本
    if (yandexScript && yandexScript.parentNode) {
      yandexScript.parentNode.removeChild(yandexScript);
      yandexScript = null;
    }
    
    // 重置加载状态
    window.YandexTranslateWidgetLoaded = false;
    
    console.log('Yandex自动翻译已禁用');
  }
  
  // 切换主开关
  function toggleWidget() {
    // 如果当前域名在白名单中，切换主开关状态但不影响白名单域名的翻译
    if (isWhitelistedDomain) {
      widgetEnabled = !widgetEnabled;
      GM_setValue(CONFIG.storageKey, widgetEnabled);
      showStatusMessage(widgetEnabled ? 'Yandex自动翻译已开启（白名单域名不受影响）' : 'Yandex自动翻译已关闭（白名单域名不受影响）');
    } else {
      widgetEnabled = !widgetEnabled;
      GM_setValue(CONFIG.storageKey, widgetEnabled);
      updateWidgetBasedOnSettings();
      showStatusMessage(widgetEnabled ? 'Yandex自动翻译已开启' : 'Yandex自动翻译已关闭');
    }
    
    // 重新注册菜单，确保顺序正确
    registerMenuCommands();
  }
  
  // 显示状态提示
  function showStatusMessage(message, duration = 3000) {
    // 移除现有的提示
    const existingMsg = document.getElementById('yandex-status-msg');
    if (existingMsg) {
      existingMsg.remove();
    }
    
    // 创建新提示
    const msgDiv = document.createElement('div');
    msgDiv.id = 'yandex-status-msg';
    msgDiv.textContent = message;
    msgDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 2147483647;
      font-family: Arial, sans-serif;
      font-size: 14px;
      transition: opacity 0.3s;
      pointer-events: none;
    `;
    
    // 如果是白名单相关提示，添加特殊样式
    if (message.includes('白名单')) {
      msgDiv.style.background = 'rgba(255, 193, 7, 0.9)';
      msgDiv.style.color = '#000';
    }
    
    // 如果是安装提示，使用不同颜色
    if (message.includes('已安装')) {
      msgDiv.style.background = 'rgba(33, 150, 243, 0.9)';
      msgDiv.style.color = 'white';
    }
    
    // 如果是删除提示，使用红色
    if (message.includes('删除')) {
      msgDiv.style.background = 'rgba(255, 71, 87, 0.9)';
      msgDiv.style.color = 'white';
    }
    
    document.body.appendChild(msgDiv);
    
    // 淡出
    setTimeout(function() {
      msgDiv.style.opacity = '0';
      setTimeout(function() {
        if (msgDiv.parentNode) {
          msgDiv.parentNode.removeChild(msgDiv);
        }
      }, 300);
    }, duration);
  }
  
  // 启动脚本
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();