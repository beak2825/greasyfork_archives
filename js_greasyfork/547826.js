// ==UserScript==
// @name         空行增加工具
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  将正文部分的<br>替换为<br><br>，识别已有<br><br>格式，实现空行效果，可设置段落缩进，兼容手机端
// @author       You
// @match        *://*/forum.php?mod=viewthread*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/547826/%E7%A9%BA%E8%A1%8C%E5%A2%9E%E5%8A%A0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/547826/%E7%A9%BA%E8%A1%8C%E5%A2%9E%E5%8A%A0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * 配置管理模块
   */
  const Config = {
    // 默认配置
    defaults: {
      isPanelVisible: true,
      indentSize: 2,
      lineBreaksCount: 2, // 默认显示为1，实际是2
      skipExistingBreaks: false,
      addLineBreaksEnabled: false,
      addIndentEnabled: false,
      autoApply: false
    },

    // 获取配置
    get: function (key) {
      return GM_getValue(key, this.defaults[key]);
    },

    // 设置配置
    set: function (key, value) {
      GM_setValue(key, value);
    },

    // 初始化配置
    init: function () {
      // 加载所有配置项
      const config = {};
      Object.keys(this.defaults).forEach(key => {
        config[key] = this.get(key);
      });

      // 确保设置值一致
      Object.entries(config).forEach(([key, value]) => {
        this.set(key, value);
      });

      console.log("初始化脚本时读取设置:", config);
      return config;
    }
  };

  // 初始化配置
  const config = Config.init();

  /**
   * UI相关工具模块
   */
  const UI = {
    // 显示Toast消息
    showToast: function (message) {
      const toast = document.createElement("div");
      toast.textContent = message;
      toast.className = "toast";

      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = "1";
      }, 10);

      const displayTime = 2000;
      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => {
          if (toast && toast.parentNode) {
            document.body.removeChild(toast);
          }
        }, 300);
      }, displayTime);

      if (localStorage.getItem('debug_mode') === 'true') {
        console.log("显示提示:", message);
      }
    },

    // 切换面板显示状态
    togglePanelVisibility: function () {
      config.isPanelVisible = !config.isPanelVisible;
      const panel = document.getElementById("kongHangPanel");
      if (panel) {
        panel.style.display = config.isPanelVisible ? "block" : "none";
      }
      Config.set("isPanelVisible", config.isPanelVisible);
    },

    // 创建UI元素的帮助函数
    createElement: function (tag, className, attributes = {}) {
      const element = document.createElement(tag);
      if (className) element.className = className;
      Object.entries(attributes).forEach(([key, value]) => {
        if (value !== null) element.setAttribute(key, value);
      });
      return element;
    },

    // 创建数字输入控件
    createNumberInput: function (id, label, value, min, max, onChange) {
      const container = this.createElement("div", "input-container");
      const inputLabel = this.createElement("label", "input-label", { for: id });
      inputLabel.textContent = label;

      const input = this.createElement("input", "number-input", {
        id,
        type: "number",
        min,
        max,
        value
      });

      input.addEventListener("change", onChange);
      container.appendChild(inputLabel);
      container.appendChild(input);
      return { container, input };
    },

    // 创建复选框控件
    createCheckbox: function (id, label, isChecked, onChange, customClass = "") {
      const container = this.createElement("div", `checkbox-container ${customClass}`);
      const checkbox = this.createElement("input", "checkbox-input", {
        type: "checkbox",
        id,
        checked: isChecked ? "checked" : null
      });

      const checkboxLabel = this.createElement("label", customClass ? `${customClass}-label` : "checkbox-label", { for: id });
      checkboxLabel.textContent = label;
      checkbox.addEventListener("change", onChange);

      container.appendChild(checkbox);
      container.appendChild(checkboxLabel);
      return { container, checkbox };
    }
  };

  // 注册菜单命令
  GM_registerMenuCommand("显示/隐藏面板", UI.togglePanelVisibility);

  /**
   * CSS样式模块
   */
  const Styles = {
    // 基础样式
    base: `
        :root {
            font-size: 16px;
        }

        #kongHangPanel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border: 1px solid rgba(224, 224, 224, 0.8);
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            width: calc(100vw / 3);
            max-width: 288px;
            height: auto;
            max-height: 90vh;
            overflow-y: visible;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            font-size: 14px;
        }
    `,

    // 移动设备适配
    mobile: `
        @media (max-width: 768px) {
            #kongHangPanel {
                left: 50%;
                right: auto;
                bottom: 40px;
                transform: translateX(-50%);
                width: 85%;
                max-width: 400px;
                padding: 14px;
                max-height: 70vh;
                overflow-y: auto;
            }

        #kongHangPanel .input-container {
          gap: 10px;
        }

        #kongHangPanel .number-input {
          width: 45px;
          height: 30px;
          font-size: 16px;
          padding: 4px 6px;
        }

        #kongHangPanel .input-label {
          font-size: 15px;
        }

        #kongHangPanel .checkbox-container {
          padding: 8px 0;
          margin-bottom: 8px;
        }

        #kongHangPanel .checkbox-input {
          transform: scale(1.4);
          margin-right: 12px;
        }

        #kongHangPanel .checkbox-label {
          font-size: 15px;
        }

        #kongHangPanel .auto-apply-label {
          font-size: 15px;
        }

        #kongHangPanel .styled-button {
          padding: 16px 10px;
          font-size: 16px;
          border-radius: 12px;
          min-height: 24px;
        }

        #kongHangPanel .buttons-row {
          margin-top: 10px;
        }

        #kongHangPanel .title-bar {
          padding-bottom: 10px;
          margin-bottom: 15px;
        }

        #kongHangPanel .title {
          font-size: 17px;
        }

        #kongHangPanel .settings-container {
          padding: 14px;
          margin-bottom: 15px;
        }

        #kongHangPanel .options-container {
          gap: 10px;
        }

        #kongHangPanel .option-row {
          gap: 10px;
        }

        #kongHangPanel .toast {
          width: 90%;
          padding: 12px 20px;
        }
      }
    `,

    // 组件样式
    components: `
        #kongHangPanel .title-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            user-select: none;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            padding-bottom: 8px;
            position: relative;
        }

        #kongHangPanel .title {
            font-weight: 700;
            color: #1a1a1a;
            font-size: 16px;
            letter-spacing: -0.5px;
        }

        #kongHangPanel .content-area {
            transition: all 0.3s ease;
        }

        #kongHangPanel .button-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        #kongHangPanel .settings-container {
            margin-bottom: 12px;
            padding: 12px;
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            border-radius: 12px;
            border: 1px solid rgba(0, 0, 0, 0.08);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        #kongHangPanel .settings-title {
            font-weight: 600;
            margin-bottom: 8px;
            color: #2c3e50;
            font-size: 16px;
            letter-spacing: -0.3px;
        }
    `,

    // 表单控件样式
    controls: `
        #kongHangPanel .input-container {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
            gap: 8px;
        }

        #kongHangPanel .input-label {
            flex: 1;
            font-size: 14px;
            color: #34495e;
            font-weight: 500;
        }

        #kongHangPanel .number-input {
            width: 40px;
            padding: 4px 3px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 6px;
            text-align: center;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            background: #ffffff;
            min-height: 12px;
            height: 24px;
            line-height: 1;
            -webkit-appearance: none;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        #kongHangPanel .number-input:focus {
            border-color: #3498db;
            outline: none;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
            transform: translateY(-1px);
        }

        #kongHangPanel .options-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 6px;
        }

        #kongHangPanel .option-row {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        #kongHangPanel .mode-option {
            flex: 1;
        }

        #kongHangPanel .checkbox-container {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
            padding: 5px 0;
        }

        #kongHangPanel .checkbox-input {
            margin-right: 10px;
            transform: scale(1.2);
            cursor: pointer;
            accent-color: #3498db;
        }

        #kongHangPanel .checkbox-label {
            font-size: 14px;
            color: #34495e;
            cursor: pointer;
            font-weight: 500;
            line-height: 1.4;
        }

        #kongHangPanel .auto-apply-container {
            margin: 12px 0 8px 0;
            padding: 12px 14px;
            background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
            border-radius: 10px;
            border-left: 4px solid #3498db;
            box-shadow: 0 2px 8px rgba(52, 152, 219, 0.1);
        }

        #kongHangPanel .auto-apply-label {
            color: #1976d2;
            font-weight: 600;
            font-size: 14px;
        }
    `,

    // 按钮样式
    buttons: `
        #kongHangPanel .buttons-row {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
            width: 100%;
        }

        #kongHangPanel .styled-button {
            padding: 14px 8px;
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 15px;
            box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            flex: 1;
            min-height: 20px;
            -webkit-appearance: none;
            letter-spacing: 0.3px;
            position: relative;
            overflow: hidden;
        }

        #kongHangPanel .styled-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        #kongHangPanel .styled-button:hover::before {
            left: 100%;
        }

        #kongHangPanel .styled-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
        }

        #kongHangPanel .styled-button:active {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
        }

        #kongHangPanel .styled-button.reset {
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
        }

        #kongHangPanel .styled-button.reset:hover {
            box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
        }

        #kongHangPanel .styled-button.hide {
            background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
            box-shadow: 0 4px 12px rgba(149, 165, 166, 0.3);
        }

        #kongHangPanel .styled-button.hide:hover {
            box-shadow: 0 6px 20px rgba(149, 165, 166, 0.4);
        }
    `,

    // Toast消息样式
    toast: `
        #kongHangPanel .toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 14px 28px;
            border-radius: 25px;
            z-index: 999999;
            font-size: 15px;
            font-weight: 600;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            max-width: 90%;
            text-align: center;
            pointer-events: none;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
    `,

    // 深色模式
    darkMode: `
        @media (prefers-color-scheme: dark) {
            #kongHangPanel {
                background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                border-color: rgba(255, 255, 255, 0.1);
                color: #ecf0f1;
            }

            @media (max-width: 768px) {
                #kongHangPanel {
                    width: 90%;
                    max-width: none;
                    right: 5%;
                }
            }

            #kongHangPanel .title {
                color: #ecf0f1;
            }

            #kongHangPanel .settings-container {
                background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
                border-color: rgba(255, 255, 255, 0.1);
            }

            #kongHangPanel .settings-title {
                color: #ecf0f1;
            }

            #kongHangPanel .input-label,
            #kongHangPanel .radio-label,
            #kongHangPanel .checkbox-label {
                color: #bdc3c7;
            }

            #kongHangPanel .number-input {
                background: #34495e;
                border-color: rgba(255, 255, 255, 0.2);
                color: #ecf0f1;
            }

            #kongHangPanel .number-input:focus {
                border-color: #3498db;
                box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
            }

            #kongHangPanel .radio-option:hover {
                background: rgba(52, 152, 219, 0.1);
                border-color: rgba(52, 152, 219, 0.3);
            }
        }
    `,

    // 组合并应用所有样式
    applyStyles: function () {
      const allStyles = [
        this.base,
        this.mobile,
        this.components,
        this.controls,
        this.buttons,
        this.toast,
        this.darkMode
      ].join('\n');

      GM_addStyle(allStyles);
    }
  };

  // 应用所有样式
  Styles.applyStyles();

  /**
   * 内容处理模块
   */
  const ContentHandler = {
    // 查找内容元素
    getContentElements: function () {
      try {
        const selectors = [
          ".t_fsz",
          ".pcb .t_f",
          ".message",
          ".article-content",
          ".post-content",
          ".thread-content",
          "div.content",
          "div.text",
          "article"
        ];

        Debug.log("开始查找内容元素...");
        let foundElements = [];

        // 尝试所有选择器
        for (const selector of selectors) {
          const elements = document.querySelectorAll(selector);
          Debug.log(`选择器 "${selector}" 找到 ${elements.length} 个元素`);

          if (elements && elements.length > 0) {
            foundElements = elements;
            Debug.log(`使用选择器 "${selector}" 找到内容元素`);
            break;
          }
        }

        // 如果没有找到元素，尝试更通用的选择器
        if (foundElements.length === 0) {
          Debug.log("未找到匹配的内容元素，尝试查找任何包含<br>标签的元素...");
          const allElements = document.querySelectorAll("div, p, article, section");

          for (const el of allElements) {
            if (el.innerHTML.includes("<br") || el.innerHTML.includes("<BR")) {
              foundElements = [el];
              Debug.log("找到包含<br>标签的元素:", el);
              break;
            }
          }
        }

        if (foundElements.length === 0) {
          Debug.warn("未找到任何内容元素");
        } else {
          Debug.log(`共找到 ${foundElements.length} 个内容元素`);
        }

        return foundElements;
      } catch (error) {
        Debug.handleError(error, "查找内容元素");
        return [];
      }
    },

    // 应用所选模式
    applySelectedMode: function () {
      try {
        if (!config.addLineBreaksEnabled && !config.addIndentEnabled) {
          this.resetContent();
          return;
        }

        this.applyFormatting({
          addLineBreaks: config.addLineBreaksEnabled,
          addIndent: config.addIndentEnabled
        });
      } catch (error) {
        Debug.handleError(error, "应用所选模式");
      }
    },

    // 应用格式化
    applyFormatting: function (options = { addLineBreaks: false, addIndent: false }) {
      try {
        const contentElements = this.getContentElements();

        if (contentElements.length === 0) {
          UI.showToast("未找到内容区域，请尝试刷新页面后重试");
          return;
        }

        // 记录操作开始
        Debug.log("开始应用格式化:", options);

        contentElements.forEach((element) => {
          // 保存原始HTML
          if (!element.getAttribute("data-original-html")) {
            element.setAttribute("data-original-html", element.innerHTML);
          }

          let html = element.innerHTML;

          // 添加空行
          if (options.addLineBreaks) {
            const breaksToAdd = "<br>".repeat(config.lineBreaksCount);

            if (config.skipExistingBreaks) {
              // 保留已有的空行 (包括<br><br>格式)

              // 先标记已有的<br><br>格式
              html = html.replace(/<br\s*\/?>\s*<br\s*\/?>/gi,
                (match) => `___PRESERVED_BR_BR___`
              );

              // 保留已有的多个连续<br>标签
              const regex = new RegExp(`(<br\\s*\\/?>{${config.lineBreaksCount},})`, "gi");
              html = html.replace(
                regex,
                (match) => `___PRESERVED_BREAKS___${match}___END_PRESERVED_BREAKS___`
              );

              // 替换单个<br>标签
              html = html.replace(/<br\s*\/?>/gi, breaksToAdd);

              // 恢复保留的标签
              html = html.replace(/___PRESERVED_BREAKS___(.+?)___END_PRESERVED_BREAKS___/g, "$1");

              // 恢复<br><br>格式
              html = html.replace(/___PRESERVED_BR_BR___/g, "<br><br>");
            } else {
              // 替换所有<br>标签
              html = html.replace(/<br\s*\/?>/gi, breaksToAdd);
            }
          }

          // 添加缩进
          if (options.addIndent) {
            const indent = "&nbsp;".repeat(config.indentSize);

            // 在段落开始处添加缩进
            html = html
              .replace(
                /(<br\s*\/?>)(?!<br\s*\/?>)(\s*)([^<\s])/gi,
                `$1$2${indent}$3`
              )
              .replace(/(<p[^>]*>)(\s*)([^<\s])/gi, `$1$2${indent}$3`);
          }

          element.innerHTML = html;
        });

        // 检查是否有变更
        let hasChanges = false;
        contentElements.forEach((element) => {
          const originalHtml = element.getAttribute("data-original-html") || "";
          if (originalHtml !== element.innerHTML) {
            hasChanges = true;
          }
        });

        // 显示成功消息
        if (hasChanges) {
          let message = "";

          if (options.addLineBreaks && options.addIndent) {
            message = "空行和缩进添加成功";
          } else if (options.addLineBreaks) {
            message = "空行添加成功";
          } else if (options.addIndent) {
            message = "缩进添加成功";
          } else {
            message = "已应用所选模式";
          }

          Debug.log("格式化完成:", message);
          UI.showToast(message);
        } else {
          Debug.log("格式化未产生任何变更");
        }
      } catch (error) {
        Debug.handleError(error, "应用格式化");
      }
    },

    // 重置内容
    resetContent: function () {
      try {
        const contentElements = this.getContentElements();

        if (contentElements.length === 0) {
          Debug.log("没有找到内容元素，无法重置");
          return;
        }

        Debug.log("重置内容开始");

        let hasReset = false;
        contentElements.forEach((element) => {
          const originalHtml = element.getAttribute("data-original-html");
          if (originalHtml) {
            element.innerHTML = originalHtml;
            hasReset = true;
          }
        });

        if (hasReset) {
          Debug.log("内容已重置为原始状态");
          UI.showToast("已恢复原始内容");
        } else {
          Debug.log("没有需要重置的内容");
        }
      } catch (error) {
        Debug.handleError(error, "重置内容");
      }
    }
  };

  /**
   * 面板管理模块
   */
  const PanelManager = {
    // 创建控制面板
    createPanel: function () {
      const panel = UI.createElement("div", "kongHangPanel");
      panel.id = "kongHangPanel";
      panel.style.display = config.isPanelVisible ? "block" : "none";

      // 创建标题栏
      const titleBar = UI.createElement("div", "title-bar");
      const title = UI.createElement("div", "title");
      title.textContent = "空行缩进工具";
      titleBar.appendChild(title);

      // 创建内容区域
      const contentArea = UI.createElement("div", "content-area");
      const buttonContainer = UI.createElement("div", "button-container");

      // 创建设置容器
      const settingsContainer = UI.createElement("div", "settings-container");
      const settingsTitle = UI.createElement("div", "settings-title");
      settingsTitle.textContent = "设置选项";
      settingsContainer.appendChild(settingsTitle);

      // 创建选项容器
      const optionsContainer = UI.createElement("div", "options-container");

      // 空行设置
      const lineBreakRow = UI.createElement("div", "option-row");
      const lineBreaksOption = UI.createCheckbox(
        "addLineBreaks",
        "添加空行",
        config.addLineBreaksEnabled,
        (event) => {
          config.addLineBreaksEnabled = event.target.checked;
          Config.set("addLineBreaksEnabled", config.addLineBreaksEnabled);
          console.log("空行选项已更改:", config.addLineBreaksEnabled);

          // 总是重置内容
          ContentHandler.resetContent();

          // 如果启用了空行或缩进，则应用效果
          if (config.addLineBreaksEnabled || config.addIndentEnabled) {
            ContentHandler.applySelectedMode();
            UI.showToast(config.addLineBreaksEnabled ? "空行功能已开启" : "空行功能已关闭");
          } else {
            UI.showToast("所有效果已关闭");
          }
        },
        "mode-option"
      );

      const lineBreaksInput = UI.createNumberInput(
        "lineBreaksCount",
        "数量：",
        config.lineBreaksCount - 1, // 显示给用户的值比实际少1
        "1",
        "5",
        (event) => {
          // 将用户输入的值+1作为实际空行数
          const userInput = parseInt(event.target.value) || 1;
          config.lineBreaksCount = userInput + 1;
          Config.set("lineBreaksCount", config.lineBreaksCount);
          console.log("空行数量已更改:", config.lineBreaksCount, "(用户输入:", userInput, ")");

          // 如果空行功能开启，立即应用变更
          if (config.addLineBreaksEnabled) {
            ContentHandler.resetContent();
            ContentHandler.applySelectedMode();
            UI.showToast(`空行数量已更改为 ${userInput}`);
          } else {
            UI.showToast(`空行数量已保存为 ${userInput}，但未启用空行功能`);
          }
        }
      );

      lineBreakRow.appendChild(lineBreaksOption.container);
      lineBreakRow.appendChild(lineBreaksInput.container);
      optionsContainer.appendChild(lineBreakRow);

      // 缩进设置
      const indentRow = UI.createElement("div", "option-row");
      const indentOption = UI.createCheckbox(
        "addIndent",
        "添加缩进",
        config.addIndentEnabled,
        (event) => {
          config.addIndentEnabled = event.target.checked;
          Config.set("addIndentEnabled", config.addIndentEnabled);
          console.log("缩进选项已更改:", config.addIndentEnabled);

          // 总是重置内容
          ContentHandler.resetContent();

          // 如果启用了空行或缩进，则应用效果
          if (config.addLineBreaksEnabled || config.addIndentEnabled) {
            ContentHandler.applySelectedMode();
            UI.showToast(config.addIndentEnabled ? "缩进功能已开启" : "缩进功能已关闭");
          } else {
            UI.showToast("所有效果已关闭");
          }
        },
        "mode-option"
      );

      const indentSizeInput = UI.createNumberInput(
        "indentSize",
        "大小：",
        config.indentSize,
        "0",
        "10",
        (event) => {
          config.indentSize = parseInt(event.target.value) || 2;
          Config.set("indentSize", config.indentSize);

          if (config.addIndentEnabled) {
            ContentHandler.resetContent();
            ContentHandler.applySelectedMode();
            UI.showToast(`已应用缩进大小：${config.indentSize}`);
          } else {
            UI.showToast(`缩进大小已保存：${config.indentSize}（未应用，需开启缩进功能）`);
          }
        }
      );

      indentRow.appendChild(indentOption.container);
      indentRow.appendChild(indentSizeInput.container);
      optionsContainer.appendChild(indentRow);

      settingsContainer.appendChild(optionsContainer);

      // 跳过已有空行选项
      const skipExistingBreaksOption = UI.createCheckbox(
        "skipExistingBreaks",
        "跳过已有空行（不重复添加）",
        config.skipExistingBreaks,
        (event) => {
          config.skipExistingBreaks = event.target.checked;
          Config.set("skipExistingBreaks", config.skipExistingBreaks);

          // 如果已经启用了空行或缩进功能，则立即重置内容并应用新的设置
          if (config.addLineBreaksEnabled || config.addIndentEnabled) {
            ContentHandler.resetContent();
            ContentHandler.applySelectedMode();
            UI.showToast("已应用新设置：" + (config.skipExistingBreaks ? "跳过已有空行" : "处理所有空行"));
          } else {
            UI.showToast("设置已保存");
          }
        }
      );
      settingsContainer.appendChild(skipExistingBreaksOption.container);

      // 自动应用选项
      const autoApplyOption = UI.createCheckbox(
        "autoApply",
        "打开网页时自动应用",
        config.autoApply,
        (event) => {
          config.autoApply = event.target.checked;

          // 保存所有设置
          Object.entries(config).forEach(([key, value]) => {
            Config.set(key, value);
          });

          console.log("自动应用设置已更改:", config.autoApply);

          // 如果开启了自动应用功能，并且有任何功能已启用，立即应用设置
          if (config.autoApply && (config.addLineBreaksEnabled || config.addIndentEnabled)) {
            ContentHandler.resetContent();
            ContentHandler.applySelectedMode();
            UI.showToast("已开启自动应用功能并立即应用当前设置");
          } else {
            // 显示状态提示
            UI.showToast(config.autoApply ? "已开启自动应用功能" : "已关闭自动应用功能");
          }
        },
        "auto-apply"
      );
      settingsContainer.appendChild(autoApplyOption.container);
      buttonContainer.appendChild(settingsContainer);

      // 隐藏按钮
      const buttonsRow = UI.createElement("div", "buttons-row");
      const hideButton = UI.createElement("button", "styled-button hide");
      hideButton.textContent = "隐藏";
      hideButton.style.background = "linear-gradient(to bottom, #9E9E9E, #757575)";
      hideButton.addEventListener("click", UI.togglePanelVisibility);

      buttonsRow.appendChild(hideButton);
      buttonContainer.appendChild(buttonsRow);

      contentArea.appendChild(buttonContainer);
      panel.appendChild(titleBar);
      panel.appendChild(contentArea);

      document.body.appendChild(panel);
      return panel;
    },

    // 自动应用设置
    autoApplySettings: function () {
      console.log("自动应用函数执行，状态:", {
        autoApply: config.autoApply,
        addLineBreaksEnabled: config.addLineBreaksEnabled,
        addIndentEnabled: config.addIndentEnabled
      });

      if (!config.autoApply || (!config.addLineBreaksEnabled && !config.addIndentEnabled)) {
        console.log("自动应用条件不满足，退出");
        return;
      }

      const contentElements = this.getContentElements();
      console.log("找到内容元素:", contentElements.length, "个");

      if (contentElements.length === 0) {
        console.log("未找到内容元素，退出");
        return;
      }

      console.log("开始应用格式设置");
      this.applyFormatting({
        addLineBreaks: config.addLineBreaksEnabled,
        addIndent: config.addIndentEnabled
      });
    }
  };

  /**
   * 调试和错误处理模块
   */
  const Debug = {
    // 是否启用调试模式
    debugMode: localStorage.getItem('debug_mode') === 'true',

    // 记录调试信息
    log: function (...args) {
      if (this.debugMode) {
        console.log("[空行工具]", ...args);
      }
    },

    // 记录错误信息
    error: function (...args) {
      console.error("[空行工具-错误]", ...args);
    },

    // 记录警告信息
    warn: function (...args) {
      console.warn("[空行工具-警告]", ...args);
    },

    // 启用调试模式
    enableDebugMode: function () {
      localStorage.setItem('debug_mode', 'true');
      this.debugMode = true;
      UI.showToast("调试模式已启用");
      this.log("调试模式已启用");
    },

    // 禁用调试模式
    disableDebugMode: function () {
      localStorage.setItem('debug_mode', 'false');
      this.debugMode = false;
      UI.showToast("调试模式已禁用");
    },

    // 异常处理
    handleError: function (error, context = '') {
      this.error(`${context}: ${error.message}`, error);

      // 显示用户友好的错误提示
      if (context) {
        UI.showToast(`操作失败: ${context} - ${error.message}`);
      } else {
        UI.showToast(`发生错误: ${error.message}`);
      }
    }
  };

  /**
   * 应用初始化模块
   */
  const App = {
    // 是否已初始化标志
    isInitialized: false,

    // 脚本初始化
    initializeScript: function () {
      try {
        Debug.log("脚本初始化开始");
        Debug.log("初始设置状态:", config);

        // 避免重复初始化
        if (document.getElementById("kongHangPanel")) {
          Debug.log("面板已存在，跳过初始化");
          return;
        }

        // 创建控制面板
        PanelManager.createPanel();
        Debug.log("控制面板已创建，准备执行自动应用");

        // 使用自动重试机制确保自动应用能成功执行
        this.attemptAutoApply();

        // 注册调试菜单
        this.registerDebugMenus();
      } catch (error) {
        Debug.handleError(error, "脚本初始化");
      }
    },

    // 注册调试相关的菜单项
    registerDebugMenus: function () {
      GM_registerMenuCommand("启用调试模式", Debug.enableDebugMode.bind(Debug));
      GM_registerMenuCommand("禁用调试模式", Debug.disableDebugMode.bind(Debug));
    },

    // 尝试自动应用（带重试机制）
    attemptAutoApply: function (attemptCount = 0) {
      try {
        const maxAttempts = 5;
        const attemptInterval = 800; // 毫秒

        attemptCount++;
        Debug.log(`尝试执行自动应用（第${attemptCount}次）...`);

        // 重新获取最新设置
        const updatedConfig = Config.init();

        Debug.log("当前设置状态:", updatedConfig);

        // 查找内容元素
        const contentElements = ContentHandler.getContentElements();
        Debug.log(`找到内容元素: ${contentElements.length}个`);

        // 如果满足自动应用条件则应用
        if (updatedConfig.autoApply &&
          (updatedConfig.addLineBreaksEnabled || updatedConfig.addIndentEnabled) &&
          contentElements.length > 0) {
          ContentHandler.applySelectedMode();
          Debug.log("自动应用执行成功");
        }
        // 否则在达到最大尝试次数前重试
        else if (attemptCount < maxAttempts) {
          Debug.log(`条件不满足或内容未找到，${attemptInterval}ms后重试`);
          setTimeout(() => this.attemptAutoApply(attemptCount), attemptInterval);
        }
        // 达到最大尝试次数后放弃
        else {
          Debug.warn(`已达到最大尝试次数(${maxAttempts})，停止自动应用尝试`);
        }
      } catch (error) {
        Debug.handleError(error, "自动应用过程");
      }
    },

    // 安全初始化脚本（防止重复初始化）
    safeInitializeScript: function () {
      try {
        if (!this.isInitialized) {
          this.isInitialized = true;
          Debug.log("安全初始化脚本被调用，document.readyState =", document.readyState);
          this.initializeScript();
        } else {
          Debug.log("脚本已初始化，跳过重复初始化");
        }
      } catch (error) {
        Debug.handleError(error, "安全初始化");
      }
    },

    // 启动应用
    start: function () {
      try {
        // 注册多个事件监听器以确保初始化一定会执行
        if (document.readyState === "loading") {
          Debug.log("文档加载中，注册DOMContentLoaded事件");
          document.addEventListener("DOMContentLoaded", () => this.safeInitializeScript());
        } else {
          Debug.log("文档已加载，立即执行初始化");
          setTimeout(() => this.safeInitializeScript(), 0);
        }

        // 页面完全加载后再次尝试（用于处理动态内容）
        window.addEventListener("load", () => {
          Debug.log("window.load事件触发");
          setTimeout(() => this.safeInitializeScript(), 500);
        });

        // 增加一个延迟初始化，以防其他方法失效
        setTimeout(() => {
          Debug.log("延迟初始化检查");
          this.safeInitializeScript();
        }, 2000);
      } catch (error) {
        Debug.handleError(error, "应用启动");
      }
    }
  };

  // 启动应用
  App.start();
})();