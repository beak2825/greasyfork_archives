// ==UserScript==
// @name         Gemini TOC (Table of Contents)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add a floating TOC for Gemini conversations
// @author       You
// @match        https://gemini.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548325/Gemini%20TOC%20%28Table%20of%20Contents%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548325/Gemini%20TOC%20%28Table%20of%20Contents%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 创建TOC容器
  function createTOC() {
    const toc = document.createElement("div");
    toc.id = "gemini-toc";
    toc.style.cssText = `
            position: fixed;
            top: 180px;
            right: 2px;
            width: 250px;
            max-height: 70vh;
            background: rgba(255, 255, 255, 0.6);
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 8px;
            z-index: 10000;
            opacity: 0.1;
            transition: opacity 0.3s ease;
            overflow-y: auto;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

    // 添加标题
    const title = document.createElement("h3");
    title.textContent = "TOC";
    title.style.cssText = `
            margin: 0 0 6px 0;
            font-size: 11px;
            color: #666;
            text-align: center;
            border-bottom: 1px solid #eee;
            padding-bottom: 4px;
            font-weight: 500;
        `;
    toc.appendChild(title);

    // 添加鼠标悬停效果
    toc.addEventListener("mouseenter", () => {
      toc.style.opacity = "1.0";
    });
    toc.addEventListener("mouseleave", () => {
      toc.style.opacity = "0.3";
    });

    document.body.appendChild(toc);
    return toc;
  }

  // 截取文本并添加省略号
  function truncateText(text, maxLength = 30) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  }

  // 查找用户提问元素
  function findUserPrompts() {
    const prompts = [];

    // 首先尝试查找带有 class="query-text-line" 的 p 标签
    let queryTextElements = document.querySelectorAll(
      "p.query-text-line.ng-star-inserted"
    );

    // if (queryTextElements.length === 0) {
    //   queryTextElements = document.querySelectorAll('p[class*="query-text"]');
    // }

    if (queryTextElements.length > 0) {
      const processedElements = new Set();

      queryTextElements.forEach((element) => {
        // 如果这个元素已经被处理过，跳过
        if (processedElements.has(element)) {
          return;
        }

        const text = element.textContent.trim();
        if (text && text.length > 0) {
          // 查找连续的兄弟节点并合并文本
          const mergedText = [];
          const elementsGroup = [element];
          let currentElement = element;

          // 添加当前元素的文本
          mergedText.push(text);
          processedElements.add(element);

          // 向后查找连续的兄弟节点
          let nextSibling = currentElement.nextElementSibling;
          while (
            nextSibling &&
            nextSibling.matches("p.query-text-line.ng-star-inserted")
          ) {
            const siblingText = nextSibling.textContent.trim();
            if (siblingText && siblingText.length > 0) {
              mergedText.push(siblingText);
              elementsGroup.push(nextSibling);
              processedElements.add(nextSibling);
            }
            nextSibling = nextSibling.nextElementSibling;
          }

          // 向前查找连续的兄弟节点（以防顺序不同）
          let prevSibling = currentElement.previousElementSibling;
          while (
            prevSibling &&
            prevSibling.matches("p.query-text-line.ng-star-inserted") &&
            !processedElements.has(prevSibling)
          ) {
            const siblingText = prevSibling.textContent.trim();
            if (siblingText && siblingText.length > 0) {
              mergedText.unshift(siblingText);
              elementsGroup.unshift(prevSibling);
              processedElements.add(prevSibling);
            }
            prevSibling = prevSibling.previousElementSibling;
          }

          // 将合并的文本和第一个元素添加到prompts中
          prompts.push({
            element: elementsGroup[0], // 使用第一个元素作为跳转目标
            text: mergedText.join(" "), // 用空格连接所有文本
            elementsGroup: elementsGroup, // 保存所有相关元素，以备将来使用
          });
        }
      });
      return prompts;
    }

    // // 尝试多种选择器来找到用户输入
    // const selectors = [
    //   '[data-message-author-role="user"]',
    //   ".user-message",
    //   '[role="user"]',
    //   ".message.user",
    //   'div[data-test-id*="user"]',
    //   'div[data-test-id*="prompt"]',
    //   ".prompt-content",
    //   ".user-input",
    //   '[class*="user"][class*="message"]',
    // ];

    // for (const selector of selectors) {
    //   const elements = document.querySelectorAll(selector);
    //   if (elements.length > 0) {
    //     elements.forEach((element) => {
    //       const text = element.textContent.trim();
    //       if (text && text.length > 0) {
    //         prompts.push({
    //           element: element,
    //           text: text,
    //         });
    //       }
    //     });
    //     break;
    //   }
    // }

    // // 如果上述选择器都没找到，尝试通过文本内容和位置来识别
    // if (prompts.length === 0) {
    //   // 尝试查找所有可能包含用户输入的元素
    //   const allElements = document.querySelectorAll("p, div, span");

    //   allElements.forEach((element) => {
    //     const text = element.textContent.trim();
    //     // 简单启发式：查找可能是用户输入的元素
    //     if (
    //       text &&
    //       text.length > 10 &&
    //       text.length < 1000 &&
    //       !text.includes("Gemini") &&
    //       !text.includes("Google") &&
    //       !text.includes("AI") &&
    //       element.children.length === 0
    //     ) {
    //       // 检查是否在对话容器中或者有相关的类名
    //       const parent = element.closest(
    //         '[role="main"], .conversation, .chat, main'
    //       );
    //       const hasUserClass =
    //         element.className &&
    //         (element.className.includes("user") ||
    //           element.className.includes("prompt") ||
    //           element.className.includes("query"));

    //       if (parent || hasUserClass) {
    //         prompts.push({
    //           element: element,
    //           text: text,
    //         });
    //       }
    //     }
    //   });
    // }

    return prompts;
  }

  // 更新TOC内容
  function updateTOC(tocContainer) {
    const prompts = findUserPrompts();

    // 清除现有内容（保留标题）
    const title = tocContainer.querySelector("h3");
    // 使用安全的DOM操作替代innerHTML
    while (tocContainer.firstChild) {
      tocContainer.removeChild(tocContainer.firstChild);
    }
    tocContainer.appendChild(title);

    if (prompts.length === 0) {
      const noContent = document.createElement("div");
      noContent.textContent = "暂无对话内容";
      noContent.style.cssText = `
                color: #999;
                font-style: italic;
                text-align: center;
                padding: 15px 0;
            `;
      tocContainer.appendChild(noContent);
      return;
    }

    // 创建TOC条目
    prompts.forEach((prompt, index) => {
      const item = document.createElement("div");
      item.className = "toc-item";
      item.style.cssText = `
                padding: 6px 8px;
                margin: 2px 0;
                background: rgba(240, 240, 240, 0.5);
                border-radius: 3px;
                cursor: pointer;
                transition: background-color 0.2s ease;
                font-size: 12px;
                line-height: 1.3;
                border-left: 2px solid #4285f4;
            `;

      // 添加序号和文本
      const itemText = document.createElement("span");
      itemText.textContent = `${index + 1}. ${truncateText(prompt.text, 25)}`;
      item.appendChild(itemText);

      // 添加悬停效果
      item.addEventListener("mouseenter", () => {
        item.style.backgroundColor = "rgba(66, 133, 244, 0.1)";
      });
      item.addEventListener("mouseleave", () => {
        item.style.backgroundColor = "rgba(240, 240, 240, 0.5)";
      });

      // 添加点击跳转功能
      item.addEventListener("click", () => {
        prompt.element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // 高亮目标元素
        prompt.element.style.transition = "background-color 0.5s ease";
        const originalBg = prompt.element.style.backgroundColor;
        prompt.element.style.backgroundColor = "rgba(66, 133, 244, 0.2)";

        setTimeout(() => {
          prompt.element.style.backgroundColor = originalBg;
        }, 2000);
      });

      tocContainer.appendChild(item);
    });
  }

  // 初始化
  function init() {
    // 等待页面加载完成
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
      return;
    }

    // 创建TOC
    const tocContainer = createTOC();

    // 初始更新
    setTimeout(() => {
      updateTOC(tocContainer);
    }, 500);

    // 监听DOM变化以自动更新TOC
    const observer = new MutationObserver(() => {
      // 防抖：延迟更新以避免频繁刷新
      clearTimeout(window.tocUpdateTimeout);
      window.tocUpdateTimeout = setTimeout(() => {
        updateTOC(tocContainer);
      }, 500);
    });

    // 开始观察
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    });
  }

  // 启动脚本
  init();
})();
