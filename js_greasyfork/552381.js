// ==UserScript==
// @name         DeepSeek防撤回
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  监控并替换DeepSeek聊天中被撤回的内容。
// @author       AI
// @match        https://chat.deepseek.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552381/DeepSeek%E9%98%B2%E6%92%A4%E5%9B%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/552381/DeepSeek%E9%98%B2%E6%92%A4%E5%9B%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    // 脚本是否启用，默认为true
    let isEnabled = GM_getValue('enabled', true);
    // 用于存储菜单命令的ID，方便更新
    let menuCommandId;

    // --- 核心逻辑 (源自 content.js) ---

    // 全局缓存对象，记录 div 的内容
    let cachedContent = new Map();

    /**
     * 移除 HTML 中的所有 SVG 标签
     * @param {string} htmlContent
     * @returns {string} 处理后的 HTML
     */
    function removeSVG(htmlContent) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;

      // 移除所有 <svg> 元素
      const svgs = tempDiv.querySelectorAll("svg");
      svgs.forEach((svg) => svg.remove());

      return tempDiv.innerHTML;
    }

    function monitorContent() {
      // console.log("[监控] 开始检查内容变化..."); // 频繁打印会造成干扰，默认关闭

      // 警告：这个XPath非常依赖页面结构，如果DeepSeek网站更新布局，这里可能需要调整
      // 这是最可能失效的地方
      const container = document.evaluate(
        '//*[@id="root"]/div/div/div[2]/div[3]/div/div[2]/div/div[2]/div[1]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      if (container) {
        // 获取所有子 div (即聊天消息)
        const divs = container.querySelectorAll(":scope > div");
        // 从后往前找到最后一个偶数位的 div，这通常是 AI 的最新回复
        const lastEvenDiv = Array.from(divs).reverse().find((div, index) => (divs.length - index) % 2 === 0);

        if (lastEvenDiv) {
          // 获取当前 div 的完整 HTML 内容，并移除 SVG 以免影响比较
          const newContent = removeSVG(lastEvenDiv.innerHTML);

          // 如果缓存中不存在该 div，则初始化缓存
          if (!cachedContent.has(lastEvenDiv)) {
            cachedContent.set(lastEvenDiv, newContent);
          } else if (newContent !== cachedContent.get(lastEvenDiv)) {
            // 内容发生变化
            // 检查是否包含撤回关键词
            if (newContent.includes("这个问题我暂时无法回答") || newContent.includes("我还没学会这个问题") ||newContent.includes("我还没有学会如何思考这类问题") ||  newContent.includes("让我们换个话题再聊聊吧")) {
              console.log("[防撤回] 检测到撤回关键词，恢复缓存内容。");

              // 替换为缓存内容，并附加撤回标记
              lastEvenDiv.innerHTML =
                cachedContent.get(lastEvenDiv) + `<div style="color: red; font-size: 12px; margin-top: 8px;">（该回复已被AI撤回）</div>`;
            } else {
              // 更新缓存内容
              cachedContent.set(lastEvenDiv, newContent);
              // console.log("[缓存] 更新内容:", newContent); // 默认关闭
            }
          }
        }
      }
    }

    // --- 油猴菜单和启动逻辑 ---

    function toggleEnabled() {
        isEnabled = !isEnabled;
        GM_setValue('enabled', isEnabled);
        alert(`防撤回功能已${isEnabled ? '启用' : '禁用'}。\n请刷新页面以应用更改。`);
        registerMenuCommand(); // 重新注册菜单项以更新文本
    }

    function registerMenuCommand() {
        // 如果已存在菜单命令，先注销
        if (menuCommandId) {
            GM_unregisterMenuCommand(menuCommandId);
        }
        const commandText = isEnabled ? '❌ 禁用防撤回' : '✅ 启用防撤回';
        menuCommandId = GM_registerMenuCommand(commandText, toggleEnabled);
    }

    // 主程序入口
    function main() {
        console.log("DeepSeek防撤回脚本已加载");
        registerMenuCommand(); // 注册切换菜单

        if (isEnabled) {
            console.log("[防撤回] 功能已启用，开始监控内容。");
            setInterval(monitorContent, 1000); // 每秒检查一次
        } else {
            console.log("[防撤回] 功能未启用，不进行监控。");
        }
    }

    // 启动主程序
    main();

})();