// ==UserScript==
// @name         黑与白自动抽卡助手
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  自动进行十连抽卡操作
// @author       Bay
// @license      MIT
// @match        https://cdk.hybgzs.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561215/%E9%BB%91%E4%B8%8E%E7%99%BD%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%8D%A1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561215/%E9%BB%91%E4%B8%8E%E7%99%BD%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%8D%A1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 目标抽卡路径
  const TARGET_PATH = "/entertainment/cards/draw";

  // 状态变量
  let isRunning = false;
  let drawCount = 0;

  // 日志函数
  function log(message, type = "info") {
    const timestamp = new Date().toLocaleTimeString("zh-CN");
    const prefix = "[CDK自动抽卡]";
    const logMessage = `${prefix} [${timestamp}] ${message}`;

    switch (type) {
      case "error":
        console.error(logMessage);
        break;
      case "warn":
        console.warn(logMessage);
        break;
      case "success":
        console.log("%c" + logMessage, "color: #38ef7d");
        break;
      default:
        console.log(logMessage);
    }
  }

  // 延迟函数
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // 查找包含指定文本的按钮
  function findButtonByText(text) {
    log(`正在查找包含文本"${text}"的按钮...`);

    const buttons = document.querySelectorAll("button");
    for (const btn of buttons) {
      if (btn.textContent.includes(text)) {
        log(`找到按钮: ${btn.textContent.trim()}`, "success");
        return btn;
      }
    }
    // 也检查 div、span 等可能作为按钮的元素
    const allElements = document.querySelectorAll("div, span, a");
    for (const el of allElements) {
      if (el.textContent.trim() === text || el.textContent.includes(text)) {
        // 检查是否可点击
        const style = window.getComputedStyle(el);
        if (
          style.cursor === "pointer" ||
          el.onclick ||
          el.getAttribute("role") === "button"
        ) {
          log(`找到可点击元素: ${el.textContent.trim()}`, "success");
          return el;
        }
      }
    }
    log(`未找到包含文本"${text}"的按钮`, "warn");
    return null;
  }

  // 查找弹窗中的确认按钮
  function findConfirmButton() {
    // 常见的确认按钮文本
    const confirmTexts = ["确认", "确定", "OK", "Confirm", "是", "好的"];

    log("正在查找确认按钮...");

    // 首先查找弹窗/对话框
    const dialogs = document.querySelectorAll(
      '[role="dialog"], .modal, .popup, .dialog, [class*="modal"], [class*="popup"], [class*="dialog"]'
    );
    log(`找到 ${dialogs.length} 个弹窗元素`);

    for (const dialog of dialogs) {
      const buttons = dialog.querySelectorAll(
        'button, [role="button"], .btn, [class*="btn"]'
      );
      for (const btn of buttons) {
        for (const text of confirmTexts) {
          if (btn.textContent.includes(text)) {
            log(`在弹窗中找到确认按钮: ${btn.textContent.trim()}`, "success");
            return btn;
          }
        }
      }
    }

    // 如果没有找到弹窗，全局查找确认按钮
    const allButtons = document.querySelectorAll('button, [role="button"]');
    for (const btn of allButtons) {
      for (const text of confirmTexts) {
        if (btn.textContent.includes(text) && isVisible(btn)) {
          log(`全局查找到确认按钮: ${btn.textContent.trim()}`, "success");
          return btn;
        }
      }
    }

    log("未找到确认按钮", "warn");
    return null;
  }

  // 检查元素是否可见
  function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0" &&
      el.offsetParent !== null
    );
  }

  // 检查按钮是否可点击
  function isButtonClickable(btn) {
    if (!btn) return false;
    if (btn.disabled) {
      log("按钮已禁用 (disabled属性)", "warn");
      return false;
    }
    if (btn.classList.contains("disabled")) {
      log("按钮已禁用 (disabled类名)", "warn");
      return false;
    }
    if (btn.getAttribute("disabled") !== null) {
      log("按钮已禁用 (disabled attribute)", "warn");
      return false;
    }
    const style = window.getComputedStyle(btn);
    if (style.pointerEvents === "none") {
      log("按钮已禁用 (pointer-events: none)", "warn");
      return false;
    }
    return isVisible(btn);
  }

  // 检查当前是否在目标路径
  function isOnTargetPath() {
    return window.location.pathname === TARGET_PATH;
  }

  // 跳转到目标路径
  function navigateToTargetPath() {
    log(`当前路径: ${window.location.pathname}`);
    log(`目标路径: ${TARGET_PATH}`);
    log("正在跳转到抽卡页面...", "info");
    window.location.href = TARGET_PATH;
  }

  // 执行单次抽卡流程
  async function performDraw() {
    log("========== 开始新一轮抽卡 ==========");
    updateStatus("正在查找十连抽按钮...");

    // 查找十连抽按钮
    const drawButton = findButtonByText("十连抽");

    if (!drawButton) {
      log("未找到十连抽按钮", "error");
      updateStatus("未找到十连抽按钮");
      return false;
    }

    if (!isButtonClickable(drawButton)) {
      log("十连抽按钮不可点击，停止自动抽卡", "warn");
      updateStatus("十连抽按钮不可点击，停止自动抽卡");
      return false;
    }

    // 点击十连抽按钮
    log("点击十连抽按钮", "info");
    updateStatus("点击十连抽按钮...");
    drawButton.click();
    await delay(1000);

    // 等待第一个弹窗并点击确认
    log("等待第一个确认弹窗...", "info");
    updateStatus("等待第一个确认弹窗...");
    let confirmBtn = null;
    let attempts = 0;

    while (!confirmBtn && attempts < 20) {
      confirmBtn = findConfirmButton();
      if (!confirmBtn) {
        await delay(300);
        attempts++;
        log(`等待弹窗中... (尝试 ${attempts}/20)`);
      }
    }

    if (confirmBtn) {
      log("点击第一个确认按钮", "success");
      updateStatus("点击第一个确认按钮...");
      confirmBtn.click();
      await delay(1000);
    } else {
      log("未找到第一个确认按钮", "error");
      updateStatus("未找到第一个确认按钮");
      return false;
    }

    // 等待第二个弹窗并点击确认
    log("等待第二个确认弹窗...", "info");
    updateStatus("等待第二个确认弹窗...");
    confirmBtn = null;
    attempts = 0;

    while (!confirmBtn && attempts < 20) {
      confirmBtn = findConfirmButton();
      if (!confirmBtn) {
        await delay(300);
        attempts++;
        log(`等待弹窗中... (尝试 ${attempts}/20)`);
      }
    }

    if (confirmBtn) {
      log("点击第二个确认按钮", "success");
      updateStatus("点击第二个确认按钮...");
      confirmBtn.click();
      await delay(1000);
    } else {
      log("未找到第二个确认按钮", "error");
      updateStatus("未找到第二个确认按钮");
      return false;
    }

    drawCount++;
    log(`第 ${drawCount} 次抽卡完成！`, "success");
    updateStatus(`第 ${drawCount} 次抽卡完成`);

    return true;
  }

  // 主循环
  async function startAutoDrawLoop() {
    log("========== 自动抽卡启动 ==========", "success");

    // 检查是否在目标路径，如果不是则跳转
    if (!isOnTargetPath()) {
      log("当前不在抽卡页面，将自动跳转...", "warn");
      updateStatus("正在跳转到抽卡页面...");

      // 保存启动状态到 sessionStorage
      sessionStorage.setItem("cdk_auto_draw_start", "true");
      navigateToTargetPath();
      return;
    }

    isRunning = true;
    drawCount = 0;
    updateButtonState();

    log("开始自动抽卡循环", "info");

    while (isRunning) {
      const success = await performDraw();

      if (!success) {
        isRunning = false;
        updateButtonState();
        log(`自动抽卡结束，共完成 ${drawCount} 次抽卡`, "success");
        updateStatus(`自动抽卡结束，共完成 ${drawCount} 次抽卡`);
        break;
      }

      // 等待一段时间再进行下一次
      log("等待2秒后进行下一次抽卡...", "info");
      await delay(2000);
    }
  }

  // 停止自动抽卡
  function stopAutoDraw() {
    log("用户手动停止自动抽卡", "warn");
    isRunning = false;
    updateButtonState();
    updateStatus(`已停止，共完成 ${drawCount} 次抽卡`);
  }

  // 更新按钮状态
  function updateButtonState() {
    const startBtn = document.getElementById("cdk-start-btn");
    const stopBtn = document.getElementById("cdk-stop-btn");

    if (startBtn && stopBtn) {
      startBtn.style.display = isRunning ? "none" : "block";
      stopBtn.style.display = isRunning ? "block" : "none";
    }
  }

  // 更新状态显示
  function updateStatus(message) {
    const statusEl = document.getElementById("cdk-status");
    if (statusEl) {
      statusEl.textContent = message;
    }
  }

  // 创建控制面板
  function createPanel() {
    // 检查是否已存在面板
    if (document.getElementById("cdk-auto-draw-panel")) {
      log("面板已存在，跳过创建");
      return;
    }

    log("创建控制面板", "info");

    const panel = document.createElement("div");
    panel.id = "cdk-auto-draw-panel";
    panel.innerHTML = `
            <style>
                #cdk-auto-draw-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 280px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                    z-index: 999999;
                    font-family: 'Microsoft YaHei', 'Segoe UI', sans-serif;
                    color: white;
                    overflow: hidden;
                }
                #cdk-auto-draw-panel .panel-header {
                    padding: 15px 20px;
                    background: rgba(0,0,0,0.2);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: move;
                }
                #cdk-auto-draw-panel .panel-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }
                #cdk-auto-draw-panel .panel-header .minimize-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0 5px;
                    opacity: 0.8;
                    transition: opacity 0.2s;
                }
                #cdk-auto-draw-panel .panel-header .minimize-btn:hover {
                    opacity: 1;
                }
                #cdk-auto-draw-panel .panel-body {
                    padding: 20px;
                }
                #cdk-auto-draw-panel .btn {
                    width: 100%;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 8px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-bottom: 10px;
                }
                #cdk-auto-draw-panel #cdk-start-btn {
                    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                    color: white;
                }
                #cdk-auto-draw-panel #cdk-start-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 20px rgba(17,153,142,0.4);
                }
                #cdk-auto-draw-panel #cdk-stop-btn {
                    background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
                    color: white;
                    display: none;
                }
                #cdk-auto-draw-panel #cdk-stop-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 20px rgba(235,51,73,0.4);
                }
                #cdk-auto-draw-panel .status-box {
                    background: rgba(255,255,255,0.15);
                    border-radius: 8px;
                    padding: 12px 15px;
                    font-size: 13px;
                    line-height: 1.5;
                }
                #cdk-auto-draw-panel .status-label {
                    font-size: 12px;
                    opacity: 0.8;
                    margin-bottom: 5px;
                }
                #cdk-auto-draw-panel #cdk-status {
                    word-break: break-all;
                }
                #cdk-auto-draw-panel.minimized .panel-body {
                    display: none;
                }
                #cdk-auto-draw-panel .tip {
                    font-size: 11px;
                    opacity: 0.7;
                    margin-top: 10px;
                    text-align: center;
                }
            </style>
            <div class="panel-header">
                <h3>🎴 自动抽卡助手</h3>
                <button class="minimize-btn" title="最小化">−</button>
            </div>
            <div class="panel-body">
                <button id="cdk-start-btn" class="btn">🚀 开始自动抽卡</button>
                <button id="cdk-stop-btn" class="btn">⏹️ 停止抽卡</button>
                <div class="status-box">
                    <div class="status-label">当前状态：</div>
                    <div id="cdk-status">等待开始...</div>
                </div>
                <div class="tip">💡 日志输出在浏览器控制台 (F12)</div>
            </div>
        `;

    document.body.appendChild(panel);

    // 绑定事件
    document
      .getElementById("cdk-start-btn")
      .addEventListener("click", startAutoDrawLoop);
    document
      .getElementById("cdk-stop-btn")
      .addEventListener("click", stopAutoDraw);

    // 最小化功能
    const minimizeBtn = panel.querySelector(".minimize-btn");
    minimizeBtn.addEventListener("click", () => {
      panel.classList.toggle("minimized");
      minimizeBtn.textContent = panel.classList.contains("minimized")
        ? "+"
        : "−";
    });

    // 拖拽功能
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    const header = panel.querySelector(".panel-header");

    header.addEventListener("mousedown", (e) => {
      if (e.target === minimizeBtn) return;
      isDragging = true;
      initialX = e.clientX - panel.offsetLeft;
      initialY = e.clientY - panel.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      panel.style.left = currentX + "px";
      panel.style.right = "auto";
      panel.style.top = currentY + "px";
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    log("控制面板创建完成", "success");
  }

  // 检查是否需要自动启动
  function checkAutoStart() {
    if (sessionStorage.getItem("cdk_auto_draw_start") === "true") {
      sessionStorage.removeItem("cdk_auto_draw_start");
      log("检测到自动启动标记，将在2秒后开始抽卡...", "info");
      setTimeout(() => {
        startAutoDrawLoop();
      }, 2000);
    }
  }

  // 初始化
  function init() {
    log("========== CDK自动抽卡助手已加载 ==========", "success");
    log(`当前页面: ${window.location.href}`);
    log(`当前路径: ${window.location.pathname}`);
    log(`目标路径: ${TARGET_PATH}`);
    log(`是否在目标页面: ${isOnTargetPath() ? "是" : "否"}`);

    createPanel();
    checkAutoStart();
  }

  // 页面加载完成后初始化
  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }
})();
