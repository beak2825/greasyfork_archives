// ==UserScript==
// @name         Select2AI
// @name:zh-CN   Select2AI
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Display a blue dot after selecting the text, show a prompt menu when hovering, call on AI, and then complete the filling in.
// @description:zh-CN  划词后显示蓝色圆点，悬停显示提示词菜单，调用 AI 并回填。
// @author       easychen
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        window.close
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/553004/Select2AI.user.js
// @updateURL https://update.greasyfork.org/scripts/553004/Select2AI.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // === 多语言系统 ===
  const LANGUAGES = {
    zh: {
      // 默认提示词
      defaultPrompts: [
        { id: 1, name: '总结内容', text: '请帮我总结以下内容：\n{text}', enabled: true, downloadFile: false, fileExtension: 'txt' },
        { id: 2, name: '翻译成英文', text: '请将以下内容翻译为英文：\n{text}', enabled: true, downloadFile: false, fileExtension: 'txt' },
        { id: 3, name: '润色改进', text: '请帮我润色和改进以下文本，使其更专业、流畅，直接输出润色后的结果：\n{text}', enabled: true, downloadFile: false, fileExtension: 'txt' },
        { id: 4, name: '解释代码', text: '请解释以下代码的功能和逻辑：\n{text}', enabled: true, downloadFile: false, fileExtension: 'txt' },
        { id: 5, name: '整理为MD表格', text: '请将以下数据整理成 Markdown 表格格式，保持数据的完整性和结构：\n{text}', enabled: true, downloadFile: false, fileExtension: 'md' },
        { id: 6, name: '整理为CSV', text: '请将以下数据整理成 CSV 格式，用逗号分隔，第一行为标题行：\n{text}', enabled: true, downloadFile: false, fileExtension: 'csv' },
      ],
      // UI文本
      ui: {
        noPromptsEnabled: '⚠️ 未启用任何提示词，请在设置中配置。',
        pleaseSelectText: '⚠️ 请先选中文本',
        configureApiKey: '⚠️ 请先在油猴脚本菜单中配置 API Key！',
        processing: '⏳ [{name}] 处理中...',
        completedAndFilled: '✅ 已完成并回填到原位置！',
        completedAndFilledSimple: '✅ 已完成并回填！',
        copiedToClipboard: '✅ 结果已复制到剪贴板！\n\n{result}',
        copyFailed: '✅ 结果如下 (复制失败):\n\n{result}',
        failed: '❌ 失败: {error}',
        apiReturnEmpty: 'API 返回内容为空',
        settingsSaved: '✅ 设置已保存',
        promptUpdated: '✅ 提示词已更新',
        nameContentRequired: '⚠️ 名称和内容不能为空',
        confirmDelete: '确定删除?',
        // 设置面板
        aiSettings: '⚙️ AI 设置',
        apiEndpoint: 'API Endpoint (Base URL):',
        modelName: '模型名称 (Model):',
        apiKey: 'API Key:',
        managePrompts: '🧠 管理提示词',
        manageModels: '🤖 管理模型',
        save: '保存',
        close: '关闭',
        // 模型管理
        modelManagement: '🤖 模型管理',
        addModel: '➕ 新增模型',
        editModel: '✏️ 编辑模型',
        modelNameLabel: '模型名称：',
        setAsDefault: '设为默认',
        defaultModel: '默认模型',
        selectModel: '选择模型：',
        noModel: '无模型',
        // 提示词管理
        promptManagement: '🧠 提示词管理',
        promptPlaceholder: '使用 {text} 作为划词内容的占位符。',
        addNew: '➕ 新增',
        editPrompt: '✏️ 编辑提示词',
        addPrompt: '➕ 新增提示词',
        name: '名称：',
        promptContent: '提示词内容：',
        nameExample: '例如：翻译成英文',
        placeholderExample: '使用 {text} 作为占位符',
        cancel: '取消',
        edit: '编辑',
        clone: '复刻',
        delete: '删除',
        enableDisable: '启用/禁用',
        downloadFile: '下载为文件：',
        fileExtension: '文件扩展名：',
        fileExtensionPlaceholder: '例如：txt, md, csv',
        // 语言设置
        language: '界面语言:',
        languageAuto: '🌐 跟随系统',
        languageChinese: '🇨🇳 中文',
        languageEnglish: '🇺🇸 English',
        // 菜单命令
        menuSettings: '⚙️ AI 设置 & 提示词',
        menuRun: '🚀 {name}'
      }
    },
    en: {
      // 默认提示词
      defaultPrompts: [
        { id: 1, name: 'Summarize', text: 'Please summarize the following content:\n{text}', enabled: true, downloadFile: false, fileExtension: 'txt' },
        { id: 2, name: 'Translate to Chinese', text: 'Please translate the following content to Chinese:\n{text}', enabled: true, downloadFile: false, fileExtension: 'txt' },
        { id: 3, name: 'Polish & Improve', text: 'Please polish and improve the following text to make it more professional and fluent, output the polished result directly:\n{text}', enabled: true, downloadFile: false, fileExtension: 'txt' },
        { id: 4, name: 'Explain Code', text: 'Please explain the functionality and logic of the following code:\n{text}', enabled: true, downloadFile: false, fileExtension: 'txt' },
        { id: 5, name: 'To Markdown Table', text: 'Please organize the following data into a Markdown table format, maintaining data integrity and structure:\n{text}', enabled: true, downloadFile: false, fileExtension: 'md' },
        { id: 6, name: 'To CSV', text: 'Please organize the following data into CSV format, comma-separated with the first row as headers:\n{text}', enabled: true, downloadFile: false, fileExtension: 'csv' },
      ],
      // UI文本
      ui: {
        noPromptsEnabled: '⚠️ No prompts enabled. Please configure in settings.',
        pleaseSelectText: '⚠️ Please select text first',
        configureApiKey: '⚠️ Please configure API Key in Tampermonkey script menu first!',
        processing: '⏳ [{name}] Processing...',
        completedAndFilled: '✅ Completed and filled back to original position!',
        completedAndFilledSimple: '✅ Completed and filled back!',
        copiedToClipboard: '✅ Result copied to clipboard!\n\n{result}',
        copyFailed: '✅ Result (copy failed):\n\n{result}',
        failed: '❌ Failed: {error}',
        apiReturnEmpty: 'API returned empty content',
        settingsSaved: '✅ Settings saved',
        promptUpdated: '✅ Prompt updated',
        nameContentRequired: '⚠️ Name and content cannot be empty',
        confirmDelete: 'Confirm delete?',
        // 设置面板
        aiSettings: '⚙️ AI Settings',
        apiEndpoint: 'API Endpoint (Base URL):',
        modelName: 'Model Name:',
        apiKey: 'API Key:',
        managePrompts: '🧠 Manage Prompts',
        manageModels: '🤖 Manage Models',
        save: 'Save',
        close: 'Close',
        // 模型管理
        modelManagement: '🤖 Model Management',
        addModel: '➕ Add Model',
        editModel: '✏️ Edit Model',
        modelNameLabel: 'Model Name:',
        setAsDefault: 'Set as Default',
        defaultModel: 'Default Model',
        selectModel: 'Select Model:',
        noModel: 'No Model',
        // 提示词管理
        promptManagement: '🧠 Prompt Management',
        promptPlaceholder: 'Use {text} as placeholder for selected content.',
        addNew: '➕ Add New',
        editPrompt: '✏️ Edit Prompt',
        addPrompt: '➕ Add Prompt',
        name: 'Name:',
        promptContent: 'Prompt Content:',
        nameExample: 'e.g.: Translate to English',
        placeholderExample: 'Use {text} as placeholder',
        cancel: 'Cancel',
        edit: 'Edit',
        clone: 'Clone',
        delete: 'Delete',
        enableDisable: 'Enable/Disable',
        downloadFile: 'Download as File:',
        fileExtension: 'File Extension:',
        fileExtensionPlaceholder: 'e.g.: txt, md, csv',
        // Language Settings
        language: 'Language:',
        languageAuto: '🌐 System',
        languageChinese: '🇨🇳 中文',
        languageEnglish: '🇺🇸 English',
        // 菜单命令
        menuSettings: '⚙️ AI Settings & Prompts',
        menuRun: '🚀 {name}'
      }
    }
  };

  // 获取系统语言
  function getSystemLanguage() {
    const lang = navigator.language || navigator.userLanguage || 'en';
    return lang.startsWith('zh') ? 'zh' : 'en';
  }

  // 获取当前语言设置（支持手动设置）
  function getCurrentLanguage() {
    const savedLang = GM_getValue('user_language', '');
    if (savedLang && LANGUAGES[savedLang]) {
      return savedLang;
    }
    return GM_getValue('language', getSystemLanguage());
  }

  // 设置语言
  function setLanguage(lang) {
    if (LANGUAGES[lang]) {
      GM_setValue('user_language', lang);
      return true;
    }
    return false;
  }

  // 获取本地化文本
  function t(key, params = {}) {
    const lang = getCurrentLanguage();
    const langData = LANGUAGES[lang] || LANGUAGES.en;
    let text = langData.ui[key] || LANGUAGES.en.ui[key] || key;

    // 替换参数
    Object.keys(params).forEach(param => {
      text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
    });

    return text;
  }

  // 获取默认提示词
  function getDefaultPrompts() {
    const lang = getCurrentLanguage();
    return LANGUAGES[lang]?.defaultPrompts || LANGUAGES.en.defaultPrompts;
  }

  // === 默认配置 ===
  const DEFAULT_PROMPTS = getDefaultPrompts();

  // === 数据处理 ===
  function initDefaults() {
    // 兼容旧版本的单模型配置，迁移到多模型结构
    const oldEndpoint = GM_getValue('endpoint');
    const oldModel = GM_getValue('model');
    const oldApikey = GM_getValue('apikey');

    // 如果存在旧配置且没有新的models配置，则迁移
    if (oldEndpoint && !GM_getValue('models')) {
      const defaultModel = {
        id: 1,
        name: 'Default Model',
        endpoint: oldEndpoint,
        model: oldModel || 'gpt-3.5-turbo',
        apikey: oldApikey || '',
        isDefault: true
      };
      GM_setValue('models', JSON.stringify([defaultModel]));

      // 清理旧配置
      GM_deleteValue('endpoint');
      GM_deleteValue('model');
      GM_deleteValue('apikey');
    }

    // 如果没有任何模型配置，创建默认模型
    if (GM_getValue('models') === undefined) {
      const defaultModel = {
        id: 1,
        name: 'Default Model',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo',
        apikey: '',
        isDefault: true
      };
      GM_setValue('models', JSON.stringify([defaultModel]));
    }

    if (GM_getValue('prompts') === undefined) GM_setValue('prompts', JSON.stringify(DEFAULT_PROMPTS));
  }

  function getModels() {
    return JSON.parse(GM_getValue('models', '[]'));
  }

  function saveModels(models) {
    GM_setValue('models', JSON.stringify(models));
  }

  function getDefaultModel() {
    const models = getModels();
    return models.find(m => m.isDefault) || models[0] || null;
  }

  function getModelById(id) {
    const models = getModels();
    return models.find(m => m.id === id) || getDefaultModel();
  }

  function getPrompts() {
    return JSON.parse(GM_getValue('prompts', JSON.stringify(DEFAULT_PROMPTS)));
  }

  function savePrompts(prompts) {
    GM_setValue('prompts', JSON.stringify(prompts));
  }

  // === 核心状态变量 ===
  let bubbleBtn = null;
  let promptMenu = null;
  let lastSelection = null;
  let closeTimer = null; // 用于 Hover 延迟关闭
  let menuCmdIds = []; // Tampermonkey 菜单项 ID 列表
  let selectedIndex = 0; // 当前选中的菜单项索引
  let menuItems = []; // 当前菜单项列表

  // === 样式 CSS ===
  GM_addStyle(`
    /* CSS 重置和隔离 - 防止页面样式影响 */
    .ai-panel-overlay, .ai-panel-overlay * {
      all: unset !important;
      box-sizing: border-box !important;
    }

    .ai-panel-container, .ai-panel-container * {
      all: unset !important;
      box-sizing: border-box !important;
    }

    /* 呼吸红点按钮 - 核心改动 */
    @keyframes ai-breathing {
      0%, 100% {
        transform: scale(1);
        opacity: 0.85;
      }
      50% {
        transform: scale(1.3);
        opacity: 1;
      }
    }
    .ai-bubble-btn {
      position: absolute !important;
      width: 9px !important;
      height: 9px !important;
      background: #007aff !important; /* 鲜艳的红色 */
      border-radius: 50% !important;
      box-shadow: 0 0 10px rgba(0, 122, 255, 0.7) !important; /* 蓝色辉光效果 */
      cursor: pointer !important;
      z-index: 999999 !important;
      border: none !important;
      margin: 0 !important;
      padding: 0 !important;
      /* 应用呼吸动画 */
      animation: ai-breathing 2.5s ease-in-out infinite !important;
    }

    /* 提示词菜单 */
    .ai-prompt-menu {
      position: absolute !important;
      background: #fff !important;
      border-radius: 6px !important;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15) !important;
      padding: 4px 0 !important;
      z-index: 1000000 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      min-width: 120px !important;
      border: 1px solid #eee !important;
      animation: ai-fade-in 0.15s ease-out !important;
      margin: 0 !important;
      display: block !important;
    }
    @keyframes ai-fade-in {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .ai-prompt-item {
      padding: 6px 12px !important;
      cursor: pointer !important;
      font-size: 13px !important;
      color: #333 !important;
      white-space: nowrap !important;
      transition: background 0.1s !important;
      display: block !important;
      margin: 0 !important;
      border: none !important;
      text-decoration: none !important;
      font-weight: normal !important;
      line-height: 1.4 !important;
    }
    .ai-prompt-item:hover {
      background: #f2f2f7 !important;
      color: #000 !important;
    }
    .ai-prompt-item.selected {
      background: #007aff !important;
      color: #fff !important;
    }

    /* 状态弹窗 */
    .ai-status-popup {
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      background: rgba(0, 0, 0, 0.8) !important;
      color: #fff !important;
      backdrop-filter: blur(4px) !important;
      padding: 8px 12px !important;
      border-radius: 6px !important;
      z-index: 1000001 !important;
      font-size: 13px !important;
      max-width: 300px !important;
      line-height: 1.4 !important;
      box-shadow: 0 2px 8px rgba(0,0,0,.2) !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      animation: ai-fade-in 0.2s ease-out !important;
      margin: 0 !important;
      border: none !important;
      display: block !important;
    }

    /* 通用设置面板样式 - 强化隔离 */
    .ai-panel-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background: rgba(0,0,0,0.4) !important;
      z-index: 1000002 !important;
      display: block !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
    }

    .ai-panel-container {
      position: fixed !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      background: #fff !important;
      border-radius: 10px !important;
      box-shadow: 0 10px 30px rgba(0,0,0,.25) !important;
      padding: 20px !important;
      z-index: 1000003 !important;
      width: 360px !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      color: #333 !important;
      display: block !important;
      margin: 0 !important;
      border: 1px solid #ddd !important;
      max-height: 90vh !important;
      overflow-y: auto !important;
    }

    .ai-panel-container h3 {
      margin: 0 0 15px 0 !important;
      font-size: 18px !important;
      border-bottom: 1px solid #eee !important;
      padding-bottom: 8px !important;
      font-weight: 600 !important;
      color: #333 !important;
      display: block !important;
      line-height: 1.3 !important;
    }

    .ai-panel-container label {
      display: block !important;
      margin-bottom: 10px !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      color: #555 !important;
      line-height: 1.4 !important;
      cursor: default !important;
    }

    .ai-panel-container input[type="text"],
    .ai-panel-container input[type="password"] {
      width: 100% !important;
      box-sizing: border-box !important;
      padding: 8px !important;
      margin-top: 4px !important;
      border: 1px solid #ccc !important;
      border-radius: 4px !important;
      font-size: 13px !important;
      background: #fff !important;
      color: #333 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      line-height: 1.4 !important;
      outline: none !important;
      display: block !important;
    }

    .ai-panel-container input[type="text"]:focus,
    .ai-panel-container input[type="password"]:focus {
      border-color: #007aff !important;
      box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2) !important;
    }

    .ai-panel-container textarea {
      width: 100% !important;
      box-sizing: border-box !important;
      padding: 8px !important;
      margin-top: 4px !important;
      border: 1px solid #ccc !important;
      border-radius: 4px !important;
      font-size: 13px !important;
      min-height: 120px !important;
      line-height: 1.4 !important;
      resize: vertical !important;
      background: #fff !important;
      color: #333 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      outline: none !important;
      display: block !important;
    }

    .ai-panel-container textarea:focus {
      border-color: #007aff !important;
      box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2) !important;
    }

    .ai-panel-container input[type="checkbox"] {
      width: 14px !important;
      height: 14px !important;
      margin: 0 6px 0 0 !important;
      padding: 0 !important;
      display: inline-block !important;
      vertical-align: middle !important;
      appearance: auto !important;
      -webkit-appearance: checkbox !important;
    }

    .ai-btn-group {
      margin-top: 15px !important;
      display: flex !important;
      justify-content: flex-end !important;
      gap: 8px !important;
      align-items: center !important;
    }

    .ai-btn {
      padding: 6px 12px !important;
      border: 1px solid #ccc !important;
      border-radius: 4px !important;
      cursor: pointer !important;
      font-size: 13px !important;
      background: #f9f9f9 !important;
      color: #333 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      text-decoration: none !important;
      display: inline-block !important;
      line-height: 1.4 !important;
      font-weight: normal !important;
      text-align: center !important;
      transition: all 0.2s ease !important;
      margin: 0 !important;
    }

    .ai-btn:hover {
      background: #eee !important;
      border-color: #bbb !important;
    }

    .ai-btn-primary {
      background: #007aff !important;
      color: white !important;
      border-color: #006ae6 !important;
    }

    .ai-btn-primary:hover {
      background: #006ae6 !important;
      border-color: #005bb5 !important;
    }

    /* 设置面板主操作区与全宽按钮 */
    .ai-primary-actions {
      display: flex !important;
      flex-direction: column !important;
      gap: 8px !important;
      margin-bottom: 12px !important;
    }
    .ai-btn-full {
      width: 100% !important;
      justify-content: center !important;
    }

    /* 在管理列表内强制内容换行，避免溢出 */
    .ai-panel-container .ai-prompt-item {
      white-space: normal !important;
    }
    .ai-panel-container .ai-prompt-preview {
      white-space: normal !important;
      word-break: break-all !important;
      overflow-wrap: anywhere !important;
    }
    .ai-panel-container .ai-prompt-name {
      white-space: normal !important;
      word-break: break-word !important;
      overflow-wrap: anywhere !important;
    }

    /* 语言选择器样式 */
    .ai-language-selector {
      display: flex !important;
      gap: 4px !important;
      margin-top: 4px !important;
      align-items: stretch !important;
    }

    .ai-lang-btn {
      padding: 6px 10px !important;
      border: 1px solid #ccc !important;
      border-radius: 4px !important;
      cursor: pointer !important;
      font-size: 12px !important;
      background: #f9f9f9 !important;
      transition: all 0.2s !important;
      flex: 1 !important;
      text-align: center !important;
      color: #333 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      text-decoration: none !important;
      display: block !important;
      line-height: 1.4 !important;
      font-weight: normal !important;
      margin: 0 !important;
    }

    .ai-lang-btn:hover {
      background: #eee !important;
      border-color: #bbb !important;
    }

    .ai-lang-btn.active {
      background: #007aff !important;
      color: white !important;
      border-color: #006ae6 !important;
    }

    /* 提示词管理列表样式 */
    #ai-prompt-list {
      max-height: 300px !important;
      overflow-y: auto !important;
      border: 1px solid #eee !important;
      border-radius: 4px !important;
      margin-bottom: 15px !important;
      background: #fff !important;
      display: block !important;
    }

    .ai-prompt-list-item {
      padding: 8px 12px !important;
      border-bottom: 1px solid #f0f0f0 !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      background: #fff !important;
      margin: 0 !important;
    }

    .ai-prompt-list-item:last-child {
      border-bottom: none !important;
    }

    .ai-prompt-list-item.disabled {
      opacity: 0.5 !important;
      background: #f9f9f9 !important;
    }

    .ai-prompt-name {
      flex: 1 !important;
      font-size: 13px !important;
      color: #333 !important;
      font-weight: 500 !important;
      margin: 0 !important;
      padding: 0 !important;
      display: block !important;
      line-height: 1.4 !important;
    }

    .ai-prompt-actions {
      display: flex !important;
      gap: 4px !important;
      align-items: center !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .ai-prompt-actions button {
      padding: 2px 6px !important;
      font-size: 11px !important;
      border: 1px solid #ddd !important;
      border-radius: 3px !important;
      cursor: pointer !important;
      background: #fff !important;
      color: #666 !important;
      margin: 0 !important;
      display: inline-block !important;
      line-height: 1.2 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      text-decoration: none !important;
      font-weight: normal !important;
    }

    .ai-prompt-actions button:hover {
      background: #f5f5f5 !important;
      border-color: #ccc !important;
    }

    /* 小按钮样式 */
    .ai-btn-small {
      padding: 2px 6px !important;
      font-size: 11px !important;
      border: 1px solid #ddd !important;
      border-radius: 3px !important;
      cursor: pointer !important;
      background: #fff !important;
      color: #666 !important;
      margin: 0 !important;
      display: inline-block !important;
      line-height: 1.2 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      text-decoration: none !important;
      font-weight: normal !important;
    }

    .ai-btn-small:hover {
      background: #f5f5f5 !important;
      border-color: #ccc !important;
    }

    .ai-btn-small.ai-btn-danger {
      color: #d32f2f !important;
    }

    .ai-btn-small.ai-btn-danger:hover {
      background: #ffebee !important;
      border-color: #d32f2f !important;
    }

    /* 提示词列表项样式 */
    .ai-prompt-item {
      padding: 12px !important;
      border-bottom: 1px solid #f0f0f0 !important;
      display: flex !important;
      align-items: flex-start !important;
      gap: 12px !important;
      background: #fff !important;
      margin: 0 !important;
    }

    .ai-prompt-item:last-child {
      border-bottom: none !important;
    }

    .ai-prompt-item:hover {
      background: #f9f9f9 !important;
      color: #006ae6 !important;
    }

    .ai-prompt-info {
      flex: 1 !important;
      overflow: hidden !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .ai-prompt-preview {
      font-size: 12px !important;
      color: #888 !important;
      margin-top: 4px !important;
      white-space: normal !important;
      word-break: break-all !important;
      overflow-wrap: anywhere !important;
      line-height: 1.4 !important;
      max-height: 60px !important;
      overflow: hidden !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 3 !important;
      -webkit-box-orient: vertical !important;
    }

    .ai-prompt-actions input[type="checkbox"] {
      width: 16px !important;
      height: 16px !important;
      margin: 2px 8px 0 0 !important;
      cursor: pointer !important;
      appearance: auto !important;
      -webkit-appearance: auto !important;
    }
  `);

  // === 事件监听 ===

  // 跟踪鼠标位置，用于快捷键触发时的菜单定位
  document.addEventListener('mousemove', (e) => {
    window.lastMouseY = e.clientY;
  });

  document.addEventListener("mouseup", (e) => {
    // 仅处理左键抬起
    if (e.button !== 0) return;
    // 如果点击的是UI内部，忽略
    if (e.target.closest('.ai-bubble-btn, .ai-prompt-menu, .ai-panel-container')) return;

    // 稍微延迟，确保选区完成
    setTimeout(() => {
      const sel = window.getSelection();
      const text = sel.toString().trim();
      if (!text) {
        removeUI();
        return;
      }

      lastSelection = { sel, text };
      const range = sel.getRangeAt(0);

      // --- 核心改动：获取选区结束位置 ---
      // 克隆 Range 并折叠到末尾，以获取最后一个字符后面的位置
      const endRange = range.cloneRange();
      endRange.collapse(false); // false 表示折叠到 end
      let rect = endRange.getBoundingClientRect();

      // 某些情况下折叠后的 range 获取不到 rect (width/height为0)，回退到使用原 range 的右侧
      let x, y;
      if (rect.left === 0 && rect.top === 0) {
          const fullRect = range.getBoundingClientRect();
          x = fullRect.right;
          y = fullRect.top;
      } else {
          x = rect.left;
          y = rect.top;
      }

      // 显示圆点
      showBubble(x, y);
    }, 100);
  });

  // 点击页面其他地方关闭 UI (只处理左键点击)
  document.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // 只处理左键点击
    if (!e.target.closest('.ai-bubble-btn, .ai-prompt-menu')) {
        removeUI();
    }
  });



  // 快捷键触发提示词菜单 (Cmd+Shift+X)
  document.addEventListener('keydown', (e) => {
    // 检测 Cmd+Shift+X (Mac) 或 Ctrl+Shift+X (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'x') {
      e.preventDefault();

      // 获取光标位置或使用页面中央
      let x, y;
      let mouseY = 200; // 默认高度
      const selection = window.getSelection();

      if (selection.rangeCount > 0) {
        // 有选区时，使用选区位置
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      } else {
        // 检查是否在输入框中
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
          const rect = activeEl.getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        } else {
          // 使用页面中央
          x = window.innerWidth / 2;
          y = window.innerHeight / 2;
        }
      }

      // 如果坐标计算结果为 (0,0) 或接近左上角，使用屏幕中央
      if (x <= 10 && y <= 10) {
        x = window.innerWidth / 2;
        // 尝试使用鼠标位置的高度，如果没有则使用默认值
        if (window.lastMouseY !== undefined) {
          y = window.lastMouseY;
        } else {
          y = mouseY;
        }
      }

      // 获取当前选中的文本（如果有）
      let selText = window.getSelection().toString().trim();
      if (!selText && document.activeElement) {
        const el = document.activeElement;
        if (el && typeof el.selectionStart === 'number' && el.selectionEnd > el.selectionStart) {
          selText = el.value.substring(el.selectionStart, el.selectionEnd).trim();
        }
      }

      // 存储详细的选区信息，包括活动元素和选区位置
      const activeEl = document.activeElement;
      const currentSelection = window.getSelection();

      lastSelection = {
        sel: currentSelection,
        text: selText || '',
        activeElement: activeEl,
        // 保存输入框的选区位置
        selectionStart: activeEl && typeof activeEl.selectionStart === 'number' ? activeEl.selectionStart : null,
        selectionEnd: activeEl && typeof activeEl.selectionEnd === 'number' ? activeEl.selectionEnd : null,
        // 保存页面选区的范围
        range: currentSelection.rangeCount > 0 ? currentSelection.getRangeAt(0).cloneRange() : null
      };

      // 显示菜单
      showPromptMenuAt(x, y);
    }
  });

  // === UI 逻辑 ===

  // 延迟移除 UI (用于 Hover 离开时的缓冲)
  function deferRemoveUI() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      removeUI();
    }, 250); // 给用户 250ms 的时间从圆点移动到菜单，或者从菜单移回圆点
  }

  function removeUI() {
    clearTimeout(closeTimer);
    bubbleBtn?.remove();
    promptMenu?.remove();
    bubbleBtn = null;
    promptMenu = null;
  }

  function showBubble(client_x, client_y) {
    removeUI(); // 先清理

    bubbleBtn = document.createElement("div");
    bubbleBtn.className = "ai-bubble-btn";

    // 计算绝对坐标 (考虑滚动条)
    // 定位在最后一个字的右上角：x 向右稍微偏移，y 向上偏移
    const absX = client_x + window.scrollX + 1;
    const absY = client_y + window.scrollY - 14; // 向上提，使圆点中心大致对齐文字顶端

    bubbleBtn.style.left = `${absX}px`;
    bubbleBtn.style.top = `${absY}px`;
    document.body.appendChild(bubbleBtn);

    // --- Hover 交互逻辑 ---
    bubbleBtn.addEventListener("mouseenter", () => {
      clearTimeout(closeTimer); // 取消关闭
      showPromptMenu();
    });
    bubbleBtn.addEventListener("mouseleave", deferRemoveUI); // 离开开始倒计时关闭
  }

  function showPromptMenu() {
    if (promptMenu) return; // 菜单已存在则不重建

    const prompts = getPrompts().filter(p => p.enabled);
    if (!prompts.length) {
        showPopup(t('noPromptsEnabled'));
        return;
    }

    promptMenu = document.createElement("div");
    promptMenu.className = "ai-prompt-menu";
    promptMenu.setAttribute('tabindex', '-1'); // 使菜单可以获得焦点

    // 菜单显示在圆点的正下方，稍微重叠一点以便鼠标过渡
    const btnRect = bubbleBtn.getBoundingClientRect();
    promptMenu.style.left = `${btnRect.left + window.scrollX}px`;
    promptMenu.style.top = `${btnRect.bottom + window.scrollY + 2}px`;

    promptMenu.innerHTML = prompts.map((p, index) =>
      `<div class="ai-prompt-item ${index === 0 ? 'selected' : ''}" data-id="${p.id}" data-index="${index}">${p.name}</div>`
    ).join("");

    document.body.appendChild(promptMenu);

    // 初始化键盘导航状态
    selectedIndex = 0;
    menuItems = promptMenu.querySelectorAll(".ai-prompt-item");

    // 设置焦点以接收键盘事件
    promptMenu.focus();

    // --- 菜单的 Hover 逻辑 ---
    promptMenu.addEventListener("mouseenter", () => clearTimeout(closeTimer)); // 进入菜单，取消关闭
    promptMenu.addEventListener("mouseleave", deferRemoveUI); // 离开菜单，开始倒计时关闭

    // 键盘导航事件
    promptMenu.addEventListener("keydown", handleMenuKeydown);

    // 鼠标悬停更新选中状态和点击菜单项
    menuItems.forEach((item, index) => {
      item.addEventListener("mouseenter", () => {
        updateSelectedItem(index);
      });

      item.addEventListener("click", async (e) => {
        e.stopPropagation(); // 防止触发 document 的 mousedown 立即关闭
        removeUI(); // 点击后立即关闭菜单
        const id = parseInt(item.dataset.id);
        const p = prompts.find(x => x.id === id);
        if (p) await runPrompt(p);
      });
    });
  }

  // 注册 Tampermonkey 右键子菜单命令
  function registerMenuCommands() {
    try {
      if (typeof GM_unregisterMenuCommand === 'function' && Array.isArray(menuCmdIds)) {
        menuCmdIds.forEach(id => {
          try { GM_unregisterMenuCommand(id); } catch (_) {}
        });
        menuCmdIds = [];
      }
    } catch (_) {}

    // 基础设置入口
    try {
      const id = GM_registerMenuCommand(t('menuSettings'), createSettingsPanel);
      if (id !== undefined) menuCmdIds.push(id);
    } catch (_) {}

    // 为每个启用的提示词添加运行命令
    const prompts = getPrompts().filter(p => p.enabled);
    prompts.forEach(p => {
      try {
        const id = GM_registerMenuCommand(t('menuRun', {name: p.name}), () => {
          // 获取当前选区文本（支持 input/textarea）
          const selText = getSelectedText();
          if (!selText) {
            showPopup(t('pleaseSelectText'));
            return;
          }
          lastSelection = { sel: window.getSelection(), text: selText };
          runPrompt(p);
        });
        if (id !== undefined) menuCmdIds.push(id);
      } catch (_) {}
    });
  }

  // 在指定坐标显示提示词菜单
  function showPromptMenuAt(client_x, client_y) {
    removeUI();
    const prompts = getPrompts().filter(p => p.enabled);
    if (!prompts.length) {
        showPopup(t('noPromptsEnabled'));
        return;
    }

    promptMenu = document.createElement("div");
    promptMenu.className = "ai-prompt-menu";
    promptMenu.setAttribute('tabindex', '-1'); // 使菜单可以获得焦点
    const absX = client_x + window.scrollX;
    const absY = client_y + window.scrollY;
    promptMenu.style.left = `${absX}px`;
    promptMenu.style.top = `${absY + 2}px`;

    promptMenu.innerHTML = prompts.map((p, index) =>
      `<div class="ai-prompt-item ${index === 0 ? 'selected' : ''}" data-id="${p.id}" data-index="${index}">${p.name}</div>`
    ).join("");

    document.body.appendChild(promptMenu);

    // 初始化键盘导航状态
    selectedIndex = 0;
    menuItems = promptMenu.querySelectorAll(".ai-prompt-item");

    // 设置焦点以接收键盘事件
    promptMenu.focus();

    promptMenu.addEventListener("mouseenter", () => clearTimeout(closeTimer));
    promptMenu.addEventListener("mouseleave", deferRemoveUI);

    // 键盘导航事件
    promptMenu.addEventListener("keydown", handleMenuKeydown);

    // 鼠标悬停更新选中状态
    menuItems.forEach((item, index) => {
      item.addEventListener("mouseenter", () => {
        updateSelectedItem(index);
      });

      item.addEventListener("click", async (e) => {
        e.stopPropagation();
        removeUI();
        const id = parseInt(item.dataset.id);
        const p = prompts.find(x => x.id === id);
        if (p) await runPrompt(p);
      });
    });
  }

  // === AI 执行逻辑 ===
  async function runPrompt(prompt) {
    // 根据提示词的modelId获取对应的模型配置，如果没有则使用默认模型
    let modelConfig;
    if (prompt.modelId) {
      modelConfig = getModelById(prompt.modelId);
      if (!modelConfig) {
        // 如果指定的模型不存在，使用默认模型
        modelConfig = getDefaultModel();
      }
    } else {
      // 使用默认模型
      modelConfig = getDefaultModel();
    }

    if (!modelConfig) {
      alert('未找到可用的模型配置，请先在设置中添加模型');
      createSettingsPanel();
      return;
    }

    const { endpoint, model, apikey } = modelConfig;

    if (!apikey) {
      alert(t('configureApiKey'));
      createSettingsPanel();
      return;
    }

    const content = prompt.text.replace("{text}", lastSelection.text);
    const targetEl = getEditableElement();

    showPopup(t('processing', {name: prompt.name}), 0); // 0 表示不自动消失

    try {
      const response = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "POST",
          url: endpoint,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apikey}`
          },
          data: JSON.stringify({
            model: model,
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: content }
            ],
            temperature: 0.7
          }),
          onload: function(response) {
            resolve(response);
          },
          onerror: function(error) {
            reject(error);
          }
        });
      });

      if (response.status !== 200) {
        throw new Error(`API Error (${response.status}): ${response.responseText}`);
      }

      const data = JSON.parse(response.responseText);
      const reply = data.choices?.[0]?.message?.content?.trim();

      if (!reply) throw new Error(t('apiReturnEmpty'));

      // 优先尝试回填到原选中区域
      let pasteSuccess = false;

      // 如果有保存的选区信息，尝试回填
      if (lastSelection && (lastSelection.activeElement || lastSelection.range)) {
        try {
          if (lastSelection.activeElement &&
              (lastSelection.activeElement.tagName === 'INPUT' ||
               lastSelection.activeElement.tagName === 'TEXTAREA') &&
              lastSelection.selectionStart !== null &&
              lastSelection.selectionEnd !== null) {
            // 处理输入框/文本域
            const el = lastSelection.activeElement;
            el.focus();
            el.selectionStart = lastSelection.selectionStart;
            el.selectionEnd = lastSelection.selectionEnd;
            replaceSelectedText(el, reply);
            pasteSuccess = true;
          } else if (lastSelection.range) {
            // 处理页面选区或contentEditable元素
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(lastSelection.range);

            // 如果是contentEditable元素
            if (lastSelection.activeElement && lastSelection.activeElement.isContentEditable) {
              lastSelection.activeElement.focus();
              replaceSelectedText(lastSelection.activeElement, reply);
              pasteSuccess = true;
            } else {
              // 普通页面选区，直接替换
              const range = selection.getRangeAt(0);
              range.deleteContents();
              range.insertNode(document.createTextNode(reply));
              range.collapse(false);
              selection.removeAllRanges();
              selection.addRange(range);
              pasteSuccess = true;
            }
          }
        } catch (err) {
          console.warn('[AI Selector] 回填失败，将复制到剪贴板:', err);
          pasteSuccess = false;
        }
      }

      // 如果回填成功，显示成功消息
      if (pasteSuccess) {
        showPopup(t('completedAndFilled'));
      } else if (targetEl) {
        // 兼容原有的targetEl逻辑
        replaceSelectedText(targetEl, reply);
        showPopup(t('completedAndFilledSimple'));
      } else {
        // 回填失败或没有选区，复制到剪贴板
        navigator.clipboard.writeText(reply).then(() => {
             showPopup(t('copiedToClipboard', {result: reply}), 5000);
        }).catch(() => {
             showPopup(t('copyFailed', {result: reply}), 10000);
        });
      }

      // 如果设置了下载文件，则下载结果
      if (prompt.downloadFile) {
        downloadAsFile(reply, prompt.name, prompt.fileExtension || 'txt');
      }

    } catch (err) {
      console.error('[AI Selector Error]', err);
      showPopup(t('failed', {error: err.message}), 5000);
    }
  }

  // === 辅助工具 ===
  function downloadAsFile(content, promptName, extension) {
    try {
      // 创建文件名，使用提示词名称和时间戳
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `${promptName}_${timestamp}.${extension}`;

      // 创建 Blob 对象
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';

      // 添加到页面并触发下载
      document.body.appendChild(a);
      a.click();

      // 清理
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      //console.log(`[AI Selector] 文件已下载: ${filename}`);
    } catch (err) {
      console.error('[AI Selector] 文件下载失败:', err);
    }
  }

  function showPopup(msg, duration = 3000) {
    const old = document.getElementById('ai-status-popup-id');
    if (old) old.remove();

    const div = document.createElement("div");
    div.id = 'ai-status-popup-id';
    div.className = "ai-status-popup";
    div.innerText = msg; // 使用 innerText 防止注入，保持换行
    document.body.appendChild(div);

    if (duration > 0) {
      setTimeout(() => {
        div.style.opacity = '0';
        div.style.transition = 'opacity 0.3s';
        setTimeout(() => div.remove(), 300);
      }, duration);
    }
  }

  function getEditableElement() {
    const active = document.activeElement;
    if (!active) return null;
    // 判断是否是输入框或富文本编辑器
    if (['textarea', 'input'].includes(active.tagName.toLowerCase()) || active.isContentEditable) {
      return active;
    }
    return null;
  }

  function replaceSelectedText(el, newText) {
    el.focus();
    // 针对 input/textarea
    if (typeof el.selectionStart === 'number') {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const originalText = el.value;
      el.value = originalText.substring(0, start) + newText + originalText.substring(end);
      // 移动光标到新文本末尾
      el.selectionStart = el.selectionEnd = start + newText.length;
      // 尝试触发 input 事件以适配现代前端框架 (React/Vue等)
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
    // 针对 contentEditable
    else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = newText;
    } else {
        // 标准 API
        const sel = window.getSelection();
        if (sel.rangeCount) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(newText));
            // 移动光标到末尾
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
  }

  // 获取当前选区文本（页面或输入框）
  function getSelectedText() {
    try {
      const s = window.getSelection();
      let text = (s && typeof s.toString === 'function') ? s.toString().trim() : '';
      if (text) return text;
    } catch (_) {}
    const el = document.activeElement;
    if (el && typeof el.selectionStart === 'number' && el.selectionEnd > el.selectionStart) {
      return el.value.substring(el.selectionStart, el.selectionEnd).trim();
    }
    return '';
  }

  // === 设置面板 (保持逻辑，美化样式) ===
  function createSettingsPanel() {
    if (document.getElementById('ai-settings-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'ai-settings-overlay';
    overlay.className = 'ai-panel-overlay';

    const panel = document.createElement('div');
    panel.className = 'ai-panel-container';
    panel.innerHTML = `
        <h3>${t('aiSettings')}</h3>
        <div class="ai-primary-actions">
            <button id="ai-btn-models" class="ai-btn ai-btn-primary ai-btn-full">${t('manageModels')}</button>
            <button id="ai-btn-prompts" class="ai-btn ai-btn-full">${t('managePrompts')}</button>
        </div>
        <label>${t('language')}
          <div class="ai-language-selector">
            <button id="ai-lang-auto" class="ai-lang-btn">${t('languageAuto')}</button>
            <button id="ai-lang-zh" class="ai-lang-btn">${t('languageChinese')}</button>
            <button id="ai-lang-en" class="ai-lang-btn">${t('languageEnglish')}</button>
          </div>
        </label>
        <div class="ai-btn-group">
            <button id="ai-btn-close" class="ai-btn">${t('close')}</button>
        </div>
    `;
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    const close = () => overlay.remove();

    // 语言切换事件处理
    const updateLanguageButtons = () => {
      const currentLang = getCurrentLanguage();
      const isAuto = !GM_getValue('user_language', '');

      document.querySelectorAll('.ai-lang-btn').forEach(btn => btn.classList.remove('active'));

      if (isAuto) {
        document.getElementById('ai-lang-auto').classList.add('active');
      } else if (currentLang === 'zh') {
        document.getElementById('ai-lang-zh').classList.add('active');
      } else if (currentLang === 'en') {
        document.getElementById('ai-lang-en').classList.add('active');
      }
    };

    // 初始化语言按钮的选中状态
    updateLanguageButtons();

    document.getElementById('ai-lang-auto').onclick = () => {
      GM_deleteValue('user_language');
      updateLanguageButtons();
      // 重新渲染面板以更新文本
      setTimeout(() => {
        close();
        createSettingsPanel();
      }, 100);
    };

    document.getElementById('ai-lang-zh').onclick = () => {
      setLanguage('zh');
      updateLanguageButtons();
      // 重新渲染面板以更新文本
      setTimeout(() => {
        close();
        createSettingsPanel();
      }, 100);
    };

    document.getElementById('ai-lang-en').onclick = () => {
      setLanguage('en');
      updateLanguageButtons();
      // 重新渲染面板以更新文本
      setTimeout(() => {
        close();
        createSettingsPanel();
      }, 100);
    };

    document.getElementById('ai-btn-close').onclick = close;
    overlay.onclick = (e) => { if(e.target === overlay) close(); };

    document.getElementById('ai-btn-models').onclick = () => {
        close();
        createModelManager();
    };

    document.getElementById('ai-btn-prompts').onclick = () => {
        close();
        createPromptManager();
    };
  }

  // === 模型管理器 ===
  function createModelManager() {
    if (document.getElementById('ai-model-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'ai-model-overlay';
    overlay.className = 'ai-panel-overlay';

    const panel = document.createElement('div');
    panel.className = 'ai-panel-container';
    panel.style.width = '600px';
    panel.innerHTML = `
        <h3>${t('modelManagement')}</h3>
        <div class="ai-btn-group" style="margin-bottom: 15px;">
            <button id="ai-add-model-btn" class="ai-btn ai-btn-primary">${t('addModel')}</button>
        </div>
        <div id="ai-model-list" class="ai-prompt-list"></div>
        <div class="ai-btn-group">
            <button id="ai-model-close" class="ai-btn">${t('close')}</button>
        </div>
    `;
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    document.getElementById('ai-model-close').onclick = close;
    overlay.onclick = (e) => { if(e.target === overlay) close(); };

    // 渲染模型列表
    function renderModelList() {
      const models = getModels();
      const listEl = document.getElementById('ai-model-list');

      if (models.length === 0) {
        listEl.innerHTML = '<p style="text-align: center; color: #666;">暂无模型配置</p>';
        return;
      }

      listEl.innerHTML = models.map(model => `
        <div class="ai-prompt-item" data-id="${model.id}">
          <div class="ai-prompt-info">
            <div class="ai-prompt-name">
              ${model.name} ${model.isDefault ? `<span style="color: #007aff; font-size: 12px;">(${t('defaultModel')})</span>` : ''}
            </div>
            <div class="ai-prompt-preview" style="white-space: normal; word-break: break-all; overflow-wrap: anywhere;">
              ${model.endpoint} - ${model.model}
            </div>
          </div>
          <div class="ai-prompt-actions">
            ${!model.isDefault ? `<button class="ai-btn-small ai-btn-default" data-action="setDefault">${t('setAsDefault')}</button>` : ''}
            <button class="ai-btn-small" data-action="edit">${t('edit')}</button>
            <button class="ai-btn-small" data-action="clone">${t('clone')}</button>
            <button class="ai-btn-small ai-btn-danger" data-action="delete">${t('delete')}</button>
          </div>
        </div>
      `).join('');

      // 绑定操作事件
      listEl.querySelectorAll('.ai-prompt-item').forEach(item => {
        const id = parseInt(item.dataset.id);
        const model = models.find(m => m.id === id);

        item.querySelectorAll('[data-action]').forEach(btn => {
          btn.onclick = (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;

            if (action === 'edit') {
              openAddModelModal(model);
            } else if (action === 'clone') {
              // 复刻：打开新增模型窗口，但预填当前模型的值
              openAddModelModal(model, true);
            } else if (action === 'delete') {
              if (models.length === 1) {
                alert('至少需要保留一个模型');
                return;
              }
              if (confirm(t('confirmDelete'))) {
                const updatedModels = models.filter(m => m.id !== id);
                // 如果删除的是默认模型，将第一个模型设为默认
                if (model.isDefault && updatedModels.length > 0) {
                  updatedModels[0].isDefault = true;
                }
                saveModels(updatedModels);
                renderModelList();
              }
            } else if (action === 'setDefault') {
              const updatedModels = models.map(m => ({
                ...m,
                isDefault: m.id === id
              }));
              saveModels(updatedModels);
              renderModelList();
            }
          };
        });
      });
    }

    document.getElementById('ai-add-model-btn').onclick = () => openAddModelModal();
    renderModelList();
  }

  // === 新增/编辑模型弹窗 ===
  function openAddModelModal(prefillData = null, isClone = false) {
    const addOverlay = document.createElement('div');
    addOverlay.id = 'ai-add-model-overlay';
    addOverlay.className = 'ai-panel-overlay';
    const addPanel = document.createElement('div');
    addPanel.className = 'ai-panel-container';
    addPanel.style.width = '480px';
    addPanel.innerHTML = `
          <h3>${prefillData && !isClone ? t('editModel') : t('addModel')}</h3>
          <label>${t('modelNameLabel')}
            <input id="ai-add-model-name" type="text" placeholder="例如：GPT-4"/>
          </label>
          <label>${t('apiEndpoint')}
            <input id="ai-add-model-endpoint" type="text" placeholder="https://api.openai.com/v1/chat/completions"/>
          </label>
          <label>${t('modelName')}
            <input id="ai-add-model-model" type="text" placeholder="gpt-3.5-turbo, gpt-4o..."/>
          </label>
          <label>${t('apiKey')}
            <input id="ai-add-model-apikey" type="password" placeholder="sk-xxxxxxxx..."/>
          </label>
          <label>
            <input id="ai-add-model-default" type="checkbox"/> ${t('setAsDefault')}
          </label>
          <div class="ai-btn-group">
              <button id="ai-add-model-save" class="ai-btn ai-btn-primary">${t('save')}</button>
              <button id="ai-add-model-cancel" class="ai-btn">${t('cancel')}</button>
          </div>
      `;
    addOverlay.appendChild(addPanel);
    document.body.appendChild(addOverlay);

    const nameInput = document.getElementById('ai-add-model-name');
    const endpointInput = document.getElementById('ai-add-model-endpoint');
    const modelInput = document.getElementById('ai-add-model-model');
    const apikeyInput = document.getElementById('ai-add-model-apikey');
    const defaultInput = document.getElementById('ai-add-model-default');

    // 如果有预填充数据，则填充表单
    if (prefillData) {
      nameInput.value = prefillData.name || '';
      endpointInput.value = prefillData.endpoint || '';
      modelInput.value = prefillData.model || '';
      apikeyInput.value = prefillData.apikey || '';
      defaultInput.checked = prefillData.isDefault || false;
    }

    const closeAdd = () => addOverlay.remove();
    document.getElementById('ai-add-model-cancel').onclick = closeAdd;
    addOverlay.onclick = (e) => { if (e.target === addOverlay) closeAdd(); };

    document.getElementById('ai-add-model-save').onclick = () => {
        const newName = nameInput.value.trim();
        const newEndpoint = endpointInput.value.trim();
        const newModel = modelInput.value.trim();
        const newApikey = apikeyInput.value.trim();
        const isDefault = defaultInput.checked;

        if (!newName || !newEndpoint || !newModel) {
            alert(t('nameContentRequired'));
            return;
        }

        const models = getModels();

        if (prefillData && !isClone) {
            // 编辑现有模型
            const updatedModels = models.map(m => {
                if (m.id === prefillData.id) {
                    return {
                        ...m,
                        name: newName,
                        endpoint: newEndpoint,
                        model: newModel,
                        apikey: newApikey,
                        isDefault: isDefault
                    };
                }
                // 如果当前模型设为默认，其他模型取消默认
                return { ...m, isDefault: isDefault ? false : m.isDefault };
            });
            saveModels(updatedModels);
        } else {
            // 新增模型
            const newId = Math.max(...models.map(m => m.id), 0) + 1;
            const newModelData = {
                id: newId,
                name: newName,
                endpoint: newEndpoint,
                model: newModel,
                apikey: newApikey,
                isDefault: isDefault
            };

            // 如果设为默认，其他模型取消默认
            const updatedModels = isDefault
                ? [...models.map(m => ({ ...m, isDefault: false })), newModelData]
                : [...models, newModelData];

            saveModels(updatedModels);
        }

        showPopup(t('settingsSaved'));
        closeAdd();

        // 刷新模型列表
        const modelList = document.getElementById('ai-model-list');
        if (modelList) {
            const modelManager = document.getElementById('ai-model-overlay');
            if (modelManager) {
                modelManager.remove();
                createModelManager();
            }
        }
    };
  }

  // === 新增提示词弹窗（全局函数）===
  function openAddPromptModal(prefillData = null) {
    const addOverlay = document.createElement('div');
    addOverlay.id = 'ai-add-overlay';
    addOverlay.className = 'ai-panel-overlay';
    const addPanel = document.createElement('div');
    addPanel.className = 'ai-panel-container';
    addPanel.style.width = '480px';
    addPanel.innerHTML = `
          <h3>${t('addPrompt')}</h3>
          <label>${t('name')}
            <input id="ai-add-name" type="text" placeholder="${t('nameExample')}"/>
          </label>
          <label>${t('promptContent')}
            <textarea id="ai-add-text" placeholder="${t('placeholderExample')}"></textarea>
          </label>
          <label>${t('selectModel')}
            <select id="ai-add-model">
              <option value="">${t('defaultModel')}</option>
            </select>
          </label>
          <label>
            <input id="ai-add-download" type="checkbox"/> ${t('downloadFile')}
          </label>
          <label id="ai-add-extension-label" style="display: none;">${t('fileExtension')}
            <input id="ai-add-extension" type="text" placeholder="${t('fileExtensionPlaceholder')}" value="txt"/>
          </label>
          <div class="ai-btn-group">
              <button id="ai-add-save" class="ai-btn ai-btn-primary">${t('save')}</button>
              <button id="ai-add-cancel" class="ai-btn">${t('cancel')}</button>
          </div>
      `;
    addOverlay.appendChild(addPanel);
    document.body.appendChild(addOverlay);

    const nameInput = document.getElementById('ai-add-name');
    const textInput = document.getElementById('ai-add-text');
    const modelSelect = document.getElementById('ai-add-model');
    const downloadInput = document.getElementById('ai-add-download');
    const extensionInput = document.getElementById('ai-add-extension');
    const extensionLabel = document.getElementById('ai-add-extension-label');

    // 填充模型选择下拉框
    const models = getModels();
    models.forEach(model => {
      const option = document.createElement('option');
      option.value = model.id;
      option.textContent = model.name;
      modelSelect.appendChild(option);
    });

    // 如果有预填充数据，则填充表单
    if (prefillData) {
      nameInput.value = prefillData.name || '';
      textInput.value = prefillData.text || '';
      modelSelect.value = prefillData.modelId || '';
      downloadInput.checked = prefillData.downloadFile || false;
      extensionInput.value = prefillData.fileExtension || 'txt';

      // 根据下载选项显示/隐藏扩展名输入框
      if (downloadInput.checked) {
        extensionLabel.style.display = 'block';
      }
    }

    // Show/hide extension input based on download checkbox
    downloadInput.onchange = () => {
      extensionLabel.style.display = downloadInput.checked ? 'block' : 'none';
    };

    const closeAdd = () => addOverlay.remove();
    document.getElementById('ai-add-cancel').onclick = closeAdd;
    addOverlay.onclick = (e) => { if (e.target === addOverlay) closeAdd(); };
    document.getElementById('ai-add-save').onclick = () => {
        const newName = nameInput.value.trim();
        const newText = textInput.value.trim();
        const newModelId = modelSelect.value || null;
        const newDownloadFile = downloadInput.checked;
        const newFileExtension = extensionInput.value.trim() || 'txt';

        if (!newName || !newText) {
            showPopup(t('nameContentRequired'));
            return;
        }
        const prompts = getPrompts();

        if (prefillData) {
            // 编辑现有提示词
            const updatedPrompts = prompts.map(p => {
                if (p.id === prefillData.id) {
                    return {
                        ...p,
                        name: newName,
                        text: newText,
                        modelId: newModelId,
                        downloadFile: newDownloadFile,
                        fileExtension: newFileExtension
                    };
                }
                return p;
            });
            savePrompts(updatedPrompts);
        } else {
            // 新增提示词
            prompts.push({
              id: Date.now(),
              name: newName,
              text: newText,
              modelId: newModelId,
              enabled: true,
              downloadFile: newDownloadFile,
              fileExtension: newFileExtension
            });
            savePrompts(prompts);
        }

        showPopup(t('promptUpdated'));
        closeAdd();
        registerMenuCommands();

        // 如果提示词管理面板打开，刷新列表
        const promptManager = document.getElementById('ai-prompts-overlay');
        if (promptManager) {
          // 触发重新渲染列表
          const renderEvent = new CustomEvent('refreshPromptList');
          document.dispatchEvent(renderEvent);
        }
    };

    // 自动聚焦到名称输入框
    setTimeout(() => nameInput.focus(), 100);
  }

  // === 提示词管理面板 ===
  function createPromptManager() {
    if (document.getElementById('ai-prompts-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'ai-prompts-overlay';
    overlay.className = 'ai-panel-overlay';

    const panel = document.createElement('div');
    panel.className = 'ai-panel-container';
    panel.style.width = '500px';
    panel.innerHTML = `
        <h3>${t('promptManagement')}</h3>
        <div style="font-size:12px;color:#666;margin-bottom:10px;">
          ${t('promptPlaceholder')}
        </div>
        <div id="ai-prompt-list" style="max-height:300px; overflow-y:auto; border:1px solid #eee; border-radius:4px; margin-bottom:15px;"></div>
        <div class="ai-btn-group">
            <button id="ai-btn-add" class="ai-btn ai-btn-primary">${t('addNew')}</button>
            <button id="ai-btn-p-close" class="ai-btn">${t('close')}</button>
        </div>
    `;
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    document.getElementById('ai-btn-p-close').onclick = close;
    overlay.onclick = (e) => { if(e.target === overlay) close(); };

    // 编辑提示词弹窗
    function openEditPromptModal(idx) {
      const prompts = getPrompts();
      const p = prompts[idx];
      const editOverlay = document.createElement('div');
      editOverlay.id = 'ai-edit-overlay';
      editOverlay.className = 'ai-panel-overlay';
      const editPanel = document.createElement('div');
      editPanel.className = 'ai-panel-container';
      editPanel.style.width = '480px';
      editPanel.innerHTML = `
          <h3>${t('editPrompt')}</h3>
          <label>${t('name')}
            <input id="ai-edit-name" type="text" placeholder="${t('nameExample')}"/>
          </label>
          <label>${t('promptContent')}
            <textarea id="ai-edit-text" placeholder="${t('placeholderExample')}"></textarea>
          </label>
          <label>
            <input id="ai-edit-download" type="checkbox"/> ${t('downloadFile')}
          </label>
          <label id="ai-edit-extension-label" style="display: none;">${t('fileExtension')}
            <input id="ai-edit-extension" type="text" placeholder="${t('fileExtensionPlaceholder')}"/>
          </label>
          <div class="ai-btn-group">
              <button id="ai-edit-save" class="ai-btn ai-btn-primary">${t('save')}</button>
              <button id="ai-edit-cancel" class="ai-btn">${t('cancel')}</button>
          </div>
      `;
      editOverlay.appendChild(editPanel);
      document.body.appendChild(editOverlay);

      const nameInput = document.getElementById('ai-edit-name');
      const textInput = document.getElementById('ai-edit-text');
      const downloadInput = document.getElementById('ai-edit-download');
      const extensionInput = document.getElementById('ai-edit-extension');
      const extensionLabel = document.getElementById('ai-edit-extension-label');

      nameInput.value = p.name;
      textInput.value = p.text;
      downloadInput.checked = p.downloadFile || false;
      extensionInput.value = p.fileExtension || 'txt';

      // Show/hide extension input based on download checkbox
      if (downloadInput.checked) {
        extensionLabel.style.display = 'block';
      }

      downloadInput.onchange = () => {
        extensionLabel.style.display = downloadInput.checked ? 'block' : 'none';
      };

      const closeEdit = () => editOverlay.remove();
      document.getElementById('ai-edit-cancel').onclick = closeEdit;
      editOverlay.onclick = (e) => { if (e.target === editOverlay) closeEdit(); };
      document.getElementById('ai-edit-save').onclick = () => {
          const newName = nameInput.value.trim();
          const newText = textInput.value.trim();
          const newDownloadFile = downloadInput.checked;
          const newFileExtension = extensionInput.value.trim() || 'txt';

          if (!newName || !newText) {
              showPopup(t('nameContentRequired'));
              return;
          }
          p.name = newName;
          p.text = newText;
          p.downloadFile = newDownloadFile;
          p.fileExtension = newFileExtension;
          savePrompts(prompts);
          renderList();
          closeEdit();
          showPopup(t('promptUpdated'));
          registerMenuCommands();
      };
    }



    // 渲染列表
    const renderList = () => {
      const listEl = document.getElementById('ai-prompt-list');
      listEl.innerHTML = '';
      const prompts = getPrompts();

      if (prompts.length === 0) {
        listEl.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">暂无提示词配置</p>';
        return;
      }

      listEl.innerHTML = prompts.map((p, index) => `
        <div class="ai-prompt-item" data-index="${index}">
          <div class="ai-prompt-info">
            <div class="ai-prompt-name">${p.name}</div>
            <div class="ai-prompt-preview">${p.text}</div>
          </div>
          <div class="ai-prompt-actions">
            <input type="checkbox" class="ai-p-enable" data-idx="${index}" ${p.enabled ? 'checked' : ''} title="${t('enableDisable')}" />
            <button class="ai-btn-small" data-action="edit" data-idx="${index}">${t('edit')}</button>
            <button class="ai-btn-small ai-btn-danger" data-action="delete" data-idx="${index}">${t('delete')}</button>
          </div>
        </div>
      `).join('');

      // 绑定列表内事件
      listEl.querySelectorAll('.ai-p-enable').forEach(el => el.onchange = (e) => {
        prompts[e.target.dataset.idx].enabled = e.target.checked;
        savePrompts(prompts);
        registerMenuCommands();
      });

      listEl.querySelectorAll('[data-action="delete"]').forEach(el => el.onclick = (e) => {
        if(confirm('确定删除?')) {
            prompts.splice(e.target.dataset.idx, 1);
            savePrompts(prompts);
            renderList();
            registerMenuCommands();
        }
      });

      listEl.querySelectorAll('[data-action="edit"]').forEach(el => el.onclick = (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        openEditPromptModal(idx);
      });
    };

    document.getElementById('ai-btn-add').onclick = () => {
        openAddPromptModal();
    };

    // 监听自定义事件，用于刷新列表
    document.addEventListener('refreshPromptList', () => {
      renderList();
    });

    renderList();
  }

  // === 键盘导航辅助函数 ===
  function updateSelectedItem(newIndex) {
    if (!menuItems || menuItems.length === 0) return;

    // 移除所有选中状态
    menuItems.forEach(item => item.classList.remove('selected'));

    // 设置新的选中项
    selectedIndex = newIndex;
    menuItems[selectedIndex].classList.add('selected');
  }

  function handleMenuKeydown(e) {
    if (!menuItems || menuItems.length === 0) return;

    switch(e.key) {
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : menuItems.length - 1;
        updateSelectedItem(prevIndex);
        break;

      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = selectedIndex < menuItems.length - 1 ? selectedIndex + 1 : 0;
        updateSelectedItem(nextIndex);
        break;

      case 'Enter':
        e.preventDefault();
        if (menuItems[selectedIndex]) {
          // 触发选中项的点击事件
          menuItems[selectedIndex].click();
        }
        break;

      case 'Escape':
        e.preventDefault();
        removeUI();
        break;
    }
  }

  // === Select2ai:// 协议处理 ===
  function parseSelect2aiProtocol(url) {
    try {
      //console.log('[Select2ai] 开始解析协议 URL:', url);

      // 检查是否是 Select2ai:// 协议（大小写不敏感）
      const lowerUrl = url.toLowerCase();
      if (!lowerUrl.startsWith('select2ai://')) {
        //console.log('[Select2ai] 不是有效的 Select2ai 协议 URL');
        return null;
      }

      // 解析 URL 参数 - 支持两种格式: select2ai://? 和 select2ai://addPrompt?（大小写不敏感）
      let urlToParse = url;
      if (lowerUrl.startsWith('select2ai://addprompt?')) {
        urlToParse = url.replace(/^select2ai:\/\/addprompt\?/i, 'https://dummy.com/?');
      } else if (lowerUrl.startsWith('select2ai://?')) {
        urlToParse = url.replace(/^select2ai:\/\/\?/i, 'https://dummy.com/?');
      } else {
        //console.log('[Select2ai] 不支持的协议格式');
        return null;
      }

      const urlObj = new URL(urlToParse);
      const params = urlObj.searchParams;

      const result = {
        name: decodeURIComponent(params.get('name') || ''),
        text: decodeURIComponent(params.get('text') || ''),
        downloadFile: params.get('downloadfile') === 'true',
        fileExtension: params.get('fileExtension') || 'txt'
      };

      //console.log('[Select2ai] 解析结果:', result);
      return result;
    } catch (error) {
      console.error('[Select2ai] 解析协议失败:', error);
      return null;
    }
  }

  function handleSelect2aiProtocol(protocolData) {
    if (!protocolData) {
      //console.log('[Select2ai] 协议数据为空，跳过处理');
      return;
    }

    //console.log('[Select2ai] 处理协议数据:', protocolData);

    // 打开添加提示词弹窗并预填充数据
    setTimeout(() => {
      //console.log('[Select2ai] 打开添加提示词弹窗');
      openAddPromptModal(protocolData);
    }, 100);
  }

  // 检查当前页面 URL 是否包含协议
  function checkCurrentUrlForProtocol() {
    const currentUrl = window.location.href;
    //console.log('[Select2ai] 检查当前 URL:', currentUrl);

    if (currentUrl.includes('Select2ai://')) {
      const match = currentUrl.match(/Select2ai:\/\/[^?\s]*/);
      if (match) {
        //console.log('[Select2ai] 发现协议 URL:', match[0]);
        const protocolData = parseSelect2aiProtocol(match[0]);
        if (protocolData) {
          handleSelect2aiProtocol(protocolData);
          // 清理 URL
          if (window.history && window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      }
    }
  }

  // 监听协议链接点击事件
  document.addEventListener('click', (e) => {
    //console.log('[Select2ai] 点击事件触发:', e.target);

    const target = e.target.closest('a[href^="Select2ai://"]');
    if (target) {
      //console.log('[Select2ai] 发现协议链接:', target.href);
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const protocolData = parseSelect2aiProtocol(target.href);
      if (protocolData) {
        handleSelect2aiProtocol(protocolData);
      }
      return false;
    }
  }, true); // 使用捕获阶段

  // 额外的协议处理 - 监听 beforeunload 事件
  window.addEventListener('beforeunload', (e) => {
    const currentUrl = window.location.href;
    if (currentUrl.includes('Select2ai://')) {
      //console.log('[Select2ai] beforeunload 事件中发现协议 URL');
      e.preventDefault();
      const protocolData = parseSelect2aiProtocol(currentUrl);
      if (protocolData) {
        handleSelect2aiProtocol(protocolData);
      }
      return false;
    }
  });

  // === 初始化 ===
  initDefaults();
  registerMenuCommands();

  // 检查页面加载时的协议 URL
  checkCurrentUrlForProtocol();

  // 监听 hashchange 事件
  window.addEventListener('hashchange', checkCurrentUrlForProtocol);

  // 监听 popstate 事件
  window.addEventListener('popstate', checkCurrentUrlForProtocol);

})();