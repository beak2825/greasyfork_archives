// ==UserScript==
// @name         API请求监控工具
// @namespace         http://howe.com
// @version           1.8
// @author            howe
// @description  监控网页API请求并在新窗口中显示详细信息
// @include           *://24.*
// @include           *://ybj.shanxi.gov.cn/ybfw/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @noframes
// @license           GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/555052/API%E8%AF%B7%E6%B1%82%E7%9B%91%E6%8E%A7%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/555052/API%E8%AF%B7%E6%B1%82%E7%9B%91%E6%8E%A7%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // API请求历史记录
  let requestHistory = [];
  // 历史记录最大保存数量
  const MAX_HISTORY_SIZE = 100;
  // 是否开始监控
  let isMonitoring = false;
  // 原始fetch和XMLHttpRequest方法
  let originalFetch = window.fetch;
  let originalXHROpen = XMLHttpRequest.prototype.open;
  let originalXHRSend = XMLHttpRequest.prototype.send;
  // 控制台日志历史
  let consoleLogs = [];
  // 原始console方法
  let originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug,
  };
  // 监控URL关键字列表
  let monitorKeywords = [];

  // 移除不再需要的全局copyToClipboard函数，已移至monitorWindow对象中

  // 立即拦截控制台方法，确保从页面加载开始就能捕获所有日志
  (function interceptConsoleMethods() {
    console.log = function (...args) {
      addConsoleLog("log", ...args);
      originalConsole.log.apply(console, args);
    };

    console.error = function (...args) {
      addConsoleLog("error", ...args);
      originalConsole.error.apply(console, args);
    };

    console.warn = function (...args) {
      addConsoleLog("warn", ...args);
      originalConsole.warn.apply(console, args);
    };

    console.info = function (...args) {
      addConsoleLog("info", ...args);
      originalConsole.info.apply(console, args);
    };

    console.debug = function (...args) {
      addConsoleLog("debug", ...args);
      originalConsole.debug.apply(console, args);
    };
  })();

  // 全局变量用于存储监控窗口
  let monitorWindow = null;
  // 用于存储当前打开的请求ID
  let currentlyOpenRequestId = null;
  // 用于存储监控状态提示图标
  let statusIcon = null;

  // 创建状态提示图标
  function createStatusIcon() {
    // 如果图标已存在，先移除
    if (statusIcon) {
      statusIcon.remove();
    }

    // 创建图标元素
    statusIcon = document.createElement("div");
    statusIcon.id = "api-monitor-status-icon";
    statusIcon.style.position = "fixed";
    statusIcon.style.top = "20px";
    statusIcon.style.right = "20px";
    statusIcon.style.width = "40px";
    statusIcon.style.height = "40px";
    statusIcon.style.borderRadius = "50%";
    statusIcon.style.backgroundColor = "#16b1fec1";
    statusIcon.style.color = "white";
    statusIcon.style.display = "flex";
    statusIcon.style.justifyContent = "center";
    statusIcon.style.alignItems = "center";
    statusIcon.style.cursor = "move";
    statusIcon.style.zIndex = "999999";
    statusIcon.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    statusIcon.style.transition =
      "background-color 0.3s ease, transform 0.3s ease";

    // 添加呼吸动画效果
    statusIcon.style.animation = "breathe 2s infinite ease-in-out";

    // 创建动画样式
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes breathe {
        0% {
          transform: scale(1);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        50% {
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }
        100% {
          transform: scale(1);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
      }
      
      /* 拖动时暂停动画 */
      #api-monitor-status-icon[data-dragging="true"] {
        animation-play-state: paused;
      }
    `;
    document.head.appendChild(styleSheet);

    // 保存动画样式引用
    statusIcon._animationStyleSheet = styleSheet;
    statusIcon.innerHTML = "📡";
    statusIcon.title = "API监控已启用 - 点击查看监控页面";

    // 添加点击事件 - 切换到监控页面
    statusIcon.addEventListener("click", function () {
      if (monitorWindow && !monitorWindow.closed) {
        // 如果窗口已存在且未关闭，聚焦到窗口
        monitorWindow.focus();
      } else {
        // 否则创建新的监控窗口
        createMonitorWindow();
      }
    });

    // 实现拖动功能
    let isDragging = false;
    let offsetX, offsetY;

    statusIcon.addEventListener("mousedown", function (e) {
      isDragging = true;
      const rect = statusIcon.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      statusIcon.style.cursor = "grabbing";
      statusIcon.style.backgroundColor = "#16b1fec1";
      // 暂停呼吸动画
      statusIcon.setAttribute("data-dragging", "true");
    });

    document.addEventListener("mousemove", function (e) {
      if (isDragging) {
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        statusIcon.style.left = x + "px";
        statusIcon.style.top = y + "px";
        statusIcon.style.transform = "none"; // 移除居中变换
      }
    });

    document.addEventListener("mouseup", function () {
      if (isDragging) {
        isDragging = false;
        statusIcon.style.cursor = "move";
        statusIcon.style.backgroundColor = "#16b1fec1";
        // 恢复呼吸动画
        statusIcon.removeAttribute("data-dragging");
      }
    });

    // 阻止默认行为，确保拖动不会触发文本选择等
    statusIcon.addEventListener("dragstart", function (e) {
      e.preventDefault();
    });

    // 将图标添加到页面
    document.body.appendChild(statusIcon);
  }

  // 移除状态提示图标
  function removeStatusIcon() {
    if (statusIcon) {
      // 移除动画样式
      if (
        statusIcon._animationStyleSheet &&
        document.head.contains(statusIcon._animationStyleSheet)
      ) {
        document.head.removeChild(statusIcon._animationStyleSheet);
      }
      statusIcon.remove();
      statusIcon = null;
    }
  }

  // 在新窗口中创建监控UI
  function createMonitorWindow() {
    // 如果窗口已存在，先关闭
    if (monitorWindow && !monitorWindow.closed) {
      monitorWindow.close();
    }

    // 创建新窗口
    const windowFeatures =
      "width=800,height=600,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes";
    monitorWindow = window.open("", "apiMonitorWindow", windowFeatures);

    // 设置新窗口内容
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>API请求监控工具</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 10px;
            background-color: #f5f5f5;
          }
          .copy-btn {
            padding: 2px 8px;
            font-size: 12px;
            background-color: transparent;
            color: #666;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            width: 30px;
            height: 25px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .copy-btn:hover {
            background-color: #f5f5f5;
            color: #333;
            border-color: #bbb;
          }
          .tabs {
            display: flex;
            margin-bottom: 10px;
            background-color: #e0e0e0;
            border-radius: 4px 4px 0 0;
            padding: 0 10px;
          }
          .tab {
            padding: 8px 16px;
            cursor: pointer;
            border-bottom: 2px solid transparent;
          }
          .tab.active {
            border-bottom: 2px solid #2196F3;
            background-color: white;
          }
          .controls {
            margin-bottom: 10px;
            text-align: right;
            background-color: white;
            padding: 10px;
            border-radius: 0 0 4px 4px;
          }
          button {
            padding: 4px 8px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 5px;
          }
          #api-request-list {
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            max-height: 100vh;
            overflow-y: auto;
            margin-bottom: 10px;
          }
          .api-request-item {
            padding: 8px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .api-request-item .time-column {
            width: 150px;
            margin-right: 10px;
            color: #666;
          }
          .api-request-item:hover {
            background-color: #f0f0f0;
          }
          #api-detail-panel {
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            max-height: 100vh;
            overflow-y: auto;
            padding: 10px;
            display: none;
          }
          #console-panel {
            background-color: #1e1e1e;
            border: 1px solid #ccc;
            border-radius: 4px;
            max-height: 100vh;
            overflow-y: auto;
            padding: 10px;
            color: #d4d4d4;
            font-family: 'Courier New', monospace;
            display: none;
          }
          .console-log {
            margin-bottom: 4px;
            padding: 4px;
            border-radius: 2px;
          }
          .console-log.log { color: #d4d4d4; }
          .console-log.error { color: #f44336; background-color: rgba(244, 67, 54, 0.1); }
          .console-log.warn { color: #ff9800; background-color: rgba(255, 152, 0, 0.1); }
          .console-log.info { color: #2196f3; background-color: rgba(33, 150, 243, 0.1); }
          .console-log.debug { color: #9e9e9e; background-color: rgba(158, 158, 158, 0.1); }
          pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            background-color: #f8f8f8;
            padding: 8px;
            border-radius: 4px;
            overflow-x: auto;
          }
          h3, h4 {
            margin-top: 15px;
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2>API请求监控工具</h2>
          <div class="controls">
            <button id="clear-history-button" style="background-color: #ff9800; color: white;">清空历史</button>
            <button id="close-window-button" style="background-color: #f44336; color: white;">关闭窗口</button>
          </div>
        </div>
        <div class="tabs">
          <div class="tab active" id="api-tab">API请求</div>
          <div class="tab" id="console-tab">控制台日志</div>
          <div class="tab" id="localstorage-tab">LocalStorage</div>
          <div class="tab" id="sessionstorage-tab">SessionStorage</div>
          <div class="tab" id="cookie-tab">Cookie</div>
        </div>
        <div style="display: flex; height: calc(100vh - 140px); width: 100%;">
          <div id="api-request-list" style="width: 50%; height: 100%; flex: 1; border-right: 1px solid #ccc; overflow-y: auto;"></div>
          <div id="api-detail-panel" style="width: 50%; height: 100%; flex: 1; overflow-y: auto; display: none;">
            <button id="close-detail-button" style="background-color: #f44336; color: white;">关闭详情</button>
          </div>
        </div>
        <div id="console-panel" style="height: calc(100vh - 150px); overflow-y: auto;"></div>
        <div id="localstorage-panel" style="display: none; height: calc(100vh - 130px); overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <h3>LocalStorage 内容</h3>
            <button id="refresh-localstorage" style="background-color: #2196F3; color: white;">刷新</button>
          </div>
          <div id="localstorage-content" style="background-color: white; border: 1px solid #ccc; border-radius: 4px; padding: 10px; height: calc(100% - 100px); overflow-y: auto;"></div>
        </div>
        <div id="sessionstorage-panel" style="display: none; height: calc(100vh - 130px); overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <h3>SessionStorage 内容</h3>
            <button id="refresh-sessionstorage" style="background-color: #2196F3; color: white;">刷新</button>
          </div>
          <div id="sessionstorage-content" style="background-color: white; border: 1px solid #ccc; border-radius: 4px; padding: 10px; height: calc(100% - 100px); overflow-y: auto;"></div>
        </div>
        <div id="cookie-panel" style="display: none; height: calc(100vh - 130px); overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <h3>Cookie 内容</h3>
            <button id="refresh-cookie" style="background-color: #2196F3; color: white;">刷新</button>
          </div>
          <div id="cookie-content" style="background-color: white; border: 1px solid #ccc; border-radius: 4px; padding: 10px; height: calc(100% - 100px); overflow-y: auto;"></div>
        </div>
      </body>
      </html>
    `;

    monitorWindow.document.write(html);
    monitorWindow.document.close();

    // 添加自定义消息提示函数到monitorWindow的window对象中
    monitorWindow.window.showMessage = function (
      message,
      type = "success",
      duration = 2000
    ) {
      const doc = monitorWindow.document;

      // 创建消息元素
      const messageEl = doc.createElement("div");
      messageEl.className = "api-message";
      messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-100%);
            padding: 12px 16px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            color: #fff;
            font-size: 14px;
            z-index: 9999;
            transition: all 0.3s ease;
            opacity: 0;
            white-space: nowrap;
        `;

      // 设置不同类型的样式
      if (type === "success") {
        messageEl.style.backgroundColor = "#67c23a";
      } else if (type === "error") {
        messageEl.style.backgroundColor = "#f56c6c";
      } else if (type === "warning") {
        messageEl.style.backgroundColor = "#e6a23c";
      } else if (type === "info") {
        messageEl.style.backgroundColor = "#909399";
      }

      messageEl.textContent = message;
      doc.body.appendChild(messageEl);

      // 显示动画
      setTimeout(() => {
        messageEl.style.transform = "translateX(-50%) translateY(0)";
        messageEl.style.opacity = "1";
      }, 10);

      // 自动消失
      setTimeout(() => {
        messageEl.style.transform = "translateX(-50%) translateY(-100%)";
        messageEl.style.opacity = "0";
        setTimeout(() => {
          if (messageEl.parentNode === doc.body) {
            doc.body.removeChild(messageEl);
          }
        }, 300);
      }, duration);
    };

    // 添加复制到剪贴板函数到monitorWindow的window对象中
    monitorWindow.window.copyToClipboard = function (text) {
      // 确保使用monitorWindow的document
      const doc = monitorWindow.document;

      // 先尝试使用execCommand方式（更可靠，不受焦点限制）
      const textarea = doc.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-999999px";
      textarea.style.top = "-999999px";
      doc.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        const successful = doc.execCommand("copy");
        if (successful) {
          // 使用自定义消息提示
          monitorWindow.window.showMessage("复制成功", "success");
        } else {
          throw new Error("execCommand返回失败");
        }
      } catch (err) {
        console.error("复制失败:", err);
        monitorWindow.window.showMessage("复制失败: " + err.message, "error");
      } finally {
        // 确保在操作完成后移除textarea
        setTimeout(() => {
          doc.body.removeChild(textarea);
        }, 100);
      }
    };

    // 添加事件监听器
    monitorWindow.document
      .getElementById("api-tab")
      .addEventListener("click", function () {
        switchTab("api");
      });
    monitorWindow.document
      .getElementById("console-tab")
      .addEventListener("click", function () {
        switchTab("console");
      });
    monitorWindow.document
      .getElementById("localstorage-tab")
      .addEventListener("click", function () {
        switchTab("localstorage");
      });
    monitorWindow.document
      .getElementById("sessionstorage-tab")
      .addEventListener("click", function () {
        switchTab("sessionstorage");
      });
    monitorWindow.document
      .getElementById("cookie-tab")
      .addEventListener("click", function () {
        switchTab("cookie");
      });

    // 刷新按钮事件
    monitorWindow.document
      .getElementById("refresh-localstorage")
      .addEventListener("click", updateLocalStorageDisplay);
    monitorWindow.document
      .getElementById("refresh-sessionstorage")
      .addEventListener("click", updateSessionStorageDisplay);
    monitorWindow.document
      .getElementById("refresh-cookie")
      .addEventListener("click", updateCookieDisplay);

    monitorWindow.document
      .getElementById("clear-history-button")
      .addEventListener("click", clearHistory);
    monitorWindow.document
      .getElementById("close-window-button")
      .addEventListener("click", () => {
        monitorWindow.close();
        monitorWindow = null;
        // 停止监控
        if (isMonitoring) {
          toggleMonitoring();
        }
      });
    monitorWindow.document
      .getElementById("close-detail-button")
      .addEventListener("click", () => {
        currentlyOpenRequestId = null;
        // 更新请求列表以移除高亮
        updateRequestList();
        const detailPanel =
          monitorWindow.document.getElementById("api-detail-panel");
        // 隐藏详情面板
        detailPanel.style.display = "none";
      });

    // 监听窗口关闭事件
    monitorWindow.addEventListener("beforeunload", () => {
      monitorWindow = null;
      currentlyOpenRequestId = null;
      // 停止监控
      if (isMonitoring) {
        toggleMonitoring();
      }
    });

    // 初始化时更新控制台日志
    updateConsoleLogs();
  }

  // 切换标签页 - 暴露到window对象上以便监控窗口访问
  function switchTab(tabName) {
    if (!monitorWindow || monitorWindow.closed) return;

    const apiTab = monitorWindow.document.getElementById("api-tab");
    const consoleTab = monitorWindow.document.getElementById("console-tab");
    const localStorageTab =
      monitorWindow.document.getElementById("localstorage-tab");
    const sessionStorageTab =
      monitorWindow.document.getElementById("sessionstorage-tab");
    const cookieTab = monitorWindow.document.getElementById("cookie-tab");

    const apiList = monitorWindow.document.getElementById("api-request-list");
    const apiDetail = monitorWindow.document.getElementById("api-detail-panel");
    const consolePanel = monitorWindow.document.getElementById("console-panel");
    const localStoragePanel =
      monitorWindow.document.getElementById("localstorage-panel");
    const sessionStoragePanel = monitorWindow.document.getElementById(
      "sessionstorage-panel"
    );
    const cookiePanel = monitorWindow.document.getElementById("cookie-panel");
    const flexContainer = apiList.parentElement;

    // 重置所有标签和面板
    apiTab.classList.remove("active");
    consoleTab.classList.remove("active");
    localStorageTab.classList.remove("active");
    sessionStorageTab.classList.remove("active");
    cookieTab.classList.remove("active");

    // 隐藏所有面板
    flexContainer.style.display = "none";
    consolePanel.style.display = "none";
    localStoragePanel.style.display = "none";
    sessionStoragePanel.style.display = "none";
    cookiePanel.style.display = "none";

    // 根据标签名显示对应内容
    if (tabName === "api") {
      apiTab.classList.add("active");
      // 显示flex容器，包含apiList和apiDetail
      flexContainer.style.display = "flex";
    } else if (tabName === "console") {
      consoleTab.classList.add("active");
      consolePanel.style.display = "block";
      updateConsoleLogs();
    } else if (tabName === "localstorage") {
      localStorageTab.classList.add("active");
      localStoragePanel.style.display = "block";
      updateLocalStorageDisplay();
    } else if (tabName === "sessionstorage") {
      sessionStorageTab.classList.add("active");
      sessionStoragePanel.style.display = "block";
      updateSessionStorageDisplay();
    } else if (tabName === "cookie") {
      cookieTab.classList.add("active");
      cookiePanel.style.display = "block";
      updateCookieDisplay();
    }
  }

  // 将switchTab函数暴露到window对象上
  window.switchTab = switchTab;

  // 更新LocalStorage显示
  function updateLocalStorageDisplay() {
    if (!monitorWindow || monitorWindow.closed) return;

    try {
      const contentElement = monitorWindow.document.getElementById(
        "localstorage-content"
      );
      contentElement.innerHTML = "";

      const localStorageData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
          localStorageData[key] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          localStorageData[key] = localStorage.getItem(key);
        }
      }

      if (Object.keys(localStorageData).length === 0) {
        contentElement.innerHTML =
          '<div style="color: #666; text-align: center; padding: 20px;">LocalStorage 为空</div>';
        return;
      }

      // 创建表格展示数据
      const table = monitorWindow.document.createElement("table");
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";
      table.style.fontSize = "13px";

      // 添加表头
      const thead = monitorWindow.document.createElement("thead");
      const headerRow = monitorWindow.document.createElement("tr");
      headerRow.style.backgroundColor = "#f5f5f5";

      const keyHeader = monitorWindow.document.createElement("th");
      keyHeader.textContent = "键";
      keyHeader.style.padding = "8px";
      keyHeader.style.border = "1px solid #ddd";
      keyHeader.style.fontWeight = "bold";

      const valueHeader = monitorWindow.document.createElement("th");
      valueHeader.textContent = "值";
      valueHeader.style.padding = "8px";
      valueHeader.style.border = "1px solid #ddd";
      valueHeader.style.fontWeight = "bold";
      valueHeader.style.width = "70%";

      headerRow.appendChild(keyHeader);
      headerRow.appendChild(valueHeader);
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // 添加数据行
      const tbody = monitorWindow.document.createElement("tbody");

      // 创建展开/收缩切换函数
      function createExpandableValue(monitorWindow, value) {
        const valueContainer = monitorWindow.document.createElement("div");

        // 获取完整值文本
        const fullValueText =
          typeof value === "object"
            ? JSON.stringify(value, null, 2)
            : String(value);

        // 如果内容较短（少于50个字符），直接显示，不提供展开/收缩功能
        if (fullValueText.length <= 50) {
          const simpleElement = monitorWindow.document.createElement("span");
          simpleElement.textContent = fullValueText;
          simpleElement.style.fontFamily = "monospace";
          simpleElement.style.fontSize = "12px";
          return simpleElement;
        }

        // 设置容器样式，使整个区域可点击
        valueContainer.style.cursor = "pointer";
        valueContainer.style.userSelect = "text"; // 允许文本选择
        valueContainer.onmouseenter = function () {
          this.style.backgroundColor = "#f0f0f0";
          this.style.borderRadius = "3px";
        };
        valueContainer.onmouseleave = function () {
          this.style.backgroundColor = "";
        };

        // 创建展开/收缩图标
        const toggleIcon = monitorWindow.document.createElement("span");
        toggleIcon.textContent = "▶";
        toggleIcon.style.marginRight = "5px";
        toggleIcon.style.display = "inline-block";
        toggleIcon.style.transition = "transform 0.2s, color 0.2s";
        toggleIcon.style.color = "#666";

        // 创建简短预览（最多显示80个字符）
        const previewText =
          fullValueText.length > 80
            ? fullValueText.substring(0, 80) + "..."
            : fullValueText;

        // 创建预览元素
        const previewElement = monitorWindow.document.createElement("span");
        previewElement.textContent = previewText;
        previewElement.style.fontFamily = "monospace";
        previewElement.style.fontSize = "12px";

        // 创建完整内容元素
        const fullContentElement = monitorWindow.document.createElement("pre");
        fullContentElement.textContent = fullValueText;
        fullContentElement.style.margin = "8px 0 0 15px"; // 缩进效果
        fullContentElement.style.whiteSpace = "pre-wrap";
        fullContentElement.style.wordBreak = "break-all";
        fullContentElement.style.fontFamily = "monospace";
        fullContentElement.style.fontSize = "12px";
        fullContentElement.style.display = "none"; // 默认隐藏
        fullContentElement.style.padding = "8px";
        fullContentElement.style.backgroundColor = "#f9f9f9";
        fullContentElement.style.borderRadius = "4px";
        fullContentElement.style.border = "1px solid #e0e0e0";
        fullContentElement.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";

        // 组合元素
        valueContainer.appendChild(toggleIcon);
        valueContainer.appendChild(previewElement);
        valueContainer.appendChild(fullContentElement);

        // 切换函数
        function toggleExpand() {
          const isExpanded = fullContentElement.style.display === "block";
          if (isExpanded) {
            fullContentElement.style.display = "none";
            toggleIcon.textContent = "▶";
            toggleIcon.style.transform = "rotate(0deg)";
            toggleIcon.style.color = "#666";
          } else {
            fullContentElement.style.display = "block";
            toggleIcon.textContent = "▼";
            toggleIcon.style.transform = "rotate(180deg)";
            toggleIcon.style.color = "#2196F3";

            // 自动滚动到显示的完整内容（如果需要）
            setTimeout(() => {
              const rect = fullContentElement.getBoundingClientRect();
              if (rect.bottom > window.innerHeight) {
                fullContentElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }, 100);
          }
        }

        // 为整个容器添加点击事件，但允许文本选择
        let lastClickTime = 0;
        valueContainer.addEventListener("click", function (e) {
          // 检查是否是文本选择操作
          const selection = monitorWindow.getSelection();
          const selectedText = selection.toString();
          if (selectedText) {
            return; // 如果有选中文本，不执行展开/收缩
          }

          // 双击也可以展开/收缩
          const currentTime = Date.now();
          const isDoubleClick = currentTime - lastClickTime < 300;
          lastClickTime = currentTime;

          toggleExpand();
        });

        // 允许直接点击图标切换
        toggleIcon.addEventListener("click", function (e) {
          e.stopPropagation(); // 阻止冒泡，避免触发两次
          toggleExpand();
        });

        return valueContainer;
      }

      Object.entries(localStorageData).forEach(([key, value]) => {
        const row = monitorWindow.document.createElement("tr");
        row.style.borderBottom = "1px solid #eee";
        row.addEventListener("mouseenter", () => {
          row.style.backgroundColor = "#f9f9f9";
        });
        row.addEventListener("mouseleave", () => {
          row.style.backgroundColor = "";
        });

        const keyCell = monitorWindow.document.createElement("td");
        keyCell.textContent = key;
        keyCell.style.padding = "8px";
        keyCell.style.border = "1px solid #ddd";
        keyCell.style.fontFamily = "monospace";
        keyCell.style.verticalAlign = "top";

        const valueCell = monitorWindow.document.createElement("td");
        // 使用可展开/收缩的组件
        const expandableValue = createExpandableValue(monitorWindow, value);
        valueCell.appendChild(expandableValue);
        valueCell.style.padding = "8px";
        valueCell.style.border = "1px solid #ddd";

        row.appendChild(keyCell);
        row.appendChild(valueCell);
        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      contentElement.appendChild(table);
    } catch (error) {
      const contentElement = monitorWindow.document.getElementById(
        "localstorage-content"
      );
      contentElement.innerHTML = `<div style="color: #f44336; padding: 10px;">获取 LocalStorage 失败: ${error.message}</div>`;
    }
  }

  // 更新SessionStorage显示
  function updateSessionStorageDisplay() {
    if (!monitorWindow || monitorWindow.closed) return;

    try {
      const contentElement = monitorWindow.document.getElementById(
        "sessionstorage-content"
      );
      contentElement.innerHTML = "";

      const sessionStorageData = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        try {
          sessionStorageData[key] = JSON.parse(sessionStorage.getItem(key));
        } catch (e) {
          sessionStorageData[key] = sessionStorage.getItem(key);
        }
      }

      if (Object.keys(sessionStorageData).length === 0) {
        contentElement.innerHTML =
          '<div style="color: #666; text-align: center; padding: 20px;">SessionStorage 为空</div>';
        return;
      }

      // 创建表格展示数据
      const table = monitorWindow.document.createElement("table");
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";
      table.style.fontSize = "13px";

      // 添加表头
      const thead = monitorWindow.document.createElement("thead");
      const headerRow = monitorWindow.document.createElement("tr");
      headerRow.style.backgroundColor = "#f5f5f5";

      const keyHeader = monitorWindow.document.createElement("th");
      keyHeader.textContent = "键";
      keyHeader.style.padding = "8px";
      keyHeader.style.border = "1px solid #ddd";
      keyHeader.style.fontWeight = "bold";

      const valueHeader = monitorWindow.document.createElement("th");
      valueHeader.textContent = "值";
      valueHeader.style.padding = "8px";
      valueHeader.style.border = "1px solid #ddd";
      valueHeader.style.fontWeight = "bold";
      valueHeader.style.width = "70%";

      headerRow.appendChild(keyHeader);
      headerRow.appendChild(valueHeader);
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // 添加数据行
      const tbody = monitorWindow.document.createElement("tbody");

      // 创建展开/收缩切换函数
      function createExpandableValue(monitorWindow, value) {
        const valueContainer = monitorWindow.document.createElement("div");

        // 获取完整值文本
        const fullValueText =
          typeof value === "object"
            ? JSON.stringify(value, null, 2)
            : String(value);

        // 如果内容较短（少于50个字符），直接显示，不提供展开/收缩功能
        if (fullValueText.length <= 50) {
          const simpleElement = monitorWindow.document.createElement("span");
          simpleElement.textContent = fullValueText;
          simpleElement.style.fontFamily = "monospace";
          simpleElement.style.fontSize = "12px";
          return simpleElement;
        }

        // 设置容器样式，使整个区域可点击
        valueContainer.style.cursor = "pointer";
        valueContainer.style.userSelect = "text"; // 允许文本选择
        valueContainer.onmouseenter = function () {
          this.style.backgroundColor = "#f0f0f0";
          this.style.borderRadius = "3px";
        };
        valueContainer.onmouseleave = function () {
          this.style.backgroundColor = "";
        };

        // 创建展开/收缩图标
        const toggleIcon = monitorWindow.document.createElement("span");
        toggleIcon.textContent = "▶";
        toggleIcon.style.marginRight = "5px";
        toggleIcon.style.display = "inline-block";
        toggleIcon.style.transition = "transform 0.2s, color 0.2s";
        toggleIcon.style.color = "#666";

        // 创建简短预览（最多显示80个字符）
        const previewText =
          fullValueText.length > 80
            ? fullValueText.substring(0, 80) + "..."
            : fullValueText;

        // 创建预览元素
        const previewElement = monitorWindow.document.createElement("span");
        previewElement.textContent = previewText;
        previewElement.style.fontFamily = "monospace";
        previewElement.style.fontSize = "12px";

        // 创建完整内容元素
        const fullContentElement = monitorWindow.document.createElement("pre");
        fullContentElement.textContent = fullValueText;
        fullContentElement.style.margin = "8px 0 0 15px"; // 缩进效果
        fullContentElement.style.whiteSpace = "pre-wrap";
        fullContentElement.style.wordBreak = "break-all";
        fullContentElement.style.fontFamily = "monospace";
        fullContentElement.style.fontSize = "12px";
        fullContentElement.style.display = "none"; // 默认隐藏
        fullContentElement.style.padding = "8px";
        fullContentElement.style.backgroundColor = "#f9f9f9";
        fullContentElement.style.borderRadius = "4px";
        fullContentElement.style.border = "1px solid #e0e0e0";
        fullContentElement.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";

        // 组合元素
        valueContainer.appendChild(toggleIcon);
        valueContainer.appendChild(previewElement);
        valueContainer.appendChild(fullContentElement);

        // 切换函数
        function toggleExpand() {
          const isExpanded = fullContentElement.style.display === "block";
          if (isExpanded) {
            fullContentElement.style.display = "none";
            toggleIcon.textContent = "▶";
            toggleIcon.style.transform = "rotate(0deg)";
            toggleIcon.style.color = "#666";
          } else {
            fullContentElement.style.display = "block";
            toggleIcon.textContent = "▼";
            toggleIcon.style.transform = "rotate(180deg)";
            toggleIcon.style.color = "#2196F3";

            // 自动滚动到显示的完整内容（如果需要）
            setTimeout(() => {
              const rect = fullContentElement.getBoundingClientRect();
              if (rect.bottom > window.innerHeight) {
                fullContentElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }, 100);
          }
        }

        // 为整个容器添加点击事件，但允许文本选择
        let lastClickTime = 0;
        valueContainer.addEventListener("click", function (e) {
          // 检查是否是文本选择操作
          const selection = monitorWindow.getSelection();
          const selectedText = selection.toString();
          if (selectedText) {
            return; // 如果有选中文本，不执行展开/收缩
          }

          // 双击也可以展开/收缩
          const currentTime = Date.now();
          const isDoubleClick = currentTime - lastClickTime < 300;
          lastClickTime = currentTime;

          toggleExpand();
        });

        // 允许直接点击图标切换
        toggleIcon.addEventListener("click", function (e) {
          e.stopPropagation(); // 阻止冒泡，避免触发两次
          toggleExpand();
        });

        return valueContainer;
      }

      Object.entries(sessionStorageData).forEach(([key, value]) => {
        const row = monitorWindow.document.createElement("tr");
        row.style.borderBottom = "1px solid #eee";
        row.addEventListener("mouseenter", () => {
          row.style.backgroundColor = "#f9f9f9";
        });
        row.addEventListener("mouseleave", () => {
          row.style.backgroundColor = "";
        });

        const keyCell = monitorWindow.document.createElement("td");
        keyCell.textContent = key;
        keyCell.style.padding = "8px";
        keyCell.style.border = "1px solid #ddd";
        keyCell.style.fontFamily = "monospace";
        keyCell.style.verticalAlign = "top";

        const valueCell = monitorWindow.document.createElement("td");
        // 使用可展开/收缩的组件
        const expandableValue = createExpandableValue(monitorWindow, value);
        valueCell.appendChild(expandableValue);
        valueCell.style.padding = "8px";
        valueCell.style.border = "1px solid #ddd";

        row.appendChild(keyCell);
        row.appendChild(valueCell);
        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      contentElement.appendChild(table);
    } catch (error) {
      const contentElement = monitorWindow.document.getElementById(
        "sessionstorage-content"
      );
      contentElement.innerHTML = `<div style="color: #f44336; padding: 10px;">获取 SessionStorage 失败: ${error.message}</div>`;
    }
  }

  // 更新Cookie显示
  function updateCookieDisplay() {
    if (!monitorWindow || monitorWindow.closed) return;

    try {
      const contentElement =
        monitorWindow.document.getElementById("cookie-content");
      contentElement.innerHTML = "";

      const cookies = document.cookie.split(";");
      const cookieData = {};

      cookies.forEach((cookie) => {
        const parts = cookie.split("=");
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join("=").trim();
          try {
            // 尝试解码并解析JSON
            const decodedValue = decodeURIComponent(value);
            try {
              cookieData[key] = JSON.parse(decodedValue);
            } catch (e) {
              cookieData[key] = decodedValue;
            }
          } catch (e) {
            cookieData[key] = value;
          }
        }
      });

      if (Object.keys(cookieData).length === 0) {
        contentElement.innerHTML =
          '<div style="color: #666; text-align: center; padding: 20px;">Cookie 为空</div>';
        return;
      }

      // 创建表格展示数据
      const table = monitorWindow.document.createElement("table");
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";
      table.style.fontSize = "13px";

      // 添加表头
      const thead = monitorWindow.document.createElement("thead");
      const headerRow = monitorWindow.document.createElement("tr");
      headerRow.style.backgroundColor = "#f5f5f5";

      const keyHeader = monitorWindow.document.createElement("th");
      keyHeader.textContent = "键";
      keyHeader.style.padding = "8px";
      keyHeader.style.border = "1px solid #ddd";
      keyHeader.style.fontWeight = "bold";

      const valueHeader = monitorWindow.document.createElement("th");
      valueHeader.textContent = "值";
      valueHeader.style.padding = "8px";
      valueHeader.style.border = "1px solid #ddd";
      valueHeader.style.fontWeight = "bold";
      valueHeader.style.width = "70%";

      headerRow.appendChild(keyHeader);
      headerRow.appendChild(valueHeader);
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // 添加数据行
      const tbody = monitorWindow.document.createElement("tbody");

      // 创建展开/收缩切换函数
      function createExpandableValue(monitorWindow, value) {
        const valueContainer = monitorWindow.document.createElement("div");

        // 获取完整值文本
        const fullValueText =
          typeof value === "object"
            ? JSON.stringify(value, null, 2)
            : String(value);

        // 如果内容较短（少于50个字符），直接显示，不提供展开/收缩功能
        if (fullValueText.length <= 50) {
          const simpleElement = monitorWindow.document.createElement("span");
          simpleElement.textContent = fullValueText;
          simpleElement.style.fontFamily = "monospace";
          simpleElement.style.fontSize = "12px";
          return simpleElement;
        }

        // 设置容器样式，使整个区域可点击
        valueContainer.style.cursor = "pointer";
        valueContainer.style.userSelect = "text"; // 允许文本选择
        valueContainer.onmouseenter = function () {
          this.style.backgroundColor = "#f0f0f0";
          this.style.borderRadius = "3px";
        };
        valueContainer.onmouseleave = function () {
          this.style.backgroundColor = "";
        };

        // 创建展开/收缩图标
        const toggleIcon = monitorWindow.document.createElement("span");
        toggleIcon.textContent = "▶";
        toggleIcon.style.marginRight = "5px";
        toggleIcon.style.display = "inline-block";
        toggleIcon.style.transition = "transform 0.2s, color 0.2s";
        toggleIcon.style.color = "#666";

        // 创建简短预览（最多显示80个字符）
        const previewText =
          fullValueText.length > 80
            ? fullValueText.substring(0, 80) + "..."
            : fullValueText;

        // 创建预览元素
        const previewElement = monitorWindow.document.createElement("span");
        previewElement.textContent = previewText;
        previewElement.style.fontFamily = "monospace";
        previewElement.style.fontSize = "12px";

        // 创建完整内容元素
        const fullContentElement = monitorWindow.document.createElement("pre");
        fullContentElement.textContent = fullValueText;
        fullContentElement.style.margin = "8px 0 0 15px"; // 缩进效果
        fullContentElement.style.whiteSpace = "pre-wrap";
        fullContentElement.style.wordBreak = "break-all";
        fullContentElement.style.fontFamily = "monospace";
        fullContentElement.style.fontSize = "12px";
        fullContentElement.style.display = "none"; // 默认隐藏
        fullContentElement.style.padding = "8px";
        fullContentElement.style.backgroundColor = "#f9f9f9";
        fullContentElement.style.borderRadius = "4px";
        fullContentElement.style.border = "1px solid #e0e0e0";
        fullContentElement.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";

        // 组合元素
        valueContainer.appendChild(toggleIcon);
        valueContainer.appendChild(previewElement);
        valueContainer.appendChild(fullContentElement);

        // 切换函数
        function toggleExpand() {
          const isExpanded = fullContentElement.style.display === "block";
          if (isExpanded) {
            fullContentElement.style.display = "none";
            toggleIcon.textContent = "▶";
            toggleIcon.style.transform = "rotate(0deg)";
            toggleIcon.style.color = "#666";
          } else {
            fullContentElement.style.display = "block";
            toggleIcon.textContent = "▼";
            toggleIcon.style.transform = "rotate(180deg)";
            toggleIcon.style.color = "#2196F3";

            // 自动滚动到显示的完整内容（如果需要）
            setTimeout(() => {
              const rect = fullContentElement.getBoundingClientRect();
              if (rect.bottom > window.innerHeight) {
                fullContentElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            }, 100);
          }
        }

        // 为整个容器添加点击事件，但允许文本选择
        let lastClickTime = 0;
        valueContainer.addEventListener("click", function (e) {
          // 检查是否是文本选择操作
          const selection = monitorWindow.getSelection();
          const selectedText = selection.toString();
          if (selectedText) {
            return; // 如果有选中文本，不执行展开/收缩
          }

          // 双击也可以展开/收缩
          const currentTime = Date.now();
          const isDoubleClick = currentTime - lastClickTime < 300;
          lastClickTime = currentTime;

          toggleExpand();
        });

        // 允许直接点击图标切换
        toggleIcon.addEventListener("click", function (e) {
          e.stopPropagation(); // 阻止冒泡，避免触发两次
          toggleExpand();
        });

        return valueContainer;
      }

      Object.entries(cookieData).forEach(([key, value]) => {
        const row = monitorWindow.document.createElement("tr");
        row.style.borderBottom = "1px solid #eee";
        row.addEventListener("mouseenter", () => {
          row.style.backgroundColor = "#f9f9f9";
        });
        row.addEventListener("mouseleave", () => {
          row.style.backgroundColor = "";
        });

        const keyCell = monitorWindow.document.createElement("td");
        keyCell.textContent = key;
        keyCell.style.padding = "8px";
        keyCell.style.border = "1px solid #ddd";
        keyCell.style.fontFamily = "monospace";
        keyCell.style.verticalAlign = "top";

        const valueCell = monitorWindow.document.createElement("td");
        // 使用可展开/收缩的组件
        const expandableValue = createExpandableValue(monitorWindow, value);
        valueCell.appendChild(expandableValue);
        valueCell.style.padding = "8px";
        valueCell.style.border = "1px solid #ddd";

        row.appendChild(keyCell);
        row.appendChild(valueCell);
        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      contentElement.appendChild(table);
    } catch (error) {
      const contentElement =
        monitorWindow.document.getElementById("cookie-content");
      contentElement.innerHTML = `<div style="color: #f44336; padding: 10px;">获取 Cookie 失败: ${error.message}</div>`;
    }
  }

  // 更新控制台日志显示
  function updateConsoleLogs() {
    if (!monitorWindow || monitorWindow.closed) return;

    const consolePanel = monitorWindow.document.getElementById("console-panel");
    if (!consolePanel) return;

    consolePanel.innerHTML = "";

    // 限制显示最近200条日志
    const recentLogs = consoleLogs.slice(-200);

    recentLogs.forEach((log) => {
      const logElement = monitorWindow.document.createElement("div");
      logElement.className = `console-log ${log.type}`;

      // 格式化时间
      const timeSpan = monitorWindow.document.createElement("span");
      timeSpan.style.color = "#888";
      timeSpan.style.marginRight = "10px";
      timeSpan.textContent = log.timestamp;

      // 格式化日志内容
      const contentSpan = monitorWindow.document.createElement("span");
      contentSpan.textContent = log.content;

      logElement.appendChild(timeSpan);
      logElement.appendChild(contentSpan);
      consolePanel.appendChild(logElement);
    });

    // 自动滚动到底部
    consolePanel.scrollTop = consolePanel.scrollHeight;
  }

  // 添加控制台日志
  function addConsoleLog(type, ...args) {
    const timestamp = new Date().toLocaleTimeString();
    const content = args
      .map((arg) => {
        if (arg === null) return "null";
        if (arg === undefined) return "undefined";
        if (typeof arg === "object") {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      })
      .join(" ");

    consoleLogs.push({ type, timestamp, content });

    // 限制日志数量
    if (consoleLogs.length > 500) {
      // 使用splice修改现有数组而不是重新赋值
      const newLogs = consoleLogs.slice(-500);
      consoleLogs.splice(0, consoleLogs.length, ...newLogs);
    }

    // 更新显示
    updateConsoleLogs();
  }

  // 获取当前域名的唯一标识
  function getDomainKey() {
    try {
      const url = new URL(window.location.href);
      // 返回域名作为键，去除www前缀（如果有）
      return url.hostname.replace(/^www\./, "");
    } catch (e) {
      console.error("获取域名失败:", e);
      return "default-domain";
    }
  }

  // 从存储恢复监控状态 - 根据当前域名
  function restoreMonitoringState() {
    const domainKey = getDomainKey();
    const savedState = GM_getValue(`apiMonitorEnabled_${domainKey}`, false);
    isMonitoring = savedState;
    console.log(`已恢复${domainKey}的监控状态:`, isMonitoring);
  }

  // 初始化用户脚本菜单
  // 配置监控关键字
  function configureMonitorKeywords() {
    const keywords = getMonitorKeywords();
    const currentKeywords = keywords.join(", ");
    const input = prompt(
      `请输入要监控的URL关键字（多个关键字用逗号分隔）：\n\n当前监控的关键字：${currentKeywords}\n\n例如：has-pss-cw-local, hsa-pss-pw`,
      currentKeywords
    );

    if (input !== null) {
      // 清理输入，移除多余空格并分割为数组
      const newKeywords = input
        .split(",")
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0);

      if (newKeywords.length > 0) {
        GM_setValue("apiMonitorKeywords", newKeywords.join(","));
        monitorKeywords = newKeywords;
        alert(`已更新监控关键字：${newKeywords.join(", ")}`);
      } else {
        alert("请至少输入一个有效的监控关键字");
      }
    }
  }

  function initializeMenu() {
    // 注册菜单项
    GM_registerMenuCommand("切换API监控", function () {
      toggleMonitoring();
    });

    // 注册配置监控关键字的菜单项
    GM_registerMenuCommand("配置监控URL关键字", function () {
      configureMonitorKeywords();
    });
  }

  // 切换监控状态 - 根据当前域名保存状态
  function toggleMonitoring() {
    const domainKey = getDomainKey();

    if (!isMonitoring) {
      // 开始监控
      isMonitoring = true;
      GM_setValue(`apiMonitorEnabled_${domainKey}`, true);
      console.log(`开始监控${domainKey}的API请求`);
      // 创建监控窗口
      createMonitorWindow();
      startMonitoring();
      // 创建状态提示图标
      createStatusIcon();
    } else {
      // 停止监控
      isMonitoring = false;
      GM_setValue(`apiMonitorEnabled_${domainKey}`, false);
      console.log(`停止监控${domainKey}的API请求`);
      // 关闭监控窗口
      if (monitorWindow && !monitorWindow.closed) {
        monitorWindow.close();
        monitorWindow = null;
      }
      stopMonitoring();
      // 移除状态提示图标
      removeStatusIcon();
    }
  }

  // 获取保存的监控关键字列表
  function getMonitorKeywords() {
    const saved = GM_getValue("apiMonitorKeywords", "");
    // 如果没有保存的关键字，使用默认值
    if (!saved) {
      const defaultKeywords = ["has-pss-cw-local", "hsa-pss-pw"];
      GM_setValue("apiMonitorKeywords", defaultKeywords.join(","));
      monitorKeywords = defaultKeywords;
      return defaultKeywords;
    }
    monitorKeywords = saved.split(",");
    return monitorKeywords;
  }

  // 检查URL是否包含任一监控关键字
  function shouldMonitorUrl(url) {
    if (typeof url !== "string") return false;
    // 如果监控关键字列表为空，获取保存的列表
    if (monitorKeywords.length === 0) {
      getMonitorKeywords();
    }
    // 检查URL是否包含任一监控关键字
    return monitorKeywords.some((keyword) => url.includes(keyword));
  }

  // 开始监控
  function startMonitoring() {
    // 拦截fetch请求
    window.fetch = function (url, options) {
      if (!isMonitoring) return originalFetch.apply(this, arguments);

      const shouldMonitor = shouldMonitorUrl(url);
      if (!shouldMonitor) return originalFetch.apply(this, arguments);

      const requestInfo = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        url: url,
        method: options?.method || "GET",
        timestamp: new Date().toLocaleString(),
        headers: options?.headers || {},
        requestBody: options?.body || null,
        responseBody: null,
        status: null,
        responseHeaders: null,
        duration: null,
      };

      const startTime = performance.now();

      return originalFetch
        .apply(this, arguments)
        .then((response) => {
          requestInfo.status = response.status;
          requestInfo.duration = performance.now() - startTime;

          // 克隆响应以便读取body
          const clonedResponse = response.clone();

          // 尝试解析响应体
          clonedResponse
            .json()
            .then((json) => {
              requestInfo.responseBody = json;
              addRequestToList(requestInfo);
            })
            .catch(() => {
              // 如果不是JSON，尝试作为文本读取
              clonedResponse
                .text()
                .then((text) => {
                  try {
                    requestInfo.responseBody = JSON.parse(text);
                  } catch {
                    requestInfo.responseBody = text;
                  }
                  addRequestToList(requestInfo);
                })
                .catch(() => {
                  requestInfo.responseBody = "[无法解析响应体]";
                  addRequestToList(requestInfo);
                });
            });

          // 获取响应头
          const headers = {};
          response.headers.forEach((value, key) => {
            headers[key] = value;
          });
          requestInfo.responseHeaders = headers;

          return response;
        })
        .catch((error) => {
          requestInfo.status = "ERROR";
          // 提供更详细的错误信息
          const errorMessage = error?.message || "[未知Fetch错误]";
          requestInfo.responseBody = `[Fetch错误] ${errorMessage}`;
          requestInfo.duration = performance.now() - startTime;
          addRequestToList(requestInfo);
          // 同时将错误信息添加到控制台
          addConsoleLog("error", `Fetch错误: ${errorMessage}`, requestInfo.url);
          throw error;
        });
    };

    // 拦截XMLHttpRequest请求
    XMLHttpRequest.prototype.open = function (method, url) {
      if (isMonitoring && shouldMonitorUrl(url)) {
        this._requestInfo = {
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          url: url,
          method: method,
          timestamp: new Date().toLocaleString(),
          headers: {},
          requestBody: null,
          responseBody: null,
          status: null,
          responseHeaders: null,
          duration: null,
          _startTime: performance.now(),
        };

        // 拦截setRequestHeader
        const originalSetRequestHeader = this.setRequestHeader;
        this.setRequestHeader = function (header, value) {
          this._requestInfo.headers[header] = value;
          return originalSetRequestHeader.call(this, header, value);
        };

        // 监听load事件
        const originalOnload = this.onload;
        this.onload = function () {
          if (this._requestInfo) {
            this._requestInfo.status = this.status;
            this._requestInfo.duration =
              performance.now() - this._requestInfo._startTime;

            // 获取响应头
            const headers = {};
            const headerLines = this.getAllResponseHeaders().split("\r\n");
            for (let line of headerLines) {
              if (line.trim()) {
                const [key, value] = line.split(": ");
                headers[key] = value;
              }
            }
            this._requestInfo.responseHeaders = headers;

            // 尝试解析响应体
            try {
              this._requestInfo.responseBody = JSON.parse(this.responseText);
            } catch {
              this._requestInfo.responseBody = this.responseText;
            }

            addRequestToList(this._requestInfo);
          }

          if (originalOnload) {
            return originalOnload.apply(this, arguments);
          }
        };

        // 监听error事件
        const originalOnerror = this.onerror;
        this.onerror = function (event) {
          if (this._requestInfo) {
            this._requestInfo.status = "ERROR";
            // 捕获更详细的错误信息
            const errorMessage = event?.message || "[XHR网络错误]";
            this._requestInfo.responseBody = `[XHR错误] ${errorMessage}`;
            this._requestInfo.duration =
              performance.now() - this._requestInfo._startTime;
            addRequestToList(this._requestInfo);
            // 同时将错误信息添加到控制台
            addConsoleLog(
              "error",
              `XHR错误: ${errorMessage}`,
              this._requestInfo.url
            );
          }

          if (originalOnerror) {
            return originalOnerror.apply(this, arguments);
          }
        };
      }

      return originalXHROpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
      if (isMonitoring && this._requestInfo) {
        this._requestInfo.requestBody = body;
      }
      return originalXHRSend.apply(this, arguments);
    };

    // 注意：控制台方法已经在脚本初始化时被拦截，这里不需要重复拦截
    // 确保控制台日志能够继续被捕获
    console.log(`监控已为${getDomainKey()}启动，控制台日志将继续被捕获`);
  }

  // 停止监控
  function stopMonitoring() {
    // 恢复原始方法
    window.fetch = originalFetch;
    XMLHttpRequest.prototype.open = originalXHROpen;
    XMLHttpRequest.prototype.send = originalXHRSend;

    // 注意：不再恢复原始console方法，以确保始终捕获控制台日志
    // 但仍然记录停止监控的日志
    console.log(`监控已为${getDomainKey()}停止，但控制台日志仍将被捕获`);
  }

  // 添加请求到列表 - 只添加包含监控关键字的URL
  function addRequestToList(requestInfo) {
    if (shouldMonitorUrl(requestInfo.url)) {
      requestHistory.unshift(requestInfo);

      // 限制历史记录数量
      if (requestHistory.length > MAX_HISTORY_SIZE) {
        requestHistory = requestHistory.slice(0, MAX_HISTORY_SIZE);
      }

      // 保存历史记录到GM_setValue
      try {
        GM_setValue("apiRequestHistory", JSON.stringify(requestHistory));
      } catch (e) {
        console.error("保存请求历史失败:", e);
      }

      updateRequestList();
    }
  }

  // 更新请求列表UI
  function updateRequestList() {
    // 检查监控窗口是否存在且未关闭
    if (!monitorWindow || monitorWindow.closed) {
      return;
    }

    const listContainer =
      monitorWindow.document.getElementById("api-request-list");
    if (!listContainer) return;

    listContainer.innerHTML = "";

    // 限制显示最近50个请求
    const recentRequests = requestHistory.slice(0, 50);

    recentRequests.forEach((request) => {
      const item = monitorWindow.document.createElement("div");
      item.className = "api-request-item";

      // 如果是当前打开的请求，添加高亮样式
      if (currentlyOpenRequestId === request.id) {
        item.style.fontWeight = "bold";
        item.style.backgroundColor = "#bbdefb";
      } else {
        // 根据状态设置颜色和图标
        if (request.status === "ERROR") {
          item.style.backgroundColor = "#ffebee";
        } else if (
          typeof request.status === "number" &&
          request.status >= 400
        ) {
          item.style.backgroundColor = "#fff8e1";
        } else if (
          typeof request.status === "number" &&
          request.status >= 200 &&
          request.status < 300
        ) {
          item.style.backgroundColor = "#e8f5e9";
        }
      }

      // 创建容器div来容纳所有元素
      const contentContainer = monitorWindow.document.createElement("div");
      contentContainer.style.display = "flex";
      contentContainer.style.alignItems = "center";

      // 添加状态图标
      const statusIcon = monitorWindow.document.createElement("span");
      if (request.status === "ERROR") {
        statusIcon.textContent = "❌";
        statusIcon.style.color = "#d32f2f";
      } else if (typeof request.status === "number" && request.status >= 400) {
        statusIcon.textContent = "⚠️";
        statusIcon.style.color = "#ff8f00";
      } else if (
        typeof request.status === "number" &&
        request.status >= 200 &&
        request.status < 300
      ) {
        statusIcon.textContent = "✅";
        statusIcon.style.color = "#388e3c";
      } else {
        statusIcon.textContent = "⏱️";
        statusIcon.style.color = "#757575";
      }
      statusIcon.style.marginRight = "5px";
      contentContainer.appendChild(statusIcon);

      // 请求时间列
      const timeColumn = monitorWindow.document.createElement("span");
      timeColumn.className = "time-column";
      timeColumn.textContent = request.timestamp;
      contentContainer.appendChild(timeColumn);

      const infoSpan = monitorWindow.document.createElement("span");
      infoSpan.textContent = `${request.method} ${getShortUrl(request.url)} (${
        request.status || "PENDING"
      })`;
      infoSpan.style.flex = "1";
      contentContainer.appendChild(infoSpan);

      const timeSpan = monitorWindow.document.createElement("span");
      timeSpan.textContent = `${
        request.duration ? Math.round(request.duration) + "ms" : ""
      }`;
      timeSpan.style.marginLeft = "10px";
      timeSpan.style.color = "#666";
      contentContainer.appendChild(timeSpan);

      // 将内容容器添加到item中
      item.appendChild(contentContainer);

      item.addEventListener("click", () => {
        showRequestDetails(request);
      });

      listContainer.appendChild(item);
    });
  }

  function getShortUrl(url) {
    // 显示完整URL，但限制长度
    // 首先检查是否存在监控关键字
    let keywordFound = false;
    let keywordStartIndex = url.length;

    // 查找第一个出现的监控关键字
    if (monitorKeywords.length > 0) {
      for (const keyword of monitorKeywords) {
        const index = url.indexOf(keyword);
        if (index !== -1 && index < keywordStartIndex) {
          keywordStartIndex = index + keyword.length;
          keywordFound = true;
        }
      }
    }

    // 如果找到了监控关键字，从关键字开始显示，这样可以突出显示相关部分
    // 但不再只显示关键字后面的部分，而是从关键字开始显示更多内容
    let displayUrl = url;
    if (keywordFound && keywordStartIndex > 0) {
      // 显示从关键字开始的部分，但限制长度
      displayUrl = url.substring(keywordStartIndex);
    }
    return displayUrl;
  }

  // 显示请求详情
  function showRequestDetails(request) {
    // 检查监控窗口是否存在且未关闭
    if (!monitorWindow || monitorWindow.closed) {
      return;
    }

    const detailPanel =
      monitorWindow.document.getElementById("api-detail-panel");
    if (!detailPanel) return;

    // 显示详情面板
    detailPanel.style.display = "block";

    // 如果点击的是当前已打开的请求，则隐藏详情面板
    if (currentlyOpenRequestId === request.id) {
      currentlyOpenRequestId = null;
      detailPanel.style.display = "none";
      // 更新请求列表以移除高亮
      updateRequestList();
      return;
    }

    // 更新当前打开的请求ID
    currentlyOpenRequestId = request.id;
    // 更新请求列表以显示高亮
    updateRequestList();

    // 基本信息
    const basicInfo = monitorWindow.document.createElement("div");
    basicInfo.innerHTML = `
            <h3 style="display: inline-block; margin-right: 10px;">请求详情</h3><button class="copy-btn" title="复制" onclick="copyToClipboard(this.parentElement.textContent)">📄</button>
            <div><strong>时间:</strong> ${request.timestamp}</div>
            <div><strong>方法:</strong> ${request.method}</div>
            <div><strong>URL:</strong> ${request.url}</div>
            <div><strong>状态:</strong> ${request.status}</div>
            ${
              request.duration
                ? `<div><strong>耗时:</strong> ${Math.round(
                    request.duration
                  )}ms</div>`
                : ""
            }
        `;

    // 请求头
    const requestHeadersSection = monitorWindow.document.createElement("div");
    requestHeadersSection.innerHTML = `
            <h4 style="display: inline-block; margin-right: 10px;">请求头</h4><button class="copy-btn" title="复制" onclick="copyToClipboard(this.nextElementSibling.textContent)">📄</button>
            <pre>${formatObject(request.headers)}</pre>
        `;

    // 请求体
    const requestBodySection = monitorWindow.document.createElement("div");
    requestBodySection.innerHTML = `
            <h4 style="display: inline-block; margin-right: 10px;">请求体</h4><button class="copy-btn" title="复制" onclick="copyToClipboard(this.nextElementSibling.textContent)">📄</button>
            <pre>${formatRequestBody(request.requestBody)}</pre>
        `;

    // 响应头
    const responseHeadersSection = monitorWindow.document.createElement("div");
    responseHeadersSection.innerHTML = `
            <h4 style="display: inline-block; margin-right: 10px;">响应头</h4><button class="copy-btn" title="复制" onclick="copyToClipboard(this.nextElementSibling.textContent)">📄</button>
            <pre>${
              request.responseHeaders
                ? formatObject(request.responseHeaders)
                : "N/A"
            }</pre>
        `;

    // 响应体
    const responseBodySection = monitorWindow.document.createElement("div");
    responseBodySection.innerHTML = `
            <h4 style="display: inline-block; margin-right: 10px;">响应体</h4><button class="copy-btn" title="复制" onclick="copyToClipboard(this.nextElementSibling.textContent)">📄</button>
            <pre>${formatResponseBody(request.responseBody)}</pre>
        `;

    // 清空详情面板并添加新内容
    // 保留关闭按钮
    const closeButton = detailPanel.querySelector("#close-detail-button");
    detailPanel.innerHTML = "";
    detailPanel.appendChild(closeButton);

    // 添加到详情面板
    detailPanel.appendChild(basicInfo);
    detailPanel.appendChild(requestHeadersSection);
    detailPanel.appendChild(requestBodySection);
    detailPanel.appendChild(responseHeadersSection);
    detailPanel.appendChild(responseBodySection);

    // 滚动到顶部
    detailPanel.scrollTop = 0;
  }

  // 格式化对象为字符串
  function formatObject(obj) {
    if (!obj) return "{}";
    if (typeof obj === "string") return obj;
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  }

  // 格式化请求体
  function formatRequestBody(body) {
    if (!body) return "N/A";

    // 如果是FormData对象
    if (body instanceof FormData) {
      let result = "";
      for (let [key, value] of body.entries()) {
        result += `${key}: ${value}\n`;
      }
      return result || "FormData (empty)";
    }

    // 如果是字符串，尝试解析为JSON
    if (typeof body === "string") {
      try {
        return JSON.stringify(JSON.parse(body), null, 2);
      } catch {
        return body;
      }
    }

    // 其他情况
    return formatObject(body);
  }

  // 格式化响应体
  function formatResponseBody(body) {
    if (!body) return "N/A";

    if (typeof body === "string") {
      try {
        // 尝试解析为JSON
        return JSON.stringify(JSON.parse(body), null, 2);
      } catch {
        return body;
      }
    }

    try {
      const jsonStr = JSON.stringify(body, null, 2);
      return jsonStr;
    } catch {
      return String(body);
    }
  }

  // 清空历史记录
  function clearHistory() {
    requestHistory = [];

    // 清除保存的历史记录
    try {
      GM_setValue("apiRequestHistory", "[]");
    } catch (e) {
      console.error("清除请求历史失败:", e);
    }

    updateRequestList();

    // 如果详情面板显示，则隐藏它
    if (monitorWindow && !monitorWindow.closed) {
      const detailPanel =
        monitorWindow.document.getElementById("api-detail-panel");
      if (detailPanel) {
        detailPanel.style.display = "none";
      }
    }

    // 重置当前打开的请求ID
    currentlyOpenRequestId = null;
    // 更新请求列表以移除高亮
    updateRequestList();
  }

  // 确保在DOM加载完成后初始化
  function initializeScript() {
    // 获取监控关键字列表
    getMonitorKeywords();

    // 从GM_getValue加载保存的请求历史记录
    try {
      const savedHistory = GM_getValue("apiRequestHistory", "[]");
      if (savedHistory) {
        requestHistory = JSON.parse(savedHistory);
        console.log(`已恢复 ${requestHistory.length} 条API请求历史记录`);
      }
    } catch (e) {
      console.error("加载请求历史失败:", e);
      requestHistory = [];
    }

    // 添加调试日志
    console.log(
      `API监控工具已加载 - 监控关键字: ${monitorKeywords.join(", ")}`
    );

    // 恢复保存的监控状态
    restoreMonitoringState();
    // 初始化菜单
    initializeMenu();

    // 如果之前保存的状态是开启的，恢复监控
    if (isMonitoring) {
      console.log("根据保存的状态恢复监控");
      createMonitorWindow();
      // startMonitoring函数已经包含了console方法的拦截，无需重复添加
      startMonitoring();
      // 创建状态提示图标
      createStatusIcon();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeScript);
  } else {
    initializeScript();
  }
})();
