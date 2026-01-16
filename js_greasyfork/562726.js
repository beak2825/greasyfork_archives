// ==UserScript==
// @name         Qiuwei Chat Assistant
// @namespace    http://tampermonkey.net/
// @version      0.3.5
// @description  Add custom chat functionality to Qiuwei wechat admin console
// @author       You
// @match        https://siyu.qiuweiai.com/customer/wechatAdmin/wechat*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAS1BMVEX////ycnLyampuu25muGby8nLy8mrl5eXk5OT8DAz8/AzPz8/z8zONvY3Nzc3d3d3b29v/AAAMnAwAmQD//wDMzMz19SmIu4j///+ks1oiAAAAEXRSTlMAwMfg5cDHgIj+/vD7/v7AxxKKtKIAAAABYktHRACIBR1IAAAACW9GRnMAAAEtAAABagBZv0KIAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH4gERCw82Bupv1AAAAAl2cEFnAAADGgAABGMAz64W0QAAAItJREFUaN7t2UkKgEAQBEF13Pfd///UQ4n0YQRBBIXMYzEaD+ggIPpZYaRCO7pYObMlqUrswyxX2TVQDKqw4zip0WzlrEr7sFpUBQAAAAAAAAAAAHBWr6p+C/D+CwAAAAAAAAAA4BnQbKp5C2iP71oAAAAAAAAAAID/AN6Ddderzmze2/SNgzXRJ9sBPp3K24JPMHQAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMDEtMTdUMTk6MTQ6NDIrMDg6MDBqGWm5AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTAxLTE3VDE5OjE0OjQyKzA4OjAwG0TRBQAAAABJRU5ErkJggg==
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/562726/Qiuwei%20Chat%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/562726/Qiuwei%20Chat%20Assistant.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 添加 Ant Design 风格的 CSS
  const antStyles = `
        /* Ant Design 风格的基础样式 */
        :root {
            --ant-primary-color: #1890ff;
            --ant-success-color: #52c41a;
            --ant-warning-color: #faad14;
            --ant-error-color: #f5222d;
            --ant-font-size-base: 14px;
            --ant-border-radius-base: 2px;
            --ant-box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
        }

        .ant-btn {
            line-height: 1.5715;
            position: relative;
            display: inline-block;
            font-weight: 400;
            white-space: nowrap;
            text-align: center;
            background-image: none;
            border: 1px solid transparent;
            box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            user-select: none;
            touch-action: manipulation;
            height: 32px;
            padding: 4px 15px;
            font-size: 14px;
            border-radius: 2px;
            color: rgba(0, 0, 0, 0.85);
            border-color: #d9d9d9;
            background: #fff;
        }

        .ant-btn:hover {
            color: var(--ant-primary-color);
            border-color: var(--ant-primary-color);
        }

        .ant-btn-primary {
            color: #fff;
            border-color: var(--ant-primary-color);
            background: var(--ant-primary-color);
            text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
            box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
        }
            
        .ant-btn-primary:hover {
            color: #fff;
            border-color: #40a9ff;
            background: #40a9ff;
        }
        .ant-btn-warning { 
             color: #fff;
             border-color: var(--ant-warning-color);
             background: var(--ant-warning-color);
             text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
             box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
        }
        .ant-btn-warning:hover {
          color: #fff;
          border-color: #ffc53d;
          background: #ffc53d;
        }

        .ant-input {
            box-sizing: border-box;
            margin: 0;
            padding: 4px 11px;
            color: rgba(0, 0, 0, 0.85);
            font-size: 14px;
            line-height: 1.5715;
            list-style: none;
            position: relative;
            display: inline-block;
            width: 100%;
            min-width: 0;
            background-color: #fff;
            background-image: none;
            border: 1px solid #d9d9d9;
            border-radius: 2px;
            transition: all 0.3s;
        }

        .ant-input:hover {
            border-color: #40a9ff;
            border-right-width: 1px !important;
        }

        .ant-input:focus {
            border-color: #40a9ff;
            border-right-width: 1px !important;
            outline: 0;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }

        .ant-textarea {
            max-width: 100%;
            height: auto;
            min-height: 100px;
            line-height: 1.5715;
            vertical-align: bottom;
            transition: all 0.3s, height 0s;
            resize: vertical;
        }

        .ant-card {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            color: rgba(0, 0, 0, 0.85);
            font-size: 14px;
            font-variant: tabular-nums;
            line-height: 1.5715;
            list-style: none;
            font-feature-settings: 'tnum';
            position: relative;
            background: #fff;
            border-radius: 2px;
            transition: all 0.3s;
        }

        .ant-card-bordered {
            border: 1px solid #f0f0f0;
        }

        .ant-card-head {
            min-height: 48px;
            margin-bottom: -1px;
            padding: 0 24px;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 500;
            font-size: 16px;
            background: transparent;
            border-bottom: 1px solid #f0f0f0;
            border-radius: 2px 2px 0 0;
        }

        .ant-card-head-title {
            display: inline-block;
            flex: 1;
            padding: 16px 0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .ant-card-extra {
            float: right;
            margin-left: auto;
            padding: 16px 0;
            color: rgba(0, 0, 0, 0.85);
            font-weight: normal;
            font-size: 14px;
        }

        .ant-card-body {
            padding: 24px;
            max-height: 70vh;
            overflow-y: auto;
            overflow-x: hidden;
        }

        /* 自定义滚动条样式 */
        .ant-card-body::-webkit-scrollbar {
            width: 8px;
        }

        .ant-card-body::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }

        .ant-card-body::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 4px;
        }

        .ant-card-body::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }

        /* Firefox 滚动条样式 */
        .ant-card-body {
            scrollbar-width: thin;
            scrollbar-color: #c1c1c1 #f1f1f1;
        }

        .ant-float-btn {
            position: fixed;
            z-index: 100;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            background-color: #fff;
            box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.08), 0 9px 28px 0 rgba(0, 0, 0, 0.05), 0 12px 48px 16px rgba(0, 0, 0, 0.03);
            border-radius: 50%;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        .ant-float-btn:hover {
            box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.12), 0 18px 56px 4px rgba(0, 0, 0, 0.1), 0 24px 80px 16px rgba(0, 0, 0, 0.06);
        }

        .ant-float-btn-primary {
            background-color: var(--ant-primary-color);
            color: #fff;
        }

        .ant-float-btn-primary:hover {
            background-color: #40a9ff;
        }

        .ant-toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .ant-toast.visible {
            opacity: 1;
        }

        /* 长文本优化样式 */
        #result-container {
            word-break: break-word;
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
            line-height: 1.6;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
            white-space: pre-wrap;
            overflow-x: hidden;
        }

        #result-container:focus {
            outline: none;
            border-color: #40a9ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }

        /* 确保长URL和数字能够正确换行 */
        #result-container * {
            word-break: break-word;
            word-wrap: break-word;
            white-space: pre-wrap;
        }

        .ant-loading {
            display: inline-block;
            animation: ant-spin 1s infinite linear;
        }

        @keyframes ant-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

  // 添加样式
  GM_addStyle(antStyles);

  // 全局状态管理
  const state = {
    initialized: false,
    floatingBtn: null,
    mainInterface: null,
    isApiRequestActive: false,
    isUserEditing: false,
    eventListeners: [],
    observers: [],
    urlCheckInterval: null,
    conversation_id: "",
    track: "",
    lastBelongUserName: "",
    lastWxNickName: "",
    prerequisiteCache: null,
    selectedPrerequisiteId: null,
    selectedPrerequisiteIndex: -1,
  };

  // 目标URL
  const TARGET_URL = "https://siyu.qiuweiai.com/customer/wechatAdmin/wechat";

  // 工具函数
  const utils = {
    // 防抖函数
    debounce(fn, delay) {
      let timer = null;
      return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(this, args);
          timer = null;
        }, delay);
      };
    },

    // 安全的DOM查询
    safeQuerySelector(selector, parent = document) {
      try {
        return parent.querySelector(selector);
      } catch (e) {
        console.warn("DOM查询失败:", selector, e);
        return null;
      }
    },

    // 安全的DOM查询所有
    safeQuerySelectorAll(selector, parent = document) {
      try {
        return parent.querySelectorAll(selector);
      } catch (e) {
        console.warn("DOM查询失败:", selector, e);
        return [];
      }
    },

    // 输入验证和清理
    sanitizeInput(input) {
      if (typeof input !== "string") return "";
      return input.trim().replace(/[<>]/g, "");
    },

    // 安全的JSON解析
    safeJsonParse(jsonString) {
      try {
        return JSON.parse(jsonString);
      } catch (e) {
        console.error("JSON解析失败:", e);
        return null;
      }
    },

    // 添加事件监听器并记录
    addEventListenerWithTracking(element, event, handler, options = {}) {
      element.addEventListener(event, handler, options);
      state.eventListeners.push({ element, event, handler, options });
    },

    // 清理所有事件监听器
    cleanupEventListeners() {
      state.eventListeners.forEach(({ element, event, handler, options }) => {
        try {
          element.removeEventListener(event, handler, options);
        } catch (e) {
          console.warn("移除事件监听器失败:", e);
        }
      });
      state.eventListeners = [];
    },

    // 清理所有观察器
    cleanupObservers() {
      state.observers.forEach((observer) => {
        try {
          observer.disconnect();
        } catch (e) {
          console.warn("断开观察器失败:", e);
        }
      });
      state.observers = [];
    },

    // 处理长文本，确保正确换行
    processLongText(text) {
      if (!text) return "";

      // 移除多余的空白字符
      let processed = text.trim();

      // 只处理真正的超长URL或数字，避免分割中文文本
      processed = processed.replace(
        /(https?:\/\/[^\s]{100,})/g,
        function (match) {
          // 对于超长URL，每100个字符插入一个换行符
          return match.match(/.{1,100}/g).join("\n");
        }
      );

      // 处理超长数字（连续数字超过50位）
      processed = processed.replace(/(\d{50,})/g, function (match) {
        return match.match(/.{1,50}/g).join("\n");
      });

      // 确保多个连续换行符不超过2个
      processed = processed.replace(/\n{3,}/g, "\n\n");

      return processed;
    },

    // 处理富文本框内容，避免重复处理
    processRichTextContent(text, isForDisplay = false) {
      if (!text) return "";

      let processed = text.trim();

      // 如果是用于显示，则处理HTML实体
      if (isForDisplay) {
        processed = processed
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
      }

      // 只处理真正的超长URL或数字，避免分割中文文本
      processed = processed.replace(
        /(https?:\/\/[^\s]{100,})/g,
        function (match) {
          // 对于超长URL，每100个字符插入一个换行符
          return match.match(/.{1,100}/g).join("\n");
        }
      );

      // 处理超长数字（连续数字超过50位）
      processed = processed.replace(/(\d{50,})/g, function (match) {
        return match.match(/.{1,50}/g).join("\n");
      });

      // 确保多个连续换行符不超过2个
      processed = processed.replace(/\n{3,}/g, "\n\n");

      return processed;
    },

    // 提取微信表情包的title属性并替换到原位置
    extractAndReplaceEmojis(htmlContent) {
      if (!htmlContent) return "";

      // 创建临时div来解析HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;

      // 查找所有wx-emoji标签
      const emojiElements = tempDiv.querySelectorAll("a.wx-emoji");

      // 遍历所有表情包元素，用title替换元素
      emojiElements.forEach((emoji) => {
        const title = emoji.getAttribute("title");
        if (title) {
          // 用title文本替换整个emoji元素
          emoji.replaceWith(title);
        } else {
          // 如果没有title，直接移除元素
          emoji.remove();
        }
      });

      // 返回处理后的文本内容
      return tempDiv.textContent.trim();
    },

    // 处理包含表情包的消息内容（保持原位置）
    processMessageWithEmojisInPosition(htmlContent) {
      if (!htmlContent) return "";

      // 使用新的表情包处理函数，保持原位置
      return this.extractAndReplaceEmojis(htmlContent);
    },
  };

  // 初始化
  function init() {
    if (state.initialized) return;

    // 清理之前的资源
    cleanup();

    // 开始监听URL变化
    startUrlChangeMonitor();

    state.initialized = true;

    // 初始检查URL
    checkCurrentUrl();
  }

  // 清理资源
  function cleanup() {
    utils.cleanupEventListeners();
    utils.cleanupObservers();

    // 清理定时器
    if (state.urlCheckInterval) {
      clearInterval(state.urlCheckInterval);
      state.urlCheckInterval = null;
    }

    // 移除现有元素
    const existingAssistant = document.getElementById("qiuwei-chat-assistant");
    const existingButton = document.getElementById("qiuwei-chat-button");

    if (existingAssistant) existingAssistant.remove();
    if (existingButton) existingButton.remove();

    // 重置状态
    state.floatingBtn = null;
    state.mainInterface = null;
    state.isApiRequestActive = false;
    state.isUserEditing = false;
  }

  // 开始监听URL变化
  function startUrlChangeMonitor() {
    // 监听history API变化
    monitorHistoryChanges();

    // 使用定时器定期检查URL (兜底方案)
    const urlCheckInterval = setInterval(checkCurrentUrl, 1000);
    state.urlCheckInterval = urlCheckInterval;

    // 监听hashchange事件
    const hashChangeHandler = () => checkCurrentUrl();
    utils.addEventListenerWithTracking(window, "hashchange", hashChangeHandler);

    // 监听popstate事件
    const popStateHandler = () => checkCurrentUrl();
    utils.addEventListenerWithTracking(window, "popstate", popStateHandler);
  }

  // 监听history API变化
  function monitorHistoryChanges() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    // 覆盖pushState
    history.pushState = function () {
      originalPushState.apply(this, arguments);
      checkCurrentUrl();
    };

    // 覆盖replaceState
    history.replaceState = function () {
      originalReplaceState.apply(this, arguments);
      checkCurrentUrl();
    };
  }

  // 检查当前URL
  function checkCurrentUrl() {
    const currentUrl = window.location.href;

    if (currentUrl.startsWith(TARGET_URL)) {
      showElements();
    } else {
      hideElements();
    }
  }

  // 显示元素
  function showElements() {
    if (state.floatingBtn && document.body.contains(state.floatingBtn)) {
      state.floatingBtn.style.display = "flex";
    } else if (!document.getElementById("qiuwei-chat-assistant")) {
      createFloatingButton();
    }

    const assistant = document.getElementById("qiuwei-chat-assistant");
    if (assistant) {
      assistant.style.display = "block";
    }
  }

  // 隐藏元素
  function hideElements() {
    if (state.floatingBtn && document.body.contains(state.floatingBtn)) {
      state.floatingBtn.style.display = "none";
    }

    const assistant = document.getElementById("qiuwei-chat-assistant");
    if (assistant) {
      assistant.style.display = "none";
    }
  }

  // 创建浮动按钮
  function createFloatingButton() {
    if (document.getElementById("qiuwei-chat-button")) return;
    if (!window.location.href.startsWith(TARGET_URL)) return;

    const chatContainer = utils.safeQuerySelector(
      ".chat-container, .message-list, .conversation-area"
    );

    const button = document.createElement("div");
    button.id = "qiuwei-chat-button";
    button.className = "ant-float-btn ant-float-btn-primary";
    button.style.cssText = `
            width: 40px;
            height: 40px;
            font-size: 18px;
            z-index: 9999;
            background-color: var(--ant-primary-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: pointer;
            box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.08);
            transition: all 0.3s;
        `;

    button.innerHTML =
      '<svg viewBox="64 64 896 896" focusable="false" data-icon="user" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path></svg>';
    button.title = "对话助手";

    if (chatContainer) {
      button.style.position = "absolute";
      chatContainer.parentNode.insertBefore(button, chatContainer);

      setTimeout(() => {
        const chatContainerRect = chatContainer.getBoundingClientRect();
        button.style.top = chatContainerRect.top - 50 + "px";
        button.style.left = "auto";
        button.style.right = "20px";
      }, 0);
    } else {
      button.style.position = "fixed";
      button.style.top = "20px";
      button.style.right = "20px";
      document.body.appendChild(button);
    }

    state.floatingBtn = button;

    // 事件处理
    const clickHandler = function (e) {
      e.stopPropagation();
      if (!window.location.href.startsWith(TARGET_URL)) return;
      this.remove();
      state.floatingBtn = null;
      createMainInterface();
    };

    const mouseEnterHandler = function () {
      this.style.transform = "scale(1.1)";
    };

    const mouseLeaveHandler = function () {
      this.style.transform = "scale(1)";
    };

    utils.addEventListenerWithTracking(button, "click", clickHandler);
    utils.addEventListenerWithTracking(button, "mouseenter", mouseEnterHandler);
    utils.addEventListenerWithTracking(button, "mouseleave", mouseLeaveHandler);

    observeDOMChanges();
  }

  // 创建主界面
  function createMainInterface() {
    if (!window.location.href.startsWith(TARGET_URL)) return;

    const container = createElement();
    const chatContainer = utils.safeQuerySelector(
      ".chat-container, .message-list, .conversation-area"
    );

    if (chatContainer) {
      container.style.position = "absolute";
      container.style.top =
        chatContainer.getBoundingClientRect().top - 10 + "px";
      container.style.right = "20px";
      chatContainer.parentNode.insertBefore(container, chatContainer);
    } else {
      document.body.appendChild(container);
    }

    state.mainInterface = container;

    if (state.prerequisiteCache) {
      renderPrerequisiteCards(state.prerequisiteCache);
    }

    setTimeout(() => {
      addEventListeners();
      capturePageContent();
    }, 100);
  }

  // 创建界面元素
  function createElement() {
    const container = document.createElement("div");
    container.id = "qiuwei-chat-assistant";
    container.className = "ant-card ant-card-bordered";
    container.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            width: 400px;
            max-width: 90vw;
            background-color: white;
            border-radius: 2px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
            box-shadow: var(--ant-box-shadow);
        `;

    container.innerHTML = `
            <div class="ant-card-head">
                <div class="ant-card-head-wrapper">
                    <div class="ant-card-head-title">对话助手</div>
                    <div class="ant-card-extra">
                        <button id="minimize-btn" class="ant-btn" style="padding: 0 8px; height: 24px;">
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="minus" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="ant-card-body">
                <div style="margin-top: -16px; display:flex; justify-content:space-between; class="ai-switch"> 
                  <button  id="refresh-converation-btn" class="ant-btn ant-btn-warning">刷新会话状态</button>
                  <button  id="intervention-btn" class="ant-btn ant-btn-warning">申请人工介入</button>
                </div>
                <div style="margin-bottom: 16px;">
                    <label for="belong_user_name" style="display: block; margin-bottom: 8px;">所属客服</label>
                    <input id="belong_user_name" class="ant-input" type="text" placeholder="请输入所属客服">
                </div>

                <div style="margin-bottom: 16px;">
                    <label for="wx_id" style="display: block; margin-bottom: 8px;">微信号</label>
                    <input id="wx_id" class="ant-input" type="text" placeholder="请输入微信号">
                    <div id="wx_id_error" style="display: none; color: var(--ant-error-color); font-size: 12px; margin-top: 4px;">微信号不能为空</div>
                </div>

                <div style="margin-bottom: 16px;">
                    <label for="message" style="display: block; margin-bottom: 8px;">消息内容</label>
                    <textarea id="message" class="ant-input ant-textarea" style="height: 100px;" placeholder="请输入消息内容"></textarea>
                </div>

                <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                    <button id="submit-btn" class="ant-btn ant-btn-primary" style="flex: 1;">提交</button>
                    <button id="capture-btn" class="ant-btn">重新获取</button>
                </div>

                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <label>返回结果</label>
                        <div>
                            <button id="copy-btn" class="ant-btn" style="margin-right: 8px;">复制</button>
                        </div>
                    </div>
                    <div id="result-container" contenteditable="true" class="ant-input ant-textarea" style="min-height: 150px; max-height: 600px; overflow-y: auto; word-break: break-word; white-space: pre-wrap; overflow-x: hidden; word-wrap: break-word; hyphens: auto;" placeholder="结果将显示在这里..."></div>
                </div>

                <div id="prerequisite-section" style="margin-bottom: 16px; display: none; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px;">
                    <div style="font-weight: 500; margin-bottom: 12px; color: #333;">前置信息</div>
                    <div id="prerequisite-wrapper" style="position: relative;">
                        <div id="prerequisite-container" style="max-height: 300px; overflow-y: auto;"></div>
                    </div>
                </div>
            </div>
        `;

    return container;
  }

  // 添加事件监听器
  function addEventListeners() {
    const container = document.getElementById("qiuwei-chat-assistant");
    if (!container) return;

    const submitBtn = document.getElementById("submit-btn");
    const copyBtn = document.getElementById("copy-btn");
    // const saveBtn = document.getElementById('save-btn');
    const captureBtn = document.getElementById("capture-btn");
    const minimizeBtn = document.getElementById("minimize-btn");
    const interventionBtn = document.getElementById("intervention-btn");
    const refreshConverationBtn = document.getElementById(
      "refresh-converation-btn"
    );

    if (
      !submitBtn ||
      !copyBtn ||
      !captureBtn ||
      !minimizeBtn ||
      !interventionBtn ||
      !refreshConverationBtn
    ) {
      console.error("无法找到必要的DOM元素");
      return;
    }

    // 使用事件委托
    const containerClickHandler = function (e) {
      e.stopPropagation();
      if (!window.location.href.startsWith(TARGET_URL)) return;

      const target = e.target;

      if (target === submitBtn || target.closest("#submit-btn")) {
        handleSubmit();
      } else if (target === copyBtn || target.closest("#copy-btn")) {
        handleCopy();
      } else if (target === captureBtn || target.closest("#capture-btn")) {
        handleReCapture();
      } else if (target === minimizeBtn || target.closest("#minimize-btn")) {
        container.remove();
        state.mainInterface = null;
        state.prerequisiteCache = null;
        state.lastBelongUserName = "";
        state.lastWxNickName = "";
        createFloatingButton();
        setTimeout(adjustButtonPosition, 100);
      } else if (
        target === interventionBtn ||
        target.closest("#intervention-btn")
      ) {
        handleIntervention();
      } else if (
        target === refreshConverationBtn ||
        target.closest("#refresh-converation-btn")
      ) {
        handleRefreshConveration();
      }
    };

    utils.addEventListenerWithTracking(
      container,
      "click",
      containerClickHandler
    );

    // 监听用户编辑
    const belongUserNameInput = document.getElementById("belong_user_name");
    const wxIdInput = document.getElementById("wx_id");
    const messageInput = document.getElementById("message");
    const nicknameInput = document.getElementById("nickname");

    if (belongUserNameInput) {
      const belongUserNameInputHandler = function () {
        state.isUserEditing = true;
      };
      utils.addEventListenerWithTracking(
        belongUserNameInput,
        "input",
        belongUserNameInputHandler
      );
    }

    if (wxIdInput) {
      const wxidInputHandler = function () {
        state.isUserEditing = true;
        // 输入时隐藏错误提示
        const errorDiv = document.getElementById("wx_id_error");
        if (errorDiv) errorDiv.style.display = "none";
        // 恢复正常边框颜色
        this.style.borderColor = "#d9d9d9";
      };
      const wxidBlurHandler = function () {
        const value = this.value.trim();
        const errorDiv = document.getElementById("wx_id_error");
        if (!value) {
          this.style.borderColor = "var(--ant-error-color)";
          if (errorDiv) errorDiv.style.display = "block";
        } else {
          this.style.borderColor = "#d9d9d9";
          if (errorDiv) errorDiv.style.display = "none";
        }
      };
      utils.addEventListenerWithTracking(wxIdInput, "input", wxidInputHandler);
      utils.addEventListenerWithTracking(wxIdInput, "blur", wxidBlurHandler);
    }

    if (messageInput) {
      const messageInputHandler = function () {
        state.isUserEditing = true;
      };
      utils.addEventListenerWithTracking(
        messageInput,
        "input",
        messageInputHandler
      );
    }

    // 添加拖动功能
    const header = container.querySelector(".ant-card-head");
    if (header) {
      makeDraggable(container, header);
    }

    // 处理结果容器的粘贴事件
    const resultContainer = document.getElementById("result-container");
    if (resultContainer) {
      const pasteHandler = function (e) {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData("text");
        if (text) {
          // 处理长文本，确保正确换行
          const processedText = utils.processRichTextContent(text, false);
          document.execCommand("insertText", false, processedText);
        }
      };
      utils.addEventListenerWithTracking(
        resultContainer,
        "paste",
        pasteHandler
      );

      // 监听输入事件，处理手动输入的长文本
      const inputHandler = function () {
        const content = this.textContent || this.innerText;
        if (content && content.length > 1000) {
          // 如果内容很长，自动处理换行
          const processedContent = utils.processRichTextContent(content, false);
          if (processedContent !== content) {
            // 保存当前光标位置
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const startOffset = range.startOffset;

            // 更新内容
            this.innerHTML = processedContent.replace(/\n/g, "<br>");

            // 恢复光标位置
            setTimeout(() => {
              try {
                const newRange = document.createRange();
                const textNode = this.firstChild || this;
                newRange.setStart(
                  textNode,
                  Math.min(startOffset, textNode.length || 0)
                );
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
              } catch (e) {
                // 如果恢复光标失败，将光标移到末尾
                const range = document.createRange();
                range.selectNodeContents(this);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
              }
            }, 0);
          }
        }
      };
      utils.addEventListenerWithTracking(
        resultContainer,
        "input",
        inputHandler
      );
    }
  }

  // 拖动功能
  function makeDraggable(element, handle) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    handle.style.cursor = "move";

    const dragMouseDown = function (e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    };

    const elementDrag = function (e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      const rect = element.getBoundingClientRect();
      let newTop = element.offsetTop - pos2;
      let newLeft = element.offsetLeft - pos1;

      if (newTop < 0) newTop = 0;
      if (newLeft < 0) newLeft = 0;
      if (newTop > window.innerHeight - 50) newTop = window.innerHeight - 50;
      if (newLeft > window.innerWidth - 50) newLeft = window.innerWidth - 50;

      element.style.top = newTop + "px";
      element.style.left = newLeft + "px";
      element.style.right = "auto";
    };

    const closeDragElement = function () {
      document.onmouseup = null;
      document.onmousemove = null;
    };

    utils.addEventListenerWithTracking(handle, "mousedown", dragMouseDown);
  }

  // 防抖的页面内容抓取
  const debouncedCapture = utils.debounce(function () {
    if (document.getElementById("qiuwei-chat-assistant")) {
      capturePageContent();
    }
  }, 300);

  // 观察DOM变化
  function observeDOMChanges() {
    const observer = new MutationObserver(
      utils.debounce(() => {
        adjustButtonPosition();
        if (
          window.location.href.startsWith(TARGET_URL) &&
          document.getElementById("qiuwei-chat-assistant")
        ) {
          capturePageContent();
        }
      }, 300)
    );

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    state.observers.push(observer);
  }

  let wx_nick_name = "";
  let belong_user_name = "";
  let wx_id = "";
  // 抓取页面内容
  function capturePageContent(forceCapture = false, retryCount = 0) {
    try {
      if (!window.location.href.startsWith(TARGET_URL)) return;
      if (state.isApiRequestActive && forceCapture) {
        showToast("请求处理中，请稍后再试");
        return;
      }
      if (state.isUserEditing && !forceCapture) {
        return;
      }

      const containers = utils.safeQuerySelectorAll(".ant-spin-container");
      const rootContainer = containers[1];

      if (!rootContainer) {
        if (retryCount < 1) {
          setTimeout(
            () => capturePageContent(forceCapture, retryCount + 1),
            300
          );
        } else {
          console.warn("未找到rootContainer，重试后依然失败");
        }
        return;
      }

      let nickname = "";
      const targetDiv = rootContainer.querySelector(
        "div.inline-block.truncate.cursor-text.overflow-hidden"
      );
      if (targetDiv && targetDiv.textContent.trim()) {
        nickname = utils.sanitizeInput(targetDiv.textContent.trim());
      }
      wx_nick_name = nickname;

      const spaceItems = rootContainer.querySelectorAll(".ant-space-item");

      // 群聊昵称后缀
      let tail = "";
      for (const item of spaceItems) {
        const targetDiv = item.querySelector("div.relative.bottom-\\[1px\\]");
        if (targetDiv && targetDiv.textContent.trim()) {
          tail = utils.sanitizeInput(targetDiv.textContent.trim());
          break;
        }
      }

      const messageInput = document.getElementById("message");
      // 提取active卡片的name
      let activeCardName = null;
      const activeCard = document.querySelector(".device-card.active");
      if (activeCard) {
        // 适配新版HTML (text-[14px]) 和旧版 (text-[12px])
        const nameDiv =
          activeCard.querySelector('[class*="text-[14px]"]') ||
          activeCard.querySelector('[class*="text-[12px]"] div');

        if (nameDiv && nameDiv.textContent) {
          activeCardName = nameDiv.textContent.trim();
        }
      }

      //ggb add 获取wxid
      const activeChatCard = document.querySelector(".chat-card.active");
      handleInterventionMark();
      // 获取data-wxid="wxid_jg6hjrs8rsgw22"
      wx_id = activeChatCard.getAttribute("data-wxid");
      document.getElementById("wx_id").value = wx_id;

      belong_user_name = activeCardName;
      if (belong_user_name && wx_nick_name) {
        if (
          belong_user_name !== state.lastBelongUserName ||
          wx_nick_name !== state.lastWxNickName
        ) {
          // 切换用户，清理缓存
          state.prerequisiteCache = null;

          state.prerequisiteTotal = 0;
          state.prerequisitePageNum = 1;

          // 清理界面显示
          const container = document.getElementById("prerequisite-container");
          if (container) {
            container.innerHTML =
              '<div style="padding: 24px; text-align: center; color: #999;"><span class="ant-loading-dot"></span> 加载中...</div>';
          }

          state.lastBelongUserName = belong_user_name;
          state.lastWxNickName = wx_nick_name;
          getPrerequisiteInformation();
        }
      }

      // 设置所属客服输入框的值
      const belongUserNameInput = document.getElementById("belong_user_name");
      if (belongUserNameInput && activeCardName) {
        belongUserNameInput.value = activeCardName;
      }

      if (
        (/群/.test(nickname) && /^\(\d+\)$/.test(tail)) ||
        /^\(\d+\)$/.test(tail)
      ) {
        if (messageInput) {
          messageInput.value = "";
          messageInput.style.height = "auto";
        }
        return;
      }

      // 消息内容抓取
      let messages = [];
      // 只获取 style 中 translateY 不等于 -9999px 的 vue-recycle-scroller__item-view 下的 message-item
      let msgItems = [];
      const scrollerViews = rootContainer.querySelectorAll(
        ".vue-recycle-scroller__item-view"
      );
      scrollerViews.forEach((view) => {
        const transform = view.style.transform || "";
        // 匹配 translateY 的值
        const match = transform.match(/translateY\((-?\d+)px\)/);
        let y = null;
        if (match) {
          y = parseInt(match[1], 10);
        }
        // 只保留 translateY 不等于 -9999 的
        if (y !== -9999) {
          const items = view.querySelectorAll("div.message-item");
          msgItems = msgItems.concat(Array.from(items));
        }
      });
      // 兼容：如果没有找到，回退原有逻辑
      if (msgItems.length === 0) {
        msgItems = Array.from(
          rootContainer.querySelectorAll("div.message-item")
        );
      }
      if (msgItems.length === 0) return;

      const lastMessageItem = msgItems[msgItems.length - 1];
      const wfullDiv = lastMessageItem.querySelector("div.w-full");
      if (!wfullDiv) return;

      const lastChild = wfullDiv.lastElementChild;
      if (!lastChild) return;

      const isLastMessageLeftSide =
        lastChild.classList.contains("item") &&
        lastChild.classList.contains("pr-[6px]") &&
        !lastChild.classList.contains("creator");

      if (!isLastMessageLeftSide) {
        if (messageInput) {
          messageInput.value = "";
          messageInput.style.height = "auto";
        }
        return;
      }

      let lastRightMessageIndex = -1;
      for (let i = msgItems.length - 1; i >= 0; i--) {
        const item = msgItems[i];
        const itemWfullDiv = item.querySelector("div.w-full");
        if (!itemWfullDiv) continue;
        const rightSideDiv = itemWfullDiv.querySelector(
          "div.creator.item.pr-\\[6px\\]"
        );
        if (rightSideDiv) {
          lastRightMessageIndex = i;
          break;
        }
      }

      if (lastRightMessageIndex >= 0) {
        for (let i = lastRightMessageIndex + 1; i < msgItems.length; i++) {
          const item = msgItems[i];
          const itemWfullDiv = item.querySelector("div.w-full");
          if (!itemWfullDiv) continue;
          const leftSideDiv = itemWfullDiv.querySelector(
            "div.item.pr-\\[6px\\]"
          );
          if (leftSideDiv && !leftSideDiv.classList.contains("creator")) {
            const textDiv = leftSideDiv.querySelector(".text");
            if (textDiv && textDiv.innerHTML.trim()) {
              const clonedTextDiv = textDiv.cloneNode(true);
              const imageMasks =
                clonedTextDiv.querySelectorAll(".ant-image-mask");
              imageMasks.forEach((mask) => mask.remove());
              // 使用新的表情包处理函数，保持原位置
              const processedText = utils.processMessageWithEmojisInPosition(
                clonedTextDiv.innerHTML
              );
              const cleanText = utils.sanitizeInput(processedText.trim());
              if (cleanText && !/^https?:\/\//.test(cleanText)) {
                messages.push(cleanText);
              }
            }
          }
        }
      } else {
        msgItems.forEach((item) => {
          const itemWfullDiv = item.querySelector("div.w-full");
          if (!itemWfullDiv) return;
          const leftSideDiv = itemWfullDiv.querySelector(
            "div.item.pr-\\[6px\\]"
          );
          if (leftSideDiv && !leftSideDiv.classList.contains("creator")) {
            const textDiv = leftSideDiv.querySelector(".text");
            if (textDiv && textDiv.innerHTML.trim()) {
              const clonedTextDiv = textDiv.cloneNode(true);
              const imageMasks =
                clonedTextDiv.querySelectorAll(".ant-image-mask");
              imageMasks.forEach((mask) => mask.remove());
              // 使用新的表情包处理函数，保持原位置
              const processedText = utils.processMessageWithEmojisInPosition(
                clonedTextDiv.innerHTML
              );
              const cleanText = utils.sanitizeInput(processedText.trim());
              if (cleanText && !/^https?:\/\//.test(cleanText)) {
                messages.push(cleanText);
              }
            }
          }
        });
      }

      if (messageInput) {
        if (messages.length > 0) {
          const combinedMessage = messages.join("\n");
          messageInput.value = combinedMessage;
          messageInput.style.height = "auto";
          messageInput.style.height = messageInput.scrollHeight + "px";
        } else {
          messageInput.value = "";
          messageInput.style.height = "auto";
        }
      }

      if (forceCapture) {
        showToast("已更新最新内容");
      }
    } catch (e) {
      console.error("获取失败:", e);
      showToast("获取失败");
    }
  }

  // 校验前置信息卡片
  function validatePrerequisiteCard(item) {
    // 示例校验逻辑：检查咨询详情是否有效
    // 可根据实际需求修改校验规则
    if (
      !item.consultation_details ||
      item.consultation_details === "-" ||
      !item.consultation_details.trim()
    ) {
      showToast("该条记录咨询详情为空，请选择其他记录");
      return false;
    }
    return true;
  }

  // 显示绑定确认框
  function showBindConfirmation(item, onConfirm, onCancel) {
    const existingModal = document.getElementById("bind-confirmation-modal");
    if (existingModal) existingModal.remove();

    const section = document.getElementById("prerequisite-section");
    const wrapper = document.getElementById("prerequisite-wrapper");

    if (!section) {
      console.warn("Prerequisite section not found");
      return;
    }

    const target = wrapper || section;

    const modal = document.createElement("div");
    modal.id = "bind-confirmation-modal";
    modal.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            z-index: 100;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            border-radius: 4px;
            backdrop-filter: blur(2px);
            padding-top: 40px;
        `;

    const content = document.createElement("div");
    content.style.cssText = `
            background: #fff;
            border-radius: 8px;
            width: 90%;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            border: 1px solid #f0f0f0;
        `;

    const header = document.createElement("div");
    header.style.cssText = `
            padding: 12px 16px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 16px;
            font-weight: 500;
            color: #000000d9;
        `;
    header.textContent = "确认绑定";

    const body = document.createElement("div");
    body.style.cssText = `
            padding: 16px;
            font-size: 14px;
            color: #000000d9;
            line-height: 1.5;
        `;
    const wxId = document.getElementById("wx_id")?.value || "未知";
    body.innerHTML = `是否确认将“<span style="font-weight: bold;">${
      item.wx_nick_name || "-"
    }</span>”的信息绑定到“<span style="font-weight: bold;">${wxId}</span>”？`;

    const footer = document.createElement("div");
    footer.style.cssText = `
            padding: 8px 16px;
            text-align: right;
            border-top: 1px solid #f0f0f0;
            background: transparent;
        `;

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "ant-btn";
    cancelBtn.style.marginRight = "8px";
    cancelBtn.textContent = "取消";
    cancelBtn.onclick = function () {
      modal.remove();
      if (onCancel) onCancel();
    };

    const confirmBtn = document.createElement("button");
    confirmBtn.className = "ant-btn ant-btn-primary";
    confirmBtn.textContent = "确认";
    confirmBtn.onclick = function () {
      modal.remove();
      if (onConfirm) onConfirm();
    };

    footer.appendChild(cancelBtn);
    footer.appendChild(confirmBtn);

    content.appendChild(header);
    content.appendChild(body);
    content.appendChild(footer);
    modal.appendChild(content);

    target.appendChild(modal);
  }

  // 渲染前置信息卡片
  function renderPrerequisiteCards(data, isSelectable = false) {
    const section = document.getElementById("prerequisite-section");
    const container = document.getElementById("prerequisite-container");
    if (!section || !container) return;

    if (!data || (Array.isArray(data) && data.length === 0)) {
      container.innerHTML = "";
      section.style.display = "none";
      return;
    }

    section.style.display = "block";
    section.style.backgroundColor = "#fafafa";
    section.style.border = "1px solid #f0f0f0";

    // 修复第一条数据被遮挡的问题，添加内边距
    container.style.padding = "12px";
    // 确保容器有最大高度并可滚动，防止占用过多空间
    container.style.maxHeight = "500px";
    container.style.overflowY = "auto";

    // 注入卡片样式
    if (!document.getElementById("prerequisite-card-styles")) {
      const style = document.createElement("style");
      style.id = "prerequisite-card-styles";
      style.textContent = `
                .prerequisite-card {
                    background: #fff;
                    border-radius: 12px;
                    margin-bottom: 16px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    border: 1px solid #e8e8e8;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }
                .prerequisite-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.12);
                    border-color: #40a9ff;
                }
                .prerequisite-card.selected {
                    border-color: #1890ff;
                    background-color: #f0f9ff;
                    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
                }
                .prerequisite-card .check-mark {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-width: 0 32px 32px 0;
                    border-color: transparent #1890ff transparent transparent;
                    display: none;
                    z-index: 1;
                }
                .prerequisite-card.selected .check-mark {
                    display: block;
                }
                .prerequisite-card .check-icon {
                    position: absolute;
                    top: -30px;
                    right: 2px;
                    color: #fff;
                    font-size: 12px;
                    font-weight: bold;
                    transform: rotate(45deg); /* Adjust if needed, but simpler to just place text */
                }
                /* Fixed icon positioning */
                .prerequisite-card .check-mark::after {
                    content: '✓';
                    position: absolute;
                    top: 2px;
                    right: -28px;
                    color: #fff;
                    font-size: 12px;
                    font-weight: bold;
                }
            `;
      document.head.appendChild(style);
    }

    let html = "";
    const items = Array.isArray(data) ? data : [data];

    // 记录滚动位置
    const previousScrollTop = container.scrollTop;

    items.forEach((item, index) => {
      html += `
                <div class="prerequisite-card" data-index="${index}">
                    <div class="check-mark"></div>
                    <div style="padding: 16px;">
                        <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <div style="flex: 1; padding-right: 12px; border-right: 1px solid #f0f0f0;">
                                <p style="margin: 0; color: #262626; font-size: 16px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${
                                  item.wx_nick_name || item.nickname || "-"
                                }">${item.wx_nick_name || "-"}</p>
                            </div>
                            <div style="flex: 1; padding-left: 12px;">
                                <p style="margin: 0; color: #262626; font-size: 16px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${
                                  item.phone || "-"
                                }</p>
                            </div>
                        </div>

                        <div style="margin-bottom: 12px;">
                            <p style="margin: 0; color: #595959; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${
                              item.consultation_details || "-"
                            }</p>
                        </div>
                        
                        <div style="text-align: right;">
                            <span style="display: inline-block; background: #f5f5f5; color: #8c8c8c; font-size: 12px; padding: 4px 8px; border-radius: 4px;">${
                              item.create_time || "-"
                            }</span>
                        </div>
                    </div>
                </div> 
            `;
    });

    container.innerHTML = html;

    // 保持滚动位置
    if (isSelectable && state.prerequisitePageNum > 1) {
      container.scrollTop = previousScrollTop;
    }

    // 添加滚动监听
    if (isSelectable) {
      if (!container.dataset.hasScrollListener) {
        container.addEventListener(
          "scroll",
          utils.debounce(function () {
            const { scrollTop, scrollHeight, clientHeight } = this;
            if (scrollTop + clientHeight >= scrollHeight - 20) {
              const currentCount = (state.prerequisiteCache || []).length;
              const total = state.prerequisiteTotal || 0;
              if (currentCount < total && !state.isListLoading) {
                const nextPage = (state.prerequisitePageNum || 1) + 1;
                getPrerequisiteInformationList(nextPage);
              }
            }
          }, 200)
        );
        container.dataset.hasScrollListener = "true";
      }
    }

    // 添加点击事件
    const cards = container.querySelectorAll(".prerequisite-card");
    if (isSelectable) {
      cards.forEach((card) => {
        card.addEventListener("click", function () {
          const index = parseInt(this.getAttribute("data-index"));
          const selectedItem = items[index];

          // 执行校验
          if (!validatePrerequisiteCard(selectedItem)) {
            return;
          }

          // 获取校验所需字段
          const wxIdInput = document.getElementById("wx_id");
          const wxId = wxIdInput ? wxIdInput.value.trim() : "";

          const belongUserNameInput =
            document.getElementById("belong_user_name");
          const belongUserName = belongUserNameInput
            ? belongUserNameInput.value.trim()
            : "";

          const selectedId = selectedItem.id;

          // 校验逻辑
          if (!wxId) {
            showToast("微信id不能为空");
            return;
          }

          if (!belongUserName) {
            showToast("所属用户名获取失败");
            return;
          }

          if (!selectedId) {
            showToast("前置信息id不能为空");
            return;
          }

          // 移除其他卡片的选中状态
          cards.forEach((c) => c.classList.remove("selected"));

          // 设置当前卡片选中状态
          this.classList.add("selected");

          // 记录选中的数据索引
          state.selectedPrerequisiteIndex = index;

          // 弹出确认框
          showBindConfirmation(
            selectedItem,
            () => {
              // 确认回调
              state.selectedPrerequisiteId = selectedItem.id;
              bindConversation();
            },
            () => {
              // 取消回调
              this.classList.remove("selected");
              state.selectedPrerequisiteIndex = -1;
              state.selectedPrerequisiteId = null;
            }
          );
        });
      });
    } else {
      // 如果不可选，移除鼠标手势
      cards.forEach((card) => {
        card.style.cursor = "default";
      });
    }
  }

  function getPrerequisiteInformation() {
    if (belong_user_name == "" || belong_user_name == null) {
      showToast("所属用户名获取失败");
      return;
    }
    if (wx_nick_name == "" || wx_nick_name == null) {
      showToast("微信昵称获取失败");
      return;
    }
    setTimeout(() => {
      ajaxRequest({
        method: "POST",
        url: "https://plugin.fengyu-ai.com/api/prerequisiteInformation/getDetailForAssistant",
        data: JSON.stringify({
          belong_user_name: belong_user_name,
          wx_nick_name: wx_nick_name,
        }),
        success: function (response) {
          state.isApiRequestActive = false;
          try {
            const result = utils.safeJsonParse(response);
            if (result && result.code === 200) {
              state.prerequisiteCache = result.data;
              // 详情接口返回的数据不需要选中效果
              renderPrerequisiteCards(result.data, false);
            } else {
              getPrerequisiteInformationList();
            }
          } catch (e) {
            console.error("解析响应失败:", e);
            const resultContainer = document.getElementById("result-container");
            if (resultContainer) {
              resultContainer.innerHTML =
                utils.formatResponse(response) ||
                '<div style="color: var(--ant-error-color);">解析响应失败</div>';
            }
          }
          const submitBtn = document.getElementById("submit-btn");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
            submitBtn.style.cursor = "pointer";
          }
        },
        error: function () {
          state.isApiRequestActive = false;
          const resultContainer = document.getElementById("result-container");
          if (resultContainer) {
            resultContainer.innerHTML =
              '<div style="color: var(--ant-error-color);">请求失败，请重试</div>';
          }
          const submitBtn = document.getElementById("submit-btn");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
            submitBtn.style.cursor = "pointer";
          }
        },
      });
    }, 0);
  }

  function getPrerequisiteInformationList(pageNum = 1, pageSize = 10) {
    if (state.isListLoading) return;

    if (belong_user_name == "" || belong_user_name == null) {
      showToast("所属用户名获取失败");
      return;
    }
    if (wx_nick_name == "" || wx_nick_name == null) {
      showToast("微信昵称获取失败");
      return;
    }

    state.isListLoading = true;

    setTimeout(() => {
      ajaxRequest({
        method: "POST",
        url: "https://plugin.fengyu-ai.com/api/prerequisiteInformation/getListForAssistant",
        data: JSON.stringify({
          pageNum: pageNum,
          pageSize: pageSize,
          belong_user_name: belong_user_name,
          wx_nick_name: wx_nick_name,
        }),
        success: function (response) {
          state.isListLoading = false;
          state.isApiRequestActive = false;
          try {
            const result = utils.safeJsonParse(response);
            if (result && result.code === 200) {
              const data = result.data || {};
              const list = data.records || (Array.isArray(data) ? data : []);
              const total = data.total || 0;

              state.prerequisiteTotal = total;
              state.prerequisitePageNum = pageNum;

              if (pageNum === 1) {
                state.prerequisiteCache = list;
              } else {
                state.prerequisiteCache = (
                  state.prerequisiteCache || []
                ).concat(list);
              }

              // 列表接口返回的数据需要选中效果
              renderPrerequisiteCards(state.prerequisiteCache, true);

              const submitBtn = document.getElementById("submit-btn");
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
                submitBtn.style.cursor = "pointer";
              }
            } else {
              const submitBtn = document.getElementById("submit-btn");
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
                submitBtn.style.cursor = "pointer";
              }
            }
          } catch (e) {
            console.error("解析响应失败:", e);
            const resultContainer = document.getElementById("result-container");
            if (resultContainer) {
              resultContainer.innerHTML =
                utils.formatResponse(response) ||
                '<div style="color: var(--ant-error-color);">解析响应失败</div>';
            }
            const submitBtn = document.getElementById("submit-btn");
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.style.opacity = "1";
              submitBtn.style.cursor = "pointer";
            }
          }
        },
        error: function () {
          state.isListLoading = false;
          state.isApiRequestActive = false;
          const resultContainer = document.getElementById("result-container");
          if (resultContainer) {
            resultContainer.innerHTML =
              '<div style="color: var(--ant-error-color);">请求失败，请重试</div>';
          }
          const submitBtn = document.getElementById("submit-btn");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
            submitBtn.style.cursor = "pointer";
          }
        },
      });
    }, 0);
  }

  function bindConversation() {
    const wx_id = document.getElementById("wx_id")?.value;
    if (
      state.selectedPrerequisiteId == "" ||
      state.selectedPrerequisiteId == null
    ) {
      showToast("前置信息id不能为空");
      return;
    }
    if (wx_id == "" || wx_id == null) {
      showToast("微信id不能为空");
      return;
    }
    if (belong_user_name == "" || belong_user_name == null) {
      showToast("所属用户名获取失败");
      return;
    }
    setTimeout(() => {
      ajaxRequest({
        method: "POST",
        url: "https://plugin.fengyu-ai.com/api/prerequisiteInformation/bindConversation",
        data: JSON.stringify({
          id: state.selectedPrerequisiteId,
          wx_id: wx_id,
          belong_user_name: belong_user_name,
        }),
        success: function (response) {
          state.isApiRequestActive = false;
          try {
            const result = utils.safeJsonParse(response);
            if (result && result.code === 200) {
              showToast("绑定成功");
              // 绑定成功后重置编辑状态，恢复自动抓取
              state.isUserEditing = false;
              // 绑定成功后刷新前置信息
              getPrerequisiteInformation();
            } else {
              showToast(result?.message || "绑定失败");
              const submitBtn = document.getElementById("submit-btn");
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
                submitBtn.style.cursor = "pointer";
              }
            }
          } catch (e) {
            console.error("解析响应失败:", e);
            showToast("绑定失败：解析响应异常");
            const submitBtn = document.getElementById("submit-btn");
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.style.opacity = "1";
              submitBtn.style.cursor = "pointer";
            }
          }
        },
        error: function () {
          state.isApiRequestActive = false;
          showToast("绑定请求失败");
          const submitBtn = document.getElementById("submit-btn");
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
            submitBtn.style.cursor = "pointer";
          }
        },
      });
    }, 0);
  }

  // 处理提交
  function handleSubmit() {
    const message = document.getElementById("message")?.value;
    const belong_user_name = document.getElementById("belong_user_name")?.value;
    const wx_id = document.getElementById("wx_id")?.value;
    const submitBtn = document.getElementById("submit-btn");

    if (!wx_id || !wx_id.trim()) {
      const wxIdInput = document.getElementById("wx_id");
      const errorDiv = document.getElementById("wx_id_error");
      if (wxIdInput) {
        wxIdInput.style.borderColor = "var(--ant-error-color)";
        wxIdInput.focus();
      }
      if (errorDiv) {
        errorDiv.style.display = "block";
      }
      return;
    }

    const resultContainer = document.getElementById("result-container");
    if (!resultContainer) return;

    // 禁用提交按钮
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.5";
    submitBtn.style.cursor = "not-allowed";

    resultContainer.innerHTML =
      '<div style="color: #888;"><span class="ant-loading-dot"></span> 正在处理请求...</div>';

    const processedMessage = utils.preprocessMessage(message);
    state.isApiRequestActive = true;

    setTimeout(() => {
      ajaxRequest({
        method: "POST",
        url: "https://samantha.fengyu-ai.com/api/assistant/assistantChat",
        data: JSON.stringify({
          content: processedMessage,
          // userName: nickname,
          belongUserName: belong_user_name,
          wxId: wx_id,
        }),
        success: function (response) {
          state.isApiRequestActive = false;
          try {
            const result = utils.safeJsonParse(response);
            if (result && result.code === 200) {
              resultContainer.innerHTML = utils.formatResponse(
                result.data.reply || "无回复内容"
              );
              state.conversation_id = result.data.conversation_id;
              state.track = result.data.track;
              state.message_id = result.data.message_id;
            } else {
              resultContainer.innerHTML = `<div style="color: var(--ant-error-color);">请求失败: ${
                result?.message || "未知错误"
              }</div>`;
            }
          } catch (e) {
            console.error("解析响应失败:", e);
            resultContainer.innerHTML =
              utils.formatResponse(response) ||
              '<div style="color: var(--ant-error-color);">解析响应失败</div>';
          }
          submitBtn.disabled = false;
          submitBtn.style.opacity = "1";
          submitBtn.style.cursor = "pointer";
        },
        error: function () {
          state.isApiRequestActive = false;
          resultContainer.innerHTML =
            '<div style="color: var(--ant-error-color);">请求失败，请重试</div>';
          simulateResponse();
          submitBtn.disabled = false;
          submitBtn.style.opacity = "1";
          submitBtn.style.cursor = "pointer";
        },
      });
    }, 0);
  }

  // 预处理消息内容
  utils.preprocessMessage = function (message) {
    if (!message) return "";
    return message.replace(/\n{3,}/g, "\n\n");
  };

  // AJAX请求
  function ajaxRequest(options) {
    const { method, url, data, success, error } = options;

    try {
      GM_xmlhttpRequest({
        method: method,
        url: url,
        data: data,
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 300000,
        onload: function (response) {
          try {
            if (response.status >= 200 && response.status < 300) {
              success(response.responseText);
            } else {
              console.error("请求失败:", response.status, response.statusText);
              error(response);
            }
          } catch (e) {
            console.error("处理响应失败:", e);
            error(e);
          }
        },
        onerror: function (err) {
          console.error("请求错误:", err);
          error(err);
        },
        ontimeout: function () {
          console.error("请求超时");
          error(new Error("请求超时：已等待300秒"));
        },
      });
    } catch (e) {
      console.error("发送请求失败:", e);
      error(e);
    }
  }

  // 格式化响应
  utils.formatResponse = function (text) {
    if (!text) return "";

    let decoded = utils.processRichTextContent(text, true); // 使用processRichTextContent处理富文本

    if (decoded.includes("工作流请求超时") || decoded.includes("请稍后重试")) {
      return `<div style="color: var(--ant-warning-color); font-weight: bold; padding: 8px; background-color: rgba(250, 173, 20, 0.1); border-radius: 4px;">${decoded.replace(
        /\n/g,
        "<br>"
      )}</div>`;
    }

    return decoded.replace(/\n/g, "<br>");
  };

  // 模拟响应
  function simulateResponse() {
    const resultContainer = document.getElementById("result-container");
    if (!resultContainer) return;

    setTimeout(() => {
      resultContainer.innerHTML =
        utils.formatResponse("工作流请求超时,请稍后重试。");
    }, 800);
  }

  // 处理复制
  function handleCopy() {
    const resultContainer = document.getElementById("result-container");
    if (!resultContainer) return;

    const text = resultContainer.innerText;
    copyTextToClipboard(text);
  }

  // 复制到剪贴板
  function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          showToast("已复制到剪贴板");
        })
        .catch((err) => {
          console.error("复制失败:", err);
          showToast("复制失败，请重试");
        });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        showToast("已复制到剪贴板");
      } catch (err) {
        console.error("复制失败:", err);
        showToast("复制失败，请重试");
      }

      document.body.removeChild(textArea);
    }
  }

  // 保存到本地存储
  function saveToLocalStorage(content) {
    try {
      const savedResponses = GM_getValue("savedResponses", []);
      savedResponses.push({
        conversation_id: state.conversation_id,
        content: content,
        contentTracking: state.track,
        messageId: state.message_id,
        timestamp: new Date().toISOString(),
      });
      GM_setValue("savedResponses", savedResponses);
      showToast("已保存到本地");
    } catch (e) {
      console.error("本地保存失败:", e);
      showToast("无法保存内容");
    }
  }
  //显示人工介入弹框
  function showInterventionModal() {
    // Remove any existing intervention modals
    const existingModal = document.getElementById("intervention-modal");
    if (existingModal) existingModal.remove();

    // Create modal overlay
    const modal = document.createElement("div");
    modal.id = "intervention-modal";
    modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10001;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

    // Create modal content
    const content = document.createElement("div");
    content.style.cssText = `
    background: white;
    border-radius: 8px;
    padding: 24px;
    max-width: 400px;
    width: 80%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    position: relative;
  `;

    // Modal header
    const header = document.createElement("h3");
    header.textContent = "转人工原因";
    header.style.cssText = `
    margin-top: 0;
    margin-bottom: 16px;
    color: #333;
    font-size: 16px;
    font-weight: 500;
  `;

    // Modal body
    const body = document.createElement("textarea");
    body.placeholder = "请输入申请人工介入的原因...";
    body.rows = 4;
    body.style.cssText = `
    width: 100%;
    padding: 8px 12px;
    margin: 16px 0;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    resize: none;  /* 禁止拖动调整大小 */
    font-size: 14px;
    line-height: 1.5;
    color: #666;
    box-sizing: border-box;
  `;

    // Modal buttons container
    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
  `;

    // Cancel button
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "取消";
    cancelButton.className = "ant-btn";
    cancelButton.style.cssText = `
    padding: 4px 15px;
    height: 32px;
    font-size: 14px;
    border-radius: 2px;
  `;
    cancelButton.addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    // Confirm button
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "确认";
    confirmButton.className = "ant-btn ant-btn-warning";
    confirmButton.style.cssText = `
    padding: 4px 15px;
    height: 32px;
    font-size: 14px;
    border-radius: 2px;
  `;
    confirmButton.addEventListener("click", () => {
      // Handle the intervention request here
      handleInterventionRequest(modal);
      // document.body.removeChild(modal);
    });

    // Assemble the modal
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(confirmButton);
    content.appendChild(header);
    content.appendChild(body);
    content.appendChild(buttonContainer);
    modal.appendChild(content);
    document.body.appendChild(modal);
  }

  // 显示Toast
  function showToast(message, s = 300) {
    const existingToast = document.querySelector(".ant-toast");
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = "ant-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("visible");
      setTimeout(() => {
        toast.classList.remove("visible");
        setTimeout(() => toast.remove(), 100);
      }, s);
    });
  }

  // 调整按钮位置
  function adjustButtonPosition() {
    if (!state.floatingBtn || !document.body.contains(state.floatingBtn))
      return;

    if (!window.location.href.startsWith(TARGET_URL)) {
      hideElements();
      return;
    }

    const chatContainer = utils.safeQuerySelector(
      ".chat-container, .message-list, .conversation-area, .chat-box"
    );
    if (chatContainer) {
      const chatContainerRect = chatContainer.getBoundingClientRect();
      state.floatingBtn.style.position = "absolute";
      state.floatingBtn.style.top = chatContainerRect.top - 50 + "px";
      state.floatingBtn.style.left = "auto";
      state.floatingBtn.style.right = "20px";
    }
  }
  //刷新标记
  function handleRefreshConveration() {
    handleInterventionMark();
  }

  //人工介入
  function handleIntervention() {
    //显示弹框
    showInterventionModal();
  }
  //人工打标记
  function handleInterventionMark() {
    let activeCardName = null;
    const activeCard = document.querySelector(".device-card.active");
    if (activeCard) {
      // 适配新版HTML (text-[14px]) 和旧版 (text-[12px])
      const nameDiv =
        activeCard.querySelector('[class*="text-[14px]"]') ||
        activeCard.querySelector('[class*="text-[12px]"] div');

      if (nameDiv && nameDiv.textContent) {
        activeCardName = nameDiv.textContent.trim();
      }
    }
    if (!activeCardName) {
      return;
    }

    const allChatCards = document.querySelectorAll(".chat-card");
    let user_wx_ids = [];
    for (let i = 0; i < allChatCards.length; i++) {
      const chatCard = allChatCards[i];
      const wxid = chatCard.getAttribute("data-wxid");
      user_wx_ids.push(wxid);
    }
    if (user_wx_ids.length === 0) {
      return;
    }
    setTimeout(() => {
      ajaxRequest({
        method: "POST",
        url: "https://bms.fengyu-ai.com/api/userConversation/queryStateList",
        data: JSON.stringify({
          customer_service_name: activeCardName,
          user_wx_ids: user_wx_ids,
        }),
        success: function (response) {
          try {
            const result = utils.safeJsonParse(response);
            if (result && result.code === 200) {
              addSemiautomaticLabel(result.data);
              //获取所有的.chat-card.追加一个span标签  <span style="">半自动</span>
            } else {
            }
          } catch (e) {
            console.error("解析响应失败:", e);
            showToast("提交失败，请重试", 2000);
          }
        },
        error: function () {
          showToast("提交失败，请重试", 2000);
        },
      });
    }, 0);
  }
  function addSemiautomaticLabel(wxIds) {
    const chatCards = document.querySelectorAll(".chat-card");

    chatCards.forEach((card) => {
      // Remove any existing label span with our custom class
      const existingLabel = card.querySelector(".conversation-label");
      if (existingLabel) {
        existingLabel.remove();
      }

      const wxId = card.getAttribute("data-wxid");

      for (let i = 0; i < wxIds.length; i++) {
        if (wxId === wxIds[i].user_wx_id) {
          let human_intervention_state = wxIds[i].human_intervention_state;
          let operate_mode = wxIds[i].operate_mode;
          let bgColor = "";
          let textContent = "";
          let borderColor = "";
          let textColor = "";

          if (human_intervention_state == 1) {
            bgColor = "#FFEBEE";
            textColor = "#C62828";
            borderColor = "#FFCDD2";
            textContent = "人工介入";
          } else if (human_intervention_state === 0) {
            if (operate_mode === 1) {
              bgColor = "#E8F5E9";
              textColor = "#2E7D32";
              borderColor = "#A5D6A7";

              textContent = "全自动";
            } else if (operate_mode === 2) {
              bgColor = "#FFF8E1";
              textColor = "#F57F17";
              borderColor = "#FFE082";
              textContent = "半自动";
            }
          }

          const span = document.createElement("span");
          span.className = "conversation-label";
          span.style.cssText = "position: absolute; right: 0; bottom: 0;";
          span.style.color = textColor;
          span.style.backgroundColor = bgColor;
          span.style.border = `1px solid ${borderColor}`;
          span.style.fontSize = "12px";
          span.style.padding = "2px 5px";
          span.style.borderRadius = "4px";
          span.textContent = textContent;
          card.appendChild(span);
        }
      }
    });
  }

  // 处理人工介入请求
  function handleInterventionRequest(modal) {
    const wx_id = document.getElementById("wx_id")?.value;
    const belong_user_name = document.getElementById("belong_user_name")?.value;
    const customer_service_name = belong_user_name.trim();

    // 获取textarea中的原因
    const reasonTextarea = modal ? modal.querySelector("textarea") : null;
    const reason = reasonTextarea ? reasonTextarea.value.trim() : "";
    if (!customer_service_name || !customer_service_name.trim()) {
      showToast("客服名称不能为空", 2000);
      return;
    }

    if (!wx_id || !wx_id.trim()) {
      showToast("微信号不能为空", 2000);
      return;
    }

    if (!reason) {
      showToast("请输入人工介入原因", 2000);
      return;
    }

    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.5";
      submitBtn.style.cursor = "not-allowed";
    }

    // 关闭弹窗
    if (modal) {
      modal.remove();
    }
    console.log(
      JSON.stringify({
        user_wx_id: wx_id,
        customer_service_name: customer_service_name,
        human_intervention_state: "AI",
        operator_role: "AI",
        modify_reason: reason,
      })
    );
    // 发送人工介入请求
    setTimeout(() => {
      ajaxRequest({
        method: "POST",
        url: "https://samantha.fengyu-ai.com/api/userConversation/modifyHumanInterventionState",
        data: JSON.stringify({
          user_wx_id: wx_id,
          customer_service_name: customer_service_name,
          human_intervention_state: "AI",
          operator_role: "AI",
          modify_reason: reason,
        }),
        success: function (response) {
          try {
            const result = utils.safeJsonParse(response);
            if (result && result.code === 200) {
              showToast("人工介入申请已提交", 2000);
              handleInterventionMark();
            } else {
              showToast(`申请失败: ${result?.message || "未知错误"}`, 2000);
            }
          } catch (e) {
            console.error("解析响应失败:", e);
            showToast("提交失败，请重试", 2000);
          }

          // if (submitBtn) {
          //   submitBtn.disabled = false;
          //   submitBtn.style.opacity = "1";
          //   submitBtn.style.cursor = "pointer";
          // }
        },
        error: function () {
          showToast("提交失败，请重试", 2000);
          // if (submitBtn) {
          //   submitBtn.disabled = false;
          //   submitBtn.style.opacity = "1";
          //   submitBtn.style.cursor = "pointer";
          // }
        },
      });
    }, 0);
  }
  // 智能重新获取处理
  function handleReCapture() {
    const wxIdInput = document.getElementById("wx_id");
    const messageInput = document.getElementById("message");
    const belongUserNameInput = document.getElementById("belong_user_name");

    if (!wxIdInput || !messageInput || !belongUserNameInput) return;

    // 清空消息内容
    messageInput.value = "";
    messageInput.style.height = "auto";

    // 重置用户编辑状态
    state.isUserEditing = false;

    // 重新获取页面内容
    capturePageContent(true);
  }

  // 页面加载完成后初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // 监听导航完成事件
  window.addEventListener("load", () => {
    if (!state.initialized) {
      init();
    }
    checkCurrentUrl();
  });

  // 监听SPA路由变化
  window.addEventListener("popstate", checkCurrentUrl);
  window.addEventListener("pushstate", checkCurrentUrl);
  window.addEventListener("replacestate", checkCurrentUrl);

  // 页面卸载时清理资源
  window.addEventListener("beforeunload", cleanup);
})();
