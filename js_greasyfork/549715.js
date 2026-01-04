// ==UserScript==
// @name         宜搭自动点击
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Auto click for yida
// @author       yang
// @match        *://*.aliwork.com/*
// @match        *://*.dingtalk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliwork.com
// @grant        none
// @license      No License
// @downloadURL https://update.greasyfork.org/scripts/549715/%E5%AE%9C%E6%90%AD%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/549715/%E5%AE%9C%E6%90%AD%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 定义目标按钮的选择器
  const moreButtonSelector =
    "button.next-btn.next-medium.next-btn-primary.next-menu-btn";
  const syncButtonSelector =
    "#App > div > section > section > section > div > div > ul > li:nth-child(1) > div > span > div > a > span";
  const confirmButtonSelector =
    "body > div > div > div > div > button.next-btn.next-medium.next-btn-primary.next-dialog-btn";
  const refreshButtonSelector =
    "#App > div > section > section > section > section > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > button";
  const targetContainerSelector =
    "#App > div > section > section > section > section > div > div > div > div > div > div > div > div > div > div > div > div > div";

  // 全局变量
  let isRunning = false;
  let intervalId = null;
  let loadingIcon = null; // 加载图标

  // 自定义 alert 函数（放大提示弹窗）
  function customAlert(message, duration = 2000, backgroundColor = "#4CAF50") {
    const alertBox = document.createElement("div");
    alertBox.style.position = "fixed";
    alertBox.style.top = "50px"; // 调整位置
    alertBox.style.left = "50%";
    alertBox.style.transform = "translateX(-50%)";
    alertBox.style.padding = "30px 60px"; // 增加内边距
    alertBox.style.backgroundColor = backgroundColor; // 背景颜色
    alertBox.style.color = "white";
    alertBox.style.borderRadius = "12px"; // 增加圆角
    alertBox.style.zIndex = "1000";
    alertBox.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.2)"; // 增加阴影
    alertBox.style.fontSize = "24px"; // 增加字体大小
    alertBox.style.width = "400px"; // 设置固定宽度
    alertBox.style.textAlign = "center"; // 文字居中
    alertBox.innerText = message;

    document.body.appendChild(alertBox);

    // 2秒后自动消失
    setTimeout(() => {
      document.body.removeChild(alertBox);
    }, duration);
  }

  // 创建旋转加载图标
  function createLoadingIcon() {
    const icon = document.createElement("div");
    icon.style.position = "fixed";
    icon.style.top = "50%"; // 垂直居中
    icon.style.left = "50%"; // 水平居中
    icon.style.transform = "translate(-50%, -50%)"; // 精确居中
    icon.style.width = "150px";
    icon.style.height = "150px";
    icon.style.border = "10px solid #f3f3f3"; // 加粗边框
    icon.style.borderTop = "10px solid #3498db"; // 加粗顶部边框
    icon.style.borderRadius = "50%";
    icon.style.animation = "spin 1s linear infinite";
    icon.style.zIndex = "1000";

    // 添加动画样式
    const style = document.createElement("style");
    style.textContent = `
                @keyframes spin {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(360deg); }
                }
            `;
    document.head.appendChild(style);

    return icon;
  }

  // 显示加载图标
  function showLoadingIcon() {
    if (!loadingIcon) {
      loadingIcon = createLoadingIcon();
      document.body.appendChild(loadingIcon);
    }
  }

  // 隐藏加载图标
  function hideLoadingIcon() {
    if (loadingIcon) {
      document.body.removeChild(loadingIcon);
      loadingIcon = null;
    }
  }

  // 模拟点击目标按钮的函数
  function clickButton(button) {
    if (button) {
      // 添加聚焦和悬停状态（模拟真实用户操作）
      button.focus();
      button.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));

      // 创建更完整的事件对象
      const createMouseEvent = (type) => {
        const rect = button.getBoundingClientRect();
        return new MouseEvent(type, {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2,
          button: 0, // 主鼠标按钮
          composed: true, // 允许跨越Shadow DOM边界
        });
      };

      // 触发完整事件序列
      const events = ["mousedown", "mouseup", "click"];
      events.forEach((eventType) => {
        const event = createMouseEvent(eventType);
        const cancelled = !button.dispatchEvent(event);

        // 检查事件是否被取消
        if (cancelled && eventType === "click") {
          console.warn("点击事件被阻止，尝试调用原生click方法");
          button.click(); // 回退方案
        }
      });

      console.log("事件序列已触发");
    } else {
      console.log("未找到目标按钮");
    }
  }

  // 等待特定元素出现的函数
  function waitForElement(selector, callback) {
    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(interval);
        callback(element);
      }
    }, 500);
  }

  // 主循环函数
  function mainLoop() {
    if (!isRunning) return; // 如果未启动，则退出

    // 点击"更多"按钮 - 使用clickButton函数
    const moreButton = document.querySelector(moreButtonSelector);
    clickButton(moreButton);

    // 等待同步按钮出现并点击
    waitForElement(syncButtonSelector, (syncButton) => {
      syncButton.click();

      // 等待确认按钮出现并点击
      waitForElement(confirmButtonSelector, (confirmButton) => {
        confirmButton.click();

        // 等待5秒确保宜搭自动化完成
        setTimeout(() => {
          const refreshButton = document.querySelector(refreshButtonSelector);
          if (refreshButton) {
            refreshButton.click();
            console.log("已点击刷新按钮");
          }

          // 等待3秒后再次执行主循环
          setTimeout(() => {
            if (isRunning) {
              intervalId = setTimeout(mainLoop, 5000); // 5秒后再次执行
            }
          }, 3000);
        }, 5000);
      });
    });
  }

  // 创建启动和停止按钮
  function createControlButtons() {
    // 等待目标容器加载完成
    waitForElement(targetContainerSelector, (container) => {
      // 创建启动按钮
      const startButton = document.createElement("button");
      startButton.innerText = "启动";
      startButton.style.marginLeft = "10px";
      startButton.style.padding = "5px 10px";
      startButton.style.backgroundColor = "#4CAF50";
      startButton.style.color = "white";
      startButton.style.border = "none";
      startButton.style.borderRadius = "4px";
      startButton.style.cursor = "pointer";

      startButton.addEventListener("click", () => {
        // 添加确认弹窗
        if (confirm("是否已经筛选好所需要同步的数据？")) {
          if (!isRunning) {
            isRunning = true;
            mainLoop();
            startButton.disabled = true;
            stopButton.disabled = false;
            showLoadingIcon(); // 显示加载图标
            customAlert("已启动", 2000); // 显示自定义 alert
          }
        } else {
          // 用户点击取消，不执行任何操作
          customAlert("已取消启动", 2000, "#f44336");
          return;
        }
      });

      // 创建停止按钮
      const stopButton = document.createElement("button");
      stopButton.innerText = "停止";
      stopButton.style.marginLeft = "10px";
      stopButton.style.padding = "5px 10px";
      stopButton.style.backgroundColor = "#f44336";
      stopButton.style.color = "white";
      stopButton.style.border = "none";
      stopButton.style.borderRadius = "4px";
      stopButton.style.cursor = "pointer";
      stopButton.disabled = true;

      stopButton.addEventListener("click", () => {
        isRunning = false;
        clearTimeout(intervalId);
        startButton.disabled = false;
        stopButton.disabled = true;
        hideLoadingIcon(); // 隐藏加载图标
        customAlert("已停止", 2000); // 显示自定义 alert
      });

      // 将按钮添加到容器中
      container.appendChild(startButton);
      container.appendChild(stopButton);
    });
  }

  // 初始化
  createControlButtons();
})();
