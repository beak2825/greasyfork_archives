// ==UserScript==
// @name         黑与白自动抽卡助手
// @namespace    http://tampermonkey.net/
// @version      3.3.0
// @description  修复UI点击溢出问题，优化步进逻辑，极致顺滑
// @author       Bay (Optimized by Expert)
// @license      MIT
// @match        https://cdk.hybgzs.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561215/%E9%BB%91%E4%B8%8E%E7%99%BD%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%8D%A1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561215/%E9%BB%91%E4%B8%8E%E7%99%BD%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%8D%A1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ================= 核心配置 =================
  const DEFAULT_CONFIG = {
    paidLimit: 400,        // 默认改为400
    timeout: 10000,
  };

  const INTERNAL_CONFIG = {
    minDelay: 1000,
    maxDelay: 2000,
    pollInterval: 500,
    maxConsecutiveErrors: 5,
    maxDisabledRetries: 10
  };

  let CONFIG = { ...DEFAULT_CONFIG };
  try {
      const saved = localStorage.getItem("cdk_auto_config_v3");
      if (saved) CONFIG = { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
  } catch (e) { console.error(e); }

  const CONSTANTS = { targetPath: "/entertainment/cards/draw" };
  let isRunning = false;
  let drawCount = 0;
  let consecutiveErrors = 0;
  let disabledRetries = 0;

  // ================= 工具函数 =================

  function showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `ios-toast ${type}`;
      toast.innerHTML = `<span>${message}</span>`;
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('show'));
      setTimeout(() => {
          toast.classList.remove('show');
          setTimeout(() => toast.remove(), 300);
      }, 3000);
  }

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const randomDelay = () => delay(Math.floor(Math.random() * (INTERNAL_CONFIG.maxDelay - INTERNAL_CONFIG.minDelay + 1) + INTERNAL_CONFIG.minDelay));

  function saveConfig() {
      localStorage.setItem("cdk_auto_config_v3", JSON.stringify(CONFIG));
      updatePanelConfigDisplay();
  }

  // ================= DOM 解析与逻辑 =================

  function getStatValue(labelText) {
      const allDivs = document.querySelectorAll('div');
      for (const div of allDivs) {
          if (div.textContent.trim() === labelText) {
              const valueDiv = div.previousElementSibling;
              if (valueDiv) return valueDiv.textContent.trim();
          }
      }
      return null;
  }

  function getFreeRemaining() {
      const text = getStatValue("免费剩余");
      return text ? parseInt(text, 10) : 0;
  }

  function getPaidUsed() {
      const text = getStatValue("付费已用");
      if (!text) return 0;
      const parts = text.split('/');
      return parts.length > 0 ? parseInt(parts[0], 10) : 0;
  }

  function findButtonByText(text) {
    const buttons = document.querySelectorAll("button");
    for (const btn of buttons) {
      if (btn.textContent.includes(text) && isVisible(btn)) return btn;
    }
    const allElements = document.querySelectorAll("div, span, a");
    for (const el of allElements) {
      if (el.textContent.trim() === text || el.textContent.includes(text)) {
        const style = window.getComputedStyle(el);
        if ((style.cursor === "pointer" || el.getAttribute("role") === "button") && isVisible(el)) {
          return el;
        }
      }
    }
    return null;
  }

  function findConfirmButton() {
    const confirmTexts = ["确认", "确定", "OK", "Confirm", "是", "好的", "领取", "再抽一次"];
    const dialogs = document.querySelectorAll('[role="dialog"], .modal, .popup, .dialog, .van-dialog');
    for (const dialog of dialogs) {
      if (!isVisible(dialog)) continue;
      const buttons = dialog.querySelectorAll('button, [role="button"], .btn, div, span');
      for (const btn of buttons) {
        for (const text of confirmTexts) {
          if (btn.textContent && btn.textContent.includes(text) && isVisible(btn)) {
            if (btn.textContent.includes("取消")) continue;
            return btn;
          }
        }
      }
    }
    const allButtons = document.querySelectorAll('button, [role="button"], .van-button');
    for (const btn of allButtons) {
      for (const text of confirmTexts) {
        if (btn.textContent.includes(text) && isVisible(btn)) {
           if (btn.textContent.includes("取消")) continue;
           return btn;
        }
      }
    }
    return null;
  }

  async function waitForElement(finderFunc, description) {
    const maxAttempts = CONFIG.timeout / INTERNAL_CONFIG.pollInterval;
    let attempts = 0;
    while (attempts < maxAttempts) {
      if (!isRunning) return null;
      const element = finderFunc();
      if (element) return element;
      await delay(INTERNAL_CONFIG.pollInterval);
      attempts++;
      if (attempts % 4 === 0) updateStatus(`等待${description}...`);
    }
    return null;
  }

  function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0" && el.offsetParent !== null;
  }

  function isButtonClickable(btn) {
    if (!btn) return false;
    if (btn.disabled || btn.classList.contains("disabled")) return false;
    const style = window.getComputedStyle(btn);
    if (style.pointerEvents === "none") return false;
    return isVisible(btn);
  }

  async function performDraw() {
    const paidUsed = getPaidUsed();
    const freeRemaining = getFreeRemaining();

    updateStatus(`状态: 免费${freeRemaining} | 付费${paidUsed}/${CONFIG.paidLimit}`);

    if (freeRemaining <= 0 && paidUsed >= CONFIG.paidLimit) {
        stopAutoDraw(`达到付费上限 (${paidUsed})`);
        showToast(`已达到付费上限 ${paidUsed} 次，脚本停止`, "warn");
        return false;
    }

    const drawButton = findButtonByText("十连抽");
    if (!drawButton) {
      consecutiveErrors++;
      if (consecutiveErrors >= INTERNAL_CONFIG.maxConsecutiveErrors) {
        stopAutoDraw("找不到入口");
        return false;
      }
      await delay(2000);
      return true;
    }
    consecutiveErrors = 0;

    if (!isButtonClickable(drawButton)) {
      disabledRetries++;
      updateStatus(`重试 ${disabledRetries}/${INTERNAL_CONFIG.maxDisabledRetries}`);
      if (disabledRetries >= INTERNAL_CONFIG.maxDisabledRetries) {
        stopAutoDraw("按钮长时间不可用");
        return false;
      }
      await delay(3000);
      return true;
    }
    disabledRetries = 0;

    drawButton.click();
    await randomDelay();

    updateStatus("等待弹窗...");
    const confirmBtn1 = await waitForElement(findConfirmButton, "第1个弹窗");

    if (!confirmBtn1) return true;
    confirmBtn1.click();
    await randomDelay();

    if (freeRemaining === 0) {
        updateStatus("等待结果...");
        const confirmBtn2 = await waitForElement(findConfirmButton, "第2个弹窗");
        if (!confirmBtn2) return true;
        confirmBtn2.click();
        await randomDelay();
    }

    drawCount++;
    return true;
  }

  async function startAutoDrawLoop() {
    if (window.location.pathname !== CONSTANTS.targetPath) {
        sessionStorage.setItem("cdk_auto_draw_start", "true");
        window.location.href = CONSTANTS.targetPath;
        return;
    }
    isRunning = true;
    consecutiveErrors = 0;
    disabledRetries = 0;
    updateButtonState();
    showToast("脚本已启动 🚀");

    while (isRunning) {
      const shouldContinue = await performDraw();
      if (!shouldContinue) break;
      if (isRunning) await delay(1000);
    }
  }

  function stopAutoDraw(reason = "用户停止") {
    isRunning = false;
    updateButtonState();
    updateStatus(`已停止: ${reason}`);
  }

  // ================= UI (v3.3) =================

  function updateButtonState() {
    const startBtn = document.getElementById("cdk-start-btn");
    const stopBtn = document.getElementById("cdk-stop-btn");
    if (startBtn && stopBtn) {
      startBtn.style.display = isRunning ? "none" : "block";
      stopBtn.style.display = isRunning ? "block" : "none";
    }
  }

  function updateStatus(message) {
    const el = document.getElementById("cdk-status");
    if (el) el.textContent = message;
  }

  function updatePanelConfigDisplay() {
      const el = document.getElementById("cdk-config-display");
      if (el) {
          el.innerHTML = `
            <div class="ios-row">
                <span class="ios-label">付费上限</span>
                <span class="ios-val">${CONFIG.paidLimit} <span class="ios-unit">次</span></span>
            </div>
            <div class="ios-row">
                <span class="ios-label">超时时间</span>
                <span class="ios-val">${CONFIG.timeout/1000} <span class="ios-unit">秒</span></span>
            </div>
          `;
      }
  }

  function showSettingsModal() {
      const existing = document.getElementById('cdk-settings-modal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'cdk-settings-modal';
      // 这里的 input 添加了 step="10"
      modal.innerHTML = `
        <div class="ios-backdrop"></div>
        <div class="ios-modal">
            <div class="ios-modal-header">
                <div class="ios-modal-title">设置参数</div>
                <div class="ios-modal-subtitle">修改脚本运行限制</div>
            </div>
            <div class="ios-modal-body">
                <div class="ios-input-group">
                    <div class="ios-input-row">
                        <label>付费抽卡上限</label>
                        <input type="number" id="inp-limit" value="${CONFIG.paidLimit}" step="10" min="0" placeholder="400">
                    </div>
                    <div class="ios-divider"></div>
                    <div class="ios-input-row">
                        <label>弹窗超时 (秒)</label>
                        <input type="number" id="inp-timeout" value="${CONFIG.timeout / 1000}" step="1" min="1" placeholder="10">
                    </div>
                </div>
            </div>
            <div class="ios-modal-footer">
                <button id="btn-cancel-settings" class="ios-btn ios-btn-cancel">取消</button>
                <button id="btn-save-settings" class="ios-btn ios-btn-save">保存</button>
            </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('.ios-backdrop').onclick = () => modal.remove();
      document.getElementById('btn-cancel-settings').onclick = () => modal.remove();
      document.getElementById('btn-save-settings').onclick = () => {
          let newLimit = parseInt(document.getElementById('inp-limit').value, 10);
          const newTimeout = parseFloat(document.getElementById('inp-timeout').value) * 1000;

          if (isNaN(newLimit) || isNaN(newTimeout)) {
              showToast("请输入有效的数字", "warn");
              return;
          }

          // 强制对齐到10的倍数（可选，这里做个取整优化）
          if (newLimit % 10 !== 0) {
              newLimit = Math.round(newLimit / 10) * 10;
          }

          CONFIG.paidLimit = newLimit;
          CONFIG.timeout = newTimeout;
          saveConfig();
          modal.remove();
          showToast("配置已保存");
      };
  }

  function injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        /* 全局字体 */
        #cdk-auto-draw-panel, #cdk-settings-modal, .ios-toast {
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
            -webkit-font-smoothing: antialiased;
        }

        /* Toast 通知 */
        .ios-toast {
            position: fixed; top: 24px; left: 50%; transform: translateX(-50%) translateY(-20px);
            background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px);
            color: #1d1d1f; padding: 12px 24px; border-radius: 99px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.04);
            font-size: 14px; font-weight: 500; letter-spacing: -0.2px;
            z-index: 1000001; opacity: 0; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: none; display: flex; align-items: center; justify-content: center;
        }
        .ios-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
        .ios-toast.warn { color: #ff3b30; background: rgba(255, 240, 240, 0.95); }

        /* 主面板 - 黄金比例优化 (宽320px) */
        #cdk-auto-draw-panel {
            position: fixed; top: 50px; right: 50px; width: 320px;
            background: rgba(28, 28, 30, 0.85); backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 22px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            z-index: 999999; color: #fff;
            overflow: hidden; transition: width 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .panel-header {
            padding: 18px 20px;
            display: flex; justify-content: space-between; align-items: center;
            cursor: move; border-bottom: 1px solid rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.03);
        }
        .panel-title { font-weight: 600; font-size: 16px; letter-spacing: -0.3px; color: rgba(255,255,255,0.95); }
        .panel-body { padding: 20px; }

        /* 按钮 */
        .btn {
            width: 100%; height: 44px; border: none; border-radius: 12px;
            cursor: pointer; font-weight: 600; font-size: 15px; margin-bottom: 14px;
            color: white; transition: all 0.2s; display: flex; align-items: center; justify-content: center;
        }
        .btn:active { transform: scale(0.98); opacity: 0.9; }
        #cdk-start-btn { background: #30d158; box-shadow: 0 4px 12px rgba(48, 209, 88, 0.2); }
        #cdk-stop-btn { background: #ff453a; box-shadow: 0 4px 12px rgba(255, 69, 58, 0.2); display: none; }
        #cdk-setting-btn {
            background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.9);
            font-weight: 500; font-size: 14px;
        }
        #cdk-setting-btn:hover { background: rgba(255,255,255,0.15); }

        /* 配置显示区 */
        .config-box { margin-bottom: 20px; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 12px 16px; }
        .ios-row { display: flex; justify-content: space-between; margin-bottom: 6px; align-items: center; }
        .ios-row:last-child { margin-bottom: 0; }
        .ios-label { font-size: 13px; color: rgba(235, 235, 245, 0.6); }
        .ios-val { color: #fff; font-weight: 600; font-size: 14px; }
        .ios-unit { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 400; margin-left: 2px; }

        .status-box {
            font-size: 12px; color: rgba(235, 235, 245, 0.5); text-align: center; margin-top: 10px;
            display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.2); transition: background 0.3s; }

        .minimize-btn {
            background: rgba(255,255,255,0.1); border:none; color:rgba(255,255,255,0.8);
            width: 28px; height: 28px; border-radius: 50%; cursor:pointer;
            display: flex; align-items: center; justify-content: center;
            font-size: 18px; line-height: 1; padding-bottom: 2px; transition: background 0.2s;
        }
        .minimize-btn:hover { background: rgba(255,255,255,0.2); }
        .minimized .panel-body { display: none; }
        .minimized { width: 200px; }

        /* 设置弹窗 */
        #cdk-settings-modal {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            z-index: 1000000; display: flex; justify-content: center; align-items: center;
        }
        .ios-backdrop {
            position: absolute; width: 100%; height: 100%;
            background: rgba(0,0,0,0.4); backdrop-filter: blur(10px);
            animation: fadeIn 0.3s ease;
        }
        .ios-modal {
            position: relative; width: 320px;
            background: rgba(30, 30, 30, 0.85); backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            border-radius: 18px;
            animation: scaleIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }
        .ios-modal-header {
            padding: 20px 16px 10px 16px; text-align: center;
        }
        .ios-modal-title { font-weight: 600; font-size: 17px; color: #fff; margin-bottom: 4px; }
        .ios-modal-subtitle { font-size: 13px; color: rgba(235, 235, 245, 0.6); }

        .ios-modal-body { padding: 10px 16px 20px 16px; }
        .ios-input-group {
            background: rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden;
        }
        .ios-input-row {
            display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; height: 48px; box-sizing: border-box;
        }
        .ios-input-row label { font-size: 16px; color: #fff; }

        .ios-input-row input[type=number] {
            width: 100px; background: transparent; border: none;
            color: #0a84ff; text-align: right; font-size: 17px; outline: none;
            -moz-appearance: textfield; font-weight: 400; padding: 0;
        }
        .ios-input-row input[type=number]::-webkit-inner-spin-button,
        .ios-input-row input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none; margin: 0;
        }

        .ios-divider { height: 1px; background: rgba(84, 84, 88, 0.5); margin-left: 16px; }

        .ios-modal-footer {
            display: flex; border-top: 1px solid rgba(84, 84, 88, 0.5); height: 48px;
        }
        .ios-btn {
            flex: 1; height: 100%; border: none; background: transparent;
            font-size: 17px; cursor: pointer; transition: background 0.2s;
            display: flex; align-items: center; justify-content: center;
        }
        /* 修复：给按钮添加圆角，防止点击背景溢出 */
        .ios-btn-cancel {
            color: #0a84ff; border-right: 1px solid rgba(84, 84, 88, 0.5); font-weight: 400;
            border-bottom-left-radius: 18px;
        }
        .ios-btn-save {
            color: #0a84ff; font-weight: 600;
            border-bottom-right-radius: 18px;
        }
        .ios-btn:active { background: rgba(255,255,255,0.1); }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `;
      document.head.appendChild(style);
  }

  function createPanel() {
    if (document.getElementById("cdk-auto-draw-panel")) return;
    injectStyles();

    const panel = document.createElement("div");
    panel.id = "cdk-auto-draw-panel";
    panel.innerHTML = `
            <div class="panel-header">
                <span class="panel-title">抽卡助手 Pro</span>
                <button class="minimize-btn">−</button>
            </div>
            <div class="panel-body">
                <div class="config-box" id="cdk-config-display"></div>
                <button id="cdk-start-btn" class="btn">开始运行</button>
                <button id="cdk-stop-btn" class="btn">停止运行</button>
                <button id="cdk-setting-btn" class="btn">设置参数</button>
                <div class="status-box">
                    <span class="status-dot" id="status-dot"></span>
                    <span id="cdk-status">准备就绪</span>
                </div>
            </div>
        `;
    document.body.appendChild(panel);

    updatePanelConfigDisplay();

    document.getElementById("cdk-start-btn").addEventListener("click", () => {
        document.getElementById("status-dot").style.background = "#30d158";
        startAutoDrawLoop();
    });
    document.getElementById("cdk-stop-btn").addEventListener("click", () => stopAutoDraw("用户手动停止"));
    document.getElementById("cdk-setting-btn").addEventListener("click", showSettingsModal);

    const header = panel.querySelector(".panel-header");
    const minBtn = panel.querySelector(".minimize-btn");
    minBtn.onclick = () => { panel.classList.toggle("minimized"); minBtn.textContent = panel.classList.contains("minimized") ? "+" : "−"; };

    let isDragging = false, startX, startY, initialLeft, initialTop;
    header.onmousedown = (e) => {
        if(e.target === minBtn) return;
        isDragging = true; startX = e.clientX; startY = e.clientY; initialLeft = panel.offsetLeft; initialTop = panel.offsetTop; e.preventDefault();
    };
    document.onmousemove = (e) => {
        if(!isDragging) return;
        panel.style.left = (initialLeft + e.clientX - startX) + "px"; panel.style.top = (initialTop + e.clientY - startY) + "px"; panel.style.right = "auto";
    };
    document.onmouseup = () => isDragging = false;
  }

  function init() {
    createPanel();
    if (sessionStorage.getItem("cdk_auto_draw_start") === "true") {
      sessionStorage.removeItem("cdk_auto_draw_start");
      setTimeout(() => {
          document.getElementById("status-dot").style.background = "#30d158";
          startAutoDrawLoop();
      }, 2000);
    }
  }

  if (document.readyState === "complete") init();
  else window.addEventListener("load", init);

})();
