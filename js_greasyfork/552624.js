// ==UserScript==
// @name         Gemini 智阅助手
// @namespace    http://tampermonkey.net/
// @version      2025-10-16
// @description  为 Gemini Google 添加阅读模式，自动检测剪贴板变化并发送到输入框
// @author       SedationH
// @match        https://gemini.google.com/app*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552624/Gemini%20%E6%99%BA%E9%98%85%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/552624/Gemini%20%E6%99%BA%E9%98%85%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

const READING_MODE_PROMPT = `
我正在学习英文，并且希望通过阅读英文书籍来提高我的语言能力和理解力。我的**蓝思值（Lexile Measure）在 1000+**。

**我的目标是：**

1. 成功读完一本英文书，并理解其内容。
2. 在阅读过程中，最大化地学习新的**英文词汇、语法结构和表达方式**。

请你充当我的**阅读和语言学习伙伴 (Reading and Language Learning Partner)**，并根据我提供的英文书摘或段落，完成以下任务：

1. **分级和简化翻译**：提供清晰、自然的**简体中文翻译**。请务必提供**逐句的简体中文翻译**，以确保清晰、精准地传达每个句子的意思。其中加粗在 2 中提到的内容
2. **核心词汇/短语分析 (Lexile 1000+ 侧重)**：**有新学价值的核心词汇和短语**。对于每一个词汇/短语，请提供：

   - **英文原文**
   - **美音 音标** (使用标准 KK 或 IPA 格式)
   - **中文释义** (侧重在当前上下文中的含义)
   - 一个**不同于原文、有助于理解和学习的英文例句**

3. **文化/背景知识补充**：如果原文涉及特定的文化、历史背景或习语，请提供简洁、相关的**背景知识**。

**请等待我给出第一个英文段落。你明白了吗？**
`;


;(function () {
  "use strict"

  // 阅读模式状态管理
  let isReadingMode = false;
  let lastClipboardContent = "";
  let clipboardCheckInterval = null;

  // 创建阅读模式按钮
  function createReadingModeButton() {
    const button = document.createElement("div");
    button.id = "reading-mode-toggle";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.zIndex = "9999";
    button.style.padding = "10px 15px";
    button.style.backgroundColor = isReadingMode ? "#4CAF50" : "#9E9E9E";
    button.style.color = "white";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.fontSize = "14px";
    button.style.fontFamily = "Arial, sans-serif";
    button.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
    button.style.transition = "background-color 0.3s";
    button.textContent = `智阅模式 ${isReadingMode ? "开" : "关"}`;
    
    // 添加点击事件
    button.addEventListener("click", toggleReadingMode);
    
    // 添加悬浮效果
    button.addEventListener("mouseenter", () => {
      button.style.opacity = "0.8";
    });
    
    button.addEventListener("mouseleave", () => {
      button.style.opacity = "1";
    });
    
    document.body.appendChild(button);
    return button;
  }

  // 更新按钮状态和样式
  function updateButtonState() {
    const button = document.getElementById("reading-mode-toggle");
    if (button) {
      button.style.backgroundColor = isReadingMode ? "#4CAF50" : "#9E9E9E";
      button.textContent = `智阅模式 ${isReadingMode ? "开" : "关"}`;
    }
  }

  // 切换阅读模式
  function toggleReadingMode() {
    isReadingMode = !isReadingMode;
    updateButtonState();
    
    if (isReadingMode) {
      startClipboardMonitoring();
      console.log("智阅模式已开启 - 开始监控剪贴板");
    } else {
      stopClipboardMonitoring();
      console.log("智阅模式已关闭 - 停止监控剪贴板");
    }
  }

  // 检测是新对话
  function isNewConversation() {
    const url = window.location.href;
    const match = url.match(/^https:\/\/gemini\.google\.com\/app\/?$/);
    return match !== null;
  }

  // 开始监控剪贴板
  async function startClipboardMonitoring() {
    if (clipboardCheckInterval) {
      clearInterval(clipboardCheckInterval);
    }

    if (isNewConversation()) {
      console.log("检测到新对话，发送预设 Prompt");
      sendToGemini(READING_MODE_PROMPT);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    // 立即检查一次剪贴板
    checkClipboard();
    
    // 每秒检查一次剪贴板
    clipboardCheckInterval = setInterval(checkClipboard, 1000);
  }

  // 停止监控剪贴板
  function stopClipboardMonitoring() {
    if (clipboardCheckInterval) {
      clearInterval(clipboardCheckInterval);
      clipboardCheckInterval = null;
    }
  }


  // 检查剪贴板内容
  async function checkClipboard() {
    try {
      // 检查是否支持 clipboard API
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        console.error("当前浏览器不支持剪贴板 API");
        return;
      }
      
      const clipboardText = await navigator.clipboard.readText();
      
      // 检查剪贴板内容是否发生变化
      if (clipboardText && clipboardText !== lastClipboardContent) {
        console.log("检测到剪贴板变化:", clipboardText.substring(0, 50) + "...");
        lastClipboardContent = clipboardText;
        
        // 自动填充并发送
        await sendToGemini(clipboardText);
      }
    } catch (error) {
      // 剪贴板权限错误或其他错误
      console.error("读取剪贴板时出错:", error);
    }
  }

  // 发送内容到 Gemini
  async function sendToGemini(content) {
    try {
      // 查找输入框 - 使用多种选择器策略
      const inputSelectors = [
        'div[contenteditable="true"]',
        'textarea',
        'input[type="text"]',
        '.rich-textarea',
        '[data-testid="prompt-textarea"]',
        'p[contenteditable="true"]'
      ];
      
      let inputElement = null;
      for (const selector of inputSelectors) {
        inputElement = document.querySelector(selector);
        if (inputElement) {
          console.log("找到输入框:", selector);
          break;
        }
      }
      
      if (!inputElement) {
        console.error("未找到输入框");
        return;
      }
      
      // 聚焦输入框
      inputElement.focus();
      
      // 清空现有内容
      inputElement.textContent = "";
      
      // 设置新内容
      if (inputElement.tagName.toLowerCase() === 'textarea' || inputElement.tagName.toLowerCase() === 'input') {
        inputElement.value = content;
      } else {
        // 对于 contenteditable 元素
        inputElement.textContent = content;
      }
      
      // 触发输入事件
      const inputEvent = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(inputEvent);
      
      // 等待一小段时间让界面更新
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 查找并点击发送按钮
      const sendButtonSelectors = [
        'button[aria-label*="发送"]',
        'button[aria-label*="Send"]',
        'button[data-testid="send-button"]',
        'button[type="submit"]',
        '.send-button',
        'button:has(svg)'
      ];
      
      let sendButton = null;
      for (const selector of sendButtonSelectors) {
        sendButton = document.querySelector(selector);
        if (sendButton) {
          console.log("找到发送按钮:", selector);
          break;
        }
      }
      
      if (sendButton) {
        // 检查按钮是否可用
        if (!sendButton.disabled) {
          sendButton.click();
          console.log("已自动发送内容到 Gemini");
        } else {
          console.log("发送按钮不可用，可能内容为空或正在处理");
        }
      } else {
        console.error("未找到发送按钮");
      }
      
    } catch (error) {
      console.error("发送内容到 Gemini 时出错:", error);
    }
  }

  // 初始化脚本
  function init() {
    console.log("Gemini 智阅助手已加载");
    
    // 等待页面加载完成
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        createReadingModeButton();
      });
    } else {
      createReadingModeButton();
    }
  }

  // 启动脚本
  init();

})()
